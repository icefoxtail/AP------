# Exam image base URL (R2 by default)

Status (2026-10-30): the default is switched to Cloudflare R2. Exam images load from
`https://img.wangjiedu.com` for students and teachers; the same images stay in Git and in the Pages package as
the fallback. Exam JS image paths are not rewritten. (Before this date the default was `''`, same-origin only.)

## The setting

`archive/archive-asset-base.js` -> `DEFAULT_EXAM_IMAGE_BASE` (`'https://img.wangjiedu.com'`; `''` goes back to
same-origin Pages URLs). Everything calls `resolveExamImageUrl(path)` from that file:

- `assets/images/<examFolder>/<file>`, `archive/assets/images/...`, `../assets/images/...` and the absolute
  `https://icefoxtail.github.io/AP------/archive/assets/images/...` forms are mapped; the bare
  `<examFolder>/<file>` key is mapped when the caller passes `{ bareKey: true }`.
- `https://img.wangjiedu.com`: `<base>/exams/images/<examFolder>/<file>` (each segment percent-encoded, a `?v=`
  cache-buster query is kept). An empty base returns the input string untouched.
- An external image that fails to load falls back ONCE to the original same-origin URL (capture-phase `error`
  listener; the first error is swallowed so readiness code only sees the fallback outcome). Successful loads
  are never requested twice.
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
deployment), the CORS request fails, the one-time fallback loads the Pages copy and printing still works; the
console shows CORS errors. Use `?assetBase=off` there to avoid the extra request.

## Consumers wired to the module

archive: `engine.html`, `mixed_engine.html` (every `q.image`, `q.solutionImage`, inline `<img>` and render-authority
asset resolver goes through `withArchiveAssetCacheBuster`), `mixer.html`, `problem-bank-search.html`,
`generated-bank.html`; `workspace.html`, `unit-past-exams.html`, `index.html` load it so `?assetBase` persists and
their engine iframes / print windows inherit it. apmath: `js/archive-render.js`, `js/report-center.js`,
`wrong_print_engine.html` (used by `js/clinic-print.js`); `apmath/student` only opens the archive engines.
Not changed: `internal-review-engine` (local files via the File System Access API), the Worker (fetches
images server-side from Pages, no CORS), `assets/generated-lite`.

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
