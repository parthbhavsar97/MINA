const config = require('./config')
const responseHelper = require('./responseHelper')
const db = require('./db')
const semver = require('semver')
const jwt = require('jsonwebtoken')
const userHelper = require('../v1/helpers/userHelper')

class HeaderValidator {
  validateHeaders(headers) {

    let error
    if (!headers.language) {
      error = { param: 'language', type: 'required' }
    } else if (!headers.auth_token) {
      error = { param: 'auth_token', type: 'required' }
    } else if (headers.android_app_version == undefined && headers.ios_app_version == undefined && headers.web_app_version == undefined) {
      console.log(headers.android_app_version == undefined && headers.ios_app_version == undefined && headers.web_app_version == undefined)
      error = 'APP_VERSION_MISSING'
    } else {
      if (headers.android_app_version || headers.ios_app_version || headers.web_app_version) {
        error = false
      } else {
        let version = headers.android_app_version ? headers.android_app_version : headers.ios_app_version ? headers.ios_app_version : headers.web_app_version
        let currentAppVerision = headers.android_app_version ? config.androidAppVerision : config.iosAppVerision
        if (semver.valid(version) == null) {
          error = 'INVALID_APP_VERSION'
        } else {
          if (semver.satisfies(version, `>= ${currentAppVerision}`)) {

          } else {
            error = 'UPGRADE_APP'
          }
        }
      }
    }
    return error
  }

  nonAuthValidation(req, res, next) {
    console.log('\nRequest Body: ')
    console.log(req.body)
    let error = HV.validateHeaders(req.headers)
    if (error) {
      responseHelper.error(res, error, req.headers.language)
    } else if (req.headers.auth_token !== config.default_auth_token) {
      responseHelper.error(res, "INVALID_TOKEN", req.headers.language)
    } else {
      next()
    }
  }

  async authValidation(req, res, next) {
    let error = HV.validateHeaders(req.headers)
    if (error) {
      responseHelper.error(res, error, req.headers.language)
    } else {
      let token = req.headers.auth_token;
      console.log('\nTOKEN:', token)
      jwt.verify(token, config.JWTSecretKey, async (err, decoded) => {
        console.log("\nDecoded data: ", decoded);
        if (err) {
          if (err.name === 'TokenExpiredError' && req.skip) {
            let tkn, decoded = jwt.decode(token);
            console.log(decoded, token)
            req.user_id = decoded.user_id
            req.is_admin = decoded.is_admin
            next()
          } else {
            console.log("Error ::", err.name);
            if (req.route.path === "/refreshToken") {
              next()
            } else {
              responseHelper.error(res, 'TOKEN_EXPIRED', req.headers.language)
            }
          }
        } else if (decoded && decoded.user_id) {
          req.user_id = decoded.user_id
          req.body.user_id = decoded.user_id
          console.log('BODY ::', req.body)
          HV.isUserActive(req, res, next, decoded)
          await userHelper.updateAPICallTimestamp(decoded.user_id)

        } else {
          responseHelper.error(res, 'TOKEN_MALFORMED', req.headers.language)
        }
      })
    }
  }

  async isUserActive(req, res, next, decoded) {
    let selectParams = '*',
      where = `user_id='${decoded.user_id}'`,
      user = ''
    if (decoded.user_type == 0) {
      user = await db.select('users', selectParams, where)
      if (user && user[0]) {
        if (user[0].is_active !== 1) {
          responseHelper.error(res, 'USER_BLOCKED', req.headers.language)
        }
        if (user[0].is_deleted == 1) {
          responseHelper.error(res, 'USER_DELETED', req.headers.language)
        }
      }
    } else if (decoded.user_type == 1) {
      where = `user_id='${decoded.user_id}'`
      user = await db.select('admins', selectParams, where)
    }
    next();
  }
}
const HV = new HeaderValidator()
module.exports = HV
