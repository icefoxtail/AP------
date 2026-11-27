# 비상 공통수학Ⅱ 도형의 방정식 — 익힘책 SVG plan 전수 감사

- 원문: `archive/exams/textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_익힘책_고1.js` (SHA-256 `872c06ac99de069e0bb128be000fd9d1d20bb35482e0a4b1de259c0f9576cd2b`)
- 문항 14개 × 문항/해설 2축 = **28축**. 그림 필요한 14축 중 **13축 정적 parity PASS, 1축 ENGINE_CAPABILITY_PENDING**. 나머지 14축은 그림 없는 원문 발문·선택지·해설 확인 후 EXEMPT.
- 총 **16 plan JSON**, 공식 `plan-lint.cjs --shallow` / 전체 `plan-lint.cjs` **16/16 OK** (최종 재실행 기준). `DRAWN_FEATURE_PARITY`는 원문 ↔ 실제 plan 렌더 필드의 **정적** 대조이며 PNG/SVG 실렌더 검수를 뜻하지 않음.
- 별도 흰 바탕·불필요한 다각형 면 채움 없음. 원문 q13/q14 문제 PNG의 움직이는 점·계단 윤곽·점선을 보존하고 정답 노출은 문제 축에서 차단함.
- 표의 `plan경로`는 이 Markdown 파일과 같은 폴더(`archive/tools/geometry-equation/production/plans/비상_공통수학2_도형의방정식_익힘책_고1/`)를 기준으로 한다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q01 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q01 | 해설 | PLAN_READY | construction-spike-v1 | `q01-solution.plan.json` | shallow OK / full OK | PASS — A−P−B, 좌표와 AP:PB=3:2 실제 글 라벨 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q02 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q02 | 해설 | PLAN_READY | construction-spike-v1 | `q02-solution.plan.json` | shallow OK / full OK | PASS — △ABC·중선 AM·G(5,8)·직선 x−y+3=0 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q03 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q03 | 해설 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q04 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q04 | 해설 | PLAN_READY | construction-spike-v1 | `q04-solution.plan.json` | shallow OK / full OK | PASS — 세 평행선의 두 수선 PH/PH2와 두 직각, P/H/H2/A/B/C |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q05 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q05 | 해설 | PLAN_READY | ellipse-figure-v1 | `q05-solution.plan.json` | shallow OK / full OK | PASS — 원 중심 C·지름 ED·중심 통과 직선 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q06 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q06 | 해설 | PLAN_READY | ellipse-figure-v1 | `q06-solution.plan.json` | shallow OK / full OK | PASS — 원·C/H/P/L, CH⊥직선 직각, 최장 거리 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q07 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q07 | 해설 | PLAN_READY | ellipse-figure-v1 | `q07-solution.plan.json` | shallow OK / full OK | PASS — 세 직선의 삼각형 OAB와 외접원 중심 C |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q08 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q08 | 해설 | PLAN_READY | ellipse-figure-v1 | `q08-solution.plan.json` | shallow OK / full OK | PASS — 현 AB·중심 C·수선 발 M와 직각 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q09 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q09 | 해설 | PLAN_READY | ellipse-figure-v1 | `q09-solution.plan.json` | shallow OK / full OK | PASS — 외부점 T의 두 접선 TP/TQ·현 PQ·접점 수선 직각 2개 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q10 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q10 | 해설 | PLAN_READY | ellipse-figure-v1 | `q10-solution.plan.json` | shallow OK / full OK | PASS — 원점 대칭 A/O/P, OA·OP 점선, 직선 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q11 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q11 | 해설 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q12 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q12 | 해설 | PLAN_READY | ellipse-figure-v1 + construction-spike-v1 | `q12-solution.plan.json`, `q12-solution-tangencies.plan.json` | shallow OK / full OK | PASS — 이동 전·후 원, C/Cp, Ty/Tx/Ty2 세 접점과 직각 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q13 | 문항 | PLAN_READY | construction-spike-v1 | `q13-problem.plan.json` | shallow OK / full OK | PASS — 문제: A−P−Q−B(x축/y=x), 해설: A′·B′ 대칭·√74 경로 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q13 | 해설 | PLAN_READY | construction-spike-v1 | `q13-solution.plan.json` | shallow OK / full OK | PASS — 문제: A−P−Q−B(x축/y=x), 해설: A′·B′ 대칭·√74 경로 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q14 | 문항 | PLAN_READY | construction-spike-v1 | `q14-problem.plan.json` | shallow OK / full OK | PASS — 문제: f/g 계단 12변·좌표 점선, 해설: 중간 f₁ 경유 2단계 이동 |
| 비상_공통수학2_도형의방정식_익힘책_고1.js/q14 | 해설 | ENGINE_CAPABILITY_PENDING | construction-spike-v1 | `q14-solution.plan.json`, `q14-solution-stage.plan.json` | shallow OK / full OK | ENGINE_CAPABILITY_PENDING — 중간 도형 f₁의 정확한 아래첨자 글리프 (TEXT_LABEL_MATH_UNSUPPORTED / MISSING_KOREAN_GLYPH); f1 대체 표기 |

## ENGINE_CAPABILITY_PENDING — q14 해설 (정확한 아래첨자)

- 원문 해설 SVG는 `f` → `f₁` → `g`의 **세 단계 계단 도형**과 첫 번째 `(−7,2)` 평행이동·두 번째 x축 대칭을 보여 준다. 중간 도형 자체는 `q14-solution-stage.plan.json`에 **실제 6개 변**으로, 시작·최종 도형은 `q14-solution.plan.json`에 실제 12개 변·이동 점선으로 작성되어 도형/방향은 맞는다.
- 다만 중간 도형의 원문 아래첨자 라벨 `f₁`은 현 엔진의 `planeMarks.textLabels`가 문자 직접 표기에서 `MISSING_KOREAN_GLYPH`, 수식 `f_1`에서 `TEXT_LABEL_MATH_UNSUPPORTED`로 거절함. 실행 가능한 결과에는 임시 `f1`로 표시하였으므로 **DRAWN_FEATURE_PARITY=ENGINE_CAPABILITY_PENDING**, 필드 수준 1:1 완료 집계에서 제외. 필요 기능: 좌표 도형용 아래첨자 영문/숫자 표시 지원(글꼴·수식 레이아웃/관측기). 손 SVG나 임의 문자열로 우회하지 않음.

## 추가 원문 ↔ 필드 확인

- q01 해설: `AP:PB=3:2`를 `planeMarks.textLabels`로 실제 문자 표시.
- q04 해설: 평행선 세 개의 양쪽 거리 `√13`를 P−H/P−H2 두 수선, 직각 사각형 2개로 표시.
- q05/q06/q08/q09: 지름 양 끝점·수선의 발·접점·직각을 `LINE_CONIC` 또는 `FOOT(rightAngle:true)`로 엔진이 자체 계산.
- q12 해설: 원 2개는 conic 플랜, 원문 기호 `C,Cp,Ty,Tx,Ty2`와 축에 대한 세 수선은 독립 좌표 플랜에 표시.
- q13 문제: 예시 P,Q만 그리고 대칭 최적점과 답 노출 없음. 해설: `A′,B′`, 실제 경로 `A−P−Q−B`, 직선화 `A′−P−Q−B′` 및 길이 `√74`의 `pathLabels`로 해결.

## 익힘책 qid 원문 식별자 (표의 qNN은 source 배열 순서)

| 배열 순서 | 원문 qid |
|---|---|
| q01 | `qid_v1_e096c669bb99f512a57e7383e36d57ef2534ab78aeb794605c9c197430bc48a3` |
| q02 | `qid_v1_47f15fd93f79484f6b466be24bd688d5abbfba734895462d97674396280d8219` |
| q03 | `qid_v1_e2625f0daf829b818c03659ac5c15f973a15a2a557ce4d9b7a64860155ac62d6` |
| q04 | `qid_v1_1d3d39f7f7a680bb3533173b8eecb519aecbb1ac78329baa2397856dce86273a` |
| q05 | `qid_v1_81b028a97af61d9c5c85f34737b9e38ae63c37818a14bb40a0f74f2c59708d07` |
| q06 | `qid_v1_685ceda707cd7842ae2889000b6b75efda29af06ad2fce6a19a10f5ffcadd118` |
| q07 | `qid_v1_0251148df84aac752249499886748271b339fb63a6172551608793f9162e0368` |
| q08 | `qid_v1_0c587370973c7d176eb219c11f5aa99f7771d53ba225fe222730eb1fd0f333bb` |
| q09 | `qid_v1_74c9cd183dbd93b71fc0f21ee23950d1293891da0fec0f384fd8b4dc05dd6d9a` |
| q10 | `qid_v1_1c509b7d2139da0f76e7a30f4501fdcaf43e38f054e6b2300f2f1ce46cb235de` |
| q11 | `qid_v1_7c7fc67c408e346e1b95989775fcfc7bc378691f4fa3cd8e71f7900f2cc30887` |
| q12 | `qid_v1_7f949c1ed08debe451e83f14d4bb65dbb82b088ab7301fd98972956fbb763c25` |
| q13 | `qid_v1_7c398cc5fde486d4b5aac52199efbe23a22765a2a119b395e3cdec7a15ff9431` |
| q14 | `qid_v1_18411ece86836f4a41191861b1763f6ed5763e3982a0c6acd0497e95b2fee41f` |
