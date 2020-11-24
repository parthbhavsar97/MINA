const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const db = require('../../utils/db')
const promise = require('bluebird')

class ServiceHelper {

  async getServices(body) {
    try {
        let condition = ` is_deleted = 0 `
        let services = await db.select('service', '*', condition)
        return services
    } catch (error) {
        throw error
    }
  }

}

module.exports = new ServiceHelper()
