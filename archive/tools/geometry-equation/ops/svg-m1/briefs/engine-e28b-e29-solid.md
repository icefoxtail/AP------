# 엔진 확장 E28b·E29: 입체 — 이름 없는 꼭짓점 참조, 전개도 라벨, 정다면체·쌍뿔·안의 입체

**먼저(필수):** 시작하자마자 `git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`(새로 만든 너의 워크트리이므로 안전; E27·E28 구 자르기·면 칠이 이미 들어 있다). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지).

코드: `production/solid-figure-v1.mjs`, `production/sphere-parts.mjs`, 관측기 `production/solid_figure_observer.py`(+worker), 테스트 `tests/solid-figure.test.mjs`·`tests/test_solid_figure_observer.py`, 가이드 3-입체 절.

## 우선순위 1 — E28b (빈도 가장 높음: 원문 그림에 꼭짓점 이름이 없는 입체)
지금 `segments`·`dims`(edge)·각기둥 높이 치수·직각 표시는 꼭짓점 **이름**이 있어야 해서, 작업자들이 원문에 없는 A~H를 지어 붙인다(학생 혼동). 이름 없이 쓰는 참조를 만든다:
- 꼭짓점 참조 `{"base":i}`, `{"top":i}`, `{"apex":true}`(이름 문자열 대신 어디서나), 또는 `"#b0"`, `"#t2"`, `"#apex"` 같은 짧은 문자열 형식 중 하나로 통일. 이름이 숨겨져 있어도(names ".") 동작.
- 실제 문항(plan·그림: `/home/user/AP------/.tmp/svg-m1/runs/<폴더>/q<N>/`): `25_신흥중기말-solid1/q6`(칠각뿔 모서리 색 구분, 지금 A~G·O 임시 이름), `q7`(정육면체 위·아래·세로 모서리), `q11`(사각기둥 높이 3·사각뿔 높이 4), `25_왕의중기말-rest/q14`(정육면체 안 삼각뿔 꼭짓점·높이 a·직각), `25_연향중기말-mix/q15`(이름 없는 삼각뿔·삼각기둥 변 치수).
- 전개도: 면 넓이 라벨 `net.faceLabels:[{face,text}]`(지금 hints에만 있고 미구현), 전개도 직각 표시, 원기둥 전개도에서 "제외" 표시(밑면 원 점선/회색)(`25_신흥중기말-solid1/q9`·`q10`).

## 우선순위 2 — E29 새 입체 (나머지는 설계·거절 코드로 보고 가능)
- 정다면체: 정사면체·정팔면체·정십이면체·정이십면체(`kind:"REGULAR_POLYHEDRON","faces":4|8|12|20`), 숨은선 점선, 꼭짓점·모서리·면 세기 번호(E3 count와 같은 방식) — 실제: 25_신흥중 기말 q7 정이십면체(packet `/home/user/AP------/.tmp/svg-m1/packets/25_신흥중_2학기_기말_중1_기출.json`, 문제 그림은 `ns0:` 접두 SVG라 `runs/existing-25_신흥중_2학기_기말_중1_기출/`의 PNG로 확인).
- 쌍뿔(각뿔 두 개를 밑면끼리 붙임): `kind:"BIPYRAMID"` — 실제: 25_신흥중 기말 q20(오각쌍뿔, 지금 기존 그림 유지 중).
- 안의 입체(원기둥 안 구 2개 등, 윤곽만): 설계 메모만이라도.
- 관측기는 각 새 형태의 꼭짓점·모서리·숨은선을 plan에서 독립 계산해 대조.

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시. 새 필드가 없으면 기존 SVG 바이트 동일.
- 가이드 3-입체 절에 짧게, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. hints.mjs에 새 오류 코드 안내 한 줄씩(`archive/tools/geometry-equation/ops/tools/hints.mjs`, 리눅스 경로).
- 테스트(python은 `PYTHONPATH=/home/user/AP------/.tmp/apmath-visual-engine/dependencies/python python3 -m unittest ...`), 시작 시 기준 기록 후 비교. 정답지 회귀(바이트 동일): golden item22, 26, 42, 47, 48, 52, 56 — 하나씩.
- 실제 문항을 새 기능으로 다시 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인; 원문에 없는 이름을 쓰지 않는다; 정답 값을 그림에 쓰지 않는다. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size}, item.json)는 `/home/user/AP------/.tmp/svg-m1/runs/e28b/<폴더>-q<N>/`. 정답지에 대표 문항 `ops/golden/item59/plan.json`(+manifest).
- 별도 git worktree. 렌더·테스트는 하나씩(CPU 4개 공유). 커밋은 기능별 `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃은 건드리지 않는다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트, 정답지 바이트 동일, 실제 문항별 상태·PNG 경로, 못 한 부분과 이유, 워크트리·브랜치.
