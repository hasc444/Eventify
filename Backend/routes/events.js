const express = require('express');
const router = express.Router();
const{verifying, verifyingAdmin} = require('../middleware/auth');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

//Get all events
router.get('/', getAllEvents);

//Get a single event by ID
router.get('/:id', getEventById);

//Create a new event (Admin only)
router.post('/', verifying, verifyingAdmin, createEvent);

//Update an event by ID (Admin only)
router.put('/:id', verifying, verifyingAdmin, updateEvent);

//Delete an event by ID (Admin only)
router.delete('/:id', verifying, verifyingAdmin, deleteEvent);

module.exports = router;