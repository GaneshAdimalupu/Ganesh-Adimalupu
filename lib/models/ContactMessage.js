import mongoose from 'mongoose';

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
    readAt: { type: Date, default: null },
    repliedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Auto-detect spam and set priority
contactMessageSchema.pre('save', function (next) {
  if (this.isModified('message') || this.isModified('subject')) {
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
  }
  next();
});

// Export model safely for serverless environments
export default mongoose.models.ContactMessage ||
  mongoose.model('ContactMessage', contactMessageSchema);
