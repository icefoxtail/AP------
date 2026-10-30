# 엔진 확장 E4·E5·E6: 입체 (solid-figure-v1 / composite-panels-v1)

코드: `production/solid-figure-v1.mjs`, `solid_figure_observer.py`(+worker), `production/composite-candidate-svg-v1.mjs`·`render-plan.mjs`의 합성 경로, 테스트 `tests/solid-figure.test.mjs`·`tests/plane-panels.test.mjs`·`tests/composite-header.test.mjs`, python 관측기 테스트, 가이드 3-입체·3-16절. (E2 전개도 강조·E3 세기 번호는 이미 병합됨 — 그 위에서 작업.)

## E4. 평면으로 잘라 낸 입체 (실제: 26_신흥중 2학기 중간 중1 q8)
정육면체(직육면체)를 모서리 중점들을 지나는 평면으로 잘라 꼭짓점 부분을 떼어 낸 입체(모서리 강조 포함). `solids[].cuts:[{"through":[[edge,"1/2"],...]}]`(모서리와 그 위 비율 점 3개 이상으로 정한 평면) 같은 최소 표현으로, 잘린 뒤 남는 다면체를 엔진이 정확히 계산해 그리고(숨은선 점선 규칙 유지), 새로 생긴 꼭짓점 이름·모서리 강조(`segments` role)를 쓸 수 있게 한다. 관측기는 plan에서 절단 다면체를 독립 계산해 최종 SVG의 모서리 조각·실선/점선을 검사한다. 지원 범위(볼록 다면체를 평면 1~2개로 자르기)를 정하고 그 밖은 명시적 거절.
문항 원문: packet `/home/user/AP------/.tmp/svg-m1/packets/26_신흥중_2학기_중간_중1_기출.json` ord 8 (questionImage), item `{"sourcePath":"archive/exams/original/middle/m1/2mid/26_신흥중_2학기_중간_중1_기출.js","ordinal":8}`.

## E5. 합성 그림에 입체·전개도 패널 (실제: 25_풍덕중 2학기 중간 중1 q1·q7·q8)
`composite-panels-v1`이 지금 평면 패널(2~5) 또는 그래프 STACK만 받는다. `solid-figure-v1` 패널(입체 또는 전개도)을 2~4개 넣을 수 있게 하고, 입체 패널과 PLANE_FIGURE_v1 패널을 섞을 수 있게 한다(배치 규칙·폭 상한·캡션 규칙은 3-16과 같게). 각 패널은 자기 관측기를 그대로 통과해야 한다.
- 26_팔마중 2학기 중간 중1 q8(육각기둥, BH와 만나는 4개·평행 5개·꼬인 8개 모서리 — 지금 solid `segments` 8개 상한에 막힘): 같은 입체 세 패널로 그룹별 강조. 기존 plan `/home/user/AP------/.tmp/svg-m1/runs/26_팔마중-plane3/q8/plan.json`, packet `/home/user/AP------/.tmp/svg-m1/packets/26_팔마중_2학기_중간_중1_기출.json`.
- q1: 사각뿔 + 오각형(평면) 두 패널. q7: 같은 직육면체 세 패널(BC와 평행/만나는/꼬인 모서리 그룹). q8: 전개도 패널 + 접은 직육면체 패널.
기존 plan: `/home/user/AP------/.tmp/svg-m1/runs/25_풍덕중-solid1/q1|q7|q8/plan.json`. packet `/home/user/AP------/.tmp/svg-m1/packets/25_풍덕중_2학기_중간_중1_기출.json`.

## E6. 입체 표기 보강 (실제: 25_풍덕중 q8)
- 한 꼭짓점에 여러 이름(접었을 때 겹치는 전개도 꼭짓점: M=A=I 등): `names`에서 한 꼭짓점 라벨을 `"M,A,I"`처럼 여러 글자로 쓸 수 있게(라벨 배치·관측기 대조 포함).
- 전개도 면 대각선(NL 같은 면 위 선분) 강조: E2의 `net.segments`가 면의 변만 받으면 `{"face":"side1","diagonal":[0,2],"role":...}` 같은 대각선 지정 추가.
- solid/stat plan의 `sourceQuote` 키: 가이드 7절은 넣으라고 하는데 solid-figure-v1은 거절한다. solid-figure-v1이 `sourceQuote`(문자열)를 메타데이터로 받아들이게 한다(그림에는 영향 없음).

## 공통
- `/home/user/AP------/archive/tools/geometry-equation/ops/workers/common-engine-rules.md`의 hard 규칙·공유 머신 규칙(Windows·D: 경로 무시). 관측기·테스트 약화 금지, 새 거절 코드 명시, 새 필드 없으면 기존 SVG 바이트 동일.
- 가이드 3-입체·3-16절에 짧게 추가, build-author-guide.mjs로 재생성. 다른 절은 건드리지 않는다.
- 테스트: 위 테스트 + 추가 테스트(python은 `python3 -m unittest`), main 기준 결과 먼저 기록해 비교. 정답지 회귀(바이트 동일): golden item22, 26, 36, 37, 42, 47, 48 — 하나씩, 기존 SVG는 `/home/user/AP------/.tmp/svg-m1/golden-out/itemNN-solution.svg`(item47·48은 `/home/user/AP------/.tmp/svg-m1/runs/golden4748/o47|o48/figure-solution.svg`).
- 실제 문항 5개(26_신흥중 q8, 25_풍덕중 q1·q7·q8, 26_팔마중 q8)를 새 기능으로 그려 ARCHIVE_BOUND, PNG 확인. 결과(plan.json, figure-solution.svg, figure.png, publish.json {alt,caption,size})는 `/home/user/AP------/.tmp/svg-m1/runs/e456/<exam>-q<N>/`. 정답지에 E4 문항을 `ops/golden/item52/plan.json`으로 추가(+manifest).
- 별도 git worktree(지금 디렉터리, E1~E3 포함). `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`(`.tmp/archive` 링크 금지). 렌더·테스트는 하나씩. 커밋은 기능별: `feat(svg-engine): ...` + 짧은 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR·병합 금지. 엔진 폴더 밖·시험지 JS 수정 금지. 본 체크아웃은 건드리지 않는다.

## 완료 보고 (12줄 이내)
커밋 해시들, 새 필드·오류 코드, 테스트 결과, 정답지 바이트 동일 여부, 실제 문항 4개 상태와 PNG 경로, 구현 못 한 부분과 이유, 워크트리 경로·브랜치.
