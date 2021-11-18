const { parallel, watch } = require("gulp")

const fonts = require("./gulp-tasks/fonts")
const css = require("./gulp-tasks/postcss")
const scripts = require("./gulp-tasks/scripts")

// Set each directory and contents that we want to watch and
// assign the relevant task. `ignoreInitial` set to true will
// prevent the task being run when we run `gulp watch`, but it
// will run when a file changes.
const watcher = () => {
  watch("./src/assets/style/**/*.css", { ignoreInitial: true }, css)
  watch("./src/assets/scripts/**/*.js", { ignoreInitial: true }, scripts)
}

// The default (if someone just runs `gulp`) is to run each task in parrallel
exports.default = parallel(fonts, css, scripts)

// This is our watcher task that instructs gulp to watch directories and
// act accordingly
exports.watch = watcher
