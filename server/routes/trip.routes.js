import express from 'express';
import { generateTrip, modifyTrip, getUserTrips } from '../controllers/trip.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all trip routes
router.use(authMiddleware);

// Generate a new trip based on prompt
router.post('/generate', generateTrip);

// Modify an existing trip via chat
router.post('/chat', modifyTrip);

// Get all trips for the logged in user
router.get('/', getUserTrips);

export default router;
