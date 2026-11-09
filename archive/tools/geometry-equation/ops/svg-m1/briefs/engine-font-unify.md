# EXT-20261109-b 최우선: SVG 글꼴 통일(수식으로 읽히는 글자는 모두 수식 글꼴)

사용자 지시(2026-11-09): 축 이름 g(y)·y가 가는 일반 글꼴이고 눈금·좌표·곡선 이름은 수식 글꼴이라 다르게 보인다. 수식으로 읽히는 글자는 모두 같은 수식 글꼴, 한글 설명만 한글 글꼴.

## 규칙
- 한글이 없고 수식 파서(`visual_engine/math_expression.py`)가 읽는 글자 = MATH(수식 글꼴). 한글(또는 ㉠·①·ㅁ 같은 한글 호환 자모·동그라미 숫자)이 하나라도 있으면 TEXT(한글 글꼴).
- 글꼴은 `production/typography.mjs` typeset 종류(MATH/TEXT)로 정해진다: 라벨에 `math:true`(+`tex`)면 MATH. 글꼴을 고치는 곳은 라벨을 만드는 쪽이다(`visual_engine/engine.py`, 틀 `graph_framing.py`, `phase2.mjs`).

## 전수 조사: 해설 그림 SVG 2,707개(`archive/assets/images/**/*solution*.svg`, `data-fragment-sha` 조각 기준) — 한글 없는 TEXT 조각
`.tmp/ext/survey2.cjs`가 조각 id·data-text로 센 결과(id 숫자는 #). MATH 조각은 수식 글꼴이라 제외.

| label kind | 조각 id | 한글 없는 TEXT 예 | 원인 코드 위치 | 이번 처리 |
|---|---|---|---|---|
| GRAPH_ANNOTATION | `axis-x`/`axis-y`(축 이름 `axisTitles`) 98개 | y(km), x (cm), v(m/s), g(y), f(x)/4 | `visual_engine/engine.py` 축 이름 라벨 `math:False,bindText:True` | **고침**: 한글 없고 `[A-Za-z0-9 ()/.,-]`이면 MATH(`axis_title_tex`, 괄호 속 단위는 곧은 글자). 관측기 `axis_titles_audit`도 같은 규칙으로 수식 글리프 대조 |
| EQUATION_LABEL | `overlay-name-*`(곡선 이름 `overlays.names`) 12개 | v(t), f(x), h | 틀 `graph_framing.py` `_overlay_names` 기본 `labelKind:'TEXT'` | **고침**: curveX 이름이 한글 없는 `[A-Za-z0-9 ()]`이면 기본 MATH(관측기 `labelKind` 기본값 같이 바꿈). 한글 이름은 TEXT |
| EQUATION_LABEL | `overlay-callout-*`(지시선 글자) 14개 | (1,0), (-1,-2), (0,2) 좌표쌍 | 틀·관측기 callout 기본 종류가 쉼표 또는 αβγθ′√가 있으면 TEXT | **고침**: 쉼표는 이제 MATH 기본(좌표쌍). αβγθ′√가 있으면 TEXT 그대로(아래 남은 것) |
| EQUATION_LABEL | `overlay-callout-*` | u=√3, y=√(x-2), γ | 같은 이유(√·그리스 문자) | 남음: 수식 글리프(√는 근호 모양, 그리스는 이탤릭 코드)가 관측기 글리프 대조와 달라 별도 묶음 필요 |
| COORDINATE_LABEL | `x-title`/`y-title`·`node-*`·`column-name-*`·`legend-*`·`element-*`·`class-sum-*`·`vessel-name-*` 약 90개 | x+2, y, g(0), f(x), A 1, B 2, ∅, 0.60, ? | 평면·대응도·통계·집합 패널 각자의 typeset(`composite-candidate-svg-v1.mjs`, `number-line-v1.mjs`, `set-diagram-v1.mjs`, `stat-chart-v1.mjs` 등) | 남음(그래프 밖 패밀리): 패널·차트 라벨 종류마다 관측기가 `data-text`를 읽어 함께 바꿔야 함 |
| EQUATION_LABEL | `r#-label`·`t#`·`l#`·`arc#-label`·`th#_#`·`d#-label` 등 평면도형 `planeMarks` 라벨 약 130개 | △ABC=75cm², 10cm, 4k=160°, ㉠, ①, 8.5, AO:OB=2:3 | `engine.py` `mark_label`(`label_kind` TEXT/NAME 등) | 남음: 단위·도형 기호(△□∠)·한글 자모·동그라미 숫자가 섞여 규칙을 따로 정해야 함 |
| TICK_LABEL / POINT_NAME / LENGTH_LABEL / 나머지 COORDINATE_LABEL | — | — | 이미 전부 MATH(눈금 1,833·점 이름 4,946·좌표 5,497·길이 118) | 변경 없음 |

한글이 섞인 축 이름(`x(분)`, `시간(분)`)은 한글 글꼴(TEXT)로 남는다: 수식 엔진이 한글 글리프를 갖지 않으므로 한 라벨 안에서 글꼴을 나눌 수 없다. 변수 부분만 수식 글꼴로 하려면 라벨을 둘로 쪼개는 후속 확장이 필요.

## 거절·검사
- 새 오류 코드 없음. 축 이름 관측: 한글 없는 이름은 `data-text`가 없고 수식 글리프 코드가 글자와 일치해야 하며(`AXIS_TITLE_TEXT_MISMATCH`), 한글 있는 이름은 기존 TEXT 검사 그대로. 검사 완화 없음.
- 기존 테스트 변경: `test_graph_g18b_callouts` 한계 문구를 `(1234567890,12345678)`(21자)로(MATH 20자까지 허용으로 바뀐 한계), `tests/e30-fixtures/q6-axis-scale-names.json`의 svg를 새 엔진으로 다시 만든 것으로 교체(y(km)가 수식 글꼴이 됨; plan·frame 그대로).

## 이전 증거와의 호환 (독립 검토 지적, 2026-11-09)
- 영향 받는 저장 증거: 골든 `item62j`와 유사문항 `archive/exams/similar/high/h2/2final/25_제일고_2학기_기말_고2_수학II_유사_plans/q07-problem`(axisTitles `t`·`v`). 이전 엔진이 만든 평문(data-text) 축 이름 SVG를 새 `axis_titles_audit`로 다시 감사하면 `AXIS_TITLE_TEXT_MISMATCH`가 난다(직접 확인: q07 증거 state·svg로 재감사 → x·y 두 건).
- 그 증거를 재감사하는 경로는 없다: `tools/harness/verify_similar_exam.mjs`는 증거의 `resultPath` 상태(ARCHIVE_BOUND)·`capability`·생성 SVG 바이트가 첨부 자산과 같은지만 보고 관측기를 다시 돌리지 않는다. CI(`geometry-publication-tests.yml`)의 python·node 테스트는 저장소 고정 fixture(`tests/e30-fixtures`, 새 엔진 출력으로 교체함)만 쓴다. 따라서 이번 변경으로 게시 자산·유사문항 JS·CI가 깨지지 않는다.
- 호환이 끊기는 곳: 이전 엔진 출력 SVG를 새 관측기로 수동 재감사할 때만. 같은 plan을 새 엔진으로 다시 그리면 통과(결과는 PR 코멘트). 게시된 자산은 건드리지 않았다.

## 3회차(EXT-20261109-c) 처리 현황
| 행 | 처리 |
|---|---|
| 지시선 속 그리스 문자·`′`·`√` | **고침**: 수식 파서가 `√`(`√3`·`√x`·`√(x-2)`)와 `′`를 읽고(`math_expression.py`), 틀·관측기 기본 종류는 한글만 TEXT. 관측기 글리프 대조(`_ov_label_codes`)가 그리스 이탤릭 코드(`1D6FC`…)와 근호(피제수 뒤 U+221A)를 안다. 골든 `item132ext3greek` |
| 대응도·벤다이어그램 집합·원소 이름(COORDINATE/EQUATION: `node-*`, `column-name-*`, `element-*`, `set-name-*`) | **고침**: `set-diagram-v1.mjs` `labelMath`가 한글 없는 `[A-Za-z0-9()]{1,6}`(A, 10, AB, g(0), f(x))를 수식 글꼴로. 관측기는 data-text/data-tex 어느 쪽이든 글자를 읽으므로 변경 없음 |
| 평면도형 `planeMarks` 라벨 | 확인: `labelKind` 기본이 이미 MATH이고 TEXT는 작성자가 명시한 한글·단위·도형 기호·자모 라벨뿐이라 코드 변경 없음(옛 해설 그림의 TEXT는 기본값이 MATH가 되기 전 출력) |
| 통계 패널(`stat-chart-v1.mjs`) 제목·범례·변수 이름 | **남음**: 한글 없는 영어 라벨(x, y, A, B)만 해당. 관측기 `stat_chart_observer.py`가 라벨마다 `data-text`를 단정(제목·범례·시리즈 이름·열쇠·변수 이름)해 함께 고쳐야 하며 대상이 작아 다음 묶음으로 |
| 구간 불연속 선언(24 효천 고1 Q14, 유리 조각) | **남음**: 구간별 다항 패밀리가 유리함수 조각을 갖지 않는다. 패밀리 확장 설계가 먼저 필요 |
| 그래프 틀 단계 10초 제한 | `GEOMETRY_WORKER_TIMEOUT_MS`(밀리초)로 늘릴 수 있다(기본 10000, 부하가 큰 PC에서 파이썬 첫 import가 7초 넘어 WORKER_TIMEOUT이 났다) |
