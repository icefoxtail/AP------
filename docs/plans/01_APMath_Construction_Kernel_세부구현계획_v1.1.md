# APMath Construction Kernel 세부 구현계획 v1.1

> **상위 재검토 반영 기준:** `0bb88da58e41ae1154911d4e711f6247e60e5f16`. 본문의 기존 조사 이력은 보존한다. 이번 재검토의 최종 결정은 마지막 추가 절과 [검토 보고서](APMath_Construction_Visual_Production_아키텍처재검토_2026-10-05.md)에 기록하며, 해당 항목은 앞선 초안의 포괄적 표현보다 우선한다. 제품 코드·신규 engine qualification은 이번 변경 범위가 아니다.

**상위 문서:** `APMath Construction & Visual Production Engine — 최종 구현 계획서`  
**문서 역할:** Detail 01 / Construction Kernel  
**작성일:** 2026-10-05 (Asia/Seoul)  
**상태:** **통합검토 보완 반영 · 계획 v1.1 · 이번 작업 제품 코드 변경 0**  
**v1.0 원문 조사 기준(이력 보존):** `origin/main @ b08ba2db04ba3be4d172b718aee29e169f8655d3`

**통합 보완 기준 main:** `3a7b2cb712fb192f3728f4df4a7ccc1e99d79427`  
**개정일:** 2026-10-05 (Asia/Seoul)  
**반영 이슈:** I-01, I-05  
**적용 관계:** 같은 Detail v1.0의 해당 계약/예시를 v1.1 본문으로 대체한다. 공통 요청·routing·상태의 단일 소유자는 Detail 05 §4/6/7/24–26/53–54다. 원문의 “현재 main 구현” 설명은 원 조사 시점 기록이며 이번에 전체 코드를 다시 조사했다는 뜻이 아니다. 이 문서의 test/qualification checklist는 구현 후 수행할 요구사항이고, 문서 보완은 실행 PASS·ACTIVE·PUBLICATION_READY·Seal 선언이 아니다.

---

## 0. 이 문서의 목적

이 문서는 상위 마스터 계획의 첫 번째 세부계획으로, APMath Visual Production Engine의 **정적 수학 작도 계산 계층**을 실제 구현 가능한 수준까지 구체화한다.

목표는 새 기하 수학 공식을 APMath 내부에서 계속 직접 확장하는 것이 아니다.

> **SymPy Geometry를 주 construction kernel로 사용하고, CindyJS를 독립 numeric cross-validator로 사용하며, APMath는 typed construction graph · source binding · branch 정책 · publication adapter · independent artifact audit만 소유한다.**

최종 출력 SVG는 SymPy나 CindyJS의 renderer가 만들지 않는다. 계산이 끝난 `ConstructionSnapshot`만 기존 APMath visual/publication 계층으로 전달한다.

이 문서는 **Construction Kernel만** 다룬다. 다음은 별도 세부계획의 책임이다.

- 함수 그래프·좌표축 publication
- MathJax SVG 및 Korean font 조판
- 실측 기반 label layout
- One-Click runner
- actual Archive integration
- 문항 → VisualRequest planning
- 전체 qualification / seal

---

# 1. 구현 결정

## 1.1 주 계산 엔진 — SymPy Geometry

역할:

- 정확한 점·직선·선분·원 객체 생성
- 중점 / 내분·외분
- 수선의 발
- 평행선 / 수선
- 각의 이등분선
- 직선-직선 / 직선-원 / 원-원 교점
- 3점 원
- 접선 / 접점
- 지원 범위 내 정적 변환
- Rational / radical 등 exact expression 보존
- 필요한 경우 bounded `evalf`로 publication용 finite coordinate 생성

원칙:

- 자유 문자열 `sympify`, `eval`, 임의 Python 실행 금지
- APMath가 허용한 AST와 typed op만 SymPy 호출로 변환
- unsupported / undecidable / timeout을 기존 float kernel로 조용히 fallback하지 않음

## 1.2 독립 cross-validator — CindyJS

역할:

- SymPy 최종 좌표를 입력받아 확인하는 검산기가 아님
- 같은 frozen source primitive input과 같은 typed operation 의미를 **별도 구현으로 다시 구성**
- branch / finite-real / 관계 / 퇴화 여부 대조
- SymPy producer helper 또는 결과 좌표 재사용 금지

예:

```text
수선의 발 H
SymPy: Line.projection(P)
CindyJS: Perp(P, line) → Meet(originalLine, perpendicularLine)
```

즉 계산 경로가 달라야 한다.

## 1.3 기존 APMath numeric geometry

기존 `archive/tools/geometry-equation/visual_engine/geometry_model.py`는 폐기하지 않는다.

역할은 다음으로 제한한다.

1. legacy visualSpec 호환
2. model → screen projection 전후의 가벼운 numeric utility
3. 기존 semantic validation
4. final SVG primitive 관측과 residual check
5. 독립 audit에 필요한 기존 검증 로직

**신규 construction 수학 공식을 계속 추가하는 주 kernel 역할에서는 분리한다.**

## 1.4 JSXGraph

