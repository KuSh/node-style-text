// `String.cooked` https://github.com/tc39/proposal-string-cooked
const stringCooked = (raw, ...substitutions) =>
  String.raw({raw}, ...substitutions)

// `Reflect.isTemplateObject` https://github.com/tc39/proposal-array-is-template-object
const reflectIsTemplateObject = (value) => Array.isArray(value) && value.raw

const factory = (styleText, options, ...formats) =>
  new Proxy(
    (textOrTemplateObject, ...substitutions) =>
      styleText(
        formats,
        reflectIsTemplateObject(textOrTemplateObject)
          ? stringCooked(textOrTemplateObject, substitutions)
          : textOrTemplateObject,
        options,
      ),
    {get: (_, format) => factory(styleText, options, ...formats, format)},
  )

export {factory}
