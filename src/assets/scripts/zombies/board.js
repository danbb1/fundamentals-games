/* eslint-disable class-methods-use-this */
import Queue from "./queue"

class Board {
  constructor(size, rows, cols) {
    this.state = [...Array(rows)].map(() => Array(cols).fill(null))
    this.obstacles = []
    this.humans = []
    this.zombies = []
    this.size = size
    this.tileSize = {
      width: this.size / cols,
      height: this.size / rows,
    }
    this.rows = rows
    this.cols = cols
    this.colors = {
      HUMAN: "#00ff00",
      ZOMBIE: "#ff0000",
      OBSTACLE: "#000000",
    }
    this.adding = "obstacle"
  }

  setContext(context) {
    this.context = context
  }

  setSize(size) {
    this.context.canvas.width = size
    this.context.canvas.height = size
    this.size = size

    this.drawGame()
  }

  setAdding(entity) {
    this.adding = entity
  }

  handleClick(x, y) {
    if (!x || !y) return
    const cell = this.getCellFromClick(x, y)

    if (
      !cell ||
      this.state[cell[0]][cell[1]] === "ZOMBIE" ||
      this.state[cell[0]][cell[1]] === "OBSTACLE" ||
      this.state[cell[0]][cell[1]] === "HUMAN"
    )
      return
    if (this.adding === "obstacle") this.addObstacle(cell)
    if (this.adding === "zombie") this.addZombie(cell)
    if (this.adding === "human") this.addHuman(cell)

    this.drawTiles()
  }

  getCellFromClick(x, y) {
    return [
      Math.floor(y / this.tileSize.height),
      Math.floor(x / this.tileSize.width),
    ]
  }

  addObstacle(cell) {
    this.state[cell[0]][cell[1]] = "OBSTACLE"

    this.obstacles.push(cell)
    this.drawTiles()
  }

  addZombie(cell) {
    this.state[cell[0]][cell[1]] = "ZOMBIE"

    this.zombies.push(cell)
    this.drawTiles()
  }

  addHuman(cell) {
    this.state[cell[0]][cell[1]] = "HUMAN"

    this.humans.push(cell)
    this.drawTiles()
  }

  drawObstacles() {
    this.obstacles.forEach(obstacle => {
      this.context.fillStyle = this.colors.OBSTACLE
      this.context.fillRect(
        obstacle[1] * this.tileSize.width,
        obstacle[0] * this.tileSize.height,
        this.tileSize.width,
        this.tileSize.height
      )
    })
  }

  drawZombies() {
    this.zombies.forEach(zombie => {
      this.context.fillStyle = this.colors.ZOMBIE
      this.context.fillRect(
        zombie[1] * this.tileSize.width,
        zombie[0] * this.tileSize.height,
        this.tileSize.width,
        this.tileSize.height
      )
    })
  }

  drawHumans() {
    this.humans.forEach(human => {
      this.context.fillStyle = this.colors.HUMAN
      this.context.fillRect(
        human[1] * this.tileSize.width,
        human[0] * this.tileSize.height,
        this.tileSize.width,
        this.tileSize.height
      )
    })
  }

  drawTiles() {
    this.drawObstacles()
    this.drawHumans()
    this.drawZombies()
  }

  drawBoard() {
    this.context.fillStyle = "#ffffff"
    this.context.fillRect(0, 0, this.size, this.size)
    this.context.strokeStyle = "#000000"
    this.context.lineWidth = 1
    this.context.beginPath()
    for (let i = 0; i <= this.rows; i += 1) {
      this.context.moveTo(0, i * 1 * (this.size / this.rows))
      this.context.lineTo(this.size, i * 1 * (this.size / this.rows))
      this.context.closePath()
      this.context.stroke()
    }
    for (let i = 0; i <= this.cols; i += 1) {
      this.context.moveTo(i * 1 * (this.size / this.cols), 0)
      this.context.lineTo(i * 1 * (this.size / this.cols), this.size)
      this.context.closePath()
      this.context.stroke()
    }
  }

  drawGame() {
    this.context.clearRect(0, 0, this.size, this.size)
    this.drawBoard()
    this.drawTiles()
  }

  getNeighbors(row, col) {
    const adjacentNeighbors = []
    const diagonalNeighbors = []
    const maxRow = this.rows
    const maxCol = this.cols

    let nextRow = row - 1
    let nextCol = col

    // Directions for clockwise traverse in arrays accessed at same index, starting from cell above.
    const rowDirections = [0, 1, 0, -1]
    const colDirections = [1, 0, -1, 0]
    let orientation = 0

    for (let i = 0; i < 8; i += 1) {
      // If the cell is within the grid, push to adjacent/diagonal neighbor array depending on whether it is the first or second neighbor in the current orientation
      if (nextCol >= 0 && nextCol < maxCol && nextRow >= 0 && nextRow < maxRow)
        if (i % 2 !== 0) {
          diagonalNeighbors.push([nextRow, nextCol])
        } else {
          adjacentNeighbors.push([nextRow, nextCol])
        }
      // Change orientation if two cells in the current direction have been checked
      if (i % 2 !== 0) orientation = (orientation + 1) % 4

      nextRow += rowDirections[orientation]
      nextCol += colDirections[orientation]
    }

    return { adjacentNeighbors, diagonalNeighbors }
  }

