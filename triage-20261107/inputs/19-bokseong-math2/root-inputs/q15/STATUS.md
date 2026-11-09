# 19 복성고 고2 수학II 2학기 기말 Q15 로컬 입력 초안

원문 결속: sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`; triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`; 현재 refs-baseline main `b5c94b62ed06ccd095a6797939ab8c014603c406`. 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-bokseong-math2/source-exact.js` (SHA-256 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, 44,560 bytes, Git blob `3913744bcac519140a34ab49fe37bd6519db40d7`). item.json은 sourcePath와 ordinal 15로 행에 결속한다. owner: UNKNOWN.

사용자 취지: 함수·영역·극값 관계를 시각화해 풀이 이해를 돕되 원문과 기존 검수 결과·자산·이력을 보존한다. 이 초안은 지정 문항의 시각 입력만 로컬에 추가하며 원문, 메타, 보호 asset, 원격 상태를 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
두 함수 $f(x)=x^3-3x^2-2x+a+11$, $g(x)=-x^3+10x-5$에 대하여 $0<x<4$에서 $f(x)\ge g(x)$를 만족시키는 상수 $a$의 최솟값은?
~~~

## 원문 선택지 (정확 문자열)

~~~text
1. $4$
2. $5$
3. $6$
4. $8$
5. $9$
~~~

## 원문 정답 (정확 문자열)

~~~text
①
~~~

## 원문 해설 (정확 문자열)

~~~text
주어진 부등식을 정리한다.
$f(x)-g(x)=2x^3-3x^2-12x+a+16$
모든 $0<x<4$에서 이 값이 0 이상이려면
$a\ge -2x^3+3x^2+12x-16=\phi(x)$
이어야 한다.
$\phi'(x)=-6x^2+6x+12=-6(x-2)(x+1)$
따라서 $\phi$는 $0<x<2$에서 증가하고 $2<x<4$에서 감소한다.
최댓값은
$\phi(2)=-16+12+24-16=4$
이므로 가장 작은 $a$는 4이다.
정답은 ①이다.
~~~

## 수학 근거와 시각 계획

원문 부등식은 정확히 0<x<4에서 f(x)≥g(x)이며, p(x)=φ(x)=−2x³+3x²+12x−16을 이 열린 조건 구간에서 표시한다. p′(x)=−6(x−2)(x+1)이므로 내부에서 x=2까지 증가한 뒤 감소하고 p(2)=4이다. x=0,4는 조건에 포함되지 않으며 각각의 끝값 −16, −48은 경계에서의 극한값일 뿐이다. 화면 표시에서는 y축 1단위 길이를 x축 1단위의 1/13로 한다. 모든 0<x<4에서 성립하는 가장 작은 a는 4이다.

- f(x)−g(x)=2x³−3x²−12x+a+16. 모든 0<x<4에서 f≥g이려면 a≥φ(x)=−2x³+3x²+12x−16.
- φ′(x)=−6(x−2)(x+1), so φ increases on (0,2) and decreases on (2,4). Its attained maximum is φ(2)=4. The boundary values φ(0)=−16 and φ(4)=−48 are excluded endpoint values, not members of the open condition interval.
- The original condition interval is open at both ends. Do not replace it with a closed [0,4] source interval; the boundary values are mentioned only as limits.

실제 조건 구간의 열린 양 끝은 sourceDomain에서 OPEN으로 보존한다. 끝값은 boundary value로만 언급하며 닫힌 구간으로 바꾸지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 수학 수치와 시각 계획은 ROOT가 전달한 승인 계산 근거를 반영했으나 독립 수학 검수 NOT_RUN. pre-fix specFor FAIL; post-fix input checker NOT_RUN, render NOT_RUN, 독립 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content/choices/answer/solution, triage·검수·Meta 이력, 보호 원본 자산, 다른 문항 draft, 원격 기록은 변경하지 않았다. 이 폴더 외 파일 수정 없음.


## Q15 축 제목 제한과 최소 수정

phase2 `AXIS_TITLE_INVALID:y`로 실패했다. 원인은 그리스 문자 φ가 y축 제목 정규식에서 허용되지 않은 것이다. 기존 함수식 p=φ, 실제 열린 구간 0<x<4, 경계 처리, 배율, 원문 조건은 유지하고 y축 제목만 `p(x)`로 고쳤다. 요청대로 4−φ 이동은 하지 않았다. 지정된 네 파일의 pre-fix 사본을 `preparation-19-bokseong-math2/corrections/q15-before-axis-title/`에 보존했다. post-fix checker 재실행 NOT_RUN. 렌더, 독립 수학·시각 검토, CI, publication, handoff는 NOT_RUN이다.


## 정답 숫자 좌표 라벨 숨김

입력 단계에서 답과 같은 숫자가 좌표 라벨로 노출되지 않도록 M의 coordinate label만 숨겼다. `graphPlan.coordinateBand.hide`에 ID를 두고 `coordinateLeader`에서는 해당 ID만 제외했다. 점, 곡선, 영역, exactCoordinates 및 나머지 중간값 라벨은 보존했다. 실제 시각·가독성 검수 NOT_RUN; 이는 입력 단계의 정답 숫자 노출 방지이며 렌더 결과 판정이 아니다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-42-36-766Z` / `final4-corrected`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/final4-corrected/node-results-2026-11-09T00-42-36-766Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
