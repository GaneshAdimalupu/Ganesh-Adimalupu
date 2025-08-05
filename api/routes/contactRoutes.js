// routes/contactRoutes.js - CONTACT FORM ROUTES
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/contactModel');

console.log('📧 Initializing contact form routes...');

// Import the contact email service
let sendContactFormEmails;
try {
  const contactEmailService = require('../services/contactEmailService');
  sendContactFormEmails = contactEmailService.sendContactFormEmails;
  console.log('✅ Contact email service loaded');
} catch (error) {
  console.error('⚠️ Contact email service loading failed:', error.message);
}

// Add debug middleware for all contact routes
router.use((req, res, next) => {
  console.log('\n📧 CONTACT ROUTE MIDDLEWARE:');
  console.log(`   Route: ${req.method} /api/contact${req.url}`);
  console.log(`   Base URL: ${req.baseUrl}`);
  console.log(`   Original URL: ${req.originalUrl}`);
  console.log(`   Parameters:`, req.params);
  console.log(`   Query:`, req.query);
  console.log(`   Body keys:`, Object.keys(req.body));
  console.log('   Timestamp:', new Date().toISOString());
  next();
});

// POST /api/contact/submit - Submit contact form
router.post('/submit', async (req, res) => {
  console.log('\n📧 CONTACT FORM SUBMISSION');
  const startTime = Date.now();

  try {
    console.log('📋 Processing contact form submission');

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

    // Rate limiting - check for recent submissions from same email
    const recentSubmission = await ContactMessage.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes
    });

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

    // Save contact message
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: req.body.subject?.trim() || 'Contact Form Submission',
      message: message.trim(),
      phone: req.body.phone?.trim() || null,
      company: req.body.company?.trim() || null,
      messageType: req.body.messageType || 'general',
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent'] || null,
      source: 'website'
    };

    console.log('💾 Saving contact message to database...');
    const contactMessage = new ContactMessage(contactData);
    const savedMessage = await contactMessage.save();

    console.log('✅ Contact message saved successfully:', savedMessage._id);

    // Send emails
    let emailResult = null;
    let emailError = null;

    if (sendContactFormEmails) {
      try {
        console.log('📧 Sending confirmation emails...');
        emailResult = await sendContactFormEmails({
          ...contactData,
          contactId: savedMessage._id,
          priority: savedMessage.priority,
          isSpam: savedMessage.isSpam
        });
        console.log('✅ Contact form emails sent');
      } catch (error) {
        console.error('⚠️ Email sending failed:', error.message);
        emailError = error.message;
        // Continue - don't fail contact submission for email issues
      }
    } else {
      console.log('⚠️ Email service not available');
      emailError = 'Email service not loaded';
    }

    const processingTime = Date.now() - startTime;

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! Thank you for reaching out.',
      contact: {
        id: savedMessage._id,
        name: savedMessage.name,
        email: savedMessage.email,
        subject: savedMessage.subject,
        messageType: savedMessage.messageType,
        priority: savedMessage.priority,
        status: savedMessage.status
      },
      services: {
        database: { status: 'success', message: 'Contact message saved' },
        autoReply: emailResult?.autoReply
          ? { status: 'success', message: 'Auto-reply sent' }
          : { status: 'failed', error: emailError },
        adminNotification: emailResult?.adminNotification
          ? { status: 'success', message: 'Admin notification sent' }
          : { status: 'failed', error: emailError }
      },
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ Contact form submission failed:', error);

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

// GET /api/contact/messages - Get contact messages (Admin)
router.get('/messages', async (req, res) => {
  console.log('\n📨 GET CONTACT MESSAGES');

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

    console.log('📋 Fetching contact messages with filters:', {
      limit: parseInt(limit),
      page: parseInt(page),
      status,
      priority,
      messageType,
      search,
      includeSpam
    });

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

    // Execute query with pagination
    const [messages, totalCount] = await Promise.all([
      ContactMessage.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .select('-__v')
        .lean(),
      ContactMessage.countDocuments(query)
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

    console.log(`✅ Fetched ${messages.length} messages (${totalCount} total)`);

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
    console.error('❌ Failed to fetch contact messages:', error);
    return res.status(500).json({
      error: 'Failed to fetch messages',
      message: error.message
    });
  }
});

// PUT /api/contact/messages/:messageId - Update message status
router.put('/messages/:messageId', async (req, res) => {
  console.log('\n📝 UPDATE CONTACT MESSAGE');
  const { messageId } = req.params;
  const { status, priority, isSpam } = req.body;

  try {
    console.log(`📝 Updating message ${messageId}:`, { status, priority, isSpam });

    const updateData = {};

    // Validate and set status
    if (status) {
      const validStatuses = ['new', 'read', 'replied', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid status',
          validStatuses
        });
      }
      updateData.status = status;
      
      // Set timestamps based on status
      if (status === 'read' && !updateData.readAt) {
        updateData.readAt = new Date();
      } else if (status === 'replied') {
        updateData.repliedAt = new Date();
      }
    }

    // Validate and set priority
    if (priority) {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          error: 'Invalid priority',
          validPriorities
        });
      }
      updateData.priority = priority;
    }

    // Set spam flag
    if (typeof isSpam === 'boolean') {
      updateData.isSpam = isSpam;
    }

    // Update the message
    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        error: 'Message not found',
        messageId
      });
    }

    console.log(`✅ Message ${messageId} updated successfully`);

    return res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      updatedMessage: {
        id: updatedMessage._id,
        status: updatedMessage.status,
        priority: updatedMessage.priority,
        isSpam: updatedMessage.isSpam,
        readAt: updatedMessage.readAt,
        repliedAt: updatedMessage.repliedAt,
        updatedAt: updatedMessage.updatedAt
      }
    });

  } catch (error) {
    console.error(`❌ Failed to update message ${messageId}:`, error);
    return res.status(500).json({
      error: 'Failed to update message',
      message: error.message
    });
  }
});

