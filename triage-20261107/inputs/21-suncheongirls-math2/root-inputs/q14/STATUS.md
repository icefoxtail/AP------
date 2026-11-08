# 21 순천여고 고2 수학II Q14 로컬 입력 초안

## 원문 결속

`archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 14; exact source `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes; SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`; Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`); baseline main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`. `item.json` binds sourcePath and ordinal only.

## 요청 취지와 초안 범위

이해에 필요한 함수·관계 설명을 실제 capability의 지원 범위 안에서만 나타낸다. 구간 또는 상징적 순서가 필요한 문항은 number-line-figure-v1을, Q18은 해설 해석에 따른 정확한 보조 삼차식에 polynomial-spike-v1을 사용한다. sourceQuote는 number-line-figure-v1에서 금지되고 polynomial-spike-v1 plan에도 선언되지 않으므로 item/plan에 두지 않았으며 정확한 원문은 이 파일에 보존한다. coordinate leaders는 Q18의 실제 해설 극값에만 적용한다. Q09/Q10/Q14는 numberline 점·span만 쓰며 좌표 그래프의 여백/라벨 배치는 적용하지 않는다. Q18의 M,N 좌표 leaders는 해당 극값에만 연결하고, 실제 여백이나 라벨 충돌은 렌더 전이라 검토하지 않았다.

## 원문 문항 (content의 정확 문자열)

```text
닫힌구간 $[0,2]$에서 연속인 함수 $f(x)$가 $f(0)=0$, $f(2)=2$, $\displaystyle\int_0^2 f(x)\,dx=\dfrac{1}{4}$를 만족시킨다. 실수 전체의 집합에서 정의된 함수 $g(x)$가 다음 조건을 만족시킬 때, $\displaystyle\int_{-4}^2 g(x)\,dx$의 값은? [4.1점]
(가) $g(x)=\begin{cases}-f(x+2)+2&(-2<x<0)\\f(x)&(0\le x\le2)\end{cases}$
(나) 모든 실수 $x$에 대하여 $g(x+4)=g(x)$이다.
```

## 원문 선택지 (배열 순서 및 각 문자열 그대로)

```text
$\dfrac{5}{4}$
$\dfrac{9}{4}$
$\dfrac{17}{4}$
$\dfrac{19}{4}$
$\dfrac{23}{4}$
```

## 원문 정답 (정확 문자열)

```text
③
```

## 원문 해설 (정확 문자열)

```text
한 주기의 적분을 구한다. 0≤x≤2에서 ∫_0^2g(x)dx=1/4.

-2<x<0에서 g(x)=-f(x+2)+2이므로
∫_-2^0g(x)dx=-∫_0^2f(u)du+4=-1/4+4=15/4.
따라서 한 주기 적분은 ∫_0^4g(x)dx=1/4+15/4=4.

주기 4를 이용하면
∫_-4^2g(x)dx=∫_-4^0g(x)dx+∫_0^2g(x)dx=4+1/4=17/4.
정답은 ③이다.
```

## 보존된 미해결 사항

원문은 f의 실제 곡선을 지정하지 않는다. 수직선에는 통합 범위, 주기 4의 [-4,0], 원문 해설의 ∫_-2^0g=15/4 및 ∫_0^2g=1/4만 표시하고 함수 그래프, 곡선의 부호 모양, 임의 면적 도형은 넣지 않는다.


## 상태 및 검증 한계

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. Author tests NOT_RUN; input validator NOT_RUN; engine preparation NOT_RUN; render/SVG/PNG NOT_RUN; visual review NOT_RUN; independent full math review NOT_RUN; CI NOT_RUN; publication and handoff NOT_RUN. No READY/PASS/render claim is made. Only the four requested draft files in this question folder were written. No source, engine, assets, ledger, package, protected Q08/Q16 inputs, protected PR #1528, or remote state was changed. The earlier reviewer-denied Hyocheon ref update was not retried or routed around.


## 현재 부분도 범위 정정 (이전 본문은 작성 당시 이력)

원문은 f의 실제 곡선을 지정하지 않는다. 수직선에는 통합 범위, 주기 4의 [-4,0], 그리고 왼쪽·오른쪽 하위 구간만 표시한다. 원문 해설의 ∫_-2^0g=15/4 및 ∫_0^2g=1/4는 캡션/상태에 보존하고 span label에는 쓰지 않는다. 함수 그래프, 곡선의 부호 모양, 임의 면적 도형은 넣지 않는다.

## Frozen first-run history and minimal correction

First frozen actual run: `2026-11-08T21-13-58-934Z`; all 48 frozen inputs were hash-stable. Q14 `expandNumberLineFigure` failed with `NUMBER_LINE_SPAN_LABEL_INVALID`: span labels `주기 4`, `15/4`, and `1/4` are outside the actual span-label grammar (`SPAN_LABEL_TEXT` accepts Hangul text, while `SPAN_LABEL_MATH` accepts only `[A-Za-z0-9=+\-<>.,()]` up to 12 characters). The exact four-file first-freeze snapshot is preserved at `preparation-21-suncheongirls-math2/corrections/before/q14/` and was reported to match that freeze.

Minimal correction: replaced the three unsupported span labels with pure Hangul `한주기`, `왼쪽`, and `오른쪽`. The exact bounds and integral values 15/4 and 1/4 remain in the plan caption and this status text; they are not represented as span labels.

After correction, author test, input validator/expandNumberLineFigure, engine preparation, render, visual review, and independent full math review are NOT_RUN. Draft remains LOCAL_ONLY / DRAFT_ONLY / NOT_READY; no PASS or READY claim is made.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-25-47-694Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; expandNumberLineFigure=PASS; top_level_sourceQuote_policy=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.
첫 실제 실패와 변경 전 네 파일은 preparation-21-suncheongirls-math2/corrections/before/에 보존했다. 필요한 입력만 최소 정정하고 한 차례 재검사했다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
