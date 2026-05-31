# EIE APMS 호환 State/API 명세서

## 1. 목표
APMS 복사 코드가 EIE에서 돌아갈 수 있도록 호환 state/api 층을 만든다.

## 2. Round 1.5 + 1.6 현재 상태 (2026-05-30)

### 학생 쓰기 API (EieApmsApi 연결 완료)
- `api.post('students', payload)` → `EieApi.createStudent` → Worker `POST /api/eie/students`
- `api.patch('students/{id}', payload)` → `EieApi.updateStudent` → Worker `PATCH /api/eie/students/{id}`
- `api.patch('students/{id}/status', payload)` → `EieApi.updateStudentStatus` → Worker `PATCH /api/eie/students/{id}/status`
- `api.delete('students/{id}')` → `EieApi.deleteStudent` → Worker `DELETE /api/eie/students/{id}` (soft delete)
- 응답 normalize: `{ success, data: student, student, contacts, warnings }`

### 단, 실제 Worker 배포 전에는 브라우저 저장 테스트 불가
- `apmath/worker-backup/worker/routes/eie.js`에 코드 반영 완료 (커밋 `865509a`)
- 실제 `wangji-eie-os.js-pdf.workers.dev` Worker에 배포 여부: **미확인 (배포 보류)**
- 배포 절차: `docs/EIE_WORKER_DEPLOY_SOP.md` 참조

### remote D1 schema와 Worker source 일치 조건
- eie_students 필수 컬럼: id, display_name, normalized_name, grade, status, memo, raw_meta_json, created_at, updated_at
- eie_student_contacts 필수 컬럼: id, student_id, phone, normalized_phone, contact_label, is_primary, created_at, updated_at
- remote D1 확인 명령: `npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(eie_students);"`

### 연락처 별도 CRUD 미구현
- 학생 생성/수정 시 phone 필드로 대표 연락처 upsert 가능
- 별도 연락처 CRUD endpoint (`POST/PATCH/DELETE student-contacts`) 미구현
- Round 3에서 추가 예정

### 계속 EIE_NOT_IMPLEMENTED인 endpoint
- POST consultations
- PATCH/DELETE consultations
- POST/PATCH parent-foundation/contacts
- POST/PATCH attendance, homework, class-daily-records
- POST timetable-cells/{id}/students
- DELETE timetable-cells/{id}/students/{studentId}

## 3. window.state 제공 정책
- `eie-apms-state.js` 로드 완료 시점에 `window.state = EieState.get()` 설정 (참조 연결, 복사본 아님)
- 이미 `window.state`가 있으면 덮어쓰지 않는다.

## 4. window.api 제공 정책
- `eie-apms-api.js` 로드 시 `window.api`가 없으면 `window.api = window.EieApmsApi` 설정.
- 이미 있으면 `window.eieApiAdapter = window.EieApmsApi`.

## 5. GET students normalize 정책
- `EieApi.getStudents()` 원본을 그대로 반환하지 않음.
- `EieApmsState.normalizeFoundation(payload, null)` 경유 후 `{ success: true, data: [...] }` 반환.

## 6. soft delete 정책
- `DELETE /api/eie/students/{id}` 물리 삭제 없음.
- `eie_students.status = 'archived'`.
- 응답: `{ success: true, soft_deleted: true, archived: true, student: {...} }`

## 7. eie_students 실제 컬럼 (Round 6 migration 기준)
- id, display_name, normalized_name, grade, status, source_type, source_import_session_id, source_cell_id, memo, raw_meta_json, created_by, created_at, updated_at
- phone, school, student_name_raw, pin 컬럼 없음 → phone은 eie_student_contacts, 나머지는 raw_meta_json

## 8. EieState.db 구조
- `students`: EIE confirmed-students projection
- `student_contacts`: student.contacts 원본
- `parent_contacts`: is_primary 연락처
- `consultations`: 항상 빈 배열 (Round 3+ 예정)
- `class_students`: timetable_cell assigned_students projection
- `timetable_cells`: eie_timetable_cells 원본
- `attendance`, `homework` 등: 항상 빈 배열 (Round 4+ 예정)

## 9. timetable_cell_id를 class_id adapter로 사용하는 정책
- EIE에 `eie_classes` 테이블 없음. `timetable_cell_id`를 `class_id` 역할로 사용.
- Round 2+ 이후 재검토.

## 10. Worker에 실제 존재하는 endpoint (Round 1.5 코드 기준)
- GET  /api/eie/confirmed-students
- GET  /api/eie/timetable
- POST /api/eie/timetable-cells
- PATCH /api/eie/timetable-cells/{id}
- PATCH /api/eie/timetable-cells/{id}/status
- POST  /api/eie/students ← Round 1.5 신규 (코드 완료, 배포 미확인)
- PATCH /api/eie/students/{id} ← Round 1.5 신규 (코드 완료, 배포 미확인)
- PATCH /api/eie/students/{id}/status ← Round 1.5 신규 (코드 완료, 배포 미확인)
- DELETE /api/eie/students/{id} ← Round 1.5 신규 (soft delete, 코드 완료, 배포 미확인)

## 11. Round 2 학생관리 parity 진입 가능 조건
1. window.state 제공 ✅
2. api.get('students') normalize ✅
3. 미구현 쓰기 not_implemented 고정 ✅
4. POST/PATCH/DELETE students Worker 코드 ✅ (커밋 865509a)
5. EIE Worker 실제 배포 ❌ (배포 보류)
6. remote D1 schema 확인 ❌ (직접 확인 필요)
7. eie-students.js APMS parity ❌ (Round 2 대상)

## 12. 금지 구조
- view 파일 내부 `_students`를 원본처럼 쓰는 구조
- 저장 성공 전 상태 확정
- Worker/D1 없이 로컬에서만 업데이트
- frontend 함수만 있고 Worker endpoint가 없는 API를 저장 완료처럼 처리
- 물리 DELETE
# Round 3 Contact/Consultation Compat Notes (2026-05-31)

- `EieApi` now exposes `getStudentContacts`, `createStudentContact`, `updateStudentContact`, `deleteStudentContact`, `getConsultations`, `createConsultation`, `updateConsultation`, and `deleteConsultation`.
- `EieState` now supports per-student merge helpers for contacts and consultations so student detail tabs can hydrate only the selected student's rows without replacing unrelated state.
- `EieApmsApi` maps APMS-style `parent-foundation/contacts` and `consultations` calls to the EIE Worker endpoints when a concrete student/contact/consultation id is present.
- Contact and consultation DELETE calls intentionally flow to Worker endpoints that return deferred/not-implemented responses, because the current tables do not have archive/status columns.
