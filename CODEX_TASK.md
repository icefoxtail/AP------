````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
왕지교육 통합 운영 기반 2차 — 기존 반/학생/시간표 데이터 동기화 준비

## 목표
1차에서 추가한 foundation 테이블에 기존 AP Math 데이터를 동기화할 수 있는 기반을 만든다.

대상:
- 기존 `classes` → `class_time_slots`
- 기존 `class_students` → `student_enrollments`

이번 작업은 화면 노출 작업이 아니다.

## 실제 작업 기준
프로젝트 루트의 현재 폴더 구조와 구현현황 MD를 기준으로 작업한다.

주요 파일:
```text
apmath/worker-backup/worker/index.js
apmath/worker-backup/worker/schema.sql
apmath/worker-backup/worker/migrations/
apmath/js/core.js
````

## 절대 금지

* 대시보드 카드 추가 금지
* 새 메뉴 노출 금지
* 시간표 UI 변경 금지
* 학생관리 UI 변경 금지
* 출석부 UI 변경 금지
* 원장 화면 변경 금지
* `timetable.js` 수정 금지
* 기존 `classes`, `class_students` 삭제 금지
* 기존 시간표 필드 삭제 금지
* 기존 Worker API 응답 필드 삭제 금지
* 학생 포털 시험지 직접 열기 기능 추가 금지
* 제출 완료 OMR 수정 기능 추가 금지

## 허용 범위

* Worker에 admin 전용 동기화 API 추가
* 동기화 helper 함수 추가
* 동기화 결과를 저장할 로그 테이블 추가
* schema.sql 및 신규 migration 추가
* core.js는 수정하지 않는 것을 원칙으로 한다
* UI 파일 수정 금지

---

# 1. DB 추가

## 1-1. 신규 migration 추가

기존 migrations 파일명 규칙을 확인한 뒤 다음 목적의 migration을 추가한다.

권장 파일명:

```text
apmath/worker-backup/worker/migrations/20260515_wangji_foundation_phase2_sync.sql
```

## 1-2. schema.sql에도 동일 반영

`schema.sql` 하단에 동일 테이블을 추가한다.

## 1-3. 추가 테이블

### foundation_sync_logs

```sql
CREATE TABLE IF NOT EXISTS foundation_sync_logs (
  id TEXT PRIMARY KEY,
  sync_type TEXT NOT NULL,
  status TEXT DEFAULT 'success',
  dry_run INTEGER DEFAULT 0,
  inserted_count INTEGER DEFAULT 0,
  skipped_count INTEGER DEFAULT 0,
  updated_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  summary_json TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_foundation_sync_logs_type
  ON foundation_sync_logs(sync_type);

CREATE INDEX IF NOT EXISTS idx_foundation_sync_logs_created
  ON foundation_sync_logs(created_at);
```

용도:

* 어떤 동기화를 실행했는지 기록
* 실제 저장 전 preview/dry_run 결과 기록 가능
* 나중에 원장 화면에서 꺼낼 수 있게 준비

---

# 2. Worker API 추가

`apmath/worker-backup/worker/index.js`의 기존 라우팅 패턴을 유지한다.

## 2-1. 신규 리소스

```text
/api/foundation-sync
```

기존 foundation API 리소스 목록에 `foundation-sync`를 추가한다.

## 2-2. 엔드포인트

```text
GET  /api/foundation-sync/preview
POST /api/foundation-sync/run
GET  /api/foundation-sync/logs
```

권한:

```text
admin 전용
teacher 접근 금지
```

teacher 접근 시:

```json
{ "error": "Forbidden" }
```

403 반환.

---

# 3. 동기화 범위

## 3-1. class_students → student_enrollments

기존 학생-반 배정을 foundation 수강 등록으로 복사한다.

기준:

```text
class_students.class_id
class_students.student_id
classes 정보
students.status
```

생성 규칙:

```text
student_enrollments.id = makeId('enr')
student_enrollments.student_id = class_students.student_id
student_enrollments.class_id = class_students.class_id
student_enrollments.branch = 'apmath'
student_enrollments.status = students.status가 '재원'이면 'active', 아니면 'ended'
student_enrollments.start_date = NULL
student_enrollments.end_date = NULL
student_enrollments.tuition_amount = NULL
student_enrollments.memo = 'foundation sync from class_students'
```

중복 방지:

```text
같은 student_id + class_id + branch 조합이 이미 있으면 새로 만들지 않는다.
```

주의:

* 기존 `class_students`는 그대로 둔다.
* 기존 학생/반 데이터는 수정하지 않는다.
* `student_enrollments`만 추가한다.

---

## 3-2. classes → class_time_slots

기존 반 시간표 정보를 foundation 시간 슬롯으로 변환한다.

기준 필드:

```text
classes.id
classes.schedule_days
classes.day_group
classes.time_label
classes.teacher_name
```

생성 규칙:

```text
class_time_slots.id = makeId('cts')
class_time_slots.class_id = classes.id
class_time_slots.day_of_week = 변환된 요일
class_time_slots.start_time = HH:MM
class_time_slots.end_time = HH:MM
class_time_slots.room_name = NULL
class_time_slots.memo = 'foundation sync from classes.schedule_days/time_label'
```

중복 방지:

```text
같은 class_id + day_of_week + start_time + end_time 조합이 이미 있으면 새로 만들지 않는다.
```

주의:

* 기존 `classes.schedule_days`, `classes.day_group`, `classes.time_label`은 수정하지 않는다.
* 변환 불가능한 반은 건너뛰고 skipped_count에 포함한다.
* skipped 상세는 summary_json에 남긴다.

---

# 4. 요일 변환 규칙

## 4-1. 숫자 요일

아래처럼 변환한다.

```text
1 = mon
2 = tue
3 = wed
4 = thu
5 = fri
6 = sat
7 = sun
```

예:

```text
"1,3,5" → mon, wed, fri
"2,4"   → tue, thu
```

## 4-2. 한글 요일

아래처럼 변환한다.

```text
월 = mon
화 = tue
수 = wed
목 = thu
금 = fri
토 = sat
일 = sun
```

예:

```text
"월수금" → mon, wed, fri
"화목"   → tue, thu
```

## 4-3. schedule_days 우선순위

요일 추출 우선순위:

```text
1. classes.schedule_days
2. classes.day_group
3. 둘 다 없으면 skipped
```

---

# 5. 시간 변환 규칙

## 5-1. 기본 형식

`classes.time_label`에서 시작/종료 시간을 추출한다.

허용 예:

```text
"4:50~6:20"
"16:50~18:20"
"4:50-6:20"
"16:50 - 18:20"
"오후 4:50~6:20"
```

## 5-2. 12시간 표기 보정

기존 AP Math 시간표는 오후 수업이 많으므로 한 자리 시간이 들어오면 기본적으로 오후 시간으로 보정한다.

규칙:

```text
1~7시는 13~19시로 변환
8~11시는 그대로 둔다
12시는 그대로 둔다
16~23시는 그대로 둔다
```

예:

```text
4:50 → 16:50
6:20 → 18:20
7:00 → 19:00
8:00 → 08:00
16:50 → 16:50
```

단, 이 규칙이 기존 데이터와 다르면 CODEX_RESULT에 위험으로 적는다.

## 5-3. 변환 실패

아래 경우 skipped 처리한다.

```text
time_label 없음
시작/종료 분리 실패
시간 숫자 파싱 실패
start_time >= end_time
요일 없음
```

---

# 6. API 동작

## 6-1. GET /api/foundation-sync/preview

실제 DB에 insert하지 않는다.

응답 예:

```json
{
  "success": true,
  "dry_run": true,
  "enrollments": {
    "insertable": 120,
    "skipped": 5
  },
  "time_slots": {
    "insertable": 45,
    "skipped": 3
  },
  "skipped_details": []
}
```

## 6-2. POST /api/foundation-sync/run

실제로 insert한다.

요청 body:

```json
{
  "sync_enrollments": true,
  "sync_time_slots": true
}
```

body가 비어 있으면 둘 다 true로 처리한다.

응답 예:

```json
{
  "success": true,
  "dry_run": false,
  "enrollments": {
    "inserted": 120,
    "skipped": 5
  },
  "time_slots": {
    "inserted": 45,
    "skipped": 3
  },
  "log_id": "fsl_..."
}
```

## 6-3. GET /api/foundation-sync/logs

최근 로그 50개를 반환한다.

```json
{
  "success": true,
  "logs": []
}
```

---

# 7. helper 함수 추가

기존 helper 스타일에 맞춰 추가한다.

필요 helper:

```javascript
function parseFoundationDays(scheduleDays, dayGroup) {}
function parseFoundationTimeLabel(timeLabel) {}
function normalizeFoundationTimePart(value) {}
async function previewFoundationSync(env) {}
async function runFoundationSync(env, teacher, options = {}) {}
async function insertFoundationSyncLog(env, teacher, result, dryRun) {}
```

중복 함수가 이미 있으면 기존 함수 재사용.

---

# 8. 충돌 감지와 연결

이번 작업에서 `scanTimetableConflicts()`를 자동 실행하지 않는다.

다만 `student_enrollments`와 `class_time_slots`가 채워지면 기존 `/api/timetable-conflicts/scan`이 나중에 사용할 수 있어야 한다.

즉:

```text
이번 작업:
기존 데이터 → foundation 테이블 채우기

다음 작업:
충돌 scan 실행 테스트
```

---

# 9. UI 노출 금지 확인

아래 파일은 수정하지 않는다.

```text
apmath/js/dashboard.js
apmath/js/timetable.js
apmath/js/student.js
apmath/js/management.js
apmath/index.html
```

아래 문자열이 UI 파일에 새로 들어가면 안 된다.

```text
foundation-sync
student_enrollments
class_time_slots
시간표 충돌
복수 수강
수납
```

---

# 10. 검증 명령

반드시 실행한다.

```bash
node --check apmath/worker-backup/worker/index.js
node --check apmath/js/core.js
node --check apmath/js/wangji-foundation.js
```

SQL 검수:

```text
foundation_sync_logs 생성 확인
기존 테이블 삭제 없음
기존 컬럼명 변경 없음
progress 신규 생성 없음
exams_schedule 신규 생성 없음
consultations 중복 생성 없음
exam_schedules 중복 생성 없음
```

UI 노출 검수:

```bash
rg -n "foundation-sync|student_enrollments|class_time_slots|시간표 충돌|복수 수강" apmath/js/dashboard.js apmath/js/timetable.js apmath/js/student.js apmath/js/management.js apmath/index.html
```

정상 기준:

```text
매치 없음
```

---

# 11. 배포 판단

이번 작업 후 바로 배포하지 않는다.

`CODEX_RESULT.md`에 아래 중 하나로 판정한다.

```text
배포 가능: node --check 통과, SQL 검수 통과, UI 노출 없음
배포 보류: 동기화 helper 또는 Worker 라우팅 문제 발견
```

배포 가능이면 다음 순서를 적는다.

```text
1. D1 migration 적용
2. Worker 배포
3. /api/foundation-sync/preview 수동 확인
4. /api/foundation-sync/run 수동 실행 여부 결정
```

---

# 12. 완료 보고

루트에 `CODEX_RESULT.md`를 작성한다.

형식:

```md
# CODEX_RESULT

## 1. 생성/수정 파일
- 파일 목록

## 2. 구현 완료 또는 확인 완료
- foundation_sync_logs 추가
- foundation-sync API 추가
- class_students → student_enrollments preview/run 준비
- classes → class_time_slots preview/run 준비
- UI 노출 없음 확인

## 3. 실행 결과
- node --check 결과
- SQL 검수 결과
- UI 노출 검수 결과

## 4. 결과 요약
- 기존 화면 변화 없음
- 기존 데이터를 foundation 테이블로 채울 준비 완료
- 실제 run은 배포 후 수동 결정

## 5. 다음 조치
- D1 migration 적용
- Worker 배포
- preview API 확인
- run API 실행 여부 결정
- 이후 timetable-conflicts scan 테스트
```

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

EOF

```
```
