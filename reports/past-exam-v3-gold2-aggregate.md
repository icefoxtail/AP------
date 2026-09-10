# Past Exam V3 2차 GOLD pilot — independent aggregate

## Coordinator lock

- START_SHA: `3531349d31cc8e17ea17c7e1f34ed0ce5745c9aa`
- Initial `origin/main` fetch and exact-SHA check: PASS.
- The final branch remains pinned to START_SHA; a later external `origin/main` advance to `4da95df8bf042729df58d63577fa62021ebe6d24` was not adopted.
- Final coordinator branch: `codex/past-exam-v3-gold2-independent-20260910`
- Coordinator role: orchestration and artifact collection only. No problem solving, candidate authoring, visual judgment, or cross-JOB evidence transfer was performed.
- `node tools/skills/verify-skills.mjs`: PASS at start and recorded independently in both JOBs.
- No Past Exam V3, pipeline-core, archive-exams skill, taxonomy/master, validator, DB/index, or production archive files were modified by the GOLD jobs.

## Execution configuration defect

The two independent workers were initially launched as `gpt-6-astra` with `high` reasoning. The requested configuration was `gpt-5.6-luna` with `xhigh` reasoning. Therefore the executed evidence is preserved as an explicit `MODEL_CONFIGURATION_MISMATCH` defect and is not represented as Luna/xhigh evidence. At the user's instruction, the existing Astra run was continued as-is; no Astra artifact was used as a seed for another run.

## JOB-A — 2020 매산고 고1 2학기 기말

- Branch: `codex/past-exam-v3-gold2-independent-20260910-job-a`
- Commits: `0ec3dea2d`, `c7ed7b75f`, `f64f56641`
- Exam ID: `20_매산고_2학기_기말_고1_기출`
- Work batch: `past-exam-v3-gold2-20260910-job-a-maesan-2020`
- Builder: `builder-gold2-job-a-maesan-20260910-main`
- Builder session: `builder-session-gold2-job-a-maesan-20260910-main`
- Run: `run-gold2-job-a-maesan-2020-r1`
- Fresh source: `D:/기출/(4)2기말/수학(하)/2020_매산고1_2기말.pdf`
- Denominator: 20 questions on 6 full-page scans: 15 multiple-choice, 3 short-answer, 2 essay.
- Artifact root: `archive/_generated/past-exams/past-exam-v3-gold2-20260910-job-a-maesan-2020/`

Stage status:

| Stage | Status |
|---|---|
| RULE_PREFLIGHT / skills | PASS; source-pack and skill evidence preserved |
| Canonical calibration lock | PASS after lock freeze; first extraction attempt recorded a Windows path-separator binding failure and was rerun after path normalization |
| Target baseline | No target production JS existed on pinned START_SHA |
| Source inventory / full-page extraction | `EXTRACTION_VALIDATED`; 20/20 source identities, 6/6 pages |
| Source fidelity freeze | PASS evidence preserved; source truth remains the scan pages |
| Independent builder solve | 20/20 reviewed from the fresh source; 16 SOLVED and 4 SOURCE_FINDING records |
| Solution/classification build | Candidate drafts and builder-side solution artifacts preserved; not promoted |
| All-question visual triage | 20/20 triaged; 14 visual-benefit records and source-figure handling preserved |
| Expected facts / visual build | Fact validation recorded; 11 solution SVGs and one source visual crop preserved. These remain builder-side / not independently closed |
| STATIC / METADATA | Not completed as canonical closure evidence |
| FINAL_AUDIT | Not executed to a terminal sealed result |
| TARGETED_REPAIR / TARGETED_RECHECK | Not executed; no terminal audit defect list |
| Real browser render closure | Not completed as a final three-mode PASS |
| Promotion / DB / index / strict-new audit | Not executed; no production write |
| Final outcome | `NOT_PROMOTED / HOLD` (`BUILDER_START_BLOCKED:CALIBRATION_MAIN_STALE`) |

