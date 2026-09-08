import axios from 'axios';
import { catchAsync } from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

const extractPrimaryTerm = (query) => {
  const commaParts = query.split(',');
  if (commaParts.length > 1) {
    return commaParts[0].trim();
  }
  return query
    .replace(/\b(travel landmark scenic|travel landmark|landmark scenic|travel|tourism|vacation|tour|photo|background|wallpaper|trip)\b/gi, '')
    .trim();
};

// ── Provider fetchers ──────────────────────────────────────────────────────

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

// ── Rate limit tracker ─────────────────────────────────────────────────────
//
// Free tier hourly limits:
//   Pixabay:  ~100 req/hr (but 500K images, great coverage)
//   Pexels:   200 req/hr  (excellent quality, good coverage)
//   Unsplash: 50  req/hr  (best quality, tight limit)
//
const PROVIDER_LIMITS = {
  Pixabay:  { maxPerHour: 100 },
  Pexels:   { maxPerHour: 200 },
  Unsplash: { maxPerHour: 50  },
};

const rateLimits = {
  Pixabay:  { remaining: 100, resetAt: 0, requestsMade: 0, windowStart: Date.now() },
  Pexels:   { remaining: 200, resetAt: 0, requestsMade: 0, windowStart: Date.now() },
  Unsplash: { remaining: 50,  resetAt: 0, requestsMade: 0, windowStart: Date.now() },
};

const trackRateLimit = (name, response) => {
  if (!response?.headers) return;
  const limit = rateLimits[name];
  limit.requestsMade++;

  const remainingStr =
    response.headers['x-ratelimit-remaining'] ||
    response.headers['x-rate-limit-remaining'] ||
    response.headers['x-ratelimit-remaining-requests'];
  const remaining = parseInt(remainingStr, 10);

  if (!isNaN(remaining)) {
    limit.remaining = remaining;
  } else {
    limit.remaining = Math.max(0, PROVIDER_LIMITS[name].maxPerHour - limit.requestsMade);
  }

  const resetStr = response.headers['x-ratelimit-reset'];
  if (resetStr) {
    const resetEpoch = parseInt(resetStr, 10);
    limit.resetAt = resetEpoch > 1e12 ? resetEpoch : resetEpoch * 1000;
  } else {
    limit.resetAt = limit.windowStart + 60 * 60 * 1000;
  }
};

const getEffectiveRemaining = (name) => {
  const limit = rateLimits[name];
  const now = Date.now();
  if (now > limit.resetAt && limit.resetAt > 0) {
    limit.remaining = PROVIDER_LIMITS[name].maxPerHour;
    limit.requestsMade = 0;
    limit.windowStart = now;
    limit.resetAt = 0;
  }
  return limit.remaining;
};

// ── Smart provider selection ───────────────────────────────────────────────
//
// Strategy:
//   "single"  → one-off requests (hero images, trip cards, journal)
//              Priority: Pexels (200/hr) > Pixabay (100/hr) > Unsplash (50/hr)
//              Unsplash is too scarce for routine single lookups.
//
//   "bulk"    → batch requests (Explore 8 cards, Calendar 8 days)
//              Priority: Pixabay (100/hr, tolerant) > Pexels > Unsplash
//              Pixabay handles bulk best; we save Pexels/Unsplash for singles.
//
//   "premium" → user-initiated high-quality lookups (moodboard, exact search)
//              Priority: Pexels (best portrait quality) > Unsplash > Pixabay
//
//   Any provider with <5 remaining requests is deprioritized regardless of
//   strategy, and providers with 0 remaining are skipped entirely.
//

const STRATEGY_ORDER = {
  single:  ['Pexels', 'Pixabay', 'Unsplash'],
  bulk:    ['Pixabay', 'Pexels', 'Unsplash'],
  premium: ['Pexels', 'Unsplash', 'Pixabay'],
};

const PROVIDER_FETCHERS = {
  Pexels:   fetchFromPexels,
  Unsplash: fetchFromUnsplash,
  Pixabay:  fetchFromPixabay,
};

