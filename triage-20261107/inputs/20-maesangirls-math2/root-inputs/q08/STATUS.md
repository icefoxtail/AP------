# 20 매산여고 고2 수학II Q08

상태: **LOCAL_ONLY · DRAFT_ONLY · NOT_READY**. item/plan/publish와 상태 기록을 로컬 초안으로 저장했다. 이 초안은 READY 또는 게시 가능 판정이 아니다.

원문 결속: `archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js`, ordinal/questionBank id 8. 기준 main `6a39acc2a39e7dec186a152ef7d29ec3da473c6d`. 제공된 정확 원문 `preparation-20-maesangirls-math2/source-exact.js` (45,848 bytes, SHA-256 `5fb339978672e83ec2aa158c9e97407747be2baf3f993f9bafa20f227a8823c9`). item.json은 sourcePath와 ordinal 8로 결속한다.

사용자 사유: 함수 시각화가 이해를 돕고 리더의 풀이 계획을 보조한다. 불확실한 원함수 식이나 높이는 꾸며내지 않는다.

## 원문 문항 content (정확 문자열)

```text
연속함수 $f(x)$의 도함수 $y=f'(x)$의 그래프가 다음 그림과 같을 때, 원점을 지나는 함수 $y=f(x)$의 그래프의 개형으로 옳은 것을 고르면? [3.9점]
```

## 원문 choices 필드

원문 source-exact.js의 choices는 빈 배열이다. 답 선택 그림은 별도 원본 asset `assets/images/20_매산여고_2학기_기말_고2_수학II/q8.png`에 포함되어 있다. 원본 Q08 PNG와 그 안의 모든 선택 그림을 그대로 보존하며 재작성하거나 다시 그리지 않는다. ROOT가 이 원본 PNG를 확인했다.

## 원문 정답 (정확 문자열)

`②`

## 원문 solution (정확 문자열)

```text
도함수 그래프에서 구간별 부호를 읽는다.
x<−1에서는 f′(x)>0,
−1<x<0에서는 f′(x)<0,
0<x<1에서는 f′(x)>0,
x>1에서는 f′(x)<0
이다.
따라서 f는 x=−1에서 극대, x=0에서 극소, x=1에서 극대가 된다.
f(0)=0이므로 원점을 지나며, 이 증가·감소 흐름을 나타내는 그래프는 ②이다.
그러므로 정답은 ②이다.
```

## 초안의 시각화와 보류

보조 number-line-figure-v1은 +, −, +, −의 도함수 부호 구간과 이에 대응하는 증가·감소 흐름만 표시한다. f(0)=0 조건은 캡션에 둔다. 임의의 f 식, 곡선 높이 또는 원함수의 실제 개형을 그리지 않으며, 원본 선택지를 그리지 않는다. plan에는 sourceQuote를 두지 않고 원문 content/answer/solution은 이 STATUS에 그대로 보존했다.

**독립 보류(HOLD):** 원문 해설은 x=−1,0,1에서 f의 극값을 서술한다. 다만 원본 f′ 그래프에서 x=±1의 점값은 공란이고 좌우 극한이 일치하지 않는다는 검토 메모가 있다. 이 초안은 x=±1에서 f′이 존재한다거나 정지점이라고 주장하지 않는다. 원문 내용/해설과 이 도식의 범위는 변경하지 않았으며, 끝점 관련 해석은 별도 검토 대상으로 남긴다.

검사: source-exact.js를 읽어 questionBank id 8, 원문 content, answer 및 solution을 확인했다. 로컬 초안을 저장했으며 공식 입력 검사와 수학 검토는 아직 수행하지 않았다.

미실행: 독립 입력 checker, fit/semantic/coordinate/viewport 검사, engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication 및 handoff는 모두 **NOT_RUN**이다. 원격 쓰기·렌더·엔진·source/assets/ledger 편집은 하지 않았다. Q06/15/19 등 보호 문항, 기존 자산과 승인 이력은 수정하지 않았다. 효천 reference 접근 거부는 재시도·우회하지 않았다.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-07-32-438Z. Current item/plan/publish SHA-256 match this run.
- number-line.expandNumberLineFigure PASS. Graph semantic/viewport stages are not applicable to this input-function scope.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
- Q08 possible original derivative defect at ±1 remains a separate CONTENT HOLD; this input pass does not repair the original picture or its choices.
