
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
        this.db = admin.database().ref('/perfect_number');
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
        ref.once('value').then(function(snap) {
            let prevData = snap.val();
            // Set data at /perfect_number/[sessionId]
            ref.set({Data: JSON.stringify(data)})
            console.log(`Prev Data: ${JSON.stringify(prevData)}`);
            return app.ask(`Data retrival/write successful\n
                                 Prev Data: ${JSON.stringify(prevData)}\n
                                 Curr Data: ${JSON.stringify(data)}`)
        }, function(error) {
            console.error(error);
            app.ask('Error occured');
        });
    }

    ['prime']() {
        return this.app.ask(this.app.getPrime());
    }

    ['input.unknown']() {
        const action = this.app.getIntent();
        return this.app.ask(this.speech.getNotImplemented(action));
    }

    ['quit']() {
        return this.app.tell(this.speech.getExit());
    }
}

module.exports = PerfectNumber;