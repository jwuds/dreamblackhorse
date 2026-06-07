import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import prerender from '@prerenderer/rollup-plugin';

// Static, public routes to prerender into real HTML at build time.
// Dynamic routes (/product/:id, /blog/:slug), auth, and admin routes are
// intentionally excluded — their content depends on runtime data / sessions.
const PRERENDER_ROUTES = [
  '/',
  '/horses',
  '/about',
  '/reviews',
  '/blog',
  '/contact',
  '/privacy',
  '/cookies',
  '/privacy-terms',
  '/terms-policies',
];

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    ...(command === 'build'
      ? [
          prerender({
            routes: PRERENDER_ROUTES,
            renderer: '@prerenderer/renderer-puppeteer',
            rendererOptions: {
              maxConcurrentRoutes: 1,
              // Give Supabase fetches + react-helmet time to populate the DOM
              // before snapshotting (avoids capturing the loading spinner).
              renderAfterTime: 5000,
              timeout: 60000,
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
          }),
        ]
      : []),
  ],
  server: {
    cors: true,
    port: 3000,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        '@babel/parser',
        '@babel/traverse',
        '@babel/generator',
        '@babel/types'
      ]
    }
  }
}));
