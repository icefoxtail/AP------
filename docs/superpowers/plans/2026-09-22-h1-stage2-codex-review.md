# H1 Stage 2 Semantic Repair Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Independently review all 1,170 H1 Stage 2 semantic rows against current source and solution, then commit only physical Codex review artifacts without changing semantic, production, canonical, compiled, or runtime data.

**Architecture:** First reconstruct the authoritative denominator by joining the current H1 source inventory to the branch's physical semantic ledgers. Then review each joined row in work-unit batches, recording item-level evidence and defects in a JSONL ledger. Finally run independent structural, hash, generator-guard, and Git-scope validation and materialize the summary/evidence artifacts.

**Tech Stack:** PowerShell, Node.js ESM, Git, JSON/JSONL, SHA-256.

**Spec:** User-pasted “CODEX 1차 전수검수 지시 — H1 Stage 2 Semantic Repair”.

## Global Constraints

- Review denominator is exactly 1,170 UID: Polynomial 217, Eq/Ineq 583, PermComb 287, Matrix 83.
- Script use is limited to join, counts, duplicates, hashes, completeness, queue creation, materialization, and validation; semantic values and verdicts are manually decided from current source plus solution.
- Do not modify existing semantic ledgers, source, production, canonical, compiled, or runtime files.
- Preserve unrelated pre-existing working-tree changes.
- Do not merge to main.
- Commit only the six requested/recommended physical review artifacts.

## Review Focus

- Eq/Ineq direct-repair rows: verify semantic role and conditions against the actual current problem and solution; record false positives as defects.
- PermComb counting rows: distinguish combination/permutation/counting from algebra and reject keyword-derived relational labels.
- Matrix rows: distinguish matrix-primary work from complex-number supporting ideas and reject unrelated range/optimization labels.
- Polynomial provenance: verify existing core semantics without treating generic backfill text as fresh evidence.
- HOLD and source/image dependencies: preserve actual routing state and never infer missing aggregate UIDs.

### Task 1: Reconstruct the review denominator and source join

**Files:**
- Read: `archive/_generated/intelligence/phase1/high1-foundation/h1_fresh_inventory.json`
- Read: `archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/H1_STAGE2_SEMANTIC_LEDGER_INDEX_1170.json`
- Read: all ledger/source-pack files listed by the index
- Create: `archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/H1_STAGE2_CODEX_REVIEW_INVENTORY.json`

- [ ] Verify UID/source identity uniqueness, source fingerprints, source and solution hashes, work-unit counts, and index-listed artifact existence.
- [ ] Preserve the branch's pre-existing image modifications and exclude them from the review artifact scope.

### Task 2: Perform item-level semantic review

**Files:**
- Read: current source content, choices, answer, solution, and image references for every joined UID.
- Create: `H1_STAGE2_CODEX_ITEM_REVIEW_1170.jsonl`
- Create: `H1_STAGE2_CODEX_DEFECTS.jsonl`
- Create/update: `H1_STAGE2_CODEX_REVIEW_CHECKPOINTS.json`

- [ ] Record all required review fields for every UID.
- [ ] Use PASS/WARN/FAIL/REVIEW_REQUIRED only after source+solution review; record specific evidence and next action.
- [ ] Give the 562 repair rows high-risk review treatment and independently review Polynomial provenance.

### Task 3: Validate artifacts and generator demotion

**Files:**
- Read: `materialize-h1-eqineq-ledger.mjs`, `backfill-h1-legacy-semantic-fields.mjs`, `repair-h1-permcomb-matrix-outliers.mjs`, `semantic-authority-guard.test.mjs`
- Create: `H1_STAGE2_CODEX_VALIDATION_EVIDENCE.json`
- Create: `H1_STAGE2_CODEX_REVIEW_SUMMARY.json`

- [ ] Run Node syntax checks and the authority guard test.
- [ ] Recompute rows, duplicates, missing fields, fingerprints, SHA parity, HOLD parity, and Git scope.
- [ ] Report any semantic generator leakage or systemic false-PASS family without modifying the source ledger.

### Task 4: Freeze and commit the physical review artifacts

- [ ] Re-read the final diff and verify only the requested artifact paths are staged.
- [ ] Commit with `review(meta-foundation): audit h1 stage2 semantic ledger`.
- [ ] Verify the commit, branch HEAD, and unchanged pre-existing image modifications.
