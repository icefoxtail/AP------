# 20 매산고 고2 수학II Q16 로컬 입력 초안

원문 기준: `preparation-20-maesan-math2/source-exact.js`, source main `bc47febaf592b4da9614b2695abc9e0851291f5b`, 원본 경로 `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js`, ordinal `16`. 아래 문항·정답·해설은 source-exact.js의 해당 row에서 그대로 옮겼다.

## 원문 문항 (verbatim)

```text
[단답형1] 다음은 극대에 대한 정의이다.
함수 $f(x)$에서 $x=a$를 포함하는 어떤 열린구간에 속하는 모든 $x$에 대하여 $f(x)\le f(a)$일 때, 함수 $f(x)$는 $x=a$에서 극대라 하고, $f(a)$를 극댓값이라고 한다.
다음 함수의 정의역 중 극대가 되는 정수 $x$값을 모두 구하시오. [4점]
\[
f(x)=\begin{cases}x&(x<0)\\0&(0\le x<2)\\-x^2+6x-8&(2\le x)\end{cases}
\]
```

## 원문 정답 (verbatim)

```text
0, 1, 3
```

## 원문 해설 (verbatim)

```text
각 구간에서 함수값이 주변의 함수값보다 크거나 같은 정수 $x$를 찾는다.
$x<0$에서는 $f(x)=x$가 증가하므로 극대점이 없다.
$0\le x<2$에서는 $f(x)=0$이므로 정수 $x=0,1$은 각각 주변에서 극댓값을 갖는다.
$x=2$의 함수값은 $0$이고, $x>2$에서 $-x^2+6x-8$은 $x=3$까지 증가하므로 $x=2$는 극대가 아니다.
$x=3$에서는 이 이차함수의 꼭짓점이므로 극대이다. 그 외 정수에서는 극대가 아니다.
따라서 답은 $0,1,3$이다.
```

## 도식 범위

그래프는 x<0, 0≤x<2, x≥2의 원문 정의를 실수 전체에서 그대로 나타내도록 세 다항 조각과 경계점을 기록한다. 국소 극대의 정의가 비엄격이므로 평탄한 구간의 모든 내부점이 극대이자 극소이며, x=2의 오른쪽 값은 바로 커져 이 점은 극대가 아니다. 실제 렌더 창은 자동이며 특정 수치 창으로 보였다고 주장하지 않는다.

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. item·plan·publish의 입력 JSON 기록만 만들었다. 실제 schema/engine 검사, prepare/build, 렌더/SVG/PNG 확인, browser·visual review, 독립 전체 수학 검토, 게시 확인, handoff는 NOT_RUN이다. 원문·기존 자산·ledger·queue를 수정하지 않았고 원격 쓰기를 하지 않았다.


## 입력 수정 기록

첫 실제 `fit_overview` 검사에서 선택적 `graphPlan.formula` 설명 문자열이 `PIECEWISE_POLY_FORMULA_INVALID`를 일으켰다. 최소 수정으로 해당 선택적 `formula` 필드만 제거했다. 세 piece 계수와 breakpoints는 원문 함수를 그대로 표현한다. 검사 전 4개 파일의 보존 사본은 `preparation-20-maesan-math2/corrections/before-input-fix/q16/`에 있다. 재검사와 렌더 검증은 아직 진행하지 않았다.

## 수정 후 단일 bounded input recheck 기록

원본 보고서: `preparation-20-maesan-math2/checker/recheck-q16-q19/reports/node-results-2026-11-08T23-13-07-665Z.json`, `python-results-2026-11-08T23-13-07-665Z.json`, `run-summary-2026-11-08T23-13-07-665Z.json.json`. runId `2026-11-08T23-13-07-665Z`; corrected frozen JSON snapshot 48/48 frozen. Q16 item/source binding, input hashes stable, item/publish/plan parse, publish fields, capability dispatch PASS. `fit_overview`, `specFor`, `source_domain_preserved_during_fit` PASS. Python `semantic_model.validate`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` PASS; `exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL`. Formal render, browser/visual review, engine prepare/build, CI, publication, handoff, and external writes NOT_RUN; overall math/visual assessment NOT_ASSESSED.

