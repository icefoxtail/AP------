# 26_복성고_1학기_기말_고1_유사 — 고1 1학기 기말 유사 심층 검수

> 범위: 2026-11-22 KST, source snapshot `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`; 수학/문항/해설 읽기 + 현행 SVG 실제 렌더 시각 검수 + 원본 그림 대조 + 교정 플랜 초안. 독립 최종 R1/R2 판정과 새 엔진 렌더는 수행하지 않았다.

- 유사 시험지: `archive/exams/similar/high/h1/1final/26_복성고_1학기_기말_고1_유사.js` (Git blob `24dbe97586632565138b4c8e86d8c78aa68c50c6`)
- 대응 원본: `archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js` (Git blob `4287ed127a54bdffcb37995cc9760794bcb5f054`)
- 23문항 / 연결 SVG 5개 / 원본 이미지 대비 미연결 역할 5개 / JSON 초안 6개 / 기존 role PlanRef 46개(모두 EXEMPT)

## 개별 문항 검토

| q | 영역 | 기재 정답 | 그림 상태 | 검토 범위 |
|---:|---|---|---|---|
| 1 | 순열과 조합 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 2 | 순열 | ① | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 3 | 행렬 | ⑤ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 4 | 다항식 | ② | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 5 | 이차부등식 | ④ | S 연결 | Q/A/S READ_CHECKED |
| 6 | 행렬 | ① | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 7 | 연립부등식 | ③ | S 연결 | Q/A/S READ_CHECKED |
| 8 | 복소수와 이차방정식 | ⑤ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 9 | 조합 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 10 | 행렬 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 11 | 절댓값 부등식 | ① | S 원본누락대비 | Q/A/S READ_CHECKED |
| 12 | 순열과 조합 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 13 | 복소수와 이차방정식 | ⑤ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 14 | 이차부등식 | ② | S 원본누락대비 | Q/A/S READ_CHECKED |
| 15 | 경우의 수 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 16 | 사차방정식 | ① | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 17 | 행렬 | ⑤ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 18 | 입체도형 | ② | S 연결, P 원본누락대비 | Q/A/S READ_CHECKED |
| 19 | 경우의 수 | ③ | S 연결, P 원본누락대비 | Q/A/S READ_CHECKED |
| 20 | 행렬 | ① | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 21 | 경우의 수 | $16$ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 22 | 연립부등식 | $8$ | S 연결 | Q/A/S READ_CHECKED |
| 23 | 행렬 | $A=\begin{pmatrix}1&1\\2&1\end{pmatrix},\ 29$ | S 원본누락대비 | Q/A/S READ_CHECKED |

## 대표 풀이 독립 대조/교정 포인트

- q18 원기둥 구멍 조건 계산에서 a=5,b=4
- q19 영역 인접관계에 따른 k=7
- q22 정수해 합 5 조건에서 k=1,7
- 나머지 문항도 발문·보기·정답·해설을 읽고 명백한 수학적 반례/모순을 탐색했다. 모든 문항에 대해 별도 외부 독립 검수자가 R2 PASS한 것은 아니다.

## 현행 SVG 시각 검수

| 역할 | 실제 렌더 대상 Git 경로 | 판정 | 학생 화면 기준 관찰 |
|---|---|---|---|
| q5 S | `archive/assets/images/26_복성고_1학기_기말_고1_유사/q5-solution.svg` | VISUAL_READ_OK | 해설 수직선 조건 일치 |
| q7 S | `archive/assets/images/26_복성고_1학기_기말_고1_유사/q7-solution.svg` | VISUAL_READ_OK | 해설 구간 경계 일치 |
| q18 S | `archive/assets/images/26_복성고_1학기_기말_고1_유사/q18-solution.svg` | VISUAL_READ_OK | 원기둥 윗면의 원·사각형 단면; 치수/관통 구조 보충 필요 |
| q19 S | `archive/assets/images/26_복성고_1학기_기말_고1_유사/q19-solution.svg` | VISUAL_READ_OK | 4영역 인접/비인접 관계와 풀이 일치 |
| q22 S | `archive/assets/images/26_복성고_1학기_기말_고1_유사/q22-solution.svg` | REPLACE_CANDIDATE | 교체 후보: 현재 k=0 예시만 있어 정답 k=1,7을 시각화하지 못함 |

## 원본 이미지 대비 유사 미연결 역할

대응 원본에 그림 자산이 있다는 사실은 새 유사문항에 반드시 같은 그림이 필요하다는 뜻이 아니다. 그러나 기존 EXEMPT 판단과 별도로 시각적 설명 효과를 재평가하는 초안을 만들었다.

| 역할 | 원본 그림 위치 | 기존 PlanRef | 코덱스 입력 초안 |
|---|---|---|---|
| q11 S | `archive/assets/images/26_복성고_1학기_기말_고1_기출/q11-solution-v2.svg` | EXEMPT | JF-24: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-24_26_복성고_q11_solution/plan.json) |
| q14 S | `archive/assets/images/26_복성고_1학기_기말_고1_기출/q14-solution-v2.svg` | EXEMPT | JF-25: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-25_26_복성고_q14_solution/plan.json) |
| q18 P | `archive/assets/images/26_복성고_1학기_기말_고1_기출/q18.png` | EXEMPT | JF-26: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-26_26_복성고_q18_problem/plan.json) |
| q19 P | `archive/assets/images/26_복성고_1학기_기말_고1_기출/q19.png` | EXEMPT | JF-27: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-27_26_복성고_q19_problem/plan.json) |
| q23 S | `archive/assets/images/26_복성고_1학기_기말_고1_기출/q23-solution.svg` | EXEMPT | JF-28: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-28_26_복성고_q23_solution/plan.json) |

## 다음 상태

- `item.json`·`plan.json`·`publish.json` 초안 작성 및 역할 매핑: **DONE**
- 기존 SVG 1차 실제 시각 검수: **DONE** (그림 내용 PASS가 아니라 표시·정합성 관찰)
- 새 JSON 엔진 lint/renderer 결과 `ARCHIVE_BOUND`: **NOT_RUN**
- 새 SVG PNG 확인, 독립 QA, 게시, main 병합: **NOT_RUN**
- 원본 시험지·유사 JS·기존 SVG·EXEMPT PlanRef 변경: **NONE**
