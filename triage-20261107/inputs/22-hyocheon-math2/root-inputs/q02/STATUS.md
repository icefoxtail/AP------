22 효천고 고2 수학II Q02 입력 초안.

원문 인용(정확, 문항): 2. 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서 위치 $x$가 $x=t^3-6t^2-9t$일 때, 점 $\mathrm{P}$의 속도가 $6$이 되는 시각은? [3.0점]
원문 인용(정확, 해설): $t=5$ 또는 $-1$이지만 시각은 $t\ge0$이므로 $t=5$이다.

수학 입력: $v(t)=3t^2-12t-9$, 정의역은 $t\ge0$이다. 닫힌 시작점은 $(0,-9)$이며, 꼭짓점은 $(2,-21)$, $y=6$과의 유일한 허용 교점은 $(5,6)$이다. 해설의 $t=-1$은 시간 조건에서 제외되며 그래프의 허용 점이나 참조 교점으로 넣지 않았다. 유한 xWindow [0,6]은 표시 프레임뿐이며 정의역을 바꾸지 않는다. ROOT 요청에 따라 실제 requiredPoints P,V의 좌표에는 coordinateLeader 선을 지정했다.

검증 상태: 현재 graph_framing.py의 순수 프레이머(원본 blob 44b320d00fda18efcd5dfba31ad56047d0387c4f)로 입력을 점검해 PASS했다. 이 입력 프레이밍 검사만 수행했다. Production validator/engine, prepare/build, renderer, 브라우저·시각 검수, 독립 전체 수학 검토, 원격 보존은 NOT_RUN이다. DRAFT_ONLY이며 READY 또는 formal/visual/independent-math PASS가 아니다. 이 작업에서는 원본·ledger·engine·assets를 수정하지 않았고, 예약된 Q06/Q07/Q09를 건드리지 않았다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `e9f8cc314a45cf0b9753b488af1c05a329b37c8677f8e6d8fc812742a59622c4`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, fit_overview=PASS, specFor=PASS, coordinateLeaderContract=PASS, semantic_model.validate=PASS, exact_coordinate_per_coordinate_label=PASS, engine_critical_construction=PASS, viewport.for_spec=PASS, engine_axis_tick_guard=PASS, fit_spec_tick_static_match=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- exact_coordinate 검사는 실제 COORDINATE_LABEL 0개에 한정한다. 해당 라벨이 0개면 검사 대상 없음이며, EQUATION_LABEL의 독립 수학 검수나 시각 검수를 뜻하지 않는다. engine.prepare 자체를 실행하지 않고 원본 코드의 critical/viewport/tick guard 구간만 검사했다.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
