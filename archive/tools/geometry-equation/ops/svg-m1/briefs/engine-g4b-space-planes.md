# G4b: 공간 평면 α·β, 자유 3D 점, 교선·수선 (엔진 확장)

먼저 `/home/user/AP------/archive/tools/geometry-equation/ops/svg-m1/BRIEF_RULES.md`를 읽는다(규칙 8·9·10·11). 토큰을 아낀다: 큰 파일은 grep으로 필요한 부분만, 출력은 tail로 짧게. 그림 PNG는 마지막 확인 때만 본다.

## 환경 (Linux 클라우드)
- 너는 `isolation: worktree`로 떴다. 첫 동작: `git fetch origin main && git reset --hard origin/main`. 그다음 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(커밋하지 않는다).
- python: `PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python python3`. 렌더는 하나씩: `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`(재렌더 전 `out/` 삭제). item.json = `{"sourcePath":"archive/exams/original/...js","ordinal":N}`. PNG: `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`.
- 산출물 폴더: `/home/user/AP------/.tmp/svg-m1/runs/g4b/<시험>-q<N>/`.
- 이 워크트리와 산출물 폴더 밖 수정 금지. 남의 프로세스 종료 금지. 시험지 JS 수정 금지. push·PR·병합 금지.

## 문제
solid-figure-v1(`archive/tools/geometry-equation/production/solid-figure-v1.mjs`, 관측기 `production/solid_figure_observer.py`)은 입체가 반드시 있어야 하고(`solveSolidFigure` L892 `solids`/`net` 필수, `solveSolids` L1045 입체 1~3), 점은 입체 소유(`resolveAuxPoints` L777)이며, 평면·교선·자유 3D 점이 없다. 그래서 고2 기하의 "평면 α 위의 점, 평면 밖의 점 P, 두 평면의 교선 l, 삼수선" 그림을 못 그린다. 가림 판정(`occluded` L580, `edgeRuns` L593)도 입체 면만 본다.

## 기존 규칙과 충돌하는 곳
- 입체 필수(L892, L1045): `space` 블록이 있으면 입체 0개를 허용한다. `solids`와 `space`를 함께 쓰는 것도 허용(입체 + 평면).
- 점 소유(L777)·`pointTable`/`vertexResolver`: 자유 점은 소유 입체 없이 이름표에 들어가야 한다. 이름 규칙 `[A-Z]′?`(L52)은 그대로(대문자 점 이름), 평면 이름은 점 이름이 아니라 아래 `name` 필드(TeX 그리스 `\\alpha`).
- `marks.rightAngles`(L1183)·`marks.angles`(L1239)·`segments`(L1128)가 자유 점도 받게 한다(G4a 보조점이 각 표시에 들어간 방식과 같게).
- 틀 `figureExtent` L1844/`figureFrame` L1858: 평면 꼭짓점·자유 점을 포함.
- 라벨 배치 `placeLabels` L2651, 장애물 `obstacleSegments` L2595: 평면 테두리·교선을 장애물로 넣는다. 라벨 자리가 없으면 지시선으로 끌어낸다(규칙 9). 필수 라벨을 지워 통과시키지 않는다(규칙 8).
- 기본 패널 제목 "입체도형"(`expandSolidFigure` L2853): space만 있는 그림은 기본 제목 없음(또는 plan `title`).
- 기존 정답지 SVG는 바이트 동일(새 필드 옵트인).

## 기능별 설계
### 기능 1: 자유 3D 점·선분, 입체 0개 허용
- 필드: `"space":{"points":[{"id":"P","at":[0,0,3]},{"id":"O","at":[0,0,0]},{"id":"H","at":[2,0,0]}],"segments":[{"from":"P","to":"O","style":"DASHED"},{"from":"P","to":"H"}]}`. `at`은 정확한 정수·분수·`sqrt` 문자열 또는 수. 점 표시·이름 숨김은 기존 점 규칙(`hideName` 등)과 같은 키를 쓴다. G4a 형식(`midpoint`·`divide`·`footOnLine`·`projection`)도 자유 점끼리 받게 한다(`at` 대신 `{"projection":{"point":"A","plane":"beta"}}`처럼 평면 id로 정사영 — 기능 2와 연결).
- 계산: 3D 좌표 → 기존 `project`(L34, YAW 28°·PITCH 20°). segments `style`: SOLID/DASHED/AUTO(AUTO는 기능 2의 평면 가림으로 판정).
- 관측기: 점마다 plan 좌표를 독립 투영해 SVG 점 위치와 대조, 이름 라벨 소속, 선분 끝점 일치, 선분 스타일(실선/점선 조각) 대조.
- 거절: `SPACE_POINT_INVALID`, `SPACE_POINT_DUPLICATE`, `SPACE_SEGMENT_INVALID`, `SPACE_POINT_LIMIT`(점 16개 초과), 입체도 space도 없으면 기존 코드 유지.

