const GetGoogleFonts = require("get-google-fonts")

const fonts = async () => {
  // Setup of the library instance by setting where we want
  // the output to go. CSS is relative to output font directory
  const instance = new GetGoogleFonts({
    outputDir: "./dist/fonts",
    cssFile: "./fonts.css",
  })

  const url = GetGoogleFonts.constructUrl(
    {
      "Open Sans": [400, 700],
    },
    ["latin"]
  )

  // Grabs fonts and CSS from google and puts in the dist folder
  const result = await instance.download(`${url}&display=swap`)

  return result
}

module.exports = fonts
