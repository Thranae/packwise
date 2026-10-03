const fs = require('fs');
const file = 'd:/packwise/client/src/constants/slideshowImages.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\s*"url":\s*"[^"]+",\s*"city":\s*"([^"]+)",\s*"country":\s*"([^"]+)"\s*\}/g;
content = content.replace(regex, (match, city, country) => {
  const url = `https://image.pollinations.ai/prompt/beautiful%20scenic%20travel%20photo%20of%20${encodeURIComponent(city)}%20${encodeURIComponent(country)}?width=1080&height=1920&nologo=true`;
  return `{
    "url": "${url}",
    "city": "${city}",
    "country": "${country}"
  }`;
});

fs.writeFileSync(file, content);
console.log('Fixed slideshowImages.js');
