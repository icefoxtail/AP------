# 22 순천고 고2 수학II Q21

출처 바인딩: `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, source-exact.js 49,980 bytes, Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, 기준 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 원문 questionBank Q21의 ordinal은 21이다. 보호 대상 원본 그림 `q21.png`는 수정하거나 복사하지 않았다.

원문 인용(원문 해설의 전체 문자열):
[그림에서 읽는 핵심] 직선 $f$와 최고차항 계수가 1인 사차함수 $g$가 $x=-2,1$에서 각각 접한다. 차이 $h(x)=g(x)-f(x)$는 최고차항 계수가 1인 사차다.
접점에서는 두 함수값과 기울기가 같으므로 $h(-2)=h'(-2)=0$, $h(1)=h'(1)=0$. 따라서 두 점이 각각 이중근이고 $h(x)=(x+2)^2(x-1)^2$이다.
$h'(x)=2(x+2)(x-1)(2x+1)$이므로 극점 후보는 $x=-2,-\frac12,1$이다. $h(-2)=h(1)=0$이고 그 사이 $h>0$이므로 $x=-\frac12$가 극대점이다.
$h(-\frac12)=(\frac32)^2(-\frac32)^2=\frac{81}{16}$.
따라서 $\boxed{\frac{81}{16}}$. 원본 그림은 접하는 $x$좌표를 확인하는 증거이며 그림의 눈대중 높이를 정답에 사용하지 않는다.

도식은 원래 함수 g와 f 각각이 아니라 차 h=g−f만 표시한다. 접점의 x좌표 −2,1을 h의 이중근으로 반영하고, 정확한 극댓값 좌표 (−1/2,81/16)을 표시했다. 원본 PNG는 두 접선 조건을 확인하는 증거로 보존한다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제로 수행한 검사: item/plan/publish JSON 파싱, questionBank Q21 신원 확인, sourceQuote가 원문 solution과 일치함을 대조했다. 정확한 유리수 산술로 h(−2)=h(1)=0, h(−1/2)=81/16을 확인했다. 실제 production input functions, semantic validation, engine preparation, critical-point construction, viewport/tick fitting, exact-coordinate production check, renderer, build, browser/visual review, CI 및 게시 검증: NOT_RUN. Handoff / READY 판정: NOT_RUN.

용어 정정 이력: h는 위로 발산하는 사차함수이므로 81/16은 global maximum이 아니라 local maximum(극댓값)이다. 계획의 sourceConditions 및 newVisualInformation을 이 뜻으로 바로잡았다.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

현재 item/plan/publish 세 파일의 SHA256은 아래 actual 검사 스냅샷과 모두 일치한다. 적용되는 실제 순수 입력 단계: PASS.
검사 스냅샷에서 수행한 경로: `fit_overview`→`phase2.specFor`, `semantic_model.validate`, 실제 engine critical 점 구성, `viewport.for_spec`, 축 눈금 guard 및 fitted/spec 눈금 대조.
실제 COORDINATE_LABEL 0개에 한해 exact_coordinate를 검사했다.0개이면 좌표 문구 전체 검사라는 뜻이 아니다. named leader의 EQUATION_LABEL 및 전체 수학·문구의 독립 검토는 이 검사에 포함하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

표현 범위: 원래 f,g를 재구성하지 않고 정확한 차 h만 표시한다.81/16은 local maximum/극댓값이며 전역 최댓값이 아니다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
