cd C:\Users\USER\Desktop\AP------

cat > CODEX_TASK.md <<'EOF'
EIE APMS 리베이스 Round 1.7.3 EIE Worker 배포 전 런타임 보정 지시서

작업 루트:
C:\Users\USER\Desktop\AP------

EIE Worker 루트:
C:\Users\USER\Desktop\wangji-eie-worker

상황:
Round 1.7.2에서 EIE 전용 최소 Worker 구조로 index.js를 보정했으나, 외부 검수에서 배포 직전 PASS가 아니라 조건부 FAIL 판정이 나왔다.

검수에서 확인된 문제:
1. routes/eie.js의 handleGet() 마지막이 return null이라 인증된 상태에서 미등록 GET 경로가 Response가 아니라 null을 반환할 수 있다.
2. EIE D1에 teacher_sessions / teachers 테이블이 실제 존재하는지 확인 결과가 없다.
3. 실제 SESSION_TOKEN으로 /api/eie/timetable, /api/eie/confirmed-students 200 확인이 아직 없다.

이번 작업의 목적:
배포 전 런타임 크래시 가능성을 제거하고, EIE Worker 인증 기반 테이블 확인 및 smoke test 준비 상태를 명확히 기록한다.
이번 작업에서도 실제 wrangler deploy는 하지 않는다.
D1 migration도 실행하지 않는다.
git add/commit/push도 하지 않는다.

절대 금지:
1. git add 금지.
2. git commit 금지.
3. git push 금지.
4. wrangler deploy 금지.
5. D1 migration 실행 금지.
6. APMS Worker 배포 금지.
7. AP------ 프론트 view 파일 수정 금지.
8. 학생관리 UI parity 구현 금지.
9. 클래스룸 UI parity 구현 금지.
10. 검수팩 zip 생성 금지.
11. 검수요청서 작성 금지.
12. 미등록 GET 경로에서 null 반환 방치 금지.

수정 허용 파일:
1. C:\Users\USER\Desktop\wangji-eie-worker\routes\eie.js
2. C:\Users\USER\Desktop\wangji-eie-worker\README.md
3. C:\Users\USER\Desktop\AP------\docs\EIE_WORKER_DEPLOY_SOP.md
4. C:\Users\USER\Desktop\AP------\docs\EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md
5. C:\Users\USER\Desktop\AP------\CODEX_RESULT.md

수정 금지 파일:
1. C:\Users\USER\Desktop\wangji-eie-worker\index.js
2. C:\Users\USER\Desktop\wangji-eie-worker\wrangler.jsonc
3. C:\Users\USER\Desktop\wangji-eie-worker\package.json
4. C:\Users\USER\Desktop\AP------\eie\js\views\*
5. C:\Users\USER\Desktop\AP------\eie\js\eie-api.js
6. C:\Users\USER\Desktop\AP------\eie\js\eie-state.js
7. C:\Users\USER\Desktop\AP------\eie\index.html
단, index.js나 wrangler 설정에서 치명 오류를 발견해도 이번 라운드에서는 수정하지 말고 CODEX_RESULT.md에 배포 보류 사유로 기록한다.

먼저 확인:
1. C:\Users\USER\Desktop\wangji-eie-worker 존재 확인.
2. routes/eie.js에서 handleGet() 함수를 찾는다.
3. handleGet() 마지막 return이 null인지 확인한다.
4. routes/eie.js에서 jsonResponse import가 정상인지 확인한다.
5. wrangler.jsonc가 wangji-eie-os / wangji-eie-os D1 기준인지 읽기만 확인한다.

보정 1: handleGet() 마지막 null 반환 제거
C:\Users\USER\Desktop\wangji-eie-worker\routes\eie.js에서 handleGet() 마지막의 다음 형태를 찾는다.

return null;

이 return null이 미등록 GET 경로 fallback이라면 반드시 아래처럼 바꾼다.

return jsonResponse({ success: false, error: 'not found' }, 404);

조건:
1. handleGet()의 모든 코드 경로가 Response를 반환해야 한다.
2. 인증 성공 후 미등록 GET /api/eie/unknown이 null을 반환하면 안 된다.
3. /api/eie 루트도 명확한 Response를 반환해야 한다.
4. 기존 정상 endpoint 로직은 변경하지 않는다.
5. POST/PATCH/DELETE 라우팅은 이번 라운드에서 건드리지 않는다.
6. 학생 CRUD 로직은 건드리지 않는다.

