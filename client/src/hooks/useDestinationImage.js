import { useState, useEffect } from 'react';
import api from '../services/api';
import { getTripImage as getFallbackImage } from '../utils/imageUtils';

// In-memory cache: only store SUCCESSFUL image fetches, never cache fallbacks
const imageCache = new Map();

/**
 * Build the most accurate image search query for a destination.
 * Critically: does NOT append generic "travel landmark" keywords that cause
 * stock photo APIs to return popular country images (e.g., Taj Mahal for "India").
 * Just uses the raw destination name for maximum specificity.
 */
const buildImageQuery = (destination) => {
  if (!destination) return null;
  // If the destination already has a comma (city, country), return it as-is
  // The backend will extract just the city name for a precise search
  return destination.trim() + ' scenic landscape';
};

export const useDestinationImage = (destination, type = null, searchQuery = null) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      // If we have an AI-generated specific search query, use it!
      const query = searchQuery || buildImageQuery(destination);

      if (!query) {
        setImage(getFallbackImage('Unknown'));
        setLoading(false);
        return;
      }

      const normalizedQuery = query.trim().toLowerCase();
      // Add exact flag to cache key if we are using an exact AI query
      const cacheKey = searchQuery ? `${normalizedQuery}_exact` : (type ? `${normalizedQuery}_${type}` : normalizedQuery);

      // Only serve from cache if it's a real URL (not a fallback)
      if (imageCache.has(cacheKey)) {
        const cached = imageCache.get(cacheKey);
        setImage(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let url = `/images/search?query=${encodeURIComponent(query)}`;
        if (searchQuery) {
          url += `&exact=true`;
        } else if (type) {
          url += `&type=${encodeURIComponent(type)}`;
        }
        
        const { data } = await api.get(url);

        if (data.success && data.data && data.data.imageUrl) {
          const imgUrl = data.data.imageUrl;
          // Only cache real successfully-fetched images
          imageCache.set(cacheKey, imgUrl);
          if (isMounted) {
            setImage(imgUrl);
          }
        } else {
          throw new Error('Image not found');
        }
      } catch (err) {
        console.warn(`[Image] Failed to fetch for "${query}", using static fallback.`, err.message);
        // Do NOT cache fallbacks — allow retry on next mount
        if (isMounted) {
          setError(err.message || 'Failed to fetch image');
          setImage(getFallbackImage(destination));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [destination, type, searchQuery]); // Also re-run if type or searchQuery changes

  return { image, loading, error };
};
