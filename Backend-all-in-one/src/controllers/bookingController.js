const Booking = require('../models/Booking')

exports.getAll = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name phone')
      .populate('staff', 'name')
      .sort({ date: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getOne = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name phone')
      .populate('staff', 'name')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.create = async (req, res) => {
  try {
    const booking = await Booking.create(req.body)
    res.status(201).json(booking)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.update = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.remove = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ message: 'Booking deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
