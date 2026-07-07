# INVESTIGATION_EIE_MEMO_SCHEDULE_LOOP0

## 1. 조사 목표

이번 Loop 0은 코드 수정 없이 APMath의 메모/주간일정 구조를 EIE 원장/선생님 대시보드에 이식하기 위한 현재 구조와 위험 지점을 확인하는 조사다.

핵심 전제는 다음과 같다.

- EIE 메모는 개인 메모다. 원장도 예외 없이 로그인 사용자 본인의 메모만 조회/수정/삭제해야 한다.
- EIE 메모 scope의 1차 기준은 `owner_user_id = auth.id`다. `_teacherName`이나 이름 문자열 기준이 아니다.
- EIE 주간일정은 공용 일정이다. 원장/선생님 대시보드 모두 같은 시험/휴무/기타 학원 운영 일정을 본다.
- 이번 라운드에서는 신규 기능 구현, 코드 수정, localStorage 메모 유지 강제, placeholder 유지 강제를 하지 않는다.

## 2. 현재 EIE 원장 대시보드 구조

파일: `eie/js/views/eie-dashboard.js`

- 원장 대시보드는 `EieDashboardView.render()`가 HTML 문자열을 반환하고 `EieRouter`가 mount한다.
- `render()` 내부의 `ap-owner-grid`에 현재 메모/일정 카드 자리가 이미 있다.
  - `renderTodayMemoPanel(today)` 호출: `eie/js/views/eie-dashboard.js:823`, 배치: `eie/js/views/eie-dashboard.js:853`
  - `renderWeeklySchedulePlaceholder()` 호출: `eie/js/views/eie-dashboard.js:741`, 배치: `eie/js/views/eie-dashboard.js:855`
- 현재 원장 메모는 API/DB가 아니라 localStorage 기반이다.
  - key 생성: `ownerMemoKey(dateStr)` -> `eie.owner.dashboard.memo.YYYY-MM-DD`
  - 읽기: `readOwnerMemos()` (`eie/js/views/eie-dashboard.js:754`)
  - 쓰기: `writeOwnerMemos()` (`eie/js/views/eie-dashboard.js:764`)
  - 추가/완료/삭제: `addEieOwnerMemo`, `toggleEieOwnerMemo`, `removeEieOwnerMemo`
- 현재 주간일정은 실제 일정 렌더가 아니라 관리 화면 이동 버튼 placeholder다.
  - `renderWeeklySchedulePlaceholder()`는 `data-eie-route="management"` 버튼만 출력한다.

결론:

- Loop 4에서 원장 대시보드 연결 시 `renderTodayMemoPanel()`은 공통 메모 카드로 교체 대상이다.
- `readOwnerMemos/writeOwnerMemos` 기반 localStorage 메모는 최종 데이터 소스로 남기면 안 된다.
- `renderWeeklySchedulePlaceholder()`는 공통 주간일정 카드로 교체 대상이다.

## 3. 현재 EIE 선생님 대시보드 구조

파일: `eie/js/views/eie-teacher.js`

- 선생님 대시보드는 `EieTeacherView.render()`가 담당한다.
- 내부 상태로 `_teacherName`을 가진다: `eie/js/views/eie-teacher.js:2`
- `_teacherName`은 화면에 표시할 선생님/수업 필터 기준이다.
  - 저장된 이름 사용: `storedTeacherName()` (`eie/js/views/eie-teacher.js:116`)
  - 기본 teacherName 보정: `ensureTeacherName()` (`eie/js/views/eie-teacher.js:569`)
  - 임의 선생님 페이지 열기: `EieTeacherView.openTeacher(teacherName)` (`eie/js/views/eie-teacher.js:703`)
- `render()`는 현재 헤더와 요일별 수업 카드만 출력한다.
  - 헤더: `renderHomeHead(todayRows)` (`eie/js/views/eie-teacher.js:589`)
  - 요일별 수업: `renderWeekdaySchedule()` (`eie/js/views/eie-teacher.js:660`)
  - 최종 배치: `eie/js/views/eie-teacher.js:683` ~ `eie/js/views/eie-teacher.js:689`

