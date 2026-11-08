23 매산여고 고2 수학II Q11 로컬 입력 초안. source 조건으로부터 얻은 a=2, t=-2를 실제 piecewise cubic 및 slanted referenceLine에 바인딩하고 교점 x좌표와 영역 경계를 exact하게 명시했다. cubic 두 stationary points는 contract상 요구되어 marker NONE으로 기록하고 화면에서는 숨긴다. sourceDomain ALL_REALS이며 유한 프레임은 표시창이다. source/ledger/engine/기존 자산은 수정하지 않았다. local JSON 파싱 및 item sourceQuote의 원문 부분문자열 일치: PASS(정적 확인만). actual fit_overview input-only check: 별도 checker 대기. 렌더: NOT_RUN; 시각 검수: NOT_RUN; 독립 수학 검토: NOT_RUN; 원격 보존: NOT_RUN. READY 아님.
사용자 요청 사유는 함수 그래프가 풀이 이해를 돕는다는 점이다. item.json의 원문 sourceQuote는 원본 해설에서 그대로 발췌했다. 원문·기존 자산·이력은 보존하고 이 초안은 원격에 쓰지 않는다.

Engine input source: main 44ac8c11b19816268bbc59f2abae5a43975964b9; phase2.mjs 338e53b8e85c9420b356082adf50e7a49c685a4d; graph_framing.py 44b320d00fda18efcd5dfba31ad56047d0387c4f. Draft-only; no renderer claim.

원문 발췌 (item.json.sourceQuote, verbatim):
f(x)=a(x^3-9x)$이고 $x=t$에서의 접선과 곡선의 차를 계산하면 $f(x)-l(x)=a(x-t)^2(x+2t)$이다. 따라서 접점 $x=t$ 이외의 교점의 $x$좌표는 $-2t$이다.

실제 입력검사에서 PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION을 확인해, 허용된 axisScale만 추가했다. 표시 배율을 axisScale x:y=3:1로 명시했다. 즉 화면에서 y축 단위 길이는 x축의 1/3이며, 함수식·접점·교점·영역·넓이는 바꾸지 않았다. 실제 fit_overview 재검사 대기; 렌더와 외부 write는 하지 않았다.

History: initial actual fit_overview input check failed with PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION. ROOT approved the explicit supported axisScale x:y=3:1; mathematical data and the 4 px check remain unchanged. Recheck of this revised candidate is pending. Renderer/visual review/independent math review remain NOT_RUN.

입력 단계 재검사 결과 (2026-11-08; 전체 작업 최종 판정 아님):
실제 `fit_overview`, `specFor`(미사용 placeholder 호출 0), `semantic_model.validate`, engine critical/`viewport.for_spec`: PASS. 실제 존재하는 COORDINATE_LABEL만 exact coordinate로 대조해 PASS; 전체 독립 수학 검수나 숨겨진 점/관계 전체 검증은 아니다.
Q11 최초 4px 확인 실패 이력은 보존했다. ROOT 승인 x:y=3:1 비율 적용 후 입력 단계 검사 PASS.
전 문항 공통: 렌더, prepare, 학생 시각 검수, 독립 전체 수학 검토, official CREATE PASS는 NOT_RUN이며 전체 상태는 NOT_READY. source/ledger/engine 및 기존 예약 5건은 변경하지 않았다.
