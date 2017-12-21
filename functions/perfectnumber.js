
'use strict';

const app = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Speech = require('./speech');
const Number = require('./number');

admin.initializeApp(functions.config().firebase);
/**
 * 
 * 
 * @class PerfectNumber
 */
class PerfectNumber {
    /**
     * Creates an instance of PerfectNumber.
     * @param {any} req 
     * @param {any} res 
     * 
     * @memberOf PerfectNumber
     */
    constructor(req, res) {
        this.sessionId = req.body.sessionId;
        this.app = new app({ request: req, response: res });
        this.data = this.app.data;
        this.db = admin.database().ref('/perfect-number');
        this.speech = new Speech();
        this.number = new Number();
        // Log 
        console.log(`Headers: ${JSON.stringify(req.headers)}`);
        console.log(`Body: ${JSON.stringify(req.body)}`);
        console.log(`User: ${JSON.stringify(this.app.getUser)}`);
        console.log(`Data: ${JSON.stringify(this.app.data)}`);
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf PerfectNumber
     */
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

    /**
     * 
     * 
     * 
     * @memberOf PerfectNumber
     */
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

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf PerfectNumber
     */
    ['choose_game_mode']() {
        const mode = this.data.game_mode;
        if (!mode) {
            return this.app.ask(this.speech.getUnexpected(mode));
        }
        this.app.setContext("in-game");
        // this.app.ask(`Preparing ${mode} counting game...`);
        const index = 0;
        this.data.index = index;
        this.asynGetAnswer(mode, index).then(
            (answer) => {
                this.data.next_answer = answer;
                this.app.ask(`Next answer is ${answer}`);
            },
            (err) => {
                this.app.ask(this.speech.getError(err));
            }
        );
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf PerfectNumber
     */
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

    /**
     * 
     * Get array of the given mode from database
     * @param {str} mode 
     * @param {int} index 
     * @returns game mode array[index+1]
     * 
     * @memberOf PerfectNumber
     */
    asynGetAnswer(mode, index) {
        const ref = this.db.child(mode);
        const p = ref.once('value')
        const p2 = p.then(
            (snapshot) => {
                const data = snapshot.val();
                console.log(`Database value for ${mode} is ${data}`);
                if (Array.isArray(data)) {
                    return data;
                } else {
                    return [];
                }
            }, (error) => {
                console.error(error);
                this.app.ask(this.speech.getError(error));
            }
        );
        return p2.then(
            (array) => {
                const newArray = this.number.generateAnswers(mode, array, index);
                if (array.length!=newArray.length) {
                    // write to database
                    ref.set(newArray);
                }
                return newArray[index];
            }
        )
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf PerfectNumber
     */
    ['input.unknown']() {
        return this.app.ask(this.speech.getFallback());
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf PerfectNumber
     */
    ['input.welcome']() {
        return this.app.ask(this.speech.getWelcome())
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf PerfectNumber
     */
    ['quit']() {
        this.app.setContext("in-game", 0);
        return this.app.ask(this.speech.getExit());
    }
}

module.exports = PerfectNumber;