중요 위험:

- `openTeacher(name)`으로 원장 또는 관리자가 임의 선생님 화면을 열 수 있다.
- 따라서 선생님 대시보드 메모 카드를 `_teacherName` 기준으로 조회하면, 원장이 특정 선생님 화면을 열었을 때 그 선생님의 개인 메모가 노출될 수 있다.
- 메모 API 호출에는 teacherName 파라미터를 넘기지 말고, 서버가 Bearer token에서 얻은 `auth.id`로만 필터링해야 한다.
- 주간일정은 공용이므로 `_teacherName`과 무관하게 같은 API 결과를 렌더링하면 된다.

결론:

- Loop 5 연결 위치는 `render()`의 `renderHomeHead()`와 `renderWeekdaySchedule()` 사이 또는 이후가 적합하다.
- 메모 scope는 반드시 로그인 세션 기준이어야 하며 `_teacherName`은 수업 표시용으로만 남겨야 한다.

## 4. 원장/선생님 role 분기 및 라우팅

파일: `eie/js/eie-app.js`, `eie/js/eie-router.js`

- 프론트 세션 값은 localStorage에 저장된다.
  - `WANGJI_EIE_SESSION_TOKEN`
  - `WANGJI_EIE_LOGIN_ID`
  - `WANGJI_EIE_ROLE`
  - `WANGJI_EIE_NAME`
  - `WANGJI_EIE_EXPIRES_AT`
- `eie-app.js`는 role이 teacher/eieteacher이면 기본 진입을 `#teacher`로 보낸다.
  - `isEieTeacherSession()`: `eie/js/eie-app.js:127`
  - `isEieOwnerSession()`: `eie/js/eie-app.js:132`
  - `ensureEieInitialRoute()`: `eie/js/eie-app.js:142`
- `eie-router.js`도 session 기준 default route를 분기한다.
  - teacher/eieteacher + loginId !== admin -> `teacher`
  - 그 외 -> `dashboard`

결론:

- 원장/선생님 대시보드는 같은 파일이 아니라 `eie-dashboard.js`와 `eie-teacher.js`로 분리되어 있다.
- 공통 카드 컴포넌트는 별도 파일로 만들고 두 view에서 같은 renderer를 호출하는 방식이 중복과 scope 사고를 줄인다.

## 5. EIE 프론트 인증/API 구조

파일: `eie/js/eie-api.js`

- API base는 기본적으로 `https://wangji-eie-os.js-pdf.workers.dev/api/eie`다.
- 인증 헤더는 localStorage의 token류 key를 찾아 Bearer로 만든다.
  - Basic 인증 문자열은 제거한다.
  - `makeHeaders()`가 모든 요청에 `Authorization`을 붙인다.
- 현재 `EieApi`에는 timetable/import/student/contact/consultation/grade-report/schedule-assignment/attendance 등의 API가 있다.
- 현재 `operation-memos`, `exam-schedules`, `academy-schedules`용 메서드는 없다.

이식 필요 메서드:

- `getOperationMemos()`
- `createOperationMemo()`
- `updateOperationMemo()`
- `deleteOperationMemo()`
- `getExamSchedules()`
- `createExamSchedule()`
- `updateExamSchedule()`
- `deleteExamSchedule()`
- `getAcademySchedules()`
- `createAcademySchedule()`
- `updateAcademySchedule()`
- `deleteAcademySchedule()`

주의:

- EIE 프론트에서 Basic/btoa 인증을 새로 만들면 안 된다.
- 메모 API에 `teacher_name` 또는 `teacherName` 파라미터를 넘기면 안 된다.
- 데이터 scope 책임은 서버가 Bearer token의 로그인 사용자 정보로 가져야 한다.

## 6. EIE Worker route 구조

