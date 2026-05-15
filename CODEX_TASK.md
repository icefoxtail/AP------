````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
Worker foundation route/helper 분리 1단계

## 목표
`apmath/worker-backup/worker/index.js`가 5000줄 이상으로 커지고 있으므로, 최근 추가한 왕지교육 foundation 계열 API와 helper를 기능별 파일로 분리한다.

이번 작업의 목표는 “기능 추가”가 아니라 “구조 정리”다.

핵심:
- 기존 AP Math 핵심 API는 건드리지 않는다.
- 최근 추가한 foundation API만 routes/helpers로 분리한다.
- 기존 동작은 그대로 유지한다.
- UI는 절대 수정하지 않는다.
- DB migration은 추가하지 않는다.
- 배포 전 node 문법 검사를 반드시 통과시킨다.

## 실제 작업 기준
프로젝트 루트의 현재 폴더 구조와 구현현황 MD를 기준으로 작업한다.

주요 파일:
- `apmath/worker-backup/worker/index.js`
- `apmath/worker-backup/worker/schema.sql`
- `apmath/worker-backup/worker/migrations/`
- `docs/WANGJI_OS_STRUCTURE.md`
- `docs/WANGJI_OS_ROADMAP.md`
- `CODEX_RESULT.md`

## 절대 금지
- 기존 AP Math 핵심 API 전면 분리 금지
- `index.js` 전체 재작성 금지
- 기존 `initial-data` 응답 구조 변경 금지
- 기존 API 응답 필드 삭제 금지
- 기존 DB 테이블/컬럼 변경 금지
- DB migration 추가 금지
- schema.sql 수정 금지
- UI 파일 수정 금지
- `dashboard.js` 수정 금지
- `timetable.js` 수정 금지
- `student.js` 수정 금지
- `management.js` 수정 금지
- `core.js` 수정 금지
- 학생 포털 시험지 직접 열기 기능 추가 금지
- 제출 완료 OMR 수정 기능 추가 금지
- `/api/foundation-sync/run` 실행 금지
- `/api/timetable-conflicts/scan` 실행 금지
- 실제 수납/결제/알림 발송 기능 추가 금지

## 허용 범위
- Worker 내부 파일 구조 추가
- `routes/` 폴더 추가
- `helpers/` 폴더 추가
- 최근 추가된 foundation 계열 API를 route 파일로 이동
- 최근 추가된 foundation 계열 helper를 helper 파일로 이동
- `index.js`에서 해당 route로 위임하도록 최소 수정
- CommonJS 또는 ES Module 방식은 현재 Worker 환경에 맞춰 선택
- CODEX_RESULT.md 작성

---

## 1. 분리 대상과 비대상

## 1-1. 분리 대상

최근 추가된 왕지교육 foundation 계열만 분리한다.

대상 API:
- `/api/enrollments`
- `/api/class-time-slots`
- `/api/timetable-conflicts`
- `/api/timetable-conflict-overrides`
- `/api/foundation-sync`
- `/api/billing-foundation`
- `/api/parent-foundation`
- `/api/foundation-logs`

대상 helper:
- `makeId`
- `normalizeBranch`
- `safeAll`
- foundation 조회/삽입/수정 helper
- time slot/time overlap helper
- foundation-sync 시간표 파서 helper
- timetable conflict helper
- 가능하면 audit helper

단, 기존 index.js 안에서 다른 레거시 API가 이미 사용하는 helper라면 이동 후 import/export 연결을 정확히 유지해야 한다.

## 1-2. 비대상

이번 작업에서 아래는 분리하지 않는다.

- 기존 학생 API
- 기존 반 API
- 기존 출석 API
- 기존 과제 API
- 기존 시험/성적 API
- 기존 OMR/QR API
- 기존 리포트 API
- 기존 daily/classroom API
- 기존 homework photo API
- 기존 AP Math 대시보드 데이터 API
- 기존 학생 포털 API
- 기존 archive 관련 API
- 기존 `initial-data` 본체 로직 전체

비대상은 건드리지 말고, 기존처럼 `index.js`에 둔다.

---

## 2. 목표 폴더 구조

아래 구조를 만든다.

```text
apmath/worker-backup/worker/
├─ index.js
├─ routes/
│  ├─ enrollments.js
│  ├─ class-time-slots.js
│  ├─ timetable-conflicts.js
│  ├─ foundation-sync.js
│  ├─ billing-foundation.js
│  ├─ parent-foundation.js
│  └─ foundation-logs.js
├─ helpers/
│  ├─ response.js
│  ├─ foundation-db.js
│  ├─ branch.js
│  ├─ time.js
│  └─ audit.js
└─ migrations/
````

`billing-accounting-foundation.js`는 이번 작업에서 만들지 않는다.
다음 단계인 수납·출납 foundation 0단계에서 추가한다.

---

## 3. index.js 역할

분리 후 `index.js`는 아래 역할만 유지한다.

* Worker fetch 진입점
* CORS 처리
* 인증 처리
* 기존 레거시 AP Math API 처리
* foundation route 위임

예상 구조:

```javascript
import { handleEnrollments } from './routes/enrollments.js';
import { handleClassTimeSlots } from './routes/class-time-slots.js';
import { handleTimetableConflicts } from './routes/timetable-conflicts.js';
import { handleFoundationSync } from './routes/foundation-sync.js';
import { handleBillingFoundation } from './routes/billing-foundation.js';
import { handleParentFoundation } from './routes/parent-foundation.js';
import { handleFoundationLogs } from './routes/foundation-logs.js';
```

단, 현재 Worker가 ES Module 방식이 아닐 경우 기존 환경에 맞춰 처리한다.
wrangler 환경에서 import가 가능하면 ES Module 방식으로 진행한다.

라우팅 예시:

```javascript
if (resource === 'enrollments') {
  return handleEnrollments(request, env, teacher, path, url);
}

if (resource === 'class-time-slots') {
  return handleClassTimeSlots(request, env, teacher, path, url);
}

if (resource === 'timetable-conflicts') {
  return handleTimetableConflicts(request, env, teacher, path, url);
}

if (resource === 'timetable-conflict-overrides') {
  return handleTimetableConflicts(request, env, teacher, path, url);
}

if (resource === 'foundation-sync') {
  return handleFoundationSync(request, env, teacher, path, url);
}

if (resource === 'billing-foundation') {
  return handleBillingFoundation(request, env, teacher, path, url);
}

if (resource === 'parent-foundation') {
  return handleParentFoundation(request, env, teacher, path, url);
}

