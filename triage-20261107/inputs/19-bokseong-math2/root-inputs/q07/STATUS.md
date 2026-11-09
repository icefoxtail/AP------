# 19 복성고 고2 수학II 2학기 기말 Q07 로컬 입력 초안

원문 결속: sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`; triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`; 현재 refs-baseline main `b5c94b62ed06ccd095a6797939ab8c014603c406`. 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-bokseong-math2/source-exact.js` (SHA-256 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, byte length 44560, Git blob `3913744bcac519140a34ab49fe37bd6519db40d7`). `item.json`은 sourcePath와 ordinal 7로 정확한 원문 행에 결속한다. owner: UNKNOWN.

사용자 취지: 함수·영역·극값 관계를 그림으로 보조해 풀이 이해를 돕되, 원문과 기존 검수 자산·이력을 보존한다. 이 초안은 지정 문항 하나의 2D 시각 입력만 로컬에 준비하며 원문·메타·기존 검수·원격 기록은 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
두 곡선 $y=2x^2-2x-10$, $y=-x^2+4x+14$로 둘러싸인 도형의 넓이는?
~~~

## 원문 선택지 (정확 문자열)

~~~text
1. $68$
2. $78$
3. $88$
4. $98$
5. $108$
~~~

## 원문 정답 (정확 문자열)

~~~text
⑤
~~~

## 원문 해설 (정확 문자열)

~~~text
두 곡선의 교점에서 적분 구간을 정한다.
$2x^2-2x-10=-x^2+4x+14$
$3x^2-6x-24=0$
$(x+2)(x-4)=0$
교점의 $x$좌표는 $-2,4$이다. $x=0$에서 $-x^2+4x+14$가 위에 있으므로 넓이는
$\displaystyle\int_{-2}^4\{(-x^2+4x+14)-(2x^2-2x-10)\}\,dx$
$=\displaystyle\int_{-2}^4(-3x^2+6x+24)\,dx$
$=[-x^3+3x^2+24x]_{-2}^4$
$=80-(-28)=108$
정답은 ⑤이다.
~~~

## 수학 근거와 시각 계획

두 포물선 f(x)=2x²−2x−10과 g(x)=−x²+4x+14를 함께 그린다. 교점은 A(−2,2), B(4,14)이고 −2≤x≤4에서 g(x)가 위에 있다. 음영은 원문의 두 곡선으로 둘러싸인 영역이다. 이전 자동 프레임에서 영역이 작아 가독성이 보류된 이력을 반영해 표시 배율을 조정했다: y축 1단위의 길이는 x축 1단위의 1/4이다. 따라서 음영 넓이는 108이다.

- 원문 곡선은 y=2x²−2x−10 및 y=−x²+4x+14이다. 교점은 (x+2)(x−4)=0에서 x=−2,4이며 해당 y값은 2,14이다.
- −2≤x≤4에서 g(x)−f(x)=−3x²+6x+24=−3(x+2)(x−4)≥0. 두 곡선 사이 넓이는 ∫[−2,4](g−f)dx=108이다.
- 주곡선 f의 꼭짓점은 (1/2,−21/2), 참조곡선 g의 꼭짓점은 (2,18)이다. 표시 배율은 y축 1단위 길이를 x축 1단위의 1/4로 한다.

기존 triage에서 두 포물선 사이 영역이 자동 프레임에서 지나치게 작아 가독성이 보류된 이력을 보존한다. 이번 입력은 사용자 허용 범위의 명시적 axisScale만 사용하고 세로 1단위가 가로 1단위 표시 길이의 1/4임을 캡션에 공개한다. 해당 가독성 해결 여부는 아직 렌더되지 않아 UNKNOWN이다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 수학 수치와 시각 계획은 ROOT가 전달한 승인 계산 근거를 반영했으나 독립 수학 검수 NOT_RUN. input checker NOT_RUN, render NOT_RUN, 독립 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content/choices/answer/solution, triage 이력, 원본 자산(보호 Q08 SVG 및 Q14 PNG 포함), 다른 문항 draft, 원격 기록은 변경하지 않았다. 이 폴더 외 파일 수정 없음.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-37-08-849Z` / `interval-first`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/interval-first/node-results-2026-11-09T00-37-08-849Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
