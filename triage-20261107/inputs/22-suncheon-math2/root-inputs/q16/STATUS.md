# 22 순천고 고2 수학II Q16

출처 바인딩: `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, source-exact.js 49,980 bytes, Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, 기준 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 원문 questionBank Q16의 ordinal은 16이다. 보호 대상 기존 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q16_solution.svg` (Git blob `490022a6044e1b0bca398f6e11833d72b88c29f0`); 수정하지 않았다.

원문 인용(원문 해설의 전체 문자열):
[한 주기 적분] $0\le x<2$에서 $f(x)=3x(x-2)$, $2\le x<4$에서 $f(x)=3(x-2)(4-x)$이다. 각각의 적분은 $\int_0^2f=-4$, $\int_2^4f=4$이므로 $\int_0^4f=0$이다.
따라서 원시함수 $F$는 $F(x+4)-F(x)=\int_x^{x+4}f(t)dt=0$으로 주기 4를 갖는다. ㄱ의 주기 8도 성립한다.
$F(3)-F(2)=\int_2^3 3(x-2)(4-x)dx=2$이고 $F(2)-F(0)=-4$. $F(3)=-2$를 이용하면 $F(2)=-4$, $F(0)=0$이다.
$f$의 부호가 $0\to2$에서 음, $2\to4$에서 양이므로 $F$의 극솟값은 $x=2+4n$에서 $-4$. $(0,14)$에는 $2,6,10$ 세 개가 들어 있어 합은 $-12$. ㄴ 참.
$0\le x\le2$에서 $F(x)=x^3-3x^2$, $2\le x\le4$에서 $F(x)=-4+3(x-2)^2-(x-2)^3$. 각 구간에서 $F=-2$의 해는 $x=1,3$이고, 주기 4로 $(0,20)$의 해는 $1,3,5,\ldots,19$의 열 개. 합 $\frac{10(1+19)}2=100$. ㄷ 참.
[보기 판단] ① ㄱ만은 ㄴ·ㄷ 누락, ② ㄷ만은 ㄱ·ㄴ 누락, ③ ㄱ·ㄷ은 ㄴ 누락, ④ ㄴ·ㄷ은 ㄱ 누락, ⑤ ㄱ·ㄴ·ㄷ이 정답.

표시는 원시함수의 한 주기인 닫힌구간 [0,4] 제한에 한정하며, 지원되는 수평 기준선 y=−2와 정확한 교점 (1,−2),(3,−2)을 추가했다. 원문 함수 F의 실제 정의역은 실수 전체이며 F(x+4)=F(x); 이 전구간 주기성을 캡션에 따로 보존했다. 답의 극솟값 합, F(x)=−2의 열 근과 합도 캡션에 정확히 적었다. 이 부분도를 전구간 그래프 완료로 취급하지 않는다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제로 수행한 검사: item/plan/publish JSON 파싱, questionBank Q16 신원 확인, sourceQuote가 원문 solution과 일치함을 대조했다. 정확한 유리수 산술로 두 식의 연결값 F(2)=−4와 F(0)=0,F(3)=−2,F(4)=0을 확인했다. 독립 checker가 `fit_overview`를 한 차례 실행했으며 첫 후보의 `functionName: F` 때문에 `PIECEWISE_POLY_FUNCTION_NAME_INVALID`로 FAIL했다. 해당 대문자 이름을 제거하고 `axisTitles.y=F(x)`로 교정했으며 checker 재검사는 대기 중이다. `phase2.specFor`, semantic validation, engine preparation, critical-point construction, viewport/tick fitting, exact-coordinate production check, renderer, build, browser/visual review, CI 및 게시 검증: NOT_RUN. Handoff / READY 판정: NOT_RUN.

검사 이력: `fit_overview` 첫 실행은 위 대문자 functionName 규칙 위반으로 실패했다. 현재 plan은 functionName 필드를 생략하고 원시함수 표시는 축 제목 `F(x)`와 캡션에 둔다. 이전 실패는 삭제하지 않았으며 교정 후 검수는 pending이다.

추가 입력 이력: 현재 plan은 y=−2 기준선과 x=1,3의 정확한 교점을 표시한다. 이는 원문 F(x)=−2 해를 한 주기 안에서 보여 주며 전구간 주기 확장을 뜻하지 않는다. 최종 checker 검사는 대기 중이다.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

**현재 plan 실제 입력 검사: NOT_RUN.** 마지막 actual 검사 뒤 plan.json 해시가 바뀌었다. 앞선 스냅샷은 아래 실제 함수들을 통과했지만, 그 PASS를 현재 전체 plan에 적용하지 않는다.
검사한 plan SHA256 `ba8ee8741fc490ab68c2bdd80e0e4fe3399fc0c863ad55c29a2bc1c8c931d54b`; 현재 plan SHA256 `760d4e53551150e6d23b88bbaa0051c96af5df2a7f5e39a828a73e53a583a0b2`. item/publish 해시는 검사본과 일치한다. ROOT의 최신 지시에 따라 추가 검사나 반복 실행 없이 현재 파일을 그대로 보존했다.
검사 스냅샷에서 수행한 경로: `fit_overview`→`phase2.specFor`, `semantic_model.validate`, 실제 engine critical 점 구성, `viewport.for_spec`, 축 눈금 guard 및 fitted/spec 눈금 대조.
실제 COORDINATE_LABEL 0개에 한해 exact_coordinate를 검사했다.0개이면 좌표 문구 전체 검사라는 뜻이 아니다. named leader의 EQUATION_LABEL 및 전체 수학·문구의 독립 검토는 이 검사에 포함하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

표현 범위: ROOT가 승인한 한 주기 제한 그림 F|[0,4]이다. 원래 F는 실수 전체 주기4이고 전체 해1,3,…,19를 별도로 설명한다. 전구간 그림 완료가 아니다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
