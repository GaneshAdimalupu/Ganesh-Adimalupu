const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
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
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    meetingType: {
      type: String,
      required: [true, 'Meeting type is required'],
      enum: {
        values: [
          'consultation',
          'project-discussion',
          'technical-review',
          'follow-up',
        ],
        message:
          'Meeting type must be one of: consultation, project-discussion, technical-review, follow-up',
      },
    },
    // FIXED: Strict date format validation
    date: {
      type: String,
      required: [true, 'Date is required'],
      validate: {
        validator: function (v) {
          // Validate YYYY-MM-DD format
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(v)) return false;

          // Validate it's a real date
          const dateParts = v.split('-');
          const testDate = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
          return !isNaN(testDate.getTime());
        },
        message: 'Date must be in YYYY-MM-DD format and be a valid date',
      },
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      match: [/^\d{1,2}:\d{2} (AM|PM)$/, 'Time must be in HH:MM AM/PM format'],
    },
    timezone: {
      type: String,
      required: [true, 'Timezone is required'],
      default: 'UTC+05:30',
    },
    googleCalendarEventId: {
      type: String,
      default: null,
    },
    googleMeetLink: {
      type: String,
      default: null,
    },
    googleCalendarLink: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
    bufferCommands: false,
    bufferMaxEntries: 0,
  }
);

// Create compound index for date and time uniqueness
bookingSchema.index({ date: 1, time: 1 }, { unique: true });

// Additional indexes for performance
bookingSchema.index({ email: 1 });
bookingSchema.index({ timestamp: -1 });

// Pre-save middleware for debugging
bookingSchema.pre('save', function (next) {
  console.log('💾 About to save booking:', {
    date: this.date,
    time: this.time,
    name: this.name,
    email: this.email,
  });
  next();
});

// Post-save middleware for confirmation
bookingSchema.post('save', function (doc, next) {
  console.log('✅ Booking saved to database:', {
    id: doc._id,
    date: doc.date,
    time: doc.time,
    createdAt: doc.createdAt,
  });
  next();
});

// Static method to safely find bookings
bookingSchema.statics.findByDateSafe = async function (date) {
  console.log('🔍 Searching for bookings on date:', date);

  try {
    const bookings = await this.find({ date }).lean();
    console.log('📊 Found bookings:', {
      date: date,
      count: bookings.length,
      bookings: bookings.map((b) => ({ time: b.time, name: b.name })),
    });
    return bookings;
  } catch (error) {
    console.error('❌ Error finding bookings:', error);
    throw error;
  }
};

// Export model safely
const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
module.exports = Booking;
