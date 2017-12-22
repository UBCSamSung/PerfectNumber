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
      it('should return 0', function () {
        assert.deepEqual(sequence.getAnswer(4), 4)
      })
    })
    describe('#getAnswers()', function () {
      it('should return array of 0', function () {
        assert.deepEqual(sequence.getAnswers(4), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      })
    })
  })
})
