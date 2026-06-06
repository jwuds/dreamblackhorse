# DREAMBLACK HORSE — VERCEL MIGRATION PROMPT
# Paste this entire file into Claude Code

---

## CONTEXT

You are migrating `dreamblackhorse.com` from Hostinger Horizons (a walled-garden SPA host) to Vercel. The site is a React 18 + Vite 4 + React Router v6 + Supabase SPA. The core problem is that Googlebot cannot crawl the site because all content is JavaScript-rendered — the HTML shell shipped to bots is an empty `<div id="root"></div>`.

There are 7 specific issues to fix. Execute them all in order. Do not skip any step.

---

## ISSUE 1 — CREATE `vercel.json` (SPA Routing Fix)

Without this, every route except `/` returns a 404 on Vercel because Vercel tries to serve a static file that doesn't exist.

Create `/vercel.json` in the project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## ISSUE 2 — FIX DOUBLE CANONICAL BUG IN `src/components/SEOHead.jsx`

**The problem:** `SEOHead.jsx` injects the canonical tag twice — once via `react-helmet` (correct) and again via a `useEffect` that calls `setCanonicalTag()` from `seoUtils.js` (wrong). This results in two `<link rel="canonical">` tags on every page, which confuses Google and can cause it to ignore both.

**The fix:** Remove the entire `useEffect` block and the import of the seoUtils functions. Keep the `<Helmet>` return block exactly as-is.

Replace the entire contents of `src/components/SEOHead.jsx` with:

```jsx
import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({ 
  title = "Dream Black Horse - Premium Friesian & Black Horse Sales",
  description = "Discover premium black horses for sale at Dream Black Horse. Browse our collection of Friesian and other quality horses. Expert breeding, sales, and worldwide delivery.",
  canonical = "",
  ogData = {},
  keywords = "black horses for sale, Friesian horses, premium horses, equestrian, horse breeding, Dream Black Horse"
}) => {
  
  const baseUrl = "https://dreamblackhorse.com";
  const canonicalUrl = canonical 
    ? (canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`) 
    : baseUrl;

  const defaultOgData = {
    title,
    description,
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a",
    url: canonicalUrl,
    type: "website",
    site_name: "Dream Black Horse"
  };

  const finalOgData = { ...defaultOgData, ...ogData };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {Object.entries(finalOgData).map(([key, value]) => (
        <meta key={key} property={`og:${key}`} content={value} />
      ))}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgData.title} />
      <meta name="twitter:description" content={finalOgData.description} />
      <meta name="twitter:image" content={finalOgData.image} />
    </Helmet>
  );
};

export default SEOHead;
```

---

## ISSUE 3 — MOVE SUPABASE KEYS TO ENVIRONMENT VARIABLES

**The problem:** `src/lib/customSupabaseClient.js` has the Supabase URL and anon key hardcoded as plain strings. These are being committed to the git repo and are visible to anyone with access. The correct pattern is environment variables.

Replace the entire contents of `src/lib/customSupabaseClient.js` with:

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
```

Then create a `.env.local` file in the project root (this file must NOT be committed to git):

```
VITE_SUPABASE_URL=https://uejmgtfriahdpwwlcfmw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlam1ndGZyaWFoZHB3d2xjZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTI3MTksImV4cCI6MjA4NzY2ODcxOX0.-2296DoiBbmTH4DG9cm1as60DDM-HbyFz4C8j_xQTaM
```

Then check `.gitignore` — confirm it contains `.env.local` and `.env*.local`. If not, add those lines.

**IMPORTANT:** You will also need to manually add these two env vars to the Vercel dashboard after deployment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## ISSUE 4 — ADD `public/robots.txt`

No `robots.txt` currently exists. Googlebot has no crawl guidance.

Create `public/robots.txt`:

```
User-agent: *
Allow: /

# Block admin routes from indexing
Disallow: /admin/
Disallow: /admin/*

Sitemap: https://dreamblackhorse.com/sitemap.xml
```

---

## ISSUE 5 — ADD `public/sitemap.xml`

No sitemap currently exists. Create `public/sitemap.xml` covering all static public routes:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dreamblackhorse.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://dreamblackhorse.com/horses</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dreamblackhorse.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://dreamblackhorse.com/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dreamblackhorse.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://dreamblackhorse.com/reviews</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://dreamblackhorse.com/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://dreamblackhorse.com/terms-policies</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

---

## ISSUE 6 — CLEAN `vite.config.js` (Remove Horizons-Specific Plugins)

