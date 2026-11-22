# 강남여고 유사1 고1 1학기 기말 유사시험지 심층 검수

- 유사 소스: `archive/exams/similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사1.js` (Git blob `7a8483e1cafae7e27832fe47a2da008524501152`)
- 기준 기출: `archive/exams/original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js` (Git blob `5a2f970c4c1dfcf7045a6e528356f4dc473b2471`)
- 검수 기준 HEAD: `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`; 기존 JS·SVG·플랜 변경 없음
- 총 24문항, 연결 SVG 0개, 원본 대비 그림 역할 격차 16곳, 공식 PlanRefs 0개, 신규 엔진 초안 3패킷.
- 정식 PlanRef 상태: 없음.
- **검수 범위:** 모든 문제의 문항·정답·해설 본문과 소스 연결 관계를 확인했고, 연결 SVG 원본을 실제 PNG로 렌더해 눈으로 확인했다. 이미지의 최종 정답성과 렌더 엔진 통과는 분리한다. 엔진 신규 렌더는 미실행.

## 판단 및 조치

24문항의 solution이 모두 특정 풀이가 아닌 `[JS 기준 풀이]` 등 일반 임시문구. 원본과 달리 연결 SVG가 하나도 없다. 16역할의 시각 격차 중 해설 역할 13개는 풀이 교정 전 엔진 설계를 보류. 문제 역할 3개만 조건 기반 초안으로 별도 격리. 정답값은 수기 재계산상 일치해도 이 문서를 '해설 완료'로 해석하지 말 것.

## 문항별 인벤토리

P=문제 그림, S=해설 그림. '격차'는 기출 원본에 같은 역할이 있으나 해당 유사본에 연결하지 않은 경우이며 모두 무조건 생산해야 한다는 뜻은 아님. 패킷 없는 GN 해설 역할은 내용 결함으로 보류.

| 문항 | 단원 | 표기 정답 | 연결 SVG | 격차 역할 | JSON 초안 | 내용 |
|---:|---|---|---|---|---|---|
| 1 | 다항식의 연산 | ② | — | — | — | 풀이 원문 교정 필요 |
| 2 | 순열과 조합 | ④ | — | — | — | 풀이 원문 교정 필요 |
| 3 | 순열과 조합 | ④ | — | — | — | 풀이 원문 교정 필요 |
| 4 | 여러 가지 방정식과 부등식 | ⑤ | — | S | — | 풀이 원문 교정 필요 |
| 5 | 이차방정식과 이차함수 | ④ | — | S | — | 풀이 원문 교정 필요 |
| 6 | 여러 가지 방정식과 부등식 | ④ | — | S | — | 풀이 원문 교정 필요 |
| 7 | 행렬과 그 연산 | ⑤ | — | — | — | 풀이 원문 교정 필요 |
| 8 | 이차방정식과 이차함수 | ④ | — | S | — | 풀이 원문 교정 필요 |
| 9 | 이차방정식과 이차함수 | ② | — | S | — | 풀이 원문 교정 필요 |
| 10 | 여러 가지 방정식과 부등식 | ⑤ | — | S | — | 풀이 원문 교정 필요 |
| 11 | 합의 법칙과 곱의 법칙 | ③ | — | P,S | NJ-35(P) | 풀이 원문 교정 필요 |
| 12 | 행렬과 그 연산 | ① | — | — | — | 풀이 원문 교정 필요 |
| 13 | 이차방정식과 이차함수 | ⑤ | — | S | — | 풀이 원문 교정 필요 |
| 14 | 여러 가지 방정식과 부등식 | ③ | — | — | — | 풀이 원문 교정 필요 |
| 15 | 순열과 조합 | ③ | — | — | — | 풀이 원문 교정 필요 |
| 16 | 행렬과 그 연산 | ① | — | — | — | 풀이 원문 교정 필요 |
| 17 | 여러 가지 방정식과 부등식 | ② | — | S | — | 풀이 원문 교정 필요 |
| 18 | 이차방정식과 이차함수 | ③ | — | P,S | NJ-36(P) | 풀이 원문 교정 필요 |
| 19 | 여러 가지 방정식과 부등식 | ③ | — | S | — | 풀이 원문 교정 필요 |
| 20 | 이차방정식과 이차함수 | ① | — | P,S | NJ-37(P) | 풀이 원문 교정 필요 |
| 21 | 항등식과 나머지 정리 | $a=-7,\ b=6$, 세 근의 곱은 $-6$ | — | — | — | 풀이 원문 교정 필요 |
| 22 | 여러 가지 방정식과 부등식 | $-4 \le a \le 2$, 7개 | — | S | — | 풀이 원문 교정 필요 |
| 23 | 순열과 조합 | 180 | — | — | — | 풀이 원문 교정 필요 |
| 24 | 행렬과 그 연산 | -16 | — | — | — | 풀이 원문 교정 필요 |

## 기존 연결 SVG 시각 확인 결과

| 문항 | 역할 | 경로 | blob SHA | 확인 |
|---:|---|---|---|---|
| — | — | 연결 없음 | — | — |

## 기출 대비 역할 격차와 다음 단계

| 문항 | 역할 | 비교한 기출 자산 | 기존 PlanRef | 초안/보류 |
|---:|---|---|---|---|
| 4 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q4-solution.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 5 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q5-solution-v2.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 6 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q6-solution.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 8 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q8-solution.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 9 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q9-solution-v2.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 10 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q10-solution.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 11 | P | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q11-problem-v2.svg` | 정식 PlanRef 없음 | NJ-35: ENGINE_SUPPORT_CHECK |
| 11 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q11-solution.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 13 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q13-solution-v2.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 17 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q17-solution.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 18 | P | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q18-problem-v2.svg` | 정식 PlanRef 없음 | NJ-36: ENGINE_SUPPORT_CHECK |
| 18 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q18-solution.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 19 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q19-solution-v2.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 20 | P | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q20-problem-v2.svg` | 정식 PlanRef 없음 | NJ-37: ENGINE_SUPPORT_CHECK |
| 20 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q20-solution.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |
| 22 | S | `archive/assets/images/25_강남여고_1학기_기말_고1_기출c/q22-solution.svg` | 정식 PlanRef 없음 | CONTENT_BLOCKED |

## 엔진 인계 지침

- JSON 초안 모음: `H1_1FINAL_20261122_NEXT5_PLAN_JSON_DRAFTS/manifest.json`. `item.json`, `plan.json`, `publish.json`은 초안이므로 capability lint·수학 검증·렌더·시각 QA·publish 각 단계가 모두 필수.
- 원래 공식 PlanRef의 EXEMPT 판단을 일괄 철회하지 말고 '학습에 그림이 필요한가?'를 재판정. 그림을 만들 경우에는 유사본의 숫자와 발문으로 재설계.
- 이미지 최종 수정은 엔진 담당 코덱스가 진행. 이 배치는 JS·SVG를 변경하거나 새 그림을 게시하지 않음.
