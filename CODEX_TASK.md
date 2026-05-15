cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
Worker route/helper 분리 7단계 — student-portal 계열 API 분리

## 목표
Worker index.js 비대화 정리 작업을 계속한다.

이번 7단계에서는 학생 포털 계열 API만 route 파일로 분리한다.

이번 작업은 기능 추가가 아니다.

목표:
- index.js 비대화 완화
- student-portal 관련 API를 route 파일로 이동
- 기존 학생 포털 로그인/배정/OMR 연결 흐름 유지
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
- dashboard.js 수정 금지
- timetable.js 수정 금지
- student.js 수정 금지
- management.js 수정 금지
- core.js 수정 금지
- 기존 분리 route 수정 금지
- foundation routes 수정 금지
- billing-accounting-foundation 수정 금지
- homework-photo API 분리 금지
- report/AI API 분리 금지
- archive API 분리 금지
- planner API 분리 금지
- QR/OMR/check 관련 API 수정 금지
- 수납·출납 foundation 추가 금지

## 학생 포털 절대 원칙
- 학생이 시험지를 직접 여는 기능 추가 금지
- 학생 포털에서 시험지/아카이브 파일 직접 링크 추가 금지
- 학생은 선생님이 제공한 시험지/QR/OMR 방식으로만 접근
- 학생 포털은 배정 확인과 OMR 입력 연결까지만 허용
- 한 번 제출 완료된 OMR은 다시 수정 불가
- 제출 완료 상태에서 수정하기/재입력 버튼 또는 재제출 API 허용 금지
- 기존 제출 완료 차단 로직을 약화시키지 말 것

## 허용 범위
- student-portal route 파일 추가
- 기존 index.js의 student-portal 관련 API 처리 로직을 route 파일로 이동
- index.js에서 새 route로 위임하도록 최소 수정
- 필요한 공통 helper 추가 또는 기존 helper 재사용
- CODEX_RESULT.md 작성

---

## 1. 이번 분리 대상

이번 작업에서 분리할 대상은 학생 포털 계열 API만이다.

분리 대상 후보 API:
- /api/student-portal
- /api/student-portal-login
- /api/student-portal-session
- /api/student-portal-assignments
- /api/student-portal-planner
- /api/student-portal-omr
- index.js 안에서 student portal 관련으로 묶인 모든 API

현재 index.js에서 실제 resource 이름이 다르면 실제 코드 기준으로 동일 기능만 분리한다.

권장 route 파일:
- apmath/worker-backup/worker/routes/student-portal.js

담당 기능:
- 학생 이름/PIN 로그인
- 학생 포털 세션 확인
- 학생 배정 자료 조회
- 학생 포털 OMR 입력 연결
- 플래너 링크에 필요한 student_id / pin 전달 흐름
- 제출 완료 OMR 재수정 차단 관련 서버 로직이 있다면 그대로 유지

## 1-1. 이번에 분리하지 않을 것

아래는 이번 작업에서 절대 분리하지 않는다.

- /api/homework-photo
- /api/check-init
- /api/check-pin
- /api/qr-classes
- /api/report-ai-proxy
- archive 관련 API
- planner 본체 API
- homework-photo 제출/취소/토큰 API
- 수납·출납 foundation API

주의:
- check/QR/OMR 공개 진입 API는 학생 포털과 연결되어 있어도 이번에는 분리하지 않는다.
- 학생 포털 route는 학생 포털 자체 API만 담당한다.
- 학생용 시험지 직접 열기 기능은 절대 추가하지 않는다.

---

## 2. route 파일 책임

## 2-1. routes/student-portal.js

export 함수명 권장:

export async function handleStudentPortal(request, env, teacher, path, url) { ... }

또는 현재 route 스타일에 맞춘다.

담당 resource:
- student-portal 계열 resource
- 실제 index.js에서 student portal 관련으로 처리하던 resource들

반드시 유지할 기존 동작:

### 학생 로그인
- 이름 + PIN 로그인 기존 방식 유지
- PIN 검증 기존 방식 유지
- 동명이인 처리 기존 방식 유지
- 응답 구조 유지
- 학생 개인정보 과다 노출 금지

### 학생 세션/홈
- 기존 학생 포털 홈 응답 유지
- 학생 본인 자료만 반환
- 다른 학생 자료 접근 금지

### 배정 자료 조회
- class_exam_assignments 또는 기존 배정 자료 조회 방식 유지
- 학생의 class_id / class_students / student_enrollments 관계 기존 방식 유지
- 제출 여부 상태 기존 방식 유지
- 제출 완료 자료는 제출 완료 상태로만 반환

### OMR 연결
- 미제출 OMR은 기존처럼 입력 연결 허용
- 제출 완료 OMR은 수정 불가 상태 유지
- 학생 포털에서 archive/exam 파일 직접 이동 금지
- 학생이 시험지를 직접 여는 URL을 응답에 추가하지 말 것

### 플래너 연결
- 기존 student_id + pin 전달 흐름 유지
- PLANNER_SID / PLANNER_PIN 저장 흐름에 필요한 응답을 깨지 않기
- 플래너 독립 로그인 구조 변경 금지

---

## 3. index.js 수정 기준

index.js에는 import 추가:

import { handleStudentPortal } from './routes/student-portal.js';

기존 API routing block에서 Not Found보다 앞에 아래 위임을 추가한다.

개념:

if (
  resource === 'student-portal' ||
  resource === 'student-portal-login' ||
  resource === 'student-portal-session' ||
  resource === 'student-portal-assignments' ||
  resource === 'student-portal-planner' ||
  resource === 'student-portal-omr'
) {
  const response = await handleStudentPortal(request, env, teacher, path, url);
  if (response) return response;
}

