# 22 복성고 고2 수학II Q22

출처 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, 기준 main `a28bec278aada73e6c39de89174738839205b902`, source blob `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`. 원문 questionBank ordinal 22; source-exact.js의 questionBank에서 원문 item, 정답, 해설을 확인해 plan.sourceQuote에 해설 문자열을 그대로 복사했다. 기존 시험지 원본·그림과 다른 문항 package는 변경하지 않았다.

원문 해설 인용 (verbatim):

(1) $I=\int_1^2 f(t)dt$라고 놓으면 주어진 식은 $$f(x)=\frac{12}{7}x^2-2Ix+I^2$$입니다. 양변을 1부터 2까지 적분하면 $$I=\frac{12}{7}\left[\frac{x^3}{3}\right]_1^2-2I\left[\frac{x^2}{2}\right]_1^2+I^2(2-1).$$ $$I=4-3I+I^2\quad\Rightarrow\quad I^2-4I+4=0\quad\Rightarrow\quad\boxed{I=2}.$$ (2) 이를 원래 함수식에 대입하면 $$f(x)=\frac{12}{7}x^2-4x+4.$$ 따라서 $$f(7)=\frac{12}{7}\cdot49-28+4=84-24=\boxed{60}.$$

계획 범위: I=2로 결정된 f(x)=12x²/7−4x+4, 적분구간 [1,2] 아래 넓이 2, 그리고 P=(7,60).

사유: 사용자가 풀이 이해에 도움이 되는 함수 도식을 원함.

표시 주의: (7,60)과 [1,2] 적분영역을 같은 축에 보존한다. 이 범위 차이가 영역을 작게 보이게 할 수 있으나 그림은 렌더되지 않아 크기·가독성 검토는 NOT_REVIEWED다. 새 좌표나 축 조정은 추가하지 않았다.

상태: LOCAL_ONLY / DRAFT_ONLY. plan.json, publish.json, item.json을 preparation package용 입력 초안으로만 작성했다. 의도대로 모든 입력이 기록된 뒤 checker가 검수하도록 하며, 작성자가 독립 checker·수학검수·렌더를 실행하지 않았다.

실제 입력 fit, semantic validation, engine preparation, renderer/build, SVG/PNG, browser/visual review, 전체 수학·문구 검토, CI, publication, handoff/READY 판정: NOT_RUN.



## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.
[1,2] 영역과 (7,60)을 함께 표시할 때의 간격·가독성은 NOT_REVIEWED.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-33-27-909Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
