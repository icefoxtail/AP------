# 엔진 확장 E9: 중1 반비례 그래프 y=k/x (+ 오버레이 다각형 라벨)

## 배경 (실제로 막힌 문항)
- 26_왕운중 2학기 중간 중1 q7: 반비례 y=k/x 그래프 위의 점 P와 원점 O, 축 위의 A, B로 만든 직사각형 OAPB를 색칠하고 그 넓이 b를 안에 적어야 한다.
- 26_왕운중 2학기 중간 중1 q8: y=-80/x 그래프와 점 (-4,20), (4,-20).
지금 `rational-spike-v1`은 분자·분모가 모두 일차(`numerator`·`denominator` = [상수항, x계수])여야 하고, 분자가 상수이면 `production/graph_framing.py` 약 340행에서 `UNSUPPORTED_RATIONAL_NUMERATOR_DEGREE`로 거절한다. 중1 '좌표평면과 그래프'의 반비례는 대부분 이 꼴이다.

## 목표
1. `rational`에서 **분자 상수(0이 아닌 k, `numerator:[k,0]`)** 를 허용한다: y = k/(d0+d1·x). 수평 점근선 y=0, 수직 점근선 x=-d0/d1, x절편 없음. 두 가지 모두 그린다(정의역 ALL_REALS에서 점근선 양쪽). 점근선이 좌표축과 겹치면(중1 y=k/x) 따로 점선 점근선을 그리지 않는다(축이 곧 점근선) — 이것도 관측기가 독립 확인.
   - 프레이밍: 기존 유리함수 개요 창 규칙을 따르되 x절편이 없을 때도 창이 정해져야 한다(쌍곡선 두 가지가 보이도록, requiredPoints·overlay 점을 포함). 같은 배율·세로 1/2 압축 규칙 유지.
   - 독립 관측기(`graph_observer.py` 쪽)는 plan의 k, d0, d1에서 두 가지를 다시 계산해 최종 SVG polyline이 곡선 위에 있는지, 가지가 점근선을 넘지 않는지, 점근선 표시/비표시가 규칙대로인지 검사한다. 기존 일차/일차 경로는 바이트 동일.
2. `graphPlan.overlays.polygons`에 선택 `label`(짧은 수식, 40자 이내)·`labelKind`("MATH" 기본 | "TEXT")를 추가: 다각형 안 가장 넓은 곳에 놓는다. 관측기는 라벨 상자가 그 다각형 안에 있는지 검사(밖이면 FAIL).
3. 정비례 y=ax(원점을 지나는 직선)가 지금 어떤 family로 되는지 확인해 가이드에 한 줄로 적는다(이미 되면 예시만, 안 되면 보고만).

## 지켜야 할 것
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 "Engineering rules (hard)", "Other workers share this machine"(Windows·D: 경로는 무시; Linux). 관측기·테스트·허용오차를 약하게 만들지 않는다. 새 거절 코드는 명시적으로.
- 가이드: `production/author-guide-body.md`의 3-2절 표의 유리 행과 3-14절(overlays)에 짧게 추가, `node archive/tools/geometry-equation/production/build-author-guide.mjs`로 재생성. 다른 절은 건드리지 않는다. (다른 작업자가 3-8절·3-입체 절을 동시에 고치고 있다.)
- 테스트: `node --test archive/tools/geometry-equation/tests/rational-linear-over-linear-archive.test.mjs archive/tools/geometry-equation/tests/phase4-rational-spec.test.mjs archive/tools/geometry-equation/tests/graph-overlays.test.mjs archive/tools/geometry-equation/tests/function-families-render-plan.test.mjs archive/tools/geometry-equation/tests/author-guide.test.mjs` + `python3 -m pytest -q archive/tools/geometry-equation/tests/test_rational_overview.py archive/tools/geometry-equation/tests/test_graph_overlays.py`(존재하는 것) + 추가한 테스트. 실행 전에 main 기준 결과를 먼저 기록해 두고(기존 실패가 있을 수 있다) 같은지 비교한다.
- 그래프 정답지 회귀(바이트 동일): golden item14, 15, 16, 18, 23, 24, 25, 30, 31, 32, 33, 34, 38 — 하나씩 `render-plan.mjs --item <item.json> --plan ops/golden/itemNN/plan.json --out <dir>` 후 기존 SVG `/home/user/AP------/.tmp/svg-m1/golden-out/itemNN-solution.svg`와 sha256 비교(item.json은 `ops/golden.manifest.json`의 sourcePath·ordinal).
- 실제 문항: q7·q8의 plan을 새로 써서(packet `/home/user/AP------/.tmp/svg-m1/packets/26_왕운중_2학기_중간_중1_기출.json`, item `{"sourcePath":"archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js","ordinal":7|8}`) 워크트리 루트에서 렌더해 ARCHIVE_BOUND, `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`로 PNG 확인. 원문 문제 그림(packet의 questionImage)과 점 이름·배치를 맞춘다. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size})는 `/home/user/AP------/.tmp/svg-m1/runs/e9/q7/`, `.../q8/`에. 정답지에 q7 plan을 `ops/golden/item49/plan.json`으로 추가하고 manifest에 등록.

## 작업 환경
- 별도 git worktree(지금 디렉터리). 먼저 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine` (`.tmp/archive`는 링크 금지). 렌더·테스트는 워크트리 루트에서 하나씩.
- 커밋 1~2개: `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. /home/user/AP------ 본 체크아웃은 건드리지 않는다.

## 완료 보고 (10줄 이내)
커밋 해시, 새 필드·오류 코드, 테스트 결과(main 대비), 정답지 13개 바이트 동일 여부, q7·q8 상태와 PNG 경로, 워크트리 경로·브랜치.