파일: `workers/wangji-eie-worker/index.js`, `workers/wangji-eie-worker/routes/eie.js`

- Worker는 Authorization 헤더에서 Bearer token만 추출한다.
  - `getBearerToken(request)`: `workers/wangji-eie-worker/index.js:49`
- 세션 검증은 `teacher_sessions`와 `teachers`를 join한다.
  - `verifyTeacher()`: `workers/wangji-eie-worker/index.js:124`
  - 반환 필드: `id`, `login_id`, `name`, `role`
- 로그인 응답도 `id`, `name`, `role`, `login_id`, `session_token`을 반환한다.
- `routes/eie.js`에는 현재 timetable/students/contacts/consultations/grade-reports/schedule-assignments/attendance/teachers 등의 route가 있다.
- 현재 `operation-memos`, `exam-schedules`, `academy-schedules` route는 확인되지 않았다.

결론:

- EIE 메모의 `owner_user_id`는 `verifyTeacher()`가 반환하는 `teacher.id`와 연결하면 된다.
- route handler는 이미 `teacher` 인자를 받는 구조로 보이며, 신규 route에서 이 인자를 사용해 scope를 적용할 수 있다.
- EIE 일정 route는 기존 `eie_exam_records`와 이름이 헷갈릴 수 있으므로 `eie_exam_schedules`를 별도 개념으로 두어야 한다.

## 7. EIE migration 현황

폴더: `workers/wangji-eie-worker/migrations`

현재 확인된 파일:

- `20260605_eie_timetable_slot_lane.sql`
- `20260609_eie_attendance_cell_unique.sql`
- `20260618_eie_timetable_month_snapshots.sql`
- `20260619_eie_student_contacts_deleted_at.sql`
- `20260620_eie_grade_reports.sql`

결론:

- `eie_operation_memos`, `eie_exam_schedules`, `eie_academy_schedules` migration은 아직 없다.
- 다음 Loop 1에서 `workers/wangji-eie-worker/migrations/20260626_eie_operation_memos.sql` 같은 EIE prefix 규칙의 신규 migration이 필요하다.

## 8. EIE index.html script 순서

파일: `eie/index.html`

현재 주요 순서:

1. `../shared/js/wangji-owner-auth-bridge.js`
2. `./js/utils/eie-normalize.js`
3. `./js/utils/eie-grade-utils.js`
4. `./js/utils/eie-classroom-scope.js`
5. `./js/eie-state.js`
6. `./js/eie-api.js`
7. `./js/apms-compat/eie-apms-state.js`
8. `./js/apms-compat/eie-apms-api.js`
9. `./js/apms-compat/eie-apms-ui-bridge.js`
10. `./js/eie-app.js`
11. `./js/views/eie-dashboard.js?v=20260622`
12. `./js/views/eie-timetable.js?v=20260622`
13. `./js/views/eie-timetable-editor.js?v=20260622`
14. `./js/views/eie-students.js?v=20260622`
15. `./js/views/eie-classroom.js`
16. `./js/views/eie-attendance.js?v=20260609`
17. `./js/views/eie-grade-ledger.js?v=20260613`
18. `./js/views/eie-management.js`
19. `./js/views/eie-teacher.js?v=20260622`
20. `./js/eie-router.js`

결론:

- 공통 메모/일정 view 파일을 추가한다면 `eie-api.js` 뒤, `eie-dashboard.js`와 `eie-teacher.js` 앞에 두는 것이 자연스럽다.
- 예: `eie/js/views/eie-operation-memos.js`, `eie/js/views/eie-operation-schedule.js`

## 9. EIE CSS 위치

폴더: `eie/css`

관련 후보:

- `eie-dashboard.css`
- `eie-dashboard-classroom.css`
- `eie-shell-v2.css`
- `eie-panel-tokens.css`
- `eie-v2-panels.css`
- `eie-management.css`

현재 원장 localStorage 메모 스타일은 `eie/css/eie-dashboard-classroom.css`에 있다.

