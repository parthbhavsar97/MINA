const db = require('../../utils/db')

class ConfigHelper {

    async getConfig() {
        try {
            let select = '*', condition = '1=1'
            let config = await db.select('config', select, condition)
            return config[0]
        } catch (error) {
            throw error
        }
    }

}

module.exports = new ConfigHelper()
