# 21 매산여고 고2 수학II Q11 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob edfbd0d27672dc288fbbec741aad01de36967a4a; SHA-256 c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9; 제공된 source-exact.js 41,934 bytes. sourcePath와 ordinal 11를 결속했다. 사용자 사유: 실제로 이해를 돕는 도식을 준비하고, 리더 전략을 보조한다.

## 원문 문항 (정확 문자열)

```text
수직선 위를 움직이는 두 점 $P,Q$에 대하여 시각 $t$ ($t\ge0$)에서 점 $P$의 위치를 $x_1$, 점 $Q$의 위치를 $x_2$라 하자.
$x_1=3t^3-3t^2+7t$, $x_2=2t^3+4t^2-3t$일 때, 두 점 $P,Q$가 동시에 원점을 출발한 후 처음으로 만나는 순간 점 $P$의 속도를 구하면? [4.0점]
```

## 원문 선택지 (정확 문자열)

```text
$31$ / $32$ / $33$ / $34$ / $35$
```

## 원문 정답 (정확 문자열)

```text
①
```

## 원문 해설 (정확 문자열)

```text
두 점의 위치가 같을 때를 구한다.
$3t^3-3t^2+7t=2t^3+4t^2-3t$
$t^3-7t^2+10t=0$
$t(t-2)(t-5)=0$
$t\ge0$에서 원점을 함께 출발한 뒤 처음 만나는 시각은 $t=2$이다.
점 $P$의 속도는 위치를 미분해 구한다.
$x_1'(t)=9t^2-6t+7$
$x_1'(2)=36-12+7=31$이다.
```

## 초안 범위

상대 위치의 3차식을 그래프로 그리는 대신 t=0,2,5의 근을 수직선에 놓고 t=0을 출발 후 시각에서 명시적으로 제외한다. 속도 계산 31은 정확한 캡션에만 둔다.
계획 범위는 수직선의 시간/근 관계와 속도 정답 캡션이다. 무제한 정의역의 삼차함수 그림을 주장하지 않는다. 상단 plan에는 sourceQuote를 두지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 이 작업은 지정된 네 파일만 로컬 초안으로 기록하며 원문·엔진·assets·ledger·기존 패키지를 바꾸지 않는다. Q01/Q03 신규 엔진 결과, 기존 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 prior392files를 보존한다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## Frozen first-run history and amendment (2026-11-08 UTC)

Frozen first-run error (preserved exactly): NUMBER_LINE_ROW_LABEL_INVALID (row labels t>0 and D=0). The exact pre-amendment plan.json, publish.json, and STATUS.md are saved under preparation-21-maesangirls-math2/corrections/before/q11/. Minimal amendment: plan.json row labels are now 출발후 and 만남시각; point values, time set, caption equations, and publish text are unchanged. After amendment, plan input check NOT_RUN, render NOT_RUN, visual review NOT_RUN, independent math review NOT_RUN, publication NOT_RUN, and handoff NOT_RUN. publish.json was not amended. Draft remains LOCAL_ONLY / DRAFT_ONLY / NOT_READY.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-41-33-295Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, expandNumberLineFigure, top_level_sourceQuote_policy.
첫 실패와 변경 전 파일은 preparation-21-maesangirls-math2/corrections/before/에 보존했다. 라벨 문법만 정정한 최신 item/plan/publish 3파일이 재검사 동결 SHA-256 및 검사 전후 SHA-256과 모두 일치했다.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
