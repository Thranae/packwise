import { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Live Weather API (OpenWeatherMap via Backend)
export const useLiveWeather = (destination) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destination) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        // Fetch weather from our dedicated backend service
        const res = await axios.get(`${API_URL}/weather/${encodeURIComponent(destination)}`);
        
        setWeather(res.data);
        setError(null);
      } catch (err) {
        console.error("Live Weather Error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  return { weather, loading, error };
};

// 2. Live Exchange Rate API (via Backend / Frankfurter)
export const useLiveCurrency = (targetCurrency, baseCurrency = 'USD') => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [trend, setTrend] = useState('up');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetCurrency || targetCurrency === baseCurrency) {
      if (targetCurrency === baseCurrency) {
        setExchangeRate(1);
        setHistory(Array(14).fill(1));
      }
      setLoading(false);
      return;
    }

    const fetchCurrency = async () => {
      setLoading(true);
      try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Fetch 14-day history from open-source Frankfurter API
        const res = await axios.get(`https://api.frankfurter.app/${startDate}..${endDate}?from=${baseCurrency}&to=${targetCurrency}`);
        
        const ratesObj = res.data.rates;
        const historyValues = Object.values(ratesObj).map(rate => rate[targetCurrency]);
        
        if (historyValues.length > 0) {
          const latestRate = historyValues[historyValues.length - 1];
          const previousRate = historyValues.length > 1 ? historyValues[historyValues.length - 2] : latestRate;
          
          setExchangeRate(latestRate);
          setTrend(latestRate >= previousRate ? 'up' : 'down');
          setHistory(historyValues);
        }
      } catch (err) {
        console.error("Live Currency Error (Frankfurter):", err);
        // Fallback to mock data if API fails
        setExchangeRate(0.012);
        setHistory([0.011, 0.0115, 0.012, 0.0118, 0.012]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrency();
  }, [targetCurrency, baseCurrency]);

  return { exchangeRate, trend, history, loading };
};
