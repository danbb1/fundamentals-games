import getCanvasSize from "./utils/getCanvasSize"
import Board from "./twenty-forty-eight/board"

const draw = (context, _game) => {
  _game.setContext(context)
  _game.newGame()
}

const setResult = _result => {
  const result = document.getElementById("result")
  result.textContent = _result
}

const handleNewGame = _game => {
  _game.newGame()
  setResult("")
}

const handleKeyPress = (event, _game) => {
  if (event.which === 38) {
    event.preventDefault()
    _game.handleMove("UP")
  }
  if (event.which === 40) {
    event.preventDefault()
    _game.handleMove("DOWN")
  }
  if (event.which === 37) {
    event.preventDefault()
    _game.handleMove("LEFT")
  }
  if (event.which === 39) {
    event.preventDefault()
    _game.handleMove("RIGHT")
  }
}

const main = () => {
  const size = getCanvasSize("canvasWrapper")
  const canvas = document.getElementById("twentyFortyEightCanvas")

  if (canvas) {
    const game = new Board(size, 4, 4)

    canvas.height = size.height
    canvas.width = size.width

    document.addEventListener("keydown", event => handleKeyPress(event, game))

    document
      .getElementById("twentyFortyEightNewGame")
      .addEventListener("click", () => handleNewGame(game))

    const context = canvas.getContext("2d")

    draw(context, game)
  }
}

window.addEventListener("load", main)
