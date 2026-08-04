import api from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Register a new user.
 *
 * @param {{ name: string, email: string, password: string, gender?: string, travelPreference?: string }} data
 * @returns {Promise<{ success: boolean, message: string, data: { token: string, user: object } }>}
 */
export const signup = async (data) => {
  const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, data);
  return response.data;
};

/**
 * Authenticate an existing user.
 *
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ success: boolean, message: string, data: { token: string, user: object } }>}
 */
export const login = async (data) => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};

/**
 * Log out the current user (invalidates session server-side).
 *
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const logout = async () => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  return response.data;
};

/**
 * Fetch the currently authenticated user's profile.
 *
 * @returns {Promise<{ success: boolean, message: string, data: object }>}
 */
export const getMe = async () => {
  const response = await api.get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

/**
 * Update the user's travel preferences.
 *
 * @param {object} preferences
 * @returns {Promise<{ success: boolean, message: string, data: object }>}
 */
export const updatePreferences = async (preferences) => {
  // In API endpoints, it will resolve to /auth/preferences
  const response = await api.put('/auth/preferences', preferences);
  return response.data;
};
