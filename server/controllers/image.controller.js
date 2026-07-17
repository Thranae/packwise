import axios from 'axios';
import { catchAsync } from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getDestinationImage = catchAsync(async (req, res) => {
  const { query, type } = req.query;
  if (!query) {
    return ApiResponse.sendError(res, 400, 'Query parameter is required');
  }

  const pexelsKeys = process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.split(',').map(k => k.trim()) : [];
  const unsplashKeys = process.env.UNSPLASH_API_KEY ? process.env.UNSPLASH_API_KEY.split(',').map(k => k.trim()) : [];
  const pixabayKeys = process.env.PIXABAY_API_KEY ? process.env.PIXABAY_API_KEY.split(',').map(k => k.trim()) : [];
  let imageUrl = null;

  try {
    const providers = [];
    if (pexelsKeys.length > 0) providers.push('pexels');
    if (unsplashKeys.length > 0) providers.push('unsplash');
    if (pixabayKeys.length > 0) providers.push('pixabay');
    
    // Shuffle providers to load-balance
    providers.sort(() => 0.5 - Math.random());

    for (const provider of providers) {
      if (imageUrl) break;
      
      try {
        if (provider === 'unsplash') {
          const key = unsplashKeys[Math.floor(Math.random() * unsplashKeys.length)];
          const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query, orientation: 'landscape', per_page: 1 },
            headers: { Authorization: `Client-ID ${key}` }
          });
          if (response.data.results && response.data.results.length > 0) {
            imageUrl = response.data.results[0].urls.regular;
          }
        } else if (provider === 'pexels') {
          const key = pexelsKeys[Math.floor(Math.random() * pexelsKeys.length)];
          const response = await axios.get('https://api.pexels.com/v1/search', {
            params: { query, orientation: 'landscape', per_page: 1 },
            headers: { Authorization: key }
          });
          if (response.data.photos && response.data.photos.length > 0) {
            imageUrl = response.data.photos[0].src.large;
          }
        } else if (provider === 'pixabay') {
          const key = pixabayKeys[Math.floor(Math.random() * pixabayKeys.length)];
          const response = await axios.get('https://pixabay.com/api/', {
            params: { key, q: query, image_type: 'photo', orientation: 'horizontal', per_page: 3 }
          });
          if (response.data.hits && response.data.hits.length > 0) {
            imageUrl = response.data.hits[0].largeImageURL;
          }
        }
      } catch (err) {
        console.error(`Error with ${provider} provider:`, err.message);
      }
    }
  } catch (error) {
    console.error('Image API Error, falling back to Wikipedia:', error.message);
  }

  // 2. Fallback to Wikipedia Open API
  const tryWikipedia = async (searchQuery) => {
    try {
      const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: { action: 'query', list: 'search', srsearch: searchQuery, format: 'json', utf8: 1 }
      });
      if (searchRes.data.query?.search?.length > 0) {
        const title = searchRes.data.query.search[0].title;
        const imageRes = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: { action: 'query', prop: 'pageimages', format: 'json', piprop: 'original', titles: title }
        });
        const pages = imageRes.data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pages[pageId] && pages[pageId].original) {
          return pages[pageId].original.source;
        }
      }
    } catch (error) {
      console.error(`Wikipedia API Error for ${searchQuery}:`, error.message);
    }
    return null;
  };

  if (!imageUrl) {
    imageUrl = await tryWikipedia(query);
    
    // 3. Ultimate Fallback: Generate a unique placeholder image
    if (!imageUrl) {
      const seed = encodeURIComponent(query.replace(/[^a-zA-Z0-9]/g, ''));
      imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
    }
  }

  if (imageUrl) {
    ApiResponse.send(res, 200, 'Image fetched successfully', { imageUrl });
  } else {
    ApiResponse.sendError(res, 404, 'No images found for this destination');
  }
});

import aiService from '../services/ai.service.js';

export const getMoodboardImages = catchAsync(async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) {
    return ApiResponse.sendError(res, 400, 'Query parameter is required');
  }

  const pexelsKeys = process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.split(',').map(k => k.trim()) : [];
  const pixabayKeys = process.env.PIXABAY_API_KEY ? process.env.PIXABAY_API_KEY.split(',').map(k => k.trim()) : [];

  try {
    let images = [];
    const fetchPromises = [];

    // Fetch from Pexels
    if (pexelsKeys.length > 0) {
      const pexelsKey = pexelsKeys[Math.floor(Math.random() * pexelsKeys.length)];
      fetchPromises.push(
        axios.get('https://api.pexels.com/v1/search', {
          params: { query, orientation: 'portrait', per_page: 30, page },
          headers: { Authorization: pexelsKey }
        }).then(res => {
          if (res.data.photos) return res.data.photos.map(p => p.src.large);
          return [];
        }).catch(err => {
          console.error("Pexels error:", err.message);
          return [];
        })
      );
    }

    // Fetch from Pixabay
    if (pixabayKeys.length > 0) {
      const pixabayKey = pixabayKeys[Math.floor(Math.random() * pixabayKeys.length)];
      fetchPromises.push(
        axios.get('https://pixabay.com/api/', {
          params: { key: pixabayKey, q: query, image_type: 'photo', orientation: 'vertical', per_page: 30, page }
        }).then(res => {
          if (res.data.hits) return res.data.hits.map(p => p.largeImageURL);
          return [];
        }).catch(err => {
          console.error("Pixabay error:", err.message);
          return [];
        })
      );
    }

    if (fetchPromises.length === 0) {
      throw new Error("No API keys configured");
    }

    const results = await Promise.all(fetchPromises);
    results.forEach(resArray => {
      images = images.concat(resArray);
    });

    // Shuffle the combined images
    images.sort(() => 0.5 - Math.random());

    if (images.length === 0) {
      throw new Error("No images found from any provider");
    }
    
    return ApiResponse.send(res, 200, 'Moodboard images fetched successfully', { images });
  } catch (error) {
    console.error('API Error (Moodboard):', error.message, '- Using fallbacks');
    
    // High-quality Unsplash fallbacks for fashion/street style
    const fallbackImages = [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0c1158a409ec?w=800&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
      "https://images.unsplash.com/photo-1485230895905-ef05ba62ebfd?w=800&q=80",
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&q=80",
      "https://images.unsplash.com/photo-1550614000-4b95d466f168?w=800&q=80",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
      "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80",
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80"
    ];
    
    const shuffled = [...fallbackImages].sort(() => 0.5 - Math.random());
    return ApiResponse.send(res, 200, 'Moodboard images fetched successfully (Fallback)', { images: shuffled });
  }
});
