# G2c: 이차곡선 3 — 접선 검증·외부 점에서의 접선, 원·타원을 conic에 넣고 곡선 2개 혼합 (엔진 확장)

너는 엔진 수정 작업자다. 기능 2개를 순서대로 구현·커밋한다. G2a(포물선, main 병합)·G2b(쌍곡선·점근선, 브랜치 claude/svg-g2b-hyperbola) 위에 이어 짓는다.

토큰을 아낀다: 큰 파일은 grep, 출력은 tail. PNG는 마지막 확인 때만.

## 환경 (Linux)
- `isolation: worktree`. 첫 동작: `git checkout -B claude/svg-g2c-tangent-mix claude/svg-g2b-hyperbola`, `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`
- `export GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python`
- 렌더: `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`(재렌더 전 out 삭제). PNG: `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`. 정답지: `WT=$PWD node /home/user/AP------/.tmp/svg-m1/golden-one.mjs <outDir> <번호들>`.
- 워크트리 밖 수정 금지(예외: `/home/user/AP------/.tmp/svg-m1/runs/g2c/`). `ops/svg-m1/BRIEF_RULES.md` §2의 8·9·10번 먼저.
- conic 구조 파악: G2a·G2b 지시서(`/home/user/AP------/.tmp/svg-m1/briefs/engine-g2a-parabola.md`, `engine-g2b-hyperbola.md`)와 `git log 391bb46b..HEAD --stat`, `P/conic_figure.py`, `P/conic_figure_observer.py`, ellipse-figure-v1.mjs conic 분기.

## 기존 규칙과 충돌 (정해 둠)
- 기존 `ellipse`/`ellipses` plan 경로(item43)는 그대로 둔다. 원·타원은 **conic 쪽에 kind로 새로** 넣는다(코드 공유는 하되 기존 경로 출력 바이트 불변).
- `conic`(단수)은 그대로 받고, 곡선 2개는 `conics:[{id:"c1",...},{id:"c2",...}]`(각 id 필수, 최대 2). `conic`과 `conics` 동시 사용·`ellipse`와 혼용은 `CONIC_PLAN_CONFLICT`. 곡선 하나만 쓰는 점·직선 필드는 곡선이 2개일 때 `curve:"c1"`로 어느 곡선인지 밝혀야 한다(없으면 `CONIC_CURVE_REQUIRED`).
- 같은 배율·눈금 없음 규칙 그대로. 원은 반드시 원으로 보여야 한다(같은 배율이 이미 보장).

## 기능 1: 접선 검증과 외부 점에서의 접선
- 필드: `lines:[{"id":"t","tangent":true,"at":"P"}]`(곡선 위 점 P에서의 접선 — 엔진이 계산), `lines:[{"id":"t","slope":"2","intercept":"-6","tangent":true}]`(주어진 직선이 접선이라는 주장 — 판별식으로 검증), 외부 점에서 `points:[{"id":"T1","kind":"TANGENT_FROM","from":"Q","which":1}]` + `lines:[{"id":"t1","through":["Q","T1"],"tangent":true}]`(접점 두 개 중 1·2, x 작은 쪽부터).
- 계산(SymPy): 포물선·쌍곡선·타원·원 모두 곡선식에 직선을 대입한 이차식의 판별식=0으로 접선 검증, 접점 x=−b/(2a). 점 P에서의 접선은 음함수 미분(gradient)으로 정확값. 외부 점 접선은 접점 (x,y)에 대해 {곡선식, gradient·(Q−P)=0}을 연립 solve. 근호 허용.
- 관측기: 선언된 모든 tangent 직선을 관측기가 자기 SymPy 코드로 판별식=0 재증명(`TANGENT_CLAIM_FALSE` 재사용/conic 분기), 접점이 선언 점과 일치(`TANGENCY_POINT_NOT_DECLARED` 재사용), TANGENT_FROM 점이 곡선 위·Q를 지나는 접선의 접점(`CONIC_TANGENT_FROM_MISMATCH`).
- 거절: 접선이 아님(판별식≠0) `CONIC_TANGENT_CLAIM_FALSE`, 외부 점이 곡선 안쪽·위(접선 0개/1개) `CONIC_TANGENT_FROM_INVALID`, which 범위 밖 `CONIC_INTERSECTION_INDEX_INVALID`.
- 커밋 1: `feat(svg-engine): 이차곡선 접선 검증과 외부 점에서의 접선 (G2c)`

## 기능 2: 원·타원 kind와 곡선 2개 혼합
- 필드: `{"kind":"CIRCLE","center":["0","0"],"rSquared":"25"}`, `{"kind":"ELLIPSE","center":["0","0"],"aSquared":"4","bSquared":"1","major":"X"|"Y"}` — conic/conics 어디서나. 곡선끼리 교점 `points:[{"id":"P","kind":"CONIC_CONIC","curves":["c1","c2"],"which":1..4}]`(x 오름차순, 같으면 y 오름차순).
- 계산: 원·타원 path 표본(닫힌 곡선, `data-curve`·`data-curve-id`), 초점 FOCUS(타원 side), 원은 `CENTER` 점 kind. 두 곡선 교점은 SymPy `solve`(두 이차식 연립; 실근만, 근호 허용, 4개 초과 불가). 창은 두 곡선의 꼭짓점·초점·선언 점 bbox.
- 관측기: 각 path 표본이 자기 곡선 식 만족, 원은 표본 반지름 일정(`CONIC_CIRCLE_NOT_ROUND`), CONIC_CONIC 점이 두 곡선 위(`CONIC_CONIC_INTERSECTION_MISMATCH`), 타원 정의 |PF|+|PF'|=2a(DEFINITION 분기).
- 거절: rSquared·aSquared≤0, 타원 a=b `CONIC_PARAMETER_INVALID`, 교점 없음·which 범위 밖 `CONIC_INTERSECTION_INDEX_INVALID`, conics 3개 이상 `CONIC_TOO_MANY_CURVES`.
- 커밋 2: `feat(svg-engine): 원·타원 conic과 두 곡선 혼합·곡선끼리 교점 (G2c)`

## 실제 문항 (최신 고등)
1. `archive/exams/original/high/h2/1mid/26_제일고_1학기_중간_고2_기하.js` #12 — G2b 산출물 `/home/user/AP------/.tmp/svg-m1/runs/g2b/26_제일고_1학기_중간_고2_기하-q12/plan.json`을 출발점으로, FF'이 지름인 원(중심 O, 반지름 5)을 conics로 더하고 원과 쌍곡선의 교점 P(CONIC_CONIC)로 바꾼다. caption의 "원은 그리지 않았다" 문구는 지운다.
2. `archive/exams/original/high/h2/2mid/26_금당고_2학기_중간_고2_기하.js` #13, 그림 `archive/assets/images/26_금당고_2학기_중간_고2_기하/q13.png` — 타원과 포물선 y²=4x가 P(3,−2√3)에서 만나고, P에서 두 곡선의 접선(at P). 접선 기울기 곱이 답(−2/9 등)이면 기울기 값은 쓰지 않는다.
- 확인용(게시 안 함): G2b의 매산고 q13 plan(`runs/g2b/26_매산고_1학기_중간_고2_기하-q13/plan.json`)의 접선을 `tangent:true`로 바꿔 판별식 검증이 통과하는지 — 새 정답지 하나로.
- answer를 먼저 확인하고 그림·alt·caption에 쓰지 않는다. 두 문항 모두 기존 해설 그림이 있다 → 기존 SVG를 PNG로 나란히 비교, 정답 노출 여부·better=NEW|OLD|TIE 한 줄.
- 결과: `/home/user/AP------/.tmp/svg-m1/runs/g2c/<시험이름>-q<N>/`에 plan.json, item.json, out/figure-solution.svg, figure.png, publish.json `{alt, caption, size}`.

## 완료 기준
- 테스트: ellipse-figure.test.mjs(렌더)·test_ellipse_figure.py(관측기 변조, 새 오류 코드마다). 루트에서 시작 전 기준 기록(NOT_RUN 금지)·끝 비교: `node --test --test-concurrency=1 archive/tools/geometry-equation/tests/ellipse-figure.test.mjs archive/tools/geometry-equation/tests/author-guide.test.mjs 2>&1 | tail -6`, `python3 -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_ellipse_figure.py' 2>&1 | tail -3`.
- 정답지(표본만): item43·90g2a·91g2a·92g2b·93g2b 시작·끝 렌더 바이트 비교(93g2b는 이번에 원을 넣어 바뀌는 게 맞다면 새 item으로 따로 만들고 93g2b는 그대로 둔다). 새 `item94g2c`(#12), `item95g2c`(#13), `item96g2c`(매산고 q13 tangent:true) + manifest(fam CONIC).
- 가이드 §3-45 conic에 CIRCLE·ELLIPSE kind·conics·CONIC_CONIC·tangent/TANGENT_FROM 한 줄씩, 재생성. hints.mjs 새 코드(작은따옴표 `\'`), import 확인. gaps.md G2 절에 "G2c 구현됨"과 남은 것.
- 두 문항 ARCHIVE_BOUND, PC·휴대폰 폭 확인. LF. 커밋 2개(+docs 1개 가능), 한국어 본문 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR 금지, 시험지 JS 수정 금지, 백그라운드 작업 남기지 않기. 막힌 기능은 이유와 시도를 적고 계속.

## 보고 (8줄 이내)
커밋 해시, 새 필드·오류 코드, 테스트 수(전/후), 정답지 SAME 수·새 항목, 문항별 status·PNG·기존 대비, 못 한 것과 이유.
