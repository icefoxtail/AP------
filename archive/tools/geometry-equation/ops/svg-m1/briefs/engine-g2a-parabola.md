# G2a: 이차곡선 1 — 포물선(초점·준선·꼭짓점), 곡선 위 점·직선과의 교점·수선의 발 (엔진 확장)

너는 엔진 수정 작업자다. 기능 2개를 순서대로 구현·커밋한다. 메인이 읽기 전용 조사를 끝냈고 아래 위치·설계는 그 조사에 근거한다(줄 번호는 grep으로 확인). G2는 G2a(포물선)·G2b(쌍곡선·점근선)·G2c(접선·혼합)로 나눴고 이 묶음은 G2a다. G2b·G2c가 같은 구조를 이어 쓰므로 곡선 종류를 늘리기 쉬운 형태로 짠다.

토큰을 아낀다: 큰 파일은 grep으로 필요한 부분만, 출력은 tail로. PNG는 마지막 확인 때만.

## 환경 (Linux 컨테이너)
- `isolation: worktree` 워크트리에서 시작. 첫 동작: `git fetch origin main && git checkout -B claude/svg-g2a-parabola origin/main`, `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine`
- `export GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python`
- 렌더(하나씩): `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`(재렌더 전 out 삭제). PNG: `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`. 정답지: `WT=$PWD node /home/user/AP------/.tmp/svg-m1/golden-one.mjs <outDir> <번호들>`.
- 워크트리 밖 수정 금지(예외: 산출물 `/home/user/AP------/.tmp/svg-m1/runs/g2a/`). `ops/svg-m1/BRIEF_RULES.md` §2의 8·9·10번을 먼저 읽는다(필수 라벨 삭제 금지, 지시선 끌어내기 우선, 정답지는 표본만).

## 지금 구조 (P=`archive/tools/geometry-equation/production/`)
- ellipse-figure-v1: `P/ellipse-figure-v1.mjs`(검증·배치·SVG), `P/ellipse_figure.py`(SymPy 정확값), `P/ellipse_figure_observer.py`(독립 관측기), 디스패치 `P/render-plan.mjs:25,151`(stage 'ellipse'). 테스트 `tests/ellipse-figure.test.mjs`, `tests/test_ellipse_figure.py`. 가이드 §3-45(AUTHOR_GUIDE.md ~874-922).
- plan: `ellipse{center,semiAxisSquared{major,minor},majorAxis}`/`ellipses[2]`, `points`(FOCUS·VERTEX·ON_ELLIPSE·OPPOSITE·ORIGIN·POINT, id `/^[A-Z][0-9']?$/`, 최대 10), `segments{id,from,to,label?,dashed?}`, `polygons`, `lines{slope,intercept,tangent?}`(label은 ELLIPSE_LINE_LABEL_UNSUPPORTED), caption 등.
- 배치: layoutOf 단일 배율(bbox+0.75단위, MAX_SCALE 40, MIN 8, 상한 460×360px, 초과 ELLIPSE_FIGURE_TOO_LARGE), 축·화살촉만(눈금·좌표 띠 없음), 곡선은 `<ellipse>`, 직선 clipLine(기울기·절편만, 세로선 불가), placeLabels(곡선 표본 720점·선분 장애물, leader 폴백).
- 관측기는 plan만 보고 SymPy로 다시 계산하고 최종 SVG를 읽어 대조한다(POINT_MOVED, LINE_OFF_EQUATION, TANGENT_CLAIM_FALSE …).
- 정답지: 이 capability를 쓰는 것은 **item43 하나**(fam CONIC).

## 설계 원칙 (정해 둠)
- capability 이름은 **ellipse-figure-v1 그대로** 두고 plan 루트에 `conic` 필드를 새로 받는다(item43과 기존 `ellipse` plan은 코드 경로가 한 글자도 바뀌지 않게 → 바이트 동일). `ellipse`와 `conic`을 한 plan에 같이 쓰면 `CONIC_PLAN_CONFLICT`(혼합은 G2c에서).
- 곡선은 `<ellipse>` 대신 `<path>`(창 안 표본, `data-curve="PARABOLA"`)로 그린다 — 포물선만.
- 같은 배율·눈금 없음·좌표 띠 없음 규칙은 기존 ellipse와 같다(충돌 없음). 원점 O가 꼭짓점과 같으면 이름 하나만(같은 자리 점 이름 중복 금지 — 꼭짓점을 `ORIGIN`으로 선언하면 VERTEX 라벨을 따로 달지 않는다).

## 기능 1: 포물선 곡선과 초점·준선·꼭짓점, 세로선, 직선 이름 라벨
- 필드: `"conic":{"kind":"PARABOLA","vertex":["0","0"],"p":"1","axis":"X"}` → 식 `(y-k)^2=4p(x-h)`(axis X, 좌우로 열림, p<0이면 왼쪽), axis Y면 `(x-h)^2=4p(y-k)`. 점 kind `FOCUS`(side 없음), `VERTEX`. 준선은 `lines:[{"id":"l","role":"DIRECTRIX","label":"l","dashed":false}]`. 일반 세로선 `lines:[{"id":"m","x":"3"}]`. 직선 이름 라벨 `label`은 짧은 이름(`l`, `m`, `x=-1` 꼴 MATH, 40자 이내)만 허용 — conic plan에서만 ELLIPSE_LINE_LABEL_UNSUPPORTED를 풀고 기존 ellipse plan은 그대로 거절.
- 계산(ellipse_figure.py에 conic 분기): SymPy Rational로 초점 (h+p,k)/(h,k+p), 준선 x=h−p / y=k−p. 창(window)은 꼭짓점·초점·선언 점·준선 위 발·교점의 bbox + 여백(기존 0.75단위 규칙)으로 잡고, 곡선 표본은 그 창 안에서만(axis X면 y를 매개로 −Y..Y, 창 밖 부분은 자름). 창이 상한을 넘으면 기존 TOO_LARGE 코드.
- 렌더: path 표본(기존 ellipseSamples 대신 conic 표본 함수), 준선은 clipLine에 세로선(x=a)·가로선 분기 추가(기존 slope 직선 경로는 그대로), 직선 라벨은 placeLabels에 직선을 소유자로 넣고 자리 없으면 leader.
- 관측기(ellipse_figure_observer.py conic 분기): plan에서 초점·준선을 자기 코드로 다시 계산. 최종 SVG path의 모든 표본 점(px→모델 역변환)이 식을 만족(허용 0.6px 상당, `CONIC_CURVE_OFF_EQUATION`), FOCUS·VERTEX 점 위치(기존 POINT_MOVED), 준선 선이 x=h−p(또는 y)와 일치(`CONIC_DIRECTRIX_MISMATCH`), 세로선 위치(LINE_OFF_EQUATION 세로 분기), 직선 라벨 글자·소유(`CONIC_LINE_LABEL_MISMATCH`).
- 거절: p=0·형식 오류 `CONIC_PARAMETER_INVALID`, 알 수 없는 kind `CONIC_KIND_UNSUPPORTED`(G2b 전까지 HYPERBOLA 포함), ellipse+conic `CONIC_PLAN_CONFLICT`, role DIRECTRIX를 포물선 아닌 곳에서 `CONIC_DIRECTRIX_REQUIRES_PARABOLA`.
- 커밋 1: `feat(svg-engine): 포물선 곡선과 초점·준선·세로선, 직선 이름 라벨 (G2a)`

## 기능 2: 곡선 위 점, 직선과 곡선의 교점, 수선의 발
- 필드(points에 추가):
  - `{"id":"A","kind":"ON_CONIC","y":"2"}` 또는 `"x":"1"`+`"branch":"POS"|"NEG"`(axis X 포물선에서 x를 주면 y=±… 중 하나).
  - `{"id":"A","kind":"LINE_CONIC","line":"k1","which":1|2}` — 직선 k1(기울기·절편 또는 두 점 `through:["F","P"]`)과 포물선의 교점 중 x가 작은 쪽 1, 큰 쪽 2(세로선이면 y 기준). lines에 `{"id":"k1","through":["F","P"]}`(두 점 지나는 직선) 추가.
  - `{"id":"M","kind":"FOOT","from":"A","onto":"l"}` — A에서 직선 l(준선 포함)에 내린 수선의 발. `rightAngle:true`면 직각 표시.
- 계산: SymPy `solve`로 교점 정확값(근호 허용), 실근 없음·중근은 거절/표시. FOOT는 직선 사영 공식(정확값).
- 관측기: ON_CONIC·LINE_CONIC 점이 식 위(`CONIC_POINT_OFF_CURVE`)이고 LINE_CONIC은 직선 위·which 순서 맞음(`CONIC_INTERSECTION_MISMATCH`), FOOT은 직선 위·AM⊥l(0.5° 이내, `CONIC_FOOT_MISMATCH`), 직각 표시 위치. **정의 검사:** 포물선 위 선언 점 P마다 |PF|=P에서 준선까지 거리(모델 단위 1e-6, `CONIC_DEFINITION_MISMATCH`) — 관측기 자기 계산.
- 거절: 교점 없음 `CONIC_LINE_NO_INTERSECTION`, which가 하나뿐인 교점(접선)에서 2 `CONIC_INTERSECTION_INDEX_INVALID`, FOOT 대상 직선 없음 `CONIC_FOOT_INVALID`, ON_CONIC 해 없음 `CONIC_POINT_NOT_ON_CURVE`.
- 커밋 2: `feat(svg-engine): 포물선 위 점·직선과의 교점·수선의 발 (G2a)`

