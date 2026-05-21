# AP_MATH_DOMAIN

## A. 정책

- 기존 AP Math OS는 독립 실행 가능한 바닐라 JS 운영 앱으로 보존한다.
- 문제은행, OMR, QR, 리포트, 플래너, 출결, 숙제, 시간표는 기존 운영 자산이다.
- AP Math 화면을 새 SaaS 안에 임의 재구현하지 않는다.

## B. 현재 구현 구조

- frontend: `apmath/index.html`, `apmath/js/core.js`, `dashboard.js`, `classroom.js`, `student.js`, `management.js`, `timetable.js`, `report.js`, `qr-omr.js`
- 학생 접점: `apmath/student/index.html`, `apmath/planner/index.html`, `check/check.js`
- archive: `archive/engine.html`, `archive/mixed_engine.html`, archive exam JS files
- Worker: `apmath/worker-backup/worker/index.js`, routes 전체
- DB: students/classes/attendance/homework/exams/consultations/class_daily/material tables

## C. 데이터/API 흐름

`core.js`가 `initial-data`를 로드해 `state.db`에 저장하고, 각 화면이 같은 state와 `api` wrapper를 사용한다. 학생 포털/플래너/check는 별도 HTML에서 Worker API를 직접 호출한다.

## D. 회귀 위험

- `initial-data` 응답 key 변경
- 기존 버튼/문구/화면명 변경
- OMR 제출 정책 변경
- planner SSO storage key 변경
- archive/mixed engine fetch 경로 변경

## E. 추가 계획

AP Math는 기능 보호를 우선하고, 새 상위 OS는 AP Math를 감싸는 방식으로 확장한다. 성능/UX 개선은 기존 흐름과 문구를 보존한 작은 round로 진행한다.

## F. 작업 후 업데이트 규칙

AP Math 기능 변경 시 관련 도메인, `CURRENT_FRONTEND_MAP.md`, `CURRENT_API_FLOW_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`, `CODEX_RESULT.md`를 업데이트한다.

