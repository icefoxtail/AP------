# 21 매산여고 고2 수학II Q16 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob edfbd0d27672dc288fbbec741aad01de36967a4a; SHA-256 c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9; 제공된 source-exact.js 41,934 bytes. sourcePath와 ordinal 16를 결속했다. 사용자 사유: 실제로 이해를 돕는 도식을 준비하고, 리더 전략을 보조한다.

## 원문 문항 (정확 문자열)

```text
두 함수 $f(x)=4ax^2-a^2x-12$, $g(x)=x^3+2ax^2-3a$에 대하여 $x>0$일 때 $f(x)\le g(x)$가 성립하도록 하는 모든 자연수 $a$의 합을 구하면? [3.9점]
```

## 원문 선택지 (정확 문자열)

```text
$2$ / $4$ / $6$ / $8$ / $10$
```

## 원문 정답 (정확 문자열)

```text
⑤
```

## 원문 해설 (정확 문자열)

```text
$h(x)=g(x)-f(x)$라 두면 $x>0$에서 $h(x)\ge0$이어야 한다.
$h(x)=x^3-2ax^2+a^2x+12-3a$
$h'(x)=3x^2-4ax+a^2=(3x-a)(x-a)$
$h(x)=x(x-a)^2+12-3a$이므로
$x>0$에서 $x(x-a)^2\ge0$이고 $x=a$에서 $0$이다.
따라서 극솟값은 $h(a)=12-3a$이다.
따라서 $12-3a\ge0$, 즉 $a\le4$이다. $a$는 자연수이므로 가능한 값은 $1,2,3,4$이고
그 합은 $10$이다.
```

## 초안 범위

매개변수의 허용 자연수 집합과 경계 예시를 보여주는 수직선만 계획했다.
3차함수의 반직선 그래프는 plan에 포함하지 않는다. 원문의 x>0 정의역은 캡션과 경계 사례에 그대로 유지한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 이 작업은 지정된 네 파일만 로컬 초안으로 기록하며 원문·엔진·assets·ledger·기존 패키지를 바꾸지 않는다. Q01/Q03 신규 엔진 결과, 기존 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 prior392files를 보존한다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## Frozen first-run history and amendment (2026-11-08 UTC)

Frozen first-run error (preserved exactly): CHAIN_CAPTION_INVALID (numberLineCaption.math a in N). The exact pre-amendment plan.json, publish.json, and STATUS.md are saved under preparation-21-maesangirls-math2/corrections/before/q16/. Minimal amendment: removed only the unsupported optional numberLineCaption.math field. The caption still states the natural-number values 1, 2, 3, 4 and sum 10; the integer points are unchanged. After amendment, plan input check NOT_RUN, render NOT_RUN, visual review NOT_RUN, independent math review NOT_RUN, publication NOT_RUN, and handoff NOT_RUN. publish.json was not amended. Draft remains LOCAL_ONLY / DRAFT_ONLY / NOT_READY.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-41-33-295Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, expandNumberLineFigure, top_level_sourceQuote_policy.
첫 실패와 변경 전 파일은 preparation-21-maesangirls-math2/corrections/before/에 보존했다. 라벨 문법만 정정한 최신 item/plan/publish 3파일이 재검사 동결 SHA-256 및 검사 전후 SHA-256과 모두 일치했다.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
