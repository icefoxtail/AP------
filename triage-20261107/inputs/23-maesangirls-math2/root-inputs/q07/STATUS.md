23 매산여고 고2 수학II Q07. LOCAL DRAFT ONLY. SourcePath: archive/exams/original/high/h2/2final/23_매산여고_2학기_기말_고2_수학II.js; frozen sourceBlob: 15c86b5334bf14315dc800df9fea35f82adc236f. Reference production snapshot: main 44ac8c11b19816268bbc59f2abae5a43975964b9, phase2 sha 338e53b8e85c9420b356082adf50e7a49c685a4d, graph_framing sha 44b320d00fda18efcd5dfba31ad56047d0387c4f. 원문·기존 자료를 보존한다. 원문 승인 f(x)=3x³−9x²+4의 극대·극소를 표시하고, c=9 (즉 k=8) 예시로 y=9, y=−9 두 overlay line을 표현한다. 교점이나 근을 근삿값으로 새로 만들지 않는다. 원문 조건은 k>7이다. 기존 별도 metadata HOLD는 그대로 유지하며 이 초안은 해당 HOLD를 해제하거나 대체하지 않는다. `overlays.lines` 경로는 실제 곡선과 y=±9 수평선만 그린다. 이 입력은 교점 좌표나 intersectionCount를 선언하지 않으며 자동 교점/개수 검증 통과를 주장하지 않는다. `piecewise-polynomial.referenceLines`는 각 교점의 exact `intersectionX`가 필요하고, 이 경우의 비유리 3차 교점은 닫힌 형식 제약에 걸린다 (`PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM`).

sourceQuote (원문 해설 그대로): $f'(x)=9x(x-2)$이므로 $f$는 $x=0$에서 극댓값 $4$, $x=2$에서 극솟값 $-8$을 갖는다.

상태: input-only 준비. validator, fit_overview, specFor, 렌더, 독립 수학 PASS, 원격 보존, handoff NOT_RUN.

입력 단계 재검사 결과 (2026-11-08; 전체 작업 최종 판정 아님):
실제 `fit_overview`, `specFor`(미사용 placeholder 호출 0), `semantic_model.validate`, engine critical/`viewport.for_spec`: PASS. 실제 존재하는 COORDINATE_LABEL만 exact coordinate로 대조해 PASS; 전체 독립 수학 검수나 숨겨진 점/관계 전체 검증은 아니다.
전 문항 공통: 렌더, prepare, 학생 시각 검수, 독립 전체 수학 검토, official CREATE PASS는 NOT_RUN이며 전체 상태는 NOT_READY. source/ledger/engine 및 기존 예약 5건은 변경하지 않았다.
