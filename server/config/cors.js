import env from './env.js';

const allowedOrigins =
  env.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://127.0.0.1:5173']
    : []; // Add production origins here

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours preflight cache
};

export default corsOptions;
