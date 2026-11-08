# 20 매산여고 고2 수학II Q14 로컬 입력 초안

원문 결속: main `6a39acc2a39e7dec186a152ef7d29ec3da473c6d`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesangirls-math2/source-exact.js` (SHA-256 `5fb339978672e83ec2aa158c9e97407747be2baf3f993f9bafa20f227a8823c9`). `item.json`은 `sourcePath`와 `ordinal: 14`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
점 $A(-5)$를 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$ ($t\ge0$)에서의 속도 $v(t)$가 $v(t)=6(t-1)(t-2)$이다. 시각 $t=a$와 시각 $t=b$에서의 점 $P$의 위치가 모두 원점일 때, $a+b$를 구하면? (단, $a<b$) [4.2점]
```

## 원문 선택지 (정확 문자열)

```text
$\dfrac{7}{2}$ / $3$ / $\dfrac{5}{2}$ / $2$ / $\dfrac{3}{2}$
```

## 원문 정답 (정확 문자열)

```text
①
```

## 원문 해설 (정확 문자열)

```text
속도를 적분해 위치를 구한다.
x(t)=−5+∫₀ᵗ6(s−1)(s−2)ds
=−5+2t³−9t²+12t
이다.
위치가 원점일 때는
2t³−9t²+12t−5=0
(t−1)²(2t−5)=0
이다.
t≥0이므로 두 시각은
a=1,
b=5/2
이다.
따라서
a+b=1+5/2=7/2
이다.
그러므로 정답은 ①이다.
```

## 초안 설명

원문 시간영역 `t≥0`에서 양의 시간의 부분 구간 `[0,3]`만 그리는 계획이다. 끝점은 정확하고 캡션은 원문 정의역과 그래프 표시 구간을 구별한다. t=1의 중근 접촉과 t=5/2의 통과를 표시한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일만 작성했다. 원격 쓰기 0회.

## 2026-11-08 첫 제한 실제 입력 확인 및 최소 정정

Q14의 첫 제한 실제 입력 확인은 `fit_overview=PASS`였으나 `specFor`에서 `COORDINATE_LEADER_POINT_INVALID:D`로 실패했다. 원인은 coordinateLeader에 포함된 D=(2.5,0)에 정확 좌표 문자열이 없었던 것이다. 기존 네 파일을 `preparation-20-maesangirls-math2/corrections/before/q14/`에 보존한 뒤, `graphPlan.exactCoordinates.D`에 `["5/2","0"]`만 추가했다. 숫자 좌표, 수학식, 정의역, 다른 plan 필드와 publish/item 파일은 변경하지 않았다. 정정 후 입력 검사 NOT_RUN; 렌더 NOT_RUN; 원격 쓰기 0회.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-38-44-170Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
