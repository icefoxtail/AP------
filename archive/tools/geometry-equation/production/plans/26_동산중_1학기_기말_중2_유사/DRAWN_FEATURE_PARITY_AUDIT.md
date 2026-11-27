# 26_동산중_1학기_기말_중2_유사 — DRAWN_FEATURE_PARITY 1:1 축별 감사

대상: 지정된 **유사** 시험지 24문항 × 문제·해설 2축 = 48축. 다른 시험지 원본·JS·이미지는 변경하지 않았다.

검사 상태: **plan-lint shallow/full 통과(표에서 PASS/PASS)** · `RENDER_NOT_RUN` (2026-11-27 컨테이너 Chromium 실행파일 없음, exit 127). 아래 `STATIC_1:1`은 텍스트/원본 에셋과 plan의 **그릴 요소 목록**을 대조했다는 뜻이며, 픽셀 렌더 패리티를 입증하지 않는다.

공통 엔진 한계: `ENGINE_CAPABILITY_PENDING: TRANSPARENT_SVG_CANVAS_BACKGROUND_OPTOUT` — 기존 유사 SVG 6개 모두 내부에 `fill="#fff"` 배경 사각형을 가진다. plan JSON에는 바탕 면 채움 설정을 넣지 않았으나 현 엔진의 자동 흰색 바탕을 plan만으로 해제할 수 없다. SVG 직접 수정/손 SVG는 금지되어 수행하지 않았다.

- [대조] 원본 6개 PNG 및 유사 SVG 4개(q04/09/15/20); q11은 유사 SVG가 없어 도형 축을 신규 설계했다.
- [구조] sourceConditions는 유사 JS의 해당 발문에 연결되고, 원본의 치수·수치는 원본과 유사발문이 다를 때 유사발문 값을 따른다.
- [면/배경] q11 APCD만 넓이 식별을 위해 연한 면 채움 사용. 다른 플랜에는 사용자 지정 배경/면 채움 없음.

| 파일/qid | 축 | 기존 결함 / 판정 및 원본 대조 | capability | plan 경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| `26_동산중_1학기_기말_중2_유사.js/q01` | problem | EXEMPT — 함수 대응 여부에 관한 선택지 논리, 기하/좌표그림 없음 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q01` | solution | EXEMPT — 함수 대응 여부에 관한 선택지 논리, 기하/좌표그림 없음 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q02` | problem | EXEMPT — f(4) 대입 계산 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q02` | solution | EXEMPT — f(4) 대입 계산 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q03` | problem | EXEMPT — 일차함수 꼴 식별만 필요 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q03` | solution | EXEMPT — 일차함수 꼴 식별만 필요 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q04` | problem | 원본 대응: 원직선+수직 평행이동선 2개; 유사 수치 y=4x, -5 (원본 y=2x, -3과 값 다름); 정답 식 라벨 숨김 [원본 q04.png] | `multi-curve-figure-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q04-problem.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q04` | solution | y=4x·y=4x-5 두 직선 및 y축 이동량 5 점선 [원본 q04.png] | `multi-curve-figure-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q04-solution.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q05` | problem | EXEMPT — 기울기·y절편 단순 계수 대입 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q05` | solution | EXEMPT — 기울기·y절편 단순 계수 대입 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q06` | problem | EXEMPT — 발문은 수식·설명 선택형, 해설 좌표그래프 제공 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q06` | solution | 기울기 -3, 두 절편 (0,6)·(2,0) 점; 원본 선 기울기/절편은 유사조건으로 변경 [원본 q06.png] | `piecewise-polynomial-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q06-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q07` | problem | EXEMPT — 발문은 증가량과 감소량을 문장으로 완전 제시, 해설에 보조선 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q07` | solution | Δx=3, Δy=-2 방향·점선 보조선; 기울기 -2/3 [원본 PNG 없음] | `piecewise-polynomial-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q07-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q08` | problem | EXEMPT — 문제는 두 직선의 관계를 문장으로 완전 제시, 해설에 세 직선 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q08` | solution | 기울기 -3인 평행선 2개와 y절편 -3을 공유하는 직선 [원본 PNG 없음] | `multi-curve-figure-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q08-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q09` | problem | x절편 -3, y절편 -6 원본(-5,-4)에서 변경, 두 축 절편 좌표 표시 [원본 q09.png] | `piecewise-polynomial-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q09-problem.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q09` | solution | x/y절편 좌표와 축 지시 점선, 직선 y=-2x-6 [원본 q09.png] | `piecewise-polynomial-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q09-solution.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q10` | problem | EXEMPT — 미정 a,b의 부호·사분면 논리 문제: 정확한 개형은 문자 계수 미지원, 수치 임의 대입 방지 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q10` | solution | EXEMPT — 미정 a,b의 부호·사분면 논리 문제: 정확한 개형은 문자 계수 미지원, 수치 임의 대입 방지 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q11` | problem | ABCD 직사각형, A-P 연결, P 우향 이동(아래쪽 별도 화살표), 20cm·8cm 치수선, 두 직각 및 구하는 APCD 음영(원본25cm·10cm에서 변경) [원본 q11.png] | `construction-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q11-problem.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q11` | solution | 문제 축 전체 유지, BP=2x 길이 식만 해설 추가, APCD 면 채움은 넓이 구분용 필수 [원본 q11.png] | `construction-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q11-solution.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q12` | problem | EXEMPT — 미지수 2개인 일차방정식 식별, 그림 불필요 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q12` | solution | EXEMPT — 미지수 2개인 일차방정식 식별, 그림 불필요 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q13` | problem | EXEMPT — 순서쌍 대입과 자연수 해의 개수 비교, 표/그림 불필요 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q13` | solution | EXEMPT — 순서쌍 대입과 자연수 해의 개수 비교, 표/그림 불필요 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q14` | problem | EXEMPT — 문제는 식에 대한 설명만 선택; 해설 절편 그래프 제공 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q14` | solution | 2x+3y-6=0의 양 절편 (3,0), (0,2) 및 하강 직선 [원본 PNG 없음] | `piecewise-polynomial-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q14-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q15` | problem | 원본 세로선 x=4 → 유사 수평선 y=-3으로 조건 변화, 문제조건 (0,-3) 및 수평관계 정확히 반영 [원본 q15.png] | `construction-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q15-problem.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q15` | solution | y=-3 수평 직선, (0,-3) 표시 [원본 q15.png] | `construction-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q15-solution.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q16` | problem | EXEMPT — (2,-1) 순서쌍 대입 판별 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q16` | solution | EXEMPT — (2,-1) 순서쌍 대입 판별 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q17` | problem | EXEMPT — 연립방정식 가감·대입의 순수 계산 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q17` | solution | EXEMPT — 연립방정식 가감·대입의 순수 계산 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q18` | problem | EXEMPT — 계수 오독을 정정하는 방정식 대입, 좌표그림은 풀이에 기여하지 않음 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q18` | solution | EXEMPT — 계수 오독을 정정하는 방정식 대입, 좌표그림은 풀이에 기여하지 않음 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q19` | problem | EXEMPT — 소수·분수 연립방정식 정리·가감만 필요 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q19` | solution | EXEMPT — 소수·분수 연립방정식 정리·가감만 필요 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q20` | problem | 문제의 두 미정계수 직선, 교점 (1,3), x/y축까지 점선 (원본 교점은(2,3)) [원본 q20.png] | `multi-curve-figure-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q20-problem.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q20` | solution | 해를 대입한 두 직선 y=2x+1, y=-2x+5, 교점과 양축까지 점선 [원본 q20.png] | `multi-curve-figure-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q20-solution.plan.json` | PASS/PASS | TARGET_TEXT_1:1 · ORIGINAL_ADAPTATION · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q21` | problem | EXEMPT — 발문은 대수적인 평행/일치 조건 완전 제시; 해설 시각화 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q21` | solution | 한 쌍은 기울기 -2인 평행 이직선, 셋째 직선은 첫째와 일치 [원본 PNG 없음] | `multi-curve-figure-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q21-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |
| `26_동산중_1학기_기말_중2_유사.js/q22` | problem | EXEMPT — 원문 온도 표의 수치만으로 함수식 구성; 표는 SVG가 아닌 원문 마크다운 그대로 유지 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q22` | solution | EXEMPT — 원문 온도 표의 수치만으로 함수식 구성; 표는 SVG가 아닌 원문 마크다운 그대로 유지 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q23` | problem | EXEMPT — 나이 차이 문장제 연립방정식 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q23` | solution | EXEMPT — 나이 차이 문장제 연립방정식 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q24` | problem | EXEMPT — 발문에서 두 직선 방정식과 x축 조건이 완전 제시; 해설에 삼각형 | `EXEMPT` | — | N/A | N/A (시각 잉크 없음) |
| `26_동산중_1학기_기말_중2_유사.js/q24` | solution | 두 직선, 절편 (-6,0),(4,0), 교점 (2,4), 축 지시선, 삼각형 외곽, 면 채움 없음 [원본 PNG 없음] | `piecewise-polynomial-spike-v1` | `production/plans/26_동산중_1학기_기말_중2_유사/q24-solution.plan.json` | PASS/PASS | STATIC_1:1 · RENDER_NOT_RUN |

## 축별 추가 검증

- 공식 plan: **16개** / 48축, 나머지 **32축 EXEMPT**; 두 축 중 필요한 시각요소가 있는 축만 계획 대상으로 삼았다.
- 유사 JS 원문 인용 `sourceConditions`의 출처·교점·라벨을 수학식으로 교차 검산했다. 원본 PNG와 유사 수치가 다른 경우 정답 누출을 막고 유사발문 조건을 우선했다.
- 흰 기본 배경 제거는 **미지원으로 공개**하며, 명시적으로 면을 칠한 곳은 동산중 q11의 넓이 정의역뿐이다.
- `DRAWN_FEATURE_PARITY`의 픽셀/타이포그래피 최종 통과는 Chromium이 작동하는 환경에서 렌더 후 별도 필요하다.
