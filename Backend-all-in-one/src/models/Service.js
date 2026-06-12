const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { 
    type: Number, 
    required: true,
    get: v => v / 100,
    set: v => Math.round(v * 100)
  }, // stored in paise, accessed in rupees
  duration: { type: Number, required: true }, // in minutes
  category: { type: String, enum: ['Hair', 'Nails', 'Facial', 'Waxing'], required: true },
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true }
})

module.exports = mongoose.model('Service', serviceSchema)
