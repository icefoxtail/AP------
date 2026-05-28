# CODEX_RESULT

## 1. 생성/수정 파일

- 생성: `migrations/20260528_eie_round6_confirmed_students_contacts_assignments.sql`
- 수정: `apmath/worker-backup/worker/routes/eie.js`
- 수정: `eie/js/eie-api.js`
- 수정: `eie/js/eie-state.js`
- 수정: `eie/js/views/eie-dashboard.js`
- 수정: `eie/js/views/eie-student-seeds.js`
- 수정: `eie/js/views/eie-timetable.js`
- 수정: `eie/css/eie.css`
- 수정: `docs/EIE_WORKING_RULEBOOK.md`
- 수정: `docs/EIE_TIMETABLE_DATA_MODEL.md`
- 생성/수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

- EIE Round 6 학생·연락처·수업배정 확정 1차 구현.
- EIE 전용 확정 테이블 3개 migration 추가.
  - `eie_students`
  - `eie_student_contacts`
  - `eie_student_schedule_assignments`
- 후보 상세 패널에서 학생·연락처·수업배정 확정 버튼 추가.
- 학생 후보 화면에서 후보 행 단위 확정 버튼 추가.
- 확정 저장은 EIE 전용 테이블에만 수행.
- APMS `students`, `parent_contacts`, `class_students`, `student_enrollments` write 없음.
- v2 보정: `findConfirmedStudent()`에서 `normalized_name + source_import_session_id` 자동 병합 fallback 제거.
- v2 보정: 기존 확정 학생 재사용은 `normalized_name + normalized_phone`이 모두 일치하는 경우로만 제한.
- v2 보정: `POST /api/eie/confirm-candidate`에서 `body.candidate` 직접 주입 경로 제거.
- v2 보정: 확정 대상은 반드시 `cell_id`의 `raw_meta_json`에서 추출한 후보를 `candidate_index` 또는 `candidate_key`로 재조회한 값만 사용.
- v3 보정: 같은 `cell_id + candidate_index` 후보가 이미 확정된 경우 새 학생/연락처/수업배정을 만들지 않고 기존 확정 결과를 그대로 반환.
- v3 보정: `raw_meta_json.confirmed_student_candidates`에 확정 이력이 있으나 대상 학생 row가 사라진 경우 409로 중단해 중복 생성을 막음.
- 전화번호 없는 후보도 EIE 학생 확정 가능, 연락처 row는 생성하지 않음.
- 확정 후 source timetable cell `raw_meta_json.confirmed_student_candidates`에 확정 참조 기록.
- 확정 학생/수업배정 요약 조회 endpoint 추가.

## 3. 실행 결과

- `node --check eie/js/utils/eie-excel-parser.js` PASS
- `node --check eie/js/utils/eie-normalize.js` PASS
- `node --check eie/js/eie-api.js` PASS
- `node --check eie/js/eie-app.js` PASS
- `node --check eie/js/eie-router.js` PASS
- `node --check eie/js/eie-state.js` PASS
- `node --check eie/js/views/eie-dashboard.js` PASS
- `node --check eie/js/views/eie-import.js` PASS
- `node --check eie/js/views/eie-student-seeds.js` PASS
- `node --check eie/js/views/eie-timetable.js` PASS
- `node --check apmath/worker-backup/worker/routes/eie.js` PASS
- `python sqlite3 executescript migrations/20260528_eie_round6_confirmed_students_contacts_assignments.sql` PASS
- 금지 APMS 테이블 INSERT/UPDATE 검색 0건.
- classroom/attendance/homework/textbook 계열 생성 검색 0건.
- `body.candidate` 직접 주입 분기 검색 0건.
- `normalized_name + source_import_session_id` 자동 병합 fallback 검색 0건.
- 검수팩에는 위 node check 대상 파일을 모두 포함하도록 part01/part02로 분할함.

## 4. 결과 요약

Round 6는 EIE 후보를 정식 EIE 운영 데이터로 넘기는 첫 단계다. 단, APMS 공통 학생/학부모/반 배정에는 쓰지 않고, EIE 전용 학생·연락처·수업배정 테이블에만 기록한다. classroom, 출석, 숙제, 교재, 메모는 아직 생성하지 않는다.

v2에서는 동명이인 오병합과 임의 후보 주입 가능성을 막기 위해 확정 로직을 더 좁혔다. 같은 import session과 같은 이름만으로는 기존 학생을 재사용하지 않으며, 전화번호가 없거나 다른 경우 자동 병합하지 않는다. 또한 확정 요청은 클라이언트가 보낸 임의 candidate 객체를 신뢰하지 않고, 저장된 timetable cell의 raw 후보만 재조회해 사용한다.

v3에서는 전화번호 없는 후보를 같은 cell/candidate_index로 반복 확정할 때 중복 학생과 중복 배정이 생길 수 있는 idempotency 위험을 막았다. 이미 확정된 후보는 `raw_meta_json.confirmed_student_candidates`를 먼저 확인해 기존 student/contact/assignment를 그대로 반환하며, 불완전한 확정 메타는 409로 중단한다.

## 5. 다음 조치

1. migration을 D1에 적용한다.
2. Worker 배포 후 `/api/eie/confirmed-students`, `/api/eie/schedule-assignments` 조회를 확인한다.
3. EIE 화면에서 후보 1명을 확정해 학생/연락처/수업배정 row가 생성되는지 확인한다.
4. 같은 후보를 재확정해 새 학생 row가 추가로 생기지 않는지 확인한다.
5. 같은 이름+다른 전화번호 후보가 자동 병합되지 않는지 확인한다.
6. 임의 `body.candidate`를 보낸 confirm 요청이 raw 후보가 아니면 확정되지 않는지 확인한다.
7. APMS `/api/initial-data` 500 회귀가 없는지 확인한다.
8. Round 7에서 classroom/session으로 넘어가기 전 Round 6 확정 데이터의 중복·삭제·취소 정책을 먼저 정리한다.

검수팩 zip 경로:
- Gemini part01 core: `eie-round6-confirmation-review-pack-v3-part01-core-20260528.zip`
- Gemini part02 context: `eie-round6-confirmation-review-pack-v3-part02-context-20260528.zip`
