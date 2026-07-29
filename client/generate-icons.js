import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Sleek Dark Background -->
  <rect width="512" height="512" rx="100" fill="#0f1015" />
  
  <!-- Subtle Gradient Glow behind the icon -->
  <circle cx="256" cy="256" r="180" fill="#4F7CFF" opacity="0.1" filter="blur(40px)" />
  <circle cx="256" cy="256" r="120" fill="#8B5CF6" opacity="0.1" filter="blur(30px)" />

  <defs>
    <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="40%" stopColor="#e2e8f0" />
      <stop offset="100%" stopColor="#94a3b8" />
    </linearGradient>
    <linearGradient id="pin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#93c5fd" />
      <stop offset="100%" stopColor="#3b82f6" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <g transform="translate(100, 100) scale(6.5)" filter="url(#shadow)">
    <!-- Telescopic Handle Poles -->
    <path d="M18 12V6 M30 12V6" stroke="url(#metallic)" stroke-width="2.5" stroke-linecap="round" />
    
    <!-- Handle Grip -->
    <path d="M15 6H33" stroke="url(#metallic)" stroke-width="3.5" stroke-linecap="round" />
    
    <!-- Suitcase Body -->
    <rect x="10" y="12" width="28" height="30" rx="4" stroke="url(#metallic)" stroke-width="3" stroke-linejoin="round" />
    
    <!-- Vertical Ribs -->
    <path d="M16 18V36 M32 18V36" stroke="url(#metallic)" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />

    <!-- Wheels -->
    <circle cx="15" cy="44" r="2.5" fill="url(#metallic)" />
    <circle cx="33" cy="44" r="2.5" fill="url(#metallic)" />

    <!-- Integrated Location Pin -->
    <g>
      <path d="M24 16C27.3137 16 30 18.6863 30 22C30 26 24 32 24 32C24 32 18 26 18 22C18 18.6863 20.6863 16 24 16Z" fill="url(#pin-grad)" />
      <circle cx="24" cy="22" r="2.5" fill="white" />
    </g>
  </g>
</svg>
`;

const ogImageSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Sleek Dark Background -->
  <rect width="1200" height="630" fill="#0f1015" />
  
  <!-- Subtle Gradient Glow behind the icon -->
  <circle cx="600" cy="315" r="300" fill="#4F7CFF" opacity="0.1" filter="blur(60px)" />
  <circle cx="600" cy="315" r="200" fill="#8B5CF6" opacity="0.1" filter="blur(40px)" />

  <defs>
    <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="40%" stopColor="#e2e8f0" />
      <stop offset="100%" stopColor="#94a3b8" />
    </linearGradient>
    <linearGradient id="pin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#93c5fd" />
      <stop offset="100%" stopColor="#3b82f6" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <g transform="translate(420, 135) scale(7.5)" filter="url(#shadow)">
    <!-- Telescopic Handle Poles -->
    <path d="M18 12V6 M30 12V6" stroke="url(#metallic)" stroke-width="2.5" stroke-linecap="round" />
    
    <!-- Handle Grip -->
    <path d="M15 6H33" stroke="url(#metallic)" stroke-width="3.5" stroke-linecap="round" />
    
    <!-- Suitcase Body -->
    <rect x="10" y="12" width="28" height="30" rx="4" stroke="url(#metallic)" stroke-width="3" stroke-linejoin="round" />
    
    <!-- Vertical Ribs -->
    <path d="M16 18V36 M32 18V36" stroke="url(#metallic)" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />

    <!-- Wheels -->
    <circle cx="15" cy="44" r="2.5" fill="url(#metallic)" />
    <circle cx="33" cy="44" r="2.5" fill="url(#metallic)" />

    <!-- Integrated Location Pin -->
    <g>
      <path d="M24 16C27.3137 16 30 18.6863 30 22C30 26 24 32 24 32C24 32 18 26 18 22C18 18.6863 20.6863 16 24 16Z" fill="url(#pin-grad)" />
      <circle cx="24" cy="22" r="2.5" fill="white" />
    </g>
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.resolve('public');
  
  console.log('Generating pwa-512x512.png...');
  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  console.log('Generating pwa-192x192.png...');
  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  console.log('Generating og-image.png...');
  await sharp(Buffer.from(ogImageSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('Done!');
}

generate().catch(console.error);
