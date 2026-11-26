# 2024 금당중 1학기 중간 중3 유사시험지 SVG plan 감사 — q01~q24

- 대상: `archive/exams/similar/middle/m3/1mid/24_금당중_1학기_중간_중3_유사.js`
- 시작 main: `a7ddbcaceb60edc86c7b2965d54057628e634e7e`
- 범위: 24문항 / 문제·해설 48축. REQUIRED 2축, BENEFICIAL 0축, EXEMPT 46축.
- 기존 문제용 JSON 24개 중 실제 엔진 capability plan은 q11 한 개, 나머지 23개는 `status: EXEMPT` 자리표시자였다. 이번 작업에서 q05 자리표시자 한 개를 실제 `number-line-figure-v1` plan으로 교체했다. **현재 실행 가능한 형식의 plan은 q05, q11 두 개**이며, 나머지 EXEMPT JSON은 실행 그림으로 세지 않는다.
- 범위 내 신규 JSON 파일 **0개**, 기존 plan 교정 **1개**, 기존 실행형 plan 유지 **1개**, 감사 기록 신규 **1개**.
- q05 문제의 누락된 직각삼각형 원본 이미지는 확보되지 않았다. q05는 확인 가능한 수직선 관계만 **부분 도식**으로 재구성했으며 원문과 동일한 그림이라고 판정하지 않는다.
- q11 문제의 기존 `construction-spike-v1` plan은 그대로 보존했다.

## 문항별 2축 검수 및 EXEMPT 사유

표의 `qNN-problem`은 같은 시험지의 `_plans/qNN-problem.plan.json`을 뜻한다. `EXEMPT JSON`은 실제 SVG 그림이 아니라 이전에 저장된 판정 자리표시자이므로 실행 plan 수에 넣지 않는다. `—`는 작성할 plan이 필요 없는 축이다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY | 판단 근거 / EXEMPT 사유 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 금당중24/q01 | 문제 | EXEMPT | 없음 | 기존 q01-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 제곱근 정의·성질의 진위를 고르는 텍스트 선지. 그림은 관계 판정에 불필요. |
| 금당중24/q01 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 선지별 정의 적용을 문장과 수식으로 대조하면 충분. |
| 금당중24/q02 | 문제 | EXEMPT | 없음 | 기존 q02-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 근호 사칙연산의 계산 결과를 고르는 식 비교. |
| 금당중24/q02 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 근호 계산·유리화 과정만으로 오류를 구별할 수 있음. |
| 금당중24/q03 | 문제 | EXEMPT | 없음 | 기존 q03-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 양·음의 제곱근을 구해 합하는 대수 계산. |
| 금당중24/q03 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 각 제곱근의 부호와 값이 수식 단계로 명확함. |
| 금당중24/q04 | 문제 | EXEMPT | 없음 | 기존 q04-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 근호를 포함한 실수의 대소 비교, 그림 없이 수식으로 비교 가능. |
| 금당중24/q04 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 각 선택지의 제곱·비교 계산만으로 충분. 임의 수직선은 중복. |
| 금당중24/q05 | 문제 | REQUIRED | number-line-figure-v1 | `q05-problem.plan.json` (교정) | shallow PASS / full PASS | **EVIDENCE_DEBT**; 실제 렌더 NOT_VERIFIED | 원문에 모눈·직각삼각형 ABC가 명시됐으나 JS/자산에 원본 그림이 없음. 해설에 명시된 A=2, P=2−√5, Q=2+√5와 좌우 방향만 엔진 모델에 구현; 정답 점의 수치 라벨은 숨김. 실제 삼각형 BC, 직각표식, 원본 좌표·배치는 미재현. |
| 금당중24/q05 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 피타고라스 길이 산출·대칭점 곱셈은 해설의 단계별 수식으로 충분; 문제의 부분 도식 중복 불필요. |
| 금당중24/q06 | 문제 | EXEMPT | 없음 | 기존 q06-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | a=√3, b=√5를 이용한 계수 치환 계산. |
| 금당중24/q06 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | b²=5 치환식을 명확히 적어 계산 가능. |
| 금당중24/q07 | 문제 | EXEMPT | 없음 | 기존 q07-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 근호를 포함한 합·곱·나눗셈의 수식 계산. |
| 금당중24/q07 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 근호 간단히 하기·유리화가 전개식으로 충분. |
| 금당중24/q08 | 문제 | EXEMPT | 없음 | 기존 q08-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 근호식의 계수 m,n 계산 및 곱. |
| 금당중24/q08 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 제곱인수 분리 및 근호 나눗셈을 수식으로 단계별 제시. |
| 금당중24/q09 | 문제 | EXEMPT | 없음 | 기존 q09-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 40−x의 완전제곱수 조건을 세는 정수 개수 세기. |
| 금당중24/q09 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 가능한 완전제곱수 열거만으로 충분, 수직선 추가 시 중복. |
| 금당중24/q10 | 문제 | EXEMPT | 없음 | 기존 q10-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | ab<0, a>b의 부호 조건으로 절댓값 근호 계산. |
| 금당중24/q10 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 부호 결정과 |a|, |b| 처리는 논리·수식으로 충분. |
| 금당중24/q11 | 문제 | REQUIRED | construction-spike-v1 | `q11-problem.plan.json` (기존 유지) | shallow PASS / **full ENV_BLOCKED** | **NOT_VERIFIED (ENV_BLOCKED)** | 그림의 색종이 3개는 높이가 다른 정사각형을 밑변에 이어 붙인 구조라 둘레 계산에 필수. 독립 수치 대조상 넓이 3,27,12, 좌→우 순서 및 밑변 정렬은 정확하나 full 엔진·최종 렌더 불가. |
| 금당중24/q11 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 이미 존재하는 문제 그림을 참조해 각 변의 근호 길이와 외곽 합을 수식으로 구하면 충분; 해설 그림은 중복. |
| 금당중24/q12 | 문제 | EXEMPT | 없음 | 기존 q12-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 완전제곱식 조건을 위한 전개와 상수 비교. |
| 금당중24/q12 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 일차항 계수 절반의 제곱을 적용하는 대수 과정. |
| 금당중24/q13 | 문제 | EXEMPT | 없음 | 기존 q13-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | ab=18인 정수 쌍과 합 k를 비교하는 수식 문제. |
| 금당중24/q13 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 양·음의 약수쌍 나열과 계수 비교가 충분. |
| 금당중24/q14 | 문제 | EXEMPT | 없음 | 기존 q14-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 무리수의 완전제곱식 전개. |
| 금당중24/q14 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 유리수·무리수 계수 분리를 수식으로 직접 표현. |
| 금당중24/q15 | 문제 | EXEMPT | 없음 | 기존 q15-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 공통인수 분해 후 보기 인수 판별. |
| 금당중24/q15 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 4x(x−2y) 인수분해와 보기 대조만 필요. |
| 금당중24/q16 | 문제 | EXEMPT | 없음 | 기존 q16-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 이차식 인수분해의 정수 계수 a,b 찾기. |
| 금당중24/q16 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 전개·계수 비교가 핵심이며 십자선은 장식적 보조에 그침. |
| 금당중24/q17 | 문제 | EXEMPT | 없음 | 기존 q17-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | x,y의 켤레근 관계와 곱셈 공식 수식. |
| 금당중24/q17 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | xy(x−y) 식 변형·대입 계산으로 충분. |
| 금당중24/q18 | 문제 | EXEMPT | 없음 | 기존 q18-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | n에 대한 이차식의 인수분해와 소수 조건. |
| 금당중24/q18 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 정수인수의 곱과 소수 정의로 조건 도출. |
| 금당중24/q19 | 문제 | EXEMPT | 없음 | 기존 q19-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 연속 네 수의 곱+1의 완전제곱 꼴 발견. |
| 금당중24/q19 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 숫자 묶기·치환 후 합차 공식이 수식에 드러남. |
| 금당중24/q20 | 문제 | EXEMPT | 없음 | 기존 q20-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | x±y 조건을 활용한 사차식 합차 계산. |
| 금당중24/q20 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | (x−y)(x+y)(x²+y²) 분해·대입 과정이 충분. |
| 금당중24/q21 | 문제 | EXEMPT | 없음 | 기존 q21-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 36의 제곱근을 문장으로 정의하는 서술형. |
| 금당중24/q21 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | x²=36의 해와 개념 설명이 직접적인 학습 목표. |
| 금당중24/q22 | 문제 | EXEMPT | 없음 | 기존 q22-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | 두 다항식의 인수분해 및 공통인수 서술. |
| 금당중24/q22 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 두 식 인수분해 순서와 공통 일차식만으로 명확. |
| 금당중24/q23 | 문제 | EXEMPT | 없음 | 기존 q23-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | A,B 근호식 전개·계산을 묻는 서술형. |
| 금당중24/q23 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 분배법칙·근호 나눗셈·동류항 정리 순서가 설명됨. |
| 금당중24/q24 | 문제 | EXEMPT | 없음 | 기존 q24-problem EXEMPT JSON | shallow/full OK(자리표시자) | EXEMPT | x,y의 켤레분모 유리화 후 x²−y² 계산. |
| 금당중24/q24 | 해설 | EXEMPT | 없음 | — | 해당 없음 | EXEMPT | 분모 유리화와 합차 공식 수식만으로 충분. |

