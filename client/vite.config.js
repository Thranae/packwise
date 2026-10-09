import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        maximumFileSizeToCacheInBytes: 10000000, // 10MB to handle heavy 3D bundles
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/api\.maptiler\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'map-tiles-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      manifest: {
        name: 'Voyage Genie - AI Travel',
        short_name: 'Voyage Genie',
        description: 'Your AI-powered smart travel companion.',
        theme_color: '#0B1120',
        background_color: '#0B1120',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'motion/react': 'framer-motion',
      'motion': 'framer-motion',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.loca.lt'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor-react';
            if (id.includes('framer-motion') || id.includes('lucide-react')) return 'vendor-ui';
            if (id.includes('maplibre-gl') || id.includes('react-map-gl') || id.includes('leaflet')) return 'vendor-map';
            if (id.includes('@splinetool')) return 'vendor-spline';
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('globe.gl')) return 'vendor-globe';
            if (id.includes('jspdf') || id.includes('html2canvas')) return 'vendor-pdf';
            if (id.includes('react-markdown') || id.includes('remark-gfm')) return 'vendor-markdown';
            if (id.includes('@hello-pangea/dnd')) return 'vendor-dnd';
            if (id.includes('axios') || id.includes('dexie') || id.includes('zod')) return 'vendor-utils';
          }
        }
      }
    }
  }
});
