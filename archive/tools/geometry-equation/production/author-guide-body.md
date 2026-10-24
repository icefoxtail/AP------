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
- 엔진이 못 그리는 것(세로선, 색칠 영역, 삼차 이상 그래프와 직선 조합, 입체)은 `{"status":"UNSUPPORTED","reason":"필요한 것"}`을 쓴다. 비슷하게 억지로 그리지 않는다.
- 발문 그림과 해설 그림은 별개의 plan이다. 각각 따로 쓴다.

## 3. 어떤 plan을 쓰는가

- 좌표평면의 점, 직선, 원, 도형: `construction-spike-v1` (mathPlan 노드: SOURCE_POINT, SOURCE_LINE, MIDPOINT, PERPENDICULAR_FOOT, INTERSECTION 등). 주어진 점은 SOURCE_POINT, 풀이로 얻는 점은 파생 노드로 쓴다. 파생점에 좌표를 직접 쓰지 않는다.
- 이차함수(필요하면 직선 포함): `polynomial-spike-v1`. **계수·직선의 기울기·절편이 무리수**(`k=-3±2√3`, `m=3-√7`처럼 접하는 조건으로 나온 값)이면 이 capability가 아니라 `piecewise-polynomial-spike-v1`의 조각 한 개로 쓴다(아래 3-4).
- 두 이차함수(f와 g)가 만나는 풀이: `piecewise-polynomial-spike-v1`의 `referenceCurves`(아래 3-6).
- 여러 경우(k=-2일 때, k=3일 때)를 비교하는 풀이: `composite-panels-v1` (경우마다 패널 하나, 2~3개).
- 사인·코사인과 수평선·직선의 교점 개수를 구간에서 세는 풀이: `trigonometric-spike-v1`의 `INTERVAL_PI`(아래 3-7).
- 이어진 조각 그래프(이차식의 절댓값 등)와 수평선 또는 기울어진 직선: `piecewise-polynomial-spike-v1`(아래 3-3).
- 이차부등식 풀이(판별식, 그래프, 구간, 수직선): `quadratic-inequality-chain-v1` 하나로 쓴다. 계수와 부등호만 주면 끝점, 열린·닫힌 점, 정수점은 엔진이 계산한다. 해가 구간 하나인 경우만 된다(두 조각이거나 공집합이면 거절된다). 계수가 고정된 이차부등식 하나일 때만 쓴다. 매개변수(a, n 등) 때문에 경우가 나뉘거나("n=1, n=2~4, n≥5"), 부등식이 여러 개이거나, 풀이가 결과 요약뿐이면 체인이 아니다. 그때 풀이가 해집합을 수직선 위에서 비교하는 것이면 아래 `number-line-figure-v1`을 쓴다. 그래프가 필요하면 풀이가 실제로 쓰는 그래프 하나(예: 해가 한 점인 접점 그래프)만 `polynomial-spike-v1`로 그리거나, 그림이 없어도 되면 EXEMPT, 못 그리면 UNSUPPORTED를 쓴다.
- 수직선만 필요한 풀이(두 부등식 해의 교집합, 끝점이 a에 따라 움직이는 해집합, 정수해, 수직선 위 내분점): `number-line-figure-v1`. `numberLine.rows`에 해집합을 한 줄씩(`SET`) 쓰면 같은 눈금 위에 겹쳐 그려지고, `RESULT` 줄은 위 줄들의 공통 범위를 엔진이 계산해 마지막 줄로 그린다(그 끝점은 직접 쓰지 않는다). 한 줄은 구간 한두 조각(`x<-1 또는 x>2`는 두 조각)이고, 끝점은 `{"value":"-1","state":"OPEN"}`(OPEN은 <, >, CLOSED는 ≤, ≥), 끝이 무한이면 `null`, 끝이 근호이면 정확한 문자열 `{"value":"-sqrt(10)","state":"OPEN"}`(`p+q*sqrt(r)` 꼴, 한 plan에 근호 하나; 소수는 안 된다, 관련 오류 `NUMBER_LINE_VALUE_INVALID`/`NUMBER_LINE_RADICALS_MIXED`; 근호 끝값이 다른 끝과 너무 가까우면(`3`과 `sqrt(10)`) `NUMBER_LINE_LABELS_TOO_CLOSE`이니 공통 범위 줄(RESULT)을 빼고 줄만 비교한다), 끝이 a에 따라 움직이면 `{"param":{"mul":"1/3","add":"2/3"},"state":"OPEN"}`(=mul*a+add, 라벨은 분수가 세로로 쌓인 (a+2)/3으로 엔진이 쓴다)이다. `param` 끝이 있으면 `"parameter":{"name":"a","value":"-1"}`로 **그림을 그릴 a의 값**을 정한다(그림에 "a=-1 일 때의 그림"이 표시된다). 풀이가 다루는 경우(경계값 등)를 골라 쓰고 caption에 밝힌다. a에 따라 해의 모양이 달라지는 풀이는 그 한 경우만 그려지니 전체 답의 그림인 척 쓰지 않는다. 정수점은 해당 줄에 `"integerPoints":true`(유계) 또는 `{"range":["-5","5"]}`(최대 25개)를 쓴다. 내분점은 `{"kind":"POINTS","points":[{"id":"A","value":"-2"},{"id":"B","value":"4"},{"id":"P","divides":{"from":"A","to":"B","ratio":["1","2"]}}]}`로 쓰면 P가 AP:PB=1:2인 자리에 놓이고 AP, PB 위에 1, 2가 표시된다(외분점은 안 된다). 이차함수 그래프가 풀이에 필요하면 이것이 아니라 `quadratic-inequality-chain-v1`을 쓴다. 판 전체 모양은 `{"capability":"number-line-figure-v1","numberLine":{"parameter":{...},"rows":[...]},"numberLineCaption":{"text":"두 해의 공통 범위"},"caption":...,"sourceConditions":...,"newVisualInformation":...}`다.

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
- 삼각함수는 정의역 전체에서 **한 주기**(SIN·COS) 또는 **인접한 두 극 사이 한 가지**(TAN)만 그리고, k는 유리수다(`sin πx`처럼 k에 π가 들면 안 된다. `phasePi`만 π의 배수를 받는다). 구간을 제한한 그래프와 직선·수평선과의 교점 개수(사인·코사인만)는 아래 3-7절, 합성·거듭제곱, 두 함수의 비교는 안 된다.
- 곡선은 한 개다(위 표의 계열 기준. 이어진 조각 그래프와 직선은 3-3). 직선(`y=-1/2`, `y=x+k`; 단 사인·코사인과 직선은 3-7절), 수직선, 둘째 곡선(이차함수 둘은 3-6), 색칠 영역, 보조선은 같이 그릴 수 없다. 교점의 개수를 보이는 풀이면 이 그림이 풀이의 전부를 보여 주지 못하니 UNSUPPORTED로 쓴다. 곡선의 모양만 풀이가 쓸 때(점근선, 정의역 경계, 주기·극값, 꺾이는 점)에 쓴다.
- 유리함수는 분자·분모 모두 일차, 절댓값은 `|일차식|` 하나, 조각은 두 조각이고 꺾임점이 구간 안쪽이다. `|x²-2x|` 같은 이차식의 절댓값은 `piecewise-polynomial-spike-v1`을 쓴다.
- 눈금: 기본 눈금은 x=1, y=1 두 곳이다. 곡선이 그 눈금 숫자 자리를 실제로 지나가면(코사인의 최댓값 y=1, 로그의 기준점 x=1) 숫자가 곡선에 겹쳐 `LAYOUT_INVENTORY_INCOMPLETE`(`unresolved: tick-y-1-label` 등)로 거절된다. 엔진이 숫자를 곡선 위에 얹지 않는 것이 맞으니, 이때는 plan에 `axisTickValues:{"x":[],"y":[]}`(또는 겹치지 않는 값만)를 쓴다. 최댓값·기준점 같은 특징점의 값은 엔진이 따로 표시한다.

