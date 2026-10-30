# 엔진 확장 E30 묶음: 평면·좌표·수직선·통계 — 버그 1건과 자주 막힌 표기

**먼저(필수):** 시작하자마자 `git fetch origin claude/fervent-knuth-s3xr1a && git reset --hard origin/claude/fervent-knuth-s3xr1a`(새로 만든 너의 워크트리이므로 안전; E7 치수선·E13 그래프·E26 통계 확장이 이미 들어 있다). 그 뒤 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지). 입체(solid-figure-v1·sphere-parts)는 다른 작업자가 고치는 중이니 건드리지 않는다.

실제 막힌 문항 plan·그림: `/home/user/AP------/.tmp/svg-m1/runs/<폴더>/q<N>/`, packet `/home/user/AP------/.tmp/svg-m1/packets/`.

## 기능 (위에서부터; 하나 끝내고 커밋한 뒤 다음)
1. **BUG 0 좌표 문자열**: 꼭짓점을 사슬로 작도하면 정확히 0인 좌표가 `0.e-149`처럼 출력돼 관측기가 `UNSUPPORTED_CINDY_SCALAR`로 거절한다(`23_신흥중-mix/q26`의 사슬 작도 시도). 소수 문자열 정규화(아주 작은 값은 0으로)·지수 표기 제거. 기존 SVG 바이트 동일 유지.
2. **좌표 그림 자유 TEXT 라벨**: `SOURCE_COORDINATE_AXES_v1`·그래프 그림에 한글/식 TEXT 라벨(`planeMarks.textLabels:[{at:[x,y]|point, text:"P(a,b)"|"a>0, b<0"|"제4사분면", anchor?}]`), 이름 숨긴 점(수선의 발)에 좌표 라벨 `(-1,0)` 허용. 실제: `23_왕운중-plane2/q15`(사분면 부호·P(a,b)), `23_금당중기말-plane1/q1`(사분면 이름), `23_금당중-mix/q21`(수선의 발 (-1,0)).
3. **수직선 행 라벨·점 모양**: `number-line-figure-v1`에서 줄마다 왼쪽 라벨(`rows[].label:"가능"|"불가능"`), 점 모양 `point.style:"FILLED"|"HOLLOW"|"CROSS"`(열린 끝 ○, 제외 ×), 구간 안 점 강조. 실제: `23_금당중-plane1/q11`(3·5·9·11·15 중 3<x<13 안/밖).
4. **통계 미상 계급 기호·섞인 합**: `unknownLabels:[{class:i,label:"2x"}]`(null 계급 자리 점선 윤곽+기호), `classSums`가 아는 계급과 null 계급을 섞어도 허용(라벨은 자유 텍스트 "6명"), 도수 0 끝점 값 라벨 켜기. 실제: `23_연향중기말-stat1/q15`(찢어진 두 계급 x·2x, 합 50), `24_연향중-mix/q18`(160~170 미상 + 묶음 6명).
5. **평각·각 합 표식**: 직선 위 평각 반원 호 `angles` 180°(`straight:true`) 라벨 "180°", 두 각 표식을 묶는 합 괄호/라벨(`angleSums:[{angles:[id,id],label:"90°"}]`), 직각 표시에 식 라벨(`rightAngles[].label:"3x"`). 실제: `23_연향중-mix/q21`, `24_향림중기말-plane1/q8`(15°+75°), `23_향림중-plane1/q8`(3x=90°).
6. **그래프 축별 배율·overlay 한글 라벨**: `graphPlan.axisScale:{x,y}`(단위 다른 축: 분–km), overlay 직선·곡선 이름 라벨 한글(토끼/거북이). 실제: `23_금당중-plane1/q6`(FAILED 기록, plan 참고).
7. 작은 것: 각 라벨 그리스 문자 γ·δ, 라벨 단위 kg, 공통 변 표식(`marks.commonSide`).

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시, 관측기는 새 표식을 plan에서 독립 계산해 대조. 새 필드가 없으면 기존 SVG 바이트 동일.
- 가이드 해당 절에 짧게, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. hints.mjs(`archive/tools/geometry-equation/ops/tools/hints.mjs`, 리눅스 경로)에 새 코드 안내.
- 테스트(python은 `PYTHONPATH=/home/user/AP------/.tmp/apmath-visual-engine/dependencies/python python3 -m unittest ...`), 시작 시 기준 기록 후 비교. 정답지 회귀(바이트 동일): golden item01, 12, 15, 21, 27, 35, 41, 44, 51, 57, 58, 60 — 하나씩, 기준 SVG는 시작 시 네 워크트리에서 먼저 렌더해 저장.
- 실제 문항을 새 기능으로 다시 그려 ARCHIVE_BOUND, PNG(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 확인; 정답 값·정답 번호를 그림에 쓰지 않는다; 원문에 없는 이름·값을 쓰지 않는다. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size}, item.json)는 `/home/user/AP------/.tmp/svg-m1/runs/e30/<폴더>-q<N>/`. 정답지에 대표 문항 `ops/golden/item62/plan.json`(+manifest).
- 별도 git worktree. 렌더·테스트는 하나씩(CPU 4개 공유). 커밋은 기능별 `feat(svg-engine): ...`(버그는 `fix(svg-engine): ...`) + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃은 건드리지 않는다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트, 정답지 바이트 동일, 실제 문항별 상태·PNG 경로, 못 한 부분과 이유, 워크트리·브랜치.
