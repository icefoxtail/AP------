# 고등 이차함수·이차방정식·이차부등식·부등식 SVG 업그레이드 현황

현재 작업은 별도 브랜치 `codex/hs-quadratic-svg-upgrade`에서 수행 중이다.
기준선은 최신 `origin/main`의 `809faf7442bb4366f98728e4dea246f8082f6307`이며,
작업 시작 시 `HEAD == origin/main`이었다. production JS와 production asset은 변경하지 않았다.

## 현재 확정된 분모

| canonical key | 대상 문항 | 현재 시각 결정 후보 |
|---|---:|---:|
| `H15-SA-05` 이차방정식 | 60 | ADD_NEW_VISUAL 60 |
| `H15-SA-08` 여러 가지 부등식(이차부등식 포함) | 68 | NO_VISUAL 1 / ADD_NEW_VISUAL 67 |
| `H15-SA-13` 이차함수 | 37 | REBUILD_EXISTING 2 / ADD_NEW_VISUAL 35 |
| `H22-C-05` 이차방정식과 이차함수 | 118 | ADD_NEW_VISUAL 118 |
| `H22-C-06` 여러 가지 방정식과 부등식 | 147 | NO_VISUAL 50 / ADD_NEW_VISUAL 97 |
| **합계** | **430** | **NO_VISUAL 51 / REBUILD_EXISTING 2 / ADD_NEW_VISUAL 377** |

대상은 `archive/exams/original/high/h1/`의 원본 production만이며, similar/types는 제외했다.
대상 source JS는 59개, 대상 시험지 식별자는 59개다. 현재 source에서 외부
`solutionImage` 연결은 0개이고, solution 안의 inline SVG는 2개다.

`docs/rules/` 아래에 이 범위만을 위한 별도 `UNIT_OVERLAY`는 없으므로, 공통 canonical
ruleset과 `도형추출.md` v3.0 및 해설 SVG 운영규정을 적용하고 overlay 부재를 기록했다.

## 기존 관련 자료의 상태

- `unit-09-quadratic`: H15-SA-05/H22-C-05 178건, source-only 177/178, 26 금당고 q17 source hold 1건.
- `unit-10-root-relations`: H15-SA-06/H22-C-06 149건, source-only 149/149.
- `unit-12-equations-inequalities`: H15-SA-07/H15-SA-08/H22-C-06 249건, source-only 249/249.
- `unit-12-inequality-combinatorics`: H15-SA-08 68건은 source 68/68, 기존 기록상 text-solvable 후보는 SVG 없이 처리했고 당시 60/60 render를 기록했다.
- `unit-14-quadratic-function`: H15-SA-13 37건, source-only 37/37. 기존 기록은 2개 inline SVG와 3개 solution-image recheck만 포함한다.
- 함수계열의 H15-SB-03/H15-SB-04/H15-SB-05 및 H22-C2-07/H22-C2-08/H22-C2-09 522건은 별도 함수·유리함수·무리함수 작업으로 닫혀 있으나, 이번 5개 canonical key 분모에는 포함하지 않았다.

이 자료들은 현재 pipeline-core v2의 fresh closure를 대체하지 않는 진단/선행 진척 자료다.

## 현재 branch에서 수행한 새 단계

1. 최신 main 고정 및 별도 branch 생성
2. 430문항/59시험지/59 source JS current inventory 재계산
3. `NO_VISUAL`, `KEEP_EXISTING`, `REBUILD_EXISTING`, `ADD_NEW_VISUAL` 후보 결정 기록
4. 430문항 current source static audit: 필수 필드 430/430, JS load 59/59, placeholder 0
5. q20/q22의 포물선 방향 문구 오류를 candidate solution에서 수정
6. calibration 5건에 대해 source-only V1 expected fact freeze
7. Python 기반 candidate SVG 5건 생성; 함수 그래프 3건과 부등식 수직선 2건
8. 후보 static XML/metadata/density 검사 5/5
9. artifact-only V2 observed fact freeze 5/5
10. expected ↔ observed ↔ candidate solution V3 parity 5/5, V3 FAIL 0
11. candidate protected hash parity 5/5
12. pipeline-core regression 130/130 PASS로 복구·재검
13. 전체 430문항 V1 source-only 입력 packet 430개 생성·검증; UID 중복·누수 0
14. 전체 ADD/REBUILD 379개를 동일 visual type/risk 기준 77개 adaptive batch로 계획
15. current 26년 source의 solution residual 15건을 재분류해, candidate solution 11건을 핀포인트 보정하고 correctness-affecting source hold 4건을 분리
16. additional r6 candidate: 확정 가능한 9건을 추가 생성·정적검사·V2 artifact-only·V3 parity까지 수행; 추가 V3 FAIL 0
17. full candidate bank r7: 59/59 target-bearing source bank, 430 target rows, 14 solution visual bindings, protected parity 0 error

전체 V1 packet 입력 coverage는 430/430으로 준비됐지만, 이는 expected fact를 독립적으로
확정했다는 뜻이 아니다. 현재 solution freeze ledger는 430건 모두 `NOT_FROZEN`이며,
독립 provider에게 넘길 수 있는 source-only 입력만 준비된 상태다.

calibration candidate는 모두 `candidate-r3` 아래에 있으며, 이전 r1/r2 실패 산출물도
append-only 진단 lineage로 남아 있다. r3에서 q20/q22의 좌표계를 잘못 선택하던 generator
분기와 q2 수직선 좌표계 분기를 V2가 잡았고, 새 revision으로 교정한 뒤 V3 5/5가 됐다.

current 26년 시험지에서는 generic solution 12건과 stale answer 문구 1건을 찾았다.
q9/q16 및 추가로 검산 가능한 7건을 포함해 candidate solution 11건을 보정했으며,
q13·q19·q9·q15는 source answer/조건 결함으로 보류했다.

## 아직 PASS가 아닌 이유

- 26 금당고 q17은 source가 정확히 세 교점을 만드는 `1<a<4`를 주지만 `a`의 최댓값을 요구한다. 최댓값은 존재하지 않으므로 correctness-affecting source hold다. source correction 또는 공식 withdrawal 없이 solution freeze/최종 봉인은 금지된다.
- 377개 `ADD_NEW_VISUAL` 대상 전체에 대한 fact model과 candidate SVG가 아직 생성되지 않았다. calibration 5건의 성공을 전체 분모에 복사하지 않는다.
- 현재 candidate SVG/V2/V3 lineage가 닫힌 문항은 14/379건이며, 365건은 아직 candidate generation 전이다. r6에서 source hold 5건은 의도적으로 제외했다.
- full candidate bank 파일은 59/59 준비됐지만, 430건의 full expected fact freeze가 끝난 것은 아니다. 현재 current V1 expected fact/ V2/V3 semantic coverage는 14건뿐이다.
- 430문항 전체의 current solution freeze와 독립 A1/A2 검산, V1/V2/V3 closure가 아직 없다.
- 전체 V1 packet은 입력 준비 상태일 뿐 expected fact를 확정한 독립 검수 결과가 아니다. 현재 solution freeze ledger는 430건 모두 `NOT_FROZEN`으로 남아 있다.
- 과거 unit inventory/expected-fact와 현재 source를 path+qid 및 raw hash로 대조한 결과, 430건 모두 대응 행을 찾았고 425건은 content/choices/answer/solution hash가 일치했다. 5건은 현재 source 값이 달라졌고, 141건은 current exam identity 변경으로 legacy UID가 달라졌다. 이 결과는 diagnostic alignment일 뿐이며, 전체 current V1/A1을 새로 검수해야 하고 legacy evidence를 자동 승계하지 않았다.
- 실제 browser desktop/mobile `exam/solution/answer` capture 및 독립 render review는 아직 `NOT_TESTED`다. CUA가 local file URL을 보안정책으로 거부했고, 현재 Node runtime에서는 Playwright/Puppeteer import도 사용할 수 없었다. 우회 접근은 하지 않았다.
- current pipeline-core provider-preflight/dispatch 기반 provider-attested `FINAL_AUDIT`는 실행되지 않았다. local static/V1/V2/V3 결과를 provider evidence로 가장하지 않았다.
- current pipeline-core v2가 요구하는 승인된 `QUESTION_UID_v2` source-exam registry가 저장소에서 발견되지 않았다. source title로 새 ID를 임의 생성하지 않았으므로 registry authority가 없는 상태에서는 prepare-v2/freeze/audit-v2를 final evidence로 만들지 않는다.

따라서 이 보고서의 상태는 `IN_PROGRESS / CANDIDATE_ONLY / FINAL_PASS_FORBIDDEN`이다.
최종 `PASS`·`SEALED`·production promotion은 선언하지 않는다.

## 근거 파일

- [현재 기준선·규칙 잠금](00_baseline_and_ruleset_lock.json)
- [430문항 target inventory](01_target_inventory.csv)
- [visual scope summary](02_scope_summary.json)
- [source-only calibration](01_calibration_v1_source_only.json)
- [independent A1 calibration](02_math_a1_blind.json)
- [solution fix plan](03_solution_fix_plan.json)
- [current source solution static audit](10_current_source_solution_static_audit.json)
- [current source solution static audit v2](10_current_source_solution_static_audit_v2.json)
- [current source hold](11_current_source_hold.json)
- [V3 calibration parity](08_calibration_v3_parity_r3.json)
- [calibration render status](12_calibration_render_status.json)
- [full-scope V1 source-only packets](15_full_scope_v1_source_only_packets.jsonl)
- [full-scope V1 packet validation](18_full_scope_v1_packet_validation.json)
- [full-scope solution freeze ledger](16_full_scope_solution_freeze_ledger.json)
- [full-scope adaptive batch plan](17_full_scope_batch_plan.json)
- [full-scope legacy evidence alignment](19_legacy_evidence_alignment_v2.json)
- [current pipeline requirements/blockers](20_current_pipeline_requirements.json)
- [candidate solution repair coverage](23_solution_repair_coverage.json)
- [additional current source holds](22_additional_current_source_holds.json)
- [additional r6 candidate V1 facts](25_additional_v1_expected_facts.json)
- [additional r6 candidate bank](30_additional_candidate_bank_manifest_r6.json)
- [additional r6 V2 artifact-only](28_additional_v2_artifact_only_r6.json)
- [additional r6 V3 parity](29_additional_v3_parity_r6.json)
- [additional r6 closure summary](31_additional_v3_closure_summary_r6.json)
- [full candidate bank manifest r7](32_full_candidate_bank_manifest_r7.json)
- [full candidate bank validation r7](33_full_candidate_bank_validation_r7.json)
- [current closure snapshot r7](34_current_closure_snapshot_r7.json)

## r8/r9 source correctness repair update (2026-09-08)

사용자 승인(`source correctness hold 5건을 수정해`, q13에 `k≠0` 조건 추가)에 따라 다음 5건을 candidate-only로 최소 수정했다.

- 26 금당고 q13: content에 `k≠0`을 추가하고, `k=0`이면 두 그래프가 일치한다는 예외를 solution에 명시. 정답 ② 유지.
- 26 금당고 q17: 정확히 세 교점의 범위 `1<a<4`에는 최댓값이 없으므로 보기 ⑤를 `없다`로 보강하고 answer를 ⑤로 수정.
- 26 매산여고 q19: `t=0,1,4,5`, 합 10에 맞춰 answer를 ④로 수정.
- 26 팔마고 q9: 둘레 최댓값 `51/2`에 맞춰 answer를 ①로 수정.
- 26 팔마고 q15: `f(3)=43`에 맞춰 answer를 ③으로 수정.

독립 재검산은 5/5, candidate-r9 V1 source-only 5/5, V2 artifact-only 5/5, V3 parity 5/5(FAIL 0), SVG static 5/5, candidate bank validation 430 target / 59 banks / 1295 bank rows / errors 0, 신규 SVG local desktop/mobile overflow 0으로 기록했다. 함수 문항은 q13·q19·q15 그래프, q17은 열린 매개변수 수직선, q9는 두 포물선과 직사각형 도식으로 구성했다.

새 evidence는 [승인 수리계획](36_approved_source_repair_plan_r8.json), [독립 재검산](38_candidate_source_repair_independent_recheck_r8.json), [V1](39_approved_source_only_v1_expected_facts_r9.json), [candidate SVG manifest](40_approved_candidate_visual_manifest_r9.json), [candidate bank r9](41_approved_candidate_bank_manifest_r9.json), [static check](42_approved_candidate_visual_static_check_r9.json), [V2](43_approved_v2_artifact_only_r9.json), [V3](44_approved_v3_parity_r9.json), [local render](45_local_svg_render_review_r9.json), [manual render review](49_local_render_manual_review_r9.json), [bank validation](46_approved_candidate_bank_validation_r9.json), [solution freeze](47_candidate_solution_freeze_source_resolved_r9.json), [closure snapshot](48_current_closure_snapshot_r9.json)이다.

production JS/SVG/DB/index에는 쓰지 않았다. 로컬 browser `file://` capture가 정책으로 차단되어 provider-attested render capture/FINAL_AUDIT은 여전히 미완료이며, 전체 430문항 current V1/V2/V3와 source registry authority도 남은 gate다. 따라서 이 revision도 `CANDIDATE_ONLY / FINAL_PASS_FORBIDDEN`이다.

## r10 current source application update (2026-09-08)

사용자 승인 범위를 별도 브랜치의 실제 source JS에 반영했다. 3개 source 파일에서 5개 문항만 변경되었고, before/after 해시·문항 수·승인 필드 scope 검증 결과 오류 0이다. q13은 `k≠0` 조건이 실제 content에 추가되었으며, q17은 보기 ⑤ `없다`와 answer ⑤가 실제 source에 반영되었다. q19/q9/q15는 각각 ④/①/③과 확정 해설이 반영되었다.

반영 후 current source-only V1 packet을 430/430으로 재생성·검증했고, repaired solution freeze는 5/5, source↔candidate parity는 5/5다. 현재 상태의 단일 요약은 [r10 closure snapshot](57_current_closure_snapshot_r10.json)이다. 기존 r8/r9 candidate-only 원장은 변경 이력으로 보존한다.

이번 source correction은 별도 브랜치에만 존재하며, DB/question-index/source registry 갱신과 provider-attested FINAL_AUDIT은 아직 수행하지 않았다. 전체 430문항의 독립 freeze 및 current V1/V2/V3가 닫히기 전에는 `PASS`·`SEALED`·production promotion을 선언하지 않는다.

## r12 specialist batch update (2026-09-08)

r12에서 남은 deterministic/specialist-ready 문항 18건을 source-only fact → candidate SVG → artifact-only V2 → V3 순서로 처리했다. 18건 모두 V3 parity PASS, static FAIL 0, local desktop/mobile overflow 0이다. case-table 3건과 parameter number-line 1건을 포함해 함수 그래프와 수직선의 학생 이해 목적을 분리해 구성했다.

r12 candidate bank validation은 59개 source bank, 1295 bank rows, unique candidate visual 59건, source-protected content/choices/answer/image parity, asset association을 검사해 오류 0으로 끝났다. r12 대상 중 기존 candidate와 겹친 3건은 supersede로 기록하고 visual count에 이중 계산하지 않았다.

최신 상태는 [r12 V3 closure snapshot](95_current_closure_snapshot_r12_v3_closed.json)이다. current v2 draft는 59 run·430문항·오류 0, machine evidence는 860개·validation 오류 0이다. 전체 target 379건 중 현재 unique candidate visual은 59건이고 320건이 남아 있다. 남은 full solution freeze·387 fresh expected fact·provider FINAL_AUDIT·실제 render capture/review·registry authority는 아직 최종 gate다.

## r12 source correction and solution static audit update (2026-09-08)

사용자가 승인한 source correctness hold 5건을 별도 브랜치 `codex/hs-quadratic-svg-upgrade`에 최소 수정으로 반영했다. 금당고 q13은 요청대로 발문에 `k≠0` 조건을 추가했고, 해설에는 `k=0`일 때 두 그래프가 일치하는 예외와 판별식 항등식을 명시했다. 금당고 q17은 보기 ⑤를 `없다`로 보강하고 answer를 ⑤로 확정했다. 매산여고 q19, 팔마고 q9·q15는 독립 계산값에 맞춰 answer와 해설만 보정했다. 독립 재검산 5/5, source↔candidate parity 5/5이며 변경 파일 3개·문항 5개다.

current source 전체 해설 정적 감사에서는 별도의 기존 잔여 11건이 확인되었으나, 이는 이번 승인된 5건과 다른 항목이므로 source에는 추가 mutation을 하지 않았다. candidate-r12 해설 정적 감사는 59개 source bank·1295개 bank row에서 generic placeholder, stale answer conflict, parabola direction wording residual 0건을 확인했다. 이 정적 결과는 독립 A1/A2 검산과 provider final audit를 대체하지 않는다.

상세 최신 상태는 [r12 source-solution audit snapshot](100_current_closure_snapshot_r12_source_solution_audit.json), [current source audit](98_current_source_solution_static_audit_r12.json), [candidate solution audit](99_candidate_solution_static_audit_r12.json)이다. full 430 solution freeze, 남은 320 candidate visual, 전체 fresh V1/V2/V3, 실제 browser desktop/mobile render capture 및 독립 review, provider-attested FINAL_AUDIT, registry authority는 여전히 열린 gate이므로 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r13 specialist number-line batch update (2026-09-08)

r13은 남은 specialist 대상 중 수직선 시각화가 유효한 17건과 이차함수 구간 그래프 1건을 source-only expected fact → 독립 재검산 → candidate SVG → artifact-only V2 → V3 parity 순서로 처리했다. V1 18/18, 독립 검산 18/18 mismatch 0, solution freeze 18/18 candidate rows, static 18/18, V2 18/18, V3 18/18(FAIL 0), local desktop/mobile render 18/18 및 overflow 0이다. 큰 수 범위의 수직선은 1단위 눈금 대신 구간 폭에 맞춘 1·2·5 계열 눈금으로 조정해 라벨 겹침을 제거했다.

r13 candidate bank는 59 source bank·1295 row·unique candidate visual 77건·source protected parity 오류 0으로 검증됐다. 전체 visual target 379건 중 77건이 현재 candidate이고 302건이 남아 있다. 최신 상태는 [r13 V3 closure snapshot](116_current_closure_snapshot_r13_v3_closed.json)이다.

r13도 local/provider 한계를 넘겨 final PASS로 승격하지 않는다. current v2 preparation은 59 run·430/430·오류 0, machine evidence는 860개·validation 오류 0이지만 whole-job freeze는 실제 render capture 부재로 시도하지 않았다. provider-attested FINAL_AUDIT, 전체 430 solution freeze 및 fresh V1/V2/V3, 실제 browser render review, 15개 registry identity authority, production promotion은 계속 열린 gate다.

## r14 specialist mixed function/number-line batch update (2026-09-08)

r14는 남은 specialist 대상 18건을 source-only expected fact → 독립 재검산 → candidate SVG → artifact-only V2 → V3 parity → desktop/mobile local render 순서로 처리했다. 수직선 13건과 함수 그래프 5건으로 구성했으며, V1 18/18, 독립 검산 18/18 mismatch 0, candidate solution freeze 18/18, static 18/18, V2 18/18, V3 18/18(FAIL 0), local desktop/mobile render 18/18 및 overflow 0이다. `4/3`, `17/3` 등 exact endpoint label을 유지하고 큰 범위에는 adaptive tick spacing을 적용했다.

r14 candidate bank validation은 59 source bank·1295 row·unique candidate visual 95건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 95건이 현재 candidate이고 284건이 남아 있다. 최신 상태는 [r14 V3 closure snapshot](133_current_closure_snapshot_r14_v3_closed.json)이다.

r14 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. current v2 preparation은 59 run·430/430·오류 0, machine evidence는 860개·validation 오류 0이지만 실제 browser capture 부재로 whole-job freeze는 시도하지 않았다. 전체 430 solution freeze·남은 fresh V1/V2/V3·provider-attested FINAL_AUDIT·실제 render review·registry authority·production promotion은 계속 열린 gate다.

## r15 specialist number-line/function batch update (2026-09-08)

r15는 남은 specialist 대상 18건을 source-only expected fact → 독립 재검산 → candidate SVG → artifact-only V2 → V3 parity → desktop/mobile local render 순서로 처리했다. 수직선 16건과 함수 그래프 2건으로 구성했으며, V1 18/18, 독립 검산 18/18 mismatch 0, candidate solution freeze 18/18, static 18/18, V2 18/18, V3 18/18(FAIL 0), local desktop/mobile render 18/18 및 overflow 0이다. 자연수·실수 조건의 열린/닫힌 끝점과 `7<a≤8` 같은 정수 개수 조건을 수직선에 반영했다.

r15 candidate bank validation은 59 source bank·1295 row·unique candidate visual 113건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 113건이 현재 candidate이고 266건이 남아 있다. 최신 상태는 [r15 V3 closure snapshot](150_current_closure_snapshot_r15_v3_closed.json)이다.

원격 branch continuation을 위해 candidate bank가 참조하는 candidate SVG asset 113개를 별도 추적 대상으로 packaging할 예정이다. production source/asset과 사용자 미추적 h2 작업물은 포함하지 않는다.

r15 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. current v2 preparation은 59 run·430/430·오류 0, machine evidence는 860개·validation 오류 0이지만 실제 browser capture 부재로 whole-job freeze는 시도하지 않았다. 전체 430 solution freeze·남은 fresh V1/V2/V3·provider-attested FINAL_AUDIT·실제 render review·registry authority·production promotion은 계속 열린 gate다.

## r16 mixed specialist batch update (2026-09-08)

r16은 남은 specialist 대상 18건을 source-only expected fact → 독립 재검산 → candidate SVG → artifact-only V2 → V3 parity → desktop/mobile local render 순서로 처리했다. 수직선 15건과 함수 그래프 3건으로 구성했으며, V1 18/18, 독립 검산 18/18 mismatch 0, candidate solution freeze 18/18, static 18/18, V2 18/18, V3 18/18(FAIL 0), local desktop/mobile render 18/18 및 overflow 0이다. `a≤1`, `m≥2`, `−2/3≤x≤3` 등 매개변수·끝점 조건은 수직선에 표시하고, 접선·중근·꼭짓점 문항은 함수 그래프로 구성했다.

r16 candidate bank validation은 59 source bank·1295 row·unique candidate visual 149건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 149건이 현재 candidate이고 230건이 남아 있다. 최신 상태는 [r16 V3 closure snapshot](166_current_closure_snapshot_r16_v3_closed.json)이다.

원격 continuation을 위해 현재 candidate bank가 참조하는 SVG 149개와 r16 full/scoped bank 및 pipeline evidence를 package할 예정이다. production source/asset과 사용자 미추적 h2 작업물은 포함하지 않는다.

r16 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. current v2 preparation은 59 run·430/430·오류 0, machine evidence는 860개·validation 오류 0이지만 실제 browser capture 부재로 whole-job freeze는 시도하지 않았다. 전체 430 solution freeze·남은 fresh V1/V2/V3·provider-attested FINAL_AUDIT·실제 render review·registry authority·production promotion은 계속 열린 gate다.

## remote branch handoff (2026-09-08)

사용자 요청에 따라 `origin/main` 최신 commit `809faf7442bb4366f98728e4dea246f8082f6307`에서 분기한 `codex/hs-quadratic-svg-upgrade`를 원격에 생성하고 push했다. r16 portability commit `6f205b1b`에서 local HEAD와 remote branch HEAD가 일치한다. 당시 r16 candidate bank가 참조하는 SVG 131개, full/scoped candidate bank 59개씩, r16 pipeline run/evidence와 render evidence를 함께 추적해 다른 환경에서 바로 검증·재개할 수 있게 했다. 사용자 미추적 h2 source/image는 제외했다.

재개 명령은 [remote handoff manifest](167_remote_branch_handoff_r16.json)에 보존했다. 이후 작업은 `git fetch origin` 후 `git switch codex/hs-quadratic-svg-upgrade`로 이어갈 수 있다.

## r17 specialist continuation update (2026-09-08)

r17은 r16 수정 snapshot의 누적값을 기준으로 남은 specialist 18건을 새로 처리했다. 수직선 16건과 함수 그래프 2건에 대해 V1 18/18, 독립 검산 18/18 mismatch 0, candidate solution freeze 18/18, static 18/18, V2 18/18, V3 18/18(FAIL 0), local desktop/mobile render 18/18 및 overflow 0을 기록했다. r17 대상 중 r16과의 중복은 제거했으며 superseded prior candidate는 0건이다.

r17 candidate bank validation은 59 source bank·1295 row·unique candidate visual 149건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 149건이 현재 candidate이고 230건이 남아 있다. 최신 상태는 [r17 V3 closure snapshot](183_current_closure_snapshot_r17_v3_closed.json)이다.

r17 current v2 preparation은 59 run·430/430·오류 0, machine evidence는 860개·validation 오류 0이다. 다만 실제 browser capture 부재로 whole-job freeze와 provider-attested FINAL_AUDIT은 아직 시도하지 않았으므로 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r18 specialist function/inequality batch update (2026-09-08)

r18은 남은 specialist 대상 18건을 source-only expected fact → 독립 재검산 → candidate SVG → artifact-only V2 → V3 parity → desktop/mobile local render 순서로 처리했다. 수직선 4건과 함수 그래프 14건으로 구성했으며, V1 18/18, 독립 검산 18/18 mismatch 0, candidate solution freeze 18/18, static 18/18, V2 18/18, V3 18/18(FAIL 0), local desktop/mobile render 18/18 및 overflow 0이다. 26 순천여고 q17은 주사위 조건을 재검산해 순서쌍 30개로 수정했고, q22는 가능한 자연수 `n=4,5,6,7`로 확정했다.

r18 candidate bank validation은 59 source bank·1295 row·unique candidate visual 167건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 167건이 현재 candidate이고 212건이 남아 있다. 최신 상태는 [r18 V3 closure snapshot](203_current_closure_snapshot_r18_v3_closed.json)이다.

r18 current v2 preparation은 59 run·430/430·오류 0, machine evidence는 860개·validation 오류 0이다. 원격 continuation을 위해 현재 bank가 참조하는 SVG 167개와 r18 full/scoped bank·pipeline evidence·render evidence를 package해 branch에 push한다. 전체 final PASS는 계속 금지한다.

## r19 specialist case-table continuation update (2026-09-08)

r19는 남은 specialist 대상 14건을 source-only expected fact → 독립 재검산 → candidate SVG → artifact-only V2 → V3 parity → desktop/mobile local render 순서로 처리했다. 수직선 7건, 함수 그래프 6건, 판별식 case-table 1건이며, V1 14/14, 독립 검산 14/14 mismatch 0, candidate solution freeze 14/14, static 14/14, V2 14/14, V3 14/14(FAIL 0), local desktop/mobile render 14/14 및 overflow 0이다. case-table은 23 여천고 q10 보기의 판별식 17, 0, −15, 24를 참/거짓 구조로 분리했다.

r19 candidate bank validation은 59 source bank·1295 row·unique candidate visual 181건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 181건이 현재 candidate이고 198건이 남아 있다. 최신 상태는 [r19 V3 closure snapshot](219_current_closure_snapshot_r19_v3_closed.json)이다.

r19 current v2 preparation은 59 run·430/430·오류 0, machine evidence는 860개·validation 오류 0이다. 원격 continuation을 위해 현재 bank가 참조하는 SVG 181개와 r19 full/scoped bank·pipeline evidence·render evidence를 package해 push한다. 전체 final PASS는 계속 금지한다.

## r20 mixed function/inequality batch update (2026-09-08)

r20은 남은 specialist 대상 18건을 source-only expected fact → 독립 재검산 → candidate SVG → artifact-only V2 → V3 parity → desktop/mobile local render 순서로 처리했다. 수직선 1건과 함수 그래프 17건으로 구성했으며, V1 18/18, 독립 검산 18/18 mismatch 0, candidate solution freeze 18/18, static 18/18, V2 18/18, V3 18/18(FAIL 0), local desktop/mobile render 18/18 및 overflow 0이다. 근의 관계·중근·매개변수 함수·구간 최댓값/최솟값을 그래프에 반영하고, 큰 함수 구간은 adaptive x축 눈금으로 정리했다.

r20 candidate bank validation은 59 source bank·1295 row·unique candidate visual 199건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 199건이 현재 candidate이고 180건이 남아 있다. 최신 상태는 [r20 V3 closure snapshot](235_current_closure_snapshot_r20_v3_closed.json)이다.

r20 current v2 preparation은 59 run·430/430·오류 0, machine evidence는 860개·validation 오류 0이다. 원격 continuation을 위해 현재 bank가 참조하는 SVG 199개와 r20 full/scoped bank·pipeline evidence·render evidence를 package해 push한다. 전체 final PASS는 계속 금지한다.

## r11 full-denominator progress update (2026-09-08)

clean candidate-r10/r11을 재구성해 과거 상속 비검토 `solutionImage` 250건을 제거하고, 명시된 candidate visual만 유지했다. 현재 전체 bank는 59개 파일·1295 bank row이며, target scoped candidate는 정확히 430문항이다. 명시적 candidate visual은 기존 19건에 r11 신규 25건을 더해 44건이다.

신규 25건은 source-only V1 fact freeze, Python SVG 생성, static check, artifact-only V2 구조 기록, local desktop/mobile raster preview까지 수행했다. V1 25건과 V2 25건은 각각 별도 원장에 기록했으며, semantic V3는 독립 adjudication을 확인하기 전까지 PASS로 만들지 않고 pending으로 남겼다. 현재 capability triage는 430문항 중 deterministic candidate 43건, specialist fact required 336건, NO_VISUAL 51건으로 분류되어 있다.

최신 current v2 preparation은 59 run·430문항·오류 0이고, machine STATIC/METADATA evidence는 860개·validator 오류 0이다. candidate source registry는 430 entries로 pipeline-core normalize를 통과했지만, 15개 source의 inventory examId와 current `window.examTitle`이 달라 명시적 authority hold로 남겼다.

최신 상태는 [r11 closure snapshot](78_current_closure_snapshot_r11.json)이다. source hold는 5→0으로 해소되었으나, 남은 335 candidate visual의 fresh V1/V2/V3, full 430 solution freeze, provider-attested FINAL_AUDIT, 실제 render capture/independent review, registry authority 및 production promotion은 아직 미완료다. 따라서 최종 `PASS`·`SEALED`는 계속 금지한다.

## r11 deterministic V3 closure update (2026-09-08)

r11 deterministic batch 25건은 endpoint·접선식·기울기 label을 보강한 뒤 V1 25/25, artifact-only V2 25/25, V3 parity 25/25(FAIL 0), static 25/25, local desktop/mobile overflow 0으로 닫았다. 최신 단일 상태는 [r11 V3 closed snapshot](80_current_closure_snapshot_r11_v3_closed.json)이다.

이 결과는 전체 430문항 분모의 25건 부분 closure이며, 나머지 405건의 fresh expected fact와 335건의 미생성 candidate visual, full solution freeze, provider-attested FINAL_AUDIT, 실제 provider render capture/review, registry authority는 여전히 남아 있다. 따라서 r11 batch의 row-level PASS를 전체 최종 PASS로 승격하지 않는다.
## r21 specialist function/inequality continuation update (2026-09-08)

r21은 최신 `origin/main@c010c3ba9f8945b2d6f9b9440543f669efb1cc22`을 병합한 `codex/hs-quadratic-svg-upgrade`에서 진행했다. 남은 신규 대상 18건을 source-only expected fact → 독립 검산 → candidate SVG → artifact-only V2 → V3 parity → solution freeze → desktop/mobile local render 순서로 처리했다. 수직선 15건과 함수 그래프 3건에 대해 V1 18/18, 독립 검산 18/18 mismatch 0, candidate static 18/18, V2 18/18, V3 18/18(FAIL 0), candidate solution freeze 18/18, local render 18/18 및 overflow 0을 기록했다. V3 비교기의 한국어 수량 표현 false negative 1건은 문항·해설·SVG를 바꾸지 않고 비교기만 보정한 뒤 V2→V3 재검하여 18/18로 닫았다.

r21 candidate bank validation은 59 source bank·1295 row·unique candidate visual 217건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 217건이 현재 candidate이고 162건이 남아 있다. fresh expected fact 누적은 현재 counting 기준 201건이며 229건이 남아 있다. 최신 상태는 [r21 V3 closure snapshot](253_current_closure_snapshot_r21_v3_closed.json)이다.

r21 current v2 preparation retry는 충돌한 r21b partial 결과와 분리한 `hs-quadratic-r21c` work-batch에서 59 run·430/430·오류 0으로 완료했다. machine STATIC/METADATA evidence는 860개·validation 오류 0이다. 원격 continuation을 위해 r21 candidate bank가 참조하는 SVG 217개와 r21 full/scoped bank·pipeline evidence·render evidence를 packaging해 push할 예정이다. production source/assets 및 사용자 미추적 h2 작업물은 포함하지 않는다.

r21 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. current source solution static audit의 별도 잔여 11건, 전체 430 solution freeze, remaining fresh V1/V2/V3, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.
## r22 specialist quadratic/function continuation update (2026-09-09)

r22는 최신 `origin/main@c010c3ba9f8945b2d6f9b9440543f669efb1cc22`을 포함한 `codex/hs-quadratic-svg-upgrade`에서 진행했다. 신규 대상 18건을 source-only expected fact → 독립 검산 → candidate SVG → artifact-only V2 → V3 parity → solution freeze → desktop/mobile local render 순서로 처리했다. 수직선 17건과 함수 그래프 1건에 대해 V1 18/18, 독립 검산 18/18 mismatch 0, candidate static 18/18, V2 18/18, V3 18/18(FAIL 0), candidate solution freeze 18/18, local render 18/18 및 overflow 0을 기록했다.

r22 candidate bank validation은 59 source bank·1295 row·unique candidate visual 235건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 235건이 현재 candidate이고 144건이 남아 있다. fresh expected fact 누적은 현재 counting 기준 219건이며 211건이 남아 있다. 최신 상태는 [r22 V3 closure snapshot](276_current_closure_snapshot_r22_v3_closed.json)이다.

r22 current v2 preparation은 충돌 방지를 위해 `hs-quadratic-r22c` 새 work-batch에서 59 run·430/430·오류 0으로 완료했다. machine STATIC/METADATA evidence는 860개·validation 오류 0이다. 원격 continuation을 위해 r22 candidate bank가 참조하는 SVG 235개와 r22 full/scoped bank·pipeline evidence·render evidence를 packaging해 push할 예정이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r22 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. current source solution static audit의 별도 잔여 11건, 전체 430 solution freeze, remaining fresh V1/V2/V3, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.
## r23 high-risk specialist continuation update (2026-09-09)

r23은 5개 고위험 문항을 adaptive batch로 처리했다. 22 순천여고 q22 함수 그래프, 23 복성고 q21·23 팔마고 q21·25 매산고 q10·25 강남여고 q18 수직선을 대상으로 source-only expected fact → 독립 검산 → candidate SVG → artifact-only V2 → V3 parity → solution freeze → desktop/mobile local render 순서를 적용했다. V1 5/5, 독립 검산 5/5 mismatch 0, candidate static 5/5, V2 5/5, V3 5/5(FAIL 0), candidate solution freeze 5/5, local render 5/5 및 overflow 0이다.

r23에서 최초 attach manifest의 `sourceJsPath` 누락으로 서로 다른 시험지의 q21 두 건이 `undefined|21`로 충돌했으나, 문항·해설·SVG는 수정하지 않고 attach metadata만 source path에 재결박했다. 재생성 후 candidate bank validation 오류 0, independent recheck 5/5, V3 5/5로 residual FAIL 0을 확인했다. 최신 상태는 [r23 V3 closure snapshot](301_current_closure_snapshot_r23_v3_closed.json)이다.

r23 candidate bank validation은 59 source bank·1295 row·unique candidate visual 240건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 240건이 현재 candidate이고 139건이 남아 있다. fresh expected fact 누적은 현재 counting 기준 224건이며 206건이 남아 있다. current v2 preparation은 새 `hs-quadratic-r23c` work-batch에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다.

r23 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. current source solution static audit의 별도 잔여 11건, 전체 430 solution freeze, remaining fresh V1/V2/V3, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.
## r24 mixed function/inequality continuation and render repair update (2026-09-09)

r24는 8개 문항을 adaptive batch로 처리했다. 22 효천고 q13, q5·22 팔마고 q12·23 순천여고 q20·23 제일고 q18·24 매산고 q18/q19·24 제일고 q22를 대상으로 source-only expected fact → 독립 검산 → candidate SVG → artifact-only V2 → V3 parity → solution freeze → desktop/mobile local render 순서를 적용했다. 함수 그래프 3건과 수직선 5건에 대해 V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8을 기록했다.

r24 최초 local render에서 22 효천고 q13의 긴 Cartesian summary label이 desktop/mobile 양쪽에서 overflow되어 2건으로 검출되었다. geometry와 fact hash는 유지하고 summary panel만 두 줄로 나누는 label-only repair를 적용했다. 수정 후 static 8/8, desktop/mobile 8/8 overflow 0, 수정 문항 q13의 targeted V2 1/1 및 targeted V3 1/1을 확인했다. 최초 overflow evidence와 repair lineage는 [r24 closure snapshot](326_current_closure_snapshot_r24_v3_closed.json)에 기록했다.

r24 candidate bank validation은 59 source bank·1295 row·unique candidate visual 248건·source protected parity 오류 0으로 끝났다. 전체 visual target 379건 중 248건이 현재 candidate이고 131건이 남아 있다. fresh expected fact 누적은 현재 counting 기준 232건이며 198건이 남아 있다. current v2 preparation은 새 `hs-quadratic-r24c` work-batch에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다.

r24 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. current source solution static audit의 별도 잔여 11건, 전체 430 solution freeze, remaining fresh V1/V2/V3, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.
## r26 source-solution repair and affected-visual closure update (2026-09-09)

r26은 current source solution static audit에서 발견했던 11건을 source/solution 수정 프로토콜에 따라 보정했다. 8건의 generic solution placeholder를 학생 재현 가능한 풀이로 교체하고, 2건의 포물선 볼록 방향 문장을 수정했으며, 26 금당고 q16의 stale answer-conflict 문구를 제거했다. content와 answer는 수정하지 않았다. post-fix source audit는 430/430, generic 0, stale conflict 0, direction contradiction 0, issueRows 0이고, 독립 solution recheck는 11/11이다.

source solution 변경으로 stale 될 수 있었던 affected visual 11건은 기존 SVG를 그대로 재사용하지 않고 source-only V1 expected facts 11/11 → 새 r26 candidate SVG 11개 → artifact-only V2 11/11 → V3 11/11 → solution freeze 11/11 → desktop/mobile local render 11/11, overflow 0 순서로 다시 닫았다. q16의 꼭짓점 표시에서 exact `−105/64`와 5자리 Python/JS 반올림 표기가 달라졌던 1건은 exact fact를 바꾸지 않고 bounded display-rounding comparison으로 보정했다.

r26 current candidate bank는 59 source bank·1295 row·visual binding 248건이며 content/choices/answer/image/solution parity drift 0, asset 오류 0이다. 최신 상태는 [r26 source-solution repaired snapshot](365_current_closure_snapshot_r26_source_solution_repaired.json)이다. current v2 preparation은 `hs-quadratic-r26c`에서 59 run·430/430·오류 0, machine evidence 860개·validation 오류 0이다.

r26은 source/solution residual과 affected visual stale를 해소한 것이며 전체 final PASS는 아니다. 남은 131개 candidate visual, 187개 fresh expected fact, full 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 full-scope browser desktop/mobile capture 및 independent render review, registry 15건 authority, DB/question-index/production promotion이 아직 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.
## r27 number-line inequality continuation update (2026-09-09)

r27은 11개 문항을 adaptive batch로 처리했다. 22 팔마고 q19·23 팔마고 q12·25 팔마고 q20/q21·25 효천고 q2/q5·25 순천고 q5/q18/q22·25 제일고 q20·22 팔마고 q20을 대상으로 source-only expected fact → 독립 검산 → candidate SVG → artifact-only V2 → V3 parity → solution freeze → desktop/mobile local render 순서를 적용했다. 모두 수직선 시각자료로 구성했으며 V1 11/11, 독립 검산 11/11 mismatch 0, candidate static 11/11, V2 11/11, V3 11/11(FAIL 0), candidate solution freeze 11/11, local render 11/11 및 overflow 0이다.

r27 candidate bank validation은 59 source bank·1295 row·unique candidate visual 259건·candidate solution drift 0·asset 오류 0으로 끝났다. 전체 visual target 379건 중 259건이 현재 candidate이고 120건이 남아 있다. source solution static issueRows는 0으로 유지되며 fresh expected fact 누적은 현재 counting 기준 254건, 잔여 176건이다. 최신 상태는 [r27 V3 closure snapshot](379_current_closure_snapshot_r27_v3_closed.json)이다.

r27 current v2 preparation은 새 `hs-quadratic-r27c` work-batch에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r27 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 120개 candidate visual, 176개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.
## r28 mixed coordinate/quadratic continuation update (2026-09-09)

r28은 8개 문항을 adaptive batch로 처리했다. 22 팔마고 q2/q6/q14/q15/q17/q18·23 금당고 q17·23 제일고 q8을 대상으로 source-only expected fact → 독립 검산 → candidate SVG → artifact-only V2 → V3 parity → solution freeze → desktop/mobile local render 순서를 적용했다. 수직선 7건과 포물선 그래프 1건에 대해 V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local render 8/8 및 overflow 0이다.

r28 candidate bank validation은 59 source bank·1295 row·unique candidate visual 267건·candidate solution drift 0·asset 오류 0으로 끝났다. 전체 visual target 379건 중 267건이 현재 candidate이고 112건이 남아 있다. source solution static issueRows는 0으로 유지되며 fresh expected fact 누적은 현재 counting 기준 262건, 잔여 168건이다. 최신 상태는 [r28 V3 closure snapshot](394_current_closure_snapshot_r28_v3_closed.json)이다.

