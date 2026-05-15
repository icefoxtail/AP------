cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
Worker route/helper 분리 6단계 — class textbook / class daily 계열 API 분리

## 목표
Worker route/helper 분리 1~5단계 완료 후, 이번 6단계에서는 반별 교재/일일기록/진도 계열 API만 route 파일로 분리한다.

이번 작업은 기능 추가가 아니다.

목표:
- index.js 비대화 완화
- class_textbooks / class_daily_records / class_daily_progress 계열 API를 route 파일로 이동
- 기존 API 응답과 동작 유지
- 기존 UI 변경 없음
- DB/schema/migration 변경 없음
- 일지/출석/시험/학생포털 흐름 회귀 방지

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
- operations route 수정 금지
- foundation routes 수정 금지
- homework-photo API 분리 금지
- student-portal API 분리 금지
- report/AI API 분리 금지
- archive API 분리 금지
- planner API 분리 금지
- QR/OMR/check 관련 API 수정 금지
- 수납·출납 foundation 추가 금지

## 허용 범위
- class daily/textbook route 파일 추가
- 기존 index.js의 class_textbooks / class_daily_records / class_daily_progress 관련 API 처리 로직을 route 파일로 이동
- index.js에서 새 route로 위임하도록 최소 수정
- 필요한 공통 helper 추가 또는 기존 helper 재사용
- CODEX_RESULT.md 작성

---

## 1. 이번 분리 대상

이번 작업에서 분리할 대상은 반별 교재/일일기록/진도 계열 API만이다.

분리 대상 후보 API:
- /api/class-textbooks
- /api/class-daily-records
- /api/class-daily-progress

현재 index.js에서 실제 resource 이름이 다르면 실제 코드 기준으로 동일 기능만 분리한다.

권장 route 파일:
- apmath/worker-backup/worker/routes/class-daily.js

담당 기능:
- 반별 교재 CRUD
- 반별 일일기록 CRUD
- 반별 진도 CRUD 또는 저장/조회
- 기존 일지 생성과 연결되는 class_daily_records / class_daily_progress 저장 흐름

## 1-1. 이번에 분리하지 않을 것

아래는 이번 작업에서 절대 분리하지 않는다.

- /api/daily-journals
- /api/operation-memos
- /api/homework-photo
- /api/student-portal
- /api/report-ai-proxy
- /api/exam-sessions
- /api/class-exam-assignments
- /api/exam-blueprints
- archive 관련 API
- planner 관련 API
- QR/OMR/check 관련 API
- 수납·출납 foundation API

주의:
- daily-journals는 이미 operations route에서 처리한다.
- 이번 route는 daily_journals가 아니라 class_textbooks / class_daily_records / class_daily_progress만 담당한다.
- initial-data 본체는 건드리지 않는다.

---

## 2. route 파일 책임

## 2-1. routes/class-daily.js

export 함수명 권장:

export async function handleClassDaily(request, env, teacher, path, url) { ... }

또는 현재 route 스타일에 맞춘다.

담당 resource:
- class-textbooks
- class-daily-records
- class-daily-progress

반드시 유지할 기존 동작:

---

### class-textbooks

기존 동작 유지:
- teacher 인증 필요
- class 접근 권한 canAccessClass 유지
- GET/POST/PATCH/DELETE 또는 기존 구현된 method 유지
- status active/completed 등 기존 값 유지
- start_date/end_date/sort_order 기존 처리 유지
- 응답 구조와 status code 유지

주의:
- 교재 상태값을 새로 바꾸지 않는다.
- 교재 완료/복원/삭제 정책을 임의로 바꾸지 않는다.
- class_textbooks 테이블명과 컬럼명 유지.

---

### class-daily-records

기존 동작 유지:
- teacher 인증 필요
- class 접근 권한 canAccessClass 유지
- class_id/date 기준 기록 처리 기존 방식 유지
- teacher_name 저장 기존 방식 유지
- special_note 처리 기존 방식 유지
- 생성/수정/조회/삭제 기존 method 유지
- 응답 구조와 status code 유지

주의:
- daily_journals와 class_daily_records를 합치지 않는다.
- 일지 자동 생성 또는 일지 반영 로직이 있으면 기존 방식 그대로 유지한다.
- 날짜 기본값/정렬 기존 방식 유지.

---

### class-daily-progress

