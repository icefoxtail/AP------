# 골든 동일성 게이트 (golden-gate)

엔진을 고칠 때 "통과하던 그림이 안 바뀌었다"를 이 PC에서 증명한다. 골든 plan 209개를 **같은 PC·같은 Chrome**에서 base와 head로 렌더해 SVG를 바이트로 비교한다. 해시표·기준 SVG는 저장소에 커밋하지 않는다(PC가 바뀌면 글자 폭이 달라져 기준이 무의미하므로 매번 base를 같은 PC에서 만든다).

## 명령

```
node archive/tools/geometry-equation/ops/golden-gate/golden-gate.mjs --base origin/main
node .../golden-gate.mjs --base <ref> --head <ref|@worktree> --families auto|all|stat,solid|item21 --expected 의도.txt --tests
```

- `--base` 필수. 브랜치가 main보다 뒤처졌으면 `$(git merge-base origin/main HEAD)`를 쓴다(안 그러면 main의 새 커밋이 head의 변경처럼 보인다).
- `--head` 기본은 작업 트리(커밋 안 한 변경 포함). 커밋·브랜치도 된다.
- `--families auto`(기본): 바뀐 파일 -> 닿는 종류만 렌더. 공용 파일(render-plan, worker, phase2, label_layout 등 visual_engine, pipeline-core, 측정·정책, Archive 쪽 페이지 코드)이거나 **표에 없는 엔진 파일이면 209 전체**. `all`, 종류 이름(`stat set solid number-line chain composite ellipse container lattice graph construction`), capability 이름, 골든 `fam` 이름, 항목 이름(`item21`)도 된다. `--list`는 고른 항목만 출력하고 끝낸다.
- `--expected <파일>`: 의도한 변경 목록. 한 줄에 `항목 DIFFERENT|FIXED|REGRESSED 이유`(이유 10자 이상 필수, `#` 주석 가능). 이유 없는 줄은 오류다. 줄에 적힌 항목은 항상 비교하고, 실제로 바뀌지 않은 줄이 있으면 실패한다. 인정된 줄은 출력에 `EXPECTED ... <= expected: 이유`로 드러난다.
- `--tests [auto|all]`: 엔진의 node(`*.test.mjs`)·python(`tests/test_*.py`, unittest) 테스트를 base와 head에서 돌려 **head에서만 실패한 이름**을 실패로 센다. 양쪽 모두 실패한 것은 "existing failure"로 그대로 출력한다(건너뛰기·격리 없음; 스냅샷에 없는 저장소 파일이 필요한 테스트는 양쪽에서 같이 실패해 이 목록에 보인다). `auto`는 import 닫힘이 바뀐 파일에 닿거나(render-plan을 거치는 길은 따라가지 않음) 바뀐 종류의 capability·모듈 이름이 본문에 나오는 테스트만, 공용 파일이 바뀌면 전부.
- `--repeat-check`: head를 두 번(순서를 뒤집고 묶음 크기를 바꿔) 렌더해 흔들림을 확인한다.
- `--no-cache`: 캐시를 읽지 않고 양쪽을 새로 렌더(base=head여도 두 번 따로 렌더해 비교).
- 종료 코드: **0 통과**(바이트를 비교했고 실패가 없음) 또는 **0 UNAFFECTED**(아래), **1 실패**(DIFFERENT·REGRESSED·NOT_RUN·REMOVED, `--expected` 파일 오류, 테스트 신규 실패·소실), **2 보증 못 함**(바뀐 게 없음(base=head 포함), 선택이 비었음(빈 `--families`·모르는 단어·고른 항목 0개), 바이트를 하나도 못 비교함, 바뀐 종류에 비교된 항목이 0개(NOT_COVERED), 분류 오류, 인자·의존성 없음). 종료 코드는 `lib/judge.mjs`의 `decide()` 한 곳에서 정한다.
- **UNAFFECTED (nothing compared)**: 바뀐 파일이 있고 전부 렌더와 무관(문서·테스트 등)이며, base와 head의 공용 키(commonKey)와 모든 항목 키(itemKey)가 같을 때만 exit 0이다. "통과"라고 쓰지 않는다. 이 게이트가 PASS라고 말하면 실제로 비교한 것이다.
- 선택은 git 파일 이름 분류에 **base와 head에서 항목 자체 입력(plan, 시험지 JS, 그 시험지가 가리키는 모든 이미지, 다른 시험지 폴더의 이미지 포함)이 다른 항목**을 합친다. 이름만으로는 안 보이는 다른 폴더 이미지 변경(예: 25_매산여고 q23.png)도 해당 항목이 선택된다.
- `--repo <폴더>`: 다른 저장소(테스트용 임시 저장소)에서 돌린다. 기본은 이 저장소.
- 출력 첫 줄은 `byte compared N / selected M`이다. 선택한 M개 중 양쪽이 SVG를 내서 바이트를 비교한 것이 N개다. N이 0이면 통과가 아니다(전부 같은 실패로 끝난 날 초록이 되지 않게). 실패를 허용하는 목록 파일은 없다.

## 판정

| 판정 | 뜻 | 게이트 |
|---|---|---|
| SAME | SVG 바이트(와 sizeClass, solutionImageScale)가 같다 | 통과 |
| DIFFERENT | 바이트·크기값이 바뀜, 또는 실패 코드가 바뀜 | **실패** |
| REGRESSED | base는 그려졌는데 head는 실패(거절) | **실패** |
| NOT_RUN | 실행 못 함 또는 믿을 수 없음: 프로세스 죽음, 시간 초과(단독 재실행 2번 뒤에도), **환경 오류**(문제 그림·페이지·모듈 로드 실패 `QUESTION_IMAGE_LOAD_FAILED`·`PAGE_RENDER_ERROR`·`ENOENT`, 브라우저 실행 실패 등: 양쪽이 같아도), 스냅샷에 저장소에 있는 자산이 없음, 코드 없는 실패 | **실패** |
| FIXED | base 실패 -> head 통과 | 목록만 |
| BOTH_FAIL_SAME | 양쪽이 **같은 실패**(code, stage, 중첩 status까지 같음) | 목록만 |
| REMOVED | 골든 항목이 base에만 있다(분모가 줄었다) | **실패** |
| ADDED | 골든 항목이 head에만 있다(비교할 base 없음) | 목록만 |

FIXED와 BOTH_FAIL_SAME도 분모에서 빼지 않고 개수를 그대로 출력한다. 부하 때문에 나는 시간 초과(WORKER_TIMEOUT 등)는 그 항목만 단독으로 다시 돌린다(최대 2번, "solo retries"로 출력). 내용 실패는 다시 돌리지 않는다.

## 어떻게 돌리나

- worktree를 만들지 않는다. base/head가 읽는 파일(엔진, pipeline-core, 렌더가 측정하는 Archive 페이지, 골든 plan, 대상 시험지와 그 시험지의 **자산 폴더 전부(PNG·JPG·SVG 등 확장자 무관)**, 시험지 JS가 이름으로 부른 다른 폴더의 이미지)만 `git archive`(작업 트리는 복사)로 캐시 폴더의 `snapshots/`에 푼다. 렌더는 그 폴더 안에서 돌고 체크아웃은 건드리지 않는다. 의존성(`.tmp/apmath-visual-engine/dependencies`)은 junction으로 연결한다.
- 렌더는 production 실행기 그대로(`render-plan.mjs --manifest`)다. 한 프로세스가 항목 여러 개를 맡아 Chrome·python을 재사용한다. 순서·묶음에 결과가 달라지지 않는지는 `--repeat-check`가 확인한다.
- 결과 캐시(항목별): 키 = 렌더 입력 파일 해시(엔진·공용 코드·종류 파일) + 그 항목의 plan·시험지 JS·게시된 SVG 해시 + 환경 지문(Chrome 버전, 글꼴 NotoSansKR 해시, Node, Python과 sympy·mpmath 등 패키지, playwright 버전, OS). 하나라도 달라지면 새로 렌더한다. 같은 base로 다시 돌리면 base는 캐시에서 나온다.
- 결과 캐시 키에는 **환경 지문(Chrome·글꼴·Node·Python 패키지·OS)**이 들어 있고, 스냅샷 키에는 **종류 표 버전(KINDS_VERSION)**이 들어 있다. 종류 표가 바뀌면 옛 키를 다시 쓰지 않는다. 스냅샷은 프로세스 전용 임시 폴더(`.part`)에 만든 뒤 이름을 바꿔 자리에 놓으므로 다른 프로세스가 짓는 중인 폴더는 지우지 않고, 렌더 슬롯 잠금은 소유자 확인 뒤에만 푼다. `--tests`에서 base에서 통과하던 테스트가 head에서 skip되거나 사라져도 실패다(LOST TEST).
- 환경변수(개인 경로를 코드에 박지 않는다): `GOLDEN_GATE_CACHE`(기본 `<저장소>/.tmp/golden-gate-cache`, C 드라이브 여유가 적으면 D로), `RENDER_LOCK_DIR`(다른 렌더 작업자와 슬롯을 공유할 폴더), `RENDER_SLOTS`(기본 1; `--slots`), `GOLDEN_GATE_DEPS`, `GEOMETRY_BROWSER_EXECUTABLE`, `GEOMETRY_PYTHON`. 자식 프로세스의 TEMP/TMP는 캐시 폴더 안으로 돌린다.
- 렌더 슬롯 잠금: `render.mjs`와 같은 `render.lock.<n>` 디렉터리를 `RENDER_LOCK_DIR`에서 잡고(30초마다 갱신) 한 묶음이 끝나면 놓는다. 다른 작업자가 쓰는 폴더를 가리키면 그 슬롯 수를 함께 지킨다.
- 이어 돌기: 항목마다 결과를 저장하므로 중단돼도 끝낸 항목은 캐시에서 나오고 나머지만 돈다. 프로세스가 죽거나 시간이 지나면 끝낸 항목을 거두고 나머지는 단독 재실행한다.
- 정리: 작업 트리 스냅샷은 하루, 커밋 스냅샷은 2주 안 쓰면 다음 실행 때 지운다. 엔진이 남기는 `.tmp/archive/<runId>`는 한 시간 지난 것을 지운다.

