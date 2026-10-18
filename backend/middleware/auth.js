const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kaamsetu_jwt_secret_token_secure_key_2026_9999';

// Extract token from either HTTP-only cookie or Authorization header
const extractToken = (req) => {
  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // 2. Check cookies (admin-specific or general session)
  if (req.cookies) {
    if (req.baseUrl && req.baseUrl.includes('/admin') && req.cookies.kaamsetu_admin_session) {
      return req.cookies.kaamsetu_admin_session;
    }
    if (req.cookies.kaamsetu_session) {
      return req.cookies.kaamsetu_session;
    }
    if (req.cookies.kaamsetu_worker_session) {
      return req.cookies.kaamsetu_worker_session;
    }
    if (req.cookies.kaamsetu_admin_session) {
      return req.cookies.kaamsetu_admin_session;
    }
  }

  return null;
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = extractToken(req);
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied. कृपया पहले लॉगिन करें।'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, phone, role, name }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'अमान्य या समाप्त सत्र (Expired Session)। कृपया दोबारा लॉगिन करें।'
    });
  }
};

// Optional token verification (attach user if token provided, but don't block if not)
const optionalToken = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // Ignore invalid token on optional routes
    }
  }
  next();
};

// Ensure user has role 'customer'
const requireCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'यह जानकारी केवल ग्राहकों (Customers) के लिए है।'
    });
  }
  next();
};

// Ensure user has role 'worker'
const requireWorker = (req, res, next) => {
  if (!req.user || req.user.role !== 'worker') {
    return res.status(403).json({
      success: false,
      message: 'यह जानकारी केवल कारीगरों (Workers) के लिए है।'
    });
  }
  next();
};

// Ensure user has role 'admin'
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'अनधिकृत पहुंच (Unauthorized). केवल एडमिन को ही यह अधिकार प्राप्त है।'
    });
  }
  next();
};

module.exports = {
  extractToken,
  verifyToken,
  optionalToken,
  requireCustomer,
  requireWorker,
  requireAdmin,
  JWT_SECRET
};
