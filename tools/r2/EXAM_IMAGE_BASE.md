# Exam image base URL (R2-ready, default unchanged)

Status (S20, 2026-10-30): the code can read exam images from Cloudflare R2 through ONE setting, but the
default is still empty, so every page keeps loading the same-origin images shipped in the Pages package.
Images stay in Git and in the Pages package; exam JS image paths are not rewritten.

## The setting

`archive/archive-asset-base.js` -> `DEFAULT_EXAM_IMAGE_BASE` (`''` today). Everything calls
`resolveExamImageUrl(path)` from that file:

- `assets/images/<examFolder>/<file>`, `archive/assets/images/...`, `../assets/images/...` and the absolute
  `https://icefoxtail.github.io/AP------/archive/assets/images/...` forms are mapped; the bare
  `<examFolder>/<file>` key is mapped when the caller passes `{ bareKey: true }`.
- Default (`''`): the input string is returned untouched (byte-for-byte same URL as before).
- `https://img.wangjiedu.com`: `<base>/exams/images/<examFolder>/<file>` (each segment percent-encoded, a `?v=`
  cache-buster query is kept).
- An external image that fails to load falls back ONCE to the original same-origin URL (capture-phase `error`
  listener; the first error is swallowed so readiness code only sees the fallback outcome). Successful loads
  are never requested twice.
- Not mapped: `assets/generated-lite/...`, textbook images beside their source JS, `assets/solutions/...`.
- Teacher QA override: `?assetBase=https://img.wangjiedu.com` is stored in `localStorage["ap.examImageBase.qa"]`
  so preview iframes and print windows opened afterwards use it too; `?assetBase=off` clears it. Ignored on
  student pages (`/apmath/student/`, `studentReview=1`), and `apmath/student` clears the key on load.

## Consumers wired to the module

archive: `engine.html`, `mixed_engine.html` (every `q.image`, `q.solutionImage`, inline `<img>` and render-authority
asset resolver goes through `withArchiveAssetCacheBuster`), `mixer.html`, `problem-bank-search.html`,
`generated-bank.html`; `workspace.html`, `unit-past-exams.html`, `index.html` load it so `?assetBase` persists and
their engine iframes / print windows inherit it. apmath: `js/archive-render.js`, `js/report-center.js`,
`wrong_print_engine.html` (used by `js/clinic-print.js`); `apmath/student` only opens the archive engines.
Not changed: `internal-review-engine` (local files via the File System Access API), the Worker (fetches
images server-side from Pages, no CORS), `assets/generated-lite`.

## R2 CORS (owner action, not done by code)

`window.print` and plain `<img>` display need no CORS. CORS is required where pixels or bytes are read:

| Path | Why |
| --- | --- |
| `archive/engine.html`, `archive/mixed_engine.html` raster print (`html2canvas`, `useCORS: true`, `allowTaint: false`; also `native_print.js` / `equal-slot-engine.js`) | html2canvas re-fetches each image in CORS mode; without CORS the figure is blank in the rasterised page |
| `apmath/js/report-print.js` parent report PNG (`html2canvas`, `useCORS: true`) | report cards contain exam figures |
| `archive/print_image_optimizer.js` | `drawImage` + `toBlob`; cross-origin images without CORS are skipped (printed as they are) |

Bucket CORS JSON (allowed origins https://icefoxtail.github.io and https://wangjiedu.com): `cors-exam-images.json`.
Set it in Cloudflare R2 -> bucket -> Settings -> CORS policy BEFORE switching the default, then verify with
`curl -I -H "Origin: https://icefoxtail.github.io" https://img.wangjiedu.com/exams/images/<key>` (expects
`access-control-allow-origin`). As of 2026-10-30 the header is not returned.
