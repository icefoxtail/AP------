cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
Worker route/helper 분리 4단계 — exam/blueprint/assignment 계열 API 분리

## 목표
Worker route/helper 분리 1~3단계 완료 후, 이번 4단계에서는 시험 관리 계열 API만 route 파일로 분리한다.

이번 작업은 기능 추가가 아니다.

목표:
- index.js 비대화 완화
- exam-blueprints / class-exam-assignments / exam-sessions 계열 API를 route 파일로 이동
- 기존 API 응답과 동작 유지
- 기존 UI 변경 없음
- DB/schema/migration 변경 없음
- OMR/QR/오답 흐름 회귀 방지

## 실제 작업 기준
프로젝트 루트의 현재 파일 기준으로 작업한다.

주요 파일:
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/
- apmath/worker-backup/worker/helpers/
- CODEX_RESULT.md

## 절대 금지
- index.js 전체 재작성 금지
- 기존 initial-data 본체 분리 금지
- 기존 initial-data 응답 구조 변경 금지
- 기존 API 응답 필드 삭제 금지
- 기존 DB 테이블/컬럼 변경 금지
- DB migration 추가 금지
- schema.sql 수정 금지
- UI 파일 수정 금지
- dashboard.js 수정 금지
- timetable.js 수정 금지
- student.js 수정 금지
- management.js 수정 금지
- core.js 수정 금지
- students/classes/teachers route 수정 금지
- attendance-homework route 수정 금지
- foundation routes 수정 금지
- homework-photo API 분리 금지
- student-portal API 분리 금지
- report/AI API 분리 금지
- archive API 분리 금지
- planner API 분리 금지
- 문제은행 JS 파일 수정 금지
- OMR 제출 완료 후 수정 기능 추가 금지
- 학생이 시험지를 직접 여는 기능 추가 금지
- 수납·출납 foundation 추가 금지

## 허용 범위
- exam route 파일 추가
- 기존 index.js의 시험 관련 API 처리 로직을 route 파일로 이동
- index.js에서 새 route로 위임하도록 최소 수정
- 필요한 공통 helper 추가 또는 기존 helper 재사용
- CODEX_RESULT.md 작성

---

## 1. 이번 분리 대상

이번 작업에서 분리할 대상은 시험 관리 계열 API만이다.

분리 대상 API:
- /api/exam-blueprints
- /api/class-exam-assignments
- /api/exam-sessions

권장 route 파일:
- apmath/worker-backup/worker/routes/exams.js

담당 기능:
- exam-blueprints GET/POST
- class-exam-assignments GET/POST
- exam-sessions by-class 조회
- exam-sessions bulk-omr 저장
- exam-sessions PATCH 저장/수정
- exam-sessions DELETE
- exam-sessions DELETE by-exam
- exam-sessions DELETE wrongs

## 1-1. 이번에 분리하지 않을 것

아래는 이번 작업에서 절대 분리하지 않는다.

- /api/check-init
- /api/check-pin
- /api/qr-classes
- /api/homework-photo
- /api/student-portal
- /api/report-ai-proxy
- /api/consultations
- /api/operation-memos
- /api/academy-schedules
- /api/daily-journals
- /api/class-textbooks
- archive 관련 API
- planner 관련 API

주의:
- check-init/check-pin은 학생 QR/OMR 진입과 직접 연결되어 있으므로 이번에 건드리지 않는다.
- exam-sessions는 기존 선생님 OS 시험/OMR 저장 API만 분리한다.
- 학생 포털에서 시험지를 직접 여는 흐름은 절대 추가하지 않는다.

---

## 2. route 파일 책임

## 2-1. routes/exams.js

export 함수명 권장:

export async function handleExams(request, env, teacher, path, url) { ... }

또는 현재 route 스타일에 맞춘다.

담당 resource:
- exam-blueprints
- class-exam-assignments
- exam-sessions

반드시 유지할 기존 동작:

### exam-blueprints

#### POST /api/exam-blueprints
기존 동작 유지:
- teacher 인증 필요
- archive_file 필수
- items 배열 필수
- source_archive_file 기본값은 archive_file
- source_question_no 기본값은 question_no
- INSERT ... ON CONFLICT 기존 방식 유지
- 응답 구조 유지:
  - { success: true, count }

#### GET /api/exam-blueprints?file=...
기존 동작 유지:
- teacher 인증 필요
- file parameter 필수
- archive_file 기준 조회
- question_no ASC 정렬
- 응답 구조 유지:
  - { success: true, archive_file: file, items }

---

### class-exam-assignments

#### POST /api/class-exam-assignments
기존 동작 유지:
- class_id, exam_title, exam_date 필수
- class 존재 확인
- archive_file 기본값 ''
- source_type 기본값 'archive'
- INSERT ... ON CONFLICT 기존 방식 유지
- 응답 구조 유지:
  - { success: true, assignment }

주의:
- 기존 코드가 POST에서 teacher 인증을 하지 않았다면 그대로 유지한다.
- 임의로 인증 조건을 추가하지 않는다.
- 보안 개선은 별도 phase에서 한다.

