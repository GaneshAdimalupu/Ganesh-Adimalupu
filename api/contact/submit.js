// api/contact/submit.js - REFACTORED to use central DB and Model
import connectDB from '../../lib/db/mongodb';
import ContactMessage from '../../lib/models/ContactMessage';
import { sendContactNotification } from '../../lib/services/emailService';

// The local connectDB function and contactMessageSchema have been removed from this file.

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    // --- Validation ---
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: name, email, message' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // --- Database Connection ---
    await connectDB();

    // --- Rate Limiting ---
    const recentSubmission = await ContactMessage.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // 5 minutes
    });

    if (recentSubmission) {
      return res
        .status(429)
        .json({ error: 'Rate limit exceeded. Please wait 5 minutes.' });
    }

    // --- Data Preparation ---
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

    // --- Save to Database ---
    const contactMessage = new ContactMessage(contactData);
    const savedMessage = await contactMessage.save();

    // --- Email Sending ---
    let emailError = null;
    try {
      await sendContactNotification({
        ...savedMessage.toObject(),
        contactId: savedMessage._id,
      });
    } catch (error) {
      console.error('Centralized email sending failed:', error.message);
      emailError = error.message; // Log error but don't fail the request
    }

    const processingTime = Date.now() - startTime;

    // --- Success Response ---
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! Thank you for reaching out.',
      contact: {
        id: savedMessage._id,
        priority: savedMessage.priority,
        status: savedMessage.status,
      },
      services: {
        database: { status: 'success' },
        email: emailError
          ? { status: 'failed', error: emailError }
          : { status: 'success' },
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
