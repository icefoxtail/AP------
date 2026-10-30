# 엔진 확장 공통 규칙 (E31~E34)

**먼저(필수):** 시작하자마자 `git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`(새로 만든 너의 워크트리이므로 안전; E30까지 들어 있다). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지). 다른 묶음 작업자가 동시에 다른 가족(평면/좌표·그래프/입체/수직선·통계)을 고친다 — 네 묶음 범위 밖 가족의 렌더 코드는 건드리지 않는다(공용 파일 render-plan.mjs·phase2.mjs·semantic_model.py·가이드는 필요한 줄만).

실제 막힌 문항 plan·그림: `/home/user/AP------/.tmp/svg-m1/runs/<폴더>/q<N>/`(plan.json, figure.png, 실패 기록), packet `/home/user/AP------/.tmp/svg-m1/packets/<시험>.json`. 대기 목록 `/home/user/AP------/.tmp/svg-m1/runs/wait-engine.txt`.

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시, 관측기는 새 표식을 plan에서 독립 계산해 대조. 새 필드가 없으면 기존 SVG 바이트 동일.
- 가이드 해당 절에 짧게(필드·예시 한 줄), `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. hints.mjs(`archive/tools/geometry-equation/ops/tools/hints.mjs`)에 새 코드 안내.
- 테스트(python은 `PYTHONPATH=/home/user/AP------/.tmp/apmath-visual-engine/dependencies/python python3 -m unittest ...`): 시작 시 관련 테스트 기준 기록 후 비교, 관련 테스트만.
- 정답지 회귀(바이트 동일): `ops/golden.manifest.json`에서 네가 고치는 capability를 쓰는 golden 항목 **전부**를 시작 시 네 워크트리에서 먼저 렌더해 기준 SVG를 저장하고, 끝에 다시 렌더해 바이트 비교. item29는 원래 실패(X9)라 제외.
- 실제 문항을 새 기능으로 다시 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`)를 직접 보고 확인. 정답 값·정답 보기 번호를 그림·alt·caption에 쓰지 않는다. 원문에 없는 이름·값을 쓰지 않는다. 결과(plan.json, out/figure-solution.svg, figure.png, publish.json {alt,caption,size}, item.json)는 `/home/user/AP------/.tmp/svg-m1/runs/<묶음>/<폴더>-q<N>/`. 정답지에 대표 문항 하나를 새 item으로(+manifest).
- 별도 git worktree. 렌더·테스트는 하나씩(CPU 4개 공유). 커밋은 기능별 `feat(svg-engine): ...`(버그는 `fix(svg-engine): ...`) + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃은 건드리지 않는다.
- 기능 하나가 너무 크면(2시간 넘게 걸릴 듯) 설계만 적고 다음으로 넘어가 보고에 남긴다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트, 정답지 바이트 동일(항목 수), 실제 문항별 상태·PNG 경로, 못 한 부분과 이유, 워크트리·브랜치.
