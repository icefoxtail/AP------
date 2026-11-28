# 26_순천고_2학기_중간_고2_확률과통계_유사 — SVG 2축 정밀 재감사

## 2026-11-28 최신 main 독립 재검증 (기존 공식 plan 전부 보존)

- 작업 시작 기준 `origin/main` **`3e0c3da2e39f4acfd526d8a6b51b1a0ad06fc35d`** (원격 새 조회). 열린 PR **82개** 전체 변경 경로 **3,459개**에 대해 두 대상 JS 및 production plan 폴더 중첩 **0건**.
- 현행 유사 JS **24문항·24해설 = 문제 24축 + 해설 24축 = 48축**. `REQUIRED` 3(문제 14·16·20), `BENEFICIAL` 6(해설 14·15·16·19·20·23), `EXEMPT` 39. 직접 연결된 현행 유사 자산은 문제 PNG q16·q20 **2개**, 직접 연결 유사 SVG **0개**. 원본 기출 PNG q14·q16·q20, 풀이 SVG 변형본, 기존 `_plans/`는 공식 plan 개수와 별도 확인.
- 공식 실행형 production plan **6개 전부 유지 / 수정 0 / 신규 0**. q16 해설은 필요하지만 공식 지원 필드로 셀마다 정밀한 두 칸 접촉의 세 유형을 그릴 증거가 없어 **`ENGINE_CAPABILITY_PENDING:GRID_CELL_PAIR_HIGHLIGHT` 1축** (미지원 plan으로 통과 주장 금지). q16·q20 문제의 기존 PNG는 계획을 새로 만들거나 변경하지 않고 정적 확인했다.
- JSON 파싱·필수 스키마 **6/6 PASS**, 공식 Shallow/Full lint **각 6 PASS·0 FAIL·0 SKIP**, 현행 JS와 모든 그려지는 수학 필드 및 설명 문구를 수동 대조한 `STATIC_FIELD_PARITY` **6 PASS**. 신규 Chromium 실행 검사에서 실제 `/usr/lib/chromium/chromium` 본체 부재로 exit 127: 공식 SVG·PNG·학생 화면·A4를 만들거나 보지 못했으므로 `DRAWN_FEATURE_PARITY` **PASS 0 / FAIL 0 / `RENDER_NOT_RUN` 6**. q16 해설 1축은 별도의 `ENGINE_CAPABILITY_PENDING`이며, 정적 PASS를 실제 시각 PASS로 보고하지 않는다.
- **`ORIGINAL_EXAM_PNG_CONFLICT`:** 기출 q14 PNG는 C=(0,5)인 왼쪽 맨 위 교점이고 기출 C 회피 경로가 251개다. 현행 유사 JS는 **C=(0,3)**, 전체 252개 중 C 경유 21개를 빼서 231개다. 현행 유사 JS가 학생의 실제 발문이므로 기존 PNG 그대로 재사용하지 않고 두 기존 q14 plan의 C 위치를 유지한다.
- **`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`:** 기출 q15는 공 3/5개·추출 3/4개·모두 같은 색 사건, 유사 q15는 공 4/4개·추출 2/3개·두 색 사건이다. 기출 q19는 합집합, 유사는 교집합(168/504); 기출 q20은 예각, 유사는 직각; 기출 q23은 세 문, 유사는 네 문이다. 현행 유사 JS·해설에 맞춘 확률, 라벨, 음영, 분기를 유지하고 기출 SVG 변형본의 수치를 덮어쓰지 않는다.
- 직접 연결된 유사 SVG가 없으므로 불필요한 흰 `rect`의 직접 자산 결함은 **0건 관측**(PNG의 종이 흰색은 SVG 배경과 구분). 엔진 공통 렌더 시 기본 흰 캔버스를 삽입할 가능성은 있으나 본 환경에서 출력 확인이 안 되어 투명화 해결/시각 PASS를 주장하지 않는다. `TRANSPARENT_CANVAS_OPTION`, `MULTI_CURVE_INVERSE_CUBIC`, `PIECEWISE_POLYNOMIAL_UPPERCASE_FUNCTION_NAME`을 이 시험지의 확정 미지원 기능으로 복사하지 않는다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | EXEMPT: 이항계수 식으로 완결 | EXEMPT: 계수 대입·산술 | 없음 | — | N/A | N/A | 위치·곡선 조건 없음 |
| 02 | EXEMPT: 배반사건 수치 조건 | EXEMPT: 덧셈정리 계산 | 없음 | — | N/A | N/A | 그림 없이 사건식 충분 |
| 03 | EXEMPT: 중복순열·조합 조건 | EXEMPT: 경우의 수 계산 | 없음 | — | N/A | N/A | 수식으로 완결 |
| 04 | EXEMPT: 사건 등식 제시 | EXEMPT: 등식 판정·연산 | 없음 | — | N/A | N/A | 좌표·영역 관계 불필요 |
| 05 | EXEMPT: 상대도수 HTML 표 | EXEMPT: 표 값·비율 계산 | 없음 | — | N/A | N/A | 표 반복 SVG 불필요 |
| 06 | EXEMPT: 조건부확률 수식 | EXEMPT: 확률 대입 계산 | 없음 | — | N/A | N/A | 사건관계는 수식에 완결 |
| 07 | EXEMPT: 이항계수 수치 | EXEMPT: 이항계수 연산 | 없음 | — | N/A | N/A | 조합식으로 충분 |
| 08 | EXEMPT: 전개식의 특정 항 | EXEMPT: 항의 차수·계수 계산 | 없음 | — | N/A | N/A | 그래프 불필요 |
| 09 | EXEMPT: 학년별 참가 수 조건 | EXEMPT: 조건부확률 분수 | 없음 | — | N/A | N/A | 빈도 수치 계산 |
| 10 | EXEMPT: 거듭제곱 끝자리 | EXEMPT: 나머지의 주기 | 없음 | — | N/A | N/A | 시각조건 없음 |
| 11 | EXEMPT: 자릿수 합 정수해 | EXEMPT: 정수해 경우 열거 | 없음 | — | N/A | N/A | 수식으로 충분 |
| 12 | EXEMPT: 글자 순서·자리 제한 | EXEMPT: 배열 경우의 수 | 없음 | — | N/A | N/A | 자리 규칙 명확 |
| 13 | EXEMPT: 함숫값 배수 조건 | EXEMPT: 배수 조건 계산 | 없음 | — | N/A | N/A | 도형 불필요 |
| **14** | **REQUIRED: A·B·C의 격자 위치** | **BENEFICIAL: C 진입 간선 제외와 경로 수** | 유사 없음; 기출 `q14-solution-v2.svg` | `q14-problem.plan.json`, `q14-solution.plan.json` | PASS (2) | RENDER_NOT_RUN (2) | `ORIGINAL_EXAM_PNG_CONFLICT` 기출 C(0,5) ≠ 유사 C(0,3); 251 ≠ 231 |
| 15 | EXEMPT: 공·동전·추출 규칙 명시 | BENEFICIAL: 앞·뒷면과 두 색 조건부확률 수형도 | 유사 없음; 기출 `q15-solution.svg` | `q15-solution.plan.json` | PASS | RENDER_NOT_RUN | 유사 4/4개·추출 2/3개; 기출과 `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` |
| **16** | **REQUIRED: 4×5 격자 두 칸의 접촉관계** | **BENEFICIAL: 변 공유·꼭짓점 공유 세 종류의 시각적 분류** | 유사 없음; 기출 `q16-solution.svg` | 문제 기존 `q16.png`; 해설 공식 plan 없음 | 기존 PNG 확인; 해설 미지원 | 해설 `ENGINE_CAPABILITY_PENDING` | `GRID_CELL_PAIR_HIGHLIGHT`; 전체 190 중 수평 15·수직 16·대각 24 |
| 17 | EXEMPT: 함수값 합·순서 제약 | EXEMPT: 함수 수치 계산 | 없음 | — | N/A | N/A | 선·축 필요 없음 |
| 18 | EXEMPT: 세 부분집합의 조건 | EXEMPT: 조합·확률 계산 | 없음 | — | N/A | N/A | 집합 표기만으로 충분 |
| 19 | EXEMPT: 카드 합·곱 조건 명시 | BENEFICIAL: E∩F 사건 영역 음영 | 유사 없음; 기출 풀이 SVG 변형 없음 | `q19-solution.plan.json` | PASS | RENDER_NOT_RUN | 504 중 교집합 168; 기출은 합집합이라 그대로 복제 금지 |
| **20** | **REQUIRED: 원 위 A~F의 시계방향 순서** | **BENEFICIAL: AD 지름·∠ABD 직각 표시** | 유사 없음; 기출 `q20-solution-v3.svg` | 문제 기존 `q20.png`; `q20-solution.plan.json` | PASS (해설), PNG 확인 | RENDER_NOT_RUN (해설) | 기출 예각 ↔ 유사 직각: `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`; 면 채움 없음 |
| 21 | EXEMPT: 이항계수 매개변수 조건 | EXEMPT: 연립·정수 해석 | 없음 | — | N/A | N/A | 풀이 수식 완결 |
| 22 | EXEMPT: 비음수 정수해 조건 | EXEMPT: 정수해 세기 | 없음 | — | N/A | N/A | 좌표 정보 불필요 |
| 23 | EXEMPT: 네 문과 사회자 규칙 명시 | BENEFICIAL: 유지·변경 성공 분기 확률 수형도 | 유사 없음; 기출 `q23-solution-v2.svg` | `q23-solution.plan.json` | PASS | RENDER_NOT_RUN | 기출 세 문·유사 네 문: `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` |
| 24 | EXEMPT: 소인수분해와 서로소 조건 | EXEMPT: 거듭제곱 인수 배정 | 없음 | — | N/A | N/A | 수식 계산으로 완결 |

**축 합계: 문제 24축 + 해설 24축 = 48축 = REQUIRED 3 + BENEFICIAL 6 + EXEMPT 39.** `STATIC_FIELD_PARITY`는 각 plan의 실제 그려지는 필드만 확인한 정적 결과다. 원본 PNG·SVG와 조건이 다른 문항은 현행 유사 JS가 제작 기준이며, 공식 SVG·학생 화면의 눈금·점·라벨·정답 노출·흰 배경은 여전히 `RENDER_NOT_RUN`이다.

---

## 이전 제작 당시 상세 감사 기록 (아래는 당시 상태이며 이번 상단 재검증이 우선)

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
