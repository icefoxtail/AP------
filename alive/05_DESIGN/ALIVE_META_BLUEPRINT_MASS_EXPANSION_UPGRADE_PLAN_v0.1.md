# ALIVE Meta Blueprint Mass Expansion Upgrade Plan v0.3

작성·설계 검토일: 2026-10-08 (Asia/Seoul)\
상태: **SECOND DESIGN REVIEW INCORPORATED / SHADOW IMPLEMENTATION PROPOSED / NOT ACTIVE**\
이번 검토 기준 Git main: `92911a8aafb7af87d1479c1d89ca7b8be920c7cb`\
v0.2 검토 기준 Git main: `c4a5655a9fc174a2ee7123556510777052b66fb0`\
v0.1 원문 commit: `c4a5655a9fc174a2ee7123556510777052b66fb0`\
v0.2 문서 commit: `92911a8aafb7af87d1479c1d89ca7b8be920c7cb`\
저장 경로: 기존 `ALIVE_META_BLUEPRINT_MASS_EXPANSION_UPGRADE_PLAN_v0.1.md` 유지. 문서 내부 revision은 v0.3이며, 이전 전문은 각 commit에 보존한다.

> 기존 ALIVE를 다시 만들지 않는다. Meta Foundation을 생산 설계 좌표로 활용하되, 현재 MODE·A/B/C proof·bounded solver·DifficultyVector·검수·직렬화·SEALED_LOCAL을 해당 지원 범위 안에서 재사용한다.
>
> 이번 변경은 설계 검토와 문서 보완이다. 엔진 구현, taxonomy/capability 승격, 기존 시험지 교체, Similar/Common 공급 등록, 예약 변경을 실행하거나 승인 완료로 간주하지 않는다. 아래 신규 필드·profile·검사명은 구현 전 설계 계약이며 현재 runtime enum으로 가장하지 않는다.

---

## 1. 검토 결론과 실제 기준선

**방향은 유지한다. 다만 “L3가 같으므로 기존 A/B/C로 무엇이든 생성 가능”이라는 해석은 제거한다.** 대량화의 첫 작업은 새 생성기 구축이 아니라, 원하는 Meta 조합과 실제 실행 가능한 family recipe를 연결하는 얇은 adapter다.

이번 검토에서 직접 확인한 근거는 다음과 같다. 경로는 저장소 루트 기준이고, 별도 표시가 없으면 위 baseline에 고정한다.

| 근거 | 확인한 계약·코드 | 설계에 미치는 영향 |
|---|---|---|
| `alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md` §2·8·11·12·14~16 | TYPE_BANK / EXAM_FOLLOWUP / STRICT_VARIANT의 서로 다른 fidelity, 8축 DifficultyVector, 독립 Solver | 목적·MODE·변형 class를 분리한다. |
| `alive/engine/universal_variant_engine.py` | A는 명시적 수치 치환, B는 core graph 비교, C는 전처리 1개, ledger는 VERIFIED_A/B/C 요구 | L4/CrossConcept 변경을 자동으로 B/C에 넣지 않는다. |
| `alive/engine/structure_families.py` | 기본 registry는 HOLD, MIXED는 UNSUPPORTED, 실제 등록 adapter별 capability 확인 | family 이름이나 과거 승격 보고서만으로 생성 가능 판정 금지. |
| `alive/engine/exact_verifier.py` | 제한된 정규근사 경계·해설 일차식 계산 검사 | 이 파일의 PASS를 문항 전체 exact solve·유일성 증명으로 확대하지 않는다. |
| `alive/engine/metadata_finalizer.py` | source 객체 복사, 오래된 태그 제거, questionType 점검 | 최종 RPM/Meta 재판정기를 대신하지 않는다. |
| `alive/engine/adaptive_quality_gates.py` | source clone·LaTeX·특정 퇴화 좌표·SVG 라벨 점검 | 범용 계산량·의미 다양성·수학 검증으로 간주하지 않는다. |
| `docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md` §1.4 및 CURRENT | RPM semantic과 machine projection 분리, lower-only prerequisite lookup, current-pass 재판정 | RPM_ONLY/projection debt를 의미 실패와 구분한다. |
| `docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md` | 숫자 1~5, difficulty 4필드, level 문자열 | ALIVE의 구형 문자열 bucket과 명시적 adapter가 필요하다. |
| `docs/rules/02_PIPELINES/JS_Archive_2.0_Common_Quality_Contract_v1.md` | 실제 artifact 품질, 작은칠판, CODEX/GPT_SCHEDULED 분리 | 신규 공급의 품질 계약과 기존 실행 라인의 권한을 혼동하지 않는다. |
| `alive/00_ALIVE_INDEX.md` | 설계 문서는 운영 manifest 제외, 기존 runtime·schema·검수 경로 | 이 문서 변경으로 운영 정본이나 봉인 권한이 생기지 않는다. |

Notion에서 작업 라우터 → Archive 시작 페이지 → 작업 생명주기를 조회하고 Git 기준선을 확인했다. Common Factory의 최신 제품 정책은 [Common Assessment Factory v0.13](https://app.notion.com/p/3f10e68bd69f8137b889c0868b3d85b2?pvs=204)의 2026-10-07 CURRENT를 참조했다. 이는 계획 상태의 확인이며 Factory 코드 구현 완료 판정이 아니다.

위 Notion 조회는 **v0.2 검토 기록**이다. v0.3에서는 해당 페이지를 다시 조회하지 않았으며, 제품 정책의 이후 변경이나 실제 공급 API 구현을 인증하지 않는다. 이번 검토는 위 Git baseline의 파일·함수와 사용자 현재 작업 지시를 대조했다.

### 1.1 v0.3에서 추가로 확인한 실행 간극

| 근거 | 실제 확인 | 이번 보완 |
|---|---|---|
| `archive/tools/pipeline-core/AGENT_BUDGET.md` | whole-job FINAL_AUDIT, U1/U2/U3 격리, profile별 targeted recheck, token은 telemetry | §13.1에서 연결 가능성부터 qualification. 토큰 한도를 새 launch 차단 조건으로 만들지 않음. |
| `archive/tools/meta-foundation/rpm-active-resolver.mjs` | UID/sourceFingerprint/solutionHash 결속, `validateBlindDifficulty`, 4필드 parity | parent seed 대신 **새 문항 identity**로 evidence 생성. legacy blind 필드명을 실제 비노출 주장으로 오인하지 않음. |
| difficulty v1.3 및 공용 Resolver의 2026-10-03 CURRENT | prior 값 visibility 허용, decision authority 복사 금지 | 수학 blind와 Meta/difficulty current-pass를 분리. target difficulty도 결과의 판정 근거가 아님. |
| `alive/engine/exact_verifier.py::verify_question` | 적용되는 부분 검사가 모두 PASS면 top-level PASS가 가능 | 부분 산술 PASS와 완전 solver coverage를 별도로 수납. |
| 사용자 제공 `AGENTS.md` 및 현재 작업 폴더의 임시경로 정본 | 시험지 중간 JS·자산은 `.tmp/archive/<runId>/<examUid>/` | runtime 상태와 시험지 실물을 분리. 지정 정본은 위 원격 baseline에 없으므로 §15에 prerequisite debt를 기록. |

이 표는 **계약·코드 정적 대조**다. 테스트나 provider 실행 결과가 아니다. 이번 문서 검토를 신규 생성 문항의 독립 수학검수로 집계하지 않는다.

---

## 2. 업그레이드 목표와 P0 보완

목표는 **같은 L3에서 실제로 다른 학습 경험을 갖는 문항을, 필요한 공급량만큼 생산**하는 것이다. “원문마다 무조건 10개”나 “숫자만 바뀐 10개를 다양성 10개로 집계”하는 것은 목표가 아니다.

| 우선순위 | 보완 | 닫아야 할 위험 |
|---|---|---|
| P0 | MODE / 목적 / A·B·C 분리 | 구조변형을 STRICT 또는 C로 위장 |
| P0 | RPM 의미 → 실제 recipe/capability 연결 | 유효한 key들의 불가능한 조합 생성 |
| P0 | difficulty export adapter | 문자열 bucket·숫자 level의 신규 JS 유입 |
| P0 | solver 적용 범위·답 cardinality·계산 trace | 부분 검사 PASS를 문항 전체 PASS로 확대 |
| P0 | 목표식 변환의 별도 계약 | 답만 정수로 만들고 출제 의도·조건을 훼손 |
| P0 | 완전한 학생 입력 동결 후 통합 독립검수 | 보기·그림 추가 전의 낡은 blind PASS 재사용 |
| P0 | 기존 seal까지 1-family 수직 연결 | 수십 문항 생성 뒤 마지막 호환성 실패 |
| P0 | 실행 profile·입력 격리·identity qualification | legacy stage를 새 provider 호출 권한으로 착각하거나 원문 UID에 새 문항 증거 결속 |
| P0 | planner 산출 형식·분모·재개 계약 | 생성 가능과 등록 가능 혼동, 재시도로 수량·예산 부풀림 |
| P1 | 공급 부족 기반 planner·전역 중복·수요별 확장 | 쓰지 않을 문항과 의미상 복제의 대량 축적 |

검사 항목을 늘리는 것과 AI 호출·worker를 늘리는 것은 다르다. 반복 비용은 family 단위 사전 검증과 immutable artifact 재사용으로 줄인다. 개별 문항의 필수 품질 증거를 허위 집계로 대체하지 않는다.

---

## 3. ALIVE_REPLACEMENT / ALIVE_EXPANSION / MODE / class

### 3.1 목적과 MODE를 분리한다

`ALIVE_EXPANSION`은 우선 **sidecar의 generationPurpose**로 설계한다. 기존 MODE에 네 번째 값을 바로 추가하지 않는다. v0.1의 `generationMode: ALIVE_EXPANSION` 예시는 이 구분으로 대체한다.

- `ALIVE_REPLACEMENT`: 승인된 기존 slot을 수리·대체한다. 현재 same-stage repair 계약과 provenance를 유지한다.
- `ALIVE_EXPANSION`: source는 보존하고 별도 generated UID를 만든다. 원기출 qid·순서·시험지 identity를 덮어쓰지 않는다.
- `mode`: 실제 실행되는 기존 TYPE_BANK / EXAM_FOLLOWUP / STRICT_VARIANT 중 하나다.
- `declaredClass / verifiedClass`: 해당 변형 proof가 적용될 때만 A/B/C 및 VERIFIED_A/B/C를 사용한다.

### 3.2 실행 선택표

| 의도 | 기존 경로 | 유지할 조건 |
|---|---|---|
| 동일 구조 수치 연습 | STRICT_VARIANT / A | 원문 graph·목표·형식·난도 역할 보존. Meta 다양성 증가로 집계하지 않음. |
| 동일 핵심 구조의 표현 변형 | EXAM_FOLLOWUP 확인 / 검증 가능한 B | 기존 확인문제 fidelity·난도 동치와 실제 B proof 모두 만족. |
| 전처리 1개 추가 | 지원되는 C 변형 | deterministic, branchCount=0, newConcept=false, 필수 전처리 1개. 기존 MODE의 난도 역할도 별도 확인. |
| 같은 L3의 다른 구조·L4 | TYPE_BANK 구조변형 또는 이미 검증된 해당 recipe | A/B/C에 억지로 넣지 않음. 해당 MODE의 구조변형·fidelity·seal 연결을 실제로 확인. |

C라는 이유만으로 새 교차개념·경우 분기를 허용하지 않는다. TYPE_BANK라는 이유만으로 숫자갈이를 허용하지 않는다. ALIVE 변형 A/B/C, 심화 품질 A~C, Common 시험지 A/B형, taxonomy L3, ALIVE Input Level L3는 서로 다른 체계다.

### 3.3 lineage seed와 construction reference

하나의 원문 seed에서 얻은 L3를 공유하더라도, 다른 L4 문항은 그 L4에 맞는 **검증된 construction recipe/reference**를 선택할 수 있다. seed는 출발 근거이고 construction reference는 실제 생성 구조의 근거다.

두 참조와 SHA를 모두 보존한다. 새 reference를 사후에 만들어 실패한 fidelity를 통과시키지 않는다. TYPE_BANK의 기본형/Fingerprint와 구조변형 증거를 먼저 확립하고, A/B/C를 사용하는 하위 변형은 그 선언된 reference를 기준으로 증명한다. 이 연결이 미구현이면 해당 slot은 미지원이며 기존 VERIFIED_A/B/C ledger를 완화하지 않는다.

**선택표는 dispatch 구현표가 아니다.** MODE를 선택했다고 해당 family의 command·proof·seal이 자동 연결되지는 않는다. 특히 TYPE_BANK 구조변형의 최초 기본형→구조변형 관계와, 그 구조변형을 reference로 삼는 A/B/C의 관계를 서로 다른 evidence로 기록한다. ABC-only ledger를 요구하는 경로에 최초 구조변형을 `VERIFIED_B`로 넣지 않는다. 최초 구조변형을 수납하는 경로가 없으면 새 구조 생성은 아직 실행 불가이며 계획 결과로만 반환한다.

---

## 4. Meta Blueprint와 실행 가능성

### 4.1 잠금 축

각 expansion group의 curriculum / standardCourse / L1 / L2 / **RPM Primary L3**를 잠근다. 최종 실제 L3가 달라지면 그 group의 정상 산출물로 집계하지 않는다.

RPM L3/L4 ID와 `problemTypeKey/templateKey`를 같은 필드로 취급하지 않는다. 전자는 의미 정본이고 후자는 현재 runtime의 compatibility projection이다. 하위 선수 scope의 RPM 의미를 사용하는 경우에도 target L1/L2는 유지하고 `semanticSourceScope / semanticScopeRelation`을 기록한다.

### 4.2 변화 가능 축

L4, CrossConcept, Condition, IntegrationPattern, 표현·상황, response form, visual policy, 목표 difficulty를 **각 slot의 사전 계획**으로 정한다. 기본은 source와 동치인 난도 역할이며, 심화·다른 난도는 별도 명시된 profile로 분리한다.

ACTIVE key가 각각 존재한다는 사실만으로 그 조합이 출제 가능하지는 않다. 실행 가능한 slot은 다음 교집합에 속해야 한다.

~~~text
canonical semantic + 허용 prerequisite
∩ 해당 MODE/fidelity
∩ 실제 등록 family × transform/recipe
∩ parameter domain + complete solver coverage
∩ response form + 필요한 visual capability
∩ 난도·계산량 profile
~~~

기존 registry의 SUPPORTED, 승격 보고서의 ACTIVE/ACTIVE_BOUNDED, 최종 production 등록은 다른 사실이다. 실제 생성 함수가 읽는 adapter와 version·domain·proof·fixture를 확인한다. MIXED/free-form fallback으로 미지원 조합을 채우지 않는다.

### 4.3 의미와 projection의 실패를 나눈다

- RPM 의미 자체가 불확정이거나 target L3와 불일치하면 해당 slot의 의미 gate를 통과할 수 없다.
- RPM 의미는 FINAL인데 machine binding만 부족하면 projection debt다. 없는 PT/TPL을 만들거나 의미 HOLD로 오기록하지 않는다.
- current exact ACTIVE mapping이 있으면 채우고, 유효한 null/debt는 현재 canonical 및 consumer adapter가 허용하는 방식으로만 기록한다.
- semantic-only slot을 정확한 PT/TPL이 필수인 consumer에 넣을 수는 없다. 지원되는 소비 경로 또는 projection 보완 대상으로 분리한다.

---

## 5. Difficulty와 Computation Budget

### 5.1 스키마 호환은 P0다

현재 ALIVE Master의 qualitative bucket과 Archive의 `difficultyBucket=1..5`는 같은 schema가 아니다. `basic → 1` 같은 임의 직결도 금지한다.

ALIVE의 기존 8축 DifficultyVector는 그대로 둔다. 새 `calculationLoad`를 기존 vector에 몰래 추가하지 않고 `computationProfile` sidecar로 분리한다. Archive export는 current 문항을 재판정한 다음 아래를 물리적으로 저장한다.

~~~text
level: 하 | 중 | 상

difficultyBucket: 1 | 2 | 3 | 4 | 5
difficultyConfidence
difficultyBoundaryFlag
legacyLevelCompatibility
~~~

정확한 허용값·UNKNOWN·경계·legacy 정책은 difficulty v1.3을 참조한다. ALIVE의 내부 구형 bucket은 별도 namespace에 보존하고 숫자 bucket으로 자동 캐스팅하지 않는다. 해설 길이, 조건 태그 수, 큰 수 자체로 난도를 결정하지 않는다.

### 5.2 계산량은 학생 풀이 경로 기준으로 측정한다

family × difficulty × response/transform profile별로 `maxCoreSteps`, `maxCaseSplit`, `maxIntermediateIntegerMagnitude`, `maxFractionDenominator`, `maxExpansionTerms`, `maxRadicalTerms`, `maxNestedFractions`, `maxEquationDegree` 등을 둔다.

측정값은 검증된 교육과정 내 풀이의 계산 trace에서 산출한다. Python 실행 연산 수나 작성자가 쪼갠 solutionGraph node 수를 학생의 사고 단계 수로 사용하지 않는다. 각 metric의 셈 규칙·검사 대상·예외를 version으로 고정한다. `maxSymbolCountPerLine`은 조판 진단이지 인지 난도 판정이 아니다.

최종 답, 중간 분모·전개, 각 경우, 오답 보기의 형식 부담을 함께 본다. 정상적인 분수·근호를 전역 금지하지 않는다. 자동 정수화 때문에 핵심 개념이 사라지는 후보도 거부한다.

### 5.3 난도와 계산량 모두 만족해야 한다

같은 bucket이라도 확인문제의 인지 핵심 축이 바뀌면 원문 동치가 아니다. 반대로 C 전처리의 추가 작업량을 “계산량 무변화”로 가장하지 않는다. MODE의 상대 난도 조건과 최종 Archive bucket, 계산량 budget을 따로 판정한다.

임계값은 대표 기출·Golden의 해당 풀이 구조와 pilot trace로 정한다. 이 문서는 전 학년 공통 숫자 상한이나 근거 없는 가중합 점수를 새 canonical로 만들지 않는다.

### 5.4 신규 문항의 level과 current-pass evidence

새 문항의 `level`도 최종 풀이를 현재 3단계 규칙으로 판정한다. source의 level은 MODE의 상대 난도 비교 근거이지 새 문항으로 deep-copy할 값이 아니다. 기존 original의 historical level을 이번 생성 작업에서 수정하지 않는다. bucket을 보고 level을 역산하거나 target bucket에 맞춰 actual bucket을 고치지 않는다.

2026-10-03 CURRENT에 따라 Meta/difficulty 재검은 prior level·bucket·verdict가 보였다는 사실만으로 무효가 되지 않는다. 검증된 최종 해설에서 구조를 다시 추출하고 current-pass 판단을 기록한 뒤 target/legacy와 비교한다. 수학 blind 입력의 비노출 계약은 별도로 유지한다. 같은 worker가 수행해도 semantic pass와 difficulty 판단은 서로 다른 evidence axis여야 한다.

`validateBlindDifficulty`의 `blindPassStatus=FRESH_INDEPENDENT` 같은 기존 문자열은 현재 schema 호환값이다. 실제 수행 없이 채우거나, 그 문자열만으로 fresh agent·비노출·수학검수 완료를 주장하지 않는다. low confidence·boundary·legacy conflict는 현행 validator가 요구하는 재검/adjudication evidence로 닫는다. UNKNOWN 저장 가능성과 이번 신규 검증 완료 공급의 자격은 구별한다.

---

## 6. Answer Normalizer를 두 기능으로 분리한다

### 6.1 표현 정리와 질문 대상 변경은 다르다

- **값 보존 정규화:** `384/50 → 192/25`. 묻는 수학적 값은 같다.
- **목표식 변환:** `S → 25S`. 원래 답과 새 답은 다른 값이다. 가역적인 관계가 있을 수 있으나 같은 출제 목표라고 자동 선언할 수 없다.

생성 우선순위는 **검증된 좋은 수치의 구성 → bounded parameter resample → 사전 허용된 목표식 변환 → 후보 종료**다. exact solver 결과와 맞지 않는 보기·정답만 바꾸어 통과시키지 않는다.

### 6.2 목표식 변환 계약

`rawTarget=T`, `finalTarget=g(T)`, 허용 domain, quantity/unit, forward/inverse 관계, 원래·최종 답, 실제 교육과정 내 풀이와 난도 변화를 함께 기록한다.

`g(T)=kT`이면 k는 허용된 고정 상수이며 0이 아니어야 한다. 출력값을 보고 사후에 임의의 k를 붙이는 대신 family/문형의 허용 target 정책 안에서 선택한다. 질문에는 답이 아니라 **“25S의 값”**만 표시한다.

예시: 어떤 도형의 넓이가 `S=192/25`로 확정되고 해당 recipe가 배수 target을 허용한다면 `25S`의 답은 192이며 역관계는 `S=(25S)/25`다. 이것은 값 보존 정규화가 아니라 목표식 변경의 예다. 원의 넓이 등에서는 π와 단위를 별도로 보존한다.

2, 3, 4, 5, 10, 25 등의 배수도 자동 허용 whitelist가 아니다. 사람 수·확률·좌표·길이·넓이마다 자연성과 의미가 다르다. 불필요한 `37S`나 표면상 정수 답을 만들기 위한 기괴한 질문은 resample 우선이다.

### 6.3 가역성만으로 충분하지 않다

`T²`는 부호를 잃을 수 있다. 제한된 domain에서 가역적이어도 원래 필요한 부호 판단·경우 분기를 제거한다면 L3/L4·난도 역할을 바꿀 수 있다. 목표량이 매개변수와 무관해져 핵심 풀이를 우회하는 경우도 거부한다.

변환 후 final target을 exact 재계산하고 영향받는 budget·보기·해설·Meta를 갱신한다. 최종 spec을 다시 동결하며 Reverse Check는 **변환 후 spec**과 비교한다. STRICT_VARIANT의 objective lock과 충돌하는 변환은 해당 MODE에서 금지한다.

---

## 7. Mathematical Spec과 Stem Realizer

수학 객체가 먼저이고 학생용 발문은 그 표현이다. 내부 spec은 변수/domain, givens, 관계, 양화·범위·끝점, target/단위, 답의 타입·cardinality, solutionGraph, 필수 조건, Meta 목표, response/visual 요구를 가진다.

기존 Universal IR에 이미 있는 필드는 재사용한다. 별도 거대 수학 언어·범용 자연어 parser·새 solver framework를 P0에서 만들지 않는다. 지원되는 family에 필요한 typed 확장만 sidecar/adapter로 추가한다.

solver가 내부 정답을 알고 있어도 공개 발문에는 정답·유도 과정·해설용 보조선이 누출되지 않아야 한다. 특히 problem visual과 solution visual을 다른 역할로 관리한다.

Stem Realizer는 확정 spec의 조건을 임의로 생략·추가하거나 난도에 맞추어 바꾸지 않는다. 모순·과소조건·퇴화가 확인되면 생성 spec으로 돌아가 revision을 만들고 이전 검수를 재사용하지 않는다.

---

## 8. Stem Pattern Bank와 학생용 표현

Pattern Bank는 긴 원문 문장의 복사본이 아니라 **조건·대상·질문 역할을 갖는 검증된 문형**이다. 각 pattern에 적용 family/L4, 필수 slot, 변수 지칭·조사 규칙, response form, source reference, version을 둔다.

“~일 때, ~의 값은?”, “~을 만족시키는 정수 ~의 개수는?” 같은 일반적인 짧은 문형의 재사용은 허용한다. 모든 문장을 억지로 다르게 써서 수학적 자연성을 훼손하지 않는다. 긴 고유 문장·상황·수치 구조를 그대로 복제하는 것은 별도로 탐지한다.

“옳은 것만을 보기에서 있는 대로 고른 것은?”처럼 문장 속에서는 평문 `보기`를 쓴다. 독립 보기 제목·조건박스는 엔진 규칙대로 분리한다. v0.1의 inline `<보기>` 예시는 신규 발문 표준으로 사용하지 않는다.

발문과 해설 조판은 현재 Archive 정본을 따른다. 글자 수·정규식에 따른 일괄 강제 줄바꿈, choices의 ①~⑤ 중복, 무단 wide/특수배치는 금지한다. 수학적으로 정확한데 문장만 부자연스러운 경우에도 해당 stem만 고치고 영향 evidence를 다시 결속한다.

실제 해설 생성·수정 worker는 target 작업 전에 Golden 2~3개와 관련 Negative Sample을 판독한다. 해설은 **식 세우기 → 식 변형 → 중간값 → 대입 → 최종값**의 필요한 단계를 별도 줄/수식 블록으로 보여준다. 발문은 조건·질문·보기·공통자료의 의미 경계에서 나누되 수식·단위·조건의 결속을 유지한다. desktop/mobile 실제 화면의 수식 흐름과 줄바꿈을 판정하며 줄 수만으로 PASS를 만들지 않는다. 이번 설계 문서 수정은 학생용 해설 생성·수정이 아니므로 sample preflight나 해설 품질 PASS를 실행한 것으로 기록하지 않는다.

---

## 9. Reverse Stem Check와 완전한 학생 입력 동결

### 9.1 입력을 먼저 완성한다

독립검수 bundle에는 최종 발문뿐 아니라 **보기 전부, 조건박스·표, 문제 그림, 공통자료와 그 참조 자산**이 들어간다. 실제 표시되지 않는 private spec이나 SVG metadata를 학생이 본 것으로 간주하지 않는다.

보기·problem visual을 Reverse Check 뒤에 만드는 v0.1의 선형 순서는 폐기한다. required asset이 없으면 그 문항의 학생 입력이 미완성이다. solution visual은 blind 입력에서 제외하지만 최종 해설·시각 품질 검수에서는 확인한다.

### 9.2 한 독립 판독 안에서 복원과 풀이를 묶는다

기존 독립 Solver의 별도 입력 session에서 student bundle만 먼저 읽고 다음을 동결한다.

- 복원한 조건·범위·goal·quantity·questionType와 해석상 애매함
- 독립 계산 결과·답의 cardinality·보기별 판정
- 사용한 primaryMethod / decisiveStep와 실제 필수 조건

동결 전에는 작성자의 target Blueprint, 정답, 해설, 기대 verdict를 제공하지 않는다. 동결 뒤 final spec·builder 결과를 공개하여 비교한다. 같은 입력을 읽는 Reverse 전용 agent와 Solver 전용 agent를 무조건 각각 신설하지 않는다.

blind packet은 final student projection의 **허용 필드만 추출**한다. 경로·파일명·SVG title/desc·alt text·공통자료 metadata·sidecar 참조에도 hidden answer, target 분류, 해설용 보조선이 섞이지 않는지 확인한다. 참조 경로의 존재만으로 그림을 읽은 것으로 간주하지 않으며 실제 필요한 자산 판독과 hash를 기록한다. 렌더용 수학 라벨 등 학생에게 공개되는 내용은 보존한다.

### 9.3 비교 기준

조건 누락·의미 추가, 다른 질문 대상, 불명확한 지칭, 필수 자산 누락, 허용되지 않은 해석, 정답 누설은 실패다. 논리적으로 동치인 표현은 family의 명시적 동치 규칙과 근거로 비교한다.

발문에서 저자의 유일한 solutionGraph를 복원할 수 있다고 가정하지 않는다. 타당한 대안 풀이가 있으면 그 풀이를 검토한다. 그것이 잠근 L3의 핵심을 우회하거나 목표 Meta와 다르면 목표 적합성 판단을 다시 한다. reviewer를 목표 라벨에 맞춰 설득하지 않는다.

Reverse PASS는 수학·교육과정·해설·렌더 PASS를 대신하지 않는다. 동결 뒤 content/choices/problem asset이 바뀌면 영향받는 독립 입력과 검수는 stale다.

---

## 10. Fresh Semantic Reclassification

최종 문항과 independently verified final solution에서 primaryMethod/decisiveStep을 다시 정하고 다음 경로를 사용한다.

~~~text
RPM Primary current scope
→ 필요 시 이미 이수한 lower-only prerequisite scope
→ 해당 학년·과목 crosswalk
→ GLOBAL ACTIVE taxonomy/template + exact binding
→ 실제 L3/L4/CrossConcept/Condition/Integration과 target 비교
~~~

새 문항의 Meta를 `metadata_finalizer.py`의 source deep-copy로 확정하지 않는다. 이 함수는 태그 정리 보조로만 쓰고 최종 의미·projection은 전용 adapter로 export한다.

CrossConcept는 실제 풀이에 쓰인 선수개념이어야 한다. 단어 등장이나 불필요한 조건을 추가해 diversity 점수를 올리지 않는다. 선언한 연결이 없거나 주개념을 대체하면 실패다. Condition/Integration도 canonical 의미와 실제 추론의 일치를 확인한다.

현행 Meta CURRENT는 current-pass 재판정을 요구하지만 Meta마다 fresh agent·비노출 session을 요구하지 않는다. 앞 절의 수학 blind 독립성과 이 규칙을 혼동하지 않는다. 동일 검수 worker가 verified solution 이후 Meta를 재판정할 수 있다.

Resolver의 `sourceIdentity`는 이 단계에서는 **분류 대상인 생성 문항 자체**를 뜻한다. parent seed나 construction reference의 UID·contentHash·solutionHash를 대신 넣지 않는다. `generatedQuestionUid ↔ final consumer path/examId/qid ↔ resolver questionUid/sourceIdentityKey`의 일대일 대응을 먼저 고정하고 `questionUidForSource` 등 현행 identity 계약과 대조한다. parent lineage는 별도 sidecar로 보존한다. 재번호·export path 변경으로 identity가 바뀌면 대응표·resolver receipt·consumer parity를 새로 결속한다.

`primaryMethod`와 `decisiveStep`만 적은 문장으로 resolver PASS를 대신하지 않는다. current source/solution fingerprint, authority 파일·실제 lookup row, semantic/projection evidence, difficulty evidence, `makeMetaValidatorReceipt` 또는 validator CLI의 유효 receipt까지 수납한다. 합법 projection debt도 실제 lookup과 populated key validity 증거가 있어야 한다.

L3 mismatch는 현재 group에서 reject다. L4/CrossConcept/Condition/Integration mismatch도 자동으로 목표값을 고쳐 통과시키지 않는다. 수학적으로 좋은 off-target 후보를 살리려면 별도 requeue 사유·새 Blueprint revision·consumer 적합성을 기록한다. 원래 요청 slot의 충족 수에는 포함하지 않는다.

---

## 11. 10-Blueprint Diversity와 중복

10은 기본 목표 수량이지 어떤 family에서도 달성 가능한 최소 보증이 아니다. 먼저 실행 가능한 조합 수를 계산한다. 없는 L4·CrossConcept를 만들거나 그림·문장만 바꾸어 10개 의미 설계로 집계하지 않는다.

각 후보를 세 수준으로 구분한다.

| 수준 | 비교 기준 | 집계 |
|---|---|---|
| 의미 설계 | primary/decisive 구조, L4, 실제 사용 CrossConcept·Condition·Integration, 목표 역할 | 서로 다른 학습 경험 수 |
| 파라미터 instance | 같은 구조의 유효한 수치·상수 배치 | 반복 연습 수 |
| 표현 surface | 변수명, 문장·보기 순서, 표면 배치 | 표현 변형 수 |

정확한 instance 중복은 막되 STRICT 숫자 연습을 전부 불법 중복으로 취급하지 않는다. 반대로 숫자 연습을 Meta 다양성으로 승격하지 않는다. graph fingerprint는 family의 의미 정규화가 보장하는 범위에서만 비교한다.

다양화 우선순위는 L4 → 실제 CrossConcept → 의미 있는 Condition/Integration → representation → parameter다. 우선순위는 품질을 훼손하는 의무 quota가 아니다. 같은 간결한 문형의 재사용보다 다른 핵심 학습 경험 확보가 우선이다.

같은 batch뿐 아니라 이전 generated bank와 original source의 exact/구조 fingerprint도 조회한다. 조회 범위·버전·미확인 구간을 기록한다. 서로 다른 UID나 학교명만으로 독립 문항이라고 판정하지 않는다.

정확한 bytes 중복과 구조 유사성은 다른 검사다. family별 정규화에서 변수명·기약분수·교환 가능한 조건/보기 순서만 다른 instance를 어떻게 처리하는지 정하고, 양성·음성 쌍으로 검증한다. 일반 문형이나 같은 정답값만으로 서로 다른 문항을 합치지 않는다. fingerprint의 미지원 비교는 서로 다름의 증명이 아니라 `비교 미확인`이다. 검색 범위가 불완전하면 전역 무중복·Common A/B 완전 독립을 보증하지 않는다.

---

## 12. Generation Ledger와 재현성

기존 run/sidecar를 확장하여 사용한다. production JS에는 최종 학생용·검색용 canonical 값만 두고 상세 증거는 sidecar에 둔다. 아래는 필드 책임표이며 기존 schema에 이미 구현됐다는 뜻이 아니다.

| 묶음 | 최소 기록 |
|---|---|
| 요청·정체성 | requestId, batchId, blueprintId/revision, attemptId, generatedQuestionUid, generationPurpose, mode, 적용되는 variant class/proof ref |
| 근거 | lineage source UID/SHA, construction reference/SHA, semanticSourceScope, curriculum·RPM·crosswalk·binding snapshot refs |
| 실행 범위 | 실제 family/recipe/transform, adapter/solver/budget/pattern version, parameter domain, capability evidence |
| 목표·결과 | targetBlueprint, actualClassification, projection disposition/debt, final difficulty 4필드 |
| 계산 | exact method/coverage, domain·존재·cardinality 증거, trace/ref, computation metric와 budget verdict |
| 목표 변환 | raw/final target·answer·unit/domain, transform/inverse 증거, 자연성·fidelity verdict |
| 독립검수 | reviewer/session/visibility, student bundle와 asset hashes, first-pass freeze, compare·adjudication ref |
| 종결 | final artifact/asset/sidecar hashes, 기존 closure·render·seal evidence, publication authority와 readback |
| 실패·재시도 | 실패 원인, 소비한 시도 수, supersedes, 다음 동작, accepted/rejected/shortage의 분모 |

Git blob SHA-1, raw file SHA-256, semantic fingerprint의 목적을 구별한다. 실제 학생 필드·자산·규칙·solver·정규화가 바뀌면 영향 evidence를 새 revision에 결속한다. 무관한 main commit 전진만으로 모든 후보를 다시 만들지 않는다.

seed만 같다고 AI 출력까지 재현된다고 주장하지 않는다. 난수 알고리즘·runtime/version·실제 선택 파라미터를 보존하고, 비결정적 생성 응답은 원문 artifact로 동결한다. 같은 request/slot 재실행은 이미 검증된 artifact를 재사용하고 중복 UID·중복 publication을 만들지 않는다.

---

## 13. Validator Chain — 논리 gate와 실행 호출 분리

v0.1의 B0~B16은 책임 목록으로 유지하되 17개 독립 worker/예약/상태를 만들지 않는다. 기존 ALIVE run과 validator에 다음 순서로 연결한다.

| 단계 | 실제 내용 | 기존 gate와의 관계 |
|---|---|---|
| A. 계획·preflight | 공급 gap, Meta·MODE·실제 capability, budget·pattern·필수 자산 확인 | 생성 전에 미지원 slot을 분리 |
| B. candidate 완성 | 수학 객체·파라미터·final target, complete exact solve와 budget, 발문·보기·problem visual·학생용 해설 | builder-side witness이며 독립 PASS 아님 |
| C. student freeze·독립검수 | 완전한 학생 bundle → Reverse + independent solve 동결 → compare → curriculum/fidelity/Meta/difficulty·해설 검수 | 기존 독립 role/입력 격리를 재사용 |
| D. final artifact closure | distractor/visual/중복/serializer, 필요한 실제 엔진 렌더, 기존 seal | 앞 단계부터 수행한 검사를 final SHA로 수납. 변경 시 영향 범위만 재확인 |
| E. 공급 등록 | 별도 권한으로 Similar/Common 공급 projection·publication·remote readback | SEALED_LOCAL과 publication을 구분 |

보기의 최종 순서·정답 위치 분포 조정은 가능한 한 C 이전에 끝낸다. 뒤에서 permutation하면 choices/answer index/해설 결론·렌더와 입력 hash에 미친 영향을 재검증한다. 수치 정답이 같다는 이유로 낡은 option-index evidence를 유지하지 않는다.

agent 수·동시성·launch/retry 권위는 기존 `archive/tools/pipeline-core/AGENT_BUDGET.md`와 선택 실행 경로를 따른다. 이 문서가 새 실행 토폴로지나 GPT 예약 라인을 신설하지 않는다.

### 13.1 첫 생성 전 execution qualification

Phase 1은 선택한 **generation entrypoint / execution profile / proof consumer / serializer / finalizer**를 실제 코드 경로로 적는다. MODE, family capability, 실행 profile은 서로 다른 축이다. 함수가 존재해도 필요한 receipt를 해당 finalizer가 소비하지 못하면 end-to-end 지원이 아니다.

pipeline-core v2를 선택하면 사용자 요청 전체가 하나의 work batch 분모이며, Blueprint·family·문항·검수축마다 새 FINAL_AUDIT를 만들지 않는다. zero-model provider-preflight → plan-bound reserve/dispatch → 기존 launch의 terminal reconcile → whole-job audit 및 별도 release audit를 따른다. TARGETED_RECHECK 횟수는 선택 profile에 저장된 한도를 그대로 쓴다. 신규 expansion을 Past Exam이라고 임의 표시하여 세 번의 allowance를 얻지 않는다. legacy staged/FAST의 옛 dispatch는 새 호출 권한이 아니다.

v2의 U1 SOURCE_ONLY, U2 ARTIFACT_ONLY, U3 CANDIDATE_ONLY를 §9의 작성자→독립 Solver→compare와 이름만 바꾸어 연결하지 않는다. 다음을 **실제 packet과 validator의 양성·음성 fixture**로 확인한다.

- final generated student bundle의 blind 수학검수가 어느 승인된 input projection/axis에 속하는가. 원문만 푼 SOURCE 수학검수로 새 문항의 독립검수를 대신하지 않는가.
- 세 packet은 freeze에서 독립적으로 seal되는가. U3에 계약상 제공되는 currentAnswer/currentSolution 검토와 student-only 풀이 증거를 구분하는가.
- phase 간 auditor output을 입력으로 넘기지 않고 deterministic merger가 후단 비교하는가. 동일 session에서 답을 본 뒤 blind라고 재표시하지 않는가.
- Meta/difficulty machine receipt, actual render witness, ABC 또는 해당 구조변형 proof, final seal을 선택 finalizer가 소비하는가.

승인된 projection/consumer가 없으면 **연결 미지원으로 보고**하고 그 recipe의 자동 end-to-end 실행을 시작하지 않는다. 필드명·visibility label·임의 PASS로 연결을 가장하거나 extra solver agent를 자동 추가하지 않는다. 지원되는 다른 recipe의 계획·로컬 작업은 계속할 수 있다. 과거 SEALED_LOCAL 사례는 그 당시 범위의 근거이며 새 expansion profile의 qualification을 대신하지 않는다.

machine capture와 semantic render review는 분리한다. 실제 render를 기본 파일럿 목표로 두되, 실행 라인의 명시적 waiver를 사용하는 경우 실제 권한·scope·사유·대체 검수·SHA를 적고 `NOT_RUN_ROOT_WAIVER` 등 그 라인의 상태를 유지한다. waiver 결과를 actual render qualification의 표본으로 세지 않는다.

---

## 14. Common Assessment Factory와의 접점

소유권을 다음처럼 나눈다.

- Meta Foundation: 개념 의미·키·부모·binding authority.
- Common Factory: 교사 수요, Recipe, 제품의 slot·난도·source cap·A/B 배분과 조립.
- ALIVE: 요청받은 slot의 실행 가능성, 문항 생성·검수·증거.
- Similar/Generated Registry: 검증 수준이 표시된 저장·검색·공급 projection.
- Original Archive: 원기출 identity와 직접 열기 경로.

Factory는 부족 slot 명세를 전달하고 ALIVE는 accepted candidate와 미충족 사유를 반환한다. ALIVE가 별도 Recipe 정본이나 제품 builder를 만들지 않는다. Factory 기본 문항 수·난도 비율을 이 문서에 복제하지 않는다.

Common v0.13의 **일반 활용 가능성**과 **검증 완료 표시**를 분리한다. 이번 신규 generated 검증 profile을 기존 original/practice 전체의 전역 차단 조건으로 확장하지 않는다. 기존 UNKNOWN·검수 미완료 자료의 허용된 검색·미리보기·직접 선택을 막거나 VERIFIED로 위장하지 않는다.

정확한 Meta/difficulty·분리 A/B를 보증하는 신규 제품은 그 주장에 필요한 evidence를 요구한다. 일반 practice의 유연한 Recipe와 같은 계약으로 취급하지 않는다. 생성·검수가 길어져도 교사의 클릭 경로에서 동기 생성으로 기다리게 만들지 않고, 이미 준비된 공급을 사용한다.

---

## 15. 저장 위치·identity·publication 경계

IR·계획·run 상태는 기존 `alive/runtime` 계약을 사용한다. **Archive 시험지로 직렬화하는 신규 중간 JS·문제 이미지·해설 SVG·review shadow·render bundle은 `.tmp/archive/<runId>/<examUid>/`에 둔다.** JS basename은 처음부터 `<examUid>.js`, 설치용 참조는 `assets/images/<examUid>/<asset-name>`으로 고정한다. preview manifest가 임시 실물과 최종 상대 참조를 연결한다. 승격은 이름과 참조를 유지하고 위치만 바꾸는 것이 기본이다. `archive/_generated/`, `archive/exams/_generated/`는 역사 조회 전용이며 신규 생성·갱신·stage에 쓰지 않는다. original production에 직접 쓰지 않는다. generated UID와 문항 revision은 source UID와 분리하고 parent source를 참조한다.

이 경로 지시는 사용자 현재 `AGENTS.md`가 이번 세션에서 명시한 authority다. 지정된 `docs/rules/02_PIPELINES/Archive_Exam_Temporary_Workspace_v1.md`는 최초 작업 폴더에서 읽었지만, 이번 검토의 원격 baseline `92911a8...`에는 없다. 그 local 문서·helper를 원격 구현 완료로 보고하지 않는다. Phase 2 전에 실행 checkout의 정본·preview/serializer/finalizer 경로 지원을 확인하고, 누락된 계약/도구는 해당 실행 prerequisite debt로 보고한다. 이번 계획서 변경에 다른 작업의 미커밋 파일을 섞어 넣지 않는다.

위 local 정본의 이번 판독 SHA-256은 `6cf4e05a81eb7c43cdf84b3d6b04e88cf26913e4bdcd18b7a93e77921ee42d9c`다. 이는 현재 판독 provenance이며 Git 반영·엔진 지원 완료의 증명이 아니다.

최종 JS의 `id`는 그 generated 시험지 안의 표시 번호다. `sourcePath|examId|qid` identity를 사용하는 consumer에는 별도 generated path/examId를 제공한다. 원문 q7과 새 시험지 q7은 같은 문항이 아니다. 배치 일부만 채택할 때 채택본의 새 denominator와 displayNo→generated UID 매핑을 동결한다.

신규 Similar export는 current JS schema, Meta, difficulty 4필드와 필요한 자산을 실제로 포함해야 한다. 과거 similar 파일을 신규 schema의 기준으로 복사하지 않는다. 생성 provenance와 실제 source kind의 구체적 export는 consumer가 지원하는 필드로 adapter에서 확정한다.

`SEALED_LOCAL ≠ PUBLISHED ≠ COMMON_VERIFIED_SUPPLY`다. 해당 artifact의 검증 상태와 소비자 등록·권한·readback을 별도로 확인한다. 기존 ALIVE seal만으로 original write, Common 서버 제품 생성, 접근 권한 변경이 허용되지 않는다.

Phase 4의 publication adapter는 request/slot/artifact revision에 결속된 idempotency key, 등록 대상 snapshot, receipt와 readback을 정의한다. timeout/응답 유실이면 같은 key로 실제 등록 여부부터 조회·reconcile한다. 새 UID나 새 key로 재등록하여 중복 공급을 만들지 않는다. 자산 설치·JS 등록·index 갱신의 중간 실패와 rollback/reconcile 책임을 정하고, consumer의 실제 저장 bytes·자산 참조·Meta/difficulty가 봉인본과 같은지 확인한다. API가 아직 없으면 계약 후보와 미지원 상태로 기록한다.

Common A/B 완전 분리에는 UID뿐 아니라 알려진 source lineage·construction family·구조 fingerprint 공유를 고려한다. 새 파일명을 여러 개 만들어 source cap을 우회하지 않는다. 공유 또는 미확인 관계를 숨기지 않으며 제품의 현재 허용 profile대로 표시한다. 학생용 제공에서 정답·해설 비공개, 서버 canonical 및 snapshot 계약도 유지한다.

---

## 16. 최소 구현 touchpoint

먼저 아래 **세 책임 묶음**을 작은 adapter로 구현한다. 파일 수를 목표로 삼지 않는다.

1. **계획 adapter:** current Meta lookup + 가능 조합/recipe 선택 + 수량·부족 사유. 기존 registry를 조회하고 새 capability를 임의 등록하지 않는다.
2. **family generation wrapper:** 기존 IR/solver/renderer를 사용하고 typed target 변환·trace budget·최소 pattern을 추가한다.
3. **review/export adapter:** 완전한 student bundle·기존 독립검수 수납, fresh Meta/difficulty export, 기존 sidecar/closure 연결.

`universal_variant_engine.py`, `structure_families.py`, 실제 family solver와 현재 schema/serializer를 재사용한다. `exact_verifier.py`, `adaptive_quality_gates.py`, `metadata_finalizer.py`는 확인한 기능 범위의 보조 도구로만 쓴다.

v0.1의 `meta_blueprint.py`, `expansion_batch_planner.py`, `computation_budget.py`, `answer_normalizer.py`, `stem_pattern_bank.py`, `stem_realizer.py`, `stem_reverse_check.py`, `expansion_ledger.py`는 후속 분리 후보일 뿐 P0에서 여덟 개 framework를 만들라는 지시가 아니다.

별도 scheduler, 범용 CAS/한국어 parser, 전 taxonomy 조합표, 새 renderer, 기존 bank 일괄 migration은 첫 구현에서 제외한다. shadow flag/profile로 격리하고 기존 run의 결과·MODE·판정을 바꾸지 않는 회귀 조건을 둔다.

---

## 17. 파일럿 — 작게 만들되 끝까지 연결

첫 family는 이름만 보고 정하지 않는다. 실제 등록된 bounded recipe와 완전 solver, current Meta 대응, 저시각/비시각의 지원 범위를 확인해 선택한다. 문서에서 전 과목 지원이나 family별 생산 수량을 선포하지 않는다.

선택 근거는 solver domain/coverage, 현재 lookup 결과, 둘 이상의 의미 구조를 공급하는 실제 recipe, 저시각 경로, 승인된 review/export/seal 연결로 남긴다. 등록된 family에 숫자치환 A만 있으면 숫자 연습 파일럿은 가능해도 **Meta 의미 확장 성공**이라고 부르지 않는다. construction reference의 선정 근거와 holdout의 제외 범위를 생성 전에 고정한다.

첫 수직 파일럿의 제안 목표는 **1 family / 실행 가능한 의미 Blueprint 2~3개 / 후보 5~10개 이내**다. 가능한 의미 Blueprint가 1개라면 숫자 instance를 3개 의미 설계로 세지 않는다. 해당 부족을 보고하고 다른 지원 recipe를 찾는다.

작은 파일럿 안에서 final schema → independent solve/Meta → budget/normalizer → actual Archive 화면 → 기존 seal까지 연결한다. 이를 30~60문항 생성 뒤로 미루지 않는다. production 등록은 하지 않는다.

그다음 독립 seed/reference와 holdout 사례를 포함하여 3 family, 30~60 후보 수준으로 넓힌다. 이는 계획 목표이며 품질·실행 가능성이 수량보다 우선이다. 초기 채택 문항은 전 문항 독립검수한다. 실패 후보와 부족 slot도 결과 분모에 남긴다.

---

## 18. Acceptance와 필수 회귀 사례

### 18.1 채택 산출물의 HARD 0

오답, 선언된 답 cardinality 위반, 교육과정 위반, L3 drift, 가짜 canonical key, budget 초과, 부자연스럽거나 의미를 훼손하는 target 변환, 애매한 발문, target/actual 불일치, 금지 중복, 필수 자산·직렬화 오류가 없어야 한다. 필요한 검증이 NOT_TESTED인데 PASS로 집계하지 않는다.

solver 증거는 domain·방법·coverage와 결속한다. 해 존재/유일성, 모든 해·범위·끝점·퇴화 경우, 분모 0·무연근을 해당 family 범위에서 확인한다. exact 모듈의 부분 PASS나 NOT_APPLICABLE은 자동 exact lane의 complete 증거가 아니다. 수치 근사·표 조회 문제는 그 방법의 한계를 표시하고 exact 전 과정으로 위장하지 않는다.

객관식은 보기 전부의 의미 중복·정답 여부·정답 index를 확인한다. 신규 기본 profile은 5지 단일선택이고, 복수정답/증명/다문항 response는 그 타입의 별도 지원이 있을 때만 사용한다. 기존 복수정답 원문을 단일답으로 강제 수정하지 않는다.

### 18.2 양성·음성 fixture 쌍

| 사례 | 기대 동작 |
|---|---|
| STRICT 숫자 변형 vs 조건·목표 추가 | 전자는 해당 proof로 허용, 후자는 STRICT에서 거부 |
| C 필수 전처리 1개 vs 새 개념·분기 | 전자는 지원 범위 검사, 후자는 C로 거부 |
| ACTIVE key지만 recipe 미지원 | 생성 전 해당 slot shortage. generic fallback 금지 |
| RPM FINAL + 합법 projection debt vs lookup 없는 null | 전자는 의미 유지·consumer 별 처리, 후자는 결함 |
| ALIVE 문자열 bucket / 숫자 level export | current Archive schema에서 거부 |
| 최종 답은 정수지만 중간 분모·전개 과다 | budget 실패 탐지 |
| S→25S 허용 recipe vs 비가역 변환·L3 우회 | 전자는 forward/inverse·fresh 검증, 후자는 reject |
| 발문 조건 누락·다른 target·문제 그림 누락 | 완전 bundle/Reverse/독립 풀이에서 탐지 |
| 같은 값을 가진 두 보기·답 index permutation | answer-cardinality/index 불일치 탐지 |
| 검수 뒤 problem asset/choices 변경 | 영향 evidence stale, 무관 문항 재검 없음 |
| 숫자·변수명만 다른 두 문항 | instance 변화와 semantic diversity를 구분 |
| 동일 request 재실행·다른 batch의 동일 instance | 중복 저장·중복 publication 방지 |
| 가족관계가 있는 Common A/B | 완전 독립으로 오표시하지 않음 |
| raw/canonical/semantic hash 혼용 | evidence binding 오류 탐지 |
| 부분 해설 산술만 PASS 또는 일부 method가 NOT_APPLICABLE | complete solver coverage로 승격 금지 |
| parent UID로 생성 Meta receipt 결속 / export 재번호 | identity·fingerprint·4필드 parity 실패 탐지 및 영향 rebind |
| prior bucket visibility 허용 vs target/legacy 값 복사 | 전자는 current-pass evidence 가능, 후자는 판정 근거 위반 |
| recipe SUPPORTED지만 proof/finalizer 연결 없음 | 자동 end-to-end 불가. 구조변형을 VERIFIED_B로 위장 금지 |
| blind packet 경로·alt/SVG metadata에 hidden answer | 입력 오염 탐지. 새 격리 검수 필요 |
| publication timeout·동시 동일 slot 재개 | 동일 key/ownership reconcile, UID·등록 수 증가 없음 |

fixture를 통과한 사실과 실제 학생 문항 qualification은 구분한다. 현재 문서 검토에서는 위 회귀를 실행하지 않았다.

### 18.3 샘플링 전환

초기 전 문항 독립검수를 sampling-only로 바꾸는 것은 이 계획의 승인 범위가 아니다. family qualification 재사용으로 중복 검사를 줄일 수는 있으나 개별 final artifact의 적용 가능한 exact·입력 완전성·품질·Meta·자산·closure는 유지한다. 향후 별도 운영 승격 검토에서도 false accept와 holdout 결과를 근거로 삼고 수량 증가만으로 검수 수준을 낮추지 않는다.

---

## 19. 구현 순서·재시도·운영 지표

| 순서 | 작업 | 완료 조건 |
|---|---|---|
| Phase 0 | 이번 설계 검토와 기존 계약 충돌 명시 | MODE·semantic/projection·difficulty·target·입력 경계의 구현 요구 확정 |
| Phase 1 | READ-ONLY planning adapter | 실제 가능한 slot과 부족 사유를 결정적으로 산출. 문항 생성 0 |
| Phase 2 | 1-family end-to-end shadow | 2~3 Blueprint 목표, 5~10 후보 이내, 양성/음성·final export·기존 seal 연결 |
| Phase 3 | 3-family + holdout 검증 | 30~60 후보 목표, 전 문항 독립검수, 실패·미지원·부족 분모 보존 |
| Phase 4 | Similar/Common supply adapter | generated identity, lookup/export, 중복·lineage, 별도 publication authority·readback |
| Phase 5 | 수요 기반 확대 | 검증된 family/recipe부터 확대. 기존 정상 bank·예약 변경 없음 |

parameter trial과 Blueprint revision에는 시작 전에 유한한 계획 한도를 둔다. 한도 도달 시 마지막 실패 근거와 미충족 slot을 반환한다. 모델 launch·재검 횟수·동시성은 실행 authority의 allowance를 따르며 계획 한도를 이유로 새 workBatchId를 만들어 회복하지 않는다. pipeline-core v2의 `tokenBudget/maxTokens/usedTokens`는 telemetry이며 이 문서가 별도 token HOLD나 launch 거부를 만들지 않는다. 비용은 채택당 실측으로 보고하고 차기 요청량·recipe 선택에 활용한다. 오류를 감추기 위해 무한 재생성하거나 틀린 값을 고쳐 PASS를 만드는 loop는 금지한다.

수학 실패는 해당 candidate의 재설계, 문형 실패는 해당 stem과 영향 검수, recipe 공통 결함은 영향 범위만 재점검한다. 실패한 한 slot이 다른 준비된 slot이나 기존 원본 활용을 멈추게 하지 않는다. 같은 artifact의 동일 검사 반복 실행으로 통과를 노리지 않는다.

집계는 requested / feasible / attempted / accepted / rejected / shortage를 구분한다. 핵심 지표는 실제 semantic 다양성, 최초 통과율, 계산량 분포, stem 재작성률, Meta drift, 중복률, 채택 문항당 비용, 실제 공급 gap 해소다. 낮은 yield보다 잘못된 자동 PASS가 더 심각하지만, 낮은 yield의 원인을 측정하지 않는 무한 낭비도 허용하지 않는다.

분모는 다음처럼 분리한다. `requestedSlotCount = satisfiedSlotCount + shortageSlotCount`는 완료된 요청 snapshot에서 성립한다. accepted artifact가 있어도 목표 consumer에 맞지 않거나 동일 slot에 두 번째 후보이면 satisfied를 늘리지 않는다. 실행 중 미결 slot은 unresolved로 따로 표시한다. `attemptedCandidateCount = acceptedCandidateCount + rejectedCandidateCount + unresolvedCandidateCount`로 후보/attempt 단위를 고정하고, deterministic parameter trial 횟수와 provider launch 수는 별도다. **requested=attempted 또는 rejected=shortage라고 가정하지 않는다.** off-target requeue는 원 slot shortage를 지우지 않는다. 최초 통과율의 분모는 최초 시도가 있었던 고유 slot이며 재시도로 증가시키지 않는다.

---

## 20. 원래 14개 검수 질문에 대한 답변

| # | 질문 | v0.3 설계 판단 |
|---|---|---|
| 1 | ALIVE_EXPANSION은 신규 MODE인가? | 우선 generationPurpose다. 기존 MODE별 fidelity를 실제로 선택한다. |
| 2 | L3 HARD LOCK을 어디에 적용하는가? | 각 same-L3 expansion group에 적용. 모든 Factory 제품·일반 practice의 전역 필터는 아님. |
| 3 | CrossConcept가 주개념을 침범하는 경계는? | 실제 primaryMethod/decisiveStep·필수 의존성으로 판단. 장식 조건·상위 선수·핵심 우회 금지. |
| 4 | 10개와 L4 우선 다양성이 적절한가? | 목표로 유지하되 feasible 조합이 먼저다. 파라미터 수를 의미 다양성 수로 집계하지 않음. |
| 5 | Computation Budget 단위는? | family × difficulty × response/transform, 학생 풀이 trace의 정해진 metric. |
| 6 | nice-number와 Normalizer가 겹치는가? | 수치 구성/재선정과 값 보존 정규화, 목표식 변환을 구분해 기존 nice-number 앞뒤에 연결. |
| 7 | kS·k(a+b)는 어떻게 허용하는가? | quantity/domain·가역성·자연성·핵심 사고 보존을 recipe별 검증. 전역 multiplier whitelist 금지. |
| 8 | Pattern Bank의 복제 경계는? | 일반 문형 재사용 허용, 긴 고유 원문·상황 복제는 탐지. slot과 출처·version 보존. |
| 9 | Reverse Check에 새 reviewer가 필요한가? | 통합 가능하되 선택 profile의 실제 input projection·freeze·merger 연결을 먼저 qualification. Meta/difficulty current-pass에는 매번 새 비노출 reviewer가 필수인 것은 아님. |
| 10 | Meta mismatch 후보를 살릴 수 있는가? | 기본 target reject. 좋은 off-target은 별도 requeue/revision으로만 살리고 원 slot 충족으로 세지 않음. |
| 11 | Factory와 Planner owner 중복은? | Factory는 제품 수요/Recipe, ALIVE는 실행 가능 문항 생성. 이중 제품 builder 금지. |
| 12 | 언제 sampled audit로 전환하는가? | 이번 단계에서는 전환하지 않음. family 증거 재사용과 item 필수 검수 생략은 별개. |
| 13 | A/B/C와 Meta 다양성이 충돌하는가? | 충돌 가능. C는 새 개념 없는 전처리 1개이며 다른 L4 구조는 적합 MODE/recipe/proof를 별도 선택. |
| 14 | 최소 shadow 경로는? | 읽기 전용 계획·execution qualification → 1-family wrapper → 새 문항 identity의 독립검수/metadata export/seal adapter. 실제 연결 없는 recipe는 미지원으로 보고. |

---

## 21. 최종 생산 구조와 다음 작업

~~~text
Factory/교사의 실제 공급 gap 또는 명시적 생성 요청
→ current RPM L3-locked group
→ 가능한 Meta Blueprint + construction recipe 선택
→ 기존 MODE / 지원되는 변형 proof 선택
→ Mathematical Spec + 좋은 파라미터 + 허용 final target
→ family complete solve + computation budget
→ 발문·보기·problem visual·학생용 해설 완성
→ student bundle freeze
→ 기존 독립 Solver의 Reverse + Solve → freeze → compare
→ current Meta/difficulty 재판정 + 해설·시각 품질 확인
→ 기존 serializer / 필요한 render / SEALED_LOCAL
→ 별도 승인된 Similar/Common 공급 등록
~~~

첫 구현의 산출물은 **READ-ONLY planner와 1-family 수직 연결**이다. 전 과목 생성기, 전역 taxonomy 변경, 기존 original 전면 재작성은 아니다. 그다음에는 검증된 recipe를 늘려 실제 부족한 L3/L4/difficulty 조합을 채운다.

10개 요청에서 조건을 만족한 문항이 7개면 accepted=7, shortage=3으로 반환한다. 7개를 10개짜리 완성 시험지라고 표시하지 않는다. Common builder는 현재 Recipe·교사 허용 범위에 따라 shortage를 처리하고, ALIVE가 학년·범위·난도를 몰래 넓히지 않는다.

---

## 22. 이번 개정 범위와 미확인 사항

v0.1의 핵심 목표와 14개 질문 및 v0.2의 보완을 유지했다. v0.3에서는 실행 profile 연결, 신규 문항 identity, difficulty CURRENT와 legacy evidence 문자열, 토큰 telemetry, 임시경로, 계획 결과·분모·재개 조건을 추가로 명확히 했다. 현재 검토는 위에 명시한 문서와 핵심 함수의 설계 대조이며 **ALIVE 전체 코드·모든 family·모든 시험지의 전수 인증이 아니다.**

- engine code / operational canonical 변경: 0
- production original / Similar Bank / Common 제품 변경: 0
- capability 승격 / 자동화·예약 변경: 0
- 이번 세션의 문항 생성·독립 production 검수·엔진 회귀·브라우저 렌더: 실행하지 않음

따라서 문서 반영 완료와 엔진 구현 완료, runtime qualification, 문항 품질 PASS를 구분한다. 설계 문서는 `alive/00_ALIVE_INDEX.md`의 경계대로 운영 manifest 대상에 추가하지 않는다.

현재 ALIVE expansion pilot의 기본 제안은 실제 Archive 렌더까지 확인하는 것이다. 그렇다고 GPT_SCHEDULED의 기존 render 비필수 계약을 바꾸거나, CODEX의 명시적 정적 완료/waiver를 실제 RENDER_PASS로 표시하지 않는다. 실행 시 선택한 CURRENT와 해당 run의 실제 권한·증거가 우선한다.

---

## 23. 첫 구현에 넘길 최소 계약과 종료 조건

아래 필드명·보고서 형식은 **신규 planner sidecar 제안**이다. 현재 runtime enum·API로 간주하지 않는다. 운영 정본의 상세 규칙은 복제하지 않고 source ref/hash로 연결한다.

### 23.1 READ-ONLY planner의 입력과 결과

입력은 request/slot identity, target curriculum/L1/L2/RPM L3, 요청 수량의 단위(의미 구조/숫자 instance/표현), 허용 MODE·난도·response/visual, 목표 consumer/profile, lineage seed와 construction reference, current 공급 inventory의 scope/snapshot을 받는다. 외부 공급 조회가 안 되면 **공급 부족 미확인**으로 표시한다. teacher 수요나 전역 bank 규모를 추측하지 않는다.

결과는 slot별로 다음을 기록한다.

| 묶음 | 최소 결과 |
|---|---|
| 고정 입력 | request/slot id, 입력 hash, START_SHA, 실제 소비한 rule/taxonomy/registry/recipe refs와 hashes |
| 의미 목표 | RPM path·scope relation, target와 허용 변화, 요청 단위·수량 |
| recipe 지원 | family/recipe/transform, parameter domain, solver coverage ref, 실제 adapter 함수/entrypoint와 version |
| 실행 연결 | MODE/profile, 독립검수 projection, proof consumer, serializer/finalizer, 실제 qualification evidence 또는 누락 |
| 저장·소비 | generated identity 계획, consumer 요구, Meta semantic/projection 및 difficulty 요구, 임시경로 지원 |
| 판정 | recipe 지원 / end-to-end 연결 지원 / consumer 충족 가능을 별도 판정, shortage 또는 prerequisite debt 사유와 다음 동작 |

recipe의 유효 parameter domain이 있다는 사실은 요청한 고유 instance 10개의 확보 증명이 아니다. Phase 1의 feasible 수량은 **계획상 가능 수량/상한**으로 표시하고, 실제 채택·공급 수량은 생성·검수 뒤에만 확정한다. 개별 key를 Cartesian product로 늘려 feasible Blueprint 수를 만들지 않는다. 이전 accepted 공급의 재사용도 목표 profile·consumer·중복/lineage 조건과 현행 evidence 유효성을 확인한다.

Phase 1 완료는 동일 snapshot 입력의 동일 결과·정렬·사유, 양성/음성 계획 사례, **문항 생성·UID 할당·runtime 상태 mutation·provider launch·production write 0**으로 확인한다. 보고서 출력 파일 외 부작용은 없어야 한다. 관측된 registry 상태를 SUPPORTED로 변경하지 않는다.

### 23.2 수정·재개 시 영향 범위

| 변경 | 최소 재확인 |
|---|---|
| content/choices/problem visual/shared | student projection·자산 판독·독립 수학검수·cardinality/index·Reverse, 영향 Meta/difficulty·렌더 |
| final target/domain/parameter/spec | complete solve·trace budget·fidelity부터 영향 student/review/export closure 전부 |
| solution/solution visual | 수학 의미·교육과정·해설 품질·visual parity, verified solution hash를 소비하는 Meta/difficulty receipt |
| Meta/difficulty 값·lookup authority | current-pass/lookup·validator receipt·export/consumer parity. 학생 입력이 같으면 독립 풀이 재사용 여부를 현행 receipt로 검증 |
| displayNo/export path/asset reference | identity 대응·직렬화·참조·render impact·receipt hash, choices 순서가 바뀌면 answer-index 검수 |
| 무관한 main 전진 | consumed refs/hash가 같으면 기존 증거 유지. baseline drift만으로 blanket 재생성하지 않음 |

이 표는 자동 evidence reuse 허가가 아니다. 선택 경로의 실제 impact/reuse validator가 요구하는 직접 root receipt·current machine record를 충족한다. 숨은 답 노출·필수 그림 누락으로 실패한 freeze는 보존하고 유효한 새 격리 검수로만 닫는다. 공통자료·recipe·자산 변경은 해당 내용을 소비한 모든 slot을 영향 scope에 포함한다.

요청 재개는 기존 slot ownership·attempt·freeze·provider state를 먼저 readback한다. DISPATCHED/등록 결과가 불명확하면 동일 identity로 reconcile하고 새 launch·새 UID를 만들지 않는다. 중단된 실행은 원 증거와 소비한 allowance를 보존한다. 공통 결함은 영향 recipe를 격리하고 무관한 정상 slot을 계속 처리한다.

### 23.3 단계별 종료 산출물

- **Phase 1:** 위 계획 보고서, 현재 실제 연결/미지원 목록, 첫 family 선택 근거. 현재 작업에서는 아직 구현하지 않음.
- **Phase 2:** 처음 5~10개 후보 안에서 요청·시도·채택·부족 분모, 양성/음성 결과, immutable student freeze와 독립검수, 새 문항 resolver/difficulty receipt, desktop/mobile exam·solution·answer 실제 화면, 최종 JS/asset/sidecar·package hash와 유효 local seal. 실제 render가 면제되면 그 실행 상태를 별도로 보고하며 render qualification을 획득한 것으로 세지 않음.
- **Phase 3:** 생성 전에 holdout scope를 동결하고 reference/pattern/budget calibration에 사용하지 않음. observed 결함을 수리하면 그 holdout은 해당 수정의 미관측 검증 사례로 더 이상 세지 않음. 3-family의 실제 지원 구조 수·최초 통과율·false accept 발견 사례·채택당 비용/미확인 비용·부족 원인을 보고.
- **Phase 4:** actual consumer 계약, publication authority, 동일 key 재개·부분 실패 recovery, canonical 저장본/자산/Meta/difficulty readback. local seal 결과만으로 완료 처리하지 않음.

Phase 2는 **채택본 HARD 0 + 실제 end-to-end closure + 실패/부족의 정직한 기록**으로 종료한다. 2~3개의 의미 Blueprint를 못 확보하면 수직 연결 성공과 의미 확장 미달을 나누어 보고한다. 수량을 채우려고 숫자 연습을 의미 구조로 재명명하거나 품질 gate를 낮추지 않는다. 엔진 구현·pilot 실행·운영 활성화는 각각의 후속 완료 근거가 있어야 한다.
