import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const updateProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const updateTheme = async (userId, theme) => {
  const user = await User.findByIdAndUpdate(userId, { theme }, { new: true, runValidators: true });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const updateProfileImage = async (userId, imageUrl) => {
  const user = await User.findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true, runValidators: true });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};
