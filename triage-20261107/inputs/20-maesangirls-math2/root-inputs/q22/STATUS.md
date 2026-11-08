# 20 매산여고 고2 수학II Q22 로컬 입력 초안

원문 결속: main `6a39acc2a39e7dec186a152ef7d29ec3da473c6d`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesangirls-math2/source-exact.js` (SHA-256 `5fb339978672e83ec2aa158c9e97407747be2baf3f993f9bafa20f227a8823c9`). `item.json`은 `sourcePath`와 `ordinal: 22`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
[주관식4 (서술형)] 최고차항의 계수가 $1$인 두 다항함수 $f(x),g(x)$가 모든 실수 $x$에 대하여 $f(-x)=f(x)$, $g(-x)=-g(x)$를 만족시킨다. 두 함수 $f(x),g(x)$에 대하여 다음 조건을 만족시킬 때, 다음 물음에 답하시오. [7점](부분점수 있음.)
(가) $\displaystyle\lim_{x\to\infty}\dfrac{f'(x)}{x^3g'(x)}=4$
(나) $\displaystyle\lim_{x\to0}\dfrac{f(x)g(x)}{x}=-4$
(다) $f'(1)=-2$
1) $y=f(x)$, $y=g(x)$를 구하여라. (4점)
2) $y=f(x)$와 $x$축으로 둘러싸인 도형의 넓이를 구하여라. (3점)
```

## 원문 선택지 (정확 문자열)

```text

```

## 원문 정답 (정확 문자열)

```text
$f(x)=x^4−3x^2−4,\quad g(x)=x,\quad \dfrac{96}{5}$
```

## 원문 해설 (정확 문자열)

```text
f,g의 차수를 각각 m,n이라 하면 최고차항의 비에서
(m/n)x^(m−n−3)→4
이다.
주어진 극한이 0이 아닌 유한한 값이므로
m−n−3=0,
m/n=4
이다.
따라서
m−n=3,
m=4n
이다.
이를 대입하면
4n−n=3
3n=3
n=1
m=4
이다.
f는 최고차항 계수 1인 짝함수, g는 최고차항 계수 1인 홀함수이므로
f(x)=x⁴+ax²+b,
g(x)=x
로 둔다.
limₓ→₀ f(x)g(x)/x=f(0)=b=−4
이고
f′(1)=4+2a=−2
에서 a=−3이다.
따라서
f(x)=x⁴−3x²−4=(x²−4)(x²+1)
이다.
−2<x<2에서 f(x)<0이므로 넓이는
−∫₋₂²f(x)dx
=−[x⁵/5−x³−4x]₋₂²
=96/5
이다.
```

## 초안 설명

원문의 실제 사차함수 `f(x)=x⁴−3x²−4`를 ALL_REALS 정의역으로 두고, exact roots and critical points를 명시한다. 색칠은 원문에서 묻는 x축과 f의 유한 영역 `[-2,2]` 하나다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 지정된 네 파일만 작성했다. 원격 쓰기 0회.

## 캡션 문구 정정

계획 캡션의 외래어 오기법을 제거하고 `−2≤x≤2`에서 `f(x)=(x²−4)(x²+1)≤0`임을 문법에 맞게 표현했다. 게시 캡션도 같은 구간·부호 정보를 담도록 정정했다. 기존 원문 인용, 풀이, 상태 및 이력은 그대로 두었다. 수학식, 좌표, 원자료 결속은 변경하지 않았다. 검사·렌더·원격 쓰기는 수행하지 않았다.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-07-32-438Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
