23 매산여고 고2 수학II Q21 로컬 입력 초안. sourceDomain을 INTERVAL [0,3], CLOSED/CLOSED로 보존하고 원래 cubic 한 조각으로 네 필수점을 표시한다. 극댓값 4와 전역 최댓값 8을 구분한다. 기존 Q21 SVG 및 기존 최댓값/최솟값 오표기 이력은 읽기/수정/대체하지 않고 보존한다. 별도 helper 대안은 다른 담당자가 작성 중이므로 여기에 쓰지 않았다. source/ledger/engine/기존 자산은 수정하지 않았다. local JSON 파싱 및 item sourceQuote의 원문 부분문자열 일치: PASS(정적 확인만). actual fit_overview input-only check: 별도 checker 대기. 렌더: NOT_RUN; 시각 검수: NOT_RUN; 독립 수학 검토: NOT_RUN; 원격 보존: NOT_RUN. READY 아님.
사용자 요청 사유는 함수 그래프가 풀이 이해를 돕는다는 점이다. item.json의 원문 sourceQuote는 원본 해설에서 그대로 발췌했다. 원문·기존 자산·이력은 보존하고 이 초안은 원격에 쓰지 않는다. Q21 구 SVG의 최댓값/최솟값 오표기 이력은 보존하며 파일은 수정·대체하지 않는다.

Engine input source: main 44ac8c11b19816268bbc59f2abae5a43975964b9; phase2.mjs 338e53b8e85c9420b356082adf50e7a49c685a4d; graph_framing.py 44b320d00fda18efcd5dfba31ad56047d0387c4f. Draft-only; no renderer claim.

원문 발췌 (item.json.sourceQuote, verbatim):
$f'(x)=6x^2-18x+12=6(x-1)(x-2)$이다.
현재 초안 보완: 별도 helper가 preparation-23-maesangirls-math2/alternatives/q21-numberline/에 준비되어 있다. 그 수직선은 증감·값 비교를 돕지만, 이 Q21의 닫힌구간 곡선, 증감표와 y절편 그래프 요구를 대체하지 않는다. 기존 SVG 이력은 그대로 보존한다.

입력 단계 재검사 결과 (2026-11-08; 전체 작업 최종 판정 아님):
실제 `fit_overview`, `specFor`(미사용 placeholder 호출 0), `semantic_model.validate`, engine critical/`viewport.for_spec`: PASS. 실제 존재하는 COORDINATE_LABEL만 exact coordinate로 대조해 PASS; 전체 독립 수학 검수나 숨겨진 점/관계 전체 검증은 아니다.
별도 Q21 helper `preparation-23-maesangirls-math2/alternatives/q21-numberline/`의 `expandNumberLineFigure`: PASS.
전 문항 공통: 렌더, prepare, 학생 시각 검수, 독립 전체 수학 검토, official CREATE PASS는 NOT_RUN이며 전체 상태는 NOT_READY. source/ledger/engine 및 기존 예약 5건은 변경하지 않았다.
원격 패키지 배치 계획(미실행): primary 4파일 예정 위치는 `triage-20261107/inputs/23-maesangirls-math2/root-inputs/q21/`이다. 보조 helper 4파일은 `triage-20261107/inputs/23-maesangirls-math2/root-inputs/q21/helpers/number-line/`에 함께 둘 예정이다. helper는 같은 문항을 돕는 대안으로, 추가 문항이 아니다. 원격 쓰기는 아직 하지 않았다.
