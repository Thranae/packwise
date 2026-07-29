const sharp = require('sharp');
const fs = require('fs');

async function generate() {
  const svgBuffer = fs.readFileSync('logo-pwa.svg');
  
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
    
  await sharp(svgBuffer)
    .resize(192, 192)
    .jpeg({ quality: 100 })
    .toFile('public/pwa-192x192.jpg');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .jpeg({ quality: 100 })
    .toFile('public/pwa-512x512.jpg');
    
  console.log('Icons generated successfully!');
}

generate().catch(console.error);
