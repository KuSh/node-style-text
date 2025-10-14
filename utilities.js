const factory = (styleText, options, ...formats) =>
  new Proxy(
    (raw, ...substitutions) =>
      styleText(
        formats,
        raw.raw ? String.raw({raw}, ...substitutions) : raw,
        options,
      ),
    {get: (_, format) => factory(styleText, options, ...formats, format)},
  )

export {factory}
