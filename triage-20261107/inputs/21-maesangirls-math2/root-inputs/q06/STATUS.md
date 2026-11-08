# 21 매산여고 고2 수학II Q06 로컬 입력 초안

원문 결속: main 0135d49b3e4134c2fbc4fa12144a07c98eb49869; blob edfbd0d27672dc288fbbec741aad01de36967a4a; SHA-256 c29efb02c3cc3a9adcd3740037f96f8235b9d709ca06fe9c4529c83e3f0dbdd9; source-exact.js 41,934 bytes. sourcePath와 ordinal 6를 결속했다. 사용자 사유: 실제로 이해를 돕는 도식을 준비하고, 리더 전략을 보조한다.

## 원문 문항 (정확 문자열)

```text
원점을 출발하여 수직선 위를 $9$초 동안 움직이는 점 $P$의 시각 $t$초에서 속도 $v(t)$의 그래프가 다음과 같을 때, 점 $P$의 운동에 대한 설명 중 옳은 것을 모두 고르면? [3.8점]
ㄱ. 출발 후 $9$초 동안 운동 방향이 두 번 바뀐다.
ㄴ. $t=3$에서 $t=8$까지 움직인 거리는 $4$이다.
ㄷ. $t=1$일 때와 $t=3$일 때의 속력은 서로 같다.
ㄹ. 출발한 지 $7$초 후에 다시 원점으로 돌아온다.
```

## 원문 선택지 (정확 문자열)

```text
ㄱ, ㄴ / ㄱ, ㄷ / ㄱ, ㄹ / ㄴ, ㄷ / ㄷ, ㄹ
```

## 원문 정답 (정확 문자열)

```text
②
```

## 원문 해설 (정확 문자열)

```text
그래프가 $t$축과 만나는 시각은 $t=0,2,5,9$이다. 각 구간의 부호를 읽어 판단한다.
ㄱ. 속도의 부호가 $t=2,5$에서 바뀌므로 운동 방향은 두 번 바뀐다. 참.
ㄴ. $3$초부터 $8$초까지의 이동거리는 그래프와 $t$축 사이 넓이의 합이다.
$4+\frac{1\cdot4}{2}+\frac{1\cdot4}{2}+2\cdot4=16$
따라서 $4$가 아니므로 거짓.
ㄷ. $v(1)=4$, $v(3)=-4$이므로 두 시각의 속력은 모두 $4$이다. 참.
ㄹ. $t=7$일 때까지의 위치 변화는
$4-2-4-2+2+4=2$
이므로 원점으로 돌아오지 않는다. 거짓.
참인 것은 ㄱ, ㄷ이므로 정답은 ②이다.
```

## 초안 범위

원문에서 주어진 속도 그래프의 모든 꼭짓점을 보존하는 유한구간 PD 그래프다. 같은 직선 위에 놓이는 연속 원문 점만 선분 하나로 합쳐 총 6개 선분으로 기록했다.
PD 엔진 계약의 12-piece 한도 안에서 여섯 affine pieces로 정확히 표현했다. 입력/엔진/렌더/시각/수학 검수는 수행하지 않았다. 원본 SVG는 이 작업자가 열거나 수정하지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 이 작업은 지정된 네 파일만 로컬 초안으로 기록하며 원문·엔진·assets·ledger·기존 패키지를 바꾸지 않는다. Q01/Q03 신규 엔진 결과, 기존 NO_ADDITIONAL_VISUAL_REQUIRED 이력 및 prior392files를 보존한다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## 최종 로컬 동결본 입력 검사 집계

현재 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 근거 실행 2026-11-08T20-28-38-433Z. 이전 NOT_RUN 및 실패 표기는 작성·검사 당시 이력으로 보존하며, 현재 범위는 아래와 같다.

실제로 통과한 Node 단계: frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch, fit_overview, specFor.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=FAIL.
보조 fit_spec_tick_static_match의 FAIL은 그대로 보존한다. fitted ticks null과 spec의 {x:[], y:[]} 기본값 차이이며, 실제 engine_axis_tick_guard는 PASS다. q06-tick-default-supplement.md에 계약 근거를 기록했고 Q06을 수정하거나 재검사하지 않았다.

검사 원문 기준 main 0135d49b3e4134c2fbc4fa12144a07c98eb49869. 이는 해당 입력 함수 범위의 결과이며 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 렌더 또는 READY를 주장하지 않는다. 원격 쓰기 0회이며 효천 ref 거절은 재시도·우회하지 않았다.
