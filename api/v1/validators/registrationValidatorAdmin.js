const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const db = require('../../utils/db')
const promise = require('bluebird')

class RegistrationValidator {

  async validateLoginRequest(body) {
    let schema = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().required()
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async changePasswordAdminRequest(body) {
    let schema = joi.object().keys({
      old_password: joi.string().required(),
      new_password: joi.string().required(),
      user_id: joi.optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async forgotPasswordRequest(body) {
    let schema = joi.object().keys({
      email: joi.string().email().required(),
      user_id: joi.optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async resetPasswordRequest() {
    let schema = joi.object().keys({
      new_password: joi.string().email().required(),
      user_id: joi.optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async isAdminEmailExist(email) {
    try {
      let condition = `email = '${email}' `
      let admin = await db.select('admins', '*', condition)
      if (admin && admin[0]) {
        return admin[0]
      } else {
        throw 'INCORRECT_EMAIL_OR_PASSWORD'
      }
    } catch (error) {
      throw error
    }

  }
}

module.exports = new RegistrationValidator()
