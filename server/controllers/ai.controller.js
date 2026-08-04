import aiService from '../services/ai.service.js';
import Cache from '../models/Cache.js';
import itineraryOptimizerService from '../services/itineraryOptimizer.service.js';
import notificationsService from '../services/notifications.service.js';
import ProviderManager from '../services/ai/ProviderManager.js';
import * as pdfExportService from '../services/pdfExport.service.js';
import * as geminiService from '../services/geminiService.js';
import Trip from '../models/Trip.js';
import { getTripScore } from './tripScore.controller.js';
import { catchAsync } from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import weatherService from '../services/weather.service.js';

const getCachedOrGenerate = async (cacheKey, generateFn) => {
  try {
    const existingCache = await Cache.findOne({ key: cacheKey });
    if (existingCache) {
      console.log(`[Cache Hit] ${cacheKey}`);
      return existingCache.data;
    }

    console.log(`[Cache Miss] ${cacheKey}`);
    const result = await generateFn();
    
    // Use upsert to prevent duplicate key errors on concurrent requests
    await Cache.findOneAndUpdate(
      { key: cacheKey },
      { key: cacheKey, data: result },
      { upsert: true, new: true }
    );
    return result;
  } catch (err) {
    console.error(`[Cache Error] Failed to interact with DB cache for ${cacheKey}`, err);
    // Fallback to generating without caching if DB fails
    return await generateFn();
  }
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
    const travelPreferences = req.user?.travelPreferences || null;
    const cacheKey = `trip_${prompt}_${JSON.stringify(travelPreferences || {})}`;
    const result = await getCachedOrGenerate(cacheKey, async () => {
      const aiTrip = await aiService.generateFullTrip(prompt, travelPreferences);
      try {
        const liveWeather = await weatherService.getWeather(aiTrip.destination);
        if (liveWeather && liveWeather.current) {
          aiTrip.weather = liveWeather;
        }
      } catch (err) {
        console.warn("Could not fetch live weather, falling back to AI generated weather.");
      }
      return aiTrip;
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPackingList = async (req, res) => {
  try {
    const { destination, weather, duration, gender } = req.body;
    const cacheKey = `pack_${destination}_${duration}_${gender}_${JSON.stringify(weather)}`;
    const result = await getCachedOrGenerate(cacheKey, () => aiService.generatePackingList(destination, weather, duration, gender));
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
      await Cache.deleteOne({ key: cacheKey });
    }
    
    const result = await getCachedOrGenerate(cacheKey, () => aiService.recommendPlaces(destination, category));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInspirationImageQueries = async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }
    const cacheKey = `inspiration_queries_${destination}`;
    const result = await getCachedOrGenerate(cacheKey, () => aiService.generateInspirationImageQueries(destination));
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

export const chatAssistantStream = async (req, res) => {
  try {
    const { message, context } = req.body;
    const stream = await aiService.travelAssistantStream(message, context);
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPackingAlternative = async (req, res) => {
  try {
    const { destination, item } = req.body;
    
    if (!item) {
      return res.status(400).json({ message: "Item is required" });
    }

    const alternative = await aiService.getPackingAlternative(destination, item);
    return res.status(200).json({ alternative });
  } catch (error) {
    console.error("Packing alternative generation failed:", error);
    res.status(500).json({ message: "Failed to generate packing alternative", error: error.message });
  }
};

// Feature 3: Itinerary Optimizer
export const optimizeItinerary = async (req, res) => {
  try {
    const { itinerary, destination } = req.body;
    if (!itinerary || !destination) return res.status(400).json({ error: 'itinerary and destination are required' });
    const result = await itineraryOptimizerService.optimizeItinerary(itinerary, destination);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Feature 7: Memory Journal
export const generateMemoryJournal = async (req, res) => {
  try {
    const { tripId } = req.body;
    const trip = tripId ? await Trip.findById(tripId).lean() : req.body.trip;
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const journal = await aiService.generateMemoryJournal(trip);

    // Save journal back to the trip document
    if (tripId) {
      await Trip.findByIdAndUpdate(tripId, { memoryJournal: journal });
    }

    res.json(journal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resolveDestination = catchAsync(async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return ApiResponse.send(res, 400, 'Query is required');
  }

  // Use Gemini to resolve vague queries to concrete locations
  const prompt = `
  A user is searching for a travel destination. Their query is: "${query}"
  Return a JSON array of 1 to 3 objects representing the most likely concrete destinations they mean.
  For example, if they search "tulip garden", you should return Keukenhof Gardens.
  If they search "pharaoh", return Giza Necropolis.
  
  Format:
  [
    {
      "name": "Specific Name (e.g. Keukenhof Gardens)",
      "location": "City, Country (e.g. Lisse, Netherlands)",
      "type": "Category (e.g. Botanical Garden, Ancient Wonder, City)",
      "icon": "A single emoji representing it"
    }
  ]
  Return ONLY the JSON array.
  `;

  try {
    let result = await geminiService.generateContent(prompt);
    // Remove markdown
    result = result.replace(/```json/g, '').replace(/```/g, '').trim();
    const destinations = JSON.parse(result);
    ApiResponse.send(res, 200, 'Destination resolved successfully', destinations);
  } catch (error) {
    console.error("AI Resolution Error:", error);
    ApiResponse.send(res, 500, 'Failed to resolve destination');
  }
});

// Feature: Map View
export const geocodeRoute = async (req, res) => {
  try {
    const { itinerary, destination } = req.body;
    if (!itinerary || itinerary.length === 0 || !destination) {
      return res.status(400).json({ error: 'itinerary (array with dayObj) and destination are required' });
    }
    const dayObj = itinerary[0];
    const result = await itineraryOptimizerService.geocodeItinerary(dayObj, destination);
    res.json({ geocodedDay: result.day });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Feature 5: Send manual notification to trip user
export const sendTripNotification = async (req, res) => {
  try {
    const { tripId, message } = req.body;
    if (!tripId || !message) return res.status(400).json({ error: 'tripId and message required' });
    await notificationsService.notifyTripUser(tripId, message);
    res.json({ success: true, message: 'Notification sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getTripScore };
