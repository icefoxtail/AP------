22 팔마고 고2 수학II Q14 로컬 입력 초안.

원문 인용(정확, 문항): 14. 곡선 $y=x(x-a)^2$과 직선 $y=x$로 둘러싸인 두 도형의 넓이가 같을 때, 상수 $a$의 값은? (단, $a>0$) [4.5점]

원문 인용(정확, 해설): 두 곡선의 교점은 $x(x-a)^2=x$, 즉 $x[(x-a)^2-1]=0$에서 $x=0,a-1,a+1$이다.
$0<a<1$이면 $a-1<0<a+1$이고 두 영역의 넓이가 같으려면 $\int_{a-1}^{a+1}x[(x-a)^2-1]dx=0$이어야 한다. 그러나 이 값은 $-4a/3\ne0$이므로 불가능하다. $a=1$에서는 $0$이 중근이 되어 두 영역이 생기지 않는다.
따라서 $a>1$을 보자. 이때 $0<x<a-1$에서는 곡선 $y=x(x-a)^2$가 위쪽, $a-1<x<a+1$에서는 직선 $y=x$가 위쪽이다.
두 넓이가 같다는 조건은 부호를 포함한 전체 정적분이 0이라는 뜻이다.
$0=\int_0^{a+1}x[(x-a)^2-1]dx=\left[\frac{x^4}{4}-\frac{2a}{3}x^3+\frac{a^2-1}{2}x^2\right]_0^{a+1}$
$=\frac{(a-3)(a+1)^3}{12}$.
$a>1$이므로 $a=3$이고 정답 ③이다. ① $1$은 세 교점이 중복되고, ② $2$, ④ $4$, ⑤ $5$는 두 영역의 넓이가 서로 다르다.

수학 입력: 해에서 구한 a=3을 원래 두 곡선 f(x)=x(x−3)²와 g(x)=x에 적용한다. 실제 교점 (0,0),(2,2),(4,4)와 두 영역 [0,2],[2,4]를 각각 표시한다. 원래 q14_solution.svg는 보존하며 수정하지 않았다.

검증: item/plan/publish JSON 파싱, sourcePath·ordinal 바인딩, STATUS 원문 문항·해설 인용 일치, 작성한 정수·유리수 산술 sanity check는 PASS(정적 검사). 실제 archived fit_overview/specFor/semantic validator/coordinateLeader 및 region validator는 이 작업자에서 NOT_RUN이며 별도 입력 계약 검수 대기다. 렌더/prepare/build, 브라우저·시각 검수, 독립 전체 수학 검토, 원격 보존은 NOT_RUN이다. DRAFT_ONLY이며 READY가 아니다.

범위: 작업 사본의 이 네 draft 디렉터리만 만들고 수정했다. 원문 blob `22a11aa09876ce20f7135d11fb6079a7c496222a`, 엔진·하네스·ledger·assets, q14/q16 legacy solution SVG, 기존 Q05/Q07/Q19 입력은 수정하지 않았다. 원격 write, tree, commit, ref, publish/handoff는 수행하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `d083890b4a4debedb63dca0191c5477c87fceab7ea0f2bd725836429edb954f2`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- Python 검사 근거: `preparation-22-palma-math2/checker/python-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `f772e11e9b85dc4aaa9c1e02684bb5010ff44a113567195c342477ed41119642`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이다. EQUATION_LABEL의 독립 수학 검수 또는 시각 검수 통과를 뜻하지 않는다. 원본 engine의 critical/viewport/tick guard 구간만 검사했으며 engine.prepare 자체는 실행하지 않았다.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
