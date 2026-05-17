cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## GOAL

`apmath/js/report.js`에서 평가 리포트 버튼 문구/배치만 핀포인트 수정한다.

이번 작업은 버튼 문구와 버튼 배치만 수정한다.
리포트 본문, AI 분석 로직, 인쇄 로직, CSS 대수술은 하지 않는다.

## 수정 대상 파일

- `apmath/js/report.js` 단독

다른 파일 수정 금지.

## 작업 1. 바깥 리포트 센터 버튼 정리

`openReportCenterExam()` 안의 바깥 리포트 센터 버튼 영역만 확인한다.

### 1-1. 파란 버튼 문구 변경

기존 문구:

    리포트 크게 보기/출력

변경 문구:

    리포트보기/프리미엄분석

기능은 그대로 유지한다.
즉, 클릭 시 기존처럼 크게 보기 화면으로 들어가야 한다.

### 1-2. 바깥 별도 프리미엄 분석 버튼 제거

바깥 리포트 센터 하단에 별도 버튼으로 남아 있는 아래 버튼은 제거한다.

    프리미엄 분석

주의:

- `reportCenterRequestExamAiAnalysis(...)`로 연결된 바깥 버튼 HTML만 제거한다.
- AI 분석 함수 자체는 삭제하지 않는다.
- 크게 보기 안쪽의 프리미엄 분석 기능은 유지한다.
- `카톡 요약 복사` 버튼은 유지한다.
- 선생님 추가 메모 입력란은 유지한다.
- 오답표, 원문 분석 요약, 문항별 분석 영역은 건드리지 않는다.

## 작업 2. 크게 보기 상단 버튼 문구/순서 변경

`reportCenterOpenPrintView()` 안의 `.report-print-toolbar` 버튼 영역만 확인한다.

상단 버튼 4개는 아래 순서와 문구로 정확히 맞춘다.

1. `프리미엄 분석`
2. `기본 리포트`
3. `인쇄하기`
4. `돌아가기`

각 버튼 기능 연결은 아래 기준으로 유지한다.

- `프리미엄 분석`
  - `reportCenterRequestPrintViewAiAnalysis(studentId, sessionId, this)`

- `기본 리포트`
  - `reportCenterResetPrintViewAiAnalysis(studentId, sessionId)`

- `인쇄하기`
  - `reportCenterPrintCleanPdf(studentId, sessionId)`

- `돌아가기`
  - `reportCenterClosePrintView()`

주의:

- `리포트 센터` 문구는 사용하지 않는다.
- `인쇄` 문구는 사용하지 않는다.
- `리포트 센터로 돌아가기` 문구는 사용하지 않는다.
- `기본 리포트로 복귀` 문구는 사용하지 않는다.
- `프리미엄 분석 적용` 문구는 사용하지 않는다.
- 버튼 기능은 바꾸지 않는다.
- 크게 보기 안쪽 선생님 메모 패널은 만들지 않는다.

## 작업 3. 프리미엄 분석 버튼 강조 색상만 추가

`reportCenterOpenPrintView()`의 크게 보기 상단 버튼 중 `프리미엄 분석` 버튼에만 강조용 class를 추가한다.

권장 class 이름:

    report-print-premium-btn

`reportCenterInjectPrintViewStyle()` 내부에 해당 class CSS만 추가한다.

권장 CSS:

    .report-print-toolbar .report-print-premium-btn {
        background:linear-gradient(135deg,#6d28d9,#2563eb);
        color:#fff;
        border-color:transparent;
        box-shadow:0 10px 22px rgba(37,99,235,.22);
    }

    .report-print-toolbar .report-print-premium-btn:hover {
        filter:brightness(1.03);
    }

주의:

- 강조 색상은 `프리미엄 분석` 버튼에만 적용한다.
- `기본 리포트`, `인쇄하기`, `돌아가기` 버튼 색상은 기존 일반 버튼 톤을 유지한다.
- 기존 `.report-print-toolbar` 레이아웃 CSS는 필요 없으면 건드리지 않는다.
- 리포트 문서 CSS, 헤더 CSS, 인쇄 CSS는 이번 작업에서 수정하지 않는다.

## 절대 금지

- `apmath/js/report.js` 외 파일 수정 금지
- 리포트 본문 문구 수정 금지
- AI 분석 함수 삭제 금지
- AI 캐시 함수 삭제 금지
- 인쇄 함수 수정 금지
- `reportCenterBuildCleanPdfDocument()` 수정 금지
- `reportCenterBuildCleanPdfShell()` 수정 금지
- `reportCenterPremiumReportStyle()` 수정 금지
- DB/API/Worker/schema/migration 수정 금지
- 학생 포털/OMR 흐름 수정 금지
- 관리자/원장 화면 수정 금지
- 새 기능 추가 금지
- 새 입력란 추가 금지
- `기존 카드 리포트` 버튼 복구 금지
- 바깥 별도 `프리미엄 분석` 버튼 복구 금지
- `git add`, `git commit`, `git push` 실행 금지
- 배포 금지

## VERIFY

반드시 실행한다.

    node --check apmath/js/report.js
    git status --short

문구 확인은 PowerShell에서 아래로 실행한다.

    Select-String -Path apmath/js/report.js -Pattern "리포트보기/프리미엄분석|리포트 크게 보기/출력|프리미엄 분석|기본 리포트|인쇄하기|돌아가기|리포트 센터|인쇄|프리미엄 분석 적용|기본 리포트로 복귀|리포트 센터로 돌아가기|report-print-premium-btn|reportCenterRequestExamAiAnalysis|reportCenterRequestPrintViewAiAnalysis"

해석 기준:

- `리포트보기/프리미엄분석`은 있어야 한다.
- 바깥 버튼 문구로 `리포트 크게 보기/출력`이 남아 있으면 FAIL이다.
- 크게 보기 상단 버튼 문구는 `프리미엄 분석`, `기본 리포트`, `인쇄하기`, `돌아가기`이어야 한다.
- 크게 보기 상단 버튼 문구로 `리포트 센터`, `인쇄`, `프리미엄 분석 적용`, `기본 리포트로 복귀`, `리포트 센터로 돌아가기`가 남아 있으면 FAIL이다.
- `report-print-premium-btn`은 있어야 한다.
- `reportCenterRequestPrintViewAiAnalysis`는 유지되어야 한다.
- `reportCenterRequestExamAiAnalysis`는 함수 또는 다른 내부 참조가 남아 있을 수 있으나, 바깥 리포트 센터의 별도 버튼 onclick으로 노출되면 FAIL이다.

## OUTPUT

루트에 `CODEX_RESULT_REPORT_BUTTONS.md`를 작성한다.

형식:

# CODEX_RESULT_REPORT_BUTTONS

## 1. 수정 파일

- `apmath/js/report.js`

## 2. 구현 완료

- 바깥 파란 버튼 문구 `리포트보기/프리미엄분석` 변경 여부
- 바깥 별도 `프리미엄 분석` 버튼 제거 여부
- 크게 보기 상단 버튼 순서 반영 여부
- 크게 보기 상단 버튼 문구 반영 여부
- `프리미엄 분석` 강조 색상 적용 여부
- 기존 AI 분석/기본 리포트/인쇄/돌아가기 기능 보존 여부

## 3. 실행 결과

- `node --check apmath/js/report.js`: PASS/FAIL
- `git status --short` 결과
- 문구 검색 결과 요약

## 4. 보존 확인

- 리포트 본문 문구 변경 없음
- 인쇄 로직 변경 없음
- AI 함수 삭제 없음
- 선생님 추가 메모 유지
- 학생 포털/OMR 변경 없음
- `report.js` 외 파일 수정 없음

## 5. 다음 조치

- 브라우저에서 바깥 버튼 문구 확인
- 크게 보기 진입 후 버튼 순서 확인
- 프리미엄 분석 버튼 강조 색상 확인
- 프리미엄 분석/기본 리포트/인쇄하기/돌아가기 클릭 확인

아래 항목도 반드시 적는다.

- 배포 실행 여부: 미실행 - 사용자 직접 실행 대상
- 운영 smoke 실행 여부: 미실행 - 사용자 직접 실행 대상
- git commit 실행 여부: 미실행 - 사용자 직접 실행 대상
- git push 실행 여부: 미실행 - 사용자 직접 실행 대상

## 최종 출력

터미널 마지막 출력은 반드시 아래 문장으로 끝낸다.

CODEX_RESULT_REPORT_BUTTONS.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF