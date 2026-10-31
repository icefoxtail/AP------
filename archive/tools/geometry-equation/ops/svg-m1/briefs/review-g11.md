# G11 엔진 묶음 검수 (독립 검수자)

너는 G11 작업자와 **다른** 검수자다. 작업자 보고를 믿지 말고 직접 실행해 PASS/FAIL을 판정한다. 파일을 고치지 않는다(검수용 임시 산출물만 `/home/user/AP------/.tmp/svg-m1/runs/review-g11/`에). push·PR 금지.

입력: 작업자 브랜치 `claude/svg-g11-callout-coord-angle`(로컬 브랜치, 작업자 워크트리 경로 `{WT_WORKER}`), 커밋 `{COMMITS}`. 지시서 원문: `/home/user/AP------/.tmp/svg-m1/briefs/engine-g11-callout-coord-angle.md`(완료 기준을 그대로 대조한다).

## 1. 작업 트리
```
cd /home/user/AP------ && git worktree add --detach .claude/worktrees/review-g11 claude/svg-g11-callout-coord-angle
cd .claude/worktrees/review-g11 && mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine
export GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python
```
이후 명령은 이 트리에서. 렌더·테스트는 하나씩(CPU 4개 공유).

## 2. 정적 검사
- `git diff --stat origin/main...HEAD | tail -3`: 변경이 엔진 폴더(`archive/tools/geometry-equation/`) 안뿐인지, 시험지 JS(`archive/exams/**`) 변경 0인지, 줄 수가 실제 크기인지(CRLF 폭증 없음: `git diff origin/main...HEAD | grep -c $'\r'` = 0).
- **사라진 오류 코드:** 지워진 줄의 `'[A-Z][A-Z0-9_]{5,}'` 따옴표 문자열을 모아 HEAD에서 `git grep -c`로 0인 것을 목록으로. 커밋 본문에 이유가 없으면 FAIL.
- **바뀐 기존 테스트:** 기존 테스트 파일에서 지워지거나 기대값이 바뀐 assert를 모두 보고, 이유가 정당한지(관측기·테스트 약화가 아닌지) 판단. 약화면 FAIL.
- 관측기 독립성: 새 검사(CALLOUT_OVERLAPS_AXES, CALLOUT_AXIS_EXTENT_MISMATCH, CALLOUT_ARC_SCALE_MISMATCH, CALLOUT_ANGLE_DIMENSION_*, PATH_LABEL_LEADER_CROSSES_SEGMENT, 경로 라벨 2차 분기)가 렌더 코드 결과를 그대로 베끼지 않고 plan·최종 SVG에서 다시 계산하는지 코드를 읽어 확인. 기능 3의 관측기 완화가 `data-path-label-fallback="1"` 표시가 있을 때만 적용되는지 확인.
- 충돌 표식 `git grep -n '^<<<<<<<\|^>>>>>>>' -- archive/tools/geometry-equation` 0.

## 3. 테스트
지시서 "완료 기준"의 node·python 관련 테스트를 그대로 실행하고, origin/main 트리에서 같은 명령의 실패 수와 비교(main 쪽은 실패한 파일만 다시 돌려 확인). 원래 있던 실패 외 새 실패 = FAIL. `node --test --test-reporter=tap <파일>`로 통과 수를 정확히 적는다. author-guide 테스트(가이드 동기화) 통과 필수.

## 4. 정답지 전체 회귀
기준 SVG: `/home/user/AP------/.tmp/svg-m1/golden-main/item<N>/figure-solution.svg`(현재 main으로 렌더해 둔 것, `result.txt`에 상태). 이 트리에서 manifest의 **모든** 항목(item29 제외)을 하나씩 렌더:
`for n in <manifest 번호들>; do WT=$PWD node /home/user/AP------/.tmp/svg-m1/golden-one.mjs /home/user/AP------/.tmp/svg-m1/runs/review-g11/golden/item$n $n; done` (백그라운드로 돌리고 끝까지 기다린다. 약 70~80분)
각 항목 `cmp`로 비교해 `/home/user/AP------/.tmp/svg-m1/runs/review-g11/golden-result.txt`에 `itemNN STATUS SAME|DIFF|NEW`. 새 항목(item84g11a·item85g11b·item86g11c)은 ARCHIVE_BOUND면 NEW. 기준 쪽이 렌더 실패였던 항목은 따로 표시(원래 실패). DIFF가 하나라도 있으면 FAIL(어느 파일·어느 요소가 다른지 `diff`로 짧게).

## 5. 실제 문항 그림 (학생 화면 기준)
`/home/user/AP------/.tmp/svg-m1/runs/g11/*/` 3개 폴더의 plan.json을 **이 트리에서 다시 렌더**해 status와 SVG가 작업자 산출물과 같은지 확인하고, PNG를 520px와 360px(휴대폰 폭) 두 크기로 만들어 직접 본다. 판정 기준(CLAUDE.md: 학생이 화면에서 보고 이해할 수 있는가):
- 라벨·치수선이 서로·선분·축과 겹치거나 가려지지 않는다. 어느 것의 라벨인지 헷갈리지 않는다.
- 필수 라벨(문제에 나온 점 이름·주어진 값)이 빠지지 않았다. 작업자가 라벨을 지워 통과시켰으면 FAIL.
- 그림·alt·caption에 **최종 답·정답 보기 번호·"옳은/옳지 않은" 판정**이 없다(문제가 준 값과 풀이 중간값은 노출이 아니다). 25_팔마고 #9는 무게중심 좌표가 답이다 — 어디에도 있으면 FAIL. 각 문항의 정답은 시험지 JS의 answer 필드로 직접 확인.
- 원문에 없는 이름·값을 쓰지 않았다.
- 기능 1: 좌표평면 축·눈금이 끌어낸 그림을 뚫지 않는다. 기능 2: 끌어낸 각의 호가 반직선 길이에 비례해 보이고, 각 치수선 양 끝 화살촉이 두 반직선에 닿는다. 기능 3: CD 경로 라벨이 CG 구간이 아니라 CD 전체를 가리킨다고 읽힌다.
- 기존 해설 그림이 있는 문항(25_왕운중 #6, 26_왕운중 #8은 JS에서 `solutionImage`로 시작하는 키 확인)은 기존 SVG도 PNG로 만들어 나란히 보고 better=NEW|OLD|TIE와 이유 한 줄.

## 6. 판정·보고 (10줄 이내)
PASS 조건: 2의 설명 없는 삭제·약화 없음, 3 새 실패 없음, 4 DIFF 없음, 5 세 문항 모두 학생 기준 통과. 보고: PASS/FAIL, 검수한 HEAD 해시, 테스트 수치(main 대비), 정답지 SAME n / NEW n / DIFF 목록, 문항별 판정·PNG 경로·better 판정, FAIL이면 정확한 원인과 고칠 곳(파일·함수). 끝나면 `git worktree remove --force .claude/worktrees/review-g11`.
