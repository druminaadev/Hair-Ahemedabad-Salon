const Payment = require('../models/Payment')

exports.getAll = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('customer', 'name phone')
      .populate('booking', 'service date')
      .sort({ createdAt: -1 })
    res.json(payments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.create = async (req, res) => {
  try {
    const payment = await Payment.create(req.body)
    res.status(201).json(payment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.update = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!payment) return res.status(404).json({ message: 'Payment not found' })
    res.json(payment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
