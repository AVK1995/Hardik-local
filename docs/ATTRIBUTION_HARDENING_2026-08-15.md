# Attribution Hardening — 2026-08-15 revision (L1–L7)

> **Status:** implemented and verified in `Trainer-Goes-Online/Hardik` (Project Alpha Wellness).
> **Applies to:** every funnel using `META_TRACKING_AGENT_GUIDE.md`, `META_CAPI_SOP_VSL.md`
> (or `_WEBINAR`), and `RAZORPAY_WEBHOOK_MIGRATION.md`.
>
> This document is written as a **patch set**, not a fork. Those three guides exist in
> several sibling projects and forking a fourth copy would make the canonical-copy
> problem worse. Each section below names the target document, the section to replace,
> and the exact replacement text.

---

## 0. Why this revision exists — the post-mortem

**Lead `pay_TPvkniUArkCDLM`, 2026-08-15, Project Alpha Wellness.** First paid lead from a
live ad. The Razorpay notes arrived like this:

```
utm : {"s":"","m":"","c":"","n":"","t":""}     ← every field blank
clid: ""                                       ← no fbclid
ts  : ""                                       ← no click time
rf  : https://vsl.alphawellnessproject.com/?utm_source=Facebook_Mobile_Reels&…  ← FULL ad URL
lu  : https://vsl.alphawellnessproject.com/checkout
fbc : fb.1.1786771769851.IwcGRvZgVmZGlk…       ← Meta's cookie, intact
```

Only the `referrer` note told us the sale came from an ad at all.

### The deduction

1. `lu` = `/checkout` and `rf` = the landing URL. `landing_url` is first-touch — written
   once, only when storage is empty. It says `/checkout`, so **the first-touch block ran
   for the first time on the checkout page**. Nothing was stored before that.
2. `_fbc` was present. It can only be created on a page whose URL carried `fbclid` (the
   landing page), and `fbevents.js` writes it via `document.cookie`. It survived the hop.
   **So JS-written cookies do persist landing → checkout.**
3. Therefore, had the capture run on the landing page, its cookie would have survived too.

**⟹ the capture never completed on the landing page.**

### The mechanism — a fatal asymmetry

| | How it loads | Result |
|---|---|---|
| Meta pixel | `next/script` `afterInteractive` — a **raw script tag**, independent of React | ✅ ran |
| `captureParams()` | a **React `useEffect`** — runs only after the whole tree hydrates | ❌ did not |

Stack the conditions: a heavy landing page (VSL player, carousels, dozens of images), the
**Facebook iOS in-app browser** on mobile, and a CTA that is a plain `<a href="/checkout">`
— an instant real navigation that cancels every pending script.

**He tapped the CTA before React hydrated.** The pixel had already fired; our capture had not.

> **The lesson, generalised:** *any* attribution capture that lives only in client-side JS
> has a floor on its reliability set by hydration speed on the slowest device class you
> buy traffic on. It cannot be made 100% by improving the JS. It has to move to the server.

### The second, hidden defect

`rf` came in at **exactly 256 characters** — it hit Razorpay's per-note cap. The `fbclid`
inside it was **49 chars; the real one is 195**. The UTMs survived only because they sit
*before* `fbclid` in the query string.

**⟹ `referrer` is a valid fallback for `utm_*` but NEVER for `fbclid`.** The complete
fbclid was in `_fbc` all along, because `_fbc` is literally `fb.1.<clickTs>.<fbclid>`.

### The third, latent defect (found while fixing the above)

`create-order` built its notes as `truncate(JSON.stringify({...}), 256)`. On a campaign
name long enough to push the blob past 256, that slices **mid-JSON**, the webhook's
`JSON.parse` throws, and the defensive `catch` returns `{}` — losing **every** UTM field at
once instead of clipping one. Verified: a realistic Advantage+ campaign name produces a
335-char blob → invalid JSON.

---

## 1. The layered design (L1–L7)

Nothing is literally 100%. This moves the failure mode from *"one React effect must win a
race against a link tap"* to *"the server saw the query string"*.

| Layer | What | Fixes |
|---|---|---|
| **L1** | **Middleware capture at the edge** — reads the query string server-side on the first request, before any HTML or JS | the hydration race |
| **L2** | **Server reads the cookie**, client body is a supplement | client is off the critical path |
| **L3** | **Reconstruct `utm_*` from `referrer`** | blank-UTM rows |
| **L4** | **Derive `fbclid` + click-ts from `_fbc`** | truncated/absent fbclid |
| **L5** | **JSON-safe note packing** | total UTM loss on long campaigns |
| **L6** | **Webhook-side repair + provenance** | old orders, silent regressions |
| **L7** | **`attribution_source` column** | you learn from an alert, not from lead #1 |

