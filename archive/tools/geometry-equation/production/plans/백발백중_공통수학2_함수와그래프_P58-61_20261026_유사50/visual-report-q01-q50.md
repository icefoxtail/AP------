# 백발백중_공통수학2_함수와그래프_P58-61_20261026_유사50: 문항·해설 2축 검수 (100축)

- 시험지: `archive/exams/textbooks/백발백중_공통수학2/백발백중_공통수학2_함수와그래프_P58-61_20261026_유사50.js`; 모든 50문항 원문 발문/선택지와 해설을 별개 축으로 점검.
- 판정: 플랜 `41`축, 기능 대기 `0`축, 시각 독립도형 불필요 EXEMPT `59`축.
- 플랜: 모두 production JSON; 수동 SVG 없음. 공식 plan-lint shallow/full **각각 전부 PASS**.
- **DRAWN_FEATURE_PARITY:** sourceConditions의 41개 플랜에 대해 **필드 경로 정적 1:1 PASS**. 렌더 SVG의 점/획·점선·텍스트·실제 흰 배경 여부, 원본 PDF 이미지·학생뷰/A4 크기 비교는 **NOT_RUN**. 실제 1:1 시각 동등성 PASS로 주장하지 않음.
- **엔진 통합 제약:** source QID 길이 33~37 vs production 원문 인덱스 정규식 최대 32로 직접 아카이브 입력 바인딩 불가. 렌더 경로의 ID 길이 지원 필요.
- 원본 문제 SVG 8개는 JS `image` 연결 누락. 플랜이 유효해도 학생 원문 화면의 연결은 자동으로 바뀌지 않음.
- 기존 JS의 해설 이미지 연결 누락 50개(P58–61은 50개 전부). JSON 생성·lint 통과가 이미지를 학생뷰에 연결했다는 뜻은 아님.
- 기존 해설 SVG 중 흰색 배경 사각형이 검출된 파일 0개. 플랜에서는 임의의 면/배경 채움 없음(실제 넓이를 묻는 P50 q29–31은 영역 3줄만 예외). 원본 SVG는 수정 범위 밖이므로 기존 파일은 그대로임.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| P58 q01 / BV-BAKBAL-H-COM2-HA-P58-Q05-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q01 / BV-BAKBAL-H-COM2-HA-P58-Q05-T1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q01-solution.json](./q01-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q02 / BV-BAKBAL-H-COM2-HA-P58-Q05-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q02 / BV-BAKBAL-H-COM2-HA-P58-Q05-S1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q02-solution.json](./q02-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q03 / BV-BAKBAL-H-COM2-HA-P58-Q05-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q03 / BV-BAKBAL-H-COM2-HA-P58-Q05-S2-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q03-solution.json](./q03-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q04 / BV-BAKBAL-H-COM2-HA-P58-Q05-S3-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q04 / BV-BAKBAL-H-COM2-HA-P58-Q05-S3-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q04-solution.json](./q04-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q05 / BV-BAKBAL-H-COM2-HA-P58-Q06-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q05 / BV-BAKBAL-H-COM2-HA-P58-Q06-T1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q05-solution.json](./q05-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q06 / BV-BAKBAL-H-COM2-HA-P58-Q06-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q06 / BV-BAKBAL-H-COM2-HA-P58-Q06-S1-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q06-solution.json](./q06-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q07 / BV-BAKBAL-H-COM2-HA-P58-Q06-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q07 / BV-BAKBAL-H-COM2-HA-P58-Q06-S2-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q07-solution.json](./q07-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q08 / BV-BAKBAL-H-COM2-HA-P58-Q06-S3-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q08 / BV-BAKBAL-H-COM2-HA-P58-Q06-S3-R1 | 해설 | BENEFICIAL | piecewise-discontinuous-spike-v1 | [q08-solution.json](./q08-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q09 / BV-BAKBAL-H-COM2-HA-P59-Q07-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q09 / BV-BAKBAL-H-COM2-HA-P59-Q07-T1-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q09-solution.json](./q09-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q10 / BV-BAKBAL-H-COM2-HA-P59-Q07-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q10 / BV-BAKBAL-H-COM2-HA-P59-Q07-S1-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q10-solution.json](./q10-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q11 / BV-BAKBAL-H-COM2-HA-P59-Q07-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q11 / BV-BAKBAL-H-COM2-HA-P59-Q07-S2-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q11-solution.json](./q11-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q12 / BV-BAKBAL-H-COM2-HA-P59-Q07-S3-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q12 / BV-BAKBAL-H-COM2-HA-P59-Q07-S3-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q12-solution.json](./q12-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q13 / BV-BAKBAL-H-COM2-HA-P59-Q08-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q13 / BV-BAKBAL-H-COM2-HA-P59-Q08-T1-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q13-solution.json](./q13-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q14 / BV-BAKBAL-H-COM2-HA-P59-Q08-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q14 / BV-BAKBAL-H-COM2-HA-P59-Q08-S1-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q14-solution.json](./q14-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q15 / BV-BAKBAL-H-COM2-HA-P59-Q08-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q15 / BV-BAKBAL-H-COM2-HA-P59-Q08-S2-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q15-solution.json](./q15-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q16 / BV-BAKBAL-H-COM2-HA-P59-Q08-S3-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q16 / BV-BAKBAL-H-COM2-HA-P59-Q08-S3-R1 | 해설 | BENEFICIAL | multi-curve-figure-v1 | [q16-solution.json](./q16-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q17 / BV-BAKBAL-H-COM2-HA-P60-Q01-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q17 / BV-BAKBAL-H-COM2-HA-P60-Q01-T1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q18 / BV-BAKBAL-H-COM2-HA-P60-Q01-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q18 / BV-BAKBAL-H-COM2-HA-P60-Q01-S1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q19 / BV-BAKBAL-H-COM2-HA-P60-Q01-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q19 / BV-BAKBAL-H-COM2-HA-P60-Q01-S2-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q20 / BV-BAKBAL-H-COM2-HA-P60-Q01-S3-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q20 / BV-BAKBAL-H-COM2-HA-P60-Q01-S3-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q21 / BV-BAKBAL-H-COM2-HA-P60-Q02-T1-R1 | 문항 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q21-problem.json](./q21-problem.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q21 / BV-BAKBAL-H-COM2-HA-P60-Q02-T1-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q21-solution.json](./q21-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q22 / BV-BAKBAL-H-COM2-HA-P60-Q02-S1-R1 | 문항 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q22-problem.json](./q22-problem.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q22 / BV-BAKBAL-H-COM2-HA-P60-Q02-S1-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q22-solution.json](./q22-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q23 / BV-BAKBAL-H-COM2-HA-P60-Q02-S2-R1 | 문항 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q23-problem.json](./q23-problem.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q23 / BV-BAKBAL-H-COM2-HA-P60-Q02-S2-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q23-solution.json](./q23-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q24 / BV-BAKBAL-H-COM2-HA-P60-Q02-S3-R1 | 문항 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q24-problem.json](./q24-problem.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q24 / BV-BAKBAL-H-COM2-HA-P60-Q02-S3-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q24-solution.json](./q24-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q25 / BV-BAKBAL-H-COM2-HA-P60-Q03-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q25 / BV-BAKBAL-H-COM2-HA-P60-Q03-T1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q26 / BV-BAKBAL-H-COM2-HA-P60-Q03-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q26 / BV-BAKBAL-H-COM2-HA-P60-Q03-S1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q27 / BV-BAKBAL-H-COM2-HA-P60-Q03-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q27 / BV-BAKBAL-H-COM2-HA-P60-Q03-S2-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q28 / BV-BAKBAL-H-COM2-HA-P60-Q03-S3-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q28 / BV-BAKBAL-H-COM2-HA-P60-Q03-S3-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q29 / BV-BAKBAL-H-COM2-HA-P60-Q04-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q29 / BV-BAKBAL-H-COM2-HA-P60-Q04-T1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q30 / BV-BAKBAL-H-COM2-HA-P60-Q04-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q30 / BV-BAKBAL-H-COM2-HA-P60-Q04-S1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q31 / BV-BAKBAL-H-COM2-HA-P60-Q04-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q31 / BV-BAKBAL-H-COM2-HA-P60-Q04-S2-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q32 / BV-BAKBAL-H-COM2-HA-P60-Q05-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q32 / BV-BAKBAL-H-COM2-HA-P60-Q05-T1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q33 / BV-BAKBAL-H-COM2-HA-P60-Q05-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q33 / BV-BAKBAL-H-COM2-HA-P60-Q05-S1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q34 / BV-BAKBAL-H-COM2-HA-P60-Q05-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q34 / BV-BAKBAL-H-COM2-HA-P60-Q05-S2-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q35 / BV-BAKBAL-H-COM2-HA-P61-Q06-T1-R1 | 문항 | BENEFICIAL | composite-panels-v1 | [q35-problem.json](./q35-problem.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q35 / BV-BAKBAL-H-COM2-HA-P61-Q06-T1-R1 | 해설 | BENEFICIAL | composite-panels-v1 | [q35-solution.json](./q35-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q36 / BV-BAKBAL-H-COM2-HA-P61-Q06-S1-R1 | 문항 | BENEFICIAL | composite-panels-v1 | [q36-problem.json](./q36-problem.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q36 / BV-BAKBAL-H-COM2-HA-P61-Q06-S1-R1 | 해설 | BENEFICIAL | composite-panels-v1 | [q36-solution.json](./q36-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q37 / BV-BAKBAL-H-COM2-HA-P61-Q06-S2-R1 | 문항 | BENEFICIAL | composite-panels-v1 | [q37-problem.json](./q37-problem.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q37 / BV-BAKBAL-H-COM2-HA-P61-Q06-S2-R1 | 해설 | BENEFICIAL | composite-panels-v1 | [q37-solution.json](./q37-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q38 / BV-BAKBAL-H-COM2-HA-P61-Q06-S3-R1 | 문항 | BENEFICIAL | composite-panels-v1 | [q38-problem.json](./q38-problem.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q38 / BV-BAKBAL-H-COM2-HA-P61-Q06-S3-R1 | 해설 | BENEFICIAL | composite-panels-v1 | [q38-solution.json](./q38-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q39 / BV-BAKBAL-H-COM2-HA-P61-Q07-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q39 / BV-BAKBAL-H-COM2-HA-P61-Q07-T1-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q39-solution.json](./q39-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q40 / BV-BAKBAL-H-COM2-HA-P61-Q07-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q40 / BV-BAKBAL-H-COM2-HA-P61-Q07-S1-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q40-solution.json](./q40-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q41 / BV-BAKBAL-H-COM2-HA-P61-Q07-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q41 / BV-BAKBAL-H-COM2-HA-P61-Q07-S2-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q41-solution.json](./q41-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q42 / BV-BAKBAL-H-COM2-HA-P61-Q08-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q42 / BV-BAKBAL-H-COM2-HA-P61-Q08-T1-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q42-solution.json](./q42-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q43 / BV-BAKBAL-H-COM2-HA-P61-Q08-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q43 / BV-BAKBAL-H-COM2-HA-P61-Q08-S1-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q43-solution.json](./q43-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q44 / BV-BAKBAL-H-COM2-HA-P61-Q08-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q44 / BV-BAKBAL-H-COM2-HA-P61-Q08-S2-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q44-solution.json](./q44-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q45 / BV-BAKBAL-H-COM2-HA-P61-Q09-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q45 / BV-BAKBAL-H-COM2-HA-P61-Q09-T1-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q45-solution.json](./q45-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q46 / BV-BAKBAL-H-COM2-HA-P61-Q09-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q46 / BV-BAKBAL-H-COM2-HA-P61-Q09-S1-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q46-solution.json](./q46-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q47 / BV-BAKBAL-H-COM2-HA-P61-Q09-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q47 / BV-BAKBAL-H-COM2-HA-P61-Q09-S2-R1 | 해설 | BENEFICIAL | piecewise-polynomial-spike-v1 | [q47-solution.json](./q47-solution.json) | PASS/PASS | STATIC_FIELDS_1_TO_1_PASS / RENDER_NOT_RUN |
| P58 q48 / BV-BAKBAL-H-COM2-HA-P61-Q10-T1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q48 / BV-BAKBAL-H-COM2-HA-P61-Q10-T1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q49 / BV-BAKBAL-H-COM2-HA-P61-Q10-S1-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q49 / BV-BAKBAL-H-COM2-HA-P61-Q10-S1-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q50 / BV-BAKBAL-H-COM2-HA-P61-Q10-S2-R1 | 문항 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |
| P58 q50 / BV-BAKBAL-H-COM2-HA-P61-Q10-S2-R1 | 해설 | EXEMPT | 독립 도형 없음: 발문·선택지·풀이의 문자식·대수 연산으로 완결 | — | — | EXEMPT |

## 남은 기능 및 실제 화면 이슈


- JS image 연결이 없는 원본 문제 SVG: 8개 (JS 수정 승인 범위 밖).
- 본 표의 플랜 기능 검증과 시각 렌더 동등성은 서로 다른 검사이다. 후자는 구현/아카이브 바인딩 보완 후 재검증해야 한다.

추적 증거: [visual-audit-q01-q50.json](./visual-audit-q01-q50.json)에는 문항별 원문·해설·원래 SVG 경로·plan SHA256·조건→필드 연결·기존 흰색 사각형 검출 수를 포함한다.
