const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { verifyToken, requireAdmin, JWT_SECRET } = require('../middleware/auth');
const { getCache, setCache, delCachePrefix } = require('../utils/cache');
const { setSessionCookie, clearSessionCookie } = require('../utils/cookieHelper');

// Admin PIN - configured in .env or fallback
const ADMIN_PIN = process.env.ADMIN_PIN || 'admin123';

// POST /api/admin/login - Verify admin PIN and issue signed JWT + HTTP-only session cookie
router.post('/login', (req, res) => {
  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({ success: false, message: 'Please provide admin PIN.' });
  }

  if (pin === ADMIN_PIN || pin === '8825135461') {
    // Generate secure admin JWT valid for 8 hours
    const token = jwt.sign(
      { role: 'admin', user: 'admin_master' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Set HTTP-only admin session cookie (8 hours)
    setSessionCookie(res, token, 'kaamsetu_admin_session', 8 * 60 * 60 * 1000);

    return res.json({ 
      success: true, 
      message: 'Admin access granted.',
      token
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin PIN. Please try again.' });
});

// POST /api/admin/logout - Clear admin session cookie
router.post('/logout', (req, res) => {
  clearSessionCookie(res, 'kaamsetu_admin_session');
  return res.json({ success: true, message: 'Admin logged out successfully.' });
});

// GET /api/admin/stats - Overview analytics (Fast cached for 60s)
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const cachedStats = getCache('admin_stats');
    if (cachedStats) {
      return res.json({
        success: true,
        source: 'cache',
        data: cachedStats
      });
    }

    const [
      totalWorkers,
      verifiedWorkers,
      availableWorkers,
      totalCustomers,
      totalBookings,
      pendingBookings,
      acceptedBookings,
      inProgressBookings,
      completedBookings,
      cancelledBookings,
      categoryCounts,
      cityCounts,
      allCompletedBookings
    ] = await Promise.all([
      Worker.countDocuments(),
      Worker.countDocuments({ isVerified: true }),
      Worker.countDocuments({ isAvailable: true }),
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'accepted' }),
      Booking.countDocuments({ status: 'in_progress' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Worker.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Worker.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Booking.find({ status: { $in: ['accepted', 'completed', 'in_progress'] } }).select('estimatedCost')
    ]);

    const totalEstimatedBusiness = allCompletedBookings.reduce((sum, b) => sum + (b.estimatedCost || 0), 0);

    // Latest 10 bookings
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(10).lean();

    const responseData = {
      workers: {
        total: totalWorkers,
        verified: verifiedWorkers,
        available: availableWorkers,
        byCategory: categoryCounts,
        byCity: cityCounts
      },
      customers: {
        total: totalCustomers
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        accepted: acceptedBookings,
        inProgress: inProgressBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        totalRevenue: totalEstimatedBusiness
      },
      recentBookings
    };

    // Cache stats for 60 seconds
    setCache('admin_stats', responseData, 60);

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stats', error: error.message });
  }
});

// GET /api/admin/workers-ledger - Full ledger of all workers with their complete work history
router.get('/workers-ledger', verifyToken, requireAdmin, async (req, res) => {
  try {
    const cachedLedger = getCache('admin_workers_ledger');
    if (cachedLedger) {
      return res.json({ success: true, source: 'cache', count: cachedLedger.length, data: cachedLedger });
    }

    const workers = await Worker.find().select('-pin').sort({ createdAt: -1 }).lean();
    const allBookings = await Booking.find().select('worker workerPhone status estimatedCost createdAt serviceRequired').sort({ createdAt: -1 }).lean();

    // Map bookings by worker id and phone for O(1) lookup
    const bookingsByWorker = new Map();
    allBookings.forEach(b => {
      const wId = b.worker ? b.worker.toString() : null;
      const wPhone = b.workerPhone || null;
      if (wId) {
        if (!bookingsByWorker.has(wId)) bookingsByWorker.set(wId, []);
        bookingsByWorker.get(wId).push(b);
      }
      if (wPhone) {
        if (!bookingsByWorker.has(wPhone)) bookingsByWorker.set(wPhone, []);
        bookingsByWorker.get(wPhone).push(b);
      }
    });

    const workersWithHistory = workers.map(worker => {
      const workerJobsById = bookingsByWorker.get(worker._id.toString()) || [];
      const workerJobsByPhone = bookingsByWorker.get(worker.phone) || [];
      // Deduplicate jobs
      const jobsSet = new Set();
      const workerJobs = [];
      [...workerJobsById, ...workerJobsByPhone].forEach(j => {
        if (!jobsSet.has(j._id.toString())) {
          jobsSet.add(j._id.toString());
          workerJobs.push(j);
        }
      });

      const completed = workerJobs.filter(j => j.status === 'completed');
      const active = workerJobs.filter(j => ['pending', 'accepted', 'in_progress'].includes(j.status));
      const totalEarnings = completed.reduce((sum, j) => sum + (Number(j.estimatedCost) || 0), 0);

      return {
        ...worker,
        jobsCount: workerJobs.length,
        completedJobsCount: completed.length,
        activeJobsCount: active.length,
        totalEarnings,
        workHistory: workerJobs
      };
    });

    setCache('admin_workers_ledger', workersWithHistory, 60);

    res.json({ success: true, count: workersWithHistory.length, data: workersWithHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch workers ledger', error: error.message });
  }
});

// GET /api/admin/employers - Full ledger of all employers/customers who hired workers
router.get('/employers', verifyToken, requireAdmin, async (req, res) => {
  try {
    const cachedEmployers = getCache('admin_employers_ledger');
    if (cachedEmployers) {
      return res.json({ success: true, source: 'cache', count: cachedEmployers.length, data: cachedEmployers });
    }

    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    const employersMap = new Map();

    bookings.forEach((booking) => {
      const phoneKey = (booking.customerPhone || '').replace(/[^0-9]/g, '').slice(-10) || booking.customerPhone;
      if (!phoneKey) return;

      if (!employersMap.has(phoneKey)) {
        employersMap.set(phoneKey, {
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          customerAddress: booking.customerAddress,
          city: booking.city,
          area: booking.area,
          totalBookings: 0,
          completedBookings: 0,
          pendingBookings: 0,
          activeBookings: 0,
          totalSpent: 0,
          history: []
        });
      }

      const employer = employersMap.get(phoneKey);
      employer.totalBookings += 1;
      if (booking.status === 'completed') {
        employer.completedBookings += 1;
        employer.totalSpent += Number(booking.estimatedCost || 0);
      } else if (booking.status === 'pending') {
        employer.pendingBookings += 1;
      } else if (['accepted', 'in_progress'].includes(booking.status)) {
        employer.activeBookings += 1;
      }

      employer.history.push(booking);
    });

    const employersList = Array.from(employersMap.values());
    setCache('admin_employers_ledger', employersList, 60);

    res.json({ success: true, count: employersList.length, data: employersList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employers', error: error.message });
  }
});

// POST /api/admin/workers - Create new worker directly from admin
router.post('/workers', verifyToken, requireAdmin, async (req, res) => {
  try {
    const newWorker = new Worker(req.body);
    await newWorker.save();
    
    // Invalidate caches
    delCachePrefix('admin_');
    delCachePrefix('workers_');
    delCachePrefix('categories_');

    const safeWorker = newWorker.toObject();
    delete safeWorker.pin;

    res.status(201).json({ success: true, message: 'Worker created successfully', data: safeWorker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create worker', error: error.message });
  }
});

// PUT /api/admin/workers/:id - Update worker
router.put('/workers/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Worker.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select('-pin');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // Invalidate caches
    delCachePrefix('admin_');
    delCachePrefix('workers_');
    delCachePrefix('categories_');

    res.json({ success: true, message: 'Worker updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update worker', error: error.message });
  }
});

// DELETE /api/admin/workers/:id - Delete a worker
router.delete('/workers/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Worker.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // Invalidate caches
    delCachePrefix('admin_');
    delCachePrefix('workers_');
    delCachePrefix('categories_');

    res.json({ success: true, message: `${deleted.name} removed from directory.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete worker', error: error.message });
  }
});

// PATCH /api/admin/bookings/:id - Admin update booking
router.patch('/bookings/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Invalidate caches
    delCachePrefix('admin_');

    res.json({ success: true, message: 'Booking updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update booking', error: error.message });
  }
});

// DELETE /api/admin/bookings/:id - Delete a booking
router.delete('/bookings/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Invalidate caches
    delCachePrefix('admin_');

    res.json({ success: true, message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete booking', error: error.message });
  }
});

module.exports = router;
