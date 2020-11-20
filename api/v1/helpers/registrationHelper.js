const promise = require('bluebird')
const db = require('../../utils/db')
const dateHelper = require('../../utils/dateHelper')
const codeHelper = require('../../utils/codeHelper')
const passwordHelper = require('../../utils/passwordHelper')
const moment = require('moment')

class RegistrationHelper {

  async signUp(body) {
    try {
      let data = {
        email: body.email,
        password: await passwordHelper.getPasswordHash(body.password),
        created_date: dateHelper.getCurrentTimeStamp(),
        modified_date: dateHelper.getCurrentTimeStamp(),
        is_active: 1,
        is_deleted : 0,
        register_date: moment(new Date()).format('DD-MM-YYYY')
      }
      let res = await db.insert('users', data)
      return res
    } catch (error) {
      throw error
    }
  }

  async changePassword(user, password) {
    try {
      let data = {
        password: await passwordHelper.getPasswordHash(password),
        modified_date: dateHelper.getCurrentTimeStamp()
      }

      await db.update('users', `user_id = ${user.user_id}`, data)
      return true
    } catch (error) {
      throw error
    }
  }

  async checkOldpassword(body, user) {
    try {
      await passwordHelper.checkPassword(body.old_password, user.password)
    } catch (error) {
      throw error
    }
  }

  async changePasswordUser(body) {
    try {
      let data = {
        password: await passwordHelper.getPasswordHash(body.new_password),
        modified_date: dateHelper.getCurrentTimeStamp(),
        last_auth_token: body.auth_token
      }
      await db.update('users', `user_id = ${body.user_id} `, data)
      return true
    } catch (error) {
      throw error
    }
  }
}

module.exports = new RegistrationHelper()