이번 Construction Kernel v1의 production runtime에는 넣지 않는다.

이유:

- 정적 exact construction의 주 계산은 SymPy로 충족
- 독립 headless peer는 CindyJS로 확보
- 세 번째 geometry runtime과 DOM compatibility를 추가할 이득이 현재 범위에서 작음

향후 interactive drag/editor가 제품 요구가 되면 별도 재평가한다.

---

# 2. 현재 main의 실제 상태

## 2.1 `geometry_model.py`

현재 존재:

- `Line`
- `Circle`
- `line_from_two_points`
- `line_intersection`
- `parallel_check`
- `perpendicular_check`
- `point_line_distance`
- `point_on_line`
- `foot_of_perpendicular`
- `midpoint`
- `internal_division`
- `external_division`
- `circle_line_intersections`
- `circle_circle_intersections`
- `tangent_check`
- `clip_line`

즉 기본 numeric geometry는 이미 있다. 하지만 이 모듈은 **dependency graph를 실행하는 construction kernel이 아니다.**

## 2.2 `semantic_model.py`

현재 `semantic_model.validate()`는:

- 이미 주어진 POINT 좌표 수용
- 이미 주어진 LINE coefficients 수용
- 이미 주어진 CIRCLE center/radius 수용
- SEGMENT endpoint 수용
- 관계가 맞는지 검증

예를 들어 `INTERSECTION`은 두 line의 교점을 계산한 뒤, **이미 spec에 존재하는 target POINT 좌표와 비교**한다.

즉 관계를 실행해서 target point를 생성하는 것이 아니라, 이미 들어온 좌표가 관계를 만족하는지 확인한다.

신규 Construction Kernel은 이 앞단에서 실제 DERIVED object를 생성해야 한다.

## 2.3 `coordinate_evidence.py`

현재 `CONSTRUCTED_REALIZATION`은 다음을 강하게 검사한다.

- normalization
- pointCoordinates coverage
- conditions / tolerance
- residualChecks
- degeneracyChecks
- constructionSteps의 id/output coverage

하지만 `constructionSteps`의 `operation`은 실제 실행되지 않는다.

현재 계약은 다음을 검증하지 않는다.

- operation이 registry에 실제 존재하는가
- input id가 실제 node/constraint인가
- input type이 맞는가
- self-cycle인가
- 전체 graph가 DAG인가
- step의 출력이 실제 op 실행 결과인가
- branch 선택이 source 의미와 맞는가

따라서 신규 v2는 **문자열 ledger를 executable graph로 승격**하는 작업이 아니라, 새로운 typed graph를 만들고 실행 transcript를 evidence에 결박하는 작업이다.

## 2.4 현재 entrypoint

현재:

```text
build-visual-candidate.mjs
  → past_exam_adapter.build_candidate
  → entrypoints.build_independent
  → engine.build(spec)
```

이 경로는 **frozen visualSpec을 받아 SVG candidate를 만드는 경로**다.

신규 Construction Kernel은:

```text
Frozen ConstructionGraph
  → evaluate
  → ConstructionSnapshot
  → construction_adapter
  → existing visualSpec
  → existing builder
```

로 앞단에 들어간다.

기존 CLI와 legacy visualSpec은 깨지지 않아야 한다.

---

# 3. ConstructionGraph v1 계약

## 3.1 최상위 구조

```json
{
  "schemaVersion": "apmath-construction-graph-v1",
  "graphId": "...",
  "sourceRef": {},
  "solutionRef": {},
  "parameters": [],
  "nodes": [],
  "constraints": [],
  "sourceConditionCoverage": [],
  "displayBindings": []
}
```

## 3.2 Node 공통 필드

모든 node는 최소 다음을 가진다.

```json
{
  "id": "H",
  "op": "PERPENDICULAR_FOOT",
  "inputs": ["P", "l"],
  "args": {},
  "outputType": "POINT",
  "sourceRefs": [],
  "factRole": "DERIVED_INTERMEDIATE"
}
```

필수 원칙:

- `id` unique
- `op` closed registry
- `inputs`는 기존 node 또는 허용 parameter만 참조
- derived node의 좌표를 외부 `at` 필드로 덮어쓰지 않음
- `factRole`: `GIVEN / DERIVED_INTERMEDIATE / CONCLUSION`
- source entity 이름은 publication 단계까지 보존

## 3.3 입력 좌표의 세 종류

### SOURCE_INPUT

원문이 명시한 좌표·길이·수치.

- source SHA에 결박
- 임의 변경 금지

### FREE_PARAMETER

원문이 허용한 자유도.

필수:

- id
- domain
- 선택 rationale
- invariant conditions

publication 편의를 위해 몰래 값을 바꾸면 안 된다.

### DERIVED

construction op 결과.

- 외부 좌표 직접 입력 금지
- parent node + op + args + branch로만 결정

## 3.4 Planner → executable graph handoff

