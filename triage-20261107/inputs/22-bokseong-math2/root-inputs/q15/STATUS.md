# 22 복성고 고2 수학II Q15

출처 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, 기준 main `a28bec278aada73e6c39de89174738839205b902`, source blob `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`. 원문 questionBank ordinal 15; source-exact.js의 questionBank에서 원문 item, 정답, 해설을 확인해 plan.sourceQuote에 해설 문자열을 그대로 복사했다. 기존 시험지 원본·그림과 다른 문항 package는 변경하지 않았다.

원문 해설 인용 (verbatim):

$a>1/2$이므로 세 영점은 $0<1<2a$입니다. $f(x)=x^2(x-1)(x-2a)$는 $(0,1)$에서 양수, $(1,2a)$에서 음수입니다. 그림의 A와 B 넓이가 같다는 것은 부호를 포함한 정적분이 상쇄되어 $$\int_0^{2a}x^2(x-1)(x-2a)dx=0$$이라는 뜻입니다. 전개하면 $x^4-(1+2a)x^3+2ax^2$이므로 $$\left[\frac{x^5}{5}-\frac{(1+2a)x^4}{4}+\frac{2ax^3}{3}\right]_0^{2a}=\frac{-4a^4(6a-5)}{15}=0.$$ $a>1/2$이므로 $a=0$은 제외하고 $$\boxed{a=\frac56}$$입니다. ②~⑤는 두 영역의 부호 있는 정적분을 0으로 만들지 못합니다.

계획 범위: a=5/6을 대입한 f(x)=x²(x−1)(x−5/3), 중근 접촉점 (0,0), 교차점 (1,0),(5/3,0), 부호가 다른 두 영역 A와 B.

사유: 사용자가 풀이 이해에 도움이 되는 함수 도식을 원함.

상태: LOCAL_ONLY / DRAFT_ONLY. plan.json, publish.json, item.json을 preparation package용 입력 초안으로만 작성했다. 의도대로 모든 입력이 기록된 뒤 checker가 검수하도록 하며, 작성자가 독립 checker·수학검수·렌더를 실행하지 않았다.

실제 입력 fit, semantic validation, engine preparation, renderer/build, SVG/PNG, browser/visual review, 전체 수학·문구 검토, CI, publication, handoff/READY 판정: NOT_RUN.



## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## 입력 오류 보정 이력

상위 작업자의 실제 checker 결과 `REQUIRED_POINT_NOT_ON_CURVE:M`에 따라 M/N의 세로 좌표만 바로잡았다. 현재 승인된 다항식에 SymPy로 `x=1−√6/6` 및 `x=1+√6/6`을 정확 대입한 결과 각각 `−1/36+2√6/27`, `−1/36−2√6/27`이다. 두 점의 x좌표와 다항식, 근·영역·넓이 내용은 변경하지 않았다. 수정 후 checker는 재실행하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-40-16-648Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.
초기 실패는 failure-history.json 및 corrections/before/q15에 보존했다. 확정된 오기·필수점·식별자만 정정했고 item/publish, 수학 의도, 원문은 바꾸지 않았다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
