# APMath Function Graph & Coordinate Axis Publication 세부 구현계획 v1.1

**상위 문서:** `APMath Construction & Visual Production Engine — 최종 구현 계획서`  
**문서 역할:** Detail 02 / Function Graph & Coordinate Axis Publication  
**작성일:** 2026-10-05 (Asia/Seoul)  
**상태:** **통합검토 보완 반영 · 계획 v1.1 · 이번 작업 제품 코드 변경 0**  
**v1.0 원문 조사 기준(이력 보존):** `origin/main @ b08ba2db04ba3be4d172b718aee29e169f8655d3`

**통합 보완 기준 main:** `3a7b2cb712fb192f3728f4df4a7ccc1e99d79427`  
**개정일:** 2026-10-05 (Asia/Seoul)  
**반영 이슈:** I-03, I-05, D-02  
**적용 관계:** 같은 Detail v1.0의 해당 계약/예시를 v1.1 본문으로 대체한다. 공통 요청·routing·상태의 단일 소유자는 Detail 05 §4/6/7/24–26/53–54다. 원문의 “현재 main 구현” 설명은 원 조사 시점 기록이며 이번에 전체 코드를 다시 조사했다는 뜻이 아니다. 이 문서의 test/qualification checklist는 구현 후 수행할 요구사항이고, 문서 보완은 실행 PASS·ACTIVE·PUBLICATION_READY·Seal 선언이 아니다.

---

## 0. 이 문서의 목적

이 문서는 상위 마스터 계획의 두 번째 세부계획으로, 현재 APMath visual engine에 이미 존재하는 **함수 sampling · 미분 · viewport · 좌표축 · tick · SVG curve · browser layout · primitive audit** 기능을 버리지 않고 하나의 정식 `GRAPH_PUBLICATION` capability로 완성하는 구현계획이다.

목표는 새 그래프 엔진을 처음부터 다시 만드는 것이 아니다.

> **현재 `function_sampling.py`를 production curve sampler로 유지하고, 기존 axis/tick/viewport/SVG 경로를 정식 publication profile로 승격하며, domain topology · axis parity · critical fact · graph label owner · 실제 Archive desktop render까지 한 요청 안에서 검증 가능한 구조로 연결한다.**

기하 작도와 함수 그래프는 수학 계산 계층이 다르다.

- Geometry construction → Detail 01의 SymPy + CindyJS
- Function graph → 현재 APMath sampling + graph-specific fact/audit

그러나 아래는 공통 publication layer를 사용한다.

- Resolved profile
- MathJax/Korean font
- LabelInventory / measurement
- collision/layout
- SVG composer
- actual Archive desktop render
- bounded repair
- evidence/result reducer

즉 최종 제품 관점에서는 **같은 One-Click Visual Production Engine**, 내부 math capability만 다르다.

이 문서에서는 함수 그래프와 좌표축의 **수학·출판 capability**만 세부화한다.

별도 세부계획의 책임:

- Construction Kernel
- Math typography / Korean font
- measured label layout
- One-Click runner
- actual Archive integration
- 문제 문장 → VisualRequest planner
- 전체 qualification / seal

---

# 1. 구현 결정

## 1.1 production graph sampler

주 production sampler는 기존:

`archive/tools/geometry-equation/visual_engine/function_sampling.py`

를 유지한다.

현재 이미 존재하는 기능:

- bounded adaptive sampling
- screen-space chord/error 기준 refinement
- denominator guard
- `log`, `sqrt`, `tan` domain signature
- polynomial root isolation
- pole/break branch separation
- visible viewport clipping
- criticalX 입력
- sampling warnings
- deterministic branch output

따라서 신규 작업의 핵심은 sampler 재작성보다:

1. **지원범위 명시**
2. **domain topology fail-closed**
3. **graph facts 계약**
4. **axis/tick publication 계약**
5. **independent final-SVG audit**
6. **browser/Archive publication 연결**

이다.

---

## 1.2 analytic derivative

현재:

`visual_engine/differential.py`

는 safe expression tree를 대상으로 다음 derivative를 직접 계산한다.

- `+ - * /`
- constant exponent power
- general positive-base power
- `sin`
- `cos`
- `tan`
- `exp`
- `log`
- `sqrt`
- `abs` (`0`에서 nondifferentiable)

이를 유지한다.

역할:

- tangent fact
- slope at point
- derivative-based critical fact
- calculus graph metadata

단, **이 derivative 구현 하나를 독립 검수까지 재사용하지 않는다.**

---

## 1.3 그래프용 exact/reference 계산

그래프 curve 자체는 기존 sampler를 유지하되, publication에서 중요한 exact fact는 별도 `GraphFactPlan`에 동결한다.

예:

- root / x-intercept
- y-intercept
- intersection
- extrema / critical point
- hole
- vertical/horizontal asymptote
- tangent point / tangent slope
- open/closed endpoint
- domain boundary

이 값은:

1. source problem
2. verified/frozen solution facts
3. 허용된 deterministic math resolver

순으로 authority를 갖는다.

Detail 01에서 SymPy dependency를 도입하게 되면 exact root/intersection/derivative reference에 **보조적으로 재사용 가능**하지만, 이 문서에서 SymPy를 graph renderer로 만들지 않는다.

---

## 1.4 graph publication profile

현재 `publication.py`의 `geometry-publication-v1`은 axis와 `FUNCTION_GRAPH`를 명시적으로 거부한다.

이를 느슨하게 풀지 않는다.

대신 별도 profile:

`graph-publication-v1`

을 추가한다.

목표:

```text
geometry-publication-v1
  → axis-free Euclidean geometry

graph-publication-v1
  → coordinate axes / function curves / graph facts
```

두 profile은 공통 typography/layout/render 인프라를 공유하지만,
수학적 audit 규칙은 분리한다.

## 1.5 좌표기하 publication 조합 — I-05 결정

새 **opt-in profile descriptor** `coordinate-geometry-publication-v1`을 둔다. 수학 backend는 D01 그대로이며, 기존 geometry v2의 geometry/owner/label audit와 D02 axis/tick audit를 조합한다. 새 별도 renderer/geometry engine을 만드는 일이 아니다.

