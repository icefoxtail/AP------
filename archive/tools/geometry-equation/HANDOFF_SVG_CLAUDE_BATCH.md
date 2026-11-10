# 인계: 해설 SVG 묶음 작업 (루나 구현·검수 → Sonnet 최종 → 묶음 PR)

최종 갱신 2026-11-09 오전, Claude 메인(오케스트레이터).
다음 세션은 이 파일 → `docs/agents/visual-svg.md` "진행 경로" 절 → `.tmp/work/ENGINE_GAPS.md` 순으로 읽고 시작한다.

**도구 위치:** 스크립트·지시서는 저장소 `archive/tools/geometry-equation/ops/claude-batch/`에 있고, 쓸 때 `restore.sh`로 `<저장소>/.tmp/work/`에 펼친다(`.tmp/svg-m1`과 같은 방식). 작업 데이터(`runs/`, `pub/`, `triage-20261107/` 사본, `dec-*.json`)는 `.tmp/work/`에만 있고 git에 없다. 이 문서가 말하는 `.tmp/work/`·상대경로는 모두 **저장소 루트 기준**이며, 어느 PC·체크아웃에서든 같다(스크립트가 루트를 자동 탐지한다). **새 PC면** `ops/claude-batch/README.md`의 "새 PC 준비" 절차(저장소 받기 → svg-m1 복원 → restore.sh → Codex·환경변수 → triage 브랜치 풀기 → 엔진 의존성)를 먼저 한다. 도구·지시서를 고쳤으면 `restore.sh --save`로 저장소 폴더에 되돌려 커밋한다. 이 PC의 이전 작업 트리(`.claude/worktrees/svg-h1-batch1`)는 한 예일 뿐 고정이 아니다. 이전 판 전문은 개발 PC의 `.tmp/work/HANDOFF-history-20261109.md`(저장소에는 없음, 이 문서를 고치면 `.tmp/work/HANDOFF.md` 사본에도 반영).

---

## 0. 지금 바로 할 일 (2026-11-09 오전 기준)

> **2026-11-09 사용자 결정(이 줄 아래가 이전 판 내용보다 우선):** ① 작업 단위는 **시험지 하나 전체**(루나 구현 1회에 시험지 하나를 넣고 모든 문항을 판정·처리, 문항 몇 개만 고르지 않는다). ② **구형 SVG(구형 판별은 `ops/claude-batch/prompts/exam-impl.md`)는 예외 없이 신형 엔진으로 재작업**하고, 구형이 보여 주던 **핵심 관계를 먼저 목록으로 적어 신형에 반드시 담는다**(`compare.png`로 확인). ③ dots 입력 초안은 DRAFT_ONLY 여부와 상관없이 **출발점**으로 쓴다(원문과 대조해 틀리면 고침). ④ 엔진이 못 그리는 것은 UNSUPPORTED + 빠진 기능을 적어 **엔진 확장 라인(별도 Sonnet 라인)**에 넘긴다. 범위는 2학기 기말 고1·고2 수학II·확률과통계. 도구: `launch-exam.sh`, `launch-exam-rev.sh`, `make-dec-exam.cjs` 등(README 파일 표).

> **2026-11-09 PC 분담(사용자 결정, 저녁 갱신):** 고등 PC(이 라인)는 **고2 2학기 기말(수학II·확률과통계) 전부 → 중3 → 중2 → 중1 2학기 기말** 순서와 엔진 확장(별도 Sonnet 라인)을 맡는다. 다른 PC의 Codex는 **고1 1학기 중간·기말, 2학기 중간**을 맡는다(중등 전담 안은 취소). dots(Codex)는 앞으로 작업할 시험지의 3종 초안을 시험지별 브랜치 `codex/svg-<key>-YYYYMMDD`(입력은 `triage-20261107/inputs/<key>/`, 판정은 `ROOT_REVIEW_*.md`)로 인계하며, 이 라인의 루나·Sonnet이 구현 담당자다. 초안이 아직 없는 시험지도 기다리지 않고 원문에서 진행하고, 끝난 시험지는 바로 main에 운영 병합한다. 원장 `exam-figure-ledger.json`은 함께 쓰므로 PR 전 `git merge origin/main`, 충돌 시 main을 받고 내 시험지 항목만 다시 반영(`ops/svg-m1/ledger-upsert.py`). 프로세스 종료는 PID로만 한다(이름 패턴으로 끄다 다른 루나 실행 5개가 함께 죽은 일이 있다). 셸 명령 문자열의 백틱은 작은따옴표 heredoc 안에서만 쓴다.

