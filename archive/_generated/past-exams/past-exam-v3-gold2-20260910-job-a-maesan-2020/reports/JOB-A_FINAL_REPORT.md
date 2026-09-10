# JOB-A final report — 2020 매산고 고1 2학기 기말

Work batch: `past-exam-v3-gold2-20260910-job-a-maesan-2020`  
Run: `run-gold2-job-a-maesan-2020-r1`  
Builder: `builder-gold2-job-a-maesan-20260910-main`  
Builder session: `builder-session-gold2-job-a-maesan-20260910-main`  
Frozen START_SHA: `3531349d31cc8e17ea17c7e1f34ed0ce5745c9aa`  
Denominator: 20 source questions (15 multiple-choice, 3 short-answer, 2 constructed-response).

The fresh source is `D:\기출\(4)2기말\수학(하)\2020_매산고1_2기말.pdf`, SHA-256 `sha256:6c1d97b65a12db7a306e7406264d82bc654da95bd8abe90996c92b3f1100f7dd`. Six full-page PNGs were rendered and manually read. No target production JS or prior GOLD artifact was used as source, solution, visual fact, or evidence. The target production path was absent at baseline review.

Stage coverage: RULE_PREFLIGHT PASS; calibration and profile freeze PASS; target baseline review PASS with `ABSENT`; source inventory freeze PASS; full-page extraction PASS (`EXTRACTION_VALIDATED`, 20/20); source-fidelity build freeze PASS with protected content/choices parity; builder independent solve COMPLETE as build-side evidence; all-question visual triage COMPLETE (20/20); expected-fact validation PASS for 14 numeric visual facts; specialist visual generation BUILD_SIDE_ONLY for 10 assets; generic generator capability HOLDs preserved for unsupported radical/rational formulas and long labels; core-v2 prepare BLOCKED; STATIC/METADATA final machine evidence NOT_CREATED; six-case render evidence NOT_TESTED; sealed FINAL_AUDIT NOT_EXECUTED; TARGETED_REPAIR and TARGETED_RECHECK NOT_APPLICABLE; promotion, DB/index update, strict-new audit, and final closure NOT_EXECUTED.

The exact blocking state is calibration drift: the frozen lock is bound to START_SHA `3531349…`, while local `origin/main` is `4da95df8bf042729df58d63577fa62021ebe6d24` and remote `origin/main` is `515cb9d2511c822cc54d13ddc7a6e78eb91db4ad`. `prepare-v2` returned `BUILDER_START_BLOCKED:CALIBRATION_MAIN_STALE`. The job remains HOLD and `productionAuthorized:false`; no provider reservation or production write was made.

Execution identity remained the delegated high-reasoning `gpt-6-astra` builder route. No Luna or alternate-model rerun was started; the attempted `prepare-v2` command records `--builder-model gpt-6-astra`, so there is no hidden model substitution in the evidence.

Independent build-side findings remain open. Q9 computes 41 common-divisor pairs, absent from the printed choices. Q15 computes 216 valid three-digit numbers, absent from the printed choices. Q12 and Q19 require source-figure adjacency adjudication because the wording treats partial boundary contact as adjacency while the scan topology can be read differently. Constructed-response 1 has a quadrant wording/result conflict: the displayed rational function has quadrants II, III, IV for every real k and never quadrant I. These are source-review findings, not silently repaired answers.

The artifact root is `archive/_generated/past-exams/past-exam-v3-gold2-20260910-job-a-maesan-2020`. The final commit contains only this JOB-A staging root, required reports, candidate/source snapshots, full-page evidence, visual facts/witnesses/assets, and frozen identity/calibration files; caches, browser profiles, `node_modules`, and unrelated files are excluded.
