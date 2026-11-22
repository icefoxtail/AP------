# 인계: 해설 SVG 묶음 작업 (DeepSeek 초안 → Sonnet 검수·마감 → 묶음 PR)

최종 갱신 2026-11-19. 다음 세션은 이 파일 → `docs/agents/visual-svg.md` "현행 흐름" 절 → `ops/claude-batch/ENGINE_GAPS*.md` 순으로 읽는다.

**현행 흐름(2026-11-19 사용자 지시) — 대규모 캠페인(SVG 라인)용. 문항 수리·유사문제 반입 등 소량 그림은 DeepSeek 없이 Sonnet이 엔진으로 직접 만들고 메인이 PNG를 검수한다(`docs/agents/visual-svg.md` "현행 흐름" ②):** ① DeepSeek 초안(`ds-launch-exam.sh <key> <시험지 JS>`, 지시문 `prompts/ds-exam-draft.md`: 판정·plan·렌더·PNG를 직접 보고 1차 수정) → ② Sonnet 검수·마감 한 번(`prompts/sonnet-exam-impl.md`, effort high: 원문·정답·해설 대조, plan 수정·재렌더, 기계 점검) → ③ 메인이 PNG 표본 확인 후 게시·PR(시험지 5개쯤 묶음). 두 번째 Sonnet 검수는 두지 않는다. 메인이 PNG 표본에서 결함을 찾으면 메인이 직접 plan·publish를 고쳐 `render.mjs`로 다시 렌더한다(손 SVG 금지; 이유: 결함 하나에 지시서를 쓰고 Sonnet을 다시 돌리는 것보다 빠르다). 같은 묶음에 결함이 여럿이거나 같은 종류가 반복되면 지적 목록을 붙여 그 묶음을 Sonnet 검수·마감 단계로 돌려보낸다. `sonnet-final.md`는 과거(Sonnet B) 지시서다. 엔진 미지원(백 개 중 한두 개)은 손으로 그리지 않고 UNSUPPORTED + 증거로 `ENGINE_GAPS*.md`에 남긴다.

**도구 위치:** 스크립트·지시서는 `archive/tools/geometry-equation/ops/claude-batch/`에 있고, `restore.sh`로 `<저장소>/.tmp/work/`에 펼친다(`.tmp/svg-m1`과 같은 방식). 작업 데이터(`runs/`, `pub/`, `triage-20261107/`, `dec-*.json`)는 `.tmp/work/`에만 있고 git에 없다. 문서의 `.tmp/work/`·상대경로는 저장소 루트 기준이다(스크립트가 루트를 자동 탐지). **새 PC·새 작업 트리면** `ops/claude-batch/README.md`의 "새 PC 준비"를 먼저 한다. 도구·지시서를 고쳤으면 `restore.sh --save`로 되돌려 커밋한다.

**과거 이력(git에 남음):** 2026-11-08~10 루나(Codex) 구현·검수 → Sonnet 최종 체계(루나 동시 4~7개, 묶음당 CI 약 45분), 2026-11-09 PC 분담·묶음 PR 현황, 2026-11-10 루나 한도로 DeepSeek 초안 → Sonnet A·B로 전환. 루나 전용 스크립트(`launch-*.sh`, `run-*.sh`, `resume.sh`, `qrun.sh`)는 README에 "과거(루나)"로 표시했다.

---

## 1. 역할

| 누가 | 하는 일 |
|---|---|
| Claude 메인 | 지휘·판단·PNG 직접 확인·게시·PR·병합. 코드는 직접 고치지 않고, PNG 표본 결함만 plan·publish를 고쳐 재렌더한다(결함이 많으면 Sonnet으로 돌려보냄). |
| DeepSeek | 시험지 전체 판정·plan·렌더·PNG 확인 초안. |
| Sonnet 서브에이전트 | 검수·마감(effort high, 한 번). 판정표 작성도 맡긴다. |
| dots(별도 라인) | OPEN 문항 입력을 triage 브랜치 `codex/svg-triage-20261107`에 올린다(§5-1). |

