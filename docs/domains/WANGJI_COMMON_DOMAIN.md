# WANGJI_COMMON_DOMAIN

## A. 정책

- 왕지교육 OS는 AP Math를 대체하지 않는 상위 운영층이다.
- AP Math, 씨매쓰 초등, EIE 영어학원은 branch로 분리한다. 현재 문서 기준 branch 후보는 `apmath`, `cmath`, `eie`다.
- 학생/학부모 중복 생성을 피하고 공통 학생/보호자 foundation을 우선한다.
- foundation은 먼저 숨김 상태로 유지하고 UI 노출은 사용자 승인 후 진행한다.

## B. 현재 구현 구조

- 구조 문서: `docs/WANGJI_OS_STRUCTURE.md`, `docs/WANGJI_OS_ROADMAP.md`
- Worker foundation routes: `enrollments`, `class-time-slots`, `timetable-*`, `billing-*`, `parent-foundation`, `foundation-logs`, `foundation-sync`
- DB: `student_enrollments`, `billing_*`, `payments`, `payment_*`, `parent_contacts`, `message_logs`, `staff_permissions`, `audit_logs`, `privacy_access_logs`
- frontend: `apmath/js/management.js`, `apmath/js/wangji-foundation.js`, `apmath/js/timetable.js` 일부

## C. 데이터/API 흐름

상위 운영 기능은 frontend에서 route별 API를 호출하고, Worker route가 D1 foundation table을 조회/변경한다. UI에 드러나지 않는 기능은 hidden foundation으로 유지한다.

## D. 회귀 위험

- AP Math 기존 운영 화면을 상위 OS 화면으로 덮어쓰는 것
- branch scope 없는 데이터 조회
- 수납/학부모/감사 foundation을 기본 화면에 노출하는 것

## E. 추가 계획

- branch별 운영 정책 확정
- 씨매쓰/EIE 도메인 구체화
- 공통 학생/학부모/수납/상담/권한 foundation의 UI 노출 승인 절차 마련

## F. 작업 후 업데이트 규칙

공통 foundation 변경 시 `CURRENT_DB_MAP.md`, `CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_HIDDEN_FOUNDATION_MAP.md`, `MASTER_ROADMAP.md`, `CODEX_RESULT.md`를 업데이트한다.

