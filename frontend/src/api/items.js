import axios from 'axios';
import { getToken, clearToken } from '../auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const login = (password) =>
  api.post('/auth/login', { password });

export const getItems = (params) => api.get('/items', { params });
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (formData) =>
  api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateItem = (id, formData) =>
  api.put(`/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteItem = (id) => api.delete(`/items/${id}`);
export const decrementQuantity = (id, amount) => api.patch(`/items/${id}/quantity`, { amount });
export const updateItemImage = (id, file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.patch(`/items/${id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
