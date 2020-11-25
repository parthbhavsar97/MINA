const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const db = require('../../utils/db')
const promise = require('bluebird')

class ServiceHelper {

  async getServices(body) {
    try {
        let condition = ` is_deleted = 0 ORDER BY service_id ASC`
        let services = await db.select('service', '*', condition)
        return services
    } catch (error) {
        throw error
    }
  }

}

module.exports = new ServiceHelper()
