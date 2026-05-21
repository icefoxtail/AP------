# GEMINI_REVIEW_PROMPT

## 검수 대상

- `apmath/js/timetable.js`
- `apmath/worker-backup/worker/routes/timetable-versions.js`
- `apmath/worker-backup/worker/migrations/20260520_timetable_version_student_assignments.sql`
- `docs/TIMETABLE_NEW_SEMESTER_REBUILD_RESULT.md`

## 검수 전제

이번 패치는 복구된 최신 `timetable.js`를 기준으로 새학기 기능만 다시 얹은 재구현이다.  
이전 실패 원인은 `timetable.js`를 집에서 작업한 파일로 통째 선택하면서 학원 최신 UI가 날아간 것이므로, 이번 검수의 최우선 기준은 기존 시간표 UI 보존이다.

## 필수 확인 항목

1. 실제로 확인한 zip/파일 목록을 먼저 적는다.
2. 각 파일에서 확인한 핵심 함수/상수/쿼리/컴포넌트명을 적는다.
3. 확인하지 못한 파일은 PASS 금지 및 `미검수`로 표시한다.
4. 근거 없는 PASS 금지.
5. `apmath/js/timetable.js`에 충돌 마커가 남아 있지 않은지 확인한다.
6. `node --check apmath/js/timetable.js` 실패 가능성을 확인한다.
7. `node --check apmath/worker-backup/worker/routes/timetable-versions.js` 실패 가능성을 확인한다.
8. 기존 시간표 상단 UI가 크게 변형되지 않았는지 확인한다.
9. 기존 확정 문구 `개편시간표`, `운영 시간표로 이동`, `충돌 확인`이 보존됐는지 확인한다.
10. 원장/admin 기준 내 반 보기/선생님별 보기 회귀가 없는지 확인한다.
11. 선생님 계정 시간표 기존 동작이 건드려지지 않았는지 확인한다.
12. 학생 드래그와 반 카드 드래그가 충돌하지 않도록 payload가 분리됐는지 확인한다.
13. 학생 dragstart에서 이벤트 전파 차단이 되어 학생 1명 드래그 시 반 전체가 움직이지 않는지 확인한다.
14. draft/개편안에서 기존 학생 배치가 `timetable_version_student_assignments`에 저장되는지 확인한다.
15. draft/개편안에서 새 반 추가가 운영 `class_time_slots`를 즉시 바꾸지 않는지 확인한다.
16. draft/개편안에서 신규 학생 추가가 운영 `class_students`를 즉시 바꾸지 않는지 확인한다.
17. 적용일 달력 저장이 `timetable_versions.effective_from`만 PATCH하는지 확인한다.
18. `운영 시간표 적용`은 사용자가 직접 눌렀을 때만 activate route를 호출하는지 확인한다.
19. 12월 + 다음 해 draft/개편안에서 기존 운영 중3 반이 자리 차지 없이 렌더링 목록에서 제외되는지 확인한다.
20. 빈 칸에 `+ 반 추가`가 계속 표시되어 새 반을 만들 수 있는지 확인한다.
21. 새로 만든 draft 반은 `is_active=0`이어도 개편안 화면에 보이는지 확인한다.
22. 적용 전 운영 클래스룸/출석/숙제/플래너에 새 반이 섞이지 않는지 구조상 확인한다.
23. 적용 후 클래스룸 진입에 필요한 `classes`, `class_students`, `class_time_slots`, `student_enrollments`, `teacher_classes` 반영 흐름이 route에 있는지 확인한다.
24. undefined/null 접근 가능성을 찾는다.
25. API 응답 구조 불일치 가능성을 찾는다.
26. SQL placeholder 개수 불일치 가능성을 찾는다.
27. 기존 학생 포털/OMR/QR/시험지/플래너/숙제사진 회귀 가능성을 찾는다.
28. 기존 문구/버튼명/화면명 회귀 가능성을 찾는다.
29. 숨김 foundation 기능이 의도 없이 노출됐는지 확인한다.

## 결과 형식

- 최종 판정: PASS / FAIL
- 실제 확인한 zip 목록
- 실제 확인한 파일 목록
- 파일별 확인한 핵심 함수/상수/쿼리/컴포넌트명
- 요청 범위 일치 여부
- 기존 시간표 UI 보존 여부
- 새학기 반 추가/학생 추가/학생 드래그 구조 적합성
- 적용일 저장/수동 적용 구조 적합성
- 적용 전 staging 격리 적합성
- 적용 후 운영 반영 구조 적합성
- 12월 다음 해 중3 렌더링 제외 적합성
- 발견된 버그/오류
- 재현 가능성
- 수정 필요 여부
- 회귀 위험
- 미검수 파일
