# 23 순천고 고2 수학I 1학기 중간 유사 — 문제·해설 2축 SVG plan 검수

- 원문 JS: `archive/exams/similar/high/h2/1mid/23_순천고_1학기_중간_고2_수학I_유사.js` (id 01–22, 총 22문항).
- **이번 배치 22문항/44축.** 다음으로 지정된 중2 `archive/exams/similar/middle/m2/1mid/23_신흥중_1학기_중간_중2_유사.js`는 24문항이므로 합계 46문항이 되어 20–30개 한도를 초과한다. 따라서 신흥중은 **미작업**, 다음 묶음에 인계.
- 유사 시험지 저장 위치 규칙: 원문 JS 옆 `<stem>_plans/qNN-problem.plan.json` 또는 `qNN-solution.plan.json`. 이번 대상은 기출이 아니므로 `production/plans/<stem>/` 미사용.
- 소스·정답·해설의 좌표·곡선·점·선분·라벨·각·직각·비율·부등호 범위를 확인. 문제용에는 답을 요구하는 결과값을 표시하지 않음. 모든 plan은 엔진 공식 capability JSON; 손 SVG·PNG, JS `image` 연결 없음. **면 채움 없음.**
- 판정: BENEFICIAL은 실제 실행 가능한 plan을 제작. EXEMPT는 해당 축에 새 그림 불필요·단순식·정답 노출 위험 등의 구체적 이유를 기록. 엔진이 필요한 그리기 필드를 정확히 지원하지 않는 경우 EXEMPT로 위장하지 않고 `ENGINE_CAPABILITY_PENDING`으로 남김.

## 22문항 × 문제·해설 2축 판정

| 파일/qid | 축 | 판정 | capability | plan 경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY | 개별 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 순천/q01 | 문제 | EXEMPT | — | — | N/A | N/A | 거듭제곱근 부호와 곱셈으로 해결하는 산식. |
| 순천/q01 | 해설 | EXEMPT | — | — | N/A | N/A | 근호값 5, −2, 3의 곱·합만 계산. |
| 순천/q02 | 문제 | EXEMPT | — | — | N/A | N/A | 지수함수의 성질을 묻는 선지; 점근선·평행이동을 완성하면 정답이 드러남. |
| 순천/q02 | 해설 | BENEFICIAL | exponential-affine-spike-v1 | `q02-solution.plan.json` | PASS/PASS | PASS | 증가 곡선, 오른쪽2·위4 이동, y=4 점근선. |
| 순천/q03 | 문제 | BENEFICIAL | multi-curve-figure-v1 | `q03-problem.plan.json` | PASS/PASS | PASS | y=x 위 기준점과 y=1/2 수평선, 감소 로그곡선; a 숫자 비노출. |
| 순천/q03 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `q03-solution.plan.json` | PASS/PASS | PASS | 교점 E=(√3/3,1/2)를 실제 점·좌표 라벨로 표시. |
| 순천/q04 | 문제 | EXEMPT | — | — | N/A | N/A | 로그함수 성질 선지에서 두 가지 그래프는 올바른 선지를 직접 알려 줌. |
| 순천/q04 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `q04-solution.plan.json` | PASS/PASS | PASS | x<0·x>0의 두 로그 가지와 y축 대칭·x=0 제외. |
| 순천/q05 | 문제 | EXEMPT | — | — | N/A | N/A | 동경 사분면을 바로 묻고 있어 그림은 정답 노출. |
| 순천/q05 | 해설 | BENEFICIAL | construction-spike-v1 | `q05-solution.plan.json` | PASS/PASS | PASS | −510°와 같은 210° 동경, 제3사분면·무채움 각호. |
| 순천/q06 | 문제 | EXEMPT | — | — | N/A | N/A | 라디안·도 환산 선택지, 단순 단위 계산. |
| 순천/q06 | 해설 | EXEMPT | — | — | N/A | N/A | 180°=π 환산 수식으로 완결. |
| 순천/q07 | 문제 | EXEMPT | — | — | N/A | N/A | 거듭제곱근의 실수 조건 참·거짓. |
| 순천/q07 | 해설 | EXEMPT | — | — | N/A | N/A | 근의 개수·부호 판정만 필요. |
| 순천/q08 | 문제 | EXEMPT | — | — | N/A | N/A | n제곱근 부호의 명제 판단. |
| 순천/q08 | 해설 | EXEMPT | — | — | N/A | N/A | 자연수 n의 홀짝과 a<0의 대수적 확인. |
| 순천/q09 | 문제 | EXEMPT | — | — | N/A | N/A | 역수쌍 치환과 근호 계산. |
| 순천/q09 | 해설 | EXEMPT | — | — | N/A | N/A | t−t⁻¹ 제곱 전개로 충분. |
| 순천/q10 | 문제 | EXEMPT | — | — | N/A | N/A | 4개 보기의 그래프 변환을 완성하면 정답 세트가 바로 노출. |
| 순천/q10 | 해설 | ENGINE_CAPABILITY_PENDING | 혼합 로그·지수 비교 패널 미지원 | — | N/A | PENDING | 기준 log_(√3)와 로그/지수 4후보, 근호 밑·반사·평행이동을 정확히 동시 비교할 다곡선/4패널 기능 필요. |
| 순천/q11 | 문제 | EXEMPT | — | — | N/A | N/A | 극댓값의 x와 b/a를 그래프에 표시하면 정답 노출. |
| 순천/q11 | 해설 | BENEFICIAL | polynomial-spike-v1 | `q11-solution.plan.json` | PASS/PASS | PASS | t=log x 치환의 지수 내부 q(t)=−t²+6t−2, 정점(3,7). |
| 순천/q12 | 문제 | BENEFICIAL | multi-curve-figure-v1 | `q12-problem.plan.json` | PASS/PASS | PASS | 로그곡선 둘·직선 둘로 둘러싸인 면의 경계, 넓이 숫자는 비노출. |
| 순천/q12 | 해설 | EXEMPT | — | — | N/A | N/A | 문제축 그림이 이미 경계를 제공하며 해설은 그래프 평행이동·넓이 계산. |
| 순천/q13 | 문제 | EXEMPT | — | — | N/A | N/A | 밑 0<x<1, x=1, x>1 경우의 부등식. |
| 순천/q13 | 해설 | EXEMPT | — | — | N/A | N/A | 밑에 따른 부등호 방향 대수 판단. |
| 순천/q14 | 문제 | EXEMPT | — | — | N/A | N/A | sin²+cos² 항등식과 역수식. |
| 순천/q14 | 해설 | EXEMPT | — | — | N/A | N/A | sin²=cos²=1/2의 정리. |
| 순천/q15 | 문제 | EXEMPT | — | — | N/A | N/A | 로그 자연수값의 해 개수 6을 그래프 교점이 노출. |
| 순천/q15 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `q15-solution.plan.json` | PASS/PASS | PASS | 허용 대표 a=6, F(t) 포물선과 3·9·27 높이의 교점 수 1·2·0. |
| 순천/q16 | 문제 | EXEMPT | — | — | N/A | N/A | 이미 주어진 온도–증기압 표가 필요한 시각정보, 미지 a,b,c 곡선 추가 근거 없음. |
| 순천/q16 | 해설 | EXEMPT | — | — | N/A | N/A | 표의 증가 방향·로그 부호 분석으로 충분. |
| 순천/q17 | 문제 | BENEFICIAL | exponential-affine-spike-v1 | `q17-problem.plan.json` | PASS/PASS | PASS | 반감기 수 u와 20% 수평선의 교차, 연수 t 숫자 비노출. |
| 순천/q17 | 해설 | EXEMPT | — | — | N/A | N/A | 문제축 그래프로 감소 설명 완료, 해설은 상용로그 근삿값 계산. |
| 순천/q18 | 문제 | ENGINE_CAPABILITY_PENDING | 미정 밑 로그곡선＋원 지름 조건 | — | N/A | PENDING | a>1을 문자 밑으로 그리며 지름 교점만 강제하는 문제 전용 비노출 그래프 기능 필요. a=4 그림을 문제축에 쓰면 정답 누설. |
| 순천/q18 | 해설 | BENEFICIAL | logarithmic-affine-spike-v1 | `q18-solution.plan.json` | PASS/PASS | PASS | 원 C 중심(17/8,0), r²=289/64, 로그밑4, P(1/4,−1),Q(4,1) 지름. |
| 순천/q19 | 문제 | BENEFICIAL | construction-spike-v1 | `q19-problem.plan.json` | PASS/PASS | PASS | n=5의 일반점 P(4,6)에서 그은 접선, 중심·두 원·OA⊥AP; f(n) 정답 비노출. |
| 순천/q19 | 해설 | BENEFICIAL | construction-spike-v1 | `q19-solution.plan.json` | PASS/PASS | PASS | 접선 직각과 원의 가까운·먼 끝점 ON=4√2, OF=6√2 실제 선분/치수. |
| 순천/q20 | 문제 | EXEMPT | — | — | N/A | N/A | 근호와 유리수 지수의 등식. |
| 순천/q20 | 해설 | EXEMPT | — | — | N/A | N/A | a의 지수를 통일해 푸는 대수식. |
| 순천/q21 | 문제 | ENGINE_CAPABILITY_PENDING | 미지 t의 지수곡선＋가변 정사각형 | — | N/A | PENDING | A(t,2⁻ᵗ), B·C·D, E 교점과 2S₂=3S₁을 모두 만족하는 기호 좌표/가변 정사각형 필요. 예시 t=0은 면적 조건 위반. |
| 순천/q21 | 해설 | ENGINE_CAPABILITY_PENDING | 초월수 높이·면적 비·교점 | — | N/A | PENDING | h=log₂(7/3), t=−log₂h인 비유리수 좌표와 정사각형·삼각형 경계 및 면적비 검증 기능 필요. |
| 순천/q22 | 문제 | BENEFICIAL | rational-spike-v1 | `q22-problem.plan.json` | PASS/PASS | PASS | 제1사분면 5/x 위 임의 P(1,5)의 동경과 θ 각호; 최적점 비노출. |
| 순천/q22 | 해설 | BENEFICIAL | rational-spike-v1 | `q22-solution.plan.json` | PASS/PASS | PASS | y=x와 y=5/x의 교점 P(√5,√5), θ=π/4 각호. |

## DRAWN_FEATURE_PARITY: 원문 ↔ 실제 그려지는 필드

| plan | 원문·풀이 조건 | 실제 렌더 필드(독립 관측 대상) | 결과 |
| --- | --- | --- | --- |
| q02-solution | y=3^(x−2)+4, 증가, 점근선 4 | `base:3`, `shiftX:2`, coefficients 1·1·4, `overlays.lines` y4, y4·5·7 눈금; 면 채움 없음 | PASS |
| q03-problem | y=log_(1/3)x, (1/2,1/2)를 지나는 y1/2 수평선 | `curves[0]` 감소로그, `[1]` y=x, `[2]` y1/2, B(1/2,1/2); 교점 E 좌표 없음 | PASS·정답 비노출 |
| q03-solution | a=(1/3)^(1/2)=√3/3 | 동일 세 곡선, `overlays.points[1]` E(√3/3,1/2), coordinates:true | PASS |
| q04-solution | f(x)=log x²=2log|x|, x≠0, f(−x)=f(x) | 왼편 로그 coefficients[2,−1,0,0] / 오른편[2,1,0,0], 서로 대칭이고 x0 제외 | PASS |
| q05-solution | −510°≡210° mod360, 제3사분면 | `POLAR_POINT` O,A 기준 angleDeg210, `planeMarks.angles` value210·style ARC, `displaySegments` OP 동경; 면 채움 없음 | PASS |
| q11-solution | t=log x, y=10^(−t²+6t−2), 최대 q=7 at t3 | `polynomial.coefficients` −2·6·−1, requiredPoints V(3,7), t 눈금 3; *원래 y(x)가 아닌 지수의 그래프*로 명시 | PASS |
| q12-problem | log₃(9(x+1)), log₃(x−2)−2, 4x+3y=5·20 | 두 LOGARITHMIC base3 coefficients [1,1,1,2]/[1,1,−2,−2], 두 LINE c0/c1=[5/3,−4/3]/[20/3,−4/3]; 영역의 네 경계 전부 실재, 면색 없음 | PASS·정답 비노출 |
| q15-solution | t=|x|≥0, F(t)=−t²+at+5, 자연수 로그값은 3·9·27 | 허용 *예시* a6의 포물선 coeff[5,6,−1], vertex(3,14), 3·9·27의 세 수평선; t>0의 1+2+0 교점 수 | PASS |
| q17-problem | 반감기 5700, 잔존 20% | `u=t/5700` 단위변환, base1/2 감소지수, `overlays.lines` y1/5, 해의 실제 연수·교점 좌표 표기 없음 | PASS·정답 비노출 |
| q18-solution | 원 C:(x−17/8)²+y²=289/64, 교점 P(1/4,−1),Q(4,1), a=4 | `overlays.circles` 중심17/8·0,r²289/64; `base:4`, `points` curveX1/4·4 `onCircle:C`와 좌표 라벨, segment PQ, 중심 M | PASS |
| q19-problem | n≥5, 두 √2 반지름 원, P_n에서 O원 접선, OA⊥AP | n5를 *대표 사례*로 SOURCE_POINT C(5,5),P(4,6), O; `displayCircles:k0,k1`, `INTERSECTION`/`SELECT_POINT` 접점 A, sOA·sAP·sOP·sCP, `rightAngles:rA`, `facts:TANGENT_PERPENDICULAR`; 극값 숫자 없음 | PASS·정답 비노출 |
| q19-solution | |OP| 범위 √2(n−1)..√2(n+1), 삼각형 OAP 직각 | 같은 두 원과 접선·직각, N=C−(1,1), F=C+(1,1); ON 선분 라벨4√2, OF 치수6√2, n5 예시를 일반 n으로 확대 설명 | PASS |
| q22-problem | x>0, P∈y=5/x, OP의 θ | `rational` 분자5/분모 x, 양수 branch 구간, O(0,0), 예시 P(1,5), segment OP, 양의 x축 기준 `overlays.angles[0]` 각호, 최적점 없음 | PASS·정답 비노출 |
| q22-solution | sinθ+cosθ≤√2, 등호 θ=π/4, x=y=√5 | 같은 rational, 보조선 y=x, `overlays.points` P(curveX √5)·coordinates:true, segment OP, 실제 45° `overlays.angles[0]` | PASS |

### 엔진 기능 대기 인계

| qid/축 | 현재 미지원 요소 | 필요한 공통 capability 개선 | 상태 |
| --- | --- | --- | --- |
| q10/해설 | √3 밑인 원함수와 4개의 혼합 로그/지수 변환, 대칭·평행이동 관계를 정확히 함께 비교 | `multi-curve`의 양의 근호 밑·로그/지수 혼합, 4종의 개별 비교 패널 | ENGINE_CAPABILITY_PENDING |
| q18/문제 | 미정 밑 a>1인 로그곡선과 원의 지름 교점 제약을 *a=4 노출 없이* 표시 | 기호 밑 로그곡선과 지름 조건의 제약 기반 렌더·관측 | ENGINE_CAPABILITY_PENDING |
| q21/문제 | A(t,2⁻ᵗ), B,C,D 및 E의 정확한 가변 위치와 2S₂=3S₁, 정답 비노출 | 지수곡선 연계 동적 정사각형/교점/면적비의 계산 노드·문자 표기 | ENGINE_CAPABILITY_PENDING |
| q21/해설 | h=log₂(7/3), t=−log₂ h, E의 초월함숫값과 정사각형·삼각형의 면적 관계 | 초월수 좌표·기호 치수 및 넓이 관계의 엔진/관측 지원 | ENGINE_CAPABILITY_PENDING |

기능 대기 4축은 **plan 미작성**, shallow/full `N/A`, `DRAWN_FEATURE_PARITY=PENDING`이며, 캡션만 있는 가짜 plan이나 근사·임의 점을 PASS로 세지 않는다.

### 검사·작업 경계

- `plan-lint.cjs --shallow`와 `plan-lint.cjs`(full: 실제 엔진 생성 SVG의 독립 관측 포함)는 따로 실행한다. 작성 14개 모두 각 모드 PASS; FAIL 0·SKIP 0.
- 각 plan의 `sourceConditions[].mappedTo` **81개 필드 경로 모두 실재 확인(81/81)** 및 그래프·좌표·각호·직각·길이·숫자를 원문 JS와 대조한다. 본 표의 PASS는 plan/렌더 필드의 1:1 조건 일치이며, **학생 화면·PNG·A4 인쇄 검수 PASS를 뜻하지 않는다**(이들 단계는 NOT_RUN).
- q03·q12·q17·q19·q22 문제축은 정답 수치, 정답 좌표·최댓값·최솟값·최적점의 비노출을 재확인한다.
- EXEMPT는 각 행의 개별 이유만을 뜻한다. 기하·곡선에 필요한 표식 하나가 빠져 있는데 EXEMPT나 그림 PASS로 판정하지 않는다.

**집계:** 22문항/44축 = 작성 BENEFICIAL 14축(문제 5, 해설 9) + EXEMPT 26축 + ENGINE_CAPABILITY_PENDING 4축. JSON 14개 + 본 장부 1개. shallow 14/14, full 14/14, `sourceConditions.mappedTo` 81/81 실재, `DRAWN_FEATURE_PARITY` 14/14 PASS, PENDING 4축. PR·운영 main SHA는 병합 결과로 확정한다.
