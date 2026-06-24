수정 대상:
- apmath/worker-backup/worker/schema.sql
- apmath/worker-backup/worker/migrations/ (신규 마이그레이션 1개)
- apmath/worker-backup/worker/routes/exams.js
- apmath/worker-backup/worker/routes/student-portal.js
- apmath/worker-backup/worker/routes/check-omr.js   ← (검토 보완) QR 제출 화면 학생 목록 필터
- archive/index.html (출제 시 subject 전달)
- archive/engine.html (재등록 POST의 subject 누락 → 서버 overwrite 방지로 대응)

목표:
고2처럼 같은 반 안에서 학생마다 수강 과목(high_subjects)이 다른 경우,
반별 출제를 해도 그 과목을 듣지 않는 학생에게는 시험이 노출/제출되지 않게 한다.
- 반 단위 출제 모델(class_exam_assignments)은 그대로 유지한다. (회귀 위험 최소화)
- 학생별 예외만 얇은 "제외(exclusion) 레이어"로 얹는다.
- 출제 시점에 과목 비수강자를 자동으로 제외한다. (subject 자동필터)
- 이번 범위는 "신규 출제부터만" 적용한다. 기존 잘못 출제된 건은 소급 정리하지 않는다.

현재 문제 (코드 확인 완료):
- class_exam_assignments는 UNIQUE(class_id, exam_title, exam_date, archive_file)로
  학생/과목 차원이 전혀 없다. subject 컬럼도 없다. (schema.sql:221)
- 출제 스코프는 class / grade 두 가지뿐이며, 둘 다 결국 반당 1 row만 만든다.
- 학생 노출 경로가 4군데인데 전부 제외 필터가 없다:
  1) 학생 포털 목록: student-portal.js loadStudentClassExamAssignments (class_students JOIN, student-portal.js:102)
  2) 학생 포털 제출: student-portal.js omr-submit (class_students JOIN, student-portal.js:325)
  3) QR 제출 화면 학생 목록: check-omr.js check-init (class_students 전원 반환, check-omr.js:68)
  4) QR 직접 제출: exams.js PATCH /exam-sessions/new (resolveExamAssignmentMeta로 assignment resolve, exams.js:982)
- 과목 개념(students.high_subjects, classes.subject, item.subject)은 존재하나 출제 경로가 무시한다.
- engine.html은 archive/index.html 출제 후 AP 제출 QR 모드에서 class-exam-assignments를
  subject 없이 재POST한다. (engine.html:679~686) → 서버 update가 subject를 빈 값으로 덮을 위험.

설계 핵심 결정:
- 방식: 제외 레이어(class_exam_assignment_exclusions) + 과목 자동필터.
  inclusion 로스터가 아니라 exclusion으로 한다.
  이유: 동질 반(고1/고3/일반)은 제외 row가 0개 → 쿼리/동작 무변화 → 회귀 0.
        고2 이질 반만 제외 row가 생긴다.
- "학생별 삭제"와 "학생별 출제"는 같은 테이블의 두 진입점이다.
  학생별 자동 제외(출제 시점) / 추후 수동 제외(보드) 모두 동일 테이블을 쓴다.
- fail-open 원칙: subject를 확실히 고2 선택과목으로 매핑하지 못하면 아무도 제외하지 않는다.
  (= 오늘과 동일하게 전원 노출) 잘못된 제외로 시험이 사라지는 사고를 방지한다.

수정 1. 스키마: 제외 테이블 + subject 컬럼 추가
- class_exam_assignments에 subject 컬럼 추가 (TEXT DEFAULT '').
- 신규 테이블:
    CREATE TABLE IF NOT EXISTS class_exam_assignment_exclusions (
      assignment_id TEXT NOT NULL,
      student_id    TEXT NOT NULL,
      reason        TEXT DEFAULT 'subject_mismatch', -- 'subject_mismatch' | 'manual'
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (assignment_id, student_id)
    );
    CREATE INDEX IF NOT EXISTS idx_assignment_exclusions_assignment
      ON class_exam_assignment_exclusions(assignment_id);
    CREATE INDEX IF NOT EXISTS idx_assignment_exclusions_student
      ON class_exam_assignment_exclusions(student_id);
