import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').trim().optional(),
  displayName: z.string().max(30, 'Display Name must be less than 30 characters').trim().optional(),
  email: z.string().email().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  travelPreference: z.enum(['solo', 'couple', 'family', 'group', 'business']).optional(),
  profileImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
  homeAirport: z.string().max(10).trim().optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  travelStyles: z.array(z.string()).optional(),
  budgetPreference: z.string().optional(),
  currency: z.string().optional(),
});

export const updateThemeSchema = z.object({
  theme: z.enum(['light', 'dark']),
});
