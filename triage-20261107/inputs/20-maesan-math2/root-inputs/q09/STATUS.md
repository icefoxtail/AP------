# 20 매산고 고2 수학II Q09 로컬 입력 초안

원문 결속: main `bc47febaf592b4da9614b2695abc9e0851291f5b`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesan-math2/source-exact.js` (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`). `item.json`은 `sourcePath`와 `ordinal: 9`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
두 곡선 $y=x^3+2x^2$, $y=-x^3+3x^2+4x+a$가 서로 다른 두 점에서 만날 때, 가능한 모든 상수 $a$의 값의 합을 구하면? [4.3점]
```

## 원문 선택지 (정확 문자열)

```text
$-\dfrac{37}{27}$ / $-\dfrac{34}{27}$ / $-\dfrac{31}{27}$ / $-\dfrac{28}{27}$ / $-\dfrac{25}{27}$
```

## 원문 정답 (정확 문자열)

```text
①
```

## 원문 해설 (정확 문자열)

```text
두 곡선의 교점은
$x^3+2x^2=-x^3+3x^2+4x+a$
를 만족하므로
$a=2x^3-x^2-4x$이다.
$h(x)=2x^3-x^2-4x$라 두면, 서로 다른 두 교점이 되는 경계는 수평선 $y=a$가 $h$의 극값에서 접할 때이다.
$h'(x)=6x^2-2x-4=2(3x+2)(x-1)$
극값을 만드는 $x$는 $-\dfrac23,1$이다.
$h\left(-\dfrac23\right)=\dfrac{44}{27}$, $h(1)=-3=-\dfrac{81}{27}$
가능한 두 $a$의 합은 $\dfrac{44}{27}-\dfrac{81}{27}=-\dfrac{37}{27}$이다.
따라서 정답은 ①이다.
```
## 초안 설명

현재 `plan.json`은 `piecewise-polynomial-spike-v1`의 단일 cubic 곡선과 두 정확한 수평 기준선을 표시한다. y=44/27에서 h(x)−44/27=2(x+2/3)^2(x−11/6), y=−3에서 h(x)+3=(x−1)^2(2x+3)이므로 두 교점 목록은 각각 `[-2/3, 11/6]`, `[-3/2, 1]`이다. A(-2/3,44/27)는 exactCoordinates 및 coordinateLeader로 표시한다. 다중 곡선 capability는 사용하지 않는다.

## 초기 일반 경로 제한 기록

초기 generic polynomial 초안에서 라인 추가가 제한된 것은 그 경로에 한정된다. 당시 네 파일은 `preparation-20-maesan-math2/corrections/before-pp-path/q09/`에 보존했다.


## piecewise-polynomial 경로 정정

초기 일반 polynomial 경로의 라인 제한 판단과 네 파일은 `preparation-20-maesan-math2/corrections/before-pp-path/q09/`에 보존했다. 실제 `piecewise-polynomial-spike-v1` 경로는 rational cubic 조각과 정확한 수평 `referenceLines`를 지원하므로, 현재 plan에 두 극값 높이와 완전한 교점 목록을 넣었다. 다중 곡선 capability는 사용하지 않았다. 수정은 작성/대수 확인만 반영했으며 입력 검사와 렌더는 시도하지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. piecewise-polynomial fitter가 실수 전체 정의역의 자동 표시창을 정한다. 원문 내용, 선택지, 정답, 해설은 위에 정확 문자열로 보존했다. `sourceQuote`는 이 그래프 capability에서 지원되지 않아 `plan.json`에 넣지 않았다. 원격 쓰기 0회.


## piecewise-polynomial 입력 초안 (2026-11-09)

현재 `plan.json`은 h(x)=2x^3−x^2−4x와 수평선 y=44/27, y=−3을 기록하며 각각의 모든 교점 x값을 정확하게 나열한다. A(−2/3,44/27)는 exactCoordinates와 coordinateLeader로 표시한다. 상태는 계속 LOCAL_ONLY / DRAFT_ONLY / NOT_READY이며 실제 입력 검사와 렌더는 NOT_RUN이다.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q09

범위 `piecewise-polynomial-spike-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. Node `fit_overview`, `specFor`, `source_domain_preserved_during_fit` PASS. Python `semantic_model.validate`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` PASS; `exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL`. number-line/stat-chart/solid-figure stages=NOT_RUN; `formal_render=NOT_RUN`.

