# G4a: 공간도형 1 — 입체 안의 일반 보조점(내분점·중점·무게중심·수선의 발·평면 위 정사영)과 정사영 삼각형·공간 각 (엔진 확장)

너는 엔진 수정 작업자다. 기능 2개를 순서대로 구현·커밋한다. 기존 입체 엔진 solid-figure-v1을 넓힌다(새 capability 아님). G4b(평면 α·β)·G4c(이면각)가 이어 쓴다.

토큰을 아낀다: solid-figure-v1.mjs(2808줄)·solid_figure_observer.py(3681줄)는 grep으로 필요한 부분만, 출력은 tail로.

## 환경 (Linux)
- `isolation: worktree`. 첫 동작: `git fetch origin main && git checkout -B claude/svg-g4a-solid-points origin/main`, `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`
- `export GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python`
- 렌더: `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`(재렌더 전 out 삭제). PNG: `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`. 정답지: `WT=$PWD node /home/user/AP------/.tmp/svg-m1/golden-one.mjs <outDir> <번호들>`.
- 워크트리 밖 수정 금지(예외 `/home/user/AP------/.tmp/svg-m1/runs/g4a/`). `ops/svg-m1/BRIEF_RULES.md` §2의 8~11번을 먼저 읽는다(라벨 삭제 금지·지시선 우선·정답지 표본·**중간값은 그림 안에 가능한 많이, 정답은 캡션**).

## 지금 구조 (P=`archive/tools/geometry-equation/production/`, 조사 결과)
- 투영 `P/solid-figure-v1.mjs` L30~45(YAW 28°, PITCH 20°, x 오른쪽·y 안쪽·z 위). 관측기 `P/solid_figure_observer.py` L45에 자기 project.
- 입체 `solids[]`: vertices·edges·faces, 이름 참조 `pointTable`(L736)·`vertexResolver`(L705).
- 숨은선: `occluded`(L580), `edgeRuns`(L593); 사용자 segments는 `solveSolids` L1081에서 AUTO 숨김 판정, `DASHED`/`SOLID` 강제 가능.
- G1 보조점 `solids[].points:[{id,at:{base:'center'|'centroid'}|{edge:[A,B],t:'1/2'}|{foot:{...}}}]`(resolveAuxPoints L761, 최대 6) — **자기 입체의 모서리·밑면에서만** 계산된다.
- marks: rightAngles(3D cos≈0 검증)·equalLengths·angles. highlights: `{polygon:[이름 3~6개]}`(평면성 검사, 칠 6색). dims(길이 표기).
- 관측기는 plan만으로 모델을 다시 만들어 최종 SVG와 대조(build_solid, audit_aux_points, audit_marks …).
- 테스트 `tests/solid-figure.test.mjs`(Chrome), `tests/test_solid_figure_observer.py`.

## 기존 규칙과 충돌 (정해 둠)
- 보조점 최대 6 → 이 묶음에서 10으로 올린다(그 이상은 `SOLID_AUX_POINT_LIMIT`).
- 새 at 형식은 **이름 붙은 점 아무거나**(꼭짓점·이미 정의된 보조점, 앞에서 정의된 순서)를 받는다. 기존 at 형식의 해석은 바꾸지 않는다(기존 그림 바이트 불변).
- 보조점에서 그은 segments의 숨김 판정은 기존 AUTO 규칙 그대로(입체 면 뒤면 점선).
- 3D 각 표시(marks.angles)가 보조점 이름을 받는지 확인하고, 안 받으면 받게 한다.

## 기능 1: 일반 보조점과 공간 수선의 발
- 필드(`solids[].points[].at`에 추가):
  - `{"divide":["D","F"],"ratio":"1:2"}` — D→F를 1:2로 내분(외분은 `"external":true`).
  - `{"midpoint":["A","B"]}`, `{"centroid":["A","B","C"]}`.
  - `{"footOnLine":{"from":"P","line":["E","F"]}}` — P에서 직선 EF에 내린 수선의 발.
- 계산: 3D 좌표 정확값(SymPy Rational/근호, 기존 G1 보조점 계산 함수 옆). 순환 참조 `SOLID_AUX_POINT_CYCLE`, 없는 이름 `SOLID_AUX_POINT_UNKNOWN`, 비율 형식 오류 `SOLID_AUX_POINT_RATIO_INVALID`, 발이 직선 밖(퇴화) `SOLID_AUX_FOOT_DEGENERATE`.
- 관측기: 각 보조점의 3D 위치를 plan에서 자기 계산 → 투영해 SVG 점 위치와 대조(기존 audit_aux_points 확장, `SOLID_AUX_POINT_MOVED` 재사용). footOnLine은 PH⊥EF를 3D 내적으로 확인.
- 커밋 1: `feat(svg-engine): 입체 안 일반 보조점(내분점·중점·무게중심·직선 위 수선의 발) (G4a)`

