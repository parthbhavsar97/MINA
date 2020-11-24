const registrationValidator = require('../validators/registrationValidator')
const responseHelper = require('../../utils/responseHelper')
const codeHelper = require('../../utils/codeHelper')
const registrationHelper = require('../helpers/registrationHelper')
const userHelperAdmin = require('../helpers/userHelperAdmin')
const passwordHelper = require('../../utils/passwordHelper')
const mailHelper = require('../../utils/mailHelper')
const userHelper = require('../helpers/userHelper')
const userValidator = require('../validators/userValidator')

class Registration {

  async signup(req, res) {
    try {
      await registrationValidator.validateLoginRequest(req.body)
      req.body.email = req.body.email.trim()
      req.body.email = req.body.email.toLowerCase()

      await registrationValidator.isEmailExistOnSignUp(req.body.email)
      let user = await registrationHelper.signUp(req.body)

      let token = await codeHelper.getJwtToken(user.user_id, 0, 1)
      responseHelper.success(res, 'SIGNUP_SUCCESS', req.headers.language, true)
    } catch (error) {
      responseHelper.error(res, error, req.headers.language)
    }
  }

  async login(req, res) {
    try {
      await registrationValidator.validateLoginRequest(req.body)
      req.body.email = req.body.email.trim()
      req.body.email = req.body.email.toLowerCase()

      let user = await userHelper.getUserByEmail(req.body.email)
      if (!user.email) throw 'INCORRECT_EMAIL_OR_PASSWORD'

      await passwordHelper.checkPassword(req.body.password, user.password)
      let token = await codeHelper.getJwtToken(user.user_id, 0, 0)
      await userHelper.updateAPICallTimestamp(user.user_id)
      responseHelper.success(res, 'LOGIN_SUCCESS', req.headers.language, { ...token, ...user })
    } catch (error) {
      responseHelper.error(res, error, req.headers.language)
    }
  }

  async changePassword(req, res) {
    try {
      await registrationValidator.validateChangePasswordRequest(req.body)
      let user = await userHelper.getUserById(req.body.user_id)
      await passwordHelper.checkPassword(req.body.old_password, user.password)
      await registrationHelper.changePassword(user, req.body.new_password)
      responseHelper.success(res, 'RESET_PASSWORD_SUCCESS', req.headers.language, true)
    } catch (error) {
      if (error == "INCORRECT_PASSWORD") error = "INCORRECT_EXISTING_PASSWORD"
      responseHelper.error(res, error, req.headers.language)
    }
  }

  async forgotPassword(req, res) {
    try {
      await registrationValidator.validateForgotPasswordRequest(req.body)
      req.body.email = req.body.email.trim()
      req.body.email = req.body.email.toLowerCase()

      let user = await userHelper.getUserByEmail(req.body.email)
      if (!user.email) throw 'EMAIL_NOT_FOUND'

      if (user.is_deleted == 1) {
        responseHelper.success(res, 'USER_DELETED', req.headers.language, true)
      }
      if (user.is_active == 0) {
        responseHelper.success(res, 'USER_BLOCKED', req.headers.language, true)
      }
      let token = await codeHelper.getJwtToken(user.user_id, 0, 1)
      await mailHelper.forgotPasswordUser(user, token)
      responseHelper.success(res, 'FORGOT_PASSWORD_SUCCESS_EMAIL_SENT', req.headers.language, true)
    } catch (error) {
      responseHelper.error(res, error, req.headers.language)
    }
  }

  async resetPassword(req, res) {
    try {
      console.log(req.params)
      console.log('CALLING RESET PASSWORD')
      let tokenData = await codeHelper.decodeToken(req.params.token)
      let user = await userHelper.getUserById(tokenData.user_id)
      if (user.last_auth_token == req.params.token) throw 'URL expired'
      if (tokenData) {
        res.render('index.ejs', { siteTitle: "MINA - Chatbot", params: { ...req.params, reset_password_api: config.links.reset_password_api } })
      }
    } catch (error) {
      console.log(error)
      // res.end('URL expired.')
      res.render('URLExpired.ejs', { siteTitle: "MINA - Chatbot" })
    }
  }

  async resetPasswordUser(req, res) {
    try {
      console.log(req.body)
      await registrationValidator.validateResetPasswordRequest(req.body)
      let tokenData = await codeHelper.decodeToken(req.params.token)
      let user = await userHelper.getUserById(tokenData.user_id)
      if (user.last_auth_token == req.params.token) throw 'URL expired'
      req.body['auth_token'] = req.params.token
      req.body['user_id'] = tokenData.user_id
      await registrationHelper.changePasswordUser(req.body)
      res.render('successError.ejs', {
        siteTitle: "MINA - Chatbot",
        code: 1,
        msg: 'Your Password has been reset successfully.'
      })
    } catch (error) {
      console.log(error)
      // res.end('URL expired.')
      res.render('URLExpired.ejs', { siteTitle: "MINA - Chatbot" })
    }
  }

}

module.exports = new Registration()
