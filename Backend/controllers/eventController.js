const Event = require('../models/eventModel');

// Get all events   
exports.getAllEvents = async (req, res) => {
    try {
        const filters = {}
        if (req.query.category) {
            filters.category = req.query.category;
        }
        if (req.query.location) {
            filters.location = req.query.location;
        }

        const events = await Event.find(filters);
        res.status(200).json(events);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single event by ID 
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new event (Admin only)
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, totalSeats, availableSeats, ticketPrice, imageUrl } = req.body;

        const existingEvent = await Event.findOne({ title, date, location });
        if (existingEvent) {
            return res.status(400).json({ error: 'An event with the same title, date, and location already exists' });
        }

        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl
        });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an event by ID (Admin only)
exports.updateEvent = async (req, res) => {
    const{ title, description, date, location, category, totalSeats, availableSeats, ticketPrice, imageUrl } = req.body;
    try {
        const event = await Event.findByIdAndUpdate(req.params.id,
            { title, description, date, location, category, totalSeats, availableSeats, ticketPrice, imageUrl }, { new: true });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an event by ID (Admin only)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
