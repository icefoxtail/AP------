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

Commit: `84c972edc5a6a9796fe8cb28389df990f1d8fe86`

## S3 — Assignment Continuity

Status: PASS

Changes:

- Original and Saved Paper registration now treat `saved=true` with an Assignment ID as completed even when PDF generation fails. Each receipt shows its class name, exact Assignment ID, PDF status, and exam/solution/answer actions.
- PDF retry posts only to `/class-exam-assignments/:id/pdf`. It does not resubmit Assignment creation; PDF readiness no longer gates Assignment completion.
- Saved Paper and Original flows keep their completed receipt actions in place instead of reopening the legacy output engine and risking a duplicate registration.
- Completed Compose output reads the exact receipt Assignment ID and opens the mode-specific Output Envelope from its frozen Assignment snapshot. The old Saved Paper snapshot output path is bypassed once the receipt exists.
- Original parent receipts expose exact ID output actions and a PDF-only retry per class. Multi-class receipts display class name and Assignment ID together.
- The S1 standalone reader Back action now returns `studentReview=1` outputs to the student portal OMR list instead of the teacher recent-assignment workspace. Original engine mode changes in screen-fit mode reuse the already measured A4 body height only when the hidden probe reports zero, and keep failing closed when neither measurement exists. Mode-envelope routing is restored after the existing runtime commit so the exact new mode snapshot can be reopened.

Verification:

- Assignment handoff regression passed (6/6), including Original and Saved Paper `saved=true`/PDF failure, exact receipt output IDs, multi-class identity, PDF-only retry, and no engine re-registration.
- Screen-fit solution geometry and student return regressions passed; Compose scope/output regressions passed (43/43), reader/assignment/layout regressions passed (19/19), and Worker/D1 Saved Paper runtime passed ownership, immutable content, idempotency, rollback, multi-class identity, PDF failure retention, race guard, and soft-delete checks.
- The required student-portal output-envelope command passed (29/29). It covers Original, Saved Paper-backed Assignment, MIXED, `exam`/`ans`/`sol`, strict snapshot authority, no split-key fallback, and popup reservation.
- Actual desktop browser flow used a local-only mock API. A Saved Paper Assignment POST returned HTTP 502 with `saved=true` and exact receipt `assignment-s3-exact`; the UI showed Assignment saved and PDF pending. PDF retry made one POST to that exact Assignment's `/pdf` endpoint. The visible call log showed one Assignment POST and one PDF POST total. Opening solution made GET `/class-exam-assignments/assignment-s3-exact/output?mode=sol`; the standalone reader rendered the fixture's frozen question, answer, and solution and carried `assignmentId=assignment-s3-exact`. No production API was called.
- Actual desktop and 390px student flows used a local-only API fixture with storage writes to Original/MIXED split keys forced to throw. The completed Original card opened exam/solution/answer from `assignment-original-a`; switching exam→solution minted a new exact mode Envelope ID, preserved qpp/assignment identity, survived re-open, and Back returned to `/apmath/student/index.html?omr=1`. Saved Paper Assignment B and MIXED Assignment C opened exam/solution/answer with their own frozen question text; MIXED retained two questions in order. Original A, Saved Paper B, and MIXED C remained open concurrently without payload crossing. The portal API log contained reads only (zero Assignment POSTs and zero calls to the teacher-only output route); split-key write count was zero. All calls used mock responses; no production student or teacher API was contacted.
- The optional `archive-header-cache-browser.cjs` command could not start because this workspace has no `playwright` npm package. The same changed mobile Original route was checked in the real CUA browser at 390px, and source/cache query assertions plus targeted layout tests passed.

Commit: `83036546d051148a1a42c4655ba9bec4c8158943`

## Student Portal Regression Guard — S1 / S3 / S5 / S6

