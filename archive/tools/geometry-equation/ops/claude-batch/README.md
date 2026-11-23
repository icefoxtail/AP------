# claude-batch — 해설 SVG 묶음 작업 도구

현행: DeepSeek 초안(`ds-launch-exam.sh`) → Sonnet 검수·마감(`prompts/sonnet-exam-impl.md`) → 메인 PNG 확인 후 게시·묶음 PR. 루나(Codex) 전용 도구는 아래 표에서 "과거(루나)"로 표시했다. 흐름·규칙·함정은 `../../HANDOFF_SVG_CLAUDE_BATCH.md`.
`.tmp/`는 git에서 제외되므로 도구는 여기(저장소)에 두고, 쓸 때 `<저장소>/.tmp/work/`로 펼친다(`ops/svg-m1` → `.tmp/svg-m1`과 같은 방식). 작업 데이터(`runs/`, `pub/`, `triage-20261107/`, `dec-*.json`, `render.lock`)는 `.tmp/work/`에만 생기고 저장소에 올리지 않는다.
명령은 어느 위치에서 실행해도 되고(저장소 루트는 스크립트 위치로 자동 탐지), 예전과 똑같이 `.tmp/work/launch-open.sh …`로 부른다. 상대경로 인자(시험지 JS 등)는 저장소 루트 기준이다.

## 새 PC 준비

1. 저장소를 받는다(체크아웃 위치 자유). 이후 명령은 저장소 루트에서.
2. svg-m1 도구 복원(`HANDOFF_SVG_ENGINE.md` §3):
   `mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/`
3. 이 도구 펼치기: `bash archive/tools/geometry-equation/ops/claude-batch/restore.sh`
   - 도구 파일만 복사하고 작업 데이터는 건드리지 않는다. `.tmp/work`의 같은 파일이 더 최신이면 건너뛴다(`--force`로 덮어쓰기).
   - 로컬에서 도구·지시서·`ENGINE_GAPS.md`를 고쳤으면 `restore.sh --save`로 이 폴더에 되돌려 복사한 뒤 커밋한다. 이유: 고친 내용이 이 PC에만 남지 않게 하려고.
4. Codex CLI 0.167 이상을 설치하고 `gpt-6-luna`가 쓰이는지 확인한다(PATH의 구버전 codex는 모델 목록이 오래돼 실패). 환경변수:
   - `CODEX_BIN` — codex 실행 파일. 기본값은 개발 PC(Windows) 예시 `C:/Users/USER/AppData/Local/OpenAI/Codex/bin/f71a721e0e6193a9/codex.exe`이고, 없으면 분명한 오류를 낸다(앱 갱신 시 해시 폴더가 바뀐다: `find ~/AppData/Local/OpenAI/Codex/bin -name codex.exe`).
   - `CODEX_CWD` — 저장소 밖의 빈 폴더(루나 작업 폴더. 저장소의 `.codex/config.toml`이 구버전 codex를 깨뜨리는 것을 피한다). 기본값 `C:/Users/USER/codex-svg-cwd`. 없으면 오류.
   - `GEOMETRY_NODE_MODULES` — playwright가 든 `node_modules` 경로. 새 워크트리에서 렌더 의존성이 없을 때 지정. 설정하지 않으면 `.tmp/apmath-visual-engine/dependencies/node_modules`를 쓴다.
   - `GEOMETRY_BROWSER_EXECUTABLE` — 렌더용 Chrome. 설정하지 않으면 Windows 기본 Chrome 경로가 있을 때 그것, 없으면 엔진 기본(channel chrome).
5. 판정표·dots 입력 풀기(triage 브랜치): `HANDOFF_SVG_CLAUDE_BATCH.md` §5-1의 명령으로
   `git fetch origin codex/svg-triage-20261107` → `git archive FETCH_HEAD triage-20261107 | tar -x -C .tmp/work/`
   (결과가 `.tmp/work/triage-20261107/`). 기존 사본이 있으면 새 것만 복사한다(`tar --skip-old-files`).
6. 엔진 의존성: `.tmp/apmath-visual-engine/dependencies`(playwright, python 패키지, 글꼴)를 `HANDOFF_SVG_ENGINE.md` §3·`docs/agents/visual-svg.md`대로 준비한다. 확인: `node .tmp/work/render.mjs`가 `usage: render-plan.mjs …`를 출력하면 경로는 정상이다.

