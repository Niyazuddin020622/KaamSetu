import axios from 'axios';

// Smart environment detection:
// When running locally in browser (localhost / 127.0.0.1), automatically connect to local backend (http://localhost:5000/api)
// When deployed, connect to VITE_API_BASE_URL (Render backend)
const isBrowserLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE = isBrowserLocal
  ? (import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000/api')
  : (import.meta.env.VITE_API_BASE_URL || 'https://kaamsetu-nyud.onrender.com/api');

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach secure Admin JWT token to every request
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('kaamsetu_admin_token');
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

// Admin In-Memory Client Cache for ultra-fast instant tab switching
const adminClientCache = new Map();
const ADMIN_CACHE_TTL = 30 * 1000; // 30 seconds

export const invalidateAdminClientCache = () => {
  adminClientCache.clear();
};

// Admin Auth
export const adminLogin = async (pin) => {
  const response = await api.post('/admin/login', { pin });
  if (response.data && response.data.token) {
    localStorage.setItem('kaamsetu_admin_token', response.data.token);
    localStorage.setItem('kaamsetu_admin_login_time', Date.now().toString());
  }
  return response.data;
};

// Admin Overview Analytics (Instant Cached with Fast Fallback)
export const getAdminStats = async (forceRefresh = false) => {
  const cacheKey = 'stats';
  const cached = adminClientCache.get(cacheKey);
  const now = Date.now();
  if (!forceRefresh && cached && (now - cached.time < ADMIN_CACHE_TTL)) {
    return cached.data;
  }
  const response = await api.get('/admin/stats');
  if (response.data?.success) {
    adminClientCache.set(cacheKey, { data: response.data, time: now });
  }
  return response.data;
};

// Workers Ledger (All Workers + Their complete work history)
export const getWorkersLedger = async (forceRefresh = false) => {
  const cacheKey = 'workers_ledger';
  const cached = adminClientCache.get(cacheKey);
  const now = Date.now();
  if (!forceRefresh && cached && (now - cached.time < ADMIN_CACHE_TTL)) {
    return cached.data;
  }
  const response = await api.get('/admin/workers-ledger');
  if (response.data?.success) {
    adminClientCache.set(cacheKey, { data: response.data, time: now });
  }
  return response.data;
};

// Employers Ledger (All Hirers/Customers + Their complete hiring history)
export const getEmployersLedger = async (forceRefresh = false) => {
  const cacheKey = 'employers_ledger';
  const cached = adminClientCache.get(cacheKey);
  const now = Date.now();
  if (!forceRefresh && cached && (now - cached.time < ADMIN_CACHE_TTL)) {
    return cached.data;
  }
  const response = await api.get('/admin/employers');
  if (response.data?.success) {
    adminClientCache.set(cacheKey, { data: response.data, time: now });
  }
  return response.data;
};

// Master Bookings & Jobs
export const getAllBookings = async (params = {}) => {
  const response = await api.get('/bookings', { params });
  return response.data;
};

export const updateBookingStatus = async (id, status, notes = '') => {
  invalidateAdminClientCache();
  const response = await api.patch(`/bookings/${id}/status`, { status, notes });
  return response.data;
};

export const updateBooking = async (id, data) => {
  invalidateAdminClientCache();
  const response = await api.patch(`/admin/bookings/${id}`, data);
  return response.data;
};

export const deleteBooking = async (id) => {
  invalidateAdminClientCache();
  const response = await api.delete(`/admin/bookings/${id}`);
  return response.data;
};

// Worker Management
export const createWorker = async (workerData) => {
  invalidateAdminClientCache();
  const response = await api.post('/admin/workers', workerData);
  return response.data;
};

export const updateWorker = async (workerId, data) => {
  invalidateAdminClientCache();
  const response = await api.put(`/admin/workers/${workerId}`, data);
  return response.data;
};

export const deleteWorker = async (workerId) => {
  invalidateAdminClientCache();
  const response = await api.delete(`/admin/workers/${workerId}`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};