1. **14묶음 PR #1535 병합 완료**(2026-11-09). 다음 묶음은 origin/main에서 새 브랜치로 시작.
   - 내용: 20 매산여고 고1 Q02·Q04·Q06·Q12(Q05 기존 유지 → 시험지 CLOSED), 22 팔마고 고1 Q14(판정표 신규 `triage-20261107/22-palma.md`, 남은 OPEN Q21).
   - 24 효천고 고1 Q14: 새 그림은 ㄷ만 보여 주고 기존 그림의 ㄱ·ㄴ·ㄹ 정보가 사라져 **기존 그림 유지**(메인 결정, 폴더 x-q14-keep-existing). 원장에는 아직 OPEN — 다음에 이 시험지를 게시할 때 dec에서 KEEP_EXISTING으로 닫는다.
   - 원장에 없는 고1 시험지 남음: 21 금당고·22 매산고(dots 입력이 오면 §5-4로 판정표부터).
   - **이 시점에 dots가 인계용으로 올린 입력은 모두 처리 완료.** 남은 건 §6(처리하지 않는 것)뿐이다.
2. **dots 새 입력 확인** — triage 브랜치를 fetch해서 새 `root-inputs/qNN`과 상태 문서를 본다(§5-1). DRAFT_ONLY/NOT_READY는 처리하지 않는다(§6).
3. **그림 파일 복구 PR #1536 병합 완료**(2026-11-09). 남은 후속은 §8.
4. 그 뒤 순서(사용자 지시): 고2 2학기 남은 OPEN(수2 190·확통 96, 대부분 dots 입력 필요) → **중3 → 중2 → 중1**(`archive/exams/original/middle/m3|m2|m1`). 중학교는 판정표부터 만든다.

---

## 1. 역할 (사용자 결정 2026-11-08)

| 누가 | 하는 일 |
|---|---|
| Claude 메인 | 지휘·판단·PNG 직접 확인·게시·PR·병합. 그림·코드를 직접 만들지 않는다. 보고는 마스터님께 공손하고 짧게. |
| 루나(gpt-6-luna, Codex CLI) | 구현(effort high), 1차 검수·수정(다른 실행, effort xhigh). Claude 사용량을 안 쓰므로 많이 돌린다. |
| Sonnet 서브에이전트 | 최종 검수·수정(effort high). **마무리는 항상 Sonnet.** 판정표 작성도 맡긴다. |
| dots(별도 라인) | OPEN 문항 입력(item/plan/publish/STATUS)을 triage 브랜치 `codex/svg-triage-20261107`에 올린다. |

- **위임 금지:** 루나·Sonnet은 OpenCode·deepseek 등 다른 모델에 넘기지 않는다(deepseek은 그림을 못 본다). PC 전역 `~/.codex/AGENTS.md` 위임 규칙은 2026-11-08 삭제(백업: scratchpad `codex-AGENTS.md.bak`).
- **손으로 SVG 작성 금지.** 렌더는 `node .tmp/work/render.mjs`로만.
- **정답·보기 번호는 그림·alt에 넣지 않는다.** caption 끝에만 "정답은 …이다." 그림 속 값이 곧 정답이면 그것도 노출이다(예: 20 매산여 고1 Q04 h(1)=3 → "g(0)의 함숫값"으로 바꿈, 23 매산여 수2 Q23 좌표 제거).
- **원본 JS·archive/assets는 승인 없이 수정하지 않는다.** 커밋에는 시험지 JS의 solutionImage* 필드, 새 SVG, `exam-figure-ledger.json`만.
- 검사를 완화하지 않는다.

---

## 2. 묶음 방식

