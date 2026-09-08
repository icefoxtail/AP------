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

전체 V1 packet 입력 coverage는 430/430으로 준비됐지만, 이는 expected fact를 독립적으로
확정했다는 뜻이 아니다. 현재 solution freeze ledger는 430건 모두 `NOT_FROZEN`이며,
독립 provider에게 넘길 수 있는 source-only 입력만 준비된 상태다.

calibration candidate는 모두 `candidate-r3` 아래에 있으며, 이전 r1/r2 실패 산출물도
append-only 진단 lineage로 남아 있다. r3에서 q20/q22의 좌표계를 잘못 선택하던 generator
분기와 q2 수직선 좌표계 분기를 V2가 잡았고, 새 revision으로 교정한 뒤 V3 5/5가 됐다.

## 아직 PASS가 아닌 이유

- 26 금당고 q17은 source가 정확히 세 교점을 만드는 `1<a<4`를 주지만 `a`의 최댓값을 요구한다. 최댓값은 존재하지 않으므로 correctness-affecting source hold다. source correction 또는 공식 withdrawal 없이 solution freeze/최종 봉인은 금지된다.
- 377개 `ADD_NEW_VISUAL` 대상 전체에 대한 fact model과 candidate SVG가 아직 생성되지 않았다. calibration 5건의 성공을 전체 분모에 복사하지 않는다.
- 430문항 전체의 current solution freeze와 독립 A1/A2 검산, V1/V2/V3 closure가 아직 없다.
- 전체 V1 packet은 입력 준비 상태일 뿐 expected fact를 확정한 독립 검수 결과가 아니다. 현재 solution freeze ledger는 430건 모두 `NOT_FROZEN`으로 남아 있다.
- 과거 unit inventory/expected-fact와 현재 source를 raw hash·UID로 대조한 결과, 289건만 legacy identity/hash와 정렬되고 141건은 current exam identity 변경으로 legacy UID가 달라졌다. 이 141건을 포함해 전체 current V1/A1을 새로 검수해야 하며, legacy evidence를 자동 승계하지 않았다.
- 실제 browser desktop/mobile `exam/solution/answer` capture 및 독립 render review는 아직 `NOT_TESTED`다. CUA가 local file URL을 보안정책으로 거부했고, 현재 Node runtime에서는 Playwright/Puppeteer import도 사용할 수 없었다. 우회 접근은 하지 않았다.
- current pipeline-core provider-preflight/dispatch 기반 provider-attested `FINAL_AUDIT`는 실행되지 않았다. local static/V1/V2/V3 결과를 provider evidence로 가장하지 않았다.

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
- [current source hold](11_current_source_hold.json)
- [V3 calibration parity](08_calibration_v3_parity_r3.json)
- [calibration render status](12_calibration_render_status.json)
- [full-scope V1 source-only packets](15_full_scope_v1_source_only_packets.jsonl)
- [full-scope V1 packet validation](18_full_scope_v1_packet_validation.json)
- [full-scope solution freeze ledger](16_full_scope_solution_freeze_ledger.json)
- [full-scope adaptive batch plan](17_full_scope_batch_plan.json)
- [full-scope legacy evidence alignment](19_legacy_evidence_alignment.json)