// DELETE /api/contact/messages/:messageId - Delete or archive message
router.delete('/messages/:messageId', async (req, res) => {
  console.log('\n🗑️ DELETE CONTACT MESSAGE');
  const { messageId } = req.params;
  const { permanent = false } = req.body;

  try {
    console.log(`🗑️ ${permanent ? 'Permanently deleting' : 'Archiving'} message ${messageId}`);

    const message = await ContactMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        error: 'Message not found',
        messageId
      });
    }

    if (permanent) {
      // Permanently delete the message
      await ContactMessage.findByIdAndDelete(messageId);
      console.log(`✅ Message ${messageId} permanently deleted`);

      return res.status(200).json({
        success: true,
        message: 'Message permanently deleted',
        deletedMessage: {
          id: message._id,
          name: message.name,
          email: message.email,
          subject: message.subject
        }
      });
    } else {
      // Archive the message
      const archivedMessage = await ContactMessage.findByIdAndUpdate(
        messageId,
        { status: 'archived' },
        { new: true }
      );

      console.log(`✅ Message ${messageId} archived`);

      return res.status(200).json({
        success: true,
        message: 'Message archived successfully',
        archivedMessage: {
          id: archivedMessage._id,
          status: archivedMessage.status,
          updatedAt: archivedMessage.updatedAt
        }
      });
    }

  } catch (error) {
    console.error(`❌ Failed to ${permanent ? 'delete' : 'archive'} message ${messageId}:`, error);
    return res.status(500).json({
      error: `Failed to ${permanent ? 'delete' : 'archive'} message`,
      message: error.message
    });
  }
});

// GET /api/contact/stats - Get contact statistics
router.get('/stats', async (req, res) => {
  console.log('\n📊 GET CONTACT STATISTICS');

  try {
    const { timeframe = '30d' } = req.query;

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date('2020-01-01');
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const baseQuery = { 
      createdAt: { $gte: startDate },
      isSpam: { $ne: true }
    };

    // Get basic statistics
    const [totalStats, statusBreakdown, priorityBreakdown] = await Promise.all([
      ContactMessage.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            avgMessageLength: { $avg: { $strLenCP: '$message' } },
            uniqueContacts: { $addToSet: '$email' }
          }
        },
        {
          $project: {
            totalMessages: 1,
            avgMessageLength: { $round: ['$avgMessageLength', 0] },
            uniqueContacts: { $size: '$uniqueContacts' }
          }
        }
      ]),

      ContactMessage.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      ContactMessage.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const stats = {
      overview: {
        totalMessages: totalStats[0]?.totalMessages || 0,
        uniqueContacts: totalStats[0]?.uniqueContacts || 0,
        avgMessageLength: totalStats[0]?.avgMessageLength || 0,
        timeframe,
        startDate,
        endDate: now
      },
      breakdown: {
        status: statusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        priority: priorityBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    };

    console.log('✅ Contact statistics generated successfully');
    console.log(`   Total messages: ${stats.overview.totalMessages}`);
    console.log(`   Unique contacts: ${stats.overview.uniqueContacts}`);

    return res.status(200).json({
      success: true,
      statistics: stats,
      meta: {
        generatedAt: new Date().toISOString(),
        timeframe,
        databaseStatus: 'connected'
      }
    });

  } catch (error) {
    console.error('❌ Failed to generate contact statistics:', error);
    return res.status(500).json({
      error: 'Failed to generate statistics',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Route-specific error handler
router.use((error, req, res, next) => {
  console.error('\n🚨 CONTACT ROUTE ERROR:');
  console.error('   Route:', req.method, req.originalUrl);
  console.error('   Error:', error.message);
  console.error('   Stack:', error.stack);

  res.status(500).json({
    error: 'Contact route error',
    message: error.message,
    route: req.originalUrl,
    method: req.method
  });
});

console.log('✅ Contact routes configured:');
console.log('   POST /api/contact/submit');
console.log('   GET  /api/contact/messages');
console.log('   PUT  /api/contact/messages/:messageId');
console.log('   DELETE /api/contact/messages/:messageId');
console.log('   GET  /api/contact/stats');

module.exports = router;