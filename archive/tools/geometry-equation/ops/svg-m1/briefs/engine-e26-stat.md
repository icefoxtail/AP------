# 엔진 확장 E26: 통계 그림 강조 (stat-chart-figure-v1) — 다각형 점·계급 강조, 묶음 합, 미상·복원 계급

**먼저(필수):** 이 워크트리는 main 기준일 수 있다. 시작하자마자
`git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`
(새로 만든 너의 워크트리이므로 안전; E14 줄기와 잎 확장이 이미 들어 있다). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지).

코드: `production/stat-chart-v1.mjs`, 관측기 `production/stat_chart_observer.py`(+`stat-chart-observer-worker.py`), 테스트 `tests/stat-chart.test.mjs`(+python), 가이드 `production/author-guide-body.md` 3-11절·3-43절.

## 실제로 막힌 문항 (중1 2학기 기말 통계 단원; 시험지마다 4~6문항씩 나옴)
plan·그림: `/home/user/AP------/.tmp/svg-m1/runs/<폴더>/q<N>/` (plan.json, figure.png), packet `/home/user/AP------/.tmp/svg-m1/packets/<시험지>.json`(questionImage로 원문 확인).
- `25_팔마중기말-stat1/q16`: 찢어진 40~45 계급을 총합으로 복원(25−16=9) → **복원한 막대를 점선 테두리**로(`restoredClasses:[i]`), 값은 묻는 답이면 쓰지 않음.
- `25_팔마중기말-stat1/q19`(UNSUPPORTED였음): 지워진 13~15 두 계급(도수 미상) → `frequencies`에 `null`(미상) 허용 + 두 계급 묶음 괄호와 합 라벨(`classSums:[{from:i,to:j,label:"14"}]`), 다각형은 미상 계급에서 끊김 또는 점선.
- `25_팔마중기말-stat1/q17`, `q24`, `25_풍덕중기말-stat1/q17`·`q18`·`q19`: 두 집단 다각형·히스토그램에서 **계급 강조**(`highlightClasses`를 FREQUENCY_POLYGON에도: 해당 계급의 점을 크게/색), **점 강조**(`highlightPoints:[{series:0,class:3}]`), 계급 묶음별 서로 다른 강조와 묶음 합 라벨(13명·5명), 값 라벨이 선과 겹치면 자동으로 비켜 놓기(지금은 `STAT_CHART_RENDERED_LAYOUT_FAIL`이라 `showValues`를 꺼야 함).
- `25_풍덕중기말-stat1/q18`: 문제 그림은 다각형만인데 강조하려고 막대를 추가해 버림 → 다각형 점 강조로 대체.
- 관측기는 plan에서 강조 대상(계급·점·묶음·복원·미상)을 독립 계산해 최종 SVG의 표식이 정확히 그 계급·점에 붙었는지 검사(다른 계급에 붙으면 FAIL).

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시. 새 필드가 없으면 기존 SVG 바이트 동일.
- 가이드 3-11·3-43절에 짧게, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. 다른 절은 건드리지 않는다.
- 테스트: 위 테스트 + 추가, 시작 시 기준 결과 기록 후 비교. 정답지 회귀(바이트 동일): golden item21, 41, 51 — 하나씩, 기준 SVG는 시작 시 네 워크트리에서 먼저 렌더해 저장 후 비교.
- 실제 문항을 새 기능으로 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인. 정답을 그림에 미리 쓰지 않는다. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size})는 `/home/user/AP------/.tmp/svg-m1/runs/e26/<폴더>-q<N>/`. 정답지에 대표 문항을 `ops/golden/item58/plan.json`으로(+manifest).
- 별도 git worktree(지금 디렉터리). 렌더·테스트는 하나씩(CPU 4개를 여러 작업자가 나눠 씀). 커밋은 기능별: `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃 /home/user/AP------ 는 건드리지 않는다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트 결과, 정답지 바이트 동일, 실제 문항별 상태와 PNG 경로, 못 한 부분과 이유, 워크트리 경로·브랜치.
