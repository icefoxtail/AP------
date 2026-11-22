# 26_금당고_1학기_기말_고1_유사 — 고1 1학기 기말 유사 심층 검수

> 범위: 2026-11-22 KST, source snapshot `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`; 수학/문항/해설 읽기 + 현행 SVG 실제 렌더 시각 검수 + 원본 그림 대조 + 교정 플랜 초안. 독립 최종 R1/R2 판정과 새 엔진 렌더는 수행하지 않았다.

- 유사 시험지: `archive/exams/similar/high/h1/1final/26_금당고_1학기_기말_고1_유사.js` (Git blob `d5574bf945726967cbe21eb023709ee984e62b2c`)
- 대응 원본: `archive/exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js` (Git blob `2936ba64a4f44d620164f0a696c528c58f8fb68c`)
- 20문항 / 연결 SVG 3개 / 원본 이미지 대비 미연결 역할 7개 / JSON 초안 7개 / 기존 role PlanRef 40개(모두 EXEMPT)

## 개별 문항 검토

| q | 영역 | 기재 정답 | 그림 상태 | 검토 범위 |
|---:|---|---|---|---|
| 1 | 여러 가지 방정식 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 2 | 여러 가지 부등식 | ⑤ | S 연결 | Q/A/S READ_CHECKED |
| 3 | 여러 가지 부등식 | ① | S 원본누락대비 | Q/A/S READ_CHECKED |
| 4 | 여러 가지 부등식 | ④ | S 원본누락대비 | Q/A/S READ_CHECKED |
| 5 | 경우의 수 | ② | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 6 | 행렬 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 7 | 행렬 | ① | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 8 | 여러 가지 방정식 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 9 | 여러 가지 부등식 | ⑤ | S 원본누락대비 | Q/A/S READ_CHECKED |
| 10 | 여러 가지 부등식 | ② | S 연결 | Q/A/S READ_CHECKED |
| 11 | 경우의 수 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 12 | 경우의 수 | ① | S 연결, P 원본누락대비 | Q/A/S READ_CHECKED |
| 13 | 경우의 수 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 14 | 여러 가지 부등식 | ② | S 원본누락대비 | Q/A/S READ_CHECKED |
| 15 | 행렬 | ⑤ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 16 | 복소수와 이차방정식 | ③ | S 원본누락대비 | Q/A/S READ_CHECKED |
| 17 | 경우의 수 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 18 | 행렬 | $X=\begin{pmatrix}0&2\\7&1\end{pmatrix}$, 성분의 합 $10$ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 19 | 경우의 수 | $84$ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 20 | 여러 가지 부등식 | $5$ | S 원본누락대비 | Q/A/S READ_CHECKED |

## 대표 풀이 독립 대조/교정 포인트

- q12 도로의 세 경로 분해에 따른 경우 수 20
- q17 주사위 배치 독립 계수 10080 재산출 일치
- q19 2명씩 텐트 할당 경우 84 재산출 일치
- 나머지 문항도 발문·보기·정답·해설을 읽고 명백한 수학적 반례/모순을 탐색했다. 모든 문항에 대해 별도 외부 독립 검수자가 R2 PASS한 것은 아니다.

## 현행 SVG 시각 검수

| 역할 | 실제 렌더 대상 Git 경로 | 판정 | 학생 화면 기준 관찰 |
|---|---|---|---|
| q2 S | `archive/assets/images/26_금당고_1학기_기말_고1_유사/q2-solution.svg` | VISUAL_READ_OK | x>3과 x<7 교집합 일치 |
| q10 S | `archive/assets/images/26_금당고_1학기_기말_고1_유사/q10-solution.svg` | VISUAL_READ_OK | 11<n<13 해 표시 일치 |
| q12 S | `archive/assets/images/26_금당고_1학기_기말_고1_유사/q12-solution.svg` | VISUAL_READ_OK | A/B/C/D 도로망 2·2·3·1·2, 합 20의 분해와 일치 |

## 원본 이미지 대비 유사 미연결 역할

대응 원본에 그림 자산이 있다는 사실은 새 유사문항에 반드시 같은 그림이 필요하다는 뜻이 아니다. 그러나 기존 EXEMPT 판단과 별도로 시각적 설명 효과를 재평가하는 초안을 만들었다.

| 역할 | 원본 그림 위치 | 기존 PlanRef | 코덱스 입력 초안 |
|---|---|---|---|
| q3 S | `archive/assets/images/26_금당고_1학기_기말_고1_기출/q3-solution.svg` | EXEMPT | JF-10: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-10_26_금당고_q03_solution/plan.json) |
| q4 S | `archive/assets/images/26_금당고_1학기_기말_고1_기출/q4-solution.svg` | EXEMPT | JF-11: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-11_26_금당고_q04_solution/plan.json) |
| q9 S | `archive/assets/images/26_금당고_1학기_기말_고1_기출/q9-solution.svg` | EXEMPT | JF-12: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-12_26_금당고_q09_solution/plan.json) |
| q12 P | `archive/assets/images/26_금당고_1학기_기말_고1_기출/q12.png` | EXEMPT | JF-13: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-13_26_금당고_q12_problem/plan.json) |
| q14 S | `archive/assets/images/26_금당고_1학기_기말_고1_기출/q14-solution-v2.svg` | EXEMPT | JF-14: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-14_26_금당고_q14_solution/plan.json) |
| q16 S | `archive/assets/images/26_금당고_1학기_기말_고1_기출/q16-solution.svg` | EXEMPT | JF-15: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-15_26_금당고_q16_solution/plan.json) |
| q20 S | `archive/assets/images/26_금당고_1학기_기말_고1_기출/q20-solution-v2.svg` | EXEMPT | JF-16: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-16_26_금당고_q20_solution/plan.json) |

## 다음 상태

- `item.json`·`plan.json`·`publish.json` 초안 작성 및 역할 매핑: **DONE**
- 기존 SVG 1차 실제 시각 검수: **DONE** (그림 내용 PASS가 아니라 표시·정합성 관찰)
- 새 JSON 엔진 lint/renderer 결과 `ARCHIVE_BOUND`: **NOT_RUN**
- 새 SVG PNG 확인, 독립 QA, 게시, main 병합: **NOT_RUN**
- 원본 시험지·유사 JS·기존 SVG·EXEMPT PlanRef 변경: **NONE**