- **위임 금지:** 정해진 DeepSeek·Sonnet 단계 밖의 다른 모델·하위 에이전트에 넘기지 않는다. 작업 단위는 **시험지 하나 전체**이고, 구형 SVG(판별은 `prompts/exam-impl.md`)는 신형 엔진으로 재작업하되 구형의 핵심 관계를 목록으로 먼저 적어 신형에 담는다(`compare.png`). dots 입력 초안은 출발점일 뿐 원문과 대조해 고친다.
- **손으로 SVG 작성 금지.** 렌더는 `node .tmp/work/render.mjs`로만.
- **[2026-11-17 해설 그림은 정답이 그림에 있어도 반려하지 않고 과정 정보를 최대한 넣는다. 아래는 문제 그림 기준.]** 정답·보기 번호는 문제 그림·alt에 넣지 않는다. caption 끝에만 "정답은 …이다."
- **원본 JS·archive/assets는 승인 없이 수정하지 않는다.** 커밋에는 시험지 JS의 solutionImage* 필드, 새 SVG, 그 시험지의 원장 파일(`production/exam-figure-ledger/<원본 경로>.json`)만. 검사를 완화하지 않는다.

## 2. 묶음 방식

- 시험지 4~6개(문항이 적으면 더 많이)를 PR 하나로. 병합 뒤 `git fetch origin main && git checkout -b svg/batchNN-YYYYMMDD origin/main`.
- 공식 렌더는 `render.lock` 하나라 한 번에 하나씩 돈다. 동시 구현을 늘려도 대기만 길어진다.
- Auto-fix가 켜져 있어 CI는 직접 폴링하지 않는다. 묶음 사이에 `gh pr view <n> --json statusCheckRollup`으로 한 번 본다.

## 3. 도구 (`.tmp/work/`, 원본은 `ops/claude-batch/`)

### 3-2. 게시
- `ledger2md.cjs <tablekey> <시험지명>` — 판정표가 없고 **원장에는 있는** 시험지의 판정표를 원장 상태로 생성.
- 판정표가 원장에도 없는 시험지 → Sonnet에게 판정표 작성(§5-4).
- `make-dec-open.cjs <key> <JS> [srcSub]` — 결정 파일 `dec-<key>-open.json` 생성. 기준: **원장 현재 상태**(2026-11-09 고침) → 이미지 있는 게시 문항 KEEP_EXISTING, srcSub(기본 rev-open)에 있는 문항 REPLACE/FIGURE, 나머지 OPEN은 UNSUPPORTED, OPEN_CONTENT는 CONTENT. 메인이 특정 문항을 바꿔야 하면 dec JSON을 직접 고친다(예: 기존 그림 유지 → KEEP_EXISTING).
- `make-dec.cjs <key> <JS>` — 처음 게시하는 시험지(rev 기준).
- `build-pub.py <key> <JS> <srcdir> <dec.json>` — pub/<key> 생성, 기계 점검(`BAD:`): ARCHIVE_BOUND, questionUid, size=sizeClass, alt/caption, alt의 ①~⑤, SVG title/desc 깨짐, 루트 role=img, ±1 직선·원의 equalUnits.
- `a11y.sh <qdir>` — 더는 필요 없다(엔진이 composite·number-line·solid 출력에 루트 role=img·title·desc를 직접 쓴다, plan caption·accessibilityDescription). 이 엔진 이전에 렌더한 SVG에만 쓰며, 이미 있으면 METADATA_ALREADY_PRESENT로 무해하게 끝난다.
- 게시: `PYTHONIOENCODING=utf-8 python .tmp/svg-m1/pubflow.py --batch .tmp/work/pub/manifest-batchNN.json` (형식은 pub/manifest-batch13b.json 참고, 경로는 manifest 기준 상대).
- 점검: `git -c core.quotepath=off status --porcelain | grep '^ M.*\.js$' | cut -c4- | while read f; do node .tmp/work/jscheck.cjs "$f"; done` (nonImageChanged []이어야 함) → `node tools/check-archive2-runtime.cjs`(180 pass) → `git checkout -- archive/data`.
- 커밋: `git add archive/exams/original/high archive/tools/geometry-equation/production/exam-figure-ledger` + 해당 시험지 새 SVG(`archive/assets/images/<시험지>/…`)만. 커밋 끝에 Co-Authored-By 줄, PR 본문 끝에 Claude Code 줄.
- 원장(2026-11-17부터): 시험지 하나 = 파일 하나(`production/exam-figure-ledger/<archive/exams/original 아래 경로>.json`, 머리 `_meta.json`). pubflow·ledger-upsert는 그 시험지 파일만 쓴다. 이미 PUBLISHED인 문항은 spec의 published·exempt_override·demote로 번호를 직접 넘길 때만 바뀌므로, 일부 문항만 다시 게시해도 나머지 PUBLISHED가 OPEN으로 덮이지 않는다. 서로 다른 시험지 PR은 원장에서 충돌하지 않으니 순서를 기다리지 않고 각자 CI 녹색이면 병합한다. 같은 시험지 파일이 충돌하면 main 판을 받고 그 시험지 spec으로 `ledger-upsert.py`를 다시 돌린다. 옛 한 파일(`exam-figure-ledger.json`)을 고친 브랜치는 main을 병합한 뒤 `python archive/tools/geometry-equation/ops/svg-m1/figure_ledger.py port-ledger-change --base $(git merge-base HEAD origin/main) --head HEAD`로 옮기고 옛 파일은 `git rm`한다. `.tmp/svg-m1/`은 main을 받은 뒤 다시 복원한다(옛 사본은 옛 한 파일을 다시 만든다; CI 테스트 `tests/figure-ledger-split.test.js`가 막는다).

