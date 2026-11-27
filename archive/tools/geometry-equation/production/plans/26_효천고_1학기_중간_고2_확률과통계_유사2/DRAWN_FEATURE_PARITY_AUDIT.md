# 효천고 2026 고2 1학기 중간 확률과통계 — 유사2 SVG 전축 감사

- 최신 점검 입력: `archive/exams/similar/high/h2/1mid/26_효천고_1학기_중간_고2_확률과통계_유사2.js` (23문항, 46축).
- 모든 `plan경로`는 `archive/tools/geometry-equation/production/plans/26_효천고_1학기_중간_고2_확률과통계_유사2/` 기준이다. `—`는 새 제작용 SVG plan이 필요 없는 축이다.
- 원본 PNG 직접 대조: `archive/assets/images/26_효천고_1학기_중간_고2_확률과통계/q10.png`에는 A~E의 거리 30,40,40,50,70km가 있으며, **현행 유사2 q10**의 거리별 배정 해설과 일치한다. `q17.png`는 원점 P와 -4~4 눈금이 있어 **현행 유사2 q17**의 시작 위치 조건과 일치한다. 이미 충분한 이 PNG는 엔진 SVG로 대체하지 않는다. q11 원본 `q11.png`의 곱 조건은 현행 유사2 JS의 note-box로 표현되어 새 그림이 필요 없다.
- 새 실행형 제작 플랜 2개: q05 해설 (5흰·3검 비복원 수형도, 흰→검과 검→흰 두 경로), q17 해설 (5회 후 끝 위치 -5,-2,1,4,7,10 중 -2와 4 강조). 유사2의 `_plans/q17-solution.plan.json`을 현재 발문과 재대조하여 production 경로로 재작성했다.
- lint: 공식 `plan-lint.cjs` shallow **2/2 PASS**, full **2/2 PASS**. PNG/SVG 렌더 및 학생 화면·A4 실물은 **RENDER_NOT_RUN**: `/opt/google/chrome/chrome` 및 `/usr/lib/chromium/chromium` 바이너리가 없다. 따라서 `DRAWN_FEATURE_PARITY`의 *실물 1:1 PASS*는 **0건**이며 아래 `STATIC_FIELDS_REVIEWED`는 JSON 필드와 원문·계산의 정적 1:1 확인이다.
- **ENGINE_CAPABILITY_PENDING — TRANSPARENT_BACKGROUND_OPTOUT:** `stat-chart-v1.mjs:2045`와 `number-line-v1.mjs:1012`가 흰색 루트 `<rect>`를 강제해 플랜만으로 없앨 수 없다. 엔진에 명시적 `background: NONE`과 관측기 지원이 필요하다. 새 플랜에는 의미 없는 면 채움이 없다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 유사2/q01 | 문제 | EXEMPT: 중복조합 수를 식으로 제시 | — | — | N/A | N/A |
| 유사2/q01 | 해설 | EXEMPT: n+2=5의 단순 식 계산 | — | — | N/A | N/A |
| 유사2/q02 | 문제 | EXEMPT: 이항계수 합 | — | — | N/A | N/A |
| 유사2/q02 | 해설 | EXEMPT: 2^4에서 중앙 이항계수 빼기 | — | — | N/A | N/A |
| 유사2/q03 | 문제 | EXEMPT: `school` 두 o가 인접하는 순열 | — | — | N/A | N/A |
| 유사2/q03 | 해설 | EXEMPT: oo를 덩어리로 묶은 5! 계산 | — | — | N/A | N/A |
| 유사2/q04 | 문제 | EXEMPT: 이항전개 계수 | — | — | N/A | N/A |
| 유사2/q04 | 해설 | EXEMPT: 조합 계수식 -6으로 완결 | — | — | N/A | N/A |
| 유사2/q05 | 문제 | EXEMPT: 흰 5·검 3 및 비복원 조건이 문장에 모두 있음 | — | — | N/A | N/A |
| 유사2/q05 | 해설 | BENEFICIAL: 기존 수형도 부재. 흰→검(5/8·3/7), 검→흰(3/8·5/7) 두 배반 경로를 함께 강조 | `stat-chart-figure-v1` TREE | `q05-solution.plan.json` | PASS/PASS | STATIC_FIELDS_REVIEWED; RENDER_NOT_RUN |
| 유사2/q06 | 문제 | EXEMPT: 동전 6회 독립시행 | — | — | N/A | N/A |
| 유사2/q06 | 해설 | EXEMPT: 여사건 5회·6회의 조합 합 | — | — | N/A | N/A |
| 유사2/q07 | 문제 | EXEMPT: 두 다항식 계수 비교 | — | — | N/A | N/A |
| 유사2/q07 | 해설 | EXEMPT: a=6의 수치 방정식 | — | — | N/A | N/A |
| 유사2/q08 | 문제 | EXEMPT: 이항다항식의 x^4 계수 | — | — | N/A | N/A |
| 유사2/q08 | 해설 | EXEMPT: 계수 3쌍의 곱을 전부 나열 | — | — | N/A | N/A |
| 유사2/q09 | 문제 | EXEMPT: 치역 원소가 정확히 2개인 함수 수 | — | — | N/A | N/A |
| 유사2/q09 | 해설 | EXEMPT: 두 치역 원소의 선택 × 전사 대응 계산 | — | — | N/A | N/A |
| 유사2/q10 | 문제 | ASSET_RETAIN: 연결된 원본 `q10.png`가 **가게 A~E 30/40/40/50/70km**의 정확한 5열 표임을 직접 확인, 불필요한 SVG 교체 금지 | 기존 PNG | — | N/A | SOURCE_ASSET_1:1_REVIEWED; 학생화면 NOT_RUN |
| 유사2/q10 | 해설 | EXEMPT: 같은 거리 두 가게의 2순서와 서로 다른 거리 9쌍을 식으로 구분 | — | — | N/A | N/A |
| 유사2/q11 | 문제 | EXEMPT: 곱 조건 및 음수 2개 조건이 note-box 텍스트에 있음 | — | — | N/A | N/A |
| 유사2/q11 | 해설 | EXEMPT: 가능한 함숫값 구성 네 가지 중 조건 충족 두 가지를 텍스트로 열거 | — | — | N/A | N/A |
| 유사2/q12 | 문제 | EXEMPT: 주사위 세 제곱합 조건 | — | — | N/A | N/A |
| 유사2/q12 | 해설 | EXEMPT: (1,1,0) 세 자리 배치 계산 | — | — | N/A | N/A |
| 유사2/q13 | 문제 | EXEMPT SVG: 두 성별·간식 비율은 문장으로 충분 | — | — | N/A | N/A |
| 유사2/q13 | 해설 | EXEMPT SVG: 분수 계산으로 완결, 2×2 분할표는 AP Table Engine 영역 | — | — | N/A | N/A |
| 유사2/q14 | 문제 | EXEMPT: 독립·배반 사건의 명제 참거짓 | — | — | N/A | N/A |
| 유사2/q14 | 해설 | EXEMPT: 교집합과 여사건 대수식으로 판단 | — | — | N/A | N/A |
| 유사2/q15 | 문제 | EXEMPT: 비음수 정수해의 연립 조건 | — | — | N/A | N/A |
| 유사2/q15 | 해설 | EXEMPT: z=0..3일 때 x 개수 5·6·7·8로 제시 | — | — | N/A | N/A |
| 유사2/q16 | 문제 | EXEMPT: 세 상자 흰/검 공 분할의 문장 조건 | — | — | N/A | N/A |
| 유사2/q16 | 해설 | EXEMPT: Y,Z 흰 공 세 분배와 검은 공 중복조합의 곱 | — | — | N/A | N/A |
| 유사2/q17 | 문제 | ASSET_RETAIN: 원본 `q17.png`에는 -4~4 수직선과 원점 P만 있어 발문과 1:1 일치; 이동 후 답을 추가 노출하지 않음 | 기존 PNG | — | N/A | SOURCE_ASSET_1:1_REVIEWED; 학생화면 NOT_RUN |
| 유사2/q17 | 해설 | BENEFICIAL: 기존 `_plans/`만 있는 수직선 플랜을 production 재작성; 끝 위치 6개와 적합 -2·4를 강조 | `number-line-figure-v1` | `q17-solution.plan.json` | PASS/PASS | STATIC_FIELDS_REVIEWED; RENDER_NOT_RUN |
| 유사2/q18 | 문제 | EXEMPT: 최솟값·최댓값 합의 짝수 조건 | — | — | N/A | N/A |
| 유사2/q18 | 해설 | EXEMPT: 가능한 (m,M) 쌍 및 조합 수를 식으로 열거 | — | — | N/A | N/A |
| 유사2/q19 | 문제 | EXEMPT: 카드별로 상자 B에 추가되는 공의 개수가 문장에 있음 | — | — | N/A | N/A |
| 유사2/q19 | 해설 | EXEMPT: X,Y,Z 횟수와 홀수 조건의 사건 식이 해설에 명시됨 | — | — | N/A | N/A |
| 유사2/q20 | 문제 | EXEMPT: 세 문자 지수가 모두 양수인 항의 개수 | — | — | N/A | N/A |
| 유사2/q20 | 해설 | EXEMPT: 각 지수에서 1을 빼는 중복조합 | — | — | N/A | N/A |
| 유사2/q21 | 문제 | EXEMPT: 10회 주사위 이항시행 | — | — | N/A | N/A |
| 유사2/q21 | 해설 | EXEMPT: 0·1·2번 성공의 세 조합 합 | — | — | N/A | N/A |
| 유사2/q22 | 문제 | EXEMPT: 두 조건부확률 식 | — | — | N/A | N/A |
| 유사2/q22 | 해설 | EXEMPT: 합사건 확률 7t/2≤1의 상한 계산 | — | — | N/A | N/A |
| 유사2/q23 | 문제 | EXEMPT: 6개의 서로 다른 빵 배분 조건 | — | — | N/A | N/A |
| 유사2/q23 | 해설 | EXEMPT: 근오 배분 0 또는 1로 나누는 수치 계산 | — | — | N/A | N/A |

판정 검산: 문제 23축 = EXEMPT 21 + 기존 이미지 유지 2, 해설 23축 = BENEFICIAL 2 + EXEMPT 21. 새 제작용 plan **2개**. 이미 게시한 원본 PNG 및 기존 SVG에는 변경을 가하지 않는다.
