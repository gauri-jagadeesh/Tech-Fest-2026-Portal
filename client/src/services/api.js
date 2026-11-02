import axios from 'axios';

// Get API URL from Vite environment or default to local fallback
// Automatically handles port 5000/5001 fallback if port 5000 was busy on mac
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
// Ensure no trailing slash
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor: Automatically attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('techfest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token invalid/expired on a protected route
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('techfest_token');
        localStorage.removeItem('techfest_user');
      }
    }
    return Promise.reject(error);
  }
);

// Health Check API
export const healthApi = {
  check: () => api.get('/api/health'),
};

// Authentication API
export const authApi = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getMe: () => api.get('/api/auth/me'),
};

// Events API
export const eventsApi = {
  getAll: (params) => api.get('/api/events', { params }),
  getById: (id) => api.get(`/api/events/${id}`),
  create: (data) => api.post('/api/events', data),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  delete: (id) => api.delete(`/api/events/${id}`),
};

// Registrations API
export const registrationsApi = {
  register: (data) => api.post('/api/registrations', data),
  getMy: () => api.get('/api/registrations/my'),
  cancel: (id) => api.delete(`/api/registrations/${id}`),
  getAll: (params) => api.get('/api/registrations', { params }),
  updateStatus: (id, status) => api.put(`/api/registrations/${id}`, { status }),
};

// Users API
export const usersApi = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getAll: () => api.get('/api/users'),
};

export default api;
