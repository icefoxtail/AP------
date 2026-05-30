# EIE Worker 배포 SOP (표준 운영 절차)

## 1. EIE Worker 기본 정보

| 항목 | 값 |
|---|---|
| Worker 이름 | wangji-eie-os |
| 엔드포인트 | https://wangji-eie-os.js-pdf.workers.dev |
| D1 DB 이름 | wangji-eie-os |
| D1 DB ID | 2066e8ce-a02e-4f35-9c2d-d60891afff63 |
| EIE 프론트 PROD_WORKER_ORIGIN | https://wangji-eie-os.js-pdf.workers.dev |
| **배포 소스 루트** | **C:\Users\USER\Desktop\wangji-eie-worker** |

## 2. EIE Worker vs APMS Worker 구분 (절대 혼동 금지)

| 항목 | EIE Worker | APMS Worker |
|---|---|---|
| Worker 이름 | wangji-eie-os | ap-math-os-v2612 |
| D1 DB | wangji-eie-os | ap-math-os |
| 배포 소스 루트 | `C:\Users\USER\Desktop\wangji-eie-worker` | `AP------\apmath\worker-backup\worker` |
| wrangler.jsonc | `wangji-eie-worker\wrangler.jsonc` | `worker-backup\worker\wrangler.jsonc` |

**APMS 루트에서 deploy 시 APMS Worker가 갱신됨 — EIE 배포 시 절대 APMS 루트 사용 금지.**

## 3. EIE Worker 배포 전 확인 명령

```powershell
cd C:\Users\USER\Desktop\wangji-eie-worker

# 1. 문법 확인
node --check .\index.js
node --check .\routes\eie.js
node --check .\helpers\response.js

# 2. dynamic import 확인
node --input-type=module -e "import('./index.js').then(()=>console.log('OK')).catch(e=>{console.error(e);process.exit(1);})"
node --input-type=module -e "import('./routes/eie.js').then(()=>console.log('OK')).catch(e=>{console.error(e);process.exit(1);})"

# 3. handleGet() null fallback 없는지 확인 (결과 없어야 함)
Select-String -Path .\routes\eie.js -Pattern "return null" | Where-Object { $_.Line -notmatch "readJsonBody|toJsonText|queryLatest|findConfirmed|ensureConfirmed|ensureSchedule|getStudentWith|!normalizedName|!normalizedPhone|!cellId|!row|!student" }

# 4. APMS route import 없는지 확인 (결과 없어야 함)
Select-String -Path .\index.js -Pattern "routes/enrollments|routes/auth|routes/backdoor|ap-math-os"

# 5. wrangler 설정 확인 (name/database_name 확인)
Get-Content .\wrangler.jsonc

# 6. 학생 CRUD 함수 존재 확인
Select-String -Path .\routes\eie.js -Pattern "handlePostStudent|handlePatchStudent|handlePatchStudentStatus|handleDeleteStudent"

# 7. soft delete 확인 (물리 DELETE 없어야 함)
Select-String -Path .\routes\eie.js -Pattern "archived"

# 8. teacher_sessions/teachers 인증 테이블 확인
npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(teachers);"
npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(teacher_sessions);"
npx wrangler d1 execute wangji-eie-os --remote --command "SELECT COUNT(*) AS count FROM teachers;"
npx wrangler d1 execute wangji-eie-os --remote --command "SELECT COUNT(*) AS count FROM teacher_sessions;"

# 9. wrangler 로그인 확인
npx wrangler whoami
```

## 4. remote D1 schema 확인 (배포 전)

```powershell
cd C:\Users\USER\Desktop\wangji-eie-worker
npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(eie_students);"
npx wrangler d1 execute wangji-eie-os --remote --command "SELECT COUNT(*) FROM eie_students;"
```

### 필수 컬럼 확인 기준
- **eie_students**: id, display_name, normalized_name, grade, status, memo, raw_meta_json, created_at, updated_at
- **eie_student_contacts**: id, student_id, phone, normalized_phone, contact_label, is_primary, created_at, updated_at

