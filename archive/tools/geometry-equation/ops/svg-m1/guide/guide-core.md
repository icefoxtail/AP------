# 유사문제 생성: 발문·해설 그림(SVG 엔진) 작성 지침

이 문서를 읽는 AI는 유사문항을 만들면서, 그림이 필요한 곳에는 SVG 엔진이 그리는 `plan.json`을 함께 쓴다.
SVG, 좌표 계산 결과, 픽셀 좌표는 직접 쓰지 않는다. 엔진이 plan에서 정확한 값을 계산해 그린다.

정확한 plan 형식은 이 문서 아래쪽 「plan 계약 전문」이 정본이다. 이 지침과 계약 전문이 충돌하면 계약 전문을 따른다.


## 1. 순서

1. 문항(발문, 보기, 정답)과 풀이를 먼저 완성한다. 모든 값을 직접 풀어 확인한다.
2. 그 풀이를 보고 그림이 필요한지 정한다(아래 2).
3. 그림이 필요하면 plan을 쓴다. plan의 모든 수치는 방금 쓴 문항과 풀이에서 가져온다.
4. 엔진이 오류 코드를 돌려주면 코드별 조치(아래 6)대로 plan만 고친다.


## 2. 그림이 필요한가

- 발문 그림: 학생이 문제를 읽을 때 봐야 하는 주어진 조건만 그린다. 구하는 값, 풀이로 얻는 점, 정답을 암시하는 표시는 넣지 않는다. 엔진은 이를 강제하지 않으므로 작성자가 지킨다.
- 해설 그림: 풀이의 결정적 관계를 보여 준다. 접점, 교점, 꼭짓점, 대칭점, 수선의 발, 구간에서의 최대·최소, 부등식의 해집합 등.
- 풀이가 순수 계산(전개, 인수분해, 방정식 풀이)이고 공간이나 그래프 관계가 없으면 그림을 만들지 않고 `{"status":"EXEMPT","reason":"한 문장"}`을 쓴다.
- 세로선 x=k는 guide-graph.md 3-14 `overlays`의 `{"id":"k","x":"2"}`로 그린다(밑 그래프는 상수함수 등 아무 곡선). 원기둥 안에 구 쌓기는 guide-tips.md(E28c)를 본다. 그 밖에 엔진이 못 그리는 것(삼차 이상 그래프와 직선 조합 등)은 `{"status":"UNSUPPORTED","reason":"필요한 것"}`을 쓴다. 비슷하게 억지로 그리지 않는다. 그래프의 색칠 영역은 아래 3-6-영역의 `graphPlan.regions`로, 중학교 평면도형의 색칠은 3-9의 `planeMarks.regions`로 그린다.
- 발문 그림과 해설 그림은 별개의 plan이다. 각각 따로 쓴다.


## 3. 어떤 plan을 쓰는가

