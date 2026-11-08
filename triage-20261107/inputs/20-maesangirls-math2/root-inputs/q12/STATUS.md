# 20 매산여고 고2 수학II Q12 로컬 입력 초안

원문 결속: main `6a39acc2a39e7dec186a152ef7d29ec3da473c6d`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesangirls-math2/source-exact.js` (SHA-256 `5fb339978672e83ec2aa158c9e97407747be2baf3f993f9bafa20f227a8823c9`). `item.json`은 `sourcePath`와 `ordinal: 12`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
닫힌구간 $[-2,4]$에서 $f(x)=2x^3-3x^2-12x+k+3$의 최댓값이 $38$일 때, 함수 $f(x)$의 최솟값을 구하면? (단, $k$는 상수) [4.1점]
```

## 원문 선택지 (정확 문자열)

```text
$-15$ / $-14$ / $-13$ / $-12$ / $-11$
```

## 원문 정답 (정확 문자열)

```text
②
```

## 원문 해설 (정확 문자열)

```text
상수항을 제외한 함수를 h(x)라 두면
h(x)=2x³−3x²−12x
h′(x)=6(x−2)(x+1)
이다.
끝점과 임계점에서 값을 계산하면
h(−2)=−4,
h(−1)=7,
h(2)=−20,
h(4)=32
이다.
따라서 f의 최댓값은 32+k+3=k+35이고,
k+35=38
k=3
이다.
최솟값은 x=2에서
−20+3+3=−14
이다.
그러므로 정답은 ②이다.
```

## 초안 설명

상수 결정 후의 실제 함수는 `2x³−3x²−12x+6`이다. 닫힌 원문 구간 `[-2,4]`를 그대로 보존하고, 끝점 및 내부 임계점 네 곳의 정확한 정수 좌표를 표시한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일만 작성했다. 원격 쓰기 0회.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-07-32-438Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
