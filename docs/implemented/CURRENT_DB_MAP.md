# CURRENT_DB_MAP

## 0. Onboarding Tasks Round 1

| table | role | UI exposure |
|---|---|---|
| `onboarding_tasks` | 신입생 적응 확인 task foundation. `intro`, `week1`, `month1` task를 학생/enrollment 기준으로 보관한다. | Round 1에서는 DB/API foundation만 추가하며 UI에는 노출하지 않는다. |

`onboarding_tasks`는 `apmath/worker-backup/worker/migrations/20260527_onboarding_tasks.sql`와 `schema.sql`에 모두 반영되어 있다. 기본 중복 방지는 `UNIQUE(student_id, enrollment_id, task_type)`이며, `enrollment_id`가 없는 기존 데이터 호환은 `/api/onboarding/tasks/bootstrap`에서 `student_id + class_id + task_type + onboarding_started_at` 조회 후 insert하는 방식으로 방어한다.

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
| `exam_sessions` | 시험/OMR 세션 | AP Math 핵심 | `exam-sessions`, `student-portal` | `qr-omr.js`, `report-center.js`, `student/index.html` | 노출됨 | 제출 완료 수정 |
| `wrong_answers` | 오답 번호 | AP Math 핵심 | `exam-sessions`, `check-omr` | `qr-omr.js`, `report-center.js` | 노출됨 | 오답 리포트 |
| `questions` | 문항 메타 | AP Math 특화 | 확인 필요 | 확인 필요 | 확인 필요 | 데이터 불일치 |
| `consultations` | 상담 기록 | 운영 | `consultations` | `student.js`, `report-text.js` | 노출됨 | 개인정보 |
| `operation_memos` | 운영 메모 | 운영 | `operation-memos` | `dashboard.js` | 노출됨 | 내부 메모 노출 |
| `exam_schedules` | 시험 일정 | 운영 | `exam-schedules` | 확인 필요 | 노출 추정, 확인 필요 | 일정 회귀 |
| `academy_schedules` | 학원 일정 occurrence 및 반복/기간 시리즈 | 운영 | `academy-schedules`, `academy-schedules/batch`, `academy-schedules/series/:id` | `schedule.js`, dashboard | 노출됨 | target scope, series 단건/전체 mutation |
| `school_exam_records` | 학교시험 기록 | AP Math/운영 | `school-exam-records` | `cumulative.js` | 노출됨 | 성적 기록 |
| `exam_blueprints` | archive 문항 메타 | AP Math 특화 | `exam-blueprints` | `archive/*`, `report-center.js` | 노출됨 | archive 분석 |
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

## 7. 리포트 cohort 산출 기준

리포트 통계 cohort는 schema 변경 없이 기존 `exam_sessions.archive_file`, `exam_sessions.exam_title`, `exam_sessions.exam_date`, `exam_sessions.question_count`, `students.grade`, `classes.grade`, `wrong_answers`를 사용한다. 최우선 기준은 같은 연도의 같은 `archive_file`과 같은 학년이며, `archive_file`이 없으면 제목+날짜+문항 수, 제목+날짜 순서로 fallback한다.

## 8. academy_schedules 시리즈 컬럼

- `series_id`: 날짜별 occurrence를 묶는 논리 일정 ID. 기존 row는 migration에서 `id`로 백필한다.
- `series_kind`: `single`, `range`, `weekly`.
- `series_until`: 반복/기간 종료일 표시값.
- 인덱스: `idx_academy_schedules_series(series_id)`.
- 기준 migration: `apmath/worker-backup/worker/migrations/20260622_academy_schedules_series.sql`.

## 9. 2026-08-24 실제 schema/route 대조

- `schema.sql`에 선언된 테이블은 67개다. 기존 표에 별도 행이 없었던 `class_exam_assignment_exclusions`, `class_exam_assignment_recipients`, `exam_analysis_meta`, `exam_question_reviews`, `exam_student_reports`, `public_inquiries`, `student_report_archives`를 확인했다.
- `report_exam_cohort_stats`는 schema 테이블이 아니라 `initial-data`에서 Worker가 계산해 frontend `state.db`에 넣는 응답 key다.
- route가 사용하는 추가 저장소도 구분한다. 월별 시간표 snapshot은 `20260618_ap_timetable_month_snapshots.sql` 계열, EIE import/student 저장소는 EIE migrations, wrong clinic 저장소는 `wrong-clinics.js`의 ensure 단계에서 관리된다. 이 route-managed 저장소를 AP 기본 `schema.sql` 테이블로 오인하지 않는다.

## 10. 2026-08-24 Archive blueprint metadata bridge Phase 2A

- `exam_blueprints`의 기존 `archive_file + question_no` primary key와 canonical source identity(`source_question_uid`, `source_question_ordinal`)는 유지한다.
- Phase 2B/2C에서 채울 nullable additive columns를 `schema.sql`과 migration에 반영했다: `sub_unit_key`, `type_key`, `template_key`, `difficulty`, `metadata_revision`, `metadata_hash`.
- `sub_unit_key`와 `metadata_hash` 조회 인덱스를 추가했다. 기존 `concept_cluster_key`와 `type_key`/`difficulty` 호환 명칭을 우선 사용해 중복 필드 생성을 피한다.
- migration은 원격 D1에 적용하지 않았고 기존 blueprint 데이터도 변경하지 않았다. 기준 migration은 `apmath/worker-backup/worker/migrations/20260824_archive_blueprint_metadata_bridge.sql`이다.

## 11. 2026-08-24 Archive blueprint metadata bridge Phase 2B

- `syncExamBlueprintsFromArchive()`는 archive JS를 읽어 표준단원·세부단원·개념·문제유형·템플릿·난이도·tags·revision을 정규화하고, `metadata_revision`과 `metadata_hash`가 기존 행과 같을 때만 동기화를 건너뛴다.
- revision/hash가 다르면 기존 `archive_file + question_no` primary key를 유지한 채 upsert한다. 비교 키는 `source_question_ordinal`을 우선하고, migration 전 legacy row는 `question_no`로 보조 매칭한다. `source_question_uid`와 `source_question_ordinal`도 함께 보존한다.
- `problemTypeKey → type_key`, `difficultyBucket → difficulty`, `conceptClusterKey/conceptKey → concept_cluster_key` bridge alias를 사용한다. Phase 2A 컬럼이 아직 없는 원격 DB에서는 동적 컬럼 감지로 기존 동작을 유지한다.
- `exam-blueprints` POST와 `mixed_engine.html` payload도 동일한 메타데이터 필드를 전달하며, hash가 누락된 POST는 Worker가 동일 payload로 계산한다.
- 정적 계약 테스트와 canonical identity 회귀 테스트, Worker syntax check가 통과했다. 원격 D1 migration 적용·backfill dry-run·QR/OMR 실환경 회귀는 다음 단계로 남아 있다.

## 12. 2026-08-24 Archive blueprint metadata bridge Phase 2C/2D dry-run

- `archive/tools/intelligence/dry-run-archive-blueprint-backfill.mjs`를 추가했다. 로컬 D1 SQL export와 현재 archive JS를 읽기만 하며, 실제 D1 연결·UPDATE·DELETE·migration 실행은 하지 않는다.
- 보고서 `archive/_generated/intelligence/phase2/archive-blueprint-backfill-dry-run-v1.json`은 2026-06-22 stale export를 기준으로 920 blueprint rows·40 files를 확인했다. 입력 export에 `metadata_revision`·`metadata_hash`가 없어 `BLOCKED_SCHEMA_MISSING`으로 판정했다.
- source file은 exact path 우선, 고유 basename fallback을 구분한다. MIXED는 `MIXED_NO_ARCHIVE_SOURCE`, 현재 archive에서 찾지 못한 stale 파일은 `SOURCE_FILE_MISSING`으로 별도 분리했다.
- 따라서 보고서의 805 `updateRequired`는 production backfill 승인 수치가 아니라 Phase 2A 이전 export의 schema gap inventory다. 현재 D1 migration 적용 후 새 export로 재실행해야 실제 hash diff를 판정할 수 있다.

## 13. 2026-08-24 Archive blueprint backfill SQL plan Phase 2E 준비

- dry-run 도구의 `--sql-out`은 metadata 및 canonical identity schema가 모두 준비된 export에서만 review-only UPSERT SQL을 생성한다.
- SQL은 기존 primary key를 유지하고 unchanged 행은 제외한다. 도구는 SQL을 실행하거나 D1에 접속하지 않는다.
- 현재 stale export는 schema guard로 거부되며, 최신 D1 export·sample review 전에는 batch backfill을 승인하지 않는다.

## 14. 2026-08-24 Archive blueprint backfill sample review

- `review-archive-blueprint-backfill-sample.mjs`가 dry-run diff 300건을 현재 archive JS와 재대조한다. source ordinal·문항번호·hash가 모두 일치하는지 확인하며 D1을 읽거나 쓰지 않는다.
- 현재 sample 결과는 300/300 `SOURCE_HASH_STABLE`이다. stale schema 상태는 그대로 `BLOCKED_SCHEMA_MISSING`으로 보존한다.

## 15. 2026-08-24 Archive blueprint backfill batch safety gate

- `validate-archive-blueprint-backfill-plan.mjs`는 SQL을 실행하지 않고 destructive keyword, 기존 primary key UPSERT 형식, 계획 문장 수만 검증한다.
- 최신 schema export가 없으면 batch review를 차단하는 것이 정상이며, 현재 상태도 `BLOCKED_SCHEMA_MISSING`이다.

## 16. 2026-08-24 Archive blueprint QR/OMR regression baseline

- archive-backed assignment/blueprint/result-item/QR/OMR 정적 회귀 7개를 backfill 전 기준선으로 통과시켰다.
- 이 결과는 post-backfill 검증이 아니며, 실제 batch/post-audit 후 동일 범위를 재실행해야 한다.

## 17. 2026-08-24 Archive blueprint post-audit 준비

- `audit-archive-blueprint-backfill.mjs`는 batch 이후 export를 읽기만 하며 schema readiness, metadata diff zero, source missing/parse error, MIXED identity 검토 상태를 판정한다.
- 현재 export에서는 `BLOCKED_SCHEMA_MISSING`을 반환한다. zero-diff schema-ready fixture만 `POST_AUDIT_PASS`로 확인했다.

## 18. 2026-08-24 Archive blueprint migration·Worker 배포

- 원격 D1 migration ledger에 `20260820_exam_blueprint_canonical_question_identity.sql`(id 2) → `20260824_archive_blueprint_metadata_bridge.sql`(id 3) 순서가 기록됐다.
- deployed baseline에 이미 있던 `type_key`·`difficulty`는 중복 추가하지 않고, 두 번째 migration은 `sub_unit_key`, `template_key`, `metadata_revision`, `metadata_hash`와 조회 인덱스만 추가했다. identity 2개와 metadata 6개 호환 컬럼이 모두 원격에 존재한다.
- `ap-math-os-v2612` Worker는 dry-run 후 production에 배포됐고 version ID는 `b3b4b8fa-f4f7-46b3-8f21-9da16820867a`다. 데이터 backfill은 아직 수행하지 않았다.
