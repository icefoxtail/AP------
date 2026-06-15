# CODEX_RESULT — EIE 퇴원 처리 시간표 표시 유지 핫픽스

## 1. 작업 요약
- EIE 실제 퇴원 처리 버튼 경로에서 schedule assignment가 즉시 remove/archive 되던 문제를 수정했다.
- 퇴원 처리 시 학생 상태와 `withdrawn_at`만 저장하고, 기존 시간표 배정은 유지하도록 변경했다.
- 명시적 “수업에서 학생 제거” 기능은 기존처럼 assignment remove가 가능하게 유지했다.

## 2. 수정 파일
- `eie/js/views/eie-timetable.js`
- `tests/eie-timetable-withdrawn-students.test.js`
- `docs/reports/ap-eie-timetable-withdrawn-students-result.md`
- `CODEX_RESULT1.md`

## 3. 수정 내용
- `retireMiniStudent()`에서 `batchCellStudentOps(... { remove })` 호출 제거
- `retireMiniStudent()`에서 퇴원 처리 payload를 아래처럼 보정:
  - `status: 'inactive'`
  - `withdrawn_at: todayIso()`
- `removeStudentFromMiniClassroom()`의 명시적 배정 제거 flow는 유지
- EIE 테스트에 퇴원 처리 함수 source assertion 추가:
  - 퇴원 처리 함수에는 `withdrawn_at`이 있어야 함
  - 퇴원 처리 함수에는 `removeOps`와 `batchCellStudentOps`가 없어야 함
  - 명시적 제거 함수에는 `removeOps`와 `batchCellStudentOps`가 남아 있어야 함

## 4. 정책 확인
- 퇴원 처리 시 assignment 유지: 반영됨
- 명시적 배정 제거 유지: 반영됨
- 최근 2개월 퇴원생 시간표 표시 가능: 반영됨
- 2개월 초과 퇴원생 숨김: 기존 테스트 유지
- 퇴원일 없는 퇴원생 숨김: 기존 테스트 유지
- AP 수학 시간표: 이번 작업에서 수정하지 않음

## 5. 테스트 결과
- `node --check eie/js/views/eie-timetable.js` PASS
- `node --check workers/wangji-eie-worker/routes/eie.js` PASS
- `node --check tests/eie-timetable-withdrawn-students.test.js` PASS
- `node tests/eie-timetable-withdrawn-students.test.js` PASS
- `node tests/apmath-timetable-withdrawn-students.test.js` PASS
- `node tests/apmath-onclick-defined.test.js` PASS
- `node tools/run-tests.js` PASS 60 / FAIL 0 / KNOWN-FAIL 0
- `node tools/smoke-api.mjs` PASS
- `node tools/smoke-browser.mjs`는 Playwright 미설치로 미수행

## 6. Git 처리
- stage: 하지 않음
- commit: 하지 않음
- push: 하지 않음
