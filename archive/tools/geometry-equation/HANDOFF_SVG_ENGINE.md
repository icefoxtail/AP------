# AP Math SVG 엔진 — 인계 문서 (Claude Code → Codex, 2026-10-26)

이 문서 하나로 이어서 일할 수 있게 썼다. **읽는 순서: §0 → §1 → §2(토큰 절약 방식, 가장 중요) → §5(남은 일)**. 나머지는 필요할 때 찾아본다.

- 그림 작성 규칙 정본: `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md` (본문 `author-guide-body.md` + `phase2.mjs` 계약을 `node archive/tools/geometry-equation/production/build-author-guide.mjs`로 합성, `tests/author-guide.test.mjs`가 동기화 강제).
- 작업자 실행 도구·지시서 템플릿: `archive/tools/geometry-equation/ops/` (§2, §7).
- 시험지 마감 원장: `archive/tools/geometry-equation/production/exam-figure-ledger.json` + `exam-figure-queue.md`.

---

## 0. 한 줄 요약

고등 기출 141개 시험지 중 139개를 해설 그림으로 마감했고(남은 2개는 골든 샘플 해시 고정 문제), 그 뒤 **엔진을 크게 넓혔다**(중학교 평면도형·영역·통계·입체·작도, 고등 그래프 보조요소·영역·불연속·일반형 무리/삼각함수·벤다이어그램 등). **새 기능으로 그린 그림은 아직 시험지 JS에 하나도 반영하지 않았다.** 다음 일은 (1) 마지막 작업자 X9 병합, (2) 새 기능으로 조사한 시험지들을 시험지 단위로 마감·게시, (3) 남은 시험지 조사 → 공백 구현의 반복이다.

## 1. 사용자 지시 (누적, 반드시 지킬 것)

1. **보고는 한국어.** 결과 그림은 **항상** 사용자에게 보여 준다(실패한 그림도 함께).
2. **기출만** 대상(`archive/exams/original/**`). 유사문항·유형(`archive/exams/types/**`)은 대상 아님. 문제 그림 자체가 빠진 문항은 엔진 일이 아니다(보고만).
3. **시험지 단위로 마감**: 한 시험지의 막힌 문항을 모두 해결(필요하면 엔진 확장) → 해설 그림 게시 → 원장에 `CLOSED` 기록 → 다음 시험지. 마감한 시험지는 다시 하지 않는다(원장으로 확인).
4. **묻지 않고 진행**: 사용자가 권장안을 직접 고르라고 했다. 확장 하나가 끝나면 문서(가이드) 갱신 후 **main 병합이 기본**이다(엔진·문서 PR). 여러 시험지 게시는 묶어서 병합해도 된다.
5. **그림 미적 기준**: 가장 보기 좋게. 이차·함수 그래프는 같은 배율 우선, 세로는 최대 1/2까지만 압축(그 이상 찌그러뜨리기 금지, 정확한 비율보다 보기 좋음 우선). 분수는 **세로 분수만**(빗금 금지). 좌표 띠 `A(x,y)` 선호. 점 이름은 점 옆, 멀면 지시선. **각 표시는 작은 부채꼴(연한 색 + 호)이 기본**. 응용문제(단위가 다른 두 양)만 `applicationAxes`로 축 배율 분리.
6. **토큰 최소·효율 최대**: 컨트롤러(지금은 Codex)는 지시·검토·병합만 하고, 구현은 DeepSeek 작업자에게 맡긴다(§2). 전체 테스트 스위트를 돌리지 않는다(관련 테스트만).
7. **병렬로 많이 돌려도 된다** — 단 끝난 작업자 세션은 지우면서, PC 메모리 한도 안에서(§2.5).
8. 가짜 지원 금지(못 그리면 오류 코드로 거절), 독립 관측기는 엔진 계산을 믿지 않고 같은 입력에서 따로 계산해 최종 SVG를 검사, 관측기·테스트를 약하게 만들어 통과시키기 금지.

## 2. 토큰 절약 작업 방식 (Claude Code가 쓰던 방식 그대로)

### 2.1 역할
- **컨트롤러(Codex)**: 조사 결과를 보고 작업을 나누고, 지시서(brief)를 쓰고, 작업자를 띄우고, 감독하고, 결과 diff·테스트를 확인하고, main 병합·그림 전달·원장/문서 갱신만 한다. 코드를 직접 길게 쓰지 않는다(충돌 해결·작은 수정만).
- **작업자(DeepSeek)**: 사용자의 OpenCode Go 구독으로 `opencode` CLI를 돌린다. 모델 `opencode-go/deepseek-v4.1-flash`. 구현·테스트·실문항 렌더·검토 실행·PR 작성까지 한다. 병합은 하지 않는다.
- **독립 그림 검토자**: 각 검토는 구현자와 다른 새 OpenCode agent/session에서 정확히 `opencode-go/deepseek-v4.1-flash`로 실행하고 read-only로 둔다. 학생용 원문·최종 SVG·실제 렌더 PNG를 제공하고, 검토자는 원문에서 먼저 관계를 독립 도출한 뒤 시각 결과와 대조한다. PNG 픽셀 입력이 실제 제공되지 않으면 그 사실을 적고 시각 PASS를 주장하지 않는다. Claude/Gemini를 검토 backend로 사용하지 않는다.
  - 2026-10-26 `REVIEW_BACKEND=opencode` 시험은 이전 구현/검토 도구의 역사적 실행 기록이며, 지금의 검토 backend 지시가 아니다. 해당 과거 X7 검토자는 `25_팔마중_2학기_중간_중1_기출` q10(정답지 item27과 같은 plan)을 **FAIL**로 봤다(교점 C·D 역할이 해설과 반대로 보임, X·Y·Q·R 이름 누락). 과거 PASS 표시는 현재 승인으로 승계하지 말고, 게시 전 원문·해설·실제 렌더를 새 DeepSeek 독립 검토로 확인한다.

### 2.2 opencode 사용법과 함정
- 설치: `npm i -g opencode-ai` (현재 1.19.4, `C:\nvm4w\nodejs\opencode`). 로그인은 사용자가 `opencode` 대화형에서 `/connect` → **OpenCode Go** 선택 → 키 입력(이미 됨). 워크스페이스 Privacy는 Global(이미 설정).
- 제공자 둘: `opencode/…`(사용량 결제, 잔액 없음 → "Insufficient account funds"), **`opencode-go/…`(구독, 이걸 쓴다)**.
- 비대화 실행: `opencode run "<메시지>" --model opencode-go/deepseek-v4.1-flash --dir <워크트리> --auto --title <이름> -f <파일들>`
  - **`-f`는 배열 옵션이라 메시지를 반드시 앞에** 둔다(뒤에 두면 메시지를 파일로 읽어 "File not found").
  - `--auto`는 확인 없이 수정·명령 실행 → **작업마다 분리된 워크트리에서만**.
- **스냅샷 끄기 필수**: opencode는 단계마다 워크트리 전체를 자기 git에 스냅샷한다. 이 저장소는 너무 커서 느려지고 프로세스당 수 GB 메모리를 쓴다 → `OPENCODE_CONFIG=<repo>/archive/tools/geometry-equation/ops/workers/opencode-worker.json`(`{"snapshot": false}`). `step-task4.sh`가 설정한다. 사용자 전역 설정(`~/.config/opencode`)은 건드리지 않는다.
- **세션 DB**: `~/.local/share/opencode/opencode.db`. 한때 12.9GB까지 커져 모든 실행이 `Error: Failed to execute statement`로 죽었다 → 사용자 승인으로 삭제(로그인 `auth.json`은 유지). 지금은 **단계가 끝날 때마다 그 세션을 `opencode session delete`로 지운다**(step-task4가 함). 동시 실행이 많으면 DB 쓰기 충돌로 같은 오류가 가끔 나는데, step-task4가 같은 단계를 새 세션으로 최대 3번 다시 한다.
- **작업자는 그림 파일(PNG/SVG)을 직접 열지 않는다**(세션이 커져 DB 폭증) — 결과 JSON·SVG 텍스트 grep·독립 검토로만 확인. 출력은 `tail`로 짧게.
- 작업자가 Bun 세그폴트(메모리 부족)로 죽기도 한다 → 같은 단계를 다시 띄우면 된다(워크트리 상태는 남아 있음).

### 2.3 작은 단계로 나누기 (세션 짧게)
작업 하나 = 지시서 1장 + 단계 A/B/C, **단계마다 새 세션**(`ops/workers/small-steps.md`):
- A: 구현 + 단위 테스트, 커밋 `(진행 중)`.
- B: 실제 문항 plan 작성·렌더(ARCHIVE_BOUND까지)·PNG 변환·독립 검토 PASS, 커밋.
- C: 정답지 회귀, 정답지 항목 추가, 가이드 갱신·재생성, `git merge origin/main`, 테스트 재실행, push, PR.
- 수정만 필요하면 `FIX` 같은 이름의 단일 단계 + 짧은 지시서(예: `g5-fix.md` 형식: 원인 후보·검증 명령·금지사항·완료 보고).

### 2.4 지시서 쓰는 법 (작업자는 이 대화를 모른다)
공통 규칙 2장 + 작업 지시서 1장을 `-f`로 붙인다.
- `ops/workers/common-engine-rules.md`: 프로젝트 사실(실행기, 정답지, 검토 도구), 환경(Git Bash, `PYTHONIOENCODING`, `PYTHONPATH`, 백슬래시 함정, LF), 하드 규칙(관측기 독립, 가짜 지원 금지, **남의 프로세스 절대 종료 금지**, 다른 워크트리 금지, 긴 명령은 `timeout`), git 규칙(병합 금지, PR 형식).
- `ops/workers/common-publish.md`: 시험지 JS 게시 규칙(`solutionImage*`만, 원본 바이트 보존, 페이지 열림 확인, 골든 게이트, 원장).
- 작업 지시서: 워크트리·브랜치·정답지 항목 번호·PR 제목 / 문제(지금 엔진이 왜 못 하나, 관련 코드 경로) / 목표(설계, 관측기가 검사할 것, 오류 코드) / 실제 문항 출처(조사 JSON) / 완료 기준. 예: `ops/workers/example-brief-g1-overlays.md`.
- 같은 파일을 여러 작업자가 고칠 때: "변경은 덧붙이는 방식, 공용 코드 재배치 금지, C단계에서 main 병합" 문구를 넣는다. 정답지 항목 번호는 작업자마다 미리 나눠 준다(공유 manifest).

