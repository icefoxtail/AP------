# PROBABILITY_STATISTICS GPT → CODEX HANDOFF — 2026-09-21

## 0. Branch / authority

- branch: `codex/meta-foundation/probability-statistics`
- BASE_MAIN_SHA: `843d26d60780ae1502dd53d75c8f2b064b98174f`
- main mutation at handoff creation: 0
- this branch was created from the exact BASE_MAIN_SHA above
- current user scope is narrower than the general Meta Foundation closure:
  1. synchronize exactly two repaired-question fingerprints
  2. recompute only the directly related top-level digest(s)
  3. regenerate `archive/data/archive2-catalog.json` in a scope-locked way
  4. confirm q7/q13 `sourceStatus == VERIFIED`
  5. stop
- DO NOT rerun the 704-question semantic review, taxonomy, difficulty, or full builder as a substitute for this bounded continuation.
- DO NOT merge to main. Finish and push branch only; GPT will independently review `main...branch`.

Before continuing, read:
- Notion: `GPT 작업 전 필독 라우터`
- Notion: `Archive 2.0 / JS Archive 시작 페이지`
- Notion: `Meta Foundation 장기 진행 현황`
- Git: `docs/rules/02_PIPELINES/CODEX_Meta_Foundation_단원정리_실행프로토콜_v1.md`
- Git: `docs/rules/00_RULES_INDEX.md`
- Git: `docs/rules/MANIFEST.md`
- Git canonical Meta Foundation / difficulty / L1-L2 rules routed by those documents

## 1. Frozen denominator and completed semantic work

PROBABILITY_STATISTICS source scope:
- 31 files
- 704 questions
- final mapped/reviewed candidate: 704/704
- HOLD: 0
- manual_review: 0
- difficulty UNKNOWN: 0
- final taxonomy: L3 15 / L4 31
- final difficulty buckets: 190 / 291 / 161 / 59 / 3
- final semantic freeze SHA:
  `ff95e5e885c401691251010264f30ae39589b419354d3946ee62c2ba37ea2f0e`

Do not redo this work unless current branch evidence proves an actual inconsistency.

## 2. Completed staged materialization checkpoints

### Stage 1 — identity materialization

- A 341 + B 363 = 704 frozen rows
- questionUid join: 704/704
- ledgerUid unique: 704/704
- questionUid unique: 704/704
- source identity unique: 704/704
- missing/ambiguous: 0

### Stage 2 — candidate pack/evidence/runtime materialization

Isolated candidate result:
- tree: `5d3c6ff390926c7c0a7caf5f9d72b76cdbc322a7`
- canonical candidate pack files: 4
- evidence files: 3
- runtime candidate files: 1
- assignments: 704
- runtime rows: 704
- owned L3/L4: 14 / 27
- external FUNCTIONS_GRAPHS reuse: L3 1 / L4 4
- key collision: 0
- alias collision baseline: 0
- CrossConcept missing: 0
- Condition missing: 0
- parent/integration errors: 0

Important correction from this stage:
- H22-PS-04 does NOT require a new L2/subUnit.
- synthetic L2 creation is forbidden for this continuation.
- the real issue was Foundation binding/validator support for direct standard-unit → L3 binding.

### Stage 3A — direct binding + two source repairs + generic static validator

Isolated result:
- tree: `e03ce367356cdef91b605d684ec5af2219e696bd`
- main/branch/ref mutation at that stage: 0
- H22-PS-04 closed with `STANDARD_UNIT_DIRECT` bindings, no new L2
- direct items: 4
- bindings: 66
- assignments/runtime: 704 / 704
- candidate key collision: 0
- alias collision: 0
- failures: 0
- pack-generic static dry-run: PASS

Direct binding result:
- `PT_CONDITIONAL_PROBABILITY`: 3
- `PT_EVENT_INDEPENDENCE`: 1

## 3. Approved source repairs already mathematically closed

Only these two production questions are part of the bounded source repair.

### A. 25_금당고_2학기_기말_고2_확률과통계.js #7

Repair type:
- solution-only
- content unchanged
- choices unchanged
- answer unchanged
- metadata and all other question fields unchanged

Math closure:
- source graph is the piecewise density shape
  `(0,0) → (3,h) → (5,h) → (6,0)`
- normalization gives `h = 1/4`
- `P(0 <= X <= 2) = 1/6`
- therefore `P(2 <= X <= 6) = 5/6`
- final reviewed difficulty: Bucket 2, high confidence

New sourceFingerprint for the repaired question:
`8e09d6a2656266169147d3a46674eb82a16487ccb4342c3b91441dc0433f0718`

### B. 25_순천고_2학기_기말_고2_확률과통계.js #13

Repair type:
- solution-only
- content unchanged
- choices unchanged
- answer unchanged
- metadata and all other question fields unchanged

Math closure:
- telescoping-sum explanation contained an intermediate typo `1/5`
- correct value is `1/15`
- answer ④ = `1/15` remains unchanged
- final reviewed difficulty: Bucket 3, high confidence

New sourceFingerprint for the repaired question:
`b13d30e08cb87dbb2f68f28e845d5763978e4241f32d3733f1973b156fb0aad7`

## 4. Stage 3B projection checkpoint already completed

Isolated projection:
- tree: `50e3d7891e7a719392e02c3e8773a9e0ea45e39e`
- detached commit reference: `9d708a0fdd648461b725119133cbc0b93271fae1`
- this reference is provenance only; do not assume it is reachable from the remote branch

