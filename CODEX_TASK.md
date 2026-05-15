````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
왕지교육 통합 운영 기반 배포 전 재검수 및 core.js foundation 데이터 유지 보정

## 목표
이전 작업에서 추가한 왕지교육 통합 운영 기반 DB/API가 프론트 상태 로딩 과정에서 사라지지 않도록 확인하고, 필요한 경우 `core.js`만 최소 수정한다.

이번 작업은 배포 전 검수/보정 작업이다.

## 실제 작업 기준
프로젝트 루트의 현재 폴더 구조와 구현현황 MD를 기준으로 작업한다.

주요 확인 파일:
```text
apmath/worker-backup/worker/index.js
apmath/worker-backup/worker/schema.sql
apmath/worker-backup/worker/migrations/20260515_wangji_foundation_phase1.sql
apmath/js/core.js
apmath/js/wangji-foundation.js
````

## 절대 금지

* 대시보드 카드 추가 금지
* 새 메뉴 노출 금지
* 시간표 UI 변경 금지
* 학생관리 UI 변경 금지
* 출석부 UI 변경 금지
* 원장 화면 변경 금지
* 기존 `timetable.js` 수정 금지
* 기존 Worker API 응답 필드 삭제 금지
* 기존 DB 테이블/컬럼 삭제 금지
* 학생 포털 시험지 직접 열기 기능 추가 금지
* 제출 완료 OMR 수정 기능 추가 금지

## 확인 1. Worker foundation 추가 상태 검수

`apmath/worker-backup/worker/index.js`에서 아래 항목이 실제로 존재하는지 확인한다.

```text
makeId
normalizeBranch
timeToMinutes
isTimeOverlap
safeAll
foundationSelect
foundationInsert
foundationPatch
loadFoundationInitialData
scanTimetableConflicts
```

`initial-data` 응답에 아래가 포함되는지 확인한다.

```text
...foundationData
```

확인 기준:

* admin 응답에 foundationData가 포함되어야 한다.
* teacher 응답에도 foundationData가 포함되어야 한다.
* 담당반 없는 teacher 조기 return 응답에도 foundationData가 포함되어야 한다.
* 기존 initial-data 필드는 삭제되면 안 된다.

## 확인 2. core.js foundation 배열 유지 검수

`apmath/js/core.js`에서 아래 foundation 배열이 `state.db` 초기값뿐 아니라 `loadData()` 또는 `refreshDataOnly()`에서 `state.db = { ... }`로 재구성되는 모든 구간에도 유지되는지 확인한다.

확인할 배열:

```text
student_enrollments
class_time_slots
timetable_conflict_logs
timetable_conflict_overrides
billing_templates
payments
payment_items
billing_adjustments
billing_runs
parent_contacts
message_logs
student_status_history
class_transfer_history
staff_permissions
```

문제가 있으면 다음 원칙으로만 수정한다.

```javascript
student_enrollments: data.student_enrollments || [],
class_time_slots: data.class_time_slots || [],
timetable_conflict_logs: data.timetable_conflict_logs || [],
timetable_conflict_overrides: data.timetable_conflict_overrides || [],
billing_templates: data.billing_templates || [],
payments: data.payments || [],
payment_items: data.payment_items || [],
billing_adjustments: data.billing_adjustments || [],
billing_runs: data.billing_runs || [],
parent_contacts: data.parent_contacts || [],
message_logs: data.message_logs || [],
student_status_history: data.student_status_history || [],
class_transfer_history: data.class_transfer_history || [],
staff_permissions: data.staff_permissions || [],
```

주의:

* 기존 state.db 필드는 절대 삭제하지 않는다.
* 기존 필드명은 바꾸지 않는다.
* foundation 배열만 추가 누락된 곳에 보강한다.
* 화면 렌더 함수는 건드리지 않는다.

## 확인 3. wangji-foundation.js 연결 여부 확인

`apmath/js/wangji-foundation.js`는 존재해도 된다.

다만 이번 단계에서는 `index.html`에 연결하면 안 된다.

확인:

```text
index.html에 wangji-foundation.js script 연결 없음
```

## 확인 4. SQL 중복 검수

아래 파일을 확인한다.

```text
apmath/worker-backup/worker/schema.sql
apmath/worker-backup/worker/migrations/20260515_wangji_foundation_phase1.sql
```

검수 기준:

```text
student_enrollments 생성 확인
class_time_slots 생성 확인
timetable_conflict_logs 생성 확인
timetable_conflict_overrides 생성 확인
billing_templates 생성 확인
payments 생성 확인
payment_items 생성 확인
billing_adjustments 생성 확인
billing_runs 생성 확인
parent_contacts 생성 확인
message_logs 생성 확인
student_status_history 생성 확인
class_transfer_history 생성 확인
staff_permissions 생성 확인
audit_logs 생성 확인
privacy_access_logs 생성 확인
```

금지 확인:

```text
progress 신규 테이블 생성 금지
exams_schedule 신규 테이블 생성 금지
consultations 중복 생성 금지
exam_schedules 중복 생성 금지
```

## 검증 명령

반드시 실행한다.

```bash
node --check apmath/worker-backup/worker/index.js
node --check apmath/js/core.js
node --check apmath/js/wangji-foundation.js
```

추가로 문자열 검수한다.

```bash
grep -R "wangji-foundation.js" -n apmath/index.html apmath/*.html apmath/js || true
grep -R "billing-foundation\|parent-foundation\|timetable-conflict" -n apmath/js/dashboard.js apmath/js/timetable.js apmath/js/student.js apmath/js/management.js || true
```

위 grep 결과는 신규 UI 노출이 없어야 한다.

## 배포 판단

이번 작업이 끝난 뒤 바로 배포하지 않는다.

`CODEX_RESULT.md`에 아래 중 하나로 판정한다.

```text
배포 가능: core.js foundation 배열 유지 확인 완료, node --check 통과, UI 노출 없음
배포 보류: core.js 또는 Worker에서 누락 발견
```

배포 가능 판정일 때 다음 순서를 적는다.

```text
1. D1 migration 적용
2. Worker 배포
3. 프론트 배포
4. initial-data 수동 확인
```

## 완료 보고

루트에 `CODEX_RESULT.md`를 작성한다.

형식:

```md
# CODEX_RESULT

## 1. 생성/수정 파일
- 파일 목록

## 2. 구현 완료 또는 확인 완료
- Worker foundation 확인
- core.js foundation 배열 유지 확인 또는 보정
- SQL 중복 검수
- UI 노출 없음 확인
- 배포 가능/보류 판정

## 3. 실행 결과
- node --check 결과
- grep 검수 결과
- SQL 검수 결과

## 4. 결과 요약
- 배포 전 막을 문제 여부
- 기존 화면 변화 여부
- foundation 데이터 유지 여부

## 5. 다음 조치
- 배포 가능 시 D1 migration → Worker 배포 → 프론트 배포
- 배포 보류 시 수정 필요 파일과 이유
```

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

EOF

```
```
