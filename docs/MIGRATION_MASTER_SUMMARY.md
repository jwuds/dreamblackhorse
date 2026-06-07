# TITAN STABLES — FULL SEO MIGRATION MASTER SUMMARY
## Everything we did, why we did it, and how to replicate it for another site

---

## THE PROBLEM (what was broken)

The site was built on **Hostinger Horizons** — an AI visual site builder that outputs
a **Vite + React Single Page Application (SPA)**. This means:

- The server sends one near-empty HTML file: `<div id="root"></div>` + a JS bundle
- All visible content (headings, text, horse listings, navigation) is injected by
  JavaScript AFTER the browser loads
- Search engine crawlers (Googlebot, Bing) that don't execute JS see a blank page
- Result: Google indexed the URLs but found no content → showed
  "We cannot provide a description for this page" in search results
- `site:titanstables.org` returned essentially zero results
- Organic traffic was dead

### Compounding bug: .com/.org split-brain domain
Six source files still hardcoded `titanstables.com` (wrong domain) while the correct
domain is `titanstables.org`. This meant:
- JSON-LD structured data pointed Google at the wrong domain
- Blog post canonicals pointed at .com
- ReviewsPage had hardcoded .com canonical AND og:url
- IndexNow integration was broadcasting .com to search engines
- Google received contradictory canonical signals → indexed neither domain confidently

### Compounding bug: global canonical tag
Every page — homepage, contact, listings, all of them — output the same canonical:
`<link rel="canonical" href="https://titanstables.org">`
This explicitly tells Google every subpage is a duplicate of the homepage.
Subpages and horse listings were being de-indexed as duplicates.

---

## THE DIAGNOSIS TOOLS WE USED

1. **web_fetch on the live site** — confirmed the raw HTML body was empty (no content
   visible without JS execution)
2. **`site:titanstables.org` Google search** — confirmed near-zero indexing
3. **grep across the codebase** — found all .com/.org contaminated files
4. **View Page Source** (right-click → View Page Source, NOT Inspect) — the browser
   test that shows what crawlers actually receive. Ctrl+F for real content words.
5. **Google Search Console URL Inspection** — shows exactly what Googlebot fetched
   and rendered for any given URL

---

## THE SOLUTION

### Why Hostinger couldn't fix it
Hostinger Horizons controls the server rendering layer. No matter what SEO code you
add inside the React app, it all runs client-side in the browser — crawlers never
see it. The rendering model is baked into the platform. Cannot be fixed from inside
Horizons.

### The fix: prerendering + Vercel deployment

**Prerendering** = at build time, a headless browser visits every route, captures
the fully-rendered HTML, and saves it as static .html files. Crawlers fetch these
files and see complete content. Users still get the React app. Same codebase —
just a different build output.

Tool used: **@prerenderer/rollup-plugin + @prerenderer/renderer-puppeteer**
(runs Puppeteer/Chromium locally at build time to snapshot each route)

**Vercel** = static file host that serves the pre-built dist/ folder directly.
No server-side build needed on Vercel — we build locally and commit dist/.

---

## EVERYTHING WE CHANGED (file by file)

### Domain rot fixes (.com → .org)
| File | What changed |
|---|---|
| `src/lib/schema.js` | 5 occurrences of titanstables.com → .org |
| `src/lib/indexnow.js` | SITE_URL and host fields → .org |
| `src/components/SocialShare.jsx` | fullUrl construction → .org |
| `src/pages/ReviewsPage.jsx` | canonical and og:url hardcodes → .org |
| `src/pages/BlogPostPage.jsx` | canonical URL fallback → .org |
| `src/lib/blogSeoUtils.js` | 4 occurrences → .org |

Note: `src/lib/canonicalUrl.js` kept its .com references intentionally —
that file contains the redirect logic that sends .com → .org visitors.

### Prerender installation
```bash
npm install --save-dev @prerenderer/rollup-plugin @prerenderer/renderer-puppeteer puppeteer ajv@^8
```

### vite.config.js
Added @prerenderer/rollup-plugin to the Vite plugins array with a list of
26 static routes to prerender. Dynamic routes (/horses/:id) excluded —
data is live from Supabase so can't be prerendered at build time without DB access.

Static routes prerendered:
/, /about, /contact, /policies, /faq, /horses, /horses/available, /horses/sold,
/horses/breeding, /services, /services/training, /services/boarding,
/services/breeding, /blog, /blog/care, /blog/training, /blog/breeding,
/locations, /gallery, /facility, /testimonials, /reviews, /store,
/request, /own-a-titan, /sitemap

