cd C:\Users\USER\Desktop\AP------

cat > CODEX_TASK.md <<'EOF'
EIE APMS 리베이스 Round 1.7 EIE Worker 소스 루트 확정/복구 지시서

작업 루트:
C:\Users\USER\Desktop\AP------

이번 작업의 목적:
Round 1.5에서 EIE 학생 CRUD Worker 코드는 AP------의 apmath/worker-backup/worker/routes/eie.js에 구현됐다.
Round 1.6에서 실제 EIE Worker 배포 소스 루트가 로컬에서 확인되지 않아 배포 보류 판정이 났다.

이번 Round 1.7의 목적은 실제 `wangji-eie-os` Worker를 배포할 수 있는 소스 루트를 확정하거나, 안전한 별도 EIE Worker 루트를 복구/생성하는 것이다.

이번 라운드는 “EIE Worker 소스 루트 확정/복구 + APMS/EIE Worker 혼동 방지 + 배포 전 검증 자료 생성”까지만 한다.
사용자 확인 없는 실제 wrangler deploy는 하지 않는다.
D1 migration도 실행하지 않는다.

절대 금지:
1. git add 금지.
2. git commit 금지.
3. git push 금지.
4. 사용자 확인 없는 wrangler deploy 금지.
5. 사용자 확인 없는 D1 migration 실행 금지.
6. APMS Worker(ap-math-os-v2612)를 실수로 deploy 금지.
7. apmath/worker-backup/worker/wrangler.jsonc를 EIE Worker인 것처럼 착각해서 deploy 금지.
8. EIE frontend view 파일 수정 금지.
9. 학생관리 UI parity 구현 금지.
10. 클래스룸 UI parity 구현 금지.
11. 검수요청서 작성 금지. 검수요청서는 ChatGPT가 별도로 작성한다.

핵심 기준:
- EIE Worker 이름: wangji-eie-os
- EIE Worker URL: https://wangji-eie-os.js-pdf.workers.dev
- EIE D1 이름: wangji-eie-os
- APMS Worker 이름: ap-math-os-v2612
- APMS D1 이름: ap-math-os
- APMS Worker와 EIE Worker를 절대 혼동하지 않는다.

이번 라운드 수정 허용 위치:
1. C:\Users\USER\Desktop\AP------\docs
2. C:\Users\USER\Desktop\AP------\CODEX_RESULT.md
3. C:\Users\USER\Desktop\wangji-eie-worker 새 폴더 생성 또는 기존 폴더 보정 가능
4. C:\Users\USER\Desktop\wangji-eie-worker 내부 파일 생성/수정 가능

이번 라운드 수정 금지 위치:
1. AP------의 EIE frontend view 파일
2. AP------의 apmath 실제 프론트 파일
3. AP------의 apmath/worker-backup/worker/wrangler.jsonc
4. AP------의 기존 Worker 파일을 배포용으로 임의 변경하는 것
단, AP------의 worker-backup 소스를 읽고 복사해서 wangji-eie-worker에 반영하는 것은 허용한다.

먼저 할 일:
1. C:\Users\USER\Desktop\AP------에서 git status --short --untracked-files=all 확인.
2. C:\Users\USER\Desktop 전체에서 EIE Worker 후보를 다시 찾는다.
3. `wangji-eie-os`, `wangji-eie-worker`, `wrangler.toml`, `wrangler.jsonc`, `database_name`, `ap-math-os-v2612`, `handleEie`, `routes/eie` 키워드로 검색한다.
4. 검색 결과를 보고서에 기록한다.
5. 실제 EIE Worker 루트가 이미 있으면 그 루트를 사용한다.
6. 실제 EIE Worker 루트가 없으면 C:\Users\USER\Desktop\wangji-eie-worker를 새로 만든다.

검색 명령 예시:
cd C:\Users\USER\Desktop

Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match 'wrangler|package|index|eie|worker|route' } |
  Select-Object FullName > "$env:TEMP\AP_REVIEW_WORK\eie_round1_7_worker_root_search_files.txt"

Select-String -Path "C:\Users\USER\Desktop\**\*.toml","C:\Users\USER\Desktop\**\*.json","C:\Users\USER\Desktop\**\*.jsonc","C:\Users\USER\Desktop\**\*.js","C:\Users\USER\Desktop\**\*.md" `
  -Pattern "wangji-eie-os|wangji-eie-worker|ap-math-os-v2612|database_name|handleEie|routes/eie|js-pdf.workers.dev" `
  -Context 2,2 > "$env:TEMP\AP_REVIEW_WORK\eie_round1_7_worker_root_keyword_search.txt" -ErrorAction SilentlyContinue

EIE Worker 루트 판정 기준:
다음 조건을 모두 만족해야 실제 EIE Worker 루트로 인정한다.

