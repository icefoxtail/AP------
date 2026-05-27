# TIMETABLE_NEW_SEMESTER_RESULT

## 1. 생성/수정 파일

- 수정: `apmath/js/timetable.js`
- 수정: `apmath/worker-backup/worker/routes/timetable-versions.js`
- 생성: `apmath/worker-backup/worker/migrations/20260520_timetable_version_student_assignments.sql`

## 2. 구현 완료

- 새학기/개편안 시간표 상단에 적용일 date input과 저장 버튼 추가
- `timetable_versions.effective_from` 저장 흐름 연결
- 새학기/개편안 시간표에서 새 반 추가 가능
- 개편안 새 반은 `classes.is_active = 0`으로 먼저 생성하여 운영 시간표에 즉시 섞이지 않도록 분리
- 새 반의 시간 배치는 `timetable_version_slots`에 저장
- 새학기/개편안 시간표에서 학생 드래그 배치 가능
- 학생 배치는 운영 `class_students`를 바로 바꾸지 않고 `timetable_version_student_assignments`에 staging 저장
- 새학기/개편안 시간표에서 학생 신규 추가 가능
- 신규 학생은 `입학예정` 상태로 생성하고 개편안 배치에만 연결
- 적용 시 개편안 slot을 운영 `class_time_slots`로 반영
- 적용 시 개편안 학생 배치를 운영 `class_students`와 `student_enrollments`에 반영
- 적용 시 개편안 신규 반은 `is_active = 1`로 활성화
- 적용 시 담당 선생님 매핑 `teacher_classes` 반영
- 적용 시 이동 학생은 `class_transfer_history` 기록
- 12월 + 다음 해 개편안 조건에서 중3 반은 렌더링 목록에서 제외되어 자리 차지 없이 빠짐

## 3. 실행 결과

- `node --check js/timetable.js` 통과
- `node --check routes/timetable-versions.js` 통과

## 4. 보존/주의

- 운영 시간표는 개편안 작성 중 즉시 변경하지 않음
- 운영 `class_students`, `student_enrollments`, `class_time_slots`는 적용 버튼 실행 전까지 변경하지 않음
- 선생님 계정 시간표 동작은 건드리지 않음
- 원장/admin 개편안 화면 기준으로만 새학기 작업 기능 추가
- 문구가 새로 들어간 부분은 검수 필요

## 5. 다음 조치

- Gemini/Claude/ChatGPT 검수 후 PASS 시 migration 1개만 D1에 적용
- Worker route 변경 포함이므로 검수 PASS 후 `wrangler deploy` 필요
- 브라우저에서 새학기 개편안: 적용일 저장, 새 반 추가, 학생 추가, 학생 드래그, 충돌 확인, 운영 시간표 적용 흐름 확인 필요
