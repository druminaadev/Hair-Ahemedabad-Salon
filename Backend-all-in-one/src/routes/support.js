const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const auth = require('../middleware/auth');

// All routes require authentication
router.post('/tickets', auth, supportController.createTicket);
router.get('/tickets', auth, supportController.getAllTickets);
router.get('/tickets/stats', auth, supportController.getTicketStats);
router.get('/tickets/:ticketId', auth, supportController.getTicketById);
router.patch('/tickets/:ticketId/status', auth, supportController.updateTicketStatus);
router.post('/tickets/:ticketId/messages', auth, supportController.addMessage);

module.exports = router;
