# 26_순천고_2학기_중간_고2_확률과통계_유사2 — SVG 2축 정밀 재감사

- 원문: `archive/exams/similar/high/h2/2mid/26_순천고_2학기_중간_고2_확률과통계_유사2.js` (main 읽기 기준 `6364a72256ad659a112922e76ad9fa29b87c0f81`).
- 분모: 24 qid × 문항·해설 2축 = **48축**. 대상 외 JS·기존 PNG/SVG 변경 없음.
- 새 production 실행형 plan: **6개**(q14 문제/해설, q15 해설, q19 해설, q20 해설, q23 해설); q16 해설 **ENGINE_CAPABILITY_PENDING 1축**.
- 원본 이미지 3개 q14/q16/q20을 육안 확인. q14 원본 PNG의 C는 왼쪽 **맨 위**라 현행 유사2의 C 좌표와 다르므로 plan에서 정확한 C 위치로 다시 그림. q16은 4×5 격자, q20은 A~F 시계방향 점을 유지.
- 시각 정보 정적 대조: q14 그리드·C·금지 진입 분기, q15 수형도 확률 합, q19 벤다이어그램 영역, q20 선분·각도·직각 마크, q23 초기 선택 분기까지 plan 구조를 직접 점검. **실제 SVG 픽셀을 그려 비교하지 않았으므로 DRAWN_FEATURE_PARITY 최종 PASS가 아님**.
- 별도 순수 JS 독립 산술: q14 통과 금지 DP 종착값 **132**, q15 각 분기의 확률합 1. 둘 다 원문 풀이값과 일치.
- `plan-lint.cjs --shallow`: **NOT_RUN**. `plan-lint.cjs` full: **NOT_RUN**. 실행 컨테이너가 plan-lint 이전에 연결 종료되어 공식 검사 불가. JSON 파싱·tree 확률 합·DP 재계산은 공식 lint 대체 불가.
- 공식 render-plan: **RENDER_NOT_RUN** (Chrome 유무를 확인할 수 없는 상태에서 컨테이너 연결 종료). 학생 화면·A4·원본 이미지 대비 최종 픽셀 일치 검증: **NOT_RUN**.
- 흰색 면 채움·임의 반투명 폴리곤은 계획에 넣지 않았다. q19의 사건 영역 음영만 문제의 두 사건을 설명하는 의미 있는 사용이다. 엔진이 기본 바탕으로 넣는 배경은 plan만으로 해제할 수 없으며 엔진 실제 출력 검사가 남았다.
- q16 해설의 필요 기능: **4열×5행 정사각형 격자와 정확히 두 칸씩**의 수평·수직·대각 접촉 분류를 동일 비율로 그리며, 칸 테두리/강조선/필요 시 차별화된 해칭, 접촉점 표시, 소스와의 개별 칸 위치 1:1 대응, 불필요한 면 채움 없음. 현행 capability로 확실히 실행된 근거가 없어 임의 근사본을 PASS로 두지 않았다.
- 현행 유사2 JS의 일부 `solutionImageAlt`·`solutionImageCaption`에는 이전 문항의 수치(예: q14의 C 경로, q15의 같은 색, q16의 가로·세로 인접쌍, q23의 3문)가 잔존한다. 이번 범위는 production plan뿐이므로 JS는 변경하지 않았으며 학생 표시 여부를 후속 확인할 것.

## 문항별 감사표

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 유사2/q01 | 문항 | EXEMPT — 이항식 계수 산술 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q01 | 해설 | EXEMPT — 이항식 계수 산술 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q02 | 문항 | EXEMPT — 배반사건의 확률 수식 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q02 | 해설 | EXEMPT — 배반사건의 확률 수식 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q03 | 문항 | EXEMPT — 중복순열·중복조합의 산술 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q03 | 해설 | EXEMPT — 중복순열·중복조합의 산술 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q04 | 문항 | EXEMPT — 사건의 등식 비교 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q04 | 해설 | EXEMPT — 사건의 등식 비교 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q05 | 문항 | EXEMPT — 시행 횟수·상대도수 HTML 표 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q05 | 해설 | EXEMPT — 시행 횟수·상대도수 HTML 표 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q06 | 문항 | EXEMPT — 조건부확률 수식 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q06 | 해설 | EXEMPT — 조건부확률 수식 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q07 | 문항 | EXEMPT — 이항계수 값의 계산 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q07 | 해설 | EXEMPT — 이항계수 값의 계산 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q08 | 문항 | EXEMPT — 전개식의 특정 항 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q08 | 해설 | EXEMPT — 전개식의 특정 항 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q09 | 문항 | EXEMPT — 학년별 참가자 수를 이용한 조건부확률 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q09 | 해설 | EXEMPT — 학년별 참가자 수를 이용한 조건부확률 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q10 | 문항 | EXEMPT — 거듭제곱의 끝자리 계산 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q10 | 해설 | EXEMPT — 거듭제곱의 끝자리 계산 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q11 | 문항 | EXEMPT — 자릿수 합을 세는 정수해 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q11 | 해설 | EXEMPT — 자릿수 합을 세는 정수해 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q12 | 문항 | EXEMPT — 글자 순서·자리 제한 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q12 | 해설 | EXEMPT — 글자 순서·자리 제한 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q13 | 문항 | EXEMPT — 함숫값의 배수 조건 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q13 | 해설 | EXEMPT — 함숫값의 배수 조건 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q14 | 문항 | 기존 q14.png의 C 좌표 불일치 → 좌표·금지 진입 도로를 재설계 | `lattice-path-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q14-problem.plan.json` | NOT_RUN (환경 연결 종료) | NOT_RUN (렌더 및 독립 픽셀 검수 없음) |
| 유사2/q14 | 해설 | 기존 q14.png의 C 좌표 불일치 → 좌표·금지 진입 도로를 재설계 | `lattice-path-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q14-solution.plan.json` | NOT_RUN (환경 연결 종료) | NOT_RUN (렌더 및 독립 픽셀 검수 없음) |
| 유사2/q15 | 문항 | EXEMPT — 동전 분기에 따른 추출확률 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q15 | 해설 | 확률 분기를 현행 해설값으로 교체한 수형도 | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q15-solution.plan.json` | NOT_RUN (환경 연결 종료) | NOT_RUN (렌더 및 독립 픽셀 검수 없음) |
| 유사2/q16 | 문항 | 4×5 원본 격자 PNG의 칸 수·선 위치 확인, 현행 이미지 유지 | `기존 PNG` | `assets/images/26_순천고_2학기_중간_고2_확률과통계/q16.png` | N/A (기존 PNG) | 원본 PNG 구조 확인; 신규 SVG 렌더 N/A |
| 유사2/q16 | 해설 | ENGINE_CAPABILITY_PENDING: 4×5 칸 중 대각으로 꼭짓점만 만나는 두 칸을 원본과 동등한 정사각형 윤곽·표식으로 표시 필요 | `GRID_CELL_PAIR_HIGHLIGHT (미지원 스펙 확인 필요)` | `— (부정확한 근사 plan 생성 안 함)` | N/A (실행형 plan 없음) | ENGINE_CAPABILITY_PENDING |
| 유사2/q17 | 문항 | EXEMPT — 함수 값 합과 순서 제약 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q17 | 해설 | EXEMPT — 함수 값 합과 순서 제약 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q18 | 문항 | EXEMPT — 부분집합 세 개의 조건부 선택 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q18 | 해설 | EXEMPT — 부분집합 세 개의 조건부 선택 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q19 | 문항 | EXEMPT — 세 카드의 합·곱 사건 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q19 | 해설 | 겹침 또는 대칭차 사건·실제 504 표본공간 표시 | `set-diagram-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q19-solution.plan.json` | NOT_RUN (환경 연결 종료) | NOT_RUN (렌더 및 독립 픽셀 검수 없음) |
| 유사2/q20 | 문항 | A~F의 시계방향 6점 PNG 확인, 불필요한 색칠 없이 현행 이미지 유지 | `기존 PNG` | `assets/images/26_순천고_2학기_중간_고2_확률과통계/q20.png` | N/A (기존 PNG) | 원본 PNG 구조 확인; 신규 SVG 렌더 N/A |
| 유사2/q20 | 해설 | 불필요한 현·중심 보조점 제거, 지름/직각 또는 둔각 호 표식 유지 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q20-solution.plan.json` | NOT_RUN (환경 연결 종료) | NOT_RUN (렌더 및 독립 픽셀 검수 없음) |
| 유사2/q21 | 문항 | EXEMPT — 이항계수 매개변수 서술형 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q21 | 해설 | EXEMPT — 이항계수 매개변수 서술형 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q22 | 문항 | EXEMPT — 순서 있는 비음수 정수해 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q22 | 해설 | EXEMPT — 순서 있는 비음수 정수해 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q23 | 문항 | EXEMPT — 사회자 공개에 따른 선택 변경 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q23 | 해설 | 변경된 문 개수·공개 규칙에 맞춘 확률 수형도 | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q23-solution.plan.json` | NOT_RUN (환경 연결 종료) | NOT_RUN (렌더 및 독립 픽셀 검수 없음) |
| 유사2/q24 | 문항 | EXEMPT — 서로소·자연수 순서쌍 세기 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q24 | 해설 | EXEMPT — 서로소·자연수 순서쌍 세기 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
