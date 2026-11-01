# C1: 평면·좌표 그림의 색 구분(같은 것끼리 같은 색) (엔진 확장)

먼저 `/home/user/AP------/archive/tools/geometry-equation/ops/svg-m1/BRIEF_RULES.md`를 읽는다(규칙 8·9·10·11). 큰 파일은 grep으로, 출력은 tail로 짧게.

## 왜 (학생에게 좋은 점)
해설 그림의 핵심은 "어느 것과 어느 것이 같은가"다(넓이가 같은 두 조각, 대응하는 변, 합동인 두 삼각형, 크기가 같은 각). 지금 평면도형·좌표 그림의 영역 칠은 회색 두 단계(LIGHT·MEDIUM)뿐이고 선 강조는 빨강 하나라 묶음을 색으로 보여 줄 수 없다. 입체 그림에는 이미 5색(`solid-figure-v1.mjs` L1183 `HIGHLIGHT_FILLS`: LIGHT/MEDIUM 파랑, WARM 주황, GREEN, ROSE, VIOLET)이 있다. 같은 팔레트를 평면·좌표 그림에도 쓰게 해, **같은 묶음은 같은 색, 다른 묶음은 다른 색**으로 그린다.

## 환경 (Linux 클라우드)
- 너는 `isolation: worktree`로 떴다. 첫 동작: `git fetch origin main && git reset --hard origin/main`, `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(커밋 금지).
- python: `PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python python3`. 렌더는 하나씩: `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`(재렌더 전 `out/` 삭제). PNG: `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`.
- 산출물 폴더: `/home/user/AP------/.tmp/svg-m1/runs/c1/<문항>/`. 그 밖 수정 금지(워크트리 제외). 시험지 JS 수정 금지. push·PR·병합 금지.

## 기존 규칙과 충돌하는 곳
- 영역 칠: `production/plane-regions.mjs`·`plane-marks.mjs`의 `fill`(LIGHT/MEDIUM 회색)과 그 관측기(grep `REGION_` in `*observer*.py`). 그래프 영역(`graphPlan.regions` fill LIGHT/MEDIUM, `graph_framing.py`)도 같은 이름을 쓴다. **기존 값 LIGHT·MEDIUM의 색은 바꾸지 않는다**(기존 정답지 바이트 동일). 새 색 이름만 더한다.
- 각 표시: E12에 "각 색"이 들어갔다(가이드 grep `각 색`, plane-marks.mjs의 angle fill/emphasis). 있으면 그 필드를 새 팔레트 이름과 통일하고, 없으면 기능 2로 넣는다.
- 선 강조: `emphasis:"ACCENT"`(빨강) 등. 새 색은 옵트인 필드로.
- 팔레트는 한 곳(새 작은 모듈, 예: `production/palette.mjs`와 Python 쪽 같은 표)에 두고 solid의 `HIGHLIGHT_FILLS` 값과 같게(solid 쪽 코드는 바꾸지 않아도 되지만 값이 같은지 테스트로 묶는다).
- 라벨 글자는 검정 그대로. 색은 칠·선·호에만.

## 기능별 설계
### 기능 1: 영역 색 이름과 "같은 넓이" 묶음
- 필드: `planeMarks.regions[].fill`에 `"BLUE"|"WARM"|"GREEN"|"ROSE"|"VIOLET"` 추가(값은 solid 팔레트와 같은 색·투명도; BLUE=solid LIGHT 파랑). 그래프 `regions[].fill`도 같은 이름을 받는다. 묶음 선언: `"equalArea":["w1","w2"]`(planeMarks 최상위 배열, 묶음 여러 개 가능: `"equalAreas":[["w1","w2"]]`) — 같은 묶음 영역은 **같은 색이어야 하고 넓이가 실제로 같아야** 한다.
- 계산: 영역 다각형 넓이는 이미 영역 모듈이 계산하는 점·호 경계로(신발끈·부채꼴 공식, 정확값 가능하면 SymPy `nsimplify`), 상대 오차 1e-6.
- 관측기: SVG의 칠 색이 plan 색 이름과 맞는지, equalAreas 묶음 영역의 넓이를 plan 기하에서 **독립 계산**해 같은지, 같은 묶음은 같은 색, 다른 묶음·다른 영역과 색이 겹치지 않는지(같은 색을 서로 다른 묶음에 쓰면 거절).
- 거절: `REGION_FILL_INVALID`(모르는 색), `REGION_EQUAL_AREA_MISMATCH`(넓이가 다름), `REGION_EQUAL_AREA_COLOR_MISMATCH`, `REGION_COLOR_GROUP_AMBIGUOUS`.

### 기능 2: 각 표시 색 묶음
- 필드: `planeMarks.angles[].color`(위 5색, 호 안쪽 부채꼴 칠과 호 선 색) + 크기가 같은 각 묶음 `equalAngles` 기존 표식(호 겹수)과 함께 쓸 수 있게. 같은 크기 각은 같은 색.
- 계산: 각 크기는 점 좌표에서(기존 각 검증 경로). 관측기: 색이 같은 각끼리 실제 크기가 같은지(0.5° 허용), 색 이름 대조.
- 거절: `ANGLE_COLOR_INVALID`, `ANGLE_COLOR_GROUP_MISMATCH`.

### 기능 3: 대응하는 변(선분) 색
- 필드: `planeMarks.segmentColors:[{"segments":["AB","EF"],"color":"BLUE"},{"segments":["BC","FG"],"color":"WARM"}]` — 그려진 선분을 그 색(팔레트의 진한 선색: 칠 색보다 어두운 같은 색상, 대비 4.5:1 이상)과 조금 굵게. 닮음·합동의 대응변, 같은 길이 묶음에 쓴다. 같은 선분이 두 묶음에 들어가면 거절.
- 관측기: 선분 끝점·색·굵기 대조, 선언 안 한 선분이 색으로 그려지지 않았는지.
- 거절: `SEGMENT_COLOR_INVALID`, `SEGMENT_COLOR_UNKNOWN_SEGMENT`, `SEGMENT_COLOR_DUPLICATE`.

### 공통: 읽기 쉬움
- 5색은 흑백 인쇄에서도 서로 밝기가 달라야 한다(팔레트의 회색 변환 명도 차를 테스트로 확인, 너무 비슷하면 투명도 조정). 색각 이상 학생을 위해 주로 쓰는 두 색은 BLUE와 WARM(파랑·주황).
- 가이드에 "같은 것은 같은 색, 묶음은 2~3개까지, 색 묶음 하나에는 관계 표식(눈금·호 겹수)도 함께" 권장을 적는다.

## 실제 문항 (`archive/exams/original/middle/m2/2mid/26_신흥중_2학기_중간_중2_기출.js`, 지금 회색으로 그린 plan을 색으로)
기존 plan은 `/home/user/AP------/.tmp/svg-m1/runs/26_신흥중2c-plane1/q8/plan.json`, `.../plane1/q2/plan.json`, `.../plane3/q20/plan.json`, `.../plane3/q22/plan.json`(복사해서 `runs/c1/q<N>/`에서 고친다; item.json도 복사).
1. q8(나비 날개): 두 날개 △APE·△DPC를 WARM, `equalAreas` 묶음; 공통 부분 ABDP는 BLUE. "넓이 같음" 글자는 색이 같으면 빼도 된다(남겨도 됨).
2. q2(닮은 사각형): AB↔EF를 BLUE, BC↔FG를 WARM으로 `segmentColors`.
3. q20(합동 삼각형): 합동인 두 삼각형을 같은 색(BLUE), 구하는 △AFG 쪽은 WARM, 같은 크기 각은 같은 색.
4. q22: 해설을 읽고 같은 넓이·합동 관계가 있으면 그 묶음을 색으로(없으면 생략하고 보고).
- 각각 plan.json, out/figure-solution.svg, figure.png, publish.json(기존 것 복사·필요하면 alt에 색 설명 한 마디), item.json.

## 완료 기준
- 관련 단위 테스트 추가·통과(plane-marks·plane-regions·graph 영역 테스트 파일을 grep으로 찾아서), 관측기 변조 테스트(색 바꿈·넓이 다른 영역을 같은 묶음으로·각 크기 다른데 같은 색). 전체 스위트 금지. 기존 테스트를 바꿨으면 이유를 커밋 본문에.
- 정답지 회귀(표본, 규칙 10): 영역·각·선 강조를 쓰는 평면·좌표·그래프 정답지 10개 안팎(저장 SVG 있는 것)을 시작 전·후 렌더해 바이트 동일. 새 항목 `item101c1`(q8 나비 날개), `item102c1`(q2 대응변) + manifest. golden-out 폴더에는 쓰지 않는다.
- 가이드 `production/author-guide-body.md` 평면 표식·영역 절에 새 필드·오류 코드·예시, `node archive/tools/geometry-equation/production/build-author-guide.mjs`, `ops/tools/hints.mjs`(작은따옴표 `\'`, 수정 후 import 확인).
- 모든 파일 LF. 커밋은 기능마다 `feat(svg-engine): ... (C1-1)` 식, 한국어 본문, 끝에 빈 줄 후
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01F4RMLKQwWq73G4ju4Quc1a`
- 백그라운드 작업을 남기지 않는다.

## 보고 (8줄 이내)
커밋 해시, 새 필드·오류 코드, 테스트 수, 정답지 바이트 동일 수, 문항별 상태·PNG 경로, 못 한 것과 이유(후속 묶음 제안).
