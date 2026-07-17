import aiService from '../services/ai.service.js';

// Simple in-memory cache to prevent spamming the AI for the same requests during a session
const cache = new Map();

const getCachedOrGenerate = async (cacheKey, generateFn) => {
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  const result = await generateFn();
  cache.set(cacheKey, result);
  return result;
};

export const getTripPlan = async (req, res) => {
  try {
    const { destination, days } = req.body;
    const cacheKey = `plan_${destination}_${days}`;
    const result = await getCachedOrGenerate(cacheKey, () => aiService.generateTripPlan(destination, days || 3));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateTrip = async (req, res) => {
  try {
    const { prompt } = req.body;
    const cacheKey = `trip_${prompt}`;
    const result = await getCachedOrGenerate(cacheKey, () => aiService.generateFullTrip(prompt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPackingList = async (req, res) => {
  try {
    const { destination, weather, duration } = req.body;
    const cacheKey = `pack_${destination}_${duration}_${JSON.stringify(weather)}`;
    const result = await getCachedOrGenerate(cacheKey, () => aiService.generatePackingList(destination, weather, duration));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBudgetAdvice = async (req, res) => {
  try {
    const { destination, totalBudget, currency } = req.body;
    const cacheKey = `budget_${destination}_${totalBudget}_${currency}`;
    const result = await getCachedOrGenerate(cacheKey, () => aiService.generateBudgetAdvice(destination, totalBudget, currency || 'USD'));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getItinerary = async (req, res) => {
  try {
    const { destination, days } = req.body;
    const cacheKey = `itin_${destination}_${days}`;
    const result = await getCachedOrGenerate(cacheKey, () => aiService.generateItinerary(destination, days || 3));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { destination, category, refresh } = req.body;
    const cacheKey = `rec_${destination}_${category}`;
    
    if (refresh) {
      cache.delete(cacheKey);
    }
    
    const result = await getCachedOrGenerate(cacheKey, () => aiService.recommendPlaces(destination, category));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const chatAssistant = async (req, res) => {
  try {
    const { message, context } = req.body;
    // We don't cache chat messages as they are conversational
    const result = await aiService.travelAssistant(message, context);
    res.json({ reply: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
