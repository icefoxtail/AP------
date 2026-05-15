cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
Worker route/helper 분리 3단계 — attendance/homework 계열 API 분리

## 목표
Worker route/helper 분리 1단계에서 foundation 계열 API를 분리했고, 2단계에서 students/classes/teachers 계열 API를 분리했다.

이번 3단계에서는 기존 AP Math 본체 API 중 출결/숙제 계열 API만 route 파일로 분리한다.

이번 작업은 기능 추가가 아니다.

목표:
- index.js 비대화 완화
- attendance/homework 관련 API를 기능별 route로 이동
- 기존 API 응답과 동작 유지
- 기존 UI 변경 없음
- DB/schema/migration 변경 없음

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
- foundation routes 수정 금지
- exam/report/OMR/QR/planner/archive API 분리 금지
- homework-photo API 분리 금지
- 수납·출납 foundation 추가 금지
- 출결 알림톡/문자 발송 기능 추가 금지
- 숙제 사진 제출 흐름 변경 금지

## 허용 범위
- attendance/homework route 파일 추가
- 기존 index.js의 출결/숙제 관련 API 처리 로직을 route 파일로 이동
- index.js에서 새 route로 위임하도록 최소 수정
- 필요한 공통 helper 추가 또는 기존 helper 재사용
- CODEX_RESULT.md 작성

---

## 1. 이번 분리 대상

이번 작업에서 분리할 대상은 출결/숙제 기본 API만이다.

분리 대상 API:
- /api/attendance-history
- /api/attendance-month
- /api/attendance-batch
- /api/homework-batch
- PATCH /api/attendance
- PATCH /api/homework

가능하면 아래처럼 파일을 나눈다.

- apmath/worker-backup/worker/routes/attendance-homework.js

또는 두 파일로 나누어도 된다.

- apmath/worker-backup/worker/routes/attendance.js
- apmath/worker-backup/worker/routes/homework.js

권장:
- attendance-homework.js 하나로 묶는다.
- 이유: 현재 attendance-history, attendance-month가 attendance와 homework를 같이 반환한다.

## 1-1. 이번에 분리하지 않을 것

아래는 이번 작업에서 절대 분리하지 않는다.

- /api/homework-photo
- /api/student-portal
- /api/exam-sessions
- /api/class-exam-assignments
- /api/exam-blueprints
- /api/consultations
- /api/operation-memos
- /api/academy-schedules
- /api/daily-journals
- /api/class-textbooks
- /api/class-daily-records
- /api/report-ai-proxy
- archive/check/QR/OMR 관련 API

특히 homework-photo는 제출/취소/학생 토큰/숙제 동기화가 섞여 있으므로 이번에 건드리지 않는다.

---

## 2. route 파일 책임

## 2-1. routes/attendance-homework.js

담당:
- attendance-history
- attendance-month
- attendance-batch
- homework-batch
- attendance PATCH
- homework PATCH

export 함수명 권장:

export async function handleAttendanceHomework(request, env, teacher, path, url) { ... }

또는 현재 route 스타일에 맞춘다.

반드시 유지할 기존 동작:

### attendance-history
- GET /api/attendance-history
- admin: 해당 날짜 전체 attendance/homework 반환
- teacher: 담당 반 학생의 attendance/homework만 반환
- date 기본값은 todayKstDateString()
- 응답 구조 유지:
  - { attendance, homework, date }

### attendance-month
- GET /api/attendance-month?month=YYYY-MM
- month 검증 유지
- admin: 해당 월 전체 attendance/homework/academy_schedules 반환
- teacher: 담당 학생 범위 attendance/homework + 해당 범위 academy_schedules 반환
- 응답 구조 유지:
  - { success: true, month, attendance, homework, academy_schedules }

### attendance-batch
- POST /api/attendance-batch
- teacher 인증 필요
- entries 내 모든 studentId에 canAccessStudent 검사
- INSERT ... ON CONFLICT 기존 방식 유지
- 응답 구조 유지:
  - { success: true }

### homework-batch
- POST /api/homework-batch
- teacher 인증 필요
- entries 내 모든 studentId에 canAccessStudent 검사
- INSERT ... ON CONFLICT 기존 방식 유지
- 응답 구조 유지:
  - { success: true }

### PATCH /api/attendance
- teacher 인증 필요
- studentId/date 필수
- status/tags/memo 중 하나 이상 필수
- 기존 normalizeText 방식 유지
- 기존 id = `${studentId}_${date}` 유지
- 없는 경우 INSERT, 있는 경우 UPDATE
- tags/memo/status 기존 동작 유지
- 응답 구조 유지:
  - { success: true }

### PATCH /api/homework
- teacher 인증 필요
- canAccessStudent 검사
- id = `${studentId}_${date}` 유지
- INSERT ... ON CONFLICT 기존 방식 유지
- 응답 구조 유지:
  - { success: true }

---

## 3. index.js 수정 기준

index.js에는 import 추가:

import { handleAttendanceHomework } from './routes/attendance-homework.js';

기존 API routing block에서 Not Found보다 앞에 아래 위임을 추가한다.

개념:

if (
  resource === 'attendance-history' ||
  resource === 'attendance-month' ||
  resource === 'attendance-batch' ||
  resource === 'homework-batch' ||
  resource === 'attendance' ||
  resource === 'homework'
) {
  const response = await handleAttendanceHomework(request, env, teacher, path, url);
  if (response) return response;
}

주의:
- 기존 코드 스타일에 맞게 작성한다.
- teacher를 index.js에서 미리 verifyAuth하는 구조인지, route 안에서 verifyAuth하는 구조인지 기존 분리 route 패턴에 맞춘다.
- 현재 코드에서 해당 API들이 각자 verifyAuth를 수행하고 있으므로 route 안에서 verifyAuth를 호출해도 된다.
- 단, verifyAuth/canAccessStudent/todayKstDateString을 route에서 사용할 수 있어야 한다.

## 3-1. 인증/helper 처리

attendance-homework.js에서 필요한 함수:
- verifyAuth
- isAdminUser
- canAccessStudent
- todayKstDateString
- headers 또는 json response helper

이미 helpers/admin-db.js 또는 기존 helpers에 해당 함수가 있으면 재사용한다.

없다면 아래 중 하나로 처리한다.

권장:
- 현재 students/classes/teachers 분리 때 만든 helpers/admin-db.js에 있는 공통 권한 helper를 재사용한다.
- 만약 verifyAuth가 아직 index.js에만 있다면 이번 작업에서 최소 범위로 helper 이동을 검토한다.

단, helper 이동이 위험하면:
- attendance-homework.js 안에 필요한 최소 helper만 중복 없이 이동한다.
- index.js의 기존 helper를 삭제할 때 기존 레거시 API가 참조하는지 반드시 확인한다.

중요:
- verifyAuth, canAccessStudent, canAccessClass, isAdminUser는 기존 레거시 API가 아직 많이 사용한다.
- 이동 후 index.js에서 import/export 누락으로 기존 API가 깨지면 실패다.
- 확실하지 않으면 기존 index.js helper는 남기고 route 파일에 필요한 helper를 별도 import 또는 최소 복사한다.

---

## 4. 기존 코드 제거 기준

index.js에서 아래 기존 블록은 route로 옮긴 뒤 제거하거나 위임 뒤 도달하지 않게 한다.

대상 블록:
- if (resource === 'attendance-history' && method === 'GET') { ... }
- if (resource === 'attendance-month' && method === 'GET') { ... }
- if (resource === 'attendance-batch' && method === 'POST') { ... }
- if (resource === 'homework-batch' && method === 'POST') { ... }
- if (method === 'PATCH' && resource === 'attendance') { ... }
- if (method === 'PATCH' && resource === 'homework') { ... }

주의:
- 기존 로직을 route 파일에 옮길 때 SQL, 응답 구조, status code를 바꾸지 않는다.
- route 파일로 옮긴 뒤 index.js에 중복으로 남아도 당장은 동작할 수 있으나, 정리 효과가 떨어진다.
- 가능하면 중복 제거한다.
- 단, 제거하다가 다른 로직까지 같이 삭제하지 않는다.

---

## 5. 검증 명령

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/attendance-homework.js

기존 route 안전 확인:

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
- apmath/worker-backup/worker/routes/attendance-homework.js
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

---

## 6. 배포 후 수동 확인 항목

이번 작업에서는 배포하지 않는다.
CODEX_RESULT.md에는 배포 가능 여부만 적는다.

배포 후 직접 확인할 명령은 아래와 같다.

### 6-1. attendance-history

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/attendance-history" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- attendance 배열
- homework 배열
- date

### 6-2. attendance-month

현재 월 기준 예시:

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/attendance-month?month=2026-05" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- success true
- attendance 배열
- homework 배열
- academy_schedules 배열

### 6-3. 기존 smoke test 유지

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/students" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/classes" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/teachers" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- students/classes/teachers 정상 유지

### 6-4. UI 수동 확인

- 대시보드 진입
- 출석부 오늘 날짜 표시
- 출석/숙제 저장
- 월간 출석부 표시
- 학생관리/반관리 정상

---

## 7. 배포 판단

CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:
- 모든 node --check 통과
- attendance/homework route 분리 완료
- 기존 attendance-history 응답 구조 유지
- 기존 attendance-month 응답 구조 유지
- 기존 batch/PATCH 저장 로직 유지
- 기존 students/classes/teachers route 영향 없음
- UI 파일 변경 없음
- schema/migration 변경 없음

배포 보류:
- node --check 실패
- attendance-history/month 응답 구조 변경 가능성 있음
- PATCH attendance/homework 저장 로직 변경 가능성 있음
- students/classes/teachers route 영향 있음
- UI 파일 변경 있음
- schema/migration 변경 있음

---

## 8. 완료 보고

루트에 CODEX_RESULT.md를 작성한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
- 파일 목록

## 2. 구현 완료 또는 확인 완료
- attendance-homework route 추가
- attendance-history 분리
- attendance-month 분리
- attendance-batch 분리
- homework-batch 분리
- PATCH attendance 분리
- PATCH homework 분리
- index.js route 위임 구조 반영
- 기존 students/classes/teachers route 영향 없음 확인
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
- attendance-history smoke test
- attendance-month smoke test
- 출석/숙제 UI 수동 확인
- 정상 확인 후 커밋/푸시
- 이후 homework-photo 또는 exam route 분리 여부 결정

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF