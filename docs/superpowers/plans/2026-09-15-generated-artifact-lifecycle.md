# Generated Artifact Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make archive and ALIVE generated outputs converge on a success-cleanup/failure-retention lifecycle while protecting production/source assets and reporting every retained legacy output.

**Architecture:** Add a small fail-closed Node lifecycle helper for archive-side run directories and extend the existing Python `runtime_lifecycle` module for all ALIVE run families, including universal runs. Past Exam marks a staging run successful only after promotion has copied the approved production JS/assets and written its promotion receipt; ALIVE packages/seals finalize to compact result artifacts and quarantine verbose workdirs. Inventory and policy checks remain read-only unless an exact success marker or terminal runtime manifest authorizes cleanup.

**Tech Stack:** Node.js 22 built-ins (`node:fs`, `node:path`, `node:test`), Python 3 standard library, existing ALIVE runtime stores, existing archive policy checker, Git path-specific ignore rules.

**Spec:** `docs/superpowers/specs/2026-09-15-generated-artifact-lifecycle-design.md`

## Global Constraints

- Preserve existing dirty/staged/untracked files in the shared `main` checkout; only explicitly classified generated runtime output may be finalized by the retention operation.
- Never run `git clean`, `git reset`, `git stash`, `git restore`, `git checkout -- .`, `git add .`, or `git add -A`.
- Never ignore `*.svg`, `*.png`, `*.jpg`, `*.jpeg`, `*.webp`, `*.json`, `*.txt`, `*.html`, or `*.js` globally.
- Cleanup may operate only inside an exact generated root and only after an explicit success marker or a terminal runtime manifest passes the lifecycle gate.
- Held, active, manual-review, and failure runs are preserved; failure cleanup is retention-GC only and never immediate success cleanup.
- Production JS, production images/SVGs, pipeline/runtime source, manifests, DB/index, and fixed fixtures remain tracked and visible.
- Stage only exact files belonging to this task.

### Task 1: Add the failing archive lifecycle contract tests

**Files:**

- Create: `tests/generated-artifact-lifecycle.test.mjs`
- Read: `tools/archive/check-generated-git-policy.mjs`

**Interfaces:**

- Consumes: a temporary repository fixture and the planned lifecycle helper API.
- Produces: RED tests proving success-only cleanup, canonical preservation, failure retention, and generated-root inventory.

- [ ] **Step 1: Write the failing tests first.**

  Test these observable behaviors with a real temporary directory:

  1. A run under `archive/_generated/test-run` with `.lifecycle.json` status `ACTIVE` is not removed by `cleanupGeneratedRun`.
  2. A run marked `SUCCEEDED` removes its declared TEMP files, preserves `reports/production_promotion_receipt.json` and the lifecycle marker, and reports exact file/byte counts.
  3. A failed run remains byte-for-byte present when cleanup is requested in success mode.
  4. A path outside `archive/_generated`, `archive/exams/_generated`, or `archive/tools/logic-visual-audit/reports` is rejected.
  5. `inventoryGeneratedArtifacts` counts the four generated roots without treating production `archive/assets/images/*.svg` as generated.

  Expected API:

  ```js
  import {
    cleanupGeneratedRun,
    inventoryGeneratedArtifacts,
    writeGeneratedLifecycle,
  } from '../tools/archive/generated-artifact-lifecycle.mjs';
  ```

- [ ] **Step 2: Run the focused test and confirm the expected RED failure.**

  Run:

  ```powershell
  node --test tests/generated-artifact-lifecycle.test.mjs
  ```

  Expected: module-not-found or missing export. Do not add implementation before observing this failure.

### Task 2: Implement the archive lifecycle helper

**Files:**

- Create: `tools/archive/generated-artifact-lifecycle.mjs`
- Test: `tests/generated-artifact-lifecycle.test.mjs`

**Interfaces:**

- Consumes: repository root, exact run directory, and explicit canonical relative paths.
- Produces:
  - `GENERATED_WORKSPACE_ROOTS`
  - `writeGeneratedLifecycle(runDir, payload)`
  - `readGeneratedLifecycle(runDir)`
  - `markGeneratedRun(runDir, status, patch)`
  - `cleanupGeneratedRun({ repoRoot, runDir, mode })`
  - `inventoryGeneratedArtifacts({ repoRoot, roots })`

- [ ] **Step 1: Implement path and status validation.**

  Normalize repository-relative paths with POSIX separators. Resolve the real path, require it to stay under one of the exact generated roots, reject `archive/exams/original`, `archive/assets/images`, `archive/db.js`, `archive/question-index.js`, and reject a missing or malformed lifecycle marker.

- [ ] **Step 2: Implement lifecycle metadata writes.**

  Write `.lifecycle.json` atomically with fields `{schemaVersion, runId, producer, status, tempPaths, canonicalPaths, createdAt, updatedAt}`. Default new runs to `ACTIVE`, set `FAILED` without deleting any path, and set `SUCCEEDED` only from a caller that has already completed its downstream promotion gate.

