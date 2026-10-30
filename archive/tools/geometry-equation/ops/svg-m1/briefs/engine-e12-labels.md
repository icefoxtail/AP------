# 엔진 확장 E12 묶음: 평면·좌표 그림의 각·길이·눈금 라벨 배치

**먼저(필수):** 이 워크트리는 main 기준일 수 있다. 최신 엔진(E1~E11 병합본) 위에서 일하도록 시작하자마자
`git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`
를 실행한다(새로 만든 너의 워크트리이므로 안전). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지).

관련 코드: `production/plane-marks.mjs`, `production/phase2.mjs`(평면·좌표 작도 경로), `visual_engine/*`(라벨 배치·layout), 관측기 `production/plane-marks-observer-worker.py`·`primitive-observer-worker.py`, 테스트 `tests/plane-marks.test.mjs`·`tests/plane-label-emphasis.test.mjs`·`tests/plane-unnamed-points.test.mjs`·`tests/coordinate-plane-marks.test.mjs`·`tests/test_plane_marks.py`, 가이드 3-8·3-10절.

실제 문항 plan 위치는 `/home/user/AP------/.tmp/svg-m1/runs/<폴더>/q<N>/plan.json`(item.json 같은 폴더). packet은 `/home/user/AP------/.tmp/svg-m1/packets/`.

## 기능 (빈도 높은 순; 크면 앞쪽부터 완성하고 나머지는 설계·막힌 이유를 보고)
1. **E12 좁은 각·몰린 꼭짓점·큰 호 라벨**: 각 라벨이 각 안에 들어갈 자리가 없으면 각 바깥(호의 이등분선 연장) 지시선 배치로 자동 전환하고, 지시선 끝은 반드시 **그 각의 호**에 닿는다. 한 꼭짓점에 각 3~4개가 몰린 경우, 큰(반사각에 가까운) 호의 라벨도 처리. 관측기는 라벨이 자기 호와 1:1로 연결되는지(지시선 끝이 호 위인지, 다른 각 영역에 놓이지 않는지) 검사.
   실제: `26_팔마중-plane2/q12`(20°), `26_팔마중-plane3/q19`(꼭짓점 e 외각 라벨), `26_팔마중-plane3/q20`(a3Y), `25_풍덕중-plane2/q11`(18°), `26_신흥중-plane3/q19`(20° 지시선이 EF 위에 끝남), `25_왕운중-plane1/q1`(한 꼭짓점 각 4개), `25_왕운중-plane1/q7`(30° 안팎).
2. **E16 한 글자 각 이름 라벨** ∠A(지금은 두 글자 이상만): `25` 아님, 실제 `26_왕운중-plane1/q1`.
3. **E18 각 강조 색 그룹**: `planeMarks.angles[].emphasisGroup`(같은 그룹은 같은 색 호) — 한 각이 두 관계(동위각 쌍, 맞꼭지각 쌍)에 속하는 경우를 색으로 구분. 실제 `25_왕운중-plane1/q3`, `25_왕의중-plane2/q15`.
4. **E17 빗변 길이 라벨**: 비정수·닫힌 꼴 아닌 교점 사이 `SEGMENT_LENGTH`도 `scalarLabels`에 정확한 값(작성자가 준 값과 엔진 계산값 일치 검사)으로 표시(`UNSUPPORTED_SCALAR_NOTATION` 해소). 실제 `25_풍덕중-plane2/q13`.
5. **E19 좌표 그림 이름 숨김**: `SOURCE_COORDINATE_AXES` 그림에서도 hiddenPointNames(SOURCE_POINT 포함)·`hiddenPointStyle:"NONE"` 허용(수선의 발 점 표식 제거). 실제 `25_왕의중-plane1/q4`.
6. **E20 좌표 눈금 라벨 충돌 회피**: x=-1과 y=1 눈금 라벨이 원점 근처에서 겹치면 자동으로 비켜 놓기. 실제 `25_왕의중-plane1/q1`(FAILED, LAYOUT_INVENTORY_INCOMPLETE tick-y-1-label).

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시. **새 필드를 쓰지 않는 plan의 SVG는 바이트 동일**이어야 한다(라벨 배치 알고리즘을 바꾸면 기존 그림이 바뀔 수 있으니, 기존에 성공하던 배치는 그대로 두고 실패하던 경우에만 새 배치로 넘어가게 한다).
- 가이드 3-8·3-10절에 짧게, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. 다른 절은 건드리지 않는다.
- 테스트: 위 테스트들(python은 `python3 -m unittest`), 시작 시 기준 결과 기록 후 비교. 정답지 회귀(바이트 동일): golden item01, 12, 17, 19, 20, 27, 35, 36, 37, 39, 44, 46, 50 — 하나씩 렌더, 기준 SVG는 시작 시 네 워크트리에서 먼저 한 번 렌더해 저장해 두고 비교(파일 `/home/user/AP------/.tmp/svg-m1/golden-out/itemNN-solution.svg`도 참고 가능하나 item50 등 신규는 없음).
- 실제 문항은 위 폴더의 plan을 복사해 새 기능으로 다시 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인. 결과(plan.json, figure-solution.svg, figure.png)는 `/home/user/AP------/.tmp/svg-m1/runs/e12/<폴더>-q<N>/`. 원래 폴더는 건드리지 않는다. 정답지에 E12 대표 문항 하나를 `ops/golden/item54/plan.json`으로(+manifest).
- 커밋은 기능별: `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃 /home/user/AP------ 는 건드리지 않는다. 렌더는 하나씩.

## 완료 보고 (12줄 이내)
커밋 해시들(기능별), 새 필드·오류 코드, 테스트 결과, 정답지 바이트 동일, 실제 문항별 상태와 PNG 경로, 못 한 기능과 이유, 워크트리 경로·브랜치.
