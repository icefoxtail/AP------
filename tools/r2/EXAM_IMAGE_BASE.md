# Exam image base URL (R2 by default)

Status (2026-11-01): exam images load from Cloudflare R2 (`https://img.wangjiedu.com`) and are **no longer part of
the Pages package**. They stay in Git (`archive/assets/images/**`), and `r2-archive-assets-copy.yml` copies them to
R2 on every push to main. Exam JS image paths are not rewritten. History: 2026-10-30 the default moved from `''`
(same-origin) to R2 with the Pages copy as fallback; 2026-11-01 the Pages copy was dropped (this section).

## 2026-11-01: images out of the Pages package

What changed:

- `tools/archive-pages-release-manifest.json`: the `archive/assets` tree has `"exclude": ["images"]`. The built
  package fell from 900,696,200 bytes / 20,200 files to 410,594,128 bytes / 10,203 files (-490.1 MB, 9,997 image
  files; headroom below the 1,000,000,000-byte Pages limit 99 MB -> 589 MB). `archive/assets/generated-lite`,
  `solutions` and the other asset folders are still shipped.
- Consumers that fetched images from the Pages host now use R2:
  - APMS Worker, `helpers/archive-saved-papers.js` (`embedSavedPaperAssets`, the only server-side image fetch):
    `assets/images/<key>` -> `https://img.wangjiedu.com/exams/images/<encoded key>` (plain `fetch`, no CORS involved).
    Worker variable `EXAM_IMAGE_BASE_URL` overrides the host; `""` reads the Pages copy (only valid after a rollback).
    A failed R2 fetch falls back once to the Pages URL (a no-op while the package has no images).
  - `archive/mixer.html`: question lists inserted `q.content` raw, so inline `<img src="assets/images/...">` pointed at
    the Pages host; it now goes through `APArchiveAssetBase.resolveHtml`, and `q.image` gets `crossorigin` like the engines.
  - Already on the module (2026-10-30): `engine.html`, `mixed_engine.html`, `problem-bank-search.html`,
    `generated-bank.html`, `apmath/js/archive-render.js`, `apmath/js/report-center.js`, `apmath/wrong_print_engine.html`.
    `apmath/student` only opens the engines. The Browser Rendering PDF job (`routes/exam-pdf.js`) loads `engine.html`
    from Pages, which then requests the images from R2 itself.
  - Left alone: `archive/internal-review-engine.html/.js` (reads images from a local folder through the File System
    Access API, never from Pages), `assets/generated-lite` and `assets/solutions*` (still in the package),
    `archive/assessment/*` (no figure rendering).
- `tools/check-archive-pages-site-browser.cjs` (staged-site smoke, runs on 127.0.0.1 which the bucket CORS does not
  allow) answers `https://img.wangjiedu.com/*` from the repository's `archive/assets/images` through the DevTools
  Fetch domain and requires that the engine really requested them from R2.
- Teacher QA `?assetBase=off` (same-origin images) now shows broken figures, because the Pages host has none. It only
  works again after a rollback.

### Ordering gate: R2 before Pages (`image_order`)

A new exam's images must be on R2 before the student site that references them goes live. Release step `image_order`
(`tools/ci/archive-pages-image-r2-gate.mjs`, required in the Pages release gate, `continue-on-error` like the other
verifications, step cap 15 min):

1. Take the images added, modified or renamed (`git diff --diff-filter=ACMR`) between the latest successful
   github-pages deployment (the same base `worker_order` uses; fallback: the push's `before` SHA) and HEAD.
   Unknown/unreachable base: every image in HEAD is verified (fail closed, never skipped).
2. `HEAD https://img.wangjiedu.com/exams/images/<encoded key>` for each (16 in parallel). 200 = present.
3. Missing ones are retried every 30 s for up to 14 minutes, while `r2-archive-assets-copy.yml` (started by the same
   push) finishes. Still missing at the end: the step fails, the release gate fails, `deploy` does not run and the
   previous verified site stays live. Fix by running Actions > R2 Archive Assets Copy > Run workflow on main and then
   re-running the release.
4. No image change in the range: passes at once with no network request.

Presence only, not bytes: a modified image keeps its R2 key, so it counts as present until the copy overwrites it.
Git main merges never wait for this gate. Tests: `tests/archive-pages-image-r2-gate.test.mjs`.

### Rollback (ship the images from Pages again)

Fast path, all in one PR (the Worker and the Pages release redeploy automatically from main):

1. `tools/archive-pages-release-manifest.json`: delete `"exclude": ["images"],` from the `archive/assets` tree. Update
   the two assertions in `tests/archive-pages-site-package.test.mjs` / `tests/archive-pages-image-r2-gate.test.mjs`
   that pin the exclusion (they say so in their messages).
2. Pages now carries the images again, so the browsers' one-time same-origin fallback works again for any R2 failure.
   If R2 itself is the problem, also set `DEFAULT_EXAM_IMAGE_BASE = ''` in `archive/archive-asset-base.js` (bump the
   `?v=` of every page that loads it) so every page uses the Pages copy directly.
3. Worker: set the `EXAM_IMAGE_BASE_URL` variable to `""` in `apmath/worker-backup/worker/wrangler.jsonc` (`vars`) so
   saved papers read the Pages copy. Without this change the Worker still tries R2 first and falls back to Pages.
4. The size headroom is about 99 MB with the images shipped: the package fits again (900.7 MB of 1,000 MB).

Emergency without a package change: `r2-archive-assets-copy.yml` is the only R2 writer; the `image_order` gate can be
bypassed only by removing it from `--required` in the workflow (not recommended: students would see broken figures).

## The setting

`archive/archive-asset-base.js` -> `DEFAULT_EXAM_IMAGE_BASE` (`'https://img.wangjiedu.com'`; `''` goes back to
same-origin Pages URLs, which no longer contain the images). Everything calls `resolveExamImageUrl(path)` from that file:

- `assets/images/<examFolder>/<file>`, `archive/assets/images/...`, `../assets/images/...` and the absolute
  `https://icefoxtail.github.io/AP------/archive/assets/images/...` forms are mapped; the bare
  `<examFolder>/<file>` key is mapped when the caller passes `{ bareKey: true }`.
- `https://img.wangjiedu.com`: `<base>/exams/images/<examFolder>/<file>` (each segment percent-encoded, a `?v=`
  cache-buster query is kept). An empty base returns the input string untouched.
- An external image that fails to load falls back ONCE to the original same-origin URL (capture-phase `error`
  listener; the first error is swallowed so readiness code only sees the fallback outcome). Successful loads
  are never requested twice. Since 2026-11-01 the Pages host has no exam images, so this fallback only helps after
  a rollback; a CORS failure (origin not allowed by the bucket) now shows a broken image instead of the Pages copy.
- Not mapped: `assets/generated-lite/...`, textbook images beside their source JS, `assets/solutions/...`.
- Teacher QA override (ignored on student pages: `/apmath/student/`, `studentReview=1`; `apmath/student` also
  clears the stored key on load). It is stored in `localStorage["ap.examImageBase.qa"]` so preview iframes and
  print windows opened afterwards use it too:
  - `?assetBase=off` forces same-origin images (stored as `off`),
  - `?assetBase=https://other.base` uses another base,
  - `?assetBase=default` (or empty) forgets the override.
  An unusable value (http, typo) is ignored.

## CORS mode of the `<img>` elements

External exam images are requested with `crossorigin="anonymous"` on http(s) pages
(`examImageCrossOriginAttr(url)` for `<img>` templates, `examImageCrossOrigin(img, url)` for elements, both from
the module). Reason, measured in Chromium against the real bucket: a plain (no-cors) load is cached WITHOUT
`Access-Control-Allow-Origin` (that response has no `Vary`), so every later CORS read of the same URL within the
4 hour `max-age` fails. html2canvas (`useCORS`) then printed blank boxes for every figure and
`print_image_optimizer.js` skipped every image. With CORS-mode images both work and the figures are pixel
identical to the same-origin pages.

Where it is applied: `engine.html`, `mixed_engine.html` (question image, solution image and inline images
normalised by `normalizeQuestionImageSources`) and `wrong_print_engine.html` (same cache URL `?v=20261014.1` as
the engines, so a plain load there would poison the engines' CORS loads). Display-only consumers (`mixer`,
`problem-bank-search`, `generated-bank`, `apmath` archive-render / report-center) use other URLs (no `?v=` or
`?v=20260828.1`), never read pixels and keep plain loads. `file://` pages skip the attribute.

If the page origin is not allowed by the bucket (a localhost dev server, `www.wangjiedu.com`, a preview
deployment), the CORS request fails and, with the Pages copy gone, the figure does not load. Serve such a page from
a repository checkout (which still has `archive/assets/images`, so the one-time fallback works) or add the origin to
the bucket CORS (`cors-exam-images.json`).

## Consumers wired to the module

archive: `engine.html`, `mixed_engine.html` (every `q.image`, `q.solutionImage`, inline `<img>` and render-authority
asset resolver goes through `withArchiveAssetCacheBuster`), `mixer.html`, `problem-bank-search.html`,
`generated-bank.html`; `workspace.html`, `unit-past-exams.html`, `index.html` load it so `?assetBase` persists and
their engine iframes / print windows inherit it. apmath: `js/archive-render.js`, `js/report-center.js`,
`wrong_print_engine.html` (used by `js/clinic-print.js`); `apmath/student` only opens the archive engines.
Not changed: `internal-review-engine` (local files via the File System Access API), `assets/generated-lite`.
The Worker's server-side image fetch (saved papers) moved to R2 on 2026-11-01, see above.

## R2 CORS (set by the owner, 2026-10-30)

Bucket CORS (allowed origins https://icefoxtail.github.io and https://wangjiedu.com): `cors-exam-images.json`.
Verify with `curl -I -H "Origin: https://icefoxtail.github.io" https://img.wangjiedu.com/exams/images/<key>`
(expects `access-control-allow-origin`; other origins get none). CORS is required where pixels or bytes are read:

| Path | Why |
| --- | --- |
| `archive/engine.html`, `archive/mixed_engine.html` raster print (`html2canvas`, `useCORS: true`, `allowTaint: false`; also `native_print.js` / `equal-slot-engine.js`) | html2canvas re-fetches each image in CORS mode; without CORS the figure is blank in the rasterised page |
| `archive/print_image_optimizer.js` | `drawImage` + `toBlob`; images not loaded in CORS mode are skipped (printed as they are). Exam images are now loaded in CORS mode, so they are flattened |

`apmath/js/report-print.js` (parent report PNG) renders no exam figures. Optional hardening on Cloudflare: a
response-header rule adding `Vary: Origin` to every `img.wangjiedu.com` response would stop a plain load from ever
poisoning the cache for CORS loads.
