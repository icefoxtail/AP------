# EIE APMS Feature Matrix

작성일: 2026-06-01

## 원칙

EIE는 새 제품을 새로 설계하지 않는다. APMath/APMS를 UI/UX와 프론트엔드 흐름의 원본으로 사용하고, EIE에는 필요한 데이터 어댑터와 백엔드 연결만 붙인다.

기본 분류는 `copy-with-adapter`다. `custom`은 시간표처럼 학원 운영 구조가 실제로 다른 경우에만 쓴다.

| 영역 | AP 원본 | EIE 현재 | 판정 | 실행 기준 |
|---|---|---|---|---|
| 앱 셸/헤더/사이드바 | `apmath/index.html`, `apmath/js/ui.js`, `apmath/css/sidebar-foundation.css` | `eie/index.html`, `eie-app.js`, `eie.css` | copy-with-adapter | AP 구조와 drawer UX를 기준으로 유지. EIE는 라벨/라우트/API만 변경 |
| 로그인/세션 | `apmath/js/core.js`, `routes/auth.js` | `eie-app.js`, `shared/js/wangji-owner-auth-bridge.js`, EIE Worker auth | copy-with-adapter | AP 로그인 UX 유지, 토큰 저장/검증만 EIE 전용 |
| 원장 대시보드 | `apmath/js/dashboard.js`, `dashboard-admin.js`, `dashboard-foundation.css` | `eie-dashboard.js` | copy | AP 원장 대시보드 모양 그대로. 미구현 데이터는 같은 위치에 `준비중` |
| 선생님 대시보드 | `apmath/js/dashboard-teacher.js`, `dashboard.js` | 없음/미분리 | copy-with-adapter | AP 선생님 화면을 그대로 가져오고 EIE 담당 수업 projection만 연결 |
| 학생관리 | `apmath/js/student.js` | `eie-students.js` | copy-with-adapter | AP 학생 목록/상세/탭/모달 구조 복사. API는 `EieApmsApi`로 연결 |
| 학생 상세 탭 | `renderStudentDetailTab`, 성적/취약/상담/연락처 흐름 | 일부 EIE 전용 탭 | copy-with-adapter | AP 탭 구조 유지. EIE 미지원 탭은 삭제하지 말고 `준비중` |
| 연락처 | `student.js`, `parent-foundation.js` | EIE contacts endpoint 일부 | copy-with-adapter | AP 연락처 카드/모달 UX 복사. EIE contact schema로 adapter 연결 |
| 상담 | `student.js`, `operations.js` consultations | EIE consultations endpoint 일부 | copy-with-adapter | AP 상담 카드/작성/수정 UX 복사. 삭제 불가면 비활성/준비중 |
| 클래스룸 | `apmath/js/classroom.js`, `classroom-foundation.css` | `eie-classroom.js` | copy-with-adapter | AP 출석/과제/상담/메모 UX 복사. 데이터 원천은 EIE timetable assignment |
| 출석 | `classroom.js`, `cumulative.js`, `attendance-homework.js` | 미구현/부분 | copy-with-adapter | AP 출석 UI 복사. EIE attendance endpoint를 AP 응답 형태로 제공 |
| 과제 | `classroom.js`, `attendance-homework.js` | 미구현 | copy-with-adapter | AP 과제 UI 복사. EIE homework endpoint 추가 후 연결 |
| 반/수업 관리 | `management.js`, `classes.js`, `class-time-slots.js` | timetable cell 관리 중심 | copy-with-adapter | AP 관리 UX를 쓰되 EIE 수업 cell/assignment로 매핑 |
| 시간표 | `apmath/js/timetable.js` | `eie-timetable.js`, `eie-timetable-v2.js` | custom | EIE는 과목/시간/다중 담당 구조가 달라 커스텀 유지 |
| 시간표 학생 배정 | AP class/class_student model | EIE timetable_cell/student_assignment model | custom | UI는 EIE 전용. 단 학생 상세/클래스룸 진입은 AP식 화면으로 연결 |
| 운영 메모 | `memo.js`, `operations.js` | 없음 | copy-with-adapter | AP 메모 모달/목록 복사. EIE operation memo endpoint 필요 |
| 일정 | `schedule.js`, `operations.js` exam/academy schedules | 없음/준비중 | copy-with-adapter | AP 일정 UI 복사. EIE 일정 endpoint 준비 전까지 `준비중` |
| 교사 관리 | `management.js`, `teachers.js` | EIE auth teacher table 일부 | copy-with-adapter | AP 교사 관리 UX 복사. EIE teacher/session schema에 맞춤 |
| 수납/회계 | `management.js`, billing routes | 없음 | defer | 화면 자리는 AP식 `준비중`, 실제 구현은 후순위 |
| 리포트/AI | `report.js`, `reports-ai.js` | 없음 | defer | AP UI 자리만 유지, EIE 데이터 축적 후 연결 |
| OMR/시험지/성적 | `qr-omr.js`, `cumulative.js`, exams routes | 없음 | defer/custom-later | EIE 영어 평가 구조 확정 전까지 `준비중` |
| 교재/오답 | `study-material-wrong.js` | 없음 | defer | AP UI 복사 후보이나 EIE 영어 교재 구조 확정 후 진행 |
| 학생 포털/과제 제출 | `student/`, `homework/`, `student-portal.js` | 없음 | defer | 운영자용 EIE 완성 후 별도 포팅 |

## 우선순위

1. 대시보드 parity 고정 완료 상태 유지
2. 학생관리 AP 복사 이식
3. 상담/연락처 AP 복사 이식
4. 클래스룸 AP UX 이식 + EIE assignment adapter
5. 출석/과제 endpoint 추가
6. 관리/교사/일정 화면 AP 복사
7. 수납/리포트/평가/포털은 `준비중`으로 유지 후 후순위

## 금지 사항

- EIE 전용 카드 레이아웃을 새로 만들지 않는다.
- AP에 없는 새 버튼 배열, 새 대시보드 순서, 새 모달 디자인을 만들지 않는다.
- 백엔드가 없다는 이유로 UI를 삭제하지 않는다. AP와 같은 위치에 `준비중`으로 둔다.
- 시간표 외 영역을 `custom`으로 분류하지 않는다.

## 다음 실행 단위

다음 작업은 `eie/js/views/eie-students.js`를 `apmath/js/student.js` 기준으로 재감사하고, 학생관리 화면을 `copy-with-adapter`로 재정렬하는 것이다.

