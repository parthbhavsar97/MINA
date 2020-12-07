const configHelper = require('../helpers/configHelper')
const responseHelper = require('../../utils/responseHelper')
const codeHelper = require('../../utils/codeHelper')
const config = require('../../utils/config')
const registrationHelper = require('../helpers/registrationHelper')

class Config {

    async getConfig(req, res) {
        try {
            let response = await configHelper.getConfig()
            responseHelper.success(res, 'SUCCESS', req.headers.language, response)
        } catch (error) {
            responseHelper.error(res, error, req.headers.language)
        }
    }

    async updateConfig(req, res) {
        try {
            let msg = 'PRIVACY_POLICY_UPDATE_SUCCESS'
            let response = await configHelper.updateConfig(req.body)
            if (req.body.tab == 2) {
                msg = 'TERMS_AND_CONDITIONS_UPDATE_SUCCESS'
            }
            responseHelper.success(res, msg, req.headers.language, response)
        } catch (error) {
            responseHelper.error(res, error, req.headers.language)
        }
    }

}

module.exports = new Config()
