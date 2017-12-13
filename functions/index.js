'use strict';

// Actions on Google
const app = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sprintf = require('sprintf-js').sprintf;
admin.initializeApp(functions.config().firebase);

const db = admin.database().ref('/perfect_number');
const storage = admin.storage()

class PerfectNumber {
    constructor(req, res) {
        this.sessionId = req.body.sessionId;
        console.log(sprintf("Headers: %s", JSON.stringify(req.headers)));
        console.log(sprintf("Body: %s", JSON.stringify(req.body)));
        this.assistant = new app({ request: req, response: res });
        console.log(sprintf("User: %s", JSON.stringify(this.assistant.getUser)));
        console.log(sprintf("Data: %s", JSON.stringify(this.assistant.data)));
    }

    run() {
        const action = this.assistant.getIntent();
        const ref = db.child(this.sessionId);
        // Get data from /perfect_number/[sessionId]
        let prevData = null
        ref.once('value', snap => {
            prevData = snap.val();
            // Set data at /perfect_number/[sessionId]
            ref.set({Data: JSON.stringify(this.assistant.data)})
        });
        console.log(`Prev Data: ${JSON.stringify(prevData)}`);
        this.assistant.ask(`Data retrival/write successful\nPrev Data: ${JSON.stringify(prevData)}`)
    }
}

exports.perfectNumber = functions.https.onRequest((req, res) => {
    new PerfectNumber(req, res).run();
});