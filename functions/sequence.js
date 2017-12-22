'use strict'

class Sequence {
  constructor (array, mode) {
    this.array = array
    switch (mode) {
      case 'integer':
        this.generator = new IntegerGenerator(array)
        break
      case 'square':
        this.generator = new SquareGenerator(array)
        break
      default:
        throw new Error('unimplemented sequence')
    }
  }

  getAnswer (index) {
    return this.generator.getAnswer(index)
  }

  getAnswers () {
    return this.generator.getArray()
  }

  getLength () {
    return this.generator.getLength()
  }
}

// Abstract class, do not call
class Generator {
  constructor (array) {
    this.array = array.slice()
  }
  generateAnswers (index) {
    let array = this.array
    if (!array[index]) {
      for (let i = array.length; i <= index + 5; i++) {
        array.push(this.generateAnswer(i))
      }
    }
    this.array = array
  }

  getAnswer (index) {
    this.generateAnswers(index)
    return this.array[index]
  }

  getArray () {
    return this.array
  }

  getLength () {
    return this.array.length
  }

  generateAnswer (index) {
    // abstract method
    throw new Error('abstract method')
  }
}

class IntegerGenerator extends Generator {
  generateAnswer (index) {
    return index
  }
}

class SquareGenerator extends Generator {
  generateAnswer (index) {
    return Math.pow(index, 2)
  }
}

module.exports = Sequence
