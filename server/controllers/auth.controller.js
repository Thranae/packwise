import { catchAsync } from '../utils/catchAsync.js';
import * as authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const signup = catchAsync(async (req, res) => {
  const result = await authService.signupUser(req.body);
  ApiResponse.send(res, 201, 'User registered successfully', result);
});

export const verifySignupOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return ApiResponse.send(res, 400, 'Email and OTP are required');
  }
  const result = await authService.verifySignupOtp(email, otp);
  ApiResponse.send(res, 200, 'Email verified and registered successfully', result);
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);
  ApiResponse.send(res, 200, 'Login successful', result);
});

export const googleAuth = catchAsync(async (req, res) => {
  const { tokenId } = req.body;
  if (!tokenId) {
    return ApiResponse.send(res, 400, 'Token ID is required');
  }
  const result = await authService.googleAuthUser(tokenId);
  ApiResponse.send(res, 200, 'Google Login successful', result);
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return ApiResponse.send(res, 400, 'Email is required');
  }
  const result = await authService.generateOtpAndSendEmail(email);
  ApiResponse.send(res, 200, 'OTP sent', result);
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return ApiResponse.send(res, 400, 'Email and OTP are required');
  }
  const result = await authService.verifyOtpAndLogin({ email, otp });
  ApiResponse.send(res, 200, 'OTP verified and login successful', result);
});

export const logout = catchAsync(async (req, res) => {
  ApiResponse.send(res, 200, 'Logged out successfully');
});

export const getMe = catchAsync(async (req, res) => {
  ApiResponse.send(res, 200, 'User profile fetched', req.user);
});

export const updatePreferences = catchAsync(async (req, res) => {
  const user = req.user;
  user.travelPreferences = {
    ...user.travelPreferences,
    ...req.body
  };
  await user.save();
  ApiResponse.send(res, 200, 'Preferences updated successfully', user);
});
