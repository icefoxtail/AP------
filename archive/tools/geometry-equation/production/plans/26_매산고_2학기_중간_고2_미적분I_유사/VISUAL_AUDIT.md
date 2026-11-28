# 26 매산고 2학기 중간 고2 미적분Ⅰ 유사 — SVG production plan 2축 감사

- 제작 기준: `archive/exams/similar/high/h2/2mid/26_매산고_2학기_중간_고2_미적분I_유사.js` **현행 21문항**. 기출 이미지와 수치가 다를 때 현행 유사 JS를 우선한다.
- 감사 범위: 문제 21축 + 해설 21축 = **42축**. `REQUIRED`는 문제 조건 자체에 필수, `BENEFICIAL`은 해설에 교육상 실익, `EXEMPT`는 수식/문장만으로 충분함을 뜻한다.
- 공식 plan **9개**(기존 9개 보존, 그중 문제축 정보 누출 1개 확인 후 메타데이터 수정). 매산고 q14는 원문에 수학적 모순이 있어 임의 그림으로 봉합하지 않았다.

## 문항별 독립 문제·해설 감사

| 문항 | 문제축 — 독립 판정 | 해설축 — 독립 판정 | 현행 JS, 기출/변형 및 공식 plan의 대조 근거 |
| --- | --- | --- | --- |
| 01 | EXEMPT | EXEMPT | 삼차함수의 미분계수 정의와 도함수 대입. |
| 02 | EXEMPT | **BENEFICIAL · PLAN `q02-solution`** | 연속 다항함수 `f(2)=-5<0`, `f(3)=1>0`을 잇는 그래프가 사잇값 정리의 근 존재를 보조. 기출 `q2-solution.svg`의 옛 `(1,2)` 구간과 혼동 금지. |
| 03 | EXEMPT | EXEMPT | 곱의 미분법으로 `f'(0)` 직접 계산. |
| 04 | **REQUIRED · PLAN `q04-problem`** | **BENEFICIAL · PLAN `q04-solution`** | 각 보기의 극한과 함수값은 제공된 불연속 그래프가 반드시 필요. `x=0,1,2`의 열린/닫힌 점 및 `x=3`의 값 대조. 기출 `q04.png`, 직접 연결된 유사 `q04-problem.svg`, 레거시 JSON을 분리해 검사. |
| 05 | EXEMPT | EXEMPT | `x=-1`의 연속·미분가능 조건을 식 두 개로 연립. 기출 `q5-solution.svg`의 값은 현행 해설과 다름. |
| 06 | EXEMPT | **BENEFICIAL · PLAN `q06-solution`** | 롤의 정리를 `[-4,0]`의 같은 높이 두 끝점과 `c=-2` 수평접선으로 보임. 기출 `q6-solution.svg`는 이전 구간. |
| 07 | EXEMPT | **BENEFICIAL · PLAN `q07-solution`** | `y=x²-6x+11`의 꼭짓점 `(3,2)`와 끝점 `(1,6),(5,6)`의 높이 비교. 기출 `q7-solution.svg`의 좌표는 이전 변형. |
| 08 | EXEMPT | EXEMPT | 두 극한으로 삼차함수 계수·중근을 결정하는 대수식. |
| 09 | EXEMPT | **BENEFICIAL · PLAN `q09-solution`** | 도함수 `f'=5`의 접점 `x=0,2`에서 두 평행접선을 구별하고 음의 y절편 접선 `y=5x-3`을 찾음. 기출 `q9-solution.svg`의 기울기 4와 다름. |
| 10 | EXEMPT | EXEMPT | 극한법칙 참·거짓의 반례를 수식으로 제시. |
| 11 | EXEMPT | EXEMPT | 원점대칭 삼차함수의 계수·나머지 연산; 기출 `q11-solution.svg`의 임의 예시 그래프는 현행 풀이에 필수 아님. |
| 12 | EXEMPT | EXEMPT | 근호극한과 이차식 판별식·정수계수 조건. 기출 `q12-solution.svg`는 다른 수치의 경계 사례. |
| 13 | EXEMPT | **BENEFICIAL · PLAN `q13-solution`** | `x=2,5`의 연결과 `g(x)=2x` 중간 구간, `y=2` 위쪽 면적 구성을 확인. 기출 `q13-solution.svg`의 `x=1,6` 경계·중간 직선은 현행 값과 달라 별도 관리. |
| 14 | EXEMPT | **BENEFICIAL · SOURCE_BLOCKED** | `y=|3x²-1|`와 이차함수의 수평선 교점 개수 그래프는 핵심이나 **현행 해설이 조건 (나)와 불일치**한다. 기출 `q14-solution.svg`는 옛 `k=0,1` 비교에 머물고 현행 조건을 증명하지 못한다. 잘못된 plan 생성 금지. |
| 15 | **BENEFICIAL · PLAN `q15-problem`** | **BENEFICIAL · PLAN `q15-solution`** | 포물선 위 `P`와 각 이등분선 `PQ`, `A,O,Q,B`의 상대 배치가 관계 이해에 도움. 문제축은 임의의 허용 대표값 `t=5/2`를 쓰되 **극한값·`PA:PB` 계산·`Q`의 유도 좌표를 caption/description/newVisualInformation/sourceConditions에 공개하지 않음**. 기출 `q15-solution.svg`와 v2/v3은 `y=4-x²`인 다른 예. |
| 16 | EXEMPT | EXEMPT | 분모 영점·완전제곱식 조건에서 이차함수의 상수 결정; 그래프를 그려도 추가 필수 관계 없음. |
| 17 | EXEMPT | EXEMPT | 두 극한의 인수분해·유리화 계산. |
| 18 | EXEMPT | EXEMPT | 함수 증가 조건 및 접선식을 이용한 이차계수 검산. |
| 19 | EXEMPT | EXEMPT | 이차함수 인수식과 극한의 존재/부존재를 대수식으로 비교. |
| 20 | EXEMPT | EXEMPT | 역함수 교점 개수와 세 접점 `t`의 합은 방정식·비에타 관계로 검산. 기출 `q20-solution.svg`는 축척이 다른 일부 곡선과 **세 접선 중 한 개만** 보여 현행 문제에 충분한 재현 증거가 아님. |
| 21 | EXEMPT | EXEMPT | 함수방정식의 짝/홀 항등식과 도함수 조건; 좌표 도형 불필요. |

축 집계: `REQUIRED 1`, `BENEFICIAL 9`(공식 plan 8, 원문 충돌 보류 1), `EXEMPT 32` = 42축. 공식 plan 9개는 문제 2개·해설 7개다.

## 증거 대조와 충돌 분리

| 증거 | 감사 결과 |
| --- | --- |
| 기출 이미지 | `archive/assets/images/26_매산고_2학기_중간_고2_미적분I/`에 PNG 1개(`q04.png`), SVG 13개(해설 `q2`, `q5`~`q7`, `q9`, `q11`~`q15`, `q20` 및 v2/v3). 원본 SVG의 title/desc와 함수식을 현행 유사 JS와 비교했다. |
| 직접 연결된 유사 SVG | `_유사/q04-problem.svg`의 title/desc·그림 경계·빈/채운 점을 현행 JS와 공식 q04 양축의 piecewise 데이터로 대조. 기존 SVG 파일 변경 없음. |
| `ORIGINAL_EXAM_PNG_CONFLICT` | 기출 `q04.png`의 원래 그래프와 현행 유사본의 좌표·가지가 변형됐다. 문제·정답 판단은 `q04-problem.svg`와 **현행 유사 JS**에서 한다. |
| `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` | 기출 해설 SVG의 변형 전 값과 현행 값을 혼동하지 않음: q02의 근 존재 구간, q06·q07의 구간/꼭짓점, q09 접선 기울기, q13 구간·중간 직선, q15 포물선 반경. q20 SVG는 해설의 세 접선 전부를 보여 주지 않는다는 의미의 증거 부족이다. |
| 레거시 JSON | 시험지 옆 `<stem>_plans/q04-problem.plan.json` 보존. 레거시 첫 가지 계수 `1+x`는 원본 유사 SVG의 `(-1,-2)`와 불일치했으나 공식 plan은 `1+3x`를 사용하여 현행 그림의 점을 정확히 통과하도록 보존·검토됐다. |
| 현행 공식 JSON | 기존 9개 파일 그대로 유지하면서 `q15-problem`의 `newVisualInformation`과 `sourceConditions`에 실려 있던 **유도 비 `PA:PB=11:5`, `Q=9/8`**을 제거했다. 문제 그림의 수학적 내부 점 좌표는 정확한 공식 도형 모델에 유지하되 **학생에게 노출되는 설명문에 풀이값을 넣지 않는다**. |

## 수학적 원문 충돌: q14는 엔진 문제가 아님

`CONTENT_CONFLICT_SOURCE` / `EVIDENCE_DEBT` — 현행 q14 해설은 이차함수의 계수 `A=1/2`를 채택하여 `g(7)=8`(선택지 ①)이라 하지만, 그때 `b(k)=#\{x:g(x)=k\}`는 `k=0,1,2` **세 곳**에서 불연속이다. 조건 (나)는 불연속값 **두 개**를 요구한다.

- 독립 검산: `g(x)=|3x²-1| (x<1)`, `f(x)=A(x-1)(x-5)+2 (x≥1)`. `A=1/2`이면 오른쪽 꼭짓점 높이가 `0`이다. `k=0`에서 곡선 교점 수가 새로 생기고, `k=1`에서 왼쪽 절댓값 곡선의 가지 수가 변하며, `k=2`에서 `x=1` 경계로 오른쪽 가지 하나가 빠진다. 세 점 모두 좌우 근방의 개수가 달라진다.
- `A=1/4`이면 꼭짓점 높이 `1`이므로 `k=1`에서 왼쪽의 감소 두 교점과 오른쪽의 증가 두 교점이 상쇄되어 개수는 양쪽에서 각각 **4**로 일정하다. 불연속은 `k=0,2`뿐이며 (가)의 큰 `t`에 대한 비수평선 교점 2개도 만족한다. 이 경우 `g(7)=f(7)=5`로, **현행 선택지 `8,6,4,2,0`에는 5가 없다**.
- 이 충돌은 JSON 표현력 부족이나 SVG 렌더 오류가 아니다. JS/선택지를 수정할 승인 범위가 없으므로 q14 해설 계획을 작성하지 않는다. 문제 편집자는 별도 소스 정합성 수정을 검토해야 한다.

## STATIC_FIELD_PARITY / DRAWN_FEATURE_PARITY 및 검증

- `STATIC_FIELD_PARITY = PASS (9/9)`: q04 원본 점/극한 구별(예: `f(0)=-2`, 오른쪽 극한 `1`, `f(2)=1`, 극한 `2`), q06 `[-4,0]`의 `c=-2`, q07 꼭짓점 `(3,2)`, q09 `x=0,2`의 접선, q13 `g(2)=4,g(5)=10`을 연결하는 기울기 2, q15 `A(-3,0)`, `B(3,0)`, `P(5/2,11/4)`를 공식 필드에서 확인.
- `DRAWN_FEATURE_PARITY = STATIC_INVENTORY_PASS (9/9), ACTUAL_SVG_NOT_OBSERVED`: 계획 필드의 점/구간/수직선/각호/이등분선과 현행 문제·해설 요구를 대조했다. 실제 엔진이 그린 SVG는 확보하지 못했으므로 **실제 시각 parity PASS를 선언하지 않는다**.
- 독립 수학 검산: q02 `f(2)=-5,f(3)=1`, q06 `f(-4)=f(0)=-5`, `f'(-2)=0`, q07 `f(3)=2,f(1)=f(5)=6`, q09 `f'(0)=f'(2)=5`, 음의 절편 접선 `y=5x-3`은 `(3,12)` 통과, q13 중간 `g(x)=2x`와 영역 넓이 `10+15=25`, q15 각의 이등분선 비·좌표 `Q=(9/8,0)` 대표예와 극한 `OQ/t→1/10`을 각각 검산. q14는 위 반례로 **별도 SOURCE FAIL** 기록.
- JSON Schema/공식 plan-lint: 두 시험지 총 `Shallow 19/19 PASS`, `Full 19/19 PASS`(이 폴더 9/9). 실패 0, skip 0.
- Chromium 신규 검사: `/usr/bin/chromium` wrapper는 있으나 실제 `/usr/lib/chromium/chromium` 실행파일이 없다. 공식 엔진 SVG 렌더는 **`RENDER_NOT_RUN (9/9)`**. 정적 PASS는 픽셀 품질 보증이 아니다.
- `ENGINE_CAPABILITY_PENDING`: **이번 시험지에 확인된 기능 요청 없음.** 투명 전체 캔버스가 실제 요건이 아니며 다른 시험지 기능 요청을 차용하지 않는다.
