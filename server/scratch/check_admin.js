require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (admin) {
      console.log('Admin found:', admin.email);
      console.log('Admin role:', admin.role);
    } else {
      console.log('Admin NOT found in database.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAdmin();
