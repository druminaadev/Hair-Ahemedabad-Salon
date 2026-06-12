const crypto = require('crypto')
const Booking = require('../models/Booking')

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_webhooksecretkey'
    const signature = req.headers['x-razorpay-signature']

    if (!signature) {
      return res.status(400).json({ message: 'Missing webhook signature' })
    }

    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', webhookSecret)
    hmac.update(JSON.stringify(req.body))
    const digest = hmac.digest('hex')

    if (digest !== signature) {
      return res.status(400).json({ message: 'Webhook signature mismatch' })
    }

    const event = req.body.event
    const payload = req.body.payload

    if (event === 'payment.captured') {
      const payment = payload.payment.entity
      const orderId = payment.order_id

      if (orderId) {
        // Find booking by Razorpay Order ID
        const booking = await Booking.findOne({ razorpayOrderId: orderId })
        if (booking && booking.status === 'Draft') {
          booking.status = 'Confirmed'
          booking.paymentStatus = 'paid'
          booking.expiresAt = null // clear draft TTL expiry
          await booking.save()
          console.log(`Webhook: Booking ${booking._id} confirmed via payment.captured`)
        }
      }
    } else if (event === 'payment.failed') {
      const payment = payload.payment.entity
      const orderId = payment.order_id

      if (orderId) {
        const booking = await Booking.findOne({ razorpayOrderId: orderId })
        if (booking && booking.status === 'Draft') {
          booking.status = 'Cancelled'
          booking.paymentStatus = 'pending'
          await booking.save()
          console.log(`Webhook: Booking ${booking._id} cancelled via payment.failed`)
        }
      }
    }

    res.json({ status: 'ok' })
  } catch (err) {
    console.error('Webhook execution failed:', err.message)
    res.status(500).json({ message: err.message })
  }
}
