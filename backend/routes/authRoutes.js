const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const { verifyToken, requireCustomer, requireWorker, JWT_SECRET } = require('../middleware/auth');

// Helper to format clean 10-digit phone
const cleanPhoneNumber = (p) => {
  if (!p) return '';
  const digits = p.toString().replace(/[^0-9]/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

// Flexible regex for phone that handles spaces, dashes or country codes
const getFlexiblePhoneRegex = (p) => {
  if (!p) return null;
  const last10 = cleanPhoneNumber(p);
  if (!last10) return null;
  return new RegExp(last10.split('').join('[^0-9]*'), 'i');
};

// ==========================================
// 1. CUSTOMER AUTHENTICATION (Phone + PIN)
// ==========================================

// POST /api/auth/customer/register
router.post('/customer/register', async (req, res) => {
  try {
    const { name, phone, pin, address, city, area } = req.body;

    if (!name || !phone || !pin) {
      return res.status(400).json({
        success: false,
        message: 'कृपया नाम, मोबाइल नंबर और 4-अंकों का PIN दर्ज करें।'
      });
    }

    const cleanPhone = cleanPhoneNumber(phone);
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।'
      });
    }

    if (pin.toString().trim().length < 4) {
      return res.status(400).json({
        success: false,
        message: 'PIN कम से कम 4 अंकों का होना चाहिए।'
      });
    }

    // Check if phone already registered
    const existing = await User.findOne({ phone: cleanPhone });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'यह मोबाइल नंबर पहले से रजिस्टर्ड है। कृपया सीधे लॉगिन करें।'
      });
    }

    const user = new User({
      name: name.trim(),
      phone: cleanPhone,
      pin: pin.toString().trim(),
      address: (address || '').trim(),
      city: (city || 'Ahmedabad').trim(),
      area: (area || '').trim(),
      role: 'customer'
    });

    await user.save();

    // Auto-link any past bookings made with this phone number
    try {
      await Booking.updateMany(
        { customerPhone: { $regex: cleanPhone, $options: 'i' }, customer: null },
        { customer: user._id }
      );
    } catch (linkErr) {
      console.warn('Booking auto-link warning:', linkErr.message);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: 'customer', name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'अकाउंट सफलतापूर्वक बन गया!',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        area: user.area,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Customer register error:', error);
    res.status(500).json({
      success: false,
      message: 'रजिस्ट्रेशन विफल रहा। कृपया पुनः प्रयास करें।',
      error: error.message
    });
  }
});

// POST /api/auth/customer/login
router.post('/customer/login', async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({
        success: false,
        message: 'कृपया मोबाइल नंबर और 4-अंकों का PIN दर्ज करें।'
      });
    }

    const cleanPhone = cleanPhoneNumber(phone);
    const user = await User.findOne({ phone: cleanPhone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'यह नंबर रजिस्टर्ड नहीं है। कृपया पहले नया खाता (Sign Up) बनाएं।'
      });
    }

    const isMatch = await user.comparePin(pin.toString().trim());
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'गलत PIN! कृपया सही 4-अंकों का PIN दर्ज करें।'
      });
    }

    // Auto-link past bookings if any
    try {
      await Booking.updateMany(
        { customerPhone: { $regex: cleanPhone, $options: 'i' }, customer: null },
        { customer: user._id }
      );
    } catch (e) {}

    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: 'customer', name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'लॉगिन सफल रहा!',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        area: user.area,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({
      success: false,
      message: 'लॉगिन विफल रहा।',
      error: error.message
    });
  }
});

// GET /api/auth/customer/me - Get logged-in customer profile
router.get('/customer/me', verifyToken, requireCustomer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-pin');
    if (!user) {
      return res.status(404).json({ success: false, message: 'यूजर नहीं मिला।' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'प्रोफाइल लोड नहीं हो सकी।', error: error.message });
  }
});

// PUT /api/auth/customer/profile - Update customer details
router.put('/customer/profile', verifyToken, requireCustomer, async (req, res) => {
  try {
    const { name, address, city, area } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, address, city, area } },
      { new: true }
    ).select('-pin');

    res.json({ success: true, message: 'प्रोफाइल अपडेट हो गई।', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'प्रोफाइल अपडेट विफल रही।', error: error.message });
  }
});