Fresh source findings:

- q9: independent count `41`; no printed option equals 41.
- q12: adjacency interpretation is unresolved under the printed boundary-contact wording; 144 vs 96 remains a source-finding hold.
- q15: independent count `216`; no printed option equals 216.
- q19: the displayed quadrant condition is internally ambiguous under inclusive/exclusive reading; builder recorded the interpretation rather than rewriting source.

Repair/recheck: `TARGETED_REPAIR` and `TARGETED_RECHECK` were `NOT_APPLICABLE`; no provider reservation was created. Core-v2 preparation was blocked because the frozen calibration lock used START_SHA while the moving `origin/main` had advanced. The worker's final report, final-audit status, render status, source-defect ledger, and local-static/generation diagnostics are preserved. No candidate/solution content was edited by the coordinator; the coordinator only collected the worker's immutable commits.

## JOB-B — 2023 한영고 고1 2학기 기말

- Branch: `codex/past-exam-v3-gold2-independent-20260910-job-b`
- Commit: `5bb622d19`
- Exam: `2023 한영고 고1 2학기 기말`
- Work batch: `past-exam-v3-gold2-20260910-job-b-hanyeong-2023`
- Builder: `builder-gold2-job-b-hanyeong-20260910-main-01`
- Builder session: `builder-session-gold2-job-b-hanyeong-20260910-main-01`
- Run: `run-gold2-job-b-hanyeong-2023-01`
- Fresh source: `D:/기출/23,24 고1/2023년/2학기 기말고사/수학 하 (23 한영고 기말) 답X.hwp`
- Original source size/SHA: 76,800 bytes / `c07a1c7a09ca2c7e7f5cf2ca2f242e23fb0fa32b7a81fad5951802f3d68af8bd`
- Denominator: UNKNOWN; deliberately not represented as zero.
- Artifact root: `archive/_generated/past-exams/past-exam-v3-gold2-20260910-job-b-hanyeong-2023/`

Stage status:

| Stage | Status |
|---|---|
| RULE_PREFLIGHT / skills | Machine checks PASS; downstream reading is explicitly recorded as PARTIAL in JOB-B report |
| Calibration | 2 complete production samples / 44 observations retained; pending lock, not PASS |
| Source inventory / full-page extraction | BLOCKED: faithful HWP page renderer unavailable |
| Source fidelity / solve / solution / visual triage | NOT_EXECUTED; no source pixels and no denominator invented |
| STATIC / FINAL_AUDIT / repair / recheck / browser render | NOT_EXECUTED |
| Promotion / DB / index / strict-new audit | NOT_EXECUTED; no production write |
| Final outcome | `HOLD / NOT_PROMOTED` |

Actual blocker: `SOURCE_PAGE_RENDER_CAPABILITY_BLOCKED`. Hangul COM open did not return; fresh JOB-B-local official module registration returned false on both long and short paths; no LibreOffice/OpenOffice was installed; pyhwp HTML/ODT derivations dropped all 190 EqEdit objects from the source and were rejected as source truth. Original HWP, hashes, conversion logs, diagnostics, and stage coverage are preserved. No question, answer, solution, visual fact, or denominator was inferred.

## Aggregate outcome

- JOB-A: `HOLD / NOT_PROMOTED`; source and builder-side evidence preserved; core-v2 prepare, FINAL_AUDIT, browser render closure, promotion, DB/index and strict-new audit were not executed because of `CALIBRATION_MAIN_STALE`.
- JOB-B: `HOLD / NOT_PROMOTED`; source-render capability blocker, no downstream execution.
- Production mutation: **none**. No production exam JS, DB, question index, taxonomy/master, validator, pipeline-core, or canonical rules were modified.
- Pinned final coordinator HEAD is recorded after the two independent evidence commits; it must be pushed as the GOLD branch only, never merged to `main`.
