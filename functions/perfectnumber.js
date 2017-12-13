
'use strict';

const app = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const definition = require('./definition');

admin.initializeApp(functions.config().firebase);

class PerfectNumber {
    constructor(req, res) {
        this.sessionId = req.body.sessionId;
        this.app = new app({ request: req, response: res });
        this.data = this.app.data;
        this.db = admin.database().ref('/perfect_number');
        console.log(`Headers: ${JSON.stringify(req.headers)}`);
        console.log(`Body: ${JSON.stringify(req.body)}`);
        console.log(`User: ${JSON.stringify(this.app.getUser)}`);
        console.log(`Data: ${JSON.stringify(this.app.data)}`);
    }

    run() {
        const action = this.app.getIntent();
        const map = this;
        if (!action) {
            return this.app.ask(definition.speech.fallback);
        }
        if (map[action]) {
            return map[action]();
        }
        return this.app.ask(`${action} is not an implemented action`);
    }

    ['write_db']() {
        const ref = this.db.child(this.sessionId);
        // Get data from /perfect_number/[sessionId]
        ref.once('value', snap => {
            let prevData = snap.val();
            // Set data at /perfect_number/[sessionId]
            ref.set({Data: JSON.stringify(this.data)})
            console.log(`Prev Data: ${JSON.stringify(prevData)}`);
            return this.app.ask(`Data retrival/write successful\n
                                 Prev Data: ${JSON.stringify(prevData)}\n
                                 Curr Data: ${JSON.stringify(this.data)}`)
        });
    }
}

module.exports = PerfectNumber;