# AP/EIE 시간표 최근 2개월 퇴원생 표시 결과

## 1. 요청 사항
- 수학/AP 시간표 최근 2개월 퇴원생 색상 구분
- 영어/EIE 시간표 최근 2개월 퇴원생 색상 구분

## 2. 기준 정책
- 퇴원 상태: `archived`, `inactive`, `퇴원`, `withdrawn`, `left`
- 퇴원일 필드: AP는 직접 필드(`withdrawn_at`, `withdrawal_date`, `left_at`, `left_date`, `inactive_at`, `archived_at`, `status_changed_at`, `student_status_changed_at`, `end_date`) 우선, 없으면 `student_status_history.changed_at` 중 퇴원 상태 변경 row 사용. EIE는 `eie_students.withdrawn_at` 사용.
- 2개월 기준: 실행일 기준 2개월 전 이상. 테스트는 task 기준 예시인 `2026-06-14` / `2026-04-14`로 고정 검증.
- 퇴원일 없는 경우: 최근 2개월 판단 불가로 시간표 학생칩에서 숨김.

## 3. AP 구현
- 수정 파일: `apmath/js/timetable.js`, `tests/apmath-timetable-withdrawn-students.test.js`
- 학생 목록 생성 위치: `getTimetableClassStudentsWithInfo(classId)`
- 필터 보정: 기존 `재원`/`휴원` 노출은 유지하고, 퇴원 상태이면서 정확한 퇴원일이 2개월 기준 안인 학생만 추가 노출.
- chip class: `tt-withdrawn`
- 테스트: 최근 퇴원, 기준일 퇴원, 오래된 퇴원, 퇴원일 없는 퇴원, 휴원 유지, 재원 유지 검증.

## 4. EIE 구현
- 수정 파일: `eie/js/views/eie-timetable.js`, `eie/css/eie-v2-week-card.css`, `workers/wangji-eie-worker/routes/eie.js`, `migrations/20260615_eie_students_withdrawn_at.sql`, `tests/eie-timetable-withdrawn-students.test.js`
- Worker/API 보정: `assigned_students` 응답에 `withdrawn_at` 포함. `PATCH /students/:id`, `PATCH /students/:id/status`, soft delete에서 퇴원성 상태 전환 시 `withdrawn_at` 저장.
- 학생 목록 생성 위치: `getStudents(row)` 및 `renderStudentNames` / `renderStudentPreview`
- 필터 보정: 퇴원 상태 학생은 `withdrawn_at`이 최근 2개월일 때만 학생칩에 남김. 오래된 퇴원과 날짜 없는 퇴원은 제외.
- chip class: `is-withdrawn`
- 테스트: 최근 퇴원, 기준일 퇴원, 오래된 퇴원, 퇴원일 없는 퇴원, 휴원 유지, 재원 유지 검증.

## 5. 테스트 결과
- node --check: `apmath/js/timetable.js`, `eie/js/views/eie-timetable.js`, `workers/wangji-eie-worker/routes/eie.js` PASS
- AP 테스트: `node tests/apmath-timetable-withdrawn-students.test.js` PASS
- EIE 테스트: `node tests/eie-timetable-withdrawn-students.test.js` PASS
- run-tests: `node tools/run-tests.js` PASS 60 / FAIL 0 / KNOWN-FAIL 0
- smoke-api: `node tools/smoke-api.mjs` PASS
- smoke-browser: Playwright 미설치로 미수행 (`Playwright가 설치되어 있지 않습니다.`)

## 6. 보류/한계
- 퇴원일 필드 부재 여부: AP `students`에는 전용 퇴원일 column이 없으나 `student_status_history.changed_at`로 상태 변경일을 확인할 수 있다. EIE는 기존 schema에 퇴원일 column이 없어 `withdrawn_at` migration을 추가했다.
- 기존 데이터 중 퇴원일 없는 학생 처리: 임의로 `updated_at`을 사용하지 않고 숨김 처리한다. 기존 EIE 퇴원생을 노출하려면 `eie_students.withdrawn_at` backfill이 필요하다.

## 핫픽스
- EIE Worker `assigned_students` payload에 `status: row.student_status || 'active'`와 `student_status: row.student_status || 'active'`를 추가했다.
- 프론트 `getStudents()` status 우선순위를 `status -> student_status -> studentStatus -> match_status`로 보정했다.
- 퇴원 판정 helper는 `status/student_status/studentStatus/raw.status`만 학생 상태로 보고, `match_status: confirmed`만으로 퇴원생 판정을 하지 않게 했다.
- 테스트 fixture를 실제 Worker payload 기준으로 보정하고, 과거 버그 형태인 `match_status: confirmed` only row를 추가했다.

## 외부검수 FAIL 반영
- 기존 실패 원인: Worker SQL은 `s.status AS student_status`를 조회했지만 `assigned_students` push 객체에 실제 학생 상태를 넣지 않아 프론트가 `match_status: confirmed`만 보았다.
- 수정 내용: Worker payload에 `status/student_status`를 추가하고, Worker SQL 필터를 `inactive/archived/withdrawn/left/퇴원` 상태는 `withdrawn_at` 최근 2개월인 경우만 통과하도록 보정했다.
- 재검증 결과: `node tests/eie-timetable-withdrawn-students.test.js`, `node tests/apmath-timetable-withdrawn-students.test.js`, `node tests/apmath-onclick-defined.test.js`, `node tools/run-tests.js`, `node tools/smoke-api.mjs` PASS. Browser smoke는 Playwright 미설치로 미수행.

## 2차 핫픽스
- EIE 실제 퇴원 처리 버튼 경로에서 `batchCellStudentOps(... { remove })` 호출을 제거했다.
- `retireMiniStudent()`는 이제 `window.EieApi.updateStudent(sid, { status: 'inactive', withdrawn_at: todayIso() })`만 수행하고 기존 timetable assignment는 유지한다.
- 명시적 “수업에서 학생 제거” 경로인 `removeStudentFromMiniClassroom()`의 `batchCellStudentOps(... { remove })`는 유지했다.
- 테스트에 `retireMiniStudent` 함수 body source assertion을 추가해 퇴원 처리 함수에는 `withdrawn_at`이 있고 `removeOps`/`batchCellStudentOps`가 없음을 검증한다.

## 2차 외부검수 FAIL 반영
- 기존 실패 원인: 퇴원 버튼이 학생 상태를 inactive로 변경한 직후 schedule assignment를 archived 처리해, 최근 2개월 퇴원생이 Worker timetable 조회의 `assigned_students`까지 도달하지 못했다.
- 수정 내용: 퇴원 처리와 명시적 배정 제거를 분리했다. 퇴원 처리 시 학생 상태/퇴원일만 저장하고 배정은 유지한다.
- 재검증 결과: `node --check eie/js/views/eie-timetable.js`, `node --check workers/wangji-eie-worker/routes/eie.js`, `node --check tests/eie-timetable-withdrawn-students.test.js`, `node tests/eie-timetable-withdrawn-students.test.js`, `node tests/apmath-timetable-withdrawn-students.test.js`, `node tests/apmath-onclick-defined.test.js`, `node tools/run-tests.js`, `node tools/smoke-api.mjs` PASS. Browser smoke는 Playwright 미설치로 미수행.