기존 동작 유지:
- teacher 인증 필요
- class 접근 권한 canAccessClass 유지
- record_id/class_id/textbook_id/textbook_title_snapshot/progress_text 기존 처리 유지
- 진도 저장 시 기존 delete 후 insert 또는 upsert 방식이 있으면 그대로 유지
- 응답 구조와 status code 유지

주의:
- progress_text를 요약/가공하지 않는다.
- textbook_title_snapshot 처리 방식 변경 금지.
- class_daily_progress 테이블명과 컬럼명 유지.

---

## 3. index.js 수정 기준

index.js에는 import 추가:

import { handleClassDaily } from './routes/class-daily.js';

기존 API routing block에서 Not Found보다 앞에 아래 위임을 추가한다.

개념:

if (
  resource === 'class-textbooks' ||
  resource === 'class-daily-records' ||
  resource === 'class-daily-progress'
) {
  const response = await handleClassDaily(request, env, teacher, path, url);
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

class-daily.js에서 필요한 함수:
- verifyAuth
- isAdminUser가 필요하면 사용
- canAccessClass
- canAccessStudent가 필요하면 사용
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
- if (resource === 'class-textbooks') { ... }
- if (resource === 'class-daily-records') { ... }
- if (resource === 'class-daily-progress') { ... }

주의:
- 기존 로직을 route 파일에 옮길 때 SQL, 응답 구조, status code를 바꾸지 않는다.
- route 파일로 옮긴 뒤 index.js에 중복으로 남아도 당장은 동작할 수 있으나 정리 효과가 떨어진다.
- 가능하면 중복 제거한다.
- 단, daily-journals/homework-photo/student-portal/report/exam 관련 블록까지 같이 삭제하지 않는다.

---

## 6. 검증 명령

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/class-daily.js

기존 route 안전 확인:

node --check apmath/worker-backup/worker/routes/operations.js
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
- apmath/worker-backup/worker/routes/class-daily.js
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

### 7-1. class-textbooks 조회

실제 존재하는 반 id 하나로 테스트한다.

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/class-textbooks?class_id=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

만약 기존 API가 `class` 파라미터를 사용하면 아래도 확인한다.

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/class-textbooks?class=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- 기존 응답 구조 유지
- 교재 배열 또는 success wrapper

### 7-2. class-daily-records 조회

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/class-daily-records?class_id=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

만약 기존 API가 `class` 파라미터를 사용하면 아래도 확인한다.

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/class-daily-records?class=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- 기존 응답 구조 유지
- 기록 배열 또는 success wrapper

### 7-3. class-daily-progress 조회

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/class-daily-progress?class_id=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

만약 기존 API가 `record_id` 기준 조회만 지원했다면 class_id 조회는 Not Found 또는 Bad Request일 수 있다.
그 경우 기존 지원 방식 기준으로만 PASS 판단한다.

### 7-4. initial-data 유지 확인

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/initial-data" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- class_textbooks 포함
- class_daily_records 포함
- class_daily_progress 포함

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
- 반별 교재 표시
- 반별 일일기록 표시
- 진도 저장/조회 흐름
- 오늘 일지/반별 진도 UI 정상
- 학생관리/출석/시험 기존 화면 정상

---

## 8. 배포 판단

CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:
- 모든 node --check 통과
- class-daily route 분리 완료
- class-textbooks 응답 구조 유지
- class-daily-records 응답 구조 유지
- class-daily-progress 응답 구조 유지
- 기존 students/classes/teachers/attendance/exams/operations route 영향 없음
- UI 파일 변경 없음
- schema/migration 변경 없음
- initial-data 구조 변경 없음

배포 보류:
- node --check 실패
- class-textbooks 응답 구조 변경 가능성 있음
- class-daily-records 응답 구조 변경 가능성 있음
- class-daily-progress 저장/조회 로직 변경 가능성 있음
- 기존 운영관리/출석/시험 route 영향 있음
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
- class-daily route 추가
- class-textbooks 분리
- class-daily-records 분리
- class-daily-progress 분리
- index.js route 위임 구조 반영
- 기존 students/classes/teachers route 영향 없음 확인
- 기존 attendance-homework route 영향 없음 확인
- 기존 exams route 영향 없음 확인
- 기존 operations route 영향 없음 확인
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
- class-textbooks smoke test
- class-daily-records smoke test
- class-daily-progress smoke test 또는 기존 지원 방식 확인
- initial-data class_textbooks/class_daily_records/class_daily_progress 확인
- 반별 교재/진도 UI 수동 확인
- 정상 확인 후 커밋/푸시
- 이후 homework-photo 또는 student-portal route 분리 여부 결정

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF