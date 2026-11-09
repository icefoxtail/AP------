# 19 복성고 고2 수학II 2학기 기말 Q17 로컬 입력 초안

원문 결속: sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`; triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`; 현재 refs-baseline main `b5c94b62ed06ccd095a6797939ab8c014603c406`. 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-bokseong-math2/source-exact.js` (SHA-256 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, byte length 44560, Git blob `3913744bcac519140a34ab49fe37bd6519db40d7`). `item.json`은 sourcePath와 ordinal 17로 정확한 원문 행에 결속한다. owner: UNKNOWN.

사용자 취지: 함수·영역·극값 관계를 그림으로 보조해 풀이 이해를 돕되, 원문과 기존 검수 자산·이력을 보존한다. 이 초안은 지정 문항 하나의 2D 시각 입력만 로컬에 준비하며 원문·메타·기존 검수·원격 기록은 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
함수 $f(x)=ax(x^2-a^2)$의 그래프와 $x$축으로 둘러싸인 부분의 넓이가 $512$일 때, 양의 상수 $a$의 값은?
~~~

## 원문 선택지 (정확 문자열)

~~~text
1. $1$
2. $2$
3. $3$
4. $4$
5. $5$
~~~

## 원문 정답 (정확 문자열)

~~~text
④
~~~

## 원문 해설 (정확 문자열)

~~~text
영점은 $x=-a,0,a$이고 $0<x<a$에서 $f(x)<0$이다.
오른쪽 부분의 넓이는
$\displaystyle\int_0^a -ax(x^2-a^2)\,dx$
$=a\displaystyle\int_0^a(a^2x-x^3)\,dx$
$=a\left[\dfrac{a^2x^2}{2}-\dfrac{x^4}{4}\right]_0^a$
$=\dfrac{a^5}{4}$
함수는 원점 대칭이므로 왼쪽 부분의 넓이도 $\dfrac{a^5}{4}$이다.
$\dfrac{a^5}{2}=512$
$a^5=1024=4^5$
양수 조건에서 $a=4$
정답은 ④이다.
~~~

## 수학 근거와 시각 계획

원문에서 a=4이므로 f(x)=4x(x²−16)=4x³−64x이다. 실근은 −4,0,4이고 두 유계 영역을 각각 음영으로 표시한다. 각 영역의 넓이는 256이므로 전체 넓이는 512이다. 국소 극대·극소점은 x=∓4/√3이며 좌표는 L(−4√3/3,512√3/9), R(4√3/3,−512√3/9)이다. 화면 표시에서는 y축 1단위의 길이를 x축 1단위의 1/24로 한다. 따라서 두 영역의 넓이 합은 512이다.

- 영점은 −a,0,a이고 a>0이다. 원문의 총 넓이는 양쪽 대칭 영역을 합친 값이며 a=4일 때 f(x)=4x³−64x.
- f′(x)=12x²−64=0의 임계점은 x=±4/√3이고 함수값은 각각 ±512√3/9이다. 두 유계 영역은 [−4,0]에서 f≥0, [0,4]에서 f≤0이며 각각 256, 총 512이다.
- 그래프의 원래 함수 정의역은 실수 전체이다. 음영 영역만 두 유계 구간에 한정하며 곡선의 sourceDomain은 ALL_REALS로 보존한다.



## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 수학 수치와 시각 계획은 ROOT가 전달한 승인 계산 근거를 반영했으나 독립 수학 검수 NOT_RUN. pre-fix fit_overview FAIL; post-fix input checker NOT_RUN, render NOT_RUN, 독립 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content/choices/answer/solution, triage 이력, 원본 자산(보호 Q08 SVG 및 Q14 PNG 포함), 다른 문항 draft, 원격 기록은 변경하지 않았다. 이 폴더 외 파일 수정 없음.


## Q17 정확 좌표 수치와 최소 수정

실제 pre-fix fit 단계가 `PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:L`로 실패했다. exactCoordinates의 식 `512*sqrt(3)/9`과 짝이 맞지 않는 근삿값 `98.52627944162882`를 L.y에 넣은 것이 원인이다. 지정된 네 파일의 pre-fix 사본을 `preparation-19-bokseong-math2/corrections/q17-before-numeric-fix/`에 보존했다. 최소 수정으로 L.y를 `98.53444594169613`, R.y를 `-98.53444594169613`으로 바꿨다. 기존 exactCoordinates, 원래 함수식, 임계점 x좌표, 두 영역 및 적분 넓이는 바꾸지 않았다. post-fix checker 재실행 NOT_RUN. 렌더, 독립 수학·시각 검토, CI, publication, handoff는 NOT_RUN이다.


## 정답 숫자 좌표 라벨 숨김

입력 단계에서 답과 같은 숫자가 좌표 라벨로 노출되지 않도록 A, C의 coordinate label만 숨겼다. `graphPlan.coordinateBand.hide`에 ID를 두고 `coordinateLeader`에서는 해당 ID만 제외했다. 점, 곡선, 영역, exactCoordinates 및 나머지 중간값 라벨은 보존했다. 실제 시각·가독성 검수 NOT_RUN; 이는 입력 단계의 정답 숫자 노출 방지이며 렌더 결과 판정이 아니다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-42-36-766Z` / `final4-corrected`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/final4-corrected/node-results-2026-11-09T00-42-36-766Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
