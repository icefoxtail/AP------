# 고1 유사 잔여 9종 SVG JSON 계획 작성 완료 — 엔진 미실행

- 날짜: 2026-11-22 (KST). 이 문서는 2026-11-22 최초 5건 플랜 인계 후속이며 [첫 5건 목록](./H1_REMAINING9_20261122_PLAN_JSON_DRAFTS/manifest.json)과 [이번 100건 분류 매니페스트](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/manifest.json)를 함께 읽는다.
- 원본 동번호에 대응하는 100개 역할 차이를 문항 내용 기준으로 **59건 신규 렌더용 플랜, 2건 기존 플랜, 39건 EXEMPT**로 판정하여 **100/100건 JSON 처리**했다. 이전에 따로 발견한 시각 오류·임시 표시 보강 3건까지 포함하면 실제 엔진 입력은 **64개**(기존 5 + 신규 59), 그림 불필요 판정 JSON은 **39개**다.
- 저장 방식: 렌더 대상은 각 폴더에 item.json, plan.json, publish.json 세 파일을 실제로 작성. EXEMPT는 해당 문항의 item.json과 가이드 지정 형태 { "status": "EXEMPT", "reason": "..." }의 plan.json만 작성했다. 발행할 SVG가 없으므로 EXEMPT용 publish.json은 두지 않는다.
- 유의: 원본과 유사시험지의 문항 번호가 같더라도 수학 조건까지 같다는 뜻은 아니다. 원본 그림을 복제한 것이 아니라 유사시험지의 해설 수치·조건에 맞춰 새 플랜을 작성했다.
- **plan-lint 결과:** 103개 중 공식 EXEMPT 39개와 number-line 4개는 정적 검사 OK. 나머지 60개는 실행 환경에 visual_engine Python 모듈이 없어 ModuleNotFoundError로 진행 불가. 즉 **엔진 승인 PASS가 아니다.** 출처·숫자·JSON 구조는 별도 점검했지만 정식 capability lint, render, observer, 육안 QA, publish는 별도 엔진 코덱스에서 해야 한다.

## 학교별 계획 분류

| 시험지 | 신규 플랜 | 기존 플랜 | EXEMPT |
|---|---:|---:|---:|
| 25_금당고_1학기_기말_고1_심화.js | 2 | 1 | 1 |
| 25_금당고_1학기_기말_고1_확인.js | 4 | 1 | 0 |
| 25_금당고_2학기_중간_고1_유사.js | 0 | 0 | 0 |
| 25_금당고_2학기_중간_고1_유사2.js | 3 | 0 | 5 |
| 25_매산고_2학기_중간_고1_유사.js | 13 | 0 | 2 |
| 25_순천고_2학기_중간_고1_유사.js | 10 | 0 | 6 |
| 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 10 | 0 | 6 |
| 25_제일고_2학기_중간_고1_유사문제.js | 6 | 0 | 8 |
| 25_효천고_2학기_중간_고1_유사문제.js | 11 | 0 | 11 |

## 렌더할 신규 플랜 59건

| ID | 시험지 | 문항 | 역할 | 엔진 capability | JSON |
|---|---|---:|---|---|---|
| RS-01 | 25_금당고_1학기_기말_고1_확인.js | 9 | solution | number-line-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-01_E2_q09_solution/plan.json) |
| RS-02 | 25_금당고_1학기_기말_고1_확인.js | 13 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-02_E2_q13_solution/plan.json) |
| RS-03 | 25_금당고_2학기_중간_고1_유사2.js | 7 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-03_E4_q07_solution/plan.json) |
| RS-04 | 25_금당고_2학기_중간_고1_유사2.js | 13 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-04_E4_q13_solution/plan.json) |
| RS-05 | 25_금당고_2학기_중간_고1_유사2.js | 14 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-05_E4_q14_solution/plan.json) |
| RS-06 | 25_매산고_2학기_중간_고1_유사.js | 2 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-06_E5_q02_solution/plan.json) |
| RS-07 | 25_매산고_2학기_중간_고1_유사.js | 4 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-07_E5_q04_solution/plan.json) |
| RS-08 | 25_매산고_2학기_중간_고1_유사.js | 7 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-08_E5_q07_solution/plan.json) |
| RS-09 | 25_매산고_2학기_중간_고1_유사.js | 12 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-09_E5_q12_solution/plan.json) |
| RS-10 | 25_매산고_2학기_중간_고1_유사.js | 13 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-10_E5_q13_solution/plan.json) |
| RS-11 | 25_매산고_2학기_중간_고1_유사.js | 14 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-11_E5_q14_solution/plan.json) |
| RS-12 | 25_매산고_2학기_중간_고1_유사.js | 20 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-12_E5_q20_solution/plan.json) |
| RS-13 | 25_순천고_2학기_중간_고1_유사.js | 16 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-13_E6_q16_solution/plan.json) |
| RS-14 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 3 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-14_E7_q03_solution/plan.json) |
| RS-15 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 6 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-15_E7_q06_solution/plan.json) |
| RS-16 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 8 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-16_E7_q08_solution/plan.json) |
| RS-17 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 12 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-17_E7_q12_solution/plan.json) |
| RS-18 | 25_제일고_2학기_중간_고1_유사문제.js | 10 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-18_E8_q10_solution/plan.json) |
| RS-19 | 25_제일고_2학기_중간_고1_유사문제.js | 15 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-19_E8_q15_solution/plan.json) |
| RS-20 | 25_제일고_2학기_중간_고1_유사문제.js | 17 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-20_E8_q17_solution/plan.json) |
| RS-21 | 25_제일고_2학기_중간_고1_유사문제.js | 22 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-21_E8_q22_solution/plan.json) |
| RS-22 | 25_효천고_2학기_중간_고1_유사문제.js | 1 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-22_E9_q01_solution/plan.json) |
| RS-23 | 25_효천고_2학기_중간_고1_유사문제.js | 14 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-23_E9_q14_solution/plan.json) |
| RS-24 | 25_효천고_2학기_중간_고1_유사문제.js | 18 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-24_E9_q18_solution/plan.json) |
| RS-25 | 25_효천고_2학기_중간_고1_유사문제.js | 21 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-25_E9_q21_solution/plan.json) |
| RS-26 | 25_매산고_2학기_중간_고1_유사.js | 6 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-26_E5_q06_solution/plan.json) |
| RS-27 | 25_매산고_2학기_중간_고1_유사.js | 8 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-27_E5_q08_solution/plan.json) |
| RS-28 | 25_매산고_2학기_중간_고1_유사.js | 9 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-28_E5_q09_solution/plan.json) |
| RS-29 | 25_매산고_2학기_중간_고1_유사.js | 10 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-29_E5_q10_solution/plan.json) |
| RS-30 | 25_매산고_2학기_중간_고1_유사.js | 15 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-30_E5_q15_solution/plan.json) |
| RS-31 | 25_매산고_2학기_중간_고1_유사.js | 18 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-31_E5_q18_solution/plan.json) |
| RS-32 | 25_순천고_2학기_중간_고1_유사.js | 6 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-32_E6_q06_solution/plan.json) |
| RS-33 | 25_순천고_2학기_중간_고1_유사.js | 7 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-33_E6_q07_solution/plan.json) |
| RS-34 | 25_순천고_2학기_중간_고1_유사.js | 8 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-34_E6_q08_solution/plan.json) |
| RS-35 | 25_순천고_2학기_중간_고1_유사.js | 9 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-35_E6_q09_solution/plan.json) |
| RS-36 | 25_순천고_2학기_중간_고1_유사.js | 10 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-36_E6_q10_solution/plan.json) |
| RS-37 | 25_순천고_2학기_중간_고1_유사.js | 15 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-37_E6_q15_solution/plan.json) |
| RS-38 | 25_순천고_2학기_중간_고1_유사.js | 17 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-38_E6_q17_solution/plan.json) |
| RS-39 | 25_순천고_2학기_중간_고1_유사.js | 21 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-39_E6_q21_solution/plan.json) |
| RS-40 | 25_순천고_2학기_중간_고1_유사.js | 22 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-40_E6_q22_solution/plan.json) |
| RS-41 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 7 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-41_E7_q07_solution/plan.json) |
| RS-42 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 14 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-42_E7_q14_solution/plan.json) |
| RS-43 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 15 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-43_E7_q15_solution/plan.json) |
| RS-44 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 18 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-44_E7_q18_solution/plan.json) |
| RS-45 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 19 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-45_E7_q19_solution/plan.json) |
| RS-46 | 25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js | 21 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-46_E7_q21_solution/plan.json) |
| RS-47 | 25_제일고_2학기_중간_고1_유사문제.js | 16 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-47_E8_q16_solution/plan.json) |
| RS-48 | 25_제일고_2학기_중간_고1_유사문제.js | 18 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-48_E8_q18_solution/plan.json) |
| RS-49 | 25_효천고_2학기_중간_고1_유사문제.js | 4 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-49_E9_q04_solution/plan.json) |
| RS-50 | 25_효천고_2학기_중간_고1_유사문제.js | 11 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-50_E9_q11_solution/plan.json) |
| RS-51 | 25_효천고_2학기_중간_고1_유사문제.js | 12 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-51_E9_q12_solution/plan.json) |
| RS-52 | 25_효천고_2학기_중간_고1_유사문제.js | 17 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-52_E9_q17_solution/plan.json) |
| RS-53 | 25_효천고_2학기_중간_고1_유사문제.js | 19 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-53_E9_q19_solution/plan.json) |
| RS-54 | 25_효천고_2학기_중간_고1_유사문제.js | 23 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-54_E9_q23_solution/plan.json) |
| RS-55 | 25_효천고_2학기_중간_고1_유사문제.js | 22 | solution | construction-spike-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-55_E9_q22_solution/plan.json) |
| RS-56 | 25_금당고_1학기_기말_고1_심화.js | 4 | solution | number-line-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-56_E1_q04_solution/plan.json) |
| RS-57 | 25_금당고_1학기_기말_고1_심화.js | 11 | solution | multi-curve-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-57_E1_q11_solution/plan.json) |
| RS-58 | 25_금당고_1학기_기말_고1_확인.js | 11 | solution | number-line-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-58_E2_q11_solution/plan.json) |
| RS-59 | 25_금당고_1학기_기말_고1_확인.js | 20 | solution | number-line-figure-v1 | [plan.json](./H1_REMAINING9_20261122_ROLE_TRIAGE_JSON/RS-59_E2_q20_solution/plan.json) |

## 코덱스 엔진 작업자가 이어갈 절차

1. 원격 브랜치 work/solution-upgrade-h1-similar-1mid-20261122 최신 커밋을 받고 위 신규 59개와 기존 5개의 item.json·plan.json·publish.json을 읽는다. EXEMPT 39개는 publish하지 않는다.
2. archive/tools/geometry-equation/production/AUTHOR_GUIDE.md와 docs/agents/visual-svg.md를 읽고, 복구된 공식 visual_engine 환경에서 node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan.json>으로 오류를 먼저 바로잡는다. 평면도형의 좌표가 풀이로 얻어진 경우 SOURCE_POINT에서 해당 공식 파생 연산으로 바꾸는 것도 이 단계의 수학 감사 대상이다.
3. 공식 SVG 엔진 render.mjs로 출력하고 독립 observer, 이미지 래스터/원본-수학 조건 시각 대조, 정답 비노출(문제 P)·해설 정보(해설 S) 검증을 마친 후 publish. 손으로 SVG 수리 금지.
4. 수정된 해설 SVG와 발행 경로가 JS에 연결된 것을 확인하고 문항별 린트·스크린샷·결과 SHA를 기록한다. 2학기 중간 금당 q02의 잘못된 점 라벨 문제(R9-05)를 최우선 처리한다.
5. 숫자 보기 순서 41문항/6종 및 분포 2종 수정은 SVG 렌더와 별도 데이터 품질 작업이다. 본 플랜 완료를 문제지 최종 게시 완료로 간주하지 않는다.

## 범위 외·유보

- 지금 완결된 것은 **마지막 9종의 원본 역할 차이 100건에 대한 계획 JSON 판정**이다. 기존 49종에 대해 이미 커밋된 플랜의 별도 엔진 실행·수학 정답 감수·운영병합까지 완료됐다고 의미하지 않는다.
