cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
긴급 수정 — students/classes route 분리 후 API Endpoint Not Found 복구

## 상황
Worker route/helper 분리 2단계 배포 후 smoke test에서 아래 문제가 발생했다.

정상:
- GET /api/teachers 정상 응답

실패:
- GET /api/students -> {"error":"API Endpoint Not Found"}
- GET /api/classes -> {"error":"API Endpoint Not Found"}

따라서 teachers route는 정상이고, students/classes route 위임 또는 route 내부 path 분기가 기존 실제 엔드포인트와 맞지 않는 상태다.

이번 작업은 긴급 복구 작업이다.

## 목표
배포 후 `/api/students`, `/api/classes` 또는 기존 UI가 실제로 사용하는 학생/반 API가 다시 정상 응답하도록 복구한다.

핵심:
- 기존 route 분리 전 동작과 응답 구조를 유지한다.
- teachers route는 건드리지 않는다.
- UI는 수정하지 않는다.
- schema/migration은 수정하지 않는다.

## 실제 작업 기준
프로젝트 루트의 현재 파일 기준으로 확인한다.

주요 확인 파일:
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/students.js
- apmath/worker-backup/worker/routes/classes.js
- apmath/worker-backup/worker/routes/teachers.js
- apmath/worker-backup/worker/helpers/admin-db.js
- CODEX_RESULT.md

## 절대 금지
- UI 파일 수정 금지
- dashboard.js 수정 금지
- timetable.js 수정 금지
- student.js 수정 금지
- management.js 수정 금지
- core.js 수정 금지
- schema.sql 수정 금지
- migrations 추가/수정 금지
- teachers route 수정 금지
- 기존 initial-data 구조 변경 금지
- 기존 API 응답 필드 삭제 금지
- 학생 포털 시험지 직접 열기 기능 추가 금지
- 제출 완료 OMR 수정 기능 추가 금지
- 출석/과제/리포트/OMR/QR/planner/archive API 수정 금지
- index.js 전체 재작성 금지

## 허용 범위
- index.js의 students/classes route 위임 위치/조건 최소 수정
- routes/students.js의 path/resource 분기 최소 수정
- routes/classes.js의 path/resource 분기 최소 수정
- 필요 시 기존 index.js에 남아 있는 students/classes 관련 legacy 분기를 정확히 route로 연결
- CODEX_RESULT.md 작성

---

## 1. 원인 확인

먼저 route 분리 전후 기준으로 아래를 확인한다.

### 1-1. index.js 라우팅 확인
index.js에서 API resource를 어떻게 계산하는지 확인한다.

예:
- resource = path[1]
- resource = pathParts[1]
- path[0] === 'api' 이후 resource 처리

확인할 것:
- `students` resource가 실제로 handleStudents로 위임되는지
- `classes` resource가 실제로 handleClasses로 위임되는지
- 위임 코드가 API 처리 블록 내부에 있는지
- 위임 코드가 Not Found return보다 앞에 있는지
- 인증 완료 후 teacher 객체를 전달하는지

### 1-2. students.js 내부 확인
routes/students.js에서 GET 요청을 어떻게 처리하는지 확인한다.

확인할 것:
- GET /api/students 에서 path 길이 조건 때문에 빠지는지
- resource 이름이 잘못 가정되어 있는지
- `path[2]` 같은 세부 path가 없을 때 목록 조회를 반환하는지
- admin/teacher 권한 처리 후 응답하는지

### 1-3. classes.js 내부 확인
routes/classes.js에서 GET 요청을 어떻게 처리하는지 확인한다.

확인할 것:
- GET /api/classes 에서 path 길이 조건 때문에 빠지는지
- GET /api/class-students 가 필요한 경우 같이 처리되는지
- resource 이름이 잘못 가정되어 있는지
- 목록 조회 응답이 기존 구조와 같은지

### 1-4. 기존 UI 호출명 확인
가능하면 프론트에서 실제 호출하는 엔드포인트 이름을 검색한다.

검색 대상:
- apmath/js/core.js
- apmath/js/dashboard.js
- apmath/js/management.js
- apmath/js/student.js
- apmath/js/timetable.js

검색어:
- `/api/students`
- `api/students`
- `/api/classes`
- `api/classes`
- `students`
- `classes`

단, UI 파일은 읽기만 하고 수정하지 않는다.

---

## 2. 수정 기준

## 2-1. GET /api/students 정상화
아래 호출은 반드시 정상 응답해야 한다.

GET /api/students

응답 형태는 기존 구현과 동일해야 한다.

기대:
- admin이면 전체 학생 배열 또는 기존 wrapper 구조
- teacher면 담당 범위 학생 배열 또는 기존 wrapper 구조
- 기존 UI가 깨지지 않는 구조

만약 기존 API가 `{ success: true, students: [...] }` 구조였다면 그대로 유지한다.
만약 기존 API가 배열 직접 반환이었다면 그대로 유지한다.

절대 응답 형태를 새로 바꾸지 않는다.

## 2-2. GET /api/classes 정상화
아래 호출은 반드시 정상 응답해야 한다.

GET /api/classes

응답 형태는 기존 구현과 동일해야 한다.

