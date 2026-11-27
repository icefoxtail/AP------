# 효천고 2026 고2 1학기 중간 확률과통계 — 유사1 SVG 전축 감사

- 최신 점검 입력: `archive/exams/similar/high/h2/1mid/26_효천고_1학기_중간_고2_확률과통계_유사.js` (23문항, 46축).
- 모든 `plan경로`는 `archive/tools/geometry-equation/production/plans/26_효천고_1학기_중간_고2_확률과통계_유사/` 기준이다. `—`는 제작 플랜이 필요 없는 축이다.
- 원본은 의미·자료 확인 근거이며 숫자가 다른 발전형 문항에 원본 도판을 그대로 강제하지 않는다. 직접 확인한 원본 에셋은 `q10.png`(5점포 표), `q11.png`(함숫값 곱 식), `q17.png`(원점 P 수직선)이다. 이 셋은 유사1의 변경된 문제 조건을 자동 보증하지 않는다.
- 새 실행형 플랜 3개는 현재 JS와 정확히 대조: q05 해설 (첫 번째 흰 2/5, 다음 흰 1/3, 흰→흰 강조), q17 문제 (A=-3, P=0, B=3와 끝점 포함 선분), q17 해설 (6번 시행 끝 위치 `3n-6`, n=0..6, 선분에 속하는 n=1..3).
- lint: 공식 `plan-lint.cjs` shallow **3/3 PASS**, full **3/3 PASS**. 다만 PNG/SVG 렌더 및 학생 화면·A4 실물은 **RENDER_NOT_RUN**: `/opt/google/chrome/chrome` 및 `/usr/lib/chromium/chromium` 바이너리가 없다. 따라서 `DRAWN_FEATURE_PARITY`의 *실물 1:1 PASS*는 **0건**, 아래 `STATIC_FIELDS_REVIEWED`는 원문 수치와 그리는 JSON 필드의 정적 대응만 뜻한다.
- **ENGINE_CAPABILITY_PENDING — TRANSPARENT_BACKGROUND_OPTOUT:** `stat-chart-v1.mjs:2045`, `number-line-v1.mjs:1012`는 흰색 루트 `<rect>`를 무조건 만든다. 계획 입력만으로 끌 수 없다. 둘 다 명시적인 `background: NONE`과 SVG 렌더러·독립 관측기의 opt-out 지원이 필요하다. 새 플랜에는 자체 면 채움/흰 배경 객체를 넣지 않았다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 유사/q01 | 문제 | EXEMPT: 중복조합 값 계산, 공간·도표 조건 없음 | — | — | N/A | N/A |
| 유사/q01 | 해설 | EXEMPT: 조합 공식과 수치 계산으로 완결 | — | — | N/A | N/A |
| 유사/q02 | 문제 | EXEMPT: 이항계수 합을 식으로 제시 | — | — | N/A | N/A |
| 유사/q02 | 해설 | EXEMPT: 이항정리 항 합 계산, 그림 중복 | — | — | N/A | N/A |
| 유사/q03 | 문제 | EXEMPT: `letter` 동일 문자 순열 | — | — | N/A | N/A |
| 유사/q03 | 해설 | EXEMPT: 6!/(2!2!) 계산을 이미 서술 | — | — | N/A | N/A |
| 유사/q04 | 문제 | EXEMPT: 특정 단항식 계수 산출 | — | — | N/A | N/A |
| 유사/q04 | 해설 | EXEMPT: 이항정리 일반항으로 완결 | — | — | N/A | N/A |
| 유사/q05 | 문제 | EXEMPT: 공 4흰·6검, 비복원 조건이 문장에 충분 | — | — | N/A | N/A |
| 유사/q05 | 해설 | BENEFICIAL: 기존 수형도 제작 플랜이 유사 폴더에만 있으며 흰→흰 경로의 곱 정보 보강 | `stat-chart-figure-v1` TREE | `q05-solution.plan.json` | PASS/PASS | STATIC_FIELDS_REVIEWED; RENDER_NOT_RUN |
| 유사/q06 | 문제 | EXEMPT: 동전 독립시행의 횟수 사건 | — | — | N/A | N/A |
| 유사/q06 | 해설 | EXEMPT: 7회·8회 두 항의 합으로 완결 | — | — | N/A | N/A |
| 유사/q07 | 문제 | EXEMPT: 다항식 두 계수의 같음 | — | — | N/A | N/A |
| 유사/q07 | 해설 | EXEMPT: 계수 비교 방정식, 도형 없음 | — | — | N/A | N/A |
| 유사/q08 | 문제 | EXEMPT: 다항식의 x^5 계수 | — | — | N/A | N/A |
| 유사/q08 | 해설 | EXEMPT: 곱할 항 두 경우가 텍스트에 명시됨 | — | — | N/A | N/A |
| 유사/q09 | 문제 | EXEMPT: 전사함수 개수, 두 유한집합이 텍스트로 주어짐 | — | — | N/A | N/A |
| 유사/q09 | 해설 | EXEMPT: 포함·배제 계산, 하나의 대응도가 모든 함수를 설명하지 못함 | — | — | N/A | N/A |
| 유사/q10 | 문제 | EXEMPT SVG: 가게 A~F 거리표를 발문 Markdown 표로 제공 | — | — | N/A | N/A |
| 유사/q10 | 해설 | EXEMPT: 같은 거리 두 쌍 제외 후 4! 배정 | — | — | N/A | N/A |
| 유사/q11 | 문제 | EXEMPT: 다섯 함숫값의 곱 조건이 텍스트 수식 | — | — | N/A | N/A |
| 유사/q11 | 해설 | EXEMPT: 함숫값 다중집합 및 음수 부호 경우를 분리 | — | — | N/A | N/A |
| 유사/q12 | 문제 | EXEMPT: 세 정수의 제곱합 조건 | — | — | N/A | N/A |
| 유사/q12 | 해설 | EXEMPT: 1+1+1의 가능값을 수식으로 전개 | — | — | N/A | N/A |
| 유사/q13 | 문제 | EXEMPT SVG: 여자·남자와 식품 선택 비율을 문장에 수치로 명시 | — | — | N/A | N/A |
| 유사/q13 | 해설 | EXEMPT SVG: 2×2 분할표를 그리면 AP Table Engine 대상, 분수 산식은 현재 해설에 있음 | — | — | N/A | N/A |
| 유사/q14 | 문제 | EXEMPT: 사건의 독립/배반 명제의 참거짓 | — | — | N/A | N/A |
| 유사/q14 | 해설 | EXEMPT: 독립·여사건 항등식을 대수적으로 확인 | — | — | N/A | N/A |
| 유사/q15 | 문제 | EXEMPT: 음이 아닌 정수해의 조건 | — | — | N/A | N/A |
| 유사/q15 | 해설 | EXEMPT: z=0..3 치환 후 중복조합 | — | — | N/A | N/A |
| 유사/q16 | 문제 | EXEMPT: 같은 색 공의 세 상자 분배 수 | — | — | N/A | N/A |
| 유사/q16 | 해설 | EXEMPT: 흰 공 분할형과 남은 검은 공의 중복조합으로 설명 | — | — | N/A | N/A |
| 유사/q17 | 문제 | REQUIRED: 기존 `construction-spike`는 A-P·P-B 선분만 그려 양 끝점 포함 AB 범위를 구별하기 약함. 시작 P=0과 닫힌 선분 AB를 정확히 표시하도록 재설계 | `number-line-figure-v1` | `q17-problem.plan.json` | PASS/PASS | STATIC_FIELDS_REVIEWED; RENDER_NOT_RUN |
| 유사/q17 | 해설 | BENEFICIAL: 기존 해설 그림 없음. 3n-6의 7개 끝 위치 중 -3,0,3만 AB 포함으로 자동 표시 | `number-line-figure-v1` | `q17-solution.plan.json` | PASS/PASS | STATIC_FIELDS_REVIEWED; RENDER_NOT_RUN |
| 유사/q18 | 문제 | EXEMPT: 최솟값·최댓값의 합 범위를 문자로 지정 | — | — | N/A | N/A |
| 유사/q18 | 해설 | EXEMPT: 합별 (m,M) 짝과 조합 수가 해설에 나열됨 | — | — | N/A | N/A |
| 유사/q19 | 문제 | EXEMPT: 카드별 공 추가 규칙을 문장으로 명시 | — | — | N/A | N/A |
| 유사/q19 | 해설 | EXEMPT: 횟수 X,Y,Z와 조건부확률 식으로 분석, 4단계 수형도는 중복 | — | — | N/A | N/A |
| 유사/q20 | 문제 | EXEMPT: 네 문자 다항식의 서로 다른 항 개수 | — | — | N/A | N/A |
| 유사/q20 | 해설 | EXEMPT: 네 지수의 중복조합으로 완결 | — | — | N/A | N/A |
| 유사/q21 | 문제 | EXEMPT: 주사위 총 7회 이항시행 | — | — | N/A | N/A |
| 유사/q21 | 해설 | EXEMPT: 성공 정확히 5회의 이항확률 계산 | — | — | N/A | N/A |
| 유사/q22 | 문제 | EXEMPT: 조건부확률 두 식만 제시 | — | — | N/A | N/A |
| 유사/q22 | 해설 | EXEMPT: A∪B≤1로 x의 상한을 산출 | — | — | N/A | N/A |
| 유사/q23 | 문제 | EXEMPT: 세 학생에게 6자루 배분 조건 | — | — | N/A | N/A |
| 유사/q23 | 해설 | EXEMPT: 서윤 수량 0·1·2로 경우 분류해 계산 | — | — | N/A | N/A |

판정 검산: 문제 23축 = REQUIRED 1 + EXEMPT 22, 해설 23축 = BENEFICIAL 2 + EXEMPT 21. 새 제작용 plan **3개**이며 기존 유사 `_plans/`의 `{"status":"EXEMPT"}` JSON 43개는 렌더 가능한 제작 플랜으로 집계하지 않는다.
