cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 0. 작업명

AP Math OS / 왕지교육 OS 문서 구조 재정비 1차 대공사

이번 작업은 코드 구현 작업이 아니다.

이번 작업의 목적은 현재 프로젝트에 이미 존재하는 코드, DB, Worker route, frontend, 기존 문서, 로드맵, 룰북을 실제로 읽고, 앞으로 모든 작업자가 순서대로 읽고 따라갈 수 있는 4~5단계 문서 체계를 새로 만드는 것이다.

기능 추가, 코드 수정, UI 수정, DB 수정, route 수정은 절대 하지 않는다.

---

## 1. 최상위 목적

현재 프로젝트는 기능은 많이 구현되어 있으나, 문서 구조가 약해서 다음 문제가 반복되고 있다.

- 회귀 위험이 큼
- Codex/Gemini/Claude/ChatGPT가 현재 구조를 정확히 못 잡고 작업함
- 어느 파일에 무엇이 구현되어 있는지 추적이 어려움
- 각 기능별 정책, 구현 상태, 추가 계획, 금지 범위가 흩어져 있음
- 작업 후 어떤 문서를 업데이트해야 하는지 기준이 약함
- AP Math 기존 운영 기능과 왕지교육 상위 OS 방향이 섞일 위험이 있음
- 선생님 화면, 원장 화면, 학생 포털, OMR, 수납, 시간표, 리포트 등 핵심 기능이 회귀되면 큰 스트레스와 재작업이 발생함

따라서 이번 작업에서는 프로젝트 전체를 다음 순서로 재구조화한다.

1. 최상위 정책
2. 시스템/도메인 구조
3. 현재 구현 상태
4. 앞으로 추가할 계획
5. Codex 실행/검수/업데이트 규칙

앞으로 모든 구현 작업은 이 문서 구조를 먼저 읽고 진행할 수 있어야 한다.

---

## 2. 이번 작업의 절대 금지 사항

아래 항목은 절대 금지한다.

- 코드 수정 금지
- UI 수정 금지
- DB schema 변경 금지
- migration 생성 금지
- Worker route 수정 금지
- frontend JS/HTML/CSS 수정 금지
- 기존 API 동작 변경 금지
- 기존 문서 삭제 금지
- 기존 정책 약화 금지
- 기존 UI 문구, 버튼명, 화면명, 메뉴명 변경 금지
- 새 기능 구현 금지
- 숨겨진 foundation을 UI에 노출 금지
- 원장/관리자 화면 신규 노출 금지
- 학생 포털 기능 추가 금지
- OMR 재수정/재제출 기능 추가 금지
- git add, git commit, git push 금지
- 기존 dirty 파일을 임의로 정리 금지
- 추측으로 구현 상태 작성 금지
- 실제 확인하지 않은 파일을 확인했다고 쓰기 금지
- 파일을 읽지 않고 PASS/완료 처리 금지

이번 작업은 문서 생성/정리만 한다.

---

## 3. 작업 전 현재 상태 기록

작업 시작 즉시 아래 명령으로 현재 상태를 확인하고 CODEX_RESULT.md에 기록한다.

git status --short
git diff --name-only

현재 프로젝트 루트에서 작업해야 한다.

프로젝트 루트가 아닌 경우 작업하지 말고 CODEX_RESULT.md에 중단 사유를 기록한다.

---

## 4. 반드시 먼저 읽을 기존 기준 문서

아래 파일이 존재하면 반드시 열어 읽는다.

존재하지 않는 파일은 CODEX_RESULT.md에 "미존재"로 기록하되, 비슷한 이름의 파일을 찾아 대체 기준으로 읽는다.

필수 확인 후보:

- PROJECT_RULEBOOK_AND_MAPS.md
- PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- WANGJI_OS_ROADMAP.md
- WANGJI_OS_STRUCTURE.md
- README.md
- docs/V2_WORKING_RULEBOOK.md
- docs/PROJECT_RULEBOOK.md
- docs/PROJECT_OVERVIEW.md
- docs/PROJECT_UPDATE_RULES.md
- docs/NEXT_WORK_QUEUE.md
- docs/WANGJI_WORKER_ROUTE_MAP.md
- docs/AP_MATH_FRONTEND_API_MAP.md
- docs/DB_TABLE_MAP.md
- docs/DEPLOY_AND_SMOKE.md
- CODEX_RESULT.md

중요:
- 기존 문서 내용은 삭제하지 않는다.
- 기존 문서와 새 문서가 충돌하면 새 문서에 "기존 문서 기준 / 현재 재정리 기준 / 확인 필요"로 분리 기록한다.
- 기존 문서에 있는 금지 정책은 약화하지 않는다.
- 기존 문서에 있는 방향성은 새 구조에 흡수한다.

---

## 5. 반드시 읽을 코드/구조 파일

이번 작업은 문서 작업이지만, 현재 구현 상태를 정확히 쓰기 위해 실제 코드 구조를 읽어야 한다.

아래 범위를 읽고 파일 맵을 만든다.

### 5.1 DB

- schema.sql
- migrations/
- wrangler.toml 또는 worker 관련 설정 파일

확인할 내용:

- 현재 존재하는 테이블
- 인덱스
- foundation 테이블
- 수납/출납/회계 테이블
- 시간표 테이블
- 학생/학부모/권한/감사 테이블
- AP Math 특화 테이블
- 아직 UI 노출 여부가 불확실한 테이블
- migration과 schema.sql의 관계

### 5.2 Worker

아래 경로가 존재하면 모두 구조를 확인한다.

- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/
- apmath/worker-backup/worker/helpers/
- worker/index.js
- worker/routes/
- worker/helpers/
- routes/
- helpers/
- index.js

확인할 내용:

- route 파일 목록
- 각 route 담당 API
- index.js의 import/위임 구조
- 인증/권한 helper
- initial-data 흐름
- 학생/반/출결/숙제/시험/리포트/플래너/학생포털/수납/시간표/학부모 연락/상담/운영 메모 route
- 숨겨진 foundation API
- 실제 UI에 연결된 API와 아직 foundation인 API 구분
- route 추가 시 지켜야 할 규칙

### 5.3 Frontend

아래 경로가 존재하면 구조를 확인한다.

- apmath/
- apmath/js/
- apmath/student/
- apmath/planner/
- archive/
- check/
- web-react/
- src/
- public/

확인할 내용:

- 운영센터 주요 JS
- classroom 관련 파일
- timetable 관련 파일
- report 관련 파일
- student portal 관련 파일
- planner 관련 파일
- OMR/check 관련 파일
- archive/engine/mixed engine 관련 파일
- 수업일지 관련 파일
- 수납/시간표/foundation UI 연결 여부
- UI에 실제 노출된 기능
- 구현은 되었으나 UI에 직접 노출되지 않은 기능

### 5.4 package/test/config

존재하면 구조만 확인한다.

- package.json
- web-react/package.json
- vitest/jest/playwright 관련 파일
- eslint/prettier/tsconfig/vite 설정
- wrangler 설정
- deploy script

---

## 6. 새 문서 구조 생성

아래 구조를 새로 만든다.

기존 docs 폴더가 있으면 그 안에 생성한다.

docs 폴더가 없으면 생성한다.

기존 파일과 이름이 겹치면 기존 파일을 덮어쓰지 말고, 먼저 내용을 읽은 뒤 새 구조에 맞게 신중하게 업데이트한다.

최소 생성/업데이트 대상:

docs/
├─ 00_READ_ME_FIRST.md
├─ 01_PROJECT_POLICY.md
├─ 02_SYSTEM_ARCHITECTURE.md
├─ 03_DOMAIN_INDEX.md
├─ 04_IMPLEMENTED_STATUS_INDEX.md
├─ 05_WORK_PLANNING_RULE.md
├─ 06_CODEX_EXECUTION_RULE.md
├─ 07_REVIEW_AND_REGRESSION_RULE.md
├─ 08_DOCUMENT_UPDATE_RULE.md
│
├─ domains/
│  ├─ 00_DOMAIN_READ_ORDER.md
│  ├─ WANGJI_COMMON_DOMAIN.md
│  ├─ AP_MATH_DOMAIN.md
│  ├─ CLASSROOM_DOMAIN.md
│  ├─ TIMETABLE_DOMAIN.md
│  ├─ BILLING_ACCOUNTING_DOMAIN.md
│  ├─ PARENT_CONTACT_DOMAIN.md
│  ├─ STUDENT_PORTAL_DOMAIN.md
│  ├─ PLANNER_DOMAIN.md
│  ├─ REPORT_AI_DOMAIN.md
│  ├─ ARCHIVE_OMR_DOMAIN.md
│  ├─ CLASS_DAILY_DOMAIN.md
│  ├─ HOMEWORK_PHOTO_DOMAIN.md
│  ├─ STUDENTS_CLASSES_DOMAIN.md
│  ├─ OPERATIONS_CONSULTATION_DOMAIN.md
│  ├─ STAFF_PERMISSION_AUDIT_DOMAIN.md
│  └─ HOMEPAGE_DOMAIN.md
│
├─ implemented/
│  ├─ 00_IMPLEMENTED_READ_ORDER.md
│  ├─ CURRENT_DB_MAP.md
│  ├─ CURRENT_WORKER_ROUTE_MAP.md
│  ├─ CURRENT_FRONTEND_MAP.md
│  ├─ CURRENT_API_FLOW_MAP.md
│  ├─ CURRENT_UI_EXPOSURE_MAP.md
│  ├─ CURRENT_HIDDEN_FOUNDATION_MAP.md
│  ├─ CURRENT_REGRESSION_RISK_MAP.md
│  ├─ CURRENT_AUTH_PERMISSION_MAP.md
│  └─ CURRENT_DEPLOY_SMOKE_MAP.md
│
├─ plans/
│  ├─ 00_PLAN_READ_ORDER.md
│  ├─ MASTER_ROADMAP.md
│  ├─ TIMETABLE_NEXT_PLAN.md
│  ├─ BILLING_ACCOUNTING_NEXT_PLAN.md
│  ├─ PARENT_CONTACT_NEXT_PLAN.md
│  ├─ TEACHER_MODE_NEXT_PLAN.md
│  ├─ DIRECTOR_MODE_NEXT_PLAN.md
│  ├─ STUDENT_PARENT_PORTAL_NEXT_PLAN.md
│  ├─ REPORT_AI_NEXT_PLAN.md
│  ├─ ARCHIVE_OMR_NEXT_PLAN.md
│  ├─ CLASSROOM_NEXT_PLAN.md
│  ├─ CLASS_DAILY_NEXT_PLAN.md
│  ├─ HOMEWORK_PHOTO_NEXT_PLAN.md
│  ├─ CMATH_NEXT_PLAN.md
│  ├─ EIE_NEXT_PLAN.md
│  └─ HOMEPAGE_NEXT_PLAN.md
│
└─ codex/
   ├─ 00_CODEX_READ_ORDER.md
   ├─ CODEX_TASK_WRITING_RULE.md
   ├─ CODEX_FORBIDDEN_CHANGES.md
   ├─ CODEX_ALLOWED_CHANGE_SCOPE.md
   ├─ CODEX_RESULT_RULE.md
   ├─ CODEX_REVIEW_CHECKLIST.md
   ├─ CODEX_DOC_UPDATE_CHECKLIST.md
   └─ CODEX_HANDOFF_TEMPLATE.md

---

## 7. 각 문서 작성 기준

### 7.1 docs/00_READ_ME_FIRST.md

목적:
- 모든 작업자가 가장 먼저 읽는 문서
- 전체 문서 읽는 순서를 고정

반드시 포함:

1. 이 프로젝트의 최상위 원칙
2. 작업 전 문서 읽기 순서
3. 작업 유형별 읽어야 할 문서 4개 규칙
4. 구현 작업 전 금지 사항
5. 작업 후 업데이트해야 할 문서 규칙
6. Codex/Gemini/Claude/ChatGPT/사람 작업자 공통 기준

작업 유형별 읽기 규칙 예시:

- 시간표 작업:
  1. docs/01_PROJECT_POLICY.md
  2. docs/domains/TIMETABLE_DOMAIN.md
  3. docs/implemented/CURRENT_FRONTEND_MAP.md
  4. docs/plans/TIMETABLE_NEXT_PLAN.md

- 수납 작업:
  1. docs/01_PROJECT_POLICY.md
  2. docs/domains/BILLING_ACCOUNTING_DOMAIN.md
  3. docs/implemented/CURRENT_DB_MAP.md
  4. docs/plans/BILLING_ACCOUNTING_NEXT_PLAN.md

- 리포트 작업:
  1. docs/01_PROJECT_POLICY.md
  2. docs/domains/REPORT_AI_DOMAIN.md
  3. docs/implemented/CURRENT_API_FLOW_MAP.md
  4. docs/plans/REPORT_AI_NEXT_PLAN.md

- 학생포털/OMR 작업:
  1. docs/01_PROJECT_POLICY.md
  2. docs/domains/STUDENT_PORTAL_DOMAIN.md 또는 ARCHIVE_OMR_DOMAIN.md
  3. docs/implemented/CURRENT_AUTH_PERMISSION_MAP.md
  4. docs/plans/STUDENT_PARENT_PORTAL_NEXT_PLAN.md 또는 ARCHIVE_OMR_NEXT_PLAN.md

### 7.2 docs/01_PROJECT_POLICY.md

기존 룰북을 강화한 최상위 정책 문서로 작성한다.

반드시 포함:

- 요청 범위 보존
- 기존 UI 문구/버튼명/화면명/메뉴명 보존
- 한글 UI 문구 임의 확정 금지
- 사용자 확인 없는 원장/관리자 화면 노출 금지
- 학생 포털 시험지 직접 열기 금지
- OMR 제출 완료 후 수정/재입력/재제출 금지
- AP Math 기존 운영 자산 보호
- 왕지교육 상위 OS 원칙
- 공통 foundation과 학원별 특화 기능 분리
- 선생님 친화형 화면 우선
- 원장/admin 기능과 선생님 현장 화면 분리
- foundation 먼저, UI 노출 나중
- DB/API 변경 시 문서 업데이트 필수
- route 본문 index.js 직접 추가 금지
- git add . 금지
- 검수 전 커밋 금지
- 작업 완료 보고 기준

강화 포인트:
- "룰북이 약해서 회귀 위험이 생긴다"는 문제를 해결하도록, 금지 사항과 회귀 방지 원칙을 구체적으로 작성한다.
- 기능별로 무엇을 건드리면 위험한지 명확히 적는다.
- 사용자가 명시적으로 요청하지 않은 UI 텍스트 변경은 실패로 본다고 적는다.

### 7.3 docs/02_SYSTEM_ARCHITECTURE.md

왕지교육 OS와 AP Math OS의 상위 구조를 정리한다.

반드시 포함:

- 왕지교육 OS는 AP Math OS를 갈아엎지 않는 상위 운영층
- AP Math는 기존 핵심 모듈로 유지
- 씨매쓰 초등과 EIE 영어학원은 새 학원 모듈로 합류
- 공통 운영층
- 학원별 특화 기능
- 학생/학부모 포털
- 수납·출납·회계
- 상담·공지·알림
- 직원·권한·감사
- 홈페이지
- 기존 경로 보존 원칙
- 신규 SaaS/상위 운영층 방향과 기존 바닐라 APMS 유지 방향

### 7.4 docs/03_DOMAIN_INDEX.md

도메인 전체 인덱스를 만든다.

각 도메인마다 아래 항목을 표로 정리한다.

- 도메인명
- 담당 기능
- 관련 문서
- 관련 frontend
- 관련 Worker route
- 관련 DB
- UI 노출 상태
- 회귀 위험
- 다음 계획 문서

### 7.5 docs/04_IMPLEMENTED_STATUS_INDEX.md

현재 구현 상태 문서들의 인덱스를 만든다.

반드시 포함:

- DB map
- Worker route map
- frontend map
- API flow map
- UI exposure map
- hidden foundation map
- regression risk map
- auth/permission map
- deploy/smoke map

### 7.6 docs/05_WORK_PLANNING_RULE.md

앞으로 작업 계획을 세우는 규칙을 쓴다.

반드시 포함:

- 구현 전 정책 확정
- 구현 전 계획 확정
- 구현 전 세부 계획 확정
- 계획 없이 바로 구현 지시 금지
- 큰 작업 단위 선호
- 너무 작은 보정 단위 남발 금지
- 단, 회귀 위험이 큰 부분은 phase/round로 쪼개기
- 각 작업마다 업데이트해야 하는 문서 지정
- 외부 AI 검수용 문서 4개 묶음 기준
- 작업이 끝나면 해당 도메인 문서, implemented 문서, plan 문서를 업데이트해야 함

### 7.7 docs/06_CODEX_EXECUTION_RULE.md

Codex가 작업할 때 반드시 따를 실행 규칙을 쓴다.

반드시 포함:

- 작업 전 읽기 순서
- 작업 전 git 상태 확인
- 작업 범위 식별
- 수정 가능 파일과 금지 파일 구분
- 문서 작업과 코드 작업 분리
- 검수요청서 작성 금지
- CODEX_RESULT.md 작성 규칙
- git add/commit/push 금지
- 작업 후 문서 업데이트
- 작업 후 실제 변경 파일 목록 보고

### 7.8 docs/07_REVIEW_AND_REGRESSION_RULE.md

검수와 회귀 방지 규칙을 강화한다.

반드시 포함:

- 실제 파일을 열어 확인한 근거 없이는 PASS 금지
- 미확인 파일은 미검수 표시
- import/export 누락 확인
- node --check 가능성 확인
- React build 실패 가능성 확인
- undefined/null 접근 위험 확인
- SQL placeholder 개수 불일치 확인
- API 응답 구조 불일치 확인
- 권한/세션/academy_id 격리 확인
- 기존 로그인/학원 선택/session/logout 회귀 확인
- 기존 UI 문구 변경 여부 확인
- 숨겨진 foundation UI 노출 여부 확인
- 학생 포털/OMR 금지 정책 위반 확인
- 수납/출납 금액 무결성 확인
- 시간표 운영 데이터와 staging 데이터 분리 확인

### 7.9 docs/08_DOCUMENT_UPDATE_RULE.md

작업 후 어떤 문서를 업데이트해야 하는지 규칙화한다.

반드시 포함:

- route/API 변경 시 업데이트 문서
- DB 변경 시 업데이트 문서
- frontend 화면 변경 시 업데이트 문서
- UI 문구 변경 시 업데이트 문서
- 신규 foundation 추가 시 업데이트 문서
- 숨겨진 기능 UI 노출 시 업데이트 문서
- 작업 계획 변경 시 업데이트 문서
- 외부 검수 후 반영 시 업데이트 문서

---

## 8. domains 문서 작성 기준

각 도메인 문서는 단순 설명이 아니라, 앞으로 Codex가 해당 도메인을 수정하기 전에 읽고 그대로 따라갈 수 있어야 한다.

각 도메인 문서 공통 구조:

# 도메인명

## A. 정책
- 이 도메인에서 지켜야 할 정책
- 금지 사항
- 사용자 확인이 필요한 사항

## B. 현재 구현 구조
- 현재 구현된 기능
- 관련 frontend
- 관련 Worker route
- 관련 DB table
- 관련 helper
- 관련 문서
- 현재 UI 노출 상태
- 숨겨진 foundation 여부

## C. 데이터/API 흐름
- 화면 → API → route → DB → 응답 → 화면 흐름
- 인증/권한 흐름
- 세션 흐름
- 학생/반/학원/branch scope 흐름

## D. 회귀 위험
- 건드리면 깨지는 부분
- 이전에 회귀가 났거나 위험한 부분
- 검수 시 반드시 볼 부분

## E. 추가 계획
- 다음에 추가할 기능
- 아직 보류할 기능
- foundation은 있으나 UI 노출 전인 기능
- 사용자 승인 필요한 기능

## F. 작업 후 업데이트 규칙
- 이 도메인 작업 후 어떤 문서를 업데이트해야 하는지
- CODEX_RESULT에 반드시 적을 항목

각 도메인별 특수 주의사항:

### WANGJI_COMMON_DOMAIN.md

- 왕지교육 전체 운영층
- 공통 foundation
- AP Math, 씨매쓰 초등, EIE 영어학원 분리
- 학생/학부모 중복 생성 금지
- 전체 운영과 학원별 운영 분리
- branch: apmath, cmath, eie 기준

### AP_MATH_DOMAIN.md

- 기존 AP Math OS 보호
- 기존 바닐라 JS 운영 화면 유지
- 문제은행, OMR, QR, 리포트, 플래너, 출결, 숙제, 시간표 보호
- AP Math 화면을 새 SaaS 안에 다시 만들지 않고 독립 실행 가능한 하위 앱/모듈로 유지하는 방향 반영

### CLASSROOM_DOMAIN.md

- 반 화면
- 선생님 친화형 현장 사용성
- 출석부/숙제/플래너/반 학생/일지 확인 흐름
- 기존 버튼/문구/화면명 보존
- 회귀 위험이 큰 UI로 기록
- 현재 구현된 classroom 파일과 함수들을 가능한 한 구체적으로 정리

