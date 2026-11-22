# 고1 2학기 기말 유사 — SVG 엔진 6건 수정 실행 플랜 (Codex 인계)

> **상태: PLAN_ONLY / ENGINE_NOT_RUN / SOURCE_NOT_CHANGED**  
> 작성: 2026-11-22 (KST) · 계획 소유: GPT 시각 감사 · 실행 소유: 별도 Codex SVG 엔진 작업 공간

## 0. 목적과 경계

- 목표는 **23종·515문항·연결 시각물 276개에 대한 기완료 시각 감사**에서 발견된 **6개 자산의 실제 결함만** SVG 엔진으로 고치고, 원문·해설·학생 화면에서 재검증하는 것이다. 나머지 270개 연결 자산이나 다른 과목·학기를 재제작하지 않는다.
- 이 문서는 `icefoxtail/AP------`의 감사/MD 전용 브랜치 `work/solution-upgrade-h1-similar-sample-20261122`에 둔다. **이 브랜치에 SVG·JS를 수정하지 않는다.** 실제 수리는 Codex가 최신 `origin/main` 기반의 별도 워크트리·작업 브랜치(예: `work/h1-2final-similar-svg-repair-20261122`)에서 진행한다. Codex는 이 계획과 [시각 감사 보고서](./H1_2FINAL_SIMILAR_VISUAL_QA_20261122.md)를 읽는다.
- 이번 사용자 요청의 종료 조건은 **실행 플랜을 감사 브랜치에 저장**하는 것이다. 아래 구현·렌더·출고는 **아직 실행하지 않았다**. 이 계획을 저장했다는 이유로 6건을 PASS/수정 완료로 바꾸지 않는다.
- 새 SVG 또는 대체 SVG는 **반드시 `archive/tools/geometry-equation/`의 공식 SVG 엔진**에서 생성한다. 기존 SVG를 수작업으로 고치거나 다른 스크립트에서 SVG 문자열·패스를 직접 만들어 게시하는 방법은 금지한다. 엔진 자체 수리는 이 작업 범위 밖이다.

## 1. 먼저 읽을 정본·실물

Codex 작업자는 다음을 실제로 열어 읽고, 문서 간 충돌 시 **최신 사용자 명시 지시·범위가 좁은 최신 정본**을 우선한다.

1. `AGENTS.md`, `archive/AGENTS.md`, `docs/agents/common.md`, `docs/agents/outcome-method-review.md`, `docs/agents/visual-svg.md`, `docs/agents/git-evidence.md`.
2. `archive/tools/geometry-equation/HANDOFF_SVG_CODEX.md`와 `HANDOFF_SVG_ENGINE.md`의 현행/준비 절차.
3. `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`, `ops/svg-m1/briefs/plan.md`, `plan-current.md`, `review1.md` 및 **기존 그림 교체용 독립 검수** 규칙, `ops/svg-m1/guide/guide-core.md`·`guide-tips.md`와 대상 형태별 guide.
4. 각 시험지의 `archive/exams/similar/high/h1/2final/<시험지>.js`에서 해당 `id`의 **현재** `content`, `choices`, `answer`, `solution`, `image`/`solutionImage` 및 alt·caption·size. 해당 SVG 원본과 필요하면 기존 골든 엔진 plan을 함께 읽는다.
5. 감사 기준 자료: [6건 발견 내용과 23종 현황](./H1_2FINAL_SIMILAR_VISUAL_QA_20261122.md), 각 시험지의 `*_DEEP_AUDIT.md` 후속 시각 검수 절.

**주의:** `HANDOFF_SVG_CODEX.md`의 2026-11-04 모델·캠페인 범위는 과거 인계 이력이다. 이번 최신 요청은 **고1 2학기 기말 유사 6개 자산 한정 수리**이며, 현행 `docs/agents/visual-svg.md`의 2026-11-19 소규모 수리 흐름과 엔진 강제 규칙을 적용한다. 대규모 캠페인이나 다른 시험지 생산으로 확대하지 않는다.

## 2. 수정 대상 — 경로와 기준 Blob SHA

원본 위치는 `archive/assets/images/<시험지>/`이고, 시험지 JS 안의 `assets/images/...` 참조는 `archive/` 기준 상대 경로다. 아래 SHA는 **2026-11-22 감사 브랜치에서 읽은 기존 Git Blob SHA**이며, Codex는 착수 시 최신 `main`과 해당 SHA를 비교해 변경이 있으면 새 판본을 먼저 재검수한다.

| ID | 우선 | 시험지 JS 파일명(접미 `.js`) | qid/슬롯 | 기존 이미지 파일명 | 기존 Blob SHA |
|---|---|---|---|---|---|
| V-05 | **P0** | `25_팔마고_2학기_기말_고1_유사3` | 1 / `image` | `q01-problem.svg` | `dcc5278524c9eb133645bc90cf92c4f1b3978542` |
| V-01 | P2 | `25_금당고_2학기_기말_고1_유사` | 22 / `solutionImage` | `q22-solution.svg` | `05e16f4565d257bcbeaab844e233ce529aaea646` |
| V-02 | P2 | `25_금당고_2학기_기말_고1_유사2` | 11 / `solutionImage` | `q11-solution.svg` | `1e5952592fac3e5a472cc597fd39f5cce605b40d` |
| V-03 | P2 | `25_금당고_2학기_기말_고1_유사3` | 11 / `solutionImage` | `q11-solution.svg` | `77896de649f7b0b68bda33db33f9177af8f134f9` |
| V-04 | P2 | `25_순천고_2학기_기말_고1_유사3` | 11 / `solutionImage` | `q11-solution.svg` | `7a9dd3610fee0e8e4929bce32d1207547d0c9ed6` |
| V-06 | P3 | `25_팔마고_2학기_기말_고1_유사3` | 23 / `solutionImage` | `q23-solution.svg` | `af90ca1f6e753ffcd6f738d6aa454f9fb401e68b` |

**예상 실제 수정:** 엔진이 생성한 신규 SVG 6개 + 그것을 참조하는 **시험지 JS 5개**의 해당 이미지 필드와 필요한 이미지 메타 필드만. 기존 SVG 6개는 덮어쓰거나 먼저 삭제하지 않는다. 새 자산 이름은 충돌 여부를 확인한 후 `qNN-problem-svgengine-repair-20261122.svg` / `qNN-solution-svgengine-repair-20261122.svg`처럼 고유 경로로 발행한다. 게시 도구가 다른 정식 이름을 생성하면 도구가 반환한 실제 경로를 채택하고 기록한다.

## 3. 자산별 독립 기대값·수정 지시

### V-05 · 팔마고 유사3 1번 · P0 (최우선)

- 현재 문제 그림의 (3) 주석이 `x=-2x=2`로 붙고 (5)에는 `y=2(x=-101)`처럼 깨진 문자열이 보인다. 문제 SVG의 `data-role=point`가 2개인 데 비해 해설 SVG는 6개다. 특히 (4)의 닫힌 두 끝점 및 (5)의 세 이산점이 원문 해설과 불일치한다.
- **렌더 전 CONTENT 게이트:** 현행 JS의 발문·보기·정답 ④·해설을 독립적으로 확인하고, 문제 그림이 요구하는 판정을 확정한다. 수학적 모순이 확인되면 **그림만 그려 억지로 맞추지 말고 `CONTENT_OPEN`으로 중단·보고**한다.
- 현행 해설이 맞다는 전제에서 5개 패널의 기대 상태는 다음과 같다.
  1. (1) `y=2x-1`의 일반 직선: 함수.
  2. (2) `x=0`에서 `(0,-1)` 열린 점, `(0,1)` 닫힌 점으로 구간별 값 하나: 함수.
  3. (3) 정의역 `-2≤x≤2`의 윗쪽 반원: 각 x에 y 하나: 함수.
  4. (4) `x=1`에서 **서로 다른 두 닫힌 점 `(1,1)`과 `(1,2)`**: 함수가 아님. 단순히 이어지지 않은 선을 그리는 것으로 끝내지 않고 두 점의 채움·값을 명확히 표시한다.
  5. (5) `(-1,2)`, `(0,2)`, `(1,2)`의 **고립된 세 점**, 불필요한 연결선 없음: 함수.
