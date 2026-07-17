import express from 'express';
import { getCurrencyTrend } from '../controllers/currency.controller.js';

const router = express.Router();

router.get('/trend/:targetCurrency', getCurrencyTrend);

export default router;
