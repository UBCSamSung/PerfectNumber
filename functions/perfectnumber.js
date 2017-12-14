
'use strict';

const app = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Speech = require('./speech');

admin.initializeApp(functions.config().firebase);
class PerfectNumber {
    constructor(req, res) {
        this.sessionId = req.body.sessionId;
        this.app = new app({ request: req, response: res });
        this.data = this.app.data;
        this.db = admin.database().ref('/perfect-number');
        this.speech = new Speech();
        // Log 
        console.log(`Headers: ${JSON.stringify(req.headers)}`);
        console.log(`Body: ${JSON.stringify(req.body)}`);
        console.log(`User: ${JSON.stringify(this.app.getUser)}`);
        console.log(`Data: ${JSON.stringify(this.app.data)}`);
    }

    run() {
        const action = this.app.getIntent();
        const map = this;
        if (!action) {
            return this.app.ask(this.speech.getFallback());
        }
        if (map[action]) {
            return map[action]();
        }
        return this.app.ask(this.speech.getUnexpected(action));
    }

    ['write_db']() {
        const ref = this.db.child(this.sessionId);
        const data = this.data
        const app = this.app
        // Get data from /perfect_number/[sessionId]
        ref.once('value').then(function (snap) {
            let prevData = snap.val();
            // Set data at /perfect_number/[sessionId]
            ref.set({ Data: JSON.stringify(data) })
            console.log(`Prev Data: ${JSON.stringify(prevData)}`);
            return app.ask(`Data retrival/write successful\n
                                 Prev Data: ${JSON.stringify(prevData)}\n
                                 Curr Data: ${JSON.stringify(data)}`)
        }, function (error) {
            console.error(error);
            app.ask(this.speech.getError('write_db'));
        });
    }

    ['choose_game_mode']() {
        const mode = this.data.game_mode;
        if (!mode) {
            return this.app.ask(this.speech.getUnexpected(mode));
        }
        this.app.setContext("in-game");
        // this.app.ask(`Preparing ${mode} counting game...`);
        const index = 0;
        const nextAnswer = this.getNextAnswer(mode, index);
        this.data.index = index;
        this.data.next_answer = nextAnswer;
        this.app.ask(`Next answer is ${nextAnswer}`);
    }

    ['guess']() {
        const mode = this.data.game_mode;
        const answer = this.data.next_answer;
        const guess = this.data.guess;
        if (mode == null) {
            return this.app.ask(this.speech.getUndefined('mode'));
        }
        if (answer == null) {
            return this.app.ask(this.speech.getUndefined('nextAnswer'));
        }
        if (answer === guess) {
            return this.app.ask(this.speech.getCorrectAnswer(guess));
        } else {
            return this.app.ask(this.speech.getWrongAnswer(guess, answer));
        }
    }

    getNextAnswer(mode, index) {
        // Get array of the given mode from database
        return generateAnswers(null, index)[index];
    }

    ['input.unknown']() {
        const action = this.app.getIntent();
        return this.app.ask(this.speech.getNotImplemented(action));
    }

    ['input.welcome']() {
        return this.app.ask(this.speech.getWelcome())
    }

    ['quit']() {
        this.app.setContext("in-game", 0);
        return this.app.ask(this.speech.getExit());
    }
}

module.exports = PerfectNumber;

function generateAnswers(data, index) {
    // Generate data for the next 5 numbers if not exist
    if (!data) data = []
    if (!data[index]) {
        for (let i = index; i < index + 5; i++) {
            data.push(i);
        }
    }
    return data
}
