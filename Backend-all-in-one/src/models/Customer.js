const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  loyaltyPoints: { type: Number, default: 0 },
  notes: String,
}, { timestamps: true })

module.exports = mongoose.model('Customer', customerSchema)
