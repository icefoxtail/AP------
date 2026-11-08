22 팔마고 고2 수학II Q02 입력 초안.

원문 바인딩: `archive/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js` ordinal 2; main commit `dce7678719f1a449ad3d26822614c953bf2c25b4`; exact source blob `22a11aa09876ce20f7135d11fb6079a7c496222a`.
시각화 사유: 곡선은 속도 v(t)만 표시한다. 가로축 변수는 시간 t, 세로축 제목은 속도로 구분하고, 단위가 다른 가속도는 별도 세로축 곡선으로 겹쳐 그리지 않고 식과 값으로 적는다.

원문 인용(정확, 문항):

2. 원점을 출발하여 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서 위치 $x$가 $x=t^3-6t^2+9t$이다. $t=3$일 때, 점 $\mathrm{P}$의 속도와 가속도의 합은? [3.6점]

원문 인용(정확, 정답): ⑤

원문 인용(정확, 해설):

위치의 도함수는 속도, 속도의 도함수는 가속도이다.
$x(t)=t^3-6t^2+9t$에서 $v(t)=x'(t)=3t^2-12t+9$, $a(t)=v'(t)=6t-12$.
$t=3$을 대입하면 $v(3)=27-36+9=0$, $a(3)=18-12=6$.
따라서 $v(3)+a(3)=\boxed{6}$으로 ⑤이다. ① $2$, ② $3$, ③ $4$, ④ $5$는 두 도함수의 정확한 대입 합과 다르다.

수학 입력 요약: 속도 v(t)=3t²−12t+9의 그래프에서 t=3의 점은 (3,0)이다. 가속도는 별도 함수 a(t)=6t−12이며 a(3)=6이므로 v(3)+a(3)=6이다.

검증 상태: DRAFT_ONLY. exact source 파일의 Git blob SHA-1은 `git hash-object --stdin`으로 예상값과 일치함을 확인했다. 원문 문항·정답·해설 인용은 source-exact.js의 해당 ordinal 레코드에서 직접 가져왔다.

작성자 정적 검사: 여섯 문항 모두 item/plan/publish JSON 파싱 PASS, sourcePath/ordinal 바인딩 PASS, publish alt/caption nonempty PASS. 이는 capability 또는 수학적 검증을 뜻하지 않는다. pure graph_framing fit, capability/semantic 검사, 입력 수학 독립 점검은 NOT_RUN이며 독립 checker sweep 대기 중이다.

아직 수행하지 않은 단계: production engine validation, renderer/SVG/PNG, 브라우저·시각 검수, prepare/build/handoff, 독립 전체 수학 검토, 원격 보존·게시 확인 및 CI는 NOT_RUN. DRAFT_ONLY이며 READY 또는 게시 완료 판정이 아니다. 원본 시험지/해설/자산, engine, harness, ledger는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `758d4bce94a54b9f2d52636df3f406f78063f6ae63113cf744a75874377299ce`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- Python 검사 근거: `preparation-22-palma-math2/checker/python-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `f772e11e9b85dc4aaa9c1e02684bb5010ff44a113567195c342477ed41119642`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이다. EQUATION_LABEL의 독립 수학 검수 또는 시각 검수 통과를 뜻하지 않는다. 원본 engine의 critical/viewport/tick guard 구간만 검사했으며 engine.prepare 자체는 실행하지 않았다.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