### 2.5 실행·감독
- 워크트리 만들기(엔진 클론에서): `git -C D:/AI_WORKSPACES/APMS/svg-engine-line-20261019 worktree add -b <branch> D:/AI_WORKSPACES/APMS/svg-<name> origin/main` → `git config core.autocrlf false` → `mkdir .tmp` → `cmd //c "mklink /J D:\AI_WORKSPACES\APMS\svg-<name>\.tmp\apmath-visual-engine D:\AI_WORKSPACES\APMS\svg-engine-line-20261019\.tmp\apmath-visual-engine"` (파이썬 의존성·Chrome 런타임). **`.tmp/archive`는 정션 금지**(`TEMPORARY_ROOT_REDIRECT`).
- 준비: `ops/workers/*.md`(공통 규칙·단계 규칙)를 지시서 폴더 `D:/AI_WORKSPACES/APMS/briefs/`(다른 곳이면 `BRIEFS_POSIX`/`BRIEFS_WIN` 환경변수)로 복사하고, 작업 지시서도 그 폴더에 쓴다.
- 실행: `bash archive/tools/geometry-equation/ops/workers/step-task4.sh <name> <brief.md> "A B C" <동시상한>` — 지시서는 `D:/AI_WORKSPACES/APMS/briefs/`에 둔다(스크립트의 `B`/`W` 경로; 다른 곳이면 스크립트 상단 수정). 출력 `<briefs>/<name>-steps.log`, 끝나면 `<name>-runner.out`에 `DONE <name>`.
- **동시 실행 상한 5~6개**. 9개 띄웠을 때 메모리(17GB) 고갈 → Bun 세그폴트, git "Out of memory", Chrome 렌더 시간 초과, Windows 페이지 파일 31GB까지 증가(C: 공간 급감, 재부팅하면 회복).
- **감독**: `bash ops/workers/supervise.sh [이름들]` — 2분마다 확인하고 첫 새 이벤트에서 끝난다: `DONE`(완료), `DBERR`(DB 오류), `STALL`(90분 무변화, 대기열 대기는 제외), `DISK`(C: 10GB 미만 → opencode 전부 종료). 처리한 이벤트는 `supervise.state`에 남는다. **이벤트를 처리하면 다시 실행해서 다음 이벤트를 기다린다.** CLI 작업자는 끝나도 알림이 오지 않으므로 이게 유일한 알림 수단이다.
- 함정: 옛 실행기 스크립트를 멈췄다고 생각해도 안쪽 bash가 살아 대기열에서 기다리다 같은 단계를 다시 돌릴 수 있다 → `Get-CimInstance Win32_Process -Filter "Name='bash.exe'"`로 `step-task` 명령줄을 확인해 종료. 실행기를 다시 띄울 땐 `supervise.state`에서 해당 `DONE <name>` 줄을 지우고, 예전 실행기가 남긴 `DONE`이 `<name>-runner.out`에 있으면 비운다.
- 오래 조용한 STALL은 대개 긴 명령(정답지 회귀) 실행 중이다. opencode 프로세스의 자식 프로세스를 확인해 판단한다.

### 2.6 병합 전 확인 (컨트롤러가 직접, 짧게)
1. 범위: `git diff --name-only origin/main...HEAD`가 엔진 폴더(+해당 시험지·에셋·원장) 안인가. 시험지 JS는 `solutionImage*`(+앞 줄 쉼표)만 바뀌었나.
2. **기존 기본 테스트로 회귀 확인**: 그 작업이 건드린 계열의 기존 아카이브 테스트를 브랜치에서 돌려 **main과 같은 결과**인지(예: 그래프 파일을 고쳤으면 `trigonometric-archive`, `sqrt-affine-archive`, `exponential-logarithmic-archive`, `cubic-quartic-archive-publication`). G1에서 실제 회귀(삼·사차 프레임 여백)를 이 방법으로 잡았다. 부하로 인한 거짓 실패(렌더 준비 시간 초과, `WORKER_TIMEOUT`, `ARCHIVE_PREFLIGHT_FAIL`)는 부하를 줄이고 단독 재실행해 구분한다.
3. 충돌: 자동 생성 `AUTHOR_GUIDE.md`는 아무 쪽이나 받고 재생성. `author-guide-body.md` 절 번호가 겹치면 하나를 다음 번호로 옮기고 본문 참조도 고친다. `phase2.mjs` 계약 문자열·`semantic_model.py` 필드 집합처럼 같은 줄에 양쪽이 덧붙인 경우는 **합집합**으로(문자 단위 diff로 양쪽 추가분 보존). 관측기 파일 끝에 양쪽이 함수를 덧붙인 경우는 둘 다 살린다.
4. 병합 후: 원격 블롭 대조(`git -c core.quotepath=off diff --name-only origin/main~1 origin/main` 각 파일 `rev-parse` 비교). 이 저장소 CI는 다른 라인 때문에 원래 빨갛다(§6) — CI 실패 목록이 main과 같으면 병합.

## 3. 엔진 현재 상태 (main `09a022f9b` 이후)

| 기능 | capability / 필드 | PR | 가이드 절 |
|---|---|---|---|
| plan→SVG 실행기 | `production/render-plan.mjs` (`--item/--plan/--out`, `--manifest`) | #778 | §8 |
| 독립 수직선 | `number-line-figure-v1` | #779 | 3-수직선 |
| 작도 연산 | DIVISION_POINT, CENTROID, POINT/LINE_REFLECTION, PERPENDICULAR_THROUGH, TRANSLATE_* | #780 | 3-1 |
| 함수족 연결 | rational, sqrt, abs, piecewise-affine, exp, log, trig, cubic/quartic | #789 | 3-2 |
| 조각함수+기울어진 직선 | `piecewise-polynomial-spike-v1` referenceLines | #790 | 3-3 |
| 무리수 계수 | `p+q*sqrt(r)` | #792 | 3-4 |
| 점 이름 | `pointNames` (T₁, A′) | #794 | 4 |
| 응용 축 / 곡선 둘 | `applicationAxes` / `referenceCurves` | #802 | 3-5, 3-6 |
| 삼각 구간·직선 | `INTERVAL_PI` + referenceLines | #807 | 3-7 |
| 지수·로그 밑 | `base` 정수·분수·근호, exp-log pair | #825 | 3-2 |
| 삼차·사차 중근 | repeated roots, 두 패널 | #828 | 3-2 |
| 구간별 함수 두 개 | 조각 referenceCurves, 조각 4개 | #830 | 3-6 |
| 중학교 평면도형 | `PLANE_FIGURE_v1`, `planeMarks`(각·눈금·평행·호·사실), `POLAR_POINT` | #809 | 3-8 |
| 각 표시 기본 = 작은 부채꼴 | `style:"SECTOR"` 기본, `ARC` 옵션 | #835 | 3-8 |
| 영역 색칠(평면) | `planeMarks.regions` | #826 | 3-9 |
| 통계·확률 | `stat-chart-figure-v1` | #819 | 3-11 |
| 입체·전개도 | `solid-figure-v1`, 뒤집힌 원뿔 그릇·입체 표식·내접 | #823, #833 | 3-입체 |
| 벤다이어그램·대응도 | `set-diagram-figure-v1` | #849 | 3-12 |
| 그래프 영역 색칠 | `graphPlan.regions` | #845 | 3-6-영역 |
| 일반형 무리함수 | sqrt 일반형 | #855 | 3-2 |
| 일반형 삼각함수 | `ratePi`, `phase`, `keyPoints`, `axisTickPi` | #852 | 3-13 |
| 그래프 위 보조 요소 | `overlays` (직선·세로선·선분·다각형·점) | #854 | 3-14 |
| 좌표 그림 각 표시 | 좌표 작도에 `planeMarks` | #856 | 3-8 |
| 불연속·혼합 조각함수 | `piecewise-discontinuous-spike-v1` | #857 | 3-15 |
| 작도 흔적 호 | `planeMarks.traces` | #858 | 3-8 |
| 해설 대체 텍스트 구체화 | 시험지 78개 | #831 | — |

**정답지 회귀**: `ops/golden.manifest.json` + `ops/golden/itemNN/plan.json` (34개, 아래 명령). main `09a022f9b`에서 item29(X9, 미병합)를 빼고 모두 `ARCHIVE_BOUND`.
```
node archive/tools/geometry-equation/production/render-plan.mjs --manifest archive/tools/geometry-equation/ops/golden --out <새 폴더>
```
(원본은 git 무시 폴더 `D:/AI_WORKSPACES/APMS/svg-engine-line-20261019/.tmp/archive/svg-engine-development-20261015/REGRESS/golden*` — 지금까지 작업자들은 이쪽 경로를 썼다. 새 항목은 repo 쪽 `ops/golden`에 추가하고 PR에 포함한다.)
항목 번호: 01~13 고등 기본(좌표·이차·체인·수직선), 14~18 함수, 19 평면표식, 20 영역, 21 통계, 22·26 입체, 23 지수로그 쌍, 24 중근, 25 조각 두 개, 27 작도 흔적, 28 집합, 29 수직선 작도(X9), 30 보조요소, 31 불연속, 32 그래프 영역, 33 무리 일반형, 34 삼각 일반형, 35 좌표 각. 다음 번호는 36.

## 4. 진행 중 / 열린 브랜치

