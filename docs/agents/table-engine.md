# AP Table Engine — 작업 안내·인계

시험지 표를 한 규격으로 렌더하는 엔진이다. 이유: 표가 문항마다 제각각이었고, 파이프 표는 `|` 글자 그대로 학생에게 보였다.

## 원칙
- AI 작업자는 표의 **내용과 구조만** 쓴다. 디자인과 치수는 엔진이 정하고, 배포 가능 여부는 검증기가 판정한다.
- 출력은 SVG가 아니라 **규격화된 HTML 표**다(사용자 결정 2026-11-09). 이유: 렌더 시점에 변환하므로 저장 시험지·믹서·반 배정 스냅숏도 함께 고쳐지고, 2열이나 서술형 폭에 맞춰 다시 배치되며, 수식은 MathJax가 그대로 조판한다.
- 글자를 자동으로 줄여 억지로 통과시키지 않는다. 넘치면 FAIL로 판정한다.

## 작성 형식
- 기본은 파이프 표다. 첫 줄이 머리글이고, 구분선 `| :---: |`은 써도 되고 안 써도 된다. 셀 안의 수식·변수·분수는 반드시 `$…$`로 쓴다. 예: `$X$`, `$P(X=x)$`, `$\frac{1}{6}$`. 슬래시 분수 `1/6`은 쓰지 않는다.
- 바깥 파이프 없는 GFM 표(`구분 | 우진 | 수빈` / `---|---|---` / `성인 | 2 | 1`)도 엔진이 표로 바꾼다. 단 머리글 줄 바로 아래에 구분선(모든 칸이 `-` 3개 이상, 2칸 이상)이 있고 머리글과 칸 수가 같을 때만이다. 구분선이 없으면 `a | b`, `P(A|B)`, 집합 `{x | x>0}` 같은 글을 건드리지 않는다. 새로 쓸 때는 바깥 파이프를 붙여 쓰는 것을 권장한다. 이유: 도구마다 해석이 다르다.
- 병합 셀이 필요한 표만 HTML `<table>`에 colspan·rowspan을 써서 만든다. class·style·border는 쓰지 않는다. 써도 엔진이 지운다. 단, 조립제법처럼 일부 선만 긋는 표는 셀의 `border*` 스타일이 보존된다(`ap-table-custom-borders`).
- 조건 상자와 보기는 표가 아니다. `.box`나 `.question-note-box`를 쓴다.

## 구성 (PR #1540)
| 파일 | 역할 |
|---|---|
| `archive/js/ap-table-engine.js` | `renderApTables(html)`: 파이프 표를 `ap-table`로 바꾸고 기존 HTML 표를 정규화한다. 멱등이다. `extractTableCells(html)`도 들어 있다. |
| `archive/css/ap-table.css` | 규격 토큰: 외곽선 0.30mm, 머리글선 0.24mm, 내부선 0.18mm, 9pt, 빈칸 최소폭 8mm. 좁은 해설 상자에서는 글자 크기를 inherit한다. |
| `archive/engine.html`, `archive/mixed_engine.html` | `wrapLatex`와 `prepare*CanonicalContent` 앞부분에서 호출한다(`globalThis.ApTableEngine` 가드). |
| `tests/ap-table-engine.test.js` | 감사 파일 11개(고2 확률과통계 59문항) 회귀, 가짜 표(절댓값) 방지, 셀 보존을 검사한다. |
| `tools/archive-pages-release-manifest.json` | `archive/js`를 배포에 포함한다. 없으면 배포본에서 404가 난다. |

## 현재 상태 (2026-11-09)
- 엔진 #1540, 검증기 #1546, 바깥 파이프 없는 표 지원 + 왕운중 5번 교정 #1547이 main에 머지됐다. main에서 검증기 FAIL은 0건이다.
- 정본 계약: [AP_Table_Engine_Contract_v1.md](../rules/01_CANONICAL/AP_Table_Engine_Contract_v1.md).
- 픽셀 동일 기준 CI(`printed pixel parity` 등)는 표 모양을 의도적으로 바꿔 실패할 수 있다. PR #1475 전례가 있다.

## 남은 일 (순서대로)
1. ~~PR-2 검증기~~ **완료**: `tools/check-ap-tables.cjs`, 테스트 `tests/ap-table-validator.test.js`.
   - 정적 검사(Node만, 약 1분): `node tools/check-ap-tables.cjs [--files <경로|glob|이름조각>,...] [--json <경로>]`. `archive/exams/**` 전체 또는 지정 파일의 문항·보기·해설을 `renderApTables`에 통과시킨 뒤 규칙별 FAIL `{file, qid, field, rule, cell}`을 낸다. 규칙: `ROW_COL_MISMATCH` `RESIDUAL_PIPE_ROW` `PAREN_MATH_IN_CELL` `UNBALANCED_DOLLAR` `EMPTY_HEADER` `SLASH_FRACTION_OUTSIDE_MATH` `BARE_MATH_VARIABLE_HEADER`. FAIL이 있으면 종료 코드 1이다. 새 시험지 CREATE 파이프라인은 자기 파일만 `--files`로 돌리면 된다.
   - 브라우저 검사: `node tools/check-ap-tables.cjs --browser --files <파일>`. 실제 Chrome(Playwright)으로 `engine.html?data=exams/<파일>&mode=exam|sol`을 열어 `TABLE_OVERFLOW` `CELL_OVERFLOW` `MATH_ERROR`를 본다(`--modes`, `--widths 1440,390`로 조정). 이 파일과 무관한 렌더 오류로 열리지 않으면 FAIL이 아니라 `NOT_RUN`으로 적는다. Playwright는 `AP_PLAYWRIGHT_MODULE` 또는 `GEOMETRY_NODE_MODULES`로 찾는다. 인쇄 시 페이지 경계에서 잘리는지는 아직 보지 않는다.
   - 이 PR은 검증기만 추가했고 원본 데이터는 고치지 않았다. FAIL 목록은 PR-3의 입력이다.