if (resource === 'foundation-logs') {
  return handleFoundationLogs(request, env, teacher, path, url);
}
```

기존 라우팅 패턴과 다르면 기존 패턴을 따른다.

---

## 4. route 파일별 책임

## 4-1. routes/enrollments.js

담당:

* `/api/enrollments`

포함 기능:

* GET
* POST
* PATCH
* DELETE 또는 status='ended' 처리

주의:

* 기존 동작 유지
* teacher 권한 처리 유지
* 물리 삭제 대신 ended 처리 기존 원칙 유지

## 4-2. routes/class-time-slots.js

담당:

* `/api/class-time-slots`

포함 기능:

* GET
* POST
* PATCH
* DELETE

주의:

* 기존 `classes.schedule_days`, `classes.time_label` 수정 금지
* `class_time_slots`만 다룬다

## 4-3. routes/timetable-conflicts.js

담당:

* `/api/timetable-conflicts`
* `/api/timetable-conflict-overrides`

포함 기능:

* GET /api/timetable-conflicts
* POST /api/timetable-conflicts/scan
* PATCH /api/timetable-conflicts/:id
* GET /api/timetable-conflict-overrides
* POST /api/timetable-conflict-overrides
* DELETE /api/timetable-conflict-overrides/:id

반드시 유지할 것:

* student 충돌은 위험으로 유지
* room 충돌은 위험으로 유지
* 중등 금요일 teacher 충돌은 ignored 처리
* 고등 teacher 충돌은 ignored 처리
* scan 응답에 `ignored_teacher_conflicts`, `ignored_teacher_count` 유지
* 기존 `count`, `conflicts`, `success` 유지

## 4-4. routes/foundation-sync.js

담당:

* `/api/foundation-sync`

포함 기능:

* GET /preview
* POST /run
* GET /logs

반드시 유지할 것:

* 기본 run에서 sync_time_slots는 명시적으로 true일 때만 실행
* 빈 body 기본값은 sync_enrollments=true, sync_time_slots=false
* `/run`을 작업 중 실행하지 않는다
* AP Math 중등/고등 duration 규칙 유지

  * 중등 시작시간+90분
  * 고등 시작시간+120분
* 0=sun 요일 규칙 유지
* time_label 요일별 시작시간형 처리 유지

## 4-5. routes/billing-foundation.js

담당:

* `/api/billing-foundation`

포함 기능:

* templates
* payments
* runs

주의:

* 기존 foundation 1차에서 만든 최소 API 유지
* 실제 결제/알림/자동청구 없음

## 4-6. routes/parent-foundation.js

담당:

* `/api/parent-foundation`

포함 기능:

* contacts
* messages

주의:

* 실제 문자/알림톡 발송 없음
* message_logs 기록만 가능
* 연락처 DELETE 미구현이면 405 유지

## 4-7. routes/foundation-logs.js

담당:

* `/api/foundation-logs`

포함 기능:

* status-history
* class-transfers
* audit
* privacy

주의:

* audit/privacy는 admin 전용 유지

---

## 5. helper 파일별 책임

## 5-1. helpers/response.js

포함 가능:

* json 응답 helper
* error 응답 helper
* 공통 headers 재사용 helper

단, 기존 index.js의 headers 상수가 필요하면 충돌 없이 export/import한다.

## 5-2. helpers/foundation-db.js

포함 가능:

* safeAll
* foundationSelect
* foundationInsert
* foundationPatch
* foundation delete/status helper
* table allowlist

주의:

* SQL injection 방지를 위해 table name은 allowlist 기반만 허용한다.
* 외부 입력 table명을 그대로 SQL 문자열에 넣지 않는다.

## 5-3. helpers/branch.js

포함 가능:

* normalizeBranch

branch 고정:

* apmath
* cmath
* eie

## 5-4. helpers/time.js

포함 가능:

* timeToMinutes
* isTimeOverlap
* normalizeFoundationHour
* formatFoundationTime
* normalizeFoundationTimeRange
* normalizeFoundationTimePart
* parseFoundationTimeLabel
* getMathLessonDurationMinutes
* addMinutesToTime
* parseDaysFromText
* parseLabeledTimeSegments

반드시 유지:

* 중등 수학 90분
* 고등 수학 120분
* 시작시간은 time_label 기준
* 1~11시는 오후 보정
* 0=sun 처리

## 5-5. helpers/audit.js

포함 가능:

* audit_logs 기록 helper

복잡하면 이번 단계에서는 파일만 만들지 않아도 된다.
단, 기존 코드에 audit helper가 이미 있으면 중복 생성하지 않는다.

---

## 6. export/import 방식

현재 Worker 환경에서 `index.js`가 ES Module 형태로 동작하는지 확인한다.

wrangler Worker에서 module syntax가 가능하면 다음 방식 사용:

```javascript
export async function handleEnrollments(...) {}
import { handleEnrollments } from './routes/enrollments.js';
```

만약 현재 환경이 module syntax와 충돌하면, Cloudflare Worker 방식에 맞게 최소 변경한다.

중요:

* `node --check`가 반드시 통과해야 한다.
* wrangler deploy가 가능한 구조여야 한다.
* import 경로는 상대경로를 정확히 사용한다.

---

## 7. initial-data 처리

이번 작업에서 `initial-data` 본체를 route로 분리하지 않는다.

단, `initial-data`가 사용하는 foundation safe 조회 helper가 이동된 경우 import를 정확히 연결한다.

반드시 유지할 배열:

* student_enrollments
* class_time_slots
* timetable_conflict_logs
* timetable_conflict_overrides
* billing_templates
* payments
* payment_items
* billing_adjustments
* billing_runs
* parent_contacts
* message_logs
* student_status_history
* class_transfer_history
* staff_permissions

기존 initial-data 필드는 삭제하지 않는다.

---

## 8. 검증 명령

반드시 실행한다.

```bash
node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/enrollments.js
node --check apmath/worker-backup/worker/routes/class-time-slots.js
node --check apmath/worker-backup/worker/routes/timetable-conflicts.js
node --check apmath/worker-backup/worker/routes/foundation-sync.js
node --check apmath/worker-backup/worker/routes/billing-foundation.js
node --check apmath/worker-backup/worker/routes/parent-foundation.js
node --check apmath/worker-backup/worker/routes/foundation-logs.js
node --check apmath/worker-backup/worker/helpers/response.js
node --check apmath/worker-backup/worker/helpers/foundation-db.js
node --check apmath/worker-backup/worker/helpers/branch.js
node --check apmath/worker-backup/worker/helpers/time.js
```

만약 선택적으로 `helpers/audit.js`를 만들었다면 이것도 검사한다.

```bash
node --check apmath/worker-backup/worker/helpers/audit.js
```

기존 프론트는 수정하지 않아야 하지만 안전 확인:

```bash
node --check apmath/js/core.js
node --check apmath/js/wangji-foundation.js
```

변경 파일 확인:

```bash
git diff --name-only
```

정상 변경 파일:

* `apmath/worker-backup/worker/index.js`
* `apmath/worker-backup/worker/routes/*.js`
* `apmath/worker-backup/worker/helpers/*.js`
* `CODEX_RESULT.md`
* `CODEX_TASK.md`는 현재 지시 파일 갱신 때문에 포함될 수 있음

아래 파일이 변경되면 실패:

* `apmath/js/dashboard.js`
* `apmath/js/timetable.js`
* `apmath/js/student.js`
* `apmath/js/management.js`
* `apmath/js/core.js`
* `apmath/index.html`
* `apmath/worker-backup/worker/schema.sql`
* `apmath/worker-backup/worker/migrations/*`

---

## 9. 배포 후 수동 확인 항목

이번 작업에서는 배포하지 않는다.
CODEX_RESULT.md에는 배포 가능 여부만 적는다.

배포 후 확인할 항목은 다음과 같이 적는다.

### 9-1. initial-data 확인

* 기존 AP Math 로그인 정상
* 대시보드 정상
* initial-data 응답 깨짐 없음

### 9-2. foundation-sync preview 확인

* `/api/foundation-sync/preview`
* enrollments insertable/skipped 정상
* time_slots insertable/skipped 정상

### 9-3. timetable-conflicts scan 확인

* `/api/timetable-conflicts/scan`
* count = 0
* ignored_teacher_count = 13 예상

### 9-4. foundation route smoke test

아래 GET이 500 없이 응답해야 한다.

* `/api/enrollments`
* `/api/class-time-slots`
* `/api/timetable-conflicts`
* `/api/timetable-conflict-overrides`
* `/api/billing-foundation/templates`
* `/api/parent-foundation/contacts`
* `/api/foundation-logs/audit`

---

## 10. 배포 판단

CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:

* 모든 node --check 통과
* index.js route 위임 정상
* foundation API 분리 완료
* 기존 initial-data 구조 유지
* UI 파일 변경 없음
* DB/schema/migration 변경 없음

배포 보류:

* node --check 실패
* import/export 오류 가능성 있음
* 기존 initial-data 구조 변경 있음
* UI 파일 변경 있음
* schema/migration 변경 있음
* foundation API 일부 누락 있음

---

## 11. 완료 보고

루트에 `CODEX_RESULT.md`를 작성한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일

* 파일 목록

## 2. 구현 완료 또는 확인 완료

* routes 폴더 추가
* helpers 폴더 추가
* enrollments route 분리
* class-time-slots route 분리
* timetable-conflicts route 분리
* foundation-sync route 분리
* billing-foundation route 분리
* parent-foundation route 분리
* foundation-logs route 분리
* 공통 helper 분리
* index.js route 위임 구조 반영
* 기존 AP Math API 유지 확인
* initial-data 구조 유지 확인
* UI 파일 변경 없음 확인
* schema/migration 변경 없음 확인

## 3. 실행 결과

* node --check 결과
* git diff --name-only 결과
* UI 파일 변경 여부
* schema/migration 변경 여부

## 4. 결과 요약

* index.js 감소/정리 효과
* 분리된 route 목록
* 기존 기능 영향 여부
* 배포 가능 여부

## 5. 다음 조치

* Worker 배포
* initial-data 확인
* foundation-sync preview 확인
* timetable-conflicts scan 확인
* foundation route smoke test
* 이후 수납·출납 foundation 0단계 진행

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
