cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## GOAL

`apmath/js/report.js`에서 평가 리포트 크게 보기 화면을 핀포인트로 복구/보정한다.

이번 작업은 기능 삭제가 아니라 기능 복구 + 레이아웃 최소 보정이다.

반드시 수행할 작업은 아래 3가지뿐이다.

1. 크게 보기 상단 버튼 4개를 사용자 확정 문구로 복구한다.
2. 바깥 평가 리포트 센터의 `프리미엄 분석` 버튼을 복구한다.
3. `reportCenterInjectPrintViewStyle()` 내부에서 툴바/문서 폭 불일치와 헤더 줄겹침 원인 CSS만 최소 수정한다.

## CONTEXT

작업 전 반드시 `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`를 처음부터 끝까지 읽고, 그 원칙을 우선 적용하라.

이번 작업은 GOAL에 적힌 하나의 목표만 수행한다.

사용자가 명시하지 않은 경우 작업자는 배포, 운영 smoke test, git commit, git push를 실행하지 말고, 수정과 로컬 검증 및 `CODEX_RESULT.md` 작성까지만 수행하라.

현재 문제 원인은 2개로 확정한다.

### 문제 1 — 툴바/문서 너비 불일치

현재 크게 보기 화면에서 아래 두 폭이 다르다.

- `.report-print-toolbar` → `max-width:900px`
- `.report-print-stage .aprc-pdf-document` → `width:190mm`

이 때문에 상단 툴바와 아래 A4 리포트 본문의 좌우 라인이 맞지 않는다.

### 문제 2 — 리포트 본문 헤더 줄겹침

현재 크게 보기 화면에서 아래 padding이 충돌한다.

- `.aprc-pdf-header` → premium style의 `padding:11mm 0 8mm`
- `.report-print-stage .aprc-pdf-header .aprc-issued` → inject style의 `padding-top:7mm`

이 때문에 발행일/날짜 영역과 헤더 텍스트가 세로로 어긋나거나 겹쳐 보인다.

## CONSTRAINTS

절대 금지:

- `apmath/js/report.js` 외 파일 수정 금지
- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md` 수정 금지
- Worker/API/DB/schema/migration 수정 금지
- 학생 포털/OMR/시험지 직접 열기 흐름 수정 금지
- 원장/관리자 화면 수정 금지
- 기존 리포트 본문 문구 임의 변경 금지
- 기존 버튼명 임의 변경 금지
- 사용자 확정 문구 외 버튼 문구 임의 작성 금지
- 새 기능 추가 금지
- 새 카드/새 섹션/새 입력란 추가 금지
- 크게 보기 안쪽 선생님 메모 패널 복구 금지
- `기존 카드 리포트` 버튼 복구 금지
- CSS 대수술 금지
- `reportCenterPremiumReportStyle()` 전체 구조 변경 금지
- `reportCenterBuildCleanPdfShell()` 인쇄 구조 변경 금지
- `git add`, `git commit`, `git push` 실행 금지
- 배포 금지
- 운영 API smoke test 금지

사용자 확정 버튼 문구:

- `리포트 센터`
- `기본 리포트`
- `프리미엄 분석`
- `인쇄`

위 4개 문구 외에 크게 보기 상단 버튼명을 임의로 쓰지 않는다.

## PRIORITY

1. 사용자 확정 문구 그대로 복구
2. 프리미엄 분석/기본 리포트 복귀 기능 복구
3. 툴바와 문서 라인 일치
4. 본문 헤더 줄겹침 제거
5. 기존 리포트/인쇄 흐름 보존
6. 최소 수정
7. 완료 보고와 실제 코드 일치

## PLAN

### 1. 수정 파일

수정 대상 파일은 오직 아래 파일 하나다.

- `apmath/js/report.js`

읽기 전용 확인만 가능한 파일:

- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`

### 2. 크게 보기 상단 버튼 복구

`reportCenterOpenPrintView()` 안의 `.report-print-toolbar` HTML을 확인한다.

크게 보기 상단 버튼은 정확히 아래 4개가 보여야 한다.

1. `리포트 센터`
2. `기본 리포트`
3. `프리미엄 분석`
4. `인쇄`

각 버튼 연결은 아래처럼 한다.

- `리포트 센터`
  - `reportCenterClosePrintView()`

- `기본 리포트`
  - `reportCenterResetPrintViewAiAnalysis(studentId, sessionId)`

- `프리미엄 분석`
  - `reportCenterRequestPrintViewAiAnalysis(studentId, sessionId, this)`

- `인쇄`
  - `reportCenterPrintCleanPdf(studentId, sessionId)`

주의:

- `리포트 센터로 돌아가기`라고 쓰지 않는다.
- `기본 리포트로 복귀`라고 쓰지 않는다.
- `프리미엄 분석 적용`이라고 쓰지 않는다.
- `인쇄하기`라고 쓰지 않는다.
- 반드시 사용자 확정 문구 4개만 쓴다.
- 크게 보기 안쪽 선생님 메모 입력 패널은 복구하지 않는다.
- `report-print-teacher-memo` textarea를 다시 만들지 않는다.
- `report-print-control-panel` section을 다시 만들지 않는다.

### 3. 바깥 평가 리포트 센터 프리미엄 분석 버튼 복구

`openReportCenterExam()` 안의 버튼 영역을 확인한다.

바깥 평가 리포트 센터에는 아래 기능이 있어야 한다.

- `리포트 크게 보기/출력`
- `카톡 요약 복사`
- `프리미엄 분석`

수정 기준:

- `프리미엄 분석` 버튼을 복구한다.
- `프리미엄 분석` 버튼은 `reportCenterRequestExamAiAnalysis(studentId, selectedId, this)` 흐름으로 연결한다.
- `기존 카드 리포트` 버튼은 복구하지 않는다.
- 프리미엄 안내 박스는 복구하지 않는다.
- `리포트 크게 보기/출력`, `카톡 요약 복사` 문구는 기존 그대로 유지한다.

권장 배치:

- 1줄: `리포트 크게 보기/출력` / `카톡 요약 복사`
- 2줄: `프리미엄 분석`

주의:

- 3개 버튼을 억지로 한 줄에 넣지 않는다.
- `기존 카드 리포트` 버튼을 다시 넣지 않는다.
- 프리미엄 안내 문장을 다시 넣지 않는다.

### 4. AI 분석 적용/기본 리포트 복귀 흐름 복구

이전 작업에서 `aiAnalysis`가 강제로 `null` 고정된 경우 복구한다.

`reportCenterBuildCleanPdfDocument(studentId, sessionId, options = {})` 내부를 확인한다.

수정 기준:

    const aiAnalysis = reportCenterGetAiAnalysisForReport(session?.id, options);

또는 기존 구조에 맞게 options와 캐시를 반영하도록 복구한다.

반드시 만족해야 할 흐름:

- `프리미엄 분석` 버튼 클릭 후 AI 분석 결과가 리포트 본문에 반영된다.
- `기본 리포트` 버튼 클릭 후 `reportCenterClearCachedAiAnalysis(sessionId)` 흐름을 통해 기본 리포트로 돌아간다.
- `reportCenterRefreshPrintViewReport()`는 현재 AI 분석 상태를 반영한다.
- `reportCenterRefreshPremiumExamPreview()`는 현재 AI 분석 상태를 반영한다.
- `reportCenterPrintCleanPdf()`는 현재 적용된 리포트 상태를 출력한다.

주의:

- AI 관련 함수 삭제 금지
- 캐시 함수 삭제 금지
- AI API 호출 함수 삭제 금지
- 기본 리포트 복귀 함수 삭제 금지
- 카톡 요약 복사 함수 삭제 금지

### 5. CSS 보정은 `reportCenterInjectPrintViewStyle()` 내부만 수정

이번 레이아웃 보정은 `reportCenterInjectPrintViewStyle()` 함수 내부에서만 한다.

#### 수정 1 — 툴바/문서 폭 기준 일치

`.report-print-toolbar` 블록에서 아래만 변경한다.

    기존: max-width:900px;
    변경: max-width:190mm;

`.report-print-control-panel` 블록에도 `max-width:900px`가 있으면 아래처럼 동일하게 변경한다.

    기존: max-width:900px;
    변경: max-width:190mm;

주의:

- `.report-print-toolbar`와 `.report-print-control-panel`의 max-width 외 다른 속성은 필요 없으면 건드리지 않는다.
- `.report-print-stage .aprc-pdf-document`의 `width:190mm`, `min-width:190mm`, `max-width:190mm`는 유지한다.

#### 수정 2 — 본문 헤더 padding 충돌 제거

`.report-print-stage .aprc-pdf-header` 블록에 아래 한 줄을 추가한다.

    padding:8mm 0 6mm;

수정 후 형태는 아래 기준을 따른다.

    .report-print-stage .aprc-pdf-header {
        display:grid;
        grid-template-columns:minmax(0,1fr) 34mm;
        align-items:start;
        column-gap:12mm;
        padding:8mm 0 6mm;
    }

`.report-print-stage .aprc-pdf-header .aprc-issued` 블록에서 아래만 변경한다.

    기존: padding-top:7mm;
    변경: padding-top:0;

주의:

- 이 외 헤더 CSS를 임의로 추가하지 않는다.
- grid-template-columns 값을 임의로 바꾸지 않는다.
- column-gap 값을 임의로 바꾸지 않는다.
- `.reportCenterPremiumReportStyle()` 안의 premium style은 이번 작업에서 건드리지 않는다.
- 인쇄용 shell 구조를 건드리지 않는다.

## DONE WHEN

완료 조건:

- 크게 보기 상단 버튼이 정확히 아래 4개 문구로 보인다.
  - `리포트 센터`
  - `기본 리포트`
  - `프리미엄 분석`
  - `인쇄`

- 바깥 평가 리포트 센터에 `프리미엄 분석` 버튼이 보인다.
- 바깥 평가 리포트 센터에 `기존 카드 리포트` 버튼은 보이지 않는다.
- 바깥 평가 리포트 센터에 프리미엄 안내 박스는 보이지 않는다.
- 크게 보기 안쪽 선생님 메모 패널은 보이지 않는다.
- 바깥 평가 리포트 센터의 선생님 추가 메모 입력란은 유지된다.
- `.report-print-toolbar` max-width가 `190mm`로 변경되어 있다.
- `.report-print-control-panel` max-width가 남아 있다면 `190mm`로 변경되어 있다.
- `.report-print-stage .aprc-pdf-header`에 `padding:8mm 0 6mm;`가 있다.
- `.report-print-stage .aprc-pdf-header .aprc-issued`의 `padding-top`이 `0`이다.
- 프리미엄 분석 적용 후 리포트 본문이 갱신된다.
- 기본 리포트 버튼 클릭 후 기본 리포트로 돌아간다.
- 인쇄 버튼 클릭 후 출력 창이 열린다.
- `node --check apmath/js/report.js`가 PASS다.
- 완료 보고가 실제 코드와 일치한다.

## VERIFY

반드시 실행한다.

    node --check apmath/js/report.js
    git status --short

문구 및 잔존 확인:

    grep -n "리포트 센터\|기본 리포트\|프리미엄 분석\|인쇄\|기존 카드 리포트\|리포트 센터로 돌아가기\|기본 리포트로 복귀\|프리미엄 분석 적용\|인쇄하기\|max-width:900px\|max-width:190mm\|padding:8mm 0 6mm\|padding-top:7mm\|padding-top:0\|report-print-control-panel\|report-print-teacher-memo" apmath/js/report.js || true

PowerShell 환경이면 아래로 대체한다.

    Select-String -Path apmath/js/report.js -Pattern "리포트 센터|기본 리포트|프리미엄 분석|인쇄|기존 카드 리포트|리포트 센터로 돌아가기|기본 리포트로 복귀|프리미엄 분석 적용|인쇄하기|max-width:900px|max-width:190mm|padding:8mm 0 6mm|padding-top:7mm|padding-top:0|report-print-control-panel|report-print-teacher-memo"

검색 결과 해석 기준:

- `리포트 센터`, `기본 리포트`, `프리미엄 분석`, `인쇄`는 크게 보기 버튼으로 있어야 한다.
- `리포트 센터로 돌아가기`, `기본 리포트로 복귀`, `프리미엄 분석 적용`, `인쇄하기`가 크게 보기 버튼 문구로 남아 있으면 FAIL이다.
- `기존 카드 리포트`가 사용자 노출 버튼으로 남아 있으면 FAIL이다.
- `max-width:900px`가 `.report-print-toolbar` 또는 `.report-print-control-panel`에 남아 있으면 FAIL이다.
- `max-width:190mm`는 `.report-print-toolbar`와 `.report-print-control-panel`에 있어야 한다.
- `padding:8mm 0 6mm`는 `.report-print-stage .aprc-pdf-header`에 있어야 한다.
- `padding-top:7mm`가 `.report-print-stage .aprc-pdf-header .aprc-issued`에 남아 있으면 FAIL이다.
- `padding-top:0`은 `.report-print-stage .aprc-pdf-header .aprc-issued`에 있어야 한다.
- `report-print-control-panel` CSS 잔존은 허용되지만, HTML 렌더링으로 section이 생성되면 FAIL이다.
- `report-print-teacher-memo` 조회 함수 잔존은 허용되지만, 크게 보기 HTML에 textarea로 생성되면 FAIL이다.

## OUTPUT

루트의 `CODEX_RESULT.md`에 아래 형식으로 작성한다.

# CODEX_RESULT

## 1. 생성/수정 파일

- 수정한 파일 목록
- 읽기 전용 확인 파일 목록

## 2. 구현 완료 또는 확인 완료

- 크게 보기 버튼 문구 4개 확정 반영 여부
- 바깥 평가 리포트 센터 `프리미엄 분석` 버튼 복구 여부
- `기존 카드 리포트` 버튼 제거 유지 여부
- 크게 보기 안쪽 선생님 메모 패널 제거 유지 여부
- 바깥 선생님 추가 메모 유지 여부
- AI 분석 적용 흐름 복구 여부
- 기본 리포트 복귀 흐름 복구 여부
- `.report-print-toolbar` max-width 190mm 변경 여부
- `.report-print-control-panel` max-width 190mm 변경 여부
- `.report-print-stage .aprc-pdf-header` padding 보정 여부
- `.aprc-issued` padding-top 0 변경 여부
- 인쇄하기 흐름 보존 여부
- 기존 본문 문구 임의 변경 여부

## 3. 실행 결과

- `node --check apmath/js/report.js`: PASS/FAIL
- `git status --short` 결과
- 문구/CSS 검색 결과 요약

## 4. 결과 요약

- 복구한 기능
- 보정한 CSS
- 일부러 복구하지 않은 것
- 보존한 흐름

## 5. 잘못한 점 / 위험했던 점 / 보존해야 할 점

- 이전 작업에서 프리미엄 분석/기본 리포트 버튼을 과하게 제거한 점을 어떻게 복구했는지
- 사용자 확정 문구 외 버튼명을 임의로 쓰지 않았는지
- 기존 리포트 본문 문구를 임의 변경하지 않았는지
- 크게 보기 안쪽 메모 패널을 다시 만들지 않았는지
- 인쇄 흐름을 건드리지 않았는지

## 6. 다음 조치

- 실제 브라우저에서 확인할 체크리스트
- 추가 보정이 필요한 경우 후보

아래 항목도 반드시 적는다.

- 배포 실행 여부: 미실행 - 사용자 직접 실행 대상
- 운영 smoke 실행 여부: 미실행 - 사용자 직접 실행 대상
- git commit 실행 여부: 미실행 - 사용자 직접 실행 대상
- git push 실행 여부: 미실행 - 사용자 직접 실행 대상

## STOP RULES

아래 상황이면 구현하지 말고 `CODEX_RESULT.md`에 중단 사유를 적는다.

- `apmath/js/report.js` 외 파일 수정이 필요하면 STOP
- 버튼 문구를 새로 정해야 하면 STOP
- 사용자 확정 문구 외 문구 변경이 필요하면 STOP
- `reportCenterPremiumReportStyle()` 대수정이 필요하면 STOP
- `reportCenterBuildCleanPdfShell()` 대수정이 필요하면 STOP
- DB/API/Worker 수정이 필요하면 STOP
- 기존 리포트 본문 문구 대량 변경이 필요하면 STOP
- 원장/관리자 화면 변경이 필요하면 STOP
- 학생 포털/OMR 흐름과 관련되면 STOP
- 확신 없이 추측으로 완료 처리해야 하면 STOP

## 최종 출력

터미널 마지막 출력은 반드시 아래 문장으로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF