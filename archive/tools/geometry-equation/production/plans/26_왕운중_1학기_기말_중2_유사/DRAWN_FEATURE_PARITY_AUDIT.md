# 26_왕운중_1학기_기말_중2_유사 — DRAWN_FEATURE_PARITY 1:1 축별 감사

대상: 지정된 **유사** 시험지 24문항 × 문제·해설 2축 = 48축. 다른 시험지 원본·JS·이미지는 변경하지 않았다.

검사 상태: **plan-lint shallow/full 통과(표에서 PASS/PASS)** · `RENDER_NOT_RUN` (2026-11-27 컨테이너 Chromium 실행파일 없음, exit 127). 아래 `STATIC_1:1`은 텍스트/원본 에셋과 plan의 **그릴 요소 목록**을 대조했다는 뜻이며, 픽셀 렌더 패리티를 입증하지 않는다.

공통 엔진 한계: `ENGINE_CAPABILITY_PENDING: TRANSPARENT_SVG_CANVAS_BACKGROUND_OPTOUT` — 기존 유사 SVG 6개 모두 내부에 `fill="#fff"` 배경 사각형을 가진다. plan JSON에는 바탕 면 채움 설정을 넣지 않았으나 현 엔진의 자동 흰색 바탕을 plan만으로 해제할 수 없다. SVG 직접 수정/손 SVG는 금지되어 수행하지 않았다.

- [대조] 원본 4개 PNG 및 유사 SVG 2개(q08/24); q15/q18은 원본 이미지를 보조 근거로 문제 축도 신규 설계했다.
- [변경] q08의 원본 PNG(상3/중5/하3)를 그대로 복제하면 유사 JS(상5/하6)에 위배되므로 유사 발문 5+6을 우선했다.
- [근사 한계] q15 부호만 정해진 문자 기울기의 그래프, q18 풀이 전 문자 직선은 원문 관계를 보이는 대표 개형이다; 계수값이 미정일 때 정확한 파라미터 렌더는 엔진 미지원.
- [3경우] q24 해결은 a=1, -2, 4/3 세 개의 경우를 필요로 하나 현재 3패널 '일차 다중직선' 표시가 미지원이다. 4/3 공점 사례 플랜을 실행형으로 제공하고 평행 사례는 해설 캡션에 명시했다.

| 파일/qid | 축 | 기존 결함 / 판정 및 원본 대조 | capability | plan 경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| `26_왕운중_1학기_기말_중2_유사.js/q01` | problem | EXEMPT — 미지수 이개 일차방정식 성립 조건 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q01` | solution | EXEMPT — 미지수 이개 일차방정식 성립 조건 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q02` | problem | EXEMPT — 자연수 순서쌍 열거 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q02` | solution | EXEMPT — 자연수 순서쌍 열거 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q03` | problem | EXEMPT — 식에 순서쌍 대입 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q03` | solution | EXEMPT — 식에 순서쌍 대입 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q04` | problem | EXEMPT — 연립방정식 두 번 풀이 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q04` | solution | EXEMPT — 연립방정식 두 번 풀이 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q05` | problem | EXEMPT — 순환소수 분수 변환 계산 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q05` | solution | EXEMPT — 순환소수 분수 변환 계산 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q06` | problem | EXEMPT — 연립방정식 대입 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q06` | solution | EXEMPT — 연립방정식 대입 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q07` | problem | EXEMPT — 연립방정식 해의 존재 조건 선택형, 그림 대신 계수 비교 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q07` | solution | EXEMPT — 연립방정식 해의 존재 조건 선택형, 그림 대신 계수 비교 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q08` | problem | 유사본문: 가로 타일 5장 위, 세로 타일 6장 아래 (원본 PNG의 3·5·3 배열과 다름), 실제 내부선 총 9개, 둘레 164cm 외곽 지시, 새 미지수 값 없음 [원본 q8.png] | `construction-spike-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q08-problem.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q08` | solution | 5y=6x, 총높이 x+y 및 큰 둘레 164cm를 읽는 11장 타일 구조; 불필요한 면 채움 없음 [원본 q8.png] | `construction-spike-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q08-solution.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q09` | problem | EXEMPT — 함수 대응 여부의 텍스트 선택형 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q09` | solution | EXEMPT — 함수 대응 여부의 텍스트 선택형 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q10` | problem | EXEMPT — f(2), f(b) 대입 계산 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q10` | solution | EXEMPT — f(2), f(b) 대입 계산 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q11` | problem | EXEMPT — 발문 그래프 평행이동/x절편 조건 완전 기술; 해설 원·이동 직선 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q11` | solution | 원래 직선 y=-3x-2와 아래로 4 이동한 y=-3x-6, x절편 -2 [원본 PNG 없음] | `multi-curve-figure-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q11-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q12` | problem | EXEMPT — 다섯 함수의 기울기·절편 계수 비교, 여러 개형은 정보 과잉 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q12` | solution | EXEMPT — 다섯 함수의 기울기·절편 계수 비교, 여러 개형은 정보 과잉 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q13` | problem | EXEMPT — 기울기 Δy/Δx 계산으로 후보 판별 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q13` | solution | EXEMPT — 기울기 Δy/Δx 계산으로 후보 판별 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q14` | problem | EXEMPT — 문제는 두 점과 미지좌표를 문장 완전 제시; 해설 3점 그래프 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q14` | solution | 두 주어진 점 (-2,1),(3,11), 확인점(1,7), 기울기2 [원본 PNG 없음] | `piecewise-polynomial-spike-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q14-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q15` | problem | 원본 이미지의 제1·2·4사분면 통과 개형, 음의 기울기/양의 y절편, 숫자는 대표값만 사용 [원본 q15.png] | `multi-curve-figure-v1 + ENGINE_CAPABILITY_PENDING: SYMBOLIC_PARAMETER_LINE` | `production/plans/26_왕운중_1학기_기말_중2_유사/q15-problem.plan.json` | PASS/PASS | SIGN_STRUCTURE_1:1 · NUMERIC_SCHEMATIC · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q15` | solution | 양의 기울기/음의 y절편인 결과 개형: 제2사분면 미통과 [원본 q15.png] | `multi-curve-figure-v1 + ENGINE_CAPABILITY_PENDING: SYMBOLIC_PARAMETER_LINE` | `production/plans/26_왕운중_1학기_기말_중2_유사/q15-solution.plan.json` | PASS/PASS | SIGN_STRUCTURE_1:1 · NUMERIC_SCHEMATIC · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q16` | problem | EXEMPT — 문제는 배터리 변화율·시작치 문장 완전 제시, 해설 경과시간 그래프 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q16` | solution | 잔량 100에서 시작해 125분에 0인 직선, 실생활 단위 경계 [원본 PNG 없음] | `piecewise-polynomial-spike-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q16-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q17` | problem | EXEMPT — 발문은 일차방정식 그래프의 성질 선택지; 해설 절편 그래프 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q17` | solution | y=4x/3-2/3, x절편 1/2 및 y절편 -2/3 [원본 PNG 없음] | `piecewise-polynomial-spike-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q17-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q18` | problem | 원본 삼각형 A,B,C, 수평 y=3, 우하강 y=-2x+11, 부호미정 직선, A의 x=k 보조선 (원본 우하강 상수9→유사11) [원본 q18.png] | `multi-curve-figure-v1 + ENGINE_CAPABILITY_PENDING: SYMBOLIC_PARAMETER_LINE` | `production/plans/26_왕운중_1학기_기말_중2_유사/q18-problem.plan.json` | PASS/PASS | A/B/C_TOPOLOGY_1:1 · NUMERIC_SCHEMATIC · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q18` | solution | A(2,7),B(0,3),C(4,3), BC=4·높이4, A축 점선, 세 직선 [원본 q18.png] | `multi-curve-figure-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q18-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q19` | problem | EXEMPT — 발문은 수직선의 x좌표 일치 문장만으로 완결; 해설 도형 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q19` | solution | x=9 수직선 및 (9,5),(9,7) 두 점; y축 평행 [원본 PNG 없음] | `construction-spike-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q19-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q20` | problem | EXEMPT — 발문은 일치·평행 조건을 대수식으로 기술; 해설 직선 두 개 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q20` | solution | 일치한 직선과 다른 절편의 평행 직선; 중복된 일치선은 하나로 표시 [원본 PNG 없음] | `multi-curve-figure-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q20-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q21` | problem | EXEMPT — x=y-4 포함한 대수 풀이 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q21` | solution | EXEMPT — x=y-4 포함한 대수 풀이 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q22` | problem | EXEMPT — 계단 가위바위보 승패 수 연립방정식 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q22` | solution | EXEMPT — 계단 가위바위보 승패 수 연립방정식 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q23` | problem | EXEMPT — 발문 두 학생이 잘못 그린 직선의 점·절편을 말로 제시; 해설 3직선 복원 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_왕운중_1학기_기말_중2_유사.js/q23` | solution | 민수 오류 직선, 수진 오류 직선, 복원한 참직선 3개, (5,10) 확인 [원본 PNG 없음] | `multi-curve-figure-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q23-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q24` | problem | 두 주어진 직선, 셋째 미정직선의 고정 y절편 (0,4); 풀이 전 a값을 표시하지 않음 (원본은 다른 계수식) [원본 q24.png] | `multi-curve-figure-v1` | `production/plans/26_왕운중_1학기_기말_중2_유사/q24-problem.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_왕운중_1학기_기말_중2_유사.js/q24` | solution | a=4/3 세 직선 공점(-3,0) 사례 시각화, a=1/-2 평행 사례는 캡션 기재, 별도 3패널 엔진 미지원 [원본 q24.png] | `multi-curve-figure-v1 + ENGINE_CAPABILITY_PENDING: THREE_CASE_LINEAR_MULTI_CURVE_PANELS` | `production/plans/26_왕운중_1학기_기말_중2_유사/q24-solution.plan.json` | PASS/PASS | PARTIAL: 1/3 경우 그림, 2/3 문장 · RENDER_NOT_RUN |

## 축별 추가 검증

- 공식 plan: **15개** / 48축, 나머지 **33축 EXEMPT**; 두 축 중 필요한 시각요소가 있는 축만 계획 대상으로 삼았다.
- 유사 JS 원문 인용 `sourceConditions`의 출처·교점·라벨을 수학식으로 교차 검산했다. 원본 PNG와 유사 수치가 다른 경우 정답 누출을 막고 유사발문 조건을 우선했다.
- 흰 기본 배경 제거는 **미지원으로 공개**하며, 명시적으로 면을 칠한 곳은 동산중 q11의 넓이 정의역뿐이다.
- `DRAWN_FEATURE_PARITY`의 픽셀/타이포그래피 최종 통과는 Chromium이 작동하는 환경에서 렌더 후 별도 필요하다.
