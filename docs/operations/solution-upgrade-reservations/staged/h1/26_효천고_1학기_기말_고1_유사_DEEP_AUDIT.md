# 효천고 고1 1학기 기말 유사시험지 심층 검수

- 유사 소스: `archive/exams/similar/high/h1/1final/26_효천고_1학기_기말_고1_유사.js` (Git blob `a5ae7d76d892dcf31751b8f0ec3d77417e1290eb`)
- 기준 기출: `archive/exams/original/high/h1/1final/26_효천고_1학기_기말_고1_기출.js` (Git blob `a0db3e874457f6a798bd61b9036b1cc719b632ed`)
- 검수 기준 HEAD: `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`; 기존 JS·SVG·플랜 변경 없음
- 총 26문항, 연결 SVG 7개, 원본 대비 그림 역할 격차 7곳, 공식 PlanRefs 52개, 신규 엔진 초안 7패킷.
- 정식 PlanRef 상태: EXEMPT 50개, null 2개.
- **검수 범위:** 모든 문제의 문항·정답·해설 본문과 소스 연결 관계를 확인했고, 연결 SVG 원본을 실제 PNG로 렌더해 눈으로 확인했다. 이미지의 최종 정답성과 렌더 엔진 통과는 분리한다. 엔진 신규 렌더는 미실행.

## 판단 및 조치

연결 7개와 원본 그림의 시각 비교. q10의 문제·해설, q5 해설, q11 해설 등은 원본 단순 복제가 아니라 유사본 값에 맞는 재생성이 필요. q26 경우의 수 독립 대조=126.

## 문항별 인벤토리

P=문제 그림, S=해설 그림. '격차'는 기출 원본에 같은 역할이 있으나 해당 유사본에 연결하지 않은 경우이며 모두 무조건 생산해야 한다는 뜻은 아님. 패킷 없는 GN 해설 역할은 내용 결함으로 보류.

| 문항 | 단원 | 표기 정답 | 연결 SVG | 격차 역할 | JSON 초안 | 내용 |
|---:|---|---|---|---|---|---|
| 1 | 행렬 | ② | — | — | — | 풀이/그림 검수 대상 |
| 2 | 순열과 조합 | ⑤ | — | — | — | 풀이/그림 검수 대상 |
| 3 | 행렬 | ③ | — | — | — | 풀이/그림 검수 대상 |
| 4 | 이차함수 | ① | S | — | — | 풀이/그림 검수 대상 |
| 5 | 이차부등식 | ② | P | S | NJ-28(S) | 풀이/그림 검수 대상 |
| 6 | 복소수와 이차방정식 | ③ | — | — | — | 풀이/그림 검수 대상 |
| 7 | 복소수와 이차방정식 | ⑤ | — | S | NJ-29(S) | 풀이/그림 검수 대상 |
| 8 | 이차함수 | ④ | S | — | — | 풀이/그림 검수 대상 |
| 9 | 합의 법칙과 곱의 법칙 | ② | — | — | — | 풀이/그림 검수 대상 |
| 10 | 합의 법칙과 곱의 법칙 | ⑤ | — | P,S | NJ-30(P),NJ-31(S) | 풀이/그림 검수 대상 |
| 11 | 연립부등식 | ③ | — | S | NJ-32(S) | 풀이/그림 검수 대상 |
| 12 | 순열 | ⑤ | — | — | — | 풀이/그림 검수 대상 |
| 13 | 이차부등식 | ③ | S | — | — | 풀이/그림 검수 대상 |
| 14 | 합의 법칙과 곱의 법칙 | ④ | — | — | — | 풀이/그림 검수 대상 |
| 15 | 합의 법칙과 곱의 법칙 | ① | — | — | — | 풀이/그림 검수 대상 |
| 16 | 행렬 | ① | — | — | — | 풀이/그림 검수 대상 |
| 17 | 행렬 | ④ | — | — | — | 풀이/그림 검수 대상 |
| 18 | 이차함수 | ② | — | S | NJ-33(S) | 풀이/그림 검수 대상 |
| 19 | 행렬 | $\begin{pmatrix}4\\-8\end{pmatrix}$ | — | — | — | 풀이/그림 검수 대상 |
| 20 | 복소수와 이차방정식 | $-6,\ -3i$ | — | — | — | 풀이/그림 검수 대상 |
| 21 | 삼차방정식 | $1,\ 2+3i,\ 2-3i$ | — | — | — | 풀이/그림 검수 대상 |
| 22 | 절댓값 부등식 | $-7$ | S | — | — | 풀이/그림 검수 대상 |
| 23 | 연립부등식 | $7<a\le9$ | — | S | NJ-34(S) | 풀이/그림 검수 대상 |
| 24 | 이차함수 | 최댓값 $7$, $x=0$ | P,S | — | — | 풀이/그림 검수 대상 |
| 25 | 행렬 | $5$ | — | — | — | 풀이/그림 검수 대상 |
| 26 | 조합 | $126$ | — | — | — | 풀이/그림 검수 대상 |

## 기존 연결 SVG 시각 확인 결과

| 문항 | 역할 | 경로 | blob SHA | 확인 |
|---:|---|---|---|---|
| 4 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q4-solution.svg` | `b1938c41ee2323aea2e2ded863b41fa0e6b1928e` | SVG 렌더 실물 시각 확인 |
| 5 | P | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q05-problem-readable-v2.svg` | `0a9719e69e324736767d81bdfa34a65b1e2a39ea` | SVG 렌더 실물 시각 확인 |
| 8 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q8-solution.svg` | `5ae45791a88b1b7c9a3673b651994be0052102d7` | SVG 렌더 실물 시각 확인 |
| 13 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q13-solution.svg` | `517cf038b1562261bde861d7607ea6274c514b5e` | SVG 렌더 실물 시각 확인 |
| 22 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q22-solution.svg` | `67e15d81e0c19c80dedca691b1b13f909ee22e57` | SVG 렌더 실물 시각 확인 |
| 24 | P | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q24-problem-readable-v2.svg` | `1f1c89c97423347bbc029bedcb7c37e16b4d356a` | SVG 렌더 실물 시각 확인 |
| 24 | S | `archive/assets/images/26_효천고_1학기_기말_고1_유사/q24-solution.svg` | `610b30aec85e994e1d77f6ddd82e9ee08a4dc5b3` | SVG 렌더 실물 시각 확인 |

## 기출 대비 역할 격차와 다음 단계

| 문항 | 역할 | 비교한 기출 자산 | 기존 PlanRef | 초안/보류 |
|---:|---|---|---|---|
| 5 | S | `archive/assets/images/26_효천고_1학기_기말_고1_기출/q5-solution.svg` | EXEMPT | NJ-28: DRAFT_NOT_LINTED |
| 7 | S | `archive/assets/images/26_효천고_1학기_기말_고1_기출/q7-solution.svg` | EXEMPT | NJ-29: DRAFT_NOT_LINTED |
| 10 | P | `archive/assets/images/26_효천고_1학기_기말_고1_기출/q10.png` | EXEMPT | NJ-30: ENGINE_SUPPORT_CHECK |
| 10 | S | `archive/assets/images/26_효천고_1학기_기말_고1_기출/q10-solution.svg` | EXEMPT | NJ-31: ENGINE_SUPPORT_CHECK |
| 11 | S | `archive/assets/images/26_효천고_1학기_기말_고1_기출/q11-solution-v2.svg` | EXEMPT | NJ-32: DRAFT_NOT_LINTED |
| 18 | S | `archive/assets/images/26_효천고_1학기_기말_고1_기출/q18-solution-v2.svg` | EXEMPT | NJ-33: ENGINE_SUPPORT_CHECK |
| 23 | S | `archive/assets/images/26_효천고_1학기_기말_고1_기출/q23-solution-v2.svg` | EXEMPT | NJ-34: DRAFT_NOT_LINTED |

## 엔진 인계 지침

- JSON 초안 모음: `H1_1FINAL_20261122_NEXT5_PLAN_JSON_DRAFTS/manifest.json`. `item.json`, `plan.json`, `publish.json`은 초안이므로 capability lint·수학 검증·렌더·시각 QA·publish 각 단계가 모두 필수.
- 원래 공식 PlanRef의 EXEMPT 판단을 일괄 철회하지 말고 '학습에 그림이 필요한가?'를 재판정. 그림을 만들 경우에는 유사본의 숫자와 발문으로 재설계.
- 이미지 최종 수정은 엔진 담당 코덱스가 진행. 이 배치는 JS·SVG를 변경하거나 새 그림을 게시하지 않음.
