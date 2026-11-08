# 21 순천여고 고2 수학II Q18 로컬 입력 초안

## 원문 결속

`archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 18; exact source `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes; SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`; Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`); baseline main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`. `item.json` binds sourcePath and ordinal only.

## 요청 취지와 초안 범위

이해에 필요한 함수·관계 설명을 실제 capability의 지원 범위 안에서만 나타낸다. 구간 또는 상징적 순서가 필요한 문항은 number-line-figure-v1을, Q18은 해설 해석에 따른 정확한 보조 삼차식에 polynomial-spike-v1을 사용한다. sourceQuote는 number-line-figure-v1에서 금지되고 polynomial-spike-v1 plan에도 선언되지 않으므로 item/plan에 두지 않았으며 정확한 원문은 이 파일에 보존한다. coordinate leaders는 Q18의 실제 해설 극값에만 적용한다. Q09/Q10/Q14는 numberline 점·span만 쓰며 좌표 그래프의 여백/라벨 배치는 적용하지 않는다. Q18의 M,N 좌표 leaders는 해당 극값에만 연결하고, 실제 여백이나 라벨 충돌은 렌더 전이라 검토하지 않았다.

## 원문 문항 (content의 정확 문자열)

```text
함수 $f(t)=\dfrac{1}{2}t^3-\dfrac{3}{2}t^2+6$에 대하여 두 함수 $g(x),h(x)$가 다음과 같다.
$g(x)=\dfrac{d}{dx}\displaystyle\int_0^x f(t)\,dt$, $h(x)=\displaystyle\int_0^x\dfrac{d}{dx}f(t)\,dt$
방정식 $g(x)+h(x)=n$이 서로 다른 세 실근을 갖도록 하는 모든 정수 $n$값의 합은? [4.5점]
```

## 원문 선택지 (배열 순서 및 각 문자열 그대로)

```text
$23$
$19$
$15$
$12$
$-7$
```

## 원문 정답 (정확 문자열)

```text
④
```

## 원문 해설 (정확 문자열)

```text
미적분의 기본정리로 g(x)=d/dx∫_0^x f(t)dt=f(x),
h(x)=∫_0^x f'(t)dt=f(x)-f(0)이다.
f(0)=6이므로 g(x)+h(x)=2f(x)-6=x^3-3x^2+6.

p(x)=x^3-3x^2+6은 x=0에서 극댓값 6, x=2에서 극솟값 2를 갖는다.
수평선 y=n과 서로 다른 세 점에서 만나려면 2<n<6이다.
n=3,4,5이므로 합은 12. 정답은 ④이다.
```

## 보존된 미해결 사항

원문은 h(x)=∫_0^x (d/dx)f(t)dt로 적지만 해설은 h(x)=∫_0^x f'(t)dt로 계산한다. 이 discrepancy를 원문 텍스트 그대로 보존한다. 삼차 곡선 H는 원문 해설의 표기 해석에 따른 보조식일 뿐이며 원문 표기 수정이나 동치 증명이라고 표현하지 않는다. polynomial-spike-v1 plan은 x축과 곡선만 지원하므로 2<n<6 및 정수 n=3,4,5는 caption에 두고 numberline을 혼합하지 않는다.


## 상태 및 검증 한계

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. Author tests NOT_RUN; input validator NOT_RUN; engine preparation NOT_RUN; render/SVG/PNG NOT_RUN; visual review NOT_RUN; independent full math review NOT_RUN; CI NOT_RUN; publication and handoff NOT_RUN. No READY/PASS/render claim is made. Only the four requested draft files in this question folder were written. No source, engine, assets, ledger, package, protected Q08/Q16 inputs, protected PR #1528, or remote state was changed. The earlier reviewer-denied Hyocheon ref update was not retried or routed around.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; fit_overview=PASS; specFor=PASS; source_domain_preserved_during_fit=PASS.
실제 Python 단계: semantic_model.validate=PASS; exact_coordinate_per_coordinate_label=NOT_APPLICABLE_NO_COORDINATE_LABEL; engine_critical_construction=PASS; viewport.for_spec=PASS; engine_axis_tick_guard=PASS; fit_spec_tick_static_match=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.
원문의 d/dx f(t)와 해설 f′(t) 사이 표기 불일치는 수정하지 않았다. 보조함수 그림은 해설의 해석에 따른 조건부 그림이다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