### 기능 2: 평면(반투명 평행사변형)과 가림
- 필드: `"planes":[{"id":"alpha","name":"\\alpha","through":["O","H","Q"],"extent":{"center":"O","u":[4,0,0],"v":[0,3,0]},"fill":"LIGHT","nameAt":"CORNER"}]` — `through` 세 점(또는 `"normal":[0,0,1],"point":"O"`)이 평면을 정하고, `extent`(중심 점 + 평면 위 두 방향 벡터 절반 길이)가 그릴 평행사변형을 정한다. `extent` 생략 시 평면 위 점들을 덮는 평행사변형을 엔진이 잡는다(여백 25%). 평면 최대 3개.
- 계산: 법선 `cross`(solid의 vec 유틸을 export하거나 같은 파일 안에서 재사용). 평행사변형 네 꼭짓점을 투영해 반투명 다각형(`HIGHLIGHT_FILLS` LIGHT 투명도와 같은 계열). 평면 이름 `name`은 각 라벨과 같은 SYMBOLIC 검사(L643, `\\alpha`·`\\beta`·`\\pi` 등 TeX)로 평행사변형 안쪽 한 모서리 근처에 둔다. **가림:** 선분 AUTO는 시선 방향으로 평면 뒤(평행사변형 안을 지나며 평면보다 멀리)인 부분을 점선으로 — 선분을 표본 분할해 각 표본점에서 시선 광선과 평행사변형의 교차를 검사(기존 `edgeRuns`의 이진 탐색 방식 재사용). 평면을 관통하는 선분은 관통점에서 실선/점선이 바뀐다. 평면 위의 선분은 가리지 않는다.
- 관측기: 평행사변형 네 꼭짓점을 plan에서 다시 계산·투영해 SVG 다각형과 대조, 법선이 through 세 점과 일치, 이름 라벨 위치가 평행사변형 안, AUTO 선분의 실선/점선 경계가 독립 계산한 관통점과 일치.
- 거절: `SPACE_PLANE_INVALID`, `SPACE_PLANE_DEGENERATE`(세 점이 한 직선), `SPACE_PLANE_LIMIT`, `SPACE_PLANE_NAME_INVALID`, `SPACE_PLANE_EXTENT_INVALID`, `SPACE_POINT_NOT_ON_PLANE`(점에 `"on":"alpha"`를 쓰면 검사).

### 기능 3: 교선·직선과 수선의 직각
- 필드: `"lines":[{"id":"l","name":"l","through":["P","Q"]},{"id":"m","intersection":["alpha","beta"],"name":"l"}]` — 두 점을 지나는 직선, 또는 두 평면의 교선(엔진이 계산). 직선은 그림 틀 안에서 양쪽으로 연장(평면이 있으면 평면 평행사변형 범위 + 여백). 이름 `name`은 소문자 한 글자(이탤릭 수식), 직선 끝 근처. 수선·직각은 기존 `marks.rightAngles`를 자유 점·직선 위 점으로 받게 한다(`{"at":"O","rays":["P","H"]}` 형식 그대로). 점에서 평면/직선에 내린 수선의 발은 기능 1의 `projection`/`footOnLine` 자유 점으로.
- 계산: 교선 방향 = 두 법선의 외적, 교선 위 한 점은 두 평면 식 연립(정확한 유리수·근호면 SymPy, 아니면 부동소수). 평행 평면이면 거절.
- 관측기: 교선 방향·위치를 독립 계산해 SVG 선과 대조, 직선 이름 소속, 직각 표시가 두 방향에 맞게 놓였는지(기존 audit_marks 확장).
- 거절: `SPACE_LINE_INVALID`, `SPACE_PLANES_PARALLEL`, `SPACE_LINE_NAME_INVALID`.

