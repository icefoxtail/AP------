# {ID}: {제목} (엔진 확장)

<!-- 쓰기 전에 ops/svg-m1/BRIEF_RULES.md를 읽는다. 기능마다 설계 4가지(필드·계산 방법·관측기 확인·거절 코드)를 비우지 않는다. 탈출 문구 금지. -->

토큰을 아낀다: 큰 파일은 grep으로 필요한 부분만 읽고, 출력은 tail로 짧게. 그림 PNG는 마지막 확인 때만 본다.

## 환경 (Windows, Git Bash)
- 워크트리 만들기(첫 동작):
  `git -C {REPO} fetch origin main && git -C {REPO} worktree add -b claude/{BRANCH} {WTROOT}/{NAME}/AP------ origin/main`
  그 뒤 그 트리로 가서 `mkdir .tmp`, 렌더 의존성 정션: `cmd //c "mklink /J <트리>\.tmp\apmath-visual-engine {REPO}\.tmp\apmath-visual-engine"`(명령을 파일로 써서 실행해도 된다; heredoc 백슬래시 주의). `.tmp/archive` 링크 금지.
- 이 트리 밖 파일 수정 금지. 남의 프로세스 종료 금지.
- python: `PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python`, 한글 출력은 `python -X utf8`. 렌더는 설치된 Chrome(channel chrome), 하나씩.
- 렌더: `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`(재렌더 전 `out/` 삭제). item.json = `{"sourcePath":"archive/exams/original/...js","ordinal":N}`. PNG: `node {TOOLS}/svg2png.cjs in.svg out.png 520`.
- 산출물 폴더: `{TOOLS}/runs/{id}/`.

## 문제
지금 엔진이 왜 못 하나(가이드 절·코드 위치·오류 코드).

## 기존 규칙과 충돌하는 곳
새 기능이 부딪히는 기존 필수 규칙과 연결 방법(예: 극점 requiredPoints 필수 ↔ coordinateBand.hide).

## 기능별 설계 (1~3개)
### 기능 1: ...
- 필드: `{...}` (예시 한 줄)
- 계산: 어느 모듈에서 어떤 방법으로(SymPy 함수 이름 등)
- 관측기: 최종 SVG에서 독립 재계산해 확인할 것
- 거절: 경우와 오류 코드 이름

## 실제 문항 (최신 고등 26→25→24)
- 시험지 경로 #번호, 문제 그림 경로, 그려야 할 것 한 줄.
- 기존 해설 그림 확인: 문항 객체에 `solutionImage`로 시작하는 키가 하나라도 있으면 그 그림을 렌더해 새 그림과 비교, 정답 노출 여부와 더 나은지 한 줄.
- 각각 plan.json, out/figure-solution.svg, figure.png, publish.json {alt,caption,size}(해설의 핵심 중간값만 그림 안에, 정답은 caption에 따로 — BRIEF_RULES 규칙 11), item.json.

## 완료 기준
- 관련 단위 테스트 추가·통과(전체 스위트 금지). 관측기 변조 테스트. 기존 테스트를 바꿨으면 이유를 커밋 본문에.
- 정답지 회귀: {관련 정답지 목록}을 시작 전·후 렌더해 바이트 동일. 새 항목 `{item}` + `ops/golden.manifest.json`. golden-out 폴더에는 쓰지 않는다.
- 가이드 해당 절 갱신, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성, `ops/tools/hints.mjs` 안내.
- **모든 파일 LF**(커밋 전 `git diff --stat origin/main`이 실제 변경 크기인지 확인).
- 커밋 `feat(svg-engine): ...` 한국어 본문 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 시험지 JS 수정 금지. 끝나면 백그라운드 작업을 남기지 않는다.

## 보고 (8줄 이내)
커밋 해시, 새 필드·오류 코드, 테스트 수, 정답지 바이트 동일 수, 문항별 상태·PNG 경로·기존 대비 판단, 못 한 것과 그 이유(엔진 구조/규칙 충돌/알고리즘).