D07의 MathPlanSkeleton은 의미 초안이다. D01의 schema/normalizer가 sourceRefs, op/input/outputType, constraint 및 branch를 닫은 **ConstructionGraph**만 D05 FrozenVisualPlan.mathPlan으로 전달한다. 이 정규화 책임은 기존 제안 construction_graph.py/schema 계층에 두고 별도 수학 backend를 만들지 않는다.

정규화 중 source/branch 의미를 추측하거나 DERIVED 좌표를 생성하지 않는다. 필요한 의미 입력이 없으면 NEEDS_INPUT, 미지원 op는 UNSUPPORTED_CAPABILITY, 잘못된 타입/참조는 계산 전 schema 오류다. source/fact evidence의 승인 범위는 D05 §7.3에서 확인하고 typed schema PASS를 독립 검토로 취급하지 않는다.

---

# 4. Typed operation registry v1

## 4.1 Input / primitive

| Op | Output | SymPy |
|---|---|---|
| `SOURCE_POINT` | POINT | `Point` |
| `FREE_POINT` | POINT | `Point` |
| `SCALAR` | SCALAR | Rational / approved expression |
| `LINE_THROUGH_POINTS` | LINE | `Line(P,Q)` |
| `SEGMENT_BETWEEN_POINTS` | SEGMENT | `Segment(P,Q)` |
| `CIRCLE_CENTER_RADIUS` | CIRCLE | `Circle(center,r)` |
| `CIRCLE_CENTER_POINT` | CIRCLE | radius from center-point distance |

## 4.2 Derived point

| Op | Output | Primary implementation |
|---|---|---|
| `MIDPOINT` | POINT | Segment midpoint |
| `INTERNAL_DIVISION` | POINT | affine exact expression |
| `EXTERNAL_DIVISION` | POINT | affine exact expression |
| `PERPENDICULAR_FOOT` | POINT | Line projection |

## 4.3 Derived line

| Op | Output |
|---|---|
| `PARALLEL_THROUGH_POINT` | LINE |
| `PERPENDICULAR_THROUGH_POINT` | LINE |
| `ANGLE_BISECTOR_INTERNAL` | LINE |
| `ANGLE_BISECTOR_EXTERNAL` | LINE |

v1 이등분선의 입력은 순서가 있는 [A,V,B] 세 POINT이며 vertex=V, 출력은 LINE으로 고정한다. 내/외 의미와 방향 기준을 source/branch에 보존한다. RAY를 암묵 반환하지 않으며, 필요한 ray 표현은 별도 승인된 display intent로 처리한다. 내·외각 이등분선은 branch를 이름만으로 암묵 처리하지 않는다.

## 4.4 Intersection

| Op | 가능한 결과 |
|---|---|
| `INTERSECT_LINE_LINE` | EMPTY / UNIQUE / COINCIDENT / UNSTABLE |
| `INTERSECT_LINE_CIRCLE` | EMPTY / UNIQUE / TWO / UNSTABLE |
| `INTERSECT_CIRCLE_CIRCLE` | EMPTY / UNIQUE / TWO / COINCIDENT / UNSTABLE |

다해 결과를 `sorted()[0]`처럼 임의 선택하지 않는다.

교점 op의 typed output은 `POINT_INTERSECTION_RESULT`로 고정하며 `{state, candidates}`를 갖는다. candidates는 state에 따른 점들의 집합이지 POINT node가 아니다.

- 단일 점 소비는 `SELECT_POINT(inputs=[resultId], outputType=POINT, branch=...)`로만 한다.
- UNIQUE는 `branch.kind=UNIQUE`로 cardinality=1을 확인한다. TWO는 source에 근거한 의미 guard가 정확히 하나를 선택해야 한다.
- EMPTY/COINCIDENT/UNSTABLE 또는 두 점 모두 같은 guard를 만족하면 POINT로 변환하지 않는다.
- 후보 배열 index나 backend 반환 순서는 branch가 아니다. set 출력과 선택된 점의 nodeId를 분리한다.

## 4.5 Circle / tangent

| Op | Output |
|---|---|
| `CIRCLE_THROUGH_3_POINTS` | CIRCLE |
| `TANGENT_AT_POINT` | LINE |
| `TANGENT_CONTACTS_FROM_EXTERNAL_POINT` | POINT_PAIR |
| `TANGENT_LINES_FROM_EXTERNAL_POINT` | LINE_PAIR |

외부점이 원 안/위/밖인지 상태를 먼저 판정한다.

## 4.6 Static transform

v1 지원 후보:

- `TRANSLATE`
- `REFLECT_ACROSS_LINE`
- `ROTATE_ABOUT_POINT`
- `DILATE_ABOUT_POINT`

각 op는 GeometryEntity type을 보존해야 한다.

이 기능은 publication framing과 완전히 분리한다.

## 4.7 Pair와 selector의 고정 타입

`TANGENT_CONTACTS_FROM_EXTERNAL_POINT`는 POINT_PAIR, `TANGENT_LINES_FROM_EXTERNAL_POINT`는 LINE_PAIR다. pair를 단일 POINT/LINE input으로 직접 연결하지 않는다. `SELECT_POINT`는 POINT_INTERSECTION_RESULT/POINT_PAIR, `SELECT_LINE`은 LINE_PAIR를 받아 명시적 의미 branch를 만족하는 하나만 반환한다. external-point pair op에서 두 개가 아닌 상태는 명시적 cardinality/degeneracy 결과로 남기며 가짜 두 번째 객체를 만들지 않는다.

