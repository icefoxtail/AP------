# ALIVE Source Recovery P1 Real-Source Offline Regression

- START baseline: `e6b8d692e77b45f94c072180e64ae809fdebe7f9`
- Policy: `SHADOW_AUTO_RECOVER`
- Authority: `SHADOW_ONLY`
- Gold freeze: `FROZEN_BEFORE_ENGINE`
- Gold freeze manifest SHA: `sha256:9f39b3ed85b32465e593bae871f45ef2b694e24f4df24eef3b3ddc6d000b7d6d`

## Denominators

| metric | count |
|---|---:|
| historicalDefectCandidateTotal | 115 |
| realSourceResolvedTotal | 23 |
| realSourceIncompleteTotal | 92 |
| realSourceNotFoundTotal | 0 |
| p1ActiveEvaluationTotal | 23 |
| r0ApplicableCount | 1 |
| r1ApplicableCount | 2 |
| r3DeferredCount | 1 |
| r5BlockedCount | 0 |
| r6DeferredCount | 1 |
| activeRecoveryAttemptCount | 3 |
| activeRecoveryPassCount | 3 |
| activeRecoveryFailCount | 0 |
| engineDiagnosisMismatchCount | 0 |

## Gold category counts

- `ANSWER_KEY_DEFECT`: 1
- `QUESTION_PAYLOAD_DEFECT`: 4
- `NO_DEFECT`: 18

## Gold freeze and independent review

- gold freeze status: `FROZEN_BEFORE_ENGINE`
- gold freeze manifest: `sha256:9f39b3ed85b32465e593bae871f45ef2b694e24f4df24eef3b3ddc6d000b7d6d`
- Solver A: source-only Gold adjudication with per-case session IDs.
- Verifier B: separate subprocess, candidate-only payload, separate verifier session IDs; no Gold/source answer passed.
- Validator: source/candidate parity and bounded mutation checks; ledger and release gate executed per case.

## Actual immutable source set

| case | immutable source | source page | Gold |
|---|---|---:|---|
| historical-seq-1134 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_금당고1_공통수학1_1중간.pdf | 3 | NO_DEFECT |
| historical-seq-1135 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_금당고1_공통수학1_1중간.pdf | 3 | NO_DEFECT |
| historical-seq-1136 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_금당고1_공통수학1_1중간.pdf | 3 | QUESTION_PAYLOAD_DEFECT |
| historical-seq-1137 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_금당고1_공통수학1_1중간.pdf | 3 | NO_DEFECT |
| historical-seq-1138 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_금당고1_공통수학1_1중간.pdf | 4 | NO_DEFECT |
| historical-seq-1139 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_금당고1_공통수학1_1중간.pdf | 4 | NO_DEFECT |
| historical-seq-1184 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_팔마고1_공통수학1_1중간.pdf | 1 | NO_DEFECT |
| historical-seq-1193 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_팔마고1_공통수학1_1중간.pdf | 3 | NO_DEFECT |
| historical-seq-1197 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_팔마고1_공통수학1_1중간.pdf | 4 | NO_DEFECT |
| historical-seq-1198 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_팔마고1_공통수학1_1중간.pdf | 4 | NO_DEFECT |
| historical-seq-1199 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_팔마고1_공통수학1_1중간.pdf | 4 | NO_DEFECT |
| historical-seq-1200 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_팔마고1_공통수학1_1중간.pdf | 5 | NO_DEFECT |
| historical-seq-1201 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_팔마고1_공통수학1_1중간.pdf | 5 | NO_DEFECT |
| historical-seq-1202 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_팔마고1_공통수학1_1중간.pdf | 5 | NO_DEFECT |
| historical-seq-1204 | external-source:D:/기출/(1)1중간/(1)1중간/공통수학1/2026_팔마고1_공통수학1_1중간.pdf | 6 | NO_DEFECT |
| historical-seq-784 | external-source:D:/기출/1학기중간/고1/23 부영여고+/수학 상 (23 부영여고).pdf | 5 | ANSWER_KEY_DEFECT |
| historical-seq-787 | external-source:D:/기출/1학기중간/고1/23 부영여고+/수학 상 (23 부영여고).pdf | 5 | NO_DEFECT |
| historical-seq-788 | external-source:D:/기출/1학기중간/고1/23 부영여고+/수학 상 (23 부영여고).pdf | 6 | NO_DEFECT |
| historical-seq-789 | external-source:D:/기출/1학기중간/고1/23 부영여고+/수학 상 (23 부영여고).pdf | 6 | NO_DEFECT |
| historical-seq-800 | external-source:D:/기출/1학기중간/고1/23 여수여고+/수학 상 (23 여수여고).pdf | 3 | QUESTION_PAYLOAD_DEFECT |
| historical-seq-939 | external-source:D:/기출/1학기중간/고1/24 한영고+/수학 상 (24 한영고).pdf | 5 | QUESTION_PAYLOAD_DEFECT |
| shape-movement-hyocheon-q19 | external-source:D:/기출/(3)2중간/수학(하)/2021_효천고1_2중간.pdf | 3 | QUESTION_PAYLOAD_DEFECT |
| visual-audit-source-blocked-q21 | external-source:D:/기출/(3)2중간/수학(하)/2021_복성고1_2중간.pdf | 6 | NO_DEFECT |

## Core-set case results

| case | gold | tier | engine status | ledger | release gate |
|---|---|---|---|---|---|
| historical-seq-1134 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1135 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1136 | QUESTION_PAYLOAD_DEFECT | R1 | RECOVERED | PASS | PASS |
| historical-seq-1137 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1138 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1139 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1184 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1193 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1197 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1198 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1199 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1200 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1201 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1202 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-1204 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-784 | ANSWER_KEY_DEFECT | R0 | RECOVERED | PASS | PASS |
| historical-seq-787 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-788 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-789 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |
| historical-seq-800 | QUESTION_PAYLOAD_DEFECT | R1 | RECOVERED | PASS | PASS |
| historical-seq-939 | QUESTION_PAYLOAD_DEFECT | R3 | RECOVERY_DEFERRED_CAPABILITY | PASS | BLOCKED |
| shape-movement-hyocheon-q19 | QUESTION_PAYLOAD_DEFECT | R6 | RECOVERY_DEFERRED_CAPABILITY | PASS | BLOCKED |
| visual-audit-source-blocked-q21 | NO_DEFECT | NONE | NOT_REQUIRED | PASS | PASS |

## Safety counters

- `BLIND_VERIFIER_INDEPENDENCE_VIOLATION_COUNT` = 0
- `VALIDATOR_SELF_PASS_COUNT` = 0
- `UNAUTHORIZED_ADOPTION_COUNT` = 0
- `SOURCE_ORIGINAL_MUTATION_COUNT` = 0
- `SHADOW_PUBLICATION_COUNT` = 0
- `DENOMINATOR_MUTATION_COUNT` = 0

## Readiness

- `IMPLEMENTATION_BASELINE_FREEZE` = `PASS`
- `P1_OFFLINE_REGRESSION` = `FAIL`
- `P2_SHADOW_READY` = `NO`
- `BOUNDED_PRODUCTION_READY` = `NO`
- `DEFAULT_PRODUCTION_READY` = `NO`
- `CANONICAL_READY` = `NO`

## Status

- Existing `reports/alive-source-recovery-p1-20260909/` is preserved as `NON_AUTHORITATIVE_HARNESS_RUN`; it did not supply Gold.
- This run resolves and evaluates a 23-case immutable-source core set only. Full P1 PASS is intentionally not declared until all real-source-resolved historical cases are processed.
