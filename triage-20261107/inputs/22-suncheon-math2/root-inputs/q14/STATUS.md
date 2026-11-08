# 22 순천고 고2 수학II Q14

출처 바인딩: `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, source-exact.js 49,980 bytes, Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, 기준 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 원문 questionBank Q14의 ordinal은 14이다. 보호 대상 기존 자산은 없으며 새 자산도 만들지 않았다.

원문 인용(원문 해설의 전체 문자열):
[세 실근 조건] $\frac13x^3-x=k$의 도함수는 $x^2-1$, 극댓값은 $x=-1$에서 $\frac23$, 극솟값은 $x=1$에서 $-\frac23$. 따라서 $-\frac23<k<\frac23$일 때 서로 다른 세 실근이다.
세 근의 합은 비에타로 $\alpha+\beta+\gamma=0$이다. $k>0$일 때 양의 근은 하나 $\gamma>\sqrt3$, 나머지 둘은 음수이므로 절댓값 합은 $2\gamma>2\sqrt3$이다. $k<0$일 때 대칭적으로 음의 근 하나의 절댓값이 $\sqrt3$보다 크므로 합이 $2\sqrt3$보다 크다.
$k=0$에서는 근이 $-\sqrt3,0,\sqrt3$이므로 절댓값 합의 최솟값 $m=2\sqrt3$. 따라서 $m^2=12$.
[보기 판단] ① 9, ③ 16, ④ 27, ⑤ 48은 이 최솟값의 제곱과 다르다. ② 12가 정답. $k=0$도 서로 다른 세 근을 가지므로 경계 제외 조건과 혼동하지 않는다.

도식은 원문의 삼차함수와 최적 k=0 사례만 표시한다. 원문에서 서로 다른 세 실근이 있는 범위는 −2/3<k<2/3이며, 극대·극소 좌표와 k=0의 세 근을 정확한 유리수·제곱근 표기로 적었다. 근삿값은 사용하지 않았다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제로 수행한 검사: item/plan/publish JSON 파싱, questionBank Q14 신원 확인, sourceQuote가 원문 solution과 일치함을 대조했다. 실제 production input functions, semantic validation, engine preparation, critical-point construction, viewport/tick fitting, exact-coordinate production check, renderer, build, browser/visual review, CI 및 게시 검증: NOT_RUN. Handoff / READY 판정: NOT_RUN.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

현재 item/plan/publish 세 파일의 SHA256은 아래 actual 검사 스냅샷과 모두 일치한다. 적용되는 실제 순수 입력 단계: PASS.
검사 스냅샷에서 수행한 경로: `fit_overview`→`phase2.specFor`, `semantic_model.validate`, 실제 engine critical 점 구성, `viewport.for_spec`, 축 눈금 guard 및 fitted/spec 눈금 대조.
실제 COORDINATE_LABEL 0개에 한해 exact_coordinate를 검사했다.0개이면 좌표 문구 전체 검사라는 뜻이 아니다. named leader의 EQUATION_LABEL 및 전체 수학·문구의 독립 검토는 이 검사에 포함하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
