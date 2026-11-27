# 효천고 21번대 유사시험지 SVG 플랜 — 문제·해설 전수 대조

- 원문: `archive/exams/similar/high/h2/1mid/21_효천고_1학기_중간_고2_수학I_유사.js` (SHA-256 `13e04126d23143fe614836cedc60643147610488fda767f959394490b6af4e8e`)
- 비교 기준: 원문 문항의 `content`, `choices`와 각 문항의 `solution`/풀이에 수록된 문자·수치·도형 조건. 문제 축에 해설 결과를 선제 기입하지 않는다.
- 표의 `plan`은 **이 파일과 같은 폴더 내**의 정확한 실행 JSON 파일명이다. `OK/OK`는 `plan-lint.cjs --shallow` 및 full 검증 결과이며 실제 Archive 렌더링 성공을 뜻하지 않는다.
- `EXEMPT`는 도형·그래프·수직선이 요구되지 않는 계산·문장형 문항으로, 빈 그림을 새로 만들지 않는다. `PASS`는 원문에서 *그릴 수 있는 시각 요소*와 플랜 필드의 정적 1:1 대조이며 SVG/PNG 육안 판정은 아니다.
- 전체 21문항 = 42축: `EXEMPT` 30, 플랜으로 시각 요소 정합 `PASS` 6, `ENGINE_CAPABILITY_PENDING` 6. 실제 실행 가능한 플랜 9개는 shallow/full 모두 `OK`(9/9). 기본 흰색 사각형과 임의 면 채움은 전부 배제했다.

