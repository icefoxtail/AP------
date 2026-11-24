# 골든 게이트 (golden-gate): 학생 화면이 깨지는가

엔진을 고칠 때 **학생이 보는 그림이 깨졌는지**만 이 PC에서 확인한다(2026-11-24 원장님: "변화를 막는 고정은 깬다, 고정은 진짜 필요한 하나만"). 골든 plan을 **같은 PC·같은 Chrome**에서 base와 head로 렌더해 비교한다. 예전처럼 "바이트가 같은가"로 막지 않는다. 엔진이 좋아져 그림이 달라지는 것은 실패가 아니라, 달라진 쌍을 나란히 놓은 비교 PNG를 사람이 훑는 자료다. 해시표·기준 SVG는 저장소에 커밋하지 않는다(PC가 바뀌면 글자 폭이 달라지므로 매번 base를 같은 PC에서 만든다).

**막는 것(종료 코드 1)은 이것뿐이다:** ① head가 base에서 그려지던 그림을 못 그린다(잘림 `TEXT_CLIPPED`·`*_OUT_OF_BOUNDS`, 휴대폰 390px 검사 `ARCHIVE_PHONE_DISPLAY_FAIL`, 게시 점수표가 막는(BLOCK)·못 재는(INDETERMINATE) 결함) ② head가 그린 그림에 **base에는 없던** 틀 밖 라벨·도형이 있다(`lib/clip.mjs`가 SVG를 직접 읽는다) ③ 실행 못 함(크래시·시간 초과·측정 실패·환경 오류) ④ `--tests`에서 head에서만 실패하거나 사라진 테스트. 그 밖은 막지 않는다.

## 명령

```
node archive/tools/geometry-equation/ops/golden-gate/golden-gate.mjs                 # PR 기본: 작업 트리 대 merge-base(origin/main, HEAD), 관련 표본만
node .../golden-gate.mjs --base <ref> --head <ref|@worktree> [--all] [--families stat,solid|item21] [--tests]
```

- `--base` 생략 시 `git merge-base origin/main HEAD`(main의 새 커밋이 head의 변경처럼 보이지 않게). `--head` 기본은 작업 트리(커밋 안 한 변경 포함). 커밋·브랜치도 된다.
- **관련 표본만 렌더(기본, `--families auto`)**: 바뀐 파일(`git diff`)을 종류(kind)·항목에 대응시켜 고른다.
  - 한 종류만 쓰는 파일(`stat-chart-v1.mjs` 등)이 바뀌면 그 종류의 항목. 한 종류가 `--max-per-kind`(기본 30)개보다 많으면 고르게 뽑은 표본(graph 58·construction 55개).
  - **공용 파일(render-plan, worker, phase2, visual_engine, pipeline-core, 측정·정책, 페이지 코드)이거나 표에 없는 엔진 파일**이면 "관련성이 애매하다"고 보고 **모든 종류**를 넣되 종류마다 `--sample`(기본 6)개씩만. 이전에는 209 전체였다.
  - 바뀐 항목 자체(골든 plan, 시험지 JS, 그 시험지의 그림·이미지)는 항상 넣는다. 바뀐 게 렌더와 무관(문서·테스트 등)하면 아무것도 안 돌리고 UNAFFECTED.
  - `--all`(= `--families all`): 209 전체. `--families`에 종류 이름(`stat set solid number-line chain composite ellipse container lattice graph construction`)·capability 이름·골든 `fam` 이름·항목 이름(`item21`)을 쓰면 그것만(줄이지 않음). `--list`는 고른 항목만 출력하고 끝낸다.
  - 이 선택 규칙은 `lib/related.mjs`에 있다(`kinds.mjs`·`select.mjs`는 바이트가 결과 캐시 키에 들어가므로 건드리지 않는다).
- **비교 시트**: 바이트가 달라진 항목(DIFFERENT)과 CLIPPED 항목을 base 왼쪽·head 오른쪽으로 놓은 PNG를 만든다. 한 장에 10쌍(`--per-sheet`), 경로는 실행 끝에 출력된다(기본 `<캐시>/sheets/<시각>/sheet-01.png`, `--sheets-dir`로 지정, `--no-sheets`로 끔). 만들지 못해도 판정은 안 바뀐다. 사람이 훑는 자료이고 막는 장치가 아니다.
- `--exam-batch N`(또는 `APMS_EXAM_BATCH=N`): 같은 시험지의 그림 N개가 아카이브 화면 하나를 나눠 쓴다(`production/exam-batch.mjs`, 결과는 한 건씩과 같다). 켜면 같은 시험지 항목을 같은 묶음에 넣는다. base와 head에 같은 값을 쓴다.
- `--expected <파일>`: 선택 사항, **표시만** 한다. 한 줄에 `항목 DIFFERENT|FIXED|MINOR|CLIPPED|REGRESSED 이유`(이유 10자 이상). 맞지 않는 줄은 `EXPECTED-FILE NOTE`로 출력될 뿐 실패가 아니고, 깨진 그림(REGRESSED·CLIPPED)을 적어도 면제되지 않는다.
- `--tests [auto|all]`: 엔진의 node(`*.test.mjs`)·python(`tests/test_*.py`, unittest) 테스트를 base와 head에서 돌려 **head에서만 실패한 이름**을 실패로 센다. 양쪽 모두 실패한 것은 "existing failure"로 출력한다. `auto`는 바뀐 파일에 닿는 테스트만, 공용 파일이 바뀌면 전부. 시간이 오래 걸리므로 기본은 끄고, 엔진 코드를 크게 바꿀 때만 켠다.
- `--repeat-check`: head를 두 번(순서를 뒤집고 묶음 크기를 바꿔) 렌더해 같은 코드의 흔들림을 확인한다.
- `--order-check [입체,...:그 밖의 항목,...]`: base 없이 head 스냅샷만으로, 앞에 그려진 그림이 뒤 그림에 새는지(같은 python 호스트·Chrome을 여러 항목이 재사용하므로 입체 관측기의 `YAW/VIEW/SCREEN_*` 같은 전역이 샐 수 있다) 본다. **옛 바이트와 비교하지 않고 같은 커밋 안에서 순서·재사용 여부만 바꿔** 결과가 달라지는지(같은 plan이 렌더 순서 때문에 다른 그림이 되는 진짜 결함)를 본다. 그래서 새 기준과 같다: 깨짐(누수·실행 못 함)만 실패다. 골든 표본(입체 6개 / 그 밖 3개)을 다섯 순서로 렌더한다: `reuse-off`(기준, 요청마다 새 python·Chrome), `fwd`, `rev`, `twice`, `alone`. 종료 코드 0 통과, 1 누수(DIFF), 2 항목이 안 돌았거나 입체가 하나도 안 그려짐. 작은 표본 검사는 `order-check.test.mjs`(Chrome·의존성이 없으면 건너뜀). node 쪽 전역(`solid-figure-v1.mjs`의 `YAW_DEG` 등)이 새면 `rev`·`twice`가 DIFF로 드러난다(2026-11-23 훼손 확인).
- `--no-cache`: 캐시를 읽지 않고 양쪽을 새로 렌더(base=head여도 두 번 따로 렌더해 비교).
- 종료 코드: **0** = 깨진 것 없음(PASS) 또는 비교할 게 없음(UNAFFECTED: base=head, 렌더와 무관한 변경, 변경과 관련된 항목 없음, base·head 렌더 입력이 같음). **1** = 위 "막는 것" 중 하나. **2** = 돌릴 수 없음(빈 `--families`·모르는 단어, 분류 오류, 의존성 없음). 종료 코드는 `lib/judge.mjs`의 `decide()` 한 곳에서 정한다.
- 선택은 git 파일 이름 분류에 **base와 head에서 항목 자체 입력(plan, 시험지 JS, 그 시험지가 가리키는 모든 이미지, 다른 시험지 폴더의 이미지 포함)이 다른 항목**을 합친다.
- `--repo <폴더>`: 다른 저장소(테스트용 임시 저장소)에서 돌린다. 기본은 이 저장소.
- 출력 첫 줄은 `byte compared N / selected M`이다(양쪽이 SVG를 낸 항목 N개, 정보용). N이 0이어도 깨진 것이 없으면 통과이고 이유에 "no figure was drawn on both sides"가 붙는다. 마지막 줄 앞에 SAME·DIFFERENT 개수가 정보용으로 나온다.

## 판정

| 판정 | 뜻 | 게이트 |
|---|---|---|
| SAME | SVG 바이트(와 sizeClass, solutionImageScale)가 같다 | 통과 |
| DIFFERENT | 바이트·크기값이 바뀜, 또는 양쪽 다 실패인데 실패가 달라짐. 개선일 수도 회귀일 수도 있어 비교 시트로 사람이 본다 | 통과(정보, 목록·시트) |
| CLIPPED | 양쪽 다 그려졌는데 head 그림에 base에는 없던 틀 밖 라벨·도형이 있다(`lib/clip.mjs`: viewBox 밖 1.5px 초과, 이름으로 비교) | **실패** |
| REGRESSED | base는 그려졌는데 head는 실패하고 그 실패가 학생 화면을 깬다: 잘림·휴대폰 검사 코드이거나 게시 점수표(`ops/score`)가 BLOCK·FAIL_SCORE·WAIT_ENGINE·INDETERMINATE로 보는 코드 | **실패** |
| MINOR | base는 그려졌고 head는 실패했지만 결함이 게시 점수표가 통과시키는 것(라벨이 조금 가깝다 등)뿐 | 목록만 |
| NOT_RUN | 실행 못 함 또는 믿을 수 없음: 프로세스 죽음, 시간 초과(단독 재실행 2번 뒤에도), **환경 오류**(문제 그림·페이지·모듈 로드 실패 `QUESTION_IMAGE_LOAD_FAILED`·`PAGE_RENDER_ERROR`·`ENOENT`, 브라우저 실행 실패 등: 양쪽이 같아도), 스냅샷에 저장소에 있는 자산이 없음, 코드 없는 실패 | **실패** |
| FIXED | base 실패 -> head 통과 | 목록만 |
| BOTH_FAIL_SAME | 양쪽이 **같은 실패**(code, stage, 중첩 status까지 같음) | 목록만 |
| REMOVED | 골든 항목이 base에만 있다(분모가 줄었다) | 목록만 |
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
- 수식 조판 실패(MATH_TYPESET_ERROR)는 숙주 시험지(또는 플랜)의 TeX 오류이고 어느 PC에서도 같으므로 환경 오류로 세지 않는다(2026-11-23에는 24 효천고 2학기 기말 고1 q11 해설 1곳 때문에 item134·136·144·145·146이 바이트로 비교되지 못했다. 숙주를 고치면 FIXED로 나온다). 그 밖의 PAGE_RENDER_ERROR는 계속 환경 오류(NOT_RUN)다.
- 종류 표(`lib/kinds.mjs`)는 "이 파일은 이 종류만 바꾼다"는 판단이다. `golden-gate.test.mjs`가 표에 빠진 파일, 표와 import 관계가 어긋난 파일을 잡는다. 확신이 없으면 표에 넣지 말고 그대로 두면 전체(209)가 돈다.
- 렌더가 `import` 아닌 방식으로 읽는 데이터 파일은 `lib/snapshot.mjs`의 `SNAPSHOT_SPECS`에 있어야 한다. 빠지면 렌더가 `ENOENT`로 죽어 NOT_RUN으로 보이고, 죽은 이유가 stderr 줄로 출력된다.
- 같은 PC의 같은 Chrome으로만 비교한다. 다른 PC의 결과와 바이트를 맞추려 하지 않는다.

## 의미 골든 (semantic golden, R0-2)

golden-gate는 "SVG 바이트가 그대로인가"만 본다. 바이트가 바뀌는 수정이 **학생에게 맞는 그림인가**는 보증하지 못한다. 의미 골든은 학생이 실제로 틀리게 읽은 그림(3·2^(x+1)이 `32^(x+1)`로 붙음, 각 라벨 `4π°`, 축 이름이 다른 글자, 넓이 값이 변 옆에 놓여 길이로 읽힘, −π 눈금이 y값처럼 읽힘)을 표 한 장으로 고정한다. 같은 결함이 다시 생기면 테스트가 실패하고, 새 결함은 표에 행 하나를 더하면 된다.

