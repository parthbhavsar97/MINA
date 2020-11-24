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

  async addOrUpdateUserDeviceRelation(body) {
    try {
      let data = {
        user_id: body.user_id,
        allow_notification: 1,
        device_token: body.device_token,
        device_id: body.device_id,
        device_type: body.device_type,
        modified_date: dateHelper.getCurrentTimeStamp(),
        os: body.os,
        app_version: body.app_version
      },
        where = ` device_id = '${body.device_id}' and user_id = ${body.user_id}`,
        selectParams = '*',
        device_data = await db.select('user_device', selectParams, where)
      if (device_data.length > 0) {
        await db.update('user_device', where, data)
      } else {
        data.created_date = dateHelper.getCurrentTimeStamp()
        await db.insert('user_device', data)
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

}

module.exports = new UserHelper()
