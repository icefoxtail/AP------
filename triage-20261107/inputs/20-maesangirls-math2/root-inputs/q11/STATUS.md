# 20 매산여고 고2 수학II Q11 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js, pinned main 6a39acc2a39e7dec186a152ef7d29ec3da473c6d. 준비된 preparation-20-maesangirls-math2/source-exact.js의 window.questionBank에서 id 11, ordinal 11를 확인했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
다항함수 $f(x)$의 한 부정적분을 $F(x)$라 하면 $F(x)=xf(x)-3x^3+5x^2$이 성립하고 $f(2)=6$일 때, $f(-2)$를 구하면? [4.1점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$46$ / $47$ / $48$ / $49$ / $50$
~~~

## 원문 정답 (정확 문자열)

~~~text
①
~~~

## 원문 해설 (정확 문자열)

~~~text
F(x)=xf(x)−3x³+5x²이고 F′(x)=f(x)이므로 양변을 미분한다.
f(x)=f(x)+xf′(x)−9x²+10x
xf′(x)=9x²−10x
이다.
x≠0에서 f′(x)=9x−10이고, f′은 다항식이므로 이 식은 모든 x에서 성립한다.
적분하면
f(x)=9x²/2−10x+C
이다.
f(2)=6에서
18−20+C=6
C=8
을 얻는다.
따라서
f(−2)=18+20+8=46
이다.
그러므로 정답은 ①이다.
~~~

## 도식 초안 범위

f(x)=9x²/2−10x+8의 꼭짓점 V=(10/9,22/9), A=(−2,46), B=(2,6)을 표시한다. −2≤x≤2는 실제 정의역 제한이 아니라 표시 범위이다.

사용자 요청에 따라 다항함수의 곡선과 풀이의 꼭짓점 및 두 대입점을 표시한다.

정의역은 graphPlan.sourceDomain.kind=ALL_REALS로 두고, 유한 domain/viewport는 그림 표시창으로만 사용한다. axisTitles는 등호 없는 축 제목이며 axisTickValues는 양쪽 모두 빈 배열이다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 준비·렌더, PNG/SVG 검사, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. checker의 다음 검수를 기다린다. 지정된 초안 네 파일만 작성했다. 원문·엔진·assets·ledger·다른 문항 패키지에는 쓰지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## Automatic display-window reconciliation (2026-11-08 UTC)

Evidence: preparation-20-maesangirls-math2/display-window-caveat.json, input run 2026-11-08T22-07-32-438Z. fit_overview reported candidateFilesChanged=false and overrode the authored numeric x-window [-2, 2] with fittedDomain [-2.0500285936163203, 4.272250815838543]; fittedViewport was [-9.173039923653413, 9.226960076346586, -3.2857142857142847, 49.285714285714285]. The earlier caption phrasing therefore described a requested window, not the actual fitted display.

Minimal correction: updated only plan.caption and the matching publish.caption to say that the function domain is all real numbers and the finite display area follows engine auto-placement. item.json, plan.graphPlan (including coefficients, domain, viewport, sourceDomain, requiredPoints and exactCoordinates), sourceQuote, sourceConditions, newVisualInformation, coordinateLeader, and publish.alt are unchanged. The exact pre-correction four files are saved at preparation-20-maesangirls-math2/corrections/display-window-before/q11/.

No checker retry, render, math/visual review, remote write, publication or handoff was performed for this wording correction. Checker follow-up remains NOT_RUN; no visual readiness is claimed.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-38-44-170Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
- Numeric display-window caption wording was reconciled with automatic framing. This is resolved prose alignment, not a new content HOLD.
