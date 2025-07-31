// routes/scheduleRoutes.js - DEBUG VERSION
const express = require('express');
const router = express.Router();
const { getAvailability, createBooking } = require('../controllers/scheduleController');

console.log('🛣️ Initializing schedule routes...');

// Add debug middleware for all schedule routes
router.use((req, res, next) => {
  console.log('\n🔀 SCHEDULE ROUTE MIDDLEWARE:');
  console.log(`   Route: ${req.method} /api/schedule${req.url}`);
  console.log(`   Base URL: ${req.baseUrl}`);
  console.log(`   Original URL: ${req.originalUrl}`);
  console.log(`   Parameters:`, req.params);
  console.log(`   Query:`, req.query);
  console.log(`   Body:`, req.body);
  console.log('   Timestamp:', new Date().toISOString());
  next();
});

// GET /api/schedule/availability
router.get('/availability', (req, res, next) => {
  console.log('\n📅 AVAILABILITY ROUTE HIT:');
  console.log('   Handler: getAvailability');
  console.log('   Query params:', req.query);

  // Call the controller
  getAvailability(req, res).catch(next);
});

// POST /api/schedule/book
router.post('/book', (req, res, next) => {
  console.log('\n📝 BOOKING ROUTE HIT:');
  console.log('   Handler: createBooking');
  console.log('   Request body:', req.body);
  console.log('   Content-Type:', req.get('Content-Type'));
  console.log('   Body size:', JSON.stringify(req.body).length, 'characters');

  // Call the controller
  createBooking(req, res).catch(next);
});

// Route-specific error handler
router.use((error, req, res, next) => {
  console.error('\n🚨 SCHEDULE ROUTE ERROR:');
  console.error('   Route:', req.method, req.originalUrl);
  console.error('   Error:', error.message);
  console.error('   Stack:', error.stack);

  res.status(500).json({
    error: 'Schedule route error',
    message: error.message,
    route: req.originalUrl,
    method: req.method
  });
});

console.log('✅ Schedule routes configured:');
console.log('   GET  /api/schedule/availability');
console.log('   POST /api/schedule/book');

module.exports = router;
