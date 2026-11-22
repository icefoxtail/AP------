# 순천고 고1 1학기 기말 유사시험지 심층 검수

- 유사 소스: `archive/exams/similar/high/h1/1final/26_순천고_1학기_기말_고1_유사.js` (Git blob `d698008be49dc2bdc20106697d2a686f221fb5a6`)
- 기준 기출: `archive/exams/original/high/h1/1final/26_순천고_1학기_기말_고1_기출.js` (Git blob `d77036528cfac8b1f1bfac03c2226c655d9386b3`)
- 검수 기준 HEAD: `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`; 기존 JS·SVG·플랜 변경 없음
- 총 23문항, 연결 SVG 2개, 원본 대비 그림 역할 격차 9곳, 공식 PlanRefs 46개, 신규 엔진 초안 9패킷.
- 정식 PlanRef 상태: EXEMPT 45개, null 1개.
- **검수 범위:** 모든 문제의 문항·정답·해설 본문과 소스 연결 관계를 확인했고, 연결 SVG 원본을 실제 PNG로 렌더해 눈으로 확인했다. 이미지의 최종 정답성과 렌더 엔진 통과는 분리한다. 엔진 신규 렌더는 미실행.

## 판단 및 조치

기존 연결 q19 문제·해설의 좌표축·포물선 렌더 확인. 다른 9곳은 기출 해설 그림 역할이 유사본에서 빠진 상태이나 기존 정식 플랜은 EXEMPT; 독립적인 내용 필요성 재판정 후 렌더.

## 문항별 인벤토리

P=문제 그림, S=해설 그림. '격차'는 기출 원본에 같은 역할이 있으나 해당 유사본에 연결하지 않은 경우이며 모두 무조건 생산해야 한다는 뜻은 아님. 패킷 없는 GN 해설 역할은 내용 결함으로 보류.

| 문항 | 단원 | 표기 정답 | 연결 SVG | 격차 역할 | JSON 초안 | 내용 |
|---:|---|---|---|---|---|---|
| 1 | 합의 법칙과 곱의 법칙 | ② | — | — | — | 풀이/그림 검수 대상 |
| 2 | 행렬 | ⑤ | — | — | — | 풀이/그림 검수 대상 |
| 3 | 경우의 수 | ① | — | — | — | 풀이/그림 검수 대상 |
| 4 | 행렬 | ③ | — | — | — | 풀이/그림 검수 대상 |
| 5 | 순열 | ⑤ | — | — | — | 풀이/그림 검수 대상 |
| 6 | 행렬 | ② | — | — | — | 풀이/그림 검수 대상 |
| 7 | 삼차방정식 | ④ | — | — | — | 풀이/그림 검수 대상 |
| 8 | 복소수와 이차방정식 | ① | — | — | — | 풀이/그림 검수 대상 |
| 9 | 연립부등식 | ④ | — | S | NJ-01(S) | 풀이/그림 검수 대상 |
| 10 | 연립부등식 | ⑤ | — | S | NJ-02(S) | 풀이/그림 검수 대상 |
| 11 | 이차함수 | ③ | — | S | NJ-03(S) | 풀이/그림 검수 대상 |
| 12 | 조합 | ② | — | — | — | 풀이/그림 검수 대상 |
| 13 | 연립부등식 | ④ | — | S | NJ-04(S) | 풀이/그림 검수 대상 |
| 14 | 순열 | ① | — | — | — | 풀이/그림 검수 대상 |
| 15 | 이차부등식 | ③ | — | S | NJ-05(S) | 풀이/그림 검수 대상 |
| 16 | 이차함수 | ⑤ | — | S | NJ-06(S) | 풀이/그림 검수 대상 |
| 17 | 부등식 | $12$ | — | S | NJ-07(S) | 풀이/그림 검수 대상 |
| 18 | 방정식의 활용 | $6000$ | — | S | NJ-08(S) | 풀이/그림 검수 대상 |
| 19 | 이차함수 | $-6$ | P,S | — | — | 풀이/그림 검수 대상 |
| 20 | 이차함수 | $1350$원 | — | S | NJ-09(S) | 풀이/그림 검수 대상 |
| 21 | 연립방정식 | $2\sqrt{10}$ | — | — | — | 풀이/그림 검수 대상 |
| 22 | 나머지정리 | $\alpha=5,\ \beta=-3$ | — | — | — | 풀이/그림 검수 대상 |
| 23 | 경우의 수 | $120,\ 480,\ 360$ | — | — | — | 풀이/그림 검수 대상 |

## 기존 연결 SVG 시각 확인 결과

| 문항 | 역할 | 경로 | blob SHA | 확인 |
|---:|---|---|---|---|
| 19 | P | `archive/assets/images/26_순천고_1학기_기말_고1_유사/q19-problem-engine-v3.svg` | `23b20df36eb71614b174144427700ede12b7e11e` | SVG 렌더 실물 시각 확인 |
| 19 | S | `archive/assets/images/26_순천고_1학기_기말_고1_유사/q19-solution.svg` | `3dad98e282dd84f28930fba93479434bc6026221` | SVG 렌더 실물 시각 확인 |

## 기출 대비 역할 격차와 다음 단계

| 문항 | 역할 | 비교한 기출 자산 | 기존 PlanRef | 초안/보류 |
|---:|---|---|---|---|
| 9 | S | `archive/assets/images/26_순천고_1학기_기말_고1_기출/q9-solution.svg` | EXEMPT | NJ-01: DRAFT_NOT_LINTED |
| 10 | S | `archive/assets/images/26_순천고_1학기_기말_고1_기출/q10-solution-v2.svg` | EXEMPT | NJ-02: DRAFT_NOT_LINTED |
| 11 | S | `archive/assets/images/26_순천고_1학기_기말_고1_기출/q11-solution-v2.svg` | EXEMPT | NJ-03: ENGINE_SUPPORT_CHECK |
| 13 | S | `archive/assets/images/26_순천고_1학기_기말_고1_기출/q13-solution-v2.svg` | EXEMPT | NJ-04: DRAFT_NOT_LINTED |
| 15 | S | `archive/assets/images/26_순천고_1학기_기말_고1_기출/q15-solution-v2.svg` | EXEMPT | NJ-05: DRAFT_NOT_LINTED |
| 16 | S | `archive/assets/images/26_순천고_1학기_기말_고1_기출/q16-solution-v2.svg` | EXEMPT | NJ-06: DRAFT_NOT_LINTED |
| 17 | S | `archive/assets/images/26_순천고_1학기_기말_고1_기출/q17-solution-v2.svg` | EXEMPT | NJ-07: ENGINE_SUPPORT_CHECK |
| 18 | S | `archive/assets/images/26_순천고_1학기_기말_고1_기출/q18-solution-v2.svg` | EXEMPT | NJ-08: ENGINE_SUPPORT_CHECK |
| 20 | S | `archive/assets/images/26_순천고_1학기_기말_고1_기출/q20-solution-v2.svg` | EXEMPT | NJ-09: DRAFT_NOT_LINTED |

## 엔진 인계 지침

- JSON 초안 모음: `H1_1FINAL_20261122_NEXT5_PLAN_JSON_DRAFTS/manifest.json`. `item.json`, `plan.json`, `publish.json`은 초안이므로 capability lint·수학 검증·렌더·시각 QA·publish 각 단계가 모두 필수.
- 원래 공식 PlanRef의 EXEMPT 판단을 일괄 철회하지 말고 '학습에 그림이 필요한가?'를 재판정. 그림을 만들 경우에는 유사본의 숫자와 발문으로 재설계.
- 이미지 최종 수정은 엔진 담당 코덱스가 진행. 이 배치는 JS·SVG를 변경하거나 새 그림을 게시하지 않음.
