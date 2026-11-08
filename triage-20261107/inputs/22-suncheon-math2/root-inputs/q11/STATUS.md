# 22 순천고 고2 수학II Q11

출처 바인딩: `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, source-exact.js 49,980 bytes, Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, 기준 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 원문 questionBank Q11의 ordinal은 11이다. 이 도식은 포물선과 x축 아래의 정확한 부분만 나타내는 부분도이며, 보호 대상 기존 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q11_solution.svg` (Git blob `c6e590f86e462663aebe3edc7ea10ee2b76f3946`); 수정하지 않았다.

원문 인용(원문 해설의 정확한 부분 문자열):
[그림 대신 교점·부호] 두 식 $x^2-2x=kx$에서 $x(x-(k+2))=0$이므로 교점의 $x$좌표는 $0,L=k+2$이다. $x$축이 둘러싸인 부분을 두 양의 넓이로 나누려면 $k>0$이어야 하고, 따라서 $L>2$이다.
두 그래프 사이 전체 넓이는 $\int_0^L(kx-(x^2-2x))dx=\int_0^L x(L-x)dx=\frac{L^3}{6}$.
$x$축 아래에 있는 부분은 $0<x<2$에서 포물선과 축 사이의 넓이이므로 $\int_0^2(2x-x^2)dx=[x^2-\frac{x^3}{3}]_0^2=\frac43$이다.
축이 넓이를 이등분하므로 $\frac12\cdot\frac{L^3}{6}=\frac43$, 즉 $L^3=16$.

표시한 함수는 y=x²−2x, 정의역은 원문 그대로 실수 전체다. 곡선과 x축의 교점은 (0,0), (2,0), 꼭짓점은 (1,−1), [0,2]의 x축 아래 넓이는 4/3이다. 원문 관계 L=k+2>2, L³=16 및 전체 넓이 L³/6=8/3은 캡션에 남겼다. 직선 y=kx의 정확한 기울기는 k=∛16−2이고 rational-coefficient graph plan으로 표현할 수 없어 그 직선과 전체 둘러싸인 영역은 표시하지 않는다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제로 수행한 검사: item/plan/publish JSON 파싱, 원문 questionBank Q11 신원 확인, sourceQuote가 원문 solution의 정확한 부분 문자열임을 대조했다. 실제 production input functions, semantic validation, engine preparation, critical-point construction, viewport/tick fitting, renderer, build, browser/visual review, CI 및 게시 검증: NOT_RUN. Handoff / READY 판정: NOT_RUN.

계약 기준 수정 이력: 첫 로컬 입력 후보의 `functionName: y`, 지역 곡선 ID `y`, 지역 라벨 `넓이 4/3`, 긴 `sampleNote`를 실제 checker 안내에 맞춰 제거·수정했다. 최종 지역은 기본 곡선 ID `f`와 정확한 수식 라벨 `4/3`을 사용한다. 이 후보 수정 이력은 검증 결과가 아니며 실제 production input functions는 여전히 NOT_RUN; 독립 검사 대기.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

현재 item/plan/publish 세 파일의 SHA256은 아래 actual 검사 스냅샷과 모두 일치한다. 적용되는 실제 순수 입력 단계: PASS.
검사 스냅샷에서 수행한 경로: `fit_overview`→`phase2.specFor`, `semantic_model.validate`, 실제 engine critical 점 구성, `viewport.for_spec`, 축 눈금 guard 및 fitted/spec 눈금 대조.
실제 COORDINATE_LABEL 0개에 한해 exact_coordinate를 검사했다.0개이면 좌표 문구 전체 검사라는 뜻이 아니다. named leader의 EQUATION_LABEL 및 전체 수학·문구의 독립 검토는 이 검사에 포함하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

표현 범위: 포물선과 x축 아래 넓이4/3만 표현한다. 세제곱근 기울기 직선과 전체 둘러싸인 영역은 미표현이며 L³=16 및 전체넓이8/3은 문구에 남겼다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
