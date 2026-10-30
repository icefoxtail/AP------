# 엔진 확장 E13·E22: 좌표 그래프 — 격자점 여러 개, 표시 창·확대, 기울기 큰 직선 식 라벨

**먼저(필수):** 이 워크트리는 main 기준일 수 있다. 시작하자마자
`git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`
(새로 만든 너의 워크트리이므로 안전). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지).

관련 코드: 그래프 경로(`rational-spike-v1`·`piecewise-polynomial-spike-v1`·`multi-curve-figure-v1`와 overlays, `production/phase2.mjs`, 관련 관측기), 좌표 작도(`SOURCE_COORDINATE_AXES_v1`) 경로, 테스트(`tests/` 중 graph·overlay·rational·coordinate 관련), 가이드의 해당 절.

## 실제로 막힌 문항 (plan·item.json은 각 폴더, packet은 `/home/user/AP------/.tmp/svg-m1/packets/`)
1. **E13 격자점**: 26_왕운중 2학기 중간 중1 q14 — y=8/x(x>0) 아래·축 위의 격자점 16개와 열별 개수(x=1..7) 표시. overlays 점 8개 한도에 막힘. `runs/26_왕운중-plane2/q14/` (없으면 packet으로 새로). 필요: 격자점 집합을 조건으로 지정(`latticePoints:{region:"BELOW_CURVE",curve:..., xRange, yMin, strict}`처럼)하면 엔진이 정확히 열거해 그리고 관측기가 독립 열거해 대조, 열별 개수 라벨 선택. 점이 많아도(최대 40 정도) 이름 없이 작은 점.
2. **E22 표시 창·확대**: 25_왕운중 2학기 중간 중1 q22 — 정사각형 ABCD가 그래프 안에서 너무 작음(좌표·한 변 4가 안 보임). `runs/25_왕운중-plane3/q22/`. 필요: 작성자가 표시 창(viewport)을 지정하거나 관심 영역 확대 패널을 둘 수 있게, 그때 눈금 간격 자동 조정. 점 좌표 라벨·변 길이 라벨이 겹침 없이 들어가야 함.
3. **E22 기울기 큰 직선 식 라벨**: 25_왕운중 2학기 중간 중1 q20 — y=ax·y=cx 같은 기울기 큰 직선 식 라벨이 LAYOUT_INVENTORY_INCOMPLETE. `runs/25_왕운중-plane3/q20/`(plan.v4-attempt-labels-unresolved.json 참고, 이전 ±24 창은 라벨이 들어갔음). 필요: 직선 식 라벨을 그 직선의 창 안 구간 위 빈 자리(끝 근처·중간)에서 찾는 배치 보강, 라벨-직선 소속은 관측기가 검사.

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시. 새 필드를 쓰지 않는 plan의 SVG는 바이트 동일(라벨 배치를 바꾸면 기존 성공 배치는 그대로 두고 실패하던 경우에만 새 배치로).
- 가이드 해당 절에 짧게, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. 다른 절은 건드리지 않는다.
- 테스트: 관련 node/python 테스트, 시작 시 기준 결과 기록 후 비교. 정답지 회귀(바이트 동일): golden item15, 16, 25, 30, 32, 35, 49 — 하나씩, 기준 SVG는 시작 시 네 워크트리에서 먼저 렌더해 저장 후 비교.
- 실제 문항 3개를 새 기능으로 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인. 해설 그림에 묻는 답을 미리 적지 않는다. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size})는 `/home/user/AP------/.tmp/svg-m1/runs/e13e22/<시험지 짧은 이름>-q<N>/`. 정답지에 대표 문항을 `ops/golden/item57/plan.json`으로(+manifest).
- 별도 git worktree(지금 디렉터리). 렌더·테스트는 하나씩(CPU 4개를 여러 작업자가 나눠 씀). 커밋은 기능별: `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃 /home/user/AP------ 는 건드리지 않는다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트 결과, 정답지 바이트 동일, 실제 문항별 상태와 PNG 경로, 못 한 부분과 이유, 워크트리 경로·브랜치.
