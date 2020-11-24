const responseHelper = require('../../utils/responseHelper')
const codeHelper = require('../../utils/codeHelper')
const serviceHelper = require('../helpers/serviceHelper')
const serviceValidator = require('../validators/serviceValidator')

class Service {

    async getservices(req, res) {
        try {
            await serviceValidator.getservicesRequest(req.body)
            let services = await serviceHelper.getServices(req.body)
            responseHelper.success(res, 'SUCCESS', req.headers.language, services)
        } catch (error) {
            responseHelper.error(res, error, req.headers.language)
        }
    }
}

module.exports = new Service()