- 좌표축 없는 중학교 평면도형(각도 표식, 같은 길이·평행 표시, 호 강조): `construction-spike-v1`의 `PLANE_FIGURE_v1`과 `planeMarks`(아래 3-8). 길이와 각으로 점을 놓는 `POLAR_POINT`.
- 좌표평면의 점, 직선, 원, 도형: `construction-spike-v1` (mathPlan 노드: SOURCE_POINT, SOURCE_LINE, MIDPOINT, PERPENDICULAR_FOOT, INTERSECTION 등). 주어진 점은 SOURCE_POINT, 풀이로 얻는 점은 파생 노드로 쓴다. 파생점에 좌표를 직접 쓰지 않는다.
- 이차함수(필요하면 직선 포함): `polynomial-spike-v1`. **계수·직선의 기울기·절편이 무리수**(`k=-3±2√3`, `m=3-√7`처럼 접하는 조건으로 나온 값)이면 이 capability가 아니라 `piecewise-polynomial-spike-v1`의 조각 한 개로 쓴다(아래 3-4).
- 두 이차함수(f와 g)가 만나는 풀이: `piecewise-polynomial-spike-v1`의 `referenceCurves`(아래 3-6).
- 여러 경우(k=-2일 때, k=3일 때)를 비교하는 풀이: `composite-panels-v1` (경우마다 패널 하나, 2~3개). 삼차·사차 그래프 두 경우(예: a=-1과 a=1/8의 중근)도 2패널로 비교한다(3패널은 이차함수만). **평면도형 여러 개**(보기 ①~⑤, 서답형 ①·②)를 나란히 비교하면 그 패널들은 2~5개 격자로 묶는다(아래 3-16).
- 사인·코사인과 수평선·직선의 교점 개수를 구간에서 세는 풀이: `trigonometric-spike-v1`의 `INTERVAL_PI`(아래 3-7).
- 이어진 조각 그래프(이차식의 절댓값 등)와 수평선 또는 기울어진 직선: `piecewise-polynomial-spike-v1`(아래 3-3).
- **끊어지는(불연속) 조각함수**: 조각마다 다른 종류(상수·일차·이차)이고 경계에서 점프하거나 함수값이 따로 정해진 경우, 고립점, 계단함수: `piecewise-discontinuous-spike-v1`(아래 3-15).
- 이차부등식 풀이(판별식, 그래프, 구간, 수직선): `quadratic-inequality-chain-v1` 하나로 쓴다. 계수와 부등호만 주면 끝점, 열린·닫힌 점, 정수점은 엔진이 계산한다. 해가 구간 하나인 경우만 된다(두 조각이거나 공집합이면 거절된다). 계수가 고정된 이차부등식 하나일 때만 쓴다. 매개변수(a, n 등) 때문에 경우가 나뉘거나("n=1, n=2~4, n≥5"), 부등식이 여러 개이거나, 풀이가 결과 요약뿐이면 체인이 아니다. 그때 풀이가 해집합을 수직선 위에서 비교하는 것이면 아래 `number-line-figure-v1`을 쓴다. 그래프가 필요하면 풀이가 실제로 쓰는 그래프 하나(예: 해가 한 점인 접점 그래프)만 `polynomial-spike-v1`로 그리거나, 그림이 없어도 되면 EXEMPT, 못 그리면 UNSUPPORTED를 쓴다.
- 수직선만 필요한 풀이(두 부등식 해의 교집합, 끝점이 a에 따라 움직이는 해집합, 정수해, 수직선 위 내분점): `number-line-figure-v1`. `numberLine.rows`에 해집합을 한 줄씩(`SET`) 쓰면 같은 눈금 위에 겹쳐 그려지고, `RESULT` 줄은 위 줄들의 공통 범위를 엔진이 계산해 마지막 줄로 그린다(그 끝점은 직접 쓰지 않는다). 한 줄은 구간 한두 조각(`x<-1 또는 x>2`는 두 조각)이고, 끝점은 `{"value":"-1","state":"OPEN"}`(OPEN은 <, >, CLOSED는 ≤, ≥), 끝이 무한이면 `null`, 끝이 근호이면 정확한 문자열 `{"value":"-sqrt(10)","state":"OPEN"}`(`p+q*sqrt(r)` 꼴, 한 plan에 근호 하나; 소수는 안 된다, 관련 오류 `NUMBER_LINE_VALUE_INVALID`/`NUMBER_LINE_RADICALS_MIXED`; 근호 끝값이 다른 끝과 너무 가까우면(`3`과 `sqrt(10)`) `NUMBER_LINE_LABELS_TOO_CLOSE`이니 공통 범위 줄(RESULT)을 빼고 줄만 비교한다), 끝이 a에 따라 움직이면 `{"param":{"mul":"1/3","add":"2/3"},"state":"OPEN"}`(=mul*a+add, 라벨은 분수가 세로로 쌓인 (a+2)/3으로 엔진이 쓴다)이다. `param` 끝이 있으면 `"parameter":{"name":"a","value":"-1"}`로 **그림을 그릴 a의 값**을 정한다(그림에 "a=-1 일 때의 그림"이 표시된다). 풀이가 다루는 경우(경계값 등)를 골라 쓰고 caption에 밝힌다. a에 따라 해의 모양이 달라지는 풀이는 그 한 경우만 그려지니 전체 답의 그림인 척 쓰지 않는다. 정수점은 해당 줄에 `"integerPoints":true`(유계) 또는 `{"range":["-5","5"]}`(최대 25개)를 쓴다. 내분점은 `{"kind":"POINTS","points":[{"id":"A","value":"-2"},{"id":"B","value":"4"},{"id":"P","divides":{"from":"A","to":"B","ratio":["1","2"]}}]}`로 쓰면 P가 AP:PB=1:2인 자리에 놓이고 AP, PB 위에 1, 2가 표시된다(외분점은 안 된다). **중1 표기:** 점 이름은 한글 자모 한 글자(ㄱ~ㅎ)도 된다(`{"id":"ㄱ","value":"-4"}` 또는 `"name":"ㄱ"`). 이름 없는 점은 `"hideName":true`(또는 `"name":null`), 묻는 점의 값은 `"showValue":false`로 쓰지 않는다(점과 이름은 그려진다). 한 줄 점은 2~8개(라벨이 겹치면 `NUMBER_LINE_LABELS_TOO_CLOSE`). 정수 사이 등분 눈금은 POINTS 줄에 `"subdivisions":[{"from":"-3","to":"-2","parts":3},{"from":"1","to":"2","parts":2}]`(정수 구간, parts 2~10)로 준다. 그러면 점과 구간 범위의 모든 정수에 눈금과 숫자가 생기고 지정한 구간의 한 칸마다 짧은 등분 눈금이 찍히며(지정 안 한 구간은 정수 눈금만), 값을 쓰는 점은 값이 이름 위에 쌓인다. 정수 위 점의 값은 아래 눈금 숫자와 겹쳐 쓰는 셈이니 `showValue:false`를 권한다. 점 사이에 굵은 선분이 필요 없으면 줄에 `"band":false`, 축 끝의 변수 표시(x)가 필요 없으면 `numberLine`에 `"axisVariable":false`를 쓴다. 관련 오류 `NUMBER_LINE_POINT_NAME_INVALID`/`NUMBER_LINE_POINT_NAME_DUPLICATE`/`NUMBER_LINE_SUBDIVISIONS_INVALID`/`NUMBER_LINE_TICKS_TOO_DENSE`(등분이 너무 촘촘함)/`NUMBER_LINE_AXIS_VARIABLE_INVALID`. 이차함수 그래프가 풀이에 필요하면 이것이 아니라 `quadratic-inequality-chain-v1`을 쓴다. 판 전체 모양은 `{"capability":"number-line-figure-v1","numberLine":{"parameter":{...},"rows":[...]},"numberLineCaption":{"text":"두 해의 공통 범위"},"caption":...,"sourceConditions":...,"newVisualInformation":...}`다.
- 입체도형(각기둥·각뿔·각뿔대·원기둥·원뿔·원뿔대·구·반구)을 숨은 모서리 점선·꼭짓점 이름·길이와 함께, 또는 각기둥·각뿔·원기둥·원뿔의 전개도, 회전축을 지나는 단면, 원뿔 모양 그릇의 수면: `solid-figure-v1`(아래 3-입체). 치수를 실제 길이로 쓰면 엔진이 3차원 모델에서 투영·숨은선·전개를 계산한다.
- 통계·확률 그림(도수분포 히스토그램·도수분포다각형·상대도수 그래프, 줄기와 잎 그림, 상자그림, 산점도, 두 주사위의 6×6 표, 확률 수형도): `stat-chart-figure-v1`. 자료의 값만 정확히 주면 눈금, 막대 높이, 다각형 꼭짓점, 사분위수, 표의 칸 색칠, 경로 확률은 엔진이 계산한다. 자세한 쓰는 법은 아래 3-11절.
- 집합 벤다이어그램(1~3개 집합의 원소 배치, 합집합·교집합·차집합·여집합 영역 색칠, B⊂A 포함관계)과 유한집합 대응도(X→Y, 합성 X→Y→Z, 함수와 역방향 화살표 한 그림): `set-diagram-figure-v1`. 원소가 어느 집합에 속하는지와 색칠할 집합식만 정확히 주면 원자 영역, 색칠 기하, 원소 위치는 엔진이 계산한다. 자세한 쓰는 법은 아래 3-12절.


## 4. 이름과 표기 규칙 (자주 걸리는 것)

- 그림에 나오는 점 이름은 노드 id다. 문항과 풀이 텍스트에 쓴 이름과 같아야 한다. 풀이가 점 이름을 쓰지 않으면 한 글자 대문자(A, B, P)만 쓰고, O0, Pp, C1 같은 내부식 이름은 쓰지 않는다. 풀이에 쓰지 않은 보조점은 숨김 필드를 쓴다.
- **프라임·아래첨자 이름(A′, T₁, T₂):** id는 `A`, `T1`, `T2`처럼 간단하게 두고, plan 최상위에 `"pointNames":{"T1":"T_1","T2":"T_2","A":"A'"}`을 쓴다(작도 plan, 그래프 plan, 수직선 도형 plan 모두 같은 모양, 합성 패널이면 그 패널 plan 안). 키는 그림이 실제로 그리는 점의 id(작도 `displayPoints`, 그래프 `requiredPoints`와 `graphPlan.overlays.points`, 수직선 `POINTS` 행의 점)이고, 값은 **대문자 한 글자 + 프라임(`'` `′` `″`, 최대 2개) + 아래첨자 숫자 1~9(최대 2자리)** 순서다. `T_1`, `T_{1}`, `T₁`은 같은 이름이고 `A'`, `A′`도 같다. 그림에는 진짜 아래첨자와 ′가 그려지고(점 이름과 좌표 띠 `T₁(3, 2)` 모두), 풀이 글에는 같은 이름을 쓴다.
  - 이름이 있는 그래프 점은 좌표가 있으면 좌표 띠로 올라간다(`T₁(x, y)`). 좌표가 없으면 점 옆에 이름만 그린다.
  - 소문자·낱말·숫자 0·두 글자 이상·프라임보다 앞선 아래첨자는 쓸 수 없다. 두 점이 같은 이름을 보이면 안 되고, `hiddenPointNames`로 숨긴 점에는 이름을 못 붙인다. 점 id에는 ′나 아래첨자를 직접 쓰지 않는다.
