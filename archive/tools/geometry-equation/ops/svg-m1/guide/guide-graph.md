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
- 눈금: 기본 눈금은 x=1, y=1 두 곳이다. 곡선이 그 눈금 숫자 자리를 실제로 지나가면(코사인의 최댓값 y=1, 로그의 기준점 x=1) 숫자가 곡선에 겹쳐 `LAYOUT_INVENTORY_INCOMPLETE`(`unresolved: tick-y-1-label` 등)로 거절된다. 엔진이 숫자를 곡선 위에 얹지 않는 것이 맞으니, 이때는 plan에 `axisTickValues:{"x":[],"y":[]}`(또는 겹치지 않는 값만)를 쓴다. 최댓값·기준점 같은 특징점의 값은 엔진이 따로 표시한다. (E31) 원점 바로 옆의 눈금(예: x=3)이 점 이름 O와 자리를 다투면 눈금 숫자가 먼저 자리를 잡고 O가 비킨다(눈금 숫자는 축에 붙은 위·아래 두 쪽에만 설 수 있다).

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

- **원호 조각(사분원·반원 등)**: `pieces`에 `{"kind":"ARC","center":["a","b"],"radiusSquared":"r2","fromX":"..","toX":"..","branch":"UPPER"|"LOWER","leftClosed":true,"rightClosed":false}`를 다른 조각과 섞어 쓴다. y=b±√(r²−(x−a)²)이고, 끝점 y는 정확값이며 열린·닫힌 점은 다항 조각과 같다. fromX·toX가 원의 x 범위 밖이면 `PIECEWISE_ARC_OUT_OF_DOMAIN`, 형식 오류는 `PIECEWISE_ARC_INVALID`, 가로·세로 배율이 같지 않으면(세로 줄임) `PIECEWISE_ARC_REQUIRES_EQUAL_UNITS`다. 호의 맨 위·아래가 안쪽에 있으면 `requiredPoints`에 넣는다.
- **한 좌표축에 겹치기 `"layout":"SHARED"`**: `referenceCurves[0]`에 `"style":"DASHED"`(점선) 또는 `"ACCENT"`(색)을 반드시 쓴다(없으면 `PAIR_SHARED_CURVES_INDISTINCT`). f는 실선, g는 그 스타일로 같은 축·같은 배율에 그려지고 `y=f(x)`, `y=g(x)` 이름이 곡선 곁에 붙는다. 두 곡선의 같은 점은 g의 점을 작게 그려 둘 다 보인다. `referenceLines`와 g의 `requiredPoints`는 SHARED에서 쓰지 못한다(`PAIR_SHARED_REFERENCE_LINES_UNSUPPORTED`, `PAIR_SHARED_REQUIRED_POINTS_UNSUPPORTED`). **대신 `graphPlan.overlays`(3-14)를 쓴다**: `points`·`segments`·`guides`·`lines`(세로선 `{id,x}` 포함)를 그대로 쓰고, 점이 g 위의 점이면 `{"id":"P","curveX":"1/2","on":"g"}`로 g를 지정한다(`on` 없으면 f). 엔진이 그 곡선의 정확한 조각식에서 y를 계산하고 독립 관측기가 다시 계산한다. 그 곡선이 그 x에서 정의되지 않으면(열린 끝·구간 밖) `OVERLAY_POINT_NOT_ON_CURVE`, `on`이 f도 g도 아니면 `OVERLAY_POINT_CURVE_UNKNOWN`. 전체 폭 세로선(`overlays.lines`)은 그 x의 눈금 숫자를 가릴 수 있으니(`LAYOUT_INVENTORY_INCOMPLETE tick-...`) 점에서 축까지의 `guides`를 먼저 쓴다. STACKED에서는 `overlays`·`nameLabel`을 쓸 수 없다(`PAIR_STACKED_OVERLAYS_UNSUPPORTED`).
- **곡선 이름 지시선 `nameLabel`**: 기본 `g(x)` 이름이 다른 선 옆에 놓여 어느 곡선의 이름인지 모호하면 `referenceCurves[0].nameLabel={"text":"g(x)","placement":"LEADER","anchorX":"3/2"}`로 쓴다(`text`·`anchorX`는 생략 가능, 생략하면 g의 가장 긴 조각의 가운데). 엔진이 g 위의 그 점(작은 점)에서 라벨 상자까지 가는 가는 지시선을 그린다. 지시선은 축·눈금·점선 안내는 가로지를 수 있지만 곡선·직선은 가로지르지 않는다. 관측기가 지시선 시작점이 g 위인지(`CURVE_NAME_LEADER_NOT_ON_OWNER`), f 곡선 가까이(3px 안)가 아닌지(`CURVE_NAME_LEADER_AMBIGUOUS_OWNER`), 끝이 라벨 상자에 닿는지(`CURVE_NAME_LEADER_NOT_ON_LABEL`) 확인한다. `anchorX`가 g의 어느 조각에도 속하지 않으면 `CURVE_NAME_LEADER_ANCHOR_OFF_CURVE`, 지시선을 둘 빈 자리가 없으면 `LAYOUT_INVENTORY_INCOMPLETE g-curve-name`(`anchorX`를 바꾼다: 곡선 바깥쪽이 트인 점). `nameLabel`을 쓰지 않으면 기존 배치 그대로다.
- **눈금과 점선 안내**: 점선·곡선 때문에 눈금 숫자가 축 양옆에 들어갈 자리가 없으면, 엔진이 그 눈금을 지우지 않고 작은 거리의 지시선으로 눈금에 이어 붙인다. 눈금을 일부러 빼지 않는다. (G5b) 이 지시선은 **그래프 계열 전체**(다항·구간별·유리·지수 등)에서 켜진다. 세로선 `overlays.lines`의 `x=a`가 그 눈금 `a`를 지나도 눈금 숫자는 두 옆자리가 막힐 때만 지시선으로 옮겨 가고(세로선은 눈금 자리에서 끊지 않는다), 기본 자리에 들어가는 그림은 그대로다. 그 세로선·점선은 눈금의 일부로 보고 지시선은 눈금에서만 닿는다.
- **좌표 라벨 지시선(G5b)**: 열쇠 점(`requiredPoints`)의 좌표가 점 옆에 자리가 없으면 좌표 띠로 보내기 전에 점 둘레 빈 자리로 가서 점에서 시작하는 지시선으로 이어 붙인다(이름 있는 점은 `T(-1,-2)` 한 덩어리). 엔진이 알아서 한 단계 먼저 시도하고, 직접 정하려면 plan 맨 위에 `coordinateLeader:["T"]`를 쓴다(열쇠 점 id 목록; `coordinatePanel`·`coordinatePlacement:"PANEL"`과 함께 쓰면 `COORDINATE_LEADER_PANEL_CONFLICT`, 모양이 틀리면 `COORDINATE_LEADER_INVALID`, 없는 점·좌표 없는 점은 `COORDINATE_LEADER_POINT_INVALID`). 지시선도 자리도 없을 때만 좌표 띠로 간다. 다항·구간별·불연속 조각 그래프 단일 패널에 쓰이고 `composite-panels-v1`의 패널에는 아직 없다.

한계와 오류 코드(가짜 지원 없이 거절):
- `PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO`: 기울기 0은 수평선이다. `{"id","y",...}`로 쓴다.
- `PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID`: 기울기·절편은 정수·분수 또는 `p+q*sqrt(r)` 문자열만 된다(소수, 문자, 식 불가). 무리수 계수의 쓰는 법과 한계는 3-4.
- `PIECEWISE_POLY_SLANTED_LINE_LABELS_UNSUPPORTED`: 기울어진 직선에는 `labelIntersections`를 쓸 수 없다(위 `requiredPoints` 방법).
- `PIECEWISE_POLY_REFERENCE_LINE_INVALID`: `y`와 `slope/intercept` 중 하나만, 필드 이름이 맞는지 확인한다.
- `PIECEWISE_POLY_REFERENCE_LINE_CONTAINS_A_PIECE`: 직선이 조각 하나와 완전히 겹친다(교점이 무한개). 그릴 수 없다.
- 수직선, 조각 5개 이상(`PIECEWISE_POLY_PIECE_COUNT_INVALID`), 사차 초과 조각, 끊어지는 함수는 지원하지 않는다(삼차·사차 조각은 3-6-영역의 G5 항목). UNSUPPORTED. 둘째 함수(f와 g, g도 구간별)가 필요하면 3-6절의 `referenceCurves`를 쓴다.


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

삼차와 접선 사이 넓이(영역 이름 `S`, 넓이 값은 문제가 준 값만 쓰고 답은 쓰지 않는다): `{"capability":"piecewise-polynomial-spike-v1","graphPlan":{"family":"piecewise-polynomial","pieces":[{"coefficients":["1","0","0","1"]}],"breakpoints":[],"sourceDomain":{"kind":"ALL_REALS"},"formula":"x^3+1","functionName":"f","referenceLines":[{"id":"g","slope":"3","intercept":"-1","intersectionX":["-2","1"]}],"requiredPoints":[],"axisTickValues":{"x":[],"y":[]},"regions":[{"id":"S","upper":"f","lower":"g","from":"-2","to":"1","label":"S"}]},"caption":"..."}`. 삼차와 이차를 함께 그릴 때는 `referenceCurves:[{"id":"g","name":"g","coefficients":["-3","-2","-1"],"intersectionX":["-1","3"]}]`처럼 이차는 기존 `coefficients`, 삼차 이상의 둘째 곡선은 `pieces:[{"coefficients":[...]}]`로 쓴다.

```json
{"capability":"piecewise-polynomial-spike-v1","graphPlan":{"family":"piecewise-polynomial",
 "pieces":[{"coefficients":["0","0","1"]}],"breakpoints":[],
 "sourceDomain":{"kind":"INTERVAL","range":["-2","2"],"states":["CLOSED","CLOSED"]},"formula":"x^2",
 "regions":[{"id":"S1","upper":"f","lower":"axis","from":"1/5","to":"1","fill":"LIGHT","label":"S_1"}],
 "requiredPoints":[{"id":"O","x":0,"y":0}],"axisTickValues":{"x":[],"y":[]}},
 "caption":"곡선 y=x^2과 x축, x=1/5, x=1로 둘러싸인 영역 S_1을 색칠했다."}
```

- 교점 x를 직접 쓰지 않아도 된다. 교점이 `2±sqrt(2)` 같은 무리수면 `intersectionX`에 쓴 것과 같은 문자열을 `from`·`to`에 그대로 쓴다. 두 경계가 그 x에서 실제로 만나는지, 경계가 구간 전체에 정의되는지는 엔진이 정확히 확인한다.
- **삼차·사차 조각(G5)**: `pieces`와 `referenceCurves`의 `pieces`에서 한 조각의 `coefficients`는 **최대 5개**(상수항부터 x⁴ 계수)까지 쓸 수 있다. 차수가 2를 넘는 조각의 계수는 **유리수 문자열**이어야 하고(근호가 있으면 `PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED`), 6개 이상이면 `PIECEWISE_POLY_PIECE_INVALID`다. 엔진은 교점·경계 교차 x를 SymPy로 **유리수 위에서 인수분해해** 1·2차 인수의 근으로 정확히 구한다(예: `x^3-3x-2=(x+1)^2(x-2)`의 근 `-1`, `2`). 2차 인수의 근이 근호여도 된다(G5b: `x^4-2x^2=x^2(x^2-2)`의 근 `0`, `±sqrt(2)`; `x^3-3x`의 `0`, `±sqrt(3)`; 영역 경계 `from`·`to`, `requiredPoints`의 `"-sqrt(2)"` 같은 정확한 문자열, `intersectionX`에 그대로 쓴다). 1·2차로 풀리지 않는 기약 인수(카르다노가 필요한 삼차·사차)가 남으면 닫힌 형이 없어 `PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM`으로 거절한다. 극점은 조각 안쪽에서 도함수가 0이고 **0이 아닌 첫 고계 도함수의 차수가 짝수**인 점(극대·극소)이며, 변곡점은 극값이 아니다. 극점은 이차 꼭짓점과 같이 `requiredPoints`에 적어야 한다(`PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS`). 독립 관측기는 plan에서 곡선·교점·극점·영역 경계를 SymPy `real_roots`로 따로 계산해 최종 SVG와 대조한다. 삼차 이상의 `coefficients`(이차 전용 형식)는 쓸 수 없고 `pieces`로 쓴다.
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