- 결과 그림에는 주석끼리 결합된 문자열, 누락 점, 모호한 경계가 없어야 한다. 정답 번호를 문제 그림 안에 직접 강조하지 않는다. **기존 `q01-solution.svg`도 함께 육안 비교**하되, 결함 없는 해설 그림은 수정 대상에 추가하지 않는다.

### V-01 · 금당고 유사1 22번 · P2

- `y=√(x-1)`과 `y=2x+k`의 교점 비교 해설이다. `k=-2`에서 `A(1,0)`, `B(5/4,1/2)`이고, `k=-15/8`은 접하는 경계 사례다.
- 현행 SVG의 `B(5/4,1/2)` 좌표가 선·곡선과 겹쳐 읽히지 않는다. **점과 좌표를 정확히 유지한 채** 라벨 위치 조정·지시선(leader/callout)·캔버스 배치를 엔진 plan에서 고친다. 글자를 삭제하거나 곡선 수치·기울기를 바꾸지 않는다.
- `k`의 허용 범위 `-2≤k<-15/8`과 두 교점/접점의 기하 관계를 최종 PNG에서 확인한다.

### V-02 · 금당고 유사2 11번 · P2

- 양의 약수 집합 포함 관계는 `A₆ ⊆ Aₙ ⊆ A₂₄` (수식으로 `A_6 ⊆ A_n ⊆ A_{24}`)이다. 기존 SVG의 `A6`, `An`, `A24`가 첨자 없이 한 줄로 렌더된다.
- 엔진의 **수식/기호 라벨 필드**로 다시 생성해 `A₆`, `Aₙ`, `A₂₄`가 집합명으로 즉시 읽히게 한다. 집합의 포함 순서와 약수 원소 `1,2,3,4,6,8,12,24`의 소속은 유지한다. 식만 바꾸고 포함/원소의 의미를 변형하지 않는다.

### V-03 · 금당고 유사3 11번 · P2

- 양의 배수 집합의 포함 관계는 `B₇₂ ⊆ Bₙ ⊆ B₁₂` (`B_{72} ⊆ B_n ⊆ B_{12}`)이다.
- 현행 SVG에 `B_12`, `B_n`, `B_72`가 밑줄 글자로 표시된다. 엔진의 수식 라벨을 통해 올바른 아래첨자로 바꾸고, 원소/집합의 안팎 위치와 수학적 관계는 유지한다.

### V-04 · 순천고 유사3 11번 · P2

- `R ⊆ Pᶜ ⊆ Q`를 설명하는 포함도이다. 기존 그림은 `P^{c}`가 원시 텍스트 그대로 노출된다.
- 중간 집합 표기를 실제 여집합 위첨자 `P^c`(학생에게 보이는 수학식 렌더)로 고친다. 문자열에 문자 `^`, `{`, `}`가 그대로 보이면 실패다. 원래 원소 없는 포함 관계·집합 배치는 유지한다.

### V-06 · 팔마고 유사3 23번 · P3

- `y=-√(4-2x)`의 끝점 `(2,0)`과 비교 직선이 만나는 같은 점 주변에 `(2,0)`이 두 번 표시된다.
- 엔진 plan에서 **하나의 좌표 라벨 + 필요하면 명확한 지시선**만 남긴다. `(0,-2)`, `(3/2,-1)`, 두 비교 직선, 정의역 경계·접촉 관계를 보존한다. 수학적 의미·해설 값은 바꾸지 않는다.

## 4. Codex 엔진 실행 절차

실제 파일·의존성·인자를 확인한 다음 아래 저장소 정본 절차로 진행한다. 명령의 `<...>`는 **실제 문항별 경로로 대체**한다. 현재 이 계획 작성 세션에서 다음 명령은 **NOT_RUN**이다.

1. **격리/최신 판본 확인:** 루트 체크아웃을 더럽히지 말고 별도 `git worktree`를 `origin/main`에서 생성한다. 감사 브랜치에서 이 계획을 읽되 소스 작업은 별도 브랜치에서 한다. 6개 원본 자산 SHA와 현재 JS 참조를 read-only로 대조한다. 다른 라인의 미커밋 변경은 보존한다.
2. **엔진 준비:** `archive/tools/geometry-equation/ops/svg-m1/` 자료를 작업 트리의 `.tmp/svg-m1/`에 복원하고, 현행 `ops/claude-batch/restore.sh`로 `.tmp/work/` 엔진을 준비한다. Python·Node·Playwright/Chromium 실제 경로는 `HANDOFF_SVG_CODEX.md`의 플랫폼 지침에 맞춰 확인한다. Windows라면 `py`와 PowerShell/실제 설치 경로를 사용하고 Linux 경로를 그대로 복사하지 않는다.
3. **문항 packet·계획:** 해당 JS의 현재 qid와 원본 SVG를 읽어 `item.json` (`sourcePath`, `ordinal`), `plan.json`, `publish.json`을 `.tmp`의 문항별 폴더에 작성한다. 골든 plan과 `AUTHOR_GUIDE.md`의 **동일 primitive**를 재사용한다. 기존 SVG path/inner XML을 수작업 조립하지 않는다. 위 §3 기대값을 `expected`로 먼저 적는다.
4. **사전 검사:** `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan.json>`를 통과시킨다.
5. **렌더:** `node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <out-dir>`로 렌더하고 결과 `figure-result.json`이 **`ARCHIVE_BOUND`**임을 확인한다. PNG가 자동 생성되지 않으면 `node .tmp/svg-m1/svg2png.cjs <figure.svg> <figure.png> 600`으로 만든다. 실패 시 plan을 고쳐 재렌더하고, 미지원이면 근거와 오류 코드를 `UNSUPPORTED`로 보고한다(수작업 SVG 금지).
6. **1차 눈 검수:** 새 SVG·PNG를 **실제 이미지로 열어** §3의 독립 기대값, 글자 겹침·잘림, 점 색/열림/닫힘, 상대 좌표, 수식 라벨을 원문·해설과 대조한다. 문제/해설 슬롯을 혼동하지 않는다. alt·caption은 실제 그림의 요소와 일치하고, `publish.json.size`는 렌더 `sizeClass`와 일치시킨다.
7. **독립 검수:** 그림 작성자와 다른 검수자가 기존 B와 신규 A의 **원본 그림 교체 판정**을 수행한다. 후보 A는 `PASS`, `better=A`를 목표로 하되 오류를 발견하면 `FAIL`로 기록해 같은 문항을 고친다. SHA-256으로 최종 SVG·PNG·publish/plan 판본을 결속한다. 독립 검수 결과 없이 게시하지 않는다.
8. **정식 게시/JS 참조 갱신:** `archive/tools/geometry-equation/ops/svg-m1/pubflow.py`의 **현행 `--batch` manifest**(`exam`, `review`, `rows`, `triage`, `camp`; replacement row의 `replace:true`)를 읽고 정식 도구로 게시한다. 6개 신규 운영 SVG를 새 경로에 저장하고 해당 qid의 `image` 또는 `solutionImage` 및 필요한 alt·caption·size/scale만 갱신한다. 구 SVG는 보존한다. 보조 생성물·중간 PNG·로그는 Git에 넣지 않는다.
9. **기술·학생 QA:** 엔진 관련 기존 검사(원본/게시/수학 좌표/접근성), 수정된 5개 시험지의 `archive/engine.html?data=exams/similar/high/h1/2final/<시험지>.js&mode=exam|sol|ans`를 실제 Chrome에서 확인한다. PC, 휴대폰 폭 약 375px, A4/인쇄에서도 끝점·글자·영역이 읽히는지 검사한다. `role="img"`, `<title>`, `<desc>`, 최소 읽기 글자 크기/표시 배율 정책을 확인하고, 해설 그림에서 `y=x`·기울기 ±1·원이 있으면 `equalUnits:true` 및 실제 45°를 대조한다.
10. **커밋/인계:** 6개 신규 SVG와 5개 JS 중 실제 변경된 것만 경로를 명시하여 커밋한다. 엔진 코드·루트 규칙·다른 문항·기존 자산은 건드리지 않는다. PR·`main` 병합·학생 배포는 별도 상태/승인으로 구분한다. 새 이미지 링크·blob SHA·검사 출력·독립 검수표·미해결 사항을 GPT 시각 감사 담당에게 넘긴다.

## 5. 합격 기준과 실패 처리

| 관문 | 통과 기준 | 실패 시 |
|---|---|---|
| 범위 | 대상 **정확히 6개 자산** / 5개 시험지, 비대상 문제·답·해설 불변 | 범위 밖 변경 되돌리기 전에 소유자 확인, 승인 없이 확장 금지 |
| 엔진 출처 | 각 후보 공식 `plan`/렌더 결과, `ARCHIVE_BOUND` | `FAILED`/`UNSUPPORTED`, 손 SVG 게시 금지 |
| 수학 | §3의 점·함수·집합·경계·교점 조건 전부 실제 그림에서 검증 | `CONTENT_OPEN` 또는 시각 `FAIL`, 추정치로 수정 금지 |
| 화면 | 라벨 중첩·문자 그대로의 `_`/`^`·점 누락·중복 좌표 없음, 모바일/인쇄 읽힘 | plan 수정 → 재렌더·재검수 |
| 게시 | 신규 SVG 6개가 올바른 `image`/`solutionImage` 6개 참조에 연결, 구 자산 보존 | 게시 실패 기록, PASS 금지 |
| 독립성 | 동일 후보 SHA에 결속된 독립 검수 A PASS + better=A, GPT 최종 그림 육안 재검수 | 해당 자산 OPEN 유지 |
| Git | 수정 파일만 커밋, 원시 PNG/실행 로그 Git 미포함, 강제 push·보호 우회 없음 | 변경 분리 후 정상 절차 재실행 |

- **이 계획 문서**는 검수 결과가 아니다. `PLAN_ONLY`에서 `ENGINE_DONE`으로 변경하려면 6건 각각의 렌더·독립 QA·게시 기록이 필요하다.
- 엔진이 처리하지 못하는 경우: `UNSUPPORTED` + 시도한 plan/정확한 오류 코드/필요한 primitive를 남기고, 엔진 업그레이드 작업을 별도 범위로 요청한다. 이미 문제가 틀리면 `CONTENT_OPEN`으로 남겨 그림을 통해 숨기지 않는다.
- 수정이 끝나도 **여기서 GPT가 새 SVG를 가져와 실제 렌더링·문항별 재검수한 뒤**에만 5개 감사 MD 및 통합 보고서의 최신 `VISUAL_QA_*` 판정을 바꾼다. 최종 `main`/학생 배포 완료와 MD 판정은 별도로 보고한다.

## 6. Codex 완료 인계 양식

| ID | old→new SVG 경로 | old/new Blob SHA | render `ARCHIVE_BOUND` | 독립 검수(A/B) | PC/375px/A4 | JS 참조·커밋 | 최종 상태 |
|---|---|---|---|---|---|---|---|
| V-05 | 작성 대기 | 대기 | NOT_RUN | NOT_RUN | NOT_RUN | 미변경 | OPEN P0 |
| V-01 | 작성 대기 | 대기 | NOT_RUN | NOT_RUN | NOT_RUN | 미변경 | OPEN P2 |
| V-02 | 작성 대기 | 대기 | NOT_RUN | NOT_RUN | NOT_RUN | 미변경 | OPEN P2 |
| V-03 | 작성 대기 | 대기 | NOT_RUN | NOT_RUN | NOT_RUN | 미변경 | OPEN P2 |
| V-04 | 작성 대기 | 대기 | NOT_RUN | NOT_RUN | NOT_RUN | 미변경 | OPEN P2 |
| V-06 | 작성 대기 | 대기 | NOT_RUN | NOT_RUN | NOT_RUN | 미변경 | OPEN P3 |

**종료 보고:** 실제 수정된 6개 그림, 시험지별 엔진/검수/게시 결과, git 브랜치·커밋·PR(있다면), 실패·NOT_RUN, GPT 재검수에 필요한 실제 새 SVG 경로를 한 번에 보고한다.
