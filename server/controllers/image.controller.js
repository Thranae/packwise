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
const fetchFromPexels = async (keys, query) => {
  if (!keys.length) return null;
  const key = keys[Math.floor(Math.random() * keys.length)];
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: { query, orientation: 'landscape', per_page: 8, size: 'large' },
      headers: { Authorization: key },
      timeout: 8000
    });
    if (response.data.photos && response.data.photos.length > 0) {
      const photo = response.data.photos[0];
      return photo.src.large2x || photo.src.large;
    }
  } catch (err) {
    console.error(`[Pexels] Error for "${query}":`, err.message);
  }
  return null;
};

/**
 * Fetch image from Unsplash
 */
const fetchFromUnsplash = async (keys, query) => {
  if (!keys.length) return null;
  const key = keys[Math.floor(Math.random() * keys.length)];
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, orientation: 'landscape', per_page: 5, order_by: 'relevant' },
      headers: { Authorization: `Client-ID ${key}` },
      timeout: 8000
    });
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.full || response.data.results[0].urls.regular;
    }
  } catch (err) {
    console.error(`[Unsplash] Error for "${query}":`, err.message);
  }
  return null;
};

/**
 * Fetch image from Pixabay
 */
const fetchFromPixabay = async (keys, query) => {
  if (!keys.length) return null;
  const key = keys[Math.floor(Math.random() * keys.length)];
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: { key, q: query, image_type: 'photo', orientation: 'horizontal', per_page: 8, safesearch: true },
      timeout: 8000
    });
    if (response.data.hits && response.data.hits.length > 0) {
      return response.data.hits[0].largeImageURL;
    }
  } catch (err) {
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

export const getDestinationImage = catchAsync(async (req, res) => {
  const { query: rawQuery, type, exact } = req.query;
  if (!rawQuery) {
    return ApiResponse.sendError(res, 400, 'Query parameter is required');
  }

  // Extract the most specific term to avoid country-level mismatches
  // If exact=true is passed (usually from AI), we trust the query and don't strip it
  let primaryQuery = rawQuery;
  if (exact !== 'true') {
    primaryQuery = extractPrimaryTerm(rawQuery);
    if (type) {
      primaryQuery = `${primaryQuery} ${type}`;
    }
  }
  
  console.log(`[Image] Fetching for: "${primaryQuery}" (raw: "${rawQuery}", type: "${type}", exact: "${exact}")`);

  const pexelsKeys = process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.split(',').map(k => k.trim()) : [];
  const unsplashKeys = process.env.UNSPLASH_API_KEY ? process.env.UNSPLASH_API_KEY.split(',').map(k => k.trim()) : [];
  const pixabayKeys = process.env.PIXABAY_API_KEY ? process.env.PIXABAY_API_KEY.split(',').map(k => k.trim()) : [];

  let imageUrl = null;

  // Strategy 1: Try Pexels first (most reliable & highest quality)
  imageUrl = await fetchFromPexels(pexelsKeys, primaryQuery);

  // Strategy 2: Try Unsplash if Pexels fails
  if (!imageUrl) {
    console.log(`[Image] Pexels failed, trying Unsplash for "${primaryQuery}"`);
    imageUrl = await fetchFromUnsplash(unsplashKeys, primaryQuery);
  }

  // Strategy 3: Try Pixabay if both above fail
  if (!imageUrl) {
    console.log(`[Image] Unsplash failed, trying Pixabay for "${primaryQuery}"`);
    imageUrl = await fetchFromPixabay(pixabayKeys, primaryQuery);
  }

  // Strategy 4: Try Wikipedia (free, very accurate for geographic/landmark queries)
  if (!imageUrl) {
    console.log(`[Image] All paid providers failed, trying Wikipedia for "${primaryQuery}"`);
    imageUrl = await fetchFromWikipedia(primaryQuery);
  }

  // Strategy 5: If primaryQuery failed, retry with the raw query on Wikipedia
  if (!imageUrl && primaryQuery !== rawQuery) {
    console.log(`[Image] Trying Wikipedia with raw query "${rawQuery}"`);
    imageUrl = await fetchFromWikipedia(rawQuery);
  }

  if (imageUrl) {
    console.log(`[Image] ✅ Found image for "${primaryQuery}"`);
    ApiResponse.send(res, 200, 'Image fetched successfully', { imageUrl });
  } else {
    console.warn(`[Image] ❌ No image found for "${primaryQuery}" - returning 404`);
    ApiResponse.sendError(res, 404, 'No images found for this destination');
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
