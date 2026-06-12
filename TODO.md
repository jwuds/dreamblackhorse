# Dream Black Horse — Pending Items

## Blocked on owner input

These 4 items are code-ready but need real data before they can go live.
Reply with the info and they ship in the next deploy.

---

### 1. Phone number
**Phase 1.6** — Contact page and Footer both have address + email but no phone number.
A $30k–$45k buyer needs to call. A missing number costs you sales.

> Provide: a real `tel:` number (e.g. `+1 (352) 555-0199`)
> Will update: `src/components/Footer.jsx` + `src/pages/Contact.jsx`

---

### 2. Social media URLs
**Phase 1.3** — Instagram, Facebook, and Twitter icons were removed because they linked to `href="#"`.
The "Connect" column in the Footer currently shows only an email icon.

> Provide: any real profile URLs you have (one, two, or all three):
> - `https://instagram.com/...`
> - `https://facebook.com/...`
> - `https://x.com/...`
>
> Will restore the icons with real links.

---

### 3. Real buyer testimonials
**Phase 1.4** — The Reviews page (`/reviews`) is fully built and shows a graceful empty state.
No fake reviews will be added — these need to be real.

> Provide: 3–5 testimonials in this format:
> ```
> Name: Sarah M., Texas
> Quote: "We flew in from Dallas to meet Nouska and she was everything described..."
> Stars: 5
> (optional) Horse purchased: Nouska
> ```
> Will insert via Supabase admin or direct SQL.

---

### 4. Verify the 15% discount badge
**Phase 1.1 follow-up** — Every horse detail page shows a green badge:
*"15% Discount Applied at Checkout — Automatic savings on your purchase"*

This badge is hardcoded in `src/pages/ProductDetailPage.jsx` (line 268–274).
If checkout doesn't actually apply a 15% discount, this is a false claim on a $40k sale.

> Answer: **Is this discount real?**
> - **Yes** → leave it (verify it works in Hostinger checkout)
> - **No** → I'll remove it in the next deploy

---

*Once any item above is provided, it ships independently — no need to wait for the others.*
