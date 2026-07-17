import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const TripContext = createContext();



const MOCK_TRIPS = [
  {
    _id: "mock-1",
    destination: 'Tokyo & Kyoto Explorer',
    country: 'Japan',
    startDate: '2026-10-12T00:00:00Z',
    endDate: '2026-10-26T00:00:00Z',
    duration: '14 Days',
    budget: 4500,
    currency: 'JPY',
    timezone: 'Asia/Tokyo',
    travelers: 2,
    status: 'upcoming',
  },
  {
    _id: "mock-2",
    destination: 'Swiss Alps Retreat',
    country: 'Switzerland',
    startDate: '2026-12-05T00:00:00Z',
    endDate: '2026-12-15T00:00:00Z',
    duration: '10 Days',
    budget: 3200,
    currency: 'CHF',
    timezone: 'Europe/Zurich',
    travelers: 4,
    status: 'planning',
  },
  {
    _id: "mock-3",
    destination: 'Amalfi Coast Roadtrip',
    country: 'Italy',
    startDate: '2027-05-10T00:00:00Z',
    endDate: '2027-05-24T00:00:00Z',
    duration: '14 Days',
    budget: 5100,
    currency: 'EUR',
    timezone: 'Europe/Rome',
    travelers: 2,
    status: 'draft',
  },
  {
    _id: "mock-4",
    destination: 'Paris Getaway',
    country: 'France',
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-06-10T00:00:00Z',
    duration: '9 Days',
    budget: 4200,
    currency: 'EUR',
    timezone: 'Europe/Paris',
    travelers: 2,
    status: 'ongoing',
  },
  {
    _id: "mock-5",
    destination: 'New York City Lights',
    country: 'USA',
    startDate: '2023-12-15T00:00:00Z',
    endDate: '2023-12-22T00:00:00Z',
    duration: '7 Days',
    budget: 2800,
    currency: 'USD',
    timezone: 'America/New_York',
    travelers: 1,
    status: 'completed',
  },
  {
    _id: "mock-6",
    destination: 'Bali Surf Retreat',
    country: 'Indonesia',
    startDate: '2026-08-05T00:00:00Z',
    endDate: '2026-08-25T00:00:00Z',
    duration: '20 Days',
    budget: 1500,
    currency: 'IDR',
    timezone: 'Asia/Makassar',
    travelers: 3,
    status: 'planning',
  },
  {
    _id: "mock-7",
    destination: 'Rio Carnival',
    country: 'Brazil',
    startDate: '2022-02-25T00:00:00Z',
    endDate: '2022-03-05T00:00:00Z',
    duration: '8 Days',
    budget: 3500,
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    travelers: 4,
    status: 'archived',
  },
  {
    _id: "mock-8",
    destination: 'Dubai Luxury Escape',
    country: 'UAE',
    startDate: '2027-01-15T00:00:00Z',
    endDate: '2027-01-22T00:00:00Z',
    duration: '7 Days',
    budget: 8000,
    currency: 'AED',
    timezone: 'Asia/Dubai',
    travelers: 2,
    status: 'upcoming',
  },
  {
    _id: "mock-9",
    destination: 'London Highlights',
    country: 'UK',
    startDate: '2026-09-10T00:00:00Z',
    endDate: '2026-09-15T00:00:00Z',
    duration: '5 Days',
    budget: 2500,
    currency: 'GBP',
    timezone: 'Europe/London',
    travelers: 1,
    status: 'planning',
  },
  {
    _id: "mock-10",
    destination: 'Sydney Opera & Coast',
    country: 'Australia',
    startDate: '2025-11-20T00:00:00Z',
    endDate: '2025-12-05T00:00:00Z',
    duration: '15 Days',
    budget: 6000,
    currency: 'AUD',
    timezone: 'Australia/Sydney',
    travelers: 3,
    status: 'ongoing',
  }
];

export const TripProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const savedTrips = localStorage.getItem('packwise_trips');
  const initialTrips = savedTrips ? JSON.parse(savedTrips) : MOCK_TRIPS;
  const [trips, setTrips] = useState(initialTrips);
  
  const savedCurrentTripId = localStorage.getItem('packwise_current_trip_id');
  const initialCurrentTrip = savedCurrentTripId 
    ? initialTrips.find(t => t._id === savedCurrentTripId) || initialTrips[0] 
    : initialTrips[0];
    
  const [currentTrip, setCurrentTripState] = useState(initialCurrentTrip);
  
  const setCurrentTrip = useCallback((trip) => {
    setCurrentTripState(trip);
    if (trip && trip._id) {
      localStorage.setItem('packwise_current_trip_id', trip._id);
    } else {
      localStorage.removeItem('packwise_current_trip_id');
    }
  }, []);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [loadingStep, setLoadingStep] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualTheme, setManualTheme] = useState(null);

  // Fetch trips from backend to sync with the web
  const fetchTrips = useCallback(async () => {
    try {
      setLoadingTrips(true);
      const res = await fetch('http://localhost:5000/api/trips', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // If web sync returns real trips, use them! Otherwise fallback to mock data
        if (data && data.length > 0) {
          setTrips(data);
          setCurrentTrip(data[0]);
        } else {
          // If backend is empty, fallback to our saved local trips or mock trips
          setTrips(initialTrips);
        }
      } else {
        throw new Error("Web sync failed");
      }
    } catch (err) {
      console.warn("Could not sync trips from web backend. Falling back to local data.", err);
      setTrips(initialTrips);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  // Sync on mount
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Persist trips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('packwise_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    const themeToUse = manualTheme || (currentTrip && currentTrip.theme);
    if (themeToUse) {
      document.documentElement.style.setProperty('--trip-primary', themeToUse.primary);
      document.documentElement.style.setProperty('--trip-secondary', themeToUse.secondary);
    } else {
      document.documentElement.style.removeProperty('--trip-primary');
      document.documentElement.style.removeProperty('--trip-secondary');
    }
  }, [currentTrip, manualTheme]);

  const selectTrip = (tripId) => {
    const trip = trips.find(t => t._id === tripId);
    if (trip) {
      setCurrentTrip(trip);
      setManualTheme(null);
    }
  };

  const generateTrip = async (prompt) => {
    setIsGenerating(true);
    setLoadingStep("Analyzing destination...");
    
    try {
      setTimeout(() => setLoadingStep("Finding attractions..."), 1500);
      setTimeout(() => setLoadingStep("Creating itinerary..."), 3000);
      
      const res = await fetch('http://localhost:5000/api/ai/trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const aiData = await res.json();
      
      setLoadingStep("Done.");
      setTimeout(() => {
        // Extract just the location from the prompt if aiData fails to provide it
        // The prompt format is "Destination: City, Country. Duration: ..."
        const fallbackDest = prompt.split('.')[0]?.replace('Destination: ', '').trim() || prompt;

        const newTrip = {
          _id: "trip-" + Date.now(),
          destination: aiData.destination || fallbackDest,
          country: aiData.country || "Unknown",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + parseInt(aiData.duration || 7) * 24 * 60 * 60 * 1000).toISOString(),
          duration: aiData.duration || "7 Days",
          budget: aiData.budget || 3000,
          currency: aiData.currency || "USD",
          timezone: aiData.timezone || "UTC",
          travelers: 2,
          status: "planning"
        };
        
        setTrips(prev => [newTrip, ...prev]);
        setCurrentTrip(newTrip);
        setManualTheme(null);
        setIsGenerating(false);
        setLoadingStep(null);
      }, 500);
    } catch (error) {
      console.error("Failed to generate trip:", error);
      setIsGenerating(false);
      setLoadingStep(null);
    }
  };

  const modifyTrip = async (message) => {
    console.log("Mock modifyTrip with message:", message);
  };

  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(t => t._id !== tripId));
    if (currentTrip?._id === tripId) setCurrentTrip(null);
  };

  const duplicateTrip = (tripId) => {
    const tripToDuplicate = trips.find(t => t._id === tripId);
    if (tripToDuplicate) {
      const newTrip = { ...tripToDuplicate, _id: "trip-" + Date.now(), destination: `${tripToDuplicate.destination} (Copy)` };
      setTrips(prev => [newTrip, ...prev]);
    }
  };

  const toggleFavoriteTrip = (tripId) => {
    setTrips(prev => prev.map(t => t._id === tripId ? { ...t, isFavorite: !t.isFavorite } : t));
    if (currentTrip?._id === tripId) {
      setCurrentTrip(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  return (
    <TripContext.Provider value={{
      trips,
      loadingTrips,
      currentTrip,
      setCurrentTrip,
      selectTrip,
      isGenerating,
      loadingStep,
      generateTrip,
      modifyTrip,
      deleteTrip,
      duplicateTrip,
      toggleFavoriteTrip,
      manualTheme,
      setManualTheme
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTripContext must be used within a TripProvider");
  return context;
};
