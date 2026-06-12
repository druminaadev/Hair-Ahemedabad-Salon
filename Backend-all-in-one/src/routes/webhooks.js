const router = require('express').Router()
const { handleRazorpayWebhook } = require('../controllers/webhookController')

router.post('/razorpay', handleRazorpayWebhook)

module.exports = router
