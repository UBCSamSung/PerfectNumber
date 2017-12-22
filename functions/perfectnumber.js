
'use strict'

const App = require('actions-on-google').DialogflowApp
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Speech = require('./speech')
const Sequence = require('./sequence')

admin.initializeApp(functions.config().firebase)
class PerfectNumber {
  constructor (req, res) {
    this.app = new App({ request: req, response: res })
    this.data = this.app.data
    this.answerManager = new AnswerManager()
    this.sessionManager = new SessionManager(req.body.sessionId)
    this.speech = new Speech()
    // Log
    console.log(`Headers: ${JSON.stringify(req.headers)}`)
    console.log(`Body: ${JSON.stringify(req.body)}`)
    console.log(`User: ${JSON.stringify(this.app.getUser)}`)
    console.log(`Data: ${JSON.stringify(this.app.data)}`)
  }

  run () {
    const action = this.app.getIntent()
    const map = this
    if (!action) {
      return this.app.ask(this.speech.getFallback())
    }
    if (map[action]) {
      return map[action]()
    }
    return this.app.ask(this.speech.getUnexpected(action))
  }

  ['choose_game_mode'] () {
    const mode = this.data.game_mode
    if (!mode) {
      return this.app.ask(this.speech.getUnexpected(mode))
    }
    this.app.setContext('in-game')
    const index = 0
    this.answerManager.readAnswer(mode, index).then(
      (answer) => {
        this.app.ask(`I will begin. First number is ${answer}.\nYour turn!`)
        this.sessionManager.writeData('mode', mode)
        this.sessionManager.writeData('index', index + 1)
      },
      (err) => {
        this.app.ask(this.speech.getError(err))
      }
    )
  }

  ['guess'] () {
    const guess = this.data.guess
    this.sessionManager.readData('mode').then(
      (mode) => {
        this.sessionManager.readData('index').then(
          (index) => {
            this.answerManager.readAnswer(mode, index).then(
              (answer) => {
                if (answer === guess) {
                  this.app.ask(this.speech.getCorrectAnswer(guess))
                  this.sessionManager.writeData('index', index + 1)
                } else {
                  return this.app.ask(this.speech.getWrongAnswer(guess, answer))
                }
              }
            )
          }
        )
      }, (err) => {
        this.app.ask(this.speech.getError(err))
      }
    )
  }

  ['input.unknown'] () {
    return this.app.ask(this.speech.getFallback())
  }

  ['input.welcome'] () {
    return this.app.ask(this.speech.getWelcome())
  }

  ['quit'] () {
    this.app.setContext('in-game', 0)
    return this.app.ask(this.speech.getExit())
  }
}

class AnswerManager {
  constructor () {
    this.reference = admin.database().ref('/perfect-number/answers')
  }

  readAnswer (mode, index) {
    if (mode === undefined) {
      throw new Error('mode is undefined')
    }
    const ref = this.reference.child(mode)
    return ref.once('value').then(
      (snapshot) => {
        const data = snapshot.val()
        console.log(`Database value for ${mode} is ${data}`)
        if (Array.isArray(data)) {
          return data
        } else {
          return []
        }
      }, (error) => {
        throw new Error(error)
      }
    ).then(
      (array) => {
        const sequence = new Sequence(array, mode)
        const answer = sequence.getAnswer(index)
        console.log(`database array is ${array}; generated array is ${sequence.getAnswers()}`)
        if (array.length !== sequence.getLength()) {
          // write to database
          ref.set(sequence.getAnswers())
        }
        return answer
      }
    )
  }
}

class SessionManager {
  constructor (sessionId) {
    this.sessionId = sessionId
    this.reference = admin.database().ref('/perfect-number/sessions')

    this.validTags = [
      'index',
      'mode'
    ]
  }

  readData (tag) {
    if (!this.validTags.includes(tag)) {
      throw new Error('invalid session data tag')
    }
    const ref = this.reference.child(`${this.sessionId}/${tag}`)
    return ref.once('value').then(
      (snapshot) => {
        return snapshot.val()
      }
    )
  }

  writeData (tag, data) {
    if (!this.validTags.includes(tag)) {
      throw new Error('invalid session data tag')
    }
    const ref = this.reference.child(`${this.sessionId}/${tag}`)
    ref.set(data).then(
      (res) => {
        console.log('Session data successfully wrote to database')
      }
    )
  }
}

module.exports = PerfectNumber
