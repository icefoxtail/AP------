# 21 매산여고 고2 수학II Q13 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 전용 폴더에 item.json, plan.json, publish.json, STATUS.md만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal 13, questionNumber 13. 원문 preparation 복사본 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes), 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`, SHA256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`. 원문 visualDisposition은 `NO_ADDITIONAL_VISUAL_REQUIRED이며 기존 값과 이전 검수 기록을 변경하지 않았다.

도식 요약: 극한 조건은 (2/3)f′(x)=ax를 뜻하고 두 함수값 조건에서 a=4, C=−2를 얻으므로 f(x)=3x²−2이다. 실제 전역 최솟점은 V=(0,−2)이며 원문의 조건점 A=(−1,1), B=(2,10)과 질문한 점 C=(3,25)를 함께 표시한다.

원문 문항 인용 (plan.sourceQuote와 동일):

```text
다항함수 $f(x)$가 다음 조건을 만족시킬 때, $f(3)$의 값을 구하면? [4.1점]
(가) $\displaystyle\lim_{h\to0}\dfrac{f(x+2h)-f(x)}{3h}=ax$
(나) $f(2)=10$, $f(-1)=1$
```

원문 정답: ⑤ ($25$ 선택지)

원문 해설 (정확 인용):

```text
주어진 극한은 미분계수의 정의와 비교한다.
$\displaystyle\lim_{h\to0}\frac{f(x+2h)-f(x)}{3h}=\frac23f'(x)=ax$
따라서 $f'(x)=\frac{3a}{2}x$이고
$f(x)=\frac{3a}{4}x^2+C$이다.
$f(2)=10$, $f(-1)=1$을 대입하면
$3a+C=10,\quad\frac{3a}{4}+C=1$
두 식을 빼서 $\frac{9a}{4}=9$이므로 $a=4$, $C=-2$이다.
$f(3)=27-2=25$이다.
```

검증 실행 상태: 입력/계약 검사, 엔진 검사, 렌더, 시각 검사, 독립 전체 수학 검토, 게시 검수 및 인계는 모두 **NOT_RUN**이다. 이 작성자는 검사를 실행하거나 렌더하지 않았다. DRAFT_ONLY이며 READY가 아니다. 원격/엔진/원본/assets/ledger, Q01/Q03 실제 새 엔진 결과, 이전 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 이전 로컬 파일은 변경하지 않았다. Hyocheon ref는 사용·재시도·우회하지 않았다.

JSON 동결 SHA256:
- item.json: `3a6afb2cca1375038fff222c05d3447c810c43b740810e69fdea0e51774a828a`
- plan.json: `2d1f5b456f4421a85c16027b0ead027c179388af3ea0c6d9334ec288d657caef`
- publish.json: `dc985d0726c00503d199e1155b5679b985d797eae6b3b08ee5e3147ae7fc37b3`

이 해시 이후 JSON은 수정하지 않았다.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
