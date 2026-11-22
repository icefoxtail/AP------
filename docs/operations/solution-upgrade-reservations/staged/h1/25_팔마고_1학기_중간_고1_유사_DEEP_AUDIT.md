# 25_팔마고_1학기_중간_고1_유사 — 2026-11-22 심층 검수

소스 SHA: `09147309e883b28f0c6479d12e558de15df6e3b2` · 기출 원본 SHA: `ecdd2d326583a7add130ec805a063068ce706ba9` · **23문항** · 연결 이미지 1개 · 원본 그림 역할 누락 8곳 · SVG 엔진 JSON 초안 8세트.

검수 기록이며 최종 출제·그림 승인 아님. 기존 SVG와 원본 문제 그림을 실제 PNG로 렌더해 육안 비교했다. 공식 엔진 lint/render/publish는 미실행.

## 문항별 검토

| qid | 유형 | 등록 정답 | 판정/후속 |
|---:|---|---|---|
| 1 | 나머지 정리 | ⑤ | 문항·해설 검독 |
| 2 | 곱셈 공식 | ⑤ | 문항·해설 검독 |
| 3 | 이차방정식의 판별식 | ④ | 연결 이미지 PASS |
| 4 | 다항식의 나눗셈 | ④ | 문항·해설 검독 |
| 5 | 복소수의 연산 | ② | 문항·해설 검독 |
| 6 | 이차방정식의 근과 계수 | ④ | 문항·해설 검독 |
| 7 | 다항식의 인수분해 | ① | 문항·해설 검독 |
| 8 | 이차함수와 직선 | ③ | 원본 해설 그림 역할 누락 |
| 9 | 항등식 | ① | 문항·해설 검독 |
| 10 | 이차방정식의 판별식 | ② | 문항·해설 검독 |
| 11 | 복소수의 성질 | ① | 문항·해설 검독 |
| 12 | 연립방정식 | ② | 문항·해설 검독 |
| 13 | 나머지 정리 | ② | 문항·해설 검독 |
| 14 | 복소수의 주기성 | ③ | 문항·해설 검독 |
| 15 | 이차함수와 판별식 | ⑤ | 원본 해설 그림 역할 누락 |
| 16 | 이차방정식의 판별식 | ① | 원본 해설 그림 역할 누락 |
| 17 | 이차함수의 활용 | ② | 원본 문제 그림 역할 누락; 원본 해설 그림 역할 누락 |
| 18 | 다항식의 항등식 | ① | 문항·해설 검독 |
| 19 | 복소수의 연산 | ③ | 문항·해설 검독 |
| 20 | 나머지 정리 | x^2-2x+3, 2 | P2 MATH_MARKUP; 원본 해설 그림 역할 누락 |
| 21 | 이차함수의 활용 | 2초, 30m, 2초 | 원본 해설 그림 역할 누락 |
| 22 | 다항식의 인수분해 | (x-2)(x+2)(x^2+3), x=\pm2, \pm\sqrt{3}i, (x-2)(x+2)(x-\sqrt{3}i)(x+\sqrt{3}i) | 문항·해설 검독 |
| 23 | 연립이차방정식 | ③ | P1 ANSWER_METADATA; 원본 해설 그림 역할 누락 |

## 오류·주의 사항

- **q23, P1 ANSWER_METADATA:** 서논술형은 양의 실수 k=3이 정답인데 questionBank.answer가 객관식 기호 `③`로 저장됨. 제출·채점 메타데이터 정정 필요.
- **q20, P2 MATH_MARKUP:** 해설 첫 줄의 `$R(x)는 2차 이하이므로 ...`는 수식 경계가 깨져 있어 학생 화면 확인 필요.

## 연결 이미지 실물 검수

- **q3 해설 / PASS** — `archive/assets/images/25_팔마고_1학기_중간_고1_유사/q3-solution.svg` (SHA `212034f410c911f320c3504f509b85d707e7c982`). −2√5<k<2√5 양쪽 열린 끝점과 0 기준이 올바르게 표시됨.

## 원본 대비 이미지 역할 누락

- q8 해설: `archive/assets/images/25_팔마고_1학기_중간_고1_기출/q8-solution-v2.svg` (SHA `3f007a6ed4138fc618f65c52cd9875281dc31921`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q15 해설: `archive/assets/images/25_팔마고_1학기_중간_고1_기출/q15-solution-graph.svg` (SHA `ec25afb03e5bfd8524ba9edd3e430f27f0267425`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q16 해설: `archive/assets/images/25_팔마고_1학기_중간_고1_기출/q16-solution-v2.svg` (SHA `3b365a11fe94150232b85b2d8a51385c58debb33`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q17 문제: `archive/assets/images/25_팔마고_1학기_중간_고1_기출/q17.png` (SHA `007cfbf07926ba04c3420cff43e1fabeaa4ec72f`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q17 해설: `archive/assets/images/25_팔마고_1학기_중간_고1_기출/q17-solution-v2.svg` (SHA `f87b83dc32bf77693dc5cca39b5b38596ea1e56d`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q20 해설: `archive/assets/images/25_팔마고_1학기_중간_고1_기출/q20-solution.svg` (SHA `a3e816a0c4e8476e1581ee0e7a46c10ab8a16f23`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q21 해설: `archive/assets/images/25_팔마고_1학기_중간_고1_기출/q21-solution-v2.svg` (SHA `c6e0112ba1422273022700904786b35c470e25f5`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q23 해설: `archive/assets/images/25_팔마고_1학기_중간_고1_기출/q23-solution.svg` (SHA `7d84a0cfb21466c931395f9ab108e3c5d00e7c4b`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.

## 실제 엔진 입력 초안

| slot | 역할 | capability | 상태/차단 | JSON |
|---|---|---|---|---|
| N5-19 q8 | 해설 | `multi-curve-figure-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-19_25_팔마고_q08_solution/plan.json) |
| N5-20 q15 | 해설 | `polynomial-spike-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-20_25_팔마고_q15_solution/plan.json) |
| N5-21 q16 | 해설 | `number-line-figure-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-21_25_팔마고_q16_solution/plan.json) |
| N5-22 q17 | 문제 | `construction-spike-v1` | ENGINE_SUPPORT_CHECK: 높이 4 표시, 파생 사각형 점 노드와 레이아웃 QA 확인 | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-22_25_팔마고_q17_problem/plan.json) |
| N5-23 q17 | 해설 | `polynomial-spike-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-23_25_팔마고_q17_solution/plan.json) |
| N5-24 q20 | 해설 | `polynomial-spike-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-24_25_팔마고_q20_solution/plan.json) |
| N5-25 q21 | 해설 | `multi-curve-figure-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-25_25_팔마고_q21_solution/plan.json) |
| N5-26 q23 | 해설 | `polynomial-spike-v1` | ENGINE_SUPPORT_CHECK: 현재 서논술형 answer 메타데이터가 ③으로 저장되어 실제 정답 3과 불일치 | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-26_25_팔마고_q23_solution/plan.json) |

수학 수정 선행과 원본/새 SVG 독립 QA 순서는 [공식 엔진 실행 인계](./H1_1MID_SIMILAR_NEXT5_SVG_ENGINE_EXECUTION_20261122.md)에 기재. 이 작업은 SVG/JS를 수정하지 않는다.
