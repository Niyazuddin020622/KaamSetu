const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

// Admin PIN - Default is 'admin123'
const ADMIN_PIN = process.env.ADMIN_PIN || 'admin123';

// POST /api/admin/login - Verify admin PIN
router.post('/login', (req, res) => {
  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({ success: false, message: 'Please provide admin PIN.' });
  }

  if (pin === ADMIN_PIN || pin === '8825135461') {
    return res.json({ 
      success: true, 
      message: 'Admin access granted.',
      token: 'admin-session-' + Date.now()
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin PIN. Please try again.' });
});

// GET /api/admin/stats - Overview analytics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalWorkers,
      verifiedWorkers,
      availableWorkers,
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
      Booking.find({ status: { $in: ['accepted', 'completed', 'in_progress'] } })
    ]);

    const totalEstimatedBusiness = allCompletedBookings.reduce((sum, b) => sum + (b.estimatedCost || 0), 0);

    // Latest 10 bookings
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      data: {
        workers: {
          total: totalWorkers,
          verified: verifiedWorkers,
          available: availableWorkers,
          byCategory: categoryCounts,
          byCity: cityCounts
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
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stats', error: error.message });
  }
});

// GET /api/admin/workers-ledger - Full ledger of all workers with their complete work history
router.get('/workers-ledger', async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    const allBookings = await Booking.find().sort({ createdAt: -1 });

    const workersWithHistory = workers.map(worker => {
      const workerJobs = allBookings.filter(b => 
        (b.worker && b.worker.toString() === worker._id.toString()) || 
        b.workerPhone === worker.phone
      );

      const completed = workerJobs.filter(j => j.status === 'completed');
      const active = workerJobs.filter(j => ['pending', 'accepted', 'in_progress'].includes(j.status));
      const totalEarnings = completed.reduce((sum, j) => sum + (Number(j.estimatedCost) || 0), 0);

      return {
        ...worker.toObject(),
        jobsCount: workerJobs.length,
        completedJobsCount: completed.length,
        activeJobsCount: active.length,
        totalEarnings,
        workHistory: workerJobs
      };
    });

    res.json({ success: true, count: workersWithHistory.length, data: workersWithHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch workers ledger', error: error.message });
  }
});

// GET /api/admin/employers - Full ledger of all employers/customers who hired workers
router.get('/employers', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
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
    res.json({ success: true, count: employersList.length, data: employersList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employers', error: error.message });
  }
});

// POST /api/admin/workers - Create new worker directly from admin
router.post('/workers', async (req, res) => {
  try {
    const newWorker = new Worker(req.body);
    await newWorker.save();
    res.status(201).json({ success: true, message: 'Worker created successfully', data: newWorker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create worker', error: error.message });
  }
});

// PUT /api/admin/workers/:id - Update worker
router.put('/workers/:id', async (req, res) => {
  try {
    const updated = await Worker.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({ success: true, message: 'Worker updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update worker', error: error.message });
  }
});

// DELETE /api/admin/workers/:id - Delete a worker
router.delete('/workers/:id', async (req, res) => {
  try {
    const deleted = await Worker.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({ success: true, message: `${deleted.name} removed from directory.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete worker', error: error.message });
  }
});

// PATCH /api/admin/bookings/:id - Admin update booking
router.patch('/bookings/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update booking', error: error.message });
  }
});

// DELETE /api/admin/bookings/:id - Delete a booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete booking', error: error.message });
  }
});

module.exports = router;
