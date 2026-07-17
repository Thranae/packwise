import { catchAsync } from '../utils/catchAsync.js';
import * as userService from '../services/user.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  ApiResponse.send(res, 200, 'Profile fetched', user);
});

export const updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user._id, req.body);
  ApiResponse.send(res, 200, 'Profile updated', updatedUser);
});

export const getTheme = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  ApiResponse.send(res, 200, 'Theme fetched', { theme: user.theme || 'dark' });
});

export const updateTheme = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateTheme(req.user._id, req.body.theme);
  ApiResponse.send(res, 200, 'Theme updated', updatedUser);
});

export const uploadProfileImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return ApiResponse.send(res, 400, 'No image file provided');
  }

  // Construct URL for the uploaded file
  // E.g., http://localhost:5000/uploads/profiles/filename.jpg
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`;
  
  const updatedUser = await userService.updateProfileImage(req.user._id, imageUrl);
  ApiResponse.send(res, 200, 'Profile image updated successfully', updatedUser);
});
