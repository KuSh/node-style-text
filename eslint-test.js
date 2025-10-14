import {RuleTester} from 'eslint'
import {outdent} from 'outdent'
import eslintConfig from './eslint-config.js'
import packageJson from './package.json' with {type: 'json'}

const packageName = packageJson.name

const test = (ruleId, tests) => {
  new RuleTester().run(
    ruleId,
    eslintConfig.plugins[packageName].rules[ruleId],
    tests,
  )
}

test('prefer-tagged-templates', {
  valid: [
    outdent`
      import styleText from 'not-${packageName}'
      styleText.red(\`foo\`)
    `,
    outdent`
      import styleText from '${packageName}'
      styleText.red?.(\`foo\`)
    `,
    outdent`
      import styleText from '${packageName}'
      styleText?.red(\`foo\`)
    `,
    outdent`
      import styleText from '${packageName}'
      styleText.red('foo')
    `,
    outdent`
      import styleText from '${packageName}'
      styleText.red\`foo\${bar}\`
    `,
  ],
  invalid: [
    {
      code: outdent`
        import styleText from '${packageName}'
        styleText.red(\`foo\`)
      `,
      output: outdent`
        import styleText from '${packageName}'
        styleText.red\`foo\`
      `,
      errors: 1,
    },
    {
      code: outdent`
        import defaultExport, {stdout as stdoutExport, stderr as stderrExport} from '${packageName}'
        defaultExport.red(\`foo\`)
        stdoutExport.red.underline(\`foo\`)
        stderrExport.red.underline(\`foo\`)
      `,
      output: outdent`
        import defaultExport, {stdout as stdoutExport, stderr as stderrExport} from '${packageName}'
        defaultExport.red\`foo\`
        stdoutExport.red.underline\`foo\`
        stderrExport.red.underline\`foo\`
      `,
      errors: 3,
    },
    {
      code: outdent`
        import styleText from '${packageName}'
        styleText.red(\`foo\`,)
      `,
      output: outdent`
        import styleText from '${packageName}'
        styleText.red\`foo\`
      `,
      errors: 1,
    },
    {
      code: outdent`
        import styleText from '${packageName}'
        styleText.red((\`foo\`))
      `,
      output: null,
      errors: 1,
    },
  ],
})
