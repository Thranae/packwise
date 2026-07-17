import { z } from 'zod';

export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  NAME_MIN: 'Name must be at least 2 characters',
  NAME_MAX: 'Name must be at most 50 characters',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN: 'Password must be at least 6 characters',
  GENDER_INVALID: 'Please select a valid gender option',
  TRAVEL_PREFERENCE_INVALID: 'Please select a valid travel preference',
};

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, VALIDATION_MESSAGES.NAME_MIN)
    .max(50, VALIDATION_MESSAGES.NAME_MAX),
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  password: z
    .string()
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  password: z
    .string()
    .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED),
});