- [ ] **Step 3: Implement success-only cleanup.**

  Enumerate only `tempPaths` (never a broad root glob), verify every path remains inside `runDir`, delete files/directories explicitly listed, remove empty temporary directories, preserve canonical paths and `.lifecycle.json`, and return `{status, removedFiles, removedBytes, retainedPaths}`. A failed/active/held run returns `SKIPPED` with a reason and performs no deletion.

- [ ] **Step 4: Implement read-only inventory.**

  Recursively count files, bytes, extensions, tracked files, and ignored files under configured generated roots. Record unclassified legacy directories instead of guessing their lifecycle status. The inventory must be safe to run against the shared `main` checkout.

- [ ] **Step 5: Run the focused test to GREEN.**

  Run the same `node --test` command and confirm all lifecycle tests pass.

### Task 3: Connect Past Exam success to archive cleanup

**Files:**

- Modify: `archive/tools/past-exam-pipeline/run-one-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/promote-reviewed-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/tests/hardening.test.mjs` or create `archive/tools/past-exam-pipeline/tests/lifecycle.test.mjs`

**Interfaces:**

- Consumes: the archive lifecycle helper and existing promotion receipt.
- Produces: active/failed/succeeded staging metadata and cleanup after successful promotion only.

- [ ] **Step 1: Add a lifecycle marker when `runOneExam` creates its generated output.**

  Use the configured `outputDir` as the run directory. Mark extraction output `ACTIVE`; on helper exceptions mark `FAILED` and leave the output for review/debug. Do not delete `manual_review`, `partial`, or `blocked` outputs.

- [ ] **Step 2: Add a regression test that failed/partial extraction remains.**

  Run the existing Past Exam test fixture with a helper failure, assert the lifecycle status is `FAILED` or `ACTIVE` as appropriate, and assert the candidate/reports remain present.

- [ ] **Step 3: Mark the staging run successful only after the existing production copy and receipt write complete.**

  In `promote-reviewed-exam.mjs`, preserve the current production authority checks and copy operations. After the receipt is written and production paths exist, call `markGeneratedRun(..., 'SUCCEEDED', {canonicalPaths: ['.lifecycle.json', 'reports/production_promotion_receipt.json']})` and `cleanupGeneratedRun`. Keep the receipt and lifecycle marker as the minimum canonical lineage; remove candidate/pages/crops/reports that are TEMP.

- [ ] **Step 4: Test success cleanup with a temporary promotion fixture.**

  Assert production JS/assets survive, candidate/page/review files are removed, the receipt survives, and a second cleanup call is idempotent.

- [ ] **Step 5: Run the Past Exam syntax and tests.**

  ```powershell
  npm --prefix archive/tools/past-exam-pipeline run check
  npm --prefix archive/tools/past-exam-pipeline test
  ```

### Task 4: Extend ALIVE lifecycle finalization to universal runs

**Files:**

- Modify: `alive/engine/runtime_lifecycle.py`
- Modify: `alive/engine/alive_cli.py`
- Modify: `alive/engine/tests/test_runtime_lifecycle.py`

**Interfaces:**

- Consumes: existing `RunStore` manifests and package verification.
- Produces: automatic success cleanup for universal sealed runs and safe retention GC across all runtime families.

- [ ] **Step 1: Add failing tests for universal terminal cleanup.**

  Add a fixture with `status='SEALED_LOCAL'` and `final/universal-run-package.zip`. Assert `finalize_run` copies and CRC-checks the package into the compact result root, moves the verbose run to quarantine, and is idempotent. Assert parser support for `--runtime-kind universal`, `--keep-workdir`, and result/quarantine roots.

- [ ] **Step 2: Run the focused Python tests and confirm RED.**

  ```powershell
  python -m unittest alive.engine.tests.test_runtime_lifecycle
  ```

- [ ] **Step 3: Implement the minimal runtime changes.**

  Add `SEALED_LOCAL` and the universal package filename to the existing lifecycle contract. Add `universal-runs` to discovery and `universal` to `--runtime-kind`. Keep active/held protection and dry-run defaults unchanged. Successful terminal workdirs are removed after compact result verification; FAILED/BLOCKED debug workdirs are moved to quarantine.

- [ ] **Step 4: Connect seal/finalizer commands to cleanup.**

  Add `add_package_cleanup` to universal seal/finalizer commands. After a PASS seal, call `_finalize_packaged_run`; on HOLD/FAIL return without cleanup. Include cleanup details in the JSON response.

- [ ] **Step 5: Run the focused Python tests to GREEN.**

  ```powershell
  python -m unittest alive.engine.tests.test_runtime_lifecycle
  ```

### Task 5: Update the durable policy and inventory/retention documentation

**Files:**