registry는 각 op의 input 개수·타입과 유일한 outputType을 소유한다. D05/D07은 이를 version/hash로 참조하고 별도 타입 정의를 만들지 않는다. source가 단일 해를 지정하지 않은 pair는 집합 관측은 가능하지만 임의 한 해의 downstream 소비는 거부한다.

---

# 5. Branch 계약

다해 construction은 반드시 의미 있는 branch를 고정한다.

허용 selector 예:

```json
{
  "branch": {
    "kind": "SIDE_OF_ORIENTED_LINE",
    "line": ["A", "B"],
    "side": "LEFT"
  }
}
```

또는:

- POSITIVE_X_DIRECTION
- NEGATIVE_X_DIRECTION
- ON_SEGMENT
- OUTSIDE_SEGMENT
- NEAREST_TO_POINT
- FARTHEST_FROM_POINT
- CLOCKWISE_FROM_RAY
- COUNTERCLOCKWISE_FROM_RAY

단, `NEAREST_TO_POINT` 같은 selector는 source/solution 의미가 실제로 그것을 요구할 때만 사용한다.

branch의 목적은 **기하 의미 고정**이지 deterministic sorting 편의가 아니다.

재계산 후 selector가 더 이상 성립하지 않으면 `BRANCH_CONDITION_FAIL`로 종료한다. 자동으로 다른 root를 선택하지 않는다.

---

# 6. Constraint 계약

지원 constraint v1:

- `INCIDENCE`
- `DISTANCE`
- `EQUAL_DISTANCE`
- `MIDPOINT`
- `RATIO`
- `COLLINEAR`
- `PARALLEL`
- `PERPENDICULAR`
- `CIRCLE_MEMBERSHIP`
- `TANGENCY`
- `ANGLE`
- `ORIENTATION`

각 constraint는 source reference와 tolerance policy를 가진다.

sourceConditionCoverage는 원문의 critical condition마다:

```text
source condition
→ graph node / constraint
→ snapshot observation
→ final primitive / annotation binding
→ review evidence
```

를 추적할 수 있어야 한다.

---

# 7. Precision / exactness 정책

## 7.1 Exact 우선

integer / rational / approved radical·exact expression은 SymPy exact 형태로 유지한다.

예:

```text
2*sqrt(6)
1/3
sqrt(3)/2
```

를 중간에서 float로 바꾸지 않는다.

## 7.2 Publication numeric coordinate

SVG materialization에는 finite numeric coordinate가 필요하다.

따라서 Snapshot에는 두 값을 구분한다.

```json
{
  "exact": "2*sqrt(6)",
  "numeric": 4.898979485566356
}
```

`numeric`은 display coordinate이고 `exact`가 mathematical provenance다.

## 7.3 Precision escalation

near-parallel / near-tangent / root coalescence에서:

1. exact comparison 가능 → exact 사용
2. bounded evalf precision escalation
3. 안정성 확보 실패 → `UNSTABLE`

오차 허용치를 넓혀 PASS하지 않는다.

## 7.4 Timeout / complexity

모든 SymPy call은 bounded 해야 한다.

필수:

- per-node timeout
- graph total budget
- expression size limit
- op-specific input count limit

timeout은 `KERNEL_TIMEOUT`으로 종료하며 기존 자체 float 계산으로 조용히 대체하지 않는다.

---

# 8. ConstructionSnapshot v1

Graph evaluation 성공 시 immutable snapshot을 만든다.

최소 필드:

```json
{
  "schemaVersion": "apmath-construction-snapshot-v1",
  "graphSha256": "...",
  "kernel": {
    "name": "sympy",
    "version": "1.14.0",
    "artifactHash": "..."
  },
  "nodes": {
    "H": {
      "type": "POINT",
      "inputs": ["P","l"],
      "op": "PERPENDICULAR_FOOT",
      "exact": ["2", "0"],
      "numeric": [2.0, 0.0],
      "branch": null,
      "dependencyHash": "..."
    }
  },
  "constraints": [],
  "degeneracy": [],
  "status": "PASS"
}
```

Snapshot은 builder evidence다. **독립 검산의 정답 파일로 사용하지 않는다.**

---

# 9. CindyJS 독립 cross-check

## 9.1 입력

CindyJS adapter가 받을 수 있는 것은:

- frozen graph schema
- source/free primitive inputs
- op 의미
- branch contract
- approved tolerance policy

받아서는 안 되는 것:

- SymPy final coordinates
- SymPy resolved branch result
- SymPy helper return object
- SymPy-generated expected residual

## 9.2 출력

`construction-crosscheck-v1` receipt:

```json
{
  "graphSha256": "...",
  "engine": "cindyjs",
  "engineVersion": "...",
  "nodeChecks": [],
  "constraintChecks": [],
  "branchChecks": [],
  "nonFinite": [],
  "status": "PASS"
}
```