## 5. EIE Worker 배포 명령 (사용자 최종 확인 필수)

```powershell
cd C:\Users\USER\Desktop\wangji-eie-worker

# 위 확인 명령 실행 후 이상 없을 때만 실행
npx wrangler deploy
```

## 6. 배포 후 읽기 smoke test

```bash
# health 확인 (인증 불필요)
curl https://wangji-eie-os.js-pdf.workers.dev/health

# 미등록 경로 404 확인 (인증 불필요)
curl https://wangji-eie-os.js-pdf.workers.dev/api/eie/unknown-path
# 기대: {"success":false,"error":"not found"} 404

# GET confirmed-students (SESSION_TOKEN 필요)
curl -H "Authorization: Bearer <SESSION_TOKEN>" \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/confirmed-students

# GET timetable (SESSION_TOKEN 필요)
curl -H "Authorization: Bearer <SESSION_TOKEN>" \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/timetable
```

> **참고**: SESSION_TOKEN은 EIE D1 wangji-eie-os의 teacher_sessions 테이블에서 발급된 token이어야 함.
> teachers: 1건, teacher_sessions: 2건 확인 (2026-05-30 기준)

## 7. 배포 후 쓰기 smoke test (사용자 확인 후만)

```bash
# 1. 테스트 학생 생성
curl -X POST -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"display_name":"__EIE_CRUD_SMOKE_TEST_20260530__","grade":"고1"}' \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students

# 2. 학생 수정
curl -X PATCH -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"memo":"smoke test"}' \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students/<ID>

# 3. 상태 변경
curl -X PATCH -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"inactive"}' \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students/<ID>/status

# 4. soft delete (status → archived)
curl -X DELETE -H "Authorization: Bearer <TOKEN>" \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students/<ID>

# 5. D1에서 확인
npx wrangler d1 execute wangji-eie-os --remote \
  --command "SELECT id, display_name, status FROM eie_students WHERE display_name LIKE '%SMOKE_TEST%';"
```

## 8. 주의사항

- `wrangler.jsonc`와 `wrangler.toml` 모두 EIE 설정(wangji-eie-os)으로 통일됨 (Round 1.7)
- wangji-eie-worker 내 어떤 wrangler 설정을 사용해도 EIE Worker만 배포됨
- APMS Worker(ap-math-os-v2612)는 `AP------/apmath/worker-backup/worker`에서만 배포 가능

## 9. 관련 커밋

- `865509a Add EIE student CRUD API foundation` — Round 1.5 학생 CRUD 구현
- `1c0ac20 Point EIE frontend to EIE worker` — EIE 프론트를 wangji-eie-os로 분리

## 10. Round 1.7 변경 이력 (2026-05-30)

| 파일 | 변경 내용 |
|---|---|
| `wangji-eie-worker/wrangler.jsonc` | APMS 설정(ap-math-os-v2612) → EIE 설정(wangji-eie-os)으로 교체 |
| `wangji-eie-worker/routes/eie.js` | `getStudentById`, `getStudentWithContacts`, `handleDeleteStudent` 추가; DELETE /students/:id 라우트 등록 |

## 11. Round 1.7.2 변경 이력 (2026-05-30)

| 파일 | 변경 내용 |
|---|---|
| `wangji-eie-worker/index.js` | APMS 전체 route import 제거 → EIE 전용 최소 Worker로 완전 교체 |
| `wangji-eie-worker/helpers/response.js` | `errorResponse` 추가, Content-Type charset=utf-8 적용 |
| `wangji-eie-worker/README.md` | 신규 생성 — EIE 전용 Worker 설명 |

**Round 1.7.1 실패 원인**: index.js에 APMS 전체 route import(enrollments, auth, backdoor 등 25개) 잔존.
**Round 1.7.2 조치**: index.js를 `routes/eie.js` 단독 import + `/api/eie` 전용 라우팅으로 완전 교체.
