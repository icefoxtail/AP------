# 21 매산여고 고2 수학II Q05 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 전용 폴더에 item.json, plan.json, publish.json, STATUS.md만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal 5, questionNumber 5. 원문 preparation 복사본 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes), 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`, SHA256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`. 원문 visualDisposition은 `NO_ADDITIONAL_VISUAL_REQUIRED이며 기존 값과 이전 검수 기록을 변경하지 않았다.

도식 요약: 원문의 방향 있는 적분은 −∫₋₅⁻³f+∫₋₅³f=∫₋₃³f로 정리된다. 대칭구간 [−3,3]에서 f(x)=5x³+6x²−4x−2의 홀수 부분 5x³−4x는 상쇄되므로, 이 부분도는 원래 함수 f가 아니라 그 짝수 부분 g(x)=6x²−2를 정확히 나타낸다. 표시 범위는 적분구간 [−3,3]뿐이며 A=(−3,52), V=(0,−2), B=(3,52)이다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
$f(x)=5x^3+6x^2-4x-2$에서 $\displaystyle\int_{-3}^{-5}f(x)\,dx-\displaystyle\int_3^{-5}f(x)\,dx$의 값을 구하면? [3.8점]
```

원문 정답: ③ ($96$ 선택지)

원문 해설 (정확 인용):

```text
정적분의 구간 방향을 먼저 바꾼다.
$\displaystyle\int_{-3}^{-5}f(x)\,dx-\int_3^{-5}f(x)\,dx$
$=-\int_{-5}^{-3}f(x)\,dx+\int_{-5}^{3}f(x)\,dx$
$=\int_{-3}^{3}f(x)\,dx$
여기서 $f(x)=5x^3+6x^2-4x-2$이다. 홀수차 항의 대칭구간 적분은 $0$이므로
$\displaystyle\int_{-3}^{3}f(x)\,dx=2\int_0^3(6x^2-2)\,dx$
$=2[2x^3-2x]_0^3=2(54-6)=96$이다.
```

검증 실행 상태: 입력/계약 검사, 엔진 검사, 렌더, 시각 검사, 독립 전체 수학 검토, 게시 검수 및 인계는 모두 **NOT_RUN**이다. 이 작성자는 검사를 실행하거나 렌더하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격/엔진/원본/assets/ledger, Q01/Q03 실제 새 엔진 결과, 이전 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 이전 로컬 파일은 변경하지 않았다. Hyocheon ref는 사용·재시도·우회하지 않았다.

JSON 동결 SHA256:
- item.json: `db9f0a1300ee4810872ff8262a1592c49dd3c1198ffa5e188aecfd0bfb858626`
- plan.json: `8725dae669d5a8ee4a0a98805187ed89ccb510e8880d8e1e2701509405772519`
- publish.json: `74c52d90a5423ff6b9138d2bcaefeacafecba9efdeb9b9170373475d20e40aa6`

이 해시 이후 JSON은 수정하지 않았다.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
