class Board {
  constructor(size, state = null, player = "X") {
    this.state = state || [...Array(3)].map(() => Array(3).fill(null))
    this.size = size
    this.squareSize = size / 3
    this.squares = this.setSquares()
    this.player = player
  }

  setContext(context) {
    this.context = context
  }

  setSquares() {
    const squares = []

    for (let row = 0; row < 3; row += 1) {
      squares.push([])
      for (let col = 0; col < 3; col += 1) {
        squares[row].push({
          minX: col * this.squareSize,
          maxX: col * this.squareSize + this.squareSize,
          minY: row * this.squareSize,
          maxY: row * this.squareSize + this.squareSize,
        })
      }
    }

    return squares
  }

  drawBoard() {
    this.context.beginPath()

    for (let i = 0; i < 2; i += 1) {
      this.context.moveTo((i + 1) * this.squareSize, 0)
      this.context.lineTo((i + 1) * this.squareSize, this.size)
      this.context.closePath()
      this.context.stroke()
      this.context.moveTo(0, (i + 1) * this.squareSize, 0)
      this.context.lineTo(this.size, (i + 1) * this.squareSize)
      this.context.closePath()
      this.context.stroke()
    }
  }

  drawX(row, col) {
    const { minX, maxX, minY, maxY } = this.squares[row][col]
    this.context.beginPath()
    this.context.moveTo(minX + this.squareSize / 4, minY + this.squareSize / 4)
    this.context.lineTo(maxX - this.squareSize / 4, maxY - this.squareSize / 4)
    this.context.closePath()
    this.context.stroke()
    this.context.beginPath()
    this.context.moveTo(maxX - this.squareSize / 4, minY + this.squareSize / 4)
    this.context.lineTo(minX + this.squareSize / 4, maxY - this.squareSize / 4)
    this.context.closePath()
    this.context.stroke()
  }

  drawO(row, col) {
    const { maxX, maxY } = this.squares[row][col]
    this.context.beginPath()
    this.context.arc(
      maxX - this.squareSize / 2,
      maxY - this.squareSize / 2,
      this.squareSize / 4,
      0,
      Math.PI * 2
    )
    this.context.closePath()
    this.context.stroke()
  }

  drawMoves() {
    this.state.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === "X") this.drawX(rowIndex, colIndex)
        if (col === "O") this.drawO(rowIndex, colIndex)
      })
    })
  }

  handleClick(x, y) {
    this.handleMove(
      Math.floor(y / this.squareSize),
      Math.floor(x / this.squareSize)
    )
  }

  handleMove(row, col) {
    if (this.state[row][col]) return

    this.state[row][col] = this.player
    this.nextPlayer()
  }

  nextPlayer() {
    if (this.player === "X") {
      this.player = "O"
    } else {
      this.player = "X"
    }
  }

  checkRows() {
    let winner = false

    this.state.forEach(row => {
      if (row.every(val => val && val === row[0])) {
        // eslint-disable-next-line prefer-destructuring
        winner = row[0]
      }
    })

    return winner || null
  }

  checkCols() {
    let winner = false
    const cols = []

    for (let i = 0; i < 3; i += 1) {
      const col = []
      for (let j = 0; j < 3; j += 1) {
        col.push(this.state[j][i])
      }
      cols.push(col)
    }

    cols.forEach(col => {
      if (col.every(val => val && val === col[0])) {
        // eslint-disable-next-line prefer-destructuring
        winner = col[0]
      }
    })

    return winner || null
  }

  checkDiagonal() {
    let winner = false
    const diagonals = []
    const startCell = [0, 0]

    const directions = {
      0: [1, 1],
      1: [-1, 1],
    }

    let direction = directions[0]

    for (let i = 0; i < 2; i += 1) {
      const diagonal = []
      for (let j = 0; j < 3; j += 1) {
        diagonal.push(this.state[startCell[0]][startCell[1]])
        startCell[0] += direction[0]
        startCell[1] += direction[1]
      }
      startCell[0] = 2
      startCell[1] = 0
      // eslint-disable-next-line prefer-destructuring
      direction = directions[1]
      diagonals.push(diagonal)
    }

    diagonals.forEach(diagonal => {
      if (diagonal.every(val => val && val === diagonal[0])) {
        // eslint-disable-next-line prefer-destructuring
        winner = diagonal[0]
      }
    })

    return winner || null
  }

  checkWin() {
    return this.checkRows() || this.checkCols() || this.checkDiagonal()
  }

  getEmptySquares() {
    const emptySquares = []

    this.state.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col) return
        emptySquares.push([rowIndex, colIndex])
      })
    })

    return emptySquares
  }

  result() {
    if (this.checkWin()) return this.checkWin()
    if (this.getEmptySquares().length === 0) return "Draw"

    return false
  }

  newGame() {
    this.state = [...Array(3)].map(() => Array(3).fill(null))
    this.player = "X"
    this.context.clearRect(0, 0, this.size, this.size)
    this.drawBoard()
  }

  clone() {
    return new Board(
      this.size,
      JSON.parse(JSON.stringify(this.state)),
      this.player
    )
  }
}

export default Board
