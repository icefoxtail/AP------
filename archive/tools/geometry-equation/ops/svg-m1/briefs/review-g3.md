# G3 엔진 묶음 검수 (독립 검수자)

너는 G3 작업자와 **다른** 검수자다. 작업자 보고를 믿지 말고 직접 실행해 PASS/FAIL을 판정한다. 파일을 고치지 않는다(검수용 임시 산출물만 `/home/user/AP------/.tmp/svg-m1/runs/review-g3/`에). push·PR 금지.

입력: 작업자 브랜치 `claude/svg-g3-vectors`(로컬 브랜치, 작업자 워크트리 경로 `{WT_WORKER}`), 커밋 `{COMMITS}`. 지시서 원문: `/home/user/AP------/.tmp/svg-m1/briefs/engine-g3-vectors.md`(완료 기준을 그대로 대조한다).

## 1. 작업 트리
```
cd /home/user/AP------ && git worktree add --detach .claude/worktrees/review-g3 claude/svg-g3-vectors
cd .claude/worktrees/review-g3 && mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine
export GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python
```
이후 명령은 이 트리에서. 렌더·테스트는 하나씩(CPU 4개 공유).

## 2. 정적 검사
- `git diff --stat origin/main...HEAD | tail -3`: 변경이 엔진 폴더(`archive/tools/geometry-equation/`) 안뿐인지, 시험지 JS(`archive/exams/**`) 변경 0인지, 줄 수가 실제 크기인지(CRLF 폭증 없음: `git diff origin/main...HEAD | grep -c $'\r'` = 0).
- **사라진 오류 코드:** 지워진 줄의 `'[A-Z][A-Z0-9_]{5,}'` 따옴표 문자열을 모아 HEAD에서 `git grep -c`로 0인 것을 목록으로. 커밋 본문에 이유가 없으면 FAIL.
- **바뀐 기존 테스트:** 기존 테스트 파일에서 지워지거나 기대값이 바뀐 assert를 모두 보고, 이유가 정당한지(관측기·테스트 약화가 아닌지) 판단. 약화면 FAIL.
- 관측기 독립성: 새 검사(VECTOR_LABEL_*, VECTOR_DIRECTION_MISMATCH, VECTOR_TIP_DOT_PRESENT, VECTOR_COMPONENT_MISMATCH, VECTOR_SUM_*, VECTOR_DIFF_MISMATCH, VECTOR_SCALE_MISMATCH)가 렌더 코드 결과를 베끼지 않고 plan·최종 SVG에서 다시 계산하는지 코드를 읽어 확인. math_expression 파서 확장이 `vec(` 없는 기존 식의 해석·직렬화를 바꾸지 않는지(테스트 존재) 확인.
- 충돌 표식 `git grep -n '^<<<<<<<\|^>>>>>>>' -- archive/tools/geometry-equation` 0.

## 3. 테스트
지시서 "완료 기준"의 node·python 관련 테스트를 그대로 실행하고, origin/main 트리에서 같은 명령의 실패 수와 비교(main 쪽은 실패한 파일만 다시 돌려 확인). 원래 있던 실패 외 새 실패 = FAIL. `node --test --test-reporter=tap <파일>`로 통과 수를 정확히 적는다. author-guide 테스트(가이드 동기화) 통과 필수.

## 4. 정답지 (렌더하지 않는다 — 사용자 지시로 시간 단축)
작업자의 `/home/user/AP------/.tmp/svg-m1/runs/g3/` 정답지 결과 파일을 읽어 표본 12개가 SAME인지만 확인하고, 새 item87g3a·88g3b·89g3c가 ARCHIVE_BOUND인지 결과 JSON으로 확인한다. 직접 렌더는 5단계 문항 3개뿐.

## 5. 실제 문항 그림 (학생 화면 기준)
`/home/user/AP------/.tmp/svg-m1/runs/g3/*/` 3개 폴더의 plan.json을 **이 트리에서 다시 렌더**해 status와 SVG가 작업자 산출물과 같은지 확인하고, PNG를 520px와 360px(휴대폰 폭) 두 크기로 만들어 직접 본다. 판정 기준(CLAUDE.md: 학생이 화면에서 보고 이해할 수 있는가):
- 라벨·치수선이 서로·선분·축과 겹치거나 가려지지 않는다. 어느 것의 라벨인지 헷갈리지 않는다.
- 필수 라벨(문제에 나온 점 이름·주어진 값)이 빠지지 않았다. 작업자가 라벨을 지워 통과시켰으면 FAIL.
- 그림·alt·caption에 **최종 답·정답 보기 번호·"옳은/옳지 않은" 판정**이 없다(문제가 준 값과 풀이 중간값은 노출이 아니다). 23_매산고 #5는 AB+AF와 같은 벡터(=AO 등)를 등식으로 쓰면 FAIL(합벡터 라벨은 식만). 각 문항의 정답은 시험지 JS의 answer 필드로 직접 확인.
- 원문에 없는 이름·값을 쓰지 않았다.
- 기능 1: 벡터 이름(→a, →AB)이 화살표 달린 글자로 바르게 보이고 어느 화살표의 이름인지 분명하다. 기능 2: 화살촉이 점 dot에 가리지 않고 방향이 맞다. 기능 3: 평행사변형 점선과 합벡터가 학생이 보고 a+b를 이해할 수 있다.
- 기존 해설 그림이 있는 문항(JS에서 `solutionImage`로 시작하는 키 확인)은 기존 SVG도 PNG로 만들어 나란히 보고 better=NEW|OLD|TIE와 이유 한 줄.

## 6. 판정·보고 (10줄 이내)
PASS 조건: 2의 설명 없는 삭제·약화 없음, 3 새 실패 없음, 4 작업자 표본 DIFF 없음, 5 세 문항 모두 학생 기준 통과. 보고: PASS/FAIL, 검수한 HEAD 해시, 테스트 수치(main 대비), 정답지 SAME n / NEW n / DIFF 목록, 문항별 판정·PNG 경로·better 판정, FAIL이면 정확한 원인과 고칠 곳(파일·함수). 끝나면 `git worktree remove --force .claude/worktrees/review-g3`.
