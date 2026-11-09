# 19 복성고 고2 수학II 2학기 기말 Q21 로컬 입력 초안

원문 결속: sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`; triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`; 현재 refs-baseline main `b5c94b62ed06ccd095a6797939ab8c014603c406`. 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-bokseong-math2/source-exact.js` (SHA-256 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, 44,560 bytes, Git blob `3913744bcac519140a34ab49fe37bd6519db40d7`). item.json은 sourcePath와 ordinal 21로 행에 결속한다. owner: UNKNOWN.

사용자 취지: 함수·영역·극값 관계를 시각화해 풀이 이해를 돕되 원문과 기존 검수 결과·자산·이력을 보존한다. 이 초안은 지정 문항의 시각 입력만 로컬에 추가하며 원문, 메타, 보호 asset, 원격 상태를 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
서술형 문제 2. [5점]
최고차항의 계수가 $1$인 삼차함수 $f(x)$가 다음 조건을 만족시킬 때, $f'(1)$의 최솟값은 무엇인가?
(가) $f(0)=2$
(나) 모든 실수 $x$에 대하여 $f'(x)\ge f'(-2)$이다.
(다) $x_1<x_2$인 임의의 두 실수 $x_1,x_2$에 대하여 $f(x_1)<f(x_2)$이다.
~~~

## 원문 선택지 (정확 문자열)

~~~text
원문 choices: [] (선택지 없음)
~~~

## 원문 정답 (정확 문자열)

~~~text
27
~~~

## 원문 해설 (정확 문자열)

~~~text
삼차함수를
$f(x)=x^3+Ax^2+Bx+2$
라 두면
$f'(x)=3x^2+2Ax+B$
$f'(x)$가 모든 실수에서 $f'(-2)$ 이상이려면 이 이차함수의 꼭짓점이 $x=-2$에 있어야 한다.
$-\dfrac{2A}{6}=-2$
$A=6$
따라서
$f'(x)=3x^2+12x+B=3(x+2)^2+B-12$
$f$가 모든 실수에서 증가하므로 $f'(x)\ge0$이어야 한다. 따라서
$B-12\ge0$, $B\ge12$
$f'(1)=3+12+B=15+B$
최솟값은 $B=12$일 때 $27$이다.
~~~

## 수학 근거와 시각 계획

원문의 최소 경계 B=12를 택하면 d(x)=f′(x)=3(x+2)²이다. 이 그림은 원래 삼차함수 f가 아니라 그 도함수 f′를 나타낸다. 도함수의 전역 최솟값은 x=−2에서 0이고, 요청한 점은 A(1,27)이다. 따라서 가능한 B의 최솟값 경계에서 f′(1)=27이므로 원문의 최솟값은 27이다.

- f(x)=x³+6x²+Bx+2 and the derivative constraint gives B≥12. At the minimizing boundary B=12, f′(x)=3x²+12x+12=3(x+2)².
- d(x)=f′(x) has its global minimum 0 at x=−2. The requested value is d(1)=3(3)²=27. The graph is explicitly the derivative, not f.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 수학 수치와 시각 계획은 ROOT가 전달한 승인 계산 근거를 반영했으나 독립 수학 검수 NOT_RUN. pre-fix specFor FAIL; post-fix input checker NOT_RUN, render NOT_RUN, 독립 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content/choices/answer/solution, triage·검수·Meta 이력, 보호 원본 자산, 다른 문항 draft, 원격 기록은 변경하지 않았다. 이 폴더 외 파일 수정 없음.


## Q21 축 제목 제한과 최소 수정

phase2 `AXIS_TITLE_INVALID:y`로 실패했다. 원인은 prime 기호가 있는 `f'(x)` 축 제목이 허용되지 않은 것이다. 캡션의 d=f′ 정의와 도함수 식, B=12 경계 사례는 유지하고 y축 제목만 `d(x)`로 고쳤다. 지정된 네 파일의 pre-fix 사본을 `preparation-19-bokseong-math2/corrections/q21-before-axis-title/`에 보존했다. post-fix checker 재실행 NOT_RUN. 렌더, 독립 수학·시각 검토, CI, publication, handoff는 NOT_RUN이다.


## 정답 숫자 좌표 라벨 숨김

입력 단계에서 답과 같은 숫자가 좌표 라벨로 노출되지 않도록 A의 coordinate label만 숨겼다. `graphPlan.coordinateBand.hide`에 ID를 두고 `coordinateLeader`에서는 해당 ID만 제외했다. 점, 곡선, 영역, exactCoordinates 및 나머지 중간값 라벨은 보존했다. 실제 시각·가독성 검수 NOT_RUN; 이는 입력 단계의 정답 숫자 노출 방지이며 렌더 결과 판정이 아니다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-42-36-766Z` / `final4-corrected`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/final4-corrected/node-results-2026-11-09T00-42-36-766Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
