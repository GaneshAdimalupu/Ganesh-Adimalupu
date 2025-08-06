// api/contact/messages.js - REFACTORED to use central DB and Model
import connectDB from '../../lib/db/mongodb';
import ContactMessage from '../../lib/models/ContactMessage';

// The local connectDB function and contactMessageSchema have been removed from this file.

// MAIN SERVERLESS FUNCTION
export default async function handler(req, res) {
  // Set CORS headers for admin dashboard access
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or lock down to your specific admin domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Establish DB connection once for the request
    await connectDB();

    switch (req.method) {
      case 'GET':
        return await handleGetMessages(req, res);
      case 'PUT':
        return await handleUpdateMessage(req, res);
      case 'DELETE':
        return await handleDeleteMessage(req, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Error in /api/contact/messages handler:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

// --- HANDLER FUNCTIONS ---

// GET: Fetch contact messages with filtering and pagination
async function handleGetMessages(req, res) {
  try {
    const {
      limit = 20,
      page = 1,
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
      ];
    }

    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [messages, totalCount] = await Promise.all([
      ContactMessage.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ContactMessage.countDocuments(query),
    ]);

    const summary = {
      total: totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
    };

    return res.status(200).json({
      success: true,
      messages: messages.map((msg) => ({ ...msg, id: msg._id })),
      summary,
    });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return res.status(500).json({
      error: 'Failed to fetch messages',
      message: error.message,
    });
  }
}

// PUT: Update a message's status, priority, etc.
async function handleUpdateMessage(req, res) {
  try {
    const { messageId } = req.query;
    const { status, priority, isSpam } = req.body;

    if (!messageId) {
      return res.status(400).json({ error: 'Missing messageId parameter' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (typeof isSpam === 'boolean') updateData.isSpam = isSpam;
    if (status === 'read' && !updateData.readAt) updateData.readAt = new Date();
    if (status === 'replied') updateData.repliedAt = new Date();

    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      messageId,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      updatedMessage: { ...updatedMessage, id: updatedMessage._id },
    });
  } catch (error) {
    console.error('Failed to update message:', error);
    return res.status(500).json({
      error: 'Failed to update message',
      message: error.message,
    });
  }
}

// DELETE: Permanently delete or archive a message
async function handleDeleteMessage(req, res) {
  try {
    const { messageId } = req.query;
    const { permanent = 'false' } = req.query; // Use query param for simplicity

    if (!messageId) {
      return res.status(400).json({ error: 'Missing messageId parameter' });
    }

    const message = await ContactMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (permanent === 'true') {
      await ContactMessage.findByIdAndDelete(messageId);
      return res.status(200).json({
        success: true,
        message: 'Message permanently deleted',
        deletedId: message._id,
      });
    } else {
      message.status = 'archived';
      await message.save();
      return res.status(200).json({
        success: true,
        message: 'Message archived successfully',
        archivedMessage: { id: message._id, status: message.status },
      });
    }
  } catch (error) {
    console.error('Failed to delete message:', error);
    return res.status(500).json({
      error: 'Failed to delete or archive message',
      message: error.message,
    });
  }
}
