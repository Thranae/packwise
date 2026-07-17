import express from 'express';
import * as aiController from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/trip', aiController.generateTrip);
router.post('/plan', aiController.getTripPlan);
router.post('/packing', aiController.getPackingList);
router.post('/budget', aiController.getBudgetAdvice);
router.post('/itinerary', aiController.getItinerary);
router.post('/recommendations', aiController.getRecommendations);
router.post('/chat', aiController.chatAssistant);

export default router;
