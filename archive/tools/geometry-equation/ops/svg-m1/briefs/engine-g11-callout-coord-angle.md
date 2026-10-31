# G11: 평면 라벨 잔여 — 좌표 그림 끌어내기, 각 끌어내기 호 배율·각 치수선, 좁은 꼭짓점 경로 라벨 (엔진 확장)

너는 엔진 수정 작업자다. 기능 3개를 순서대로 하나씩 구현·커밋한다. 메인(오케스트레이터)이 이미 읽기 전용 조사를 끝냈고, 아래 위치·설계는 그 조사에 근거한다. 줄 번호는 main 기준이라 조금 어긋날 수 있으니 grep으로 확인한다.

토큰을 아낀다: 큰 파일(engine.py·label_layout.py·phase2.mjs·observer)은 grep으로 필요한 부분만 읽고, 명령 출력은 tail로 짧게. 그림 PNG는 마지막 확인 때만 본다.

## 환경 (Linux 컨테이너)
- 너는 `isolation: worktree`로 이미 별도 git 워크트리 안에서 시작한다. 첫 동작:
  `git fetch origin main && git checkout -B claude/svg-g11-callout-coord-angle origin/main`
  `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine` (`.tmp/archive` 링크 금지)
- 이 워크트리 밖 파일 수정 금지(예외: 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g11/`). 본 체크아웃 `/home/user/AP------`의 저장소 파일은 건드리지 않는다. 남의 프로세스 종료 금지.
- python: `PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python python3 ...`
- Chrome: `export GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`
- 렌더(하나씩, CPU 4개 공유): `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out` (재렌더 전 `out/` 삭제). item.json = `{"sourcePath":"archive/exams/original/...js","ordinal":N}`. 결과는 `out/figure-result.json`의 `status`.
- PNG: `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`
- 정답지 렌더: `WT=$PWD node /home/user/AP------/.tmp/svg-m1/golden-one.mjs <outDir> <번호들...>` (번호는 `62e`·`70b`·`31a`처럼 dir에서 `item`을 뺀 것).
- 그림 작성 규칙 정본: `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`(§3-8 E37 문단 ~L309·L323, §3-10 ~L370). 기존 E37 지시서: `/home/user/AP------/.tmp/svg-m1/briefs/engine-e37-callout.md`.

## 문제 (지금 엔진이 왜 못 하나)
경로 기준 T=`archive/tools/geometry-equation/`.
1. 축 있는 좌표 그림(recipeId `SOURCE_COORDINATE_AXES_v1`, `model.coordinateMode==='SOURCE_COORDINATES'`)에서 `planeMarks.callouts`는 `T/production/plane-callouts.mjs:61` `if(!isPlaneFigure(plan))bad('CALLOUT_REQUIRES_PLANE_FIGURE')`로 거절된다. `isPlaneFigure`(plane-marks.mjs:8)는 `PLANE_FIGURE_v1`만 통과. 한편 `planeMarksAllowed`(plane-marks.mjs:11)는 좌표 그림도 이미 허용한다 — callout만 막혀 있다.
2. ANGLE callout의 호는 화면 px 고정이다: `T/visual_engine/engine.py:~949` `first=min(28.0,max(16.0,.25*rays))+9.0*(ring-1)`. callout `radius`(모델 단위)를 키워도 호는 28px 상한에서 멈춰, 크게 끌어낸 각에서 호가 꼭짓점에 콩알처럼 붙는다. 또 각 값을 두 반직선 사이 호 치수선(양 끝 화살촉)으로 보이는 수단이 없다.
3. `pathLabels[].anchor/side`(E37)는 좁은 꼭짓점(약 19°) 근처에서 `LAYOUT_INVENTORY_INCOMPLETE`(construction-candidate-svg-v1.mjs:188, unresolved)가 난다. 자리 탐색 `engine.py:1004-1054`(PATH_LABEL), 상수 `:324-328`(ANCHOR_FRACTIONS, GAPS 24/32/44/60, ANCHOR_SLIDES ±0.03/0.06/0.09, CLEAR_PX 28), 후보 생성 `label_layout.py:791-824`(anchor × gap × 8방향, side면 ±45° 이내 PATH_LABEL_SIDE_MIN_DOT=0.5). anchorAt가 있으면 ±0.09만 미끄러지고, 꼭짓점 근처 다른 변과 상자·지시선이 겹쳐 후보가 0이 된다(조사 추정).

## 기존 규칙과 충돌하는 곳 (연결 방법까지 정했다 — 그대로 따른다)
- **같은 배율**(viewport.py:15 equal=True): callout 복사본은 확대된 별도 모양이라 좌표 눈금과 맞지 않는다. → 복사본은 **축·눈금 영역 바깥의 빈 상자**에만 놓고, 복사본에는 축·눈금·좌표 읽기(coordinateLabels)를 붙이지 않는다. 복사 점은 이름만 단다(좌표 라벨 상속 금지).
- **축이 뷰포트 전체를 가로지름**: callout 범위점이 xs·ys에 들어가 프레임이 커지면(phase2.mjs:828-830) 축선·눈금이 복사본 상자를 뚫고 지나간다. → 좌표 모드에서는 **축선·눈금·축 이름의 범위를 callout을 넣기 전의 주 뷰포트로 고정**한다(주 bounds를 phase2에서 따로 계산해 engine.py 축 그리기(:436 `role:'axis'`, 눈금 :472·:511-512, 눈금 라벨 :439-447)에 넘긴다). callout 필드가 없으면 기존과 같은 값이 넘어가 바이트가 바뀌지 않아야 한다.
- **축 눈금 라벨 필수**(AXIS_TICK_VALUE_OUT_OF_VIEW)와 **눈금 범위**: 눈금 계산은 주 뷰포트 기준을 유지한다(뷰포트가 커졌다고 눈금이 늘어나면 안 된다).
- **좌표 띠**(render-plan.mjs:283-329, LAYOUT_INVENTORY_INCOMPLETE 시 coordinateLabels 띠·coordinateCanvas 재시도): 띠는 주 그림 상단 기준 그대로. callout 상자와 띠가 겹치면 callout `at`을 다른 쪽으로 옮기라는 거절 코드로 멈춘다(아래 거절).
- **원점 O·사분면 라벨**(engine.py:704-708, :752 QUADRANT_ORIGIN_OUTSIDE_VIEW, plane-marks.mjs:427): 주 뷰포트 기준으로 판단한다. 복사본에 원점이 들어가도 축·사분면 처리 대상이 아니다.
- **좌표 높이 상한** COORDINATE_PANEL_TOO_TALL(phase2.mjs:~965, 600): callout 때문에 넘으면 그대로 이 코드로 거절(at을 RIGHT로 바꾸라는 힌트).
- **Cindy 피어 대조**(cindy-observer.mjs:38): 복사점(`<id>__<점>`)은 피어에 없다. → 피어 대조 대상에서 callout 복사 객체를 빼되, 관측기 `expand_callouts`(plane-marks-observer-worker.py:212-340)가 plan에서 독립 계산한 위치와 대조하는 검사는 그대로 적용한다. 빼는 규칙은 id 접두사가 아니라 plan의 callout 정의에서 만든 집합으로 한다.
- **필수 라벨 삭제 금지**(BRIEF_RULES 규칙 8·9): 샘플에서 점 이름·길이·각 라벨이 자리가 없으면 지우지 말고 지시선 끌어내기를 먼저 쓰고, 그래도 안 되면 엔진 쪽 문제로 고친다.

## 기능별 설계

### 기능 1: 좌표 그림 끌어내기 (SEGMENT·ANGLE 모두)
- 필드: 기존과 같다. `"planeMarks":{"callouts":[{"id":"k1","kind":"SEGMENT","path":["A","C","B"],"at":"RIGHT","scale":2,"dimensions":[...]}]}` — 이제 `SOURCE_COORDINATE_AXES_v1` plan에서도 받는다.
- 계산: `plane-callouts.mjs`의 거절 조건을 `isPlaneFigure(plan)||isCoordinateFigure(plan)`로 넓힌다. `place()`(:30-37)는 좌표 모드에서 기준 bounds를 **주 뷰포트(축 범위 + 눈금 라벨 여백 포함)** 로 잡고 gap 밖에 상자를 놓는다. 주 뷰포트를 phase2에서 따로 보관해 engine.py 축 그리기에 넘긴다(위 충돌 절). 좌표 모드 pad=span*0.35(phase2.mjs:832)는 주 뷰포트에만 적용.
- 관측기: (1) 기존 expand_callouts 검사(점·이름·비율·직선성·방향·쪽·치수 값)를 좌표 모드에서도 그대로 실행. (2) 새 검사 `CALLOUT_OVERLAPS_AXES`: 최종 SVG에서 축선·눈금·눈금 라벨·축 이름 primitive의 상자가 callout 복사본(복사점·복사 선분·라벨)의 외곽 상자와 겹치지 않음. (3) 축선 끝점이 주 뷰포트 범위를 넘지 않음(`CALLOUT_AXIS_EXTENT_MISMATCH`).
- 거절: 축 없는 그래프 계열(함수 그래프 등)은 여전히 `CALLOUT_REQUIRES_PLANE_FIGURE`(이름은 유지, 힌트 문구 hints.mjs:172를 "평면도형 또는 좌표평면 도형만"으로 갱신). 좌표 띠와 상자 겹침 `CALLOUT_OVERLAPS_COORDINATE_BAND`. 높이 초과는 기존 `COORDINATE_PANEL_TOO_TALL`.
- 커밋 1: `feat(svg-engine): 좌표평면 도형에서도 선분·각 끌어내기 (G11)`

### 기능 2: ANGLE callout 호 배율과 각 치수선 (옵트인)
- 필드: `{"id":"k2","kind":"ANGLE","vertex":"C","rays":["A","B"],"radius":3,"arcScale":"PROPORTIONAL","angleDimension":{"text":"36°"}}`
  - `arcScale`: 생략=기존(px 고정, 바이트 동일). `"PROPORTIONAL"`이면 이 callout 안의 각 표식(angles marks) 호 반지름을 화면상 반직선 길이(px)에 비례시킨다: `first = clamp(0.30*rayPx, 16, 0.55*rayPx)`, 겹호 간격은 `max(4.5, 0.04*rayPx)`. 28 상한은 이 경우에만 풀린다.
  - `angleDimension`: 두 반직선 사이 호 치수선. 반지름 = 반직선 길이의 1.15배(반직선보다 바깥이면 양 끝에 반직선 연장 보조선을 GUIDE 스타일로 그림)를 기본으로 하고 `"radiusFactor"`로 0.6~1.5 조절 가능. 양 끝에 기존 치수 화살촉(DIM_ARROW_*, engine.py ~980-1000)을 단다. 라벨은 호 중앙 바깥, 자리가 없으면 기존 OWNER_LEADER 지시선(label_layout.py ~785) 폴백. `text`는 `"36°"`·`"\\angle x"`·`"x"`처럼 기존 각 라벨 문법.
- 계산: callout 각 표식에 `arcScale`을 실어 engine.py 각 표식 경로(:933·:949·:964 wedgeSearch)에서 분기한다. 호 치수선은 새 primitive 종류를 만들지 말고 CIRCULAR_ARC(arcs[] label 쓰는 것)와 DIMENSION 화살촉 코드를 재사용해 조립한다. 각도는 plan의 점 좌표에서 계산(SymPy `atan2` 또는 기존 각 계산 함수)하고, 화면 좌표 변환은 기존 viewport 변환을 쓴다.
- 관측기(plane-marks-observer-worker.py, expand_callouts 옆): (1) PROPORTIONAL이면 최종 SVG의 호 반지름 px가 위 공식 ±0.5px(`CALLOUT_ARC_SCALE_MISMATCH`). (2) 치수 호 중심 = 복사 꼭짓점 ±1px, 양 끝점 방향각이 두 반직선 방향과 0.5° 이내, 화살촉 2개 존재(`CALLOUT_ANGLE_DIMENSION_GEOMETRY_MISMATCH`). (3) 라벨 글자가 plan `text`와 일치하고 지시선이 있으면 기존 `MARK_LEADER_NOT_ON_OWNER/LABEL` 규칙 통과(`CALLOUT_ANGLE_DIMENSION_LABEL_MISMATCH`).
- 거절: `arcScale`이 SEGMENT callout에 있거나 값이 다름 `CALLOUT_ARC_SCALE_INVALID`. `angleDimension`이 SEGMENT에 있음·text 비었음·radiusFactor 범위 밖 `CALLOUT_ANGLE_DIMENSION_INVALID`. 라벨이 지시선으로도 안 들어감은 기존 LAYOUT_INVENTORY_INCOMPLETE 대신 `CALLOUT_ANGLE_DIMENSION_NO_ROOM`.
- 커밋 2: `feat(svg-engine): 각 끌어내기 호 비례 배율과 각 치수선 (G11)`

### 기능 3: 좁은 꼭짓점 경로 라벨 자리 (실패할 때만 작동하는 폴백)
- 필드: 새 필드 없음(기존 `pathLabels[].anchor/side`). 선택 필드 `"leader":"AUTO"|"NEVER"` (생략=AUTO).
- 계산(engine.py PATH_LABEL + label_layout.py): 기존 후보가 **모두** 실패했을 때만 2차 후보를 돈다 → 기존에 성공하던 그림은 첫 단계에서 끝나므로 바이트가 바뀌지 않는다.
  2차 후보: ① anchor 미끄러짐을 ±0.25까지(0.12, 0.18, 0.25)로 넓히되 꼭짓점에서 먼 쪽 우선, ② GAPS에 80·100·120px 추가, ③ side가 있으면 ±45°→±75°(dot≥0.26)로 넓힘(쪽은 유지), ④ 그래도 없으면 그림 외곽(볼록 껍질 바깥) 빈 자리에 라벨을 두고 경로의 anchor 점에서 지시선으로 잇는 후보. 지시선은 자기 경로 조각에서만 출발하고 다른 선분을 가로지르지 않아야 한다(visible_owner_leader 재사용).
- 관측기: 기존 `PATH_LABEL_ANCHOR_MISMATCH`(±0.1)는 2차 후보에서 ±0.27로 완화하는 것이 아니라, **최종 라벨 지시선의 출발점 t**를 다시 계산해 plan anchor와의 차이 ≤0.26일 때만 통과하도록 새 분기를 둔다(2차 사용 여부는 SVG 속성 `data-path-label-fallback="1"`로 표시하고 관측기는 그 표시가 있을 때만 이 분기를 쓴다). side 검사는 dot≥0.26. 지시선은 기존 `MARK_LEADER_NOT_ON_OWNER/LABEL`. 다른 선분 교차는 새 `PATH_LABEL_LEADER_CROSSES_SEGMENT`.
- 거절: `leader:"NEVER"`인데 1차 실패, 또는 2차도 실패하면 `PATH_LABEL_NO_ROOM`(어떤 라벨인지 id를 detail에) — 일반 LAYOUT_INVENTORY_INCOMPLETE 대신.
- 커밋 3: `feat(svg-engine): 좁은 꼭짓점 경로 라벨 2차 자리 탐색과 지시선 (G11)`

## 실제 문항 (기능마다 하나, 3개)
고등 샘플은 조사에서 최신 고등부터 찾았다. 좁은 각·좁은 꼭짓점이 실제로 필요한 고등 문항은 찾지 못해(조사 보고) 기능 2·3은 중2 기존 정답지 문항으로 한다.

1. **기능 1** `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js` #9, 문제 그림 `archive/assets/images/25_팔마고_2학기_중간_고1_기출/q09.png` — O(0,0), A(6,0), B(3,6)의 각 변을 3:1로 내분하는 C·D·E와 삼각형 CDE. 좌표평면 위 주 그림 + 한 변(예: O–C–A)을 끌어내 3:1 길이 비를 치수선 단으로 보인다. 좌표는 문제가 준 값, 내분점 좌표는 풀이 중간값이라 써도 된다. **무게중심 좌표(최종 답)는 그림·alt·caption 어디에도 쓰지 않는다.**
2. **기능 2** `archive/exams/original/middle/m2/2mid/26_왕운중_2학기_중간_중2_기출.js` #8 (정답지 item81의 문항, ∠ICB 36°와 ∠C 72°가 몰린 곳) — item81 plan을 출발점으로 ANGLE callout에 `arcScale:"PROPORTIONAL"`과 `angleDimension`을 쓴 새 그림. 정답 값이 각이면 그 각은 이름(∠x 등)만.
3. **기능 3** `archive/exams/original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js` #6 (정답지 item83의 문항) — 약 19° 꼭짓점의 중선 CD에 `pathLabels`(CD 전체, anchor 꼭짓점 C 쪽)를 **끌어내기 없이 주 그림에서** 2차 자리 탐색으로 붙인다. 이전 기록: 경로 라벨이 CG 구간에 닿아 오독됐다(gaps.md:129).

- 기존 해설 그림 확인: 문항 객체에서 `solutionImage`로 시작하는 키가 하나라도 있으면 기존 그림이 있는 것이다(조사: #9 없음, 25_왕운중 #6 있음(q6-solution.svg), 26_왕운중 #8은 직접 확인). 있으면 그 SVG를 PNG로 바꿔 새 그림과 나란히 보고 "정답 노출 여부, 새 것이 더 나은가/비슷한가/못한가"를 한 줄로 적는다. 교체 여부는 메인이 정한다.
- 결과 폴더: `/home/user/AP------/.tmp/svg-m1/runs/g11/<시험이름>-q<N>/` 에 plan.json, item.json, out/figure-solution.svg, figure.png, publish.json `{alt, caption, size}`(최종 답·정답 번호·"옳은/옳지 않은" 판정 금지; 문제가 준 값·풀이 중간값은 가능. alt·caption에도 같은 규칙).

## 완료 기준
- 각 기능에 단위 테스트 추가·통과: node `tests/plane-callout.test.mjs`(실제 Chrome), python `tests/test_plane_callout.py`(관측기 변조 테스트 — 새 오류 코드마다 SVG/plan을 일부러 틀리게 만들어 그 코드가 나는지). 기능 3은 좁은 각 픽스처로 1차 실패→2차 성공, NEVER→PATH_LABEL_NO_ROOM 테스트.
- 관련 테스트만 실행(전체 스위트 금지). 시작 전에 아래를 한 번 돌려 기준 실패 수를 기록하고 끝에 비교:
  - `cd archive/tools/geometry-equation && node --test --test-concurrency=1 tests/plane-callout.test.mjs tests/plane-marks.test.mjs tests/coordinate-plane-marks.test.mjs tests/plane-dimensions.test.mjs tests/plane-e32.test.mjs tests/plane-angle-labels.test.mjs tests/plane-panels.test.mjs tests/plane-label-emphasis.test.mjs tests/hidden-point-coordinates.test.mjs tests/author-guide.test.mjs 2>&1 | tail -15`
  - python: `tests/test_plane_callout.py test_plane_marks test_plane_dimensions test_plane_dimensions_e32 test_plane_e32_marks test_plane_angle_leader test_plane_angle_over test_plane_arc_leader test_plane_equal_path` (실행 위치·모듈 이름은 저장소 방식을 확인해 맞춘다; `python3 -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_plane*.py'`도 가능).
  - 기존 테스트를 바꿨으면 이유를 커밋 본문에 적는다. 관측기·테스트를 약하게 만들어 통과시키지 않는다.
- **정답지 회귀(바이트 동일):** 시작하자마자 이 워크트리에서 아래 정답지를 렌더해 `/home/user/AP------/.tmp/svg-m1/runs/g11/golden-before/`에 저장, 끝에 `golden-after/`로 다시 렌더해 `*-solution.svg`를 `cmp`.
  대상(42개): PLANE_MARKS `19 27 44 50 54 60 62 62e 62f 62g 62h 62i 70 70b 70c 70d 70e 70f 70g 70h 70i 70j 70k 70l 80 81 82 83`, COORD_GEOM `01 02 03 05 06 12 17 35 31a`, planeMarks 쓰는 `20 36 37 39 46`. (번호가 manifest에 없으면 건너뛰고 보고.) 한 번에 30분쯤 걸린다 — 백그라운드로 돌리고 끝날 때까지 기다린다. 결과 `golden-diff.txt`에 `itemNN SAME|DIFF|FAIL`.
  - 새 정답지 항목 3개 `item84g11a`(기능 1 샘플), `item85g11b`(기능 2), `item86g11c`(기능 3): `ops/golden/<dir>/plan.json` + `ops/golden.manifest.json` 항목(fam: 1=COORD_GEOM, 2·3=PLANE_MARKS).
  - `golden-out` 폴더에는 쓰지 않는다.
- 가이드: `production/author-guide-body.md`의 E37 문단(callout·pathLabels)과 §3-10에 새 필드·오류 코드를 짧게(필드·예시 한 줄), `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. `ops/tools/hints.mjs`에 새 코드 안내(CALLOUT_OVERLAPS_AXES, CALLOUT_AXIS_EXTENT_MISMATCH, CALLOUT_OVERLAPS_COORDINATE_BAND, CALLOUT_ARC_SCALE_*, CALLOUT_ANGLE_DIMENSION_*, PATH_LABEL_NO_ROOM, PATH_LABEL_LEADER_CROSSES_SEGMENT)와 CALLOUT_REQUIRES_PLANE_FIGURE 문구 갱신. `ops/svg-m1/gaps.md` G11 절 끝에 "구현됨(G11)" 한 줄과 남은 것.
- 실제 문항 3개 모두 `ARCHIVE_BOUND`, PNG를 직접 보고 학생이 화면(PC·휴대폰 폭)에서 읽을 수 있는지 확인. 필수 라벨을 지우지 않았는지 스스로 점검.
- **모든 파일 LF.** 커밋 전 `git diff --stat origin/main | tail -3`이 실제 변경 크기인지 확인.
- 커밋: 기능별 3개 `feat(svg-engine): ...` 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. 정답지·가이드는 해당 기능 커밋에 함께 넣거나 마지막 `docs(svg-engine): ...` 하나로. **push·PR·병합 금지. 시험지 JS 수정 금지.** 끝나면 백그라운드 작업을 남기지 않는다.
- 기능 하나가 막혔을 때 "한계"로 끝내지 않는다: 막힌 이유(엔진 구조/규칙 충돌/알고리즘)와 시도한 것을 구체적으로 적고 나머지 기능을 계속한다. "범위가 크면 미룬다"는 없다 — 세 기능 모두 이 묶음의 완료 조건이다.

## 보고 (8줄 이내)
브랜치·커밋 해시 3~4개, 새 필드·오류 코드, 테스트 수(전/후, 새로 추가), 정답지 SAME n/42 (DIFF 목록), 문항별 status·PNG 경로·기존 그림 대비 한 줄, 못 한 것과 그 이유.
