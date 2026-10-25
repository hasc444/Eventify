const Booking = require('../models/Booking');
const OTP = require('../models/Otp');
const Event = require('../models/Event');
const { sendBookingEmail, sendOTPEmail } = require('../utils/email');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//Route: POST /api/booking/send-otp
exports.bookingOtp = async (req, res) => {
    const otp = generateOTP();
    await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
    await OTP.create({ email: req.user.email, otp, action: 'event_booking' });
    await sendOTPEmail(req.user.email, otp, 'event_booking');
    res.status(200).json({ message: 'OTP sent to your email for booking confirmation.' });
} 

//Route: Post /api/booking/
exports.bookEvent = async (req, res) => {
    const { eventId, otp } = req.body;
    const existingOtp = await OTP.findOne({ email: req.user.email, action: 'event_booking' });
    if (!existingOtp || existingOtp.otp !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
    }

    if(event.totalSeats <= 0 ){
        return res.status(400).json({ error: 'No seats available for this event.' });
    }

    const existingBooking = await Booking.findOne({ userId: req.user._id, eventId });
    if (existingBooking) {
        return res.status(400).json({ error: 'You have already booked this event.' });
    }

    const booking = await Booking.create({
        userId : req.user._id,
        eventId,
        status: 'pending',
        paymentStatus: 'non_paid',
        amount: event.ticketPrice
    });

    await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });
    res.status(201).json({ message: 'Booking created successfully. Please confirm your booking.', bookingId: booking._id });
}

// Route: PUT /api/booking/:id/confirm
exports.confirmBooking = async (req, res) => {

    const paymentStatus = req.body.paymentStatus;
    if (!['paid', 'non_paid'].includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status.' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.status === 'confirmed') {
        return res.status(400).json({ error: 'Booking is already confirmed.' });
    }

    const event = await Event.findById(booking.eventId);
    if (event.totalSeats <= 0) {
        return res.status(400).json({ error: 'No seats available for this event.' });
    }

    booking.status = 'confirmed';
   if (paymentStatus) {
        booking.paymentStatus = paymentStatus;
    }
    await booking.save();

    event.totalSeats -= 1;
    await event.save();

//Admin confirm the booking, than email send to the user
    await sendBookingEmail(req.user.email, event.title, booking._id);

    res.status(200).json({ message: 'Booking confirmed successfully.' });
}

//Route: GET /api/booking/my
exports.getBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('eventId', 'title date location');
    res.status(200).json(bookings);
}

//Route: DELETE /api/booking/:id
exports.cancelBooking = async (req, res) => {

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user._id) {
        return res.status(403).json({ error: 'You are not authorized to cancel this booking.' });
    }

    booking.status = 'canceled';
    await booking.save();
    
    if (booking.status === 'confirmed') {
        const event = await Event.findById(booking.eventId);
        event.totalSeats += 1;
        await event.save();
    } 

    await booking.remove();
    res.status(200).json({ message: 'Booking canceled successfully.' });
}