const buildSortedProviders = (strategy, pexelsKeys, unsplashKeys, pixabayKeys) => {
  const keyMap = { Pexels: pexelsKeys, Unsplash: unsplashKeys, Pixabay: pixabayKeys };
  const order = STRATEGY_ORDER[strategy] || STRATEGY_ORDER.single;

  return order
    .filter(name => keyMap[name].length > 0)
    .map(name => ({
      name,
      keys: keyMap[name],
      fetcher: PROVIDER_FETCHERS[name],
      remaining: getEffectiveRemaining(name),
    }))
    .sort((a, b) => {
      const aUsable = a.remaining > 5;
      const bUsable = b.remaining > 5;
      if (aUsable && !bUsable) return -1;
      if (!aUsable && bUsable) return 1;
      if (!aUsable && !bUsable) return b.remaining - a.remaining;
      const aOrder = order.indexOf(a.name);
      const bOrder = order.indexOf(b.name);
      return aOrder - bOrder;
    })
    .filter(p => p.remaining > 0);
};

// ── Helpers ────────────────────────────────────────────────────────────────
const parseKeys = (envVar) => envVar ? envVar.split(',').map(k => k.trim()) : [];

// ── GET /images/search ─────────────────────────────────────────────────────
export const getDestinationImage = catchAsync(async (req, res) => {
  const { query: rawQuery, type, exact, index = 0, strategy: reqStrategy } = req.query;
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
  
  const cacheKey = `${primaryQuery.toLowerCase().trim()}_idx_${idx}`;
  const cached = getCachedImage(cacheKey);
  if (cached) {
    console.log(`[Image] 🗄️ Cache hit for "${primaryQuery}" idx ${idx}`);
    return ApiResponse.send(res, 200, 'Image fetched successfully', { imageUrl: cached });
  }

  const pexelsKeys = parseKeys(process.env.PEXELS_API_KEY);
  const unsplashKeys = parseKeys(process.env.UNSPLASH_API_KEY);
  const pixabayKeys = parseKeys(process.env.PIXABAY_API_KEY);

  // Determine strategy from the request hint, or infer from index
  const strategy = reqStrategy || (idx > 0 ? 'bulk' : 'single');

  const sortedProviders = buildSortedProviders(strategy, pexelsKeys, unsplashKeys, pixabayKeys);

  let imageUrl = null;

  for (const provider of sortedProviders) {
    imageUrl = await provider.fetcher(provider.keys, primaryQuery, idx);
    if (imageUrl) {
      console.log(`[Image] ✅ ${provider.name} → "${primaryQuery}" idx ${idx} (remaining: ~${getEffectiveRemaining(provider.name)})`);
      break;
    }
    console.log(`[Image] ⏭️ ${provider.name} miss for "${primaryQuery}" idx ${idx}`);
  }

  if (!imageUrl && idx === 0) {
    console.log(`[Image] Trying Wikipedia for "${primaryQuery}"`);
    imageUrl = await fetchFromWikipedia(primaryQuery);
  }

  if (imageUrl) {
    setCachedImage(cacheKey, imageUrl);
    ApiResponse.send(res, 200, 'Image fetched successfully', { imageUrl });
  } else {
    console.warn(`[Image] ❌ No image found for "${primaryQuery}" — returning fallback`);
    const fallbackUrl = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600&auto=format&fit=crop';
    ApiResponse.send(res, 200, 'Fallback image', { imageUrl: fallbackUrl, isFallback: true });
  }
});

// ── GET /images/moodboard ──────────────────────────────────────────────────
// Moodboard-specific LRU cache (separate from destination image cache)
const moodboardCache = new Map();
const MOODBOARD_CACHE_TTL = 60 * 60 * 1000;
const MOODBOARD_CACHE_MAX = 200;

const getCachedMoodboard = (key) => {
  const entry = moodboardCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > MOODBOARD_CACHE_TTL) {
    moodboardCache.delete(key);
    return null;
  }
  return entry.images;
};

const setCachedMoodboard = (key, images) => {
  if (moodboardCache.size >= MOODBOARD_CACHE_MAX) {
    const oldest = moodboardCache.keys().next().value;
    moodboardCache.delete(oldest);
  }
  moodboardCache.set(key, { images, ts: Date.now() });
};

