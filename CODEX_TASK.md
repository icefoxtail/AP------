cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
Worker route/helper 분리 10단계 — homework-photo 계열 API 분리

## 목표
Worker index.js 비대화 정리 작업을 계속한다.

이번 10단계에서는 homework-photo 계열 API만 route 파일로 분리한다.

이번 작업은 기능 추가가 아니다.

목표:
- index.js 비대화 완화
- homework-photo 관련 API를 route 파일로 이동
- 기존 숙제사진 배정/제출/조회/취소/R2 흐름 유지
- 기존 API 응답과 동작 유지
- 기존 UI 변경 없음
- DB/schema/migration 변경 없음

## 실제 작업 기준
현재 프로젝트 루트 기준으로 작업한다.

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
- apmath/student/index.html 수정 금지
- apmath/js/report.js 수정 금지
- apmath/js/dashboard.js 수정 금지
- apmath/js/timetable.js 수정 금지
- apmath/js/student.js 수정 금지
- apmath/js/management.js 수정 금지
- apmath/js/core.js 수정 금지
- 기존 분리 route 수정 금지
- foundation routes 수정 금지
- billing-accounting-foundation 수정 금지
- student-portal API 수정 금지
- reports-ai API 수정 금지
- check-omr API 수정 금지
- archive API 분리 금지
- planner API 분리 금지
- 수납·출납 foundation 추가 금지
- R2 bucket 이름 변경 금지
- R2 object key 구조 변경 금지
- 기존 학생 제출 토큰 구조 변경 금지
- 숙제 제출 완료/취소 상태 정책 변경 금지

## homework-photo 절대 원칙
- 기존 숙제사진 배정 생성 흐름 유지
- 기존 학생 제출 링크/토큰 흐름 유지
- 기존 R2 업로드/다운로드/삭제 흐름 유지
- 기존 제출 상태값 유지
- 기존 숙제 완료 연동이 있으면 그대로 유지
- 학생이 다른 학생 제출물에 접근할 수 없게 기존 제한 유지
- 선생님/원장 조회 권한 기존 방식 유지
- 실제 파일 삭제/정리 정책 변경 금지
- 24시간 삭제/보관 정책 관련 코드가 있으면 그대로 유지
- UI 노출 방식 변경 금지

## 허용 범위
- homework-photo route 파일 추가
- 기존 index.js의 homework-photo 관련 API 처리 로직을 route 파일로 이동
- index.js에서 새 route로 위임하도록 최소 수정
- 필요한 공통 helper 추가 또는 기존 helper 재사용
- CODEX_RESULT.md 작성

---

## 1. 이번 분리 대상

이번 작업에서 분리할 대상은 homework-photo 계열 API만이다.

분리 대상 후보 API:
- /api/homework-photo
- /api/homework-photo/assignments
- /api/homework-photo/submissions
- /api/homework-photo/files
- /api/homework-photo/student
- /api/homework-photo/submit
- /api/homework-photo/cancel
- /api/homework-photo/delete
- /api/homework-photo/download
- index.js 안에서 homework_photo_assignments / homework_photo_submissions / homework_photo_files / R2 관련으로 묶인 모든 API

현재 index.js에서 실제 resource 이름이 다르면 실제 코드 기준으로 동일 기능만 분리한다.

권장 route 파일:
- apmath/worker-backup/worker/routes/homework-photo.js

담당 기능:
- 숙제사진 배정 생성/조회
- 학생별 제출 슬롯 생성/조회
- 학생 제출 링크/토큰 검증
- 학생 사진 업로드
- 제출 파일 조회
- 제출 취소/삭제
- R2 파일 저장/조회/삭제
- 숙제 완료 상태 연동이 기존에 있으면 그대로 유지

## 1-1. 이번에 분리하지 않을 것

아래는 이번 작업에서 절대 분리하지 않는다.

- /api/student-portal
- /api/check-init
- /api/check-pin
- /api/qr-classes
- /api/report-ai-proxy
- /api/ai/report-analysis
- /api/ai/student-report
- archive 관련 API
- planner 관련 API
- 수납·출납 foundation API
- class-daily API
- attendance/homework 일반 API
- exam-sessions API

주의:
- attendance-homework route의 일반 homework 상태 저장 API는 수정하지 않는다.
- homework-photo route는 사진 제출 전용 API만 담당한다.
- 학생 포털 route는 수정하지 않는다.
- check/QR/OMR route는 수정하지 않는다.

---

## 2. route 파일 책임

## 2-1. routes/homework-photo.js

export 함수명 권장:

export async function handleHomeworkPhoto(request, env, teacher, path, url) { ... }

또는 현재 route 스타일에 맞춘다.

담당 resource:
- homework-photo
- 실제 index.js에서 homework-photo 관련으로 처리하던 resource들

반드시 유지할 기존 동작:

### 배정 생성/조회
- teacher 인증 필요 여부 기존 방식 유지
- admin/teacher 접근 범위 기존 방식 유지
- class_id 접근권한 canAccessClass 기존 방식 유지
- 학생 슬롯 자동 생성 기존 방식 유지
- due_date 기본 계산 방식이 있으면 그대로 유지
- 응답 구조 유지