## 실제 문항 (최신 고등)
1. `archive/exams/original/high/h2/1mid/26_제일고_1학기_중간_고2_기하.js` #2, 문제 그림 `archive/assets/images/26_제일고_1학기_중간_고2_기하/q2.png` — 포물선과 준선 l, 초점 F를 지나는 직선과의 교점 A·B, A·B에서 준선에 내린 수선의 발 M·N, AM=5·BN=3(문제가 준 값). AF=AM, BF=BN이 보이게(길이 라벨 또는 같은 길이 표식).
2. `archive/exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js` #15, 그림 `.../26_매산고_1학기_중간_고2_기하/q15.png` — y²=4px, 준선 수선의 발 B, BF와 포물선의 교점 C.
- 각 문항의 answer를 먼저 확인하고 그림·alt·caption에 쓰지 않는다. 문자 계수(p 등)는 원문이 문자면 대표값으로 그리되 라벨은 문자 이름만, caption에 "한 예"임을 밝힌다(HANDOFF §7 문자 계수 교훈).
- **두 문항 모두 기존 해설 그림이 있다**(solutionImage 키). 기존 SVG를 PNG로 만들어 새 그림과 나란히 보고 정답 노출 여부와 better=NEW|OLD|TIE를 한 줄로 적는다(교체 여부는 메인이 정함).
- 결과: `/home/user/AP------/.tmp/svg-m1/runs/g2a/<시험이름>-q<N>/`에 plan.json, item.json, out/figure-solution.svg, figure.png, publish.json `{alt, caption, size}`.

## 완료 기준
- 테스트: `tests/ellipse-figure.test.mjs`에 포물선 렌더 테스트(실제 Chrome), `tests/test_ellipse_figure.py`에 관측기 변조 테스트(새 오류 코드마다). 저장소 루트에서 시작 전 한 번 기준 기록(NOT_RUN 금지), 끝에 비교:
  `node --test --test-concurrency=1 archive/tools/geometry-equation/tests/ellipse-figure.test.mjs archive/tools/geometry-equation/tests/author-guide.test.mjs 2>&1 | tail -8`
  `python3 -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_ellipse_figure.py' 2>&1 | tail -3`
  기존 테스트를 바꿨으면 이유를 커밋 본문에. 관측기·테스트 약화 금지.
- 정답지(표본, 규칙 10): 시작 시 item43을 렌더해 `runs/g2a/golden-before/`, 끝에 다시 렌더해 바이트 비교. 새 `item90g2a`(#2), `item91g2a`(#15) + manifest(fam CONIC). 전체 회귀 금지.
- 가이드: author-guide-body.md §3-45에 conic(PARABOLA) 필드·점 kind·lines 확장을 짧게(예시 한 줄씩), "쌍곡선·포물선은 지원 범위가 아니다" 문구를 "쌍곡선은 G2b 예정"으로. build-author-guide.mjs 재생성. hints.mjs에 새 코드(작은따옴표는 `\'` 이스케이프 — main에서 한 번 문법 오류가 났다; 끝에 `node -e "import('./archive/tools/geometry-equation/ops/tools/hints.mjs')"`로 확인). gaps.md G2 절 끝에 "G2a 구현됨"과 남은 것.
- 두 문항 ARCHIVE_BOUND, PNG를 PC·휴대폰 폭으로 보고 학생이 읽을 수 있는지 확인. LF. `git diff --stat origin/main | tail -3` 확인.
- 커밋 2개(+필요하면 docs 1개), 한국어 본문 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. push·PR 금지, 시험지 JS 수정 금지, 백그라운드 작업 남기지 않기. 막힌 기능은 이유와 시도를 적고 계속(두 기능 모두 완료 조건).

## 보고 (8줄 이내)
브랜치·커밋 해시, 새 필드·오류 코드, 테스트 수(전/후), item43 SAME 여부와 새 정답지 상태, 문항별 status·PNG 경로·기존 대비 판단, 못 한 것과 이유.