### 3-3. 기록 파일
- `ENGINE_GAPS.md` — 엔진이 못 그려 OPEN으로 남긴 문항과 사유. 엔진 업그레이드 때 쓴다.
- `NOTES.md` — 예전 상태 메모.
- `HANDOFF-history-20261109.md` — 이 문서 이전 판(날짜별 상태 기록 포함).

---

## 4. 표준 흐름 한 장 요약

```
ds-launch-exam.sh <key> <JS>      (DeepSeek 초안 → runs/<key>/ds-draft[N]/{TABLE.md,SUMMARY.md,qNN/})
 → Sonnet 검수·마감 (prompts/sonnet-exam-impl.md: 초안 폴더를 보고 직접 수정, 결과 폴더 지정)
 → make-dec-exam.cjs <key> <JS> <결과 폴더>   (TABLE.md → dec-<key>-exam.json)
 → build-pub.py <key> <JS> <결과 폴더> .tmp/work/dec-<key>-exam.json   (BAD none)
 → 메인이 PNG 표본 확인 → pubflow(§3-2) → jscheck → runtime → archive/data 되돌림 → 커밋 → PR → 병합
```
시험지 JS는 저장소 상대경로(예: `archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_확률과통계.js`). 원본 JS의 명백한 기계적 손상(예: "$1"→",")은 묻지 않고 별도 PR로 먼저 복구한다(2026-11-10). Sonnet 지시에 넣을 것: 초안 폴더·결과 폴더 경로, 입력 key, JS 경로, "questionUid·ARCHIVE_BOUND 먼저 확인", "caption 끝 정답 형식은 바꾸지 않는다", "기존 solutionImage가 있으면 비교해 낫지 않으면 KEEP_EXISTING". DeepSeek을 쓸 수 없으면 Sonnet이 `prompts/sonnet-exam-create.md`로 판정·플랜·구현을 직접 한다.

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


### 5-4. 판정표 만들기 (원장에도 없는 시험지)
Sonnet(effort high)에게: `triage-20261107/<key>.md`를 `23-gangnam-girls.md` 형식(`| 문항 | 판정 | 이유 |`)으로, 전 문항. 규칙: rev-open에 결과가 있는 문항은 solutionImage 유무에 따라 REPLACE/FIGURE, 그 외 이미지 있는 문항 KEEP_EXISTING, 나머지만 원문을 node로 읽고 EXEMPT/UNSUPPORTED(그림 필요: 무엇)/CONTENT(근거). 애매하면 UNSUPPORTED. (21 팔마·21 강남여 고1, 2026-11-09)

### 5-5. 메인이 직접 정한 것들(선례)
- 새 그림이 기존보다 낫지 않으면 KEEP_EXISTING(20 순천여 고1 Q09, 20 매산여 고1 Q05, 25 강남여 수2 Q13).
- 엔진 표기 한계로 학생이 헷갈리면 게시 제외(20 순천여 고1 Q18: −i가 "음"으로 나옴).
- 숫자 눈금이 붙는 표준정규 그림은 a·b·c·d 글자 + caption에 값으로 허용(2019 매산 확통 Q14).

---

## 6. dots 입력 중 **처리하지 않는 것**
- 상태가 **DRAFT_ONLY / NOT_READY** 또는 "구현자 인계를 뜻하지 않는다"인 보존용 초안(dots가 READY로 바꾸면 처리), STATUS에 **HOLD**가 있는 문항, 아직 main에 없는 엔진 개선을 전제로 한 입력.
- 엔진 렌더 실패는 UNSUPPORTED로 두고 `ENGINE_GAPS*.md`에 사유를 적는다. 다른 시험지 결과가 섞이면 questionUid로 잡는다.

