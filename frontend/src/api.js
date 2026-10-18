import axios from 'axios';
import { CacheEngine } from './services/cacheEngine';

// Smart environment detection:
// When running locally in browser (localhost / 127.0.0.1), connect to local backend (http://localhost:5000/api)
// When deployed, connect to configured VITE_API_BASE_URL
const isBrowserLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE = isBrowserLocal
  ? (import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000/api')
  : (import.meta.env.VITE_API_BASE_URL || 'https://kaamsetu-nyud.onrender.com/api');

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Automatically sends and stores secure HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically based on context (Dual mode: Cookie + Bearer for backward compatibility)
api.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    const customerToken = localStorage.getItem('kaamsetu_customer_token');
    const workerToken = localStorage.getItem('kaamsetu_worker_token');
    const adminToken = localStorage.getItem('kaamsetu_admin_token');
    
    if (config.url && config.url.includes('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (config.url && config.url.includes('/worker') && workerToken) {
      config.headers.Authorization = `Bearer ${workerToken}`;
    } else if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
    } else if (workerToken) {
      config.headers.Authorization = `Bearer ${workerToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }
  return config;
});

// ==========================================
// SESSION CONFIGURATION (24 HOURS)
// ==========================================
export const SESSION_24H_MS = 24 * 60 * 60 * 1000;

export const getValidCustomerSession = () => {
  try {
    const token = localStorage.getItem('kaamsetu_customer_token');
    const userStr = localStorage.getItem('kaamsetu_customer_user');
    const loginTime = localStorage.getItem('kaamsetu_customer_login_time');

    if (!userStr) return null;

    if (loginTime) {
      const elapsed = Date.now() - Number(loginTime);
      if (elapsed > SESSION_24H_MS) {
        customerLogout();
        return null;
      }
    } else {
      localStorage.setItem('kaamsetu_customer_login_time', Date.now().toString());
    }

    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

export const getValidWorkerSession = () => {
  try {
    const token = localStorage.getItem('kaamsetu_worker_token');
    const workerStr = localStorage.getItem('kaamsetu_worker_user');
    const loginTime = localStorage.getItem('kaamsetu_worker_login_time');

    if (!workerStr) return null;

    if (loginTime) {
      const elapsed = Date.now() - Number(loginTime);
      if (elapsed > SESSION_24H_MS) {
        workerLogout();
        return null;
      }
    } else {
      localStorage.setItem('kaamsetu_worker_login_time', Date.now().toString());
    }

    return JSON.parse(workerStr);
  } catch (e) {
    return null;
  }
};

// ==========================================
// 1. CUSTOMER AUTH & HISTORY API
// ==========================================
export const customerRegister = async (data) => {
  const response = await api.post('/auth/customer/register', data);
  if (response.data?.token) {
    localStorage.setItem('kaamsetu_customer_token', response.data.token);
    localStorage.setItem('kaamsetu_customer_user', JSON.stringify(response.data.user));
    localStorage.setItem('kaamsetu_customer_login_time', Date.now().toString());
  }
  return response.data;
};

export const customerLogin = async ({ phone, pin }) => {
  const response = await api.post('/auth/customer/login', { phone, pin });
  if (response.data?.token) {
    localStorage.setItem('kaamsetu_customer_token', response.data.token);
    localStorage.setItem('kaamsetu_customer_user', JSON.stringify(response.data.user));
    localStorage.setItem('kaamsetu_customer_login_time', Date.now().toString());
  }
  return response.data;
};

export const getCustomerProfile = async () => {
  const response = await api.get('/auth/customer/me');
  return response.data;
};

export const updateCustomerProfile = async (data) => {
  const response = await api.put('/auth/customer/profile', data);
  if (response.data?.user) {
    localStorage.setItem('kaamsetu_customer_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const getMySecureBookings = async () => {
  const customerToken = localStorage.getItem('kaamsetu_customer_token');
  const response = await api.get('/bookings/my-history', {
    headers: customerToken ? { Authorization: `Bearer ${customerToken}` } : {}
  });
  return response.data;
};

export const customerLogout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {}
  localStorage.removeItem('kaamsetu_customer_token');
  localStorage.removeItem('kaamsetu_customer_user');
  localStorage.removeItem('kaamsetu_customer_login_time');
  CacheEngine.invalidate('my_bookings');
};

// ==========================================
// 2. WORKER AUTH & DASHBOARD API
// ==========================================
export const workerLogin = async ({ phone, pin }) => {
  const response = await api.post('/auth/worker/login', { phone, pin });
  if (response.data?.token) {
    localStorage.setItem('kaamsetu_worker_token', response.data.token);
    localStorage.setItem('kaamsetu_worker_user', JSON.stringify(response.data.worker));
    localStorage.setItem('kaamsetu_worker_login_time', Date.now().toString());
  }
  return response.data;
};

export const workerSetPin = async ({ phone, pin }) => {
  const response = await api.post('/auth/worker/set-pin', { phone, pin });
  if (response.data?.token) {
    localStorage.setItem('kaamsetu_worker_token', response.data.token);
    localStorage.setItem('kaamsetu_worker_user', JSON.stringify(response.data.worker));
    localStorage.setItem('kaamsetu_worker_login_time', Date.now().toString());
  }
  return response.data;
};

export const getWorkerProfile = async () => {
  const workerToken = localStorage.getItem('kaamsetu_worker_token');
  const response = await api.get('/auth/worker/me', {
    headers: workerToken ? { Authorization: `Bearer ${workerToken}` } : {}
  });
  return response.data;
};

export const getWorkerSecureJobs = async () => {
  const workerToken = localStorage.getItem('kaamsetu_worker_token');
  const response = await api.get('/bookings/worker-history', {
    headers: workerToken ? { Authorization: `Bearer ${workerToken}` } : {}
  });
  return response.data;
};

export const toggleWorkerAvailability = async () => {
  const workerToken = localStorage.getItem('kaamsetu_worker_token');
  const response = await api.patch('/auth/worker/availability', {}, {
    headers: workerToken ? { Authorization: `Bearer ${workerToken}` } : {}
  });
  CacheEngine.invalidate('workers');
  return response.data;
};

export const workerLogout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {}
  localStorage.removeItem('kaamsetu_worker_token');
  localStorage.removeItem('kaamsetu_worker_user');
  localStorage.removeItem('kaamsetu_worker_login_time');
  CacheEngine.invalidate('worker_jobs');
};

// ==========================================
// 3. WORKERS & BOOKINGS GENERAL API (WITH BROWSER CACHE)
// ==========================================
export const getWorkers = async (params = {}, onInstantCache = null) => {
  const paramKey = JSON.stringify(params);
  const cacheKey = `workers_${paramKey}`;

  // Check instant browser cache
  const cached = CacheEngine.get(cacheKey, true);
  if (cached && typeof onInstantCache === 'function') {
    onInstantCache(cached);
  }

  const response = await api.get('/workers', { params });
  if (response.data && response.data.success) {
    CacheEngine.set(cacheKey, response.data, 120); // 2 minutes browser cache
  }
  return response.data;
};

export const getWorkerById = async (id) => {
  const cacheKey = `worker_${id}`;
  const cached = CacheEngine.get(cacheKey, true);
  if (cached) return cached;

  const response = await api.get(`/workers/${id}`);
  if (response.data?.success) {
    CacheEngine.set(cacheKey, response.data, 180);
  }
  return response.data;
};

export const registerWorker = async (workerData) => {
  const response = await api.post('/workers', workerData);
  CacheEngine.invalidate('workers');
  CacheEngine.invalidate('categories');
  return response.data;
};

export const updateWorker = async (workerId, data) => {
  const response = await api.put(`/workers/${workerId}`, data);
  CacheEngine.invalidate(`worker_${workerId}`);
  CacheEngine.invalidate('workers');
  return response.data;
};

export const deleteWorker = async (workerId) => {
  const response = await api.delete(`/admin/workers/${workerId}`);
  CacheEngine.invalidate(`worker_${workerId}`);
  CacheEngine.invalidate('workers');
  return response.data;
};

export const addWorkerReview = async (workerId, reviewData) => {
  const response = await api.post(`/workers/${workerId}/reviews`, reviewData);
  CacheEngine.invalidate(`worker_${workerId}`);
  CacheEngine.invalidate('workers');
  return response.data;
};

export const getCategories = async (forceRefresh = false) => {
  const cacheKey = 'categories_all';
  if (!forceRefresh) {
    const cached = CacheEngine.get(cacheKey, false);
    if (cached) return cached;
  }
  const response = await api.get('/categories');
  if (response.data && response.data.success) {
    CacheEngine.set(cacheKey, response.data, 600); // 10 minutes cache for categories
  }
  return response.data;
};

export const createBooking = async (bookingData) => {
  const customerToken = localStorage.getItem('kaamsetu_customer_token');
  const response = await api.post('/bookings', bookingData, {
    headers: customerToken ? { Authorization: `Bearer ${customerToken}` } : {}
  });
  CacheEngine.invalidate('my_bookings');
  CacheEngine.invalidate('workers');
  return response.data;
};

export const getBookings = async (params = {}) => {
  const response = await api.get('/bookings', { params });
  return response.data;
};

export const getWorkerBookedSlots = async (workerId, date = '') => {
  const params = date ? { date } : {};
  const response = await api.get(`/bookings/worker-slots/${workerId}`, { params });
  return response.data;
};

export const getWorkerHistory = async (workerId) => {
  const response = await api.get(`/bookings/worker/${workerId}`);
  return response.data;
};

export const getEmployers = async () => {
  const response = await api.get('/bookings/employers');
  return response.data;
};

export const updateBookingStatus = async (id, status, notes = '') => {
  const response = await api.patch(`/bookings/${id}/status`, { status, notes });
  CacheEngine.invalidate('my_bookings');
  CacheEngine.invalidate('worker_jobs');
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  CacheEngine.invalidate('my_bookings');
  CacheEngine.invalidate('worker_jobs');
  return response.data;
};

// ==========================================
// 4. ADMIN ENDPOINTS
// ==========================================
export const adminLogin = async (pin) => {
  const response = await api.post('/admin/login', { pin });
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};
