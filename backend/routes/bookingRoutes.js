const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

// GET /api/bookings - Get list of bookings
router.get('/', async (req, res) => {
  try {
    const { phone, workerId, status } = req.query;
    const query = {};

    if (phone) {
      query.customerPhone = phone;
    }
    if (workerId) {
      query.worker = workerId;
    }
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
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

    const booking = new Booking({
      worker: worker._id,
      workerName: worker.name,
      workerCategory: worker.category,
      workerPhone: worker.phone,
      customerName,
      customerPhone,
      customerAddress,
      city: city || worker.city,
      area: area || worker.area,
      serviceRequired: serviceRequired || `${worker.category} Service`,
      jobDescription: jobDescription || '',
      preferredDate,
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
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
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

module.exports = router;
