class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\\/]+/g);
  }
}

module.exports = {
  content: ["src/**/*.vue"],
  extractors: [
    {
      extractor: TailwindExtractor,
      extensions: ["vue"]
    }
  ],
  whitelist: [
    "body",
    "html",
    "img",
    "a",
    "g-image",
    "g-image--lazy",
    "g-image--loaded"
  ]
};
