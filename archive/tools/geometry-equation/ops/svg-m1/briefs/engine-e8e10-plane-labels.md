# 엔진 확장 E8·E10·E11: 평면도형 라벨·강조 (PLANE_FIGURE_v1 / planeMarks)

중1 평면도형 해설 그림에서 실제로 막힌 것들이다. 관련 코드: `production/plane-marks.mjs`, `production/phase2.mjs`(평면 경로), `visual_engine/*`(라벨 배치), 관측기 `production/plane-marks-observer-worker.py`·`plane_regions_observer.py`·`primitive-observer-worker.py`, 테스트 `tests/plane-marks.test.mjs`·`tests/test_plane_marks.py`·`tests/construction-traces.test.mjs`·`tests/plane-unnamed-points.test.mjs`, 가이드 `production/author-guide-body.md` 3-8절.

## E8. 한글 평문 라벨과 단위
- `planeMarks.expressionLabels`, `planeMarks.arcs[].label`, `planeMarks.traces[].label`에 선택 `labelKind:"TEXT"`(기본 "MATH")를 추가한다: 라벨을 한글 본문 글꼴 평문으로 그린다(3-46절 영역 라벨 `labelKind`와 같은 방식을 재사용). 예: 작도 순서 ㉠~㉥(26_신흥중 q4), "반직선 AB"(26_팔마중 q2). 40자 이하.
- 같은 세 곳(그리고 각 라벨 `planeMarks.angles[].label`이 수가 아닌 경우는 제외)에 선택 `unit:"cm"|"m"|"mm"`를 추가해 수식 라벨 뒤에 단위를 붙인다(`3cm`, `x cm`; 26_신흥중 q6·q7, 26_왕운중 q3). 단위는 단위 표기 관례대로(숫자 뒤 붙임, 문자 뒤 한 칸).
- 관측기: TEXT 라벨이 자기 대상(선분·호·흔적) 곁 규칙 위치에 있는지 기존 라벨 검사와 같은 기준으로 확인. 글자 내용은 조판 단계 data-tex/텍스트로 남겨 관측기가 plan의 문자열과 대조한다(가능한 범위에서; 불가능하면 그 사실을 가이드에 적는다).

## E10. 특정 변 강조
- `displaySegments[]`에 선택 `emphasis:"BOLD"|"ACCENT"`(굵게 / 빨강 굵게)를 추가한다(26_왕운중 q5: 6cm 변과 양 끝각, 26_신흥중 q3: 수선 AB). 관측기는 plan에서 강조할 선분을 읽어 최종 SVG에서 그 선분만 강조 스타일이고 나머지는 기본 스타일인지 검사한다.

## E11. 원 밖 호 라벨 여백
- 원(또는 호)의 바깥에 놓이는 `planeMarks.arcs[].label`이 캔버스 여백이 없어 `LAYOUT_INVENTORY_INCOMPLETE`로 실패한다(26_신흥중 q15: 호 AC·BD에 10cm·16cm). 평면도형 프레이밍이 호 라벨 자리를 포함하도록 여백을 확보한다(다른 그림의 기존 배치는 바이트 동일 유지 — 호 라벨이 없는 plan은 프레이밍이 바뀌면 안 된다).

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 "Engineering rules (hard)", "Other workers share this machine"(Windows·D: 경로는 무시; Linux). 관측기·테스트·허용오차를 약하게 만들지 않는다. 새 거절 코드는 명시적으로. 새 필드가 없는 plan의 SVG는 바이트 동일.
- 가이드 3-8절에 짧게 추가하고 `node archive/tools/geometry-equation/production/build-author-guide.mjs`로 재생성. 다른 절은 건드리지 않는다(다른 작업자가 3-입체·3-2·3-14절을 고치고 있다).
- 테스트: 위 테스트 파일들 + 추가 테스트(python은 pytest가 없으면 `python3 -m unittest`). main 기준 결과를 먼저 기록해 두고 비교한다.
- 평면 정답지 회귀(바이트 동일): golden item19, 20, 27, 35, 36, 37, 39, 44, 46 — 하나씩 렌더해 기존 SVG `/home/user/AP------/.tmp/svg-m1/golden-out/itemNN-solution.svg`와 sha256 비교(item.json은 `ops/golden.manifest.json`의 sourcePath·ordinal).
- 실제 문항 재렌더: `/home/user/AP------/.tmp/svg-m1/runs/26_신흥중-plane1/q4/plan.json`(㉠~㉥), `.../26_신흥중-plane1/q6/plan.json`(cm), `.../26_신흥중-plane2/q15/plan.json`(호 라벨), `.../26_왕운중-plane1/q5/plan.json`(변 강조) 를 복사·수정해 새 기능으로 다시 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인. item은 각 폴더의 item.json. 결과는 `/home/user/AP------/.tmp/svg-m1/runs/e8/<exam>-q<N>/`(plan.json, figure-solution.svg, figure.png). 정답지에 하나 추가: `ops/golden/item50/plan.json`(+ manifest).

## 작업 환경
- 별도 git worktree(지금 디렉터리, 엔진 E1 포함). 먼저 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine` (`.tmp/archive`는 링크 금지). 렌더·테스트는 워크트리 루트에서 하나씩.
- 커밋은 기능별(E8, E10, E11): `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. /home/user/AP------ 본 체크아웃은 건드리지 않는다.

## 완료 보고 (10줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트 결과(main 대비), 정답지 9개 바이트 동일 여부, 실제 문항 4개 상태와 PNG 경로, 워크트리 경로·브랜치.
