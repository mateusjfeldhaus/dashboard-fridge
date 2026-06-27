import axios from 'axios';
import { getToken, clearToken } from '../auth';
import type { Item, DecrementResponse, LoginResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

export const login = (password: string) =>
  api.post<LoginResponse>('/auth/login', { password });

export const getItems = (params?: Record<string, string>) =>
  api.get<Item[]>('/items', { params });

export const getItem = (id: string) =>
  api.get<Item>(`/items/${id}`);

export const createItem = (formData: FormData) =>
  api.post<Item>('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateItem = (id: string, formData: FormData) =>
  api.put<Item>(`/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteItem = (id: string) =>
  api.delete<{ message: string; item: Item }>(`/items/${id}`);

export const decrementQuantity = (id: string, amount: number) =>
  api.patch<DecrementResponse>(`/items/${id}/quantity`, { amount });

export const updateItemImage = (id: string, file: File) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.patch<Item>(`/items/${id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
