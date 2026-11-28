# 26_순천고_2학기_중간_고2_확률과통계_유사2 — SVG 2축 정밀 재감사

- 원문: `archive/exams/similar/high/h2/2mid/26_순천고_2학기_중간_고2_확률과통계_유사2.js` (main 읽기 기준 `6364a72256ad659a112922e76ad9fa29b87c0f81`).
- 분모: 24 qid × 문항·해설 2축 = **48축**. 대상 외 JS·기존 PNG/SVG 변경 없음.
- 기존 production 실행형 plan: **6개 중 유지 4·메타데이터 수정 2·신규 0**(q14 문제/해설, q15 해설, q19 해설, q20 해설, q23 해설); q16 해설 **ENGINE_CAPABILITY_PENDING 1축**. q14 문제축·q23 해설축의 빠진 `accessibilityDescription`만 보완했다.
- 기존 PNG q14/q16/q20 3개를 직접 재열람. q14 원본 PNG의 C는 왼쪽 **맨 위**라 현행 유사2의 C 좌표와 다르므로 plan에서 정확한 C 위치로 다시 그림. q16은 4×5 격자, q20은 A~F 시계방향 점을 유지.
- 원문·원본 PNG·그려지는 필드 1:1 정적 대조: q14 격자/C/금지 진입선, q15 TREE 확률, q19 VENN 사건·영역, q20 시계방향 6점/지름·직각 또는 120° 각호, q23 TREE 분기 전부 **STATIC_PASS**. 실물 SVG 화소·학생 화면·A4 결과와 혼동하지 않는다.
- 독립 조합 열거: q14 최단경로 252 / C 회피 132, q16 인접쌍 가로 15·세로 16·대각 24(전체 190), q19 E 180·F 384·교집합 168·대칭차 228(전체 504), q20 직각 12/20·둔각 6/20, q15 답 39/112, q23 교체 2/5; JS 해설과 맞음.
- `plan-lint.cjs --shallow`: **PASS 6/6**, FAIL 0, SKIP 0.
- 공식 `plan-lint.cjs` full: **PASS 6/6**, FAIL 0, SKIP 0. 렌더: **RENDER_NOT_RUN 6/6**. 이번 사이클에도 Chromium 실행 파일을 새로 검사했으나 `/usr/bin/chromium --version`이 127로 실패하고 실제 `/usr/lib/chromium/chromium` 바이너리가 없다. SVG 화소/학생 화면/A4는 검증하지 못했다.
- 흰색 면 채움·임의 반투명 폴리곤은 계획에 넣지 않았다. q19의 사건 영역 음영만 문제의 두 사건을 설명하는 의미 있는 사용이다. 엔진이 기본 바탕으로 넣는 배경은 plan만으로 해제할 수 없으며 엔진 실제 출력 검사가 남았다.
- q16 해설의 필요 기능: **4열×5행 정사각형 격자에서 대각 방향으로 꼭짓점 하나만 공유하는 두 칸**을 실제 칸 윤곽/접점·강조선으로 보이고, 3×4개의 2×2 블록마다 대각쌍 2개(총 24쌍)를 설명하는 기능 `GRID_CELL_PAIR_HIGHLIGHT`. 임의 면 채움 없이 대응 칸을 식별해야 한다. 현행 capability로 실행한 근거가 없어 근사본을 PASS로 두지 않았다.
- 원본 JS·기존 PNG/SVG는 수정하지 않았다. 유사2 q14/q15/q16/q20/q23의 `solutionImageAlt`·`solutionImageCaption`에는 현행 문항과 다른 과거 숫자·설명이 남아 있지만, 해당 qid의 `solutionImage` 참조는 없다. 이번 plan 전담 범위 밖이므로 게시 연결 전에 정정해야 한다.

- 분류 합계: **EXEMPT 39축 / 기존 문제 PNG 2축 / 공식 실행 plan 6축 / ENGINE_CAPABILITY_PENDING 1축 = 48축**. 실물 렌더·학생 화면·A4는 미확인 상태다.

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
| 유사2/q14 | 문항 | 기존 q14.png의 C 좌표 불일치 → 좌표·금지 진입 도로를 재설계 | `lattice-path-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q14-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사2/q14 | 해설 | 기존 q14.png의 C 좌표 불일치 → 좌표·금지 진입 도로를 재설계 | `lattice-path-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q14-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사2/q15 | 문항 | EXEMPT — 동전 분기에 따른 추출확률 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q15 | 해설 | 확률 분기를 현행 해설값으로 교체한 수형도 | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q15-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사2/q16 | 문항 | 4×5 원본 격자 PNG의 칸 수·선 위치 확인, 현행 이미지 유지 | `기존 PNG` | `assets/images/26_순천고_2학기_중간_고2_확률과통계/q16.png` | N/A (기존 PNG) | 원본 PNG 구조 확인; 신규 SVG 렌더 N/A |
| 유사2/q16 | 해설 | ENGINE_CAPABILITY_PENDING: 4×5 칸 중 대각으로 꼭짓점만 만나는 두 칸을 원본과 동등한 정사각형 윤곽·표식으로 표시 필요 | `GRID_CELL_PAIR_HIGHLIGHT (미지원 스펙 확인 필요)` | `— (부정확한 근사 plan 생성 안 함)` | N/A (실행형 plan 없음) | ENGINE_CAPABILITY_PENDING |
| 유사2/q17 | 문항 | EXEMPT — 함수 값 합과 순서 제약 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q17 | 해설 | EXEMPT — 함수 값 합과 순서 제약 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q18 | 문항 | EXEMPT — 부분집합 세 개의 조건부 선택 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q18 | 해설 | EXEMPT — 부분집합 세 개의 조건부 선택 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q19 | 문항 | EXEMPT — 세 카드의 합·곱 사건 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q19 | 해설 | 겹침 또는 대칭차 사건·실제 504 표본공간 표시 | `set-diagram-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q19-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사2/q20 | 문항 | A~F의 시계방향 6점 PNG 확인, 불필요한 색칠 없이 현행 이미지 유지 | `기존 PNG` | `assets/images/26_순천고_2학기_중간_고2_확률과통계/q20.png` | N/A (기존 PNG) | 원본 PNG 구조 확인; 신규 SVG 렌더 N/A |
| 유사2/q20 | 해설 | A-B-C의 ∠ABC=120° 각호·라벨을 그리는 필드로 재설계, 불필요한 면 채움·현 제거, 보조 중심 O는 숨김 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q20-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사2/q21 | 문항 | EXEMPT — 이항계수 매개변수 서술형 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q21 | 해설 | EXEMPT — 이항계수 매개변수 서술형 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q22 | 문항 | EXEMPT — 순서 있는 비음수 정수해 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q22 | 해설 | EXEMPT — 순서 있는 비음수 정수해 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |
| 유사2/q23 | 문항 | EXEMPT — 사회자 공개에 따른 선택 변경 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q23 | 해설 | 변경된 문 개수·공개 규칙에 맞춘 확률 수형도 | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/26_순천고_2학기_중간_고2_확률과통계_유사2/q23-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 유사2/q24 | 문항 | EXEMPT — 서로소·자연수 순서쌍 세기 조건이 발문/표에 완결됨 | `EXEMPT` | — | N/A | N/A |
| 유사2/q24 | 해설 | EXEMPT — 서로소·자연수 순서쌍 세기 풀이가 수식·정수 계산으로 충분함 | `EXEMPT` | — | N/A | N/A |

## 독립 재검증 2026-11-28 — 24문항·48축 요약 감사표

- 최신 `origin/main`에서 유사2 JS의 `window.questionBank` 24문항·24해설을 다시 확인했다. 기존 6개 plan의 `sourceConditions`, `mappedTo`, `caption`, `newVisualInformation`, `accessibilityDescription` 및 수학 필드와 현행 문제축 정답 노출 여부를 전수 대조했다. **기존 plan 4개 그대로 유지, q14 문제·q23 해설 2개는 누락된 접근성 설명만 보완**했다. 수학 그리기 필드는 전부 보존했다.
- **문제 REQUIRED 3축**(q14 SVG, q16 PNG, q20 PNG), **해설 REQUIRED 1축**(q14 SVG), **해설 BENEFICIAL 5축**(q15·q16·q19·q20·q23), **EXEMPT 39축** = **48축**. 계획 6개, 원본 PNG 보존 2개, q16 해설 미지원 1축이다.
- 공식 JSON 스키마 **6 PASS/0 FAIL/0 SKIP**, Shallow **6 PASS/0 FAIL/0 SKIP**, Full **6 PASS/0 FAIL/0 SKIP**. `STATIC_FIELD_PARITY 6 PASS`, `DRAWN_FEATURE_PARITY 6 PASS(수학 필드·기능의 정적 대조)`. 물리적 SVG 출력은 **6/6 `RENDER_NOT_RUN`**으로, 시각 검수 PASS 아님.
- **`ORIGINAL_EXAM_PNG_CONFLICT:q14`** — 원 기출 q14.png의 C 위치가 현행 유사2 JS `C=(2,2)`와 다르다. 제작 대상은 현행 유사2 문제이며, 기출 좌표를 그대로 옮기면 조건이 바뀌므로 공식 문제/해설 plan 둘 다 현행 좌표·진입금지 선분을 기준으로 한다. 직접 연결된 유사 `q14-problem.svg`·`q14-solution.svg`와 실제 필드를 비교했다.
- q19 해설의 사건 영역 음영은 대칭차에만 적용하고, q20은 6점의 원주 배치와 120° 각호·라벨을 해설축에만 드러낸다. q23은 다섯 문·공개/교체 확률의 실제 분기이며, 현재 문제에 해설의 2/5를 노출하지 않는다.
- **`ENGINE_CAPABILITY_PENDING:GRID_CELL_PAIR_HIGHLIGHT`** — q16 해설에서 **4열×5행 중 꼭짓점에서만 만나는 대각 칸쌍**을 원본 격자 선과 함께 지정해 강조하는 기능의 공식 동등 지원이 확인되지 않았다. 부정확한 근사 SVG/plan 생성 대신 미지원으로 유지한다. q14/q16/q20의 불필요한 흰 캔버스와 실제 출력 투명성은 렌더 불가로 확정하지 않으며, 기능 미지원 항목을 다른 문항에 기계적으로 복사하지 않았다.
- 이 시험지의 q14·q15·q16·q20·q23 JS에 남은 과거 `solutionImageAlt`/`solutionImageCaption` 잔존 문구는 현재 조건과 다르지만 **현재는 직접 solutionImage로 연결되지 않는다**. 이번 작업의 JS 수정 금지 범위에 따라 그대로 두며, 향후 연결 전에 별도 정정이 필요하다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | EXEMPT — 이항전개 계수 발문에 완결 | EXEMPT — 계수 비의 산술 풀이 | — | — | N/A | N/A | 수식만으로 충분 |
| 02 | EXEMPT — 배반사건 확률 조건 완결 | EXEMPT — 여사건 확률 계산 | — | — | N/A | N/A | 사건 수식만 필요 |
| 03 | EXEMPT — 세 맛 중복선택의 수 제시 | EXEMPT — 중복순열·조합 비교 | — | — | N/A | N/A | 경우의 수 계산 |
| 04 | EXEMPT — 사건 등식 비교 발문 완결 | EXEMPT — 대수적 항등식 확인 | — | — | N/A | N/A | 벤다이어그램 요구되지 않음 |
| 05 | EXEMPT — 시행/상대도수 HTML 표 제공 | EXEMPT — 표와 확률 정의로 판단 | — | — | N/A | N/A | 표 중복 제작 불필요 |
| 06 | EXEMPT — 조건부확률 식 제시 | EXEMPT — 곱셈 법칙 계산 | — | — | N/A | N/A | 도식 불필요 |
| 07 | EXEMPT — 이항계수 합 식 완결 | EXEMPT — 이항계수 합 항등식 | — | — | N/A | N/A | 파스칼 도형 불필요 |
| 08 | EXEMPT — 전개식과 계수 조건 완결 | EXEMPT — 조합 항등식 산술 | — | — | N/A | N/A | 해설 수식으로 충분 |
| 09 | EXEMPT — 동아리·학년 인원수 텍스트 | EXEMPT — 조건부확률 분수 계산 | — | — | N/A | N/A | 빈도표를 SVG로 복제 불필요 |
| 10 | EXEMPT — 자연수의 끝자리 식 완결 | EXEMPT — 모듈러 계산 | — | — | N/A | N/A | 그래프 없음 |
| 11 | EXEMPT — 네 자리 자연수 자릿수 조건 | EXEMPT — 음이 아닌 정수해 세기 | — | — | N/A | N/A | 별도 배열 도형 불필요 |
| 12 | EXEMPT — 여섯 글자 배치 제약 | EXEMPT — L 간격에 따른 경우의 수 | — | — | N/A | N/A | 위치 경우 계산 |
| 13 | EXEMPT — 두 원소 함수·배수 조건 | EXEMPT — 곱셈원리 사용 | — | — | N/A | N/A | 함수 도형 불필요 |
| 14 | REQUIRED — C 좌표와 금지 도로를 격자에 명시 | REQUIRED — 도로 진입 제약 및 최단경로 해설 도식 | `q14-problem.svg`, `q14-solution.svg` | `q14-problem.plan.json`, `q14-solution.plan.json` | 2 PASS | 2 PASS(필드); RENDER_NOT_RUN | `ORIGINAL_EXAM_PNG_CONFLICT`: 기출 C 위치 ≠ 현행 C=(2,2), 우/상 이동·금지 도로 |
| 15 | EXEMPT — 동전·공 개수·추출 절차 완결 | BENEFICIAL — 앞/뒤 3개·4개 추출의 확률 수형도 | — | `q15-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | 흰 공 확률 39/112, 정답은 해설에만 |
| 16 | REQUIRED — 4×5 격자의 칸 위치가 공간 조건 | BENEFICIAL — 대각 칸쌍의 꼭짓점 공유 설명 | — (기출 PNG `q16.png`) | — (PNG 보존; 해설 미지원) | N/A | `ENGINE_CAPABILITY_PENDING:GRID_CELL_PAIR_HIGHLIGHT` | 전체 190쌍 중 대각접촉 24쌍; 임의 근사 plan 불가 |
| 17 | EXEMPT — 함수의 치역/값 조건 완결 | EXEMPT — 조합적 함수 개수 계산 | — | — | N/A | N/A | 도식 불필요 |
| 18 | EXEMPT — 세 부분집합 독립 선택 조건 | EXEMPT — 부분집합 사건 곱셈법칙 | — | — | N/A | N/A | 벤다이어그램이 조건 추가하지 않음 |
| 19 | EXEMPT — 세 카드 합·곱의 배수 사건 완결 | BENEFICIAL — 사건 교집합/대칭차 수 그림 | `q19-solution.svg` | `q19-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | 전체 504, 대칭차 228; 실제 사건 영역만 음영 |
| 20 | REQUIRED — 원주 A~F의 시계방향 6점 배치 | BENEFICIAL — 120° 둔각 원주각과 교점 라벨 | `q20-solution.svg` (문제는 `q20.png`) | `q20-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | 정적 각도·실제 두 선분만, 둔각 6/20 |
| 21 | EXEMPT — 전개식 계수 매개변수 제시 | EXEMPT — 이항전개 계산 | — | — | N/A | N/A | 수식 계산 |
| 22 | EXEMPT — 비음수 정수해·조건부 선택 수식 | EXEMPT — 경우의 수 나눗셈 | — | — | N/A | N/A | 도형 요구 안 됨 |
| 23 | EXEMPT — 다섯 문·사회자 행동 규칙 텍스트 | BENEFICIAL — 유지/교체 가지 확률 수형도 | — | `q23-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | 유지 1/5, 교체 2/5, 풀이값은 해설축만 |
| 24 | EXEMPT — 서로소 자연수 세쌍 조건 완결 | EXEMPT — 소인수분해/약수 경우 계산 | — | — | N/A | N/A | 수식만으로 충분 |
