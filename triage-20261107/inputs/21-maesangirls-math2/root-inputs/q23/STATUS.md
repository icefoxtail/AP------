# 21 매산여고 고2 수학II Q23

상태: **DRAFT_ONLY · LOCAL_ONLY**. 요청한 폴더에 item/plan/publish 초안과 이 상태 기록만 저장했다. 이 초안은 READY 또는 게시 가능 판정이 아니다.

원문 바인딩: `archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 23; 기준 main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`; 정확 원문 `preparation-21-maesangirls-math2/source-exact.js` (41934 bytes, SHA-256 `c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9`, Git blob `edfbd0d27672dc288fbbec741aad01de36967a4a`). 로컬 원문 크기와 SHA-256을 대조했다. sourcePath/ordinal은 item.json에 기록했다.

원문 문항 (source-exact.js의 content, 정확 인용):

```text
[주관식5 (서술형)] 삼차함수 $f(x)$가 다음 조건을 만족시킨다.
(가) $\displaystyle\lim_{x\to0}\dfrac{f(x)-5}{x}=0$
(나) $f(x)$의 극댓값과 극솟값의 곱은 $5$이다.
함수 $g(x)$는 $0\le x<3$일 때 $g(x)=f(x)$이고 모든 실수 $x$에 대하여 $g(x+3)=g(x)$이다. $g(x)$가 실수 전체의 집합에서 연속일 때, $\displaystyle\int_0^{24}g(x)\,dx$의 값을 구하여라. [총 7점](부분점수 있음.)
1) 함수 $f(x)$를 구하여라. (4점)
2) $\displaystyle\int_0^{24}g(x)\,dx$의 값을 구하여라. (3점)
```

원문 정답 필드 (정확 인용): `$f(x)=x^3-3x^2+5$; $\displaystyle\int_0^{24}g(x)\,dx=66$`

원문 해설 (source-exact.js의 solution, 정확 인용):

```text
삼차함수를 $f(x)=ax^3+bx^2+cx+d$라 두자.
$\displaystyle\lim_{x\to0}\frac{f(x)-5}{x}=0$에서 $d=5,c=0$이다.
주기 $3$인 함수가 경계에서도 연속이므로 $f(3)=f(0)=5$이다.
$27a+9b+5=5$에서 $b=-3a$이다.
따라서 $f(x)=ax^3-3ax^2+5$이고
$f'(x)=3ax(x-2)$이다. 두 극값은 $f(0)=5$, $f(2)=5-4a$이므로
$5(5-4a)=5$에서 $a=1$이다.
$f(x)=x^3-3x^2+5$이다.
주기가 $3$이고 $24=8\cdot3$이므로
$\displaystyle\int_0^{24}g(x)\,dx=8\int_0^3f(x)\,dx$
$=8[\frac14x^4-x^3+5x]_0^3=66$이다.
```

시각화 사유 및 범위: 원문 visualDisposition `NO_ADDITIONAL_VISUAL_REQUIRED` 이력은 원문에서 변경하지 않았다. 풀이 관계를 보조하는 선택적 함수 그림 초안을 별도로 제안한다. 주기함수의 전체 그래프가 아니라 한 주기 구간 [0,3]만 표시한다. 양 끝 좌표 (0,5),(3,5), 내부 최솟점 (2,1), 한 주기 넓이 33/4를 나타낸다.

검사 기록: 문항 23의 questionBank ordinal, 문항 본문, 정답 및 해설을 로컬 원문에서 읽었다. 계산과 입력 계약은 초안 단계에서 작성했으며 independent checker는 실행하지 않았다.

미실행: 독립 입력 checker, author tests, fit/semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, publication 및 handoff는 모두 **NOT_RUN**이다. 원격 쓰기·렌더·엔진·source/assets/ledger 편집은 하지 않았다. Q01/Q03 실제 엔진 결과, 과거 `NO_ADDITIONAL_VISUAL_REQUIRED` 이력, 이전 392개 로컬 파일과 기존 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 SHA-256

- item.json: `27987b30a63d767b92d2a50bbf0154c85d91686351e0b3f6f8ac33130a38af3d`
- plan.json: `876b1acb783cb601a0d3a412cd4ee7e2d88de01f61f2627ac69e59d38deedb28`
- publish.json: `c330b4da8da303eb3e19aae3d0d0221ff1a45b6a6c1bb758f77ca60a2717b3c3`


## 첫 동결 입력 검사 결과 및 기술적 HOLD

실행 근거: `preparation-21-maesangirls-math2/checker/reports/run-summary-2026-11-08T20-28-38-433Z.json` 및 같은 실행의 node 결과. Q23의 첫 동결 입력 검사에서 원문/입력 바인딩과 JSON 파싱은 PASS, 실제 `fit_overview`는 **FAIL**: `ValueError: PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM`; `specFor` 및 `formal_render`는 NOT_RUN. 이는 harness-only 오류가 아니라 checker가 호출한 production graph_framing의 실제 piecewise-polynomial region-root 계약 제한이다.

호출 경로: `check_candidates.mjs`가 `run_graph_fit.py`를 호출하고, 그 스크립트가 보존된 graph_framing 모듈의 `fit_overview(graph_plan)`을 실행한다. `fit_overview → _fit_overview_family → fit_piecewise_polynomial → piecewise_polynomial_regions → _pp_region_crossings → pp_poly_roots` 단계에서 region P의 상·하 경계 차 (x^3-3x^2+5)의 근을 정확히 요구한다. 이 유리계수 삼차식은 유리근정리 후보 (±1, ±5) 중 근이 없어 유리수 위에서 기약이고, 해당 근 찾기는 irreducible degree-3 factor를 풀 수 없어 `PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM`로 닫힌다. 따라서 알려진 한 주기 구간에서 함수가 양수라는 점만으로 region 검증을 통과시킬 수 없다. 이는 문법 수정으로 해결되는 입력 문제가 아니므로 기존 plan·publish·source math·구간·region을 그대로 두고 **TECHNICAL HOLD**를 유지한다. 근을 근사하거나 region을 버리거나 정의역을 바꾸지 않았다.

NOT_RUN 이력 갱신: 첫 실패 이후 재검사하지 않았다. `specFor`, semantic/coordinate/viewport 검증, engine.prepare/build, render/SVG/PNG, visual review, 독립 전체 수학검토, CI, publication 및 handoff는 계속 NOT_RUN이다. 이전의 “checker not run” 표기는 초안 시점의 이력이며, 위 첫 실행 결과가 현재 상태다.


## 하위 단계 축 제목 정적 확인

원래 plan의 graphPlan.axisTitles.y는 `y=g(x)`이다. 실제 phase2.mjs:527–538, 1723의 축 제목 계약은 등호를 허용하지 않으므로 이 필드에도 문법 문제가 있다. Q23은 그 앞의 fit_overview에서 이미 중단되었기 때문에 specFor가 이 오류를 실제로 반환한 것은 아니며, 해당 실행 단계는 NOT_RUN으로 유지한다. 원래 실패 초안의 bytes를 보존하기 위해 이 작업에서는 plan을 수정하거나 다시 검사하지 않았다. 향후 정확근 제한을 해결하는 승인된 표현을 선택할 때 이 축 제목도 계약에 맞게 정정해야 한다.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **TECHNICAL_HOLD / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch.
실제 fit_overview FAIL: PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM. 정확한 기존 초안을 그대로 보존하고 재시도하지 않았다. specFor 및 하위 semantic/coordinate/viewport 단계는 NOT_RUN이다. 별도로 축 제목의 등호 문법 문제는 정적 확인만 기록했다.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
