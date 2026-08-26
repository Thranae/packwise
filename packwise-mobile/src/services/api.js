import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export const STORAGE_KEYS = {
  TOKEN: 'packwise_token',
  USER: 'packwise_user'
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://packwise-livid.vercel.app/api',
  timeout: 10000,
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
        const cleanToken = token.replace(/^"|"$/g, '');
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage', error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401s globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      // In a real app, redirect to login
      // router.replace('/login');
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
