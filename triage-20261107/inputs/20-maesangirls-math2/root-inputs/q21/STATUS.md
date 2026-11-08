# 20 매산여고 고2 수학II Q21 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js, pinned main 6a39acc2a39e7dec186a152ef7d29ec3da473c6d. 준비된 preparation-20-maesangirls-math2/source-exact.js의 window.questionBank에서 id 21, ordinal 21를 확인했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
[주관식3 (서술형)] 점 $(1,6)$을 지나는 곡선 $y=f(x)$ 위의 임의의 점 $(x,y)$에서 접하는 접선의 기울기가 $6x^2+10x-4$일 때, 다음 물음에 답하시오. [7점](부분점수 있음.)
1) 함수 $f(x)$의 도함수 $f'(x)$를 구하여라. (2점)
2) 함수 $f(x)$를 구하여라. (4점)
3) $f(-1)$의 값을 구하여라. (1점)
~~~

## 원문 선택지 (정확 문자열)

~~~text
(없음: 서술형 문항)
~~~

## 원문 정답 (정확 문자열)

~~~text
$f′(x)=6x^2+10x−4,\quad f(x)=2x^3+5x^2−4x+3,\quad f(−1)=10$
~~~

## 원문 해설 (정확 문자열)

~~~text
접선의 기울기는 도함수이므로
f′(x)=6x²+10x−4
이다.
이를 적분하면
f(x)=2x³+5x²−4x+C
이다.
점 (1,6)을 지나므로
2+5−4+C=6
C=3
이다.
따라서
f(x)=2x³+5x²−4x+3
이고
f(−1)=−2+5+4+3=10
이다.
~~~

## 도식 초안 범위

f(x)=2x³+5x²−4x+3에서 주어진 점 P=(1,6)과 계산점 Q=(−1,10)을 표시한다. −3≤x≤2는 실제 정의역 제한이 아니라 그래프 표시 범위이다.

사용자 요청에 따라 적분으로 복원한 함수와 원문 점 및 요청된 계산점을 그래프로 보조한다.

정의역은 graphPlan.sourceDomain.kind=ALL_REALS로 두고, 유한 domain/viewport는 그림 표시창으로만 사용한다. axisTitles는 등호 없는 축 제목이며 axisTickValues는 양쪽 모두 빈 배열이다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 준비·렌더, PNG/SVG 검사, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. checker의 다음 검수를 기다린다. 지정된 초안 네 파일만 작성했다. 원문·엔진·assets·ledger·다른 문항 패키지에는 쓰지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## Automatic display-window reconciliation (2026-11-08 UTC)

Evidence: preparation-20-maesangirls-math2/display-window-caveat.json, input run 2026-11-08T22-07-32-438Z. fit_overview reported candidateFilesChanged=false and overrode the authored numeric x-window [-3, 2] with fittedDomain [-4.297650476100594, 3.9069549782732667]; fittedViewport was [-4.297650476100594, 3.9069549782732667, -80.59109567098582, 217.3447194201509]. The earlier caption phrasing therefore described a requested window, not the actual fitted display.

Minimal correction: updated only plan.caption and the matching publish.caption to say that the function domain is all real numbers and the finite display area follows engine auto-placement. item.json, plan.graphPlan (including coefficients, domain, viewport, sourceDomain, requiredPoints and exactCoordinates), sourceQuote, sourceConditions, newVisualInformation, coordinateLeader, and publish.alt are unchanged. The exact pre-correction four files are saved at preparation-20-maesangirls-math2/corrections/display-window-before/q21/.

No checker retry, render, math/visual review, remote write, publication or handoff was performed for this wording correction. Checker follow-up remains NOT_RUN; no visual readiness is claimed.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-38-44-170Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
- Numeric display-window caption wording was reconciled with automatic framing. This is resolved prose alignment, not a new content HOLD.
