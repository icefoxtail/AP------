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
- 엔진이 못 그리는 것(삼차 이상 그래프와 직선 조합 같은 것)은 `{"status":"UNSUPPORTED","reason":"필요한 것"}`을 쓴다. 비슷하게 억지로 그리지 않는다. 세로선은 이제 그린다: 그래프 위 `graphPlan.overlays`의 `lines`에 `{"id":"k","x":"2"}`를 쓴다(3-14). 원기둥 안에 구를 위아래로 둘 이상 쌓는 것도 그린다: 입체(`solid-figure-v1`)의 E28c 기능이며 `inside`로 원기둥 안에 놓는다(아래 3-입체). 그래프의 색칠 영역은 아래 3-6-영역의 `graphPlan.regions`로, 중학교 평면도형의 색칠은 3-9의 `planeMarks.regions`로 그린다.
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
  - **수직선 행 라벨·점 모양·구간 안 점 강조** (E30): 모든 줄에 `"label":"가능"`(한 줄, 6자 이하, 평문)을 쓰면 그 줄 축 왼쪽에 라벨이 서고 모든 줄의 축이 라벨 칸만큼 오른쪽에서 시작한다(`NUMBER_LINE_ROW_LABEL_INVALID`, 너무 길면 `NUMBER_LINE_ROW_LABEL_TOO_WIDE`). 점 줄(`POINTS`)의 점은 `"style":"FILLED"`(기본, 채운 점)·`"HOLLOW"`(열린 끝 ○)·`"CROSS"`(제외 ×)로 모양을 고른다(`NUMBER_LINE_POINT_STYLE_INVALID`). 점 줄에 `"within":k`(앞선 SET 또는 RESULT 줄의 번호, 1부터)를 쓰면 그 줄의 점마다 해집합 **안인지 정확히 판정**해, 안의 점은 채운 점에 고리(◎)를 두르고 바깥(열린 끝 포함)은 ×로 그린다(`style`을 직접 쓰면 그 모양이 이긴다). 예: `{"rows":[{"kind":"SET","pieces":[{"lo":{"value":"3","state":"OPEN"},"hi":{"value":"13","state":"OPEN"}}]},{"kind":"POINTS","within":1,"label":"가능","points":[{"id":"A","value":"5","hideName":true},{"id":"B","value":"9","hideName":true}]},{"kind":"POINTS","within":1,"label":"불가능","points":[{"id":"C","value":"3","hideName":true},{"id":"D","value":"15","hideName":true}]}]}`. `within`이 가리키는 줄이 앞선 SET/RESULT가 아니면 `NUMBER_LINE_WITHIN_INVALID`다. 판정과 모양·고리·라벨은 독립 관측기가 plan만 보고 다시 계산해 최종 SVG와 대조한다(`NL_POINT_STYLE`, `NL_POINT_RING`, `NL_POINT_CROSS_*`, `NL_ROW_LABEL_*`). 라벨 글자("가능")가 사실인지는 판정하지 않으니 `within` 판정과 맞는 줄에 쓴다.
  - **수직선 표기 숨김·한글 낱말 이름·간격 괄호** (E34): ① SET·RESULT 줄에 `"hideSetLabel":true`를 쓰면 줄 위의 부등식 라벨(-9/2<x<9/2)을 그리지 않는다(`NUMBER_LINE_HIDE_SET_LABEL_INVALID`). `parameter`에 `"hideNote":true`를 쓰면 "a=… 일 때의 그림" 노트를 그리지 않으니 정답인 a 값이 그림에 쓰이지 않는다(끝점의 자리는 그 값으로 그려진다). 노트의 값이 분수(n=1/2)이면 작은 분수로 한 줄에 쓴다. ② 점 이름은 한글 낱말(2~5자, `"name":"뉴욕"`)도 되고 점 위에 글자로 쓴다(`NUMBER_LINE_POINT_NAME_INVALID`). 이웃한 두 점의 이름이 겹치면 `NUMBER_LINE_LABELS_TOO_CLOSE`이니 한쪽은 `hideName`을 쓴다. 점에 `"valueSide":"ABOVE"`를 쓰면 값이 점 위(이름 위)에 쓰인다(기본은 아래, `NUMBER_LINE_VALUE_SIDE_INVALID`). ③ 점 줄에 `"spans":[{"from":"A","to":"C","label":"시차","style":"BRACE"}]`(최대 3개)를 쓰면 두 점 사이를 괄호(`BRACE`, 기본, 값 라벨 아래)·화살표(`ARROW`, from에서 to로, 이름 위)·양쪽 화살표(`DOUBLE_ARROW`)로 보이고, `label`(한글 9자 이하 또는 짧은 식)이 바깥쪽에 선다. `side`는 `"ABOVE"`/`"BELOW"`. 엔진은 label을 계산하지 않으니 거리·차가 문제의 정답이면 값 대신 "시차" 같은 낱말을 쓴다. 코드: `NUMBER_LINE_SPANS_INVALID`/`NUMBER_LINE_SPAN_POINT_UNKNOWN`/`NUMBER_LINE_SPAN_LABEL_INVALID`/`NUMBER_LINE_SPAN_TOO_SHORT`(두 점이 너무 가까움). 관측기는 plan의 두 점 값에서 괄호 모양·화살촉·라벨의 자리를 다시 계산해 대조한다(`NL_SPAN_*`, `NL_NOTE_HIDDEN_BUT_DRAWN`, `NL_SET_LABEL_COUNT`).
- 입체도형(각기둥·각뿔·각뿔대·원기둥·원뿔·원뿔대·구·반구)을 숨은 모서리 점선·꼭짓점 이름·길이와 함께, 또는 각기둥·각뿔·원기둥·원뿔의 전개도, 회전축을 지나는 단면, 원뿔 모양 그릇의 수면: `solid-figure-v1`(아래 3-입체). 치수를 실제 길이로 쓰면 엔진이 3차원 모델에서 투영·숨은선·전개를 계산한다.
- 통계·확률 그림(도수분포 히스토그램·도수분포다각형·상대도수 그래프, 줄기와 잎 그림, 상자그림, 산점도, 두 주사위의 6×6 표, 확률 수형도): `stat-chart-figure-v1`. 자료의 값만 정확히 주면 눈금, 막대 높이, 다각형 꼭짓점, 사분위수, 표의 칸 색칠, 경로 확률은 엔진이 계산한다. 자세한 쓰는 법은 아래 3-11절.
- 집합 벤다이어그램(1~3개 집합의 원소 배치, 합집합·교집합·차집합·여집합 영역 색칠, B⊂A 포함관계)과 유한집합 대응도(X→Y, 합성 X→Y→Z, 함수와 역방향 화살표 한 그림): `set-diagram-figure-v1`. 원소가 어느 집합에 속하는지와 색칠할 집합식만 정확히 주면 원자 영역, 색칠 기하, 원소 위치는 엔진이 계산한다. 자세한 쓰는 법은 아래 3-12절.

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

### 3-2. 함수 그래프 한 개: 삼차·사차·유리·무리·절댓값·조각·지수·로그·삼각함수

풀이의 결정적 관계가 **곡선 한 개**(보조선·직선·둘째 곡선 없음)로 설명될 때 쓴다. 지수·로그의 역함수 관계처럼 두 곡선과 `y=x`가 함께 결정적이면 아래의 `exp-log-pair-spike-v1`을 쓴다. 모두 `{"capability":"<이름>","graphPlan":{"family":...,...},"caption":"한국어 한 문장"}` 모양이고, `graphPlan.domain`(그릴 x 범위)과 `graphPlan.viewport`([xmin,xmax,ymin,ymax])를 직접 준다. 계수는 정확한 정수·분수 문자열이다. 곡선의 특징점(극값, 점근선, 구멍, 꺾이는 점, 경계)은 엔진이 계수에서 계산해 표시하고 독립 관측기가 최종 SVG와 대조하니, 좌표를 따로 쓰지 않는다. 문항이 요구하는 점은 `requiredPoints`에 쓴다.

| 곡선 | capability / family | 계수와 정의역 |
|---|---|---|
| 삼차·사차 다항 | `polynomial-spike-v1` / `polynomial` | `coefficients`는 오름차순 3차·4차 계수, `sourceDomain:{"kind":"ALL_REALS"}`. 중근(접점)도 지원하고 근의 중복도는 엔진·관측기가 계수에서 다시 계산한다 |
| 유리 (일차/일차, 반비례) | `rational-spike-v1` / `rational` | `numerator`, `denominator` 각각 [상수항, x계수], `sourceDomain` ALL_REALS. 점근선·구멍은 엔진이 표시. 분자를 `["k","0"]`(k≠0 상수)으로 주면 반비례 `y=k/(d0+d1x)`(아래 3-2 반비례 문단) |
| 무리 √(일차), 일반형 y=s·k√(a(x−p))+q | `sqrt-affine-spike-v1` / `sqrt-affine` | `radicand` [상수항, x계수(0 불가, 음수면 왼쪽으로 열림)], 선택 `amplitude`(k>0, 기본 1)·`sign`(1 또는 −1)·`offset`(q, 기본 0), `sourceDomain:{"kind":"NATURAL_SQRT_AFFINE"}` 또는 `{"kind":"CLOSED_INTERVAL","range":[a,b]}` |
| 절댓값 k·\|ax+b\|+c | `absolute-value-spike-v1` / `absolute-value` | `coefficients` [b,a,k,c], ALL_REALS |
| 두 조각 일차 (구간 닫힘) | `piecewise-affine-spike-v1` / `piecewise-affine` | `sourceDomain:{"kind":"CLOSED_INTERVAL","range":[lo,hi]}`, `piecewise:{breakX,owner:"LEFT"\|"RIGHT",left:[b,m],right:[b,m]}` |
| 지수 A·e^(kx)+C (자연밑) | `exponential-affine-spike-v1` / `exponential-affine` | `coefficients` [A,k,C], ALL_REALS |
| 지수 A·a^(k(x−p))+C (정수·분수·근호 밑) | `exponential-affine-spike-v1` / `exponential-affine` | `coefficients` [A,k,C], `base`(예: "2", "1/2", "sqrt(3)"), 선택 `shiftX`(p), ALL_REALS |
| 로그 A·ln(kx+b)+C (자연밑) | `logarithmic-affine-spike-v1` / `logarithmic-affine` | `coefficients` [A,k,b,C], `sourceDomain:{"kind":"NATURAL_LOG_AFFINE"}` |
| 로그 A·log_a(kx+b)+C (정수·분수·근호 밑) | `logarithmic-affine-spike-v1` / `logarithmic-affine` | `coefficients` [A,k,b,C], `base`, `sourceDomain:{"kind":"NATURAL_LOG_AFFINE"}` |
| 지수+로그 두 곡선 (역함수, y=x) | `exp-log-pair-spike-v1` / `exp-log-pair` | `curves`(정확히 2개: `id`, `family`, `base`, `coefficients`, `sourceDomain`, 선택 `shiftX`), `identityLine:true\|false` |
| 사인·코사인·탄젠트 | `trigonometric-spike-v1` / `trigonometric` | `function:"SIN"\|"COS"\|"TAN"`, `coefficients` [A,k,C], `phasePi`(π의 유리수 배), 정의역 ALL_REALS (TAN은 `ALL_REALS_WITH_TAN_POLES`) |
| 삼각함수 일반형 (π 계수·평행이동·여러 주기) | `trigonometric-spike-v1` / `trigonometric` | `ratePi`(k=mπ, `coefficients` [A,C]) 또는 `coefficients` [A,k,C], `phasePi`/`phase`, `sourceDomain:{"kind":"INTERVAL","range":[lo,hi]}` 또는 `INTERVAL_PI`, 선택 `keyPoints`, `axisTickPi` (아래 3-13절) |

가장 작은 예: `{"capability":"exponential-affine-spike-v1","graphPlan":{"family":"exponential-affine","coefficients":["1","1","0"],"sourceDomain":{"kind":"ALL_REALS"},"domain":[-2,2],"viewport":[-3,3,-2,12]},"caption":"지수함수의 증가와 점근선"}`
밑이 있는 예: `{"capability":"exponential-affine-spike-v1","graphPlan":{"family":"exponential-affine","base":"2","shiftX":"1","coefficients":["1","1","3"],"sourceDomain":{"kind":"ALL_REALS"},"domain":[-2,2],"viewport":[-3,3,-2,12]},"caption":"y=2^(x-1)+3의 그래프"}` (기준점 (1,4), 점근선 y=3)
로그 예: `{"capability":"logarithmic-affine-spike-v1","graphPlan":{"family":"logarithmic-affine","base":"3","coefficients":["2","1","0","0"],"sourceDomain":{"kind":"NATURAL_LOG_AFFINE"},"domain":[0.1,4],"viewport":[-1,5,-5,5]},"caption":"y=2log_3 x의 그래프"}`
역함수 두 곡선 예: `{"capability":"exp-log-pair-spike-v1","graphPlan":{"family":"exp-log-pair","curves":[{"id":"f","family":"logarithmic-affine","base":"3","coefficients":["2","1","0","0"],"sourceDomain":{"kind":"NATURAL_LOG_AFFINE"}},{"id":"g","family":"exponential-affine","base":"sqrt(3)","coefficients":["1","1","0"],"sourceDomain":{"kind":"ALL_REALS"}}],"identityLine":true},"caption":"y=2log_3 x와 그 역함수 y=(√3)^x는 직선 y=x에 대하여 대칭이다."}`

**반비례 y=k/x (분자가 0이 아닌 상수).** `numerator:["k","0"]`, `denominator:["d0","d1"]`(d1≠0)이면 직각쌍곡선 `y=k/(d0+d1x)`의 **두 가지**를 모두 그린다(`sourceDomain` ALL_REALS, 수직 점근선 x=-d0/d1). 수평 점근선 y=0은 x축이고 `y=k/x`의 수직 점근선 x=0은 y축이므로, **축과 겹치는 점근선에는 점선을 따로 긋지 않는다.** 축 밖의 수직 점근선(`k/(x-2)`의 x=2)만 점선과 `x=2` 라벨로 보인다. 그림은 가로·세로 같은 눈금(한 배율)으로 극 둘레에 두 가지가 다 보이게 창을 잡는다(극이 원점에서 너무 멀어 한 배율에 못 담으면 `EQUAL_UNIT_CURVE_TOO_NARROW`). `requiredPoints`는 점과 좌표 라벨로 그려지고(`exactCoordinates`로 정확한 글자), `formulaLabel`("y=b/x"처럼 40자 이내 식. 형식이 틀리면 `RATIONAL_FORMULA_LABEL_INVALID`, 분자가 상수가 아닌 유리함수에 쓰면 `RATIONAL_FORMULA_LABEL_REQUIRES_CONSTANT_NUMERATOR`)은 비례상수가 기호 b일 때 식 라벨을 대신한다. 분자 0은 `UNSUPPORTED_RATIONAL_NUMERATOR_ZERO`이다. 독립 관측기가 극·가지의 방향·점근선의 표시/비표시(축과 겹치면 없어야 함)·필수점을 계수에서 다시 계산해 최종 SVG와 대조한다.
예(반비례 그래프 위의 점 P와 직사각형 OAPB, 넓이 b): `{"capability":"rational-spike-v1","graphPlan":{"family":"rational","numerator":["6","0"],"denominator":["0","1"],"sourceDomain":{"kind":"ALL_REALS"},"domain":[-10,10],"viewport":[-10,10,-10,10],"axisTickValues":{"x":[],"y":[]},"formulaLabel":"y=b/x","overlays":{"points":[{"id":"P","curveX":"3"},{"id":"A","axis":"x","value":"3"},{"id":"B","axis":"y","value":"2"},{"id":"O","x":"0","y":"0"}],"polygons":[{"id":"R","points":["O","A","P","B"],"label":"b"}]}},"pointNames":{"P":"P","A":"A","B":"B","O":"O"},"caption":"반비례 그래프 위의 점 P에서 두 축에 내린 수선의 발 A, B로 만든 직사각형 OAPB의 넓이는 b이다."}` (`domain`·`viewport`는 오버레이 점이 들어갈 만큼 넓게 선언하면 엔진이 창을 다시 잡는다.)

**정비례 y=ax.** `piecewise-polynomial-spike-v1`의 한 조각 `pieces:[{"coefficients":["0","a"]}]`(`sourceDomain` ALL_REALS)로 그린다. **원점 `{"id":"O","x":0,"y":0}`를 `requiredPoints`에 꼭 넣는다**(없으면 원점을 지나지 않는 짧은 선분으로 잡힌다). 정비례와 반비례를 한 그림에 겹쳐 그리는 것은 지원하지 않는다(UNSUPPORTED).

**무리함수 일반형** `y=q+s·k√(a(x−p))`: `radicand:[c,a]`의 시작점은 `p=-c/a`, `q=offset`이고 닫힌 점으로 표시된다. `amplitude`(k>0, 기본 1)·`sign`(s=1 또는 −1)·`offset`(q, 기본 0)을 쓰면 `y=q+s·k√(c+a x)`를 그대로 그린다(a>0이면 `x≥p`에서 오른쪽으로, a<0이면 `x≤p`에서 왼쪽으로 열리고, s·k>0이면 위로, s·k<0이면 아래로 뻗는다). 계수는 정확한 정수·분수 또는 `p+q*sqrt(r)`이고 한 plan에 근호 하나만 쓴다(3-4와 같은 표기). `sourceDomain`이 `NATURAL_SQRT_AFFINE`이면 그린 구간이 경계에서 시작/끝나고, `CLOSED_INTERVAL`이면 `domain`이 그 구간과 같아야 하며 양 끝이 모두 닫힌 점으로 그려진다. 문항이 요구하는 점은 `requiredPoints:[{"id":"A","x":-3,"y":7}]`(곡선 위여야 한다)로 넣고, 정확한 좌표를 띠에 쓰려면 `exactCoordinates:{"A":["-3","7"]}`를 함께 쓴다. 정의역·치역을 그림에 쓰려면 `domainRangeLabels:true`다(예: `x<=2`, `y>=1`). 예: `{"capability":"sqrt-affine-spike-v1","graphPlan":{"family":"sqrt-affine","radicand":["1","-1"],"sign":-1,"offset":"-3","sourceDomain":{"kind":"NATURAL_SQRT_AFFINE"},"domain":[-8,1],"viewport":[-8,2,-7,-2],"domainRangeLabels":true},"caption":"y=-√(1-x)-3의 그래프는 끝점 (1,-3)에서 왼쪽 위로 뻗는다."}`
- 일반형 오류 코드: `SQRT_AMPLITUDE_MUST_BE_POSITIVE`/`INVALID_SQRT_SIGN`(k≤0, s가 ±1이 아님), `INVALID_SQRT_AFFINE_COEFFICIENT`/`UNSUPPORTED_SQRT_AFFINE_SLOPE`(계수 형식, x계수 0), `REQUIRED_SQRT_POINT_NOT_ON_CURVE`/`REQUIRED_SQRT_POINT_OUTSIDE_SOURCE_INTERVAL`(필수점이 곡선 밖·구간 밖), `SQRT_SOURCE_INTERVAL_BELOW_NATURAL_BOUNDARY`/`SQRT_SOURCE_INTERVAL_BEYOND_NATURAL_BOUNDARY`(닫힌 구간이 자연 정의역 밖), `SQRT_DRAW_INTERVAL_MUST_PRESERVE_SOURCE_INTERVAL`/`SQRT_DRAW_INTERVAL_MUST_PRESERVE_ENDPOINT`(그린 구간이 sourceDomain과 다름), `EXACT_COORDINATES_MISMATCH:<id>`(정확한 좌표가 숫자 좌표와 다름), `SQRT_AFFINE_IRRATIONAL_FORM_UNSUPPORTED`(중첩근호·두 근호), `SQRT_ENDPOINT_TO_TAIL_SPAN_BELOW_PROFILE_FLOOR`(UNSUPPORTED: 끝점에서 꼬리까지가 화면에서 48 CSS px보다 짧다. domain/viewport를 넓힌다). 독립 관측기가 시작점·열린 쪽·단조 방향·치역 방향·필수점·끝점 마커를 plan의 정확값에서 다시 계산해 최종 SVG와 대조한다.

한계(가짜 지원 없이 오류 코드로 거절된다):
- 삼차·사차의 **중근**: 계수를 주면 근의 중복도를 SymPy로 정확히 계산해, 짝수 중복(2·4중근)은 x축에 접하고 홀수 중복(3중근)은 x축을 뚫으며 평평하게 지난다. 독립 관측기가 최종 SVG에서 근 위의 점, 접하는 쪽(짝수) 또는 부호가 바뀌는지(홀수), 3중근의 평평한 구간을 다시 확인한다. 근이 1 CSS px보다 가까우면 `OVERVIEW_ROOTS_BELOW_DISPLAY_RESOLUTION`/`OVERVIEW_FEATURES_BELOW_DISPLAY_RESOLUTION`(UNSUPPORTED)이다. 근의 위치를 고정할 수 없을 만큼 넓은 중근은 `UNSUPPORTED_CUBIC_QUARTIC_REPEATED_ROOT_IMPRECISE`다(3·4차 중근은 유리수 또는 p+q√r이라 실제로는 거의 없다). 식은 x^3-3/4*x-1/4처럼 분수를 세로로 쌓아 쓰고, 분수 둘레에 괄호를 남기지 않는다.
- 지수·로그는 **밑을 생략하면 자연밑 e**이고, `base`로 양의 정수("2", "3"), 양의 분수("1/2", "3/2"), `sqrt(n)`(n은 1보다 큰 제곱인수가 없는 정수, 예: "sqrt(2)", "sqrt(3)")을 쓸 수 있다. 엔진과 관측기는 `base`와 유리수 계수에서 곡선·기준점·점근선·정의역 경계를 각각 SymPy로 다시 계산한다. `base`가 문자 a이거나 0 이하·1이면 `*_BASE_GRAMMAR_REQUIRED`/`*_BASE_OUT_OF_RANGE`, 중첩근호·제곱수 근호(`sqrt(2+sqrt(3))`, `sqrt(4)`, `sqrt(8)`)는 `*_BASE_RADICAL_NOT_SQUARE_FREE`로 거절한다. 소수 밑도 안 된다. 지수 `shiftX`는 정확한 정수·분수 문자열만 된다.
- 두 곡선은 `exp-log-pair-spike-v1`에서만 되고 **정확히 두 개**다. 각 곡선의 `sourceDomain`은 계열 규칙을 그대로 따르고, 두 곡선의 표시 구간이 겹치지 않거나 폭이 16을 넘으면 `EXP_LOG_PAIR_NO_SHARED_WINDOW`/`EXP_LOG_PAIR_WINDOW_TOO_WIDE`다. `identityLine:true`는 점선 `y=x`를 함께 그린다. 교점의 정확한 좌표 표시, 곡선 위의 임의 점·삼각형·색칠 영역은 이 계열에서 지원하지 않는다.
- 삼각함수는 기본 문법에서 정의역 전체의 **한 주기**(SIN·COS) 또는 **인접한 두 극 사이 한 가지**(TAN)만 그리고, k는 유리수다(`sin πx`처럼 k에 π가 들면 안 된다. `phasePi`만 π의 배수를 받는다). 구간을 제한한 그래프와 직선·수평선과의 교점 개수(사인·코사인만)는 아래 3-7절, π 계수·평행이동·여러 주기·탄젠트 점근선은 3-13절, 합성·거듭제곱, 두 함수의 비교는 안 된다.
- 곡선은 한 개다(위 표의 계열 기준. 이어진 조각 그래프와 직선은 3-3). 직선(`y=-1/2`, `y=x+k`; 단 사인·코사인과 직선은 3-7절), 수직선, 둘째 곡선(이차함수 둘은 3-6), 색칠 영역, 보조선은 같이 그릴 수 없다. 교점의 개수를 보이는 풀이면 이 그림이 풀이의 전부를 보여 주지 못하니 UNSUPPORTED로 쓴다. 곡선의 모양만 풀이가 쓸 때(점근선, 정의역 경계, 주기·극값, 꺾이는 점)에 쓴다.
- 유리함수는 분자·분모 모두 일차(분자만 0이 아닌 상수여도 된다: 반비례), 절댓값은 `|일차식|` 하나, 조각은 두 조각이고 꺾임점이 구간 안쪽이다. `|x²-2x|` 같은 이차식의 절댓값은 `piecewise-polynomial-spike-v1`을 쓴다.
- 눈금: 기본 눈금은 x=1, y=1 두 곳이다. 곡선이 그 눈금 숫자 자리를 실제로 지나가면(코사인의 최댓값 y=1, 로그의 기준점 x=1) 숫자가 곡선에 겹쳐 `LAYOUT_INVENTORY_INCOMPLETE`(`unresolved: tick-y-1-label` 등)로 거절된다. 엔진이 숫자를 곡선 위에 얹지 않는 것이 맞으니, 이때는 plan에 `axisTickValues:{"x":[],"y":[]}`(또는 겹치지 않는 값만)를 쓴다. 최댓값·기준점 같은 특징점의 값은 엔진이 따로 표시한다.

이 계열의 오류 코드: `<FAMILY>_SOURCE_DOMAIN_REQUIRES_*`/`_SOURCE_DOMAIN_UNSUPPORTED`(정의역 형식이 위 표와 다르다. 표대로 고친다), `<FAMILY>_SOURCE_SCHEMA_INVALID`/`*_GRAMMAR_REQUIRED`(계수 개수·형식이 다르다), `*_NONZERO_*_REQUIRED`/`*_POSITIVE_SLOPE_REQUIRED`(0인 계수나 음의 기울기 반지름식), `*_OUTSIDE_OVERVIEW`/`*_OUTSIDE_VIEWPORT`(점근선·경계·꺾임점이 viewport 밖. viewport나 domain을 넓힌다), `*_BELOW_PROFILE_FLOOR`/`*_BELOW_DISPLAY_RESOLUTION`(특징이 너무 작아 학생 화면에서 구분되지 않는다. 범위를 좁히거나 UNSUPPORTED), `*_OVERVIEW_POLICY_REQUIRED`/`*_FEATURE_INVENTORY_MISMATCH`(plan 형식이 계약과 다르다. 계약 전문을 다시 읽는다), `*_BASE_GRAMMAR_REQUIRED`/`*_BASE_OUT_OF_RANGE`/`*_BASE_RADICAL_NOT_SQUARE_FREE`(밑 형식·범위·근호), `EXP_LOG_PAIR_PLAN_INVALID`/`EXP_LOG_PAIR_NO_SHARED_WINDOW`/`EXP_LOG_PAIR_WINDOW_TOO_WIDE`(두 곡선 plan·공통 창), `UNSUPPORTED_CAPABILITY`(위 한계를 벗어난 plan이다).

### 3-3. 이어진 조각 그래프(이차식 조각 최대 4개)와 직선

`|x²-4x-12|`, `x²-2|x|+1`, 이차함수 두 개를 구간별로 이은 `h(x)`처럼 **끊어지지 않는** 한 함수에 수평선 또는 **기울어진 직선**을 겹쳐 교점을 보이는 풀이에 쓴다. `capability:"piecewise-polynomial-spike-v1"`, `graphPlan.family:"piecewise-polynomial"`.

```json
{"capability":"piecewise-polynomial-spike-v1","graphPlan":{"family":"piecewise-polynomial",
 "pieces":[{"coefficients":["-12","-4","1"]},{"coefficients":["12","4","-1"]},{"coefficients":["-12","-4","1"]}],
 "breakpoints":[{"x":"-2","y":"0"},{"x":"6","y":"0"}],"sourceDomain":{"kind":"ALL_REALS"},"formula":"abs(x^2-4x-12)",
 "referenceLines":[{"id":"k","slope":"3","intercept":"10","intersectionX":["(7-sqrt(137))/2","-1","2","(7+sqrt(137))/2"]}],
 "requiredPoints":[{"id":"A","x":-2,"y":0},{"id":"B","x":6,"y":0},{"id":"C","x":2,"y":16},{"id":"D","x":-1,"y":7}],"axisTickValues":{"x":[],"y":[]}},
 "coordinatePlacement":"PANEL","caption":"k=10일 때 직선 y=3x+10과 그래프가 네 점에서 만난다."}
```

- `pieces`는 왼쪽부터 1~4개, 계수는 `[상수, x, x²]`(정수·분수 문자열). `breakpoints`는 조각 수보다 하나 적게, 이어지는 점의 `x`, `y`(두 조각이 모두 그 값을 주어야 한다). 끊김은 `PIECEWISE_POLY_DISCONTINUOUS`.
- `requiredPoints`에는 모든 꺾임점과 조각 안쪽 꼭짓점을 넣는다(엔진이 따로 계산해 빠지면 거절).
- **수평선**: `{"id","y","intersectionX"}`. **기울어진 직선**: `{"id","slope","intercept","intersectionX"}`로 `y=slope·x+intercept`. `slope`는 0이 아닌 정수·분수 문자열, `intercept`는 정수·분수 문자열이다. 둘을 섞어 쓰지 않는다. 최대 3개.
- `intersectionX`에는 직선과 **곡선 전체**의 교점의 x를 하나도 빠짐없이 쓴다. 정수·분수·`sqrt(...)`가 들어간 정확한 값(`(3+sqrt(34)/2)/2`)이고, 엔진과 독립 관측기가 각각 SymPy로 다시 풀어 개수와 값이 다르면 `PIECEWISE_POLY_INTERSECTION_MISMATCH:<id>:engine finds N intersection(s)`로 거절한다. 중근(접점)은 한 번 센다.
- 직선에 문자가 들어 있으면(`y=mx+12`, `y=x+k`, `y=p(x-3)+3`) **표본값 하나**로 그린다. 풀이가 쓰는 답의 범위 안쪽 값이나 풀이가 따로 다루는 경계 값(직선이 꺾임점을 지나는 경우 등)을 고르고, 그 값을 caption에 쓴다("m=11/3일 때 직선 y=11/3x+12가 ..."). 값 없이 문자만 있는 직선은 그릴 수 없다. 여러 값을 비교하는 풀이는 대표 하나만 그리거나 UNSUPPORTED.
- 교점이 `requiredPoints`의 점과 같으면(꺾임점 위, 꼭짓점 위, 또는 점을 일부러 `requiredPoints`에 넣은 경우) 그 점 하나로만 그려진다. **기울어진 직선의 교점에 좌표를 쓰고 싶으면 `labelIntersections`가 아니라 그 교점을 `requiredPoints`(id, x, y와 `exactCoordinates`)에 넣는다.** 좌표가 정수·분수인 교점에는 `exactCoordinates`로, 무리수 좌표의 교점에는 3-4처럼 `requiredPoints`의 정확한 문자열 좌표로 쓴다. `requiredPoints`에 넣지 않은 무리수 교점은 점만 찍힌다.
- 직선 식은 띠에 `y=ax+b`로 세로분수와 함께 써지고, 교점마다 직선 위에 점이 찍힌다. 직선은 그림 영역 안에서 잘려서 그려지며 모든 교점을 지난다.
- 그림은 가로·세로 같은 배율이 기본이다. 직선이 가파르거나 값이 크면 엔진이 세로를 최대 1/2까지 줄이는 대체(`AXIS_SQUEEZE`)로 다시 시도한다. 그래도 안 되면 `PIECEWISE_POLY_CURVE_TOO_NARROW`.

한계와 오류 코드(가짜 지원 없이 거절):
- `PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO`: 기울기 0은 수평선이다. `{"id","y",...}`로 쓴다.
- `PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID`: 기울기·절편은 정수·분수 또는 `p+q*sqrt(r)` 문자열만 된다(소수, 문자, 식 불가). 무리수 계수의 쓰는 법과 한계는 3-4.
- `PIECEWISE_POLY_SLANTED_LINE_LABELS_UNSUPPORTED`: 기울어진 직선에는 `labelIntersections`를 쓸 수 없다(위 `requiredPoints` 방법).
- `PIECEWISE_POLY_REFERENCE_LINE_INVALID`: `y`와 `slope/intercept` 중 하나만, 필드 이름이 맞는지 확인한다.
- `PIECEWISE_POLY_REFERENCE_LINE_CONTAINS_A_PIECE`: 직선이 조각 하나와 완전히 겹친다(교점이 무한개). 그릴 수 없다.
- 수직선, 조각 5개 이상(`PIECEWISE_POLY_PIECE_COUNT_INVALID`), 삼차 이상 조각, 끊어지는 함수는 지원하지 않는다. UNSUPPORTED. 둘째 함수(f와 g, g도 구간별)가 필요하면 3-6절의 `referenceCurves`를 쓴다.

### 3-4. 무리수 계수: `p+q√r` (접하는 조건의 매개변수, 무리수 기울기·절편·교점)

접하는 조건의 매개변수 `k=-3±2√3`, `m=3-√7`, `a=2-√2`처럼 풀이가 구한 **계수가 무리수**인 포물선·직선을 그릴 때 쓴다. 곡선은 `piecewise-polynomial-spike-v1`의 **조각 한 개**(`pieces`에 한 줄, `breakpoints` 없음)로 쓴다. `polynomial-spike-v1`(이차함수)의 계수는 정수·분수만 되고, 같은 그림에 직선을 얹어 접점·교점을 보이는 것도 이쪽이 한다.

- **쓰는 곳:** `pieces[].coefficients`, `breakpoints`, `referenceLines`의 `y`·`slope`·`intercept`, `requiredPoints`의 `x`·`y`. 형식은 정확한 문자열 `p+q*sqrt(r)`이다(p, q는 정수·분수, r은 양의 정수): `"-3+2*sqrt(3)"`, `"3/2-sqrt(3)"`, `"(1+sqrt(2))/2"`, `"sqrt(7)/2"`. 엔진은 SymPy로 정확히 계산하고(`p+q√r`의 사칙연산은 닫혀 있다) 소수는 배치에만 쓴다.
- **한 plan에는 근호 하나만:** 계수·좌표에 나오는 무리수는 모두 같은 `sqrt(r)`이어야 한다. 한 곡선에 `sqrt(2)`와 `sqrt(3)`이 같이 있으면 거절된다.
- **무리수 점 좌표는 정확한 문자열로:** `{"id":"V","x":"3/2-sqrt(3)","y":"-1/4+3*sqrt(3)"}`처럼 쓰면 엔진이 곡선 위의 점인지 정확히 확인하고, 그림에는 정확한 좌표(분수와 √이 제대로 나온 `V(3/2-√3, -1/4+3√3)`)가 띠에 쓰이며, 소수는 점 위치에만 쓰인다. 소수로 풀어 쓴 좌표(`-0.2320508`)도 받지만(오차 1e-8) 정확한 문자열을 권한다. 포물선의 꼭짓점, 접점, 꺾임점은 이전처럼 `requiredPoints`에 모두 넣는다.
- **접점·교점:** `referenceLines`의 `intersectionX`에는 곡선과 직선의 교점 x를 하나도 빠짐없이 쓴다. 접하면 중근 하나(`["-sqrt(3)"]`). 교점의 x가 중첩 근호(`(10-2*sqrt(7)-sqrt(216-72*sqrt(7)))/4-2`)여도 되며 엔진과 독립 관측기가 각각 다시 계산해 맞춘다. 접점이 `requiredPoints`의 점과 같으면 그 점 하나로만 그려진다(예: 꼭짓점에서 접하는 수평선).
- **라벨:** 직선 식은 띠에 `y=(6-2√7)x+(23-8√7)`처럼 쓰이고, 수평선은 `y=-11+4√7`이다. 점 좌표는 `coordinatePlacement:"PANEL"`로 띠에 쓰는 것을 권한다.
- **두 값(`k=-3±2√3`)을 비교하는 풀이:** `composite-panels-v1`의 **그래프 패널**은 `polynomial-spike-v1`만 받으므로 무리수 계수를 못 넣는다. 대표 값 하나를 그림 한 개로 그리고 caption에 값을 쓴다(둘 다 필요하면 plan 두 개). 평면도형 패널은 이 제한과 무관하다(3-16).
- **구간이 있는 이차함수(`0≤x≤2`에서 최대·최소):** `sourceDomain:{"kind":"INTERVAL","range":[0,2]}`와 함께 쓴다. 끝점의 함수값이 무리수여도 점이 찍힌다. 최대·최소를 보이려면 `referenceLines`에 수평선 `y=M`, `y=m`을 넣는다.

가장 작은 예(`y=x²+kx+5`가 `y=-3x+2`에 접하는 `k=-3+2√3`):

```json
{"capability":"piecewise-polynomial-spike-v1","graphPlan":{"family":"piecewise-polynomial",
 "pieces":[{"coefficients":["5","-3+2*sqrt(3)","1"]}],"sourceDomain":{"kind":"ALL_REALS"},
 "referenceLines":[{"id":"l","slope":"-3","intercept":"2","intersectionX":["-sqrt(3)"]}],
 "requiredPoints":[{"id":"V","x":"3/2-sqrt(3)","y":"-1/4+3*sqrt(3)"},{"id":"T","x":"-sqrt(3)","y":"2+3*sqrt(3)"}],
 "axisTickValues":{"x":[],"y":[]}},"coordinatePlacement":"PANEL",
 "caption":"k=-3+2√3일 때 포물선이 직선 y=-3x+2에 점 T에서 접한다."}
```

한계와 오류 코드(가짜 지원 없이 거절):
- `PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED`: `p+q√r` 모양이 아니다. 중첩 근호(`sqrt(2+sqrt(3))`), 한 계수 안의 두 근호(`sqrt(2)+sqrt(3)`), 세제곱근 등. 값을 한 근호로 정리할 수 있는지 먼저 본다. 안 되면 UNSUPPORTED.
- `PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED:2,3`: plan 전체에 서로 다른 근호가 있다. 한 근호로 맞추거나 그 경우는 UNSUPPORTED.
- `PIECEWISE_POLY_COEFFICIENT_INVALID` / `PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID` / `PIECEWISE_POLY_BREAKPOINT_INVALID`: 소수(`1.73`)나 문자·식이다. 정확한 문자열로 바꾼다.
- `PIECEWISE_POLY_FORMULA_IRRATIONAL_UNSUPPORTED`: 무리수 조각에는 머리줄 `formula`를 쓸 수 없다. `formula`를 빼고 caption에 값을 쓴다.
- `PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:<id>`: 점의 좌표가 곡선 위에 정확히 있지 않다(계산 실수). 정확한 값을 다시 구한다.
- 문자 계수(`a`가 값 없이 주어짐), `a`에 따라 모양이 달라지는 전체 답, 곡선 둘(`f`와 `g`)은 이 계열로도 못 그린다. UNSUPPORTED.

### 3-5. 응용 문제의 축: 개수와 금액처럼 단위가 다른 두 축

이익금(0~45000원)과 판매 횟수(0~50)처럼 **가로축과 세로축이 서로 다른 양**을 재는 문장제 그래프는 같은 배율로 그리면 곡선이 선처럼 된다. 이때만 `polynomial-spike-v1`의 이차함수에 `graphPlan.applicationAxes:true`를 쓴다. 순수 수학 그래프(`y=x²-2x` 같은 것)에는 쓰지 않는다. 그런 그래프는 같은 배율이 원칙이다(5절).

- 조건: 이차함수이고 `sourceDomain:{"kind":"INTERVAL","range":[lo,hi]}`(문장제의 변수 범위)가 있다. 그 밖(ALL_REALS, 삼차, 다른 계열)에서는 `APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL`로 거절된다. `axisSqueeze`, `plotCanvas`는 같이 못 쓴다(`INVALID_APPLICATION_AXES`).
- 축마다 배율이 따로다. 그림은 가로 448, 세로 360으로 고정된다. `domain`은 구간과 같게, `viewport`는 구간과 핵심 점을 포함하게 대략 쓰면 엔진이 다시 짠다.
- **눈금은 작성자가 실제 값으로 쓴다**: `axisTickValues:{"x":[2,4,6,8,10],"y":[10000,20000,30000]}`. 축마다 2~8개, 0이 아닌 값, 등차수열이고 간격이 1, 2, 5에 10의 거듭제곱을 곱한 값이며 모든 값이 그 간격의 배수여야 한다(`APPLICATION_AXES_TICKS_INVALID:x`/`:y`). 곡선이나 핵심 점의 라벨과 겹치면 `LAYOUT_INVENTORY_INCOMPLETE`(`tick-y-4-label`처럼)이니 그 값을 빼거나 간격을 바꾼다. 최댓값 같은 핵심 점의 값은 `requiredPoints`와 좌표 띠가 쓴다.
- 가로축 문자는 `axisVariable`(`n`, `P`처럼 y가 아닌 한 글자, 대소문자 모두)로 쓴다. 세로축은 y로 남으니 caption에 "y는 이익금(원)"처럼 밝힌다.
- 핵심 점은 곡선 위의 점(`requiredPoints`)이고 직선(`lines`)을 더할 수 있다. 영역 색칠은 못 한다. 부등식 `S≤(P/4)²`의 경계 곡선과 그 위 점들처럼 경계만 보인다.
- **구간별 다항(`piecewise-polynomial-spike-v1`)의 축별 배율 `graphPlan.axisScale:{"x":1,"y":12}`**: 시간(분)과 거리(km)처럼 두 축이 다른 양인데 같은 배율로 그리면 그래프가 납작해질 때, 한 단위의 그려지는 길이의 **비**를 작성자가 정한다(위는 y 한 단위를 x 한 단위의 12배 길이로). 값은 양의 정수·소수·분수 문자열(`"1/2"`, `"2.5"`)이고 비는 1:64~64:1이다. 가로는 448 px에 맞고 세로 높이는 비에 따라 정해진다. `axisScale`을 쓰면 엔진은 자동 세로 압축(`axisSqueeze`)을 하지 않으니 같이 쓰지 않는다. 눈금은 `axisTickValues`로 실제 값을 쓰고(`{"x":["20","60"],"y":["2"]}`), 축 이름은 `axisTitles`(`{"x":"x(분)","y":"y(km)"}`)로 쓴다. 이차·삼차 등 다른 계열에서는 `AXIS_SCALE_UNSUPPORTED_FAMILY`, 형식이 틀리면 `INVALID_AXIS_SCALE`, 비가 범위 밖이면 `AXIS_SCALE_RATIO_OUT_OF_RANGE`, `axisSqueeze`와 같이 쓰면 `AXIS_SCALE_WITH_SQUEEZE`다. 독립 관측기는 `axisScale`에서 y/x를 스스로 다시 계산해, plan의 `axisRatio`가 그 값과 같은지(`AXIS_SCALE_RATIO_MISMATCH`)와 최종 SVG에서 읽은 가로·세로 눈금 길이의 비가 그 값인지(`EQUAL_UNIT_SCALE_MISMATCH`)를 확인한다. 값이 틀리면 `AXIS_SCALE_INVALID`다.

```json
{"capability":"polynomial-spike-v1","graphPlan":{"family":"polynomial","coefficients":["36000","2400","-600"],"domain":[0,10],"viewport":[0,10,0,40000],
 "sourceDomain":{"kind":"INTERVAL","range":[0,10]},"requiredPoints":[{"id":"V","x":2,"y":38400}],
 "applicationAxes":true,"axisVariable":"n","axisTickValues":{"x":[2,4,6,8,10],"y":[10000,20000,30000]}},
 "coordinatePlacement":"PANEL","caption":"줄이는 횟수 n=2일 때 하루 이익금이 38400원으로 최대이다."}
```

### 3-6. 두 함수를 한 그림에: `referenceCurves` (이차함수 또는 구간별 함수)

`f`와 `g`가 만나고 `f(x)≤g(x)`의 해를 읽는 풀이처럼 **함수 둘**이 한 그림에 필요하면 `piecewise-polynomial-spike-v1`의 조각(또는 이어진 조각)을 `f`로 쓰고, 둘째 함수 `g`는 `graphPlan.referenceCurves`에 쓴다(최대 2개). `g`는 이차함수 하나일 수도 있고, **자기 조각·꺾임점·정의역을 가진 구간별 함수**일 수도 있다(조각 최대 4개, 끊어지지 않아야 한다).

**이차함수 하나로 쓸 때(가장 간단한 형식):**

- `{"id":"g","name":"g","coefficients":["1/2","1","-1/2"],"intersectionX":["-1/3","3"]}`: `coefficients`는 `[상수, x, x²]`(정확한 문자열, x² 계수는 0이 아니다). 이 형식은 실수 전체에서 정의된다.
- `name`(소문자 한 글자, i·x·y 제외)을 쓰면 띠에 `g(x)=-x^2/2+x+1/2`로 쓰인다. 함수의 머리줄은 `graphPlan.functionName:"f"`와 `formula`로 `f(x)=x²/4-x-1/4`가 된다.

**`g`도 구간별 함수일 때:**

```json
{"id":"g","name":"g",
 "pieces":[{"coefficients":["2","2"]},{"coefficients":["0"]},{"coefficients":["-2","2"]}],
 "breakpoints":[{"x":"-1","y":"0"},{"x":"1","y":"0"}],
 "sourceDomain":{"kind":"ALL_REALS"},
 "intersectionX":["0","1","2"]}
```

- `pieces`는 왼쪽부터 1~4개, 계수는 `[상수, x, x²]`(일차식은 두 개, 상수는 한 개). `breakpoints`는 조각 수보다 하나 적고, 이웃한 두 조각이 그 점에서 같은 값을 주어야 한다(끊기면 `PIECEWISE_POLY_REFERENCE_CURVE_DISCONTINUOUS`). `breakpoints[i].y`가 두 조각의 값과 다르면 `PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_VALUE_MISMATCH`.
- `sourceDomain`은 `g`만의 정의역이다. 생략하거나 `{"kind":"ALL_REALS"}`이면 실수 전체, `{"kind":"INTERVAL","range":[lo,hi],"states":["OPEN"|"CLOSED", ...]}`이면 그 구간만 정의된다. 열린 끝은 속이 빈 점, 닫힌 끝은 찬 점으로 그려지고, 정의역 밖에서는 교점을 세지 않는다.
- **교점은 두 함수가 모두 정의된 곳에서만, 조각 쌍마다 따로 푼다.** `intersectionX`에는 그런 교점 x를 하나도 빠짐없이 쓴다(중근은 한 번, 최대 8개). 어느 한쪽 조각의 구간 밖이거나 열린 끝인 근은 교점이 아니다. 엔진과 독립 관측기가 각각 SymPy로 다시 풀어 다르면 `PIECEWISE_POLY_INTERSECTION_MISMATCH:g:engine finds N intersection(s)`로 거절한다.
- `g`의 **모든 꺾임점과 조각 안쪽 꼭짓점은 `requiredPoints`에 쓴다**(`PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS`, `..._EXTREMUM_NOT_IN_REQUIRED_POINTS`). 이차함수 형식이면 꼭짓점을 쓴다(`PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS`).
- `formula`(선택)는 `g`의 식을 `g(x)=...` 꼴로 곡선 곁에 쓴다. `abs(...)` 등 3-3의 식 문법을 따르고, 조각과 같은 함수인지 엔진이 확인한다(`PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_MISMATCH`). 조각만으로 주어지는 함수는 `formula` 없이 `name`만 쓰면 곡선 곁에 `g(x)`로 표시된다. 이때 `f`도 `formula` 없이 `functionName`만 주면 머리줄 대신 곡선 곁에 `f(x)`로 표시되어 두 곡선을 구별할 수 있다.
- `coefficients` 형식에서 x² 계수가 0이면 이차함수가 아니다(`PIECEWISE_POLY_REFERENCE_CURVE_NOT_QUADRATIC:<id>`). `pieces`의 각 조각은 **자기 정의역 위에만** 그려진다. 한 곡선이 함수의 조각 하나와 완전히 같으면 `PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE`, 형식이 틀리면 `PIECEWISE_POLY_REFERENCE_CURVES_INVALID`, 조각이 5개 이상이면 `PIECEWISE_POLY_REFERENCE_CURVE_PIECE_COUNT_INVALID`, 정의역·꺾임점이 틀리면 `PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID`/`..._BREAKPOINT_INVALID`다. 삼차 이상, 세로선, 색칠은 여전히 UNSUPPORTED다.
- `sampleNote`(선택, 32자 이내): `a=2`처럼 풀이가 고른 매개변수 값을 그림 안 왼쪽 위에 보인다. caption에도 같은 값을 쓴다. 형식이 틀리면 `PIECEWISE_POLY_SAMPLE_NOTE_INVALID`.

```json
{"capability":"piecewise-polynomial-spike-v1","graphPlan":{"family":"piecewise-polynomial","pieces":[{"coefficients":["0","0","-1"]},{"coefficients":["0","-1","1"]}],
 "breakpoints":[{"x":"0","y":"0"}],"sourceDomain":{"kind":"ALL_REALS"},"functionName":"f",
 "referenceCurves":[{"id":"g","name":"g","pieces":[{"coefficients":["2","2"]},{"coefficients":["0"]},{"coefficients":["-2","2"]}],
  "breakpoints":[{"x":"-1","y":"0"},{"x":"1","y":"0"}],"intersectionX":["0","1","2"]}],
 "requiredPoints":[{"id":"A","x":0,"y":0},{"id":"B","x":0.5,"y":-0.25},{"id":"C","x":-1,"y":0},{"id":"D","x":1,"y":0}],
 "exactCoordinates":{"B":["1/2","-1/4"]},"axisTickValues":{"x":[2],"y":[2]}},
 "coordinatePlacement":"PANEL","caption":"a=2일 때 y=f(x)와 y=g(x)의 그래프가 x=0, 1, 2의 세 점에서 만난다."}
```

### 3-6-영역. 그래프 영역 색칠: `graphPlan.regions` (곡선 아래·곡선 사이 넓이)

적분 넓이·속도와 거리·`|f|` 넓이처럼 **어느 영역을 더했는지**가 풀이의 핵심이면 그래프 plan에 `graphPlan.regions`를 더한다(최대 4개). 영역은 두 경계 사이를 `from`부터 `to`까지 칠한 띠 하나다.

- `{"id":"S1","upper":"f","lower":"axis","from":"-2","to":"1","fill":"LIGHT","label":"S_1"}`: `upper`·`lower`는 `"f"`(그 함수), `"axis"`(x축, y=0), `referenceCurves`의 id, `referenceLines`의 id 중 하나다. `from`·`to`는 정확한 정수·분수·`sqrt(...)` 문자열이고 `from<to`다. 경계가 정의된 구간이면 양 끝이 교점이 아니어도 세로 변으로 닫힌다(예: `x=1`부터 `1+h`까지는 `h`의 표본값을 넣는다).
- 두 경계가 구간 안에서 만나거나(교차) 한 점에서 폭이 0이 되면 한 영역으로 접지 말고 **만나는 x에서 나눠 여러 영역**으로 쓴다. 끝점에서만 만나는 것은 괜찮다. 축 아래 넓이는 `upper:"axis"`, `lower:"f"`로 따로 칠하고 라벨을 다르게 단다.
- `fill`은 `LIGHT`(기본) 또는 `MEDIUM`(평면도형 영역과 같은 연한 회색). `label`은 영역 안에 놓이는 짧은 수식(40자 이내, 예: `S_1`, `S_2`)이다.
- 경계는 그 곡선을 그리는 바로 그 식으로 표본화하므로 색칠 테두리가 곡선 획과 어긋나지 않는다. 엔진은 모든 획 아래에 even-odd path 하나로 칠하고, 독립 관측기는 plan에서 두 경계를 다시 계산해 9개 표본 x에서 채움 경계·안/밖·x 범위·색·획 아래 순서·라벨 내부·영역 겹침을 확인한다.

```json
{"capability":"piecewise-polynomial-spike-v1","graphPlan":{"family":"piecewise-polynomial",
 "pieces":[{"coefficients":["0","0","1"]}],"breakpoints":[],
 "sourceDomain":{"kind":"INTERVAL","range":["-2","2"],"states":["CLOSED","CLOSED"]},"formula":"x^2",
 "regions":[{"id":"S1","upper":"f","lower":"axis","from":"1/5","to":"1","fill":"LIGHT","label":"S_1"}],
 "requiredPoints":[{"id":"O","x":0,"y":0}],"axisTickValues":{"x":[],"y":[]}},
 "caption":"곡선 y=x^2과 x축, x=1/5, x=1로 둘러싸인 영역 S_1을 색칠했다."}
```

- 교점 x를 직접 쓰지 않아도 된다. 교점이 `2±sqrt(2)` 같은 무리수면 `intersectionX`에 쓴 것과 같은 문자열을 `from`·`to`에 그대로 쓴다. 두 경계가 그 x에서 실제로 만나는지, 경계가 구간 전체에 정의되는지는 엔진이 정확히 확인한다.
- 오류 코드: `GRAPH_REGION_COUNT_INVALID`(4개 초과), `GRAPH_REGION_FIELD_UNKNOWN`/`GRAPH_REGION_FIELD_INVALID`(모르는 필드·형식), `GRAPH_REGION_ID_INVALID`/`GRAPH_REGION_ID_DUPLICATE`, `GRAPH_REGION_BOUNDARY_UNKNOWN`(없는 곡선·직선 id), `GRAPH_REGION_BOUNDARY_UNDEFINED`(그 경계가 구간 전체에 정의되지 않음), `GRAPH_REGION_DOMAIN_INVALID`(`from`≥`to`, 그린 범위 밖), `GRAPH_REGION_BOUNDARIES_CROSS`(안에서 교차·폭 0 → 영역을 나눈다), `GRAPH_REGION_EMPTY`, `GRAPH_REGION_FILL_UNSUPPORTED`, `GRAPH_REGION_LABEL_INVALID`. `regions`는 `piecewise-polynomial-spike-v1`에서만 쓴다(다른 family에 넣으면 `GRAPH_REGION_REQUIRES_PIECEWISE_POLYNOMIAL`). 관측기 코드는 `GRAPH_REGION_BOUNDARY_MISMATCH`, `GRAPH_REGION_OUTSIDE_INTERVAL`, `GRAPH_REGION_INTERIOR_MISSING`, `GRAPH_REGION_FILL_MISMATCH`, `GRAPH_REGION_NOT_BENEATH_STROKES`, `GRAPH_REGION_LABEL_OUTSIDE`, `GRAPH_REGION_OVERLAP` 등이다.

### 3-7. 사인·코사인을 구간(여러 주기)에서 직선과 함께: `INTERVAL_PI`, `referenceLines`

`0<x<nπ`에서 `sin x = 3/n`의 실근 개수처럼 **사인·코사인 곡선이 수평선 또는 기울어진 직선과 만나는 개수**를 세는 풀이에 쓴다. `trigonometric-spike-v1`(SIN·COS)에 두 필드를 더한다. TAN은 안 된다.

- `graphPlan.sourceDomain:{"kind":"INTERVAL_PI","rangePi":["0","6"],"states":["OPEN","OPEN"]}`: 그릴 x 구간(π의 정확한 유리수 배, 정규형 문자열). 열린 끝은 속이 빈 점, 닫힌 끝은 찬 점이고 끝 라벨 `6π`가 붙는다. 1/4~12주기까지. `domain`, `viewport`는 엔진이 다시 짠다.
- `graphPlan.referenceLines`(최대 3개): 수평선 `{"id":"k","y":"1/2","intersectionCount":6}`, 기울어진 직선 `{"id":"k","slope":"1/10","intercept":"0","intersectionCount":3}`. `y`, `slope`, `intercept`는 정확한 정수·분수 문자열, 기울기는 0이 아니다. 문자가 든 직선은 풀이가 다루는 **표본값 하나**로 그리고 그 값을 caption에 쓴다(예: n=6이면 y=3/6=1/2).
- `intersectionCount`는 작성자의 주장이다. 구간 안에서 곡선과 직선이 만나는 서로 다른 점의 수(접점은 한 번, 열린 끝은 구간 밖). 엔진은 모든 교점을 직접 찾고(수평선은 닫힌 식, 기울어진 직선은 부호 변화 이분법), 독립 관측기는 SymPy 식과 40자리 근 탐색으로 다시 찾아 개수와 위치, 그리고 최종 SVG의 곡선·양 끝 표시·직선·교점마다의 점을 대조한다.
- 눈금: 보통 `axisTickValues:{"x":[],"y":[1]}`처럼 쓴다(x 눈금 숫자는 π의 배수가 아니라서 쓰지 않는다).

```json
{"capability":"trigonometric-spike-v1","graphPlan":{"family":"trigonometric","function":"SIN","coefficients":["1","1","0"],"phasePi":"0",
 "sourceDomain":{"kind":"INTERVAL_PI","rangePi":["0","6"],"states":["OPEN","OPEN"]},"domain":[0,19],"viewport":[-1,20,-2,2],
 "referenceLines":[{"id":"k","y":"1/2","intersectionCount":6}],"axisTickValues":{"x":[],"y":[1]}},
 "caption":"n=6일 때 0<x<6π에서 y=sin x의 그래프와 직선 y=1/2은 6개의 점에서 만난다."}
```

오류 코드: `TRIG_LINE_INTERSECTION_COUNT_MISMATCH:<id>:engine finds N intersection(s)`(주장한 개수가 다르다. N으로 고치거나, 기울어진 직선이 곡선에 접하기만 하면 접점은 안 찾으니 다른 표본값을 쓴다), `TRIG_LINE_THROUGH_INTERVAL_END:<id>`(닫힌 끝에서 만난다. 끝 상태를 OPEN으로 하거나 값을 바꾼다), `TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED`(1/4주기 미만 또는 12주기 초과), `INVALID_TRIG_INTERVAL`, `TRIG_LINE_FORM_INVALID`/`TRIG_LINE_SLOPE_ZERO`/`TRIG_LINE_COEFFICIENT_INVALID`/`TRIG_LINE_INTERSECTION_COUNT_INVALID`/`TRIG_REFERENCE_LINES_INVALID`(필드 형식), `TRIG_REFERENCE_LINES_REQUIRE_INTERVAL_PI`(직선은 `INTERVAL_PI` 형식에서만), `TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED`(TAN이거나 구간 형식이 틀리다), `TRIG_INTERSECTIONS_BELOW_PROFILE_FLOOR`(교점이 너무 붙어 구분이 안 된다. 주기 수를 줄인다).

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
- **평각(직선 위의 반원 호)** (E30): `angles`의 한 행에 `"straight":true`를 쓰면 세 점이 한 직선 위(꼭짓점이 가운데, 0.5° 이내)일 때 **180° 반원**을 그린다. `"side":"ABOVE"|"BELOW"|"LEFT"|"RIGHT"`(화면에서 반원이 향하는 쪽)가 필수이고(`ANGLE_STRAIGHT_SIDE_REQUIRED`), 직선과 나란한 쪽을 고르면 `ANGLE_STRAIGHT_SIDE_AMBIGUOUS`, 직선이 아니면 `ANGLE_STRAIGHT_NOT_STRAIGHT`다. `value`는 180(생략 가능)이고 라벨은 기본 `180°`다. 다른 각이 같은 꼭짓점에 있으면 `"ring":3`(가장 바깥 호)과 `"style":"ARC"`(칠 없음)를 쓰면 그 각들을 바깥에서 감싼다. 관측기는 반원이 이름 붙인 쪽을 향하는지 그려진 호의 가운데로 확인한다(`ANGLE_STRAIGHT_SIDE_MISMATCH`).
- **각의 합 라벨** (E30): `angleSums:[{"id":"sSum","angles":["aAOB","aCOD"],"label":"90°","at":[0,-2.4],"anchor"?}]`은 **같은 꼭짓점의 두 각 표식**(둘 다 `value`를 가진 `angles` 행)의 합을 `15°+75°=90°` 꼴 식 하나로 쓴다. 식은 두 각의 값에서 엔진이 만들고(참), `label`을 주면 그 합(0.5° 이내, ° 유무 무관)과 같아야 한다(`ANGLE_SUM_MISMATCH`). `at`은 원문 좌표 `[x,y]` 또는 점 id(기본: 그 꼭짓점 옆), `anchor`는 자유 텍스트 라벨과 같다. 오류: `ANGLE_SUM_ANGLES_INVALID`, `ANGLE_SUM_VERTEX_MISMATCH`, `ANGLE_SUM_NEEDS_VALUES`, `ANGLE_SUM_AT_INVALID`, `ANGLE_SUM_ANCHOR_INVALID`. 두 각이 이웃하지 않아도 되며 괄호는 그리지 않는다(자리는 `at`으로 정한다).
- **직각 표시에 식 라벨** (E30): `rightAngles:[{"id":"r3x","refs":["P2","Mp","Mu"],"label":"3x=90°"}]`는 직각 표시(작은 정사각형) 옆에 식을 쓴다(영문자·숫자·공백·`( ) , < > = + - . °`만, 함수 이름·한글 불가: `RIGHT_ANGLE_LABEL_INVALID`). 라벨은 직각 안쪽 꼭짓점 가까이(90px 이내)에 서거나 정사각형에서 나오는 지시선으로 이어진다. 평각 호가 직각을 감싸면 안쪽에 자리가 없으니 그 직각은 라벨 없이 쓴다.
- **그 밖의 작은 표기** (E30): 각·식 라벨에 그리스 문자 `γ`, `δ`(`α β θ`처럼 기울인 글자)를 쓸 수 있다. 길이 라벨 단위는 `cm`, `m`, `mm`에 더해 `kg`도 된다(`expressionLabels[].unit`, `arcs[].unit` 등). **공통 변**은 `commonSides:[{"id":"cFC","segment":"sFC","text"?:"공통","labelAt"?:"MID"}]`로 그 선분 옆에 평문 `공통`(또는 6자 이하 글)을 쓴다(자기 선분 가까이에 서고 다른 선분의 라벨로 오해되지 않는다: `SEGMENT_LABEL_AMBIGUOUS_OWNER`).
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
- **자유 텍스트 라벨** (E30): 어떤 선분·각·영역에도 속하지 않는 짧은 글자는 `planeMarks.textLabels:[{"id","at","text","labelKind"?,"anchor"?,"factRole"?}]`로 쓴다(평면도형 그림에서도 같다). 사분면 이름·부호 조건·점 옆 식·이름 숨긴 점의 좌표가 그 예다.
  - `at`: **원문 좌표 `[x,y]`**(라벨의 가운데가 거기 놓이고, 자리가 막히면 18px 안에서 가장 가까운 빈 자리로 비킨다; `anchor` 기본 `CENTER`) 또는 **화면에 있는 점의 id**(라벨이 그 점 옆 `anchor` 쪽에 서고, `anchor`가 없으면 가장 가까운 빈 쪽에 선다). `anchor`는 `CENTER`·`N`·`NE`·`E`·`SE`·`S`·`SW`·`W`·`NW`이고, 점 옆에서는 `CENTER`를 쓰지 않는 편이 좋다. 방향을 정하면 그 쪽만 시도하므로 자리가 없으면 `LAYOUT_INVENTORY_INCOMPLETE`(`at`·`anchor`를 바꾼다).
  - `text`: 40자 이하 한 줄. 한글이 있으면 `TEXT`(글꼴 그대로의 평문: `"제4사분면"`, `"a>0, b<0 (제4사분면)"`), 한글이 없으면 `MATH`(수식: `"P(a,b)"`, `"a>0, b<0"`, `"(-1,0)"`, `"x<=3"`). `labelKind`로 직접 정할 수도 있다. `MATH` 글자는 영문자·숫자·공백·`( ) , < > = + - .`만 쓰고 쉼표로 이은 두 식(`a>0, b<0`)도 된다. 분수·거듭제곱·제곱근·함수 이름(`sqrt`, `sin` 등)은 안 된다(`TEXT_LABEL_MATH_UNSUPPORTED`).
  - **사실 확인.** 점 옆의 `MATH` 라벨이 `(x,y)` 꼴 수(앞에 한 글자 이름이 있어도 된다)이면 엔진과 관측기가 그 점의 실제 좌표와 대조한다(`TEXT_LABEL_COORDINATE_MISMATCH`). 이름을 숨긴 `SOURCE_POINT`(`hiddenPointNames`)는 원래 글(캡션·라벨)에서 이름으로 부를 수 없지만, **그 점 위에 서는 `textLabels`**(`at`이 그 점의 id)는 예외라서 `"P(a,b)"`를 P 옆에 쓸 수 있다.
  - **관측기.** 최종 SVG에서 TEXT는 `data-text`가 글자와 같은지, MATH는 그려진 글리프 코드가 글자와 같은지(영문자는 기울임 코드), 라벨이 `at`(또는 점)의 정해진 쪽에 있는지(`TEXT_LABEL_NOT_AT_PLACE`, `TEXT_LABEL_NOT_ON_SIDE`, `TEXT_LABEL_TOO_FAR`), 다른 획·라벨과 겹치지 않는지(`MARK_LABEL_OVERLAPS`)를 plan만 보고 다시 확인한다. 오류: `TEXT_LABEL_AT_INVALID`, `TEXT_LABEL_ANCHOR_INVALID`, `TEXT_LABEL_TEXT_INVALID`.
  - **그래프 plan에는 쓸 수 없다**(`PLANE_MARKS_UNSUPPORTED_ON_GRAPH`). 곡선 위 그래프의 이름·식은 `overlays`(3-14절)의 라벨을 쓴다.
- **함수 그래프는 안 된다.** `planeMarks`·점선·화살촉은 작도 plan의 사실 표시이므로 그래프 plan(`polynomial-spike-v1`, `piecewise-*`, `INTERVAL_PI` 등)에 넣으면 `PLANE_MARKS_UNSUPPORTED_ON_GRAPH`로 거절한다. 직선과 x축이 이루는 각, 교점의 각, 수선의 발의 직각이 필요하면 그 점·선을 실제로 만드는 **좌표 작도 plan**으로 그린다.
- **오류.** 3-8절의 표식 오류 코드가 그대로 나오고, 좌표 그림에서만 추가로 `PLANE_MARKS_UNSUPPORTED_ON_GRAPH`(그래프 plan에 표식을 넣음)가 있다. 표식 id는 노드·선분 id와 달라야 하고 정해진 키만 쓴다.
- **한계.** 3-8절과 같다: 5° 미만의 각은 거절되고(`ANGLE_ARC_TOO_SMALL`), 한 꼭짓점에 각이 많이 몰리거나 캔버스가 너무 작아 지시선 자리도 없으면 표식을 줄이거나 `noLabel`을 쓴다.

### 3-입체. 중학교 입체도형·전개도: 숨은 모서리 점선, 이름·길이 라벨, 전개도 (`solid-figure-v1`)

각기둥·각뿔·각뿔대·원기둥·원뿔·원뿔대·구·반구를 입체 그림으로, 또는 각기둥·각뿔·원기둥·원뿔의 전개도를 그려야 하는 문항에 쓴다.
`construction-spike-v1`이 아니라 독립된 capability `solid-figure-v1` 하나로 쓴다. 입체는 치수를 실제 길이로 주면 엔진이 3차원 모델을 만들어 **고정된 하나의 투영**(정사영, 방위 28°, 고도 20°)으로 그린다: 원은 가로축이 수평인 타원, 보이지 않는 모서리는 깊이 검사로 자동 점선이다. 작성자는 좌표나 점선 여부를 쓰지 않는다.

```json
{"capability":"solid-figure-v1","unit":"cm",
 "solids":[{"kind":"PYRAMID","base":{"kind":"RECT","width":5,"depth":5},"height":9,"names":"ABCDE"}],
 "dims":[{"edge":"AB"},{"height":true}],
 "solidCaption":{"text":"사각뿔"},
 "caption":"밑면 한 변 5, 높이 9인 사각뿔","sourceConditions":[...],"newVisualInformation":["밑넓이 25와 높이 9"]}
```

**입체 `solids`(1~3개, 가로로 나란히 같은 배율로 놓인다).**

| kind | 필수 매개변수 | 비고 |
|---|---|---|
| `PRISM` | `base`, `height` | `base`는 `{kind:"RECT",width,depth}`, `{kind:"REGULAR",n:3~8,side}`(첫 변이 앞쪽 수평), `{kind:"POLYGON",points:[[u,v]..],plane?}`(점 8개 이하의 단순 다각형, 오목해도 됨). `plane:"XZ"`이면 다각형이 앞면(x, 높이)이고 `height`만큼 뒤로 밀린다: 직육면체 일부를 비스듬히 잘라 낸 입체(사다리꼴 기둥)를 이렇게 쓴다 |
| `PYRAMID` | `base`, `height` | 밑면은 볼록해야 한다. 꼭짓점은 밑면 중심 위, `apex:[x,y]`로 옮길 수 있다 |
| `FRUSTUM` | `base`, `height`, `topScale`(0~1) | 각뿔대. 위 밑면은 아래를 `topScale`배 한 닮은꼴 |
| `CYLINDER` / `CONE` | `radius`, `height` | 원뿔은 `orientation:"APEX_DOWN"`이면 꼭짓점이 밑면에 닿는 그릇이 된다(꼭대기의 큰 원이 입구). `inside:"s1"`이면 원기둥 `s1` 안에 같은 축으로 놓인다 |
| `CONE_FRUSTUM` | `radius`, `topRadius`, `height` | `topRadius`는 `radius`보다 작아야 한다. `orientation:"APEX_DOWN"`이면 좁은 밑면이 아래, 넓은 윗면이 입구인 그릇이다. `inside:"s1"`은 원기둥 안에 놓을 때만 |
| `SPHERE` / `HEMISPHERE` | `radius` | 반구는 평평한 면이 아래. `inside:"s1"`이면 원기둥 안에 놓인다(꼭 맞는 구는 지름 = 원기둥 높이). `SPHERE`는 `cut`으로 중심을 지나는 평면에 잘린 조각이 된다(아래 `cut` 항목) |
| `REGULAR_POLYHEDRON` | `faces`(4, 8, 12, 20), `side` | **정사면체·정팔면체·정십이면체·정이십면체**(모서리가 모두 `side`). 정육면체는 `PRISM`의 `RECT` 밑면으로 쓴다(`faces:6`은 `SOLID_REGULAR_FACES_UNSUPPORTED`). 한 축이 세로로 서고 바닥(z=0)에 선다: 정사면체와 정십이면체는 한 면으로, 정팔면체와 정이십면체는 꼭짓점 하나로 선다. 꼭짓점 순서(`names`, 세는 번호 `count`, `#v<i>`의 순서): 정사면체 밑면 삼각형(첫 변이 앞쪽 수평)·꼭대기, 정팔면체 정사각형 고리 4개·위 꼭짓점·아래 꼭짓점, 정이십면체 위 꼭짓점·위 고리 5개(첫째가 보는 쪽)·아래 고리 5개(위 고리의 두 꼭짓점 사이마다)·아래 꼭짓점, 정십이면체 위 오각형 5개·그 아래 5개·그 아래 5개·아래 오각형 5개. 면 이름은 `f0`, `f1`, ...: 정이십면체는 위 꼭짓점 둘레 5개(f0~f4), 위 고리에 매달린 5개, 아래 고리에 선 5개, 아래 꼭짓점 둘레 5개이고, 정십이면체는 정이십면체의 꼭짓점마다 한 면(f0 위 오각형, f11 아래 오각형)이다 |
| `BIPYRAMID` | `base`(볼록), `height` | **쌍뿔**: 각뿔 두 개를 밑면끼리 붙인 입체(오각쌍뿔 등). `height`는 각뿔 하나의 높이이고 밑면(고리)이 가운데에 놓인다. 꼭짓점 순서는 고리, 위 꼭짓점(`#apex`), 아래 꼭짓점(`#apex2`)이고 면 이름은 `top0..`(위쪽 각뿔, `top i`는 밑면의 i번째 모서리 위), `bottom0..`이다. `plane:"XZ"`는 쓸 수 없다 |

- **이름 `names`**: 대문자 한 글자(뒤에 프라임 `′`을 붙여 `A′`처럼 쓸 수 있다)씩 밑면 순서대로 이은 문자열 `"FGHEBCDA"`(밑면 먼저, 다음 위 밑면; 각뿔은 밑면 뒤에 꼭짓점 한 글자; `.`은 이름 없음), 또는 `{base,top,apex}`. 프라임이 붙은 이름은 문자열에서 한 글자로 묶이며(예: `"A′B′C′V′"`), 길이를 쓸 때는 `edge` 대신 `{"from":"V′","to":"C′"}`처럼 from/to로 쓴다. 생략하면 A, B, C... 순서다. **한 꼭짓점에 이름이 여럿**(전개도를 접으면 겹치는 점 M=A=I처럼)이면 `names`를 목록으로 쓰고 그 항목을 `"M,A,I"`(쉼표로 이은 2~4개 이름)로 쓴다: `"names":{"base":["H,B","C,G","F,D","E"],"top":["M,A,I","N","K","L,J"]}`. 첫 이름이 그 꼭짓점의 대표 이름(모서리 `data-edge`·라벨 id)이고, `segments`·`dims`·`marks`·`highlights`에는 어느 이름으로 써도 되며, 라벨은 `M,A,I`를 한 덩어리로 그 꼭짓점 옆에 쓴다. 한 이름은 한 그림에서 한 번만 쓴다(같은 이름이 두 꼭짓점이나 한 꼭짓점에 두 번이면 `SOLID_NAME_DUPLICATE`). 이름을 글자 문자열로 쓸 때는 쉼표가 무시되므로(`"A,B,C"`는 `"ABC"`와 같다) 여러 이름은 목록 항목으로만 쓰고, 이름이 5개 이상이거나 모양이 틀리면 `SOLID_NAMES_INVALID`, 원기둥·원뿔 계열의 이름은 하나씩이다. 이름은 밑면이 위에서 볼 때 반시계 방향이 되는 순서로 붙는다(직육면체는 앞-왼쪽에서 시작해 앞-오른쪽, 뒤-오른쪽, 뒤-왼쪽). 원기둥·원뿔 계열은 `names:{center,top,apex}`.
- **꼭짓점 참조(원문 그림에 꼭짓점 이름이 없을 때)**: 원문에 없는 글자를 지어 붙이지 않는다. `names`를 `"........"`처럼 모두 `.`으로 두고, 이름을 쓰는 모든 자리(`segments`의 `from`·`to`, `dims`의 `edge`·`from`·`to`, `highlights`의 `polygon`, `marks`의 `at`·`refs`·`equalLengths.segments`)에 **참조 문자열**을 쓴다: `"#b0"` 밑면 둘레의 i번째 꼭짓점(0부터, 밑면 다각형의 순서), `"#t2"` 위 밑면(각기둥·각뿔대)의 i번째, `"#apex"` 각뿔의 꼭대기, `"#v5"` 모델 순서의 i번째(세는 번호 k는 `#v(k-1)`: `count`로 번호를 먼저 그려 보면 어느 꼭짓점인지 알 수 있다). 입체가 여럿이면 `"s2#b0"`처럼 입체 id를 앞에 붙인다(붙이지 않아 둘 이상에 맞으면 `SOLID_VREF_AMBIGUOUS`). `edge`는 `["#b1","#t1"]`처럼 두 참조의 목록으로 쓰고(`equalLengths.segments`의 항목도 같다), 이름 있는 꼭짓점도 참조로 쓸 수 있으며 이름과 섞어 써도 된다. 밑면 둘레의 순서: `RECT`는 b0 앞쪽 왼쪽, b1 앞쪽 오른쪽, b2 뒤쪽 오른쪽, b3 뒤쪽 왼쪽(b3와 t3 쪽이 보이지 않는 모서리를 만든다), `REGULAR`는 첫 변 b0→b1이 앞쪽 수평이고 위에서 보아 반시계 방향이다. 예(이름 없는 정육면체의 한 꼭짓점에서 만나는 세 모서리와 밑면 대각선): `"segments":[{"from":"#b1","to":"#b3","style":"AUTO","role":"REF"}],"marks":{"rightAngles":[{"at":"#b0","refs":["#b1","#b3"]}]},"dims":[{"edge":["#b0","#t0"],"label":"a"}]`. 각기둥의 높이 치수는 옆모서리의 `edge`(`["#b0","#t0"]`)로 쓴다. `cuts`로 자른 입체는 꼭짓점 번호가 바뀌므로 참조를 쓸 수 없다(이름만). (SVG의 `data-edge` 같은 곳에는 이름 없는 꼭짓점이 `s1.b0`, 두 키는 `s1.b0-s1.b1`로 적히지만 작성자는 신경 쓰지 않는다.)
- **길이 `dims`**(모두 모서리 옆에 놓인다): `{"edge":"AB"}` 또는 `{"from":"E","to":"G"}`(그려진 모서리나 `segments`의 선분), `{"radius":"bottom"|"top"|"center"|"level"}`, `{"height":true}`(각뿔, 각뿔대, 원기둥, 원뿔: 축을 따라 점선), `{"slant":true}`(원뿔·원뿔대의 모선), `{"level":true}` 또는 `{"level":"bottom"}`(아래 `LEVEL` 단면까지의 높이), `{"level":"top"}`(단면에서 꼭짓점·윗면까지의 높이). `radius:"level"`은 `LEVEL` 수면의 반지름이고, `bottom`·`top`은 각각 z=0·z=높이의 원(꼭짓점 쪽 반지름이 0이면 쓸 수 없다). 값은 엔진이 모델에서 계산해 정확히 쓴다(`5`, `7.5`, `5\sqrt{2}`, `8\pi`, `\frac{10}{3}`)와 `unit`. `label`을 쓰면 숫자일 때는 계산한 값과 같아야 하고(다르면 `SOLID_DIM_VALUE_MISMATCH`), `r`, `h`, `2r`, `\frac{1}{3}h`처럼 문자·식이면 기호 라벨이 된다. 정확한 짧은 꼴이 없는 길이는 `SOLID_DIM_NOT_EXPRESSIBLE`이니 `label`로 문자를 쓴다.
- **`cuts`(평면으로 잘라 낸 입체)**: `PRISM`·`PYRAMID`·`FRUSTUM` 항목에 `"cuts":[{"through":[["AD","1/2","M"],["BC","1/2","N"],["CG","1/2","P"],["DH","1/2","Q"]]}]`을 쓰면 **볼록 다면체를 평면 1~2개로 잘라 남은 입체**를 엔진이 정확히 계산해 그린다(정육면체를 모서리 중점 M, N, P, Q를 지나는 평면으로 자른 입체처럼). `through`는 **모서리 위의 점 3~6개**이며 `[모서리, "p/q", 새 이름?]`이다: 모서리는 그 입체의 두 꼭짓점 이름 `"AD"`(글자 순서대로, 프라임 가능), `"p/q"`는 첫 꼭짓점에서 둘째 꼭짓점 쪽으로 그 길이의 p/q 지점(0 < p/q < 1), 세 번째 항목은 그 점에 새로 생기는 꼭짓점의 이름(생략하거나 `"."`이면 이름 없음). 점들은 한 평면 위에 있어야 하고, 그 평면이 **꼭짓점이 더 많은 쪽**을 남긴다(같은 수이면 `"keep":"F"`처럼 남길 쪽의 꼭짓점 이름을 써야 한다; `keep`은 그 밖에도 남길 쪽을 정할 수 있다). 평면 위의 꼭짓점은 남고, 평면과 만나는 모든 모서리에 새 꼭짓점이 생기며(`through`에 쓴 점은 이름이 있고 나머지는 이름 없음) 단면이 새 면이 된다. 잘려 나간 꼭짓점의 이름(위 예의 C, D)은 `segments`·`dims`에 쓸 수 없다. **꼭짓점으로 정하는 평면**: `{"vertices":["A","C","F"]}`는 입체의 꼭짓점을 평면 위의 점으로 쓴다(꼭짓점 이름, 첫 평면에서는 이름 없는 꼭짓점의 참조 `#b0`·`#t2`·`#apex`·`#v5`도: 두 번째 평면에서는 참조를 쓸 수 없다). `through`와 함께 쓸 수 있고(합쳐 3~6개, 한 평면 위), 한 꼭짓점의 세 이웃 꼭짓점을 지나는 평면이면 그 꼭짓점 하나가 떨어져 나가 **새 꼭짓점 없이** 세 꼭짓점이 단면의 꼭짓점이 된다(직육면체 한 꼭짓점 자르기: 꼭짓점 7개·모서리 12개·면 7개). 평면 위의 꼭짓점은 남고, 어느 한쪽에도 꼭짓점이 없으면 `SOLID_CUT_NO_EFFECT`, 양쪽의 수가 같으면(지나는 꼭짓점 네 개의 대각 평면 등) `keep`이 필요하다. 예: 윗면 A B C D 아래에 E F G H가 있는 직육면체(`"names":"EFGHABCD"`)에서 B를 자르기: `"cuts":[{"vertices":["A","C","F"]}]`. 잘려 나간 삼각뿔은 `PYRAMID`(밑면 `POLYGON`, `apex`)로 따로 그린다. 두 번째 평면은 첫 번째가 남긴 입체에서(새 꼭짓점 이름을 써서) 같은 방식으로 자른다. 숨은 모서리의 점선은 남은 입체에서 깊이 검사로 다시 정한다. `highlights:[{"polygon":["M","N","P","Q"]}]`로 단면을 칠하고 `segments`의 `REF`·`ACCENT`로 모서리를 강조한다. 이름 없는 새 꼭짓점은 라벨이 없다. 원기둥·원뿔·구, 전개도(`net`), 오목한 밑면의 각기둥, `count`, `height` 치수와는 함께 쓸 수 없고 3개 이상의 평면도 쓸 수 없다.
- **`highlights`**: `[{"polygon":["E","G","C"]}]` 그려진 선분들로 이루어진 평면 다각형을 연하게 칠한다(직육면체 위의 직각삼각형 EGC처럼). 다각형의 변은 모서리이거나 `segments`에 있어야 한다. **꼭짓점 이름 없이 면 전체**를 칠할 때는 면 이름으로 쓴다: `[{"face":"top"},{"face":"bottom"},{"face":"side1","fill":"WARM"}]`(각기둥·각뿔·각뿔대; 면 이름은 `bottom`, `top`(각뿔은 없다), `side0`, `side1`, ...이고 `side i`는 밑면의 i번째 모서리 위의 옆면; 다면체가 여럿이면 `"solid":"s1"`을 함께 쓴다; 이름을 모두 `.`으로 둔 입체도 칠할 수 있다). 정다면체의 면 이름은 `f0`, `f1`, ...(`faces`개), 쌍뿔은 `top0..`·`bottom0..`이다. `fill`은 `LIGHT`(기본, 연한 파랑)·`MEDIUM`(진한 파랑)·`WARM`(주황)·`GREEN`·`ROSE`·`VIOLET`이고 다각형 꼴에도 쓴다. 가려진 면(아래 밑면 등)은 앞의 면 위로 비쳐 칠해지니 가려진 면은 `LIGHT`·`MEDIUM` 한 가지로 두는 것이 읽기 쉽다. 8개까지, `cuts`로 자른 입체나 원기둥·원뿔·구에는 면 이름 꼴을 쓸 수 없다(`SOLID_HIGHLIGHT_FACE_UNSUPPORTED:CUT`, `SOLID_HIGHLIGHT_INVALID`).
- **구의 `cut`(자른 구)**: `SPHERE` 항목에 `"cut":{"kind":"QUARTER"}`를 쓰면 **구를 중심을 지나는 평면(좌표 평면 1~3개)으로 잘라 남은 조각**만 그린다. `kind`는 `HALF`(반구: 평평한 원판 1개), `QUARTER`(두 수직 평면 사이의 4등분: 반원 2개), `OCTANT`(8등분 한 조각: 4분원 3개), `THREE_QUARTERS`(4등분 한 조각을 뺀 3/4), `SEVEN_EIGHTHS`(8등분 한 조각을 뺀 7/8: 4분원 3개가 드러난다)이고, `facing`은 기본 `"CUT"`(단면이 보는 쪽을 향함: 조각의 단면 원판·반원이 칠해져 보인다)이거나 `"CURVED"`(곡면이 보는 쪽이고 단면·모서리는 뒤에서 점선). 보이는 단면은 연하게 칠해지고(`faces`), 단면의 둘레(타원 호)·단면이 만나는 반지름(모서리)은 실선, 조각 뒤에 가려진 것은 점선이며 구의 윤곽(곡면의 가장자리)은 조각이 닿는 곳만 그려진다. `names:{center:"O"}`이면 중심에 점과 이름이 붙고, `dims:[{"radius":"center"}]`(여러 입체면 `solid` 지정)는 보이는 반지름 위에 길이를 쓴다(`CURVED`로 돌려 모든 반지름이 가려지면 `SOLID_SPHERE_CUT_RADIUS_HIDDEN`). 한 번 자른 두 조각을 나란히 보이려면 `HALF` 입체 둘(`s1`, `s2`)을 `solids`에 쓴다(조각마다 단면 원판이 하나씩 보인다; `cut.explode`는 지원하지 않는다). `inside`·`count`와는 함께 쓸 수 없고 반구·원기둥·원뿔에는 쓸 수 없다. 중심을 지나지 않는 평면(`offset`이 0이 아님)·위 5가지 밖의 조각은 거절한다. 예: `{"kind":"SPHERE","radius":5,"names":{"center":"O"},"cut":{"kind":"QUARTER"}}`.
- **`segments`**: `[{"from":"E","to":"G","style":"SOLID"|"DASHED"|"AUTO","role":"REF"|"ACCENT"}]` 면의 대각선, 공간대각선, 또는 강조할 모서리(`REF` 굵게, `ACCENT` 빨강). `AUTO`는 입체가 가리는 선분이면 점선으로 그린다. 입체 안을 지나는 선분은 `SOLID`나 `DASHED`로 정한다. **한 입체에 10개까지**(초과는 `SOLID_SEGMENTS_INVALID`)이므로, 모서리 그룹이 여럿이면 같은 입체를 3-16의 여러 패널에 두고 그룹마다 한 패널씩 강조한다.
- **`sourceQuote`**(선택): 이 plan을 쓴 문항의 문장을 글자 그대로 옮긴 문자열이다(출처 기록일 뿐 그림에는 영향이 없다). 문자열이 아니거나 비어 있으면 `SOLID_SOURCE_QUOTE_INVALID`.
- **원기둥 안의 공 여러 개**: 원기둥(`CYLINDER`) 항목에 `"stack":{"count":3,"radius":3}`(같은 공 `count`개(2~6)를 맨 아래부터 차례로 쌓는다: 중심 높이 R, 3R, 5R, ...) 또는 `"inside":[{"kind":"SPHERE","radius":3},{"kind":"SPHERE","radius":3,"centerZ":15}]`(공마다 `radius`와 중심 높이 `centerZ`, 생략하면 앞의 공 위에 얹히고 첫 공은 바닥에 놓인다)를 쓴다(둘을 함께 쓰면 `SOLID_BALLS_INVALID`; 원기둥이 아닌 입체에는 `SOLID_BALLS_UNSUPPORTED:<kind>`). 공은 원기둥 `s1` 안의 구 `s1b1`, `s1b2`, ...가 되므로 `dims:[{"solid":"s1b1","radius":"center"}]`처럼 공마다 반지름을 쓸 수 있다(그 반지름선은 공의 중심 높이에 놓인다). 한 plan의 입체 수 3개 한도는 plan에 쓴 입체만 센다(공은 세지 않는다). 공이 원기둥 안에 들어가고(반지름 ≤ 원기둥 반지름, 바닥 위·윗면 아래: 아니면 `SOLID_NEST_DOES_NOT_FIT:<공 id>`) 서로 겹치지 않아야 한다(중심 거리 ≥ 반지름의 합: `SOLID_NEST_OVERLAP:<id>,<id>`, 같은 원기둥 안에 공과 원뿔이 함께면 `SOLID_NEST_UNSUPPORTED:MIXED`). 공을 직접 `{"kind":"SPHERE","radius":3,"inside":"s1","centerZ":9}`로 써도 된다(`centerZ`는 바닥에 놓이지 않은 `inside` 구에만: 아니면 `SOLID_NEST_INVALID`). 공의 윤곽 원과 적도(앞 반 실선·뒤 반 점선)는 모두 그려지고, 세로로 쌓은 공의 윤곽은 투영 때문에 서로 조금 겹쳐 보인다. 관측기가 각 공의 중심 높이·접함·들어맞음을 plan에서 다시 구해 최종 SVG의 원과 맞춘다.
- **`section`**(구·반구): `{"kind":"LEVEL","at":"1/3"}`은 **자르지 않은 구·반구**(다른 입체 안에 넣지 않은 것)에도 쓴다: 구는 높이 2R의, 반구는 높이 R의 `at` 분수 높이 z에서 반지름 √(R²−(z−zc)²)(zc: 구의 중심 높이 R, 반구는 0)인 원이 칠해진다(회전체가 plan에 없을 때 첫 구·반구를, 여럿이면 `solid`로 고른다). 구·반구에는 `AXIAL`·`fill`·`level` 치수가 없다(`SOLID_SECTION_UNSUPPORTED`, `SOLID_SECTION_FILL_UNSUPPORTED:<kind>`, `SOLID_DIMS_INVALID`). 관측기가 원의 중심·반지름과 앞·뒤 호를 다시 구해 확인한다.
- **`section`**: `{"kind":"AXIAL"}` 원기둥·원뿔·원뿔대의 회전축을 지나는 평면(직사각형, 이등변삼각형, 사다리꼴)을 칠하고, `{"kind":"LEVEL","at":"1/3"}`은 밑면과 평행한 평면(높이의 1/3)을 타원으로 보인다(원뿔 모양 그릇의 수면). `orientation:"APEX_DOWN"` 그릇에서는 수면 아래의 **작은 닮은 그릇 전체**를 연하게 칠하고 그 옆선을 그려, 물이 찬 부분이 보이게 한다. 위쪽이 꼭짓점인 원뿔·원뿔대·원기둥의 `LEVEL`에는 `"fill":"BOTTOM"`(평면 아래 몸체: 큰 원뿔에서 남는 원뿔대)이나 `"fill":"TOP"`(평면 위 몸체: 잘라 낸 작은 원뿔)을 쓰면 그 부분의 겉모양(두 원의 볼록 껍질)을 연하게 칠하고 단면 타원은 그 위에 한 번 더 진하게 칠한다(`APEX_DOWN` 그릇에는 `SOLID_SECTION_FILL_UNSUPPORTED:APEX_DOWN`).
- **`marks`**: 이름 붙인 점 위의 표식이며, plan이 말한 사실을 엔진이 3차원에서 확인한다. `rightAngles:[{at:"G",refs:["E","C"]}]`는 두 변이 실제로 수직일 때(아니면 `SOLID_MARK_NOT_RIGHT_ANGLE`) 작은 직각 표시를, `equalLengths:[{count:1,segments:["AB","CD"]}]`는 길이가 같은 모서리·선분에 같은 눈금(모둠마다 `count` 1~3, 서로 달라야 함)을, `angles:[{refs:["B","A","D"],value?,"arcs":1,"equalGroup?"}]`는 꼭짓점 A의 각에 1~3겹 호를 그린다(같은 `equalGroup`은 크기와 호 수가 같고, 다른 모둠은 호 수가 달라야 함). 표식의 변은 그려진 모서리나 `segments`여야 한다. 각도 라벨은 쓰지 않는다(수치가 필요하면 `dims`나 풀이 글). **원뿔의 두 모선**(이름 없는 원뿔에도): `equalSlant:true`(원뿔·원뿔대가 하나일 때), `{solid?,count?}` 또는 그 목록(3개까지)은 **왼쪽·오른쪽 모선**(그려진 윤곽선)의 가운데에 같은 눈금(`count` 1~3개, 기본 1)을 긋는다. 회전체의 두 모선은 길이가 같으므로 관측기는 그려진 두 윤곽선의 길이가 같은지, 눈금이 각 모선에 수직으로 가운데에 놓였는지 확인한다. 눈금 수는 `equalLengths`와 `equalSlant`의 모든 모둠에서 서로 달라야 하고(`SOLID_MARK_GROUP_AMBIGUOUS`), 원뿔·원뿔대가 아니거나 입체가 여럿인데 `solid`가 없으면 `SOLID_MARK_SLANT_UNSUPPORTED`다. 예: `"marks":{"equalSlant":true}`.
- **`count`(세는 번호)**: 꼭짓점·모서리의 개수를 세는 문항(원문 그림에 꼭짓점 이름이 없는 각뿔대 등)에서 입체 항목(`PRISM`·`PYRAMID`·`FRUSTUM`·`REGULAR_POLYHEDRON`·`BIPYRAMID`)에 `"count":{"vertices":true,"edges":true}`를 쓴다(정십이면체·정이십면체는 모서리가 30개라 꼭짓점 번호만, 정팔면체처럼 모서리가 빽빽한 그림은 모서리 번호가 들어갈 자리가 없어 `SOLID_LABELS_NO_ROOM`일 수 있다. 쌍뿔의 모서리 번호는 고리, 위 꼭짓점으로 가는 모서리, 아래 꼭짓점으로 가는 모서리의 순서, 정다면체는 꼭짓점 번호 쌍의 순서이다). 꼭짓점마다 **1, 2, 3, ...**(밑면 둘레 순서, 그다음 위 밑면 또는 꼭대기)가 꼭짓점 바깥쪽에, 모서리마다 **원문자 ①, ②, ...**가 모서리 중점 옆에 놓이고 **보이지 않는 모서리(점선)도 번호가 붙는다**. 모서리 번호는 밑면 둘레(꼭짓점 i와 i+1을 잇는 모서리, 닫는 모서리가 마지막), 옆모서리(밑 꼭짓점 순서), 위 밑면 둘레의 순서다: 사각뿔대는 ①~④ 밑면, ⑤~⑧ 옆모서리, ⑨~⑫ 윗면. `vertices`·`edges` 중 필요한 것만 `true`로 쓰고(`faces`는 지원하지 않는다), 꼭짓점 번호를 쓰면 그 입체의 꼭짓점에는 이름을 쓸 수 없으므로 `names`를 `"........"`(점)로 둔다(모서리 번호만 쓸 때는 이름과 함께 써도 된다). 모서리는 20개까지다. 번호는 다른 이름·길이 라벨과 같은 크기이고, 번호가 선·다른 라벨과 겹치면 기존 라벨 규칙대로 비켜 놓이며 자리가 없으면 `SOLID_LABELS_NO_ROOM`이다. 예: `{"kind":"FRUSTUM","base":{"kind":"RECT","width":6,"depth":6},"height":5,"topScale":0.6,"names":"........","count":{"vertices":true,"edges":true}}`.
- **`axis`(회전축)**: `CYLINDER`·`CONE`·`CONE_FRUSTUM` 항목에 `"axis":true` 또는 `"axis":{"label":"회전축"}`을 쓰면 입체의 축이 아래·위로 높이의 14 %씩 더 길게 **점쇄선**(긴 선·짧은 점이 번갈아)으로 그려지고, `label`이 있으면 그 낱말이 축 옆에 놓인다. 구·반구와 다른 입체 안에 넣은 입체에는 쓸 수 없다(`SOLID_AXIS_UNSUPPORTED:<kind>`·`:NESTED`), 형식이 틀리면 `SOLID_AXIS_INVALID`. 높이 치수(`dims:[{height:true}]`)와 함께 써도 된다(점선 높이선은 그대로). 원문 그림에 "회전축"이 적혀 있으면 `dims`의 `l` 같은 기호 라벨을 지어 붙이지 말고 이것을 쓴다.
- **`labels`(입체 위의 낱말)**: `[{"text":"모선","at":...}]`(6개까지)는 **원문 그림에 적힌 낱말**을 도형의 한 부분에 붙인다(원문에 없는 글자를 지어 붙이지 않는다). `text`는 한글·영문·숫자·공백·괄호·가운뎃점 12자까지이고 TeX는 쓸 수 없다(`SOLID_LABEL_TEXT_INVALID`). `at`은 다섯 가지다: 꼭짓점 이름이나 참조 문자열(`"A"`, `"#apex"`: 꼭짓점의 열린 쪽), `{"axis":true}`(회전체의 축: 축이 그려진다), `{"slant":true}`(원뿔·원뿔대의 모선), `{"edge":["#b1","#b2"]}`(그려진 모서리나 `segments`의 선분), `{"face":"side0"}`(**보이는** 면의 안쪽: 면 이름은 `highlights`와 같다). 입체가 여럿이면 `axis`·`slant`·`face`에 `"solid":"s1"`을 더하고, 한 대상에 낱말은 하나다(`SOLID_LABEL_DUPLICATE_TARGET`). 숨은 면은 `SOLID_LABEL_FACE_HIDDEN`, 자른 입체의 면은 `SOLID_LABEL_FACE_UNSUPPORTED:CUT`, 그려지지 않은 모서리는 `SOLID_LABEL_EDGE_NOT_DRAWN`, 없는 대상은 `SOLID_LABEL_AT_UNKNOWN`·`SOLID_LABEL_FACE_UNKNOWN`·`SOLID_LABEL_AXIS_UNSUPPORTED`·`SOLID_LABEL_SLANT_UNSUPPORTED`, 형식은 `SOLID_LABELS_INVALID`·`SOLID_LABEL_AT_INVALID`, 전개도에는 쓸 수 없다(`SOLID_LABELS_UNSUPPORTED:NET`). 꼭짓점·축·모서리·모선의 낱말은 자리가 없으면 지시선으로 대상(꼭짓점, 선분의 가운데)에 이어지고, 면의 낱말은 면 안에 들어갈 자리가 없으면 `SOLID_LABELS_NO_ROOM`이다. 관측기는 낱말의 글자·대상·자리를 plan에서 다시 구해 확인한다.
- **아무것도 쓰지 않은 그림**: 이름·길이·낱말이 하나도 없어도, 그림에 **강조**(면 칠, `segments`, `section`, `marks`, 절단, 회전축; 전개도는 면 칠·변 강조·직각 표시·제외 원)가 있거나 `solidCaption`이 있거나 합성 격자(`composite-panels-v1`)의 패널이면 통과한다(패널 캡션이 글자를 맡는다: 그 패널은 글자가 없어도 공개 검사의 "글자 준비" 항목을 면제받고 글꼴 로드는 그대로 확인한다). 강조도 캡션도 없는 맨 그림만 `SOLID_FIGURE_NEEDS_A_LABEL`이다. 원문 그림에 꼭짓점 번호나 `a`·`h` 같은 기호가 없으면 그것을 지어 붙이지 말고 강조만으로 보인다.

**전개도 `net`**(입체 그림과 같은 plan에 `solids`와 함께 쓰지 않는다).

```json
{"capability":"solid-figure-v1","net":{"solid":{"kind":"PRISM","base":{"kind":"RECT","width":2,"depth":3},"height":4,"names":"........"},
 "root":"side0","joins":[["side0","side1"],["side1","side2"],["side2","side3"],["side1","top"],["side3","bottom"]],
 "corners":{"side0":["B","C","N","A"],"side1":["C","D","K","N"],"top":["M","N","K","L"]}}, ...}
```

- 각기둥·각뿔·각뿔대의 면 이름은 `bottom`, `top`(각뿔은 없다), `side0`, `side1`, ...(`side i`는 밑면의 i번째 모서리 위에 선 옆면)이다. `root`는 처음 놓는 면, `joins`는 `[이미 놓인 면, 새로 펼칠 면]`의 목록으로 모든 면을 잇는 나무(면 수 - 1개)여야 하고 서로 이웃한 면만 이을 수 있다. 엔진이 공유한 모서리를 따라 접힘 반대 방향으로 펼치고, 겹치면 `SOLID_NET_FACES_OVERLAP`으로 거절한다. 접는 모서리(`joins`)는 점선, 바깥 둘레는 실선이다.
- `corners`는 면마다 꼭짓점 이름을 따로 줄 때(문제의 전개도가 모든 점에 서로 다른 글자를 붙인 경우) 쓴다. 한 면의 이름은 그 면의 순환 순서대로 쓴다: 옆면 `[밑 i, 밑 i+1, 위 i+1, 위 i]`, 위 밑면 `[위 0, 위 1, ...]`, 아래 밑면과 각뿔의 밑면은 그 역순(밑면이 반시계일 때), 각뿔의 옆면 `[밑 i, 밑 i+1, 꼭짓점]`. 이름 개수가 맞지 않으면 `SOLID_NAMES_INVALID`이다. 전개도에서 한 점에 겹치는 같은 이름은 한 번만 쓴다. 생략하면 입체의 꼭짓점 이름을 쓴다.
- `dims:[{face,edge,label?}]`는 면의 `edge`번째 변(0부터, 그 면의 순환 순서) 옆에 길이를 쓴다.
- **전개도에서 면 칠하기·모서리 강조**(다면체 전개도만): `net.highlights:[{"face":"side2","fill":"LIGHT"}]`는 면 이름의 면 전체를 연하게 칠한다(`fill`은 `LIGHT`(기본)·`MEDIUM`, 한 면에 한 번, 선과 이름 아래). `net.segments`는 변 하나를 굵게 강조한다: `{"face":"side0","edge":0}`(그 면의 `edge`번째 변, `dims`와 같은 번호) 또는 문제의 전개도에 쓴 꼭짓점 이름 두 개 `{"from":"B","to":"C"}`; `role`은 `ACCENT`(기본, 빨강) 또는 `REF`(굵은 검정). 접는 모서리를 강조해도 점선은 그대로다. 접는 모서리는 이웃한 두 면이 한 선으로 그리므로 같은 선을 두 면에서 쓰면 중복(`SOLID_NET_SEGMENT_DUPLICATE`)이고, 이름 쌍이 전개도의 서로 다른 두 변에 나타나면 `SOLID_NET_EDGE_AMBIGUOUS`이니 `face`+`edge`로 쓴다. 원기둥·원뿔 전개도에는 쓸 수 없다(`SOLID_NET_EMPHASIS_UNSUPPORTED`). **면의 대각선**(한 면 위의 두 꼭짓점을 잇는 선분, 전개도에 원래 그어져 있는 NL 같은 선)도 `net.segments`로 강조한다: `{"face":"top","diagonal":[1,3],"role":"REF"}`는 그 면의 1번·3번 꼭짓점(그 면의 순환 순서, `dims`의 `edge`와 같은 번호)을 잇는 선분을 굵게(`ACCENT` 빨강, `REF` 검정) **새로 그린다**. 이웃한 꼭짓점(`[0,1]` 같은 변)이면 대각선이 아니라 `SOLID_NET_SEGMENT_INVALID`이고, 같은 대각선을 두 번 쓰면 `SOLID_NET_SEGMENT_DUPLICATE`이다. 이름으로도 쓸 수 있다: `{"from":"N","to":"L"}`은 두 이름이 이은 변이 없을 때 한 면의 서로 이웃하지 않은 두 꼭짓점의 이름이면 그 면의 대각선이다(어느 면에도 없으면 `SOLID_NET_EDGE_UNKNOWN`, 전개도의 서로 다른 두 자리에 있으면 `SOLID_NET_EDGE_AMBIGUOUS`). 예: 정육면체 전개도에서 모서리 BC와 평행한 면을 보일 때 `"highlights":[{"face":"side2"},{"face":"top"}],"segments":[{"from":"B","to":"C"}]`.
- **전개도의 면 넓이 라벨 `net.faceLabels`**: `[{"face":"top"},{"face":"bottom","text":"6"},{"face":"side1","text":"S"}]`는 나열한 면의 **가운데**(면 안에 온전히 들어가는 자리)에 라벨 하나씩을 쓴다. 면 이름은 `net.highlights`와 같고(원기둥 전개도는 `rect`·`bottom`·`top`, 원뿔 전개도는 `sector`·`base`), `text`를 생략하면 그 면의 넓이를 정확한 값과 `unit`의 제곱(`6\,\mathrm{cm}^2`)으로 쓴다. 숫자 `text`는 그 면의 넓이와 같아야 하고(다르면 `SOLID_FACE_LABEL_VALUE_MISMATCH`), 문자·식(`S`, `2\pi r h`)은 기호 라벨이다(`text`는 `dims`의 `label`과 같은 글자만, 24자까지). 한 면에 한 번, 짧은 정확한 꼴이 없는 넓이는 `SOLID_FACE_LABEL_NOT_EXPRESSIBLE`이니 `text`로 쓴다. **면 번호·면 이름(면 기호)**: `text`에 원문자 한 글자(①~⑳), 원 한글(㉠~㉭, ㉮~㉻), 한글 한 글자(가~힣, ㄱ~ㅎ) 또는 그것을 괄호로 싼 것((가), (ㄴ))을 쓰면 넓이와 상관없는 번호·이름 라벨이 된다(넓이 값은 검사하지 않고 글자와 "숫자 아님" 표시만 읽어 확인한다; 괄호 숫자 `(3)`처럼 ASCII만인 것은 지금까지처럼 TeX 기호다). 면 기호는 글자 크기에 맞춘 작은 상자로 놓이므로 좁은 삼각형 면(육각뿔 전개도의 옆면)에도 들어가지만, 면 안에 온전히 들어갈 자리가 없으면 `SOLID_LABELS_NO_ROOM`이다. 원문 전개도에 번호가 없으면 면을 센 번호를 ①부터 차례로 쓴다. 마주 보는 면 표시는 지원하지 않는다. **정답 값을 그림에 쓰지 않는다**: 풀이가 구하는 넓이는 기호(`S`)나 식으로 두고, 문제가 준 값에서 나오는 넓이만 숫자로 쓴다.
- **전개도의 직각 표시 `net.rightAngles`**(다면체 전개도만): `[{"face":"top","corner":0}]`은 그 면의 `corner`번째 꼭짓점(0부터, 그 면의 순환 순서 = 밖에서 보아 반시계 방향이라 아래 밑면은 위 밑면과 반대로 돈다)에 면 안쪽으로 작은 직각 표시(정사각형)를 그린다. 그 꼭짓점에서 만나는 두 변이 실제로 수직이어야 하고(아니면 `SOLID_NET_RIGHT_ANGLE_NOT_RIGHT:<면>:<꼭짓점>:right_at=<그 면의 직각 꼭짓점들>`이 직각인 꼭짓점을 알려 준다), 6개까지, 같은 꼭짓점에 한 번이다. 원기둥·원뿔 전개도에는 없다(`SOLID_NET_RIGHT_ANGLE_UNSUPPORTED`).
- **전개도 변 라벨 `net.edgeLabels`**(다면체 전개도만): `[{"face":"side0","edge":0,"text":"밑변"}]`(10개까지)는 면의 `edge`번째 변(0부터, 그 면의 순환 순서) 옆에 라벨을 쓴다. `net.dims`와 같은 자리·번호(`dims`가 `dim-1`, `dim-2`..., 이어서 `edgeLabels`)이고, `text`를 생략하면 그 변의 정확한 길이와 `unit`, TeX `text`는 숫자(변 길이와 같아야 한다: `SOLID_DIM_VALUE_MISMATCH`)나 기호(`a`), **한글이 든 `text`는 변의 이름만 붙이는 낱말**(12자까지, `밑변`, `높이`: 길이는 검사하지 않고 글자와 자리를 확인한다)이다. 형식·개수·낱말이 틀리면 `SOLID_EDGE_LABEL_INVALID`, 없는 면은 `SOLID_NET_FACE_UNKNOWN`, 원기둥·원뿔 전개도에는 쓸 수 없다(`SOLID_EDGE_LABEL_UNSUPPORTED:<kind>`: `dims`의 `part`를 쓴다). 길이와 직각 표시를 함께 쓰는 예(밑면이 직각삼각형 6·8·10, 높이 10인 삼각기둥): `"dims":[{"face":"side0","edge":0},{"face":"side1","edge":2},{"face":"side2","edge":0},{"face":"side0","edge":3}],"rightAngles":[{"face":"top","corner":0},{"face":"bottom","corner":2}]`.
- **전개도에서 제외하는 원 `net.excluded`**(원기둥·원뿔 전개도): `["bottom","top"]`(원기둥) 또는 `["base"]`(원뿔)은 겉면에 들어가지 않는 원을 **점선·회색**으로 그린다(두 반구를 붙여 만든 입체의 원기둥 부분, 뚜껑 없는 원뿔 모양 모자). 나열한 부분만 제외로 그려지고 나머지는 그대로다. 다면체 전개도에는 없다(`SOLID_NET_EXCLUDED_UNSUPPORTED:POLYHEDRON`).
- 원기둥: `{"kind":"CYLINDER","radius":3,"height":5,"dims":[{"part":"rect-width","label":"2\\pi r"},{"part":"rect-height","label":"h"},{"part":"radius-top"}]}`: 직사각형(가로 = 밑면의 둘레)과 위·아래의 합동인 원이 직사각형에 접한다.
- 원뿔: `{"kind":"CONE","radius":8,"slant":20,"dims":[{"part":"slant"},{"part":"arc"},{"part":"radius"},{"part":"angle"}]}`(`slant` 대신 `height`도 된다): 부채꼴(반지름 = 모선, 중심각 = 360 x r / l)과 호의 가운데에 접한 밑면의 원. `arc`는 호의 길이 2πr, `angle`은 중심각이다.

**독립 관측기**(`solid_figure_observer.py`)는 plan만으로 3차원 모델을 다시 만들고(`cuts`로 잘린 입체도 `through` 점에서 평면·남는 쪽·새 꼭짓점·단면을 따로 다시 계산하고, 구의 `cut`은 조각을 점 소속 판정으로 다시 정해 단면·테두리 호·모서리·윤곽 조각·반지름 선·점선 구간을 따로 확인한다) 최종 SVG를 확인한다: 모든 모서리 조각이 자기 깊이 검사(모든 면에 대해 보는 쪽으로 쏜 광선)와 같은 실선·점선이고 조각들이 모서리를 빈틈없이 덮는지, 모든 꼭짓점이 하나의 배율과 위치에 맞는지, 타원의 중심·축과 앞·뒤 반원의 보임, 옆 윤곽선이 타원에 접하는지(원뿔은 꼭짓점을 지나는지), **뒤집힌 그릇의 수면 타원·물이 찬 작은 그릇의 윤곽과 옆선**이 다시 계산한 값과 같은지, **내접한 입체가 주인의 축과 같은 축에 있고 주인 안에 들어가는지**, **직각·같은 길이·각도 표식**이 3차원 사실과 최종 SVG의 변 위에 놓였는지, 전개도의 면이 입체의 면과 합동이고(변의 길이 모두) 접는 변에서 이어져 서로 반대쪽에 놓이며 겹치지 않는지, **전개도 배치를 plan(`root`·`joins`)에서 다시 펼쳐** 그린 면과 맞는지, **칠한 면이 정확히 그 면의 다각형이고 선·이름 아래에 있는지, 강조한 변이 정확히 그 변이고 다른 변은 강조되지 않았는지, 강조한 면의 대각선이 정확히 그 면의 두 꼭짓점을 잇고 계획에 없는 대각선이 없는지, 여러 이름을 쓴 꼭짓점의 라벨이 그 이름들을 모두 쓰는지**, **세는 번호**가 plan에서 다시 만든 꼭짓점·모서리 목록과 1부터 빠짐없이 한 번씩 있고(원문자는 ①~⑳) 각 번호가 자기 꼭짓점·모서리 중점에 다른 대상보다 확실히 가까운지, 원기둥·원뿔 전개도의 둘레·호 길이·중심각, 길이 라벨의 값(TeX를 읽어 계산한 값과 비교)과 이름 라벨의 글자·자리, 라벨이 선이나 다른 라벨 위에 놓이지 않았는지.

**오류와 조치.**

| 코드 | 조치 |
|---|---|
| `SOLID_KIND_UNSUPPORTED`, `SOLID_NET_UNSUPPORTED`, `SOLID_ORIENTATION_UNSUPPORTED` | 지원하는 kind만 쓴다. 정다면체는 `REGULAR_POLYHEDRON`(정사면체·정팔면체·정십이면체·정이십면체)으로, 정육면체는 `PRISM`으로, 쌍뿔은 `BIPYRAMID`로 그린다. 그 밖의 다면체, 토러스, 원기둥·원뿔을 평면으로 자르거나 구를 중심을 지나지 않는 평면으로 자른 조각은 UNSUPPORTED(볼록 다면체를 평면으로 자르는 것은 `cuts`, 구를 중심을 지나는 평면으로 자르는 것은 `cut`). `orientation:"APEX_DOWN"`은 원뿔·원뿔대에만 쓴다 |
| `SOLID_NEST_INVALID`, `SOLID_NEST_UNKNOWN`, `SOLID_NEST_UNSUPPORTED`, `SOLID_NEST_DOES_NOT_FIT`, `SOLID_NEST_OVERLAP`, `SOLID_NEST_CHAIN`, `SOLID_BALLS_INVALID`, `SOLID_BALLS_UNSUPPORTED` | `inside`는 바로 앞의 원기둥 id이고, 안에 넣는 입체는 구·원뿔·원뿔대만, 주인의 반지름·높이 안에 들어가야 한다(구는 `centerZ`까지 높이 안에). 여러 개는 구뿐이고 서로 겹치면 `OVERLAP`. 원기둥의 `stack:{count,radius}`·`inside:[{kind:"SPHERE",radius,centerZ?}]`는 공 2~6개(`BALLS_INVALID`), 원기둥이 아니면 `BALLS_UNSUPPORTED`. 원기둥 안의 원기둥·연쇄는 UNSUPPORTED |
| `SOLID_MARKS_INVALID`, `SOLID_MARK_SLANT_UNSUPPORTED`, `SOLID_MARK_ID_INVALID`, `SOLID_MARK_UNKNOWN`, `SOLID_MARK_RAY_NOT_DRAWN`, `SOLID_MARK_SEGMENT_NOT_DRAWN`, `SOLID_MARK_NOT_RIGHT_ANGLE`, `SOLID_MARK_LENGTH_MISMATCH`, `SOLID_MARK_GROUP_AMBIGUOUS`, `SOLID_MARK_GROUP_ARC_COUNT`, `SOLID_MARK_GROUP_MISMATCH`, `SOLID_MARK_ANGLE_MISMATCH`, `SOLID_MARK_ANGLE_DEGENERATE` | 표식은 이름 붙인 점과 **그려진** 모서리·선분에만 쓴다. 직각은 실제 90°, 같은 길이 모둠은 실제 길이가 같아야 하고, 눈금 수가 같은 두 모둠은 만들 수 없다. 각 표식은 3차원 각(5°~175°)과 `value`가 0.5° 안에서 같아야 한다 |
| `SOLID_PARAM_INVALID`, `SOLID_BASE_INVALID`, `SOLID_BASE_NOT_SIMPLE`, `SOLID_BASE_NOT_CONVEX` | 매개변수는 양의 실수, 밑면은 스스로 교차하지 않는 점 8개 이하(각뿔·각뿔대는 볼록) |
| `SOLID_COUNT_INVALID` | 한 그림에 입체는 3개까지다. 5개를 나란히 보이는 문항(다면체 고르기)은 UNSUPPORTED이거나 나누어 그린다 |
| `SOLID_NAMES_INVALID`, `SOLID_NAME_DUPLICATE`, `SOLID_NAME_UNKNOWN` | 이름은 대문자 한 글자(뒤에 프라임 `′` 가능), 한 그림에서 한 번, 개수는 꼭짓점 수와 같다 |
| `SOLID_REGULAR_FACES_UNSUPPORTED`, `SOLID_REGULAR_GEOMETRY_INVALID` | `REGULAR_POLYHEDRON`의 `faces`는 4, 8, 12, 20이다(정육면체는 `PRISM`). `GEOMETRY_INVALID`는 엔진 내부 검사 실패이니 보고한다. 정다면체·쌍뿔의 전개도(`net`)는 `SOLID_NET_UNSUPPORTED:<kind>`, `cuts`는 쓸 수 없고(`SOLID_PARAM_INVALID`), `height` 치수는 `SOLID_DIMS_INVALID`(모서리 치수는 `edge`로 쓴다) |
| `SOLID_VREF_INVALID`, `SOLID_VREF_UNKNOWN`, `SOLID_VREF_AMBIGUOUS`, `SOLID_VREF_SOLID_UNKNOWN`, `SOLID_VREF_UNSUPPORTED` | 참조는 `#b<i>`·`#t<i>`·`#apex`·`#v<i>`(앞에 입체 id 가능)만이다. i는 그 고리의 꼭짓점 수 미만이고, `#t`는 각기둥·각뿔대에만, `#apex`는 각뿔에만 있다(없으면 `SOLID_VREF_UNKNOWN`). 입체가 여럿이고 참조가 둘 이상에 맞으면 `s2#b0`처럼 입체 id를 붙인다. 원기둥·원뿔·구와 `cuts`로 자른 입체는 참조를 쓸 수 없다(`SOLID_VREF_UNSUPPORTED:<kind>`) |
| `SOLID_DIM_SEGMENT_NOT_DRAWN`, `SOLID_DIMS_INVALID` | 길이를 쓸 선분은 그려진 모서리나 `segments`여야 한다. `height`는 각뿔·각뿔대·원기둥·원뿔에만, `slant`는 원뿔·원뿔대에만, `radius:"level"`은 그 입체에 `LEVEL` 단면이 있을 때만 |
| `SOLID_DIM_VALUE_MISMATCH` | 숫자 `label`이 그려진 길이와 다르다: 값을 고치거나 문자로 쓴다 |
| `SOLID_HIGHLIGHT_NOT_PLANAR`, `SOLID_HIGHLIGHT_EDGE_NOT_DRAWN` | 한 평면의 점들만, 변은 모두 그려진 선분으로 |
| `SOLID_HIGHLIGHT_INVALID`, `SOLID_HIGHLIGHT_FACE_UNKNOWN`, `SOLID_HIGHLIGHT_FACE_UNSUPPORTED`, `SOLID_HIGHLIGHT_FILL_INVALID` | `highlights` 항목은 `polygon` 또는 `face` 하나(`solid`·`fill`만 더함), 8개까지, 같은 면을 두 번 칠하지 않는다. 면 이름은 `bottom`·`top`·`side<i>`만(그 입체에 없는 이름은 UNKNOWN), 다면체가 여럿이면 `solid`를 쓴다. 자른 입체의 면·둥근 입체는 면 이름으로 칠할 수 없다. `fill`은 LIGHT·MEDIUM·WARM·GREEN·ROSE·VIOLET |
| `SOLID_SECTION_UNSUPPORTED`, `SOLID_SECTION_INVALID`, `SOLID_LEVEL_APEX_HIDDEN`, `SOLID_SECTION_FILL_INVALID`, `SOLID_SECTION_FILL_UNSUPPORTED` | 단면은 원기둥·원뿔·원뿔대의 `AXIAL`·`LEVEL`(`at`은 `"1/3"` 꼴 진분수)만. 뒤집힌 그릇에서 꼭짓점이 수면 타원 안으로 보일 만큼 낮은 수면은 그릴 수 없다. `fill`은 `LEVEL`에서 `BOTTOM`·`TOP`만이고 `APEX_DOWN` 그릇에는 쓰지 않는다(수면 아래가 이미 칠해진다) |
| `SOLID_LIQUID_REGION_SET_MISMATCH`, `SOLID_LIQUID_REGION_MISMATCH`, `SOLID_LIQUID_REGION_SOLID_MISMATCH`, `SOLID_VIS_ATTRIBUTE_INCONSISTENT`, `SOLID_DIM_LINE_MISMATCH` | 최종 SVG가 plan의 물·단면·길이선과 다르다: 엔진 결함이므로 보고한다 |
| `SOLID_NET_NOT_A_TREE`, `SOLID_NET_FACES_NOT_ADJACENT`, `SOLID_NET_FACES_OVERLAP`, `SOLID_NET_FACE_UNKNOWN` | `joins`는 면 수 - 1개, 이웃한 면만, 겹치지 않게 다시 펼친다 |
| `SOLID_SPHERE_CUT_INVALID`, `SOLID_SPHERE_CUT_KIND_UNSUPPORTED`, `SOLID_SPHERE_CUT_FACING_INVALID`, `SOLID_SPHERE_CUT_OFF_CENTRE`, `SOLID_SPHERE_CUT_EXPLODE_UNSUPPORTED`, `SOLID_SPHERE_CUT_UNSUPPORTED`, `SOLID_SPHERE_CUT_NEST_UNSUPPORTED`, `SOLID_SPHERE_CUT_RADIUS_HIDDEN` | `cut`은 `{kind,facing?}`만(`offset`은 0), `kind`는 HALF·QUARTER·OCTANT·THREE_QUARTERS·SEVEN_EIGHTHS, `facing`은 CUT·CURVED. 중심을 지나지 않는 평면은 OFF_CENTRE, `explode`는 두 `HALF` 입체로 대신하고, `SPHERE`가 아닌 입체나 `inside` 안의 구에는 쓸 수 없다. 반지름 치수는 보이는 반지름이 있어야 한다(`facing:"CUT"`) |
| `SOLID_COUNT_REQUEST_INVALID`, `SOLID_COUNT_FACES_UNSUPPORTED`, `SOLID_COUNT_UNSUPPORTED`, `SOLID_COUNT_NAMES_CONFLICT`, `SOLID_COUNT_TOO_MANY` | `count`는 `{vertices?,edges?}`(둘 중 하나는 `true`)만, 면 세기(`faces:true`)는 UNSUPPORTED, 원기둥·원뿔·구에는 쓸 수 없다. 꼭짓점 번호를 쓸 입체의 `names`는 `"........"`처럼 모두 `.`이어야 하고, 모서리는 20개를 넘으면(칠각기둥 이상) 번호를 붙일 수 없다 |
| `SOLID_NET_HIGHLIGHT_INVALID`, `SOLID_NET_SEGMENT_INVALID`, `SOLID_NET_SEGMENT_DUPLICATE`, `SOLID_NET_EDGE_UNKNOWN`, `SOLID_NET_EDGE_AMBIGUOUS`, `SOLID_NET_EMPHASIS_UNSUPPORTED` | `net.highlights`는 면 이름(`bottom`, `top`, `side0`...)과 `LIGHT`·`MEDIUM`, 면마다 한 번. `net.segments`는 `{face,edge}`(`edge`는 그 면의 변 번호), `{face,diagonal:[i,j]}`(그 면의 이웃하지 않은 두 꼭짓점), 또는 `{from,to}`(전개도에 쓴 이름 쌍이 한 변 또는 한 면의 대각선에만 나타나야 한다)와 `ACCENT`·`REF`, 같은 변·대각선을 두 번 쓰지 않는다. 원기둥·원뿔 전개도에는 쓸 수 없다 |
| `SOLID_FACE_LABEL_INVALID`, `SOLID_FACE_LABEL_VALUE_MISMATCH`, `SOLID_FACE_LABEL_NOT_EXPRESSIBLE` | `net.faceLabels`는 `[{face,text?}]`(`face`는 그 전개도의 면 이름, 한 면에 한 번)이고 `text`는 24자까지의 TeX이거나 면 기호 하나(①~⑳, ㉠~㉭, ㉮~㉻, 가~힣, ㄱ~ㅎ, 괄호로 싼 한글·숫자)다. 숫자 `text`는 그 면의 넓이와 같아야 하고, 넓이를 짧게 쓸 수 없으면 `text`에 기호를 쓴다. 면 안에 들어갈 자리가 없으면 `SOLID_LABELS_NO_ROOM`이다 |
| `SOLID_EDGE_LABEL_INVALID`, `SOLID_EDGE_LABEL_UNSUPPORTED` | `net.edgeLabels`는 `[{face,edge,text?}]` 10개까지(`edge`는 그 면의 변 번호), `text`는 TeX 숫자·기호이거나 한글 낱말 12자까지다. 원기둥·원뿔 전개도에는 쓸 수 없다 |
| `SOLID_NET_RIGHT_ANGLE_INVALID`, `SOLID_NET_RIGHT_ANGLE_NOT_RIGHT`, `SOLID_NET_RIGHT_ANGLE_UNSUPPORTED`, `SOLID_NET_RIGHT_ANGLE_TOO_SMALL` | `net.rightAngles`는 `[{face,corner}]`(6개까지, 같은 꼭짓점은 한 번)이고 그 꼭짓점의 두 변이 수직이어야 한다(오류가 `right_at=`으로 직각 꼭짓점을 알려 준다). 변이 너무 짧아 표시가 4px보다 작아지면 `TOO_SMALL` |
| `SOLID_NET_EXCLUDED_INVALID`, `SOLID_NET_EXCLUDED_UNSUPPORTED` | `net.excluded`는 원기둥 전개도의 `bottom`·`top`, 원뿔 전개도의 `base`만(한 번씩, 비어 있으면 안 된다). 다면체 전개도는 `UNSUPPORTED` |
| `SOLID_CUT_COUNT_INVALID`, `SOLID_CUT_INVALID`, `SOLID_CUT_VERTEX_UNKNOWN`, `SOLID_CUT_VERTEX_REF_UNSUPPORTED`, `SOLID_CUT_EDGE_UNKNOWN`, `SOLID_CUT_NOT_PLANAR`, `SOLID_CUT_DEGENERATE`, `SOLID_CUT_NO_EFFECT`, `SOLID_CUT_KEEP_AMBIGUOUS`, `SOLID_CUT_KEEP_INVALID`, `SOLID_CUT_NOT_CONVEX`, `SOLID_CUT_UNSUPPORTED`, `SOLID_NET_UNSUPPORTED:CUT`, `SOLID_COUNT_UNSUPPORTED:CUT` | `cuts`는 평면 1~2개, `through`는 서로 다른 모서리 위의 점 3~6개(`[모서리,"p/q",이름?]`, 0 < p/q < 1, 평면 위에 놓인 모서리의 점은 안 된다)이고 한 평면 위에 있어야 한다(`SOLID_CUT_NOT_PLANAR`; 한 직선 위이면 `SOLID_CUT_DEGENERATE`). 모서리는 그 시점 입체의 실제 모서리(면의 대각선이나 이미 잘려 나간 꼭짓점은 `SOLID_CUT_EDGE_UNKNOWN:<모서리>`). 평면이 입체의 면과 겹치거나 한쪽에 아무것도 남기지 않으면 `SOLID_CUT_NO_EFFECT`, 양쪽의 꼭짓점 수가 같으면 `keep`을 써야 한다(`SOLID_CUT_KEEP_AMBIGUOUS`; 평면 위의 꼭짓점을 `keep`으로 쓰면 `SOLID_CUT_KEEP_INVALID`). 오목한 밑면의 각기둥은 `SOLID_CUT_NOT_CONVEX`, 곡면 입체는 `SOLID_CUT_UNSUPPORTED:<kind>`, 전개도·세는 번호·높이 치수와는 함께 쓰지 않는다 |
| `SOLID_SEGMENTS_INVALID`, `SOLID_SOURCE_QUOTE_INVALID` | `segments`는 10개까지(그룹을 여러 패널로 나눈다), `sourceQuote`는 비지 않은 문자열 |
| `SOLID_FIGURE_NEEDS_A_LABEL` | 이름·길이·낱말도 없고 강조(면 칠·선분·단면·표식·절단·축)도 `solidCaption`도 없는 맨 그림이다: 강조나 `solidCaption`을 쓰거나 이름·길이·낱말을 하나 이상 쓴다(합성 격자의 패널은 패널 캡션이 있어 된다) |
| `SOLID_AXIS_INVALID`, `SOLID_AXIS_UNSUPPORTED`, `SOLID_LABELS_INVALID`, `SOLID_LABEL_TEXT_INVALID`, `SOLID_LABEL_AT_INVALID`, `SOLID_LABEL_AT_UNKNOWN`, `SOLID_LABEL_EDGE_NOT_DRAWN`, `SOLID_LABEL_FACE_UNKNOWN`, `SOLID_LABEL_FACE_HIDDEN`, `SOLID_LABEL_FACE_UNSUPPORTED`, `SOLID_LABEL_AXIS_UNSUPPORTED`, `SOLID_LABEL_SLANT_UNSUPPORTED`, `SOLID_LABEL_DUPLICATE_TARGET`, `SOLID_LABELS_UNSUPPORTED` | `axis`는 `true`나 `{label?}`만, 원기둥·원뿔·원뿔대(안에 넣은 입체는 불가)에만. `labels`는 `[{text,at}]` 6개까지, `text`는 한글·영문·숫자·공백·괄호·가운뎃점 12자(TeX 불가), `at`은 꼭짓점 이름·참조 또는 `{axis:true}`·`{slant:true}`·`{edge:[a,b]}`(그려진 모서리)·`{face:"side0"}`(보이는 면, 자른 입체 제외)이고 한 대상에 낱말 하나. 전개도에는 쓸 수 없다 |
| `SOLID_LABELS_NO_ROOM`, `SOLID_RENDERED_LAYOUT_FAIL` | 라벨이 놓일 자리가 없다: 라벨을 줄이거나(`names`의 일부를 `.`으로) 한 그림에 입체 수를 줄인다. 세는 번호는 자기 꼭짓점·모서리 중점에서 48px 안의 빈자리를 찾고, 자리를 못 찾은 번호는 다음 시도에서 먼저 놓는다(합성 격자의 좁은 패널에서도 모서리 번호 8개가 각각 자기 모서리 옆에 놓인다) |

**한계.** 한 투영(정사영)만 있다(앞면 실제 크기의 사투영이나 다른 시점은 없다). 내접은 원기둥 안의 구·원뿔·원뿔대 **하나**, 또는 **구 여러 개**(위 `stack`·`inside` 목록·`centerZ`)만 된다(구 안의 정육면체, 각뿔 안의 입체, 같은 원기둥 안의 원뿔·원뿔대 둘 이상이나 구와 원뿔의 혼합은 UNSUPPORTED: 바닥에 놓인 `inside` 입체는 겹쳐 그려진다). 정다면체·쌍뿔은 전개도·`cuts`·면 세기(`count.faces`: 뒤쪽 면에는 한 투영에서 세는 번호를 놓을 자리가 없다)가 없다. 면 번호가 아니라 면 칠(`highlights`)로 센다. (원기둥 안에 구가 쌓인 그림은 위 `stack`·`centerZ`로 그린다.) 구 안의 정육면체·각뿔 안의 입체는 안쪽 입체의 모서리가 바깥 입체에 가려지는 깊이 검사가 필요해 별도 설계다. 각도 표식에는 라벨을 쓰지 않고, 평행 표식은 없다(평행은 `segments`의 `REF`나 풀이 글로 나타낸다). 표식은 이름 붙인 꼭짓점 사이의 그려진 변에만 붙으므로, 원기둥·원뿔의 축과 이름 없는 반지름 사이의 직각은 표식으로 그리지 않는다(치수선으로 나타낸다). 각 모서리에 길이 라벨의 지시선이 없어 라벨이 들어갈 자리가 좁은 그림(작은 입체 여러 개)은 거절될 수 있다. 부피·겉넓이 계산 식은 그림이 아니라 풀이 글에 쓴다.
### 3-11. 중학교 통계·확률: 도수 그래프, 줄기와 잎, 상자그림, 산점도, 주사위 표, 수형도 (`stat-chart-figure-v1`)

문제 그림이 **자료를 보여 주는 그림**이고 풀이가 그 그림의 값을 읽거나 세는 문항에 쓴다. 좌표축 함수 그래프가 아니라 교과서 모양의 통계 그림이며, plan에는 **문제에 나온 자료만** 정확히 쓴다. 계급의 가운데 값, 다각형의 양 끝(도수 0인 계급), 상대도수, 사분위수, 잎의 정렬, 표에서 색칠할 칸, 경로 확률은 엔진이 계산하고 독립 관측기가 같은 plan에서 다시 계산해 최종 SVG와 대조한다. 판 전체 모양은 `{"capability":"stat-chart-figure-v1","chart":{"kind":...},"caption":...,"sourceConditions":...,"newVisualInformation":...}`다.

| kind | 쓰는 곳 | 필요한 자료 |
|---|---|---|
| `HISTOGRAM` | 도수분포 히스토그램(`polygon:true`이면 도수분포다각형을 겹쳐 그림) | `boundaries`, `series:[{frequencies}]` |
| `FREQUENCY_POLYGON` | 다각형만(상대도수 그래프, 두 집단 비교) | `boundaries`, `series` 1~2개(`name` 필수) |
| `STEM_LEAF` | 줄기와 잎 그림(두 집단이면 등 맞댄 그림) | `values` 또는 `groups` |
| `BOX_PLOT` | 상자그림 1~3개 | `values` 또는 `summary` |
| `SCATTER` | 산점도 | `points`, `xRange`, `yRange` |
| `DICE_TABLE` | 서로 다른 두 주사위의 6×6 표 | `highlight`(사건의 조건) |
| `TREE` | 확률 수형도, 경우를 나열하는 수형도 | `root.children` |

**히스토그램·다각형.** `boundaries`는 계급의 경계값 n+1개(문자열, 크기가 모두 같고 0 이상, 계급 12개 이하)이고 `frequencies`는 계급마다 정수 하나다. 상대도수 그래프는 도수를 주고 `"yKind":"RELATIVE"`로 쓰면 엔진이 총합으로 나누고, 상대도수가 문제에 직접 주어졌으면 `relativeFrequencies:["0.1","0.15",...]`(합이 정확히 1)로 쓴다. 도수의 합을 문제가 말하면 `total`로 적어 두면 엔진이 합과 대조한다. 가로축은 계급의 경계값에 눈금이 찍히고(0에서 시작하지 않으면 물결 표시와 O가 붙는다), 세로축 눈금은 엔진이 고른다. `xTitle`/`yTitle`은 짧은 한글(`"기록(회)"`, `"도수(명)"`, `"상대도수"`, 14자 이내)이다. `grid:true`는 점선 격자, `showValues:true`는 값을 막대·꼭짓점 위에 쓴다(풀이가 값을 읽는 그림에서만 쓴다; 값이 다각형 선·점에 닿으면 엔진이 그 값만 가까운 빈자리로 옮기고, 피할 자리가 없으면 `STAT_VALUE_LABEL_NO_ROOM`). `highlightClasses:[4]`는 계급(0부터)을 진하게 칠한다. 두 집단은 `FREQUENCY_POLYGON`에 `series:[{name:"A",...},{name:"B",...}]`를 쓰고 B는 점선으로 그려지며 범례가 붙는다(히스토그램은 한 집단만).

**풀이 그림의 표시(모두 선택).** 문제에 안 보이는 계급이나 풀이가 짚는 계급·점을 그림에 표시한다. 엔진이 자료로 검산하고 관측기가 최종 SVG에서 다시 확인하며, 묻는 값은 그림에 쓰지 않는다.
- **미상 계급**: 문제가 지우거나 찢어서 안 보이는 계급의 도수는 `frequencies`에서 `null`로 쓴다(`[1,5,8,null,null,5,2]`; 상대도수도 같다). 그 계급은 막대도 꼭짓점도 그리지 않고 다각형은 거기서 끊긴다. 지워진 계급의 합을 검산하려면 `total`(보이는 도수의 합 이상)을 쓴다. 도수에서 상대도수를 만들 때(`RELATIVE`)는 `total`이 꼭 필요하다(`STAT_UNKNOWN_NEEDS_TOTAL`).
- **복원 막대**: `restoredClasses:[2]`(막대 히스토그램만, `total` 필수)는 총합에서 복원한 막대를 점선 테두리로 그리고, 묻는 값이므로 그 값은 쓰지 않는다(`showRestoredValues:true`면 쓴다). `showValues`가 켜진 그림에서 특정 막대의 값만 빼려면 `hideValues:[1]`.
- **강조의 두 가지 진하기**: `highlightClasses`의 항목은 계급 번호, `{"class":3,"tone":2}`, 또는 한 묶음 `{"classes":[0,1,2],"tone":1}`이다(`tone` 1은 회색, 2는 더 진한 회색; 생략하면 1). 막대 히스토그램은 막대를 칠하고, 다각형만 있는 그림(`FREQUENCY_POLYGON`)은 그 계급에서 모든 집단의 꼭짓점에 표시한다. 미상 계급은 강조할 수 없다(`STAT_HIGHLIGHT_UNKNOWN_CLASS`).
- **다각형 점 강조**: `highlightPoints:[{"series":0,"class":4,"tone":1,"showValue":true}]`(`series`를 생략하면 0). tone 1은 점을 동그라미로, tone 2는 큰 점으로 표시하고 `showValue:true`는 그 점의 값을 옆에 쓴다(두 집단 그림에서도 된다; `showValues:true`와 함께 쓰면 거절). 다각형이 없는 막대 히스토그램에는 쓸 수 없다(`STAT_HIGHLIGHT_POINT_INVALID`).
- **계급 묶음의 합**: `classSums:[{"series":0,"from":0,"to":2,"label":"13","unit":"명"}]`은 가로축 눈금 아래에 계급 `from`~`to`를 묶는 괄호를 치고 합을 쓴다(둘째 집단의 괄호는 점선). `label`은 엔진이 센 정확한 합과 같아야 하고(`0.30`처럼 쓴 그대로 보인다) 생략하면 괄호만 그린다. 미상 계급이 들어 있으면 `"?"`만 쓸 수 있고, 숫자 label은 그 미상 계급이 모두 한 괄호에 들어 있고 `total`이 있어야 검산된다(`STAT_CLASS_SUM_UNKNOWN`). 풀이가 묻는 값이면 label을 쓰지 않거나 `"?"`로 둔다. 같은 집단의 괄호는 계급이 겹칠 수 없다.
- **미상 계급의 기호·문제가 준 묶음 합·끝점 값** (E30): ① `unknownLabels:[{"class":2,"label":"x"},{"class":4,"label":"2x"}]`(막대 히스토그램만)는 찢어져 안 보이는(`null`) 계급 자리에 **점선 윤곽**을 치고 그 안에 기호를 쓴다(윤곽 높이는 값이 아니라 자리 표시: 그림 높이의 0.4). 알려진 계급을 가리키면 `STAT_UNKNOWN_LABEL_CLASS_KNOWN`, 다각형·여러 개 중복·허용하지 않는 글자(영문자·숫자·`+ - = ( ) ?`, 10자 이하만; 원문이 이름을 주지 않았으면 `?`를 쓴다)는 `STAT_UNKNOWN_LABEL_UNSUPPORTED`/`STAT_UNKNOWN_LABEL_INVALID`다. 기호가 없는 미상 계급은 그대로 빈 자리다. ② `classSums`의 `label`이 숫자만이 아닌 글(`"6명"`, `"합계"`, 12자 이하의 한글·영문·숫자·`+ = . % ( ) -`)이면 **문제가 준 사실**로 쓴 그대로 적히고 `unit`은 못 쓴다(글에 단위를 넣는다). 미상 계급이 괄호 안팎에 섞여 엔진이 합을 셀 수 없을 때 이 꼴을 쓴다(숫자만 쓰면 `STAT_CLASS_SUM_UNKNOWN`). 엔진이 합을 셀 수 있으면(미상 계급이 모두 괄호 안이고 `total`이 있음) 글이 시작하는 숫자를 검산해 틀리면 `STAT_CLASS_SUM_LABEL_MISMATCH`다. ③ `showEndValues:true`(도수분포다각형 한 집단)는 양 끝의 도수 0 점에 값 `0`을 쓴다(`STAT_SHOW_END_VALUES_UNSUPPORTED`: 막대만 있거나 두 집단). 관측기는 plan만으로 윤곽의 계급·x 범위·높이·점선·기호와 중앙, 묶음 글, 끝 점 라벨의 주인·값·자리를 다시 계산해 최종 SVG와 대조한다(`SC_UNKNOWN_*`, `SC_END_VALUE_*`, `SC_CLASS_SUM_LABEL_VALUE`).

**줄기와 잎.** 원자료 값을 그대로 `values`에 쓴다(0~999, 줄기는 십의 자리, 잎은 일의 자리). 엔진이 오름차순으로 정렬하고 빈 줄기도 남기며 잎의 수를 센다. `unitText:"건"`, `title`을 쓰면 "1 | 4는 14건" 같은 설명이 붙는다(조사 은/는은 잎 숫자를 읽는 소리에 맞춰 엔진이 붙인다: 0 영·1 일·3 삼·6 육·7 칠·8 팔은 "은", 2 이·4 사·5 오·9 구는 "는"). `marks`로 잎을 동그라미로 강조한다: `{"median":true}`는 중앙값(짝수 개이면 가운데 두 값), `{"ranks":[4]}`(또는 한 개면 `{"rank":4}`)는 작은 쪽에서 4번째 값, 두 집단이면 `group`(0 또는 1)을 함께 쓴다. 동그라미는 한 그림에 16개까지, `ranks` 한 항목에 여러 순위를 쓸 수 있다. `rankLabels:"FROM_LARGEST"`(또는 `"FROM_SMALLEST"`)를 쓰면 동그라미 친 잎마다 큰(작은) 쪽부터 센 순번을 동그라미 위에 쓴다(`marks`가 있어야 한다; `STAT_STEM_RANK_LABELS_INVALID`). 큰 쪽에서 10번째까지 묶는 문항이면 `ranks`에 n-9~n번을 쓰고 `FROM_LARGEST`로 1~10을 단다.

**문자 잎과 순위 강조.** 문제가 잎을 값이 아니라 문자(`a`, `b`)로 주면 `values`에 `{"symbol":"a","stem":1,"order":3}`을 넣는다(`symbol`은 소문자 한 글자, `stem`은 줄기, `order`는 **그 줄기의 잎을 작은 순으로 늘어놓았을 때의 자리**(1부터), 숫자 잎이 `10,14,18`이고 `a`, `b`가 4와 8 사이면 `order` 3, 4). 엔진은 문자의 값을 짐작하거나 정하지 않고, 문제 그림의 순서 그대로 자리만 놓는다. 자리가 줄의 잎 수를 넘거나 겹치면 거절한다. 문자 잎도 순위에 세므로 `marks:[{"rank":10},{"rank":11}]`로 "작은 쪽 10번째·11번째 잎"(문자여도)을 동그라미로 강조할 수 있고, 관측기가 그림의 잎 순서를 직접 세어 그 잎에 동그라미가 붙었는지 확인한다. 문자 잎이 가운데에 끼면 중앙값은 숫자가 되지 못하므로 plan에도 값을 쓰지 않는다. `key`는 숫자 잎에서 골라 쓴다.

**계급 묶음.** `classGroups:[{"from":"5","to":"10","label":"3"}]`는 한 줄기 안의 값 구간 [from, to)에 드는 잎들을 아래쪽 괄호로 묶고 도수를 아래에 쓴다(`group`은 두 집단일 때). 구간은 한 줄기 줄 안에 있어야 한다(예: 5~10, 20~25, 10~20; 두 줄에 걸치면 거절). 도수는 엔진이 세며 `label`은 쓰지 않아도 되고, 쓰면 센 값과 같아야 한다(다르면 거절). 묶음이 있으면 줄 간격이 넓어진다. 문자 잎이 구간 안인지 밖인지 양옆 숫자 잎으로 정해지지 않으면(예: 4와 8 사이의 `a`를 5~10 계급에 세는 경우) 거절하니, 그런 줄은 묶지 말고 도수는 풀이 글에 쓴다.

**상자그림.** `values`(4개 이상)를 주면 교육과정 정의대로 중앙값, Q1(아래 절반의 중앙값), Q3(위 절반의 중앙값, 자료가 홀수 개이면 가운데 값은 양쪽에서 뺀다)을 엔진이 계산한다. 문제가 다섯 수치를 직접 주면 `summary:{min,q1,median,q3,max}`로 쓴다(작은 순서가 아니면 거절). `showValues:true`는 다섯 수를 상자 위에 쓴다(가까우면 `STAT_LABELS_TOO_CLOSE`).

**산점도.** `points`에는 그림에 찍힌 점을 **모두** 쓴다(이름 `name`은 문제가 이름 붙인 점만, 한 글자 대문자). `xRange`/`yRange`는 눈금 범위이며 양 끝이 `xStep`/`yStep`의 배수여야 하고 모든 점이 그 안에 있어야 한다. 범위가 0에서 시작하지 않으면 축에 물결 표시가 붙는다. `diagonal:true`는 y=x 직선을 점선으로 그려 "두 성적이 같은 학생"을 세게 한다. `labelEvery:2`는 눈금 숫자를 한 칸 걸러 쓴다. 이름 라벨이 격자선과 겹치는 곳은 격자선이 끊겨 그려진다.

**주사위 표.** `highlight`는 사건을 조건으로 쓴다. 가로(첫째 주사위)는 `a`, 세로(둘째 주사위)는 `b`다. `{"expr":"a+b","in":[2,7]}`, `{"expr":"a","cmp":"<=","value":2}`, `{"all":[...]}`, `{"any":[...]}`, `{"not":{...}}`로 쓰며 `expr`에는 정수, `a`, `b`, `+ - *`, 괄호만 쓴다(예: `b-2*a`). 엔진이 36칸 모두에 조건을 계산해 해당하는 칸만 칠하고 개수를 관측기가 다시 센다. 칸 안의 글자는 `cell`(`PAIR` (a,b), `SUM`, `PRODUCT`, `NONE`), `faces`(2~8, 기본 6), `colVar`/`rowVar`(기본 a, b)로 바꾼다.

**수형도.** `root:{"children":[{"label":"흰","p":"3/7","children":[{"label":"흰","p":"2/5"},{"label":"검","p":"3/5"}]},{"label":"검","p":"4/7","children":[...]}]}`. 한 마디의 가지는 2~5개, 깊이 3 이하, 끝 가지 12개 이하, 이름은 6자 이내다. 확률 `p`는 정확한 분수로 **모든 가지에 쓰거나 하나도 쓰지 않는다**(경우만 나열하는 수형도). 형제 가지의 확률 합은 정확히 1이어야 한다. `showPathProbability:true`는 각 끝에 `3/7×2/5=6/35`처럼 경로 확률의 곱을 쓴다. 확률은 세로 분수로만 쓰인다.

**오류와 한계.** 거절 코드: `STAT_CLASS_WIDTH_UNEQUAL`(계급 크기가 다름), `STAT_FREQUENCY_COUNT_MISMATCH`(도수 개수가 계급 수와 다름), `STAT_FREQUENCY_TOTAL_MISMATCH`(말한 총합이 합과 다름), `STAT_RELATIVE_SUM_NOT_ONE`, `STAT_UNKNOWN_NEEDS_TOTAL`(`null` 도수에서 상대도수를 만드는데 `total`이 없음), `STAT_HIGHLIGHT_INVALID`/`STAT_HIGHLIGHT_UNKNOWN_CLASS`/`STAT_HIGHLIGHT_POINT_INVALID`(강조의 모양·겹침·미상 계급·다각형 없음), `STAT_RESTORED_INVALID`/`STAT_RESTORED_UNSUPPORTED`(다각형이 겹친 그림이거나 막대 히스토그램이 아님)/`STAT_RESTORED_NEEDS_TOTAL`, `STAT_HIDE_VALUES_INVALID`, `STAT_CLASS_SUM_INVALID`/`STAT_CLASS_SUM_OVERLAP`/`STAT_CLASS_SUM_UNIT_INVALID`/`STAT_CLASS_SUM_LABEL_INVALID`/`STAT_CLASS_SUM_LABEL_MISMATCH`(label이 센 합과 다름)/`STAT_CLASS_SUM_UNKNOWN`(미상 계급의 합을 알 수 없음), `STAT_VALUE_LABEL_NO_ROOM`(값 라벨이 피할 자리가 없음), `STAT_STEM_MARK_INVALID`(순위가 범위 밖·겹침·`rank`/`ranks`/`median` 중 하나가 아님·동그라미 16개 초과), `STAT_STEM_SYMBOL_INVALID`(문자 잎의 모양이 틀림: 소문자 한 글자, `stem`, `order` 필요), `STAT_STEM_SYMBOL_DUPLICATE`(같은 문자를 두 번 씀), `STAT_STEM_SYMBOL_ORDER_CONFLICT`(문자 잎의 `order`가 줄의 잎 수를 넘거나 같은 자리를 두 번 씀), `STAT_STEM_CLASS_INVALID`/`STAT_STEM_CLASS_UNSUPPORTED`(구간이 두 줄 이상에 걸침)/`STAT_STEM_CLASS_EMPTY`(구간에 잎이 없음)/`STAT_STEM_CLASS_UNDETERMINED`(문자 잎이 구간 안인지 정해지지 않음)/`STAT_STEM_CLASS_OVERLAP`/`STAT_STEM_CLASS_COUNT_MISMATCH`(`label`이 센 도수와 다름), `STAT_BOX_NEEDS_FOUR_VALUES`, `STAT_BOX_SUMMARY_NOT_ORDERED`, `STAT_POINT_OUTSIDE_RANGE`, `STAT_RANGE_NOT_ON_STEP`, `STAT_DICE_EXPR_INVALID`(a, b 말고 다른 문자), `STAT_DICE_PREDICATE_INVALID`, `STAT_TREE_BRANCH_PROBABILITY_SUM`, `STAT_TREE_PROBABILITY_MIXED`. 그릴 자리가 없으면 `STAT_LABEL_OUT_OF_BOUNDS`/`STAT_LABELS_TOO_CLOSE`/`STAT_CHART_RENDERED_LAYOUT_FAIL`이니 제목을 줄이거나 계급을 줄이거나 `showValues`를 끈다. 원그래프, 범주형 막대그래프, 누적도수 그래프, 계급 크기가 다른 히스토그램은 지원하지 않으니 EXEMPT나 UNSUPPORTED를 쓴다(지워진 계급은 `null`로 쓴다). 이 그림은 문제에 이미 있는 그림을 다시 그리는 것이므로, 풀이에서 쓰는 값만 강조하고 정답을 그림에 쓰지 않는다.

### 3-12. 집합: 벤다이어그램 영역 색칠과 유한집합 대응도 (`set-diagram-figure-v1`)

풀이가 **집합의 영역 관계**를 보여 주거나 **유한집합 사이의 대응(화살표)**을 따라가야 할 때 쓴다. 좌표평면이 아니라 교과서 모양의 집합 그림이며, plan에는 문제가 정한 집합·원소·대응만 쓰고 원자 영역의 기하와 색칠 영역, 원소가 놓일 자리는 엔진이 계산한다. 독립 관측기가 같은 plan에서 영역과 집합식을 다시 계산해 최종 SVG의 색칠 경로를 표본점으로, 원소 라벨 상자를 그린 원으로, 화살표를 시작·끝 라벨 상자로 다시 확인한다.

```json
{"capability":"set-diagram-figure-v1",
 "diagram":{"kind":"VENN","sets":[{"id":"A"},{"id":"B"}],
            "elements":[{"text":"9","in":["A"]},{"text":"9","in":["A","B"]},{"text":"10","in":["B"]},{"text":"12","in":[]}],
            "shade":"(A∩B)∪(A∪B)^c"},
 "caption":"...","sourceConditions":[{"id":"c1","condition":"...","mappedTo":"diagram"}],"newVisualInformation":["..."]}
```

| kind | 쓰는 곳 | 필요한 자료 |
|---|---|---|
| `VENN` | 전체집합 U와 1~3개 집합의 벤다이어그램, 영역 색칠, 포함관계 | `sets`, `elements`(선택), `shade`(선택), `subset`(선택) |
| `MAPPING` | 두 집합 X, Y(또는 X→Y→Z)의 원소를 화살표로 잇는 대응도 | `columns`, `arrows`, `highlight`(선택) |
| `MEMBERSHIP_TABLE` | 유한집합 2~4개의 원소별 소속을 행·열 표로 정확히 표시(네 집합의 16개 영역을 원으로 그릴 수 없을 때) | `sets`, `elements` |

**벤다이어그램.** `sets`는 1~3개이며 각 항목은 `{"id":"A","name":"A"}`다(id는 U가 아닌 대문자 한 글자, name은 생략하면 id). `elements`는 그림에 실제로 쓸 유한 원소이고, `in`에는 그 원소가 속한 집합 id를 **모두** 적는다(어디에도 속하지 않으면 `[]`). 엔진은 `in`으로 원자 영역을 정하고 그 영역 안에 원소 글자를 놓는다. 원소 글자가 구간·부등식처럼 보이면(`1≤x≤3`, `2<x<5` 등) 거절하니 유한 원소만 쓴다. `shade`는 U와 집합 id로 쓴 집합식이며 합집합 `∪`, 교집합 `∩`, 차집합 `-`, 괄호, 오른쪽 위 여집합 `^c`(또는 `ᶜ`)를 지원한다(예: `"(A∩B)∪(A∪B)^c"`, `"A-B"`, `"(A∪B)^c"`). 색칠할 영역이 없으면 `SET_SHADE_EMPTY`다. 두 집합의 포함관계 B⊂A는 `"subset":["B","A"]`(안쪽, 바깥쪽)로 쓰며, B는 A 안에 완전히 들어가게 그려지고 B만 있는 영역은 비어 있다(그 영역에 원소를 두면 `SET_ELEMENT_REGION_EMPTY`).

**대응도.** `columns`는 2~3개이고 각 항목은 `{"id":"X","name":"X","elements":["1","2","3"]}`다. 열 id는 대문자+선택적 숫자(`X`, `Y`, `X2`)이고 이름은 생략하면 id다. 같은 집합에서 자기 자신으로 가는 함수는 열 두 개의 `name`을 같게 쓰고 id만 다르게 한다. 원소는 열마다 1~8개, 중복 없는 짧은 값이어야 한다. `arrows`는 `{"from":{"column":0,"element":0},"to":{"column":1,"element":1},"style":"SOLID"|"DASHED"}`이며 `column`·`element`는 0부터 세는 위치다. 화살표는 **이웃한 두 열 사이**를 어느 방향으로든 잇는다(X→Y와 Y→X를 한 그림에 같이 쓰면 함수와 그 역방향 대응을 대조할 수 있고, X→Y→Z 합성도 된다). 같은 쌍을 두 번 쓰면 `MAPPING_ARROW_DUPLICATE`, 멀리 떨어진 열을 이으면 `MAPPING_ARROW_DIRECTION_UNSUPPORTED`다. 한 원소에서 화살표가 둘 이상 나가도 되지만(함수가 아닌 대응) 그 사실을 caption에서 밝힌다. `highlight`는 `{"arrows":[0,2]}`로 화살표를 굵게, `{"elements":[{"column":1,"element":0}]}`로 원소 뒤에 옅은 바탕을 넣는다(합성 경로나 역함수 추적을 강조할 때).

**원소 소속 표(`MEMBERSHIP_TABLE`).** 유한한 전체집합의 원소가 2~4개 집합 각각에 속하는지를 원소마다 정확히 보여야 할 때 쓴다. 네 집합이면 겹친 원 16개 영역을 한 그림에서 읽을 수 없으므로, 이 표가 문제의 소속 관계를 그대로 드러내는 정확한 그림이다. `sets`는 2~4개이고 각 항목은 `{"id":"A","name":"A"}`(id는 U가 아닌 대문자 한 글자), `elements`는 1~12개이고 각 항목은 `{"text":"1","in":["A","D"]}`다. 엔진은 원소마다 한 행, 집합마다 한 열을 그리고 `in`에 적힌 칸에만 소속 표식을 찍는다. 표식은 엔진이 더하거나 빼지 않으며, 독립 관측기가 최종 SVG의 표 틀·구분선·행/열 라벨에서 각 칸의 소속을 다시 유도해 plan과 대조한다. 원소 글자는 서로 달라야 하고(`SET_ELEMENT_DUPLICATE`), 표에 없는 집합 id를 쓰면 `SET_ELEMENT_SET_UNKNOWN`이다. 예:
```json
{"capability":"set-diagram-figure-v1",
 "diagram":{"kind":"MEMBERSHIP_TABLE","sets":[{"id":"A"},{"id":"B"},{"id":"C"},{"id":"D"}],
            "elements":[{"text":"1","in":["A","D"]},{"text":"3","in":["A","B","C"]},{"text":"6","in":["C"]}]},
 "caption":"...","sourceConditions":[{"id":"c1","condition":"...","mappedTo":"diagram"}],"newVisualInformation":["..."]}
```

**오류와 한계.** 벤다이어그램 집합 4개 이상, 소속 표 집합 5개 이상, 열 4개 이상, 열당 원소 9개 이상, 벤다이어그램·소속 표 원소 13개 이상은 지원하지 않는다(`SET_COUNT_UNSUPPORTED`, `MAPPING_COLUMN_COUNT_UNSUPPORTED`, `MAPPING_TOO_MANY_ELEMENTS`, `SET_TOO_MANY_ELEMENTS`). 집합을 `{x|x≤10}` 같은 무한집합·구간 기호로 직접 쓰지 말고, 문제가 말한 유한 원소만 `elements`에 넣는다. 원소 글자가 영역에 들어갈 자리가 없으면 `SET_ELEMENT_NO_ROOM`/`SET_LABEL_NO_ROOM`, 집합 이름이 들어갈 자리가 없으면 `SET_LABEL_NO_ROOM`이니 원소 수나 집합 수를 줄인다. 대응도의 화살표가 다른 원소 글자를 가로지르면 `MAPPING_ARROW_BLOCKS_LABEL`, 원소 글자가 타원 밖으로 나가면 `MAPPING_ELEMENT_OUT_OF_OVAL`이다. 정답을 그림에 쓰지 말고 풀이에서 쓰는 값·영역·대응만 표시한다.

### 3-13. 삼각함수 일반형: 진폭·주기·평행이동, π 계수, 탄젠트 가지: `ratePi`, `phase`, `keyPoints`, `axisTickPi`

`y=a·sin(bx+c)+d`처럼 **b가 π의 유리수 배수이거나 c가 π의 배수·라디안인** 사인·코사인·탄젠트 그래프, 그리고 여러 주기를 한 그림에 보이는 풀이에 쓴다. 기본 한 주기·π 구간 문법(3-2, 3-7)은 그대로 두고 아래 필드만 더한다.

- `graphPlan.ratePi: "1/6"`: b=π/6처럼 **b에 π가 들 때** 쓴다. 이때 `coefficients`는 [a, d] 두 개다(a는 진폭, d는 평행이동). π가 들지 않는 b는 기존처럼 `coefficients` [a, b, d] 세 개로 쓴다. a와 b는 0이 아니어야 한다.
- `graphPlan.phasePi: "-1/6"` 또는 `graphPlan.phase: "1/2"`: c를 각각 **π의 유리수 배** 또는 **라디안**으로 쓴다(둘 중 하나만). 한 주기 그림(정의역 ALL_REALS)에서는 phase가 π의 배수여야 하고, 라디안 phase는 구간 그림에서만 된다.
- **주기:** 사인·코사인은 `2/|b|`(ratePi면 b=mπ이므로 x 축 단위로 `2/|m|`), 탄젠트는 `1/|b|`다. 주기는 엔진이 계산해 `T=...` 라벨로 쓰므로 plan에 쓰지 않는다.
- **구간:** `sourceDomain:{"kind":"INTERVAL","range":["0","8"],"states":["CLOSED","CLOSED"]}`는 x를 **보통 수 단위**(시간·개월·자연수)로 재는 구간이고, 이때는 `ratePi`가 있어야 한다. `{"kind":"INTERVAL_PI","rangePi":["0","6"]}`는 x를 **π 단위**로 재는 구간이고, 이때는 b에 π가 들면 안 되며 phase는 π의 배수여야 한다. 두 형식을 섞으면 거절된다. 주기는 1/4~12개까지 그린다.
- `graphPlan.keyPoints: true`: 구간 안의 **모든 극값과 중심선 교점**(사인·코사인)을 정확한 좌표로 계산해 작은 점으로 찍는다. phase가 π의 배수일 때만 된다. 점이 너무 많으면(60개 초과) 거절하니 구간을 줄인다.
- `graphPlan.axisTickPi: true`: π 단위 x축의 눈금 숫자를 `axisTickValues.x`에 적은 **π의 유리수 배수**로 쓴다(`"1/2"`→π/2, `"2"`→2π). 값은 0이 아니고 화면 안에 있어야 한다. 보통 수 축이면 이 필드를 쓰지 않고 `axisTickValues`에 그냥 수를 쓴다.
- `graphPlan.referenceLines`: 사인·코사인에서만 되고 수평선·기울어진 직선과의 교점 개수를 주장한다(3-7절과 같은 규칙). **탄젠트에는 쓸 수 없다.**
- 탄젠트를 구간에 그리면 **여러 가지**가 나오고, 구간 안의 모든 극(pole)을 x좌표 정확값으로 찾아 점선으로 긋는다. 극이 구간 끝과 겹치거나 구간 안에 하나도 없으면 거절된다.

```json
{"capability":"trigonometric-spike-v1","graphPlan":{"family":"trigonometric","function":"COS","ratePi":"1/2","coefficients":["1","0"],"phasePi":"0",
 "sourceDomain":{"kind":"INTERVAL","range":["0","8"],"states":["CLOSED","CLOSED"]},
 "referenceLines":[{"id":"h","y":"1/2","intersectionCount":4}],"keyPoints":true,
 "axisTickValues":{"x":["2","4","6"],"y":["1","-1"]}},
 "caption":"y=cos(πx/2)의 그래프는 주기 4마다 되풀이되고, 직선 y=1/2과 한 주기에 두 점씩 만난다."}
```

오류 코드: `TRIG_GRAMMAR_UNSUPPORTED`(ratePi와 계수 개수가 안 맞는다. ratePi면 [a,d], 아니면 [a,b,d]), `INVALID_TRIGONOMETRIC_RATE`/`TRIGONOMETRIC_COEFFICIENT_INVALID`/`INVALID_TRIGONOMETRIC_PHASE`(정확한 정수·분수 문자열이 아니다), `TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED`(a나 b가 0), `TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED`/`INVALID_TRIG_INTERVAL`(구간 형식·끝 상태·순서), `TRIG_INTERVAL_REQUIRES_RATE_PI`(보통 수 구간인데 b에 π가 없다), `TRIG_RATE_PI_REQUIRES_PLAIN_INTERVAL`(b에 π가 있는데 π 단위 구간을 썼다), `TRIG_INTERVAL_PI_PHASE_MUST_BE_PI`(π 단위 구간인데 라디안 phase), `TRIG_PHASE_RATIONAL_REQUIRES_INTERVAL`(한 주기 그림에 라디안 phase), `TRIG_KEY_POINTS_REQUIRE_SIN_COS`/`TRIG_KEY_POINTS_REQUIRE_RATIONAL_PHASE`/`TRIG_KEY_POINTS_TOO_MANY`/`INVALID_TRIG_KEY_POINTS`, `TRIG_TAN_REFERENCE_LINES_UNSUPPORTED`/`TRIG_TAN_REQUIRES_PI_PHASE`/`TRIG_TAN_POLE_AT_INTERVAL_END`/`TRIG_TAN_INTERVAL_NO_POLE`, `TRIG_TICK_PI_REQUIRES_PI_AXIS`/`INVALID_TRIG_TICK_PI_FLAG`/`INVALID_TRIG_AXIS_TICK_VALUES`/`TRIG_PI_TICK_VALUE_INVALID`/`TRIG_PI_TICK_OUTSIDE_VIEW`, `TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED`(1/4주기 미만·12주기 초과), `TRIG_LINE_INTERSECTION_COUNT_MISMATCH`/`TRIG_LINE_THROUGH_INTERVAL_END`(3-7절과 같다), `UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE`.

### 3-14. 그래프 위 보조 요소: `overlays` (직선·세로선·점·선분·축 보조선·다각형)

단일 곡선 그래프(다항·이차·삼차·사차, 구간별 다항, 구간별 일차, 유리, 무리, 절댓값, 지수, 로그, 삼각, exp-log pair) 위에 **둘째 요소**를 그릴 때 `graphPlan.overlays`를 쓴다. `referenceCurves`가 두 번째 *함수*를 그리는 것과 달리, `overlays`는 직선 하나, 세로선, 이름 있는 점, 점 사이 선분, 축까지의 점선 보조선, 다각형을 같은 계층에서 그린다. 모든 값은 정확한 정수·분수·`sqrt(...)` 문자열로 쓰고, 좌표는 엔진이 SymPy로 다시 계산한다.

**직선·세로선.** `lines:[{"id":"g","slope":"-2","intercept":"0"}]`는 `y=slope*x+intercept`(slope 0 허용)를, `{"id":"k","x":"3"}`는 세로선 `x=3`을 그린다. 직선은 그림 영역에 맞춰 잘리고 식(`y=...`, `x=...`)이 직선 옆에 지시선으로 붙는다. 식 대신 다른 글자를 쓰려면 `label`을 준다(예: `"label":"x=k"`). 두 점을 잇는 *선분*은 직선이 아니므로 `segments`를 쓴다.

**점.** `points`의 한 점은 다음 중 **하나**로 쓴다.
- `{"id":"A","curveX":"0"}`: 그은 곡선 위의 점(엔진이 y를 정확히 계산). exp-log pair는 `"curve":"<curves의 id>"`를 함께 쓴다. 삼각함수의 `ratePi`(계수 `[A,C]`)·`phase` 문법에서도 된다(`a·f(rate·x+phase)+c`로 계산).
- `{"id":"P","intersect":["g","k"]}`: overlay 직선 두 개의 교점(평행·두 세로선은 거절).
- `{"id":"C","axis":"x","value":"-1-sqrt(7)"}`: 축 위의 점(`axis`는 `x` 또는 `y`).
- `{"id":"Q","x":"3","y":"-6"}`: 좌표를 직접 준 점.

점 id는 영문자로 시작하는 ASCII 12자 이내이고 `requiredPoints`의 id와 겹치면 안 된다. 그림에 보이는 이름은 지금처럼 `pointNames`로 정한다(오버레이 점도 키가 될 수 있다). 곡선 위 점은 그은 정의역 안, 모든 점은 이미 잡힌 그림 영역 안에 있어야 한다. 엔진은 잘못된 점을 담으려고 화면을 억지로 넓히지 않는다(자동 프레이밍은 작성자가 선언한 `domain`·`viewport` 안에서만 오버레이 점을 참고한다).

**선분·보조선.** `segments:[{"id":"AB","from":"A","to":"B","dashed":true}]`는 두 오버레이 점을 잇는다(`dashed` 생략 시 실선). `guides:[{"id":"PA","from":"P","axis":"BOTH"}]`는 점에서 x축·y축으로 내리는 **점선** 보조선이다(`axis`는 `x`, `y`, `BOTH`; 기본 점선). 수선의 발을 따로 찍으려면 `axis` 점을 하나 더 선언한다.

**다각형.** `polygons:[{"id":"T","points":["A","O","C"],"fill":"LIGHT"}]`는 꼭짓점 3~6개(모두 오버레이 점)의 단순 닫힌 다각형을 그린다. `fill`은 `LIGHT`(기본)·`MEDIUM`·`NONE`이고, 칠은 선 아래에 깔린다. 삼각형 OAB처럼 곡선 위 점과 원점으로 만드는 도형에 쓴다. 꼭짓점이 일직선이면 거절한다. 선택 `label`(40자 이내)·`labelKind`(`"MATH"` 기본 | `"TEXT"`)를 주면 그 글자를 다각형 **안 가장 넓은 곳**에 쓴다(예 `{"id":"R","points":["O","A","P","B"],"label":"b"}`, 한글 이름은 `"labelKind":"TEXT"`). 관측기가 라벨 상자의 네 모서리와 중심이 그 다각형 안에 있는지 확인한다(밖이면 `OVERLAY_POLYGON_LABEL_OUTSIDE`).

**점 좌표·선분 길이 라벨.** `points`의 한 점에 `"coordinates":true`를 쓰면 그 점 옆에 좌표를 쓴다. 이름이 있는 점(`pointNames`)은 `A(-6,-3)` 한 덩어리로, 이름 없는 점은 `(-6,-3)`으로 쓰고 점 이름은 따로 붙이지 않는다. 좌표는 정수만 된다(`OVERLAY_COORDINATES_REQUIRE_INTEGERS:<id>`). `"unnamed":true`는 이름 글자가 없는 점(원문의 이름 없는 교점)이다. `segments`의 한 선분에 `"length":true`를 쓰면 엔진이 두 끝점에서 정확한 길이(정수 또는 `p*sqrt(q)`)를 계산해 선분 옆에 쓴다(그 밖의 길이는 `OVERLAY_SEGMENT_LENGTH_UNSUPPORTED:<id>`). 점·선분의 `"labelDirection"`(`N NE E SE S SW W NW`)은 라벨을 먼저 시도할 쪽 힌트일 뿐 자리는 엔진이 정한다(`OVERLAY_LABEL_DIRECTION_INVALID:<id>`; 라벨이 없는 요소에는 쓰지 못한다). 관측기가 최종 SVG에서 글자(글리프)를 읽어 좌표·길이를 다시 계산한 값과 대조하고, 라벨이 자기 점·선분에 가장 가까운지(옮겨졌으면 지시선이 그 위에서 시작해 라벨에서 끝나는지)까지 확인한다: `OVERLAY_COORDINATES_LABEL_TEXT_MISMATCH`, `OVERLAY_COORDINATES_LABEL_AMBIGUOUS_OWNER`, `OVERLAY_SEGMENT_LENGTH_LABEL_TEXT_MISMATCH`, `OVERLAY_SEGMENT_LENGTH_LABEL_NOT_NEAR_OWNER`, `OVERLAY_SEGMENT_LENGTH_LABEL_AMBIGUOUS_OWNER`, `OVERLAY_POINT_NAME_UNEXPECTED`.

**직선 식 라벨의 자리.** 직선 식 라벨은 먼저 기본 자리(직선의 끝 가까이)에 놓는다. 거기에 들어갈 곳이 없을 때만 같은 직선 위의 다른 자리를 찾는다(창 안 구간에서 테두리·축·다른 직선·점에서 먼 곳부터, 가까우면 직선 바로 옆, 멀면 직선 위에서 시작하는 지시선과 함께). 그래서 기울기가 큰 `y=ax`, `y=cx`처럼 원점 가까이에서 직선이 모이는 그림에서도 식이 들어간다. 이미 들어가던 그림의 라벨 자리는 바뀌지 않는다. 관측기는 식 라벨이 자기 직선의 가까이에 있고 다른 직선에 더 가깝지 않은지, 지시선이 있으면 그 직선 위에서 시작하는지 읽는다: `OVERLAY_LINE_LABEL_NOT_NEAR_OWNER:<id>`, `OVERLAY_LINE_LABEL_AMBIGUOUS_OWNER:<id>`, `OVERLAY_LINE_LEADER_NOT_ON_OWNER:<id>`, `OVERLAY_LINE_LEADER_NOT_ON_LABEL:<id>`.

**격자점: `overlays.latticePoints`.** 곡선 아래(또는 위)의 정수 좌표 점을 엔진이 정확히 세어 이름 없는 작은 점으로 그린다(plan당 하나, 점은 최대 40개, 열은 최대 12개). `{"region":"BELOW_CURVE","xRange":[1,7],"yMin":1,"strict":true,"counts":true}`: 열 `x=1..7`에서 `yMin`부터 곡선 **아래** 점(`strict` 기본 true는 곡선 위의 점을 뺀다, false면 곡선 위의 점도 넣는다)이다. `"region":"ABOVE_CURVE"`는 곡선 위 점을 `yMax`(필수, `yMin` 쓰지 못함)까지 센다. `exp-log-pair`는 `"curve":"<curve id>"`를 함께 쓴다. `"counts":true`는 열마다 점의 개수를 쓴다(x축 아래에 40 px 이상 자리가 있으면 각 열 아래 한 줄로, 없으면 열의 맨 위 점 옆에). 관측기가 같은 입력에서 정수 점을 다시 세어 그림의 점과 하나하나 대조하고(빠지거나 남는 점, 큰 점, 개수 글자, 열 소속) 어긋나면 FAIL이다. 거절 코드: `OVERLAY_LATTICE_INVALID`, `OVERLAY_LATTICE_REGION_INVALID`, `OVERLAY_LATTICE_RANGE_INVALID`, `OVERLAY_LATTICE_BOUND_INVALID`, `OVERLAY_LATTICE_TOO_MANY`, `OVERLAY_LATTICE_EMPTY`, `OVERLAY_LATTICE_POINT_COINCIDES:<x,y>`(이름 있는 점과 같은 자리), `OVERLAY_POINT_OUTSIDE_VIEWPORT:lattice`, `OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:lattice`, `OVERLAY_LATTICE_COLUMN_UNDEFINED:<x>`(그 열에서 곡선이 정의되지 않음). 관측기 코드: `OVERLAY_LATTICE_POINT_MISSING:<x,y>`, `OVERLAY_LATTICE_POINT_UNEXPECTED:<id>`, `OVERLAY_LATTICE_DOT_SIZE:<id>`, `OVERLAY_LATTICE_COUNT_LABEL_MISSING`, `OVERLAY_LATTICE_COUNT_LABEL_TEXT_MISMATCH`, `OVERLAY_LATTICE_COUNT_LABEL_NOT_IN_COLUMN`, `OVERLAY_LATTICE_COUNT_LABEL_AMBIGUOUS_OWNER`.

**표시 창: `graphPlan.displayWindow` (반비례 `y=k/x`).** 자동으로 잡는 창은 두 가지가 다 보이게 극을 가운데 두므로 원점 근처의 작은 도형(예: 변이 4인 정사각형)이 작아진다. 이때 `"displayWindow":[xmin,xmax,ymin,ymax]`로 보일 창을 직접 정하면 그 창이 그림의 틀이 된다(가로·세로 같은 눈금, 가로 448 px, 세로는 창의 비율대로이고 y 범위는 정수 픽셀 높이가 되도록 한 픽셀 미만만 넓어진다). 곡선은 창에서 잘리고 창 밖의 가지·점근선은 그리지 않는다. 눈금은 `axisTickValues`를 주지 않으면 1·2·5×10^k 간격으로 축마다 최대 8개를 자동으로 잡는다. 원점이 창 안에 있어야 하고(`DISPLAY_WINDOW_MUST_CONTAIN_ORIGIN`), 창이 너무 납작하거나(`DISPLAY_WINDOW_TOO_FLAT`, 세로가 160 px 미만) 너무 길거나(`DISPLAY_WINDOW_TOO_TALL`, 640 px 초과) 극이 창의 가장자리에 딱 걸리거나(`DISPLAY_WINDOW_POLE_ON_EDGE`) 곡선이 하나도 안 보이면(`DISPLAY_WINDOW_CURVE_NOT_VISIBLE`) 거절한다. 그 밖의 코드: `DISPLAY_WINDOW_INVALID`, `DISPLAY_WINDOW_FORBIDS_AXIS_SQUEEZE`, `DISPLAY_WINDOW_UNSUPPORTED_FAMILY`, `DISPLAY_WINDOW_REQUIRES_INVERSE_PROPORTION`, `REQUIRED_GRAPH_POINT_OUTSIDE_DISPLAY_WINDOW:<id>`, 창 밖의 오버레이 점은 `OVERLAY_POINT_OUTSIDE_VIEWPORT:<id>`(엔진은 창을 넓혀 주지 않는다). `formulaLabel`의 자리는 창에서 곡선 가까이(곡선에서 28~120 px) 다른 것들에서 가장 먼 빈 곳으로 정한다. 그 자리가 마땅치 않으면 `"formulaAt":[x,y]`(창 안의 좌표)로 직접 정한다(라벨은 그 근처에 놓이고, 관측기가 110 px 안인지 읽는다: `FORMULA_LABEL_NOT_AT_ANCHOR`; 코드 `FORMULA_AT_INVALID`, `FORMULA_AT_OUTSIDE_WINDOW`, `FORMULA_AT_REQUIRES_DISPLAY_WINDOW`, `FORMULA_AT_UNSUPPORTED_FAMILY`). 표시 창을 쓰면 직선 식 라벨도 처음부터 "자기 직선에 가장 가까운 자리, 아니면 지시선" 규칙으로 놓는다(좌표·길이·격자점 라벨을 쓸 때와 같다). 관측기는 창 자체(`DISPLAY_WINDOW_VIEWPORT_MISMATCH`)와, 정확한 곡선이 창 안에 만드는 가지가 그림에 있는지(`RATIONAL_WINDOW_BRANCH_MISSING:<left|right>`, `RATIONAL_WINDOW_BRANCH_UNEXPECTED:<left|right>`)를 계수에서 다시 계산해 대조한다.

**이름(한글 글자) 라벨: `overlays.names`.** 원문 그림이 직선·곡선 옆에 "토끼", "거북이"처럼 **이름을 글자로** 써 둔 경우에 쓴다(식 라벨 `label`은 영문·수식만 되고 한글은 `OVERLAY_LABEL_INVALID`다). `names:[{"id":"nT","text":"거북이","segment":"sT"},{"id":"nR","text":"토끼","curveX":"50","labelDirection":"N"}]`처럼 한 항목은 이름 `text`와 **자리 하나**를 쓴다: `segment`(overlay 선분 id, 선분 옆에 놓이고 멀어지면 지시선이 선분에서 이름까지 이어진다), `line`(overlay 직선 id), `curveX`(그은 곡선 위 x 값, 그 점 옆에 놓인다; exp-log pair는 `curve`도). `text`는 한글·영문·숫자·공백·괄호 1~10자(앞뒤 공백 없이)이고 수식이 아니라 글자로 쓰인다. `labelDirection`(`N NE E SE S SW W NW`)은 먼저 시도할 쪽 힌트다. 한 그림에 4개까지. 곡선 이름은 곡선에서 18 px 안, 이름 옆에 다른 선분·직선이 더 가깝지 않아야 한다. 거절 코드: `OVERLAY_NAME_INVALID:<id>`(항목 모양·자리가 하나가 아님), `OVERLAY_NAME_TEXT_INVALID:<id>`, `OVERLAY_NAME_TARGET_UNKNOWN:<id>`, `OVERLAY_NAME_OUTSIDE_VIEWPORT:<id>`(곡선 위 자리가 그림 밖), `OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:<id>`. 관측기는 이름 글자가 라벨 그룹에 그대로 있는지(수식 글리프가 아닌지), 선분·직선 이름은 그 선분·직선이 주인이고 가장 가깝거나 지시선이 그 위에서 시작하는지, 곡선 이름은 곡선 위 자리 가까이에서 그 곡선에 가장 가까운지 최종 SVG에서 읽는다: `OVERLAY_NAME_LABEL_MISSING`, `OVERLAY_NAME_LABEL_TEXT_MISMATCH`, `OVERLAY_NAME_LABEL_OWNER_MISMATCH`, `OVERLAY_NAME_LABEL_NOT_NEAR_OWNER`, `OVERLAY_NAME_LABEL_AMBIGUOUS_OWNER`, `OVERLAY_NAME_LEADER_NOT_ON_OWNER`, `OVERLAY_NAME_LEADER_NOT_ON_LABEL`, `OVERLAY_NAME_LABEL_NOT_AT_CURVE`, `OVERLAY_NAME_LABEL_NOT_NEAR_CURVE`.

**한도와 오류.** 직선 6, 점 8, 선분 6, 보조선 4, 다각형 2, 이름 4개까지다. 거절 코드: `OVERLAY_PLAN_INVALID`, `OVERLAY_TOO_MANY:<kind>`, `OVERLAY_ID_INVALID:<kind>`, `OVERLAY_ID_DUPLICATE:<id>`, `OVERLAY_POINT_ID_CONFLICT:<id>`, `OVERLAY_POINT_INVALID:<id>`, `OVERLAY_POINT_UNKNOWN:<id>`, `OVERLAY_POINT_NOT_ON_CURVE:<id>`, `OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:<id>`, `OVERLAY_POINT_OUTSIDE_VIEWPORT:<id>`, `OVERLAY_CURVE_REQUIRED:<id>`, `OVERLAY_CURVE_UNKNOWN:<id>`, `OVERLAY_LINE_INVALID:<id>`, `OVERLAY_LINE_PARALLEL:<id>`, `OVERLAY_LINE_OUTSIDE_VIEWPORT:<id>`, `OVERLAY_SEGMENT_INVALID:<id>`, `OVERLAY_SEGMENT_DEGENERATE:<id>`, `OVERLAY_GUIDE_INVALID:<id>`, `OVERLAY_POLYGON_INVALID:<id>`, `OVERLAY_POLYGON_DEGENERATE:<id>`, `OVERLAY_POLYGON_LABEL_INVALID:<id>`, `OVERLAY_POLYGON_LABEL_KIND_INVALID:<id>`, `OVERLAY_POLYGON_LABEL_KIND_WITHOUT_LABEL:<id>`, `OVERLAY_FILL_INVALID:<id>`, `OVERLAY_VALUE_INVALID:<id>`, `OVERLAY_LABEL_INVALID:<id>`, `OVERLAY_BASE_INVALID`. `OVERLAY_POINT_OUTSIDE_VIEWPORT`가 나면 점이 화면 밖이라는 뜻이니 `domain`/`viewport`를 넓히거나(같은 배율 유지) 그 점을 빼고, `OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN`이면 곡선이 그 x에서 정의되지 않거나 그은 정의역 밖이다.

**독립 검수.** 그래프 관측기가 같은 overlay 입력에서 모든 점·직선·선분·보조선·다각형·식 라벨을 다시 계산해 최종 SVG와 대조한다. 점을 옮기거나, 선을 지우거나, 없는 요소를 그리거나, 식 라벨을 빼면 FAIL이다. 오버레이는 풀이가 실제로 쓰는 요소만 그린다(문제에 없는 보조선·다각형으로 정답을 암시하지 않는다).

### 3-15. 불연속·혼합 조각함수: 조각별 열린·닫힌 끝, 점프, 고립점, 계단 (`piecewise-discontinuous-spike-v1`)

조각이 **서로 이어지지 않아도 되는** 한 함수를 그린다. 상수·일차·이차 조각을 섞을 수 있고, 경계에서 점프하거나 함수값이 따로 정해지며(고립점), 끝점이 열린·닫힌 점으로 표시된다. 계단함수도 이 capability로 쓴다. `capability:"piecewise-discontinuous-spike-v1"`, `graphPlan.family:"piecewise-discontinuous"`.

```json
{"capability":"piecewise-discontinuous-spike-v1","graphPlan":{"family":"piecewise-discontinuous",
 "pieces":[{"coefficients":["-1","-2","1"],"domain":[null,1],"end":"OPEN"},
           {"coefficients":["1","2","-1"],"domain":[1,null],"start":"OPEN"}],
 "jumpValues":[{"x":"1","y":"1"}],
 "requiredPoints":[{"id":"P","x":1,"y":1}],"axisTickValues":{"x":[],"y":[]}},
 "caption":"x=1에서 좌극한 -2, 우극한 2, 함수값 f(1)=1인 불연속함수의 그래프."}
```

- `pieces`는 왼쪽부터 1~6개다. 각 조각은 `{"coefficients":[상수, x, x²], "domain":[lo, hi], "start":"OPEN"|"CLOSED", "end":"OPEN"|"CLOSED"}`이고 계수는 3-4와 같은 정확한 문자열(정수·분수·`p+q*sqrt(r)`, 한 plan에 근호 하나)이다. 차수는 2 이하(일차식은 두 개, 상수는 한 개)다.
- `domain`의 두 끝은 정확한 값 또는 `null`이다. `null`은 무한 구간이며 **첫 조각의 왼쪽 끝과 마지막 조각의 오른쪽 끝에만** 쓸 수 있다. 그 끝은 그림 패널 끝까지 그려진다.
- `start`/`end`는 그 끝을 포함하는지다(기본 `CLOSED`). **조각은 자기 구간 위에만 그려지므로 점프한 두 조각 사이에 이어지는 선이 생기지 않는다.** 엔진이 열린 끝은 빈 점, 닫힌 끝은 채운 점으로 그린다. 저자는 점을 직접 쓰지 않는다.
- **경계의 함수값은 정확히 하나로 정해져야 한다.** 같은 x에서 두 조각이 만날 때 한쪽 끝이 `CLOSED`이면 그 값이 함수값이고, 양쪽이 모두 `OPEN`이면 `jumpValues`에 `{"x","y"}`를 써야 한다(없으면 `PIECEWISE_DISCONTINUITY_UNDECLARED`). 쓴 값이 닫힌 끝의 값과 다르면 `PIECEWISE_VALUE_CONFLICT`이고, 같은 x에서 양쪽이 모두 `CLOSED`이면 `PIECEWISE_DOMAIN_OVERLAP`이다. 조각이 겹쳐도 `PIECEWISE_DOMAIN_OVERLAP`이다.
- `jumpValues`는 **어느 조각도 정의되지 않은 x의 고립점** `f(a)=c`에도 쓴다(예: 위 예의 `P(1,1)`). 채운 점으로 그려진다. 최대 8개.
- **계단함수**는 `pieces` 대신 `"step":{"values":["1","2","1"],"xFrom":0,"xTo":3}`로 쓴다. `[xFrom,xTo]`를 같은 폭으로 나눠 i번째 값이 i번째 칸에 놓이고(왼쪽 닫힘·오른쪽 열림, 마지막 칸은 `xTo`에서 닫힘), 칸 수는 6 이하이다. `pieces`와 `step`을 함께 쓰면 `PIECEWISE_DISCONTINUOUS_SOURCE_INVALID`이다.
- **수평선** `referenceLines`(최대 3개)는 3-3과 같은 `{"id","y","intersectionX","labelIntersections"}`이다. `intersectionX`에는 함수 전체와의 교점 x를 **하나도 빠짐없이** 쓴다. 높이가 같은 고립점·경계값도 교점이고, **열린 끝은 교점이 아니다.** 조각 하나가 직선과 완전히 겹치면 `PIECEWISE_REFERENCE_LINE_CONTAINS_A_PIECE`, 목록이 엔진 계산과 다르면 `PIECEWISE_INTERSECTION_MISMATCH:<id>:engine finds N intersection(s)`이다.
- `requiredPoints`에는 **각 이차 조각의 꼭짓점이 그 조각 안쪽에 있으면 반드시** 넣는다(`PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS`). 점은 조각 위 또는 고립점의 값 위에 있어야 하고(`PIECEWISE_DISCONTINUOUS_REQUIRED_POINT_NOT_ON_CURVE`), 정수가 아닌 좌표는 `exactCoordinates`로 정확히 쓴다. 점 이름은 한 글자 대문자를 쓴다.
- `axisTickValues`는 눈금을 직접 정할 때만 쓴다. `functionName`(한 글자, y 제외)을 주면 곡선 곁에 `f(x)`가 쓰인다.
- 가로·세로 배율은 같고, 너무 좁으면 엔진이 세로를 최대 1/2까지 줄인다. 표시할 특징끼리 4px보다 가까우면 `PIECEWISE_DISCONTINUOUS_FEATURES_BELOW_RESOLUTION`, 그래도 폭이 모자라면 `PIECEWISE_DISCONTINUOUS_CURVE_TOO_NARROW`이다.

한계와 오류 코드(가짜 지원 없이 거절):
- 조각 7개 이상 `PIECEWISE_TOO_MANY_PIECES`, 잘못된 조각 `PIECEWISE_DISCONTINUOUS_PIECE_INVALID:<n>`, 계수 문법 오류 `PIECEWISE_DISCONTINUOUS_COEFFICIENT_INVALID`, 잘못된 끝 상태 `PIECEWISE_ENDPOINT_STATE_INVALID:<n>`, 계단 구간 오류 `STEP_INTERVAL_INVALID`, 알 수 없는 필드 `PIECEWISE_DISCONTINUOUS_FIELD_UNKNOWN:<field>`.
- **쓰지 않는 필드:** `formula`(불연속함수의 머리줄 식), `referenceCurves`(둘째 불연속 곡선), `domain`, `viewport`는 받지 않는다. 필요하면 caption에 식을 쓰고, 두 함수가 모두 필요하면 그림을 포기하거나 EXEMPT/UNSUPPORTED로 쓴다.
- 수직선, 세로선, 차수 3 이상 조각, 색칠 영역, 기울어진 기준선은 지원하지 않는다. UNSUPPORTED.

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

### 3-40. 서로 다른 비선형 곡선 세 개 이상을 한 그림에: `multi-curve-figure-v1`

한 문항의 그림이 **서로 다른 비선형 곡선 3개 이상**으로 둘러싸이거나 이루어질 때만 쓴다. 곡선 2개, 곡선 2개+직선 1개, 한 곡선의 조각(가지)은 이 기능의 대상이 아니며 기존 family(`referenceCurves`, `piecewise-*`)를 쓴다. 실제 예: 22 효천고 2학기 기말 고2 수학II q10의 `y=2-x^2`, `x=2-y^2`, `y=x^2-2`, `x=y^2-2` 네 포물선.

```json
{"capability":"multi-curve-figure-v1","graphPlan":{"family":"multi-curve","curves":[
  {"id":"top","kind":"Y_OF_X","coefficients":["2","0","-1"],"domain":["-1","1"],"label":"y=2-x^2"},
  {"id":"bottom","kind":"Y_OF_X","coefficients":["-2","0","1"],"domain":["-1","1"]},
  {"id":"right","kind":"X_OF_Y","coefficients":["2","0","-1"],"domain":["-1","1"],"branch":"BOTH"},
  {"id":"left","kind":"X_OF_Y","coefficients":["-2","0","1"],"domain":["-1","1"],"branch":"BOTH"}],
  "axisTickValues":{"x":["-1","1"],"y":["-1","1"]},
  "overlays":{"lines":[{"id":"sym1","slope":"1","intercept":"0"},{"id":"sym2","slope":"-1","intercept":"0"}]}},
 "caption":"위쪽 y=2-x^2, 오른쪽 x=2-y^2, 아래쪽 y=x^2-2, 왼쪽 x=y^2-2의 네 포물선으로 둘러싸인 영역이다."}
```

- `curves`는 3~6개다. 각 곡선은 `id`(영문 시작, 16자 이내), `kind`, `coefficients`(`[c0,c1,c2]`, x² 또는 y² 계수 `c2`는 0이 아님), `domain`(닫힌 구간의 두 끝)을 쓴다. 계수·끝은 정확한 정수·분수 문자열(또는 한 근호 `p+q*sqrt(r)`)이고 소수를 쓰지 않는다.
- `label`(선택)은 그 곡선 옆에 그릴 정확한 ASCII 수식 문자열이다(`y=2-x^2`, `x=2-y^2`). 기존 수식 라벨 장치로 그려지며, 쓸 수 없는 글자·TeX는 `MULTI_CURVE_LABEL_INVALID:<id>`로 거절된다. 원문 그림이 곡선의 식을 보여 주면 그 식을 그대로 쓴다.
- `kind:"Y_OF_X"`는 `y=c0+c1*x+c2*x^2`를 x 구간 위에 그린다. `kind:"X_OF_Y"`는 `x=c0+c1*y+c2*y^2`를 y 구간 위에 그리며, `branch`로 꼭짓점 위쪽(`POSITIVE`)·아래쪽(`NEGATIVE`)·둘 다(`BOTH`, 기본)를 고른다. 엔진은 이 가지들을 `y(x)` 식으로 정확히 바꿔 그리므로 옆으로 열린 포물선도 학생 화면에는 같은 곡선으로 보인다.
- 가로·세로 배율은 같고, 세로가 너무 길면 최대 1/2까지 줄인다. 좌표축과 눈금은 엔진이 그리며, `axisTickValues`로 눈금을 직접 정할 수 있다. 점 이름·곡선 식 라벨·눈금 라벨이 하나도 없으면 출판 글자 게이트가 막히므로, 다른 라벨이 없을 때는 정확한 눈금 값을 하나 이상 준다.
- `overlays`(선택)는 다른 그래프 계열과 같은 보조 요소 층이다. `lines`(직선 `y=slope*x+intercept`, 세로선 `x=a`), `points`, `segments`, `guides`, `polygons`를 쓸 수 있고, 모든 좌표는 계산된 그림 안에 있어야 한다(엔진이 화면을 몰래 넓히지 않는다). 원문 그림에 그려진 대칭선·보조선은 `overlays.lines`로 그대로 살린다.
- 엔진은 각 곡선·가지를 정확한 구간과 식으로 고정하고, 독립 관측기는 같은 계수에서 모든 가지를 다시 계산해 최종 SVG의 각 polyline(태그 `CURVE_<id>`, `CURVE_<id>_POS`/`_NEG`)이 그 곡선 위에 있는지, 자기 구간·가지를 벗어나지 않는지, 양 끝과 중간 호가 맞는지 확인한다. 하나라도 어긋나면 FAIL이다.
- 오류 코드: `MULTI_CURVE_COUNT_INVALID`(3개 미만·6개 초과), `MULTI_CURVE_FIELD_UNKNOWN:<field>`, `MULTI_CURVE_CURVE_INVALID:<id>`, `MULTI_CURVE_ID_INVALID`, `MULTI_CURVE_KIND_INVALID:<id>`, `MULTI_CURVE_COEFFICIENT_INVALID:<id>`, `MULTI_CURVE_NOT_QUADRATIC:<id>`, `MULTI_CURVE_DOMAIN_INVALID:<id>`, `MULTI_CURVE_BRANCH_INVALID:<id>`, `MULTI_CURVE_BRANCH_EMPTY:<id>`, `MULTI_CURVE_LABEL_INVALID:<id>`, `MULTI_CURVE_FRAME_DEGENERATE`, `MULTI_CURVE_TOO_NARROW`.


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

### 3-43. 두 집단 비교 통계 다각형: 도수·상대도수를 두 개의 꺾은선으로 (`FREQUENCY_POLYGON` 두 series)

두 집단(남학생·여학생, A반·B반, 두 학교)의 **같은 계급** 자료를 한 그림에서 비교할 때 쓴다. 3-11절의 `stat-chart-figure-v1`에서 `kind`를 `FREQUENCY_POLYGON`으로 두고 `series`를 두 개 쓰는 형태이며, 히스토그램 막대 없이 꺾은선 두 개와 범례만 그린다. 자료값은 문제에 나온 그대로 쓰고, 비교해서 계산한 정답(차이·비율)은 그림에 쓰지 않는다.

```json
{"capability":"stat-chart-figure-v1",
 "chart":{"kind":"FREQUENCY_POLYGON","yKind":"RELATIVE",
  "boundaries":["30","40","50","60","70","80","90"],
  "series":[{"name":"남학생","relativeFrequencies":["0.10","0.25","0.30","0.20","0.10","0.05"]},
            {"name":"여학생","relativeFrequencies":["0.05","0.10","0.15","0.25","0.35","0.10"]}],
  "xTitle":"시간(분)","yTitle":"상대도수","grid":true},
 "caption":"남학생 300명과 여학생 200명의 상대도수 분포를 두 개의 꺾은선으로 함께 나타낸 그림",
 "sourceConditions":[{"id":"c1","condition":"...","mappedTo":"chart.boundaries"}],
 "newVisualInformation":["..."]}
```

- 이 capability의 plan은 `capability`, `chart`, `caption`, `sourceConditions`, `newVisualInformation` **다섯 키만** 받는다. 다른 키(`sourceQuote` 등)를 넣으면 `STAT_CHART_PLAN_INVALID`이므로 넣지 않는다.
- `series`는 1~2개다. 두 집단이면 각 series에 `name`이 **반드시** 있어야 하고(14자 이내, 서로 달라야 함, `STAT_SERIES_NAME_REQUIRED`·`STAT_SERIES_INVALID`), 첫 series는 실선·둘째는 점선으로 그려지고 위쪽에 범례가 붙는다. 범례 자리가 좁으면 이름을 짧게(`"한별네"`) 쓰고 두 집단의 정식 이름은 `caption`에 쓴다.
- **도수 비교**는 계급마다 정수 `frequencies`를 쓴다. `total`은 한 series일 때만 받으므로(`STAT_SERIES_INVALID`) 두 집단의 합계 대조는 그림이 아니라 plan의 `sourceConditions`에 적는다. 히스토그램(`HISTOGRAM`)은 한 집단만 되고(`STAT_HISTOGRAM_ONE_SERIES`), 두 집단은 반드시 `FREQUENCY_POLYGON`이다.
- **상대도수 비교**는 계급마다 정확한 문자열 `relativeFrequencies`를 쓰고 **각 series의 합이 정확히 1**이어야 한다(아니면 `STAT_RELATIVE_SUM_NOT_ONE`). `yKind`를 생략하면 상대도수가 든 series가 있을 때 `RELATIVE`로 본다. 한 그림에서 `frequencies`와 `relativeFrequencies`를 섞으면 `STAT_SERIES_INVALID`이며, 주어진 도수를 총합으로 나누는 방식은 한 series에서만 쓴다.
- **누적도수**는 별도 그래프이고 이 capability는 누적도수 그래프를 지원하지 않는다. 누적도수 자료를 도수분포다각형으로 바꿔 그리지 말고 EXEMPT나 UNSUPPORTED로 마무리한다.
- 계급 경계값 n+1개는 크기가 같고 0 이상이며 12계급 이하다. 도수분포다각형의 양 끝 도수 0인 계급은 엔진이 자동으로 붙이므로 plan에 쓰지 않는다. 가로축 눈금은 두 번째 경계값부터 쓰이므로 첫 경계값은 축 시작으로만 보인다.
- 두 series에서는 `showValues`를 쓸 수 없다(`STAT_VALUES_NEED_ONE_SERIES`). 값을 쓸 점은 `highlightPoints:[{"series":1,"class":3,"showValue":true}]`로 그 점만 표시하고 값을 쓴다(선·다른 점에 닿으면 엔진이 라벨을 비켜 놓는다). 나머지 값은 caption이나 풀이 글에서 설명한다.
- 풀이가 두 집단의 같은 계급(예: 80점 이상)을 짚으면 `highlightClasses:[3,4]`가 두 집단의 그 계급 점을 모두 동그라미로 표시하고, `classSums:[{"series":1,"from":3,"to":4,"label":"6","unit":"명"}]`이 한 집단의 합을 괄호로 묶는다(둘째 집단의 괄호는 점선). 합이 풀이가 묻는 답이면 label을 쓰지 않는다. 한 집단의 점만 강조하려면 `highlightPoints`를 쓴다(tone 1 동그라미, tone 2 큰 점).
- 라벨이 겹치거나 자리가 모자라면 `STAT_CHART_RENDERED_LAYOUT_FAIL`/`STAT_LABEL_OUT_OF_BOUNDS`/`STAT_LABELS_TOO_CLOSE`이니 제목을 줄이거나 계급 수를 줄인다. 계급 크기가 다르면 `STAT_CLASS_WIDTH_UNEQUAL`, 도수 개수가 계급 수와 다르면 `STAT_FREQUENCY_COUNT_MISMATCH`이다.
- 독립 관측기가 같은 plan에서 두 series의 모든 꼭짓점·양 끝 0점·눈금·범례 이름을 다시 계산해 최종 SVG와 대조한다. 문제 그림의 점 위치와 다른 계급 귀속이 보이면 자료값을 먼저 확인하고, 원본 풀이 글과 그림이 어긋나는 경우는 그림을 원본 그림 쪽에 맞춘 뒤 그 불일치를 handoff에 적는다.

### 3-45. 축에 나란한 타원: 초점·꼭짓점·지름의 현·접선 (`ellipse-figure-v1`)

원문 문항의 이차곡선이 **축에 나란한 타원**(장축이 x축 또는 y축)이고 저장된 풀이가 초점, 타원 위의 점, 중심을 지나는 현, 삼각형, 접선을 실제로 쓸 때 이 capability를 쓴다. **타원 하나 또는 한 좌표평면 위의 타원 두 개**를 그린다. 두 타원은 하나의 공통 좌표평면·공통 배율로 그리고 패널을 나누지 않는다(`ellipses` 배열). 세 개 이상의 타원, 회전한 타원, 원, 쌍곡선·포물선은 대상이 아니다. `capability:"ellipse-figure-v1"`.

```json
{"capability":"ellipse-figure-v1",
 "ellipse":{"center":["0","0"],"semiAxisSquared":{"major":"16","minor":"4"},"majorAxis":"X"},
 "points":[{"id":"F","kind":"FOCUS","side":1},{"id":"F'","kind":"FOCUS","side":-1},
           {"id":"P","kind":"ON_ELLIPSE","x":"sqrt(3)","branch":"POS"},{"id":"Q","kind":"OPPOSITE","of":"P"},
           {"id":"O","kind":"ORIGIN"}],
 "segments":[{"id":"s1","from":"P","to":"F'"},{"id":"s2","from":"F'","to":"Q"},{"id":"s3","from":"P","to":"Q"}],
 "polygons":[{"id":"t1","points":["P","F'","Q"],"fill":"LIGHT"}],
 "caption":"타원 x²/16+y²/4=1에서 중심 O를 지나는 지름 PQ와 두 초점 F, F′로 만든 삼각형 PF′Q를 나타낸 그림",
 "sourceConditions":[...],"newVisualInformation":[...]}
```

- `ellipse`는 `center`(정확한 값 두 개), `semiAxisSquared{major,minor}`(=a², b²), `majorAxis`(`"X"` 또는 `"Y"`)만 받는다. 모든 수는 정확한 문자열(`"-2"`, `"42/5"`, `"sqrt(3)"`)이고 소수를 쓰지 않는다.
- **두 타원**이면 `ellipse` 대신 `ellipses`에 정확히 두 항목을 쓴다. 각 항목은 `id`(영문 시작 1~8자, 중복 금지)와 위와 같은 `center`·`semiAxisSquared`·`majorAxis`를 갖는다. `FOCUS`·`VERTEX`·`ON_ELLIPSE`는 `ellipseId`가 필수이고, `OPPOSITE`는 대상 점이 속한 타원의 중심에 대해 대칭이며, `POINT`·`ORIGIN`은 `ellipseId`를 생략할 수 있다. `lines`의 `tangent`는 `ellipseId`(기본 첫 타원)가 가리키는 타원에서 검증한다. 두 타원은 같은 배율과 같은 bbox를 쓰고 좌표축은 하나만 그린다. 예:
```json
{"capability":"ellipse-figure-v1",
 "ellipses":[
  {"id":"C1","center":["0","-4"],"semiAxisSquared":{"major":"81","minor":"45"},"majorAxis":"Y"},
  {"id":"C2","center":["0","0"],"semiAxisSquared":{"major":"9","minor":"5"},"majorAxis":"Y"}],
 "points":[
  {"id":"F","kind":"FOCUS","side":1,"ellipseId":"C1"},
  {"id":"F'","kind":"FOCUS","side":-1,"ellipseId":"C1"},
  {"id":"P","kind":"ON_ELLIPSE","ellipseId":"C1","y":"-17/2","branch":"POS"},
  {"id":"Q","kind":"ON_ELLIPSE","ellipseId":"C2","y":"-3/2","branch":"POS"},
  {"id":"O","kind":"ORIGIN"}],
 "segments":[{"id":"s1","from":"F'","to":"F","label":"12"},{"id":"s2","from":"F","to":"P","label":"12"}],
 "caption":"두 타원 C′와 x²/5+y²/9=1을 한 좌표평면에 나타낸 그림",
 "sourceConditions":[...],"newVisualInformation":[...]}
```
- **회전 타원은 표현할 필드가 없다.** `rotation`·`hyperbola` 같은 키를 넣으면 `ELLIPSE_PLAN_INVALID`, `majorAxis`가 X/Y가 아니면 `ELLIPSE_MAJOR_AXIS_UNSUPPORTED`다. 원(a=b)은 `ELLIPSE_AXES_INVALID`, major<minor도 같은 코드로 거절한다(원은 기존 작도·평면 경로를 쓴다).
- 장반지름·단반지름·초점거리는 엔진이 SymPy로 계산한다(c²=a²−b², 초점 (cx±c, cy) 또는 (cx, cy±c)). **저자는 초점·꼭짓점 좌표를 직접 쓰지 않는다.** 그림 범위도 축·꼭짓점·선언한 점·접점에서 자동으로 잡는다.
- `points`는 최대 10개다. `id`는 대문자 한 글자 + 선택적 숫자·프라임(`A`, `T1`, `F'`)이고 **id가 그대로 점 이름으로 그려진다**(아래첨자 이름·`pointNames`는 이 capability에 없다). `label:false`면 이름을 그리지 않는다. 종류는 다음과 같다.
  - `FOCUS`: `side:1|-1`. 1은 장축의 양의 방향 초점이다.
  - `VERTEX`: `end:"MAJOR_POS"|"MAJOR_NEG"|"MINOR_POS"|"MINOR_NEG"`.
  - `ON_ELLIPSE`: `x` 또는 `y` 중 **정확히 하나**와 `branch:"POS"|"NEG"`(기본 POS). x를 주면 그 x에서의 위/아래 가지, y를 주면 좌/우 가지다. 타원 밖의 값이면 `ELLIPSE_POINT_NOT_ON_ELLIPSE`다.
  - `OPPOSITE`: `of`에 다른 점 id. 타원 **중심**에 대한 대칭점이다(지름의 다른 끝).
  - `ORIGIN`: 좌표평면의 원점 (0,0)이다(타원 중심이 아님).
  - `POINT`: `x`,`y`를 직접 준다(접선의 접점 등).
- `segments`는 `from`/`to`(선언한 점 id), 선택 `label`(길이·값, MathJax 수식 문자열), 선택 `dashed`다. 라벨은 선분 중점 곁에 놓인다. 같은 값이 둘 이상의 선분에 반복되면 각 라벨에서 자기 선분 중점까지 1:1 leader를 그리며, 독립 관측기가 소유 선분·라벨 상자 anchor와 connector 교차를 최종 SVG에서 확인한다.
- `polygons`는 점 3~6개와 `fill:"LIGHT"|"MEDIUM"|"NONE"`(기본 LIGHT)이다. 넓이가 0인 다각형은 `ELLIPSE_POLYGON_INVALID`다. 영역 색칠은 이 다각형 채우기만 지원한다(타원 내부·외부 부등식 영역은 지원하지 않는다).
- `lines`는 `slope`·`intercept` 정확값과 선택 `tangent:true`다. `tangent:true`이면 판별식이 0인지 엔진이 대수적으로 확인하고, 접점을 선언한 점과 대조한다(접점이 없으면 `TANGENCY_POINT_NOT_DECLARED`). **직선 식 라벨(`label`)은 지원하지 않는다**(`ELLIPSE_LINE_LABEL_UNSUPPORTED`). 직선은 그림 범위 안으로 잘리고, 화면 밖이면 `ELLIPSE_LINE_OUTSIDE_VIEWPORT`다.
- 배치는 두 축 **같은 배율**이다(세로 압축 없음). 좌표축과 화살촉은 엔진이 그리고 눈금·좌표 띠는 없다. 그림 영역 상한(약 460×360 px, 가장자리 0.75단위 여백)보다 타원·점이 크면 `ELLIPSE_FIGURE_TOO_LARGE`다. 좌표가 큰 문항은 억지로 줄이지 말고 UNSUPPORTED로 남긴다.
- 점 이름은 자기 점 옆에 붙되 곡선·선분·직선·축·다각형 변·다른 이름을 피해 자동 배치된다. 놓을 자리가 없으면 `ELLIPSE_LABEL_NO_ROOM`이다. 이름·길이 라벨은 실제 조판 조각으로 그려지고 최종 SVG에 `data-tex`로 남는다.
- **독립 검수.** `ellipse_figure_observer.py`는 plan만 보고 초점·꼭짓점·현·접선·접점을 자기 코드로 다시 계산해 **최종 SVG**와 대조한다: 축·화살촉 방향, 각 타원의 중심·두 반지름·공통 배율과 장축 방향, 모든 점 표식의 위치, 선분 끝점, 다각형 꼭짓점·채우기, 직선이 식 위에 있는지, 접선 주장의 재증명과 접점 선언, 이름·길이 라벨의 존재·문자·위치, 선언하지 않은 점·선·다각형·타원이 없는지. 하나라도 어긋나면 FAIL이다.
- 한계·오류 코드: `ELLIPSE_PLAN_INVALID`, `ELLIPSE_CENTER_INVALID`, `ELLIPSE_AXES_INVALID`, `ELLIPSE_MAJOR_AXIS_UNSUPPORTED`, `ELLIPSE_PAIR_COUNT_INVALID`, `ELLIPSE_ELLIPSE_ID_INVALID`, `ELLIPSE_ELLIPSE_ID_DUPLICATE`, `ELLIPSE_POINT_INVALID`, `ELLIPSE_POINT_ID_INVALID`, `ELLIPSE_POINT_ID_DUPLICATE`, `ELLIPSE_POINT_ELLIPSE_ID_REQUIRED`, `ELLIPSE_POINT_ELLIPSE_ID_INVALID`, `ELLIPSE_POINT_UNKNOWN`, `ELLIPSE_POINT_NOT_ON_ELLIPSE`, `ELLIPSE_SEGMENT_INVALID`, `ELLIPSE_POLYGON_INVALID`, `ELLIPSE_POLYGON_UNKNOWN_POINT`, `ELLIPSE_LINE_INVALID`, `ELLIPSE_LINE_ELLIPSE_ID_INVALID`, `ELLIPSE_LINE_LABEL_UNSUPPORTED`, `ELLIPSE_LINE_NOT_TANGENT`, `ELLIPSE_LINE_OUTSIDE_VIEWPORT`, `ELLIPSE_FIGURE_TOO_LARGE`, `ELLIPSE_LABEL_NO_ROOM`. 세 번째 이상의 타원, 회전 타원, 원, 쌍곡선·포물선, 곡선 눈금, 벡터 화살표는 이 capability의 지원 범위가 아니다.


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


### 3-50. 물 채우기 그릇과 물의 높이 그래프 (`container-fill-figure-v1`)

원문 문항이 **매초 일정한 양의 물을 채울 때** 그릇 모양과 **시간에 따른 물의 높이 그래프**를 짝짓거나(그릇 A·B·C ↔ 그래프 ㄱ·ㄴ·ㄷ), 한 그릇에 알맞은 그래프를 고르고, 해설이 "단면이 넓으면 높이가 천천히, 좁으면 빨리 오른다"를 그림으로 보여 줄 때 쓴다. 대상은 **한 수직축을 도는 회전체**(원기둥·원뿔대를 아래에서 위로 쌓은 그릇)다. `capability:"container-fill-figure-v1"`.

```json
{"capability":"container-fill-figure-v1",
 "container":{
  "pairs":[
   {"vessel":{"name":"A","profile":[{"kind":"FRUSTUM","r0":"2","r1":"3","height":"4"}]},"graphName":"㉠",
    "segmentNotes":[{"segment":0,"text":"점점 느려짐"}]},
   {"vessel":{"name":"B","profile":[{"kind":"CYLINDER","radius":"3","height":"2"},{"kind":"CYLINDER","radius":"1","height":"4"}]},"graphName":"㉢",
    "segmentNotes":[{"segment":0,"text":"넓음 → 느림"},{"segment":1,"text":"좁음 → 빠름"}]},
   {"vessel":{"name":"C","profile":[{"kind":"CYLINDER","radius":"5/2","height":"5"}]},"graphName":"㉡"}],
  "guides":true,"xTitle":"시간(초)","yTitle":"높이(cm)"},
 "caption":"그릇 A, B, C의 단면과 매초 일정한 양의 물을 넣을 때 물의 높이가 시간에 따라 변하는 그래프",
 "sourceConditions":[...],"newVisualInformation":[...]}
```

- **그래프는 엔진이 계산한다.** 일정한 양을 넣으면 높이 h까지 차는 시간은 그 아래 부피에 비례하므로 t(h)=π∫r(z)²dz÷(매초 부피)다. 엔진이 조각 경계에서는 정확한 분수로, 원뿔대 안에서는 촘촘한 표본점으로 곡선을 그린다. **저자는 곡선을 그리거나 모양을 지정하지 않는다.** 원기둥 조각은 직선, 위로 넓어지는 원뿔대는 기울기가 점점 완만한 곡선, 위로 좁아지는 원뿔대는 점점 가파른 곡선이고, 두 조각이 만나는 높이에서 꺾임점이 생긴다.
- `profile`은 그릇을 **아래에서 위로** 1~4조각으로 쓴다. `{"kind":"CYLINDER","radius","height"}` 또는 `{"kind":"FRUSTUM","r0":밑면 반지름,"r1":윗면 반지름,"height"}`. 값은 정확한 문자열(`"3"`, `"5/2"`, `"1.5"`)이고 양수다. 원뿔(점이 아래)은 첫 조각에 `"r0":"0"`으로 쓴다(맨 위가 뾰족한 그릇과 중간에 점이 있는 그릇은 `CONTAINER_APEX_UNSUPPORTED`). **조각의 밑면 반지름이 아래 조각의 윗면 반지름과 달라도 된다**: 넓은 원기둥 위에 가는 관을 얹은 그릇(B)이나 어깨가 있는 그릇이 이렇게 그려진다. 그림은 그릇을 **단면**으로 그린다(좌우 대칭, 위는 열림, 조각 경계마다 얇은 선).
- `pairs`는 1~3개이고 한 행에 **그릇 단면(왼쪽)과 그 그래프(오른쪽)**를 그린다(행마다 자기 그릇의 그래프). 그릇과 그래프는 **같은 세로 축척**을 쓰고 그래프의 바닥이 그릇의 바닥과 같은 높이다. 그릇 가로·세로도 같은 축척이다(반지름과 높이의 비를 그대로 쓴다). 문제 그림의 실제 길이를 모르면 모양의 **비율**을 정해 쓴다(예: 위로 넓어지는 컵 `r0:2, r1:4`). 가로 시간 축은 행마다 그래프 폭 전체를 쓴다.
- 이름: `vessel.name`(그릇 이름 `A`·`물컵`)은 그릇 아래, `graphName`(`ㄱ` 또는 문제가 인쇄한 `㉠`)은 그래프 아래에 놓이며 각각 6자 이하다. **해설 그림은 문제가 묻는 보기 번호(①~⑤)를 쓰지 않는다**; 그릇과 그래프의 짝은 같은 행에 놓인 것으로 보이면 된다.
- `guides:true`이면 조각 경계와 맨 위 높이마다 그릇에서 그래프의 꺾임점까지 **가로 점선 안내선**을 긋고 꺾임점에 점을 찍는다(라벨이 서 있는 곳에서는 선이 끊긴다).
- `segmentNotes:[{"segment":i,"text":"단면 넓음 → 천천히"}]`는 i번째 조각(0이 맨 아래)의 곡선 옆에 짧은 한글 설명(16자 이하)을 놓는다. 곡선·점·축·안내선·다른 글자를 피해 그래프 안쪽에 자동 배치되고 자리가 없으면 `CONTAINER_NOTE_NO_ROOM`이다.
- `xTitle`·`yTitle`(14자 이하, 기본 `시간`·`높이`; 단위는 `시간(초)`·`높이(cm)`처럼 직접 쓴다), `origin:false`면 원점 O를 지운다. **숫자 눈금은 값을 줄 때만** 그린다: `yTicks`(높이 값, 증가, 그릇 높이 이하)와, 문제가 매초 넣는 양을 정했으면 `flowPi`(매초 부피가 π의 몇 배인지, 예 `"9"`는 9π cm³/초)와 `xTicks`(시간 값, 증가, 전체 시간 이하). `flowPi` 없이 `xTicks`를 주면 `CONTAINER_XTICKS_NEED_FLOW`다.
- **독립 검수.** `container_fill_observer.py`는 plan만 보고 부피(π h(r0²+r0r1+r1²)/3)와 곡선 t(h)를 자기 코드로 다시 계산해 **최종 SVG**와 대조한다: 그릇 단면 모양이 plan의 반지름·높이와 **같은 축척**인지(축척은 그려진 그릇의 높이에서 되찾는다), 그래프 바닥이 그릇 바닥인지, 곡선의 **모든 꼭짓점**이 t(h) 위(0.03px)이고 현의 오차가 0.35px 이하인지, 끝점이 그릇 꼭대기 높이인지, 꺾임점 위치, 안내선이 정확한 높이에서 수평인지, 눈금 위치, 이름·메모가 자기 조각 곁에 있는지, 계획에 없는 글자가 없는지. 하나라도 어긋나면 FAIL이다(곡선 모양이 다르거나 안내선 높이가 어긋나면 `CF_CURVE_POINT`·`CF_GUIDE_NOT_LEVEL` 등).
- 한계·오류 코드: `CONTAINER_PLAN_INVALID`, `CONTAINER_PAIR_COUNT_INVALID`(0개 또는 4개 이상), `CONTAINER_PROFILE_INVALID`(조각 없음·5개 이상·허용하지 않는 키), `CONTAINER_PIECE_KIND_UNSUPPORTED`(CYLINDER·FRUSTUM 밖), `CONTAINER_CURVED_PROFILE_UNSUPPORTED`(구·반구·볼록한 병 같은 곡면 벽), `CONTAINER_ASYMMETRIC_UNSUPPORTED`(기울어졌거나 축에서 벗어난 비대칭 그릇), `CONTAINER_APEX_UNSUPPORTED`, `CONTAINER_DIMENSION_INVALID`, `CONTAINER_NAME_INVALID`, `CONTAINER_FLOW_INVALID`, `CONTAINER_XTICKS_NEED_FLOW`, `CONTAINER_TICK_INVALID`, `CONTAINER_SEGMENT_NOTE_INVALID`, `CONTAINER_TITLE_INVALID`, `CONTAINER_PROPORTION_UNSUPPORTED`(높이 12px 미만의 조각·너비 6px 미만의 부분·8px 안쪽으로 붙은 꺾임점), `CONTAINER_NOTE_NO_ROOM`, `CONTAINER_GUIDE_HIDDEN`, `CONTAINER_LABEL_OUT_OF_BOUNDS`, `CONTAINER_LABELS_TOO_CLOSE`, `CONTAINER_LABEL_ON_LINE`. 구·반구 그릇, 물 양이 시간에 따라 바뀌는 경우, 손으로 그린 곡선 그래프는 지원하지 않는다: UNSUPPORTED로 남긴다.


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
