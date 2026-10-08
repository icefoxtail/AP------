# ALIVE Meta Blueprint Mass Expansion Upgrade Plan v0.1

작성일: 2026-10-08  
상태: **DESIGN DRAFT / REVIEW REQUESTED / NOT ACTIVE**  
검수 대상: GPT-6 Astra / GPT-6 Pro 등 고성능 독립 검수  
작성 기준 Git main: `5e711187f736e211e7b9ff0a4bf9a599b164eafd`

> 이 문서는 기존 ALIVE를 새로 만드는 계획이 아니다. 현재 `alive/`의 Universal Variant Engine, A/B/C variant proof, exact solver, DifficultyVector, nice-number gate, 독립 검수·렌더·SEALED_LOCAL 경로를 보존하면서, Meta Foundation의 L3/L4/CrossConcept/Condition/Integration 축을 **대량 문항 생성 설계 좌표**로 활용하기 위한 업그레이드 제안이다.
>
> 이 문서만으로 production capability, taxonomy, ALIVE canonical, Common Assessment Factory canonical을 변경하지 않는다. 구현·승격은 별도 승인과 회귀검증을 거친다.

---

## 1. 배경과 현재 상태

현재 저장소에는 이미 다음 기반이 존재한다.

- `alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`
  - TYPE_BANK / EXAM_FOLLOWUP / STRICT_VARIANT
  - DifficultyVector
  - 역설계 → FREEZE → 독립 Solver → Curriculum → Fidelity → Distractor → Visual → Duplicate → Serialization
  - 확인문제·심화문제·STRICT_VARIANT의 난도 및 구조 보존 규칙
- `alive/05_DESIGN/ALIVE_UNIVERSAL_VARIANT_ENGINE_IMPLEMENTATION_PLAN_v0.1.md`
  - A numeric / B representation / C single-preprocess 구조
  - Structure Family × transform capability
  - exact solver / parameter constraint / nice-number gate / difficulty comparison
  - bounded capability와 SEALED_LOCAL 검증
- `alive/engine/`
  - Universal Variant Engine
  - 고1 및 중등 전용 bounded adapter
  - exact verifier
  - variant proof / review / render / package / resume
- JS Archive 2.0의 repair/ALIVE 인프라
  - `ALIVE_REPLACEMENT` provenance
  - changed qid + direct dependency rebind
  - same-stage repair/ALIVE closure
- Meta Foundation canonical
  - RPM Primary L3/L4 semantic authority
  - `problemTypeKey/templateKey` projection
  - `crossConceptKeys[]`
  - `conditionKeys[]`
  - `integrationPattern`
- Common Assessment Factory v0.13
  - Blueprint / Recipe / deterministic builder / independent validator 방향

현재 ALIVE의 bounded generation은 강력하지만, **대량 증식 시 어떤 개념 조합을 몇 개 만들 것인가**와 **계산량·답 형태·발문 품질을 어떻게 안정적으로 제어할 것인가**가 별도 설계축으로 충분히 연결되어 있지 않다.

---

## 2. 목표

핵심 목표는 사람의 작업 단위를 “문항 1개 직접 제작”에서 “검증 가능한 Meta Blueprint + 생성 규칙”으로 이동하는 것이다.

목표 흐름:

~~~text
Verified Source Question / Canonical L3
→ Meta Blueprint Planner
→ ALIVE Variant Generation
→ Exact Solve
→ Computation Budget Gate
→ Answer Clean-up / Normalization
→ Stem Realizer
→ Reverse Stem Check
→ Fresh Semantic Reclassification
→ Existing ALIVE Validator / Render / Seal
→ Similar Bank / Common Factory supply
~~~

가장 중요한 원칙:

1. **L3를 중심축으로 잠근다.**
2. 같은 L3 안에서 L4·CrossConcept·Condition·IntegrationPattern을 다양화한다.
3. 문항 수를 늘리기 위해 난도나 계산량을 올리지 않는다.
4. 답이 지저분하면 수치 재선정 또는 자연스러운 질문 변환으로 정리한다.
5. 수학 객체 생성과 한국어 발문 생성을 분리한다.
6. 최종 발문을 다시 읽어 원 Blueprint를 복원할 수 있어야 한다.
7. 생성 목표 Meta와 최종 실제 Meta를 독립 재판정하여 일치해야 한다.

---

## 3. ALIVE_REPLACEMENT와 ALIVE_EXPANSION의 분리

기존 `ALIVE_REPLACEMENT`는 손상된 기존 qid를 같은 qid의 새 정상 문항으로 교체하는 복구 수단이다. 이 계약은 그대로 둔다.

신규 제안:

`ALIVE_EXPANSION`

의미:

- 기존 source qid는 보존한다.
- source 문항은 seed/evidence로만 사용한다.
- 새 문항은 별도 generated identity를 가진다.
- 원기출로 위장하지 않는다.
- 원본 시험지 qid/순서를 덮어쓰지 않는다.
- production original bank와 generated similar bank를 분리한다.

개념적 차이:

~~~text
ALIVE_REPLACEMENT
source q7 → new q7

ALIVE_EXPANSION
source q7 → q7 유지 + generated variant A/B/C...
~~~

`ALIVE_EXPANSION`은 신규 top-level MODE가 될 수도 있고 기존 EXAM_FOLLOWUP/TYPE_BANK의 generation profile이 될 수도 있다. 이 결정은 Astra/Pro 검수 항목으로 남긴다.

---

## 4. Meta Blueprint — “10문항 생성”이 아니라 “10개 설계좌표 생성”

대량 생성 요청을 “유사문항 10개 만들어라”로 주지 않는다.

먼저 10개의 서로 다른 Meta Blueprint를 만든다.

### 4.1 잠금 축

기본 mass-expansion lane:

- curriculum / standardCourse: LOCK
- L1 / standardUnitKey: LOCK
- L2 / subUnitKey: LOCK
- **RPM Primary L3: HARD LOCK**

L3가 바뀌면 같은 mass-expansion family로 인정하지 않는다.

### 4.2 변화 가능 축

canonical ACTIVE 범위에서만 선택한다.

- L4
- CrossConcept
- Condition
- IntegrationPattern
- representation/context
- difficulty target
- response form
- visual policy

없는 L4/CrossConcept/Condition key를 10개 수량을 채우기 위해 새로 만들지 않는다.

### 4.3 기본 10문항 batch 전략

예:

~~~text
Q1  L3=A / L4=a / Cross=none / D2
Q2  L3=A / L4=a / Cross=X    / D2
Q3  L3=A / L4=b / Cross=none / D3
Q4  L3=A / L4=b / Cross=Y    / D3
Q5  L3=A / L4=c / Cross=X    / D3
Q6  L3=A / L4=c / Cross=Z    / D3
Q7  L3=A / L4=d / Cross=none / D2
Q8  L3=A / L4=d / Cross=Y    / D3
Q9  L3=A / L4=b / Cross=Z    / D3
Q10 L3=A / L4=c / Cross=W    / D3
~~~

실제 L4 종류가 적으면 Condition / IntegrationPattern / representation을 이용해 다양화한다.

CrossConcept가 주개념을 먹어버려 실제 primaryMethod가 바뀌면 FAIL이다.

---

## 5. Difficulty와 Calculation Burden 분리

대량 생성에서는 “수학적 난도”와 “계산 지저분함”을 같은 것으로 보지 않는다.

기존 DifficultyVector의 구조를 활용하되 최소 다음을 분리해서 본다.

- conceptDepth
- interpretationLoad
- decisionCount
- branchingLoad
- abstractionLoad
- algebraLoad
- **calculationLoad**
- answerComplexity
- visualReasoningLoad

