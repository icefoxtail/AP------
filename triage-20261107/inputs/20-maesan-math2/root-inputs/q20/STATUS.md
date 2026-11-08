# 20 매산고 고2 수학II Q20 로컬 입력 초안

원문 기준: `preparation-20-maesan-math2/source-exact.js`, source main `bc47febaf592b4da9614b2695abc9e0851291f5b`, 원본 경로 `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js`, ordinal `20`. 아래 문항·정답·해설은 source-exact.js의 해당 row에서 그대로 옮겼다.

## 원문 문항 (verbatim)

```text
[서술형2] 함수 $f(x)=|2x-4|$에 대하여 $g(x)=(f\circ f)(x)$라 할 때, 사차함수 $h(x)$가 다음 조건을 만족시킨다.
(가) $h(4)=g(4)$
(나) 두 함수 $g(x)$와 $h(x)$는 $x$의 값이 $n-1$에서 $n$까지 변할 때의 평균변화율이 서로 같다. (단, $n$은 $4$ 이하의 모든 자연수)
이때, $h'(4)$의 값을 구하는 과정을 서술하시오. [10점]
```

## 원문 정답 (verbatim)

```text
$\dfrac{64}{3}$
```

## 원문 해설 (verbatim)

```text
$f(x)=2|x-2|$이므로 합성함수는
$g(x)=f(f(x))=\begin{cases}4|x-1|&(x\le2)\\4|x-3|&(x\ge2)\end{cases}$이다.
정수점에서 $g(0),g(1),g(2),g(3),g(4)$는 차례로 $4,0,4,0,4$이다. 조건에 따라 $h$의 연속한 정수점 사이 평균변화율은 $-4,4,-4,4$이고 $h(4)=4$이므로
$h(3)=0,\ h(2)=4,\ h(1)=0,\ h(0)=4$이다.
$t=4-x$로 놓고 $H(t)=h(4-t)-4=At^4+Bt^3+Ct^2+Dt$라 둔다.
$H(1)=-4, H(2)=0, H(3)=-4, H(4)=0$을 대입하면
$A+B+C+D=-4$
$16A+8B+4C+2D=0$
$81A+27B+9C+3D=-4$
$256A+64B+16C+4D=0$
식들을 정리하면
$7A+3B+C=4$
$19A+5B+C=-\dfrac43$
$37A+7B+C=\dfrac43$
따라서
$12A+2B=-\dfrac{16}3,\quad18A+2B=\dfrac83$
$A=\dfrac43,\quad B=-\dfrac{32}3$
앞의 식들에서 $C=\dfrac{80}3$, $D=-\dfrac{64}3$을 얻는다.
$H'(0)=D=-h'(4)$이므로 $h'(4)=\dfrac{64}3$이다.
```

## 도식 범위

g=f∘f의 exact piecewise-linear 전 구간만 네 조각으로 표시하며 원문 정의역은 실수 전체다. h는 다섯 정수점 보간 사차함수로 별개이고, 현재 그래프 계약에는 h 곡선이 추가되지 않는다. 캡션은 h′(4)=64/3과 g 그래프를 분리해 설명한다. display window는 자동이며 특정 수치 표시 범위를 주장하지 않는다.

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. item·plan·publish의 입력 JSON 기록만 만들었다. 실제 schema/engine 검사, prepare/build, 렌더/SVG/PNG 확인, browser·visual review, 독립 전체 수학 검토, 게시 확인, handoff는 NOT_RUN이다. 원문·기존 자산·ledger·queue를 수정하지 않았고 원격 쓰기를 하지 않았다.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q20

범위 `piecewise-polynomial-spike-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. Node `fit_overview`, `specFor`, `source_domain_preserved_during_fit` PASS. Python `semantic_model.validate`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` PASS; `exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL`. number-line/stat-chart/solid-figure stages=NOT_RUN; `formal_render=NOT_RUN`.

