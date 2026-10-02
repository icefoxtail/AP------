# Implementation Plan

Base remains `95d01cef7f5aa30c1f49127cde271dc6867c66c4`; do not move or reset the branch to later `main` during implementation. Execute tests first for each phase.

1. **Envelope contract:** Add shared canonical serialization, SHA-256 creation/validation, and IndexedDB put/get/owner cleanup with explicit 30-minute TTL. Add contract and transport tests for version/hash mismatch, questions-only/meta-only input, stale generic keys, A/B isolation, expiry, quota/serialization rejection, and exact-record cleanup.
2. **P0 producer/consumer migration:** Migrate Archive2 compose, original, saved-paper preview/distribution, assignment reopen, and mixed-engine consumption to one envelope. Remove Archive2 legacy key fallback and all independent questions/meta writes. Keep unrelated legacy Archive1 engine routes intact.
3. **Capacity/PDF readiness:** Instrument distinct browser/Worker/Saved Paper/Assignment/PDF boundaries without combining their limits. Make required image load/decode, math readiness, exact envelope identity, positive page count, and no-overflow checks hard gates. Test in Worker runtime and browser-backed PDF flow.
4. **Direct actions:** Reuse Archive1 `goEngine` exam/sol/ans actions. Add direct historical Assignment reopen/output on board and recent rows, keyed by exact assignment/snapshot identity; retain assignment permission checks and QPP 4/6/8.
5. **End-to-end verification and commit:** Run targeted and relevant regression suites, real browser viewport/mode matrix, Worker runtime, and PDF success/failure matrix. Review the final diff, commit on this branch, then compare with current `origin/main` and integrate only after relevant drift review.
