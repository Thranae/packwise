import currencyService from '../services/currency.service.js';

const cache = new Map();
const CACHE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

export const getCurrencyTrend = async (req, res) => {
  try {
    const { targetCurrency } = req.params;
    const { baseCurrency = 'USD', days = 14 } = req.query;

    if (!targetCurrency) {
      return res.status(400).json({ message: 'Target currency is required' });
    }

    const cacheKey = `${baseCurrency}_${targetCurrency}_${days}`.toUpperCase();

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION_MS) {
        return res.json(cached.data);
      }
    }

    const data = await currencyService.getTrend(baseCurrency.toUpperCase(), targetCurrency.toUpperCase(), parseInt(days));

    cache.set(cacheKey, { data, timestamp: Date.now() });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch currency trend' });
  }
};
