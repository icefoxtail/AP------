# 22_효천고_2학기_기말_고2_수학II Q04

원본 속도 그래프의 선분과 시간축 사이의 세 삼각형을 표시한다. 이동거리는 절댓값 넓이 합 3이고, 부호 있는 변위는 −1이다. 기존 q4.png는 그대로 둔다.

- 상태: 작업용 로컬 초안. 원본 출처, 문항 메타데이터, 정답·해설, 기존 그림과 이력은 변경하지 않았다.
- 출처: `archive/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js`, ordinal `4`. 원문은 로컬 `preparation-22-hyocheon-math2/source-exact.js`에서 그대로 인용했다.
- ROOT가 원본 이미지 q4.png를 직접 확인했으며, 이 초안은 해당 그림을 대체하거나 수정하지 않는다.
- 계획의 핵심 원문 인용: `이동거리는 속도 그래프와 시간축 사이의 넓이를 절댓값으로 더한다. 변위와 구별해야 한다.`
- 사용자 요청 사유: 풀이 이해에 도움이 되는 함수 그래프를 준비한다.
- 검수 상태: 원문·정답·해설을 source-exact.js와 대조했다. 순수 로컬 JSON·정확 산술 점검 PASS (2026-11-09). 캡처된 graph_framing.fit_overview의 순수 프레임 계산 PASS (마지막 축 눈금 정리 전; Q04/Q14의 곡선·영역은 그대로). 전체 엔진 입력검증, render/engine.prepare/build, independent math review, visual review, student-facing approval, remote preservation/publication 및 ownership sign-off는 NOT_RUN.

## 원문 문항 (source-exact.js 그대로)

```text
4. 원점을 출발하여 수직선 위를 $3$초 동안 움직이는 점 $\mathrm{P}$의 시각 $t$초에서 속도 $v(t)$의 그래프가 다음 그림과 같을 때, 시각 $t=0$에서 $t=3$까지 점 $\mathrm{P}$가 움직인 거리는? [3.0점]
```

## 정답 (source-exact.js 그대로)

```text
③
```

## 해설 (source-exact.js 그대로)

```text
이동거리는 속도 그래프와 시간축 사이의 넓이를 절댓값으로 더한다. 변위와 구별해야 한다.
그림에서 $0\le t\le1$의 속도는 $0$에서 $-2$로 내려가므로 삼각형 넓이는 $\frac12\cdot1\cdot2=1$이다.
$1\le t\le2$에서도 $-2$에서 $0$으로 올라오는 삼각형 넓이가 $1$이다.
$2\le t\le3$에서는 $0$에서 $2$로 올라오는 삼각형 넓이가 $1$이다.
따라서 총 이동거리는 $1+1+1=3$이다. 정답은 ③이다.

[다른 보기 확인]
① 첫 구간 삼각형 하나만 계산한 값이다.
② 음의 속도 두 구간만 계산한 값이다.
④ 삼각형 한 개를 직사각형 넓이로 취급한 값이다.
⑤ 속도 부호를 무시한 뒤 면적을 중복 합산한 값이다.
```

## 후보·검사 이력

- 첫 후보는 `overlays.polygons`에서 `requiredPoints` ID를 꼭짓점으로 직접 참조했다. 현재 그래프 플래너는 이 참조를 허용하지 않아 후보를 폐기했다. 최종 계획은 실제로 지원되는 연속 piecewise-polynomial `regions`로 바꿨다.
- 캡처된 `graph_framing.fit_overview`의 곡선·영역 순수 계산은 통과했고 `axisRatio=1`을 반환했다. 마지막 입력은 coordinateLeader가 모든 축 값(원점 포함)을 표시하므로 중복·영(0) 눈금을 제거했다.
- piecewise-polynomial에서 `axisVariable`은 허용되지 않는다. 실제 필드에 포함된 `axisTitles`로 시간(초)과 속도 축을 표시한다.
- 기존 production input-checker 실행 기록: 이 실패 후보에서는 `INVALID_AXIS_TICK_VALUE:x`가 x축 0 눈금에서 반환됐다. fit_overview, phase2.specFor, semantic_model.validate, coordinate-label/critical construction, viewport 및 fitted/spec tick equality는 통과했다. 최종 입력은 모든 좌표가 coordinateLeader로 라벨되므로 중복 눈금을 비웠다. 마지막 입력에 대한 checker 재실행은 담당 checker에 남긴다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `622d8b01f90b5bfecc29ed66eecd5f29690309ef337ef28ddbdec0264539ed8d`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이며, EQUATION_LABEL의 독립 수학 검수나 시각 검수를 뜻하지 않는다. engine.prepare 자체를 실행하지 않고 원본 코드의 critical/viewport/tick guard 구간만 검사했다.
- 이전 후보의 0 눈금은 실제 guard에서 INVALID_AXIS_TICK_VALUE:x로 실패했다. 0 눈금 제거 후 현재 파일을 재검사하여 guard PASS를 확인했다. 이전 실패는 삭제하지 않았다.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
