# APMath Problem → Visual Request 세부 구현계획 v1.1

**상위 문서:** `APMath Construction & Visual Production Engine — 최종 구현 계획서`  
**문서 역할:** Detail 07 / Problem → Visual Request  
**작성일:** 2026-10-05 (Asia/Seoul)  
**상태:** **통합검토 보완 반영 · 계획 v1.1 · 이번 작업 제품 코드 변경 0**  
**v1.0 원문 조사 기준(이력 보존):** `origin/main @ 32102c5e4f6016ed8ff3d4e85b367e084aa5814b`

**통합 보완 기준 main:** `3a7b2cb712fb192f3728f4df4a7ccc1e99d79427`  
**개정일:** 2026-10-05 (Asia/Seoul)  
**반영 이슈:** I-01, I-02, I-05, D-03  
**적용 관계:** 같은 Detail v1.0의 해당 계약/예시를 v1.1 본문으로 대체한다. 공통 요청·routing·상태의 단일 소유자는 Detail 05 §4/6/7/24–26/53–54다. 원문의 “현재 main 구현” 설명은 원 조사 시점 기록이며 이번에 전체 코드를 다시 조사했다는 뜻이 아니다. 이 문서의 test/qualification checklist는 구현 후 수행할 요구사항이고, 문서 보완은 실행 PASS·ACTIVE·PUBLICATION_READY·Seal 선언이 아니다.

---

## 0. 이 문서의 목적

이 문서는 APMath Visual Production Engine의 일곱 번째 세부계획으로, 사용자가 **문항 하나를 지정했을 때** source·verified solution·기존 visual·학습 목적을 읽고, 5차 One-Click Runner가 바로 소비할 수 있는 **VisualRequest + FrozenVisualPlan**을 자동 생성하는 planning 계층을 설계한다.

핵심 목표:

```text
문항 지정
→ stable question identity
→ source / solution resolve
→ visual 필요성 판단
→ problem/solution/system surface 결정
→ decisive relation 추출
→ source condition inventory
→ capability 선택
→ expected facts / label intent
→ geometry graph or graph plan skeleton
→ FrozenVisualPlan
→ One-Click Runner
```

사용자가 별도로:

- expected facts JSON
- visualSpec JSON
- coordinate plan
- label list
- graph facts
- viewport facts

를 수동 작성하지 않아도 된다.

그러나 planning 계층은 다음을 하지 않는다.

- 임의 좌표를 “예쁘게” 발명
- SVG 문자열 직접 작성
- unsupported capability를 성공으로 위장
- source와 solution이 충돌하는데 임의 판단
- 기존 SVG를 정답으로 역추론
- 최종 publication PASS 선언

---

# 1. 최상위 원칙

## 1.1 Source + verified solution이 authority

planning authority:

```text
source problem
+ verified/frozen solution facts
+ current visual canonical
→ Visual Plan
```

기존 SVG나 builder witness는 planning의 수학 정답이 아니다.

---

## 1.2 LLM 역할과 deterministic engine 역할 분리

LLM/planner 역할:

- 문항 의미 이해
- visual 필요성 판단
- decisive relation 추출
- source condition inventory
- graph/geometry operation intent
- label intent
- surface/capability routing

deterministic engine 역할:

- geometry 계산
- graph sampling
- exact math
- coordinate projection
- typography
- layout
- SVG
- audit

---

## 1.3 One request, no manual handoff

최종 UX:

```text
produceVisual(questionUid)
```

한 요청 안에서 planning까지 이어져야 한다.

사용자가 중간에:

“이 문항 좌표 사실 JSON 만들어줘”

를 별도 입력해야 하는 구조는 완료가 아니다.

---

# 2. 현재 main의 실제 자산

## 2.1 `solution-visual-benefit.mjs`

현재 이미 다음 계약이 존재한다.

### visualRequirement

- `VISUAL_REQUIRED`
- `VISUAL_OPTIONAL`
- `VISUAL_EXEMPT`

### visualAction

- `ADD`
- `REBUILD`
- `KEEP`
- `NONE`
- `REMOVE`

### studentUnderstandingBenefit

boolean

### geometryVisualRole

- `DECISIVE_REASONING`
- `DEFINITION_REINFORCEMENT`
- `RELATIONSHIP_EXPLANATION`
- `REPRESENTATION_SUPPORT`
- `SOURCE_RECONSTRUCTION`
- `NONE`
- `NOT_GEOMETRY`

### 기타

- decisiveStep
- sourceFigurePresence
- benefitReasons
- expectedVisualType
- expectedFacts
- applicablePolicyRefs

즉 visual 필요성 계약은 이미 상당히 구조화돼 있다.

---

## 2.2 current limitation

현재 visual benefit contract는:

- 필요성
- 예상 유형
- expected facts

검증에는 강하지만,

아직 다음을 직접 만들지는 않는다.

