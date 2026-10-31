# G3: 평면벡터 — 벡터 이름 라벨, 벡터 표식(종점 점 처리·위치벡터 성분), 합·차·실수배 작도 (엔진 확장)

너는 엔진 수정 작업자다. 기능 3개를 순서대로 하나씩 구현·커밋한다. 메인이 읽기 전용 조사를 끝냈고, 아래 위치·설계는 그 조사에 근거한다(줄 번호는 grep으로 다시 확인).

토큰을 아낀다: 큰 파일은 grep으로 필요한 부분만, 출력은 tail로 짧게. PNG는 마지막 확인 때만 본다.

## 환경 (Linux 컨테이너)
- 너는 `isolation: worktree` 워크트리 안에서 시작한다. 첫 동작:
  `git fetch origin main && git checkout -B claude/svg-g3-vectors origin/main`
  `mkdir -p .tmp && ln -s /home/user/AP------/.tmp/apmath-visual-engine .tmp/apmath-visual-engine` (`.tmp/archive` 링크 금지)
- 이 워크트리 밖 수정 금지(예외: 산출물 `/home/user/AP------/.tmp/svg-m1/runs/g3/`). 남의 프로세스 종료 금지.
- `export GEOMETRY_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python`
- 렌더(하나씩): `node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out`(재렌더 전 `out/` 삭제). item.json = `{"sourcePath":"archive/exams/original/...js","ordinal":N}`. 결과 `out/figure-result.json`의 `status`.
- PNG: `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs in.svg out.png 520`
- 정답지 렌더: `WT=$PWD node /home/user/AP------/.tmp/svg-m1/golden-one.mjs <outDir> <번호들...>` (번호는 dir에서 `item`을 뺀 것).
- 규칙 정본: `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`(§3-1 L58 '두 점 사이 벡터… 지원하지 않는다', L288·L325 displaySegments arrow, L392 hiddenPointStyle). 지시서 규칙: `archive/tools/geometry-equation/ops/svg-m1/BRIEF_RULES.md` §2의 8·9번(필수 라벨 삭제 금지, 지시선 끌어내기 우선)을 먼저 읽는다.

## 이미 되는 것 (다시 만들지 않는다)
T=`archive/tools/geometry-equation/`, P=`T/production/`, E=`T/visual_engine/engine.py`.
- 선분 화살촉: `displaySegments[].arrow:"START"|"END"|"BOTH"` — 평면도형·좌표 작도 모두(phase2.mjs:874-881). E:722-731 채운 `<polygon>`(길이 10, 반폭 3.6, id `<seg>-arrow-end`, `data-mark="arrow"`, layer 62), 24px 이하 `MARK_SEGMENT_TOO_SHORT`. 관측기 plane-marks-observer-worker.py:1342-1362(SEGMENT_ARROW_MISSING·TIP_OFF_END·NOT_ALONG_SEGMENT), :391 declared.
- 계산 점: construction.py:12-24 SIGNATURES(MIDPOINT, DIVISION_POINT, POINT_REFLECTION, TRANSLATE_POINT 숫자, PERPENDICULAR_FOOT …). 원점 NORMALIZATION_ORIGIN.
- 선분 라벨: `planeMarks.expressionLabels[{ownerSegment,text,labelKind,labelAt}]`(plane-marks.mjs:389-407, 배치 label_layout.py:701-720·지시선 :841).

