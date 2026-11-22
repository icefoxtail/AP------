# 팔마고 고1 1학기 기말 유사시험지 심층 검수

- 유사 소스: `archive/exams/similar/high/h1/1final/26_팔마고_1학기_기말_고1_유사.js` (Git blob `64e4e805353a943a70b9e4fdd2ac844ad3a50763`)
- 기준 기출: `archive/exams/original/high/h1/1final/26_팔마고_1학기_기말_고1_기출.js` (Git blob `fee370c78f6802ad7ba3671f7c0b460bcb50162c`)
- 검수 기준 HEAD: `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`; 기존 JS·SVG·플랜 변경 없음
- 총 22문항, 연결 SVG 3개, 원본 대비 그림 역할 격차 13곳, 공식 PlanRefs 44개, 신규 엔진 초안 13패킷.
- 정식 PlanRef 상태: EXEMPT 44개.
- **검수 범위:** 모든 문제의 문항·정답·해설 본문과 소스 연결 관계를 확인했고, 연결 SVG 원본을 실제 PNG로 렌더해 눈으로 확인했다. 이미지의 최종 정답성과 렌더 엔진 통과는 분리한다. 엔진 신규 렌더는 미실행.

## 판단 및 조치

연결 3개 및 원본 도형 비교. q13·q15·q22의 문제 그림을 특히 발문 및 풀이 숫자에 맞추어 재설계. 경우의 수 일부 계산 독립 대조: q15=3264, q16=102, q17=13.

## 문항별 인벤토리

P=문제 그림, S=해설 그림. '격차'는 기출 원본에 같은 역할이 있으나 해당 유사본에 연결하지 않은 경우이며 모두 무조건 생산해야 한다는 뜻은 아님. 패킷 없는 GN 해설 역할은 내용 결함으로 보류.

| 문항 | 단원 | 표기 정답 | 연결 SVG | 격차 역할 | JSON 초안 | 내용 |
|---:|---|---|---|---|---|---|
| 1 | 순열과 조합 | ③ | — | — | — | 풀이/그림 검수 대상 |
| 2 | 행렬과 그 연산 | ② | — | — | — | 풀이/그림 검수 대상 |
| 3 | 이차방정식과 이차함수 | ⑤ | S | — | — | 풀이/그림 검수 대상 |
| 4 | 이차방정식과 이차함수 | ② | S | — | — | 풀이/그림 검수 대상 |
| 5 | 합의 법칙과 곱의 법칙 | ⑤ | — | — | — | 풀이/그림 검수 대상 |
| 6 | 여러 가지 방정식과 부등식 | ③ | S | — | — | 풀이/그림 검수 대상 |
| 7 | 행렬과 그 연산 | ① | — | — | — | 풀이/그림 검수 대상 |
| 8 | 여러 가지 방정식과 부등식 | ① | — | S | NJ-15(S) | 풀이/그림 검수 대상 |
| 9 | 여러 가지 방정식과 부등식 | ③ | — | S | NJ-16(S) | 풀이/그림 검수 대상 |
| 10 | 순열과 조합 | ⑤ | — | — | — | 풀이/그림 검수 대상 |
| 11 | 순열과 조합 | ④ | — | — | — | 풀이/그림 검수 대상 |
| 12 | 여러 가지 방정식과 부등식 | ② | — | S | NJ-17(S) | 풀이/그림 검수 대상 |
| 13 | 이차방정식과 이차함수 | ② | — | P,S | NJ-18(P),NJ-19(S) | 풀이/그림 검수 대상 |
| 14 | 여러 가지 방정식과 부등식 | ① | — | S | NJ-20(S) | 풀이/그림 검수 대상 |
| 15 | 순열과 조합 | ⑤ | — | P | NJ-21(P) | 풀이/그림 검수 대상 |
| 16 | 합의 법칙과 곱의 법칙 | ① | — | — | — | 풀이/그림 검수 대상 |
| 17 | 여러 가지 방정식과 부등식 | ⑤ | — | S | NJ-22(S) | 풀이/그림 검수 대상 |
| 18 | 이차방정식과 이차함수 | ③ | — | S | NJ-23(S) | 풀이/그림 검수 대상 |
| 19 | 순열과 조합 | $88$ | — | — | — | 풀이/그림 검수 대상 |
| 20 | 이차방정식과 이차함수 | $20$ | — | S | NJ-24(S) | 풀이/그림 검수 대상 |
| 21 | 여러 가지 방정식과 부등식 | 1) $-0.02x^2+9x-400\ge500$
2) $150\le x\le300$, 최소 $150$개 | — | S | NJ-25(S) | 풀이/그림 검수 대상 |
| 22 | 이차방정식과 이차함수 | $\dfrac{9\sqrt3}{2}$ | — | P,S | NJ-26(P),NJ-27(S) | 풀이/그림 검수 대상 |

## 기존 연결 SVG 시각 확인 결과

| 문항 | 역할 | 경로 | blob SHA | 확인 |
|---:|---|---|---|---|
| 3 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_유사/q3-solution.svg` | `bfe481c9b7f89ea698e5acb0ed6a0920846efafc` | SVG 렌더 실물 시각 확인 |
| 4 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_유사/q4-solution.svg` | `18b4ea417649f5f01c3a499fc2ca755cb04e7bbe` | SVG 렌더 실물 시각 확인 |
| 6 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_유사/q6-solution.svg` | `2489701ae1c0f4300fb0e1222723f5c4b10a975f` | SVG 렌더 실물 시각 확인 |

## 기출 대비 역할 격차와 다음 단계

| 문항 | 역할 | 비교한 기출 자산 | 기존 PlanRef | 초안/보류 |
|---:|---|---|---|---|
| 8 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q8-solution.svg` | EXEMPT | NJ-15: DRAFT_NOT_LINTED |
| 9 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q9-solution.svg` | EXEMPT | NJ-16: DRAFT_NOT_LINTED |
| 12 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q12-solution-v2.svg` | EXEMPT | NJ-17: DRAFT_NOT_LINTED |
| 13 | P | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q13.png` | EXEMPT | NJ-18: ENGINE_SUPPORT_CHECK |
| 13 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q13-solution-v2.svg` | EXEMPT | NJ-19: DRAFT_NOT_LINTED |
| 14 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q14-solution-v2.svg` | EXEMPT | NJ-20: DRAFT_NOT_LINTED |
| 15 | P | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q15.png` | EXEMPT | NJ-21: ENGINE_SUPPORT_CHECK |
| 17 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q17-solution-v2.svg` | EXEMPT | NJ-22: ENGINE_SUPPORT_CHECK |
| 18 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q18-solution-v2.svg` | EXEMPT | NJ-23: DRAFT_NOT_LINTED |
| 20 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q20-solution-v2.svg` | EXEMPT | NJ-24: ENGINE_SUPPORT_CHECK |
| 21 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q21-solution-v2.svg` | EXEMPT | NJ-25: ENGINE_SUPPORT_CHECK |
| 22 | P | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q22.png` | EXEMPT | NJ-26: ENGINE_SUPPORT_CHECK |
| 22 | S | `archive/assets/images/26_팔마고_1학기_기말_고1_기출/q22-solution-v2.svg` | EXEMPT | NJ-27: DRAFT_NOT_LINTED |

## 엔진 인계 지침

- JSON 초안 모음: `H1_1FINAL_20261122_NEXT5_PLAN_JSON_DRAFTS/manifest.json`. `item.json`, `plan.json`, `publish.json`은 초안이므로 capability lint·수학 검증·렌더·시각 QA·publish 각 단계가 모두 필수.
- 원래 공식 PlanRef의 EXEMPT 판단을 일괄 철회하지 말고 '학습에 그림이 필요한가?'를 재판정. 그림을 만들 경우에는 유사본의 숫자와 발문으로 재설계.
- 이미지 최종 수정은 엔진 담당 코덱스가 진행. 이 배치는 JS·SVG를 변경하거나 새 그림을 게시하지 않음.
