# 엔진 묶음 병합 검수 (cherry-pick → 충돌 해소 → 테스트 → 정답지 회귀)

너는 엔진 작업자의 커밋을 최신 작업 브랜치 위에 올려 검수한다. **push·PR 금지**(코디네이터가 PASS를 보고 직접 올린다). 본 체크아웃(/home/user/AP------)의 파일은 건드리지 않는다.

입력: `{TAG}`(예: e30), `{COMMITS}`(순서대로 cherry-pick할 해시들, 작업자 브랜치 `{SRCBRANCH}`).
H=/home/user/AP------/.tmp/svg-m1  (도구 위치. sm_resolve.py·golden-one.sh도 여기에 있다)

## 1. 작업 트리
```
cd /home/user/AP------ && git fetch origin claude/fervent-knuth-s3xr1a
git worktree add -b merge-{TAG} .claude/worktrees/merge-{TAG} origin/claude/fervent-knuth-s3xr1a
cd .claude/worktrees/merge-{TAG} && mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine
```
이후 모든 명령은 이 트리에서. 디스크가 모자라면(`No space left`) 보고하고 멈춘다(지우지 않는다).

## 2. 빠진 관측 코드 검사 (cherry-pick 전)
각 커밋에서 지워진 줄의 오류 코드(`'[A-Z][A-Z0-9_]{5,}'` 따옴표 문자열)를 모아, cherry-pick 뒤 트리에 그 코드가 하나도 남지 않은 것을 목록으로 만든다(이름만 바뀐 경우는 새 이름 확인). 사라진 코드가 있으면 이유를 작업자 커밋 본문에서 찾고, 설명 없으면 FAIL 사유.

## 3. cherry-pick과 충돌 해소
`git cherry-pick {COMMITS}`. 충돌 시:
- `python3 $H/resolve-engine-conflicts.py`: golden.manifest.json(항목 합집합)·hints.mjs(새 줄 합집합).
- `semantic_model.py`의 FIELDS/REQUIRED 충돌 블록: `python3 /home/user/AP------/.tmp/svg-m1/sm_resolve.py <그 파일>`(합집합).
- `production/author-guide-body.md`: 양쪽 문단을 모두 살려 손으로 합친다(같은 절에 두 기능 설명이 함께 있게).
- `production/AUTHOR_GUIDE.md`: `git checkout --theirs` 후 계속; 모든 cherry-pick이 끝나면 `node archive/tools/geometry-equation/production/build-author-guide.mjs`로 재생성하고 변경이 있으면 `docs(svg-engine): AUTHOR_GUIDE 재생성 (merge {TAG})` 커밋.
- 그 밖의 코드 충돌: 두 쪽 기능을 모두 살린다. 의미가 불분명하면 그 커밋에서 멈추고 충돌 내용을 보고(FAIL)한다.
- 충돌 표식(`<<<<<<<`)이 커밋에 남지 않았는지 `git grep -n '^<<<<<<<\|^>>>>>>>' -- archive/tools/geometry-equation`으로 확인.

## 4. 테스트 (관련 전부)
- python: `PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python python3 -m unittest discover -s archive/tools/geometry-equation -p 'test_*.py'`(위치가 다르면 저장소의 기존 방식). 기준 실패: test_graph_spike 반복근 1건(원래 있던 것). 그 밖의 실패 = FAIL.
- node: 커밋들이 건드린 기능의 `archive/tools/geometry-equation/tests/*.test.mjs`와 author-guide 테스트. 작업자 보고에 "원래 실패"로 적힌 것(construction-candidate-svg-v1 14개 등)은 origin 기준에서 같은 수인지 확인.

## 5. 정답지 회귀 (사용자 결정 2026-11-01, BRIEF_RULES 규칙 10)
**기본은 표본**: 커밋이 바꾼 코드가 그리는 정답지 항목 10개 안팎과 새로 들어온 항목만 아래 방식으로 렌더해 비교한다. **전체 회귀는 main PR 직전이거나, 공용 파일(`plane-marks.mjs`·`engine.py`·`semantic_model.py`·observer 등)의 충돌을 손으로 해소한 병합일 때만** 한다. 전체는 다른 렌더 작업이 없는 때 돌린다. 이유: 비용은 토큰이 아니라 시간·CPU(70~100분)이고, 손으로 합친 공용 코드는 표본으로 놓칠 수 있다.

### 전체를 돌리는 경우의 절차
`ops/golden.manifest.json`의 **모든** 항목(item29 제외, X9 원래 실패)을 하나씩 렌더한다(`/home/user/AP------/.tmp/svg-m1/golden-one.sh`를 참고하되 WT를 이 트리로, OUT을 `$H/runs/merge-{TAG}/golden/<item>`로 바꾼 사본을 `$H/runs/merge-{TAG}/`에 만들어 쓴다). 기존 항목은 저장 SVG와 바이트 동일, 이번에 새로 들어온 항목은 ARCHIVE_BOUND. 결과를 `$H/runs/merge-{TAG}/golden-result.txt`에 `itemNN STATUS SAME|DIFF|NEW` 줄로. CPU 4개 공유이니 하나씩.

## 6. 판정·보고 (10줄 이내)
PASS 조건: 2의 설명 없는 삭제 없음, 3의 충돌 표식 없음, 4 기준 외 실패 없음, 5 DIFF 없음(표본이면 표본 안에서). 보고: PASS/FAIL, `merge-{TAG}` 브랜치 HEAD 해시와 커밋 수, 해소한 충돌 파일, 테스트 수치, 정답지 집계(SAME n / NEW n / DIFF 목록), FAIL이면 정확한 원인. 브랜치와 작업 트리는 그대로 둔다.
