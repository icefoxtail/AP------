# 22 효천고 고2 수학II Q17

원문 근거 인용(정확):
> $D(t)=\frac{t^4}{4}-\frac{5t^3}{4}+\frac{3t^2}{2}=\frac{t^2}{4}(t^2-5t+6)=\frac{t^2}{4}(t-2)(t-3)$이다.
> $t=0$은 출발 순간이므로 제외하고, 처음으로 다시 만나는 양의 시각은 $t=2$이다.

표현 범위: t≥0에서 상대변위가 0인 출발·재회 시각만 표시한다. t=0은 처음 위치가 같은 출발 순간이므로 재회로 세지 않고, 양의 영점 중 2가 처음, 3이 다음이다. 그림은 시간 수직선이며 전체 상대변위 사차 곡선을 그리지 않는다.

검증 상태: 로컬 JSON 문법 및 기본 number-line 입력 형태만 확인했다. production validator/engine 실행, render/prepare/build, 브라우저·시각 검수, 독립 전체 수학 검증, 원격 보존, 인계는 NOT_RUN이다. READY 또는 시각·production PASS가 아니다. 원문·엔진·ledger·assets 및 기존 예약 입력은 변경하지 않았다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `710b3debfd196400fb91079566346ec95d53f38be92085865c4387da6cb81bbc`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, top_level_sourceQuote_policy=PASS, expandNumberLineFigure=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
