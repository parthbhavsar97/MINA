const promise = require('bluebird')
const db = require('../../utils/db')
const dateHelper = require('../../utils/dateHelper')
const { update, select } = require('../../utils/db')
const moment = require('moment')
const { toComparators } = require('semver')

class UserHelper {

  async getUserByEmail(email) {
    try {
      let user = await db.select('users', '*', `email='${email}' AND is_deleted = 0`)
      return user && user[0] ? user[0] : {}
    } catch (error) {
      throw error
    }
  }

  async getUserById(id) {
    try {
      let user = await db.select('users', '*', `user_id = ${id} AND is_deleted = 0`)
      return user && user[0] ? user[0] : {}
    } catch (error) {
      throw error
    }
  }

  async updateAPICallTimestamp(id) {
    try {
      let data = {
        last_api_call: dateHelper.getCurrentTimeStamp()
      }
      return await db.update('users', `user_id = ${id}`, data)
    } catch (error) {
      throw error
    }
  }

}

module.exports = new UserHelper()
