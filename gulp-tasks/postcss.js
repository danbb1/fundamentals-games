const { dest, src } = require("gulp")
const postcss = require("gulp-postcss")
const autoprefixer = require("autoprefixer")
const cssnano = require("cssnano")
const postcssImport = require("postcss-import")
const postcssExtend = require("postcss-extend-rule")
const postcssNesting = require("postcss-nesting")
const postcssCustomMedia = require("postcss-custom-media")
const postcssHexRgba = require("postcss-hexrgba")

const isProduction = process.env.NODE_ENV === "production"

const criticalStyles = ["critical.css"]

// Takes the arguments passed by `dest` and determines where the output file goes
const calculateOutput = ({ history }) => {
  // By default, we want a CSS file in our dist directory, so the
  // HTML can grab it with a <link />
  let response = "./dist/css"

  // Get everything after the last slash
  const sourceFileName = /[^/]*$/.exec(history[0])[0]

  // If this is critical CSS though, we want it to go
  // to the _includes directory, so nunjucks can include it
  // directly in a <style>
  if (criticalStyles.includes(sourceFileName)) {
    response = "./src/_includes/css"
  }

  return response
}

const plugins = [
  postcssImport(),
  postcssNesting(),
  postcssExtend(),
  postcssCustomMedia(),
  postcssHexRgba(),
  autoprefixer(),
  cssnano(),
]

const css = async () => {
  src("./src/assets/style/*.css")
    .pipe(postcss(plugins))
    .pipe(dest(calculateOutput, { sourceMaps: !isProduction }))
}

module.exports = css
