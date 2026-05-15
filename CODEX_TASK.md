cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
Worker route/helper 분리 5단계 — 운영관리 계열 API 분리

## 목표
Worker route/helper 분리 1~4단계 완료 후, 이번 5단계에서는 운영관리 계열 API만 route 파일로 분리한다.

이번 작업은 기능 추가가 아니다.

목표:
- index.js 비대화 완화
- consultations / operation-memos / schedules / journals / school exam records 계열 API를 route 파일로 이동
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
- attendance-homework route 수정 금지
- exams route 수정 금지
- foundation routes 수정 금지
- homework-photo API 분리 금지
- student-portal API 분리 금지
- report/AI API 분리 금지
- archive API 분리 금지
- planner API 분리 금지
- 수납·출납 foundation 추가 금지
- 알림톡/문자 발송 기능 추가 금지

## 허용 범위
- 운영관리 route 파일 추가
- 기존 index.js의 운영관리 관련 API 처리 로직을 route 파일로 이동
- index.js에서 새 route로 위임하도록 최소 수정
- 필요한 공통 helper 추가 또는 기존 helper 재사용
- CODEX_RESULT.md 작성

---

## 1. 이번 분리 대상

이번 작업에서 분리할 대상은 운영관리 계열 API만이다.

분리 대상 후보 API:
- /api/consultations
- /api/operation-memos
- /api/exam-schedules
- /api/academy-schedules
- /api/school-exam-records
- /api/daily-journals

현재 index.js에서 실제 resource 이름이 다르면 실제 코드 기준으로 동일 기능만 분리한다.

권장 route 파일:
- apmath/worker-backup/worker/routes/operations.js

담당 기능:
- 상담 기록 CRUD
- 운영 메모 CRUD
- 시험 일정 CRUD
- 학원 일정 CRUD
- 학교 시험 기록 CRUD
- 일지/daily journal CRUD

## 1-1. 이번에 분리하지 않을 것

아래는 이번 작업에서 절대 분리하지 않는다.

- /api/homework-photo
- /api/student-portal
- /api/report-ai-proxy
- /api/class-textbooks
- /api/class-daily-records
- /api/class-daily-progress
- archive 관련 API
- planner 관련 API
- QR/OMR/check 관련 API
- 수납·출납 foundation API

---

## 2. route 파일 책임

## 2-1. routes/operations.js

export 함수명 권장:

export async function handleOperations(request, env, teacher, path, url) { ... }

또는 현재 route 스타일에 맞춘다.

담당 resource:
- consultations
- operation-memos
- exam-schedules
- academy-schedules
- school-exam-records
- daily-journals

반드시 유지할 기존 동작:

---

### consultations

기존 동작 유지:
- teacher 인증 필요
- POST 상담 생성
- GET 학생별 상담 조회
- PATCH 상담 수정
- DELETE 상담 삭제
- canAccessStudent 검사 유지
- 응답 구조와 status code 유지

주의:
- 상담 데이터 컬럼명 변경 금지
- 상담 기록 삭제 정책 기존 방식 유지
- 원장/선생님 권한 기존 방식 유지

---

### operation-memos

기존 동작 유지:
- teacher 인증 필요
- admin은 전체 조회 가능
- teacher는 본인 메모 또는 공용 메모 기준 기존 조회 조건 유지
- POST/PATCH/DELETE 기존 동작 유지
- 오늘일정/주간일정/메모 공유 정책 기존 코드 기준 유지

주의:
- 메모 공유 정책을 이번에 바꾸지 않는다.
- 원장이 다른 선생님 메모를 보는 정책을 새로 바꾸지 않는다.
- UI 노출 변경 금지.

---

### exam-schedules

기존 동작 유지:
- 시험 일정 CRUD 기존 방식 유지
- 응답 구조 유지
- exam_date 정렬 유지
- 권한 조건 기존 방식 유지

주의:
- exam_schedules 테이블명 유지
- exams_schedule 같은 새 테이블 만들지 않는다.

---

### academy-schedules

기존 동작 유지:
- 학원 일정 CRUD 기존 방식 유지
- is_deleted soft delete 기존 방식 유지
- target_scope 조건 유지
- global / teacher / student 범위 기존 방식 유지
- schedule_date / start_time 정렬 유지

주의:
- 주간일정 공유 정책 변경 금지
- 휴무일/공휴일 감지 로직이 있으면 기존 방식 유지

---

### school-exam-records

기존 동작 유지:
- 학교 시험 기록 CRUD 기존 방식 유지
- is_deleted soft delete 기존 방식 유지
- 학생 접근권한 canAccessStudent 유지
- 응답 구조 유지

주의:
- 성적 기록 데이터 구조 변경 금지
- target_score_snapshot 처리 기존 방식 유지

---

### daily-journals

기존 동작 유지:
- daily_journals CRUD 기존 방식 유지
- admin/teacher 조회 조건 기존 방식 유지
- status 기본값/정렬 기존 방식 유지
- 응답 구조 유지

주의:
- 일지와 메모를 합치지 않는다.
- 오늘일정/주간일정/일지 UI 변경 금지.

---

## 3. index.js 수정 기준

index.js에는 import 추가:

import { handleOperations } from './routes/operations.js';

기존 API routing block에서 Not Found보다 앞에 아래 위임을 추가한다.

개념:

if (
  resource === 'consultations' ||
  resource === 'operation-memos' ||
  resource === 'exam-schedules' ||
  resource === 'academy-schedules' ||
  resource === 'school-exam-records' ||
  resource === 'daily-journals'
) {
  const response = await handleOperations(request, env, teacher, path, url);
  if (response) return response;
}

주의:
- 기존 코드 스타일에 맞게 작성한다.
- 실제 resource 이름이 다르면 실제 index.js 기준으로 맞춘다.
- 기존 분리 route 패턴과 맞춘다.
- Not Found보다 앞에 있어야 한다.
- initial-data 본체는 건드리지 않는다.

---

## 4. helper 처리

operations.js에서 필요한 함수:
- verifyAuth
- isAdminUser
- canAccessStudent
- canAccessClass가 필요하면 사용
- todayKstDateString이 필요하면 사용
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
- if (resource === 'consultations') { ... }
- if (resource === 'operation-memos') { ... }
- if (resource === 'exam-schedules') { ... }
- if (resource === 'academy-schedules') { ... }
- if (resource === 'school-exam-records') { ... }
- if (resource === 'daily-journals') { ... }

주의:
- 기존 로직을 route 파일에 옮길 때 SQL, 응답 구조, status code를 바꾸지 않는다.
- route 파일로 옮긴 뒤 index.js에 중복으로 남아도 당장은 동작할 수 있으나 정리 효과가 떨어진다.
- 가능하면 중복 제거한다.
- 단, class_textbooks/class_daily_records/class_daily_progress/homework-photo/student-portal/report 관련 블록까지 같이 삭제하지 않는다.

---

## 6. 검증 명령

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/operations.js

기존 route 안전 확인:

node --check apmath/worker-backup/worker/routes/exams.js
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
- apmath/worker-backup/worker/routes/operations.js
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

### 7-1. operation-memos 조회

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/operation-memos" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- success true
- data 배열 또는 기존 응답 구조

### 7-2. exam-schedules 조회

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/exam-schedules" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- 기존 응답 구조 유지

### 7-3. academy-schedules 조회

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/academy-schedules" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- 기존 응답 구조 유지

### 7-4. daily-journals 조회

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/daily-journals" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- 기존 응답 구조 유지

### 7-5. 기존 smoke test 유지

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/students" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/attendance-history" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/exam-sessions/by-class?class=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- 기존 route 정상 유지

### 7-6. UI 수동 확인

- 대시보드 진입
- 오늘 메모/운영 메모 표시
- 시험 일정 표시
- 학원 일정 표시
- 일지 표시
- 학생관리/출석/시험 기존 화면 정상

---

## 8. 배포 판단

CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:
- 모든 node --check 통과
- operations route 분리 완료
- consultations 응답 구조 유지
- operation-memos 응답 구조 유지
- exam-schedules 응답 구조 유지
- academy-schedules 응답 구조 유지
- school-exam-records 응답 구조 유지
- daily-journals 응답 구조 유지
- 기존 students/classes/teachers/attendance/exams route 영향 없음
- UI 파일 변경 없음
- schema/migration 변경 없음

배포 보류:
- node --check 실패
- 운영관리 API 응답 구조 변경 가능성 있음
- 기존 메모/일정/일지 UI 영향 가능성 있음
- students/classes/teachers/attendance/exams route 영향 있음
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
- operations route 추가
- consultations 분리
- operation-memos 분리
- exam-schedules 분리
- academy-schedules 분리
- school-exam-records 분리
- daily-journals 분리
- index.js route 위임 구조 반영
- 기존 students/classes/teachers route 영향 없음 확인
- 기존 attendance-homework route 영향 없음 확인
- 기존 exams route 영향 없음 확인
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
- operation-memos smoke test
- exam-schedules smoke test
- academy-schedules smoke test
- daily-journals smoke test
- 운영관리 UI 수동 확인
- 정상 확인 후 커밋/푸시
- 이후 class daily/textbook route 또는 homework-photo route 분리 여부 결정

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF