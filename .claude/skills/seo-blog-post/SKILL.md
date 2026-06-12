---
name: seo-blog-post
version: 1.0.0
description: Research, write, and prepare an SEO-optimized blog post for the Dream Black Horse site. Use when the user wants to "write a blog post", "create an article", "draft a blog", "publish content", or asks for SEO content about Friesian/black horses, breeding, buying, shipping, or horse care. Outputs a complete blog_posts record ready for the Supabase admin editor, then guides the prerender deploy.
---

# SEO Blog Post (Dream Black Horse)

You write long-form, SEO-optimized blog content for Dream Black Horse and prepare it to publish into the Supabase `blog_posts` table, then prerender via `npm run deploy`.

## Step 0 — Load context
Read these first (don't ask for info they already contain):
- `context/brand-voice.md` — how to sound
- `context/target-keywords.md` — what to target
- `context/seo-guidelines.md` — titles/slugs/length/deploy rules
- `context/internal-links-map.md` — where to link

## Step 1 — Clarify the brief (only what's missing)
- **Primary keyword / topic** (one). If the user is vague, propose 3 options from target-keywords.md.
- **Search intent**: informational, comparison, or commercial?
- **Audience**: beginner buyer vs experienced equestrian.
- **Category**: one of `care`, `training`, `breeding`, or `General` (matches existing posts).
- Any specific horse(s) or angle to feature.

## Step 2 — Outline
- One H1 (the title). 4–8 H2 sections; use question-form H2s for long-tails.
- Plan internal links: the relevant commercial page (`/horses` or a `/product/:id`) + 1–2 related posts.
- Plan 3–6 FAQ items (these become both an on-page FAQ section and FAQ schema).

## Step 3 — Write
- Brand voice: expert, trustworthy, warm, premium-but-approachable.
- Length: usually 1,000–1,800 words; depth that fully satisfies intent. No padding.
- Markdown body (the `content` column is rendered with `marked`). Use `##`/`###`, lists, bold, and markdown links `[anchor](/horses)`.
- Primary keyword in: title, first ~100 words, at least one H2, naturally throughout (no stuffing).
- Accurate and honest — realistic price/shipping ranges, no health/competition guarantees (this is a high-stakes purchase).
- End with a soft CTA linking to `/horses` or `/contact`.

## Step 4 — Produce the full `blog_posts` record
Output every field so it can be pasted into the admin editor or inserted via SQL:

| Field | How to fill |
|---|---|
| `title` | 50–60 chars, `Keyword/Question \| Dream Black Horse` |
| `slug` | lowercase, hyphenated, **no leading/trailing hyphen**, from primary keyword |
| `excerpt` | 140–160 char meta description, primary keyword once, soft CTA |
| `content` | full markdown article |
| `category` | `care` \| `training` \| `breeding` \| `General` |
| `author` | ask, or default to "Dream Black Horse Team" |
| `status` | `draft` first; `published` when approved |
| `tags` | array, 3–6 relevant tags |
| `keywords` | array, primary + long-tails targeted |
| `faq_items` | array of `{ "question": "...", "answer": "..." }` (3–6) |
| `internal_links` | array of `{ "text": "...", "url": "/horses" }` |
| `featured_on_home` | `false` unless the user wants it on the homepage |
| `image` | a relevant image URL (ask or suggest a placeholder) |

Also output a ready-to-run **SQL insert** (Supabase SQL editor) as an alternative to the admin UI.

## Step 5 — Publish & deploy (always state this)
A post is invisible to crawlers until rebuilt:
1. Add it via **/admin/blog/new** (paste fields) OR run the SQL insert in Supabase.
2. Set `status` = `published`.
3. Run **`npm run deploy`** → prerenders `/blog/{slug}`, updates `sitemap.xml`, commits + pushes `dist/`.
4. Suggest requesting indexing in Google Search Console for the new URL.

## Quality checklist (verify before handing off)
- [ ] Unique 50–60 char title; clean slug (no leading hyphen)
- [ ] 140–160 char excerpt with primary keyword + CTA
- [ ] One H1, logical H2/H3, question-form H2s
- [ ] Primary keyword in title, intro, ≥1 H2; natural density
- [ ] Links to `/horses` or a `/product/:id` + 1–2 related posts
- [ ] 3–6 FAQ items
- [ ] On-brand voice; accurate, no guarantees
- [ ] Deploy reminder included

For structured data on the post (BlogPosting/FAQ), hand off to the `schema-markup` skill.
