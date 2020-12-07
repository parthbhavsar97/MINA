const dateHelper = require('../../utils/dateHelper')
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

    async updateConfig(body) {
        try {
            let data = {
                modified_date: dateHelper.getCurrentTimeStamp()
            }

            if (body.tab == 1) {
                data.privacy_policy = body.text
            } else {
                data.terms_and_conditions = body.text
            }

            let condition = 'config_id = 1'
            await db.update('config', condition, data)
            return true
        } catch (error) {
            throw error
        }
    }

}

module.exports = new ConfigHelper()