이 계열의 오류 코드: `<FAMILY>_SOURCE_DOMAIN_REQUIRES_*`/`_SOURCE_DOMAIN_UNSUPPORTED`(정의역 형식이 위 표와 다르다. 표대로 고친다), `<FAMILY>_SOURCE_SCHEMA_INVALID`/`*_GRAMMAR_REQUIRED`(계수 개수·형식이 다르다), `*_NONZERO_*_REQUIRED`/`*_POSITIVE_SLOPE_REQUIRED`(0인 계수나 음의 기울기 반지름식), `*_OUTSIDE_OVERVIEW`/`*_OUTSIDE_VIEWPORT`(점근선·경계·꺾임점이 viewport 밖. viewport나 domain을 넓힌다), `*_BELOW_PROFILE_FLOOR`/`*_BELOW_DISPLAY_RESOLUTION`(특징이 너무 작아 학생 화면에서 구분되지 않는다. 범위를 좁히거나 UNSUPPORTED), `*_OVERVIEW_POLICY_REQUIRED`/`*_FEATURE_INVENTORY_MISMATCH`(plan 형식이 계약과 다르다. 계약 전문을 다시 읽는다), `UNSUPPORTED_CAPABILITY`(위 한계를 벗어난 plan이다).

### 3-3. 이어진 조각 그래프(이차식 조각 최대 3개)와 직선

