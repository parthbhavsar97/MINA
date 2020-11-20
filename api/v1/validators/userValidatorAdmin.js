const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const db = require('../../utils/db')
const promise = require('bluebird')

class UserValidatorAdmin {

  async validateGetUserRequest(body) {
    let schema = joi.object().keys({
      page_no: joi.number().required(),
      limit: joi.number().required(),
      from_date: joi.string().optional(),
      to_date: joi.string().optional(),
      search_name: joi.string().optional().allow(''),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateChangeStatusRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.number().optional(),
      id: joi.number().optional(),
      is_active: joi.number().required()
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateDeleteUserRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.number().optional(),
      id: joi.number().optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateGetUserByIdRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.number().optional(),
      id: joi.number().optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateCompleteRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.number().optional(),
      request_id: joi.number().required(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateRegisterUserRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.number().optional(),
      email: joi.string().email().required(),
      password: joi.string().optional()
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateActivateFinalVideoRequesst(body) {
    let schema = joi.object().keys({
      id: joi.number().optional(),
      flag: joi.number().optional(),
      frameio_video_id: joi.string().optional(),
      frameio_category_id: joi.string().optional(),
      category_id: joi.number().optional(),
      download_url: joi.string().optional(),
      last_status: joi.optional()
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async userExist(body, flag) {
    try {
      let condition = `email = '${body.email}' `
      let admin = await db.select('admins', '*', condition)
      console.log('>>>>>>>.', admin)
      if (admin && admin[0]) {
        return admin[0]
      } else {
        throw 'NO_USER_FOUND'
      }
    } catch (error) {
      reject(error)
    }
  }

  async isUserEmailExist(email) {
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

  async isUserEmailExistOnEdit(body) {
    try {
      let condition = `email = '${body.email}' AND user_id <> ${body.id}`
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

}

module.exports = new UserValidatorAdmin()