## 9.3 Complex / projective 처리

CindyJS 내부 표현의 complex/projective 결과를 단순히 `.real`만 잘라 사용하지 않는다.

확인:

- imaginary magnitude
- homogeneous z
- duplicate root
- infinite point
- unstable branch

문제 발생 시 `NON_REAL_RESULT / POINT_AT_INFINITY / DUPLICATE_ROOT / UNSTABLE` 등으로 명시한다.

---

# 10. Graph → APMath visualSpec adapter

Construction Kernel의 final output은 SVG가 아니다.

```text
ConstructionSnapshot
→ construction_adapter.py
→ existing visualSpec
→ existing semantic_model
→ existing engine/publication
```

adapter 책임:

- POINT → `POINT.at`
- LINE → normalized coefficients
- SEGMENT → endpoints
- CIRCLE → center/radius
- source node id 보존
- factRole 보존
- display binding 보존
- coordinateEvidence v2 binding

금지:

- publication 단계가 derived coordinate를 이동
- label collision 해결을 위해 graph coordinate 수정
- viewBox를 model normalization으로 오해

## 좌표축이 있는 Euclidean geometry

D02의 `CoordinateGeometryPlan.constructionGraph`도 동일 kernel을 사용한다. publication은 `coordinate-geometry-publication-v1`으로 연결하며 axisSpec와 **하나의 equal-unit transform**을 공유한다. D02 axis/tick observer와 D01/final geometry observer가 모두 필요하다. 기존 geometry-publication-v1의 axis-free 규칙은 바꾸지 않는다.

함수 curve sampling을 ConstructionGraph로 합치지 않는다. 동일 축의 함수+Euclidean circle/angle 혼합은 이번 v1에서 명시적 미지원으로 두고, 단순 좌표기하 profile로 숨겨 처리하지 않는다.

---

# 11. Coordinate Evidence v2

기존 `CONSTRUCTED_REALIZATION` v1은 legacy로 유지한다.

신규 v2는 최소:

- graph SHA
- kernel version/hash
- source input set
- evaluated node transcript
- branch transcript
- constraint result
- degeneracy result
- snapshot SHA
- independent cross-check receipt SHA

를 결박한다.

즉 기존:

```text
constructionSteps = 설명 문자열 ledger
```

에서:

```text
ConstructionGraph
→ actual execution
→ immutable transcript
```

로 권위를 바꾼다.

v1과 v2를 같은 schema로 silent reinterpret하지 않는다.

---

# 12. 실패 상태

Construction Kernel은 아래 상태를 명시적으로 반환한다.

- `GRAPH_SCHEMA_INVALID`
- `UNKNOWN_OPERATION`
- `UNKNOWN_INPUT`
- `TYPE_MISMATCH`
- `GRAPH_CYCLE`
- `DUPLICATE_NODE_ID`
- `DERIVED_COORDINATE_OVERRIDE`
- `DEGENERATE_INPUT`
- `NO_INTERSECTION`
- `COINCIDENT_OBJECTS`
- `AMBIGUOUS_BRANCH`
- `BRANCH_CONDITION_FAIL`
- `NON_REAL_RESULT`
- `POINT_AT_INFINITY`
- `UNSTABLE`
- `KERNEL_TIMEOUT`
- `UNSUPPORTED_CAPABILITY`
- `CROSSCHECK_MISMATCH`

어떤 실패도 임의 좌표를 만들어 성공 처리하지 않는다.

---

# 13. Determinism / cache

## 13.1 Node cache key

최소:

```text
op name
+ op implementation version
+ canonical args
+ parent node dependency hashes
+ branch contract
+ numeric policy
+ kernel version/hash
```

## 13.2 Partial recompute

free/source parameter 변경 시:

1. reverse dependency index로 descendant closure 계산
2. 영향 node만 SymPy 재실행
3. 관련 CindyJS cross-check만 재실행
4. 영향 없는 독립 graph component 재사용

단, source SHA / kernel version / global precision policy가 바뀌면 해당 cache는 무효화한다.

---

# 14. 신규 파일

## 14.1 `visual_engine/construction_graph.py`

책임:

- closed op registry
- graph validation
- input/output type check
- `graphlib.TopologicalSorter`
- reverse dependency index
- descendant invalidation
- branch policy
- kernel adapter dispatch

**수학 공식 구현 금지.**

## 14.2 `visual_engine/construction_graph.schema.json`

책임:

- graph top-level schema
- node contract
- op enum/version
- branch contract
- constraint contract
- sourceConditionCoverage contract

## 14.3 `visual_engine/sympy_kernel.py`

책임:

- validated APMath node → SymPy call
- exact result normalization
- numeric projection
- bounded precision
- timeout / complexity limit
- known SymPy exceptional state를 APMath status로 변환

## 14.4 `visual_engine/construction_adapter.py`

책임:

- Snapshot → existing visualSpec
- coordinate provenance
- node id / owner / factRole preservation
- legacy semantic model 연결

## 14.5 `production/audit-construction-cindy.mjs`

책임:

- frozen graph + source primitive로 CindyJS independent reconstruction
- finite-real normalization
- branch/constraint cross-check
- receipt 생성

SymPy/producer helper import 금지.

## 14.6 Dependency lock

제안:

- `requirements-construction.txt`
- `construction-dependencies.lock.json`
- `archive/vendor/construction/cindyjs/`

고정해야 할 것:

- SymPy version
- mpmath version
- wheel/artifact hash
- CindyJS version
- bundle hash
- license / notice

전역 npm/Python 환경에 의존하지 않는다.

---

# 15. 기존 파일 수정

## `geometry_model.py`

- legacy 유지
- 필요한 snapshot normalization utility 정도만 보강
- 신규 construction formula 추가 금지

## `semantic_model.py`

- existing visualSpec validation 유지
- Snapshot adapter가 생성한 primitive와 관계 재검 가능하도록 versioned metadata 허용
- 기존 schema silent reinterpret 금지

## `coordinate_evidence.py`

- v1 유지
- executable graph v2 evidence 추가
- v1 constructionSteps를 graph로 취급하지 않음

## `math_expression.py`

- validated AST → SymPy exact scalar 변환
- exact vs numeric 명시
- arbitrary `sympify` 금지

## `entrypoints.py`

기존 STANDARD/SPECIAL/LEGACY를 보존하고, production runner가 construction adapter를 거친 visualSpec을 명시적으로 전달할 수 있게 한다.

---

# 16. 구현 단계

## Phase 0 — Dependency / baseline freeze

작업:

- 구현 시작 시 latest main SHA 고정
- SymPy/CindyJS 실제 배포 버전·hash·license 재확인
- 기존 geometry regression baseline 기록
- support matrix v1 고정

종료:

- dependency lock 존재
- repo-wide global install 없이 재현 가능
- legacy baseline 고정

## Phase 1 — Graph schema / validator

작업:

- `construction_graph.schema.json`
- typed registry
- DAG validation
- duplicate/missing/type/cycle check
- branch schema
- constraint schema

필수 negative:

- unknown op
- missing ref
- wrong input type
- self-cycle
- multi-node cycle
- derived coordinate override
- duplicate node id

종료:

**잘못된 graph는 kernel 호출 전에 모두 fail-closed.**

## Phase 2 — SymPy production adapter

작업:

- v1 지원 op 매핑
- exact result normalization
- multi-result intersection
- branch resolution
- degeneracy
- timeout/precision

종료:

- 지원 op마다 positive 1+
- 퇴화/오류 negative 1+
- exact expression 보존

## Phase 3 — CindyJS independent adapter

작업:

- 같은 frozen graph 의미를 CindyJS primitive construction으로 변환
- source primitive만 전달
- branch / relation / finite-real 검증
- per-run clean state 보장

종료:

- SymPy result를 복사하지 않고 동일 관계 재구성
- mutation test에서 producer 변조 검출

## Phase 4 — Snapshot / visualSpec adapter

작업:

- ConstructionSnapshot 생성
- node provenance
- factRole/source binding
- existing POINT/LINE/CIRCLE/SEGMENT materialization

종료:

- 동일 graph → 동일 snapshot
- 동일 snapshot → deterministic visualSpec
- 기존 semantic validation PASS

## Phase 5 — coordinate evidence v2

작업:

- graph SHA
- execution transcript
- constraint/degeneracy
- cross-check receipt
- final snapshot 결속

종료:

- operation/input/branch/node 결과 변조 시 FAIL
- v1 legacy fixture byte / behavior 보존

## Phase 6 — Integration gate

작업:

- existing builder 앞에 construction path 연결
- legacy frozen visualSpec path 유지
- candidate-only generated output 유지
- production write 금지

종료:

```text
ConstructionGraph
→ SymPy
→ CindyJS cross-check
→ Snapshot
→ visualSpec
→ current SVG candidate
```

가 한 번에 실행됨.

이 단계에서는 아직 typography/Archive publication 전체 PASS를 요구하지 않는다. 그것은 후속 세부계획의 책임이다.

---

# 17. 최소 회귀 행렬

## 17.1 Graph

- valid DAG
- unknown op
- missing input
- type mismatch
- self-cycle
- multi-node cycle
- duplicate output/id
- derived direct coordinate override

## 17.2 Point / line / circle

- midpoint
- internal division
- external division
- perpendicular foot
- parallel through point
- perpendicular through point
- angle bisector internal/external
- 3-point circle

## 17.3 Intersection

- line-line unique
- line-line parallel
- line-line coincident
- line-circle 0/1/2
- circle-circle 0/1/2
- coincident circles
- near tangent
- near parallel

## 17.4 Tangent

- tangent at circle point
- external point 2 tangents
- point on circle
- point inside circle rejection
- duplicate/unstable root

## 17.5 Transform

지원 선언한 op마다:

- nominal
- degenerate
- source relation preservation

## 17.6 Cross-validator

의도적 mutation:

- producer coordinate 변조
- branch 변조
- op 변조
- source point rename
- GIVEN ↔ CONCLUSION 변조

결과:

CindyJS / existing primitive observer 중 적용 가능한 독립 축이 반드시 FAIL.

## 17.7 전달 타입/branch 회귀

D07의 BC-foot intent → 정상 ConstructionGraph, 잘못된 AB input, result set을 POINT로 직접 소비, index-only branch, LINE/RAY 타입 혼용을 확인한다. 정상 교점 집합+명시적 selector와 0/1/2·모호한 guard를 구분한다. geometry 1건은 D05 runner까지 수동 JSON 교정 없이 연결한다.

---

# 18. 실제 문항 적용 범위

이 세부계획에서 전체 6문항 publication qualification을 닫지 않는다.

Construction Kernel 단계의 실제 문항 목적은:

- source coordinate case
- midpoint / perpendicular foot
- line-circle branch
- tangent construction

등에서 graph가 **원문 의미를 executable construction으로 바꾸고 다시 계산 가능한지** 확인하는 것이다.

글꼴, 최종 label layout, Archive desktop, human visual review는 후속 세부계획에서 닫는다.

따라서 이 단계의 PASS를 `PUBLICATION_READY`라고 부르지 않는다.

Construction 계층의 완료 상태는 내부 gate `CONSTRUCTION_KERNEL_QUALIFIED` 정도만 사용하고, 상위 result의 최종 READY 권한은 부여하지 않는다.

---

# 19. 완료 기준

아래가 모두 충족돼야 Detail 01 구현 완료다.

- [ ] SymPy Geometry가 신규 construction 계산의 주 kernel이다.
- [ ] APMath graph layer는 type/source/branch/policy만 소유하고 신규 기하 공식을 자체 재구현하지 않는다.
- [ ] typed graph가 unknown op/input/type/cycle을 실행 전에 거부한다.
- [ ] SOURCE_INPUT / FREE_PARAMETER / DERIVED가 구분된다.
- [ ] 다해 교점은 명시적 branch semantics를 가진다.
- [ ] exact scalar / radical provenance가 float로 조기 손실되지 않는다.
- [ ] timeout / unstable / unsupported가 false PASS로 바뀌지 않는다.
- [ ] CindyJS가 SymPy final coordinate 없이 같은 source graph 의미를 독립 재구성한다.
- [ ] cross-check mismatch는 node/constraint 단위로 추적된다.
- [ ] existing APMath semantic/final primitive audit가 별도 축으로 유지된다.
- [ ] ConstructionSnapshot과 executable evidence v2가 immutable hash로 결박된다.
- [ ] 동일 frozen graph + 동일 dependency version은 deterministic snapshot을 만든다.
- [ ] free parameter 변경의 정확한 dependency closure를 계산하며, node cache 활성화 시 해당 closure만 재계산한다. 초기 stage 단위 재계산은 §23에 따라 허용한다.
- [ ] 기존 legacy visualSpec / geometry regression이 깨지지 않는다.
- [ ] generated candidate 외 production exam/asset에는 write하지 않는다.
- [ ] 이 단계 완료만으로 PUBLICATION_READY를 주장하지 않는다.

- [ ] D07 skeleton을 executable typed graph로 닫는 normalizer 책임이 구현된다.
- [ ] intersection/pair output과 단일 point/line selector의 타입이 일의적이다.
- [ ] 이등분선 v1 outputType=LINE이며 source branch 의미가 보존된다.
- [ ] 좌표기하 publication은 기존 kernel + equal-unit + axis/tick 독립 관측을 사용한다.

---

# 20. 이 단계에서 하지 않는 것

- 함수 그래프·좌표축 publication 완성
- MathJax SVG 조판 완성
- Korean font embedding/outline 확정
- label metrics/placement 완성
- actual Archive desktop qualification
- problem text → graph를 LLM이 자동 작성하는 planner 완성
- interactive drag UI
- GeoGebra file import/export
- 범용 CAS
- 임의 constraint solver
- conic 전체
- 3D
- 전체 legacy SVG migration
- JSXGraph runtime 추가
- production exam JS/SVG 자동 수정

---

# 21. 후속 세부계획과 인터페이스

Construction Kernel은 다음 세부계획에 아래 artifact를 제공한다.

```text
ConstructionGraph
ConstructionSnapshot
CrossCheckReceipt
CoordinateEvidenceV2
visualSpec
```

### Detail 02 — Function Graph & Coordinate Axis Publication

별도 graph math capability를 완성한다. Construction Kernel에 함수 sampling을 억지로 합치지 않는다.

### Detail 03 — Typography & Font

Snapshot/visualSpec의 label semantic 값을 실제 MathJax/Korean font fragment로 만든다.

### Detail 04 — Measured Layout & Publication

model coordinate 불변 상태에서 label/layout/viewBox만 조정한다.

### Detail 05 — One-Click Runner

Construction Kernel 단계를 자동 호출하고 cache/repair/result를 관리한다.

---

# 22. 최종 한 문장

> **APMath Construction Kernel v1은 기하 공식을 새로 만드는 프로젝트가 아니라, 검증된 SymPy Geometry를 실행 가능한 typed construction graph 뒤에 두고 CindyJS로 독립 재구성 검산한 뒤, 그 결과만 기존 APMath publication engine에 전달하는 얇고 결정론적인 수학 계층이다.**

---

# 23. 구현 전 확정: realization·완전한 의존성·독립 검산

## 23.1 좌표 없는 source를 실제로 만드는 책임

D07은 normalization/자유도/branch 의미를 제안하고 D01은 **닫힌 realization recipe**를 기존 typed op로 전개한다. 임의 제약을 자동 풀겠다는 계약이 아니다. recipe id/version, 보존하는 source 조건, 좌표계 선택, 선택한 free parameter와 유효 domain을 frozen mathPlan에 포함한다. 원문에 길이가 있으면 길이 단위를 보존한다. mirrored realization을 허용하는 것은 의미 동등성의 source 검토가 있을 때뿐이다.

최초 recipe에는 anchor origin/positive-axis와 원문 scalar 거리의 연결을 명시한다. 예를 들어 SSS 삼각형은 A=(0,0), B=(c,0)를 normalization+주어진 AB 길이로 만들고, C는 중심 A/B·반지름 b/a 두 원의 교점과 명시적 방향 선택으로 정의한다. 이 anchor는 SOURCE_POINT로 위장하지 않는다. normalization primitive의 type/입력과 independent construction도 registry에 등록한다. `FREE_POINT`에 임의 DERIVED 좌표를 넣어 recipe를 생략하지 않는다. recipe 밖의 조건은 UNSUPPORTED 또는 필요한 의미 입력 대기로 남긴다.

원문이 하나의 branch를 정하지 않지만 반사/회전으로 동등한 실현을 허용하는 경우, 검토된 normalization 선택은 허용한다. 실제 다른 해/다른 결론이 되는 branch를 같은 이유로 고르면 안 된다. 동등성 승인과 선택 근거가 없으면 AMBIGUOUS_BRANCH다. 자유 parameter의 몇 값에서 관계가 유지된다는 검사는 그림 실현의 회귀이며 일반 명제의 증명이 아니다.

## 23.2 dependency closure

의존성은 `inputs`만이 아니다. schema가 지정한 **args의 scalar expression refs, branch guard refs, normalization refs, constraints refs**를 추출한다. 예를 들어 SELECT_POINT의 SIDE_OF_ORIENTED_LINE(A,B)는 intersection result뿐 아니라 A/B에도 의존한다. unknown ref/cycle/type 검증, topological order, node key, invalidation과 crosscheck scope 모두 같은 선언적 ref inventory를 소비한다. 문자열 전체에서 이름을 추측해 검색하지 않는다.

준비된 node들의 실행 순서는 stable node id로 정렬한다. graphlib 사용만으로 입력 배열 순서와 무관한 실행 순서가 보장된다고 가정하지 않는다. node array 순서 변경은 의미가 같은 경우 결과를 보존하고, ordered op inputs/ray/branch 순서는 보존한다.

## 23.3 exact scalar / execution boundary

Snapshot의 exact 값은 진단용 SymPy 문자열과 별개로 **검증된 typed scalar AST 또는 numerator/denominator 문자열**로 전달한다. Python repr/srepr/string을 다른 런타임에서 eval/sympify하지 않는다. numeric coordinate는 approximation/precision/단위를 갖고 원문의 domain restriction을 단순화로 없애지 않는다. 공통 hash 규칙은 D05 §75를 따른다.

per-node timeout은 thread timer만으로 구현하지 않는다. Node supervisor가 중단 가능한 Python subprocess 경계를 소유하고 graph 총 시간/메모리·출력 크기·식 깊이를 제한한다. timeout 후 worker를 종료·회수하고 완료된 snapshot만 commit한다. Windows에서도 중단되는 smoke를 필수로 한다. 초기에는 node마다 프로세스를 시작하기보다 graph 단위 worker와 stage cache를 우선한다.

## 23.4 crosscheck는 검증 전략을 명시한 receipt

CindyJS를 기본 independent reconstruction으로 유지한다. 실행 state는 요청마다 초기화하며 incremental peer cache는 reset와 동일 결과임을 검증하기 전까지 사용하지 않는다. master §4.4의 기존 독립 relation observer 대안은 **op별 frozen verification strategy와 동일 branch/constraint/primitive coverage를 qualification한 경우만** 허용한다. runtime 장애에 따라 자동 fallback하지 않는다. D08 matrix에는 전략과 observer version/hash를 명시한다.

source 해석이 틀린 같은 graph를 두 엔진이 실행해 일치하는 경우도 있다. crosscheck PASS는 graph가 source를 올바르게 해석했다는 증거가 아니다. source condition의 독립 추출/검토와 graph mapping 검토를 D07에서 별도로 닫는다.

필수 추가 회귀: 비좌표 SSS/수선 recipe, normalization 단위 오류, branch ref만 바뀐 경우, args의 hidden cycle, 입력 node 배열 순서, exact scalar wire, timeout 후 resume, 잘못된 graph에 두 backend가 모두 동의해도 source gate에서 거부.
