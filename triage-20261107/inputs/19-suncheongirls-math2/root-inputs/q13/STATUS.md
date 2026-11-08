# 19 순천여고 고2 수학II Q13 로컬 입력 초안

원문 결속: main `ed06a82af57c37509e09b36e60b0aa59660fd313`; 원본 경로 `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-suncheongirls-math2/source-exact.js` (SHA-256 `08bd5c35d33b3c5795a147f6decdca388747ba08208714aa1e280759afc44ea6`). `item.json`은 원본 경로와 `ordinal: 13`만으로 원문을 결속한다. owner: UNKNOWN.

## 원문 문항 (정확 문자열)

```text
다항함수 $f(x)$가 모든 실수 $x$에 대하여 <br>$\displaystyle\int_{-1}^x(x-t)f(t),dt=x^4-ax^2+bx$를 만족시킬 때, $f(1)$의 값은? (단, $a,b$는 상수이다.) [4.7점]
```

## 원문 선택지 (정확 문자열)

```text
$-4$ / $1$ / $6$ / $10$ / $14$
```

## 원문 정답 (정확 문자열)

```text
③
```

## 원문 해설 (정확 문자열)

```text
주어진 등식을 한 번 미분하면
$\displaystyle\int_{-1}^x f(t)\,dt=4x^3-2ax+b$
다시 미분하면
$f(x)=12x^2-2a$
$x=-1$을 원래 식에 대입하면 적분값이 $0$이므로
$1-a-b=0$
즉 $a+b=1$이다.
$x=-1$에서 한 번 미분한 식에도 대입하면
$0=-4+2a+b$
따라서 $2a+b=4$이다.
두 식을 빼면 $a=3$, 이어서 $b=-2$이다.
$f(1)=12-2\cdot3=6$
따라서 구하는 값은 $6$이다.
```

## 시각 목적 및 계획

원문에서 결정되는 함수의 포물선과 점 P(1,6)을 표시해 요구된 함숫값을 직접 읽는다. `coordinateLeader`는 필요한 점을 지시한다. cubic/quartic의 `domain`과 `viewport`는 자동 맞춤이 바꿀 수 있는 초기 입력일 뿐 렌더된 실제 창으로 주장하지 않는다. sourceDomain은 원문처럼 ALL_REALS이다. `sourceQuote` 필드는 넣지 않았다.

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