- 표: `ops/semantic-golden/table.json`. 실행기: `ops/semantic-golden/semantic-golden.mjs`(node), 파이썬 쪽 `semantic_golden.py`, 이름 붙은 SVG 변조 `semantic_mutations.py`(표준 라이브러리만)·`layout-capture.mjs`(JS 관측기 쪽).
- 실행: `node archive/tools/geometry-equation/ops/semantic-golden/semantic-golden.mjs [--ids a,b] [--neutralize 변조이름,...]`. 렌더 의존성(sympy, mathjax)이 필요하다(`PYTHONPATH=<저장소>/.tmp/apmath-visual-engine/dependencies/python`). 브라우저는 쓰지 않는다. 행당 수십 초(sympy 불러오기가 대부분).
- 종료 코드: 0 모두 기대대로(KNOWN_GAP은 따로 나열, 통과로 세지 않음), 1 실패, 2 의존성이 없어 돌리지 못함(NOT_RUN).
- 테스트: `node --test archive/tools/geometry-equation/ops/semantic-golden/semantic-golden.test.mjs`(`tools/run-tests.js`에 들어 있음). 표 형식·변조 단위 시험은 python만 있으면 돌고, 표 전체 대조는 의존성이 없으면 skip한다.

### 한 행

| 필드 | 뜻 |
|---|---|
| `id` | kebab-case, 표 안에서 유일 |
| `defect` | 학생이 무엇을 틀리게 읽는가(한 줄) |
| `reuses` | 이 행이 기대는 저장소의 기존 테스트·관측기 파일 경로(1개 이상, 존재해야 함). 같은 검사를 두 벌 만들지 않기 위한 표시 |
| `plan` | 작은 인라인 plan 객체, 또는 이 폴더 기준 plan 파일 경로(`plans/…json`). `planPatch`(`{"점.찍은.경로": 값}`)로 일부만 바꿀 수 있다 |
| `generator.kind` | plan을 무엇으로 돌리나: `exp-label-tex`(지수 식 글자·TeX), `math-label-serialize`(공용 수식 직렬화), `construction-marks`(작도 plan의 plane marks, specFor), `angle-fixture`·`region-fixture`(엔진이 만든 그림을 기존 테스트의 fixture로 관측기에 넣음), `axis-titles-model`(그래프 plan의 축 이름), `axis-value-layout`(축 값 라벨 배치), `label-room-leader`(node쪽: label-room.mjs가 지시선 라벨 자리를 잡음; 관측기 변조 `leader-crosses-stroke`·`leader-label-onto-stroke`·`leader-label-onto-label`) |
| `expect` | 생성기 판정: `PASS` 또는 `REJECT:<코드>`(코드나 `코드:세부`와 일치) |
| `observer.kind` | (선택) 정상 그림을 읽는 관측기: `exp-formula-glyphs`, `angle-label`, `region-label`, `axis-titles`, `layout-capture`(`codePrefix`로 이 규칙의 코드만 본다) |
| `mutations[]` | (observer가 있으면 필수) `{name, args?, expect, knownGap?}`. 정상 그림에 이름 붙은 변조를 가해 관측기에 넣었을 때 `expect` 코드가 나와야 한다. 정상 그림은 관측기가 오류 없이 받아들여야 한다 |

### 행을 더하는 법

1. 결함 하나를 정한다. 저장소에서 그 결함을 이미 막는 테스트·관측기 코드를 먼저 찾는다(`reuses`에 적는다). 새 검사를 만들지 않고 그것을 부른다.
2. 변조가 필요하면 이름 붙은 함수 하나를 만든다. SVG 문자열을 바꾸는 것은 `semantic_mutations.py`(그리고 `SVG_MUTATIONS`·`test_semantic_mutations.py`), 기존 test fixture가 필요한 것은 `semantic_golden.py`의 해당 관측기, JS 캡처를 바꾸는 것은 `layout-capture.mjs`의 `MUTATIONS`에 둔다. 바꿀 것이 없으면 `MutationNotApplicable`을 내서(조용히 아무것도 안 하지 않는다) 행이 이유 없이 통과하지 못하게 한다.
3. 새 변조·관측기·생성기 이름은 `semantic-golden.mjs`의 `GENERATOR_KINDS`/`OBSERVER_MUTATIONS`와 `semantic_golden.py`의 레지스트리에 같이 적는다. `semantic-golden.test.mjs`가 두 쪽이 같은지 확인한다.
4. 표에 행을 적고 `--ids <id>`로 돌린다. **훼손 확인**: 변조 이름을 `--neutralize`로 꺼 보면 그 행이 FAIL이어야 하고(테스트가 모든 변조에 대해 자동으로 확인한다), 관측기의 해당 판정을 잠깐 꺼도 FAIL이어야 한다. 확인한 뒤 원복한다.
5. 관측기가 실제로는 그 변조를 못 잡으면 관측기를 고치지 않는다(R0 범위 밖). 그 변조 줄에 `knownGap`(이유 10자 이상)을 적는다. 실행기는 `KNOWN_GAP`으로 따로 나열하고 통과로 세지 않는다. 나중에 관측기가 그것을 잡게 되면 그 행이 FAIL로 바뀌어 `knownGap`을 지우라고 알려 준다.

