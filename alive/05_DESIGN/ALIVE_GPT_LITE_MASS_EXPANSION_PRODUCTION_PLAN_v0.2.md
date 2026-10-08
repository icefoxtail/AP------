# ALIVE GPT LITE 대량 생산라인 v0.2 — 의미 다양성·L2 누적 저장 계약

작성일: 2026-10-08 KST
상태: DESIGN / HIGH-DIFFICULTY PILOT AUTHORIZED / PRODUCTION NOT ACTIVE
상위: ALIVE_GPT_LITE_MASS_EXPANSION_PRODUCTION_PLAN_v0.1.md. 본 문서는 v0.1을 보존하고 추가 지시 사항을 보강한다.
FULL v0.3, RPM Primary L3/L4, Meta Foundation, difficulty v1.3, ALIVE MODE·A/B/C, 기존 original/types/similar, 예약라인을 변경하지 않는다.

## 1. 핵심 결정
- **L2는 논리적 collection·조회·공급 단위**, 파일 하나를 무제한 누적하는 물리 저장 단위가 아니다.
- 하나의 L2 아래에 여러 **불변 배치 shard**(권장 초기 20~50문항)를 보존하고, append-only manifest가 shard와 UID를 합산한다. 기존 shard를 재직렬화해 덮어쓰지 않는다. 규모·성능 실측 전 20~50은 구현 확정값이 아닌 파일럿 권장값이다.
- **L3/L4는 문항별 정확한 검색/메타**, shard 이름으로 가정하지 않는다. L2 아래에는 서로 다른 L3·L4가 섞일 수 있다.
- 원본 기출 original은 read-only. generated candidate는 original과 격리. 검증된 생성 공급도 기존 Similar Bank/Archive2에 자동 등록하지 않는다.

## 2. 권장 논리/물리 저장 경로(신규 제안: 실제 제품 경로 아님)
```text
archive/generated/lite/v1/<curriculum>/<course>/<L2-key>/
  manifest.json              # UID/shard/revision/status 인덱스, 원자적 갱신
  shards/
    batch-20261008-001.js     # 엔진용 window.questionBank, 불변 candidate
    batch-20261008-002.js
  metadata/
    batch-20261008-001.jsonl  # 생성 UID 기준 RPM L3/L4, PT/TPL, Cross/Condition/Integration/difficulty
  evidence/
    batch-20261008-001.json   # 독립수학, SHA, renderer, 검색/등록 여부
```
실제 엔진/Archive2 로더에 이 경로가 아직 지원되는지는 별도 adapter 구현 확인 후 확정한다. 현재까지 만든 파일럿은 외부 ZIP으로 보존 가능하며, 이 경로로 production에 옮겼다고 선언하지 않는다.

## 3. 문항 정체성과 revision
- 영구 `generatedQuestionUid`를 먼저 부여하고, `sourceKind=generated`, 실제 source seed UID/SHA, `blueprintId`, `variantClass`, `requestId`, `batchId`, `revision`을 sidecar에 남긴다.
- 새 문항용 examTitle은 학교·연도 기출을 가장하지 않는다. 실제 export JS qid와 UID 사이 1:1 `identityMap`을 유지한다.
- 문항 재작업은 `revision+1` 및 `supersedes`로 갱신. 이전 배치를 수정하는 대신 새 shard와 manifest의 canonical pointer만 전환한다.
- L2당 문항 수가 늘면 shard 수만 늘리고, 검색/믹서는 generated UID와 통합 index를 조회한다. 학교별 기출 DB 카드와 섞지 않는다.
- 등록 상태는 `DRAFT → STATIC_CHECKED → INDEPENDENT_VERIFIED → META_EVIDENCE_COMPLETE → OPENABLE_TECHNICAL → LITE_QUALITY_ACCEPTED → REGISTERED`를 *분리된 축의 보고용 상태*로 추적하며, 상태 문자열만으로 전환을 허가하지 않는다. FULL seal은 별도.

## 4. 사고유형 다양성 우선 출제
- L3 HARD LOCK 후 RPM에 실재하는 L4를 최우선 다양화하되, 실제 풀이에서 L3가 drift되면 target slot을 reject/requeue.
- 동일 L4 안에서는 **실제로 필수인** CrossConcept, Condition, Integration의 차이로 semantic blueprint를 구분. 같은 식의 부호·계수·변수명·표현만 바꾼 것은 numeric/representation instance로 따로 센다.
- 후보마다 `semanticBlueprintFingerprint=(RPM L3, L4, decisiveStepGraph, required CrossConcept, decisive Condition, integrationPattern, targetRole)`와 `parameterFingerprint`, `surfaceFingerprint` 세 가지를 별도 계산.
- 높은 난이도는 계수가 큰 문제가 아니라 풀이 선택·숨은 조건·경우 분기·존재성·구조 복원이 필요해야 한다. 난이도 목표는 bucket 3~5이며 실제 산출물은 fresh current-pass로 재평가. 구성을 맞추기 위해 난이도나 메타를 위조하지 않는다.
- 대상 L3에 실제 viable semantic blueprint가 5개 미만이면 shortage로 보고한다. 존재하지 않는 L4/교차 개념을 창조해 채우지 않는다.
- 신규 후보 3번·5번처럼 조건만 부호 대칭인 경우 서로 다른 L4/사고유형으로 과대집계하지 않는다.

## 5. 반드시 남길 문항별 메타
교육과정/L1/L2/세부단원 4필드; 정확한 RPM Primary L3/L4 path와 semantic scope; verified primaryMethod/decisiveStep; current ACTIVE PT/TPL & exact binding, conceptClusterKey; crossConceptKeys[], conditionKeys[], integrationPattern; level, difficultyBucket 1..5, difficultyConfidence, difficultyBoundaryFlag, legacyLevelCompatibility; generated UID, lineage, answer/solution, fidelity/validation status. 미판정과 실제 NONE/[]는 다르게 저장한다.
RPM Primary → current/prerequisite scope → high1 crosswalk → GLOBAL ACTIVE binding을 조회한다. PT/TPL unique exact ACTIVE일 때 null 금지. consumer search join은 evidence와 별개로 실제 readback이 있어야 PASS.

## 6. 고난도 파일럿 P1-HARD
- 우선 단원: 2022 공통수학1 인수분해, `H22-C-03`, `H22-C-03-FACTORIZATION`.
- seed: 2026 효천고 1학기 중간 5번. original 손대지 않음.
- 표적 RPM L3: `인수분해의 활용`. 실제 canonical L4 후보: `수의 계산`, `식의 값`, `조건식`.
- 목표 신규 **5문항**, 비교/부분중복 가시화, bucket 3~5 우선. 한 문항의 계산값이 맞는 것과 독립 수학검수·실제 render·Meta resolver receipt는 구분.
- 단계: Blueprint/수학 spec → 발문·보기·소칠판 해설 → 완성 학생입력 freeze 및 별도 독립 풀이 → RPM current-pass→PT/TPL/current difficulty → JS/asset static→actual exam/sol/ans→조건부 공급 등록.
- 기출 기반 단순 숫자바꿈을 신규 사고유형으로 계수하지 않는다. 이전 5문항과 신규 5문항 및 seed를 exact/structural fingerprint 비교. global generated corpus 전체 조회 불가 시 global uniqueness는 NOT_TESTED.
- 사용자가 형식 결정과 파일럿을 지시했으므로 **candidate 파일 및 상세 증거 생성은 허용**, production/Similar/Factory 등록·본선 예약 신설은 별도 실행 권한/consumer evidence가 있을 때만.
- 보고: requested / attempted / mathChecked / independentVerified / metaVerified / openable / accepted / registered / rejected / shortage, semantic vs numeric vs surface 다양성.

## 7. 구현시 필수 연결
`generatedQuestionUid ↔ shard path/examTitle/qid ↔ resolver questionUid ↔ integrated question index ↔ Finder/Generated Bank`의 동등성 입증. 원본 Archive1 직접열기 및 Common Factory 서버 canonical authority 보존. shard 로더, manifest atomics, index build, UID collision, registration receipt, Archive 실렌더, 권한을 구현하기 전에는 설계 저장 경로를 기존 운영 기능이라고 주장하지 않는다.
