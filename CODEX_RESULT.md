# CODEX_RESULT

## 1. 생성/수정 파일
- `apmath/worker-backup/worker/index.js`
- `apmath/worker-backup/worker/routes/homework-photo.js`
- `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료
- `homework-photo` 전용 route 파일 `apmath/worker-backup/worker/routes/homework-photo.js`를 추가했다.
- `index.js`의 `homework-photo` 인라인 처리 블록을 제거하고 `handleHomeworkPhoto(request, env, null, path, url)` 위임 구조로 바꿨다.
- 기존 `homework-photo` 배정 생성 API를 route 파일로 이동했다.
- 기존 `homework-photo` 배정 수정 API를 route 파일로 이동했다.
- 기존 `homework-photo` 배정 목록 조회 API를 route 파일로 이동했다.
- 기존 `homework-photo` 개별 과제/overview/student-links 조회 API를 route 파일로 이동했다.
- 기존 `homework-photo` 학생 PIN 인증 API를 route 파일로 이동했다.
- 기존 `homework-photo` 제출 완료 API를 route 파일로 이동했다.
- 기존 `homework-photo` 제출 취소 API를 route 파일로 이동했다.
- 기존 `homework-photo` 마감(close) API를 route 파일로 이동했다.
- `homework_photo_files`는 현재 `overview` 조회 SQL의 file count 집계 흐름만 존재해 그 부분까지 같이 이동했다.
- 현재 `index.js` 기준 `homework-photo` 블록에는 별도 업로드/download/delete 분기가 보이지 않아, 실제 존재하는 기능만 그대로 분리했다.
- 학생 토큰 검증은 기존과 동일하게 `sha256hex(${student.id}:${student.student_pin}:student-portal:v1)` 비교를 유지했다.
- 제출/취소 시 `homework` 테이블 동기화와 `synced_homework_status` 갱신 로직을 그대로 유지했다.
- `students/classes/teachers`, `attendance-homework`, `exams`, `operations`, `class-daily`, `student-portal`, `reports-ai`, `check-omr`, foundation 계열 route의 문법 영향이 없음을 확인했다.
- `initial-data` 본체는 수정하지 않았다.
- UI 파일, `schema.sql`, migration, `wrangler.toml`은 이번 작업에서 수정하지 않았다.

## 3. 실행 결과
- `node --check apmath/worker-backup/worker/index.js` 통과
- `node --check apmath/worker-backup/worker/routes/homework-photo.js` 통과
- `node --check apmath/worker-backup/worker/routes/check-omr.js` 통과
- `node --check apmath/worker-backup/worker/routes/reports-ai.js` 통과
- `node --check apmath/worker-backup/worker/routes/student-portal.js` 통과
- `node --check apmath/worker-backup/worker/routes/billing-accounting-foundation.js` 통과
- `node --check apmath/worker-backup/worker/routes/class-daily.js` 통과
- `node --check apmath/worker-backup/worker/routes/operations.js` 통과
- `node --check apmath/worker-backup/worker/routes/exams.js` 통과
- `node --check apmath/worker-backup/worker/routes/attendance-homework.js` 통과
- `node --check apmath/worker-backup/worker/routes/students.js` 통과
- `node --check apmath/worker-backup/worker/routes/classes.js` 통과
- `node --check apmath/worker-backup/worker/routes/teachers.js` 통과
- `node --check apmath/worker-backup/worker/routes/enrollments.js` 통과
- `node --check apmath/worker-backup/worker/routes/class-time-slots.js` 통과
- `node --check apmath/worker-backup/worker/routes/timetable-conflicts.js` 통과
- `node --check apmath/worker-backup/worker/routes/foundation-sync.js` 통과
- `node --check apmath/worker-backup/worker/routes/billing-foundation.js` 통과
- `node --check apmath/worker-backup/worker/routes/parent-foundation.js` 통과
- `node --check apmath/worker-backup/worker/routes/foundation-logs.js` 통과
- `node --check apmath/worker-backup/worker/helpers/admin-db.js` 통과
- `node --check apmath/worker-backup/worker/helpers/response.js` 통과
- `node --check apmath/worker-backup/worker/helpers/foundation-db.js` 통과
- `node --check apmath/worker-backup/worker/helpers/branch.js` 통과
- `node --check apmath/worker-backup/worker/helpers/time.js` 통과
- `node --check apmath/js/core.js` 통과
- `node --check apmath/js/wangji-foundation.js` 통과
- `node --check apmath/js/report.js` 통과
- `rg -n "resource === 'homework-photo'|homework_photo_assignments|homework_photo_submissions|homework_photo_files" apmath/worker-backup/worker/index.js apmath/worker-backup/worker/routes/homework-photo.js` 결과:
- `index.js`에는 route 위임 `if (resource === 'homework-photo')`만 남아 있다.
- `homework_photo_assignments`, `homework_photo_submissions`, `homework_photo_files` SQL 참조는 `routes/homework-photo.js`로 이동했다.
- `git diff --name-only -- apmath/worker-backup/worker/index.js apmath/worker-backup/worker/routes/homework-photo.js CODEX_RESULT.md` 결과:
- `apmath/worker-backup/worker/index.js`
- `apmath/worker-backup/worker/routes/homework-photo.js`
- `git diff --name-only` 전체 결과는 저장소 전반에 기존 dirty 파일이 매우 많다.
- `git status --short -- apmath/student/index.html apmath/js/report.js apmath/js/dashboard.js apmath/js/timetable.js apmath/js/student.js apmath/js/management.js apmath/js/core.js apmath/index.html apmath/worker-backup/worker/schema.sql wrangler.toml apmath/worker-backup/worker/migrations` 결과상 금지 대상 파일들에 기존 수정 흔적은 존재한다.
- 다만 이번 작업에서 새로 수정한 파일은 `index.js`, `routes/homework-photo.js`, `CODEX_RESULT.md`뿐이다.
- `apmath/student/index.html`은 해당 상태 확인에서 출력이 없어 이번 작업 기준 수정되지 않았다.

## 4. 결과 요약
- `index.js`에서 `homework-photo` 인라인 로직 약 1개 큰 블록을 제거하고 전용 route로 분리해 비대화를 줄였다.
- 이번 단계에서 분리된 route는 `routes/homework-photo.js` 하나다.
- 실제 현재 코드 기준 `homework-photo` 기능은 배정/수정/목록/overview/student-links/학생인증/제출/취소/마감으로 확인됐고, 그 범위를 그대로 이동했다.
- 학생 토큰 검증, 숙제 완료 동기화, `homework_photo_files` 집계 조회, 권한 검증 흐름은 유지됐다.
- 문법 검증은 모두 통과했다.
- 저장소 전체는 기존 dirty 상태라 금지 대상 파일 변경 흔적이 보이지만, 이번 작업 자체는 금지 파일을 수정하지 않았다.
- 배포 가능. 단, 배포 전후에는 `homework-photo` 실제 엔드포인트와 UI 흐름을 수동 smoke test로 확인해야 한다.

## 5. 다음 조치
- Worker 배포
- `homework-photo` smoke test
- 숙제사진 UI 수동 확인
- 기존 route smoke test
- 정상 확인 후 커밋/푸시
- 이후 남은 `index.js` 정리 범위 재평가
