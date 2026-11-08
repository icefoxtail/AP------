# 21 순천여고 고2 수학II Q09 로컬 입력 초안

## 원문 결속

`archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 9; exact source `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes; SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`; Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`); baseline main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`. `item.json` binds sourcePath and ordinal only.

## 요청 취지와 초안 범위

이해에 필요한 함수·관계 설명을 실제 capability의 지원 범위 안에서만 나타낸다. 구간 또는 상징적 순서가 필요한 문항은 number-line-figure-v1을, Q18은 해설 해석에 따른 정확한 보조 삼차식에 polynomial-spike-v1을 사용한다. sourceQuote는 number-line-figure-v1에서 금지되고 polynomial-spike-v1 plan에도 선언되지 않으므로 item/plan에 두지 않았으며 정확한 원문은 이 파일에 보존한다. coordinate leaders는 Q18의 실제 해설 극값에만 적용한다. Q09/Q10/Q14는 numberline 점·span만 쓰며 좌표 그래프의 여백/라벨 배치는 적용하지 않는다. Q18의 M,N 좌표 leaders는 해당 극값에만 연결하고, 실제 여백이나 라벨 충돌은 렌더 전이라 검토하지 않았다.

## 원문 문항 (content의 정확 문자열)

```text
키가 $2\,\mathrm{m}$인 진우가 지상으로부터의 높이가 $5\,\mathrm{m}$인 가로등 바로 밑에서 출발하여 일직선으로 초속 $1.5\,\mathrm{m}$로 걷고 있다. 출발한 지 $t$초 후의 가로등 바로 밑에서부터 민기의 그림자 끝까지의 거리를 $x\,\mathrm{m}$라 하자. 그림자의 끝이 움직이는 속도는? [3.9점]
```

## 원문 선택지 (배열 순서 및 각 문자열 그대로)

```text
$\dfrac{1}{2}$
$1$
$\dfrac{3}{2}$
$2$
$\dfrac{5}{2}$
```

## 원문 정답 (정확 문자열)

```text
⑤
```

## 원문 해설 (정확 문자열)

```text
출발 후 t초 동안 진우가 걸은 거리를 s=1.5t라 하자.
가로등에서 그림자 끝까지의 거리가 x이므로 사람과 그림자 길이는 x-s이다.

큰 삼각형과 작은 삼각형은 닮음이므로
5/x=2/(x-s).
정리하면 5x-5s=2x, 따라서 x=(5/3)s이다.
dx/dt=(5/3)·1.5=5/2 m/s.
정답은 ⑤이다. 원본 그림은 인쇄물 위 필기와 겹쳐 source-image HOLD로 보존한다.
```

## 보존된 미해결 사항

발문은 보행자를 “진우”라 하고, 그림자 끝을 “민기”의 그림자라고 적는다. 해설도 두 표현을 함께 가진다. 초안은 이름을 통일하지 않고 인물 표기를 추가하지 않는다. 원본 이미지 `assets/images/21_순천여고_2학기_기말_고2_수학II/q9.png`는 필기 겹침으로 source-image HOLD 상태를 유지하며 고치거나 정리하지 않았다. 수직선은 해설이 정의한 0<s<x의 지면 거리와 x-s만 나타내며, 닮음 삼각형이나 미제공 거리 비율/실제 도면은 만들지 않는다.


## 상태 및 검증 한계

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. Author tests NOT_RUN; input validator NOT_RUN; engine preparation NOT_RUN; render/SVG/PNG NOT_RUN; visual review NOT_RUN; independent full math review NOT_RUN; CI NOT_RUN; publication and handoff NOT_RUN. No READY/PASS/render claim is made. Only the four requested draft files in this question folder were written. No source, engine, assets, ledger, package, protected Q08/Q16 inputs, protected PR #1528, or remote state was changed. The earlier reviewer-denied Hyocheon ref update was not retried or routed around.


## 현재 부분도 범위 정정 (이전 본문은 작성 당시 이력)

발문은 보행자를 “진우”라 하고, 그림자 끝을 “민기”의 그림자라고 적는다. 해설도 두 표현을 함께 가진다. 초안은 이름을 통일하지 않고 인물 표기를 추가하지 않는다. 원본 이미지 `assets/images/21_순천여고_2학기_기말_고2_수학II/q9.png`는 필기 겹침으로 source-image HOLD 상태를 유지하며 고치거나 정리하지 않았다. 수직선은 해설의 상징적 제약 0<s<x 아래 s와 x의 순서 및 x-s 구간만 나타내며, 원점 0은 숫자 점으로 그리지 않는다. s=1.5t는 정확한 해설 인용과 캡션에 남긴다. 닮음 삼각형이나 미제공 거리 비율/실제 도면은 만들지 않는다.

## Frozen first-run history and minimal correction

First frozen actual run: `2026-11-08T21-13-58-934Z`; all 48 frozen inputs were hash-stable. Q09 `expandNumberLineFigure` failed with `NUMBER_LINE_SPAN_POINT_UNKNOWN` because the O→s span referenced the numeric origin point removed in the symbolic-only correction. The exact four-file first-freeze snapshot is preserved at `preparation-21-suncheongirls-math2/corrections/before/q09/` and was reported to match that freeze.

Minimal correction: removed only the unsupported O→s span. The supported x-s span remains; s=1.5t and the origin relation 0<s<x remain in the caption/source constraint, with no fabricated numeric origin point or metric spacing.

After correction, author test, input validator/expandNumberLineFigure, engine preparation, render, visual review, and independent full math review are NOT_RUN. Draft remains LOCAL_ONLY / DRAFT_ONLY / NOT_READY; no PASS or READY claim is made.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-25-47-694Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; expandNumberLineFigure=PASS; top_level_sourceQuote_policy=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.
첫 실제 실패와 변경 전 네 파일은 preparation-21-suncheongirls-math2/corrections/before/에 보존했다. 필요한 입력만 최소 정정하고 한 차례 재검사했다.
진우/민기 이름 불일치와 원본 필기 겹침 HOLD는 해소되지 않았다. 그림은 기호의 지면상 순서와 그림자 구간만 다루며 실제 닮음 삼각형 전체는 미표현이다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
