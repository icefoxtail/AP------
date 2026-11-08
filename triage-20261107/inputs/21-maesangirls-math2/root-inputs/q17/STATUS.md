# 21 매산여고 고2 수학II Q17 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob edfbd0d27672dc288fbbec741aad01de36967a4a; SHA-256 c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9; 제공된 source-exact.js 41,934 bytes. sourcePath와 ordinal 17를 결속했다. 사용자 사유: 실제로 이해를 돕는 도식을 준비하고, 리더 전략을 보조한다.

## 원문 문항 (정확 문자열)

```text
삼차함수 $f(x)=-x^3-4x+3$, $g(x)=x^2-5x+5$에 대하여 부등식 $f(g(x))\le-{f(x)}^3-4f(x)+3$을 만족시키는 $x$의 최솟값을 구하면? [4.3점]
```

## 원문 선택지 (정확 문자열)

```text
$-2$ / $-1$ / $0$ / $1$ / $2$
```

## 원문 정답 (정확 문자열)

```text
①
```

## 원문 해설 (정확 문자열)

```text
$F(u)=-u^3-4u+3$이라 두면 $f=F$이고 주어진 부등식은 $F(g(x))\le F(f(x))$이다.
$F'(u)=-3u^2-4<0$이므로 $F$는 감소한다. 따라서 부등식은 $g(x)\ge f(x)$와 같다.
$g(x)-f(x)=x^3+x^2-x+2=(x+2)(x^2-x+1)$
$x^2-x+1=(x-\frac12)^2+\frac34>0$이므로
$g(x)-f(x)\ge0$은 $x\ge-2$와 같다.
따라서 $x$의 최솟값은 $-2$이다.
```

## 초안 범위

감소성으로 부등식을 바꾼 뒤 인수분해로 얻는 해집합만 수직선에 나타낸다.
원문의 F를 새로운 함수 그래프로 그리지 않는다. 수직선 plan에는 sourceQuote를 두지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 이 작업은 지정된 네 파일만 로컬 초안으로 기록하며 원문·엔진·assets·ledger·기존 패키지를 바꾸지 않는다. Q01/Q03 신규 엔진 결과, 기존 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 prior392files를 보존한다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, expandNumberLineFigure, top_level_sourceQuote_policy.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
