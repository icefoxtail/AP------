# ARCHIVE_OMR_DOMAIN

## A. 정책

- 학생 시험지 직접 열기 금지.
- 일반 OMR 제출 완료 후 수정/재입력/재제출 금지.
- `MIXED:{key}` 처리와 archive 원문/assets 태그 흐름을 보존한다.

## B. 현재 구현 구조

- frontend: `archive/engine.html`, `archive/mixed_engine.html`, `check/check.js`, `check/index.html`, `apmath/js/qr-omr.js`
- route: `routes/check-omr.js`, `routes/exams.js`
- DB: `exam_sessions`, `wrong_answers`, `exam_blueprints`, `class_exam_assignments`
- UI: check/QR/OMR, archive assignment, report archive details

## C. 데이터/API 흐름

archive engine은 시험 배정과 blueprint API를 호출한다. check는 `check-init`, `check-pin`, `exam-sessions/new`로 OMR 제출을 처리한다. QR/OMR은 session과 wrong_answers를 생성/갱신한다.

## D. 회귀 위험

- 제출 완료 후 수정 허용
- 학생에게 archive path 노출
- MIXED mapping 실패
- clinic print/wrong print 흐름 깨짐

## E. 추가 계획

wrong answer print, clinic print, archive asset 처리, OMR 제출 잠금 정책을 별도 검수 문서로 보강한다.

## F. 작업 후 업데이트 규칙

OMR/archive 변경 시 `CURRENT_FRONTEND_MAP.md`, `CURRENT_API_FLOW_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`, `ARCHIVE_OMR_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

