# EIE Worker 배포 SOP (표준 운영 절차)

## 1. EIE Worker 기본 정보

| 항목 | 값 |
|---|---|
| Worker 이름 | wangji-eie-os |
| 엔드포인트 | https://wangji-eie-os.js-pdf.workers.dev |
| D1 DB 이름 | wangji-eie-os |
| EIE 프론트 PROD_WORKER_ORIGIN | https://wangji-eie-os.js-pdf.workers.dev |

## 2. EIE Worker vs APMS Worker 구분

| 항목 | EIE Worker | APMS Worker |
|---|---|---|
| Worker 이름 | wangji-eie-os | ap-math-os-v2612 |
| D1 DB | wangji-eie-os | ap-math-os |
| EIE 라우트 | `/api/eie/*` | `/api/eie/*` (백업 소스에도 포함) |
| 주의 | **혼동 금지** | APMS 배포에 영향 없어야 함 |

## 3. EIE Worker 소스 현황 (2026-05-30)

### 로컬 소스 위치
- `C:\Users\USER\Desktop\AP------\apmath\worker-backup\worker\routes\eie.js` — EIE 라우트 구현 (백업/참조용)
- `C:\Users\USER\Desktop\AP------\apmath\worker-backup\worker\wrangler.jsonc` — **APMS Worker 설정** (EIE Worker 아님)
- `C:\Users\USER\Desktop\wangji-eie-worker` — 미발견 (2026-05-30 기준)

### EIE Worker 배포 소스 판정 (2026-05-30)
- **불확실**: EIE 전용 wrangler.jsonc/toml을 찾을 수 없음
- APMS Worker와 코드 공유할 가능성 있으나 wrangler config가 별도 필요

## 4. EIE Worker 배포 전 필수 확인

### 배포 전 체크리스트
1. [ ] EIE Worker 배포 소스 루트 확인 (wrangler.jsonc에 `name: "wangji-eie-os"`, `database_name: "wangji-eie-os"`)
2. [ ] Round 1.5 학생 CRUD (`routes/eie.js` 내 handlePostStudent 등)가 실제 배포 소스에 반영되어 있는지 확인
3. [ ] `npx wrangler whoami`로 Cloudflare 계정 로그인 확인
4. [ ] 원격 D1 schema 확인: `npx wrangler d1 execute wangji-eie-os --remote --command "PRAGMA table_info(eie_students);"`
5. [ ] 로컬 node --check 통과 확인

### 원격 D1 schema 필수 컬럼 확인 기준
**eie_students**: id, display_name, normalized_name, grade, status, memo, raw_meta_json, created_at, updated_at  
**eie_student_contacts**: id, student_id, phone, normalized_phone, contact_label, is_primary, created_at, updated_at  
**eie_student_schedule_assignments**: id, student_id, timetable_cell_id, status

## 5. EIE Worker 배포 명령 (EIE Worker 소스 확인 후만 실행)

```powershell
# EIE Worker 루트로 이동 (소스 확인 후 실제 경로 기입)
cd C:\Users\USER\Desktop\wangji-eie-worker  # 또는 실제 EIE Worker 루트

# 문법 확인
node --check .\index.js  # 또는 실제 entry 파일

# 배포 (사용자 확인 필수)
npx wrangler deploy
```

**주의**: APMS Worker (`ap-math-os-v2612`) 루트에서 실행하면 절대 안 됨.

## 6. 배포 후 smoke test 명령

### 읽기 smoke (배포 즉시 실행 가능)
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
# 1. 테스트 학생 생성
curl -X POST \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"display_name":"__EIE_CRUD_SMOKE_TEST_20260530__","grade":"고1","status":"active"}' \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students

# 2. 테스트 학생 수정 (위에서 얻은 id 사용)
curl -X PATCH \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"memo":"smoke test"}' \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students/<ID>

# 3. 테스트 학생 상태 변경
curl -X PATCH \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"inactive"}' \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students/<ID>/status

# 4. 테스트 학생 soft delete (status → archived)
curl -X DELETE \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  https://wangji-eie-os.js-pdf.workers.dev/api/eie/students/<ID>

# 5. D1 직접 확인 (status = archived 확인)
npx wrangler d1 execute wangji-eie-os --remote \
  --command "SELECT id, display_name, status FROM eie_students WHERE display_name LIKE '%SMOKE_TEST%';"
```

**주의**: 쓰기 smoke test 후 테스트 row는 물리 삭제하지 않는다. archived 상태 확인까지만.

## 7. EIE Worker 소스 반영 패치 절차 (현재 필요)

1. EIE Worker 소스 루트 확인 및 접근
2. `routes/eie.js`를 `AP------/apmath/worker-backup/worker/routes/eie.js` (커밋 `865509a` 기준)로 갱신
3. 학생 CRUD 핸들러 반영 확인: `handlePostStudent`, `handlePatchStudent`, `handlePatchStudentStatus`, `handleDeleteStudent`
4. EIE D1 binding이 `wangji-eie-os`인지 확인
5. node --check 통과 후 배포

## 8. 관련 커밋
- `865509a Add EIE student CRUD API foundation` — Round 1.5 학생 CRUD 구현
- `1c0ac20 Point EIE frontend to EIE worker` — EIE 프론트를 별도 Worker로 분리
