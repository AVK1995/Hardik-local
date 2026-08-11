# Project Alpha Wellness — VSL Funnel

Built to the TGO doctrine: NO-BRAINER 13-beat VSL copy skeleton, SHAPE VSL FUNNEL
BLUEPRINT, SDP Clinical Blue skin (default token block).

## Run it

```bash
npm install
npm run dev      # you preview — the build never self-runs a server
```

## Routes

| Route | Beat coverage |
|---|---|
| `/` | Landing — beats 0–12 |
| `/checkout` | Rs 97 order-summary checkout (R11 + §13 price reframe) |
| `/book` | Call-agenda ledger + scheduler embed |
| `/thank-you` | Success seal + next-steps ledger (R12) |

## Where things live

```
src/app/                ← App Router: one folder per route, plus layout.js and the
                          icon/manifest metadata files Next resolves by convention
src/components/         ← CTA lockup, VSL frame, FAQ, sticky, check-in wall, icons
src/hooks/              ← useReveal
src/lib/content.js      ← ALL copy. Edit here, never in the markup.
src/styles/globals.css  ← the SDP skin. PART 1 = theme (swap per client)
                          PART 2 = component design (never changes)
src/styles/landing.css       ← landing beat layout
src/styles/funnel-pages.css  ← checkout / book / thank-you
public/proof/           ← normalised asset copies (originals untouched)
docs/                   ← source documents (strategy, case studies, VSL script, ICP)
```

Everything under `src/` is imported through the `@/` alias (`@/lib/content`,
`@/components/Faq`, `@/styles/globals.css`) — mapped in `jsconfig.json`, so no
file ever climbs out with `../..`.

> `docs/` is deliberately **outside** `public/`. Anything under `public/` is served
> at a public URL once deployed, and the strategy document is marked Confidential.
> Do not move it back.

## Re-branding to Hardik's palette

Edit **only** the `.sdp-root` token block at the top of `src/styles/globals.css`:

- `--brand` (keep `--brand-rgb` in sync), `--brand-bright`, `--brand-deep`
- the neutrals, if the brand is warm/dark rather than cool/light
- the two font vars in `src/app/layout.js`
- if the new accent is LIGHT (gold / brass / lime), override `--cta-ink` to a dark ink

Do not touch Part 2. Anatomy, spacing, radii, motion, states and the light/dark
band rhythm stay identical — that is what makes it "SDP design" rather than
"SDP colours".

## Environment (`.env.local`)

| Var | Purpose | Status |
|---|---|---|
| `NEXT_PUBLIC_VSL_URL` | the VSL mp4 / embed | empty → frame shows poster + pending badge |
| `NEXT_PUBLIC_VSL_POSTER` | poster frame | defaults to Hardik's portrait |
| `NEXT_PUBLIC_CALENDAR_EMBED_URL` | scheduler iframe | empty → branded loading placeholder |
| `NEXT_PUBLIC_COUNTDOWN_HOURS` | CTA urgency timer | `5` |
| `NEXT_PUBLIC_SITE_URL` | production origin | defaults to `https://vsl.alphawellnessproject.com` |
| `NEXT_PUBLIC_ASSESSMENT_FEE` | fee in rupees | `97`. Set to `1` for a live test payment with all tracking gated off |
| `RAZORPAY_KEY_ID` / `_SECRET` | server SDK | required, else checkout returns a configuration error |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | browser modal | required |
| `RAZORPAY_WEBHOOK_SECRET` | HMAC verification | required, else every webhook 500s and no lead is recorded |
| `PABBLY_WEBHOOK_URL` | CRM row | empty → `pabbly:"skipped"`, payment still succeeds |
| `META_PIXEL_ID` / `META_CAPI_ACCESS_TOKEN` | server CAPI | empty → `capi:"skipped"` |
| `NEXT_PUBLIC_META_PIXEL_ID` | browser PageView + MAM | empty → no pixel |
| `NEXT_PUBLIC_GA4_ID` | GA4 | empty → no GA4 |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity | empty → no Clarity |

See [.env.example](.env.example) for the annotated list.

## Tracking

Three independent systems, documented at the top of the files that own them:

- **Meta** — server-side CAPI only ([src/lib/meta-capi.js](src/lib/meta-capi.js)). The
  dataset is health-categorised, so **no standard event name is ever used**:
  the conversion is `sales`, intent is `atc_event` / `ic_event`. The browser
  fires `PageView` and Advanced Matching, nothing else. Read the header block
  in that file before changing any event.
- **GA4** — four count-only events, once per browser
  ([src/lib/ga4.js](src/lib/ga4.js)): `video_play`, `add_to_cart`,
  `initiate_checkout`, `book_call`. No values, no revenue, deliberately not
  reconcilable against Meta.
- **Clarity** — session recording, no custom events.

All three are gated to the production host. To exercise them locally, run
`localStorage.setItem('apw_tracking_debug', '1')` in the console and reload.

The Razorpay **webhook** at `/api/razorpay/webhook` — not the browser — is the
sole tracking authority for a completed payment, so UPI payers who never
return to the tab are still recorded.

## Still outstanding

Search the codebase for `MISSING` — every gap is a named constant in
`src/lib/content.js` and renders as a visible placeholder, never as invented copy.
