# 2024 신흥중 중3 1학기 중간 유사 — SVG plan 2축 감사 q01~q25

## 대상·범위·중복

- 원본: `archive/exams/similar/middle/m3/1mid/24_신흥중_1학기_중간_중3_유사.js` (25문항)
- 이번 대상: q01~q25, 25문항 × 문제/해설 2축 = 50축. 다른 시험지와 기존 JS·SVG·PNG는 변경하지 않았다.
- 시작 시 `main` SHA: `2e6866fb477c91d3b0b8fea9a1a2a47a53d80168` (#3158 병합본). 열린 PR 20건의 변경 파일 목록에 이 시험지 stem의 경로가 없었다. PR #3143은 2023 왕운중 중3 유사1·2 q13~q24 전용 Draft/Open으로 별도 보존한다.
- 기존 문제 JSON 25개 중 q06 문제만 `number-line-figure-v1` 실행형이고 나머지 24개는 `EXEMPT` 판정 자리표시자. 기존 q06 실행형과 24개 판정 파일은 변경하지 않았다.

## 각 문항의 문제축·해설축 개별 판단

| qid | problem 판정·근거 | solution 판정·근거 |
| --- | --- | --- |
| q01 | EXEMPT — 두 제곱근의 부호를 문장으로 특정, 그림 없이 합을 결정 | EXEMPT — 제곱과 양·음의 제곱근 계산 3단계가 식으로 완결 |
| q02 | EXEMPT — 제곱근 정의에 관한 진위 선택, 도형 데이터 없음 | EXEMPT — 각 선택지의 참·거짓 근거가 근호식 자체에 있음 |
| q03 | EXEMPT — 근호·절댓값 등식의 진위 비교, 공간 관계 없음 | EXEMPT — 각 근호식을 절댓값/제곱으로 바꾸는 풀이가 직접적 |
| q04 | EXEMPT — 근호와 유리수의 대소 부등식 비교, 상대적 배치 그림 불필요 | EXEMPT — 제곱 또는 수치 비교로 충분하며 수직선은 계산 중복 |
| q05 | EXEMPT — 열거된 실수의 유·무리수 분류 | EXEMPT — 각각을 정리해 분류한 목록에 시각도식이 추가 정보를 주지 않음 |
| q06 | **REQUIRED** — 발문이 ‘다음 그림’을 직접 지시하고 모눈 선분·수직선 점의 상대 위치를 요구. 기존 실행 plan·SVG 유지 | **BENEFICIAL** — 피타고라스 길이의 좌·우 방향과 P=-√5, Q=2+√13을 함께 시각화. 신규 q06-solution.plan.json |
| q07 | EXEMPT — 두 주사위의 범위와 조건이 문자로 완전 제시되며 문제 그림은 정답 셀을 노출할 우려 | **BENEFICIAL** — 6×6 표에서 ab=3인 2칸과 ab=12인 4칸을 구별해 유리한 경우를 셈. 신규 q07-solution.plan.json |
| q08 | EXEMPT — 근호 곱셈/나눗셈 5개 계산형 선택지 | EXEMPT — 각 계산식의 동치 여부가 단계별 근호 변형으로 직접 확인됨 |
| q09 | EXEMPT — a=√2, b=√5로 √7을 표현하는 대수식 | EXEMPT — a²+b²=7인 식 계산을 시각화해도 새 관계가 없음 |
| q10 | EXEMPT — 다섯 분모 유리화 식의 진위 확인 | EXEMPT — 곱하는 켤레식과 결과를 문자식으로 모두 볼 수 있음 |
| q11 | EXEMPT — 근호식을 계수별로 정리하는 대수 계산 | EXEMPT — √2·√6 계수끼리 묶는 연산이 해설에 명시됨 |
| q12 | EXEMPT — 전개 후 x²·x·상수 계수 산출 | EXEMPT — 두 다항식의 전개·동류항 정리가 식으로 완결 |
| q13 | EXEMPT — x+y, xy로 x²+y² 계산, 도형 조건 없음 | EXEMPT — (x+y)²−2xy 한 항등식의 직접 대입 |
| q14 | EXEMPT — 무리수 항이 없어지는 유리수 매개변수 결정 | EXEMPT — √6의 계수를 0으로 놓는 식이 충분 |
| q15 | EXEMPT — 3003×2997에 적합한 곱셈 공식 선택 | EXEMPT — (3000+3)(3000−3) 대칭 관계가 식으로 명료 |
| q16 | EXEMPT — 합차 공식을 반복 적용하는 항등식 | EXEMPT — x²−1→x⁴−1→…의 지수 전개 흐름이 문자식으로 완결 |
| q17 | EXEMPT — 인수 x−3의 포함 여부를 다섯 식에서 판단 | EXEMPT — 선지별 인수분해가 모든 판정 근거를 직접 제시 |
| q18 | EXEMPT — 2<x<5가 텍스트로 분명하고 답을 미리 암시하는 범위 도식 불필요 | **BENEFICIAL** — 열린 구간 (2,5)을 수직선에 표시해 x−5<0, x−2>0인 부호 판단을 돕는다. 신규 q18-solution.plan.json |
| q19 | EXEMPT — 완전제곱식이 될 k를 구하는 다항식 계수 조건 | EXEMPT — 4x²−8x−5+k와 (2x−2)²의 계수 대조로 완결 |
| q20 | EXEMPT — 2⁸−1의 약수 판별, 그림이 아니라 정수 인수분해 | EXEMPT — 인수 3·5·17 분해 및 약수 판정이 문자식으로 충분 |
| q21 | EXEMPT — 세 학생의 제곱근 설명 중 오류 찾기, 상대 위치 무관 | EXEMPT — √((-7)²)=7의 정의를 바로잡는 문장과 식이 핵심 |
| q22 | EXEMPT — 주어진 √5.3·√53의 근삿값을 자리 이동해 계산 | EXEMPT — 10배·1/10배 및 반올림의 자릿수 관계가 숫자로 확인됨 |
| q23 | EXEMPT — 근호 계산 결과의 두 계수 산출 | EXEMPT — √2항·√3항을 분리하는 식 정리가 충분 |
| q24 | EXEMPT — 전개도 치수의 가로·세로 의미가 발문에서 직접 정의되며 수치 조건 완비 | **BENEFICIAL** — 원기둥의 옆면을 펼친 직사각형 가로(밑면 둘레), 높이, 원의 반지름을 동시에 대응. 신규 q24-solution.plan.json |
| q25 | EXEMPT — 103²의 곱셈 공식 적용을 서술하는 단순 계산 | EXEMPT — (100+3)² 전개가 이미 단계별로 제시되어 넓이 그림은 중복 |

**집계:** REQUIRED 1 / BENEFICIAL 4 / EXEMPT 45 = 50축. 실행형 총 5개(기존 1 + 신규 4), 교정 0개. EXEMPT 자리표시자 24개는 실행형으로 집계하지 않는다.

## 원문 ↔ 엔진 모델 ↔ 실제 그리기 사양(spec)의 대조

| 축 | capability | 원문 독립 계산과 모델 | 실제 spec의 표시 필드 | 상태 |
| --- | --- | --- | --- | --- |
| q06 문제 | number-line-figure-v1 | AB=√(2²+1²)=√5, CD=√(3²+2²)=√13, P=−√5, A=0, C=2, Q=2+√13 | `r1-src-cA/cC` 모눈 2×1·3×2, 호 2개, 점 P/A/C/Q 4개; 기존 plan에서 값 라벨은 숨김 | 모델·spec 일치, 기존 SVG는 유지. 최종 재렌더 대조 NOT_VERIFIED |
| q06 해설 | number-line-figure-v1 | 같은 거리·점 순서, CP=2+√5는 별도 풀이식에서 확인 | 모눈·호 동일, P/A/C/Q 값 라벨 4개를 실제 spec에 추가 | 모델·spec 일치, SVG/화면 NOT_VERIFIED |
| q07 해설 | stat-chart-figure-v1 | ab=3: (1,3),(3,1) / ab=12: (2,6),(3,4),(4,3),(6,2); 합 6/36 | DICE_TABLE `PRODUCT` 36칸 중 tone 1의 2칸, tone 2의 4칸 지정. 엔진 모델 `highlightedCount=6` | 모델·spec 일치, SVG/화면 NOT_VERIFIED |
| q18 해설 | number-line-figure-v1 | √((x−5)²)−√((x−2)²)=|x−5|−|x−2|, 2<x<5 | `r1-band-1` 2→5, 양 끝 `OPEN` 원 2개, 끝값 2·5 라벨 | 모델·spec 일치, SVG/화면 NOT_VERIFIED |
| q24 해설 | solid-figure-v1 | 2πr=6√2π → r=3√2, h=4√3, 옆면 폭 6√2π | `net-rect`, `net-circle-bottom/top`, `dim-1/2/3` 라벨 6√2π·4√3·3√2. 모델 폭≈26.657298, 높이≈6.928203, 반지름≈4.242641 | 모델·spec 일치, SVG/화면 ENV_BLOCKED |

- q24의 `radius`·`height`에는 공식 solid 엔진이 수치 필드만 받으므로, 유도한 **정확한** `3√2`와 `4√3`의 부동소수점 평가값을 사용했다. 임의의 비율이나 가상의 문제 조건이 아니다. spec의 `rect-width=2πr=6√2π`를 독립 검산했다. `dim-1`의 복합 근호·π 라벨은 엔진에서 `numeric:false`인 수식 표시이므로 위 수학 대조가 필수이며, 실제 SVG 문자열은 아직 확인하지 못했다.
- q06 문제에 정답인 `−√5` 값 라벨을 새로 넣지 않았다. 정답이 드러나는 값 라벨은 해설 plan에만 배치했다. 다른 문항의 문제축은 모두 EXEMPT로 새 문제 그림을 만들지 않았다.
- **중요: 모델/spec의 정적 대조 5/5와 `DRAWN_FEATURE_PARITY` 최종 PASS는 다르다.** 실제 SVG 재생성·렌더 라벨·학생 화면·A4 비교가 완료되지 않아 이 5축의 최종 `DRAWN_FEATURE_PARITY=NOT_VERIFIED`, PASS 0/5로 보존한다.

## 검사 결과 및 차단

- 공식 검사기: `archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs` (현재 main). Python 경로를 `PYTHONPATH=$PWD/archive/tools/geometry-equation`, `GEOMETRY_PYTHON=python3`로 지정했다.
- 29개 JSON **전체**(24개 EXEMPT 판정 파일 + 5개 실행형): shallow **29/29 OK**, full **29/29 OK**. 폴더 인수만 주면 검사기 `collectPlanFiles`가 `*.plan.json`을 수집하지 않으므로, 실제 검사에는 `.../_plans/*.plan.json` 글롭으로 파일 29개를 명시했다.
- **실행형 5개만 따로 집계**: shallow 5/5 PASS, full 5/5 PASS. lint FAIL 0, SKIP 0, lint ENV_BLOCKED 0.
- 실제 렌더 시도: q24 해설 공식 `production/render-plan.mjs --item ... --plan ... --out ...`을 호출했다. 처음에는 sparse 작업본의 `archive/engine.html` 미포함으로 `ARCHIVE_PREFLIGHT_FAIL`; 파일을 추가하여 재시도한 뒤에도 시스템 `/usr/bin/chromium` 스크립트가 `/usr/lib/chromium/chromium: not found`로 종료(exit 127)되어 **ARCHIVE_PREFLIGHT_FAIL / 렌더 ENV_BLOCKED**. 실제 SVG/PNG가 만들어졌다고 보고하지 않는다.
- 나머지 q06 문제·해설, q07 해설, q18 해설의 이번 회차 렌더: NOT_RUN. 현재 q06 문제의 기존 SVG가 JS `image`에 연결되어 있으나, 이번 plan 판본으로 재렌더 검증했다는 뜻은 아니다.
- 5축의 실물 SVG 필드 검증·학생 화면·A4: NOT_VERIFIED / NOT_RUN. `DRAWN_FEATURE_PARITY` 최종 PASS 0, NOT_VERIFIED 5. static model/spec 확인만 완료했다.
- 신규 `ENGINE_CAPABILITY_PENDING` 0축, 신규 `EVIDENCE_DEBT` 0축. 엔진 capability 자체의 스키마·모델·spec은 5개 모두 정상이며 실제 브라우저 실행기가 없는 환경 장애와 구별한다.
- 후속 조건: 정상 Chromium 실행기·브라우저 런타임에서 5개 plan SVG를 공식 재생성하고, 최종 SVG의 라벨·모눈·호·강조 칸·열린 끝·치수/원 위치를 독립 관측 및 화면/A4로 대조한다. 통과 이전에는 DRAWN_FEATURE_PARITY를 PASS로 승격하지 않는다.

## 기존 회차의 별도 미해결(이번 신규 집계와 합산 금지)

- 2024 삼산중 q19 문제·q21 문제·q23 해설: full lint ENV_BLOCKED 3, DRAWN_FEATURE_PARITY NOT_VERIFIED 3 (직전 환경에서). q21 교정 plan 기준 SVG 재생성·학생 화면 검수 필요.
- 2024 금당중 q05 문제: 원본 그림 EVIDENCE_DEBT 1, Chrome NOT_VERIFIED. q11 문제: full lint ENV_BLOCKED, 패리티 NOT_VERIFIED.
- 2023 향림중 q15·q19 문제: full lint ENV_BLOCKED, 패리티 NOT_VERIFIED.
- 2023 왕운중 유사3 q23 문제·해설: 정사각형 배치 EVIDENCE_DEBT 2.
- 2023 풍덕중 유사1 q21 해설: 소문자 a,b,c 수직선 라벨 ENGINE_CAPABILITY_PENDING 1.
- 2023 왕운중 유사1·2 q13~q24: PR #3143 Open/Draft, 변경 범위는 별도 라인 소유이므로 중복 작업·임의 병합하지 않는다.

## 인계

- 신규 해설 plan 4개: `q06-solution.plan.json`, `q07-solution.plan.json`, `q18-solution.plan.json`, `q24-solution.plan.json`.
- 다음 시험지 후보(최신 main에서 중복·범위 재검증): `archive/exams/similar/middle/m3/1mid/24_연향중_1학기_중간_중3_유사.js`.
