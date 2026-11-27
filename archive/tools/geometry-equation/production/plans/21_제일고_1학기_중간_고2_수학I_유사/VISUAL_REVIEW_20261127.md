# 2021 제일고 1학기 중간 수학 I 유사 — SVG plan 재검수

- 원본: `archive/exams/similar/high/h2/1mid/21_제일고_1학기_중간_고2_수학I_유사.js`
- 검수 기준: `main` `4f959dfcf6f9aedcb2625b2c7f0a4006e1a48f2e`의 24문항, 문제·해설 **48축**. 실제 JS 발문·보기·해설과 기존 `*_plans/VISUAL_AUDIT_Q01_Q24.md`를 대조했다.
- 기존 `_plans/`의 실행형 11개를 원문·그려지는 필드·정답 노출 기준으로 재검수하여 이 폴더에 **내용 동일하게** 배치했다. 기존 JS, SVG, PNG 및 기존 `_plans/`는 수정하지 않았다. 손 SVG 없음.
- 공식 `plan-lint.cjs`에서 **shallow 11/11 OK, full 11/11 OK**, FAIL·SKIP 0. 정본 NotoSansKR.ttf SHA-256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252` 확인.
- `sourceQuote`와 JS 일치 **11/11**, `sourceConditions[].mappedTo` 30건에서 누락 필드 **0**(명시적 ENGINE_CAPABILITY_PENDING 표기 포함). 면 채움(`fill`, `regions`) 0건. 렌더·PNG·학생 화면·A4·JS 신규 연결 **NOT_RUN**.
- `q11-solution`과 `q20-problem/solution`은 **ENGINE_CAPABILITY_PENDING**이다. q11은 아직 실행형 plan이 없고, q20의 기존 2개 plan은 곡선 3개를 그릴 수 있지만, 이름 붙은 교점은 그리지 못하므로 완성으로 집계하지 않는다.

| qid | problem 판정·사유 | solution 판정·사유 | 실행형 plan (이 폴더 기준) | DRAWN_FEATURE_PARITY(정적 필드) |
| --- | --- | --- | --- | --- |
| q01 | EXEMPT: 로그 합 | EXEMPT: 로그 법칙 | — | 해당 없음 |
| q02 | EXEMPT: 지수부등식 | EXEMPT: 밑 통일·일차부등식 | — | 해당 없음 |
| q03 | EXEMPT: 사분면·tan | BENEFICIAL: 제2사분면 3:4:5 관계 | `q03-solution.plan.json` | PASS: P(−4,3), 세 변 3/4/5·직각표식 |
| q04 | EXEMPT: 부호 조건 | EXEMPT: 부호 추론 | — | 해당 없음 |
| q05 | EXEMPT: 근의 합을 미리 보이면 답 노출 | BENEFICIAL: sin과 x축 교점 | `q05-solution.plan.json` | PASS: 5π/6,11π/6·교점·π 눈금 |
| q06 | EXEMPT: 로그방정식 | EXEMPT: 치환 계산 | — | 해당 없음 |
| q07 | EXEMPT: 10^x와 두 점 | EXEMPT: 로그 차 계산 | — | 해당 없음 |
| q08 | REQUIRED: 로그곡선·정사각형 배치 | BENEFICIAL: A,D 위치 검산 | `q08-problem.plan.json`, `q08-solution.plan.json` | PASS: A~D 4점·4변·BC=2, 문제축 D의 수치좌표 비노출 |
| q09 | EXEMPT: 지수함수 변환 | EXEMPT: 공통점 대입 | — | 해당 없음 |
| q10 | EXEMPT: sin−cos | EXEMPT: 항등식 | — | 해당 없음 |
| q11 | EXEMPT: 역함수 조건은 문자식 | BENEFICIAL: 역함수의 두 교점 | **없음** | **ENGINE_CAPABILITY_PENDING**: 밑 `8^(1/7)`의 정확한 표현·역함수 두 곡선 및 (1,1),(8,8) 표시 기능 필요. lint NOT_RUN |
| q12 | EXEMPT: 로그함수 최댓값 | BENEFICIAL: 안쪽 이차식 꼭짓점 | `q12-solution.plan.json` | PASS: y=(16−x)x, 열린 끝·(8,64) |
| q13 | EXEMPT: 이차부등식·cos 범위 | EXEMPT: 판별식 | — | 해당 없음 |
| q14 | EXEMPT: 부채꼴 두 개의 대수 조건 | EXEMPT: 반지름 합과 곱 | — | 해당 없음 |
| q15 | EXEMPT: 로그부등식 | EXEMPT: 진수 조건·자연수 | — | 해당 없음 |
| q16 | EXEMPT: 지수 연쇄식 | EXEMPT: 밑변환 | — | 해당 없음 |
| q17 | REQUIRED: sin 곡선 아래 내접 직사각형 | BENEFICIAL: 대칭축과 높이 | `q17-problem.plan.json`, `q17-solution.plan.json` | PASS: A~D 4점·4변·BC=4, 문제축 답 수치 비노출 |
| q18 | EXEMPT: 삼각함수 최솟값 | EXEMPT: AM-GM 적용 | — | 해당 없음 |
| q19 | EXEMPT: 실근 개수 수열 | EXEMPT: 짝홀·부호 분류 | — | 해당 없음 |
| q20 | REQUIRED: 세 곡선의 교점 A/B/C 관계 | BENEFICIAL: 역함수 대칭·교점 비교 | `q20-problem.plan.json`, `q20-solution.plan.json` | **ENGINE_CAPABILITY_PENDING 2축**: EXP×LOG 및 LOG×LOG 초월 교점의 자동 계산·A/B/C 이름표·소유 지시선. 현재는 곡선 3개와 해설 y=x만 그려짐. lint 2/2 OK이나 parity 미완 |
| q21 | EXEMPT: 지수 치환식 | EXEMPT: 판별식 | — | 해당 없음 |
| q22 | EXEMPT: 삼각함수 표준각 | EXEMPT: 수치 대입 | — | 해당 없음 |
| q23 | EXEMPT: 구해야 할 개형 파라미터 | BENEFICIAL: 진폭·주기·위상 | `q23-solution.plan.json` | PASS: COS 극값·π 눈금·주기 4π |
| q24 | EXEMPT: 반감기 식·조건 | BENEFICIAL: 시간에 따른 지수 감소 | `q24-solution.plan.json` | PASS: 30년 1/2·120년 1/16, 실제 곡선과 점 |

**집계:** 문제 24축(REQUIRED 3, EXEMPT 21), 해설 24축(BENEFICIAL 9, EXEMPT 15). 실행형 plan **11**, 정적 DRAWN_FEATURE_PARITY **9 PASS**, **ENGINE_CAPABILITY_PENDING 3축**(`q11-S` plan 미작성, `q20-P/S` 부분 구현). 그려지지 않는 라벨을 caption으로 대체해 PASS로 주장하지 않는다.