### 5.1 Mass Expansion 기본 정책

기본 증식 lane은 난도 상승을 목표로 하지 않는다.

- source/target difficulty role보다 어려워지지 않게 한다.
- CrossConcept 추가는 새로운 핵심 개념 선택이 아니라 보조 연결이어야 한다.
- 계산량 증가만으로 어려워진 문항은 FAIL 또는 REGENERATE.
- 복잡한 수치 때문에 풀이 단계·분기·전개량이 불필요하게 늘어나면 REGENERATE.

### 5.2 Computation Budget

최종 값뿐 아니라 **중간 계산 전체**를 검사한다.

family별 budget 예시 필드:

~~~text
maxCoreSteps
maxCaseSplit
maxIntermediateIntegerMagnitude
maxFractionDenominator
maxExpansionTerms
maxRadicalTerms
maxNestedFractions
maxEquationDegree
maxSymbolCountPerLine
~~~

정확한 임계값은 전 과목 공통 하드코딩보다 family/difficulty profile로 관리한다.

예:
- 일차방정식 D2의 허용 계산량과
- 원의 방정식 D3의 허용 계산량은 같지 않다.

### 5.3 HARD 원칙

- difficulty 목표를 만족하지만 calculation budget을 넘으면 PASS 금지.
- 최종 답만 예쁘고 중간 계산이 과도하게 더러우면 PASS 금지.
- 학생이 핵심 개념보다 산술 정리에 시간을 더 많이 쓰게 되는 대량생성 문항은 기본 lane에서 제외.

---

## 6. Answer Clean-up / Normalization

현재 Universal Variant 설계의 nice-number gate를 확장하여 최종 답뿐 아니라 “질문 대상”도 설계한다.

우선순위:

1. **파라미터 재선정으로 답 자체를 깔끔하게 만든다.**
2. 그래도 자연스럽지 않으면 **질문 표현을 수학적으로 동치인 깔끔한 형태로 변환한다.**
3. 변환이 부자연스러우면 후보 폐기 후 재생성한다.

예:

~~~text
계산 결과: S = 192/25

기존 질문:
원의 넓이를 S라 할 때 S의 값을 구하여라.

허용 가능한 normalization:
원의 넓이를 S라 할 때 25S의 값을 구하여라.

최종 정답: 192
~~~

### 6.1 허용 조건

Answer Normalizer는 반드시:

- 원래 수학적 target과 동치임을 exact proof로 증명
- 교육과정/문항 의도를 바꾸지 않음
- 난도를 올리지 않음
- 발문이 실제 시험 문장으로 자연스러움
- multiplier가 임의적·기괴하지 않음
- quantity type에 적합함

을 만족해야 한다.

### 6.2 multiplier 정책

모든 분모를 무조건 질문에 붙이지 않는다.

자연성이 높은 작은 multiplier를 우선한다.

예시 후보:
2, 3, 4, 5, 6, 8, 9, 10, 12, 16, 20, 25, 50, 100

단, 이 목록은 최종 canonical이 아니라 초기 검토 후보다.

`37S`, `29x`처럼 수학적 이유가 없는 표현은 기본적으로 REGENERATE가 우선이다.

### 6.3 quantity-aware normalization

같은 multiplier도 대상에 따라 자연성이 다르다.

검토 대상:
- 길이 / 넓이 / 부피
- 좌표
- 계수
- 함수값
- 확률
- 개수
- 합/곱
- 매개변수

예를 들어 넓이 S에 `25S`를 묻는 것은 자연스러울 수 있지만, 사람 수 n에 임의로 `25n`을 묻는 것은 부자연스러울 수 있다.

---

## 7. 발문 품질 — Mathematical Spec과 Stem Realizer 분리

대량 생성에서 가장 큰 품질 리스크는 수학보다 한국어 발문이다.

따라서 ALIVE가 한 번에 content를 자유생성하는 구조를 기본으로 하지 않는다.

~~~text
Meta Blueprint
→ Mathematical Object
→ Exact Solve
→ Clean Target
→ Stem Realizer
→ Stem Quality Gate
~~~

### 7.1 Mathematical Spec

발문 이전에 내부적으로 최소 다음이 확정되어야 한다.

- givens
- mathematical relations
- unknown / goal
- target expression
- exact answer
- solutionGraph
- required conditions
- optional context
- questionType
- target Meta Blueprint

발문은 이 확정된 수학 객체를 **표현**하는 역할만 맡는다.

---

## 8. Stem Pattern Bank

발문 품질은 자유창작보다 검증된 기출의 표현 패턴을 활용한다.

### 8.1 목적

L3/L4/problemType/template별로 실제 기출에서 반복되는 **문형의 골격**을 추출한다.

예:

- “~일 때, ~의 값은?”
- “~을 만족시키는 ~의 개수는?”
- “~가 되도록 하는 상수 ~의 값을 구하여라.”
- “~의 최댓값과 최솟값의 합을 구하여라.”
- “옳은 것만을 <보기>에서 있는 대로 고른 것은?”

원문 문장을 그대로 복제하는 bank가 아니라 **문장 구조/역할 패턴 bank**다.

### 8.2 원칙

- source exact sentence clone 금지
- 특정 학교 문장의 긴 표현을 그대로 재사용하지 않음
- 실제 기출다운 짧고 직접적인 문체를 우선
- AI식 설명·안내 문장 금지
- 불필요한 서론 금지
- 조건 → 대상 → 질문 순서가 자연스러워야 함
- 같은 10문항 안에서 동일한 표면 문형의 기계적 반복을 제한

금지 예:
“주어진 조건을 잘 살펴보고 다음 문제를 해결하여 보자.”

기본 선호:
“함수 ...가 ...을 만족시킬 때, ...의 값은?”

---

## 9. Reverse Stem Check

Stem Realizer가 만든 최종 발문을 별도 reviewer가 **발문과 학생용 자산만 보고** 다시 구조화한다.

복원 대상:

- givens
- conditions
- goal
- unknown
- questionType
- primaryMethod
- decisiveStep
- L3
- L4
- CrossConcept
- ambiguity candidates

그 뒤 최초 Blueprint/Mathematical Spec과 비교한다.

~~~text
Blueprint
→ Mathematical Spec
→ Stem
→ Independent Reverse Parse
→ Reconstructed Blueprint
→ Compare
~~~

### HARD FAIL

- 질문 대상이 달라짐
- 조건 누락/추가
- 변수 지칭 불명확
- 두 가지 해석 가능
- L3 drift
- L4/CrossConcept가 목표와 불일치
- 발문만 읽어서는 필요한 관계를 알 수 없음
- Stem이 solution의 일부를 과도하게 노출

이 round-trip은 “문법이 자연스럽다” 수준을 넘어서 **수학적 의미 보존**을 확인하는 gate다.

---

## 10. Fresh Semantic Reclassification

생성 목표 Meta는 정답 라벨이 아니라 **설계 목표**다.

최종 문항은 current final student-facing question + independently verified solution을 기준으로 Meta Foundation CURRENT 절차를 다시 거친다.

~~~text
final question + verified solution
→ primaryMethod / decisiveStep
→ RPM Primary L3/L4
→ CrossConcept / Condition / Integration
→ target Blueprint와 compare
~~~

기본 정책:

- L3 mismatch → HARD FAIL / regenerate
- L4 mismatch → 기본 REJECT / requeue
- CrossConcept mismatch → 기본 REJECT / requeue
- curriculum boundary violation → HARD FAIL
- 실제 Meta가 더 복잡해져 difficulty가 상승 → FAIL
- 새로운 ACTIVE key가 필요해 보임 → generation을 이유로 taxonomy를 자동 확장하지 않음

