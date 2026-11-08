22 팔마고 고2 수학II Q06 입력 초안.

원문 바인딩: `archive/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js` ordinal 6; main commit `dce7678719f1a449ad3d26822614c953bf2c25b4`; exact source blob `22a11aa09876ce20f7135d11fb6079a7c496222a`.
시각화 사유: 정확한 두 직선 조각이 원점에서 만나 V 모양을 이루며, 곡선을 매끄럽게 둥글리거나 원문에 없는 예시를 추가하지 않는다.

원문 인용(정확, 문항):

6. 다음 <보기> 문장의 참(true), 거짓(false)을 바르게 판단한 것은? [3.9점]

<보기>
(가) 극댓값은 항상 극솟값보다 크다.
(나) 미분가능한 함수 $f(x)$가 열린구간 $(a, b)$에서 $x=c$ ($a < c < b$)일 때 최댓값 또는 최솟값을 가지면 곡선 $y=f(x)$ 위의 점 $(c, f(c))$에서의 접선의 기울기는 0이다.
(다) 함수 $f(x)$가 $x=a$에서 극값을 갖는다면 $f'(a)=0$이다.

원문 인용(정확, 정답): ⑤

원문 인용(정확, 해설):

세 문장은 극값의 정의와 미분가능성 조건을 구분해야 한다.
(가) 거짓: 극댓값·극솟값은 각각 주변에서의 비교이지 서로 다른 위치의 모든 극댓값이 모든 극솟값보다 커야 한다는 뜻이 아니다.
(나) 참: 열린구간의 내부점 $c$에서 미분가능한 함수가 최댓값 또는 최솟값을 가지면 $f'(c)=0$이다(페르마의 정리).
(다) 거짓: 극값을 갖더라도 그 점에서 미분가능하지 않을 수 있다. 예를 들어 $f(x)=|x|$는 $x=0$에서 극소이지만 $f'(0)$은 존재하지 않는다.
따라서 (가) 거짓, (나) 참, (다) 거짓인 ⑤이다. ①·②는 (가)를 참으로 잘못 판단하고, ③은 (나)를 거짓으로, ④는 (다)를 참으로 잘못 판단한다.

수학 입력 요약: f(x)=|x|는 x=0에서 극소값 0을 갖지만 미분가능하지 않다. (다)는 거짓이고, (가)의 서로 다른 점의 극댓값·극솟값 사이에도 항상 같은 대소관계가 있는 것은 아니다.

검증 상태: DRAFT_ONLY. exact source 파일의 Git blob SHA-1은 `git hash-object --stdin`으로 예상값과 일치함을 확인했다. 원문 문항·정답·해설 인용은 source-exact.js의 해당 ordinal 레코드에서 직접 가져왔다.

작성자 정적 검사: 여섯 문항 모두 item/plan/publish JSON 파싱 PASS, sourcePath/ordinal 바인딩 PASS, publish alt/caption nonempty PASS. 이는 capability 또는 수학적 검증을 뜻하지 않는다. pure graph_framing fit, capability/semantic 검사, 입력 수학 독립 점검은 NOT_RUN이며 독립 checker sweep 대기 중이다.

아직 수행하지 않은 단계: production engine validation, renderer/SVG/PNG, 브라우저·시각 검수, prepare/build/handoff, 독립 전체 수학 검토, 원격 보존·게시 확인 및 CI는 NOT_RUN. DRAFT_ONLY이며 READY 또는 게시 완료 판정이 아니다. 원본 시험지/해설/자산, engine, harness, ledger는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `916ea4138cce2e1cd12580214ef858dc6c53b6bab4049856dd68c2e23086410a`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- Python 검사 근거: `preparation-22-palma-math2/checker/python-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `f772e11e9b85dc4aaa9c1e02684bb5010ff44a113567195c342477ed41119642`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이다. EQUATION_LABEL의 독립 수학 검수 또는 시각 검수 통과를 뜻하지 않는다. 원본 engine의 critical/viewport/tick guard 구간만 검사했으며 engine.prepare 자체는 실행하지 않았다.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
