// Cookie Helper for Secure Industrial Session Management
const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/'
};

/**
 * Sets an HTTP-only session cookie for the client
 * @param {import('express').Response} res 
 * @param {string} token 
 * @param {string} cookieName 
 * @param {number} maxAgeMs (default: 24h)
 */
const setSessionCookie = (res, token, cookieName = 'kaamsetu_session', maxAgeMs = 24 * 60 * 60 * 1000) => {
  res.cookie(cookieName, token, {
    ...COOKIE_OPTIONS,
    maxAge: maxAgeMs
  });
};

/**
 * Clears the specified session cookie
 * @param {import('express').Response} res 
 * @param {string} cookieName 
 */
const clearSessionCookie = (res, cookieName = 'kaamsetu_session') => {
  res.clearCookie(cookieName, COOKIE_OPTIONS);
};

module.exports = {
  COOKIE_OPTIONS,
  setSessionCookie,
  clearSessionCookie
};
