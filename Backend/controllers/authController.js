const User= require('../models/User'); 
const OTP= require('../models/OTP');
const bcrypt = require('bcryptjs'); 
const { sendBookingEmail, sendOTPEmail }= require('../utils/email');

exports.newUser = async (req, res) => {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const salt= bcrypt.genSalt(10); 
    const hashPassword= await bcrypt.hash(password, salt);

  try {
    const user = new User.create({ name, email, password : hashPassword, role: 'user' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${email}: ${otp}`);

    await OTP.create({ email, otp, action: 'account_verification' });
    await sendOTPEmail(email, otp, 'account_verification');

    res.status(201).json({ 
        message: 'User registered successfully. Please check your email for the OTP to verify your account.',
        email: user.email
     });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};