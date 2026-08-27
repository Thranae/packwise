import React, { createContext, useContext, useState, useCallback } from 'react';

const AssistantContext = createContext();

export const AI_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  LOADING: 'loading',
  ERROR: 'error'
};

export const REC_STATES = {
  LOADING: 'loading',
  LOADED: 'loaded',
  REFRESHING: 'refreshing',
  ERROR: 'error'
};

export function AssistantProvider({ children }) {
  const [aiState, setAiState] = useState(AI_STATES.IDLE);
  const [recState, setRecState] = useState(REC_STATES.LOADING);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [itinerary, setItinerary] = useState(null);

  const [userPreferences, setUserPreferences] = useState({
    budget: 'moderate',
    preferredClimates: ['warm', 'temperate'],
    interests: ['culture', 'food', 'adventure'],
    recentSearches: []
  });

  const changeAiState = useCallback((newState) => {
    setAiState(newState);
  }, []);

  const changeRecState = useCallback((newState) => {
    setRecState(newState);
  }, []);

  const updateRecommendation = useCallback((rec) => {
    setCurrentRecommendation(rec);
    setRecState(REC_STATES.LOADED);
    if (rec && rec.reasoning) {
      setAiState(AI_STATES.SPEAKING);
      setTimeout(() => setAiState(AI_STATES.IDLE), 3000);
    } else {
      setAiState(AI_STATES.IDLE);
    }
  }, []);

  const addChatMessage = useCallback((role, text) => {
    setChatMessages(prev => [...prev, { id: Date.now(), role, text, time: new Date() }]);
  }, []);

  return (
    <AssistantContext.Provider
      value={{
        aiState,
        recState,
        currentRecommendation,
        sessionHistory,
        userPreferences,
        activeFilter,
        searchQuery,
        chatMessages,
        itinerary,
        changeAiState,
        changeRecState,
        updateRecommendation,
        setSessionHistory,
        setUserPreferences,
        setActiveFilter,
        setSearchQuery,
        addChatMessage,
        setChatMessages,
        setItinerary
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}
