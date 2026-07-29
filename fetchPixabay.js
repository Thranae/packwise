const https = require('https');
const API_KEY = '56729880-03e2b2898e75ffaec2d685c1b';
const queries = ['Senso-ji Temple', 'Shibuya Crossing', 'Meiji Shrine', 'Tsukiji Market', 'Tokyo Tower', 'Akihabara', 'Shinjuku Gyoen', 'Golden Gai', 'Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari', 'Burj Al Arab', 'Dubai Marina', 'Global Village', 'Miracle Garden', 'Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River', 'Notre Dame', 'Arc de Triomphe', 'Versailles', 'Le Marais', 'City Center Plaza', 'Historic Old Town', 'Central Park', 'Sunset Viewpoint', 'Local Market', 'Art Museum', 'Gourmet Street', 'Grand Theater'];

async function fetchPixabay(q) {
  return new Promise((resolve) => {
    https.get(`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(q)}&image_type=photo&per_page=3`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.hits && json.hits.length > 0 ? json.hits[0].largeImageURL : 'https://cdn.pixabay.com/photo/2016/01/09/18/27/camera-1130731_1280.jpg');
        } catch(e) { resolve('https://cdn.pixabay.com/photo/2016/01/09/18/27/camera-1130731_1280.jpg'); }
      });
    }).on('error', () => resolve('https://cdn.pixabay.com/photo/2016/01/09/18/27/camera-1130731_1280.jpg'));
  });
}

async function run() {
  const results = {};
  for(const q of queries) {
    results[q] = await fetchPixabay(q);
  }
  console.log(JSON.stringify(results, null, 2));
}
run();