- construction graph
- graph plan
- source condition coverage
- branch semantics
- display binding
- viewport intent
- publication profile
- runner request

따라서 이를 상위 planning contract로 확장한다.

---

## 2.3 `question-uid.mjs`

현재 canonical identity:

`QUESTION_UID_v2`

형식:

```text
sourceExamId|sourceQuestionOrdinal
```

를 제공한다.

따라서 planning 시작점은 qid/path가 아니라
stable `questionUidV2`를 우선한다.

---

## 2.4 `past_exam_adapter.py`

현재는 이미 작성된:

`past-exam-expected-facts-v1`

bundle을 받아:

- visualType
- viewport
- sourceFacts
- derivedFacts
- displayFacts
- objects

를 visualSpec으로 바꾼다.

즉 지금 부족한 것은:

> **expected facts bundle을 누가 문항에서 자동으로 만들 것인가**

이다.

---

## 2.5 현재 candidate builder

현재 `build-visual-candidate.mjs`는:

```text
--facts
--run-id
```

가 필요하다.

Detail 07 완료 후 production path에서는:

```text
--question-uid <uid>
```

만으로 plan/facts가 준비돼야 한다.

신규 CLI에서 `--request <visual-request.json>`는 파일 입력이다. 두 입력은 D05 §4의 동일 VisualRequest로 정규화하며 동시 사용을 거부한다. 기존 `--facts/--run-id` 의미는 유지한다.

---

# 3. Planning pipeline

canonical flow:

```text
QuestionIdentity
→ SourceSnapshot
→ SolutionSnapshot
→ ExistingVisualSnapshot
→ VisualBenefit
→ SourceConditionInventory
→ DecisiveRelationPlan
→ CapabilityPlan
→ ExpectedFacts
→ DisplayIntent
→ MathPlanSkeleton + PublicationIntent
→ D01/D02 executable normalization
→ typed schema/source/branch validation
→ FrozenVisualPlan
→ source/fact evidence 확인
→ mode별 capability check
→ D05 canonical VisualRequest handoff
```

---

# 4. SourceSnapshot v1

최소:

```json
{
  "questionUid": "...",
  "sourceExamId": "...",
  "sourceQuestionOrdinal": 12,
  "sourcePath": "...",
  "sourceSha256": "...",
  "questionId": "12",
  "content": "...",
  "choices": [],
  "answer": "...",
  "problemAssets": []
}
```

---

# 5. SolutionSnapshot v1

최소:

```json
{
  "solutionSource": "VERIFIED_CURRENT",
  "solutionSha256": "...",
  "solution": "...",
  "answer": "...",
  "solutionAssets": [],
  "status": "VERIFIED"
}
```

verified solution이 없으면:

`NEEDS_INPUT` 또는 parent workflow의 solution stage로 handoff.

---

# 6. ExistingVisualSnapshot

기존:

- problem image
- solutionImage
- inline SVG/table/image
- captions
- size policy

를 inventory.

이 snapshot은:

“현재 visual이 있으니 KEEP”

근거가 아니다.

---

# 7. Visual necessity planning

현재 `solution-visual-benefit.mjs`를 재사용한다.

planner output은 최소:

- requirement
- action
- studentUnderstandingBenefit
- decisiveStep
- role
- expectedVisualType
- sourceFigurePresence
- expectedFacts

를 채운다.

---

# 8. Source Figure Sufficiency

source figure가 있으면 먼저:

> source만으로 decisive relation이 충분히 보이는가?

판정.

solution visual ADD 근거:

- new auxiliary line
- hidden relation
- decisive reduction
- case split
- calculation-to-geometry anchor
- owner clarification

없으면 기본:

KEEP / EXEMPT.

---

# 9. Visual surface routing

## PROBLEM_VISUAL

목표:

- source fidelity
- crop/vector repair
- 힌트 추가 금지

## SOLUTION_VISUAL

목표:

- digital-first educational explanation
- auxiliary / relation emphasis 허용

## SYSTEM_VISUAL

shared engine 자체 작업.

---

# 10. ExpectedVisualType

planning enum 제안:

- `MINIMAL_GEOMETRY`
- `COORDINATE_GEOMETRY`
- `LINE_CIRCLE_GEOMETRY`
- `FUNCTION_GRAPH`
- `CALCULUS_GRAPH`
- `NUMBER_LINE`
- `INTERVAL_DIAGRAM`
- `COMPOSITE_PANEL`
- `EXPLANATION_CARD`
- `RASTER_KEEP`
- `NONE`

---

# 11. CapabilityPlan v1 — D05 공통 계약 소비

```json
{
  "capability": "GEOMETRY_CONSTRUCTION",
  "backendIntent": "STANDARD",
  "mathAuthority": "CONSTRUCTION_GRAPH",
  "publicationProfile": "geometry-publication-v2",
  "reason": "..."
}
```