## 지금 못 하는 것
1. 벡터 이름 라벨: math_expression.py:20-30 Parser가 `\`가 있으면 `UNRESOLVED_EXPRESSION`, 토큰 정규식 :11에 `\` 없음. plane-marks.mjs:118 `TEXT_LABEL_MATH`, :271 `plainTextOk`도 `\`·`$`를 막는다. MathJax(typography.mjs:13-28)는 `\vec`·`\overrightarrow`를 렌더할 수 있으나 그 앞에서 막힌다.
2. 벡터 끝점: 점 dot(layer 70, E:701)이 화살촉(62) 위를 덮는다. 위치벡터의 성분(축으로 내린 점선) 전용 문법이 없다.
3. 두 벡터의 합·차·실수배: D=B+C−A 전용 연산이 없고(MIDPOINT+POINT_REFLECTION 조합만 추정 가능), 평행사변형 보조선·합벡터를 한 번에 그리는 문법이 없다. 실수배 점은 TRANSLATE_POINT가 숫자만 받는다.

## 기존 규칙과 충돌하는 곳 (연결 방법까지 정했다)
- **점 dot vs 화살촉:** 벡터의 **종점**이면서 다른 벡터의 시점이 아닌 점은 dot을 그리지 않는다(이름 라벨은 그대로). 이 규칙은 `planeMarks.vectors`(기능 2)를 쓴 plan에서만 작동 → 기존 그림 바이트 동일. 관측기는 "종점 dot 없음"을 plan에서 계산한 집합으로 확인.
- **SEGMENT callout(plane-callouts.mjs:210)은 arrow를 복제하지 않는다:** callout path가 벡터 선분을 포함하면 `CALLOUT_VECTOR_UNSUPPORTED`로 거절(조용히 화살촉 없는 복사본을 만들지 않는다).
- **MATH 라벨 파서 확장은 모든 그림 가족이 공유:** 새 토큰은 `vec(...)` 형식일 때만 작동해야 하며, 기존 라벨 문자열의 해석·직렬화 결과가 한 글자도 바뀌면 안 된다(정답지로 확인).
- **치수선 화살촉과 혼동 금지:** 벡터 화살촉은 기존 선분 arrow polygon(`data-mark="arrow"`)을 그대로 쓴다. 새 모양을 만들지 않는다.
- **정답 노출:** 합벡터의 종점이 문제의 다른 점(예: 정육각형 중심 O)과 겹쳐도, 라벨은 `vec(AB)+vec(AF)`처럼 **식으로만** 달고 "=AO" 같은 등식은 그림·alt·caption 어디에도 쓰지 않는다(그것이 답이면). 점 이름 O는 문제에 있는 이름이라 그대로 둔다.
- **필수 라벨 삭제 금지:** 벡터 이름·점 이름이 자리가 없으면 지시선 끌어내기를 먼저 쓴다.

## 기능별 설계

### 기능 1: 벡터 이름 라벨 `vec(...)`
- 필드: 라벨 text 문법 확장. `"text":"vec(a)"` → `\vec{a}`, `"text":"vec(AB)"`(대문자 2글자) → `\overrightarrow{AB}`. 식 안에서도: `"vec(a)+vec(b)"`, `"2vec(a)-vec(b)"`, `"(-3vec(a)+vec(b))/4"`. 쓰는 곳: `expressionLabels`, `textLabels`(MATH), 기능 2의 `vectors[].label`.
- 계산: math_expression.py 토큰에 `vec(` … `)` 추가, 노드 `VEC(name)`: name은 소문자 1글자 또는 대문자 점 이름 2개. serialize mode='tex'는 위 TeX, svg markup은 기존 MATH 경로(MathJax)로. plane-marks.mjs:118·:271의 정규식은 `vec(` 패턴만 추가 허용(`\`·`$` 직접 입력은 계속 금지).
- 관측기: 라벨 텍스트를 검사하는 기존 경로(라벨 data 속성·tex 대조)를 그대로 쓰되, 관측기가 plan text를 **자기 코드로** 다시 TeX로 바꿔 SVG의 라벨 tex와 대조(`VECTOR_LABEL_TEX_MISMATCH`). 대문자 이름 2개는 plan의 점 id에 있어야 함(`VECTOR_LABEL_UNKNOWN_POINT`).
- 거절: 빈 이름·3글자 이상·중첩 `vec(vec(a))`·숫자 → `VECTOR_LABEL_INVALID`.
- 커밋 1: `feat(svg-engine): 벡터 이름 라벨 vec(a)·vec(AB) (G3)`

### 기능 2: 벡터 표식 `planeMarks.vectors`
- 필드: `"vectors":[{"id":"va","from":"A","to":"B","label":"vec(a)","labelAt":0.5,"side":"LEFT","emphasis":"ACCENT","dashed":false}]` — 평면도형·좌표 작도 모두. 좌표 작도에서 추가로 `"components":true`(종점에서 x축·y축으로 점선 수선과 발 표시, 발에는 dot 없음; 문제에 성분 값이 있으면 `componentLabels:["3","2"]`).
- 계산: phase2에서 각 vector를 `{kind:'SEGMENT',arrow:'END'}` 객체 + expressionLabel(ownerSegment)로 펼친다(기존 경로 재사용). `from`→`to` 방향은 plan 점 좌표로 확인. 종점 dot 생략 규칙(위). components는 PERPENDICULAR_FOOT를 축 SOURCE_LINE에 내려 dashed 선분으로(기존 노드 재사용).
- 관측기: (1) 기존 SEGMENT_ARROW_* 검사가 vector 선분에 적용되는지(declared 집합에 포함), (2) 화살촉 팁이 `to` 점 위치 ±1px(`VECTOR_DIRECTION_MISMATCH`), (3) 종점 dot 생략 집합 대조(`VECTOR_TIP_DOT_PRESENT`), (4) components 점선 끝이 축 위·종점과 수직 ±0.5°(`VECTOR_COMPONENT_MISMATCH`), (5) 라벨 소유(기존 라벨 소유 검사).
- 거절: from=to·없는 점 `VECTOR_ENDPOINT_INVALID`, 같은 from/to 벡터 중복 `VECTOR_DUPLICATE`, components를 평면도형(축 없음)에서 `VECTOR_COMPONENTS_REQUIRE_AXES`, callout 충돌 `CALLOUT_VECTOR_UNSUPPORTED`, 짧은 벡터는 기존 `MARK_SEGMENT_TOO_SHORT`.
- 커밋 2: `feat(svg-engine): 벡터 표식 planeMarks.vectors와 위치벡터 성분 (G3)`

### 기능 3: 합·차·실수배 작도 `planeMarks.vectorOps`
- 필드: `"vectorOps":[{"id":"s1","op":"SUM","of":["va","vb"],"point":"D","label":"vec(a)+vec(b)","guides":"PARALLELOGRAM"}, {"id":"d1","op":"DIFF","of":["va","vb"],"label":"vec(a)-vec(b)"}, {"id":"k1","op":"SCALE","of":["va"],"k":"2","point":"P","label":"2vec(a)"}]`
  - SUM: 두 벡터의 시점이 같아야 한다(A→B, A→C). 엔진이 D=B+C−A를 계산해 점 D(이름은 `point`, 생략하면 이름 없는 숨은 점)를 만들고, `guides:"PARALLELOGRAM"`이면 B–D, C–D 점선, 합벡터 A→D 화살표(`emphasis` 기본 ACCENT). `guides:"TRIANGLE"`이면 두 번째 벡터를 첫 벡터 종점으로 평행이동한 점선 화살표 B→D와 합 A→D.
  - DIFF: 시점이 같은 두 벡터 a=A→B, b=A→C에서 a−b = C→B 화살표(종점 B).
  - SCALE: 시점 A에서 A+k(B−A) 점 P를 만들고 A→P 화살표. k는 유리수 문자열(`"2"`,`"-1/2"`).
- 계산: construction.py에 새 연산 `VECTOR_SUM_POINT(A,B,C)`=B+C−A, `VECTOR_SCALE_POINT(A,B,k)`=A+k(B−A)를 SIGNATURES에 추가하고 SymPy Rational로 정확히 계산(좌표 작도면 정확 좌표, 평면이면 모델 좌표). vectorOps는 phase2에서 이 노드와 SEGMENT 객체로 펼친다.
- 관측기: 최종 SVG의 점 위치에서 D를 B+C−A로 다시 계산해 ±1px(`VECTOR_SUM_POINT_MISMATCH`), 평행사변형 점선 두 변이 대변과 평행 0.5° 이내(`VECTOR_SUM_GUIDE_NOT_PARALLEL`), DIFF 화살표 시점·종점(`VECTOR_DIFF_MISMATCH`), SCALE 점이 A–B 직선 위이고 비가 k ±0.01(`VECTOR_SCALE_MISMATCH`). 라벨 tex는 기능 1 검사.
- 거절: SUM/DIFF 시점 다름 `VECTOR_OP_REQUIRES_COMMON_START`, 두 벡터 평행(평행사변형 퇴화) `VECTOR_SUM_DEGENERATE`, k=0·k 형식 오류 `VECTOR_SCALE_INVALID`, 없는 vector id `VECTOR_OP_UNKNOWN_VECTOR`.
- 커밋 3: `feat(svg-engine): 벡터 합·차·실수배 작도 planeMarks.vectorOps (G3)`

## 실제 문항 (최신 고등)
최신 기하 시험지(26_ 3개, 25_·24_ 없음)에는 벡터 그림 문항이 없다(조사). 그다음 최신인 23_매산고를 쓴다.
1. **기능 1·2** `archive/exams/original/high/h2/2mid/23_매산고_2학기_중간_고2_기하.js` #12, 문제 그림 `archive/assets/images/23_매산고_2학기_중간_고2_기하/q12.png` — 직사각형 ABCD(AB=2, AD=4)에서 a=AB, b=AC, c=AD, d=DB 화살표와 이름.
2. **기능 3** 같은 시험지 #5, 문제 그림 `.../q5.png` — 정육각형 ABCDEF와 중심 O에서 AB+AF를 평행사변형(SUM, guides PARALLELOGRAM)으로. 합벡터 라벨은 `vec(AB)+vec(AF)`만, 종점이 O인 것을 등식으로 쓰지 않는다.
3. (선택이 아니라 확인용으로 하나 더) `archive/exams/original/high/h2/2mid/15_강남여고_2학기_중간_고2_기하와벡터_기출.js` #10, 그림 `.../q10.png` — 삼각형 ABC, 중선 AM, AM의 중점 K, a=AB, b=AC와 BK 화살표(풀이 중간식 라벨은 가능하나 BK의 최종 표현이 답이면 쓰지 않는다).
- 각 문항의 정답(answer 필드)을 먼저 확인하고 그림·alt·caption에 쓰지 않는다. 기존 해설 그림: 문항 객체에 `solutionImage`로 시작하는 키가 하나라도 있으면 그 그림을 PNG로 만들어 나란히 비교(조사: 세 문항 모두 없음 — 직접 다시 확인).
- 결과: `/home/user/AP------/.tmp/svg-m1/runs/g3/<시험이름>-q<N>/`에 plan.json, item.json, out/figure-solution.svg, figure.png, publish.json `{alt, caption, size}`(최종 답·정답 번호·"옳은/옳지 않은" 판정 금지, 문제가 준 값·풀이 중간값 가능).

## 완료 기준
- 기능마다 테스트: node `tests/plane-marks.test.mjs`·`tests/coordinate-plane-marks.test.mjs`(실제 Chrome)에 렌더 테스트, python `tests/test_plane_marks.py`에 관측기 변조 테스트(새 오류 코드마다 SVG/plan을 틀리게 만들어 그 코드가 나는지), math_expression 단위 테스트(`vec` 파싱·직렬화, 기존 식 직렬화 불변).
- 관련 테스트만, **저장소 루트에서** 실행. 시작 전에 한 번 돌려 기준 실패 수를 기록하고(NOT_RUN 금지) 끝에 비교:
  `node --test --test-concurrency=1 archive/tools/geometry-equation/tests/{plane-marks,construction-traces,coordinate-plane-marks,plane-callout,plane-dimensions,plane-e32,plane-angle-labels,construction-spike,author-guide}.test.mjs 2>&1 | tail -12`
  `python3 -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_plane*.py' 2>&1 | tail -3` 와 `-p 'test_engine.py'`, math_expression 관련 테스트 파일(grep으로 찾기).
  기존 테스트를 바꿨으면 이유를 커밋 본문에. 관측기·테스트 약화 금지.
- **정답지 회귀(바이트 동일):** 시작하자마자 아래를 렌더해 `/home/user/AP------/.tmp/svg-m1/runs/g3/golden-before/`, 끝에 `golden-after/`, `*-solution.svg`를 `cmp`, `golden-diff.txt`에 `itemNN SAME|DIFF|FAIL`.
  대상(45개): `19 27 44 50 54 60 62 62e 62f 62g 62h 62i 70 70b 70c 70d 70e 70f 70g 70h 70i 70j 70k 70l 80 81 82 83 84g11a 85g11b 86g11c 01 02 03 05 06 12 17 35 31a 20 36 37 39 46`. 백그라운드로 돌리고 끝까지 기다린다(한 번 약 30분). math_expression을 고쳤으므로 그래프 계열은 검수자가 전체 회귀로 본다.
  새 정답지 `item87g3a`(#12), `item88g3b`(#5), `item89g3c`(#10 또는 좌표 위치벡터 성분 예시) + `ops/golden.manifest.json`(fam PLANE_MARKS 또는 COORD_GEOM). `golden-out`에는 쓰지 않는다.
- 가이드: `production/author-guide-body.md` §3-1 L58 문구(두 점 사이 벡터 미지원)를 새 기능 안내로 바꾸고, planeMarks 절에 vectors·vectorOps·`vec()` 라벨을 필드·예시 한 줄씩. `node archive/tools/geometry-equation/production/build-author-guide.mjs` 재생성. `ops/tools/hints.mjs`에 새 코드 안내. `ops/svg-m1/gaps.md` G3 절의 낡은 진술("선분에는 화살촉이 없고")을 고치고 끝에 "구현됨(G3)"과 남은 것.
- 문항 3개 `ARCHIVE_BOUND`, PNG를 직접 보고 학생이 PC·휴대폰 폭에서 읽을 수 있는지(화살촉이 점에 가리지 않는지, 벡터 이름이 어느 화살표 것인지 분명한지) 확인. 필수 라벨을 지우지 않았는지 점검.
- **모든 파일 LF.** 커밋 전 `git diff --stat origin/main | tail -3` 확인.
- 커밋: 기능별 3개 + (필요하면) `docs(svg-engine): ...` 1개, 한국어 본문 + 빈 줄 + `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. **push·PR·병합 금지. 시험지 JS 수정 금지.** 끝나면 백그라운드 작업을 남기지 않는다.
- 막힌 기능은 "한계"로 끝내지 않는다: 이유(엔진 구조/규칙 충돌/알고리즘)와 시도한 것을 적고 나머지를 계속한다. 세 기능 모두 이 묶음의 완료 조건이다.

## 보고 (8줄 이내)
브랜치·커밋 해시, 새 필드·오류 코드, 테스트 수(시작 전/후, 새로 추가), 정답지 SAME n/45(DIFF 목록), 문항별 status·PNG 경로, 못 한 것과 이유.
