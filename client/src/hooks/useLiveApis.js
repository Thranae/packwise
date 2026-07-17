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
        // Fetch weather from our dedicated backend service
        const res = await axios.get(`/api/weather/${encodeURIComponent(destination)}`);
        
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
    if (!targetCurrency) {
      setLoading(false);
      return;
    }

    const fetchCurrency = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/currency/trend/${targetCurrency}?baseCurrency=${baseCurrency}&days=14`);
        
        setExchangeRate(res.data.rate.toFixed(2));
        setTrend(res.data.trend);
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("Live Currency Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrency();
  }, [targetCurrency, baseCurrency]);

  return { exchangeRate, trend, history, loading };
};
