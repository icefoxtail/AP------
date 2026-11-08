22 팔마고 고2 수학II Q08 입력 초안.

원문 바인딩: `archive/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js` ordinal 8; main commit `dce7678719f1a449ad3d26822614c953bf2c25b4`; exact source blob `22a11aa09876ce20f7135d11fb6079a7c496222a`.
시각화 사유: 두 수평선은 실제 경계 높이 y=−2, y=−6이다. 각 경계에서는 서로 다른 교점이 두 개뿐이고, 두 높이 사이의 수평선은 세 번 교차한다.

원문 인용(정확, 문항):

8. 방정식 $x^3+6x^2+9x-2-a=0$이 서로 다른 세 실근을 갖도록 하는 정수 $a$의 개수는? [4.1점]

원문 인용(정확, 정답): ③

원문 인용(정확, 해설):

$h(x)=x^3+6x^2+9x-2$라 두면 원래 방정식은 $h(x)=a$이다. 수평선과 삼차함수 그래프의 교점이 세 개일 조건을 구한다.
$h'(x)=3x^2+12x+9=3(x+3)(x+1)$이므로 극대점 $x=-3$, 극소점 $x=-1$이다.
$h(-3)=-2$, $h(-1)=-6$이므로 서로 다른 세 실근을 가지려면 $-6<a<-2$여야 한다. 등호이면 중근이 생겨 서로 다른 세 근이 아니다.
가능한 정수 $a$는 $-5,-4,-3$으로 $\boxed{3}$개, 정답 ③이다. ① $1$, ② $2$는 누락, ④ $4$, ⑤ $5$는 경계나 범위 밖 정수를 포함한다.

수학 입력 요약: h의 극대는 (−3,−2), 극소는 (−1,−6)이다. −6<a<−2일 때 수평선 y=a와 그래프는 세 점에서 만나며, 경계 a=−6,−2는 제외된다. 가능한 정수 a는 −5,−4,−3으로 3개이다.

검증 상태: DRAFT_ONLY. exact source 파일의 Git blob SHA-1은 `git hash-object --stdin`으로 예상값과 일치함을 확인했다. 원문 문항·정답·해설 인용은 source-exact.js의 해당 ordinal 레코드에서 직접 가져왔다.

정적 계약 보정: Q08 수평선 id를 허용 길이 안의 `high`/`low`로 줄였다. 수학은 바꾸지 않았다.

작성자 정적 검사: 여섯 문항 모두 item/plan/publish JSON 파싱 PASS, sourcePath/ordinal 바인딩 PASS, publish alt/caption nonempty PASS. 이는 capability 또는 수학적 검증을 뜻하지 않는다. pure graph_framing fit, capability/semantic 검사, 입력 수학 독립 점검은 NOT_RUN이며 독립 checker sweep 대기 중이다.

아직 수행하지 않은 단계: production engine validation, renderer/SVG/PNG, 브라우저·시각 검수, prepare/build/handoff, 독립 전체 수학 검토, 원격 보존·게시 확인 및 CI는 NOT_RUN. DRAFT_ONLY이며 READY 또는 게시 완료 판정이 아니다. 원본 시험지/해설/자산, engine, harness, ledger는 수정하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `9db1f15bd9c81fd6142f0a5ebe989a71403f9bf9f9a0138a54135ee2bb783b9a`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- Python 검사 근거: `preparation-22-palma-math2/checker/python-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `f772e11e9b85dc4aaa9c1e02684bb5010ff44a113567195c342477ed41119642`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이다. EQUATION_LABEL의 독립 수학 검수 또는 시각 검수 통과를 뜻하지 않는다. 원본 engine의 critical/viewport/tick guard 구간만 검사했으며 engine.prepare 자체는 실행하지 않았다.
- 첫 실제 검사에서 긴 참조선 ID 때문에 PIECEWISE_POLY_REFERENCE_LINE_INVALID가 발생했다. ID만 high/low로 줄인 현재 입력의 재검사는 PASS다.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