| 요청 | profile | transform / mandatory audits |
|---|---|---|
| 축 없는 Euclidean 기하 | geometry-publication-v2 | equal-unit; construction/geometry/owner |
| 순수 함수 및 지원 coordinate-function composite | graph-publication-v1 | 명시된 aspect policy; curve/topology/axis/tick/feature |
| 축 위 원·각도·Euclidean 거리/접선/교점 | coordinate-geometry-publication-v1 | **equal-unit; geometry/owner와 axis/tick 모두** |
| 동일 축의 함수 curve + Euclidean circle/angle 복합 | v1 미지원 | 별도 qualified 조합 없이 성공 profile로 우회 금지 |

필요한 glyph/typography/layout/Actual Archive/review gate는 세 profile 공통이다. legacy geometry-publication-v1의 axis-free 제한은 그대로 유지한다. 이 descriptor의 구현/qualification은 앞으로 수행하며 지금 ACTIVE로 선언하지 않는다.

---

# 2. 현재 main의 실제 상태

## 2.1 visual spec

현재 `visual_spec.schema.json`은 이미:

- `function_graph`
- `calculus_graph`
- `FUNCTION_GRAPH`
- `GRAPH_ANNOTATION`
- `axes`
- `domain`
- `expression`
- `breaks`
- `criticalX`

를 지원한다.

즉 graph input schema의 골격은 이미 있다.

문제는 **publication-ready 계약이 충분하지 않다**는 것이다.

---

## 2.2 axis / tick 생성

현재 `engine.prepare()`는 `axes=true`일 때:

- x-axis
- y-axis
- unit indicator
- `x`, `y` label
- 1/2/5/10 계열 자동 tick step
- tick label

을 생성한다.

현재 특징:

- zero tick label은 생략
- x/y axis label은 `GRAPH_ANNOTATION`
- tick label은 `allowSuppress=True`
- axis/tick도 collision obstacle로 들어감
- axis/tick의 정확한 semantic parity는 별도 publication audit로 닫혀 있지 않음

따라서 axis 생성기는 재사용하되,
publication에서는 **axis와 tick 자체가 검증 대상**이 되어야 한다.

---

## 2.3 viewport

현재 `viewport.py`의 정책:

```text
coordinate_geometry / line_circle_geometry
  → equal units

function_graph / calculus_graph
  → unequal units allowed
```

즉 함수 그래프는 기본적으로:

`aspectPolicy = UNEQUAL_UNIT_DECLARED`

가 가능하다.

이 방향은 유지한다.

다만 publication에서는 반드시 profile에:

- `EQUAL_UNIT`
- `INDEPENDENT_AXIS_SCALE`

중 하나를 명시한다.

순수 함수 그래프는 독립 축척을 허용할 수 있다.

반면 원·각도·길이처럼 Euclidean shape 자체가 의미인 coordinate geometry는 `EQUAL_UNIT`을 유지한다.

---

## 2.4 function sampling

현재 sampler의 중요한 장점:

### denominator

`a(x)/b(x)`의 denominator를 guard로 수집한다.

denominator polynomial root를 구할 수 있으면 cut/pole 후보로 사용한다.

### log / sqrt

내부 argument root를 polynomial로 구할 수 있으면 domain cut 후보로 사용한다.

### tan

signature를 사용해 branch 변화는 감지하지만,
tan pole 전체를 analytic hard cut으로 해결하는 구조는 아니다.

### adaptive refinement

- screen-space interpolation error
- chord length

을 보고 세분화한다.

### viewport clipping

화면 밖 branch를 잘라낸 후 visible boundary를 계산한다.

### warning

- `REFINEMENT_CAP`
- `NO_VISIBLE_BRANCH`

가 있으면 `POLISH_REQUIRED`.

---

## 2.5 현재 sampler의 publication 공백

현재 구조만으로는 다음을 항상 증명할 수 없다.

1. 일반 denominator의 모든 pole
2. 일반 `sqrt/log` domain boundary
3. tan pole 전체
4. removable hole의 정확한 open marker
5. source가 요구한 asymptote의 존재/표시
6. source가 요구한 intercept/extrema/critical point의 표시
7. 두 함수의 정확한 intersection
8. open/closed endpoint semantics
9. piecewise graph의 endpoint ownership
10. axis tick value와 실제 model coordinate의 일치
11. graph label이 올바른 curve owner에 붙어 있는지

따라서 publication에서는 **“곡선이 보인다”를 PASS로 사용하지 않는다.**

---

## 2.6 current independent graph audit

`verify-visual-extra-primitives.mjs`에는 이미 `FUNCTION_GRAPH` observer가 있다.

현재 확인:

- final SVG polyline branch를 읽음
- screen → model inverse transform
- frozen function evaluator로 각 sample point의 `y=f(x)` 확인
- declared pole을 branch가 가로질렀는지 검사
- sample count 기록

이 코드는 매우 중요한 기존 자산이므로 재사용한다.

하지만 현재는 다음이 부족하다.

- axis/tick parity
- open/closed point semantics
- hole
- asymptote
- extrema/intercept/intersection
- curve label owner
- branch completeness
- domain endpoint semantics
- expected critical feature completeness

---

## 2.7 browser layout

`verify-rendered-layout.mjs`는 이미:

- Chromium actual `getBBox`
- `getBoundingClientRect`
- CTM
- font family / effective font px
- missing glyph heuristic
- label-label collision
- label-geometry collision
- clipping
- stroke width
- viewport overflow

를 검사한다.

하지만 publication hard gate는 현재:

`data-publication-profile == geometry-publication-v1`

일 때만 적용한다.

따라서 `graph-publication-v1`도 publication profile로 처리해야 한다.

그래프의 tick label, axis label, function label도 실제 학생-facing text이므로 같은 font/readability 기준이 필요하다.

---

# 3. GraphPlan v1 계약

기존 raw visualSpec에 publication 책임을 계속 추가하지 않고,
graph-specific semantic plan을 먼저 동결한다.

제안:

`GraphPlan v1`

---

## 3.1 최상위 구조

```json
{
  "schemaVersion": "apmath-graph-plan-v1",
  "graphId": "...",
  "sourceRef": {},
  "solutionRef": {},
  "graphType": "FUNCTION_GRAPH",
  "axisSpec": {},
  "functions": [],
  "requiredFeatures": [],
  "displayBindings": [],
  "sourceConditionCoverage": []
}
```

---

## 3.2 graphType

v1:

- `FUNCTION_GRAPH`
- `CALCULUS_GRAPH`
- `COORDINATE_FUNCTION_COMPOSITE`

`COORDINATE_FUNCTION_COMPOSITE`는:

- 함수 curve
- explicit point/segment/line
- coordinate labels