### TIMETABLE_DOMAIN.md

- 운영 데이터와 새학기 개편안 staging 데이터 분리
- timetable_version_classes / version_class_id 방향
- 운영 classes/class_students/class_time_slots/student_enrollments 직접 훼손 금지
- 시간 미정과 구분 라벨 분리
- View 버튼 과다 노출 금지
- 전체/강사별/과목별/대상별/교실별/반별/지점별 버튼 기본 노출 금지
- 중등 90분, 고등 120분
- teacher conflict 예외 기준
- student conflict 위험 기준
- room conflict 기준
- 현재 구현된 route/table/UI 정리

### BILLING_ACCOUNTING_DOMAIN.md

- 청구와 실제 돈의 흐름 분리
- payments/payment_items = 청구서
- payment_transactions = 실제 납부
- cashbook_entries = 출납 장부
- refund_records, carryover_records
- billing_runs/templates/adjustments
- 실제 결제 연동 금지
- 실제 알림톡 발송 금지
- 자동 청구 실행 금지
- 미리보기와 실제 실행 분리
- 학부모 결제 링크 보안
- internal_memo 누출 금지
- external_meta_json 처리 주의
- 금액 무결성 회귀 위험

### PARENT_CONTACT_DOMAIN.md

- parent_contacts
- message_logs
- 수신 동의
- 출결/수납/공지/리포트/상담 알림
- 실제 문자/알림톡 발송 금지
- preview와 send 분리
- 학부모 개인정보 노출 주의

### STUDENT_PORTAL_DOMAIN.md

- 학생 로그인
- PIN 보안
- 학생은 시험지 직접 열기 금지
- 배정 확인과 OMR 연결까지만 허용
- 제출 완료 후 수정 금지
- 숙제 사진 제출 흐름
- 플래너 SSO 연결
- localStorage/sessionStorage 관련 흐름 있으면 기록

### PLANNER_DOMAIN.md

- 학생 플래너
- 학생포털 SSO 보존
- PLANNER_SID / PLANNER_PIN / planner_auth_{sid} / planner_pin_{sid} 등 현재 구현이 있으면 기록
- 주간플래너/월간플래너 문구 기준
- PC 넓은 화면에서 요일별/주간별 보기 회귀 위험
- 모바일 목록 회귀 위험
- 반 화면 플래너 버튼 흐름 보존

### REPORT_AI_DOMAIN.md

- AI 리포트
- 기본 리포트를 갈아엎지 않고 개선
- 학부모 문구 금지 표현
- parentMessage 시작 문구
- teacherMemo 반영 기준
- 오답 분석 기준
- Gemini/OpenAI fallback 또는 provider 구조가 있으면 기록
- 내부 시스템 표현 학부모 문장 노출 금지
- report.js / reports-ai route 흐름 확인

### ARCHIVE_OMR_DOMAIN.md

- archive engine
- mixed engine
- check/OMR
- class_exam_assignments
- exam_blueprints
- MIXED:{key} 처리 보존
- 학생 시험지 직접 열기 금지
- OMR 제출 완료 재수정 금지
- wrong answer print / clinic print 흐름이 있으면 기록
- 문제 원문/이미지/assets 태그 관련 주의

### CLASS_DAILY_DOMAIN.md

- 수업일지
- class_textbooks
- class_daily_records
- class_daily_progress
- daily_journals
- 선생님별 범위
- 반별 진도/특이사항
- 기존 일지 문구 보존

### HOMEWORK_PHOTO_DOMAIN.md

- homework_photo_assignments
- homework_photo_submissions
- homework_photo_files
- R2 파일 흐름
- 24시간 삭제/만료 정책이 있으면 기록
- 숙제라는 UI 용어 유지
- 과제로 임의 변경 금지
- 단톡방 공유/QR/link 흐름이 있으면 기록

### STUDENTS_CLASSES_DOMAIN.md

- students
- classes
- class_students
- teacher_classes
- student_enrollments
- 재원/퇴원/휴원/대기 상태
- PIN 자동 발급
- 반 이동 이력
- 담당 선생님 권한
- 기존 학생/반 관리 UI 흐름

### OPERATIONS_CONSULTATION_DOMAIN.md

- consultations
- operation_memos
- academy_schedules
- exam_schedules
- school_exam_records
- 상담 기록
- 운영 메모
- 시험 일정
- 학원 일정
- 개인정보/내부 메모 노출 주의

### STAFF_PERMISSION_AUDIT_DOMAIN.md

- teachers
- staff_permissions
- audit_logs
- privacy_access_logs
- teacher_classes
- admin/teacher role
- 권한 범위
- 개인정보 접근 로그
- academy/branch scope

### HOMEPAGE_DOMAIN.md

- 왕지교육 홈페이지
- AP Math, 씨매쓰 초등, EIE 영어학원 외부 균형 노출
- 내부 AP Math 기능 깊이는 유지
- 홈페이지와 운영 시스템 분리
- 상담 예약/공지/로그인 방향
- 아직 구현 전이면 "계획/미구현"으로 명확히 기록

---

## 9. implemented 문서 작성 기준

### CURRENT_DB_MAP.md

schema.sql과 migrations를 기준으로 작성한다.

테이블별로 아래 항목을 표로 정리한다.

