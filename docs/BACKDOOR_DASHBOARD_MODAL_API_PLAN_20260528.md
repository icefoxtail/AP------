# BACKDOOR_DASHBOARD_MODAL_API_PLAN_20260528

작성일: 2026-05-28  
작성 근거: CODEX_TASK.md §5~§7  
이번 작업에서 API 구현 없음. 문서 생성 및 CODEX_RESULT append만 수행.

---

## 1. 목적

백도어 backend-only 1차 API (overview/students/classes/today/timetable/billing-summary/search)는 배포 완료 상태다.

이번 문서는 다음 구현 라운드를 위한 **대시보드 화면 + 모달 화면 전체 백도어 API 설계 목록**이다.

- 기존 운영 화면과 기존 API는 수정하지 않는다.
- `/api/initial-data`를 대체하지 않는다.
- `/api/backdoor/*` namespace만 사용한다.
- admin-only, GET-only/read-only부터 시작한다.
- raw dump 금지. 연락처·PIN·수납 전체 목록 raw dump 금지.
- 목록 API는 limit/offset 또는 기간 필터 강제.
- 돈 관련 API는 summary/count/recent 일부만 먼저 제공.
- 상세 수정·삭제·정정 API는 이번 설계 범위에서 제외.

---

## 2. 현재 배포된 백도어 API

| API | 설명 |
|-----|------|
| GET /api/backdoor/overview | 전체 운영 요약 (학생 count, 반 count, 오늘 출결 summary) |
| GET /api/backdoor/students | 학생 목록 (limit/offset 필터) |
| GET /api/backdoor/classes | 반 목록 |
| GET /api/backdoor/today | 오늘 운영 현황 (출결/숙제 summary) |
| GET /api/backdoor/timetable | 시간표 요약 |
| GET /api/backdoor/billing-summary | 수납 요약 (count/summary only) |
| GET /api/backdoor/search | 전체 검색 (학생/반/시험) |

확인 기준: `apmath/worker-backup/worker/routes/` 내 backdoor.js 파일 없음.  
위 API 목록은 CODEX_TASK.md §7의 현황 설명을 기준으로 기재함.  
실제 배포 여부는 Cloudflare Worker 운영 인스턴스 기준이며 로컬 파일로 확인 불가.

---

## 3. 화면/모달 인벤토리

### 분석 대상 파일

| 파일 | 확인 결과 |
|------|----------|
| apmath/js/dashboard.js | 3937줄. 운영센터·선생님 대시보드 전체 커버. |
| apmath/js/core.js | initial-data 로드 구조, state.db 전체 구조 확인. |
| apmath/js/student.js | 학생 상세 탭 구조, 상담/리포트/연락처 모달 확인. |
| apmath/js/management.js | 반 관리, PIN, 주소록, 수납·출납 foundation 모달 확인. |
| apmath/worker-backup/worker/index.js | initial-data 핸들러 전체 확인. |
| apmath/worker-backup/worker/routes/backdoor.js | 파일 없음 (배포 인스턴스에 존재). |
| CLAUDE_CODE_HANDOFF_BACKDOOR_20260528.md | 파일 없음. |

---

### 3-1. 화면/모달 인벤토리 표

| 구역 | 화면/모달/함수명 | 현재 데이터 의존 | 필요한 백도어 API | summary/detail | 위험 데이터 | 필터/limit 필요 | 우선순위 | 비고 |
|------|----------------|----------------|-----------------|---------------|------------|----------------|---------|------|
| **A. 첫 화면 카드/요약** | `renderAdminControlCenter()` – 운영센터 진입 | initial-data (students, classes, attendance_history, homework_history, consultations) | /api/backdoor/overview 커버 가능 | summary | 없음 | N | 높음 | 1차 API로 충분 |
| A | `renderAdminStudentOverviewPanel()` – 재원/최근등록/퇴원/휴원 카드 | state.db.students | /api/backdoor/overview 커버 가능 | summary | 없음 | N | 높음 | 1차 API로 충분 |
| A | `renderAdminNeedCheckPanel()` – 반 배정 필요/담당 미지정/반 정리 필요 | students + classes + class_students | /api/backdoor/overview 커버 가능 | summary count | 없음 | N | 중간 | count만 필요 |
| A | `renderAdminRecentConsultationPanel()` – 최근 상담 패널 (14일, 학생별 1건) | consultations + students | 별도 API 필요 | summary | 상담 내용(민감) | 기간 필터 | 높음 | 내용 미리보기는 첫 줄만 |
| A | `renderAdminNewStudentPanel()` – 최근 등록 원생 (14일, 10명) | students + class_students + attendance/exam count | /api/backdoor/students 커버 가능 | summary | 없음 | 기간/limit | 중간 | 1차 API로 근접 |
| A | `renderAdminTeacherCards()` – 선생님 현황 카드 | classes + daily_journals | 별도 API 필요 | summary | 없음 | N | 중간 | 일지 제출 여부만 |
| A | `adminScheduleHtml` – 주간일정 패널 | exam_schedules + academy_schedules | /api/backdoor/today 커버 가능 | summary | 없음 | 기간 | 낮음 | |
| **B. 오늘 운영** | `openTodayCloseModal()` – 예외 현황 3단계 | attendance + homework (today) + risk 계산 | /api/backdoor/today 커버 가능 | summary | 없음 | date | 높음 | 1차 API로 충분 |
| B | `computeRiskStudents()` – 관리필요 학생 계산 | attendance_history(14일) + homework_history(14일) + consultations | 별도 API 필요 | summary list | 없음 | 기간/limit | 중간 | score/trend만. 이름+점수+반만 |
| B | `openTodayExamSetModal()` – 오늘 시험 설정 | localStorage | 해당 없음 | — | — | — | — | 프론트 localStorage만. API 불필요 |
| B | `renderTodoSections()` – 오늘일정/주간일정 | operation_memos + exam_schedules + academy_schedules | /api/backdoor/today 근접 | summary | 없음 | date | 낮음 | |
| B | `renderTodayJournalCard()` – 오늘일지 카드 | attendance + classes + daily_journals | /api/backdoor/today 부분 커버 | summary | 없음 | date | 중간 | |
| **C. 학생 관련** | `openAdminStudentList(type)` – 재원/퇴원/숨김/관리필요 목록 | state.db.students + class_students | /api/backdoor/students 커버 가능 | summary list | 없음 | status/limit | 높음 | 1차 API로 충분 |
| C | `renderStudentDetail(sid)` – 학생 상세 전체 화면 | 모든 테이블 (연락처 포함) | 별도 API 필요 | detail | 연락처·PIN 노출 위험 | N | 높음 | 연락처/PIN 기본 제외 필수 |
| C | `renderStudentDetailTab(sid, 'att')` – 출결 탭 | attendance + attendance_history | 별도 API 필요 | detail | 없음 | 기간/limit | 높음 | |
| C | `renderStudentDetailTab(sid, 'hw')` – 숙제 탭 | homework + homework_history | 별도 API 필요 | detail | 없음 | 기간/limit | 중간 | |
| C | `renderStudentDetailTab(sid, 'exam')` – 시험 탭 | exam_sessions + wrong_answers + report_exam_cohort_stats | 별도 API 필요 | detail | 없음 | limit | 중간 | |
| C | `openAdminStudentConsultationHistory(sid)` – 개별 상담 이력 | consultations | 별도 API 필요 | detail | 상담 내용(민감) | limit | 중간 | 내용 전체 포함, 위험도 있음 |
| C | `openReportPreview(sid)` – 리포트 미리보기 | exam_sessions + report_exam_cohort_stats | 별도 API 필요 | detail | 없음 | N | 낮음 | |
| C | `renderParentContactSection(sid)` – 보호자 연락처 | parent_contacts | **이번 범위 제외** | — | 연락처 raw 노출 | — | 제외 | 연락처 절대 반환 금지 |
| C | `openAdminStudentGradeModal(type)` – 학년별 학생 목록 | students + class_students | /api/backdoor/students 커버 가능 | summary list | 없음 | grade/limit | 높음 | 1차 API로 충분 |
| **D. 반/수업 관련** | `renderClass(cid)` – 반 상세 전체 화면 | classes + class_students + students + attendance/homework + class_textbooks + class_daily_records | 별도 API 필요 | detail | 없음 | N | 높음 | |
| D | `openClassManageModal()` – 반 관리 목록 | classes | /api/backdoor/classes 커버 가능 | summary list | 없음 | N | 높음 | 1차 API로 충분 |
| D | `renderAdminTeacherStudents(teacherName)` – 선생님 담당반 목록 모달 | classes + teacher_classes | /api/backdoor/classes 커버 가능 | summary | 없음 | N | 중간 | 1차 API로 충분 |
| D | 반 출결 현황 (class-level attendance today) | attendance + class_students | /api/backdoor/today 부분 커버 | summary | 없음 | date | 높음 | |
| D | 반 최근 수업일지 (`class_daily_records`) | class_daily_records | 별도 API 필요 | detail | 없음 | 기간/limit | 중간 | |
| D | 반 교재 현황 (`class_textbooks`) | class_textbooks | 별도 API 필요 | detail | 없음 | N | 낮음 | |
| **E. 시간표 관련** | `renderTimetable()` – 시간표 전체 화면 | class_time_slots + classes + class_students + timetable_conflict_logs | /api/backdoor/timetable 커버 가능 | summary | 없음 | N | 높음 | 1차 API로 충분 |
| E | 시간표 충돌 목록 (`timetable_conflict_logs`) | timetable_conflict_logs | /api/backdoor/timetable 부분 커버 | detail | 없음 | N | 중간 | |
| E | 시간표 버전 목록 | timetable_versions | 별도 API 필요 | detail | 없음 | N | 낮음 | |
| **F. 출결/숙제 관련** | `openAttendanceLedger()` – 출석부 | attendance_history + students + classes | 별도 API 필요 | detail | 없음 | 기간/class | 높음 | |
| F | 오늘 결석/숙제 미완료 목록 | attendance (today) + homework (today) | /api/backdoor/today 커버 가능 | summary | 없음 | date | 높음 | 1차 API로 충분 |
| F | 14일 출결/숙제 이력 (학생별) | attendance_history + homework_history | 별도 API 필요 | detail | 없음 | 기간/student | 높음 | |
| **G. 수납/결제 관련** | `openBillingAccountingFoundationModal()` – 수납·출납 foundation | billing 관련 테이블 (별도) | /api/backdoor/billing-summary 부분 커버 | summary | 수납 금액·결제 정보 | N | 중간 | UI에서 숨겨진 상태(showBillingAccountingFoundationEntry=false) |
| G | 수납 목록 raw dump | billing 테이블 | **이번 범위 제외** | — | 수납 전체 금액 노출 | — | 제외 | raw dump 절대 금지 |
| G | 미납 현황 count/list | billing 테이블 | 별도 API 필요 | summary count | 금액 일부 | limit | 중간 | |
| G | 최근 수납 내역 (recent, 건수 제한) | billing 테이블 | 별도 API 필요 | summary recent | 금액 일부 | limit/기간 | 중간 | |
| **H. 상담/메모 관련** | `openAdminConsultationCenter()` – 상담 전체 보기 (14일/검색) | consultations + students | 별도 API 필요 | summary list | 상담 내용(민감) | 기간/limit | 높음 | |
| H | `openAdminStudentConsultationHistory(sid)` – 학생별 상담 이력 | consultations | 별도 API 필요 | detail | 상담 내용(민감) | limit | 중간 | |
| H | `renderDashboardJournalWeekMatrix()` – 일지 주간 현황 | daily_journals | 별도 API 필요 | summary | 없음 | 기간 | 중간 | 제출 여부만 |
| H | `renderAdminJournalList()` – 일지 날짜별 목록 | daily_journals | 별도 API 필요 | summary list | 없음 | date/teacher | 중간 | |
| **I. 시험/성적/리포트** | `openGlobalExamGradeView()` – 전체 시험 성적 뷰 | exam_sessions + students + wrong_answers + report_exam_cohort_stats | 별도 API 필요 | summary | 없음 | limit/기간 | 중간 | |
| I | `openSchoolExamLedger()` – 성적표 (학교 내신) | school_exam_records | 별도 API 필요 | summary | 없음 | 기간/limit | 낮음 | |
| I | `renderStudentDetailTab(sid, 'exam')` – 학생 시험 탭 | exam_sessions + report_exam_cohort_stats | 별도 API 필요 | detail | 없음 | limit | 중간 | |
| **J. 설정성/운영자 전용** | `openAdminTeacherAccountManage()` – 선생님 계정 관리 | teachers API (/api/teachers) | 해당 없음 | — | 계정 정보 | — | 제외 | 기존 API 사용. 백도어 불필요 |
| J | `openAdminPinBatchModal()` – PIN 생성 현황 | students (pin 현황) | 별도 API 필요 | summary | PIN 노출 위험 | N | 낮음 | PIN 값은 반환 금지. count만 |
| J | `openAddressBook()` – 주소록 | parent_contacts | **이번 범위 제외** | — | 연락처 raw 노출 | — | 제외 | 연락처 절대 반환 금지 |
| J | `openAdminOperationMenu()` – 관리 메뉴 진입 | N/A | 해당 없음 | — | — | — | — | 프론트 메뉴. API 불필요 |

---

## 4. 1차 API로 충분한 영역

이미 배포된 7개 API로 커버 가능한 화면:

| 화면/모달 | 커버하는 1차 API | 비고 |
|----------|----------------|------|
| 운영센터 첫 진입 – 학생 count 카드 | /api/backdoor/overview | 재원/퇴원/휴원/최근등록 count |
| 오늘 운영 – 출결/숙제 예외 summary | /api/backdoor/today | 결석/미완료 count, 반별 summary |
| 반 목록 (학급관리 탭) | /api/backdoor/classes | 반 이름, grade, teacher_name |
| 학생 목록 (재원/퇴원/학년별) | /api/backdoor/students | limit/offset, status 필터 |
| 시간표 전체 뷰 – 반 스케줄 | /api/backdoor/timetable | class_time_slots 기반 |
| 수납 요약 카드 | /api/backdoor/billing-summary | count/amount summary only |
| 전체 검색 (학생/반 이름) | /api/backdoor/search | 이름 기반 fuzzy 검색 |
| 선생님 담당반 목록 모달 | /api/backdoor/classes | teacher_name 필터 |
| 학년별 학생 목록 모달 | /api/backdoor/students | grade 필터 |
| 최근 등록 원생 패널 (14일) | /api/backdoor/students | created_at 기간 필터 |