## 파일

| 파일 | 한 줄 설명 |
|---|---|
| `restore.sh` | 이 폴더 → `.tmp/work` 펼치기(`--force`, `--save`). 펼치는 대상이 아니다. |
| `env.sh` | 다른 .sh가 source하는 공통 설정: 저장소 루트 탐지, `CODEX_BIN`·`CODEX_CWD` 검사, `.tmp/svg-m1` 없을 때 복원 안내 |
| `launch-impl.sh` | **과거(루나)** 판정표 FIGURE 문항 구현(루나, 시험지를 처음 할 때) |
| `launch-rev.sh` | **과거(루나)** 위 구현 결과 1차 검수(rev) |
| `launch-open.sh` | **과거(루나)** dots가 채운 OPEN 문항 구현(`runs/<tablekey>/impl-open`) |
| `launch-exam.sh` | **과거(루나)** **시험지 하나 전체** 구현(루나 high): `launch-exam.sh <tablekey> <시험지 JS>`. 전 문항 판정(FIGURE·REPLACE·KEEP_EXISTING·EXEMPT·UNSUPPORTED·CONTENT)과 구현. 출력 `runs/<key>/exam-impl`(있으면 `exam-impl2`…), `EXTRA`·`INPUT_KEYS`·`OUT` 지정 가능. 과목 문구는 JS 이름으로 자동 |
| `launch-exam-rev.sh` | **과거(루나)** 위 결과를 시험지 전체로 검수(루나 xhigh): `launch-exam-rev.sh <tablekey> <시험지 JS>`. IMPL=최신 `exam-impl*`, REV=짝이 되는 `exam-rev*`. 결과 `<REV>/qNN`, `TABLE.md`(최종 판정), `REVIEW.md` |
| `exam-common.sh` | launch-exam 두 스크립트의 공통 함수(과목 문구, dots 입력 폴더 찾기, 기존 그림 분류표) |
| `exam-figs.cjs` | 시험지 전 문항의 기존 해설 그림을 NONE/NEW/OLD_SVG/OLD_PNG/MISSING_FILE로 분류(구형 판별 자동). launch-exam이 지시서에 붙인다 |
| `compare.py` | `python compare.py <구형 svg·png> <신형 svg> <out.png>` 왼쪽 구형·오른쪽 신형 비교 PNG(UPGRADE 문항의 `compare.png`) |
| `make-dec-exam.cjs` | `<REV>/TABLE.md`로 게시 결정 `dec-<key>-exam.json` 생성, TABLE.md를 `triage-20261107/<key>.md`에 복사(기존 것은 `.bak-<날짜>`로 보존). `node .tmp/work/make-dec-exam.cjs <key> <JS> <REV>` |
| `launch-rev-open.sh` / `launch-rev-open2.sh` | **과거(루나)** impl-open 검수(입력 key = 판정표 key / 서로 다를 때) |
| `run-impl.sh` / `run-rev.sh` | **과거(루나)** 위 launch들이 부르는 실제 Codex 실행. `OUT`/`IMPL`/`REV`/`EXTRA`로 폴더·추가 지시를 직접 지정 |
| `resume.sh` | **과거(루나)** 중단된 루나 실행에 정정 지시를 붙여 이어 하기 |
| `render.mjs` | 공식 엔진 렌더(`render.lock`으로 직렬화, 환경 설정 포함) |
| `render.mjs --manifest <packetDir> --out <outDir> --exam-batch 20` | 같은 시험지의 그림을 20개씩 묶어 아카이브 화면을 한 번만 열어 측정·캡처한다(2026-11-23, `production/exam-batch.mjs`). 결과(SVG·오류 코드)는 한 건씩과 같다. `APMS_EXAM_BATCH=20`으로도 켠다. 건마다 `--item`을 부르는 방식에는 효과가 없다 |
| `a11y.sh` | 출력 SVG에 루트 `role=img`·title·desc 보강 |
| `ledger2md.cjs` | 원장 상태로 판정표 생성(판정표가 없고 원장에는 있는 시험지) |
| `make-dec.cjs` / `make-dec-open.cjs` | 게시 결정 파일 `dec-<key>[-open].json` 생성 |
| `build-pub.py` | `pub/<key>` 생성과 기계 점검(`BAD:`) |
| `jscheck.cjs` | 게시 후 시험지 JS에서 solutionImage 외 필드가 바뀌지 않았는지 점검 |
| `prompts/impl-common.md` `review-common.md` | **과거(루나)** 루나 구현·검수 지시서. `<WORKTREE>`는 run 스크립트가 이 PC의 저장소 경로로 바꾼다 |
| `prompts/exam-impl.md` `exam-review.md` | **과거(루나)** 시험지 단위 루나 구현·검수 지시서(구형 SVG 전부 신형 재작업·핵심 관계 보존·compare.png·TABLE.md/SUMMARY.md/REVIEW.md 형식) |
| `prompts/sonnet-final.md` | **과거(루나)** Sonnet 최종 검수 지시서(메인이 읽어 지시에 쓴다) |
| `qrun.sh` | **과거(루나)** 대기열 시험지마다 launch-exam→launch-exam-rev를 이어 돌린다. 슬롯 수는 `.tmp/work/qrun.slots` |
| `mkqueue-h1.cjs` | 고1 1mid·1final·2mid 시험지를 최신 연도 내림차순 대기열로 만든다 |
| `prompts/sonnet-exam-brief.md` | **과거(루나)** 시험지 단위 Sonnet 최종 보충 지시 |
| `ds-launch-exam.sh` | DeepSeek 초안 실행(루나 사용량 한도로 2026-11-10 전환): `ds-launch-exam.sh <tablekey> <시험지 JS>`. 시험지 전체 플랜 초안을 만든다 |
| `qrun-ds.sh` | 대기열(`queue-ds.tsv`)의 시험지마다 DeepSeek 초안 → Sonnet A 구현·검수를 이어 돌린다. 슬롯 수는 `qrun-ds.slots` |
| `ds-triage-exam.sh` | 해설 그림 필요 판정만(플랜·렌더 없음): `ds-triage-exam.sh <시험지 JS>`. 미판정 문항만 DeepSeek이 FIGURE/REPLACE/KEEP_EXISTING/EXEMPT/CONTENT로 판정 → 기계 검증(실패 시 1회 재호출) → `ledger-upsert.py`로 장부 반영(`APPLY=0`이면 반영 생략). FIGURE·REPLACE는 `OPEN_LAYOUT`("plan 대기: …"). 결과 `.tmp/work/triage-ds/<이름>/`. 지시문 `prompts/ds-triage.md`, 보조 `ds-triage-lib.cjs`(prep·validate·apply) |
| `qrun-ds-triage.sh` | 시험지 목록 파일(한 줄에 JS 경로)을 순서대로 `ds-triage-exam.sh`로 돌린다(기본 한 번에 하나). 결과 한 줄씩 `.tmp/work/qrun-ds-triage.log`, OpenCode 한도면 30분 기다렸다 같은 시험지부터 재개 |
| `ds-plan-exam.sh` | plan 대기 문항의 plan 작성(2026-11-19): `ds-plan-exam.sh <시험지 JS>`. 장부 "plan 대기" − 이미 plan/판정이 있는 문항을 DeepSeek이 **글로만, 탐색 없이** `qN-solution.json`으로 쓴다(렌더·PNG 확인 없음: 렌더는 공장이 일괄, 실패분은 수리). 스크립트가 문항마다 문맥 꾸러미를 `INPUT-<k>.md`로 만든다(문항 원문·정답·해설, 장부 사유, **본보기 plan 2~3개**(같은 subUnitKey → standardUnitKey → 과목 순, 장부 사유·캡션 유사도·형태 낱말로 같은 형태를 고름, `ds-plan-context.cjs`), 그 capability의 AUTHOR_GUIDE 발췌, 공통 규칙은 `prompts/ds-plan.md`). 5문항(`DS_CHUNK`)마다 한 번 호출하고 DeepSeek은 **도구 없는 agent `ds-plan-writer`**(`opencode-agents/`, 없으면 `~/.config/opencode/agents`에 설치)로 `=== Q<번호> ===` + JSON만 답한다. `ds-plan-lib.cjs expand`가 JSON을 plan 파일(문제 원문 source 항목은 스크립트가 넣음)·`result.json`으로 펼친다. 기계 검증(JSON 읽힘, capability·필수 최상위 필드, 같은 capability 본보기에 없는 필드 금지, caption/alt 언어 계약, 판정 사유, 예상 밖 변경 없음) 통과분만 그 시험지 plan 폴더를 commit·push(`data/svg-plans-20261117`, `NO_PUSH=1`이면 commit만, `DS_DRY=1`이면 커밋도 안 함). 못 통과한 문항은 문제 목록·직전 답과 함께 1회 재시도 뒤 plan을 치워 plan 대기로 남긴다. DeepSeek은 한 번에 하나(`.tmp/work/ds-plan.lock`). 종료코드 3=한도, 4=BUSY. 보조 `ds-plan-lib.cjs`(prep·expand·retry-prep·validate·finalize·report), 작업물 `.tmp/work/plan-ds/<이름>/`(INPUT-k.md·PROMPT-k.md·ds-k.log) |
| `plan-lint.cjs` | plan **사전검사**(2026-11-20): `node plan-lint.cjs <plan.json 또는 폴더>…`. 렌더(Chrome) 전에 엔진의 검증 함수(`frame_graph`·`specFor`·`check*Plan`·`compositePanels`·`prepare`+MathJax 조판·모델 관찰자)를 그대로 불러 plan 형식 오류를 문항당 1초 안팎(중앙 14ms)으로 잡는다. 문항마다 `OK` 또는 `코드: 이유 → 고치는 법`. 허용 밖 필드로 거절되면 그 필드를 지운 사본을 다시 검사해 다음 단계 오류까지 함께 낸다. 일괄 렌더 1,421개 실측: 실패 1,008개 중 863개를 렌더 전에 잡고 통과 413개 오탐 0. 못 잡는 것(Chrome 측정): 라벨 자리(`LAYOUT_INVENTORY_INCOMPLETE`·`*_NO_ROOM`·`*_TOO_CLOSE`)·표시 크기·Archive 페이지 오류·조립 시간 초과. `ds-plan-lib.cjs validate` 가 기본으로 돌린다(`PLAN_LINT=0` 이면 건너뜀). 엔진은 `--engine <저장소>`(기본 이 파일이 있는 저장소)에서 읽기만 한다. 보조 `plan-lint-codes.cjs`(코드별 이유·고치는 법·출처 줄 번호), `plan-lint-host.py`(요청마다 python 을 띄우지 않는 호스트) |
| `qrun-ds-plan.sh` | 목록(`mk-ds-plan-list.cjs` 출력)을 한 번에 시험지 1개씩 `ds-plan-exam.sh`로 돌린다. 결과 한 줄씩 `.tmp/work/qrun-ds-plan.log`. 한도에 걸리면 **기다리지 않고 멈춘다**(사용자 지시). 중단 `touch .tmp/work/qrun-ds-plan.stop` |
| `mk-ds-plan-list.cjs` | plan 대기가 남은 시험지 목록: 고2 → 중2 → 중1 → 고1, 학년 안에서 최신 연도 내림차순. `--counts`이면 남은 문항 수를 붙인다 |
| `ds-svgtext.cjs` | DeepSeek 초안의 SVG 텍스트(글자·수식) 점검 보조 |
| `prompts/ds-exam-draft.md` | DeepSeek 시험지 초안 지시서 |
| `prompts/sonnet-exam-impl.md` | Sonnet A 구현·검수 지시서(DeepSeek 초안 → Sonnet 검수·마감) |
| `prompts/sonnet-exam-create.md` | DeepSeek 월 한도 소진 뒤 Sonnet A가 판정·플랜·구현·PNG 자체검수를 한 번에(2026-11-10) |
| `prompts/svg-common-rules.md` | 두 PC(집·고등)가 함께 따르는 SVG 공통 규칙(2026-11-10) |
| `prompts/publish-brief.md` | 게시 절차 실행자(Sonnet) 지시서(build-pub→pubflow→골든 재고정→jscheck→runtime→PR) |
| `ENGINE_GAPS.md` | 엔진이 못 그려 OPEN으로 남긴 문항과 사유(엔진 업그레이드 때 사용) |
