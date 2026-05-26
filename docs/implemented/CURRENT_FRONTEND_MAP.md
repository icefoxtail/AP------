# CURRENT_FRONTEND_MAP

## 1. AP Math main

| 파일 | 화면/도메인 | 주요 역할 | 호출 API | 회귀 위험 |
|---|---|---|---|---|
| `apmath/index.html` | APMS shell | CSS/JS 로드, 주요 화면 컨테이너 | 간접 | script 로드 순서 |
| `apmath/app.js` | app bootstrap | 확인 필요 | 확인 필요 | 초기화 |
| `apmath/js/core.js` | config/auth/state/api/initial-data | login, session, api wrapper, sync queue, state.db, class option 표시명 helper | `auth/login`, `logout`, `initial-data`, foundation 일부 | 전체 앱 |
| `apmath/js/dashboard.js` | 대시보드/운영/일지/교사 관리 | 위험학생, 일지, 교사 관리, 출결/숙제 quick, dashboard UI 규칙 | students, teachers, attendance, homework, daily-journals | 관리자/선생님 화면 |
| `apmath/js/classroom.js` | 반 화면 | 출결, 숙제, 플래너, 수업일지, 숙제사진 | attendance, homework, homework-photo, planner, class-daily | 선생님 현장 |
| `apmath/js/student.js` | 학생 상세/상담/학부모 | 학생 detail lazy, 학생 추가/수정 반 선택, 상담, 학부모 연락/동의 | students, consultations, parent-foundation, ai | 개인정보 |
| `apmath/js/student-export.js` | 학생 출력/엑셀 내보내기 | admin 전용 학생 명단 XLSX, 출력정보 시트, 전체/반별/연락처/주소차량 시트 | frontend state only | 개인정보, teacher 노출 금지 |
| `apmath/js/management.js` | 반/주소록/수납 foundation | 반 관리, 주소록 반 필터, PIN, billing accounting modal | classes, billing-accounting-foundation | 숨김 foundation 노출 |
| `apmath/js/timetable.js` | 시간표 | 운영 시간표, draft/version, slot, conflict, 반 선택/확인 표시명, A4 가로 인쇄 전용 HTML 출력 | timetable-versions, class-time-slots, conflicts, enrollments | 운영/staging 혼선 |
| `apmath/js/report.js` | 리포트/AI | 학부모/학생/상담 리포트, AI 분석, print | ai/report-analysis, consultations, archive fetch | 학부모 문장 |
| `apmath/js/qr-omr.js` | QR/OMR | OMR 세션 생성/제출, archive fetch | exam-sessions | 제출 완료 |
| `apmath/js/cumulative.js` | 월간 출결/성적 | 출결 월간, school exam records, 반 필터, 월간/누적 출석부 A4 가로 인쇄 전용 HTML 출력 | attendance-month, school-exam-records | 성적/출결 |
| `apmath/js/study-material-wrong.js` | 교재 오답 | material OMR/manage/review | material-* | 일반 OMR 정책 혼선 |
| `apmath/js/wangji-foundation.js` | foundation helper | branch/time/conflict helper | 확인 필요 | 공통 helper |

## 2. 학생/외부 접점

| 파일 | 역할 | 호출 API | 저장소/보안 |
|---|---|---|---|
| `apmath/student/index.html` | 학생 포털 | `student-portal/auth`, `student-portal/home`, `student-portal/exams`, `student-portal/omr-submit`, `homework-photo/cancel`, `material-omr/*` | `localStorage`/`sessionStorage`에 session, PLANNER_SID/PIN |
| `apmath/planner/index.html` | 학생 플래너 | `planner-auth`, `planner`, `planner/{id}` | `PLANNER_SID`, `PLANNER_PIN`, `planner_auth_{sid}`, `planner_pin_{sid}` |
| `apmath/homework/index.html` | 숙제 사진 제출 | 확인 필요, `homework-photo` 계열 | 학생 링크/PIN 확인 필요 |
| `check/check.js` | OMR check | `check-init`, `check-pin`, `exam-sessions/new` | pending localStorage |
| `archive/engine.html` | archive 출제/배정 | `class-exam-assignments`, `exam-blueprints` | 외부 worker URL 직접 fetch |
| `archive/mixed_engine.html` | mixed engine | `class-exam-assignments`, `exam-blueprints` | MIXED 처리 보존 |

## 3. UI 문구 변경 금지

반 화면, 학생 포털, OMR, 플래너, 시간표, 리포트, 수납 foundation 화면은 기존 문구를 임의 변경하지 않는다. 특히 `숙제`, `OMR`, `제출 완료`, `중등부`, `고등부`, `전체 보기`, `내 반 보기` 같은 현장 용어는 보존한다.

## 4. 리포트 통계 기준

`report.js`의 평가 리포트 통계는 `report_exam_cohort_stats`가 있으면 같은 연도에 같은 아카이브 시험지를 본 같은 학년 전체 summary를 우선 사용한다. summary가 없으면 frontend 보유 `exam_sessions`에서 `archive_file`, `exam_title + exam_date + question_count`, `exam_title + exam_date` 순서로 같은 시험을 식별하고 같은 학년 기준으로 fallback한다. `classAverage`는 별도 반 기준 값으로 유지한다.

## 5. 학생 출력 Round 1

학생 출력/엑셀 내보내기는 `apmath/js/student-export.js`에서 관리한다. admin에게만 학생관리 모달의 `학생 명단 출력` 버튼과 출력 모달을 노출하며, teacher에는 버튼/모달/다운로드 진입점을 만들지 않는다. Round 1은 frontend `state.db.students/classes/class_students` 기반이며 Worker export API와 audit_logs는 보류다. XLSX에는 항상 `출력정보` 시트를 포함하고, 선택한 시트만 추가한다. PIN 출력과 학생 memo 출력은 Round 1 제외다. 상담 목록은 frontend 상담 데이터 lazy load 불완전성 때문에 Round 1에서 제외하고, Round 2에서 Worker export API와 audit_logs 기반으로 별도 구현한다.

## 6. 반 선택 표시명

학생 추가/수정, 주소록/학생관리, 누적 출석부/내신, 시간표 반 선택 드롭다운 option에서 반명이 중복되어 보이지 않도록 표시명만 `반명 · 담당 · 요일/교시/시간` 형태로 보강한다. 공통 option label은 `apmath/js/core.js`의 helper를 사용하고, `4:50~6:20`, `6:30~8:00`, `8:00~9:30` 같은 표준 운영 시간대만 저장된 반도 1/2/3교시를 자동 추론한다. DB의 `classes.name`, `time_label`과 저장되는 `class_id`/`version_class_id` 흐름은 변경하지 않으며, 시간표 카드 제목 자체는 이 표시명 보강 대상이 아니다. 표시명이 완전히 겹치는 경우에만 마지막 fallback으로 `#2` 같은 짧은 구분값을 붙인다.

## 7. 대시보드 UI 규칙 Round 1

`apmath/js/dashboard.js`는 원장님 모드와 선생님 뷰의 빠른 이동 버튼, 실제 필터 segmented control, 섹션 헤더, 리스트 row, 배지/태그, 빈 상태 규격을 같은 class 체계로 정리한다. 오늘 운영은 숫자 없는 진입 카드로 유지하며 기능/데이터/API/DB 흐름은 변경하지 않는다.
