````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 작업명
AP Math OS / 왕지교육 Worker 최종 단계 — index.js 남은 legacy 블록 재평가 및 최종 정리

## 1. 작업 목표
현재까지 route 분리가 완료된 Worker에서 `apmath/worker-backup/worker/index.js`에 남아 있는 API 본문을 최종 재평가한다.

목표는 다음 4가지다.

1. `index.js`에 남은 API 블록을 전체 스캔한다.
2. 이미 route 파일로 분리된 기능의 legacy fallback 본문이 남아 있으면 제거한다.
3. 아직 분리하지 않는 것이 안전한 블록은 명확히 남긴다.
4. 최종적으로 `index.js`를 “공통 helper + route 위임 + 남겨야 하는 핵심 블록” 중심으로 정리한다.

## 2. 현재 완료된 route 분리 현황
아래 계열은 이미 route 파일로 분리된 상태다.

- foundation 계열
- students/classes/teachers 계열
- attendance/homework 계열
- exams 계열
- operations 계열
- class-daily 계열
- student-portal 계열
- reports-ai 계열
- check-omr 계열
- homework-photo 계열
- planner 계열

따라서 위 계열의 legacy API 본문이 `index.js`에 중복으로 남아 있으면 제거 대상이다.

## 3. 작업 대상 파일
프로젝트 루트 기준:

- `apmath/worker-backup/worker/index.js`
- 필요 시 `apmath/worker-backup/worker/CODEX_RESULT.md`
- 필요 시 현재 route 파일은 읽기만 한다.

## 4. 절대 금지
아래 항목은 절대 하지 않는다.

- UI 파일 수정 금지
- DB schema 수정 금지
- migration 추가 금지
- route 파일 동작 변경 금지
- route 파일 리팩터링 금지
- API 응답 구조 변경 금지
- 인증 정책 변경 금지
- 학생 포털 기능 변경 금지
- 플래너 기능 변경 금지
- OMR 기능 변경 금지
- 시험지를 학생이 직접 여는 기능 추가 금지
- OMR 수정/재제출/재입력 기능 추가 금지
- 관리자/원장 대시보드 기능 추가 금지
- 수납/출납 실제 운영 기능 추가 금지
- 새로운 기능 선행 구현 금지
- 추정으로 삭제 금지
- 확실히 route 위임된 legacy 본문이 아니면 삭제 금지
- git add . 금지

## 5. 먼저 해야 할 확인
작업 시작 전에 반드시 현재 `index.js`와 route 목록을 확인한다.

```powershell
cd "$env:USERPROFILE\Desktop\AP------"

Get-ChildItem apmath\worker-backup\worker\routes -Filter *.js | Select-Object Name
node --check apmath\worker-backup\worker\index.js
Get-Content apmath\worker-backup\worker\index.js | Measure-Object -Line
````

이후 `index.js`에서 아래 패턴을 검색한다.

```powershell
Select-String -Path apmath\worker-backup\worker\index.js -Pattern "resource ===|path\[|student_plans|planner_feedback|homework_photo|exam_sessions|class_daily|operation_memos|attendance-history|attendance-month|students|classes|teachers|check-pin|check-init|qr-classes|ai/report|billing-accounting|foundation"
```

## 6. index.js에 남겨도 되는 블록

아래는 마지막까지 `index.js`에 남겨도 된다.

### 6-1. 공통 상수 / 공통 helper

* headers
* sha256hex
* verifyAuth
* canAccessStudent
* canAccessClass
* isAdminUser
* isStaffUser
* isTeacherUser
* normalizeTeacherName
* normalizeTeacherAlias
* findTeacherByAlias
* repairTeacherClassMappings
* getTeacherClassIds
* canAccessStudentRecord
* generateStudentPin
* todayKstDateString
* normalizeTargetScore
* normalizeHighSubjects

단, 실제 route 파일에서 helper import 방식으로 이미 완전히 대체되어 있고 `index.js`에서 더 이상 필요 없는 helper는 삭제 후보로 표시만 한다.
이번 작업에서 helper 대량 삭제는 하지 않는다.

### 6-2. auth

아직 별도 분리하지 않았다면 남긴다.

* `/api/auth/login`
* `/api/auth/change-password`

### 6-3. initial-data

아직 분리하지 않는다.
`initial-data`는 크고 핵심이므로 이번 최종 정리에서는 유지한다.

* `/api/initial-data`

### 6-4. 루트/기본 응답

* OPTIONS
* Not Found
* try/catch
* 기본 Response
* route 위임부

## 7. 제거 대상 판정 기준

아래 기준을 모두 만족할 때만 삭제한다.

1. 같은 resource가 `index.js` 상단에서 route handler로 위임되어 있다.
2. 해당 route 파일 안에 실제 구현 본문이 존재한다.
3. `index.js` 안에 남은 본문이 동일 API의 legacy fallback이다.
4. 삭제해도 `node --check`가 통과한다.
5. 삭제 후 route 위임부가 먼저 실행되어 기존 API가 계속 처리된다.

## 8. route 위임부 최종 검수

`index.js` 안에 아래 route 위임부가 모두 존재하는지 확인한다.

예상 계열:

* `handleFoundationRoutes`
* `handleStudentsRoutes`
* `handleClassesRoutes`
* `handleTeachersRoutes`
* `handleAttendanceHomework`
* `handleExams`
* `handleOperations`
* `handleClassDaily`
* `handleStudentPortal`
* `handleReportsAi`
* `handleCheckOmr`
* `handleHomeworkPhoto`
* `handlePlanner`
* `handleBillingAccountingFoundation`
* 기타 현재 실제 route 파일에 대응하는 handler

이름은 실제 파일 기준으로 확인한다.

주의:

* 없는 handler 이름을 새로 만들지 않는다.
* route 파일 export 이름과 import 이름이 정확히 일치해야 한다.
* 위임부에서 스코프에 없는 `teacher` 변수를 넘기지 않는다.
* 필요한 경우 handler 내부에서 `verifyAuth(request, env)`를 호출하게 한다.
* `teacher is not defined` 재발 금지.

## 9. 중복 제거 우선순위

아래 순서로 제거한다.

### 9-1. 이미 분리 완료된 명확한 legacy 본문 제거

다음 resource 본문이 `index.js`에 남아 있으면 route 파일 존재 확인 후 제거한다.

* `students`
* `classes`
* `class-students`
* `teachers`
* `teacher-classes`
* `attendance-history`
* `attendance-month`
* `attendance-batch`
* `homework-batch`
* `attendance` PATCH
* `homework` PATCH
* `exam-blueprints`
* `class-exam-assignments`
* `exam-sessions`
* `bulk-omr`
* `wrong_answers`
* `consultations`
* `operation-memos`
* `exam-schedules`
* `academy-schedules`
* `school-exam-records`
* `daily-journals`
* `class-textbooks`
* `class-daily-records`
* `class-daily-progress`
* `student-portal`
* `check-pin`
* `check-init`
* `qr-classes`
* `homework-photo`
* `planner-auth-by-name`
* `planner-auth`
* `planner`
* `student_plans`
* `planner_feedback`
* `billing-accounting-foundation`
* `foundation-sync`
* `timetable-conflicts`
* `class-time-slots`
* `student-enrollments`
* 기타 route 파일에 이미 분리된 foundation 계열

### 9-2. 안전하지 않은 블록은 유지

다음은 route 대응 여부가 불명확하면 삭제하지 않는다.

* `initial-data`
* `auth`
* AI prompt/helper 공통부 중 route가 import해서 쓰지 않는 것
* 아직 route 파일이 없는 단독 API
* 주석만 보고 추정되는 블록
* 현재 smoke 대상이 아닌데 영향 범위가 큰 블록

## 10. 삭제 후 필수 검색

정리 후 아래 검색 결과를 확인한다.

```powershell
Select-String -Path apmath\worker-backup\worker\index.js -Pattern "student_plans|planner_feedback|homework_photo_assignments|homework_photo_submissions|resource === 'students'|resource === 'classes'|resource === 'attendance-history'|resource === 'exam-sessions'|resource === 'student-portal'|resource === 'planner-auth-by-name'|resource === 'planner-auth'|resource === 'planner'"
```

기대:

* route 위임 조건 외 legacy 본문이 없어야 한다.
* 단, 문자열이 helper, import, 위임부, comments에만 남는 것은 허용한다.
* `initial-data` 내부에서 필요한 테이블명 문자열은 허용한다.

## 11. 문법 검증

수정 후 반드시 실행한다.

```powershell
cd "$env:USERPROFILE\Desktop\AP------"

