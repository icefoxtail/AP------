22 효천고 고2 수학II Q11 입력 초안.

원문 인용(정확, 문항): 11. 곡선 $y=3x^2+1$과 $x$축 및 두 직선 $x=1$, $x=1+h$ ($h>0$)로 둘러싸인 도형의 넓이를 $S(h)$라고 할 때, $\lim_{h \to 0+} \frac{S(h)}{h}$의 값은? [4.0점]
원문 인용(정확, 해설): $h>0$에서 도형의 넓이는 $S(h)=\int_1^{1+h}(3x^2+1)dx$이다. $\dfrac{S(h)}h=4+3h+h^2$이고 $h\to0+$에서 극한은 $4$이다.

수학 입력: $h=1/2$를 명시적인 예시로만 표시해 [1,3/2]의 넓이 $23/8$과 끝점 $(1,4),(3/2,31/4)$를 그린다. 원문 일반 조건은 임의의 $h>0$이고 극한은 $4$이다. 예시를 보편적 $h$ 값처럼 표현하지 않는다.

검증 상태: 현재 graph_framing.py의 순수 프레이머(원본 blob 44b320d00fda18efcd5dfba31ad56047d0387c4f)로 입력을 점검해 PASS했다. Q11은 전체 정의역의 꼭짓점 (0,1)을 표시하지 않는 검수점으로 포함했다. JSON 문법 및 작성한 입력의 exact arithmetic sanity check도 수행한다. Production validator/engine, prepare/build, renderer, 브라우저·시각 검수, 독립 전체 수학 검토, 원격 보존은 NOT_RUN이다. DRAFT_ONLY이며 READY 또는 formal/visual/independent-math PASS가 아니다. 이 작업에서는 원본·ledger·engine·assets를 수정하지 않았고, 예약된 Q06/Q07/Q09를 건드리지 않았다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `d346ff4ab44abc701c9b4cd6e773ec4ede15a3e4099545a3b1032a8ec28b0713`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이며, EQUATION_LABEL의 독립 수학 검수나 시각 검수를 뜻하지 않는다. engine.prepare 자체를 실행하지 않고 원본 코드의 critical/viewport/tick guard 구간만 검사했다.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
