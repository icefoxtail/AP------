# APMath One-Click Runner 세부 구현계획 v1.1

> **상위 재검토 반영 기준:** `0bb88da58e41ae1154911d4e711f6247e60e5f16`. 본문의 기존 조사 이력은 보존한다. 이번 재검토의 최종 결정은 마지막 추가 절과 [검토 보고서](APMath_Construction_Visual_Production_아키텍처재검토_2026-10-05.md)에 기록하며, 해당 항목은 앞선 초안의 포괄적 표현보다 우선한다. 제품 코드·신규 engine qualification은 이번 변경 범위가 아니다.

**상위 문서:** `APMath Construction & Visual Production Engine — 최종 구현 계획서`  
**문서 역할:** Detail 05 / One-Click Runner  
**작성일:** 2026-10-05 (Asia/Seoul)  
**상태:** **통합검토 보완 반영 · 계획 v1.1 · 이번 작업 제품 코드 변경 0**  
**v1.0 원문 조사 기준(이력 보존):** `origin/main @ 89462a1c59567a652ab5f500a8b96f4ccaa7052a`

**통합 보완 기준 main:** `3a7b2cb712fb192f3728f4df4a7ccc1e99d79427`  
**개정일:** 2026-10-05 (Asia/Seoul)  
**반영 이슈:** I-01, I-02, I-04, I-05  
**적용 관계:** 같은 Detail v1.0의 해당 계약/예시를 v1.1 본문으로 대체한다. 공통 요청·routing·상태의 단일 소유자는 Detail 05 §4/6/7/24–26/53–54다. 원문의 “현재 main 구현” 설명은 원 조사 시점 기록이며 이번에 전체 코드를 다시 조사했다는 뜻이 아니다. 이 문서의 test/qualification checklist는 구현 후 수행할 요구사항이고, 문서 보완은 실행 PASS·ACTIVE·PUBLICATION_READY·Seal 선언이 아니다.

---

## 0. 이 문서의 목적

이 문서는 APMath Visual Production Engine의 다섯 번째 세부계획으로, 앞선 1~4차 세부 capability를 **한 번의 요청으로 연결하는 production orchestration layer**를 설계한다.

앞선 문서가 각각 다음을 책임진다.

- Detail 01 — Construction Kernel  
  `ConstructionGraph → ConstructionSnapshot`

- Detail 02 — Function Graph & Coordinate Axis Publication  
  `GraphPlan → GraphSamplingResult / GraphPublicationAudit`

- Detail 03 — Typography & Font  
  `LabelInventory → LabelFragment → MeasuredLabel`

- Detail 04 — Measured Layout & Publication  
  `MeasuredLabel → LayoutResult → FinalCompositionPlan`

본 문서의 목표는 이들을 다음처럼 한 번에 실행하는 것이다.

```text
VisualRequest
→ Resolve
→ Math capability dispatch
→ Build model/facts
→ Typography
→ Measure
→ Layout
→ Compose SVG
→ Static audit
→ Browser audit
→ 필요 시 bounded repair
→ Final freeze
→ Result
```

핵심 제품 목표:

> **사용자는 문항 하나만 지정한다. 시스템은 필요한 수학 모델·그래프·수식 조판·폰트·측정·레이아웃·SVG·검수까지 자동으로 진행하고, 수동 font/viewBox/label 후처리 없이 review-ready 결과를 만든다.**

One-Click의 의미는:

- 모든 문제를 무조건 성공시키는 것
- unsupported를 숨기는 것
- 검증 실패를 자동 우회하는 것

이 아니다.

One-Click의 의미는:

> **한 요청이 성공 또는 구체적 실패상태까지 끊기지 않고 deterministic하게 진행되고, 중간 파일을 사용자가 직접 만들어 다시 명령하지 않아도 되는 것**이다.

---

# 1. 최상위 구현 결정

## 1.1 새 production entrypoint

신규 canonical entrypoint:

`archive/tools/geometry-equation/production/run.mjs`

역할:

- VisualRequest 수용
- immutable attempt 생성
- 각 capability 호출
- hash/checkpoint 관리
- cache/reuse
- failure reduction
- bounded repair
- result.json 생성

---

## 1.2 기존 candidate CLI 보존

현재:

`archive/tools/past-exam-pipeline/build-visual-candidate.mjs`

는 유지한다.

현재 역할:

```text
--facts frozen expected facts
→ past_exam_adapter
→ entrypoints.build_independent
→ build(spec)
```

신규 runner가 이를 삭제하지 않는다.

기존 경로는:

- legacy regression
- frozen-facts candidate
- compatibility
- low-level debugging

용도로 유지한다.

---

## 1.3 production request path 추가

기존 CLI에 향후 명시적:

```text
--request <visual-request.json>
# 또는
--question-uid <uid>
```

경로를 추가할 수 있다.

단 실제 orchestration은:

`production/run.mjs`

가 소유한다.

`build-visual-candidate.mjs` 안에 거대한 orchestration 로직을 넣지 않는다.

---

# 2. 현재 main의 실제 상태

## 2.1 `build-visual-candidate.mjs`

현재는:

- `--facts`
- `--run-id`
- optional `--output-root`

만 받는다.

Python subprocess에서:

`visual_engine.past_exam_adapter.build_candidate`

를 호출한다.

즉 현재는:

**이미 만들어진 facts/spec를 소비하는 candidate builder**다.

아직:

- source resolution
- graph planning
- typesetting
- browser measurement
- repair
- Archive render
- final reducer

를 소유하지 않는다.

---

## 2.2 `entrypoints.py`

현재 lane:

- STANDARD
- SPECIAL
- LEGACY

가 있다.

STANDARD:

- visualSpec
- frozen independentFactHash

를 요구.

SPECIAL:

- prebuilt asset
- visualSpec
- common QA 필요

LEGACY:

- diagnostic allowlist

신규 runner는 이 classification을 깨지 않는다.

다만 production capability 결과를 최종적으로 기존 builder에 전달할 때
STANDARD path를 명시적으로 사용할 수 있게 한다.

---

## 2.3 `engine.py`

현재 `build()`는 이미:

```text
validate
→ prepare
→ layout
→ publication finalize
→ compose
→ witness
```

를 수행한다.

하지만:

- typography fragment generation 없음
- actual measurement 자동 실행 없음
- browser audit 호출 없음
- repair orchestration 없음
- Archive integration 없음

즉 engine은 **pure build component**로 유지하고,
runner가 상위 orchestration을 맡는다.

---

## 2.4 `render-impact.mjs`

이미 부분 재검을 위한 기반이 있다.

기능:

- render signature
- question/mode/viewport key
- global invalidator
- changed root 영향 추적

이 자산은 runner의 invalidation/reuse 판단에 재사용한다.

새로운 자체 impact engine을 중복 구현하지 않는다.

---

## 2.5 `runtime.mjs`

현재 pipeline-core runtime은:

- dependency bundle
- runtime binding
- validation

기반을 제공한다.

runner는 Archive browser 단계에서 이를 재사용한다.

---

## 2.6 `question-uid.mjs`

stable UID v2 / source identity 기반이 이미 있다.

runner는 파일명이나 qid만으로 artifact identity를 만들지 않는다.

---

## 2.7 `visual-repair.mjs`

현재 파일명은 repair이지만 실제 역할은:

> 기존 source visual asset을 provider input으로 결박

이다.

이 파일은:

**SVG layout repair engine이 아니다.**

따라서 신규 runner의:

- relocate
- framing
- leader
- dimension
- panel

repair loop와 별개다.

명칭 때문에 재사용하지 않는다.

---

# 3. One-Click Runtime 목표 구조

```text
VisualRequest
  ↓
ResolveRequest
  ↓
CapabilityPlanner
  ├─ GEOMETRY_CONSTRUCTION
  ├─ COORDINATE_GEOMETRY
  ├─ FUNCTION_GRAPH / COORDINATE_GRAPH
  ├─ STANDARD_VISUAL_SPEC / NUMBER_LINE / COMPOSITE_PANEL
  ├─ SPECIAL_VISUAL / RASTER_KEEP
  └─ VISUAL_EXEMPT / UNSUPPORTED_CAPABILITY
  ↓
Frozen Math Plan
  ↓
Model / Graph build
  ↓
VisualSpec
  ↓
LabelInventory
  ↓
TypographyProfile
  ↓
Typeset Fragments
  ↓
Measure Fragments
  ↓
Measured Layout
  ↓
Compose SVG
  ↓
Machine Audits
  ↓
Browser Layout Audit
  ↓
Bounded Repair if visual-only
  ↓
Archive-ready candidate
  ↓
Final Freeze
  ↓
Result.json
```

Actual Archive 연결은 Detail 06에서 완성한다.

---

# 4. VisualRequest v1 — 공통 요청 계약

`production/contracts.json`이 요청·FrozenVisualPlan·routing·결과 enum의 유일한 공통 계약 소유자다. Detail 07/08은 이를 소비하며 동일 필드의 별도 버전을 만들지 않는다. 아래는 **구현할 계약 예시**이며, `...`나 빈 객체를 실제 검증된 입력으로 허용한다는 뜻은 아니다.

```json
{
  "schemaVersion": "apmath-visual-request-v1",
  "runId": "...",
  "questionUid": "...",
  "surface": "SOLUTION_VISUAL",
  "mode": "PRODUCTION_CANDIDATE",
  "qualificationManifestRef": null,
  "frozenPlanRef": null,
  "parentContext": {},
  "options": {}
}
```

## 4.1 입력 정규화와 identity

- `--request <visual-request.json>`는 **파일 입력만**, `--question-uid <uid>`는 **UID 입력만** 받는다. 두 옵션은 동시 사용을 거부하고 같은 `VisualRequest`로 정규화한다. UID를 파일 경로로 추측하지 않는다.
- `--facts ... --run-id ...`는 기존 low-level compatibility 경로다. 신규 입력과 섞어 의미를 바꾸지 않는다.
- resolution 후 stable UID, source exam/qid/ordinal, source SHA, solution SHA, surface를 결박한다. UID는 경로로 직접 쓰지 않고 기존 safe assetId mapping을 사용한다.
- `frozenPlanRef`는 재사용할 계획 파일의 `{path, sha256}` 또는 null이다. 파일을 읽고 SHA를 검증한 뒤 §7의 **동일 inline payload**로 정규화한다. 별도의 ref형 FrozenVisualPlan은 만들지 않는다.

## 4.2 surface

`PROBLEM_VISUAL / SOLUTION_VISUAL / SYSTEM_VISUAL`을 유지한다. solution에는 승인된 보조선·교육적 강조를 허용하고 problem에는 source fidelity/힌트 누출 금지를 적용한다. surface가 달라지면 source/display/required gate도 다시 resolve한다.

## 4.3 실행 목적 — 최초 qualification 경로

| mode | 실행 허용 | 결과 권한 |
|---|---|---|
| `PRODUCTION_CANDIDATE` | 해당 capability implementation/dependency fingerprint의 유효 Seal에 의해 ACTIVE인 capability/op/profile 조합만 | 요청별 필수 audit·Actual Archive·독립 review까지 PASS해야 `PUBLICATION_READY`; production write 권한은 없음 |
| `QUALIFICATION` | 검증된 frozen qualification manifest에 포함된 사례·scope이고, 필요한 구현이 존재하는 ACTIVE/EXPERIMENTAL 조합 | 같은 planner/runner/auditor/Archive 경로로 시험하되 `PUBLICATION_READY` 금지. 완료는 `QUALIFICATION_COMPLETE` |

`QUALIFICATION`에서는 `qualificationManifestRef={path,sha256}`가 필수다. manifest는 engine/dependency/contract revision, 시험 source·solution bytes, case identity, 허용 capability/op/profile 범위를 동결한다. 실제 UID와 synthetic fixture identity는 구분한다. 미래 planner 결과의 hash를 사전에 요구하지 않으며, 생성 후 plan SHA와 실제 실행 결과를 manifest의 case에 결박한다.

`NOT_IMPLEMENTED`, `DISABLED`, manifest 밖 case/op, 잘못된 manifest SHA는 qualification에서도 실행하지 않는다. 단순 `mode` 문자열·`force` 옵션으로 source/fact review, 독립 audit, required label, generated-only, repair budget을 우회할 수 없다. 이 manifest는 정식 실행 계약의 입력이지 사용자에게 매번 새로운 승인을 요구하는 절차가 아니다.

시험 실행과 capability 활성화를 분리한다. component의 PASS는 해당 component evidence일 뿐이며 Seal 입력에 `PUBLICATION_READY`를 선행 요구하지 않는다. 활성화 순서는 Detail 08 §90을 따른다.

---

# 5. Request resolution

신규:

`production/resolve-request.mjs`

역할:

1. UID resolve
2. source path / qid resolve
3. source SHA
4. verified solution ref
5. existing visual ref
6. frozen plan 존재 여부
7. parent Archive stage/context