node --check apmath\worker-backup\worker\index.js
Get-ChildItem apmath\worker-backup\worker\routes -Filter *.js | ForEach-Object { node --check $_.FullName }
Get-ChildItem apmath\worker-backup\worker\helpers -Filter *.js | ForEach-Object { node --check $_.FullName }
```

## 12. 배포

문법 검증이 모두 PASS이면 배포한다.

```powershell
cd "$env:USERPROFILE\Desktop\AP------\apmath\worker-backup\worker"
npx wrangler deploy
```

## 13. smoke test

배포 후 아래를 확인한다.

기본 인증:

```powershell
$pair = "admin:admin1234"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($pair)
$basic = [Convert]::ToBase64String($bytes)
```

### 13-1. initial-data 생존 확인

```powershell
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/initial-data" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET
```

기대:

* 정상 JSON
* students/classes/attendance/homework/exam_sessions/journals/class_textbooks 등 기본 필드 유지

### 13-2. students route 확인

```powershell
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/students" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET
```

기대:

* Not Found 아님
* Unauthorized 아님
* 기존 students 응답 유지

### 13-3. qr-classes 확인

```powershell
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/qr-classes" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET
```

기대:

* Not Found 아님
* `teacher is not defined` 오류 없음
* class 목록 응답

### 13-4. homework-photo route 확인

```powershell
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/homework-photo/assignments?class_id=m1_a" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET
```

기대:

* Not Found 아님
* 권한 또는 데이터 기준 기존 응답 유지

### 13-5. planner route 확인

```powershell
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/planner-auth-by-name" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"","pin":""}'
```

기대:

* Not Found 아님
* 기존 검증 응답:
  `{"success":false,"message":"이름 또는 PIN을 확인하세요."}`

### 13-6. foundation-sync 확인

```powershell
Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/foundation-sync/preview" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET
```

기대:

* Not Found 아님
* 기존 preview 응답 유지

## 14. CODEX_RESULT.md 작성

작업 완료 후 `CODEX_RESULT.md`를 아래 형식으로 작성한다.

```md
# CODEX_RESULT

## 1. 생성/수정 파일
- apmath/worker-backup/worker/index.js
- CODEX_RESULT.md

## 2. 구현 완료 또는 확인 완료
- index.js 남은 legacy API 블록 전체 재평가 완료
- 이미 route 분리된 중복 legacy fallback 제거 완료
- auth / initial-data / 공통 helper 유지 확인
- route 위임부 최종 확인 완료
- teacher 스코프 위험 없음 확인
- UI/schema/migration 변경 없음

## 3. 실행 결과
- index.js 수정 전 라인 수:
- index.js 수정 후 라인 수:
- node --check apmath/worker-backup/worker/index.js:
- routes/*.js node --check:
- helpers/*.js node --check:
- 배포 결과:
- smoke initial-data:
- smoke students:
- smoke qr-classes:
- smoke homework-photo:
- smoke planner-auth-by-name:
- smoke foundation-sync:

## 4. 결과 요약
- index.js에서 route 분리 완료된 legacy fallback을 최종 정리했다.
- index.js는 공통 helper, route 위임부, auth, initial-data 중심으로 축소했다.
- 기존 route API 동작과 응답 구조는 변경하지 않았다.

## 5. 다음 조치
- auth route 분리 여부 판단
- initial-data route 분리 여부는 마지막 단계에서 별도 판단
- 숙제 배정 삭제 버튼 등 실제 기능 추가는 별도 작업으로 진행
```

## 15. git 주의

절대 `git add .` 하지 않는다.

커밋 전 상태 확인:

```powershell
cd "$env:USERPROFILE\Desktop\AP------"
git status --short
git diff --name-only
```

이번 커밋 대상은 원칙적으로 아래만 허용한다.

```powershell
git add apmath\worker-backup\worker\index.js CODEX_RESULT.md
git commit -m "Finalize worker index route cleanup"
git push
```

만약 다른 route 파일을 수정했다면 그 이유를 CODEX_RESULT.md에 명확히 쓰고, 실제 필요한 파일만 add한다.

## 16. 최종 자체검수

완료 전 반드시 확인한다.

* index.js에 이미 route 분리된 API 본문이 중복으로 남아 있지 않은가?
* route 위임부가 모든 분리 route를 정상 호출하는가?
* route handler export/import 이름이 정확한가?
* teacher undefined 위험이 없는가?
* auth는 그대로 살아 있는가?
* initial-data는 그대로 살아 있는가?
* student-portal / planner SSO 흐름이 바뀌지 않았는가?
* OMR 수정/재제출 경로가 생기지 않았는가?
* 숙제 사진 제출/취소/마감 흐름이 바뀌지 않았는가?
* 새 기능이 몰래 추가되지 않았는가?
* node --check가 모두 PASS인가?
* smoke가 Not Found 없이 route 진입하는가?
* CODEX_RESULT.md가 지정 형식으로 작성되었는가?

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
