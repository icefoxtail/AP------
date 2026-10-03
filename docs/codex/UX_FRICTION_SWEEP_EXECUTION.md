# UX Friction Sweep — Execution Record

Base: `origin/main` `42c76d18899a3902f005e8fc6e7d60f5ff6f850f`
Branch: `codex/ux-friction-sweep`
Campaign status: in progress; stage commits stay local until independent UX review.
Mobile reading guardrail: [Notion 9-7](https://app.notion.com/p/3ec0e68bd69f81fcb26cf73a6f2130fc)

## S0 — Execution Baseline

Status: PASS

Changes:

- Guarded Saved Paper blueprint inserts now batch five rows (17 binds each), keeping every D1 statement under 100 binds.
- Unit Past loads `archive2-canonical.js` before `archive2-core.js` and uses the existing Output Envelope producer for embedded preview, standalone exam output, and assignment preview/output.
- Unit Past output metadata carries qpp. Its quick-filter projection maps canonical difficulty buckets 1→하, 2–3→중, 4–5→상 without changing the stored numeric bucket.
- Fifty-one selected questions remain split into 50 + 1 papers.

Verification:

- Worker + D1 runtime: Saved Paper assignment sizes 1/5/6/10/50 all committed and persisted matching question/blueprint counts. Local PDF generation returned the expected 502 because the test runtime has no Cloudflare Browser Rendering binding; assignment persistence passed independently.
- Bind-limit regression: guarded blueprint batches for 1/5/6/10/50 stay at or below 85 parameters.
- Unit Past core, UI, and runtime regressions passed; 51-question split regression passed.
- Playwright local browser flow: canonical catalog loaded, a new 12-question paper generated, the embedded preview rendered three pages, standalone exam opened with an Output Envelope and no `preview=1`, and the mocked assignment UI completed. The same source opened in `exam`, `sol`, and `ans` Envelope modes.
- At 1440×900 and 390×844, the generated Unit Past page had no horizontal overflow; the 390px preview was 360px wide and all three actions remained visible.
- Assignment HTTP calls in browser smoke were intercepted with fixture responses; no production assignment was submitted.

## S1 — Output Behavior

Status: PASS

Changes:

- Embedded Output Envelope previews now carry the existing `preview=1` contract. Standalone Finder, Saved Paper, Original, and Assignment output links omit it and keep their existing print action.
- Standalone readers get the compact mobile row from Notion 9-7: `돌아가기`, `시험/해설/정답`, and `더보기` with print/PDF and new-window actions. The existing A4 page tree, math/image engines, and embedded preview body remain in place.
- Mode changes mint an Output Envelope from the current envelope's exact source identity, owner, ordered question UIDs, metadata, and frozen questions. The existing engine renders the selected mode without fetching a new source.
- Mobile screen CSS intentionally reflows page geometry after render readiness. The shared fast-runtime now records the committed display geometry after that screen presentation settles and refreshes it after resize. Preflight still checks snapshot reuse, geometry, math, images, and equal-slot audit; the print stylesheet still controls A4 output. This avoids an unnecessary stale rebuild on mobile.

Verification:

- Targeted regressions passed: reader controls, output transport, envelope routing (17/17); Finder, Assignment handoff, and Saved Paper library (10/10). JavaScript syntax checks passed.
- Actual local browser flow at 390px: the reading body stayed clean; Back measured 98×44px, mode select 197×44px, More 48×44px, and each menu action 260×44px. Document scroll width did not exceed the 375px layout viewport (390px CSS viewport including the browser scrollbar).
- Same-source mode flow changed exam → solution → answer through new request IDs while retaining owner, q=12, qpp=4, and the same rendered question sequence. Mode-envelope unit tests assert exact sourceId, question UID order, snapshot, and ownership preservation.
- Two-tap mobile print reached `PRINT_READY` in a dry run with no dialog or snapshot rebuild; the desktop print button reached `PRINT_READY` in one click. Both exercised the existing safePrint/readiness path. The menu open/close itself did not change the output URL or trigger a source reload.
- Popup/back flow preserved its source page: opening output created a standalone reader, `새 창 열기` opened the same exact request envelope, and Back closed each child reader to its opener. The embedded preview smoke rendered three pages at 390px with zero reader controls and no horizontal overflow.
- Matched warm-cache timing at 390×844, device scale 1, same 12-question exam Output Envelope, exam mode, qpp=4, owner and request ID; baseline and S1 engine navigations alternated three times in the same browser context. Median first visible page: 821ms before / 805.9ms after. Median Output Envelope readiness: 827.8ms before / 815.4ms after. Observed ranges overlapped; no speedup is attributed to the toolbar change.

Commit: `4d64210b3ce09b003b40da1584d9f74a1c40e11e`

## S2 — Compose Save Continuity

Status: PASS

Changes:

- Compose retains the most recently confirmed Saved Paper IDs independently from the current save attempt. The IDs survive edits and draft restoration; a fresh Draft clears them. Draft-local state changed only; no backend schema changed.
- A confirmed save shows one Saved Paper action group per saved part. The primary action assigns that exact Saved Paper. Exam, solution, and answer actions fetch the Saved Paper detail and open a standalone Output Envelope built from its immutable snapshot.
- Editing after save keeps the prior Saved Paper actions visible and marks the current Draft as unsaved. After a later confirmed save, actions move to the new Saved Paper IDs.
- `RESULT_UNKNOWN` recovery now renders outside the inert editor and remains in the mobile sticky action bar. Existing same-batch lookup/retry behavior remains unchanged; the last confirmed Saved Paper stays distinct while the new result is unknown.

Verification:

- Targeted Compose regressions passed: cache version, save/edit continuity, unknown-result locking/recovery, and same-batch retry (5/5). Saved Paper library/envelope/control regressions passed (17/17), including direct mode output from an exact snapshot. JavaScript syntax and `git diff --check` passed.
- Actual browser flow at 1440px with the real catalog and a local mock API: generated and saved a one-question paper (mock Saved Paper `…0901`), opened its solution as a standalone exact-snapshot Output Envelope, edited the Draft title, and verified the prior Saved Paper actions remained while the Draft was marked unsaved.
- The second mock save returned 502 and the first batch lookup failed. At desktop, `RESULT_UNKNOWN` showed a recovery button outside `.workspace[inert]`; the prior `…0901` actions remained available. Recovery checked the same batch and retried it successfully as `…0902`.
- At 390px, the saved-paper assignment action measured 347×44px, the document had no horizontal overflow, and exam/solution/answer actions remained visible. Editing the Draft showed the unsaved state while preserving actions for `…0902`; opening answer produced `mode=ans`, q=1, from the saved snapshot title before the last edit. All API calls were intercepted by the local fixture; no production save or assignment was sent.

Commit: pending stage close.

## S3–S6

Not started.