  computeDistanceField(entity) {
    const visited = new Set([])

    const distanceField = [...Array(this.rows)].map(() =>
      Array(this.cols).fill(this.rows * this.cols)
    )

    const queue = new Queue(JSON.parse(JSON.stringify(this[entity])))

    while (!queue.isEmpty()) {
      const current = queue.dequeue()
      if (!visited.has(JSON.stringify(current)))
        distanceField[current[0]][current[1]] = 0

      visited.add(JSON.stringify(current))

      const { adjacentNeighbors } = this.getNeighbors(current[0], current[1])

      const unvisited = adjacentNeighbors.filter(neighbor =>
        visited.has(JSON.stringify(neighbor)) ||
        this.state[neighbor[0]][neighbor[1]] === "OBSTACLE"
          ? null
          : neighbor
      )

      unvisited.forEach(neighbor => {
        distanceField[neighbor[0]][neighbor[1]] = Math.min(
          distanceField[current[0]][current[1]] + 1,
          distanceField[neighbor[0]][neighbor[1]]
        )
        visited.add(JSON.stringify(neighbor))
        queue.enqueue(neighbor)
      })
    }

    return distanceField
  }

  getBestHumanMove(zombieDistanceField, possibleMoves) {
    let bestMoves = []

    possibleMoves.forEach(move => {
      if (bestMoves.length === 0) bestMoves.push(move)
      const posRow = move[0]
      const posCol = move[1]
      const bestRow = bestMoves[0][0]
      const bestCol = bestMoves[0][1]

      if (
        zombieDistanceField[posRow][posCol] ===
        zombieDistanceField[bestRow][bestCol]
      )
        bestMoves.push(move)

      if (
        zombieDistanceField[posRow][posCol] >
        zombieDistanceField[bestRow][bestCol]
      )
        bestMoves = [move]
    })

    if (bestMoves.length === 1) return bestMoves[0]
    if (bestMoves.length > 1)
      return bestMoves[Math.floor(Math.random() * bestMoves.length)]

    return null
  }

  getBestZombieMove(humanDistanceField, possibleMoves) {
    let bestMoves = []

    possibleMoves.forEach(move => {
      if (bestMoves.length === 0) bestMoves.push(move)
      const posRow = move[0]
      const posCol = move[1]
      const bestRow = bestMoves[0][0]
      const bestCol = bestMoves[0][1]

      if (
        humanDistanceField[posRow][posCol] ===
        humanDistanceField[bestRow][bestCol]
      )
        bestMoves.push(move)

      if (
        humanDistanceField[posRow][posCol] <
        humanDistanceField[bestRow][bestCol]
      )
        bestMoves = [move]
    })

    if (bestMoves.length === 1) return bestMoves[0]
    if (bestMoves.length > 1)
      return bestMoves[Math.floor(Math.random() * bestMoves.length)]

    return null
  }

  moveHumans() {
    const zombieDistanceField = this.computeDistanceField("zombies")

    this.humans.forEach((human, index) => {
      const { adjacentNeighbors, diagonalNeighbors } = this.getNeighbors(
        human[0],
        human[1]
      )

      const possibleMoves = [...adjacentNeighbors, ...diagonalNeighbors].filter(
        move => (this.state[move[0]][move[1]] === "OBSTACLE" ? null : move)
      )

      const move = this.getBestHumanMove(zombieDistanceField, possibleMoves)

      this.humans[index] = move
    })

    this.drawGame()
  }

  moveZombies() {
    const humanDistanceField = this.computeDistanceField("humans")

    this.zombies.forEach((zombie, index) => {
      const { adjacentNeighbors } = this.getNeighbors(zombie[0], zombie[1])

      const possibleMoves = adjacentNeighbors.filter(move =>
        this.state[move[0]][move[1]] === "OBSTACLE" ? null : move
      )

      const move = this.getBestZombieMove(humanDistanceField, possibleMoves)

      this.zombies[index] = move
      if (JSON.stringify(this.humans).includes(JSON.stringify(move))) {
        const humanIndex = this.humans.findIndex(
          human => JSON.stringify(human) === JSON.stringify(move)
        )
        this.humans.splice(humanIndex, 1)
        this.addZombie(move)
      }
    })

    this.drawGame()
  }

  newGame() {
    this.state = [...Array(this.rows)].map(() => Array(this.cols).fill(null))
    this.context.clearRect(0, 0, this.size, this.size)
    this.obstacles = []
    this.zombies = []
    this.humans = []
    this.drawGame()
  }
}

export default Board
