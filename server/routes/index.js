import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import tripRoutes from './trip.routes.js';
import imageRoutes from './image.routes.js';
import weatherRoutes from './weather.routes.js';
import currencyRoutes from './currency.routes.js';
import aiRoutes from './ai.routes.js';
import smsRoutes from './smsRoutes.js';

import exportRoutes from './export.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/images', imageRoutes);
router.use('/weather', weatherRoutes);
router.use('/currency', currencyRoutes);
router.use('/ai', aiRoutes);
router.use('/sms', smsRoutes);
router.use('/export', exportRoutes);

export default router;

