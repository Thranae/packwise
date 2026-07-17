import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import corsOptions from './config/cors.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import ProviderManager from './services/ai/ProviderManager.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', routes);

app.use('/uploads', express.static('uploads'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  try {
    await ProviderManager.initialize();
  } catch (error) {
    console.error('Failed to initialize AI Provider Manager:', error);
  }

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
