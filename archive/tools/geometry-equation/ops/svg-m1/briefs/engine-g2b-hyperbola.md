# G2b: 이차곡선 2 — 쌍곡선(두 가지·초점·꼭짓점·주축)과 점근선 (엔진 확장)

너는 엔진 수정 작업자다. 기능 2개를 순서대로 구현·커밋한다. G2a(포물선, 브랜치 claude/svg-g2a-parabola)가 만든 conic 구조 위에 쌍곡선을 더한다. G2c(접선·혼합)가 이어 쓰므로 곡선 종류 분기를 한 곳씩 늘리는 G2a 구조를 따른다.

토큰을 아낀다: 큰 파일은 grep으로, 출력은 tail로. PNG는 마지막 확인 때만.

## 환경 (Linux)
- `isolation: worktree`. 첫 동작: `git checkout -B claude/svg-g2b-hyperbola claude/svg-g2a-parabola`(로컬 브랜치; G2a가 main에 병합되면 메인이 알려 준다 — 그때 `git rebase origin/main` 대신 `git merge origin/main`), `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`
- `export GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python`
- 렌더: `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`(재렌더 전 out 삭제). PNG: `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`. 정답지: `WT=$PWD node /home/user/AP------/.tmp/svg-m1/golden-one.mjs <outDir> <번호들>`.
- 워크트리 밖 수정 금지(예외: `/home/user/AP------/.tmp/svg-m1/runs/g2b/`). `ops/svg-m1/BRIEF_RULES.md` §2의 8·9·10번을 먼저 읽는다.
- 먼저 G2a 지시서 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g2a-parabola.md`와 G2a 커밋(`git log origin/main..HEAD --stat`)을 훑어 conic 구조(`P/conic_figure.py`, `P/conic_figure_observer.py`, ellipse-figure-v1.mjs의 conic 분기, lines의 role·x·y·through·label·dashed, 점 kind ON_CONIC·LINE_CONIC·FOOT)를 파악한다.

## 기능 1: 쌍곡선 곡선(두 가지)과 초점·꼭짓점·주축
- 필드: `"conic":{"kind":"HYPERBOLA","center":["0","0"],"aSquared":"12","bSquared":"12","transverse":"X"|"Y"}` → transverse X: `(x-h)^2/a²-(y-k)^2/b²=1`, Y: `(y-k)^2/a²-(x-h)^2/b²=1`. 점 kind `FOCUS{side:1|-1}`, `VERTEX{side:1|-1}`, `ON_CONIC{x 또는 y, branch:"POS"|"NEG"(가지: transverse 축 방향 부호), sign:"POS"|"NEG"(다른 좌표 부호)}`, `ORIGIN`. 주축(꼭짓점 사이 선분)은 기존 segments로.
- 계산: c²=a²+b²(SymPy Rational, 근호 허용). 창은 꼭짓점·초점·선언 점·교점·발의 bbox + 여백. 두 가지를 각각 창 안 표본 path(`data-curve="HYPERBOLA"`, `data-branch="POS|NEG"`)로; 매개는 transverse 축 반대 좌표(t) 또는 cosh/sinh — 창 경계에서 자른다. 상한 초과는 기존 TOO_LARGE.
- 관측기: 두 path 표본 모두 식 만족(`CONIC_CURVE_OFF_EQUATION` 재사용), 가지 수 2(`CONIC_HYPERBOLA_BRANCH_MISSING`), FOCUS·VERTEX 위치, 선언 ON_CONIC 점마다 **정의 검사** ||PF|−|PF'||=2a(기존 `CONIC_DEFINITION_MISMATCH` 분기).
- 거절: a²·b² ≤0 `CONIC_PARAMETER_INVALID`, ON_CONIC 해 없음 `CONIC_POINT_NOT_ON_CURVE`, 쌍곡선에서 role DIRECTRIX는 이번 범위 밖이면 기존 `CONIC_DIRECTRIX_REQUIRES_PARABOLA` 유지.
- 커밋 1: `feat(svg-engine): 쌍곡선 두 가지와 초점·꼭짓점 (G2b)`

## 기능 2: 점근선과 일반 직선·교점의 쌍곡선 지원
- 필드: `lines:[{"id":"s1","role":"ASYMPTOTE","sign":1,"dashed":true,"label":"y=x"}]`(sign ±1: y−k=±(b/a)(x−h), transverse Y면 ±(a/b)). 생략하면 그리지 않음. 라벨은 G2a 직선 이름 라벨 규칙(짧은 이름·MATH, 자리 없으면 leader).
- LINE_CONIC(직선과 쌍곡선 교점, which 1|2)·FOOT·through 직선을 쌍곡선에서도 동작하게(SymPy solve; 점근선과 평행한 직선은 교점 1개 — which 2는 `CONIC_INTERSECTION_INDEX_INVALID`). **두 직선의 교점** kind `LINE_LINE{lines:["k1","s1"]}`도 추가(점근선과 접선이 만드는 삼각형용, 평행이면 `CONIC_LINES_PARALLEL`).
- 계산: 점근선 기울기는 plan에서 정확값. 창 경계 클립은 기존 clipLine. 다각형 색칠(polygons)은 기존 그대로 쓰되 꼭짓점에 LINE_LINE 점 허용.
- 관측기: 점근선 선이 식과 일치(`CONIC_ASYMPTOTE_MISMATCH`, 기울기 0.3° 이내·중심 통과), 점선 스타일, LINE_LINE 점이 두 직선 위(`CONIC_LINE_LINE_MISMATCH`), 쌍곡선 교점 검사는 G2a 검사 분기 확장.
- 거절: ASYMPTOTE를 쌍곡선 아닌 곳에 `CONIC_ASYMPTOTE_REQUIRES_HYPERBOLA`, sign 오류 `CONIC_PARAMETER_INVALID`.
- 커밋 2: `feat(svg-engine): 쌍곡선 점근선과 직선 교점 (G2b)`

## 실제 문항 (최신 고등)
1. `archive/exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js` #13, 그림 `archive/assets/images/26_매산고_1학기_중간_고2_기하/q13.png` — 쌍곡선 x²−y²=12, 점 (4,2)를 지나는 직선(문제 조건 — 접선이면 접선 검증은 G2c이므로 이번엔 `through` 두 점 직선으로 그리고 "접선"이라는 주장은 caption에만 문제 문장 그대로), 점근선 y=±x, 세 교점으로 이루어진 삼각형 색칠.
2. `archive/exams/original/high/h2/1mid/26_제일고_1학기_중간_고2_기하.js` #12, 그림 `.../q12.png` — 초점 F(5,0)·F'(−5,0)인 쌍곡선, FF'이 지름인 원 위의 점 P, 삼각형 PF'F. 원은 G2c 범위다 → 이번엔 원 없이 쌍곡선·초점·P·삼각형을 그리고, 원이 꼭 필요하면 "G2c 대기"로 보고한다(라벨·도형을 지워 통과시키지 않는다).
- answer를 먼저 확인하고 그림·alt·caption에 쓰지 않는다(#13 넓이 등). 두 문항 모두 기존 해설 그림이 있다 → 기존 SVG를 PNG로 만들어 나란히 비교, 정답 노출 여부와 better=NEW|OLD|TIE 한 줄.
- 결과: `/home/user/AP------/.tmp/svg-m1/runs/g2b/<시험이름>-q<N>/`에 plan.json, item.json, out/figure-solution.svg, figure.png, publish.json `{alt, caption, size}`.

## 완료 기준
- 테스트: `tests/ellipse-figure.test.mjs`(렌더, 실제 Chrome)·`tests/test_ellipse_figure.py` 또는 G2a가 만든 conic 테스트 파일에 추가, 새 오류 코드마다 변조 테스트. 저장소 루트에서 시작 전 기준 기록(NOT_RUN 금지)·끝 비교:
  `node --test --test-concurrency=1 archive/tools/geometry-equation/tests/ellipse-figure.test.mjs archive/tools/geometry-equation/tests/author-guide.test.mjs 2>&1 | tail -6`, `python3 -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_*conic*.py' 2>&1 | tail -3`와 `-p 'test_ellipse_figure.py'`.
- 정답지(표본만): item43·item90g2a·item91g2a를 시작 시·끝에 렌더해 바이트 비교. 새 `item92g2b`(#13), `item93g2b`(#12) + manifest(fam CONIC).
- 가이드 §3-45 conic에 HYPERBOLA·ASYMPTOTE·LINE_LINE 한 줄씩, 재생성. hints.mjs 새 코드(작은따옴표 `\'`), 끝에 `node -e "import('./archive/tools/geometry-equation/ops/tools/hints.mjs').then(()=>console.log('ok'))"`. gaps.md G2 절에 "G2b 구현됨"과 남은 것.
- 두 문항 ARCHIVE_BOUND, PNG를 PC·휴대폰 폭으로 확인. LF. 커밋 2개(+docs 1개 가능), 한국어 본문 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR 금지, 시험지 JS 수정 금지, 백그라운드 작업 남기지 않기. 막힌 기능은 이유와 시도를 적고 계속.

## 보고 (8줄 이내)
커밋 해시, 새 필드·오류 코드, 테스트 수(전/후), 정답지 3개 SAME 여부·새 항목, 문항별 status·PNG·기존 대비, 못 한 것과 이유(G2c로 넘길 것 포함).
