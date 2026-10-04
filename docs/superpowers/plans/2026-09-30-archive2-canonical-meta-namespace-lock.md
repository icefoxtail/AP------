# Archive 2.0 Canonical Meta Namespace Lock Implementation Plan

> **For agentic workers:** This plan is executed inline in the current task. Keep all task changes in one final commit, as required by the repository isolation rule.

**Goal:** Prevent Archive 2.0 from exposing or selecting a question unless its registered source grade, reviewed taxonomy assignment, and current canonical parent all agree.

**Architecture:** Add one shared Archive2 canonical resolver used by the catalog builder, browser projection, and Worker validation. Publish a digest-bound input manifest for the catalog, RPM master, Meta Foundation runtime/bindings, and basic parent links so the browser and Worker can resolve the same final catalog version. Compose cards and selectable counts derive only from validated canonical parents; Worker checks all new saves against that version while preserving already-saved immutable snapshots.

**Tech Stack:** Browser/CommonJS-compatible JavaScript, Cloudflare Worker ES modules, Node built-in tests, JSON catalog and evidence artifacts.

**Spec:** `C:\Users\USER\.codex\attachments\a3f4ad77-e8c7-441a-ad66-031a64bfe73b\붙여넣은 텍스트.txt` plus the user's 2026-09-30 in-chat clarifications on grade conflicts, projection allowlists, reviewed assignment evidence, saved-paper delivery, version bundles, and UID-deduplicated impact counts.

## Global Constraints

- The source/exam registration and exact source identity/path determine actual grade; `effectiveBrowseGrade`, overlay, catalogSeed, and client input do not resolve conflicts.
- Production L1/L2 requires a verified assignment and exact current canonical membership.
- L3/L4 errors remove only advanced-filter capability; valid L1/L2 remains BASIC-eligible.
- Source labels, legacy keys, RAW values, suffixes, and label similarity cannot create production assignments or UI cards.
- The assignment fingerprint covers source identity, problem content, choices, and problem-image identity; answer and solution changes do not invalidate taxonomy approval.
- The shared manifest includes resolver-code version, catalog, canonical master, policy, overlay/binding/parent inputs, and a digest-indexed aggregate of exact reviewed item overrides.
- Preserve the current student's source/solution hard-defect and explicit semantic-hold gates.
- Existing saved papers keep their immutable snapshot for new-student delivery after server ownership, deletion, snapshot-integrity, and target-permission checks; editing and saving a new paper uses the current canonical gate.
- Do not bulk-edit question metadata, exam files, or canonical taxonomy in this work.
- Report candidate and exclusion totals by deduplicated question UID; state whether reason totals are overlapping or primary-reason counts.

## Review Focus

- Registered grade and path/identity grade disagree or are missing: must return `SOURCE_GRADE_CONFLICT` or `SOURCE_GRADE_UNRESOLVED` and never infer from catalogSeed.
- Assignment evidence is stale, incomplete, or only carries `reviewed_pass`: must fail closed with an auditable reason.
- Catalog, overlay, canonical master, bindings, and parent links have mixed versions: new composition/save must request refresh; saved snapshot reading/delivery remains available.
- L3/L4 has a wrong parent: advanced filtering must reject it while the valid BASIC parent remains selectable.
- One UID matches multiple exclusion reasons or scopes: visible counts and total exclusions remain UID-deduplicated and match the actual selection pool.

---

### Task 1: Shared source-grade and canonical-assignment validator

**Files:**
- Create: `archive/archive2-canonical.js`
- Modify: `archive/archive2-core.js`
- Test: `tests/archive2-canonical-lock.test.mjs`
- Test: `tests/archive2-core.test.cjs`

