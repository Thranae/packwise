import api from './api';

export const tripService = {
  /**
   * Fetches all trips for the authenticated user.
   */
  getTrips: async () => {
    try {
      const response = await api.get('/trips');
      return response.data;
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  },

  /**
   * Fetches a specific public trip by ID.
   */
  getPublicTrip: async (id) => {
    try {
      const response = await api.get(`/trips/public/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching public trip ${id}:`, error);
      throw error;
    }
  }
};
