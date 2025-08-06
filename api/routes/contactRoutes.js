// api/routes/contactRoutes.js - REFACTORED
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import the specific email service function needed for this route
let sendContactNotification;
try {
  const emailService = require('../../lib/services/emailService');
  sendContactNotification = emailService.sendContactNotification;
} catch (error) {
  console.error('Failed to load email service for contact routes:', error);
  // Set the function to null so we can check for its existence later
  sendContactNotification = null;
}

// POST /api/contact/submit - Submit contact form
router.post('/submit', async (req, res) => {
  const startTime = Date.now();

  try {
    // Validate required fields
    const { name, email, message } = req.body;
    const missingFields = [];

    if (!name || name.trim().length < 2)
      missingFields.push('name (minimum 2 characters)');
    if (!email) missingFields.push('email');
    if (!message || message.trim().length < 10)
      missingFields.push('message (minimum 10 characters)');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Invalid form data',
        missingFields,
        received: Object.keys(req.body),
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        received: email,
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: 'Database not connected',
        message: 'Please try again in a moment',
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('contactmessages');

    // Rate limiting - check for recent submissions from the same email
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentSubmission = await collection.findOne(
      {
        email: email.toLowerCase(),
        createdAt: { $gte: fiveMinutesAgo },
      },
      { maxTimeMS: 5000 }
    );

    if (recentSubmission) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Please wait 5 minutes before submitting another message',
      });
    }

    // Capture request metadata
    const getClientIP = (req) => {
      return (
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        'unknown'
      );
    };

    // Prepare contact data for insertion
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
      updatedAt: new Date(),
    };

    const insertResult = await collection.insertOne(contactData, {
      maxTimeMS: 5000,
    });

    // Send emails using the new, dedicated contact email service
    let emailError = null;

    if (sendContactNotification) {
      try {
        // Pass the contact data directly. No adaptation needed.
        await sendContactNotification({
          ...contactData,
          contactId: insertResult.insertedId, // Pass the new ID for reference
        });
      } catch (error) {
        console.error('Contact email sending failed:', error.message);
        emailError = error.message;
        // Continue - don't fail the API request just because email failed
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
      },
      services: {
        database: { status: 'success', message: 'Contact message saved' },
        email: !emailError
          ? { status: 'success', message: 'Notifications sent' }
          : { status: 'failed', error: emailError },
      },
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Error in /api/contact/submit:', error);
    return res.status(500).json({
      success: false,
      error: 'Contact form submission failed',
      message: error.message,
      details: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// GET /api/contact/messages - Get contact messages (for an Admin dashboard)
router.get('/messages', async (req, res) => {
  try {
    const {
      limit = 20,
      page = 1,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('contactmessages');

    // Build query
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ];
    }

    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [messages, totalCount] = await Promise.all([
      collection
        .find(query, { maxTimeMS: 8000 })
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      collection.countDocuments(query, { maxTimeMS: 5000 }),
    ]);

    return res.status(200).json({
      success: true,
      messages: messages.map((msg) => ({ ...msg, id: msg._id })), // Ensure 'id' field is present
      summary: {
        total: totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/contact/messages:', error);
    return res.status(500).json({
      error: 'Failed to fetch messages',
      message: error.message,
    });
  }
});

// Route-specific error handler
router.use((error, req, res, next) => {
  console.error(
    `Error in contact route [${req.method} ${req.originalUrl}]:`,
    error
  );
  res.status(500).json({
    error: 'Contact route error',
    message: error.message,
  });
});

module.exports = router;
