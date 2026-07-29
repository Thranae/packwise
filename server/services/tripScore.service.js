import aiService from './ai.service.js';
import axios from 'axios';

class TripScoreService {
  /**
   * Analyze a trip and return a comprehensive risk + readiness score (0-100)
   */
  async analyze(trip) {
    const results = await Promise.allSettled([
      this._getWeatherRisk(trip),
      this._getBudgetScore(trip),
      this._getPackingScore(trip),
      this._getVisaRisk(trip),
    ]);

    const weatherRisk   = results[0].status === 'fulfilled' ? results[0].value : { score: 70, label: 'Unknown', detail: 'Weather data unavailable' };
    const budgetScore   = results[1].status === 'fulfilled' ? results[1].value : { score: 70, label: 'Unknown', detail: 'Budget data unavailable' };
    const packingScore  = results[2].status === 'fulfilled' ? results[2].value : { score: 0, label: 'Not Started', detail: 'No packing data' };
    const visaRisk      = results[3].status === 'fulfilled' ? results[3].value : { score: 70, label: 'Unknown', detail: 'Visa info unavailable' };

    const overall = Math.round(
      (weatherRisk.score * 0.25) +
      (budgetScore.score * 0.3) +
      (packingScore.score * 0.3) +
      (visaRisk.score * 0.15)
    );

    const label = overall >= 85 ? '🟢 Ready to Go'
      : overall >= 65 ? '🟡 Almost Ready'
      : overall >= 40 ? '🟠 Needs Attention'
      : '🔴 Not Ready';

    return {
      overallScore: overall,
      label,
      breakdown: {
        weather: weatherRisk,
        budget: budgetScore,
        packing: packingScore,
        visa: visaRisk,
      },
      recommendations: this._buildRecommendations(weatherRisk, budgetScore, packingScore, visaRisk),
      generatedAt: new Date().toISOString(),
    };
  }

  async _getWeatherRisk(trip) {
    try {
      const dest = trip.destination?.split('&')[0].trim() || trip.destination;
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(dest)}&limit=1&appid=${apiKey}`
      );
      if (!geoRes.data?.length) throw new Error('No geo data');

      const { lat, lon } = geoRes.data[0];
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=40`
      );

      const forecasts = weatherRes.data?.list || [];
      let riskFactors = [];
      let score = 100;

      const hasStorm = forecasts.some(f => f.weather[0]?.main === 'Thunderstorm');
      const hasHeavyRain = forecasts.some(f => f.weather[0]?.main === 'Rain' && f.rain?.['3h'] > 15);
      const hasExtreme = forecasts.some(f => f.main.temp > 42 || f.main.temp < -10);
      const avgTemp = forecasts.reduce((s, f) => s + f.main.temp, 0) / (forecasts.length || 1);

      if (hasStorm) { score -= 30; riskFactors.push('Thunderstorms forecast'); }
      if (hasHeavyRain) { score -= 20; riskFactors.push('Heavy rain expected'); }
      if (hasExtreme) { score -= 25; riskFactors.push('Extreme temperatures'); }

      const label = score >= 80 ? 'Good' : score >= 60 ? 'Moderate Risk' : 'High Risk';
      return {
        score: Math.max(score, 0),
        label,
        avgTemp: Math.round(avgTemp),
        risks: riskFactors,
        detail: riskFactors.length ? riskFactors.join(', ') : `Avg temp ${Math.round(avgTemp)}°C — conditions look fine`,
      };
    } catch (err) {
      return { score: 75, label: 'Unavailable', detail: 'Could not fetch weather data', risks: [] };
    }
  }

  async _getBudgetScore(trip) {
    const { budget, startDate, endDate, destination } = trip;
    if (!budget || budget === 0) return { score: 40, label: 'No Budget Set', detail: 'Please set a budget for your trip' };

    const days = startDate && endDate
      ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      : 7;

    const dailyBudget = budget / days;

    // AI-powered cost estimate
    try {
      const advice = await aiService.generateBudgetAdvice(destination, budget, trip.currency || 'USD');
      const dailyCost = advice?.expectedDailyCost || 0;
      if (dailyCost > 0) {
        const ratio = dailyBudget / dailyCost;
        const score = Math.min(100, Math.round(ratio * 80));
        return {
          score,
          label: score >= 80 ? 'Comfortable' : score >= 60 ? 'Tight' : 'Insufficient',
          dailyBudget: Math.round(dailyBudget),
          estimatedDailyCost: dailyCost,
          detail: `$${Math.round(dailyBudget)}/day budget vs ~$${dailyCost}/day estimated cost in ${destination}`,
        };
      }
    } catch (_) {}

    // Heuristic fallback
    const score = dailyBudget > 200 ? 95 : dailyBudget > 100 ? 80 : dailyBudget > 50 ? 60 : 35;
    return {
      score,
      label: score >= 80 ? 'Comfortable' : 'Tight',
      dailyBudget: Math.round(dailyBudget),
      detail: `$${Math.round(dailyBudget)}/day available`,
    };
  }

  _getPackingScore(trip) {
    const { packingList } = trip;
    if (!packingList || packingList.length === 0) {
      return { score: 0, label: 'Not Started', detail: 'No packing list created yet', packed: 0, total: 0 };
    }

    let total = 0, packed = 0;
    for (const cat of packingList) {
      for (const item of cat.items || []) {
        total++;
        if (item.isPacked) packed++;
      }
    }

    const pct = total > 0 ? Math.round((packed / total) * 100) : 0;
    const label = pct === 100 ? 'Fully Packed' : pct >= 70 ? 'Almost Done' : pct >= 30 ? 'In Progress' : 'Just Started';
    return { score: pct, label, packed, total, detail: `${packed}/${total} items packed (${pct}%)` };
  }

  async _getVisaRisk(trip) {
    const { destination, country } = trip;
    try {
      const prompt = `For a tourist visiting ${destination || country}, give a brief visa difficulty assessment.
      Return JSON: { "visaRequired": true/false, "difficulty": "Easy"|"Moderate"|"Complex", "score": 0-100, "notes": "1 sentence" }
      Score meaning: 100 = visa-free/simple, 50 = visa on arrival, 20 = complex visa process.`;
      
      const result = await aiService._generateJson(prompt, null, 'lightweight');
      if (result && result.score != null) {
        return {
          score: result.score,
          label: result.difficulty || 'Unknown',
          visaRequired: result.visaRequired,
          detail: result.notes || `Visa: ${result.difficulty}`,
        };
      }
    } catch (_) {}

    return { score: 70, label: 'Unknown', detail: 'Visa requirements — check your country\'s embassy', visaRequired: null };
  }

  _buildRecommendations(weather, budget, packing, visa) {
    const recs = [];
    if (weather.score < 70) recs.push(`⛈️ Pack rain gear and check storm alerts — ${weather.detail}`);
    if (budget.score < 60) recs.push(`💰 Your budget may be tight — consider increasing or cutting costs`);
    if (packing.score < 50) recs.push(`🎒 Complete your packing list — ${packing.detail}`);
    if (packing.score === 0) recs.push(`📝 Start your AI packing list for personalized recommendations`);
    if (visa.visaRequired) recs.push(`🛂 Visa required — apply well in advance to avoid delays`);
    if (recs.length === 0) recs.push('✅ Your trip looks well-prepared — have an amazing journey!');
    return recs;
  }
}

export default new TripScoreService();
