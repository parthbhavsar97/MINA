const messages = require('./messages.json')

class ResponseHelper {
  error(res, msg, language, data) {
    console.log(msg, "-->", this.getMessage(msg, language))
    let response = {
      code: 0,
      status: 'FAIL',
      message: this.getMessage(msg, language)
    }
    let status_code = 200
    if (msg == 'USER_DELETED' || msg == 'USER_BLOCKED') {
      response.code = 403
      status_code = 403
    }
    if (msg == 'USER_NOT_VERIFIED' || msg == 'UPDATE_PHONE_SMS_SUCCESS') {
      response.code = 2
      response.data = data
    }
    if (msg == 'TOKEN_EXPIRED') {
      response.code = 401
      status_code = 401
    }

    res.status(status_code).json(response)
  }

  success(res, msg, language, data, total) {
    let response = {
      code: 1,
      status: 'SUCCESS',
      message: this.getMessage(msg, language),
      data: data,
      total: total
    }

    res.status(200).json(response)
  }

  webhookSuccess(res, msg, language, data, total) {
    let response = {
      "fulfillmentText": "Response from Google dialogue flow - webhook API",
      "fulfillmentMessages": [{
        "text": {
          "text": [data]
        }
      }]
    }
    res.json(response)
  }

  getMessage(msg, language) {
    let lang = 'en'
    if (language) {
      lang = language
    }
    if (msg.param && msg.param.includes('email')) {
      msg.param = 'email'
    }
    if (msg.param && msg.type) {
      if (msg.type.includes('required')) {
        return messages[lang]['PARAM_REQUIRED'].replace('PARAM', msg.param)
      } else {
        return messages[lang]['INVALID_PARAM'].replace('PARAM', msg.param)
      }
    } else if (msg.toString().includes('ReferenceError:')) {
      console.log('======================ERROR=====================')
      console.log(msg)
      console.log('================================================')
      return messages[lang]['INTERNAL_SERVER_ERROR']
    } else {
      return messages[lang][msg]
    }
  }
}

module.exports = new ResponseHelper()
