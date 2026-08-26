import axios from 'axios';
import { catchAsync } from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Extract the most specific city/place term from a query.
 * e.g., "Dharamshala, India travel landmark scenic" → "Dharamshala"
 * e.g., "Shibuya Crossing Tokyo Japan" → "Shibuya Crossing Tokyo Japan" (kept as-is, already specific)
 */
const extractPrimaryTerm = (query) => {
  // If it contains a comma, the part before the comma is the most specific term (city name)
  const commaParts = query.split(',');
  if (commaParts.length > 1) {
    return commaParts[0].trim();
  }
  // Otherwise, remove generic travel keywords to keep query focused
  return query
    .replace(/\b(travel landmark scenic|travel landmark|landmark scenic|travel|tourism|vacation|tour|photo|background|wallpaper|trip)\b/gi, '')
    .trim();
};

/**
 * Fetch image from Pexels - most reliable provider
 */
const fetchFromPexels = async (keys, query, idx = 0) => {
  if (!keys.length) return null;
  const key = keys[Math.floor(Math.random() * keys.length)];
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: { query, orientation: 'landscape', per_page: Math.max(10, idx + 1), size: 'large' },
      headers: { Authorization: key },
      timeout: 8000
    });
    trackRateLimit('Pexels', response);
    if (response.data.photos && response.data.photos.length > 0) {
      const i = idx < response.data.photos.length ? idx : 0;
      const photo = response.data.photos[i];
      return photo.src.large2x || photo.src.large;
    }
  } catch (err) {
    if (err.response) trackRateLimit('Pexels', err.response);
    console.error(`[Pexels] Error for "${query}":`, err.message);
  }
  return null;
};

/**
 * Fetch image from Unsplash
 */
const fetchFromUnsplash = async (keys, query, idx = 0) => {
  if (!keys.length) return null;
  const key = keys[Math.floor(Math.random() * keys.length)];
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, orientation: 'landscape', per_page: Math.max(10, idx + 1), order_by: 'relevant' },
      headers: { Authorization: `Client-ID ${key}` },
      timeout: 8000
    });
    trackRateLimit('Unsplash', response);
    if (response.data.results && response.data.results.length > 0) {
      const i = idx < response.data.results.length ? idx : 0;
      return response.data.results[i].urls.full || response.data.results[i].urls.regular;
    }
  } catch (err) {
    if (err.response) trackRateLimit('Unsplash', err.response);
    console.error(`[Unsplash] Error for "${query}":`, err.message);
  }
  return null;
};

/**
 * Fetch image from Pixabay
 */
const fetchFromPixabay = async (keys, query, idx = 0) => {
  if (!keys.length) return null;
  const key = keys[Math.floor(Math.random() * keys.length)];
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: { key, q: query, image_type: 'photo', orientation: 'horizontal', per_page: Math.max(10, idx + 1), safesearch: true },
      timeout: 8000
    });
    trackRateLimit('Pixabay', response);
    if (response.data.hits && response.data.hits.length > 0) {
      const i = idx < response.data.hits.length ? idx : 0;
      return response.data.hits[i].largeImageURL;
    }
  } catch (err) {
    if (err.response) trackRateLimit('Pixabay', err.response);
    console.error(`[Pixabay] Error for "${query}":`, err.message);
  }
  return null;
};

/**
 * Fetch image from Wikipedia (free, no key needed, highly accurate for landmarks)
 */
const fetchFromWikipedia = async (query) => {
  try {
    const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: { action: 'query', list: 'search', srsearch: query, format: 'json', utf8: 1, srlimit: 5 },
      timeout: 8000
    });
    if (searchRes.data.query?.search?.length > 0) {
      const titles = searchRes.data.query.search.map(s => s.title);
      for (const title of titles) {
        const imageRes = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: { action: 'query', prop: 'pageimages', format: 'json', piprop: 'original', titles: title },
          timeout: 8000
        });
        const pages = imageRes.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const source = pages[pageId]?.original?.source;
        if (source) {
          const lowerSrc = source.toLowerCase();
          // Filter out maps, SVGs, icons, and flags to ensure we get a scenic photo
          if (!lowerSrc.endsWith('.svg') && 
              !lowerSrc.includes('map') && 
              !lowerSrc.includes('icon') && 
              !lowerSrc.includes('flag') && 
              !lowerSrc.includes('coat_of_arms') &&
              !lowerSrc.includes('locator')) {
            return source;
          }
        }
      }
    }
  } catch (err) {
    console.error(`[Wikipedia] Error for "${query}":`, err.message);
  }
  return null;
};