1. wrangler.toml 또는 wrangler.jsonc에 name이 wangji-eie-os 또는 명확히 EIE Worker로 설정되어 있다.
2. D1 binding이 wangji-eie-os를 가리킨다.
3. Worker entry 파일이 존재한다.
4. /api/eie route 또는 handleEie 연결이 존재한다.
5. ap-math-os-v2612를 배포 대상으로 삼지 않는다.

EIE Worker 루트가 없는 경우 복구/생성 정책:
C:\Users\USER\Desktop\wangji-eie-worker 폴더를 새로 만든다.
AP------의 apmath/worker-backup/worker를 소스 기준으로 복사하되, wrangler 설정은 EIE 전용으로 새로 만든다.

복구/생성할 파일:
1. C:\Users\USER\Desktop\wangji-eie-worker\index.js
2. C:\Users\USER\Desktop\wangji-eie-worker\routes\eie.js
3. C:\Users\USER\Desktop\wangji-eie-worker\package.json
4. C:\Users\USER\Desktop\wangji-eie-worker\wrangler.jsonc 또는 wrangler.toml
5. 필요한 경우 C:\Users\USER\Desktop\wangji-eie-worker\README.md

복사 기준:
- AP------\apmath\worker-backup\worker\index.js → wangji-eie-worker\index.js
- AP------\apmath\worker-backup\worker\routes\eie.js → wangji-eie-worker\routes\eie.js
- 필요한 shared helper가 index.js에서 require/import 되는 경우 함께 복사한다.
- Node/CommonJS/ESM 구조를 실제 파일 기준으로 맞춘다.
- index.js가 routes/eie.js를 import하는 방식이 깨지지 않게 한다.

wrangler 설정 기준:
파일은 기존 프로젝트 스타일에 맞춰 wrangler.jsonc 또는 wrangler.toml 중 하나를 만든다.
반드시 다음 기준을 만족한다.

name = "wangji-eie-os"
main = "index.js" 또는 실제 entry
compatibility_date = 기존 Worker 기준 또는 현재 프로젝트 기존 값

D1 binding:
binding = "DB" 또는 index.js가 실제 사용하는 binding 이름
database_name = "wangji-eie-os"
database_id는 이미 알고 있는 값이 없으면 비워두지 말고, wrangler d1 list로 확인 가능한 경우 기록한다.
database_id를 자동으로 찾지 못하면 placeholder를 쓰지 말고 CODEX_RESULT.md에 “database_id 확인 필요”로 기록하고 배포 보류로 판정한다.

주의:
- wrangler 설정이 불완전하면 deploy 가능 판정 금지.
- APMS D1인 ap-math-os를 EIE wrangler에 쓰면 FAIL.
- ap-math-os-v2612를 name으로 쓰면 FAIL.

wrangler d1 list 확인:
가능하면 다음을 실행한다.

cd C:\Users\USER\Desktop\AP------
npx wrangler d1 list > "$env:TEMP\AP_REVIEW_WORK\eie_round1_7_d1_list.txt"

여기서 wangji-eie-os의 database_id를 찾는다.
찾으면 wrangler 설정에 반영한다.
찾지 못하면 배포 보류.

remote D1 PRAGMA:
사용자 권한이 허용되면 읽기 전용으로만 실행한다.
권한 차단되면 차단 사실을 기록하고 진행한다.
migration 실행 금지.

npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(eie_students);" > "$env:TEMP\AP_REVIEW_WORK\eie_round1_7_remote_pragma_eie_students.txt"

Round 1.5 학생 CRUD 반영 확인:
실제 EIE Worker 루트의 routes/eie.js에 다음 함수 또는 동등 구현이 있어야 한다.
1. handlePostStudent
2. handlePatchStudent
3. handlePatchStudentStatus
4. handleDeleteStudent
5. DELETE /students/:id soft delete
6. 물리 DELETE 없음

정적 검증:
EIE Worker 루트가 C:\Users\USER\Desktop\wangji-eie-worker인 경우 다음 실행.

cd C:\Users\USER\Desktop\wangji-eie-worker

node --check .\index.js
node --check .\routes\eie.js

Select-String -Path .\index.js,.\routes\eie.js -Pattern "handleEie|handlePostStudent|handlePatchStudent|handlePatchStudentStatus|handleDeleteStudent|eie_students|eie_student_contacts|archived|DELETE" -Context 3,3 > "$env:TEMP\AP_REVIEW_WORK\eie_round1_7_worker_static_search.txt"

검증해야 할 것:
1. index.js가 /api/eie를 routes/eie.js로 연결하는지
2. routes/eie.js가 학생 CRUD를 포함하는지
3. DELETE가 물리 delete가 아니라 status archived soft delete인지
4. DB binding 이름이 wrangler 설정과 index.js에서 일치하는지
5. name/database_name이 EIE 기준인지

배포 명령 준비:
배포 가능 판정일 때만 CODEX_RESULT.md에 배포 명령을 기록한다.
절대 실행하지 않는다.

