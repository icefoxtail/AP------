# 20 매산여고 고2 수학II Q17 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js, pinned main 6a39acc2a39e7dec186a152ef7d29ec3da473c6d. 준비된 preparation-20-maesangirls-math2/source-exact.js의 window.questionBank에서 id 17, ordinal 17를 확인했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
두 다항함수 $f(x),g(x)$가 다음 조건을 만족시킨다.
(가) $f(x)=3x^3+5x^2-2x+1$
(나) 함수 $f(x)+g(x)$는 함수 $f(x)-g(x)$의 부정적분 중 하나이다.
함수 $g(1)$을 구하면? [4.4점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$-3$ / $-5$ / $-7$ / $-9$ / $-11$
~~~

## 원문 정답 (정확 문자열)

~~~text
③
~~~

## 원문 해설 (정확 문자열)

~~~text
f(x)+g(x)가 f(x)−g(x)의 한 부정적분이므로 미분하면
f′(x)+g′(x)=f(x)−g(x)
g′(x)+g(x)=f(x)−f′(x)
이다.
f′(x)=9x²+10x−2이므로
f(x)−f′(x)=3x³−4x²−12x+3
이다.
오른쪽은 3차식이다. g가 4차 이상이면 g′+g의 최고차항은 g의 최고차항과 같은 차수로 남으므로 g의 차수는 3 이하이다.
g(x)=Ax³+Bx²+Cx+D
로 두고 계수를 비교한다.
A=3,
3A+B=−4,
2B+C=−12,
C+D=3
이므로
A=3,
B=−13,
C=14,
D=−11
이다.
따라서
g(1)=3−13+14−11=−7
이다.
그러므로 정답은 ③이다.
~~~

## 도식 초안 범위

g(x)=3x³−13x²+14x−11의 곡선과 G=(1,−7)을 표시한다. 0≤x≤3은 실제 정의역 제한이 아니라 그래프 표시 범위이며, 원문에서 주어진 f(x)는 이 도식에 그리지 않는다.

사용자 요청에 따라 결정된 g만 정확한 다항식 곡선으로 표시한다. 원문에 주어진 f를 별도 곡선으로 추가하거나 바꾸지 않고, 요청값 G=(1,−7)을 표시한다.

정의역은 graphPlan.sourceDomain.kind=ALL_REALS로 두고, 유한 domain/viewport는 그림 표시창으로만 사용한다. axisTitles는 등호 없는 축 제목이며 axisTickValues는 양쪽 모두 빈 배열이다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 준비·렌더, PNG/SVG 검사, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. checker의 다음 검수를 기다린다. 지정된 초안 네 파일만 작성했다. 원문·엔진·assets·ledger·다른 문항 패키지에는 쓰지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## Automatic display-window reconciliation (2026-11-08 UTC)

Evidence: preparation-20-maesangirls-math2/display-window-caveat.json, input run 2026-11-08T22-07-32-438Z. fit_overview reported candidateFilesChanged=false and overrode the authored numeric x-window [0, 3] with fittedDomain [-4.766666666666667, 5.743833333333333]; fittedViewport was [-4.766666666666667, 5.743833333333333, -834.0752735350981, 345.07331932463956]. The earlier caption phrasing therefore described a requested window, not the actual fitted display.

Minimal correction: updated only plan.caption and the matching publish.caption to say that the function domain is all real numbers and the finite display area follows engine auto-placement. item.json, plan.graphPlan (including coefficients, domain, viewport, sourceDomain, requiredPoints and exactCoordinates), sourceQuote, sourceConditions, newVisualInformation, coordinateLeader, and publish.alt are unchanged. The exact pre-correction four files are saved at preparation-20-maesangirls-math2/corrections/display-window-before/q17/.

No checker retry, render, math/visual review, remote write, publication or handoff was performed for this wording correction. Checker follow-up remains NOT_RUN; no visual readiness is claimed.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-38-44-170Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
- Numeric display-window caption wording was reconciled with automatic framing. This is resolved prose alignment, not a new content HOLD.
