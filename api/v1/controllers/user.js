const userValidator = require('../validators/userValidator.js')
const userHelper = require('../helpers/userHelper.js')
const userHelperAdmin = require('../helpers/userHelperAdmin.js')
const responseHelper = require('../../utils/responseHelper')
const db = require('../../utils/db.js')
const configHelper = require('../helpers/configHelper.js')

class User {

   async editProfile(req, res) {
      try {
         await userValidator.validateEditProfileRequest(req.body)
         await userValidator.isEmailExistOnEdit(req.body)
         let user = await userHelper.editProfile(req.body)
         responseHelper.success(res, 'EDIT_PROFILE_SUCCESS', req.headers.language, user)
      } catch (error) {
         responseHelper.error(res, error, req.headers.language)
      }
   }

   async verifyEmail(req, res) {
      try {
         await userValidator.validateVerifyEmailRequest(req.body)
         let user = await userHelperAdmin.getUserById(req.body.user_id)
         let result = await userHelper.verifyUserEmail(user)
         // await mailHelper.sendEmailVerificationMail(user)
         responseHelper.success(res, 'SUCCESS', req.headers.language, result)
      } catch (error) {
         responseHelper.error(res, error, req.headers.language)
      }
   }

   //Google Dialogue flow Webhook API (Test)
   async googleDialogueFlowWebhook(req, res) {
      try {
         console.log("Request from Google Dialogue Flow Webhook: ")
         console.log("REQUEST BODY: ", req.body)

         let number = Math.floor(Math.random() * 10000)
         console.log(number)
         responseHelper.webhookSuccess(res, 'SUCCESS', req.headers.language, number)
      } catch (error) {
         responseHelper.error(res, error, req.headers.language)
         throw error
      }
   }

   async manageUserDeviceRelation(req, res) {
      try {
         await userValidator.userDeviceRequest(req.body)
         await userHelper.addOrUpdateUserDeviceRelation(req.body, req.headers)
         responseHelper.success(res, 'SUCCESS', req.headers.language, {})
      } catch (error) {
         console.log(error)
         responseHelper.error(res, error, req.headers.language)
      }
   }

   async getConfig(req, res) {
      try {
         let config = await configHelper.getConfig()
         responseHelper.success(res, 'SUCCESS', req.headers.language, config)
      } catch (error) {
         console.log(error)
         responseHelper.error(res, error, req.headers.language)
      }
   }

}

module.exports = new User()
