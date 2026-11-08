# 20 매산고 고2 수학II Q11 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js, pinned main bc47febaf592b4da9614b2695abc9e0851291f5b. 준비된 preparation-20-maesan-math2/source-exact.js와 동봉 source-base64.json의 바이트 일치를 확인했다 (source-exact.js SHA-256 2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36; 38634 bytes). sourcePath와 ordinal 11를 결속했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
함수 $f(x)$의 도함수 $y=f'(x)$는 우함수이며 그래프가 아래와 같을 때, 보기에서 옳은 것을 모두 고른 것은? [4.5점]
ㄱ. 함수 $f(x)$의 극값은 $4$개이다.
ㄴ. 함수 $f(x)$는 구간 $(0,2)$에서 증가한다.
ㄷ. $\displaystyle\int_{-3}^3f'(x)dx=2\displaystyle\int_0^3f'(x)dx$
~~~

## 원문 선택지 (원본 배열 순서, 정확 문자열)

~~~text
ㄱ
ㄱ, ㄴ
ㄱ, ㄷ
ㄴ, ㄷ
ㄱ, ㄴ, ㄷ
~~~

## 원문 정답 (정확 문자열)

~~~text
③
~~~

## 원문 해설 (정확 문자열)

~~~text
도함수 그래프의 $x$절편과 부호를 정리한다.
$x:\quad(-\infty,-3),\ (-3,-1),\ (-1,1),\ (1,3),\ (3,\infty)$
$f'(x):\quad- ,\quad+ ,\quad- ,\quad+ ,\quad-$
$f'$의 부호가 바뀌는 점에서 $f$는 극값을 갖는다.
$x=-3,1$에서는 부호가 $-$에서 $+$로 바뀌므로 극소이고,
$x=-1,3$에서는 부호가 $+$에서 $-$로 바뀌므로 극대이다.
따라서 $f$의 극값은 $4$개이므로 ㄱ은 참이다.
$(0,1)$에서 $f'(x)<0$이므로 $f$는 감소한다. 따라서 $(0,2)$ 전체에서 증가한다는 ㄴ은 거짓이다.
$f'$가 우함수이므로
$\int_{-3}^{0}f'(x)\,dx=\int_0^3f'(x)\,dx$
따라서
$\int_{-3}^{3}f'(x)\,dx=2\int_0^3f'(x)\,dx$
이므로 ㄷ은 참이다.
따라서 옳은 것은 ㄱ, ㄷ이고 정답은 ③이다.
~~~

## 보조 도식 범위

원문 Q11의 image와 solutionImage는 동일한 원본 assets/images/20_매산고_2학기_기말_고2_수학II/q11.png를 가리킨다. source-bound item.json은 그 원본 참조를 대체하지 않는다. 보조 수직선에는 해설의 영점 −3,−1,1,3만 표시하고, 구간별 부호 −,+,−,+,−는 캡션에만 적는다. 우함수라는 조건 외의 실제 도함수 식이나 그래프 높이를 만들지 않는다.

요청 취지: 함수 관계가 이해에 조금이라도 도움이 되면 시각 자료를 계획한다. 이 네 초안은 주어진 관계만 정리하며 원문/정답/해설을 바꾸지 않는다. 수직선 라벨·간격 배치는 아직 렌더·검토하지 않아 가독성이나 리더 간격을 확인했다고 주장하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 검사, SVG/PNG 렌더, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 지정된 초안 네 파일만 작성했다. 원문, 엔진, assets, triage/ledger, 보호 문항, 다른 패키지는 수정하지 않았다. 효천 ref 거부는 재시도하거나 우회하지 않았다.


## 정정 기록 (2026-11-09 UTC; 정적 스키마 검토)

- 정정 전 네 파일의 정확한 사본은 `preparation-20-maesan-math2/corrections/before-sourcequote/q11/`에 보존했다.
- 정적 검토에서 number-line-v1의 top-level 허용 키에 `sourceQuote`가 없음을 확인해 plan.json의 top-level `sourceQuote`만 제거했다. 원문 전체는 위 출처 기록에 그대로 남아 있다. 실제 checker 입력 검사는 실행하지 않았으며 validation은 NOT_RUN이다.
- 도식 범위를 명확히 했다: 수직선에는 네 영점만 표시하고, 부호열은 캡션에만 둔다. 원본 q11.png 참조는 보존했다.
- 나머지 문항 근거와 수학 관계는 바꾸지 않았다. 렌더, 시각·독립 수학 검토, 원격 쓰기, publication, handoff는 NOT_RUN이다.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q11

범위 `number-line-figure-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. number-line `expandNumberLineFigure=PASS`, `top_level_sourceQuote_policy=PASS`. Graph `fit_overview/specFor`=NOT_RUN이며 Python graph semantic/viewport/axis/coordinate stages=NOT_APPLICABLE (이 문항은 number-line 입력으로 graph Python check 대상이 아님). stat-chart/solid-figure stages와 formal render=NOT_RUN. 이 PASS는 number-line input expansion 범위만 뜻한다.

