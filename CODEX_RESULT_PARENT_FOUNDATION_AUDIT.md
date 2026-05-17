# CODEX_RESULT_PARENT_FOUNDATION_AUDIT

## 1. 점검 파일

- `apmath/worker-backup/worker/routes/parent-foundation.js`
- `apmath/worker-backup/worker/index.js`
- `apmath/worker-backup/worker/schema.sql`
- `apmath/worker-backup/worker/migrations/20260515_wangji_foundation_phase1.sql`
- `apmath/js/management.js`
- `apmath/js/student.js`
- `apmath/js/dashboard.js`
- `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- `docs/WANGJI_OS_ROADMAP.md`
- `docs/WANGJI_OS_STRUCTURE.md`

참고: 루트의 `WANGJI_OS_ROADMAP.md`, `WANGJI_OS_STRUCTURE.md`는 없고, 실제 파일은 `docs/` 아래에 있다.

## 2. 현재 DB 구조

### `parent_contacts`

- 위치: `schema.sql`, `20260515_wangji_foundation_phase1.sql`
- 컬럼:
  - `id TEXT PRIMARY KEY`
  - `student_id TEXT NOT NULL`
  - `name TEXT`
  - `relation TEXT`
  - `phone TEXT NOT NULL`
  - `is_primary INTEGER DEFAULT 1`
  - `receive_attendance INTEGER DEFAULT 1`
  - `receive_payment INTEGER DEFAULT 1`
  - `receive_notice INTEGER DEFAULT 1`
  - `receive_report INTEGER DEFAULT 1`
  - `receive_marketing INTEGER DEFAULT 0`
  - `memo TEXT`
  - `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`
  - `updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`
- index:
  - `idx_parent_contacts_student(student_id)`
  - `idx_parent_contacts_phone(phone)`
  - `idx_parent_contacts_primary(is_primary)`

### `message_logs`

- 위치: `schema.sql`, `20260515_wangji_foundation_phase1.sql`
- 컬럼:
  - `id TEXT PRIMARY KEY`
  - `student_id TEXT`
  - `parent_contact_id TEXT`
  - `branch TEXT`
  - `message_type TEXT NOT NULL`
  - `channel TEXT NOT NULL`
  - `title TEXT`
  - `content TEXT`
  - `status TEXT DEFAULT 'pending'`
  - `provider_message_id TEXT`
  - `error_message TEXT`
  - `sent_at TEXT`
  - `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`
- index:
  - `idx_message_logs_student(student_id)`
  - `idx_message_logs_parent(parent_contact_id)`
  - `idx_message_logs_type(message_type)`
  - `idx_message_logs_status(status)`
  - `idx_message_logs_created(created_at)`

## 3. 현재 API 구조

Route: `apmath/worker-backup/worker/routes/parent-foundation.js`

- `GET /api/parent-foundation/contacts`
  - admin: `parent_contacts` 전체 조회.
  - teacher: 담당 반 학생의 `parent_contacts`만 조회.
- `POST /api/parent-foundation/contacts`
  - `canAccessStudent(...)` 통과 시 연락처 생성.
  - 저장 필드: `student_id`, `name`, `relation`, `phone`, `is_primary`, `receive_attendance`, `receive_payment`, `receive_notice`, `receive_report`, `receive_marketing`, `memo`.
- `PATCH /api/parent-foundation/contacts/:id`
  - 허용 필드만 `foundationPatch(...)`.
  - 주의: 현재 PATCH는 GET/POST처럼 `canAccessStudent` 재검사를 직접 하지 않는다.
- `DELETE /api/parent-foundation/contacts/:id`
  - phase1에서는 405, 미구현.
- `GET /api/parent-foundation/messages`
  - admin: `message_logs` 전체 조회.
  - teacher: 담당 반 학생의 `message_logs`만 조회.
- `POST /api/parent-foundation/messages`
  - `message_logs` row를 생성한다.
  - 기본값: `message_type='manual'`, `channel='log'`, `status='pending'`.
  - 실제 provider 호출은 없다.

## 4. index.js route 연결 여부

- `index.js`에서 `handleParentFoundation`을 import한다.
- foundation route 묶음에 `parent-foundation`이 포함되어 있다.
- `/api/parent-foundation/*` 요청은 `verifyAuth(...)` 후 `handleParentFoundation(...)`으로 전달된다.
- `loadFoundationInitialData(...)`가 `parent_contacts`, `message_logs`를 initial-data에 포함한다.
  - admin: 전체 `parent_contacts`, 최근 `message_logs` 1000개.
  - teacher: 담당 반 학생 범위의 `parent_contacts`, 최근 `message_logs` 500개.

## 5. 현재 프론트 연결 여부

- `apmath/js/management.js`, `apmath/js/student.js`, `apmath/js/dashboard.js`에서 `parent-foundation` 직접 호출은 검색되지 않았다.
- `student.js`는 기존 `students.parent_phone`, `guardian_relation` 기반으로 보호자 연락처를 표시/수정한다.
- `management.js`도 학생 row의 `parent_phone`, `guardian_relation`을 보여준다.
- `dashboard.js`에 학부모 연락 foundation 카드/진입점 노출은 확인되지 않았다.
- 즉, foundation API와 initial-data는 있으나 전용 UI 연결은 아직 없다.

## 6. 구현된 것

- 학부모 연락처 foundation table 존재.
- 메시지 로그 foundation table 존재.
- 수신 동의 성격의 필드 존재:
  - `receive_attendance`
  - `receive_payment`
  - `receive_notice`
  - `receive_report`
  - `receive_marketing`
- 연락처와 학생 연결은 `parent_contacts.student_id -> students.id` 구조다.
- 메시지 로그는 `student_id`, `parent_contact_id`로 학생/학부모 연락처와 연결 가능하다.
- route는 admin/teacher 범위 조회를 지원한다.
- 실제 문자/알림톡/이메일 발송 provider 호출은 없다.
- `message_logs`는 현재 실제 발송 기능이라기보다 발송 기록/foundation 로그 구조에 가깝다.

## 7. 없는 것

- 실제 문자 발송 기능 없음.
- 실제 카카오 알림톡 발송 기능 없음.
- 이메일 발송 기능 없음.
- 발송 후보 preview API 없음.
- 상담 알림 수신 동의 필드 없음.
- 재발송/실패 재시도 전용 구조 없음.
- provider별 payload, template id, recipient snapshot, consent snapshot 구조 없음.
- `message_logs.updated_at` 없음.
- `message_logs`에 예약 발송, 발송 대상 묶음, preview batch id가 없음.
- `parent_contacts`와 기존 `students.parent_phone`/`guardian_relation` 동기화 정책 없음.
- 대시보드/관리자 화면 노출 없음.

## 8. 위험 지점

- 개인정보: `parent_contacts.phone`, `message_logs.content`가 민감 정보가 될 수 있다.
- initial-data에 `parent_contacts`, `message_logs`가 포함되어 있어 payload/권한/개인정보 노출 범위를 신중히 재검토해야 한다.
- `POST /messages`는 status/provider_message_id/sent_at을 외부 body로 받을 수 있어 실제 발송 로그처럼 보이는 임의 로그 생성이 가능하다.
- `PATCH /contacts/:id`는 현재 contact id 기준 권한 재검사가 명시적으로 보이지 않는다. teacher 권한에서 타 학생 contact id를 직접 PATCH할 위험을 검토해야 한다.
- `message_logs`에는 발송 전 consent snapshot이 없어 나중에 수신 동의 변경 시 과거 발송 판단 근거가 약해질 수 있다.
- `receive_marketing`은 있지만 마케팅 발송 정책/목적 제한이 문서화되어 있지 않다.
- AP Math, 씨매쓰 초등, EIE 영어학원까지 공통으로 쓰려면 `branch`/학원 구분이 연락처에도 필요할 수 있다. 현재 `parent_contacts`에는 `branch` 컬럼이 없다.

## 9. 다음 구현 분리안

### 0단계. 읽기 전용 정리

- 현재 `parent_contacts`, `message_logs`, 기존 `students.parent_phone` 의존성 목록화.
- initial-data 포함 유지/분리 필요성 검토.
- 대시보드/관리자 노출 없이 문서와 API 계약만 정리.

### 1단계. 권한/개인정보 안정화

- `PATCH /contacts/:id` 권한 검증 보강 설계.
- `message_logs` 생성 권한과 status 입력 범위 제한 설계.
- 개인정보 접근 로그 필요 여부 검토.

### 2단계. 수신 동의 모델 정리

- 출결/수납/공지/리포트/마케팅/상담 수신 동의 기준 확정.
- 동의 변경 이력 또는 snapshot 필요 여부 확정.
- AP Math/씨매쓰/EIE 공통 기준으로 branch 또는 service scope 필요성 검토.

### 3단계. 발송 후보 preview

- 실제 발송 없이 후보 목록만 만드는 API 설계.
- 예: `POST /api/parent-foundation/message-preview`
- 입력: message_type, channel, branch, class_id, student_ids, consent type.
- 출력: 대상 학생/연락처/수신 동의/제외 사유.

### 4단계. message_logs 확장

- preview id, recipient phone snapshot, consent snapshot, template key, provider, queued_at, delivered_at, failed_at, retry_of 등을 검토.
- 이 단계도 실제 발송 없이 로그 구조만 확장.

### 5단계. UI 후보

- 대시보드 카드 노출은 금지 상태 유지.
- 먼저 관리자 숨김 모달 또는 내부 검증 페이지 후보만 설계.
- 실제 노출은 별도 승인 후 진행.

## 10. 문서 기준

- `docs/WANGJI_OS_ROADMAP.md` Phase 4는 학부모 연락 foundation 목표를 “연락처/수신동의/발송로그 구조 정리, 발송 후보 preview 가능, 실제 발송 금지”로 둔다.
- 금지 사항은 실제 카카오 알림톡 발송, 실제 문자 발송, 대시보드 UI 노출, 자동 발송 금지다.
- `docs/WANGJI_OS_STRUCTURE.md`는 `parent_contacts`, `message_logs`를 왕지교육 전체 공통 foundation으로 분류한다.
- AP Math 전용 기능으로 좁히기보다 씨매쓰 초등/EIE 영어학원까지 확장 가능한 공통 구조로 봐야 한다.

## 11. git status

`git status --short` 결과:

```text
 M docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
?? CODEX_RESULT.md
?? CODEX_RESULT_PARENT_FOUNDATION_AUDIT.md
?? CODEX_RESULT_STUDY_MATERIAL_STUDENT_EDITABLE.md
?? CORE2_INITIAL_DATA_NEXT_SPLIT_ANALYSIS.md
```

## 12. 금지 항목 준수

- 코드 수정 없음.
- DB 수정 없음.
- migration 생성 없음.
- 실제 문자 발송 없음.
- 실제 알림톡 발송 없음.
- 이메일 발송 기능 추가 없음.
- 관리자/원장 화면 노출 없음.
- 대시보드 카드 추가 없음.
- git add/commit/push 미실행.
- 배포 미실행.
