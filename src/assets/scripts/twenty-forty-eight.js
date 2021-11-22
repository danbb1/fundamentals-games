import getCanvasSize from "./utils/getCanvasSize"
import Board from "./twenty-forty-eight/board"

let touchStartX
let touchStartY
let swipeDist
let elapsedTime
let startTime
// Min values for swipe to register
const swipeThreshold = 50
const allowedTime = 500

const setScore = _game => {
  const scoreEl = document.getElementById("score")

  scoreEl.textContent = `Score: ${_game.score} Best: ${_game.best}`
}

const draw = (context, _game) => {
  _game.setContext(context)
  _game.newGame()
  setScore(_game)
}

const setResult = _result => {
  const result = document.getElementById("result")
  if (_result === "LOST") {
    result.textContent = "You lose."
  } else {
    result.textContent = ""
  }
}

const handleNewGame = _game => {
  _game.newGame()
  setScore(_game)
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

  setScore(_game)
  if (_game.result === "LOST") setResult("LOST")
}

const handleResize = (_context, _game) => {
  const newSize = getCanvasSize("canvasWrapper")

  _game.setSize(newSize.width)
}

const handleSwipe = _game => {
  if (elapsedTime > allowedTime) return

  const plane =
    Math.abs(swipeDist.x) > Math.abs(swipeDist.y) ? "HORIZONTAL" : "VERTICAL"

  if (plane === "VERTICAL") {
    if (Math.abs(swipeDist.y) < swipeThreshold) return
    if (swipeDist.y > 0) {
      _game.handleMove("DOWN")
    } else {
      _game.handleMove("UP")
    }
  } else {
    if (Math.abs(swipeDist.x) < swipeThreshold) return
    if (swipeDist.x > 0) {
      _game.handleMove("RIGHT")
    } else {
      _game.handleMove("LEFT")
    }
  }
  setScore(_game)
  if (_game.result === "LOST") setResult("LOST")
}

const handleTouchStart = event => {
  swipeDist = { x: 0, y: 0 }
  touchStartX = event.changedTouches[0].clientX
  touchStartY = event.changedTouches[0].clientY
  startTime = new Date().getTime()
  event.preventDefault()
}

const handleTouchEnd = (event, _game) => {
  swipeDist = {
    x: event.changedTouches[0].clientX - touchStartX,
    y: event.changedTouches[0].clientY - touchStartY,
  }
  elapsedTime = new Date().getTime() - startTime
  event.preventDefault()
  handleSwipe(_game)
}

const main = () => {
  const size = getCanvasSize("canvasWrapper")
  const canvas = document.getElementById("twentyFortyEightCanvas")

  if (canvas) {
    const game = new Board(size.width, 4, 4)

    canvas.height = size.width
    canvas.width = size.width

    const context = canvas.getContext("2d")

    draw(context, game)

    document.addEventListener("keydown", event => handleKeyPress(event, game))

    document
      .getElementById("twentyFortyEightNewGame")
      .addEventListener("click", () => handleNewGame(game))

    window.addEventListener("resize", () => handleResize(context, game))

    canvas.addEventListener("touchstart", handleTouchStart)

    canvas.addEventListener("touchmove", e => e.preventDefault())

    canvas.addEventListener("touchend", event => handleTouchEnd(event, game))
  }
}

window.addEventListener("load", main)
