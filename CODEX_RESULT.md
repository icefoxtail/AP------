# CODEX_RESULT

## 1. 생성/수정 파일

### 생성 파일
- 없음 (Round 1.5는 기존 파일 수정만)

### 수정 파일 (Round 1.5)
- `apmath/worker-backup/worker/routes/eie.js` — 학생 CRUD 핸들러 4개 추가, 라우트 4개 추가
- `eie/js/eie-api.js` — deleteStudent 추가
- `eie/js/apms-compat/eie-apms-api.js` — 학생 쓰기 매핑 해제, normalizeStudentWriteResult 추가
- `docs/EIE_APMS_STATE_API_COMPAT_SPEC.md` — Round 1.5 결과 업데이트
- `docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md` — Round 1.5 완료 상태 추가

### 범위 밖 기존 변경 (이번 라운드 미수정)
- `index.html` (루트): 이전 세션에서 수정된 범위 밖 변경. 이번 라운드에서 건드리지 않음.

## 2. 구현 완료

### Worker 학생 CRUD endpoint (apmath/worker-backup/worker/routes/eie.js)

| endpoint | 상태 |
|---|---|
| POST /api/eie/students | ✅ 구현 |
| PATCH /api/eie/students/{id} | ✅ 구현 |
| PATCH /api/eie/students/{id}/status | ✅ 구현 |
| DELETE /api/eie/students/{id} | ✅ soft delete 구현 |

**신규 helper 함수**:
- `normalizeStudentStatus(value, fallback)` — active/inactive/archived/needs_review/withdrawn 허용
- `getStudentById(env, studentId)` — eie_students 단건 조회
- `getStudentWithContacts(env, studentId)` — student + contacts 첨부 조회

**신규 핸들러 함수**:
- `handlePostStudent` — display_name 필수, phone 있으면 eie_student_contacts 생성, 연락처 실패는 warning 처리
- `handlePatchStudent` — whitelist update (display_name, grade, status, memo), phone upsert, ignored_fields 응답
- `handlePatchStudentStatus` — status 유효성 검증 후 UPDATE
- `handleDeleteStudent` — status = 'archived' (soft delete), 물리 삭제 없음

**schema 안전 처리**:
- eie_students 실제 컬럼만 사용 (round6 migration 기준 확인)
- phone/school/pin 등 없는 컬럼은 raw_meta_json 보관 또는 eie_student_contacts 사용
- 모든 SQL placeholder 개수와 params 개수 일치 확인

### EieApi deleteStudent 추가 (eie/js/eie-api.js)
```js
deleteStudent(studentId) -> DELETE students/{id}
```

### EieApmsApi 학생 쓰기 매핑 해제 (eie/js/apms-compat/eie-apms-api.js)
- POST students → EieApi.createStudent + normalizeStudentWriteResult
- PATCH students/{id} → EieApi.updateStudent + normalizeStudentWriteResult
- PATCH/POST students/{id}/status → EieApi.updateStudentStatus + normalizeStudentWriteResult
- DELETE students/{id} → EieApi.deleteStudent + normalizeStudentWriteResult
- 응답 형식: `{ success, data: student, student, contacts, warnings }`

### 계속 EIE_NOT_IMPLEMENTED
- POST/PATCH/DELETE consultations
- POST/PATCH parent-foundation/contacts
- POST/PATCH attendance/homework/class-daily-records
- POST timetable-cells/{id}/students
- DELETE timetable-cells/{id}/students/{studentId}

### soft delete 정책
- DELETE /api/eie/students/{id}는 status를 'archived'로 변경
- 물리 DELETE 없음
- 응답: `{ soft_deleted: true, archived: true }`

## 3. 실제 확인한 핵심 파일

### Worker 파일
- `apmath/worker-backup/worker/routes/eie.js`
- `apmath/worker-backup/worker/index.js` (읽기 전용 확인, 수정 없음)

### EIE API 파일
- `eie/js/eie-api.js`
- `eie/js/apms-compat/eie-apms-api.js`

### Migration/schema 파일
- `migrations/20260528_eie_round6_confirmed_students_contacts_assignments.sql` (컬럼 확인)

### 문서 파일
- `docs/EIE_APMS_STATE_API_COMPAT_SPEC.md`
- `docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md`

## 4. 실행 결과

### node --check 결과
```
apmath/worker-backup/worker/routes/eie.js   OK
eie/js/eie-api.js                           OK
eie/js/apms-compat/eie-apms-api.js          OK
eie/js/eie-state.js                         OK
eie/js/apms-compat/eie-apms-state.js        OK
eie/js/apms-compat/eie-apms-ui-bridge.js    OK
```

### 정적 검색 결과
- routes/eie.js에 `handlePostStudent`, `handlePatchStudent`, `handlePatchStudentStatus`, `handleDeleteStudent` 모두 존재
- routes/eie.js에 `eie_students`, `eie_student_contacts` SQL 모두 schema 기준 컬럼만 사용
- eie-apms-api.js에 `createStudent`, `updateStudent`, `updateStudentStatus`, `deleteStudent` 모두 연결 확인
- eie-apms-api.js에 EIE_NOT_IMPLEMENTED는 상담/출결/숙제/contacts 계열만 남아 있음
- eie-api.js에 `deleteStudent` 존재 확인

### 금지 view 파일 diff
- eie/js/views/ 전체 git diff 결과 0줄 ✅

### git diff --name-only
```
CODEX_TASK.md
apmath/worker-backup/worker/routes/eie.js
docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md
docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
eie/js/apms-compat/eie-apms-api.js
eie/js/eie-api.js
```

### git status --short
```
 M CODEX_TASK.md
 M apmath/worker-backup/worker/routes/eie.js
 M docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md
 M docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
 M eie/js/apms-compat/eie-apms-api.js
 M eie/js/eie-api.js
```

## 5. 구현하지 않은 것
- 학생관리 UI parity 미구현 (Round 2 대상)
- 클래스룸 UI parity 미구현 (Round 4 대상)
- 상담/숙제/출결 저장 미구현 (Round 3/4 대상)
- 연락처 별도 CRUD endpoint 미구현 (보류 사유: 이번 라운드 범위 밖)
- D1 migration 미실행
- Worker deploy 없음 (routes/eie.js 수정만 완료)
- git add/commit/push 없음

## 6. 남은 위험
- **Worker 실제 미배포**: routes/eie.js 수정만 있고 wrangler deploy 없음. 브라우저에서 새 endpoint 호출 불가.
- **실제 D1 컬럼 차이 가능성**: 로컬 migration 기준으로 구현. remote D1이 다른 schema를 가진다면 추가 확인 필요.
- **연락처 편집 endpoint 부족**: 연락처 별도 CRUD 없음. Round 2에서 연락처 편집 UI를 준비중으로 처리 필요.
- **APMS student.js 복사 시 추가 bridge 필요 가능성**: CONFIG.API_BASE, getTeacherNameForUI, copyPhoneNumber 등.
- **index.html (루트) 범위 밖 변경**: git status에 M으로 잡혀 있으나 이번 라운드 범위 밖.

## 7. 다음 라운드
- Round 2: EIE 학생관리 APMS parity
- Round 2 전 확인: Worker 실제 배포 전에는 브라우저 저장 테스트 불가
- Round 2 선택: Worker 배포 먼저 or 저장 버튼 준비중으로 차단하고 UI 먼저

## 8. review pack 경로
- `C:\Users\USER\Downloads\eie_apms_rebase_round1_5_student_crud_review_pack_20260530.zip`