**직선·세로선.** `lines:[{"id":"g","slope":"-2","intercept":"0"}]`는 `y=slope*x+intercept`(slope 0 허용)를, `{"id":"k","x":"3"}`는 세로선 `x=3`을 그린다. 직선은 그림 영역에 맞춰 잘리고 식(`y=...`, `x=...`)이 직선 옆에 지시선으로 붙는다. 식 대신 다른 글자를 쓰려면 `label`을 준다(예: `"label":"x=k"`). (E31) `label`은 40자 이내의 식으로 수식 조판되고 관측기가 글리프를 읽는다(`OVERLAY_LABEL_TEXT_MISMATCH`). 등호가 하나인 식은 정확히 읽어 그려진 직선과 같은 직선인지 확인한다(`OVERLAY_LABEL_NOT_THE_LINE`; x²·xy는 `OVERLAY_LABEL_NOT_LINEAR`). 문자(`a`)가 들어 있으면 그림이 그린 값을 `"labelValues":{"a":"-2"}`로 주어 확인하거나, 주지 않아 기호식(그대로 보이고 비교하지 않음)으로 둔다(`OVERLAY_LABEL_VALUES_INVALID`, `OVERLAY_LABEL_VALUES_UNUSED`, `OVERLAY_LABEL_VALUES_WITHOUT_LABEL`, `OVERLAY_LABEL_VALUES_WITHOUT_EQUATION`). 등호가 없는 글은 이름으로 보고 비교하지 않는다. 세로선은 `{"id":"k","x":"1","label":"x-1=0"}`처럼 쓴다. 두 점을 잇는 *선분*은 직선이 아니므로 `segments`를 쓴다. (E31) 직선에 `"style":"DASHED"`를 주면 얇은 점선으로 그린다(다른 직선을 평행이동한 직선, 보조 직선; 기본 `SOLID`; 그 밖의 값은 `OVERLAY_LINE_STYLE_INVALID:<id>`). 식 라벨은 실선과 똑같이 놓이고 관측기가 최종 SVG의 점선 여부를 plan과 대조한다(`OVERLAY_LINE_STYLE_MISMATCH:<id>`). **한 점에서 뻗은 직선 묶음**(`y=ax+1`처럼 모두 P(0,1)을 지나는 직선, 점 P에서 두 점으로 가는 선분)의 식·기울기 라벨은 직선과 선분 사이 쐐기가 좁아 긴 글자(`기울기 8/3`)가 들어가지 않을 수 있다. 엔진은 선분·직선의 양 끝과 가운데를 훑고 상자를 옆으로 밀어 가며 지시선 자리까지 찾지만, 쐐기보다 넓은 라벨은 거절되니 짧은 수식 라벨(`8/3`, `y=2x+1`)을 쓰거나 캔버스를 키운다.

**점.** `points`는 최대 12개다(정수 사이마다 x축과 만나는 근 10개를 이름 없는 점으로 찍는 경우 등). 한 점은 다음 중 **하나**로 쓴다.
- `{"id":"A","curveX":"0"}`: 그은 곡선 위의 점(엔진이 y를 정확히 계산). exp-log pair는 `"curve":"<curves의 id>"`를 함께 쓴다. 삼각함수의 `ratePi`(계수 `[A,C]`)·`phase` 문법에서도 된다(`a·f(rate·x+phase)+c`로 계산).
- `{"id":"P","intersect":["g","k"]}`: overlay 직선 두 개의 교점(평행·두 세로선은 거절).
- `{"id":"C","axis":"x","value":"-1-sqrt(7)"}`: 축 위의 점(`axis`는 `x` 또는 `y`).
- `{"id":"Q","x":"3","y":"-6"}`: 좌표를 직접 준 점.

점 id는 영문자로 시작하는 ASCII 12자 이내이고 `requiredPoints`의 id와 겹치면 안 된다. 그림에 보이는 이름은 지금처럼 `pointNames`로 정한다(오버레이 점도 키가 될 수 있다). 곡선 위 점은 그은 정의역 안, 모든 점은 이미 잡힌 그림 영역 안에 있어야 한다. 엔진은 잘못된 점을 담으려고 화면을 억지로 넓히지 않는다(자동 프레이밍은 작성자가 선언한 `domain`·`viewport` 안에서만 오버레이 점을 참고한다).

**선분·보조선.** `segments:[{"id":"AB","from":"A","to":"B","dashed":true}]`는 두 오버레이 점을 잇는다(`dashed` 생략 시 실선). `guides:[{"id":"PA","from":"P","axis":"BOTH"}]`는 점에서 x축·y축으로 내리는 **점선** 보조선이다(`axis`는 `x`, `y`, `BOTH`; 기본 점선). 수선의 발을 따로 찍으려면 `axis` 점을 하나 더 선언한다.

**다각형.** `polygons:[{"id":"T","points":["A","O","C"],"fill":"LIGHT"}]`는 꼭짓점 3~6개(모두 오버레이 점)의 단순 닫힌 다각형을 그린다. `fill`은 `LIGHT`(기본)·`MEDIUM`·`NONE`이고, 칠은 선 아래에 깔린다. 삼각형 OAB처럼 곡선 위 점과 원점으로 만드는 도형에 쓴다. 꼭짓점이 일직선이면 거절한다. 선택 `label`(40자 이내)·`labelKind`(`"MATH"` 기본 | `"TEXT"`)를 주면 그 글자를 다각형 **안 가장 넓은 곳**에 쓴다(예 `{"id":"R","points":["O","A","P","B"],"label":"b"}`, 한글 이름은 `"labelKind":"TEXT"`). 관측기가 라벨 상자의 네 모서리와 중심이 그 다각형 안에 있는지 확인한다(밖이면 `OVERLAY_POLYGON_LABEL_OUTSIDE`).

**점 좌표·선분 길이 라벨.** `points`의 한 점에 `"coordinates":true`를 쓰면 그 점 옆에 좌표를 쓴다. 이름이 있는 점(`pointNames`)은 `A(-6,-3)` 한 덩어리로, 이름 없는 점은 `(-6,-3)`으로 쓰고 점 이름은 따로 붙이지 않는다. 좌표는 정수·분수(`3/2`, `-1/3`: 쌓은 분수로 쓰인다) 또는 **`p+q√r` 꼴 근호 하나**(G5b: `-sqrt(3)`, `1+sqrt(2)`, `(1-sqrt(3))/2`, `33+9*sqrt(13)`; 공통분모 위 한 덩어리로 쓰이고 관측기가 글리프를 따로 읽는다)다. 중첩 근호·근호 둘은 거절한다(`COORDINATE_SURD_FORM_UNSUPPORTED:<id>`, 식 문법 단계에서는 `PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED`). 교점(`intersect`)·축 위 점(`axis`)·곡선 위 점 모두 `"unnamed":true`와 `"coordinates":true`로 `(5/6,1/6)`처럼 쓴다. 이름 없는 교점 둘레에 자리가 없으면 좌표는 가장 가까운 빈 자리로 가서 점에서 시작하는 지시선으로 이어지고, 관측기는 그 지시선이 점에서 시작해 라벨 상자에 닿는지 읽는다(`OVERLAY_COORDINATES_LEADER_NOT_ON_OWNER:<id>`, `OVERLAY_COORDINATES_LEADER_NOT_ON_LABEL:<id>`). `"unnamed":true`는 이름 글자가 없는 점(원문의 이름 없는 교점)이다. `segments`의 한 선분에 `"length":true`를 쓰면 엔진이 두 끝점에서 정확한 길이(정수 또는 `p*sqrt(q)`)를 계산해 선분 옆에 쓴다(그 밖의 길이는 `OVERLAY_SEGMENT_LENGTH_UNSUPPORTED:<id>`). 점·선분의 `"labelDirection"`(`N NE E SE S SW W NW`)은 라벨을 먼저 시도할 쪽 힌트일 뿐 자리는 엔진이 정한다(`OVERLAY_LABEL_DIRECTION_INVALID:<id>`; 라벨이 없는 요소에는 쓰지 못한다). 관측기가 최종 SVG에서 글자(글리프)를 읽어 좌표·길이를 다시 계산한 값과 대조하고, 라벨이 자기 점·선분에 가장 가까운지(옮겨졌으면 지시선이 그 위에서 시작해 라벨에서 끝나는지)까지 확인한다: `OVERLAY_COORDINATES_LABEL_TEXT_MISMATCH`, `OVERLAY_COORDINATES_LABEL_AMBIGUOUS_OWNER`, `OVERLAY_SEGMENT_LENGTH_LABEL_TEXT_MISMATCH`, `OVERLAY_SEGMENT_LENGTH_LABEL_NOT_NEAR_OWNER`, `OVERLAY_SEGMENT_LENGTH_LABEL_AMBIGUOUS_OWNER`, `OVERLAY_POINT_NAME_UNEXPECTED`.

**직선 식 라벨의 자리.** 직선 식 라벨은 먼저 기본 자리(직선의 끝 가까이)에 놓는다. 직선마다 `"labelAt":"START"|"END"|0~1`(왼쪽(세로선은 아래) 끝 가까이 | 오른쪽(위) 끝 가까이 | 왼쪽 끝에서 그 비율)을 주면 식을 그 부분에 두고, 그 부분에 자리가 없으면 다른 곳으로 옮기지 않고 실패한다(`OVERLAY_LINE_LABEL_AT_INVALID:<id>`; 관측기 `OVERLAY_LINE_LABEL_NOT_AT:<id>`). 간격이 몇 px뿐인 평행선은 지시선이 자기 직선에서 시작해 이웃 직선에서 멀어지는 쪽으로 나간다. 밑 곡선이 직선이어서 overlay 직선과 겹쳐 그려져도 그 곡선 위에서 지시선이 시작할 수 있다. 거기에 들어갈 곳이 없을 때만 같은 직선 위의 다른 자리를 찾는다(창 안 구간에서 테두리·축·다른 직선·점에서 먼 곳부터, 가까우면 직선 바로 옆, 멀면 직선 위에서 시작하는 지시선과 함께). 그래서 기울기가 큰 `y=ax`, `y=cx`처럼 원점 가까이에서 직선이 모이는 그림에서도 식이 들어간다. 이미 들어가던 그림의 라벨 자리는 바뀌지 않는다. 관측기는 식 라벨이 자기 직선의 가까이에 있고 다른 직선에 더 가깝지 않은지, 지시선이 있으면 그 직선 위에서 시작하는지 읽는다: `OVERLAY_LINE_LABEL_NOT_NEAR_OWNER:<id>`, `OVERLAY_LINE_LABEL_AMBIGUOUS_OWNER:<id>`, `OVERLAY_LINE_LEADER_NOT_ON_OWNER:<id>`, `OVERLAY_LINE_LEADER_NOT_ON_LABEL:<id>`.

**그림 창과 overlay 직선의 길이** (E31). 자동으로 잡은 창이 원점과 단위점 (1,0), (0,1)을 엄격히 안에 담지 못하면(예: 창의 위쪽이 y=1에 못 미친다) 그림은 창을 전체 폭의 8 %씩 넓혀 그리고, overlay 직선은 그 넓힌 창에서 잘린다. 관측기도 plan에서 같은 규칙으로 최종 창을 따로 계산해 직선의 양 끝을 대조하므로(`OVERLAY_LINE_MISMATCH`) 평행선·한 점에서 뻗은 직선 같은 직선 전용 그림이 창 때문에 거절되지 않는다.

**사분면: `overlays.quadrants`** (E31). `quadrants:[{"id":"q2","quadrant":2,"label":"제2사분면","fill":"LIGHT"}]`는 그래프의 사분면(1~4, 한 번씩)을 칠하거나(`LIGHT`·`MEDIUM`, 원점에서 그림 창 가장자리까지의 직사각형이 곡선·직선 아래에 깔린다) 평문 한국어 이름(12자 이하)을 사분면 안에 쓴다. `label`·`fill` 중 하나는 있어야 하고 plan에 최대 4개다. 거절 코드: `OVERLAY_QUADRANT_INVALID:<id>`, `OVERLAY_QUADRANT_DUPLICATE:<id>`, `OVERLAY_QUADRANT_EMPTY:<id>`, `OVERLAY_QUADRANT_LABEL_INVALID:<id>`, `OVERLAY_QUADRANT_FILL_INVALID:<id>`, `OVERLAY_QUADRANT_ORIGIN_OUTSIDE_VIEW:<id>`. 관측기는 plan의 `quadrants`를 다시 읽어 그려진 축 끝까지의 직사각형(꼭짓점·색조·획 아래), 이름 글자와 사분면 안 위치를 최종 SVG에서 대조한다(`OVERLAY_QUADRANT_FILL_MISMATCH`, `..._FILL_TONE_MISMATCH`, `..._FILL_COVERS_STROKE`, `..._LABEL_TEXT_MISMATCH`, `..._LABEL_OUTSIDE` 등). 그래프 plan에는 `planeMarks`를 쓸 수 없으니 사분면은 이것을 쓴다.

**원: `overlays.circles`** (G6). `circles:[{"id":"C","center":["0","0"],"radiusSquared":"2"}]`(최대 2개, 중심·반지름 제곱은 정수·분수·근호 문자열)는 곡선 위에 원을 **한 배율**로 그린다. **가로·세로 같은 눈금인 그래프(다항·구간별 다항·유리·로그·지수)에서만** 되고, 그 밖의 그래프(절댓값·무리·삼각 등)는 `OVERLAY_CIRCLE_REQUIRES_EQUAL_UNITS`로 거절한다. 로그·지수 그래프(`logarithmic-affine`·`exponential-affine`, 밑이 있는 형태 포함)에 원을 얹으면 엔진이 창을 **두 축 같은 배율로 넓혀** 그린다(곡선 구간과 곡선 값은 그대로이고 창만 커진다). 그래도 원이 반지름 24px보다 작거나 곡선이 48px보다 짧으면 `OVERLAY_CIRCLE_TOO_SMALL_AT_EQUAL_UNITS`·`OVERLAY_EQUAL_UNITS_CURVE_TOO_NARROW`로 거절한다. 창은 원 전체가 들어가게 넓어진다(`OVERLAY_CIRCLE_OUTSIDE_VIEWPORT`). 원 위의 점은 두 방식이다. ① `{"id":"A","curveX":"1","onCircle":"C"}`: 점을 평소처럼 만들고 원 위에 있는지 정확히 검산한다(`OVERLAY_POINT_NOT_ON_CIRCLE`). ② `{"id":"P","intersect":["L","C"],"pick":"MAX_X"}`: 직선과 원의 교점을 엔진이 계산한다(`pick`은 `MIN_X`·`MAX_X`, 세로선은 `MIN_Y`·`MAX_Y`, 접선이면 생략: `OVERLAY_CIRCLE_PICK_REQUIRED`·`OVERLAY_CIRCLE_PICK_INVALID`·`OVERLAY_CIRCLE_LINE_NO_INTERSECTION`). ③ `{"id":"P","intersect":["curve","C"],"pick":"MIN_X"}`: **그려진 곡선과 원의 교점**을 엔진이 계산한다(첫 원소는 `curve`, 곡선 둘인 `exp-log-pair`는 `curve:ID`). 곡선 구간을 훑어 부호가 바뀌는 곳을 모두 찾고 `pick`(`MIN_X`·`MAX_X`, 교점이 하나면 생략)이 고른 근이 **유리수나 한 겹 근호로 정확히 쓰일 때만** 받는다. 쓸 수 없으면 반올림하지 않고 `OVERLAY_CIRCLE_CURVE_INTERSECTION_NOT_EXACT`로 거절한다(`OVERLAY_CIRCLE_CURVE_NO_INTERSECTION`·`OVERLAY_CIRCLE_PICK_REQUIRED`·`OVERLAY_CIRCLE_PICK_INVALID`; 접점(겹근)은 못 찾으니 `curveX`+`onCircle`로 쓴다). 관측기는 곡선 값으로 근을 따로 다시 구한다. **원 안쪽 색칠**: 원에 `"fill":"LIGHT"`(또는 `MEDIUM`)을 쓰면 원판 전체가 윤곽선 아래에 칠해진다(`OVERLAY_CIRCLE_FILL_INVALID`; 칠이 없으면 이전과 바이트가 같다). **원의 활꼴 색칠**: `overlays.circleRegions:[{"id":"S","circle":"C","from":"A","to":"P","side":"BELOW","fill":"MEDIUM"}]`(최대 2개)는 원 위의 두 점 사이 현으로 잘린 조각 중 `side`쪽(현이 세로가 아니면 `ABOVE`·`BELOW`, 가로가 아니면 `LEFT`·`RIGHT`)을 실제 SVG 호와 현으로 칠한다(`OVERLAY_CIRCLE_REGION_INVALID`·`_SIDE_INVALID`·`_FILL_INVALID`, 두 점이 원 위가 아니면 `OVERLAY_POINT_NOT_ON_CIRCLE`). 원과 곡선 사이 영역(곡선 경계)은 아직 없다(다각형으로 근사하지 말 것). 관측기가 호의 반지름·큰호·방향 플래그·세 꼭짓점·색을 다시 읽는다(`OVERLAY_CIRCLE_REGION_MISSING`·`_CORNER_MISMATCH`·`_RADIUS_MISMATCH`·`_ARC_SIDE_MISMATCH`·`_FILL_MISMATCH`, `OVERLAY_CIRCLE_FILL_MISSING`·`_COLOR_MISMATCH`·`_UNDECLARED`). 독립 관측기가 중심·반지름·한 배율을 SVG에서 다시 읽는다(`OVERLAY_CIRCLE_MISSING`·`_CENTER_MISMATCH`·`_RADIUS_MISMATCH`·`_NOT_EQUAL_SCALE`). 예(원 x²+y²=2, 포물선 y=x², 직선 y=tx): `{"capability":"piecewise-polynomial-spike-v1","graphPlan":{"family":"piecewise-polynomial","pieces":[{"coefficients":["0","0","1"]}],"sourceDomain":{"kind":"ALL_REALS"},"requiredPoints":[{"id":"O","x":0,"y":0}],"axisTickValues":{"x":[],"y":[]},"sampleNote":"t=7/10","overlays":{"circles":[{"id":"C","center":["0","0"],"radiusSquared":"2"}],"lines":[{"id":"L","slope":"7/10","intercept":"0"}],"points":[{"id":"P","intersect":["L","C"],"pick":"MAX_X"},{"id":"Q","curveX":"7/10"}],"segments":[{"id":"PQ","from":"P","to":"Q"}]}}}`(`ops/golden/item72g6`).

**좌표 띠에서 점 빼기 `coordinateBand`·로그/지수 자동 라벨 끄기 `hideLabels`** (G6b). 구간별 다항 그래프 plan에 `"coordinateBand":{"hide":["O"]}`(requiredPoints의 id, 1~8개)를 쓰면 그 점은 점과 이름이 그림에 그대로 남고 좌표 띠 줄(`O(0,0)`)만 빠진다(원점에 이름이 이미 서 있을 때). 위치는 그대로 정확히 그려지고 관측기가 확인한다(`COORDINATE_BAND_INVALID`·`COORDINATE_BAND_HIDE_UNKNOWN:<id>`). 로그·지수 plan에 `"hideLabels":["formula","reference","boundary"]`(일부만 가능)를 쓰면 밑이 있는 식(`y=-log_27 x` 같은, 밑이 답일 때 정답을 알려 주는 글자), 기준점 값(`f(1)=0`), 로그 정의역 경계 글자(`x=0`)를 안 쓴다. 점·선은 그대로다(`HIDE_LABELS_INVALID`; `formula`는 밑이 있는 형태에서만).


**원과 곡선 사이 영역·접점·극점 숨기기** (G6c). ① **곡선+원호 영역**: `overlays.circleRegions`에 `{"id":"S1","fill":"LIGHT","label":"S_1","boundary":[{"curve":"curve","fromX":"0","toX":"sqrt(3)"},{"arc":"C","from":"P","to":"O","sweep":"MINOR"}]}`처럼 `boundary`(조각 2~4개)를 쓰면 곡선 조각과 원호로 둘러싸인 닫힌 영역을 칠한다(`label`은 `S_1`처럼 밑줄로 아래첨자, 선택). 조각 `{"curve":"curve"(또는 `curve:ID`, 함수 이름),"fromX","toX"}`는 그은 곡선의 두 x 사이, `{"arc":원id,"from":점,"to":점,"sweep":"MINOR"|"MAJOR"}`는 그 원에서 두 점을 잇는 **짧은/긴 호**(점은 `overlays.points`의 점, 반원이면 `OVERLAY_CIRCLE_REGION_SWEEP_INVALID`)다. 각 조각은 앞 조각이 끝난 점에서 시작하고 마지막은 처음 점에서 끝나야 하며(`OVERLAY_CIRCLE_REGION_BOUNDARY_NOT_CLOSED`), 곡선 끝이 원호와 만나는 점과 호의 두 끝은 정확히 원 위에 있어야 한다(`OVERLAY_CIRCLE_REGION_ENDPOINT_NOT_ON_CIRCLE`). 모르는 곡선 이름은 `OVERLAY_CIRCLE_REGION_CURVE_UNKNOWN`. 이전의 `{circle,from,to,side}` 활꼴 형태는 그대로다. 영역 위 색칠은 곡선·원 선 밑에 깔린다. ② **접점**: `{"id":"O","intersect":["curve","C"],"pick":"TANGENT"}`는 곡선과 원이 **접하는 점(겹근)**이다. 다항·구간별 다항·유리 곡선은 잔차 다항식의 겹근을 정확히 구하고(접점이 없으면 `OVERLAY_CIRCLE_CURVE_TANGENT_NOT_FOUND`, 둘 이상이면 `OVERLAY_CIRCLE_CURVE_TANGENT_AMBIGUOUS`), 로그·지수·무리·삼각처럼 정확한 겹근 계산이 없는 곡선은 `OVERLAY_CIRCLE_CURVE_INTERSECTION_NOT_EXACT`로 거절한다. `MIN_X`·`MAX_X`도 겹근을 후보로 센다. 관측기는 곡선 기울기와 원의 접선 기울기가 같은지까지 독립으로 확인한다. ③ **극점은 `requiredPoints`에 쓰고 좌표 띠에서만 뺀다**: 구간별 다항 그래프의 극값·꺾인 점은 `requiredPoints`에 있어야 하지만(`PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS`), `"coordinateBand":{"hide":["M1","M2"]}`에 넣으면 점은 정확한 자리에 그대로 그려지고 관측기가 검사하며 좌표 띠 줄만 빠져 띠가 넘치지 않는다. 숨긴 점의 좌표 글자가 그림에 남으면 `COORDINATE_BAND_HIDDEN_POINT_SHOWN`이다. 같은 자리에 접점 `overlays.points`를 하나 더 두어야 호의 끝으로 쓸 수 있다(극점 id와 겹칠 수 없다: 극점 id는 `requiredPoints`, 호 끝은 `overlays.points` 점; 이름 없는 점이면 `"unnamed":true`).

**격자점: `overlays.latticePoints`.** 곡선 아래(또는 위)의 정수 좌표 점을 엔진이 정확히 세어 이름 없는 작은 점으로 그린다(plan당 하나, 점은 최대 40개, 열은 최대 12개). `{"region":"BELOW_CURVE","xRange":[1,7],"yMin":1,"strict":true,"counts":true}`: 열 `x=1..7`에서 `yMin`부터 곡선 **아래** 점(`strict` 기본 true는 곡선 위의 점을 뺀다, false면 곡선 위의 점도 넣는다)이다. `"region":"ABOVE_CURVE"`는 곡선 위 점을 `yMax`(필수, `yMin` 쓰지 못함)까지 센다. `exp-log-pair`는 `"curve":"<curve id>"`를 함께 쓴다. `"counts":true`는 열마다 점의 개수를 쓴다(x축 아래에 40 px 이상 자리가 있으면 각 열 아래 한 줄로, 없으면 열의 맨 위 점 옆에). 관측기가 같은 입력에서 정수 점을 다시 세어 그림의 점과 하나하나 대조하고(빠지거나 남는 점, 큰 점, 개수 글자, 열 소속) 어긋나면 FAIL이다. 거절 코드: `OVERLAY_LATTICE_INVALID`, `OVERLAY_LATTICE_REGION_INVALID`, `OVERLAY_LATTICE_RANGE_INVALID`, `OVERLAY_LATTICE_BOUND_INVALID`, `OVERLAY_LATTICE_TOO_MANY`, `OVERLAY_LATTICE_EMPTY`, `OVERLAY_LATTICE_POINT_COINCIDES:<x,y>`(이름 있는 점과 같은 자리), `OVERLAY_POINT_OUTSIDE_VIEWPORT:lattice`, `OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:lattice`, `OVERLAY_LATTICE_COLUMN_UNDEFINED:<x>`(그 열에서 곡선이 정의되지 않음). 관측기 코드: `OVERLAY_LATTICE_POINT_MISSING:<x,y>`, `OVERLAY_LATTICE_POINT_UNEXPECTED:<id>`, `OVERLAY_LATTICE_DOT_SIZE:<id>`, `OVERLAY_LATTICE_COUNT_LABEL_MISSING`, `OVERLAY_LATTICE_COUNT_LABEL_TEXT_MISMATCH`, `OVERLAY_LATTICE_COUNT_LABEL_NOT_IN_COLUMN`, `OVERLAY_LATTICE_COUNT_LABEL_AMBIGUOUS_OWNER`.

**표시 창: `graphPlan.displayWindow` (반비례 `y=k/x`).** 자동으로 잡는 창은 두 가지가 다 보이게 극을 가운데 두므로 원점 근처의 작은 도형(예: 변이 4인 정사각형)이 작아진다. 이때 `"displayWindow":[xmin,xmax,ymin,ymax]`로 보일 창을 직접 정하면 그 창이 그림의 틀이 된다(가로·세로 같은 눈금, 가로 448 px, 세로는 창의 비율대로이고 y 범위는 정수 픽셀 높이가 되도록 한 픽셀 미만만 넓어진다). 곡선은 창에서 잘리고 창 밖의 가지·점근선은 그리지 않는다. 눈금은 `axisTickValues`를 주지 않으면 1·2·5×10^k 간격으로 축마다 최대 8개를 자동으로 잡는다. 원점이 창 안에 있어야 하고(`DISPLAY_WINDOW_MUST_CONTAIN_ORIGIN`), 창이 너무 납작하거나(`DISPLAY_WINDOW_TOO_FLAT`, 세로가 160 px 미만) 너무 길거나(`DISPLAY_WINDOW_TOO_TALL`, 640 px 초과) 극이 창의 가장자리에 딱 걸리거나(`DISPLAY_WINDOW_POLE_ON_EDGE`) 곡선이 하나도 안 보이면(`DISPLAY_WINDOW_CURVE_NOT_VISIBLE`) 거절한다. 그 밖의 코드: `DISPLAY_WINDOW_INVALID`, `DISPLAY_WINDOW_FORBIDS_AXIS_SQUEEZE`, `DISPLAY_WINDOW_UNSUPPORTED_FAMILY`, `DISPLAY_WINDOW_REQUIRES_INVERSE_PROPORTION`, `REQUIRED_GRAPH_POINT_OUTSIDE_DISPLAY_WINDOW:<id>`, 창 밖의 오버레이 점은 `OVERLAY_POINT_OUTSIDE_VIEWPORT:<id>`(엔진은 창을 넓혀 주지 않는다). `formulaLabel`의 자리는 창에서 곡선 가까이(곡선에서 28~120 px) 다른 것들에서 가장 먼 빈 곳으로 정한다. 그 자리가 마땅치 않으면 `"formulaAt":[x,y]`(창 안의 좌표)로 직접 정한다(라벨은 그 근처에 놓이고, 관측기가 110 px 안인지 읽는다: `FORMULA_LABEL_NOT_AT_ANCHOR`; 코드 `FORMULA_AT_INVALID`, `FORMULA_AT_OUTSIDE_WINDOW`, `FORMULA_AT_REQUIRES_DISPLAY_WINDOW`, `FORMULA_AT_UNSUPPORTED_FAMILY`). 표시 창을 쓰면 직선 식 라벨도 처음부터 "자기 직선에 가장 가까운 자리, 아니면 지시선" 규칙으로 놓는다(좌표·길이·격자점 라벨을 쓸 때와 같다). 관측기는 창 자체(`DISPLAY_WINDOW_VIEWPORT_MISMATCH`)와, 정확한 곡선이 창 안에 만드는 가지가 그림에 있는지(`RATIONAL_WINDOW_BRANCH_MISSING:<left|right>`, `RATIONAL_WINDOW_BRANCH_UNEXPECTED:<left|right>`)를 계수에서 다시 계산해 대조한다.

**밑 직선의 식 라벨** (E31): 그은 곡선이 한 조각 직선이면 그 식을 `overlays.names`의 `{"id":"nb","text":"x+y-4=0","labelKind":"MATH","curveX":"0"}`로 직선 옆에 쓴다(`curveX` 자리만 되고, `text`는 40자 이내 식으로 수식 조판된다; 한 줄 식은 `labelValues:{"a":"1"}`로 값을 알릴 수 있다). 등호가 하나인 식은 정확히 읽어 그은 직선과 같은 직선인지 엔진과 관측기가 따로 확인한다(`OVERLAY_NAME_NOT_THE_CURVE:<id>`, x²·xy는 `OVERLAY_NAME_NOT_LINEAR:<id>`, `OVERLAY_NAME_VALUES_INVALID:<id>`). 문자가 있는 식은 기호식으로 쓴 그대로 보인다. **정의역을 제한한 직선**(`-11≤x≤3`에서만)은 `sourceDomain:{"kind":"INTERVAL","range":["-11","3"],"states":["CLOSED","CLOSED"]}`와 같은 `domain`으로 쓰면 직선이 끝점에서 멈추고 끝점에 점이 찍히며, 끝점 좌표는 `curveX` 점의 `coordinates:true`(`(3,-2/3)`처럼 분수도 된다)로 쓴다. `ALL_REALS`에 `domain`만 좁히면 직선이 끝점을 넘어 그려진다.

**이름(한글 글자) 라벨: `overlays.names`.** 원문 그림이 직선·곡선 옆에 "토끼", "거북이"처럼 **이름을 글자로** 써 둔 경우에 쓴다(식 라벨 `label`은 영문·수식만 되고 한글은 `OVERLAY_LABEL_INVALID`다). `names:[{"id":"nT","text":"거북이","segment":"sT"},{"id":"nR","text":"토끼","curveX":"50","labelDirection":"N"}]`처럼 한 항목은 이름 `text`와 **자리 하나**를 쓴다: `segment`(overlay 선분 id, 선분 옆에 놓이고 멀어지면 지시선이 선분에서 이름까지 이어진다), `line`(overlay 직선 id), `curveX`(그은 곡선 위 x 값, 그 점 옆에 놓인다; exp-log pair는 `curve`도). `text`는 한글·영문·숫자·공백·괄호 1~10자(앞뒤 공백 없이)이고 수식이 아니라 글자로 쓰인다. `labelDirection`(`N NE E SE S SW W NW`)은 먼저 시도할 쪽 힌트다. 한 그림에 4개까지. 곡선 이름은 곡선에서 18 px 안, 이름 옆에 다른 선분·직선이 더 가깝지 않아야 한다. 거절 코드: `OVERLAY_NAME_INVALID:<id>`(항목 모양·자리가 하나가 아님), `OVERLAY_NAME_TEXT_INVALID:<id>`, `OVERLAY_NAME_TARGET_UNKNOWN:<id>`, `OVERLAY_NAME_OUTSIDE_VIEWPORT:<id>`(곡선 위 자리가 그림 밖), `OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:<id>`. 관측기는 이름 글자가 라벨 그룹에 그대로 있는지(수식 글리프가 아닌지), 선분·직선 이름은 그 선분·직선이 주인이고 가장 가깝거나 지시선이 그 위에서 시작하는지, 곡선 이름은 곡선 위 자리 가까이에서 그 곡선에 가장 가까운지 최종 SVG에서 읽는다: `OVERLAY_NAME_LABEL_MISSING`, `OVERLAY_NAME_LABEL_TEXT_MISMATCH`, `OVERLAY_NAME_LABEL_OWNER_MISMATCH`, `OVERLAY_NAME_LABEL_NOT_NEAR_OWNER`, `OVERLAY_NAME_LABEL_AMBIGUOUS_OWNER`, `OVERLAY_NAME_LEADER_NOT_ON_OWNER`, `OVERLAY_NAME_LEADER_NOT_ON_LABEL`, `OVERLAY_NAME_LABEL_NOT_AT_CURVE`, `OVERLAY_NAME_LABEL_NOT_NEAR_CURVE`.

**한도와 오류.** 직선 6, 점 12, 선분 6, 보조선 4, 다각형 2, 이름 4, 지시선 라벨(`callouts`) 6, 직각 표시(`rightAngles`) 3, 각 호(`angles`) 4, 같은 각 묶음(`equalAngles`) 2개까지다. 거절 코드: `OVERLAY_PLAN_INVALID`, `OVERLAY_TOO_MANY:<kind>`, `OVERLAY_ID_INVALID:<kind>`, `OVERLAY_ID_DUPLICATE:<id>`, `OVERLAY_POINT_ID_CONFLICT:<id>`, `OVERLAY_POINT_INVALID:<id>`, `OVERLAY_POINT_UNKNOWN:<id>`, `OVERLAY_POINT_NOT_ON_CURVE:<id>`, `OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:<id>`, `OVERLAY_POINT_OUTSIDE_VIEWPORT:<id>`, `OVERLAY_CURVE_REQUIRED:<id>`, `OVERLAY_CURVE_UNKNOWN:<id>`, `OVERLAY_LINE_INVALID:<id>`, `OVERLAY_LINE_PARALLEL:<id>`, `OVERLAY_LINE_OUTSIDE_VIEWPORT:<id>`, `OVERLAY_SEGMENT_INVALID:<id>`, `OVERLAY_SEGMENT_DEGENERATE:<id>`, `OVERLAY_GUIDE_INVALID:<id>`, `OVERLAY_POLYGON_INVALID:<id>`, `OVERLAY_POLYGON_DEGENERATE:<id>`, `OVERLAY_POLYGON_LABEL_INVALID:<id>`, `OVERLAY_POLYGON_LABEL_KIND_INVALID:<id>`, `OVERLAY_POLYGON_LABEL_KIND_WITHOUT_LABEL:<id>`, `OVERLAY_FILL_INVALID:<id>`, `OVERLAY_VALUE_INVALID:<id>`, `OVERLAY_LABEL_INVALID:<id>`, `OVERLAY_BASE_INVALID`. `OVERLAY_POINT_OUTSIDE_VIEWPORT`가 나면 점이 화면 밖이라는 뜻이니 `domain`/`viewport`를 넓히거나(같은 배율 유지) 그 점을 빼고, `OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN`이면 곡선이 그 x에서 정의되지 않거나 그은 정의역 밖이다.

