const { dest, src } = require("gulp")
const webpack = require("webpack-stream")
const babel = require("gulp-babel")
const terser = require("gulp-terser")

const isProduction = process.env.NODE_ENV === "production"

// // Takes the arguments passed by `dest` and determines where the output file goes
// const calculateOutput = ({ history }) => {
//   // By default, we want a JS file in our dist directory, so the
//   // HTML can grab it with a <link />
//   let response = "./dist/js"

//   // Get everything after the last slash
//   const sourceFileName = /[^/]*$/.exec(history[0])[0]

//   // If this is critical JS though, we want it to go
//   // to the _includes directory, so nunjucks can include it
//   // directly in a <script>
//   if (criticalScripts.includes(sourceFileName)) {
//     response = "./src/_includes/js"
//   }

//   return response
// }

const scripts = async () => {
  src("./src/assets/scripts/*.js")
    .pipe(
      webpack({
        mode: isProduction ? "production" : "development",
        entry: {
          main: "./src/assets/scripts/main.js",
          ticTacToe: "./src/assets/scripts/tic-tac-toe.js",
          twentyFortyEight: "./src/assets/scripts/twenty-forty-eight.js",
          zombies: "./src/assets/scripts/zombies.js",
        },
        output: {
          filename: "[name].js",
        },
      })
    )
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(terser())
    .pipe(dest("./dist/js", { sourceMaps: !isProduction }))
}

module.exports = scripts
