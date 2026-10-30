# 엔진 확장 E2·E3: 입체·전개도 표식 (solid-figure-v1)

중1 입체도형 해설 그림에서 실제로 막힌 두 가지를 구현한다. 코드: `archive/tools/geometry-equation/production/solid-figure-v1.mjs`, 독립 관측기 `solid_figure_observer.py`(+`solid_figure_observer_worker.py`), 테스트 `tests/solid-figure.test.mjs`(+ python 테스트가 있으면 그것도), 가이드 `production/author-guide-body.md`의 "3-입체" 절.

## E2. 전개도에서 특정 모서리 강조·특정 면 칠하기
실제 문항: 24_매산중 2학기 중간 중1 q15 — 정육면체 전개도(꼭짓점 A~N)를 접었을 때 모서리 BC와 평행한 면(JEDK, NMLK)을 묻는다. 해설 그림은 전개도 위에서 **BC를 빨강으로**, **두 면을 연하게 칠해** 보여야 한다. 지금 `net`은 `dims`만 받고 입체 그림의 `segments`(role REF/ACCENT)·`highlights`(polygon)는 net에서 쓸 수 없다.
- net에 `highlights:[{"face":"side1","fill":"LIGHT"|"MEDIUM"}]`(면 이름 기준; 원기둥·원뿔 net은 대상 아님 → 명시적 거절 코드)와 `segments:[{"face":"side0","edge":2,"role":"REF"|"ACCENT"}]`(그 면의 순환 순서 edge번째 변을 굵게/빨강) 를 추가한다. 필요하면 corner 이름 기반 지정(`{"from":"B","to":"C"}`; 같은 두 이름이 전개도에 여러 변으로 나타나면 모호 → 거절)도 허용.
- 관측기는 plan에서 전개도 배치를 독립적으로 다시 계산해, 칠한 면의 다각형이 정확히 그 면과 일치하는지, 강조한 변이 정확히 그 변인지(다른 변이 강조되지 않았는지), 칠이 선·라벨 아래인지 최종 SVG에서 검사한다.

## E3. 입체의 꼭짓점·모서리 세기 번호
실제 문항: 24_매산중 2학기 중간 중1 q2 — 사각뿔대의 교점(꼭짓점) 수와 교선(모서리) 수를 세는 문항. 해설 그림은 꼭짓점마다 1, 2, …, 모서리마다 ①, ②, …처럼 **세는 순서 번호**를 붙여야 학생이 셀 수 있다(원문 그림에는 꼭짓점 이름이 없음 → `names`를 `"........"`처럼 `.`로 둔다).
- 입체 항목에 선택 필드 `count:{"vertices":true,"edges":true,"faces":false}`(faces는 지원하지 않으면 명시적 거절)를 추가한다. 꼭짓점 번호는 이름 자리처럼 꼭짓점 바깥쪽에, 모서리 번호는 원문자(①…⑳; 20개 초과는 거절) 작은 글자로 모서리 중점 옆에 놓되 숨은 모서리의 번호도 보이게 한다. 이름과 번호를 동시에 쓰면 겹치므로 `count.vertices`와 꼭짓점 이름은 함께 쓸 수 없다(거절 코드).
- 번호가 서로·선과 겹치면 기존 라벨 배치 규칙을 따르고, 자리가 없으면 `SOLID_LABELS_NO_ROOM`.
- 관측기는 plan에서 꼭짓점·모서리 목록을 독립적으로 다시 만들어, 번호가 1부터 빠짐없이 한 번씩 있는지, 각 번호가 자기 꼭짓점/모서리 중점에 가장 가까운지(다른 대상과 혼동 없음) 최종 SVG에서 검사한다.

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 "Engineering rules (hard)"와 "Other workers share this machine" 절을 따른다(Windows·D: 경로 이야기는 무시; 여기는 Linux). 관측기·테스트·허용오차를 약하게 만들지 않는다. 새 필드가 없을 때 기존 SVG는 바이트 동일해야 한다.
- 가이드 "3-입체" 절에 사용법·제약·오류 코드를 짧게 추가하고 `node archive/tools/geometry-equation/production/build-author-guide.mjs`로 `AUTHOR_GUIDE.md` 재생성. 다른 절은 건드리지 않는다.
- 테스트: `node --test archive/tools/geometry-equation/tests/solid-figure.test.mjs archive/tools/geometry-equation/tests/author-guide.test.mjs`(+ 추가한 테스트, 관련 python 테스트). 입체 정답지 회귀(바이트 동일): golden item22, 26, 42 — `render-plan.mjs --item <item.json> --plan ops/golden/itemNN/plan.json --out <dir>` 하나씩, 기존 SVG `/home/user/AP------/.tmp/svg-m1/golden-out/itemNN-solution.svg`와 sha256 비교(item.json은 `ops/golden.manifest.json`의 sourcePath·ordinal).
- 실제 문항: q15는 `/home/user/AP------/.tmp/svg-m1/runs/maesan-solid/q15/plan.json`, q2는 `.../q2/plan.json`을 복사해 새 필드로 다시 그려 ARCHIVE_BOUND 확인, `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`로 PNG를 만들어 한 번 본다. 결과는 `/home/user/AP------/.tmp/svg-m1/runs/e2e3/`에(plan.json, figure-solution.svg, figure.png). 실제 문항 렌더는 `{"sourcePath":"archive/exams/original/middle/m1/2mid/24_매산중_2학기_중간_중1_기출.js","ordinal":N}` item으로 워크트리 루트에서. 정답지 회귀 item에도 새 번호 하나(47 이후 빈 번호; 아래 보고) 추가: E2 또는 E3 실제 문항 plan을 `ops/golden/item47/plan.json`(E3면 item48)로 넣고 `ops/golden.manifest.json`에 항목 추가.

## 작업 환경
- 별도 git worktree(지금 디렉터리). 먼저 `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine` (`.tmp/archive`는 링크 금지). 렌더·테스트는 워크트리 루트에서, 하나씩.
- 커밋 2개(E2, E3 각각): `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. /home/user/AP------ 본 체크아웃은 건드리지 않는다.

## 완료 보고 (10줄 이내)
커밋 해시 2개, 새 필드·오류 코드, 테스트 결과, 정답지 22/26/42 바이트 동일 여부, q15·q2 재렌더 상태와 PNG 경로, 워크트리 경로·브랜치.
