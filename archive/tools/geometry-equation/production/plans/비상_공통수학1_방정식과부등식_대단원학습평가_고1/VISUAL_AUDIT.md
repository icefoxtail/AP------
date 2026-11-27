# 비상교육 공통수학Ⅰ · 방정식과 부등식 대단원 학습 평가 고1 — 문제·해설 SVG 플랜 전수 감사

- 기준 `origin/main` `ba944d9b071dc3e0e7a52ba1a0b0d6c61cdbe696` (2026-11-27), 원본 JS blob `b981e0551a5bbe003be67606b89b57cee085e276`.
- 원본: `archive/exams/textbooks/비상교육_공통수학1/비상_공통수학1_방정식과부등식_대단원학습평가_고1/비상_공통수학1_방정식과부등식_대단원학습평가_고1.js`.
- **18문항 × 2축 = 36축** 전수 점검: 발문 `EXEMPT 17 / REQUIRED 1`, 해설 `EXEMPT 8 / BENEFICIAL 10`, 실행 가능한 `q*.plan.json` **11개**. 전부 shallow/full lint PASS. 원본 이미지 q05.png 1개는 유지했고 신규 SVG/PNG·JS 연결 변경은 하지 않는다.
- 이 장부의 경로는 모두 이 파일과 같은 `production/plans/비상_공통수학1_방정식과부등식_대단원학습평가_고1/` 디렉터리를 기준으로 한 실제 파일명이다. `P=PASS`는 **원문 조건의 화면 요소가 plan의 렌더 필드와 1:1 대응한다는 정적 검증**이지 SVG 렌더·PNG/학생/A4 눈검수 완료가 아니다.
- 표의 `ECP`는 `ENGINE_CAPABILITY_PENDING`이며 **q05 문제축만** 해당한다. 두 포물선·왼쪽 교점·`x=−2` 점선·두 x교점·눈금은 실제 plan/엔진에 구현되었으나, **원본 아래로 열린 포물선 옆의 문자식 `y=−x²/2+x+k`를 `g(x)`가 아닌 기호식 그대로 해당 곡선에 지시선으로 붙이는 렌더 기능은 미완성**이다. `referenceCurves[].nameLabel`을 직접 시험하면 `PIECEWISE_POLY_REFERENCE_CURVES_INVALID`로 거절한다. 숫자 `k=13`을 발문 곡선 라벨로 내면 중간 풀이값을 노출하므로 그렇게 우회하지 않았다. 엔진 라인에 **piecewise-polynomial 참조곡선의 symbolic expression label + curve-owned leader (미지 k는 도식용 계수와 별개)** 기능을 인계한다. 실제 제작형 plan은 유효하나 `DRAWN_FEATURE_PARITY`를 PASS로 허위 기록하지 않는다.

| 파일/qid | 축 | 판정·개별 수학적 사유 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 방정식·부등식/q01 | 문제 | EXEMPT · 복소수식의 실수 부분 0이라는 대수 조건 | — | — | N/A | N/A |
| 방정식·부등식/q01 | 해설 | EXEMPT · 실수부 a²−5a+4=0의 근 1,4 및 합 5 | — | — | N/A | N/A |
| 방정식·부등식/q02 | 문제 | EXEMPT · 음수의 제곱근과 허수 i의 곱셈 | — | — | N/A | N/A |
| 방정식·부등식/q02 | 해설 | EXEMPT · √(−a)=√a·i, i²=−1만 사용 | — | — | N/A | N/A |
| 방정식·부등식/q03 | 문제 | EXEMPT · 두 이차방정식의 근·계수 관계 | — | — | N/A | N/A |
| 방정식·부등식/q03 | 해설 | EXEMPT · α²+β²=1, αβ=4로 a=−3,b=16 계산 | — | — | N/A | N/A |
| 방정식·부등식/q04 | 문제 | EXEMPT · 모든 k에 따른 그래프의 비접촉 조건을 문자식으로 제시, 특정 도식은 없음 | — | — | N/A | N/A |
| 방정식·부등식/q04 | 해설 | EXEMPT · 두 식의 차의 판별식 D/4=5−k<0으로 k>5 산출; 한 사례를 일반해로 보여 주는 중복 도형은 불필요 | — | — | N/A | N/A |
| 방정식·부등식/q05 | 문제 | **REQUIRED·ECP** · 원본 q05.png의 두 포물선, 두 교점, 왼쪽 x=−2 보조 점선, 두 곡선 옆 원식 라벨이 필수 | `piecewise-polynomial-spike-v1` + symbolic-curve-label **보강 필요** | `q05-problem.plan.json` | PASS/PASS | **ENGINE_CAPABILITY_PENDING**(곡선 원식 k 라벨) |
| 방정식·부등식/q05 | 해설 | BENEFICIAL · k=13, x=−2/5의 두 교점과 수직 점선, 왼쪽 좌표 (−2,9)를 별도 해설 도식으로 계산 | `piecewise-polynomial-spike-v1` | `q05-solution.plan.json` | PASS/PASS | P (교점·식·점선·눈금) |
| 방정식·부등식/q06 | 문제 | EXEMPT · 두 실근 사이에 2가 놓인다는 조건을 수식으로 완결 | — | — | N/A | N/A |
| 방정식·부등식/q06 | 해설 | BENEFICIAL · 해설의 a=4 검산에 있는 두 근 4±√7 사이 x=2와 f(2)=−3 표시 | `polynomial-spike-v1` | `q06-solution.plan.json` | PASS/PASS | P (두 근 좌표·x=2 점선) |
| 방정식·부등식/q07 | 문제 | EXEMPT · 이차함수식과 구간 −1≤x≤a·최댓값 3만 제시, 그림 없음 | — | — | N/A | N/A |
| 방정식·부등식/q07 | 해설 | BENEFICIAL · 꼭짓점 x=5/2는 구간 밖, [−1,2]에서 증가·(−1,−9)/(2,3)을 비교 | `polynomial-spike-v1` | `q07-solution.plan.json` | PASS/PASS | P (정의역·양 끝 좌표·극값) |
| 방정식·부등식/q08 | 문제 | EXEMPT · 사차방정식의 근만 구하며 그래프 조건은 없음 | — | — | N/A | N/A |
| 방정식·부등식/q08 | 해설 | EXEMPT · P(−1)=P(2)=0 및 이차인수의 근 1±√2 계산 | — | — | N/A | N/A |
| 방정식·부등식/q09 | 문제 | EXEMPT · ω³=1의 허근과 ω 지수 합의 수식 | — | — | N/A | N/A |
| 방정식·부등식/q09 | 해설 | EXEMPT · ω²+ω+1=0을 대입한 분수 합 3/2 | — | — | N/A | N/A |
| 방정식·부등식/q10 | 문제 | EXEMPT · 연립방정식의 해쌍 x+y의 최댓값·최솟값 요구, 별도 좌표 도형 없음 | — | — | N/A | N/A |
| 방정식·부등식/q10 | 해설 | EXEMPT · x=y 또는 x=2y의 유한 해쌍 네 개를 대입·나열하여 최대 3, 최소 3/5 계산 | — | — | N/A | N/A |
| 방정식·부등식/q11 | 문제 | EXEMPT · |x−2|+|x−3|<5는 수식으로 주어져 발문 수직선 없음 | — | — | N/A | N/A |
| 방정식·부등식/q11 | 해설 | BENEFICIAL · 세 부분 구간 경계 2,3과 최종 열린 해 (0,5)를 대조 | `number-line-figure-v1` | `q11-solution.plan.json` | PASS/PASS | P (열린 0·5, 내부 2·3) |
| 방정식·부등식/q12 | 문제 | EXEMPT · 두 이차부등식의 해·정수 개수 수식, 발문 그림 없음 | — | — | N/A | N/A |
| 방정식·부등식/q12 | 해설 | BENEFICIAL · a=7,b=−3, 열린 해 −2/3<x<3의 정수 0,1,2를 표시 | `number-line-figure-v1` | `q12-solution.plan.json` | PASS/PASS | P (양끝 OPEN·정수 점 3개) |
| 방정식·부등식/q13 | 문제 | EXEMPT · 임의 k에서의 접선 조건을 변수식으로 제시, 특정 접점 지정 안 됨 | — | — | N/A | N/A |
| 방정식·부등식/q13 | 해설 | BENEFICIAL · a=−2,b=−4의 접촉 관계를 k=0의 정확한 대표 도식 T(−2,4)로 확인 | `polynomial-spike-v1` | `q13-solution.plan.json` | PASS/PASS | P (접선 식·곡선·접점 좌표) |
| 방정식·부등식/q14 | 문제 | EXEMPT · 두 x절편의 거리 2√2가 이미 수치로 주어져 원문 그림 없음 | — | — | N/A | N/A |
| 방정식·부등식/q14 | 해설 | BENEFICIAL · k=2일 때 x절편 1±√2와 선분 길이 2√2를 직접 표시 | `polynomial-spike-v1` | `q14-solution.plan.json` | PASS/PASS | P (x절편 좌표·길이 라벨) |
| 방정식·부등식/q15 | 문제 | EXEMPT · 가격·판매량·구간 0≤x≤15가 문장과 식으로 완비 | — | — | N/A | N/A |
| 방정식·부등식/q15 | 해설 | BENEFICIAL · 매출 이차함수의 [0,15] 구간 양끝 금액과 x=5 꼭짓점 625000원을 비교 | `polynomial-spike-v1` | `q15-solution.plan.json` | PASS/PASS | P (기준값·꼭짓점·원 단위 축) |
| 방정식·부등식/q16 | 문제 | EXEMPT · 삼차방정식의 모든 실근 조건을 묻는 인수분해식 | — | — | N/A | N/A |
| 방정식·부등식/q16 | 해설 | EXEMPT · (x+1)(2x²+kx+k), D=k(k−8)≥0의 대수 부호 판단만 필요 | — | — | N/A | N/A |
| 방정식·부등식/q17 | 문제 | EXEMPT · 모든 4≤x≤5에서 이차부등식 성립 여부를 수식으로 묻고 별도 그림은 없음 | — | — | N/A | N/A |
| 방정식·부등식/q17 | 해설 | BENEFICIAL · 경계 k=3의 대표 그래프에서 [4,5] 증가·끝점 (5,0)이 최댓값 | `piecewise-polynomial-spike-v1` | `q17-solution.plan.json` | PASS/PASS | P (정의역·양끝 좌표·증가) |
| 방정식·부등식/q18 | 문제 | EXEMPT · 연립부등식·최종 해 (2,3]가 문자식으로 주어짐 | — | — | N/A | N/A |
| 방정식·부등식/q18 | 해설 | BENEFICIAL · x<−3 ∪ x>2, a−1≤x≤3의 공통 범위를 a=1 예시로 수직선 3줄에 표현 | `number-line-figure-v1` | `q18-solution.plan.json` | PASS/PASS | P (두 조건·OPEN 2/CLOSED 3·교집합) |