| qid | 축 | 판정 | capability | plan | plan-lint shallow/full | DRAWN_FEATURE_PARITY | 원문 대비 검수 / 필요한 기능 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| q01 | 문제 | EXEMPT | — | — | N/A | N/A | 지수·로그 계산식, 도형 없음 |
| q01 | 해설 | EXEMPT | — | — | N/A | N/A | 거듭제곱 전개와 수치 계산만 필요 |
| q02 | 문제 | EXEMPT | — | — | N/A | N/A | 로그 진수의 정의역을 묻는 문장·부등식 |
| q02 | 해설 | BENEFICIAL | number-line-figure-v1 | `q02-solution.plan.json` | OK/OK | PASS | 경계 3·4·7, 열린 경계 3·4·7, 허용 구간 (3,4)∪(4,7) 모두 표시 |
| q03 | 문제 | EXEMPT | — | — | N/A | N/A | 지수 방정식 계산 |
| q03 | 해설 | EXEMPT | — | — | N/A | N/A | 대수적 지수 변형 |
| q04 | 문제 | EXEMPT | — | — | N/A | N/A | 데시벨의 로그식 및 수치만 제시 |
| q04 | 해설 | EXEMPT | — | — | N/A | N/A | 로그 비율 계산, 좌표 시각화 불필요 |
| q05 | 문제 | EXEMPT | — | — | N/A | N/A | 밑이 1/3인 지수부등식 |
| q05 | 해설 | EXEMPT | — | — | N/A | N/A | 지수 비교로 x>−4만 산출 |
| q06 | 문제 | EXEMPT | — | — | N/A | N/A | 로그 수치표가 이미 문자 자료이며 새 도형 불필요 |
| q06 | 해설 | EXEMPT | — | — | N/A | N/A | 로그 성질에 따른 표 값 계산 |
| q07 | 문제 | EXEMPT | — | — | N/A | N/A | 평행이동 관계가 문자식으로만 출제됨 |
| q07 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `q07-solution.plan.json` | OK/OK | PASS | 원함수 log₂(x−1)+4와 결과 log₂(4x−16), 각 점근선·절편 위치, 점선 이동 보조선 두 축 대조 |
| q08 | 문제 | EXEMPT | — | — | N/A | N/A | 망각 곡선의 로그 함수 *수치* 문제로 그래프 조건 없음 |
| q08 | 해설 | EXEMPT | — | — | N/A | N/A | 진수 대입·로그 연산 |
| q09 | 문제 | EXEMPT | — | — | N/A | N/A | 지수식 인수분해 |
| q09 | 해설 | EXEMPT | — | — | N/A | N/A | 인수분해 계산과 항등식 설명 |
| q10 | 문제 | EXEMPT | — | — | N/A | N/A | 로그 수치 비교 |
| q10 | 해설 | EXEMPT | — | — | N/A | N/A | 수치 비교·거듭제곱 성질 |
| q11 | 문제 | EXEMPT | — | — | N/A | N/A | 방정식의 로그 근 |
| q11 | 해설 | EXEMPT | — | — | N/A | N/A | 근과 계수의 관계 전개 |
| q12 | 문제 | EXEMPT | — | — | N/A | N/A | 로그 합·차 수식 |
| q12 | 해설 | EXEMPT | — | — | N/A | N/A | 연쇄 소거 계산 |
| q13 | 문제 | EXEMPT | — | — | N/A | N/A | −500°와 각 선택지가 문자 수치로 주어짐 |
| q13 | 해설 | BENEFICIAL | construction-spike-v1 | `q13-solution.plan.json` | OK/OK | PASS | 동경의 위치가 220°·제3사분면임을 원점 O, 기준축, 동경과 각호/사분면 표시로 대조; 동경 좌표는 정밀 유리수 근사 |
| q14 | 문제 | REQUIRED | construction-spike-v1 | `q14-problem.plan.json` | OK/OK | PASS | 반지름 5 cm, 호 길이 4 cm, 중심 O, 양 끝점과 부채꼴 호·길이 인출선 모두 묘사; 면 채움 없음 |
| q14 | 해설 | BENEFICIAL | construction-spike-v1 | `q14-solution.plan.json` | OK/OK | PASS | 동일 부채꼴에 중심각 4/5 rad 각호/라벨 추가, 반지름·호 길이 유지 |
| q15 | 문제 | EXEMPT | — | — | N/A | N/A | 사인·코사인 대수식 |
| q15 | 해설 | EXEMPT | — | — | N/A | N/A | 삼각함수 항등식 계산 |
| q16 | 문제 | EXEMPT | — | — | N/A | N/A | 주기 관련 3개 함수가 식으로만 열거됨 |
| q16 | 해설 | ENGINE_CAPABILITY_PENDING | composite-trigonometric-graph | — | N/A | PENDING | **필요 기능:** `|cos 2x|+π`의 합성 절댓값 삼각 곡선·무리수 수직이동, `π sin(x/2)`, `tan(x/3)` 세 그래프를 동일/분리 좌표계에서 함께 배치하고 주기 라벨을 검증하는 복합 엔진 |
| q17 | 문제 | EXEMPT | — | — | N/A | N/A | 최대·최소와 특정 x/y 조건은 문장으로 제시 |
| q17 | 해설 | BENEFICIAL | trigonometric-spike-v1 | `q17-solution.plan.json` | OK/OK | PASS | 최대 5·최소 −3, x=−π/6 극대, x=π/6에서 y=3을 만족하는 코사인 곡선과 핵심 점·보조선 |
| q18 | 문제 | ENGINE_CAPABILITY_PENDING | trigonometric-spike-v1 + trig-right-angle | `q18-problem.plan.json` | OK/OK | PENDING | sin(πx/6), x∈[0,6], 그래프 위 A·D, x축 B·C, AB·BC·CD·DA, BC=2와 점 라벨은 그림에 존재. **직각 표식 B/C 누락**: trig `equalUnits`/`overlays.rightAngles`를 full 엔진이 `ANGLE_REQUIRES_EQUAL_UNITS`로 거부 |
| q18 | 해설 | ENGINE_CAPABILITY_PENDING | trigonometric-spike-v1 + trig-right-angle | `q18-solution.plan.json` | OK/OK | PENDING | A(2,√3/2)·D(4,√3/2), B(2,0)·C(4,0)과 네 변·BC=2는 표시. **필요 기능:** 진짜 수직각 직각 네모 두 개를 검증 가능한 동일 축척 삼각 그래프에서 표기 |
| q19 | 문제 | EXEMPT | — | — | N/A | N/A | k,a를 알 수 없는 원문 조건에 임의 그래프를 선제 삽입하지 않음 |
| q19 | 해설 | ENGINE_CAPABILITY_PENDING | trigonometric-spike-v1 + trig-exact-pi-roots | `q19-solution.plan.json` | OK/OK | PENDING | 실행 JSON은 `k=4π,a=1/2`에서 **교점 순서만** 시연하며 원문의 `sin(α+β+γ+δ)=1/2`를 만족하지 않음을 명시. **필요 기능:** 해설 최댓값 `k=96`을 위한 sin(24x)의 π/144,5π/144,7π/144,11π/144 곡선상 교점과 합 π/6의 **정확한 π 좌표 오버레이** (현재 `PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED` 거부) |
| q20 | 문제 | ENGINE_CAPABILITY_PENDING | log-exp-parametric-rectangles | — | N/A | PENDING | 두 그래프 y=log₂x, y=2^x 및 P/Q 직사각형의 정의·교차 영역이 원문의 핵심. **필요 기능:** 변수 a에 따른 log₂(log₂a) 정확 좌표, 두 직사각형과 교집합 영역을 미정 변수 상태로 렌더링 |
| q20 | 해설 | ENGINE_CAPABILITY_PENDING | log-exp-parametric-rectangles | — | N/A | PENDING | 해설에서 a=256, n=8, 겹침 x∈[3,16]·y∈[0,4]를 얻음. **필요 기능:** x=3,16,256 간극에서 P/Q·교집합의 수치 정확성을 유지할 축 절단/연동 패널·직사각형 영역 라벨 |
| q21 | 문제 | EXEMPT | — | — | N/A | N/A | 상용로그 정수부분 합의 산술 조건 |
| q21 | 해설 | EXEMPT | — | — | N/A | N/A | 범위별 정수부분 계산; 그래프 필수 조건 없음 |

## 한계·보류·실행 환경

1. `q18`의 JSON은 **실제 엔진에서 통과하는 부분 플랜**으로 보존했다. 점/선/BC 길이는 실행 가능하지만 직각 2개를 그리지 못하므로 1:1 `PASS`로 세탁하지 않는다. 직각 오버레이를 넣으면 full lint가 `ANGLE_REQUIRES_EQUAL_UNITS`로 거부함을 재현했다.
2. `q19`는 **순서용 실행 예시**만 가능하고 원문의 k 최댓값·교점합을 만족하는 정확한 π 좌표 라벨은 지원되지 않는다. `q16` 해설과 `q20` 양축도 엔진에 없는 수식 합성·변수 좌표·축 절단을 가상 JSON 속성으로 적지 않고 명시적 `ENGINE_CAPABILITY_PENDING`으로 남겼다.
3. 모든 작성 플랜에서 흰색 배경 도형과 임의 `fill`/`regions`가 없다. 직각 외 보조선·점선·각호·길이·라벨은 존재하는 시각 요소 각각과 대조했다.
4. 실제 SVG/PNG 렌더/눈으로 보는 Archive parity: **ENV_BLOCKED**, `archive/engine.html`은 복구했으나 Playwright가 기대하는 Chrome 설치가 없고 시스템 `/usr/bin/chromium`도 본체 `/usr/lib/chromium/chromium` 부재. `plan-lint` 성공을 시각 렌더 성공으로 대체 표기하지 않는다.
