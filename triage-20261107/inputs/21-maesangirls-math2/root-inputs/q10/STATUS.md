# 21 매산여고 고2 수학II Q10 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 전용 폴더에 item.json, plan.json, publish.json, STATUS.md만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal 10, questionNumber 10. 원문 preparation 복사본 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes), 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`, SHA256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`. 원문 visualDisposition은 `NO_ADDITIONAL_VISUAL_REQUIRED이며 기존 값과 이전 검수 기록을 변경하지 않았다.

도식 요약: 조건에 따라 f(x)=x³−4x는 홀함수이며 f′(0)=−4, f(1)=−3이다. 곡선의 실제 극댓점 M=(−2√3/3,16√3/9), 극솟점 m=(2√3/3,−16√3/9), 원점 O=(0,0), 질문한 점 P=(1,−3)을 나타낸다. 극값 좌표는 exactCoordinates에 정확한 근호식으로 보존하고 coordinateLeader로 좌표 라벨을 연결한다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
최고차항의 계수가 $1$인 삼차함수 $f(x)$가 임의의 실수 $a$에 대하여 $\displaystyle\int_{-a}^a f(x)\,dx=0$을 만족시킨다. $f'(0)=-4$일 때, $f(1)$의 값을 구하면? [4.1점]
```

원문 정답: ③ ($-3$ 선택지)

원문 해설 (정확 인용):

```text
삼차함수를 $f(x)=x^3+ax^2+bx+c$라 놓는다.
조건이 모든 실수 $A$에 대해 성립하므로 대칭구간 적분을 계산한다.
$\displaystyle\int_{-A}^{A}f(x)\,dx=\frac{2a}{3}A^3+2cA=0$
모든 $A$에서 성립하려면 $a=0,c=0$이다.
또 $f'(0)=b=-4$이므로
$f(x)=x^3-4x$
$f(1)=1-4=-3$이다.
```

검증 실행 상태: 입력/계약 검사, 엔진 검사, 렌더, 시각 검사, 독립 전체 수학 검토, 게시 검수 및 인계는 모두 **NOT_RUN**이다. 이 작성자는 검사를 실행하거나 렌더하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격/엔진/원본/assets/ledger, Q01/Q03 실제 새 엔진 결과, 이전 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 이전 로컬 파일은 변경하지 않았다. Hyocheon ref는 사용·재시도·우회하지 않았다.

JSON 동결 SHA256:
- item.json: `8cd646166ac738b22dadd60244d65a5f7b26d9b08fb58c72e55c64a24c2fdd92`
- plan.json: `e6fac03a24aba76acdc395fd8908930074451b3a2fb1c2783d963b9b55aed83b`
- publish.json: `3c6d549032a69224bf02fe161f72b61875448d857842104170f17980f0d44d2e`

이 해시 이후 JSON은 수정하지 않았다.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=PASS; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
