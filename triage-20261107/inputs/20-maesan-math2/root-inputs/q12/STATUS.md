# 20 매산고 고2 수학II Q12 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js, pinned main bc47febaf592b4da9614b2695abc9e0851291f5b. 준비된 preparation-20-maesan-math2/source-exact.js와 동봉 source-base64.json의 바이트 일치를 확인했다 (source-exact.js SHA-256 2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36; 38634 bytes). sourcePath와 ordinal 12를 결속했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
함수 $f(x)=x^3+ax^2-(a^2-2a)x+4$가 극값을 갖지 않을 때, 정수 $a$의 개수를 구하면? [4.8점]
~~~

## 원문 선택지 (원본 배열 순서, 정확 문자열)

~~~text
$1$
$2$
$3$
$4$
$5$
~~~

## 원문 정답 (정확 문자열)

~~~text
②
~~~

## 원문 해설 (정확 문자열)

~~~text
삼차함수가 극값을 가지려면 도함수의 이차방정식이 서로 다른 두 실근을 가져야 한다. 극값을 갖지 않으려면 판별식이 $0$ 이하이다.
$f'(x)=3x^2+2ax-(a^2-2a)$
$D=(2a)^2-4\cdot3\cdot[-(a^2-2a)]$
$=16a^2-24a=8a(2a-3)$
$8a(2a-3)\le0$에서 $0\le a\le\dfrac32$이다.
이 범위의 정수는 $0,1$ 두 개이다.
따라서 정답은 ②이다.
~~~

## 보조 도식 범위

판별식에서 나온 일반 매개변수 범위 0≤a≤3/2를 수직선에 나타내고 그 안에 포함되는 정수 0,1을 표시한다. 고정 예시를 전체 함수의 일반 곡선으로 가장하지 않는다.

요청 취지: 함수 관계가 이해에 조금이라도 도움이 되면 시각 자료를 계획한다. 이 네 초안은 주어진 관계만 정리하며 원문/정답/해설을 바꾸지 않는다. 수직선 라벨·간격 배치는 아직 렌더·검토하지 않아 가독성이나 리더 간격을 확인했다고 주장하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 검사, SVG/PNG 렌더, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 지정된 초안 네 파일만 작성했다. 원문, 엔진, assets, triage/ledger, 보호 문항, 다른 패키지는 수정하지 않았다. 효천 ref 거부는 재시도하거나 우회하지 않았다.


## 정정 기록 (2026-11-09 UTC; 정적 스키마 검토)

- 정정 전 네 파일의 정확한 사본은 `preparation-20-maesan-math2/corrections/before-sourcequote/q12/`에 보존했다.
- 정적 검토에서 number-line-v1의 top-level 허용 키에 `sourceQuote`가 없음을 확인해 plan.json의 top-level `sourceQuote`만 제거했다. 원문 전체는 위 출처 기록에 그대로 남아 있다. 실제 checker 입력 검사는 실행하지 않았으며 validation은 NOT_RUN이다.
- 나머지 문항 근거와 수학 관계는 바꾸지 않았다. 렌더, 시각·독립 수학 검토, 원격 쓰기, publication, handoff는 NOT_RUN이다.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q12

범위 `number-line-figure-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. number-line `expandNumberLineFigure=PASS`, `top_level_sourceQuote_policy=PASS`. Graph `fit_overview/specFor`=NOT_RUN이며 Python graph semantic/viewport/axis/coordinate stages=NOT_APPLICABLE (이 문항은 number-line 입력으로 graph Python check 대상이 아님). stat-chart/solid-figure stages와 formal render=NOT_RUN. 이 PASS는 number-line input expansion 범위만 뜻한다.

