import axios from 'axios';

// Ensure this matches your server port
const API_BASE_URL = 'http://localhost:5000/api/ai';

const aiApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiService = {
  async generateTripPlan(destination, days) {
    const response = await aiApiClient.post('/plan', { destination, days });
    return response.data;
  },

  async generatePackingList(destination, weather) {
    const response = await aiApiClient.post('/packing', { destination, weather });
    return response.data;
  },

  async generateBudgetAdvice(destination, totalBudget, currency) {
    const response = await aiApiClient.post('/budget', { destination, totalBudget, currency });
    return response.data;
  },

  async generateItinerary(destination, days) {
    const response = await aiApiClient.post('/itinerary', { destination, days });
    return response.data;
  },

  async recommendPlaces(destination, category, refresh = false) {
    const response = await aiApiClient.post('/recommendations', { destination, category, refresh });
    return response.data;
  },

  async chatAssistant(message, context) {
    const response = await aiApiClient.post('/chat', { message, context });
    return response.data.reply;
  }
};
