// api/contact/messages.js - CONTACT MESSAGES ADMIN ENDPOINT
import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI;
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    if (!MONGODB_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;

    return mongoose.connection;
  } catch (error) {

    isConnected = false;
    throw error;
  }
}

// Contact Message Model Schema (same as submit endpoint)
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, trim: true, maxlength: 200, default: 'General Inquiry' },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  phone: { type: String, trim: true, maxlength: 20 },
  company: { type: String, trim: true, maxlength: 100 },
  messageType: {
    type: String,
    enum: ['general', 'project', 'collaboration', 'support', 'other'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
  source: {
    type: String,
    enum: ['website', 'linkedin', 'email', 'referral', 'other'],
    default: 'website'
  },
  isSpam: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  repliedAt: { type: Date, default: null }
}, {
  timestamps: true
});

// Export model safely for serverless
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

// MAIN SERVERLESS FUNCTION
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    switch (req.method) {
      case 'GET':
        return await handleGetMessages(req, res);
      case 'PUT':
        return await handleUpdateMessage(req, res);
      case 'DELETE':
        return await handleDeleteMessage(req, res);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          allowedMethods: ['GET', 'PUT', 'DELETE'],
          received: req.method
        });
    }
  } catch (error) {

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// GET: Fetch contact messages with filtering and pagination
async function handleGetMessages(req, res) {
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

  try {

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

    // Get summary statistics
    const [statusCounts, priorityCounts, newMessagesCount] = await Promise.all([
      ContactMessage.aggregate([
        { $match: { isSpam: { $ne: true } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      ContactMessage.aggregate([
        { $match: { isSpam: { $ne: true } } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      ContactMessage.countDocuments({ status: 'new', isSpam: { $ne: true } })
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
      hasPrevPage: pageNum > 1,
      newMessages: newMessagesCount,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      priorityCounts: priorityCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
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
}

// PUT: Update message status
async function handleUpdateMessage(req, res) {
  const { messageId } = req.query;
  const { status, priority, isSpam } = req.body;

  if (!messageId) {
    return res.status(400).json({
      error: 'Missing messageId parameter'
    });
  }

  try {

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

    return res.status(500).json({
      error: 'Failed to update message',
      message: error.message
    });
  }
}

// DELETE: Delete or archive message
async function handleDeleteMessage(req, res) {
  const { messageId } = req.query;
  const { permanent = false } = req.body;

  if (!messageId) {
    return res.status(400).json({
      error: 'Missing messageId parameter'
    });
  }

  try {

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

    return res.status(500).json({
      error: `Failed to ${permanent ? 'delete' : 'archive'} message`,
      message: error.message
    });
  }
}
