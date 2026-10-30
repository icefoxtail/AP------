### 3-1. 작도 연산: 내분·외분점, 무게중심, 대칭점, 수선, 평행이동

`construction-spike-v1`의 파생 노드다. 구하는 점·직선은 이 연산으로 쓰고 좌표를 직접 쓰지 않는다(좌표를 아는 주어진 점만 `SOURCE_POINT`).

| op | inputs | args | 출력 | 뜻 |
|---|---|---|---|---|
| `DIVISION_POINT` | `[A,B]` (서로 다른 POINT) | `{m,n,mode}` m, n은 양수 typedScalar, mode는 `INTERNAL` 또는 `EXTERNAL` | POINT | AP:PB=m:n. 내분은 선분 안, 외분은 m>n이면 B 바깥, m<n이면 A 바깥. 외분은 m≠n |
| `CENTROID` | 세 꼭짓점 POINT (한 직선 위에 있지 않음) | `{}` | POINT | 삼각형의 무게중심 |
| `POINT_REFLECTION` | `[P,중심]` | `{}` | POINT | 중심에 대한 P의 대칭점. 원점 대칭이면 중심은 `NORMALIZATION_ORIGIN` 노드 |
| `LINE_REFLECTION` | `[P,직선]` | `{}` | POINT | 직선에 대한 P의 대칭점(P가 직선 위면 거절) |
| `PERPENDICULAR_THROUGH` | `[P,직선]` | `{}` | LINE | P를 지나고 직선에 수직인 직선 |
| `TRANSLATE_POINT` / `TRANSLATE_LINE` | `[P]` / `[직선]` | `{dx,dy}` typedScalar, 둘 다 0은 안 됨 | POINT / LINE | x축 방향 dx, y축 방향 dy만큼 평행이동한 점·직선 |

- 비 `m:n`은 풀이에 적힌 수 그대로 쓴다. 문자(`m:n`, `t:1-t`)나 음수 비는 지원하지 않는다. UNSUPPORTED를 쓴다.
- 평행이동도 풀이의 수(`dx`, `dy`)를 그대로 쓴다. 두 점 사이 벡터나 문자 이동량은 지원하지 않는다.
- `lineLabels`(직선 식 라벨)는 `SOURCE_LINE`에만 붙는다. `PERPENDICULAR_THROUGH`, `TRANSLATE_LINE`으로 만든 직선에는 식 라벨을 못 붙이니(`INVALID_LINE_LABEL`), 구한 직선은 그 위의 점(좌표 라벨)으로 위치를 보이고 식은 풀이 글에 둔다.
- 풀이가 쓰는 이름이 A′, T₁처럼 프라임·아래첨자를 가지면 id는 간단한 ASCII(A, T1)로 두고 plan 최상위 `pointNames`에 화면 이름을 쓴다(4절).
- 원 `x²+y²+ax+by+c=0`을 원점 대칭한 그림처럼 원을 직접 옮기는 연산은 없다. 중심만 `POINT_REFLECTION`으로 옮기고 원은 `CIRCLE_CENTER_RADIUS`로 다시 그린다.
- 엔진은 SymPy로 정확한 값을 계산하고, 독립 관측기(CindyJS)가 같은 입력에서 Mid/Join/Meet, 점·직선 대칭 변환, 평행이동으로 다시 만들어 비교한다. 내분·외분점은 CindyJS에 비율 연산이 없어 관측기가 내분·외분 공식으로 따로 계산한다. 값이 다르면 `MODEL_PLAN_MISMATCH`다.


### 3-8. 중학교 평면도형: 각·선분·호 표식이 있는 축 없는 그림 (`PLANE_FIGURE_v1`, `planeMarks`)

삼각형·사각형·원 문항처럼 **좌표축이 필요 없고 각 크기, 같은 길이, 평행, 호의 크기를 보여 주는** 그림에 쓴다. `construction-spike-v1` plan에 `realization:{"recipeId":"PLANE_FIGURE_v1","unit":"source-length","reflectionEquivalent":false}`를 쓰면 축, 눈금, 단위점이 없는 그림이 되고(좌표띠와 `coordinateLabels`는 쓰지 않는다), 점은 엔진 내부에 정확한(또는 고정밀) 좌표를 가진다. 조건: `SOURCE_POINT`가 하나 이상, `NORMALIZATION_*` 노드는 없다. `coordinateCanvas`(384~720 x 320~600)를 쓸 수 있다. 렌더 러너는 이 그림을 `full` 크기로 잰다.

**점 놓기.** 좌표를 아는 점은 `SOURCE_POINT`, 길이와 각으로 정해지는 점은 `POLAR_POINT`다.

| op | inputs | args | 뜻 |
|---|---|---|---|
| `POLAR_POINT` | `[중심, 기준점]` (서로 다른 POINT) | `{length, angleDeg, turn}` length는 양수, angleDeg는 0 초과 360 미만 typedScalar(`40`, `"75"`), turn은 `CCW` 또는 `CW` | 중심에서 거리 length, 방향은 반직선 중심→기준점을 angleDeg만큼 돌린 곳 |

- 30°, 45°, 60°처럼 닫힌 꼴이 있는 각은 정확한 근호로, 40°, 75°처럼 없는 각은 엔진이 22자리 유리수로 계산한다(모델에는 34자리 `decimal`로 나오고 가짜 정확값은 만들지 않는다). 독립 관측기(Cindy)는 `Math.cos/sin`으로 따로 다시 계산한다.
- 기준 방향이 필요하면 숨은 보조점을 쓴다: `TRANSLATE_POINT`로 중심을 (1,0)만큼 옮긴 점(`factRole:DERIVED_INTERMEDIATE`, `displayPoints`에서 뺀다, 평행선·수직선과 같은 방식). 각이 주어진 문항은 반직선을 `POLAR_POINT(길이 1)`로 만들고 `LINE_THROUGH` 두 개의 `LINE_INTERSECTION`으로 꼭짓점을 얻으면 길이가 무리수여도 정확히 그려진다.
- 보조 선·점은 `displayLines`, `displayPoints`에서 빼서 숨긴다. 화면에 나오는 선분은 `displaySegments`가 정한다.
- **이름 없는 점**(원문 그림에 점 이름이 없을 때 이름 "A"를 지어 붙이지 않는다): 축 없는 평면도형과 축이 있는 좌표 작도(3-10절)에서는 `SOURCE_POINT`도 `hiddenPointNames`에 넣을 수 있다(점은 `displayPoints`에 남고 `planeMarks`·`displaySegments`가 참조해도 되며 이름만 숨는다). 최상위 `"hiddenPointStyle":"NONE"`(기본 `"DOT"`=이름 없는 점 표식)이면 숨긴 점에 점 표식도 그리지 않는다(교과서식 교점·꼭짓점). 숨긴 점 중 **일부만** 점 표식을 빼려면(좌표 그림에서 읽는 점은 점을 두고 점선의 수선의 발만 빼는 경우) 기본 스타일에 `"unmarkedPointNames":["Q4x","Q4y"]`를 쓴다: 이 id만 점이 없고 나머지 숨긴 점은 점이 남는다.
- 숨긴 점을 `pointNames`·`coordinateLabels`에 넣거나 `caption`·표식 라벨(`angles`/`arcs`/`regions`의 `label`, `expressionLabels`, `scalarLabels`)이 그 id를 글자로 쓰면 거절된다: `INVALID_HIDDEN_POINT_NAMES`, `POINT_NAME_TARGET_HIDDEN:<id>`, `HIDDEN_POINT_NAMED_IN_TEXT:<id>`. `hiddenPointStyle`은 `"DOT"`·`"NONE"`만 되고(`INVALID_HIDDEN_POINT_STYLE`) `"NONE"`은 평면도형이나 좌표 작도에 숨긴 점이 있을 때만 쓴다(`HIDDEN_POINT_STYLE_REQUIRES_PLANE_FIGURE`, `HIDDEN_POINT_STYLE_WITHOUT_HIDDEN_POINTS`). `unmarkedPointNames`는 숨긴 점의 부분 집합이어야 하고 중복·빈 목록이 안 되며(`INVALID_UNMARKED_POINT_NAMES`) `"NONE"`과 같이 쓸 수 없다(`UNMARKED_POINT_NAMES_WITH_STYLE_NONE`).
- 독립 관측기는 plan에서 숨긴 점을 따로 읽어 그 위치에 점 표식이 있으면 `HIDDEN_POINT_MARKER_PRESENT`/`HIDDEN_POINT_MARKER_AT_POINT`, 숨기지 않은 점에 표식이 없으면 `POINT_MISSING`, 남는 표식이 있으면 `UNEXPECTED_POINT_MARKER`로 FAIL한다.

**`displaySegments` 추가 필드.** `dashed:true`(보조선 점선), `arrow:"START"|"END"|"BOTH"`(반직선·연장선의 화살촉, 끝점에 정확히 놓인다). 축 없는 평면도형과 축이 있는 좌표 작도 plan(3-10절)에서 된다(`DISPLAY_SEGMENT_STYLE_INVALID`, `DISPLAY_SEGMENT_STYLE_REQUIRES_PLANE_FIGURE`). `emphasis:"BOLD"|"ACCENT"`는 **그 선분만** 굵게(BOLD) 또는 굵은 빨강(ACCENT)으로 그린다: 수선 AB, 6cm 변처럼 문제가 가리키는 변에 쓰고, 나머지 선분은 기본 모양이다(굵은 선분은 다른 선분 위에 그려진다. 알 수 없는 값은 `DISPLAY_SEGMENT_EMPHASIS_INVALID`). 관측기는 plan이 말한 선분만 굵기(3.0px 이상)·색이 강조 스타일이고 나머지는 기본 스타일인지 최종 SVG에서 읽는다(`SEGMENT_EMPHASIS_MISSING`, `SEGMENT_EMPHASIS_COLOR_MISMATCH`, `SEGMENT_EMPHASIS_UNDECLARED`; 좌표축이나 그려진 직선 위에 놓인 선분이 엔진 규칙으로 굵게 그려지는 것은 강조가 아니다).

**`planeMarks`** (plan 최상위, 모든 항목은 plan이 말하는 사실이고 엔진과 관측기가 점들에서 다시 확인한다):

```json
"planeMarks":{
 "angles":[{"id":"aB","refs":["C","B","A"],"value":40,"label":"40","arcs":1,"side":"INNER","equalGroup":1,"ring":1,"factRole":"GIVEN"}],
 "equalLengths":[{"id":"e1","count":1,"segments":["sAB","sCD"]}],
 "parallels":[{"id":"p1","count":1,"segments":["sAD","sBC"]}],
 "expressionLabels":[{"id":"tBC","ownerSegment":"sBC","text":"10-x"}],
 "arcs":[{"id":"arc1","circle":"k","center":"O","from":"A","to":"B","side":"MAJOR","label":"220"}],
 "facts":[{"kind":"ON_CIRCLE","circle":"k","points":["A","B"]},{"kind":"TANGENT_PERPENDICULAR","center":"O","contact":"A","tangent":"sAT"}]}
```

- 각 호 `angles`: `refs`는 [한 변 위의 점, 꼭짓점, 다른 변 위의 점]이고 모두 화면에 나오는 점이다. `value`는 그림의 점들이 실제로 만드는 각이다(허용 오차 0.5°; 틀리면 plan이 아니라 작도를 고친다). `side:"OUTER"`는 큰 쪽(360°-각)이다. `arcs` 1~3은 같은 각이 같은 개수의 호를 갖게 하는 표시이고, `equalGroup`이 같은 각은 크기·`arcs`·`style`이 같아야 하며 모둠마다 `arcs`가 달라야 한다. `ring` 1~3은 꼭짓점에 겹친 호가 있을 때 바깥으로 비키는 정도다. **`emphasisGroup` 1~3**(정수)은 같은 값의 각이 호를 **같은 색**으로 그린다(1 빨강 `#c0392b`, 2 파랑 `#1f5fa8`, 3 초록 `#2e7d32`; 부채꼴 칠은 회색 그대로, 값이 없는 각은 기본 검정): 한 각이 두 관계(동위각 쌍과 맞꼭지각 쌍)에 속할 때 `equalGroup`(호 개수)과 따로 색으로 어느 관계의 호인지 구분한다(`ANGLE_EMPHASIS_GROUP_INVALID`; 관측기는 호의 색을 읽는다: `ANGLE_EMPHASIS_COLOR_MISMATCH`, `ANGLE_EMPHASIS_UNDECLARED`). **기본 모양 `style:"SECTOR"`**: 두 변 사이에 연한 회색(#d9d9d9) 작은 부채꼴을 칠하고 그 바깥 경계(가장 바깥 호)에 호를 그린다(교과서 모양). 칠은 모든 선·점·라벨 아래에 깔리고, 영역 색칠(`regions`, 3-9)의 회색과 구별되는 중성 회색을 쓴다. `style:"ARC"`는 지금까지의 획만 있는 호다. 라벨: `label`(`"40"`, `"x"`, `"2x+10"`은 뒤에 °가 붙는다; `labelKind:"NAME"`이면 `"ABC"`가 ∠ABC), 없으면 `value`를 쓰고, 읽을 값이 없는 쌍의 두 번째 각은 `noLabel:true`. 라벨은 부채꼴 바깥 이등분선 위에 놓이고, 가까운 곳에서 못 놓으면 먼 곳 + 지시선을 쓴다. 직각은 기존 `rightAngles`를 쓴다(직각 사각 표시는 그대로).
- `traces`의 **긴 연속 호와 라벨 자리** (E8b): `span:"JOIN"`을 쓰면 교점마다 짧은 호 대신 `through`의 교점을 **모두 지나는 호 하나**(그 교점들을 품는 가장 작은 호에서 양 끝으로 `spanDeg`/2만큼 더 뻗은 반시계 방향 호)를 그린다(교점이 하나면 보통 호와 같다; 교점들과 `spanDeg`이 300° 넘게 벌어지면 `TRACE_JOIN_TOO_WIDE`). `labelAt`은 라벨이 원 둘레 어디에 서는지 정한다: `"START"`(그려진 호의 **반시계 방향 시작 끝**), `"MID"`, `"END"`(다른 끝) 또는 중심에서 본 **방향 각도**(0=오른쪽, 90=위쪽; 숫자). 라벨은 원 바깥에서 그 방향으로 가장 바깥을 향하는 자리부터 찾는다. `labelAt`이 없으면 이전과 같고(긴 연속 호는 가운데) 관측기가 라벨 방향이 말한 자리의 45° 안인지 확인한다(`TRACE_LABEL_NOT_AT_ANCHOR`). 평행선 작도의 ㉠~㉥ 라벨을 문제 그림 자리에 맞출 때 쓴다. `span:"JOIN"`이나 `labelAt`을 쓴 흔적은 그림 프레임이 호 전체와 라벨 자리를 품도록 알아서 넓어지고, 이전 방식(교점마다 짧은 호)은 프레임이 점에만 맞으므로 호가 프레임 밖으로 나가 `GEOMETRY_VIEWPORT_CLIPPING`이면 `span:"JOIN"`으로 바꾸거나 호 가까이에 숨은 점을 하나 더 둔다. `expressionLabels[].labelAt:"START"|"MID"|"END"`는 같은 방식으로 선분 라벨을 선분의 첫 끝(refs 첫 점 쪽)·가운데(기본)·둘째 끝 쪽에 쓴다(`SEGMENT_LABEL_AT_INVALID`, 관측기 `SEGMENT_LABEL_NOT_AT_END`).
- **각 라벨 지시선 강제** (E12b): `angles[].labelPlacement:"LEADER"`는 각 안에 자리가 있어도 라벨을 **각 바깥**(부채꼴이 쓸고 지나가는 범위 밖)에 두고 그 각의 가장 바깥 호에서 시작하는 지시선으로 잇는다(기본 `"AUTO"`는 이전과 같다; 라벨이 없는 각에는 쓸 수 없다: `ANGLE_LABEL_PLACEMENT_INVALID`, `ANGLE_LABEL_PLACEMENT_NEEDS_LABEL`). 자리가 없으면 `LAYOUT_INVENTORY_INCOMPLETE`다(`AUTO`로 되돌리거나 캔버스를 키운다). 관측기는 지시선이 있는지(`ANGLE_LABEL_LEADER_MISSING`)와 라벨 상자 전체가 각 바깥인지(`ANGLE_LABEL_NOT_OUTSIDE_ANGLE`)를 최종 SVG에서 확인한다. 같은 꼭짓점에 겹친 각(x, 2x, 3x)은 `ring`(1~3, 호 반지름 순서: 한 단계마다 9px 바깥)으로 호를 겹치지 않게 나누고, 숨은 점으로 반직선을 줄이는 우회는 필요 없다.
- `dimensions`: **치수선·길이 괄호** (E7). `{id,from,to,label,unit?,labelKind?,side,style?,offset?,value?,factRole?}`는 화면에 나오는 두 점 `from`·`to` 사이의 길이를 도형 **바깥쪽으로 평행 이동한 선**에 쓴다(같은 직선 위에서 겹치는 구간 여러 개도 된다). `side`는 화면 방향 `ABOVE`/`BELOW`/`LEFT`/`RIGHT`다: 두 점을 잇는 선분의 두 수선 중 그 쪽을 더 향하는 쪽에 선다(선분이 그 방향과 거의 수직이면 `DIMENSION_SIDE_AMBIGUOUS`: 가로 선분은 `ABOVE`/`BELOW`, 세로 선분은 `LEFT`/`RIGHT`). `style`은 `BAR`(기본: 두 점에서 나온 얇은 보조선, 치수선, 양 끝의 9px 수직 눈금), `ARROW`(양 끝 화살촉), `BRACE`(점 가까이서 시작해 바깥으로 뾰족한 중괄호). 치수선은 두 점에서 24px 떨어지고 끝은 두 점에서 수선으로 내린 자리이며, `offset` 2~3은 44px씩 더 바깥이다(같은 쪽에 여러 개를 쌓을 때; 라벨이 선 바깥에 서므로 한 줄 라벨이 들어갈 만큼 벌어져 있다). 라벨은 치수선(중괄호는 뾰족한 끝) **바깥쪽 가운데**에 서고 가운데가 막히면 선 길이의 24% 안에서 미끄러진다. `label`은 수식(숫자·문자), `unit:"cm"|"m"|"mm"`는 수식 뒤에 붙는다(`"24\\,cm"`처럼 라벨 끝에 `\\,cm`를 쓰면 숫자 24와 단위 cm으로 읽는다). `labelKind:"TEXT"`는 한글 평문이다. `value`(선택)는 두 점 사이의 실제 거리이고 틀리면 `DIMENSION_FACT_MISMATCH`다(그림이 축척과 다르면 쓰지 않는다). 점은 `displayPoints`에 있어야 하고, 프레임은 치수선과 라벨이 들어가도록 알아서 넓어진다(치수선이 없는 plan의 프레임은 그대로). 거절: `DIMENSION_SIDE_INVALID`, `DIMENSION_STYLE_INVALID`, `DIMENSION_OFFSET_INVALID`, `DIMENSION_LABEL_REQUIRED`, `DIMENSION_POINTS_COINCIDE`, `DIMENSION_TOO_SHORT`(40px 미만), `DIMENSION_FACT_MISMATCH`. 관측기는 최종 SVG에서 치수선의 끝이 두 점의 수선 발과 일치하는지, 거리·방향(`DIMENSION_OFFSET_MISMATCH`, `DIMENSION_SIDE_MISMATCH`, `DIMENSION_END_MISMATCH`), 보조선·눈금·화살촉·중괄호 모양(`DIMENSION_EXTENSION_MISMATCH`, `DIMENSION_TICK_MISMATCH`, `DIMENSION_ARROW_MISMATCH`, `DIMENSION_BRACE_MISMATCH`, `DIMENSION_PART_MISSING`), 라벨이 선 바깥 가운데에 있고 자기 치수선에 가장 가까운지(`DIMENSION_LABEL_NOT_OUTSIDE`, `DIMENSION_LABEL_OFF_CENTER`, `DIMENSION_LABEL_TOO_FAR`, `DIMENSION_LABEL_AMBIGUOUS_OWNER`), 치수선이 다른 획을 가로지르지 않는지(`DIMENSION_CROSSES_STROKE`)를 다시 계산해 확인한다. 한 그림에 치수선이 둘 이상이면 서로 다른 쪽에 두거나 `offset`을 달리한다.
- `pathLabels`: **꺾인 경로의 총길이 라벨** (E7). `{id,points,label,unit?,labelKind?,value?,factRole?}`의 `points`는 `displaySegments`로 이미 그려진 선분으로 이어지는 점 3~8개(서로 다른 점)이고, 경로 전체 길이를 **라벨 하나**로 쓴다: 라벨은 경로 옆에 서고 **경로 위의 한 점**에서 시작하는 지시선으로 이어진다(지시선은 경로 자신 외에는 어떤 선도 가로지르지 않는다). 경로가 점선 꺾은선이고 직선 거리는 `dimensions`로 쓰는 문항(두 점 사이 거리와 도로 이동 거리)에 쓴다. 한 선분이라도 그려지지 않았으면 `PATH_LABEL_SEGMENT_NOT_DRAWN:<id>:<a>-<b>`, 점 목록이 3~8개의 서로 다른 점이 아니면 `PATH_LABEL_POINTS_INVALID`, `value`가 경로 길이와 다르면 `PATH_LABEL_FACT_MISMATCH`. 라벨 종류·단위는 `dimensions`와 같다(`label:"총 305 m"`처럼 말을 함께 쓰려면 `labelKind:"TEXT"`). 관측기는 지시선이 있는지(`PATH_LABEL_LEADER_MISSING`), 경로 위에서 시작하는지(`MARK_LEADER_NOT_ON_OWNER`), 다른 획을 가로지르지 않는지(`PATH_LABEL_LEADER_CROSSES`)를 확인한다.
- `equalLengths` `count`는 1~3개의 눈금, `parallels` `count`는 1~2개의 화살표다. 같은 종류의 모둠은 개수가 달라야 한다. 표식은 선분 가운데(점이 있으면 비킨 곳)에 놓이고 선분 길이가 약 40px보다 짧으면 거절된다.
- `expressionLabels`: 선분 옆에 식 라벨(`10-x`, `t+2`, `3sqrt(3)`)을 쓴다. 한 글자 문자는 기존 `segmentLabels`와 같은 표기다. 라벨이 어느 선분의 것인지 모호하면 지시선이 붙는다. 각도 값을 선분 곁에 그대로 적어야 하면 값 뒤에 `°`를 쓴다(`15°`는 `15^{\circ}`로 조판되고 화면에는 `15°`로 나온다). 좁은 각의 값은 이제 `angles`의 `label`로 적는다(아래 "각 라벨 자리"): 각 안에 자리가 없으면 엔진이 지시선으로 놓으므로 `noLabel`과 선분 라벨로 돌려 쓰지 않는다.
- **각 라벨 자리.** 각 라벨은 기본으로 자기 각 안쪽(호 바깥)에 놓인다. 각 안에 자리가 없을 때(20° 안팎의 좁은 각, 점선·다른 선이 각을 가르는 경우, 한 꼭짓점에 각이 3~4개 몰린 경우, 반사각에 가까운 큰 각의 긴 라벨) 엔진이 **각 바깥에 지시선으로** 놓는다: 지시선은 그 각의 **가장 바깥 호 위**(호의 가운데, 좁은 각이면 호가 변과 만나는 끝)에서 시작해 어떤 선도 가로지르지 않고(변 위에서 시작해 바깥으로 나간다) 끝이 라벨 상자에 닿는다. 라벨은 **같은 꼭짓점의 다른 각의 부채꼴**(그 각의 가장 바깥 호까지) 안에 놓이지 않고, 각 라벨이 못 놓이면 가장 좁은 각부터 다시 놓아 본다. 라벨 상자의 가장 가까운 변이 꼭짓점에서 90px보다 멀면 지시선 없이 두지 않고 지시선 자리를 먼저 찾는다(예전에는 좁은 각의 라벨이 꼭짓점에서 150px 넘게 떨어진 채 놓여 어느 각의 값인지 모호했다; 정답지의 라벨은 모두 71px 안이라 그대로다). 지시선 자리도 없으면 `LAYOUT_INVENTORY_INCOMPLETE`다(`coordinateCanvas`를 키우거나 표식을 줄인다). 관측기는 최종 SVG에서 지시선이 그 각의 호 위(반지름과 호가 쓰는 각 범위 안; 호의 끝도 된다)에서 시작하는지(`MARK_LEADER_NOT_ON_OWNER`), 어떤 획도 가로지르지 않는지(`ANGLE_LABEL_LEADER_CROSSES`), 라벨이 다른 각의 부채꼴 안에 있지 않은지(`ANGLE_LABEL_IN_OTHER_ANGLE`), 지시선 없는 라벨이 꼭짓점에서 90px 안에 있는지(`ANGLE_LABEL_TOO_FAR`)를 읽는다.
- `arcs`: 원 위 두 점 사이의 호를 굵게 강조한다. `circle`은 CIRCLE 노드, `center`, `from`, `to`는 화면의 점이고 `from`, `to`는 원 위에 있어야 한다. `side`는 `MINOR`(기본), `MAJOR`, 반원이면 `CCW`/`CW`. `label`은 원 바깥에 놓인다: 축 없는 평면도형은 호 라벨이 있으면 호가 향한 쪽에 라벨 자리(추정 글자 크기, 첫 간격 18px)가 들어가도록 그림 프레임을 자동으로 넓히므로 `coordinateCanvas`를 키우거나 점을 옮겨 여백을 만들 필요가 없다(호 라벨이 없는 plan의 프레임은 그대로다). 그래도 캔버스가 너무 작아 자리가 없으면 `LAYOUT_INVENTORY_INCOMPLETE`가 나오니 `coordinateCanvas`를 키운다. 중심각·원주각은 `angles`로, 접선은 `TANGENT_AT_POINT` 또는 접점에서 외부점까지의 선분과 `rightAngles`로 쓴다.
- `traces`: **작도 흔적 호**. `{id,center,radius,through,spanDeg,label}`에서 `center`는 컴퍼스를 꽂은 점, `radius`는 `{"point":"B"}`(중심에서 B까지) 또는 `{"segment":"sAB"}`(그 선분의 길이), `through`는 이 호가 만들어 내는 교점들의 점 id다. 각 교점은 반지름 위에 정확히 있어야 하고(아니면 `TRACE_TARGET_NOT_ON_ARC`), 엔진은 교점마다 그 방향 둘레로 `spanDeg`(기본 24, 2~120)만큼의 **얇은 실선** 호를 하나씩 그린다. `label`은 작도 순서 숫자(`"1"`, `"2"`, `"3"`; 1~99)이고 호 바깥에 쓴다. 예: 수직이등분선은 A 중심·B 중심의 같은 반지름 호 두 개를, 각의 이등분선은 꼭짓점 중심 호와 같은 반지름의 새 호를, 크기가 같은 각의 작도는 꼭짓점 중심 호·새 꼭짓점 중심 호·`AB` 길이를 옮긴 호를 `through`로 결속한다.
- **반직선·직선**: `displaySegments`의 `arrow`를 쓴다. 반직선 AB는 B 끝(또는 B 너머)에 화살촉(`arrow:"END"`), 직선은 양 끝(`arrow:"BOTH"`)이다. 끝점 **너머까지** 뻗은 반직선·직선은 그 방향의 숨은 점을 하나 만들어(`TRANSLATE_POINT`, 또는 `POLAR_POINT` 중심=끝점·기준=시작점·`angleDeg`=180) 그 점까지 선분을 그리고 화살촉을 단다. 화살촉은 선분의 끝점에 정확히 놓인다.
- **정다각형**: 중심 O와 한 꼭짓점 A를 정하고 `POLAR_POINT(O,A,반지름,360/n×k)`(k=1,…,n−1, `angleDeg`는 `{"kind":"rational","numerator":"360","denominator":"7"}` 같은 정확한 분수)로 나머지 꼭짓점을 놓는다. 변은 `displaySegments`, 같은 변은 `equalLengths`, 같은 각은 `angles`로 선언하면 엔진과 Cindy 관측기가 같은 변·같은 각을 다시 확인한다. 72°, 360/7°처럼 근호가 없는 각은 엔진이 높은 정밀도로 계산하므로 정오각형·정칠각형도 이 방법으로 그린다.
- `facts`: 최종 SVG에서 읽어 확인한다. `ON_CIRCLE`은 그려진 원 위에 점들이 있는지, `TANGENT_PERPENDICULAR`는 그려진 접선이 접점을 지나고 반지름과 수직인지다.
- **한글 평문 라벨과 단위** (`expressionLabels`, `arcs[].label`, `traces[].label`): 선택 `labelKind:"TEXT"`는 라벨을 수식이 아니라 한글 본문 글꼴 평문으로 그린다(작도 순서 ㉠~㉥, `반직선 AB`; 40자 이하, 개행·`$`·`\` 불가; 영역 라벨 3-9절 `labelKind`와 같은 방식). 기본은 지금까지의 수식 라벨이다(`traces`의 수식 라벨은 작도 순서 숫자 1~99). 선택 `unit:"cm"|"m"|"mm"`는 **수식 라벨 뒤**에 단위를 붙인다: 숫자 뒤에는 붙여(`3cm`), 문자 뒤에는 한 칸(`x cm`). `arcs[].labelKind`는 `unit`이 있으면 기본이 `"MATH"`다. `angles[].label`에는 `unit`이 없다(각은 `°`). 오류: `MARK_UNIT_INVALID`(cm·m·mm 밖), `MARK_UNIT_REQUIRES_MATH_LABEL`(TEXT·DEGREE·NAME 라벨에 `unit`), `MARK_UNIT_REQUIRES_LABEL`(라벨 없는 호·흔적), `MARK_FIELD_INVALID`(알 수 없는 `labelKind`, 40자 초과·개행·`$` 포함 TEXT), `TRACE_LABEL_INVALID`(`unit`이 있는 흔적 라벨은 양의 수 또는 영문자 하나). 관측기는 TEXT 라벨이 수식 글리프가 아닌 평문 윤곽선이고 조판 단계가 그룹에 남긴 `data-text`가 plan의 문자열과 같은지(`LABEL_KIND_MISMATCH`, `LABEL_TEXT_MISMATCH`), 단위 라벨은 마지막 글리프가 단위 글자인지·숫자 또는 한 글자 라벨이면 값과 단위 붙임/띄움(`data-tex`)이 위 규칙과 같은지(`LABEL_UNIT_MISMATCH`, `LABEL_UNIT_SPACING_MISMATCH`)를 읽는다. **한계:** TEXT 라벨의 글자는 윤곽선 경로라 글리프 단위로 다시 읽을 수 없어 `data-text`와 대조한다; 식이 긴 수식 라벨의 단위 앞부분은 글리프 대조를 하지 않는다. 라벨이 자기 호·선분 곁에 있는지는 기존 라벨 검사(겹침·지시선·원 바깥·가장 가까운 소유자)와 같고, 호 라벨은 같은 원의 다른 호보다 자기 호에 가까워야 한다(`ARC_LABEL_AMBIGUOUS_OWNER`).
- **교점 사이의 길이** `scalarLabels`: 두 점 사이 `SEGMENT_LENGTH`의 값이 닫힌 꼴이 아니면(원과 직선의 교점 A와 중심 B 사이처럼 엔진 모델에 34자리 `decimal`만 있으면) 지금까지는 `UNSUPPORTED_SCALAR_NOTATION`이었다. `scalarLabels[]`에 `"value":"8"`(정수·`a/b`·`sqrt(…)`·`+ - * /`·괄호만; `"sqrt(145)/2"` 같은 정확한 값 글)을 같이 적으면 엔진이 그 글을 계산해 **엔진 값과 1e-9 안에서 같을 때만** 그 글로 라벨을 쓴다(`SCALAR_LABEL_VALUE_MISMATCH:<id>:declared=…:computed=…`, 글이 문법에 안 맞으면 `SCALAR_LABEL_VALUE_INVALID`, `SEGMENT_LENGTH`가 아닌 노드면 `SCALAR_LABEL_VALUE_REQUIRES_SEGMENT_LENGTH`). 보조점을 일부러 만들어 길이를 우회하지 않는다.
- 표식 id는 노드, 선분, 다른 표식 id와 달라야 한다. 정해진 키만 쓴다.

**독립 관측기**(`plane-marks-observer-worker.py`)는 Cindy가 계산한 점과 최종 SVG의 그려진 요소만으로 다음을 다시 확인한다: 호가 꼭짓점을 중심으로 두 변 사이를 정확히 잇고 그려진 각이 점들이 만드는 각과 말한 값(0.5° 이내)과 같은지, 같은 모둠의 호 개수·크기·`style`, 부채꼴 칠이 꼭짓점에서 시작해 두 변을 따라가고 반지름이 가장 바깥 호와 같으며 sweep이 말한 각(0.5° 이내)·방향과 같은지, 칠이 모든 획·라벨보다 아래인지, 눈금이 선분 위에서 선분에 수직이고 모둠의 선분 길이가 같은지, 평행 화살표가 선분 방향이고 모둠이 평행한지, 호의 점이 모두 원 위에 있고 끝점과 방향이 맞는지, 작도 흔적 호의 중심·반지름·폭이 선언과 같고 그 호가 말한 교점을 실제로 지나며 얇은 실선인지, 점선과 화살촉, 접선과 반지름의 수직, 라벨이 선·표식과 겹치지 않고 자기 각 안쪽(또는 지시선이 호에서 시작) 자기 선분 곁에 있는지, 작도 순서 숫자가 호 바깥의 같은 숫자인지, 선언하지 않은 표식이 없는지.

**한계.** 한 점 둘레에 각이 많이 몰리거나 캔버스가 너무 작으면 지시선 자리도 없어 `LAYOUT_INVENTORY_INCOMPLETE`가 될 수 있다: `coordinateCanvas`를 키우거나 한 쌍의 두 번째 각을 `noLabel`로 하거나 표식을 줄인다. 길이 라벨의 숫자와 그려진 길이의 비례는 관측하지 않는다(눈금과 평행·각만 관측).


### 3-9. 영역 색칠: 다각형·부채꼴·활꼴·차집합 (`planeMarks.regions`)

문제 그림에서 **이미 그린 선·호로 둘러싸인 영역을 회색으로 칠하고** 그 넓이를 영역 안에 적어야 할 때 쓴다(넓이 분할, 부채꼴, 띠, 활꼴, 합동 삼각형 강조). `PLANE_FIGURE_v1` plan의 `planeMarks.regions`에 쓴다. 칠하는 영역은 **도형에서 구멍을 뺀 것**으로 쓴다. 도형끼리는 겹칠 수 없고(겹쳐야 하면 구멍으로 뺀다) 구멍은 반드시 어떤 도형 안에 있어야 한다. 색은 `LIGHT`(기본) 또는 `MEDIUM`이고, 칠은 모든 획·라벨 **아래**에 깔린다.

```json
"regions":[
 {"id":"rg1","fill":"LIGHT","label":"3pi","factRole":"CONCLUSION",
  "shapes":[{"sector":{"center":"O","from":"A","to":"B"}}],"holes":[{"polygon":["O","A","B"]}]},
 {"id":"rg2","fill":"MEDIUM","shapes":[
  {"polygon":["D","B","P"]},
  {"loop":{"start":"C","steps":[{"to":"D","arc":{"center":"O","side":"MINOR"}},{"to":"B"},{"to":"A","arc":{"center":"O","side":"MINOR"}},{"to":"C"}]}}]},
 {"id":"rg3","shapes":[{"loop":{"start":"P4","steps":[{"to":"P4","arc":{"center":"O","side":"FULL"}}]}}]}
]
```

| 도형 | 뜻 |
|---|---|
| `{"polygon":[점 id ...]}` | 점 id를 순서대로 이은 다각형(3개 이상, 겹치는 점 없음) |
| `{"sector":{"center","from","to","side"?}}` | 중심과 원 위 두 점으로 정해지는 부채꼴. `side`는 `MINOR`(기본)·`MAJOR`·`CCW`·`CW` |
| `{"segment":{"center","from","to","side"?}}` | 같은 두 점을 잇는 **활꼴**(현과 호 사이). `shapes`에 부채꼴을, `holes`에 삼각형을 넣은 것과 같은 결과다 |
| `{"loop":{"start","steps":[{"to","arc"?}]}}` | 직선과 정확한 원호를 섞은 자유 경계. `arc:{"center","side"}`는 그 호의 중심 점이고 `side`는 `MINOR`·`MAJOR`·`CCW`·`CW`·`FULL`(FULL은 `to`가 `start`와 같고 원 전체) |

- **경계는 이미 그려져 있어야 한다.** 각 변은 `displaySegments`·`displayLines`·`displayCircles`·`planeMarks.arcs`(강조 여부 무관) 중 하나가 실제로 그린 것이어야 하고, 아니면 `REGION_BOUNDARY_UNKNOWN`이다. 그래서 색칠은 "그림이 실제로 보여 주는 영역"만 칠한다.
- 호의 두 끝점은 중심에서 같은 거리여야 한다(`REGION_ARC_ENDPOINT_NOT_ON_CIRCLE`). 지름의 양 끝(반원)처럼 두 방향이 똑같이 가능하면 `side`를 반드시 적는다(`REGION_ARC_SIDE_AMBIGUOUS`).
- `label`은 영역 안에 놓는 식 라벨(`3pi`, `16pi-32`, `37.5pi`)이다. 라벨은 경계·획에서 가장 넓은 안쪽 지점에 놓이고 다른 라벨과 14px 이상 떨어진다(40자 이하). `factRole`은 `GIVEN`·`DERIVED_INTERMEDIATE`·`CONCLUSION`.
- 오류 코드: `REGION_BOUNDARY_UNKNOWN`(모르는 점 또는 그리지 않은 변), `REGION_NOT_CLOSED`, `REGION_SELF_INTERSECTING`, `REGION_LOOPS_CROSS`, `REGION_SHAPES_OVERLAP`, `REGION_HOLE_OUTSIDE`, `REGION_ARC_SIDE_AMBIGUOUS`, `REGION_ARC_ENDPOINT_NOT_ON_CIRCLE`, `REGION_DEGENERATE`, `REGION_DEGENERATE_EDGE`, `REGION_FILL_UNSUPPORTED`, `REGION_FIELD_UNKNOWN`, `REGION_FIELD_INVALID`, `REGION_ID_INVALID`, `REGION_ID_DUPLICATE`, `REGION_REQUIRES_EQUAL_UNITS`.
- 관측기(`plane_regions_observer.py`, `plane-marks-observer-worker.py`가 호출)는 Cindy 점에서 경계를 **다시 계산해** 최종 SVG의 even-odd `<path>`와 꼭짓점·호 끝점·호 중심·반지름·sweep을 맞춰 보고, 획이 없는지, 모든 변이 실제 획으로 그려졌는지, 칠이 모든 획·라벨 아래인지, 라벨이 영역 안에 있고 다른 라벨과 붙지 않았는지 확인한다(`REGION_VERTEX_MISMATCH`, `REGION_ARC_SIDE_MISMATCH`, `REGION_ARC_RADIUS_MISMATCH`, `REGION_BOUNDARY_NOT_DRAWN`, `REGION_NOT_BENEATH_STROKES`, `REGION_LABEL_OUTSIDE`, `REGION_LABEL_CROWDS_LABEL`, `UNDECLARED_MARK` 등).
- **한계.** 관측기는 경계의 모양만 보고 **넓이 값 자체는 검산하지 않는다**: `label`의 수치는 원문·해설과 맞는지 사람이 확인한다(색칠이 넓이 계산을 대신하지 않는다). 한 영역은 even-odd path 하나이므로 도형이 겹치면 칠이 상쇄된다(겹침 금지). 같은 점에서 여러 획이 만나는 중심에 점 이름을 두면 자리가 없어 지시선이 붙을 수 있다. 영역 라벨이 들어갈 안쪽 여백이 없으면 `LAYOUT_INVENTORY_INCOMPLETE`로 실패하니 라벨을 줄이거나 값을 밖으로 뺀다.


### 3-10. 좌표 그림의 각 표시: 축이 있는 작도에 같은 표식 (`SOURCE_COORDINATE_AXES_v1`, `planeMarks`)

일반각·삼각함수의 정의, 두 동경이 이루는 각, 좌표평면 위 삼각형의 각처럼 **좌표축을 그대로 두고 각·직각·같은 길이·평행·호를 표시해야 하는** 문항에 쓴다. 그림은 이미 쓰고 있는 좌표 작도 plan(`construction-spike-v1` + `mathPlan.realization:{"recipeId":"SOURCE_COORDINATE_AXES_v1","unit":"source-coordinate","reflectionEquivalent":false}`, `SOURCE_COORDINATES`, 축·눈금이 그려진다) 그대로이고, 3-8절의 `planeMarks`와 `displaySegments`의 `dashed`/`arrow`를 **같은 키·같은 관측기**로 쓸 수 있다. 별도의 축 없는 평면도형(`PLANE_FIGURE_v1`)으로 바꾸지 않는다: 점 좌표와 축은 원문 그대로 두고 표식만 더한다.

```json
{"capability":"construction-spike-v1",
 "mathPlan":{"realization":{"recipeId":"SOURCE_COORDINATE_AXES_v1","unit":"source-coordinate","reflectionEquivalent":false},"nodes":[
  {"id":"O","op":"NORMALIZATION_ORIGIN","outputType":"POINT"},
  {"id":"X","op":"NORMALIZATION_AXIS","outputType":"POINT","args":{"length":"1"}},
  {"id":"P","op":"SOURCE_POINT","outputType":"POINT","args":{"coordinates":["-6","0"]}},
  {"id":"Q","op":"POLAR_POINT","inputs":["O","P"],"outputType":"POINT","args":{"length":"6","angleDeg":"-30","turn":"CCW"}}]},
 "planeMarks":{"angles":[
   {"id":"aXOP","refs":["X","O","P"],"value":150,"label":"θ","labelKind":"MATH","factRole":"GIVEN"},
   {"id":"aXOQ","refs":["X","O","Q"],"value":30,"label":"5θ","labelKind":"MATH","factRole":"GIVEN"}]}}
```

- **각.** `refs`는 [한 변 위의 점, 꼭짓점, 다른 변 위의 점]이고 셋 다 화면에 나오는 점이다. 축을 한 변으로 쓰는 각은 축 위의 점(`X`, `Y` 등 실제로 그려진 점)을 첫/끝 항에 넣는다. `value`는 그려진 점들이 실제로 만드는 각(0.5° 허용)이고, 동경의 방향은 `POLAR_POINT`의 `angleDeg`/`turn`으로 만들며 표식 숫자로 맞추지 않는다. `side:"OUTER"`, `arcs` 1~3, `equalGroup`, `ring` 1~3은 3-8절과 같다.
- **라벨 종류.** `labelKind`를 생략하거나 `"DEGREE"`면 `label` 뒤에 °가 붙고(`"60"`→60°), `"NAME"`은 `"AOB"`→∠AOB, 한 글자 `"A"`→∠A다(대문자 한 글자, 또는 대문자로 시작해 대문자·숫자 4자 이내: 아니면 `ANGLE_LABEL_NAME_INVALID`). `"MATH"`는 식을 그대로 쓴다: `"θ"`, `"-θ"`, `"5θ"`, `"x"`가 각 이름으로 그려지고 °는 붙지 않는다(일반각 θ, 5θ처럼 크기가 아니라 이름을 보여 줄 때 쓴다).
- **직각**은 3-8절의 `angles` 대신 기존 `rightAngles:[{"id":"raF","refs":["O","F","P"]}]`를 쓴다(축이 있는 작도에서 이미 동작한다). 같은 길이·평행·호·식 라벨·`facts`·`regions`는 3-8·3-9절 그대로이고, 좌표 그림에서는 색칠·표식도 축과 같은 좌표계 위에 놓인다.
- **관측기.** `plane-marks-observer-worker.py`가 Cindy 점과 최종 SVG의 그려진 선만으로 각을 **다시 계산해** 말한 값과 0.5° 안에서 같은지, 부채꼴 칠이 꼭짓점에서 두 변 사이를 채우고 모든 획·라벨 아래인지, 라벨이 자기 각 안쪽에 있는지(지시선이면 그 각의 호 위에서 시작하는지, 다른 각의 부채꼴 안이 아닌지, 3-8절 "각 라벨 자리"), 같은 모둠의 호 개수·길이 표식·평행 화살표가 맞는지, 선언하지 않은 표식이 없는지 확인한다. 좁은 각(예: 30°)은 라벨이 두 변을 피해 이등분선을 따라 바깥으로 밀려 놓이고, 자리가 없으면 호 끝에서 나가는 지시선으로 각 바깥에 놓인다(3-8절). `emphasisGroup`(호 색 모둠)도 3-8절과 같다.
- **이름 없는 점·수선의 발 점 표식.** 좌표 그림에서도 `hiddenPointNames`에 `SOURCE_POINT`를 넣을 수 있고(점은 남고 이름만 숨는다), `hiddenPointStyle:"NONE"` 또는 `unmarkedPointNames:[…]`로 점 표식을 뺄 수 있다(3-8절): 점선으로 좌표를 읽는 그림에서 읽는 점은 점을 두고 축 위 수선의 발 점만 빼는 경우 `"hiddenPointNames":["Q4","Q4x","Q4y"],"unmarkedPointNames":["Q4x","Q4y"]`. 눈금 라벨이 원점 근처에서 서로 부딪치면(x=-1과 y=1) 엔진이 눈금 라벨을 축을 따라 최대 3.5px 비켜 놓는다(어느 눈금의 라벨인지는 그대로다).
- **치수선** (E7): 3-8절의 `dimensions`(`BAR`·`ARROW`·`BRACE`, `side`·`offset`)는 좌표 그림에서도 같은 규칙으로 쓴다. 축·눈금·점 이름과 겹치지 않는 쪽 `side`를 고른다(치수선이 다른 획을 가로지르면 `DIMENSION_CROSSES_STROKE`).
- **함수 그래프는 안 된다.** `planeMarks`·점선·화살촉은 작도 plan의 사실 표시이므로 그래프 plan(`polynomial-spike-v1`, `piecewise-*`, `INTERVAL_PI` 등)에 넣으면 `PLANE_MARKS_UNSUPPORTED_ON_GRAPH`로 거절한다. 직선과 x축이 이루는 각, 교점의 각, 수선의 발의 직각이 필요하면 그 점·선을 실제로 만드는 **좌표 작도 plan**으로 그린다.
- **오류.** 3-8절의 표식 오류 코드가 그대로 나오고, 좌표 그림에서만 추가로 `PLANE_MARKS_UNSUPPORTED_ON_GRAPH`(그래프 plan에 표식을 넣음)가 있다. 표식 id는 노드·선분 id와 달라야 하고 정해진 키만 쓴다.
- **한계.** 3-8절과 같다: 5° 미만의 각은 거절되고(`ANGLE_ARC_TOO_SMALL`), 한 꼭짓점에 각이 많이 몰리거나 캔버스가 너무 작아 지시선 자리도 없으면 표식을 줄이거나 `noLabel`을 쓴다.


### 3-16. 평면도형 여러 개를 한 그림에: `composite-panels-v1` 평면 패널 격자

보기 ①~⑤의 서로 다른 사각형이나 서답형 ①·②의 두 도형처럼 **여러 평면도형을 나란히 비교**할 때, 각각을 지금까지와 같은 `PLANE_FIGURE_v1` plan으로 만든 뒤 `composite-panels-v1`의 패널로 묶는다. 각 패널은 3-8·3-9의 각·눈금·평행·식 라벨·호·영역·점선/화살촉을 그대로 쓰고, 엔진은 패널마다 같은 작도·표식·관측기 경로를 실행한다. 새 수학 primitive나 좌표 변환을 쓰지 않는다.

- **패널 수와 종류.** 평면 패널은 **2~5개**이고 **모두** `construction-spike-v1` + `mathPlan.realization.recipeId:"PLANE_FIGURE_v1"`이어야 한다. 그래프·수직선 패널과 섞으면 `PANEL_PLANE_MIXED_<index>`로 거절한다. 평면도형 하나는 합성이 아니라 단일 `PLANE_FIGURE_v1` plan으로 쓴다(1개는 `PANELS`). **입체 패널**(`solid-figure-v1`의 입체 또는 전개도)도 이 격자의 패널이 되며 평면 패널과 섞어 쓸 수 있다: 아래 "입체 패널" 줄을 본다.
- **입체 패널.** 패널의 `plan`이 `solid-figure-v1` plan(`solids` 또는 `net`, `dims`·`segments` 등 3-입체의 모든 필드)이면 입체 패널이다. 입체 패널이 하나라도 있으면 패널은 **2~6개**(2열 최대 3줄: 5·6개도 된다)이고, 줄이 늘어 그림이 쪽 높이(640 CSS px)를 넘으면 `COMPOSITE_TOO_TALL`이다(입체 패널 여섯 개의 3줄 격자는 한 쪽에 들어간다). 예: 원기둥·원뿔·원뿔대·구·반구를 회전축에 수직인 평면으로 자른 단면 다섯 개(`section:{kind:"LEVEL",at:"1/2"}`, 구는 `"1/3"`), 한 입체를 같은 plan으로 두세 패널에 두고 패널마다 `segments`로 다른 모서리 그룹을 강조할 수 있다(육각기둥에서 BH와 만나는·평행한·꼬인 모서리). 패널 `plan`에는 `caption`·`solidCaption`·`sourceConditions`·`newVisualInformation`·`sourceQuote`를 쓰지 않는다(설명은 합성 최상위와 패널 `caption`에): 쓰면 `PANEL_SOLID_PLAN_<index>`. 격자가 입체 패널의 폭을 384로 줄이므로 `panelWidth`는 직접 쓰지 않는다(다른 값은 같은 코드). 입체 패널을 그래프·수직선 패널과 섞으면 `PANEL_SOLID_MIXED_<index>`로 거절한다. 각 입체 패널은 자기 독립 관측기(`solid_figure_observer.py`)를 그대로 통과해야 한다.
- **배치.** 자동이다: 2개는 2열 한 줄, 3개·5개는 2열(2줄·3줄), 4개는 2×2. **3열은 쓰지 않는다:** 가장 좁은 384 캔버스 세 개를 한 줄에 두면 가로가 1168 SVG 단위가 되는데, Archive 해설 칸(약 298 CSS px)에서 11 CSS px 하한을 지키려면 기본 글자 크기가 정책 상한 32 px를 넘어 측정 단계에서 `UNSUPPORTED_DISPLAY_ENVELOPE:REQUESTED_PROFILE_FONT_SCALE`로 거절된다(2열 776은 통과). 각 패널 위에 caption 한 줄이 붙고, 패널은 열 너비·행 높이가 같은 칸 안에 가운데 놓인다. 캔버스가 다르면 가장 큰 패널에 칸을 맞추고 작은 패널을 가운데 둔다. 그래프 패널의 2~3개 세로 STACK 동작은 그대로이고 이 격자에 섞이지 않는다.
- **2열일 때 패널 폭.** 격자 가로는 `열 수 × 칸 너비 + 8`이다. 위 시험지의 해설 칸에서 11.25 CSS px를 지키려면 합성 가로가 약 848 SVG 단위 이하여야 하므로(기본 글자 32 px 상한), 2열이면 각 패널 캔버스 폭을 **420 이하**로 잡는다. 384×560 같은 세로 캔버스는 마름모 두 개를 나란히 둘 때 안전하고, 640×560 두 개(합성 1288)는 측정 단계에서 `UNSUPPORTED_DISPLAY_ENVELOPE:REQUESTED_PROFILE_FONT_SCALE`로 거절된다. 넓은 그림이 꼭 필요하면 캔버스를 384~416 폭으로 줄이거나, 합성하지 않고 단일 `PLANE_FIGURE_v1` plan으로 나눈다. 실제 상한은 시험지의 해설 칸 너비에 따라 달라지므로 최종 판정은 측정이 한다.
- **각 패널 plan.** 3-8 그대로다: `SOURCE_POINT` 1개 이상, `NORMALIZATION_*` 없음, `coordinateCanvas`는 384~720 × 320~600(생략하면 384×320), `planeMarks`·`rightAngles`·점선/화살촉 사용 가능. 표식이 가리키는 점은 그 패널의 `displayPoints`에 있어야 한다(단일 그림과 같은 규칙).
- **caption.** 패널마다 `{math?,text?}` 중 하나 이상이고 `text`는 24자 이내다. 그림 전체의 긴 설명은 합성 plan 최상위 `caption`에 한 번만 쓴다. 글만 있는 캡션이 칸 너비를 넘으면 엔진이 공백에서 **두 줄로 나누고**, 한 줄 높이(44)를 넘는 캡션이 있으면 그 그림의 캡션 줄이 그만큼 **높아진다**(캡션이 맞는 그림은 이전과 같다). 그래도 칸 너비를 넘으면(수식이 있거나, 공백이 없거나, 두 줄로도 넘칠 때) `COMPOSITE_CAPTION_TOO_LARGE`다: `text`를 줄인다.
- **페이지 상한.** 합성 전체 높이가 640 CSS px를 넘으면 `COMPOSITE_TOO_TALL`이다(Archive 해설 이미지 max-height). 5패널 2열·384×320 캔버스는 776×1140 SVG 단위이고, 표시 배율 약 0.384에서 높이 약 438 CSS px라 상한 안에 들어온다. 세로로 긴 패널이나 큰 캔버스는 높이가 넘칠 수 있으니 패널 수나 캔버스를 줄인다.
- **검사.** 각 패널은 3-8·3-9의 표식 오류 코드와 독립 관측기(`PLANE_MARKS_AUDIT_FAIL`, `REGION_*`, `LAYOUT_INVENTORY_INCOMPLETE`)를 그대로 통과해야 한다. 합성은 패널 SVG 바이트를 그대로 넣고, 각 패널의 표식 사실을 다시 검사한다. 정적 검사·테스트 통과는 학생 그림 PASS가 아니다.

```json
{"capability":"composite-panels-v1","panels":[
  {"caption":{"text":"① 두 대각선은 수직이등분"},"plan":{ /* PLANE_FIGURE_v1 plan */ }},
  {"caption":{"text":"② BP:PC=5:3"},"plan":{ /* PLANE_FIGURE_v1 plan */ }}],
 "caption":"두 소문항을 나란히 비교한 해설 그림","sourceConditions":[...],"newVisualInformation":[...]}
```


### 3-41. 두 원의 호로 이루어진 영역(렌즈·활꼴): 중심이 다른 호를 한 `loop`에 잇기

두 원(또는 두 반원)의 호가 만드는 **렌즈(공통 부분)**·**활꼴(초승달)** 처럼 한 영역의 경계가 **중심이 다른 원호 두 개**인 경우에는 3-9절의 `loop`를 그대로 쓰되 각 `step.arc.center`에 다른 점을 적는다. `displayCircles`로 원을 통째로 그리면 원문에 없는 반대쪽 호까지 보이므로, 원문이 반원만 보여 주면 `planeMarks.arcs`를 `highlight:false`(일반 굵기 실선)로 써서 필요한 호만 긋고 그 호를 영역 경계로 쓴다. 정답지 `item39`(23_금당중 2학기 중간 중2 q21, 히포크라테스의 활꼴)가 이 구성을 실제로 검증한다.

```json
"arcs":[{"id":"arcAB","circle":"kAB","center":"MAB","from":"A","to":"B","side":"CCW","highlight":false}],
"regions":[{"id":"lunes","fill":"MEDIUM","factRole":"CONCLUSION","shapes":[
 {"loop":{"start":"A","steps":[{"to":"B","arc":{"center":"MAB","side":"CCW"}},{"to":"A","arc":{"center":"MBC","side":"CW"}}]}},
 {"loop":{"start":"A","steps":[{"to":"C","arc":{"center":"MAC","side":"CW"}},{"to":"A","arc":{"center":"MBC","side":"CCW"}}]}}]}]
```

- **경계.** 각 호의 두 끝점은 그 중심 원 위에 정확히 있어야 하고(`REGION_ARC_ENDPOINT_NOT_ON_CIRCLE`), 반원(180°)은 `MINOR`/`MAJOR`가 모호하므로 반드시 `CCW`/`CW`를 적는다(`REGION_ARC_SIDE_AMBIGUOUS`). 같은 두 점을 잇는 두 호가 서로 반대쪽으로 불룩하면 그 사이가 활꼴이고, 두 원의 교점을 잇는 두 호이면 렌즈다.
- **중심은 화면 점이어야 한다.** `planeMarks.arcs.center`와 `loop`의 `arc.center`는 `displayPoints`에 있는 점 id만 가리킬 수 있다(`DISPLAY_ANNOTATION_POINT_NOT_VISIBLE`). 원문이 그 중심을 이름 붙이지 않으면 `MIDPOINT`·`CIRCLE_CENTER_RADIUS` 노드를 `DERIVED_INTERMEDIATE`로 만들고 `displayPoints`에 넣은 뒤 `hiddenPointNames`에 넣어 **이름 없는 점**으로 그린다(4절).
- **여러 조각을 한 영역으로.** 서로 겹치지 않는 두 활꼴은 같은 region의 shapes에 넣는다. 내부 라벨은 한 조각의 넓이로 오해될 수 있으므로 전체 합계 54 cm²를 한 조각 안에 쓰지 않는다. 바깥쪽 합계 표기가 지원되지 않으면 SVG에는 두 조각과 원래 조건을 남기고, 해설 본문에서 전체 합계를 설명한다.
- **관측기.** `plane-marks-observer-worker.py` → `plane_regions_observer.py`가 Cindy 점에서 각 호의 중심·반지름·sweep을 다시 계산해 `<path>`의 `A` 명령과 맞추고, 모든 변이 실제 획으로 그려졌는지, 칠이 모든 획·라벨 아래인지, 라벨이 영역 안인지 확인한다(`REGION_ARC_SIDE_MISMATCH`, `REGION_ARC_RADIUS_MISMATCH`, `REGION_BOUNDARY_NOT_DRAWN`, `REGION_LABEL_OUTSIDE`). `highlight:false`인 호는 강조 표식으로 세지 않고 경계 획으로만 검사한다.
- **한계.** 넓이 자체는 원문·해설과 독립 대조한다. `(가)`·`(나)` 같은 한글 영역 표지와 빗금(해칭)은 3-46절의 `labelKind`·`pattern`으로 그린다.



### 3-46. 영역 이름 (가)·(나)와 빗금(해칭): `labelKind` · `pattern`

원문 그림이 영역을 **(가)·(나)처럼 이름으로 구분**하거나 **"빗금친 부분"**이라고 말할 때 3-9절 `planeMarks.regions`에 두 필드를 더한다. 3-41절의 두 원 호 영역에도 그대로 쓴다.

```json
"regions":[
 {"id":"ring","fill":"LIGHT","pattern":"HATCH","label":"(가) 8πr²","labelKind":"TEXT","factRole":"CONCLUSION",
  "shapes":[{"loop":{"start":"Q","steps":[{"to":"Q","arc":{"center":"O","side":"FULL"}}]}}],
  "holes":[{"loop":{"start":"P","steps":[{"to":"P","arc":{"center":"O","side":"FULL"}}]}}]},
 {"id":"inner","fill":"LIGHT","label":"(나)","labelKind":"TEXT","factRole":"CONCLUSION","shapes":[...]}]
```

- **`labelKind`.** 기본 `"MATH"`는 지금까지처럼 라벨을 식으로 조판한다(`8πr²`, `16π-32`, `37.5π`). `"TEXT"`는 라벨을 **한글 본문 글꼴의 평문**으로 그린다: `(가)`, `(나)`, `(가) 8πr²`처럼 영역 이름을 학생 눈에 그대로 보여 줄 때 쓴다. 평문 라벨도 40자 이하이고 영역 안 가장 넓은 곳에 놓인다. `labelKind`만 있고 `label`이 없으면 거절된다.
- **`pattern`.** `"HATCH"`는 그 영역을 **실제 빗금**으로 칠한다: 바탕은 같은 밝은 회색(`fill`)이고 그 위에 45° 대각선을 약 9px 간격의 얇은 선으로 **그 영역의 even-odd 영역 안에만** 긋는다(클립 경로 없이 영역 경계와 교차 계산해 자른다). 원문이 "빗금친 부분"이라고 말하는 영역에만 쓴다. 값은 `"HATCH"` 하나뿐이고(`REGION_PATTERN_UNSUPPORTED`), `fill`은 `LIGHT`/`MEDIUM` 그대로다(`fill:"HATCH"`는 여전히 `REGION_FILL_UNSUPPORTED`). 빗금 선은 영역의 칠로 취급되므로(`data-role="region"`) 라벨이 그 위에 놓일 수 있다.
- **관측기.** `plane_regions_observer.py`는 빗금에 대해 최종 SVG에서 그 영역의 빗금 선만 모아 ① 3개 이상인지(`REGION_HATCH_MISSING`) ② 양 끝과 중점이 **그 영역의 even-odd 영역 안**(경계 포함, 0.25px)인지(`REGION_HATCH_OUTSIDE`) ③ 모두 같은 방향(0.5°)이고 이웃 간격이 같은지(`REGION_HATCH_UNEVEN`) ④ 영역 폭의 절반 이상을 덮는지(`REGION_HATCH_TOO_SPARSE`) ⑤ 점선이 아닌지(`REGION_HATCH_DASHED`) ⑥ 칠보다 위에 그려졌는지(`REGION_HATCH_COVERED_BY_FILL`) 확인한다. 라벨은 **자기 영역 안에 있고 다른 영역 안에는 없어야** 한다(`REGION_LABEL_OUTSIDE`, `REGION_LABEL_IN_OTHER_REGION`). 선언하지 않은 빗금 선은 `UNDECLARED_MARK`다.
- **한계.** 빗금 간격·각도는 엔진이 정한다(작성자가 바꾸지 않는다). 작은 영역의 안쪽 여백이 좁으면 `(나) πr²` 같은 긴 표지가 들어가지 않으므로(`LAYOUT_INVENTORY_INCOMPLETE`) 이름만 쓰고 넓이는 `caption`에 적는다. 평문 라벨의 글자 자체는 조판 단계에서 만들어지므로 관측기는 "그 라벨이 자기 영역 안에 있는지"와 "빗금이 영역 안에 있는지"를 보고, 글자 내용의 최종 확인은 실제 렌더 이미지 검토가 맡는다. 빗금 영역의 넓이 값도 관측기가 검산하지 않는다.

