import axios from 'axios';

class CurrencyService {
  constructor() {
    this.frankfurterUrl = 'https://api.frankfurter.app';
    this.fallbackUrl = 'https://open.er-api.com/v6/latest';
  }

  async getTrend(baseCurrency, targetCurrency, days = 14) {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days);

      const endDateStr = end.toISOString().split('T')[0];
      const startDateStr = start.toISOString().split('T')[0];

      if (baseCurrency === targetCurrency) {
        return {
          rate: 1,
          trend: 'flat',
          history: Array(days).fill(1)
        };
      }

      // Try Frankfurter for timeseries
      try {
        const response = await axios.get(
          `${this.frankfurterUrl}/${startDateStr}..${endDateStr}?from=${baseCurrency}&to=${targetCurrency}`
        );
        
        const ratesObj = response.data.rates;
        const dates = Object.keys(ratesObj).sort();
        
        if (dates.length === 0) throw new Error('No historical data');

        const history = dates.map(date => ratesObj[date][targetCurrency]);
        const currentRate = history[history.length - 1];
        const oldRate = history[0];
        const trend = currentRate >= oldRate ? 'up' : 'down';

        return {
          rate: currentRate,
          trend,
          history,
          dates
        };
      } catch (err) {
        // Fallback to open.er-api if Frankfurter fails (e.g. unsupported currency)
        console.warn(`Frankfurter failed for ${targetCurrency}, falling back to open.er-api`);
        const fallbackRes = await axios.get(`${this.fallbackUrl}/${baseCurrency}`);
        const rate = fallbackRes.data.rates[targetCurrency] || 1;
        
        return {
          rate,
          trend: 'up',
          history: Array(days).fill(rate),
          dates: []
        };
      }
    } catch (error) {
      console.error('CurrencyService Error:', error.message);
      throw error;
    }
  }
}

export default new CurrencyService();
