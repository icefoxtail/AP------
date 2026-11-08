# 20 매산고 고2 수학II Q19 로컬 입력 초안

원문 기준: `preparation-20-maesan-math2/source-exact.js`, source main `bc47febaf592b4da9614b2695abc9e0851291f5b`, 원본 경로 `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js`, ordinal `19`. 아래 문항·정답·해설은 source-exact.js의 해당 row에서 그대로 옮겼다.

## 원문 문항 (verbatim)

```text
[서술형1] $x$에 대한 삼차방정식 $2x^3-6x-a=0$이 세 실근 $\alpha,\beta,\gamma$를 갖는다.
실수 $a$에 대하여 $|\alpha|+|\beta|+|\gamma|$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값을 구하는 과정을 서술하시오. [10점]
```

## 원문 정답 (verbatim)

```text
$4+2\sqrt{3}$
```

## 원문 해설 (verbatim)

```text
식 $2x^3-6x-a=0$을 $p(x)=x^3-3x=\dfrac a2$로 본다.
$p'(x)=3x^2-3=3(x-1)(x+1)$
$p(-1)=2$, $p(1)=-2$이므로 세 실근을 갖는 범위는 $-4\le a\le4$이다.

$a=0$이면 근은 $-\sqrt3,0,\sqrt3$이므로 절댓값의 합은 $2\sqrt3$이다.
이제 $0<a\le4$라 하자. 세 근을 $\alpha\le\beta<0<\gamma$라 하면 근의 합은 $0$이므로
$|\alpha|+|\beta|+|\gamma|=-\alpha-\beta+\gamma=2\gamma$이다.

$\gamma>1$에서 $p$는 증가한다. $a$가 $0$에서 $4$까지 증가하면 $p(\gamma)=a/2$에 따라 $\gamma$는 $\sqrt3$에서 $2$까지 증가한다.
따라서 절댓값의 합은 $2\sqrt3$에서 $4$까지 증가한다. $a<0$인 경우는 근의 부호가 반대인 대칭 경우이므로 같은 범위이다.

그러므로 $M=4$, $m=2\sqrt3$이고
$M+m=4+2\sqrt3$이다.
```

## 도식 범위

곡선은 p(x)=x³−3x만 정확히 표시하며 sourceDomain은 실수 전체다. 수평선 y=a/2는 현재 도식 표현에 넣지 않고, 양 끝 a=±4에서 중복도 기준의 세 실근이지만 서로 다른 실근은 두 개뿐임을 캡션으로 명시한다. 라벨 좌표는 근호가 필요한 점에 exactCoordinates의 x·y 문자열을 함께 기록한다. 실제 render window는 자동이며 수치 표시 범위를 주장하지 않는다.

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. item·plan·publish의 입력 JSON 기록만 만들었다. 실제 schema/engine 검사, prepare/build, 렌더/SVG/PNG 확인, browser·visual review, 독립 전체 수학 검토, 게시 확인, handoff는 NOT_RUN이다. 원문·기존 자산·ledger·queue를 수정하지 않았고 원격 쓰기를 하지 않았다.


## 입력 수정 기록

첫 실제 `fit_overview` 검사에서 `INVALID_CUBIC_QUARTIC_DRAW_INTERVAL`이 보고되었다. `domain: [-3, 3]`과 `viewport: [-3, 3, -20, 20]`을 초기 표시 요청으로 추가했으며 `sourceDomain: ALL_REALS`와 모든 수학 입력은 유지했다. 문구는 이 도식에서 수평선을 추가하지 않는다는 뜻으로 좁혔다. 검사 전 4개 파일의 보존 사본은 `preparation-20-maesan-math2/corrections/before-input-fix/q19/`에 있다. 재검사와 렌더 검증은 아직 진행하지 않았다.

## 수정 후 단일 bounded input recheck 기록

원본 보고서: `preparation-20-maesan-math2/checker/recheck-q16-q19/reports/node-results-2026-11-08T23-13-07-665Z.json`, `python-results-2026-11-08T23-13-07-665Z.json`, `run-summary-2026-11-08T23-13-07-665Z.json.json`. runId `2026-11-08T23-13-07-665Z`; corrected frozen JSON snapshot 48/48 frozen. Q19 item/source binding, input hashes stable, item/publish/plan parse, publish fields, capability dispatch PASS. `fit_overview`, `specFor`, `source_domain_preserved_during_fit` PASS. Python `semantic_model.validate`, `axis_title_plain_max10`, `engine_critical_construction`, `viewport.for_spec`, `engine_axis_tick_guard`, `fit_spec_tick_static_match` PASS; `exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL`. Formal render, browser/visual review, engine prepare/build, CI, publication, handoff, and external writes NOT_RUN; overall math/visual assessment NOT_ASSESSED.

