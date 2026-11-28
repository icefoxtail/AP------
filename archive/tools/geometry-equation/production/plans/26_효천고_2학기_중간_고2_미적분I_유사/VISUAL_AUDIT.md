# 26 효천고 2학기 중간 고2 미적분Ⅰ 유사 — SVG production plan 2축 감사

## 범위와 판정 기준

- 정본: `archive/exams/similar/high/h2/2mid/26_효천고_2학기_중간_고2_미적분I_유사.js`. **23문항·문제 23축·해설 23축 = 46축** 독립 감사.
- `REQUIRED` = 그래프·도형이 문제 조건을 전함, `BENEFICIAL` = 해설의 결정적 과정에 실익, `EXEMPT` = 별도 그림은 계산식 중복.
- 공식 실행형 plan **10개**: 기존 9개 보존, `q02-solution.plan.json` 1개 신규. 판정 `REQUIRED 2`(문제), `BENEFICIAL 8`(해설), `EXEMPT 36` = 46축.
- 기출 PNG/SVG, `-v2` 변형, 직접 연결 유사 SVG, 시험지 옆 레거시 plan, 공식 JSON을 **현행 유사 JS**와 각각 대조. 기출의 수치가 달라진 경우 기출의 값을 본 제작으로 복사하지 않는다.

## 문항별 문제·해설 독립 판정

| 문항 | 문제축 | 해설축 | 현행 원문·기출/변형과 공식 plan의 대조 근거 |
| --- | --- | --- | --- |
| 01 | EXEMPT | EXEMPT | 이차함수의 미분계수 `f'(1)` 단순 계산. |
| 02 | EXEMPT | **BENEFICIAL · `q02-solution.plan.json` (NEW)** | `x=-2`의 양쪽 극한을 맞추면 `a=-5`. 직선 `y=x-5`와 `y=2x-3`이 `(-2,-7)`에서 이어지는 공식 조각 그래프로 설명. 기출 q2 SVG의 `x=-1` 접합과 구별. |
| 03 | EXEMPT | EXEMPT | 근호 극한은 유리화 한 줄로 정리됨. |
| 04 | EXEMPT | EXEMPT | 점 `x=a`의 연속식 `a²+7a+6=0` 계수 대입·인수분해. |
| 05 | EXEMPT | EXEMPT | 주어진 접점 `(2,0)`의 함수값·미분계수 두 식으로 계수 산출. |
| 06 | EXEMPT | **BENEFICIAL · `q06-solution.plan.json`** | `y=2x(x+1)(x+2)`의 세 영점과 `[-1,0]`, `[-2,0]`의 롤의 정리 접점 존재. 기출 `q6-solution.svg`의 다른 삼차함수와 구별. |
| 07 | EXEMPT | **BENEFICIAL · `q07-solution.plan.json`** | 유리함수 `y=5/(2x-1)+3`의 수평 점근선 `y=3`과 수평선 교점 개수의 변화. 기출 `q7-solution-v2.svg`는 `4/(3x-2)+2`의 다른 점근선. |
| 08 | EXEMPT | EXEMPT | 유한한 극한의 상수항 소거, `m=5`, `ma=1`로 완결. |
| 09 | EXEMPT | **BENEFICIAL · `q09-solution.plan.json`** | 구간 `[-1,4]`의 아래로 볼록한 포물선 `-(x-2)²+4`, 꼭짓점 `(2,4)`와 끝점 `(-1,-5)`의 대소 비교. 기출 q9 SVG는 다른 구간·함수. |
| 10 | EXEMPT | EXEMPT | 두 다항극한으로 이차식 `2(x+2)²` 결정. |
| 11 | **REQUIRED · `q11-problem.plan.json`** | **BENEFICIAL · `q11-solution.plan.json`** | 원그림의 A·P·Q와 P의 직각, y축 교점을 알아야 거리 제곱비를 해석한다. 현행 기울기 `1/3`, 대표 `t=1`의 두 직선·직각표식은 공식 plan의 `overlays.rightAngles`. 원본 PNG의 기울기 `1/2`와 분리. 문제 설명에서 극한 정답 미노출. |
| 12 | EXEMPT | **BENEFICIAL · `q12-solution.plan.json`** | 포물선 `y=x²+5x+4`의 `P(-3,-2)`에서 직선 `y=-x-8`로 내린 최단 수선과 수선의 발 `Q(-9/2,-7/2)`을 그림으로 확인. 기출 q12 SVG의 다른 접점·직선은 미사용. |
| 13 | EXEMPT | EXEMPT | `(x-2)²` 나머지 `R(2),R'(2)` 계산, 별도 좌표 그래프 불필요. |
| 14 | EXEMPT | EXEMPT | `x=1,9` 대입 및 분자 `(x-9)(x+1)` 소거로 연속값 `f(9)` 결정. |
| 15 | EXEMPT | EXEMPT | `x=0`에서 미분계수 연결·`x=2`의 영점 제거를 조각식으로 정확히 확인; 임의 형태의 곡선 추가는 계산 반복. |
| 16 | EXEMPT | EXEMPT | 합성함수의 극한은 `f'(0)`, `f'(2)`의 곱·인수분해로 완결. |
| 17 | **REQUIRED · `q17-problem.plan.json`** | **BENEFICIAL · `q17-solution.plan.json`** | 네 선분의 열린·닫힌 끝점과 원본 PNG의 점선 안내가 문제 보기 판정의 필수 조건. 공식 plan 문제축에서 네 조각과 guides, 해설축에서 역함수 네 조각을 STACKED로 비교. 유사 SVG 제목·설명과 원본 PNG를 직접 대조. |
| 18 | EXEMPT | EXEMPT | 두 주어진 극한의 곱으로 `a=4`, 합의 극한을 계산. |
| 19 | EXEMPT | EXEMPT | 다항식 전개·도함수 항별 미분. |
| 20 | EXEMPT | EXEMPT | 평균값정리로 기울기 하한 3과 `f(6)≥17`을 산출; 등호 예 `3x-1`은 해설에 명확하여 기출 q20 SVG를 재도입할 필요 없음. |
| 21 | EXEMPT | **BENEFICIAL · `q21-solution.plan.json`** | 절댓값 분수 부분 `-1/(2+|x|)`의 두 구간 경계 `x=±2`와 바깥 상수 `-1/4`를 함께 보여 연속을 확인. |
| 22 | EXEMPT | EXEMPT | 삼차다항식의 남는 근과 `g'(1),g'(3)`를 연립해 `f(4)` 계산. |
| 23 | EXEMPT | EXEMPT | 자연수 `n=1,2,3,≥4`의 다항식 계수·차수 분류는 해설의 경우별 식으로 충분. |

## 원본·직접 연결 유사 SVG·레거시 JSON 비교

| 증거 | 실제 확인 사항 |
| --- | --- |
| 원본 `archive/assets/images/26_효천고_2학기_중간_고2_미적분I/` | 원본 PNG 2개(`q11`,`q17`)를 실제 열어 확인. 기출 해설 SVG 8개(`q2`, `q6`, `q7-v2`, `q9`, `q11`, `q12`, `q17`, `q20`)의 제목과 구조, 주요 함수·기울기를 대조. |
| 직접 연결된 유사 SVG | `_유사/q11-problem.svg`, `_유사/q17-problem.svg` 2개. q11은 수직선·축 교점, q17은 빈 점/채운 점·점선 가이드와 네 조각. 기존 SVG 파일·태그는 변경하지 않음. |
| `ORIGINAL_EXAM_PNG_CONFLICT` | q11 기출 PNG의 직선은 `y=x/2+1`, 현행 유사 JS는 `y=x/3+1`; 따라서 기출 기울기·점 좌표를 현행 도식에 쓰지 않음. q17 PNG의 열린/닫힌 네 선분은 현행 유사 SVG와 일치하는 구조이므로 없는 수치 충돌을 만들지 않음. |
| `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` | 기출 해설 q2는 `x=-1` 접합, q6은 `4x³+8x²+3x`, q7-v2는 `4/(3x-2)+2`, q9는 `[-2,3]`, q11은 기울기 `1/2`, q12는 옛 접선, q20은 `f(x)=2x-3`·`[2,7]`의 예. 현행 값과 모두 독립 구별. |
| 레거시 plan | 시험지 옆 `<stem>_plans/q11-problem.plan.json`, `q17-problem.plan.json` 2개는 읽기만. q11 레거시는 AP/PQ/QA 연결이지만 직각표식은 없고, 공식 plan은 P의 rightAngles를 명시. q17은 공식 plan이 레거시 네 조각에 원본 점선 guides를 복원. |
| 기존 공식 plan | q06·q07·q09·q11 문제/해설·q12·q17 문제/해설·q21 해설 총 9개를 보존. 발견된 스키마/내용 결함 없음. q02 해설만 공식 `piecewise-polynomial-spike-v1`로 신규 작성. |

## STATIC_FIELD_PARITY / DRAWN_FEATURE_PARITY · 독립 검산

- `STATIC_FIELD_PARITY = PASS (10/10)`: q02의 두 직선 계수·접합점, q06의 세 근 `-2,-1,0`, q07의 수평 점근선 3, q09의 구간과 꼭짓점, q11의 대표 `P=(1,4/3)`·`Q=(0,13/3)`·직각, q12의 최단수선, q17의 모든 끝점 포함 상태와 역함수 그래프, q21의 경계 `±2`를 JS/정식 JSON과 대조.
- `DRAWN_FEATURE_PARITY = STATIC_INVENTORY_PASS (10/10), ACTUAL_SVG_NOT_OBSERVED`: 좌표·직각표식·교점·점근선·수선·점선·네 조각 열린/닫힌 끝점을 필드 수준에서 독립 비교. 공식 SVG 실제 그려진 획·좌표 라벨·레이아웃은 미확인이다.
- 독립 수학 검산: q02 `a=-5`; q06 롤 조건의 양수 `k=1,2`, 합 3; q07 수평선 `t=3`일 때만 교점 0; q09 `f(2)=4`, `f(-1)=-5`; q11 `AP²=(10/9)(t+3)²`, `AQ²=9+(10t/3+1)²`, 극한 `1/10`; q12 거리 `3/√2`; q17 역함수의 `x=1⁺` 접근값 2와 `f⁻¹(-1/4)=1/4`; q21 `2a+b=-1/4`, `-2a+b=-1/4`에서 `a=0,b=-1/4` 확인. **이 대상에서 확인된 별도 `CONTENT_CONFLICT_SOURCE` 없음**.
- 전체 공식 plan JSON 및 Schema/공식 `plan-lint`: `Shallow 18/18 PASS`, `Full 18/18 PASS`(이 폴더 10/10), 실패/skip 0.
- Chromium 신규 검사: `/usr/bin/chromium` 실행 시 실제 `/usr/lib/chromium/chromium` 부재로 종료 코드 127. 공식 SVG 렌더 **`RENDER_NOT_RUN (10/10)`**, 브라우저 육안 시각 검수 `NOT_RUN`; 정적 PASS를 시각 PASS로 보고하지 않음.
- `ENGINE_CAPABILITY_PENDING`: 이번 시험지에서 확인된 별도 엔진 미지원 기능 없음. 단지 기존 SVG에 흰 배경 `<rect>`가 있다는 사유로 투명 캔버스 기능을 요청하지 않는다.
