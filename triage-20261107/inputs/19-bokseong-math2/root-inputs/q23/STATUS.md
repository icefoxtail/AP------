# 19 복성고 고2 수학II 2학기 기말 Q23 로컬 입력 초안

원문 결속: sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`; triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`; 현재 refs-baseline main `b5c94b62ed06ccd095a6797939ab8c014603c406`. 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-bokseong-math2/source-exact.js` (SHA-256 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, 44,560 bytes, Git blob `3913744bcac519140a34ab49fe37bd6519db40d7`). item.json은 sourcePath와 ordinal 23로 행에 결속한다. owner: UNKNOWN.

사용자 취지: 함수·영역·극값 관계를 시각화해 풀이 이해를 돕되 원문과 기존 검수 결과·자산·이력을 보존한다. 이 초안은 지정 문항의 시각 입력만 로컬에 추가하며 원문, 메타, 보호 asset, 원격 상태를 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
서술형 문제 4. [5점]
함수 $f(x)=(|x|-a)^3-3(|x|-a)^2-9(|x|-a)+b$가 다음 조건을 만족시킬 때, $a+b$의 값은? (단 $a,b$는 상수)
(가) 실수 전체의 집합에서 미분가능하다.
(나) 극댓값 $0$을 갖는다.
~~~

## 원문 선택지 (정확 문자열)

~~~text
원문 choices: [] (선택지 없음)
~~~

## 원문 정답 (정확 문자열)

~~~text
-4
~~~

## 원문 해설 (정확 문자열)

~~~text
원문은 $f(x)=(|x|-a)^3-3(|x|-a)^2-9(|x|-a)+b$이다.
$h(u)=u^3-3u^2-9u+b$라 두면 $f(x)=h(|x|-a)$이다.
$h'(u)=3(u-3)(u+1)$
$x=0$에서 좌우 미분계수가 같으려면 $h'(-a)=0$이어야 한다.
$3(-a-3)(-a+1)=0$
$a=-3$ 또는 $a=1$
$a=1$이면 $x>0$에서 $f'(x)=3x(x-4)$, $x<0$에서 $f'(x)=-3x(x+4)$이다. 따라서 $x=0$에서 도함수 부호가 $+\to-$로 바뀌어 극댓값을 갖는다.
$f(0)=(-1)^3-3(-1)^2-9(-1)+b=5+b$
극댓값이 0이므로 $b=-5$이고 $a+b=1-5=-4$이다.
$a=-3$이면 $x=0$에서 도함수 부호가 $-\to+$로 바뀌어 극솟값이 되므로 조건에 맞지 않는다.
~~~

## 수학 근거와 시각 계획

조건을 만족하는 경우는 a=1, b=−5이다. 원래 곡선은 f(x)=(|x|−1)³−3(|x|−1)²−9(|x|−1)−5=|x|³−6x²이며 두 branch는 x<0에서 −x³−6x², x≥0에서 x³−6x²이다. M(0,0)은 극댓점이고 L(−4,−32), R(4,−32)는 대칭인 극솟점이다. y축 1단위 표시 길이는 x축 1단위의 1/4이다. 따라서 a+b=−4이다.

- For a=1,b=−5 the source function simplifies exactly to |x|³−6x², with polynomial branches −x³−6x² for x<0 and x³−6x² for x≥0. The breakpoint is the shared value f(0)=0.
- The derivative on x<0 is −3x²−12x, with minimum at x=−4; on x>0 it is 3x²−12x, with minimum at x=4. x=0 is the local maximum 0. The two minima are −32.
- The alternative differentiability case a=−3 gives a local minimum at x=0, not the required local maximum, so it is excluded. Do not combine it with the a=1 curve.
- The y-scale is one quarter of the x-scale for display only; all coordinates and function values remain those of the original f.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 수학 수치와 시각 계획은 ROOT가 전달한 승인 계산 근거를 반영했으나 독립 수학 검수 NOT_RUN. input checker NOT_RUN, render NOT_RUN, 독립 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content/choices/answer/solution, triage·검수·Meta 이력, 보호 원본 자산, 다른 문항 draft, 원격 기록은 변경하지 않았다. 이 폴더 외 파일 수정 없음.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-38-26-673Z` / `interval-second`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/interval-second/node-results-2026-11-09T00-38-26-673Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
