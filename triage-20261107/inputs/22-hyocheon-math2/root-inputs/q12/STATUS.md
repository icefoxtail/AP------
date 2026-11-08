# 22 효천고 고2 수학II Q12

원문 근거 인용(정확):
> $\{(x^3-1)f(x)\}'=3x^2f(x)+(x^3-1)f'(x)$이므로 주어진 적분의 합은
> $[(x^3-1)f(x)]_0^3=26f(3)-(-1)f(0)=26f(3)+f(0)$이다.
> 조건 $f(0)=-8$과 전체 값 5를 대입하면 $26f(3)-8=5$, $26f(3)=13$이다.

표현 범위: H(x)=(x³−1)f(x)의 경계 대응 x=0→H(0)=8, x=3→H(3)=13과 차이 5만 표시한다. 두 경계는 선형 함수 그래프처럼 잇지 않으며 x값과 H값을 별도 열로 구분한다. 따라서 f(3)=1/2이다. 사용자가 이해에 도움이 되는 시각화를 요청한 취지를 반영했다.

검증 상태: 로컬 JSON 문법 및 기본 number/diagram 입력 형태만 확인했다. production validator/engine 실행, render/prepare/build, 브라우저·시각 검수, 독립 전체 수학 검증, 원격 보존, 인계는 NOT_RUN이다. READY 또는 시각·production PASS가 아니다. 원문·엔진·ledger·assets 및 기존 예약 입력은 변경하지 않았다.

입력 명료화 이력: publish.caption에 승인된 정의 H(x)=(x³−1)f(x)를 덧붙여 H(3) 값의 의미를 보이게 했다. 기존 수학 내용은 유지했다. 이 편집 후 별도 engine/render 검증은 실행하지 않았다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `f35c2eb477e5f714e858a22a5e8e464d8c19d8670890ac5c5595611eca9d3522`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, checkSetDiagramPlan=PASS, setDiagramSpec=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
