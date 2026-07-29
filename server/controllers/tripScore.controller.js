import tripScoreService from '../services/tripScore.service.js';
import Trip from '../models/Trip.js';
import Cache from '../models/Cache.js';

export const getTripScore = async (req, res) => {
  try {
    const { tripId } = req.params;
    const bodyTrip = req.body.trip;

    // Accept either a tripId (DB lookup) or inline trip data
    let trip = bodyTrip;
    if (!trip && tripId) {
      trip = await Trip.findById(tripId).lean();
    }

    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Cache score for 1 hour
    const cacheKey = `trip_score_${trip._id || tripId}_${new Date().toISOString().slice(0, 13)}`;
    const cached = await Cache.findOne({ key: cacheKey });
    if (cached) return res.json(cached.data);

    const score = await tripScoreService.analyze(trip);

    await Cache.findOneAndUpdate({ key: cacheKey }, { key: cacheKey, data: score }, { upsert: true, new: true });

    res.json(score);
  } catch (err) {
    console.error('[TripScore] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
