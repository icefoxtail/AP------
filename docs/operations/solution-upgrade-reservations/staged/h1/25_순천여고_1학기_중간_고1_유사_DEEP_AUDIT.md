# 25_순천여고_1학기_중간_고1_유사 — 2026-11-22 심층 검수

소스 SHA: `fdfa6fd043c1babbb4ef1d7cafaba0552afbc42a` · 기출 원본 SHA: `f6c307b5ca03100592260ff80f0ab14dcf92fcfc` · **22문항** · 연결 이미지 2개 · 원본 그림 역할 누락 5곳 · SVG 엔진 JSON 초안 6세트.

검수 기록이며 최종 출제·그림 승인 아님. 기존 SVG와 원본 문제 그림을 실제 PNG로 렌더해 육안 비교했다. 공식 엔진 lint/render/publish는 미실행.

## 문항별 검토

| qid | 유형 | 등록 정답 | 판정/후속 |
|---:|---|---|---|
| 1 | 다항식의 연산 | ④ | 문항·해설 검독 |
| 2 | 다항식의 인수분해 | ④ | 문항·해설 검독 |
| 3 | 다항식의 연산 | ⑤ | 문항·해설 검독 |
| 4 | 나머지 정리 | ② | 문항·해설 검독 |
| 5 | 이차함수의 최대최소 | ③ | P1 LINKED_SVG_VISUAL; 연결 이미지 FAIL |
| 6 | 다항식의 나눗셈 | ④ | 문항·해설 검독 |
| 7 | 나머지 정리 | ④ | 원본 해설 그림 역할 누락 |
| 8 | 곱셈 공식의 변형 | ⑤ | 문항·해설 검독 |
| 9 | 행렬 | ③ | 문항·해설 검독 |
| 10 | 이차방정식의 판별식 | ③ | 원본 해설 그림 역할 누락 |
| 11 | 복소수의 연산 | ② | 문항·해설 검독 |
| 12 | 복소수의 연산 | ③ | 문항·해설 검독 |
| 13 | 다항식의 전개 | ② | 문항·해설 검독 |
| 14 | 이차방정식의 근과 계수 | ④ | 문항·해설 검독 |
| 15 | 다항식의 연산 | ⑤ | 문항·해설 검독 |
| 16 | 이차함수의 최대최소 | ② | P0 DEGENERATE_DOMAIN |
| 17 | 행렬 | ① | 문항·해설 검독 |
| 18 | 다항식의 인수분해 | ⑤ | P2 MATH_MARKUP; 원본 해설 그림 역할 누락 |
| 19 | 이차방정식 | ① | 문항·해설 검독 |
| 20 | 이차방정식의 활용 | ① | 원본 문제 그림 역할 누락; 연결 이미지 PASS_WITH_CHECK |
| 21 | 이차함수의 최대최소 | ⑤ | 원본 해설 그림 역할 누락 |
| 22 | 이차함수와 직선 | ① | P1 SOURCE_MAPPING |

## 오류·주의 사항

- **q5, P1 LINKED_SVG_VISUAL:** 해설 SVG 상단 구간 [−1,1]은 관련 있지만 하단 L=−1,R=1,T=2, 거리 3·1은 이 문제의 풀이 조건이 아니므로 삭제·실제 함수 그래프 교체.
- **q16, P0 DEGENERATE_DOMAIN:** 문항은 x≥2에서 변 x−2의 직육면체를 가정한다. x=2이면 한 변 0으로 직육면체가 아니므로 진짜 직육면체에선 x>2, 겉넓이 30은 최솟값이 아니라 하한이다. 도메인 정의 수정 필수.
- **q18, P2 MATH_MARKUP:** 해설에 `\\\(`, 한국어 앞의 임의 `\` 등 LaTeX 이스케이프가 뒤엉킨 부분이 있다. 도식보다 먼저 조판 확인.
- **q22, P1 SOURCE_MAPPING:** 유사 q22는 있으나 대응 원본 q22가 없어 원본 이미지 동등성 비교가 불가. 독립 생성문항으로 별도 출처 검증(수학 판별식 계산 자체는 맞음).
- 원본 provenance 미매핑: 유사 q22. 원본과의 그림 동등성 확인 불가.

## 연결 이미지 실물 검수

- **q5 해설 / FAIL** — `archive/assets/images/25_순천여고_1학기_중간_고1_유사/q5-solution.svg` (SHA `60aebe47b105dacc6b47a14a9541ff8465516fda`). 상단 [−1,1]은 맞지만 하단 불필요한 L/R/T 수직선과 거리 치수가 혼재.
- **q20 해설 / PASS_WITH_CHECK** — `archive/assets/images/25_순천여고_1학기_중간_고1_유사/q20-solution.svg` (SHA `38744fb486357f84eafe384b729f0cdf9fc15446`). 원·지름 AB·현 CD·교점 P, CP=10·PD=8 표현됨. 숫자 26의 길이 라벨 위치는 후속 확인.

## 원본 대비 이미지 역할 누락

- q7 해설: `archive/assets/images/25_순천여고_1학기_중간_고1_기출/q7-solution.svg` (SHA `f38281bbadcf09c5ec50efcea41f92470ac955cd`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q10 해설: `archive/assets/images/25_순천여고_1학기_중간_고1_기출/q10-solution-v2.svg` (SHA `98f68b170dfb43be49127c503658bf20dfc7d4ab`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q18 해설: `archive/assets/images/25_순천여고_1학기_중간_고1_기출/q18-solution.svg` (SHA `23ef90937c3840aea64ebd517344d4ffae7e25dc`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q20 문제: `archive/assets/images/25_순천여고_1학기_중간_고1_기출/q20.png` (SHA `9fea62e83849d26df44e5008c3139da24f889335`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q21 해설: `archive/assets/images/25_순천여고_1학기_중간_고1_기출/q21-solution-v2.svg` (SHA `478e2fecc9e7bef70b2191afef657c1bcb53fb46`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.

## 실제 엔진 입력 초안

| slot | 역할 | capability | 상태/차단 | JSON |
|---|---|---|---|---|
| N5-09 q5 | 해설 | `polynomial-spike-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-09_25_순천여고_q05_solution/plan.json) |
| N5-10 q7 | 해설 | `polynomial-spike-v1` | ENGINE_SUPPORT_CHECK: polynomial-spike-v1 1차 계수 수용 여부 확인 필요 | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-10_25_순천여고_q07_solution/plan.json) |
| N5-11 q10 | 해설 | `number-line-figure-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-11_25_순천여고_q10_solution/plan.json) |
| N5-12 q18 | 해설 | `multi-curve-figure-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-12_25_순천여고_q18_solution/plan.json) |
| N5-13 q20 | 문제 | `construction-spike-v1` | ENGINE_SUPPORT_CHECK: 무리수 좌표 SOURCE_POINT와 정확한 원-현 교차 observer 지원 검증 필요 | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-13_25_순천여고_q20_problem/plan.json) |
| N5-14 q21 | 해설 | `composite-panels-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-14_25_순천여고_q21_solution/plan.json) |

수학 수정 선행과 원본/새 SVG 독립 QA 순서는 [공식 엔진 실행 인계](./H1_1MID_SIMILAR_NEXT5_SVG_ENGINE_EXECUTION_20261122.md)에 기재. 이 작업은 SVG/JS를 수정하지 않는다.
