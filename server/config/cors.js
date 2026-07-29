import env from './env.js';

const allowedOrigins =
  env.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://127.0.0.1:5173']
    : []; // Add production origins here

const corsOptions = {
  origin(origin, callback) {
    // Allow all origins to ensure the PWA works on any network, IP, or tunnel
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours preflight cache
};

export default corsOptions;
