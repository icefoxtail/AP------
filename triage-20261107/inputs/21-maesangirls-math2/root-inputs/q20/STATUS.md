# 21 매산여고 고2 수학II Q20 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob edfbd0d27672dc288fbbec741aad01de36967a4a; SHA-256 c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9; source-exact.js 41,934 bytes. sourcePath와 ordinal 20를 결속했다. 사용자 사유: 실제로 이해를 돕는 도식을 준비하고, 리더 전략을 보조한다.

## 원문 문항 (정확 문자열)

```text
[주관식2 (단답형)] 그림과 같이 밑면의 반지름의 길이가 $8$, 높이가 $12$인 원뿔의 내부에 밑면이 정사각형인 직육면체를 내접시킬 때, 직육면체의 부피가 최대가 되는 직육면체 밑면의 한 변의 길이를 구하여라. [4점]
```

## 원문 선택지 (정확 문자열)

```text
(선택지 없음)
```

## 원문 정답 (정확 문자열)

```text
$\dfrac{16\sqrt2}{3}$
```

## 원문 해설 (정확 문자열)

```text
밑면의 한 변을 $x$, 직육면체의 높이를 $y$라 둔다. 수평 단면의 정사각형 대각선은 원의 지름이므로 원뿔 단면의 반지름은 $\frac{x\sqrt2}{2}$이다.
원뿔의 높이와 반지름은 닮음으로 비례한다.
$\frac{12-y}{12}=\frac{x\sqrt2/2}{8}$
따라서 $y=12-\frac{3\sqrt2}{4}x$이다.
부피는
$V(x)=x^2y=12x^2-\frac{3\sqrt2}{4}x^3$
$V'(x)=24x-\frac{9\sqrt2}{4}x^2=\frac{3\sqrt2}{4}x(16\sqrt2-3x)$
$0<x<8\sqrt2$에서 $V$는 $x=\frac{16\sqrt2}{3}$까지 증가한 뒤 감소한다.
따라서 부피가 최대일 때 밑면의 한 변은 $\frac{16\sqrt2}{3}$이다.
```

## 초안 범위

실제 solid-figure-v1 계약의 cone와 LEVEL section만으로 정확한 부분 도식을 작성했다. LEVEL at=1/3은 solver source에서 z=f·height, 즉 밑면 기준 4 높이임을 확인했으며 그때 반지름은 16/3이다.
원문에 직육면체 내접 장면이 있지만 이 계약은 cone 안에 prism을 정확히 배치하지 못한다. 따라서 prism은 빠진 partial plan임을 캡션과 alt에 명확히 밝혔으며 이를 완전한 내접 도형으로 표현하지 않는다. 원본 PNG는 이 작업자가 열거나 수정하지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 이 작업은 지정된 네 파일만 로컬 초안으로 기록하며 원문·엔진·assets·ledger·기존 패키지를 바꾸지 않는다. Q01/Q03 신규 엔진 결과, 기존 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 prior392files를 보존한다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## Frozen first-run history and amendment (2026-11-08 UTC)

Frozen first-run error (preserved exactly): SOLID_DIM_LABEL_INVALID:d3. The exact pre-amendment plan.json, publish.json, and STATUS.md are saved under preparation-21-maesangirls-math2/corrections/before/q20/. Minimal amendment: d3 label changed from 16/3 to the supported exact TeX fraction \frac{16}{3}; the represented radius remains exactly 16/3. After amendment, plan input check NOT_RUN, render NOT_RUN, visual review NOT_RUN, independent math review NOT_RUN, publication NOT_RUN, and handoff NOT_RUN. publish.json was not amended. Draft remains LOCAL_ONLY / DRAFT_ONLY / NOT_READY.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-41-33-295Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, solveSolidFigure, solidFigureSpec, expandSolidFigure.
첫 실패와 변경 전 파일은 preparation-21-maesangirls-math2/corrections/before/에 보존했다. 라벨 문법만 정정한 최신 item/plan/publish 3파일이 재검사 동결 SHA-256 및 검사 전후 SHA-256과 모두 일치했다.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
