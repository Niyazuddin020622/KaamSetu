// Standard Phone Utility for KaamSetu Admin Dashboard (India +91)

/**
 * Extracts pure 10-digit Indian mobile number from any string
 * Handles cases like: "+91 9876543210", "09876543210", "919876543210", "98765-43210"
 */
export const cleanPhoneNumber = (p) => {
  if (!p) return '';
  const digits = p.toString().replace(/[^0-9]/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

/**
 * Formats a 10-digit number to standard Indian international representation with +91
 * e.g. "9876543210" -> "+91 98765 43210"
 */
export const formatPhoneDisplay = (p) => {
  const clean = cleanPhoneNumber(p);
  if (!clean || clean.length < 10) return p || '';
  return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
};

/**
 * Formats a phone number for tel: or wa.me links (+919876543210)
 */
export const formatPhoneTel = (p) => {
  const clean = cleanPhoneNumber(p);
  return clean ? `+91${clean}` : '';
};

/**
 * Validates whether string is a valid 10-digit Indian mobile number (starts with 6, 7, 8, 9)
 */
export const isValidIndianPhone = (p) => {
  const clean = cleanPhoneNumber(p);
  return /^[6-9]\d{9}$/.test(clean);
};