- (2026-11-09 사용자 결정) 묶음의 기본 단위는 **시험지 하나 전체**다. 루나 구현·검수·Sonnet 최종 모두 시험지 단위로 전 문항을 본다(§4의 시험지 단위 흐름).

- 시험지 4~6개(문항이 적으면 더 많이)를 PR 하나로. CI 녹색이면 `gh pr merge <n> --merge` → `git fetch origin main && git checkout -b svg/batchNN-YYYYMMDD origin/main`.
- **단계를 겹친다:** 루나 동시 4건 정도(구현·검수 합산). 하나 끝날 때마다 다음 것을 띄운다. 루나 검수가 끝난 시험지는 2~4개씩 묶어 Sonnet 최종에 넣는다. 늦는 시험지는 다음 묶음으로.
- 실측: 루나 구현 10~60분, 루나 검수 5~60분, Sonnet 최종 1~12분(문항 수에 비례), PR CI 약 40~50분. 2026-11-09 밤~아침에 8~13묶음(6개 PR)을 병합했다.
- Auto-fix가 켜져 있어 CI는 직접 폴링하지 않는다. 묶음 사이에 `gh pr view <n> --json statusCheckRollup`으로 한 번 보는 정도.

---

## 3. 도구 (`.tmp/work/`, 원본은 `ops/claude-batch/`)

### 3-1. 루나 실행
- Codex 바이너리: 환경변수 `CODEX_BIN`(0.167 이상, gpt-6-luna 사용 가능해야 함. PATH의 구버전 codex는 실패). 루나 작업 폴더(저장소 밖 빈 폴더)는 `CODEX_CWD`, 렌더 의존성 node_modules는 `GEOMETRY_NODE_MODULES`(새 워크트리에서 playwright가 없을 때). 기본값은 개발 PC(Windows) 예시 `CODEX_BIN=C:/Users/USER/AppData/Local/OpenAI/Codex/bin/f71a721e0e6193a9/codex.exe`(앱 갱신 시 해시 폴더가 바뀜), `CODEX_CWD=C:/Users/USER/codex-svg-cwd`이고 없으면 스크립트가 분명한 오류를 낸다. 스크립트가 `-C $CODEX_CWD --add-dir <저장소>`를 붙인다. 자세한 준비는 `ops/claude-batch/README.md`.
- 지시서: `prompts/impl-common.md`(구현), `prompts/review-common.md`(검수), `prompts/sonnet-final.md`(Sonnet 최종). 새 교훈은 여기에 추가.
- 끝났는지는 `runs/<key>/<단계>/last.txt`가 생겼는지로 본다(REVIEW.md 첫 줄은 먼저 써진다).
- 스크립트:
  - `launch-impl.sh <key>` — 판정표 FIGURE 문항 구현(전체 시험지 처음 할 때).
  - `launch-rev.sh <key>` — 위 결과 검수(rev).
  - `launch-open.sh <inputkey> <tablekey> "Q02 Q09"` — dots OPEN 입력 구현. 출력 `runs/<tablekey>/impl-open`. math2·stat key면 교육과정 문구 자동.
  - `launch-rev-open.sh <key>` — 입력 key = 판정표 key일 때 impl-open 검수 → rev-open.
  - `launch-rev-open2.sh <inputkey> <tablekey>` — 입력 key ≠ 판정표 key(예: 19-palma-h1 → 19-palma).
  - `run-rev.sh` — `IMPL=… REV=… EXTRA="…" run-rev.sh <key> <JS>`로 폴더 직접 지정.
  - `resume.sh <rundir> <session-id> <effort>` — 중단된 실행에 정정 지시를 붙여 이어 하기(session id는 codex.log 첫머리).
- **같은 key에 impl-open/rev-open이 이미 있으면** 새 입력은 `impl-open2`/`rev-open2`로 분리한다(run-rev.sh에 IMPL/REV 지정). 섞으면 이미 게시한 문항까지 다시 검수한다(19 금당 Q04 때 겪음).

### 3-2. 게시
- `ledger2md.cjs <tablekey> <시험지명>` — 판정표가 없고 **원장에는 있는** 시험지의 판정표를 원장 상태로 생성.
- 판정표가 원장에도 없는 시험지 → Sonnet에게 판정표 작성(§5-4).
- `make-dec-open.cjs <key> <JS> [srcSub]` — 결정 파일 `dec-<key>-open.json` 생성. 기준: **원장 현재 상태**(2026-11-09 고침) → 이미지 있는 게시 문항 KEEP_EXISTING, srcSub(기본 rev-open)에 있는 문항 REPLACE/FIGURE, 나머지 OPEN은 UNSUPPORTED, OPEN_CONTENT는 CONTENT. 메인이 특정 문항을 바꿔야 하면 dec JSON을 직접 고친다(예: 기존 그림 유지 → KEEP_EXISTING).
- `make-dec.cjs <key> <JS>` — 처음 게시하는 시험지(rev 기준).
- `build-pub.py <key> <JS> <srcdir> <dec.json>` — pub/<key> 생성, 기계 점검(`BAD:`): ARCHIVE_BOUND, questionUid, size=sizeClass, alt/caption, alt의 ①~⑤, SVG title/desc 깨짐, 루트 role=img, ±1 직선·원의 equalUnits.
- `a11y.sh <qdir>` — BAD에 "SVG root role=img/title missing"이 나오면 실행 후 build-pub 재실행(composite·number-line·stat 출력).
- 게시: `PYTHONIOENCODING=utf-8 python .tmp/svg-m1/pubflow.py --batch .tmp/work/pub/manifest-batchNN.json` (형식은 pub/manifest-batch13b.json 참고, 경로는 manifest 기준 상대).
- 점검: `git -c core.quotepath=off status --porcelain | grep '^ M.*\.js$' | cut -c4- | while read f; do node .tmp/work/jscheck.cjs "$f"; done` (nonImageChanged []이어야 함) → `node tools/check-archive2-runtime.cjs`(180 pass) → `git checkout -- archive/data`.
- 커밋: `git add archive/exams/original/high archive/tools/geometry-equation/production/exam-figure-ledger.json` + 해당 시험지 새 SVG(`archive/assets/images/<시험지>/…`)만. 커밋 끝에 Co-Authored-By 줄, PR 본문 끝에 Claude Code 줄.

### 3-3. 기록 파일
- `ENGINE_GAPS.md` — 엔진이 못 그려 OPEN으로 남긴 문항과 사유. 엔진 업그레이드 때 쓴다.
- `NOTES.md` — 예전 상태 메모.
- `HANDOFF-history-20261109.md` — 이 문서 이전 판(날짜별 상태 기록 포함).

---

## 4. 표준 흐름 한 장 요약

```
dots 입력 fetch → launch-open(구현) → last.txt → launch-rev-open(검수) → last.txt
 → Sonnet 최종(sonnet-final.md, 2~4개 시험지씩) → 메인이 보고 확인·PNG 몇 장 직접 보기
 → (판정표 없으면 ledger2md 또는 Sonnet 판정표) → make-dec-open → build-pub(BAD none)
 → pubflow → jscheck → runtime → archive/data 되돌림 → 커밋 → PR → CI 녹색 → 병합 → 새 브랜치
```

**Sonnet 2단계 흐름(2026-11-10 사용자 결정, 루나 사용량 문제로 루나 대체 — 이후 기본):**
```
bash .tmp/work/next-sonnet.sh            (QUEUE.txt 첫 줄 → dots 초안 받기 → PROMPT_ONLY=1 launch-exam.sh 로 구현 지시서만 생성)
 → Sonnet(effort medium) 구현: prompts/sonnet-impl.md ({PROMPT}=exam-impl/PROMPT.md, {OUT}=exam-impl)
 → REV=<runs/key/exam-revN> PROMPT_ONLY=1 launch-exam-rev.sh <key> <JS>   (검수 지시서만 생성)
 → Sonnet(effort high) 검수+최종: prompts/sonnet-review-final.md (독립 검수·직접 수정 → make-dec-exam → build-pub BAD none)
 → 메인: PNG 몇 장 확인 → pubflow → jscheck → 커밋 → PR → CI 녹색 → 병합(4~6개씩)
```
동시 실행은 구현 3 + 검수 2 정도(렌더 슬롯 2+우선 1이 병목). 루나 체계(launch-exam.sh 직접 실행)는 남은 실행이 끝나면 쓰지 않는다. 원본 JS의 명백한 기계적 손상(예: "$1"→",")은 묻지 않고 별도 PR로 먼저 복구한다(사용자 지시 2026-11-10).

**시험지 단위 흐름(2026-11-09 사용자 결정, 루나 체계 — 2026-11-10부터 위 Sonnet 2단계로 대체):**
```
launch-exam.sh <key> <JS>        (루나 high: 전 문항 판정·구현 → runs/<key>/exam-impl[N]/{TABLE.md,SUMMARY.md,qNN/})
 → launch-exam-rev.sh <key> <JS> (루나 xhigh: 판정 타당성·구형 핵심 관계 보존 검수 → exam-rev[N]/{TABLE.md,REVIEW.md,qNN/})
 → Sonnet 최종(sonnet-final.md, 결과 폴더를 exam-rev[N]으로 지시)
 → make-dec-exam.cjs <key> <JS> <REV폴더>   (TABLE.md → dec-<key>-exam.json, 판정표 복사)
 → build-pub.py <key> <JS> <REV폴더> .tmp/work/dec-<key>-exam.json (BAD none)
 → pubflow(§3-2) → jscheck → runtime → archive/data 되돌림 → 커밋 → PR → 병합
```
시험지 JS는 저장소 상대경로(예: `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_확률과통계.js`). 루나는 동시에 4개쯤 돌려도 렌더는 `render.mjs` 잠금으로 직렬화된다.

Sonnet 최종 지시에 꼭 넣을 것: 결과 폴더 경로(rev-open/rev-open2), 입력 key, JS 경로, "questionUid·ARCHIVE_BOUND 먼저 확인", "caption 끝 정답 형식은 바꾸지 않는다", "기존 solutionImage가 있으면 비교해 낫지 않으면 KEEP_EXISTING 권장", 제외 문항.

---

## 5. 상황별 처리

### 5-1. dots 새 입력 받기
```
git fetch origin codex/svg-triage-20261107
T=$(mktemp -d); git archive FETCH_HEAD triage-20261107 | tar -x -C $T
diff -rq $T/triage-20261107 .tmp/work/triage-20261107 | grep "^Only in $T"
```
- 새 key·문항을 확인하고, **그 key의 상태 문서(PRESERVATION.md, saved-drafts-*.md, STATUS.md 첫 줄)를 먼저 읽는다.**
- 처리할 것만 로컬 사본(`.tmp/work/triage-20261107/`)에 복사(`cp -rn` 또는 `git archive … | tar -x --skip-old-files`).
- 이미 게시한 문항인지 확인: 원본 JS의 solutionImage와 `runs/<tablekey>/rev*/qNN` 존재 여부.

### 5-2. 감시(Monitor)
- 루나 종료 + dots 새 커밋을 30초 간격으로 보는 Monitor를 30분마다 다시 건다(명령은 이전 판 참고: `runs/*/*/last.txt` 새로 생긴 것 → `DONE`, triage 브랜치 HEAD 변경 → `DOTS_NEW`).
- 감시가 놓치는 경우가 있다(이미 끝난 실행). 묶음 사이에 `ls runs/*/*/last.txt`로 한 번 확인.

### 5-3. 루나가 실패하거나 이상할 때
- **사용 정책 오류로 검수가 판정 없이 끝남**(20 매산여 고1, codex.log 끝에 "violating our usage policy"): 다시 돌리지 말고 Sonnet 최종이 1차 검수까지 겸하게 지시한다.
- 엔진 렌더 실패(UNSUPPORTED)면 ENGINE_GAPS.md에 사유를 적고 해당 qNN을 `x-qNN-<사유>`로 이름을 바꿔 게시에서 뺀다(dec에서 UNSUPPORTED로 남음).
- 다른 시험지 결과가 섞임 → Sonnet이 questionUid로 잡는다. 지시서에 늘 넣는다.
- 루나가 CONTENT(원문 오류)로 판정하면 의심하고 Sonnet이 원문으로 다시 본다(20 매산여 확통 Q17 = 오류 아님).

