const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1024 });

  // 1. COMBINED ICON
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0; padding: 0; display: flex; align-items: center; justify-content: center;
          width: 1024px; height: 1024px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        }
        svg { width: 800px; height: 800px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5)); }
      </style>
    </head>
    <body>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="metallic-icon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="40%" stop-color="#e2e8f0" />
            <stop offset="100%" stop-color="#64748b" />
          </linearGradient>
          <linearGradient id="pin-grad-icon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#93c5fd" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
        </defs>
        <path d="M18 12V6 M30 12V6" stroke="url(#metallic-icon)" stroke-width="2.5" stroke-linecap="round" />
        <path d="M15 6H33" stroke="url(#metallic-icon)" stroke-width="3.5" stroke-linecap="round" />
        <rect x="10" y="12" width="28" height="30" rx="4" stroke="url(#metallic-icon)" stroke-width="3" stroke-linejoin="round" />
        <path d="M16 18V36 M32 18V36" stroke="url(#metallic-icon)" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
        <circle cx="15" cy="44" r="2" fill="url(#metallic-icon)" />
        <circle cx="33" cy="44" r="2" fill="url(#metallic-icon)" />
        <g>
          <path d="M24 16C27.3137 16 30 18.6863 30 22C30 26 24 32 24 32C24 32 18 26 18 22C18 18.6863 20.6863 16 24 16Z" fill="url(#pin-grad-icon)" />
          <circle cx="24" cy="22" r="2.5" fill="white" />
        </g>
      </svg>
    </body>
    </html>
  `);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'assets/icon.png' });
  await page.screenshot({ path: 'assets/splash.png' }); // reuse for splash

  // 2. BACKGROUND ONLY (Solid gradient)
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0; padding: 0;
          width: 1024px; height: 1024px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        }
      </style>
    </head>
    <body></body>
    </html>
  `);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'assets/icon-background.png' });

  // 3. FOREGROUND ONLY (Transparent background)
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0; padding: 0; display: flex; align-items: center; justify-content: center;
          width: 1024px; height: 1024px;
          background: transparent;
        }
        svg { width: 800px; height: 800px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5)); }
      </style>
    </head>
    <body>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="metallic-icon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="40%" stop-color="#e2e8f0" />
            <stop offset="100%" stop-color="#64748b" />
          </linearGradient>
          <linearGradient id="pin-grad-icon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#93c5fd" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
        </defs>
        <path d="M18 12V6 M30 12V6" stroke="url(#metallic-icon)" stroke-width="2.5" stroke-linecap="round" />
        <path d="M15 6H33" stroke="url(#metallic-icon)" stroke-width="3.5" stroke-linecap="round" />
        <rect x="10" y="12" width="28" height="30" rx="4" stroke="url(#metallic-icon)" stroke-width="3" stroke-linejoin="round" />
        <path d="M16 18V36 M32 18V36" stroke="url(#metallic-icon)" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
        <circle cx="15" cy="44" r="2" fill="url(#metallic-icon)" />
        <circle cx="33" cy="44" r="2" fill="url(#metallic-icon)" />
        <g>
          <path d="M24 16C27.3137 16 30 18.6863 30 22C30 26 24 32 24 32C24 32 18 26 18 22C18 18.6863 20.6863 16 24 16Z" fill="url(#pin-grad-icon)" />
          <circle cx="24" cy="22" r="2.5" fill="white" />
        </g>
      </svg>
    </body>
    </html>
  `);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'assets/icon-foreground.png', omitBackground: true });

  await browser.close();
  console.log('PNGs generated successfully');
})();
