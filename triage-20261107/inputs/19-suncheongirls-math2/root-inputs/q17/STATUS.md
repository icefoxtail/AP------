# 19 순천여고 고2 수학II Q17 로컬 입력 초안

원문 결속: main `ed06a82af57c37509e09b36e60b0aa59660fd313`; source `preparation-19-suncheongirls-math2/source-exact.js` (SHA-256 `08bd5c35d33b3c5795a147f6decdca388747ba08208714aa1e280759afc44ea6`); 원본 경로 `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`; `item.json`은 `sourcePath`와 `ordinal: 17`로 결속한다. 소유자는 UNKNOWN. 사용자가 전한 작성 이유는 함수의 시각적 표현이 이해에 도움이 된다는 것이다. 원본 문항·자산·기존 이력은 보존했다.

## 원문 문항 (정확 문자열)

~~~text
최고차항의 계수가 모두 $1$인 삼차함수 $f(x)$와 이차함수 $g(x)$가 다음 조건을 만족시킨다.
(가) 함수 $|f(x)|$는 $x=3$에서만 미분가능하지 않다.
(나) 함수 $g(x)$는 $x=\dfrac{3}{2}$에서 극솟값 $-\dfrac{9}{4}$를 가진다.
(다) 모든 실수 $p$에 대하여 $\displaystyle\lim_{x\to p}\dfrac{f(x)}{g(x)}$의 값이 존재한다.
이때, $\displaystyle\int_{-1}^1{f(x)+g(x)},dx$의 값은? [4.9점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$-2$ / $-\dfrac{4}{3}$ / $-\dfrac{2}{3}$ / $0$ / $\dfrac{2}{3}$
~~~

## 원문 정답 (정확 문자열)

~~~text
②
~~~

## 원문 해설 (정확 문자열)

~~~text
이차함수 $g$는 $x=\dfrac32$에서 최솟값 $-\dfrac94$를 가지므로
$g(x)=(x-\dfrac32)^2-\dfrac94=x(x-3)$
이다.
모든 $p$에서 $\dfrac{f(x)}{g(x)}$의 극한이 존재하려면 $g$의 근 $0,3$이 모두 $f$의 근이어야 한다.
또 $|f(x)|$가 미분가능하지 않은 점이 $x=3$뿐이므로 $x=0$은 짝수 중복도, $x=3$은 홀수 중복도이다.
$f$는 최고차항 계수가 $1$인 삼차함수이므로
$f(x)=x^2(x-3)$
이다.
$\displaystyle\int_{-1}^1(f(x)+g(x))\,dx$
$=\int_{-1}^1(x^3-2x^2-3x)\,dx$
홀수항의 정적분은 $0$이므로
$=-2\int_{-1}^1x^2\,dx$
$=-2[\dfrac{x^3}{3}]_{-1}^1=-\dfrac43$
따라서 구하는 값은 $-\dfrac43$이다.
~~~

## 도식 초안

도식은 요청된 합함수 `h=f+g=x³−2x²−3x`만 그린다. 원문의 적분구간은 닫힌 `[-1,1]`이며 그래프도 그 구간만 표시한다. `f−g`를 나타내지 않는다. x축 위·아래 영역은 부호별 기여를 구분하고, 대칭 적분에서 홀수항 `x³−3x`가 상쇄되며 남은 `−2x²` 항이 `−4/3`을 준다는 해설을 연결한다. 내부 극점 M의 근호 좌표는 수치 좌표와 함께 exactCoordinates에 기록했다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사 pending; render, full math review, visual review, CI, publication, handoff는 NOT_RUN. 준비된 네 파일은 item.json, plan.json, publish.json, STATUS.md뿐이다. source/assets/기존 history/ledger/queue, 보호된 문항 및 다른 draft는 수정하지 않았다. 원격 쓰기와 렌더는 수행하지 않았다.


## 첫 입력 검사 실패와 최소 수정 기록

첫 실제 입력 검사에서 Q17은 `GRAPH_REGION_BOUNDARY_UNKNOWN:positive-lobe:h`로 실패했다. `graph_framing.py` 계약에서 주 함수 영역 경계의 내부 식별자는 `f`이며 `functionName: "h"`는 표시명이다. 최소 수정으로 두 region의 `upper`/`lower` 경계 참조에서만 `h`를 `f`로 바꿨다. 합함수, 원문 적분구간, 근호 좌표, 캡션 및 수치는 변경하지 않았다. 초안 보존 사본은 `preparation-19-suncheongirls-math2/corrections/before-input-fix/q17/`의 네 파일이다. 검사 후 checker 재검사, 렌더, 전체 수학 검토 및 시각 검토는 NOT_RUN이며 이 입력은 계속 NOT_READY다.


## 수정 후 실제 입력 검사 2026-11-08T23-41-25-742Z

최초 실패와 수정 전 파일을 보존한 채 수정 입력으로 한 차례 재검사했다. 현재 3 JSON이 고정 검사본과 일치하고 검사 전후 바이트가 유지됐다.

- frozen_snapshot_binding: PASS
- item_source_binding: PASS
- source_exact_binding: PASS
- publish_fields: PASS
- fit_overview: PASS
- specFor: PASS
- source_domain_preserved_during_fit: PASS
- semantic_model.validate: PASS
- exact_coordinate_per_coordinate_label: NOT_APPLICABLE_NO_COORDINATE_LABEL
- axis_title_plain_max10: PASS
- engine_critical_construction: PASS
- viewport.for_spec: PASS
- engine_axis_tick_guard: PASS
- fit_spec_tick_static_match: PASS

전체 독립 수학 검토·원본 이미지 독립 재검수·engine.prepare/build/render·SVG/PNG 시각 확인·최종 배치와 가독성 검수·CI·게시·인계는 NOT_RUN이다. LOCAL_ONLY / DRAFT_ONLY / NOT_READY 유지. 입력 PASS는 실물 완료가 아니다. 원본 결과: preparation-19-suncheongirls-math2/checker/recheck-corrected-four/reports/.
