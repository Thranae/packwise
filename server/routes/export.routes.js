import express from 'express';
import { exportTripPDF } from '../controllers/export.controller.js';

const router = express.Router();

router.get('/trips/:id/pdf', exportTripPDF);

export default router;
