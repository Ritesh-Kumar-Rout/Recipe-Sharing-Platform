const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ success: false, error: 'Username is already taken' });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please log in.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, error: 'Your account has been blocked by the admin' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Google Auth (Login/Signup)
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  try {
    const { email, username, profileImage, uid } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user (Generate a random password since they use Google)
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      // Ensure username is unique
      let uniqueUsername = username;
      let userExists = await User.findOne({ username: uniqueUsername });
      if (userExists) {
        uniqueUsername = `${username}_${uid.slice(0, 4)}`;
      }

      user = await User.create({
        username: uniqueUsername,
        email,
        password: randomPassword,
        profileImage: profileImage || 'https://res.cloudinary.com/demo/image/upload/v1566427384/sample.jpg'
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, error: 'Your account has been blocked by the admin' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    next(err);
  }
};

const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'There is no user with that email' });
    }

    // Generate a 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving to DB
    const salt = await require('bcryptjs').genSalt(10);
    user.resetPasswordOTP = await require('bcryptjs').hash(otp, salt);
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Send email
    const message = `You requested a password reset. Your OTP is: ${otp}\nThis OTP is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'YumCircle - Password Reset OTP',
        message
      });

      res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error(err);
      return res.status(500).json({ success: false, error: 'Email could not be sent. Did you set up EMAIL_USER and EMAIL_PASS?' });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!user || !user.resetPasswordOTP) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    if (user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ success: false, error: 'OTP has expired' });
    }

    // Compare OTP
    const isMatch = await require('bcryptjs').compare(otp, user.resetPasswordOTP);

    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    res.status(200).json({ success: true, message: 'OTP verified successfully. You can now reset your password.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires +password');

    if (!user || !user.resetPasswordOTP) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    if (user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ success: false, error: 'OTP has expired' });
    }

    const isMatch = await require('bcryptjs').compare(otp, user.resetPasswordOTP);

    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save(); // Password will be hashed in pre-save hook

    res.status(200).json({ success: true, message: 'Password reset successful. Please log in.' });
  } catch (err) {
    next(err);
  }
};
