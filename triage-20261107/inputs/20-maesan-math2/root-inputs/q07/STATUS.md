# 20 매산고 고2 수학II Q07 로컬 입력 초안

원문 결속: main `bc47febaf592b4da9614b2695abc9e0851291f5b`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesan-math2/source-exact.js` (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`). `item.json`은 `sourcePath`와 `ordinal: 7`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
구간 $[-1,4]$에서 함수 $f(x)=x^3-12x+a$의 최댓값이 $6$일 때, $f(x)$의 최솟값을 구하면? [4.2점]
```

## 원문 선택지 (정확 문자열)

```text
$-28$ / $-26$ / $-24$ / $-22$ / $-20$
```

## 원문 정답 (정확 문자열)

```text
②
```

## 원문 해설 (정확 문자열)

```text
도함수의 부호로 구간 안의 극값 후보를 찾고 양 끝점도 비교한다.
$f'(x)=3x^2-12=3(x-2)(x+2)$
주어진 구간 $[-1,4]$ 안의 임계점은 $x=2$이다.
$a$를 제외한 함수값은
$x=-1$에서 $11$, $x=2$에서 $-16$, $x=4$에서 $16$이다.
최댓값이 $6$이므로 $16+a=6$, 따라서 $a=-10$이다.
최솟값은 $-16+a=-26$이다.
따라서 정답은 ②이다.
```
## 초안 설명

현재 `plan.json`은 실제 `piecewise-polynomial-spike-v1` 경로로 원문의 닫힌 구간 `[-1,4]`와 A(-1,1), B(2,-26), C(4,6)을 정확히 보존한다. 이 경로의 자동 프레이밍이 표시창을 정하므로 숫자 viewport/domain은 작성하지 않았다.

## 초기 일반 경로 제한 기록

초기 generic polynomial 초안이 cubic/quartic overview의 `ALL_REALS` 제한을 만나 보류된 것은 그 경로에 한정된다. 당시 네 파일은 `preparation-20-maesan-math2/corrections/before-pp-path/q07/`에 남겨 두었다.


## piecewise-polynomial 경로 정정

초기 일반 polynomial 경로 초안은 cubic/quartic overview의 `ALL_REALS` 제한 때문에 보류로 기록되었으며, 그 네 파일은 `preparation-20-maesan-math2/corrections/before-pp-path/q07/`에 보존했다. 실제 `piecewise-polynomial-spike-v1` 경로는 rational cubic 한 조각과 정확한 닫힌 source interval을 지원하므로, 현재 plan은 원문 구간 `[-1,4]`를 닫힌 끝점과 함께 유지한다. 이 수정은 작성/계약 검토만 반영했으며 입력 검사와 렌더는 시도하지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. piecewise-polynomial fitter가 source interval을 보존하면서 표시창을 자동으로 정한다. 원문 내용, 선택지, 정답, 해설은 위에 정확 문자열로 보존했다. `sourceQuote`는 이 그래프 capability에서 지원되지 않아 `plan.json`에 넣지 않았다. 원격 쓰기 0회.


## piecewise-polynomial 입력 초안 (2026-11-09)

현재 `plan.json`은 단일 rational cubic 조각 `x^3−12x−10`, 닫힌 원문 구간 `[-1,4]`, 끝점 및 내부 극값을 보존한다. `graphPlan`에서 viewport/domain을 작성하지 않아 프레이머가 실제 표시창을 정한다. 상태는 계속 LOCAL_ONLY / DRAFT_ONLY / NOT_READY이며 실제 입력 검사와 렌더는 NOT_RUN이다.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q07

범위 `piecewise-polynomial-spike-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. Node `fit_overview`, `specFor`, `source_domain_preserved_during_fit` PASS. Python `semantic_model.validate`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` PASS; `exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL`. number-line/stat-chart/solid-figure stages=NOT_RUN; `formal_render=NOT_RUN`.

