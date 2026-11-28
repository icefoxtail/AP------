# 25_강남여고_2학기_기말_고2_수학II_유사 — 2축 SVG plan 감사

- 원문: `archive/exams/similar/high/h2/2final/25_강남여고_2학기_기말_고2_수학II_유사.js` (현행 main).
- 25문항 × 2축 = **50축**을 각각 판정.
- 공식 실행형 plan: **18개**, 도형 불필요(EXEMPT): **32축**.
- 원본 직접 연결 SVG 11개 중 기본 흰색 배경 rect **11개** 확인(원본 자산 보존, 새 plan에서는 배경 채움 미지정).
- plan-lint shallow/full: **18/18 PASS** (최종 CLI 검증 결과와 동일).
- DRAWN_FEATURE_PARITY: **원문·에셋 ↔ 엔진 JSON 필드의 정적 1:1 대조**. PNG/실물 SVG/학생화면/A4 픽셀 검사는 **RENDER_NOT_RUN**, 즉 NOT_RUN이지 PASS가 아니다.
- 원본 JS·기존 SVG/PNG·다른 시험지는 수정하지 않았다. 기본 도형 면 채움 없음. 확률 영역·넓이 등 문제에 꼭 필요한 영역만 색으로 채운다.

| 파일/qid | 축 | 기존결함/판정·복원 기능 | 원본 에셋/조건 | 원본 배경 | capability | plan 경로 | plan-lint shallow/full | sourceVsPlan | DRAWN_FEATURE_PARITY | 렌더 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 25_강남여고_2학기_기말_고2_수학II_유사/q01 | 문항 | EXEMPT: 롤의 정리: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q01 | 해설 | EXEMPT: 롤의 정리: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q02 | 문항 | EXEMPT: 정적분의 계산: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q02 | 해설 | EXEMPT: 정적분의 계산: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q03 | 문항 | EXEMPT: 속도와 가속도: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q03 | 해설 | PLAN: 원본 해설의 v(t)=3(t−2)²−3, 꼭짓점 (2,−3), 수평 기준선 y=−3 | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q3-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q03-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q04 | 문항 | EXEMPT: 부정적분과 미분: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q04 | 해설 | EXEMPT: 부정적분과 미분: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q05 | 문항 | EXEMPT: 속도와 위치: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q05 | 해설 | PLAN: 원본 해설의 v(t)=10−2t, t=0·5·7 교점과 삼각형 면적 25 및 4 | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q5-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q05-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q06 | 문항 | EXEMPT: 평균값 정리: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q06 | 해설 | PLAN: 평균값 정리의 현 AB와 c=5/2에서 기울기 −1인 접선을 서로 다른 선으로 표시 | `원문 수식·조건` | — | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q06-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q07 | 문항 | EXEMPT: 극댓값과 극솟값: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q07 | 해설 | PLAN: f(x)=x³−3x²−9x+4의 극대점 (−1,9), 극소점 (3,−23)을 별도 라벨 | `원문 수식·조건` | — | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q07-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q08 | 문항 | PLAN: 원본 속도 꺾은선 O(0,0)·A(1,3)·B(3,−3)·C(4,−1)·D(6,0), t·v 축·좌표 안내 | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q8-readable-v2.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q08-problem.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q08 | 해설 | PLAN: 원본 속도 꺾은선의 t=2 부호 전환점 Z, 위쪽 면적 3과 아래쪽 면적 9/2를 각각 음영 | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q8-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q08-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q09 | 문항 | EXEMPT: 함수의 증가: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q09 | 해설 | EXEMPT: 함수의 증가: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q10 | 문항 | EXEMPT: 삼차방정식의 실근: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q10 | 해설 | PLAN: 원본 삼차함수의 극대 (−1,5), 극소 (3,−27), 수평선 y=5·y=−27 | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q10-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q10-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q11 | 문항 | EXEMPT: 함수의 대소 관계: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q11 | 해설 | PLAN: a=6인 경계 예시: h=f−g=(x−1)²(x+5)가 x>0에서 x=1에 접하는 최솟값 0 | `원문 수식·조건` | — | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q11-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q12 | 문항 | EXEMPT: 두 곡선 사이의 넓이: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q12 | 해설 | PLAN: 원본 두 포물선 x²−3x·−3x²+9x의 교점 x=0·3과 두 곡선 사이 의미 있는 음영 S | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q12-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q12-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q13 | 문항 | EXEMPT: 두 곡선 사이의 넓이: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q13 | 해설 | PLAN: 원문에 함수 식이 없으므로 임의 곡선을 꾸미지 않고 x=−3,0,2의 교점 순서와 위·아래 함수 구간을 정확히 색으로 구분 | `원문 수식·조건` | — | `number-line-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q13-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q14 | 문항 | EXEMPT: 정적분과 대칭함수: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q14 | 해설 | EXEMPT: 정적분과 대칭함수: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q15 | 문항 | EXEMPT: 도함수와 최솟값: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q15 | 해설 | PLAN: 원본 직선 f(x)=−2x+6, 점 A(1,4)·B(5,−4), x·y축·점 라벨 | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q15-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q15-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q16 | 문항 | EXEMPT: 증감표와 실근의 개수: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q16 | 해설 | PLAN: 사차함수의 세 극점과 수평선 y=9가 서로 다른 세 실근을 만드는 두 경우 a=4·9를 나란히 비교 | `원문 수식·조건` | — | `composite-panels-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q16-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q17 | 문항 | EXEMPT: 정적분의 성질: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q17 | 해설 | EXEMPT: 정적분의 성질: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q18 | 문항 | EXEMPT: 평균변화율과 도함수: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q18 | 해설 | EXEMPT: 평균변화율과 도함수: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q19 | 문항 | PLAN: 원본 업그레이드 도형의 포물선·O·P·밑변 삼등분 A,B·상단 C,D·직사각형 영역 | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q19-engine-upgrade.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q19-problem.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q19 | 해설 | PLAN: 원본 해설의 P(3,0), A(1,0)·B(2,0)·C(1,1)·D(2,1) 정사각형 | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q19-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q19-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q20 | 문항 | EXEMPT: 입체도형의 부피의 최댓값: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q20 | 해설 | PLAN: 3D 원기둥을 수작업 입체로 그리지 않고 해설에 명시된 정확한 축 단면의 닮음삼각형·두 직사각형·치수로 설계 | `원문 수식·조건` | — | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q20-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q21 | 문항 | EXEMPT: 적분으로 정의된 함수: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q21 | 해설 | EXEMPT: 적분으로 정의된 함수: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q22 | 문항 | EXEMPT: 접선의 방정식: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q22 | 해설 | PLAN: 원본 포물선 꼭짓점 (3,−1), 점 P(1,3) 접선 y=−4x+7, 보조선·축 | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q22-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q22-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q23 | 문항 | EXEMPT: 극솟값: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q23 | 해설 | PLAN: x=−1의 x축 접점이 극대이고 x=3의 극솟값이 −32인 삼차함수 개형 | `원문 수식·조건` | — | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q23-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q24 | 문항 | EXEMPT: 적분으로 정의된 함수의 극값: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q24 | 해설 | PLAN: 원본 삼차함수 y=2x³−3x²−12x의 극대 (−1,7), 극소 (2,−20) | `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/q24-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_수학II_유사/q24-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q25 | 문항 | EXEMPT: 부정적분: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_수학II_유사/q25 | 해설 | EXEMPT: 부정적분: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |

## 2026-11-27 독립 재검증: 문항별 2축 요약

- 최신 확인 기준: 원격 `origin/main`의 `ddb73cdab92709f7b7b85a9353595d59b7b0262f`. 이 시험지의 18개 plan과 50축 상세 감사는 그보다 앞선 `aaa40c235`에서 **이미 main에 존재**했다. 중복 제작하지 않고 원본의 정적 적합성을 재확인했다.
- 문제 25축 + 해설 25축 = **50/50축**. `REQUIRED` **2축**(문제 q08·q19), `BENEFICIAL` **16축**(해설), `EXEMPT` **32축**. 기존 공식 plan **18개**, 이번 수정 **0개**, 신규 **0개**. 그림 면제 이유는 위의 50축 상세 표에 각각 적었다.
- 연결 SVG **11개**(문제 2, 해설 9)를 원본 수식·꼭짓점·선·음영 의도와 정적으로 대조했다. `STATIC_FIELD_PARITY=PASS`는 JSON 필드 비교이며 실제 출력 확인이 아니다. `DRAWN_FEATURE_PARITY`는 원본이 있는 축의 **정적 일치**만 확인, 렌더 영상·벡터 출력의 일치는 확인하지 못했다.
- `JSON 파싱·스키마 18/18 PASS`, `Shallow lint 18/18 PASS`, `Full lint 18/18 PASS`, `STATIC_FIELD_PARITY 18 PASS / 32 N/A`, `ENGINE_CAPABILITY_PENDING 0`, `DRAWN_FEATURE_PARITY 실제 렌더 확인 0/18`.
- **RENDER_NOT_RUN**: 공식 `render-plan.mjs`로 q08 문제 plan을 실행했고, `GEOMETRY_BROWSER_EXECUTABLE=/usr/bin/chromium`도 지정했으나 `ARCHIVE_PREFLIGHT_FAIL` 발생. `/usr/bin/chromium`은 실행 래퍼만 있고 실제 `/usr/lib/chromium/chromium` 실행 파일이 없어 `exitCode=127`로 종료되었다. 엔진이 SVG를 출력하지 못했으므로 눈금·선·라벨·음영·불투명 흰 배경의 시각 검수를 **PASS라 판정하지 않는다**.

이 표의 `원본 SVG`는 `archive/assets/images/25_강남여고_2학기_기말_고2_수학II_유사/` 기준 파일명이다. `plan 파일`은 이 문서와 같은 디렉터리의 파일명이다. `정적 일치 / 렌더 보류`는 픽셀 검수가 아닌 원본 SVG의 좌표·의미와 plan 필드를 대조한 결과다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 롤의 정리 조건과 해가 식으로 충분하다. |
| 02 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 다항식의 정적분 계산만 필요하다. |
| 03 | EXEMPT | BENEFICIAL | `q3-solution.svg` | `q03-solution.plan.json` | PASS | 정적 일치 / 렌더 보류 | 속도 포물선 최솟점 (2,−3). |
| 04 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 부정적분의 미분 계산만 필요하다. |
| 05 | EXEMPT | BENEFICIAL | `q5-solution.svg` | `q05-solution.plan.json` | PASS | 정적 일치 / 렌더 보류 | 0~5 양의 면적, 5~7 음의 면적. |
| 06 | EXEMPT | BENEFICIAL | 없음 | `q06-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 할선·접선 기울기 −1의 관계. |
| 07 | EXEMPT | BENEFICIAL | 없음 | `q07-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 삼차함수 극대 9, 극소 −23. |
| 08 | REQUIRED | BENEFICIAL | `q8-readable-v2.svg`, `q8-solution.svg` | `q08-problem.plan.json`, `q08-solution.plan.json` | 2 PASS | 정적 일치 / 렌더 보류 | 다섯 점·네 선분, 속도의 양·음 적분 영역. |
| 09 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 매개변수 판별식으로 함수의 단조성을 결정한다. |
| 10 | EXEMPT | BENEFICIAL | `q10-solution.svg` | `q10-solution.plan.json` | PASS | 정적 일치 / 렌더 보류 | 두 극점과 수평선 y=5, −27. |
| 11 | EXEMPT | BENEFICIAL | 없음 | `q11-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | a=6에서 x=1의 접점. |
| 12 | EXEMPT | BENEFICIAL | `q12-solution.svg` | `q12-solution.plan.json` | PASS | 정적 일치 / 렌더 보류 | 두 포물선의 경계와 0~3 음영. |
| 13 | EXEMPT | BENEFICIAL | 없음 | `q13-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 곡선식 미제공: 임의 함수 대신 구간 경계만 수직선으로 표현. |
| 14 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 홀함수 적분의 대칭 성질은 식으로 완결. |
| 15 | EXEMPT | BENEFICIAL | `q15-solution.svg` | `q15-solution.plan.json` | PASS | 정적 일치 / 렌더 보류 | 기울기 −2인 최솟값 경계 직선. |
| 16 | EXEMPT | BENEFICIAL | 없음 | `q16-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 사차함수 극점·수평선의 두 경우 패널. |
| 17 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 적분구간 평행이동은 대수적 치환으로 충분. |
| 18 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 모든 실수에 대한 판별식 경계 계산. |
| 19 | REQUIRED | BENEFICIAL | `q19-engine-upgrade.svg`, `q19-solution.svg` | `q19-problem.plan.json`, `q19-solution.plan.json` | 2 PASS | 정적 일치 / 렌더 보류 | 문제 직사각형 표본 그림과 해설 정사각형을 구별. |
| 20 | EXEMPT | BENEFICIAL | 없음 | `q20-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 원뿔 단면의 두 직사각형·닮음·치수 표시. |
| 21 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 적분방정식의 두 번 미분으로 결정. |
| 22 | EXEMPT | BENEFICIAL | `q22-solution.svg` | `q22-solution.plan.json` | PASS | 정적 일치 / 렌더 보류 | 접점 (1,3), 직선 y=−4x+7. |
| 23 | EXEMPT | BENEFICIAL | 없음 | `q23-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | x=−1 접점과 x=3의 극소. |
| 24 | EXEMPT | BENEFICIAL | `q24-solution.svg` | `q24-solution.plan.json` | PASS | 정적 일치 / 렌더 보류 | 극대 (−1,7), 극소 (2,−20). |
| 25 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 미분방정식형 계수 비교만 필요하다. |