- `.eie-admin-home .eie-owner-memo-card`
- `.eie-admin-home .eie-owner-memo-list`
- `.eie-admin-home .eie-owner-memo-empty`
- `.eie-admin-home .eie-owner-memo-row`
- `.eie-admin-home .eie-owner-memo-add`

결론:

- Loop 3/4/5에서 새 공통 카드 CSS를 추가할 경우 기존 EIE dashboard surface 계열 class를 재사용하는 것이 안전하다.
- 원장/선생님 양쪽에서 쓰는 카드라면 CSS scope를 `.eie-operation-card` 같은 공통 prefix로 두고, 필요 시 container별 보정만 추가하는 것이 좋다.

## 10. APMath 메모 원본 함수 매핑

파일: `apmath/js/memo.js`

모달/CRUD:

- `openTodoMemoModal()`
- `addTodoMemo()`
- `toggleMemoDone(id, done)`
- `deleteMemo(id)`
- `openEditTodoMemoModal(id)`
- `handleEditTodoMemo(id)`

파일: `apmath/js/dashboard.js`

대시보드 카드:

- `renderTodoSections()`: 메모 카드 + 주간일정 카드 조합
- 메모 출력 조건:
  - 완료 메모 제외
  - 고정 메모 우선
  - 일반 메모는 오늘부터 7일 이내만 표시
- 체크박스 변경 시 `toggleMemoDone()` 호출
- 카드 본문 클릭 시 `openTodoMemoModal()` 호출
- 빈 상태에서도 `+ 메모 추가`를 출력

결론:

- EIE에서 재사용할 설계 단위는 `memo.js` 함수명 자체가 아니라 동작 패턴이다.
- APMath의 `state.db.operation_memos` 직접 참조는 EIE 공통 컴포넌트에서 API payload 또는 view data로 바꿔야 한다.
- APMath inline style을 그대로 복사하지 말고 EIE 카드/surface 스타일로 재구성해야 한다.

## 11. APMath 주간일정 원본 함수 매핑

파일: `apmath/js/schedule.js`

일정 관리 모달/CRUD:

- `getUnifiedSchedules()`
- `renderUnifiedScheduleList(options)`
- `openExamScheduleModal(baseDateStr)`
- `addUnifiedSchedule()`
- `openEditUnifiedScheduleModal(kind, id, seriesId)`
- `handleEditUnifiedSchedule(kind, id, seriesId)`
- `handleEditGroupedExamSchedule(occurrenceIdsText)`
- `deleteGroupedExamSchedule(occurrenceIdsText)`
- `deleteUnifiedSchedule(kind, id, seriesId)`
- 호환 wrapper:
  - `addExamSchedule()`
  - `deleteExamSchedule(id)`
  - `openEditExamScheduleModal(id)`
  - `handleEditExamSchedule(id)`
  - `addAcademySchedule()`
  - `openEditAcademyScheduleModal(id)`
  - `handleEditAcademySchedule(id)`
  - `deleteAcademySchedule(id)`

파일: `apmath/js/dashboard.js`

대시보드 카드:

- `renderDashboardWeeklyScheduleSection(baseDateStr)`
- `dashboardFormatDateWithDay()`
- `dashboardFormatDateRangeWithDay()`
- `dashboardGetRangeDdayLabel()`
- `dashboardGetExamGroupKey()`
- `dashboardFormatInlineMemo()`
- `getDashboardAcademyScheduleSeries()`

출력 조건:

- 오늘부터 7일 이내 시험/학원 운영 일정
- 시험 일정 우선
- 학원 일정은 `target_scope === 'global'`만 대시보드 공용 일정으로 사용
- 기간 일정은 날짜 범위와 D-Day/진행중 상태를 표시

결론:

- EIE 요구사항의 공용 주간일정은 APMath dashboard 주간일정 카드 로직을 참고하면 된다.
- 다만 EIE 신규 일정 API는 학생별/선생님별 필터가 아니라 공용 데이터로 정의해야 한다.

