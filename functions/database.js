const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize admin usage
admin.initializeApp(functions.config().firebase);

class Database {
    constructor(reference) {
        this.db = admin.database().ref(reference);
    }

    getValuePromise(reference) {
        const ref = this.db.child(reference);
        return this.db.child(reference).once('value').then(function (snapshot) {
            return snapshot.val();
        }, function (error) {
            console.error(error);
            return null;
        });
    }

    setValuePromise(reference, value) {
        const ref = this.db.child(reference);
        return ref.set(value);
    }
}

module.exports = Database;