### 학생 제출 링크/토큰
- 기존 토큰 검증 방식 유지
- 학생 본인 제출 슬롯만 접근 가능
- 토큰 없는 접근 차단 기존 방식 유지
- 만료/취소/제출완료 상태 처리 기존 방식 유지
- 응답 구조 유지

### 사진 업로드
- 기존 multipart/form-data 또는 base64 처리 방식 유지
- 기존 파일 크기/확장자/mime 제한 유지
- 기존 R2 object key 생성 방식 유지
- 기존 homework_photo_files insert 방식 유지
- 제출 상태 변경 기존 방식 유지
- 응답 구조 유지

### 파일 조회/다운로드
- 기존 R2 get 방식 유지
- 기존 권한 확인 유지
- 기존 content-type / filename 처리 유지
- 학생이 타 학생 파일에 접근하지 못하도록 기존 제한 유지

### 삭제/취소
- 기존 soft delete/hard delete 방식 유지
- 기존 R2 delete 호출이 있으면 그대로 유지
- homework_photo_files / submissions 상태 변경 방식 유지
- 응답 구조 유지

### 숙제 완료 연동
- 사진 제출 완료 시 일반 homework 상태를 완료로 바꾸는 기존 로직이 있으면 그대로 유지
- 연동이 없으면 새로 만들지 않는다
- 기존 homework-batch / PATCH homework route는 수정하지 않는다

---

## 3. index.js 수정 기준

index.js에는 import 추가:

import { handleHomeworkPhoto } from './routes/homework-photo.js';

기존 API routing block에서 Not Found보다 앞에 아래 위임을 추가한다.

개념:

if (resource === 'homework-photo') {
  const response = await handleHomeworkPhoto(request, env, teacher, path, url);
  if (response) return response;
}

주의:
- 실제 resource 이름은 index.js 기준으로 맞춘다.
- 존재하지 않는 resource를 억지로 만들지 않는다.
- 기존 분리 route 패턴과 맞춘다.
- Not Found보다 앞에 있어야 한다.
- initial-data 본체는 건드리지 않는다.
- student-portal/check-omr/attendance-homework route보다 순서를 잘못 바꿔 기존 흐름을 깨지 않는다.

---

## 4. helper 처리

homework-photo.js에서 필요한 함수:
- verifyAuth
- isAdminUser
- canAccessStudent
- canAccessClass
- headers 또는 json response helper
- makeId
- todayKstDateString
- normalizeText
- R2 put/get/delete helper가 있으면 기존 방식 유지

현재 helpers/admin-db.js 또는 기존 helper에 필요한 함수가 있으면 재사용한다.

주의:
- verifyAuth, canAccessStudent, canAccessClass는 index.js의 기존 레거시 API도 계속 사용한다.
- helper 이동으로 index.js가 깨지면 실패다.
- 학생용 토큰 검증에 admin/teacher 인증을 억지로 적용하지 않는다.
- 확실하지 않으면 기존 helper는 index.js에 남기고 route에서는 필요한 최소 helper만 가져간다.
- 중복 제거보다 안전한 동작 유지가 우선이다.

---

## 5. 기존 코드 제거 기준

index.js에서 homework-photo 관련 기존 블록은 route로 옮긴 뒤 제거하거나 위임 뒤 도달하지 않게 한다.

대상 블록 예시:
- if (resource === 'homework-photo') { ... }
- if (pathname.includes('homework-photo')) { ... }
- homework_photo_assignments 관련 API 블록
- homework_photo_submissions 관련 API 블록
- homework_photo_files 관련 API 블록
- R2 homework photo 파일 처리 블록

주의:
- 기존 로직을 route 파일에 옮길 때 SQL, 응답 구조, status code를 바꾸지 않는다.
- route 파일로 옮긴 뒤 index.js에 중복으로 남아도 당장은 동작할 수 있으나 정리 효과가 떨어진다.
- 가능하면 중복 제거한다.
- 단, attendance-homework/student-portal/check-omr/report/archive/planner 관련 블록까지 같이 삭제하지 않는다.

---

## 6. R2 관련 주의

Cloudflare Worker binding 이름을 반드시 기존 코드 기준으로 유지한다.

확인할 것:
- env.R2
- env.BUCKET
- env.HOMEWORK_PHOTO_BUCKET
- 실제 사용 중인 binding 이름

기존 binding 이름을 바꾸지 않는다.

R2 object key 생성 방식도 기존과 동일하게 유지한다.

예:
- assignment_id
- submission_id
- student_id
- filename
- created_at
등을 섞어 만든 기존 key가 있으면 그대로 유지.

주의:
- 새 bucket 만들지 않는다.
- wrangler.toml 수정 금지.
- R2 public URL 구조 변경 금지.
- signed URL 구조가 있으면 변경 금지.

---

## 7. 검증 명령

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/homework-photo.js

기존 route 안전 확인:

