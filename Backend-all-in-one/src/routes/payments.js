const router = require('express').Router()
const { getAll, create, update } = require('../controllers/paymentController')
const auth = require('../middleware/auth')

router.use(auth)
router.get('/', getAll)
router.post('/', create)
router.put('/:id', update)

module.exports = router
