# M3 Quality-First Preflight

상태: **PREFLIGHT_PASS_WITH_PROVISIONAL_RUN_INVALIDATED**

- TARGET_GRADE: MIDDLE3
- TARGET_BRANCH: codex/metadata-foundation-m3
- START_SHA: 20b1de2dec92d30f6202e234cb9f54ac90789b83
- 이전 provisional run HEAD: abc87ea5f14e814e361beb8d77693d5442739df7
- CURRICULUM_SCOPE: 2015/2022 M3-1, M3-2
- 실제 fresh denominator: 69 original source files / 1,646 questions
- source curriculum resolution: 2015 = 1,646, 2022 = 0
- explicit scope HOLD: 2
- provisional canonical assignment: 1,644
- MULTI_AGENT: AVAILABLE
- B reviewer: agent 01a0a9c1-406b-75a0-8445-69a4bfd0fa0c (running)

## Preflight checks

- repository/branch/start SHA: PASS
- target-grade-only source scope: PASS
- content/choices/solution access: PASS
- validated image/SVG/table access: PASS
- shared material inventory: PASS
- identity UID/source fingerprint/DB count parity: PASS
- taxonomy authority: LOCKED
- Metadata Contract v2: LOCKED
- difficulty authority v1.3: LOCKED
- working tree at rerun start: CLEAN

## Important disposition

The earlier M3 metadata migration is retained as evidence but is **invalid for
Quality-First acceptance**. It is not used as ground truth and its recheck
records are not called independent review.

Confirmed preflight concerns to test in Gate 1/Gate 2:

1. Existing generation filters by queue/source unit before primary taxonomy
   classification. This can misclassify a source-unit M3-04 question whose
   decisive strategy is factorization or quadratic-equation application.
2. Existing keyword branches can choose L3/L4 from a single cue and then use a
   nearest/fallback path when the decisive concept is not established.
3. Existing difficulty is a structural heuristic and does not satisfy the
   evidence contract requiring decisive solution steps and reasons.
4. Existing independent_recheck is a second execution in the same context,
   not an independent B review.
5. Existing apply receipts must be replaced by recomputed checks; no parity
   flag is accepted solely because the writer set it to true.

No full-grade rerun is authorized until the initial blind pilot, root-cause
gate, regression lock, post-fix pilot, and B review are complete.
