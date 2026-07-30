const sharp = require('sharp');
const fs = require('fs');

async function generateIcons() {
  const svgBuffer = fs.readFileSync('./public/favicon.svg');
  
  // Create 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('./public/pwa-192x192.png');
    
  // Create 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('./public/pwa-512x512.png');
    
  // Also update apple-touch-icon if needed, or maskable, but these 2 cover the manifest
  console.log('Icons generated successfully.');
}

generateIcons().catch(console.error);