// ── Server-side LRU image cache (max 500 entries, 1 hour TTL) ──────────────
const IMAGE_CACHE_MAX = 500;
const IMAGE_CACHE_TTL = 60 * 60 * 1000;
const imageCache = new Map();

const getCachedImage = (key) => {
  const entry = imageCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > IMAGE_CACHE_TTL) {
    imageCache.delete(key);
    return null;
  }
  return entry.url;
};

const setCachedImage = (key, url) => {
  if (imageCache.size >= IMAGE_CACHE_MAX) {
    const oldest = imageCache.keys().next().value;
    imageCache.delete(oldest);
  }
  imageCache.set(key, { url, ts: Date.now() });
};

// ── Rate limit tracker per provider ────────────────────────────────────────
const rateLimits = {
  Pixabay:  { remaining: 100, resetAt: 0 },
  Pexels:   { remaining: 200, resetAt: 0 },
  Unsplash: { remaining: 50,  resetAt: 0 },
};

const trackRateLimit = (name, response) => {
  if (!response?.headers) return;
  const remainingStr = response.headers['x-ratelimit-remaining'] || response.headers['x-rate-limit-remaining'] || response.headers['x-ratelimit-remaining-requests'];
  const remaining = parseInt(remainingStr, 10);
  if (!isNaN(remaining)) {
    rateLimits[name].remaining = remaining;
    rateLimits[name].resetAt = Date.now() + 60 * 60 * 1000; // 1 hour reset estimation
  }
};

const getHealthiestOrder = (providers) => {
  const now = Date.now();
  return providers
    .filter(p => p.keys.length > 0)
    .map(p => {
      const limit = rateLimits[p.name];
      const remaining = now > limit.resetAt ? 100 : limit.remaining;
      return { ...p, remaining };
    })
    // Unsplash > Pexels > Pixabay (as long as they have > 5 remaining)
    .sort((a, b) => {
       if (a.remaining > 5 && b.remaining > 5) {
         const order = { 'Unsplash': 3, 'Pexels': 2, 'Pixabay': 1 };
         return order[b.name] - order[a.name];
       }
       return b.remaining - a.remaining;
    });
};