기대:
- admin이면 전체 반 배열 또는 기존 wrapper 구조
- teacher면 담당 범위 반 배열 또는 기존 wrapper 구조
- 기존 UI가 깨지지 않는 구조

## 2-3. teachers는 건드리지 않기
GET /api/teachers는 이미 정상이다.

teachers route, teachers 위임, teachers helper는 수정하지 않는다.

## 2-4. class-students / teacher-classes 주의
만약 classes.js가 class-students도 같이 담당한다면 기존 엔드포인트가 유지되어야 한다.

확인 대상:
- GET/POST/PATCH/DELETE /api/class-students
- GET/POST/PATCH/DELETE /api/teacher-classes

단, 이번 smoke test 실패 원인은 students/classes 목록이므로 우선 목록 조회부터 복구한다.

---

## 3. 권장 수정 방식

## 3-1. index.js 위임 확인 예시
API routing block 안에서 Not Found보다 앞에 아래와 같은 위임이 있어야 한다.

if (resource === 'students') {
  return handleStudents(request, env, teacher, path, url);
}

if (resource === 'classes' || resource === 'class-students') {
  return handleClasses(request, env, teacher, path, url);
}

if (resource === 'teachers' || resource === 'teacher-classes') {
  return handleTeachers(request, env, teacher, path, url);
}

실제 변수명이 resource가 아니면 기존 코드 변수명에 맞춘다.

## 3-2. route 내부 기본 GET 처리 예시
students.js에서 path 세부값이 없으면 목록 조회로 처리해야 한다.

개념 예시:

if (request.method === 'GET' && resource === 'students' && !path[2]) {
  return listStudents(request, env, teacher, url);
}

classes.js도 동일:

if (request.method === 'GET' && resource === 'classes' && !path[2]) {
  return listClasses(request, env, teacher, url);
}

단, 실제 path 배열 구조는 index.js 기준에 맞춘다.

## 3-3. 빠른 복구 우선
route 파일 내부 구조가 복잡하게 꼬였으면, 우선 기존 index.js에 있던 students/classes 처리 로직을 그대로 route 파일 안에 옮겼는지 확인하고, 빠진 return 조건만 복구한다.

이번 작업은 구조 미화가 아니라 장애 복구다.

---

## 4. 검증 명령

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/students.js
node --check apmath/worker-backup/worker/routes/classes.js
node --check apmath/worker-backup/worker/routes/teachers.js
node --check apmath/worker-backup/worker/helpers/admin-db.js

기존 분리 route도 안전 확인:

node --check apmath/worker-backup/worker/routes/enrollments.js
node --check apmath/worker-backup/worker/routes/class-time-slots.js
node --check apmath/worker-backup/worker/routes/timetable-conflicts.js
node --check apmath/worker-backup/worker/routes/foundation-sync.js
node --check apmath/worker-backup/worker/routes/billing-foundation.js
node --check apmath/worker-backup/worker/routes/parent-foundation.js
node --check apmath/worker-backup/worker/routes/foundation-logs.js

프론트는 수정하지 않았는지 확인만 한다.

node --check apmath/js/core.js
node --check apmath/js/wangji-foundation.js

변경 파일 확인:

git diff --name-only

정상 변경 파일:
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/students.js
- apmath/worker-backup/worker/routes/classes.js
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

---

## 5. 배포 후 수동 확인 항목

이번 작업에서는 배포하지 않는다.
CODEX_RESULT.md에는 배포 가능 여부만 적는다.

배포 후 직접 확인할 명령은 아래와 같다.

GET /api/students:

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/students" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

GET /api/classes:

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/classes" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

GET /api/teachers:

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/teachers" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- students 정상
- classes 정상
- teachers 정상 유지

추가:
- 기존 AP Math 로그인/대시보드 진입 정상
- 학생관리 정상
- 반관리 정상

---

## 6. 배포 판단

CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:
- node --check 통과
- GET /api/students 경로 복구 코드 확인
- GET /api/classes 경로 복구 코드 확인
- GET /api/teachers 기존 정상 유지
- UI 파일 변경 없음
- schema/migration 변경 없음
- initial-data 구조 변경 없음

배포 보류:
- node --check 실패
- students/classes 목록 조회 조건 불명확
- teachers route에 영향 있음
- UI 파일 변경 있음
- schema/migration 변경 있음

---

## 7. 완료 보고

루트에 CODEX_RESULT.md를 작성한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
- 파일 목록

## 2. 구현 완료 또는 확인 완료
- students API Not Found 원인 확인
- classes API Not Found 원인 확인
- GET /api/students 복구
- GET /api/classes 복구
- teachers route 변경 없음 확인
- initial-data 구조 유지 확인
- UI 파일 변경 없음 확인
- schema/migration 변경 없음 확인

## 3. 실행 결과
- node --check 결과
- git diff --name-only 결과
- UI 파일 변경 여부
- schema/migration 변경 여부

## 4. 결과 요약
- 장애 원인
- 수정 방식
- 기존 기능 영향 여부
- 배포 가능 여부

## 5. 다음 조치
- Worker 배포
- students/classes/teachers smoke test
- 기존 UI 수동 확인
- 정상 확인 후 커밋/푸시

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF