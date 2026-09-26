const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const workerRoutes = require('./routes/workerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Worker = require('./models/Worker');
const { sampleWorkers, sampleBookings } = require('./seed');
const Booking = require('./models/Booking');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/worker_finder_db';

// Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting to protect against abuse and DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', apiLimiter);

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Support up to 10MB payload for worker profile photo uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KaamSetu API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Auto-seed if database is empty on launch
async function checkAndAutoSeed() {
  try {
    const workerCount = await Worker.countDocuments();
    if (workerCount === 0) {
      console.log('Database is empty. Auto-seeding initial workers and demo bookings...');
      const createdWorkers = await Worker.insertMany(sampleWorkers);
      const workerMap = new Map();
      createdWorkers.forEach(w => workerMap.set(w.name, w._id));
      const enrichedBookings = sampleBookings.map(b => ({
        ...b,
        worker: workerMap.get(b.workerName) || createdWorkers[0]._id
      }));
      await Booking.insertMany(enrichedBookings);
      console.log(`Auto-seeded ${createdWorkers.length} workers and ${enrichedBookings.length} bookings successfully.`);
    } else {
      console.log(`Database already has ${workerCount} workers loaded.`);
    }
  } catch (err) {
    console.error('Auto-seed check failed:', err.message);
  }
}

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully.');
    await checkAndAutoSeed();
    app.listen(PORT, () => {
      console.log(`🚀 KaamSetu Secure Backend server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    app.listen(PORT, () => {
      console.log(`⚠️ KaamSetu Backend running on http://localhost:${PORT} (without active DB connection)`);
    });
  });