원칙: 기존 관측기·생성기 규칙·거절 코드·테스트 기대값은 바꾸지 않고, 표는 그것을 부르기만 한다. 엔진 코드를 바꿔야 할 것 같으면 표에 맞추지 말고 멈추고 보고한다.

## 새 종류를 표에 더하는 법 (R1-1, 독립 도형 등록표)

독립 도형(set·stat·container·lattice·ellipse)은 `production/standalone-kinds.mjs`의 표 한 줄과 공통 실행기 하나로 돈다(render-plan은 capability로 행을 찾아 실행기에 넘기기만 한다). 새 종류를 더할 때 순서:

1. **표에 한 줄**: `STANDALONE_KINDS`에 `{name, capability, stage, check, compose, settle}`를 더한다. `stage`는 검사·크기 단계에서 실패가 보고하는 이름, `check`는 plan -> 정확 모델(거절은 throw), `compose`는 합성 함수, `settle`은 측정·합성 정책이다. 정책은 종류마다 다르므로 억지로 합치지 않는다. 크기가 폰트에 따라 바뀌면 `sameSizePolicy(크기함수)`, 고정 크기면 `onceSizePolicy`, 그 밖에는 새 정책 함수를 같은 파일에 쓴다(`measure`/`compose` 호출만 쓰면 runId·stage 규칙이 자동으로 지켜진다).
2. **kinds.mjs 등록**: `lib/kinds.mjs`의 `CAPABILITY_KIND`(capability -> 종류), `KIND_FILES`(그 종류만 쓰는 모듈·관측기), 새 production 모듈이면 SHARED 또는 KIND_FILES 중 하나에 적는다. `standalone-kinds.mjs` 자체는 이미 SHARED + DISPATCHERS다. `golden-gate.test.mjs`가 빠진 등록을 잡는다.
3. **예제 plan**: `ops/golden/`에 골든 plan 한 개와 `golden.manifest.json` 항목을 더한다(그 종류를 도는 골든이 없으면 `golden set` 테스트가 실패한다).
4. **안내 한 쪽**: `production/AUTHOR_GUIDE.md`(생성 소스는 `build-author-guide.mjs`)에 그 종류의 plan 필드 절을 쓴다.

바꾼 뒤에는 `golden-gate.mjs --base origin/main --tests auto`로 기존 골든이 바이트 그대로인지 증명한다(render-plan·standalone-kinds는 공용이라 209개 전체).

## 자리가 모자랄 때: label-room (R1-2)

라벨이 실제 글꼴에서 자리를 못 찾으면 종류마다 제각각 실패하던 것(`SET_ELEMENT_NO_ROOM`, `STAT_LABEL_OUT_OF_BOUNDS`, `ELLIPSE_LABEL_NO_ROOM` ...)을 생성기 공통 층 `production/label-room.mjs` 하나가 같은 순서로 구제한다. 원장님 기본값은 "붐비거나 모호한 라벨은 지시선으로 끌어내지, 버리지 않는다"이다. 이 층은 생성기 쪽에만 있다(관측기와 코드·상수를 공유하지 않는다).

