---
title: "Tic Tac Toe"
layout: "layouts/game.html"
heading: "Tic Tac Toe"
canvasId: "ticTacToeCanvas"
scripts: ["ticTacToe.js"]
newGameId: "ticTacToeNewGame"
gameButtons: [
  {
    "label": "MiniMax",
    "id": "setMinimaxButton"
  },
  {
    "label": "Monte Carlo",
    "id": "setMonteCarloButton"
  }
]
gameLabels: [
  {
    "id": "strategyLabel"
  }
]
---
Classic tic-tac-toe with a computer player that can play with two strategies:

- Mini-Max
- Monte Carlo

Mini-Max uses Depth First Search to progress through turns, alternating a minimizing/maximizing strategy until the game is finished. It then scores each move and chooses the best possible move. In tic-tac-toe, it is impossible to beat!

Monte Carlo uses a set number of trials (default to 1000) and plays the game choosing random moves that many times. It then scores the board based on the outcome of the trial, picking the best move from the final scored board after all trials have completed. Above a certain number of trials, it is also hard to beat!