# Dream Black Horse — SEO Guidelines

House rules for any on-page SEO work. This site is a **prerendered** React SPA on Vercel (see CLAUDE/migration docs): static routes + every horse + every blog post are snapshotted to real HTML at build time.

## Titles (`<title>` / blog `title`)
- 50–60 characters. Front-load the primary keyword.
- Pattern for blog: `{Primary Keyword / Question} | Dream Black Horse`.
- Unique per page. No duplicate titles across routes.

## Meta descriptions (blog `excerpt` feeds these)
- 140–160 characters, active voice, include the primary keyword once, end with a soft CTA.
- Written for click-through, not keyword stuffing.

## Slugs (`blog_posts.slug`)
- Lowercase, hyphen-separated, **no leading/trailing hyphen**, no stop-word noise.
- Derive from the primary keyword: `friesian-horse-for-beginners`.
- ⚠️ Known issue: one live slug starts with a hyphen (`-friesian-horse-for-beginners`). Never generate slugs with a leading hyphen.

## Headings
- Exactly one `<h1>` (the post title). Logical `h2`/`h3` nesting.
- Put question-style long-tails in `h2`s (matches voice search + FAQ schema).

## Content
- Target depth that fully answers intent (commonly 1,000–1,800 words for informational posts). Quality over padding.
- Demonstrate E-E-A-T: buying a horse is high-stakes — be accurate, cite realistic figures, avoid health/outcome guarantees.
- Every post: link to `/horses` (or a specific `/product/:id`) + 1–2 related posts (see [internal-links-map.md](internal-links-map.md)).
- Add 3–6 FAQ items (`blog_posts.faq_items`) → powers FAQ rich results (see schema-markup skill).

## Images
- Always set descriptive `alt` text including the subject (e.g. "black Friesian mare standing in a Florida pasture").
- Use the post `image` field for the social/OG image.

## Canonical & meta
- Per-route canonical is injected at build time by `vite.config.js` `postProcess` — do **not** hardcode canonicals in components or `index.html`.
- Per-page `<title>`/description come from `SEOHead`/react-helmet.

## Publishing & deploy (critical)
A new/edited blog post is NOT visible to crawlers until the site is rebuilt:
1. Create/edit the post (admin blog editor at `/admin/blog/new`, or insert into Supabase `blog_posts`).
2. Set `status` = `published`.
3. Run **`npm run deploy`** → re-discovers the post, prerenders `/blog/{slug}`, regenerates `sitemap.xml`, commits & pushes `dist/`. Vercel serves it.
4. (Optional) Request indexing in Google Search Console for the new URL.

## Don't
- No hidden text, doorway pages, or keyword stuffing.
- No duplicate canonicals (the migration specifically fixed this).
- Don't index admin/auth/checkout routes (already disallowed in `robots.txt`).
