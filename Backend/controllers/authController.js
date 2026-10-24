const User= require('../models/User');  

exports.newUser = async (req, res) => {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const salt= bcrypt.genSalt(10); 
    const hashPassword= await bcrypt.hash(password, salt);

  try {
    const user = new User({ name, email, password : hashPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${email}: ${otp}`);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};