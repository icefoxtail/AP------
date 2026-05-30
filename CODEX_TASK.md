cd C:\Users\USER\Desktop\AP------

cat > CODEX_TASK.md <<'EOF'
EIE APMS 리베이스 Round 1.6 Worker 배포 준비/검증 지시서

작업 루트:
C:\Users\USER\Desktop\AP------

이번 작업의 목적:
Round 1.5에서 구현한 EIE 학생 CRUD Worker endpoint가 실제 EIE Worker/D1 환경에 안전하게 배포 가능한지 확인하고, 배포 전 검증 자료와 실행 명령을 정리한다.

이번 라운드는 “배포 준비 + 원격 D1 schema 확인 + 로컬/원격 API smoke test 준비”가 목적이다.
실제 wrangler deploy 실행 여부는 사용자 확인 후 진행한다.
Codex가 임의로 deploy하지 않는다.

핵심 배경:
EIE 프론트는 EIE 전용 Worker를 사용해야 한다.
현재 EIE 프론트의 PROD_WORKER_ORIGIN은 다음이어야 한다.

https://wangji-eie-os.js-pdf.workers.dev

EIE D1 이름은 다음 기준으로 확인한다.

wangji-eie-os

절대 금지:
1. git add 금지.
2. git commit 금지.
3. git push 금지.
4. 사용자 확인 없는 wrangler deploy 금지.
5. 사용자 확인 없는 D1 migration 실행 금지.
6. APMS production Worker를 실수로 배포 금지.
7. EIE Worker와 APMS Worker를 혼동 금지.
8. EIE frontend view 파일 수정 금지.
9. 학생관리 UI parity 구현 금지.
10. 클래스룸 UI parity 구현 금지.
11. 검수요청서 작성 금지. 검수요청서는 ChatGPT가 별도로 작성한다.

이번 라운드 수정 허용 파일:
1. CODEX_RESULT.md
2. docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md
3. docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
4. 필요한 경우 docs/EIE_WORKER_DEPLOY_SOP.md 신규 생성 가능
5. 필요한 경우 reports/eie_round1_6_worker_deploy_check_20260530.md 신규 생성 가능

이번 라운드에서 수정하지 말아야 할 파일:
1. eie/js/views/eie-students.js
2. eie/js/views/eie-classroom.js
3. eie/js/views/eie-timetable.js
4. eie/js/views/eie-timetable-v2.js
5. eie/js/views/eie-dashboard.js
6. eie/index.html
7. eie/css/eie.css
8. eie/js/eie-api.js
9. eie/js/apms-compat/eie-apms-api.js
10. eie/js/eie-state.js
11. apmath/worker-backup/worker/routes/eie.js
단, Round 1.5 구현에서 명백한 문법/라우팅 오류를 발견하면 수정하지 말고 CODEX_RESULT.md에 “배포 전 보정 필요”로 기록한다.

먼저 할 일:
1. C:\Users\USER\Desktop\AP------에서 git status --short --untracked-files=all 확인.
2. Round 1.5 커밋이 완료되었는지 git log --oneline -5로 확인.
3. apmath/worker-backup/worker/routes/eie.js에 Round 1.5 학생 CRUD endpoint가 실제로 들어있는지 확인.
4. eie/js/eie-api.js, eie/js/apms-compat/eie-apms-api.js에 deleteStudent 및 학생 쓰기 매핑이 반영되어 있는지 확인.
5. C:\Users\USER\Desktop\wangji-eie-worker 폴더가 있는지 확인.
6. C:\Users\USER\Desktop\wangji-eie-worker가 존재하면, 그 폴더가 실제 EIE Worker 소스인지 확인한다.
7. C:\Users\USER\Desktop\wangji-eie-worker가 없으면, AP------ 내부 worker-backup만으로 실제 배포 가능한지 확인하고, 불확실하면 배포 중단으로 판정한다.

EIE Worker 소스 확인 기준:
다음 중 하나 이상을 만족해야 EIE Worker 소스 후보로 본다.

1. wrangler.toml 또는 wrangler.json에 name = "wangji-eie-os" 또는 유사 이름이 있음.
2. D1 binding이 wangji-eie-os를 가리킴.
3. routes/eie.js 또는 EIE endpoint 구현이 있음.
4. package.json 또는 src/index.js/index.js가 Cloudflare Worker entry임.
5. wrangler whoami / wrangler d1 list 기준 EIE D1과 연결 가능.

절대 APMS Worker를 EIE Worker로 간주하지 않는다.
AP------의 apmath/worker-backup/worker는 현재 기준 구현/백업 소스일 수 있지만, 실제 EIE Worker 배포 소스인지 반드시 별도 확인한다.

검증 1: 로컬 파일 정적 검증
다음 명령을 실행한다.

cd C:\Users\USER\Desktop\AP------

node --check .\apmath\worker-backup\worker\routes\eie.js
node --check .\apmath\worker-backup\worker\index.js
node --check .\eie\js\eie-api.js
node --check .\eie\js\apms-compat\eie-apms-api.js
node --check .\eie\js\eie-state.js
node --check .\eie\js\apms-compat\eie-apms-state.js
node --check .\eie\js\apms-compat\eie-apms-ui-bridge.js

정적 검색:
Select-String -Path .\apmath\worker-backup\worker\routes\eie.js -Pattern "handlePostStudent|handlePatchStudent|handlePatchStudentStatus|handleDeleteStudent|DELETE.*students|PATCH.*students|POST.*students|eie_students|eie_student_contacts"
Select-String -Path .\eie\js\eie-api.js -Pattern "createStudent|updateStudent|updateStudentStatus|deleteStudent"
Select-String -Path .\eie\js\apms-compat\eie-apms-api.js -Pattern "createStudent|updateStudent|updateStudentStatus|deleteStudent|EIE_NOT_IMPLEMENTED"

검증 2: 원격 D1 schema 확인
사용자 확인 없이 migration은 실행하지 않는다.
단, 읽기 전용 PRAGMA/SELECT COUNT는 실행 가능하다.

다음 명령을 실행해서 결과 파일로 저장한다.

cd C:\Users\USER\Desktop\AP------

$reportDir = "$env:TEMP\AP_REVIEW_WORK\eie_round1_6_worker_deploy_check_20260530"
Remove-Item -Recurse -Force $reportDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $reportDir | Out-Null

npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(eie_students);" *> "$reportDir\remote_pragma_eie_students.txt"
npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(eie_student_contacts);" *> "$reportDir\remote_pragma_eie_student_contacts.txt"
npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(eie_student_schedule_assignments);" *> "$reportDir\remote_pragma_eie_student_schedule_assignments.txt"

npx wrangler d1 execute wangji-eie-os --remote --command "SELECT COUNT(*) AS count FROM eie_students;" *> "$reportDir\remote_count_eie_students.txt"
npx wrangler d1 execute wangji-eie-os --remote --command "SELECT COUNT(*) AS count FROM eie_student_contacts;" *> "$reportDir\remote_count_eie_student_contacts.txt"
npx wrangler d1 execute wangji-eie-os --remote --command "SELECT COUNT(*) AS count FROM eie_student_schedule_assignments;" *> "$reportDir\remote_count_eie_student_schedule_assignments.txt"

확인해야 할 remote schema 필수 컬럼:
eie_students:
- id
- display_name
- normalized_name
- grade
- status
- memo
- raw_meta_json
- created_at
- updated_at

eie_student_contacts:
- id
- student_id
- phone
- normalized_phone
- contact_label
- is_primary
- memo
- raw_meta_json
- created_at
- updated_at

eie_student_schedule_assignments:
- id
- student_id
- timetable_cell_id
- status

remote D1 schema가 로컬 migration과 다르면 배포 중단으로 판정하고 CODEX_RESULT.md에 기록한다.

검증 3: EIE Worker 소스 동기화 확인
C:\Users\USER\Desktop\wangji-eie-worker가 있으면 다음을 수행한다.

