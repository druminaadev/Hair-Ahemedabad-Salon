const Customer = require('../models/Customer')

exports.getAll = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 })
    res.json(customers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getOne = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).json({ message: 'Customer not found' })
    res.json(customer)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.create = async (req, res) => {
  try {
    const customer = await Customer.create(req.body)
    res.status(201).json(customer)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.update = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!customer) return res.status(404).json({ message: 'Customer not found' })
    res.json(customer)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.remove = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id)
    res.json({ message: 'Customer deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
