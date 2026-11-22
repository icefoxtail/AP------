# 23_매산고_1학기_중간_고1_유사 — 2026-11-22 심층 검수

소스 SHA: `94fa47cebec2811b98327d10c37265ea2e711f18` · 기출 원본 SHA: `73f871a9683a11d7a38ede12788338a5fdd49c6f` · **20문항** · 연결 이미지 0개 · 원본 그림 역할 누락 5곳 · SVG 엔진 JSON 초안 5세트.

검수 기록이며 최종 출제·그림 승인 아님. 기존 SVG와 원본 문제 그림을 실제 PNG로 렌더해 육안 비교했다. 공식 엔진 lint/render/publish는 미실행.

## 문항별 검토

| qid | 유형 | 등록 정답 | 판정/후속 |
|---:|---|---|---|
| 1 | 다항식의 연산 | ① | 문항·해설 검독 |
| 2 | 복소수의 연산 | ③ | 문항·해설 검독 |
| 3 | 항등식 | ④ | 문항·해설 검독 |
| 4 | 나머지 정리 | ② | 문항·해설 검독 |
| 5 | 이차방정식의 판별식 | ② | 문항·해설 검독 |
| 6 | 인수분해 | ③ | 문항·해설 검독 |
| 7 | 곱셈 공식의 변형 | ② | 문항·해설 검독 |
| 8 | 다항식의 나눗셈 | ② | 문항·해설 검독 |
| 9 | 항등식의 성질 | ③ | 문항·해설 검독 |
| 10 | 이차함수의 최대최소 | ③ | P0 MATH+EDITORIAL; 원본 문제 그림 역할 누락; 원본 해설 그림 역할 누락 |
| 11 | 이차함수와 이차방정식 | ⑤ | P0 NO_VALID_ANSWER |
| 12 | 이차함수의 최대최소 (치환) | ⑤ | P0 ANSWER_INVALID; 원본 해설 그림 역할 누락 |
| 13 | 이차방정식과 근과 계수의 관계 | ④ | 문항·해설 검독 |
| 14 | 복소수의 성질 | ① | 문항·해설 검독 |
| 15 | 다항식의 전개 | -6 | 문항·해설 검독 |
| 16 | 이차함수와 직선 | -15 | 원본 해설 그림 역할 누락 |
| 17 | 수치 계산의 공식화 | 125100 | 문항·해설 검독 |
| 18 | 다항식의 인수분해 | 14 | P0 FALSE_FACTOR |
| 19 | 복소수의 거듭제곱 | 2 | 문항·해설 검독 |
| 20 | 이차함수와 도형의 넓이 | $-\frac{4}{3}$ | 원본 해설 그림 역할 누락 |

## 오류·주의 사항

- **q10, P0 MATH+EDITORIAL:** 문항에 두 구역의 공유변·구획 조건이 명시되지 않는다. 해설의 3x+2y=180과 S=xy는 전체 넓이(정사각형 x² 포함)라는 문장과도 충돌한다. 도형 및 최적화 식부터 재설계.
- **q11, P0 NO_VALID_ANSWER:** 첫 포물선 두 교점 조건은 k>2, 둘째 포물선 접점 조건은 k=−2. 교집합이 공집합인데 ⑤=2를 정답 표시한다.
- **q12, P0 ANSWER_INVALID:** t=(x−1)²+1∈[1,5], y=(t−2)²+1에서 m=1, M=10, 합 11. 해설 끝에서 10+2=12로 바뀌었고 보기에는 11이 없다.
- **q18, P0 FALSE_FACTOR:** 문항 다항식은 주장한 (x−z)(x−y)²와 yz(y−z)만큼 다르다. 해설의 소수 (7,5,2)를 대입하면 요구값 20이 아닌 50.

## 연결 이미지 실물 검수

현재 연결 이미지가 없으므로 기존 유사 SVG 실물 검수 대상 없음.

## 원본 대비 이미지 역할 누락

- q10 문제: `archive/assets/images/23_매산고_1학기_중간_고1_기출/q10-question-figure.png` (SHA `cc333718331893c8cba1b186a3d00d286cb5f287`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q10 해설: `archive/assets/images/23_매산고_1학기_중간_고1_기출/q10-solution-v2.svg` (SHA `7a8e9d6bc411a0691f34141de2e6e89fc5c05002`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q12 해설: `archive/assets/images/23_매산고_1학기_중간_고1_기출/q12-solution-v2.svg` (SHA `96295458c59dd1ff69751f96b8bcb77cc67cfb43`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q16 해설: `archive/assets/images/23_매산고_1학기_중간_고1_기출/q16-solution-v2.svg` (SHA `237267bb95bf4cb7cdb38e83aa67a2f95fd37665`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q20 해설: `archive/assets/images/23_매산고_1학기_중간_고1_기출/q20-solution-v2.svg` (SHA `2f033b2dedb8bd113c53cc6857bb093e92f2c8ac`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.

## 실제 엔진 입력 초안

| slot | 역할 | capability | 상태/차단 | JSON |
|---|---|---|---|---|
| N5-01 q10 | 문제 | `construction-spike-v1` | BLOCKED_EDITORIAL: 질문에 구역 배치·공유변 조건이 누락되어 3x+2y=180을 도형에서 도출할 수 없음 | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-01_23_매산고_q10_problem/plan.json) |
| N5-02 q10 | 해설 | `polynomial-spike-v1` | BLOCKED_EDITORIAL: 구획·공유변 정의 누락 및 전체 넓이에 정사각형 x² 미포함 | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-02_23_매산고_q10_solution/plan.json) |
| N5-03 q12 | 해설 | `polynomial-spike-v1` | BLOCKED_MATH: M+m=11인데 원문 정답 ⑤=12; 보기 11 없음 | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-03_23_매산고_q12_solution/plan.json) |
| N5-04 q16 | 해설 | `multi-curve-figure-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-04_23_매산고_q16_solution/plan.json) |
| N5-05 q20 | 해설 | `multi-curve-figure-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-05_23_매산고_q20_solution/plan.json) |

수학 수정 선행과 원본/새 SVG 독립 QA 순서는 [공식 엔진 실행 인계](./H1_1MID_SIMILAR_NEXT5_SVG_ENGINE_EXECUTION_20261122.md)에 기재. 이 작업은 SVG/JS를 수정하지 않는다.
