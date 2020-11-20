const userValidatorAdmin = require('../validators/userValidatorAdmin.js')
const userHelperAdmin = require('../helpers/userHelperAdmin.js')
const responseHelper = require('../../utils/responseHelper')
const codeHelper = require('../../utils/codeHelper.js')
const mailHelper = require('../../utils/mailHelper.js')
const adminHelper = require('../helpers/adminHelper.js')

class Users {

	async getDashboardCounts(req, res) {
		try {
			delete req.body['user_id']
			let data = await adminHelper.getDashboardCounts() 
			responseHelper.success(res, 'SUCCESS', req.headers.language, data)
		} catch (error) {
			responseHelper.error(res, error, req.headers.language)
		}
	}

	async getUsers(req, res) {
		try {
			delete req.body['user_id']
			await userValidatorAdmin.validateGetUserRequest(req.body)
			let response = await userHelperAdmin.getUsers(req.body)
			responseHelper.success(res, 'SUCCESS', req.headers.language, response.data, response.total)
		} catch (error) {
			responseHelper.error(res, error, req.headers.language)
		}
	}

	async addUser(req, res) {
		try {
			delete req.body['user_id']
			await userValidatorAdmin.validateRegisterUserRequest(req.body)
			req.body.email = req.body.email.trim()
			req.body.email = req.body.email.toLowerCase()
			await userValidatorAdmin.isUserEmailExist(req.body.email)
			let user = await userHelperAdmin.addUser(req.body)
			user.pass = req.body.password
			responseHelper.success(res, 'USER_ADD_SUCCESS', req.headers.language, true)
		} catch (error) {
			console.log(error)
			responseHelper.error(res, error, req.headers.language)
		}
	}

	async updateUser(req, res) {
		try {
			delete req.body['user_id']
			await userValidatorAdmin.validateRegisterUserRequest(req.body)
			await userValidatorAdmin.isUserEmailExistOnEdit(req.body)
			await userValidatorAdmin.isUserPhoneExistOnEdit(req.body)
			await userHelperAdmin.updateUser(req.body)
			responseHelper.success(res, 'USER_UPDATE_SUCCESS', req.headers.language, true)
		} catch (error) {
			console.log(error)
			responseHelper.error(res, error, req.headers.language)
		}
	}

	async getUsersForVideoHub(req, res) {
		try {
			delete req.body['user_id']
			await userValidatorAdmin.validateGetUserRequest(req.body)
			let response = await userHelperAdmin.getUsersForVideoHub(req.body)
			responseHelper.success(res, 'LOGIN SUCCESS', req.headers.language, response.data, response.total)
		} catch (error) {
			responseHelper.error(res, error, req.headers.language)
		}
	}


}

module.exports = new Users()
