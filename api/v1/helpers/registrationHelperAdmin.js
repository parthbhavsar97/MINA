const promise = require('bluebird')
const db = require('../../utils/db')
const dateHelper = require('../../utils/dateHelper')
const codeHelper = require('../../utils/codeHelper')
const passwordHelper = require('../../utils/passwordHelper')

class RegistrationHelper {

  async insertAuthToken(user_id) {
    let data = {
      user_id: user_id,
      auth_token: codeHelper.getAuthToken(),
      refresh_token: codeHelper.getRefreshToken(),
      created_date: dateHelper.getCurrentTimeStamp(),
      modified_date: dateHelper.getCurrentTimeStamp(),
      token_validity: dateHelper.getTokenExpirationTime()
    }
    try {
      await db.insert('lb_user_auth_relation', data)
      return data
    } catch (error) {
      return promise.reject(error)
    }
  }
}

module.exports = new RegistrationHelper()