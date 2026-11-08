# 20 매산여고 고2 수학II Q20

상태: **LOCAL_ONLY · DRAFT_ONLY · NOT_READY**. item/plan/publish와 상태 기록을 로컬 초안으로 저장했다. 이 초안은 READY 또는 게시 가능 판정이 아니다.

원문 결속: `archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js`, ordinal/questionBank id 20. 기준 main `6a39acc2a39e7dec186a152ef7d29ec3da473c6d`. 제공된 정확 원문 `preparation-20-maesangirls-math2/source-exact.js` (45,848 bytes, SHA-256 `5fb339978672e83ec2aa158c9e97407747be2baf3f993f9bafa20f227a8823c9`). item.json은 sourcePath와 ordinal 20으로 결속한다.

사용자 사유: 실제 함수 개형이 이해를 돕고 리더의 풀이 계획을 보조한다. 외분점의 배치 순서는 t에 따라 달라질 수 있으므로 고정된 점 배치를 꾸며내지 않는다.

## 원문 문항 content (정확 문자열)

```text
[주관식2 (단답형)] 직선 $x=t$가 곡선 $y=2x^3+1$, $y=9x+1$과 만나는 점을 각각 $P,Q$라 하자. 선분 $PQ$를 $6:1$로 외분하는 점을 $R$라 할 때, 점 $R$의 $y$좌표를 $f(t)$라 할 때, 함수 $f(t)$의 극댓값을 구하시오. [4점]
```

## 원문 choices 필드

원문 source-exact.js의 choices는 빈 배열이다.

## 원문 정답 (정확 문자열)

`$\dfrac{113}{5}$`

## 원문 solution (정확 문자열)

```text
P,Q의 y좌표는 각각 2t³+1, 9t+1이다.
PQ를 6:1로 외분하는 점 R의 y좌표는
f(t)=(6(9t+1)−(2t³+1))/(6−1)
=(−2t³+54t+5)/5
이다.
f′(t)=(54−6t²)/5
이므로 임계점은 t=−3,3이다.
f′의 부호가 t=3에서 +에서 −로 바뀌므로 극댓값은
f(3)=(−54+162+5)/5=113/5
이다.
```

## 초안 범위

외분공식으로 원문에서 정확히 정해지는 f(t)=(−2t³+54t+5)/5만 polynomial-spike-v1로 나타낸다. 그래프의 source domain은 모든 실수이며, [-5,5]는 표시용 프레임이다. 정확한 극값 좌표는 numeric requiredPoints와 exactCoordinates에 함께 보존하고 좌표 지시선을 계획했다. P,Q,R의 개별 그림을 만들지 않고, t에 따라 바뀔 수 있는 상대적 세로 순서를 고정하지 않는다.

검사: source-exact.js에서 questionBank id 20, 원문 content, answer 및 solution을 확인했다. 외분공식과 도함수로 극값을 검토해 초안을 작성했으나 공식 입력 checker와 독립 수학 검토는 아직 실행하지 않았다.

미실행: 독립 입력 checker, fit/semantic/coordinate/viewport 검사, engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication 및 handoff는 모두 **NOT_RUN**이다. 원격 쓰기·렌더·엔진·source/assets/ledger 편집은 하지 않았다. Q06/15/19 등 보호 문항, 기존 자산과 승인 이력은 수정하지 않았다. 효천 reference 접근 거부는 재시도·우회하지 않았다.


## Final local input-only result — 2026-11-08

- Run: 2026-11-08T22-07-32-438Z. Current item/plan/publish SHA-256 match this run.
- fit_overview, actual specFor, semantic_model.validate, actual critical-point construction, viewport.for_spec, engine axis-tick guard, fit/spec tick comparison PASS. Exact coordinate labels: NOT_APPLICABLE_NO_COORDINATE_LABEL.
- LOCAL_ONLY / DRAFT_ONLY / NOT_READY remain. Whole engine.prepare/build, render, visual review, independent full mathematical review, CI, publication and handoff NOT_RUN.
- First failures and before-correction files are retained. No source, SVG, engine, ledger, queue, remote ref, or external handoff was changed.
