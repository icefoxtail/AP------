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

# 2. wrangler 설정 확인 (name/database_name 확인)
Get-Content .\wrangler.jsonc

# 3. 학생 CRUD 함수 존재 확인
Select-String -Path .\routes\eie.js -Pattern "handlePostStudent|handlePatchStudent|handlePatchStudentStatus|handleDeleteStudent"

# 4. soft delete 확인 (물리 DELETE 없어야 함)
Select-String -Path .\routes\eie.js -Pattern "archived"

# 5. wrangler 로그인 확인
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
# GET confirmed-students
curl -H "Authorization: Bearer <SESSION_TOKEN>" \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/confirmed-students

# GET timetable
curl -H "Authorization: Bearer <SESSION_TOKEN>" \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/timetable
```

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

## 8. 관련 커밋

- `865509a Add EIE student CRUD API foundation` — Round 1.5 학생 CRUD 구현
- `1c0ac20 Point EIE frontend to EIE worker` — EIE 프론트를 wangji-eie-os로 분리
