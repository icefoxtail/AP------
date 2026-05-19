# TIMETABLE_DRAG_FIX_RESULT

## 1. 수정 파일
- `apmath/js/timetable.js`

## 2. 구현 완료
- 새학기/개편안 시간표에서 학생 dragstart가 draft 모드에서 차단되던 조건을 제거했다.
- 학생 드래그 payload에 `drag_type: 'student'`를 명시했다.
- 학생 dragstart/dragend에서 이벤트 전파를 차단해 부모 반 카드 드래그가 같이 실행되지 않도록 했다.
- 반 카드 dragstart에서 학생 영역(`.tt-std-name`, `.tt-std-slot`, `.tt-std-list`, `.tt-std-empty`)에서 시작된 드래그를 반 이동으로 처리하지 않도록 방어했다.
- Worker route, DB migration, schema는 수정하지 않았다.

## 3. 실행 결과
- `node --check apmath/js/timetable.js` 통과

## 4. 결과 요약
- 학생을 드래그하면 학생 배치/전반 흐름만 타야 한다.
- 반 카드를 드래그하면 반 이동 흐름만 타야 한다.
- 새학기/개편안 학생 배치는 기존 staging 저장 API를 사용한다.

## 5. 다음 조치
- 브라우저에서 새학기/개편안 화면을 열고 학생 1명을 드래그한다.
- 반 전체가 움직이지 않고 학생 배치 확인 모달이 뜨는지 확인한다.
- 배치 저장 후 `timetable_version_student_assignments` count가 증가하는지 확인한다.