- table
- 역할
- 공통 foundation / AP Math 특화 / 학원별 확장 / 로그/감사 / 기타
- 주요 필드
- 관련 route
- 관련 frontend
- UI 노출 상태
- 회귀 위험
- 추가 계획 문서

실제 확인하지 못한 관련 route/frontend는 추측하지 말고 "확인 필요"로 쓴다.

### CURRENT_WORKER_ROUTE_MAP.md

route 파일별로 아래 항목을 정리한다.

- 파일 경로
- handler/export 이름
- 담당 API
- 인증 방식
- 관련 DB
- 관련 frontend
- initial-data 포함 여부
- 위험 포인트
- 향후 분리/정리 필요 여부

index.js는 별도 섹션으로 정리한다.

- import 목록
- route 위임 구조
- 공통 helper
- auth
- OPTIONS
- Not Found
- try/catch
- index.js에 API 본문 직접 추가 금지 원칙

### CURRENT_FRONTEND_MAP.md

frontend 파일별로 아래 항목을 정리한다.

- 파일 경로
- 화면/도메인
- 주요 함수
- 호출 API
- 관련 DB
- 주요 버튼/흐름
- UI 문구 변경 금지 여부
- 회귀 위험
- 관련 도메인 문서

특히 가능한 범위에서 아래를 구분한다.

- classroom
- timetable
- report
- planner
- student portal
- archive/check/OMR
- homework photo
- class daily
- billing/foundation UI
- operations/consultation
- students/classes

### CURRENT_API_FLOW_MAP.md

주요 기능별 API 흐름을 작성한다.

예시 형식:

기능: 학생 플래너 SSO
1. student portal login
2. session 저장
3. planner link open
4. planner auth
5. planner data load
6. feedback/save
7. 회귀 위험

기능별로 화면 → API → route → DB → 응답 → 화면 순서로 쓴다.

### CURRENT_UI_EXPOSURE_MAP.md

현재 화면에 노출된 기능과 숨겨진 foundation을 분리한다.

표 항목:

- 기능
- 현재 UI 노출 여부
- 노출 위치
- 연결 API
- foundation만 존재 여부
- 사용자 승인 필요 여부
- 노출 금지/보류 사유

### CURRENT_HIDDEN_FOUNDATION_MAP.md

DB/API는 있으나 UI에 꺼내면 안 되거나 아직 보류 중인 기능을 정리한다.

특히:

- 수납·출납 foundation
- 학부모 연락 foundation
- 직원/권한 foundation
- 원장/admin 확장 기능
- 홈페이지 관리
- 씨매쓰/EIE 확장
- 새학기 시간표 staging

### CURRENT_REGRESSION_RISK_MAP.md

회귀 위험이 큰 흐름을 정리한다.

반드시 포함:

- 로그인/session/logout
- initial-data 응답 구조
- teacher/admin 권한
- 학생/반/담당반 scope
- classroom 화면
- planner SSO
- PC/모바일 planner 보기
- student portal PIN
- OMR 제출 완료 수정 금지
- archive MIXED 처리
- report AI 문구 품질
- billing 금액 무결성
- timetable 운영/staging 분리
- UI 문구 임의 변경
- 숨겨진 foundation 노출

### CURRENT_AUTH_PERMISSION_MAP.md

인증/권한 구조를 정리한다.

- Basic Auth
- teacher/admin role
- canAccessStudent
- canAccessClass
- teacher_classes
- student PIN
- X-Student-Token
- planner auth
- student portal auth
- staff_permissions
- privacy/audit logs

### CURRENT_DEPLOY_SMOKE_MAP.md

현재 배포/검증 기준을 정리한다.

- Worker 배포 경로
- wrangler deploy
- 기본 smoke endpoint
- planner-auth-by-name 빈 값 테스트 기준
- teacher is not defined 실패 기준
- initial-data 중요도
- node --check 대상
- frontend build/test가 있으면 기록
- 문서 작업 검증 기준

---

## 10. plans 문서 작성 기준

각 plan 문서는 앞으로 추가할 계획을 "큰 방향 → phase → round → 세부 작업 → 검증 → 문서 업데이트"로 작성한다.

각 계획 문서 공통 구조:

# 계획명

## 1. 현재 상태
## 2. 최종 목표
## 3. 절대 금지/보류
## 4. Phase 구조
## 5. Phase별 작업 범위
## 6. 각 Phase의 수정 가능 파일
## 7. 각 Phase의 제외 범위
## 8. 검증 기준
## 9. 외부 검수 기준
## 10. 작업 후 업데이트 문서

중요:
- 계획은 너무 추상적으로 쓰지 않는다.
- 각 기능별로 실제 파일/route/DB와 연결한다.
- 구현이 필요한 부분과 아직 보류할 부분을 분리한다.
- 사용자 승인 필요한 UI 노출은 명확히 표시한다.

### MASTER_ROADMAP.md

전체 우선순위를 정리한다.

현재 방향 반영:

1. 문서 구조 재정비
2. 현재 구현 상태 실사
3. 회귀 위험 지도 고정
4. 시간표/수납/학부모연락/학생포털/리포트 등 도메인별 계획 보강
5. 선생님 모드와 원장/운영 모드 분리
6. 기존 AP Math 보호
7. 왕지교육 상위 OS 확장
8. 씨매쓰/EIE 확장
9. 홈페이지 구조

### TIMETABLE_NEXT_PLAN.md

반드시 반영:

