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
- 엔진이 못 그리는 것(두 곡선을 한 그림에, 세로선, 색칠 영역, 삼차 이상 그래프와 직선 조합, 입체)은 `{"status":"UNSUPPORTED","reason":"필요한 것"}`을 쓴다. 비슷하게 억지로 그리지 않는다.
- 발문 그림과 해설 그림은 별개의 plan이다. 각각 따로 쓴다.

## 3. 어떤 plan을 쓰는가

- 좌표평면의 점, 직선, 원, 도형: `construction-spike-v1` (mathPlan 노드: SOURCE_POINT, SOURCE_LINE, MIDPOINT, PERPENDICULAR_FOOT, INTERSECTION 등). 주어진 점은 SOURCE_POINT, 풀이로 얻는 점은 파생 노드로 쓴다. 파생점에 좌표를 직접 쓰지 않는다.
- 이차함수(필요하면 직선 포함): `polynomial-spike-v1`.
- 여러 경우(k=-2일 때, k=3일 때)를 비교하는 풀이: `composite-panels-v1` (경우마다 패널 하나, 2~3개).
- 이어진 조각 그래프와 수평선(이차식의 절댓값 등): `piecewise-polynomial-spike-v1`.
- 이차부등식 풀이(판별식, 그래프, 구간, 수직선): `quadratic-inequality-chain-v1` 하나로 쓴다. 계수와 부등호만 주면 끝점, 열린·닫힌 점, 정수점은 엔진이 계산한다. 해가 구간 하나인 경우만 된다(두 조각이거나 공집합이면 거절된다). 계수가 고정된 이차부등식 하나일 때만 쓴다. 매개변수(a, n 등) 때문에 경우가 나뉘거나("n=1, n=2~4, n≥5"), 부등식이 여러 개이거나, 풀이가 결과 요약뿐이면 체인이 아니다. 그때 풀이가 해집합을 수직선 위에서 비교하는 것이면 아래 `number-line-figure-v1`을 쓴다. 그래프가 필요하면 풀이가 실제로 쓰는 그래프 하나(예: 해가 한 점인 접점 그래프)만 `polynomial-spike-v1`로 그리거나, 그림이 없어도 되면 EXEMPT, 못 그리면 UNSUPPORTED를 쓴다.
- 수직선만 필요한 풀이(두 부등식 해의 교집합, 끝점이 a에 따라 움직이는 해집합, 정수해, 수직선 위 내분점): `number-line-figure-v1`. `numberLine.rows`에 해집합을 한 줄씩(`SET`) 쓰면 같은 눈금 위에 겹쳐 그려지고, `RESULT` 줄은 위 줄들의 공통 범위를 엔진이 계산해 마지막 줄로 그린다(그 끝점은 직접 쓰지 않는다). 한 줄은 구간 한두 조각(`x<-1 또는 x>2`는 두 조각)이고, 끝점은 `{"value":"-1","state":"OPEN"}`(OPEN은 <, >, CLOSED는 ≤, ≥), 끝이 무한이면 `null`, 끝이 a에 따라 움직이면 `{"param":{"mul":"1/3","add":"2/3"},"state":"OPEN"}`(=mul*a+add, 라벨은 분수가 세로로 쌓인 (a+2)/3으로 엔진이 쓴다)이다. `param` 끝이 있으면 `"parameter":{"name":"a","value":"-1"}`로 **그림을 그릴 a의 값**을 정한다(그림에 "a=-1 일 때의 그림"이 표시된다). 풀이가 다루는 경우(경계값 등)를 골라 쓰고 caption에 밝힌다. a에 따라 해의 모양이 달라지는 풀이는 그 한 경우만 그려지니 전체 답의 그림인 척 쓰지 않는다. 정수점은 해당 줄에 `"integerPoints":true`(유계) 또는 `{"range":["-5","5"]}`(최대 25개)를 쓴다. 내분점은 `{"kind":"POINTS","points":[{"id":"A","value":"-2"},{"id":"B","value":"4"},{"id":"P","divides":{"from":"A","to":"B","ratio":["1","2"]}}]}`로 쓰면 P가 AP:PB=1:2인 자리에 놓이고 AP, PB 위에 1, 2가 표시된다(외분점은 안 된다). 이차함수 그래프가 풀이에 필요하면 이것이 아니라 `quadratic-inequality-chain-v1`을 쓴다. 판 전체 모양은 `{"capability":"number-line-figure-v1","numberLine":{"parameter":{...},"rows":[...]},"numberLineCaption":{"text":"두 해의 공통 범위"},"caption":...,"sourceConditions":...,"newVisualInformation":...}`다.

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
- 대칭점 A′처럼 프라임이 든 이름은 id로 쓸 수 없다. 이 점을 P라 한다는 한 문장을 풀이 설명 또는 sourceConditions에 쓰고 id는 P로 쓴다.
- 원 `x²+y²+ax+by+c=0`을 원점 대칭한 그림처럼 원을 직접 옮기는 연산은 없다. 중심만 `POINT_REFLECTION`으로 옮기고 원은 `CIRCLE_CENTER_RADIUS`로 다시 그린다.
- 엔진은 SymPy로 정확한 값을 계산하고, 독립 관측기(CindyJS)가 같은 입력에서 Mid/Join/Meet, 점·직선 대칭 변환, 평행이동으로 다시 만들어 비교한다. 내분·외분점은 CindyJS에 비율 연산이 없어 관측기가 내분·외분 공식으로 따로 계산한다. 값이 다르면 `MODEL_PLAN_MISMATCH`다.

