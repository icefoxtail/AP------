cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
긴급 수정 2 — qr-classes teacher is not defined 실제 코드 수정

## 상황
배포 후에도 아래 오류가 계속 발생했다.

GET /api/qr-classes
{"error":"teacher is not defined"}

직전 보고서는 “이미 복구된 상태”라고 했지만 실제 배포 후에도 동일 오류가 발생했으므로 검수 실패다.

이번에는 확인 보고만 하지 말고 반드시 실제 원인을 찾아 코드 수정한다.

## 목표
GET /api/qr-classes가 더 이상 `teacher is not defined` 오류를 내지 않고 기존처럼 정상 응답하게 만든다.

## 절대 금지
- 확인만 하고 종료 금지
- CODEX_RESULT.md만 수정하고 종료 금지
- UI 파일 수정 금지
- schema.sql 수정 금지
- migrations 수정 금지
- 학생 시험지 직접 열기 URL 추가 금지
- 제출 완료 OMR 수정 경로 추가 금지
- index.js 전체 재작성 금지
- check-init/check-pin 응답 구조 변경 금지

## 수정 대상
우선 아래 파일만 확인/수정한다.

- apmath/worker-backup/worker/routes/check-omr.js
- 필요 시 apmath/worker-backup/worker/index.js

## 필수 원인 추적

아래 명령으로 `teacher` 직접 참조를 전부 찾는다.

rg -n "\bteacher\b" apmath/worker-backup/worker/routes/check-omr.js apmath/worker-backup/worker/index.js

특히 routes/check-omr.js 안에서 아래 패턴을 찾는다.

- 함수 인자로 받지 않은 상태에서 teacher 참조
- handleQrClasses 내부의 bare teacher 참조
- SQL bind 또는 canAccessClass/canAccessStudent 호출에 teacher 직접 사용
- catch/error 처리 안에서 teacher 직접 참조
- currentTeacher를 만든 뒤에도 아래쪽에서 teacher를 다시 참조
- destructuring이나 object 생성 중 teacher 변수를 직접 넣는 부분

## 수정 원칙

### 1. handleCheckOmr 시그니처

아래 형태를 유지한다.

export async function handleCheckOmr(request, env, teacher, path, url) {
  ...
}

### 2. qr-classes 분기

qr-classes 분기는 반드시 teacher를 명시적으로 넘긴다.

if (resource === 'qr-classes') {
  return handleQrClasses(request, env, teacher, url);
}

### 3. handleQrClasses 내부

함수 시그니처는 아래처럼 한다.

async function handleQrClasses(request, env, teacher, url) {
  const currentTeacher = teacher || await verifyAuth(request, env);

  ...
}

그리고 handleQrClasses 내부에서는 `teacher`를 직접 쓰지 말고 전부 `currentTeacher`를 사용한다.

예:
- teacher.role 금지
- teacher.name 금지
- teacher.id 금지
- teacher.teacher_name 금지

전부 아래처럼 수정:
- currentTeacher.role
- currentTeacher.name
- currentTeacher.id
- currentTeacher.teacher_name

### 4. 내부 helper 함수

만약 handleQrClasses 안에서 다른 helper를 호출하고 그 helper가 teacher를 쓴다면, 반드시 인자로 넘긴다.

잘못된 예:
async function listQrClasses(env) {
  if (teacher.role === 'admin') ...
}

올바른 예:
async function listQrClasses(env, currentTeacher) {
  if (currentTeacher.role === 'admin') ...
}

호출:
return listQrClasses(env, currentTeacher);

### 5. teacher라는 변수명을 아예 제거해도 됨

가장 안전한 방식은 handleQrClasses 내부 맨 위에서 별도 이름으로 통일하는 것이다.

async function handleQrClasses(request, env, authUser, url) {
  const currentTeacher = authUser || await verifyAuth(request, env);
  ...
}

이 경우 내부에서 `teacher`라는 이름은 절대 쓰지 않는다.

## 추가 방어

routes/check-omr.js 안에서 `teacher` 직접 참조가 반드시 필요한 곳이 아니면 모두 `currentTeacher` 또는 `authUser`로 바꾼다.

수정 후 아래 검색 결과를 CODEX_RESULT.md에 기록한다.

rg -n "\bteacher\b" apmath/worker-backup/worker/routes/check-omr.js

이 결과에서 허용되는 것은 아래뿐이다.

- export function 인자명
- handleQrClasses 인자명
- 주석이 아닌 실제 안전한 인자 전달부

handleQrClasses 내부 로직에서 bare `teacher.role`, `teacher.name`, `teacher.id`가 남아 있으면 실패다.

## 검증

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/check-omr.js

기존 route도 최소 확인한다.

node --check apmath/worker-backup/worker/routes/reports-ai.js
node --check apmath/worker-backup/worker/routes/student-portal.js
node --check apmath/worker-backup/worker/routes/exams.js
node --check apmath/worker-backup/worker/routes/attendance-homework.js

## 배포 후 확인 명령

배포 후 아래가 반드시 정상이어야 한다.

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/qr-classes" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

기존 route 확인:

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/students" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/initial-data" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method GET

## 완료 보고

CODEX_RESULT.md를 새로 작성한다.
이전처럼 같은 내용을 두 번 반복하지 않는다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
- 파일 목록

## 2. 구현 완료 또는 확인 완료
- teacher undefined 실제 원인
- 실제 수정한 위치
- handleQrClasses 내부 bare teacher 참조 제거 여부
- qr-classes 응답 구조 유지
- check-init/check-pin 영향 없음
- 시험지 직접 열기 URL 추가 없음
- 제출 완료 OMR 수정 경로 추가 없음
- UI/schema/migration 변경 없음

## 3. 실행 결과
- node --check 결과
- rg teacher 검색 결과 요약
- git diff --name-only 결과

## 4. 결과 요약
- 장애 원인
- 수정 방식
- 배포 가능 여부

## 5. 다음 조치
- Worker 배포
- qr-classes smoke test
- 기존 route smoke test
- 정상 확인 후 커밋/푸시

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF