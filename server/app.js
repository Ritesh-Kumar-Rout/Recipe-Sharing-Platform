const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/error');

const app = express();

// 1. CORS - Must be early
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 2. Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  contentSecurityPolicy: false // Disable CSP for dev to avoid blocking assets/requests
}));
app.use(mongoSanitize());

// 3. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Custom Request Logger for Auth Debugging
app.use((req, res, next) => {
  if (req.path.includes('auth') || req.path.includes('admin')) {
    console.log(`[AUTH-DEBUG] ${req.method} ${req.path}`);
    if (req.method === 'POST') console.log('[AUTH-DEBUG] Body Keys:', Object.keys(req.body));
  }
  next();
});

// 5. Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500 // Increased for development
});
app.use('/api/', limiter);

// 6. Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

app.use(errorHandler);

module.exports = app;