Compiled projection counts:
- L3: 128
- L4: 422
- CrossConcept: 88
- Condition: 6
- binding: 345
- alias: 177
- global duplicate/parent/binding/alias errors: 0
- compiled six outputs byte parity: 6/6, mismatch 0

Archive2 projection:
- candidate runtime direct UID join: 704/704
- missing UID: 0
- source identity mismatch: 0
- current catalog identity join before source-fingerprint sync: VERIFIED 704/704
- overlay automatic eligibility projection: 704/704

Global runtime projection:
- existing ACTIVE runtime: 1904
- candidate PROBABILITY_STATISTICS: 704
- projected total: 2608
- overlap with existing ACTIVE packs: 0
- duplicate UID: 0
- duplicate source identity: 0

## 5. Current exact checkpoint — fingerprint/catalog post-processing only

This is the ONLY unfinished portion to resume.

Already established:
1. the two repaired Stage 3B source artifacts recompute to the two fingerprints in §3 exactly.
2. current main sidecar metadata still carries the pre-repair fingerprints for those two records.
3. before repair, main metadata and catalog agreed, so both rows were `VERIFIED`.
4. after the approved solution-only repairs, exactly those two fingerprint approvals must move with the repaired source.
5. the main `question_metadata.json` has newer metadata updates than the currently checked-in `archive2-catalog.json`.

Therefore:

### HARD scope lock

DO NOT run the official full catalog builder directly and commit its whole result.

Reason:
- `archive/tools/build-archive2-catalog.mjs` reads the entire current `question_metadata.json`
- current metadata is newer than the checked-in catalog projection
- a full rebuild would absorb unrelated metadata changes across many rows
- that violates the user's explicit scope: q7/q13 fingerprint synchronization + directly related catalog projection only

The bounded continuation must use the current catalog as the base projection and replace only the data that is mathematically forced by these two repaired source rows plus required top-level hashes.

## 6. Confirmed hash contracts

### 6.1 Archive2 per-question sourceFingerprint

Official builder computes:

```js
sha256(JSON.stringify({
  content: question.content ?? null,
  choices: Array.isArray(question.choices) ? question.choices : null,
  answer: question.answer ?? null,
  solution: question.solution ?? null,
  image: question.image ?? null,
}))
```

Official source status:

```js
sourceStatus =
  validJoin && meta.sourceFingerprint === fingerprint
    ? "VERIFIED"
    : "HOLD";
```

Thus after metadata approval is synchronized to the repaired-source fingerprint, q7/q13 must become `VERIFIED`.

### 6.2 question_metadata top-level digest

Checkpoint verification established that the existing top-level `digest` equals:
- remove only the top-level `digest` field
- `JSON.stringify` the resulting object
- SHA-256 of that exact string

For the bounded update:
- modify only the two intended `records[*].sourceFingerprint`
- recompute the top-level digest with the same contract
- no reclassification or unrelated metadata rewriting

### 6.3 Archive2 indexVersion

Official `archive/tools/build-archive2-catalog.mjs` computes:

```js
sha256(JSON.stringify([
  core.VERSION,
  sourceHashes,
  sha256(rawBytesOfQuestionMetadataJson),
  identity.identityDigest,
  taxonomy,
  exams,
  records,
]))
```

The catalog is then column/dictionary packed for transport. Encoding is not semantic authority; decoded values must preserve the same fields.

## 7. Required bounded continuation

Proceed from here, not from Stage 1.

1. locate the exact two `question_metadata.json` records by canonical UID/source identity.
2. replace exactly their `sourceFingerprint` values with:
   - q7: `8e09d6a2656266169147d3a46674eb82a16487ccb4342c3b91441dc0433f0718`
   - q13: `b13d30e08cb87dbb2f68f28e845d5763978e4241f32d3733f1973b156fb0aad7`
3. recompute the metadata top-level digest using §6.2.
4. decode the CURRENT checked-in `archive2-catalog.json` and use it as the base.
5. change only the two affected catalog question rows and the two affected per-source hashes/top-level values that the official formula requires.
6. recompute `indexVersion` with the official formula, but preserve unrelated catalog projection rows exactly.
7. re-pack using the catalog's existing encoding contract.
8. diff-lock:
   - q7/q13 intended fields changed
   - required top-level hash/digest fields changed
   - no unrelated record semantic changes
   - no taxonomy reclassification
   - no 704-question re-review
9. verify q7 and q13:
   - `sourceFingerprint == approvedSourceFingerprint`
   - `sourceStatus == VERIFIED`
   - eligibility remains consistent with the bounded source repair
10. run only the narrow validation needed for these files.
11. checkpoint commit and push this branch.
12. STOP. Do not merge to main.

## 8. Expected branch handoff after Codex continuation

Codex should finish with:
- branch still `codex/meta-foundation/probability-statistics`
- main untouched
- exact changed-file list
- exact q7/q13 before/after fingerprint/status
- metadata digest before/after
- catalog indexVersion before/after
- proof that unrelated decoded catalog records did not change semantically
- test commands/results
- final branch HEAD

Then GPT performs independent review:
- `main...branch` full diff
- scope-lock verification
- q7/q13 actual source → fingerprint recomputation
- metadata digest recomputation
- catalog decode + two-row semantic diff
- indexVersion recomputation
- q7/q13 VERIFIED
- unrelated changes 0

No main merge before explicit user approval.
