# 21 매산여고 고2 수학II Q04 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 전용 폴더에 item.json, plan.json, publish.json, STATUS.md만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal 4, questionNumber 4. 원문 preparation 복사본 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes), 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`, SHA256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`. 원문 visualDisposition은 `NO_ADDITIONAL_VISUAL_REQUIRED이며 기존 값과 이전 검수 기록을 변경하지 않았다.

도식 요약: 상수 조건에서 a=−15이므로 f(x)=x³+3x²−9x−15의 그래프를 나타낸다. 도함수는 3(x+3)(x−1)이고, 실제 극댓점 M=(−3,12), 극솟점 m=(1,−20)이다. 극댓값이 12인 점은 M이다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
함수 $f(x)=x^3+3x^2-9x+a$의 극댓값이 $12$일 때, 상수 $a$의 값을 구하면? [3.6점]
```

원문 정답: ⑤ ($-15$ 선택지)

원문 해설 (정확 인용):

```text
극값이 생기는 점을 도함수로 찾는다.
$f'(x)=3x^2+6x-9=3(x+3)(x-1)$
도함수의 부호는 $x=-3$에서 $+$에서 $-$로 바뀌므로 극댓값은 $f(-3)$이다.
$f(-3)=(-3)^3+3(-3)^2-9(-3)+a$
$=-27+27+27+a=27+a$
$27+a=12$이므로
$a=-15$이다.
```

검증 실행 상태: 입력/계약 검사, 엔진 검사, 렌더, 시각 검사, 독립 전체 수학 검토, 게시 검수 및 인계는 모두 **NOT_RUN**이다. 이 작성자는 검사를 실행하거나 렌더하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격/엔진/원본/assets/ledger, Q01/Q03 실제 새 엔진 결과, 이전 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 이전 로컬 파일은 변경하지 않았다. Hyocheon ref는 사용·재시도·우회하지 않았다.

JSON 동결 SHA256:
- item.json: `5b6c0ac3693ce8caaeafe749c20cdfbbc7aaaeb3dbb6d98594cb905894af6657`
- plan.json: `69f18d5b2cbd06e0ee0ba325da30c8dadadf862f0551779464c848c8079e1164`
- publish.json: `a5b1d46217c1d0d528b1ca5e0f1f5c31562aec76519163b2f04cb5582dc008d5`

이 해시 이후 JSON은 수정하지 않았다.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=PASS; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
