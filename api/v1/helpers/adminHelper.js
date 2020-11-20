const promise = require('bluebird')
const db = require('../../utils/db')
const dateHelper = require('../../utils/dateHelper')
const codeHelper = require('../../utils/codeHelper')
const passwordHelper = require('../../utils/passwordHelper')
const moment = require('moment')

class AdminHelper {

  async getDashboardCounts() {
    try {
      let ts = Math.round(new Date().getTime() / 1000);
      let Before3Hours = ts - (3 * 3600);

      let day = 24 * 60 * 60 * 1000;
      let start_of_today = (Date.now() - Date.now() % day)/1000;

      console.log(start_of_today)

      let query = ` SELECT COUNT(service_id) as service, 
      (SELECT COUNT(chapter_id) as chapter from chapter where is_deleted = 0), 
      (SELECT COUNT(user_id) as users from users where is_deleted = 0),
      (SELECT COUNT(user_id) as new_users_daily from users where is_deleted = 0 AND created_date > ${start_of_today}),
      (SELECT COUNT(user_id) as online_users from users where is_deleted = 0 AND last_api_call > ${Before3Hours}),
      (SELECT COUNT(user_id) as active_users_daily from users where is_deleted = 0 AND last_api_call > ${start_of_today}),
      (SELECT COUNT(user_id) as active_users_monthly from users where is_deleted = 0 AND modified_date > ${start_of_today}),
      (SELECT COUNT(user_id) as deleted_users_daily from users where is_deleted = 1 AND modified_date > ${start_of_today})
      
      from service WHERE is_deleted = 0`
      let data = await db.custom(query)
      console.log(data.rows[0])
      return data.rows[0]
    } catch (error) {
      throw error
    }
  }

  async getAdminbyId(id) {
    try {
      let admin = await db.select('admins', '*', `user_id = ${id}`)
      return admin[0]
    } catch (error) {
      throw error
    }
  }

  async getAdminByEmail(email) {
    try {
      let admin = await db.select('admins', '*', `email = '${email}' `)
      return admin[0]
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

      await db.update('admins', `user_id = ${user.user_id}`, data)
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
}

module.exports = new AdminHelper()