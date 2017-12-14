class Speech {
    constructor() {
        //
    }

    getFallback() {
        // Get random fallback message
        fallbackMessages = [
            'fallback1',
            'fallback2',
            'fallback3'
        ];
        return(
            getRandomItem(fallbackMessages)
        );
    }

    getNotImplemented(action) {
        // Get NotImplemented message
        return `${action} is not an implemented action`
    }

    getUnexpected(action) {
        // Get NotImplemented message
        return `${action} is not an unexpected action`
    }

    getExit() {
        // Get exit message
        return 'Alright, see you next time';
    }

    getPrime() {
        return 'First prime number is 2';
    }
}

function getRandomItem(A) {
    // Get a integer from 0 to n
    return A[Math.floor(Math.random() * A.length)];
}

module.exports = Speech;