- **X9 `claude/svg-ext-mid-small`** (워크트리 `D:/AI_WORKSPACES/APMS/svg-x9`, 지시서 `x9-mid-small.md`): 수직선 위 컴퍼스 작도(√2 등), 값 없는 문자 점, 전개도 면 라벨, 좌표 점 연결. 단계 C(정답지·가이드·병합·PR) 진행 중이었다. 끝나면 §2.6대로 확인·병합(정답지 item29).
- 남아 있는 옛 워크트리 `svg-x1~x9`, `svg-g1~g6`, `svg-mid-*`, `svg-exams-b*`, `svg-ext-*` 등은 병합 완료 브랜치다(정리해도 됨, 단 X9 제외).

## 5. 남은 일 (우선순위)

1. **X9 병합.**
2. **부분 게시 2문항 완성본 교체**: `25_매산고_1학기_중간_고1_기출` q18(삼각형 AOC·BOD), `23_매산고_1학기_중간_고1_기출` q20(점 D와 수선) — G1 `overlays`로 완성 가능, 검토 PASS 확인됨(`D:/AI_WORKSPACES/APMS/g1-out/`). 새 에셋 이름으로 재게시, 원장 갱신.
3. **새 기능으로 시험지 마감·게시** (시험지 단위, `common-publish.md` 규칙). 이미 그린 그림이 있는 시험지부터:
   - 중학교 2학기 조사 9개(`D:/AI_WORKSPACES/APMS/middle-survey/middle-figure-gap-survey.md`): 평면표식 17(mid-1-out), 영역 10(mid-2a-out), 통계 11(mid-2b-out), 입체 17+4(mid-3-out, x6-out), 작도 7(x7-out). 단 `26_왕의중_2학기_중간`(문제 그림 8개 누락)과 `25_풍덕중_2학기_기말` q14(문제 그림 누락)는 제외/보고.
   - 고1 2학기·고2 조사(`D:/AI_WORKSPACES/APMS/surveys/high-h1-2sem`, `high-h2`): 벤·대응도 12(x8-out), 그래프 영역 7(g3), 무리 일반형 5(g4-out), 삼각 일반형 4(g5-trig-general-out), 보조요소 6(g1-out), 좌표 각 5(g6-coord-angles-out), 불연속 5(svg-g2-out).
   - 원장에 이 시험지들이 아직 없다 → 시험지를 원장에 추가(전 문항 판정: PUBLISHED/EXEMPT/UNSUPPORTED)하고 CLOSED로. 한 묶음 10~14개 시험지, 작업자 1명이 묶음 하나(과거 batch1~5 방식, `git log --grep "해설 그림 마감"` 참고). 시험지 JS 변경 전 `node --test tests/m2-*-create-gate-*.test.js`(골든 샘플 SHA 고정) 필수.
4. **남은 시험지 조사 → 공백 구현 반복**: 원장 밖 원본 시험지가 많다(대략 고1 2학기 65, 고2 252, 중학교 1학기 198·2학기 대부분). 조사 지시서 `ops/workers/survey-common.md` 형식으로 9~10개씩 조사(읽기 전용) → 부족 기능 빈도순 구현 → 해당 시험지 마감.
5. 알려진 엔진 한계(조사·작업자 보고): 셋 이상의 서로 다른 곡선, 문자 계수 전체 조건 그림(대표값만 가능), 매우 긴 순수 수학 그래프(세로 1/2 제한), 꼭짓점에 각 4개 이상 몰림, 점선 반직선 끝 너머는 숨은 점 필요, 벤다이어그램 4집합 이상, 입체 단일 투영.
6. 결정 대기(사용자): 골든 샘플 시험지 2개(`25_효천고_2학기_중간`, `25_매산여고_2학기_중간`, 문항 4개) 해시 재고정 여부.

## 6. 알려진 상태·함정

