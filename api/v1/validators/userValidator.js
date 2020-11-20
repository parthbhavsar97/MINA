const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const db = require('../../utils/db')

class UserValidator {

  async validateGetUserRequest(body) {
    let schema = joi.object().keys({
      page_no: joi.number().required(),
      limit: joi.number().required()
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateEditProfileRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      email: joi.string().email().optional(),
      name: joi.string().optional(),
      surname: joi.string().optional(),
      address: joi.string().optional(),
      phone_number: joi.string().optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateEditBusinessProfile(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      is_edit: joi.optional(),
      email: joi.string().email().optional().allow(''),
      phone_number: joi.string().optional().allow(''),
      address: joi.string().optional().allow(''),
      primary_color_code: joi.string().optional().allow(''),
      website_url: joi.string().optional().allow(''),
      secondary_color_code: joi.string().optional().allow(''),
      font_type: joi.string().optional().allow(''),
      logo: joi.string().optional().allow(''),
      image_name: joi.string().optional().allow(''),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateVerifyEmailRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      id: joi.number().optional(),
      email: joi.string().optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateUpdateStepRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      step: joi.number().required(),
      plan_id: joi.number().optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateUpdatePlanRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      plan_id: joi.number().optional(),
      // plan_type: joi.number().required(),
      // subscription_type: joi.number().required(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateRequestVideo(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      id: joi.optional(),
      type: joi.string().trim().required(),
      destination: joi.string().trim().required(),
      duration: joi.number().required(),
      video_hub_content: joi.string().trim().required(),
      onscreen_text: joi.string().trim().optional().allow(''),
      is_edit_profile: joi.number().required(),
      brand_guideline: joi.string().optional().allow(''),
      contact_info: joi.array().required(),
      music_type: joi.string().required(),
      call_to_action: joi.string().optional(),
      picture: joi.optional().allow(''),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateUpdateAccountProfileRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      name: joi.string().trim().required(),
      surname: joi.string().trim().required(),
      email: joi.string().email().required(),
      phone_number: joi.string().optional().allow(''),
      role: joi.string().trim().optional().allow(''),
      business_name: joi.string().trim().optional().allow(''),
      business_size: joi.string().optional().allow(''),
      business_sector: joi.string().optional().allow(''),
      tips: joi.number().optional(),
      updates: joi.number().optional(),
      business_address: joi.string().optional().allow(''),
      address_line: joi.string().optional().allow(''),
      city: joi.string().optional().allow(''),
      country: joi.string().optional().allow(''),
      postal_code: joi.number().optional().allow('')
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateReportVideo(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      id: joi.optional(),
      video_id: joi.number().optional(),
      frameio_video_id: joi.string().optional(),
      video_name: joi.string().optional(),
      comment: joi.string().trim().optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

  async validateChangeVideoStatusRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
      video_id: joi.number().required(),
      frameio_video_id: joi.string().optional(),
      status: joi.number().required(),
      reason: joi.string().optional(),
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
