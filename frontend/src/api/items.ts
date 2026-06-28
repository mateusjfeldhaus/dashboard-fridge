import axios from 'axios';
import { getToken, getRefreshToken, setToken, clearTokens } from '../auth';
import type { Item, DecrementResponse, LoginResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Silent refresh — queue concurrent 401s while refreshing
let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config as typeof err.config & { _retry?: boolean };

    if (err.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }

    // If already refreshing, queue this request until we have the new token
    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      window.location.href = '/login?expired=true';
      return Promise.reject(err);
    }

    try {
      const { data } = await axios.post<{ token: string }>(
        `${BASE_URL}/auth/refresh`,
        { refreshToken }
      );
      setToken(data.token);
      pendingQueue.forEach((cb) => cb(data.token));
      pendingQueue = [];
      original.headers.Authorization = `Bearer ${data.token}`;
      return api(original);
    } catch {
      clearTokens();
      pendingQueue = [];
      window.location.href = '/login?expired=true';
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export const login = (password: string) =>
  api.post<LoginResponse>('/auth/login', { password });

export const getItems = (params?: Record<string, string>, signal?: AbortSignal) =>
  api.get<Item[]>('/items', { params, signal });

export const getItem = (id: string, signal?: AbortSignal) =>
  api.get<Item>(`/items/${id}`, { signal });

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
