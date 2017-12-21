/**
 * 
 * 
 * @class Number
 */
class Number {
    constructor() {
        // TODO
    }

    generateAnswers(mode, array, index) {
        // Generate data until the next 5 numbers if array[index] does not exist
        const newArray = array.slice();
        if (!newArray[index]) {
            for (let i = newArray.length; i <= index + 5; i++) {
                if (mode === 'integer') {
                    newArray.push(i);
                }
            }
        }
        return newArray
    }

    ['integer'](array) {
        for (let i = array[array.length];;i++) {
            array.forEach(item => {
                if (i%item==0) {
                    return;
                }
            });
            return i;
        }
    }

    ['prime'](array) {
        for (let i = array[array.length];;i++) {
            array.forEach(item => {
                if (i%item==0) {
                    return;
                }
            });
            return i;
        }
    }

}

module.exports = Number;