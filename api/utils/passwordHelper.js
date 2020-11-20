const bcrypt = require('bcrypt')
const promise = require('bluebird')

class PasswordHelper {
  async getPasswordHash(password) {
    return bcrypt.hash(password, 10)
  }

  async checkPassword(enteredPassword, storedPassword) {
    try {
      console.log(enteredPassword)
      console.log(storedPassword)
      if (await bcrypt.compare(enteredPassword, storedPassword)) {
        return true
      } else {
        throw 'INCORRECT_PASSWORD'
      }
    } catch (err) {
      throw err
    }
  }

}

module.exports = new PasswordHelper()