“생성기가 목표 L4라고 주장했으니 그대로 저장”하는 경로를 금지한다.

---

## 11. 10문항 Batch Diversity Contract

목표는 10개의 숫자갈이가 아니라 **10개의 학습 경험**이다.

초기 제안:

- same L3 = HARD
- duplicate Blueprint = 금지
- same exact solutionGraph + same L4 + same CrossConcept의 반복 제한
- 같은 stem pattern 과다 반복 제한
- 같은 answer target form 과다 반복 제한
- difficulty histogram 사전 계획
- visual burden 과다 집중 방지
- source/template/family duplicate check

L4 종류가 10개보다 적은 경우 10개를 채우기 위해 가짜 L4를 만들지 않는다.

다양화 순서:

1. L4
2. CrossConcept
3. Condition
4. IntegrationPattern
5. representation/context
6. parameter surface

---

## 12. 제안 Generation Ledger

production JS 본문을 generation provenance로 과도하게 오염시키지 않고 sidecar/ledger를 사용한다.

예시 필드:

~~~text
generationMode: ALIVE_EXPANSION
sourceQuestionUid
sourceQuestionSha
generatorVersion
seed

targetBlueprint:
  curriculum
  L1
  L2
  L3
  L4
  crossConceptKeys
  conditionKeys
  integrationPattern
  difficultyTarget
  questionType
  visualPolicy

actualClassification:
  primaryMethod
  decisiveStep
  L3
  L4
  crossConceptKeys
  conditionKeys
  integrationPattern

computationProfile:
  coreSteps
  caseSplit
  maxIntermediateIntegerMagnitude
  maxFractionDenominator
  expansionTerms
  radicalTerms
  budgetProfile
  verdict

answerNormalization:
  rawTarget
  rawAnswer
  normalizedTarget
  normalizedAnswer
  multiplier
  equivalenceProof
  naturalnessVerdict

stem:
  patternFamily
  patternSourceRef
  reverseCheckVerdict
  reconstructedGoal
  reconstructedMeta
  ambiguityVerdict

final:
  exactSolverVerdict
  freshMetaVerdict
  duplicateVerdict
  renderVerdict
  sealStatus
~~~

---

## 13. Validator Chain 제안

기존 ALIVE validator를 버리지 않고 앞단/중간에 gate를 추가한다.

권장 순서:

~~~text
B0 Blueprint Canonical Gate
B1 Curriculum / Capability Gate
B2 Mathematical Object Build
B3 Exact Solver
B4 Computation Budget
B5 Answer Clean-up
B6 Stem Realizer
B7 Reverse Stem Check
B8 Independent Fresh Solve
B9 Fresh Meta Reclassification
B10 Difficulty/Fidelity
B11 Distractor
B12 Visual
B13 Duplicate / Variant Family
B14 Serialization
B15 Actual Render
B16 Seal / Publish Adapter
~~~

Early exit:
- exact math 실패
- L3 drift
- curriculum violation
- calculation budget 초과
- 발문 ambiguity
- target/actual Meta mismatch
- duplicate

는 후속 비용을 쓰지 않고 즉시 regenerate/reject한다.

---

## 14. Common Assessment Factory와의 관계

이 계획은 Common Assessment Factory와 경쟁하는 별도 공장을 만들지 않는다.

권장 역할 분리:

- Meta Foundation: semantic coordinate authority
- ALIVE: variant generation / exact solve / question quality engine
- Common Assessment Factory: Blueprint/Recipe 기반 제품 조립과 공급
- Similar Bank: generated question 저장/검색 surface
- Original Archive: immutable past-exam identity

즉 장기적으로:

~~~text
Common Factory Recipe
→ 필요한 L3/L4/CrossConcept slot
→ ALIVE_EXPANSION이 부족 slot 생성
→ seal된 generated supply
→ Common Builder가 선택
~~~

가 이상적이다.

---