capability enum과 `expectedVisualType → capability → mathPlan schema → profile → required audits`의 정본은 **D05 §6 / production/contracts.json**이다. D07이 별도 매핑 표를 유지하지 않는다.

핵심 구분:
- 축 없는 기하는 GEOMETRY_CONSTRUCTION.
- 원·각도·Euclidean 거리의 의미가 있는 좌표기하는 **COORDINATE_GEOMETRY**, equal-unit 및 geometry+axis/tick audit.
- 함수/미적 그래프는 FUNCTION_GRAPH; Euclidean 도형 성질을 주장하지 않는 함수+점/선 조합은 COORDINATE_GRAPH.
- NUMBER_LINE/COMPOSITE_PANEL/STANDARD_VISUAL_SPEC/SPECIAL_VISUAL/RASTER_KEEP/VISUAL_EXEMPT/UNSUPPORTED_CAPABILITY도 같은 registry를 소비한다.

publication profile의 identity는 `capabilityPlan.publicationProfile` 한 곳에만 둔다. publicationIntent는 framing/display 의도이지 두 번째 profile authority가 아니다. 예시는 구현 완료나 ACTIVE 선언이 아니다.

---

# 12. SourceConditionInventory v1

문항의 critical 조건을 item-level로 작성.

예:

```json
[
  {
    "id": "C1",
    "statement": "AB ⟂ AC",
    "sourceRef": "...",
    "critical": true,
    "kind": "PERPENDICULAR"
  }
]
```

---

# 13. 조건 분류

- point identity
- incidence
- collinear
- parallel
- perpendicular
- length
- equal length
- angle
- ratio
- midpoint
- circle membership
- tangency
- intersection
- function equation
- domain
- graph intersection
- asymptote
- endpoint
- region
- transformation

---

# 14. Critical condition

solution의 decisive step에 직접 쓰는 조건.

required visual fact와 연결.

---

# 15. Non-critical condition

문제 배경에는 있지만 visual에서 반드시 표현할 필요 없는 조건.

그래도 source semantics 보존을 위해 inventory에 남길 수 있다.

---

# 16. SourceConditionCoverage

각 condition은 최종적으로:

```text
source condition
→ math plan node/constraint
→ visual primitive/annotation
→ review evidence
```

를 추적 가능해야 한다.

---

# 17. DecisiveRelationPlan

예:

```json
{
  "decisiveStep": "접점에서 반지름과 접선이 수직",
  "relations": [
    "CENTER_TO_TANGENCY_RADIUS",
    "PERPENDICULAR_RADIUS_TANGENT"
  ],
  "visualMustShow": [
    "center",
    "tangentPoint",
    "radius",
    "rightAngleMarker"
  ]
}
```

---

# 18. Decisive relation first

planning 시 “문제에 있는 모든 정보”를 그림에 넣지 않는다.

필요한 핵심 관계만.

---

# 19. Geometry planning

geometry capability면:

`ConstructionGraph skeleton`

을 생성.

planner는:

- node ids
- op intent
- source refs
- branch intent
- constraint intent

를 작성.

---

## 19.1 금지

planner가 derived coordinates를 직접 넣는 것.

예:

```json
{"H":[2.13,4.77]}
```

같은 최종 좌표를 LLM이 발명하지 않는다.

## 19.2 실행 가능한 graph로 닫는 책임

D07은 source에 근거한 node/op/input/constraint/branch 의미를 명시하고, D01 normalizer가 닫힌 typed registry로 정규화한다. final FrozenVisualPlan.mathPlan에는 D01 schema를 통과한 executable ConstructionGraph만 넣는다. `op intent` 자유 문자열이나 미완 skeleton은 실행 입력이 아니다.

다해 연산 결과와 단일 점/선을 분리한다. D01의 typed result와 SELECT_POINT/SELECT_LINE node로 의미 branch를 선택하며 배열 첫 원소를 고르지 않는다. source가 branch를 확정하지 못하면 NEEDS_INPUT이다. 이 정규화는 새 수학 공식 계산이나 독립 source review를 대신하지 않는다.

---

# 20. Geometry source input

source가 실제 좌표를 제공하면:

`SOURCE_POINT`

허용.

source가 좌표를 안 주면:

- free normalization
- construction relation

으로 표현.

---

# 21. Free parameter planning

source가 Euclidean relation만 주고 자유도가 있으면:

planner는:

- 자유도
- invariant
- allowed parameter domain

만 명시.

실제 parameter 값 선택은 deterministic construction policy에서.

---

# 22. Branch planning

교점 2개 등 다해인 경우:

branch 의미를 source/solution에서 추출.

예:

- 위쪽 교점
- 선분 AB 위 점
- P와 가까운 교점
- 양의 x축 쪽

source/solution 근거 없으면:

`AMBIGUOUS_BRANCH`