주의:
- 실제 resource 이름은 index.js 기준으로 맞춘다.
- 기존 분리 route 패턴과 맞춘다.
- Not Found보다 앞에 있어야 한다.
- initial-data 본체는 건드리지 않는다.
- check-init/check-pin/qr-classes보다 순서를 잘못 바꿔 기존 QR/OMR 진입을 깨지 않는다.

---

## 4. helper 처리

student-portal.js에서 필요한 함수:
- 학생 PIN 검증 helper
- 학생 접근 제한 helper
- json response helper
- headers helper
- makeId가 필요하면 기존 helper 재사용

현재 helpers/admin-db.js 또는 기존 helper에 필요한 함수가 있으면 재사용한다.

주의:
- verifyAuth는 학생 포털 로그인에는 쓰지 않을 수 있다.
- admin/teacher 인증 helper를 학생 로그인에 억지로 적용하지 않는다.
- 기존 학생 포털 인증 방식이 별도로 있으면 그대로 유지한다.
- helper 이동으로 index.js의 기존 레거시 API가 깨지면 실패다.
- 확실하지 않으면 기존 helper는 index.js에 남기고 route에서는 필요한 최소 helper만 가져간다.

---

## 5. 기존 코드 제거 기준

index.js에서 student-portal 관련 기존 블록은 route로 옮긴 뒤 제거하거나 위임 뒤 도달하지 않게 한다.

대상 블록 예시:
- if (resource === 'student-portal') { ... }
- if (resource === 'student-portal-login') { ... }
- if (resource === 'student-portal-session') { ... }
- if (resource === 'student-portal-assignments') { ... }
- if (resource === 'student-portal-omr') { ... }

주의:
- 기존 로직을 route 파일에 옮길 때 SQL, 응답 구조, status code를 바꾸지 않는다.
- route 파일로 옮긴 뒤 index.js에 중복으로 남아도 당장은 동작할 수 있으나 정리 효과가 떨어진다.
- 가능하면 중복 제거한다.
- 단, check-init/check-pin/qr-classes/homework-photo/report/archive/planner 관련 블록까지 같이 삭제하지 않는다.

---

## 6. 검증 명령

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/student-portal.js

기존 route 안전 확인:

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

학생 포털 프론트는 수정하지 말고 문법 확인만 가능하면 수행한다.

node --check apmath/student/index.html

만약 html이라 node --check가 불가능하면 생략하고 CODEX_RESULT.md에 “HTML 파일 수정 없음”으로 적는다.

변경 파일 확인:

git diff --name-only

정상 변경 파일:
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/student-portal.js
- 필요 시 apmath/worker-backup/worker/helpers/*.js
- CODEX_RESULT.md
- CODEX_TASK.md는 현재 지시 파일 갱신 때문에 포함될 수 있음

아래 파일이 변경되면 실패:
- apmath/student/index.html
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

배포 후 직접 확인할 항목은 아래와 같다.

### 7-1. 학생 포털 로그인 확인
실제 테스트 학생 이름/PIN이 필요하면 CODEX_RESULT.md에 “수동 확인 필요”로 적는다.

확인:
- 이름 + PIN 로그인 성공
- 잘못된 PIN 실패
- 학생 본인 데이터만 반환

### 7-2. 학생 배정 자료 확인
확인:
- 배정 자료 목록 정상
- 제출 완료 자료는 제출 완료 상태 표시
- 미제출 OMR만 입력 연결 가능

### 7-3. 제출 완료 OMR 수정 차단 확인
확인:
- 제출 완료 OMR 재입력 차단
- 수정하기/재입력 경로 없음
- 서버 응답도 기존 차단 유지

### 7-4. 시험지 직접 열기 금지 확인
확인:
- 학생 포털 응답에 archive/exam 직접 파일 URL 추가 없음
- 학생 포털 route에서 시험지 직접 열기 API 추가 없음

### 7-5. 기존 route 유지 확인

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

---

## 8. 배포 판단

CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:
- 모든 node --check 통과
- student-portal route 분리 완료
- 기존 학생 로그인 응답 구조 유지
- 기존 배정 자료 응답 구조 유지
- 제출 완료 OMR 수정 차단 유지
- 시험지 직접 열기 기능 없음
- 기존 routes 영향 없음
- UI 파일 변경 없음
- schema/migration 변경 없음

배포 보류:
- node --check 실패
- 학생 로그인 응답 구조 변경 가능성 있음
- 배정 자료 응답 구조 변경 가능성 있음
- 제출 완료 OMR 수정 가능성이 생김
- 학생 시험지 직접 열기 URL이 추가됨
- 기존 route 영향 있음
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
- student-portal route 추가
- 학생 로그인 계열 분리
- 학생 배정 자료 계열 분리
- 학생 포털 OMR 연결 계열 분리
- index.js route 위임 구조 반영
- 기존 students/classes/teachers route 영향 없음 확인
- 기존 attendance-homework route 영향 없음 확인
- 기존 exams route 영향 없음 확인
- 기존 operations/class-daily/foundation route 영향 없음 확인
- 기존 initial-data 구조 유지 확인
- 제출 완료 OMR 수정 차단 유지 확인
- 시험지 직접 열기 기능 추가 없음 확인
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
- 학생 포털 로그인 수동 확인
- 학생 배정 자료 수동 확인
- 제출 완료 OMR 수정 차단 수동 확인
- 기존 route smoke test
- 정상 확인 후 커밋/푸시
- 이후 homework-photo 또는 report/AI route 분리 여부 결정

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF