const express = require('express')
const router = express.Router()
const headersValidator = require('../api/utils/headersValidator')
const registration = require('../api/v1/controllers/registration')
const service = require('../api/v1/controllers/service')
const user = require('../api/v1/controllers/user')
const Multer = require('multer')

const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
    },
});

// Registration and Login process APIs
router.post('/login', headersValidator.nonAuthValidation, registration.login)
router.post('/signup', headersValidator.nonAuthValidation, registration.signup)
router.post('/changePassword', headersValidator.authValidation, registration.changePassword)

router.post('/forgotPassword', headersValidator.nonAuthValidation, registration.forgotPassword)
router.get('/resetPassword/:token', registration.resetPassword)
router.post('/resetPasswordUser/:token', registration.resetPasswordUser)

// Service APIs
router.get('/getServices', headersValidator.authValidation, service.getservices)

//Google Dialogue flow Webhook API (Test)
router.post('/googleDialogueFlowWebhook', user.googleDialogueFlowWebhook)

// Device Relations
router.post('manageUserDeviceRelation', headersValidator.authValidation, user.manageUserDeviceRelation)

module.exports = router
