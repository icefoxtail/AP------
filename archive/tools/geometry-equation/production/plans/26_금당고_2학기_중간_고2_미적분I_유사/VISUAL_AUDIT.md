# 26 금당고 2학기 중간 고2 미적분Ⅰ 유사 — SVG production plan 2축 감사

- 제작 기준: `archive/exams/similar/high/h2/2mid/26_금당고_2학기_중간_고2_미적분I_유사.js` **현행 21문항**. 기출값이 다르면 현행 유사 JS가 우선한다.
- 감사 범위: 문제 21축 + 해설 21축 = **42축**. 각 축을 독립적으로 `REQUIRED`(그림 없으면 문제 조건 누락), `BENEFICIAL`(풀이 이해를 돕는 그림), `EXEMPT`(수식·문장으로 충분)로 분류했다.
- 정식 plan: **10개**(기존 8개 보존·그중 문제축 메타데이터 1개 결함 수정, 신규 해설 2개). `production/plans/<stem>/` 외에는 수정하지 않았다.
- 상태 표기: `PLAN`은 공식 실행형 JSON이고, `SOURCE_BLOCKED`는 원문 수학적 모순 때문에 시각 사실을 확정하지 못함을 뜻한다. `EXEMPT`는 외부 기출 SVG가 있었다는 이유만으로 유사본에 그림을 강제하지 않는다는 뜻이다.

## 문항별 독립 문제·해설 감사

| 문항 | 문제축 — 독립 판정 | 해설축 — 독립 판정 | 현행 JS, 기출/변형 및 공식 plan의 대조 근거 |
| --- | --- | --- | --- |
| 01 | EXEMPT | EXEMPT | 무한대에서 유리식의 최고차항 계수비; 좌표 그림 없이 계산. |
| 02 | EXEMPT | EXEMPT | 근호 유리화와 약분으로 끝나는 단일 극한. |
| 03 | EXEMPT | EXEMPT | `1/(x+4)` 정의역의 `x=-4` 제외는 구간 기호로 명확하다. 기출 `q3-solution.svg`의 `x=3` 수직선은 현행 유사 수치와 달라 재사용 금지. |
| 04 | EXEMPT | **BENEFICIAL · PLAN `q04-solution`** | 문제는 함수식과 구간 `[2,5]`만 주어진다. 해설용 `y=8/(x-1)`에서 `(2,8)`, `(5,2)`의 높이를 비교한다. 기출 `q4-solution.svg`/`-v2.svg`의 `y=6/(x-2)`, `[3,5]`와 구분. |
| 05 | EXEMPT | EXEMPT | 연속함수의 사칙연산과 분모 영점 판정. |
| 06 | EXEMPT | EXEMPT | 다항함수 `f'(2)` 계산만 필요. |
| 07 | EXEMPT | **BENEFICIAL · PLAN `q07-solution`** | 문제는 평균변화율 계산. 풀이용 `y=x²-1`에서 `(0,-1)`, `(3,8)`을 잇는 기울기 3 할선. 기출 `q7-solution.svg`/`-v2.svg`는 다른 변형값 `y=x²-3`, `[0,2]`. |
| 08 | EXEMPT | EXEMPT | 미분계수의 `4h` 치환이며 도식 무관. |
| 09 | EXEMPT | EXEMPT | 인수분해와 미분계수 정의의 식 변형만 사용. |
| 10 | EXEMPT | EXEMPT | `x=3`의 연속조건으로 계수 연립. 기출 `q10-solution.svg`의 `x=2` 약분 도식은 원본의 다른 값이다. |
| 11 | EXEMPT | **BENEFICIAL · PLAN `q11-solution`** | 조각함수의 `x=-1,3` 접합, `a=2,b=4,c=-1`을 정확한 열린/닫힌 점으로 표시. 기출 `q11-solution[-v2].svg`의 다른 경계/계수는 복제하지 않음. |
| 12 | EXEMPT | **BENEFICIAL · SOURCE_BLOCKED** | 조임 그래프는 도움이 되나 현행 모든 실수 조건 `-4x≤f(x)≤x²+2x+8` 자체가 `x=-3`에서 `12≤f(-3)≤11`로 모순이다. 기출 `q12-solution[-v2].svg`의 옛 그래프를 새 수치의 증거로 사용하지 않는다. 공식 plan 추가 보류. |
| 13 | **REQUIRED · PLAN `q13-problem`** | **BENEFICIAL · PLAN `q13-solution`** | 그림에 의존하는 좌극한 문제. `x=0,1`의 각 가지·열린/닫힌 점을 공식 piecewise plan에 보존; 풀이 방향은 **해설축에만**. 기출 PNG/유사 SVG/레거시 plan을 각각 검토. |
| 14 | EXEMPT | **BENEFICIAL · PLAN `q14-solution`** | 문제는 조각식만 제시. 해설에서 `x=3`의 값 18과 양쪽 기울기 6 일치를 표시. 기출 SVG의 `x=2` 변형과 구분. |
| 15 | EXEMPT | EXEMPT | 두 미분계수형 극한의 연립 대수계산. |
| 16 | **REQUIRED · PLAN `q16-problem`** | **BENEFICIAL · PLAN `q16-solution`** | `y=4/x`, `P`, 수직 직선 `l`, 축 절편 `Q,R`, `S₁,S₂`를 해석하기 위한 원그림 필수. 기출 PNG의 `y=1/x`와 달라 현행 JS 기준. 문제축에는 대표 그림 `t=2`의 **풀이값 라벨 없음**. |
| 17 | EXEMPT | EXEMPT | 삼차식의 중근·인수 조건을 식으로 결정. 기출 `q17-solution.svg`의 별도 곡선은 현행 해설에 필수 아님. |
| 18 | EXEMPT | **BENEFICIAL · PLAN `q18-solution`** | 역함수와 `y=x` 대칭, 교점 `(0,6),(3,3),(6,0)`을 두 곡선에 표시. 기출 `q18-solution[-v2].svg`는 이전 수치. |
| 19 | EXEMPT | **BENEFICIAL · PLAN `q19-solution`** | `k=1,a=6`인 실제 허용 대표예에서 두 x절편·`x=4` 연결을 보여 줌. 옛 `q19-solution[-v2].svg`의 서로 다른 예와 혼동 금지. |
| 20 | EXEMPT | EXEMPT | 조건 (가)(나)로 다항식 계수 결정; 별도 도형이 요구되지 않는다. |
| 21 | EXEMPT | EXEMPT | 삼차식 인수와 정수 범위 최적화; 옛 `q21-solution[-v2].svg`의 수직선은 원본 변형의 수치라 직접 이식 불가. |

축 집계: `REQUIRED 2`, `BENEFICIAL 9`(공식 plan 8, 원문 충돌 보류 1), `EXEMPT 31` = 42축. 공식 plan 10개는 문제 2개·해설 8개다.

## 원본과 변형본 증거의 우선순위

| 증거 | 감사 결과 |
| --- | --- |
| 기출 원그림 | `archive/assets/images/26_금당고_2학기_중간_고2_미적분I/`에 PNG 2개(`q13`,`q16`), SVG 23개(`-v2` 포함). 기출 값 자체는 현행 유사 JS를 덮어쓰지 않는다. |
| 직접 연결된 유사 SVG | `_유사/q13-problem.svg`, `_유사/q16-problem.svg` 2개. 정적 title/desc, 좌표·함수·점 계층을 현행 JS/공식 plan과 대조했으며 이 SVG 자체는 이번 범위에서 수정하지 않는다. |
| `ORIGINAL_EXAM_PNG_CONFLICT` | `q13.png` 원그림과 현행 유사에서 쓰는 단절점/가지 값의 변형을 구별한다. `q16.png`의 반비례 곡선은 `y=1/x` 계열이나 현행 유사 JS는 `y=4/x`다. 기출 PNG를 정답 모델로 역이식하지 않는다. |
| `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` | 기출 해설 SVG(`q4`, `q7`, `q11`, `q12`, `q14`, `q18`, `q19` 등)는 변형 전 수치·경계를 포함한다. 특히 q04의 `y=6/(x-2)`와 현행 `8/(x-1)`, q07의 `[0,2]`와 `[0,3]`은 별도 충돌로 기록한다. 기출 SVG와 현행 유사 SVG는 같은 증거 종류로 취급하지 않는다. |
| 레거시 JSON | 시험지 옆 `<stem>_plans/q13-problem.plan.json`과 `q16-problem.plan.json` 2개를 읽고 보존. q13의 구간·계수와 공식 plan을 비교하고, q16 레거시 `construction-spike-v1`의 선분 도식을 공식 `rational-spike-v1`의 정확한 `y=4/x`로 개선된 상태를 확인. |
| 현행 공식 JSON | 기존 8개를 삭제·교체하지 않고, `q13-problem`의 `sourceConditions`에서 **풀이 방향 `t→∞`/`t→-∞`에 따른 접근 결과**가 문제축에 새어 나가던 문구만 제거. `q04-solution`, `q07-solution`을 공식 capability로 신규 작성. |

## STATIC_FIELD_PARITY / DRAWN_FEATURE_PARITY 및 독립 검산

- `STATIC_FIELD_PARITY = PASS (10/10)`: 현행 JS의 함수 계수·구간·경계 포함 여부·점 좌표·공식 JSON의 sourceConditions 매핑을 원본/변형 기록과 함께 대조. q13의 세 가지 경계 `(0,-1)` 열린 점, `(0,0)` 닫힌 점, `(1,2)` 열린 점, `(1,3)` 닫힌 점 유지. q16의 대표값 `P=(2,2)`, `l:y=-x+4`, `Q=(4,0)`, `R=(0,4)` 확인.
- `DRAWN_FEATURE_PARITY = STATIC_INVENTORY_PASS (10/10), ACTUAL_SVG_NOT_OBSERVED`: plan 구조의 선·곡선·점·구간·수직표식·대칭곡선 요구를 독립 열거해서 JS 조건과 비교했다. 공식 최종 SVG를 만들지 못했으므로 픽셀/글리프/실제 그려진 기능의 parity는 **미검증**이다.
- 독립 수학 검산: q04 `f(2)=8, f(5)=2`, q07 `(-1→8)/3=3`, q11 접합점 `-3,5`, q13 `2+(-1)=1`, q14 `9+a=3b`, `b=6→a=9`, q16 `S₂−S₁=t⁴/8−32/t⁴`의 `t=2` 미분값 `8`, q18 감소함수의 대칭 교점 `(0,6),(3,3),(6,0)`, q19 허용 대표 `k=1,a=6`에서 `g(4^-)=g(4^+)=9`, 영점 `1,7` 확인. **원문 q12는 반례 `x=-3`으로 별도 충돌 확정**.
- JSON 파싱·스키마/공식 plan-lint: 전체 두 시험지 `Shallow 19/19 PASS`, `Full 19/19 PASS`(이 폴더 10/10). 실패 0, skip 0.
- Chromium 새 검사: 실행 wrapper는 존재하지만 `/usr/lib/chromium/chromium` 실제 실행파일 부재. 공식 SVG 렌더는 **`RENDER_NOT_RUN (10/10)`**. 정적 PASS를 시각 PASS로 보고하지 않는다.
- `ENGINE_CAPABILITY_PENDING`: **이 시험지에서 확인된 엔진 기능 부족 없음.** q12는 엔진 문제가 아니라 `CONTENT_CONFLICT_SOURCE`/`EVIDENCE_DEBT`로 남긴다. 무관한 투명 캔버스 옵션이나 이전 시험지의 복합 곡선 요청을 복사하지 않는다.
