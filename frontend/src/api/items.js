import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

export const getItems = (params) => api.get('/items', { params });
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (formData) =>
  api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateItem = (id, formData) =>
  api.put(`/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteItem = (id) => api.delete(`/items/${id}`);