---

# 23. Graph planning

FUNCTION_GRAPH이면:

`GraphPlan skeleton`

작성.

포함:

- function expression
- domain
- required features
- axis intent
- labels

D02 normalizer가 안전한 expression AST/domain/axis/required-feature schema를 검증해 GraphPlan으로 닫는다. final payload는 D05의 inline mathPlan 규칙을 사용한다.

COORDINATE_GEOMETRY는 D02 §3.3의 CoordinateGeometryPlan이며 constructionGraph + axisSpec + EQUAL_UNIT을 가진다. 원/각도 검사에 graph sampler만 붙여서 성공시키지 않는다. v1 미지원인 동일 축 함수+Euclidean circle/angle 혼합은 UNSUPPORTED_CAPABILITY로 남긴다.

---

# 24. Graph expression

source/solution에 나타난 식을 validated AST로 연결.

planner가 임의로 algebraically equivalent 식으로 바꾸더라도
source expression provenance는 보존.

---

# 25. Domain planning

source에서:

- domain
- interval
- endpoint
- hole
- pole

facts 추출.

없으면 deterministic resolver에 맡김.

---

# 26. Required Graph Features

solution이 실제 사용하는 것만:

- root
- intercept
- intersection
- extremum
- tangent
- asymptote
- endpoint
- region boundary

등으로 명시.

---

# 27. Number line / interval

함수 전체 curve가 필요 없는 경우:

`NUMBER_LINE`

선택.

예:

- 부등식 해
- 구간 교집합
- boundary included/excluded

---

# 28. Composite panel

case 분리 등 실제 학습 이득이 있을 때만.

planner output:

- panel count
- panel purpose
- shared facts
- panel-specific facts

---

# 29. LabelIntent v1

planner는 label text 위치가 아니라
**무엇을 표시할지**만 결정.

예:

```json
{
  "owner": "H",
  "kind": "POINT_NAME",
  "semanticText": "H",
  "required": true,
  "factRole": "DERIVED_INTERMEDIATE"
}
```

---

# 30. 금지

planning에서:

- x=143px
- y=77px
- font-size=14

같은 layout 값 결정 금지.

---

# 31. DisplayIntent

각 fact:

- SHOW
- HIDE
- OPTIONAL
- CONTEXT_ONLY

로 분류.

---

# 32. Given vs Derived vs Conclusion

모든 visual fact:

- `GIVEN`
- `DERIVED_INTERMEDIATE`
- `CONCLUSION`

을 갖는다.

결론 fact를 source given처럼 표시하지 않는다.

---

# 33. Existing visual KEEP

KEEP 조건:

- math correct
- decisive relation visible
- owner clear
- typography/readability sufficient
- final render quality floor

planning 단계에서는 KEEP **후보**만 결정.

최종 KEEP는 audit에서 확정.

---

# 34. REBUILD

다음이면 REBUILD:

- geometry wrong
- visual semantics wrong
- composition 구조가 근본적으로 불명확
- owner binding 불가
- legacy manual SVG가 deterministic audit 불가

---

# 35. POLISH 개념

기존 visual이 math는 맞고
style/layout만 문제라면:

planner action은 KEEP/REBUILD 이외에
runner metadata로 `POLISH_REQUIRED`를 전달 가능.

기존 contract를 깨지 않도록
visualAction enum 변경은 별도 version upgrade로 처리.

---

# 36. ExpectedFacts v2

현재 visual benefit의 expectedFacts를 확장.

```json
{
  "id": "F1",
  "statement": "AB = AC",
  "critical": true,
  "kind": "EQUAL_DISTANCE",
  "sourceRefs": [],
  "solutionRefs": [],
  "displayIntent": "SHOW"
}
```

---

# 37. ExpectedFacts는 수치 ledger가 아님

“그림에서 반드시 참이어야 하는 수학 사실” 목록.

---

# 38. Fact completeness

critical decisive relation에 쓰이는 사실이 expectedFacts에 없으면:

planning FAIL.

---

# 39. Fact contradiction

source/solution 두 근거가 충돌하면:

`SOURCE_SOLUTION_CONFLICT`

---

# 40. PublicationIntent

`capabilityPlan.publicationProfile`은 D05 routing으로 한 번 resolve한다. `publicationIntent`에는 `viewportIntent`, 승인된 `displayPolicy` 등 표현 선택만 넣는다. profile 중복 override는 허용하지 않는다.

좌표기하는 coordinate-geometry-publication-v1을 사용하고 기존 axis-free geometry profile을 느슨하게 풀지 않는다. raster/legacy/control 경로는 해당 registry의 적용범위를 명시한다.

---

# 41. ViewportIntent

planner는 exact pixel viewport를 정하지 않는다.

대신:

- include facts
- equal-unit required
- axes required
- panel allowed
- compact/wide/tall tendency