---

## 5. 추가가 필요한 detail API 후보

아래는 다음 라운드 구현 후보 목록이다. **이번 작업에서는 구현하지 않는다.**

### 5-1. 학생 detail

| API | 필요 화면 | 반환 내용 | 위험 데이터 | 필터 |
|-----|---------|---------|------------|------|
| GET /api/backdoor/students/:id | 학생 상세 모달 | 이름·학교·학년·반·status·등록일. 연락처/PIN 제외 | PIN 제외 필수 | N |
| GET /api/backdoor/students/:id/timeline | 학생 상세 – 최근 활동 요약 | 최근 출결/숙제/상담 count 요약 | 없음 | 기간 |
| GET /api/backdoor/students/:id/classes | 학생 반 배정 이력 | 반 이름·배정일 | 없음 | limit |
| GET /api/backdoor/students/:id/attendance-summary | 학생 출결 탭 | 날짜별 status, 최근 14~30일 | 없음 | 기간/limit |
| GET /api/backdoor/students/:id/billing-summary | 학생 수납 탭 | 미납 count, 최근 수납 일자 | 금액 일부 | N |
| GET /api/backdoor/students/:id/exam-summary | 학생 시험 탭 | 최근 시험 점수 목록 | 없음 | limit |
| GET /api/backdoor/students/:id/consultations | 학생 상담 이력 | 날짜·유형·내용 요약. 내용 전체는 제한적 | 상담 내용(민감) | limit |

### 5-2. 반 detail

| API | 필요 화면 | 반환 내용 | 위험 데이터 | 필터 |
|-----|---------|---------|------------|------|
| GET /api/backdoor/classes/:id | 반 상세 모달 | 반 이름·grade·teacher·시간표·학생수 | 없음 | N |
| GET /api/backdoor/classes/:id/students | 반 학생 목록 | 학생 이름·학년·status | 없음 | limit |
| GET /api/backdoor/classes/:id/timetable | 반 시간표 슬롯 | day_of_week·start/end_time | 없음 | N |
| GET /api/backdoor/classes/:id/attendance-summary | 반 출결 summary | 날짜별 출결 count | 없음 | 기간/limit |
| GET /api/backdoor/classes/:id/recent-records | 반 최근 수업 일지 | 날짜·내용 일부 | 없음 | limit |

### 5-3. 오늘 운영 detail

| API | 필요 화면 | 반환 내용 | 위험 데이터 | 필터 |
|-----|---------|---------|------------|------|
| GET /api/backdoor/today/classes | 오늘 수업 반 목록 | 반 이름·학생수·출결 summary | 없음 | date |
| GET /api/backdoor/today/attendance-summary | 오늘 출결 상세 | 결석·등원·미등록 학생별 목록 | 없음 | date |
| GET /api/backdoor/today/homework-summary | 오늘 숙제 상세 | 미완료·완료 학생별 목록 | 없음 | date |

### 5-4. 수납 detail (보수적으로 접근)

| API | 필요 화면 | 반환 내용 | 위험 데이터 | 필터 |
|-----|---------|---------|------------|------|
| GET /api/backdoor/billing/unpaid | 미납 현황 | count + 학년별 집계. 개인 정보 최소화 | 금액 민감 | N |
| GET /api/backdoor/billing/recent | 최근 수납 | 날짜·금액·학생 이름 (count 제한) | 금액 민감 | limit/기간 |

