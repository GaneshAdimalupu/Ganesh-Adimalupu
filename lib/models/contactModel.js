// models/contactModel.js - CONTACT MESSAGE MODEL FOR EXPRESS
const mongoose = require('mongoose');

// Safe model cleanup for development
if (mongoose.models && mongoose.models.ContactMessage) {
  delete mongoose.models.ContactMessage;
}

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters'],
    default: 'General Inquiry'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
    minlength: [10, 'Message must be at least 10 characters']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
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
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  source: {
    type: String,
    enum: ['website', 'linkedin', 'email', 'referral', 'other'],
    default: 'website'
  },
  isSpam: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  repliedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Add indexes for better query performance
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ messageType: 1 });
contactMessageSchema.index({ priority: 1 });
contactMessageSchema.index({ isSpam: 1 });

// Pre-save middleware for spam detection and priority assignment
contactMessageSchema.pre('save', function(next) {

  // Auto-detect potential spam (simple heuristics)
  const spamKeywords = ['casino', 'lottery', 'viagra', 'crypto', 'bitcoin', 'investment opportunity', 'make money fast', 'click here', 'limited time'];
  const messageContent = (this.message + ' ' + (this.subject || '')).toLowerCase();
  const hasSpamKeywords = spamKeywords.some(keyword => messageContent.includes(keyword));

  if (hasSpamKeywords) {
    this.isSpam = true;
    this.priority = 'low';

  }

  // Auto-set priority based on keywords
  const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical', 'immediate', 'help'];
  const highPriorityKeywords = ['project', 'collaboration', 'job', 'opportunity', 'business', 'partnership'];

  if (urgentKeywords.some(keyword => messageContent.includes(keyword))) {
    this.priority = 'urgent';

  } else if (highPriorityKeywords.some(keyword => messageContent.includes(keyword))) {
    this.priority = 'high';

  }

  next();
});

// Post-save middleware for debugging
contactMessageSchema.post('save', function(doc, next) {

  next();
});

// Pre-find middleware for debugging
contactMessageSchema.pre(/^find/, function(next) {

  next();
});

// Static method to get messages by status
contactMessageSchema.statics.getMessagesByStatus = async function(status) {

  try {
    const messages = await this.find({ status }).sort({ createdAt: -1 });

    return messages;
  } catch (error) {

    throw error;
  }
};

// Static method to get priority messages
contactMessageSchema.statics.getPriorityMessages = async function() {

  try {
    const messages = await this.find({
      priority: { $in: ['high', 'urgent'] },
      status: { $ne: 'archived' }
    }).sort({ priority: -1, createdAt: -1 });

    return messages;
  } catch (error) {

    throw error;
  }
};

// Instance method to mark as read
contactMessageSchema.methods.markAsRead = async function() {
  if (this.status === 'new') {
    this.status = 'read';
    this.readAt = new Date();
    await this.save();

  }
  return this;
};

// Instance method to mark as replied
contactMessageSchema.methods.markAsReplied = async function() {
  this.status = 'replied';
  this.repliedAt = new Date();
  await this.save();

  return this;
};

// Instance method to get formatted details
contactMessageSchema.methods.getFormattedDetails = function() {
  return {
    id: this._id,
    from: `${this.name} <${this.email}>`,
    subject: this.subject || 'No Subject',
    message: this.message,
    messageType: this.messageType,
    priority: this.priority,
    status: this.status,
    company: this.company,
    phone: this.phone,
    isSpam: this.isSpam,
    submittedAt: this.createdAt,
    readAt: this.readAt,
    repliedAt: this.repliedAt
  };
};

// Error handling middleware
contactMessageSchema.post('save', function(error, doc, next) {
  if (error) {

    if (error.name === 'ValidationError') {

      Object.keys(error.errors).forEach(field => {

      });
    }

  }
  next(error);
});

// Export model safely
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;
