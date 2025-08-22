// api/controllers/scheduleController.js - UPDATED WITH SUBJECT SUPPORT
const Booking = require('../lib/models/bookingModel');

exports.getAvailability = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date required' });
  }

  try {
    const bookingsOnDate = await Booking.find({ date });
    const unavailableSlots = bookingsOnDate.map((booking) => booking.time);

    res.json(unavailableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    // Enhanced validation for new fields
    const { name, email, date, time, meetingType, subject, message } = req.body;

    const requiredFields = [];
    if (!name) requiredFields.push('name');
    if (!email) requiredFields.push('email');
    if (!date) requiredFields.push('date');
    if (!time) requiredFields.push('time');
    if (!meetingType) requiredFields.push('meetingType');

    if (requiredFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: requiredFields,
        received: Object.keys(req.body),
      });
    }

    // Check for existing booking
    const existingBooking = await Booking.findOne({
      date: req.body.date,
      time: req.body.time,
    });

    if (existingBooking) {
      return res.status(409).json({
        message: 'Time slot already booked',
        error:
          'This time slot has been booked by another user. Please select a different time.',
      });
    }

    // Create booking data with new fields
    const bookingData = {
      name,
      email,
      date,
      time,
      meetingType,
      subject: subject || getSubjectLabel(meetingType),
      message: message || '',
      timezone: req.body.timezone || 'UTC+05:30',
      createdAt: new Date(),
      status: 'confirmed',
    };

    // Save to database
    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    // Here you would integrate with your existing calendar and email services
    // Example:
    // const calendarService = require('../services/googleCalendarService');
    // const emailService = require('../services/emailService');

    // try {
    //   const calendarEventId = await calendarService.createCalendarEvent(bookingData);
    //   await emailService.sendMeetingConfirmation({ ...bookingData, calendarEventId });
    // } catch (serviceError) {
    //   console.log('Service integration error:', serviceError.message);
    // }

    res.status(201).json({
      message: 'Meeting scheduled successfully!',
      bookingId: savedBooking._id,
      details: {
        date: savedBooking.date,
        time: savedBooking.time,
        subject: savedBooking.subject,
        duration: getDuration(savedBooking.meetingType),
      },
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      message: 'Booking failed',
      error: error.message,
    });
  }
};

// Helper function to get subject label from meeting type
function getSubjectLabel(meetingType) {
  const subjectMap = {
    consultation: 'Free Consultation',
    'project-discussion': 'Project Discussion',
    'technical-review': 'Technical Review/Code Review',
    'career-guidance': 'Career Guidance',
    collaboration: 'Business Collaboration',
    'follow-up': 'Follow-up Meeting',
    other: 'General Meeting',
  };

  return subjectMap[meetingType] || 'Meeting';
}

// Helper function to get duration from meeting type
function getDuration(meetingType) {
  const durationMap = {
    consultation: 30,
    'project-discussion': 45,
    'technical-review': 60,
    'career-guidance': 30,
    collaboration: 45,
    'follow-up': 15,
    other: 30,
  };

  return durationMap[meetingType] || 30;
}
