import api from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Fetch the authenticated user's profile.
 *
 * @returns {Promise<{ success: boolean, message: string, data: object }>}
 */
export const getProfile = async () => {
  const response = await api.get(API_ENDPOINTS.USERS.PROFILE);
  return response.data;
};

/**
 * Update the authenticated user's profile.
 *
 * @param {object} data - The profile fields to update.
 * @returns {Promise<{ success: boolean, message: string, data: object }>}
 */
export const updateProfile = async (data) => {
  const response = await api.put(API_ENDPOINTS.USERS.PROFILE, data);
  return response.data;
};

/**
 * Update the authenticated user's theme preference.
 *
 * @param {string} theme - 'light' or 'dark'.
 * @returns {Promise<{ success: boolean, message: string, data: object }>}
 */
export const updateTheme = async (theme) => {
  const response = await api.patch(API_ENDPOINTS.USERS.THEME, { theme });
  return response.data;
};

/**
 * Uploads a profile image for the current user.
 * @param {FormData} formData
 * @returns {Promise<{ success: boolean, message: string, data: object }>}
 */
export const uploadProfileImage = async (formData) => {
  const response = await api.post('/users/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