- Modify: `docs/rules/02_PIPELINES/GENERATED_ARTIFACT_GIT_POLICY_v1.md`
- Modify: `docs/rules/00_RULES_INDEX.md` only if the lifecycle entry is missing
- Modify: `docs/rules/MANIFEST.md`
- Modify: `docs/superpowers/specs/2026-09-15-generated-artifact-lifecycle-design.md`

**Interfaces:**

- Consumes: implementation behavior and fresh producer/consumer inventory.
- Produces: current operational classification, success/failure cleanup contract, retention rules, and exact manifest hash.

- [ ] **Step 1: Add the lifecycle sections to the policy.**

  Document TEMP_GENERATED, CANONICAL_GENERATED, PRODUCTION/SOURCE, success cleanup, failure retention, universal ALIVE coverage, Past Exam promotion boundary, and the A-F validation cases. Explicitly state that filename vocabulary never grants canonical status.

- [ ] **Step 2: Update `docs/rules/MANIFEST.md` with the exact byte count/SHA-256.**

  Recompute the changed policy entry and confirm every unchanged manifest entry still matches the working tree.

- [ ] **Step 3: Run policy tests and source-pack checks.**

  ```powershell
  node --test tests/archive-generated-artifact-git-policy.test.mjs tests/generated-artifact-lifecycle.test.mjs
  node tools/archive/check-generated-git-policy.mjs --jeilgo
  ```

### Task 6: Run a representative pipeline and clean safe accumulated runtime outputs

**Files:**

- Read-only input: current shared `C:\Users\USER\Desktop\AP------` generated/runtime directories
- Modify only exact terminal generated run directories proven safe by the runtime manifest
- Do not touch: existing production SVG modification, existing untracked fixture/test/plan files, unknown archive run with no success marker

**Interfaces:**

- Consumes: producer/consumer inventory, lifecycle status, and retention threshold.
- Produces: fresh A-F verification evidence, actual cleanup counts/bytes, and a list of retained unknown/active/canonical output.

- [ ] **Step 1: Snapshot inventory before cleanup.**

  Run the lifecycle inventory against the shared checkout and record counts/bytes by root, extension, status, and Git state. Do not delete unknown legacy output.

- [ ] **Step 2: Run a representative Past Exam route without external provider dispatch.**

  Use the current documented manifest only if it is executable and source-bound. Otherwise run the deterministic pipeline syntax/contract checks and record the representative execution as `BLOCKED`/`MANUAL_REVIEW` rather than inventing a successful production run.

- [ ] **Step 3: Run ALIVE runtime GC dry-run.**

  Confirm only terminal `SEALED_LOCAL`/`FAILED` runs older than the explicit retention threshold are candidates; active, held, and unknown-manifest directories are skipped.

- [ ] **Step 4: Apply cleanup only to safe sealed terminal runs.**

  Apply the existing runtime finalizer to exact universal sealed runs in the requested generated scope. Preserve compact results and remove successful verbose workdirs; retain only failure/debug workdirs in quarantine. Do not touch the unrelated dirty paths or unclassified archive staging.

- [ ] **Step 5: Re-run inventory and Git/source protections.**

  Verify production JS/image/SVG existence, tracked state, and non-ignored state; verify generated SVG/PNG probes remain ignored; verify no active/held run disappeared; and compute removed file/byte counts.

### Task 7: Full verification, review, commit, push, and integration gate

**Files:**

- Review only: exact branch diff and status

- [ ] **Step 1: Run all relevant tests.**

  ```powershell
  node --test tests/archive-generated-artifact-git-policy.test.mjs tests/generated-artifact-lifecycle.test.mjs
  python -m unittest discover -s alive/engine/tests -p 'test_*.py'
  npm --prefix archive/tools/pipeline-core test
  npm --prefix archive/tools/past-exam-pipeline run check
  npm --prefix archive/tools/past-exam-pipeline test
  ```

  Record the pre-existing native SVG dependency setup separately from repository changes.

- [ ] **Step 2: Request read-only code review of the branch diff.**

  Review against this plan and the design spec. Fix all Critical/Important findings and rerun the affected tests.

- [ ] **Step 3: Stage exact files and commit.**

  Use explicit path arguments only. Verify `git diff --cached --name-only` contains no production asset or unrelated dirty path, then commit with a lifecycle-specific message.

- [ ] **Step 4: Push the branch and verify remote identity.**

  Push `codex/generated-artifact-lifecycle`, verify the remote branch head and unique commit count, and record the review status. Do not force-push.

- [ ] **Step 5: Merge only after review PASS.**

  Attempt a fast-forward-safe merge into `main` only if the shared main checkout can accept it without touching its existing dirty files. If Git refuses because of pre-existing dirty/overlapping work, preserve main and report the exact blocker instead of resetting/stashing/cleaning.

- [ ] **Step 6: After a successful merge/push, verify unique commit count is zero, then remove the local/remote work branch only when no uncommitted worktree data would be lost.**
