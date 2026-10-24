const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,   
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ['account_Veriifcation', 'Event_Booking'],
    required: true,
  },
  craetedAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP will expire after 5 minutes
  },
});

module.exports = mongoose.model('otp', OtpSchema);