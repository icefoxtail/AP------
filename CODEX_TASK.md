cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
Worker route/helper 분리 8단계 — report / AI 계열 API 분리

## 목표
Worker index.js 비대화 정리 작업을 계속한다.

이번 8단계에서는 리포트/AI 분석 계열 API만 route 파일로 분리한다.

이번 작업은 기능 추가가 아니다.

목표:
- index.js 비대화 완화
- report / AI 관련 API를 route 파일로 이동
- 기존 리포트 생성/조회/AI 분석 흐름 유지
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
- apmath/js/report.js 수정 금지
- apmath/js/dashboard.js 수정 금지
- apmath/js/timetable.js 수정 금지
- apmath/js/student.js 수정 금지
- apmath/js/management.js 수정 금지
- apmath/js/core.js 수정 금지
- apmath/student/index.html 수정 금지
- 기존 분리 route 수정 금지
- foundation routes 수정 금지
- billing-accounting-foundation 수정 금지
- homework-photo API 분리 금지
- student-portal API 수정 금지
- archive API 분리 금지
- planner API 분리 금지
- QR/OMR/check 관련 API 수정 금지
- 수납·출납 foundation 추가 금지
- Gemini/OpenAI 프롬프트 정책 변경 금지
- API key 저장 방식 변경 금지
- AI 분석 결과 형식 변경 금지

## 허용 범위
- report / AI route 파일 추가
- 기존 index.js의 report / AI 관련 API 처리 로직을 route 파일로 이동
- index.js에서 새 route로 위임하도록 최소 수정
- 필요한 공통 helper 추가 또는 기존 helper 재사용
- CODEX_RESULT.md 작성

---

## 1. 이번 분리 대상

이번 작업에서 분리할 대상은 리포트/AI 분석 계열 API만이다.

분리 대상 후보 API:
- /api/report-ai-proxy
- /api/reports
- /api/report
- /api/report-history
- /api/student-report
- /api/class-report
- /api/ai-analysis
- /api/premium-analysis
- index.js 안에서 report / AI / analysis 관련으로 묶인 모든 API

현재 index.js에서 실제 resource 이름이 다르면 실제 코드 기준으로 동일 기능만 분리한다.

권장 route 파일:
- apmath/worker-backup/worker/routes/reports-ai.js

담당 기능:
- 학부모용/학생용/상담/내부 공유 리포트 관련 API
- AI 분석 proxy
- premium analysis 관련 API
- 리포트 저장/조회 API가 있다면 기존 방식 그대로 분리
- 기존 report.js가 호출하는 endpoint 유지

## 1-1. 이번에 분리하지 않을 것

아래는 이번 작업에서 절대 분리하지 않는다.

- /api/homework-photo
- /api/student-portal
- /api/check-init
- /api/check-pin
- /api/qr-classes
- archive 관련 API
- planner 관련 API
- QR/OMR/check 관련 API
- 수납·출납 foundation API
- class-daily API
- attendance/homework API
- exam-sessions API

주의:
- report/AI route는 리포트/AI 관련 API만 담당한다.
- 시험/OMR 데이터 조회가 필요하더라도 exams route를 수정하지 않는다.
- 필요한 데이터 조회 SQL은 기존 index.js에서 report/AI 블록이 쓰던 방식 그대로 옮긴다.

---

## 2. route 파일 책임

## 2-1. routes/reports-ai.js

export 함수명 권장:

export async function handleReportsAi(request, env, teacher, path, url) { ... }

또는 현재 route 스타일에 맞춘다.

담당 resource:
- report-ai-proxy
- reports
- report
- report-history
- student-report
- class-report
- ai-analysis
- premium-analysis
- 실제 index.js에서 report/AI 관련으로 처리하던 resource들

반드시 유지할 기존 동작:

### AI proxy
- 기존 요청 body 구조 유지
- 기존 응답 구조 유지
- 기존 API key 처리 방식 유지
- 기존 모델/엔드포인트/프롬프트 구성 변경 금지
- 실패 시 기존 status code와 error 구조 유지
- timeout/retry 정책이 있으면 기존 방식 유지

### report 저장/조회
- teacher 인증 필요 여부 기존 방식 유지
- admin/teacher 접근 범위 기존 방식 유지
- canAccessStudent / canAccessClass 검사 기존 방식 유지
- 학생별/반별 리포트 조회 조건 유지
- 응답 구조 유지

### premium analysis
- 기존 premium analysis endpoint가 있으면 그대로 유지
- 프론트가 기대하는 필드명 변경 금지
- report.js에서 사용하는 데이터 구조 변경 금지

### 데이터 소스
- students
- classes
- attendance
- homework
- exam_sessions
- wrong_answers
- consultations
- school_exam_records
- class_daily_records
- class_daily_progress
- 기존 report/AI 블록이 사용하던 데이터만 그대로 사용

---

## 3. index.js 수정 기준

index.js에는 import 추가:

import { handleReportsAi } from './routes/reports-ai.js';

기존 API routing block에서 Not Found보다 앞에 아래 위임을 추가한다.

