# Archive Intelligence Phase 0~5 현재 기준 및 잔여 실행계획

작성일: 2026-08-25  
기준 계획서: `archive/archive/docs/ARCHIVE_INTELLIGENCE_PHASE0_5_IMPLEMENTATION_PLAN.md`

이 문서는 원래 Phase 0~5 계획서를 현재 운영 코드와 대조한 기준점이다. `출제 대상 통합 패널` 계획은 별도 업무이며 이 문서의 Phase 3 진행률에 포함하지 않는다. OMR/QR은 Phase 2 회귀 게이트로만 취급한다.

## 1. 실제 코드 검수 결과

| 단계 | 원래 완료 조건에 대한 현재 판정 | 근거 및 남은 주의점 |
|---|---|---|
| Phase 0 Canonical Identity / Inventory | **운영 코드 기준 PASS** | 현재 physical archive 438개 파일·10,690문항. `question-index.js` 10,690건, `question-identity.js` 438파일/10,690 UID, qKey 중복 0, UID 중복 0, source missing 0. identity runtime/contract/collision 회귀가 PASS. 다만 `phase0/qkey-collision-review.json`의 `reviewStatus`가 `provisional_review_pending`으로 남아 있어 기록만 정리해야 한다. |
| Phase 1A Curriculum TREE / Master | **PASS** | master audit `gateReady=true`, 문서 표준키 142, 사용 공식키 106, concept map 누락 0, label conflict 0. `documentedButUnmapped` 36건은 현재 사용되지 않는 문서 키로 오류가 아니다. |
| Phase 1B Tag Enrichment / 세부단원 | **PASS** | 10,690건 단일 기준으로 current classification → fallback safety → complete classification → operational QA를 재생성했다. 공란 0, taxonomy gap 0, production/index field mismatch 0, UID join 0이다. |
| Phase 2 Archive Metadata Bridge / APMS Sync | **최신 post-audit 기준 PASS** | `archive-blueprint-post-audit-after-samsan-q5q8-v2.json`: `POST_AUDIT_PASS`, source questions 1,336, unmatched 0, source missing 0, parse error 0, metadata diff 0. 최신 QR/OMR 정적 회귀도 7/7 PASS. 다만 DB consistency 보고서는 required-field gate가 false이며 `emptySchool 28`·필수 gap 60은 source-dependent 영구 보류 정책으로 남아 있다. |
| Phase 3 Mixer Intelligence | **PASS (3A~3F / Gate 3)** | Blueprint UI와 selector를 연결하고 `validateBlueprintSet`으로 행별 수량, canonical UID/source/template 중복, 단원·세부단원·난도·학교 분포, template/서술형 제한을 출력 전 검증한다. difficulty 경로의 legacy `slice(0, want)`는 제거했다. 자동출제·pin 유지 rebuild·일반 engine exam/sol/ans·QR 진입·source identity 회귀와 MIXED fixture의 exam/sol/ans 실제 렌더를 모두 확인했다. |
| Phase 4 School Fingerprint | **기술 게이트 PASS / 운영 노출 보류** | `archive/tools/build-school-fingerprints.mjs`가 `archive/exams/original/**`만 읽어 348개 파일·7,981문항·37개 학교 fingerprint와 학교·시험축 preset을 생성한다. alias master baseline, `mixer-school-fingerprint.js` bridge, `mixer-school-fingerprint-runtime.js` 비노출 계약을 추가해 Selector 요청 변환, canonical UID/source identity, 전체 재생·15문항 sample 분포 검증을 통과했다. alias 충돌 0·후보 23·미달 숨김 14와 기술 게이트 7/7을 감사했으며 실제 UI 노출은 보류한다. |
| Phase 5 Concept Weakness / APMS 오답 확장 | **5A·5B·5C·5D·5E 계약 구현 / 학생 운영 보류** | `weakness-metadata-join.js`가 `assessment_result_items` 우선·`wrong_answers + exam_sessions + exam_blueprints` fallback으로 canonical UID와 세부 메타데이터를 합친다. `weakness-aggregator.js`는 concept/type/template/unit별 score, recency·난도·반복 실패·recovery 및 fallback 제한 상태를 계산한다. `weakness-student-view.js`는 집계 결과를 읽기 전용 학생 조회 모델로 변환하고 기존 Wrong Clinic packet을 보존한다. `weakness-supplement-preset.js`는 취약도 대상을 selector 요청으로 결정론적으로 분해하며 UID 중복·메타데이터 추정·DB 쓰기를 금지한다. `weakness-closed-loop.js`는 fixture에서 MIXED payload·blueprint·OMR result item을 거쳐 다시 weakness를 집계한다. 계약 감사는 7,981/7,981 canonical coverage, 3/3 sample join, 4개 집계 차원, 5C view/보존, 5D preset allocation, 5E closed-loop를 PASS했다. 학생 UI·DB write·보충시험 운영 노출은 계속 보류한다. |

