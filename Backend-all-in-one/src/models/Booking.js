const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  service: { type: String, required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  duration: { type: Number, default: 30 }, // minutes
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  amount: { type: Number, default: 0 },
  notes: String,
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)
