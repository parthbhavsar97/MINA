const promise = require('bluebird')
const joi = require('joi')

class joiValidator {
  validateJoiSchema (body, schema) {
    return new promise((resolve, reject) => {
      joi.validate(body, schema, (error, value) => {
        if (error) {
          console.log('=========JOI ERROR=============')
          console.log(error)
          let param = error.details[0].context.key
          let type = error.details[0].type
          reject({ param, type })
        } else {
          resolve()
        }
      })
    })
  }
}

module.exports = new joiValidator()