을 찾는다.

---

## 5.1 resolve 결과

```json
{
  "questionUid": "...",
  "source": {},
  "solution": {},
  "existingAssets": [],
  "frozenPlan": null,
  "status": "RESOLVED"
}
```

---

## 5.2 source/solution conflict

source와 verified solution이 충돌하면:

`NEEDS_INPUT`

즉 layout engine이 임의로 결정하지 않는다.

---

# 6. Capability Planner와 단일 routing 표

planner는 필요성·표현 유형·source facts·label intent·surface를 결정한다. final derived 좌표, SVG 문자열, pixel 배치를 만들지 않는다. `CapabilityPlan`의 canonical capability enum은 아래와 같으며, `GRAPH_PUBLICATION` 같은 내부 gate 이름을 capability alias로 다시 사용하지 않는다.

| expectedVisualType / 조건 | capability | 정규화된 mathPlan | publication profile / 필수 수학 관측 |
|---|---|---|---|
| MINIMAL_GEOMETRY / LINE_CIRCLE_GEOMETRY, 축 없음 | `GEOMETRY_CONSTRUCTION` | ConstructionGraph | `geometry-publication-v2`; construction·Euclidean geometry·owner |
| COORDINATE_GEOMETRY, 원/각도/Euclidean 거리 또는 source 좌표 위 기하 | `COORDINATE_GEOMETRY` | CoordinateGeometryPlan | `coordinate-geometry-publication-v1`; **equal-unit + construction/geometry + axis/tick 모두** |
| FUNCTION_GRAPH / CALCULUS_GRAPH | `FUNCTION_GRAPH` | GraphPlan | `graph-publication-v1`; curve 내부 오차·topology·axis/tick·required feature |
| 함수와 point/segment/line의 동일 축 구성, Euclidean 도형 성질 주장 없음 | `COORDINATE_GRAPH` | GraphPlan의 COORDINATE_FUNCTION_COMPOSITE | `graph-publication-v1`; graph 관측 + 적용되는 point/line fact |
| 검증된 표준 spec / EXPLANATION_CARD | `STANDARD_VISUAL_SPEC` | versioned visualSpec | registry에 등록된 정확한 profile와 해당 gate |
| NUMBER_LINE / INTERVAL_DIAGRAM | `NUMBER_LINE` | 해당 versioned standard plan/spec | 독립 검수까지 구현·qualified인 profile만 |
| COMPOSITE_PANEL | `COMPOSITE_PANEL` | 닫힌 panel spec + 자식 plan | 모든 자식 profile의 required gate + panel layout; 미지원 자식을 숨기지 않음 |
| 승인된 특수 adapter | `SPECIAL_VISUAL` | 기존 special contract | 기존 common QA 유지; 미지원의 우회로가 아님 |
| RASTER_KEEP | `RASTER_KEEP` | 보존할 원본 artifact ref | 별도 source/image audit; 새 SVG 생성 실적으로 세지 않음 |
| NONE + visual 면제 | `VISUAL_EXEMPT` | null | 필요성/면제 판정만; 생성 visual qualification 분모 제외 |
| 등록되지 않았거나 실행 목적상 미허용 | `UNSUPPORTED_CAPABILITY` | 실행 안 함 | 성공 profile로 fallback하지 않음 |

이 표는 **구현 범위와 연결 계약**이지 현재 ACTIVE 선언이 아니다. request mode에 따른 실행 허용은 §4.3/§53, 실제 ACTIVE는 Detail 08 Seal에 의해 결정한다. `COORDINATE_GEOMETRY`와 `COORDINATE_GRAPH`를 이름 유사성으로 상호 대체하지 않는다.

`CapabilityPlan.publicationProfile`이 profile identity의 단일 위치다. `publicationIntent`에는 framing/display intent만 두며 두 곳에 다른 profile을 쓸 수 없게 한다. 전체 engine을 특정 capability의 성공 하나로 활성화하지 않는다.

---

# 7. FrozenVisualPlan — 공통 전달 형식

D05/D07은 아래 한 형식을 사용한다. math plan은 **정규화된 executable inline payload**만 허용한다. planner의 의미 초안인 `MathPlanSkeleton`을 이름만 바꿔 frozen 실행 입력으로 넘기지 않는다.

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

위 예시의 빈 배열/`...`는 필드 설명용이다. 필요한 source 조건·nodes·branch·review가 빠진 실제 요청은 거부한다. graph 경로의 `mathPlan`은 `apmath-graph-plan-v1`, 좌표기하 경로는 D02 §3.3의 `apmath-coordinate-geometry-plan-v1`이다. null은 명시적으로 실행 수학이 없는 control 경로에만 허용한다.

## 7.1 Plan 정규화·freeze의 책임

`D07 semantic skeleton → D01/D02 capability-specific normalizer → typed schema/참조/branch 검증 → FrozenVisualPlan` 순서다. 수학 수치 실행은 그 뒤에만 한다. D01은 ConstructionGraph, D02는 GraphPlan/CoordinateGeometryPlan을 정규화하며 runner는 계산하지 않는다.

normalizer는 명시된 intent를 닫힌 registry op/input/output으로 바꿀 뿐, source 조건·branch·derived 좌표를 추측하지 않는다. 모호하거나 critical 의미가 누락되면 `NEEDS_INPUT`; 미지원 조합은 `UNSUPPORTED_CAPABILITY`다. unknown op/input/type은 kernel 호출 전에 계약 오류로 남긴다.

## 7.2 Hash 범위

기존 `pipeline-core/canonical.mjs`의 canonical JSON/hash 규칙을 재사용한다. `planSha256` 자신만 제외한 **전체 canonical plan payload**를 hash한다. source/solution, policy refs의 bytes hash, planner/normalizer version, mathPlan/branch, capability/profile, label/display intent가 모두 포함된다. runId/attempt/path와 사후 audit/review receipt는 plan에 넣지 않는다.

외부 `frozenPlanRef.sha256`는 파일 bytes 검증용이고 `planSha256`는 semantic payload 검증용이다. 서로 다른 hash를 혼용하지 않는다. 소비자는 read 시 두 값을 실제 재계산한다. 지원하지 않는 필드/버전이나 기존 `planVersion/capability/mathPlanRef/publicationProfile` top-level 초안은 silent reinterpret하지 않는다. 이번 문서 v1.1은 아직 미구현인 v1 wire contract를 정렬하는 문서 개정이다.

## 7.3 독립 source/fact evidence 경계

