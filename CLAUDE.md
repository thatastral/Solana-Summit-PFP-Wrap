# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps
npm run dev           # start Vite dev server on :3000
npm run build         # production build -> build/
npm run preview       # serve the production build locally
npx tsc --noEmit       # type-check (build does not run tsc; do this separately)
```

There is no test suite and no lint script configured.

The Supabase edge function under `supabase/functions/make-server-07da931a/` is **not** built or served by Vite — it's Deno code deployed separately via the Supabase CLI (`supabase functions deploy`). `tsconfig.json` excludes `supabase` for this reason (it uses Deno globals and `npm:`/`jsr:` specifiers that don't resolve under the frontend's Node/browser TS config).

## Branches

- `legacy-2025` — frozen snapshot of the original Solana Summit Africa PFP Wrap. Do not develop here.
- `summit-2026` — active branch, the Solana Summit Nigeria 2026 redesign.

These two branches have unrelated git histories from each other and from `origin/main` on GitHub (the local working copy didn't line up with what was on GitHub when the repo was connected). Reconciling them is a deliberate decision for the repo owner — don't rewrite or force-push without being asked.

## Architecture

Single-page Vite + React 18 + TypeScript app, no router. Styling is plain CSS (no Tailwind, no CSS-in-JS): `src/styles/tokens.css` holds design tokens (colours, fonts, easing curves, fluid spacing) as custom properties, `src/styles/global.css` holds resets, the app shell and shared primitives (`.btn`, `.visually-hidden`), and every component has a co-located `ComponentName.css`.

### App flow / state machine

`src/App.tsx` is the whole app's controller. One `stage` variable (`intro | landing | details | generating | result`) gates which top-level component renders — no routing, just conditional rendering driven by that stage plus the data collected along the way. Read this file first when tracing a screen transition.

Flow: `IntroAnimation` → `Hero` (upload click opens a hidden `<input type=file>`) → `UploadDetails` (name/role) → `GenerationOverlay` (one line of copy at a time while the canvas work runs) → `ResultReveal` (envelope animation + download).

### The single-fold constraint

The experience is a **fixed single fold on every device — nothing ever scrolls.** `html`, `body` and `#root` are all `height: 100%; overflow: hidden`, the body is `position: fixed`, and `.app-shell` is a flex column that fills it. Two consequences worth knowing:

- `#root` needs its explicit height or `.app-shell { height: 100% }` resolves against `auto` and collapses, which silently breaks vertical centring.
- Any layout change must be checked for *hidden* content, not just absence of a scrollbar. Locking scroll turns overflow into clipped, invisible UI. Verify by measuring element rects against `innerHeight`, not by looking for `scrollHeight > clientHeight`.

### Image generation pipeline

Two independent async functions in `src/lib/` each build an offscreen `<canvas>` and return a `data:image/png` URL. Nothing is rendered server-side.

- `pfpGenerator.ts` — the circular PFP at 1080². Fill circle → cover-fit-clip the photo across the whole circle → `drawImage` the pre-made wrap overlay (`pfp-wrap.png`, scaled 1.335× so the ring meets the circumference, LinkedIn "#Hiring" style) → multiply-blend inner shadow. The ring is **always a pre-rendered image composited on top**, never text-on-a-path computed at runtime — an earlier per-glyph rotation approach had orientation bugs (`src/lib/canvasText.ts` survives but is unused by this path).
- `attendeeCardGenerator.ts` — the card at 2160², composited over `attendee-card-bg.webp`, which already carries the logo, headline, side patterns and Superteam bar. Only the photo, name and role are drawn on top, at fractions of the canvas measured from the approved reference.

**Exports are deliberately borderless.** The white strokes on the card and PFP are presentation-only, applied in `ResultReveal.css` via `outline` so downloads stay clean and reusable. Note `outline`, not an inset `box-shadow` — on a replaced element like `<img>` the image content paints over an inset shadow and it never shows.

Both share `src/lib/faceCrop.ts`: `detectFocalPoint()` tries the browser `FaceDetector` API (rarely available) and falls back to a fixed focal point tuned for headshots; `getCoverCropRect()` turns that into a cover-fit source rect used by both generators.

`src/lib/summitAssets.ts` is the public entry point — it re-exports both generators plus `generateSummitIdentity()`, which produces both assets in one call. Anything outside the result screen should import from there.

### EnvelopeReveal

`src/components/EnvelopeReveal/` is a vendored, self-contained component (JSX + a hand-written `EnvelopeReveal.d.ts`; `tsconfig` sets `allowJs`). It owns only the envelope artwork, layering and motion — the card and PFP are passed in as props and never hardcoded. It lays out a fixed 980×1100 pixel scene and applies one `scale()` to fit its container.

Two adaptations were made when vendoring, both worth preserving:

