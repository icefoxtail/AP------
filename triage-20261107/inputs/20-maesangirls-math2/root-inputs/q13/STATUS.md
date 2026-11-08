# 20 매산여고 고2 수학II Q13 로컬 입력 초안

원문 결속: main `6a39acc2a39e7dec186a152ef7d29ec3da473c6d`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesangirls-math2/source-exact.js` (SHA-256 `5fb339978672e83ec2aa158c9e97407747be2baf3f993f9bafa20f227a8823c9`). `item.json`은 `sourcePath`와 `ordinal: 13`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
두 곡선 $y=x^3-x$, $y=-x^2+x$로 둘러싸인 도형의 넓이를 구하면? [4.2점]
```

## 원문 선택지 (정확 문자열)

```text
$\dfrac{5}{12}$ / $\dfrac{13}{12}$ / $\dfrac{23}{12}$ / $\dfrac{29}{12}$ / $\dfrac{37}{12}$
```

## 원문 정답 (정확 문자열)

```text
⑤
```

## 원문 해설 (정확 문자열)

```text
두 곡선의 교점을 구한다.
x³−x=−x²+x
x³+x²−2x=0
x(x²+x−2)=0
x(x+2)(x−1)=0
따라서 교점의 x좌표는 −2,0,1이다.
두 곡선의 차를
D(x)=(x³−x)−(−x²+x)=x³+x²−2x
로 둔다.
−2<x<0에서 D(−1)=2>0이므로 첫째 곡선이 위에 있다.
0<x<1에서 D(1/2)=−5/8<0이므로 둘째 곡선이 위에 있다.
넓이는
∫₋₂⁰D(x)dx−∫₀¹D(x)dx
=[x⁴/4+x³/3−x²]₋₂⁰−[x⁴/4+x³/3−x²]₀¹
=8/3+5/12
=37/12
이다.
그러므로 정답은 ⑤이다.
```

## 초안 설명

두 식을 각각 정확한 다항식으로 나타내고 교점 −2, 0, 1과 두 곡선의 국소 극값을 포함한다. 적분 경계별 위·아래 곡선에 맞춰 두 영역을 따로 음영 처리한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일만 작성했다. 원격 쓰기 0회.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-07-32-438Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
