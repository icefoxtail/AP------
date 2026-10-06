# Archive 2.0 responsiveness and output route audit

Date: 2026-10-06, Asia/Seoul. Scope: original Finder outputs, Compose interactions and previews, unit-ready outputs and assignment handoff, Saved Paper/Assignment shared output transport, and common source validation.

## Original source route correction

Commit `1926d56fe` restores the Archive 1 `engine.html?data=exams/<source>&mode=exam|sol|ans` route for original Finder buttons. It opens directly in the click handler. An original file no longer needs an IndexedDB/localStorage snapshot before the popup can navigate. Existing saved and generated papers still need their exact selected/frozen question snapshot.

## Additional confirmed fixes

1. Compose still spent roughly 0.57–0.75s recomputing quality checks, whole-archive all-match counts and the scope list during a single interaction. Reuse quality checks within one synchronous render; reuse the visible scope list only to interpret the clicked controls; use its already validated UID-deduplicated counts for the all-match distribution. Every new render and selection/review gate revalidates current data. The canonical parent target is normalized once per validation instead of once per candidate parent.
2. The first storage recovery could exceed localStorage's quota. Large snapshots, full primary IndexedDB, or a blocked/full fallback now use a bounded in-memory store and same-origin popup/iframe message transfer. Request ID, owner, random nonce, sender/origin, expiry and content hash remain checked. Small fallback records retain an atomic key when space permits. No split question/meta keys are added. Serialization failures remain explicit.
3. Unit-ready preparation still duplicated its whole question bank and metadata in legacy browser keys. Archive 2 ready mode now uses the shared envelope for preview, print and the embedded assignment handoff. The legacy non-ready route retains its existing behavior. The assignment consumer takes the exact received snapshot; server authorization and grade checks are unchanged.
4. Unit output caching returned expired requests and regenerated the creation timestamp on every preparation, defeating reuse. Keep a stable snapshot creation time and republish before expiry.
5. Compose waited for source preparation before acknowledging preview loading, and attached its iframe load listener after cleanup. Show progress immediately, attach the listener before navigation, and avoid blocking the new frame on old-request cleanup. Engine failure clears busy status rather than leaving an endless spinner.
6. Both engines initially showed an empty print area. They now show a loading status while source preparation/typesetting is in progress. Update cache versions in every consumer, including the previously missed unit-ready page.

## Measurements and browser evidence

- Node production-size regression: initial all-curriculum Compose render about 0.25–0.30s, specific curriculum about 0.08–0.15s, selected scope/count edits about 0.21–0.32s.
- Chrome after final control-list reuse: select all 200ms, clear 203ms, all-match distribution 191ms; unit grade selection 56ms. These are synchronous event times, separate from network or math typesetting.
- With IndexedDB output open forced to UnknownError and every output/legacy browser-key write forced to QuotaExceededError, original exam/solution/answer all rendered through the Archive 1 route.
- Under the same failures, a 6MB Saved Paper fixture rendered exam 6 pages and answer 1 page through the cross-window transfer, with the sealed hash/readiness checks passing.
- The actual first unit-ready paper rendered 12 pages under both storage failures. The assignment handoff also has an execution test confirming exact snapshot transfer without legacy keys. No real user assignment or production data write was performed by the browser audit.
- Run the browser audit with `node tests/archive2-interaction-browser-audit.cjs` using Playwright and Chrome. It serves the repository locally and injects storage failures only in its isolated test browser context.

## Verification and remaining limits

- Targeted interaction/transport/preview/unit regressions: 37/37 pass. The final targeted command includes the new primary-quota recovery case.
- Full repository runner completed: 202 pass / 15 fail, 217 commands in the runner snapshot used for that run. These are the same 15 pre-existing failures documented in `archive2-interaction-fix-20261006.md`; worker dependencies are present for this run. The later-added preview feedback check was run separately.
- Additional canonical selection/unit checks: 36 pass / 1 fail. `basic-scope parent-link generator verifies the canonical runtime contract` reports stale generated parent links. The unmodified-main comparison also reports stale parent links. The audit does not alter source classification or regenerate metadata to hide this existing issue.
- A dense 21-question solution still required about 11s to finish full pagination in the local cold-render test. About 10s was MathJax work in the existing staging/decision measurement passes, rather than storage or the button handler. The first screen now responds with loading feedback, but this patch does not claim instantaneous complete math pagination or change the mathematical layout algorithm.
- In-memory delivery is temporary and bounded (32 requests / approximately 64MB, allowing one larger request). A new consumer must receive its snapshot while the source window remains available. Loaded consumers retain their own validated copy; permanent Saved Paper/Assignment storage remains on the server.