- Its `framer-motion` import was repointed to `motion/react`. This project already ships `motion`, the current release of the same library with an identical API; installing `framer-motion` alongside would bundle a second copy of the animation engine.
- Its dark default backdrop, ambient green glow, and the badge's green halo are switched off from `ResultReveal.css` rather than by editing the component, and `overflow` is set to `visible` so the envelope can spin outside the stage during its entrance without being clipped.

**The scene box is larger than the artwork** (transparent padding above and below), so spacing measured from `.result__stage` is not the spacing you see. `ResultReveal.css` compensates explicitly via `--result-stage-pad`.

### Sound

Two independent layers:

- `src/lib/uiSounds.ts` — interface cues synthesised with the Web Audio API. A single delegated listener in `App.tsx` covers every pressable; elements opt into a different cue with `data-sound`. **Independent of the music toggle** — muting the music must never silence interface feedback.
- `MusicToggle.tsx` — the background track. Autoplay with sound is gated on prior engagement, so it tries unmuted, then falls back to starting *muted* (always permitted) and unmutes on the first gesture — flipping a flag rather than starting playback cold. This is as close to "autoplay" as browsers allow; don't expect to beat it.

### Motion owns `transform` and `opacity`

Recurring gotcha: Motion writes these inline, which silently overrides CSS. Centring translates, resting opacity and similar must be set **in the animation target**, or moved onto a non-animated wrapper. This has caused real bugs in the ray burst, the modal opacity and the mobile faces strip — check here first when a transform "doesn't apply".

### Backend

`supabase/functions/make-server-07da931a/index.ts` is a Hono app on Supabase Edge Functions, and the only server the site has — image generation is entirely client-side. It backs `frames/feed` (the combined endpoint the site polls), `frames/count` and `frames/recent` (kept so a cached older bundle keeps working), and `frames/increment`. It talks to the `kv_store_07da931a` table directly. Keys are prefixed `summit2026_*`, kept separate from the 2025 app's `frame_download_count` so both versions can share a Supabase project.

**Nothing is stored that could instead be derived.** A download writes exactly one row — its own thumbnail, under a unique `summit2026_thumb_<ms>_<uuid>` key. The total is a `COUNT` over those rows and the faces strip is the newest few of the same rows. An earlier version kept the count and the strip as their own stored values, which meant read-modify-write: five simultaneous downloads produced a count of one and a strip missing four faces. Deriving both makes them exact under concurrency and keeps them consistent with each other. Don't reintroduce a stored counter — the cost of the `COUNT` is what CDN caching is there to absorb.

`frames/increment` validates that the posted thumbnail is a small, genuine `data:image/...;base64` raster and rejects anything else with a 400. This matters because the endpoint is reachable by anyone (the anon key that authorises it necessarily ships in the bundle) and what it stores is displayed publicly on the landing page. It bounds the damage to "someone posted a picture"; it cannot judge whether a real photo is an appropriate one. **There is no moderation and no admin UI** — removing a bad entry means deleting its row:

```sql
delete from kv_store_07da931a where key like 'summit2026_thumb_%' order by key desc limit 1;
-- or wipe everything and start from zero:
delete from kv_store_07da931a where key like 'summit2026_%';
```

Reads are the hot path, so `frames/feed` sets `s-maxage` and most polls never reach Postgres. The client polls every 12–16s (jittered, so a thousand tabs opened together don't fire on the same tick) and pauses entirely while the tab is hidden. `fetchFeed()` returns `null` rather than zeroes when a read fails, so a dropped connection leaves the last known figures on screen instead of flashing "0 attending".

`IS_PRODUCTION` in `src/config.ts` gates reporting so local and preview runs never inflate the public count. A download is only reported once per generated identity, claimed synchronously via a ref before the await.

### Brand assets

`src/assets/2026/` holds the Figma-exported / user-supplied artwork. Treat these as source-of-truth design files — if fidelity looks off, ask for an updated asset rather than hand-tuning paths.

- `side-patterns.svg` — desktop edge bands. Spec: 306.1 × 1260.84, 1092px apart, centred on both axes, sitting roughly half-in from each edge. The artwork is **not** vertically periodic (best self-match ≈ 55%), so it cannot be tiled or scroll-looped seamlessly — it is deliberately static.
- `side-patterns-mobile.png` — separate artwork carrying both columns pre-positioned for a narrow screen; swapped in below 900px.
- `pattern-diamond-tile.svg` — a hand-extracted 12×24 repeat cell. The original pre-tiled 2160² export is kept as `pattern-diamond-tile-source.svg` for reference and is not imported (it would inflate the bundle ~180× for no visual difference).

`public/` holds the audio track, favicons and the OG social card.

### Config placeholders

`src/config.ts` carries `REGISTER_URL` and `EVENT_DATE`. Both are set for the 2026 event; re-check them if the date or registration link moves.
