const express = require('express')
const router = express.Router()
const headersValidator = require('../api/utils/headersValidator')
const registration = require('../api/v1/controllers/registrationAdmin')
const userAdmin = require('../api/v1/controllers/userAdmin')

// Login AND Change/Forgot Password
router.post('/login', headersValidator.nonAuthValidation, registration.loginAdmin)
router.post('/changePasswordAdmin', headersValidator.authValidation, registration.changePasswordAdmin)
router.post('/forgotPasswordAdmin', headersValidator.nonAuthValidation, registration.forgotPasswordAdmin)
router.post('/resetPasswordAdmin', headersValidator.nonAuthValidation, registration.resetPasswordAdmin)

// Dashboard
router.post('/getDashboardCounts', headersValidator.authValidation, userAdmin.getDashboardCounts)

// USER APIs
router.post('/getUsers', headersValidator.authValidation, userAdmin.getUsers)
router.post('/addUser', headersValidator.authValidation, userAdmin.addUser)
router.post('/updateUser', headersValidator.authValidation, userAdmin.updateUser)

module.exports = router