개념:

if (
  resource === 'report-ai-proxy' ||
  resource === 'reports' ||
  resource === 'report' ||
  resource === 'report-history' ||
  resource === 'student-report' ||
  resource === 'class-report' ||
  resource === 'ai-analysis' ||
  resource === 'premium-analysis'
) {
  const response = await handleReportsAi(request, env, teacher, path, url);
  if (response) return response;
}

주의:
- 실제 resource 이름은 index.js 기준으로 맞춘다.
- 존재하지 않는 resource를 억지로 만들지 않는다.
- 기존 분리 route 패턴과 맞춘다.
- Not Found보다 앞에 있어야 한다.
- initial-data 본체는 건드리지 않는다.
- 기존 report/AI 블록 외의 API를 같이 옮기지 않는다.

---

## 4. helper 처리

reports-ai.js에서 필요한 함수:
- verifyAuth
- isAdminUser
- canAccessStudent
- canAccessClass
- headers 또는 json response helper
- normalizeText가 필요하면 기존 방식 유지
- makeId가 필요하면 기존 helper 재사용 또는 route 내부 최소 구현

현재 helpers/admin-db.js 또는 기존 helper에 필요한 함수가 있으면 재사용한다.

주의:
- verifyAuth, canAccessStudent, canAccessClass는 index.js의 기존 레거시 API도 계속 사용한다.
- helper 이동으로 index.js가 깨지면 실패다.
- 확실하지 않으면 기존 helper는 index.js에 남기고 route에서는 필요한 최소 helper만 가져간다.
- 중복 제거보다 안전한 동작 유지가 우선이다.

---

## 5. 기존 코드 제거 기준

index.js에서 report/AI 관련 기존 블록은 route로 옮긴 뒤 제거하거나 위임 뒤 도달하지 않게 한다.

대상 블록 예시:
- if (resource === 'report-ai-proxy') { ... }
- if (resource === 'reports') { ... }
- if (resource === 'report') { ... }
- if (resource === 'student-report') { ... }
- if (resource === 'class-report') { ... }
- if (resource === 'ai-analysis') { ... }
- if (resource === 'premium-analysis') { ... }

주의:
- 기존 로직을 route 파일에 옮길 때 SQL, 응답 구조, status code를 바꾸지 않는다.
- route 파일로 옮긴 뒤 index.js에 중복으로 남아도 당장은 동작할 수 있으나 정리 효과가 떨어진다.
- 가능하면 중복 제거한다.
- 단, exam/check/QR/OMR/homework-photo/student-portal/archive/planner 관련 블록까지 같이 삭제하지 않는다.

---

## 6. 검증 명령

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/reports-ai.js

기존 route 안전 확인:

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

변경 파일 확인:

git diff --name-only

정상 변경 파일:
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/reports-ai.js
- 필요 시 apmath/worker-backup/worker/helpers/*.js
- CODEX_RESULT.md
- CODEX_TASK.md는 현재 지시 파일 갱신 때문에 포함될 수 있음

아래 파일이 변경되면 실패:
- apmath/js/report.js
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

### 7-1. report-ai-proxy 확인
실제 AI 호출은 비용/키 이슈가 있을 수 있으므로, 기존 테스트 방식이 있으면 그 방식만 따른다.

확인:
- endpoint 404 아님
- 기존 잘못된 요청에 대한 error 구조 유지
- API key 없을 때 기존 error 유지
- 실제 AI 호출은 필요 시 수동 확인

### 7-2. 리포트 UI 수동 확인
확인:
- 리포트 화면 진입
- 학부모용/학생용/상담/내부 공유 텍스트 생성 흐름 유지
- 프리미엄 분석 버튼 흐름 유지
- 기존 리포트 출력/PDF 흐름 영향 없음

### 7-3. 기존 route 유지 확인

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
- reports-ai route 분리 완료
- 기존 report-ai-proxy 응답 구조 유지
- 기존 리포트/AI 관련 endpoint 유지
- 기존 report.js 호출 구조 영향 없음
- 기존 routes 영향 없음
- UI 파일 변경 없음
- schema/migration 변경 없음

배포 보류:
- node --check 실패
- report-ai-proxy 응답 구조 변경 가능성 있음
- 프리미엄 분석/AI 분석 흐름 변경 가능성 있음
- report.js 영향 가능성 있음
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
- reports-ai route 추가
- report-ai-proxy 분리
- report/AI 계열 API 분리
- index.js route 위임 구조 반영
- 기존 students/classes/teachers route 영향 없음 확인
- 기존 attendance-homework route 영향 없음 확인
- 기존 exams route 영향 없음 확인
- 기존 operations/class-daily/student-portal/foundation route 영향 없음 확인
- 기존 initial-data 구조 유지 확인
- 기존 report.js 호출 구조 영향 없음 확인
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
- report-ai-proxy smoke test
- 리포트 UI 수동 확인
- 기존 route smoke test
- 정상 확인 후 커밋/푸시
- 이후 homework-photo 또는 check/QR/OMR route 분리 여부 결정

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF