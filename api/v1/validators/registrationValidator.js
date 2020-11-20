const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const db = require('../../utils/db')
const promise = require('bluebird')

class RegistrationValidator {

  async validateLoginRequest(body) {
    let schema = joi.object().keys({
      email: joi.string().trim().email().required(),
      password: joi.string().required()
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateRegisterRequest(body) {
    let schema = joi.object().keys({
      name: joi.string().optional(),
      surname: joi.string().optional(),
      address: joi.string().required(),
      country_code: joi.string().optional(),
      phone_number: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().optional()
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateForgotPasswordRequest(body) {
    let schema = joi.object().keys({
      email: joi.string().email().required(),
      user_id: joi.optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateResetPasswordRequest(body) {
    let schema = joi.object().keys({
      new_password: joi.string().required(),
      user_id: joi.optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateChangePasswordRequest(body) {
    let schema = joi.object().keys({
      old_password: joi.string().required(),
      new_password: joi.string().required(),
      user_id: joi.optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async userExist(body) {
    try {
      let condition = `email = '${body.email}' AND is_deleted = 0 `
      let user = await db.select('users', '*', condition)
      if (user && user[0]) {
        return user[0]
      } else {
        throw 'NO_USER_FOUND'
      }
    } catch (error) {
      throw error
    }
  }

  async isEmailExist(email) {
    try {
      let condition = `email = '${email}' AND is_deleted = 0 `
      let user = await db.select('users', 'user_id', condition)
      if (user && user[0]) {
        throw 'USER_WITH_SAME_EMAIL_EXISTS'
      } else {
        return true
      }
    } catch (error) {
      throw error
    }
  }

  async isEmailExistOnSignUp(email) {
    try {
      let condition = `email = '${email}' AND is_deleted = 0 `
      let user = await db.select('users', 'user_id', condition)
      if (user && user[0]) {
        throw 'USER_WITH_SAME_EMAIL_EXISTS'
      } else {
        return true
      }
    } catch (error) {
      throw error
    }
  }

  async isUserVerified(user) {
    try {
      if (user.is_verified == 1) {
        return true
      } else {
        throw 'VERIFY_EMAIL_FIRST'
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = new RegistrationValidator()