**The problem:** `vite.config.js` imports four Hostinger Horizons editor plugins that only work inside the Horizons environment. They are wrapped in `isDev` so they won't break the production build, but they clutter the config and could cause confusion or errors in other environments.

Replace the entire contents of `vite.config.js` with this cleaned version:

```js
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
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
});
```

---

## ISSUE 7 — FIX GOOGLE ANALYTICS PLACEHOLDER IN `src/App.jsx`

**The problem:** `App.jsx` calls `useGoogleAnalytics('G-XXXXXXXXXX')` with a dummy tracking ID. This fires GA initialization with a fake ID on every page load, which pollutes any future GA setup and wastes network requests.

Find this line in `src/App.jsx`:
```js
useGoogleAnalytics('G-XXXXXXXXXX'); 
```

Replace it with an environment variable lookup so you can set the real GA ID later without touching code:
```js
useGoogleAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID || '');
```

Then add this line to `.env.local`:
```
VITE_GA_MEASUREMENT_ID=
```

(Leave the value blank for now. When you have a real GA4 property ID, paste it in here and also set it in Vercel's env dashboard.)

Also update `src/hooks/useGoogleAnalytics.js` — find the initialization block and add a guard so it skips loading GA if the ID is empty:

Find the hook's `useEffect` where it checks `if (!window.gtag)` and wrap the entire block so it only runs when measurementId is a non-empty string starting with 'G-':

```js
if (!measurementId || !measurementId.startsWith('G-')) {
  return; // Skip GA initialization if no valid ID provided
}
```

Add that check as the very first line inside the `useEffect` callback.

---

## VERIFICATION CHECKLIST

After completing all 7 issues, verify:

- [ ] `vercel.json` exists at project root with the rewrite rule
- [ ] `src/components/SEOHead.jsx` no longer imports from `seoUtils.js` and has no `useEffect`
- [ ] `src/lib/customSupabaseClient.js` uses `import.meta.env.VITE_SUPABASE_URL` (no hardcoded strings)
- [ ] `.env.local` exists at project root with the two VITE_ vars
- [ ] `.gitignore` includes `.env.local`
- [ ] `public/robots.txt` exists
- [ ] `public/sitemap.xml` exists
- [ ] `vite.config.js` no longer imports any Horizons plugins
- [ ] `src/App.jsx` no longer has `'G-XXXXXXXXXX'` hardcoded

Then run:
```bash
npm run build
```

The build must complete with zero errors before deploying.

---

## DEPLOYMENT STEPS (Do manually after the code fixes)

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: migrate to Vercel - fix SPA routing, SEO canonicals, env vars, sitemap"
git push origin main
```

### 2. Connect to Vercel
- Go to vercel.com → New Project → Import from GitHub
- Select this repo
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

### 3. Set Environment Variables in Vercel Dashboard
Before the first deploy completes, go to Project Settings → Environment Variables and add:
- `VITE_SUPABASE_URL` = `https://uejmgtfriahdpwwlcfmw.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full anon key)
- `VITE_GA_MEASUREMENT_ID` = *(leave blank or add real ID)*

### 4. Connect Domain (DNS on Hostinger — DO NOT change nameservers)
In Vercel → Project → Settings → Domains, add `dreamblackhorse.com`.
Vercel will show you the IP address to use.

In your Hostinger DNS panel, update ONLY these two records:
- **A record**: `@` → point to the Vercel IP shown in dashboard
- **CNAME record**: `www` → `cname.vercel-dns.com`

Do NOT touch your MX records. Email will keep working.

### 5. Update Supabase Auth Redirect URLs
In your Supabase dashboard → Authentication → URL Configuration, add:
- `https://dreamblackhorse.com`
- `https://dreamblackhorse.com/**`
- `https://www.dreamblackhorse.com`

### 6. Submit to Google Search Console
Once DNS propagates (allow up to 48 hours):
- Add `dreamblackhorse.com` as a property in Google Search Console
- Submit `https://dreamblackhorse.com/sitemap.xml`
- Request indexing on the homepage URL

---

## NOTES

- The admin portal (`/admin/*`) is blocked from indexing via `robots.txt` — this is intentional.
- The `public/.htaccess` file can be left in place — Vercel ignores Apache directives and it won't cause any harm.
- Horse listing pages (`/product/:id`) and blog post pages (`/blog/:slug`) are dynamically routed. Google will crawl them once it follows links from the indexed static pages. If you want them in the sitemap, a future enhancement is a build-time script that queries Supabase and appends those URLs to the sitemap before `vite build` runs.
