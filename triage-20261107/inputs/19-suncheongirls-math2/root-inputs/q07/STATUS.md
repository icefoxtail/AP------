# 19 순천여고 고2 수학II Q07 로컬 입력 초안

원문 결속: main `ed06a82af57c37509e09b36e60b0aa59660fd313`; source `preparation-19-suncheongirls-math2/source-exact.js` (SHA-256 `08bd5c35d33b3c5795a147f6decdca388747ba08208714aa1e280759afc44ea6`); 원본 경로 `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`; `item.json`은 `sourcePath`와 `ordinal: 7`로 결속한다. 소유자는 UNKNOWN. 사용자가 전한 작성 이유는 함수의 시각적 표현이 이해에 도움이 된다는 것이다. 원본 문항·자산·기존 이력은 보존했다.

## 원문 문항 (정확 문자열)

~~~text
함수 $f(x)=3x|x+2|$일 때, $\displaystyle\int_{-3}^0 f(x),dx$의 값은? [4.4점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$-8$ / $-4$ / $0$ / $4$ / $8$
~~~

## 원문 정답 (정확 문자열)

~~~text
①
~~~

## 원문 해설 (정확 문자열)

~~~text
절댓값 안의 부호가 바뀌는 $x=-2$에서 적분을 나눈다.
$-3\le x\le-2$이면 $|x+2|=-(x+2)$이므로 $f(x)=-3x^2-6x$이다.
$-2\le x\le0$이면 $|x+2|=x+2$이므로 $f(x)=3x^2+6x$이다.
$\displaystyle\int_{-3}^0 f(x)\,dx$
$=\int_{-3}^{-2}(-3x^2-6x)\,dx+\int_{-2}^0(3x^2+6x)\,dx$
$=[-x^3-3x^2]_{-3}^{-2}+[x^3+3x^2]_{-2}^{0}$
$=-4+(-4)=-8$
따라서 정적분의 값은 $-8$이다.
~~~

## 도식 초안

`piecewise-polynomial-spike-v1`의 두 연속 다항식 조각을 정확한 source interval `[-3,0]`에서 표시한다. 점 A(−3,−9), B(−2,0), C(−1,−3), D(0,0)를 기록한다. x축 아래의 두 영역은 각각 기하학적 넓이 4지만, 원문이 묻는 정적분은 signed value −8이다. 음영 넓이와 signed integral을 캡션에서 분리했다. 표시창은 자동 프레이밍이 정하므로 입력의 수치 경계를 실제 렌더 창이라고 주장하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사 pending; render, full math review, visual review, CI, publication, handoff는 NOT_RUN. 준비된 네 파일은 item.json, plan.json, publish.json, STATUS.md뿐이다. source/assets/기존 history/ledger/queue, 보호된 문항 및 다른 draft는 수정하지 않았다. 원격 쓰기와 렌더는 수행하지 않았다.


## 실제 입력 검사 기록 2026-11-08T23-36-32-215Z

이 문항의 현재 3 JSON과 고정 검사본의 SHA256이 일치하며, 검사 전후 바이트가 유지됐다. 아래 실제 실행한 입력 경로만 PASS이다.

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

전체 독립 수학 검토와 원본 이미지 독립 재검수, engine.prepare/build/render, SVG/PNG 시각 확인, 배치·가독성 최종 검수, CI, 게시, 구현 인계는 NOT_RUN이다. LOCAL_ONLY / DRAFT_ONLY / NOT_READY를 유지한다. 입력 PASS는 그림 완성이나 게시 완료가 아니다. 전체 원본 결과: preparation-19-suncheongirls-math2/checker/recheck-input-only/reports/.
