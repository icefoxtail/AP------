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
- 엔진이 못 그리는 것(세로선, 색칠 영역, 삼차 이상 그래프와 직선 조합, 정다면체나 입체 안의 입체)은 `{"status":"UNSUPPORTED","reason":"필요한 것"}`을 쓴다. 비슷하게 억지로 그리지 않는다.
- 발문 그림과 해설 그림은 별개의 plan이다. 각각 따로 쓴다.

## 3. 어떤 plan을 쓰는가

- 좌표축 없는 중학교 평면도형(각도 표식, 같은 길이·평행 표시, 호 강조): `construction-spike-v1`의 `PLANE_FIGURE_v1`과 `planeMarks`(아래 3-8). 길이와 각으로 점을 놓는 `POLAR_POINT`.
- 좌표평면의 점, 직선, 원, 도형: `construction-spike-v1` (mathPlan 노드: SOURCE_POINT, SOURCE_LINE, MIDPOINT, PERPENDICULAR_FOOT, INTERSECTION 등). 주어진 점은 SOURCE_POINT, 풀이로 얻는 점은 파생 노드로 쓴다. 파생점에 좌표를 직접 쓰지 않는다.
- 이차함수(필요하면 직선 포함): `polynomial-spike-v1`. **계수·직선의 기울기·절편이 무리수**(`k=-3±2√3`, `m=3-√7`처럼 접하는 조건으로 나온 값)이면 이 capability가 아니라 `piecewise-polynomial-spike-v1`의 조각 한 개로 쓴다(아래 3-4).
- 두 이차함수(f와 g)가 만나는 풀이: `piecewise-polynomial-spike-v1`의 `referenceCurves`(아래 3-6).
- 여러 경우(k=-2일 때, k=3일 때)를 비교하는 풀이: `composite-panels-v1` (경우마다 패널 하나, 2~3개).
- 사인·코사인과 수평선·직선의 교점 개수를 구간에서 세는 풀이: `trigonometric-spike-v1`의 `INTERVAL_PI`(아래 3-7).
- 이어진 조각 그래프(이차식의 절댓값 등)와 수평선 또는 기울어진 직선: `piecewise-polynomial-spike-v1`(아래 3-3).
- 이차부등식 풀이(판별식, 그래프, 구간, 수직선): `quadratic-inequality-chain-v1` 하나로 쓴다. 계수와 부등호만 주면 끝점, 열린·닫힌 점, 정수점은 엔진이 계산한다. 해가 구간 하나인 경우만 된다(두 조각이거나 공집합이면 거절된다). 계수가 고정된 이차부등식 하나일 때만 쓴다. 매개변수(a, n 등) 때문에 경우가 나뉘거나("n=1, n=2~4, n≥5"), 부등식이 여러 개이거나, 풀이가 결과 요약뿐이면 체인이 아니다. 그때 풀이가 해집합을 수직선 위에서 비교하는 것이면 아래 `number-line-figure-v1`을 쓴다. 그래프가 필요하면 풀이가 실제로 쓰는 그래프 하나(예: 해가 한 점인 접점 그래프)만 `polynomial-spike-v1`로 그리거나, 그림이 없어도 되면 EXEMPT, 못 그리면 UNSUPPORTED를 쓴다.
- 수직선만 필요한 풀이(두 부등식 해의 교집합, 끝점이 a에 따라 움직이는 해집합, 정수해, 수직선 위 내분점): `number-line-figure-v1`. `numberLine.rows`에 해집합을 한 줄씩(`SET`) 쓰면 같은 눈금 위에 겹쳐 그려지고, `RESULT` 줄은 위 줄들의 공통 범위를 엔진이 계산해 마지막 줄로 그린다(그 끝점은 직접 쓰지 않는다). 한 줄은 구간 한두 조각(`x<-1 또는 x>2`는 두 조각)이고, 끝점은 `{"value":"-1","state":"OPEN"}`(OPEN은 <, >, CLOSED는 ≤, ≥), 끝이 무한이면 `null`, 끝이 근호이면 정확한 문자열 `{"value":"-sqrt(10)","state":"OPEN"}`(`p+q*sqrt(r)` 꼴, 한 plan에 근호 하나; 소수는 안 된다, 관련 오류 `NUMBER_LINE_VALUE_INVALID`/`NUMBER_LINE_RADICALS_MIXED`; 근호 끝값이 다른 끝과 너무 가까우면(`3`과 `sqrt(10)`) `NUMBER_LINE_LABELS_TOO_CLOSE`이니 공통 범위 줄(RESULT)을 빼고 줄만 비교한다), 끝이 a에 따라 움직이면 `{"param":{"mul":"1/3","add":"2/3"},"state":"OPEN"}`(=mul*a+add, 라벨은 분수가 세로로 쌓인 (a+2)/3으로 엔진이 쓴다)이다. `param` 끝이 있으면 `"parameter":{"name":"a","value":"-1"}`로 **그림을 그릴 a의 값**을 정한다(그림에 "a=-1 일 때의 그림"이 표시된다). 풀이가 다루는 경우(경계값 등)를 골라 쓰고 caption에 밝힌다. a에 따라 해의 모양이 달라지는 풀이는 그 한 경우만 그려지니 전체 답의 그림인 척 쓰지 않는다. 정수점은 해당 줄에 `"integerPoints":true`(유계) 또는 `{"range":["-5","5"]}`(최대 25개)를 쓴다. 내분점은 `{"kind":"POINTS","points":[{"id":"A","value":"-2"},{"id":"B","value":"4"},{"id":"P","divides":{"from":"A","to":"B","ratio":["1","2"]}}]}`로 쓰면 P가 AP:PB=1:2인 자리에 놓이고 AP, PB 위에 1, 2가 표시된다(외분점은 안 된다). 이차함수 그래프가 풀이에 필요하면 이것이 아니라 `quadratic-inequality-chain-v1`을 쓴다. 판 전체 모양은 `{"capability":"number-line-figure-v1","numberLine":{"parameter":{...},"rows":[...]},"numberLineCaption":{"text":"두 해의 공통 범위"},"caption":...,"sourceConditions":...,"newVisualInformation":...}`다.
- 입체도형(각기둥·각뿔·각뿔대·원기둥·원뿔·원뿔대·구·반구)을 숨은 모서리 점선·꼭짓점 이름·길이와 함께, 또는 각기둥·각뿔·원기둥·원뿔의 전개도, 회전축을 지나는 단면, 원뿔 모양 그릇의 수면: `solid-figure-v1`(아래 3-입체). 치수를 실제 길이로 쓰면 엔진이 3차원 모델에서 투영·숨은선·전개를 계산한다.
- 통계·확률 그림(도수분포 히스토그램·도수분포다각형·상대도수 그래프, 줄기와 잎 그림, 상자그림, 산점도, 두 주사위의 6×6 표, 확률 수형도): `stat-chart-figure-v1`. 자료의 값만 정확히 주면 눈금, 막대 높이, 다각형 꼭짓점, 사분위수, 표의 칸 색칠, 경로 확률은 엔진이 계산한다. 자세한 쓰는 법은 아래 3-11절.

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