## 실제 문항 (해설의 핵심 중간값은 그림 안에, 정답은 caption에 — 규칙 11)
1. `archive/exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js` #19 (삼수선 정리 1)~3) 중 잘못된 것, 문제 그림 `archive/assets/images/26_매산고_1학기_중간_고2_기하/q19.png` 또는 `assets/images/...`). 기존 해설 그림 `q19-solution.svg` 있음(legacy). 그림: 평행사변형 α, α 밖의 점 P, α 위의 점 O·H, α 위의 직선 l(H는 l 위), PO⊥α(직각), OH⊥l(직각), PH⊥l(직각), PO·OH·PH. 중간값: 세 직각 표시(삼수선 관계). caption: 3)이 틀렸고 PO⊥OH(PO⊥α) 조건이 필요, 정답 3번. 기존 그림과 나란히 보고 더 나은지 한 줄.
2. `archive/exams/original/high/h2/1final/22_매산고_1학기_기말_고2_기하_기출.js` #14 (문제 그림 `.../22_매산고_1학기_기말_고2_기하_기출/q14.png`, 해설 그림 없음). 그림: 서로 수직인 평면 α(세로)·β(가로), 교선 l(=교선 기능), l 위 P, α 위 A, β 위 B, PA·PB, l과 PA가 이루는 60°, l과 PB가 이루는 45°(marks.angles), A에서 β에 내린 정사영 A′(projection)와 AA′ 점선·직각, PA′, A′B. 해설 좌표(그대로 써도 된다): l=x축, α=xz평면, β=xy평면, P=원점, A=(1/2,0,√3/2), B=(√2/2,√2/2,0), A′=(1/2,0,0). 중간값(그림 안): 60°, 45°, A′. caption: [PAB]=√14/8, [PA′B]=√2/8, cosθ=[PA′B]/[PAB]=1/√7, cos²θ=1/7, 정답 ②. (이면각 θ 표식은 다음 묶음 G4c — 이번엔 caption으로.)
- 각각 plan.json, out/figure-solution.svg, figure.png, publish.json {alt,caption,size}, item.json.

## 완료 기준
- 관련 단위 테스트 추가·통과(`archive/tools/geometry-equation/tests/solid-figure.test.mjs`, `tests/test_solid_figure_observer.py`에 기능별 테스트와 **관측기 변조 테스트**: 평면 꼭짓점·교선·관통점 경계·직각 위치를 바꾼 SVG가 잡히는지). 전체 스위트 금지. 기존 테스트를 바꿨으면 이유를 커밋 본문에.
- 정답지 회귀(규칙 10, 표본): `ops/golden.manifest.json`의 입체 항목(item47, item63e33a~j 중 3개, item97g4a, item98g4a 등 저장 SVG가 있는 것 10개 안팎)을 시작 전·후 렌더해 바이트 동일. 새 항목 `item99g4b`(삼수선), `item100g4b`(두 평면 교선) + manifest. golden-out 폴더에는 쓰지 않는다.
- 가이드 `production/author-guide-body.md` 입체 절에 새 필드·오류 코드·예시 한 줄씩, `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성, `ops/tools/hints.mjs` 안내(작은따옴표는 `\'`, 수정 후 `node -e "import('./archive/tools/geometry-equation/ops/tools/hints.mjs')"`).
- 모든 파일 LF. 커밋 전 `git diff --stat origin/main`이 실제 변경 크기인지 확인.
- 커밋은 기능마다 `feat(svg-engine): ... (G4b-1)` 식, 한국어 본문, 끝에 빈 줄 후
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01F4RMLKQwWq73G4ju4Quc1a`
- 끝나면 백그라운드 작업을 남기지 않는다.

## 보고 (8줄 이내)
커밋 해시, 새 필드·오류 코드, 테스트 수, 정답지 바이트 동일 수, 문항별 상태·PNG 경로·기존 대비 판단, 못 한 것과 그 이유(엔진 구조/규칙 충돌/알고리즘 — "한계"로 끝내지 말고 후속 묶음 제안).
