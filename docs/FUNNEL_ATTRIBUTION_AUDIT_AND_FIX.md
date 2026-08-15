# Funnel Attribution — Audit & Fix Playbook (self-contained)

> **Hand this ONE file to a Claude Code session in any client funnel project.** It needs no
> other document. It carries the diagnostic, the target architecture, the full reference
> implementation, the verification harness, and the handoff rules.
>
> **Scope:** how a funnel captures `utm_*` / `fbclid` / `_fbc` / `_fbp` / referrer, and how
> those reach (a) Meta CAPI and (b) the Pabbly → Google Sheet CRM.
>
> **Origin:** written after a live post-mortem on Project Alpha Wellness (2026-08-15) where
> the first paid ad lead produced a CRM row with **every UTM blank and no fbclid**, while the
> referrer field still held the complete ad URL. The root cause is architectural, not a typo,
> and it is present in every funnel built on this architecture.

---

## ▶️ AGENT WORKFLOW — follow in order, do not skip

```
PHASE A  DIAGNOSE (read-only). Do not edit anything.
PHASE B  REPORT using the fixed template in §5. Ask your questions.
PHASE C  STOP. Wait for explicit human approval.
PHASE D  IMPLEMENT only what was approved, in the §7 order.
PHASE E  VERIFY with the §9 harness. All assertions must pass.
PHASE F  COMMIT + PUSH per §10.
```

**Hard rules**

1. **Do not change any Meta event name, `event_id` derivation, or `external_id` formula.**
   Meta's ML needs naming stability and its dedup depends on `event_id`.
2. **Do not add or remove CAPI events.** If the project fires one custom event, it keeps
   firing exactly one.
3. **Do not remove any existing Pabbly field.** Downstream Sheet mapping is column-name
   based. You may only ADD.
4. **Do not touch browser Pixel behaviour** (PageView / MAM cookie / thank-you page).
5. **Do not skip Phase C.** Even if the fix looks obvious.
6. If a hard rule conflicts with what the codebase does, say so in Phase B. Never deviate
   silently.

---

## 1. The post-mortem this comes from (read it — it tells you what to look for)

A real lead, `pay_TPvkniUArkCDLM`, paid ₹97 from a Meta ad. The Razorpay order notes:

```
utm : {"s":"","m":"","c":"","n":"","t":""}    ← all blank
clid: ""                                       ← no fbclid
ts  : ""                                       ← no click time
rf  : https://…/?utm_source=Facebook_Mobile_Reels&utm_medium=…&fbclid=IwcGRvZ…  ← FULL ad URL
lu  : https://…/checkout
fbc : fb.1.1786771769851.IwcGRvZgVmZGlk…       ← Meta's own cookie, intact
```

### Deduction

1. `landing_url` is first-touch — written once, only when storage is empty. It says
   `/checkout`, so the capture ran **for the first time on the checkout page**.
2. `_fbc` was present. It can only be created on a page whose URL carried `fbclid` (the
   landing page) and `fbevents.js` writes it via `document.cookie`. It survived the hop.
   **So JS-written cookies do persist across the navigation.**
3. Therefore, had the capture run on the landing page, its cookie would have survived too.

**⟹ the capture never completed on the landing page.**

### Mechanism — the asymmetry to internalise

| | How it loads | Result |
|---|---|---|
| Meta pixel | `next/script` `afterInteractive` — a **raw script tag**, independent of React | ✅ ran |
| `captureParams()` | a **React `useEffect`** — runs only after the tree hydrates | ❌ did not |

Heavy landing page + **Facebook iOS in-app browser** + a CTA that is a plain
`<a href="/checkout">` (an instant navigation that cancels pending JS) = the user left
before hydration.

> **The generalisable lesson:** attribution capture that lives only in client-side JS has a
> reliability ceiling set by hydration speed on the slowest device class you buy traffic on.
> You cannot fix it by improving the JS. It has to move to the server.
> And the misses are **biased toward in-app browsers** — i.e. exactly your paid social traffic.

### Two further defects found while fixing it

