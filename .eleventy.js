const htmlmin = require("html-minifier")

module.exports = config => {
  config.setUseGitIgnore(false)

  if (process.env.NODE_ENV === "production") {
    config.addTransform("htmlmin", (content, outputPath) => {
      if (outputPath && outputPath.endsWith(".html")) {
        const minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
        })

        return minified
      }

      return content
    })
  }

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  }
}
