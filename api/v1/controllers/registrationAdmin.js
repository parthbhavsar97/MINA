const registrationValidatorAdmin = require('../validators/registrationValidatorAdmin')
const responseHelper = require('../../utils/responseHelper')
const codeHelper = require('../../utils/codeHelper')
const passwordHelper = require('../../utils/passwordHelper')
const adminHelper = require('../helpers/adminHelper')
const mailHelper = require('../../utils/mailHelper')

class RegistrationAdmin {

  async loginAdmin(req, res) {
    try {
      await registrationValidatorAdmin.validateLoginRequest(req.body)
      req.body.email = req.body.email.trim()
      req.body.email = req.body.email.toLowerCase()
      let admin = await registrationValidatorAdmin.isAdminEmailExist(req.body.email)
      await passwordHelper.checkPassword(req.body.password, admin.password)
      let token = await codeHelper.getJwtToken(admin.user_id, 1, 1)
      responseHelper.success(res, 'LOGIN_SUCCESS', req.headers.language, { ...token, ...admin })
    } catch (error) {
      responseHelper.error(res, 'INCORRECT_EMAIL_OR_PASSWORD', req.headers.language)
    }
  }

  async changePasswordAdmin(req, res) {
    try {
      await registrationValidatorAdmin.changePasswordAdminRequest(req.body)
      let admin = await adminHelper.getAdminbyId(req.body.user_id)
      await passwordHelper.checkPassword(req.body.old_password, admin.password)
      await adminHelper.changePassword(admin, req.body.new_password)
      responseHelper.success(res, 'RESET_PASSWORD_SUCCESS', req.headers.language, true)
    } catch (error) {
      if (error == "INCORRECT_PASSWORD") error = "INCORRECT_EXISTING_PASSWORD"
      responseHelper.error(res, error, req.headers.language)
    }
  }

  async forgotPasswordAdmin(req, res) {
    try {
      await registrationValidatorAdmin.forgotPasswordRequest(req.body)
      let admin = adminHelper.getAdminByEmail(req.body.email)
      if (admin && admin.user_id) {
        await mailHelper.forgotPasswordAdmin(admin)
      } else {
        throw 'ADMIN_NOT_FOUND_WITH_EMAIL'
      }
      responseHelper.success(res, 'FORGOT_PASSWORD_SUCCESS_EMAIL_SENT', req.headers.language, true)
    } catch (error) {
      responseHelper.error(res, error, req.headers.language)
    }
  }

  async resetPasswordAdmin(req, res) {
    try {
      await registrationValidatorAdmin.resetPasswordRequest(req.body)
      let admin = adminHelper.getAdminbyId(req.body.user_id)
      await adminHelper.changePassword(admin, req.body.new_password)
      responseHelper.success(res, 'RESET_PASSWORD_SUCCESS', req.headers.language, true)
    } catch (error) {
      responseHelper.error(res, error, req.headers.language)
    }
  }

}

module.exports = new RegistrationAdmin()
