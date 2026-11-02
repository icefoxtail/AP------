# G13 엔진 묶음 공통 규칙 (Linux 클라우드, 2026-11-02)

이 문서는 G13a·G13b·G13c 지시서가 함께 쓰는 고정 문구다. 예전 `engine-common.md`(옛 브랜치 이름)는 쓰지 않는다.

## 환경
- 너는 Agent 도구의 git worktree 안에서 시작한다(현재 디렉터리 = 워크트리 루트, origin/main 기준). 첫 동작: `git log --oneline -1`로 기준 확인, `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine` (`.tmp/archive` 링크 금지).
- 렌더 환경: `export PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
- 렌더: `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`(재렌더 전 `out/` 삭제). PNG: `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`.
- 산출물(렌더 결과·정답지 비교·실제 문항 그림)은 `/home/user/AP------/.tmp/svg-m1/runs/<묶음 id>/` 아래에만 쓴다. 본 체크아웃(`/home/user/AP------`)의 저장소 파일은 건드리지 않는다.
- 다른 묶음 작업자가 동시에 다른 워크트리에서 일한다. 렌더·테스트는 하나씩, 1분 부하 7 이상이면 기다린다. 남의 프로세스를 끄지 않는다.

## 원칙 (HANDOFF §1 규칙 8)
- 가짜 지원 금지: 못 그리면 오류 코드로 거절한다. 새 필드는 옵트인이다. 새 필드가 없으면 기존 SVG는 바이트 동일.
- 독립 관측기(Python observer)는 plan에서 따로 계산해 최종 SVG를 검사한다. 새 표식·라벨도 관측기에 넣는다. 관측기·테스트를 약하게 만들어 통과시키지 않는다. 기존 테스트를 바꿨으면 이유를 커밋 본문에 쓴다.
- 새 필드마다: 키 화이트리스트(JS·Python 양쪽), semantic_model.py(색 등), 가이드(`production/author-guide-body.md` 해당 절 → `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성, `/home/user/AP------/.tmp/svg-m1/guide/` 발췌본은 메인이 갱신하니 건드리지 않음), `ops/tools/hints.mjs`에 새 오류 코드 안내(문자열 작은따옴표는 `\'`; 수정 후 `node -e "import('./archive/tools/geometry-equation/ops/tools/hints.mjs')"`), phase2.mjs 계약 문구가 있으면 그 줄.
- 라벨 자리가 없으면 지시선으로 끌어내기를 먼저 지원한다(사용자 규칙). 필수 라벨을 지워서 통과시키지 않는다.

## 테스트·정답지
- 시작 시 관련 테스트(`tests/` 와 `archive/tools/geometry-equation/**/test*`에서 네 capability를 grep)를 돌려 기준을 적고, 끝에 같은 것만 다시 돌린다. 전체 스위트는 돌리지 않는다.
- 정답지 회귀(표본, 사용자 결정 2026-11-01): 지시서의 정답지 목록을 **고치기 전에** 워크트리에서 렌더해 `runs/<묶음>/golden-before/<item>/`에 저장하고, 끝에 `golden-after/`로 다시 렌더해 `cmp`로 바이트 비교한다. item.json은 `ops/golden.manifest.json`의 sourcePath·ordinal로 만든다(`/home/user/AP------/.tmp/svg-m1/golden-one.sh` 참고, WT·OUT 환경변수). 하나라도 다르면 원인을 고친다.
- 새 정답지 항목: 대표 문항 하나를 `ops/golden/item1NNg13x/plan.json` + `ops/golden.manifest.json`에 추가.

## 실제 문항
- 지시서의 샘플 문항을 새 기능으로 다시 그려 ARCHIVE_BOUND까지, PNG를 직접 보고 확인한다. 결과(item.json, plan.json, out/figure-solution.svg, figure.png, publish.json {alt, caption, size})는 `runs/<묶음>/<시험 약칭>-q<N>/`.
- 해설 그림 기준(plan-current.md): 핵심 중간값만 그림에, 정답은 caption 끝에만. 떠 있는 글자 금지.

## 커밋
- 기능별 커밋 `feat(svg-engine): ...` 한국어 요약 + 짧은 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. 모든 파일 LF. 커밋 전 `git diff --stat origin/main`이 실제 변경 크기인지 확인.
- push·PR·병합 금지. 시험지 JS(`archive/exams/**`) 수정 금지. 끝나면 백그라운드 작업을 남기지 않는다.

## 보고 (12줄 이내)
워크트리 경로·브랜치, 커밋 해시, 새 필드·오류 코드, 관련 테스트 전후, 정답지 바이트 동일 수/전체, 실제 문항별 상태·PNG 경로, 못 한 것과 이유(엔진 구조/규칙 충돌/알고리즘).
