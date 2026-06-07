import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://dreamblackhorse.com';

// Static, public routes — always prerendered.
export const STATIC_ROUTES = [
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

// Hostinger Ecommerce store that backs the horse listings (/product/:id).
// Mirrors the constants in src/api/EcommerceApi.js.
const ECOMMERCE_API_URL = 'https://api-ecommerce.hostinger.com';
const ECOMMERCE_STORE_ID = 'store_01KJ0FDRQP5SQGZE07A392V7SY';

// Fetch every product id from the Hostinger store, paginating until complete.
async function fetchProductRoutes() {
  const routes = [];
  const limit = 100;
  let offset = 0;

  try {
    for (;;) {
      const url = `${ECOMMERCE_API_URL}/store/${ECOMMERCE_STORE_ID}/products?limit=${limit}&offset=${offset}`;
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      const data = await res.json();
      const products = data.products || [];
      for (const p of products) {
        if (p?.id) routes.push(`/product/${p.id}`);
      }

      const count = typeof data.count === 'number' ? data.count : products.length;
      offset += products.length;
      if (products.length === 0 || offset >= count) break;
    }
    console.log(`[prerender] Found ${routes.length} product route(s).`);
  } catch (err) {
    console.warn(`[prerender] Could not fetch product routes — skipping them. ${err.message}`);
  }

  return routes;
}

// Fetch every published blog slug from Supabase (/blog/:slug).
async function fetchBlogRoutes(supabaseUrl, supabaseAnonKey) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[prerender] Missing Supabase env vars — skipping blog routes.');
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published');

    if (error) throw error;

    const routes = (data || [])
      .map((row) => row.slug)
      .filter(Boolean)
      .map((slug) => `/blog/${slug}`);

    console.log(`[prerender] Found ${routes.length} blog route(s).`);
    return routes;
  } catch (err) {
    console.warn(`[prerender] Could not fetch blog routes — skipping them. ${err.message}`);
    return [];
  }
}

/**
 * Build the full list of routes to prerender: the static public pages plus
 * every dynamic horse listing and blog post. Network failures degrade
 * gracefully — a missing source is skipped, never fatal to the build.
 */
export async function getPrerenderRoutes({ supabaseUrl, supabaseAnonKey } = {}) {
  const [productRoutes, blogRoutes] = await Promise.all([
    fetchProductRoutes(),
    fetchBlogRoutes(supabaseUrl, supabaseAnonKey),
  ]);

  // De-duplicate while preserving order.
  const all = [...STATIC_ROUTES, ...productRoutes, ...blogRoutes];
  const unique = [...new Set(all)];
  console.log(`[prerender] Total routes to prerender: ${unique.length}`);
  return unique;
}

function routeMeta(route) {
  if (route === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (route === '/horses') return { priority: '0.9', changefreq: 'daily' };
  if (route.startsWith('/product/')) return { priority: '0.8', changefreq: 'weekly' };
  if (route === '/blog') return { priority: '0.8', changefreq: 'weekly' };
  if (route.startsWith('/blog/')) return { priority: '0.7', changefreq: 'monthly' };
  if (['/privacy', '/cookies', '/privacy-terms', '/terms-policies'].includes(route)) {
    return { priority: '0.3', changefreq: 'yearly' };
  }
  return { priority: '0.7', changefreq: 'monthly' };
}

// Generate sitemap.xml from the same route list that is prerendered, so the
// two never drift apart.
export function writeSitemap(routes, outPath) {
  const lastmod = new Date().toISOString().split('T')[0];
  const body = routes
    .map((route) => {
      const { priority, changefreq } = routeMeta(route);
      return [
        '  <url>',
        `    <loc>${SITE_URL}${route}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(`[prerender] Wrote sitemap with ${routes.length} URLs to ${outPath}`);
}
