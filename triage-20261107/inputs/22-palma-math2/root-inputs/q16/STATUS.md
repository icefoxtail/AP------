22 팔마고 고2 수학II Q16 로컬 입력 초안.

원문 인용(정확, 문항): 16. 곡선 $y=-x^2+6x$와 $x$축으로 둘러싸인 도형의 넓이가 직선 $y=mx$에 의하여 이등분될 때, 상수 $m$에 대하여 $(6-m)^3$의 값은? [4.7점]

원문 인용(정확, 해설): 포물선 $y=-x^2+6x$와 $x$축의 교점은 $x=0,6$이다. 전체 넓이는
$S=\int_0^6(-x^2+6x)dx=[-\frac{x^3}{3}+3x^2]_0^6=36$이다.
직선 $y=mx$와 포물선의 양의 교점을 $x=b$라 하면 $-b^2+6b=mb$, 즉 $b=6-m$이다.
직선 위쪽이면서 포물선 아래쪽인 부분의 넓이는 $\int_0^b[(-x^2+6x)-mx]dx=\int_0^b(bx-x^2)dx$이다.
$=[\frac{bx^2}{2}-\frac{x^3}{3}]_0^b=\frac{b^3}{6}$.
넓이를 이등분하므로 $\frac{b^3}{6}=\frac{36}{2}=18$, 따라서 $b^3=108$.
$(6-m)^3=b^3=\boxed{108}$이고 정답 ⑤이다. ① $60$, ② $72$, ③ $84$, ④ $96$은 반쪽 넓이 $18$을 주지 않는다.

수학 입력: 승인된 부분 도식은 원래 포물선 y=−x²+6x와 x축 사이 [0,6] 전체 넓이 36만 색칠한다. 원문 풀이의 b=6−m, b³=108, 반쪽 넓이 18은 기록하되, b=∛108인 분할 직선 및 실제 반쪽 영역 색칠은 표현하지 않는다. 근사나 가짜 경계는 만들지 않았다. 원래 q16_solution.svg는 보존하며 수정하지 않았다.

검증: item/plan/publish JSON 파싱, sourcePath·ordinal 바인딩, STATUS 원문 문항·해설 인용 일치, 작성한 정수·유리수 산술 sanity check는 PASS(정적 검사). 실제 archived fit_overview/specFor/semantic validator/coordinateLeader 및 region validator는 이 작업자에서 NOT_RUN이며 별도 입력 계약 검수 대기다. 렌더/prepare/build, 브라우저·시각 검수, 독립 전체 수학 검토, 원격 보존은 NOT_RUN이다. DRAFT_ONLY이며 READY가 아니다.

범위: 작업 사본의 이 네 draft 디렉터리만 만들고 수정했다. 원문 blob `22a11aa09876ce20f7135d11fb6079a7c496222a`, 엔진·하네스·ledger·assets, q14/q16 legacy solution SVG, 기존 Q05/Q07/Q19 입력은 수정하지 않았다. 원격 write, tree, commit, ref, publish/handoff는 수행하지 않았다.

## 최종 로컬 입력 검사 기록

앞선 작성·제약·실패 이력은 보존한다. 아래는 2026-11-08T18:02:37Z 스냅샷과 현재 item/plan/publish 바이트를 다시 대조한 최신 결과다.
- plan.json SHA-256: `3052892d46d574bcd243f3e3f4befaafe9d742fe5d39f995ea4432c6ca13c389`. 3종의 현재 해시가 검사 대상과 모두 일치한다.
- 수행한 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, plan_parse=PASS, item_source_binding=PASS, source_exact_binding=PASS, publish_fields=PASS, capability_dispatch=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- Node 검사 근거: `preparation-22-palma-math2/checker/node-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `29c96746a5bc96d2511358811ccffff496789cbc92d7c72c51370a45d95afe7a`.
- Python 검사 근거: `preparation-22-palma-math2/checker/python-results-2026-11-08T18-02-37-025Z.json`; SHA-256 `f772e11e9b85dc4aaa9c1e02684bb5010ff44a113567195c342477ed41119642`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이다. EQUATION_LABEL의 독립 수학 검수 또는 시각 검수 통과를 뜻하지 않는다. 원본 engine의 critical/viewport/tick guard 구간만 검사했으며 engine.prepare 자체는 실행하지 않았다.
- 미실행: engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계. 모두 NOT_RUN이다.
- 이번 시험지는 LOCAL_ONLY이다. 원격 파일/tree/commit/ref/PR 쓰기를 시도하지 않았다. DRAFT_ONLY이며 READY나 시험지 최종 완료 판정이 아니다.