freeze는 독립 검수 PASS가 아니다. 기존 `build_independent()`의 `independentFactHash` 및 `visualSpec.sourceFacts.independentFactHash` 일치 요구를 유지한다. `sha256(plan)`을 그 값에 복사해서 독립 review를 대신하지 않는다.

source/fact review artifact는 **plan 외부**에 두고 source/solution SHA, 검토한 plan SHA·expected-fact payload, reviewer/parent evidence의 실제 범위를 결박한다. source/solution/facts 및 새 construction 의미까지 유효하게 덮는 부모 evidence가 있으면 그대로 재사용한다. 포함되지 않은 새 조건/graph/branch만 source/fact 검토 단계에서 닫는다. 매 요청마다 전체 수학 검수를 반복하라는 뜻이 아니다.

`PLAN` substep에서 evidence 유효성을 확인한 뒤, compatibility adapter가 실제 검증된 frozen fact bundle의 기존 hash를 양쪽 entrypoint 필드에 일관되게 전달한다. evidence가 없으면 부모의 해당 source/fact 단계에 정확한 누락 범위를 인계하고 checkpoint를 남긴다. 자동 생성한 UUID·동일 JSON의 hash만으로 독립성을 만들지 않는다. plan→review는 단방향이며 plan hash에 그 review hash를 다시 포함해 순환시키지 않는다.

## 7.4 최소 연결 확인

geometry 1건과 graph 1건은 D07 출력 그대로 D05→D01/D02에 전달하여 수동 JSON 편집 없이 실행한다. 파일/UID 입력의 정규화 동등성, stale plan/fact evidence, malformed handoff를 확인한다. 이 확인은 구현 시 수행할 테스트이며 문서 개정으로 실행 완료를 주장하지 않는다.

---

# 8. Geometry execution

`GEOMETRY_CONSTRUCTION`은 Detail 01을 실행한다.

```text
FrozenVisualPlan.mathPlan: ConstructionGraph
→ SymPy → CindyJS cross-check → ConstructionSnapshot → visualSpec
```

`COORDINATE_GEOMETRY`는 D02 CoordinateGeometryPlan 안의 `constructionGraph`를 **동일 D01 kernel**로 실행하고 `axisSpec`를 D02 axis/tick adapter로 만든다. 하나의 equal-unit model→screen transform을 사용하고 final SVG에는 geometry와 axis/tick observer를 모두 적용한다. 새 geometry backend나 별도 렌더러는 만들지 않는다.

runner는 수학식이나 파생 좌표를 직접 계산하지 않는다. profile 선택 및 required gate 집합은 §6에서 resolve한다.

---

# 9. Graph execution

`FUNCTION_GRAPH / COORDINATE_GRAPH`는 Detail 02를 실행한다.

```text
FrozenVisualPlan.mathPlan: GraphPlan
→ DomainTopology → Sampling → AxisSpec → RequiredFeatures → graph visualSpec
```

final curve의 꼭짓점 parity만으로 PASS하지 않는다. D02 §15.1의 **선분 내부 오차·visible branch coverage**도 independent observer에서 확인한다. `COORDINATE_GEOMETRY`를 이 sampling 경로로 보내 원/각도 검수를 생략하지 않는다.

---

# 10. Standard visual execution

이미 충분한 frozen visualSpec가 있고
construction graph가 필요 없는 경우:

기존 STANDARD builder를 사용.

단 production-v2 typography/layout profile은 적용 가능.

---

# 11. Label inventory

math/model output 이후:

`LabelInventory`

생성.

required / optional / owner / role를 확정.

---

# 12. Typography execution

Detail 03 실행.

```text
LabelInventory
→ TypographyProfile
→ LabelFragment
→ FragmentAudit
→ MeasuredLabel
```

---

# 13. Layout execution

Detail 04 실행.

```text
Model
+ Fragments
+ Measurements
→ LayoutInput
→ LayoutResult
→ FinalCompositionPlan
```

---

# 14. SVG composition

최종 candidate SVG 생성.

output:

- `visual.svg`
- composition metadata
- fragment manifest
- layout result

---

# 15. Static audit

browser 전에 cheap/static audit 실행.

축:

- schema
- math/semantic
- construction cross-check
- graph audit
- fragment audit
- primitive audit
- final SVG structure

---

## 15.1 static failure

static FAIL이면 browser로 보내지 않는다.

상태:

`STATIC_AUDIT_FAIL`

---

# 16. Browser audit

static PASS 후:

- actual browser
- rendered layout
- glyph
- clipping
- collision
- viewport
- label inventory

검사.

---

# 17. Repair classification

browser/static fail을 분류한다.

### repairable visual defect

- label overlap
- label geometry collision
- clipping
- leader crossing
- viewport margin
- condition box overflow
- owner cue distance

### non-repairable math defect

- wrong construction
- wrong branch
- wrong function
- wrong source fact
- wrong answer
- missing condition

math defect를 layout repair로 고치지 않는다.

---

# 18. Bounded repair

visual-only defect면:

최대 **3회**

---

## Attempt 1

- relocate
- local anchor change

---

## Attempt 2

- annotation cue
- dimension
- leader

---

## Attempt 3

- framing
- validated panel

---

# 19. Repair ledger

각 attempt:

```json
{
  "attempt": 2,
  "inputSvgSha256": "...",
  "errors": [],
  "repairActions": [],
  "outputSvgSha256": "...",
  "layoutSha256": "...",
  "status": "..."
}
```

---

# 20. Stagnation

중단 조건:

- same final SVG hash
- same layout hash
- same error set
- no improvement
- cyclic repair action

상태:

`POLISH_REQUIRED`
또는
`LAYOUT_STAGNATION`

---

# 21. Immutable attempt directory

경로:

```text
archive/_generated/geometry-visual-engine/
  <run-id>/
    <asset-id>/
      attempt-01/
      attempt-02/
      attempt-03/
```

각 attempt immutable.

덮어쓰기 금지.

---

# 22. AssetId

canonical UID를 그대로 filename으로 사용하지 않는다.

안전한:

`assetId = digest(questionUid + surface + visualAssetKey)` (revision은 planSha256로 별도 결박)

방식.

실제 algorithm/version은 contract로 고정.

---

# 23. Attempt artifacts

최소:

```text
request.json
resolved.json
plan.json
math/
typography/
measurement/
layout/
visual.svg
static-audit.json
browser-audit.json
repair.json
result.json
```

같은 정보를 여러 authority 파일로 중복 저장하지 않는다.

---

# 24. Result reducer — 단일 판정 소유자

