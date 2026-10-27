const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { newUser, loginUser, verifyOtp } = require('../controllers/authController');

const validateAuth = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/createUser', validateAuth, newUser);
router.post('/login', validateAuth, loginUser);
router.post('/verify-otp', validateAuth, verifyOtp);




module.exports = router;