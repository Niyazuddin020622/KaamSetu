// Standard Phone Utility for KaamSetu Platform (India +91)

/**
 * Extracts pure 10-digit Indian mobile number from any string
 * Handles cases like: "+91 9876543210", "09876543210", "919876543210", "98765-43210"
 */
const cleanPhoneNumber = (p) => {
  if (!p) return '';
  const digits = p.toString().replace(/[^0-9]/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

/**
 * Formats a 10-digit number to standard Indian international representation
 * e.g. "9876543210" -> "+91 98765 43210"
 */
const formatPhoneWith91 = (p) => {
  const clean = cleanPhoneNumber(p);
  if (!clean || clean.length < 10) return p || '';
  return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
};

/**
 * Generates a flexible regex to match phone across legacy representations
 */
const getFlexiblePhoneRegex = (p) => {
  if (!p) return null;
  const last10 = cleanPhoneNumber(p);
  if (!last10) return null;
  return new RegExp(last10.split('').join('[^0-9]*'), 'i');
};

/**
 * Validates whether string is a valid 10-digit Indian mobile number (starts with 6, 7, 8, 9)
 */
const isValidIndianPhone = (p) => {
  const clean = cleanPhoneNumber(p);
  return /^[6-9]\d{9}$/.test(clean);
};

module.exports = {
  cleanPhoneNumber,
  formatPhoneWith91,
  getFlexiblePhoneRegex,
  isValidIndianPhone
};
