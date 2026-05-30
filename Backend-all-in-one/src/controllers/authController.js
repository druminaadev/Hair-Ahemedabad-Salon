const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' })
    res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.json(user)
}
