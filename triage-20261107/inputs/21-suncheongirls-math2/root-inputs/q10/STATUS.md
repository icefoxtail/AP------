# 21 순천여고 고2 수학II Q10 로컬 입력 초안

## 원문 결속

`archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js`, ordinal 10; exact source `preparation-21-suncheongirls-math2/source-exact.js` (43,099 bytes; SHA-256 `8d53a3c28486523b48d1de05c341347a07484f5bae8becd123f66a03f2e2e87b`; Git blob `6cc6649228f234957774cdc9c1ccedf196037d86`); baseline main `0135d49b3e4134c2fbc4fa12144a07c98eb49869`. `item.json` binds sourcePath and ordinal only.

## 요청 취지와 초안 범위

이해에 필요한 함수·관계 설명을 실제 capability의 지원 범위 안에서만 나타낸다. 구간 또는 상징적 순서가 필요한 문항은 number-line-figure-v1을, Q18은 해설 해석에 따른 정확한 보조 삼차식에 polynomial-spike-v1을 사용한다. sourceQuote는 number-line-figure-v1에서 금지되고 polynomial-spike-v1 plan에도 선언되지 않으므로 item/plan에 두지 않았으며 정확한 원문은 이 파일에 보존한다. coordinate leaders는 Q18의 실제 해설 극값에만 적용한다. Q09/Q10/Q14는 numberline 점·span만 쓰며 좌표 그래프의 여백/라벨 배치는 적용하지 않는다. Q18의 M,N 좌표 leaders는 해당 극값에만 연결하고, 실제 여백이나 라벨 충돌은 렌더 전이라 검토하지 않았다.

## 원문 문항 (content의 정확 문자열)

```text
수직선 위를 움직이는 점 $P$의 시각 $t$에서의 위치 $x(t)$의 그래프가 오른쪽 그림과 같을 때, 점 $P$에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은? [3.9점]
ㄱ. $0<t<c$에서 원점을 두 번 지난다.
ㄴ. $a<t<b$에서 한 방향으로만 움직인다.
ㄷ. $0<t<c$에서 운동 방향이 두 번 바뀐다.
```

## 원문 선택지 (배열 순서 및 각 문자열 그대로)

```text
ㄱ
ㄱ, ㄴ
ㄱ, ㄷ
ㄴ, ㄷ
ㄱ, ㄴ, ㄷ
```

## 원문 정답 (정확 문자열)

```text
①
```

## 원문 해설 (정확 문자열)

```text
그래프에서 x(t)=0인 시각은 a,b이고 모두 0<t<c에 있다.
ㄱ. 원점을 두 번 지난다. 참.

a<t<b에서 그래프는 최솟값을 지나므로 기울기는 음수에서 양수로 바뀐다.
ㄴ. 한 방향으로만 움직인다는 말은 거짓이다.

0<t<c에서도 방향이 바뀌는 시각은 그 최솟값에서 한 번뿐이다.
ㄷ. 방향이 두 번 바뀐다는 말은 거짓이다.

따라서 ㄱ만 참이므로 정답은 ①이다.
```

## 보존된 미해결 사항

원본 위치 그래프와 그 사실적 모양은 보존하며 재구성하지 않는다. 수직선은 출처의 상징적 시간 순서만 놓고, a,b가 0<t<c의 영점이며 a<t<b 안에 극소 시각이 있다는 관계만 표시한다. a,b,극소 시각의 수치 좌표·간격·위치 높이·곡선 형태는 추정하지 않는다.


## 상태 및 검증 한계

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. Author tests NOT_RUN; input validator NOT_RUN; engine preparation NOT_RUN; render/SVG/PNG NOT_RUN; visual review NOT_RUN; independent full math review NOT_RUN; CI NOT_RUN; publication and handoff NOT_RUN. No READY/PASS/render claim is made. Only the four requested draft files in this question folder were written. No source, engine, assets, ledger, package, protected Q08/Q16 inputs, protected PR #1528, or remote state was changed. The earlier reviewer-denied Hyocheon ref update was not retried or routed around.


## 주입력 동결본 실제 검사 집계

현재 주입력 상태: **APPLICABLE_INPUT_FUNCTIONS_PASS / LOCAL_ONLY / DRAFT_ONLY / NOT_READY**. 실행 2026-11-08T21-13-58-934Z. 이전 NOT_RUN 및 실패는 당시 기록으로 유지하며, 이 집계가 현재 주입력 결과다.

실제 Node 단계: frozen_snapshot_binding=PASS; input_files=PASS; input_hash_unchanged_during_check=PASS; item_parse=PASS; publish_parse=PASS; plan_parse=PASS; item_source_binding=PASS; source_exact_binding=PASS; publish_fields=PASS; capability_dispatch=PASS; expandNumberLineFigure=PASS; top_level_sourceQuote_policy=PASS.
현재 item/plan/publish SHA-256은 해당 검사 동결본과 검사 전후 값이 모두 일치한다.

기준 원문 main0135d49b3e4134c2fbc4fa12144a07c98eb49869를 보존했다. 최신 확인 main455e585ac3ab6076fcd133a59043feb2a4af7861와 대조해 OPEN16개 원문 행 및 엔진 코드가 같음을 확인했다. Q08/Q16 기존 SVG·원문 연결은 PR1528 병합 후 main에서 확인했고 변경하지 않았다. 전체 engine.prepare/build, render/SVG/PNG, browser/visual review, 독립 전체 수학 검토, CI, publication, handoff는 NOT_RUN이다. 원격 쓰기0회이며 효천 ref 거절을 재시도·우회하지 않았다.