## 원본 그림 / SVG 특징별 1:1 검수

| 원본 또는 해설의 특징 | plan 실제 그리기 필드 | 검수 결과 |
|---|---|---|
| q05.png: 두 포물선의 서로 반대 개형·두 교점 | `q05-problem.graphPlan.pieces`, `.referenceCurves[0].pieces`, `.intersectionX=[−2,5]` | PASS, 풀이의 미지 다른 x좌표는 문제 그림에 **문자로 표기하지 않음** |
| q05.png: 왼쪽 교점의 x=−2, 아래로 내린 점선 | `q05-problem.graphPlan.overlays.points[P]`, `.guides[d].axis=x`, `.axisTickValues.x=[−2]` | PASS; 점선과 눈금이 렌더 필드로 보장됨 |
| q05.png: 두 곡선의 수식 라벨, 아래로 열린 식의 미지수 k | 첫 곡선의 `graphPlan.formula`, 둘째 곡선은 `graphPlan.referenceCurves[0].name`뿐 | **ENGINE_CAPABILITY_PENDING**; `nameLabel` 시도 실패, 원본과 다른 `g(x)` 임시 라벨 |
| q05 해설: y=9, k=13, 교점 x=−2,5 | `q05-solution.graphPlan.referenceCurves[0].coefficients`, `.intersectionX`, `.overlays.points[A].coordinates`, `.guides` | PASS, 해설 축에만 계산 후 다른 교점 x를 노출 |
| q06: f(2)<0과 두 실근의 좌우 관계 | `q06-solution.graphPlan.overlays.points`의 두 surd 좌표와 P(2,−3), `.guides` | PASS, 해설에 명시된 a=4 검산 예시만 도식화 |
| q07: 구간 −1…2, 최소 −9·최대 3 | `q07-solution.graphPlan.sourceDomain.range`, `.requiredPoints`, `.axisTickValues` | PASS, 꼭짓점 x=5/2를 구간 안에 허위로 그리지 않음 |
| q11: 0<x<5와 분기점 2·3 | `q11-solution.numberLine.rows[0].pieces`, `rows[1].points` | PASS, 열린 점 2개와 내부 점 2개 |
| q12: −2/3<x<3, 정수 0·1·2 | `q12-solution.numberLine.rows[0].pieces`, `.integerPoints=true` | PASS, 분수 열린 끝점과 정수 점을 엔진이 산출 |
| q13: k=0 대표 접점 T(−2,4) | `q13-solution.graphPlan.coefficients`, `.overlays.lines`, `.overlays.points[T].coordinates` | PASS; 나머지 k 그래프를 동시에 그린다고 주장하지 않음 |
| q14: x절편 1±√2, 길이 2√2 | `q14-solution.graphPlan.overlays.points[A,B].coordinates`, `.segments[AB].length=true` | PASS, `caption`만이 아니라 선분 자체의 자동 계산 길이 라벨 |
| q15: [0,15] 매출 곡선, 극값·끝값 | `q15-solution.graphPlan.applicationAxes`, `.sourceDomain`, `.requiredPoints` | PASS, 단위 다른 축·금액 극값을 정확한 숫자 점으로 표기 |
| q17: k=3 대표 증가 구간과 최대 0 | `q17-solution.graphPlan.pieces`, `.sourceDomain.range`, `.requiredPoints` | PASS, 흰 배경·범위 밖 면 채움 없음 |
| q18: 두 해집합의 교집합과 열린/닫힌 끝 | `q18-solution.numberLine.rows[0,1,2]`, `.parameter(a=1)` | PASS, 결과 SET은 직접 작성하지 않고 엔진 `RESULT`가 계산 |