#### GET /api/class-exam-assignments?class=...
기존 동작 유지:
- teacher 인증 필요
- class 파라미터 필수
- canAccessClass 검사 유지
- exam_date DESC, updated_at DESC 정렬
- 응답 구조 유지:
  - { success: true, assignments }

---

### exam-sessions

#### DELETE /api/exam-sessions/by-exam?class=...&exam=...&date=...
기존 동작 유지:
- teacher 인증 필요
- class, exam, date 필수
- canAccessClass 검사 유지
- 해당 class 학생들의 exam_sessions 삭제
- wrong_answers 먼저 삭제
- class_exam_assignments도 삭제
- 응답 구조 유지:
  - { success: true, deleted }

#### GET /api/exam-sessions/by-class?class=...&exam=...
기존 동작 유지:
- teacher 인증 필요
- class 필수
- canAccessClass 검사 유지
- class 학생 조회
- students/sessions/wrong_answers/blueprints/assignments 반환
- archive_file 있는 sessions 기준으로 blueprints 조회
- 응답 구조 유지:
  - { students, sessions, wrong_answers, blueprints, assignments }

#### POST /api/exam-sessions/bulk-omr
기존 동작 유지:
- teacher 인증 필요
- exam_title, exam_date, question_count 필수
- rows 필수
- 각 student_id canAccessStudent 검사 유지
- class_id가 있으면 canAccessClass 검사 유지
- wrong_ids 정규화 유지
- questionCount 1~80 제한 유지
- score 계산 방식 유지
- 기존 session 있으면 재사용
- exam_sessions UPSERT 유지
- wrong_answers 삭제 후 재삽입 유지
- 응답 구조 유지:
  - { success: true, saved }

중요:
- 제출 완료 OMR 수정 금지 원칙은 학생 포털/학생 제출 흐름에 적용된다.
- 이 API는 선생님 OS bulk OMR 저장 흐름이므로 기존 동작을 임의로 바꾸지 않는다.

#### PATCH /api/exam-sessions/:id
기존 동작 유지:
- teacher 인증 필요
- canAccessStudent 검사 유지
- id가 new이면 새 id 생성
- exam_sessions UPSERT 유지
- wrong_answers 삭제 후 재삽입 유지
- 응답 구조 유지:
  - { success: true, id }

#### DELETE /api/exam-sessions/:id/wrongs
기존 동작 유지:
- teacher 인증 필요
- session 존재 확인
- canAccessStudent 검사 유지
- 해당 session wrong_answers 삭제
- 응답 구조 유지:
  - { success: true }

#### DELETE /api/exam-sessions/:id
기존 동작 유지:
- teacher 인증 필요
- session 존재 확인
- canAccessStudent 검사 유지
- wrong_answers 삭제
- exam_sessions 삭제
- 응답 구조 유지:
  - { success: true }

---

## 3. index.js 수정 기준

index.js에는 import 추가:

import { handleExams } from './routes/exams.js';

기존 API routing block에서 Not Found보다 앞에 아래 위임을 추가한다.

개념:

if (
  resource === 'exam-blueprints' ||
  resource === 'class-exam-assignments' ||
  resource === 'exam-sessions'
) {
  const response = await handleExams(request, env, teacher, path, url);
  if (response) return response;
}

주의:
- 기존 코드 스타일에 맞게 작성한다.
- teacher를 route에 넘기더라도 route 내부에서 필요한 경우 verifyAuth를 수행해도 된다.
- 기존 분리 route 패턴과 맞춘다.
- Not Found보다 앞에 있어야 한다.
- check-init/check-pin/qr-classes보다 앞뒤 순서를 바꿔서 기존 흐름을 깨지 않는다.

---

## 4. helper 처리

exams.js에서 필요한 함수:
- verifyAuth
- isAdminUser가 필요하면 사용
- canAccessClass
- canAccessStudent
- headers 또는 json response helper

현재 helpers/admin-db.js에 공통 권한 helper가 있으면 재사용한다.

주의:
- verifyAuth, canAccessStudent, canAccessClass는 index.js의 기존 레거시 API도 계속 사용한다.
- helper 이동으로 index.js가 깨지면 실패다.
- 확실하지 않으면 기존 helper는 index.js에 남기고, route에서는 helpers/admin-db.js를 통해 필요한 것만 import한다.
- 중복 제거보다 안전한 동작 유지가 우선이다.

---

## 5. 기존 코드 제거 기준

index.js에서 아래 기존 블록은 route로 옮긴 뒤 제거하거나 위임 뒤 도달하지 않게 한다.

대상 블록:
- if (resource === 'exam-blueprints') { ... }
- if (resource === 'class-exam-assignments') { ... }
- if (resource === 'exam-sessions') { ... }

주의:
- 기존 로직을 route 파일에 옮길 때 SQL, 응답 구조, status code를 바꾸지 않는다.
- route 파일로 옮긴 뒤 index.js에 중복으로 남아도 당장은 동작할 수 있으나 정리 효과가 떨어진다.
- 가능하면 중복 제거한다.
- 단, check-init/check-pin/qr-classes/homework-photo/student-portal까지 같이 삭제하지 않는다.

---

## 6. 검증 명령

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/exams.js

기존 route 안전 확인:

node --check apmath/worker-backup/worker/routes/attendance-homework.js
node --check apmath/worker-backup/worker/routes/students.js
node --check apmath/worker-backup/worker/routes/classes.js
node --check apmath/worker-backup/worker/routes/teachers.js
node --check apmath/worker-backup/worker/routes/enrollments.js
node --check apmath/worker-backup/worker/routes/class-time-slots.js
node --check apmath/worker-backup/worker/routes/timetable-conflicts.js
node --check apmath/worker-backup/worker/routes/foundation-sync.js
node --check apmath/worker-backup/worker/routes/billing-foundation.js
node --check apmath/worker-backup/worker/routes/parent-foundation.js
node --check apmath/worker-backup/worker/routes/foundation-logs.js

helper 안전 확인:

node --check apmath/worker-backup/worker/helpers/admin-db.js
node --check apmath/worker-backup/worker/helpers/response.js
node --check apmath/worker-backup/worker/helpers/foundation-db.js
node --check apmath/worker-backup/worker/helpers/branch.js
node --check apmath/worker-backup/worker/helpers/time.js

프론트 안전 확인:

node --check apmath/js/core.js
node --check apmath/js/wangji-foundation.js

변경 파일 확인:

git diff --name-only

정상 변경 파일:
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/exams.js
- 필요 시 apmath/worker-backup/worker/helpers/admin-db.js
- CODEX_RESULT.md
- CODEX_TASK.md는 현재 지시 파일 갱신 때문에 포함될 수 있음

아래 파일이 변경되면 실패:
- apmath/js/dashboard.js
- apmath/js/timetable.js
- apmath/js/student.js
- apmath/js/management.js
- apmath/js/core.js
- apmath/index.html
- apmath/worker-backup/worker/schema.sql
- apmath/worker-backup/worker/migrations/*
- archive/**/*

---

## 7. 배포 후 수동 확인 항목

이번 작업에서는 배포하지 않는다.
CODEX_RESULT.md에는 배포 가능 여부만 적는다.

배포 후 직접 확인할 명령은 아래와 같다.

### 7-1. class-exam-assignments 조회

반 id는 실제 존재하는 반 id 하나로 테스트한다.

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/class-exam-assignments?class=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- success true
- assignments 배열

### 7-2. exam-sessions by-class 조회

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/exam-sessions/by-class?class=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- students 배열
- sessions 배열
- wrong_answers 배열
- blueprints 배열
- assignments 배열

### 7-3. exam-blueprints 조회

실제 archive_file 값이 없으면 400이 정상이다.

400 확인:
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/exam-blueprints" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- file parameter required

실제 archive_file이 있으면:
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/exam-blueprints?file=실제파일경로" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- success true
- items 배열

### 7-4. 기존 smoke test 유지

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/students" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/attendance-history" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- 기존 route 정상 유지

### 7-5. UI 수동 확인

- 대시보드 진입
- 반별 시험/성적 조회
- OMR 저장 화면 진입
- 오답 클리닉 관련 화면 진입
- 학생 포털 OMR 제출 완료 수정 차단 유지

---

## 8. 배포 판단

CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:
- 모든 node --check 통과
- exams route 분리 완료
- exam-blueprints 응답 구조 유지
- class-exam-assignments 응답 구조 유지
- exam-sessions 응답 구조 유지
- bulk-omr 저장 로직 유지
- 기존 students/classes/teachers/attendance route 영향 없음
- UI 파일 변경 없음
- schema/migration 변경 없음

배포 보류:
- node --check 실패
- exam-sessions by-class 응답 구조 변경 가능성 있음
- bulk-omr 저장 로직 변경 가능성 있음
- OMR/QR/check 관련 흐름 영향 가능성 있음
- UI 파일 변경 있음
- schema/migration 변경 있음

---

## 9. 완료 보고

루트에 CODEX_RESULT.md를 작성한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
- 파일 목록

## 2. 구현 완료 또는 확인 완료
- exams route 추가
- exam-blueprints 분리
- class-exam-assignments 분리
- exam-sessions by-class 분리
- exam-sessions bulk-omr 분리
- exam-sessions PATCH/DELETE 분리
- index.js route 위임 구조 반영
- 기존 students/classes/teachers route 영향 없음 확인
- 기존 attendance-homework route 영향 없음 확인
- 기존 initial-data 구조 유지 확인
- UI 파일 변경 없음 확인
- schema/migration 변경 없음 확인

## 3. 실행 결과
- node --check 결과
- git diff --name-only 결과
- UI 파일 변경 여부
- schema/migration 변경 여부

## 4. 결과 요약
- index.js 추가 정리 효과
- 분리된 route 목록
- 기존 기능 영향 여부
- 배포 가능 여부

## 5. 다음 조치
- Worker 배포
- class-exam-assignments smoke test
- exam-sessions by-class smoke test
- exam-blueprints smoke test
- OMR/시험 UI 수동 확인
- 정상 확인 후 커밋/푸시
- 이후 homework-photo 또는 운영관리 route 분리 여부 결정

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF