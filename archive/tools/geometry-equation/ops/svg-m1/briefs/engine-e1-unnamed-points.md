# 엔진 확장 E1: 이름 없는 점(평면도형)

## 배경
중1 평면도형 문항(평행선과 각, 접은 종이, 다각형의 외각, 별 모양)은 원문 그림에 **점 이름이 하나도 없는** 경우가 많다. 지금 `PLANE_FIGURE_v1`은
- `SOURCE_POINT`가 1개 이상 있어야 하고(`construction.py` `PLANE_FIGURE_SOURCE_POINT_REQUIRED`),
- 모든 SOURCE_POINT는 `displayPoints`에 있어야 하며(`phase2.mjs` `REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED`),
- `hiddenPointNames`는 `DERIVED_INTERMEDIATE` 점만 받는다(`phase2.mjs` 약 627행 `INVALID_HIDDEN_POINT_NAMES`).
그래서 작성자가 원문에 없는 이름 "A"를 붙이게 되고, 독립 검토에서 "문제에 없는 점 이름" 결함으로 지적됐다.

## 목표 (좁게)
`PLANE_FIGURE_v1`(축 없는 평면도형)에서만 **SOURCE_POINT도 `hiddenPointNames`에 넣어 이름 없이** 그릴 수 있게 한다.
- 허용 조건: 그 점이 `planeMarks`/`displaySegments` 등 다른 요소의 참조 대상이어도 된다(이름만 숨김). 단 `coordinateLabels`에 든 점, `pointNames`로 표시 이름을 준 점, 캡션·라벨이 그 점 이름을 글자로 가리키는 경우는 지금처럼 거절한다.
- 숨긴 점은 지금의 hidden 점과 같은 방식(이름 없는 점)으로 그린다. 여기에 더해 **선택 필드 `hiddenPointStyle:"NONE"`**(plan 최상위, 기본은 지금 동작 `"DOT"`)을 두어, 숨긴 점에 **점 표식(dot)조차 그리지 않는** 옵션을 만든다(교과서식: 직선의 교점·다각형 꼭짓점에 점이 없음). 이 옵션이 관측기·레이아웃 검사와 충돌하면 관측기가 같은 plan에서 독립적으로 "숨긴 점은 표식 없음"을 기대하도록 고친다(검사를 약하게 만들지 않는다: 숨긴 점 위치에 표식이 **있으면 FAIL**, 숨기지 않은 점에 표식이 **없으면 FAIL**).
- 좌표축이 있는 그림(`SOURCE_COORDINATE_AXES_v1` 등)과 다른 capability는 동작을 바꾸지 않는다(기존 SVG 바이트 동일).

## 지켜야 할 것
- 공통 규칙: `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 "Engineering rules (hard)"와 "Other workers share this machine" 절을 따른다(Windows/Git Bash·D: 경로 이야기는 무시; 여기는 Linux).
- 독립 관측기는 엔진 계산을 믿지 않고 plan에서 다시 계산해 최종 SVG를 검사한다. 관측기·테스트·허용오차를 약하게 만들어 통과시키지 않는다. 새 거절 코드는 명시적으로.
- 작성 가이드: `production/author-guide-body.md`의 3-8절에 짧게(5줄 이내) 사용법·제약·오류 코드를 추가하고 `node archive/tools/geometry-equation/production/build-author-guide.mjs`로 `AUTHOR_GUIDE.md` 재생성(같은 커밋). 가이드의 다른 절은 건드리지 않는다.
- 테스트: 관련 단위 테스트를 추가(예: `tests/plane-marks.test.mjs` 또는 새 파일)하고, 아래를 실행해 결과를 보고한다(main과 같은 결과여야 함):
  - `node --test archive/tools/geometry-equation/tests/plane-marks.test.mjs archive/tools/geometry-equation/tests/author-guide.test.mjs archive/tools/geometry-equation/tests/plane-panels.test.mjs archive/tools/geometry-equation/tests/construction-traces.test.mjs` (+ 네가 추가한 테스트, 관련 python 테스트 `python3 -m pytest -q archive/tools/geometry-equation/tests/test_plane_marks.py` 등 존재하는 것)
  - 평면 정답지 회귀(바이트 동일 기대): golden item19, 20, 27, 36, 37, 39, 44, 46 — 각 `render-plan.mjs --item <item.json> --plan ops/golden/itemNN/plan.json --out <dir>`로 하나씩(동시 실행 금지) ARCHIVE_BOUND와 SVG sha256를 기존 결과와 비교. 기존 결과 SVG: `/home/user/AP------/.tmp/svg-m1/golden-out/itemNN-solution.svg`. item.json은 `ops/golden.manifest.json`의 sourcePath·ordinal로 만든다.
- 실제 문항 확인: `/home/user/AP------/.tmp/svg-m1/runs/plan-sonnet/q14/plan.json`(24_매산중 중1 q14, 지금은 이름 "A"를 붙임)을 복사해 A를 숨기고 `hiddenPointStyle:"NONE"`로 다시 그려 ARCHIVE_BOUND 확인, PNG로 바꿔(`node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`) 한 번 본다. 결과 plan/SVG/PNG는 너의 작업 폴더 `/home/user/AP------/.tmp/svg-m1/runs/e1/`에 둔다.

## 작업 환경
- 너는 별도 git worktree에서 일한다(지금 디렉터리). 먼저 의존성 링크: `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine` (`.tmp/archive`는 링크하지 않는다). 렌더·테스트는 워크트리 루트에서.
- 커밋: 워크트리 브랜치에 1~2개 커밋, 메시지 `feat(svg-engine): 평면도형 이름 없는 점(hiddenPointNames SOURCE_POINT, hiddenPointStyle)` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합은 하지 않는다(관리자가 한다).
- 엔진 폴더(`archive/tools/geometry-equation/`) 밖은 수정하지 않는다. 시험지 JS 수정 금지.

## 완료 보고 (10줄 이내)
변경 파일 목록, 추가한 오류 코드, 테스트 결과(통과/실패 수), 정답지 8개 바이트 동일 여부, q14 재렌더 상태와 PNG 경로, 커밋 해시.