## 면 채움·검증 경계·엔진 인계

1. 모든 11개 plan에서 장식용 `fill`, `regions`, 바탕색 지정은 **0개**다. 수직선의 열린 끝점에서 흰 내부 원은 폐구간/열린 구간의 표식이지 불필요한 면 채움이 아니다. q05.png 자체는 흰 바탕에 검은 선이고 불필요한 색칠이 없어 원본을 보존했다.
2. `plan-lint --shallow`: **11/11 PASS**, 공식 full: **11/11 PASS**. 별도 정적 원문/조건/그리기 필드 대조 `DRAWN_FEATURE_PARITY`: **10 PASS, 1 ENGINE_CAPABILITY_PENDING**. EXEMPT **25축**은 N/A이며 PASS 수에 더하지 않는다.
3. `ENGINE_CAPABILITY_PENDING`의 **필요 기능은 “원본 문자 k와 완성된 숫자 계수를 분리해서 같은 참조 포물선에 `y=−x²/2+x+k` 수식 라벨·소유 지시선을 표시하는 지원”**이다. 해당 추가 기능이 구현되고 full lint 및 독립 렌더 검수가 통과하면 q05-problem만 재검토하면 된다. 대체 SVG를 손으로 조립하거나 중간 풀이값을 발문에 적어 우회하지 않는다.
4. **SVG 렌더·PNG 생성/눈검수·학생 화면·A4·JS 이미지 연결/게시: `NOT_RUN`**. 이 PR은 제작용 계획과 2축 장부만 병합한다. 기존 JS·q05.png·엔진·다른 라인의 운영 파일을 변경하지 않았다.
5. **원본 JS의 비시각적 주의 사항:** q15 해설 마지막 괄호에는 "원문의 범위 `0<x<15`"라고 되어 있지만, 실제 현행 발문은 `0≤x≤15`이고 해설 앞부분도 닫힌 구간의 최솟값을 사용한다. 이 플랜은 현행 발문 및 올바른 최댓값·최솟값 계산에 맞춰 **양 끝을 포함한 구간**으로 작성했다. 원문 JS의 주석성 문장 교정은 다른 제작 라인의 소관으로 보고만 한다.
