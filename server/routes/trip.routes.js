import express from 'express';
import { generateTrip, modifyTrip, getUserTrips, createTrip, deleteTrip, duplicateTrip, toggleFavorite, getPublicTrip } from '../controllers/trip.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route for shared trips
router.get('/public/:id', getPublicTrip);

// Apply auth middleware to all other trip routes
router.use(authMiddleware);

// Generate a new trip based on prompt
router.post('/generate', generateTrip);

// Modify an existing trip via chat
router.post('/chat', modifyTrip);

// Create a trip directly
router.post('/', createTrip);

// Get all trips for the logged in user
router.get('/', getUserTrips);

// Delete a trip
router.delete('/:id', deleteTrip);

// Duplicate a trip
router.post('/:id/duplicate', duplicateTrip);

// Toggle favorite status
router.patch('/:id/favorite', toggleFavorite);

export default router;
