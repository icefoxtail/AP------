# CODEX_RESULT

## 1. 생성/수정 파일

- `apmath/worker-backup/worker/schema.sql` 수정
- `apmath/worker-backup/worker/index.js` 수정
- `apmath/worker-backup/worker/routes/timetable-versions.js` 생성
- `apmath/worker-backup/worker/migrations/20260518_timetable_versions_foundation.sql` 생성
- `CODEX_RESULT.md` 수정

변경하지 않은 확인 대상:

- `apmath/worker-backup/worker/routes/class-time-slots.js` 변경 없음
- `apmath/worker-backup/worker/routes/timetable-conflicts.js` 변경 없음
- `apmath/js/timetable.js` 변경 없음
- archive 변경 없음

## 2. 구현 완료 또는 확인 완료

추가 테이블:

- `timetable_versions`
- `timetable_version_slots`

추가 endpoint:

- `GET /api/timetable-versions`
- `GET /api/timetable-versions/:id`
- `POST /api/timetable-versions/ensure-active`
- `POST /api/timetable-versions/create-next-draft`
- `PATCH /api/timetable-versions/:id`
- `GET /api/timetable-versions/:id/slots`
- `POST /api/timetable-versions/:id/slots/replace-class-slots`
- `POST /api/timetable-versions/:id/scan-preview`

확인 사항:

- 모든 timetable version API는 admin only로 구현했다.
- `class_time_slots`는 active 운영 시간표로 유지하며, 이번 route에서는 복사 원본으로만 읽는다.
- 초안 slot 수정은 `timetable_version_slots`에만 수행한다.
- `classes.schedule_days/day_group/time_label`은 수정하지 않는다.
- `timetable_conflict_logs`에 preview 결과를 저장하지 않는다.
- 기존 `timetable-conflicts/scan` 동작은 변경하지 않았다.
- 운영 시간표로 activate는 구현하지 않았다.
- active version archived 처리는 구현하지 않았다.
- draft slots를 `class_time_slots`로 교체하는 기능은 구현하지 않았다.
- draft class snapshot은 구현하지 않았다.
- 새 중1반 draft class 생성은 구현하지 않았다.
- 학생 이동 후보 저장과 `student_enrollments` 변경은 구현하지 않았다.
- UI는 구현하지 않았다.
- migration 파일은 생성만 했고 적용하지 않았다.
- `wrangler deploy`는 실행하지 않았다.
- git add/commit/push는 실행하지 않았다.

## 3. 실행 결과

node check:

```text
node --check apmath/worker-backup/worker/routes/timetable-versions.js
node --check apmath/worker-backup/worker/index.js
node --check apmath/worker-backup/worker/routes/class-time-slots.js
node --check apmath/worker-backup/worker/routes/timetable-conflicts.js
```

결과:

```text
모두 통과
```

diff 확인:

```text
git diff -- apmath/worker-backup/worker/schema.sql
git diff -- apmath/worker-backup/worker/index.js
git diff -- apmath/worker-backup/worker/routes/timetable-versions.js
git diff -- apmath/worker-backup/worker/routes/class-time-slots.js
git diff -- apmath/worker-backup/worker/routes/timetable-conflicts.js
git diff -- apmath/worker-backup/worker/migrations/20260518_timetable_versions_foundation.sql
git status --short
```

확인 결과:

- `schema.sql`에는 두 신규 테이블과 인덱스만 추가했다.
- `index.js`에는 route import와 `/api/timetable-versions` 연결만 추가했다.
- `routes/timetable-versions.js`와 migration 파일은 신규 untracked 파일이라 일반 `git diff --` 출력에는 나타나지 않을 수 있다.
- `class-time-slots.js` diff 없음.
- `timetable-conflicts.js` diff 없음.

`git status --short` 결과:

```text
 M CODEX_RESULT.md
 M apmath/worker-backup/worker/index.js
 M apmath/worker-backup/worker/schema.sql
?? TIMETABLE_VERSION_AND_JANUARY_DRAFT_DESIGN.md
?? apmath/worker-backup/worker/migrations/20260518_timetable_versions_foundation.sql
?? apmath/worker-backup/worker/routes/timetable-versions.js
?? "archive/exams/types/middle/m3/..."
?? "archive/exams/types/middle/m3/..."
```

`TIMETABLE_VERSION_AND_JANUARY_DRAFT_DESIGN.md`는 직전 설계 작업 산출물이다. archive 경로의 untracked 파일들은 이번 구현에서 생성/수정하지 않았다.

로컬 API 스모크:

- 실행하지 않았다.
- 로컬 D1/auth 준비 여부를 확인하지 않았고, 배포 및 remote D1 적용은 금지 조건이라 수행하지 않았다.
- 사용자가 migration 적용 후 직접 확인 필요.

## 4. 결과 요약

시간표 버전 1차 foundation을 구현했다.

핵심 구조:

- 현재 운영 시간표는 계속 `class_time_slots` 기준으로 유지한다.
- active version이 없을 때 `ensure-active`가 현재 `class_time_slots`를 읽어 `timetable_versions`와 `timetable_version_slots`에 백업한다.
- 다음 연도 초안은 source version slots를 복사해 `draft` 상태로 만든다.
- 초안 slot 교체는 draft/scheduled version에서만 가능하다.
- 충돌 preview는 `timetable_version_slots` 기준으로 student/teacher/room 충돌을 계산하고, 운영 충돌 로그에는 저장하지 않는다.

잘못한 점/위험했던 점/보존해야 할 점:

- 보존해야 할 점: `class_time_slots`, 기존 `class-time-slots` route, 기존 `timetable-conflicts/scan`을 건드리지 않는 경계를 유지했다.
- 위험했던 점: `source_version_id`가 잘못 들어왔을 때 active version으로 fallback하면 초안 원본이 흐려질 수 있어 404 반환으로 수정했다.
- 남은 위험: apply/activate가 없으므로 active version과 실제 `class_time_slots`의 장기 동기화 정책은 2차에서 확정해야 한다.
- 남은 위험: draft class snapshot이 없으므로 새 중1반과 반 승급의 실제 같은 preview는 아직 제한적이다.

## 5. 다음 조치

- 사용자가 로컬 또는 대상 D1에 migration을 직접 적용한다.
- 인증된 admin 세션으로 신규 endpoint를 스모크 테스트한다.
- 2차에서 activate/apply flow, archived 처리, 호환 필드 동기화, draft class snapshot을 별도 설계 후 구현한다.

마지막 터미널 출력:

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```
