# ALIVE GPT LITE — Meta-complete Mass Expansion Production Plan v0.1

작성일: 2026-10-08 (Asia/Seoul)  
상태: **DESIGN DRAFT / GPT CHAT PILOT PROPOSED / NOT ACTIVE**  
성격: 기존 ALIVE 정식 경로 옆에 추가할 신규 생성문항 **경량 생산 프로필**. 실제 엔진 구현·예약 배치·production/Similar 공급 승격을 선언하지 않는다.

관련 FULL 설계: `alive/05_DESIGN/ALIVE_META_BLUEPRINT_MASS_EXPANSION_UPGRADE_PLAN_v0.1.md` (**문서 내부 v0.3**).  
정본 관계: **FULL v0.3은 그대로 유지한다. LITE가 FULL 검증·봉인 상태를 상속하거나 약화하지 않는다.**

> 사용자 방향: GPT가 출제자가 되어 기존 기출 10문항을 seed로 신규 문항을 다량 생산한다. 원본 PDF 복구 수준의 절차를 모든 신규 문항에 반복하지 않는다. 그러나 **RPM L3/L4와 확장 Meta는 삭제하지 않는다.** 경량화 대상은 작업 경로·반복 호출·원문 대조이지 수학적 정확성과 분류 체계가 아니다.

---

## 0. 의사결정과 범위

**핵심:** `FAST GENERATION + FULL SEMANTIC METADATA + MINIMUM NECESSARY QUALITY`.

- 포함: 기출 또는 검증된 대표유형을 seed로 신규 문항 설계·문형 작성·답/해설 생성, 새 문항의 RPM L3/L4·CrossConcept·Condition·Integration·PT/TPL·difficulty 확정, Archive-compatible JS 및 생성 공급 후보.
- 제외: 원기출 발문 한 글자 단위 복원, PDF OCR/crop parity, 원시험지 동일성·원본 문항번호 재인증, 기존 시험지 CREATE/R1/R2/R3 전면 재실행, 원본 original 자동 대체·원본 DB 덮어쓰기.
- 보호: 기존 `ALIVE_REPLACEMENT`, `TYPE_BANK/EXAM_FOLLOWUP/STRICT_VARIANT`, `A/B/C` proof, exact solver, `SEALED_LOCAL`, Meta Foundation, difficulty v1.3, Visual/JS 스키마 및 Common Factory 제품 정책을 수정하지 않는다.
- 이 문서는 **생산 계획**이며 현재 canonical 예외·새 validator PASS 권한·새 자동화 예약의 즉시 시행을 의미하지 않는다. 정식 FULL seal/검증완료 Common 공급은 각 CURRENT gate를 충족할 때만 가능하다.

### 0.1 FULL / LITE 경계

| 구분 | FULL v0.3 | GPT LITE |
|---|---|---|
| 목표 | 완전 검증·seal 및 consumer-qualified supply | 신속한 새 문항 생산, 독립 기초검수, 메타 완성, 직접열기 가능한 묶음 |
| 출제 주체 | 검증된 family/recipe와 ALIVE wrapper | GPT를 주 출제자로 활용하되 검증 가능한 recipe/풀이 범위 우선 |
| 의미 Meta | RPM L3/L4 + 확장 Meta | **동일 항목 필수; 낮춘다는 뜻 아님** |
| 수학 | 지원 범위의 complete solver + 독립 검증 | 신규 문항의 실제 독립 검산·유일성/보기 검사 필수; exact 도구는 가능할 때 이용 |
| 원본 대조 | MODE별 fidelity와 정식 proof | 원기출 원문복구 절차 없음; seed 의미/필요한 MODE fidelity만 확인 |
| 출판 증거 | 정식 renderer/reviewer/seal/authority | 기술 로딩 + 필요한 화면 검사, **FULL_SEALED와 다른 상태** |
| 소비 | 검증완료 표시 자격 평가 | 제한된 Generated/Similar 후보. 제품 검증완료 표시 자동 부여 금지 |

LITE의 생성 자유도는 FULL의 A/B/C 확정 proof를 가장하는 자유도가 아니다. 변형이 `VERIFIED_A/B/C` 조건을 실제로 만족하지 않으면 그 라벨을 사용하지 않는다.

---

## 1. 핵심 원칙 — Meta는 LITE에서도 빠지지 않는다

L3/L4는 단순 검색 태그가 아니라 **생성 목적이자 생성 결과의 의미 분류**다.

1. 하나의 expansion group에서 target 교육과정·L1·L2와 **RPM Primary L3 HARD LOCK**을 정의한다. L4·CrossConcept·Condition·IntegrationPattern·표현·수치는 유효한 범위에서 다양화한다.
2. 생성한 문항의 현재 학생용 입력 + 정답을 독립적으로 확인한 최종 풀이에서 `primaryMethod/decisiveStep`을 다시 판정한다. **원본 seed의 L4/확장 Meta를 단순 복사하지 않는다.**
3. RPM current scope → 이미 이수한 prerequisite lower-only scope → crosswalk → GLOBAL ACTIVE exact binding을 따라 의미와 machine projection을 구분한다.
4. 활성 키가 각각 있다는 이유만으로 불가능한 조합을 만들지 않는다. L3 drift는 해당 group에서 reject/requeue하며, 가짜 L4·CrossConcept·Condition·Integration key 생성 금지.
5. 메타 계산을 한 번의 **batch-wise 자동 판정·resolver 연동**으로 수행한다. 문항마다 긴 문서 재조회, 중복 모델 호출, 동일 SHA 반복 PASS를 기본으로 하지 않는다.
6. Meta가 실제 누락·미확정인 문항은 `META_VERIFIED`나 검색가능한 정식 공급으로 포장하지 않는다. 합법적인 projection debt는 의미 실패와 분리하여 표시한다.

### 1.1 반드시 보존할 필드·의미

| 계층 | 생성 문항에서의 요구 | 저장 위치 및 판정 |
|---|---|---|
| 교육과정 / L1·L2 | `standardCourse`, `standardUnitKey`, `standardUnit`, `standardUnitOrder`, `subUnitKey`, `subUnit`, `subUnitConfidence`, `subUnitClassificationDepth` | 현행 Archive JS 스키마와 compiled master의 parent·label parity |
| RPM Primary L3/L4 | 실제 `rpmPath` L3/L4, `primaryMethod`, `decisiveStep`, `semanticSourceScope/scopeRelation` | 생성 문항 UID에 결속된 resolver evidence 및 **실제 소비자가 조회할 수 있는 registry/index projection**; 계획서만으로 임의 신규 JS 필드 도입 금지 |
| Machine PT/TPL | `problemTypeKey`, `templateKey` | UNIQUE EXACT_ACTIVE lookup이면 JS/승인된 projection에 값 확정. 미구현·RPM_ONLY는 `nullReason` + lookup/debt로 기록; 존재하는 값을 빈칸으로 우회 금지 |
| 확장 Meta | `crossConceptKeys[]`, `conditionKeys[]`, `integrationPattern` | 실제 풀이 의존성·조건·결합 유형에서 결정. 진정 없는 배열은 `[]`, 지원된 N/A 표기는 현재 enum대로. 미판정과 '없음'을 혼동하지 않는다 |
| 연결/검색 Meta | `conceptClusterKey`, `category`, `originalCategory`, `questionType`, `tags` | 승인된 taxonomy·해당 학년/소단원과 정합. 원기출 학교·연도 태그를 새 문항에 복사하지 않음 |
| 난이도 | `level=하|중|상`, `difficultyBucket=1..5` + `difficultyConfidence`·`difficultyBoundaryFlag`·`legacyLevelCompatibility` | actual 풀이 기준 current-pass fresh 판정. ALIVE 구형 qualitative bucket을 숫자로 캐스팅하지 않음 |
| 정체성 | `generatedQuestionUid`, lineage source UID/SHA, construction reference/recipe, request/batch/slot/revision | append-only generation ledger. 원본의 UID/시험지명 사용 금지 |
| 학생용 | `content`, `choices`, `answer`, `solution`, `id`, `layoutTag`, `wide`, 필요 visual | JS는 엔진 호환형, 장문 provenance는 sidecar. 별도 `canonicalAnswer/answerType` 등 미지원 내부 필드 무단 export 금지 |

