# 2024 삼산중 1학기 중간 중3 유사 — SVG plan 48축 감사 (q01~q24)

- 대상: `archive/exams/similar/middle/m3/1mid/24_삼산중_1학기_중간_중3_유사.js`
- 시작 main: `ed34c81158678f08c252ec2a8b9d0c19eac39137`
- 선정: 실제 존재하는 q01~q24, 24문항 / 문제·해설 48축.
- 판정: **REQUIRED 3축 / BENEFICIAL 0축 / EXEMPT 45축**.
- 기존 문제 plan JSON 24개 중 22개는 `status: EXEMPT` 판정 자리표시자였고, 실행 가능한 형식의 `construction-spike-v1` 문제 plan은 q19, q21 두 개였다. 자리표시자 22개를 SVG 실행형 plan에 포함하지 않는다.
- 신규 실행형: **q23 해설 1개**. 기존 실행형 교정: **q21 문제 1개**(기존 도형의 넓이 9를 원문의 넓이 12로 교정). 기존 실행형 보존: q19 문제 1개. 전체 실행형 3개.
- 신규 감사 기록 1개. 원본 JS, 기존 SVG, 기타 시험지/유형/교과서/문제집은 수정하지 않는다.
- **검수 한계:** 외부 Python `visual_engine` 모듈과 `/opt/google/chrome/chrome`이 현재 실행 환경에 없어 모든 construction plan의 full lint 및 실제 렌더 패리티가 미완료이다. 부분 사전 대조와 전체 렌더 패리티 PASS는 별개다.

## 문항별 문제·해설 두 축

`qNN-problem.plan.json` 등의 상대 경로는 이 파일이 있는 `_plans/` 디렉터리를 기준으로 한다. 기존 EXEMPT JSON의 lint OK는 그 JSON이 예외 판정으로 읽혔음을 뜻하며, **실제 도형을 실행·검증했다는 뜻이 아니다**.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY | 축별 판단·EXEMPT 사유 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 삼산24/q01 | 문제 | EXEMPT | 없음 | 기존 q01-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 제곱근 정의의 옳은 진술을 고르는 독해·개념 문제이며 그림에 의존하지 않음. |
| 삼산24/q01 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 선택지별 제곱근 정의·기호 적용을 문장과 수식으로 확인 가능. |
| 삼산24/q02 | 문제 | EXEMPT | 없음 | 기존 q02-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 제곱근 근삿값 반올림 숫자의 정확성 비교. |
| 삼산24/q02 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 제곱 계산 및 반올림 자릿수 대조가 핵심; 축·그래프는 중복. |
| 삼산24/q03 | 문제 | EXEMPT | 없음 | 기존 q03-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 다항식 전개 공식의 선지 계산. |
| 삼산24/q03 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 각 선지 직접 전개·비교로 충분한 대수 풀이. |
| 삼산24/q04 | 문제 | EXEMPT | 없음 | 기존 q04-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | x+y 값을 완전제곱식에 넣는 식 계산. |
| 삼산24/q04 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | (x+y)² 치환 단계만으로 이해 가능. |
| 삼산24/q05 | 문제 | EXEMPT | 없음 | 기존 q05-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 근호·절댓값을 a,b의 부호로 계산하는 수식. |
| 삼산24/q05 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 부호별 |a|,|b| 판단 및 동류항 정리로 충분. |
| 삼산24/q06 | 문제 | EXEMPT | 없음 | 기존 q06-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 유리수·무리수 및 실수의 조밀성에 관한 진술 판정. |
| 삼산24/q06 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 무한성·밀도 성질을 문장으로 구별, 임의 수직선은 일반성을 증명하지 못함. |
| 삼산24/q07 | 문제 | EXEMPT | 없음 | 기존 q07-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 근호 유리화·곱셈 계산으로 a,b 결정. |
| 삼산24/q07 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 계수 분리와 분모 유리화의 직접 수식이 충분. |
| 삼산24/q08 | 문제 | EXEMPT | 없음 | 기존 q08-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 근호가 들어간 분배법칙·동류항 계산. |
| 삼산24/q08 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 전개한 항과 계산 결과가 수식으로 드러남. |
| 삼산24/q09 | 문제 | EXEMPT | 없음 | 기존 q09-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 무리수 계수가 0이 되는 유리수 x의 조건. |
| 삼산24/q09 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 유리수항·√3항을 분리하는 대수 풀이만 필요. |
| 삼산24/q10 | 문제 | EXEMPT | 없음 | 기존 q10-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 삼각형 밑변·높이와 직사각형 높이가 문장에 주어짐; 면적 등식만 물음. |
| 삼산24/q10 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 두 넓이 공식을 바로 등치시키면 충분하며 개별 배치도는 장식. |
| 삼산24/q11 | 문제 | EXEMPT | 없음 | 기존 q11-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 다항식 인수분해 선지의 정오 판단. |
| 삼산24/q11 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 우변 전개와 좌변 대조로 판별 가능. |
| 삼산24/q12 | 문제 | EXEMPT | 없음 | 기존 q12-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 켤레근 분모의 유리화 후 차 계산. |
| 삼산24/q12 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 켤레식 곱셈과 항별 정리로 충분. |
| 삼산24/q13 | 문제 | EXEMPT | 없음 | 기존 q13-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 합차 공식과 동치인 식의 선택. |
| 삼산24/q13 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | (x+y)(x−y)=x²−y²를 보기별로 전개하면 충분. |
| 삼산24/q14 | 문제 | EXEMPT | 없음 | 기존 q14-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 다항식 전개와 미지 계수 비교. |
| 삼산24/q14 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 상수항·일차항 계수 비교를 식으로 표시. |
| 삼산24/q15 | 문제 | EXEMPT | 없음 | 기존 q15-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 완전제곱식의 일차항 계수를 구하는 방정식. |
| 삼산24/q15 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | ±4의 두 경우를 대수적으로 제시해 충분. |
| 삼산24/q16 | 문제 | EXEMPT | 없음 | 기존 q16-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 합·곱으로 제곱합을 구하는 식 변환. |
| 삼산24/q16 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 식 묶기와 (a+b)²−2ab 공식으로 해결. |
| 삼산24/q17 | 문제 | EXEMPT | 없음 | 기존 q17-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | √x의 정수 부분이 7인 자연수 개수. |
| 삼산24/q17 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 7≤√x<8을 49≤x<64로 바꾸어 세면 충분. 정답 점 수를 문제 그림에 표시하면 사전 노출. |
| 삼산24/q18 | 문제 | EXEMPT | 없음 | 기존 q18-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 세 정사각형의 넓이만 주어지고 위치·배치 정보 없음. 한 변 합만 계산. |
| 삼산24/q18 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 넓이의 양의 제곱근 √12,√27,√75을 계산해 합치면 충분; 도형은 중복. |
| 삼산24/q19 | 문제 | REQUIRED | construction-spike-v1 | `q19-problem.plan.json` (기존 유지) | shallow PASS / full ENV_BLOCKED | **NOT_VERIFIED (ENV_BLOCKED)** | 큰 직사각형에서 작은 정사각형 3개를 도려낸 관계를 알아야 함. 기존 도형의 정규화 모델 산술은 조건과 일치; 실제 SVG 재검증 불가. |
| 삼산24/q19 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 기존 문제 도형을 참조하고 x(x−2y)−3y² 인수분해를 식으로 하면 충분; 중복 도식 불필요. |
| 삼산24/q20 | 문제 | EXEMPT | 없음 | 기존 q20-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | a의 범위와 근호·절댓값을 포함한 수식 계산. |
| 삼산24/q20 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 완전제곱식 변환 및 0<a<1에 따른 부호 판별로 충분. |
| 삼산24/q21 | 문제 | REQUIRED | construction-spike-v1 | `q21-problem.plan.json` (기존 교정) | shallow PASS / full ENV_BLOCKED | **NOT_VERIFIED (기존 SVG 재생성 필요)** | 정사각형 넓이 12에 비해 기존 plan의 변 길이 3·면적 9는 오류. 좌표를 √12로 교정해 내부 수학 검증 완료, 현행 출력 자산은 미갱신. |
| 삼산24/q21 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 문제에서 주어진 위치를 기존 그림이 나타내고, 해설은 P/Q 좌표·분모 유리화 과정을 수식으로 계산하면 충분. |
| 삼산24/q22 | 문제 | EXEMPT | 없음 | 기존 q22-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 직육면체 세 모서리 길이를 문장·수식으로 전부 명시. 부피·겉넓이 공식 대입 문제. |
| 삼산24/q22 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 세 쌍의 면적과 부피를 단계적으로 식으로 계산. 개별 입체 그림은 풀이에 새로운 정보 없음. |
| 삼산24/q23 | 문제 | EXEMPT | 없음 | 기존 q23-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 곱셈 공식의 빈칸과 넓이 분할 증명을 요구하므로 4영역의 넓이를 문제 그림에 미리 쓰면 정답·증명 과정 사전 노출. |
| 삼산24/q23 | 해설 | REQUIRED | construction-spike-v1 | `q23-solution.plan.json` (신규) | shallow PASS / full ENV_BLOCKED | **NOT_VERIFIED (ENV_BLOCKED)** | (a+b)²을 a², ab, ab, b² 네 영역으로 분할하는 해설 3단계의 공간 관계를 직접 도식화. 상징적 a,b이며 화면 정규화 수치는 실제 비율 조건 아님. |
| 삼산24/q24 | 문제 | EXEMPT | 없음 | 기존 q24-problem EXEMPT JSON | shallow/full OK(판정용) | EXEMPT | 무리수 대입법과 대수적 제곱법을 비교하는 서술형. |
| 삼산24/q24 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 직접 대입·이항 제곱 두 경로를 수식으로 비교해 충분. |

## 실행형 plan의 원문→엔진 모델·표현 필드 대조

| 축 | 원문 조건 | 모델/그리기 대상 필드에서 확인한 내용 | 최종 상태 |
| --- | --- | --- | --- |
| q19 문제(보존) | x>3y>0, 가로 x/세로 x−2y 직사각형에서 한 변 y인 정사각형 3개 제거 | 기존 `mathPlan.nodes` A~L 및 `displaySegments` 14개, `planeMarks.regions` c1/c2/c3 3개. 독립 수치 검산 시 정규화 x=7,y=2, 직사각형 넓이 21, 각 정사각형 넓이 4(총 12), 남은 넓이 9=(7+2)(7−6). 치수 라벨 x,x−2y,y. 비워진 부분의 답 식은 문제에 표시하지 않음. | 공식 Python full lint·현재 렌더 불가로 NOT_VERIFIED |
| q21 문제(교정) | A=3, 정사각형의 면적 12 → 변 길이 √12, P는 오른쪽, Q는 왼쪽 | 교정 `SOURCE_POINT`: A=(3,0), P=(3+√12,0), Q=(3−√12,0), D=(3,√12), C=(3+√12,√12). `displaySegments`와 `equalLengths`가 AP,AQ,AD,DC,CP에 연결, `rightAngles` 4개, 정수 라벨 3 유지. 독립 계산: 면적 정확히 12, 다섯 변 길이 모두 √12, 모든 직각 내적 0, 정답 b/a 미노출. | **기존 출력 SVG는 옛 면적9 도식일 수 있으므로 재생성 필수**; full·렌더 NOT_VERIFIED |
| q23 해설(신규) | a,b>0, (a+b)²을 네 사각형 넓이의 합으로 증명 | 화면 배치용 좌표 P0~P8(가로·세로 분할 3,2), 12개 경계선, `planeMarks.regions`: a² / ab / ab / b², 네 변 치수 a,b,a,b. 독립 예시 수치: 9+6+6+4=25=5², 겹치거나 빠진 영역 없음. 3:2는 본문의 a:b 실측 조건이 아니며 캡션에 예시 도식이라고 명시. | 공식 Python full lint·현재 렌더 불가로 NOT_VERIFIED |

**주의:** 위의 숫자·식 대조는 원문 조건과 계획된 모델 필드의 사전 검수다. 공식 엔진의 최종 SVG가 이 필드를 전부 정확히 그렸다는 DRAWN_FEATURE_PARITY PASS는 아니다. 기존 q21 SVG가 현재 변경된 plan의 내용과 일치하는지 아직 확인할 수 없으며, 실제 학생 화면으로 재출력해야 한다. 원문에 없는 답을 문제 그림에 표시하지 않았다.

## lint / 실제 렌더 실행 기록

```bash
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/exams/similar/middle/m3/1mid/24_삼산중_1학기_중간_중3_유사_plans/q??-problem.plan.json
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs archive/exams/similar/middle/m3/1mid/24_삼산중_1학기_중간_중3_유사_plans/q??-problem.plan.json
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/exams/similar/middle/m3/1mid/24_삼산중_1학기_중간_중3_유사_plans/q23-solution.plan.json
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs archive/exams/similar/middle/m3/1mid/24_삼산중_1학기_중간_중3_유사_plans/q23-solution.plan.json
```

| 집계 기준 | shallow | full |
| --- | --- | --- |
| 기존/교정 문제용 JSON 24개 | **24/24 OK** | **22/24 OK**, ENV_BLOCKED 2 |
| 신규 q23 해설 실행형 JSON | **1/1 PASS** | **ENV_BLOCKED 1** |
| 전체 JSON 25개(자리표시자 포함) | **25/25 OK** | **22/25 OK**, ENV_BLOCKED 3 |
| 실제 실행형 plan 3개만 분리 | **3/3 PASS** | **0/3 PASS**, ENV_BLOCKED 3 |

- full lint 장애: `ModuleNotFoundError: No module named 'visual_engine'` (q19 문제, q21 문제, q23 해설).
- 공식 `production/render-plan.mjs` q23 해설 렌더 실행 시도: `ARCHIVE_PREFLIGHT_FAIL` / `browserType.launch: Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome`.
- SVG/PNG 현행 재렌더, 독립 SVG DOM 관측, 학생 화면, A4 인쇄 검수는 **NOT_RUN/NOT_VERIFIED**.
- 이 실패는 엔진이 대수 넓이 분할 기능을 근본적으로 지원하지 않는다는 증거가 아니므로 ENGINE_CAPABILITY_PENDING으로 오분류하지 않는다.

## 이번 회차 및 기존 미해결

- 신규 ENGINE_CAPABILITY_PENDING **0축**.
- 신규 EVIDENCE_DEBT **0축**. q23의 a,b는 임의의 양수이며 화면 배치용 정규화 3:2는 비율 조건이라고 주장하지 않는 일반 도식이다.
- 신규 ENV_BLOCKED / DRAWN_FEATURE_PARITY NOT_VERIFIED **3축**: q19 문제, q21 문제, q23 해설.
- q21 기존 출력 자산은 plan 교정 이전 도형이어서 재생성·패리티 검사가 요구된다. 원본 JS/SVG는 사용자 범위 제약 때문에 이번 PR에서 수정하지 않았다.
- 기존 회차 잔여(이번 신규 집계 제외): 금당중24 q05 문제 EVIDENCE_DEBT 1축·Chrome 렌더 미검증; 금당중24 q11 문제 Python full ENV_BLOCKED; 향림중23 q15/q19 문제 Python full ENV_BLOCKED; 왕운중23 유사3 q23 문제·해설 EVIDENCE_DEBT 2축(정사각형 배치); 풍덕중23 유사1 q21 해설 ENGINE_CAPABILITY_PENDING 1축(소문자 수직선 점 라벨).

## 최종 범위

변경 파일은 다음 세 개뿐이다.

1. 기존 `q21-problem.plan.json` — 정사각형 12㎠ 및 수직선 P,Q 좌표 교정.
2. 신규 `q23-solution.plan.json` — 면적 네 분할 증명 plan.
3. 신규 `VISUAL_AUDIT_Q01_Q24.md` — 24문항 48축 판정과 EXEMPT 사유.

**최종 집계:** 1종 / 24문항 / 48축, REQUIRED 3 / BENEFICIAL 0 / EXEMPT 45, 신규 실행형 JSON 1 / 교정 1 / 기존 실행형 유지 1, 실제 실행형 총 3, shallow 3/3 PASS, full 0/3 PASS + ENV_BLOCKED 3, DRAWN_FEATURE_PARITY PASS 0 / NOT_VERIFIED 3, 신규 E_CAP 0 / 신규 E_DEBT 0.