## 15. 저장 위치와 정체성

생성 중 후보:
- 기존 `alive/runtime` 또는 별도 append-only candidate root
- production `archive/exams/original` 직접 쓰기 금지

승인된 생성 문항:
- `archive/exams/similar/` 또는 향후 Common Factory generated supply registry
- sourceKind/generated provenance 명시
- original 기출 identity와 절대 혼합하지 않음

현재 `archive/exams/similar/`의 과거 파일은 세대별 schema·Meta 완성도가 섞여 있으므로 그것을 그대로 신규 canonical schema로 간주하지 않는다.

---

## 16. 구현 touchpoint 제안

기존 파일 재사용/확장 후보:

- `alive/engine/universal_variant_engine.py`
- `alive/engine/structure_families.py`
- `alive/engine/exact_verifier.py`
- `alive/engine/metadata_finalizer.py`
- `alive/engine/adaptive_quality_gates.py`
- 기존 family-specific exact solver / renderer
- 기존 variant proof / final closure / render / package

신규 모듈 후보:

- `alive/engine/meta_blueprint.py`
- `alive/engine/expansion_batch_planner.py`
- `alive/engine/computation_budget.py`
- `alive/engine/answer_normalizer.py`
- `alive/engine/stem_pattern_bank.py`
- `alive/engine/stem_realizer.py`
- `alive/engine/stem_reverse_check.py`
- `alive/engine/expansion_ledger.py`

이 파일명은 설계 후보이며 검수 후 확정한다.

---

## 17. 파일럿 권장 범위

첫 파일럿에서 “전 과목 10개씩”을 시도하지 않는다.

현재 `ACTIVE_BOUNDED`이고 exact solver가 이미 검증된 family 중 **비시각 또는 저시각 3개 family**를 선택한다.

각 family:
- source seed 1~2개
- seed당 Meta Blueprint 10개
- 총 30~60문항 후보

첫 파일럿의 목표는 생산량이 아니라 다음 네 가지를 검증하는 것이다.

1. 같은 L3를 정말 유지하는가
2. L4/CrossConcept 다양화가 억지스럽지 않은가
3. 계산량/답 정규화가 자연스러운가
4. 발문이 실제 내신·모의고사 수준으로 보이는가

초기 파일럿은 Astra/Pro가 전 문항을 독립 검수하고, 통과 후에만 sampled audit 또는 자동 lane 확대를 논의한다.

---

## 18. 품질 acceptance — 파일럿

HARD 0 허용:

- wrong answer
- non-unique answer
- curriculum violation
- L3 drift
- unsupported L4/CrossConcept invention
- calculation-budget hard violation
- unnatural answer normalization
- ambiguous stem
- target/actual semantic mismatch
- exact duplicate
- broken visual
- serialization/render failure

생성 성공률은 초기에는 품질 gate가 아니다. 실패 후보를 많이 버려도 된다.

**낮은 yield보다 나쁜 문항의 자동 통과가 훨씬 큰 실패다.**

---

## 19. 구현 순서 제안

### Phase 0 — Astra/Pro 설계 검수
- 본 문서의 mode 경계
- Meta Blueprint authority
- calculation budget
- answer normalization
- stem architecture
- Common Factory 접점

### Phase 1 — READ-ONLY Meta Blueprint Adapter
- source qid → current L3/L4/CrossConcept/Condition/Integration 조회
- L3 lock
- canonical allowed combination만 10-slot plan 생성
- 문항 생성 없음

### Phase 2 — Computation Budget + Answer Normalizer
- current exact-solver family 1개
- raw answer → parameter resample → normalized target
- equivalence proof
- ugly-number negative fixture

### Phase 3 — Stem Realizer + Reverse Check
- Stem Pattern Bank 최소 vertical slice
- AI explanatory filler negative fixture
- ambiguity / condition loss / goal drift negative fixture

