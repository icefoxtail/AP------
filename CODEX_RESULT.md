# EIE P1 CRUD Auth Stabilization Result

## 수정 파일
- eie/js/eie-api.js
- eie/js/views/eie-students.js
- workers/wangji-eie-worker/index.js
- workers/wangji-eie-worker/routes/eie.js
- workers/wangji-eie-worker/migrations/20260619_eie_student_contacts_deleted_at.sql
- CODEX_RESULT.md

## 해결한 문제
- EIE 학생 상세 출결 저장 cell context 누락
- EIE 연락처 삭제 front/backend mismatch
- EIE disabled teacher session 유지 위험
- EIE GET 실패 stub masking

## 핵심 변경
- 학생 상세 출결 저장 시 학생 배정, return context, 기존 당일 기록에서 `timetable_cell_id`를 resolve해 payload에 포함
- cell 후보가 없거나 여러 개라 특정할 수 없는 경우 저장하지 않고 안내
- 연락처 삭제 버튼을 기존 `deleteStudentContact()` wrapper와 `student-contacts/:id` DELETE route에 연결
- `eie_student_contacts.deleted_at` 최소 migration과 Worker self-heal을 추가
- 연락처 삭제는 `deleted_at` soft delete로 처리하고 조회/학생 상세/대표 연락처 join에서 삭제 연락처 제외
- 삭제된 동일 번호 연락처 재추가 시 기존 row를 복구해 unique 충돌 방지
- disabled/archived teacher session은 verify 단계에서 거부하고 현재 세션 revoke
- teacher PATCH로 `role=disabled` 전환하거나 DELETE teacher 처리 시 기존 `teacher_sessions` revoke
- critical GET 실패는 throw 유지, optional import/contact-seeds/needs-review만 명시적 fallback 허용
- fallback 응답에 `stub`, `fallback`, `source`, `warning`을 명시

## 검수 결과
- 학생 상세 출결 저장: PASS (payload에 `timetable_cell_id` 포함, missing/ambiguous cell은 안내 후 저장 중단)
- 연락처 삭제: PASS (`student-contacts/:id` DELETE soft delete, 조회 제외, 추가/수정 유지, 삭제 duplicate 복구 확인)
- disabled teacher session: PASS (verify 차단, role disable/teacher DELETE 시 session revoke)
- GET 실패 fallback: PASS (critical GET throw, optional fallback metadata 확인)
- EIE 401/403: PASS (기존 auth notify/throw 흐름 유지)
- node --check: PASS (`eie-api.js`, `eie-students.js`, `index.js`, `routes/eie.js`)
- git diff --check: PASS (공백 오류 없음, LF-to-CRLF warning만 출력)
- 검색 확인: PASS (요구 패턴 확인)
- 런타임 브라우저/운영 D1 시나리오: UNVERIFIED (정적 검수 기준)

## 수정하지 않은 항목
- AP 학생 status 재수정 없음
- AP 학급 archive 재수정 없음
- Archive 수정 없음
- Student Portal 수정 없음
- EIE 시간표 UI/레이아웃 변경 없음

## 남은 위험
- 실제 운영 Worker와 repo worker가 다르면 배포본 확인 필요
- disabled session revoke는 운영 세션 데이터 확인 필요
- 운영 D1 row 보존과 브라우저 Network payload는 배포 환경에서 최종 확인 필요
