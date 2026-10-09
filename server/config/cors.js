import env from './env.js';

const allowedOrigins =
  env.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://127.0.0.1:5173']
    : []; // Add production origins here

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (like mobile apps/postman) or explicit allowed origins
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'capacitor://localhost',
      'http://localhost',
      env.FRONTEND_URL || process.env.FRONTEND_URL
    ].filter(Boolean);

    if (!origin || allowed.includes(origin) || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400,
};

export default corsOptions;