**Interfaces:**
- Produces `Archive2Canonical.resolveSourceGrade({ registeredGrade, sourceFile, identitySourceFile }) -> { grade, status, reason }`.
- Produces `Archive2Canonical.assignmentFingerprint(question) -> Promise<string>`, hashing `content`, `choices`, and problem `image` only with Web Crypto for browser/Worker parity.
- Produces `Archive2Canonical.validateBasicAssignment(record, authority) -> { ok, parent, reasons }` and `validateAdvancedAssignment(record, authority) -> { ok, reasons }`.
- `Archive2Core.basicEligibility(record, options)` and advanced matching consume the validator result from `options.canonicalAuthority`; they ignore stored validation booleans.

- [x] Write failing tests for exact grade agreement, grade conflict/unresolved, assignment identity/fingerprint/evidence/version failures, stale `l1l2ParentValid` booleans, canonical L1/L2 membership, stale optional metadata status with verified source integrity, and L3/L4 wrong-parent BASIC preservation.
- [x] Run `node --test tests/archive2-canonical-lock.test.mjs` and `node tests/archive2-core.test.cjs`; confirm expected failures.
- [x] Implement the shared validator and core integration.
- [x] Re-run both commands; require PASS.

### Task 2: Canonical-only catalog construction and versioned final projection

**Files:**
- Modify: `archive/tools/build-archive2-catalog.mjs`
- Modify: `archive/meta-foundation-runtime.js`
- Modify: `archive/archive2-workspace.js`
- Modify: `archive/workspace.html`
- Modify: `archive/archive2-core.js`
- Create: `archive/data/archive2-canonical-projection-policy.json`
- Create: `archive/data/archive2-item-review-overrides.json` (generated digest index)
- Create: `archive/data/archive2-canonical-input-manifest.json` (generated)
- Test: `tests/archive2-canonical-projection.test.mjs`
- Test: `tests/archive2-meta-advanced-filter.test.cjs`

**Interfaces:**
- Produces `Archive2Canonical.resolveCatalog({ versionBundle, assignmentEvidence }) -> finalCatalog`; catalog, canonical master, overlays, bindings, policy, and links are taken from the exact resources verified by the bundle loader.
- Produces `Archive2Canonical.loadInputBundle(fetcher, baseUrl, expectedVersion) -> { manifest, projectionVersion, files, resources }` for browser and Worker callers.
- Produces `Archive2Canonical.resolveSubjectProjection(record, projectionPolicy) -> projectionKey`, using only exact version-bound relations.
- Projection policy names exact approved Grade 1 course/unit equivalences and Grade 2/3 shared-namespace relationships, bound to the canonical master digest.

- [x] Write failing tests for source-only fallback removal, exact allowlisted projection, forbidden M3-to-H1/RAW projection, invalid catalogSeed, mixed-version input, stale browser version, and authority-file load failure.
- [x] Run the named tests; confirm expected failures.
- [x] Remove raw/category/label/suffix taxonomy fallback, make registered grade authoritative with path/identity cross-check, and use the shared resolver for overlay/catalogSeed joins.
- [x] Generate and verify the digest bundle from exact current input files. Set the final catalog version to the bundle ID.
- [x] Re-run the named tests; require PASS and exact browser projection parity.

### Task 3: Canonical-only Compose scopes, counts, and saved-scope restoration

**Files:**
- Modify: `archive/archive2-workspace.js`
- Modify: `tests/helpers/archive2-scope-harness.cjs`
- Modify: `tests/archive2-compose-scope.test.js`
- Modify: `tests/archive2-basic-scope-display.test.cjs`
- Modify: `tests/archive2-school-history.test.cjs`

**Interfaces:**
- `scopeOptions()` builds cards from canonical L1/L2 parents first, then attaches only UID-deduplicated records returned by `validateBasicAssignment`.
- `count` and `eligibleCount` use the active filters and existing quality gates; an invalid restored draft scope reports that the user must select the scope again instead of fuzzy remapping.