## 실행형 plan의 실제 필드 대조

| plan | 원문에서 확인되는 사실 | 공식 엔진 모델·실제 그리기 대상 필드 | 판정 |
| --- | --- | --- | --- |
| q05 문제 | 해설에 기준점 A=2, AP=AB=√5, AQ=AC=√5, P는 왼쪽, Q는 오른쪽 | `solveNumberLineFigure` 모델: `A.value=2`, `P.value=2-sqrt(5)` / `Q.value=2+sqrt(5)`, `c1` LEFT, `c2` RIGHT, 양쪽 반지름 √5, `showValue:false`로 세 값 모두 미표시, `band:false`, 축 변수 표시 없음 | 수학적 관계 및 답 비노출 모델 필드 일치. 실제 Chrome 렌더 NOT_VERIFIED. 삼각형·격자·직각은 누락되어 원문 전체 패리티 **EVIDENCE_DEBT**. |
| q11 문제 | 3, 27, 12 cm² 정사각형을 왼쪽부터 밑변 정렬, 도형 둘레를 묻는 문제 | 기존 `SOURCE_POINT` P0~P9와 `planeMarks.regions` r1/r2/r3의 면적을 독립 계산한 결과 정확히 3, 27, 12, 가로 경계 0, √3, 4√3, 6√3; 서로 맞닿은 밑변 0. 색 면 채움 3개는 색종이 원문에 근거. 원문 SVG 자산 존재. | 좌표·면적·순서·채움의 수학적 사전 대조는 일치. Python full lint 및 현재 렌더 불가로 DRAWN_FEATURE_PARITY **NOT_VERIFIED**. |

q05의 현재 plan은 **원문 도형 전체를 복구한 plan이 아님**. 단순히 해설에서 확정되는 수직선 관계만 그리고, 그림에 값/정답은 노출하지 않는다. 원문에서 직각삼각형 ABC의 실제 좌표, 세 변, 직각표식, 모눈 및 배치가 증빙되기 전에는 EVIDENCE_DEBT에서 PASS로 승격하지 않는다. 참고 가능한 **기출** q5.png는 *정사각형 ABCD* 문제이므로 직각삼각형으로 각색된 이번 유사문항의 원본 그림을 대신하지 못한다.

## 공식 검증 수행 기록

검사 명령:

```bash
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/exams/similar/middle/m3/1mid/24_금당중_1학기_중간_중3_유사_plans/q??-problem.plan.json
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs archive/exams/similar/middle/m3/1mid/24_금당중_1학기_중간_중3_유사_plans/q??-problem.plan.json
```

| 대상 범위 | shallow lint | full lint | 참고 |
| --- | --- | --- | --- |
| 기존/교정 문제 plan JSON 24개 전체 | **24/24 OK**, exit 0 | **23/24 OK**, exit 1 | 22개는 EXEMPT JSON으로, 엔진이 실제 그림을 만드는 검사가 아님 |
| 실행형 q05 문제 | **1/1 PASS** | **1/1 PASS** | JS 수직선 모델 및 그리기 대상 필드 독립 비교도 수행 |
| 실행형 q11 문제 | **1/1 PASS** | **0/1; ENV_BLOCKED** | `ModuleNotFoundError: No module named 'visual_engine'` |
| 실행형 plan만 집계 | **2/2 PASS** | **1/2 PASS, ENV_BLOCKED 1** | 패리티 PASS와 구별 |

q05 공식 `production/render-plan.mjs` 실제 렌더 시도는 `ARCHIVE_PREFLIGHT_FAIL`: `browserType.launch: Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome`. 따라서 공식 SVG/PNG의 현행 렌더, 화면·A4 확인, 독립 DOM 관측 모두 **NOT_RUN/NOT_VERIFIED**. q11은 공식 외부 Python `visual_engine`이 없어 full lint가 차단됨. 두 환경 장애는 **엔진의 표현 능력 부족(ENGINE_CAPABILITY_PENDING)** 이나 **원문 근거 부채(EVIDENCE_DEBT)** 와 혼동하지 않는다.

## 미해결 상태와 해결 조건

1. **이번 회차 신규 EVIDENCE_DEBT 1축 — 금당중24 q05 문제.** 직각삼각형 ABC의 실제 원본 문제 그림, 모눈 좌표 및 배치를 복원하고 정답 비노출·직각표식·세 변·라벨·호의 실제 렌더를 대조해야 한다. 현재는 해설에서 확정되는 수직선 관계만 구현.
2. **이번 회차 신규 엔진 기능 미지원 0축.** q05의 누락 삼각형은 원본 자료 부재와 현재 부분 도식의 미재현 항목이며, 엔진의 구현 불가능성이 확정된 것은 아니다.
3. **ENV_BLOCKED/NOT_VERIFIED — 금당중24 q11 문제.** 공식 Python `visual_engine` 의존성을 갖춘 환경에서 full lint와 실제 렌더·관측 수행. q05 또한 Chrome 확보 후 렌더·관측해야 한다.
4. **기존 회차 잔여(이번 회차 집계 제외):** 향림중23 q15/q19 문제의 full lint ENV_BLOCKED·패리티 NOT_VERIFIED, 왕운중23 유사3 q23 문제·해설 EVIDENCE_DEBT 2축(정사각형 좌우 순서 근거 부족), 풍덕중23 유사1 q21 해설 ENGINE_CAPABILITY_PENDING 1축(수치와 연결된 소문자 점 라벨 a,b,c 미지원).

## 변경 범위

- 수정: 이 시험지 `_plans/q05-problem.plan.json` 한 개.
- 신규: 이 시험지 `_plans/VISUAL_AUDIT_Q01_Q24.md` 한 개.
- 이 시험지의 기존 나머지 JSON 23개, JS 본문, 기출·유형은행·교과서·문제집, 다른 시험지 전부 변경하지 않음.

종합: 1종 / 24문항 / 48축, REQUIRED 2 / BENEFICIAL 0 / EXEMPT 46, 신규 plan JSON 0 / 기존 실행형 plan 교정 1 / 기존 실행형 유지 1, executable shallow 2/2 PASS, full 1/2 PASS + ENV_BLOCKED 1, DRAWN_FEATURE_PARITY PASS 0 / EVIDENCE_DEBT 1 / NOT_VERIFIED 1, 신규 ENGINE_CAPABILITY_PENDING 0. 실제 렌더 검사 NOT_VERIFIED(q05, q11).