1. wrangler.toml 확인.
2. package.json 확인.
3. Worker entry 파일 확인.
4. routes/eie.js가 있다면 AP------의 apmath/worker-backup/worker/routes/eie.js와 학생 CRUD 부분이 같은지 비교한다.
5. routes/eie.js가 없다면 EIE endpoint가 어디에 있는지 찾아 기록한다.
6. AP------에서 구현한 Round 1.5 학생 CRUD가 실제 EIE Worker 소스에 반영되어 있지 않다면, deploy 전 “소스 반영 필요”로 판정한다.
7. 이번 라운드에서 자동 복사/수정은 하지 않는다. 실제 배포 소스 반영은 사용자 확인 후 별도 지시에서 수행한다.

PowerShell 예시:
if (Test-Path "C:\Users\USER\Desktop\wangji-eie-worker") {
  cd C:\Users\USER\Desktop\wangji-eie-worker
  Get-ChildItem -Recurse -File | Where-Object { $_.Name -match "wrangler|package|index|eie|route" } | Select-Object FullName > "$reportDir\eie_worker_file_list.txt"
  if (Test-Path ".\wrangler.toml") { Get-Content ".\wrangler.toml" > "$reportDir\eie_worker_wrangler_toml.txt" }
  if (Test-Path ".\package.json") { Get-Content ".\package.json" > "$reportDir\eie_worker_package_json.txt" }
  Select-String -Path ".\**\*.js" -Pattern "handlePostStudent|handlePatchStudent|handleDeleteStudent|/api/eie|eie_students|confirmed-students" -Context 3,3 > "$reportDir\eie_worker_student_crud_search.txt" -ErrorAction SilentlyContinue
}

검증 4: 배포 명령은 준비만 하고 실행하지 않기
CODEX_RESULT.md에 다음 두 가지 경우를 나누어 기록한다.

A. EIE Worker 소스에 학생 CRUD가 이미 반영되어 있고 wrangler.toml도 EIE Worker로 확인됨
- 배포 가능 후보
- 사용자 확인 후 실행할 명령을 제시

B. EIE Worker 소스에 학생 CRUD가 반영되어 있지 않거나 실제 배포 소스가 불확실함
- 배포 금지
- 먼저 EIE Worker 소스 반영 패치가 필요함

배포 가능 후보일 때만 CODEX_RESULT.md에 명령을 기록한다.
단, 실행하지 않는다.

배포 명령 예시:
cd C:\Users\USER\Desktop\wangji-eie-worker
node --check .\index.js
npx wrangler deploy

또는 실제 entry/command가 다르면 wrangler.toml/package.json 기준으로 정확히 기록한다.

검증 5: API smoke test 명령 준비
실제 deploy 이후 실행할 smoke test 명령을 CODEX_RESULT.md에 준비한다.
이번 라운드에서는 deploy 전이라 실행하지 않는다.

Smoke test는 destructive하지 않게 작성한다.
학생 생성 테스트는 실제 DB에 row를 만들 수 있으므로 사용자 확인 후 별도 실행한다.
먼저 읽기 테스트만 제안한다.

읽기 smoke:
- GET /api/eie/confirmed-students
- GET /api/eie/timetable

쓰기 smoke는 deploy 후 별도 확인 시만:
1. POST /api/eie/students 테스트 row 생성
2. PATCH /api/eie/students/{id} 수정
3. PATCH /api/eie/students/{id}/status 상태 변경
4. DELETE /api/eie/students/{id} soft delete
5. D1에서 해당 id status archived 확인

쓰기 smoke test에는 테스트 학생 이름을 명확히 사용한다.
예: "__EIE_CRUD_SMOKE_TEST_20260530__"
테스트 row 삭제는 물리 삭제 금지. archived 상태 확인까지만 한다.

문서 업데이트:
docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md에 Round 1.6 결과를 추가한다.
다음 내용을 반드시 포함한다.

1. Round 1.5 학생 CRUD는 코드 기준 구현됨.
2. Round 1.6에서 실제 EIE Worker 배포 소스 확인이 필요함.
3. remote D1 schema 확인 결과.
4. 배포 가능 여부.
5. 배포 전 조건.
6. 배포 후 smoke test 항목.
7. Round 2 학생관리 parity 진입 조건.

docs/EIE_APMS_STATE_API_COMPAT_SPEC.md에 다음 내용을 추가한다.