- 풀이가 치환(t=x²−2x)하고 그 변수의 그래프를 그리면 `graphPlan.axisVariable`에 그 문자를 쓴다(소문자 한 글자, y 제외). 판별식 D를 a에 대한 함수로 그리면 `"axisVariable":"a"`다. 축과 식이 그 문자로 나온다.
- 축 이름에 단위를 쓰려면(시간(분), 거리(km)) 그래프 plan에 `"axisTitles":{"x":"시간(분)","y":"거리(km)"}`를 쓴다(x·y 중 하나만도 된다). 그 축 끝의 글자 x·y 대신 한국어 제목이 평문으로 들어간다. 제목은 10자 이하(한글·영문·숫자·공백·`()/.,%-`)이고 TeX·수식은 쓰지 못한다(`AXIS_TITLE_INVALID:<축>`). 그려지지 않는 축의 제목은 `AXIS_TITLE_AXIS_HIDDEN:<축>`이다. 제목이 들어갈 자리가 없으면 그림을 거절한다(조용히 빼지 않는다). 관측기가 최종 SVG에서 제목을 읽어 확인한다.
- 수치는 정확한 정수나 분수 문자열로 쓴다("17/4", "-1/2"). 소수로 근사하지 않는다.
- 직선의 식을 그림에 쓰려면 `lineLabels`를 쓴다(식이 직선 옆 지시선으로 붙는다). 식 라벨을 따로 띄우지 않는다. `SOURCE_LINE`의 계수는 정수·분수 외에 `p+q√r` 꼴(한 근호 하나, 예: `sqrt(3)`)도 된다: `y=√3x+6`처럼 쓰이고, 기울기형은 y의 계수가 유리수여야 한다(`LINE_LABEL_COEFFICIENT_NOT_RATIONAL`). 두 가지 다른 근호가 한 계수에 있으면 거절된다.
- 점의 좌표를 그림에 쓰려면 `coordinateLabels`에 그 점을 넣는다. 점이 몰리면 `coordinatePlacement:"PANEL"`로 좌표를 띠로 올린다.
- `caption`은 학생이 읽는 한국어 한 문장이다. 내부 용어, 디버그 문구, TeX 명령을 쓰지 않는다.
- 이 plan이 어느 문항의 것인지 확인하기 위해 plan 최상위에 `"sourceQuote"`를 넣는다. 이 문항의 발문 또는 풀이에서 글자 그대로 복사한 12~40자다(다른 문항 것을 쓰지 않는다). 엔진은 이 필드를 무시한다. 작성 파이프라인의 실행기가 있으면 이 문항에 실제로 있는 문장인지 대조한다.


## 5. 그래프 배율

- 이차함수 그래프는 x축과 y축의 눈금 길이를 같게 그리는 것이 기본이다. viewport를 임의로 크게 잡아 납작하거나 길쭉하게 만들지 않는다.
- 세로로 너무 길면 `graphPlan.axisSqueeze:true`로 세로를 최대 1/2까지 줄일 수 있다. 그 이상 찌그러뜨리는 요청은 하지 않는다.
- x 범위에 비해 y 범위가 훨씬 커서 곡선이 너무 좁아지면 엔진이 거절한다. 두 축이 서로 다른 양인 문장제(횟수 대 금액)이면 3-5절의 `applicationAxes`를 쓴다. 순수 수학 그래프이면 그림을 포기하고 UNSUPPORTED를 쓴다.


## 6. 오류가 오면 이렇게 고친다

- `NAME_NOT_IN_SOLUTION`: 그림의 점 이름이 풀이에 없다. 풀이에 쓴 이름으로 id를 바꾼다.
- `POINT_DISPLAY_NAME_INVALID:<id>`: `pointNames` 값이 허용 형식이 아니다(대문자 한 글자 + 프라임 + 아래첨자 1~9). `T_1`, `A'`, `T₁`처럼 고친다. `POINT_NAME_TARGET_UNKNOWN:<id>`: 키가 그림이 그리는 점의 id가 아니다. `POINT_DISPLAY_NAME_DUPLICATE:<이름>`: 두 점이 같은 이름을 보인다. `POINT_NAME_TARGET_HIDDEN:<id>`: 숨긴 점에는 이름을 못 붙인다. `POINT_DISPLAY_NAME_MISMATCH` / `POINT_DISPLAY_NAME_NOT_SHOWN`: 최종 SVG에 그려진 글자가 plan의 이름과 다르다(독립 관측기가 글리프에서 읽는다). 이 코드는 엔진 결함 신호이니 이름을 바꿔 보고, 그래도 나면 보고한다.
- `SOURCE_QUOTE_MISSING` / `SOURCE_QUOTE_NOT_IN_ITEM` (작성 파이프라인의 실행기가 내는 코드): plan 최상위에 `sourceQuote`를 넣는다. 12~40자, 이 문항의 발문 또는 풀이에서 글자 그대로 복사한다.
- `POLAR_POINT` 오류 `INVALID_POLAR_LENGTH`/`INVALID_POLAR_ANGLE`/`INVALID_POLAR_TURN`/`DEGENERATE_POLAR_REFERENCE`, 평면도형 오류 `PLANE_FIGURE_HAS_FRAME_HELPERS`/`PLANE_FIGURE_SOURCE_POINT_REQUIRED`/`REALIZATION_RECIPE_REQUIRED`: 3-8절의 모양으로 고친다.
- 표식 오류(3-8절): `ANGLE_MARK_FACT_MISMATCH`(말한 각이 점들이 만드는 각과 다르다: 작도를 고친다), `ANGLE_MARK_DEGENERATE`/`ANGLE_ARC_TOO_SMALL`(세 점이 일직선이거나 5° 미만), `ANGLE_MARK_STYLE_INVALID`(`style`은 `SECTOR`·`ARC`), `ANGLE_MARK_LABEL_REQUIRED`, `ANGLE_EQUAL_GROUP_MISMATCH`/`_ARC_COUNT`/`_STYLE_MISMATCH`/`_AMBIGUOUS`, `EQUAL_MARK_LENGTH_MISMATCH`, `PARALLEL_MARK_NOT_PARALLEL`, `EQUAL_MARK_GROUP_AMBIGUOUS`/`PARALLEL_MARK_GROUP_AMBIGUOUS`, `MARK_COUNT_INVALID`, `MARK_SEGMENT_TOO_SHORT`, `MARK_TARGET_UNKNOWN:<id>`, `MARK_ID_DUPLICATE`, `MARK_FIELD_UNKNOWN`, `ARC_ENDPOINT_NOT_ON_CIRCLE`, `ARC_SIDE_AMBIGUOUS`, `ARC_CENTER_MISMATCH`, `FACT_TARGET_NOT_DRAWN`. 최종 SVG를 읽은 관측기 판정 `PLANE_MARKS_AUDIT_FAIL`(오류 목록의 `MARK_LABEL_OVERLAPS`, `ANGLE_LABEL_NOT_IN_ANGLE`, `ANGLE_SECTOR_*`, `UNDECLARED_MARK` 등)은 표식이나 라벨을 줄이고 그림을 키운다. 자리가 없으면 `LAYOUT_INVENTORY_INCOMPLETE`(점 이름·라벨 자리 부족)이니 같은 처방이다.
- 좌표 그림의 표식(3-10절): 3-8절 오류가 그대로 나오고, 그래프 plan에 `planeMarks`나 점선·화살촉 `displaySegments`를 넣으면 `PLANE_MARKS_UNSUPPORTED_ON_GRAPH`다. 축을 그대로 두는 좌표 작도 plan으로 다시 쓴다(축 없는 `PLANE_FIGURE_v1`으로 바꾸지 않는다).
- `INEQUALITY_SOLUTION_NOT_ONE_INTERVAL`: 해가 두 조각이다. 풀이의 조건을 `domain`으로 옮기거나 그림을 포기한다.
- `NUMBER_LINE_LABELS_TOO_CLOSE` / `NUMBER_LINE_INTEGER_POINTS_TOO_DENSE`: 정수점 범위를 좁힌다. 수직선 그림이면 끝점이 너무 가까운 것이니 a의 표본값을 바꿔 끝점 사이를 벌린다.
- `NUMBER_LINE_RESULT_EMPTY` / `NUMBER_LINE_RESULT_IS_A_POINT` / `NUMBER_LINE_TOO_MANY_PIECES`: 공통 범위가 공집합, 한 점, 세 조각 이상이다. 표본값 a를 풀이가 다루는 경우로 바꾸거나 그림을 포기한다.
- `NUMBER_LINE_PARAMETER_MISSING` / `_UNUSED` / `_INVALID` / `_COEFFICIENT_ZERO`: `param` 끝이 있을 때만, 그리고 그때는 반드시 `parameter:{name,value}`를 쓴다. name은 소문자 한 글자(변수와 y 제외), value는 정확한 정수·분수 문자열, `mul`은 0이 아니다.
- `NUMBER_LINE_PIECES_OVERLAP` / `_PIECES_TOUCH` / `_PIECE_INVALID` / `_PIECE_IS_A_POINT`: 한 줄의 조각은 서로 겹치지 않는 구간이어야 하고(끝이 닿으면 하나로 쓴다), 한 점짜리 조각은 쓸 수 없다. 아래 끝은 위 끝보다 작아야 한다.
- `NUMBER_LINE_INTEGER_POINTS_NEED_RANGE` / `_TOO_MANY_INTEGER_POINTS`: 반직선 줄의 정수점은 `{"range":["lo","hi"]}`로 범위를 준다(25개까지).
- `NUMBER_LINE_POINTS_COINCIDE` / `NUMBER_LINE_DIVISION_INVALID`: 점들의 값은 서로 달라야 하고, 내분점의 from, to는 값을 가진 다른 점이며 ratio는 양의 정수 두 개다.
- `NUMBER_LINE_VALUE_INVALID`: 끝값은 소수가 아닌 정확한 정수나 분수 문자열이다.
- `RENDERED_LAYOUT_FAIL` / `POLISH_REQUIRED`: 라벨이 겹치거나 자리가 없다. 엔진은 점 이름이 점에서 20px 이상 떨어지면 점과 이어 주는 지시선을 반드시 그리고, 지시선이 지나갈 빈 곳이 없으면 그림을 거절한다. 원, 접선, 반지름이 한 점에 모인 곳이 대표적이다. 표시할 점과 라벨 수를 줄이거나(풀이가 쓰지 않는 점의 좌표를 빼거나), 좌표를 띠로 올린다(`coordinatePlacement:"PANEL"`).
- `INVALID_DIVISION_RATIO` / `EXTERNAL_DIVISION_EQUAL_RATIO` / `INVALID_DIVISION_MODE` / `DEGENERATE_DIVISION_SEGMENT`: `DIVISION_POINT`의 m, n은 양수여야 하고 외분은 m≠n, 두 끝점은 서로 달라야 한다. 문자 비나 음수 비는 UNSUPPORTED.
- `DEGENERATE_TRIANGLE`: `CENTROID`의 세 점이 한 직선 위에 있다. 꼭짓점 좌표를 다시 확인한다.
- `REFLECTION_POINT_AT_CENTER` / `REFLECTION_POINT_ON_LINE`: 대칭점이 원래 점과 같아진다. 두 점이 겹쳐 그릴 수 없으니 그 점만 그리지 않거나 그림을 포기한다.
- `ZERO_TRANSLATION` / `UNSUPPORTED_SCALAR_REF`: 평행이동량은 0이 아닌 수 리터럴이어야 한다. 문자나 다른 노드를 가리키는 값은 UNSUPPORTED.
- `EQUAL_UNIT_PARABOLA_TOO_NARROW` / `EQUAL_UNIT_CURVE_TOO_NARROW`: 이 풀이는 같은 배율로 못 그린다. 단위가 다른 두 축의 문장제이면 3-5절의 `applicationAxes`, 아니면 UNSUPPORTED를 쓴다.
- `APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL` / `INVALID_APPLICATION_AXES` / `APPLICATION_AXES_TICKS_INVALID:x|y` / `APPLICATION_AXES_CURVE_TOO_NARROW`: 3-5절의 조건(이차함수, INTERVAL, 1·2·5 눈금)에 맞게 plan을 고친다.
- 같은 오류가 반복되면 plan을 고치는 대신 EXEMPT 또는 UNSUPPORTED로 마무리한다. 다른 문항의 plan을 참고하지 않는다.


## 7. 출력

- 문항 JSON(발문, 보기, 정답, 풀이)과 그림마다 `plan.json` 한 개.
- plan.json에는 `sourceQuote`(위 4), `sourceConditions`, `newVisualInformation`(그림이 새로 보여 주는 정보)을 넣는다.
- 그림이 필요 없으면 plan 파일 없이 문항만 낸다. 이유는 notes에 한 줄로 쓴다.


## 8. plan을 직접 그려 보기

- 저장소 루트에서 `node archive/tools/geometry-equation/production/render-plan.mjs --item item.json --plan plan.json --out out/` 한 번으로 그린다. `item.json`은 `{"sourcePath":"archive/exams/....js","ordinal":3}`.
- 결과는 `out/figure-result.json`의 `status`: `ARCHIVE_BOUND`(그림 `figure-solution.svg` 완성), `EXEMPT`/`UNSUPPORTED`(작성자 판단 그대로), `FAILED`(`stage`와 엔진 오류 `detail`을 보고 6에 따라 고친다).
- 독립 관측기 검사는 이 안에서 함께 돈다. 시험지 해설 페이지 열림 검증은 하지 않는다.
