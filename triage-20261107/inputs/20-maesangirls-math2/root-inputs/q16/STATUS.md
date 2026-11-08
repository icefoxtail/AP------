# 20 매산여고 고2 수학II Q16

상태: **LOCAL_ONLY · DRAFT_ONLY · NOT_READY**. item/plan/publish와 상태 기록을 로컬 초안으로 저장했다. 이 초안은 READY 또는 게시 가능 판정이 아니다.

원문 결속: `archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js`, ordinal/questionBank id 16. 기준 main `6a39acc2a39e7dec186a152ef7d29ec3da473c6d`. 제공된 정확 원문 `preparation-20-maesangirls-math2/source-exact.js` (45,848 bytes, SHA-256 `5fb339978672e83ec2aa158c9e97407747be2baf3f993f9bafa20f227a8823c9`). item.json은 sourcePath와 ordinal 16으로 결속한다.

사용자 사유: 대칭 적분 관계를 시각적으로 이해하고 리더의 풀이 계획을 돕는다. 미정인 g의 실제 곡선은 꾸며내지 않는다.

## 원문 문항 content (정확 문자열)

```text
두 다항함수 $f(x),g(x)$가 모든 실수 $x$에 대하여 $f(-x)=-f(x)$, $g(x)=x^2f(x)$를 만족시킨다. 함수 $\displaystyle\int_{-2}^2(x^3+x-3)g'(x),dx=20$일 때, $12g(-2)$의 값을 구하면? [4.3점]
```

## 원문 choices (정확 문자열)

- `$-40$`
- `$-20$`
- `$0$`
- `$20$`
- `$40$`

## 원문 정답 (정확 문자열)

`⑤`

## 원문 solution (정확 문자열)

```text
g(x)=x²f(x)이고 f는 홀함수이므로 g도 홀함수, g′는 짝함수이다.
따라서 (x³+x)g′(x)는 홀함수라 대칭구간 적분이 0이다.
주어진 식은
−3∫₋₂²g′(x)dx=20
이다.
미적분의 기본정리를 적용하면
−3(g(2)−g(−2))=20
이고 g가 홀함수이므로
g(−2)=−g(2)
−6g(2)=20
g(2)=−10/3,
g(−2)=10/3
이다.
따라서
12g(−2)=40
이다.
그러므로 정답은 ⑤이다.
```

## 초안 범위

수직선은 대칭 적분 경계 −2, 0, 2만 나타낸다. 대칭성, g(−2)=10/3, g(2)=−10/3 및 12g(−2)=40은 캡션에 둔다. g는 조건만으로 특정 곡선이 정해지지 않으므로 실제 함수 그래프를 그리지 않는다. number-line plan에는 sourceQuote를 두지 않았고 원문 content/choices/answer/solution은 이 STATUS에 정확히 보존했다.

검사: source-exact.js에서 questionBank id 16, 원문 content, choices, answer 및 solution을 확인했다. 수식 관계를 검토해 초안을 작성했으나 공식 입력 checker와 독립 수학 검토는 아직 실행하지 않았다.

미실행: 독립 입력 checker, engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication 및 handoff는 모두 **NOT_RUN**이다. 원격 쓰기·렌더·엔진·source/assets/ledger 편집은 하지 않았다. Q06/15/19 등 보호 문항, 기존 자산과 승인 이력은 수정하지 않았다. 효천 reference 접근 거부는 재시도·우회하지 않았다.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-07-32-438Z. Current item/plan/publish SHA-256 match this run.
- number-line.expandNumberLineFigure PASS. Graph semantic/viewport stages are not applicable to this input-function scope.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
