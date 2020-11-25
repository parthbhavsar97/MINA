const joi = require('joi')
const joiValidator = require('../../utils/joiValidator')
const db = require('../../utils/db')
const promise = require('bluebird')

class ServiceHelper {

  async getServices(body) {
    try {
      let select = `*,
        (SELECT COUNT(chapter_id) AS total_chapters FROM chapter where chapter.service_id = service.service_id AND chapter.is_deleted = 0) as total_chapter,
        (SELECT COUNT(session_id) AS total_session FROM session where session.service_id = service.service_id AND session.is_deleted = 0) as total_session`
      let condition = ` is_deleted = 0 ORDER BY service_id ASC`
      let services = await db.select('service', select, condition)
      return services
    } catch (error) {
      throw error
    }
  }

}

module.exports = new ServiceHelper()
