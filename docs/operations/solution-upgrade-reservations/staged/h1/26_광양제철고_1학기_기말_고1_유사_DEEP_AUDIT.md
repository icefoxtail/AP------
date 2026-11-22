# 26_광양제철고_1학기_기말_고1_유사 — 고1 1학기 기말 유사 심층 검수

> 범위: 2026-11-22 KST, source snapshot `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`; 수학/문항/해설 읽기 + 현행 SVG 실제 렌더 시각 검수 + 원본 그림 대조 + 교정 플랜 초안. 독립 최종 R1/R2 판정과 새 엔진 렌더는 수행하지 않았다.

- 유사 시험지: `archive/exams/similar/high/h1/1final/26_광양제철고_1학기_기말_고1_유사.js` (Git blob `b9d5ae21f4ac4fe9f859df33e54cea54d848fac8`)
- 대응 원본: `archive/exams/original/high/h1/1final/26_광양제철고_1학기_기말_고1_기출.js` (Git blob `52b90f5e0c02e00817787d9131466289fa39219c`)
- 19문항 / 연결 SVG 3개 / 원본 이미지 대비 미연결 역할 5개 / JSON 초안 5개 / 기존 role PlanRef 38개(모두 EXEMPT)

## 개별 문항 검토

| q | 영역 | 기재 정답 | 그림 상태 | 검토 범위 |
|---:|---|---|---|---|
| 1 | 여러 가지 부등식 | ③ | S 원본누락대비 | Q/A/S READ_CHECKED |
| 2 | 행렬 | ④ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 3 | 행렬 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 4 | 경우의 수와 순열 | ② | S 연결 | Q/A/S READ_CHECKED |
| 5 | 경우의 수와 순열 | ⑤ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 6 | 행렬 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 7 | 여러 가지 부등식 | ④ | S 연결 | Q/A/S READ_CHECKED |
| 8 | 여러 가지 부등식 | ④ | S 원본누락대비 | Q/A/S READ_CHECKED |
| 9 | 여러 가지 방정식 | ② | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 10 | 조합 | ⑤ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 11 | 여러 가지 방정식 | ③ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 12 | 이차방정식과 이차함수 | ① | S 원본누락대비 | Q/A/S READ_CHECKED |
| 13 | 조합 | ④ | S 연결 | Q/A/S READ_CHECKED |
| 14 | 여러 가지 방정식 | ⑤ | S 원본누락대비 | Q/A/S READ_CHECKED |
| 15 | 경우의 수와 순열 | ⑤ | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 16 | 조합 | ① | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 17 | 행렬 | $X=\begin{pmatrix}a&a+b\\0&b\end{pmatrix}$ $(a,b)=(1,2),(1,4),(2,1),(2,4),(4,1),(4,2) | 그림 역할 없음 | Q/A/S READ_CHECKED |
| 18 | 여러 가지 부등식 | $x>\dfrac{1}{6}$ | S 원본누락대비 | Q/A/S READ_CHECKED |
| 19 | 이차방정식 | $58$ | 그림 역할 없음 | Q/A/S READ_CHECKED |

## 대표 풀이 독립 대조/교정 포인트

- q4 세 카드 등차수열 12집합×6순열=72
- q13 5·5·4칸 전체 직사각형 75개−정사각형 23개=52
- q12 양의 b 4가지, 가능한 a 7가지=28
- 나머지 문항도 발문·보기·정답·해설을 읽고 명백한 수학적 반례/모순을 탐색했다. 모든 문항에 대해 별도 외부 독립 검수자가 R2 PASS한 것은 아니다.

## 현행 SVG 시각 검수

| 역할 | 실제 렌더 대상 Git 경로 | 판정 | 학생 화면 기준 관찰 |
|---|---|---|---|
| q4 S | `archive/assets/images/26_광양제철고_1학기_기말_고1_유사/q4-solution.svg` | VISUAL_READ_OK | 세 숫자의 등차수열 배치 보조 그림: 실제 조건과 충돌 없음 |
| q7 S | `archive/assets/images/26_광양제철고_1학기_기말_고1_유사/q7-solution.svg` | VISUAL_READ_OK | 텐트 수 12~15의 닫힌 구간이 해설과 일치 |
| q13 S | `archive/assets/images/26_광양제철고_1학기_기말_고1_유사/q13-solution.svg` | VISUAL_READ_OK | 5·5·4칸 직사각형 도형이 14개 배치와 일치 |

## 원본 이미지 대비 유사 미연결 역할

대응 원본에 그림 자산이 있다는 사실은 새 유사문항에 반드시 같은 그림이 필요하다는 뜻이 아니다. 그러나 기존 EXEMPT 판단과 별도로 시각적 설명 효과를 재평가하는 초안을 만들었다.

| 역할 | 원본 그림 위치 | 기존 PlanRef | 코덱스 입력 초안 |
|---|---|---|---|
| q1 S | `archive/assets/images/26_광양제철고_1학기_기말_고1_기출/q1-solution.svg` | EXEMPT | JF-01: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-01_26_광양제철고_q01_solution/plan.json) |
| q8 S | `archive/assets/images/26_광양제철고_1학기_기말_고1_기출/q8-solution.svg` | EXEMPT | JF-02: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-02_26_광양제철고_q08_solution/plan.json) |
| q12 S | `archive/assets/images/26_광양제철고_1학기_기말_고1_기출/q12-solution-v2.svg` | EXEMPT | JF-03: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-03_26_광양제철고_q12_solution/plan.json) |
| q14 S | `archive/assets/images/26_광양제철고_1학기_기말_고1_기출/q14-solution.svg` | EXEMPT | JF-04: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-04_26_광양제철고_q14_solution/plan.json) |
| q18 S | `archive/assets/images/26_광양제철고_1학기_기말_고1_기출/q18-solution-v2.svg` | EXEMPT | JF-05: [plan](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/JF-05_26_광양제철고_q18_solution/plan.json) |

## 다음 상태

- `item.json`·`plan.json`·`publish.json` 초안 작성 및 역할 매핑: **DONE**
- 기존 SVG 1차 실제 시각 검수: **DONE** (그림 내용 PASS가 아니라 표시·정합성 관찰)
- 새 JSON 엔진 lint/renderer 결과 `ARCHIVE_BOUND`: **NOT_RUN**
- 새 SVG PNG 확인, 독립 QA, 게시, main 병합: **NOT_RUN**
- 원본 시험지·유사 JS·기존 SVG·EXEMPT PlanRef 변경: **NONE**
