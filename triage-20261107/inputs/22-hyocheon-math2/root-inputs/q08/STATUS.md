22 효천고 고2 수학II Q08 입력 초안.

원문 인용(정확, 문항): 8. 함수 $f(x)=\int_0^x (3t^2-6t-9)dt$의 극댓값과 극솟값의 합은? [3.7점]
원문 인용(정확, 해설): $f'(x)=3x^2-6x-9=3(x+1)(x-3)$이므로 극대는 $x=-1$, 극소는 $x=3$이다. $f(-1)=-1-3+9=5$, $f(3)=27-27-27=-27$이다. 합은 $5+(-27)=-22$이다.

수학 입력: $f(x)=x^3-3x^2-9x$의 정의역은 실수 전체이며 두 해설상 극점만 필요한 좌표로 정확히 표시했다. ROOT 요청에 따라 실제 requiredPoints M,N의 좌표에는 coordinateLeader 선을 지정했다.

검증 상태: 현재 graph_framing.py의 순수 프레이머(원본 blob 44b320d00fda18efcd5dfba31ad56047d0387c4f)로 입력을 점검해 PASS했다. 이 입력 프레이밍 검사만 수행했다. Production validator/engine, prepare/build, renderer, 브라우저·시각 검수, 독립 전체 수학 검토, 원격 보존은 NOT_RUN이다. DRAFT_ONLY이며 READY 또는 formal/visual/independent-math PASS가 아니다. 이 작업에서는 원본·ledger·engine·assets를 수정하지 않았고, 예약된 Q06/Q07/Q09를 건드리지 않았다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `17b93a79a6d1a144d0d3437da5b7f6dcb3e04c841a83d6db62a0eb464c11dfef`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이며, EQUATION_LABEL의 독립 수학 검수나 시각 검수를 뜻하지 않는다. engine.prepare 자체를 실행하지 않고 원본 코드의 critical/viewport/tick guard 구간만 검사했다.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
