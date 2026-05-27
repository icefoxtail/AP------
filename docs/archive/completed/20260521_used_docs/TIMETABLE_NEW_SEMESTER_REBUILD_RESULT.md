# TIMETABLE_NEW_SEMESTER_REBUILD_RESULT

## 1. 생성/수정 파일

- 수정: `apmath/js/timetable.js`
- 확인/동봉: `apmath/worker-backup/worker/routes/timetable-versions.js`
- 확인/동봉: `apmath/worker-backup/worker/migrations/20260520_timetable_version_student_assignments.sql`

## 2. 구현 완료 또는 확인 완료

- 복구된 최신 `timetable.js` UI를 기준으로 새학기 기능만 재삽입했다.
- 기존 시간표 상단 구조, `개편시간표`, `운영 시간표로 이동`, `충돌 확인` 문구를 보존했다.
- 새학기/개편안 화면 상단에 작은 적용일 달력과 저장 버튼을 추가했다.
- 1월 자동 적용 없이 사용자가 `운영 시간표 적용`을 눌러야 실제 운영 반영이 진행되도록 했다.
- 새학기/개편안에서 빈 칸 `+ 반 추가`를 허용했다.
- 새학기/개편안에서 만든 반은 draft route를 통해 먼저 비활성 반으로 생성하고 version slot에만 배치한다.
- 새학기/개편안에서 기존 학생 1명 드래그 배치를 지원한다.
- 학생 드래그와 반 카드 드래그가 겹치지 않도록 학생 drag payload와 반 drag payload를 분리했다.
- 학생 dragstart에서 이벤트 전파를 차단해 학생 1명 드래그 시 반 전체가 이동되는 회귀를 방지했다.
- 새학기/개편안에서 빈 학생 칸의 `+`로 신규 학생을 추가하고 version assignment에 staging 저장한다.
- 적용 전에는 운영 `class_students`, `student_enrollments`, `class_time_slots`를 즉시 변경하지 않는다.
- 적용 후에는 `timetable-versions.js`의 activate route가 운영 데이터로 반영하는 구조를 사용한다.
- 12월 + 다음 해 개편안에서 기존 운영 중3 반은 렌더링 목록에서 제외되도록 했다.
- 중3 반을 `visibility:hidden`으로 숨기지 않고 목록에서 제외하므로 자리를 차지하지 않는다.
- 새로 만든 draft 반은 `is_active=0`이어도 해당 version slot/assignment가 있으면 개편안에 표시된다.

## 3. 실행 결과

- `node --check apmath/js/timetable.js`: 통과
- `node --check apmath/worker-backup/worker/routes/timetable-versions.js`: 통과

## 4. 결과 요약

이번 보정은 이전처럼 `timetable.js` 전체를 과거 패치본으로 덮는 방식이 아니라, 복구된 최신 시간표 UI를 기준으로 필요한 새학기 기능만 병합한 재구현이다.

## 5. 다음 조치

- 검수 전 적용 금지.
- 검수자는 실제 파일을 열어 `timetable.js`의 기존 UI 보존 여부와 새학기 기능 삽입 범위를 확인해야 한다.
- 검수 PASS 후에만 적용/배포/커밋 명령을 제공한다.
