# 20 매산고 고2 수학II Q13 로컬 입력 초안

출처 결속: archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js, pinned main bc47febaf592b4da9614b2695abc9e0851291f5b. 준비된 preparation-20-maesan-math2/source-exact.js와 동봉 source-base64.json의 바이트 일치를 확인했다 (source-exact.js SHA-256 2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36; 38634 bytes). sourcePath와 ordinal 13를 결속했다. plan.json의 sourceQuote는 원문 content 문자열 그대로이다.

## 원문 문항 (정확 문자열)

~~~text
평균값정리는 다음과 같다.
함수 $f(x)$가 닫힌구간 $[a,b]$에서 연속이고 열린구간 $(a,b)$에서 미분가능할 때, $\dfrac{f(b)-f(a)}{b-a}=f'(c)$인 $c$가 $a$와 $b$ 사이에 적어도 하나 존재한다.
아래는 평균값 정리의 증명 과정이다. 가운데 빈칸에 들어갈 수식으로 옳은 것은? [4.8점]
롤의 정리를 이용하여 평균값 정리를 증명해 보자. 함수 $y=f(x)$의 그래프 위의 두 점 $A(a,f(a))$, $B(b,f(b))$를 지나는 직선의 방정식은 $y=\dfrac{f(b)-f(a)}{b-a}(x-a)+f(a)$이다.
이때 $g(x)=f(x)-\left\{\dfrac{f(b)-f(a)}{b-a}(x-a)+f(a)\right\}$라고 하면 함수 $g(x)$는 닫힌구간 $[a,b]$에서 연속이고 열린구간 $(a,b)$에서 미분가능하며 [빈칸]이다. 따라서 롤의 정리에 의하여 $g'(c)=0$인 $c$가 $a$와 $b$ 사이에 적어도 하나 존재한다.
그런데 $g'(x)=f'(x)-\dfrac{f(b)-f(a)}{b-a}$이므로 $g'(c)=f'(c)-\dfrac{f(b)-f(a)}{b-a}=0$이다. 즉 $\dfrac{f(b)-f(a)}{b-a}=f'(c)$인 $c$가 $a$와 $b$ 사이에 적어도 하나 존재한다.
~~~

## 원문 선택지 (원본 배열 순서, 정확 문자열)

~~~text
$f(a)=f(b)$
$f(a)=f(b)=0$
$g(a)=g(b)$
$g(a)=g(b)=0$
$f(a)=g(a)$
~~~

## 원문 정답 (정확 문자열)

~~~text
④
~~~

## 원문 해설 (정확 문자열)

~~~text
두 점 $A(a,f(a))$, $B(b,f(b))$를 지나는 직선을 빼어 만든 함수는
$g(x)=f(x)-\left\{\dfrac{f(b)-f(a)}{b-a}(x-a)+f(a)\right\}$이다.
$x=a$를 대입하면 $g(a)=f(a)-f(a)=0$이다.
$x=b$를 대입하면
$g(b)=f(b)-\left\{\dfrac{f(b)-f(a)}{b-a}(b-a)+f(a)\right\}$
$=f(b)-\{f(b)-f(a)+f(a)\}=0$이다.
따라서 $g(a)=g(b)=0$이고 정답은 ④이다.
~~~

## 보조 도식 범위

g=f−할선의 양 끝값이 0인 이유와 롤의 정리에서 나오는 a<c<b 관계를 기호 수직선으로 설명한다. 원문은 임의 함수의 일반 증명이며 실제 그래프 모양이나 유일한 c를 정하지 않는다.

요청 취지: 함수 관계가 이해에 조금이라도 도움이 되면 시각 자료를 계획한다. 이 네 초안은 주어진 관계만 정리하며 원문/정답/해설을 바꾸지 않는다. 수직선 라벨·간격 배치는 아직 렌더·검토하지 않아 가독성이나 리더 간격을 확인했다고 주장하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사, 엔진 검사, SVG/PNG 렌더, 시각 검토, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 지정된 초안 네 파일만 작성했다. 원문, 엔진, assets, triage/ledger, 보호 문항, 다른 패키지는 수정하지 않았다. 효천 ref 거부는 재시도하거나 우회하지 않았다.


## 정정 기록 (2026-11-09 UTC; 정적 스키마 검토)

- 정정 전 네 파일의 정확한 사본은 `preparation-20-maesan-math2/corrections/before-sourcequote/q13/`에 보존했다.
- 정적 검토에서 number-line-v1의 top-level 허용 키에 `sourceQuote`가 없음을 확인해 plan.json의 top-level `sourceQuote`만 제거했다. 원문 전체는 위 출처 기록에 그대로 남아 있다. 실제 checker 입력 검사는 실행하지 않았으며 validation은 NOT_RUN이다.
- 나머지 문항 근거와 수학 관계는 바꾸지 않았다. 렌더, 시각·독립 수학 검토, 원격 쓰기, publication, handoff는 NOT_RUN이다.

## 실제 bounded input checker 기록 (2026-11-08)

원본 보고서: `preparation-20-maesan-math2/checker/recheck/reports/node-results-2026-11-08T23-05-03-740Z.json`, `python-results-2026-11-08T23-05-03-740Z.json`, `run-summary-2026-11-08T23-05-03-740Z.json`. runId `2026-11-08T23-05-03-740Z`. source-exact.js source-main `bc47febaf592b4da9614b2695abc9e0851291f5b` 및 source hash evidence PASS (SHA-256 `2c96e6e1377388b8703caeadd140d30f0d8b2d5bf87d6f064cc6cc877c23be36`); 고정 JSON snapshot `48/48` frozen, SHA-256 `cc9f37ed2e9aa7a4a7fdded6a45214e668429523f4d236e316bf795519e4789a`. Node/Python bounded checker exit 0, 관련 input hashes 안정. 렌더·engine prepare/build·browser·CI·게시·handoff·외부 쓰기는 수행하지 않았고 overall math/visual assessment는 NOT_ASSESSED.

### Q13

범위 `number-line-figure-v1`. 기본 source/input binding 및 parse/publish 계약 (frozen_snapshot_binding, input_files, input_hash_unchanged_during_check, item_parse, publish_parse, plan_parse, item_source_binding, source_exact_binding, publish_fields, capability_dispatch) PASS. number-line `expandNumberLineFigure=PASS`, `top_level_sourceQuote_policy=PASS`. Graph `fit_overview/specFor`=NOT_RUN이며 Python graph semantic/viewport/axis/coordinate stages=NOT_APPLICABLE (이 문항은 number-line 입력으로 graph Python check 대상이 아님). stat-chart/solid-figure stages와 formal render=NOT_RUN. 이 PASS는 number-line input expansion 범위만 뜻한다.

