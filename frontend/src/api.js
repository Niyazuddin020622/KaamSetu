import axios from 'axios';

// Smart environment detection:
// When running locally in browser (localhost / 127.0.0.1), automatically connect to local backend (http://localhost:5000/api)
// When deployed on Vercel / production, connect to VITE_API_BASE_URL (Render backend)
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

// Attach JWT token automatically based on context (Customer or Worker)
api.interceptors.request.use((config) => {
  // If request config already has an Authorization header, respect it
  if (!config.headers.Authorization) {
    const customerToken = localStorage.getItem('kaamsetu_customer_token');
    const workerToken = localStorage.getItem('kaamsetu_worker_token');
    
    // If calling worker specific endpoints, prioritize workerToken
    if (config.url && config.url.includes('/worker') && workerToken) {
      config.headers.Authorization = `Bearer ${workerToken}`;
    } else if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
    } else if (workerToken) {
      config.headers.Authorization = `Bearer ${workerToken}`;
    }
  }
  return config;
});

// ==========================================
// ==========================================
// SESSION CONFIGURATION (24 HOURS)
// ==========================================
export const SESSION_24H_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const getValidCustomerSession = () => {
  try {
    const token = localStorage.getItem('kaamsetu_customer_token');
    const userStr = localStorage.getItem('kaamsetu_customer_user');
    const loginTime = localStorage.getItem('kaamsetu_customer_login_time');

    if (!token || !userStr) return null;

    if (loginTime) {
      const elapsed = Date.now() - Number(loginTime);
      if (elapsed > SESSION_24H_MS) {
        // Expired 24h session - clear
        customerLogout();
        return null;
      }
    } else {
      // Legacy session without timestamp - set current time
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

    if (!token || !workerStr) return null;

    if (loginTime) {
      const elapsed = Date.now() - Number(loginTime);
      if (elapsed > SESSION_24H_MS) {
        // Expired 24h session - clear
        workerLogout();
        return null;
      }
    } else {
      // Legacy session without timestamp - set current time
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

export const customerLogout = () => {
  localStorage.removeItem('kaamsetu_customer_token');
  localStorage.removeItem('kaamsetu_customer_user');
  localStorage.removeItem('kaamsetu_customer_login_time');
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
  return response.data;
};

export const workerLogout = () => {
  localStorage.removeItem('kaamsetu_worker_token');
  localStorage.removeItem('kaamsetu_worker_user');
  localStorage.removeItem('kaamsetu_worker_login_time');
};

// ==========================================
// 3. WORKERS & BOOKINGS GENERAL API
// ==========================================
export const getWorkers = async (params = {}) => {
  const response = await api.get('/workers', { params });
  return response.data;
};

export const getWorkerById = async (id) => {
  const response = await api.get(`/workers/${id}`);
  return response.data;
};

export const registerWorker = async (workerData) => {
  const response = await api.post('/workers', workerData);
  return response.data;
};

export const updateWorker = async (workerId, data) => {
  const response = await api.put(`/workers/${workerId}`, data);
  return response.data;
};

export const deleteWorker = async (workerId) => {
  const response = await api.delete(`/admin/workers/${workerId}`);
  return response.data;
};

export const addWorkerReview = async (workerId, reviewData) => {
  const response = await api.post(`/workers/${workerId}/reviews`, reviewData);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createBooking = async (bookingData) => {
  const customerToken = localStorage.getItem('kaamsetu_customer_token');
  const response = await api.post('/bookings', bookingData, {
    headers: customerToken ? { Authorization: `Bearer ${customerToken}` } : {}
  });
  return response.data;
};

export const getBookings = async (params = {}) => {
  const response = await api.get('/bookings', { params });
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
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
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