`|x²-4x-12|`, `x²-2|x|+1`, 이차함수 두 개를 구간별로 이은 `h(x)`처럼 **끊어지지 않는** 한 함수에 수평선 또는 **기울어진 직선**을 겹쳐 교점을 보이는 풀이에 쓴다. `capability:"piecewise-polynomial-spike-v1"`, `graphPlan.family:"piecewise-polynomial"`.

```json
{"capability":"piecewise-polynomial-spike-v1","graphPlan":{"family":"piecewise-polynomial",
 "pieces":[{"coefficients":["-12","-4","1"]},{"coefficients":["12","4","-1"]},{"coefficients":["-12","-4","1"]}],
 "breakpoints":[{"x":"-2","y":"0"},{"x":"6","y":"0"}],"sourceDomain":{"kind":"ALL_REALS"},"formula":"abs(x^2-4x-12)",
 "referenceLines":[{"id":"k","slope":"3","intercept":"10","intersectionX":["(7-sqrt(137))/2","-1","2","(7+sqrt(137))/2"]}],
 "requiredPoints":[{"id":"A","x":-2,"y":0},{"id":"B","x":6,"y":0},{"id":"C","x":2,"y":16},{"id":"D","x":-1,"y":7}],"axisTickValues":{"x":[],"y":[]}},
 "coordinatePlacement":"PANEL","caption":"k=10일 때 직선 y=3x+10과 그래프가 네 점에서 만난다."}
```

- `pieces`는 왼쪽부터 1~3개, 계수는 `[상수, x, x²]`(정수·분수 문자열). `breakpoints`는 조각 수보다 하나 적게, 이어지는 점의 `x`, `y`(두 조각이 모두 그 값을 주어야 한다). 끊김은 `PIECEWISE_POLY_DISCONTINUOUS`.
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
- 수직선, 조각 4개 이상(`PIECEWISE_POLY_PIECE_COUNT_INVALID`), 삼차 이상 조각, 끊어지는 함수는 지원하지 않는다. UNSUPPORTED. 둘째 이차함수(f와 g)가 필요하면 3-6절의 `referenceCurves`를 쓴다.

### 3-4. 무리수 계수: `p+q√r` (접하는 조건의 매개변수, 무리수 기울기·절편·교점)

접하는 조건의 매개변수 `k=-3±2√3`, `m=3-√7`, `a=2-√2`처럼 풀이가 구한 **계수가 무리수**인 포물선·직선을 그릴 때 쓴다. 곡선은 `piecewise-polynomial-spike-v1`의 **조각 한 개**(`pieces`에 한 줄, `breakpoints` 없음)로 쓴다. `polynomial-spike-v1`(이차함수)의 계수는 정수·분수만 되고, 같은 그림에 직선을 얹어 접점·교점을 보이는 것도 이쪽이 한다.

