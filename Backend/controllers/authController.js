const User= require('../models/User'); 
const OTP= require('../models/OTP');
const bcrypt = require('bcryptjs'); 
const { sendBookingEmail, sendOTPEmail }= require('../utils/email');
const jwt = require('jsonwebtoken');

//ROUTE 1: Create a user using: Post "/api/auth/newUser" No login required
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

//ROUTE 2: Authenticate a user using: Post "/api/auth/login" No login required
exports.loginUser = async (req, res) => {

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

        const data={
            user : {id: user.id,
            role: user.role}
        }

        const jwtToken= jwt.sign( data, process.env.JWT_SECRET, { expiresIn: '1h' } );
        
        res.json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            authtoken: jwtToken});
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal Server Error ")
    }
}

//ROUTE 3: Verify OTP using: Post "/api/auth/verify-otp" No login required
exports.verifyOtp = async (req, res) => {  

    const { email, otp } = req.body;    
    const otpRecord = await OTP.findOne({ email, otp, action: 'account_verification' });

    if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid OTP or email' });
    }

    const user = await User.findOneAndUpdate({ email }, { isverified: true });
    await OTP.deleteMany({ email, action: 'account_verification' });

     const data={
            user : {id: user.id,
            role: user.role}
        }

     const jwtToken= jwt.sign( data, process.env.JWT_SECRET, { expiresIn: '1h' } );

    res.json({ 
        message: 'Account verified successfully. You can now log in.',
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authtoken: jwtToken
     });
};
