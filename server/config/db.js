const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('❌ MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
  }

  const options = {
    autoIndex: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  try {
    await mongoose.connect(mongoURI, options);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Retry logic could go here, but for now we exit to let the orchestrator restart
    process.exit(1);
  }
};

module.exports = connectDB;