## 걸리는 시간과 현황 (2026-11-23 실측, 커밋 d414970fd2, 이 PC, 슬롯 2, 묶음 10개, 새 캐시)

- **209 전체, 한쪽 렌더: 40분 49초**(렌더 39분 53초, 21묶음, 단독 재실행 0, 시간 초과 0). 항목 하나는 보통 15~30초이고 오래 걸리는 것은 1~2분이다. 두 쪽을 새로 돌리면 이 시간의 두 배다. 캐시가 모두 맞으면 2초(209개 모두 캐시에서).
- 결과: **그림이 나온 것(ARCHIVE_BOUND) 146개, 엔진이 거절한 것 63개, 실행 못 한 것(NOT_RUN) 0개.** 거절 63개의 코드별 개수: LAYOUT_INVENTORY_INCOMPLETE 18, UNSUPPORTED_DISPLAY_ENVELOPE 16, STAT_LABEL_OUT_OF_BOUNDS 6, ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL 5(수식을 페이지가 조판하지 못함, MATH_TYPESET_ERROR), NUMBER_LINE_LABEL_TOO_LARGE 4, TEXT_CLIPPED 2, SOLID_LABELS_NO_ROOM 2, TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL 2, 그 밖에 코드마다 1개씩 8종(NUMBER_LINE_LABELS_TOO_CLOSE, PIECEWISE_DISCONTINUOUS_FIELD_UNKNOWN:axisSqueeze, CONTAINER_LABEL_OUT_OF_BOUNDS, MARK_LEADER_NOT_ON_OWNER, SOLID_DIM_FAR_FROM_SEGMENT, OVERLAY_LINE_OUTSIDE_VIEWPORT:h, COORDINATE_LEADER_PANEL_CONFLICT, SET_ELEMENT_NO_ROOM). 이 63개는 "같은 실패가 계속된다"만 확인한다(BOTH_FAIL_SAME). 바이트 비교는 146개에서 한다.
- 종류별 렌더 시간(이 한 번의 실행, 항목 수, 한 번 렌더 평균): graph 58개 33초, construction 55개 21초, stat 23개 16초, solid 21개 13초, composite 20개 22초, number-line 11개 12초, ellipse 9개 20초, set 8개 15초, lattice 2개 10초, container 1개 7초, chain 1개 2분. 이 표는 수치 하나의 어림이다(한 번 측정, 다른 작업이 함께 돌면 흔들린다).
- 종류 하나(stat 23개): head 한쪽만 새로 렌더하면 3분 27초, base가 캐시에 있으면 전체 4분 8초.
- 같은 스냅샷을 순서를 뒤집고 묶음을 바꿔 두 번(`--repeat-check --no-cache`) 렌더한 표본 28개: 11분 5초, 바이트 같음 16, 같은 실패 12, 흔들림 0.
- 스냅샷이 전체 체크아웃과 같은지: 실패 코드마다 대표 1개(16종)와 그림이 나온 1개를 전체 체크아웃에서 production `render-plan.mjs`로 직접 렌더해 게이트의 결과와 비교했다. 17개 모두 같은 code, stage, 실패 신호, SVG 바이트였다(렌더 237초).
- `--tests`: stat 변경 하나에 테스트 58개 파일을 base·head 모두 돌려 32분(슬롯 2, 2026-11-22 측정, 이번에 다시 재지 않았다).


## 못 막는 것 (한계)

- 골든 209개 중 63개(30%)는 이 커밋의 엔진도 거절한다(BOTH_FAIL_SAME). 그 항목은 "같은 실패가 계속된다"만 확인하고 그림 바이트는 못 본다. 종류별로 보면 container는 1개뿐인데 그것이 그림이 안 나와 container 변경은 바이트로 보증하지 못한다(실행 끝에 `note: no byte comparison for kind(s) ...`로 알린다).
- 수식 조판 실패(MATH_TYPESET_ERROR)는 플랜 내용에 대한 엔진 판정으로 보고 환경 오류로 세지 않는다(같은 값이 전체 체크아웃에서도 나온다). 그 밖의 PAGE_RENDER_ERROR는 계속 환경 오류(NOT_RUN)다.
- 종류 표(`lib/kinds.mjs`)는 "이 파일은 이 종류만 바꾼다"는 판단이다. `golden-gate.test.mjs`가 표에 빠진 파일, 표와 import 관계가 어긋난 파일을 잡는다. 확신이 없으면 표에 넣지 말고 그대로 두면 전체(209)가 돈다.
- 렌더가 `import` 아닌 방식으로 읽는 데이터 파일은 `lib/snapshot.mjs`의 `SNAPSHOT_SPECS`에 있어야 한다. 빠지면 렌더가 `ENOENT`로 죽어 NOT_RUN으로 보이고, 죽은 이유가 stderr 줄로 출력된다.
- 같은 PC의 같은 Chrome으로만 비교한다. 다른 PC의 결과와 바이트를 맞추려 하지 않는다.