**지시선 라벨: `overlays.callouts`, 극점 숨기기, 색 묶음, 분수 길이, 문자 좌표 이름** (G12). 사용자 원칙은 "헷갈리는 점이나 빠진 라벨은 그 점에서 지시선을 빼서 단다"이다.
- **`callouts:[{"id":"cf","point":"P","text":"f(a)","direction":"W"}]`**(최대 6개): 짧은 라벨을 빈 곳까지 빼내 **그 점의 점 위에서 시작하는 지시선**으로 잇는다. `point`는 `overlays.points`의 id 또는 점이 그려지는 `requiredPoints`의 id이고, `text`는 짧은 식(`f(a)`, `a`, `2k`; 12자 이내, 수식으로 조판)이거나 한글(`극대`, `접점`; 10자 이내, 글자로 쓰임; `labelKind`로 `TEXT`·`MATH`를 정할 수 있다)이다. `direction`(`N NE E SE S SW W NW`)은 먼저 시도할 쪽이다. 라벨이 선·점 가까이 서면 어느 것의 라벨인지 헷갈려 `OVERLAY_NAME_LABEL_AMBIGUOUS_OWNER`로 거절되는 곳(곡선 위 점의 `f(a)`)에 쓴다. 관측기는 라벨의 글자·주인, 지시선이 그 점 위에서 시작해 라벨 상자에 닿는지, 지시선이 다른 선을 가로지르지 않는지, 라벨이 선 위에 앉지 않았는지 읽는다. 거절 `OVERLAY_CALLOUT_INVALID|_POINT_UNKNOWN|_POINT_HIDDEN|_TEXT_INVALID|_DIRECTION_INVALID:<id>`, 관측 `OVERLAY_CALLOUT_LABEL_MISSING|_OWNER_MISMATCH|_TEXT_MISMATCH|_LEADER_MISSING|_LEADER_NOT_ON_OWNER|_LEADER_NOT_ON_LABEL|_LEADER_TOO_SHORT|_LEADER_CROSSES_STROKE|_LABEL_ON_STROKE:<id>`. 자리가 없으면 `LAYOUT_INVENTORY_INCOMPLETE overlay-callout-<id>`이니 `direction`을 바꾼다. 예(`ops/golden/item103g12`): `"callouts":[{"id":"ta","point":"A","text":"접점","direction":"SE"}]`.
- **`requiredPoints[].marker:"NONE"`**(구간별 다항): 틀과 주장(극점·꺾인 점은 `requiredPoints`에 있어야 한다)에는 쓰이지만 **그림에는 점·이름·좌표 어느 것도 그리지 않는다**. 삼차의 극점이 풀이가 쓰는 접점 바로 옆에 점을 하나 더 만들 때 쓴다(`pointNames`·`callouts`에는 넣지 않는다; `REQUIRED_POINT_MARKER_INVALID:<id>`, 점이 보이면 `PIECEWISE_POLY_KEY_POINT_MARKER_SHOWN`).
- **색 묶음**(C1 팔레트 `BLUE WARM GREEN ROSE VIOLET`): `overlays.lines[].color`(선), `overlays.segments[].color`(실선 선분), `overlays.polygons[].fill`(`LIGHT|MEDIUM|NONE` 또는 팔레트 색: 칠과 테두리가 같은 색), `graphPlan.curveColor`(구간별 다항·구간별 불연속의 곡선), `referenceCurves[].color`(SHARED의 g는 `DASHED`를 함께 쓰고 `ACCENT`와는 못 쓴다). 같은 색 = 같은 것(같은 넓이, 접선과 그 삼각형, 한 곡선)이고 한 그림에 2~3색까지다. 관측기는 최종 SVG의 획·칠 색을 plan의 색 이름과 대조한다(`OVERLAY_COLOR_INVALID:<id>`, `OVERLAY_COLOR_MISMATCH:<id>`). 필드가 없으면 색이 없고 그림은 이전과 바이트가 같다. 예(`ops/golden/item104g12`): 삼각형 `{"id":"T1","points":["O","P1","Q1"],"fill":"BLUE"}`, 그 변 `{"id":"M1",...,"color":"BLUE"}`.
- **유리함수 점근선 라벨 자리 `asymptoteLabelAt`**(`rational-spike-v1`, 일차/일차): 기본은 가로 72 %·점근선 위 7 %라 곡선이 그 위를 지나면 곡선의 라벨처럼 읽힌다. `"asymptoteLabelAt":"END"`(또는 `START`)는 `y=2`를 점선의 그 쪽 끝 곁, **곡선이 없는 쪽**에 둔다(상수 분자 `y=k/(…)`는 `ASYMPTOTE_LABEL_AT_UNSUPPORTED`, 다른 값은 `ASYMPTOTE_LABEL_AT_INVALID`). 관측기는 끝 가까이·점선 가까이·곡선 반대쪽·곡선에 닿지 않음을 읽는다(`ASYMPTOTE_LABEL_NOT_AT_END`, `ASYMPTOTE_LABEL_ON_CURVE_SIDE`, `ASYMPTOTE_LABEL_TOUCHES_CURVE`). 예: `ops/golden/item106g12`.
- **분수 길이·문자 좌표 이름**: `segments[].length:true`는 길이가 분수(`3/2`, `9/8`)여도 쌓은 분수로 쓴다(정수·`p*sqrt(q)`는 그대로). 점 좌표 라벨의 분수는 `coordinates:true`로 이미 된다(`(3/2,-9/4)`). `pointNames`에 `{"P":"(2,k)"}`처럼 **문자가 하나 이상 든 좌표쌍**(정수 또는 한 글자: `(2,k)`, `(a,0)`, `(k,-1)`)을 쓰면 그 점의 이름으로 그려진다. 점의 실제 좌표와 대조하지 않고 이름으로만 본다(그 점에 `coordinates:true`를 함께 쓰면 `POINT_DISPLAY_NAME_NOT_FOR_COORDINATES:<id>`).

**그래프 위 직각 표시·같은 각 호, 세로 점근선 라벨 자리** (G13a). 해설이 "두 접선이 수직", "C에서 x축에 수직", "각의 이등분선(같은 두 각)"이라고 말하면 캡션 글만으로 두지 말고 **그림 위에 표시**한다(옵트인, 필드가 없으면 그림은 이전과 바이트가 같다).
- **`overlays.rightAngles`**(최대 3개): `{"at":"C","from":["A","B"]}`는 꼭짓점 C에서 반직선 C→A, C→B 사이에 **직각 사각형(변 16 px)**을 그린다. `at`·`from`은 `overlays.points`의 id이거나 정확한 `x`·`y`가 있는 `requiredPoints`의 id다. 또는 `{"lines":["TA","TB"],"side":"S"}`로 두 overlay 직선이 만나는 곳에 그린다(네 직각 중 가운데가 화면의 `side`(`N NE E SE S SW W NW`, 기본 `N`) 쪽을 향하는 것). 엔진은 두 방향이 **정확히 수직**(내적 0, 정확값)일 때만 그리고, 아니면 `GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR:<id>`로 거절한다(검사를 고치지 말고 점·주장을 고친다). 수직 직선 `x=a`와 `slope:"0"` 직선도 수직이다.
- **`overlays.angles`**(최대 4개): `{"at":"P","from":"A","to":"Q","color":"BLUE","arcs":1}`은 P에서 반직선 P→A, P→Q 사이 각(5°~175°)의 호와 부채꼴을 그린다(호는 반직선 길이에 비례해 커진다). **`overlays.equalAngles`**(최대 2개): `{"angles":[0,1],"color":"BLUE","arcs":2}`는 `overlays.angles`의 0번·1번 각(목록 위치)을 **같은 색**으로 묶는다. 엔진은 두 각을 정확히 비교해 다르면 `GRAPH_EQUAL_ANGLES_MISMATCH:<id>&<id>`로 거절한다(한 색 = 한 크기; 색을 쓴 각끼리도 같은 검사). 예: `y=4-x²`의 P에서 이등분선 PQ — `"angles":[{"at":"P","from":"A","to":"Q"},{"at":"P","from":"Q","to":"B"}],"equalAngles":[{"angles":[0,1],"color":"BLUE"}]`.
- **한 배율 조건**: 두 표시 모두 x·y 단위가 같아야 화면에서 진짜 각으로 보인다. 틀을 잡을 때 한 축을 눌렀으면(`axisRatio`≠1) `GRAPH_RIGHT_ANGLE_UNEQUAL_UNITS` / `GRAPH_ANGLE_UNEQUAL_UNITS`로 거절한다 — 창을 바꾸거나 표시를 뺀다. 그 밖의 거절: `GRAPH_RIGHT_ANGLE_INVALID|GRAPH_ANGLE_INVALID|GRAPH_EQUAL_ANGLES_INVALID:<id>`(모르는 키·잘못된 목록), `GRAPH_ANGLE_POINT_UNKNOWN:<id>`(점 이름 없음), `GRAPH_ANGLE_DEGENERATE:<id>`(반직선 길이 0, 5° 미만·175° 초과), `GRAPH_ANGLE_RAY_TOO_SHORT:<id>`(반직선이 직각 24 px·호 44 px보다 짧음: 더 먼 점을 고른다).
- 관측기는 plan에서 꼭짓점·반직선·각을 다시 구해 최종 SVG의 표시가 그 꼭짓점에 있는지, 다리가 이름 붙인 반직선을 따르는지, 직각 사각형이 정사각형(16 px)인지, 호가 한 반지름으로 정확한 각을 이루는지, 색이 plan과 같은지 읽는다(`GRAPH_RIGHT_ANGLE_MARK_MISSING|_NOT_AT_VERTEX|_NOT_SQUARE|_LEGS_MISMATCH`, `GRAPH_ANGLE_MARK_MISSING|_NOT_AT_VERTEX|_LEGS_MISMATCH|_VALUE_MISMATCH`, `GRAPH_ANGLE_SECTOR_MISSING`, `GRAPH_ANGLE_COLOR_MISMATCH`). 예(`ops/golden/item109g13a`): 미적분 접선 두 개의 교점 C에서 `"rightAngles":[{"at":"C","from":["A","B"]}]`.
- **`graphPlan.verticalAsymptoteLabelAt`**(유리함수 `rational-spike-v1`): 자동 라벨 `x=p`는 기본으로 점선 곁 위쪽, 7 % 옆에 서서 점근선이 y축 가까이에 있으면 **y축의 라벨처럼** 읽힌다. `"TOP_LEFT"|"TOP_RIGHT"|"BOTTOM_LEFT"|"BOTTOM_RIGHT"`는 라벨을 점선의 그 쪽(왼/오른), 그 끝(위/아래)에 붙인다. **곡선이 없는 쪽을 고른다**(극 근처 가지는 한쪽은 위로, 다른 쪽은 아래로 간다). 고른 자리를 곡선이나 축이 잡고 있으면 레이아웃이 라벨을 밀어내고 관측기가 `VERTICAL_ASYMPTOTE_LABEL_NO_ROOM`으로 거절한다. `"NONE"`은 자동 라벨을 끈다(그림에 `x=p`를 읽는 라벨이 하나는 있어야 하고 없으면 `VERTICAL_ASYMPTOTE_LABEL_MISSING`; 보통 `overlays.callouts`로 점근선 위 점에 단다). `VERTICAL_ASYMPTOTE_LABEL_AT_INVALID`(다섯 값이 아님), `VERTICAL_ASYMPTOTE_LABEL_AT_UNSUPPORTED`(세로 점근선이 없는 plan: 뚫린 점 등). 관측기는 점선에서 40 px 안·정한 쪽·정한 끝·y축보다 점선에 더 가까움을 읽는다(`_NOT_AT_LINE`, `_WRONG_SIDE`, `_WRONG_END`, `_NEAR_Y_AXIS`).
- **자동 라벨 숨김·주어진 꼴 `graphPlan.hideLabels` / `graphPlan.formulaTex`**(유리함수 `rational-spike-v1` 일차/일차, 무리함수 `sqrt-affine-spike-v1`): 점근선 값이 정답이거나(24 효천고 q1), 자동 식 꼴 `(-4*x-4)/(x-1)`이 해설 꼴 `-8/(x-1)-4`와 달라 헷갈리거나(25 금당고 q9), 식 라벨 자리가 없을 때(25 팔마고 q23) 쓴다. `hideLabels`는 겹치지 않는 이름의 목록이다. 유리함수는 `"formula"`(식 글자)·`"asymptotes"`(`x=p`·`y=q` 글자), 무리함수는 `"formula"`·`"start"`(`x=끝`, 정의역·치역 부등식 글자)를 고른다. **점선과 점은 그대로 그려지고 글자만 빠진다.** `formulaTex`는 식 라벨을 주어진 꼴로 쓰게 한다(예 `\frac{-8}{x-1}-4`, `2\sqrt{x+1}-1`; 분수 앞에 붙은 빼기 `-\frac{8}{x-1}-4`는 실제 그림에서 식 라벨 자리를 못 찾아 `LAYOUT_INVENTORY_INCOMPLETE`(unresolved formula)가 나므로 `\frac{-8}{x-1}-4`처럼 분자 안에 쓴다; `\frac`·`\sqrt`·`\cdot`와 ASCII 수식만). 엔진도 독립 관측기도 그 식을 따로 읽어 plan의 함수와 40개 점에서 같은지 수치로 확인하고, 다른 함수면 `FORMULA_TEX_NOT_THE_FUNCTION`으로 거절한다. 최종 SVG에서 숨기라고 한 글자가 그려져 있으면 `HIDDEN_LABEL_SHOWN:<이름>`, 숨기지 않은 식 라벨이 없으면 `FORMULA_LABEL_MISSING`이다. `hideLabels`에 `"asymptotes"`를 쓰면서 `asymptoteLabelAt`·`verticalAsymptoteLabelAt`을 주는 것, `formulaTex`와 `"formula"` 숨김을 같이 쓰는 것, 정의되지 않은 이름은 `HIDE_LABELS_INVALID`이고 반비례(분자가 상수)에는 쓸 수 없다(`HIDE_LABELS_UNSUPPORTED_FOR_INVERSE_PROPORTION`, 그 계열은 `formulaLabel`을 쓴다). 오류 코드: `HIDE_LABELS_INVALID`, `FORMULA_TEX_INVALID`, `FORMULA_TEX_NOT_THE_FUNCTION`, `FORMULA_TEX_ASCII_MISMATCH`, `HIDDEN_LABEL_SHOWN:<name>`, `FORMULA_LABEL_MISSING`.
- **근호 길이 라벨**: `overlays.segments[].length:true`가 `√2`처럼 근호인 길이를 쓰는 그림도 통과한다(관측기가 MathJax의 글리프 순서, 곧 근호 안 숫자가 근호 기호보다 먼저인 순서로 읽는다. 값이 다르면 여전히 `OVERLAY_SEGMENT_LENGTH_LABEL_TEXT_MISMATCH`). 길이 라벨의 지시선도 선언된 덧그림으로 인정된다.

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

