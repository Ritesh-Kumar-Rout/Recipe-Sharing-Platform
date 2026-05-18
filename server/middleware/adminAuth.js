const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized as admin' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    
    // Check for hardcoded admin first
    if (decoded.id === 'hardcoded_admin_id' || decoded.id === '000000000000000000000000') {
      req.admin = {
        _id: '000000000000000000000000',
        username: 'System Admin',
        email: 'rasmi22@gmail.com',
        role: 'superadmin'
      };
      return next();
    }

    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) {
      return res.status(401).json({ success: false, error: 'Admin not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized as admin' });
  }
};
