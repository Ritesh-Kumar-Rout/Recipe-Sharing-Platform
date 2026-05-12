require('dotenv').config();

// 1. Catch Uncaught Exceptions (Synchronous errors)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.stack);
  process.exit(1);
});

const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');
const notificationHandler = require('./sockets/notificationHandler');

// 2. Connect to Database
connectDB();

const server = http.createServer(app);

// 3. Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST']
  }
});

// Initialize socket handlers
notificationHandler(io);

// 4. Server Listener & Dynamic Port Handling
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// 5. Handle EADDRINUSE and other Server Errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;
  
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ ERROR: Port ${PORT} is already in use.`);
    console.error(`💡 FIX: This happens when another Node process (or an old nodemon instance) is running in the background.`);
    console.error(`To fix this, kill the existing process or use a different PORT in your .env file.\n`);
    process.exit(1);
  } else {
    throw error;
  }
});

// 6. Handle Unhandled Promise Rejections (Async errors)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// 7. Handle SIGTERM / SIGINT for Graceful Shutdowns (Nodemon & Docker compatibility)
const gracefulShutdown = () => {
  console.log('\nReceived kill signal (SIGINT/SIGTERM), shutting down gracefully...');
  server.close(async () => {
    console.log('✔ HTTP server closed.');
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('✔ MongoDB connection closed.');
    }
    process.exit(0);
  });

  // Force close after 10 seconds if connections are hanging
  setTimeout(() => {
    console.error('⚠ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Nodemon restarts send SIGUSR2, Ctrl+C sends SIGINT, hosting platforms send SIGTERM
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.once('SIGUSR2', () => {
  server.close(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
