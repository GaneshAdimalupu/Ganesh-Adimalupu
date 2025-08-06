// api/controllers/scheduleController.js - MINIMAL TEST VERSION
const Booking = require('../lib/models/bookingModel');

exports.getAvailability = async (req, res) => {
  console.log('🔍 GET AVAILABILITY REQUEST:', req.query);
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date required' });
  }

  try {
    const bookingsOnDate = await Booking.find({ date });
    const unavailableSlots = bookingsOnDate.map(booking => booking.time);
    console.log('✅ Found unavailable slots:', unavailableSlots);
    res.json(unavailableSlots);
  } catch (error) {
    console.error('❌ Availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBooking = async (req, res) => {
  console.log('\n🎯 CREATE BOOKING - MINIMAL VERSION');
  console.log('📋 Data:', req.body);

  try {
    // Check for existing booking
    const existingBooking = await Booking.findOne({
      date: req.body.date,
      time: req.body.time
    });

    if (existingBooking) {
      console.log('❌ Slot already booked');
      return res.status(409).json({ message: 'Time slot already booked' });
    }

    // Save to database ONLY (skip calendar and email)
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    console.log('✅ Booking saved successfully:', savedBooking._id);

    res.status(201).json({
      message: 'Meeting scheduled successfully! (Calendar and email disabled for testing)',
      bookingId: savedBooking._id
    });

  } catch (error) {
    console.error('❌ Booking failed:', error);
    res.status(500).json({
      message: 'Booking failed',
      error: error.message
    });
  }
};