## 기능 2: 평면 위로의 정사영 점과 정사영 도형
- 필드: `{"id":"C'","at":{"projection":{"from":"C","plane":["A","B","M"]}}}` — C에서 평면 ABM에 내린 수선의 발(=정사영). highlights `{polygon:["A","B","C'"]}`로 정사영 삼각형 칠, 수선 CC'은 segments(점선 권장)와 marks.rightAngles(C', 평면 위 한 점)로.
- 계산: 평면 법선(외적)으로 정확값 사영. 세 점이 한 직선 `SOLID_PROJECTION_PLANE_DEGENERATE`.
- 관측기: C'이 평면 ABM 위(법선 내적 0)이고 CC'∥법선(3D)인지 자기 계산, 투영 위치 대조(`SOLID_PROJECTION_MISMATCH`).
- 커밋 2: `feat(svg-engine): 입체 안 평면 위로의 정사영 점과 정사영 도형 (G4a)`

## 실제 문항 (메인이 해설을 읽고 뽑은 값 — 그림 안에 가능한 많이, 정답은 캡션)
1. `archive/exams/original/high/h2/1final/22_매산고_1학기_기말_고2_기하_기출.js` #11, 그림 `archive/assets/images/22_매산고_1학기_기말_고2_기하_기출/q11.png`, 기존 해설 그림 **없음**. 정답 ④ 3√2.
   - 해설: 모서리 3인 정육면체, E=(0,0,0), F=(3,0,0), D=(0,3,3)으로 두고 DP:PF=1:2인 P=(1,2,2). EF=3, P에서 직선 EF까지 거리 2√2. [PEF]=½·3·2√2=3√2.
   - 그림에 넣을 값: 정육면체 꼭짓점 이름(문제 그림과 같게), 대각선 DF와 P, DP:PF=1:2(또는 길이 비 표시), 삼각형 PEF 칠, P에서 EF에 내린 수선의 발 H와 직각 표시, PH=2√2, EF=3, 모서리 3. 캡션: "[PEF]=½×3×2√2=3√2".
2. 같은 시험지 #13, 그림 `.../q13.png`, 기존 해설 그림 **있음**(비교해서 판단). 정답 ③ 4√2.
   - 해설: 모서리 4인 정사면체 ABCD, CD의 중점 M, AB의 중점 N. NC=2√3, NM=2√2, 평면 ABC와 평면 ABM의 이면각 φ에서 cosφ=√6/3, [ABC]=4√3, 정사영 넓이 [ABC]cosφ=4√2.
   - 그림에 넣을 값: M·N, 선분 NC·NM과 그 길이 2√3·2√2, 두 선분 사이 각 φ 표시(cosφ=√6/3은 그림 라벨 또는 캡션), C의 평면 ABM 위 정사영 C'와 수선 CC'(점선)·직각, 정사영 삼각형 ABC' 칠, 모서리 4. 캡션: "[ABC]=4√3, 정사영 넓이 4√3×√6/3=4√2".
- 그림이 빽빽하면 덜 중요한 값을 캡션으로 옮기고 보고에 적는다(메인이 그림을 보고 판단).
- 결과: `/home/user/AP------/.tmp/svg-m1/runs/g4a/<시험이름>-q<N>/`에 plan.json, item.json, out/figure-solution.svg, figure.png, publish.json `{alt, caption, size}`. #13은 기존 SVG도 PNG로(`old-q13.png`).

## 완료 기준
- 테스트: solid-figure.test.mjs(렌더)·test_solid_figure_observer.py(관측기 변조, 새 오류 코드마다). 저장소 루트에서 시작 전 기준 기록·끝 비교: `node --test --test-concurrency=1 archive/tools/geometry-equation/tests/solid-figure.test.mjs archive/tools/geometry-equation/tests/author-guide.test.mjs 2>&1 | tail -6`, `python3 -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_solid_figure_observer.py' 2>&1 | tail -3`.
- 정답지(표본만, 규칙 10): 다면체·보조점·marks 경로 `64g1 63e33h 63e33j 52 63e33g`, 회전체 하나 `22`를 시작·끝에 렌더해 바이트 비교. 새 `item97g4a`(#11), `item98g4a`(#13) + manifest(fam SOLID).
- 가이드: author-guide-body.md 입체 보조점 절에 새 at 형식 한 줄씩, 재생성. hints.mjs 새 코드(작은따옴표 `\'`), import 확인. gaps.md G4 절에 "G4a 구현됨"과 남은 것.
- 두 문항 ARCHIVE_BOUND, PNG 확인. LF. 커밋 2개(+docs 1개), 한국어 본문 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR 금지, 시험지 JS 수정 금지, 백그라운드 작업 남기지 않기. 막힌 기능은 이유와 시도를 적고 계속.

## 보고 (8줄 이내)
커밋 해시, 새 필드·오류 코드, 테스트 수(전/후), 정답지 표본 SAME 수·새 항목, 문항별 status·PNG 경로·그림에 넣은 값/캡션으로 뺀 값, 못 한 것과 이유.
