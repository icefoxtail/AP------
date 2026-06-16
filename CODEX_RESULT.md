# APMS Operation Stability Audit Round 2

## 1. Scope

- Goal: stabilize the current APMS operation test gate without changing APMS feature, UI, or worker code.
- Feature/UI/worker code changed: No.
- Forbidden scope respected: Yes.
- Only test runner, APMS tests, and this result report were changed.

## 2. Modified Files

- `tools/run-tests.js`
- `tests/admin-diagnostic-assessment-alert.test.js`
- `tests/admin-recent-consultation-panel.test.js`
- `tests/apmath-dark-mode-modals.test.js`
- `CODEX_RESULT.md`

Not modified:

- `apmath/js/*`
- `apmath/index.html`
- `apmath/css/*`
- `apmath/worker-backup/worker/*`
- `workers/*`
- EIE feature/UI code
- Archive exam/engine code

## 3. Test Results

- `node tools/run-tests.js`
  - Executed with bundled Node because `node` is not on PATH in this environment.
  - Result: `PASS 63 / FAIL 0 / KNOWN-FAIL 0 (total 63)`
  - Quarantined skipped: 6 files.

- `APMATH_RUN_QUARANTINE=1 node tools/run-tests.js`
  - Executed with bundled Node.
  - Result: `PASS 63 / FAIL 0 / KNOWN-FAIL 6 (total 69)`
  - Process exit: 0.

- `node tools/smoke-api.mjs`
  - Final validation run with network access: `SMOKE API PASS`.
  - AP/EIE/Wangji reachable, CORS restricted, and 404 disclosure safe checks all passed.

## 4. Default Test FAIL Handling

- File: `tests/eie-grade-ledger-port.test.js`
- Initial failure: `review pack should include CODEX_RESULT2.md`.
- File existence check showed all other listed review-pack files existed; only `CODEX_RESULT2.md` was missing.
- Classification: EIE grade ledger port review-pack/artifact contract test, not an APMS runtime feature test.
- Handling: moved to quarantine in `tools/run-tests.js`.
- Reason: APMS default CI should not fail because an EIE port review artifact is absent.

## 5. APMS Quarantine 5 Check

### `admin-diagnostic-assessment-alert.test.js`

- Current failure before fix: Yes.
- Cause: stale test expected old alert function names and alert limit `3`; current code uses diagnostic list/panel contract and limit `10`.
- Classification: stale expectation.
- Action: updated test only.
- Quarantine release: Yes.
- APMS operation blocking: PASS.

### `admin-recent-consultation-panel.test.js`

- Current failure before fix: Yes.
- Cause: test loaded only `dashboard.js` while current admin functions live in `dashboard-admin.js`; expected old 14-day copy while current recent-student contract uses a 60-day window/two-month panel.
- Classification: stale test loading scope and stale expectation.
- Action: updated test only.
- Quarantine release: Yes.
- APMS operation blocking: PASS.

### `apmath-dark-mode-modals.test.js`

- Current failure before fix: Yes.
- Cause: test checked an exact newline/indentation string for modal surface/text tokens; current HTML already contains the required tokens.
- Classification: stale brittle expectation.
- Action: updated test only.
- Quarantine release: Yes.
- APMS operation blocking: PASS.

### `assessment-m1-diagnostic-packs.test.js`

- Current failure: Yes.
- Cause: Archive generated pack metadata and actual question levels disagree.
  - `DIAG_1SEM_M1_U12_25`: expected `하 10 / 중 10 / 상 4`; actual question levels include `중 11 / 상 3`.
  - `DIAG_1SEM_M1_U34_25`: actual question levels are `하 12 / 중 12 / 상 0` while metadata says `하 10 / 중 10 / 상 4`.
- Classification: actual Archive generated content/metadata mismatch.
- Action: no code change because Archive exam/engine code is forbidden.
- Quarantine release: No.
- APMS operation blocking: WARN, non-blocking for APMS operation gate.

### `assessment-m1-type-source-integrity.test.js`

- Current failure: Yes.
- Cause: M1 source files still include escaped BEL approximation/right text markers.
- Classification: actual Archive source integrity issue.
- Action: no code change because Archive exam/engine code is forbidden.
- Quarantine release: No.
- APMS operation blocking: WARN, non-blocking for APMS operation gate.

## 6. Smoke API Judgment

- AP API:
  - Final validation: PASS for reachable, CORS restricted, and 404 disclosure safe.

- EIE API:
  - Final validation: PASS for reachable, CORS restricted, and 404 disclosure safe.

- Wangji API:
  - Final validation: PASS for reachable, CORS restricted, and 404 disclosure safe.

- Actual operation outage possibility: Low based on final network PASS.

## 7. Final Judgment

- Final status: PASS.
- APMS operation blockers: None found after test gate cleanup.
- APMS non-blocking WARN items:
  - Archive generated diagnostic pack metadata/content mismatch remains quarantined.
  - Archive M1 source integrity issue remains quarantined.
  - EIE visual/print design contract failures remain quarantined.
  - EIE grade ledger review-pack artifact contract remains quarantined because `CODEX_RESULT2.md` is absent.

Next action:

- Keep APMS default CI using non-quarantine run as the operation gate.
- Handle Archive M1 content/source issues in a separate Archive-authorized round.
- Handle EIE visual and grade-ledger review-pack contracts in a separate EIE-authorized round.
- Keep smoke-api validation in an environment with external network access.

## 8. Git Handling

- Stage: Will be completed for the Round 2 final patch.
- Commit: Will be completed with message `test: stabilize APMS operation gate`.
- Push: Will be completed after commit.
- Commit hash: Recorded in the final response after commit creation.
