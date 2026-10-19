import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TripContext = createContext();

export const useTrips = () => useContext(TripContext);
export const useTripContext = useTrips;

export const TripProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [currentTripState, setCurrentTripState] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(null);

  // Initialize trips when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    } else {
      setTrips([]);
      setCurrentTripState(null);
      setLoadingTrips(false);
    }
  }, [isAuthenticated]);

  const fetchTrips = useCallback(async () => {
    try {
      setLoadingTrips(true);
      const response = await api.get('/trips');
      if (response.data?.success) {
        const list = response.data.data || [];
        setTrips(list);
        
        // Restore last selected trip from AsyncStorage
        const savedId = await AsyncStorage.getItem('packwise_current_trip_id');
        const found = list.find(t => (t._id || t.id) === savedId);
        if (found) {
          setCurrentTripState(found);
        } else if (list.length > 0) {
          setCurrentTripState(list[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  const setCurrentTrip = useCallback(async (trip) => {
    setCurrentTripState(trip);
    if (trip && (trip._id || trip.id)) {
      await AsyncStorage.setItem('packwise_current_trip_id', trip._id || trip.id);
    } else {
      await AsyncStorage.removeItem('packwise_current_trip_id');
    }
  }, []);

  const generateTrip = useCallback(async (promptText, meta = {}) => {
    try {
      setIsGenerating(true);
      setLoadingStep('Crafting destination blueprint...');

      const response = await api.post('/trips/generate', { prompt: promptText, ...meta });
      const newTrip = response.data?.data || response.data;

      if (newTrip) {
        setTrips(prev => [newTrip, ...prev]);
        setCurrentTrip(newTrip);
      }
      return newTrip;
    } catch (error) {
      console.error('Failed to generate trip via AI:', error);
      throw error;
    } finally {
      setIsGenerating(false);
      setLoadingStep(null);
    }
  }, [setCurrentTrip]);

  const deleteTrip = useCallback(async (tripId) => {
    try {
      setTrips(prev => prev.filter(t => (t._id || t.id) !== tripId));
      if (currentTripState && (currentTripState._id === tripId || currentTripState.id === tripId)) {
        setCurrentTripState(null);
      }
      await api.delete(`/trips/${tripId}`);
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  }, [currentTripState]);

  return (
    <TripContext.Provider
      value={{
        trips,
        loadingTrips,
        currentTrip: currentTripState,
        setCurrentTrip,
        fetchTrips,
        isGenerating,
        loadingStep,
        generateTrip,
        deleteTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

