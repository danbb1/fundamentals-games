class Queue {
  constructor(elements) {
    this.elements = elements
  }

  enqueue(element) {
    this.elements.push(element)
  }

  dequeue() {
    return this.elements.shift()
  }

  isEmpty() {
    return this.elements.length === 0
  }
}

export default Queue
