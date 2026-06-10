const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  category: { type: String, required: true, enum: ['billing', 'technical', 'feature', 'bug', 'question'] },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  description: { type: String, required: true },
  adminEmail: { type: String, required: true },
  attachments: [{ fileName: String, fileUrl: String, uploadedAt: Date }],
  messages: [{
    sender: { type: String, required: true },
    message: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  }],
  assignedTo: { type: String },
  resolvedAt: Date,
  emailSent: { type: Boolean, default: false },
  emailSentAt: Date
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
