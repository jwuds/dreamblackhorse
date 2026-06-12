# CLAUDE.md — Dream Black Horse

This repo is **two things in one**:

1. **The live website** — a React 18 + Vite 4 + React Router + Supabase SPA, **prerendered** at build time and served as static files on **Vercel**.
2. **An SEO content system** — adapted from [TheCraigHewitt/seomachine](https://github.com/TheCraigHewitt/seomachine): slash commands, agents, skills, and `context/` brand files for researching, writing, and optimizing content.

Read this before doing SEO/content or site work.

---

## The website (how it ships)

- **Stack:** React + Vite + React Router v6 + Supabase (auth, blog). Horse listings come from the **Hostinger Ecommerce API** (not Supabase). UI is Tailwind + Radix.
- **Prerendering:** `vite.config.js` enumerates every route — 10 static pages + every horse (`/product/:id`) + every published blog post (`/blog/:slug`) — and snapshots each to real HTML via Puppeteer. Route discovery lives in `tools/getPrerenderRoutes.mjs`. Canonicals are normalized per-route by a `postProcess` step.
- **Deploy model:** Vercel runs **no build** (`vercel.json` skips install/build) and serves the committed `dist/`. So **content is only live for crawlers after a rebuild**.
- **One-command deploy:** `npm run deploy` → rebuilds (re-discovers horses + posts, regenerates `sitemap.xml`), then commits + pushes `dist/` if anything changed.
- **Blog data:** Supabase table `blog_posts`. Key columns: `title, slug, excerpt, content` (markdown), `category` (`care|training|breeding|General`), `status` (`draft|published`), `author, tags[], keywords[], faq_items[], internal_links[], featured_on_home, image, published_at`.

### Golden rule
After creating/editing a blog post or horse, run **`npm run deploy`** or it won't be in the prerendered HTML that Google sees.

---

## The SEO content system

### `context/` — the brand brain (read first for any content task)
Tailored to Dream Black Horse: `brand-voice.md`, `target-keywords.md`, `seo-guidelines.md`, `internal-links-map.md`, `features.md`, `writing-examples.md`. Other files (`style-guide.md`, `competitor-analysis.md`, `cro-best-practices.md`, `ai-citation-targets.md`, `reddit-strategy.md`) are still seomachine **templates** — fill them in as needed.

### `.claude/skills/` (26)
Project skills. **Tailored to this site:** `seo-blog-post`, `seo-audit`, `schema-markup` (these know the Supabase schema, prerender flow, and Hostinger product data — prefer them). The rest are general marketing skills from seomachine (content-strategy, copywriting, programmatic-seo, social-content, the CRO suite, etc.).

### `.claude/commands/` (24) & `.claude/agents/` (11)
Slash-command workflows (`/research`, `/write`, `/optimize`, `/cluster`, `/repurpose`, `/rewrite`, `/article`, the `landing-*` and `research-*` family) and specialized agents (seo-optimizer, editor, meta-creator, internal-linker, keyword-mapper, cluster-strategist, etc.).

### Content workflow directories
`topics/ research/ drafts/ published/ rewrites/ review-required/ landing-pages/ audits/ repurposed/ output/` — scratch space the commands read/write during the content lifecycle.

### `data_sources/` + root `*.py`
Optional Python analytics layer (keyword/SERP/competitor research). **Not installed.** Needs GA4 + Search Console + DataForSEO API keys and `pip install -r data_sources/requirements.txt` to run. The writing/SEO skills work fine without it.

---

## Important adaptations from stock seomachine

- **Publishing target is Supabase, NOT WordPress.** The `/publish-draft` command and `wordpress/` dir assume a WordPress REST API — they do **not** apply here. To publish: insert/update the `blog_posts` row (admin editor at `/admin/blog/new` or Supabase), set `status = published`, then `npm run deploy`. The `seo-blog-post` skill outputs the exact fields + a SQL insert.
- **Context lives at root `context/`** (commands reference `@context/...`), tailored for Dream Black Horse.
- Prefer the 3 site-tailored skills over the generic equivalents for anything touching this codebase.

## Typical content flow
1. `/research friesian horse for beginners` (or invoke `seo-blog-post` directly)
2. Draft with `seo-blog-post` → get the full `blog_posts` record
3. Add structured data via `schema-markup` if desired
4. Publish to Supabase, set `status = published`
5. `npm run deploy`
6. Request indexing in Google Search Console
