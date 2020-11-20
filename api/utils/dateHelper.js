const config = require('./config')
const promise = require('bluebird')

class DateHelper {
  getCurrentTimeStamp () {
    return Math.floor((new Date()).getTime() / 1000)
  }

  getTokenExpirationTime () {
    let date = new Date()
    date.setHours(date.getHours() + config.tokenExpireHours)
    // date.setMinutes(date.getMinutes() + 1)
    return Math.floor(date.getTime() / 1000)
  }

  getTimeRegex () {
    return /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/
  }

}

module.exports = new DateHelper()
