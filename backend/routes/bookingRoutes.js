const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const User = require('../models/User');
const { verifyToken, optionalToken, requireCustomer, requireWorker } = require('../middleware/auth');
const { getCityByName, getCityFromPincode, calculateDistance } = require('../data/cityMaster');

const { cleanPhoneNumber, formatPhoneWith91, getFlexiblePhoneRegex, isValidIndianPhone } = require('../utils/phoneHelper');

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
      const cleanPhone = cleanPhoneNumber(phone);
      query.$or = [
        { customerPhone: cleanPhone },
        { customerPhone: `+91 ${cleanPhone}` },
        { customerPhone: `+91${cleanPhone}` },
        { customerPhone: { $regex: cleanPhone, $options: 'i' } }
      ];
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

// GET /api/bookings/my-history - Secure hiring history for logged-in Customer ONLY
router.get('/my-history', verifyToken, requireCustomer, async (req, res) => {
  try {
    const cleanPhone = cleanPhoneNumber(req.user.phone);
    const phoneRegex = getFlexiblePhoneRegex(req.user.phone);
    const bookings = await Booking.find({
      $or: [
        { customer: req.user.id },
        { customerPhone: cleanPhone },
        { customerPhone: `+91 ${cleanPhone}` },
        { customerPhone: `+91${cleanPhone}` },
        ...(phoneRegex ? [{ customerPhone: phoneRegex }] : [])
      ]
    }).populate('worker', 'name phone category avatar hourlyRate dailyRate rating city area').sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const activeBookings = bookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status)).length;
    const totalSpent = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (Number(b.estimatedCost) || 0), 0);

    res.json({
      success: true,
      customerId: req.user.id,
      summary: {
        totalBookings,
        completedBookings,
        activeBookings,
        totalSpent
      },
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching my-history:', error);
    res.status(500).json({ success: false, message: 'हायरिंग हिस्ट्री लोड नहीं हो सकी।', error: error.message });
  }
});

// GET /api/bookings/worker-history - Secure job history for logged-in Worker ONLY
router.get('/worker-history', verifyToken, requireWorker, async (req, res) => {
  try {
    const cleanPhone = cleanPhoneNumber(req.user.phone);
    const phoneRegex = getFlexiblePhoneRegex(req.user.phone);
    const bookings = await Booking.find({
      $or: [
        { worker: req.user.id },
        { workerPhone: cleanPhone },
        { workerPhone: `+91 ${cleanPhone}` },
        { workerPhone: `+91${cleanPhone}` },
        ...(phoneRegex ? [{ workerPhone: phoneRegex }] : [])
      ]
    }).populate('customer', 'name phone address city area').sort({ createdAt: -1 });

    const totalJobs = bookings.length;
    const completedJobs = bookings.filter(b => b.status === 'completed').length;
    const activeJobs = bookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status)).length;
    const totalEarnings = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (Number(b.estimatedCost) || 0), 0);

    res.json({
      success: true,
      workerId: req.user.id,
      summary: {
        totalJobs,
        completedJobs,
        activeJobs,
        totalEarnings
      },
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching worker-history:', error);
    res.status(500).json({ success: false, message: 'कारीगर काम हिस्ट्री लोड नहीं हो सकी।', error: error.message });
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
          addressDetails: booking.addressDetails || null,
          pincode: booking.pincode || '',
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
        workerCity: booking.workerCity || '',
        isCrossCity: Boolean(booking.isCrossCity),
        distanceKm: booking.distanceKm || 0,
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

// Canonical slot mapping and conflict detection
const getSlotKey = (slotStr) => {
  if (!slotStr) return 'morning';
  const s = slotStr.toLowerCase();
  if (s.includes('full') || s.includes('पूरा')) return 'full_day';
  if (s.includes('emerg') || s.includes('तुरंत')) return 'emergency';
  if (s.includes('afternoon') || s.includes('दोपहर')) return 'afternoon';
  if (s.includes('even') || s.includes('शाम')) return 'evening';
  if (s.includes('morn') || s.includes('सुबह')) return 'morning';
  return 'morning';
};

const areSlotsConflicting = (slot1, slot2) => {
  const k1 = getSlotKey(slot1);
  const k2 = getSlotKey(slot2);
  if (k1 === 'full_day' || k2 === 'full_day') return true;
  return k1 === k2;
};

const normalizeDateStr = (d) => {
  if (!d) return '';
  const str = d.toString().trim();
  const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    const year = match[1];
    const month = match[2].padStart(2, '0');
    const day = match[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return str;
};

// GET /api/bookings/worker-slots/:workerId - Get busy/booked slots for a worker (accepted or in_progress)
router.get('/worker-slots/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;
    const { date } = req.query;

    const query = {
      worker: workerId,
      status: { $in: ['accepted', 'in_progress'] }
    };

    if (date) {
      query.preferredDate = normalizeDateStr(date);
    }

    const activeBookings = await Booking.find(query).select('preferredDate preferredTimeSlot status urgency');

    const busySlots = activeBookings.map(b => ({
      bookingId: b._id,
      date: normalizeDateStr(b.preferredDate),
      timeSlot: b.preferredTimeSlot,
      slotKey: getSlotKey(b.preferredTimeSlot),
      status: b.status
    }));

    res.json({
      success: true,
      workerId,
      date: date ? normalizeDateStr(date) : null,
      busySlots
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'स्लॉट जानकारी लोड करने में समस्या आई।', error: error.message });
  }
});

// GET /api/bookings/worker/:workerId - Get public work history of a specific worker
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

    // Sanitize public bookings list: hide phone number and mask customer name for privacy
    const publicJobs = bookings
      .filter(b => ['completed', 'accepted', 'in_progress'].includes(b.status))
      .map(b => ({
        _id: b._id,
        workerId: b.worker,
        workerName: b.workerName,
        workerCategory: b.workerCategory,
        serviceRequired: b.serviceRequired,
        jobDescription: b.jobDescription,
        preferredDate: b.preferredDate,
        preferredDay: b.preferredDay,
        preferredTimeSlot: b.preferredTimeSlot,
        customerName: b.customerName ? `${b.customerName.charAt(0)}***` : 'ग्राहक',
        city: b.city,
        area: b.area,
        status: b.status,
        estimatedCost: b.estimatedCost,
        notes: b.notes,
        completedDate: b.completedDate,
        createdAt: b.createdAt
      }));

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
      data: publicJobs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch worker history', error: error.message });
  }
});

// POST /api/bookings - Create new booking
router.post('/', optionalToken, async (req, res) => {
  try {
    const {
      workerId,
      customerName,
      customerPhone,
      customerAddress,
      addressDetails,
      pincode,
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

    // Verify worker exists first
    if (!workerId) {
      return res.status(400).json({ success: false, message: 'Worker ID is required.' });
    }
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // Determine structured details & formatted address
    let details = addressDetails && typeof addressDetails === 'object' ? addressDetails : {};
    let finalPincode = (pincode || details.pincode || '').toString().trim();
    let finalCity = (city || details.city || worker.city || 'Ahmedabad').trim();

    let finalAddress = (customerAddress || '').trim();
    if (!finalAddress) {
      const parts = [];
      if (details.building) parts.push(details.building.trim());
      if (details.street) parts.push(details.street.trim());
      if (finalCity && finalPincode) parts.push(`${finalCity} - ${finalPincode}`);
      else if (finalCity) parts.push(finalCity);
      parts.push(details.country || 'India');
      finalAddress = parts.join(', ');
    }

    // If pincode was not explicitly provided, extract from full address if present
    if (!finalPincode && finalAddress) {
      const pinMatch = finalAddress.match(/\b([1-9][0-9]{5})\b/);
      if (pinMatch) finalPincode = pinMatch[1];
    }

    const cleanCustomerPhone = cleanPhoneNumber(customerPhone);
    if (!cleanCustomerPhone || cleanCustomerPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें।'
      });
    }

    if (!customerName || !finalAddress || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide workerId, customerName, customerPhone, address, and preferredDate.'
      });
    }

    // Resolve customer ID if logged in or auto-link with existing user phone
    let customerId = null;
    if (req.user && req.user.role === 'customer') {
      customerId = req.user.id;
    } else {
      const existingUser = await User.findOne({ 
        $or: [
          { phone: cleanCustomerPhone },
          { phone: `+91 ${cleanCustomerPhone}` },
          { phone: `+91${cleanCustomerPhone}` }
        ]
      });
      if (existingUser) customerId = existingUser._id;
    }

    // Normalize target date
    const targetDate = normalizeDateStr(preferredDate);
    const todayStr = new Date().toISOString().split('T')[0];
    if (targetDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'कृपया आज की या आने वाली कोई तारीख चुनें। पुरानी तारीख नहीं चुनी जा सकती।'
      });
    }

    // -------------------------------------------------------------
    // PREVENT DUPLICATE BOOKINGS: Same customer booking same worker
    // -------------------------------------------------------------
    const customerIdentifierOr = [
      { customerPhone: cleanCustomerPhone },
      { customerPhone: `+91 ${cleanCustomerPhone}` },
      { customerPhone: `+91${cleanCustomerPhone}` },
      { customerPhone: new RegExp(cleanCustomerPhone, 'i') },
      ...(customerId ? [{ customer: customerId }] : [])
    ];

    // Check 1: Has active booking (pending/accepted/in_progress) on the same date with this worker
    const existingOnSameDate = await Booking.findOne({
      worker: worker._id,
      preferredDate: targetDate,
      status: { $in: ['pending', 'accepted', 'in_progress'] },
      $or: customerIdentifierOr
    });

    if (existingOnSameDate) {
      const statusLabel = existingOnSameDate.status === 'pending'
        ? 'पेंडिंग (Pending Request)'
        : existingOnSameDate.status === 'accepted'
        ? 'स्वीकृत (Accepted)'
        : 'चालू (In Progress)';
      return res.status(400).json({
        success: false,
        message: `डुप्लिकेट बुकिंग अमान्य: आपने पहले से इस कारीगर (${worker.name}) को तारीख ${targetDate} के लिए बुक किया हुआ है (स्थिति: ${statusLabel})। एक ही कारीगर को एक दिन में दोबारा बुक नहीं किया जा सकता।`,
        isDuplicate: true,
        existingBookingId: existingOnSameDate._id
      });
    }

    // Check 2: Has an existing unresponded PENDING request with this worker
    const existingPending = await Booking.findOne({
      worker: worker._id,
      status: 'pending',
      $or: customerIdentifierOr
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: `डुप्लिकेट बुकिंग अमान्य: कारीगर (${worker.name}) के पास आपकी एक बुकिंग रिक्वेस्ट पहले से पेंडिंग है (तारीख: ${existingPending.preferredDate})। कृपया पहले उस रिक्वेस्ट के निर्णय की प्रतीक्षा करें या उसे 'माई बुकिंग्स' में रद्द करें।`,
        isDuplicate: true,
        existingBookingId: existingPending._id
      });
    }

    // Check if worker is already booked (accepted or in_progress) on this date and time slot
    const chosenSlot = preferredTimeSlot || 'सुबह 9 से 12 बजे (Morning)';
    const activeWorkerBookings = await Booking.find({
      worker: worker._id,
      preferredDate: targetDate,
      status: { $in: ['accepted', 'in_progress'] }
    });

    const conflictingBooking = activeWorkerBookings.find(b =>
      areSlotsConflicting(b.preferredTimeSlot, chosenSlot)
    );

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: `कारीगर ${worker.name} इस तारीख (${preferredDate}) और समय (${chosenSlot}) के लिए पहले से बुक हैं। कृपया कोई अन्य समय स्लॉट या तारीख चुनें।`,
        conflictSlot: conflictingBooking.preferredTimeSlot
      });
    }

    const calculatedDay = preferredDay || getDayName(preferredDate);

    // Normalize cities using City Master
    const customerCityObj = (finalPincode ? getCityFromPincode(finalPincode) : null) || getCityByName(finalCity);
    if (customerCityObj) {
      finalCity = customerCityObj.name;
    }
    const workerCityObj = getCityByName(worker.city);
    const workerCityName = workerCityObj ? workerCityObj.name : (worker.city || 'Ahmedabad');
    const isCrossCity = finalCity.toLowerCase() !== workerCityName.toLowerCase();

    let distanceKm = 0;
    if (customerCityObj && workerCityObj && customerCityObj.coordinates && workerCityObj.coordinates) {
      distanceKm = calculateDistance(
        customerCityObj.coordinates.latitude,
        customerCityObj.coordinates.longitude,
        workerCityObj.coordinates.latitude,
        workerCityObj.coordinates.longitude
      );
    }

    const booking = new Booking({
      worker: worker._id,
      workerName: worker.name,
      workerCategory: worker.category,
      workerPhone: cleanPhoneNumber(worker.phone),
      workerAvatar: worker.avatar || '',
      customer: customerId,
      customerName: customerName.trim(),
      customerPhone: cleanCustomerPhone,
      customerAddress: finalAddress,
      addressDetails: {
        building: (details.building || '').trim(),
        street: (details.street || '').trim(),
        city: finalCity,
        pincode: finalPincode,
        country: (details.country || 'India').trim()
      },
      pincode: finalPincode,
      city: finalCity,
      area: area || details.street || worker.area,
      workerCity: workerCityName,
      isCrossCity,
      distanceKm,
      serviceRequired: serviceRequired || `${worker.category} Service`,
      jobDescription: jobDescription || '',
      preferredDate: targetDate,
      preferredDay: calculatedDay,
      preferredTimeSlot: chosenSlot,
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
    res.status(500).json({ success: false, message: error.message || 'बुकिंग दर्ज करने में समस्या आई।', error: error.message });
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

    const currentBooking = await Booking.findById(req.params.id);
    if (!currentBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Industrial State Machine: Enforce allowed state transitions
    const allowedTransitions = {
      pending: ['accepted', 'cancelled'],
      accepted: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [], // Terminal state
      cancelled: []  // Terminal state
    };

    if (!allowedTransitions[currentBooking.status] || !allowedTransitions[currentBooking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `बुकिंग का स्टेटस '${currentBooking.status}' से '${status}' में नहीं बदला जा सकता।`
      });
    }

    let autoCancelledCount = 0;

    // If accepting a booking, enforce no duplicate active bookings for the same worker, date, and slot
    if (status === 'accepted' || status === 'in_progress') {
      const targetDate = normalizeDateStr(currentBooking.preferredDate);
      const otherActiveBookings = await Booking.find({
        _id: { $ne: currentBooking._id },
        worker: currentBooking.worker,
        preferredDate: targetDate,
        status: { $in: ['accepted', 'in_progress'] }
      });

      const conflictingActive = otherActiveBookings.find(b =>
        areSlotsConflicting(b.preferredTimeSlot, currentBooking.preferredTimeSlot)
      );

      if (conflictingActive) {
        return res.status(400).json({
          success: false,
          message: `आप इस तारीख (${currentBooking.preferredDate}) और समय (${currentBooking.preferredTimeSlot}) पर पहले से एक काम स्वीकार कर चुके हैं। एक समय पर दो काम नहीं कर सकते।`
        });
      }

      // If accepted, auto-cancel any other pending requests for the same date & overlapping slot
      const otherPendingBookings = await Booking.find({
        _id: { $ne: currentBooking._id },
        worker: currentBooking.worker,
        preferredDate: targetDate,
        status: 'pending'
      });

      const conflictingPending = otherPendingBookings.filter(b =>
        areSlotsConflicting(b.preferredTimeSlot, currentBooking.preferredTimeSlot)
      );

      if (conflictingPending.length > 0) {
        const cancelIds = conflictingPending.map(b => b._id);
        await Booking.updateMany(
          { _id: { $in: cancelIds } },
          {
            $set: {
              status: 'cancelled',
              notes: 'कारीगर ने इस समय का दूसरा काम स्वीकार कर लिया है। कृपया कोई अन्य समय स्लॉट या तारीख चुनें।',
              cancelledAt: new Date(),
              cancelledBy: 'system'
            }
          }
        );
        autoCancelledCount = conflictingPending.length;
      }
    }

    const updateFields = { status };
    if (notes !== undefined) updateFields.notes = notes;

    // Track lifecycle timestamps
    if (status === 'accepted') {
      updateFields.acceptedAt = new Date();
    } else if (status === 'in_progress') {
      updateFields.startedAt = new Date();
    } else if (status === 'completed') {
      updateFields.completedAt = new Date();
      updateFields.completedDate = completedDate || new Date().toISOString().split('T')[0];
    } else if (status === 'cancelled') {
      updateFields.cancelledAt = new Date();
      updateFields.cancelledBy = req.body.cancelledBy || 'worker';
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    // If completed, increment worker's completedJobs count
    if (status === 'completed' && booking.worker) {
      await Worker.findByIdAndUpdate(booking.worker, { $inc: { completedJobs: 1 } });
    }

    res.json({
      success: true,
      message: autoCancelledCount > 0
        ? `काम स्वीकार कर लिया गया! इस समय के ${autoCancelledCount} अन्य पेंडिंग अनुरोध स्वतः रद्द कर दिए गए।`
        : `Booking status updated to ${status}`,
      autoCancelledCount,
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
