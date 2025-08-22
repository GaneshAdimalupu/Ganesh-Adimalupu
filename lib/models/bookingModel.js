// api/lib/models/bookingModel.js - UPDATED WITH ENHANCED FIELDS
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Basic contact information
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },

    // Meeting details
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },

    time: {
      type: String,
      required: [true, 'Time is required'],
      match: [/^\d{2}:\d{2} (AM|PM)$/, 'Time must be in HH:MM AM/PM format'],
    },

    // NEW: Meeting type and subject
    meetingType: {
      type: String,
      required: [true, 'Meeting type is required'],
      enum: {
        values: [
          'consultation',
          'project-discussion',
          'technical-review',
          'career-guidance',
          'collaboration',
          'follow-up',
          'other',
        ],
        message: 'Invalid meeting type',
      },
      default: 'consultation',
    },

    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },

    // Optional message
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      default: '',
    },

    // Meeting metadata
    timezone: {
      type: String,
      default: 'UTC+05:30',
    },

    duration: {
      type: Number,
      default: 30,
      min: [15, 'Duration must be at least 15 minutes'],
      max: [120, 'Duration cannot exceed 120 minutes'],
    },

    // Booking status
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled', 'completed'],
        message: 'Invalid booking status',
      },
      default: 'confirmed',
    },

    // External service integration
    calendarEventId: {
      type: String,
      default: null,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    // Audit fields
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // Additional contact info (optional)
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number too long'],
    },

    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name too long'],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    collection: 'bookings',
  }
);

// Indexes for better query performance
bookingSchema.index({ date: 1, time: 1 }, { unique: true }); // Prevent double booking
bookingSchema.index({ email: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ status: 1 });

// Virtual for getting duration based on meeting type
bookingSchema.virtual('calculatedDuration').get(function () {
  const durationMap = {
    consultation: 30,
    'project-discussion': 45,
    'technical-review': 60,
    'career-guidance': 30,
    collaboration: 45,
    'follow-up': 15,
    other: 30,
  };

  return durationMap[this.meetingType] || this.duration || 30;
});

// Pre-save middleware to update the updatedAt field
bookingSchema.pre('save', function (next) {
  this.updatedAt = new Date();

  // Auto-set duration based on meeting type if not provided
  if (!this.duration) {
    const durationMap = {
      consultation: 30,
      'project-discussion': 45,
      'technical-review': 60,
      'career-guidance': 30,
      collaboration: 45,
      'follow-up': 15,
      other: 30,
    };
    this.duration = durationMap[this.meetingType] || 30;
  }

  // Auto-set subject if not provided
  if (!this.subject) {
    const subjectMap = {
      consultation: 'Free Consultation',
      'project-discussion': 'Project Discussion',
      'technical-review': 'Technical Review/Code Review',
      'career-guidance': 'Career Guidance',
      collaboration: 'Business Collaboration',
      'follow-up': 'Follow-up Meeting',
      other: 'General Meeting',
    };
    this.subject = subjectMap[this.meetingType] || 'Meeting';
  }

  next();
});

// Instance method to get formatted date and time
bookingSchema.methods.getFormattedDateTime = function () {
  const date = new Date(this.date);
  return {
    date: date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: this.time,
    timezone: this.timezone,
  };
};

// Static method to find bookings by date range
bookingSchema.statics.findByDateRange = function (startDate, endDate) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1, time: 1 });
};

// Static method to get available time slots for a specific date
bookingSchema.statics.getAvailableSlots = async function (
  date,
  dayType = 'weekday'
) {
  const weekdaySlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];
  const weekendSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];
  const sundaySlots = [
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];

  let allSlots;
  if (dayType === 'sunday') {
    allSlots = sundaySlots;
  } else if (dayType === 'saturday') {
    allSlots = weekendSlots;
  } else {
    allSlots = weekdaySlots;
  }

  const bookedSlots = await this.find({ date }).select('time -_id');
  const bookedTimes = bookedSlots.map((booking) => booking.time);

  return allSlots.filter((slot) => !bookedTimes.includes(slot));
};

module.exports = mongoose.model('Booking', bookingSchema);
