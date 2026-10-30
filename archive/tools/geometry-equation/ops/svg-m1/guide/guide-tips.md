# 작성 팁 (작성자들이 자주 놓친 기존 기능·함정) — 항상 먼저 읽는다

- **길이에 단위(cm) 붙이기**: plan 최상위 `scalarLabels:[{"nodeId":"lenAB","ownerSegment":"sAB","prefix":"AB","unit":"cm","factRole":"GIVEN"}]` — `nodeId`는 `SEGMENT_LENGTH` 노드(두 점의 길이)를 가리킨다. 견본: golden item39. 한 글자 변수 길이는 `segmentLabels:[{"id","ownerSegment","variable":"a","unit":"cm"|"m","factRole":"GIVEN"}]`.
- **입체·통계 plan에는 `sourceQuote` 키를 넣지 않는다**(solid-figure-v1·stat-chart-figure-v1이 거절). 가이드 7절의 sourceQuote는 construction 계열에만.
- **입체 꼭짓점 이름 없음**: `names` 문자열에서 이름 없는 꼭짓점은 `.`(예: `"........"`). 원문에 이름이 없으면 이렇게 쓴다(임의 이름 금지).
- **입체 강조**: 모서리·대각선 강조는 `segments:[{"from","to","style":"AUTO","role":"REF"(굵게)|"ACCENT"(빨강)}]`, 면 칠은 `highlights:[{"polygon":[...]}]`.
- **반직선·직선**: `displaySegments`의 `arrow:"END"|"BOTH"`. 끝점 너머로 뻗는 쪽은 숨은 보조점(TRANSLATE_POINT/POLAR_POINT, `DERIVED_INTERMEDIATE`, `hiddenPointNames`).
- **각도 값이 숫자인 각**: `planeMarks.angles`의 `value`·`label`(°는 엔진이 붙인다). 선분 곁 식 라벨에 도를 쓰려면 `15°` 처럼 값 뒤 `°`.
- **정답 값**을 그림에 새로 쓰지 않는다(문제가 묻는 값). 풀이 중간값·주어진 값만.
- **원문에 점 이름이 없는 평면도형(엔진 E1, 지금 사용 가능)**: 그 점 id(SOURCE_POINT 포함)를 `hiddenPointNames`에 넣고, 교점·꼭짓점에 점 표식도 없게 하려면 plan 최상위 `"hiddenPointStyle":"NONE"`. 숨긴 점 이름을 caption·라벨·pointNames에 글자로 쓰면 거절(`HIDDEN_POINT_NAMED_IN_TEXT`). 반직선 끝 너머 숨은 보조점도 이렇게 하면 점이 안 보인다. 임의 이름(A, P 등)을 붙이지 않는다.
- **전개도 강조(엔진 E2, 사용 가능)**: `net.highlights:[{"face":"side1","fill":"LIGHT"}]`(면 칠), `net.segments:[{"face":"side0","edge":2,"role":"ACCENT"|"REF"}]` 또는 `{"from":"B","to":"C","role":"ACCENT"}`(모서리 강조). 각기둥·각뿔·각뿔대 전개도만.
- **입체 세기 번호(엔진 E3, 사용 가능)**: 입체 항목에 `count:{"vertices":true,"edges":true}` → 꼭짓점 1,2,…, 모서리 ①②…(숨은 모서리 포함). 꼭짓점 이름(`names`)과 함께 쓰지 않는다(`.`로 비운다).
- **줄기와 잎 문자 잎·순위 강조·계급 묶음(엔진 E14, 사용 가능)**: STEM_LEAF `values:[{"symbol":"a","stem":1,"order":3}]`(값을 지어내지 않고 위치만), `marks:[{"rank":10}]`(크기 순위로 잎 동그라미), `classGroups:[{"from":5,"to":10,"label":"3"}]`(한 줄기 안 구간 괄호·도수, 엔진이 도수를 직접 세어 다르면 거절). 자세한 것은 guide-stat.md가 아니라 최신 AUTHOR_GUIDE.md 3-11절을 grep.
- **반비례 y=k/x(엔진 E9, 사용 가능)**: `rational-spike-v1` `graphPlan.numerator:["k","0"]`, `denominator:["0","1"]`(k≠0) → 쌍곡선 두 가지, 축과 겹치는 점근선은 따로 안 그림. `formulaLabel:"y=b/x"`처럼 곡선 식 라벨, `requiredPoints`는 좌표와 함께 점으로. 오버레이 다각형 안 라벨 `overlays.polygons[].label`(+`labelKind`). 정비례 y=ax는 `piecewise-polynomial-spike-v1` 한 조각 `pieces:[{coefficients:["0","a"]}]` + 원점을 requiredPoints에. y=ax와 y=k/x를 한 그림에 함께는 아직 불가. 최신 AUTHOR_GUIDE.md 3-2·3-14절 grep.
- 숨길 점 중 SOURCE_POINT가 아닌 것은 factRole `DERIVED_INTERMEDIATE`. 좌표축 그림(SOURCE_COORDINATE_AXES)에서는 SOURCE_POINT를 숨길 수 없으니 O에서 TRANSLATE_POINT로 만든 파생점을 쓴다. `scalarLabels`는 `"prefix":""`로 이름 없이 값만.
- **한글 평문 라벨·단위(엔진 E8, 사용 가능)**: `planeMarks.expressionLabels[]`, `arcs[].label`, `traces[].label`에 `labelKind:"TEXT"`(㉠~㉥, "반직선 AB" 같은 한글 평문, 40자 이하)와 `unit:"cm"|"m"|"mm"`(수식 라벨 뒤 단위: `3cm`, `x cm`). 작도 순서 원문자 라벨은 traces label TEXT로.
- **특정 변 강조(엔진 E10)**: `displaySegments[].emphasis:"BOLD"`(굵게) | `"ACCENT"`(빨강 굵게).
- **원 밖 호 라벨 여백(엔진 E11)**: 호 라벨이 있으면 평면 프레임이 자동으로 넓어진다.
- **입체 합성·자르기·여러 이름(엔진 E4/E5/E6, 사용 가능)**: `composite-panels-v1`에 solid-figure-v1 패널(입체·전개도) 2~4개, 평면 패널과 혼합 가능(모서리 관계 그룹별로 같은 입체를 패널로 나눠 강조). 패널마다 이름은 그 패널 안에서만 겹치지 않으면 된다. `names` 목록 항목 `"M,A,I"`로 한 꼭짓점 여러 이름. 전개도 `net.segments`에 `{face,diagonal:[i,j]}`. `solids[].cuts:[{through:[[edge,"1/2",name?],...],keep?}]`로 평면 1~2개 절단. solid plan의 `sourceQuote` 허용. 입체 segments 상한 10.
- 합성 그림 2열 패널은 캔버스 폭 384 이하(400이면 한글 캡션에서 COMPOSITE_CAPTION_TOO_LARGE).
- 좁은 각(15~20°) 라벨이 LAYOUT_INVENTORY_INCOMPLETE면 두 변(반직선)을 길게(길이 8 정도) 그리면 자리가 난다.
- 각도로 정해진 점(닫힌 꼴 아닌 좌표) 사이 길이는 SEGMENT_LENGTH+scalarLabels가 UNSUPPORTED_SCALAR_NOTATION → `planeMarks.expressionLabels`에 `text`와 `unit:"cm"`로 쓴다.
- 그래프에 직선 y=ax를 함께: `graphPlan.overlays.lines:[{"id":"g","slope":"a","intercept":"0"}]`.

## 새로 병합된 엔진 기능 (2026-10-29 저녁)
- **E12 각 라벨 지시선**: 좁은 각·몰린 꼭짓점·큰 호의 각 라벨은 엔진이 자동으로 각 바깥에 두고 자기 호에서 시작하는 지시선을 단다. 예전처럼 noLabel로 빼지 말고 먼저 그대로 그려 본다. 지시선이 다른 선을 가로지르면 실패(ANGLE_LABEL_LEADER_CROSSES) → 변을 길게, 캔버스를 크게.
- **E16** 한 글자 각 이름 라벨 `∠A` 가능. **E18** `angles[].emphasisGroup` 1~3(빨강·파랑·초록)으로 동위각/맞꼭지각 등 관계를 색으로 구분(equalGroup 호 개수와 별개).
- **E17** 비정수 교점 사이 길이: `scalarLabels[{kind:"SEGMENT_LENGTH",...,"value":"2*sqrt(5)"}]`(엔진이 값 검산).
- **E19** 좌표 그림에서도 `hiddenPointNames`에 SOURCE_POINT 가능(이름만 숨김), `hiddenPointStyle:"NONE"` 또는 `unmarkedPointNames:[수선의 발들]`로 점 표식 빼기. **E20** 원점 근처 눈금 라벨 충돌은 자동으로 비킴.
- **E21 수직선**: POINTS 줄에 한글 자모 점 이름(ㄱ~ㅎ), `"name":null`/`hideName`, `showValue:false`, 한 줄 점 8개, `subdivisions:[{from,to,parts}]`, `band:false`, `axisVariable:false`.
- **E15 물 채우기**: 새 capability `container-fill-figure-v1`(가이드 3-50). 그릇 단면 profile(CYLINDER/FRUSTUM, 원뿔 r0="0")만 주면 높이-시간 그래프를 엔진이 계산.
- **E26 통계**: `frequencies`에 null(지워진 계급, total 필수), `restoredClasses`(점선 복원 막대), `hideValues`, `highlightClasses:[{classes:[..],tone:1|2}]`(다각형에도), `highlightPoints:[{series,class,showValue}]`, `classSums:[{from,to,label,unit}]`(묶음 괄호 합), 줄기와 잎 marks 16개·`rankLabels:"FROM_LARGEST"`. 값 라벨 겹침은 자동으로 비킴.
- **E27 구 자르기**: `SPHERE`에 `cut:{kind:"HALF"|"QUARTER"|"OCTANT"|"THREE_QUARTERS"|"SEVEN_EIGHTHS", facing?:"CUT"|"CURVED"}`(중심을 지나는 평면만). 단면 원판은 자동 칠, 가려진 호·반지름 점선. 분해(explode)는 미지원 → HALF 두 개를 나란히.
- **E28 입체**: 이름 없는 입체도 `highlights:[{face:"bottom"|"top"|"side<i>",fill}]`로 면 칠, 원뿔대 몸체 칠 `section.fill:"BOTTOM"|"TOP"`, 합성 패널 안 모서리 세기 번호 배치 보강.

## E28b·E29 입체 (2026-10-29 병합)
- **이름 없는 꼭짓점 참조:** 원문에 꼭짓점 이름이 없으면 A~H를 지어 붙이지 말고 `"#b0"`(아래 밑면 i번째), `"#t2"`(위 밑면 i번째), `"#apex"`, `"#apex2"`(쌍뿔 아래 꼭짓점), `"#v5"`(모델 순서)를 segments·dims(edge/from/to)·highlights polygon·marks에 쓴다. 입체가 여럿이면 `"s2#b0"`. `dims.edge`는 `["#b1","#t1"]`처럼 높이 모서리도 받는다. 이름은 `names:"........"`로 숨긴다. 이름 없는 입체에도 치수나 번호 라벨이 하나는 있어야 한다(`SOLID_FIGURE_NEEDS_A_LABEL`).
- **전개도:** `net.faceLabels:[{face,text?}]`(text를 빼면 면 넓이를 정확한 값으로 씀; 숫자 text는 넓이와 같아야 하고, 그 밖의 기호(예: "①"·"가")는 자유), `net.rightAngles:[{face,corner}]`, `net.excluded`(원기둥 bottom/top·원뿔 base를 점선·회색으로 "제외"). 면 세기 번호는 전개도 faceLabels로 1,2,3…을 붙인다.
- **새 입체:** `REGULAR_POLYHEDRON {faces:4|8|12|20, side}`, `BIPYRAMID {base, height}`(면 이름 `f0..`, `top<i>`·`bottom<i>`). 정다면체·쌍뿔은 전개도·cuts 없음. 입체 위 `count.faces`는 미지원(`SOLID_COUNT_FACES_UNSUPPORTED`) → 면 칠 묶음으로 센다.

## E7·E8b·E12b 평면 표기 (2026-10-29 병합)
- **치수선·길이 괄호:** `planeMarks.dimensions:[{id,from,to,label:"24\\,cm",side:"ABOVE|BELOW|LEFT|RIGHT",style:"BAR|ARROW|BRACE",offset:1..3}]` — 같은 직선 위 겹치는 구간(AM·MB·AB)은 offset으로 층을 나눈다. 숨은 점으로 우회하지 않는다.
- **꺾인 경로 총길이:** `planeMarks.pathLabels:[{id,points:[3~8개],label}]`(지시선 방식).
- **각 라벨 지시선 강제:** `angles[].labelPlacement:"LEADER"`(+ 기존 `ring` 1~3) — 같은 꼭짓점에 겹친 각(x·2x·3x) 라벨에 쓴다. 숨은 점으로 반직선 줄이는 우회는 쓰지 않는다.
- **작도 흔적:** `traces[].span:"JOIN"`(교점을 모두 지나는 긴 호), `traces[].labelAt:"START|MID|END"|각도`; 선분 라벨 `expressionLabels[].labelAt`.
- **합성 패널 캡션:** 길면 자동 두 줄(`COMPOSITE_CAPTION_TOO_LARGE`이면 줄인다).

## E13·E22 그래프 (2026-10-29 병합)
- `overlays.latticePoints {region:BELOW_CURVE|ABOVE_CURVE, xRange, yMin|yMax, strict, counts}`(최대 40점, 열별 개수), `graphPlan.displayWindow`(반비례 확대 창)·`formulaAt`, `overlays.points[].coordinates`·`unnamed`·`labelDirection`, `overlays.segments[].length`, `graphPlan.axisTitles {x:"시간(분)",y:"거리(km)"}`. 기울기 큰 직선 식 라벨은 자동으로 다른 자리로 옮김.

## E28c·E4b·E5b·E5c 입체 (2026-10-29 병합)
- **라벨 규칙 완화:** 이름 없는 입체·전개도 패널도 강조(highlights·segments role·면 칠)·`solidCaption`·격자 패널이면 라벨 없이 통과 — 원문에 없는 a·h·꼭짓점 번호를 억지로 붙이지 않는다.
- **한글 낱말 라벨:** `labels:[{text:"회전축",at:<꼭짓점참조>|{axis}|{slant}|{edge}|{face}}]`, 회전체 `axis:true|{label:"l"}`(점쇄선 축).
- **전개도:** `net.faceLabels` 면 기호(①~⑳·㉠·가·(가)), `net.edgeLabels:[{face,edge,text}]`(길이·기호·낱말); 부채꼴 면 라벨 오판 수정.
- **원뿔 모선 같음:** `marks.equalSlant`. **꼭짓점 세 개 절단:** `cuts:[{vertices:["A","C","F"]}]`(이름·#b0 참조).
- **격자 패널 5~6개**(입체 합성), 구·반구 수평 단면 `section LEVEL`. **원기둥 안 공:** `stack:{count,radius}` 또는 `inside:[{kind:"SPHERE",radius,centerZ}]`. 꽉 낀 공의 반지름 치수는 자리가 없을 수 있어 캡션에 쓴다.
- **라벨·치수선 배치가 실패하거나 오독될 때는 그 선분·각을 끌어내 따로 크게 보이는 방법을 먼저 쓴다(적극 권장).** LAYOUT_INVENTORY_INCOMPLETE, DIMENSION_CROSSES_STROKE, 좁은 꼭짓점(20° 안팎)·짧은 선분·몰린 각 때문에 라벨이 다른 조각에 붙어 읽히는 경우: 합성 2패널로 왼쪽은 원래 도형(관계 표식만), 오른쪽은 문제의 선분(예: C–G–D)이나 각만 같은 점 이름으로 펴서 크게 다시 그리고 거기에 치수선 단(offset AUTO)·각 라벨을 둔다. 예: /home/user/AP------/.tmp/svg-m1/examples/q6-segment-pullout-plan.json. 엔진에 planeMarks.callouts(E37)가 들어오면 그 필드를 쓴다. 라벨을 지우거나 캡션으로 빼는 것보다 이것이 먼저다.
