# 20 매산고 고2 수학II Q10 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js, pinned main bc47febaf592b4da9614b2695abc9e0851291f5b. 준비된 exact source의 window.questionBank에서 id 10, 1-based ordinal 10를 확인했다. item.json은 정확한 sourcePath와 ordinal을 사용한다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
그림과 같이 곡선 $y=-x^2+4x$와 $x$축으로 둘러싸인 부분에 내접하고 한 변이 $x$축 위에 있는 직사각형 $ABCD$가 있다.
직사각형 $ABCD$의 넓이가 최대일 때, 점 $B$의 $x$좌표는 $\dfrac{a+b\sqrt{3}}{3}$이다. 이때, $a+b$의 값을 구하면? [4.5점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$5$ / $6$ / $7$ / $8$ / $9$
~~~

## 원문 정답 (정확 문자열)

~~~text
④
~~~

## 원문 해설 (정확 문자열)

~~~text
그림에서 포물선의 같은 높이에 있는 두 점의 $x$좌표의 합은 $4$이다. 오른쪽 아래 꼭짓점 $B$의 $x$좌표를 $x$라 두면 왼쪽 아래 꼭짓점은 $4-x$이고 $2<x<4$이다.
직사각형의 높이는 $-x^2+4x$, 너비는 $x-(4-x)=2x-4$이다.
$A(x)=(2x-4)(-x^2+4x)$
$A'(x)=-6x^2+24x-16$
최댓값 후보는
$-6x^2+24x-16=0$
$3x^2-12x+8=0$
$x=2\pm\dfrac{2\sqrt3}{3}$
범위 $2<x<4$에 맞는 값은 $x=2+\dfrac{2\sqrt3}{3}=\dfrac{6+2\sqrt3}{3}$이다.
이 구간에서 $A(x)>0$이고 양 끝에서 $A(2)=A(4)=0$이며 내부 임계점은 이 값 하나뿐이므로, 이때 넓이가 최대이다.
따라서 $a+b=6+2=8$이고 정답은 ④이다.
~~~

## 보조 도식 초안

보조 그래프는 원문의 포물선 y=−x²+4x와 최대 넓이 직사각형을 함께 나타낸다. A=(2−2√3/3,0), B=(2+2√3/3,0), D=(2−2√3/3,8/3), C=(2+2√3/3,8/3)이다. 네 변은 overlays.segments로 정확히 연결한다. sourceDomain은 ALL_REALS이며 domain/viewport는 자동 맞춤에 앞선 표시 입력값일 뿐이다. 비정수 곡선점 D와 C에는 numeric requiredPoints와 같은 exactCoordinates 문자열을 넣고 coordinateLeader를 지정했다. 원문 그림 파일은 건드리지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사 NOT_RUN (parent freeze/check 대기). engine prepare/build, render, PNG/SVG 검사, 시각 검토, 독립 수학 검토, CI, publication, handoff도 NOT_RUN이며 PASS를 주장하지 않는다. 원문 source, PNG, assets, 기존 패키지는 변경하지 않았다. 도형 overlay의 실제 contract 검사와 시각 검수는 아직 실행하지 않았다.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q10

범위 `polynomial-spike-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. Node `fit_overview`, `specFor`, `source_domain_preserved_during_fit` PASS. Python `semantic_model.validate`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` PASS; `exact_coordinate_per_coordinate_label=PASS`. number-line/stat-chart/solid-figure stages=NOT_RUN; `formal_render=NOT_RUN`.

