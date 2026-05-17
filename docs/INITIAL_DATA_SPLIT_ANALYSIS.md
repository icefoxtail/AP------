# initial-data 분리 사전 분석

## 1. 분석 목적

`/api/initial-data`는 로그인 직후 `apmath/js/core.js`의 `loadData()`에서 한 번에 받아 `state.db`를 구성하는 핵심 응답이다. 이 문서는 응답 축소나 API 분리 구현 전에, 현재 응답 키와 프론트 사용처를 실제 코드 기준으로 정리해 안전한 분리 순서를 정하기 위한 사전 분석이다.

이번 작업에서는 `/api/initial-data` 응답 구조, 쿼리, 프론트 API 호출, 렌더 흐름, 라우트, DB 스키마, migration을 변경하지 않았다.

## 2. 현재 initial-data 응답 구성

| response key | DB table/calculated source | purpose | first-screen required? | split priority? | cautions |
| --- | --- | --- | --- | --- | --- |
| `students` | `students` | 학생 목록, 대시보드 집계, 반/학생 관리, 성적/상담/리포트 기준 데이터 | 예 | 낮음 | 대부분 화면이 공통으로 기대한다. 먼저 줄이면 빈 화면 위험이 크다. |
| `classes` | `classes` | 반 목록, 권한 범위, 대시보드/수업/관리/리포트 기본 축 | 예 | 낮음 | 첫 화면과 메뉴 이동 대부분의 기준이다. |
| `class_students` | `class_students` | 반-학생 매핑, 반별 학생 산출, 대시보드/수업/리포트 필터 | 예 | 낮음 | `students`, `classes`와 함께 atomic하게 다뤄야 한다. |
| `attendance` | `attendance` 오늘자 | 오늘 출결 상태, 대시보드 카드, 수업 화면 체크 | 예 | 낮음 | 첫 화면 운영 카드에 필요하다. 별도 API화 전 fallback 필요. |
| `homework` | `homework` 오늘자 | 오늘 숙제 상태, 대시보드 카드, 수업 화면 체크 | 예 | 낮음 | 출결과 함께 자주 갱신된다. |
| `exam_sessions` | `exam_sessions` 최신 500건, 교사 300건 | 성적 현황, 학생 상세, 수업 성적, 리포트 | 부분 예 | 중간 | 초기 대시보드 위험 학생/최근 성적에 쓰인다. 범위 축소가 먼저 안전하다. |
| `wrong_answers` | `wrong_answers` | 오답 분석, QR OMR, 리포트, 수업/학생 상세 | 아니오 | 높음 | 용량이 커질 가능성이 높고 화면 진입 후 로드 후보다. 리포트 진입 전 로딩 처리가 필요하다. |
| `attendance_history` | 최근 14일 `attendance` | 대시보드 위험 산출, 누적 출결 분석 | 부분 예 | 중간 | 대시보드 위험 카드가 의존한다. 기간 API로 대체 가능하다. |
| `homework_history` | 최근 14일 `homework` | 대시보드 위험 산출, 누적 숙제 분석 | 부분 예 | 중간 | 출결 이력과 동일하게 기간 API 후보다. |
| `consultations` | `consultations` | 상담 기록, 학생 상세, 리포트, 대시보드 메모성 정보 | 아니오 | 높음 | 학생 상세/리포트 진입 시 로드 가능하다. |
| `operation_memos` | `operation_memos` by teacher | 운영 메모, 대시보드 할 일/고정 메모 | 예 | 낮음 | 첫 화면 운영 메모에 직접 노출된다. |
| `exam_schedules` | `exam_schedules` | 시험 일정, 대시보드 일정, 일정 화면 | 예 | 낮음 | 첫 화면 일정 카드가 참조한다. |
| `academy_schedules` | `academy_schedules` filtered | 학원 일정, 대시보드/수업 일정, 일정 화면 | 예 | 낮음 | 첫 화면과 수업 화면에 모두 노출된다. |
| `school_exam_records` | `school_exam_records` | 내신 기록, 누적/학생 분석 | 아니오 | 높음 | 화면 진입 후 로드하기 좋다. |
| `journals` | `daily_journals` | 일지/대시보드 기록 영역 | 부분 예 | 중간 | 대시보드에서 사용하므로 초기 제외 전 화면 분리 확인 필요. |
| `class_textbooks` | `class_textbooks` | 교재 관리, 수업 일일 기록, 시간표 표시 | 부분 예 | 중간 | `timetable_class_textbooks`와 중복/대체 관계를 확인해야 한다. |
| `class_daily_records` | `class_daily_records` 최근 1000건 | 수업 일지, 학생 상세, 리포트 | 아니오 | 높음 | 수업/리포트 진입 시 로드 후보다. |
| `class_daily_progress` | `class_daily_progress` 최근 3000건 | 수업 진도, 학생 상세, 리포트 | 아니오 | 높음 | 용량이 커질 수 있어 분리 효과가 크다. |
| `timetable_classes` | active `classes` subset | 시간표 전용 반 목록 | 예 | 낮음 | `refreshDataOnly()`가 따로 병합한다. 시간표 화면 안정성이 중요하다. |
| `timetable_class_students` | `class_students` 전체 | 시간표 전용 매핑 | 예 | 낮음 | 교사 권한과 시간표 전역 표시가 분리되어 있어 섣불리 축소하면 안 된다. |
| `timetable_students` | `students` subset | 시간표 전용 학생 이름/상태 | 예 | 낮음 | 비관리자도 시간표 전역 표시를 위해 받는다. |
| `timetable_class_textbooks` | `class_textbooks` 전체 또는 admin은 `txt` | 시간표 교재 표시 | 예 | 낮음 | admin/non-admin 반환 소스가 다르다. |
| `student_enrollments` | foundation `student_enrollments` | 등록/수강 foundation 데이터 | 아니오 | 높음 | 관리 foundation 화면 진입 후 별도 로드 후보다. |
| `class_time_slots` | foundation `class_time_slots` | 시간표 슬롯 foundation 데이터 | 부분 예 | 중간 | 시간표 충돌/슬롯 기능과 결합되어 있어 API 설계 후 분리한다. |
| `timetable_conflict_logs` | foundation conflict logs | 시간표 충돌 로그 | 아니오 | 높음 | 로그성 데이터라 지연 로드 적합. |
| `timetable_conflict_overrides` | foundation conflict overrides | 시간표 충돌 예외 | 아니오 | 중간 | 충돌 판단에 즉시 필요하면 캐시/동기화 필요. |
| `billing_templates` | foundation `billing_templates` | 청구 템플릿 | 아니오 | 높음 | 관리 모달 진입 시 로드 후보. |
| `payments` | foundation `payments` | 결제/청구 조회 | 아니오 | 높음 | admin 1000건, 교사 500건 제한. 분리 효과 큼. |
| `payment_items` | foundation `payment_items` | 결제 항목 상세 | 아니오 | 높음 | admin만 현재 로드, 교사는 빈 배열. |
| `billing_adjustments` | foundation `billing_adjustments` | 청구 조정 | 아니오 | 높음 | 관리 화면 전용. |
| `billing_runs` | foundation `billing_runs` | 청구 실행 이력 | 아니오 | 높음 | 관리 화면 전용. |
| `payment_methods` | foundation `payment_methods` | 결제수단 설정 | 아니오 | 높음 | 설정/관리 진입 시 로드 가능. |
| `payment_transactions` | foundation `payment_transactions` | 결제 트랜잭션 | 아니오 | 높음 | admin 1000건 제한, 분리 우선 후보. |
| `cashbook_entries` | foundation `cashbook_entries` | 현금출납 | 아니오 | 높음 | 회계 화면 전용. |
| `refund_records` | foundation `refund_records` | 환불 기록 | 아니오 | 높음 | 회계 화면 전용. |
| `carryover_records` | foundation `carryover_records` | 이월 기록 | 아니오 | 높음 | 회계 화면 전용. |
| `billing_policy_rules` | foundation `billing_policy_rules` | 청구 정책 | 아니오 | 높음 | 설정/관리 진입 시 로드 가능. |
| `accounting_daily_summaries` | foundation summaries | 일별 회계 요약 | 아니오 | 높음 | 별도 요약 API가 더 적합. |
| `accounting_monthly_summaries` | foundation summaries | 월별 회계 요약 | 아니오 | 높음 | 별도 요약 API가 더 적합. |
| `parent_contacts` | foundation `parent_contacts` | 학부모 연락처 | 아니오 | 높음 | 학생/관리 상세 진입 시 로드 후보. |
| `message_logs` | foundation `message_logs` | 문자/알림 로그 | 아니오 | 높음 | 로그성 데이터라 지연 로드 적합. |
| `student_status_history` | foundation history | 학생 상태 이력 | 아니오 | 높음 | 학생 상세/관리 진입 시 로드 후보. |
| `class_transfer_history` | foundation history | 반 이동 이력 | 아니오 | 높음 | 학생 상세/관리 진입 시 로드 후보. |
| `staff_permissions` | foundation `staff_permissions` | 직원 권한 | 부분 예 | 중간 | 권한 UI나 관리 제어가 의존할 수 있어 분리 전 guard 필요. |

참고: `apmath/js/core.js`는 `exam_blueprints`도 `state.db`에 넣지만 현재 `/api/initial-data` 반환부에는 직접 키가 보이지 않는다. 기존 별도 시험 API와의 병합 또는 과거 호환 키일 수 있으므로, 분리 작업 때 제거 대상으로 보지 말고 호환성 검증 항목으로 둔다.

## 3. 프론트엔드 파일별 데이터 사용 맵

| frontend file | used keys | functions/screens | first-screen required? | lazy-load candidate? | split risk? | notes |
| --- | --- | --- | --- | --- | --- | --- |
| `apmath/js/core.js` | `classes`, `students`, `class_students`, today `attendance`, today `homework`, `exam_sessions`, `wrong_answers`, histories, operation/schedule/journal/class daily/timetable keys | `loadData()`, `refreshDataOnly()`, 공통 `state.db` 구성 | 예 | 일부만 | 높음 | 모든 화면의 데이터 계약을 만든다. 분리 시에도 `state.db` shape 유지와 merge 로더가 필요하다. |
| `apmath/js/dashboard.js` | `students`, `classes`, `class_students`, `attendance`, `homework`, histories, `exam_sessions`, `consultations`, `operation_memos`, schedules, `journals`, class daily keys | 로그인 후 기본 대시보드, 위험/일정/메모/수업 요약 | 예 | 일부 | 높음 | 첫 화면 의존도가 가장 높다. 대시보드에 남길 최소 키를 먼저 고정해야 한다. |
| `apmath/js/classroom.js` | `classes`, `class_students`, `students`, today `attendance`, today `homework`, `consultations`, `class_textbooks`, class daily keys, `exam_sessions`, `wrong_answers`, `academy_schedules` | 수업 화면, 출결/숙제 체크, 진도/상담/성적 | 부분 예 | 예 | 중간 | 수업 진입 후 class-scoped API로 점진 분리 가능하다. 오늘 출결/숙제는 즉시성이 중요하다. |
| `apmath/js/cumulative.js` | `students`, `classes`, `class_students`, `attendance`, `homework`, `consultations`, `school_exam_records` | 누적 출결/숙제/내신 분석 | 아니오 | 예 | 낮음 | 이미 `attendance-history`, `attendance-month` 같은 별도 API를 사용한다. |
| `apmath/js/management.js` | `students`, `classes`, `class_students`, foundation billing/accounting 계열 | 학생/반 관리, foundation 관리 모달 | 부분 예 | 예 | 중간 | 학생/반 기본 관리는 초기 키가 필요하지만 billing/accounting은 진입 후 API가 적합하다. |
| `apmath/js/student.js` | `students`, `class_students`, `classes`, `exam_sessions`, `wrong_answers`, `consultations`, class daily keys | 학생 상세, 성적/오답/상담/수업 기록 | 아니오 | 예 | 중간 | 학생 상세 진입 시 student-scoped 로드 후보. |
| `apmath/js/qr-omr.js` | `class_students`, `exam_sessions`, `class_exam_assignments` 또는 `exam_assignments`, `classes`, `students`, `wrong_answers` | QR OMR, 시험 배정/성적 처리 | 아니오 | 예 | 중간 | `class_exam_assignments`는 initial-data 명시 반환 키가 아니므로 별도 시험 API와 호환 확인 필요. |
| `apmath/js/report.js` | `exam_sessions`, `students`, `attendance`, `homework`, `wrong_answers`, `class_students`, `classes`, class daily keys, `consultations`, `questions`, `exam_blueprints` | 리포트 생성/분석 | 아니오 | 예 | 중간 | 리포트 화면 진입 후 필요한 학생/기간 범위로 로드하는 것이 적합하다. |
| `apmath/js/schedule.js` | `exam_schedules`, `academy_schedules` | 시험/학원 일정 화면 | 예 | 아니오 | 중간 | 대시보드에도 필요해 초기 유지가 안전하다. |
| `apmath/js/textbook.js` | `class_textbooks`, `classes` | 교재 관리 | 아니오 | 예 | 낮음 | 교재 화면 진입 시 로드 후보지만 시간표 교재 키와 중복 관계 확인 필요. |
| `apmath/student/index.html` | 파일 없음 | 요청 경로가 현재 워크트리에 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 실제 존재 파일은 `apmath/homework/index.html`, `apmath/planner/index.html`, `apmath/index.html`이다. |
| `apmath/planner/index.html` | initial-data 직접 사용 없음 | `planner-auth-by-name`, `planner-auth`, `planner`, `planner/settings` 직접 호출 | 아니오 | 이미 분리됨 | 낮음 | 독립 학생 플래너 앱이다. `/api/initial-data`와 분리되어 있다. |

## 4. 첫 화면 필수 데이터

첫 화면은 `loadData(true)` 후 admin이면 `renderAdminControlCenter()`, 일반 교사면 `renderDashboard()`로 들어간다. 현재 기준으로 초기 유지가 안전한 데이터는 다음이다.

- 기본 축: `students`, `classes`, `class_students`
- 오늘 운영: `attendance`, `homework`
- 첫 화면 일정/메모: `operation_memos`, `exam_schedules`, `academy_schedules`
- 대시보드 위험/요약에 쓰이는 제한 데이터: `attendance_history`, `homework_history`, 최근 `exam_sessions`
- 시간표 즉시 표시와 refresh 병합 대상: `timetable_classes`, `timetable_class_students`, `timetable_students`, `timetable_class_textbooks`

## 5. 화면 진입 또는 별도 API로 로드 가능한 데이터

- 성적/오답 상세: `wrong_answers`, 상세 범위 `exam_sessions`
- 상담/학생 상세: `consultations`, `parent_contacts`, `student_status_history`, `class_transfer_history`
- 수업 기록/진도: `class_daily_records`, `class_daily_progress`
- 누적/내신: `school_exam_records`
- 교재 관리: `class_textbooks`
- foundation billing/accounting: `payments`, `payment_items`, `billing_adjustments`, `billing_runs`, `payment_methods`, `payment_transactions`, `cashbook_entries`, `refund_records`, `carryover_records`, `billing_policy_rules`, summaries
- 로그/관리성 데이터: `message_logs`, `timetable_conflict_logs`

## 6. 분리 금지 또는 보류 데이터

초기 1차 분리에서 바로 제거하면 위험한 데이터는 다음이다.

- `students`, `classes`, `class_students`: 거의 모든 화면의 기준 데이터다.
- `attendance`, `homework`: 대시보드와 수업 화면의 즉시 운영 상태다.
- `operation_memos`, `exam_schedules`, `academy_schedules`: 첫 화면에 직접 노출된다.
- `timetable_*`: 별도 권한/전역 표시 로직이 섞여 있고 `refreshDataOnly()`가 병합한다.
- `exam_blueprints`, `questions`, `class_exam_assignments`: 현재 프론트 참조는 있으나 initial-data 직접 반환과 일치하지 않는다. 제거/축소 판단 대상이 아니라 호환성 점검 대상이다.

## 7. 1차 분리 후보

1차는 첫 화면과 무관하고 용량이 커질 가능성이 큰 키부터 별도 read-only API로 추가하는 것이 안전하다.

- billing/accounting foundation 묶음: `payments`, `payment_items`, `payment_transactions`, `cashbook_entries`, `refund_records`, `carryover_records`, `accounting_daily_summaries`, `accounting_monthly_summaries`
- 로그/이력 묶음: `message_logs`, `timetable_conflict_logs`, `student_status_history`, `class_transfer_history`
- 상세 화면 묶음: `wrong_answers`, `consultations`, `school_exam_records`

## 8. 2차 분리 후보

2차는 화면별 로더와 캐시가 준비된 뒤 진행한다.

- `class_daily_records`, `class_daily_progress`: 수업/학생/리포트 화면 진입 시 class/student scoped로 로드한다.
- `class_textbooks`: 교재 관리 API 또는 class scoped API로 분리하되 `timetable_class_textbooks`와 표시 차이를 확인한다.
- `student_enrollments`, `billing_templates`, `billing_policy_rules`, `parent_contacts`: 관리/학생 상세 진입 시 로드한다.

## 9. 3차 분리 또는 장기 보류

- `attendance_history`, `homework_history`: 대시보드 위험 카드가 안정적으로 별도 기간 API를 기다릴 수 있을 때 분리한다.
- `exam_sessions`: 첫 화면 최근 성적 요약과 상세 화면이 나뉜 뒤 최근 N건만 초기 유지하거나 화면별 범위 API로 전환한다.
- `class_time_slots`, `timetable_conflict_overrides`, `staff_permissions`: 권한과 시간표 표시/충돌 판단에 연결될 수 있어 영향 분석 후 진행한다.
- `timetable_*`: 시간표 전역 표시 정책이 명확해질 때까지 장기 보류한다.

## 10. 권장 분리 설계

구현 순서는 “초기 응답 축소”가 아니라 “read-only API 추가”가 먼저다.

- 당분간 `/api/initial-data`는 현 구조를 유지한다.
- 새 API는 화면/도메인 단위로 추가한다. 예: `billing-accounting-foundation`, `student-detail-data`, `class-daily-data`, `wrong-answer-data`.
- 프론트는 `state.db` 구조를 유지하고, 지연 로드 결과를 `state.db = { ...state.db, key: rows }` 방식으로 병합한다.
- 각 lazy loader는 `loading`, `loadedAt`, `error`, `scopeKey`를 가진 작은 캐시 상태를 둔다.
- 실패 시 기존 initial-data에 남아 있는 데이터가 있으면 그대로 표시하고, 신규 API 실패는 해당 패널에만 재시도 UI를 둔다.
- initial-data에서 실제로 키를 제거하는 단계는 read-only API, 로더, 캐시, 실패 처리, 화면별 검증이 모두 끝난 뒤 별도 작업으로 진행한다.

## 11. 권장 순서

1. 이 문서를 기준으로 첫 화면 유지 키를 확정한다.
2. billing/accounting, 로그/이력, 상세 데이터용 read-only API를 추가한다.
3. management/student/report/classroom 화면에 lazy loader를 추가하되 `state.db` shape는 유지한다.
4. 각 화면에서 초기 데이터가 없어도 로딩/빈 상태/실패 상태가 깨지지 않는지 검증한다.
5. 계측 또는 diff 확인 뒤 `/api/initial-data`에서 1차 후보만 제거하는 별도 작업을 진행한다.
6. 대시보드 위험 산출과 시간표는 마지막에 다룬다.

## 12. 검증 체크리스트

- 로그인 직후 admin/teacher 첫 화면이 기존과 동일하게 렌더되는가.
- `state.db`에 기존 키가 없을 때도 각 화면이 빈 배열 fallback으로 동작하는가.
- 대시보드 위험 카드가 `attendance_history`, `homework_history`, `exam_sessions` 지연 로드 중에도 깨지지 않는가.
- 수업 화면 출결/숙제 체크가 오늘 데이터와 동기화되는가.
- 학생 상세/리포트/QR OMR에서 `wrong_answers`, `exam_sessions` 로딩 실패 시 안내가 있는가.
- 시간표가 admin/non-admin 모두 같은 범위로 표시되는가.
- foundation billing/accounting 모달이 API 일부 실패에도 렌더 가능한가.
- `/api/initial-data` 응답 키 제거 전후로 `git diff`와 수동 화면 검증 항목이 남아 있는가.

## 13. 결론

지금 바로 `/api/initial-data`를 줄이는 것은 권장하지 않는다. 첫 화면과 공통 `state.db` 계약이 강하게 결합되어 있어, 응답 축소보다 read-only API와 화면별 lazy loader를 먼저 추가하는 편이 안전하다.

가장 안전한 1차 후보는 billing/accounting foundation 데이터, 로그/이력 데이터, `wrong_answers`, `consultations`, `school_exam_records` 같은 상세 화면 중심 데이터다. 위험한 후보는 `students`, `classes`, `class_students`, 오늘 `attendance`/`homework`, 일정/메모, `timetable_*`, 대시보드 위험 산출 데이터다.

다음 작업 지시는 “`/api/initial-data`를 줄여라”가 아니라 “1차 분리 후보에 대한 read-only API와 lazy loader를 추가하되 initial-data 응답은 유지하라”로 두는 것이 안전하다.

## 14. 수납·출납 foundation 1차 분리 준비 평가

이번 평가는 `/api/initial-data`에서 수납·출납 foundation key를 실제로 제거하지 않고, 다음 작업에서 제거 판단이 가능한 준비 상태만 확인했다. `/api/initial-data` 응답 구조와 SQL query는 유지되어야 하며, `apmath/worker-backup/worker/index.js`의 initial-data 반환부는 이번 단계에서 수정하지 않는다.

### initial-data 유지 상태

- `loadFoundationInitialData(env, teacher)`가 billing/accounting foundation key를 계속 initial-data에 포함한다.
- admin은 전체 foundation 데이터를 받되 `payments`, `payment_transactions`, `cashbook_entries`, `refund_records`, `carryover_records`, `accounting_*_summaries` 등은 `LIMIT 1000` 또는 `LIMIT 2000`이 걸려 있다.
- teacher는 권한 class/student 범위로 `payments`, `parent_contacts`, `message_logs`, 학생 상태/반 이동 이력을 일부 받지만, `payment_items`, `billing_adjustments`는 빈 배열이고 많은 accounting key는 빈 배열 상태다.
- 다음 단계 전까지 initial-data에서 아래 key를 제거하지 않는다.

### 기존 API coverage 표

| data key | current initial-data source | replacement API | frontend lazy loader | removal readiness | risk | note |
| --- | --- | --- | --- | --- | --- | --- |
| `billing_templates` | `billing_templates`, admin 전체 / teacher class 범위 | 명확한 동일 조회 API 없음 | 없음 | blocked | 중간 | 기존 `billing-preview`는 preview 계산용이며 목록 대체가 아니다. |
| `payments` | `payments`, admin `LIMIT 1000` / teacher student 범위 `LIMIT 500` | 명확한 동일 조회 API 없음 | 없음 | blocked | 높음 | 이번 1차 후보 목록이지만 route coverage가 부족하다. |
| `payment_items` | `payment_items`, admin `LIMIT 2000` / teacher 빈 배열 | 명확한 동일 조회 API 없음 | 없음 | blocked | 높음 | 결제 상세 목록 API가 필요하다. |
| `billing_adjustments` | `billing_adjustments`, admin `LIMIT 1000` / teacher 빈 배열 | 명확한 동일 조회 API 없음 | 없음 | blocked | 중간 | adjustment 조회 API가 없다. |
| `billing_runs` | `billing_runs`, admin 전체 / teacher 빈 배열 | 명확한 동일 조회 API 없음 | 없음 | blocked | 중간 | run 이력 조회 API가 없다. |
| `payment_methods` | `payment_methods` | `billing-accounting-foundation/payment-methods` | `billingAccountingFetchAll()` | ready | 낮음 | GET, POST, PATCH, deactivate가 있다. |
| `payment_transactions` | `payment_transactions`, admin `LIMIT 1000` | `billing-accounting-foundation/payment-transactions` alias `transactions` | `billingAccountingFetchAll()` | almost ready | 중간 | GET/POST/PATCH/cancel, branch/status/student/date/limit 필터가 있다. |
| `cashbook_entries` | `cashbook_entries`, admin `LIMIT 1000` | `billing-accounting-foundation/cashbook-entries` alias `cashbook` | `billingAccountingFetchAll()` | almost ready | 중간 | GET/POST/PATCH/cancel, branch/status/student/date/limit 필터가 있다. |
| `refund_records` | `refund_records`, admin `LIMIT 1000` | `billing-accounting-foundation/refund-records` alias `refunds` | `billingAccountingFetchAll()` | almost ready | 중간 | GET/POST/PATCH/cancel, branch/status/student/date/limit 필터가 있다. |
| `carryover_records` | `carryover_records`, admin `LIMIT 1000` | `billing-accounting-foundation/carryover-records` alias `carryovers` | `billingAccountingFetchAll()` | almost ready | 중간 | GET/POST/PATCH/cancel, branch/status/student/date/limit 필터가 있다. |
| `billing_policy_rules` | `billing_policy_rules` | `billing-accounting-foundation/billing-policy-rules` alias `policy-rules` | `billingAccountingFetchAll()` | ready | 낮음 | GET, POST, PATCH, deactivate가 있고 `branch`, `rule_type`, `active`, `limit` 필터가 있다. |
| `accounting_daily_summaries` | `accounting_daily_summaries`, admin `LIMIT 1000` | `billing-accounting-foundation/accounting-daily-summaries` alias `daily-summaries` | `billingAccountingFetchAll()` | ready | 낮음 | GET, branch/date/limit 필터가 있다. |
| `accounting_monthly_summaries` | `accounting_monthly_summaries`, admin `LIMIT 1000` | `billing-accounting-foundation/accounting-monthly-summaries` alias `monthly-summaries` | `billingAccountingFetchAll()` | ready | 낮음 | GET, branch/year/month/limit 필터가 있다. |

### 필요 API coverage 확인 결과

- `payment-methods`, `billing-policy-rules`, `payment-transactions`, `cashbook-entries`, `refund-records`, `carryover-records`, `accounting-daily-summaries`, `accounting-monthly-summaries`, `accounting-summary`, `billing-preview`는 기존 `routes/billing-accounting-foundation.js`에서 처리된다.
- route alias는 `billing-policy-rules -> policy-rules`, `payment-transactions -> transactions`, `cashbook-entries -> cashbook`, `refund-records -> refunds`, `carryover-records -> carryovers`, `accounting-summary -> summary`, `accounting-daily-summaries -> daily-summaries`, `accounting-monthly-summaries -> monthly-summaries`로 연결된다.
- route 시작부에서 `isAdminUser(teacher)`가 아니면 403을 반환하므로 admin 전용 차단은 유지된다.
- 조회 API에는 `limit`가 공통으로 있고, 거래/출납/환불/이월 계열에는 `student_id`, `branch`, `status`, 날짜 범위 alias(`date_from`, `date_to`, `from`, `to`, `start_date`, `end_date`)가 있다.
- `accounting-summary`는 DB summary를 직접 갱신하지 않고 기존 `payments`, `payment_items`, `payment_transactions`, `refund_records`, `carryover_records`, `cashbook_entries`를 읽어 계산한 응답을 반환한다.
- `billing_templates`, `payments`, `payment_items`, `billing_adjustments`, `billing_runs`는 initial-data를 완전히 대체할 동일 목록 조회 API가 아직 부족하다.

### 프론트 lazy loader 상태

- `management.js`의 `openBillingAccountingFoundationModal()`은 admin만 통과시키고, 모달 렌더 후 `billingAccountingFetchAll()`을 호출한다.
- `billingAccountingFetchAll()`은 existing `billing-accounting-foundation` API만 사용한다.
- 이번 준비 작업에서 `state.ui.billingAccountingFoundation.loadedAt`을 추가해 성공적으로 받은 응답이 하나 이상 있으면 로드 시각을 기록하도록 했다.
- 일부 API가 실패하거나 `{ error }`, `{ success: false }`를 반환하면 해당 응답은 실패로 분류하고, 기존 성공 데이터는 유지한 채 오류 안내만 표시하도록 보강했다.
- `state.db`의 billing/accounting foundation key를 참조하지 않고 모달 내부 `state.ui.billingAccountingFoundation` 캐시에만 로드한다.

### state.db 보존성

- `state.db` shape는 변경하지 않았다.
- initial-data 응답 key를 제거하지 않았다.
- `core.js`의 `loadData()`와 `refreshDataOnly()`는 변경하지 않았다.
- lazy-loaded foundation 데이터는 `state.db`에 병합하지 않고 모달 UI 상태에만 둔다.

### 숨김 상태 유지 여부

- `dashboard.js`의 `showBillingAccountingFoundationEntry = false` 상태를 확인했다.
- 대시보드/관리 메뉴에 수납·출납 foundation 버튼을 다시 노출하지 않았다.
- 운영 화면 진입 경로와 기존 메뉴 구조를 변경하지 않았다.

### 실제 제거 전 체크리스트

- `billing_templates`, `payments`, `payment_items`, `billing_adjustments`, `billing_runs`를 대체할 read-only GET API가 준비되어야 한다.
- management modal이 initial-data에 해당 key가 전혀 없는 상태에서도 열리는지 확인해야 한다.
- admin/teacher 권한 차이가 initial-data 제거 후에도 같은 정책으로 유지되는지 확인해야 한다.
- `dashboard.js`, `classroom.js`, `student.js`, `report.js`, `management.js`에서 해당 key가 없어도 화면이 깨지지 않는지 확인해야 한다.
- 운영 노출 숨김 상태(`showBillingAccountingFoundationEntry = false`)를 유지한 채 내부 검증을 진행해야 한다.
- 실제 initial-data 축소는 별도 작업에서 `git diff --name-only`와 화면별 수동 검증을 남겨야 한다.

### 다음 작업 추천

다음 작업은 initial-data 제거가 아니라, 부족한 replacement API를 먼저 채우는 작업이어야 한다. 특히 `billing_templates`, `payments`, `payment_items`, `billing_adjustments`, `billing_runs` 조회 API를 기존 route 안에서 read-only 중심으로 보강한 뒤, management modal의 lazy loader가 이 key들을 모두 API로 받을 수 있는지 확인하는 순서가 안전하다.

## 15. 수납·출납 foundation blocked key read-only API 보강 결과

이번 작업은 14절에서 `blocked`로 남아 있던 key의 replacement API coverage를 채우는 작업이다. `/api/initial-data` 응답 구조, initial-data SQL query, `core.js`의 `state.db` 구성, 대시보드/관리 메뉴 노출 상태는 변경하지 않았다.

### 추가된 read-only API

| data key | replacement API | method | response key | 주요 필터 | removal readiness | note |
| --- | --- | --- | --- | --- | --- | --- |
| `billing_templates` | `billing-accounting-foundation/billing-templates` | GET only | `billing_templates` | `branch`, `active`/`is_active`, `item_type`/`template_type`, `limit` | almost ready | schema 기준 실제 컬럼은 `item_type`이므로 `template_type`은 query alias로만 처리한다. |
| `payments` | `billing-accounting-foundation/payments` | GET only | `payments` | `student_id`, `branch`, `year`, `month`, `status`, date range, `limit` | almost ready | `payments`에는 직접 `branch`가 없어 `payment_items`의 branch를 `EXISTS`로 필터링한다. |
| `payment_items` | `billing-accounting-foundation/payment-items` | GET only | `payment_items` | `payment_id`, `student_id`, `branch`, `item_type`, `limit` | almost ready | `student_id`는 `payments` join 조건으로만 필터링한다. |
| `billing_adjustments` | `billing-accounting-foundation/billing-adjustments` | GET only | `billing_adjustments` | `payment_id`, `student_id`, `adjustment_type`, date range, `limit` | almost ready | 생성/수정 API는 추가하지 않았다. |
| `billing_runs` | `billing-accounting-foundation/billing-runs` | GET only | `billing_runs` | `branch`, `year`, `month`, `status`, `limit` | almost ready | 실행 버튼, 자동 청구 생성, run 생성은 추가하지 않았다. |

### route coverage 변경

- 기존 `routes/billing-accounting-foundation.js` 안에만 GET 조회를 추가했다.
- 새 route 파일은 만들지 않았다.
- `normalizeFoundationSub()`에 underscore alias를 추가해 `billing_templates`, `payment_items`, `billing_adjustments`, `billing_runs`도 대응되게 했다.
- 기존 `payment-methods`, `policy-rules`, `transactions`, `cashbook`, `refunds`, `carryovers`, summaries alias는 변경하지 않았다.
- handler 상단의 admin-only 403 차단을 그대로 사용한다.

### management.js lazy loader 변경

- `state.ui.billingAccountingFoundation`에 다음 모달 내부 캐시 배열을 추가했다: `billingTemplates`, `payments`, `paymentItems`, `billingAdjustments`, `billingRuns`.
- `billingAccountingFetchAll()` 요청 목록에 신규 GET API 5개를 추가했다.
- 받은 데이터는 `state.db`에 병합하지 않고 모달 내부 상태에만 저장한다.
- 새 데이터 섹션, 새 버튼, 새 메뉴, 대시보드 노출은 추가하지 않았다.

### 아직 initial-data에서 제거하지 않는 이유

- API와 lazy loader coverage는 갖췄지만, 실제 `/api/initial-data` 축소 전에는 화면별 수동 검증이 남아 있다.
- admin/teacher 첫 화면, `dashboard.js`, `classroom.js`, `student.js`, `report.js`, `management.js`에서 해당 key가 없어도 깨지지 않는지 별도 작업에서 확인해야 한다.
- 이번 작업은 read-only API coverage 보강이며, 실제 initial-data key 제거는 별도 작업으로 진행해야 한다.

### 다음 단계 검증

- API 단위 문법 검증: `node --check apmath/worker-backup/worker/routes/billing-accounting-foundation.js`
- 프론트 문법 검증: `node --check apmath/js/management.js`
- 운영 API smoke test와 Worker 배포는 사용자가 직접 지시할 때만 진행한다.
- 실제 initial-data 축소 지시서에서는 신규 API 5개 응답과 initial-data 제거 후 모달 로딩을 비교 검증해야 한다.
 
## 16. 수납·출납 foundation initial-data 실제 축소 전 최종 검증

이번 검증은 `/api/initial-data` 응답을 실제로 축소하지 않고, 다음 별도 작업에서 제거할 수 있는 key와 보류할 key를 코드 검색 기준으로 최종 분리한 기록이다. `apmath/worker-backup/worker/index.js`, `apmath/js/core.js`, `apmath/js/management.js`, `apmath/js/dashboard.js`, `apmath/js/classroom.js`, `apmath/js/student.js`, `apmath/js/report.js`, `apmath/js/cumulative.js`, `apmath/js/qr-omr.js`, `apmath/js/schedule.js`, `apmath/js/textbook.js`, `apmath/student`, `apmath/planner`, `apmath/homework`, `apmath/index.html`을 검색 대상으로 확인했다.

### 16-1. 최종 제거 후보

| key | replacement API | frontend dependency | first screen dependency | readiness | final decision | note |
| --- | --- | --- | --- | --- | --- | --- |
| `billing_templates` | `billing-accounting-foundation/billing-templates` | `management.js` 모달 내부 `billingTemplates` | 없음 | almost ready | remove in phase 1 | GET only, `branch`, `active`, `item_type` alias 조회 가능 |
| `payments` | `billing-accounting-foundation/payments` | `management.js` 모달 내부 `payments` | 없음 | almost ready | remove in phase 1 | `branch`는 `payment_items` 기준 `EXISTS` 필터 |
| `payment_items` | `billing-accounting-foundation/payment-items` | `management.js` 모달 내부 `paymentItems` | 없음 | almost ready | remove in phase 1 | `payment_id`, `student_id`, `branch`, `item_type` 조회 가능 |
| `billing_adjustments` | `billing-accounting-foundation/billing-adjustments` | `management.js` 모달 내부 `billingAdjustments` | 없음 | almost ready | remove in phase 1 | 생성/수정/삭제 API 없음 |
| `billing_runs` | `billing-accounting-foundation/billing-runs` | `management.js` 모달 내부 `billingRuns` | 없음 | almost ready | remove in phase 1 | 실행/자동 생성 API 없음 |
| `payment_methods` | `billing-accounting-foundation/payment-methods` | `management.js` 모달 내부 `methods` | 없음 | ready | remove in phase 1 | 기존 설정 조회 API와 lazy loader 존재 |
| `payment_transactions` | `billing-accounting-foundation/payment-transactions` | `management.js` 모달 내부 `transactions` | 없음 | almost ready | remove in phase 1 | 기존 alias `transactions` 유지 |
| `cashbook_entries` | `billing-accounting-foundation/cashbook-entries` | `management.js` 모달 내부 `cashbookEntries` | 없음 | almost ready | remove in phase 1 | 기존 alias `cashbook` 유지 |
| `refund_records` | `billing-accounting-foundation/refund-records` | `management.js` 모달 내부 `refunds` | 없음 | almost ready | remove in phase 1 | 기존 alias `refunds` 유지 |
| `carryover_records` | `billing-accounting-foundation/carryover-records` | `management.js` 모달 내부 `carryovers` | 없음 | almost ready | remove in phase 1 | 기존 alias `carryovers` 유지 |
| `billing_policy_rules` | `billing-accounting-foundation/billing-policy-rules` | `management.js` 모달 내부 `policies` | 없음 | ready | remove in phase 1 | 기존 alias `policy-rules` 유지 |
| `accounting_daily_summaries` | `billing-accounting-foundation/accounting-daily-summaries` | `management.js` 모달 내부 `dailySummaries` | 없음 | ready | remove in phase 1 | 기존 alias `daily-summaries` 유지 |
| `accounting_monthly_summaries` | `billing-accounting-foundation/accounting-monthly-summaries` | `management.js` 모달 내부 `monthlySummaries` | 없음 | ready | remove in phase 1 | 기존 alias `monthly-summaries` 유지 |

### 16-2. 보류 후보

| key | reason to keep | related phase | risk | note |
| --- | --- | --- | --- | --- |
| `student_enrollments` | 학생 수강 foundation과 연결되어 수납·출납 1차 축소 범위가 아님 | enrollment/foundation phase | 중간 | 학생/반/수강 구조 검증 후 분리 |
| `class_time_slots` | 시간표 foundation 및 충돌 판단과 연결됨 | timetable phase | 중간 | 시간표 표시와 `refreshDataOnly()` 영향 검증 필요 |
| `timetable_conflict_logs` | 시간표 충돌 로그 데이터 | timetable conflict phase | 낮음 | 로그성 데이터지만 수납·출납 묶음이 아님 |
| `timetable_conflict_overrides` | 시간표 충돌 예외 판단과 연결됨 | timetable conflict phase | 중간 | 즉시 판단 로직 영향 확인 필요 |
| `parent_contacts` | 학부모 연락 foundation과 연결됨 | parent/contact phase | 중간 | 개인정보 및 연락처 화면 범위 검증 필요 |
| `message_logs` | 알림/문자 발송 기록 foundation과 연결됨 | parent/message phase | 중간 | 실제 발송 금지와 별도 로그 조회 설계 필요 |
| `student_status_history` | 학생 상태 이력 관리와 연결됨 | student history phase | 중간 | 학생 상세/관리 화면에서 별도 검증 필요 |
| `class_transfer_history` | 반 이동 이력 관리와 연결됨 | student/class history phase | 중간 | 학생 상세/관리 화면에서 별도 검증 필요 |
| `staff_permissions` | 직원/권한/관리 화면 제어와 연결됨 | staff permission phase | 높음 | 권한 guard 없이 제거 금지 |

### 16-3. 프론트 직접 참조 검색 결과

- 제거 후보 key의 `state.db.<key>` 또는 `state.db['<key>']` 직접 참조는 검색 결과 발견되지 않았다.
- 제거 후보 key의 `data.<key>` 또는 `initialData.<key>` 직접 참조는 검색 결과 발견되지 않았다.
- 제거 후보 key 문자열은 `management.js`의 `state.ui.billingAccountingFoundation` 모달 내부 배열과 `billingAccountingFetchAll()` API 요청/응답 매핑에서 확인된다.
- `dashboard.js`는 `showBillingAccountingFoundationEntry = false` 상태이며, 수납·출납 foundation 버튼은 조건부 템플릿 안에 남아 있으나 노출되지 않는다.
- `apmath/student`, `apmath/planner`, `apmath/homework`, `apmath/index.html` 범위에서 제거 후보 key의 initial-data 직접 의존은 발견되지 않았다.
- 보류 후보는 이번 수납·출납 1차 축소 대상이 아니며, 시간표/학부모 연락/학생 이력/권한 phase에서 별도 검증한다.

### 16-4. 실제 축소 작업 전제 조건

