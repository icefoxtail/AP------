# 21 매산여고 고2 수학II Q07

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 폴더에 item/plan/publish 초안과 이 상태 기록만 저장했다. 이 초안은 READY 또는 게시 가능 판정이 아니다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 7; 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`; 정확 원문 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes, SHA-256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`). 로컬 원문 크기와 SHA-256을 대조했다. sourcePath/ordinal은 item.json에 기록했다.

원문 문항 (source-exact.js의 content, 정확 인용):

```text
두 곡선 $y=x^2$과 $y=-x^2+8x$로 둘러싸인 부분의 넓이를 직선 $x=a$가 이등분할 때, 상수 $a$의 값을 구하면? [3.9점]
```

원문 정답 필드 (정확 인용): `④`

원문 해설 (source-exact.js의 solution, 정확 인용):

```text
두 곡선 사이의 세로 길이는 $(-x^2+8x)-x^2=-2x^2+8x$이다. 교점은 $x=0,4$이다.
전체 넓이는
$\displaystyle\int_0^4(-2x^2+8x)\,dx=[-\frac23x^3+4x^2]_0^4=\frac{64}{3}$
이므로 반쪽 넓이는 $\frac{32}{3}$이다.
$x=a$의 왼쪽 넓이가 절반이 되도록 하면
$-\frac23a^3+4a^2=\frac{32}{3}$
$a=2$를 대입하면 등식이 성립한다. 넓이는 $0<x<4$에서 계속 증가하므로 이 값이 유일하다.
따라서 $a=2$이다.
```

시각화 사유 및 범위: 원문 visualDisposition `NO_ADDITIONAL_VISUAL_REQUIRED` 이력은 원문에서 변경하지 않았다. 풀이 관계를 보조하는 선택적 함수 그림 초안을 별도로 제안한다. 실제 포물선 두 개와 교점을 보이고, x=2에서 전체 영역을 넓이가 같은 두 부분으로 색을 나눈다. 꼭짓점·교점·분할선의 실제 좌표를 기록한다.

검사 기록: 문항 7의 questionBank ordinal, 문항 본문, 정답 및 해설을 로컬 원문에서 읽었다. 계산과 입력 계약은 초안 단계에서 작성했으며 independent checker는 실행하지 않았다.

미실행: 독립 입력 checker, author tests, fit/semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, publication 및 handoff는 모두 **NOT_RUN**이다. 원격 쓰기·렌더·엔진·source/assets/ledger 편집은 하지 않았다. Q01/Q03 실제 엔진 결과, 과거 `NO_ADDITIONAL_VISUAL_REQUIRED` 이력, 이전 392개 로컬 파일과 기존 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 SHA-256

- item.json: `8f99129ac7c347c4726b090ebcac07e39405dbc6be972ce5905a36560132ed07`
- plan.json: `ed51fb8537ba3e50827890facfda901bdc8dd0d6e6a43a1e83b964a91aa6b132`
- publish.json: `e1dcf02a73ce1029ed28658b5277372c78a53bca3bdcab1d02282be2b2d64857`


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