node --check apmath/worker-backup/worker/routes/check-omr.js
node --check apmath/worker-backup/worker/routes/reports-ai.js
node --check apmath/worker-backup/worker/routes/student-portal.js
node --check apmath/worker-backup/worker/routes/billing-accounting-foundation.js
node --check apmath/worker-backup/worker/routes/class-daily.js
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
node --check apmath/js/report.js

학생 포털 프론트는 수정하지 말고, HTML 파일은 node --check 대상이 아니면 생략한다.
apmath/student/index.html 수정 여부만 확인한다.

변경 파일 확인:

git diff --name-only

정상 변경 파일:
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/homework-photo.js
- 필요 시 apmath/worker-backup/worker/helpers/*.js
- CODEX_RESULT.md
- CODEX_TASK.md는 현재 지시 파일 갱신 때문에 포함될 수 있음

아래 파일이 변경되면 실패:
- apmath/student/index.html
- apmath/js/report.js
- apmath/js/dashboard.js
- apmath/js/timetable.js
- apmath/js/student.js
- apmath/js/management.js
- apmath/js/core.js
- apmath/index.html
- apmath/worker-backup/worker/schema.sql
- apmath/worker-backup/worker/migrations/*
- archive/**/*
- wrangler.toml

---

## 8. 배포 후 수동 확인 항목

이번 작업에서는 배포하지 않는다.
CODEX_RESULT.md에는 배포 가능 여부만 적는다.

배포 후 직접 확인할 항목은 아래와 같다.

### 8-1. 기존 route smoke test

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/students" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/initial-data" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/billing-accounting-foundation/payment-methods" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기대:
- 기존 route 정상 유지

### 8-2. homework-photo 기본 조회 smoke test

실제 기존 endpoint 방식에 맞춰 확인한다.

예시:

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/homework-photo/assignments" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

또는 기존 방식이 `/api/homework-photo?action=assignments`라면 기존 방식으로 확인한다.

기대:
- 404 아님
- 기존 응답 구조 유지
- 권한 실패가 기존 동작이면 기존 status 유지

### 8-3. 숙제사진 UI 수동 확인

확인:
- 선생님 숙제사진 배정 화면 정상
- 배정 생성 정상
- 학생 제출 링크 생성 정상
- 학생 제출 화면 정상
- 사진 업로드 정상
- 제출 완료 상태 정상
- 선생님 제출물 조회 정상
- 파일 열람 정상
- 취소/삭제 기존 동작 정상

### 8-4. 보안/권한 확인

확인:
- 학생 토큰 없이 제출물 접근 불가
- 학생이 다른 학생 제출물 접근 불가
- teacher는 담당 반/학생 범위 유지
- admin은 기존 범위 유지
- R2 파일 직접 노출 정책 기존과 동일

---

## 9. 배포 판단

CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:
- 모든 node --check 통과
- homework-photo route 분리 완료
- 기존 homework-photo 응답 구조 유지
- 기존 학생 토큰 검증 유지
- 기존 R2 key/binding 구조 유지
- 기존 제출/취소/조회/파일 처리 흐름 유지
- 기존 routes 영향 없음
- UI 파일 변경 없음
- schema/migration 변경 없음
- wrangler.toml 변경 없음

배포 보류:
- node --check 실패
- homework-photo 응답 구조 변경 가능성 있음
- 학생 토큰 검증 약화 가능성 있음
- R2 binding/key 구조 변경 가능성 있음
- 파일 삭제/보관 정책 변경 가능성 있음
- 기존 route 영향 있음
- UI 파일 변경 있음
- schema/migration 변경 있음
- wrangler.toml 변경 있음

---

## 10. 완료 보고

루트에 CODEX_RESULT.md를 작성한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
- 파일 목록

## 2. 구현 완료 또는 확인 완료
- homework-photo route 추가
- homework-photo 배정 API 분리
- homework-photo 제출 API 분리
- homework-photo 파일/R2 처리 API 분리
- index.js route 위임 구조 반영
- 기존 students/classes/teachers route 영향 없음 확인
- 기존 attendance-homework route 영향 없음 확인
- 기존 exams route 영향 없음 확인
- 기존 operations/class-daily/student-portal/reports-ai/check-omr/foundation route 영향 없음 확인
- 기존 initial-data 구조 유지 확인
- 학생 토큰 검증 유지 확인
- R2 binding/key 구조 유지 확인
- UI 파일 변경 없음 확인
- schema/migration 변경 없음 확인
- wrangler.toml 변경 없음 확인

## 3. 실행 결과
- node --check 결과
- git diff --name-only 결과
- UI 파일 변경 여부
- schema/migration/wrangler 변경 여부

## 4. 결과 요약
- index.js 추가 정리 효과
- 분리된 route 목록
- 기존 기능 영향 여부
- 배포 가능 여부

## 5. 다음 조
- Worker 배포
- homework-photo smoke test
- 숙제사진 UI 수동 확인
- 기존 route smoke test
- 정상 확인 후 커밋/푸시
- 이후 남은 index.js 정리 범위 재평가

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF