# 해설 그림 plan 작성 → 렌더 (지정 문항만)

AP Math SVG 엔진으로 기출 문항의 **해설 그림**을 만든다. 너는 문항마다 `plan.json`을 쓰고 렌더러를 돌려 `ARCHIVE_BOUND`가 나올 때까지 고친다. 엔진 코드는 고치지 않는다.

## 입력
- 문항 묶음: `{PACKET}` (각 항목 `ord, content, choices, answer, solution, questionImage`). 대상 문항과 그림 아이디어: `{TARGETS}`.
- **먼저** 팁: `/home/user/AP------/.tmp/svg-m1/guide/guide-tips.md`(짧음, 자주 놓친 기존 기능).
- 작성 지침(이것만 읽는다): `/home/user/AP------/.tmp/svg-m1/guide/guide-core.md` + 대상 family 발췌본 `/home/user/AP------/.tmp/svg-m1/guide/guide-<plane|solid|stat|graph>.md`.
- 견본 plan(실제로 ARCHIVE_BOUND된 정답지): `/home/user/AP------/archive/tools/geometry-equation/ops/golden/itemNN/plan.json`
  - 평면도형·표식: item27(작도 흔적), item44(평행선·각·° 라벨), item19(각·호), item36(여러 도형 패널)
  - 영역 색칠: item20, item39(두 원 호), item46(빗금·(가)(나))
  - 입체: item22, item26, item42 / 통계: item21, item41 / 좌표 위 작도: item35, item01
- 필드 이름·허용값이 헷갈리면 계약 전문을 **grep으로 필요한 줄만** 찾아본다: `/home/user/AP------/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`의 "## plan 계약 전문" 절(파일 전체를 읽지 않는다).

## 문항마다 할 일 (`{RUN}/q<ord>/` 폴더에서)
1. questionImage PNG를 Read로 보고, content·solution을 읽어 **그림이 보여 줄 관계·이름·값**을 먼저 정한다(문제 그림의 점 이름·배치를 따른다; 풀이가 쓰는 보조선·값만 더한다; 최종 정답 값을 그림에 새로 적지 않는다; 문제·풀이에 없는 점 이름·변수(t, u, β, r, h, a 등)를 지어 쓰지 않는다 — 이름 없는 각은 호 표식으로, 길이 라벨은 그 길이를 재는 선분·호에 붙인다).
2. `item.json` = `{"sourcePath":"{SOURCE}","ordinal":<ord>}` 과 `plan.json`(지침 7절 출력 형식: caption, sourceConditions, newVisualInformation 포함; 통계 capability는 3-43절의 다섯 키 규칙)을 쓴다.
3. 렌더(저장소 루트에서, 한 번에 하나씩):
   `cd /home/user/AP------ && timeout 900 node archive/tools/geometry-equation/production/render-plan.mjs --item {RUN}/q<ord>/item.json --plan {RUN}/q<ord>/plan.json --out {RUN}/q<ord>/out > {RUN}/q<ord>/render.log 2>&1; tail -c 400 {RUN}/q<ord>/render.log`
   결과는 `{RUN}/q<ord>/out/figure-result.json`의 `status`(ARCHIVE_BOUND / FAILED+stage+detail).
4. FAILED면 detail의 오류 코드로 지침 6절과 해당 절을 보고 plan을 고쳐 다시 렌더한다. **렌더는 문항당 최대 5번.** `ARCHIVE_PREFLIGHT_FAIL`(readiness/timeout), `QUESTION_IMAGE_READINESS_INCOMPLETE`, `WORKER_TIMEOUT`은 부하 때문일 수 있으니 같은 plan을 한 번 더 돌린다(횟수에 안 셈).
5. ARCHIVE_BOUND가 나오면 PNG로 바꿔 한 번 본다:
   `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs {RUN}/q<ord>/out/figure-solution.svg {RUN}/q<ord>/figure.png 520`
   문제 그림·풀이와 어긋나면(이름·값·관계 틀림, 핵심 요소 빠짐, 글자 겹침) 고쳐서 다시 렌더한다(5번 한도 안).
6. `{RUN}/q<ord>/publish.json` = `{"alt":"그림이 보여 주는 것 한두 문장(구체적, 한국어)","caption":"한 문장","size":"medium"}`.
7. 5번 안에 안 되면 멈추고 마지막 오류를 기록한다. 엔진이 표현 못 하는 것이면 `UNSUPPORTED`로 이유를 쓴다(가짜로 비슷한 다른 그림을 만들지 않는다).
8. **엔진 공백 보고(중요):** 풀이에 필요한데 엔진이 표현 못 하는 요소(예: 특정 변 강조, 번호 라벨, 괄호 표시)는 지금 그릴 수 있는 정직한 부분만 그리고 summary의 notes에 `GAP: <없는 기능을 한 줄로, 어떤 필드가 있으면 되는지>`로 정확히 쓴다. 관리자가 이것으로 엔진을 확장한 뒤 다시 그린다. 먼저 지침에서 그 기능이 이미 있는지 확인한다(예: 입체 `names`의 `.`은 이름 없는 꼭짓점, `highlights`·`segments` role).

## 출력
`{RUN}/summary.json` = `[{"ord":N,"status":"ARCHIVE_BOUND|FAILED|UNSUPPORTED","renderAttempts":n,"lastError":"...","svg":"절대경로","png":"절대경로","notes":"40자 이내"}]`

## 금지 (반드시)
- `{RUN}` 폴더 밖에 파일을 쓰거나 고치지 않는다(저장소 파일·시험지 JS·엔진 코드·정답지 포함). git 명령, 테스트, 패키지 설치, 다른 에이전트 호출 금지.
- 네가 띄우지 않은 프로세스를 종료하지 않는다. 렌더는 순서대로 하나씩.
- 최종 답장은 8줄 이내: 문항별 상태와 렌더 횟수만.

- 문자 매개변수(a, n 등)를 예시 수로 바꿔 그리지 않는다. 풀이가 "두 끝점이 같다", "해가 3개" 같은 조건으로 값을 정하면, 그 조건이 성립하는 위치에 문자 라벨만 단 점(값 숨김)을 둔다. 예시 수가 꼭 필요하면 문제 조건을 만족하고 정답과 다른 값이어야 한다.
- 렌더 실패 뒤 같은 plan을 다시 돌릴 때는 out/을 지우고 돌린다(남아 있으면 POLICY_PROVENANCE_MISMATCH).
- **라벨·치수선 배치가 실패하거나 오독될 때는 그 선분·각을 끌어내 따로 크게 보이는 방법을 먼저 쓴다(적극 권장).** LAYOUT_INVENTORY_INCOMPLETE, DIMENSION_CROSSES_STROKE, 좁은 꼭짓점(20° 안팎)·짧은 선분·몰린 각 때문에 라벨이 다른 조각에 붙어 읽히는 경우: 합성 2패널로 왼쪽은 원래 도형(관계 표식만), 오른쪽은 문제의 선분(예: C–G–D)이나 각만 같은 점 이름으로 펴서 크게 다시 그리고 거기에 치수선 단(offset AUTO)·각 라벨을 둔다. 예: /home/user/AP------/.tmp/svg-m1/examples/q6-segment-pullout-plan.json. 엔진에 planeMarks.callouts(E37)가 들어오면 그 필드를 쓴다. 라벨을 지우거나 캡션으로 빼는 것보다 이것이 먼저다.
