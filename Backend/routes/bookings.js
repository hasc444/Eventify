const express = require('express');
const router = express.Router();
const {verifying,verifyingAdmin} = require('../middleware/auth');
const { bookEvent, bookingOtp, getBookings, confirmBooking, cancelBooking } = require('../controllers/bookingController');

router.post('/', verifying, bookEvent)
router.post('/send-otp', verifying, bookingOtp)
router.get('/my', verifying, getBookings)
router.put('/:id/confirm', verifying, verifyingAdmin, confirmBooking)
router.delete('/:id', verifying, cancelBooking)

module.exports = router;