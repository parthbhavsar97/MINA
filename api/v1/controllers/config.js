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



}

module.exports = new Config()
