22 팔마고 고2 수학II Q17 로컬 입력 초안.

원문 인용(정확, 문항): 17. 실수 $a$에 대하여 두 함수 $f(x)=\frac{1}{4}x^4-2x^2+x+6$, $g(x)=x+a$의 그래프가 만나는 서로 다른 점의 개수를 $k(a)$라 할 때, $\sum_{a=1}^{12} k(a)$의 값은? [4.8점]

원문 인용(정확, 해설): 교점은 $\frac14x^4-2x^2+x+6=x+a$의 서로 다른 실근 수이다.
정리하면 $\frac14(x^2-4)^2=a-2$, 즉 $(x^2-4)^2=4(a-2)$이다.
$a<2$이면 실근이 없고, $a=2$이면 $x=\pm2$로 2개이다.
$2<a<6$이면 $x^2=4\pm2\sqrt{a-2}$의 두 값이 모두 양수이므로 4개이다.
$a=6$이면 $x^2=8$ 또는 $x^2=0$이므로 $\pm\sqrt8,0$의 3개이다.
$a>6$이면 $x^2=4-2\sqrt{a-2}<0$은 불가능하고 나머지에서 2개이다.
따라서 $a=1$에서 0개, $a=2$에서 2개, $a=3,4,5$에서 $3\cdot4=12$개, $a=6$에서 3개, $a=7,\ldots,12$에서 $6\cdot2=12$개.
합은 $0+2+12+3+12=\boxed{29}$이므로 ②이다. ① $31$, ③ $27$, ④ $25$, ⑤ $24$는 $a=2,6$의 중복근을 서로 다른 근으로 정확히 세지 않은 결과다.

수학 입력: 차 함수 h(x)=f(x)−x=¼(x²−4)²+2를 ALL_REALS에서 그린다. 실제 극값은 (−2,2),(0,6),(2,2)이며 h(x)=a의 근 개수 변화 0/2/4/3/2와 원문의 합 29를 캡션에 적는다. 임의의 매개변수 예시나 보조 수평선은 추가하지 않았다.

검증: item/plan/publish JSON 파싱, sourcePath·ordinal 바인딩, STATUS 원문 문항·해설 인용 일치, 작성한 정수·유리수 산술 sanity check는 PASS(정적 검사). 실제 archived fit_overview/specFor/semantic validator/coordinateLeader 및 region validator는 이 작업자에서 NOT_RUN이며 별도 입력 계약 검수 대기다. 렌더/prepare/build, 브라우저·시각 검수, 독립 전체 수학 검토, 원격 보존은 NOT_RUN이다. DRAFT_ONLY이며 READY가 아니다.

범위: 작업 사본의 이 네 draft 디렉터리만 만들고 수정했다. 원문 blob `22a11aa09876ce20f7135d11fb6079a7c496222a`, 엔진·하네스·ledger·assets, q14/q16 legacy solution SVG, 기존 Q05/Q07/Q19 입력은 수정하지 않았다. 원격 write, tree, commit, ref, publish/handoff는 수행하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `440391a29ac4a4527aab4e4a25902f5df664b28c1cd2ad4a7778ede10dd7a3f6`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- Python 검사 근거: `preparation-22-palma-math2/checker/python-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `f772e11e9b85dc4aaa9c1e02684bb5010ff44a113567195c342477ed41119642`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이다. EQUATION_LABEL의 독립 수학 검수 또는 시각 검수 통과를 뜻하지 않는다. 원본 engine의 critical/viewport/tick guard 구간만 검사했으며 engine.prepare 자체는 실행하지 않았다.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
