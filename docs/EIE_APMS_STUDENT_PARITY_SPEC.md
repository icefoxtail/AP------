# EIE 학생관리 APMS Parity 명세서

## 1. 목표
EIE 학생관리를 APMS 학생관리 UI/UX와 완전히 일치시킨다.

## 2. APMS에서 그대로 가져올 화면 구조
- 학생 목록: APMS의 학생 row/카드 밀도와 상태 badge 체계를 가져온다.
- 검색: 이름, 학년, 학교, 연락처, 배정 수업을 대상으로 한다.
- 신규 등록: APMS `openAddStudent` modal 구조를 가져오되 AP Math 전용 필드는 숨긴다.
- 학생 상세: APMS `renderStudentDetail` 헤더, 연락처 카드, 수정 버튼 구조를 가져온다.
- 탭 구조: APMS `tab-bar`/`tab-btn` 패턴을 가져오고 EIE 1차 탭은 기본정보, 연락처, 상담/메모, 수업 배정으로 구성한다.
- 기본정보: 학생명, 학년, 학교, 상태, 메모를 표시한다.
- 연락처: 학생 전화번호, 학부모/보호자 연락처를 APMS 카드형으로 표시한다.
- 학부모 연락처: APMS `renderParentContactSection` 구조를 가져오되 복잡한 수신동의는 1차 준비중 처리한다.
- 상담: APMS `renderCnsTab` 카드 목록과 신규/수정 modal 구조를 가져온다.
- 메모: 학생 memo와 수업/레벨 운영 메모를 분리 표시한다.
- 상태 변경: active, inactive, needs_review, archived를 EIE status로 사용한다.
- 퇴원/숨김: physical delete를 금지하고 archived 또는 inactive로 처리한다.
- 수정 가능 운영 화면: `docs/EIE_STUDENT_CLASSROOM_EDIT_POLICY.md` 기준으로 상세 패널의 "수정" 버튼과 인라인 수정 모드를 제공한다.

## 3. EIE 전용 필드
- 영어 레벨
- EIE 수업/반 배정
- 시간표 셀
- 교재/레벨 메모
- 기타 영어관 운영 메모

## 4. 1차 구현 필드
- 학생명
- 학년
- 학교
- 학생 전화번호
- 학부모 전화번호
- 상태
- 메모
- EIE 수업 배정 목록
- 최근 수업/클래스룸 연결 자리

## 5. 1차에서 준비중 처리할 기능
- 상담 AI
- 리포트
- 시험/성적
- 수납
- 복잡한 학부모 동의
- 기타 AP 전용 기능

## 6. 저장 흐름
- create: `EieApi.createStudent(payload)`를 adapter에 두고 Worker `POST /api/eie/students`가 준비된 뒤 연결한다. endpoint가 없는 라운드에서는 modal 버튼을 준비중으로 둔다.
- update: `EieApi.updateStudent(studentId, payload)` → Worker `PATCH /api/eie/students/{id}` → D1 `eie_students`/`eie_student_contacts` 반영 → 응답 row로 `EieState.db` merge.
- status update: `EieApi.updateStudentStatus(studentId, status)` → Worker `PATCH /api/eie/students/{id}/status`.
- archive/withdraw: `EieApi.archiveStudent(studentId)` → Worker `PATCH /api/eie/students/{id}/archive` 또는 `DELETE`가 아닌 soft archive endpoint.
- physical delete 금지: `eie_students`, `eie_student_contacts`, `eie_student_schedule_assignments`의 운영 삭제는 archived/ended 상태 처리로 제한한다.
- 현재 확인된 차이: `EieApi.createStudent`, `updateStudent`, `updateStudentStatus` 함수는 frontend에 있으나 Worker `routes/eie.js`에는 대응 분기가 없다.

## 7. 학생관리와 시간표/클래스룸 연결
- 학생 상세 → 배정 수업: `student.assignments` 또는 `EieState.db.class_students` projection에서 `timetable_cell_id`를 열어 클래스룸으로 이동한다.
- 시간표 v2 학생명 → 학생 상세: `assigned_students[].student_id` 또는 `assignment_id`로 `currentStudentDetailId`를 설정한다.
- 클래스룸 학생명 → 학생 상세: EIE 클래스룸 row에서 `student_id`를 넘겨 APMS parity 학생 상세를 연다.
- 현재 `eie/js/views/eie-timetable-v2.js`는 학생 버튼에서 `EieStudentsView.openDetail(studentId)` 또는 `EieStudentsView.setQuery(studentName)`를 호출한다. 이 연결은 학생관리 APMS parity 구현 후 그대로 사용할 수 있다.
## Round 2 구현 반영 (2026-05-31)

- EIE 학생관리 화면은 `EieState.get().db.students`, `student_contacts`, `parent_contacts`, `class_students`, `timetable_cells`를 원본으로 사용한다.
- 로컬 상태는 검색어, 상태 필터, 선택 학생, 상세 탭, 작성/수정 draft, 저장중 여부에 한정한다.
- 제공 기능: 학생 목록, 검색, 상태 필터, 신규 등록, 상세 패널, 기본정보 수정, 상태 변경, `DELETE /students/{id}` soft archive, 연락처 표시, 수업 배정 표시, 시간표/클래스룸 연결.
- 미구현 endpoint 기능: 상담 저장, 출결/숙제 저장, 복수 연락처 별도 CRUD. 이 기능들은 성공 처리하지 않고 준비중 패널 또는 비활성 버튼으로 표시한다.
- APMS 원본 `apmath/js/student.js`는 수정하지 않고 화면 문법과 조작 흐름만 EIE 전용 view에 재구성한다.
