# EIE APMS 호환 State/API 명세서

## 1. 목표
APMS 복사 코드가 EIE에서 돌아갈 수 있도록 호환 state/api 층을 만든다.

## 2. Round 1.5 추가 완료 항목 (2026-05-30)

### 학생 CRUD Worker endpoint 신규 추가
- `POST  /api/eie/students` — 학생 직접 등록
- `PATCH /api/eie/students/{id}` — 학생 정보 수정
- `PATCH /api/eie/students/{id}/status` — 학생 상태 변경
- `DELETE /api/eie/students/{id}` — 학생 soft delete (status → archived, 물리 삭제 없음)

### EieApi 추가
- `deleteStudent(studentId)` — DELETE students/{id}

### EieApmsApi 학생 쓰기 매핑 해제
- POST students: EieApi.createStudent + normalizeStudentWriteResult
- PATCH students/{id}: EieApi.updateStudent + normalizeStudentWriteResult
- PATCH/POST students/{id}/status: EieApi.updateStudentStatus + normalizeStudentWriteResult
- DELETE students/{id}: EieApi.deleteStudent + normalizeStudentWriteResult

### 수정 파일
- `apmath/worker-backup/worker/routes/eie.js` — 학생 CRUD 핸들러 4개 추가
- `eie/js/eie-api.js` — deleteStudent 추가
- `eie/js/apms-compat/eie-apms-api.js` — 학생 쓰기 매핑 해제 및 normalize

## 3. Round 1.1 보정 완료 항목 (2026-05-30)

### 보정 내용
- **window.state 제공**: `eie-apms-state.js` 로드 시 `window.state = EieState.get()` 참조 연결.
- **GET students normalize**: `{ success: true, data: [...] }` 구조로 고정.
- **쓰기 endpoint not_implemented 고정**: 모든 미구현 쓰기 경로 차단.
- **apmath-home/index.html 복원**: git restore 완료.

## 4. window.state 제공 정책
- `eie-apms-state.js` 로드 완료 시점에 `window.state = EieState.get()` 설정.
- `EieState.get()` 참조를 그대로 연결 (복사본 아님).
- 이미 `window.state`가 있으면 덮어쓰지 않는다.

## 5. window.api 제공 정책
- `eie-apms-api.js` 로드 시 `window.api`가 없으면 `window.api = window.EieApmsApi` 설정.
- 이미 있으면 `window.eieApiAdapter = window.EieApmsApi`.

## 6. GET students normalize 정책
- `EieApi.getStudents()` 원본을 그대로 반환하지 않음.
- `EieApmsState.normalizeFoundation(payload, null)` 경유 후 `{ success: true, data: [...] }` 반환.

## 7. soft delete 정책
- `DELETE /api/eie/students/{id}` 는 물리 삭제 없음.
- `eie_students.status = 'archived'`로 변경하는 soft delete.
- 응답: `{ success: true, soft_deleted: true, archived: true, student: {...} }`

## 8. 연락처 처리 범위 (Round 1.5)
- 학생 생성/수정 시 phone 계열 필드가 있으면 `eie_student_contacts`에 대표 연락처 upsert.
- 연락처 실패 시 학생 생성/수정은 성공하고 `warnings` 배열에 실패 내용 기록.
- 연락처 별도 CRUD endpoint (`POST/PATCH/DELETE student-contacts`)는 이번 라운드 미구현.

## 9. EieApmsApi 응답 normalize 정책
- POST/PATCH/DELETE students 계열 응답을 `normalizeStudentWriteResult`로 정규화:
  ```js
  { success: true, data: student, student, contacts: [], warnings: [] }
  ```

## 10. 현재 EIE_NOT_IMPLEMENTED 목록 (Round 1.5 이후)
- POST consultations
- PATCH consultations/{id}
- DELETE consultations/{id}
- POST parent-foundation/contacts
- PATCH parent-foundation/contacts/{id}
- POST attendance
- PATCH attendance/{id}
- POST homework
- PATCH homework/{id}
- POST class-daily-records
- PATCH class-daily-records/{id}
- POST timetable-cells/{id}/students
- DELETE timetable-cells/{id}/students/{studentId}

## 11. Worker에 실제 존재하는 endpoint (Round 1.5 기준)
- GET /api/eie/confirmed-students → `api.get('students')`
- GET /api/eie/timetable → `api.get('timetable')`
- POST /api/eie/timetable-cells → `api.post('timetable-cells', payload)`
- PATCH /api/eie/timetable-cells/{id} → `api.patch('timetable-cells/{id}', payload)`
- PATCH /api/eie/timetable-cells/{id}/status
- POST /api/eie/students ← Round 1.5 신규
- PATCH /api/eie/students/{id} ← Round 1.5 신규
- PATCH /api/eie/students/{id}/status ← Round 1.5 신규
- DELETE /api/eie/students/{id} (soft delete) ← Round 1.5 신규

## 12. EieState.db 구조
- `students`: EIE confirmed-students 응답을 APMS 학생 필드로 projection한 배열.
- `student_contacts`: student.contacts 원본 row.
- `parent_contacts`: is_primary 연락처.
- `consultations`: 항상 빈 배열 (Round 3+ 예정).
- `class_students`: timetable_cell assigned_students projection.
- `timetable_cells`: eie_timetable_cells 원본.
- `attendance`, `homework`, `class_daily_records` 등: 항상 빈 배열 (Round 4+ 예정).

## 13. timetable_cell_id를 class_id adapter로 사용하는 정책
- EIE에 `eie_classes` 테이블 없음. `timetable_cell_id`를 `class_id` 역할로 사용.
- Round 2+ 이후 eie_classes 테이블 추가 시 재검토.

## 14. eie_students 실제 컬럼 (Round 6 migration 기준)
- id, display_name, normalized_name, grade, status, source_type, source_import_session_id, source_cell_id, memo, raw_meta_json, created_by, created_at, updated_at
- phone, school, student_name_raw, pin 컬럼 없음 → phone은 eie_student_contacts, 나머지는 raw_meta_json 보관

## 15. Round 2 학생관리 parity 진입 가능 조건
1. window.state 제공 ✅ (Round 1.1)
2. api.get('students') normalize ✅ (Round 1.1)
3. 미구현 쓰기 not_implemented 고정 ✅ (Round 1.1)
4. POST/PATCH/DELETE students Worker endpoint ✅ (Round 1.5)
5. EieApi deleteStudent ✅ (Round 1.5)
6. `eie/js/views/eie-students.js` APMS parity 교체 ❌ (Round 2 대상)

## 16. 금지 구조
- view 파일 내부 `_students`를 원본처럼 쓰는 구조
- 저장 성공 전 상태 확정
- Worker/D1 없이 로컬에서만 업데이트
- frontend 함수만 있고 Worker endpoint가 없는 API를 저장 완료처럼 처리하는 구조
- 물리 DELETE
