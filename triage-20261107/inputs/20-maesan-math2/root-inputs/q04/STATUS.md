# 20 매산고 고2 수학II Q04 로컬 입력 초안

원문 결속: main `bc47febaf592b4da9614b2695abc9e0851291f5b`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesan-math2/source-exact.js` (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`). `item.json`은 `sourcePath`와 `ordinal: 4`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
원점에서 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$에서의 위치 $x$가 $x=3t^2-6t$일 때, $t=2$에서의 속도를 구하면? [3.9점]
```

## 원문 선택지 (정확 문자열)

```text
$2$ / $3$ / $4$ / $5$ / $6$
```

## 원문 정답 (정확 문자열)

```text
⑤
```

## 원문 해설 (정확 문자열)

```text
위치 함수의 도함수가 속도이다.
$x=3t^2-6t$이므로
$v(t)=\dfrac{dx}{dt}=6t-6$
$t=2$를 대입하면
$v(2)=12-6=6$
따라서 정답은 ⑤이다.
```
## 초안 설명

위치함수의 원문 시간영역 t≥0에서 유한한 부분 [0,4]만 표시하며, P(2,0)과 해당 점에서의 기울기 6을 설명한다. [0,4]는 전체 정의역이 아니라 명시한 표시 구간이다.


## 표시 구간

원문의 실제 시간 조건은 `t≥0`이다. 초안의 닫힌 `[0,4]`는 이 시간영역의 유한한 표시 부분만 뜻하며 운동의 끝이나 전체 정의역 경계가 아니다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 계획의 `graphPlan.domain`과 `graphPlan.viewport`는 초기 입력 또는 확인용 경계값이며 실제 표시창으로 단정하지 않는다. 자동 프레이밍은 이 값을 변경할 수 있다. 원문 내용, 선택지, 정답, 해설은 위에 정확 문자열로 보존했다. `sourceQuote`는 polynomial graph capability에서 지원되지 않아 `plan.json`에 넣지 않았다. 원격 쓰기 0회.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q04

범위 `polynomial-spike-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. Node `fit_overview`, `specFor`, `source_domain_preserved_during_fit` PASS. Python `semantic_model.validate`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` PASS; `exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL`. number-line/stat-chart/solid-figure stages=NOT_RUN; `formal_render=NOT_RUN`.

