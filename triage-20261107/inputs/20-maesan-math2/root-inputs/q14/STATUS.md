# 20 매산고 고2 수학II Q14 로컬 입력 초안

원문 결속: main `bc47febaf592b4da9614b2695abc9e0851291f5b`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesan-math2/source-exact.js` (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`). `item.json`은 `sourcePath`와 `ordinal: 14`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
다항함수 $f(x)$가 다음 조건을 만족시킨다.
(가) 모든 실수 $x$에 대하여 $xf(x)=\displaystyle\int_0^x f(t)dt+x^3\displaystyle\int_0^1 f(t)dt$가 성립한다.
(나) $f(4)=49$
이때, $f(3)$의 값을 구하면? [4.8점]
```

## 원문 선택지 (정확 문자열)

```text
$13$ / $18$ / $23$ / $28$ / $33$
```

## 원문 정답 (정확 문자열)

```text
④
```

## 원문 해설 (정확 문자열)

```text
$I=\int_0^1 f(t)\,dt$라 두고 주어진 식을 $x$에 대해 미분한다.
$f(x)+xf'(x)=f(x)+3x^2I$
$x\ne0$에서 $f'(x)=3xI$이고, 연속성으로 이 관계는 $x=0$에서도 성립한다.
적분하면
$f(x)=\dfrac32Ix^2+C$이다.
이를 $I$의 정의에 대입하면
$I=\int_0^1\left(\dfrac32It^2+C\right)dt=\dfrac12I+C$
이므로 $C=\dfrac12I$이다.
$f(4)=49$에서 $24I+\dfrac12I=49$, 따라서 $I=2$이다.
그러므로 $f(3)=\dfrac32\cdot2\cdot9+1=28$이고 정답은 ④이다.
```
## 초안 설명

원문 적분관계에서 정해진 f(x)=3x²+1과 두 함숫값을 정확히 표시한다. graphPlan.domain/viewport는 초기 입력값이며 자동 프레이밍이 실제 렌더 창을 결정한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 계획의 `graphPlan.domain`과 `graphPlan.viewport`는 초기 입력 또는 확인용 경계값이며 실제 표시창으로 단정하지 않는다. 자동 프레이밍은 이 값을 변경할 수 있다. 원문 내용, 선택지, 정답, 해설은 위에 정확 문자열로 보존했다. `sourceQuote`는 polynomial graph capability에서 지원되지 않아 `plan.json`에 넣지 않았다. 원격 쓰기 0회.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q14

범위 `polynomial-spike-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. Node `fit_overview`, `specFor`, `source_domain_preserved_during_fit` PASS. Python `semantic_model.validate`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` PASS; `exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL`. number-line/stat-chart/solid-figure stages=NOT_RUN; `formal_render=NOT_RUN`.

