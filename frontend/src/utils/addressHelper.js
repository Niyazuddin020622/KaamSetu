/**
 * KaamSetu Address Formatter and Parser
 * Standardizes address formatting across the entire application while maintaining 100% backward compatibility.
 */

import { getCityByName, getCityFromPincode } from './cityMaster';

/**
 * Formats structured address fields into a clean, unified address string
 * @param {Object} details { building, street, city, pincode, country }
 * @returns {string} Formatted full address
 */
export function formatFullAddress(details = {}) {
  if (!details) return '';
  if (typeof details === 'string') return details.trim();

  const {
    building = '',
    street = '',
    city = '',
    pincode = '',
    country = 'India'
  } = details;

  const parts = [];

  const cleanBuilding = (building || '').trim();
  const cleanStreet = (street || '').trim();
  const cleanCity = (city || '').trim();
  const cleanPin = (pincode || '').toString().trim();
  const cleanCountry = (country || 'India').trim();

  if (cleanBuilding) parts.push(cleanBuilding);
  if (cleanStreet) parts.push(cleanStreet);

  if (cleanCity && cleanPin) {
    parts.push(`${cleanCity} - ${cleanPin}`);
  } else if (cleanCity) {
    parts.push(cleanCity);
  } else if (cleanPin) {
    parts.push(cleanPin);
  }

  if (cleanCountry) {
    parts.push(cleanCountry);
  }

  return parts.join(', ');
}

/**
 * Intelligently parses a raw address string into structured fields
 * Handles legacy addresses so users never have to re-type or face broken fields!
 * @param {string} rawString 
 * @param {string} defaultCity 
 * @returns {Object} { building, street, city, pincode, country }
 */
export function parseAddressString(rawString = '', defaultCity = 'Ahmedabad') {
  const result = {
    building: '',
    street: '',
    city: defaultCity || 'Ahmedabad',
    pincode: '',
    country: 'India'
  };

  if (!rawString || typeof rawString !== 'string') {
    return result;
  }

  const str = rawString.trim();

  // 1. Extract PIN code (6-digit number)
  const pinMatch = str.match(/\b([1-9][0-9]{5})\b/);
  if (pinMatch) {
    result.pincode = pinMatch[1];
    // Check if PIN indicates a city
    const matchedCity = getCityFromPincode(result.pincode);
    if (matchedCity) {
      result.city = matchedCity.name;
    }
  }

  // 2. Remove "India" or "भारत" at end if present
  let cleanStr = str.replace(/,\s*(India|भारत)\s*$/i, '').trim();

  // 3. Remove pin code from text
  if (result.pincode) {
    cleanStr = cleanStr.replace(new RegExp(`\\s*-\\s*${result.pincode}`, 'g'), '');
    cleanStr = cleanStr.replace(new RegExp(`\\b${result.pincode}\\b`, 'g'), '');
  }

  // 4. Split by comma
  const segments = cleanStr.split(',').map((s) => s.trim()).filter(Boolean);

  if (segments.length === 0) {
    return result;
  }

  // Check if last segment is a recognized city
  const lastSeg = segments[segments.length - 1];
  const foundCity = getCityByName(lastSeg);
  if (foundCity) {
    result.city = foundCity.name;
    segments.pop();
  }

  if (segments.length === 1) {
    result.street = segments[0];
  } else if (segments.length >= 2) {
    result.building = segments[0];
    result.street = segments.slice(1).join(', ');
  }

  return result;
}

/**
 * Validates if an address has minimum required info
 */
export function isAddressValid(addressDetails = {}) {
  const building = (addressDetails.building || '').trim();
  const street = (addressDetails.street || '').trim();
  const city = (addressDetails.city || '').trim();
  const pincode = (addressDetails.pincode || '').toString().trim();

  return Boolean((building || street) && city && pincode.length === 6);
}
