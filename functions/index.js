'use strict'

// Actions on Google
const functions = require('firebase-functions')
const PerfectNumber = require('./perfectnumber')

exports.perfectNumber = functions.https.onRequest((req, res) => {
  new PerfectNumber(req, res).run()
})