- [x] Add failing tests that source-only rows cannot create cards, invalid assignments do not appear in card counts or selected UIDs, and stored invalid scopes require reselection.
- [x] Run the two named tests and confirm expected failures.
- [x] Implement canonical-parent-first cards, UID-deduplicated selectable counts, and explicit stale-scope handling.
- [x] Re-run the tests; require PASS and no change to saved-paper viewing.

### Task 4: Worker parity, server save validation, and immutable saved-paper delivery

**Files:**
- Modify: `apmath/worker-backup/worker/helpers/archive2-questions.js`
- Modify: `archive/archive2-source.js`
- Modify: `apmath/worker-backup/worker/routes/archive2.js`
- Modify: the Archive saved-paper Worker route identified during implementation
- Modify: `tests/archive2-worker-validation.test.mjs`
- Modify: `tests/archive2-worker-runtime.mjs`
- Test: `tests/archive2-saved-paper-namespace.test.mjs`

**Interfaces:**
- Worker loads the exact manifest-listed inputs and calls `Archive2Canonical.loadInputBundle`.
- New paper creation/saving requires the current final-projection version and recomputes grade, assignment, canonical membership, and advanced parent validity on the server.
- Existing saved-paper delivery uses the immutable saved snapshot and retains owner/deletion/snapshot-integrity/target-permission checks without reapplying the current taxonomy gate.

- [x] Add failing tests for browser/Worker projection equality, request-version mismatch, client-provided taxonomy booleans being ignored, saved snapshot redispatch after taxonomy drift, and invalid saved-scope edit rejection.
- [x] Run the named tests and confirm expected failures.
- [x] Integrate the shared input loader/resolver, update new-save validation, and pin the saved-paper snapshot policy.
- [x] Re-run the tests; require PASS.

### Task 5: UID-deduplicated impact report and layer-attribution evidence

**Files:**
- Create: `archive/tools/report-archive2-canonical-impact.mjs`
- Create: `tests/archive2-canonical-impact.test.mjs`
- Create: `docs/reports/archive2-canonical-namespace-impact-20260930.json`
- Create: `docs/reports/archive2-canonical-namespace-impact-20260930.md`

**Interfaces:**
- The report compares source/raw, built catalog, and final overlay projections by UID, with grade/curriculum/course counts, BASIC/ADVANCED eligibility, existing quality holds, namespace/canonical/advanced failures, and stage-of-entry attribution.
- Total exclusions are unique UID counts; per-reason counts explicitly state whether they overlap or use one primary reason.

- [x] Write failing tests for duplicate-reason de-duplication, primary-reason totals, stage attribution, and report use of the final overlay.
- [x] Run the report tests and confirm expected failures.
- [x] Implement the report and produce the current impact artifacts without editing assignment data.
- [x] Validate report totals against the final resolved catalog and re-run the report tests.

### Final closeout

- [x] Run the focused Archive2 tests, affected META_V2 materializer/semantic-authority tests, and Worker Workerd/D1 runtime. No root `package.json` or repository-wide test runner is defined; this checkout has 561 independent test files, so the full unrelated suite was not run. The two pre-edit failures are recorded in the SDD ledger and replaced by contract-aligned assertions.
- [x] Review the changed implementation paths and full diff summary, check requirement coverage and scope, run `git diff --check`, and verify the source-pack manifest with `node archive/tools/build-archive2-catalog.mjs --check`. A separate reviewer-agent attempt hit the account usage limit; the diff and core flows were manually reviewed.
- [x] Re-fetch `origin/main`, compare relevant paths from initial base `8ff96e3d74aae0780e3e42a62c97e5685884d0aa`, and reconcile as main advanced to `7a1a30eecc15e0bb66439705f72db7ac1a16e5a5` and then `a452eb986f6ebb5ac63c87056aba7bd200915131`. Incorporated the latest META_V2 sidecar/registration inputs and regenerated catalog, digest manifest, and impact report.
- [ ] Create one final commit containing only this task's plan/code/tests/report artifacts and push the requested branch without force.
- [ ] Verify the pushed branch SHA and exact remote branch head.
