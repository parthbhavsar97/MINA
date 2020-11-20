const promise = require('bluebird')
const jwt = require('jsonwebtoken')
const uuidv1 = require('uuid/v1')
const bcrypt = require('bcrypt')

const config = require('./config')

class CodeHelper {
    async getOTP() {
        let num = String(Math.floor(Math.random() * 10000)).padEnd(4, 0)
        // num = '1234'
        return num
    }
    async getLink(admin_id, user_type) {
        let token = await this.getJwtToken(admin_id, user_type, true)
        return config.forgotPasswordLinkPrefix + token.auth_token
    }
    async getUniqueCode() {
        return uuidv1()
    }

    getJwtToken(user_id, user_type, flag) {
        try {
            const data = {
                user_id: user_id,
                user_type: user_type
            }
            console.log("Token will expire in : ", flag && flag == 1 ? '365d' : '1d')
            // Removed expiry date on 23-01-2020
            const auth_token = jwt.sign(data, config.JWTSecretKey, {
                expiresIn: flag && flag == 1 ? '365d' : '1d'
            })
            const refreshData = {
                user_id: user_id,
                type: 'refresh',
                user_type: user_type
            }
            const refresh_token = jwt.sign(refreshData, config.JWTSecretKey)
            console.log(auth_token)
            return {
                auth_token,
                refresh_token
            }
        } catch (error) {
            return promise.reject(error)
        }
    }
    async validateRefreshUserAuthToken(refresh_token, auth_token) {
        if (refresh_token && auth_token) {
            return jwt.verify(refresh_token, config.JWTSecretKey, (err, result) => {
                if (err) {
                    console.log(err)
                    throw 'NOT_AUTHORIZED'
                } else {
                    let authData = jwt.decode(auth_token)
                    console.log(authData, '.......................................')
                    let refreshData = result

                    if (authData.user_id === refreshData.user_id && refreshData.type === 'refresh') {
                        return authData
                    } else {
                        throw 'NOT_AUTHORIZED'
                    }
                }
            })
        } else {
            throw 'TOKEN_NOT_FOUND'
        }
    }

    refresh_token(old_token, refresh_token, for_admin) {
        try {
            console.log("Old_token ::: ", old_token);
            let token, decoded = jwt.decode(old_token)
            console.log("Decoded ::: ", decoded);
            if (refresh_token == config.refresh_token && decoded && decoded.user_id && (decoded.user_type + 1)) {
                token = this.getJwtToken(decoded.user_id, decoded.user_type, for_admin)
            } else {
                throw 'TOKEN_MALFORMED'
            }
            return token
        } catch (error) {
            return promise.reject(error)
        }
    }
    decodeToken(token) {
        try {
            return new promise((resolve, reject) => {
                jwt.verify(token, config.JWTSecretKey, async (error, decoded) => {
                    if (error) {
                        console.log(error)
                        reject('TOKEN_EXPIRED')
                    } else {
                        resolve(decoded)
                    }
                })
            })
        } catch (error) {
            return promise.reject(error)
        }
    }
    decodeTokenWithoutExipredCheck(token) {
        let tkn, decoded = jwt.decode(token);
        return decoded
    }

    async checkPassword(enteredPassword, storedPassword, flag) {
        try {
            // console.log(await bcrypt.compare(enteredPassword, storedPassword))
            if (await bcrypt.compare(enteredPassword, storedPassword)) {
                // if (enteredPassword == storedPassword) {
                return true
            } else {
                if (flag) {
                    throw 'INCORRECT_OLD_PASSWORD'
                }
                throw 'ENTER_VALID_EMAIL_PASSWORD'
            }
        } catch (err) {
            // console.log(err)
            throw err
        }
    }

    getDigitCode() {
        let date = new Date()
        let code = parseInt(date.getTime() / 1000).toString(16)
        return code
    }
    getUniqueCode() {
        return uuidv1()
    }

}

module.exports = new CodeHelper()
