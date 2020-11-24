const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const db = require('../../utils/db')
const promise = require('bluebird')

class ServiceValidator {

  async getservicesRequest(body) {
    let schema = joi.object().keys({
      user_id: joi.optional(),
    })
    return await joiValidator.validateJoiSchema(body, schema)
  }

}

module.exports = new ServiceValidator()