- **쓰는 곳:** `pieces[].coefficients`, `breakpoints`, `referenceLines`의 `y`·`slope`·`intercept`, `requiredPoints`의 `x`·`y`. 형식은 정확한 문자열 `p+q*sqrt(r)`이다(p, q는 정수·분수, r은 양의 정수): `"-3+2*sqrt(3)"`, `"3/2-sqrt(3)"`, `"(1+sqrt(2))/2"`, `"sqrt(7)/2"`. 엔진은 SymPy로 정확히 계산하고(`p+q√r`의 사칙연산은 닫혀 있다) 소수는 배치에만 쓴다.
- **한 plan에는 근호 하나만:** 계수·좌표에 나오는 무리수는 모두 같은 `sqrt(r)`이어야 한다. 한 곡선에 `sqrt(2)`와 `sqrt(3)`이 같이 있으면 거절된다.
- **무리수 점 좌표는 정확한 문자열로:** `{"id":"V","x":"3/2-sqrt(3)","y":"-1/4+3*sqrt(3)"}`처럼 쓰면 엔진이 곡선 위의 점인지 정확히 확인하고, 그림에는 정확한 좌표(분수와 √이 제대로 나온 `V(3/2-√3, -1/4+3√3)`)가 띠에 쓰이며, 소수는 점 위치에만 쓰인다. 소수로 풀어 쓴 좌표(`-0.2320508`)도 받지만(오차 1e-8) 정확한 문자열을 권한다. 포물선의 꼭짓점, 접점, 꺾임점은 이전처럼 `requiredPoints`에 모두 넣는다.
- **접점·교점:** `referenceLines`의 `intersectionX`에는 곡선과 직선의 교점 x를 하나도 빠짐없이 쓴다. 접하면 중근 하나(`["-sqrt(3)"]`). 교점의 x가 중첩 근호(`(10-2*sqrt(7)-sqrt(216-72*sqrt(7)))/4-2`)여도 되며 엔진과 독립 관측기가 각각 다시 계산해 맞춘다. 접점이 `requiredPoints`의 점과 같으면 그 점 하나로만 그려진다(예: 꼭짓점에서 접하는 수평선).
- **라벨:** 직선 식은 띠에 `y=(6-2√7)x+(23-8√7)`처럼 쓰이고, 수평선은 `y=-11+4√7`이다. 점 좌표는 `coordinatePlacement:"PANEL"`로 띠에 쓰는 것을 권한다.
- **두 값(`k=-3±2√3`)을 비교하는 풀이:** `composite-panels-v1`은 `polynomial-spike-v1` 패널만 받으므로 무리수 계수를 못 넣는다. 대표 값 하나를 그림 한 개로 그리고 caption에 값을 쓴다(둘 다 필요하면 plan 두 개).
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

```json
{"capability":"polynomial-spike-v1","graphPlan":{"family":"polynomial","coefficients":["36000","2400","-600"],"domain":[0,10],"viewport":[0,10,0,40000],
 "sourceDomain":{"kind":"INTERVAL","range":[0,10]},"requiredPoints":[{"id":"V","x":2,"y":38400}],
 "applicationAxes":true,"axisVariable":"n","axisTickValues":{"x":[2,4,6,8,10],"y":[10000,20000,30000]}},
 "coordinatePlacement":"PANEL","caption":"줄이는 횟수 n=2일 때 하루 이익금이 38400원으로 최대이다."}
```

### 3-6. 두 이차함수를 한 그림에: `referenceCurves`

`f`와 `g`가 만나고 `f(x)≤g(x)`의 해를 읽는 풀이처럼 **이차함수 둘**이 한 그림에 필요하면 `piecewise-polynomial-spike-v1`의 조각 하나(또는 이어진 조각)를 함수로 쓰고, 둘째 이차함수는 `graphPlan.referenceCurves`에 쓴다(최대 2개, 이차식만).

