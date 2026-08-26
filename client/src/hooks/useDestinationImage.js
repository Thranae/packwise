import { useState, useEffect } from 'react';
import api from '../services/api';
import { getTripImage as getFallbackImage } from '../utils/imageUtils';

const imageCache = new Map();

const buildImageQuery = (destination) => {
  if (!destination) return null;
  return destination.trim();
};

export const useDestinationImage = (destination, type = null, searchQuery = null) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      const query = searchQuery || buildImageQuery(destination);

      if (!query) {
        setImage(getFallbackImage('Unknown'));
        setLoading(false);
        return;
      }

      const normalizedQuery = query.trim().toLowerCase();
      const cacheKey = searchQuery ? `${normalizedQuery}_exact` : (type ? `${normalizedQuery}_${type}` : normalizedQuery);

      if (imageCache.has(cacheKey)) {
        const cached = imageCache.get(cacheKey);
        setImage(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const tryFetch = async (attempt = 1) => {
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
            imageCache.set(cacheKey, imgUrl);
            if (isMounted) {
              setImage(imgUrl);
            }
            return true;
          }
          return false;
        } catch (err) {
          if (attempt < 2 && err?.status !== 404) {
            await new Promise(r => setTimeout(r, 1000));
            return tryFetch(attempt + 1);
          }
          return false;
        }
      };

      const success = await tryFetch();
      
      if (!success && isMounted) {
        const fallback = getFallbackImage(destination);
        setError('Failed to fetch image');
        setImage(fallback);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [destination, type, searchQuery]);

  return { image, loading, error };
};