- schema.sql과 migrations/ 신규 파일(예: 20260624_class_exam_assignment_exclusions.sql) 양쪽에 반영.
- subject 컬럼은 ASSIGNMENT_META_COLUMNS 패턴처럼 getTableColumnSet으로 존재 여부를 확인하고
  동적으로 다루어 원격 미적용 환경에서도 깨지지 않게 한다.
- 모든 제외 관련 쿼리는 테이블 미존재(미마이그레이션) 시 안전하게 fail-open 하도록 방어한다.

수정 2. 과목 정규화 헬퍼 (exams.js)
- 아카이브 subject 값이 지저분하다(실측): '기출c', 'c', '대수c', '수학c', '확률과 통계'(공백),
  '확률과통계', '대수', '수학I', '공통수학1' 등.
- normalizeAssignmentSubject(raw) 작성. 반환은 canonical 과목명 또는 null(매핑 불가):
  canonical 집합 = ['대수','미적분Ⅰ','확률과통계','미적분Ⅱ','기하']  (고2 선택과목 기준)
  1) 공백 제거, 후행/접두 노이즈 토큰 제거('기출', 단독/후행 'c').
  2) 표기 변형 매핑(cumulative.js SEB 정규화 규칙과 동일하게):
     - 대수, 대수c → 대수
     - 미적분1, 미적분Ⅰ, 미적분I → 미적분Ⅰ
     - 확률과통계, 확률과 통계, 확통 → 확률과통계
     - 미적분2, 미적분Ⅱ, 미적분II → 미적분Ⅱ
     - 기하, 기하와벡터, 기벡 → 기하
  3) 매핑 불가(→ null, fail-open): '기출c', 'c', '수학c', '공통수학1', '공통수학2', 빈 값.
     · 공통수학1/2는 고1 공통과목이라 canonical에 넣지 않는다(매핑 불가 처리).
- 주의(확인 필요): 레거시 명칭 '수학I'/'수학II'의 현 교육과정 환산('수학I'→'대수' 등)은
  교육과정 전환 해석이라 단정하지 않는다. 오너가 확정하기 전까지는 매핑 불가(null)로 둔다.
  (fail-open이므로 그동안은 전원 노출 = 사고 없음.) 확정되면 매핑표에 추가한다.
- parseStudentHighSubjects(high_subjects JSON)도 같은 정규화를 거쳐 canonical로 맞춰 비교한다.

수정 3. 출제 POST 시 자동 제외 생성/재계산 (exams.js, class-exam-assignments POST)
- d.subject(아카이브에서 전달)를 받아 assignment.subject에 저장한다.
- assignment 확정(insert/update로 id 확보) 후, 아래 순서를 반드시 그대로 따른다:
  1) 해당 assignment_id의 reason='subject_mismatch' row를 먼저 전부 삭제한다.
  2) normalizeAssignmentSubject(subject)가 null이면 여기서 종료한다. (새 제외 만들지 않음)
     ※ subject가 '확률과통계'였다가 '기출c'로 바뀌는 경우, 1)에서 이미 지웠으므로
       학생이 영구히 숨겨지는 사고가 나지 않는다.
  3) canonical subject가 있으면 현재 class_students 학생을 모두 조회한다.
  4) 각 학생 high_subjects를 정규화한다.
     - high_subjects가 비어있으면(미입력) 그 학생은 제외하지 않는다(fail-open).
     - high_subjects가 있고 canonical subject가 그 안에 없는 학생만
       reason='subject_mismatch'로 INSERT OR IGNORE 한다.
  5) reason='manual' row는 절대 삭제하지 않는다. (1)의 삭제는 subject_mismatch에 한정)
- subject 빈 값 overwrite 방지: POST update 시 subject가 빈 값/누락이면 기존 subject를
  COALESCE 방식으로 유지하고, 자동 제외 재계산도 수행하지 않는다(기존 제외 보존).
  → engine.html이 subject 없이 재등록해도 archive/index.html이 저장한 subject가 살아남는다.

수정 4. 학생 포털 노출/제출 필터 (student-portal.js)
- loadStudentClassExamAssignments 메인 쿼리에 제외 필터 추가:
    AND NOT EXISTS (
      SELECT 1 FROM class_exam_assignment_exclusions ex
      WHERE ex.assignment_id = cea.id AND ex.student_id = ?
    )
- omr-submit(student-portal.js:310~)의 assignment 조회(class_students JOIN, student-portal.js:325)에도
  동일 제외 필터를 적용해, 제외된 학생은 제출 자체가 거부되게 한다.
- 제외 테이블 미존재 환경 대비: 서브쿼리 실패를 안전하게 처리(fail-open).

수정 5. QR 제출 화면 학생 목록 필터 (check-omr.js, check-init)  ← (검토 보완)
- check-init은 class_students 전원을 그대로 반환하지 말고,
  현재 시험 assignment를 class_id + exam_date + (archive_file 또는 exam_title)로 찾은 뒤,
  class_exam_assignment_exclusions에 포함된 학생을 students 목록에서 제외한다.
- assignment를 못 찾거나 제외 테이블이 없으면 기존처럼 전원 표시한다(fail-open).
- 이걸 안 하면 학생 포털은 막혀도 QR 제출 화면에서는 반 전체가 떠서 비수강자에게 채점이 들어간다.

수정 6. QR 직접 제출 차단 (exams.js, PATCH /exam-sessions/new)  ← (검토 보완)
- PATCH 경로(exams.js:962~)에서 resolveExamAssignmentMeta로 assignment_id를 확보한 뒤,
  그 assignment_id + d.student_id가 class_exam_assignment_exclusions에 있으면 403으로 거부한다.
- 오래 열려 있던 QR 화면이나 URL 직접 접근으로 들어오는 제외 학생 제출을 막는 방어선이다.
- assignment를 못 찾거나 제외 테이블이 없으면 기존대로 통과(fail-open).

수정 7. 아카이브/엔진 출제 시 subject 전달 (archive/index.html, archive/engine.html)
- registerIndexClassExamAssignment 페이로드에 subject: (item.subject || '') 추가.
  class/grade 출제 모두 이 함수를 경유하므로 한 군데 수정으로 양쪽 해결된다.
- goEngine() URL에도 subject를 함께 넘긴다(URL 파라미터).
- engine.html은 가능하면 subject 파라미터를 받아 재등록 POST에 포함한다.
  (포함이 어려우면 수정 3의 서버측 빈 subject overwrite 방지로 회귀를 막는다.)

검수 기준:
1. 고2 한 반에 학생 A(미적분Ⅰ 수강)와 학생 B(확률과통계만 수강)가 있다.
2. 아카이브에서 subject='확률과통계' 시험을 그 반에 출제한다.
3. 학생 B 포털에는 보이고, 학생 A 포털에는 보이지 않는다.
4. QR 제출 화면(check-init)에도 학생 B만 뜨고 학생 A는 목록에서 빠진다.
5. 학생 A 이름으로 QR 직접 제출(/exam-sessions/new PATCH)을 시도하면 403으로 거부된다.
6. subject='기출c'처럼 매핑 불가 시험을 출제하면 A, B 모두 보이고 모두 제출 가능(fail-open).
7. high_subjects가 비어있는 학생에게는 제외가 걸리지 않는다(fail-open).
8. 고1/고3/일반 동질 반은 제외 row가 생기지 않고 기존과 100% 동일하게 동작한다.
9. 같은 시험을 '확률과통계'로 출제 후 '기출c'로 재출제하면, 기존 subject_mismatch 제외가
   삭제되어 학생 A가 다시 보인다. (영구 숨김 사고 없음)
10. engine.html이 subject 없이 재등록 POST를 보내도 archive/index.html이 저장한 subject가
    빈 값으로 덮이지 않는다.
11. reason='manual' 제외는 재출제/subject 변경에도 보존된다.
12. 마이그레이션 미적용(구버전 DB) 환경에서도 출제/포털/QR이 에러 없이 기존처럼 동작한다.

비범위(이번 작업 제외):
- 이미 출제된 기존 잘못 배정 건의 소급 일괄 정리.
- 보드에서 학생을 수동으로 체크 해제하는 UI. (테이블은 manual reason을 지원하지만 UI는 후속)
- 완전 학생별 출제 모델로의 전환.
- 레거시 '수학I'/'수학II'의 현 교육과정 과목 매핑 확정. (오너 확인 후 수정 2 매핑표에 추가)
