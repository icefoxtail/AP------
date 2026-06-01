# CODEX_RESULT

## 1. 생성/수정 파일
- 수정: `eie/js/views/eie-dashboard.js`
- 수정: `eie/js/views/eie-timetable-v2.js`
- 수정: `eie/js/views/eie-students.js`
- 수정: `eie/css/eie.css`
- 생성: `tests/eie-timetable-v2-student-detail-link.test.js`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료
- 대시보드의 `시간표` 진입 버튼을 기존 `timetable`에서 `timetable-v2`로 변경했습니다.
- `timetable-v2`의 카드, hover 영역, 상세 패널, 모바일 카드의 학생 이름을 클릭 가능한 버튼으로 통일했습니다.
- 학생 이름 클릭 시 화면 이동 없이 오른쪽 패널이 학생 상세 패널로 전환되도록 변경했습니다.
- 확정 학생 id가 있으면 오른쪽 패널에서 `수정` 버튼과 편집 폼을 제공하고, 저장 시 `EieApi.updateStudent(studentId, payload)`를 호출합니다.
- 학생 id가 없으면 이름 기반 상세 패널을 열되, 시간표 패널 내 직접 수정은 막고 안내 문구를 표시합니다.
- 학생 버튼 클릭이 시간표 세션 선택 이벤트와 충돌하지 않도록 학생 클릭을 먼저 처리하고 `stopPropagation()`을 적용했습니다.
- 학생관리의 `openDetail(studentId, returnCtx)`와 `setQuery(query, returnCtx)`가 시간표 v2 복귀 컨텍스트를 받을 수 있게 했습니다.
- 학생 상세에 `시간표로 돌아가기` 버튼을 추가했고, `EieTimetableV2View.openWithContext(returnCtx)`로 선택 요일/세션을 복원하게 했습니다.
- 시간표 오른쪽 패널에서 학생 수정 저장 후 `EieState.upsertStudent`, `EieApmsState.syncStudent`, `EieApmsState.loadFoundation({ force: true })` 흐름으로 공통 데이터를 강제 동기화하도록 보강했습니다.
- 시간표 v2 학생 칩에는 전화번호/연락처를 노출하지 않았습니다.

## 3. 확인한 핵심 동작
- 대시보드 시간표 버튼은 `/eie/#timetable-v2` route로 연결됩니다.
- 기존 `eie-timetable.js`는 수정하지 않았습니다.
- Worker, D1 migration, AP worker 백업, classroom/management/teacher 파일은 수정하지 않았습니다.
- 시간표 v2의 학생 버튼은 `data-eie-v2-student-id` 또는 `data-eie-v2-student-name`을 가지며, 오른쪽 패널 전환용 day/session/cell 컨텍스트도 함께 가집니다.

## 4. 실행 결과
- `node --check .\eie\js\views\eie-dashboard.js`: OK
- `node --check .\eie\js\views\eie-timetable-v2.js`: OK
- `node --check .\eie\js\views\eie-students.js`: OK
- `node --check .\eie\js\eie-state.js`: OK
- `node --check .\eie\js\apms-compat\eie-apms-state.js`: OK
- `node --check .\tests\eie-timetable-v2-student-detail-link.test.js`: OK
- `node tests\eie-owner-dashboard-ap-parity.test.js`: OK
- `node tests\eie-students-click-handlers.test.js`: OK
- `node tests\eie-timetable-v2-student-detail-link.test.js`: OK
- 금지 파일 diff 확인: `eie-timetable`, `eie-classroom`, `eie-management`, `eie-teacher`, `workers/wangji-eie-worker`, `apmath/worker-backup/worker`, `migrations` diff 없음

## 5. 구현하지 않은 것
- git add/commit/push 하지 않음
- wrangler deploy 하지 않음
- D1 migration 실행하지 않음
- Worker 수정하지 않음
- 기존 `eie/js/views/eie-timetable.js` 수정하지 않음
- 시간표 화면 안에 별도 학생 수정 UI를 만들지 않음
- 검수 zip 생성하지 않음

## 6. 남은 확인
- 브라우저에서 `/eie/#dashboard`의 시간표 버튼이 v2로 이동하는지 확인
- `/eie/#timetable-v2`에서 학생 이름 클릭 후 오른쪽 패널에 학생 상세가 뜨는지 확인
- 오른쪽 패널에서 학생 수정 저장 후 시간표 v2와 학생관리 데이터가 함께 갱신되는지 실제 데이터로 확인

---

## 7. 중간 보고 이후 추가 생성/수정 파일
- 수정: `eie/js/views/eie-dashboard.js`
- 수정: `eie/js/views/eie-students.js`
- 수정: `eie/js/views/eie-timetable-v2.js`
- 수정: `eie/js/views/eie-classroom.js`
- 수정: `eie/css/eie.css`
- 수정: `workers/wangji-eie-worker/routes/eie.js`
- 생성: `migrations/20260601_eie_student_info_class_teachers.sql`
- 수정: `tests/eie-students-click-handlers.test.js`
- 수정: `tests/eie-timetable-v2-student-detail-link.test.js`
- 수정: `tests/eie-student-worker-crud-parity.test.js`
- 생성: `tests/eie-classroom-multi-teacher.test.js`
- 수정: `CODEX_RESULT.md`

## 8. 중간 보고 이후 구현 완료
- 원장 대시보드에서 `출석부`를 준비중 비활성 버튼으로 변경했습니다.
- `오늘 운영`에서 `재원`만 클릭 가능하게 유지하고, `최근 등록`, `대기`, `확인 필요`는 표시 전용으로 비활성화했습니다.
- 학생관리 상단의 중복 `+ 신규 등록` 버튼과 APMS 설명 문구를 제거했습니다.
- 학생관리 필터에 `중1~고3` 학년 필터를 추가했습니다.
- 학생 등록/수정의 학년 입력을 자유 입력에서 고정 선택형으로 변경했습니다.
- 학생 정보 구조를 세 화면에서 동일하게 통일했습니다.
  - `학생명`
  - `학생구분`
  - `학년`
  - `학교`
  - `학생 연락처`
  - `학부모 연락처`
  - `보호자 관계`
  - `주소`
  - `차량`
  - `PIN`
  - `담당 선생님`
  - `상태`
  - `메모`
- 학생관리, 시간표 v2 오른쪽 패널, 클래스룸 학생 상세/수정이 같은 학생정보 필드와 같은 저장 payload를 사용하도록 맞췄습니다.
- `PIN`은 4자리 숫자 검증을 추가했습니다.
- 학생 담당 선생님을 여러 명 선택하고 저장할 수 있게 했습니다.
- 클래스는 하나로 유지하되, 클래스/시간표 수업칸에 담임/담당 선생님을 여러 명 연결할 수 있게 했습니다.
- 클래스룸 수업 상세에 `담임 수정`을 추가하고, 이미 개설된 선생님 이름 목록을 선택지로 사용하게 했습니다.
- 시간표 v2와 클래스룸 카드/상세에서 클래스 담임 여러 명을 `김원장, 이선생`처럼 표시하게 했습니다.
- 학생관리 선생님 필터를 추가했습니다.
  - 학생 직접 담당 선생님
  - 학생이 배정된 클래스의 담임/담당 선생님
  둘 다 필터 기준에 포함됩니다.
- 기존 `raw_meta_json` 임시 저장에서 벗어나기 위한 D1 마이그레이션을 추가했습니다.
- Worker가 새 DB 스키마를 우선 사용하고, 기존 `raw_meta_json` 데이터는 fallback으로 읽도록 변경했습니다.

## 9. DB 마이그레이션 내용
- 추가 파일: `migrations/20260601_eie_student_info_class_teachers.sql`
- `eie_students`에 추가하는 컬럼:
  - `school_name`
  - `student_phone`
  - `parent_phone`
  - `guardian_relation`
  - `student_address`
  - `vehicle_info`
  - `student_pin`
  - `student_type`
- 새 연결 테이블:
  - `eie_student_teachers`
  - `eie_timetable_cell_teachers`
- 기존 `raw_meta_json` 값 백필:
  - 학생 정보 필드
  - 학생 담당 선생님 목록
  - 클래스/시간표 수업칸 담임 선생님 목록
  - 기존 `teacher_name_raw` 대표 선생님
- 배포 순서:
  1. `migrations/20260601_eie_student_info_class_teachers.sql` 적용
  2. Worker 배포

## 10. 중간 보고 이후 확인한 테스트
- `node --check .\eie\js\views\eie-students.js`: OK
- `node --check .\eie\js\views\eie-timetable-v2.js`: OK
- `node --check .\eie\js\views\eie-classroom.js`: OK
- `node --check .\workers\wangji-eie-worker\routes\eie.js`: OK
- `node --check .\tests\eie-classroom-multi-teacher.test.js`: OK
- `node --check .\tests\eie-student-worker-crud-parity.test.js`: OK
- `node tests\eie-students-click-handlers.test.js`: OK
- `node tests\eie-timetable-v2-student-detail-link.test.js`: OK
- `node tests\eie-classroom-multi-teacher.test.js`: OK
- `node tests\eie-student-worker-crud-parity.test.js`: OK
- `node tests\eie-owner-dashboard-ap-parity.test.js`: OK

## 11. 주의/남은 작업
- `wrangler d1 execute --local --file migrations/20260601_eie_student_info_class_teachers.sql` 실행 검증은 wrangler가 `write EOF`로 종료되어 완료하지 못했습니다.
- 원격/실제 D1에는 아직 마이그레이션을 적용하지 않았습니다.
- Worker 배포도 아직 하지 않았습니다.
- 실제 브라우저에서 학생관리/시간표 v2/클래스룸 UI를 눈으로 확인하는 단계가 남아 있습니다.
