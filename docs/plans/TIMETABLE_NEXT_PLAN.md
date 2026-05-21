# TIMETABLE_NEXT_PLAN

## 1. 현재 상태

`apmath/js/timetable.js`, `timetable-versions`, `timetable-conflicts`, `class-time-slots`가 존재한다. schema와 migrations에 운영 time slots와 version/staging tables가 있다.

시간표 화면에는 현재 보기 조건을 기준으로 A4 가로 인쇄 전용 HTML을 생성하는 1차 인쇄 기능이 있다.

## 2. 최종 목표

운영 시간표와 새학기 개편안 staging을 완전히 분리하고, preview/review/apply를 안전하게 운영한다.

## 3. 절대 금지/보류

- draft 작업으로 운영 `classes`, `class_students`, `class_time_slots`, `student_enrollments` 직접 훼손 금지
- 전체/강사별/과목별/대상별/교실별/반별/지점별 view 버튼 기본 과다 노출 금지
- 사용자 확인 없는 UI 문구 확정 금지

## 4. Phase 구조

| Phase | 작업 |
|---|---|
| 1 | 현재 staging/version 데이터 구조 실사 |
| 2 | draft create/edit/preview 검수 |
| 3 | conflict 기준 문서화 |
| 4 | apply 전 preflight/rollback/logging 설계 |
| 5 | UI 노출 최소화 검수 |
| 인쇄 후속 | A4 가로 출력 실제 미리보기 검수, 과밀 반/학생명 길이 보정 |

## 5. 수정 가능 파일

계획 확정 전에는 문서만. 구현 시 `timetable.js`, timetable routes, schema/migration은 별도 승인 필요.

## 6. 검증 기준

운영 데이터와 draft 데이터가 분리되고, conflict scan과 preview가 운영 row를 변형하지 않아야 한다.

## 7. 작업 후 업데이트 문서

`TIMETABLE_DOMAIN.md`, `CURRENT_DB_MAP.md`, `CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`
