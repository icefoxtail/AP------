# 22 복성고 고2 수학II Q20

출처 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, 기준 main `a28bec278aada73e6c39de89174738839205b902`, source blob `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`. 원문 questionBank ordinal 20; source-exact.js의 questionBank에서 원문 item, 정답, 해설을 확인해 plan.sourceQuote에 해설 문자열을 그대로 복사했다. 기존 시험지 원본·그림과 다른 문항 package는 변경하지 않았다.

원문 해설 인용 (verbatim):

두 점의 $x$좌표를 $u<v$라 하면 포물선 $y=x^2$의 두 점을 잇는 할선은 $$y=(u+v)x-uv$$입니다. 이 직선과 포물선의 높이 차는 $$(u+v)x-uv-x^2=(x-u)(v-x).$$ 둘러싸인 넓이는 $$S=\int_u^v(x-u)(v-x)dx=\frac{(v-u)^3}{6}=\frac43,$$ 따라서 $v-u=2$입니다. 선분 중점의 $x$좌표를 $m=(u+v)/2$라 하면 중점의 $y$좌표는 $$\frac{u^2+v^2}{2}=m^2+\frac{(v-u)^2}{4}=m^2+1.$$ 따라서 중점의 자취는 $y=f(m)=m^2+1$이고 $$f(2)=4+1=\boxed5$$로 ④입니다. ①·②·③·⑤는 넓이 조건에서 정한 두 접점 간 간격을 반영한 자취와 다릅니다.

계획 범위: 일반 중점 자취 f(x)=x²+1, 원래 포물선 g(x)=x², 한 예 u=1,v=3의 할선 y=4x−3, A=(1,1),B=(3,9),M=(2,5), 면적 4/3.

사유: 사용자가 풀이 이해에 도움이 되는 함수 도식을 원함.

상태: LOCAL_ONLY / DRAFT_ONLY. plan.json, publish.json, item.json을 preparation package용 입력 초안으로만 작성했다. 의도대로 모든 입력이 기록된 뒤 checker가 검수하도록 하며, 작성자가 독립 checker·수학검수·렌더를 실행하지 않았다.

실제 입력 fit, semantic validation, engine preparation, renderer/build, SVG/PNG, browser/visual review, 전체 수학·문구 검토, CI, publication, handoff/READY 판정: NOT_RUN.



## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## 입력 오류 보정 이력

상위 작업자의 실제 checker 결과에서 필수 main/reference quadratic 꼭짓점이 누락되었다. `f(x)=x²+1`의 꼭짓점 `(0,1)`과 기준 포물선 `g(x)=x²`의 꼭짓점 `(0,0)`을 `requiredPoints`에 `marker: NONE`으로 추가했다. 두 점은 프레이밍·정확 특징 목록에만 보존하며 기존 A, B, M, 할선, 일반 자취와 넓이 `4/3`은 그대로 두었다. 수정 후 checker는 재실행하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-40-16-648Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.
초기 실패는 failure-history.json 및 corrections/before/q20에 보존했다. 확정된 오기·필수점·식별자만 정정했고 item/publish, 수학 의도, 원문은 바꾸지 않았다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
