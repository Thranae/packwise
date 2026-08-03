import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { db } from '../db/db';

export const TripContext = createContext();

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
  
  // Global state for Trip Generation Animation
  const [isGeneratingTrip, setIsGeneratingTrip] = useState(false);
  const [generatingDestination, setGeneratingDestination] = useState('');

  const triggerTripGenerationAnimation = useCallback((destination) => {
    setIsGeneratingTrip(true);
    setGeneratingDestination(destination);
    setTimeout(() => {
      setIsGeneratingTrip(false);
      setGeneratingDestination('');
    }, 7000);
  }, []);

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
  
  // Keep currentTrip in sync with Dexie changes. 
  // Fallback to localStorage if currentTripState failed to find it initially due to async loading.
  const currentTrip = 
    trips.find(t => t._id === currentTripState?._id) || 
    trips.find(t => t._id === localStorage.getItem('packwise_current_trip_id')) || 
    trips[0];

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

  // Remove dummy notifications and only use real ones
  const savedNotifications = localStorage.getItem('packwise_notifications');
  const initialNotifications = savedNotifications ? 
    JSON.parse(savedNotifications).filter(n => n.id !== '1' && n.id !== '2' && n.id !== 'welcome-1') : 
    [];
  
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

  // Smart Contextual Notifications based on Trips
  useEffect(() => {
    if (!trips || trips.length === 0) return;
    
    setNotifications(prev => {
      let updated = [...prev];
      let changed = false;
      
      trips.forEach(trip => {
        if (!trip.startDate || !trip.destination) return;
        
        const tripStart = new Date(trip.startDate).getTime();
        const tripEnd = new Date(trip.endDate || trip.startDate).getTime();
        const now = Date.now();
        const daysUntil = (tripStart - now) / (1000 * 60 * 60 * 24);
        const daysSince = (now - tripEnd) / (1000 * 60 * 60 * 24);
        
        // Upcoming Trip Reminder (1-7 days away)
        if (daysUntil > 0 && daysUntil <= 7) {
          const notifId = `reminder-${trip._id}`;
          if (!updated.some(n => n.id === notifId)) {
            updated.unshift({
              id: notifId,
              title: 'Upcoming Trip!',
              message: `Your trip to ${trip.destination} is in ${Math.ceil(daysUntil)} days. Make sure you've packed everything!`,
              type: 'info',
              timestamp: Date.now(),
              read: false
            });
            changed = true;
          }
        }
        
        // Trip Completed Feedback
        if (daysSince > 0 && daysSince <= 3) {
          const notifId = `feedback-${trip._id}`;
          if (!updated.some(n => n.id === notifId)) {
            updated.unshift({
              id: notifId,
              title: 'Welcome Back!',
              message: `Hope you enjoyed your trip to ${trip.destination}. Time to start planning the next one!`,
              type: 'welcome',
              timestamp: Date.now(),
              read: false
            });
            changed = true;
          }
        }
      });
      
      // Keep only top 20 notifications
      if (updated.length > 20) {
        updated = updated.slice(0, 20);
        changed = true;
      }
      
      return changed ? updated : prev;
    });
  }, [trips]);

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
      
      // 1. Sync any local (offline) trips to the server before pulling
      const localTrips = await db.trips.filter(t => String(t._id).startsWith('local-')).toArray();
      for (const localTrip of localTrips) {
        try {
          // Remove local _id so backend creates a new one
          const { _id, ...tripDataToSync } = localTrip;
          const syncRes = await api.post('/trips', tripDataToSync);
          if ((syncRes.status === 200 || syncRes.status === 201) && syncRes.data.data) {
            await db.trips.delete(localTrip._id);
            await db.trips.put(syncRes.data.data);
            if (currentTripState?._id === localTrip._id) {
              setCurrentTrip(syncRes.data.data);
            }
          }
        } catch (e) {
          console.error("Failed to sync offline trip:", localTrip._id, e);
        }
      }

      // 2. Clear out mock trips that might have been populated when not logged in
      const mockTrips = await db.trips.filter(t => String(t._id).startsWith('mock-')).toArray();
      if (mockTrips.length > 0) {
        await db.trips.bulkDelete(mockTrips.map(t => t._id));
      }

      // 3. Fetch from server
      const res = await api.get('/trips');
      if (res.status === 200 && res.data) {
        await db.trips.bulkPut(res.data);
      }
    } catch (err) {
      console.warn("Could not sync trips from web backend. Working offline.", err);
    } finally {
      setLoadingTrips(false);
    }
  }, [isAuthenticated, currentTripState]);

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

  const generateTrip = async (prompt, meta = {}) => {
    setIsGenerating(true);
    
    const messages = [
      "INITIALIZING AI CORE...",
      "ANALYZING DESTINATION...",
      "DISCOVERING HIDDEN GEMS...",
      "CURATING LOCAL EXPERIENCES...",
      "OPTIMIZING TRAVEL ROUTES...",
      "CHECKING WEATHER PATTERNS...",
      "BALANCING BUDGET...",
      "FINALIZING ITINERARY..."
    ];
    let msgIndex = 0;
    setLoadingStep(messages[0]);
    
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingStep(messages[msgIndex]);
    }, 900);

    const startTime = Date.now();
    
    try {
      const res = await api.post('/ai/trip', { prompt });
      const aiData = res.data;
      
      clearInterval(msgInterval);
      setLoadingStep("Done.");
      
      // Delay before redirecting to let the user see 'Done.'
      setTimeout(async () => {
        const fallbackDest = prompt.split('.')[0]?.replace('Destination: ', '').trim() || prompt;
        
        // Use user's explicit values or fallback to AI data
        const tripStartDate = meta.startDate ? new Date(meta.startDate) : (aiData.startDate ? new Date(aiData.startDate) : new Date());
        const tripDuration = parseInt(meta.duration || aiData.duration || 7);
        const tripEndDate = new Date(tripStartDate.getTime() + tripDuration * 24 * 60 * 60 * 1000);

        const newTripData = {
          ...aiData,
          destination: aiData.destination || fallbackDest,
          country: aiData.country || "Unknown",
          startDate: tripStartDate.toISOString(),
          endDate: tripEndDate.toISOString(),
          duration: `${tripDuration} Days`,
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

        // Await Sync before removing loading state, to guarantee the trip is real for sharing
        try {
          const apiRes = await api.post('/trips', newTripData);
          if ((apiRes.status === 200 || apiRes.status === 201) && apiRes.data.data) {
            const realTrip = apiRes.data.data;
            await db.trips.delete(localId); // Remove temp
            await db.trips.put(realTrip); // Add real
            setCurrentTrip(realTrip);
          }
        } catch (e) {
          console.error("Sync failed for new trip:", e);
          // Trip remains in local DB with local ID
        }

        setIsGenerating(false);
        setLoadingStep(null);
      }, 500);
    } catch (error) {
      console.error("Failed to generate trip:", error);
      clearInterval(msgInterval);
      setIsGenerating(false);
      setLoadingStep(null);
    }
  };

  const modifyTrip = async (message) => {
    if (!currentTrip) return;
    setIsGenerating(true);
    setLoadingStep("CURATING EXPERIENCE...");
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

  const updateTripLocal = async (tripId, updates) => {
    const trip = trips.find(t => t._id === tripId);
    if (!trip) return;
    
    // Optimistic Local Update
    const updatedTrip = { ...trip, ...updates };
    await db.trips.put(updatedTrip);
    
    // If it's the current trip, update the state so UI reacts instantly
    if (currentTrip?._id === tripId) {
      setCurrentTrip(updatedTrip);
    }
    
    // Push updates to backend if online and it's not a local-only trip
    if (isAuthenticated && !String(tripId).startsWith("local-")) {
      try {
        await api.patch(`/trips/${tripId}`, updates);
      } catch (e) {
        console.error("Failed to push trip update to server:", e);
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
      isGeneratingTrip,
      generatingDestination,
      triggerTripGenerationAnimation,
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
      markNotificationsAsRead,
      updateTripLocal
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
