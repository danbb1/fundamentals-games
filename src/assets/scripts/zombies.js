import getCanvasSize from "./utils/getCanvasSize"
import Board from "./zombies/board"

const draw = (context, _game) => {
  _game.setContext(context)
  _game.newGame()
}

const handleNewGame = _game => {
  _game.newGame()
}

const handleClick = (event, _canvas, _game) => {
  const rect = _canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  _game.handleClick(x, y)
}

const handleRadioSelect = (event, _game) => {
  _game.setAdding(event.target.value)
}

const handleMoveHumans = _game => {
  _game.moveHumans()
}

const handleMoveZombies = _game => {
  _game.moveZombies()
}

const main = () => {
  const size = getCanvasSize("canvasWrapper")
  const canvas = document.getElementById("zombiesCanvas")

  if (canvas) {
    const game = new Board(size, 20, 20)

    canvas.height = size.height
    canvas.width = size.width

    canvas.addEventListener("click", event => handleClick(event, canvas, game))
    canvas.addEventListener("dblclick", event => event.preventDefault())

    document
      .getElementById("zombiesNewGame")
      .addEventListener("click", () => handleNewGame(game))

    const context = canvas.getContext("2d")

    draw(context, game)

    document
      .querySelectorAll('input[type=radio][name="zombie-radio"]')
      .forEach(input => {
        input.addEventListener("change", event =>
          handleRadioSelect(event, game)
        )
      })

    document
      .getElementById("moveZombiesButton")
      .addEventListener("click", () => handleMoveZombies(game))

    document
      .getElementById("moveHumansButton")
      .addEventListener("click", () => handleMoveHumans(game))
  }
}

window.addEventListener("load", main)
