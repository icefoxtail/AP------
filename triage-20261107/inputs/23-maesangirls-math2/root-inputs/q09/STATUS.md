23 매산여고 고2 수학II Q09. LOCAL DRAFT ONLY. SourcePath: archive/exams/original/high/h2/2final/23_매산여고_2학기_기말_고2_수학II.js; frozen sourceBlob: 15c86b5334bf14315dc800df9fea35f82adc236f. Reference production snapshot: main 44ac8c11b19816268bbc59f2abae5a43975964b9, phase2 sha 338e53b8e85c9420b356082adf50e7a49c685a4d, graph_framing sha 44b320d00fda18efcd5dfba31ad56047d0387c4f.

원문·기존 자료를 보존한다. 위치식의 도함수 v(t)=3t²−10t+8, t≥0의 첫 부호 변화 t=4/3, 다른 영점 t=2, 꼭짓점 (5/3,−1/3), 그때 가속도 −2를 반영한다. graphPlan은 실제 반직선 도메인 [0,null]의 닫힌 시작점을 piecewise-discontinuous 한 조각으로 표현하고 axisVariable=t, functionName=v를 사용한다. xWindow [0,4]는 프레이밍에 쓰는 표시창 보조 범위이며 실제 정의역의 끝이 아니다.

sourceQuote (원문 해설 그대로): $t\ge0$에서 속도의 부호가 처음 바뀌는 시각은 $t=\dfrac43$이다.

상태: input-only 준비. validator, fit_overview, specFor, 렌더, 독립 수학 PASS, 원격 보존, handoff NOT_RUN.

최소 입력 교정 이력: 검사 담당의 실제 engine tick guard 대조에서 viewport y=[−0.9285714285714293, 8.595238095238097]에 대해 y tick −1이 AXIS_TICK_VALUE_OUT_OF_VIEW:y로 확인되어, graphPlan.axisTickValues.y에서 −1만 제거하고 [4]로 조정했다. 이는 정적 입력 대조에 따른 교정이며 prepare/render 실패가 아니다. 나머지 수학·정의역·좌표·축 설정은 유지했다. 렌더는 실행하지 않았다.

입력 단계 재검사 결과 (2026-11-08; 전체 작업 최종 판정 아님):
실제 `fit_overview`, `specFor`(미사용 placeholder 호출 0), `semantic_model.validate`, engine critical/`viewport.for_spec`: PASS. Tickguard 정적 대조 10건은 PASS, Q09는 기존 y=-1이 실제 bounds [-0.9285714285714293, 8.595238095238097] 밖이라 실패했다. 작성담당이 y tick을 [4]로 수정했다. 최신 plan SHA-256은 1ae11019ba9078499cf73e07465dcff95c6a543cd9645b61b2885bd82bc43992이며, 수정본 tickguard 재검사는 PENDING.
전 문항 공통: 렌더, prepare, 학생 시각 검수, 독립 전체 수학 검토, official CREATE PASS는 NOT_RUN이며 전체 상태는 NOT_READY. source/ledger/engine 및 기존 예약 5건은 변경하지 않았다.

최종 입력 재검사: 수정본 tickguard PASS. fit→spec→semantic→존재하는 COORDINATE_LABEL exact_coordinate→critical/viewport→tickguard 정적 대조 PASS (preparation-23-maesangirls-math2/input-check-results.json SHA256 a25dd35bb638587614826d43c1163f76759a8f079723542e6ade85069390c786). 렌더/prepare/독립수학/학생시각검수/official CREATE NOT_RUN, NOT_READY.
