# 19 순천여고 고2 수학II Q01 로컬 입력 초안

원문 결속: main `ed06a82af57c37509e09b36e60b0aa59660fd313`; 원본 경로 `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-suncheongirls-math2/source-exact.js` (SHA-256 `08bd5c35d33b3c5795a147f6decdca388747ba08208714aa1e280759afc44ea6`). `item.json`은 원본 경로와 `ordinal: 1`만으로 원문을 결속한다. owner: UNKNOWN.

## 원문 문항 (정확 문자열)

```text
함수 $f(x)=x^4+4x^2-4$의 극솟값은? [4.0점]
```

## 원문 선택지 (정확 문자열)

```text
$-1$ / $-2$ / $-3$ / $-4$ / $-5$
```

## 원문 정답 (정확 문자열)

```text
④
```

## 원문 해설 (정확 문자열)

```text
극솟값은 도함수의 부호가 음수에서 양수로 바뀌는 점에서 얻는다.
$f'(x)=4x^3+8x=4x(x^2+2)$
$x^2+2>0$이므로 $f'(x)=0$은 $x=0$일 때뿐이다.
$x<0$이면 $f'(x)<0$이고, $x>0$이면 $f'(x)>0$이다.
따라서 $x=0$에서 극솟값을 갖는다.
$f(0)=-4$
따라서 극솟값은 $-4$이다.
```

## 시각 목적 및 계획

원문의 사차함수 그래프에서 도함수 부호가 바뀌는 유일한 지점과 극솟값을 좌표로 확인하도록 한다. `coordinateLeader`는 실제 점 A에 연결한다. `domain`과 `viewport`는 cubic/quartic overview framer의 초기 숫자 입력일 뿐이며, 자동 맞춤이 바꾸므로 렌더된 창이라고 주장하지 않는다. source domain은 원문과 같이 ALL_REALS로 보존한다. 계획에는 polynomial capability가 지원하지 않는 `sourceQuote`를 넣지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 전체 수학 검토 NOT_RUN, 시각 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content, choices, answer, solution을 위에 source-exact.js의 정확 문자열로 보존했다. 원본 assets/history와 기존 입력은 보존했고 이 초안 입력만 추가했다. 원격 쓰기 0회.


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
