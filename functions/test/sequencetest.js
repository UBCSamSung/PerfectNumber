/* eslint-env node, mocha */
const Sequence = require('../sequence')
const assert = require('assert')
const should = require('should');

describe('Sequence', function () {
  describe('Default', function () {
    describe('#constructor()', function () {
      it('should end with error', function (done) {
        try {
          const sequence = new Sequence([], 'something')
        } catch (error) {
          done()
        }
      })
    })
  })
  describe('Integer', function () {
    const sequence = new Sequence([], 'integer')
    describe('#getAnswer()', function () {
      it('should return 4', function () {
        assert.deepEqual(sequence.getAnswer(4), 4)
      })
    })
    describe('#getAnswers()', function () {
      it('should return first 10 integer numbers', function () {
        assert.deepEqual(sequence.getAnswers(4), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      })
    })
  })
  describe('Square', function () {
    const sequence = new Sequence([], 'square')
    describe('#getAnswer()', function () {
      it('should return 5', function () {
        assert.deepEqual(sequence.getAnswer(4), 16)
      })
    })
    describe('#getAnswers()', function () {
      it('should return first 10 square numbers', function () {
        assert.deepEqual(sequence.getAnswers(4), [ 0, 1, 4, 9, 16, 25, 36, 49, 64, 81 ])
      })
    })
  })
  describe('Cubic', function () {
    const sequence = new Sequence([], 'cubic')
    describe('#getAnswer()', function () {
      it('should return 5', function () {
        assert.deepEqual(sequence.getAnswer(4), 64)
      })
    })
    describe('#getAnswers()', function () {
      it('should return first 10 cubic numbers', function () {
        assert.deepEqual(sequence.getAnswers(4), [ 0, 1, 8, 27, 64, 125, 216, 343, 512, 729 ])
      })
    })
  })
  describe('Prime', function () {
    const sequence = new Sequence([], 'prime')
    describe('#getAnswer()', function () {
      it('should return 11', function () {
        assert.deepEqual(sequence.getAnswer(4), 11)
      })
    })
    describe('#getAnswers()', function () {
      it('should return first 10 prime numbers', function () {
        assert.deepEqual(sequence.getAnswers(4), [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 ])
      })
    })
  })
  describe('Fibonacci', function () {
    const sequence = new Sequence([], 'fibonacci')
    describe('#getAnswer()', function () {
      it('should return 5', function () {
        assert.deepEqual(sequence.getAnswer(4), 5)
      })
    })
    describe('#getAnswers()', function () {
      it('should return first 10 fibonacci numbers', function () {
        assert.deepEqual(sequence.getAnswers(4), [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ])
      })
    })
  })
})
