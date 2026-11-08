# 20 매산여고 고2 수학II Q05 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js, pinned main 6a39acc2a39e7dec186a152ef7d29ec3da473c6d. 준비된 preparation-20-maesangirls-math2/source-exact.js의 window.questionBank에서 id 5, ordinal 5를 확인했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
함수 $f(x)=\displaystyle\int\left\{\dfrac{d}{dx}(2x^2-8x)\right\}dx$에 대하여 $f(x)$의 최솟값이 $5$일 때, $f(1)$의 값을 구하면? [3.6점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$-6$ / $-2$ / $3$ / $7$ / $10$
~~~

## 원문 정답 (정확 문자열)

~~~text
④
~~~

## 원문 해설 (정확 문자열)

~~~text
주어진 도함수를 적분하면 적분상수 C에 대하여
f(x)=2x²−8x+C
=2(x−2)²+C−8
이다.
최솟값이 5이므로
C−8=5
C=13
이다.
따라서
f(1)=2−8+13=7
이다.
그러므로 정답은 ④이다.
~~~

## 도식 초안 범위

f(x)=2x²−8x+13의 최솟점 V=(2,5)와 P=(1,7)을 표시한다. −1≤x≤5는 실제 정의역 제한이 아니라 그래프 표시 범위이다.

사용자 요청에 따라 완성된 이차함수를 그래프로 보조하고, 원문 해설에서 결정되는 최솟점과 f(1)을 좌표로 표시한다.

정의역은 graphPlan.sourceDomain.kind=ALL_REALS로 두고, 유한 domain/viewport는 그림 표시창으로만 사용한다. axisTitles는 등호 없는 축 제목이며 axisTickValues는 양쪽 모두 빈 배열이다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 준비·렌더, PNG/SVG 검사, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. checker의 다음 검수를 기다린다. 지정된 초안 네 파일만 작성했다. 원문·엔진·assets·ledger·다른 문항 패키지에는 쓰지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## Automatic display-window reconciliation (2026-11-08 UTC)

Evidence: preparation-20-maesangirls-math2/display-window-caveat.json, input run 2026-11-08T22-07-32-438Z. fit_overview reported candidateFilesChanged=false and overrode the authored numeric x-window [-1, 5] with fittedDomain [0.5071599454156424, 3.4928400545843576]; fittedViewport was [-1.8928932188134526, 5.3071067811865476, -0.6428571428571432, 9.642857142857142]. The earlier caption phrasing therefore described a requested window, not the actual fitted display.

Minimal correction: updated only plan.caption and the matching publish.caption to say that the function domain is all real numbers and the finite display area follows engine auto-placement. item.json, plan.graphPlan (including coefficients, domain, viewport, sourceDomain, requiredPoints and exactCoordinates), sourceQuote, sourceConditions, newVisualInformation, coordinateLeader, and publish.alt are unchanged. The exact pre-correction four files are saved at preparation-20-maesangirls-math2/corrections/display-window-before/q05/.

No checker retry, render, math/visual review, remote write, publication or handoff was performed for this wording correction. Checker follow-up remains NOT_RUN; no visual readiness is claimed.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-38-44-170Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
- Numeric display-window caption wording was reconciled with automatic framing. This is resolved prose alignment, not a new content HOLD.
