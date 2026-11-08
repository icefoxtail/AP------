# 20 매산여고 고2 수학II Q18 로컬 입력 초안

원문 결속: main `6a39acc2a39e7dec186a152ef7d29ec3da473c6d`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesangirls-math2/source-exact.js` (SHA-256 `5fb339978672e83ec2aa158c9e97407747be2baf3f993f9bafa20f227a8823c9`). `item.json`은 `sourcePath`와 `ordinal: 18`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
$0\le x\le2$에서 $f(x)=-x^3+6ax^2-a$의 최댓값을 $g(a)$라 할 때, $g(-1)+8g\left(\dfrac{1}{4}\right)+g(1)$의 값을 구하면? (단, $a$는 상수) [4.4점]
```

## 원문 선택지 (정확 문자열)

```text
$12$ / $14$ / $16$ / $18$ / $20$
```

## 원문 정답 (정확 문자열)

```text
④
```

## 원문 해설 (정확 문자열)

```text
각 a에서 도함수와 구간 끝값을 비교한다.
a=−1일 때
f(x)=−x³−6x²+1
f′(x)=−3x²−12x≤0  (0≤x≤2)
이므로 최댓값은 x=0에서
g(−1)=f(0)=1
이다.
a=1/4일 때
f(x)=−x³+(3/2)x²−1/4
f′(x)=3x(1−x)
이므로 x=0에서 증가하고 x=1 뒤 감소한다.
f(0)=−1/4,
f(1)=1/4,
f(2)=−9/4
따라서
g(1/4)=1/4
이다.
a=1일 때
f(x)=−x³+6x²−1
f′(x)=3x(4−x)>0  (0<x≤2)
이므로 최댓값은 x=2에서
g(1)=−8+24−1=15
이다.
따라서
g(−1)+8g(1/4)+g(1)=1+2+15=18
이다.
그러므로 정답은 ④이다.
```

## 초안 설명

세 매개변수 값은 같은 함수의 한 그래프로 잇지 않는다. 각기 정확한 세 다항곡선(f/g/h)을 별도 참조 곡선으로 표시하고, 모두 원문 닫힌 정의역 `[0,2]`와 각 경우의 최대점 좌표를 보존한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일만 작성했다. 원격 쓰기 0회.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-07-32-438Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: PASS.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
