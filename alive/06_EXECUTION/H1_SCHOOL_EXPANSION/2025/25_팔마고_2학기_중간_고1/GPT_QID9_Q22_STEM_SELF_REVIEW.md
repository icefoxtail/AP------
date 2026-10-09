# 팔마고 2025 고1 2학기 중간 Q22 — 제작자 역발문·수학·Visual 자가검산

- 원본: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`, blob `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`. source 원본과 Q01~Q21 총 189 생성 후보 수정 없음.
- Primary RPM L3 `원의 방정식` (`H1-RPM-217`; 일반형 연계 `H1-RPM-218`). 실제 PT `PT_CIRCLE_EQUATION`, ACTIVE TPL `TM_CIRCLE_CIRCUMCIRCLE`.
- 원본 외접원의 기하 핵심: 직각을 이루는 두 직선의 교점을 O라 놓으면 빗변 AB가 외접원 지름이며 중심은 AB 중점. A는 수치·교점 숙달, B는 평행이동·일반형·좌표축 교점, C는 역매개변수·통과점 판정.
- 문제용 Visual: 9/9 `VISUAL_EXEMPT` — 전부 세 직선의 완결된 수식이 있고 선행 힌트를 노출하지 않음. 해설용 Visual: 9/9 `VISUAL_REQUIRED / ADD` — 직각마크, 실제 원과 빗변 AB, 중점 M의 위치를 시각적으로 표시.
- Python Fraction 기반으로 아홉 세 꼭짓점의 직각 내적=0, 중심=AB 중점, 중심에서 세 꼭짓점까지의 제곱거리 일치 전수 검산. SVG 자체는 계산된 점 좌표를 스케일링해 결정적으로 작성. 실제 Chromium 학생 해설지 렌더는 하지 않았으며 `NOT_TESTED`.

| 슬롯 | UID | O | A | B | 중심 M | r² | 자기 역발문 |
|---|---|---|---|---|---|---|---|
| A1 | `ALITE-PALMA25-2MID-Q22-A1` | `0,0` | `8,0` | `0,8` | `4,4` | 32 | KEEP |
| A2 | `ALITE-PALMA25-2MID-Q22-A2` | `0,0` | `4,2` | `-2,4` | `1,3` | 10 | KEEP |
| A3 | `ALITE-PALMA25-2MID-Q22-A3` | `1,1` | `5,5` | `-1,3` | `2,4` | 10 | KEEP |
| B1 | `ALITE-PALMA25-2MID-Q22-B1` | `2,-1` | `6,1` | `0,3` | `3,2` | 10 | KEEP |
| B2 | `ALITE-PALMA25-2MID-Q22-B2` | `1,2` | `4,2` | `1,4` | `2.5,3` | 3.25 | KEEP |
| B3 | `ALITE-PALMA25-2MID-Q22-B3` | `2,2` | `5,5` | `-1,5` | `2,5` | 9 | KEEP |
| C1 | `ALITE-PALMA25-2MID-Q22-C1` | `0,0` | `10,0` | `0,10` | `5,5` | 50 | KEEP |
| C2 | `ALITE-PALMA25-2MID-Q22-C2` | `0,0` | `8,4` | `-4,8` | `2,6` | 40 | KEEP |
| C3 | `ALITE-PALMA25-2MID-Q22-C3` | `0,0` | `2,1` | `-1,2` | `0.5,1.5` | 2.5 | KEEP |

## 자체 검토
- 9개 학생 발문은 정확한 세 직선과 목표량을 모두 포함하며 추가 직각/빗변 힌트를 본문에 주지 않음. 각 해설은 수직 확인→교점→빗변의 중점→반지름→외접원 식의 결정 논리를 따른다.
- B2 일반형 상수항 12 직접 전개, B3 원과 y축의 교점 두 개 직접 검산. C1은 k>0의 양의 해, C2는 중심 x좌표 조건, C3은 점(1,3)의 원 위 대입으로 각각 k를 정확히 결정한다.
- 시각자료 SVG 9개는 problem 이미지와 분리된 해설 전용이다. 모든 SVG에는 실제 수학 점 data 좌표·circle 중심/반지름 속성·viewBox·title·desc·흰 배경을 삽입하고, 독립 수치 검증값과 결속했다.
- `KEEP 9 / REVISED 0 / HOLD 0`은 제작자 발문 역검토·계산결과이며 별도 GPT 공개답 검수 PASS가 아니다. 신규 Consumer/index 0/9, Chrome NOT_TESTED, 신규 main RELEASE NOT_DONE.
