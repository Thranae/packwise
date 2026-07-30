import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { db } from '../db/db';

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
  }
];

export const TripProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Local-First data fetching via Dexie
  const dexieTrips = useLiveQuery(() => db.trips.toArray());
  const trips = dexieTrips || []; // fallback to empty array while loading
  
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [loadingStep, setLoadingStep] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualTheme, setManualTheme] = useState(null);

  // Initialize DB with mocks if completely empty and not loading
  useEffect(() => {
    if (dexieTrips !== undefined && dexieTrips.length === 0 && !isAuthenticated) {
      db.trips.bulkPut(MOCK_TRIPS);
    }
  }, [dexieTrips, isAuthenticated]);

  const savedCurrentTripId = localStorage.getItem('packwise_current_trip_id');
  const initialCurrentTrip = savedCurrentTripId 
    ? trips.find(t => t._id === savedCurrentTripId) || trips[0] 
    : trips[0];
    
  const [currentTripState, setCurrentTripState] = useState(initialCurrentTrip);
  
  // Keep currentTrip in sync with Dexie changes
  const currentTrip = trips.find(t => t._id === currentTripState?._id) || currentTripState || trips[0];

  const setCurrentTrip = useCallback((trip) => {
    setCurrentTripState(trip);
    if (trip && trip._id) {
      localStorage.setItem('packwise_current_trip_id', trip._id);
    } else {
      localStorage.removeItem('packwise_current_trip_id');
    }
  }, []);

  const savedPackedItems = localStorage.getItem('packwise_packed_items');
  const initialPackedItems = savedPackedItems ? new Set(JSON.parse(savedPackedItems)) : new Set();
  const [packedItems, setPackedItems] = useState(initialPackedItems);

  useEffect(() => {
    localStorage.setItem('packwise_packed_items', JSON.stringify(Array.from(packedItems)));
  }, [packedItems]);

  const savedNotifications = localStorage.getItem('packwise_notifications');
  const defaultNotifications = [
    { id: 'welcome-1', title: 'Welcome to Voyage Genie', message: 'Start planning your next trip with the power of AI.', type: 'welcome', timestamp: Date.now() - 7200000, read: false }
  ];
  const initialNotifications = savedNotifications ? JSON.parse(savedNotifications) : defaultNotifications;
  
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    localStorage.setItem('packwise_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((title, message, type = 'info') => {
    const newNotif = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const togglePackedItem = useCallback((itemId) => {
    setPackedItems(prev => {
      const newSet = new Set(prev);
      const isPacked = !newSet.has(itemId);
      if (isPacked) newSet.add(itemId);
      else newSet.delete(itemId);
      return newSet;
    });
  }, []);

  // Fetch trips from backend to sync with local DB
  const fetchTrips = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingTrips(true);
      const res = await api.get('/trips');
      if (res.status === 200 && res.data) {
        // Sync API data down to local Dexie
        await db.trips.bulkPut(res.data);
      }
    } catch (err) {
      console.warn("Could not sync trips from web backend. Working offline.", err);
    } finally {
      setLoadingTrips(false);
    }
  }, [isAuthenticated]);

  // Sync on mount
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Theme Sync
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
      setTimeout(async () => {
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
        
        // Optimistic Local Write
        const localId = "local-" + Date.now();
        newTripData._id = localId;
        await db.trips.put(newTripData);
        setCurrentTrip(newTripData);
        
        setManualTheme(null);
        setIsGenerating(false);
        setLoadingStep(null);

        // Background Sync
        api.post('/trips', newTripData).then(async (apiRes) => {
          if (apiRes.status === 200 && apiRes.data.data) {
            const realTrip = apiRes.data.data;
            await db.trips.delete(localId); // Remove temp
            await db.trips.put(realTrip); // Add real
            setCurrentTrip(realTrip);
          }
        }).catch(e => {
          console.error("Background sync failed for new trip:", e);
          // Trip remains in local DB with local ID
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
        await db.trips.put(data.data);
        setCurrentTrip(data.data);
      }
    } catch (error) {
      console.error("Network error modifying trip:", error);
    } finally {
      setIsGenerating(false);
      setLoadingStep(null);
    }
  };

  const deleteTrip = async (tripId) => {
    // Optimistic Local Delete (Instant UX)
    await db.trips.delete(tripId);
    if (currentTrip?._id === tripId) setCurrentTrip(null);

    // Background Sync
    if (!String(tripId).startsWith("local-")) {
      try {
        await api.delete(`/trips/${tripId}`);
      } catch (error) {
        console.error("Background sync failed for deleting trip:", error);
      }
    }
  };

  const duplicateTrip = async (tripId) => {
    setIsGenerating(true);
    setLoadingStep("Duplicating trip...");
    
    // Premium fake delay for animation
    await new Promise(r => setTimeout(r, 800));
    
    try {
      const res = await api.post(`/trips/${tripId}/duplicate`);
      const data = res.data;
      if (data.data) {
        await db.trips.put(data.data);
      }
    } catch (error) {
      console.error("Failed to duplicate trip:", error);
    } finally {
      setIsGenerating(false);
      setLoadingStep(null);
    }
  };

  const toggleFavoriteTrip = async (tripId) => {
    const trip = trips.find(t => t._id === tripId);
    if (!trip) return;
    
    // Optimistic Local Update
    const updatedTrip = { ...trip, isFavorite: !trip.isFavorite };
    await db.trips.put(updatedTrip);
    
    // Background Sync
    if (!String(tripId).startsWith("local-")) {
      try {
        const res = await api.patch(`/trips/${tripId}/favorite`);
        if (res.data?.data) {
           await db.trips.put(res.data.data); // Resync actual server state just in case
        }
      } catch (error) {
        console.error("Failed to toggle favorite on server:", error);
        // Revert local on failure
        await db.trips.put(trip);
      }
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
      togglePackedItem,
      fetchTrips,
      notifications,
      addNotification,
      markNotificationsAsRead
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
