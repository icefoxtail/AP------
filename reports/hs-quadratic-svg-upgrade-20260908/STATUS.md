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

## r12 specialist batch

r12 18건은 V1 18/18, V2 18/18, V3 18/18·FAIL 0, static 18/18, local desktop/mobile overflow 0으로 닫혔다. candidate bank는 unique visual 59건·오류 0이며, 기존 후보와 겹친 3건은 supersede 처리했다. 최신 요약은 `95_current_closure_snapshot_r12_v3_closed.json`이다.

전체 430 분모 중 fresh expected fact는 아직 387건, candidate visual은 320건이 남아 있다. full solution freeze, provider FINAL_AUDIT, 실제 browser render/review, source registry authority와 production promotion은 미완료라 최종 PASS는 보류한다.

## r12 source correction and solution static audit

사용자 승인 source correctness hold 5건을 별도 브랜치에 최소 수정했다. 금당고 q13에는 요청대로 `k≠0` 조건을 추가했고, q17은 보기 ⑤ `없다` 및 answer ⑤로 보정했다. 매산여고 q19는 ④, 팔마고 q9는 ①, q15는 ③으로 독립 계산과 일치시켰다. 독립 재검산 5/5, source↔candidate parity 5/5다.

current source에는 승인 범위 밖의 기존 해설 정적 잔여 11건이 남아 있으며 별도 승인 전에는 source를 추가 변경하지 않는다. candidate-r12 전체 해설 정적 감사는 59 source banks·1295 rows·issue 0이다. 최신 원장은 `100_current_closure_snapshot_r12_source_solution_audit.json`이며, 이는 candidate 진행 증거일 뿐 final PASS/SEALED가 아니다.

## r13 specialist number-line batch

r13 18건(수직선 17, 함수 그래프 1)은 source-only V1 18/18, 독립 검산 18/18, candidate solution freeze 18/18, static 18/18, artifact-only V2 18/18, V3 18/18·FAIL 0, local desktop/mobile overflow 0으로 닫혔다. large-range number line 눈금 간격을 조정해 라벨 겹침도 제거했다.

현재 unique candidate visual은 77/379, 남은 candidate visual은 302건이다. 최신 원장은 `116_current_closure_snapshot_r13_v3_closed.json`이며, 전체 430 solution freeze·남은 fresh facts·provider FINAL_AUDIT·browser render/review·registry authority가 남아 최종 PASS는 보류한다.

## r10 current source application update

승인된 5건을 별도 브랜치 source JS에 실제 반영했다. 변경 범위는 3개 파일·5개 문항·승인 필드로 제한되었고, source repair apply validation 오류는 0건이다. source holds는 5→0으로 해소되었다.

수정 후 V1 source-only packet은 430/430, unique 430, leak 0으로 재생성·검증했다. repaired solution freeze 5/5 및 source↔candidate parity 5/5이며, 기존 5건 SVG의 V2/V3는 5/5·FAIL 0, local desktop/mobile overflow 0이다.

현재 요약은 `57_current_closure_snapshot_r10.json`이다. 별도 브랜치이므로 검토 가능한 실제 source diff는 존재하지만, source registry·DB/index 갱신, provider-attested FINAL_AUDIT, 전체 430문항 independent freeze/V1/V2/V3 및 final render review가 남아 최종 PASS는 보류한다.

## r11 full-denominator progress

clean candidate bank를 다시 구성해 상속 비검토 SVG를 제거했고, 430 target scoped candidate를 유지했다. 신규 deterministic batch 25건을 생성해 candidate visual 총 44건, static 25/25, local render overflow 0으로 기록했다. V1/V2는 25건씩 기록되었고 semantic V3는 독립 adjudication pending이다.

current v2 draft는 59 run·430문항·오류 0, machine evidence는 860개·validator 0 오류다. source registry candidate는 430 entries지만 exam-title identity mismatch 15건이 있어 authority pending이다. 현재 full-scope 남은 candidate visual은 335건이며, 전체 430 solution freeze·fresh V1/V2/V3·provider FINAL_AUDIT·render capture/review·registry/production authority가 남아 최종 PASS는 보류한다. 최신 요약은 `78_current_closure_snapshot_r11.json`이다.

## r11 deterministic V3 closure

25건 deterministic batch가 V1 25/25, V2 25/25, V3 25/25·FAIL 0, SVG static 25/25, local desktop/mobile overflow 0으로 닫혔다. 최신 상태는 `80_current_closure_snapshot_r11_v3_closed.json`이며, 이는 430 전체가 아닌 row-level candidate evidence다. 나머지 405 expected facts·335 candidate visual·full solution freeze·provider FINAL_AUDIT·browser render/review·registry authority는 계속 열린 상태다.