- **`referrer` is capped at 256 chars** by Razorpay's note limit. The fbclid inside it came
  out **49 chars; the real one is 195**. UTMs survived only because they precede `fbclid` in
  the query string. **⟹ referrer is a valid fallback for `utm_*`, never for `fbclid`.**
- **`truncate(JSON.stringify(obj), 256)`** slices mid-JSON on a long campaign name → the
  webhook's `JSON.parse` throws → the defensive `catch` returns `{}` → **every** field in the
  blob is lost, not one clipped. A realistic Advantage+ campaign name produces a 335-char blob.

---

## 2. PHASE A — Diagnose (read-only)

Find and read these. Paths vary; search by content, not by path.

```bash
# capture layer
grep -rn "utm_source\|fbclid\|gclid" src app lib components 2>/dev/null | grep -v node_modules
# is there ANY server-side capture?
ls middleware.js middleware.ts src/middleware.js src/middleware.ts 2>/dev/null
# _fbc handling
grep -rn "_fbc\|_fbp" src app lib 2>/dev/null | grep -v node_modules
# notes packing (Razorpay) + the JSON bug
grep -rn "truncate(JSON.stringify\|notes\s*=\|notes:" src app lib 2>/dev/null | grep -v node_modules
# the Pabbly payload
grep -rn "PABBLY_WEBHOOK_URL" -A40 src app lib 2>/dev/null | grep -v node_modules
# CAPI events
grep -rn "event_name\|graph.facebook.com" src app lib 2>/dev/null | grep -v node_modules
# host gating
grep -rn "hostname\|TRACKING_HOST" src app lib 2>/dev/null | grep -v node_modules
```

> ⚠️ In zsh, `grep --include=*.js` gets glob-expanded by the shell and silently returns
> nothing. Omit `--include` or quote it. This has produced false "not found" results before.

---

## 3. The 9 known failure modes — check each, with its detection signature

| # | Failure | Detection signature | Impact |
|---|---|---|---|
| **F1** | **Capture only in client JS** — no server-side capture | no `middleware.*` file; `captureParams()` called only inside `useEffect` | **The big one.** Loses the hydration race on in-app browsers. Blank UTMs on real ad sales. |
| **F2** | **First-touch UTM freeze** | `if (localStorage.getItem(KEY)) return` at the top of capture | A buyer who arrived via link-in-bio then clicked the ad is credited to the bio link forever |
| **F3** | **localStorage only, no cookie mirror** | capture writes `localStorage` but never `document.cookie` | Evicted by ITP / lost on in-app→external handoff |
| **F4** | **`_fbc` read cookie-only** | `cookies.get('_fbc')` with no `` `fb.1.${ts}.${fbclid}` `` template anywhere | Attribution degrades to probabilistic on iOS; Meta under-credits real ad sales |
| **F5** | **`fbclid` parsed from referrer** | referrer/`rf` passed into a `fbclid` extraction | Silently truncated fbclid (49 of 195 chars observed) — worse than none, it looks valid |
| **F6** | **`truncate(JSON.stringify(...))` note packing** | literal `truncate(JSON.stringify(` | **Universal latent bug.** Total UTM loss on long campaign names |
| **F7** | **No provenance field** | no `attribution_source` in the Pabbly payload | A blank row is indistinguishable from organic. You find out from a lead, not a monitor |
| **F8** | **CAPI routes not host-gated** | API routes fire CAPI with no hostname check | localhost + Vercel previews fire real events into the live dataset |
| **F9** | **`restoreParams` ignores the live URL** | restore reads storage only | Misses attribution when the user lands straight on a tagged `/checkout` |

**F6 is the one to flag as urgent regardless of everything else** — it is stack-independent,
traffic-independent, and silently destroys all five UTM fields at once.

---

## 4. Also inventory (needed for the report)

- The **tracking authority** route: `verify-payment` or the Razorpay `webhook`
- Exact **CAPI event name(s)**, `event_id` derivation, `external_id` formula
- Exact **current Pabbly payload field list**, verbatim
- **Checkout form fields** actually collected (never invent `user_data` fields)
- **Test-mode / free-order gate** if present
- Framework: Next App Router / Pages Router / other

---

## 5. PHASE B — Report template (keep to this shape; it is compared across ~13 funnels)

```
## Current flow
<3–6 bullets: ad click → capture → storage → checkout → order notes → webhook → Pabbly + CAPI>

## Failure modes present
| # | Present? | Evidence (file:line) | Impact here |
F1 … F9

## Current Pabbly payload (verbatim field list)
<list>

## CAPI events fired
<name(s), event_id, external_id formula>  — TO BE PRESERVED EXACTLY

## What I propose to change
<mapped to L1–L7 in §6; explicitly list anything I will NOT change>

## Breaking changes / migration hazards
<esp. the Sheet column shift if adopting L7>

## Questions for you
<anything ambiguous — cookie prefix, canonical domain, whether Apps Script is live>

## Deviations from this playbook
<with justification>
```

Then **STOP** and wait for approval.

---

## 6. Target architecture — L1 to L7

Nothing is literally 100%. This moves the failure mode from *"one React effect must win a
race against a link tap"* to *"the server saw the query string"*.

| Layer | What | Fixes |
|---|---|---|
| **L1** | Middleware capture at the edge | F1 |
| **L2** | Server reads the cookie; client body is a supplement | F1, trust |
| **L3** | Reconstruct `utm_*` from `referrer` | F2, F3 residue |
| **L4** | Derive `fbclid` + click-ts from `_fbc` | F4, F5 |
| **L5** | JSON-safe note packing | **F6** |
| **L6** | Webhook-side repair | pre-existing orders |
| **L7** | `attribution_source` provenance column | F7 |

**Precedence, per field:** `URL → cookie → body → referrer → _fbc → none`
`referrer` is skipped for `fbclid`; `_fbc` is the only complete source.

---

## 7. Reference implementation (drop-in)

Replace `<prefix>` with the project's short client tag (e.g. `apw`, `sdp`, `rbs`).
**Keep the attribution cookie separate from the MAM cookie** — different concerns, never merge.

### 7.1 `src/lib/attribution.js` — pure, Edge-safe (no `node:crypto`, no DOM)

```js
export const ATTR_COOKIE = '<prefix>_attr';
export const ATTR_TTL_SECONDS = 30 * 24 * 60 * 60;

export const URL_TO_KEY = {
  utm_source: 'source', utm_medium: 'medium', utm_campaign: 'campaign',
  utm_content: 'content', utm_term: 'term', fbclid: 'fbclid', gclid: 'gclid',
};
export const UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'];
const isFilled = (v) => typeof v === 'string' && v.length > 0;

export function parseAttributionFromUrl(input) {
  const out = {};
  if (!input) return out;
  try {
    const search = input.includes('?') ? input.slice(input.indexOf('?')) : input;
    const sp = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    for (const [param, key] of Object.entries(URL_TO_KEY)) {
      const v = sp.get(param);
      if (isFilled(v)) out[key] = v;
    }
  } catch {}
  return out;
}

/* _fbc is `fb.<subdomainIndex>.<clickTsMs>.<fbclid>` — the ONLY complete fbclid source. */
export function parseFbc(fbc) {
  if (!isFilled(fbc)) return {};
  const p = fbc.split('.');
  if (p.length < 4 || p[0] !== 'fb') return {};
  const ts = Number(p[2]);
  return { fbclid: p.slice(3).join('.'), ts: Number.isFinite(ts) && ts > 0 ? ts : undefined };
}

export function readAttrCookie(raw) {
  if (!isFilled(raw)) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch { return {}; }
}

/* ATTRIBUTION = last-touch. CONTEXT (referrer/landing_url) = first-touch. */
export function mergeAttribution(stored, { live, landingUrl, referrer, now }) {
  const attr = { ...stored };
  let changed = false;
  if (!isFilled(attr.landing_url) && isFilled(landingUrl)) {
    attr.landing_url = landingUrl;
    attr.referrer = isFilled(referrer) ? referrer : '';
    changed = true;
  }
  if (live && Object.keys(live).length > 0) {
    Object.assign(attr, live, { ts: now });
    changed = true;
  }
  return { attr, changed };
}

export function resolveAttribution({
  cookieAttr = {}, bodyAttr = {}, referrer = '', landingUrl = '', fbc = '', now = Date.now(),
} = {}) {
  const utm = {};
  let utmSource = 'none';
  for (const [label, src] of [['cookie', cookieAttr], ['body', bodyAttr]]) {
    for (const key of UTM_KEYS) {
      if (!isFilled(utm[key]) && isFilled(src?.[key])) {
        utm[key] = src[key];
        if (utmSource === 'none') utmSource = label;
      }
    }
  }
  if (UTM_KEYS.every((k) => !isFilled(utm[k]))) {
    const recovered = { ...parseAttributionFromUrl(landingUrl), ...parseAttributionFromUrl(referrer) };
    let used = false;
    for (const key of UTM_KEYS) if (isFilled(recovered[key])) { utm[key] = recovered[key]; used = true; }
    if (used) utmSource = 'referrer';
  }
  for (const key of UTM_KEYS) if (!isFilled(utm[key])) utm[key] = '';

  let fbclid = '', fbclidTs = 0, clidSource = 'none';
  if (isFilled(cookieAttr.fbclid))      { fbclid = cookieAttr.fbclid; clidSource = 'cookie'; fbclidTs = Number(cookieAttr.ts) || 0; }
  else if (isFilled(bodyAttr.fbclid))   { fbclid = bodyAttr.fbclid;   clidSource = 'body';   fbclidTs = Number(bodyAttr.ts) || 0; }
  else {
    const f = parseFbc(fbc);
    if (isFilled(f.fbclid)) { fbclid = f.fbclid; clidSource = 'fbc'; fbclidTs = f.ts || 0; }
  }
  if (!fbclidTs) fbclidTs = Number(cookieAttr.ts) || Number(bodyAttr.ts) || 0;

  return {
    utm, fbclid, fbclidTs: fbclidTs || now,
    gclid: [cookieAttr.gclid, bodyAttr.gclid].find(isFilled) || '',
    referrer: [referrer, cookieAttr.referrer, bodyAttr.referrer].find(isFilled) || '',
    landingUrl: [landingUrl, cookieAttr.landing_url, bodyAttr.landing_url].find(isFilled) || '',
    provenance: `utm:${utmSource}|clid:${clidSource}`,
    utmSource, clidSource,
  };
}

/* L5 — GUARANTEES valid JSON under `max` by shortening the LONGEST value.
   Never use truncate(JSON.stringify(obj), 256): it slices mid-JSON and loses every field. */
export function packJsonNote(obj, max = 256) {
  const w = {};
  for (const [k, v] of Object.entries(obj)) w[k] = typeof v === 'string' ? v : String(v ?? '');
  let json = JSON.stringify(w), guard = 0;
  while (json.length > max && guard < 200) {
    guard += 1;
    let key = null, len = 0;
    for (const [k, v] of Object.entries(w)) if (v.length > len) { len = v.length; key = k; }
    if (!key || len === 0) break;
    const cut = Math.max(1, Math.min(len, json.length - max));
    w[key] = w[key].slice(0, len - cut);
    json = JSON.stringify(w);
  }
  return json.length > max ? '{}' : json;
}
```

### 7.2 `src/middleware.js` — L1, the layer that actually fixes it

```js
import { NextResponse } from 'next/server';
import { ATTR_COOKIE, ATTR_TTL_SECONDS, mergeAttribution,
         parseAttributionFromUrl, readAttrCookie } from '@/lib/attribution';

export function middleware(req) {
  const res = NextResponse.next();
  try {
    const live = parseAttributionFromUrl(req.nextUrl.search);
    const stored = readAttrCookie(req.cookies.get(ATTR_COOKIE)?.value);
    const { attr, changed } = mergeAttribution(stored, {
      live,
      landingUrl: req.nextUrl.href,
      referrer: req.headers.get('referer') || '',
      now: Date.now(),
    });
    if (changed) {
      res.cookies.set(ATTR_COOKIE, encodeURIComponent(JSON.stringify(attr)), {
        path: '/', maxAge: ATTR_TTL_SECONDS, sameSite: 'lax',
        httpOnly: false,                                  // the client module reads it as fallback
        secure: req.nextUrl.protocol === 'https:',
      });
    }
  } catch {}
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api/|favicon.ico|proof/).*)'],
};
```

