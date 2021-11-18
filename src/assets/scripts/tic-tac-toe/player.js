/* eslint-disable class-methods-use-this */
class Player {
  constructor() {
    this.minimaxScores = {
      X: -100,
      Draw: 0,
      O: 100,
    }
    this.monteCarloScores = {
      current: 1.0,
      other: 1.0,
    }
    this.monteCarloTrials = 1000
    this.moves = new Map()
    this.strategy = "minimax"
  }

  setStrategy(strategy) {
    this.strategy = strategy
  }

  score(board, depth) {
    const result = board.result()

    return (
      this.minimaxScores[result] + depth * (-this.minimaxScores[result] / 100)
    )
  }

  getBestMoveMinMax(board, maxi = true, depth = 0) {
    if (depth === 0) this.moves.clear()

    if (board.result()) return this.score(board, depth)

    const availableMoves = board.getEmptySquares()

    let best = maxi ? -100 : 100

    availableMoves.forEach(move => {
      const clonedGame = board.clone()

      clonedGame.handleMove(move[0], move[1])
      const value = this.getBestMoveMinMax(clonedGame, !maxi, depth + 1)

      best = maxi ? Math.max(best, value) : Math.min(best, value)

      if (depth === 0) {
        const newMoves = this.moves.has(value)
          ? [...this.moves.get(value), move]
          : [move]
        this.moves.set(value, newMoves)
      }
    })
    if (depth === 0) {
      return this.moves.get(best).length > 1
        ? this.moves.get(best)[
            Math.floor(Math.random() * this.moves.get(best).length)
          ]
        : this.moves.get(best)[0]
    }

    return best
  }

  getBestMoveMonteCarlo(board) {
    let scores = [...Array(3)].map(() => Array(3).fill(0))

    for (let i = 0; i < this.monteCarloTrials; i += 1) {
      const clonedBoard = board.clone()
      const completedBoard = this.mcTrial(clonedBoard)
      scores = this.mcScoreBoard(scores, completedBoard)
    }

    return this.calcBestMonteCarloMove(board, scores)
  }

  calcBestMonteCarloMove(board, scores) {
    const availableMoves = board.getEmptySquares()
    let maxMoves = []
    let maxValue = 0

    availableMoves.forEach(move => {
      if (maxMoves.length === 0) {
        maxMoves.push(move)
        maxValue = scores[move[0]][move[1]]
      }
      if (scores[move[0]][move[1]] < maxValue) return
      if (scores[move[0]][move[1]] > maxValue) {
        maxMoves = [move]
        maxValue = scores[move[0]][move[1]]
      } else {
        maxMoves.push(move)
      }
    })

    return maxMoves[Math.floor(Math.random() * maxMoves.length)]
  }

  mcTrial(board) {
    const newBoard = board.clone()
    while (!newBoard.result()) {
      const availableMoves = newBoard.getEmptySquares()
      const nextMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)]
      newBoard.handleMove(nextMove[0], nextMove[1])
    }

    return newBoard
  }

  mcScoreBoard(scores, board) {
    const result = board.result()
    if (result === "Draw") return scores

    const newScores = JSON.parse(JSON.stringify(scores))

    board.state.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (!col) return

        if (col === result) {
          newScores[rowIndex][colIndex] +=
            col === "O"
              ? this.monteCarloScores.current
              : this.monteCarloScores.other
        } else {
          newScores[rowIndex][colIndex] -=
            col === "O"
              ? this.monteCarloScores.current
              : this.monteCarloScores.other
        }
      })
    })

    return newScores
  }
}

export default Player
