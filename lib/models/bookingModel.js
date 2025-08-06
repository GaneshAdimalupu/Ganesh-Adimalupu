// lib/models/bookingModel.js - Fixed version with no buffering
const mongoose = require('mongoose');

console.log('📊 Initializing Booking Model with NO BUFFERING...');

// Safe model cleanup for development
if (mongoose.models && mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
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
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  meetingType: {
    type: String,
    required: [true, 'Meeting type is required'],
    enum: {
      values: ['consultation', 'project-discussion', 'technical-review', 'follow-up'],
      message: 'Meeting type must be one of: consultation, project-discussion, technical-review, follow-up'
    }
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    match: [/^\d{1,2}:\d{2} (AM|PM)$/, 'Time must be in HH:MM AM/PM format']
  },
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    default: 'UTC+05:30'
  },
  googleCalendarEventId: {
    type: String,
    default: null
  },
  googleMeetLink: {
    type: String,
    default: null
  },
  googleCalendarLink: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  // CRITICAL: Disable buffering at schema level
  bufferCommands: false,
  bufferMaxEntries: 0
});

// Add indexes for better query performance
bookingSchema.index({ date: 1, time: 1 }, { unique: true });
bookingSchema.index({ email: 1 });
bookingSchema.index({ timestamp: -1 });

// Pre-save middleware for debugging (simplified)
bookingSchema.pre('save', function(next) {
  console.log('\n💾 BOOKING MODEL - PRE-SAVE (NO BUFFERING):');
  console.log('   Document to save:', {
    name: this.name,
    email: this.email,
    date: this.date,
    time: this.time,
    meetingType: this.meetingType
  });
  console.log('   Is new document:', this.isNew);
  next();
});

// Post-save middleware for debugging
bookingSchema.post('save', function(doc, next) {
  console.log('\n✅ BOOKING MODEL - POST-SAVE:');
  console.log('   Saved document ID:', doc._id);
  console.log('   Created at:', doc.createdAt);
  next();
});

// Pre-find middleware for debugging (simplified)
bookingSchema.pre(/^find/, function(next) {
  console.log('\n🔍 BOOKING MODEL - PRE-FIND (NO BUFFERING):');
  console.log('   Query:', this.getQuery());
  console.log('   Connection state:', mongoose.connection.readyState);

  // Check if we're connected before proceeding
  if (mongoose.connection.readyState !== 1) {
    console.log('   ❌ Not connected to MongoDB');
    return next(new Error('Database not connected'));
  }

  console.log('   ✅ Connected, proceeding with query');
  next();
});

// Post-find middleware for debugging
bookingSchema.post(/^find/, function(docs, next) {
  console.log('\n📋 BOOKING MODEL - POST-FIND:');
  if (Array.isArray(docs)) {
    console.log(`   Found ${docs.length} documents`);
    docs.forEach((doc, index) => {
      console.log(`   Document ${index + 1}:`, {
        id: doc._id,
        date: doc.date,
        time: doc.time,
        name: doc.name
      });
    });
  } else if (docs) {
    console.log('   Found 1 document:', {
      id: docs._id,
      date: docs.date,
      time: docs.time,
      name: docs.name
    });
  } else {
    console.log('   No documents found');
  }
  next();
});

// Error handling middleware
bookingSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('\n🚨 BOOKING MODEL - SAVE ERROR:');
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);

    if (error.name === 'ValidationError') {
      console.error('   Validation errors:');
      Object.keys(error.errors).forEach(field => {
        console.error(`     ${field}: ${error.errors[field].message}`);
      });
    }

    if (error.code === 11000) {
      console.error('   Duplicate key error - this time slot may already be booked');
      console.error('   Duplicate key:', error.keyValue);
    }
  }
  next(error);
});

// Static method to get bookings for a specific date (with connection check)
bookingSchema.statics.getBookingsForDate = async function(date) {
  console.log(`\n📅 Getting bookings for date: ${date}`);

  // Check connection first
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected');
  }

  try {
    const bookings = await this.find({ date }).sort({ time: 1 }).lean();
    console.log(`   Found ${bookings.length} bookings for ${date}`);
    return bookings;
  } catch (error) {
    console.error(`   Error getting bookings for ${date}:`, error);
    throw error;
  }
};

// Static method for safe find with connection check
bookingSchema.statics.safeFind = async function(query, options = {}) {
  console.log(`\n🛡️ Safe find with query:`, query);

  // Check connection first
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected');
  }

  try {
    let queryBuilder = this.find(query);

    if (options.lean !== false) {
      queryBuilder = queryBuilder.lean(); // Default to lean for better performance
    }

    if (options.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
    }

    if (options.sort) {
      queryBuilder = queryBuilder.sort(options.sort);
    }

    const results = await queryBuilder;
    console.log(`   Safe find completed: ${results.length} documents`);
    return results;
  } catch (error) {
    console.error(`   Safe find error:`, error.message);
    throw error;
  }
};

// Instance method to format booking details
bookingSchema.methods.getFormattedDetails = function() {
  return {
    id: this._id,
    clientName: this.name,
    email: this.email,
    meetingType: this.meetingType.replace('-', ' '),
    dateTime: `${this.date} at ${this.time}`,
    timezone: this.timezone,
    status: this.status,
    hasCalendarEvent: !!this.googleCalendarEventId,
    hasMeetLink: !!this.googleMeetLink
  };
};

console.log('✅ Booking schema created with NO BUFFERING and connection checks');

// Export model safely for all environments
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// Set additional no-buffering options on the model
Booking.schema.set('bufferCommands', false);

console.log('📊 Booking model exported with NO BUFFERING');

module.exports = Booking;