## 2. 수량·스냅샷 차이의 정확한 원인

- physical `archive/exams`는 438개이고 Git tracked 파일은 432개다. Git에 아직 추적되지 않은 6개는 다음이다.
  - `original/high/h2/2mid/22_순천고_2학기_중간_고2_수학II.js`
  - `original/high/h2/2mid/22_팔마고_2학기_중간_고2_수학II.js`
  - `original/middle/m3/1mid/23_순여중_2학기_기말_중3_기출.js`
  - `similar/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js`
  - `similar/high/h1/2mid/25_제일고_2학기_중간_고1_유사문제.js`
  - `similar/high/h1/2mid/25_효천고_2학기_중간_고1_유사문제.js`
- DB와 index는 438개 파일·10,690문항을 보고 있으므로 이는 현재 운영 데이터의 누락이 아니라 “운영 기준과 Git 기준이 아직 같은 릴리스 기준으로 고정되지 않은 상태”다.
- 10,686 → 10,690 차이는 삼산중에 실제 q5~q8을 추가한 뒤 붙은 q21~q24가 기존 complete-subunit classification snapshot에 재생성되지 않았기 때문이다. 2026-08-25에 10,690 기준으로 관련 산출물을 모두 재생성해 해소했다.
- 현재 기준 산출물은 inventory `bc133cc9dc6d1b3850b0cde21825600c64254e0e0b55f58ce61424df053a4ff6`, identity `560011d68cb89ce20b71d584d390b7caae29bbfa4fc84ce0bc3673fb5f7a8225`, complete classification `b046927362492a02fe95f877e13856de7da9068a346173584599e272304d1d9b`, operational QA `dcc3b4c8205ebce27a4cc08264c692ebe0cdf6e919377ca5bdf1abfe7e390c11`이다.

## 3. 테스트 계약 재기준화 결과

다음 테스트/fixture는 과거 스냅샷을 고정하고 있어 이번 기준점 재생성 때 계약을 갱신했다.

- `archive-complete-subunit-operational-qa-v1.test.mjs`: 과거 10,498 기대값 → 현재 10,690 기준으로 갱신.
- `archive-master-key-audit-and-pilot.test.mjs`: 과거 concept map 누락 63 기대값 → 현재 0/gateReady true로 갱신.
- `archive-blueprint-metadata-bridge-contract.test.js`: 배포 baseline에 이미 있는 `type_key`를 migration이 중복 추가하지 않는 현재 계약으로 정리.
- `archive-baseline-reconciliation-v1.test.mjs`: 과거 434/10,596 기준 → 현재 438/10,690 기준으로 재생성.
- `archive-blueprint-backfill-dry-run.test.mjs`: fixture identity를 canonical UID 계약에 맞춰 unchanged 판정이 재현되도록 갱신.

갱신 후 identity·classification·master·baseline·blueprint dry-run 관련 테스트가 모두 PASS했다. migration baseline에 이미 존재하는 `type_key`를 중복 추가하지 않는 Phase 2 계약도 현재 코드와 일치한다.

## 4. 앞으로의 고정 실행 순서

### 0단계 — 기준선 재고정

1. **완료** — 현재 운영 JS 438개·10,690문항을 하나의 checkpoint로 고정했다.
2. **완료** — current classification → complete-subunit classification → operational QA를 순서대로 재생성했다.
3. **완료** — inventory, identity map/runtime, question-index, DB consistency의 수량·join·digest를 확인했다.
4. **정책 유지** — 6개 Git 미추적 파일은 삭제하지 않는다. 운영 포함/후보 범위는 release 기준 승인 후에만 commit 단위로 다룬다.
5. **완료** — stale 테스트/fixture를 새 기준으로 재계약했다. source-dependent 28/60건은 추정 보강하거나 재개하지 않는다.

### 1단계 — Phase 2 결과 보존 및 Gate 2 고정

