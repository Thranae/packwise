import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/app';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://packwise.onrender.com/api',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT Bearer token if present
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        // Token is stored as a JSON string — strip surrounding quotes
        const cleanToken = token.replace(/^"|"$/g, '');
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    } catch (e) {
      console.warn("AsyncStorage error", e);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401s globally and normalize errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
        router.replace('/(auth)/login');
      } catch (e) {
        // ignore
      }
    }

    return Promise.reject(
      error.response?.data || {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
    );
  },
);

export default api;