export const getDestinationImage = catchAsync(async (req, res) => {
  const { query: rawQuery, type, exact, index = 0 } = req.query;
  const idx = parseInt(index, 10) || 0;
  
  if (!rawQuery) {
    return ApiResponse.sendError(res, 400, 'Query parameter is required');
  }

  let primaryQuery = rawQuery;
  if (exact !== 'true') {
    primaryQuery = extractPrimaryTerm(rawQuery);
    if (type) {
      primaryQuery = `${primaryQuery} ${type}`;
    }
  }
  
  console.log(`[Image] Fetching for: "${primaryQuery}" (raw: "${rawQuery}", type: "${type}", exact: "${exact}", idx: ${idx})`);

  const cacheKey = `${primaryQuery.toLowerCase().trim()}_idx_${idx}`;
  const cached = getCachedImage(cacheKey);
  if (cached) {
    console.log(`[Image] 🗄️ Cache hit for "${primaryQuery}" idx ${idx}`);
    return ApiResponse.send(res, 200, 'Image fetched successfully', { imageUrl: cached });
  }

  const pexelsKeys = process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.split(',').map(k => k.trim()) : [];
  const unsplashKeys = process.env.UNSPLASH_API_KEY ? process.env.UNSPLASH_API_KEY.split(',').map(k => k.trim()) : [];
  const pixabayKeys = process.env.PIXABAY_API_KEY ? process.env.PIXABAY_API_KEY.split(',').map(k => k.trim()) : [];

  let imageUrl = null;

  const allProviders = [
    { name: 'Unsplash', fetcher: fetchFromUnsplash, keys: unsplashKeys },
    { name: 'Pexels', fetcher: fetchFromPexels, keys: pexelsKeys },
    { name: 'Pixabay', fetcher: fetchFromPixabay, keys: pixabayKeys }
  ];
  
  const sortedProviders = getHealthiestOrder(allProviders);

  for (const provider of sortedProviders) {
    if (!imageUrl) {
      imageUrl = await provider.fetcher(provider.keys, primaryQuery, idx);
      if (imageUrl) {
        console.log(`[Image] ${provider.name} succeeded for "${primaryQuery}" idx ${idx} (remaining: ~${provider.remaining})`);
      } else {
        console.log(`[Image] ${provider.name} failed for "${primaryQuery}" idx ${idx}`);
      }
    }
  }

  if (!imageUrl && idx === 0) {
    console.log(`[Image] All primary providers failed, trying Wikipedia for "${primaryQuery}"`);
    imageUrl = await fetchFromWikipedia(primaryQuery);
  }

  if (imageUrl) {
    setCachedImage(cacheKey, imageUrl);
    console.log(`[Image] ✅ Found image for "${primaryQuery}"`);
    ApiResponse.send(res, 200, 'Image fetched successfully', { imageUrl });
  } else {
    console.warn(`[Image] ❌ No image found for "${primaryQuery}" - returning generic fallback`);
    const fallbackUrl = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600&auto=format&fit=crop';
    ApiResponse.send(res, 200, 'Fallback image', { imageUrl: fallbackUrl, isFallback: true });
  }
});

import aiService from '../services/ai.service.js';

/**
 * Strict moodboard image fetcher.
 * Returns ONLY images that are relevant to the query.
 * NEVER returns generic fallback images — returns empty array instead,
 * so the client can implement its own progressive query chain.
 */
export const getMoodboardImages = catchAsync(async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) {
    return ApiResponse.sendError(res, 400, 'Query parameter is required');
  }

  const pixabayKeys = process.env.PIXABAY_API_KEY ? process.env.PIXABAY_API_KEY.split(',').map(k => k.trim()) : [];
  const pexelsKeys  = process.env.PEXELS_API_KEY  ? process.env.PEXELS_API_KEY.split(',').map(k => k.trim())  : [];

  let images = [];

  // ── Pexels (portrait photos, highest quality) ──────────────────────────────
  if (pexelsKeys.length > 0) {
    const key = pexelsKeys[Math.floor(Math.random() * pexelsKeys.length)];
    try {
      const r = await axios.get('https://api.pexels.com/v1/search', {
        params: { query, orientation: 'portrait', per_page: 15, page, size: 'large' },
        headers: { Authorization: key },
        timeout: 10000
      });
      if (r.data.photos?.length > 0) {
        images = images.concat(r.data.photos.map(p => p.src.large2x || p.src.large));
      }
    } catch (err) {
      console.error(`[Pexels moodboard] "${query}":`, err.message);
    }
  }

  // ── Pixabay (vertical photos) ───────────────────────────────────────────────
  if (pixabayKeys.length > 0) {
    const key = pixabayKeys[Math.floor(Math.random() * pixabayKeys.length)];
    try {
      const r = await axios.get('https://pixabay.com/api/', {
        params: { key, q: query, image_type: 'photo', orientation: 'vertical', per_page: 15, page, safesearch: true },
        timeout: 10000
      });
      if (r.data.hits?.length > 0) {
        images = images.concat(r.data.hits.map(p => p.largeImageURL));
      }
    } catch (err) {
      console.error(`[Pixabay moodboard] "${query}":`, err.message);
    }
  }

  // De-duplicate
  images = [...new Set(images)];

  // STRICT: Return empty array if no results found.
  // Never return unrelated images — the client handles progressive fallback.
  console.log(`[Moodboard] "${query}" → ${images.length} images`);
  return ApiResponse.send(res, 200, 'OK', { images, hasResults: images.length > 0 });
});
