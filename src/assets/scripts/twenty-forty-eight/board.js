/* eslint-disable class-methods-use-this */
class Board {
  constructor(size, rows, cols, state = null) {
    this.state = state || [...Array(rows)].map(() => Array(cols).fill(null))
    this.size = size
    this.tileSize = {
      width: size.width / cols,
      height: size.height / rows,
    }
    this.rows = rows
    this.cols = cols
    this.directions = {
      UP: [1, 0],
      DOWN: [-1, 0],
      LEFT: [0, 1],
      RIGHT: [0, -1],
    }
    this.initialTiles = {
      UP: [...Array(cols)].map((val, index) => [0, index]),
      DOWN: [...Array(cols)].map((val, index) => [rows - 1, index]),
      RIGHT: [...Array(rows)].map((val, index) => [index, cols - 1]),
      LEFT: [...Array(rows)].map((val, index) => [index, 0]),
    }
    this.colors = {
      2: "#abdee6",
      4: "#cbaacb",
      8: "#ffffb5",
      16: "#ffccb6",
      32: "#f3b0c3",
      64: "#c6dbda",
      128: "#fee1e8",
      256: "#ff968a",
      512: "#97c1a9",
      1024: "#990f02",
      2048: "#dd571c",
    }
  }

  setContext(context) {
    this.context = context
  }

  checkResult() {
    return this.result
  }

  drawTiles() {
    this.state.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col) {
          this.context.fillStyle = this.colors[col]
          this.context.fillRect(
            colIndex * this.tileSize.width + 10,
            rowIndex * this.tileSize.height + 10,
            this.tileSize.width - 20,
            this.tileSize.height - 20
          )
          this.context.font = "32px Arial"
          this.context.fillStyle = "#000000"
          this.context.textAlign = "center"
          this.context.fillText(
            `${col}`,
            colIndex * this.tileSize.width + this.tileSize.width / 2 - 5,
            rowIndex * this.tileSize.height + this.tileSize.height / 2 + 10
          )
        }
      })
    })
  }

  drawBoard() {
    this.context.fillStyle = "#ffe5d4"
    this.context.fillRect(0, 0, this.size.width, this.size.height)
    this.context.strokeStyle = "#ffffff"
    this.context.beginPath()
    for (let i = 0; i < this.rows; i += 1) {
      this.context.moveTo(0, i * 1 * (this.size.height / this.rows))
      this.context.lineTo(
        this.size.width,
        i * 1 * (this.size.height / this.rows)
      )
      this.context.closePath()
      this.context.stroke()
    }
    for (let i = 0; i < this.cols; i += 1) {
      this.context.moveTo(i * 1 * (this.size.width / this.cols), 0)
      this.context.lineTo(
        i * 1 * (this.size.width / this.cols),
        this.size.height
      )
      this.context.closePath()
      this.context.stroke()
    }
  }

  shiftLine(line) {
    const shifted = [...Array(line.length).fill(0)]
    let nonZeroValues = 0

    line.forEach(value => {
      if (value > 0) {
        shifted[nonZeroValues] = value
        nonZeroValues += 1
      }
    })

    return shifted
  }

  mergeLine(line) {
    const shiftedLine = this.shiftLine(line)

    shiftedLine.forEach((value, index) => {
      const nextValue =
        index + 1 < shiftedLine.length ? shiftedLine[index + 1] : null

      if (nextValue && value === nextValue) {
        shiftedLine[index] *= 2
        shiftedLine[index + 1] = 0
      }
    })

    return this.shiftLine(shiftedLine)
  }

  traverseGrid(startCell, direction) {
    const tempValues = []

    const steps =
      direction === "UP" || direction === "DOWN" ? this.rows : this.cols

    for (let i = 0; i < steps; i += 1) {
      const row = startCell[0] + i * this.directions[direction][0]
      const col = startCell[1] + i * this.directions[direction][1]
      tempValues.push(this.state[row][col])
    }

    const merged = this.mergeLine(tempValues)

    let hasChanged = 0

    for (let i = 0; i < steps; i += 1) {
      const row = startCell[0] + i * this.directions[direction][0]
      const col = startCell[1] + i * this.directions[direction][1]
      if (merged[i] !== this.state[row][col]) {
        hasChanged += 1
      }
      this.state[row][col] = merged[i]
    }

    return hasChanged
  }

  handleMove(direction) {
    const initialTiles = this.initialTiles[direction]
    let rowsAbleToMove = 0

    initialTiles.forEach(tile => {
      const movedRows = this.traverseGrid(tile, direction)

      rowsAbleToMove = movedRows > 0 ? rowsAbleToMove + 1 : rowsAbleToMove
    })

    if (rowsAbleToMove > 0) this.newTile()

    this.context.clearRect(0, 0, this.size, this.size)
    this.drawBoard()
    this.drawTiles()
  }

  newGame() {
    this.result = null
    this.state = [...Array(this.rows)].map(() => Array(this.cols).fill(null))
    this.context.clearRect(0, 0, this.size, this.size)
    this.newTile()
    this.newTile()
    this.drawBoard()
    this.drawTiles()
  }

  getEmptyCells() {
    const emptySquares = []

    this.state.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col) return
        emptySquares.push([rowIndex, colIndex])
      })
    })

    return emptySquares
  }

  newTile() {
    const numberChoices = [...Array(9).fill(2), 4]

    const emptyCells = this.getEmptyCells()

    const cellToChange =
      emptyCells[Math.floor(Math.random() * emptyCells.length)]

    this.state[cellToChange[0]][cellToChange[1]] =
      numberChoices[Math.floor(Math.random() * numberChoices.length)]
  }
}

export default Board