- `{"id":"g","name":"g","coefficients":["1/2","1","-1/2"],"intersectionX":["-1/3","3"]}`: `coefficients`는 `[상수, x, x²]`(정수·분수·`p+q*sqrt(r)` 문자열, x² 계수는 0이 아니다, 한 plan에 근호 하나). `intersectionX`에는 **함수와 이 곡선의 교점 x를 하나도 빠짐없이** 쓴다(접점은 한 번). 엔진과 독립 관측기가 조각마다 따로 풀어 다르면 `PIECEWISE_POLY_INTERSECTION_MISMATCH:g:engine finds N intersection(s)`로 거절한다.
- `name`(소문자 한 글자, i·x·y 제외)을 쓰면 띠에 `g(x)=-x^2/2+x+1/2`로 쓰인다. 함수의 머리줄은 `graphPlan.functionName:"f"`와 `formula`로 `f(x)=x²/4-x-1/4`가 된다. 둘 다 안 쓰면 `y=`로 나온다.
- 곡선의 **꼭짓점은 반드시 `requiredPoints`에 쓴다**(`PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS`). `requiredPoints`의 점은 함수 위에 있거나 참조 곡선 위에 있으면 된다. 교점은 점으로만 그려지고(핵심 점과 같으면 그 점 하나), 이름이 필요하면 `requiredPoints`에 넣는다.
- 곡선은 함수와 같은 구간에 그려진다. 한 곡선이 조각 하나와 완전히 같으면 `PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE`, 이차식이 아니면 `PIECEWISE_POLY_REFERENCE_CURVE_NOT_QUADRATIC`, 3개 이상이거나 형식이 틀리면 `PIECEWISE_POLY_REFERENCE_CURVES_INVALID`다. 삼차 이상, 세로선, 색칠은 여전히 UNSUPPORTED다.

```json
{"capability":"piecewise-polynomial-spike-v1","graphPlan":{"family":"piecewise-polynomial","pieces":[{"coefficients":["-1/4","-1","1/4"]}],
 "sourceDomain":{"kind":"ALL_REALS"},"functionName":"f","formula":"x^2/4-x-1/4",
 "referenceCurves":[{"id":"g","name":"g","coefficients":["1/2","1","-1/2"],"intersectionX":["-1/3","3"]}],
 "requiredPoints":[{"id":"A","x":2,"y":"-5/4"},{"id":"B","x":1,"y":1}],"exactCoordinates":{"A":["2","-5/4"],"B":["1","1"]},"axisTickValues":{"x":[],"y":[]}},
 "coordinatePlacement":"PANEL","caption":"두 포물선은 x=-1/3, x=3에서 만나고 그 사이에서 g가 f보다 위에 있다."}
```

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

## 4. 이름과 표기 규칙 (자주 걸리는 것)

- 그림에 나오는 점 이름은 노드 id다. 문항과 풀이 텍스트에 쓴 이름과 같아야 한다. 풀이가 점 이름을 쓰지 않으면 한 글자 대문자(A, B, P)만 쓰고, O0, Pp, C1 같은 내부식 이름은 쓰지 않는다. 풀이에 쓰지 않은 보조점은 숨김 필드를 쓴다.
- **프라임·아래첨자 이름(A′, T₁, T₂):** id는 `A`, `T1`, `T2`처럼 간단하게 두고, plan 최상위에 `"pointNames":{"T1":"T_1","T2":"T_2","A":"A'"}`을 쓴다(작도 plan, 그래프 plan, 수직선 도형 plan 모두 같은 모양, 합성 패널이면 그 패널 plan 안). 키는 그림이 실제로 그리는 점의 id(작도 `displayPoints`, 그래프 `requiredPoints`, 수직선 `POINTS` 행의 점)이고, 값은 **대문자 한 글자 + 프라임(`'` `′` `″`, 최대 2개) + 아래첨자 숫자 1~9(최대 2자리)** 순서다. `T_1`, `T_{1}`, `T₁`은 같은 이름이고 `A'`, `A′`도 같다. 그림에는 진짜 아래첨자와 ′가 그려지고(점 이름과 좌표 띠 `T₁(3, 2)` 모두), 풀이 글에는 같은 이름을 쓴다.
  - 이름이 있는 그래프 점은 좌표가 있으면 좌표 띠로 올라간다(`T₁(x, y)`). 좌표가 없으면 점 옆에 이름만 그린다.
  - 소문자·낱말·숫자 0·두 글자 이상·프라임보다 앞선 아래첨자는 쓸 수 없다. 두 점이 같은 이름을 보이면 안 되고, `hiddenPointNames`로 숨긴 점에는 이름을 못 붙인다. 점 id에는 ′나 아래첨자를 직접 쓰지 않는다.
- 풀이가 치환(t=x²−2x)하고 그 변수의 그래프를 그리면 `graphPlan.axisVariable`에 그 문자를 쓴다(소문자 한 글자, y 제외). 판별식 D를 a에 대한 함수로 그리면 `"axisVariable":"a"`다. 축과 식이 그 문자로 나온다.
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