**Precedence, per field:** `URL → cookie → body → referrer → _fbc → none`
(`referrer` is skipped for `fbclid`; `_fbc` is the only complete source.)

---

## 2. Reference implementation

Two new files. Both are in the Hardik repo and are drop-in for any Next.js App Router funnel.

- **`src/lib/attribution.js`** — pure JS (Edge-safe, no `node:crypto`): `parseAttributionFromUrl`,
  `parseFbc`, `readAttrCookie`, `mergeAttribution`, `resolveAttribution`, `packJsonNote`.
- **`src/middleware.js`** — the L1 edge capture.

Key contracts:

```js
// L4 — _fbc is `fb.<subdomainIndex>.<clickTsMs>.<fbclid>`
export function parseFbc(fbc) {
  const parts = (fbc || '').split('.');
  if (parts.length < 4 || parts[0] !== 'fb') return {};
  const ts = Number(parts[2]);
  return { fbclid: parts.slice(3).join('.'), ts: ts > 0 ? ts : undefined };
}

// L5 — guarantees VALID JSON under `max` by shortening the LONGEST value,
// instead of slicing mid-JSON and losing every field.
export function packJsonNote(obj, max = 256) { /* see repo */ }
```

```js
// L1 — src/middleware.js
export function middleware(req) {
  const res = NextResponse.next();
  const live   = parseAttributionFromUrl(req.nextUrl.search);
  const stored = readAttrCookie(req.cookies.get(ATTR_COOKIE)?.value);
  const { attr, changed } = mergeAttribution(stored, {
    live,
    landingUrl: req.nextUrl.href,
    referrer:   req.headers.get('referer') || '',
    now: Date.now(),
  });
  if (changed) res.cookies.set(ATTR_COOKIE, encodeURIComponent(JSON.stringify(attr)), {
    path: '/', maxAge: ATTR_TTL_SECONDS, sameSite: 'lax', httpOnly: false,
    secure: req.nextUrl.protocol === 'https:',
  });
  return res;
}
export const config = { matcher: ['/((?!_next/static|_next/image|api/|favicon.ico|proof/).*)'] };
```

`httpOnly: false` is deliberate — the client module still reads the cookie as its fallback.
The client capture **stays**, but is now a supplement (client-side route changes, second
writer), not the load-bearing layer.

---

## 3. PATCH — `META_TRACKING_AGENT_GUIDE.md`

### 3.1 Header bullet list — add one line

```
- **Server-side attribution capture** via edge middleware (Section 4.7) — capture no longer
  depends on React hydration, which is what silently loses in-app-browser traffic
```

### 3.2 Revision banner — replace the "2026-08 REVISION" block

```
> **⚠ 2026-08-15 REVISION.** A live client (Project Alpha Wellness) lost ALL utm_* on its
> first paid ad lead while the referrer note still held the full ad URL. Root cause: capture
> lived only in a React `useEffect`, and the Facebook in-app browser navigated before
> hydration. The Meta pixel — a raw script tag — had already fired, which is why `_fbc`
> survived and our attribution did not. Three changes are now mandatory:
>   1. **Edge middleware capture (Section 4.7)** — the query string is read server-side on
>      the first request. This is now the PRIMARY capture; `lib/track.ts` is a supplement.
>   2. **Layered server-side resolution (Section 4.8)** — URL → cookie → body → referrer →
>      `_fbc`, per field, with an `attribution_source` provenance string.
>   3. **JSON-safe note packing** — `truncate(JSON.stringify(...))` is a data-loss bug.
```

### 3.3 NEW Section 4.7 — "Edge middleware capture (the primary layer)"

Insert after 4.6. Content: §2 of this document (the middleware reference implementation),
plus this rule:

> **Mount order matters.** `captureParams()` in a `useEffect` is a supplement. If a funnel
> ships only the client module, its attribution reliability is capped by hydration speed on
> the slowest device class it buys traffic on — typically 90–97%, and the misses are
> **biased toward in-app browsers**, i.e. exactly the paid social traffic you care about.

### 3.4 NEW Section 4.8 — "Layered resolution + provenance"

