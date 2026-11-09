# AP Table Engine 계약 v1

status: CURRENT

운영 안내·진행 상황: [docs/agents/table-engine.md](../../agents/table-engine.md)

## 1. 목적
시험지 표를 한 규격으로 렌더한다. 이유: 표가 문항마다 제각각이었고, 파이프 표는 `|` 글자 그대로 학생에게 보였다. AI 작업자는 표의 **내용과 구조만** 쓰고, 디자인과 치수는 엔진(`archive/js/ap-table-engine.js`, `archive/css/ap-table.css`)이 정하며, 배포 가능 여부는 검증기가 판정한다.

## 2. 작성 형식
- 기본은 파이프 표다(바깥 파이프 권장). 이유: 도구마다 해석이 달라서다.
- 바깥 파이프 없는 표(`a | b` / `---|---`)는 머리글 바로 아래에 구분선(모든 칸 `-` 3개 이상, 2칸 이상, 머리글과 같은 칸 수)이 있을 때만 표로 본다. 이유: `P(A|B)`, `{x | x>0}` 같은 글을 표로 오인하지 않기 위해서다.
- 첫 줄은 머리글이다. 구분선 `| :---: |`은 써도 되고 안 써도 된다(바깥 파이프 없는 표는 필수).
- 셀 안의 수식·변수·분수는 모두 `$…$`로 쓴다(`$X$`, `$P(X=x)$`). 이유: MathJax가 조판하고 맨글자 수식은 깨져 보인다.
- 분수는 `\frac{1}{6}`로 쓰고 슬래시 `1/6`은 쓰지 않는다. 이유: 학생 화면에서 분수 모양을 지킨다.
- 빈칸은 빈 셀 또는 `$\square$`로 쓴다. 이유: 빈칸 최소폭 8mm를 엔진이 보장한다.
- 병합 셀이 필요한 표만 HTML `<table>`에 colspan·rowspan으로 쓴다. class·style·border·width는 쓰지 않는다(써도 엔진이 지운다). 이유: 디자인 단일화.
- 예외: 조립제법처럼 일부 선만 긋는 표는 셀의 `border*` 스타일을 보존한다(`ap-table-custom-borders`). 이유: 선 자체가 내용이다.
- 조건 상자와 보기는 표가 아니다. `.box`나 `.question-note-box`를 쓴다. 이유: 표 규격(머리글선·격자)이 맞지 않는다.

## 3. 디자인 토큰 (`archive/css/ap-table.css`)
| 토큰 | 값 |
|---|---|
| `--ap-table-line-outer` | `max(0.30mm, 1px)` (인쇄 0.30mm) |
| `--ap-table-line-head` | `max(0.24mm, 1px)` (인쇄 0.24mm) |
| `--ap-table-line-inner` | `max(0.18mm, 1px)` (인쇄 0.18mm) |
| `--ap-table-color-outer` | `#222` |
| `--ap-table-color-inner` | `#333` |
| `--ap-table-font-size` | `9pt` |
| `--ap-table-pad-y` / `--ap-table-pad-x` | `0.8mm` / `1.6mm` |
| `--ap-table-row-min` | `6mm` |
| `--ap-table-shade` | `#f2f2f2` |

인쇄 실측 전이라 값은 잠정이다(`table-engine.md` 남은 일 6).

## 4. 렌더 계약
- 변환은 렌더 시점에 한다(`wrapLatex`, `prepare*CanonicalContent` 앞부분에서 `renderApTables` 호출). 이유: 저장 시험지·믹서·반 배정 스냅숏도 저장본 수정 없이 함께 고쳐진다.
- 멱등이다: `renderApTables(renderApTables(x)) === renderApTables(x)`. 이유: 여러 경로를 거쳐도 결과가 같아야 한다.
- 셀 글자를 바꾸지 않는다(파이프 셀 수식 안의 `<`/`>` 이스케이프만 예외). 이유: 내용 변조 방지, 회귀 테스트로 보존을 검사한다.
- 글자를 자동으로 줄이지 않는다. 길면 셀 안에서 줄바꿈하고, 넘치면 FAIL이다. 이유: 억지 통과로 읽기 어려운 표가 나가는 것을 막는다.
- 엔진 모듈이 없어도(`globalThis.ApTableEngine` 가드) 화면은 열린다. 배포 목록(`tools/archive-pages-release-manifest.json`)에 `archive/js`가 포함돼야 한다. 이유: 없으면 배포본에서 404.

## 5. 검증기 (`tools/check-ap-tables.cjs`)
통과 기준: `node tools/check-ap-tables.cjs`가 **FAIL 0**(종료 코드 0). 새 시험지는 `--files <경로|이름조각>`으로 자기 파일만 돌린다. 브라우저 검사는 `--browser --files <파일>`(Chrome, `--modes`, `--widths 1440,390`). 무관한 렌더 오류로 열리지 않으면 FAIL이 아니라 `NOT_RUN`으로 적는다.

| 규칙 | 이유 |
|---|---|
| `ROW_COL_MISMATCH` | 행마다 칸 수가 다르면 열 제목이 밀린다. |
| `RESIDUAL_PIPE_ROW` | 표로 안 바뀐 `\|` 줄은 학생에게 글자로 보인다. |
| `PAREN_MATH_IN_CELL` | `\( \)` 수식은 셀에서 조판이 어긋난다. `$…$`로 쓴다. |
| `UNBALANCED_DOLLAR` | `$`가 짝이 안 맞으면 수식이 깨진다. |
| `EMPTY_HEADER` | 머리글이 비면 열 의미를 알 수 없다. |
| `SLASH_FRACTION_OUTSIDE_MATH` | `$` 밖 슬래시 분수는 분수 모양으로 안 보인다. |
| `BARE_MATH_VARIABLE_HEADER` | `$` 없는 변수 머리글(X 등)은 수식 글꼴로 안 나온다. |
| `ENGINE_EXCEPTION` | 엔진이 예외를 내면 학생 화면에서 표가 사라질 수 있다. |
| `TABLE_OVERFLOW` (브라우저) | 표가 상자 밖으로 넘치면 잘려 보인다. |
| `CELL_OVERFLOW` (브라우저) | 셀 내용이 칸 밖으로 넘치면 겹쳐 보인다. |
| `MATH_ERROR` (브라우저) | MathJax 오류 빨간 글자가 학생에게 보인다. |

인쇄 시 페이지 경계 잘림은 아직 검사하지 않는다.

## 6. 아직 엔진이 연결되지 않은 화면
각자 표를 따로 처리하므로 같은 모듈을 연결해야 한다: `archive/generated-bank.html`, `archive/problem-bank-search.html`, mixer 문항 목록 카드. apmath 화면(`apmath/wrong_print_engine.html`, 학부모 리포트 `apmath/js/report-center.js`)은 연결 대상이 아니다(사용자 결정 2026-11-09: 아카이브만 연결).
