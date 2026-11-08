23 매산여고 고2 수학II Q13 로컬 입력 초안. F의 cubic 계수 1/3을 포함해 four-piece 절댓값 곡선과 세 breakpoint를 실제 contract에 입력했다. sourceDomain ALL_REALS, 표시 프레임은 유한하지만 원래 정의역을 바꾸지 않는다. 고유 metadata HOLD는 그대로 유지하고 수정/해제하지 않았다. source/ledger/engine/기존 자산은 수정하지 않았다. local JSON 파싱 및 item sourceQuote의 원문 부분문자열 일치: PASS(정적 확인만). actual fit_overview input-only check: 별도 checker 대기. 렌더: NOT_RUN; 시각 검수: NOT_RUN; 독립 수학 검토: NOT_RUN; 원격 보존: NOT_RUN. READY 아님.
사용자 요청 사유는 함수 그래프가 풀이 이해를 돕는다는 점이다. item.json의 원문 sourceQuote는 원본 해설에서 그대로 발췌했다. 원문·기존 자산·이력은 보존하고 이 초안은 원격에 쓰지 않는다. Q13 metadata HOLD는 그대로다.

Engine input source: main 44ac8c11b19816268bbc59f2abae5a43975964b9; phase2.mjs 338e53b8e85c9420b356082adf50e7a49c685a4d; graph_framing.py 44b320d00fda18efcd5dfba31ad56047d0387c4f. Draft-only; no renderer claim.

원문 발췌 (item.json.sourceQuote, verbatim):
F(x)=\displaystyle\int_0^x f(t)dt$라 두면 $g(x)=|F(x)|$이다. $F(a)\ne0$이면 $g'(a)=\pm f(a)$이므로 $f(a)=0$이다. $F(a)=0$인 경우에도 $g'(a)$가 존재하려면 $F'(a)=f(a)=0$이어야 한다. 같은 이유로 $f(b)=0$이다. 따라서 최고차항이 $1$이고 $a+b=4$이므로 $f(x)=(x-a)(x-b)=x^2-4x+c$로 둘 수 있다.

입력 단계 재검사 결과 (2026-11-08; 전체 작업 최종 판정 아님):
실제 `fit_overview`, `specFor`(미사용 placeholder 호출 0), `semantic_model.validate`, engine critical/`viewport.for_spec`: PASS. 실제 존재하는 COORDINATE_LABEL만 exact coordinate로 대조해 PASS; 전체 독립 수학 검수나 숨겨진 점/관계 전체 검증은 아니다.
전 문항 공통: 렌더, prepare, 학생 시각 검수, 독립 전체 수학 검토, official CREATE PASS는 NOT_RUN이며 전체 상태는 NOT_READY. source/ledger/engine 및 기존 예약 5건은 변경하지 않았다.
