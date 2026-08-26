import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TripContext = createContext();

export const useTrips = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [currentTripState, setCurrentTripState] = useState(null);

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
        setTrips(response.data.data);
        
        // Restore last selected trip from AsyncStorage
        const savedId = await AsyncStorage.getItem('packwise_current_trip_id');
        const found = response.data.data.find(t => t._id === savedId);
        if (found) {
          setCurrentTripState(found);
        } else if (response.data.data.length > 0) {
          setCurrentTripState(response.data.data[0]);
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
    if (trip && trip._id) {
      await AsyncStorage.setItem('packwise_current_trip_id', trip._id);
    } else {
      await AsyncStorage.removeItem('packwise_current_trip_id');
    }
  }, []);

  return (
    <TripContext.Provider
      value={{
        trips,
        loadingTrips,
        currentTrip: currentTripState,
        setCurrentTrip,
        fetchTrips
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
