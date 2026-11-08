22 팔마고 고2 수학II Q12 입력 초안.

원문 바인딩: `archive/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js` ordinal 12; main commit `dce7678719f1a449ad3d26822614c953bf2c25b4`; exact source blob `22a11aa09876ce20f7135d11fb6079a7c496222a`.
시각화 사유: 위치 곡선은 닫힌 시작점 (0,2)부터 시간 t≥0에서만 표시한다. (2,0)은 원점을 통과하는 유효 시각이고, 음의 시간 쪽 가지나 근 t=−1은 그리지 않는다.

원문 인용(정확, 문항):

12. 좌표가 2인 점에서 출발하여 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서의 속도가 $v(t)=1-2t$일 때, 점 $\mathrm{P}$가 원점을 지나는 시각은? [4.3점]

원문 인용(정확, 정답): ④

원문 인용(정확, 해설):

속도를 적분하면 위치의 변화량을 얻는다.
$x(t)=x(0)+\int_0^t v(s)ds=2+\int_0^t(1-2s)ds=2+t-t^2$이다.
원점을 지날 때 $x(t)=0$이므로 $t^2-t-2=(t-2)(t+1)=0$.
시간은 $t\ge0$이므로 $t=-1$은 제외하고 $\boxed{t=2}$이다.
정답 ④. ① $1/2$, ② $1$, ③ $3/2$, ⑤ $5/2$는 $2+t-t^2=0$을 만족하지 않는다.

수학 입력 요약: 위치 x(t)=2+t−t²의 그래프는 실제 시간 범위 t≥0에서만 그린다. 시작점은 (0,2)이고 원점을 지나는 시각은 t=2이다. 방정식의 다른 근 t=−1은 시간 범위 밖이므로 제외한다.

검증 상태: DRAFT_ONLY. exact source 파일의 Git blob SHA-1은 `git hash-object --stdin`으로 예상값과 일치함을 확인했다. 원문 문항·정답·해설 인용은 source-exact.js의 해당 ordinal 레코드에서 직접 가져왔다.

작성자 정적 검사: 여섯 문항 모두 item/plan/publish JSON 파싱 PASS, sourcePath/ordinal 바인딩 PASS, publish alt/caption nonempty PASS. 이는 capability 또는 수학적 검증을 뜻하지 않는다. pure graph_framing fit, capability/semantic 검사, 입력 수학 독립 점검은 NOT_RUN이며 독립 checker sweep 대기 중이다.

아직 수행하지 않은 단계: production engine validation, renderer/SVG/PNG, 브라우저·시각 검수, prepare/build/handoff, 독립 전체 수학 검토, 원격 보존·게시 확인 및 CI는 NOT_RUN. DRAFT_ONLY이며 READY 또는 게시 완료 판정이 아니다. 원본 시험지/해설/자산, engine, harness, ledger는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `7f0e4ae5aeda85cee4a7076df514fd6f4b380964e9e219173f440aea6c447679`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- Python 검사 근거: `preparation-22-palma-math2/checker/python-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `f772e11e9b85dc4aaa9c1e02684bb5010ff44a113567195c342477ed41119642`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이다. EQUATION_LABEL의 독립 수학 검수 또는 시각 검수 통과를 뜻하지 않는다. 원본 engine의 critical/viewport/tick guard 구간만 검사했으며 engine.prepare 자체는 실행하지 않았다.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
