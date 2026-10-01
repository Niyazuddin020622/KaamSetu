const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kaamsetu_jwt_secret_token_secure_key_2026_9999';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied. कृपया पहले लॉगिन करें।'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, phone, role, name }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'अमान्य या समाप्त टोकन। कृपया दोबारा लॉगिन करें।'
    });
  }
};

// Optional token verification (attach user if token provided, but don't block if not)
const optionalToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
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

module.exports = {
  verifyToken,
  optionalToken,
  requireCustomer,
  requireWorker,
  JWT_SECRET
};
