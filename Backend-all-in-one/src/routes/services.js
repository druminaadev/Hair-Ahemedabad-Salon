const router = require('express').Router()
const Service = require('../models/Service')
const auth = require('../middleware/auth')

router.use(auth)

// Get all services
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.isActive) {
      filter.isActive = req.query.isActive === 'true'
    }
    const services = await Service.find(filter)
    res.json(services)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create a service
router.post('/', async (req, res) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json(service)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update a service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json(service)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json({ message: 'Service deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
