원내평가 학생별 삭제 기능 계획서 (코드 확인 후 정리판)

0. 선행 상태 (직전 작업에서 이미 구현·배포됨 — 절대 다시 만들지 말 것)
다음은 이미 원격 D1/워커에 반영되어 있다. 재구현 금지, 재사용만 한다.
- class_exam_assignment_exclusions 테이블 + 인덱스 (schema.sql, migrations/20260624_class_exam_assignment_exclusions.sql)
  컬럼: assignment_id, student_id, reason, created_at, PK(assignment_id, student_id)
  reason는 'subject_mismatch'(자동)와 'manual'(수동) 두 값을 쓴다. 이번 기능은 'manual'.
- 학생 포털 목록 필터: student-portal.js loadStudentClassExamAssignments (NOT EXISTS exclusion)
- 학생 포털 제출 차단: student-portal.js omr-submit (exclusion 필터)
- QR 제출 화면 필터: check-omr.js check-init (assignment resolve 후 exclusion 제외)
- QR 직접 제출 차단: exams.js PATCH /exam-sessions/new (isStudentExcludedFromAssignment → 403)
- 헬퍼: exams.js hasClassExamAssignmentExclusions / isStudentExcludedFromAssignment /
  refreshSubjectMismatchExclusions (manual row는 보존, subject_mismatch만 재계산)
=> 따라서 원래 계획의 5,9,10,11번은 "이미 됨". 이번에 새로 손댈 곳은 6,7,8 + 보강 4건이다.

1. 목표
원내평가 시험 상세 화면(openExamDetail)에서 학생별로 해당 시험을 삭제한다.
- 미제출 학생: 입력 / 삭제   (현재는 '입력'만)
- 제출 완료 학생: 수정 / 삭제 (현재와 동일, 단 삭제가 exclusion까지 추가하도록 변경)
삭제된 학생은 상세 목록 / 학생 포털 / QR 제출 화면에서 더 이상 보이지 않는다.
용어는 '삭제'로 통일. '제외/복구/다시 포함' 같은 문구는 화면에 쓰지 않는다.

2. 현재 구조 (코드 확인)
- 화면: apmath/js/classroom-planner.js
  · openExamGradeView(classId): 시험 목록. 제출률 'cnt/activeCountForAssignment' 표시(라인 286).
  · openExamDetail(classId, examTitle, examDate, archiveFile): 시험 상세.
    - active = 반 재원생 전체 (라인 320-321)
    - matchedAssignment = 이 시험에 해당하는 class_exam_assignments row (라인 349-353) → id 확보 가능
    - submitted/pending 분리 (라인 374-379)
    - 제출완료 버튼: 수정/삭제 (deleteExamSession, 라인 396-397)
    - 미제출 버튼: 입력만 (라인 407)
  · deleteExamSession(sessionId,...): api.delete('exam-sessions', sessionId) → 세션/오답만 삭제 (라인 439)
  · deleteExamByClass(...): /exam-sessions/by-exam DELETE → 시험 전체(세션+assignment) 삭제 (라인 448)
- 데이터: openExamDetail은 exam-sessions/by-class API로 sessions/wrong_answers/assignments를 받는다.
  by-class 응답에 exclusions는 없음(보강 필요, 아래 8-A).
- 핵심 제약: assignment가 있는 원내평가만 assignment_id로 제외를 앵커링할 수 있다.
  순수 OMR 단원평가(assignment 없음)는 거의 안 쓰므로, API가 identity로 assignment를 find-or-create해서 처리한다(아래 6).

3. 수정 대상
- apmath/worker-backup/worker/routes/exams.js   (DELETE/제외 API 추가 + by-class에 exclusions 추가 + 전체삭제 시 exclusions 정리)
- apmath/js/classroom-planner.js                 (미제출 삭제 버튼 + deleteStudentFromExam + active 제외 반영 + 목록 제출률 보정)
- (schema/마이그레이션/student-portal.js/check-omr.js 는 0번에서 이미 끝남 → 추가 변경 없음)

4. 신규 API: 학생별 시험 삭제 (exams.js)
경로 형태는 식별자 fallback이 필요하므로 path-param 단독보다 identity body를 권장한다.
  POST /class-exam-assignments/exclude-student
  body: { class_id, student_id, exam_title, exam_date, archive_file, assignment_id? }
동작:
  1) requireTeacher + canAccessClass(또는 canAccessStudent) 권한 확인.
  2) assignment 확정:
     - assignment_id가 오면 그 row 사용.
     - 없으면 resolveExamAssignmentMeta 패턴(class_id+exam_date+archive_file, 없으면 +exam_title)으로 찾는다.
     - 그래도 없으면(순수 OMR 케이스) class-exam-assignments POST의 find-or-create 로직을 재사용해
       최소 assignment row를 생성한다. (source_type='archive' 기본, subject는 빈 값)
  3) 해당 student_id가 assignment.class_id의 class_students에 속하는지 확인. 아니면 400/403.
  4) class_exam_assignment_exclusions에 reason='manual'로 INSERT OR IGNORE.
     (이미 subject_mismatch로 들어가 있어도 manual 의도를 남기기 위해 reason='manual'로 UPSERT/덮어쓰기 가능)
  5) 해당 학생의 이 시험 제출 기록이 있으면 삭제:
     exam_sessions(해당 student+exam identity) → 먼저 wrong_answers(session_id) 삭제 후 exam_sessions 삭제.
     by-exam DELETE의 세션 식별 쿼리(student_id IN class_students + exam_date + archive_file/exam_title)를 참고하되
     대상은 그 학생 1명으로 제한한다.
  6) 응답: { success:true, assignment_id, student_id, deleted_session: <bool> }
주의:
  - INSERT OR IGNORE만 쓰면 기존 subject_mismatch row가 manual로 안 바뀐다. reason 갱신이 필요하면
    "INSERT ... ON CONFLICT(assignment_id,student_id) DO UPDATE SET reason='manual'"로 한다.
  - exclusion 테이블 미존재 환경 대비 fail은 0번 헬퍼 패턴(getTableColumnSet)으로 방어.

5. by-class 응답에 exclusions 추가 (exams.js, exam-sessions/by-class GET)  [보강]
- 현재 by-class는 students/sessions/wrong_answers/blueprints/assignments만 반환한다.
- 이 반의 assignment id들에 대한 exclusions를 함께 반환한다:
    SELECT assignment_id, student_id, reason
    FROM class_exam_assignment_exclusions
    WHERE assignment_id IN (<이 반 assignments id들>)
  응답에 exclusions: [...] 추가. (테이블 없으면 빈 배열, fail-open)
- openExamDetail이 matchedAssignment.id 기준으로 제외 학생을 걸러내는 데 사용한다.

6. openExamDetail 수정 (classroom-planner.js)  [신규/보강]
6-A. active에서 제외 학생 빼기:
   - by-class 응답의 exclusions 중 assignment_id === matchedAssignment?.id 인 student_id 집합을 만든다.
   - active = 반 재원생 - 제외 학생. (제출/미제출 어디에도 안 보이게)
   - matchedAssignment가 없으면 제외 집합은 비어 있음(기존과 동일 동작).
6-B. 미제출 row에 삭제 버튼 추가:
   - pendingHTML의 각 row에 '삭제' 버튼 추가(제출완료 row의 삭제 버튼과 동일 스타일).
   - onclick → deleteStudentFromExam(student_id, classId, examTitle, examDate, archiveFile, assignment_id)
     assignment_id는 matchedAssignment?.id || '' 를 넘긴다.
6-C. 제출완료 row의 '삭제'도 deleteStudentFromExam으로 통일:
   - 기존 deleteExamSession은 세션만 지우고 exclusion을 안 남겨서, 재출제/포털에서 다시 보일 수 있다.
   - 제출완료 삭제도 exclude-student API를 호출해 세션 삭제 + manual exclusion을 함께 남긴다.
   - (deleteExamSession 함수는 제거하거나 deleteStudentFromExam으로 위임)

7. deleteStudentFromExam 함수 (classroom-planner.js)  [신규]
  async function deleteStudentFromExam(studentId, classId, examTitle, examDate, archiveFile, assignmentId)
  1) confirm: '이 학생을 이 시험에서 삭제할까요?\n제출 기록이 있으면 오답 기록도 함께 삭제됩니다.'
  2) POST /class-exam-assignments/exclude-student (body 위 4번).
  3) 실패 시 toast 경고 후 return.
  4) 성공 시: 모달은 닫되 같은 상세를 다시 연다
     (기존 패턴: closeModal(true); await refreshDataOnly(); openExamDetail(classId, examTitle, examDate, archiveFile))
  5) 결과: 삭제 학생 row 사라짐, 제출완료수/전체수 재계산.

8. 전체삭제와의 충돌 정리 (exams.js, exam-sessions/by-exam DELETE)  [보강]
- 현재 by-exam DELETE는 세션/오답 + class_exam_assignments row를 지운다.
  그런데 그 assignment의 exclusions row는 안 지워서 고아 row가 남는다.
- by-exam DELETE 처리에서 대상 assignment id들의 exclusions도 함께 삭제한다.
    DELETE FROM class_exam_assignment_exclusions WHERE assignment_id IN (<삭제되는 assignment id들>)
- 이렇게 해야 시나리오 4(학생별 삭제 후 전체삭제)가 에러/잔존 없이 통과한다.

9. 목록 화면 제출률 보정 (classroom-planner.js, openExamGradeView)  [보강, 선택]
- 라인 286의 '제출 cnt/activeCountForAssignment'는 반 재원생 전체를 분모로 쓴다.
  학생을 삭제하면 상세는 18/18인데 목록은 18/20으로 어긋난다.
- by-class exclusions를 받아, 각 exam.assignment.id에 걸린 제외 학생 수만큼 분모에서 뺀다.
- assignment 없는 exam은 보정하지 않는다(기존 동작 유지).

10. 검수 기준
시나리오 1. 미제출 학생 삭제
  1) 원내평가 상세 진입 → 미제출 학생 '삭제' 클릭.
  2) row 사라지고 전체 대상 수 감소.
  3) 학생 포털에서 그 시험 안 보임.
  4) QR 제출 화면 목록에 그 학생 없음.
  PASS: 미제출도 삭제 가능. 다시 목록에 나타나면 FAIL.
시나리오 2. 제출 완료 학생 삭제
  1) 제출완료 '삭제' 클릭.
  2) 그 학생 exam_sessions + wrong_answers 삭제 + manual exclusion 생성.
  3) row 사라짐, 포털/QR에서도 안 보임.
  4) (중요) 같은 시험 재출제 시에도 그 학생은 계속 제외 상태(manual 보존).
  PASS: 성적/오답 함께 삭제 + 재등장 안 함. 미제출로 남아 있으면 FAIL.
시나리오 3. 직접 제출 차단 (이미 구현됨 — 회귀 확인용)
  1) 삭제된 학생이 기존 URL/QR로 제출 시도.
  PASS: 서버가 403/404로 거부, exam_sessions 새로 안 생김.
시나리오 4. 전체삭제와 충돌 없음
  1) 학생별 삭제 후 '시험 기록 전체 삭제' 실행.
  PASS: 에러 없이 전체 삭제 + 해당 assignment의 exclusions도 정리됨.
시나리오 5. 목록/상세 수치 일치 (선택 보강 적용 시)
  PASS: 목록의 제출 X/Y 분모와 상세의 전체 N이 일치.
시나리오 6. 미마이그레이션/구버전 방어
  PASS: 어떤 경로도 exclusion 테이블/컬럼 부재로 500 나지 않고 기존처럼 동작(fail-open).

11. 비범위
- 삭제된 학생 목록 표시 / 다시 포함 / 별도 대상관리 모달.
- 기존 잘못 출제 건 일괄 정리.
- 과목별 자동 필터 UI (자동 subject_mismatch는 이미 서버에 있음, UI는 안 만듦).
- 순수 OMR 단원평가(assignment 없는 시험) 전용 UI. (API find-or-create로 동작은 하되 별도 화면 없음)
이번 범위는 오직 원내평가 상세 화면의 '학생별 삭제'와 그에 필요한 서버 보강뿐이다.