보정 2: mock runtime 확인
가능하면 node에서 간단한 import/runtime 확인을 실행한다.

cd C:\Users\USER\Desktop\wangji-eie-worker

node --check .\index.js
node --check .\routes\eie.js
node --check .\helpers\response.js

node --input-type=module -e "import('./index.js').then(()=>console.log('import index OK')).catch(e=>{console.error(e); process.exit(1);})"
node --input-type=module -e "import('./routes/eie.js').then(()=>console.log('import routes/eie OK')).catch(e=>{console.error(e); process.exit(1);})"

추가로 가능하면 최소 mock 테스트 파일 없이 one-liner로 /health 또는 /api/eie/unknown이 Response를 반환하는지 확인한다.
단, 인증이 필요한 handleEie 내부 구조 때문에 mock이 복잡하면 무리하지 말고, 정적 확인 결과만 CODEX_RESULT.md에 기록한다.
중요한 것은 routes/eie.js 안에 return null이 남아 있지 않은지 확인하는 것이다.

정적 검색:
cd C:\Users\USER\Desktop\wangji-eie-worker

Select-String -Path .\routes\eie.js -Pattern "return null|not found|handleGet|jsonResponse" -Context 4,4
Select-String -Path .\routes\eie.js -Pattern "handlePostStudent|handlePatchStudent|handlePatchStudentStatus|handleDeleteStudent|DELETE FROM eie_students|status.*archived" -Context 3,3
Select-String -Path .\index.js -Pattern "routes/enrollments|routes/class-time-slots|routes/timetable-conflicts|routes/students|routes/classes|routes/teachers|routes/attendance-homework|routes/exams|routes/auth|routes/backdoor|ap-math-os|ap-math-os-v2612" -Context 2,2
Select-String -Path .\wrangler.jsonc -Pattern "wangji-eie-os|ap-math-os|ap-math-os-v2612|database_name|database_id|binding" -Context 2,2

기대:
1. routes/eie.js에 return null이 남아 있으면 FAIL.
2. DELETE FROM eie_students가 나오면 FAIL.
3. index.js에서 APMS route import가 나오면 FAIL.
4. wrangler.jsonc에 ap-math-os 또는 ap-math-os-v2612가 나오면 FAIL.

확인 3: EIE D1 인증 테이블 확인
사용자 확인 없는 migration은 금지다.
읽기 전용 PRAGMA만 실행한다.

cd C:\Users\USER\Desktop\wangji-eie-worker

npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(teachers);"
npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(teacher_sessions);"

가능하면 아래 count도 실행한다.

npx wrangler d1 execute wangji-eie-os --remote --command "SELECT COUNT(*) AS count FROM teachers;"
npx wrangler d1 execute wangji-eie-os --remote --command "SELECT COUNT(*) AS count FROM teacher_sessions;"

권한 정책 또는 로그인 문제로 차단되면, 차단 사실을 CODEX_RESULT.md에 정확히 기록한다.
차단되면 배포 가능 최종 PASS가 아니라 “배포 전 사용자 직접 확인 필요”로 남긴다.

확인 4: 실제 SESSION_TOKEN 읽기 smoke 준비
실제 토큰이 없으면 실행하지 않는다.
로컬 환경변수 EIE_SESSION_TOKEN 또는 SESSION_TOKEN이 있으면 읽기 smoke를 실행한다.
없으면 실행하지 말고 “토큰 미제공으로 미실행”이라고 기록한다.

PowerShell:
$token = $env:EIE_SESSION_TOKEN
if (-not $token) { $token = $env:SESSION_TOKEN }

if ($token) {
  Invoke-RestMethod `
    -Uri "https://wangji-eie-os.js-pdf.workers.dev/api/eie/timetable" `
    -Headers @{ Authorization = "Bearer $token" } `
    -Method GET

  Invoke-RestMethod `
    -Uri "https://wangji-eie-os.js-pdf.workers.dev/api/eie/confirmed-students" `
    -Headers @{ Authorization = "Bearer $token" } `
    -Method GET
}

