const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({    
 service: 'gmail',
 auth: {
   user: process.env.EMAIL_USER,
   pass: process.env.EMAIL_PASS,
 },
});

exports.sendOtpEmail = async (email, otp, type) => {
    try{
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code for ${type} is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP email sent to ${email} for ${type}`);
}
catch (error) {
  console.error(`Error sending OTP to ${email}`, error);
};