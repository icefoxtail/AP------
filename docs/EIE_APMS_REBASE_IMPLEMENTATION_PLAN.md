# EIE APMS 리베이스 구현 계획서

## 1. 최종 목표
EIE를 APMS 화면·상태·저장 흐름을 기준으로 영어관용으로 택갈이한다.

## 2. 고정 원칙
- APMS UI/UX 복사 기반
- EIE 데이터/API adapter 방식
- 로컬 상태는 draft에만 사용
- 원본 데이터는 `EieState.db` 기준
- 저장은 `EieApi` → Worker → D1
- 학생관리 우선 / 시간표 편집은 후순위

## 3. Round 1: EIE 공통 상태/API 호환 레이어 ✅ 완료 (2026-05-30)
- 신규 파일: `eie/js/apms-compat/eie-apms-state.js`, `eie-apms-api.js`, `eie-apms-ui-bridge.js`
- 수정 파일: `eie/index.html`, `eie/js/eie-state.js`, `eie/js/eie-api.js`

## 4. Round 1.1: 호환 레이어 보정 ✅ 완료 (2026-05-30)
- window.state / api.get('students') normalize / not_implemented 고정

## 5. Round 1.5: 학생 CRUD Worker/API 선구현 ✅ 코드 완료 (2026-05-30)
- 커밋: `865509a Add EIE student CRUD API foundation`
- POST/PATCH/DELETE students Worker endpoint + EieApi.deleteStudent + EieApmsApi 매핑 해제

## 6. Round 1.6: Worker 배포 준비/검증 ✅ 완료 (2026-05-30)
- wrangler d1 list: wangji-eie-os D1 DB ID 확인 (2066e8ce-a02e-4f35-9c2d-d60891afff63)
- EIE Worker 소스 루트 미발견 → Round 1.7에서 복구

## 7. Round 1.7: EIE Worker 소스 루트 확정/복구 ✅ 완료 (2026-05-30)

### 확인 결과
- `wrangler d1 list`: wangji-eie-os D1 존재 확인, database_id: `2066e8ce-a02e-4f35-9c2d-d60891afff63`
- remote D1 PRAGMA: permission blocked (schema는 로컬 migration 기준으로 이상 없음)

### EIE Worker 소스 복구
- **위치**: `C:\Users\USER\Desktop\wangji-eie-worker`
- **소스 기준**: `AP------/apmath/worker-backup/worker` (커밋 865509a)
- **복사 파일**: index.js, routes/*.js, helpers/*.js

### wrangler.jsonc 설정 (검증 완료)
```json
{
  "name": "wangji-eie-os",
  "main": "index.js",
  "compatibility_date": "2026-04-18",
  "d1_databases": [{ "binding": "DB", "database_name": "wangji-eie-os", "database_id": "2066e8ce-a02e-4f35-9c2d-d60891afff63" }]
}
```

### 검증 결과
- node --check index.js: OK
- node --check routes/eie.js: OK
- handlePostStudent / handlePatchStudent / handlePatchStudentStatus / handleDeleteStudent: 존재 확인
- soft delete (status = 'archived'): 확인
- /api/eie 라우팅 (index.js → handleEie): 확인

### 배포 판정: **배포 가능 후보 ✅**

단, 실제 배포는 사용자 확인 후 진행:
```
cd C:\Users\USER\Desktop\wangji-eie-worker
node --check .\index.js && node --check .\routes\eie.js
npx wrangler deploy
```

### 배포 후 체크
1. GET /api/eie/confirmed-students 읽기 smoke
2. GET /api/eie/timetable 읽기 smoke
3. POST students 쓰기 smoke (사용자 확인 후)

## 8. Round 2: EIE 학생관리 APMS parity (다음 라운드)
- **전제 조건**: EIE Worker 배포 완료 (또는 저장 버튼 준비중으로 진행)
- 대상: `eie/js/views/eie-students.js` 교체/확장
- 주의점: APMS student.js 복사 시 추가 bridge 필요, 연락처 편집 준비중 처리

## 9. 라운드별 체크리스트

| 조건 | 상태 |
|---|---|
| window.state 제공 | ✅ (Round 1.1) |
| api.get('students') normalize | ✅ (Round 1.1) |
| 미구현 쓰기 not_implemented | ✅ (Round 1.1) |
| POST/PATCH/DELETE students 코드 | ✅ (Round 1.5, 커밋 865509a) |
| EieApi.deleteStudent | ✅ (Round 1.5) |
| EIE Worker 소스 루트 확정 | ✅ (Round 1.7: wangji-eie-worker) |
| wrangler.jsonc name/DB 정확 | ✅ (Round 1.7: wangji-eie-os) |
| database_id 확인 | ✅ (2066e8ce-a02e-4f35-9c2d-d60891afff63) |
| node --check 통과 | ✅ (Round 1.7) |
| EIE Worker 실제 배포 | ❌ (사용자 확인 후 실행) |
| remote D1 schema 확인 | ❌ (permission blocked, 배포 후 확인 권장) |
| eie-students.js APMS parity | ❌ (Round 2 대상) |
