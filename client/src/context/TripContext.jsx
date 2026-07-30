import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

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
  let parsedTrips = savedTrips ? JSON.parse(savedTrips) : MOCK_TRIPS;
  // Guard: filter out any null/undefined entries from corrupted localStorage
  if (!Array.isArray(parsedTrips) || parsedTrips.some(t => !t || !t._id)) {
    parsedTrips = MOCK_TRIPS;
    localStorage.removeItem('packwise_trips');
  }
  const initialTrips = parsedTrips;
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

  const savedPackedItems = localStorage.getItem('packwise_packed_items');
  const initialPackedItems = savedPackedItems ? new Set(JSON.parse(savedPackedItems)) : new Set();
  const [packedItems, setPackedItems] = useState(initialPackedItems);

  useEffect(() => {
    localStorage.setItem('packwise_packed_items', JSON.stringify(Array.from(packedItems)));
  }, [packedItems]);

  const togglePackedItem = useCallback((itemId) => {
    setPackedItems(prev => {
      const newSet = new Set(prev);
      const isPacked = !newSet.has(itemId);
      if (isPacked) newSet.add(itemId);
      else newSet.delete(itemId);
      return newSet;
    });
  }, []);

  // Fetch trips from backend to sync with the web
  const fetchTrips = useCallback(async () => {
    try {
      setLoadingTrips(true);
      const res = await api.get('/trips');
      if (res.status === 200) {
        const data = res.data;
        if (data && data.length > 0) {
          setTrips(data);
          setCurrentTrip(data[0]);
        } else if (isAuthenticated) {
          // If authenticated and no trips, show true empty state
          setTrips([]);
          setCurrentTrip(null);
        } else {
          // If NOT authenticated (guest), fallback to our saved local trips or mock trips
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

  // Sync offline trips when user logs in
  useEffect(() => {
    const syncOfflineTrips = async () => {
      if (!isAuthenticated) return;
      
      const localTrips = trips.filter(t => String(t._id).startsWith('local-'));
      if (localTrips.length === 0) return;
      
      let updatedTrips = [...trips];
      let didSync = false;
      
      for (const trip of localTrips) {
        try {
          const tripToUpload = { ...trip };
          delete tripToUpload._id; // Let backend generate real ID
          
          const res = await api.post('/trips', tripToUpload);
          const data = res.data;
          if (res.status === 200 && data.data) {
            // Replace the local trip with the synced cloud trip
            updatedTrips = updatedTrips.map(t => t._id === trip._id ? data.data : t);
            didSync = true;
          }
        } catch (err) {
          console.error("Failed to sync local trip", err);
        }
      }
      
      if (didSync) {
        setTrips(updatedTrips);
        // Update currentTrip if it was synced
        if (currentTrip && String(currentTrip._id).startsWith('local-')) {
          const syncedCurrent = updatedTrips.find(t => t.destination === currentTrip.destination && t.startDate === currentTrip.startDate);
          if (syncedCurrent) setCurrentTrip(syncedCurrent);
        }
      }
    };
    
    syncOfflineTrips();
  }, [isAuthenticated]);

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
      
      const res = await api.post('/ai/trip', { prompt });
      
      const aiData = res.data;
      
      setLoadingStep("Done.");
      setTimeout(() => {
        // Extract just the location from the prompt if aiData fails to provide it
        // The prompt format is "Destination: City, Country. Duration: ..."
        const fallbackDest = prompt.split('.')[0]?.replace('Destination: ', '').trim() || prompt;

        const newTripData = {
          ...aiData,
          destination: aiData.destination || fallbackDest,
          country: aiData.country || "Unknown",
          startDate: aiData.startDate ? new Date(aiData.startDate).toISOString() : new Date().toISOString(),
          endDate: new Date((aiData.startDate ? new Date(aiData.startDate).getTime() : Date.now()) + parseInt(aiData.duration || 7) * 24 * 60 * 60 * 1000).toISOString(),
          duration: aiData.duration || "7 Days",
          budget: aiData.budget || 3000,
          currency: aiData.currency || "USD",
          timezone: aiData.timezone || "UTC",
          gender: aiData.gender || "Not specified",
          travelers: aiData.travelers || 1,
          status: "planning"
        };
        
        // Save to DB
        api.post('/trips', newTripData).then(async res => {
          const data = res.data;
          if (res.status === 200 && data.data) {
            const newTrip = data.data;
            setTrips(prev => [newTrip, ...prev]);
            setCurrentTrip(newTrip);
          } else {
            console.error("Failed to save trip to DB:", data);
            // If API fails (e.g. 401 Unauthorized), save it locally so the app still works
            newTripData._id = "local-" + Date.now();
            setTrips(prev => [newTripData, ...prev]);
            setCurrentTrip(newTripData);
          }
          setManualTheme(null);
          setIsGenerating(false);
          setLoadingStep(null);
        }).catch(err => {
          console.error("Network error saving trip to DB:", err);
          newTripData._id = "local-" + Date.now();
          setTrips(prev => [newTripData, ...prev]);
          setCurrentTrip(newTripData);
          setManualTheme(null);
          setIsGenerating(false);
          setLoadingStep(null);
        });
        
      }, 500);
    } catch (error) {
      console.error("Failed to generate trip:", error);
      setIsGenerating(false);
      setLoadingStep(null);
    }
  };

  const modifyTrip = async (message) => {
    if (!currentTrip) return;
    setIsGenerating(true);
    setLoadingStep("Modifying trip...");
    try {
      const res = await api.post('/trips/chat', { currentTrip, message });
      const data = res.data;
      if (res.status === 200 && data.data) {
        setTrips(prev => prev.map(t => t._id === data.data._id ? data.data : t));
        setCurrentTrip(data.data);
      } else {
        console.error("Failed to modify trip:", data);
      }
    } catch (error) {
      console.error("Network error modifying trip:", error);
    } finally {
      setIsGenerating(false);
      setLoadingStep(null);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(prev => prev.filter(t => t._id !== tripId));
      if (currentTrip?._id === tripId) setCurrentTrip(null);
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  const duplicateTrip = async (tripId) => {
    try {
      const res = await api.post(`/trips/${tripId}/duplicate`);
      const data = res.data;
      if (data.data) {
        setTrips(prev => [data.data, ...prev]);
      }
    } catch (error) {
      console.error("Failed to duplicate trip:", error);
    }
  };

  const toggleFavoriteTrip = async (tripId) => {
    try {
      const res = await api.patch(`/trips/${tripId}/favorite`);
      const data = res.data;
      if (data.data) {
        setTrips(prev => prev.map(t => t._id === tripId ? data.data : t));
        if (currentTrip?._id === tripId) {
          setCurrentTrip(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
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
      setManualTheme,
      packedItems,
      togglePackedItem
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