runner reducer만 상위 상태를 계산한다. enum과 전이 조건은 `production/contracts.json`에 두고 D07/D08 및 component는 참조한다. 개별 component의 내부 PASS/QUALIFIED는 최종 `PUBLICATION_READY`가 아니다.

reducer는 각 축의 결과와 실제 artifact SHA/ref를 함께 소비한다. request mode와 capability/profile에서 required axes를 먼저 resolve한다. required인 축을 producer가 임의로 NOT_APPLICABLE로 바꿀 수 없다. 누락/불일치는 non-ready로 남긴다. source 오류·math/static 오류·환경 부재·화면 polish는 상세 errorCode/firstMissingClosureStep로 구분한다.

---

# 25. Result axes

```json
{
  "input": "...",
  "sourceCoverage": "...",
  "math": "...",
  "typography": "...",
  "measurement": "...",
  "layout": "...",
  "artifactAudit": "...",
  "browser": "...",
  "archive": "...",
  "review": "..."
}
```

각 축:

- PASS
- FAIL
- NOT_RUN
- NOT_APPLICABLE

---

# 26. 상위 상태 — D05/D07/D08 공통 enum

- `NEEDS_INPUT`
- `VISUAL_EXEMPT`
- `UNSUPPORTED_CAPABILITY`
- `TOOLCHAIN_UNAVAILABLE`
- `STATIC_AUDIT_FAIL`
- `RENDER_PENDING`
- `POLISH_REQUIRED`
- `READY_FOR_ARCHIVE_CHECK`
- `READY_FOR_INDEPENDENT_REVIEW`
- `QUALIFICATION_COMPLETE`
- `PUBLICATION_READY`

| 조건 | 결과 |
|---|---|
| source/solution/branch/필수 fact-review 입력 미확정 | NEEDS_INPUT + 정확한 누락 범위 |
| mode/manifest/registry에서 미허용 capability | UNSUPPORTED_CAPABILITY + exact reason |
| math/static hard FAIL | STATIC_AUDIT_FAIL + 원래 component errorCode |
| 필수 toolchain 부재 | TOOLCHAIN_UNAVAILABLE; 선택적 후기 browser/capture 미실행은 RENDER_PENDING으로 상세 구분 |
| 수리 가능한 시각 품질 문제 또는 독립 review의 미해결 visual 결함 | POLISH_REQUIRED; 수학 오류는 이 상태로 숨기지 않음 |
| 필수 machine/browser PASS, Archive 미완 | READY_FOR_ARCHIVE_CHECK |
| machine/browser/Archive PASS, 독립 review 미완 | READY_FOR_INDEPENDENT_REVIEW |
| QUALIFICATION + 해당 end-to-end case의 모든 applicable 필수축/독립 review PASS | QUALIFICATION_COMPLETE, qualificationStatus=PASS; PUBLICATION_READY 금지 |
| PRODUCTION_CANDIDATE + 유효한 동일 engine Seal/ACTIVE + 요청별 모든 필수축/Archive/독립 review PASS | PUBLICATION_READY |

EXEMPT/RASTER/KEEP는 별도 필요성·source/control 검증 범위를 보존하고 새 SVG end-to-end 성공으로 계산하지 않는다. `RASTER_KEEP`는 capability/action이지 별도의 신규 최상위 status가 아니다.

L0/L1 등 일부만 실행한 qualification은 해당 test/axis의 PASS를 남기되 end-to-end `QUALIFICATION_COMPLETE`나 engine Seal을 선언하지 않는다. result의 `qualificationStatus`는 mode가 QUALIFICATION일 때 해당 manifest case의 요구범위를 평가하며, 전체 engine qualification과 구분한다.

Detail 05만 구현된 시점의 최대 준비 상태는 실제 연결된 범위에 따라 READY_FOR_ARCHIVE_CHECK 또는 READY_FOR_INDEPENDENT_REVIEW다. 문서가 존재한다는 이유로 후기 축을 PASS하지 않는다. 모든 mode에서 `productionAuthorized=false`를 유지한다.

---

# 27. productionAuthorized

항상:

```json
{ "productionAuthorized": false }
```

runner 완료가 production exam write 권한을 주지 않는다.

---

# 28. Cache 계층

cache를 단계별로 분리.

- resolution cache
- math/model cache
- typography fragment cache
- measurement cache
- layout cache
- static audit cache
- browser render cache

---

# 29. Cache authority

파일 존재만으로 cache hit 아님.

필수:

- input SHA
- profile SHA
- dependency version/hash
- environment SHA
- output SHA

일치.

---

# 30. Math cache

key:

```text
math input projection SHA
+ kernel/adapter implementation closure SHA
+ numeric policy
# 전체 plan/source/solution identity는 별도 provenance/evidence binding
```

---

# 31. Typography cache

Detail 03 §24의 **owner-bound LabelFragment cache**를 그대로 사용한다.

```text
semantic label SHA
+ questionUid / surface / visualAssetKey / panelId / labelId / occurrence
+ owner / ownerKind / factRole
+ typography profile SHA / font artifact SHA
+ renderer version+hash / serializer+namespace schema version
```

같은 숫자여도 owner/UID/instance가 다르면 별도 fragment다. placement transform은 frozen fragment 바깥 wrapper에만 있으므로 cache key에서 제외한다. owner와 local ID를 cache hit 뒤 덮어쓰지 않는다. owner-free glyph cache 분리는 v1 필수 작업이 아니다.

---

# 32. Measurement cache

D03 §25와 동일한 key:

```text
exact owner-bound fragment SHA
+ measurement environment SHA
+ target scale / display context
```

fragment identity/namespace/owner가 변경되면 새 fragment와 해당 measurement를 만든다. label 위치만 바뀌면 동일 fragment의 intrinsic metrics는 재사용하고 placement/collision 이후만 다시 본다.

---

# 33. Layout cache

Detail 04 정의 사용.

---

# 34. Render cache

최소:

```text
final SVG SHA
+ runtime bundle SHA
+ browser version
+ viewport
+ publication profile
```

---

# 35. Invalidation

## source change

무효화:

거의 전체 downstream.

---

## solution change

영향 math facts 이후 전체.

---

## math model change

typography 중 geometry-independent label은 일부 재사용 가능.

layout/render는 영향 범위 재실행.

---

## font change

math model 재사용.

typography부터 무효화.

---

## label placement change

model/fragment 재사용.

layout 이후만 재실행.

---

# 36. render-impact 재사용

`pipeline-core/render-impact.mjs`의 signature/invalidator 개념 재사용.

