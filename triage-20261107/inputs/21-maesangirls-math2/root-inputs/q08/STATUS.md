# 21 매산여고 고2 수학II Q08

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 폴더에 item/plan/publish 초안과 이 상태 기록만 저장했다. 이 초안은 READY 또는 게시 가능 판정이 아니다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 8; 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`; 정확 원문 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes, SHA-256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`). 로컬 원문 크기와 SHA-256을 대조했다. sourcePath/ordinal은 item.json에 기록했다.

원문 문항 (source-exact.js의 content, 정확 인용):

```text
두 곡선 $f(x)=-x^2+ax+b$, $g(x)=x^3+c$가 점 $(-1,2)$를 지나고, 이 점에서 공통인 접선을 가질 때, $a+b+c$의 값을 구하면? (단, $a,b,c$는 상수이다.) [3.9점]
```

원문 정답 필드 (정확 인용): `⑤`

원문 해설 (source-exact.js의 solution, 정확 인용):

```text
두 곡선이 $(-1,2)$를 지나므로 각 함수값이 $2$이다.
$f(-1)=-1-a+b=2$에서 $b-a=3$이다.
$g(-1)=-1+c=2$에서 $c=3$이다.
이 점에서 접선이 같으므로 도함수값도 같다.
$f'(x)=-2x+a,\quad g'(x)=3x^2$
$f'(-1)=2+a=g'(-1)=3$에서 $a=1$이다.
따라서 $b=4,c=3$이고
$a+b+c=1+4+3=8$이다.
```

시각화 사유 및 범위: 원문 visualDisposition `NO_ADDITIONAL_VISUAL_REQUIRED` 이력은 원문에서 변경하지 않았다. 풀이 관계를 보조하는 선택적 함수 그림 초안을 별도로 제안한다. 두 곡선 f,g와 계산된 공통 접선을 함께 표시한다. f와 g의 두 교점은 (-1,2),(1,4)이며, (2,11)은 접선과 g의 교점일 뿐 f,g의 교점이 아니다. 이 보조점은 requiredPoints에 정확 좌표로 보존하지만 marker NONE으로 점과 좌표 라벨을 그리지 않는다. f의 꼭짓점 좌표도 보존하되 점 표시는 생략한다.

검사 기록: 문항 8의 questionBank ordinal, 문항 본문, 정답 및 해설을 로컬 원문에서 읽었다. 계산과 입력 계약은 초안 단계에서 작성했으며 independent checker는 실행하지 않았다.

미실행: 독립 입력 checker, author tests, fit/semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, publication 및 handoff는 모두 **NOT_RUN**이다. 원격 쓰기·렌더·엔진·source/assets/ledger 편집은 하지 않았다. Q01/Q03 실제 엔진 결과, 과거 `NO_ADDITIONAL_VISUAL_REQUIRED` 이력, 이전 392개 로컬 파일과 기존 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 SHA-256

- item.json: `b3afcc0327b8a99e59f990ca35384b042f5e9b7aca11491caba31273ef6f0f98`
- plan.json: `11869dd0d4e0d1733e11b53302de4ded0064c054384d2786761c332283246556`
- publish.json: `ad783c9a899c14d708c09e122dd634dcd97db0993b1a7a882a1047f2cd3285ba`


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
