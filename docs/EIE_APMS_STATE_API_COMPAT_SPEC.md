# EIE APMS 호환 State/API 명세서

## 1. 목표
APMS 복사 코드가 EIE에서 돌아갈 수 있도록 호환 state/api 층을 만든다.

## 2. Round 1.1 보정 완료 항목 (2026-05-30)

### 보정 내용
- **window.state 제공**: `eie-apms-state.js` 로드 시 `window.state = EieState.get()`으로 참조 연결. 복사본 아님.
- **GET students normalize**: `api.get('students')` 반환값을 `EieApmsState.normalizeFoundation`을 거친 `{ success: true, data: [...] }` 구조로 고정.
- **쓰기 endpoint not_implemented 고정**: Worker endpoint가 없는 모든 쓰기 경로를 `EIE_NOT_IMPLEMENTED`로 명확히 차단. 성공처럼 처리하는 경로 없음.
- **apmath-home/index.html 복원**: Round 1.1 범위 밖 변경을 `git restore`로 제거.

### 수정 파일
- `eie/js/apms-compat/eie-apms-state.js` — window.state 제공 추가
- `eie/js/apms-compat/eie-apms-api.js` — GET students normalize, 쓰기 endpoint 전면 not_implemented 고정

## 3. window.state 제공 정책
- `eie-apms-state.js` 로드 완료 시점에 `window.state = EieState.get()` 설정.
- `EieState.get()`이 반환하는 객체 참조를 그대로 연결한다 (복사본 아님).
- APMS 복사 코드가 `state.db.*`, `state.ui.*`를 직접 접근할 수 있다.
- 이미 `window.state`가 존재하는 경우 덮어쓰지 않는다.

## 4. window.api 제공 정책
- `eie-apms-api.js` 로드 시 `window.api`가 없으면 `window.api = window.EieApmsApi`로 설정.
- 이미 `window.api`가 있으면 `window.eieApiAdapter = window.EieApmsApi`를 제공하고 덮어쓰지 않는다.

## 5. GET students normalize 정책
- `api.get('students')` 호출 시 `EieApi.getStudents()` 원본 응답을 그대로 반환하지 않는다.
- `EieApmsState.normalizeFoundation(payload, null)`을 거쳐 `foundation.students` 배열을 추출한다.
- 반환 형식: `{ success: true, data: Array<NormalizedStudent>, raw: originalPayload }`
- 학생이 없으면 `success: true, data: []`로 반환.
- 401/403은 숨기지 않고 throw.

## 6. 쓰기 endpoint EIE_NOT_IMPLEMENTED 정책 (B안 확정)
Worker endpoint가 확인되지 않은 모든 쓰기 API를 `EIE_NOT_IMPLEMENTED`로 차단한다.

### not_implemented 대상 (Round 1.1 기준)
1. `POST students`
2. `PATCH students/{id}`
3. `PATCH students/{id}/status`
4. `POST students/{id}/status`
5. `POST consultations`
6. `PATCH consultations/{id}`
7. `DELETE consultations/{id}`
8. `POST parent-foundation/contacts`
9. `PATCH parent-foundation/contacts/{id}`
10. `POST attendance`
11. `PATCH attendance/{id}`
12. `POST homework`
13. `PATCH homework/{id}`
14. `POST class-daily-records`
15. `PATCH class-daily-records/{id}`
16. `POST timetable-cells/{id}/students`
17. `DELETE timetable-cells/{id}/students/{studentId}`

### not_implemented 오류 형식
```js
error.message = 'EIE API endpoint not implemented: <METHOD> <path>'
error.code = 'EIE_NOT_IMPLEMENTED'
error.path = path
error.method = method
```

### Worker에 실제 존재하는 endpoint (Round 1 기준)
- `GET /api/eie/confirmed-students` → `api.get('students')`
- `GET /api/eie/timetable` → `api.get('timetable')`
- `POST /api/eie/timetable-cells` → `api.post('timetable-cells', payload)`
- `PATCH /api/eie/timetable-cells/{id}` → `api.patch('timetable-cells/{id}', payload)`
- `PATCH /api/eie/timetable-cells/{id}/status` → EieApi.updateTimetableCellStatus 직접 호출

## 7. EieState.db 구조
- `students`: EIE confirmed-students 응답을 APMS 학생 필드로 projection한 배열.
- `student_contacts`: student.contacts 원본 row.
- `parent_contacts`: student.contacts 중 relation=parent 또는 is_primary인 연락처.
- `consultations`: EIE 상담 endpoint 준비 후 적재할 배열 (현재 항상 빈 배열).
- `classes`: Round 1에서는 빈 배열. timetable_cell을 class adapter로 사용.
- `class_students`: timetable_cell의 assigned_students를 APMS class_students 형태로 projection한 배열.
- `timetable_cells`: eie_timetable_cells 원본 row (state.timetableCells와 동기화).
- `attendance`, `homework`, `class_daily_records`, `class_daily_progress`, `homework_records`, `attendance_records`, `classroom_logs`, `textbooks`, `materials`: 각 endpoint 준비 후 적재 예정 (현재 빈 배열).

## 8. EieState.ui 구조
- `currentStudentDetailId`: 현재 열린 학생 상세 ID
- `currentStudentDetailTab`: 현재 학생 상세 탭 (기본값: 'grade')
- `currentClassId`: 현재 선택된 클래스 ID
- `currentTimetableCellId`: 현재 선택된 시간표 셀 ID
- `currentClassroomId`: 현재 선택된 클래스룸 ID
- `studentDetailLazyData`: 학생 상세 지연 로드 데이터 캐시
- `studentConsultations`: `{ byStudent: {} }` 형태의 상담 UI 캐시
- `parentContactUi`: `{ byStudent: {} }` 형태의 보호자 연락처 UI 캐시
- `eieApmsCompat`: `{ loadedAt, loading, error, lastSource }` — 호환 레이어 로드 상태

## 9. timetable_cell_id를 class_id adapter로 사용하는 정책
- EIE에는 현재 APMS `classes` 테이블에 대응하는 `eie_classes` 테이블이 없다.
- Round 1에서는 `timetable_cell_id`를 `class_id` 역할로 adapter 처리한다.
- `normalizeAssignment`에서 `class_id = timetable_cell_id`로 설정한다.
- 실제 `eie_classes` 테이블을 만들지 않는다. Round 2 이후 필요 시 추가한다.

## 10. Round 2 학생관리 이식 전제 조건
1. `window.state = EieState.get()` 제공 완료 ✅ (Round 1.1)
2. `api.get('students')` APMS형 normalize 완료 ✅ (Round 1.1)
3. 미구현 쓰기 endpoint not_implemented 고정 완료 ✅ (Round 1.1)
4. **Round 2 진입 전 선택**:
   - A안: Worker에 `POST /api/eie/students`, `PATCH /api/eie/students/{id}`, `PATCH /api/eie/students/{id}/status` 선구현 후 학생관리 parity 진행.
   - B안: 학생관리 parity UI를 먼저 붙이되 저장 버튼을 "준비중"으로 차단하고, Worker endpoint는 Round 3에서 추가.
5. `eie/js/views/eie-students.js`를 APMS student.js 기반으로 교체 또는 확장.

## 11. 금지 구조
- view 파일 내부 `_students`를 원본처럼 쓰는 구조
- 저장 성공 전 상태 확정
- Worker/D1 없이 로컬에서만 업데이트
- 화면별 독립 DB 상태
- frontend 함수만 있고 Worker endpoint가 없는 API를 저장 완료처럼 처리하는 구조
