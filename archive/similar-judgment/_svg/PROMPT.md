# 유사 시험지 문제·해설 SVG 작업 — Gemini(안티그래비티) 지시서

목표: 이 브랜치의 유사 시험지 문항에 필요한 **문제 그림과 해설 그림을 저장소의 SVG 엔진으로** 만든다.
문항마다 **설계 → plan → 엔진 렌더 → PNG 확인 → publish 초안** 순서를 지킨다.
각 단계의 증거를 하네스(`harness.json`)에 채우고, 검사기가 PASS해야 끝난 것이다.
이유: 그림을 마음대로·대충 만들거나, 손으로 SVG를 쓰거나, plan과 다른 그림을 넣는 일을 막기 위해서다. 그림이 문항 숫자와 맞는지 다음 검수자(Sonnet)가 근거로 확인할 수 있게 하기 위해서이기도 하다.

---

## 0. 절대 규칙

- **SVG는 엔진 출력만 쓴다.** 손으로 쓴 SVG, 스크립트로 조립한 SVG, 다른 도구가 낸 SVG는 금지다.
  - 검사기는 작업 폴더의 모든 `.svg`가 "지금 plan.json을 엔진이 렌더한 결과"인지 확인한다(`STRAY_SVG`, `NOT_RENDERED_FROM_THIS_PLAN`).
- **plan을 고치면 반드시 다시 렌더한다.** 검사기는 렌더 기록(`out/attempts.jsonl`)의 plan 해시가 지금 plan.json 해시와 같은지 본다.
- **한 번에 시험지 1개씩** 끝까지 한다. 끝나면 커밋·push하고 다음 시험지로 간다.
  - 순서는 `archive/similar-judgment/_svg/index.json`의 위에서부터다. 최근 연도가 먼저 오도록 정렬돼 있다.
- **판정 칸(설계, 관찰, 사유)은 문항을 직접 읽고 하나씩 채운다.** 스크립트·일괄 치환으로 채우지 않는다.
  - 문항끼리 같은 문장을 쓰지 않는다. 검사기가 막는다.
- **브랜치:** `antigravity/judgment-out-20261119`만 쓴다. main에 push·merge·PR하지 않는다.
- **새로 쓰는 스크립트는 Node.js(`.mjs`/`.cjs`)로만** 쓴다. 엔진이 안에서 쓰는 python은 그대로 둔다.
- **시험지 JS(stage)의 문항·정답·해설과 `image`·`solutionImage` 필드를 고치지 않는다.**
  - 게시(필드 연결, assets 복사)는 Sonnet 검수 뒤 다른 라인이 한다.
  - 문항이 틀렸으면 그림을 그리지 말고 `CONTENT`로 보고한다.
- 하지 않는다: 엔진 코드 수정, 검사기 수정, 기준 완화, `git worktree prune`, 강제 push, rebase.

## 1. 먼저 읽을 문서 (처음 한 번, 끝까지)

1. `docs/agents/visual-svg.md`
   - 맨 위 "정본 — 새 SVG는 무조건 엔진으로"
   - "유사(1:1 변형) 시험지 그림은 판정하지 않는다"(19~20행)
   - "해설 그림 정보 우선"
   - "다른 AI 라인용 SVG 도형 엔진 작업 프롬프트" 블록 전체. 3번 판정 기준은 이 작업에도 그대로 적용한다.
2. `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`: plan 계약 정본이다.
3. `archive/tools/geometry-equation/ops/svg-m1/guide/guide-tips.md`, `guide-core.md`, 그리고 형태별 발췌 하나(`guide-plane` / `guide-solid` / `guide-stat` / `guide-graph`).
4. 정답지 예시: `archive/tools/geometry-equation/ops/golden.manifest.json`, `ops/golden/<item>/plan.json`.

## 2. 준비 (집 PC, 처음 한 번)

```bash
cd C:/Users/USER/w-sim-home
git fetch origin
git merge origin/ops/similar-svg-harness-20261120   # 하네스·검사기·최신 엔진(main)이 들어온다
mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/
bash archive/tools/geometry-equation/ops/claude-batch/restore.sh       # .tmp/work/ 로 렌더 도구 펼침
node .tmp/work/render.mjs                                               # "usage: render-plan.mjs …" 가 나오면 준비 끝
```

