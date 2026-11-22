# 팔마고 유사2 — 1학기 기말 유사 문항·해설·SVG 심층 검수

- 소스: `archive/exams/similar/high/h1/1final/25_팔마고_1학기_기말_고1_유사2.js` (Git blob `ccf5a2a8f98bfd4d4b19ccc6c4f45644d6e43985`)
- 기출 대조: `archive/exams/original/high/h1/1final/25_팔마고_1학기_기말_고1_기출c.js` (blob `118b64cfaebd99c44d93ad4d1d98acc44a7ab1e7`)
- 기준 HEAD: `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`. 출처 매핑은 `sourceQid` 부재로 같은 qid를 임시 대조한 것이다.
- 23문항. **23개 해설 전부 `[JS 기준 풀이]` 일반 임시 문구 — JS 콘텐츠 미완성.**
- 연결 SVG 1개(실물 렌더·시각검수), 기출 대비 그림 역할 격차 8곳 (문제 0, 해설 8).
- SVG 문제용 패킷 0개. 해설 그림은 콘텐츠 선행 보류. `level` 정수 1~5 불일치 23문항, 명시적 `provenance`/`sourceQid` 부재 23문항.
- **검수 절차:** 모든 발문/정답/선택지/임시 해설을 읽고, 수학 결과를 원문과 독립 대조했다. 계산 뼈대는 별도 청사진에 보존. **정식 단계별 학생 해설 작성·독립 R2·엔진 lint/render/publish는 NOT_RUN.**

## 핵심 판단

기존 q18 문제 SVG는 5단 계단형 15칸을 정확히 묘사한다. 전체 직사각형 70개 중 정사각형 22개를 제외하면 **48개**, 표시 정답 ⑤=48과 일치. '5단이니 35개' 같은 잘못된 단순 추정은 금지. 해설 역할 8개는 콘텐츠 복구 후 제작.

## 1~23번 전수 인벤토리

표시 정답과 계산 결과는 서로 다른 의미다. 오른쪽 '계산 결과'는 발문을 기반으로 한 다음 콘텐츠 작업용 1차 검산값이며 최종 학생 해설과 엔진 게이트를 대신하지 않는다. 연결/격차 P=문제, S=해설.

| 번호 | 단원 | 표시 정답 | 계산 결과 | 연결 SVG | 기출 역할 격차 | P 계획 |
|---:|---|---|---|---|---|---|
| 1 | 여러 가지 방정식과 부등식 | ② | 1 | — | S | — |
| 2 | 여러 가지 방정식과 부등식 | ③ | 6 | — | S | — |
| 3 | 합의 법칙과 곱의 법칙 | ③ | 9 | — | — | — |
| 4 | 순열과 조합 | ① | 6 | — | — | — |
| 5 | 행렬과 그 연산 | ③ | 17 | — | — | — |
| 6 | 행렬과 그 연산 | ③ | 13 | — | — | — |
| 7 | 여러 가지 방정식과 부등식 | ① | 4<a≤5 | — | S | — |
| 8 | 여러 가지 방정식과 부등식 | ③ | 5 | — | S | — |
| 9 | 이차방정식과 이차함수 | ② | 2 | — | S | — |
| 10 | 도형의 방정식 | ② | 18 | — | — | — |
| 11 | 순열과 조합 | ① | 4 | — | — | — |
| 12 | 순열과 조합 | ⑤ | s | — | — | — |
| 13 | 순열과 조합 | ② | 4 | — | — | — |
| 14 | 행렬과 그 연산 | ④ | 20 | — | — | — |
| 15 | 행렬과 그 연산 | ② | 8 | — | — | — |
| 16 | 여러 가지 방정식과 부등식 | ④ | 2 | — | — | — |
| 17 | 순열과 조합 | ④ | 90 | — | — | — |
| 18 | 순열과 조합 | ⑤ | 48 | P | S | — |
| 19 | 행렬과 그 연산 | ⑤ | 24 | — | — | — |
| 20 | 여러 가지 방정식과 부등식 | 18 | 18 | — | S | — |
| 21 | 여러 가지 방정식과 부등식 | 24 | 24 | — | S | — |
| 22 | 순열과 조합 | 20 | 20 | — | — | — |
| 23 | 행렬과 그 연산 | 13 | 13 | — | — | — |

## 현행 연결 SVG 실물 확인

| 번호 | 역할 | SVG | SHA | 관찰 |
|---|---|---|---|---|
| q18 | P | `archive/assets/images/25_팔마고_1학기_기말_고1_유사2/q18-problem-v1.svg` | `4f87c403336b038f34063ecff397024306385e45` | 렌더·육안 확인, 신규 엔진 검사 별개 |

## 기출 대비 그림 역할 1:1 매핑

**주의:** 원문 `sourceQid`와 `provenance`가 없어 이 비교는 원본의 같은 번호 기준 임시 교차표다. 다음 작업자가 문제 내용의 동일 계열 여부를 다시 확인해야 한다.

| 번호 | 역할 | 기출 그림 경로 | SHA | 계획 상태 |
|---:|---|---|---|---|
| 1 | S | `archive/assets/images/25_팔마고_1학기_기말_고1_기출c/q1-solution.svg` | `988f771b29c06d381440191a20581cd57c538153` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 2 | S | `archive/assets/images/25_팔마고_1학기_기말_고1_기출c/q2-solution.svg` | `5c261a238cc43883f2323ed20be94f3a2e1ec6be` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 7 | S | `archive/assets/images/25_팔마고_1학기_기말_고1_기출c/q7-solution.svg` | `22bff9e69f47f181aee654b5a04de5afbb3e6245` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 8 | S | `archive/assets/images/25_팔마고_1학기_기말_고1_기출c/q8-solution.svg` | `b7d86355d3eb3a6c2ce27ef79029557a934e44ff` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 9 | S | `archive/assets/images/25_팔마고_1학기_기말_고1_기출c/q9-solution.svg` | `2c4a0ec1d4cf24d5adaf3597a555a3f0fb1c6cf2` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 18 | S | `archive/assets/images/25_팔마고_1학기_기말_고1_기출c/q18-solution.svg` | `ffed152bafabfcdbd8b850aae634e2691c6d12eb` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 20 | S | `archive/assets/images/25_팔마고_1학기_기말_고1_기출c/q20-solution-v2.svg` | `502e3d1020817ae23411fc32c3dd2963f7739669` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 21 | S | `archive/assets/images/25_팔마고_1학기_기말_고1_기출c/q21-solution.svg` | `8156bd0c4d8cbf0b16703e14254ab2dc69110fcf` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |

## 다음 조치

1. 본문 1~23번 전체의 실제 단계별 해설 작성. [내용 교정 청사진](H1_1FINAL_SIMILAR_LAST5_CONTENT_REPAIR_BLUEPRINT_20261122.md)에서 계산 뼈대와 표시 정답/선택지 재검토.
2. `level` 등 메타·원문 대응 정보를 실제 원문 근거로 보완. 소스와 채점 의미 보존.
3. P/S 그림 역할은 정본 [SVG 엔진 지침](../../../../../archive/tools/geometry-equation/production/AUTHOR_GUIDE.md)을 따라 plan lint, engine render, PNG 실물/수학검수, 게시 순으로 수행. 이 단계까지는 미실행.
