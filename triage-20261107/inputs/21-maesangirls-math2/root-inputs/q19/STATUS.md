# 21 매산여고 고2 수학II Q19

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 폴더에 item/plan/publish 초안과 이 상태 기록만 저장했다. 이 초안은 READY 또는 게시 가능 판정이 아니다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 19; 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`; 정확 원문 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes, SHA-256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`). 로컬 원문 크기와 SHA-256을 대조했다. sourcePath/ordinal은 item.json에 기록했다.

원문 문항 (source-exact.js의 content, 정확 인용):

```text
[주관식1 (단답형)] 곡선 $y=x^3-2x^2-x+2$ 위의 점 $(2,0)$에서의 접선과 이 곡선으로 둘러싸인 도형의 넓이를 구하여라. [4점]
```

원문 정답 필드 (정확 인용): `$\dfrac{64}{3}$`

원문 해설 (source-exact.js의 solution, 정확 인용):

```text
곡선 위의 $(2,0)$에서 접선의 기울기는
$y'=3x^2-4x-1$, 따라서 $y'(2)=3$이다.
접선은 $y=3(x-2)=3x-6$이다.
곡선과 접선의 차는
$(x^3-2x^2-x+2)-(3x-6)=(x-2)^2(x+2)$
이므로 두 그래프는 $x=-2,2$에서 만난다. $[-2,2]$에서 곡선이 접선 위에 있으므로
$\displaystyle\text{넓이}=\int_{-2}^{2}(x-2)^2(x+2)\,dx$
$=[\frac14x^4-\frac23x^3-2x^2+8x]_{-2}^{2}=\frac{64}{3}$이다.
```

시각화 사유 및 범위: 원문 visualDisposition `NO_ADDITIONAL_VISUAL_REQUIRED` 이력은 원문에서 변경하지 않았다. 풀이 관계를 보조하는 선택적 함수 그림 초안을 별도로 제안한다. 원래 삼차함수와 실제 접선 y=3x−6을 표시하고, 교점 좌표 (-2,-12),(2,0) 사이 영역만 채운다. 두 극값은 정확한 근호 좌표를 보존하되 점 표시는 생략한다.

검사 기록: 문항 19의 questionBank ordinal, 문항 본문, 정답 및 해설을 로컬 원문에서 읽었다. 계산과 입력 계약은 초안 단계에서 작성했으며 independent checker는 실행하지 않았다.

미실행: 독립 입력 checker, author tests, fit/semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, publication 및 handoff는 모두 **NOT_RUN**이다. 원격 쓰기·렌더·엔진·source/assets/ledger 편집은 하지 않았다. Q01/Q03 실제 엔진 결과, 과거 `NO_ADDITIONAL_VISUAL_REQUIRED` 이력, 이전 392개 로컬 파일과 기존 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 SHA-256

- item.json: `441587d3cf0e3664879a162d7fff99b99e00eb6efd26050b9014284532af1f7a`
- plan.json: `ea658d6f399a4168b86042c4145a87cf5d034d8fd54c11c53bf638fc4e44fada`
- publish.json: `064dedcc3eb024c44ceff1b8f775348dbb36824214b1f79c4ce815bab8210d9a`


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
