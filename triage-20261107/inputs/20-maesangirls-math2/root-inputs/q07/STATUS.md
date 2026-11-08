# 20 매산여고 고2 수학II Q07 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js, pinned main 6a39acc2a39e7dec186a152ef7d29ec3da473c6d. 준비된 preparation-20-maesangirls-math2/source-exact.js의 window.questionBank에서 id 7, ordinal 7를 확인했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
함수 $f(x)=x^3+ax^2+bx+3$은 $x=3$에서 극솟값 $3$을 가진다. 이때, 함수 $f(x)$의 극댓값을 $k$라 하면, $a+b+k$를 구하면? (단, $a,b,k$는 상수) [3.8점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$2$ / $4$ / $6$ / $8$ / $10$
~~~

## 원문 정답 (정확 문자열)

~~~text
⑤
~~~

## 원문 해설 (정확 문자열)

~~~text
x=3에서 극솟값을 가지므로 먼저
f′(3)=0,
f(3)=3
이다.
f′(x)=3x²+2ax+b이므로
27+6a+b=0
이고,
f(3)=27+9a+3b+3=3에서
3a+b=−9
를 얻는다.
두 식을 빼면
3a=−18,
a=−6,
b=9
이다.
따라서
f′(x)=3x²−12x+9=3(x−1)(x−3)
이므로 다른 극점 x=1에서 극댓값을 갖는다.
k=f(1)=1−6+9+3=7
따라서
a+b+k=−6+9+7=10
이다.
그러므로 정답은 ⑤이다.
~~~

## 도식 초안 범위

f(x)=x³−6x²+9x+3의 극댓점 M=(1,7), 극솟점 m=(3,3)을 표시한다. −0.5≤x≤4는 그래프 표시 범위이다.

사용자 요청에 따라 계수를 결정한 삼차함수와 풀이의 두 극점을 그래프로 보조한다. 표시 창은 모든 실수 정의역을 대신하지 않는다.

정의역은 graphPlan.sourceDomain.kind=ALL_REALS로 두고, 유한 domain/viewport는 그림 표시창으로만 사용한다. axisTitles는 등호 없는 축 제목이며 axisTickValues는 양쪽 모두 빈 배열이다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 준비·렌더, PNG/SVG 검사, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. checker의 다음 검수를 기다린다. 지정된 초안 네 파일만 작성했다. 원문·엔진·assets·ledger·다른 문항 패키지에는 쓰지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## Automatic display-window reconciliation (2026-11-08 UTC)

Evidence: preparation-20-maesangirls-math2/display-window-caveat.json, input run 2026-11-08T22-07-32-438Z. fit_overview reported candidateFilesChanged=false and overrode the authored numeric x-window [-0.5, 4] with fittedDomain [-6.6000000000000005, 7.953000000000001]; fittedViewport was [-6.6000000000000005, 7.953000000000001, -725.7600987265502, 318.6087569035501]. The earlier caption phrasing therefore described a requested window, not the actual fitted display.

Minimal correction: updated only plan.caption and the matching publish.caption to say that the function domain is all real numbers and the finite display area follows engine auto-placement. item.json, plan.graphPlan (including coefficients, domain, viewport, sourceDomain, requiredPoints and exactCoordinates), sourceQuote, sourceConditions, newVisualInformation, coordinateLeader, and publish.alt are unchanged. The exact pre-correction four files are saved at preparation-20-maesangirls-math2/corrections/display-window-before/q07/.

No checker retry, render, math/visual review, remote write, publication or handoff was performed for this wording correction. Checker follow-up remains NOT_RUN; no visual readiness is claimed.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-38-44-170Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: PASS.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
- Numeric display-window caption wording was reconciled with automatic framing. This is resolved prose alignment, not a new content HOLD.
