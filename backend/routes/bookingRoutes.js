const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

// Helper function to get Day of Week in Hindi and English
const getDayName = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const days = [
    'रविवार (Sunday)',
    'सोमवार (Monday)',
    'मंगलवार (Tuesday)',
    'बुधवार (Wednesday)',
    'गुरुवार (Thursday)',
    'शुक्रवार (Friday)',
    'शनिवार (Saturday)'
  ];
  return days[date.getDay()];
};

// GET /api/bookings - Get list of bookings with flexible search
router.get('/', async (req, res) => {
  try {
    const { phone, workerId, status, search } = req.query;
    const query = {};

    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const searchPattern = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;
      query.customerPhone = { $regex: searchPattern, $options: 'i' };
    }
    if (workerId) {
      query.worker = workerId;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { workerName: { $regex: search, $options: 'i' } },
        { workerCategory: { $regex: search, $options: 'i' } },
        { serviceRequired: { $regex: search, $options: 'i' } },
        { customerAddress: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
  }
});

// GET /api/bookings/employers - Get list of all employers (customers who hired workers) with their hiring history
router.get('/employers', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    // Group by customerPhone
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
          totalSpent: 0,
          firstBookingDate: booking.preferredDate || booking.createdAt,
          lastBookingDate: booking.preferredDate || booking.createdAt,
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
      }

      // Add to employer's detailed history
      employer.history.push({
        _id: booking._id,
        workerId: booking.worker,
        workerName: booking.workerName,
        workerCategory: booking.workerCategory,
        workerPhone: booking.workerPhone,
        workerAvatar: booking.workerAvatar,
        serviceRequired: booking.serviceRequired,
        jobDescription: booking.jobDescription,
        preferredDate: booking.preferredDate,
        preferredDay: booking.preferredDay || getDayName(booking.preferredDate),
        preferredTimeSlot: booking.preferredTimeSlot,
        customerAddress: booking.customerAddress,
        city: booking.city,
        area: booking.area,
        urgency: booking.urgency,
        status: booking.status,
        estimatedCost: booking.estimatedCost,
        createdAt: booking.createdAt
      });
    });

    const employersList = Array.from(employersMap.values());
    res.json({ success: true, count: employersList.length, data: employersList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employers', error: error.message });
  }
});

// GET /api/bookings/worker/:workerId - Get complete work history of a specific worker
router.get('/worker/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;
    const worker = await Worker.findById(workerId);
    
    // Find bookings by worker object ID or phone
    const bookings = await Booking.find({
      $or: [
        { worker: workerId },
        ...(worker ? [{ workerPhone: worker.phone }] : [])
      ]
    }).sort({ createdAt: -1 });

    const totalJobs = bookings.length;
    const completedJobs = bookings.filter(b => b.status === 'completed').length;
    const activeJobs = bookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status)).length;
    const totalEarnings = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (Number(b.estimatedCost) || 0), 0);

    res.json({
      success: true,
      workerId,
      workerName: worker ? worker.name : (bookings[0]?.workerName || ''),
      summary: {
        totalJobs,
        completedJobs,
        activeJobs,
        totalEarnings
      },
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch worker history', error: error.message });
  }
});

// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
  try {
    const {
      workerId,
      customerName,
      customerPhone,
      customerAddress,
      city,
      area,
      serviceRequired,
      jobDescription,
      preferredDate,
      preferredDay,
      preferredTimeSlot,
      urgency,
      estimatedCost
    } = req.body;

    if (!workerId || !customerName || !customerPhone || !customerAddress || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide workerId, customerName, customerPhone, customerAddress, and preferredDate.'
      });
    }

    // Verify worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const calculatedDay = preferredDay || getDayName(preferredDate);

    const booking = new Booking({
      worker: worker._id,
      workerName: worker.name,
      workerCategory: worker.category,
      workerPhone: worker.phone,
      workerAvatar: worker.avatar || '',
      customerName,
      customerPhone,
      customerAddress,
      city: city || worker.city,
      area: area || worker.area,
      serviceRequired: serviceRequired || `${worker.category} Service`,
      jobDescription: jobDescription || '',
      preferredDate,
      preferredDay: calculatedDay,
      preferredTimeSlot: preferredTimeSlot || 'Morning (9 AM - 12 PM)',
      urgency: urgency || 'Today',
      estimatedCost: estimatedCost || worker.hourlyRate,
      status: 'pending'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully to worker!',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
});

// PATCH /api/bookings/:id/status - Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, notes, completedDate } = req.body;
    const validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const updateFields = { status };
    if (notes !== undefined) updateFields.notes = notes;
    if (status === 'completed') {
      updateFields.completedDate = completedDate || new Date().toISOString().split('T')[0];
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // If completed, increment worker's completedJobs count
    if (status === 'completed' && booking.worker) {
      await Worker.findByIdAndUpdate(booking.worker, { $inc: { completedJobs: 1 } });
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
});

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', async (req, res) => {
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