### 5-5. 상담/일지 detail

| API | 필요 화면 | 반환 내용 | 위험 데이터 | 필터 |
|-----|---------|---------|------------|------|
| GET /api/backdoor/consultations/recent | 최근 상담 패널 | 학생 이름·날짜·유형·내용 첫 줄만 | 상담 내용 | 기간/limit |
| GET /api/backdoor/journals/recent | 일지 주간 현황 | 선생님별·날짜별 제출 여부 | 없음 | 기간/teacher |

### 5-6. 시험/리포트 summary

| API | 필요 화면 | 반환 내용 | 위험 데이터 | 필터 |
|-----|---------|---------|------------|------|
| GET /api/backdoor/reports/recent | 리포트 최근 목록 | 날짜·학생·시험명. count 제한 | 없음 | limit |
| GET /api/backdoor/exams/recent | 최근 시험 목록 | 시험명·날짜·반·점수 분포 | 없음 | limit |

---

## 6. 다음 구현 라운드 추천

작게 나눈다. 돈/수납보다 학생/반/오늘 운영 detail부터 먼저.

### Round A — 학생 상세 모달용 read-only detail API

- GET /api/backdoor/students/:id
- GET /api/backdoor/students/:id/timeline
- GET /api/backdoor/students/:id/attendance-summary
- GET /api/backdoor/students/:id/exam-summary

연락처·PIN은 절대 반환하지 않는다.  
이 라운드로 학생 클릭 → 상세 모달이 동작 가능해진다.

### Round B — 반 상세 모달용 read-only detail API

- GET /api/backdoor/classes/:id
- GET /api/backdoor/classes/:id/students
- GET /api/backdoor/classes/:id/attendance-summary

반 클릭 → 출결 summary까지 확인 가능해진다.

### Round C — 오늘 운영 모달용 read-only detail API

- GET /api/backdoor/today/classes
- GET /api/backdoor/today/attendance-summary
- GET /api/backdoor/today/homework-summary

오늘 예외 현황 상세 확인이 가능해진다.

### Round D — 수납 상세 모달용 summary/detail API

- GET /api/backdoor/billing/unpaid
- GET /api/backdoor/billing/recent

금액 raw dump는 이 라운드에서도 하지 않는다. count/summary/recent 소수 건만.

### Round E — 시험/리포트 summary API

- GET /api/backdoor/exams/recent
- GET /api/backdoor/reports/recent
- GET /api/backdoor/students/:id/consultations (상담 이력)

---

## 7. 제외 범위

이번 작업 및 다음 라운드에서도 포함하지 않는 항목:

| 항목 | 이유 |
|------|------|
| 프론트 연결 | 이번 범위 외 |
| UI 구현 | 이번 범위 외 |
| 수정/삭제/정정 API | read-only부터 시작 원칙 |
| 수납 전체 목록 raw dump | 금액 정보 raw 노출 금지 |
| 학생 연락처 (phone, parent_phone) | 연락처 기본 반환 금지 원칙 |
| 보호자 연락처 (parent_contacts) | 연락처 기본 반환 금지 원칙 |
| 학생 PIN (student_pin) | PIN 기본 반환 금지 원칙 |
| D1 migration | 이번 범위 외 |
| 기존 /api/initial-data 대체 | 절대 금지 |
| 기존 운영 API 수정 | 절대 금지 |
| 압축/검수팩 생성 | 이번 범위 외 |

---

## 8. 최종 판단

**다음 라운드에서 어떤 API부터 구현할지 추천:**

Round A (학생 상세 detail)를 먼저 구현한다.

근거:
1. 현재 백도어 dashboard에서 가장 빈번하게 클릭하는 동선이 "학생 이름 → 상세"이다.
2. 연락처·PIN을 제외하면 위험 데이터가 없어 설계가 단순하다.
3. 반 상세(Round B)나 수납(Round D)보다 먼저 구현해도 부작용이 없다.
4. 상담 내용이 포함되는 `/students/:id/consultations`는 Round A에서는 제외하고 Round E로 미룬다.

Round B (반 상세)는 Round A 완료 직후 바로 이어서 구현 가능하다.  
Round C (오늘 운영 detail)는 today API가 이미 충분히 커버하고 있어 우선순위가 A/B보다 낮다.  
Round D (수납 detail)는 금액 정보가 포함되므로 A/B/C 이후 별도 검토를 거친다.  
Round E (시험/리포트/상담)는 마지막 순서로 접근한다.

---

*생성: 2026-05-28 | 구현 없음 | 배포 없음 | git add/commit/push 없음*
