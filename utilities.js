// `String.cooked` https://github.com/tc39/proposal-string-cooked
const stringCooked = (raw, ...substitutions) =>
  String.raw({raw}, ...substitutions)

// `Reflect.isTemplateObject` https://github.com/tc39/proposal-array-is-template-object
const reflectIsTemplateObject = (value) => Array.isArray(value) && value.raw

function runStyleText(
  styleText,
  options,
  formats,
  textOrTemplateObject,
  ...substitutions
) {
  const text = reflectIsTemplateObject(textOrTemplateObject)
    ? stringCooked(textOrTemplateObject, substitutions)
    : textOrTemplateObject
  return styleText(formats, text, options)
}

const factory = (styleText, options, ...formats) =>
  new Proxy(runStyleText.bind(styleText, styleText, options, formats), {
    get: (_, format) => factory(styleText, options, ...formats, format),
  })

export {factory}