를 명시.

---

# 42. Normalization intent

geometry source 좌표가 없을 때:

- anchor point
- axis direction
- unit constraints

정도만.

실제 좌표는 construction engine.

---

# 43. FrozenVisualPlan v1 — D05와 동일 payload

공통 계약은 D05 §7 / `production/contracts.json`이다. 아래 예시는 D05와 동일하며, 빈 값은 설명용 placeholder다. 독립 evidence가 없는 빈 계획의 실행/PASS를 허용하지 않는다.

```json
{
  "schemaVersion": "apmath-frozen-visual-plan-v1",
  "questionUid": "...",
  "sourceSha256": "...",
  "solutionSha256": "...",
  "surface": "SOLUTION_VISUAL",
  "visualBenefit": {},
  "capabilityPlan": {
    "capability": "GEOMETRY_CONSTRUCTION",
    "backendIntent": "STANDARD",
    "mathAuthority": "CONSTRUCTION_GRAPH",
    "publicationProfile": "geometry-publication-v2",
    "reason": "..."
  },
  "sourceConditions": [],
  "decisiveRelation": {},
  "expectedFacts": [],
  "labelIntent": [],
  "mathPlan": {
    "schemaVersion": "apmath-construction-graph-v1",
    "graphId": "...",
    "sourceRef": {},
    "solutionRef": {},
    "parameters": [],
    "nodes": [],
    "constraints": [],
    "sourceConditionCoverage": [],
    "displayBindings": []
  },
  "publicationIntent": {
    "viewportIntent": {},
    "displayPolicy": {}
  },
  "policyRefs": [],
  "plannerVersion": "...",
  "normalizerVersion": "...",
  "planSha256": "..."
}
```

`mathPlan`은 capability normalizer가 반환한 executable inline plan이다. 유효한 기존 frozen plan 파일을 읽는 경우에도 동일 구조로 정규화하며, old top-level capability/mathPlanRef/planVersion을 조용히 받아들이지 않는다.

---

# 44. Freeze / source-fact review

D05 §7.2의 canonical hash 범위를 그대로 사용한다. `planSha256`만 제외한 전체 payload에 source/solution/policy refs, planner/normalizer version, mathPlan/branch, profile/label/display intent가 포함된다. hash 알고리즘·필드 제외 규칙을 D07에서 따로 정의하지 않는다.

freeze는 내용 고정이지 검수 PASS가 아니다. D05 §7.3의 독립 source/fact evidence가 해당 source·solution·plan/facts를 실제로 덮는지 확인한다. 부모 evidence가 유효하면 재사용하고, 새 construction/branch/critical condition처럼 미포함된 부분만 닫는다. 별도 요청으로 사용자에게 facts JSON을 만들게 하는 것이 아니라 같은 parent workflow continuation으로 연결한다.

review receipt는 plan 밖에서 plan/facts를 참조한다. plan hash를 `independentFactHash`로 복사하거나 plan↔review 순환 hash를 만들지 않는다.

---

# 45. Reuse

기존 frozen plan이 있고:

- source unchanged
- solution unchanged
- policy unchanged

이면 재사용 가능.

---

# 46. Invalidation

source 변경:

전체 plan invalidate.

solution 변경:

decisive relation/expected facts/math plan 재검.

visual policy 변경:

benefit/publication intent 재검.

---

# 47. Policy refs

현재 visual benefit contract처럼
applicablePolicyRefs를 실제 file SHA와 결박.

---

# 48. Golden/Negative calibration

parent Archive worker가 요구하는 calibration은 유지.

planner도 관련 Golden/Negative를 읽은 context를 evidence에 남길 수 있다.

하지만 Golden target SVG를 답안 좌표로 복사하지 않는다.

---

# 49. Autonomous planning boundary

planner가 자동 판단 가능:

- visual necessity
- visual type
- decisive relation
- geometry vs graph
- basic operations
- label intent

---

# 50. NEEDS_INPUT boundary

다음은 자동 확정 금지:

- source asset 잘림으로 관계 불명확
- solution/source answer conflict
- branch ambiguity
- unsupported notation
- missing essential diagram
- multiple equally valid semantic interpretations

---

# 51. Source image reading

source image가 있는 경우:

- actual problem visual
- crop
- labels
- geometric relations

을 planning input으로 사용.

가능하면 structured source truth로 기록.

---

# 52. Problem visual reconstruction

PROBLEM_VISUAL에서는 source fidelity 우선.

source image가 충분하면 RASTER_KEEP.

새 SVG로 미화하지 않는다.

---

# 53. Solution visual planning

source figure가 있어도
solution에서 새 정보가 있으면
새 solution visual 가능.

---

# 54. Visual marginal benefit

planner output에:

`newVisualInformation[]`

추가 권장.

예:

- perpendicular auxiliary
- tangent point emphasis
- simplified decisive triangle