- 렌더 의존성(playwright, 엔진 python 패키지, 글꼴)이 없으면 `archive/tools/geometry-equation/ops/claude-batch/README.md` "새 PC 준비" 4~6번대로 맞춘다.
  - 필요하면 `GEOMETRY_NODE_MODULES`, `GEOMETRY_BROWSER_EXECUTABLE`를 지정한다.
- 렌더를 돌릴 수 없으면 그 사실만 보고하고 멈춘다. 렌더하지 않은 그림을 DONE으로 적지 않는다.

## 3. 하네스 구조

- 시험지마다 `archive/similar-judgment/_svg/exams/<시험지>/harness.json`이 있다.
- 미리 채워 둔 값(고치지 않는다): `stagePath`, `originalPath`, 그리고 문항별 `need`, `why`, `currentImage`, `originalImage`, `reusePlan`.
  - `need: "YES"`: 원본이나 stage의 같은 번호에 이 그림이 있다. 반드시 만든다.
    - 해설 그림은 원본에 있으면 YES다.
    - stage에 원본 PNG가 복사돼 있어도 이 문항 숫자로 다시 그린다.
  - `need: "CHECK"`: 원본에는 문제 그림이 있는데 유사 발문은 그림을 언급하지 않는 경우, 또는 발문만 그림을 언급하는 경우다.
    - 문항을 읽고 그림이 필요하면 만들고, 그림 없이 풀리면 `NOT_NEEDED`로 둔다(4-f).
  - `need: "NO"`: 손대지 않는다.
- 작업 폴더: 문항·면마다 `archive/similar-judgment/_svg/exams/<시험지>/qNN-problem/`, `qNN-solution/`
  - 그 안에 `item.json`, `plan.json`, `publish.json`, `out/`(렌더 출력), `figure.png`를 둔다.

## 4. 문항 하나 처리 (need가 YES 또는 CHECK인 면마다, 이 순서 그대로)

**a. 읽기.** stage 문항의 발문·보기·정답·해설을 읽는다. 원본(`originalPath`) 같은 번호 문항과 원본 그림(`originalImage`)도 본다.
- 정답을 직접 풀어 stage 정답과 맞는지 확인한다. 다르면 그리지 말고 `CONTENT`로 둔다(4-f).

**b. 설계(`design`), plan보다 먼저 채운다.**
- `kind`: plane / graph / stat / solid / number-line 등
- `basedOn`: 본뜰 plan 경로(저장소 안의 실제 파일)
  - 순서대로 찾는다: `reusePlan`(원본·기존 유사의 같은 번호 plan) → 같은 형태의 `ops/golden/<item>/plan.json` → 이미 통과한 다른 plan.
- `solutionUses`(해설 그림만): 그림이 보여 줄 해설 단계. 해설에서 **글자 그대로 6자 이상** 인용한다.
- `mustShow`: 그림에 꼭 들어갈 값·라벨 2개 이상(점 이름, 길이, 좌표, 계급값, 식 등).
  - 각 값은 이 문항의 발문·보기·해설에 실제로 있는 문자열이어야 한다.
  - 해설 그림은 해설이 쓰는 중간값을 최대한 넣는다.
  - 문제 그림은 발문이 주는 것만 넣고, 정답·새 보조선은 넣지 않는다.

**c. plan.** `item.json`({"sourcePath": stagePath, "ordinal": 문항 번호})과 `plan.json`을 쓴다.
- plan은 `basedOn`의 구조를 본떠 **이 문항의 숫자·조건으로 바꾼다.** 그대로 복사한 plan은 검사기가 막는다(`PLAN_UNCHANGED_COPY`).
- `mustShow`의 값이 모두 plan에 들어가야 한다.
- `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <plan.json>`가 OK가 될 때까지 고친다.

