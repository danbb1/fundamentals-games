import getCanvasSize from "./utils/getCanvasSize"
import Board from "./zombies/board"

const setScore = _game => {
  const scoreEl = document.getElementById("entities")

  scoreEl.textContent = `Zombies: ${_game.zombies.length} Humans: ${_game.humans.length}`
}

const draw = (context, _game) => {
  _game.setContext(context)
  _game.newGame()
  setScore(_game)
}

const handleNewGame = _game => {
  _game.newGame()
  setScore(_game)
}

const handleClick = (event, _canvas, _game) => {
  const rect = _canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  _game.handleClick(x, y)
  setScore(_game)
}

const handleRadioSelect = (event, _game) => {
  _game.setAdding(event.target.value)
}

const handleMoveHumans = _game => {
  _game.moveHumans()
  setScore(_game)
}

const handleMoveZombies = _game => {
  _game.moveZombies()
  setScore(_game)
}

const handleResize = (_context, _game) => {
  const newSize = getCanvasSize("canvasWrapper")

  _game.setSize(newSize.width)
}

const main = () => {
  const size = getCanvasSize("canvasWrapper")
  const canvas = document.getElementById("zombiesCanvas")

  if (canvas) {
    const game = new Board(size.width, 20, 20)

    canvas.height = size.width
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

    window.addEventListener("resize", () => handleResize(context, game))
  }
}

window.addEventListener("load", main)