---

# 55. Empty benefit

`newVisualInformation=[]`
+ source figure sufficient

이면 ADD 금지.

---

# 56. Capability support check

D05 §4.3/§53의 **mode별 동일 guard**를 호출한다. 예를 들어 ANGLE_BISECTOR는 typed op가 구현되었는지와 해당 profile의 required audit가 갖춰졌는지를 함께 본다.

PRODUCTION_CANDIDATE는 유효 Seal에 의해 ACTIVE인 조합만, QUALIFICATION은 frozen manifest에 포함된 구현 완료 EXPERIMENTAL/ACTIVE만 허용한다. DISABLED/NOT_IMPLEMENTED/manifest 밖 조합은 둘 다 거부한다.

최초 qualification을 ACTIVE 선행조건으로 막지 않고, 반대로 qualification PASS를 production 준비로 승격하지 않는다. planner와 runner에서 같은 guard를 소비하며 서로 다른 예외를 만들지 않는다.

---

# 57. No speculative fallback

unsupported construction을
handcrafted SVG로 자동 우회하지 않는다.

SPECIAL은 명시적 route.

---

# 58. Planner output audit

planner self-report만 믿지 않는다.

schema validator:

- condition coverage
- expected facts
- role
- capability
- source refs

확인.

---

# 59. Cross-check between benefit and plan

예:

VISUAL_EXEMPT인데 geometry plan이 있으면 contradiction.

VISUAL_REQUIRED인데 expectedFacts 0이면 FAIL.

---

# 60. Existing contract compatibility

`solution-visual-benefit.mjs` v1은 유지.

새 FrozenVisualPlan이 이를 포함/참조.

---

# 61. Expected-facts adapter

FrozenVisualPlan에서 기존 `past-exam-expected-facts-v1`로 내려가는 compatibility adapter를 유지한다. 신규 v2 경로도 기존 independently frozen fact/source 결속을 우회하지 않는다.

`independentFactHash`는 검증된 기존 fact bundle 계약에서 나온 값이며 새 plan JSON hash의 별칭이 아니다. 검토 근거의 source/solution/plan/fact 범위와 실제 artifact SHA를 확인한 뒤 `fact.independentFactHash`와 `visualSpec.sourceFacts.independentFactHash`에 동일한 기존 의미로 전달한다. 값이 없거나 불일치하면 NEEDS_INPUT/해당 binding FAIL이지 자동 해시 생성 후 PASS가 아니다.

---

# 62. New file proposal

## `production/resolve-request.mjs`

Detail 05와 공유.

identity/source/solution resolve.

---

## `production/plan-visual.mjs`

상위 planner orchestration.

LLM output validation / normalization.

---

## `production/visual-plan.schema.json`

FrozenVisualPlan schema.

---

## `production/plan-to-capability.mjs`

작으면 `plan-visual.mjs`에 통합.

---

# 63. 기존 파일 수정

## `solution-visual-benefit.mjs`

가능하면 v1 보존.

필요한 새 fields는 v2 schema로 확장.

---

## `question-uid.mjs`

재사용.

---

## `past_exam_adapter.py`

FrozenVisualPlan compatibility adapter 추가 가능.

---

## `build-visual-candidate.mjs`

production request는 Detail 05 runner에 delegate.

---

# 64. Planner interface

LLM에게 자유문장만 요구하지 않는다.

입력:

```text
source snapshot
solution snapshot
visual policy
capability registry
```

출력:

strict JSON plan.

같은 입력 envelope에 `mode`와 검증된 qualificationManifestRef도 포함한다. LLM의 출력은 semantic plan draft이고, D01/D02 normalizer와 D05의 schema/guard를 통과한 payload만 runner에 전달한다. LLM이 지원범위·ACTIVE·review PASS를 임의 선언한 문자열은 권한이 아니다.

---

# 65. Planner temperature/determinism

가능한 낮은 변동성.

동일 input에서 semantic plan이 흔들리지 않도록:

- closed enums
- explicit ids
- canonical sorting

---

# 66. Fact ID generation

stable semantic id.

예:

- `SRC_AB_LENGTH`
- `DERIVED_H_FOOT`
- `CONCLUSION_ANGLE_A`

LLM random UUID 금지.

---

# 67. Node ID naming

source label 기반:

A, B, C, H, O 등.

충돌 시 stable suffix.

---

# 68. Source identity preservation

source A를 planner가 P로 rename하지 않는다.

---

# 69. Answer leakage

PROBLEM_VISUAL plan에서:

- conclusion
- solution-only auxiliary
- answer label

표시 금지.

---

# 70. Solution visual conclusion

SOLUTION_VISUAL에서는 conclusion 강조 허용.

factRole 명시.

---

# 71. Educational density

planner는 너무 많은 label을 요구하지 않는다.

decisive relation 중심.

---

# 72. Condition box

긴 텍스트를 geometry 안에 모두 복사하지 않는다.

필요한 condition summary만.

---

# 73. Unit / notation

source notation 유지.

예:

- cm
- °
- π

---

# 74. Exact values

source/solution exact value를 decimal로 바꾸지 않는다.

---

# 75. Curriculum constraints

planner는 parent Archive curriculum policy를 입력으로 받는다.

visual이 교육과정 밖 풀이를 암시하지 않게 함.

---

# 76. High1 special rule

고1에서 금지된 풀이 개념이 visual에 들어가지 않도록
solution authority와 동일 curriculum gate 사용.

---

# 77. Planning evidence

```json
{
  "plannerVersion": "...",
  "inputSha256": "...",
  "sourceSha256": "...",
  "solutionSha256": "...",
  "policyBundleSha256": "...",
  "outputPlanSha256": "..."
}
```

---

# 78. Human override

형님/worker가 명시적으로:

- visual required
- no visual
- specific relation

을 지시하면 최고 우선순위.

override도 plan provenance에 기록.

---

# 79. Override vs source truth

사용자 지시가 있어도 수학적으로 틀린 관계 생성 금지.

---

# 80. Planner resume

source/solution unchanged이면
frozen plan checkpoint reuse.

---

# 81. Plan mutation

plan 수정은 새 revision.

old plan overwrite 금지.

---

# 82. Planning status

- `PLANNED`
- `VISUAL_EXEMPT`
- `NEEDS_INPUT`
- `UNSUPPORTED_CAPABILITY`
- `SOURCE_REPAIR_REQUIRED`
- `PLAN_CONFLICT`

---

# 83. SOURCE_REPAIR_REQUIRED

source truth가 current artifact만으로 확정 불가할 때만.

R3 운영 원칙과 동일.

---

# 84. Parent lifecycle integration

CREATE/R1/R2/R3가 visual을 요구할 때
planner는 parent stage metadata를 받는다.

stage 이름을 새로 만들지 않는다.

---

# 85. CREATE

visual 필요성 최초 판단/ADD 가능.

---

# 86. R1/R2

existing plan을 독립 재검/compare.

---

# 87. R3

final visual full audit.
확정 가능한 defect same-stage repair.

---

# 88. Planner가 stage gate를 대신하지 않음

plan PASS != R1/R2/R3 PASS.

---

# 89. Actual plan examples

## triangle perpendicular — BC에 내린 수선의 발

```text
VisualBenefit: REQUIRED
Capability: GEOMETRY_CONSTRUCTION
Decisive: A에서 직선 BC에 내린 수선의 발 H
Inputs: source가 정의한 A, B, C; B != C
Ops:
  BC = LINE_THROUGH_POINTS(inputs=[B,C], outputType=LINE)
  H  = PERPENDICULAR_FOOT(inputs=[A,BC], outputType=POINT)
Required:
  H ∈ line(BC)
  AH ⟂ BC
```

AH를 일반적인 수선 선분으로 표시하는 fixture에서는 A∉line(BC)도 명시한다. 퇴화 입력은 별도 negative로 다룬다. 위 예시는 source에 없는 임의 좌표를 추가하지 않는다. node/sourceRefs/factRole은 실제 source 의미대로 채우고 BC 대신 AB를 참조하는 변조는 실패해야 한다.

---

# 90. circle tangent

```text
Capability: GEOMETRY_CONSTRUCTION
Required:
center O
tangent point T
radius OT
tangent line
OT ⟂ tangent
```

---

# 91. rational graph

```text
Capability: FUNCTION_GRAPH
Expression: ...
Required:
pole x=...
branch split
intercept...
```

---

# 92. no visual algebra

```text
VISUAL_EXEMPT
Capability: VISUAL_EXEMPT
Reason:
spatial/graph relation adds no understanding benefit
```

---

# 93. Existing source sufficient

```text
VISUAL_OPTIONAL
Action: KEEP
newVisualInformation=[]
```

---

# 94. Planning regression fixtures

최소:

1. simple triangle
2. perpendicular foot
3. midpoint
4. circle tangent
5. line-circle branch
6. graph rational
7. graph sqrt
8. two-function intersection
9. number line
10. case split
11. source figure sufficient
12. visual exempt
13. problem visual raster keep
14. ambiguous branch
15. source-solution conflict
16. unsupported capability

추가 연결 fixture: D07 output을 수정 없이 D05→D01/D02로 전달하는 geometry/graph 각 1건, file/UID 입력 동등성, 좌표축+원+직선 COORDINATE_GEOMETRY 1건. 정상 BC-foot와 잘못된 AB 참조를 비교한다.

---

# 95. Mutation tests

- decisive relation 삭제
- expected fact critical=false
- source label rename
- branch 의미 제거
- conclusion as GIVEN
- VISUAL_EXEMPT + ADD
- source figure sufficient + blind ADD
- unsupported op ACTIVE
- source SHA stale
- solution SHA stale