The user supplied hotfix `04db702784af64814c21d65cadd1944604733e13` is on current `origin/main`; the UX branch remains pinned to its original S0 base until final integration. S4's exact student Assignment deep link touches the same six hotfix files, so their current contents are deliberately preserved with the S4 student-flow changes and the app version is only advanced. Before final latest-main integration, verify the hotfix commit is an ancestor and all six files remain present.

Required acceptance:

- Exercise the actual student portal card → `openOmrReview` → `StudentArchiveReviewOutput` → Output Envelope → engine/mixed engine → answer/solution render path for past Original, Saved Paper-backed Assignment, and MIXED receipts.
- Verify completed/read-only history remains viewable, with exact `assignmentId`, frozen question/answer/solution bytes, UID order, and qpp preserved through mobile controls and mode changes. Catalog changes must not alter old receipts.
- Keep student auth and public output policy: student rendering must not call the teacher-only `/class-exam-assignments/:id/output` route.
- Keep fail-closed Envelope checks. Snapshot-backed receipts must not use `originalSnapshot` or split/generic storage fallback; fallback remains only for genuinely snapshot-less legacy Original data.
- Opening output and switching answer/solution must create zero Assignment POSTs and request zero reassignments; a valid snapshot must never show the expired-output message.
- Return to the student portal context without teacher workspace controls. Preserve app/service-worker version `2026.10.03.1` or newer.
- Add continuous desktop/mobile 390px browser smoke; cover quota with the new single-envelope path and two simultaneous A/B historic receipts without cross-payload mixing.
- Before final independent review status, verify hotfix ancestry and preserve/equivalently retain all six hotfix files.

Required targeted regression command:

`node --test tests/student-portal-output-envelope.test.cjs tests/student-portal-omr-review-ui.test.js tests/student-portal-mixed-review-payload.test.js tests/student-portal-live-update.test.js tests/student-portal-assignment-recipients.test.js tests/archive2-output-contract.test.cjs tests/archive2-output-transport.test.cjs`

Latest-base baseline note: the user reported an existing `tests/student-portal-omr-history-routes.test.js` Worker string expectation failure on the parent main. Keep that separate from new output regressions; independently reproduce and classify it during S6 if still present.

## S4 — Recent / Assignment

Status: PASS

Changes:

- Added the bounded `/class-exam-assignments/recent-summary?limit=1000` metadata route. It clamps the limit, returns lifecycle/PDF/count summaries without frozen output payloads, and leaves the compatible `?history=1` API intact.
- Recent and detail views use the shared `시험 | 해설 | 정답 | 학생별 확인` grammar and identify each exact Assignment ID. Cancelled, replaced, replacement, review-only, and PDF states are visible; PDF retry is available only when not ready or generating and posts only to the Assignment PDF endpoint.
- Student detail links include exact `student_id` and `assignment_id`. The student portal filters to that Assignment, shows its lifecycle state, and its output reader returns to the exact student/list context. Student app and service-worker versions advance to `2026.10.03.2`.

Verification:

- Archive UX regressions passed 68/68; Worker + D1 runtime passed bounded recent summary, compatibility history route, lifecycle metadata, recipient/submission counts, and omission of frozen payloads. Saved Paper 1/5/6/10/50 persistence still passed.
- Required student portal output-envelope regression command passed 32/32 after S4 changes; it covers immutable Original/Saved Paper/MIXED outputs, mode envelopes, identity, and student output access boundaries.
- Actual browser flow used local mock APIs at desktop and 390px: recent rows and detail modal showed exact IDs and lifecycle/PDF state; PDF retry sent one POST to the exact `/pdf` route; exact student link showed only the selected Assignment; solution output returned to the exact student and Assignment context. At 390px the recent cards stacked without horizontal overflow and the reader retained the compact `돌아가기 / 시험 ▾ / ⋯` controls and clean output body. Menu actions exposed print/PDF and new window; all fixture API requests stayed local.

Commit: pending stage close.

## S5–S6

Not started.
