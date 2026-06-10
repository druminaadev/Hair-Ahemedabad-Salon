const SupportTicket = require('../models/SupportTicket');
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'support@hairahmedabad.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Generate unique ticket ID
const generateTicketId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TKT-${timestamp}${random}`.toUpperCase();
};

// Send email to developer team
const sendTicketEmail = async (ticket) => {
  const mailOptions = {
    from: ticket.adminEmail,
    to: process.env.DEV_TEAM_EMAIL || 'dev-team@hairahmedabad.com',
    subject: `[${ticket.category.toUpperCase()}] [${ticket.priority.toUpperCase()}] ${ticket.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #9D679F, #6F5AA3); padding: 20px; border-radius: 10px 10px 0 0;">
          <h2 style="color: white; margin: 0;">🎫 New Support Ticket</h2>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold;">Ticket ID:</td>
              <td style="padding: 10px;">${ticket.ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Subject:</td>
              <td style="padding: 10px;">${ticket.subject}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Category:</td>
              <td style="padding: 10px;"><span style="background: #9D679F; color: white; padding: 5px 10px; border-radius: 5px;">${ticket.category}</span></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Priority:</td>
              <td style="padding: 10px;"><span style="background: ${ticket.priority === 'critical' ? '#D88385' : ticket.priority === 'high' ? '#C7923E' : ticket.priority === 'medium' ? '#6D91BF' : '#6F9F8F'}; color: white; padding: 5px 10px; border-radius: 5px;">${ticket.priority}</span></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">From:</td>
              <td style="padding: 10px;">${ticket.adminEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Created:</td>
              <td style="padding: 10px;">${new Date(ticket.createdAt).toLocaleString()}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px;">
            <h3 style="margin-top: 0;">Description:</h3>
            <p style="white-space: pre-wrap;">${ticket.description}</p>
          </div>
          
          ${ticket.attachments && ticket.attachments.length > 0 ? `
            <div style="margin-top: 20px;">
              <h3>Attachments:</h3>
              <ul>
                ${ticket.attachments.map(att => `<li>${att.fileName}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/${ticket.ticketId}" 
               style="background: linear-gradient(135deg, #9D679F, #6F5AA3); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              View Ticket
            </a>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Create new support ticket
exports.createTicket = async (req, res) => {
  try {
    const { subject, category, priority, description, adminEmail, attachments } = req.body;

    const ticketId = generateTicketId();

    const ticket = new SupportTicket({
      ticketId,
      subject,
      category,
      priority,
      description,
      adminEmail,
      attachments: attachments || [],
      status: 'open'
    });

    await ticket.save();

    // Send email to developer team
    try {
      await sendTicketEmail(ticket);
      ticket.emailSent = true;
      ticket.emailSentAt = new Date();
      await ticket.save();
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ success: false, message: 'Failed to create support ticket', error: error.message });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tickets,
      total: tickets.length
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tickets', error: error.message });
  }
};

// Get single ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ ticketId: req.params.ticketId });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ticket', error: error.message });
  }
};

// Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findOne({ ticketId: req.params.ticketId });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = status;
    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = new Date();
    }

    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket status updated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ success: false, message: 'Failed to update ticket', error: error.message });
  }
};

// Add message to ticket
exports.addMessage = async (req, res) => {
  try {
    const { sender, message, isAdmin } = req.body;
    const ticket = await SupportTicket.findOne({ ticketId: req.params.ticketId });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.messages.push({ sender, message, isAdmin, createdAt: new Date() });
    await ticket.save();

    res.json({
      success: true,
      message: 'Message added successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ success: false, message: 'Failed to add message', error: error.message });
  }
};

// Get ticket statistics
exports.getTicketStats = async (req, res) => {
  try {
    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({ status: 'open' });
    const inProgressTickets = await SupportTicket.countDocuments({ status: 'in-progress' });
    const resolvedTickets = await SupportTicket.countDocuments({ status: 'resolved' });
    const closedTickets = await SupportTicket.countDocuments({ status: 'closed' });

    const categoryStats = await SupportTicket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const priorityStats = await SupportTicket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
        byCategory: categoryStats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics', error: error.message });
  }
};
