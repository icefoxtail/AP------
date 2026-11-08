23 매산여고 고2 수학II Q06 로컬 입력 초안. 원문과 ROOT 승인 수식에 맞춰 실제 piecewise-polynomial 입력을 작성했다. cubic 주곡선과 quadratic referenceCurve, exact intersectionX, 필수 reference vertex, 두 graph regions를 사용했다. sourceDomain은 ALL_REALS이며 엔진이 정하는 유한 프레임은 표시 범위일 뿐 정의역 제한이 아니다. source/ledger/engine/기존 자산은 수정하지 않았다. local JSON 파싱 및 item sourceQuote의 원문 부분문자열 일치: PASS(정적 확인만). actual fit_overview input-only check: 별도 checker 대기. 렌더: NOT_RUN; 시각 검수: NOT_RUN; 독립 수학 검토: NOT_RUN; 원격 보존: NOT_RUN. READY 아님.
사용자 요청 사유는 함수 그래프가 풀이 이해를 돕는다는 점이다. item.json의 원문 sourceQuote는 원본 해설에서 그대로 발췌했다. 원문·기존 자산·이력은 보존하고 이 초안은 원격에 쓰지 않는다.

Engine input source: main 44ac8c11b19816268bbc59f2abae5a43975964b9; phase2.mjs 338e53b8e85c9420b356082adf50e7a49c685a4d; graph_framing.py 44b320d00fda18efcd5dfba31ad56047d0387c4f. Draft-only; no renderer claim.

원문 발췌 (item.json.sourceQuote, verbatim):
두 함수의 차는 $x^3-6x^2+8x=x(x-2)(x-4)$이므로 교점의 $x$좌표는 $0,2,4$이다.

실제 입력검사에서 PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION을 확인해, 허용된 axisScale만 추가했다. 표시 배율을 axisScale x:y=2:1로 명시했다. 즉 화면에서 y축 단위 길이는 x축의 1/2이며, 함수식·교점·영역·넓이는 바꾸지 않았다. 실제 fit_overview 재검사 대기; 렌더와 외부 write는 하지 않았다.

History: initial actual fit_overview input check failed with PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION. ROOT approved the explicit supported axisScale x:y=2:1; mathematical data and the 4 px check remain unchanged. Recheck of this revised candidate is pending. Renderer/visual review/independent math review remain NOT_RUN.

입력 단계 재검사 결과 (2026-11-08; 전체 작업 최종 판정 아님):
실제 `fit_overview`, `specFor`(미사용 placeholder 호출 0), `semantic_model.validate`, engine critical/`viewport.for_spec`: PASS. 실제 존재하는 COORDINATE_LABEL만 exact coordinate로 대조해 PASS; 전체 독립 수학 검수나 숨겨진 점/관계 전체 검증은 아니다.
Q06 최초 4px 확인 실패 이력은 보존했다. ROOT 승인 x:y=2:1 비율 적용 후 입력 단계 검사 PASS.
전 문항 공통: 렌더, prepare, 학생 시각 검수, 독립 전체 수학 검토, official CREATE PASS는 NOT_RUN이며 전체 상태는 NOT_READY. source/ledger/engine 및 기존 예약 5건은 변경하지 않았다.
