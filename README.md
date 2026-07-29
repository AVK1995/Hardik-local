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
app/content.js          ← ALL copy. Edit here, never in the markup.
app/globals.css         ← the SDP skin. PART 1 = theme (swap per client)
                          PART 2 = component design (never changes)
app/landing.css         ← landing beat layout
app/funnel-pages.css    ← checkout / book / thank-you
app/components/         ← CTA lockup, VSL frame, FAQ, sticky, check-in wall, icons
public/proof/           ← normalised asset copies (originals untouched)
```

## Re-branding to Hardik's palette

Edit **only** the `.sdp-root` token block at the top of `app/globals.css`:

- `--brand` (keep `--brand-rgb` in sync), `--brand-bright`, `--brand-deep`
- the neutrals, if the brand is warm/dark rather than cool/light
- the two font vars in `app/layout.js`
- if the new accent is LIGHT (gold / brass / lime), override `--cta-ink` to a dark ink

Do not touch Part 2. Anatomy, spacing, radii, motion, states and the light/dark
band rhythm stay identical — that is what makes it "SDP design" rather than
"SDP colours".

## Environment (`.env.local`)

| Var | Purpose | Status |
|---|---|---|
| `NEXT_PUBLIC_VSL_URL` | the VSL mp4 / embed | empty → frame shows poster + pending badge |
| `NEXT_PUBLIC_VSL_POSTER` | poster frame | defaults to Hardik's portrait |
| `NEXT_PUBLIC_PAYMENT_URL` | Rs 97 payment link | empty → form shows a missing marker |
| `NEXT_PUBLIC_CALENDAR_EMBED_URL` | scheduler iframe | empty → branded loading placeholder |
| `NEXT_PUBLIC_COUNTDOWN_HOURS` | CTA urgency timer | `5` |

## Still outstanding

Search the codebase for `MISSING` — every gap is a named constant in
`app/content.js` and renders as a visible placeholder, never as invented copy.
