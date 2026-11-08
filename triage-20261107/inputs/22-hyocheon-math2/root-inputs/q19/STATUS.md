# 22 효천고 고2 수학II Q19

원문 근거 인용(정확):
> 그림에서 $f-g$는 $x=0,\alpha,\beta$에서 0이고, $0<x<\alpha$에서는 양수, $\alpha<x<\beta$에서는 음수, $x>\beta$에서는 양수다. 왼쪽 구간에서는 음수다.
> $h(0)=0$, $h(\alpha)=\int_0^\alpha(f-g)dx=S_1$이고 $h(\beta)=S_1-S_2$이다.

표현 범위: 첫 행은 임계 x 순서 0<α<β와 두 내부 구간 부호, 둘째 행은 h값 순서를 별도로 나타낸다. x행의 a,b는 각각 원문의 α,β를 가리킨다. h값 행은 h(b)=d=h(β)=S1−S2<0=h(0)<c=h(α)=h(a)=S1이다. number-line capability는 그리스 문자를 점 id로 직접 렌더할 수 없어 a,b,c,d라는 문자 대체 표기를 캡션으로 정의한다. 두 행 사이의 위치나 거리는 대응하지 않으며 상징점 간 배치는 순서만 나타낸다. 임시 배치좌표는 실제 값이 아니다. 좌우 꼬리의 부호는 캡션에 명시한다. 원본 그림의 모호한 선 형태를 직선이라고 확정하거나 함수 곡선을 그리지 않는다.

검증 상태: 로컬 JSON 문법 및 기본 number-line 입력 형태만 확인했다. production validator/engine 실행, render/prepare/build, 브라우저·시각 검수, 독립 전체 수학 검증, 원격 보존, 인계는 NOT_RUN이다. READY 또는 시각·production PASS가 아니다. 원문·엔진·ledger·assets 및 기존 예약 입력은 변경하지 않았다.

입력 제한 정적 대조 이력: 실제 number-line 코드의 rowLabelOf/ROW_LABEL_MAX_CHARS를 대조해 첫 행 라벨을 6자 이내인 `x 순서`로 최소 교정했다. 수학 내용·키·다른 값은 바꾸지 않았다. 이는 입력 라벨 길이 교정이며 production 또는 render 실패를 뜻하지 않는다.

## 최종 입력 검사 기록 (렌더 전 보존 스냅샷)

앞선 작성·실패 이력은 그대로 보존하며 아래 결과가 현재 입력 바이트에 대한 최신 검사 상태다.
- 현재 plan.json SHA-256: `0b2223f0bd8780930eb25cbd5db35a6ee7b8c900a31e724ef0fd355c13deb1c5`. item/plan/publish 해시를 검사 스냅샷과 다시 대조하여 모두 일치했다.
- 실제 수행 단계: input_files=PASS, item_parse=PASS, publish_parse=PASS, item_source_binding=PASS, publish_fields=PASS, plan_parse=PASS, top_level_sourceQuote_policy=PASS, expandNumberLineFigure=PASS.
- 검사 근거: `preparation-22-hyocheon-math2/checker/node-results.json` SHA-256 `b2cb16e3f138afbc2022ad76472c7e27304fe39a70983971f8a4b7352b38c26f`; `python-results.json` SHA-256 `5a7ee77ad395e989a1ff1c0b1969174fe149e8c5b28e1d253ef5520bf885f160`.
- engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, 공식 게시, 구현자 인계: NOT_RUN. 원격 보존은 이 스냅샷 작성 시 PENDING이다. DRAFT_ONLY이며 READY 또는 시험지 최종 완료 판정이 아니다.
