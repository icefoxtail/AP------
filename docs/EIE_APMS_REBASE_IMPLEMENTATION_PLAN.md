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
- 완료: EieState.db/ui 구조, EieApmsState, EieApmsApi, EieApmsUiBridge, window.api/state 설정, window.toast/closeModal/openModal/renderDashboard 제공

## 4. Round 1.1: 호환 레이어 보정 ✅ 완료 (2026-05-30)
- window.state = EieState.get() 제공
- api.get('students') APMS형 normalize
- 미구현 쓰기 EIE_NOT_IMPLEMENTED 고정
- apmath-home/index.html 범위 밖 변경 복원

## 5. Round 1.5: 학생 CRUD Worker/API 선구현 ✅ 코드 완료 (2026-05-30)
- **커밋**: `865509a Add EIE student CRUD API foundation`
- 수정 파일: `apmath/worker-backup/worker/routes/eie.js`, `eie/js/eie-api.js`, `eie/js/apms-compat/eie-apms-api.js`

### 구현 완료 (코드 기준)
| endpoint | 설명 |
|---|---|
| POST /api/eie/students | 학생 직접 등록 (display_name 필수, phone/grade/status/memo 지원) |
| PATCH /api/eie/students/{id} | 학생 정보 수정 (whitelist update, phone upsert) |
| PATCH /api/eie/students/{id}/status | 상태 변경 (active/inactive/archived/needs_review/withdrawn) |
| DELETE /api/eie/students/{id} | soft delete (status → archived, 물리 삭제 없음) |
| EieApi.deleteStudent | eie-api.js에 추가 |

### 미완료 (실제 Worker 배포)
- D1 migration 미실행
- EIE Worker deploy 미실행 (이유: §6 참조)

## 6. Round 1.6: Worker 배포 준비/검증 ✅ 검증 완료 (2026-05-30)

### 확인 결과
- Round 1.5 코드: 커밋 `865509a`에 반영됨
- node --check: 전체 통과
- remote D1 schema: permission blocked로 직접 확인 불가, 로컬 migration 기준 이상 없음
- EIE Worker 소스 루트: **미발견**

### EIE Worker 구조 파악
- EIE 프론트: `https://wangji-eie-os.js-pdf.workers.dev/api/eie/...`
- APMS Worker: `ap-math-os-v2612.js-pdf.workers.dev` (wrangler.jsonc 확인)
- EIE Worker (`wangji-eie-os`) 배포 소스: **로컬 미발견** (`wangji-eie-worker` 폴더 없음)
- 두 Worker는 코드 공유하지만 wrangler 설정이 별개
- 커밋 `1c0ac20 Point EIE frontend to EIE worker` (2026-05-29): EIE 프론트를 별도 Worker로 분리한 시점

### 배포 판정: **배포 보류**
- EIE 전용 wrangler.jsonc 미발견
- APMS Worker 루트에서 deploy 시 APMS 덮어쓸 위험

## 7. Round 1.6 배포 보류 후 필요 작업

### 즉시 필요
1. EIE Worker 소스 루트 확인 (wrangler.jsonc `name: "wangji-eie-os"` 포함 여부)
2. 실제 EIE Worker에 Round 1.5 학생 CRUD 반영 확인
3. remote D1 PRAGMA 확인
4. 사용자 확인 후 `npx wrangler deploy`
5. 배포 후 읽기 smoke test (`GET /confirmed-students`, `GET /timetable`)

### 참고 문서
- `docs/EIE_WORKER_DEPLOY_SOP.md` — 배포 절차 및 smoke test 명령

## 8. Round 2: EIE 학생관리 APMS parity
- **전제 조건**: EIE Worker 배포 완료 OR 저장 버튼 준비중 처리로 진행
- 대상 파일: `eie/js/views/eie-students.js` 교체/확장
- **Round 2에서 남은 주의점**:
  - APMS student.js 복사 시 CONFIG.API_BASE, getTeacherNameForUI, copyPhoneNumber 등 추가 bridge 필요 가능성
  - 연락처 별도 편집 endpoint 부족 → 연락처 편집은 준비중으로 처리 필요
  - 상담/숙제/출결은 여전히 not_implemented

## 9. Round 3: 상담/연락처/메모
## 10. Round 4: 클래스룸/출결/숙제
## 11. Round 5: 시간표 v2 연동

## 12. 라운드별 진입 조건 체크리스트

| 조건 | 상태 |
|---|---|
| window.state 제공 | ✅ (Round 1.1) |
| api.get('students') normalize | ✅ (Round 1.1) |
| 미구현 쓰기 not_implemented 고정 | ✅ (Round 1.1) |
| POST/PATCH/DELETE students 코드 | ✅ (Round 1.5, 커밋 865509a) |
| EieApi.deleteStudent | ✅ (Round 1.5) |
| EIE Worker 실제 배포 | ❌ (Round 1.6에서 보류 판정) |
| remote D1 schema 확인 | ❌ (permission blocked, 직접 확인 필요) |
| eie-students.js APMS parity | ❌ (Round 2 대상) |