### 3-2. 함수 그래프 한 개: 삼차·사차·유리·무리·절댓값·조각·지수·로그·삼각함수

풀이의 결정적 관계가 **곡선 한 개**(보조선·직선·둘째 곡선 없음)로 설명될 때 쓴다. 모두 `{"capability":"<이름>","graphPlan":{"family":...,...},"caption":"한국어 한 문장"}` 모양이고, `graphPlan.domain`(그릴 x 범위)과 `graphPlan.viewport`([xmin,xmax,ymin,ymax])를 직접 준다. 계수는 정확한 정수·분수 문자열이다. 곡선의 특징점(극값, 점근선, 구멍, 꺾이는 점, 경계)은 엔진이 계수에서 계산해 표시하고 독립 관측기가 최종 SVG와 대조하니, 좌표를 따로 쓰지 않는다. 문항이 요구하는 점은 `requiredPoints`에 쓴다.

| 곡선 | capability / family | 계수와 정의역 |
|---|---|---|
| 삼차·사차 다항 | `polynomial-spike-v1` / `polynomial` | `coefficients`는 오름차순 3차·4차 계수, `sourceDomain:{"kind":"ALL_REALS"}` |
| 유리 (일차/일차) | `rational-spike-v1` / `rational` | `numerator`, `denominator` 각각 [상수항, x계수], `sourceDomain` ALL_REALS. 점근선·구멍은 엔진이 표시 |
| 무리 √(일차) | `sqrt-affine-spike-v1` / `sqrt-affine` | `radicand` [상수항, 양의 x계수], `sourceDomain:{"kind":"NATURAL_SQRT_AFFINE"}` 또는 `{"kind":"CLOSED_INTERVAL","range":[a,b]}` |
| 절댓값 k·\|ax+b\|+c | `absolute-value-spike-v1` / `absolute-value` | `coefficients` [b,a,k,c], ALL_REALS |
| 두 조각 일차 (구간 닫힘) | `piecewise-affine-spike-v1` / `piecewise-affine` | `sourceDomain:{"kind":"CLOSED_INTERVAL","range":[lo,hi]}`, `piecewise:{breakX,owner:"LEFT"\|"RIGHT",left:[b,m],right:[b,m]}` |
| 지수 A·e^(kx)+C | `exponential-affine-spike-v1` / `exponential-affine` | `coefficients` [A,k,C], ALL_REALS |
| 로그 A·ln(kx+b)+C | `logarithmic-affine-spike-v1` / `logarithmic-affine` | `coefficients` [A,k,b,C], `sourceDomain:{"kind":"NATURAL_LOG_AFFINE"}` |
| 사인·코사인·탄젠트 | `trigonometric-spike-v1` / `trigonometric` | `function:"SIN"\|"COS"\|"TAN"`, `coefficients` [A,k,C], `phasePi`(π의 유리수 배), 정의역 ALL_REALS (TAN은 `ALL_REALS_WITH_TAN_POLES`) |

가장 작은 예: `{"capability":"exponential-affine-spike-v1","graphPlan":{"family":"exponential-affine","coefficients":["1","1","0"],"sourceDomain":{"kind":"ALL_REALS"},"domain":[-2,2],"viewport":[-3,3,-2,12]},"caption":"지수함수의 증가와 점근선"}`

한계(가짜 지원 없이 오류 코드로 거절된다):
- 지수·로그는 **밑이 e(자연)**일 때만 되고 계수는 유리수여야 한다. 밑이 2, 3인 `log_2 x`, `3^x`는 계수가 무리수(1/ln2 등)가 되므로 그릴 수 없다. UNSUPPORTED.
- 삼각함수는 정의역 전체에서 **한 주기**(SIN·COS) 또는 **인접한 두 극 사이 한 가지**(TAN)만 그리고, k는 유리수다(`sin πx`처럼 k에 π가 들면 안 된다. `phasePi`만 π의 배수를 받는다). 구간을 제한한 그래프(0≤x<2π 등), 합성·거듭제곱, 두 함수의 비교는 안 된다.
- 곡선은 한 개다. 직선(`y=-1/2`, `y=x+k`), 수직선, 둘째 곡선, 색칠 영역, 보조선은 같이 그릴 수 없다. 교점의 개수를 보이는 풀이면 이 그림이 풀이의 전부를 보여 주지 못하니 UNSUPPORTED로 쓴다. 곡선의 모양만 풀이가 쓸 때(점근선, 정의역 경계, 주기·극값, 꺾이는 점)에 쓴다.
- 유리함수는 분자·분모 모두 일차, 절댓값은 `|일차식|` 하나, 조각은 두 조각이고 꺾임점이 구간 안쪽이다. `|x²-2x|` 같은 이차식의 절댓값은 `piecewise-polynomial-spike-v1`을 쓴다.
- 눈금: 기본 눈금은 x=1, y=1 두 곳이다. 곡선이 그 눈금 숫자 자리를 실제로 지나가면(코사인의 최댓값 y=1, 로그의 기준점 x=1) 숫자가 곡선에 겹쳐 `LAYOUT_INVENTORY_INCOMPLETE`(`unresolved: tick-y-1-label` 등)로 거절된다. 엔진이 숫자를 곡선 위에 얹지 않는 것이 맞으니, 이때는 plan에 `axisTickValues:{"x":[],"y":[]}`(또는 겹치지 않는 값만)를 쓴다. 최댓값·기준점 같은 특징점의 값은 엔진이 따로 표시한다.

이 계열의 오류 코드: `<FAMILY>_SOURCE_DOMAIN_REQUIRES_*`/`_SOURCE_DOMAIN_UNSUPPORTED`(정의역 형식이 위 표와 다르다. 표대로 고친다), `<FAMILY>_SOURCE_SCHEMA_INVALID`/`*_GRAMMAR_REQUIRED`(계수 개수·형식이 다르다), `*_NONZERO_*_REQUIRED`/`*_POSITIVE_SLOPE_REQUIRED`(0인 계수나 음의 기울기 반지름식), `*_OUTSIDE_OVERVIEW`/`*_OUTSIDE_VIEWPORT`(점근선·경계·꺾임점이 viewport 밖. viewport나 domain을 넓힌다), `*_BELOW_PROFILE_FLOOR`/`*_BELOW_DISPLAY_RESOLUTION`(특징이 너무 작아 학생 화면에서 구분되지 않는다. 범위를 좁히거나 UNSUPPORTED), `*_OVERVIEW_POLICY_REQUIRED`/`*_FEATURE_INVENTORY_MISMATCH`(plan 형식이 계약과 다르다. 계약 전문을 다시 읽는다), `UNSUPPORTED_CAPABILITY`(위 한계를 벗어난 plan이다).

## 4. 이름과 표기 규칙 (자주 걸리는 것)

- 그림에 나오는 점 이름은 노드 id다. 문항과 풀이 텍스트에 쓴 이름과 같아야 한다. 풀이가 점 이름을 쓰지 않으면 한 글자 대문자(A, B, P)만 쓰고, O0, Pp, C1 같은 내부식 이름은 쓰지 않는다. 풀이에 쓰지 않은 보조점은 숨김 필드를 쓴다.
- 대칭점 A′처럼 프라임이 든 이름은 id로 쓸 수 없다. 풀이에 "이 점을 P라 한다"를 한 문장 넣고 id는 P로 쓴다.
- 풀이가 치환(t=x²−2x)하고 그 변수의 그래프를 그리면 `graphPlan.axisVariable`에 그 문자를 쓴다(소문자 한 글자, y 제외). 판별식 D를 a에 대한 함수로 그리면 `"axisVariable":"a"`다. 축과 식이 그 문자로 나온다.
- 수치는 정확한 정수나 분수 문자열로 쓴다("17/4", "-1/2"). 소수로 근사하지 않는다.
- 직선의 식을 그림에 쓰려면 `lineLabels`를 쓴다(식이 직선 옆 지시선으로 붙는다). 식 라벨을 따로 띄우지 않는다.
- 점의 좌표를 그림에 쓰려면 `coordinateLabels`에 그 점을 넣는다. 점이 몰리면 `coordinatePlacement:"PANEL"`로 좌표를 띠로 올린다.
- `caption`은 학생이 읽는 한국어 한 문장이다. 내부 용어, 디버그 문구, TeX 명령을 쓰지 않는다.
- 이 plan이 어느 문항의 것인지 확인하기 위해 plan 최상위에 `"sourceQuote"`를 넣는다. 이 문항의 발문 또는 풀이에서 글자 그대로 복사한 12~40자다(다른 문항 것을 쓰지 않는다). 엔진은 이 필드를 무시한다. 작성 파이프라인의 실행기가 있으면 이 문항에 실제로 있는 문장인지 대조한다.

## 5. 그래프 배율

- 이차함수 그래프는 x축과 y축의 눈금 길이를 같게 그리는 것이 기본이다. viewport를 임의로 크게 잡아 납작하거나 길쭉하게 만들지 않는다.
- 세로로 너무 길면 `graphPlan.axisSqueeze:true`로 세로를 최대 1/2까지 줄일 수 있다. 그 이상 찌그러뜨리는 요청은 하지 않는다.
- x 범위에 비해 y 범위가 훨씬 커서 곡선이 너무 좁아지면 엔진이 거절한다. 그때는 그림을 포기하고 UNSUPPORTED를 쓴다.

## 6. 오류가 오면 이렇게 고친다

- `NAME_NOT_IN_SOLUTION`: 그림의 점 이름이 풀이에 없다. 풀이에 쓴 이름으로 id를 바꾼다.
- `SOURCE_QUOTE_MISSING` / `SOURCE_QUOTE_NOT_IN_ITEM` (작성 파이프라인의 실행기가 내는 코드): plan 최상위에 `sourceQuote`를 넣는다. 12~40자, 이 문항의 발문 또는 풀이에서 글자 그대로 복사한다.
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
- `EQUAL_UNIT_PARABOLA_TOO_NARROW`: 이 풀이는 같은 배율로 못 그린다. UNSUPPORTED를 쓴다.
- 같은 오류가 반복되면 plan을 고치는 대신 EXEMPT 또는 UNSUPPORTED로 마무리한다. 다른 문항의 plan을 참고하지 않는다.

## 7. 출력

- 문항 JSON(발문, 보기, 정답, 풀이)과 그림마다 `plan.json` 한 개.
- plan.json에는 `sourceQuote`(위 4), `sourceConditions`, `newVisualInformation`(그림이 새로 보여 주는 정보)을 넣는다.
- 그림이 필요 없으면 plan 파일 없이 문항만 낸다. 이유는 notes에 한 줄로 쓴다.

## 8. plan을 직접 그려 보기

- 저장소 루트에서 `node archive/tools/geometry-equation/production/render-plan.mjs --item item.json --plan plan.json --out out/` 한 번으로 그린다. `item.json`은 `{"sourcePath":"archive/exams/....js","ordinal":3}`.
- 결과는 `out/figure-result.json`의 `status`: `ARCHIVE_BOUND`(그림 `figure-solution.svg` 완성), `EXEMPT`/`UNSUPPORTED`(작성자 판단 그대로), `FAILED`(`stage`와 엔진 오류 `detail`을 보고 6에 따라 고친다).
- 독립 관측기 검사는 이 안에서 함께 돈다. 시험지 해설 페이지 열림 검증은 하지 않는다.
