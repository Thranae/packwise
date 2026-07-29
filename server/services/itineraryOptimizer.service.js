import axios from 'axios';
import aiService from './ai.service.js';

/**
 * Itinerary Optimizer Service
 * Re-orders a day's activities by geographic proximity to minimize travel time.
 */
class ItineraryOptimizerService {

  /**
   * Optimize a full multi-day itinerary
   * @param {Array} itinerary - Array of { day, title, activities: [{time, place, description}] }
   * @param {string} destination - City/destination name for geocoding context
   */
  async optimizeItinerary(itinerary, destination) {
    if (!itinerary || itinerary.length === 0) return { optimized: [], savedMinutes: 0, tips: [] };

    const optimizedDays = await Promise.all(
      itinerary.map(day => this._optimizeDay(day, destination))
    );

    const totalSaved = optimizedDays.reduce((sum, d) => sum + (d.savedMinutes || 0), 0);
    const aiTips = await this._getAIOptimizationTips(destination, totalSaved);

    return {
      optimized: optimizedDays.map(d => d.day),
      totalSavedMinutes: totalSaved,
      tips: aiTips,
      optimizedAt: new Date().toISOString(),
    };
  }

  async geocodeItinerary(dayObj, destination) {
    const { activities } = dayObj;
    if (!activities || activities.length === 0) {
      return { day: dayObj };
    }

    // Geocode each activity
    const geocoded = await Promise.all(
      activities.map(act => this._geocode(act.place || act.title, destination))
    );

    // Enrich activities with coordinates, preserving order and times
    const enrichedActivities = activities.map((act, i) => ({
      ...act,
      lat: geocoded[i]?.lat,
      lon: geocoded[i]?.lon,
    }));

    return {
      day: { ...dayObj, activities: enrichedActivities }
    };
  }

  async _optimizeDay(dayObj, destination) {
    const { activities } = dayObj;
    if (!activities || activities.length <= 1) {
      return { day: dayObj, savedMinutes: 0 };
    }

    // Geocode each activity
    const geocoded = await Promise.all(
      activities.map(act => this._geocode(act.place || act.description, destination))
    );

    // Filter out activities we couldn't geocode
    const withCoords = activities.map((act, i) => ({
      ...act,
      lat: geocoded[i]?.lat,
      lon: geocoded[i]?.lon,
      geocoded: !!geocoded[i],
    }));

    // Use nearest-neighbor greedy algorithm to reorder
    const reordered = this._nearestNeighborSort(withCoords);

    // Estimate time savings
    const originalDistance = this._totalDistance(withCoords);
    const optimizedDistance = this._totalDistance(reordered);
    const distanceSavedKm = Math.max(0, originalDistance - optimizedDistance);
    const savedMinutes = Math.round(distanceSavedKm * 2); // ~30km/h average urban speed = 2min/km

    // Re-assign times sequentially starting from first activity's time
    const timedActivities = this._assignTimes(reordered);

    return {
      day: { ...dayObj, activities: timedActivities },
      savedMinutes,
      distanceSavedKm: Math.round(distanceSavedKm * 10) / 10,
    };
  }

  async _geocode(placeName, destination) {
    if (!placeName) return null;
    try {
      const query = `${placeName}, ${destination}`;
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1 },
        headers: { 'User-Agent': 'VoyageGenieTravelApp/1.0' },
        timeout: 4000,
      });
      if (res.data?.length > 0) {
        return { lat: parseFloat(res.data[0].lat), lon: parseFloat(res.data[0].lon) };
      }
    } catch (_) {}
    return null;
  }

  _nearestNeighborSort(activities) {
    const withCoords = activities.filter(a => a.geocoded);
    const withoutCoords = activities.filter(a => !a.geocoded);

    if (withCoords.length <= 1) return activities;

    const visited = new Set();
    const result = [];
    let current = withCoords[0];
    visited.add(0);
    result.push(current);

    while (result.length < withCoords.length) {
      let nearest = null;
      let nearestDist = Infinity;
      let nearestIdx = -1;

      withCoords.forEach((act, i) => {
        if (visited.has(i)) return;
        const dist = this._haversine(current.lat, current.lon, act.lat, act.lon);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = act;
          nearestIdx = i;
        }
      });

      if (nearest) {
        visited.add(nearestIdx);
        result.push(nearest);
        current = nearest;
      } else break;
    }

    return [...result, ...withoutCoords];
  }

  _haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  _totalDistance(activities) {
    let total = 0;
    for (let i = 0; i < activities.length - 1; i++) {
      if (activities[i].lat && activities[i + 1].lat) {
        total += this._haversine(activities[i].lat, activities[i].lon, activities[i + 1].lat, activities[i + 1].lon);
      }
    }
    return total;
  }

  _assignTimes(activities) {
    const parseHour = (timeStr) => {
      if (!timeStr) return 9;
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return 9;
      let h = parseInt(match[1]);
      if (match[3]?.toUpperCase() === 'PM' && h !== 12) h += 12;
      return h;
    };

    let currentHour = parseHour(activities[0]?.time);
    return activities.map((act, i) => {
      const time = `${String(currentHour).padStart(2, '0')}:00`;
      currentHour = Math.min(currentHour + 2, 21); // 2hr per activity, max 9PM
      return { ...act, time };
    });
  }

  async _getAIOptimizationTips(destination, savedMinutes) {
    try {
      const prompt = `You optimized a travel itinerary in ${destination} saving ${savedMinutes} minutes of travel time.
      Give 2 short, practical tips for efficient sightseeing in ${destination}.
      Return JSON: { "tips": ["tip1", "tip2"] }`;
      const result = await aiService._generateJson(prompt, { tips: [] }, 'lightweight');
      return result?.tips || [];
    } catch (_) {
      return [`Save ${savedMinutes} minutes by following the optimized order`, 'Use public transit between clustered attractions'];
    }
  }
}

export default new ItineraryOptimizerService();
