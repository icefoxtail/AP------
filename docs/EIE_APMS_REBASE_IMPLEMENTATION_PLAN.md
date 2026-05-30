# EIE APMS 리베이스 구현 계획서

## 1. 최종 목표
EIE를 APMS 화면·상태·저장 흐름을 기준으로 영어관용으로 택갈이한다.

## 2. 고정 원칙
- APMS UI/UX 복사 기반
- EIE 데이터/API adapter 방식
- 로컬 상태는 draft에만 사용
- 원본 데이터는 `EieState.db` 기준
- 저장은 `EieApi` → Worker → D1
- 학생관리 우선 / 시간표 편집은 후순위

## 3. Round 1: EIE 공통 상태/API 호환 레이어 ✅ 완료 (2026-05-30)
- 신규 파일: `eie/js/apms-compat/eie-apms-state.js`, `eie-apms-api.js`, `eie-apms-ui-bridge.js`
- 수정 파일: `eie/index.html`, `eie/js/eie-state.js`, `eie/js/eie-api.js`
- 완료: EieState.db/ui 구조, EieApmsState, EieApmsApi, EieApmsUiBridge, window.api 설정, window.toast/closeModal/openModal/renderDashboard 제공

## 4. Round 1.1: 호환 레이어 보정 ✅ 완료 (2026-05-30)
- window.state = EieState.get() 제공
- api.get('students') APMS형 normalize
- 미구현 쓰기 EIE_NOT_IMPLEMENTED 고정
- apmath-home/index.html 범위 밖 변경 복원

## 5. Round 1.5: 학생 CRUD Worker/API 선구현 ✅ 완료 (2026-05-30)
- 목표: Round 2 학생관리 parity 전 Worker 저장 흐름 완성.
- 수정 파일: `apmath/worker-backup/worker/routes/eie.js`, `eie/js/eie-api.js`, `eie/js/apms-compat/eie-apms-api.js`

### 구현 완료
| endpoint | 설명 |
|---|---|
| POST /api/eie/students | 학생 직접 등록 (display_name 필수, grade/status/memo/phone 지원) |
| PATCH /api/eie/students/{id} | 학생 정보 수정 (whitelist update, phone upsert) |
| PATCH /api/eie/students/{id}/status | 상태 변경 (active/inactive/archived/needs_review/withdrawn) |
| DELETE /api/eie/students/{id} | soft delete (status → archived, 물리 삭제 없음) |
| EieApi.deleteStudent | eie-api.js에 추가 |

### schema 안전 처리
- eie_students 실제 컬럼만 사용: display_name, normalized_name, grade, status, memo, raw_meta_json, source_type, created_by, created_at, updated_at
- phone/school/pin 등 없는 컬럼은 eie_student_contacts 또는 raw_meta_json에 보관 (감으로 쓰지 않음)
- 물리 DELETE 없음

### 연락처 처리
- 학생 등록/수정 시 phone 계열 필드가 있으면 eie_student_contacts에 대표 연락처 upsert
- 연락처 실패해도 학생 저장은 성공, warnings 배열에 기록
- 연락처 별도 CRUD endpoint (POST/PATCH/DELETE student-contacts)는 미구현

### D1/배포
- D1 migration 실행 없음
- Worker deploy 없음
- 로컬 routes/eie.js 수정만 완료

## 6. Round 2: EIE 학생관리 APMS parity
- 대상 파일: `eie/js/views/eie-students.js` 교체/확장
- **Round 2 전 확인 필요**:
  - 실제 Worker 배포 전에는 브라우저 저장 테스트 불가 (routes/eie.js 수정만 존재)
  - Worker 배포 없이 학생 등록/수정/삭제를 실제 테스트하려면 wrangler dev 실행 필요
- **Round 2에서 남은 주의점**:
  - APMS student.js 복사 시 CONFIG.API_BASE, getTeacherNameForUI, copyPhoneNumber 등 추가 bridge 필요 가능성
  - 연락처 상세 편집 endpoint 부족 → 연락처 편집은 준비중으로 처리 필요
  - 상담/숙제/출결은 여전히 not_implemented

## 7. Round 3: 상담/연락처/메모
- Worker endpoint 필요: GET/POST/PATCH/DELETE /api/eie/consultations, POST/PATCH/DELETE /api/eie/student-contacts

## 8. Round 4: 클래스룸/출결/숙제
- APMS renderClass형 운영 화면
- Worker endpoint 필요: /api/eie/attendance, /api/eie/homework, /api/eie/classroom-logs

## 9. Round 5: 시간표 v2 연동
- 학생 상세 ↔ 시간표 ↔ 클래스룸 연결 완성

## 10. Round 2 진입 전 조건 체크리스트
| 조건 | 상태 |
|---|---|
| window.state 제공 | ✅ (Round 1.1) |
| api.get('students') normalize | ✅ (Round 1.1) |
| 미구현 쓰기 not_implemented | ✅ (Round 1.1) |
| POST students Worker | ✅ (Round 1.5) |
| PATCH students/{id} Worker | ✅ (Round 1.5) |
| PATCH students/{id}/status Worker | ✅ (Round 1.5) |
| DELETE students/{id} (soft) Worker | ✅ (Round 1.5) |
| eie-students.js APMS parity | ❌ (Round 2 대상) |
| Worker 실제 배포 | ❌ (Round 2 전 배포 필요) |

## 11. 위험 관리
- Worker 미배포 → 브라우저에서 새 endpoint 호출 불가
- schema와 컬럼 불일치 → PRAGMA table_info 검증 또는 try/catch fallback
- timetable_cell_id → class_id adapter → Round 2+ 검토
- 없는 Worker endpoint → EIE_NOT_IMPLEMENTED (정상 차단)
