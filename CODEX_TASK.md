cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md

## 작업명
왕지교육 통합 운영 기반 2차-3 — 시간표 teacher 충돌 예외 처리 규칙 반영

## 목표
`/api/timetable-conflicts/scan`에서 AP Math 운영상 정상인 teacher 충돌을 위험 충돌로 보지 않도록 보정한다.

현재 확인된 운영 기준:
- 중등 금요일 teacher 충돌은 합반/클리닉/격주/특수 운영 예외다.
- 고등 teacher 충돌은 겹치는 시간 합반 운영 예외다.
- student 충돌은 계속 위험으로 유지한다.
- room 충돌은 교실 정보 입력 후 별도 판단한다.

이번 작업은 충돌 스캔 로직 보정 작업이다.
UI에는 아무것도 노출하지 않는다.

## 실제 작업 기준
프로젝트 루트의 현재 폴더 구조와 구현현황 MD를 기준으로 작업한다.

주요 파일:
- `apmath/worker-backup/worker/index.js`
- `CODEX_RESULT.md`

## 절대 금지
- 대시보드 카드 추가 금지
- 새 메뉴 노출 금지
- 시간표 UI 변경 금지
- 학생관리 UI 변경 금지
- 출석부 UI 변경 금지
- 원장 화면 변경 금지
- `timetable.js` 수정 금지
- `core.js` 수정 금지
- DB migration 추가 금지
- schema.sql 수정 금지
- 기존 데이터 수정 금지
- `class_time_slots` 삭제/수정 금지
- `student_enrollments` 삭제/수정 금지
- `/api/foundation-sync/run` 실행 금지

## 허용 범위
- `apmath/worker-backup/worker/index.js`의 `scanTimetableConflicts` 관련 helper만 최소 수정
- teacher 충돌 예외 판단 helper 추가
- `/api/timetable-conflicts/scan` 응답 보정
- 기존 open teacher conflict 로그를 정리하는 admin 전용 보조 로직은 선택 가능
- CODEX_RESULT.md 작성

---

## 1. 현재 상황

수강 등록 동기화 완료:
- enrollments insert 완료
- preview 기준 insertable 0 / skipped 138

시간표 슬롯 동기화 완료:
- class_time_slots insert 완료
- preview 기준 insertable 0 / skipped 76

충돌 스캔 결과:
- 총 13개
- 전부 teacher 충돌
- student 충돌 없음
- room 충돌 없음

운영 판정:
- teacher 충돌 13개는 현재 AP Math 운영상 정상 예외다.
- 실제 위험 충돌은 현재 없음으로 봐야 한다.

---

## 2. 충돌 처리 기준

## 2-1. student 충돌
student 충돌은 항상 위험으로 유지한다.

처리:
- conflict_type = student
- severity = warning 또는 danger
- status = open
- logs에 기록

절대 예외 처리하지 않는다.

## 2-2. room 충돌
room 충돌은 room_name이 있을 때만 판단한다.

처리:
- conflict_type = room
- severity = warning
- status = open
- logs에 기록

현재 room_name이 없으면 거의 안 나오는 게 정상이다.

## 2-3. teacher 충돌
teacher 충돌은 AP Math 운영 규칙상 아래처럼 처리한다.

중등 teacher 충돌:
- grade가 중1/중2/중3인 반끼리
- day_of_week = fri
- 같은 선생님
- 겹치는 시간
- 운영상 합반/클리닉/격주/특수 운영 예외
- 위험 로그로 남기지 않는다.
- 필요하면 scan 응답의 ignored_teacher_conflicts에만 포함한다.

고등 teacher 충돌:
- grade가 고1/고2/고3인 반끼리
- 같은 선생님
- 겹치는 시간
- 운영상 합반 운영 예외
- 위험 로그로 남기지 않는다.
- 필요하면 scan 응답의 ignored_teacher_conflicts에만 포함한다.

중등/고등이 섞인 teacher 충돌:
- 1차에서는 위험으로 유지한다.
- 단, 실제 운영 예외로 확인되기 전까지 open으로 남긴다.

---

## 3. 구현 요구사항

## 3-1. classMap 정보 확장

현재 `scanTimetableConflicts(env)`에서 classes를 조회할 때 아래 정보가 필요하다.

기존:
- id
- teacher_name

필요:
- id
- name
- grade
- teacher_name
- subject
- day_group
- schedule_days
- time_label

classes 조회 SQL을 확장한다.

예:
SELECT id, name, grade, subject, teacher_name, day_group, schedule_days, time_label FROM classes

## 3-2. grade helper 추가

아래 helper를 추가한다.

function isMiddleGrade(grade) {
  return /^중[123]/.test(String(grade || '').trim());
}

function isHighGrade(grade) {
  return /^고[123]/.test(String(grade || '').trim());
}

function getClassGradeType(cls) {
  if (isMiddleGrade(cls?.grade)) return 'middle';
  if (isHighGrade(cls?.grade)) return 'high';
  return 'unknown';
}

## 3-3. teacher 충돌 예외 helper 추가

아래 개념의 helper를 추가한다.

function getTeacherConflictExceptionReason(classA, classB, dayOfWeek) {
  const aType = getClassGradeType(classA);
  const bType = getClassGradeType(classB);

  if (aType === 'middle' && bType === 'middle' && dayOfWeek === 'fri') {
    return 'middle_friday_combined_or_clinic';
  }

  if (aType === 'high' && bType === 'high') {
    return 'high_combined_class';
  }

  return '';
}

또는 동일 의미로 구현해도 된다.

## 3-4. scanTimetableConflicts 수정

teacher 충돌 생성 전 예외 여부를 판단한다.

현재 형태가 대략 아래라면:

if (teacherA && teacherA === teacherB) {
  pushConflict(conflicts, 'teacher', teacherA, a.class_id, b.class_id, '', a.day_of_week, range.start, range.end);
}

아래처럼 바꾼다.

const classA = classMap.get(a.class_id);
const classB = classMap.get(b.class_id);

if (teacherA && teacherA === teacherB) {
  const exceptionReason = getTeacherConflictExceptionReason(classA, classB, a.day_of_week);

  if (exceptionReason) {
    ignoredTeacherConflicts.push({
      conflict_type: 'teacher',
      target_id: teacherA,
      class_a_id: a.class_id,
      class_b_id: b.class_id,
      day_of_week: a.day_of_week,
      overlap_start: range.start,
      overlap_end: range.end,
      severity: 'info',
      status: 'ignored',
      reason: exceptionReason
    });
  } else {
    pushConflict(conflicts, 'teacher', teacherA, a.class_id, b.class_id, '', a.day_of_week, range.start, range.end);
  }
}

주의:
- ignoredTeacherConflicts는 위험 conflicts 배열에 넣지 않는다.
- student 충돌에는 적용하지 않는다.
- room 충돌에는 적용하지 않는다.

## 3-5. scan 응답 보강

`POST /api/timetable-conflicts/scan` 응답에 아래를 추가한다.

기존:
{
  success: true,
  conflicts,
  count
}

보강:
{
  success: true,
  conflicts,
  count,
  ignored_teacher_conflicts,
  ignored_teacher_count
}

기존 필드는 유지한다.

정상 기대:
- count = 0
- conflicts = []
- ignored_teacher_count = 13
- ignored_teacher_conflicts에 기존 teacher 충돌 13개가 들어감

## 3-6. 기존 open teacher logs 정리

기존 scan 실행으로 `timetable_conflict_logs`에 teacher open 로그가 이미 들어가 있을 수 있다.

선택 구현:
- scan 실행 시 예외 처리 대상 teacher conflict와 동일한 key의 기존 open 로그가 있으면 status='ignored', severity='info', memo에 exception reason을 남긴다.

단, 구현이 복잡하면 하지 않아도 된다.
그 경우 CODEX_RESULT.md에 다음처럼 적는다.

"기존 open teacher conflict logs 정리는 별도 phase로 남김."

주의:
- student/room 로그는 절대 ignored 처리하지 않는다.

---

## 4. 기대 결과

수정 후 `/api/timetable-conflicts/scan` 실행 시 기대:

현재 AP Math 데이터 기준:
- student 충돌 0
- room 충돌 0
- teacher 위험 충돌 0
- ignored teacher 충돌 13

즉:
- count = 0
- conflicts = []
- ignored_teacher_count = 13

다만 중등/고등이 섞인 teacher 충돌이 있으면 count에 남아도 된다.

---

## 5. 검증 명령

반드시 실행한다.

node --check apmath/worker-backup/worker/index.js

변경 파일 확인:

git diff --name-only

정상 기준:
- apmath/worker-backup/worker/index.js
- CODEX_RESULT.md
- CODEX_TASK.md는 현재 지시 파일 갱신 때문에 포함될 수 있음

UI 파일이 나오면 실패다.

---

## 6. 수동 API 테스트

배포 전 로컬에서는 node --check까지만 한다.

배포 후 아래를 실행한다.

Invoke-RestMethod `
  -Uri "https://ap-math-os-v2612.js-pdf.workers.dev/api/timetable-conflicts/scan" `
  -Headers @{ Authorization = "Basic $basic" } `
  -Method POST

확인:
- count
- conflicts
- ignored_teacher_count
- ignored_teacher_conflicts

---

## 7. 배포 판단

CODEX_RESULT.md에 아래 중 하나로 판정한다.

배포 가능:
- node --check 통과
- teacher 예외 helper 구현 완료
- student/room 충돌은 기존처럼 유지
- UI 파일 변경 없음

배포 보류:
- node --check 실패
- student 충돌까지 예외 처리되는 오류 있음
- room 충돌까지 예외 처리되는 오류 있음
- UI 파일 변경 있음

---

## 8. 완료 보고

루트에 `CODEX_RESULT.md`를 작성한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
- 파일 목록

## 2. 구현 완료 또는 확인 완료
- teacher 충돌 예외 기준 추가
- 중등 금요일 teacher 충돌 예외 처리
- 고등 teacher 충돌 합반 예외 처리
- student 충돌 유지 확인
- room 충돌 유지 확인
- scan 응답 보강
- 기존 open log 정리 여부
- UI 파일 변경 없음 확인

## 3. 실행 결과
- node --check 결과
- git diff --name-only 결과

## 4. 결과 요약
- 실제 위험 충돌 판단 기준
- 현재 teacher 충돌 처리 방식
- 배포 가능 여부

## 5. 다음 조치
- Worker 배포
- /api/timetable-conflicts/scan 재확인
- count / ignored_teacher_count 확인
- 이후 room_name 입력 설계 또는 통합 시간표 UI 설계

터미널 마지막 출력은 반드시 아래 한 줄로 끝낸다.

CODEX_RESULT.md에 완료 보고를 저장했습니다.

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF