'use strict';

const app = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sprintf = require('sprintf-js').sprintf;

admin.initializeApp(functions.config().firebase);
const db = admin.database();

class PerfectNumber {
    constructor(req, res) {
        this.sessionId = req.body.sessionId;
        console.log(sprintf("Headers: %s", JSON.stringify(req.headers)));
        console.log(sprintf("Body: %s", JSON.stringify(req.body)));
        this.app = new app({ request: req, response: res });
        console.log(sprintf("User: %s", JSON.stringify(this.app.getUser)));
        console.log(sprintf("Data: %s", JSON.stringify(this.app.data)));
    }

    run() {
        const action = this.app.getIntent();
        console.log(action);
        const ref = db.ref('perfect_number/'+this.sessionId);
        ref.once('value').then(
            function(snapshot) {
                console.log(sprintf("Snapshot: %s", JSON.stringify(snapshot)));
            }
        )
        ref.set({
            Data: JSON.stringify(this.app.data)
        });
        this.app.ask(sprintf("Previous data is %s", JSON.stringify(prev_data)));
    }
}

exports.perfectNumber = functions.https.onRequest((req, res) => {
    new PerfectNumber(req, res).run();
});