// Normalize a URL to its base path (strips query params / size suffixes)
// so the same Pexels/Pixabay photo at different resolutions deduplicates
const normalizeMoodboardUrl = (url) => {
  try {
    const u = new URL(url);
    u.search = '';
    return u.toString().replace(/\/$/, '');
  } catch {
    return url;
  }
};

export const getMoodboardImages = catchAsync(async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) {
    return ApiResponse.sendError(res, 400, 'Query parameter is required');
  }

  const cacheKey = `moodboard_${query.toLowerCase().trim()}_p${page}`;
  const cached = getCachedMoodboard(cacheKey);
  if (cached) {
    console.log(`[Moodboard] 🗄️ Cache hit for "${query}" page ${page}`);
    return ApiResponse.send(res, 200, 'OK', { images: cached, hasResults: cached.length > 0 });
  }

  const pexelsKeys = parseKeys(process.env.PEXELS_API_KEY);
  const pixabayKeys = parseKeys(process.env.PIXABAY_API_KEY);
  const unsplashKeys = parseKeys(process.env.UNSPLASH_API_KEY);

  const images = [];
  const seenNormalized = new Set();
  const addUnique = (urls) => {
    for (const url of urls) {
      const normalized = normalizeMoodboardUrl(url);
      if (!seenNormalized.has(normalized)) {
        seenNormalized.add(normalized);
        images.push(url);
      }
    }
  };

  // Pexels: best portrait quality, 200 req/hr — primary source
  if (pexelsKeys.length > 0 && getEffectiveRemaining('Pexels') > 5) {
    const key = pexelsKeys[Math.floor(Math.random() * pexelsKeys.length)];
    try {
      const r = await axios.get('https://api.pexels.com/v1/search', {
        params: { query, orientation: 'portrait', per_page: 20, page, size: 'large' },
        headers: { Authorization: key },
        timeout: 10000
      });
      trackRateLimit('Pexels', r);
      if (r.data.photos?.length > 0) {
        addUnique(r.data.photos.map(p => p.src.large2x || p.src.large));
      }
    } catch (err) {
      if (err.response) trackRateLimit('Pexels', err.response);
      console.error(`[Pexels moodboard] "${query}":`, err.message);
    }
  }

  // Pixabay: 100 req/hr, good for vertical fashion photos
  if (pixabayKeys.length > 0 && getEffectiveRemaining('Pixabay') > 5) {
    const key = pixabayKeys[Math.floor(Math.random() * pixabayKeys.length)];
    try {
      const r = await axios.get('https://pixabay.com/api/', {
        params: { key, q: query, image_type: 'photo', orientation: 'vertical', per_page: 20, page, safesearch: true },
        timeout: 10000
      });
      trackRateLimit('Pixabay', r);
      if (r.data.hits?.length > 0) {
        addUnique(r.data.hits.map(p => p.largeImageURL));
      }
    } catch (err) {
      if (err.response) trackRateLimit('Pixabay', err.response);
      console.error(`[Pixabay moodboard] "${query}":`, err.message);
    }
  }

  // Unsplash fallback: only if Pexels+Pixabay didn't yield enough results
  if (images.length < 5 && unsplashKeys.length > 0 && getEffectiveRemaining('Unsplash') > 5) {
    const key = unsplashKeys[Math.floor(Math.random() * unsplashKeys.length)];
    try {
      const r = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, orientation: 'portrait', per_page: 15, page, order_by: 'relevant' },
        headers: { Authorization: `Client-ID ${key}` },
        timeout: 10000
      });
      trackRateLimit('Unsplash', r);
      if (r.data.results?.length > 0) {
        addUnique(r.data.results.map(p => p.urls.regular));
      }
    } catch (err) {
      if (err.response) trackRateLimit('Unsplash', err.response);
      console.error(`[Unsplash moodboard] "${query}":`, err.message);
    }
  }

  if (images.length > 0) {
    setCachedMoodboard(cacheKey, images);
  }

  console.log(`[Moodboard] "${query}" → ${images.length} unique images`);
  return ApiResponse.send(res, 200, 'OK', { images, hasResults: images.length > 0 });
});
