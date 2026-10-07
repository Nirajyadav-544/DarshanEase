const express = require('express');
const router = express.Router();

const protectUser = require('../middleware/authMiddleware');

const {
  createBooking,
  getAvailability,
  myBookings,
} = require('../controllers/bookingController');

/*
 * Public availability API
 *
 * Frontend:
 * GET /api/booking/availability?templeId=...&date=YYYY-MM-DD
 */
router.get(
  '/availability',
  getAvailability
);

/*
 * Optional backward-compatible URL
 *
 * GET /api/booking/availability/:templeId/:date
 */
router.get(
  '/availability/:templeId/:date',
  getAvailability
);

/*
 * Protected booking creation
 */
router.post(
  '/create',
  protectUser,
  createBooking
);

/*
 * Protected current-user bookings
 */
router.get(
  '/mybookings',
  protectUser,
  myBookings
);

module.exports = router;