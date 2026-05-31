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
- remote D1 PRAGMA(`eie_students`): **성공** — ICN 리전, 스키마 이상 없음

### EIE Worker 소스 루트
- **위치**: `C:\Users\USER\Desktop\wangji-eie-worker` (기존 폴더 확인)
- 이미 index.js, routes/eie.js, helpers/*.js 존재 확인

### Round 1.7 보정 사항

#### 1. wrangler.jsonc APMS 설정 → EIE 설정으로 수정
- **문제**: `wrangler.jsonc`에 APMS 설정(`ap-math-os-v2612`)이 잔존 → 배포 시 APMS가 덮여 쓰일 위험
- **조치**: `wrangler.jsonc`를 EIE 전용 설정으로 교체
- `wrangler.toml`(EIE 정상)과 `wrangler.jsonc`(EIE 수정)이 모두 일치하도록 통일

#### 2. handleDeleteStudent 누락 → 추가
- **문제**: `wangji-eie-worker/routes/eie.js`에 `handleDeleteStudent` 및 `getStudentById`/`getStudentWithContacts` 헬퍼 없음
- **조치**: `worker-backup/worker/routes/eie.js` 기준으로 추가 (물리 DELETE 없음, status='archived' soft delete)
- DELETE /api/eie/students/:id 라우트 등록 완료

### wrangler 설정 (검증 완료)
```json
{
  "name": "wangji-eie-os",
  "main": "index.js",
  "compatibility_date": "2026-04-18",
  "d1_databases": [{ "binding": "DB", "database_name": "wangji-eie-os", "database_id": "2066e8ce-a02e-4f35-9c2d-d60891afff63" }]
}
```

### 검증 결과
- node --check index.js: **OK**
- node --check routes/eie.js: **OK**
- handlePostStudent / handlePatchStudent / handlePatchStudentStatus / handleDeleteStudent: **존재 확인**
- soft delete (status = 'archived'): **확인 (물리 DELETE 없음)**
- /api/eie 라우팅 (index.js → handleEie): **확인**
- remote D1 eie_students 스키마: **확인 (ICN, production)**

### 배포 판정: **배포 가능 ✅**

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

## 7.5. Round 1.7.2: index.js EIE 전용 최소 Worker 교체 ✅ 완료 (2026-05-30)

### Round 1.7.1 실패 원인
- `wangji-eie-worker/index.js`에 APMS 전체 route import(enrollments, class-time-slots, students, auth 등) 잔존
- 이 상태로 배포 시 APMS 전체 Worker가 배포됨 → EIE 전용 Worker 아님

### Round 1.7.2 보정
- `index.js`를 EIE 전용 최소 Worker로 완전 교체
  - `import { handleEie } from './routes/eie.js'` 하나만 import
  - `/api/eie`, `/api/eie/*` 전용 라우팅
  - 인증: Bearer token → DB teacher_sessions 검증 (인라인)
  - 그 외 경로: `/health` = 상태 확인, 나머지 = 404
- `helpers/response.js` 보정: `errorResponse` 추가, `Content-Type: charset=utf-8` 적용
- `README.md` 신규 생성: EIE 전용 Worker 설명

### 검증 결과
- node --check index.js: **OK**
- node --check routes/eie.js: **OK**
- node --check helpers/response.js: **OK**
- dynamic import index: **OK**
- dynamic import routes/eie: **OK**
- APMS route import 검색: **[PASS] 없음**
- DELETE FROM eie_students 검색: **[PASS] 없음**
- wrangler.jsonc: name/database_name/database_id = wangji-eie-os ✅

### 배포 판정: **배포 가능 ✅**

## 7.6. Round 1.7.3: 배포 전 런타임 보정 ✅ 완료 (2026-05-30)

### 보정 내용
- `routes/eie.js` handleGet() 마지막 `return null` → `return jsonResponse({ success: false, error: 'not found' }, 404)` 변경
  - 미등록 GET 경로에서 null 반환으로 런타임 크래시 가능성 제거

### remote D1 인증 테이블 확인
| 테이블 | 결과 | 주요 컬럼 |
|---|---|---|
| teachers | ✅ 존재 (1건) | id, name, login_id, password_hash, role |
| teacher_sessions | ✅ 존재 (2건) | id, teacher_id, session_token, expires_at, revoked_at, last_used_at |

- index.js verifyTeacher() 쿼리 컬럼과 D1 스키마 완전 일치 ✅

### token smoke
- SESSION_TOKEN 환경변수 없음 → 미실행 (토큰 미제공)
- 배포 후 사용자가 SESSION_TOKEN으로 직접 확인 필요

### 검증 결과
- node --check 3개 파일: **OK**
- dynamic import index/routes: **OK**
- return null (handleGet fallback): **[PASS] 제거 완료**
- DELETE FROM eie_students: **[PASS] 없음**
- APMS route import: **[PASS] 없음**
- wrangler EIE 설정: **✅**

### 배포 판정: **배포 가능 ✅ (사용자 SESSION_TOKEN 확인 후)**

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
| node --check 통과 | ✅ (Round 1.7.2) |
| index.js EIE 전용 최소 Worker | ✅ (Round 1.7.2: APMS import 전부 제거) |
| dynamic import OK | ✅ (Round 1.7.2) |
| handleGet() null fallback 제거 | ✅ (Round 1.7.3) |
| teachers D1 테이블 확인 | ✅ (Round 1.7.3: 1건 존재) |
| teacher_sessions D1 테이블 확인 | ✅ (Round 1.7.3: 2건 존재) |
| EIE Worker 실제 배포 | ❌ (사용자 확인 후 실행) |
| remote D1 schema 확인 | ✅ (Round 1.7: ICN production 확인) |
| token smoke | ❌ (SESSION_TOKEN 미제공 — 배포 후 직접 확인 필요) |
| eie-students.js APMS parity | ❌ (Round 2 대상) |
## Round 2 Result: EIE 학생관리 APMS parity 구현 완료 (2026-05-31)

### 구현 범위
- `eie/js/views/eie-students.js`를 `EieState.get().db` 기반 렌더링으로 재구성했다.
- 화면 내부 `_students` 배열을 원본 데이터처럼 쓰는 구조를 제거하고, 검색어/선택 학생/탭/편집 draft만 로컬 UI 상태로 유지한다.
- 학생 목록, 검색, 상태 필터, 신규 등록, 상세 패널, 수정, 상태 변경, 보관 처리, 수업 배정 표시, 시간표/클래스룸 연결을 제공한다.
- 상담/출결/숙제/복수 연락처 CRUD처럼 Worker endpoint가 아직 없는 기능은 APMS와 같은 위치의 패널/버튼 문법만 유지하고 준비중으로 표시한다.

### 데이터/API 흐름
- 초기 로드는 `EieApmsState.loadFoundation()`을 우선 사용한다.
- fallback은 `EieApi.getStudents()`와 `EieApi.getTimetable()`로 `EieState.db.students`, `EieState.db.timetable_cells`를 채운다.
- create/update/status/archive는 각각 `EieApi.createStudent`, `EieApi.updateStudent`, `EieApi.updateStudentStatus`, `EieApi.deleteStudent`를 호출한다.
- 저장 후에는 `loadFoundation(true)`로 Worker/D1 상태를 다시 읽어 화면을 동기화한다.

### 제한
- APMS 원본 파일은 수정하지 않았다.
- Worker, migration, classroom/timetable/dashboard view는 수정하지 않았다.
- 브라우저 실기기 확인은 별도 확인 항목으로 남긴다.
# Round 3 Contact/Consultation Foundation (2026-05-31)

- EIE Worker minimal route set에 연락처/상담 저장 기반을 추가했다.
- 추가 Worker endpoint:
  - `GET/POST /api/eie/students/:studentId/contacts`
  - `PATCH/DELETE /api/eie/student-contacts/:contactId`
  - `GET/POST /api/eie/consultations`
  - `PATCH/DELETE /api/eie/consultations/:id`
- `eie_student_contacts`에는 `status`/`deleted_at` 컬럼이 없으므로 DELETE는 물리 삭제하지 않고 `409 EIE_NOT_IMPLEMENTED`로 보류한다.
- remote D1에서 상담 저장 후보 중 `consultations` 테이블만 확인되었고, 해당 테이블도 `status`/`deleted_at`/`updated_at` 컬럼이 없어 DELETE는 보류한다.
- EIE frontend는 학생 상세의 연락처/상담 탭에 최소 CRUD 진입점만 연결했다. 학생관리 전체 UI parity, classroom/timetable/dashboard 변경은 이번 라운드 범위에서 제외했다.
