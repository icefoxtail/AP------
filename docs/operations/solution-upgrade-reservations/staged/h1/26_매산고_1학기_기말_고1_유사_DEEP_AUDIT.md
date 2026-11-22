# 26_매산고_1학기_기말_고1_유사 — 고1 1학기 기말 유사 심층 검수

> 범위: 2026-11-22 KST, source snapshot `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`; 수학/문항/해설 읽기 + 현행 SVG 실제 렌더 시각 검수 + 원본 그림 대조 + 교정 플랜 초안. 독립 최종 R1/R2 판정과 새 엔진 렌더는 수행하지 않았다.

- 유사 시험지: `archive/exams/similar/high/h1/1final/26_매산고_1학기_기말_고1_유사.js` (Git blob `65335537bafec8d4e3567b785ee87c5a6120d18c`)
- 대응 원본: `archive/exams/original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js` (Git blob `042c05e59871998fd8ae7afdd2bd853db92d4358`)
- 21문항 / 연결 SVG 4개 / 원본 이미지 대비 미연결 역할 7개 / JSON 초안 8개 / 기존 role PlanRef 42개(모두 EXEMPT)

## 개별 문항 검토

| q | 영역 | 기재 정답 | 그림 상태 | 검토 범위 |
|---:|---|---|---|---|
| 1 | 행렬 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 2 | 순열과 조합 | ⑤ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 3 | 합의 법칙과 곱의 법칙 | ① | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 4 | 행렬 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 5 | 조합 | ② | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 6 | 연립부등식 | ⑤ | S 연결 | Q/A/S READ_CHECKED |
| 7 | 순열 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 8 | 일차부등식 | ① | S 연결 | Q/A/S READ_CHECKED |
| 9 | 이차부등식 | ② | S 원본누락대비 | Q/A/S READ_CHECKED |
| 10 | 행렬 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 11 | 경우의 수 | ① | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 12 | 복소수와 이차방정식 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 13 | 절댓값 부등식 | ⑤ | S 연결 | Q/A/S READ_CHECKED |
| 14 | 이차부등식 | ② | S 원본누락대비 | Q/A/S READ_CHECKED |
| 15 | 행렬 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 16 | 행렬 | $4$ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 17 | 삼차방정식 | $k\lt\dfrac{1}{4}\ (k\ne0,\ k\ne\dfrac{2}{9})$ | S 원본누락대비 | Q/A/S READ_CHECKED |
| 18 | 경우의 수 | $1152$ | P 원본누락대비, S 원본누락대비 | Q/A/S READ_CHECKED |
| 19 | 이차함수 | $\dfrac{3}{2}$ | P 원본누락대비, S 원본누락대비 | Q/A/S READ_CHECKED |
| 20 | 연립부등식 | $2b\gt a+c$ | S 연결 | Q/A/S READ_CHECKED |
| 21 | 행렬 | $-6$ | 그림 역할 없음 | Q/A/S READ_CHECKED |

## 대표 풀이 독립 대조/교정 포인트

- q13 |x−2|+|x+4|≤2a에 11개 정수 ⇔ 5≤a<6
- q17 3개 서로 다른 실근 ⇔ k<1/4, k≠0,2/9
- q18 2×4 체커보드 성별/짝홀 배치 총 1152
- q19 f의 근 −2,4와 a=3/2를 적용한 열린 변환 구간 확인
- 나머지 문항도 발문·보기·정답·해설을 읽고 명백한 수학적 반례/모순을 탐색했다. 모든 문항에 대해 별도 외부 독립 검수자가 R2 PASS한 것은 아니다.

## 현행 SVG 시각 검수

| 역할 | 실제 렌더 대상 Git 경로 | 판정 | 학생 화면 기준 관찰 |
|---|---|---|---|
| q6 S | `archive/assets/images/26_매산고_1학기_기말_고1_유사/q6-solution.svg` | VISUAL_READ_OK | 해설 수직선 조건 일치 |
| q8 S | `archive/assets/images/26_매산고_1학기_기말_고1_유사/q8-solution.svg` | VISUAL_READ_OK | 해설 구간 경계와 정수 표시 일치 |
| q13 S | `archive/assets/images/26_매산고_1학기_기말_고1_유사/q13-solution.svg` | REPLACE_CANDIDATE | 교체 후보: 현재 2a=8(a=4) 예시는 9개 정수를 보여 정답의 11개 경계와 다름 |
| q20 S | `archive/assets/images/26_매산고_1학기_기말_고1_유사/q20-solution.svg` | VISUAL_READ_OK | y=x²+1과 y=2x의 (1,2) 접점/제곱 부등식 대응 |

## 원본 이미지 대비 유사 미연결 역할

대응 원본에 그림 자산이 있다는 사실은 새 유사문항에 반드시 같은 그림이 필요하다는 뜻이 아니다. 그러나 기존 EXEMPT 판단과 별도로 시각적 설명 효과를 재평가하는 초안을 만들었다.

| 역할 | 원본 그림 위치 | 기존 PlanRef | 코덱스 입력 초안 |
|---|---|---|---|
| q9 S | `archive/assets/images/26_매산고_1학기_기말_고1_기출/q9-solution-v2.svg` | EXEMPT | JF-17: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-17_26_매산고_q09_solution/plan.json) |
| q14 S | `archive/assets/images/26_매산고_1학기_기말_고1_기출/q14-solution-v2.svg` | EXEMPT | JF-18: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-18_26_매산고_q14_solution/plan.json) |
| q17 S | `archive/assets/images/26_매산고_1학기_기말_고1_기출/q17-solution.svg` | EXEMPT | JF-19: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-19_26_매산고_q17_solution/plan.json) |
| q18 P | `archive/assets/images/26_매산고_1학기_기말_고1_기출/q18.png` | EXEMPT | JF-20: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-20_26_매산고_q18_problem/plan.json) |
| q18 S | `archive/assets/images/26_매산고_1학기_기말_고1_기출/q18-solution.svg` | EXEMPT | JF-21: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-21_26_매산고_q18_solution/plan.json) |
| q19 P | `archive/assets/images/26_매산고_1학기_기말_고1_기출/q19.png` | EXEMPT | JF-22: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-22_26_매산고_q19_problem/plan.json) |
| q19 S | `archive/assets/images/26_매산고_1학기_기말_고1_기출/q19-solution-v2.svg` | EXEMPT | JF-23: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-23_26_매산고_q19_solution/plan.json) |

## 다음 상태

- `item.json`·`plan.json`·`publish.json` 초안 작성 및 역할 매핑: **DONE**
- 기존 SVG 1차 실제 시각 검수: **DONE** (그림 내용 PASS가 아니라 표시·정합성 관찰)
- 새 JSON 엔진 lint/renderer 결과 `ARCHIVE_BOUND`: **NOT_RUN**
- 새 SVG PNG 확인, 독립 QA, 게시, main 병합: **NOT_RUN**
- 원본 시험지·유사 JS·기존 SVG·EXEMPT PlanRef 변경: **NONE**