**d. 엔진 렌더.**
```bash
node .tmp/work/render.mjs --item <폴더>/item.json --plan <폴더>/plan.json --out <폴더>/out
```
- 결과가 ARCHIVE_BOUND여야 한다. 실패하면 오류의 hint·fix대로 plan을 고쳐 다시 렌더한다. 횟수 제한은 없다.
- 라벨이 떠 있거나 겹치면 지시선(callout/leader)을 먼저 쓴다. 필수 라벨을 지워서 통과시키지 않는다.
- 렌더는 한 번에 하나씩 한다.

**e. PNG 확인.**
```bash
node .tmp/svg-m1/svg2png.cjs <폴더>/out/<name>-solution.svg <폴더>/figure.png 600
```
- PNG를 **직접 열어 보고** 문항과 대조한다.
  - 숫자가 이 문항 값인지
  - 라벨이 대상 곁에 있는지
  - 문제 그림에 정답이 드러나지 않는지
  - 해설이 쓰는 교점·눈금이 그림 안에 있는지
- `pngObservation`에 본 것을 30자 이상 적는다. `mustShow` 값 하나 이상과 그 위치를 포함한다(예: "점 P(2, 3)이 직선 위 오른쪽에…").
- 틀리면 plan을 고쳐 d부터 다시 한다.

**f. 상태(`status`)를 하나로 정한다.**
- `DONE`: a~e를 마치고 g까지 썼다.
- `NOT_NEEDED`(CHECK만 가능): 그림 없이 풀린다는 근거를 `note`에 「…」로 문항을 글자 그대로 4자 이상 인용해 적는다.
- `UNSUPPORTED`: 엔진이 못 그린다.
  - 시도한 `planPath`는 남겨 둔다.
  - `note`에 빠진 엔진 기능을 20자 이상 적는다.
  - 지시선 → plan 구조 바꾸기를 먼저 시도한다.
- `CONTENT`: 문항·정답·해설이 맞지 않는다. `note`에 다시 계산한 정답과 이유를 적는다.

**g. publish 초안(`publish.json`).**
```json
{"alt": "그림 설명", "caption": "풀이 요약, 끝에 정답", "size": "렌더 결과 <name>-result.json의 sizeClass"}
```
- alt·caption에는 이 문항의 숫자가 들어가야 한다.
- 입력용 표기(`^`, `sqrt(`, `*`, `f^-1`)는 쓰지 않는다.
- 예시 값으로 그렸으면 caption에 "예:"라고 밝힌다.

하네스에 `planPath`, `pngPath`, `status`, `note`를 채운다. 경로는 저장소 루트 기준 상대 경로로 쓴다.

## 5. 시험지 마감

```bash
node archive/tools/similar-import/svg-harness/check-svg-harness.mjs archive/similar-judgment/_svg/exams/<시험지>/harness.json
```
- 검사기가 `PASS <시험지>`를 낼 때까지 고친다. 검사기를 고치거나 우회하지 않는다.
- PASS가 나오면 커밋한다. 커밋에 넣는 것과 빼는 것은 다음과 같다.
  - 넣는다: 그 시험지 폴더의 `harness.json`, `item.json`, `plan.json`, `publish.json`, 엔진 출력 `out/*-solution.svg`, `out/*-result.json`, `out/attempts.jsonl`
  - 뺀다: PNG, `out/*-state.json`
  ```bash
  git add archive/similar-judgment/_svg/exams/<시험지>
  git reset -q -- 'archive/similar-judgment/_svg/exams/<시험지>/**/*.png' 'archive/similar-judgment/_svg/exams/<시험지>/**/*-state.json'
  git commit -m "svg: <시험지> 문제·해설 그림 (엔진, 하네스 PASS)"
  git push origin antigravity/judgment-out-20261119
  ```

## 6. 시험지마다 보고 (표)

| 문항 | 면 | need | status | 렌더 수 | mustShow | 한 줄 메모 |
| --- | --- | --- | --- | --- | --- | --- |

표 아래에 다음을 적는다.
- 검사기 PASS 출력 한 줄
- UNSUPPORTED 문항과 빠진 엔진 기능
- CONTENT 문항과 다시 계산한 정답
- 사용자 결정이 필요한 것

막힌 것을 한 줄로 뭉뚱그리지 말고 문항마다 적는다.
