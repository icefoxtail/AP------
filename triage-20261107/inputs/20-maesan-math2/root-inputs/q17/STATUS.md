# 20 매산고 고2 수학II Q17 로컬 입력 초안

원문 결속: main `bc47febaf592b4da9614b2695abc9e0851291f5b`; 원본 경로 `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js`; 입력은 `preparation-20-maesan-math2/source-exact.js` (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`). `item.json`은 `sourcePath`와 `ordinal: 17`만으로 원문을 결속한다.

## 원문 문항 (정확 문자열)

```text
[단답형2] 최고차항의 계수가 음수인 사차함수 $f(x)$가 다음 조건을 모두 만족시킨다.
(가) $f(x)$는 직선 $x=3$에 대칭이다.
(나) $f(x)$는 $x=1$에서 극대이고, 극댓값은 $4$이다.
(다) $f(x)$의 극댓값과 극솟값은 $6$만큼 차이가 난다.
이때, $f(x)$를 구하시오. [5점]
```

## 원문 선택지 (정확 문자열)

```text

```

## 원문 정답 (정확 문자열)

```text
$f(x)=-\dfrac{3}{8}(x-3)^4+3(x-3)^2-2$
```

## 원문 해설 (정확 문자열)

```text
직선 $x=3$에 대한 대칭을 이용해 $u=x-3$으로 두면 사차함수는 $f(x)=Au^4+Bu^2+C$로 쓸 수 있다. 최고차항 계수가 음수이므로 $A<0$이다.
극값이 $x=1,3,5$에서 생기며 $x=1,5$가 극대이므로
$f'(x)=4Au^3+2Bu=2u(2Au^2+B)$
$u=\pm2$에서 $2A(4)+B=0$, 즉 $B=-8A$이다.
$B=-8A>0$이므로 $f''(3)=2B=-16A>0$이고, $x=3$은 극소점이다. 극댓값 $4$와 극솟값의 차가 $6$이므로 $4-C=6$, 따라서 $C=-2$이다.
$f(1)=16A+4B+C=4$에 $B=-8A$, $C=-2$를 대입하면
$16A-32A-2=4$
$A=-\dfrac38$, 따라서 $B=3$이다.
그러므로 $f(x)=-\dfrac38(x-3)^4+3(x-3)^2-2$이다.
```
## 초안 설명

대칭축 x=3에 대한 두 극대점과 가운데 극소점을 표시한다. 정확한 다항식 계수는 원문 해설을 전개해 정리했으며, graphPlan.domain/viewport는 초기 입력값으로 자동 프레이밍에서 바뀔 수 있다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 입력 검사 NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 시각 검토 NOT_RUN, 독립 수학 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 계획의 `graphPlan.domain`과 `graphPlan.viewport`는 초기 입력 또는 확인용 경계값이며 실제 표시창으로 단정하지 않는다. 자동 프레이밍은 이 값을 변경할 수 있다. 원문 내용, 선택지, 정답, 해설은 위에 정확 문자열로 보존했다. `sourceQuote`는 polynomial graph capability에서 지원되지 않아 `plan.json`에 넣지 않았다. 원격 쓰기 0회.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q17

범위 `polynomial-spike-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. Node `fit_overview`, `specFor`, `source_domain_preserved_during_fit` PASS. Python `semantic_model.validate`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` PASS; `exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL`. number-line/stat-chart/solid-figure stages=NOT_RUN; `formal_render=NOT_RUN`.

