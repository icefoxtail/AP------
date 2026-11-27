# 26_순천고_2학기_중간_고2_확률과통계_유사 — SVG 2축 정밀 재감사

- 원문: `archive/exams/similar/high/h2/2mid/26_순천고_2학기_중간_고2_확률과통계_유사.js` (main 읽기 기준 `6364a72256ad659a112922e76ad9fa29b87c0f81`).
- 분모: 24 qid × 문항·해설 2축 = **48축**. 대상 외 JS·기존 PNG/SVG 변경 없음.
- 새 production 실행형 plan: **6개**(q14 문제/해설, q15 해설, q19 해설, q20 해설, q23 해설); q16 해설 **ENGINE_CAPABILITY_PENDING 1축**.
- 기존 PNG q14/q16/q20 3개를 직접 재열람. q14 원본 PNG의 C는 왼쪽 **맨 위**라 현행 유사의 C 좌표와 다르므로 plan에서 정확한 C 위치로 다시 그림. q16은 4×5 격자, q20은 A~F 시계방향 점을 유지.
- 원문·원본 PNG·그려지는 필드 1:1 정적 대조: q14 격자/C/금지 진입선, q15 TREE 확률, q19 VENN 사건·영역, q20 시계방향 6점/지름·직각 또는 120° 각호, q23 TREE 분기 전부 **STATIC_PASS**. 실물 SVG 화소·학생 화면·A4 결과와 혼동하지 않는다.
- 독립 조합 열거: q14 최단경로 252 / C 회피 231, q16 인접쌍 가로 15·세로 16·대각 24(전체 190), q19 E 180·F 384·교집합 168·대칭차 228(전체 504), q20 직각 12/20·둔각 6/20, q15 답 5/7, q23 교체 3/4; JS 해설과 맞음.
- `plan-lint.cjs --shallow`: **PASS 6/6** (두 시험지 합계 12/12, FAIL 0, SKIP 0).
- 공식 `plan-lint.cjs` full: **PASS 6/6** (두 시험지 합계 12/12, FAIL 0, SKIP 0; 정본 SHA 기준). 렌더: **RENDER_NOT_RUN**. 유사1 q20 공식 렌더를 시도했으나 Chromium 래퍼가 실제 `/usr/lib/chromium/chromium` 바이너리를 못 찾아 `ARCHIVE_PREFLIGHT_FAIL` 발생. 다른 plan 렌더/PNG/학생 화면/A4는 NOT_RUN.
- 흰색 면 채움·임의 반투명 폴리곤은 계획에 넣지 않았다. q19의 사건 영역 음영만 문제의 두 사건을 설명하는 의미 있는 사용이다. 엔진이 기본 바탕으로 넣는 배경은 plan만으로 해제할 수 없으며 엔진 실제 출력 검사가 남았다.
- q16 해설의 필요 기능: **4열×5행 정사각형 격자와 정확히 두 칸씩**의 수평·수직·대각 접촉 분류를 동일 비율로 그리며, 칸 테두리/강조선/필요 시 차별화된 해칭, 접촉점 표시, 소스와의 개별 칸 위치 1:1 대응, 불필요한 면 채움 없음. 현행 capability로 확실히 실행된 근거가 없어 임의 근사본을 PASS로 두지 않았다.
- 원본 JS·기존 PNG/SVG는 수정하지 않았다. q14 기존 원본 PNG는 현재 C=(0,3)과 다르므로 게시 때 참조하지 않는다.

- 분류 합계: **EXEMPT 39축 / 기존 문제 PNG 2축 / 공식 실행 plan 6축 / ENGINE_CAPABILITY_PENDING 1축 = 48축**. 실물 렌더·학생 화면·A4는 미확인 상태다.

## 문항별 감사표

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 유사/q01 | 문항 | EXEMPT — 이항식 계수 산술 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q01 | 해설 | EXEMPT — 이항식 계수 산술 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q02 | 문항 | EXEMPT — 배반사건의 확률 수식 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q02 | 해설 | EXEMPT — 배반사건의 확률 수식 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q03 | 문항 | EXEMPT — 중복순열·중복조합의 산술 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q03 | 해설 | EXEMPT — 중복순열·중복조합의 산술 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q04 | 문항 | EXEMPT — 사건의 등식 비교 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q04 | 해설 | EXEMPT — 사건의 등식 비교 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q05 | 문항 | EXEMPT — 시행 횟수·상대도수 HTML 표 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q05 | 해설 | EXEMPT — 시행 횟수·상대도수 HTML 표 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q06 | 문항 | EXEMPT — 조건부확률 수식 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q06 | 해설 | EXEMPT — 조건부확률 수식 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q07 | 문항 | EXEMPT — 이항계수 값의 계산 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q07 | 해설 | EXEMPT — 이항계수 값의 계산 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q08 | 문항 | EXEMPT — 전개식의 특정 항 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q08 | 해설 | EXEMPT — 전개식의 특정 항 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q09 | 문항 | EXEMPT — 학년별 참가자 수를 이용한 조건부확률 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q09 | 해설 | EXEMPT — 학년별 참가자 수를 이용한 조건부확률 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q10 | 문항 | EXEMPT — 거듭제곱의 끝자리 계산 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q10 | 해설 | EXEMPT — 거듭제곱의 끝자리 계산 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q11 | 문항 | EXEMPT — 자릿수 합을 세는 정수해 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q11 | 해설 | EXEMPT — 자릿수 합을 세는 정수해 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q12 | 문항 | EXEMPT — 글자 순서·자리 제한 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q12 | 해설 | EXEMPT — 글자 순서·자리 제한 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q13 | 문항 | EXEMPT — 함숫값의 배수 조건 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q13 | 해설 | EXEMPT — 함숫값의 배수 조건 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q14 | 문항 | 기존 q14.png의 C 좌표 불일치 → 좌표·금지 진입 도로를 재설계 | `lattice-path-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사/q14-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사/q14 | 해설 | 기존 q14.png의 C 좌표 불일치 → 좌표·금지 진입 도로를 재설계 | `lattice-path-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사/q14-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사/q15 | 문항 | EXEMPT — 동전 분기에 따른 추출확률 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q15 | 해설 | 확률 분기를 현행 해설값으로 교체한 수형도 | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사/q15-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사/q16 | 문항 | 4×5 원본 격자 PNG의 칸 수·선 위치 확인, 현행 이미지 유지 | `기존 PNG` | `assets/images/26_순천고_2학기_중간_고2_확률과통계/q16.png` | N/A (기존 PNG) | 원본 PNG 구조 확인; 신규 SVG 렌더 N/A |
| 유사/q16 | 해설 | ENGINE_CAPABILITY_PENDING: 가로·세로 변 공유와 대각 꼭짓점 공유의 세 쌍을 각각 정확한 칸 윤곽으로 식별 필요 | `GRID_CELL_PAIR_HIGHLIGHT (미지원 스펙 확인 필요)` | `— (부정확한 근사 plan 생성 안 함)` | N/A (실행형 plan 없음) | ENGINE_CAPABILITY_PENDING |
| 유사/q17 | 문항 | EXEMPT — 함수 값 합과 순서 제약 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q17 | 해설 | EXEMPT — 함수 값 합과 순서 제약 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q18 | 문항 | EXEMPT — 부분집합 세 개의 조건부 선택 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q18 | 해설 | EXEMPT — 부분집합 세 개의 조건부 선택 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q19 | 문항 | EXEMPT — 세 카드의 합·곱 사건 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q19 | 해설 | 겹침 또는 대칭차 사건·실제 504 표본공간 표시 | `set-diagram-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사/q19-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사/q20 | 문항 | A~F의 시계방향 6점 PNG 확인, 불필요한 색칠 없이 현행 이미지 유지 | `기존 PNG` | `assets/images/26_순천고_2학기_중간_고2_확률과통계/q20.png` | N/A (기존 PNG) | 원본 PNG 구조 확인; 신규 SVG 렌더 N/A |
| 유사/q20 | 해설 | AD 지름·ABD 직각사각 표식을 실제 필드에 유지, 중심 O·기준점 X는 숨김, 불필요한 현·면 채움 제거 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사/q20-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사/q21 | 문항 | EXEMPT — 이항계수 매개변수 서술형 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q21 | 해설 | EXEMPT — 이항계수 매개변수 서술형 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q22 | 문항 | EXEMPT — 순서 있는 비음수 정수해 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q22 | 해설 | EXEMPT — 순서 있는 비음수 정수해 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사/q23 | 문항 | EXEMPT — 사회자 공개에 따른 선택 변경 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q23 | 해설 | 변경된 문 개수·공개 규칙에 맞춘 확률 수형도 | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사/q23-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사/q24 | 문항 | EXEMPT — 서로소·자연수 순서쌍 세기 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사/q24 | 해설 | EXEMPT — 서로소·자연수 순서쌍 세기 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
