# 03_DOMAIN_INDEX

| 도메인 | 담당 기능 | 관련 문서 | frontend | Worker route | DB | UI 노출 | 회귀 위험 | 다음 계획 |
|---|---|---|---|---|---|---|---|---|
| 왕지 공통 | 상위 운영층, branch, 공통 foundation | `domains/WANGJI_COMMON_DOMAIN.md` | 확인 필요 | foundation routes | enrollments, billing, parent, audit | 일부 숨김 | AP Math와 상위 OS 혼선 | `plans/MASTER_ROADMAP.md` |
| AP Math | 기존 운영 앱, 문제/OMR/리포트/플래너 | `domains/AP_MATH_DOMAIN.md` | `apmath/*` | 다수 route | core tables | 노출됨 | 기존 운영 회귀 | `plans/MASTER_ROADMAP.md` |
| Classroom | 반 화면, 출결, 숙제, 일지, 플래너 | `domains/CLASSROOM_DOMAIN.md` | `apmath/js/classroom.js` | attendance/homework, class-daily, homework-photo, planner | attendance, homework, class_daily_* | 노출됨 | 선생님 현장 흐름 | `plans/CLASSROOM_NEXT_PLAN.md` |
| Timetable | 운영 시간표, draft/staging/version | `domains/TIMETABLE_DOMAIN.md` | `apmath/js/timetable.js` | timetable-versions, conflicts, class-time-slots | timetable_* | 일부 노출 | 운영/staging 혼선 | `plans/TIMETABLE_NEXT_PLAN.md` |
| Billing | 청구, 납부, 출납, 회계 foundation | `domains/BILLING_ACCOUNTING_DOMAIN.md` | `management.js` foundation modal 확인 | billing-accounting-foundation | payments, transactions, cashbook | 제한/보류 | 금액 무결성 | `plans/BILLING_ACCOUNTING_NEXT_PLAN.md` |
| Parent Contact | 연락처, 동의, message preview/log | `domains/PARENT_CONTACT_DOMAIN.md` | `student.js` 일부 | parent-foundation | parent_contacts, consents, message_logs | 일부 학생 상세 | 개인정보/실제 발송 | `plans/PARENT_CONTACT_NEXT_PLAN.md` |
| Student Portal | PIN 로그인, 배정, OMR, 숙제, 플래너 연결 | `domains/STUDENT_PORTAL_DOMAIN.md` | `apmath/student/index.html` | student-portal, material-omr | students, exam_sessions, material_* | 노출됨 | 시험지 직접 열기/OMR 수정 | `plans/STUDENT_PARENT_PORTAL_NEXT_PLAN.md` |
| Planner | 학생 플래너와 선생님 조회 | `domains/PLANNER_DOMAIN.md` | `apmath/planner/index.html`, `classroom.js` | planner | schema_planner 확인 필요 | 노출됨 | SSO/localStorage | `plans/STUDENT_PARENT_PORTAL_NEXT_PLAN.md` |
| Report AI | 리포트 문구, 시험 분석, 상담 요약 | `domains/REPORT_AI_DOMAIN.md` | `apmath/js/report.js`, `student.js` | reports-ai, proxy | exam_sessions, wrong_answers, consultations | 노출됨 | 학부모 문장/내부 표현 | `plans/REPORT_AI_NEXT_PLAN.md` |
| Archive/OMR | archive engine, mixed engine, QR/OMR | `domains/ARCHIVE_OMR_DOMAIN.md` | `archive/*`, `check/*`, `qr-omr.js` | check-omr, exams | exam_sessions, wrong_answers, exam_blueprints | 노출됨 | 제출 완료 수정 | `plans/ARCHIVE_OMR_NEXT_PLAN.md` |
| Class Daily | 수업일지/교재 진도 | `domains/CLASS_DAILY_DOMAIN.md` | `classroom.js`, `dashboard.js` | class-daily, operations | daily_journals, class_textbooks, class_daily_* | 노출됨 | 일지 문구/결재 | `plans/CLASS_DAILY_NEXT_PLAN.md` |
| Homework Photo | 숙제 사진 QR/R2 | `domains/HOMEWORK_PHOTO_DOMAIN.md` | `homework/index.html`, `classroom.js` | homework-photo | homework_photo_* | 노출됨 | 파일 만료/R2/숙제 용어 | `plans/HOMEWORK_PHOTO_NEXT_PLAN.md` |
| Students/Classes | 학생, 반, 담당반, PIN, 반 이동, admin 학생 XLSX 출력 | `domains/STUDENTS_CLASSES_DOMAIN.md` | `student.js`, `management.js`, `student-export.js` | students, classes, teachers, enrollments | students, classes, class_students, teacher_classes | 노출됨 | 권한/scope/출력 개인정보, Round 1 상담 목록 제외 유지 | `plans/TEACHER_MODE_NEXT_PLAN.md` |
| Operations | 상담, 운영 메모, 일정, 학교시험 | `domains/OPERATIONS_CONSULTATION_DOMAIN.md` | `dashboard.js`, `student.js`, `cumulative.js` | operations | consultations, operation_memos, schedules | 노출됨 | 개인정보/내부메모 | `plans/DIRECTOR_MODE_NEXT_PLAN.md` |
| Staff/Auth/Audit | 로그인, 권한, 감사 로그 | `domains/STAFF_PERMISSION_AUDIT_DOMAIN.md` | `core.js`, `dashboard.js` | auth, teachers, foundation-logs | teachers, sessions, permissions, logs | 일부 숨김 | 권한/로그 노출 | `plans/TEACHER_MODE_NEXT_PLAN.md` |
| Homepage | 왕지교육 홈페이지 | `domains/HOMEPAGE_DOMAIN.md` | `index.html` 확인 필요 | 확인 필요 | 확인 필요 | 계획/미확인 | 운영 시스템과 혼선 | `plans/HOMEPAGE_NEXT_PLAN.md` |
