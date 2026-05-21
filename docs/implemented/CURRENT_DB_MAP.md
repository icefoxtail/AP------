# CURRENT_DB_MAP

기준 파일: `apmath/worker-backup/worker/schema.sql`, `apmath/worker-backup/worker/migrations/*.sql`

## 1. Core / AP Math 운영

| table | 역할 | 분류 | 관련 route | 관련 frontend | UI 노출 | 회귀 위험 |
|---|---|---|---|---|---|---|
| `teachers` | 교사/admin 계정 | 공통/권한 | `auth`, `teachers` | `core.js`, `dashboard.js` | 노출됨 | 로그인/권한 |
| `teacher_sessions` | Bearer session | 공통/권한 | `auth`, `logout` | `core.js` | 숨김 | session 만료 |
| `students` | 학생 기본정보/PIN | AP Math 핵심 | `students`, `student-portal` | `student.js`, `dashboard.js` | 노출됨 | 개인정보/PIN |
| `classes` | 반 기본정보 | AP Math 핵심 | `classes` | `management.js`, `classroom.js`, `timetable.js` | 노출됨 | 시간표/반 관리 |
| `teacher_classes` | 담당반 권한 | 권한 | `teachers`, initial-data | `dashboard.js` | 일부 노출 | teacher scope |
| `class_students` | 반-학생 매핑 | AP Math 핵심 | `classes`, initial-data | 다수 | 노출됨 | 학생/반 scope |
| `attendance` | 출결 | AP Math 핵심 | `attendance`, `attendance-history`, `attendance-month` | `classroom.js`, `dashboard.js`, `cumulative.js` | 노출됨 | 오늘/월간 출결 |
| `homework` | 숙제 상태 | AP Math 핵심 | `homework`, `homework-batch` | `classroom.js`, `dashboard.js` | 노출됨 | 숙제 용어 |
| `exam_sessions` | 시험/OMR 세션 | AP Math 핵심 | `exam-sessions`, `student-portal` | `qr-omr.js`, `report.js`, `student/index.html` | 노출됨 | 제출 완료 수정 |
| `wrong_answers` | 오답 번호 | AP Math 핵심 | `exam-sessions`, `check-omr` | `qr-omr.js`, `report.js` | 노출됨 | 오답 리포트 |
| `questions` | 문항 메타 | AP Math 특화 | 확인 필요 | 확인 필요 | 확인 필요 | 데이터 불일치 |
| `consultations` | 상담 기록 | 운영 | `consultations` | `student.js`, `report.js` | 노출됨 | 개인정보 |
| `operation_memos` | 운영 메모 | 운영 | `operation-memos` | `dashboard.js` | 노출됨 | 내부 메모 노출 |
| `exam_schedules` | 시험 일정 | 운영 | `exam-schedules` | 확인 필요 | 노출 추정, 확인 필요 | 일정 회귀 |
| `academy_schedules` | 학원 일정 | 운영 | `academy-schedules` | 확인 필요 | 노출 추정, 확인 필요 | target scope |
| `school_exam_records` | 학교시험 기록 | AP Math/운영 | `school-exam-records` | `cumulative.js` | 노출됨 | 성적 기록 |
| `exam_blueprints` | archive 문항 메타 | AP Math 특화 | `exam-blueprints` | `archive/*`, `report.js` | 노출됨 | archive 분석 |
| `class_exam_assignments` | 반 시험 배정 | AP Math 특화 | `class-exam-assignments` | `archive/*`, `student/index.html` | 노출됨 | 학생 시험 직접 열기 금지 |
| `daily_journals` | 수업/업무 일지 | 운영 | `daily-journals` | `dashboard.js` | 노출됨 | 결재/일지 |
| `class_textbooks` | 반 교재 | classroom | `class-textbooks` | `classroom.js` | 노출됨 | 진도 |
| `class_daily_records` | 반별 일지 | classroom | `class-daily-records` | `classroom.js` | 노출됨 | 수업 흐름 |
| `class_daily_progress` | 교재별 진도 | classroom | `class-daily-progress` | `classroom.js` | 노출됨 | 진도 누락 |

## 2. Homework Photo

| table | 역할 | 관련 route | UI 노출 |
|---|---|---|---|
| `homework_photo_assignments` | 숙제 사진 과제 | `homework-photo` | classroom/학생 제출 |
| `homework_photo_submissions` | 학생 제출 상태 | `homework-photo` | classroom/학생 제출 |
| `homework_photo_files` | R2 파일 메타/만료 | `homework-photo` | 파일 뷰어 |

## 3. 왕지 foundation

| table | 역할 | UI 노출 상태 |
|---|---|---|
| `student_enrollments` | 수강/enrollment foundation | 일부/보류 |
| `class_time_slots` | 운영 반 시간 슬롯 | 시간표 연결 |
| `timetable_versions` | 시간표 draft/version | 일부 노출 |
| `timetable_version_slots` | version별 슬롯 | 일부 노출 |
| `timetable_conflict_logs` | 충돌 로그 | foundation/일부 |
| `timetable_conflict_overrides` | 충돌 예외 | foundation |
| `billing_templates`, `payments`, `payment_items`, `billing_adjustments`, `billing_runs` | 청구 foundation | 제한/승인 필요 |
| `parent_contacts`, `parent_contact_consents`, `message_logs` | 학부모 연락 foundation | 학생 상세 일부/발송 금지 |
| `student_status_history`, `class_transfer_history` | 학생 상태/반 이동 이력 | 일부 |
| `staff_permissions`, `audit_logs`, `privacy_access_logs` | 권한/감사 | 숨김 |
| `foundation_sync_logs` | foundation sync 이력 | 숨김 |

## 4. 수납·출납·회계 확장

| table | 역할 | UI 노출 상태 |
|---|---|---|
| `payment_methods` | 결제수단 마스터 | 제한 |
| `payment_transactions` | 실제 납부 거래 | 제한, 실결제 아님 |
| `cashbook_entries` | 출납 장부 | 제한 |
| `refund_records` | 환불 기록 | 제한 |
| `carryover_records` | 이월 기록 | 제한 |
| `billing_policy_rules` | 수납 정책 | 숨김/제한 |
| `accounting_daily_summaries`, `accounting_monthly_summaries` | 회계 요약 | 숨김/제한 |

## 5. 수업자료/교재 오답

| table | 역할 | 정책 |
|---|---|---|
| `study_materials` | 교재/자료 마스터 | 일반 시험 OMR과 분리 |
| `material_unit_ranges` | 단원 범위 | 교재 오답 |
| `material_question_tags` | 문항 태그 | 교재 오답 |
| `class_material_assignments` | 반별 자료 배정 | 학생 포털 연결 |
| `student_material_submissions` | 학생 자료 제출 | 제출 후 수정 가능 정책 |
| `student_material_wrong_answers` | 자료 오답 | 일반 시험 OMR 수정 금지와 별개 |

## 6. migration 관계

`schema.sql`에는 여러 migration의 결과가 합쳐져 있다. `migrations/20260515_wangji_foundation_phase1.sql`, `20260515_wangji_billing_accounting_foundation.sql`, `20260518_timetable_versions_foundation.sql`, `20260520_timetable_version_classes_foundation.sql`, `20260516_study_material_wrongs.sql` 등은 schema와 중복 또는 보강 관계다. 실제 원격 적용 여부는 이번 문서 작업에서 확인하지 않았다.

