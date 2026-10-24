const express = require('express');
const router = express.Router();
const { getBookings, createBooking, deleteBooking } = require('../controllers/bookingController');

// Get all bookings
router.get('/', getBookings);   

// Create a new booking
router.post('/', createBooking);

// Delete a booking
router.delete('/:id', deleteBooking);