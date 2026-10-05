# TIMETABLE_DOMAIN

## A. 정책

- 운영 데이터와 새학기 개편안 staging 데이터를 분리한다.
- 운영 `classes`, `class_students`, `class_time_slots`, `student_enrollments`를 draft 작업으로 직접 훼손하지 않는다.
- `timetable_version_classes`, `version_class_id`, student assignments 방향을 우선한다.
- 시간 미정과 구분 라벨은 분리한다.
- 기본 view 버튼을 과다 노출하지 않는다.
- 중등 90분, 고등 120분 기준과 conflict 예외 기준을 보존한다.
- 학생 배정/이동 등 시간표 반 선택 드롭다운 option/확인 UI의 반 표시명은 중복 반명 방지를 위해 `반명 · 담당 · 요일/교시/시간` 기준으로 보강하되, DB 반명과 저장 id는 변경하지 않는다.
- 학생 추가/수정 등 공통 class select option 표시명은 `core.js`의 class option helper와 같은 기준을 공유하며, 표준 운영 시간대는 표시명에서만 1/2/3교시를 자동 추론한다.

## B. 현재 구현 구조

- frontend: `apmath/js/timetable.js`
- routes: `timetable-versions.js`, `timetable-conflicts.js`, `class-time-slots.js`, `enrollments.js`, `classes.js`
- DB: `class_time_slots`, `timetable_versions`, `timetable_version_slots`, `timetable_conflict_logs`, `timetable_conflict_overrides`, `timetable_version_classes`, `timetable_version_student_assignments`, `timetable_version_new_students`, `timetable_version_apply_logs`
- UI: 중등부/고등부, 전체 보기/내 반 보기 등 기존 문구 확인됨
- 반 표시명: 시간표 반 선택 드롭다운 option, 학생 배정/이동 확인 UI와 충돌 상세는 표시명만 보강하고 `classes.name`, `class_id`, `version_class_id`, `timetable_version_student_assignments` 저장 흐름은 유지한다. 시간표 카드 제목 자체는 변경 대상이 아니다.
- 인쇄: `timetable.js`에서 현재 화면 조건(중등부/고등부, 전체 보기/내 반 보기, 운영/초안)을 기준으로 A4 가로 인쇄 전용 HTML을 생성한다.

## C. 데이터/API 흐름

운영 시간표는 `classes`, `class_time_slots`를 사용하고, draft/version은 `timetable-versions`와 version tables를 사용한다. conflict scan은 route에서 class/time overlap을 계산해 conflict logs/preview를 반환한다.

## D. 회귀 위험

- draft 작업이 운영 class row를 덮어쓰는 것
- `class_students` 운영 배정을 직접 변경하는 것
- teacher/student/room conflict 기준 약화
- view 버튼 과다 노출
- 시간 미정과 라벨 혼선
- 반 선택 option/확인 UI 표시명 보강이 카드 반명, DB 반명, 배정 payload를 바꾸는 것
- 인쇄 시 화면 DOM/사이드바/필터를 그대로 출력해 A4 가로 폭이 잘리는 것

## E. 추가 계획

staging -> preview -> review -> apply 순서를 문서화하고, apply 후 새 운영 class row 생성 방향을 확정한다. apply/rollback/logging은 별도 검수 후 진행한다.

## F. 작업 후 업데이트 규칙

시간표 변경 시 `CURRENT_DB_MAP.md`, `CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`, `TIMETABLE_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.