모두 FAIL.

추가 negative: 미정규화 skeleton 실행, plan hash를 독립 fact evidence로 대체, source/fact receipt가 다른 plan에 결박됨, normal mode에서 EXPERIMENTAL 실행, qualification manifest 밖 요청, 좌표기하를 graph-only로 강제 routing. 목적 gate의 오류를 확인하며 unrelated parser 오류만으로 해당 결함을 검출했다고 세지 않는다.

---

# 96. Actual Archive qualification planning

Detail 08 representative UID 선정 시
이 planner가 실제 source에서 plan을 생성.

수동 facts를 대신 넣어 qualification하지 않는다.

---

# 97. Planner quality review

독립 reviewer가 확인:

- source completeness
- decisive relation
- visual necessity
- capability route
- expected facts

---

# 98. Planner output은 final expected truth가 아님

math engine/independent audit가 실제 계산 검증.

planner는 semantic intent authority.

---

# 99. Internal completion gate

Detail 07 완료 상태:

`VISUAL_REQUEST_PLANNING_QUALIFIED`

의미:

문항 1개 → runner-ready frozen plan 자동 생성.

전체 PUBLICATION_READY는 아님.

---

# 100. 완료 기준

- [ ] stable questionUid 하나로 source/solution을 resolve한다.
- [ ] visual necessity를 current Visual Benefit contract에 맞춰 판정한다.
- [ ] source figure sufficiency를 먼저 본다.
- [ ] decisive relation을 명시한다.
- [ ] critical source condition inventory를 만든다.
- [ ] geometry/graph/number-line/raster/exempt capability를 route한다.
- [ ] unsupported를 handcrafted fallback으로 숨기지 않는다.
- [ ] geometry plan에서 LLM이 derived coordinates를 발명하지 않는다.
- [ ] graph plan에서 domain/required feature intent를 만든다.
- [ ] expectedFacts가 decisive relation을 완전히 커버한다.
- [ ] label intent는 semantic/owner만 정하고 pixel 위치는 정하지 않는다.
- [ ] GIVEN/DERIVED/CONCLUSION factRole을 유지한다.
- [ ] problem visual에 answer leakage를 막는다.
- [ ] exact values를 임의 decimal로 바꾸지 않는다.
- [ ] source/solution conflict는 NEEDS_INPUT으로 남긴다.
- [ ] branch ambiguity는 자동 임의 선택하지 않는다.
- [ ] plan이 source/solution/policy SHA에 결박된다.
- [ ] same input에 stable semantic plan을 만든다.
- [ ] old frozen plan의 stale reuse를 거부한다.
- [ ] 사용자가 별도 facts JSON을 수동 작성하지 않아도 runner로 이어진다.
- [ ] planner PASS만으로 publication PASS를 주장하지 않는다.

- [ ] D05와 동일 request/FrozenVisualPlan payload·hash 범위를 사용한다.
- [ ] MathPlanSkeleton은 capability normalizer가 executable schema로 닫은 뒤에만 전달한다.
- [ ] 독립 source/fact evidence의 유효 재사용과 미포함 범위 인계가 구분된다.
- [ ] qualification mode와 ordinary mode의 실행 허용/결과 권한이 분리된다.
- [ ] 원/각도 좌표기하는 geometry+axis/tick audit 경로로 route된다.
- [ ] 수선의 발 예시가 BC 입력과 incidence/perpendicular 조건에 맞게 실행된다.

---

# 101. 이 단계에서 하지 않는 것

- geometry numeric 계산
- graph curve sampling
- MathJax typesetting
- label layout
- SVG compose
- browser rendering
- Archive capture
- independent final visual review
- production exam mutation
- unsupported arbitrary solver
- LLM 자유 SVG 생성

---

# 102. 후속 세부계획과 인터페이스

Detail 07 output:

```text
SourceSnapshot
SolutionSnapshot
ExistingVisualSnapshot
VisualBenefit
SourceConditionInventory
DecisiveRelationPlan
CapabilityPlan
ExpectedFacts
LabelIntent
FrozenVisualPlan
VisualRequest
```

### Detail 05 — One-Click Runner

이 plan을 실행한다.

### Detail 08 — Qualification & Seal

실제 문항에서 planner부터 final review까지 전체 체인을 검증한다.

---

# 103. 최종 한 문장

> **APMath Problem → Visual Request v1은 LLM이 SVG를 직접 그리는 계층이 아니라, 문항의 source와 verified solution을 읽어 visual 필요성·decisive relation·critical facts·capability·label intent를 구조화된 FrozenVisualPlan으로 고정하고, deterministic geometry/graph/publication engine이 안전하게 실행할 수 있도록 넘기는 semantic planning 계층이다.**