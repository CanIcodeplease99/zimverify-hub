import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (userData) => api.post('/api/auth/register', userData),
  getCurrentUser: () => api.get('/api/auth/me'),
};

// Vehicle API
export const vehicleAPI = {
  create: (vehicleData) => api.post('/api/vehicles', vehicleData),
  search: (params) => api.get('/api/vehicles/search', { params }),
  getById: (id) => api.get(`/api/vehicles/${id}`),
  update: (id, data) => api.put(`/api/vehicles/${id}`, data),
  flagInterpol: (id, reason) => api.post(`/api/vehicles/${id}/interpol-flag`, { vehicle_id: id, reason }),
  unflagInterpol: (id) => api.delete(`/api/vehicles/${id}/interpol-flag`),
};

// Stats API
export const statsAPI = {
  get: () => api.get('/api/stats'),
};

// Audit API
export const auditAPI = {
  getLogs: (params) => api.get('/api/audit-logs', { params }),
};

export default api;
