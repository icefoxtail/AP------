22 팔마고 고2 수학II Q13 로컬 입력 초안.

원문 인용(정확, 문항): 13. 삼차함수 $f(x)$의 도함수 $y=f'(x)$의 그래프가 그림과 같다. 함수 $f(x)$의 극댓값이 32, 극솟값이 0일 때, $f(1)$의 값은? [4.4점]

원문 인용(정확, 해설): 그림에서 $f'(x)$는 $x=0,4$에서 0이고, 그 사이에서 양수인 아래로 열린 이차함수이다. 따라서 $f'(x)=k x(4-x)$ ($k>0$)로 둔다.
$f$는 $x=0$에서 극소, $x=4$에서 극대이므로 $f(0)=0$, $f(4)=32$이다.
$32=f(4)-f(0)=\int_0^4 kx(4-x)dx=k[2x^2-\frac{x^3}{3}]_0^4=\frac{32k}{3}$에서 $k=3$.
따라서 $f(1)=f(0)+\int_0^1 3x(4-x)dx=[6x^2-x^3]_0^1=6-1=\boxed5$.
정답 ④. ① $8$, ② $7$, ③ $6$, ⑤ $4$는 그래프의 두 영점과 극값 차이 $32$를 동시에 반영한 $f(1)$이 아니다.

수학 입력: 원문의 아래로 열린 도함수 그래프를 y=f′(x)=3x(4−x)로 정확히 복원하고, [0,1]의 적분 넓이 5만 표시한다. 점 라벨과 leader는 실제 그래프의 영점 (0,0),(4,0), 꼭짓점 (2,12)에 바인딩한다.

검증: item/plan/publish JSON 파싱, sourcePath·ordinal 바인딩, STATUS 원문 문항·해설 인용 일치, 작성한 정수·유리수 산술 sanity check는 PASS(정적 검사). 원본 region contract의 내부 curve boundary ID가 표시 functionName과 별개로 `f`를 쓰는 점을 parent code review로 확인해 영역 경계를 `f`로 바인딩했다. 실제 archived fit_overview/specFor/semantic validator/coordinateLeader 및 region validator는 이 작업자에서 NOT_RUN이며 별도 입력 계약 검수 대기다. 렌더/prepare/build, 브라우저·시각 검수, 독립 전체 수학 검토, 원격 보존은 NOT_RUN이다. DRAFT_ONLY이며 READY가 아니다.

범위: 작업 사본의 이 네 draft 디렉터리만 만들고 수정했다. 원문 blob `22a11aa09876ce20f7135d11fb6079a7c496222a`, 엔진·하네스·ledger·assets, q14/q16 legacy solution SVG, 기존 Q05/Q07/Q19 입력은 수정하지 않았다. 원격 write, tree, commit, ref, publish/handoff는 수행하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `082568b9d87c127b1e82f10dbbca86481844d94c21739d30c13db5bfdab5c32f`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- Python 검사 근거: `preparation-22-palma-math2/checker/python-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `f772e11e9b85dc4aaa9c1e02684bb5010ff44a113567195c342477ed41119642`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이다. EQUATION_LABEL의 독립 수학 검수 또는 시각 검수 통과를 뜻하지 않는다. 원본 engine의 critical/viewport/tick guard 구간만 검사했으며 engine.prepare 자체는 실행하지 않았다.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
