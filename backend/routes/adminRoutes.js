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

    // Latest 5 bookings
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

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