**`displaySegments` 추가 필드.** `dashed:true`(보조선 점선), `arrow:"START"|"END"|"BOTH"`(반직선·연장선의 화살촉, 끝점에 정확히 놓인다). 평면도형 모드에서만 된다(`DISPLAY_SEGMENT_STYLE_INVALID`, `DISPLAY_SEGMENT_STYLE_REQUIRES_PLANE_FIGURE`).

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

- 각 호 `angles`: `refs`는 [한 변 위의 점, 꼭짓점, 다른 변 위의 점]이고 모두 화면에 나오는 점이다. `value`는 그림의 점들이 실제로 만드는 각이다(허용 오차 0.5°; 틀리면 plan이 아니라 작도를 고친다). `side:"OUTER"`는 큰 쪽(360°-각)이다. `arcs` 1~3은 같은 각이 같은 개수의 호를 갖게 하는 표시이고, `equalGroup`이 같은 각은 크기·`arcs`·`style`이 같아야 하며 모둠마다 `arcs`가 달라야 한다. `ring` 1~3은 꼭짓점에 겹친 호가 있을 때 바깥으로 비키는 정도다. **기본 모양 `style:"SECTOR"`**: 두 변 사이에 연한 회색(#d9d9d9) 작은 부채꼴을 칠하고 그 바깥 경계(가장 바깥 호)에 호를 그린다(교과서 모양). 칠은 모든 선·점·라벨 아래에 깔리고, 영역 색칠(`regions`, 3-9)의 회색과 구별되는 중성 회색을 쓴다. `style:"ARC"`는 지금까지의 획만 있는 호다. 라벨: `label`(`"40"`, `"x"`, `"2x+10"`은 뒤에 °가 붙는다; `labelKind:"NAME"`이면 `"ABC"`가 ∠ABC), 없으면 `value`를 쓰고, 읽을 값이 없는 쌍의 두 번째 각은 `noLabel:true`. 라벨은 부채꼴 바깥 이등분선 위에 놓이고, 가까운 곳에서 못 놓으면 먼 곳 + 지시선을 쓴다. 직각은 기존 `rightAngles`를 쓴다(직각 사각 표시는 그대로).
- `equalLengths` `count`는 1~3개의 눈금, `parallels` `count`는 1~2개의 화살표다. 같은 종류의 모둠은 개수가 달라야 한다. 표식은 선분 가운데(점이 있으면 비킨 곳)에 놓이고 선분 길이가 약 40px보다 짧으면 거절된다.
- `expressionLabels`: 선분 옆에 식 라벨(`10-x`, `t+2`, `3sqrt(3)`)을 쓴다. 한 글자 문자는 기존 `segmentLabels`와 같은 표기다. 라벨이 어느 선분의 것인지 모호하면 지시선이 붙는다.
- `arcs`: 원 위 두 점 사이의 호를 굵게 강조한다. `circle`은 CIRCLE 노드, `center`, `from`, `to`는 화면의 점이고 `from`, `to`는 원 위에 있어야 한다. `side`는 `MINOR`(기본), `MAJOR`, 반원이면 `CCW`/`CW`. `label`은 원 바깥에 놓인다. 중심각·원주각은 `angles`로, 접선은 `TANGENT_AT_POINT` 또는 접점에서 외부점까지의 선분과 `rightAngles`로 쓴다.
- `facts`: 최종 SVG에서 읽어 확인한다. `ON_CIRCLE`은 그려진 원 위에 점들이 있는지, `TANGENT_PERPENDICULAR`는 그려진 접선이 접점을 지나고 반지름과 수직인지다.
- 표식 id는 노드, 선분, 다른 표식 id와 달라야 한다. 정해진 키만 쓴다.

**독립 관측기**(`plane-marks-observer-worker.py`)는 Cindy가 계산한 점과 최종 SVG의 그려진 요소만으로 다음을 다시 확인한다: 호가 꼭짓점을 중심으로 두 변 사이를 정확히 잇고 그려진 각이 점들이 만드는 각과 말한 값(0.5° 이내)과 같은지, 같은 모둠의 호 개수·크기·`style`, 부채꼴 칠이 꼭짓점에서 시작해 두 변을 따라가고 반지름이 가장 바깥 호와 같으며 sweep이 말한 각(0.5° 이내)·방향과 같은지, 칠이 모든 획·라벨보다 아래인지, 눈금이 선분 위에서 선분에 수직이고 모둠의 선분 길이가 같은지, 평행 화살표가 선분 방향이고 모둠이 평행한지, 호의 점이 모두 원 위에 있고 끝점과 방향이 맞는지, 점선과 화살촉, 접선과 반지름의 수직, 라벨이 선·표식과 겹치지 않고 자기 각 안쪽(또는 지시선이 호에서 시작) 자기 선분 곁에 있는지, 선언하지 않은 표식이 없는지.

**한계.** 한 점 둘레에 각이 4개 이상 몰리거나 20°대의 좁은 각 라벨은 자리가 없어 `POLISH_REQUIRED`가 될 수 있다: 한 쌍의 두 번째 각을 `noLabel`로 하거나 표식을 줄인다. 길이 라벨의 숫자와 그려진 길이의 비례는 관측하지 않는다(눈금과 평행·각만 관측).

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
| `CYLINDER` / `CONE` | `radius`, `height` | |
| `CONE_FRUSTUM` | `radius`, `topRadius`, `height` | `topRadius`는 `radius`보다 작아야 한다 |
| `SPHERE` / `HEMISPHERE` | `radius` | 반구는 평평한 면이 아래 |

- **이름 `names`**: 대문자 한 글자씩 밑면 순서대로 이은 문자열 `"FGHEBCDA"`(밑면 먼저, 다음 위 밑면; 각뿔은 밑면 뒤에 꼭짓점 한 글자; `.`은 이름 없음), 또는 `{base,top,apex}`. 생략하면 A, B, C... 순서다. 한 그림에서 이름은 한 번만 쓴다. 이름은 밑면이 위에서 볼 때 반시계 방향이 되는 순서로 붙는다(직육면체는 앞-왼쪽에서 시작해 앞-오른쪽, 뒤-오른쪽, 뒤-왼쪽). 원기둥·원뿔 계열은 `names:{center,top,apex}`.
- **길이 `dims`**(모두 모서리 옆에 놓인다): `{"edge":"AB"}` 또는 `{"from":"E","to":"G"}`(그려진 모서리나 `segments`의 선분), `{"radius":"bottom"|"top"|"center"}`, `{"height":true}`(각뿔, 각뿔대, 원기둥, 원뿔: 축을 따라 점선), `{"slant":true}`(원뿔·원뿔대의 모선), `{"level":true}`(아래 `LEVEL`의 높이). 값은 엔진이 모델에서 계산해 정확히 쓴다(`5`, `7.5`, `5\sqrt{2}`, `8\pi`, `\frac{10}{3}`)와 `unit`. `label`을 쓰면 숫자일 때는 계산한 값과 같아야 하고(다르면 `SOLID_DIM_VALUE_MISMATCH`), `r`, `h`, `2r`, `2\pi r`처럼 문자·식이면 기호 라벨이 된다. 정확한 짧은 꼴이 없는 길이는 `SOLID_DIM_NOT_EXPRESSIBLE`이니 `label`로 문자를 쓴다.
- **`highlights`**: `[{"polygon":["E","G","C"]}]` 그려진 선분들로 이루어진 평면 다각형을 연하게 칠한다(직육면체 위의 직각삼각형 EGC처럼). 다각형의 변은 모서리이거나 `segments`에 있어야 한다.
- **`segments`**: `[{"from":"E","to":"G","style":"SOLID"|"DASHED"|"AUTO","role":"REF"|"ACCENT"}]` 면의 대각선, 공간대각선, 또는 강조할 모서리(`REF` 굵게, `ACCENT` 빨강). `AUTO`는 입체가 가리는 선분이면 점선으로 그린다. 입체 안을 지나는 선분은 `SOLID`나 `DASHED`로 정한다.
- **`section`**: `{"kind":"AXIAL"}` 원기둥·원뿔·원뿔대의 회전축을 지나는 평면(직사각형, 이등변삼각형, 사다리꼴)을 칠하고, `{"kind":"LEVEL","at":"1/3"}`은 밑면과 평행한 평면(높이의 1/3)을 타원으로 보인다(원뿔 모양 그릇의 수면).

**전개도 `net`**(입체 그림과 같은 plan에 `solids`와 함께 쓰지 않는다).

```json
{"capability":"solid-figure-v1","net":{"solid":{"kind":"PRISM","base":{"kind":"RECT","width":2,"depth":3},"height":4,"names":"........"},
 "root":"side0","joins":[["side0","side1"],["side1","side2"],["side2","side3"],["side1","top"],["side3","bottom"]],
 "corners":{"side0":["B","C","N","A"],"side1":["C","D","K","N"],"top":["M","N","K","L"]}}, ...}
```

- 각기둥·각뿔·각뿔대의 면 이름은 `bottom`, `top`(각뿔은 없다), `side0`, `side1`, ...(`side i`는 밑면의 i번째 모서리 위에 선 옆면)이다. `root`는 처음 놓는 면, `joins`는 `[이미 놓인 면, 새로 펼칠 면]`의 목록으로 모든 면을 잇는 나무(면 수 - 1개)여야 하고 서로 이웃한 면만 이을 수 있다. 엔진이 공유한 모서리를 따라 접힘 반대 방향으로 펼치고, 겹치면 `SOLID_NET_FACES_OVERLAP`으로 거절한다. 접는 모서리(`joins`)는 점선, 바깥 둘레는 실선이다.
- `corners`는 면마다 꼭짓점 이름을 따로 줄 때(문제의 전개도가 모든 점에 서로 다른 글자를 붙인 경우) 쓴다. 한 면의 이름은 그 면의 순환 순서대로 쓴다: 옆면 `[밑 i, 밑 i+1, 위 i+1, 위 i]`, 위 밑면 `[위 0, 위 1, ...]`, 아래 밑면과 각뿔의 밑면은 그 역순(밑면이 반시계일 때), 각뿔의 옆면 `[밑 i, 밑 i+1, 꼭짓점]`. 이름 개수가 맞지 않으면 `SOLID_NAMES_INVALID`이다. 전개도에서 한 점에 겹치는 같은 이름은 한 번만 쓴다. 생략하면 입체의 꼭짓점 이름을 쓴다.
- `dims:[{face,edge,label?}]`는 면의 `edge`번째 변(0부터, 그 면의 순환 순서) 옆에 길이를 쓴다.
- 원기둥: `{"kind":"CYLINDER","radius":3,"height":5,"dims":[{"part":"rect-width","label":"2\\pi r"},{"part":"rect-height","label":"h"},{"part":"radius-top"}]}`: 직사각형(가로 = 밑면의 둘레)과 위·아래의 합동인 원이 직사각형에 접한다.
- 원뿔: `{"kind":"CONE","radius":8,"slant":20,"dims":[{"part":"slant"},{"part":"arc"},{"part":"radius"},{"part":"angle"}]}`(`slant` 대신 `height`도 된다): 부채꼴(반지름 = 모선, 중심각 = 360 x r / l)과 호의 가운데에 접한 밑면의 원. `arc`는 호의 길이 2πr, `angle`은 중심각이다.

**독립 관측기**(`solid_figure_observer.py`)는 plan만으로 3차원 모델을 다시 만들고 최종 SVG를 확인한다: 모든 모서리 조각이 자기 깊이 검사(모든 면에 대해 보는 쪽으로 쏜 광선)와 같은 실선·점선이고 조각들이 모서리를 빈틈없이 덮는지, 모든 꼭짓점이 하나의 배율과 위치에 맞는지, 타원의 중심·축과 앞·뒤 반원의 보임, 옆 윤곽선이 타원에 접하는지(원뿔은 꼭짓점을 지나는지), 전개도의 면이 입체의 면과 합동이고(변의 길이 모두) 접는 변에서 이어져 서로 반대쪽에 놓이며 겹치지 않는지, 원기둥·원뿔 전개도의 둘레·호 길이·중심각, 길이 라벨의 값(TeX를 읽어 계산한 값과 비교)과 이름 라벨의 글자·자리, 라벨이 선이나 다른 라벨 위에 놓이지 않았는지.

**오류와 조치.**

| 코드 | 조치 |
|---|---|
| `SOLID_KIND_UNSUPPORTED`, `SOLID_NET_UNSUPPORTED` | 지원하는 kind만 쓴다. 정다면체(정팔면체·정십이면체 등), 토러스, 한 입체 안의 입체, 기울어진 평면으로 자른 단면은 UNSUPPORTED |
| `SOLID_PARAM_INVALID`, `SOLID_BASE_INVALID`, `SOLID_BASE_NOT_SIMPLE`, `SOLID_BASE_NOT_CONVEX` | 매개변수는 양의 실수, 밑면은 스스로 교차하지 않는 점 8개 이하(각뿔·각뿔대는 볼록) |
| `SOLID_COUNT_INVALID` | 한 그림에 입체는 3개까지다. 5개를 나란히 보이는 문항(다면체 고르기)은 UNSUPPORTED이거나 나누어 그린다 |
| `SOLID_NAMES_INVALID`, `SOLID_NAME_DUPLICATE`, `SOLID_NAME_UNKNOWN` | 이름은 대문자 한 글자, 한 그림에서 한 번, 개수는 꼭짓점 수와 같다 |
| `SOLID_DIM_SEGMENT_NOT_DRAWN`, `SOLID_DIMS_INVALID` | 길이를 쓸 선분은 그려진 모서리나 `segments`여야 한다. `height`는 각뿔·각뿔대·원기둥·원뿔에만, `slant`는 원뿔·원뿔대에만 |
| `SOLID_DIM_VALUE_MISMATCH` | 숫자 `label`이 그려진 길이와 다르다: 값을 고치거나 문자로 쓴다 |
| `SOLID_HIGHLIGHT_NOT_PLANAR`, `SOLID_HIGHLIGHT_EDGE_NOT_DRAWN` | 한 평면의 점들만, 변은 모두 그려진 선분으로 |
| `SOLID_SECTION_UNSUPPORTED`, `SOLID_SECTION_INVALID` | 단면은 원기둥·원뿔·원뿔대의 `AXIAL`·`LEVEL`(`at`은 `"1/3"` 꼴 진분수)만 |
| `SOLID_NET_NOT_A_TREE`, `SOLID_NET_FACES_NOT_ADJACENT`, `SOLID_NET_FACES_OVERLAP`, `SOLID_NET_FACE_UNKNOWN` | `joins`는 면 수 - 1개, 이웃한 면만, 겹치지 않게 다시 펼친다 |
| `SOLID_FIGURE_NEEDS_A_LABEL` | 이름도 길이도 없는 그림은 공개 검사가 글자를 못 읽는다: 이름이나 길이를 하나 이상 쓴다 |
| `SOLID_LABELS_NO_ROOM`, `SOLID_RENDERED_LAYOUT_FAIL` | 라벨이 놓일 자리가 없다: 라벨을 줄이거나(`names`의 일부를 `.`으로) 한 그림에 입체 수를 줄인다 |

**한계.** 한 투영(정사영)만 있다(앞면 실제 크기의 사투영이나 다른 시점은 없다). 원뿔은 꼭짓점이 위인 것만 그린다(물을 채운 원뿔 그릇처럼 꼭짓점이 아래인 원뿔은 UNSUPPORTED). 입체 안의 입체(구가 들어 있는 원기둥)는 나란히 그린다. 각 모서리에 길이 라벨의 지시선이 없어 라벨이 들어갈 자리가 좁은 그림(작은 입체 여러 개)은 거절될 수 있다. 직각 표시, 각도 표식, 평행·같은 길이 표식은 이 capability에 없다(평면 표식은 3-8). 부피·겉넓이 계산 식은 그림이 아니라 풀이 글에 쓴다.
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

**히스토그램·다각형.** `boundaries`는 계급의 경계값 n+1개(문자열, 크기가 모두 같고 0 이상, 계급 12개 이하)이고 `frequencies`는 계급마다 정수 하나다. 상대도수 그래프는 도수를 주고 `"yKind":"RELATIVE"`로 쓰면 엔진이 총합으로 나누고, 상대도수가 문제에 직접 주어졌으면 `relativeFrequencies:["0.1","0.15",...]`(합이 정확히 1)로 쓴다. 도수의 합을 문제가 말하면 `total`로 적어 두면 엔진이 합과 대조한다. 가로축은 계급의 경계값에 눈금이 찍히고(0에서 시작하지 않으면 물결 표시와 O가 붙는다), 세로축 눈금은 엔진이 고른다. `xTitle`/`yTitle`은 짧은 한글(`"기록(회)"`, `"도수(명)"`, `"상대도수"`, 14자 이내)이다. `grid:true`는 점선 격자, `showValues:true`는 값을 막대·꼭짓점 위에 쓴다(풀이가 값을 읽는 그림에서만 쓴다; 값이 선에 닿으면 `STAT_CHART_RENDERED_LAYOUT_FAIL`이니 끈다). `highlightClasses:[4]`는 계급(0부터)을 진하게 칠한다. 두 집단은 `FREQUENCY_POLYGON`에 `series:[{name:"A",...},{name:"B",...}]`를 쓰고 B는 점선으로 그려지며 범례가 붙는다(히스토그램은 한 집단만).

**줄기와 잎.** 원자료 값을 그대로 `values`에 쓴다(0~999, 줄기는 십의 자리, 잎은 일의 자리). 엔진이 오름차순으로 정렬하고 빈 줄기도 남기며 잎의 수를 센다. `unitText:"건"`, `title`을 쓰면 "1 | 0은 10건" 같은 설명이 붙는다. `marks`로 잎을 동그라미로 강조한다: `{"median":true}`는 중앙값(짝수 개이면 가운데 두 값), `{"ranks":[4]}`는 작은 쪽에서 4번째 값, 두 집단이면 `group`(0 또는 1)을 함께 쓴다.

**상자그림.** `values`(4개 이상)를 주면 교육과정 정의대로 중앙값, Q1(아래 절반의 중앙값), Q3(위 절반의 중앙값, 자료가 홀수 개이면 가운데 값은 양쪽에서 뺀다)을 엔진이 계산한다. 문제가 다섯 수치를 직접 주면 `summary:{min,q1,median,q3,max}`로 쓴다(작은 순서가 아니면 거절). `showValues:true`는 다섯 수를 상자 위에 쓴다(가까우면 `STAT_LABELS_TOO_CLOSE`).

**산점도.** `points`에는 그림에 찍힌 점을 **모두** 쓴다(이름 `name`은 문제가 이름 붙인 점만, 한 글자 대문자). `xRange`/`yRange`는 눈금 범위이며 양 끝이 `xStep`/`yStep`의 배수여야 하고 모든 점이 그 안에 있어야 한다. 범위가 0에서 시작하지 않으면 축에 물결 표시가 붙는다. `diagonal:true`는 y=x 직선을 점선으로 그려 "두 성적이 같은 학생"을 세게 한다. `labelEvery:2`는 눈금 숫자를 한 칸 걸러 쓴다. 이름 라벨이 격자선과 겹치는 곳은 격자선이 끊겨 그려진다.

**주사위 표.** `highlight`는 사건을 조건으로 쓴다. 가로(첫째 주사위)는 `a`, 세로(둘째 주사위)는 `b`다. `{"expr":"a+b","in":[2,7]}`, `{"expr":"a","cmp":"<=","value":2}`, `{"all":[...]}`, `{"any":[...]}`, `{"not":{...}}`로 쓰며 `expr`에는 정수, `a`, `b`, `+ - *`, 괄호만 쓴다(예: `b-2*a`). 엔진이 36칸 모두에 조건을 계산해 해당하는 칸만 칠하고 개수를 관측기가 다시 센다. 칸 안의 글자는 `cell`(`PAIR` (a,b), `SUM`, `PRODUCT`, `NONE`), `faces`(2~8, 기본 6), `colVar`/`rowVar`(기본 a, b)로 바꾼다.

**수형도.** `root:{"children":[{"label":"흰","p":"3/7","children":[{"label":"흰","p":"2/5"},{"label":"검","p":"3/5"}]},{"label":"검","p":"4/7","children":[...]}]}`. 한 마디의 가지는 2~5개, 깊이 3 이하, 끝 가지 12개 이하, 이름은 6자 이내다. 확률 `p`는 정확한 분수로 **모든 가지에 쓰거나 하나도 쓰지 않는다**(경우만 나열하는 수형도). 형제 가지의 확률 합은 정확히 1이어야 한다. `showPathProbability:true`는 각 끝에 `3/7×2/5=6/35`처럼 경로 확률의 곱을 쓴다. 확률은 세로 분수로만 쓰인다.

**오류와 한계.** 거절 코드: `STAT_CLASS_WIDTH_UNEQUAL`(계급 크기가 다름), `STAT_FREQUENCY_COUNT_MISMATCH`(도수 개수가 계급 수와 다름), `STAT_FREQUENCY_TOTAL_MISMATCH`(말한 총합이 합과 다름), `STAT_RELATIVE_SUM_NOT_ONE`, `STAT_STEM_MARK_INVALID`, `STAT_BOX_NEEDS_FOUR_VALUES`, `STAT_BOX_SUMMARY_NOT_ORDERED`, `STAT_POINT_OUTSIDE_RANGE`, `STAT_RANGE_NOT_ON_STEP`, `STAT_DICE_EXPR_INVALID`(a, b 말고 다른 문자), `STAT_DICE_PREDICATE_INVALID`, `STAT_TREE_BRANCH_PROBABILITY_SUM`, `STAT_TREE_PROBABILITY_MIXED`. 그릴 자리가 없으면 `STAT_LABEL_OUT_OF_BOUNDS`/`STAT_LABELS_TOO_CLOSE`/`STAT_CHART_RENDERED_LAYOUT_FAIL`이니 제목을 줄이거나 계급을 줄이거나 `showValues`를 끈다. 원그래프, 범주형 막대그래프, 누적도수 그래프, 계급 크기가 다른 히스토그램, 값이 사라진 막대(?)는 지원하지 않으니 EXEMPT나 UNSUPPORTED를 쓴다. 이 그림은 문제에 이미 있는 그림을 다시 그리는 것이므로, 풀이에서 쓰는 값만 강조하고 정답을 그림에 쓰지 않는다.

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
- `POLAR_POINT` 오류 `INVALID_POLAR_LENGTH`/`INVALID_POLAR_ANGLE`/`INVALID_POLAR_TURN`/`DEGENERATE_POLAR_REFERENCE`, 평면도형 오류 `PLANE_FIGURE_HAS_FRAME_HELPERS`/`PLANE_FIGURE_SOURCE_POINT_REQUIRED`/`REALIZATION_RECIPE_REQUIRED`: 3-8절의 모양으로 고친다.
- 표식 오류(3-8절): `ANGLE_MARK_FACT_MISMATCH`(말한 각이 점들이 만드는 각과 다르다: 작도를 고친다), `ANGLE_MARK_DEGENERATE`/`ANGLE_ARC_TOO_SMALL`(세 점이 일직선이거나 5° 미만), `ANGLE_MARK_STYLE_INVALID`(`style`은 `SECTOR`·`ARC`), `ANGLE_MARK_LABEL_REQUIRED`, `ANGLE_EQUAL_GROUP_MISMATCH`/`_ARC_COUNT`/`_STYLE_MISMATCH`/`_AMBIGUOUS`, `EQUAL_MARK_LENGTH_MISMATCH`, `PARALLEL_MARK_NOT_PARALLEL`, `EQUAL_MARK_GROUP_AMBIGUOUS`/`PARALLEL_MARK_GROUP_AMBIGUOUS`, `MARK_COUNT_INVALID`, `MARK_SEGMENT_TOO_SHORT`, `MARK_TARGET_UNKNOWN:<id>`, `MARK_ID_DUPLICATE`, `MARK_FIELD_UNKNOWN`, `ARC_ENDPOINT_NOT_ON_CIRCLE`, `ARC_SIDE_AMBIGUOUS`, `ARC_CENTER_MISMATCH`, `FACT_TARGET_NOT_DRAWN`. 최종 SVG를 읽은 관측기 판정 `PLANE_MARKS_AUDIT_FAIL`(오류 목록의 `MARK_LABEL_OVERLAPS`, `ANGLE_LABEL_NOT_IN_ANGLE`, `ANGLE_SECTOR_*`, `UNDECLARED_MARK` 등)은 표식이나 라벨을 줄이고 그림을 키운다. 자리가 없으면 `LAYOUT_INVENTORY_INCOMPLETE`(점 이름·라벨 자리 부족)이니 같은 처방이다.
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
