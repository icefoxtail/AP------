# APMath Measured Layout & Publication 세부 구현계획 v1.1

**상위 문서:** `APMath Construction & Visual Production Engine — 최종 구현 계획서`  
**문서 역할:** Detail 04 / Measured Layout & Publication  
**작성일:** 2026-10-05 (Asia/Seoul)  
**상태:** **통합검토 보완 반영 · 계획 v1.1 · 이번 작업 제품 코드 변경 0**  
**v1.0 원문 조사 기준(이력 보존):** `origin/main @ 89462a1c59567a652ab5f500a8b96f4ccaa7052a`

**통합 보완 기준 main:** `3a7b2cb712fb192f3728f4df4a7ccc1e99d79427`  
**개정일:** 2026-10-05 (Asia/Seoul)  
**반영 이슈:** I-04, I-05, D-02  
**적용 관계:** 같은 Detail v1.0의 해당 계약/예시를 v1.1 본문으로 대체한다. 공통 요청·routing·상태의 단일 소유자는 Detail 05 §4/6/7/24–26/53–54다. 원문의 “현재 main 구현” 설명은 원 조사 시점 기록이며 이번에 전체 코드를 다시 조사했다는 뜻이 아니다. 이 문서의 test/qualification checklist는 구현 후 수행할 요구사항이고, 문서 보완은 실행 PASS·ACTIVE·PUBLICATION_READY·Seal 선언이 아니다.

---

## 0. 이 문서의 목적

이 문서는 상위 마스터 계획의 네 번째 세부계획으로, APMath Visual Production Engine의 **실측 기반 label 배치·owner binding·collision 회피·viewport/framing·annotation cue·최종 SVG compose·browser publication gate**를 실제 구현 가능한 수준까지 구체화한다.

앞선 세부계획은 다음을 담당한다.

- Detail 01 — Construction Kernel  
  `ConstructionGraph → ConstructionSnapshot`

- Detail 02 — Function Graph & Coordinate Axis Publication  
  `GraphPlan → GraphSamplingResult / GraphPublicationAudit`

- Detail 03 — Typography & Font  
  `LabelInventory → LabelFragment → MeasuredLabel`

본 문서는 이 결과를 받아 다음을 완성한다.

```text
Frozen model geometry / graph
+ Frozen LabelFragment
+ MeasuredLabel
+ owner / factRole / display intent
→ placement candidates
→ collision / owner-safe evaluation
→ framing / cue repair
→ final layout
→ SVG composition
→ rendered-layout verification
→ publication candidate
```

핵심 목표는:

> **“그림은 수학적으로 맞지만 글자가 겹치거나, 라벨이 owner에서 멀거나, viewBox가 답답하거나, 실제 화면에서 작아지는 문제”를 생성 뒤 수동 수정하는 것이 아니라, 실측값을 기반으로 엔진 내부에서 결정론적으로 해결하는 것**이다.

---

# 1. 최상위 원칙

## 1.1 Geometry/Graph is immutable during layout

layout 단계는 수학 좌표를 바꾸지 않는다.

금지:

- derived point 이동
- 원 중심/반지름 변경
- 직선 기울기 변경
- 함수 sample/model point 변경
- branch 변경
- source/free parameter 몰래 변경

layout이 바꿀 수 있는 것은:

- label position
- label anchor
- annotation radius
- dimension offset
- leader placement
- condition box placement
- viewport/frame
- panel split
- allowed publication-only cue

뿐이다.

---

## 1.2 Measurement before placement

production path에서는:

```text
LabelFragment
→ actual measurement
→ layout
```

순서가 HARD다.

현재의 `approximate_size()`는:

- legacy
- preflight
- cheap early candidate

용도로만 남긴다.

`approximate_size()`만으로 `PUBLICATION_READY`를 만들지 않는다.

---

## 1.3 Owner binding before aesthetics

좋은 위치보다 먼저:

**“이 label이 누구의 label인지 학생이 즉시 이해 가능한가”**

를 판정한다.

우선순위:

1. owner correctness
2. semantic clarity
3. collision-free
4. clipping-free
5. visual naturalness
6. compactness

---

## 1.4 Font shrinking is last resort

충돌 해결 순서:

```text
relocate
→ owner cue 조정
→ framing / viewport expansion
→ leader / dimension
→ panel split
→ 마지막 제한적 font exception
```

기본 font 축소는 자동 repair 1순위가 아니다.

---

# 2. 현재 main의 실제 상태

## 2.1 `label_layout.py`

