# 강남여고 유사2 — 1학기 기말 유사 문항·해설·SVG 심층 검수

- 소스: `archive/exams/similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사2.js` (Git blob `aa4105bb3ef2c24ce175badb9d66ae4cebde77aa`)
- 기출 대조: `archive/exams/original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js` (blob `5a2f970c4c1dfcf7045a6e528356f4dc473b2471`)
- 기준 HEAD: `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`. 출처 매핑은 `sourceQid` 부재로 같은 qid를 임시 대조한 것이다.
- 24문항. **24개 해설 전부 `[JS 기준 풀이]` 일반 임시 문구 — JS 콘텐츠 미완성.**
- 연결 SVG 0개(실물 렌더·시각검수), 기출 대비 그림 역할 격차 16곳 (문제 3, 해설 13).
- SVG 문제용 패킷 3개. 해설 그림은 콘텐츠 선행 보류. `level` 정수 1~5 불일치 24문항, 명시적 `provenance`/`sourceQid` 부재 24문항.
- **검수 절차:** 모든 발문/정답/선택지/임시 해설을 읽고, 수학 결과를 원문과 독립 대조했다. 계산 뼈대는 별도 청사진에 보존. **정식 단계별 학생 해설 작성·독립 R2·엔진 lint/render/publish는 NOT_RUN.**

## 핵심 판단

기존 연결 그림은 0개. 기출 P q11·18·20을 실제 렌더해 비교했으나 유사 문제의 수치·함수와 같지 않아 그대로 연결하면 안 된다. q11 도로망은 원본 곡선 연결 구조를 참고하되 발문 도로 개수를 3/2/3/4/x로 수정한다. q18 포물선 f=x²−6x 및 수평 대응점 A,C·B,D, q20 f−2x 세로 거리와 P/Q 관계가 핵심이다. q18·20의 샘플 곡선 수치는 풀이로부터 선택한 것이므로 학생용 문제 그림에서 노출 금지.

## 1~24번 전수 인벤토리

표시 정답과 계산 결과는 서로 다른 의미다. 오른쪽 '계산 결과'는 발문을 기반으로 한 다음 콘텐츠 작업용 1차 검산값이며 최종 학생 해설과 엔진 게이트를 대신하지 않는다. 연결/격차 P=문제, S=해설.

| 번호 | 단원 | 표시 정답 | 계산 결과 | 연결 SVG | 기출 역할 격차 | P 계획 |
|---:|---|---|---|---|---|---|
| 1 | 다항식의 연산 | ② | 5 | — | — | — |
| 2 | 순열과 조합 | ② | 480 | — | — | — |
| 3 | 순열과 조합 | ③ | 9 | — | — | — |
| 4 | 여러 가지 방정식과 부등식 | ① | 1 | — | S | — |
| 5 | 이차방정식과 이차함수 | ② | 7 | — | S | — |
| 6 | 여러 가지 방정식과 부등식 | ④ | 27 | — | S | — |
| 7 | 행렬과 그 연산 | ③ | 10 | — | — | — |
| 8 | 이차방정식과 이차함수 | ③ | 6 | — | S | — |
| 9 | 이차방정식과 이차함수 | ⑤ | 5 | — | S | — |
| 10 | 여러 가지 방정식과 부등식 | ③ | 8 | — | S | — |
| 11 | 합의 법칙과 곱의 법칙 | ③ | 89 | — | P,S | NK-01 |
| 12 | 행렬과 그 연산 | ⑤ | 3 | — | — | — |
| 13 | 이차방정식과 이차함수 | ② | −4 | — | S | — |
| 14 | 여러 가지 방정식과 부등식 | ⑤ | 26 | — | — | — |
| 15 | 순열과 조합 | ⑤ | 336 | — | — | — |
| 16 | 행렬과 그 연산 | ① | 1 | — | — | — |
| 17 | 여러 가지 방정식과 부등식 | ① | 1 | — | S | — |
| 18 | 이차방정식과 이차함수 | ④ | −5 | — | P,S | NK-02 |
| 19 | 여러 가지 방정식과 부등식 | ② | 11 | — | S | — |
| 20 | 이차방정식과 이차함수 | ④ | 8 | — | P,S | NK-03 |
| 21 | 항등식과 나머지 정리 | 6 | 6 | — | — | — |
| 22 | 여러 가지 방정식과 부등식 | 3 | 3 | — | S | — |
| 23 | 순열과 조합 | 258 | 258 | — | — | — |
| 24 | 행렬과 그 연산 | 4 | 4 | — | — | — |

## 현행 연결 SVG 실물 확인

| 번호 | 역할 | SVG | SHA | 관찰 |
|---|---|---|---|---|
| — | — | 현재 연결 SVG 없음 | — | — |

## 기출 대비 그림 역할 1:1 매핑

**주의:** 원문 `sourceQid`와 `provenance`가 없어 이 비교는 원본의 같은 번호 기준 임시 교차표다. 다음 작업자가 문제 내용의 동일 계열 여부를 다시 확인해야 한다.

| 번호 | 역할 | 기출 그림 경로 | SHA | 계획 상태 |
|---:|---|---|---|---|
| 4 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q4-solution.svg` | `05cd6fe51a78269860883bb8867711bd7a2bafab` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 5 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q5-solution-v2.svg` | `d7e4c3f4151c919384d481b26b766d134e92c883` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 6 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q6-solution.svg` | `977dd4dc2c8d01b6691f60f3ed8a58a90c68e674` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 8 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q8-solution.svg` | `a7b4b5d41b8dc3aca7c07413b99156b11145728c` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 9 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q9-solution-v2.svg` | `1cc47d581ffae8fa843d35ecbfe68ba5548b5606` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 10 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q10-solution.svg` | `ab8432570e6c4a78fc8683b352ceb5669a252bf8` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 11 | P | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q11-problem-v2.svg` | `d92e454b071d4dd86ef4fe33df37720d19872149` | NK-01 (UNLINTED) |
| 11 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q11-solution.svg` | `6afde3f49b0fb75edf7b0c85df1677ff459dac98` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 13 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q13-solution-v2.svg` | `7a8dc4b577d26664589eba9f9c8b1b99d335fcb1` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 17 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q17-solution.svg` | `d344ea57974095079d04a741db41982c4babbb13` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 18 | P | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q18-problem-v2.svg` | `3b1ca147e45c7c21072fd06c10a33e8555f679db` | NK-02 (UNLINTED) |
| 18 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q18-solution.svg` | `574c475f2f251254d2729981a0396cf249b2f172` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 19 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q19-solution-v2.svg` | `e5c877f83f3beb9e619cd3926efce8e6b366a51c` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 20 | P | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q20-problem-v2.svg` | `69b16736b82c3bf65760666f1eeac24d731cddc8` | NK-03 (UNLINTED) |
| 20 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q20-solution.svg` | `a2d65b1330ebfd192c4475d14293f8c197d00e81` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |
| 22 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q22-solution.svg` | `acd24d12176ae745abf354e6b1abb2a5a879a1d2` | CONTENT_BLOCKED__SOLUTION_REPAIR_FIRST |

## 다음 조치

1. 본문 1~24번 전체의 실제 단계별 해설 작성. [내용 교정 청사진](H1_1FINAL_SIMILAR_LAST5_CONTENT_REPAIR_BLUEPRINT_20261122.md)에서 계산 뼈대와 표시 정답/선택지 재검토.
2. `level` 등 메타·원문 대응 정보를 실제 원문 근거로 보완. 소스와 채점 의미 보존.
3. P/S 그림 역할은 정본 [SVG 엔진 지침](../../../../../archive/tools/geometry-equation/production/AUTHOR_GUIDE.md)을 따라 plan lint, engine render, PNG 실물/수학검수, 게시 순으로 수행. 이 단계까지는 미실행.
