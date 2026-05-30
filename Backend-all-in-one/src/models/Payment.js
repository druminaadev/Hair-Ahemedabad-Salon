const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'card', 'upi', 'other'], default: 'cash' },
  status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('Payment', paymentSchema)
