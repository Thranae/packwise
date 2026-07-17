import express from 'express';
import { sendReminder, cancelReminder } from '../controllers/smsController.js';

const router = express.Router();

router.post('/remind', sendReminder);
router.post('/cancel', cancelReminder);

export default router;
