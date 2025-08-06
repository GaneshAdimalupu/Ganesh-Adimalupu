// api/routes/contactRoutes.js - FIXED to use existing email service
const express = require('express');
const router = express.Router();
const ContactMessage = require('../../lib/models/contactModel');

// Import the existing email service (fixed path)
let sendConfirmationEmail;
try {
  const emailService = require('../../lib/services/emailService');
  sendConfirmationEmail = emailService.sendConfirmationEmail;

} catch (error) {

}

// Add debug middleware for all contact routes
router.use((req, res, next) => {

  next();
});

// POST /api/contact/submit - Submit contact form (using RAW MongoDB)
router.post('/submit', async (req, res) => {

  const startTime = Date.now();

  try {

    // Validate required fields
    const { name, email, message } = req.body;
    const missingFields = [];

    if (!name || name.trim().length < 2) missingFields.push('name (minimum 2 characters)');
    if (!email) missingFields.push('email');
    if (!message || message.trim().length < 10) missingFields.push('message (minimum 10 characters)');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Invalid form data',
        missingFields,
        received: Object.keys(req.body)
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        received: email
      });
    }

    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: 'Database not connected',
        message: 'Please try again in a moment'
      });
    }

    // Use RAW MongoDB for contact messages too
    const db = mongoose.connection.db;
    const collection = db.collection('contactmessages');

    // Rate limiting - check for recent submissions from same email using RAW MongoDB
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentSubmission = await collection.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: fiveMinutesAgo }
    }, { maxTimeMS: 5000 });

    if (recentSubmission) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Please wait 5 minutes before submitting another message',
        nextAllowedTime: new Date(recentSubmission.createdAt.getTime() + 5 * 60 * 1000)
      });
    }

    // Capture request metadata
    const getClientIP = (req) => {
      return req.headers['x-forwarded-for'] ||
             req.headers['x-real-ip'] ||
             req.connection?.remoteAddress ||
             req.socket?.remoteAddress ||
             'unknown';
    };

    // Save contact message using RAW MongoDB
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: req.body.subject?.trim() || 'Contact Form Submission',
      message: message.trim(),
      phone: req.body.phone?.trim() || null,
      company: req.body.company?.trim() || null,
      messageType: req.body.messageType || 'general',
      priority: 'medium', // Default priority
      status: 'new',
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent'] || null,
      source: 'website',
      isSpam: false,
      readAt: null,
      repliedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertResult = await collection.insertOne(contactData, { maxTimeMS: 5000 });

    // Send emails using the existing email service
    let emailResult = null;
    let emailError = null;

    if (sendConfirmationEmail) {
      try {

        // Adapt the contact data to work with the booking email service
        emailResult = await sendConfirmationEmail({
          name: contactData.name,
          email: contactData.email,
          date: new Date().toISOString().split('T')[0], // Today's date
          time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }), // Current time
          meetingType: 'consultation', // Default type for contact inquiries
          timezone: 'UTC+05:30',
          bookingId: insertResult.insertedId,
          message: contactData.message,
          subject: contactData.subject
        });

      } catch (error) {

        emailError = error.message;
        // Continue - don't fail contact submission for email issues
      }
    } else {

      emailError = 'Email service not loaded';
    }

    const processingTime = Date.now() - startTime;

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! Thank you for reaching out.',
      contact: {
        id: insertResult.insertedId,
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        messageType: contactData.messageType,
        priority: contactData.priority,
        status: contactData.status
      },
      services: {
        database: { status: 'success', message: 'Contact message saved with RAW MongoDB' },
        email: emailResult
          ? { status: 'success', message: 'Confirmation sent' }
          : { status: 'failed', error: emailError }
      },
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;

    return res.status(500).json({
      success: false,
      error: 'Contact form submission failed',
      message: error.message,
      details: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET /api/contact/messages - Get contact messages (Admin) using RAW MongoDB
router.get('/messages', async (req, res) => {

  try {
    const {
      limit = 20,
      page = 1,
      status,
      priority,
      messageType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeSpam = 'false'
    } = req.query;

    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: 'Database not connected',
        message: 'Please try again in a moment'
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('contactmessages');

    // Build query
    const query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Filter by message type
    if (messageType && messageType !== 'all') {
      query.messageType = messageType;
    }

    // Exclude spam unless explicitly included
    if (includeSpam === 'false') {
      query.isSpam = { $ne: true };
    }

    // Search functionality
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
        { company: searchRegex }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination using RAW MongoDB
    const [messages, totalCount] = await Promise.all([
      collection.find(query, { maxTimeMS: 8000 })
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      collection.countDocuments(query, { maxTimeMS: 5000 })
    ]);

    // Format response
    const formattedMessages = messages.map(message => ({
      id: message._id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message.substring(0, 150) + (message.message.length > 150 ? '...' : ''),
      fullMessage: message.message,
      phone: message.phone,
      company: message.company,
      messageType: message.messageType,
      priority: message.priority,
      status: message.status,
      isSpam: message.isSpam,
      ipAddress: message.ipAddress,
      source: message.source,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      readAt: message.readAt,
      repliedAt: message.repliedAt
    }));

    const summary = {
      total: totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPrevPage: pageNum > 1
    };

    return res.status(200).json({
      success: true,
      messages: formattedMessages,
      summary,
      filters: {
        status,
        priority,
        messageType,
        search,
        includeSpam
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {

    return res.status(500).json({
      error: 'Failed to fetch messages',
      message: error.message
    });
  }
});

// Route-specific error handler
router.use((error, req, res, next) => {

  res.status(500).json({
    error: 'Contact route error',
    message: error.message,
    route: req.originalUrl,
    method: req.method
  });
});

module.exports = router;