### 5-4. 판정표 만들기 (원장에도 없는 시험지)
Sonnet(effort high)에게: `triage-20261107/<key>.md`를 `23-gangnam-girls.md` 형식(`| 문항 | 판정 | 이유 |`)으로, 전 문항. 규칙: rev-open에 결과가 있는 문항은 solutionImage 유무에 따라 REPLACE/FIGURE, 그 외 이미지 있는 문항 KEEP_EXISTING, 나머지만 원문을 node로 읽고 EXEMPT/UNSUPPORTED(그림 필요: 무엇)/CONTENT(근거). 애매하면 UNSUPPORTED. (21 팔마·21 강남여 고1, 2026-11-09)

### 5-5. 메인이 직접 정한 것들(선례)
- 새 그림이 기존보다 낫지 않으면 KEEP_EXISTING(20 순천여 고1 Q09, 20 매산여 고1 Q05, 25 강남여 수2 Q13).
- 엔진 표기 한계로 학생이 헷갈리면 게시 제외(20 순천여 고1 Q18: −i가 "음"으로 나옴).
- 숫자 눈금이 붙는 표준정규 그림은 a·b·c·d 글자 + caption에 값으로 허용(2019 매산 확통 Q14).

---

## 6. dots 입력 중 **처리하지 않는 것**
- 상태가 **DRAFT_ONLY / NOT_READY** 또는 "구현자 인계를 뜻하지 않는다"인 보존용 초안. dots가 READY로 바꾸면 처리한다.
  - 971092c7e6: 수2 10개 시험지 165문항(20 매산여·21 매산여·21 순천여·22 효천·22 팔마·22 매산·22 순천·22 복성·22 금당·23 매산여)
  - c3b91a4be3: 20 매산 수2 OPEN16
  - 590e20c047: 19 순천여 수2 16문항
  - (로컬 사본에는 복사해 둠)
- STATUS에 **HOLD**가 있는 문항: 25 제일 수2 Q14, 25 매산 수2 Q16.
- 아직 반영 안 된 엔진 개선 브랜치를 전제로 한 입력: 25 매산여 수2 Q23.

---

## 7. 현재 상태 (2026-11-09 오전)

