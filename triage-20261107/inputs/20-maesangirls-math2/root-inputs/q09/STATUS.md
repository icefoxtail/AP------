# 20 매산여고 고2 수학II Q09 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js, pinned main 6a39acc2a39e7dec186a152ef7d29ec3da473c6d. 준비된 preparation-20-maesangirls-math2/source-exact.js의 window.questionBank에서 id 9, ordinal 9를 확인했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
함수 $f(x)=\displaystyle\int(x^2+2x-3),dx$의 극솟값이 $-4$일 때, $f(x)$의 극댓값을 구하면? [4.0점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$6$ / $\dfrac{19}{3}$ / $\dfrac{20}{3}$ / $7$ / $\dfrac{22}{3}$
~~~

## 원문 정답 (정확 문자열)

~~~text
③
~~~

## 원문 해설 (정확 문자열)

~~~text
f′(x)=x²+2x−3=(x+3)(x−1)
이므로 x=−3에서 극대, x=1에서 극소를 갖는다.
원시함수는
f(x)=x³/3+x²−3x+C
이다.
극솟값이 −4이므로
f(1)=1/3+1−3+C=C−5/3=−4
C=−7/3
이다.
따라서 극댓값은
f(−3)=−9+9+9−7/3=20/3
이다.
그러므로 정답은 ③이다.
~~~

## 도식 초안 범위

f(x)=x³/3+x²−3x−7/3의 극댓점 M=(−3,20/3), 극솟점 m=(1,−4)을 표시한다. −4≤x≤3은 그래프 표시 범위이다.

사용자 요청에 따라 원시함수의 두 극점을 그래프로 보조한다. 유한 x 창은 표시 범위이며 함수의 정의역은 실수 전체이다.

정의역은 graphPlan.sourceDomain.kind=ALL_REALS로 두고, 유한 domain/viewport는 그림 표시창으로만 사용한다. axisTitles는 등호 없는 축 제목이며 axisTickValues는 양쪽 모두 빈 배열이다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 준비·렌더, PNG/SVG 검사, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. checker의 다음 검수를 기다린다. 지정된 초안 네 파일만 작성했다. 원문·엔진·assets·ledger·다른 문항 패키지에는 쓰지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## Actual specFor check and minimal correction (2026-11-09 UTC)

The first actual specFor check reported COORDINATE_LEADER_POINT_INVALID:M. The phase2 coordinateLeader contract requires coordinateText for each leader point: exactCoordinates by point id, or safe-integer x and y values. M has numeric coordinates (−3, 20/3), so the non-integer ordinate needs an exactCoordinates entry. Before this edit, all four draft files were copied unchanged to preparation-20-maesangirls-math2/corrections/before/q09/.

Minimal correction: added only graphPlan.exactCoordinates.M=["-3","20/3"]. The existing numeric M coordinates, m point, polynomial, labels, and other plan values are unchanged. The first-run failure and its pre-correction files are preserved. No checker retry, render, math review, remote write, publication, or handoff was performed; follow-up input validation remains NOT_RUN pending checker review.


## Automatic display-window reconciliation (2026-11-08 UTC)

Evidence: preparation-20-maesangirls-math2/display-window-caveat.json, input run 2026-11-08T22-07-32-438Z. fit_overview reported candidateFilesChanged=false and overrode the authored numeric x-window [-4, 3] with fittedDomain [-6.09850013317763, 5.544091030161482]; fittedViewport was [-6.09850013317763, 5.544091030161482, -36.10438796991426, 82.22786849822734]. The earlier caption phrasing therefore described a requested window, not the actual fitted display.

Minimal correction: updated only plan.caption and the matching publish.caption to say that the function domain is all real numbers and the finite display area follows engine auto-placement. item.json, plan.graphPlan (including coefficients, domain, viewport, sourceDomain, requiredPoints and exactCoordinates), sourceQuote, sourceConditions, newVisualInformation, coordinateLeader, and publish.alt are unchanged. The exact pre-correction four files are saved at preparation-20-maesangirls-math2/corrections/display-window-before/q09/.

No checker retry, render, math/visual review, remote write, publication or handoff was performed for this wording correction. Checker follow-up remains NOT_RUN; no visual readiness is claimed.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-38-44-170Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: PASS.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
- Numeric display-window caption wording was reconciled with automatic framing. This is resolved prose alignment, not a new content HOLD.
