require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');
const { notificationHandler } = require('./sockets/notificationHandler');

// 1. Environment Validation
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
const missingEnv = REQUIRED_ENV.filter(env => !process.env[env]);
if (missingEnv.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

// 2. Global Exception Handling
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// 3. Database Connection
connectDB();

const server = http.createServer(app);

// 4. Socket.IO Setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
notificationHandler(io);

// 5. Server Startup Logic
const net = require('net');

const startServer = (port) => {
  const tester = net.createServer()
    .once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️  Port ${port} is occupied. Trying port ${port + 1}...`);
        return startServer(port + 1);
      }
      console.error(`❌ Server Error: ${err.message}`);
      process.exit(1);
    })
    .once('listening', () => {
      tester.close(() => {
        server.listen(port, () => {
          console.log(`
🚀 YumCircle Backend is LIVE!
📡 Mode: ${process.env.NODE_ENV || 'development'}
🔗 URL: http://localhost:${port}`);
        });
      });
    })
    .listen(port);
};

const INITIAL_PORT = parseInt(process.env.PORT) || 5000;
startServer(INITIAL_PORT);

// 6. Graceful Shutdown & Rejection Handling
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});

const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('✔ HTTP server closed.');
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('✔ MongoDB connection closed.');
    }
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠ Forceful shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Nodemon specific cleanup
process.once('SIGUSR2', () => {
  server.close(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
