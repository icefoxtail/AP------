# 엔진 확장 E21: 수직선(number-line-figure-v1) 중1 표기

코드: `production/number-line-v1.mjs`, 관측기 `production/number_line_observer.py`(+`number-line-observer-worker.py`), 테스트 `tests/number-line-figure.test.mjs`·`tests/number-line-surd-ends.test.mjs`(+python 있으면), 가이드 `production/author-guide-body.md`의 수직선 절(“number-line-figure-v1”을 grep).

**범위 밖(건드리지 않는다):** 값 없는 문자 점 행(SYMBOLS, -a·a 같은 문자 점)과 수직선 위 컴퍼스 작도는 다른 작업(X9)이 맡는다. 그 필드·오류 코드 이름(`SYMBOLS`, `NUMBER_LINE_SYMBOL_*`, `constructions`)을 쓰지 말고 그 기능을 만들지 않는다.

## 실제로 막힌 문항
- 25_동산중 2학기 중간 중1 q12: 수직선 -4~+4에서 ㄱ~ㅁ 다섯 점, -3~-2·+3~+4는 3등분, -1~0은 4등분, +1~+2는 2등분 눈금, 묻는 점 ㄴ의 값은 숨겨야 함. (문제 그림: `archive/assets/images/25_동산중_2학기_중간_중1_수학/q12-source-repaired.svg`)
- 25_동산중 q14: 점 이름(A, B, O)이 풀이에 없으면 이름 없이, 축 끝 변수 x 표시를 끌 수 있어야 함.

## 목표
1. **점 이름에 한글 자모**(ㄱ~ㅎ, 한 글자)와 이름 없는 점(`name:null` 또는 `hideName:true`) 허용.
2. **점별 값 라벨 숨김**(`showValue:false`): 묻는 점의 값을 그리지 않는다(점·이름은 그림).
3. **한 행 점 개수 상한**을 4에서 8 정도로(레이아웃 검사로 거절 가능).
4. **구간별 등분 눈금**: `subdivisions:[{"from":"-3","to":"-2","parts":3},...]`(정수 구간, parts 2~10). 지정 없는 구간은 지금처럼.
5. **축 변수 표시 끄기**: `axisVariable:false` 또는 비슷한 필드로 축 끝 x 제거.
- 관측기는 plan에서 점 위치·이름·값 라벨 유무·등분 눈금 위치를 독립적으로 다시 계산해 최종 SVG와 대조한다(눈금이 다른 위치에 있거나 숨긴 값이 보이면 FAIL).

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시, 새 필드 없으면 기존 SVG 바이트 동일.
- 가이드 수직선 절에 짧게 추가, `node archive/tools/geometry-equation/production/build-author-guide.mjs`로 재생성. 다른 절은 건드리지 않는다.
- 테스트: 위 테스트 + 추가 테스트(python은 `python3 -m unittest`), main 기준 먼저 기록해 비교. 정답지 회귀(바이트 동일): golden item11, item13 — 하나씩, 기존 SVG `/home/user/AP------/.tmp/svg-m1/golden-out/itemNN-solution.svg`.
- 실제 문항: q12·q14를 새 기능으로 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인. packet `/home/user/AP------/.tmp/svg-m1/packets/25_동산중_2학기_중간_중1_수학.json`, item `{"sourcePath":"archive/exams/original/middle/m1/2mid/25_동산중_2학기_중간_중1_수학.js","ordinal":N}`, 이전 시도 `/home/user/AP------/.tmp/svg-m1/runs/25_동산중-plane1/q12|q14/plan.json`. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size:"medium"|"large"})는 `/home/user/AP------/.tmp/svg-m1/runs/e21/q12|q14/`. 정답지에 q12를 `ops/golden/item53/plan.json`으로(+manifest).
- 별도 git worktree(지금 디렉터리). `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지). 렌더·테스트는 하나씩. 커밋: `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃은 건드리지 않는다.

## 완료 보고 (10줄 이내)
커밋 해시, 새 필드·오류 코드, 테스트 결과, 정답지 바이트 동일, q12·q14 상태와 PNG 경로, 워크트리 경로·브랜치.