r28 current v2 preparation은 새 `hs-quadratic-r28c` work-batch에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r28 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 112개 candidate visual, 168개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.
## r29 coordinate/line/circle continuation update (2026-09-09)

r29는 8개 문항을 adaptive batch로 처리했다. 22 팔마고 q5/q9, 22 매산고 q14, 22 순천여고 q4/q8/q9/q10/q12, 23 금당고 q17을 대상으로 source-only expected fact → 독립 검산 → candidate SVG → artifact-only V2 → V3 parity → solution freeze → desktop/mobile local render 순서를 적용했다. 수직선 8건에 대해 V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local render 8/8 및 overflow 0이다.

r29 candidate bank validation은 59 source bank·1295 row·unique candidate visual 283건·candidate solution drift 0·asset 오류 0으로 끝났다. 전체 visual target 379건 중 283건이 현재 candidate이고 96건이 남아 있다. source solution static issueRows는 0으로 유지되며 fresh expected fact 누적은 현재 counting 기준 270건, 잔여 160건이다. 최신 상태는 [r29 V3 closure snapshot](409_current_closure_snapshot_r29_v3_closed.json)이다.

r29 current v2 preparation은 새 `hs-quadratic-r29c` work-batch에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r29 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 96개 candidate visual, 160개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r30 function/inequality continuation update (2026-09-09)

r30은 8개 문항을 adaptive batch로 처리했다. 25 매산고 q11·25 제일고 q16·26 순천고 q11/q16·26 순천여고 q10은 함수/포물선 관계를 개방형 cartesian SVG로 구성했고, 26 금당고 q9·26 순천고 q17·25 금당고 q14는 해집합과 정수해를 수직선 SVG로 구성했다. 함수 그래프 5건과 수직선 3건에 대해 source-only V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, artifact-only V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local desktop/mobile render 8/8 및 overflow 0이다.

r30 candidate bank validation은 59 source bank·1295 row·current candidate visual 283건·candidate solution drift 0·asset 오류 0으로 끝났다. 전체 visual target 379건 중 현재 candidate 283건, 잔여 96건이다. source solution static issueRows는 0으로 유지되며 fresh expected fact 누적은 현재 counting 기준 278건, 잔여 152건이다. 최신 상태는 [r30 V3 closure snapshot](425_current_closure_snapshot_r30_v3_closed.json)이다.

r30 current V2 preparation은 최초 r30c run-directory 충돌 결과를 폐기하고 새 `hs-quadratic-r30d` work-batch/run root로 재실행했다. 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. r30c의 `NEW_RUN_DIRECTORY_REQUIRED`는 pipeline 디렉터리 충돌 진단으로 보존하되 성공 근거로 사용하지 않는다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r30 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 96개 candidate visual, 152개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r31 function/parameter continuation update (2026-09-09)

r31은 8개 문항을 adaptive batch로 처리했다. 25 매산고 q18·25 팔마고 q6/q8·24 한영고 q9는 함수/포물선·직선 관계를 cartesian SVG로 구성했고, 25 효천고 q14/q20·24 여수고 q4·24 한영고 q17은 매개변수/판별식 해집합을 수직선 SVG로 구성했다. 함수 그래프 4건과 수직선 4건에 대해 source-only V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, artifact-only V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local desktop/mobile render 8/8 및 overflow 0이다. 렌더 점검 중 무한 구간의 왼쪽 끝점을 열린 원으로 표시하던 문제를 발견해 왼쪽 화살표로 수정하고 재검증했다.

r31 candidate bank validation은 59 source bank·1295 row·current candidate visual 291건·candidate solution drift 0·asset 오류 0으로 끝났다. 전체 visual target 379건 중 현재 candidate 291건, 잔여 88건이다. source solution static issueRows는 0으로 유지되며 fresh expected fact 누적은 현재 counting 기준 286건, 잔여 144건이다. 최신 상태는 [r31 V3 closure snapshot](440_current_closure_snapshot_r31_v3_closed.json)이다.

r31 current V2 preparation은 새 `hs-quadratic-r31d` work-batch/run root에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r31 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 88개 candidate visual, 144개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r32 source-solution repair and function/inequality continuation update (2026-09-09)

r32 처리 중 24 효천고 q13에서 source solution의 실제 수학 오류를 V3로 검출했다. 치환식 $t=x^2-4x$에 대해 $y=(t+1)^2-6t=t^2-4t+1$인데, 기존 solution이 이를 $(t-2)^2-3$으로 잘못 바꾸고 $M+m=34$를 설명하지 못했다. 문제 content/answer는 유지하고 solution만 $t\in[-4,0]$에서 $m=1$, $M=33$, $M+m=34$가 되도록 수정했다. 이후 current-source static audit 430/430 issueRows 0, source-repaired candidate bank rebuild 1295 row·visual binding 291·오류 0으로 재구성했다.

r32는 8개 문항을 처리했다. 24 효천고 q13·23 충무고 q2·25 강남여고 q7은 함수/포물선 관계를 cartesian SVG로 구성했고, 23 매산고 q16·23 충무고 q3·24 여수고 q2/q9·24 한영고 q16은 부등식·매개변수 해집합을 수직선 SVG로 구성했다. 함수 그래프 3건과 수직선 5건에 대해 source-only V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, artifact-only V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local desktop/mobile render 8/8 및 overflow 0이다.

r32 candidate bank validation은 source-repaired current source 기준 59 source bank·1295 row·current candidate visual 299건·candidate solution drift 0·asset 오류 0으로 끝났다. 전체 visual target 379건 중 현재 candidate 299건, 잔여 80건이다. fresh expected fact 누적은 현재 counting 기준 294건, 잔여 136건이다. 최신 상태는 [r32 V3 closure snapshot](456_current_closure_snapshot_r32_v3_closed.json)이다.

r32 current V2 preparation은 source solution repair를 반영한 새 `hs-quadratic-r32d` work-batch/run root에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r32 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 80개 candidate visual, 136개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r33 function/equation continuation update (2026-09-09)

r33은 8개 문항을 처리했다. 23 여천고 q20/q22·25 강남여고 q13·25 팔마고 q21·25 제일고 q13은 함수/포물선 관계를 cartesian SVG로 구성했고, 23 여천고 q16·23 충무고 q10·25 제일고 q14는 판별식·매개변수 조건을 수직선 SVG로 구성했다. 함수 그래프 5건과 수직선 3건에 대해 source-only V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, artifact-only V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local desktop/mobile render 8/8 및 overflow 0이다.

r33 candidate bank validation은 59 source bank·1295 row·current candidate visual 307건·candidate solution drift 0·asset 오류 0으로 끝났다. 전체 visual target 379건 중 현재 candidate 307건, 잔여 72건이다. fresh expected fact 누적은 현재 counting 기준 302건, 잔여 128건이다. 최신 상태는 [r33 V3 closure snapshot](473_current_closure_snapshot_r33_v3_closed.json)이다.

r33 current V2 preparation은 새 `hs-quadratic-r33d` work-batch/run root에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r33 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 72개 candidate visual, 128개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r34 discrete/function continuation update (2026-09-09)