## 12. APMath backend 동작 확인

파일: `apmath/worker-backup/worker/routes/operations.js`

메모:

- route: `operation-memos`
- GET:
  - admin은 모든 `operation_memos` 조회
  - teacher는 `teacher_name = currentTeacher.name OR teacher_name = '' OR teacher_name IS NULL`
- POST:
  - `teacher_name = currentTeacher.name`
- PATCH/DELETE:
  - admin은 타인 메모 수정/삭제 가능
  - teacher는 `teacher_name`이 다르면 403

일정:

- route: `exam-schedules`
  - GET은 공용 전체 조회
  - POST/PATCH/DELETE 및 group 작업 제공
- route: `academy-schedules`
  - `target_scope`는 `global`, `teacher`, `student`
  - GET은 admin/teacher 접근에 따라 필터가 다름
  - dashboard 카드에서는 `global`만 공용 일정으로 사용한다.

EIE 이식 시 달라야 하는 점:

- APMath 메모의 admin 무필터 조회를 EIE에 그대로 옮기면 FAIL이다.
- APMath 메모의 `teacher_name` scope를 EIE에 그대로 옮기면 FAIL이다.
- EIE 메모는 `owner_user_id = auth.id` 기준으로 GET/PATCH/DELETE를 제한해야 한다.
- EIE 주간일정은 공용 요구사항이므로 `exam_schedules`, `academy_schedules`를 공용 일정으로 정의해야 한다.

## 13. Backend API 이식 필요 목록

EIE에 필요한 신규 API:

- `GET /api/eie/operation-memos`
- `POST /api/eie/operation-memos`
- `PATCH /api/eie/operation-memos/:id`
- `DELETE /api/eie/operation-memos/:id`
- `GET /api/eie/exam-schedules`
- `POST /api/eie/exam-schedules`
- `POST /api/eie/exam-schedules/group`
- `PATCH /api/eie/exam-schedules/group`
- `POST /api/eie/exam-schedules/group-delete`
- `PATCH /api/eie/exam-schedules/:id`
- `DELETE /api/eie/exam-schedules/:id`
- `GET /api/eie/academy-schedules`
- `POST /api/eie/academy-schedules`
- `POST /api/eie/academy-schedules/batch`
- `PATCH /api/eie/academy-schedules/:id`
- `PATCH /api/eie/academy-schedules/series/:seriesId`
- `DELETE /api/eie/academy-schedules/:id`
- `DELETE /api/eie/academy-schedules/series/:seriesId`

권장 DB:

- `eie_operation_memos`
- `eie_exam_schedules`
- `eie_academy_schedules`

권장 메모 schema 핵심:

- `id`
- `owner_user_id`
- `owner_name`
- `owner_role`
- `memo_date`
- `content`
- `is_pinned`
- `is_done`
- `created_at`
- `updated_at`

권장 메모 query:

```sql
SELECT *
FROM eie_operation_memos
WHERE owner_user_id = ?
ORDER BY is_done ASC, is_pinned DESC, memo_date ASC, created_at DESC;
```

PATCH/DELETE 소유권 체크:

```sql
SELECT owner_user_id
FROM eie_operation_memos
WHERE id = ?;
```

`owner_user_id !== auth.id`이면 403.

## 14. 예상 수정 파일

Loop 1:

- `workers/wangji-eie-worker/routes/eie.js`
- `workers/wangji-eie-worker/migrations/20260626_eie_operation_memos.sql` 또는 분리 migration
- 필요 시 `workers/wangji-eie-worker/index.js`는 기존 auth 전달 구조 확인 후 최소 변경

Loop 2:

- `eie/js/eie-api.js`

Loop 3:

- `eie/js/views/eie-operation-memos.js`
- `eie/js/views/eie-operation-schedule.js`
- `eie/index.html`
- EIE CSS 파일 1개 또는 기존 dashboard CSS

Loop 4:

