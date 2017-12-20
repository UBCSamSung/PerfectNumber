const Number = require('../number');
const assert = require('assert');

describe('Number', function () {
    describe('#generateAnswers()', function () {
        const number = new Number()
        it('should return array of integers from 0 to 15', function () {
            assert.deepEqual(number.generateAnswers('integer', [], 10), [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
        });
        it('should return array of integers from 0 to 10', function () {
            assert.deepEqual(number.generateAnswers('integer', [0,1,2,3,4,5,6,7,8,9,10], 10), [0,1,2,3,4,5,6,7,8,9,10]);
        });
    });
});