runner 자체에서 다른 비슷한 impact schema를 만들지 않는다.

---

# 37. global invalidator

예:

- Archive CSS
- runtime
- font
- MathJax
- viewport policy
- render policy

변경 시 해당 render cache 무효화.

---

# 38. Runtime dependency closure

`pipeline-core/runtime.mjs` 재사용.

browser evidence가:

- engine
- CSS
- JS runtime
- fonts
- MathJax
- final asset

과 결속되도록 한다.

---

# 39. Resume

중간에 browser/toolchain unavailable이면
완료된 deterministic 단계는 보존.

예:

```text
math PASS
typography PASS
layout PASS
browser unavailable
```

결과:

`RENDER_PENDING`

다음 실행에서 browser부터 resume 가능.

---

# 40. Resume safety

resume 전:

- source SHA
- plan SHA
- dependency hash
- fragment hash
- layout hash

재확인.

변경됐으면 stale checkpoint 무효화.

---

# 41. Toolchain unavailable

예:

- browser 없음
- font tool 없음
- MathJax SVG adapter 없음
- SymPy dependency 없음

상태:

`TOOLCHAIN_UNAVAILABLE`

fallback으로 legacy PASS하지 않는다.

---

# 42. Error taxonomy

runner error는 크게:

- INPUT
- SOURCE
- MATH
- CAPABILITY
- TYPOGRAPHY
- LAYOUT
- STATIC_AUDIT
- BROWSER
- ARCHIVE
- REVIEW
- INFRA

로 분류.

---

# 43. Exact error reporting

result에:

```json
{
  "errorCode": "...",
  "stage": "...",
  "component": "...",
  "firstMissingClosureStep": "...",
  "repairable": false
}
```

포함.

---

# 44. Logging

장문의 stdout 로그를 authority로 삼지 않는다.

각 stage는 machine-readable receipt를 남긴다.

console은 compact summary만.

---

# 45. Determinism

같은:

- request
- source
- solution
- plan
- dependency versions
- browser/runtime profile

이면 동일 stage artifact를 목표로 한다.

browser screenshot bytes는 환경 차이가 있을 수 있으므로
완전 동일성 요구 범위는 profile에서 명시.

---

# 46. Concurrency

같은 questionUid + surface + plan SHA에
동시 write 금지.

runner-level lock/lease 필요.

---

## 46.1 generated-only write

runner가 쓸 수 있는 곳:

`archive/_generated/geometry-visual-engine/...`

production exam JS/SVG 직접 write 금지.

---

# 47. Existing worktree safety

runner는 Git 조작 도구가 아니다.

- commit
- merge
- push

하지 않는다.

artifact production만 담당.

---

# 48. Browser cost control

browser는 expensive stage.

실행 조건:

- math PASS
- typography PASS
- static audit PASS
- layout candidate 존재

이전 fail이면 browser skip.

---

# 49. Shared browser context

가능하면:

- MathJax loaded
- font loaded
- reusable Playwright context

를 활용.

단 contamination/state leakage 방지.

---

# 50. Run budget

각 stage에 bounded budget.

예:

- math node timeout
- typeset timeout
- browser page timeout
- repair max 3

무한 retry 금지.

---

# 51. One-click does not mean blind retry

같은 입력/같은 실패를 반복하지 않는다.

retry는:

- materially different repair action
- stale dependency refresh
- transient infra error

일 때만.

---

# 52. Request contract versioning

VisualRequest schema version이 바뀌면
old request를 silent reinterpret하지 않는다.

adapter/migration 필요.

---

# 53. Capability support matrix

registry에는 capability/op/profile/dependency와 실제 qualification/Seal refs를 함께 둔다. `implemented`와 `effectiveActivation`은 다르다. 이 문서에서 어떤 row도 현재 ACTIVE로 선언하지 않는다.

- 일반 candidate: 동일 capability implementation/dependency fingerprint의 유효 Seal과 정확히 맞는 ACTIVE 조합만 실행한다.
- qualification: §4.3의 frozen manifest에 포함된 구현 완료 EXPERIMENTAL/ACTIVE 조합만 실행한다. 미구현/disabled/범위 밖은 거부한다.
- 파서 또는 builder만 구현되었거나 auditor/Archive/review가 빠진 capability는 일반 ACTIVE가 아니다.
- `NUMBER_LINE/COMPOSITE_PANEL/SPECIAL_VISUAL` 같은 지원 후보도 독립 required gate 없이 자동 승격하지 않는다.

Seal 전에는 QUALIFIED matrix를 동결한다. Seal은 그 matrix를 참조하고, **ACTIVE는 유효 Seal에 결박된 activation projection**으로 계산한다. matrix의 hashed bytes를 나중에 ACTIVE로 덮어쓰지 않는다. 상세는 D08 §90–92.

---

# 54. Capability registry / 공통 계약 소유권

`archive/tools/geometry-equation/production/contracts.json`을 단일 소유자로 사용한다.

포함: VisualRequest/FrozenVisualPlan, capability/profile routing, mode별 실행 허용, required axes, result enum/reducer 조건, dependency/schema version.

D01의 typed op 및 ConstructionGraph schema, D02의 GraphPlan/domain/numeric policy는 각 전문 schema에 위임하며, contracts에서 복제하지 않고 version/hash로 참조한다. qualification matrix·Seal·activation evidence는 별도 immutable 결과물이며 이 설정 파일의 수동 PASS 문자열을 authority로 삼지 않는다.

---

# 55. Stage order

canonical:

```text
RESOLVE
PLAN
MATH
TYPESET
MEASURE
LAYOUT
COMPOSE
STATIC_AUDIT
BROWSER_AUDIT
ARCHIVE
REVIEW
REDUCE
```

`PLAN` 안에는 semantic planning → D01/D02 executable normalization → freeze → source/fact evidence 확인 → mode별 capability 허용 확인을 둔다. 별도 사람 간 수동 JSON 전달 단계나 중복 math review pipeline을 만들지 않는다. 초기에 미지원임을 알 수 있으면 비싼 실행 전에 반환한다.

`REDUCE`는 component 결과를 보존하며, qualification mode는 같은 ARCHIVE/REVIEW 경로를 쓰되 공개 준비 상태로 승격하지 않는다.

---

# 56. Stage skipping

NOT_APPLICABLE만 skip.

예:

RASTER_KEEP이면 construction 불필요.

하지만 required typography를 단순히 skip하면 안 됨.

---

# 57. Special visual

SPECIAL path도 common QA를 거친다.