- `eie/js/views/eie-dashboard.js`

Loop 5:

- `eie/js/views/eie-teacher.js`

Loop 6/7:

- 필요한 경우 EIE CSS 보정
- 테스트/검증 문서

## 15. 회귀 위험

높음:

- 선생님 대시보드에서 `_teacherName` 기준으로 메모를 조회하면 타인 메모 노출 가능.
- APMath backend의 admin 무필터 동작을 EIE에 그대로 이식하면 원장이 모든 선생님 메모를 보게 됨.
- localStorage 메모를 계속 데이터 소스로 두면 로그인 사용자별 scope와 DB 동기화가 깨짐.

중간:

- 신규 공통 JS 파일 script 순서가 `eie-dashboard.js`/`eie-teacher.js` 뒤에 있으면 renderer가 undefined가 될 수 있음.
- 일정 route 명이 기존 `eie_exam_records`와 혼동되면 성적/시험기록 기능 회귀가 날 수 있음.
- `academy_schedules`를 개인 일정처럼 필터링하면 선생님 대시보드에서 공용 주간일정이 비어 보일 수 있음.

UI:

- APMath inline style을 그대로 복사하면 EIE surface/card 톤과 불일치할 수 있음.
- 모바일에서 체크박스, 날짜, 라벨이 좁은 카드 안에서 겹칠 수 있음.
- placeholder 버튼만 남으면 Loop 4/5 PASS 조건을 만족하지 못함.

## 16. 구현 루프 제안

Loop 1 Backend/DB:

- `eie_operation_memos`, `eie_exam_schedules`, `eie_academy_schedules` migration 추가.
- route 추가.
- 메모는 `teacher.id`를 `owner_user_id`로 저장/필터.
- 일정은 공용 조회로 제공.
- AP 기존 EIE 학생/출석/상담 API 회귀 여부 확인.

Loop 2 Front API:

- `EieApi`에 메모/시험일정/학원일정 메서드 추가.
- Bearer 흐름만 사용.
- 메모 API에 teacherName 파라미터 금지.

Loop 3 Common UI:

- 공통 메모 카드와 공통 주간일정 카드 파일 추가.
- 카드 renderer는 받은 데이터만 표시하고 scope 판단은 서버/API에 둔다.
- 모달/CRUD는 EIE API adapter만 호출한다.

Loop 4 Owner Dashboard:

- localStorage 메모 카드 제거.
- `renderEieMemoDashboardCard(data, { mode: 'owner' })` 연결.
- `renderWeeklySchedulePlaceholder()` 제거/대체.

Loop 5 Teacher Dashboard:

- `EieTeacherView.render()`에 같은 공통 카드 연결.
- `_teacherName`을 메모 요청에 넘기지 않도록 검증.

Loop 6 UI Review:

- 빈 상태, 메모 있음, 고정 메모, 시험/휴무/기타 일정, 기간 일정, 모바일 상태 확인.

Loop 7 Regression:

- 로그인, 원장 대시보드, 선생님 대시보드, 시간표, 출석, 성적, 관리, 학생 상세, 상담 목록, timetable grid 확인.

## 17. Loop 0 PASS/FAIL 판단

PASS:

- 코드 수정 없이 조사만 수행했다.
- EIE 원장 대시보드 메모/주간일정 위치를 확인했다.
- EIE 선생님 대시보드 위치와 `_teacherName` 위험을 확인했다.
- APMath 메모/일정 원본 함수와 backend 동작을 매핑했다.
- localStorage 메모와 주간일정 placeholder 제거 필요성을 확인했다.
- 다음 구현 루프의 수정 범위와 회귀 위험을 정리했다.

UNVERIFIED:

- 브라우저 실행/스크린샷 검증은 이번 Loop 0 범위가 조사 전용이라 수행하지 않았다.
- 실제 DB에 migration 적용 여부는 확인하지 않았다.
- 신규 API 동작 테스트는 아직 구현 전이라 수행하지 않았다.
