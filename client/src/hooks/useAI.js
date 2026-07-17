import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAction = useCallback(async (actionFn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await actionFn(...args);
      return result;
    } catch (err) {
      console.error('AI Error:', err);
      setError(err.message || 'An error occurred while generating AI content.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getTripPlan: (...args) => executeAction(aiService.generateTripPlan, ...args),
    getPackingList: (...args) => executeAction(aiService.generatePackingList, ...args),
    getBudgetAdvice: (...args) => executeAction(aiService.generateBudgetAdvice, ...args),
    getItinerary: (...args) => executeAction(aiService.generateItinerary, ...args),
    getRecommendations: (...args) => executeAction(aiService.recommendPlaces, ...args),
    chatAssistant: (...args) => executeAction(aiService.chatAssistant, ...args)
  };
};
