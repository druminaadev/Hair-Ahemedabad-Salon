const router = require('express').Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

router.use(auth)

// Get all staff members
router.get('/', async (req, res) => {
  try {
    // We get all users with the role of 'staff'
    const staff = await User.find({ role: 'staff' }).select('name email role')
    // Map properties to align with front-end expected structure if needed, or return raw
    const formattedStaff = staff.map(member => ({
      id: member._id,
      _id: member._id,
      name: member.name,
      email: member.email,
      role: 'Stylist' // Mock or set a role label for UI compatibility
    }))
    res.json(formattedStaff)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