주의:
1. 이 smoke는 현재 배포된 Worker 기준이므로, 아직 새 코드가 배포되지 않았다면 기존 Worker 응답만 확인한다.
2. 200이면 인증/기본 읽기 경로는 살아있다고 기록한다.
3. 401이면 token 문제 또는 EIE D1 세션 문제로 기록한다.
4. 토큰이 없으면 미실행으로 기록한다.
5. 쓰기 smoke는 실행하지 않는다.

문서 업데이트:
C:\Users\USER\Desktop\AP------\docs\EIE_WORKER_DEPLOY_SOP.md에 다음을 추가/수정한다.
1. 배포 전 handleGet() 미등록 경로가 404 JSON Response를 반환해야 한다.
2. teacher_sessions / teachers PRAGMA 확인 필요.
3. token smoke test는 SESSION_TOKEN이 있을 때만 실행.
4. 쓰기 smoke는 배포 후 사용자 확인 후만 실행.
5. wrangler deploy 전 검증 목록에 dynamic import와 return null 검색을 추가.

C:\Users\USER\Desktop\AP------\docs\EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md에 Round 1.7.3 결과를 반영한다.

CODEX_RESULT.md 형식:
# CODEX_RESULT

Round 1.7.3 — EIE Worker 배포 전 런타임 보정

## 1. 생성/수정 파일
- 생성 파일
- 수정 파일

## 2. 보정 완료
- handleGet() null fallback 제거
- 미등록 GET 경로 404 JSON Response 보장
- routes/eie.js 학생 CRUD 유지 확인
- index.js EIE 최소 Worker 유지 확인
- wrangler EIE 설정 유지 확인
- 문서 업데이트

## 3. 실제 확인한 파일
- wangji-eie-worker/routes/eie.js
- wangji-eie-worker/index.js
- wangji-eie-worker/helpers/response.js
- wangji-eie-worker/wrangler.jsonc
- AP------ 문서 파일

## 4. 실행 결과
- node --check 결과
- dynamic import 결과
- return null 검색 결과
- APMS route import 검색 결과
- DELETE FROM 검색 결과
- wrangler 설정 검색 결과
- teachers PRAGMA 결과 또는 차단 사유
- teacher_sessions PRAGMA 결과 또는 차단 사유
- token smoke 결과 또는 미실행 사유

## 5. 배포 판정
- 배포 가능 / 배포 보류 / 사용자 확인 필요
- 이유
- 사용자 확인 후 실행할 명령

## 6. smoke test 계획
- 읽기 smoke
- 쓰기 smoke
- 테스트 row 이름
- 확인 SQL

## 7. 구현하지 않은 것
- 실제 wrangler deploy 미실행
- 실제 write smoke 미실행
- D1 migration 미실행
- 학생관리 UI parity 미구현
- git add/commit/push 없음

## 8. 남은 위험
- remote D1 schema 차이 가능성
- auth token 문제
- deploy 후 smoke 필요
- 연락처 별도 CRUD 부족

## 9. 다음 라운드
- 사용자 확인 후 EIE Worker deploy + smoke test
- 그 다음 Round 2: EIE 학생관리 APMS parity

배포 판정 기준:
배포 가능 후보가 되려면 다음을 모두 만족해야 한다.
1. return null fallback 제거 완료.
2. node --check 모두 OK.
3. dynamic import OK.
4. index.js APMS route import 없음.
5. wrangler 설정 EIE 기준.
6. DELETE FROM eie_students 없음.
7. wrangler deploy 미실행.
8. D1 migration 미실행.

teacher_sessions/teachers PRAGMA 또는 token smoke가 권한/토큰 문제로 미실행되면, 배포 가능 후보 대신 “사용자 확인 후 배포 가능 후보”로 표현한다.

작업 완료 전 자체 검수:
1. routes/eie.js에 return null이 남아 있지 않은지 확인한다.
2. index.js에 APMS route import가 없는지 확인한다.
3. DELETE FROM eie_students가 없는지 확인한다.
4. wrangler deploy를 실행하지 않았는지 확인한다.
5. D1 migration을 실행하지 않았는지 확인한다.
6. git add/commit/push를 하지 않았는지 확인한다.

마지막 지시:
작업 완료 후 바로 보고하지 말고, 먼저 자체 검수한다.
자체 검수에서 발견한 문제는 CODEX_RESULT.md 작성 전에 직접 보정하고 다시 검증한다.
검수팩 zip은 만들지 않는다.
git add, git commit, git push는 하지 않는다.

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.
EOF

