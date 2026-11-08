# 22 효천고 고2 수학II Q21

원문 근거 인용(정확):
> 극솟값은 $2n(16-n^2)$이다.
> $n=4$이면 극솟값이 0이 되어 중근과 다른 근, 서로 다른 실근 2개다. $n>4$이면 극솟값이 음수여서 서로 다른 실근 3개다.
> 따라서 $n=1,2,3$이고 합은 $1+2+3=6$이다.

표현 범위: 자연수 n에서 1개의 서로 다른 실근을 주는 n=1,2,3과 3개의 실근을 주는 n>4 범위를 표시한다. n=4는 두 실근인 경계 사례, n=3은 예시로 표시한다. 이 계획은 근 개수 판정용 매개변수 수직선이며 임의의 삼차곡선을 추정하지 않는다.

검증 상태: 로컬 JSON 문법 및 기본 number-line 입력 형태만 확인했다. production validator/engine 실행, render/prepare/build, 브라우저·시각 검수, 독립 전체 수학 검증, 원격 보존, 인계는 NOT_RUN이다. READY 또는 시각·production PASS가 아니다. 원문·엔진·ledger·assets 및 기존 예약 입력은 변경하지 않았다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `2ce2ddc14e746ea45bc667bd36df3a1d9f2e606affbb4ae6d7c8fbcb83390cbc`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, top_level_sourceQuote_policy=PASS, expandNumberLineFigure=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
