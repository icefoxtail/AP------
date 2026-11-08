# 20 매산고 고2 수학II Q18 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js, pinned main bc47febaf592b4da9614b2695abc9e0851291f5b. 준비된 exact source의 window.questionBank에서 id 18, 1-based ordinal 18를 확인했다. item.json은 정확한 sourcePath와 ordinal을 사용한다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
[단답형3] 최고차항의 계수가 $1$인 삼차함수 $f(x)$에 대하여 $g(x)=f(x)+|f(x)|$가 다음 조건을 만족시킬 때, $\displaystyle\int_1^3 f(x)dx$의 최댓값을 구하시오. [6점]
(가) $g(0)+g(3)=0$
(나) $\displaystyle\int_0^x g(t)dt=0$을 만족시키는 자연수 $x$의 개수는 $1$이다.
(다) $x\ge3$인 실수 $x$에 대하여 $\displaystyle\int_3^x f(t)dt\ge0$이다.
(라) $f(x)=0$의 근은 모두 정수이다.
~~~

## 원문 선택지 (정확 문자열)

~~~text
(선택지 없음: 단답형 문항)
~~~

## 원문 정답 (정확 문자열)

~~~text
$\dfrac{4}{3}$
~~~

## 원문 해설 (정확 문자열)

~~~text
$g(x)=f(x)+|f(x)|=2\max(f(x),0)$이므로 $g(x)\ge0$이다.
(가)에서 $g(0)=g(3)=0$이므로 $f(0)\le0$, $f(3)\le0$이다.
(다)에서
$\lim_{x\to3^+}\dfrac{\int_3^x f(t)\,dt}{x-3}=f(3)\ge0$이다.
따라서 $f(3)=0$이다.
(나)에서 $\int_0^x g(t)\,dt=0$을 만족하는 자연수 $x$가 하나뿐이므로 $\int_0^1g(t)\,dt=0$, $\int_0^2g(t)\,dt>0$이다. 따라서 $[0,1]$에서는 $f(x)\le0$이고, $(1,2)$ 안에는 $f(x)>0$인 점이 있다. 정수근 조건에 따라 $x=1$은 홀수 중복도의 근이다.
$f(3)=0$의 중복도가 3이면 $f(x)=(x-3)^3$이 되어 $[0,2]$에서 $f(x)\le0$이므로 $\int_0^2g(t)\,dt=0$이다. 이는 (나)와 모순이므로 중복도는 1 또는 2이다.
먼저 $x=3$이 단순근이면 나머지 두 근은 $1$과 어떤 정수 $r$이다. $f(x)>0$인 점이 $(1,2)$ 안에 있으려면 $r\ge2$여야 한다. 또 (다) 때문에 $x=3$ 바로 오른쪽에서 $f(x)\ge0$이어야 하므로 $r<3$이다. 따라서 $r=2$이고 근은 $1,2,3$이다.
$x=3$이 중근이면 $f(x)=(x-3)^2(x-r)$이다. $[0,1]$에서 $f(x)\le0$이고 $(1,2)$ 안에서 양수인 점이 있으므로 $1\le r<2$이다. 정수근 조건에서 $r=1$이고 근은 $1,3,3$이다.
첫째 함수는 $(x-1)(x-2)(x-3)$이므로
$\int_1^3(x-1)(x-2)(x-3)\,dx=\int_{-1}^{1}u(u^2-1)\,du=0$이다.
둘째 함수는 $(x-1)(x-3)^2$이므로 $u=x-1$로 두면
$\int_1^3(x-1)(x-3)^2\,dx=\int_0^2u(u-2)^2\,du$
$=\left[\dfrac{u^4}{4}-\dfrac{4u^3}{3}+2u^2\right]_0^2=\dfrac43$이다.
따라서 최댓값은 $\dfrac43$이다.
~~~

## 보조 도식 초안

조건에서 도출되는 두 삼차함수를 composite-panels-v1의 별도 패널로 그린다. 첫째 f1=(x−1)(x−2)(x−3)=x³−6x²+11x−6, 둘째 f2=(x−1)(x−3)²=x³−7x²+15x−9이다. 첫째 부호는 근 구간을 지나며 −,+,−,+로 바뀌고 ∫₁³f1=0이다. 둘째의 3은 중근이라 부호가 바뀌지 않으며 ∫₁³f2=4/3이다. 그래프는 두 경우를 따로 나타내며 하나의 piecewise 함수나 multi-curve figure로 묶지 않는다. 두 패널 각각의 비정수 극점은 numeric requiredPoints와 exactCoordinates에 함께 기록하고 coordinateLeader를 지정했다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사 NOT_RUN (parent freeze/check 대기). engine prepare/build, render, PNG/SVG 검사, 시각 검토, 독립 수학 검토, CI, publication, handoff도 NOT_RUN이며 PASS를 주장하지 않는다. 원문 source, 원본 그림/자산, 기존 패키지는 수정하지 않았다. 실제 checker contract 검사와 시각 검수는 아직 실행하지 않았다.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q18

범위 `composite-panels-v1`: root `compositePanels=PASS` (2 panels). root `fit_overview/specFor`=NOT_RUN. Python panel Q18/P0 stages `semantic_model.validate`, `exact_coordinate_per_coordinate_label`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` 모두 PASS; panel Q18/P1의 같은 stage도 모두 PASS. 각 panel `formal_render=NOT_RUN`; root formal render=NOT_RUN. 기타 stat-chart/solid-figure/number-line stages=NOT_RUN. 이는 2-panel composite input/spec 범위이며 렌더 완료나 전체 수학·시각 검토를 뜻하지 않는다.