2. ~~PR-3 원본 정리~~ **완료 (검증기 FAIL 12건 → 0건)**: 검증기 FAIL 항목만 고친다. `docs/agents/common.md`의 "공유 데이터 고정값"을 지킨다. 값은 원본으로 확인하고 추정해서 채우지 않는다.
   - 바깥 파이프 없는 파이프 표 11건(동아 공통수학1 교과서 7개 문자열)은 **엔진을 확장해** 해결했다(사용자 결정). 데이터는 그대로다. 구분선 필수, 구분선 없으면 변환하지 않는다. 전수 비교에서 바뀐 문자열은 이 7개뿐이고 셀 내용은 그대로다.
   - 25 왕운중 1학기 중간 중3 5번 제곱근표는 머리글 칸이 5개, 본문이 6개라 열 제목이 한 칸 밀려 있었다. 머리글에 빈 칸 하나를 더해 맞췄다(값은 그대로). 근거: 해설이 "3.2행 5열 = 1.803"이고 6번 해설이 "33행 4열 = 5.779"여서 열 제목 4·5·6은 "..." 열 다음의 숫자 열 위에 있다.
   - 이 PR 머지 뒤 파생 데이터(catalog·4slot·source-verification 해시)는 자동 등록 커밋이 갱신한다. 손으로 고치지 않는다.
3. ~~분수 전수 조사~~ **완료 (확실한 분수 변환)**: Git에 있는 시험지 JS의 발문·보기·해설·표를 조사하고, 피연산자와 의미가 명확한 슬래시 분수를 조판용 수식으로 바꿨다. 채점용 answer와 날짜·경로·단위·회차 등은 유지했다. 의미나 피연산자 경계가 모호한 항목 및 고정 원본 해시 참조 항목은 EVIDENCE_DEBT로 분리했다.
4. ~~PR-4 정본 문서~~ **완료**: [계약 v1](../rules/01_CANONICAL/AP_Table_Engine_Contract_v1.md), `exam-pipeline.md`에 표 작성 규칙 추가.
5. ~~아카이브 나머지 화면 연결~~ **완료 (PR-5)**: `archive/generated-bank.html`(문항 본문·미리보기·직접 인쇄), `archive/problem-bank-search.html`(문항 미리보기), `archive/mixer.html`(문항 카드 `createQuestionItem`)가 `ap-table-engine.js`·`ap-table.css`를 `engine.html`과 같은 캐시 버스트로 불러오고, 문항 HTML을 삽입하기 전·MathJax 조판 전에 `renderApTables`를 호출한다(`globalThis.ApTableEngine` 가드). 이유: 표가 화면마다 달라 파이프 `|` 줄이 학생·교사에게 글자로 보였다.
   - generated-bank·problem-bank-search는 `innerHTML`을 쓰지 않는 화면이라, 엔진 출력을 허용 목록(table·thead·tbody·tfoot·tr·th·td·br·b, 칸 병합·scope·border 스타일만)으로 노드를 다시 만든다. 허용 밖 태그가 들어 있으면 그 표는 변환하지 않고 원래 문자열 경로로 돌아간다. 원문(`data-source-text`)은 바꾸지 않는다.
   - problem-bank-search의 `#preview td/th` 테두리·여백 규칙은 ap-table 규칙(id 선택자라 우선순위가 높았다)을 덮어서 `table:not(.ap-table)`로 한정했다. 나머지 화면의 자체 `.question-table` 규칙은 ap-table 규칙이 우선순위로 이기므로 그대로 둔다(엔진이 없을 때의 대체 모양).
   - 화면에서 바뀌지 않은 것: generated-bank·mixer의 인쇄/출력은 이미 `mixed_engine.html`·`engine.html`(연결 완료)로 가므로 이중 처리하지 않는다. mixer의 "전체 아카이브" 목록(`createQuestionIndexItem`)은 색인의 `contentText`를 180자로 줄여 글자로 보여 주는 요약 목록이라 표를 그리지 않는다(원문 파이프가 요약에 글자로 남을 수 있음 — 남은 일).
   - apmath 화면(`apmath/wrong_print_engine.html`, `apmath/js/report-center.js`)은 연결 대상이 아니다(사용자 결정 2026-11-09: 아카이브만 연결).
   - 테스트: `tests/ap-table-archive-renderers.test.js`(세 화면의 태그·호출 위치·가드), `tests/archive2-generated-bank-subjective-table.test.cjs`(파이프 표 노드·멱등·위험 마크업 폴백).
- 동아 경우의수와행렬 대단원평가 해설지 MATH_TYPESET_ERROR (기존, 원인 미상)
6. **인쇄 실측**: 사용자가 실제 프린터로 선 두께를 확인한 뒤 CSS 토큰을 확정한다.

## 참고 자료
- 감사 문서: 사용자 Downloads의 `archive_probability_statistics_table_audit_20261109.md`(main 66f0bf7, 고2 확률과통계 11개 파일 59문항).
- 기존 별도 결함: 22 효천고 1학기 중간 수학I 해설은 `MEASURED_SOLUTION_CHUNK_EXCEEDS_PAGE` 오류로 렌더가 막힌다. 22 효천고 1학기 기말 확률과통계 24번 본문에는 `<p class="mb-1">`가 글자로 그대로 보인다. 둘 다 표와 무관하다.
