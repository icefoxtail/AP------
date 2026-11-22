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
- 종료 코드: 0 통과, 1 실패, 2 못 돌림(인자·의존성 없음).

## 판정

| 판정 | 뜻 | 게이트 |
|---|---|---|
| SAME | SVG 바이트(와 sizeClass, solutionImageScale)가 같다 | 통과 |
| DIFFERENT | 바이트·크기값이 바뀜, 또는 실패 코드가 바뀜 | **실패** |
| REGRESSED | base는 그려졌는데 head는 실패(거절) | **실패** |
| NOT_RUN | 실행 못 함(프로세스 죽음·시간 초과가 단독 재실행 2번 뒤에도 남음) | **실패** |
| FIXED | base 실패 -> head 통과 | 목록만 |
| BOTH_FAIL_SAME | 양쪽이 같은 코드로 실패 | 목록만 |

FIXED와 BOTH_FAIL_SAME도 분모에서 빼지 않고 개수를 그대로 출력한다. 부하 때문에 나는 시간 초과(WORKER_TIMEOUT 등)는 그 항목만 단독으로 다시 돌린다(최대 2번, "solo retries"로 출력). 내용 실패는 다시 돌리지 않는다.

## 어떻게 돌리나

- worktree를 만들지 않는다. base/head가 읽는 파일(엔진, pipeline-core, 렌더가 측정하는 Archive 페이지, 골든 plan, 대상 시험지·게시된 SVG)만 `git archive`(작업 트리는 복사)로 캐시 폴더의 `snapshots/`에 푼다. 렌더는 그 폴더 안에서 돌고 체크아웃은 건드리지 않는다. 의존성(`.tmp/apmath-visual-engine/dependencies`)은 junction으로 연결한다.
- 렌더는 production 실행기 그대로(`render-plan.mjs --manifest`)다. 한 프로세스가 항목 여러 개를 맡아 Chrome·python을 재사용한다. 순서·묶음에 결과가 달라지지 않는지는 `--repeat-check`가 확인한다.
- 결과 캐시(항목별): 키 = 렌더 입력 파일 해시(엔진·공용 코드·종류 파일) + 그 항목의 plan·시험지 JS·게시된 SVG 해시 + 환경 지문(Chrome 버전, 글꼴 NotoSansKR 해시, Node, Python과 sympy·mpmath 등 패키지, playwright 버전, OS). 하나라도 달라지면 새로 렌더한다. 같은 base로 다시 돌리면 base는 캐시에서 나온다.
- 환경변수(개인 경로를 코드에 박지 않는다): `GOLDEN_GATE_CACHE`(기본 `<저장소>/.tmp/golden-gate-cache`, C 드라이브 여유가 적으면 D로), `RENDER_LOCK_DIR`(다른 렌더 작업자와 슬롯을 공유할 폴더), `RENDER_SLOTS`(기본 1; `--slots`), `GOLDEN_GATE_DEPS`, `GEOMETRY_BROWSER_EXECUTABLE`, `GEOMETRY_PYTHON`. 자식 프로세스의 TEMP/TMP는 캐시 폴더 안으로 돌린다.
- 렌더 슬롯 잠금: `render.mjs`와 같은 `render.lock.<n>` 디렉터리를 `RENDER_LOCK_DIR`에서 잡고(30초마다 갱신) 한 묶음이 끝나면 놓는다. 다른 작업자가 쓰는 폴더를 가리키면 그 슬롯 수를 함께 지킨다.
- 이어 돌기: 항목마다 결과를 저장하므로 중단돼도 끝낸 항목은 캐시에서 나오고 나머지만 돈다. 프로세스가 죽거나 시간이 지나면 끝낸 항목을 거두고 나머지는 단독 재실행한다.
- 정리: 작업 트리 스냅샷은 하루, 커밋 스냅샷은 2주 안 쓰면 다음 실행 때 지운다. 엔진이 남기는 `.tmp/archive/<runId>`는 한 시간 지난 것을 지운다.

## 걸리는 시간 (2026-11-22 측정, 이 PC, 다른 렌더 작업자 5명이 함께 도는 중, 슬롯 2, 묶음 8개)

- 항목 하나는 보통 25~40초(Chrome 측정 단계가 대부분). 한 종류씩 합친 시간(base+head 렌더 시간의 합 ÷ 렌더 수): stat 28초, solid 25초, set 29초, number-line 23초, composite 41초, construction 40초, ellipse 39초, graph 58초, container 10초, lattice 2초(둘 다 일찍 거절), chain 1개가 3분 47초.
- **209 전체: 한쪽 렌더 172개 + 캐시 37개에 1시간 03분(슬롯 2).** 캐시 없이 209개를 다 렌더하면 약 1시간 15분. head만 새로 돌리면(base가 캐시에 있으면) 그 한쪽 시간이다. 두 쪽을 모두 새로 돌리면 두 배.
- `--tests`: stat 변경 하나에 테스트 58개 파일(449 통과·23 기존 실패)을 base·head 모두 돌려 32분(슬롯 2). 테스트가 Chrome으로 렌더하는 것이 많아 오래 걸린다.
- 종류 하나(stat 23개): head 한쪽 약 5분, base까지 새로 만들면 약 10분. 캐시가 모두 맞으면 14초.
- 종류 표가 닿는 범위를 줄여 주는 만큼만 빨라진다. 공용 파일을 고치면 209 전체(약 1시간)다.

## 못 막는 것 (한계)

- 골든 209개 중 2026-11-22 main에서 **69개는 이미 거절(실패)** 이다(BOTH_FAIL_SAME으로 목록에 나온다: 표시 크기 규칙 이후 안 그려지는 오래된 plan들). 이 항목들은 "같은 코드로 계속 실패"만 확인하고 그림 바이트는 못 본다. 그림이 실제로 나오는 140개와 종류별로 못 덮는 것(container·lattice·logarithmic-affine은 그려지는 골든이 0개, stat이 composite 패널 안에 든 골든 0개 등)은 PR 설명의 "골든이 못 덮는 것"에 있다. 새 기능을 넣는 PR은 그 기능의 예제 plan을 골든에 같이 넣어야 이후부터 지켜진다.
- 종류 표(`lib/kinds.mjs`)는 "이 파일은 이 종류만 바꾼다"는 판단이다. `golden-gate.test.mjs`가 표에 빠진 파일, 표와 import 관계가 어긋난 파일을 잡는다. 확신이 없으면 표에 넣지 말고 그대로 두면 전체(209)가 돈다.
- 렌더가 `import` 아닌 방식으로 읽는 데이터 파일은 `lib/snapshot.mjs`의 `SNAPSHOT_SPECS`에 있어야 한다. 빠지면 렌더가 `ENOENT`로 죽어 NOT_RUN으로 보이고, 죽은 이유가 stderr 줄로 출력된다.
- 같은 PC의 같은 Chrome으로만 비교한다. 다른 PC의 결과와 바이트를 맞추려 하지 않는다.
