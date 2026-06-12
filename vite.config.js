import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import prerender from '@prerenderer/rollup-plugin';
import { getPrerenderRoutes, writeSitemap } from './tools/getPrerenderRoutes.mjs';

// Routes that must never be prerendered: gated/admin/auth/transactional pages.
// They require a session, are noindex, and would otherwise snapshot a login
// redirect. Everything else (static pages + every horse + every blog post)
// gets prerendered into real HTML.

export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const buildPlugins = [];
  if (command === 'build') {
    const routes = await getPrerenderRoutes({
      supabaseUrl: env.VITE_SUPABASE_URL,
      supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY,
    });

    // Keep sitemap.xml in sync with exactly what we prerender.
    writeSitemap(routes, path.resolve(process.cwd(), 'public/sitemap.xml'));

    buildPlugins.push(
      prerender({
        routes,
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          maxConcurrentRoutes: 2,
          // Dynamic pages dispatch 'prerender-ready' when their data is loaded.
          // Static pages fall back to the time-based trigger at 10s.
          // Using both: Puppeteer resolves on whichever fires first — for static
          // pages that's the timeout, for dynamic pages it's the event (faster).
          renderAfterDocumentEvent: 'prerender-ready',
          renderAfterTime: 10000,
          timeout: 90000,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        // Guarantee exactly one correct canonical + og:url per page. Without
        // this, the static template tag and the react-helmet tag both ship,
        // producing the duplicate/global-canonical bug that de-indexes subpages.
        postProcess(renderedRoute) {
          const base = 'https://dreamblackhorse.com';
          const url = base + renderedRoute.route;

          renderedRoute.html = renderedRoute.html
            .replace(/\s*<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, '')
            .replace(/\s*<meta\b[^>]*\bproperty=["']og:url["'][^>]*>/gi, '')
            .replace(
              '</head>',
              `    <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n  </head>`
            );
        },
      })
    );
  }

  return {
    plugins: [
      react(),
      ...buildPlugins,
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
  };
});
