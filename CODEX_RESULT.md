# Archive Session Bridge Mobile QR Auth Hotfix Result

## Modified Files
- apmath/worker-backup/worker/index.js
- CODEX_RESULT.md

## Root Cause
- The archive pages already restore the AP Math OS session from `#apmsess`.
- The mobile app path restores a session that has `session_token` but no `raw_password`.
- The frontend correctly sends `Authorization: Bearer <session_token>` for `qr-classes`.
- The Worker entrypoint called `handleCheckOmr()` with `teacher = null` for `qr-classes`.
- Inside `routes/check-omr.js`, the local fallback verifier only supports Basic auth, so Bearer-only mobile bridge sessions received 401.

## Key Change
- For `/api/qr-classes`, `apmath/worker-backup/worker/index.js` now verifies the request through the shared `verifyAuth()` helper before calling `handleCheckOmr()`.
- `check-pin` and `check-init` still pass `teacher = null`; their public student flows are unchanged.
- Archive index/mixer frontend behavior from the previous hotfix is preserved:
  - `#apmsess` restore
  - no `raw_password` in URL
  - Bearer first, Basic fallback
  - general exam output available without login

## Verification Results
- Worker qr-classes Bearer path: PASS, static contract verified.
- check-pin/check-init public behavior: PASS, unchanged in the routing branch.
- AP dashboard -> archive/index session restore: PASS, existing code preserved.
- archive/index -> mixer session handoff: PASS, existing code preserved.
- mixer QR auth priority: PASS, Bearer first then Basic fallback preserved.
- session_token only mobile path: PASS by code path; live mobile runtime still requires deployed Worker.
- no-session fallback: PASS, general output remains available.
- URL hash removal: PASS, existing restore code preserved.
- mobile app/WebView: UNVERIFIED after Worker deploy.

## Commands Checked
- `git diff --check`
- `node --check apmath/worker-backup/worker/index.js`
- `node --check apmath/worker-backup/worker/routes/check-omr.js`
- `node tests/archive-subject-synonym-search.test.js`
- `node tests/assessment-grade-target-assignment.test.js`
- Worker qr-classes static contract check

## Known Separate Failure
- `node tests/assessment-grade-target-round5-1.test.js` still fails at the existing `archive/index.html: resolvedCount null` assertion.
- This failure predates and is outside the current Worker Bearer-routing fix.

## Remaining Risk
- The production mobile app will keep showing the QR auth fallback until the AP Worker is deployed with this change.
- Live mobile WebView verification was not run in this session.
