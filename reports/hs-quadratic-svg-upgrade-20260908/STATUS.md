# 고등 이차함수·이차방정식·이차부등식·부등식 현재 기준선

- branch: `codex/hs-quadratic-svg-upgrade`
- HEAD: `809faf7442bb4366f98728e4dea246f8082f6307`
- origin/main: `809faf7442bb4366f98728e4dea246f8082f6307`
- HEAD/origin parity: **PASS**
- target: **430문항 / 59시험지 / 59 source JS**
- scope: original/high/h1 only; similar/types 제외
- current stage: **INVENTORY_FROZEN_CANDIDATE_ONLY_NO_PASS**

## 단원별 분모와 시각자료 결정 후보

| canonical key | target | NO_VISUAL | KEEP_EXISTING | REBUILD_EXISTING | ADD_NEW_VISUAL |
|---|---:|---:|---:|---:|---:|
| H15-SA-05 | 60 | 0 | 0 | 0 | 60 |
| H15-SA-08 | 68 | 1 | 0 | 0 | 67 |
| H15-SA-13 | 37 | 0 | 0 | 2 | 35 |
| H22-C-05 | 118 | 0 | 0 | 0 | 118 |
| H22-C-06 | 147 | 50 | 0 | 0 | 97 |

현재 source에서 solutionImage 외부 연결은 0건이며, inline solution SVG는 2건이다. `REBUILD_EXISTING`/`ADD_NEW_VISUAL`은 독립 expected fact와 solution freeze가 끝나기 전에는 candidate 제작 대상일 뿐이다.

## 규칙 라우팅

- docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md: v2.6 / 93734 bytes / sha256 15bac5c693b4bac5a5d1794ec07f641b188bb125d4321c08e0524ebbce5b0514 / manifestMatch=true
- docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md: v1.2.10 / 197743 bytes / sha256 c0c8c5b798943ce475db3a76b9749d32c1c1090b8965e60063bd699615a11a18 / manifestMatch=true
- docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md: UNVERSIONED_OR_RUNTIME_FILE / 7347 bytes / sha256 971625ca5fd8228d01969521d8c2c4933b57e5088d6548d747101deeea6523c2 / manifestMatch=true
- docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md: UNVERSIONED_OR_RUNTIME_FILE / 9468 bytes / sha256 ce4166be64d437a98eebcacbb728e6625dd4ba6472f0d6d20295767265c71685 / manifestMatch=true
- docs/rules/04_VISUAL/도형추출.md: v3.0 / 54090 bytes / sha256 ec5922d7abc791a46d015346d166ef34f88a10ff16050d0b4d4282074958893c / manifestMatch=true
- docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md: v1.1 / 91353 bytes / sha256 b0c8b214d1052750d0ff60e3c83c179b02b3a4fe3f24ed72763f41292e0368c4 / manifestMatch=true
- docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md: UNVERSIONED_OR_RUNTIME_FILE / 68193 bytes / sha256 e70d5f0a6c9ae2141bcd378c2828c2cd9379e16ba15268dbb44f45686ebaad41 / manifestMatch=true
- docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md: UNVERSIONED_OR_RUNTIME_FILE / 13480 bytes / sha256 79dea04f6d9a14a0e8757867d0e4fa198bdd5962fc2df0655dfc5d420f0a224d / manifestMatch=true
- archive/tools/pipeline-core/README.md: UNVERSIONED_OR_RUNTIME_FILE / 15733 bytes / sha256 611e0a4314b5150203bca9b2a04e579aa5772b3becc20eda7704bdae3cd0f1a1 / manifestMatch=NOT_APPLICABLE_RUNTIME_FILE
- archive/tools/pipeline-core/AGENT_BUDGET.md: UNVERSIONED_OR_RUNTIME_FILE / 14593 bytes / sha256 d42346f0cd7ad6a395b6df2d15c386539ac9a69394329c5d9de6bf333a889b02 / manifestMatch=NOT_APPLICABLE_RUNTIME_FILE
- archive/tools/pipeline-core/visual-contract.json: APMATH_VISUAL_FACT_v2 / 8470 bytes / sha256 f548eedef00cb845ac4a3f605370cd3d59cd6170a1ccc19dea142e44b85954bd / manifestMatch=NOT_APPLICABLE_RUNTIME_FILE
- applicable UNIT_OVERLAY: 없음 확인. 공통 canonical ruleset으로 계속하되, overlay 부재 사실을 evidence에 보존한다.