- `pieces`는 왼쪽부터 1~12개다. 각 조각은 `{"coefficients":[상수, x, x²], "domain":[lo, hi], "start":"OPEN"|"CLOSED", "end":"OPEN"|"CLOSED"}`이고 계수는 3-4와 같은 정확한 문자열(정수·분수·`p+q*sqrt(r)`, 한 plan에 근호 하나)이다. 차수는 2 이하(일차식은 두 개, 상수는 한 개)다.
- `domain`의 두 끝은 정확한 값 또는 `null`이다. `null`은 무한 구간이며 **첫 조각의 왼쪽 끝과 마지막 조각의 오른쪽 끝에만** 쓸 수 있다. 그 끝은 그림 패널 끝까지 그려진다.
- `start`/`end`는 그 끝을 포함하는지다(기본 `CLOSED`). **조각은 자기 구간 위에만 그려지므로 점프한 두 조각 사이에 이어지는 선이 생기지 않는다.** 엔진이 열린 끝은 빈 점, 닫힌 끝은 채운 점으로 그린다. 저자는 점을 직접 쓰지 않는다.
- **경계의 함수값은 정확히 하나로 정해져야 한다.** 같은 x에서 두 조각이 만날 때 한쪽 끝이 `CLOSED`이면 그 값이 함수값이고, 양쪽이 모두 `OPEN`이면 `jumpValues`에 `{"x","y"}`를 써야 한다(없으면 `PIECEWISE_DISCONTINUITY_UNDECLARED`). 쓴 값이 닫힌 끝의 값과 다르면 `PIECEWISE_VALUE_CONFLICT`이고, 같은 x에서 양쪽이 모두 `CLOSED`이면 `PIECEWISE_DOMAIN_OVERLAP`이다. 조각이 겹쳐도 `PIECEWISE_DOMAIN_OVERLAP`이다.
- `jumpValues`는 **어느 조각도 정의되지 않은 x의 고립점** `f(a)=c`에도 쓴다(예: 위 예의 `P(1,1)`). 채운 점으로 그려진다. 최대 8개.
- **계단함수**는 `pieces` 대신 `"step":{"values":["1","2","1"],"xFrom":0,"xTo":3}`로 쓴다. `[xFrom,xTo]`를 같은 폭으로 나눠 i번째 값이 i번째 칸에 놓이고(왼쪽 닫힘·오른쪽 열림, 마지막 칸은 `xTo`에서 닫힘), 칸 수는 6 이하이다. `pieces`와 `step`을 함께 쓰면 `PIECEWISE_DISCONTINUOUS_SOURCE_INVALID`이다.
- **수평선** `referenceLines`(최대 3개)는 3-3과 같은 `{"id","y","intersectionX","labelIntersections"}`이다. `intersectionX`에는 함수 전체와의 교점 x를 **하나도 빠짐없이** 쓴다. 높이가 같은 고립점·경계값도 교점이고, **열린 끝은 교점이 아니다.** 조각 하나가 직선과 완전히 겹치면 `PIECEWISE_REFERENCE_LINE_CONTAINS_A_PIECE`, 목록이 엔진 계산과 다르면 `PIECEWISE_INTERSECTION_MISMATCH:<id>:engine finds N intersection(s)`이다.
- `requiredPoints`에는 **각 이차 조각의 꼭짓점이 그 조각 안쪽에 있으면 반드시** 넣는다(`PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS`). 점은 조각 위 또는 고립점의 값 위에 있어야 하고(`PIECEWISE_DISCONTINUOUS_REQUIRED_POINT_NOT_ON_CURVE`), 정수가 아닌 좌표는 `exactCoordinates`로 정확히 쓴다. 점 이름은 한 글자 대문자를 쓴다.
- `axisTickValues`는 눈금을 직접 정할 때만 쓴다. `functionName`(한 글자, y 제외)을 주면 곡선 곁에 `f(x)`가 쓰인다.
- 가로·세로 배율은 같고, 너무 좁으면 엔진이 세로를 최대 1/2까지 줄인다. 표시할 특징끼리 4px보다 가까우면 `PIECEWISE_DISCONTINUOUS_FEATURES_BELOW_RESOLUTION`, 그래도 폭이 모자라면 `PIECEWISE_DISCONTINUOUS_CURVE_TOO_NARROW`이다.

- **접근 화살표 `limitArrows`**(최대 6개): `[{"at":"1","side":"LEFT","toY":"-2"}]`는 곡선 **위**에 점 `(at,toY)`로 다가가는 짧은 화살표(`side`는 접근하는 쪽, `LEFT`/`RIGHT`)와, 그 점에서 두 축까지의 점선(축 위의 점이면 그쪽 점선은 없다)을 그린다. `toY`는 그쪽에서 `at`에 닿는 조각의 극한값과 **정확히 같아야** 한다(`PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_VALUE_MISMATCH`, 한 조각도 없으면 `..._AT_INVALID`). 화살표가 들어갈 곡선이 약 30px보다 짧으면 `..._LIMIT_ARROW_NO_ROOM`이다. 라벨은 `axisTickValues`로 문제가 준 눈금값만 쓴다(점선 곁에 눈금 라벨 자리가 없으면 `LAYOUT_INVENTORY_INCOMPLETE tick-..`: 그 눈금을 뺀다). 독립 관측기가 조각, 접근값, 방향, 화살표 끝 간격과 점선 위치를 plan에서 다시 계산해 최종 SVG와 대조한다.
- **두 함수 위아래 `referenceCurves` + `"layout":"STACKED"`**: `graphPlan`은 f의 plan이고 `"referenceCurves":[{"id":"g","pieces":[...],"jumpValues":[...],"requiredPoints":[],"axisTickValues":{...}}]`가 g다(같은 조각 문법, 함수는 최대 2개). 위 패널 `y=f(x)`, 아래 패널 `y=g(x)`가 **같은 x 창**(`"xWindow":[lo,hi]`, 생략하면 두 함수의 유한한 끝점)과 같은 x 배율로 그려진다. `limitArrows[].curve`("f"/"g")가 화살표가 속한 함수다. 같은 축에 색으로 구분하는 `SHARED`는 없다(`PIECEWISE_DISCONTINUOUS_PAIR_LAYOUT_UNSUPPORTED`). 각 패널은 한 함수 plan이라 위 규칙(조각 최대 8, 한 x에 값 하나)이 그대로 적용된다. 원호(반원, 사분원)는 조각이 아니다(2차 이하 다항식만).
```json
{"capability":"piecewise-discontinuous-spike-v1","graphPlan":{"family":"piecewise-discontinuous","layout":"STACKED","xWindow":[-2,2],
 "pieces":[{"coefficients":["0","1"],"domain":[-2,0]},{"coefficients":["1"],"domain":[0,2],"start":"OPEN"}],
 "referenceCurves":[{"id":"g","pieces":[{"coefficients":["2","-1"],"domain":[-2,1],"end":"OPEN"},{"coefficients":["0"],"domain":[1,2]}],"jumpValues":[]}],
 "limitArrows":[{"curve":"f","at":"0","side":"RIGHT","toY":"1"},{"curve":"g","at":"1","side":"LEFT","toY":"1"}],
 "requiredPoints":[],"axisTickValues":{"x":[],"y":[]}},"caption":"..."}
```