현재 이미 존재하는 기능:

- `Box`
- overlap / contains
- line-box collision
- point/circle collision
- curve/axis/line obstacle
- 8방향 후보:
  - N
  - NE
  - E
  - SE
  - S
  - SW
  - W
  - NW
- label priority P0~P4
- `preferred`
- `candidateCenters`
- `gaps`
- low priority suppression
- side panel fallback
- unresolved ledger
- repair suggestion:
  - `LEADER_LINE`
  - `VIEWPORT_EXPANSION`
  - `PANEL_SPLIT`

즉 **기본 deterministic layout engine은 이미 있다.**

---

## 2.2 현재 핵심 한계

현재 production 부족점:

1. measurements가 없으면 `approximate_size()`
2. measurement 형식이 `[width,height]`
3. actual ink offset 없음
4. baseline/ascent/descent 없음
5. `basis`가 항상 `APPROXIMATE_BUILD_SIDE_ONLY`
6. 일반 label baseline은:
   `y + height * 0.8`
7. side panel에서 다시 approximate size 사용
8. unresolved label은 final layout에서 빠질 수 있음
9. final browser collision 결과가 자동 repair loop로 되먹임되지 않음
10. stroke-aware obstacle은 browser에서 더 정확하지만 build-side와 완전 결속되지 않음

따라서:

> 현재는 “실측값을 받을 수 있는 구조”이지, “실측이 publication path의 필수 authority인 구조”는 아니다.

---

## 2.3 `publication.py`

현재 geometry publication은 이미:

- source point identity
- segment owner mapping
- duplicate semantic annotation 방지
- angle value parity
- right-angle marker
- reflex/straight angle semantics
- length owner
- area region
- owner wedge
- owner polygon
- annotation factRole

등을 갖는다.

특히 `box_owned()`는:

- region
- angle wedge

안에서 label box가 실제 owner 영역 안에 있는지 확인한다.

이 자산은 재사용한다.

---

## 2.4 `viewport.py`

현재:

- safe margin
- equal-unit geometry
- unequal-unit graph
- critical geometry가 edge/outside일 때 8% 확장
- `screen()`
- model transform
- origin/sx/sy

를 갖는다.

현재 한계:

- measured label extents 기반 framing 없음
- owner cue / dimension extents 포함한 final frame optimization 없음
- repair attempt별 frame revision contract 없음

---

## 2.5 `svg_composer.py`

현재 composer는:

- geometry primitive layer
- label layer
- condition box
- owner metadata
- style token
- publication profile
- accessibility title/desc
- deterministic ordering

을 제공한다.

현재 한계:

- style token을 다시 load
- label `<text>` 기반
- final fragment abstraction 없음
- layout이 준 baseline/box를 그대로 신뢰
- final fragment SHA / measurement SHA binding 없음

Detail 03이 만든 fragment contract를 소비하도록 바꿔야 한다.

---

## 2.6 `verify-rendered-layout.mjs`

현재 actual browser에서 이미:

- `getBBox`
- `getBoundingClientRect`
- CTM
- stroke width
- label-label overlap
- label-geometry collision
- condition box overflow
- text clipping
- geometry viewport clipping
- leader crossing
- missing glyph
- 11px floor

를 검사한다.

즉 이 파일은 **최종 layout qualification의 핵심 자산**이다.

이번 단계의 주요 작업은:

> browser 결과를 PASS/FAIL 보고로 끝내지 않고, layout repair input으로 구조화해 다시 생성하게 만드는 것.

---

# 3. 입력 계약

Detail 04의 최소 입력:

```text
ModelSnapshot
or
GraphSamplingResult

+ PublicationProfile
+ LabelInventory
+ LabelFragmentManifest
+ MeasuredLabel[]
+ OwnerBindings
+ RequiredDisplayFacts
```

---

## 3.1 ModelSnapshot

Geometry:

- model-space point/line/circle/segment
- source identity
- factRole
- annotation owners

Graph:

- branch
- axis
- tick
- feature
- curve owner

layout은 model을 read-only로 소비한다.

---

## 3.2 MeasuredLabel

Detail 03에서 받은:

- fragment SHA
- inkBounds
- advance
- baseline
- ascent
- descent
- intrinsic dimensions
- profile SHA
- measurement environment SHA

를 사용한다.

## 3.3 owner-bound fragment 입력 확인