- 운영 데이터와 새학기 개편안 데이터 완전 분리
- staging 구조
- 운영 class row 직접 훼손 금지
- apply 후 새 운영 class row 생성 방향
- 시간 미정/TBD와 구분 라벨 분리
- 기본 view 버튼 최소 노출
- 전체/강사별/과목별/대상별/교실별/반별/지점별 기본 노출 금지
- 사용자 확인 없는 UI 문구 확정 금지

### BILLING_ACCOUNTING_NEXT_PLAN.md

반드시 반영:

- 청구 preview
- 청구 생성
- 납부 거래
- 출납 장부
- 환불
- 이월
- 할인/감면
- 학부모 결제 링크
- 미납 안내 preview
- 실제 발송/실결제 금지 단계
- 금액 무결성 검증
- 수납/출납 UI 노출은 별도 승인

### PARENT_CONTACT_NEXT_PLAN.md

- 연락처 정리
- 수신동의
- 발송 후보 preview
- message_logs
- 실제 발송 금지
- 출결/수납/공지/리포트/상담 알림 분리

### TEACHER_MODE_NEXT_PLAN.md

- 선생님 친화형 현장 화면
- 오늘 수업 중심
- 내 반, 출석, 숙제, 진도, 플래너, 상담 기록
- 복잡한 관리 기능은 선생님 화면에서 숨김
- 기존 classroom 회귀 방지

### DIRECTOR_MODE_NEXT_PLAN.md

- 원장/운영자 화면
- 학생 종합관리 허브
- 수납/반이동/상담/학부모 연락/타임라인
- 사용자 확인 없는 대시보드 카드/문구 추가 금지
- 원장 화면은 선생님 화면과 분리

### STUDENT_PARENT_PORTAL_NEXT_PLAN.md

- 학생/학부모 포털
- 학생은 시험지 직접 열기 금지
- OMR 수정 금지
- 출결/숙제/리포트/청구/공지/상담
- AP Math 기존 학생 포털 보호

### CLASSROOM_NEXT_PLAN.md

- 반 화면
- 출석부, 숙제, 플래너, 일지, 반 학생
- 선생님이 빠르게 쓰는 구조
- 모바일/PC 회귀 방지
- 기존 문구/버튼명 보존

---

## 11. codex 문서 작성 기준

### 00_CODEX_READ_ORDER.md

작업 종류별 Codex가 읽어야 할 문서 순서를 표로 만든다.

예:

- 문서 작업
- frontend 작업
- Worker route 작업
- DB/migration 작업
- 시간표 작업
- 수납 작업
- 리포트 작업
- 학생 포털 작업
- OMR 작업
- 검수 보정 작업

각 작업마다 "최소 4개 문서"를 지정한다.

### CODEX_TASK_WRITING_RULE.md

앞으로 Codex 지시서 작성 기준을 정리한다.

반드시 포함:

- 큰 작업 단위
- 정책/계획/세부계획 먼저
- 금지 작업 압축 명시
- 검수요청서 작성 금지
- CODEX_RESULT 작성
- git add/commit/push 금지
- 문서 업데이트 포함
- 중복 금지사항 남발 대신 섹션화

### CODEX_FORBIDDEN_CHANGES.md

Codex가 절대 하면 안 되는 작업을 도메인별로 정리한다.

### CODEX_ALLOWED_CHANGE_SCOPE.md

작업 유형별 허용 범위를 정리한다.

### CODEX_RESULT_RULE.md

CODEX_RESULT.md 형식을 고정한다.

반드시 아래 구조:

# CODEX_RESULT

## 1. 생성/수정 파일
## 2. 구현 완료 또는 확인 완료
## 3. 실행 결과
## 4. 결과 요약
## 5. 다음 조치

추가로 이번 문서 작업에서는 아래도 포함하게 한다.

## 6. 실제로 읽은 기준 문서
## 7. 실제로 확인한 코드/스키마 범위
## 8. 확인하지 못한 파일 또는 미존재 파일
## 9. 추후 보강 필요 문서

### CODEX_REVIEW_CHECKLIST.md

검수 체크리스트 작성.

### CODEX_DOC_UPDATE_CHECKLIST.md

작업 후 어떤 문서를 업데이트해야 하는지 체크리스트.

### CODEX_HANDOFF_TEMPLATE.md

방 이동/인수인계용 템플릿.

---

## 12. 문서 작성 방식

문서는 길어도 된다.

단, 아래 원칙을 지킨다.

- 실제 확인한 내용과 계획/추정 내용을 분리한다.
- 확인한 파일 경로를 적는다.
- 확인하지 못한 것은 "확인 필요"로 적는다.
- 없는 기능을 있는 것처럼 쓰지 않는다.
- 기존 정책을 약화하지 않는다.
- 기존 방향을 임의로 바꾸지 않는다.
- UI 문구 후보를 임의 확정하지 않는다.
- 대시보드/원장 화면 문구는 임의로 새로 만들지 않는다.
- 기존 문구/버튼명/화면명을 바꾸지 않는다.
- 화면에 꺼내면 안 되는 foundation은 숨김/보류로 표시한다.
- 각 도메인마다 회귀 위험을 반드시 작성한다.
- 각 도메인마다 작업 후 업데이트 문서 규칙을 반드시 작성한다.
- 각 계획 문서에는 수정 가능 범위와 제외 범위를 반드시 쓴다.

---

