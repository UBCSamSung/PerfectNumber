class Speech {
    constructor() {
        //
    }

    getFallback() {
        // Get random fallback message
        const fallbackMessages = [
            'I missed that. Try again',
            'No valid command detected',
            'What did you just said!?'
        ];
        return (
            getRandomItem(fallbackMessages)
        );
    }

    getNotImplemented(action) {
        // Get NotImplemented message
        return `${action} is not an implemented action`
    }

    getUnexpected(action) {
        // Get NotImplemented message
        return `${action} is an unexpected action`
    }

    getUndefined(object) {
        // Get NotImplemented message
        return `${object} is not defined`
    }

    getWelcome() {
        // Get Welcome message
        return 'Welcome to Perfect Number!';
    }

    getExit() {
        // Get exit message
        return 'Alright, see you next time';
    }

    getPrime() {
        return 'First prime number is 2';
    }

    getCorrectAnswer(answer) {
        return `Awesome, ${answer} is right!`;
    }

    getWrongAnswer(guess, answer) {
        return `Too bad, ${guess} is not right.\n${answer} is the answer.`;
    }

    getError(err = null) {
        if (err) {
            return `Error occured: ${err}`
        }
        return 'Unknown error occured';
    }
}

function getRandomItem(A) {
    // Get a integer from 0 to n
    return A[Math.floor(Math.random() * A.length)];
}

module.exports = Speech;