The precedence table from §1 of this document, plus `resolveAttribution` and the
`attribution_source` contract.

### 3.5 Section 8 — Anti-patterns: ADD four rows

| Mistake | Why it breaks things |
|---|---|
| **Capturing attribution only in a React effect / `useEffect`** | Loses the hydration race on in-app browsers. The pixel is a raw script tag and wins; your capture loses. **Capture in middleware.** |
| **Parsing `fbclid` out of the referrer** | Razorpay caps notes at 256 chars; a real fbclid is ~195 and gets silently truncated (observed: 49 of 195). **Derive it from `_fbc`.** |
| **`truncate(JSON.stringify(obj), 256)` for a notes blob** | Slices mid-JSON → `JSON.parse` throws → the defensive catch returns `{}` → **every** field lost, not one clipped. Use `packJsonNote`. |
| **No provenance column on the CRM row** | A blank-UTM row is indistinguishable from organic traffic. You find out on lead #1 instead of from an alert. |

### 3.6 Section 6 — Verification checklist: ADD four rows

| Check | How |
|---|---|
| **Middleware writes the cookie with JS disabled** | Disable JS, load `/?utm_source=test&fbclid=abc`, confirm the `<prefix>_attr` cookie exists |
| **Hydration-race immunity** | Throttle to Slow 3G, tap the CTA the instant it paints, complete checkout — UTMs must still land |
| **fbclid completeness** | Compare the CRM `fbclid` length to the one inside `_fbc`; they must match (~195 chars, not ~49) |
| **Provenance populated** | Every row has `attribution_source`, e.g. `utm:cookie\|clid:cookie`. Alert on `utm:none` |

---

## 4. PATCH — `META_CAPI_SOP_VSL.md` (and `_WEBINAR`)

### 4.1 Revision banner — replace the "2026-08 REVISION" block

Use the 4-point version: hybrid `_fbc`, last-touch capture, referrer/landing_url, **plus
edge-middleware capture and layered resolution**. Field count grows **25 → 26**.

### 4.2 Section 4 — field table: ADD field #26

| # | Field name | Type | How to derive it server-side |
|---|---|---|---|
| 26 | `attribution_source` | string | Provenance of the attribution on this row, `utm:<layer>\|clid:<layer>` where layer ∈ `url` / `cookie` / `body` / `referrer` / `fbc` / `none`. Written by `resolveAttribution`. **Alert when it contains `utm:none`** — that is a capture regression, and without this column it is invisible. |

### 4.3 Section 4 — REVISE field #9 (`fbc`) and #23 (`fbclid`)

Append to **#9**: *the click timestamp for the rebuild comes from the capture layer; when
that is missing, parse it out of `_fbc` itself (`fb.1.<ts>.<fbclid>`) before falling back to
event time.*

Replace the second sentence of **#23** with: *Derive from `_fbc` when the captured value is
empty. **Never parse `fbclid` from `referrer`** — the referrer note is capped at 256 chars
and a real fbclid is ~195, so it arrives truncated.*

### 4.4 Section 4.5 — retitle and restructure

Retitle to **"STEP 1b — Attribution capture: edge middleware (primary) + client module
(supplement)"**. Lead with the middleware from §2 of this document; keep the existing
`captureParams`/`restoreParams` reference implementation below it, relabelled as the
supplement. Add the layered-resolution precedence table from §1.

### 4.5 Section 5 — Sheet schema: **A–Y → A–Z**, lifecycle **Z–AL → AA–AM**

```
… | utm_term | fbclid | referrer | landing_url | attribution_source
                                                 ^ NEW column Z
```

> **⚠ Upgrading an existing sheet:** insert ONE column after `landing_url`, then shift every
> `COL.*` lifecycle index in the Apps Script by **+1**. The lifecycle block moves from
> **Z–AL** to **AA–AM**.

Updated lifecycle map for §6.1: `call_booked` AA · `booking_time` AB · `schedule_capi_event_id` AC ·
`schedule_capi_sent` AD · `call_showed` AE · `showup_time` AF · `showup_capi_event_id` AG ·
`showup_capi_sent` AH · `sale_closed` AI · `contracted_value` AJ · `sales_time` AK ·
`htsale_capi_event_id` AL · `htsale_capi_sent` AM.

### 4.6 Section 9 — Verification: ADD

- **Hydration-race smoke test:** Slow-3G throttle, tap the CTA as soon as it paints, buy.
  UTMs must still land. This is the exact failure that produced this revision.
