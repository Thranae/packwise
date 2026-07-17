import weatherService from '../services/weather.service.js';

// Simple in-memory cache: Map of { destination: { data, timestamp } }
const weatherCache = new Map();
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export const getWeather = async (req, res) => {
  try {
    const { destination } = req.params;

    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    const normalizedDest = destination.toLowerCase().trim();

    // Check cache
    if (weatherCache.has(normalizedDest)) {
      const cached = weatherCache.get(normalizedDest);
      const now = Date.now();
      
      if (now - cached.timestamp < CACHE_DURATION_MS) {
        console.log(`[Weather Cache Hit] Serving data for ${normalizedDest}`);
        return res.json(cached.data);
      } else {
        // Cache expired
        weatherCache.delete(normalizedDest);
      }
    }

    console.log(`[Weather Cache Miss] Fetching fresh data for ${normalizedDest}`);
    const data = await weatherService.getWeather(destination);

    // Save to cache
    weatherCache.set(normalizedDest, {
      data,
      timestamp: Date.now()
    });

    res.json(data);
  } catch (error) {
    console.error('Weather Controller Error:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch weather data',
      error: error.message 
    });
  }
};
