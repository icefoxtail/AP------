# 백발백중_공통수학2_함수와그래프_P42-45_20261025_유사50 — 문항/해설 2축 전수 plan 검수

- 원문: `archive/exams/textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P42-45_20261025_유사50.js` (50문항, 100축)
- 판정 요약: 해설 BENEFICIAL 26, 해설 EXEMPT 24, 문항 ENGINE_CAPABILITY_PENDING 5, 문항 EXEMPT 45.
- 공식 plan-lint shallow/full: 작성된 26개 모두 PASS. 아래 NOT_RUN은 계획서가 없는 축의 실행 대상 없음이다.
- DRAWN_FEATURE_PARITY: 작성 plan의 sourceConditions → 엔진 필드 정적 1:1 연결만 PASS. **실제 SVG/PNG 렌더 결과, 흰 배경 제거 이미지 비교, 학생뷰/A4, 원본 PDF 비교는 NOT_RUN.**
- **공통 엔진 archive bind 차단:** 이 JS의 questionBank id는 전부 33글자이나 생산 렌더러의 SOURCE_QUESTION_ID_PATTERN은 최대 32글자이다. 시도한 문자열 ordinal은 item 입력에서 거절됐고 숫자 ordinal은 ORDINAL_NOT_IN_BANK로 거절됐다. 이 입력 바인딩을 지원하는 엔진 기능이 필요하다. plan-lint PASS를 ARCHIVE_BOUND로 오인하지 않음.
- 원본 SVG 잔존: 기존 해설용 이미지 50개에 흰색 바탕 사각형이 남아 있으며, 이 파일들은 지정된 `production/plans/<stem>` 범위 밖이라 변경하지 않음.
- 문제 원본 자산이 있어도 JS에 `image` 연결이 빠져 있는 5개는 `SOURCE_ASSET_PRESENT_BUT_JS_UNLINKED`; 별도 JS 재연결 작업 필요.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| P42–45 q01 / BV-BAKBAL-H-COM2-HA-P42-Q01-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q01 / BV-BAKBAL-H-COM2-HA-P42-Q01-T1-R1 | 해설 | EXEMPT | 해당 없음: 함수의 뜻과 정의역·공역 원소의 대응 판정의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q02 / BV-BAKBAL-H-COM2-HA-P42-Q01-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q02 / BV-BAKBAL-H-COM2-HA-P42-Q01-S1-R1 | 해설 | BENEFICIAL | set-diagram-figure-v1 | [q02-solution.json](./q02-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q03 / BV-BAKBAL-H-COM2-HA-P42-Q01-S2-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q03 / BV-BAKBAL-H-COM2-HA-P42-Q01-S2-R1 | 해설 | EXEMPT | 해당 없음: 함수의 뜻과 정의역·공역 원소의 대응 판정의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q04 / BV-BAKBAL-H-COM2-HA-P42-Q02-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q04 / BV-BAKBAL-H-COM2-HA-P42-Q02-T1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q04-solution.json](./q04-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q05 / BV-BAKBAL-H-COM2-HA-P42-Q02-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q05 / BV-BAKBAL-H-COM2-HA-P42-Q02-S1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q05-solution.json](./q05-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q06 / BV-BAKBAL-H-COM2-HA-P42-Q02-S2-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q06 / BV-BAKBAL-H-COM2-HA-P42-Q02-S2-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q06-solution.json](./q06-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q07 / BV-BAKBAL-H-COM2-HA-P42-Q03-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q07 / BV-BAKBAL-H-COM2-HA-P42-Q03-T1-R1 | 해설 | BENEFICIAL | set-diagram-figure-v1 | [q07-solution.json](./q07-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q08 / BV-BAKBAL-H-COM2-HA-P42-Q03-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q08 / BV-BAKBAL-H-COM2-HA-P42-Q03-S1-R1 | 해설 | BENEFICIAL | set-diagram-figure-v1 | [q08-solution.json](./q08-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q09 / BV-BAKBAL-H-COM2-HA-P42-Q03-S2-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q09 / BV-BAKBAL-H-COM2-HA-P42-Q03-S2-R1 | 해설 | BENEFICIAL | set-diagram-figure-v1 | [q09-solution.json](./q09-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q10 / BV-BAKBAL-H-COM2-HA-P42-Q04-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q10 / BV-BAKBAL-H-COM2-HA-P42-Q04-T1-R1 | 해설 | EXEMPT | 해당 없음: 점화적 관계식을 만족하는 함수의 함숫값 추론의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q11 / BV-BAKBAL-H-COM2-HA-P42-Q04-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q11 / BV-BAKBAL-H-COM2-HA-P42-Q04-S1-R1 | 해설 | EXEMPT | 해당 없음: 점화적 관계식을 만족하는 함수의 함숫값 추론의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q12 / BV-BAKBAL-H-COM2-HA-P42-Q04-S2-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q12 / BV-BAKBAL-H-COM2-HA-P42-Q04-S2-R1 | 해설 | EXEMPT | 해당 없음: 점화적 관계식을 만족하는 함수의 함숫값 추론의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q13 / BV-BAKBAL-H-COM2-HA-P42-Q05-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q13 / BV-BAKBAL-H-COM2-HA-P42-Q05-T1-R1 | 해설 | EXEMPT | 해당 없음: 정의역이 유한집합일 때 서로 같은 두 함수의 미정계수 결정의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q14 / BV-BAKBAL-H-COM2-HA-P42-Q05-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q14 / BV-BAKBAL-H-COM2-HA-P42-Q05-S1-R1 | 해설 | EXEMPT | 해당 없음: 정의역이 유한집합일 때 서로 같은 두 함수의 미정계수 결정의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q15 / BV-BAKBAL-H-COM2-HA-P42-Q05-S2-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q15 / BV-BAKBAL-H-COM2-HA-P42-Q05-S2-R1 | 해설 | EXEMPT | 해당 없음: 정의역이 유한집합일 때 서로 같은 두 함수의 미정계수 결정의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q16 / BV-BAKBAL-H-COM2-HA-P43-Q06-T1-R1 | 문항 | ENGINE_CAPABILITY_PENDING | 5개 선택지 그래프를 한 plan의 5패널로 분할하고 원·측면 포물선·직선 등 비함수 곡선을 정확히 렌더하는 capability 필요 | — | — | PENDING |
| P42–45 q16 / BV-BAKBAL-H-COM2-HA-P43-Q06-T1-R1 | 해설 | EXEMPT | 해당 없음: 수직선 판정법으로 함수의 그래프가 아닌 것을 판별의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q17 / BV-BAKBAL-H-COM2-HA-P43-Q06-S1-R1 | 문항 | ENGINE_CAPABILITY_PENDING | 5개 선택지 그래프를 한 plan의 5패널로 분할하고 원·측면 포물선·직선 등 비함수 곡선을 정확히 렌더하는 capability 필요 | — | — | PENDING |
| P42–45 q17 / BV-BAKBAL-H-COM2-HA-P43-Q06-S1-R1 | 해설 | EXEMPT | 해당 없음: 좌표평면 상에서 수직선 판정법을 이용한 함수의 그래프 판별의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q18 / BV-BAKBAL-H-COM2-HA-P43-Q06-S2-R1 | 문항 | ENGINE_CAPABILITY_PENDING | 5개 선택지 그래프를 한 plan의 5패널로 분할하고 원·측면 포물선·직선 등 비함수 곡선을 정확히 렌더하는 capability 필요 | — | — | PENDING |
| P42–45 q18 / BV-BAKBAL-H-COM2-HA-P43-Q06-S2-R1 | 해설 | EXEMPT | 해당 없음: 좌표평면 상에서 수직선 판정법을 이용한 함수의 그래프 판별의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q19 / BV-BAKBAL-H-COM2-HA-P43-Q07-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q19 / BV-BAKBAL-H-COM2-HA-P43-Q07-T1-R1 | 해설 | EXEMPT | 해당 없음: 일차식·이차식·절댓값 함수의 일대일대응 보기 판정의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q20 / BV-BAKBAL-H-COM2-HA-P43-Q07-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q20 / BV-BAKBAL-H-COM2-HA-P43-Q07-S1-R1 | 해설 | EXEMPT | 해당 없음: 일차식·이차식·절댓값 함수의 일대일대응 보기 판정의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q21 / BV-BAKBAL-H-COM2-HA-P43-Q07-S2-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q21 / BV-BAKBAL-H-COM2-HA-P43-Q07-S2-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q21-solution.json](./q21-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q22 / BV-BAKBAL-H-COM2-HA-P43-Q08-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q22 / BV-BAKBAL-H-COM2-HA-P43-Q08-T1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q22-solution.json](./q22-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q23 / BV-BAKBAL-H-COM2-HA-P43-Q08-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q23 / BV-BAKBAL-H-COM2-HA-P43-Q08-S1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q23-solution.json](./q23-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q24 / BV-BAKBAL-H-COM2-HA-P43-Q08-S2-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q24 / BV-BAKBAL-H-COM2-HA-P43-Q08-S2-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q24-solution.json](./q24-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q25 / BV-BAKBAL-H-COM2-HA-P43-Q09-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q25 / BV-BAKBAL-H-COM2-HA-P43-Q09-T1-R1 | 해설 | BENEFICIAL | composite-panels-v1 | [q25-solution.json](./q25-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q26 / BV-BAKBAL-H-COM2-HA-P43-Q09-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q26 / BV-BAKBAL-H-COM2-HA-P43-Q09-S1-R1 | 해설 | BENEFICIAL | composite-panels-v1 | [q26-solution.json](./q26-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q27 / BV-BAKBAL-H-COM2-HA-P43-Q09-S2-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q27 / BV-BAKBAL-H-COM2-HA-P43-Q09-S2-R1 | 해설 | BENEFICIAL | composite-panels-v1 | [q27-solution.json](./q27-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q28 / BV-BAKBAL-H-COM2-HA-P43-Q10-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q28 / BV-BAKBAL-H-COM2-HA-P43-Q10-T1-R1 | 해설 | EXEMPT | 해당 없음: 특정 원소 대응 조건과 일대일함수 조건을 만족하는 함수의 개수의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q29 / BV-BAKBAL-H-COM2-HA-P43-Q10-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q29 / BV-BAKBAL-H-COM2-HA-P43-Q10-S1-R1 | 해설 | EXEMPT | 해당 없음: 특정 원소 대응 조건과 일대일함수 조건을 만족하는 함수의 개수의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q30 / BV-BAKBAL-H-COM2-HA-P43-Q10-S2-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q30 / BV-BAKBAL-H-COM2-HA-P43-Q10-S2-R1 | 해설 | EXEMPT | 해당 없음: 특정 원소 대응 조건과 일대일함수 조건을 만족하는 함수의 개수의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q31 / BV-BAKBAL-H-COM2-HA-P44-Q11-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q31 / BV-BAKBAL-H-COM2-HA-P44-Q11-T1-R1 | 해설 | EXEMPT | 해당 없음: 유리수·무리수 조건 분기 함수의 합성함수 함숫값 계산의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q32 / BV-BAKBAL-H-COM2-HA-P44-Q11-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q32 / BV-BAKBAL-H-COM2-HA-P44-Q11-S1-R1 | 해설 | EXEMPT | 해당 없음: 유리수·무리수 조건 분기 함수의 합성함수 함숫값 계산의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q33 / BV-BAKBAL-H-COM2-HA-P44-Q12-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q33 / BV-BAKBAL-H-COM2-HA-P44-Q12-T1-R1 | 해설 | BENEFICIAL | composite-panels-v1 | [q33-solution.json](./q33-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q34 / BV-BAKBAL-H-COM2-HA-P44-Q12-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q34 / BV-BAKBAL-H-COM2-HA-P44-Q12-S1-R1 | 해설 | BENEFICIAL | composite-panels-v1 | [q34-solution.json](./q34-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q35 / BV-BAKBAL-H-COM2-HA-P44-Q13-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q35 / BV-BAKBAL-H-COM2-HA-P44-Q13-T1-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q35-solution.json](./q35-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q36 / BV-BAKBAL-H-COM2-HA-P44-Q13-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q36 / BV-BAKBAL-H-COM2-HA-P44-Q13-S1-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q36-solution.json](./q36-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q37 / BV-BAKBAL-H-COM2-HA-P44-Q14-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q37 / BV-BAKBAL-H-COM2-HA-P44-Q14-T1-R1 | 해설 | EXEMPT | 해당 없음: 합성함수 관계식 f∘h = g 를 만족하는 미지의 함수 h의 합성 함숫값의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q38 / BV-BAKBAL-H-COM2-HA-P44-Q14-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q38 / BV-BAKBAL-H-COM2-HA-P44-Q14-S1-R1 | 해설 | EXEMPT | 해당 없음: 합성함수 관계식 f∘h = g 를 만족하는 미지의 함수 h의 합성 함숫값의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q39 / BV-BAKBAL-H-COM2-HA-P44-Q15-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q39 / BV-BAKBAL-H-COM2-HA-P44-Q15-T1-R1 | 해설 | EXEMPT | 해당 없음: 합성함수의 결합법칙을 이용한 미지수 a의 값 계산의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q40 / BV-BAKBAL-H-COM2-HA-P44-Q15-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q40 / BV-BAKBAL-H-COM2-HA-P44-Q15-S1-R1 | 해설 | EXEMPT | 해당 없음: 합성함수의 결합법칙을 이용한 미지수 a의 값 계산의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q41 / BV-BAKBAL-H-COM2-HA-P45-Q16-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q41 / BV-BAKBAL-H-COM2-HA-P45-Q16-T1-R1 | 해설 | BENEFICIAL | set-diagram-figure-v1 | [q41-solution.json](./q41-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q42 / BV-BAKBAL-H-COM2-HA-P45-Q16-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q42 / BV-BAKBAL-H-COM2-HA-P45-Q16-S1-R1 | 해설 | BENEFICIAL | set-diagram-figure-v1 | [q42-solution.json](./q42-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q43 / BV-BAKBAL-H-COM2-HA-P45-Q17-T1-R1 | 문항 | ENGINE_CAPABILITY_PENDING | 곡선 f 및 y=x를 동시에 표시하고 a,b,c,d,e 기호 축 눈금, 수직·수평 점선 가이드를 정밀 재현하는 capability 필요 | — | — | PENDING |
| P42–45 q43 / BV-BAKBAL-H-COM2-HA-P45-Q17-T1-R1 | 해설 | BENEFICIAL | set-diagram-figure-v1 | [q43-solution.json](./q43-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q44 / BV-BAKBAL-H-COM2-HA-P45-Q17-S1-R1 | 문항 | ENGINE_CAPABILITY_PENDING | 곡선 f 및 y=x를 동시에 표시하고 a,b,c,d,e 기호 축 눈금, 수직·수평 점선 가이드를 정밀 재현하는 capability 필요 | — | — | PENDING |
| P42–45 q44 / BV-BAKBAL-H-COM2-HA-P45-Q17-S1-R1 | 해설 | BENEFICIAL | set-diagram-figure-v1 | [q44-solution.json](./q44-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q45 / BV-BAKBAL-H-COM2-HA-P45-Q18-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q45 / BV-BAKBAL-H-COM2-HA-P45-Q18-T1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q45-solution.json](./q45-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q46 / BV-BAKBAL-H-COM2-HA-P45-Q18-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q46 / BV-BAKBAL-H-COM2-HA-P45-Q18-S1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q46-solution.json](./q46-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q47 / BV-BAKBAL-H-COM2-HA-P45-Q19-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q47 / BV-BAKBAL-H-COM2-HA-P45-Q19-T1-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q47-solution.json](./q47-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q48 / BV-BAKBAL-H-COM2-HA-P45-Q19-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q48 / BV-BAKBAL-H-COM2-HA-P45-Q19-S1-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q48-solution.json](./q48-solution.json) | PASS/PASS | STATIC_FIELD_1_TO_1_PASS / RENDER_NOT_RUN |
| P42–45 q49 / BV-BAKBAL-H-COM2-HA-P45-Q20-T1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q49 / BV-BAKBAL-H-COM2-HA-P45-Q20-T1-R1 | 해설 | EXEMPT | 해당 없음: 일차함수의 역함수 구하기와 미정계수 결정의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |
| P42–45 q50 / BV-BAKBAL-H-COM2-HA-P45-Q20-S1-R1 | 문항 | EXEMPT | 해당 없음: 원문 발문은 독립 시각 도형이 아닌 함수식·집합·조건·선지 텍스트로 완결 | — | — | EXEMPT |
| P42–45 q50 / BV-BAKBAL-H-COM2-HA-P45-Q20-S1-R1 | 해설 | EXEMPT | 해당 없음: 일차함수의 역함수 구하기와 미정계수 결정의 대수적 조건 판정·함숫값 계산·식 변형은 해설 본문만으로 완결되며 독립 그리기 필수 정보 없음 | — | — | EXEMPT |

## 필수 엔진 기능 및 잔존 리스크

- q16 / BV-BAKBAL-H-COM2-HA-P43-Q06-T1-R1: 5개 선택지 그래프를 한 plan의 5패널로 분할하고 원·측면 포물선·직선 등 비함수 곡선을 정확히 렌더하는 capability 필요. 원본 문제 SVG는 존재하지만 JS image 참조 누락.
- q17 / BV-BAKBAL-H-COM2-HA-P43-Q06-S1-R1: 5개 선택지 그래프를 한 plan의 5패널로 분할하고 원·측면 포물선·직선 등 비함수 곡선을 정확히 렌더하는 capability 필요. 원본 문제 SVG는 존재하지만 JS image 참조 누락.
- q18 / BV-BAKBAL-H-COM2-HA-P43-Q06-S2-R1: 5개 선택지 그래프를 한 plan의 5패널로 분할하고 원·측면 포물선·직선 등 비함수 곡선을 정확히 렌더하는 capability 필요. 원본 문제 SVG는 존재하지만 JS image 참조 누락.
- q43 / BV-BAKBAL-H-COM2-HA-P45-Q17-T1-R1: 곡선 f 및 y=x를 동시에 표시하고 a,b,c,d,e 기호 축 눈금, 수직·수평 점선 가이드를 정밀 재현하는 capability 필요. 원본 문제 SVG는 존재하지만 JS image 참조 누락.
- q44 / BV-BAKBAL-H-COM2-HA-P45-Q17-S1-R1: 곡선 f 및 y=x를 동시에 표시하고 a,b,c,d,e 기호 축 눈금, 수직·수평 점선 가이드를 정밀 재현하는 capability 필요. 원본 문제 SVG는 존재하지만 JS image 참조 누락.

추가 정적 근거(원문 발문·해설 전문, SHA256, SVG 출처, 각 plan sourceConditions 필드 경로, 흰색 SVG 바탕 패턴)는 같은 폴더의 [visual-audit-q01-q50.json](./visual-audit-q01-q50.json) 참고.
