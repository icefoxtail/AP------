# CODEX_RESULT

## 1. 생성/수정 파일

- 생성: `CORE2_LAZY_LOAD_COVERAGE_PLAN.md`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

- 6개 key의 replacement API 존재 여부, 응답 key, query filter, admin/teacher 권한 범위, lazy loader 저장 위치를 확인했다.
- 구현은 수행하지 않았다.
- `/api/initial-data` 응답 축소, route 수정, 새 API 추가, lazy loader 구현, DB 수정, UI 문구 변경, 배포, 운영 API smoke test, git add/commit/push는 수행하지 않았다.

## 3. 실행 결과

- 기준 문서와 대상 route/frontend 파일을 읽기 전용으로 확인했다.
- `git status --short` 결과:
  - ` M docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
  - `?? CODEX_RESULT.md`
  - `?? CODEX_RESULT_PARENT_FOUNDATION_AUDIT.md`
  - `?? CODEX_RESULT_STUDY_MATERIAL_STUDENT_EDITABLE.md`
  - `?? CORE2_INITIAL_DATA_NEXT_SPLIT_ANALYSIS.md`
  - `?? CORE2_LAZY_LOAD_COVERAGE_PLAN.md`
- `git diff --name-only` 결과:
  - `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- 문서 파일 외 코드 파일 변경은 확인되지 않았다.
- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`, `CODEX_RESULT_PARENT_FOUNDATION_AUDIT.md`, `CODEX_RESULT_STUDY_MATERIAL_STUDENT_EDITABLE.md`, `CORE2_INITIAL_DATA_NEXT_SPLIT_ANALYSIS.md`는 이번 작업에서 생성/수정하지 않았다.

## 4. 결과 요약

- `student_enrollments`: `GET /api/enrollments`가 있고 `student_id`, `class_id` filter가 있어 API coverage는 충분하다. 현재 판정은 `needs loader`.
- `timetable_conflict_logs`: `GET /api/timetable-conflicts`는 있으나 `limit`, `class_id` filter가 부족하다. 현재 판정은 `needs api`.
- `parent_contacts`: `GET /api/parent-foundation/contacts`는 있으나 `student_id` filter가 부족하다. 현재 판정은 `needs api`.
- `message_logs`: `GET /api/parent-foundation/messages`는 있으나 `student_id`, 상태/채널/type, `limit` filter가 부족하다. 현재 판정은 `needs api`.
- `student_status_history`: `GET /api/foundation-logs/status-history`는 있으나 `student_id`, `limit` filter가 부족하다. 현재 판정은 `needs api`.
- `class_transfer_history`: `GET /api/foundation-logs/class-transfers`는 있으나 `student_id`, `class_id`, `limit` filter가 부족하다. 현재 판정은 `needs api`.

## 5. 다음 조치

- 먼저 `student_enrollments` loader 구현을 별도 작업으로 진행한다.
- 로그/연락처/이력 계열은 read-only API filter와 limit 보강을 먼저 설계/구현한 뒤 lazy loader를 붙인다.
- 실제 `/api/initial-data` 축소는 위 API/loader 검증 후 별도 phase에서 진행한다.