가 같은 축 위에 함께 존재하는 경우다.

단 Euclidean circle/angle geometry를 억지로 이 profile에 넣지 않는다.

## 3.3 CoordinateGeometryPlan v1

D05 capability `COORDINATE_GEOMETRY` 전용 inline mathPlan:

```json
{
  "schemaVersion": "apmath-coordinate-geometry-plan-v1",
  "constructionGraph": {},
  "axisSpec": {},
  "aspectPolicy": "EQUAL_UNIT"
}
```

빈 객체는 설명용이다. constructionGraph는 D01의 완전한 executable schema, axisSpec는 본 문서 AxisSpec를 만족해야 한다. D02 normalizer가 조합/축 intent를 정규화하고 D01 normalizer를 호출해 기하 typed graph를 닫는다. 이 wrapper의 schema/routing 소유자는 D05 contracts이며 전문 sub-schema는 복제하지 않는다.

원·각도·거리 source facts와 axis는 같은 model frame/단위를 공유한다. geometry를 비등방 축척한 뒤 라벨만 실제 값으로 붙이는 것을 금지한다. 새 그래프 sampler를 필요로 하지 않는다. `COORDINATE_FUNCTION_COMPOSITE`의 point/line이 Euclidean 거리·각도 도형 성질을 주장하게 되면 이 경계 밖의 혼합으로 판정하며 v1에서는 미지원이다.

---

# 4. FunctionSpec 계약

각 함수는 최소:

```json
{
  "id": "f",
  "expression": "...",
  "expressionAst": {},
  "domain": {
    "kind": "INTERVAL",
    "left": -5,
    "right": 5,
    "leftClosed": true,
    "rightClosed": true
  },
  "styleRole": "MAIN_CURVE",
  "breaks": [],
  "criticalX": [],
  "required": true
}
```

---

## 4.1 expression authority

표현 문자열만 정본으로 사용하지 않는다.

기존 `math_expression.py`의 validated AST를 함께 고정한다.

즉:

```text
source expression
→ validated AST
→ canonical AST SHA
→ sampling / fact resolution / audit
```

을 결박한다.

final SVG의 curve fact는 같은 AST SHA와 연결돼야 한다.

---

## 4.2 styleRole

v1:

- `MAIN_CURVE`
- `SECONDARY_CURVE`
- `AUXILIARY_CURVE`

색/선 굵기 자체가 수학 authority는 아니지만
학생이 어느 곡선이 어느 함수인지 혼동하지 않도록 display binding에 결속한다.

---

# 5. DomainTopology v1

publication에서 가장 중요한 보강축이다.

단순 `[lo, hi]` domain만으로는 부족하다.

각 함수는 실제 정의역 topology를 명시한다.

예:

```json
{
  "intervals": [
    {
      "left": -5,
      "right": 0,
      "leftClosed": true,
      "rightClosed": false
    },
    {
      "left": 0,
      "right": 5,
      "leftClosed": false,
      "rightClosed": true
    }
  ],
  "excludedPoints": [0],
  "poles": [0],
  "holes": []
}
```

---

## 5.1 자동 추론과 frozen override

현재 sampler가 안정적으로 증명 가능한 경우에는 자동 추론을 사용한다.

예:

- polynomial denominator root
- polynomial `sqrt/log` boundary

자동 추론이 완전하지 않은 경우:

- source/solution에서 frozen domain facts 제공
- 또는 deterministic fact resolver가 계산

**추론 실패를 “샘플하다 보니 끊겼다”로 publication PASS하지 않는다.**

---

## 5.2 tan

`tan`은 branch signature만으로 최종 publication topology를 승인하지 않는다.

v1 publication에서는:

- relevant viewport 안 pole 위치를 deterministic하게 구하거나
- frozen `breaks/poles`가 있어야 함

그렇지 않으면:

`GRAPH_DOMAIN_TOPOLOGY_UNVERIFIED`

---

## 5.3 removable hole

예:

```text
(x²-1)/(x-1)
```

에서는 curve가 `x+1`과 같아 보여도
`x=1`은 source expression에서 제외된다.

따라서:

- curve branch
- hole point
- open marker

를 함께 표현해야 한다.

hole marker는 자동 decoration이 아니라
`requiredFeatures`의 `HOLE` fact로 결속한다.

---

# 6. AxisSpec v1

```json
{
  "x": {
    "min": -5,
    "max": 5,
    "label": "x",
    "tickPolicy": "AUTO_NICE",
    "explicitTicks": []
  },
  "y": {
    "min": -4,
    "max": 6,
    "label": "y",
    "tickPolicy": "AUTO_NICE",
    "explicitTicks": []
  },
  "originLabelPolicy": "OMIT_ZERO",
  "aspectPolicy": "INDEPENDENT_AXIS_SCALE",
  "gridPolicy": "NONE"
}
```

---

## 6.1 tick policy

v1:

- `AUTO_NICE`
- `EXPLICIT`
- `SEMANTIC`

### AUTO_NICE

현재 1/2/5/10 tick algorithm 재사용.

### EXPLICIT

source/solution이 특정 scale을 요구할 때 사용.

예:

- π/2, π
- 1/3
- 특정 함수 교점 x값
- source 시험지의 고정 눈금

### SEMANTIC

GraphPlan의 required feature를 기준으로
중요한 값이 눈금에 보이도록 자동 선택.

이 기능은 v1 필수로 넣을지 구현 단계에서 조정 가능하나,
임의 숫자를 너무 많이 표시하는 것은 금지한다.

---

## 6.2 tick label parity

각 tick은:

```text
model value
→ projected screen coordinate
→ final line primitive
→ displayed tick text
```

가 일치해야 한다.

검사:

- x tick은 실제 x=value 위치
- y tick은 실제 y=value 위치
- displayed text가 exact value와 일치
- axis scale transform과 동일 transform 사용

---

## 6.3 axis origin / direction

검사 대상:

- x/y axis가 model origin을 통과하는가
- axis 방향이 뒤집히지 않았는가
- x/y label이 맞는 axis owner인가
- origin이 viewport 밖인 경우 axis를 거짓으로 중앙에 만들지 않았는가

축이 viewport에 실제로 없는 경우는 명시적 policy로 처리한다.

---

## 6.4 grid

기본:

`NONE`

grid는 필요할 때만.

허용:

- source fidelity
- coordinate reading이 실제 풀이 핵심
- 교육적 benefit이 명확

장식용 full grid를 기본으로 넣지 않는다.

---

# 7. Aspect Policy

## 7.1 FUNCTION_GRAPH

기본:

`INDEPENDENT_AXIS_SCALE`

허용.

단 다음을 evidence에 남긴다.

- `sx`
- `sy`
- plot bounds
- screen transform

---

## 7.2 coordinate geometry

원/각도/거리의 모양이 의미면:

`EQUAL_UNIT`

---

## 7.3 mixed graph

예:

- 함수와 접선
- 곡선과 면적 영역
- 두 함수 교점

는 독립 축척 허용 가능.

하지만 화면 angle을 실제 수학 angle로 읽어야 하는 annotation을 넣지 않는다.

즉 graph profile에서 screen angle을 mathematical angle evidence로 사용하지 않는다.

## 7.4 equal-unit의 actual SVG/Archive 재확인

좌표기하는 profile 선언만 검사하지 않는다. final SVG의 model→screen transform에서 x/y 단위 길이를 독립 계산하고 circle/angle/거리 및 axis/tick 관측이 같은 transform을 사용함을 확인한다. Archive의 actual image rect/비율이 승인된 transform을 바꾸면 관련 screen-space 관측을 무효화한다. unequal-scale mutation은 좌표기하에서 FAIL이며, 순수 함수 그래프의 승인된 독립 축척을 일괄 금지하지 않는다.

---

# 8. RequiredFeature v1

Graph publication의 품질은 curve 전체가 “대충 맞는지”만 보는 것이 아니다.

문항/해설에서 실제 사용하는 핵심 feature를 명시한다.

v1 feature:

- `X_INTERCEPT`
- `Y_INTERCEPT`
- `FUNCTION_INTERSECTION`
- `ROOT`
- `EXTREMUM`
- `CRITICAL_POINT`
- `INFLECTION_POINT`
- `VERTICAL_ASYMPTOTE`
- `HORIZONTAL_ASYMPTOTE`
- `OBLIQUE_ASYMPTOTE`
- `HOLE`
- `OPEN_ENDPOINT`
- `CLOSED_ENDPOINT`
- `TANGENT_POINT`
- `TANGENT_LINE`
- `DOMAIN_BOUNDARY`
- `MONOTONIC_INTERVAL`
- `REGION_BOUNDARY`

모든 함수에 전부 요구하지 않는다.

**source/solution의 decisive relation에 필요한 feature만 required.**

---

# 9. Feature truth와 표시를 분리

예:

```json
{
  "id": "root-1",
  "kind": "X_INTERCEPT",
  "function": "f",
  "xExact": "2",
  "xNumeric": 2,
  "display": {
    "marker": true,
    "label": true
  }
}
```

다음 두 축을 분리한다.

1. 수학적으로 root가 맞는가
2. 학생에게 실제 표시해야 하는가

root가 수학 fact라는 이유만으로 모든 root에 label을 붙이지 않는다.

---

# 10. GraphFactPlan 생성

authority:

```text
source
+ verified/frozen solution
→ GraphFactPlan
→ sampler/publication
```

GraphFactPlan에는:

- expression AST SHA
- domain topology
- required features
- expected exact values
- numeric reference values
- feature owner
- display requirement
- sourceRefs / solutionRefs

를 기록한다.

---

# 11. production sampling 정책

## 11.1 current sampler 재사용

`function_sampling.sample()`을 중심으로 한다.

새 library로 전체 대체하지 않는다.

---

## 11.2 publication mode 추가

제안:

```python
sample(
    expression,
    domain,
    viewport,
    critical_x=...,
    breaks=...,
    max_depth=...,
    topology=...
)
```

기존 API compatibility를 보존하기 위해
새 인자를 optional/versioned path로 넣는다.

publication mode에서는:

- unresolved topology 금지
- required break 누락 금지
- refinement warning은 ready 불가
- expected visible branch count 검증
- hole/pole을 가로지르는 segment 금지

---

## 11.3 branch identity

각 branch는 단순 index가 아니라 가능한 경우:

```json
{
  "branchId": "f:left-of-pole-0",
  "domainInterval": [-5,0],
  "leftClosed": true,
  "rightClosed": false
}
```

처럼 domain interval과 결속한다.

이러면 final SVG의 `branch-0`, `branch-1` 순서가 바뀌어도 semantic identity가 유지된다.

---

# 12. Curve approximation 기준

현재:

- interpolation error `.35 px`
- chord length `16 px`
- max depth 12 기본

을 사용한다.

이를 publication profile의 versioned numeric policy로 올린다.

예:

```json
{
  "maxChordErrorPx": 0.35,
  "maxChordLengthPx": 16,
  "maxDepth": 12,
  "minimumVisibleSamples": 200
}
```

값을 임의로 실행 중 완화해 PASS하지 않는다.

변경 시 profile version/hash가 바뀌어야 한다.

## 12.1 Producer 기준과 독립 관측 기준의 구분

위 값은 producer refinement의 현재 기준/예시다. `minimumVisibleSamples=200`이나 `maxChordLengthPx=16`은 독립 정확도 증명이 아니다. independent observer는 §15.1의 선분 내부 오차를 실제 final SVG에서 다시 구한다.

`Px`는 최종 publication reference의 **CSS px**로 해석하도록 versioned numeric policy에 명시한다. 계산 중 SVG user-space에서 측정한 오차는 별도로 기록하고 frozen model→SVG→reference-display transform으로 환산한다. SVG user-space 숫자를 CSS px라고 부르지 않는다. Actual Archive에서 실제 display transform이 예상과 다르면 screen refinement/오차 환산/관련 관측을 무효화하고 영향을 받은 graph만 다시 처리한다. threshold를 실행 중 늘리지 않는다.

---

# 13. Function evaluation completeness

현재 `math_expression`이 지원하는 표현 범위 안에서만 publication ACTIVE로 한다.

기본 지원 후보:

- polynomial
- rational
- `sqrt`
- `abs`
- `exp`
- `log`
- `sin`
- `cos`
- `tan`
- 위 함수의 bounded composition

단 “parser가 읽는다”와 “domain topology까지 publication-qualified”는 다르다.

support matrix에는 최소:

```text
PARSE
EVALUATE
SAMPLE
TOPOLOGY
CRITICAL_FACT
INDEPENDENT_AUDIT
PUBLICATION
```

축을 분리한다.

어느 축이 비어 있으면 그 함수 family는 full publication ACTIVE가 아니다.

---

# 14. calculus graph

현재 `differential.py`를 사용한다.

v1 publication 지원:

- tangent at verified point
- derivative slope
- critical point
- local extrema candidate
- monotonic interval fact

후속 후보:

- inflection
- concavity
- derivative graph / original graph coordinated panel
calculus fact가 필요한 문항만 사용한다.

---

## 14.1 tangent

검증:

```text
point lies on function
+
analytic derivative exists
+
line passes through point
+
line slope == derivative
+
final SVG primitive parity
```

이 5개가 모두 필요하다.

---

## 14.2 nondifferentiable

예:

`abs(x)` at 0

은:

`NONDIFFERENTIABLE`

로 명시하고 tangent를 임의 생성하지 않는다.

---

# 15. Independent graph audit v1

기존 `verify-visual-extra-primitives.mjs`를 확장한다. builder sampler/evaluator/derivative 결과나 witness를 기대값·검수 구현으로 재사용하지 않는다. 공통 schema와 고정된 수학 입력만 공유한다.

## 15.1 curve equation + segment-interior parity

관측 대상은 **최종 SVG에서 파싱한 모든 visible branch의 실제 꼭짓점과 연결 선분**이다.

1. 독립적으로 확인한 transform으로 꼭짓점을 model-space로 되돌리고 frozen AST의 독립 evaluator로 `y=f(x)`를 검사한다.
2. 각 선분의 x 진행 방향·연속 구간·domain/pole/hole 경계를 확인한다. 누락된 visible interval이나 거꾸로 연결한 점도 검사한다.
3. 선분 내부의 실제 curve와 직선 사이 오차를 **지원 함수군별 독립적인 보수적 상계 또는 검증된 enclosure 방식**으로 계산한다. midpoint/quarter-point 등은 큰 오류를 빨리 찾는 probe이며, finite sample만 모두 맞았다고 임의 함수 전체를 PASS하지 않는다.
4. profile의 reference display transform으로 최종 화면 오차를 비교한다. 관측한 max deviation, bound 방법/version, 검사한 구간, errorSpace, 사용 budget, threshold, final SVG SHA/AST SHA/transform SHA를 기록한다.
5. 시간·구간·깊이 budget 안에서 허용오차 이하임을 확인하지 못하면 `GRAPH_SEGMENT_ERROR_UNVERIFIED`. 실제 초과를 발견하면 `GRAPH_SEGMENT_ERROR_EXCEEDED`다. 미검증을 PASS나 required gate의 NOT_APPLICABLE로 바꾸지 않는다.

### 검증 가능한 간단한 기준

구간 [a,b]에서 두 번 미분 가능하며 독립적으로 `|f''(x)| ≤ M`을 보증할 수 있고 transform이 본 profile의 axis-aligned affine 변환이면, 함수 위의 정확한 양 끝점을 잇는 chord와 curve의 수직 model-space 오차는 `M*(b-a)^2/8` 이하이다. final 꼭짓점 자체의 함수값 오차가 있으면 그 최댓값도 더한다. 최종 CSS y축 scale로 환산한 상계가 threshold 이하면 해당 선분을 수용할 수 있다.

이는 적용 조건이 충족될 때의 한 허용 방법이지 모든 family의 단일 알고리즘이 아니다. sqrt 경계·절댓값 corner·극점 인근처럼 이 bound를 바로 쓸 수 없는 구간은 topology로 분리하고 해당 family에 맞는 독립 interval/envelope/bound를 사용한다. producer `differential.py`를 호출해 독립 검수라고 부르지 않는다. 유한 표본밖에 확보하지 못한 family는 해당 검수 capability를 미검증으로 유지한다.

### 최소 false-accept 회귀

- `y=x²`: (-1,1)과 (1,1)을 직선으로 연결 — x=0 내부 오차를 검출.
- `y=100x²`: 정확한 점 200개를 양쪽에 배치하되 (-0.06,0.36)→(0.06,0.36)만 직선 연결 — equal scale 100에서 chord 길이 12 SVG 단위, 내부 오차 36 SVG 단위를 검출. 점 수/최대 길이만으로 PASS 금지.
- `y=x³-x`: (-1,0)→(1,0) — endpoints와 midpoint가 모두 정확해도 내부가 다른 사례를 검출.
- 각 family의 정상 refined curve는 해당 bound/threshold를 통과해야 한다. 실제 bound를 계산할 수 없는 budget negative도 포함한다.

위 첫 두 사례는 직전 검토에서 기존 하위 observer의 false accept를 재현한 **회귀 입력**이다. 이번 문서 수정으로 검수기 코드가 고쳐졌거나 전체 Archive가 실패했다고 주장하지 않는다.

## 15.2 domain topology audit

expected visible domain과 실제 branch x-range/coverage, 방향, 누락/추가 branch, pole/hole crossing, excluded endpoint, open/closed 표시를 함께 확인한다. 올바른 짧은 branch만 남겨 범위를 축소한 SVG도 FAIL이다.

## 15.3 axis audit / coordinate profile dispatch

actual x/y-axis line, tick primitive/value, axis label, transform을 관측한다. coordinate-geometry-publication-v1은 이 관측과 **독립 Euclidean geometry/owner 관측 모두**를 실행하고 equal-unit을 확인한다. curve가 없는 좌표기하에는 sampling audit만 NOT_APPLICABLE이며 geometry/axis는 면제하지 않는다.

## 15.4 required feature audit

source/verified facts에 필요한 root·intersection·asymptote·hole·endpoint·tangent를 actual final SVG에서 찾는다. root는 (r,0), intersection은 두 curve의 동일 model point, hole은 정확한 excluded coordinate의 open marker에 결박한다. asymptote의 primitive·위치·topology가 source와 모순 없어야 한다. 필요하지 않은 feature를 임의로 추가하지 않는다.

---

# 16. Graph label owner

Graph publication에서도 owner가 중요하다.

label 종류:

- axis label
- tick label
- function name
- exact coordinate
- feature value
- tangent equation
- asymptote equation
- open/closed endpoint value

모든 label은 owner metadata를 가진다.

예:

```text
f(x) → owner=function:f
π → owner=x-axis:tick:pi
(2,3) → owner=point:intersection-1
y=2x+1 → owner=tangent:t1
```

위치만 근처에 있다고 owner를 추정하지 않는다.

---

# 17. Tick / function label requiredness

현재 axis/tick label은 suppressible할 수 있다.

publication에서는 requiredness를 구분한다.

- decorative/nonessential tick → suppressible 가능
- source/solution critical tick → required
- x/y axis label → profile policy
- function identity label → multi-curve에서 required 가능
- feature label → GraphFactPlan display binding에 따름

**required label이 collision 때문에 사라지면 POLISH_REQUIRED/FAIL.**

---

# 18. graph publication style

현재 `style_tokens.json`의 graph 관련 자산:

- `graphVersion: AP_GRAPH_PRINT_V1_1_DRAFT`
- `axis`
- `grid`
- `mainCurve`
- `secondaryCurve`
- `tangent`
- `auxiliary`
- `tickLabel`
- `mathLabel`

를 재사용한다.

후속 typography 세부계획에서:
- fixed font
- MathJax SVG
- actual metrics

와 결속한다.

---

# 19. `graph-publication-v1` profile

제안 최소 contract:

```json
{
  "profile": "graph-publication-v1",
  "axisPolicy": "...",
  "aspectPolicy": "...",
  "tickPolicy": "...",
  "samplingPolicyVersion": "...",
  "requiredFeatureCoverage": true,
  "labelInventoryRequired": true,
  "desktopReference": {
    "mode": "sol",
    "viewport": [1440,1000],
    "fit": "none"
  }
}
```

geometry publication profile을 재사용하되
“axis=true 허용” 한 줄만 바꾸는 방식은 금지한다.

`coordinate-geometry-publication-v1`은 별도 descriptor에서 geometry-v2 label/geometry allowlist + axis/tick allowlist를 **layer별로 제한해 합성**한다. math glyph path를 기하 curve로 오인하지 않으며 geometry layer를 graph profile의 느슨한 허용으로 통과시키지 않는다. required observer 집합과 equal-unit 조건을 profile hash에 포함한다.

---

# 20. browser publication gate

`verify-rendered-layout.mjs`에서:

```text
geometry-publication-v1
graph-publication-v1
```

둘 다 student-facing publication profile로 인식하게 한다.

공통 HARD:

- effective font < 11 CSS px → FAIL
- invalid bounds → FAIL
- clipping → FAIL
- critical label collision → FAIL
- missing glyph → FAIL

graph 추가 HARD:

- required tick hidden → FAIL
- curve label wrong owner → FAIL
- feature label wrong owner → FAIL
- required endpoint marker clipped → FAIL
- axis label clipped → FAIL

---

# 21. 실측과 그래프 재배치

graph label도 후속 typography/layout pipeline에서 동일한 실제 fragment를 측정한다.

다음은 자동 repair 가능:

1. function label 이동
2. tick label 간격 조정
3. noncritical tick suppression
4. graph annotation 이동
5. viewport margin 확장
6. plot framing 조정
7. explicit leader

금지:

- 수학적으로 중요한 tick 값 변경
- domain 변경
- root/critical point 위치 변경
- curve 좌표 왜곡
- x/y scale을 몰래 변경
- required label 삭제
- feature를 화면 밖으로 밀어내기

---

# 22. viewport auto-framing

현재 `viewport.for_spec()`는 critical point가 밖/경계면이면 8% 확장한다.

graph publication에서는
critical facts와 measured label extents를 함께 고려한다.

단 순서:

```text
Graph math viewport
→ required feature coverage
→ measured label margin
→ final framing
```

label 때문에 model fact를 바꾸지 않는다.

---

# 23. auto tick과 framing의 상호작용

viewport가 바뀌면 AUTO_NICE tick도 바뀔 수 있다.

따라서 viewport repair 후:

- tick set 재계산
- tick label measurement
- axis audit
- final render

를 다시 해야 한다.

반면 source-fixed EXPLICIT tick은 viewport가 바뀌어도 값 자체를 바꾸지 않는다.

---

# 24. GraphResult v1

graph-specific 결과:

```json
{
  "graphPlanSha256": "...",
  "expressionAstSha256": "...",
  "sampling": [],
  "axisAudit": {},
  "segmentInteriorAudit": {},
  "visibleDomainCoverageAudit": {},
  "topologyAudit": {},
  "featureAudit": {},
  "labelOwnerAudit": {},
  "browserLayout": {},
  "status": "..."
}
```

상위 One-Click result가 이를 참조한다.

---

# 25. 실패 상태

- `GRAPH_SCHEMA_INVALID`
- `UNSUPPORTED_FUNCTION`
- `GRAPH_DOMAIN_TOPOLOGY_UNVERIFIED`
- `GRAPH_DOMAIN_EMPTY`
- `GRAPH_BRANCH_MISSING`
- `GRAPH_BRANCH_EXTRA`
- `FALSE_CONNECTION_ACROSS_DISCONTINUITY`
- `GRAPH_HOLE_MISSING`
- `GRAPH_ENDPOINT_SEMANTIC_FAIL`
- `GRAPH_SAMPLE_PARITY_FAIL`
- `GRAPH_SEGMENT_ERROR_EXCEEDED`
- `GRAPH_SEGMENT_ERROR_UNVERIFIED`
- `GRAPH_VISIBLE_DOMAIN_COVERAGE_FAIL`
- `COORDINATE_GEOMETRY_ASPECT_FAIL`
- `COORDINATE_GEOMETRY_AUDIT_MISSING`
- `GRAPH_REFINEMENT_CAP`
- `GRAPH_NO_VISIBLE_BRANCH`
- `GRAPH_CRITICAL_FACT_MISSING`
- `GRAPH_CRITICAL_FACT_WRONG`
- `GRAPH_AXIS_PARITY_FAIL`
- `GRAPH_TICK_PARITY_FAIL`
- `GRAPH_AXIS_LABEL_OWNER_FAIL`
- `GRAPH_CURVE_LABEL_OWNER_FAIL`
- `GRAPH_REQUIRED_LABEL_MISSING`
- `GRAPH_PUBLICATION_COLLISION`
- `GRAPH_PUBLICATION_CLIPPING`
- `GRAPH_RENDER_PENDING`
- `GRAPH_UNSUPPORTED_CAPABILITY`

false PASS보다 명시적 unsupported가 우선이다.

---

# 26. 캐시 / invalidation

## expression 변경

무효화:

```text
GraphPlan
→ topology
→ sampling
→ features
→ SVG
→ graph audit
→ render
```

---

## viewport 변경

재사용 가능:

- expression AST
- source/solution fact
- exact feature fact

무효화:

- sampling screen refinement
- projection
- ticks
- labels/layout
- SVG
- browser/render

---

## font 변경

재사용:

- expression
- topology
- sampling model points
- feature math

무효화:

- label measurement
- layout
- SVG label subtree
- render

---

## tick policy 변경

재사용:

- curve model samples

재실행:

- axis/tick generation
- label measurement/layout
- SVG
- graph audit
- render

---

# 27. 신규 파일 제안

파일 수를 목표로 하지 않는다.

작게 합칠 수 있으면 합친다.

---

## `visual_engine/graph_plan.schema.json`

책임:

- GraphPlan
- axisSpec
- function specs
- domain topology
- required features
- display bindings

---

## `visual_engine/graph_publication.py`

책임:

- `graph-publication-v1`
- axis/curve/feature semantic decoration
- graph label owner
- profile validation
- required feature materialization policy

**sampling math 자체를 넣지 않는다.**

---

## `visual_engine/graph_facts.py`

책임:

- GraphFactPlan normalization
- exact/numeric feature contract
- domain topology resolver interface
- source/solution binding

기존 math_expression/differential을 호출할 수 있으나
final SVG audit logic은 넣지 않는다.

---

## `verify-graph-publication.mjs`

별도 파일을 만들 경우 책임은:

- graph plan 기반 independent final-SVG observation orchestration

하지만 기존 `verify-visual-extra-primitives.mjs`가 충분히 작은 확장으로 처리 가능하면
새 파일을 만들지 않는다.

---

# 28. 기존 파일 수정

## `visual_engine/function_sampling.py`

보강:

- versioned publication sampling policy
- interval/branch identity
- domain topology input
- expected branch coverage
- warning classification
- deterministic trace metadata

기존 default behavior 호환 유지.

---

## `visual_engine/differential.py`

보강:

- publication fact용 status
- nondifferentiable explicit result
- exact/source binding interface

불필요하게 CAS 전체로 확대하지 않는다.

---

## `visual_engine/viewport.py`

보강:

- explicit aspect policy
- graph critical feature framing
- label-safe margin input
- projection metadata hash

---

## `visual_engine/engine.py`

보강:

- GraphPlan / graph-publication profile 수용
- axisSpec 기반 축/tick 생성
- branch semantic id
- GraphFactPlan required feature decoration
- label inventory export

---

## `visual_engine/semantic_model.py`

보강:

- graph profile version
- axis/tick/feature semantic relation
- old graph spec compatibility

---

## `visual_engine/style_tokens.json`

- 기존 graph token 유지
- `graphVersion`을 production profile에 결속
- runtime에서 임의 재로드하지 않고 ResolvedProfile 사용

---

## `verify-visual-extra-primitives.mjs`

보강:

- branch interval audit
- axis parity
- tick parity
- hole/open/closed endpoint
- required feature
- function/feature label owner

builder helper import 금지 유지.

---

## `verify-rendered-layout.mjs`

보강:

- graph-publication-v1도 publication gate 적용
- graph label group 측정은 후속 typography 계획과 연결
- required graph label inventory 확인

---

## `audit_publication.py`

geometry audit와 graph audit의 책임이 섞이지 않게
profile dispatch만 담당하거나 별도 graph observer를 호출한다.

geometry 규칙을 graph에 억지 적용하지 않는다.

---

# 29. 구현 단계

## Phase 0 — support matrix freeze

고정:

- 지원 expression family
- topology capability
- calculus capability
- GraphPlan schema
- publication profile
- test denominator

종료:

“parse 가능”과 “publication 가능”이 구분됨.

---

## Phase 1 — GraphPlan / domain topology

구현:

- GraphPlan schema
- FunctionSpec
- DomainTopology
- AxisSpec
- RequiredFeature

회귀:

- rational pole
- sqrt boundary
- log boundary
- tan pole
- removable hole
- bounded interval endpoint
- unsupported topology

종료:

sampling 시작 전 topology가 명확함.

---

## Phase 2 — sampler publication mode

구현:

- semantic branch id
- frozen breaks
- expected interval coverage
- refinement policy
- warning fail-closed

종료:

curve branch가 domain topology와 1:1 대조 가능.

---

## Phase 3 — axis/tick publication

구현:

- axisSpec
- explicit/auto tick
- model→screen parity
- axis/tick semantic ids
- required tick policy

종료:

tick text와 실제 coordinate가 독립 audit에서 일치.

---

## Phase 4 — required features

구현:

- intercept
- intersection
- extrema
- asymptote
- hole
- endpoints
- tangent

중 source/solution에 필요한 feature만 materialize.

종료:

decisive graph facts가 final SVG에서 관측 가능.

---

## Phase 5 — independent graph audit

확장:

- final curve equation parity
- topology
- axis/tick
- required features
- owner bindings

mutation test:

- branch 연결 변조
- tick 위치 변조
- tick text 변조
- root marker 이동
- hole 삭제
- curve label owner 변경
- asymptote 위치 변경

모두 FAIL.

---

## Phase 6 — browser publication

후속 typography/measurement contract를 소비해서:

- 실제 font
- label bounds
- collision
- clipping
- required label coverage

검사.

종료:

`graph-publication-v1`이 geometry와 같은 desktop readability floor를 가짐.

---

## Phase 7 — actual Archive qualification 연결

One-Click/Archive 세부계획에서 실제 capture를 수행하지만,
graph detail에서는 필요한 evidence schema를 확정한다.

필수:

- final SVG SHA
- graph plan SHA
- sampling policy SHA
- axis/tick audit
- actual asset response SHA
- desktop mode=sol/no-fit screenshot

## Phase 5 추가 완료 조건

독립 segment-interior bound/coverage를 구현하고 §15.1의 정확한 꼭짓점+잘못된 chord 3개를 목적 gate에서 거부한다. 정상 sampler 결과가 통과하는 control을 함께 둔다. 원+직선+좌표축 positive와 unequal-scale negative에서 geometry/axis observer 둘 다 실제 호출됨을 확인한다.

---

# 30. 최소 synthetic regression

최소 fixture:

1. `linear-basic`
2. `quadratic-vertex-roots`
3. `rational-vertical-asymptote`
4. `rational-removable-hole`
5. `sqrt-domain-boundary`
6. `log-domain-boundary`
7. `absolute-value-corner`
8. `tan-multiple-branches`
9. `two-functions-intersection`
10. `calculus-tangent`
11. `explicit-special-ticks`
12. `unequal-axis-scale`

각 fixture는 positive + 핵심 mutation negative를 가진다.

추가: `exact-vertices-wrong-chord`, `dense-samples-hidden-chord-error`, `midpoint-alias-cubic`, `segment-bound-budget-exhausted`, `coordinate-circle-line-axes`, `coordinate-circle-unequal-scale`. negative는 의도한 graph/coordinate gate에서 실패해야 하며 unrelated malformed SVG로만 거부되어서는 안 된다.

---

# 31. 실제 Archive qualification용 그래프 유형

전체 최종 denominator는 마스터 qualification과 조정하되
graph publication 자체는 최소 다음 유형을 실제 문항에서 확인해야 한다.

1. 단순 다항함수 + 절편
2. 유리함수 + 수직점근선
3. 무리함수 + 정의역 시작점
4. 두 함수 교점
5. 절댓값/조각 그래프 또는 open/closed endpoint
6. 접선/미분 graph
7. exact tick/π 또는 분수 label이 필요한 graph

실제 source에 해당 문항이 없으면
임의로 비슷한 문항을 지어내 PASS하지 않는다.

synthetic fixture와 actual exam을 구분한다.

## 실제 UID 수와 feature coverage

최종 최소 **Graph 4 unique UID**와 위 **7개 required feature 유형**은 별도 분모다. D08 §26의 UID×feature×typography/layout×review matrix로 증명한다. 한 UID가 여러 feature를 덮을 수 있으므로 기계적으로 7 UID를 강제하지 않는다. 실제 4 UID로 요구 feature를 덮지 못하면 실제 UID를 추가한다.

임의 문제 생성이나 EXEMPT/RASTER/KEEP로 빠진 generated graph를 채우지 않는다. scope 변경은 qualification 시작 전에 명시적으로 정하고 새 generation으로 동결하며, 실행 중 FAIL을 가리기 위해 feature를 지우지 않는다.

---

# 32. Graph-only 내부 완료 gate

이 Detail 02의 구현 완료 상태는:

`GRAPH_PUBLICATION_CAPABILITY_QUALIFIED`

로 둔다.

의미:

- graph math/topology
- axis/tick
- critical feature
- independent SVG audit

까지 준비됨.

하지만 아직 후속 Detail의:

- fixed typography
- integrated measured layout
- One-Click runner
- actual Archive final review

가 닫히지 않았다면
상위 `PUBLICATION_READY`를 주장하지 않는다.

---

# 33. 완료 기준

- [ ] 기존 `function_sampling.py`가 production graph sampler로 유지된다.
- [ ] 지원 expression family가 support matrix로 명시된다.
- [ ] domain topology가 publication 전에 fail-closed로 확정된다.
- [ ] pole/hole/open/closed endpoint가 branch semantics에 포함된다.
- [ ] branch가 단순 배열 index가 아니라 domain interval identity를 가진다.
- [ ] sampling warning이 false READY로 바뀌지 않는다.
- [ ] x/y axis와 tick 위치·값이 model coordinate와 독립적으로 대조된다.
- [ ] graph aspect policy가 명시적이다.
- [ ] required feature가 source/solution facts와 결속된다.
- [ ] intercept/intersection/asymptote/hole/tangent 등 필요한 feature가 final SVG에서 독립 관측된다.
- [ ] function/tick/feature label에 owner metadata가 있다.
- [ ] required label이 collision 때문에 조용히 사라지지 않는다.
- [ ] final SVG branch sample은 독립 evaluator에서 `y=f(x)` parity를 통과한다.
- [ ] discontinuity를 가로지르는 false connection을 검출한다.
- [ ] graph-publication profile도 desktop 11 CSS px floor와 collision/clipping gate를 적용받는다.
- [ ] geometry-publication-v1의 axis-free 규칙은 그대로 보존된다.
- [ ] 기존 legacy graph generation 경로는 호환된다.
- [ ] graph publication을 위해 새로운 범용 graph library를 불필요하게 추가하지 않는다.
- [ ] 이 단계만으로 전체 One-Click `PUBLICATION_READY`를 주장하지 않는다.

- [ ] 꼭짓점뿐 아니라 모든 visible 선분 내부 오차와 branch coverage를 독립 검수한다.
- [ ] midpoint-only/점 개수/선분 길이만으로 curve를 PASS하지 않는다.
- [ ] budget 내 상계 확인 불가는 GRAPH_SEGMENT_ERROR_UNVERIFIED로 남긴다.
- [ ] SVG user-space와 실제 reference CSS px 환산을 결박한다.
- [ ] 좌표기하 profile은 equal-unit + geometry/owner + axis/tick 관측을 모두 수행한다.
- [ ] 최소 Graph 4 UID와 실제 7 feature coverage를 별도 matrix로 확인한다.

---

# 34. 이 단계에서 하지 않는 것

- Construction Kernel 재설계
- interactive graph editor
- drag/zoom UI
- 모든 함수의 범용 symbolic domain solver
- 일반 implicit curve 전체
- parametric curve 전체
- polar graph 전체
- 3D surface
- arbitrary piecewise DSL
- 모든 graph에 grid 강제
- PGFPlots 전면 전환
- MathJax/Korean font 최종 배포 방식 확정
- One-Click runner 구현
- production exam JS/SVG 자동 migration

지원 범위 밖의 기능은 후속 capability로 남긴다.

---

# 35. 후속 세부계획과 인터페이스

Detail 02는 다음 artifact를 제공한다.

```text
GraphPlan
GraphFactPlan
DomainTopology
AxisSpec
GraphSamplingResult
GraphPublicationAudit
```

### Detail 03 — Typography & Font

- 함수식 label
- tick exact math
- π / 분수 / 근호
- 좌표값

을 fixed fragment로 만든다.

### Detail 04 — Measured Layout & Publication

- graph label actual metrics
- collision
- owner-aware placement
- viewport/frame repair

를 담당한다.

### Detail 05 — One-Click Runner

GraphPlan을 자동으로 sampling → audit → render로 연결한다.

### Detail 06 — Actual Archive Integration

실제 `mode=sol`, 1440×1000, no-fit에서
graph final bytes를 검증한다.

---

# 36. 최종 한 문장

> **APMath Graph Publication v1은 새 그래프 라이브러리를 만드는 프로젝트가 아니라, 이미 구축된 adaptive function sampling·derivative·axis·viewport·SVG·browser audit를 domain topology와 axis/feature/owner 검증으로 완성해, 함수 그래프와 좌표축도 같은 One-Click Visual Production Engine 안에서 정식 publication capability로 승격시키는 프로젝트다.**