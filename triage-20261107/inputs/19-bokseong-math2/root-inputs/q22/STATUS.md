# 19 복성고 고2 수학II 2학기 기말 Q22 로컬 입력 초안

원문 결속: sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`; triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`; 현재 refs-baseline main `b5c94b62ed06ccd095a6797939ab8c014603c406`. 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-bokseong-math2/source-exact.js` (SHA-256 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, 44,560 bytes, Git blob `3913744bcac519140a34ab49fe37bd6519db40d7`). item.json은 sourcePath와 ordinal 22로 행에 결속한다. owner: UNKNOWN.

사용자 취지: 함수·영역·극값 관계를 시각화해 풀이 이해를 돕되 원문과 기존 검수 결과·자산·이력을 보존한다. 이 초안은 지정 문항의 시각 입력만 로컬에 추가하며 원문, 메타, 보호 asset, 원격 상태를 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
서술형 문제 3. [6점]
함수 $f(x)=\begin{cases}3x+2&(x\ge1)\\5&(x<1)\end{cases}$에 대하여 함수 $g(x)=\displaystyle\int_{-1}^x(t-2)f(t),dt$이다.
$g(x)=\begin{cases}(가)&(x\ge1)\\(나)&(x<1)\end{cases}$일 때, (가)와 (나)를 구하시오.
~~~

## 원문 선택지 (정확 문자열)

~~~text
원문 choices: [] (선택지 없음)
~~~

## 원문 정답 (정확 문자열)

~~~text
(가) $x^3-2x^2-4x-15$, (나) $\dfrac52x^2-10x-\dfrac{25}{2}$
~~~

## 원문 해설 (정확 문자열)

~~~text
먼저 $x<1$이면 적분 구간에서 $f(t)=5$이다.
$g(x)=5\displaystyle\int_{-1}^x(t-2)\,dt$
$=5\left[\dfrac{t^2}{2}-2t\right]_{-1}^x$
$=\dfrac52x^2-10x-\dfrac{25}{2}$
따라서 이것이 (나)이다.
$x=1$에서
$g(1)=\dfrac52-10-\dfrac{25}{2}=-20$
$x\ge1$에서는 $f(t)=3t+2$인 구간을 더 적분한다.
$g(x)=g(1)+\displaystyle\int_1^x(t-2)(3t+2)\,dt$
$=-20+\displaystyle\int_1^x(3t^2-4t-4)\,dt$
$=-20+[t^3-2t^2-4t]_1^x$
$=x^3-2x^2-4x-15$
따라서 이것이 (가)이다.
~~~

## 수학 근거와 시각 계획

정확한 보조 곡선 h=g+23을 그린다. x<1에서 h(x)=(5/2)x²−10x+21/2, x≥1에서 h(x)=(x−2)²(x+2)이며 연결점은 J(1,3), 내부 최솟점은 M(2,0)이다. 원래 g는 이 곡선에서 23을 빼 복원한다: (나)=(5/2)x²−10x−25/2, (가)=x³−2x²−4x−15. 캡션과 축은 이동된 h와 원래 g를 구분한다.

- 원문 g(x)=∫_{−1}^x(t−2)f(t)dt이다. x<1에서는 g=(5/2)x²−10x−25/2, x≥1에서는 g=x³−2x²−4x−15, 두 가지 식이 x=1에서 −20으로 연결된다.
- To keep an exact factored cubic branch, plot the exact vertical shift h=g+23: left branch (5/2)x²−10x+21/2, right branch (x−2)²(x+2). h(1)=3 and its in-domain minimum h(2)=0, restoring g(1)=−20 and g(2)=−23.
- The figure is h, not the original g. A single global formula field is omitted because the two piece expressions differ; both exact pieces and the breakpoint are represented in graphPlan.

Q22의 기존 cases 줄바꿈 교정 이력과 #1405 메타 이력을 보존한다. 준비본은 원문 cases, Meta 및 해당 이력을 수정하지 않는다.
## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 수학 수치와 시각 계획은 ROOT가 전달한 승인 계산 근거를 반영했으나 독립 수학 검수 NOT_RUN. input checker NOT_RUN, render NOT_RUN, 독립 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content/choices/answer/solution, triage·검수·Meta 이력, 보호 원본 자산, 다른 문항 draft, 원격 기록은 변경하지 않았다. 이 폴더 외 파일 수정 없음.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-38-26-673Z` / `interval-second`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/interval-second/node-results-2026-11-09T00-38-26-673Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
