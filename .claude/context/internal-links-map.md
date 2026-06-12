# Dream Black Horse — Internal Links Map

Canonical anchors and destinations for internal linking. Every blog post should link to the relevant commercial page + 1–2 related posts. Use descriptive anchor text (never "click here").

## Core destinations
| Purpose | URL | Example anchor text |
|---|---|---|
| Browse all horses (money page) | `/horses` | "browse our available Friesian horses", "horses for sale" |
| Specific horse listing | `/product/{id}` | the horse's name, e.g. "meet Olivier" |
| About / story / team | `/about` | "about Dream Black Horse", "our breeding program" |
| Contact / inquiries | `/contact` | "contact our team", "ask us about availability" |
| Reviews / testimonials | `/reviews` | "what our buyers say" |
| Blog index | `/blog` | "more guides on the blog" |

## Rules
- Internal links must be **root-relative** (`/horses`, not `https://dreamblackhorse.com/horses`).
- The `blog_posts.internal_links` JSONB field can store these as `[{ "text": "...", "url": "/horses" }]`.
- Don't link to admin/auth routes (`/admin/*`, `/login`, `/signup`) — they're noindex.
- Product IDs change as inventory turns over; when linking to a specific horse, confirm the `/product/{id}` still resolves (it's pulled live from the Hostinger store).

## Existing blog posts (link new posts to relevant ones)
- `/blog/why-choose-dream-black-horse-farm-to-buy-your-friesian-horse`
- `/blog/friesian-vs-morgan-horse`
- `/blog/shipping-horses-internationally-friesian-import-guide`
- `/blog/kfps-friesian-horses-breeding-dressage`
- `/blog/from-roblox-to-reality`
- `/blog/friesian-horse-for-beginners` *(note: live slug currently has a leading hyphen — fix in admin)*

Keep this list current as posts are added.
