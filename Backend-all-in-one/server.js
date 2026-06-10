require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/db')

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./src/routes/auth'))
app.use('/api/customers', require('./src/routes/customers'))
app.use('/api/bookings', require('./src/routes/bookings'))
app.use('/api/payments', require('./src/routes/payments'))
app.use('/api/support', require('./src/routes/support'))

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'SalonPro API running' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
