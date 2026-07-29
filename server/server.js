import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import connectDB from './config/db.js';
import corsOptions from './config/cors.js';
import routes from './routes/index.js';
import flightRoutes from './routes/flight.routes.js';
import exportRoutes from './routes/export.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import ProviderManager from './services/ai/ProviderManager.js';
import notificationsService from './services/notifications.service.js';
import flightTrackerService from './services/flightTracker.service.js';

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', routes);
app.use('/api/flights', flightRoutes);   // Feature 2: Flight Tracker
app.use('/api/export', exportRoutes);    // Feature 6: PDF Export

// Ping route to keep the free-tier server awake via cron services
app.get('/api/ping', (req, res) => res.status(200).json({ status: 'ok', message: 'Server is awake' }));

app.use('/uploads', express.static('uploads'));

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA Fallback for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  try {
    await ProviderManager.initialize();
  } catch (error) {
    console.error('Failed to initialize AI Provider Manager:', error);
  }

  // === Feature 5: Smart Notification Cron Jobs ===
  // Run trip reminders every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Running trip reminders...');
    await notificationsService.runTripReminders();
  });

  // === Feature 2: Flight Price Tracker Cron Job ===
  // Check flight prices every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    console.log('[Cron] Checking flight prices...');
    await flightTrackerService.checkAllPrices();
  });

  console.log('[Cron] Scheduled jobs: trip reminders (hourly), flight prices (every 2h)');

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});