최신 `POST_AUDIT_PASS`와 QR/OMR 7/7을 보존한다. 원격 D1을 다시 만지기 전에 최신 export와 로컬 source/index/identity digest가 일치하는지 read-only로 확인한다. 이 단계의 목적은 새 기능 추가가 아니라 Phase 2 결과를 재현 가능한 기준으로 묶는 것이다.

### 2단계 — Phase 3 Mixer Intelligence 구현

계획서 순서를 그대로 지킨다.

1. **Pure selector contract**: grade/subject/unit/fine concept/type/difficulty/count, valid canonical UID, UID duplicate 금지를 hard constraint로 정의한다.
2. **Candidate score v1**: 난도·세부단원·문제유형·학교·연도·source diversity를 점수화하고 template/source 반복 penalty를 적용한다.
3. **Deterministic selection**: blueprint와 `selectionSeed`가 같으면 같은 결과가 나오도록 seed와 tie-break를 고정한다.
4. **Set assembly/validation**: requested count, unit/concept/difficulty/school distribution, template/source duplicate, invalid UID를 최종 검증한다.
5. **기존 기능 보존**: cart, pin, rebuild, archive/current/full scope, 일반 출력, MIXED 출력, AP QR 출력 회귀를 통과시킨다.
6. `slice(0, want)` 경로를 제거한 뒤 Gate 3를 판정한다.

### 3단계 — Gate 3 이후에만 Phase 4

original 학교 기출만 대상으로 alias audit, sample threshold, deterministic fingerprint, fingerprint→Mixer preset을 구현·검증한다. Gate 4 전에는 운영 UI에 노출하지 않는다.

### 4단계 — Gate 4 이후에만 Phase 5

wrong item에 canonical UID를 연결하고 concept/type별 weakness score, recency 감소, 보충시험 preset, `preset → Mixer → Mixed Engine → OMR` roundtrip을 구현한다. Gate 5 전에는 학생 운영 기능으로 승격하지 않는다.

## 5. 진행 금지선

- `출제 대상 통합 패널` Phase 3/4 결과를 Archive Intelligence Phase 3 완료로 환산하지 않는다.
- 출력 화면·일반 렌더 QA를 Mixer Intelligence 구현으로 간주하지 않는다.
- source-dependent 28/60건을 추정값으로 채우지 않는다.
- 서로 다른 digest의 snapshot/index가 섞인 상태에서 새 metadata나 blueprint 승격을 하지 않는다.
- School Fingerprint는 Gate 4 운영 승인 전, Student Weakness는 Gate 5 전에는 운영 기능으로 노출하지 않는다.

## 6. 2026-08-25 실행 결과 및 다음 단계

