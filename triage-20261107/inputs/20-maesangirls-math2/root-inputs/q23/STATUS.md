# 20 매산여고 고2 수학II Q23 로컬 입력 초안

원문 결속: main `6a39acc2a39e7dec186a152ef7d29ec3da473c6d`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesangirls-math2/source-exact.js` (SHA-256 `5fb339978672e83ec2aa158c9e97407747be2baf3f993f9bafa20f227a8823c9`). `item.json`은 `sourcePath`와 `ordinal: 23`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
[주관식5 (서술형)] 임의의 실수 $x$에 대하여 함수 $f(x)$가 $f(x)=|x^2-1|+\displaystyle\int_{-2}^0 f(x),dx$를 만족시킬 때 다음 물음에 답하시오. [7점](부분점수 있음.)
1) $\displaystyle\int_{-2}^0 f(x),dx$의 값을 구하여라. (4점)
2) $\displaystyle\int_0^k f(x),dx=\dfrac{4}{3}$인 실수 $k$의 값을 구하여라. (단, $k\ge1$) (3점)
```

## 원문 선택지 (정확 문자열)

```text

```

## 원문 정답 (정확 문자열)

```text
$\int_{-2}^{0}f(x)dx=−2,\quad k=3$
```

## 원문 해설 (정확 문자열)

```text
A=∫₋₂⁰f(x)dx라 두면
f(x)=|x²−1|+A
이다.
짝함수이므로
A=∫₀²f(x)dx
=∫₀¹(1−x²+A)dx+∫₁²(x²−1+A)dx
=(2/3+A)+(4/3+A)
=2+2A
이다.
따라서
A=−2
이고 f(x)=|x²−1|−2이다.
k≥1이므로
∫₀ᵏf(x)dx=∫₀¹(−x²−1)dx+∫₁ᵏ(x²−3)dx
=k³/3−3k+4/3
이다.
이를 4/3과 같게 두면
k³/3−3k=0
k(k²−9)=0
이다.
k≥1에서
k=3
이다.
```

## 초안 설명

절댓값을 정확한 세 다항 조각으로 나타내고, 원문 적분 경계와 근·꺾임점, 중앙 꼭짓점을 표시한다. [0,3]의 부호가 바뀌는 지점 `√3`에서 음수 및 양수 영역을 분리한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일만 작성했다. 원격 쓰기 0회.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-07-32-438Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