// ==========================================
// 2. WORKER AUTHENTICATION (Phone + PIN)
// ==========================================

// POST /api/auth/worker/login
router.post('/worker/login', async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'कृपया कारीगर मोबाइल नंबर दर्ज करें।'
      });
    }

    const phoneRegex = getFlexiblePhoneRegex(phone);
    const worker = await Worker.findOne({ phone: phoneRegex });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'इस मोबाइल नंबर से कोई कारीगर प्रोफाइल नहीं मिली। कृपया पहले कारीगर के रूप में जुड़ें।'
      });
    }

    // If worker doesn't have a PIN set yet, prompt them to set a PIN
    if (!worker.pin) {
      return res.json({
        success: false,
        needsPinSetup: true,
        workerName: worker.name,
        phone: worker.phone,
        message: `नमस्ते ${worker.name}! आपने अभी तक 4-अंकों का गुप्त PIN नहीं बनाया है। कृपया अपना नया PIN सेट करें।`
      });
    }

    if (!pin) {
      return res.status(400).json({
        success: false,
        message: 'कृपया अपना 4-अंकों का गुप्त PIN दर्ज करें।'
      });
    }

    const isMatch = await worker.comparePin(pin.toString().trim());
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'गलत कारीगर PIN! कृपया सही PIN डालें।'
      });
    }

    const token = jwt.sign(
      { id: worker._id, phone: worker.phone, role: 'worker', name: worker.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const safeWorker = worker.toObject();
    delete safeWorker.pin;

    res.json({
      success: true,
      message: 'कारीगर लॉगिन सफल रहा!',
      token,
      worker: safeWorker
    });
  } catch (error) {
    console.error('Worker login error:', error);
    res.status(500).json({
      success: false,
      message: 'कारीगर लॉगिन विफल रहा।',
      error: error.message
    });
  }
});

// POST /api/auth/worker/set-pin - Set initial or reset PIN for existing worker
router.post('/worker/set-pin', async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({
        success: false,
        message: 'कृपया मोबाइल नंबर और 4-अंकों का नया PIN दर्ज करें।'
      });
    }

    if (pin.toString().trim().length < 4) {
      return res.status(400).json({
        success: false,
        message: 'PIN कम से कम 4 अंकों का होना चाहिए।'
      });
    }

    const phoneRegex = getFlexiblePhoneRegex(phone);
    const worker = await Worker.findOne({ phone: phoneRegex });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'कारीगर प्रोफाइल नहीं मिली।'
      });
    }

    worker.pin = pin.toString().trim();
    await worker.save();

    const token = jwt.sign(
      { id: worker._id, phone: worker.phone, role: 'worker', name: worker.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const safeWorker = worker.toObject();
    delete safeWorker.pin;

    res.json({
      success: true,
      message: 'आपका कारीगर PIN सफलतापूर्वक सेट हो गया!',
      token,
      worker: safeWorker
    });
  } catch (error) {
    console.error('Worker set-pin error:', error);
    res.status(500).json({
      success: false,
      message: 'PIN सेट करने में समस्या आई।',
      error: error.message
    });
  }
});

// GET /api/auth/worker/me - Get current logged-in worker profile
router.get('/worker/me', verifyToken, requireWorker, async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id).select('-pin');
    if (!worker) {
      return res.status(404).json({ success: false, message: 'कारीगर नहीं मिला।' });
    }
    res.json({ success: true, worker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'कारीगर प्रोफाइल लोड विफल रही।', error: error.message });
  }
});

// PATCH /api/auth/worker/availability - Worker toggles online/offline
router.patch('/worker/availability', verifyToken, requireWorker, async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'कारीगर नहीं मिला।' });
    }
    worker.isAvailable = !worker.isAvailable;
    await worker.save();

    res.json({
      success: true,
      message: worker.isAvailable ? 'आप अब काम के लिए उपलब्ध हैं!' : 'आप अभी व्यस्त (Offline) हैं।',
      isAvailable: worker.isAvailable
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'स्टेटस अपडेट नहीं हो सका।', error: error.message });
  }
});

module.exports = router;
