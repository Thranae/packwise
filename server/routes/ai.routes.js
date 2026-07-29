import express from 'express';
import * as aiController from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/trip', aiController.generateTrip);
router.post('/plan', aiController.getTripPlan);
router.post('/packing', aiController.getPackingList);
router.post('/packing/alternative', aiController.getPackingAlternative);
router.post('/budget', aiController.getBudgetAdvice);
router.post('/itinerary', aiController.getItinerary);
router.post('/recommendations', aiController.getRecommendations);
router.post('/chat', aiController.chatAssistant);
router.post('/chat/stream', aiController.chatAssistantStream);

// === Wow Backend Features ===
router.post('/trip-score', aiController.getTripScore);          // Feature 1: Trip Score
router.get('/trip-score/:tripId', aiController.getTripScore);  // Feature 1: Trip Score (by ID)
router.post('/optimize-itinerary', aiController.optimizeItinerary); // Feature 3: Itinerary Optimizer
router.post('/memory-journal', aiController.generateMemoryJournal); // Feature 7: Memory Journal
router.post('/notify', aiController.sendTripNotification);     // Feature 5: Send notification
router.post('/resolve-destination', aiController.resolveDestination); // Smart AI Search Resolution
router.post('/geocode-route', aiController.geocodeRoute); // Feature: Map View
export default router;

