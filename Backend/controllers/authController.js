const User= require('../models/User'); 
const OTP= require('../models/OTP');
const bcrypt = require('bcryptjs'); 
const { sendBookingEmail, sendOTPEmail }= require('../utils/email');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

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


exports.loginUser = async (req, res) => {
    // const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    const {email,password}=req.body
    try{
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({error: "Please try to login with correct credentials"})
        }

        const passCompare =await bcrypt.compare(password,user.password)
        if(!passCompare){
            return res.status(400).json({error: "Please try to login with correct credentials"})
        }

        if( !user.isverified && user.role === 'user'){

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await OTP.deleteMany({ email, action: 'account_verification' }); // Delete any existing OTPs for this email and action
            await OTP.create({ email, otp, action: 'account_verification' });
            await sendOTPEmail(email, otp, 'account_verification');
            return res.status(400).json({error: "Account not verified. Please check your email for the OTP to verify your account."});
        }

        
        
        res.status(200).json({message: "Login successful", user: {id: user.id, name: user.name, email: user.email}});
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal Server Error ")
    }

})