D03 §24의 owner-bound cache를 소비한다. labelId만이 아니라 full fragment identity, owner/ownerKind/factRole, fragment SHA, profile/measurement environment가 manifest·metrics·OwnerBindings에서 일치해야 한다. layout은 다른 owner의 fragment를 받은 뒤 metadata를 고쳐 쓰지 않는다. mismatch는 해당 input 오류다.

좌표기하 model은 D01 ConstructionSnapshot + D02 axis/tick를 동일 equal-unit frame에서 함께 소비한다. circle/angle의 Euclidean 의미와 axis 단위를 framing 중 보존한다.

---

# 4. LayoutInput v1

제안:

```json
{
  "schemaVersion": "apmath-layout-input-v1",
  "modelSha256": "...",
  "profileSha256": "...",
  "labelInventorySha256": "...",
  "measurementManifestSha256": "...",
  "viewportIntent": {},
  "labels": [],
  "obstacles": [],
  "ownerRegions": [],
  "repairBudget": {}
}
```

---

# 5. LabelPlacementSpec

각 label은:

```json
{
  "id": "A-name",
  "fragmentIdentity": {"questionUid":"...","surface":"SOLUTION_VISUAL","visualAssetKey":"...","panelId":null,"labelId":"A-name","occurrence":0},
  "fragmentSha256": "...",
  "owner": "A",
  "ownerKind": "POINT",
  "priority": 0,
  "required": true,
  "anchor": [100,200],
  "placementClass": "POINT_RADIAL",
  "preferred": ["NW","N","W"],
  "allowed": ["N","NE","E","SE","S","SW","W","NW"],
  "minGap": 8,
  "maxLeaderLength": null
}
```

fragmentIdentity/owner는 D03 manifest와 같아야 한다. 배치는 frozen fragment 바깥 wrapper의 transform만 바꾼다. namespace/id/owner를 composer 단계에서 재작성하면 hash/owner audit가 실패해야 한다.

---

# 6. Placement class

v1 placement class:

- `POINT_RADIAL`
- `SEGMENT_ADJACENT`
- `ANGLE_WEDGE`
- `REGION_INTERIOR`
- `GRAPH_CURVE_NEAR`
- `AXIS_TICK`
- `AXIS_LABEL`
- `DIMENSION_LABEL`
- `CONDITION_BOX`
- `PANEL_ITEM`
- `FREE_ANNOTATION`

각 class는 candidate 생성 규칙이 다르다.

---

# 7. Point label layout

현재 8방향 후보를 유지한다.

보강:

- owner point에서 radial distance
- adjacent line directions
- local free sector
- canvas edge
- nearby label density

를 점수에 반영한다.

---

## 7.1 forbidden sector

point에서 나가는:

- segment
- line
- tangent
- leader
- angle arc

방향 주변은 forbidden sector로 본다.

label을 선 위에 얹는 것보다 빈 sector 우선.

---

## 7.2 deterministic tie-break

후보 점수 동일 시:

```text
preferred direction rank
→ smaller displacement
→ reading-order preference
→ stable coordinate tuple
```

순으로 결정.

random 사용 금지.

---

# 8. Segment/length label

기본 모드:

`ADJACENT`

선분 중심 근처에서:

- segment normal 방향
- owner side
- endpoint clearance
- 다른 geometry

를 고려한다.

---

## 8.1 dimension fallback

ADJACENT가 애매하거나 밀집하면:

`DIMENSION`

으로 승격.

dimension은:

- offset line
- end caps
- value label

을 하나의 owner-bound group으로 다룬다.

---

## 8.2 owner clarity

같은 값이 여러 선분에 있을 수 있으므로
text value만으로 중복 판정하지 않는다.

owner id가 다르면 별개 annotation이다.

---

# 9. Angle label

현재 publication의 owner wedge를 재사용한다.

각도 label은:

- 실제 vertex
- 두 ray
- sweep
- reflex 여부
- marker radius

와 결속한다.

---

## 9.1 radius hierarchy

한 vertex에 여러 angle:

- arc radius 계층화
- label radius 계층화

하여 서로 겹치지 않게 한다.

---

## 9.2 right angle

90도에서 square marker가 owner를 충분히 명확하게 만들면
숫자 `90°`를 중복 강제하지 않는다.

source/solution이 숫자 표시를 요구할 때만 추가.

---

# 10. Region/area label

가능하면:

`REGION_INTERIOR`

를 사용한다.

현재 `_interior_candidates()`의 clearance 개념을 확장한다.

점수:

- boundary clearance
- center distance
- geometry overlap
- other label overlap
- visual balance

---

## 10.1 concave region

현재 `box_owned()`처럼
corner만 inside인지 보는 것이 아니라
경계가 box 내부를 가로지르는지도 확인한다.

유지.

---

## 10.2 leader fallback

내부 공간이 부족하면:

- short region leader
- label outside

허용.

leader는 region boundary와 연결되고
다른 핵심 geometry를 가로지르지 않아야 한다.

---

# 11. Graph label layout

Detail 02와 연결.

종류:

- function label
- tick label
- axis label
- root/intersection label
- asymptote label
- tangent equation

---

## 11.1 function label

curve의 representative segment 근처에 배치.

조건:

- curve owner 명확
- 다른 curve와 더 가까워지지 않음
- tangent/axis와 혼동 없음
- local slope가 지나치게 가파르면 alternative point 사용

---

## 11.2 tick label

tick 값은 anchor가 고정.

움직일 수 있는 것은:

- orthogonal offset
- text-anchor
- noncritical tick suppression

값/위치는 바꾸지 않는다.

---

# 12. ObstacleModel v2

현재 obstacles:

- label
- conditionBox
- tick
- indicator
- rectangle
- point
- circle
- line
- axis
- auxiliary
- leader
- curve

를 유지한다.

보강:

```json
{
  "id": "...",
  "kind": "...",
  "geometry": {},
  "strokeWidth": 0,
  "importance": 0,
  "owner": "...",
  "occlusionPolicy": "HARD"
}
```

---

## 12.1 obstacle importance

예:

- decisive main curve → HARD
- source point → HARD
- angle cue → HARD
- auxiliary line → MEDIUM
- decorative guide → LOW

label 후보 평가에서 penalty를 다르게 줄 수 있다.

단 HARD overlap은 항상 reject.

---

# 13. Stroke-aware layout

build-side에서도 실제 publication stroke width를 profile에서 읽는다.

label box와 line collision 시:

```text
line geometry
+ strokeWidth/2
+ safety pad
```

을 사용.

browser observer의 실제 stroke measurement와 비교해
profile mismatch가 있으면 evidence fail.

---

# 14. Safe area

현재 `safe_area`를 유지.

production에서는 safe area가 profile/versioned contract가 된다.

구성:

- outer viewport
- publication safe margin
- panel reservation
- clipping reserve
- annotation reserve

---

## 14.1 safe margin

현재 default `32`를 임의 magic number로 두지 않고
ResolvedPublicationProfile에 포함.

변경 시 profile SHA 변화.

---

# 15. Candidate generation

후보 생성은 class별 deterministic function.

각 candidate는:

```json
{
  "labelId": "...",
  "candidateId": "...",
  "box": {},
  "baseline": {},
  "transform": {},
  "ownerScore": 0,
  "collisionScore": 0,
  "edgeScore": 0,
  "distanceScore": 0,
  "totalScore": 0,
  "rejections": []
}
```

---

# 16. Candidate scoring

HARD rejection 이후 soft score.

예:

```text
owner clarity         highest weight
preferred direction
distance from owner
distance from edge
neighbor balance
reading order
leader length
visual compactness
```

정확한 weight는 representative fixtures에서 고정한다.

학습된 ML optimizer는 v1에 넣지 않는다.

---

# 17. Required vs suppressible

required label:

- 절대 suppress 불가

suppressible:

- 낮은 우선순위 decorative tick
- redundant optional annotation

---

## 17.1 current suppression

현재:

```text
allowSuppress = true
and priority >= 3
```

이면 suppress 가능.

production에서는:

`required=false`

가 추가로 명시돼야 한다.

priority만으로 필수 label을 삭제하지 않는다.

---

# 18. Panel fallback

현재 side panel은 재사용하되
production에서는 measured fragment를 사용한다.

현재 side panel이 다시 approximate size를 쓰는 부분은 제거.

---

## 18.1 panel conditions

허용:

- coordinate list
- condition list
- long algebra label
- case summary

금지:

- point name
- angle owner
- segment length owner

처럼 geometry owner와 떨어지면 의미가 약해지는 label.

---

# 19. Viewport / framing repair

현재 viewport는 model bounds + critical fact로 정한다.

production repair에서 다음을 순서대로 적용.

### F0
frozen model viewport

### F1
label-safe margin expansion

### F2
geometry-preserving frame expansion

### F3
composition-aware panel allocation

### F4
validated panel split

---

## 19.1 geometry invariance

frame이 바뀌어도:

Geometry profile:

- equal-unit 유지
- model distance/angle invariant

Graph profile:

- declared aspect policy 유지
- axis/tick transform 재검

---

## 19.2 no hidden scale change

frame repair가:

- x축만 임의 확대
- y축만 임의 확대

해서 geometry circle을 ellipse처럼 만들면 안 됨.

Graph는 `INDEPENDENT_AXIS_SCALE`이 profile에 이미 허용될 때만 가능.

---

# 20. Annotation cue repair

label 이동만으로 owner clarity가 떨어질 때:

- angle arc radius
- dimension offset
- leader
- endpoint cap
- region leader

등을 조정.

수학 fact는 그대로.

---

## 20.1 cue revision binding

repair 때 annotation primitive가 바뀌면:

- annotation spec SHA
- layout SHA
- final SVG SHA

가 새 attempt에 결박된다.

과거 audit 재사용 금지.

---

# 21. Leader policy

leader는 마지막 수단 중 하나.

기준:

- 짧게
- owner에 직접
- 핵심 geometry crossing 금지
- label과 owner 사이에 다른 object를 가리키지 않음

---

## 21.1 leader crossing

현재 browser observer의 `LEADER_CROSSING`을 재사용.

보강:

- same-owner region exit 허용
- unrelated geometry crossing fail

---

# 22. Condition box

condition box는:

- actual fragment bounds
- padding
- line spacing

을 기준으로 크기 결정.

고정 approximate row height 제거.

---

## 22.1 box overflow

현재 browser observer의:

`CONDITION_BOX_OVERFLOW`

유지.

build-side에서도 measured metrics로 사전 방지.

---

# 23. Multi-panel layout

v1은 무제한 auto panelizer를 만들지 않는다.

허용되는 검증된 pattern:

- `CASE_2UP`
- `BEFORE_AFTER`
- `CONTEXT_TO_REDUCTION`
- `GEOMETRY_TO_ALGEBRA`

template가 없으면 자동 split하지 않는다.

---

## 23.1 panel split trigger

조건 예:

- required labels unresolved
- same region collision 반복
- repair attempts exhausted

하지만 panel split이 수학 의미를 흐리면 FAIL.

---

# 24. LayoutResult v1

```json
{
  "schemaVersion": "apmath-layout-result-v1",
  "modelSha256": "...",
  "profileSha256": "...",
  "measurementManifestSha256": "...",
  "labels": [],
  "annotationCues": [],
  "viewport": {},
  "suppressed": [],
  "unresolved": [],
  "repairs": [],
  "status": "PASS"
}
```

---

## 24.1 placed label

```json
{
  "id": "...",
  "fragmentSha256": "...",
  "box": {},
  "baseline": {},
  "placementClass": "...",
  "candidateId": "...",
  "owner": "...",
  "placementReason": "..."
}
```

---

# 25. Layout status

- `PASS`
- `POLISH_REQUIRED`
- `LAYOUT_UNRESOLVED`
- `PANEL_REQUIRED`
- `UNSUPPORTED_COMPOSITION`

`PASS`는:

- required unresolved 0
- hard collision 0
- clipping risk 0
- owner ambiguity 0

을 의미.

---

# 26. Browser feedback loop

최종 SVG 생성 후 browser observer를 실행.

결과를:

```json
{
  "labelId": "...",
  "error": "LABEL_GEOMETRY_COLLISION",
  "actualBounds": {},
  "relatedGeometryId": "..."
}
```

형태로 구조화.

runner가 이를 layout repair input으로 사용한다.

---

# 27. Build-side vs Browser-side

build-side:

- candidate pruning
- deterministic placement
- cheap geometry collision

browser-side:

- actual paint bounds
- actual stroke
- actual transform
- actual glyph
- actual clipping

browser가 최종 authority.

---

## 27.1 disagreement

build-side PASS + browser FAIL이면:

browser FAIL.

browser PASS + required semantic owner FAIL이면:

semantic FAIL.

한 축이 다른 축을 상쇄하지 않는다.

---

# 28. Bounded repair

최초 candidate 이후 v1 내부 repair max:

**3회**

순서:

### Attempt 1
label relocation

### Attempt 2
annotation cue / dimension / leader

### Attempt 3
framing / validated panel

---

## 28.1 stagnation

다음이면 중단:

- same SVG hash
- same layout hash
- same unresolved set
- no score improvement
- same browser error set

상태:

`LAYOUT_STAGNATION`

---

# 29. Repair scope

하나의 label 문제라면:

- 해당 label
- 충돌 이웃
- owner cue
- local frame

만 다시 계산.

모든 label 전체를 매번 초기화하지 않는다.

단 frame 변화는 전체 projection/layout에 영향이 있으므로
affected scope 확대.

---

# 30. Determinism

같은:

- model
- label fragments
- measurements
- publication profile
- repair state

면 같은 LayoutResult와 SVG를 목표로 한다.

---

# 31. Composer v2

Detail 03의 frozen fragment를 받는다.

composer는:

- geometry primitive
- annotation cue
- placed fragment
- metadata

만 materialize.

---

## 31.1 no style reload

현재 `svg_composer.py`가 직접 style token을 다시 load하는 구조를
production-v2에서는 제거.

입력으로:

`ResolvedPublicationProfile`

을 받는다.

---

## 31.2 final SVG metadata

최소:

- engine version
- publication profile id/hash
- model SHA
- layout SHA
- typography profile SHA
- measurement manifest SHA
- graph/construction plan SHA
- provenance
- axis scale mode

---

# 32. Final SVG structure

권장 layer:

```text
background
base geometry / curves
secondary geometry
indicators
annotation cues
leaders
labels
condition boxes / panels
```

label fragment 내부 layer와 외부 geometry layer를 섞지 않는다.

---

# 33. Accessibility

유지:

- `<title>`
- `<desc>`
- role=img

보강 가능:

- label semantic metadata
- hidden accessible text

단 hidden text가 visual audit를 우회하는 정답 proof가 되면 안 됨.

---

# 34. Rendered layout audit v2

현재 `verify-rendered-layout.mjs` 확장.

필수 수집:

- label group bounds
- fragment id/SHA
- owner
- priority
- required
- actual stroke
- CTM
- effective font
- paint bounds
- viewBox

---

# 35. HARD publication checks

공통:

- required label missing = FAIL
- missing glyph = FAIL
- hard label-label overlap = FAIL
- hard label-geometry collision = FAIL
- text clipping = FAIL
- geometry clipping = FAIL
- condition box overflow = FAIL
- leader crossing = FAIL
- base label < 11 CSS px = FAIL

---

# 36. Owner ambiguity audit

단순 overlap 외에도:

- label이 다른 point에 더 가까움
- function label이 다른 curve에 더 가까움
- length label이 parallel nearby segment와 혼동
- angle label이 adjacent angle wedge로 넘어감

같은 owner ambiguity를 검사한다.

v1에서는 closed heuristics로 구현.

---

# 37. Naturalness score

HARD gate와 별도.

soft diagnostic:

- excessive leader
- label 너무 멀음
- frame whitespace imbalance
- annotation density
- panel 과다
- tick clutter

soft score가 낮으면:

`POLISH_REQUIRED`

가능.

그러나 HARD PASS를 대신하지 않는다.

---

# 38. Geometry publication 연결

기존:

`geometry-publication-v1`

의 semantic owner 규칙 유지.

새 production layout은:

- angle wedge
- length owner
- region owner
- point identity

를 소비.

geometry model을 수정하지 않음.

---

# 39. Graph publication 연결

Detail 02의:

- GraphPlan
- AxisSpec
- RequiredFeature
- GraphFactPlan

을 소비.

추가 obstacle:

- axis
- ticks
- curve
- open/closed markers
- asymptote
- tangent

---

# 40. Typography 연결

Detail 03의:

- LabelFragment
- MeasuredLabel
- TypographyProfile

을 소비.

layout 단계에서:

- font family 결정 금지
- MathJax 실행 금지
- label text rewrite 금지

---

# 41. Cache

## layout cache key

```text
model SHA
+ fragment manifest SHA
+ measurement manifest SHA
+ publication profile SHA
+ annotation spec SHA
+ viewport intent SHA
+ layout engine version
```

---

## 41.1 local placement cache

개별 label:

- owner geometry hash
- fragment measurement hash
- local obstacle hash

로 부분 재사용 가능.

---

# 42. Invalidation

## geometry node 변경

무효화:

- affected annotation
- local labels
- viewport if bounds change
- SVG
- render

---

## label text/font 변경

무효화:

- fragment/measurement
- affected label
- collision neighbors
- layout
- SVG/render

---

## viewport 변경

무효화:

- projection
- all placed coordinates
- graph sampling screen refinement
- SVG/render

---

## annotation cue 변경

재사용:

- model
- label fragment

재실행:

- obstacles
- affected layout
- SVG/render

## owner/fragment identity 변경

해당 owner-bound fragment → measurement → local placement/collision → SVG/audit/Archive를 무효화한다. semantic text가 같다는 이유로 기존 owner의 fragment를 재사용하지 않는다. 위치만 바뀌면 기존 fragment/metrics를 재사용한다.

좌표기하 frame 변경은 geometry+axis projection과 둘의 독립 audit 모두에 영향을 준다. model-space construction 자체가 같으면 다시 계산하지 않는다.

---

# 43. 신규 파일 제안

## `visual_engine/layout_contracts.py`

필요할 경우:

- LayoutInput
- LayoutResult
- placement classes
- candidate record

schema가 JSON 중심이면 production contracts에 통합 가능.

---

## `visual_engine/measured_layout.py`

책임:

- typed metrics
- candidate generation
- scoring
- placement
- local repair
- requiredness
- LayoutResult

현재 `label_layout.py`를 확장해 충분하다면
새 파일로 분리하지 않는다.

---

## `visual_engine/framing.py`

frame logic이 커질 경우에만 분리.

책임:

- label-safe frame
- equal-unit preservation
- graph aspect policy
- panel reservation

---

# 44. 기존 파일 수정

## `label_layout.py`

핵심 변경:

- `[width,height]` → typed MeasuredLabel
- basis 구분
- actual baseline
- required label
- placement class
- stroke-aware obstacle
- candidate trace
- owner ambiguity
- side panel measured size
- local repair

legacy API compatibility 유지.

---

## `publication.py`

- owner candidate metadata 제공
- cue repair parameters versioned
- layout이 semantic owner를 변경 못하게 contract 강화

---

## `viewport.py`

- publication profile 입력
- measured extents
- framing attempts
- equal/aspect policy hard binding

---

## `svg_composer.py`

- ResolvedProfile
- LayoutResult
- frozen fragments
- metadata SHA binding
- no style reload

---

## `verify-rendered-layout.mjs`

- label group observer
- required inventory
- owner ambiguity
- fragment/profile binding
- structured repair errors

---

# 45. 구현 단계

## Phase 0 — layout baseline freeze

고정:

- existing 5 geometry fixture
- graph fixture
- current layout output
- current browser collisions
- support matrix

종료:

legacy와 production-v2 차이를 명확히 기록.

---

## Phase 1 — typed measurement ingestion

구현:

- MeasuredLabel
- fragment SHA check
- baseline
- ink bounds
- requiredness

종료:

production-v2에서 approximate measurement 없이 layout 가능.

---

## Phase 2 — placement classes

구현:

- point
- segment
- angle
- region
- graph
- tick
- condition box

종료:

owner-specific candidate 생성.

---

## Phase 3 — scoring / owner clarity

구현:

- hard reject
- deterministic score
- tie-break
- trace

종료:

같은 입력 → 같은 placement.

---

## Phase 4 — stroke / obstacle / browser parity

구현:

- profile stroke
- build obstacle
- actual browser comparison

종료:

build-side collision model이 browser와 허용오차 내 일치.

---

## Phase 5 — framing / cue repair

구현:

- dimension
- leader
- frame expansion
- panel reservation

종료:

수학 model 불변 상태에서 해결.

---

## Phase 6 — bounded repair loop interface

Layout engine 자체는:

```text
candidate
→ error
→ revised layout request
```

를 제공.

runner가 최대 3회 orchestrate.

종료:

stagnation detectable.

---

## Phase 7 — composer v2

구현:

- final fragments
- profile snapshot
- final metadata

종료:

사후 문자열 patch 없음.

---

## Phase 8 — rendered qualification

실제 browser에서:

- collision
- clipping
- owner
- font
- bounds

검사.

종료:

`MEASURED_LAYOUT_CAPABILITY_QUALIFIED`

---

# 46. 최소 synthetic fixture

필수:

1. point labels 8-direction crowding
2. same-value two segment owners
3. multi-angle same vertex
4. reflex angle
5. concave region
6. dense triangle
7. circle tangent labels
8. dimension fallback
9. leader fallback
10. side condition box
11. long Korean + math
12. fraction/root label
13. graph two curves + labels
14. dense graph ticks
15. graph intersection label
16. viewport edge critical label
17. panel split case
18. impossible layout negative

---

# 47. Negative/mutation tests

- measurement width 2x
- wrong baseline
- wrong owner
- required=false mutation
- point moved near other owner
- label forced outside safe area
- dimension line crossing
- leader crossing
- clipped label
- hidden required label
- frame unequal scale mutation
- graph axis scale mutation
- fragment SHA mismatch

각각 FAIL 또는 POLISH_REQUIRED가 기대대로 발생해야 함.

---

# 48. 실제 문항 qualification

최소 유형:

- 단순 triangle point/length
- 다중 angle
- circle/tangent
- area region
- fraction coordinate
- long math expression
- Korean mixed annotation
- function graph
- dense graph tick/feature

실제 source/solution을 독립 검토한 후 UID 고정.

---

# 49. 내부 완료 gate

이 Detail 04 완료 상태:

`MEASURED_LAYOUT_CAPABILITY_QUALIFIED`

의미:

- actual fragment metrics
- owner-aware layout
- collision
- framing
- cue repair
- composer v2
- browser layout audit

까지 준비됨.

아직:

- One-Click runner
- actual Archive integration
- request resolver
- independent visual review

가 남아 있으므로
전체 `PUBLICATION_READY`는 아님.

---

# 50. 완료 기준

- [ ] production layout은 approximate size 없이 actual MeasuredLabel을 사용한다.
- [ ] baseline/ascent/descent/ink bounds가 placement에 반영된다.
- [ ] required label inventory 누락 0.
- [ ] point/segment/angle/region/graph owner-specific placement가 있다.
- [ ] owner ambiguity가 HARD/diagnostic로 판정된다.
- [ ] stroke width가 obstacle 계산에 반영된다.
- [ ] label-label hard overlap 0.
- [ ] label-geometry critical overlap 0.
- [ ] clipping 0.
- [ ] condition box overflow 0.
- [ ] leader crossing 0.
- [ ] geometry equal-unit / graph aspect policy가 framing 중 보존된다.
- [ ] collision 해결을 위해 model coordinate를 바꾸지 않는다.
- [ ] font shrinking이 기본 repair가 아니다.
- [ ] dimension/leader/frame/panel repair가 versioned attempt로 기록된다.
- [ ] same input은 deterministic LayoutResult를 만든다.
- [ ] browser failure가 structured repair input으로 반환된다.
- [ ] bounded repair stagnation을 검출한다.
- [ ] final composer는 frozen fragment와 ResolvedProfile만 사용한다.
- [ ] composer가 style/font를 다시 결정하지 않는다.
- [ ] final SVG에 model/profile/layout/measurement SHA가 결박된다.
- [ ] geometry-publication과 graph-publication이 같은 layout infrastructure를 사용한다.
- [ ] legacy path는 호환된다.
- [ ] Detail 04 완료만으로 전체 PUBLICATION_READY를 주장하지 않는다.

- [ ] full fragment identity/owner/hash를 D03 manifest 및 metrics와 일치시킨다.
- [ ] layout/composer가 다른 owner fragment를 사후 덮어쓰지 않는다.
- [ ] coordinate-geometry-publication-v1에서 axis와 Euclidean model의 equal-unit을 보존한다.
- [ ] D08 UID×feature matrix에 실제 dense owner/typography/layout coverage를 기록하며 UID 수만으로 대체하지 않는다.

---

# 51. 이 단계에서 하지 않는 것

- Construction math 재계산
- function sampling math 재작성
- MathJax typesetting 구현
- font subset tool 자체 개발
- LLM 기반 자유 배치
- ML optimizer
- 무제한 auto panel generation
- arbitrary decorative redesign
- mobile 절대 font floor 신설
- production exam asset 자동 교체
- 전체 Archive release 승인

---

# 52. 후속 세부계획과 인터페이스

Detail 04가 제공:

```text
LayoutInput
LayoutResult
PlacedLabel[]
AnnotationCueRevision
ResolvedViewport
FinalCompositionPlan
RenderedLayoutAudit
```

### Detail 05 — One-Click Runner

- typeset
- measurement
- layout
- compose
- browser verify
- bounded repair

를 자동 orchestrate.

### Detail 06 — Actual Archive Integration

final composition을 실제 Archive `mode=sol` 화면에서 검증.

### Detail 07 — Problem → Visual Request

문항 단일 지정으로 필요한 model/labels/profile을 자동 준비.

---

# 53. 최종 한 문장

> **APMath Measured Layout & Publication v1은 이미 존재하는 deterministic label layout과 publication owner 규칙을 버리지 않고, 실제 최종 fragment의 실측값을 강제 입력으로 승격해 owner-safe 배치·collision 해결·framing·annotation cue·SVG compose·browser 검증을 하나의 결정론적 publication 계층으로 완성하는 프로젝트다.**