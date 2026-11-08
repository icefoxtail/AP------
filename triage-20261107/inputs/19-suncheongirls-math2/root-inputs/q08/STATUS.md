# 19 순천여고 고2 수학II Q08 로컬 입력 초안

원문 결속: main `ed06a82af57c37509e09b36e60b0aa59660fd313`; source `preparation-19-suncheongirls-math2/source-exact.js` (SHA-256 `08bd5c35d33b3c5795a147f6decdca388747ba08208714aa1e280759afc44ea6`); 원본 경로 `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`; `item.json`은 `sourcePath`와 `ordinal: 8`로 결속한다. 소유자는 UNKNOWN. 사용자가 전한 작성 이유는 함수의 시각적 표현이 이해에 도움이 된다는 것이다. 원본 문항·자산·기존 이력은 보존했다.

## 원문 문항 (정확 문자열)

~~~text
$1<x<3$일 때, 두 함수 $f(x)=4x^3-3x^2$, $g(x)=6x-k$에 대하여 $f(x)>g(x)$가 성립하도록 하는 자연수 $k$의 최솟값은? [4.4점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$1$ / $2$ / $3$ / $4$ / $5$
~~~

## 원문 정답 (정확 문자열)

~~~text
⑤
~~~

## 원문 해설 (정확 문자열)

~~~text
$h(x)=f(x)-g(x)$라 두면
$h(x)=4x^3-3x^2-6x+k$
$h'(x)=12x^2-6x-6=6(2x+1)(x-1)$
$1<x<3$에서 $h'(x)>0$이므로 $h$는 증가한다.
따라서 이 구간의 하한은 $x\to1+$일 때의 값 $h(1)=k-5$이다.
$h(x)>0$이 모든 $1<x<3$에서 성립하려면 $k-5\ge0$이어야 한다.
$k=5$일 때는 $x>1$에서 $h(x)>h(1)=0$이므로 조건을 만족한다.
따라서 자연수 $k$의 최솟값은 $5$이다.
~~~

## 도식 초안

도식은 h=f−g의 경계 사례 k=5를 나타낸다. 함수는 원문의 열린 구간 `(1,3)`에 한정되며 양 끝점은 모두 열린 상태다. 특히 h(1)=0은 k=5일 때의 왼쪽 경계값으로만 표시하고, 열린 점으로 도메인에서 제외한다. 구간 안에서는 h′(x)>0이므로 h(x)>0이다. piecewise-polynomial 입력의 자동 프레이밍이 실제 표시창을 정하며, 숫자 viewport를 렌더 결과로 주장하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사 pending; render, full math review, visual review, CI, publication, handoff는 NOT_RUN. 준비된 네 파일은 item.json, plan.json, publish.json, STATUS.md뿐이다. source/assets/기존 history/ledger/queue, 보호된 문항 및 다른 draft는 수정하지 않았다. 원격 쓰기와 렌더는 수행하지 않았다.


## 첫 입력 검사 실패와 최소 수정 기록

첫 실제 입력 검사에서 Q08은 `PIECEWISE_POLY_CURVE_TOO_NARROW`로 실패했다. 검사 원본과 결과는 보존했다. 초안 보존 사본은 `preparation-19-suncheongirls-math2/corrections/before-input-fix/q08/`의 네 파일이다. 최소 수정으로 `graphPlan.axisScale`에 `{x: 1, y: "1/16"}`을 추가하고 plan/publish 캡션에 세로 1단위의 표시 길이가 가로 1단위의 1/16임을 명시했다. 그래프 값, 다항식, 적분 조건, sourceDomain `(1,3)` 및 양 끝 OPEN 상태는 변경하지 않았다. 수정 후 checker 재검사, 렌더, 전체 수학 검토 및 시각 검토는 NOT_RUN이며 이 입력은 계속 NOT_READY다.


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
