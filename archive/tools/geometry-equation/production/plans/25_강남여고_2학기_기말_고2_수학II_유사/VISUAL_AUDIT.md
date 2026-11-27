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