한계와 오류 코드(가짜 지원 없이 거절):
- 조각 13개 이상(계단 `step`은 7칸 이상) `PIECEWISE_TOO_MANY_PIECES`, 잘못된 조각 `PIECEWISE_DISCONTINUOUS_PIECE_INVALID:<n>`, 계수 문법 오류 `PIECEWISE_DISCONTINUOUS_COEFFICIENT_INVALID`, 잘못된 끝 상태 `PIECEWISE_ENDPOINT_STATE_INVALID:<n>`, 계단 구간 오류 `STEP_INTERVAL_INVALID`, 알 수 없는 필드 `PIECEWISE_DISCONTINUOUS_FIELD_UNKNOWN:<field>`.
- **쓰지 않는 필드:** `formula`(불연속함수의 머리줄 식), `domain`, `viewport`는 받지 않는다. 필요하면 caption에 식을 쓰고, 두 함수가 모두 필요하면 아래 **두 함수·접근 화살표**를 쓴다. 그 밖의 경우는 EXEMPT/UNSUPPORTED로 쓴다.
- 수직선, 세로선, 차수 3 이상 조각, 색칠 영역, 기울어진 기준선은 지원하지 않는다. UNSUPPORTED.
- **곡선 이름 자리와 축 변수** (G12-4): `graphPlan.nameLabel:{"at":"END","side":"BELOW"}`(`at`은 `START|MID|END`, `side`는 `BELOW`(기본)|`ABOVE`; `functionName`이 있어야 한다)는 f의 이름 `f(x)`를 곡선의 그 쪽 끝·가운데 곁에 쓴다(없으면 왼쪽 끝 아래). `graphPlan.axisVariable:"m"`(소문자 한 글자, `y`·함수 이름은 안 됨)은 가로축 글자와 함수 이름을 `m`, `g(m)`으로 쓴다(`INVALID_AXIS_VARIABLE`, `CURVE_NAME_LABEL_INVALID`). 관측기는 축 글자·이름 글리프와 이름의 자리(곡선의 그 쪽, 그 쪽 면)를 읽는다(`AXIS_VARIABLE_LABEL_MISMATCH`, `AXIS_VARIABLE_NAME_MISMATCH:<이름>`, `CURVE_NAME_LABEL_NOT_AT_PLACE`). 단일 함수와 `SHARED`에서만 되고 `STACKED`는 `PAIR_STACKED_CURVE_FIELDS_UNSUPPORTED`다. 색(`curveColor`, g의 `color`)과 지시선 라벨(`overlays.callouts`)은 3-14의 G12 절. SHARED 예(`ops/golden/item105g12`): y축 위 점 `ya`·`yf`에 `callouts:[{"id":"cl","point":"ya","text":"a","direction":"W"}]`.


### 3-40. 서로 다른 곡선 2~6개를 한 그림에: `multi-curve-figure-v1`

한 문항의 그림이 **서로 다른 곡선 2~6개**(이차곡선, 직선, 유리함수, 무리함수, 역함수 쌍)로 이루어지거나 둘러싸일 때 쓴다. 한 곡선의 조각(가지)만 있는 그림은 이 기능의 대상이 아니며 기존 family(`piecewise-*`)를 쓴다. 곡선이 둘일 때는 아래 "유리·무리·직선 섞기" 종류(`LINE`·`RATIONAL`·`SQRT`·`inverseOf`)를 쓴다. 실제 예: 22 효천고 2학기 기말 고2 수학II q10의 `y=2-x^2`, `x=2-y^2`, `y=x^2-2`, `x=y^2-2` 네 포물선.

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

- `curves`는 2~6개다. 각 곡선은 `id`(영문 시작, 16자 이내), `kind`, `coefficients`(`[c0,c1,c2]`, x² 또는 y² 계수 `c2`는 0이 아님), `domain`(닫힌 구간의 두 끝)을 쓴다. 계수·끝은 정확한 정수·분수 문자열(또는 한 근호 `p+q*sqrt(r)`)이고 소수를 쓰지 않는다.
- `label`(선택)은 그 곡선 옆에 그릴 정확한 ASCII 수식 문자열이다(`y=2-x^2`, `x=2-y^2`). 기존 수식 라벨 장치로 그려지며, 쓸 수 없는 글자·TeX는 `MULTI_CURVE_LABEL_INVALID:<id>`로 거절된다. 원문 그림이 곡선의 식을 보여 주면 그 식을 그대로 쓴다.
- `kind:"Y_OF_X"`는 `y=c0+c1*x+c2*x^2`를 x 구간 위에 그린다. `kind:"X_OF_Y"`는 `x=c0+c1*y+c2*y^2`를 y 구간 위에 그리며, `branch`로 꼭짓점 위쪽(`POSITIVE`)·아래쪽(`NEGATIVE`)·둘 다(`BOTH`, 기본)를 고른다. 엔진은 이 가지들을 `y(x)` 식으로 정확히 바꿔 그리므로 옆으로 열린 포물선도 학생 화면에는 같은 곡선으로 보인다.
- 가로·세로 배율은 같고, 세로가 너무 길면 최대 1/2까지 줄인다. 좌표축과 눈금은 엔진이 그리며, `axisTickValues`로 눈금을 직접 정할 수 있다. 점 이름·곡선 식 라벨·눈금 라벨이 하나도 없으면 출판 글자 게이트가 막히므로, 다른 라벨이 없을 때는 정확한 눈금 값을 하나 이상 준다.
- `overlays`(선택)는 다른 그래프 계열과 같은 보조 요소 층이다. `lines`(직선 `y=slope*x+intercept`, 세로선 `x=a`), `points`, `segments`, `guides`, `polygons`를 쓸 수 있고, 모든 좌표는 계산된 그림 안에 있어야 한다(엔진이 화면을 몰래 넓히지 않는다). 원문 그림에 그려진 대칭선·보조선은 `overlays.lines`로 그대로 살린다.
- 엔진은 각 곡선·가지를 정확한 구간과 식으로 고정하고, 독립 관측기는 같은 계수에서 모든 가지를 다시 계산해 최종 SVG의 각 polyline(태그 `CURVE_<id>`, `CURVE_<id>_POS`/`_NEG`)이 그 곡선 위에 있는지, 자기 구간·가지를 벗어나지 않는지, 양 끝과 중간 호가 맞는지 확인한다. 하나라도 어긋나면 FAIL이다.
- 오류 코드: `MULTI_CURVE_COUNT_INVALID`(2개 미만·6개 초과), `MULTI_CURVE_FIELD_UNKNOWN:<field>`, `MULTI_CURVE_CURVE_INVALID:<id>`, `MULTI_CURVE_ID_INVALID`, `MULTI_CURVE_KIND_INVALID:<id>`, `MULTI_CURVE_COEFFICIENT_INVALID:<id>`, `MULTI_CURVE_NOT_QUADRATIC:<id>`, `MULTI_CURVE_DOMAIN_INVALID:<id>`, `MULTI_CURVE_BRANCH_INVALID:<id>`, `MULTI_CURVE_BRANCH_EMPTY:<id>`, `MULTI_CURVE_LABEL_INVALID:<id>`, `MULTI_CURVE_FRAME_DEGENERATE`, `MULTI_CURVE_TOO_NARROW`.


**유리·무리·직선 섞기, 곡선별 모양, 역함수 쌍 (G18a).** 위 이차곡선 말고도 `kind`는 다음을 쓸 수 있다. 숫자는 모두 정확한 정수·분수 문자열이다.

```json
{"capability":"multi-curve-figure-v1","graphPlan":{"family":"multi-curve","viewport":[-4,5,-3,4],"curves":[
  {"id":"f","kind":"RATIONAL","numerator":["3","2"],"denominator":["-5","4"],"domain":["-4","5"],"color":"BLUE","label":"y=f(x)"},
  {"id":"g","inverseOf":"f","color":"WARM","label":"y=g(x)"},
  {"id":"yx","kind":"LINE","coefficients":["0","1"],"domain":["-3","4"],"style":"DASHED","label":"y=x"}],
  "axisTickValues":{"x":[],"y":[]}},
 "caption":"f(x)=(2x+3)/(4x-5)와 역함수는 y=x에 대칭이다."}
```

- `LINE`: `coefficients:[c0,c1]` = `y=c0+c1*x`. `RATIONAL`: `numerator:[a0,a1]`, `denominator:[d0,d1]` = `y=(a0+a1*x)/(d0+d1*x)`(분모의 x 계수는 0이 아니고, 분자가 극점에서 0인 구멍은 `MULTI_CURVE_RATIONAL_DEGENERATE`). 극점이 `domain` 안에 있으면 두 쪽이 각각 가지(`CURVE_<id>_L`/`_R`)로 그려지고, 축 위가 아닌 점근선마다 점선 한 줄과 `x=p`·`y=q` 글자가 나온다. `SQRT`: `radicand:[c0,c1]`, `amplitude`(기본 1, 음수 가능), `offset`(기본 0) = `y=offset+amplitude*sqrt(c0+c1*x)`. 시작점에 검은 점과 좌표가 나온다.

- 유리함수의 극점이 정의역 끝점이면 그 끝점은 반드시 열린 끝점(fromState 또는 toState가 OPEN)이어야 한다. 이때 해당 쪽의 한 가지(from이면 CURVE_<id>_R, to이면 CURVE_<id>_L)만 그리고, 극점에는 유한한 끝점 표시를 그리지 않는다. 닫힌 극점 끝점은 거부하며, 정의역 내부 극점은 기존처럼 LEFT/RIGHT 두 가지로 나눈다.
- 이런 곡선은 모양만으로 틀이 정해지지 않으므로 **창** `graphPlan.viewport:[xmin,xmax,ymin,ymax]`를 준다(틀은 이 창에 여백을 둘러 만들고, 곡선은 틀 위·아래에서 잘린다). `domain`을 생략하면 창의 x 범위(`SQRT`는 근호가 0인 점에서 창 끝까지)를 쓴다. 창이 없으면 `MULTI_CURVE_WINDOW_REQUIRED:<id>`.
- `inverseOf:"<앞에 나온 곡선 id>"`는 그 곡선을 `y=x`에 대칭한 곡선이다. 엔진이 정확히 계산하며 `RATIONAL`→`RATIONAL`, `LINE`→`LINE`, `SQRT`→이차곡선 반쪽, 꼭짓점 한쪽만 쓴 이차곡선(`Y_OF_X`)→`SQRT`가 된다. 정의역(`domain`)을 생략하면 원 곡선의 치역(또는 창)을 쓴다. 독립 관측기는 그려진 모든 점을 `y=x`로 뒤집어 원 곡선 위에 있는지 확인한다. 지원하지 않으면 `MULTI_CURVE_INVERSE_UNSUPPORTED:<id>`. `y=x` 직선은 `LINE`(점선 `style:"DASHED"`)으로 그린다.
- 곡선마다 고를 수 있는 모양: `color`(`BLUE|WARM|GREEN|ROSE|VIOLET`), `weight`(`"BOLD"`는 다른 곡선보다 굵게), `style`(`"SOLID"|"DASHED"`), `label`(그 곡선 식 또는 `f(x)` 같은 이름. 새 종류는 `-\frac{8}{x-1}-4` 같은 TeX도 되고 엔진이 ASCII 수식으로 바꿔 그린다), `hideLabel:true`(식 글자를 안 씀), `hideLabels`(`"formula"` 식, `"asymptotes"` 점근선 값 글자, `"start"` 시작점 좌표 중 골라서). 점근선 값이 정답이면 `hideLabels:["asymptotes"]`로 숨긴다. 새 종류는 `label`이 없으면 자동으로 `y=...` 식 글자를 쓴다.
- **곡선 구간 강조 `emphasis`와 정의역 `domain:{from,to}`**(G18a): 곡선 하나의 일부만 굵게·색으로 보이고 싶을 때(`x≥4`, 증가구간 `x≤2`, `2≤x≤a`) 곡선 항목에 `emphasis:[{"from":"2","to":"4","color":"WARM","fromState":"CLOSED","toState":"OPEN"}]`를 쓴다(최대 3개). `from`·`to`를 생략하면 그 곡선의 끝까지, `color` 기본은 `WARM`, `fromState`·`toState`는 `NONE`(기본, 점 없음)·`OPEN`(속이 빈 점)·`CLOSED`(찬 점)이다. 강조 구간은 곡선의 그려지는 구간(`domain`) 안에 있어야 하고 서로 겹치지 않으며, 유리함수의 구간은 극점을 건너지 못한다(`MULTI_CURVE_EMPHASIS_ACROSS_POLE:<id>`). `X_OF_Y` 곡선에는 쓸 수 없다(`MULTI_CURVE_EMPHASIS_UNSUPPORTED:<id>`). 곡선 전체는 얇게 그대로 그려지고 그 위에 강조 구간이 굵게 덧그려진다. `domain`은 `["-1","4"]`와 `{"from":"-1","to":"4"}` 둘 다 쓸 수 있고 곡선은 그 밖을 그리지 않는다. **곡선이 하나여도 `emphasis`가 있으면 그림이 된다**(곡선 수 하한 2는 강조가 없는 곡선에만 적용). 독립 관측기는 강조 폴리라인(`EMPH_<id>_<n>`)이 그 구간 안에서 곡선 위에 있고 굵으며 색이 맞는지, 끝점 점의 위치·속이 빈지 찬지를 확인한다. 오류 코드: `MULTI_CURVE_EMPHASIS_INVALID:<id>`, `MULTI_CURVE_EMPHASIS_UNSUPPORTED:<id>`, `MULTI_CURVE_EMPHASIS_ACROSS_POLE:<id>`.
- 독립 관측기는 곡선마다 색·점선·굵기, 점근선 선 위치, 시작점 점, 가지 끝(틀에 잘린 곳 포함)을 다시 확인한다. 굵은 곡선은 다른 곡선보다 굵어야 한다.
- 오류 코드: `MULTI_CURVE_WINDOW_REQUIRED:<id>`, `MULTI_CURVE_WINDOW_INVALID`, `MULTI_CURVE_COLOR_INVALID:<id>`, `MULTI_CURVE_WEIGHT_INVALID:<id>`, `MULTI_CURVE_STYLE_INVALID:<id>`, `MULTI_CURVE_HIDE_LABELS_INVALID:<id>`, `MULTI_CURVE_RATIONAL_DEGENERATE:<id>`, `MULTI_CURVE_INVERSE_UNSUPPORTED:<id>`.

**가로·세로 눈금을 같게 `equalUnits` (G18b).** 유리함수(일차/일차)와 무리함수 한 개의 그림은 기본 틀이 가로·세로 눈금 길이가 다르다. `y=x` 대칭, 기울기 ±1인 직선, 정사각형·원이 중요한 풀이는 `graphPlan.equalUnits:true`를 쓴다. 가로 한 칸과 세로 한 칸이 같은 길이가 되고(관측기가 ±1px로 확인), 그림은 필요한 만큼 세로로 길어지거나(최대 640) 가로 범위가 넓어진다. `true`만 쓸 수 있고 `axisScale`·`axisSqueeze`와는 함께 못 쓴다(`EQUAL_UNITS_INVALID`). 극점·곡선 끝·원점이 한 눈금 비에서 한 칸 10px 이상, 극점 양쪽 곡선 48px 이상으로 안 담기면 `EQUAL_UNITS_WINDOW_TOO_WIDE`로 거절한다(극점이나 필요한 점을 원점 가까이로 잡거나 쓰지 않는다). 이차·다항·구간별·multi-curve는 원래 한 눈금 비다. `equalUnits`를 쓰지 않은 plan의 그림은 그대로다.

**무리함수 위 직선·점 (G18b).** 무리함수(`sqrt-affine`)에 `overlays`를 쓰면 틀이 원점과 (1,0), (0,1), 선언한 모든 점을 안에 담도록 자동으로 넓어진다(그래서 두 축이 다 보인다). 일반형(`amplitude`·`sign`·`offset`)의 `curveX` 점은 이제 `offset`과 부호를 반영한 곡선 위의 점이다.

**점 옆 설명 `callouts` 글자 (G18b).** 쉼표가 있는 좌표쌍 `(3,4)`, 그리스 문자 `α β γ θ`, 프라임 `′`, 근호 `√`(예: `√(2a)`)가 든 글자는 수식이 아니라 일반 글자로 쓴다(14자까지: 한글·영문·숫자·공백·`( ) , . + - =`와 그 표시). 지시선은 먼저 축·눈금을 가로지르지 않는 자리를 찾고, 없을 때만 가로지른다.

**multi-curve 라벨 자리 (G18b).** 곡선 식 라벨은 자기 곡선 옆(박스와 곡선 사이 20px 이내, 다른 곡선이 더 가깝지 않게), 점근선 값 `x=p`·`y=q`는 자기 점선의 끝(12px 이내, 다른 점선이 더 가깝지 않게), `y=x` 같은 직선 라벨은 오른쪽 위 끝에 선다. 독립 관측기가 `LABEL_NEAREST_CURVE_MISMATCH`, `ASYMPTOTE_LABEL_DETACHED`로 어긋난 라벨을 거절한다. 곡선 옆에 자리가 없는 큰 라벨(작은 창의 분수 식)은 보통 자리에 두고 그 사실을 그림에 표시하며(`data-near-room="NONE"`), 관측기는 자기 곡선이 가장 가까운지(64px 이내, 점근선 값은 40px 이내)만 본다. 그마저 안 되면 `hideLabel`·`hideLabels:["asymptotes"]`로 글자를 빼고 캡션에 쓴다. 선언한 점(`overlays.points`, 직선과 곡선의 교점)이 창 밖이면 multi-curve 틀이 그 점까지 넓어진다.

**영역 색칠 `graphPlan.regions` (multi-curve, G18c).** 풀이가 "두 곡선 사이 넓이", "x<2, y<3인 영역"처럼 **어느 영역인지**를 보여 줘야 하면 multi-curve plan에 `regions`(최대 4개)를 쓴다. 영역은 곡선 한 개만 있어도 그림이 된다. 세 가지 꼴이다.
- 두 곡선 사이: `{"id":"S","between":["f","g"],"from":"3","to":"5"}` (곡선 id 두 개, `"axis"`도 된다. 어느 쪽이 위인지는 엔진이 계산한다), 곡선과 x축 사이는 `{"id":"A","under":"f","from":"-1","to":"1"}`, 곡선과 직선(현) 사이 활꼴은 직선을 `LINE` 곡선으로 두고 `between`으로 쓴다. 두 경계는 `from`~`to` 전체에서 정의되고(유리함수의 극점·무리함수의 시작 앞은 `GRAPH_REGION_BOUNDARY_UNDEFINED`) 서로 엇갈리지 않아야 한다(`GRAPH_REGION_BOUNDARIES_CROSS`: 교점에서 나눠 영역을 둘로 쓴다. 끝점에서 닿는 것은 된다).
- 창 끝까지 가는 영역: `{"id":"R","halfPlane":{"x":"<","value":"2"},"and":{"y":"<","value":"3"}}`(x<2 그리고 y<3). `x`나 `y` 중 하나만 써도 되고(띠), `and`에는 다른 축을 쓴다. 영역은 그림 틀 가장자리까지 열려 있고 바깥 변은 그리지 않는다. 경계선 `x=2`, `y=3`은 `overlays.lines`(`style:"DASHED"`)로 따로 그린다. 값은 창(`viewport`) 안에 있어야 한다(`GRAPH_REGION_EMPTY`).
- 공통 필드: `fill`(`LIGHT` 기본, `MEDIUM`, 색 이름 5개), `label`(영역 안에 쓸 짧은 수식, 40자까지). 영역은 모든 획 아래에 칠해지고 획 같은 테두리가 없다. 오류 코드: `GRAPH_REGION_COUNT_INVALID`, `GRAPH_REGION_FIELD_UNKNOWN:<필드>`, `GRAPH_REGION_FIELD_INVALID:<id>`, `GRAPH_REGION_ID_INVALID`, `GRAPH_REGION_ID_DUPLICATE:<id>`, `GRAPH_REGION_BOUNDARY_UNKNOWN:<id>:<곡선>`, `GRAPH_REGION_BOUNDARY_UNDEFINED:<id>:<곡선>`, `GRAPH_REGION_DOMAIN_INVALID:<id>`, `GRAPH_REGION_BOUNDARIES_CROSS:<id>`, `GRAPH_REGION_EMPTY:<id>`, `GRAPH_REGION_FILL_UNSUPPORTED:<id>`, `GRAPH_REGION_LABEL_INVALID:<id>`. 독립 관측기는 plan에서 경계를 다시 계산해 칠한 면이 두 경계를 따르는지(반평면은 틀 모서리까지 가는지), 획 아래에 있는지, 선언하지 않은 칠이 없는지 확인한다(`GRAPH_REGION_BOUNDARY_MISMATCH`, `GRAPH_REGION_OUTSIDE_INTERVAL`, `GRAPH_REGION_NOT_BENEATH_STROKES`, `GRAPH_REGION_UNDECLARED` 등). 3-6-영역의 `graphPlan.regions`(piecewise-polynomial)와는 따로 쓰는 필드다.

**절댓값 곡선 `abs:true` (multi-curve, G18c).** `LINE`·`RATIONAL`·`SQRT`·이차 `Y_OF_X` 곡선 항목에 `abs:true`를 쓰면 `y=|f(x)|`를 그린다(x축 아래 부분이 위로 접힌다). 접힌 꼭짓점(f가 0인 곳)은 정확한 위치에 점이 찍힌다. 곡선 한 개만 있어도 그림이 된다. 점근선 값은 `|h|`로 바뀌고 자동 식 글자는 `y=abs(...)`이다. `label`에는 `\left|\frac{2x+1}{-x+3}\right|`처럼 TeX 절댓값을 써도 `abs(...)`로 바뀐다. 절댓값 곡선의 `inverseOf`는 일대일이 아니므로 `MULTI_CURVE_INVERSE_UNSUPPORTED:<id>`, `abs`가 불리언이 아니면 `MULTI_CURVE_ABS_INVALID:<id>`. 영역의 경계로도 쓸 수 있다(접힌 곳에서 영역 경계가 꺾인다). 독립 관측기는 곡선을 `|f|`로 다시 계산해 그려진 점과 맞춘다.

**세로로 늘리기 `axisScale`와 가로선 라벨 `ownership` (multi-curve·overlay, G18c).** 가로선이 한 칸(약 22px) 간격으로 모여 있으면(`y=1`, `y=2`, `y=3`) 글자가 선 사이에 못 들어가 `LAYOUT_INVENTORY_INCOMPLETE`가 난다. multi-curve plan도 `graphPlan.axisScale:{"x":1,"y":2}`(세로 눈금을 가로의 2배로, 1/64~64배)를 쓸 수 있어 세로로 늘려 자리를 만든다. 눈금 숫자를 쓰지 않는 그림에만 쓰고 `y=x` 대칭·원이 중요하면 쓰지 않는다. `overlays.lines[].ownership:"NEAREST"`는 그 식 글자가 자기 선에 가장 가깝기만 하면(14px 이내, 다른 선보다 4px 더 가깝게) 놓이게 한다(기본 `STRICT`는 24px 차이를 요구한다). 값이 다르면 `OVERLAY_LINE_OWNERSHIP_INVALID:<id>`.

**G18c 덧붙임.** (1) `axisScale`을 쓴 그래프(확률밀도 그림처럼 세로를 6~20배 늘린 것)는 틀을 원점 (0,1)·(1,0)에 맞춰 넓히지 않는다(예전에는 창이 y=1에 못 미치면 8% 넓어져 `EQUAL_UNIT_SCALE_MISMATCH`가 났다). (2) `axisTickValues`에 분수 문자열 `"1/4"`, `"2/9"`를 쓰면 눈금 글자도 `0.2222…`가 아니라 분수 `2/9`로 쓴다. (3) 점 옆 설명 `callouts`의 지시선은 먼저 아무것도 가로지르지 않는 자리를 찾고, 그림이 빽빽해 없을 때만 축·눈금·점선 안내선을 가로지르는 자리를 쓴다(곡선·선·글자는 끝내 가로지르지 않는다). (4) multi-curve 곡선 식 글자는 자기 곡선 옆을 먼저 찾고, 곡선 셋이 빽빽해 자리가 없으면 더 촘촘히(곡선 가지마다 2% 간격, 더 많은 어긋남) 다시 찾고, 그래도 없으면 자기 곡선의 꼭짓점에서 나오는 지시선으로 빈 곳에 쓴다(관측기는 지시선이 자기 곡선에서 시작해 글자 상자에서 끝나는지 확인한다).


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