handcrafted SVG라고 publication-ready 자동 승인 금지.

---

# 58. Raster keep

source raster가 충분하면
runner가 SVG 재제작을 강제하지 않는다.

결과:

`RASTER_KEEP`

로 별도 artifact audit 경로.

---

# 59. VISUAL_EXEMPT

visual benefit이 없으면:

`VISUAL_EXEMPT`

이 정상 완료 상태.

무조건 SVG를 하나 생성하는 것이 목표가 아니다.

---

# 60. Output root contract

기존 `resolve_output`/generated-only policy 재사용.

path traversal/production write 금지.

---

# 61. Hash binding

각 stage artifact:

- input SHA
- output SHA
- dependency SHA
- stage version

을 기록.

---

# 62. Final freeze

최종 candidate 선택 후:

- visual.svg
- layout
- profile
- plan
- audits

를 immutable freeze.

freeze 뒤 수리하면 새 attempt.

---

# 63. Preview

runner는 preview를 만들 수 있지만
preview가 authority는 아니다.

authority:

final SVG bytes + audits.

---

# 64. One-click result summary

사용자/worker에게는 compact:

```text
status
questionUid
capability
attempts
finalSvg
remainingIssues
nextStep
```

만 노출 가능.

---

# 65. 신규 파일

## `production/run.mjs`

주 orchestrator.

---

## `production/resolve-request.mjs`

UID/source/solution resolution.

---

## `production/contracts.json`

request/stage/result/support matrix.

---

## `production/result-reducer.mjs`

작아지면 run.mjs 안에 둬도 됨.

별도 파일 남발 금지.

---

## `production/cache.mjs`

cache 책임이 커질 경우에만.

---

# 66. 기존 파일 수정

## `build-visual-candidate.mjs`

기존 `--facts` 유지.

신규 explicit `--request` path는
runner로 delegate.

---

## `entrypoints.py`

production-v2 visualSpec/profile 수용.

기존 STANDARD/SPECIAL/LEGACY 보존.

---

## `engine.py`

pure component 유지.

runner-specific IO/repair 넣지 않음.

---

## `render-impact.mjs`

adapter 추가만.

---

## `runtime.mjs`

runtime bundle 재사용.

---

## `question-uid.mjs`

canonical UID / safe asset mapping 연결.

---

# 67. 구현 단계

## Phase 0 — contracts freeze

고정:

- VisualRequest
- stage order
- result state
- artifact directory
- capability registry

---

## Phase 1 — resolve runner skeleton

구현:

- run id
- asset id
- attempt dir
- request/read/write
- generated-only policy

---

## Phase 2 — math capability dispatch

Detail 01/02 연결.

종료:

geometry와 graph가 동일 runner에서 분기.

---

## Phase 3 — typography/layout dispatch

Detail 03/04 연결.

---

## Phase 4 — static audit chain

각 capability audit receipt 수집.

---

## Phase 5 — browser audit

rendered layout 연결.

---

## Phase 6 — bounded repair

visual-only errors max 3.

---

## Phase 7 — cache/invalidation/resume

stale checkpoint fail-closed.

---

## Phase 8 — result reducer

status 자동 계산.

## 조기 통합 순서 보완

Phase 0에서 D07과 동일 request/plan 예시, qualification mode, cache identity, coordinate routing을 함께 고정한다. geometry 1건 + graph 1건의 UID→planner→normalizer→runner 경로를 먼저 연결한다. D03/D04가 준비되면 이 두 건을 실제 Archive까지 확장한 뒤 지원 유형을 늘린다. 8개 Detail을 전부 구현한 다음 최초 통합하지 않는다.

---

# 68. 최소 runner fixtures

1. geometry clean first-pass
2. graph clean first-pass
3. label collision → relocation
4. collision → dimension/leader
5. framing repair
6. stagnation
7. math error non-repairable
8. browser unavailable resume
9. stale source invalidation
10. font change partial invalidation
11. cache hit exact reuse
12. unsupported capability
13. visual exempt
14. special visual common QA
15. wrong UID
16. duplicate concurrent run

---

# 69. Negative tests

- production path write attempt
- path traversal
- stale plan reuse
- same attempt overwrite
- changed source resume
- fake PASS receipt
- missing stage artifact
- output SHA mismatch
- dependency hash mismatch
- repair count >3
- math failure marked repairable
- browser fail ignored

---

# 70. Internal completion gate

Detail 05 완료 상태:

`ONE_CLICK_RUNNER_QUALIFIED`

의미:

- request
- dispatch
- capability chain
- cache
- repair
- result

가 자동화됨.

하지만 actual Archive/review가 아직 Detail 06/08에 남아 있다면
전체 `PUBLICATION_READY` 아님.

---

# 71. 완료 기준

- [ ] 문항 UID 하나로 runner가 시작된다.
- [ ] 사용자가 별도 facts 파일을 수동 생성하지 않아도 된다.
- [ ] geometry/graph capability를 deterministic하게 dispatch한다.
- [ ] Detail 01~04 artifact를 한 chain에서 소비한다.
- [ ] 각 stage는 immutable receipt/hash를 남긴다.
- [ ] browser 전 static fail을 차단한다.
- [ ] visual-only repair와 math failure를 구분한다.
- [ ] bounded repair max 3을 지킨다.
- [ ] stagnation을 검출한다.
- [ ] source/font/runtime 변경에 정확한 invalidation이 있다.
- [ ] resume이 stale artifact를 재사용하지 않는다.
- [ ] generated-only write를 강제한다.
- [ ] 기존 `--facts` candidate path는 호환된다.
- [ ] `visual-repair.mjs`를 layout repair로 오용하지 않는다.
- [ ] result reducer가 최종 상태를 계산한다.
- [ ] component self-report만으로 PUBLICATION_READY가 되지 않는다.
- [ ] productionAuthorized=false 유지.
- [ ] same frozen input의 deterministic output을 확인한다.
- [ ] unsupported/toolchain unavailable이 false PASS로 바뀌지 않는다.
- [ ] runner 완료만으로 main merge/write 권한을 주지 않는다.

---

# 72. 이 단계에서 하지 않는 것

- actual Archive integration 완결
- independent human review
- production asset 자동 교체
- Git commit/push
- interactive editor
- background daemon
- infinite retry
- global provider audit 중복 생성
- 모든 visual을 SVG로 강제
- capability 미지원 자동 fallback
- 기존 candidate CLI 삭제

---

# 73. 후속 세부계획과 인터페이스

Detail 05 output:

```text
VisualRequest
ResolvedRequest
FrozenVisualPlan
AttemptLedger
StageReceipts
FinalCandidate
RunnerResult
```

### Detail 06 — Actual Archive Integration

runner의 final candidate를 실제 Archive desktop에 연결하고
asset/runtime/screenshot evidence를 닫는다.

### Detail 07 — Problem → Visual Request

planner/resolver의 source/solution 이해를 더 구체화한다.

### Detail 08 — Qualification & Seal

전체 system qualification과 independent review를 닫는다.

---

# 74. 최종 한 문장

> **APMath One-Click Runner v1은 새로운 수학/조판 알고리즘을 만드는 계층이 아니라, Construction·Graph·Typography·Measured Layout capability를 하나의 versioned request와 immutable attempt 흐름으로 묶고, static/browser 검증·부분 캐시·bounded repair·명시적 failure state까지 자동으로 끝내는 production orchestrator다.**

---

# 75. 구현 전 확정: 실행·hash·cache·불변 저장 계약

## 75.1 Node/Python wire와 hash authority

기존 Python `json.dumps(sort_keys=True)`와 PC `canonicalJson`은 같지 않다. 예를 들어 Python의 1.0/-0.0/decomposed Unicode는 PC의 1/0/NFC와 다르며 PC hash에는 `sha256:` prefix가 있다. **새 공통 object hash는 Node의 PC canonical serializer 한 곳에서 계산**한다. Python은 typed JSON payload와 자기 raw output bytes를 반환하고, Node가 validate/canonicalize하여 canonical object blob을 freeze한다. Python/독립 observer가 binding을 검사할 때는 그 frozen blob의 raw bytes SHA를 확인한다. 별도로 객체 hash를 재구현해야 한다면 양 언어 conformance vectors를 먼저 통과해야 한다.

새 bound file ref는 PC와 호환되는 `{path, bytes, sha256}`다. 문서의 `{path,sha256}`는 축약 표기이며 실제 wire에는 bytes가 필수다. semantic plan payload의 hash와 JSON 파일 bytes hash를 구분한다. 기존 GE bare-hex/Python canonical hash는 versioned legacy field로 보존하고 adapter가 검증한 후 새 ref로 감싼다. prefix만 추가하여 같은 object hash로 재해석하지 않는다. NaN/Infinity/정밀도 초과 숫자는 거부하고 exact rational/대형 정수는 typed 문자열로 전달한다. raw source bytes는 NFC로 바꾸지 않는다.

`planSha256`는 전체 frozen plan의 identity다. root plan의 hash 제외 규칙은 하나만 존재한다. child ref/file path는 locator로서 plan에 포함된 경우 그대로 hash되며, 순수 계산 cache의 semantic projection에서는 제외할 수 있다. hash 순환을 막기 위해 SVG metadata에 넣는 layout/metrics object에는 screenshot/time/run/후속 review refs를 포함하지 않는다.

## 75.2 deterministic 범위와 input projection

LLM fresh planning 자체의 byte determinism은 보장하지 않는다. provider/model/prompt/schema/policy/input과 raw output을 기록하고 **검증 후 고정된 plan부터** deterministic replay를 보장한다. 같은 source의 새 planning 실행은 새 revision이고, reproducibility test는 frozen plan replay와 planner 품질 평가를 구분한다.

각 stage key는 `stage implementation closure + schema/policy/dependency + 실제 소비 input projection`의 hash다. 전체 plan SHA는 provenance이지 모든 cache key가 아니다. math key에 label/font/display intent를 넣으면 label-only 변경에도 math cache가 깨진다. graph branch/constraint/normalization refs는 math projection에 포함한다. viewBox가 변하면 graph screen sampling이 영향받는다.

계산 cache hit와 review reuse는 다르다. immutable output bytes가 같아도 source authority·required gates·observer/rule version·review lifecycle이 달라지면 해당 audit/review를 새로 닫는다. 감사기 코드도 dependency다. 단계 receipt는 component self-report PASS 대신 실제 input/output/ref 검증을 거친다. cache를 전부 끈 cold build를 정확성 reference로 두고 warm build 결과를 대조한다.

## 75.3 저장·동시성·resume

`assetId`는 stable `questionUid + surface + visualAssetKey`에서 계산하고 plan revision은 별도 `planSha256`로 둔다. same UID의 여러 visual/panel 출력 충돌을 방지한다. 한 요청에 최초 build + repair 최대 3회이므로 최대 4 candidate revision이며, attempt 번호 자체를 content hash에 넣지 않는다.

stage는 임시 staging directory에 쓰고 output 검증 후 manifest를 마지막으로 원자적으로 commit한다. committed manifest가 없는 partial output은 cache/ready가 아니다. append-only 파일 쓰기만으로 여러 파일의 완료 transaction이 보장되지는 않는다. durable checkpoint journal은 별도이고 committed attempt/result는 덮어쓰지 않는다. resume은 새 downstream evidence/result ref를 만들고 이전 결과를 supersede한다.

request/output 충돌과 content-cache key별 writer를 구분해 잠근다. 기존 OS lock/recovery 원칙을 재사용하되 이 artifact build 때문에 새 provider work-batch job을 만들지 않는다. timeout/취소 시 worker/browser/server를 finally에서 회수하고 crash-injection으로 stage 중간/commit 직전/직후를 확인한다. generated-only 검사는 resolved realpath와 symlink/junction도 확인하며 lexical prefix만 믿지 않는다.

## 75.4 실행과 repair의 단일 소유자

TYPESET/MEASURE가 browser를 필요로 하면 해당 stage부터 browser를 쓸 수 있다. §48의 static 선행조건은 **최종 BROWSER_AUDIT/Archive capture**에 적용하고 사전 measurement를 금지하지 않는다. standalone·Archive·후기 visual repair는 하나의 repair ledger/count를 소비한다. 일관된 새 input revision과 side effect receipt로 duplicate dispatch/retry를 구분한다.

Source/fact review 및 최종 review 호출은 D07의 기존 parent continuation/provider adapter를 사용한다. runner가 새로운 독립 reviewer identity를 발급해 PASS하지 않는다. registry/Seal은 승인된 source에서 resolve하고 사용자 요청이 arbitrary Seal 경로를 지정해 활성화하지 못하게 한다.

추가 회귀: JS/Python hash vectors, raw/file/object hash 혼용, label-only math cache hit, verifier-only audit invalidation, crash/concurrent writer, partial manifest, browser-measure bootstrap, 네 번째 repair 거부, stale approval/revocation, frozen plan replay.
