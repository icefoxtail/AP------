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

## S2–S6

Not started.
