# 20 매산여고 고2 수학II Q10 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js, pinned main 6a39acc2a39e7dec186a152ef7d29ec3da473c6d. 준비된 preparation-20-maesangirls-math2/source-exact.js의 window.questionBank에서 id 10, ordinal 10를 확인했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
삼차함수 $f(x)$의 도함수가 $f'(x)$일 때, $y=f'(x)$의 그래프는 다음과 같다. $f(0)=5$일 때, 방정식 $f(x)=k$가 서로 다른 세 실근을 갖기 위한 정수 $k$의 개수를 구하면? [4.0점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
$1$ / $2$ / $3$ / $4$ / $5$
~~~

## 원문 정답 (정확 문자열)

~~~text
③
~~~

## 원문 해설 (정확 문자열)

~~~text
도함수 그래프에서 f′의 영점은 −1,1이고 f′(0)=3이다.
그래프에 맞는 도함수는
f′(x)=3(1−x²)
이다.
적분하고 f(0)=5를 적용하면
f(x)=−x³+3x+5
이다.
f′의 부호는 −, +, −로 바뀌므로
f(−1)=3,
f(1)=7
은 각각 극솟값과 극댓값이다.
f(x)=k가 서로 다른 세 실근을 가지려면
3<k<7
이어야 한다.
정수 k는 4,5,6의 3개이다.
그러므로 정답은 ③이다.
~~~

## 도식 초안 범위

원문의 도함수 그래프는 f′(x)=3(1−x²)이다. 이 추가 도식은 f(x)=−x³+3x+5를 나타내며, 극솟점 m=(−1,3), 극댓점 M=(1,7), P=(0,5)를 표시한다. 3<k<7이며 −2≤x≤2는 표시 범위이다.

기존 원문 이미지는 도함수 f′를 보여준다. 사용자 요청에 따라 이해 보조용으로 복원된 f만 추가 그래프화하며, 두 함수 그래프를 혼동하지 않도록 식과 극값을 분리해 표기한다.

정의역은 graphPlan.sourceDomain.kind=ALL_REALS로 두고, 유한 domain/viewport는 그림 표시창으로만 사용한다. axisTitles는 등호 없는 축 제목이며 axisTickValues는 양쪽 모두 빈 배열이다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 준비·렌더, PNG/SVG 검사, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. checker의 다음 검수를 기다린다. 지정된 초안 네 파일만 작성했다. 원문·엔진·assets·ledger·다른 문항 패키지에는 쓰지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다. 원문 q10 도함수 PNG는 수정하지 않았고, 새 도식은 f(x)만 나타낸다.


## Automatic display-window reconciliation (2026-11-08 UTC)

Evidence: preparation-20-maesangirls-math2/display-window-caveat.json, input run 2026-11-08T22-07-32-438Z. fit_overview reported candidateFilesChanged=false and overrode the authored numeric x-window [-2, 2] with fittedDomain [-2.734822543399918, 2.734822543399918]; fittedViewport was [-2.734822543399918, 2.734822543399918, -10.924955484474394, 20.924955484474395]. The earlier caption phrasing therefore described a requested window, not the actual fitted display.

Minimal correction: updated only plan.caption and the matching publish.caption to say that the function domain is all real numbers and the finite display area follows engine auto-placement. item.json, plan.graphPlan (including coefficients, domain, viewport, sourceDomain, requiredPoints and exactCoordinates), sourceQuote, sourceConditions, newVisualInformation, coordinateLeader, and publish.alt are unchanged. The exact pre-correction four files are saved at preparation-20-maesangirls-math2/corrections/display-window-before/q10/.

No checker retry, render, math/visual review, remote write, publication or handoff was performed for this wording correction. Checker follow-up remains NOT_RUN; no visual readiness is claimed.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-38-44-170Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: PASS.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
- Numeric display-window caption wording was reconciled with automatic framing. This is resolved prose alignment, not a new content HOLD.
