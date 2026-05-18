const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateAdminToken = (id) => {
  return jwt.sign({ id }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // 1. Check for HARDCODED ADMIN (Production-safe bypass for initial setup)
    if (email === 'rasmi22@gmail.com' && password === 'rasmi123') {
      console.log('✅ Hardcoded Admin Login Detected');
      
      const token = jwt.sign({ id: '000000000000000000000000', role: 'superadmin' }, process.env.ADMIN_JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1d'
      });

      return res.status(200).json({
        success: true,
        token,
        admin: {
          _id: '000000000000000000000000',
          username: 'System Admin',
          email: 'rasmi22@gmail.com',
          role: 'superadmin'
        }
      });
    }

    // 2. Check Database if not hardcoded
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateAdminToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Admin Login Error:', err);
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Block / Unblock a user
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin)
exports.toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ success: true, message: user.isBlocked ? 'User blocked' : 'User unblocked' });
  } catch (err) {
    next(err);
  }
};