1. students write API가 EieApmsApi에서 실제 구현 API로 연결되어 있음.
2. 단, 실제 Worker 배포 전에는 브라우저 저장 테스트 불가.
3. remote D1 schema와 Worker source가 일치해야 함.
4. contact 별도 CRUD는 아직 미구현.
5. consultations/attendance/homework/class-daily-records는 계속 EIE_NOT_IMPLEMENTED.

필요시 신규 문서 생성:
docs/EIE_WORKER_DEPLOY_SOP.md
이 문서는 EIE Worker 배포 루트, 확인 명령, 배포 명령, smoke test 절차를 짧게 정리한다.
생성 여부는 실제 EIE Worker 루트가 확인될 때만 한다.

CODEX_RESULT.md 형식:
# CODEX_RESULT

## 1. 생성/수정 파일
- 생성 파일
- 수정 파일

## 2. 확인 완료
- Round 1.5 학생 CRUD 코드 확인
- remote D1 schema 확인
- EIE Worker 소스 루트 확인
- 배포 가능 여부 판정
- smoke test 명령 준비

## 3. 실제 확인한 핵심 파일
- AP------ Worker 파일
- EIE Worker 파일
- EIE API/Compat 파일
- 문서 파일

## 4. 실행 결과
- node --check 결과
- remote D1 PRAGMA 결과 요약
- remote D1 count 결과 요약
- EIE Worker source search 결과
- git diff --name-only
- git status --short

## 5. 배포 판정
- 배포 가능 / 배포 보류
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
- DB migration 미실행
- 학생관리 UI parity 미구현
- git add/commit/push 없음

## 8. 남은 위험
- remote Worker 소스 불일치
- remote D1 schema 차이
- auth token 문제
- contact CRUD 부족
- APMS student.js 복사 시 추가 bridge 필요 가능성

## 9. 다음 라운드
- 배포 가능이면 사용자 확인 후 EIE Worker deploy + smoke test
- 배포 보류면 EIE Worker 소스 반영 패치
- 그 다음 Round 2: EIE 학생관리 APMS parity

## 10. review pack 경로
- 생성한 zip 경로

review pack 생성:
- 프로젝트 전체 압축 금지.
- 이번 생성/수정 문서와 결과 파일만 포함한다.
- 포함 파일:
  - CODEX_RESULT.md
  - docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md
  - docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
  - docs/EIE_WORKER_DEPLOY_SOP.md 생성했다면 포함
  - remote_pragma_eie_students.txt
  - remote_pragma_eie_student_contacts.txt
  - remote_pragma_eie_student_schedule_assignments.txt
  - remote_count_eie_students.txt
  - remote_count_eie_student_contacts.txt
  - remote_count_eie_student_schedule_assignments.txt
  - eie_worker_file_list.txt
  - eie_worker_wrangler_toml.txt 있으면 포함
  - eie_worker_package_json.txt 있으면 포함
  - eie_worker_student_crud_search.txt 있으면 포함
  - git diff txt
  - git status txt
  - node check txt
- 임시 폴더는 프로젝트 루트에 만들지 말고 $env:TEMP\AP_REVIEW_WORK 아래에 만든다.
- 최종 zip은 $env:USERPROFILE\Downloads 아래에 생성한다.
- zip 파일명:
  $env:USERPROFILE\Downloads\eie_apms_rebase_round1_6_worker_deploy_check_review_pack_20260530.zip

작업 완료 전 자체 검수:
1. wrangler deploy를 실행하지 않았는지 확인한다.
2. D1 migration을 실행하지 않았는지 확인한다.
3. remote PRAGMA 결과가 문서에 반영됐는지 확인한다.
4. EIE Worker 루트가 불확실하면 배포 보류로 판정했는지 확인한다.
5. smoke test 쓰기 명령을 실행하지 않았는지 확인한다.
6. git add/commit/push를 하지 않았는지 확인한다.
7. APMS production Worker를 EIE Worker로 혼동하지 않았는지 확인한다.

마지막 지시:
작업 완료 후 바로 보고하지 말고, 먼저 자체 검수한다.
자체 검수에서 발견한 문제는 CODEX_RESULT.md 작성 전에 직접 보정하고 다시 검증한다.
그 다음 변경 파일 중심 review pack zip을 생성한다.
git add, git commit, git push는 하지 않는다.

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.
EOF

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.