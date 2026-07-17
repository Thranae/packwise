import axios from 'axios';

export const fetchImageForKeyword = async (keyword, width = 1200, height = 800) => {
  const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
  
  if (UNSPLASH_KEY && UNSPLASH_KEY !== 'YOUR_UNSPLASH_KEY') {
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: keyword,
          per_page: 1,
          orientation: width > height ? 'landscape' : 'portrait'
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0].urls.regular;
      }
    } catch (error) {
      console.error("Unsplash API error, falling back to Picsum:", error.message);
    }
  }

  // Fallback to picsum with seeded keyword for consistency
  const seed = encodeURIComponent(keyword.replace(/\s+/g, '-').toLowerCase());
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};