## 13. 문서 품질 기준

이번 작업의 완료 기준은 "문서 파일을 많이 만드는 것"이 아니다.

아래 기준을 만족해야 한다.

1. 새 작업자가 docs/00_READ_ME_FIRST.md만 열어도 전체 읽기 순서를 알 수 있어야 한다.
2. 특정 기능 작업 시 어떤 문서 4개를 읽어야 하는지 알 수 있어야 한다.
3. classroom, report, timetable, billing, planner, student portal, OMR 같은 주요 도메인의 현재 구현 상태를 찾을 수 있어야 한다.
4. 현재 구현된 것과 추가 예정인 것이 분리되어 있어야 한다.
5. foundation만 있고 UI에 노출하면 안 되는 기능이 구분되어 있어야 한다.
6. 회귀 위험이 큰 흐름이 별도 문서로 정리되어 있어야 한다.
7. 작업 후 어떤 문서를 업데이트해야 하는지 명확해야 한다.
8. Codex가 앞으로 지시를 받으면 이 문서 체계 안에서 작업할 수 있어야 한다.
9. Gemini/Claude/ChatGPT 검수자에게 핵심 문서 4개만 줘도 구조를 이해할 수 있어야 한다.
10. 기존 AP Math OS 보호 원칙과 왕지교육 OS 상위 구조가 충돌하지 않게 정리되어 있어야 한다.

---

## 14. 검증 명령

문서 작업이므로 코드 검증은 필수 수정 대상이 없다.

그래도 아래를 실행해 문서 생성 상태를 확인한다.

find docs -maxdepth 3 -type f | sort

git status --short
git diff --name-only

가능하면 아래도 실행해 문서 파일 개수를 기록한다.

find docs -type f | wc -l

PowerShell 환경이 아니라 WSL/bash 기준으로 실행한다.

node --check는 코드 수정이 없으므로 필수는 아니다.
단, 실수로 JS 파일이 변경되었다면 해당 변경은 되돌리고 CODEX_RESULT.md에 기록한다.

---

## 15. CODEX_RESULT.md 작성

작업 완료 후 프로젝트 루트에 CODEX_RESULT.md를 작성한다.

반드시 아래 구조로 작성한다.

# CODEX_RESULT

## 1. 생성/수정 파일
- 새로 만든 문서
- 업데이트한 문서
- 기존 문서 중 내용 보존/흡수한 문서

## 2. 구현 완료 또는 확인 완료
- 문서 구조 재정비 완료 여부
- 최상위 정책 문서 작성 여부
- 도메인 문서 작성 여부
- 현재 구현 상태 문서 작성 여부
- 계획 문서 작성 여부
- Codex 실행 규칙 문서 작성 여부
- 문서 읽기 순서 고정 여부
- 작업 후 문서 업데이트 규칙 작성 여부

## 3. 실행 결과
- git status --short 결과
- git diff --name-only 결과
- find docs 결과 요약
- find docs -type f | wc -l 결과

## 4. 결과 요약
- 이번 문서 구조의 핵심
- 앞으로 작업자가 어떤 순서로 읽으면 되는지
- 가장 중요한 회귀 방지 장치

## 5. 다음 조치
- 사용자가 다음에 검토해야 할 문서
- 다음 구현 전 추천되는 순서
- 외부 AI 검수에 넘길 핵심 문서 묶음

## 6. 실제로 읽은 기준 문서
- 실제 존재해서 읽은 기존 룰북/로드맵/구조 문서 목록

## 7. 실제로 확인한 코드/스키마 범위
- schema.sql
- Worker index/routes/helpers
- frontend 주요 경로
- package/config
- 확인한 범위 요약

## 8. 확인하지 못한 파일 또는 미존재 파일
- 없었던 파일
- 경로가 달라 확인하지 못한 파일
- 추후 사용자가 압축 제공해야 하는 파일

## 9. 추후 보강 필요 문서
- 이번 1차 문서화에서 더 깊게 보강해야 할 도메인
- 코드 라인 단위 분석이 더 필요한 파일
- 다음 라운드 후보

---

## 16. 작업 완료 전 자기검증

완료 전 아래를 스스로 확인한다.

- 코드 파일을 수정하지 않았는가?
- DB/migration을 수정하지 않았는가?
- UI 문구를 바꾸지 않았는가?
- 기존 문서를 삭제하지 않았는가?
- 기존 정책을 약화하지 않았는가?
- docs/00_READ_ME_FIRST.md가 실제로 전체 진입점 역할을 하는가?
- 각 도메인 문서에 A/B/C/D/E/F 구조가 들어갔는가?
- implemented 문서에 현재 구현 상태가 실제 확인 기반으로 들어갔는가?
- plans 문서가 단순 아이디어가 아니라 phase/round/검증/업데이트 기준을 포함하는가?
- codex 문서가 앞으로 실행 규칙으로 쓸 수 있는가?
- CODEX_RESULT.md에 실제 읽은 파일과 미확인 파일을 구분했는가?
- git add/commit/push를 하지 않았는가?

---

## 17. 최종 지시

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라.

이전 작업 결과로 대체하지 마라.

이번 작업은 구현이 아니라 문서 구조 재정비다.

코드 수정 없이, 현재 존재하는 구조를 최대한 빠짐없이 읽고, 앞으로 모든 작업자가 순서대로 따라갈 수 있는 강한 문서 체계를 완성하라.

EOF