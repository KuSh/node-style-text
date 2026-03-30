import packageJson from './package.json' with {type: 'json'}

const {name, version} = packageJson

function getProblem(node, context) {
  let {parent} = node
  while (
    parent.type === 'MemberExpression' &&
    !parent.optional &&
    parent.object === node
  ) {
    node = parent
    parent = node.parent
  }

  const {parent: callExpression} = node
  if (
    !(
      callExpression.type === 'CallExpression' &&
      !callExpression.optional &&
      callExpression.callee === node &&
      callExpression.arguments.length === 1 &&
      callExpression.arguments[0].type === 'TemplateLiteral'
    )
  ) {
    return
  }

  const {sourceCode} = context
  const {callee} = callExpression

  const openingParenthesisToken = sourceCode.getTokenAfter(
    callee,
    ({type, value}) => type === 'Punctuator' && value === '(',
  )

  const problem = {
    node: openingParenthesisToken,
    message: 'Prefer using tagged templates.',
  }
  const tokensToRemove = [openingParenthesisToken]
  const closingParenthesisToken = sourceCode.getLastToken(callExpression)
  let tokenBefore = sourceCode.getTokenBefore(closingParenthesisToken)

  // Trialing comma after the value
  if (tokenBefore.type === 'Punctuator' && tokenBefore.value === ',') {
    tokensToRemove.push(tokenBefore)
    tokenBefore = sourceCode.getTokenBefore(tokenBefore)
  }

  // Something after the value, can be `)` or something else
  if (tokenBefore.type !== 'Template') {
    return problem
  }

  tokensToRemove.push(closingParenthesisToken)
  return {
    ...problem,
    fix: (fixer) => tokensToRemove.map((token) => fixer.remove(token)),
  }
}

const plugin = {
  meta: {name, version},
  configs: {},
  rules: {
    'prefer-tagged-templates': {
      meta: {
        fixable: 'code',
      },
      create(context) {
        return {
          ImportDeclaration(importDeclaration) {
            if (
              !(
                importDeclaration.source.type === 'Literal' &&
                importDeclaration.source.value === name
              )
            ) {
              return
            }

            const identifiers = context.sourceCode
              .getDeclaredVariables(importDeclaration)
              .flatMap(({references}) => references)
              .map((reference) => reference.identifier)

            for (const problem of identifiers
              .map((identifier) => getProblem(identifier, context))
              .filter(Boolean)) {
              context.report(problem)
            }
          },
        }
      },
    },
  },
}

export const config = {
  name: `${name} eslint config`,
  plugins: {
    [name]: plugin,
  },
  rules: Object.fromEntries(
    Object.keys(plugin.rules).map((ruleId) => [`${name}/${ruleId}`, 'error']),
  ),
}

Object.assign(plugin.configs, {recommended: config})

export default plugin
