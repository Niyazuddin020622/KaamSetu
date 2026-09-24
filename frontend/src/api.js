import axios from 'axios';

// Support Vercel production environment variable, fallback to local dev backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});


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
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getBookings = async (params = {}) => {
  const response = await api.get('/bookings', { params });
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/admin/bookings/${id}`);
  return response.data;
};

// Admin Endpoints
export const adminLogin = async (pin) => {
  const response = await api.post('/admin/login', { pin });
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};