- 0단계 기준선 재생성 완료: inventory/index/identity/classification/operational QA 모두 438개 파일·10,690문항으로 일치한다.
- 분류기에서 기존 운영 JS의 `subUnit` 표시명을 master taxonomy label로 덮어쓰던 결함을 수정했다. source JS의 승인된 표시명 보존을 확인했고 production/index mismatch는 0건이다.
- 관련 회귀 테스트 15개와 QR/OMR 7개 정적 회귀를 모두 PASS했다. 브라우저 기본 자동출제 15/15, 고급 blueprint 8/8, pin 1건 유지 rebuild 후 최종 15문항·UID 중복 0, 기존 engine의 exam 21/sol 21/ans 21 DOM QA, QR 로그인 안내 모달 진입을 확인했다. similar 41개 JS를 파일별 Function scope로 실행하는 loader isolation 회귀도 PASS했다. 과정 중 발견한 similar JS의 전역 `const _similarSolutionText` 충돌은 파일별 격리 실행 로더로 수정했으며, 패치 후 신규 충돌 로그는 발생하지 않았다. 카트 footer가 pin 영역을 덮던 레이아웃도 수정했다. MIXED fixture에서 시험지 6문항·해설 6개·정답 6개를 실제 브라우저로 확인했고 error/warning은 0건이었다. source JS·DB·원격 D1·commit/push/deploy는 변경하지 않았다.
- Gate 3 판정 후 Phase 4 기초를 시작했다. `school_alias_master.json`은 명시 alias가 없는 현재 원본 학교명을 implicit canonical로 보존하며, `school-fingerprints.json`은 original 348개 파일·7,981문항·37개 학교를 결정론적으로 집계하고 학교 전체 및 학년·시험축별 Mixer preset을 함께 생성한다. 23개 학교가 후보 sample threshold(시험 3개 또는 60문항)를 충족하지만 정책 상태는 `candidate_v1_not_operational`로 유지한다. `mixer-school-fingerprint.js` bridge는 fingerprint를 Selector 요청으로 변환하고 canonical UID/source identity를 검사하며, 전체 재생과 15문항 sample의 분포 검증을 통과했다. `audit-question-type-coverage.mjs`로 원본과 인덱스 원본 범위의 1:1 및 `questionType` 값 일치를 확인했다(명시값 6,705건, 원본 공란 1,276건, 속성 누락 0건). 공란은 추정하지 않고 보존한다. 이어 `audit-school-fingerprint-policy.mjs`로 alias 37→37·충돌 0, 후보 23·threshold 미달 숨김 14를 검증했고 `mixer-school-fingerprint-runtime.js`를 Mixer 비노출 계약으로 연결했다. 정책 감사는 완료했지만 `candidate_v1_not_operational` 및 UI 비노출 상태를 유지한다.
- Mixer 실제 페이지에서 fingerprint bridge/runtime script 로드와 비노출 상태를 확인했고 console error/warning은 0건이다.
- `run-school-fingerprint-gate.mjs`와 `school-fingerprint-gate-report.json`으로 Phase 4 기술 게이트 7/7 PASS를 고정했다. 가장 큰 후보 학교 15문항 runtime preset 주입도 hard constraint·분포 허용오차를 통과하지만 `operationalExposure=HOLD`를 유지한다.
- Phase 5 5A·5B·5C·5D·5E를 비운영 계약으로 구현했다. `weakness-metadata-join.js`는 assessment result 우선과 legacy wrong-answer fallback을 모두 지원하고, `weakness-aggregator.js`는 설명 가능한 weakness score와 recovery 제한을 계산한다. `weakness-student-view.js`는 집계 결과를 읽기 전용 차원별 요약으로 만들며 기존 Wrong Clinic packet을 그대로 보존하고 fallback recovery 제한을 명시한다. `weakness-supplement-preset.js`는 상위 취약도 대상을 concept/problemType/template/standardUnit별 selector 요청으로 분해하고 결정론적 seed·요청별 수량·canonical UID dedupe·운영 잠금 조건을 기록한다. `weakness-closed-loop.js`는 selector 결과를 실제 MIXED blueprint 필드와 OMR result item 형태로 변환한 뒤 canonical UID를 재연결하고 weakness를 재집계한다. `weakness-phase5-contract-audit.json`은 원본 index canonical UID 7,981/7,981, sample join 3/3, 집계 차원 4개, student view/보존, supplement allocation, closed-loop를 PASS로 기록하며 학생 UI/DB write/원격 roundtrip은 실행하지 않았다.
- 학생·교사 OMR 입력 정책은 `wrong_ids_only`로 고정했다. 학생은 틀린 번호만 선택하고, Worker가 미선택 문항을 정답으로 보완해 문항별 `result_status/is_correct`를 생성한다. 답안 문자열 입력·자동채점·별도 미응답 상태는 도입하지 않는다. 정적 감사 `weakness-input-policy-audit.json`은 학생 포털·교사 OMR·Worker·Phase 5 fixture가 이 정책을 유지하는지 PASS했다.
- Gate 5 readiness audit을 읽기 전용으로 실행했다. Phase 5 closed-loop·입력 정책·Phase 4 기술 게이트·기존 Wrong Clinic 경로를 모두 확인해 `GATE5_TECHNICAL_PASS_OPERATIONAL_HOLD`를 기록했다. 학생 UI 비노출, DB write 미실행, 원격 QR/OMR 미실행 상태를 유지하며, 실제 운영 전에는 노출 승인·테스트 학생 범위·rollback checkpoint·post-audit 기준이 필요하다. 결과는 `archive/data/phase5-gate5-readiness.json`이다.
- Git tracked 432개와 physical/DB 기준 438개의 차이는 여전히 release 기준 결정 사항으로 남아 있다. 6개 파일을 삭제하거나 임의로 제외하지 않는다.

따라서 Phase 3F와 Gate 3는 **PASS**다. Phase 4 기술 게이트도 7/7 **PASS**이며, 운영 노출은 보류한다. 계획서의 Phase 5 5A·5B·5C·5D·5E 계약까지 fixture 기반으로 구현·검증했지만, 학생 운영 기능과 DB 쓰기·실제 보충시험·원격 QR/OMR은 Gate 5 운영 승인 전까지 실행하지 않는다. Phase 5 기술 계약은 PASS이며, 남은 것은 운영 승인 여부와 실제 환경 roundtrip 결정이다.