r34는 8개 문항을 처리했다. 23 충무고 q16·23 여수여고 q18·25 팔마고 q10/q15·25 매산고 q12는 함수·판별식 관계를 cartesian SVG로 구성했고, 23 여천고 q23·25 효천고 q16/q21은 정수·매개변수 조건을 수직선 SVG로 구성했다. 정수 제약이 있는 q23은 연속 최댓값 그래프 대신 가능한 정수 매개변수 $4,5$를 표시해 이산 최댓값 $80$을 보존했다. 함수 그래프 5건과 수직선 3건에 대해 source-only V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, artifact-only V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local desktop/mobile render 8/8 및 overflow 0이다.

r34 candidate bank validation은 59 source bank·1295 row·current candidate visual 315건·candidate solution drift 0·asset 오류 0으로 끝났다. 전체 visual target 379건 중 현재 candidate 315건, 잔여 64건이다. fresh expected fact 누적은 현재 counting 기준 310건, 잔여 120건이다. 최신 상태는 [r34 V3 closure snapshot](488_current_closure_snapshot_r34_v3_closed.json)이다.

r34 current V2 preparation은 새 `hs-quadratic-r34d` work-batch/run root에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r34 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 64개 candidate visual, 120개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r35 discrete/function continuation update (2026-09-09)

r35는 8개 문항을 처리했다. 25 효천고 q13·23 부영여고 q16/q22·23 매산고 q10은 함수·최적화 관계를 cartesian SVG로 구성했고, 26 효천고 q22/q23·25 팔마고 q16·25 제일고 q21은 절댓값·정수·매개변수 조건을 수직선 SVG로 구성했다. 함수 그래프 4건과 수직선 4건에 대해 source-only V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, artifact-only V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local desktop/mobile render 8/8 및 overflow 0이다.

r35 candidate bank validation은 59 source bank·1295 row·current candidate visual 323건·candidate solution drift 0·asset 오류 0으로 끝났다. 전체 visual target 379건 중 현재 candidate 323건, 잔여 56건이다. fresh expected fact 누적은 현재 counting 기준 318건, 잔여 112건이다. 최신 상태는 [r35 V3 closure snapshot](503_current_closure_snapshot_r35_v3_closed.json)이다.

r35 current V2 preparation은 새 `hs-quadratic-r35d` work-batch/run root에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r35 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 56개 candidate visual, 112개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r35 target-scoped coverage correction (2026-09-09)

r35의 최초 snapshot은 전체 1295 candidate row의 visual count를 430개 target coverage로 잘못 사용했고, 430개 target inventory 밖의 25 제일고 q21을 batch에 포함했다. 해당 out-of-scope candidate row를 제거하고 r35를 target 문항 7건으로 재생성·재검증했다. 수정된 r35 batch는 V1 7/7, 독립 검산 7/7, V2 7/7, V3 7/7(FAIL 0), solution freeze 7/7, local render 7/7·overflow 0이다.

target-scoped visual coverage audit 기준으로 전체 target row 430건 중 visual-decision target 379건에서 current visual은 270건, 잔여는 109건이다. 전체 1295 candidate row의 visual count 322건은 별도 보조 통계로만 보존하며 target coverage로 사용하지 않는다. fresh expected fact는 317건, 잔여 113건이다. 최신 정정 근거는 [target-scoped coverage audit](505_target_scoped_visual_coverage_current.json)와 [r35 corrected snapshot](503_current_closure_snapshot_r35_v3_closed.json)이다.

## r36 target-scoped continuation update (2026-09-09)

r36은 8개 target 문항을 처리했다. 25 한영고 q3/q5/q20은 함수 그래프를 cartesian SVG로 구성했고, 25 강남고 q17·25 금당고 q13·25 순천여고 q5·23 한영고 q11/q17은 절댓값·판별식·정수해를 수직선 SVG로 구성했다. source-only V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, artifact-only V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local desktop/mobile render 8/8 및 overflow 0이다.

r36 candidate bank validation은 59 source bank·1295 row·full candidate visual 330건·candidate solution drift 0·asset 오류 0으로 끝났다. target-scoped coverage 기준으로는 430 target row 중 visual-decision target current visual 278건, 잔여 101건이다. fresh expected fact 누적은 현재 counting 기준 325건, 잔여 105건이다. 최신 상태는 [r36 V3 closure snapshot](520_current_closure_snapshot_r36_v3_closed.json)이다.

r36 current V2 preparation은 새 `hs-quadratic-r36d` work-batch/run root에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. r36 snapshot은 전체 1295-row candidate visual count와 430-row target-scoped visual coverage를 분리해 기록한다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r36 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 101개 target-scoped candidate visual, 105개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.

## r37 target-only continuation update (2026-09-09)

r37은 target inventory 안의 8개 문항으로 정정하여 처리했다. 23 한영고 q15·25 팔마고 q17은 함수/최적화 관계를 cartesian SVG로 구성했고, 24 금당고 q8/q19·23 여수여고 q14·23 한영고 q21·26 효천고 q9·25 순천여고 q8은 부등식·매개변수 조건을 수직선 SVG로 구성했다. source-only V1 8/8, 독립 검산 8/8 mismatch 0, candidate static 8/8, artifact-only V2 8/8, V3 8/8(FAIL 0), candidate solution freeze 8/8, local desktop/mobile render 8/8 및 overflow 0이다. 무한 오른쪽 해집합 $k\ge-5$는 오른쪽 화살표로 표시했다.

r37 초기에 잘못 선택한 25 강남고 q17·25 금당고 q13·25 순천여고 q5·25 금당고 q20·25 효천고 1mid q15는 각각 이미 시각화되었거나 `NO_VISUAL`/target inventory 밖인 항목으로 확인되어 폐기했다. 최종 r37 V1/V2/V3/freeze/render와 scoped bank는 교체된 8개 target 문항으로만 생성되었다. 이전 r37d collision/잘못된 선택 결과는 성공 근거로 사용하지 않는다.

r37 candidate bank validation은 59 source bank·1295 row·full candidate visual 338건·candidate solution drift 0·asset 오류 0으로 끝났다. target-scoped coverage 기준으로는 430 target row 중 visual-decision target current visual 286건, 잔여 93건이다. fresh expected fact 누적은 현재 counting 기준 333건, 잔여 97건이다. 최신 상태는 [r37 corrected V3 closure snapshot](540_current_closure_snapshot_r37e_v3_closed.json)이다.

r37 current V2 preparation은 corrected target-only bank에 대해 새 `hs-quadratic-r37e` work-batch/run root에서 59 run·430/430·오류 0, machine STATIC/METADATA evidence 860개·validation 오류 0이다. production source/assets와 사용자 미추적 h2 작업물은 포함하지 않는다.

r37 역시 candidate row-level 결과를 full-scope PASS로 승격하지 않는다. 남은 93개 target-scoped candidate visual, 97개 fresh expected fact, 전체 430-row independent math/solution freeze, provider-attested FINAL_AUDIT, 실제 provider desktop/mobile capture 및 independent render review, 15개 registry identity authority, DB/question-index/production promotion은 계속 열린 gate다. 따라서 최종 `PASS`·`SEALED`는 선언하지 않는다.