- **순서(유한·고정):** ① STAGGER(엇갈림) → ② WRAP(줄바꿈) → ③ LEADER(자기 대상에서 출발하는 지시선) → ④ MARGIN(여백·틀 확대, 마지막). `orderSteps()`가 순서를 강제하고, 모르는 이름·중복은 던진다.
- **언제 도나:** 그림이 이미 방 부족 코드로 **실패한 뒤에만**(`runStandaloneKind`가 `kind.room.codes`와 대조). 통과하는 그림은 이 층을 지나지 않으므로 바이트가 바뀌지 않는다. 어느 단계도 통과하지 못하면 **원래 실패 코드 그대로** 실패한다(새 코드 없음).
- **기록:** 구제한 단계는 `row.fallback`에 `{kind, from, to:'ROOM_<STEP>', target?}`로 남는다(`ELLIPSE_FRAME_WIDEN` 등 기존 폴백과 같은 자리·모양). 관측기는 이 기록을 보고 기준을 낮추지 않는다: 지시선 라벨도 겹침·거리·소속의 일반 규칙으로 따로 검증한다.
- **차선 자리(best place):** 단계를 다 써도 완벽한 자리가 없으면 그림을 가장 나은 자리에 **그려서 결과 옆에 둔다**(`<항목>-besteffort.svg`). 결과 `row.bestEffort`는 `{kind, failure:{code,detail}, step, degrees[], svgFile}`이고 위반마다 코드와 정도 숫자가 든다: 뷰박스 안쪽 여백을 넘은 px(`overflowPx`), 라벨 높이 대비 비율(`ratio`), 뷰박스 밖으로 잘렸는지(`cutOff`, `cutOffPx`), 겹친 넓이(`overlapAreaPx2`)와 작은 라벨 넓이 대비 비율, 관측기가 낸 코드(`OBSERVER_ERRORS`). 이 그림은 **묶이지 않는다**(실패는 그대로, 합격 점수는 게시 관문 점수표가 이 기록을 읽어 계산한다). 작도·그래프의 `LAYOUT_INVENTORY_INCOMPLETE`는 레이아웃이 그린 후보(자리를 못 찾은 라벨이 빠진 그림)를 같은 이름으로 두고 `unplaced`(라벨 id·종류)와 `labelCount`·`ratio`를 적는다.

| 종류 | 시작 코드(요약) | 단계 | 어떻게 |
|---|---|---|---|
| stat | `STAT_LABEL_OUT_OF_BOUNDS` `STAT_LABELS_TOO_CLOSE` `STAT_*_NO_ROOM` | LEADER, MARGIN | LEADER: 정규분포 넓이 글자를 영역 밖 + 영역 안 점에서 시작하는 지시선. MARGIN: 눈금·z 줄을 라벨 실제 높이로(쌓은 분수), 수형도는 위아래 여백 12·28px |
| set | `SET_*_NO_ROOM` `SET_LABELS_TOO_CLOSE` `SET_DIAGRAM_RENDERED_LAYOUT_FAIL` | LEADER (WRAP은 원소 라벨의 자체 시도 `setDiagramAttempts`) | 집합 이름을 모든 원 선에서 4px 떨어뜨리고, 자리가 없으면 원 밖 빈 곳 + 자기 원에서 시작하는 지시선 |
| ellipse | `ELLIPSE_LABEL_NO_ROOM` `ELLIPSE_FIGURE_RENDERED_LAYOUT_FAIL` | LEADER (MARGIN은 `ELLIPSE_FRAME_WIDEN`, 기존) | 선분 길이 글자(`6√3`)를 선분 가운데에서 시작하는 지시선으로 빈 곳에. 지시선은 축 화살촉을 가로지르지 않는다. plan에 `coordinateLeader:["P"]` |
| construction (평면 도형) | `LAYOUT_INVENTORY_INCOMPLETE` | LEADER, MARGIN | render-plan이 기존 폴백(좌표 띠·캔버스·마지막 수단)을 다 쓴 뒤에만 `runRoomLadder`를 부른다(2026-11-24). LEADER: 자리를 못 찾은 영역 값(AUTO→AUTO_LEADER)·각 값·호 길이를 자기 표식으로 잇는 지시선으로(`constructionLeaderPlan`). MARGIN: 치수선을 점에서 40·60px로 내보내고(`constructionDimensionPlan`), 그래도 안 되면 도형 둘레 빈 틀 `roomPad` 0.14·0.24·0.36(`constructionMarginPlan`, 캔버스 크기 그대로); 각 시도는 LEADER로 고친 plan에도, LEADER·치수선 시도는 마지막 수단(`lastResort`)으로도 한다. 관측기는 그대로 통과해야 한다 |
| container, lattice | 없음 | 없음 | 자체 틀 확대 사다리(`GRAPH_GROWTH`)가 이미 있고 현행 코퍼스에 방 부족 실패가 없다. 다음 묶음 후보 |

할 수 없는 경우(다른 선을 가로지를 수밖에 없는 지시선 등)는 몰래 caption으로 보내지 않고 지금처럼 정해진 코드로 거절한다. 새 종류가 단계를 가지려면 표 행에 `room: {codes, steps, apply, best?}`를 쓴다(`standalone-kinds.mjs` 머리말). 테스트: `tests/label-room.test.mjs`(순수), `tests/label-room-render.test.mjs`(Chrome).