### 7.3 Server route (create-order, or verify-payment if there is no webhook)

```js
const cookieAttr = readAttrCookie(req.cookies.get(ATTR_COOKIE)?.value);   // L2 — server first
const bodyAttr   = { source: utm?.source ?? '', /* … */ fbclid: fbclid ?? '', ts: Number(fbclidTs) || 0 };
const resolved   = resolveAttribution({ cookieAttr, bodyAttr, referrer, landingUrl, fbc: cookieFbc }); // L3+L4
const fbc        = cookieFbc || (resolved.fbclid ? `fb.1.${resolved.fbclidTs}.${resolved.fbclid}` : '');

if (resolved.utmSource === 'none') console.error('[create-order] ATTRIBUTION MISSING');

const notes = {
  kind: '<existing sentinel — do not change>',
  cust: packJsonNote({ /* … */ }),        // L5
  utm:  packJsonNote({ s: resolved.utm.source, m: resolved.utm.medium,
                       c: resolved.utm.campaign, n: resolved.utm.content, t: resolved.utm.term }),
  clid: truncate(resolved.fbclid),
  ts:   truncate(String(resolved.fbclidTs || '')),
  asrc: truncate(resolved.provenance),    // L7
  fbc: truncate(fbc), fbp: truncate(fbp), ip: truncate(ip), ua: truncate(ua),
  rf:   truncate(resolved.referrer),
  lu:   truncate(resolved.landingUrl),
  esu:  CANONICAL_CHECKOUT_URL,
};
```

