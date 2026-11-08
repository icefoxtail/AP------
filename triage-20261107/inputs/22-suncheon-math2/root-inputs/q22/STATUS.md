# 22 순천고 고2 수학II Q22

출처 바인딩: `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, source-exact.js 49,980 bytes, Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, 기준 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 원문 questionBank Q22의 ordinal은 22이다. 보호 대상 기존 SVG: `assets/images/22_순천고_2학기_기말_고2_수학II/q22_solution.svg` (Git blob `4cb739dd4964c4b2ba1ea82c904a0be39113e608`); 수정하지 않았다.

원문 인용(원문 해설의 전체 문자열):
[접선 두 개] $f(x)=x^3-x+5$이므로 $f'(x)=3x^2-1$. 기울기가 2이면 $3x^2-1=2$, $x=\pm1$. $f(1)=f(-1)=5$이다.
$x=1$의 접선은 $l_1:y=2x+3$, $x=-1$의 접선은 $l_2:y=2x+7$이다(이름은 서로 바뀌어도 넓이 합은 같다).
$f(x)-(2x+3)=(x-1)^2(x+2)$이므로 접선 $l_1$과의 교점은 $x=-2,1$. 둘러싸인 넓이 $A=\int_{-2}^1(x-1)^2(x+2)dx=\frac{27}{4}$.
$f(x)-(2x+7)=(x+1)^2(x-2)$이므로 $l_2$와의 교점은 $x=-1,2$. 넓이 $B=\int_{-1}^2(2-x)(x+1)^2dx=\frac{27}{4}$.
네 교점의 좌표는 $(-2,-1),(1,5),(-1,5),(2,11)$이다. 두 접선은 기울기가 같으므로 평행하다. 따라서 네 점을 이으면 평행사변형이 된다.
[삼각형으로 넓이 구하기] $y=5$ 위의 두 점 $(-1,5),(1,5)$를 이은 선분의 길이는 $2$이다. 이 선분을 공통 밑변으로 하여 아래쪽 꼭짓점 $(-2,-1)$까지의 높이는 $5-(-1)=6$, 위쪽 꼭짓점 $(2,11)$까지의 높이는 $11-5=6$이다. 따라서 두 삼각형의 넓이 합은 $S=\frac12\cdot2\cdot6+\frac12\cdot2\cdot6=12$이다. 밑변과 높이만으로 넓이를 구했다.
따라서 $2A+2B-S=2\cdot\frac{27}{4}+2\cdot\frac{27}{4}-12=27-12=\boxed{15}$.
[검산] $A,B$는 절댓값 넓이이고 $S$는 네 점을 꼭짓점으로 하는 사각형의 넓이로, 중복된 접점은 별도 꼭짓점으로 세지 않는다.

이 초안은 실제 곡선 f(x)=x³−x+5, 두 정확한 referenceCurves 접선, A/B 각 영역의 별도 음영을 표시한다. 네 꼭짓점과 S=12를 캡션에 보존하되 평행사변형의 변 윤곽은 그리지 않는다. 정확한 좌표, A=B=27/4, S=12, 2A+2B−S=15는 caption에서 구분해 보존했다. 두 곡선의 극점은 exact algebraic coordinates로 marker NONE 처리되어 핵심 좌표 라벨과 구분된다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제로 수행한 검사: item/plan/publish JSON 파싱, questionBank Q22 신원 확인, sourceQuote가 원문 solution과 일치함을 대조했다. 정확한 유리수·제곱근 대입으로 네 교점·접점 좌표 및 두 극점 좌표의 원문 cubic 값 일치를 확인했다. 또한 정확한 유리수 계산으로 A와 B의 적분값이 각각 27/4이고 네 꼭짓점의 shoelace 넓이가 12임을 확인했다. 실제 production input functions, semantic validation, engine preparation, critical-point construction, viewport/tick fitting, exact-coordinate production check, renderer, build, browser/visual review, CI 및 게시 검증: NOT_RUN. Handoff / READY 판정: NOT_RUN.

입력 수정 이력: 초안 첫 판에서는 referenceCurves/regions를 미지원으로 오해해 제외했으나, 실제 piecewise-polynomial 계약을 확인하고 두 접선과 A/B 음영을 추가했다. 평행사변형 윤곽만 현재 도식에서 생략하며 해당 영역 넓이·꼭짓점은 캡션에 보존한다. 실제 최종 fit/spec 검사는 대기 중이다.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

**현재 plan 실제 입력 검사: NOT_RUN.** 마지막 actual 검사 뒤 plan.json 해시가 바뀌었다. 앞선 스냅샷은 아래 실제 함수들을 통과했지만, 그 PASS를 현재 전체 plan에 적용하지 않는다.
검사한 plan SHA256 `9b3f1cf0b419c1b96a64ef95744a667fec3df5a0522723006a6e28ddecc54f00`; 현재 plan SHA256 `a23b4a9039afee79ad100b87c21c42b4b7cc90065bc17d61644cfbea8ef89eeb`. item/publish 해시는 검사본과 일치한다. ROOT의 최신 지시에 따라 추가 검사나 반복 실행 없이 현재 파일을 그대로 보존했다.
검사 스냅샷에서 수행한 경로: `fit_overview`→`phase2.specFor`, `semantic_model.validate`, 실제 engine critical 점 구성, `viewport.for_spec`, 축 눈금 guard 및 fitted/spec 눈금 대조.
실제 COORDINATE_LABEL 0개에 한해 exact_coordinate를 검사했다.0개이면 좌표 문구 전체 검사라는 뜻이 아니다. named leader의 EQUATION_LABEL 및 전체 수학·문구의 독립 검토는 이 검사에 포함하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

표현 범위: 현재 plan에는 두 정확한 접선과 각각27/4인 A/B regions가 있다. 평행사변형 윤곽은 미표현이고 네 꼭짓점·S12·결과15를 설명한다. 마지막 검사 뒤 plan 해시가 달라 현재 전체 plan 검사는 NOT_RUN이다.
다른 capability인 polynomial-spike의 root 제한을 PP 경로에 그대로 적용하지 않는다. 실제 PP는 rational referenceCurves와 regions를 지원한다. 이전 한 곡선 초안은 표시 미완성이었으며 엔진 다중곡선 미지원의 근거가 아니다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
