import express from 'express';
import rateLimit from 'express-rate-limit';
import { signupSchema, loginSchema } from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many auth attempts from this IP. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/verify-signup', authLimiter, authController.verifySignupOtp);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/google', authLimiter, authController.googleAuth);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/verify-otp', authLimiter, authController.verifyOtp);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.put('/preferences', authMiddleware, authController.updatePreferences);

export default router;
