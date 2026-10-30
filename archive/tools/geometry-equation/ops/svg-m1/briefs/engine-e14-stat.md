# 엔진 확장 E14: 통계 그림 (stat-chart-figure-v1) — 줄기와 잎 문자 잎·순위 강조·계급 묶음

코드: `production/stat-chart-v1.mjs`, 관측기 `production/stat_chart_observer.py`(+`stat-chart-observer-worker.py`), 테스트 `tests/stat-chart.test.mjs`(+python 테스트가 있으면), 가이드 `production/author-guide-body.md` 3-11절(·3-43절).

## 실제로 막힌 문항
26_왕운중 2학기 중간 중1 q19: 줄기와 잎 그림에서 잎 두 개가 문자 a, b(10+a, 10+b; a+b=12만 알려짐)이고, 해설은 크기순 10·11번째 값(=10+a, 10+b)을 강조하고 5시간 단위 계급별 도수를 센다. 지금 STEM_LEAF는 0~9 정수 잎만, `marks`도 정수 값 기준이다.

## 목표
1. STEM_LEAF 잎에 문자 잎 `{"symbol":"a"}`(소문자 한 글자, 수식 글꼴)를 허용한다. 그 잎의 크기 순서는 작성자가 `order`(그 줄 안 위치) 또는 줄 안 정렬 규칙으로 정한다(값을 지어내지 않는다). 문자 잎이 있으면 그 줄의 숫자 잎 정렬과 충돌하는지 엔진이 검사한다.
2. 순위 강조: `marks:[{"rank":10},{"rank":11}]`처럼 **크기 순위로** 잎을 강조(동그라미/색)할 수 있게 한다(값이 문자여도 됨). 순위 계산은 줄기·잎 순서로 엔진과 관측기가 각각 독립 계산.
3. 계급 묶음(선택): `classGroups:[{"from":"0","to":"5","label":"3"}]`처럼 줄기와 잎에서 값 구간을 괄호/구분선으로 묶고 도수를 적는 표시. 구현이 크면 1·2만 하고 3은 명시적 거절 코드로 남겨 보고한다.
- 관측기는 plan에서 잎 배열·순위·묶음을 독립적으로 다시 만들어 최종 SVG의 각 잎 글자·위치·강조 표식·묶음이 맞는지 검사한다(강조가 다른 잎에 붙으면 FAIL).

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 "Engineering rules (hard)", "Other workers share this machine"(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시. 새 필드가 없으면 기존 SVG 바이트 동일.
- 가이드 3-11절에 짧게 추가, `node archive/tools/geometry-equation/production/build-author-guide.mjs`로 재생성. 다른 절은 건드리지 않는다(다른 작업자가 3-8·3-2·3-14·3-입체를 고친다).
- 테스트: `node --test archive/tools/geometry-equation/tests/stat-chart.test.mjs archive/tools/geometry-equation/tests/author-guide.test.mjs` + 추가 테스트(python은 `python3 -m unittest`). main 기준 결과를 먼저 기록해 비교.
- 정답지 회귀(바이트 동일): golden item21, 41 — 하나씩 렌더, 기존 SVG `/home/user/AP------/.tmp/svg-m1/golden-out/itemNN-solution.svg`와 sha256 비교.
- 실제 문항: `/home/user/AP------/.tmp/svg-m1/runs/26_왕운중-solidstat/q19/plan.json`을 바탕으로 다시 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인. packet `/home/user/AP------/.tmp/svg-m1/packets/26_왕운중_2학기_중간_중1_기출.json`(questionImage로 원문 확인), item `{"sourcePath":"archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js","ordinal":19}`. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size})는 `/home/user/AP------/.tmp/svg-m1/runs/e14/q19/`. 정답지에 `ops/golden/item51/plan.json` 추가(+manifest).

## 작업 환경
- 별도 git worktree(지금 디렉터리). `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지). 렌더·테스트는 워크트리 루트에서 하나씩.
- 커밋: `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃 /home/user/AP------ 는 건드리지 않는다.

## 완료 보고 (10줄 이내)
커밋 해시, 새 필드·오류 코드, 테스트 결과(main 대비), 정답지 2개 바이트 동일 여부, q19 상태와 PNG 경로, 워크트리 경로·브랜치.
