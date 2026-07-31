const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const publicDir = path.join(__dirname, 'public');
  const svgPath = path.join(publicDir, 'logo.svg');
  
  // Read SVG, remove rx="100" to make it a perfect solid square
  let svgData = fs.readFileSync(svgPath, 'utf8');
  svgData = svgData.replace('rx="100"', '');
  
  const buffer = Buffer.from(svgData);
  
  console.log("Generating pwa-512x512.png...");
  await sharp(buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
    
  console.log("Generating pwa-192x192.png...");
  await sharp(buffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
    
  console.log("Generating maskable-icon-512x512.png...");
  await sharp(buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'maskable-icon-512x512.png'));

  console.log("Done!");
}

generateIcons().catch(console.error);