- GitHub CI: `test`/`Archive2 runtime contract`가 다른 라인의 누락 파일(`archive/exams/types/middle/m1/중1_1학기_문자와식_내신유형다지기_pro.js` 등)로 멈추고, `sync`도 그 파일들 때문에 멈춘다. 우리 변경과 무관 — CI로는 우리 테스트가 돌지 않으니 로컬 관련 테스트로 판단.
- main에서도 실패하는 기존 테스트: `tests/trigonometric-archive.test.mjs`의 cosine 1건, `tests/construction-candidate-svg-v1.test.mjs` 14건(세션 시작 전부터), `test_graph_spike` 1건.
- 백슬래시: Bash 인라인(heredoc·`node -e`)은 백슬래시를 먹는다 → 파일 쓰기 도구로. 파이썬 텍스트 쓰기는 LF로(`newline='\n'` 또는 바이트), `git ls-files --eol`로 `i/lf w/lf` 확인.
- `git diff --name-only`의 한글 경로는 따옴표·8진수로 나온다 → `-c core.quotepath=off`.
- Chrome 렌더는 동시에 여러 개 돌리면 `ARCHIVE_PREFLIGHT_FAIL`·`QUESTION_IMAGE_READINESS_INCOMPLETE`·`WORKER_TIMEOUT`이 난다 → 단독 재실행으로 확인.
- `construction-*`·archive 테스트는 저장소 루트에서 실행(상대 `.tmp/archive`).
- 시험지 JS를 바꾸는 PR은 `tests/m2-*-create-gate-*.test.js`(골든 샘플 SHA)를 먼저 확인.
- 디스크: C:가 작다(232GB, 여유 20GB대). opencode DB(`~/.local/share/opencode/opencode.db`)와 페이지 파일을 주기적으로 본다.

## 7. 파일·위치 색인

- 엔진 코드: `archive/tools/geometry-equation/production/` (render-plan, phase2 계약, 각 capability 모듈과 `*_observer.py`), `visual_engine/`, 테스트 `tests/`.
- 작업자 도구(이 PR로 저장소에 넣음): `archive/tools/geometry-equation/ops/`
  - `workers/step-task4.sh` 단계 실행기(스냅샷 끔·세션 삭제·DB 오류 재시도), `workers/supervise.sh` 감독, `workers/opencode-worker.json`
  - `workers/common-engine-rules.md`, `common-publish.md`, `small-steps.md`, `merge-main.md`, `survey-common.md`, `example-brief-g1-overlays.md`
  - `tools/review-figures.mjs`(독립 검토, `REVIEW_BACKEND=opencode` 지원), `tools/publish-figures.mjs`(게시; batch3부터는 render-plan의 `<name>-state.json`을 읽는 사본을 썼다 — 필요하면 상태 파일 이름만 맞춘다), `tools/verify-published-loose.mjs`(해설 페이지 열림 확인, `APMS_ROOT=<워크트리>`), `tools/hints.mjs`(작성자 힌트)
  - `golden.manifest.json`, `golden/itemNN/plan.json`
- 엔진 클론(작업자 워크트리를 만드는 곳, 파이썬·Chrome 의존성 원본): `D:/AI_WORKSPACES/APMS/svg-engine-line-20261019` (브랜치 `claude/svg-engine-m1-20261019`, 지우거나 리셋하지 말 것). 그 아래 git 무시 `.tmp/archive/svg-engine-development-20261015/` = 옛 캠페인 데이터(AUTO, REGRESS, PILOT).
- 지시서·로그: `D:/AI_WORKSPACES/APMS/briefs/` (모든 brief, `*-steps.log`, `*-runner.out`, `supervise.state`).
- 조사: `D:/AI_WORKSPACES/APMS/middle-survey/`, `D:/AI_WORKSPACES/APMS/surveys/{mid-1sem,high-h1-2sem,high-h2}/`.
- 그림 산출물: `D:/AI_WORKSPACES/APMS/<task>-out/` (mid-1-out, mid-2a-out, mid-2b-out, mid-3-out, x6-out, x7-out, x8-out, g1-out, svg-g2-out, g3-graph-regions-out, g4-out, g5-trig-general-out, g6-coord-angles-out …).