Routes NOT prerendered (intentional):
/admin/*, /admin-login, /auth/*, /checkout, /success, /reserve, /reservation,
any dynamic :id/:slug routes

### index.html
Replaced bare shell with enriched version containing:
- Proper title, meta description, canonical
- OG tags and Twitter card tags
- Geo meta tags (ICBM, geo.position, geo.region, geo.placename)
- JSON-LD LocalBusiness schema with real address, phone, coordinates
- Google Fonts preconnect
- <noscript> fallback block with real text content and navigation links
  (this is what crawlers that don't execute JS at all will see)

### public/robots.txt
Replaced with clean version:
- Allow: / for all bots
- Disallow: /admin/, /admin-login, /auth/, /checkout, /success
- Sitemap reference pointing to https://titanstables.org/sitemap.xml

### public/sitemap.xml
Generated clean sitemap with:
- All 26 static routes
- Priority 1.0 for homepage, 0.9 for horses/available, 0.8 for key pages
- changefreq: weekly for horses, monthly for everything else
- lastmod set to migration date

### .gitignore
Removed all three dist/ exclusions (bare `dist`, `dist-ssr`, `dist/`) so the
pre-built output gets committed to the repo and served directly by Vercel.

### vercel.json
Replaced entirely. Key changes:
- Removed buildCommand, installCommand, framework (Vercel runs no build)
- outputDirectory: dist (serves pre-built files directly)
- Kept all security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- Kept asset caching rules (1 year immutable for /assets/*)
- Kept SPA rewrite (/* → /index.html for client-side routing)
- Removed broken /admin-login self-redirect

### src/components/SeoHead.jsx (filename fix)
- Original file was SEOHead.jsx (capital SEO)
- AdminPage.jsx and AdminFAQDashboard imported it as SeoHead (different casing)
- Works on Windows (case-insensitive filesystem) but fails on Vercel's Linux
- Fix: renamed SEOHead.jsx → SeoHead.jsx, updated 4 other importers to match
- This is the classic Windows-to-Linux case sensitivity trap

---

## DEPLOYMENT ARCHITECTURE

```
Local machine (Windows)
    ↓ npm run build (runs Puppeteer, generates 26 prerendered index.html files)
    ↓ git commit (including dist/ folder)
    ↓ git push

GitHub repo: github.com/jwuds/titan-stables (private)
    ↓ Vercel auto-deploys on push

Vercel
    - No build command (echo "using pre-built dist")
    - No install command (echo "skip install")  
    - Output directory: dist
    - Serves pre-built static files directly
    - Environment variables set in Vercel dashboard (never in committed files)

DNS (still on Hostinger — domain NOT transferred)
    - A record @ → 76.76.21.21 (Vercel)
    - CNAME www → cname.vercel-dns.com
    - MX records UNTOUCHED (email preserved)
```

---

## ENVIRONMENT VARIABLES

Set in Vercel dashboard under Settings → Environment Variables:
```
VITE_SUPABASE_URL        = your Supabase project URL
VITE_SUPABASE_ANON_KEY   = your Supabase anon public key
VITE_DOMAIN              = https://titanstables.org
```

Never committed to the repo. .env and .env.production are gitignored.

---

## VERIFICATION METHOD

After deploy, the proof that it worked:

1. Open the live site URL in browser
2. Right-click → View Page Source (NOT Inspect/DevTools)
3. Ctrl+F → search for real content words (horse names, city name, business name)
4. If those words appear multiple times in the raw HTML → crawlers can read the site
5. `site:yourdomain.com` in Google → pages should start appearing within days

Result for titanstables.org: web_fetch now returns full homepage content including
horse names (Aujke, Queran, Nyke), all navigation, footer, contact info, service
descriptions — without executing any JavaScript.

---

## KNOWN REMAINING ISSUES (Phase 3)

### 1. Non-unique titles/meta per page
Puppeteer snapshots the DOM before react-helmet-async finishes updating <title>.
Result: 16 pages share the static index.html title, 10 share a generic fallback.
Body content is unique and indexable — this is a titles/descriptions polish issue.

Fix (Phase 3): add renderAfterTime delay to prerenderer config in vite.config.js:
```javascript
new PrerenderSPAPlugin({
  // existing config...
  renderer: new Renderer({
    renderAfterTime: 3000  // wait 3s for Helmet to update DOM
  })
})
```

### 2. FOUC (Flash of Unstyled Content / blinking)
Prerendered HTML loads instantly → React boots → re-renders → brief visual flicker.
Does not affect SEO. Cosmetic only.

Fix (Phase 3): add to index.html <head>:
```html
<style>
  #root:empty { visibility: hidden; }
</style>
```

### 3. Dynamic horse listing pages
Individual horse pages (/horses/:id with Supabase UUID) are not prerendered.
Google will index the URLs via internal links but body content depends on JS render.
Long-term fix: Supabase API call at build time to fetch all horse IDs, generate
static routes for each listing. Requires a build script addition.

### 4. Bundle size warning
Main JS chunk is 634kB (195kB gzipped) — over Vite's 500kB advisory limit.
Pre-existing issue, not introduced by migration. Fix via code splitting in vite.config.js.

---

## HOW TO REPLICATE THIS FOR ANOTHER SITE

### Prerequisites checklist
- [ ] Site is a Vite + React SPA (check package.json for "vite" and "react")
- [ ] Source code exported from Hostinger (zip download)
- [ ] Node.js installed locally (v18+)
- [ ] Git installed locally
- [ ] GitHub account
- [ ] Vercel account (connect with GitHub)
- [ ] Domain DNS accessible (doesn't need to leave current registrar)

### Step 1 — Audit the codebase
```bash
# Check for domain rot
grep -rn "yourdomain.com" src --include=*.jsx --include=*.js
grep -rn "yourdomain.org" src --include=*.jsx --include=*.js

# Check all routes
grep -n "Route path" src/App.jsx

# Check what data is local vs Supabase
ls src/data/
```

### Step 2 — Fix domain rot
Surgical find-and-replace in affected files only.
Leave any redirect logic files that intentionally reference both domains.

### Step 3 — Install prerender
```bash
npm install --save-dev @prerenderer/rollup-plugin @prerenderer/renderer-puppeteer puppeteer ajv@^8
```

### Step 4 — Update vite.config.js
Add prerender plugin with your site's static route list.
Exclude: admin, auth, checkout, dynamic :id/:slug routes.

### Step 5 — Enrich index.html
Add: title, meta description, canonical, OG tags, JSON-LD LocalBusiness schema,
<noscript> content block with real text and navigation links.

### Step 6 — Update robots.txt and sitemap.xml
robots.txt: allow all, disallow admin/auth/checkout, reference sitemap URL.
sitemap.xml: all public static routes with priorities and changefreq.

### Step 7 — Fix .gitignore
Remove dist/, dist-ssr, and bare dist entries so pre-built files get committed.

### Step 8 — Update vercel.json
Remove build/install commands. Keep outputDirectory: dist. Keep SPA rewrite.

### Step 9 — Fix case sensitivity (Windows → Linux)
```bash
# Find all components imported under different casings
grep -rn "import.*from.*components" src --include=*.jsx | sort | uniq
# Rename files to match imports, update all importers
```

### Step 10 — Build locally
```bash
npm run build
# Verify dist/ has one folder per route, each with real HTML content
cat dist/about/index.html | grep "YourBrandName" | wc -l  # should be > 1
```

### Step 11 — Commit including dist/
```bash
git add .
git status  # verify dist/ included, .env NOT included
git commit -m "feat: prerender setup + SEO fixes"
git push
```

### Step 12 — Deploy to Vercel
- Framework: Other
- Build command: echo "using pre-built dist"
- Install command: echo "skip install"
- Output directory: dist
- Add env vars in dashboard

### Step 13 — DNS switch (domain stays at registrar)
- A record @ → 76.76.21.21
- CNAME www → cname.vercel-dns.com
- Never touch MX records

### Step 14 — Verify
- View Page Source → Ctrl+F for brand name → should appear in raw HTML
- Submit sitemap to Google Search Console
- Request indexing on 5 key pages

---

## TIME INVESTMENT (approximate)
- Diagnosis: 30 min
- Domain rot fix: 30 min
- Prerender setup + vite.config: 1 hour
- index.html enrichment: 30 min
- Build, debug, git setup: 1-2 hours
- Vercel deploy + DNS: 30 min
- Total: ~4-5 hours for a clean migration

---

## TOOLS / SERVICES USED
- Vite + React (existing stack, unchanged)
- @prerenderer/rollup-plugin (build-time prerendering)
- @prerenderer/renderer-puppeteer (headless Chrome for snapshots)
- Vercel (static hosting, free Hobby tier)
- GitHub (repo hosting, free)
- Hostinger (domain stays here, DNS only change)
- Google Search Console (indexing verification and submission)
- Supabase (database, unchanged — env vars moved to Vercel dashboard)