- **JS-disabled smoke test:** load a tagged URL with JS off; the `_attr` cookie must exist.
- **Provenance monitoring:** chart `attribution_source`. A rising `utm:referrer` share means
  the middleware is failing; any `utm:none` is a capture regression.

---

## 5. PATCH — `RAZORPAY_WEBHOOK_MIGRATION.md`

### 5.1 Section 5 — notes packing: **9 keys → 13**

| # | Key | Contents | Maps in Pabbly to |
|---|---|---|---|
| 10 | `ts` | click timestamp, epoch ms | (feeds the `_fbc` rebuild) |
| 11 | `rf` | first-touch `referrer` | `referrer` |
| 12 | `lu` | first-touch `landing_url` | `landing_url` |
| 13 | `asrc` | provenance string | `attribution_source` |

**2 key-slots remain free** (was 6).

### 5.2 Section 5 — REPLACE the "Key trim rules" JSON-blob rule

```
- **NEVER `truncate(JSON.stringify(obj), 256)`.** On a long campaign name that slices
  mid-JSON; the webhook's JSON.parse throws, the defensive catch returns {}, and EVERY
  field in the blob is lost rather than one being clipped. Use `packJsonNote(obj, 256)`,
  which repeatedly shortens the LONGEST value until the serialised blob fits, so the worst
  case is a clipped campaign name. Verified: a realistic Advantage+ campaign produces a
  335-char blob that the old rule corrupted.
- **`rf` is capped at 256 like every other note.** It is a channel-classification field and
  a LAST-RESORT source for `utm_*`. It is NOT a valid source for `fbclid` — a real fbclid
  (~195 chars) sits at the end of the query string and gets cut. Use `_fbc`.
```

### 5.3 Section 6.2 — create-order

Add: *read the `<prefix>_attr` cookie server-side and treat it as higher precedence than the
client body; run `resolveAttribution` before packing notes; log at ERROR when provenance is
`utm:none`.*

### 5.4 Section 6.5 — webhook, step 6

Add: *after unpacking, re-run `resolveAttribution` over `notes.utm` / `notes.rf` / `notes.fbc`
so orders created before this shipped are repaired, and write `attribution_source` into the
Pabbly payload.*

---

## 6. PATCH — `RAZORPAY_WEBHOOK_MIGRATION_PROMPT.md`

Add to the audit list in the pasted prompt:

```
     - Any edge middleware (src/middleware.ts) doing attribution capture
     - Whether notes blobs are packed with a JSON-safe packer or a raw truncate()
```

---

## 7. Verification evidence (Hardik, 2026-08-15)

Replaying the exact failed lead's note string through `resolveAttribution`:

```
PASS  utm_source recovered   -> Facebook_Mobile_Reels
PASS  utm_medium recovered   -> Testosterone Drop Podcast
PASS  utm_campaign recovered -> TGO Hardik VSL Men 32-55 14.8.26
PASS  utm_content recovered  -> Broad
PASS  utm_term recovered     -> 120253918515750404
PASS  fbclid recovered FULL from _fbc (not the 49-char truncated rf) -> 195 chars
PASS  click ts recovered from _fbc -> 1786771769851
PASS  provenance stamped     -> utm:referrer|clid:fbc
```

Precedence, merge semantics and the JSON packer:

```
PASS  cookie (server-observed) beats body
PASS  body beats referrer
PASS  captured fbclid beats _fbc derivation
PASS  nothing available -> provenance "utm:none|clid:none" (alarms)
PASS  first-touch landing_url set / context stays first-touch
PASS  clean internal URL does not wipe attribution
PASS  last-touch: second ad overwrites
PASS  untagged internal nav writes no cookie (no churn)
PASS  OLD truncate(JSON.stringify()) -> INVALID json (every utm field lost)
PASS  NEW packJsonNote -> valid json, fits 256, only the longest value clipped
```

---

## 8. Backfill for the affected lead

`pay_TPvkniUArkCDLM` is fully recoverable from data already in the notes:

| Column | Value |
|---|---|
| utm_source | `Facebook_Mobile_Reels` |
| utm_medium | `Testosterone Drop Podcast` |
| utm_campaign | `TGO Hardik VSL Men 32-55 14.8.26` |
| utm_content | `Broad` |
| utm_term | `120253918515750404` |
| fbclid | from `_fbc`, 195 chars — **not** the 49-char value in `rf` |
| attribution_source | `utm:referrer\|clid:fbc` |
