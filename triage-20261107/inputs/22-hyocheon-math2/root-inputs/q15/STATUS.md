22 효천고 고2 수학II Q15 입력 초안.

원문 인용(정확, 문항): 최고차항의 계수가 1인 삼차함수 $f(x)$가 $f(1)=0$이고, 모든 실수 $x$에 대하여 $f(2-x)=-f(2+x)$를 만족시킨다. $\int_0^4 (f(x)-g(x))dx = 0$을 만족하는 직선을 $g(x)=ax-6$라고 할 때 $a$의 값은? (단, $a$는 양수)
원문 인용(정확, 해설): $f(2-x)=-f(2+x)$는 중심 $x=2$에 대한 점대칭, 즉 $u=x-2$로 바꾸면 홀함수라는 뜻이다. $f(x)=(x-2)^3+b(x-2)$로 놓을 수 있다. $\int_0^4 f(x)dx=0$은 중심 2의 대칭 구간에서 홀함수 적분이 0이기 때문이다.

수학 입력: $f(x)=x^3-6x^2+11x-6$은 삼차곡선, $g(x)=3x-6$은 직선이다. $(2,0)$은 점대칭 중심이며, 둘의 교점은 정확히 $(0,-6),(2,0),(4,6)$이다. 필요한 삼차 극값은 정확한 $2\pm\sqrt3/3$ 좌표로만 숨겨 기록했다. 축대칭으로 표현하지 않았고 근사 교점·점은 추가하지 않았다.

검증 상태: 현재 graph_framing.py의 순수 프레이머(원본 blob 44b320d00fda18efcd5dfba31ad56047d0387c4f)로 입력을 점검해 PASS했다. 이 입력 프레이밍 검사만 수행했다. Production validator/engine, prepare/build, renderer, 브라우저·시각 검수, 독립 전체 수학 검토, 원격 보존은 NOT_RUN이다. DRAFT_ONLY이며 READY 또는 formal/visual/independent-math PASS가 아니다. 이 작업에서는 원본·ledger·engine·assets를 수정하지 않았고, 예약된 Q06/Q07/Q09를 건드리지 않았다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `d4d97042afef7a7c2da02d22c6a90634ff052f40e695182fdab95d482d4a2e8b`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이며, EQUATION_LABEL의 독립 수학 검수나 시각 검수를 뜻하지 않는다. engine.prepare 자체를 실행하지 않고 원본 코드의 critical/viewport/tick guard 구간만 검사했다.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