- 다음 작업에서 initial-data에서 제거해도 되는 key: `billing_templates`, `payments`, `payment_items`, `billing_adjustments`, `billing_runs`, `payment_methods`, `payment_transactions`, `cashbook_entries`, `refund_records`, `carryover_records`, `billing_policy_rules`, `accounting_daily_summaries`, `accounting_monthly_summaries`.
- 다음 작업에서 제거하면 안 되는 key: `student_enrollments`, `class_time_slots`, `timetable_conflict_logs`, `timetable_conflict_overrides`, `parent_contacts`, `message_logs`, `student_status_history`, `class_transfer_history`, `staff_permissions`.
- 제거 후 반드시 실행할 node check: `node --check apmath/worker-backup/worker/index.js`, `node --check apmath/js/core.js`, `node --check apmath/js/management.js`, `node --check apmath/js/dashboard.js`, `node --check apmath/js/classroom.js`, `node --check apmath/js/student.js`, `node --check apmath/js/report.js`.
- 제거 후 화면 수동 검증 목록: admin 첫 화면, teacher 첫 화면, dashboard, classroom, student detail, report, management, 수납·출납 foundation 모달.
- 제거 후 API smoke 목록: `/api/initial-data`, `/api/billing-accounting-foundation/billing-templates`, `/api/billing-accounting-foundation/payments`, `/api/billing-accounting-foundation/payment-items`, `/api/billing-accounting-foundation/billing-adjustments`, `/api/billing-accounting-foundation/billing-runs`, 기존 payment/accounting foundation GET 계열.
- 배포 전 확인 순서: 로컬 diff 확인, node check, 화면별 수동 검증, 사용자가 직접 Worker 배포, 사용자가 직접 운영 API smoke test.

### 16-5. 다음 작업 추천

- 다음 작업 제목: `수납·출납 foundation initial-data 1차 축소`
- 다음 작업에서도 실제 청구 생성, 실제 결제 연동, 실제 알림/문자 발송, 실제 payments 자동 생성은 금지한다.
- 다음 작업은 `apmath/worker-backup/worker/index.js`의 `/api/initial-data` 응답과 SQL에서 위 13개 수납·출납 foundation key만 제거하는 범위로 제한한다.
## 16-6. 2026-05-16 수납·출납 foundation initial-data 축소 전 재검증

- `apmath/js`, `apmath/student`, `apmath/planner`, `apmath/index.html`, `apmath/homework` 범위에서 제거 후보 13개 key의 직접 `state.db.<key>`, `state.db['<key>']`, `data.<key>`, `initialData.<key>` 참조를 다시 검색했다.
- 검색 결과 제거 후보 13개 key의 직접 initial-data 의존은 발견되지 않았고, `management.js`의 `state.ui.billingAccountingFoundation` 모달 내부 상태 및 `billingAccountingFetchAll()` 응답 매핑만 확인됐다.
- `billing_templates`, `payments`, `payment_items`, `billing_adjustments`, `billing_runs`는 `billing-accounting-foundation` route 안에서 GET replacement API가 확인됐다.
- `payment_methods`, `payment_transactions`, `cashbook_entries`, `refund_records`, `carryover_records`, `billing_policy_rules`, `accounting_daily_summaries`, `accounting_monthly_summaries`, `accounting-summary`도 기존 route coverage가 확인됐다.
- `apmath/worker-backup/worker/index.js`에는 아직 initial-data foundation SQL과 응답 key가 남아 있으며, 이번 검증 작업에서는 변경하지 않았다.
- `dashboard.js`는 `showBillingAccountingFoundationEntry = false` 상태를 유지한다.
- 결론은 유지한다: 다음 별도 작업에서 제거 가능한 key는 13개 수납·출납 foundation key이며, 보류 key 9개는 학생/시간표/학부모 연락/권한 phase에서 별도 검증한다.
## 17. 수납·출납 foundation initial-data 1차 축소 결과

이번 작업에서 `/api/initial-data`의 `loadFoundationInitialData()` 응답에서 수납·출납 foundation 13개 key를 실제로 제거했다. 제거 대상은 빈 배열로 남기지 않고 SQL query와 response property를 함께 제거했다.

### 제거된 key 13개

- `billing_templates`
- `payments`
- `payment_items`
- `billing_adjustments`
- `billing_runs`
- `payment_methods`
- `payment_transactions`
- `cashbook_entries`
- `refund_records`
- `carryover_records`
- `billing_policy_rules`
- `accounting_daily_summaries`
- `accounting_monthly_summaries`

### 보류된 key 9개

- `student_enrollments`
- `class_time_slots`
- `timetable_conflict_logs`
- `timetable_conflict_overrides`
- `parent_contacts`
- `message_logs`
- `student_status_history`
- `class_transfer_history`
- `staff_permissions`

### 제거 이유와 대체 조회 경로

- 제거된 13개 key는 첫 화면 공통 initial-data에 계속 포함될 필요가 없는 수납·출납 foundation 데이터다.
- 기존 `billing-accounting-foundation` route의 read-only GET API와 alias mapping을 유지했다.
- `management.js`의 `billingAccountingFetchAll()` lazy loader는 기존처럼 replacement API를 통해 foundation modal 내부 상태를 채운다.
- route 파일과 lazy loader 파일은 이번 작업 범위에서 수정하지 않았다.

### 첫 화면 영향 판단

- 제거 대상 key에 대한 `state.db.<key>`, `state.db['<key>']`, `data.<key>`, `initialData.<key>` 직접 참조 검색 결과는 발견되지 않았다.
- dashboard의 `showBillingAccountingFoundationEntry = false` 숨김 상태는 변경하지 않았다.
- 실제 청구 생성, 결제 연동, 카드/카카오페이 연동, 알림톡/문자 발송, 운영 DB smoke test는 수행하지 않았다.

### 실제 축소 후 검증 항목

- `apmath/worker-backup/worker/index.js`에서 제거 대상 13개 key의 SQL query와 response property가 제거되었는지 검색했다.
- `apmath/js`, `apmath/student`, `apmath/planner`, `apmath/homework`, `apmath/index.html` 범위에서 제거 대상 key의 initial-data 직접 의존성을 검색했다.
- 필수 `node --check` 대상과 선택 `node --check` 대상을 실행해 문법을 확인했다.
- `git diff --name-only`, `git status --short`로 변경 범위와 기존 dirty 파일을 확인했다.

### 다음 분리 후보

- 이번에 보류한 9개 key는 시간표 foundation, 학부모 연락, 학생 이력, 직원 권한과 연결되어 있어 별도 phase에서 화면별 의존성 검증 후 분리한다.
- 다음 initial-data 축소는 `student_enrollments`, `class_time_slots`, `timetable_conflict_logs`, `timetable_conflict_overrides`, `parent_contacts`, `message_logs`, `student_status_history`, `class_transfer_history`, `staff_permissions`를 각각 별도 분석 대상으로 삼는다.
