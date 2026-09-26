import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin Auth
export const adminLogin = async (pin) => {
  const response = await api.post('/admin/login', { pin });
  return response.data;
};

// Admin Overview Analytics
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// Workers Ledger (All Workers + Their complete work history)
export const getWorkersLedger = async () => {
  const response = await api.get('/admin/workers-ledger');
  return response.data;
};

// Employers Ledger (All Hirers/Customers + Their complete hiring history)
export const getEmployersLedger = async () => {
  const response = await api.get('/admin/employers');
  return response.data;
};

// Master Bookings & Jobs
export const getAllBookings = async (params = {}) => {
  const response = await api.get('/bookings', { params });
  return response.data;
};

export const updateBookingStatus = async (id, status, notes = '') => {
  const response = await api.patch(`/bookings/${id}/status`, { status, notes });
  return response.data;
};

export const updateBooking = async (id, data) => {
  const response = await api.patch(`/admin/bookings/${id}`, data);
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/admin/bookings/${id}`);
  return response.data;
};

// Worker Management
export const createWorker = async (workerData) => {
  const response = await api.post('/admin/workers', workerData);
  return response.data;
};

export const updateWorker = async (workerId, data) => {
  const response = await api.put(`/admin/workers/${workerId}`, data);
  return response.data;
};

export const deleteWorker = async (workerId) => {
  const response = await api.delete(`/admin/workers/${workerId}`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};
