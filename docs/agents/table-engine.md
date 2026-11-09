# AP Table Engine — 작업 안내·인계

시험지 표를 한 규격으로 렌더하는 엔진이다. 이유: 표가 문항마다 제각각이었고, 파이프 표는 `|` 글자 그대로 학생에게 보였다.

## 원칙
- AI 작업자는 표의 **내용과 구조만** 쓴다. 디자인과 치수는 엔진이 정하고, 배포 가능 여부는 검증기가 판정한다.
- 출력은 SVG가 아니라 **규격화된 HTML 표**다(사용자 결정 2026-11-09). 이유: 렌더 시점에 변환하므로 저장 시험지·믹서·반 배정 스냅숏도 함께 고쳐지고, 2열이나 서술형 폭에 맞춰 다시 배치되며, 수식은 MathJax가 그대로 조판한다.
- 글자를 자동으로 줄여 억지로 통과시키지 않는다. 넘치면 FAIL로 판정한다.

## 작성 형식
- 기본은 파이프 표다. 첫 줄이 머리글이고, 구분선 `| :---: |`은 써도 되고 안 써도 된다. 셀 안의 수식·변수·분수는 반드시 `$…$`로 쓴다. 예: `$X$`, `$P(X=x)$`, `$\frac{1}{6}$`. 슬래시 분수 `1/6`은 쓰지 않는다.
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
- PR #1540은 독립 검수 PASS를 받았고, CI 대기 후 머지 예정이다.
- 실패 중인 CI가 있지만 이 PR의 결함은 아니다.
  - `Archive snapshot recovery in Chrome`의 `real50-qpp4-reminder-image-fit`: base와 다른 브랜치에서도 같은 해시로 실패하는 기존 실패다.
  - `Archive printed pixel parity`와 `output performance and parity`: 고정 기준 커밋 `4a26285`과 픽셀이 같아야 통과하는 검사라, 표 모양을 의도적으로 바꾸면 실패한다. PR #1475도 같은 상태로 머지된 전례가 있다.
- 22 복성고·25 금당고 2학기 기말 확률과통계의 표 셀 분수와 변수 머리글은 수식으로 고쳤다.

## 남은 일 (순서대로)
1. ~~PR-2 검증기~~ **완료**: `tools/check-ap-tables.cjs`, 테스트 `tests/ap-table-validator.test.js`.
   - 정적 검사(Node만, 약 1분): `node tools/check-ap-tables.cjs [--files <경로|glob|이름조각>,...] [--json <경로>]`. `archive/exams/**` 전체 또는 지정 파일의 문항·보기·해설을 `renderApTables`에 통과시킨 뒤 규칙별 FAIL `{file, qid, field, rule, cell}`을 낸다. 규칙: `ROW_COL_MISMATCH` `RESIDUAL_PIPE_ROW` `PAREN_MATH_IN_CELL` `UNBALANCED_DOLLAR` `EMPTY_HEADER` `SLASH_FRACTION_OUTSIDE_MATH` `BARE_MATH_VARIABLE_HEADER`. FAIL이 있으면 종료 코드 1이다. 새 시험지 CREATE 파이프라인은 자기 파일만 `--files`로 돌리면 된다.
   - 브라우저 검사: `node tools/check-ap-tables.cjs --browser --files <파일>`. 실제 Chrome(Playwright)으로 `engine.html?data=exams/<파일>&mode=exam|sol`을 열어 `TABLE_OVERFLOW` `CELL_OVERFLOW` `MATH_ERROR`를 본다(`--modes`, `--widths 1440,390`로 조정). 이 파일과 무관한 렌더 오류로 열리지 않으면 FAIL이 아니라 `NOT_RUN`으로 적는다. Playwright는 `AP_PLAYWRIGHT_MODULE` 또는 `GEOMETRY_NODE_MODULES`로 찾는다. 인쇄 시 페이지 경계에서 잘리는지는 아직 보지 않는다.
   - 이 PR은 검증기만 추가했고 원본 데이터는 고치지 않았다. FAIL 목록은 PR-3의 입력이다.
2. **PR-3 원본 정리**: 검증기 FAIL 항목만 원본 JS를 고친다. `docs/agents/common.md`의 "공유 데이터 고정값"을 지킨다. 값은 원본으로 확인하고 추정해서 채우지 않는다.
3. **분수 전수 조사 (GPT에 위임)**: 발문·보기·해설·표의 모든 슬래시 분수를 `\frac`로 바꾼다. PR #1540 머지와 자동 등록 커밋을 확인한 뒤 최신 main에서 시작한다. answer 필드는 채점 영향을 먼저 확인한다.
4. **PR-4 정본 문서**: `docs/rules/01_CANONICAL/AP_Table_Engine_Contract_v1.md`를 쓰고, `docs/agents/exam-pipeline.md` CREATE 지시서에 "표는 파이프 형식, 스타일 금지, 수식은 `$`"를 추가한다.
5. **아직 엔진이 연결되지 않은 화면**: `archive/generated-bank.html`, `archive/problem-bank-search.html`, `apmath/wrong_print_engine.html`, `apmath/js/report-center.js`(학부모 리포트), mixer 문항 목록 카드. 각자 표를 따로 처리하므로 같은 모듈을 연결해야 한다.
6. **인쇄 실측**: 사용자가 실제 프린터로 선 두께를 확인한 뒤 CSS 토큰을 확정한다.

## 참고 자료
- 감사 문서: 사용자 Downloads의 `archive_probability_statistics_table_audit_20261109.md`(main 66f0bf7, 고2 확률과통계 11개 파일 59문항).
- 기존 별도 결함: 22 효천고 1학기 중간 수학I 해설은 `MEASURED_SOLUTION_CHUNK_EXCEEDS_PAGE` 오류로 렌더가 막힌다. 22 효천고 1학기 기말 확률과통계 24번 본문에는 `<p class="mb-1">`가 글자로 그대로 보인다. 둘 다 표와 무관하다.
