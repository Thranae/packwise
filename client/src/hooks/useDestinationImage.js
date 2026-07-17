import { useState, useEffect } from 'react';
import api from '../services/api';
import { getTripImage as getFallbackImage } from '../utils/imageUtils';

// Simple in-memory cache to prevent duplicate requests during the same session
const imageCache = new Map();

export const useDestinationImage = (destination, type = null) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      if (!destination) {
        setImage(getFallbackImage('Unknown'));
        setLoading(false);
        return;
      }

      const query = destination.trim().toLowerCase();
      // Cache key needs to include type if it exists to avoid cache collisions
      const cacheKey = type ? `${query}_${type}` : query;
      
      if (imageCache.has(cacheKey)) {
        setImage(imageCache.get(cacheKey));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let url = `/images/search?query=${encodeURIComponent(query)}`;
        if (type) {
          url += `&type=${encodeURIComponent(type)}`;
        }
        const { data } = await api.get(url);
        
        if (data.success && data.data && data.data.imageUrl) {
          const imgUrl = data.data.imageUrl;
          imageCache.set(cacheKey, imgUrl);
          if (isMounted) {
            setImage(imgUrl);
          }
        } else {
          throw new Error('Image not found');
        }
      } catch (err) {
        console.warn(`Failed to fetch image for ${destination}, falling back to static generator.`, err);
        const fallbackImg = getFallbackImage(destination);
        imageCache.set(cacheKey, fallbackImg); // Cache fallback to prevent repeated failing requests
        if (isMounted) {
          setError(err.message || 'Failed to fetch image');
          setImage(fallbackImg);
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
  }, [destination]);

  return { image, loading, error };
};
