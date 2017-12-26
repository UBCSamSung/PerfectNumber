class Speech {
  getFallback () {
    // Get random fallback message
    const fallbackMessages = [
      'I missed that. Try again',
      'No valid command detected',
      'What did you just said!?'
    ]
    return (
      getRandomItem(fallbackMessages)
    )
  }

  getNotImplemented (action) {
    // Get NotImplemented message
    return `${action} is not an implemented action`
  }

  getUnexpected (action) {
    // Get NotImplemented message
    return `${action} is an unexpected action`
  }

  getUndefined (object) {
    // Get NotImplemented message
    return `${object} is not defined`
  }

  getWelcome () {
    // Get Welcome message
    const gameModes = [
      'integer',
      'square',
      'cubic',
      'prime',
      'fibonacci'
    ]
    return `Welcome to Perfect Number!\nPlease choose from: ${gameModes}`
  }

  getExit () {
    // Get exit message
    return 'Alright, see you next time'
  }

  getStarted (answer) {
    return `I will begin. First number is ${answer}.\nYour turn!`
  }

  getCorrectAnswer (answer) {
    return `Awesome, ${answer} is right!`
  }

  getWrongAnswer (guess, answer) {
    const overshot = Number(guess) - Number(answer)
    let hint = ''
    let feedback = 'Close, but not quite.'
    if (Math.abs(overshot) > 10) {
      feedback = 'That\'s way off.'
    }
    if (overshot > 0) {
      hint = 'too high'
    } else {
      hint = 'too low'
    }
    return `${feedback}, ${guess} is ${hint}.`
  }

  getError (err = null) {
    if (err) {
      return `Error occured: ${err}`
    }
    return 'Unknown error occured'
  }
}

function getRandomItem (A) {
  // Get a integer from 0 to n
  return A[Math.floor(Math.random() * A.length)]
}

module.exports = Speech
