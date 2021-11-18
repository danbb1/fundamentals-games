import getCanvasSize from "./utils/getCanvasSize"
import Board from "./tic-tac-toe/board"
import Player from "./tic-tac-toe/player"

const draw = (context, game) => {
  game.setContext(context)
  game.drawBoard()
  game.drawMoves()
}

const setStrategy = (_player, _strategy) => {
  const strategyEl = document.getElementById("strategyLabel")

  _player.setStrategy(_strategy)

  strategyEl.textContent = `Current strategy is: ${_player.strategy}`
}

const setResult = _result => {
  const result = document.getElementById("result")
  if (_result === "") {
    result.textContent = _result
  } else {
    result.textContent = `${_result === "Draw" ? "Draw" : `${_result} wins!`}`
  }
}

const handleNewGame = _game => {
  _game.newGame()
  setResult("")
}

const compMove = (_player, _game) => {
  const move =
    _player.strategy === "minimax"
      ? _player.getBestMoveMinMax(_game)
      : _player.getBestMoveMonteCarlo(_game)
  _game.handleMove(move[0], move[1])
  _game.drawMoves()
  if (_game.result()) setResult(_game.result())
}

const handleClick = (event, _canvas, _game, _player) => {
  if (_game.result() || _game.player === "O") return
  const rect = _canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  _game.handleClick(x, y)
  _game.drawMoves()
  if (!_game.result()) {
    compMove(_player, _game)
  } else {
    setResult(_game.result())
  }
}

const main = () => {
  const size = getCanvasSize("canvasWrapper")
  const canvas = document.getElementById("ticTacToeCanvas")

  if (canvas) {
    const game = new Board(size.height)
    const player = new Player()

    canvas.height = size.height
    canvas.width = size.width

    setStrategy(player, "minimax")

    canvas.addEventListener("click", event =>
      handleClick(event, canvas, game, player)
    )
    canvas.addEventListener("dblclick", event => event.preventDefault())

    document
      .getElementById("ticTacToeNewGame")
      .addEventListener("click", () => handleNewGame(game))

    document
      .getElementById("setMinimaxButton")
      .addEventListener("click", () => setStrategy(player, "minimax"))

    document
      .getElementById("setMonteCarloButton")
      .addEventListener("click", () => setStrategy(player, "montecarlo"))

    const context = canvas.getContext("2d")

    draw(context, game)
  }
}

window.addEventListener("load", main)
