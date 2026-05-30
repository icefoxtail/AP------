# EIE APMS 리베이스 구현 계획서

## 1. 최종 목표
EIE를 APMS 화면·상태·저장 흐름을 기준으로 영어관용으로 택갈이한다.

## 2. 고정 원칙
- APMS UI/UX 복사 기반
- EIE 데이터/API adapter 방식
- 로컬 상태는 draft에만 사용
- 원본 데이터는 `EieState.db` 기준
- 저장은 `EieApi` → Worker → D1
- 학생관리 우선
- 시간표 편집은 후순위

## 3. Round 1: EIE 공통 상태/API 호환 레이어 ✅ 완료 (2026-05-30)
- 신규 파일: `eie/js/apms-compat/eie-apms-state.js`, `eie/js/apms-compat/eie-apms-api.js`, `eie/js/apms-compat/eie-apms-ui-bridge.js`.
- 수정 파일: `eie/index.html`, `eie/js/eie-state.js`, `eie/js/eie-api.js`.
- 완료 항목:
  - `EieState.get().db.*` 구조 존재 및 초기화.
  - `EieState.get().ui.*` 구조 존재.
  - `EieApmsState.loadFoundation()` 호출 시 confirmed-students + timetable 적재.
  - `window.api = window.EieApmsApi` 설정.
  - `window.toast`, `window.closeModal`, `window.openModal`, `window.renderDashboard`, `window.apEscapeHtml`, `window.apmsInvalidateDataIndexes`, `window.returnToPreviousManagementView` 제공.

## 4. Round 1.1: 호환 레이어 보정 ✅ 완료 (2026-05-30)
- 외부감사 FAIL 4개 보정.

### 보정 1: apmath-home/index.html 범위 밖 변경 제거
- `git restore apmath-home/index.html` 실행. git status에서 제거 확인.

### 보정 2: window.state 제공
- `eie-apms-state.js` 하단에 `window.state = EieState.get()` 추가.
- EieState.get()의 참조를 그대로 연결 (복사본 아님).
- 이미 window.state가 있으면 덮어쓰지 않음.

### 보정 3: api.get('students') APMS형 normalize
- `EieApi.getStudents()` 원본을 그대로 반환하지 않음.
- `EieApmsState.normalizeFoundation(payload, null)` 거쳐 `{ success: true, data: [...] }` 형태로 반환.

### 보정 4: Worker 없는 쓰기 endpoint EIE_NOT_IMPLEMENTED 고정 (B안)
- POST students, PATCH students/{id}, PATCH/POST students/{id}/status → not_implemented
- POST/PATCH/DELETE consultations → not_implemented
- POST/PATCH parent-foundation/contacts → not_implemented
- POST/PATCH attendance/homework/class-daily-records → not_implemented
- POST timetable-cells/{id}/students, DELETE timetable-cells/{id}/students/{studentId} → not_implemented
- 기존에 EieApi.createStudent/updateStudent/updateStudentStatus/assignStudentToCell/removeStudentFromCell으로 연결했던 경로 모두 차단.

### Round 1.1 완료 후 git status 확인
- apmath-home/index.html: 복원 완료, diff 없음.
- eie/js/views/: diff 없음.

## 5. Round 2 진입 전 필수 조건 (현재 상태)
| 조건 | 상태 |
|---|---|
| window.state 제공 | ✅ 완료 (Round 1.1) |
| api.get('students') normalize | ✅ 완료 (Round 1.1) |
| 미구현 쓰기 not_implemented 고정 | ✅ 완료 (Round 1.1) |
| apmath-home/index.html 범위 밖 제거 | ✅ 완료 (Round 1.1) |
| Worker 학생 CRUD endpoint | ❌ 미구현 |
| eie-students.js APMS parity | ❌ 미구현 |

## 6. Round 2: EIE 학생관리 APMS parity
- 목표: EIE 학생관리를 APMS student.js 화면 구조 기반으로 이식.
- 대상 파일: `eie/js/views/eie-students.js` 교체/확장.
- Worker 선행 조건: `POST /api/eie/students`, `PATCH /api/eie/students/{id}`, `PATCH /api/eie/students/{id}/status` 추가 필요.

**Round 2 진입 선택지:**
- A안 (권장): Worker 학생 CRUD endpoint 선구현 → 학생관리 parity 진행. 저장 흐름 완전히 동작.
- B안: 학생관리 parity UI를 먼저 붙이되 저장 버튼을 "준비중"으로 차단. Worker endpoint는 Round 3에서 추가.

**Round 2 전 반드시 판정:** Worker endpoint 보강 여부를 먼저 결정한다.

## 7. Round 3: 상담/연락처/메모
- Worker endpoint 필요: `GET/POST/PATCH/DELETE /api/eie/consultations`, `POST/PATCH/DELETE /api/eie/student-contacts`.
- APMS 상담 탭, 보호자 연락처 UX 이식.

## 8. Round 4: 클래스룸/출결/숙제
- APMS `renderClass`형 운영 화면으로 교체.
- Worker endpoint 필요: `/api/eie/attendance`, `/api/eie/homework`, `/api/eie/classroom-logs`.

## 9. Round 5: 시간표 v2 연동
- 학생 상세 ↔ 시간표 ↔ 클래스룸 연결 완성.

## 10. 위험 관리
- 없는 Worker endpoint → EIE_NOT_IMPLEMENTED (Round 1.1에서 고정).
- state/db 불일치 → EieState.db 원본 기준, view 내부 배열은 draft/cache로 제한.
- API 응답 구조 불일치 → normalizeFoundation에서 표준화.
- timetable_cell_id → class_id adapter → Round 2 이후 실제 class 테이블 추가 시 재검토.
