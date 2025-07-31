// models/bookingModel.js - DEBUG VERSION
const mongoose = require('mongoose');

console.log('📊 Initializing Booking Model...');

// Safe model cleanup for Vercel
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
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Add indexes for better query performance
bookingSchema.index({ date: 1, time: 1 }, { unique: true });
bookingSchema.index({ email: 1 });
bookingSchema.index({ timestamp: -1 });

// Pre-save middleware for debugging
bookingSchema.pre('save', function(next) {
  console.log('\n💾 BOOKING MODEL - PRE-SAVE:');
  console.log('   Document to save:', JSON.stringify(this.toObject(), null, 2));
  console.log('   Is new document:', this.isNew);
  console.log('   Modified fields:', this.modifiedPaths());
  next();
});

// Post-save middleware for debugging
bookingSchema.post('save', function(doc, next) {
  console.log('\n✅ BOOKING MODEL - POST-SAVE:');
  console.log('   Saved document ID:', doc._id);
  console.log('   Created at:', doc.createdAt);
  console.log('   Document:', JSON.stringify(doc.toObject(), null, 2));
  next();
});

// Pre-find middleware for debugging
bookingSchema.pre(/^find/, function(next) {
  console.log('\n🔍 BOOKING MODEL - PRE-FIND:');
  console.log('   Query:', this.getQuery());
  console.log('   Options:', this.getOptions());
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
        name: doc.name,
        meetingType: doc.meetingType
      });
    });
  } else if (docs) {
    console.log('   Found 1 document:', {
      id: docs._id,
      date: docs.date,
      time: docs.time,
      name: docs.name,
      meetingType: docs.meetingType
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

    console.error('   Full error:', error);
  }
  next(error);
});

// Static method to get bookings for a specific date
bookingSchema.statics.getBookingsForDate = async function(date) {
  console.log(`\n📅 Getting bookings for date: ${date}`);

  try {
    const bookings = await this.find({ date }).sort({ time: 1 });
    console.log(`   Found ${bookings.length} bookings for ${date}`);
    return bookings;
  } catch (error) {
    console.error(`   Error getting bookings for ${date}:`, error);
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
    hasCalendarEvent: !!this.googleCalendarEventId
  };
};

console.log('✅ Booking schema created with validation and debugging');

//const Booking = mongoose.model('Booking', bookingSchema);



//module.exports = Booking;


// Export model safely for Vercel
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

console.log('📊 Booking model exported');

module.exports = Booking;
