// api/contact/submit.js - REFACTORED to use central email service
import mongoose from 'mongoose';

// Import the specific function from your central email service
// Adjust the path ('../../lib/services/emailService') if your folder structure is different
import { sendContactNotification } from '../../lib/services/emailService';

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI;
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    if (!MONGODB_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

// Contact Message Model Schema (re-using the same schema)
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
      default: 'General Inquiry',
    },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    phone: { type: String, trim: true, maxlength: 20 },
    company: { type: String, trim: true, maxlength: 100 },
    messageType: {
      type: String,
      enum: ['general', 'project', 'collaboration', 'support', 'other'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    source: {
      type: String,
      enum: ['website', 'linkedin', 'email', 'referral', 'other'],
      default: 'website',
    },
    isSpam: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-detect spam and set priority
contactMessageSchema.pre('save', function (next) {
  const spamKeywords = ['casino', 'lottery', 'viagra', 'crypto', 'bitcoin'];
  const messageContent = (
    this.message +
    ' ' +
    (this.subject || '')
  ).toLowerCase();
  if (spamKeywords.some((keyword) => messageContent.includes(keyword))) {
    this.isSpam = true;
    this.priority = 'low';
  }
  next();
});

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model('ContactMessage', contactMessageSchema);

// MAIN SERVERLESS FUNCTION
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: name, email, message' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    await connectDB();

    const recentSubmission = await ContactMessage.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    });

    if (recentSubmission) {
      return res
        .status(429)
        .json({ error: 'Rate limit exceeded. Please wait 5 minutes.' });
    }

    const getClientIP = (req) =>
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      'unknown';

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
    };

    const contactMessage = new ContactMessage(contactData);
    const savedMessage = await contactMessage.save();

    // --- EMAIL LOGIC ---
    // Use the imported central email function
    let emailError = null;
    try {
      await sendContactNotification({
        ...savedMessage.toObject(), // Pass the saved data to the function
        contactId: savedMessage._id,
      });
    } catch (error) {
      console.error('Centralized email sending failed:', error.message);
      emailError = error.message;
    }

    const processingTime = Date.now() - startTime;

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! Thank you for reaching out.',
      contact: {
        id: savedMessage._id,
        priority: savedMessage.priority,
        status: savedMessage.status,
      },
      services: {
        database: { status: 'success', message: 'Contact message saved' },
        email: emailError
          ? { status: 'failed', error: emailError }
          : { status: 'success', message: 'Notifications sent' },
      },
      processingTime: `${processingTime}ms`,
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Error in /api/contact/submit:', error);
    return res.status(500).json({
      success: false,
      error: 'Contact form submission failed',
      message: error.message,
      processingTime: `${processingTime}ms`,
    });
  }
}
