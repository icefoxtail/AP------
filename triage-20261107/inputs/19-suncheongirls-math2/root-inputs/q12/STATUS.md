# 19 순천여고 고2 수학II Q12 로컬 입력 초안

원문 결속: main `ed06a82af57c37509e09b36e60b0aa59660fd313`; 원본 경로 `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-suncheongirls-math2/source-exact.js` (SHA-256 `08bd5c35d33b3c5795a147f6decdca388747ba08208714aa1e280759afc44ea6`). `item.json`은 원본 경로와 `ordinal: 12`만으로 원문을 결속한다. owner: UNKNOWN.

## 원문 문항 (정확 문자열)

```text
수직선 위를 움직이는 점 $P$의 시각 $t$ ($t>0$)에서의 위치 $x$가 $x=\dfrac{1}{3}t^3-2t^2+4t-2$이다. 점 $P$가 속도가 0이 될 때의 위치는? [4.5점]
```

## 원문 선택지 (정확 문자열)

```text
$-\dfrac{2}{3}$ / $-\dfrac{1}{3}$ / $0$ / $\dfrac{1}{3}$ / $\dfrac{2}{3}$
```

## 원문 정답 (정확 문자열)

```text
⑤
```

## 원문 해설 (정확 문자열)

```text
위치 함수의 도함수는 속도이다.
$v(t)=x'(t)=t^2-4t+4=(t-2)^2$
속도가 $0$이 되는 시각은
$(t-2)^2=0$
$t=2$
이때의 위치는
$x(2)=\dfrac13\cdot2^3-2\cdot2^2+4\cdot2-2$
$=\dfrac83-8+8-2=\dfrac23$
따라서 구하는 위치는 $\dfrac23$이다.
```

## 시각 목적 및 계획

세로축은 속도 v, 가로축은 실제 시각 t이다. 원문 위치함수와 식 x(t)=t^3/3−2t^2+4t−2는 원문 기록에 그대로 보존하며, 그 위치 곡선은 이 그림에 표시하지 않는다. 시각화는 속도 v(t)=(t−2)^2의 정확한 유한 부분 0<t≤4만 보이며 sourceDomain은 t>0의 OPEN 0, CLOSED 4로 일치시켰다. V(2,0)에서 속도는 0에 닿지만 부호가 바뀌지 않고, 위치는 원함수에서 x(2)=2/3이다. `coordinateLeader`는 실제 점 V만 지시한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 전체 수학 검토 NOT_RUN, 시각 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content, choices, answer, solution을 위에 source-exact.js의 정확 문자열로 보존했다. 원본 assets/history와 기존 입력은 보존했고 이 초안 입력만 추가했다. 원격 쓰기 0회.

## 검사 결과 및 입력 수정

실제 입력 검사 결과(상위 작업자 보고): 9개 중 8개 PASS, Q12는 `PIECEWISE_POLY_FIELD_UNKNOWN:axisVariable`로 실패했다. 수정 전 Q12 네 파일은 `preparation-19-suncheongirls-math2/corrections/before-input-fix/q12/`에 그대로 보존했다. 현재 `plan.json`에서는 지원되지 않는 `graphPlan.axisVariable`만 제거했고 해당 `sourceConditions[].mappedTo` 참조도 제거했다. `axisTitles`의 가로축 `t`와 세로축 `v`, 원문 수식/속도 곡선, sourceDomain `(0,4]`, 점 V와 exactCoordinates, item/publish는 보존했다. 재검사 NOT_RUN. 엔진 수정, 다른 초안 수정, 직접 재검사는 하지 않았다.


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