### Phase 4 — 10-Blueprint Batch
- 3 family
- 30~60 candidate
- independent fresh solve + fresh Meta compare

### Phase 5 — Existing ALIVE Seal 연결
- variant proof
- solution quality
- distractor/visual
- serializer
- actual Archive render
- SEALED_LOCAL

### Phase 6 — Similar / Common Supply Adapter
- generated identity
- provenance ledger
- no original mutation
- duplicate/family policy

### Phase 7 — 확대
- current ACTIVE_BOUNDED family 순서대로 확대
- unsupported family 자동 fallback 금지

---

## 20. Astra / Pro 필수 검수 질문

1. `ALIVE_EXPANSION`을 신규 MODE로 둘지, 기존 EXAM_FOLLOWUP/TYPE_BANK의 profile로 둘지.
2. L3 HARD LOCK이 모든 mass-expansion lane에 적합한지.
3. L4/CrossConcept 다양화가 primary semantic을 침범하는 경계는 충분히 명확한지.
4. “10문항” batch의 다양성 규칙을 L4 우선으로 두는 것이 적절한지.
5. Computation Budget을 family × difficulty profile로 두는 설계가 충분한지.
6. nice-number gate와 Answer Normalizer의 역할 중복/충돌이 있는지.
7. `kS`, `k(a+b)` 형태의 target normalization에서 허용 multiplier와 quantity-type 정책을 어떻게 canonicalize할지.
8. Stem Pattern Bank가 source exact-copy 없이 기출 문체만 보존하도록 충분히 분리되어 있는지.
9. Reverse Stem Check가 발문 quality gate로 충분한지, 추가 독립 reviewer가 필요한지.
10. target Meta와 actual fresh Meta가 다를 때 salvage/reclassify를 허용할지, 기본 reject가 맞는지.
11. Common Assessment Factory Recipe/Builder와 ALIVE Blueprint Planner 사이 owner 중복이 있는지.
12. production publish 전 어떤 수준의 all-item review → sampled audit 전환이 안전한지.
13. 기존 Universal Variant Engine의 A/B/C class와 L4/CrossConcept diversity axis가 충돌하거나 혼동될 지점이 있는지.
14. 기존 ACTIVE_BOUNDED capability를 유지하면서 이 업그레이드를 shadow lane으로 넣을 최소 변경 경로는 무엇인지.

---

## 21. 최종 제안

이 업그레이드의 핵심은 **ALIVE를 더 자유롭게 만드는 것이 아니라 더 구조적으로 만드는 것**이다.

~~~text
기존:
Source → A/B/C Variant → Validate

업그레이드:
Source
→ L3-locked Meta Blueprint × 10
→ Controlled A/B/C Generation
→ Exact Solve
→ Computation Budget
→ Answer Normalization
→ Exam-style Stem Realization
→ Reverse Stem Check
→ Fresh Semantic Reclassification
→ Existing ALIVE Proof/Render/Seal
→ Generated Supply
~~~

이 구조가 성공하면 Meta Foundation은 단순 검색/분류용 데이터가 아니라 **문항 생산 설계도**가 되고, ALIVE는 단순 수치변형기가 아니라 **교육과정·난도·계산량·발문 품질이 통제된 대량 문항 증식 엔진**으로 확장된다.

단, 품질보다 생산량을 우선하지 않는다. 10개를 요청했더라도 canonical 조합·계산량·발문 품질을 만족하는 문항이 7개뿐이면 7개만 통과시키고 나머지는 재생성/부족으로 남긴다.

---

## 22. 이번 문서의 변경 범위

이 커밋은 설계 문서만 추가한다.

- engine code 변경 0
- canonical 변경 0
- production exam 변경 0
- Similar Bank 추가 0
- Common Assessment Factory 구현 변경 0
- capability 승격 0
- 자동화/예약 변경 0

Astra/Pro 검수 후 승인된 항목만 별도 구현 작업으로 진행한다.