### 7-1. 오늘 병합한 PR
| PR | 내용 |
|---|---|
| #1528 | 8묶음: 2019~22 수2 8개 시험지 19문항 |
| #1529 | 9묶음: 확통 23 제일·23 매산여·19 매산여, 수2 20 매산·19 복성 |
| #1530 | 10묶음: 확통 23 금당·23 복성·20 매산여·21 효천·22 복성(27문항) |
| #1531 | 11묶음: 확통 2019 매산·22 순천·23 순천여 + 고1 21 팔마·21 강남여(판정표 신규) |
| #1533 | 12묶음: 고1 OPEN 채움 19 팔마·20 순천여·23 매산여·23 금당(13문항) |
| #1534 | 13묶음: 고1 19 금당·20 매산·20 효천·22 금당(5문항) + 25 제일 확통 Q22 |
| #1535 | 14묶음: 고1 20 매산여(4)·22 팔마(1) |
(그 전: #1504·#1510·#1512·#1516·#1520·#1522·#1523·#1527)

### 7-2. 원장 기준 남은 OPEN (2학기 기말, 2026-11-09 오전)
| 구분 | 시험지 | CLOSED | OPEN 문항 | CONTENT |
|---|---:|---:|---:|---:|
| 고1 | 33 | 23 | 15 | 2 |
| 고2 수학II | 24 | 7 | 190 | 3 |
| 고2 확률과통계 | 17 | 6 | 96 | 6 |
- 원장에 아직 없는 시험지: 고1 21 금당·22 매산·22 팔마, 확통 19 금당·19 복성·19 순천·20 매산·21 순천여·22 효천, 수2 22 금당·22 순천(§8 자산 누락과 관련).
- 고2 2학기 과목은 수학II·확률과통계 두 가지뿐이다.

### 7-3. 이번 밤 처리한 dots 입력
확통 전부(23 금당·23 복성·20 매산여·21 효천·22 복성·2019 매산·22 순천·23 순천여), 고1 '-h1' 전부(19 금당·19 팔마·20 효천·20 매산·20 매산여·20 순천여·22 금당·23 금당·23 매산여·24 효천), 21 강남여·21 팔마·22 팔마 고1, 25 제일 확통 Q22, 25 강남여 수2 Q13(기존 유지).

---

## 8. 그림 파일 누락 복구 (2026-11-09, 사용자 승인)
- PR #1536 `fix/restore-missing-figures-20261109`: 시험지 JS가 참조하지만 main에 없던 파일 13개를 미병합 커밋 f0067f42a3·70d4ec7ad5에서 복구. 병합 완료.
  - 문제 그림: 22 금당 수2 q11·q16, 19 복성 확통 q8, 19 순천 확통 q19, 21 순천여 확통 q1
  - 해설 그림: 22 금당 수2 q08·q14·q17·q20, 20 매산 확통 q14, 22 효천 확통 q24, 22 순천 수2 q11·q22(role=img 보강)
- **남은 것:**
  - 22 순천 수2 Q16 해설 그림(q16_solution.svg)은 그림 속 영어 "period 4"가 학생 언어 계약 위반이라 제외 → 여전히 없음. 새로 그려야 한다(루나 구현 대상).
  - 복구한 옛 해설 그림 중 정답 값이 그림에 보이는 것: 20 매산 확통 Q14("호의 길이 = 2.5π"), 22 효천 확통 Q24("p = 521/1715") — 정답과 같은지 확인 후 새 그림으로 교체 후보.
  - 22 금당 수2 Q05·Q09·Q18은 문제 그림이 없어 사전검사에서 막혔던 OPEN → 이제 다시 구현할 수 있다.
  - 고1·고2 2학기 기말 밖(중학교·백발백중 유사 등)에도 참조만 있고 파일이 없는 경로가 많다(스캔 시 2,303개, 대부분 git에 없는 로컬 코퍼스로 보임). 미확인 — 중학교 작업 시작 전에 원본(git 추적) 시험지만 다시 스캔할 것.

## 9. 함정 모음 (겪은 것)
- composite-panels·number-line·stat 출력은 루트 role=img·title이 없다 → a11y.sh. 빠뜨리면 CI "Archive2 runtime contract" 실패.
- y=x·기울기 ±1 직선·원이 있는 단일 rational/sqrt-affine 그래프는 `equalUnits:true`.
- 좌표 라벨은 점의 `coordinates:true`. callout 글자에 쉼표가 있으면 얇은 TEXT 글꼴.
- 라벨 혼잡은 지시선·라벨 위치 옵션이 먼저. 라벨을 지우지 않는다.
- 문제에 없는 함수 이름(g, h, l)을 그림에 쓰면 caption에서 정의한다.
- 표준정규분포면 가로축 이름 z. 꼬리 음영이 안 보이면 `chart.span`을 줄인다. 해설이 분수인데 그림이 소수면 caption에 분수를 밝힌다.
- 대응도 원소에 괄호·−i 같은 글자를 못 쓴다(MAPPING_ELEMENT_TEXT_UNSUPPORTED). 화살표 이름에 f⁻¹를 쓰면 MISSING_KOREAN_GLYPH.
- 원본 JS `$` 짝이 깨지면 시험지 렌더가 전부 막힌다(MATH_TYPESET_INCOMPLETE). 원본 수정은 승인 + 공유 데이터 고정값 절차.
- 한 문항에 `solutionImage` 키가 두 번 있으면 pubflow 글꼴 검사가 옛 그림으로 실패 → 되돌리고 중복 줄 삭제 후 재실행(19 금당 Q17).
- **pubflow를 같은 시험지에 다시 돌릴 때**는 먼저 그 시험지 JS를 `git checkout --`하고 새로 생긴 SVG(untracked)를 지운다. 안 그러면 publish-exam.py가 실패한다.
- **부분 결정 금지:** dec는 항상 시험지 전체. 원장 기준 make-dec-open을 쓰면 안전하다.
- 루나가 PowerShell로 한글 파일을 읽고 쓰면 깨진다(SUMMARY.md가 ??로 저장되기도 함). 지시서의 node·UTF-8 규칙 유지.
- 한글 경로: `git -c core.quotepath=off`.
- 엔진 변경이 main에 들어오면 표본 몇 장을 재렌더해 바이트 비교(#1511 때 동일 확인).

---

## 10. 엔진 업그레이드 (보류)
- 사용자 결정: dots의 OPEN 조사·입력 채우기가 끝난 뒤에 한다.
- 그때 Sonnet이 `ENGINE_GAPS.md`와 최신 OPEN 목록에서 진짜 공백만 골라 설계안을 내고, 1~3기능씩 구현한다(`ops/svg-m1/BRIEF_RULES.md`, `briefs/engine-gap-template.md`).
- 2026-11-09 추가된 공백: 23 금당 고1 Q16(조판), Q20(multi-curve 시간 초과), 24 효천 고1 Q14(구간 불연속 선언), 20 순천여 고1 Q18(−i 원소), 2019 매산 확통 Q14(표준정규 눈금 근접).

---

## 11. 집 PC 라인: 고1 1학기 중간·기말, 2학기 중간 (2026-11-09~)
- 2026-11-09 사용자 결정: 집 PC는 중등 대신 고1 1mid·1final·2mid를 맡는다(고1 2학기 기말·고2는 고등 PC). 브랜치 `svg-mid/batchNN-…`, 엔진 공백은 `ops/claude-batch/ENGINE_GAPS_MIDDLE.md`. 이유: PC별 담당을 나눠 겹침을 막기 위해서다.
- 순서: 첫 묶음 이후 최신 연도부터 내림차순(그림 수·학기 무관). 대기열 `mkqueue-h1.cjs` → `qrun.sh`(슬롯 3, 렌더가 `render.lock` 하나라 더 늘려도 대기만 길어진다). 이유: 최신 시험지가 학생에게 먼저 필요하다.
- 고1 1학기는 함수 위주: 일차·이차함수 문항은 그래프가 필요하면 빠짐없이 만든다(`exam-common.sh` `exam_subject`). 이유: 함수 문항은 그래프가 풀이 이해의 핵심이다.
- 시험지 전체 플랜은 루나가 구현하며 세운다(DeepSeek은 이 PC에서만 허용되나 그림을 못 봐 쓰지 않기로 함). 이유: 그림을 보지 못하면 플랜이 어긋난다.
- 함정: caption 수식을 "엑스·와이·루트"로 소리 풀어 쓰던 것 → 지시문에 기호 사용 명시. 근호 좌표 자동 표기 "−1+(−1√10)" → SOURCE_POINT 식 좌표로 우회. `exam-common.sh`를 고칠 때 따옴표 하나가 빠져 실행 13건이 분류표 없이 돌았음 → 고친 뒤 `bash -n`으로 확인.
- 골든 표본(25 효천·25 매산여 2학기 중간)은 이제 게시한다: rebind-m2-create-golden-sample-evidence.mjs --source <JS>로 재고정(#1572), 사용자 결정 2026-11-10 '지금은 골든 아님'. 이유: 게시하면 봉인 증거 SHA가 달라져 m2 create-gate 테스트가 실패하므로 재고정이 필요하다. 주의: 게시 뒤 `git checkout -- archive/data`를 하면 재고정한 증거 10개(archive/data/r2e-intake/m2/*.create.physical-evidence.json)가 되돌려지니 그 파일은 제외한다.
- 첫 PR: 이번 5개 시험지(제목만; 25 효천고 2학기 중간은 위 사유로 제외).

- 2026-11-10 흐름 전환: 루나 사용량 한도로 고1 시험지는 DeepSeek 초안(`ds-launch-exam.sh`, `qrun-ds.sh`) → Sonnet A 구현·검수(`prompts/sonnet-exam-impl.md`) → Sonnet B 최종(`sonnet-final.md`) 순서로 돌린다. 이유: 루나를 쓸 수 없어도 대기열이 멈추지 않게 하기 위해서다. 위의 "플랜은 루나가 구현" 항목은 루나 한도가 풀릴 때까지 이 흐름이 대신한다.