## 9. 함정 모음 (겪은 것)
- composite-panels·number-line·solid 출력은 이제 엔진이 루트 role=img·title·desc를 쓴다(a11y.sh 불필요). 엔진 이전에 렌더한 그림은 다시 렌더하거나 a11y.sh로 보완한다. 빠뜨리면 CI "Archive2 runtime guard" 잡의 "Verify original routes, response budgets, and storage failures" 단계(옛 "Archive2 runtime contract" 잡) 실패.
- y=x·기울기 ±1 직선·원이 있는 단일 rational/sqrt-affine 그래프는 `equalUnits:true`.
- 좌표 라벨은 점의 `coordinates:true`. callout 글자에 쉼표가 있으면 얇은 TEXT 글꼴.
- 라벨 혼잡은 지시선·라벨 위치 옵션이 먼저. 라벨을 지우지 않는다.
- 문제에 없는 함수 이름(g, h, l)을 그림에 쓰면 caption에서 정의한다.
- 표준정규분포면 가로축 이름 z. 꼬리 음영이 안 보이면 `chart.span`을 줄인다. 해설이 분수인데 그림이 소수면 caption에 분수를 밝힌다.
- 대응도 원소에 괄호·−i 같은 글자를 못 쓴다(MAPPING_ELEMENT_TEXT_UNSUPPORTED). 화살표 이름에 f⁻¹를 쓰면 MISSING_KOREAN_GLYPH.
- 원본 JS `$` 짝이 깨지면 시험지 렌더가 전부 막힌다(MATH_TYPESET_INCOMPLETE). 원본 수정은 승인 + 공유 데이터 고정값 절차.
- 한 문항에 `solutionImage` 키가 두 번 있으면 pubflow 글꼴 검사가 옛 그림으로 실패 → 되돌리고 중복 줄 삭제 후 재실행(19 금당 Q17).
- **pubflow를 같은 시험지에 다시 돌릴 때**는 먼저 그 시험지 JS를 `git checkout --`하고 새로 생긴 SVG(untracked)를 지운다. 안 그러면 publish-exam.py가 실패한다.
- **부분 결정 금지:** dec는 항상 시험지 전체. 원장 기준 make-dec-open을 쓰면 안전하다. (2026-11-17부터 ledger-upsert가 넘기지 않은 기존 PUBLISHED를 지키므로 부분 게시가 원장을 덮지는 않는다. 그래도 dec는 시험지 전체로 만든다.)
- 한글 경로: `git -c core.quotepath=off`.
- 엔진 변경이 main에 들어오면 표본 몇 장을 재렌더해 바이트 비교(#1511 때 동일 확인).

---


## 10. 엔진 업그레이드 (보류)
- 사용자 결정: dots의 OPEN 조사·입력 채우기가 끝난 뒤에 한다.
- 그때 Sonnet이 `ENGINE_GAPS.md`와 최신 OPEN 목록에서 진짜 공백만 골라 설계안을 내고, 1~3기능씩 구현한다(`ops/svg-m1/BRIEF_RULES.md`, `briefs/engine-gap-template.md`).
- 2026-11-09 추가된 공백: 23 금당 고1 Q16(조판), Q20(multi-curve 시간 초과), 24 효천 고1 Q14(구간 불연속 선언), 20 순천여 고1 Q18(−i 원소), 2019 매산 확통 Q14(표준정규 눈금 근접).

---


## 11. 고1 1학기 중간·기말, 2학기 중간 (집 PC 라인, 2026-11-09~)
- 브랜치 `svg-mid/batchNN-…`, 엔진 공백은 `ops/claude-batch/ENGINE_GAPS_MIDDLE.md`. 최신 연도부터 내림차순. 고1 1학기는 함수 위주라 그래프가 필요한 일차·이차함수 문항은 빠짐없이 만든다.
- 함정: caption 수식을 "엑스·와이·루트"로 소리 풀어 쓰지 말고 기호를 쓴다. 근호 좌표 자동 표기 "−1+(−1√10)"는 SOURCE_POINT 식 좌표로 우회. `exam-common.sh`를 고친 뒤에는 `bash -n`으로 확인한다.
- 골든 표본(25 효천·25 매산여 2학기 중간)은 게시한다: `rebind-m2-create-golden-sample-evidence.mjs --source <JS>`로 재고정(#1572). 게시 뒤 `git checkout -- archive/data`를 하면 재고정한 증거 10개(`archive/data/r2e-intake/m2/*.create.physical-evidence.json`)가 되돌려지니 그 파일은 제외한다.
