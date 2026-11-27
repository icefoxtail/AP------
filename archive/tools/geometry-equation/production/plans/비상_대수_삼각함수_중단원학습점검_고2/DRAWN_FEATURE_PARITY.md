# 비상 대수·삼각함수 중단원 학습점검(고2) — 원문/에셋 ↔ plan 그림 필드 대조

- 원본 JS: `archive/exams/textbooks/비상교육_대수/비상_대수_삼각함수_중단원학습점검_고2/비상_대수_삼각함수_중단원학습점검_고2.js`
- 분모: 18문항 × 문제/해설 2축 = **36축**. 원본 PNG `q13.png`, `q16.png` 두 개를 개별로 열어 비교.
- plan 폴더/경로 접두사: `archive/tools/geometry-equation/production/plans/비상_대수_삼각함수_중단원학습점검_고2/`. 아래 `qXX-*.plan.json`은 전부 이 경로에 있다.
- 신규 **9 plan / 7축**(`q04`, `q10` 해설은 별도 두 도식). 전체 shallow **9/9 PASS**, full **9/9 PASS**. 정적 DRAWN_FEATURE_PARITY **5축 PASS**, **2축 ENGINE_CAPABILITY_PENDING**. 기존 원본 에셋 유지 2축, 독립 도해 없는 수식/텍스트형 27축 EXEMPT.
- 실제 **SVG·PNG·학생 화면·A4 렌더 검수는 모두 NOT_RUN**. `PASS`는 원문의 좌표/수식/사분면/축·점선·교점 조건과 plan의 **그려지는 필드**를 비교한 정적 판정이며, 렌더 퀄리티 PASS를 뜻하지 않는다. 캡션으로만 보충한 미지원 선·교점은 PASS에서 제외.
- `ASSET_KEEP`은 원본 PNG 보존이고, `EXEMPT`는 그림 없는 축이므로 렌더 성과에 포함하지 않는다. 문제 축에 해설 정답 값이 나오지 않도록 분리하였다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 중단원/q01 | 문제 | 도·라디안 변환 수식형 | EXEMPT | — | — | EXEMPT |
| 중단원/q01 | 해설 | 단위 변환 계산형 | EXEMPT | — | — | EXEMPT |
| 중단원/q02 | 문제 | 표준각 함수값 계산형 | EXEMPT | — | — | EXEMPT |
| 중단원/q02 | 해설 | 삼각함수 값 대입 계산형 | EXEMPT | — | — | EXEMPT |
| 중단원/q03 | 문제 | P(−1,√3) 좌표·동경 텍스트 조건 | EXEMPT | — | — | EXEMPT |
| 중단원/q03 | 해설 | 제2사분면·수선·2 길이값을 실제 삼각형으로 명확화 | construction-spike-v1 | `q03-solution.plan.json` | PASS/PASS | **PASS**: P(−1,√3), O/수선발, 직각·변1/√3/2 |
| 중단원/q04 | 문제 | `sin x` 방정식/ `tan x` 부등식 수식 | EXEMPT | — | — | EXEMPT |
| 중단원/q04 | 해설 | 사인 교점은 그림에 실현; 탄젠트의 `y=√3/3` 기준선은 미지원 | trigonometric-spike-v1 × 2 | `q04-solution.plan.json` + `q04-solution-tan.plan.json` | PASS/PASS (2건) | **ENGINE_CAPABILITY_PENDING**: `TRIG_TAN_REFERENCE_LINES_UNSUPPORTED`; 사인 `−√3/2` 선·교점과 탄젠트 극은 PASS, 탄젠트 비교선/열린 구간 음영 미완 |
| 중단원/q05 | 문제 | 같은 동경 `θ,6θ` 조건 | EXEMPT | — | — | EXEMPT |
| 중단원/q05 | 해설 | `θ=4π/5` 해 계산, 그림 필수 아님 | EXEMPT | — | — | EXEMPT |
| 중단원/q06 | 문제 | 부채꼴 둘레와 넓이 최대화 수식 | EXEMPT | — | — | EXEMPT |
| 중단원/q06 | 해설 | 이차식 최대값 계산 | EXEMPT | — | — | EXEMPT |
| 중단원/q07 | 문제 | `sinθtanθ>0,cosθtanθ<0` 사분면 조건 | EXEMPT | — | — | EXEMPT |
| 중단원/q07 | 해설 | 부호판정으로 4사분면 결정 | EXEMPT | — | — | EXEMPT |
| 중단원/q08 | 문제 | `cosθ=−4/5` 제2사분면 텍스트 | EXEMPT | — | — | EXEMPT |
| 중단원/q08 | 해설 | 3-4-5 삼각형에 제2사분면 좌표·길이·직각 보강 | construction-spike-v1 | `q08-solution.plan.json` | PASS/PASS | **PASS**: x−4/y3/r5, 수선·직각·라벨 |
| 중단원/q09 | 문제 | `sinθ+cosθ=1/2` 항등식 | EXEMPT | — | — | EXEMPT |
| 중단원/q09 | 해설 | 제곱하여 `tanθ+cotθ` 계산 | EXEMPT | — | — | EXEMPT |
| 중단원/q10 | 문제 | 사인·코사인 그래프 식의 주기/치역 비교 | EXEMPT | — | — | EXEMPT |
| 중단원/q10 | 해설 | 두 함수의 진폭·위상·상하이동을 각각 독립 그래프로 | trigonometric-spike-v1 × 2 | `q10-solution.plan.json` + `q10-solution-cos.plan.json` | PASS/PASS (2건) | **PASS**: 사인 `2sin(x/2−π/3)−1`, 코사인 `(1/2)cos(2(x−π/6))+2`, 각 주기·극값 |
| 중단원/q11 | 문제 | 삼각함수 항등식 수식형 | EXEMPT | — | — | EXEMPT |
| 중단원/q11 | 해설 | 치환·항등식 계산 | EXEMPT | — | — | EXEMPT |
| 중단원/q12 | 문제 | `cos x=1/3`, 구간 수식 | EXEMPT | — | — | EXEMPT |
| 중단원/q12 | 해설 | 사분면 부호·제곱근 계산 | EXEMPT | — | — | EXEMPT |
| 중단원/q13 | 문제 | 원본 `q13.png` 코사인 그래프: 극값1/−3, 주기2π/3을 문제 그대로 유지 | ASSET_KEEP | 원본 `q13.png` | 해당 없음 | ASSET_KEEP: 위상/값 검토, 정답식 비노출 |
| 중단원/q13 | 해설 | 원본 주기·진폭·중심선을 `2cos(3x)−1` 실그래프로 정밀화 | trigonometric-spike-v1 | `q13-solution.plan.json` | PASS/PASS | **PASS**: x축 π 눈금·최댓값/최솟값·실제 코사인 곡선 |
| 중단원/q14 | 문제 | `sin(2πx)=3/5` 근 합 수식 | EXEMPT | — | — | EXEMPT |
| 중단원/q14 | 해설 | 주기/해의 대칭을 이용한 대수 풀이 | EXEMPT | — | — | EXEMPT |
| 중단원/q15 | 문제 | `sin²x−6sinx+6k−4>0` 전구간 부등식 | EXEMPT | — | — | EXEMPT |
| 중단원/q15 | 해설 | `t=sin x` 치역상 최소 계산, 도해 필수 아님 | EXEMPT | — | — | EXEMPT |
| 중단원/q16 | 문제 | 원본 `q16.png` 사인 곡선·수평선·넓이 대상 BOC 삼각형 보존 | ASSET_KEEP | 원본 `q16.png` | 해당 없음 | ASSET_KEEP: y5√2/4·A/B/C/D 네 교점 확인 |
| 중단원/q16 | 해설 | 교점 좌표 1/2,3/2,9/2,11/2와 BOC 삼각형·보조선 보강 | trigonometric-spike-v1 | `q16-solution.plan.json` | PASS/PASS | **PASS**: 정확한 사인 그래프/수평선·B/C·OB/OC/BC·넓이 영역만 연한 채움 |
| 중단원/q17 | 문제 | 탄젠트와 기울기 −5/2 직선의 교점 개수, 원문 수식형 | EXEMPT | — | — | EXEMPT |
| 중단원/q17 | 해설 | 탄젠트 두 점근선/세 가지는 구현, 비교 직선·교점 3개가 캡션에만 존재 | trigonometric-spike-v1 | `q17-solution.plan.json` | PASS/PASS | **ENGINE_CAPABILITY_PENDING**: `TRIG_TAN_OBLIQUE_REFERENCE_LINES_AND_INTERSECTIONS`; `y=−5x/2+k` 세 교점을 같은 축에 표시하는 엔진 기능 필요 |
| 중단원/q18 | 문제 | 지수·로그·삼각함수 부호 비교 부등식 | EXEMPT | — | — | EXEMPT |
| 중단원/q18 | 해설 | `π/4<x<π/2` 부등식 풀이, 도형 필수 아님 | EXEMPT | — | — | EXEMPT |

## 렌더 후속 체크와 엔진 이슈

1. **q04/해설**: `TRIG_TAN_REFERENCE_LINES_UNSUPPORTED` — `y=tan x`의 `y=√3/3` 수평선을 그리고 네 분기에서 엄격부등식 해당 구간을 구분할 기능 필요. `q04-solution-tan`은 점근선과 기준 x 눈금만 실제 표시한다. `q04-solution` 사인 부분 PASS만으로 전체 축 PASS를 세지 않았다.
2. **q17/해설**: `TRIG_TAN_OBLIQUE_REFERENCE_LINES_AND_INTERSECTIONS` — `y=tan(πx)`, `0<x<2`에서 `y=−(5/2)x+k`를 같은 축에 그리고 `0<k<5`에서 세 교점을 검증하는 기능 필요. 현재 세 그래프 가지/극만 구현.
3. 다른 도해는 기본 흰 배경/불필요한 면 채움 요소를 **추가하지 않았음**. `q16` 해설의 연한 삼각형 채움은 문제에서 묻는 넓이 영역 표시라 의도적으로 유지.
4. 원본 JS/PNG는 수정하지 않음. 렌더/게시 후 연결, 라벨 충돌·눈금 가독성·학생 화면/A4 표시는 `NOT_RUN` 상태로 인계.
