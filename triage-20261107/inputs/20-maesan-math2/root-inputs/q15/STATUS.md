# 20 매산고 고2 수학II Q15 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js, pinned main bc47febaf592b4da9614b2695abc9e0851291f5b. 준비된 preparation-20-maesan-math2/source-exact.js와 동봉 source-base64.json의 바이트 일치를 확인했다 (source-exact.js SHA-256 2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36; 38634 bytes). sourcePath와 ordinal 15를 결속했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
실수 전체의 집합에서 미분가능한 함수 $f(x)$가 $\displaystyle\lim_{x\to\infty}f'(x)=10$을 만족할 때, 평균값 정리를 이용하여 $\displaystyle\lim_{x\to\infty}{f(x+3)-f(x+1)}$의 값을 구하면? [5.1점]
~~~

## 원문 선택지 (원본 배열 순서, 정확 문자열)

~~~text
$10$
$20$
$30$
$40$
$50$
~~~

## 원문 정답 (정확 문자열)

~~~text
②
~~~

## 원문 해설 (정확 문자열)

~~~text
평균값정리를 $[x+1,x+3]$에 적용하면 어떤 $c_x\in(x+1,x+3)$에 대하여
$\dfrac{f(x+3)-f(x+1)}{2}=f'(c_x)$이다.
따라서
$f(x+3)-f(x+1)=2f'(c_x)$
$x\to\infty$일 때 $c_x\to\infty$이므로 $f'(c_x)\to10$이다.
구하는 극한은 $2\cdot10=20$이고 정답은 ②이다.
~~~

## 보조 도식 범위

x+1<c_x<x+3의 순서만 나타내는 기호 수직선으로 평균값정리의 중간점과 x→∞ 관계를 보조한다. 원문이 주지 않은 f의 식, 함수 그래프, 특정 c_x를 만들지 않는다.

요청 취지: 함수 관계가 이해에 조금이라도 도움이 되면 시각 자료를 계획한다. 이 네 초안은 주어진 관계만 정리하며 원문/정답/해설을 바꾸지 않는다. 수직선 라벨·간격 배치는 아직 렌더·검토하지 않아 가독성이나 리더 간격을 확인했다고 주장하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 검사, SVG/PNG 렌더, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 지정된 초안 네 파일만 작성했다. 원문, 엔진, assets, triage/ledger, 보호 문항, 다른 패키지는 수정하지 않았다. 효천 ref 거부는 재시도하거나 우회하지 않았다.


## 정정 기록 (2026-11-09 UTC; 정적 스키마 검토)

- 정정 전 네 파일의 정확한 사본은 `preparation-20-maesan-math2/corrections/before-sourcequote/q15/`에 보존했다.
- 정적 검토에서 number-line-v1의 top-level 허용 키에 `sourceQuote`가 없음을 확인해 plan.json의 top-level `sourceQuote`만 제거했다. 원문 전체는 위 출처 기록에 그대로 남아 있다. 실제 checker 입력 검사는 실행하지 않았으며 validation은 NOT_RUN이다.
- 캡션과 publish 설명에 기호점 대응 a=x+1, c=c_x, b=x+3을 명시했다. 점 간격은 수치 비율이 아니며, 특정하거나 유일한 c_x를 주장하지 않는다.
- 나머지 문항 근거와 수학 관계는 바꾸지 않았다. 렌더, 시각·독립 수학 검토, 원격 쓰기, publication, handoff는 NOT_RUN이다.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q15

범위 `number-line-figure-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. number-line `expandNumberLineFigure=PASS`, `top_level_sourceQuote_policy=PASS`. Graph `fit_overview/specFor`=NOT_RUN이며 Python graph semantic/viewport/axis/coordinate stages=NOT_APPLICABLE (이 문항은 number-line 입력으로 graph Python check 대상이 아님). stat-chart/solid-figure stages와 formal render=NOT_RUN. 이 PASS는 number-line input expansion 범위만 뜻한다.

