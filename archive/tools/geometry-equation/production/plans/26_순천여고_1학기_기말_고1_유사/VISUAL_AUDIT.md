# 26_순천여고_1학기_기말_고1_유사 — 문항·해설 2축 전수 SVG 품질 감사

- 대상: `archive/exams/similar/high/h1/1final/26_순천여고_1학기_기말_고1_유사.js`
- **23문항 × 문제·해설 = 46축**. 각 축마다 발문·해설·현재 SVG/기출 원본 에셋과의 관계를 검사했다.
- `EXEMPT`는 그림이 문제 조건에 추가 정보를 주지 않아 해설·발문 수식만으로 충분하다는 판정이며, 누락된 그림의 PASS를 뜻하지 않는다.
- `FIELD_PASS`는 원문 수치·점·곡선·범위·표식 → plan JSON 필드를 정적으로 대조한 판정이다. 실제 새 SVG 렌더·PNG·학생 화면·A4 비교는 **NOT_RUN**이므로 시각적 1:1 출고 합격을 의미하지 않는다.
- 모든 신규 JSON은 공식 `plan-lint.cjs --shallow` / full에 통과했다. 기존 plan은 보존하고 새로운 plan은 `production/plans/<stem>/`에만 추가했다. 시험지 JS·원본 이미지 에셋은 변경하지 않았다.
- 기존 엔진 SVG 다수의 루트 `<rect fill="#fff">`는 엔진 캔버스 공통 출력이며 plan 필드만으로 억제할 수 없다. **투명 배경을 요구하는 경우 ENGINE_CAPABILITY_PENDING: TRANSPARENT_CANVAS**. 실내 면 채움은 신설 plan에 요구하지 않았고, 삼각형 넓이를 묻는 순천여고 q23 해설의 삼각형 강조만 예외다.
- 원본 기출과 유사판은 수치가 달라 **동일 픽셀**이 아니라 도형의 의미·인접·선·치수·표식·라벨 구조를 비교한다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_순천여고_1학기_기말_고1_유사/q01 | problem | EXEMPT — 곱의 법칙 연속 선택; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q01 | solution | EXEMPT — 곱의 법칙 연속 선택; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q02 | problem | EXEMPT — 조합 값 계산; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q02 | solution | EXEMPT — 조합 값 계산; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q03 | problem | EXEMPT — 자연수 순서쌍 열거; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q03 | solution | EXEMPT — 자연수 순서쌍 열거; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q04 | problem | EXEMPT — 행렬 곱 가능 크기 판정; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q04 | solution | EXEMPT — 행렬 곱 가능 크기 판정; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q05 | problem | EXEMPT — 절댓값 정수해; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q05 | solution | REPLAN — 해설 그림은 있으나 plan EXEMPT: 열린 경계 −7,5 및 정수 11개를 실행형으로 보강 | `number-line-figure-v1` | `q05-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q06 | problem | EXEMPT — 이차식 근과 계수; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q06 | solution | REPLAN — 기존 이차함수 SVG와 plan EXEMPT 불일치: 근 −3,4·꼭짓점 라벨 재설계 | `polynomial-spike-v1` | `q06-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q07 | problem | EXEMPT — 행렬 열벡터 복원; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q07 | solution | EXEMPT — 행렬 열벡터 복원; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q08 | problem | EXEMPT — 절댓값·이차 부등식 공통해; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q08 | solution | REPLAN — 기존 두 수직선 SVG와 plan EXEMPT 불일치: 겹침점 3과 경계 −1/2 보강 | `number-line-figure-v1` | `q08-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q09 | problem | EXEMPT — 행렬 거듭제곱; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q09 | solution | EXEMPT — 행렬 거듭제곱; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q10 | problem | EXEMPT — 치환 이차함수의 최댓값·최솟값; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q10 | solution | REPLAN — 치환 t의 범위 −1~3, 꼭짓점(2,−7)과 끝점 높이를 도식으로 보강 | `polynomial-spike-v1` | `q10-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q11 | problem | EXEMPT — 매개변수 전구간 이차부등식; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q11 | solution | REPLAN — 세 경우의 합집합 a∈[−2,4] 경계 라벨 보강 | `number-line-figure-v1` | `q11-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q12 | problem | EXEMPT — 절댓값 치환 이차함수의 극값; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q12 | solution | REPLAN — 치환 t=|x|의 영역과 꼭짓점·최댓값 끝점 시각화 | `polynomial-spike-v1` | `q12-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q13 | problem | EXEMPT — 모음·자음 순열; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q13 | solution | EXEMPT — 모음·자음 순열; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q14 | problem | EXEMPT — 근과 계수·행렬 항등식; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q14 | solution | EXEMPT — 근과 계수·행렬 항등식; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q15 | problem | EXEMPT — 허근의 대수적 성질; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q15 | solution | EXEMPT — 허근의 대수적 성질; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q16 | problem | EXEMPT — 다섯 자리 수 사전식 순열; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q16 | solution | EXEMPT — 다섯 자리 수 사전식 순열; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q17 | problem | EXEMPT — 주사위 판별식 정수 순서쌍; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q17 | solution | REPLAN — 기존 주사위 수직선 이미지의 정수 눈·b=1,3 조건을 실행형 필드로 정합 | `number-line-figure-v1` | `q17-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q18 | problem | EXEMPT — 다항식 항등식 계수 비교; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q18 | solution | EXEMPT — 다항식 항등식 계수 비교; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q19 | problem | EXEMPT — 판별식과 근 제곱합 최솟값; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q19 | solution | EXEMPT — 판별식과 근 제곱합 최솟값; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q20 | problem | EXEMPT — 삼차식 인수분해·두 근의 구간; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q20 | solution | REPLAN — 기존 k=3 해설 SVG의 두 구간 끝점·꼭짓점 계수를 plan에 복구 | `polynomial-spike-v1` | `q20-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q21 | problem | EXEMPT — 서로 다른 삼차방정식 세 실근 조건; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q21 | solution | REPLAN — 중근 충돌 a=0을 배제한 두 열린 구간 보강 | `number-line-figure-v1` | `q21-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q22 | problem | EXEMPT — 연립 이차부등식의 정수해 개수; 수식·문장 해석만으로 완결, 별도 도식이 새 관계를 주지 않음 | — | — | N/A | EXEMPT |
| 26_순천여고_1학기_기말_고1_유사/q22 | solution | REPLAN — 기존 2개 수직선 이미지를 n=6 대표 해집합·교집합 관계로 복구 | `number-line-figure-v1` | `q22-solution.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q23 | problem | REPLAN — 원본 기출 대비 꼭짓점 높이 보조점선·폭 8 m·높이 8 m·조명 25/2 m 라벨 누락 보강 | `piecewise-polynomial-spike-v1` | `q23-problem.plan.json` | PASS/PASS | FIELD_PASS · RENDER_NOT_RUN |
| 26_순천여고_1학기_기말_고1_유사/q23 | solution | KEEP — 기존 엔진 도식 보존; 삼각형 BDE 면 채움은 넓이를 묻는 필수 강조 | `piecewise-polynomial-spike-v1` | `archive/exams/similar/high/h1/1final/26_순천여고_1학기_기말_고1_유사_plans/q23-solution.plan.json` | PASS/PASS | EXISTING_SVG_STRUCTURE_SEEN · WHITE_CANVAS_PENDING |

**집계:** 46축 = 실행형 신규 11 / 기존 엔진 plan 1 / 엔진 기능 대기 0 / EXEMPT 34.

**검수 한계:** 신규 SVG 및 픽셀 1:1 검수는 실행되지 않았고, 기존 원본·유사 그림의 정적 구조와 JSON 필드 대응만 확인했다.
