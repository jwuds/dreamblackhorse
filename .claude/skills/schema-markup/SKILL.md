---
name: schema-markup
version: 1.0.0
description: Add or fix schema.org structured data (JSON-LD) on the Dream Black Horse site. Use when the user mentions "schema markup", "structured data", "JSON-LD", "rich snippets", "FAQ schema", "Product schema", "Article/BlogPosting schema", "breadcrumbs", or wants rich results. Tailored to this React + react-helmet + Supabase site.
---

# Schema Markup (Dream Black Horse)

You implement accurate schema.org JSON-LD that earns rich results. On this site, JSON-LD is injected via **react-helmet** inside page components (see `src/App.jsx` for the existing LocalBusiness block) or hardcoded in `index.html`.

## Core principles
- **Accuracy first** — only mark up content that actually exists on the page.
- **JSON-LD** in `<head>` via `<Helmet><script type="application/ld+json">`.
- Keep values in sync with the real data (Supabase blog post, Hostinger product).
- Validate in Google's Rich Results Test after deploy.

## What already exists
- **LocalBusiness** — `index.html` and `src/App.jsx` (name, address in Mt Dora FL, email, url). Keep a single source of truth; don't duplicate conflicting copies.

## What to add (by page type)

### 1. Blog posts → `BlogPosting` + `FAQPage`
Add inside `src/pages/BlogPost.jsx` (it already has the `post` object from Supabase). Use real fields: `title`, `excerpt`, `image`, `author`, `published_at`/`updated_at`, slug.

```jsx
<Helmet>
  <script type="application/ld+json">{JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "author": { "@type": "Organization", "name": "Dream Black Horse" },
    "publisher": {
      "@type": "Organization",
      "name": "Dream Black Horse",
      "url": "https://dreamblackhorse.com"
    },
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.updated_at || post.published_at,
    "mainEntityOfPage": `https://dreamblackhorse.com/blog/${post.slug}`
  })}</script>
</Helmet>
```

If `post.faq_items` has entries, add a separate `FAQPage` block:
```jsx
{post.faq_items?.length > 0 && (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": post.faq_items.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer }
      }))
    })}</script>
  </Helmet>
)}
```

### 2. Horse listings → `Product`
Add inside `src/pages/ProductDetailPage.jsx` using the `product` object (Hostinger API: `title`, `description`, `images`, price). Horses are products here.

```jsx
<Helmet>
  <script type="application/ld+json">{JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images?.map(i => i.url),
    "brand": { "@type": "Brand", "name": "Dream Black Horse" },
    "offers": {
      "@type": "Offer",
      "priceCurrency": product.currency?.toUpperCase() || "USD",
      "price": (product.price_in_cents / 100).toFixed(2),
      "availability": product.purchasable
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      "url": `https://dreamblackhorse.com/product/${product.id}`
    }
  })}</script>
</Helmet>
```
Only include `offers.price` when a real price exists; omit fields that aren't present rather than faking them.

### 3. Blog index / breadcrumbs (optional)
`BreadcrumbList` on blog posts and product pages improves SERP display (Home › Blog › Post).

## Implementation flow
1. Confirm the data is present on the page object before referencing it (guard with `&&`).
2. Add the `<Helmet>` JSON-LD block(s) to the component.
3. Run **`npm run deploy`** so the schema is baked into the prerendered HTML (crawlers read it without JS).
4. Verify each type in the **Rich Results Test** and watch Search Console → Enhancements.

## Don't
- Don't mark up content not visible on the page.
- Don't duplicate LocalBusiness on every page — it's already global.
- Don't fake prices, ratings, or review counts. If you add `AggregateRating`/`Review`, it must come from real `/reviews` data.