That is **13 notes keys** (Razorpay's cap is 15 keys / 256 chars per value). 2 slots spare.

### 7.4 Webhook (L6) — repair + provenance

Re-run `resolveAttribution` over `notes.utm` / `notes.rf` / `notes.fbc` so orders created
before this shipped are repaired. Then add to the Pabbly payload:

```js
utm_source: resolvedAttr.utm.source,   // …medium, campaign, content, term
fbclid: resolvedAttr.fbclid,           // derived from _fbc when captured value was lost
attribution_source: notes.asrc || resolvedAttr.provenance,   // L7
```

Log at **ERROR** when `resolvedAttr.utmSource === 'none'`.

---

## 8. Stack adaptation

| Stack | L1 implementation |
|---|---|
| **Next.js App Router** | `src/middleware.js` as above |
| **Next.js Pages Router** | same API, file at project root `middleware.js` |
| **Non-Next (Express/etc.)** | the same read-query-string-and-Set-Cookie logic in the first request handler, before any HTML |
| **Static host + CDN** | a CDN edge worker (Cloudflare Worker / Vercel Edge Config) doing the same |

The *principle* is portable — capture the query string server-side on the first request.
The file is not. If none of these apply, say so in Phase B rather than skipping L1.

---

## 9. PHASE E — Verification harness (all must pass)

Run the real regression fixture. This is the exact note string from the lead that caused
this playbook to exist; if your implementation recovers it, the fallbacks work.

```js
const notes = {
  clid: '', ts: '',
  utm: '{"s":"","m":"","c":"","n":"","t":""}',
  rf: 'https://example.com/?utm_source=Facebook_Mobile_Reels&utm_medium=Testosterone+Drop+Podcast&utm_campaign=TGO+Hardik+VSL+Men+32-55+14.8.26&utm_content=Broad&utm_term=120253918515750404&fbclid=IwcGRvZgVmZGlkFlDIkqwYdjSfqcsB2tdCqlo2UlknuHdleHR',
  lu: 'https://example.com/checkout',
  fbc: 'fb.1.1786771769851.IwcGRvZgVmZGlkFlDIkqwYdjSfqcsB2tdCqlo2UlknuHdleHRuA2FlbQEwAGFkaWQBqzpNT5GHlHNydGMGYXBwX2lkCjY2Mjg1NjgzNzkAAR7CMVN7FggThhPp4fjvWaxb3m5Snsv1Nnuhanb0IqkZYMeDf6GQLLbaUyMhCw_aem_h9PxjwKywDlTqLI66MolCw',
};
```

Assertions:

- [ ] all five `utm_*` recovered from `rf`
- [ ] `fbclid` recovered from `_fbc` at **full length (195 chars)**, not the 49-char `rf` value
- [ ] click ts recovered = `1786771769851`
- [ ] provenance = `utm:referrer|clid:fbc`
- [ ] cookie beats body; body beats referrer; captured fbclid beats `_fbc` derivation
- [ ] empty everything → `utm:none|clid:none`
- [ ] first-touch `landing_url` set once; clean internal URL does not wipe attribution
- [ ] last-touch: a second tagged URL overwrites
- [ ] untagged internal nav writes **no** cookie (no churn)
- [ ] `packJsonNote` on a >256-char blob → **valid** JSON, fits, only the longest value clipped
- [ ] old `truncate(JSON.stringify(...))` on the same input → **invalid** JSON (proves the bug)

> ⚠️ Make the packer fixture genuinely oversized (a realistic Advantage+ campaign name,
> ~335 chars serialised). A short fixture silently passes without exercising the path.

Then: build passes, lint has no NEW errors, and manually —

- [ ] JS disabled + tagged URL → the `_attr` cookie still exists (proves L1)
- [ ] Slow-3G, tap the CTA the instant it paints, buy → UTMs still land (proves the race is gone)

---

## 10. PHASE F — Commit & push

One commit, or one per layer — ask the human which. Message must state the failure mode
fixed and the evidence, not just the change. Then push to that project's own repo.

```
Attribution: edge-middleware capture, layered fallbacks, provenance

<what was broken here, with evidence from the audit>

L1 middleware capture — reads the query string at the edge before any JS.
L2 server reads the attr cookie; client body demoted to supplement.
L3 utm_* reconstructed from referrer when missing.
L4 fbclid + click ts derived from _fbc. Never from referrer (256-char cap
   truncates it — 49 of 195 chars observed).
L5 packJsonNote replaces truncate(JSON.stringify(...)), which sliced mid-JSON
   and lost every utm field at once.
L6 webhook re-resolves so pre-existing orders are repaired.
L7 attribution_source written to Pabbly for monitoring.

Verified against the regression fixture: <results>.
```

**Do not push until the human has approved Phase B and seen Phase E pass.**

---

## 11. ⚠️ Breaking changes & migration hazards

**L7 shifts the CRM Sheet.** Adding `attribution_source` moves the auto-fill block from
**A–Y to A–Z**, and every lifecycle column shifts **+1** (`Z–AL` → `AA–AM`).

> **If the project has a live Apps Script**, inserting the column WITHOUT re-pointing the
> `COL` map makes downstream CAPI events fire against the wrong cells. Insert the column and
> shift every lifecycle index by +1 in the same change.

**L1–L6 can be adopted without L7.** That gets all the reliability with zero Sheet
migration. Recommend this split for any client already running Apps Script; L7 can follow.

**Cookie prefix** must not collide with the MAM cookie. Two cookies, two concerns:
`<prefix>_mam` = hashed PII for the pixel; `<prefix>_attr` = raw attribution. Never merge.

**F6 (`truncate(JSON.stringify)`) is urgent everywhere** and independent of the rest — it is
stack-agnostic and destroys all five UTM fields at once. Ship it even if nothing else lands.

---

## 12. What this does NOT change

- Meta event names, `event_id`, `external_id` — untouched
- Browser Pixel behaviour (PageView, MAM cookie, thank-you) — untouched
- Existing Pabbly field names — only additive
- The payment flow, redirect behaviour, UI copy — untouched
- Meta attribution itself: **Meta never reads `utm_*`.** It attributes on `fbc` / `fbp` /
  hashed PII. UTMs are the source of truth for YOUR CRM, not for Ads Manager. The lever that
  makes Meta credit the right ad is a strong `_fbc` (L4). Narrowing the ad-set window to
  *7-day click, no view* is a media-buyer action, not a code change.
