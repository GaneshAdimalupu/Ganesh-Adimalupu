// routes/scheduleRoutes.js - DEBUG VERSION
const express = require('express');
const router = express.Router();
const { getAvailability, createBooking } = require('../controllers/scheduleController');

// Add debug middleware for all schedule routes
router.use((req, res, next) => {

  next();
});

// GET /api/schedule/availability
router.get('/availability', (req, res, next) => {

  // Call the controller
  getAvailability(req, res).catch(next);
});

// POST /api/schedule/book
router.post('/book', (req, res, next) => {

  // Call the controller
  createBooking(req, res).catch(next);
});

// Route-specific error handler
router.use((error, req, res, next) => {

  res.status(500).json({
    error: 'Schedule route error',
    message: error.message,
    route: req.originalUrl,
    method: req.method
  });
});

module.exports = router;
