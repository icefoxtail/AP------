# CODEX_RESULT

## 1. 생성/수정 파일

### 생성 파일 (Round 1.6)
- `docs/EIE_WORKER_DEPLOY_SOP.md` — EIE Worker 배포 SOP 신규 작성

### 수정 파일 (Round 1.6)
- `CODEX_RESULT.md`
- `docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md`
- `docs/EIE_APMS_STATE_API_COMPAT_SPEC.md`

## 2. 확인 완료

### Round 1.5 학생 CRUD 코드 확인
- 커밋 `865509a Add EIE student CRUD API foundation` 확인 완료
- `apmath/worker-backup/worker/routes/eie.js`에 `handlePostStudent`, `handlePatchStudent`, `handlePatchStudentStatus`, `handleDeleteStudent` 포함
- `eie/js/eie-api.js`에 `deleteStudent` 포함
- `eie/js/apms-compat/eie-apms-api.js`에 학생 쓰기 매핑 해제 확인

### remote D1 schema 확인
- **확인 불가 (permission denied)**: `npx wrangler d1 execute wangji-eie-os --remote` 실행 시 Claude Code 권한 정책에 의해 차단됨 (production DB 직접 읽기 규칙)
- 대신 로컬 migration `migrations/20260528_eie_round6_confirmed_students_contacts_assignments.sql` 기준 확인
- 로컬 migration 기준 필수 컬럼 모두 확인: eie_students, eie_student_contacts, eie_student_schedule_assignments

### EIE Worker 소스 루트 확인

**발견사항:**
- `C:\Users\USER\Desktop\wangji-eie-worker` → **존재하지 않음**
- `apmath/worker-backup/worker/wrangler.jsonc` → `name: "ap-math-os-v2612"`, `database_name: "ap-math-os"` → **APMS Worker, EIE Worker 아님**
- Desktop 전체 탐색에서 `wangji-eie-os`를 참조하는 wrangler 설정 파일 없음
- 커밋 `1c0ac20 Point EIE frontend to EIE worker` (2026-05-29): EIE 프론트의 PROD_WORKER_ORIGIN을 `ap-math-os-v2612`에서 `wangji-eie-os`로 분리한 시점

**구조 이해:**
- EIE 라우트 코드(`routes/eie.js`)는 APMS Worker 백업 소스에 통합되어 있음
- 실제 `wangji-eie-os.js-pdf.workers.dev` Worker는 별도 배포 소스가 있어야 하지만 로컬에서 찾지 못함
- EIE Worker와 APMS Worker는 코드 공유 가능하지만 wrangler 설정이 별개 필요

### 배포 가능 여부 판정
- **배포 보류**
- 이유: EIE Worker 전용 wrangler.jsonc/toml을 찾을 수 없어 `npx wrangler deploy` 실행 시 APMS Worker를 실수로 배포할 위험 존재
- 선행 조건: EIE Worker 배포 소스 루트 확인 필요

### smoke test 명령 준비
- `docs/EIE_WORKER_DEPLOY_SOP.md` §6 참조

## 3. 실제 확인한 핵심 파일

### AP------ Worker 파일
- `apmath/worker-backup/worker/routes/eie.js` — Round 1.5 학생 CRUD 포함 (커밋 `865509a`)
- `apmath/worker-backup/worker/wrangler.jsonc` — APMS Worker 설정 (EIE 아님)
- `apmath/worker-backup/worker/index.js` — APMS+EIE 통합 라우팅

### EIE Worker 파일
- 없음 (wangji-eie-worker 폴더 미발견)

### EIE API/Compat 파일
- `eie/js/eie-api.js` — deleteStudent 포함 확인
- `eie/js/apms-compat/eie-apms-api.js` — 학생 쓰기 매핑 해제 확인

### 문서 파일
- `docs/EIE_WORKER_DEPLOY_SOP.md` — 신규 작성
- `docs/EIE_APMS_REBASE_IMPLEMENTATION_PLAN.md`
- `docs/EIE_APMS_STATE_API_COMPAT_SPEC.md`

## 4. 실행 결과

### node --check 결과
```
apmath/worker-backup/worker/routes/eie.js    OK
apmath/worker-backup/worker/index.js         OK
eie/js/eie-api.js                            OK
eie/js/apms-compat/eie-apms-api.js           OK
eie/js/eie-state.js                          OK
eie/js/apms-compat/eie-apms-state.js         OK
eie/js/apms-compat/eie-apms-ui-bridge.js     OK
```

### remote D1 PRAGMA 결과
- **실행 불가**: Claude Code production DB 읽기 권한 정책으로 차단
- 로컬 migration 기준 schema 매핑 확인 완료 (이상 없음)

### remote D1 count 결과
- 실행 불가 (동일 이유)

### EIE Worker source 검색 결과
- `wangji-eie-worker` 폴더: 미발견
- Desktop 내 `wangji-eie-os` wrangler 참조: 미발견
- 관련 커밋: `1c0ac20 Point EIE frontend to EIE worker` (2026-05-29)

### git diff --name-only
```
(없음, 작업트리 클린)
```

### git status --short
```
(없음, 작업트리 클린)
```

**최근 커밋 이력**:
```
61acf3e 1
ffafed4 Show floating alert for new public inquiries
865509a Add EIE student CRUD API foundation
f774dd8 Add public inquiry intake and admin review
9e3ab57 123
```

## 5. 배포 판정

### 판정: **배포 보류**

**이유**:
1. EIE Worker 전용 wrangler.jsonc/toml 미발견
2. `apmath/worker-backup/worker/wrangler.jsonc`는 APMS Worker(`ap-math-os-v2612`) 설정 → EIE Worker에 배포하면 APMS를 덮어쓸 위험
3. `wangji-eie-worker` 폴더 없음
4. remote D1 schema 확인 불가

### 배포 전 필수 조치
1. **EIE Worker 소스 루트 확인**: `wrangler.jsonc`에 `name: "wangji-eie-os"`, `database_name: "wangji-eie-os"` 포함 여부 확인
2. **학생 CRUD 반영 확인**: 실제 EIE Worker 소스의 `routes/eie.js`에 `handlePostStudent` 등 포함 여부
3. **remote D1 schema 확인**: `npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(eie_students);"`

### 배포 가능 후보일 때 실행할 명령 (확인 후만)
```powershell
# EIE Worker 루트로 이동 (실제 경로 확인 후 기입)
# cd C:\Users\USER\Desktop\wangji-eie-worker

# 문법 확인
# node --check .\index.js

# 배포 (사용자 최종 확인 필수)
# npx wrangler deploy
```

## 6. smoke test 계획

### 읽기 smoke (배포 후 즉시 실행 가능)
```bash
# GET confirmed-students
curl -H "Authorization: Bearer <SESSION_TOKEN>" \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/confirmed-students

# GET timetable
curl -H "Authorization: Bearer <SESSION_TOKEN>" \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/timetable
```

### 쓰기 smoke (사용자 확인 후만 실행)
```bash
# POST 학생 생성
curl -X POST -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"display_name":"__EIE_CRUD_SMOKE_TEST_20260530__","grade":"고1"}' \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students

# PATCH 학생 수정
curl -X PATCH -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"memo":"smoke test"}' \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students/<ID>

# PATCH 상태 변경
curl -X PATCH -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"inactive"}' \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students/<ID>/status

# DELETE soft delete
curl -X DELETE -H "Authorization: Bearer <TOKEN>" \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students/<ID>
```

### 테스트 row 이름
```
__EIE_CRUD_SMOKE_TEST_20260530__
```

### D1 확인 SQL (쓰기 smoke 후)
```sql
SELECT id, display_name, status, updated_at
FROM eie_students
WHERE display_name LIKE '%SMOKE_TEST%'
ORDER BY created_at DESC;
```

## 7. 구현하지 않은 것
- 실제 wrangler deploy 미실행 (배포 보류)
- 실제 write smoke 미실행
- remote D1 schema 직접 확인 미실행 (permission blocked)
- D1 migration 미실행
- 학생관리 UI parity 미구현
- 연락처 별도 CRUD 미구현
- git add/commit/push 없음

## 8. 남은 위험
- **EIE Worker 소스 불일치**: Round 1.5 학생 CRUD가 실제 `wangji-eie-os` Worker에 반영되지 않았을 가능성. 배포 전 반드시 확인 필요.
- **APMS/EIE Worker 혼동**: `ap-math-os-v2612` 루트에서 실수로 deploy하면 APMS가 덮어써질 수 있음.
- **remote D1 컬럼 차이**: 로컬 migration 기준으로 구현했으나 실제 remote D1이 다를 수 있음. PRAGMA 확인 필요.
- **auth token 문제**: EIE Worker의 인증 흐름(`verifyAuth`, `isEieOwner`)이 실제 D1 teacher 테이블과 일치해야 함.
- **연락처 편집 부족**: Round 2에서 연락처 편집 UI가 나오면 Worker endpoint 추가 필요.

## 9. 다음 라운드

### 즉시 필요
- **EIE Worker 소스 루트 확인**: `wangji-eie-worker` 폴더 또는 EIE 전용 wrangler.jsonc 위치 파악
- **Round 1.5 소스 반영**: 실제 EIE Worker 소스에 `routes/eie.js` 학생 CRUD 패치
- **배포 및 smoke test**: 사용자 확인 후 `npx wrangler deploy` + 읽기 smoke 실행

### 그 다음
- Round 2: EIE 학생관리 APMS parity (`eie/js/views/eie-students.js` 교체/확장)

## 10. review pack 경로
- `C:\Users\USER\Downloads\eie_apms_rebase_round1_6_worker_deploy_check_review_pack_20260530.zip`