**중요:** L3/L4를 sidecar에만 적고 Finder/Generated Bank에서 검색할 수 없다면 'Meta 기반 공급 등록 완료'가 아니다. consumer별 실제 join/export adapter가 준비되기 전에는 **META_EVIDENCE_COMPLETE ≠ META_SEARCH_INTEGRATED**로 기록한다. 위 상태명은 이 계획의 보고 용어이며 현행 runtime enum이라고 주장하지 않는다.

### 1.2 Meta 판정 실패와 허용 가능한 gap

- `SEMANTIC_UNRESOLVED`: current 문항으로 RPM L3/L4를 결정할 수 없음 → Meta 완성품 미인정, 영향 slot 수정 또는 별도 미해결.
- `L3_TARGET_DRIFT`: 설계한 L3와 실제 풀이의 주개념이 다름 → 원 slot FAIL, 새 요청으로 requeue할 때만 salvage.
- `PROJECTION_BINDING_PENDING / PROJECTION_UNMATERIALIZED`: RPM 의미는 FINAL이나 PT/TPL 연결만 부족 → 의미상 성공, consumer별 자격 별도 판단.
- `CROSS/CONDITION_UNSUPPORTED`: 근거 없이 임의 값을 넣지 않고 관련 axis를 미확정 기록. 미확정을 '없음'으로 자동 통과 금지.
- `META_NULL_BUT_RESOLVABLE`: UNIQUE EXACT_ACTIVE key가 있는데 null → 결함. 자동 lookup/rebind로 해결한다.
- multi-L4 독립 소문항은 정본의 `MULTI_L4_SEMANTIC_SPAN_NO_UNIQUE_PRIMARY` 경계를 보존. 빠른 라인이라는 이유로 임의 L4 하나를 지정하지 않는다.

---

## 2. 출제 구조 — GPT를 출제자로 쓰되 의미 다양성과 숫자 다양성을 분리

`generationPurpose=ALIVE_EXPANSION`은 기존 MODE의 대체가 아니라 sidecar 목적이다.

- **L3-locked Blueprint Planner:** 현재 키와 실제 기출/대표유형의 구조를 읽어 가능한 서로 다른 L4·CrossConcept·Condition·Integration 설계좌표를 정한다.
- **GPT Mathematical Spec:** givens, domain, relation, goal, exact answer, complete solution trace를 먼저 설계한다. 예쁜 답을 위해 수치를 고를 수 있지만 정답을 맞추려고 발문을 사후 조작하지 않는다.
- **GPT Stem Realizer:** 완성된 수학 객체를 실제 내신 스타일 발문, 5지 보기 또는 지원된 서답형, 작은칠판 학생용 해설로 표현한다. 원문 문장·수치·고유 상황의 복붙 금지.
- **A/B/C와 구조변형 구분:** 숫자연습 A, 표현 B, 단일 전처리 C는 증명한 조건에서만 라벨 부여. **동일 L3의 다른 L4는 TYPE_BANK 구조변형 또는 대응 construction recipe**이며 A/B/C 수치변형으로 위장하지 않는다.
- **Answer normalizer:** 수치 재선정 우선. 값 보존 약분과 `S→25S` 같은 질문 대상 변경을 구분하고 후자는 family별 domain/가역성/출제자연성·난도 재검 조건을 만족해야만 적용한다.
- **다양성 3분모:** ① 실질 의미 Blueprint 수 ② 유효 parameter instance 수 ③ 표현 surface 수. 세 값을 합쳐 '새로운 사고유형 수'라고 보고하지 않는다.

기출 10문항에서 총 100문항으로 확대할 때 신규 목표는 **90문항**이다. 같은 seed마다 반드시 다른 L4 열 개를 만드는 계약이 아니다. canonical 의미 Blueprint 부족은 shortage로 남기고, 정당한 숫자연습을 별도 분모로 생산한다.

---

## 3. 경량 컨베이어 — 여섯 작업, 검수 중복 최소화

| 단계 | 실행 주체·업무 | 필수 인계 산출물 |
|---|---|---|
| L0 PLAN | GPT Planner + read-only lookup. 10 seed의 L3와 요청량/난도, 가능한 Blueprint·지원 recipe, 비시각 우선 구분 | `request/slots/plan`, feasible·unsupported·shortage, input SHA |
| L1 CREATE | GPT Builder. mathematical spec → 수치·조건 선택 → 완전한 발문·보기·문제자산·해설 구성 | 후보 JS 객체, raw answer, 계산 trace, candidate/asset SHA |
| L2 VERIFY | **별도 검수 컨텍스트**. 최종 학생용 발문+보기+문제 이미지/표만으로 수학 독립풀이·조건 복원, 정답/보기 cardinality 동결 후 비교 | 모든 후보 qid의 독립 answer·reverse 결과, failure locus |
| L3 META | current source/verified solution로 RPM L3/L4·확장 Meta current-pass 확정, difficulty 4필드, known key lookup, generated UID receipt | `actualClassification`, projection/debt, difficulty evidence 및 adapter output |
| L4 EXPORT/QC | Batch serializer. JS 구조·자산·참조·중복·해설·답 일치 검사. 대표/위험 문항 우선 화면 확인; **실제 Archive exam/sol/ans 로딩 확인** | final JS/assets, machine checks, 실제 실행한 render 결과, SHA |
| L5 REGISTER | 승인된 Generated/Similar 소비 경로에만 등록. consumer 없는 상태는 local candidate로 유지 | 등록 receipt, sourceKind=generated, readback, 제품 검증 표시와 별도 status |

**작업 단계 6개 ≠ 모델 호출 6회/문항.** PLAN/CREATE/META는 묶음 처리하고, VERIFY는 독립 세션에서 여러 문항을 한 번에 받되 **전 문항별 계산 결과**를 남긴다. L4 기계 검사도 한 배치에서 처리한다. 새 예약 수·모델 launch allowance는 이 문서에서 발급하지 않고 선택 실행계약을 따른다.

### 3.1 줄일 작업

- 원본 기출 PDF 재열기, 인쇄물과 띄어쓰기 1:1 대조, 원시험지 출처 증빙, 원학교 원문 layout provenance: **새 출제에는 불필요**.
- 이미 사용한 불변 Golden/rule snapshot·등록된 family calibration의 문항마다 반복 판독: 실행 계약이 재사용을 허용하는 범위에서 **batch-level 1회**.
- 수학·Meta·difficulty를 R1/R2/R3 이름으로 같은 artifact에 여러 번 중복 재검: **한 번의 독립 수학 freeze + current-pass Meta/difficulty + changed-locus recheck**.
- 신규 문항마다 임시 commit/push, Notion 업데이트, 완성 전 DB/인덱스 등록: **하지 않음**.

### 3.2 절대 줄이지 않을 작업

- 실제 학생용 최종 입력(보기·조건박스·표·그림 포함)의 독립 수학 풀이와 필요한 정답 유일성.
- 교육과정 준수, 유효한 L3/L4/확장 Meta current-pass, 실제 정답·해설 및 5지 보기 전부의 정합성.
- 최소한의 계산 trace와 발문 애매성·중복 탐지, JS syntax/VM load, 필수 asset 존재.
- 문항별 result/UID·SHA·생성/검수 상태를 구분하여 기록; 수행하지 않은 검사에 PASS 부여 금지.
- 정식 FULL/SEALED_LOCAL/Common 검증완료를 주장하려면 해당 현재 정본의 추가 gate를 별도 통과.

---

## 4. 3등급 기술·품질·공급 상태를 분리한다

기획상 **서로 독립된 세 종류의 판단**이다. 아래 이름은 새 설계 상태이며 배포 전 실제 schema/consumer 검토가 필요하다.

1. **OPENABLE_TECHNICAL:** JS syntax + `window.questionBank` 로드 + 필수 참조 자산 + 실제 테스트한 Archive 모드의 로딩 결과. 이는 수학검증과 다르다. render 시험 미수행이면 `RENDER_NOT_TESTED`로 기록하고 이 상태를 주지 않는다.
2. **LITE_QUALITY_ACCEPTED:** 해당 최종 generated qid가 독립 수학검산·정답 cardinality·해설·교육과정·Meta L3/L4·확장분류·난이도·중복·필수 그림 검사를 만족. consumer projection gap이 남으면 `META_SEARCH_INTEGRATED`를 별도 미달로 표시한다. OPENABLE 상태만으로 획득 불가.
3. **FULL_QUALIFIED / COMMON_VERIFIED_SUPPLY:** FULL v0.3/ALIVE canonical 및 실제 선택 제품경로의 proof·renderer·seal·등록 조건을 충족한 경우만. LITE의 이름·체크리스트로 자동 승격 금지.

검증 미완성 후보는 내부 preview로 격리한다. **수학적으로 틀린 정답이 발견되면 학생용 정답/채점 제공을 금지**하며, 이미 공급된 해당 UID의 정답·채점은 제품 현재 오류 정책에 따라 제한·복구한다. 기존 원본 검색·직접 열기·일반 practice 전체를 함께 차단하지 않는다.

### 4.1 실제 Archive 최소 JS 계약

기존 엔진은 JS `window.questionBank`를 로드한다. LITE도 최종 학생용 `content/choices/answer/solution`, `id`, 기본 학년·과목·단원, `questionType/tags/layoutTag/wide`, 신규 `subUnit` 4필드, 난이도와 승인된 확장 필드를 갖춘 **현행 JS schema**를 사용한다. 필요없는 원문 출처 필드를 꾸며 넣지 않는다.

- `layoutTag="grid"`, `wide=false` 기본. 출제자가 마음대로 특수 배치·wide를 확정하지 않음.
- 객관식 `choices`는 번호 없는 다섯 보기. 필요한 복수정답은 별도 지원 확인 전 기본 single-choice에서 제외.
- 지원되지 않은 `canonicalAnswer/answerType/equivalencePolicy` 내부 필드를 무단으로 최종 JS에 넣지 않는다.
- 신규 generated bank 문항은 old Similar Bank 파일의 불완전한 해설·legacy schema를 복제하지 않는다.

**다음 구현 선행과제:** end-user 직접열기와 Generated Bank 메타 검색은 다른 기능이다. `engine.html` 로드 가능만 확인한 경우 'Archive 직접열기' 범위의 성공이고, 메타 검색·Common 공급은 별도 registry/index 연결 및 readback까지 확인해야 한다.

---

## 5. Run identity, 저장 및 비용·재개

- 대상 JS/asset staging: `.tmp/archive/<runId>/<examUid>/`. 원본 `archive/exams/original/**`에는 쓰지 않는다. 실제 runtime 중간상태는 선택 실행계약의 `alive/runtime` 또는 승인된 durable path를 사용한다.
- 파일명·자산 참조는 최종 설치할 `examUid`부터 확정. 등록 전 `sourceKind=generated`, parent source UID/SHA와 generatedUid를 구분한다. 원본의 학교명/시험지 번호를 신규 문항 identity로 가장하지 않는다.
- 생성 UID와 이후 export `sourcePath|examId|qid` 기반 identity는 일대일 매핑. index에 기록한 L3/L4가 조회한 최종 generated UID를 가리키는지 확인한다.
- `requestId/batchId/slotId/blueprintId/revision/attemptId`와 artifact hash로 중복 생성·등록 방지. 같은 request 재개 시 먼저 기존 slot 및 attempt를 readback하고, 불명확한 write는 idempotency key로 reconcile한다.
- blocker는 해당 candidate/slot의 `MATH_REWORK`, `META_GAP`, `ASSET_REPAIR`, `EXECUTION_DEBT` 등으로 기록하되 실제 enum/권한은 추후 구현에서 확정. 다른 정상 slot 작업은 계속한다.
- 바뀐 문항·직접 영향 자산만 독립풀이/Meta/렌더 영향을 재검한다. 학생용 content/choices/problem image 변경 시 이전 blind freeze 무효. solution이나 taxonomy만 바뀌면 실제 consumer SHA·receipt 재결속 범위를 따른다.
- 토큰·사용량·provider launch는 선택한 현행 실행 authority가 정한다. 이 설계는 재호출 제한·예약 슬롯을 임의 생성하거나 provider 실시간 usage 한도를 보장하지 않는다. `tokenBudget/maxTokens/usedTokens`는 현재 구현에서 telemetry로 취급한다.

### 5.1 생산량 집계

반드시 `requested / feasible / attempted / accepted / rejected / shortage / registered`를 나눠 기록한다.

- **requested 90**: 기출 10문항을 보존한 채 총 100문항으로 만드는 예.
- **accepted**: 최종 개별 문항의 LITE 필수 품질이 실제 통과한 수; 정답/Meta 불확정 문항 제외.
- **registered**: 실제 지정 Generated/Similar 소비 경로에서 UID·데이터·메타 readback이 된 수.
- **semanticDiversityCount**와 **numericInstanceCount**를 별도 집계한다.
- **accepted/hour**는 실제 작업 시작·종료와 stage별 지연·사용량을 기록한 후에만 보고. 이전에 말한 시간당 8~15문항 등은 검증된 처리량이 아니다.
- 파일럿 초기 권장 후보 batch는 저위험 5~10개, 검증 후 10~20개로 확대. 이는 성능 목표이며 프로필이 허용하지 않는 모델 재호출·추가 scheduler 실행의 근거가 아니다.

---

## 6. 단계별 파일럿 및 구현 우선순위

| 단계 | 실행 | 완료 기준 |
|---|---|---|
| P0 READ-ONLY | 현재 Meta/solver/가용 recipe·consumer·검수 profile inventory. LITE 핵심 스키마/지원 API와 FULL 차이 확정 | 문항 생성 0; 지원/미지원/추가 adapter 목록, 10 seed의 L3 결과 |
| P1 GPT CHAT MINI | **비시각 L3 1개**에서 GPT가 5~10개 신규 candidate 제작, 별도 독립 수학검수, L3/L4+확장 Meta 자동 확정, JS 출력 | accepted 수와 실패 사유, 문항별 검산, actual Meta, JS syntax/직접 로드 확인 |
| P2 ONE-HOUR MEASUREMENT | 기출 10개를 seed로 실측 1시간 기준 1라인 시도. 생산·검수·Meta·JS 로딩 처리량 기록 | attempt/accept/register 및 stage별 시간·자원·어려운 family 비중 |
| P3 BATCH | 먼저 품질이 입증된 family로 batch 10~20, 병렬 출제와 독립 검수 분리. 개별 qid 판정 유지 | 중복/수학/Meta false accept 0을 목표로 지속 측정, 자동 회귀 PASS |
| P4 GENERATED SUPPLY | 승인된 Generated Bank/Similar consumer join·index·sourceKind, scoped publication/readback | 실제 열기/검색·Meta 필터·재개/중복 방지 PASS |
| P5 AUTOMATION | 사용자가 승인하면 예약 생산을 별도 lane으로 증설. 기존 기출 자동화 topology는 변경하지 않음 | 정해진 주기·수량·quota 이내에서 clean backlog만 반복 소비, shutdown 자의 결정 금지 |

P1의 desktop/mobile `exam/sol/ans` 실제 화면을 최소 한 번 검증해 '열린다'는 기술 근거를 만든다. 자동 smoke가 감지할 수 없는 해설 가독성·화면 clipping은 실행한 검사 범위만 기록한다. 필요 시 고위험/변경 문항의 실제 화면 검수를 추가한다. 3화면을 실제로 보지 않았으면 검증완료 출판이나 `RENDER_PASS`로 표기하지 않는다.

P0/P1은 기존 FULL 설계의 Phase 1/2와 별개의 **GPT LITE 실험 축**이다. LITE에서 생성한 문항을 FULL의 증거 없이 `SEALED_LOCAL`로 변환하는 단축 경로는 만들지 않는다.

---

## 7. Pilot acceptance / 음성 사례

**채택 후보의 HARD 0:** 수학 오답, 교육과정 위반, 문제 성립 불가, 객관식 정답 누락·복수(단일선택), 부자연스러운 target 변경, 중복 문항, L3 drift, L4/확장 Meta 위조, 허위 difficultyBucket/level, JS/asset 파손, 해설 핵심 계산 누락.

최소 음성 회귀 사례:

1. 원기출 L3/L4를 새 생성 문항에 복사했지만 실제 풀이 방법이 다른 경우 → 새 문항 Meta mismatch로 reject.
2. L3는 같으나 CrossConcept를 단어만 끼워 넣어 늘린 경우 → 실제 의존성 없으면 reject.
3. RPM L3/L4가 확정됐지만 PT/TPL binding만 빠진 경우 → 의미 인정, 검색용 projection debt 별도 표기.
4. UNIQUE EXACT_ACTIVE PT/TPL 존재하는데 null로 export한 경우 → `META_NULL_BUT_RESOLVABLE` reject.
5. `difficultyBucket`을 `level`에서 단순 매핑하거나 source 난도를 복사한 경우 → difficulty current-pass 실패.
6. 수학 결과 3인데 choices의 ①과 ③이 모두 3인 경우 → 5지 정답 유일성 실패.
7. 최종 problem PNG/표 없이 blind 검수한 경우 → 입력 incomplete, invalid freeze.
8. 임의 `25S`로 자연성이 깨지거나 원래 사고구조가 달라진 경우 → target normalization 실패.
9. JS는 직접 열리지만 Generated Bank의 L3/L4 index가 연결되지 않은 경우 → OPENABLE만 인정, 검색/공급 완료 부정.
10. 정답과 무관한 해설 템플릿을 끼워 넣거나 다른 단원 문제 풀이를 붙인 경우 → 학생용 해설 실패.
11. 10원문→100 총량에서 90개 모두 같은 그래프 구조의 수치치환인데 '90개 독립 L4'로 집계한 경우 → diversity count 거부.
12. same request rerun/partial publication timeout → 동일 UID/idempotency로 reconcile, 중복 등록 금지.

실행된 양성·음성 테스트 및 실제 문항 결과만 PASS로 기록한다. fixture·설계 문서 존재는 엔진 구현이나 품질 통과 증거가 아니다.

---

## 8. 첫 GPT 채팅 실행 지시 예시 (설계용)

> 최신 Git main, Notion 라우터 및 이 문서, FULL v0.3과 실제 관련 canonical을 최초 1회 확인한다. 기존 기출 원문은 보존한다. 선택한 L3 1개에 대해 실행 가능한 다른 L4/조건/CrossConcept Blueprint를 설계하고, 비시각 신규 후보 5~10개를 GPT CREATE한다. 모든 문항에 content·choices·answer·small-board solution 및 현행 JS 기본 스키마를 작성하고, 별도 검수 입력으로 독립풀이/5지 정답 유일성 검사 후 생성 문항 UID로 RPM L3/L4·확장 Meta·난이도를 fresh 판정한다. JS/asset 검사·실제 Archive exam/sol/ans 로딩을 수행하고, accepted·rejected·shortage와 아직 미구현된 consumer 연결을 정직하게 보고한다. 원본·기존 Similar/Factory 및 예약라인은 수정하지 않는다. FULL 봉인/검증완료 표시는 별도 증거 없이는 부여하지 않는다.

이 프롬프트는 **실행 권한, 새 모델 launch allowance, 실제 지원되지 않는 parser/solver/Meta adapter 또는 publication API를 생성하지 않는다.** 실행 도구가 없는 경우 기능을 가장하지 않고 해당 단계의 산출물과 미지원 상태를 분리한다.

---

## 9. 읽기 정본 및 변경 범위

- `alive/05_DESIGN/ALIVE_META_BLUEPRINT_MASS_EXPANSION_UPGRADE_PLAN_v0.1.md` (내부 v0.3) — 상위 FULL 설계 및 충돌 방지.
- `alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md` / `alive/03_SCHEMA/ALIVE_STRUCTURED_QUESTION_SCHEMA_v1.0.md` — MODE·A/B/C·학생용 필드/내부 필드 구분.
- `docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md` / `archive/tools/meta-foundation/rpm-active-resolver.mjs` — RPM L3/L4 semantic, PT/TPL projection, lower-only, final UID evidence.
- `docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md` — 숫자 bucket 1..5, current-pass 4필드.
- `docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md` / compiled master — 현재 신규 JS의 L1/L2/subUnit parent 계약.
- `docs/rules/02_PIPELINES/JS_Archive_2.0_Common_Quality_Contract_v1.md` — 작은칠판/현행 품질·실행 라인 구분.
- `archive/tools/pipeline-core/AGENT_BUDGET.md` — 실제 provider launch·token·검수 격리 실행 권한.
- `Archive 2.0 Common Assessment Factory 계획 v0.13` (Notion CURRENT) — 일반 활용/검증 표시 분리, 검색·범위·정답 공개 정책.

**이번 문서의 효력:** 설계 DRAFT만 추가. `ALIVE FULL v0.3` 수정 0, 엔진 코드 0, production original/Similar Bank 0, taxonomy·difficulty canonical 0, 신규 예약 0, 실제 생성/렌더/검수 PASS 0.  
첫 실행 전에 실제 코드·현재 branch·consumer 구현 지원을 다시 확인하고 P0의 미지원 목록을 만든다.