## 기존 진행 자료의 위치와 현재 사용 범위

- docs/reports/high1-svg-exhaustive-20260905/unit-09-quadratic/FINAL_REPORT.md
- docs/reports/high1-svg-exhaustive-20260905/unit-10-root-relations/FINAL_REPORT.md
- docs/reports/high1-svg-exhaustive-20260905/unit-12-equations-inequalities/FINAL_REPORT.md
- docs/reports/high1-svg-exhaustive-20260905/unit-12-inequality-combinatorics/FINAL_REPORT.md
- docs/reports/high1-svg-exhaustive-20260905/unit-14-quadratic-function/FINAL_REPORT.md
- docs/reports/high1-svg-exhaustive-20260905/unit-09-quadratic/08_source_review_status.json
- docs/reports/high1-svg-exhaustive-20260905/unit-12-inequality-combinatorics/08_source_review_status.json
- docs/reports/high1-svg-exhaustive-20260905/unit-14-quadratic-function/08_source_review_status.json
- reports/h2-s1-algebra-visual-upgrade/CONTINUATION_HANDOFF.md

기존 보고서는 current pipeline-core closure를 대신하지 않는 진단/진척 근거로만 연결했다. solution freeze → V1 source-only → V2 artifact-only → V3 parity → render capture/review → final audit 순서를 새 revision에서 다시 닫아야 한다.

## 현재 차단

- solution freeze and independent blind math review are not yet created for this current branch/revision
- current pipeline-core provider-attested FINAL_AUDIT has not been executed
- candidate SVG generation and V1/V2/V3 evidence are not yet created
- production source/assets remain unchanged by policy

## r8/r9 source correctness repair update

사용자 승인에 따라 5개 source correctness hold를 candidate-r8/r9에서 최소 수정했다. 금당고 q13에는 `k≠0` 조건을 추가했고, 금당고 q17은 보기 ⑤를 `없다`로 보강해 answer ⑤로 정정했다. 매산여고 q19는 ④(합 10), 팔마고 q9는 ①(`51/2`), 팔마고 q15는 ③(43)으로 정정했다.

- independent source recheck: 5/5, candidate source holds: 0
- V1/V2/V3 for repaired rows: 5/5 / 5/5 / 5/5, V3 FAIL 0
- new SVG: 5건, static errors 0, local desktop/mobile overflow 0
- candidate bank: 59 files, 1295 bank rows, approved content/choices/answer drift exactly 5, errors 0
- production mutation: false

상세: `36_approved_source_repair_plan_r8.json` → `38_candidate_source_repair_independent_recheck_r8.json` → `39_approved_source_only_v1_expected_facts_r9.json` → `40_approved_candidate_visual_manifest_r9.json` → `41_approved_candidate_bank_manifest_r9.json` → `42_approved_candidate_visual_static_check_r9.json` → `43_approved_v2_artifact_only_r9.json` → `44_approved_v3_parity_r9.json` → `45_local_svg_render_review_r9.json` → `49_local_render_manual_review_r9.json` → `46_approved_candidate_bank_validation_r9.json` → `47_candidate_solution_freeze_source_resolved_r9.json`.

최종 봉인은 아니다. provider-attested FINAL_AUDIT, source registry authority, 전체 430문항 current V1/V2/V3, current render capture 및 독립 render-review가 남아 있으므로 상태는 `CANDIDATE_ONLY / FINAL_PASS_FORBIDDEN`이다.
