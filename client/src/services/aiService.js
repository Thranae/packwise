import api from './api';

export const aiService = {
  async generateTripPlan(destination, days) {
    const response = await api.post('/ai/plan', { destination, days });
    return response.data;
  },

  async generatePackingList(destination, weather) {
    const response = await api.post('/ai/packing', { destination, weather });
    return response.data;
  },

  async generateBudgetAdvice(destination, totalBudget, currency) {
    const response = await api.post('/ai/budget', { destination, totalBudget, currency });
    return response.data;
  },

  async generateItinerary(destination, days) {
    const response = await api.post('/ai/itinerary', { destination, days });
    return response.data;
  },

  async recommendPlaces(destination, category, refresh = false) {
    const response = await api.post('/ai/recommendations', { destination, category, refresh });
    return response.data;
  },

  async chatAssistant(message, context) {
    const response = await api.post('/ai/chat', { message, context });
    return response.data.reply;
  }
};