배포 가능 명령 예시:
cd C:\Users\USER\Desktop\wangji-eie-worker
node --check .\index.js
node --check .\routes\eie.js
npx wrangler deploy

배포 보류 판정 조건:
1. EIE Worker 루트 불명확
2. wrangler name이 wangji-eie-os가 아님
3. database_name이 wangji-eie-os가 아님
4. database_id 확인 불가
5. routes/eie.js에 학생 CRUD 없음
6. node --check 실패
7. APMS Worker 설정만 존재
8. remote D1 schema 확인 불가 + local migration과 binding 불명확

문서 업데이트:
docs/EIE_WORKER_DEPLOY_SOP.md를 생성 또는 업데이트한다.

필수 내용:
1. EIE Worker 루트
2. wrangler 설정 기준
3. 배포 전 확인 명령
4. 배포 명령
5. 배포 후 읽기 smoke
6. 배포 후 쓰기 smoke
7. APMS Worker와 혼동 금지 주의
8. D1 schema 확인 명령

docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md 업데이트:
1. Round 1.7 결과 추가
2. EIE Worker 루트 확정 여부
3. 배포 가능/보류 판정
4. 다음 라운드 조건

CODEX_RESULT.md 형식:
# CODEX_RESULT

## 1. 생성/수정 파일
- 생성 파일
- 수정 파일

## 2. 확인 완료
- EIE Worker 후보 검색
- EIE Worker 루트 확정 또는 신규 생성
- wrangler 설정 확인
- D1 binding 확인
- Round 1.5 학생 CRUD 반영 확인
- node --check 결과

## 3. 실제 확인한 파일
- AP------ worker-backup 파일
- EIE Worker 파일
- wrangler 설정 파일
- 문서 파일

## 4. 실행 결과
- worker root search 결과
- keyword search 결과
- d1 list 결과
- remote PRAGMA 결과 또는 차단 사유
- node --check 결과
- static search 결과

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
- D1 migration 미실행
- 학생관리 UI parity 미구현
- git add/commit/push 없음

## 8. 남은 위험
- database_id 확인 필요 여부
- remote D1 schema 차이 가능성
- auth token 문제
- APMS/EIE Worker 혼동 위험
- 실제 배포 후 smoke 필요

## 9. 다음 라운드
- 배포 가능이면 사용자 확인 후 EIE Worker deploy + smoke test
- 배포 보류면 보류 원인 해결
- 그 다음 Round 2: EIE 학생관리 APMS parity

## 10. review pack 경로
- 생성한 zip 경로

review pack 생성:
- 프로젝트 전체 압축 금지.
- 이번 생성/수정 파일과 확인 결과만 포함한다.
- 포함 파일:
  - C:\Users\USER\Desktop\wangji-eie-worker\index.js
  - C:\Users\USER\Desktop\wangji-eie-worker\routes\eie.js
  - C:\Users\USER\Desktop\wangji-eie-worker\wrangler.jsonc 또는 wrangler.toml
  - C:\Users\USER\Desktop\wangji-eie-worker\package.json
  - C:\Users\USER\Desktop\wangji-eie-worker\README.md 있으면 포함
  - docs/EIE_WORKER_DEPLOY_SOP.md
  - docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md
  - CODEX_RESULT.md
  - worker root search txt
  - keyword search txt
  - d1 list txt
  - remote PRAGMA txt 있으면 포함
  - node check txt
  - static search txt
  - git status txt
  - git diff txt
- 임시 폴더는 프로젝트 루트에 만들지 말고 $env:TEMP\AP_REVIEW_WORK 아래에 만든다.
- 최종 zip은 $env:USERPROFILE\Downloads 아래에 생성한다.
- zip 파일명:
  $env:USERPROFILE\Downloads\eie_apms_rebase_round1_7_worker_source_review_pack_20260530.zip

작업 완료 전 자체 검수:
1. wrangler deploy를 실행하지 않았는지 확인한다.
2. D1 migration을 실행하지 않았는지 확인한다.
3. EIE Worker name이 wangji-eie-os인지 확인한다.
4. database_name이 wangji-eie-os인지 확인한다.
5. APMS Worker 설정을 덮어쓰지 않았는지 확인한다.
6. 학생 CRUD가 실제 EIE Worker 소스에 있는지 확인한다.
7. node --check 결과를 모두 확인한다.
8. git add/commit/push를 하지 않았는지 확인한다.

마지막 지시:
작업 완료 후 바로 보고하지 말고, 먼저 자체 검수한다.
자체 검수에서 발견한 문제는 CODEX_RESULT.md 작성 전에 직접 보정하고 다시 검증한다.
그 다음 변경 파일 중심 review pack zip을 생성한다.
git add, git commit, git push는 하지 않는다.

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.
EOF

C:\Users\USER\Desktop\AP------의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.