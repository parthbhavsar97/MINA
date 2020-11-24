const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const db = require('../../utils/db')

class UserValidator {

  async userDeviceRequest() {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      device_id: joi.string().required(),
      device_token: joi.string().required(),
      device_type: joi.number().integer().required(),
      os: joi.string().required(),
      app_version: joi.string().required()
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async isEmailExistOnEdit(body) {
    try {
      let condition = ` email = '${body.email}' AND user_id <> ${body.user_id} `
      let res = await db.select('users', 'user_id', condition)
      if (res && res[0]) {
        throw 'USER_WITH_SAME_EMAIL_EXISTS'
      } else {
        return true
      }
    } catch (error) {
      throw error
    }
  }

  async isEmailExistOnEditForBusiness(body, id) {
    try {
      let condition = ` email = '${body.email}' AND user_id <> ${id} `
      let res = await db.select('brands', 'user_id', condition)
      if (res && res[0]) {
        throw 'EMAIL_EXIST'
      } else {
        return true
      }
    } catch (error) {
      throw error
    }
  }

  async isPhoneNumberExistOnEditForBusiness(body, id) {
    try {
      let condition = ` phone_number = '${body.phone_number}' AND user_id <> ${id} `
      let res = await db.select('brands', 'user_id', condition)
      if (res && res[0]) {
        throw 'PHONE_EXISTS'
      } else {
        return true
      }
    } catch (error) {
      throw error
    }
  }

}

module.exports = new UserValidator()
