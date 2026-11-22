# 효천고 유사2 — 1학기 기말 유사 문항·해설·SVG 심층 검수

- 소스: `archive/exams/similar/high/h1/1final/25_효천고_1학기_기말_고1_유사2.js` (Git blob `27f4902569a764184d5b96f04610178646b8acc4`)
- 기출 대조: `archive/exams/original/high/h1/1final/25_효천고_1학기_기말_고1_기출c.js` (blob `346f87e1349ff14d68b28809e89767d1a5e09225`)
- 기준 HEAD: `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`. 출처 매핑은 `sourceQid` 부재로 같은 qid를 임시 대조한 것이다.
- 23문항. **23개 해설 전부 `[JS 기준 풀이]` 일반 임시 문구 — JS 콘텐츠 미완성.**
- 연결 SVG 0개(실물 렌더·시각검수), 기출 대비 그림 역할 격차 14곳 (문제 2, 해설 12).
- SVG 문제용 패킷 2개. 해설 그림은 콘텐츠 선행 보류. `level` 정수 1~5 불일치 23문항, 명시적 `provenance`/`sourceQid` 부재 23문항.
- **검수 절차:** 모든 발문/정답/선택지/임시 해설을 읽고, 수학 결과를 원문과 독립 대조했다. 계산 뼈대는 별도 청사진에 보존. **정식 단계별 학생 해설 작성·독립 R2·엔진 lint/render/publish는 NOT_RUN.**

## 핵심 판단

기존 연결 SVG가 없다. 기출 q7 직각삼각형 그림은 높이20cm인데 현재 유사본은 미지수 h, 최대넓이150으로 h=10이므로 기출 숫자를 복사하면 오답을 유도한다. 기출 q16은 f가 아래로 열려 유사 조건(계수 양수)과 상충한다. NK-05·06 초안을 발문형으로 수정한 뒤 엔진으로 렌더해야 한다.

## 1~23번 전수 인벤토리

표시 정답과 계산 결과는 서로 다른 의미다. 오른쪽 '계산 결과'는 발문을 기반으로 한 다음 콘텐츠 작업용 1차 검산값이며 최종 학생 해설과 엔진 게이트를 대신하지 않는다. 연결/격차 P=문제, S=해설.

| 번호 | 단원 | 표시 정답 | 계산 결과 | 연결 SVG | 기출 역할 격차 | P 계획 |
|---:|---|---|---|---|---|---|
| 1 | 이차방정식과 이차함수 | ② | −4 | — | S | — |
| 2 | 여러 가지 방정식과 부등식 | ② | 2 | — | S | — |
| 3 | 여러 가지 방정식과 부등식 | ④ | 4 | — | — | — |
| 4 | 여러 가지 방정식과 부등식 | ③ | 1/3 | — | S | — |
| 5 | 여러 가지 방정식과 부등식 | ③ | 3 | — | S | — |
| 6 | 행렬과 그 연산 | ① | 24 | — | — | — |
| 7 | 이차방정식과 이차함수 | ③ | 10 | — | P,S | NK-05 |
| 8 | 복소수와 이차방정식 | ② | −1 | — | — | — |
| 9 | 여러 가지 방정식과 부등식 | ④ | 5 | — | — | — |
| 10 | 약수와 배수 | ② | 3 | — | — | — |
| 11 | 순열과 조합 | ⑤ | 420 | — | — | — |
| 12 | 순열과 조합 | ① | C(n,r)−C(n−2,r) | — | — | — |
| 13 | 행렬과 그 연산 | ③ | ㄱ, ㄷ | — | — | — |
| 14 | 이차방정식과 이차함수 | ② | 1 | — | S | — |
| 15 | 여러 가지 방정식과 부등식 | ③ | 3 | — | S | — |
| 16 | 이차방정식과 이차함수 | ① | 2 | — | P,S | NK-06 |
| 17 | 여러 가지 방정식과 부등식 | ⑤ | 1 | — | S | — |
| 18 | 행렬과 그 연산 | ④ | 1458 | — | S | — |
| 19 | 순열과 조합 | ⑤ | 150 | — | — | — |
| 20 | 이차방정식과 이차함수 | $a=\dfrac{4}{3},\ b=\dfrac{19}{3}$ | a=4/3,b=19/3 | — | S | — |
| 21 | 행렬과 그 연산 | $6$ | 6 | — | — | — |
| 22 | 여러 가지 방정식과 부등식 | $1$ | 1 | — | S | — |
| 23 | 순열과 조합 | $67$ | 67 | — | — | — |

## 현행 연결 SVG 실물 확인

| 번호 | 역할 | SVG | SHA | 관찰 |
|---|---|---|---|---|
| — | — | 현재 연결 SVG 없음 | — | — |

## 기출 대비 그림 역할 1:1 매핑

**주의:** 원문 `sourceQid`와 `provenance`가 없어 이 비교는 원본의 같은 번호 기준 임시 교차표다. 다음 작업자가 문제 내용의 동일 계열 여부를 다시 확인해야 한다.

| 번호 | 역할 | 기출 그림 경로 | SHA | 계획 상태 |
|---:|---|---|---|---|
| 1 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q1-solution-v2.svg` | `c16e7e119f3032851bc8df6577961cadacfbdbc4` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 2 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q2-solution.svg` | `81015d0c27adb9b8ecc84bd4f8df4e48625b9b46` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 4 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q4-solution.svg` | `664ea822b48c59db235a04412d94e29a53efb1ee` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 5 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q5-solution.svg` | `0ae19f89f4ee1ec4f87df8c3de55365a3b1d21e2` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 7 | P | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q07-audit-rework.svg` | `a3ba593b3ea613cf7c3b9b08899b815ca36dc39d` | NK-05 (UNLINTED) |
| 7 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q7-solution.svg` | `3a4456a1cdb3b50f6ef17f4b59c5947c1e18456b` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 14 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q14-solution.svg` | `7f789172248df6bbbd75411bcf141200f8fa2dac` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 15 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q15-solution.svg` | `9e17c68566bd1085cbf12c667341422fbbfcc901` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 16 | P | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q16-quality-v4.svg` | `cb1cd68c29a71dcc0ba49a3eb2e567dd1ed5ef87` | NK-06 (UNLINTED) |
| 16 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q16-solution.svg` | `ba5037204b2cf7b427f326860b16d86c673c385c` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 17 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q17-solution.svg` | `4a128aa6787798e25a53dcaf811ee7a92b7d48a2` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 18 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q18-solution.svg` | `bae658ffeb1881ddd0e14a17b7ef07f742419319` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 20 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q20-solution-v2.svg` | `4ec9aedcc8666c09a5cddec2b2f67745c3efdfd1` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 22 | S | `archive/assets/images/25_효천고_1학기_기말_고1_기출c/q22-solution-v2.svg` | `02b2e3790fdcd57e2d8e873452dba4e9f9a1474c` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |

## 다음 조치

1. 본문 1~23번 전체의 실제 단계별 해설 작성. [내용 교정 청사진](H1_1FINAL_SIMILAR_LAST5_CONTENT_REPAIR_BLUEPRINT_20261122.md)에서 계산 뼈대와 표시 정답/선택지 재검토.
2. `level` 등 메타·원문 대응 정보를 실제 원문 근거로 보완. 소스와 채점 의미 보존.
3. P/S 그림 역할은 정본 [SVG 엔진 지침](../../../../../archive/tools/geometry-equation/production/AUTHOR_GUIDE.md)을 따라 plan lint, engine render, PNG 실물/수학검수, 게시 순으로 수행. 이 단계까지는 미실행.
