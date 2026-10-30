# 엔진 확장 E7 묶음: 평면도형 표기 — 치수선·길이 괄호, 경로 총길이, 각 라벨 지시선 강제, 작도 흔적 라벨 위치

**먼저(필수):** 시작하자마자 `git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`(새로 만든 너의 워크트리이므로 안전; E12 각 라벨 지시선 등이 이미 들어 있다). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지).

관련 코드: `production/plane-marks.mjs`, `production/phase2.mjs`, `visual_engine/*`(engine.py, label_layout.py, semantic_model.py), 관측기 `production/plane-marks-observer-worker.py`·`primitive-observer-worker.py`, 테스트 `tests/plane-marks.test.mjs`·`tests/plane-label-emphasis.test.mjs`·`tests/plane-angle-labels.test.mjs`·`tests/test_plane_marks.py`·`tests/test_label_layout.py`, 가이드 3-8·3-10절.

## 기능 (빈도 높은 순; 큰 것은 앞쪽부터 완성)
1. **E7 치수선·길이 괄호** (빈도 가장 높음): 두 점 사이(같은 직선 위 겹치는 구간 여럿 포함)에 도형 바깥쪽으로 평행 이동한 치수선(양 끝 짧은 수직 눈금 또는 화살표) 또는 중괄호 `{`를 그리고 가운데에 길이 라벨. 예 `planeMarks.dimensions:[{from:"B",to:"C",label:"24\\,cm",side:"BELOW",style:"BAR"|"BRACE",offset?:1|2}]`(같은 쪽 여러 개는 offset 단계로 쌓기). 관측기는 치수선 끝이 두 점에서 수선으로 내린 위치와 일치하는지, 라벨 소속을 검사. 실제: `24_향림중-plane1/q7`(AM 18, BC 24, MN 구간), `24_연향중-plane1/q4`, `25_풍덕중-plane1/q4`(경로 총길이 305 m), 24_매산중 q3(MN=½AC 괄호).
2. **경로 총길이 라벨**: 꺾인 경로(점 여러 개) 전체 길이를 하나의 라벨/괄호로(`planeMarks.pathLabels:[{points:[...],label}]`). 실제 `25_풍덕중-plane1/q4`.
3. **E12b 각 라벨 지시선 강제·호 링 지정**: `angles[].labelPlacement:"LEADER"`(자리가 있어도 바깥 지시선), `angles[].ring:1|2|3`(같은 꼭짓점의 호 반지름 순서). 지금은 숨은 점으로 반직선을 줄이는 우회를 쓴다. 실제 `/home/user/AP------/.tmp/svg-m1/runs/e12/26_팔마중-plane3-q20`(x/2x/3x 중첩), `25_신흥중기말-plane1/q3`, `25_왕운중기말-plane1/q4`.
4. **E8b 작도 흔적 라벨 위치**: `traces[].labelAt:"START"|"MID"|"END"` 또는 각도 지정으로 ㉠~㉥ 라벨을 문제 그림 위치에 맞춤, 흔적 호를 긴 연속 호로(`traces[].span`). 실제 `25_왕의중-plane2/q17`, `24_연향중-plane1/q10`.
5. 합성 패널 캡션 높이 초과 `COMPOSITE_CAPTION_TOO_LARGE` 완화(캡션 줄바꿈/글자 줄임) — 실제 `25_연향중-plane2/q19`.

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시. 새 필드를 쓰지 않는 plan의 SVG는 바이트 동일(배치 알고리즘을 바꾸면 기존 성공 배치는 그대로).
- 가이드 3-8·3-10에 짧게, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성, hints.mjs(리눅스 경로 `archive/tools/geometry-equation/ops/tools/hints.mjs`)에 새 코드 안내.
- 테스트(python은 `PYTHONPATH=/home/user/AP------/.tmp/apmath-visual-engine/dependencies/python python3 -m unittest ...`), 시작 시 기준 기록 후 비교. 정답지 회귀(바이트 동일): golden item01, 12, 17, 19, 20, 27, 35, 36, 37, 39, 44, 46, 50, 54 — 하나씩.
- 실제 문항(위 폴더 plan.json·item.json, packet `/home/user/AP------/.tmp/svg-m1/packets/`)을 새 기능으로 다시 그려 ARCHIVE_BOUND, PNG 확인. 최종 정답 값을 그림에 쓰지 않는다. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size}, item.json)는 `/home/user/AP------/.tmp/svg-m1/runs/e7/<폴더>-q<N>/`. 정답지 대표 문항 `ops/golden/item60/plan.json`(+manifest).
- 별도 git worktree. 렌더·테스트는 하나씩(CPU 4개 공유). 커밋은 기능별 `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃은 건드리지 않는다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트, 정답지 바이트 동일, 실제 문항별 상태·PNG 경로, 못 한 부분과 이유, 워크트리·브랜치.
