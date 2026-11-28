# 26 팔마고 2학기 중간 고2 미적분Ⅰ 유사 — SVG production plan 2축 감사

## 범위와 판정 방법

- 정본: `archive/exams/similar/high/h2/2mid/26_팔마고_2학기_중간_고2_미적분I_유사.js`. **21문항·문제 21축·해설 21축 = 42축**을 개별 판정했다.
- `REQUIRED` = 시각 자료 없이는 발문의 정보가 누락됨; `BENEFICIAL` = 해설의 결정적 관계를 이해시키는 데 실익이 있음; `EXEMPT` = 풀이식·본문만으로 정보가 완결되고 그림은 중복임.
- 공식 plan **8개**: 기존 7개 보존 + 신규 `q09-solution.plan.json` 1개. 판정 집계 `REQUIRED 1`(문제), `BENEFICIAL 7`(해설), `EXEMPT 34` = 42축. 공식 plan은 1문제축·7해설축이며 EXEMPT 또는 미지원 상태 파일을 제작 plan 수에 포함하지 않았다.
- 모든 표의 기준은 **현행 유사 JS**다. 원본 PNG·SVG·SVG 변형본은 원형과 제작 의도를 확인하는 비교 증거이지 값의 정본이 아니다.

## 문항별 문제·해설 독립 판정

| 문항 | 문제축 | 해설축 | 원문·변형·그림 근거와 공식 plan |
| --- | --- | --- | --- |
| 01 | EXEMPT | EXEMPT | 포물선 위 `(1,6)`의 접선 기울기 `-2(1)+10`을 도함수로 직접 계산. |
| 02 | EXEMPT | EXEMPT | 세 극한의 존재·부존재는 발산 방향, 다항식 대입, 유리화로 바로 판정. |
| 03 | EXEMPT | EXEMPT | 인수 `(x-3)`의 약분으로 끝나는 단일 극한. |
| 04 | EXEMPT | EXEMPT | `x=2`의 연속·도함수 연립으로 `a=0,b=-1`; 두 가지가 결국 같은 `y=x²`라 별도 그림은 계산 중복. |
| 05 | EXEMPT | EXEMPT | 이차식의 `f(1)=0`, `f'(1)=3`, `f(0)=4` 계수 결정만 사용. |
| 06 | EXEMPT | EXEMPT | `x=2`의 절댓값 꺾임 여부 세 식을 국소적인 대수식으로 구별. |
| 07 | EXEMPT | **BENEFICIAL · `q07-solution.plan.json`** | `a=12`의 감소 삼차함수, 구간 `[0,3]`의 할선·접선 기울기와 보기 ㄱ~ㄷ을 판정하는 기존 정식 graph plan 보존. |
| 08 | EXEMPT | EXEMPT | 도함수의 판별식 `a²-6a≤0`과 정수 개수 계산으로 충분. |
| 09 | EXEMPT | **BENEFICIAL · `q09-solution.plan.json` (NEW)** | 원문 상·하 경계 `-3x²+4x`, `3x²+4x`를 같은 축에 그리고 공통 접선 `y=4x`를 보여 조임정리를 설명. 실제 미지 함수 `f`의 곡선은 임의로 만들지 않음. |
| 10 | EXEMPT | EXEMPT | 이차함수의 중근과 `g`의 y축 대칭으로 계수 산출. |
| 11 | EXEMPT | EXEMPT | 다항식의 `(x-1)²` 나머지는 `R(1),R'(1)`로 계산. |
| 12 | EXEMPT | EXEMPT | 무한대 최고차항 계수와 `x=-3`의 2중근을 식으로 확인. |
| 13 | EXEMPT | EXEMPT | 함수방정식의 차분과 `f'(0)`으로 `f'(1)` 결정. |
| 14 | EXEMPT | EXEMPT | 반지름 `0<t<4`의 정수 격자점 유입 시점은 제곱합 목록 `1,2,4,5,8,9,10,13`을 열거하면 완결. 실측 배치 그림이 요구되는 문제가 아님. |
| 15 | EXEMPT | **BENEFICIAL · `q15-solution.plan.json`** | 짝함수·4주기 함수의 **가능한 대표 개형**을 정수점 값 `4,-2,3,-2,4,-2,3,-2,4`로 연결하여 8개 인접 구간의 영점 존재 확인. 구체 함수가 유일하다고 주장하지 않음. 기출 `q15-solution-v2.svg`와 구간·값 충돌을 분리. |
| 16 | EXEMPT | EXEMPT | 다항함수 미분계수의 두 관계를 연립하는 문제로 시각 추가정보 없음. |
| 17 | EXEMPT | **BENEFICIAL · `q17-solution.plan.json`** | 연속 조각 포물선의 양쪽 꼭짓점·경계 `y=1,6,10`과 수평선 교점 개수 변화. 현행 `a=5,b=5`; 기출 `q17-solution.svg`의 옛 `a=3,b=3`과 구분. |
| 18 | EXEMPT | **BENEFICIAL · `q18-solution.plan.json`** | 미분가능 조건으로 정한 `a=0,b=12`, `x=2` 매끈한 접합과 극솟값 `(0,2)`를 그래프로 확인. 기출 `q18-solution.svg`의 다른 접합·계수는 사용하지 않음. |
| 19 | EXEMPT | **BENEFICIAL · `q19-solution.plan.json`** | `g(x)=|x-5|`의 `x=5` 대칭 V자 그래프에서 같은 거리 `±h`의 함수값 동일함을 설명. 기출 `q19-solution.svg`는 `x=3` 기준인 다른 변형. |
| 20 | **REQUIRED · `q20-problem.plan.json`** | **BENEFICIAL · `q20-solution.plan.json`** | 발문의 원 `x²+y²=20`, 포물선 `y=x²`, 제1사분면 A, 이동 직선 `y=tx`, P·Q 및 `PQ` 선분은 그림 필수. 공식 엔진에서 `t=1` 한 대표 배치로 정확한 원·곡선 교점 작도; 해설에서 반지름과 `OQ`를 추가 비교. 문제축 설명·라벨은 답·풀이 중간값 비공개. |
| 21 | EXEMPT | EXEMPT | 삼차함수의 극한 존재 조건으로 `f'(2)=f'(0)=0`을 식으로 확인하는 대수계산. |

## 기출 PNG/SVG · 직접 연결 SVG · 레거시 plan 대조

| 증거 | 실제 확인한 사항 |
| --- | --- |
| 기출 원본 `26_팔마고_2학기_중간_고2_미적분I/` | PNG `q20.png` 1개, SVG 6개(`q15-solution-v2`, `q17-solution`, `q18-solution`, `q19-solution`, `q20-solution-v2`, `-v3`). 주요 SVG의 `title`·도식 관계·변형 전 수치를 확인. |
| 직접 연결된 유사 SVG | `_유사/q20-problem.svg` 1개. 원·포물선·직선·A/P/Q 구조를 정식 q20 문제 plan의 원·교점·선분 정의와 대조. 수작업 SVG 수정·재사용 없음. |
| `ORIGINAL_EXAM_PNG_CONFLICT` | `q20.png`의 기출 원은 `x²+y²=2`, 현행 유사 JS는 `x²+y²=20`이다. 현행 원 반지름은 `2√5`이며 기출 그림의 수치를 옮기지 않았다. |
| `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` | 기출 q15 해설 SVG는 다른 정수 값·확장 구간, q17은 `a=3,b=3`, q18은 `x=3` 접합, q19는 `|x-3|`, q20 해설 v2/v3은 `x²+y²=2`·`t=1/2`이다. 현행 유사 해설의 각 수치와 독립 비교했다. |
| 레거시 시험지 옆 plan | `archive/exams/similar/high/h2/2mid/<stem>_plans/q20-problem.plan.json`: `ellipse-figure-v1`의 원/포물선과 `t=1` 선의 정적 관계를 확인. 레거시 파일은 수정하지 않았고, 정식 `piecewise-polynomial-spike-v1`의 exact `onCircle` 교점·`PQ`를 제작 기준으로 보존. |
| 현재 공식 plan | 기존 7개 1:1 확인 후 유지. 유사 JS q09의 상한·하한 그래프가 해설에 실제로 유익하므로 지원되는 `multi-curve-figure-v1` JSON만 신규 작성. |

## 정적 검증·수학 검산·렌더 분리

- `STATIC_FIELD_PARITY = PASS (8/8)`: 문제·해설의 계수·구간·포물선 꼭짓점·주어진 점과 plan 필드를 대조했다. 예: q07 `a=12`일 때 `f=-(x-2)^3-6`, q09의 경계 두 포물선, q17 `g=(x+2)²+6`(x<0)과 `(x-3)²+1`(x≥0), q20 대표 `Q=(1,1)`, 원 위 P·A 정확 교점.
- `DRAWN_FEATURE_PARITY = STATIC_INVENTORY_PASS (8/8), ACTUAL_SVG_NOT_OBSERVED`: 요구 그래프·열린/닫힌 점·선분·수평선·접선·교점의 JSON 필드를 대조. 실제 공식 SVG의 픽셀·글리프·레이아웃은 아직 관찰하지 못했으므로 시각 PASS로 표시하지 않는다.
- 독립 계산: q07 평균값정리 할선 기울기 `-3`, `c=1`; q09 `f(x)/x→4`, 최종 극한 `16/(6-4)=8`; q15 인접 8구간 부호 변화; q17 두 꼭짓점 높이 `1,6`, 경계 높이 `10`, `a+b=10`; q18 `f'(2)=0`, `a=0,b=12`, 극솟값 `c=2`; q19 `g(5+h)=g(5-h)=|h|`; q20 `OP=2√5`, `OQ=t√(1+t²)`, `H'(2)=9√5/5`를 소스와 독립 대조했다. **이 대상에서 확인된 별도 `CONTENT_CONFLICT_SOURCE` 없음**.
- 두 폴더 전체 plan의 JSON 파싱/공식 Schema 및 Shallow/Full lint **18/18 PASS**(팔마고 8/8). 검사·통과 건수를 축 전체 42건에 과장하지 않는다.
- Chromium 실행 파일 신규 확인: `/usr/bin/chromium` wrapper만 있고 `/usr/lib/chromium/chromium` 부재. 실제 공식 SVG 렌더 **`RENDER_NOT_RUN (8/8)`**. 직접 생성된 SVG·PNG 육안 검수 `NOT_RUN`.
- `ENGINE_CAPABILITY_PENDING`: 확인된 추가 기능 요구 없음. 원본/기존 SVG에 배경 rect가 있다는 사실만으로 `TRANSPARENT_CANVAS_OPTION`을 요청하지 않는다.
