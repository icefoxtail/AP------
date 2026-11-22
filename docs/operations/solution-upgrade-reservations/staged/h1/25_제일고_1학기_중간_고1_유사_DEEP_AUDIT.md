# 25_제일고_1학기_중간_고1_유사 — 2026-11-22 심층 검수

소스 SHA: `da3726a34f99d1bcbd52aa6bcbbf23582e478ba7` · 기출 원본 SHA: `a94bb507ae7adfa28aa2077a131d26cf9dfa934d` · **22문항** · 연결 이미지 2개 · 원본 그림 역할 누락 4곳 · SVG 엔진 JSON 초안 4세트.

검수 기록이며 최종 출제·그림 승인 아님. 기존 SVG와 원본 문제 그림을 실제 PNG로 렌더해 육안 비교했다. 공식 엔진 lint/render/publish는 미실행.

## 문항별 검토

| qid | 유형 | 등록 정답 | 판정/후속 |
|---:|---|---|---|
| 1 | 항등식 | ③ | 문항·해설 검독 |
| 2 | 나머지 정리 | ② | 문항·해설 검독 |
| 3 | 나머지 정리 | -1 | 문항·해설 검독 |
| 4 | 인수분해 | ③ | 문항·해설 검독 |
| 5 | 나머지 정리 | ④ | 문항·해설 검독 |
| 6 | 곱셈 공식 | ⑤ | 문항·해설 검독 |
| 7 | 나머지 정리 | ② | 문항·해설 검독 |
| 8 | 나머지 정리 | ⑤ | 문항·해설 검독 |
| 9 | 복소수의 성질 | ③ | 문항·해설 검독 |
| 10 | 복소수의 정의 | ③ | 문항·해설 검독 |
| 11 | 복소수의 연산 | -1 | 문항·해설 검독 |
| 12 | 복소수의 연산 | ⑤ | 원본 해설 그림 역할 누락 |
| 13 | 이차함수와 이차방정식 | ① | 원본 문제 그림 역할 누락; 연결 이미지 PASS |
| 14 | 이차방정식의 판별식 | ④ | 원본 해설 그림 역할 누락 |
| 15 | 복소수의 연산 | ② | P0 MISSING_SOLUTION |
| 16 | 이차함수와 직선 | ⑤ | 원본 해설 그림 역할 누락 |
| 17 | 이차식의 작성 | -\frac{31}{3} | 문항·해설 검독 |
| 18 | 이차함수의 최대최소 | ① | P1 AMBIGUOUS_FIGURE |
| 19 | 인수분해 | (x-2)(x-3)(x+3) | 문항·해설 검독 |
| 20 | 나머지 정리 | 45 | 문항·해설 검독 |
| 21 | 복소수의 상등 | 6 | 문항·해설 검독 |
| 22 | 이차함수의 최대최소 | -7 | 연결 이미지 PASS |

## 오류·주의 사항

- **q15, P0 MISSING_SOLUTION:** 해설이 `[해설생성불가]`이며 수열 시작 계수는 1,3,5,7인데 마지막 항이 50i^50로 써 있어 일반항 2n−1과 모순. 문제·정답 ②부터 재작성.
- **q18, P1 AMBIGUOUS_FIGURE:** 정사각형 안 DE=5, DF=4인 EF 위 P를 말하지만 E,F가 어느 변 위에 있는지 본문에 정확히 지정하지 않았다. 원본 대응 그림도 없으므로 조건 또는 별도 문제 그림이 필요.

## 연결 이미지 실물 검수

- **q13 해설 / PASS** — `archive/assets/images/25_제일고_1학기_중간_고1_유사/q13-solution.svg` (SHA `0ac78ec0a21e901c486e86027eb5153ebccf073f`). 원래 영점 −3,6에서 f(x+2)=0의 영점 −5,4로 이동한 두 수직선이 일치.
- **q22 해설 / PASS** — `archive/assets/images/25_제일고_1학기_중간_고1_유사/q22-solution.svg` (SHA `632d85e920e67dc33fdbdb017f0db9a37d81e69c`). 정의역 [−3,2], 꼭짓점 1 및 양끝 거리 4·1의 방향·치수가 일치.

## 원본 대비 이미지 역할 누락

- q12 해설: `archive/assets/images/25_제일고_1학기_중간_고1_기출/q12-solution.svg` (SHA `9d3e610e4302235c0baad11bd9b32afbc628fda0`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q13 문제: `archive/assets/images/25_제일고_1학기_중간_고1_기출/q13-problem-v2.svg` (SHA `acfbdfb08664f732be7cfd7655f32fa66236f10b`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q14 해설: `archive/assets/images/25_제일고_1학기_중간_고1_기출/q14-solution-v2.svg` (SHA `dcd0174d0fd375204d1264711953c12cc628d666`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.
- q16 해설: `archive/assets/images/25_제일고_1학기_중간_고1_기출/q16-solution-v2.svg` (SHA `468ef8032a38ea89d9b3dc8c4a0972db22576802`). 해당 유사 문항 수치·영역으로 독립 재설계해야 함.

## 실제 엔진 입력 초안

| slot | 역할 | capability | 상태/차단 | JSON |
|---|---|---|---|---|
| N5-15 q12 | 해설 | `number-line-figure-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-15_25_제일고_q12_solution/plan.json) |
| N5-16 q13 | 문제 | `polynomial-spike-v1` | ENGINE_SUPPORT_CHECK: 문제에 계수 부호가 없으므로 위로 볼록한 대표 곡선 표시가 오독 가능한지 검증 | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-16_25_제일고_q13_problem/plan.json) |
| N5-17 q14 | 해설 | `number-line-figure-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-17_25_제일고_q14_solution/plan.json) |
| N5-18 q16 | 해설 | `composite-panels-v1` | DRAFT_NOT_LINTED | [plan.json](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/N5-18_25_제일고_q16_solution/plan.json) |

수학 수정 선행과 원본/새 SVG 독립 QA 순서는 [공식 엔진 실행 인계](./H1_1MID_SIMILAR_NEXT5_SVG_ENGINE_EXECUTION_20261122.md)에 기재. 이 작업은 SVG/JS를 수정하지 않는다.
