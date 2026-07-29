import express from 'express';
import { registerFlightAlert, getUserFlightAlerts, getCurrentPrice } from '../controllers/flight.controller.js';

const router = express.Router();

router.post('/track', registerFlightAlert);
router.get('/alerts/:userId', getUserFlightAlerts);
router.get('/price', getCurrentPrice);

export default router;
