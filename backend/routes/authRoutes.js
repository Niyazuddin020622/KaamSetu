const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const { verifyToken, requireCustomer, requireWorker, JWT_SECRET } = require('../middleware/auth');
const { getCityByName, getCityFromPincode } = require('../data/cityMaster');

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
    const { name, phone, pin, address, addressDetails, pincode, city, area } = req.body;

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

    let details = addressDetails && typeof addressDetails === 'object' ? addressDetails : {};
    let finalPincode = (pincode || details.pincode || '').toString().trim();
    let finalCity = (city || details.city || 'Ahmedabad').trim();
    let finalAddress = (address || '').trim();

    if (!finalPincode && finalAddress) {
      const pinMatch = finalAddress.match(/\b([1-9][0-9]{5})\b/);
      if (pinMatch) finalPincode = pinMatch[1];
    }

    // Standardize city name via City Master to prevent mismatch
    const matchedCity = (finalPincode ? getCityFromPincode(finalPincode) : null) || getCityByName(finalCity);
    if (matchedCity) {
      finalCity = matchedCity.name;
    }

    if (!finalAddress && (details.building || details.street)) {
      const parts = [];
      if (details.building) parts.push(details.building.trim());
      if (details.street) parts.push(details.street.trim());
      if (finalCity && finalPincode) parts.push(`${finalCity} - ${finalPincode}`);
      else if (finalCity) parts.push(finalCity);
      parts.push(details.country || 'India');
      finalAddress = parts.join(', ');
    }

    const user = new User({
      name: name.trim(),
      phone: cleanPhone,
      pin: pin.toString().trim(),
      address: finalAddress,
      addressDetails: {
        building: (details.building || '').trim(),
        street: (details.street || '').trim(),
        city: finalCity,
        pincode: finalPincode,
        country: (details.country || 'India').trim()
      },
      pincode: finalPincode,
      city: finalCity,
      area: (area || details.street || '').trim(),
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

    // Generate JWT token (24-hour session)
    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: 'customer', name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
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
        addressDetails: user.addressDetails,
        pincode: user.pincode,
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
      { expiresIn: '24h' }
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
        addressDetails: user.addressDetails,
        pincode: user.pincode,
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
    const { name, address, addressDetails, pincode, city, area } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (city) updateFields.city = city.trim();
    if (area) updateFields.area = area.trim();

    let details = addressDetails && typeof addressDetails === 'object' ? addressDetails : null;
    let finalAddress = (address || '').trim();
    let finalPincode = (pincode || details?.pincode || '').toString().trim();

    if (details) {
      updateFields.addressDetails = {
        building: (details.building || '').trim(),
        street: (details.street || '').trim(),
        city: (details.city || updateFields.city || 'Ahmedabad').trim(),
        pincode: finalPincode,
        country: (details.country || 'India').trim()
      };
      if (!finalAddress && (details.building || details.street)) {
        const parts = [details.building, details.street].filter(Boolean);
        if (details.city && finalPincode) parts.push(`${details.city} - ${finalPincode}`);
        else if (details.city) parts.push(details.city);
        parts.push(details.country || 'India');
        finalAddress = parts.join(', ');
      }
    }

    if (finalAddress) updateFields.address = finalAddress;
    if (finalPincode) updateFields.pincode = finalPincode;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
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
      { expiresIn: '24h' }
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
      { expiresIn: '24h' }
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
