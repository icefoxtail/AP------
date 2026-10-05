# AP Math Phase 1d-1 Dashboard Admin Boundary Plan

## 0. 확인한 문서와 파일

- 읽은 문서:
  - `docs/reports/apmath-phase1-dashboard-audit.md`
  - `docs/reports/apmath-phase1-function-inventory.md`
  - `docs/reports/apmath-phase1-script-order-map.md`
  - `docs/reports/apmath-phase1-split-risk-map.md`
  - `docs/reports/apmath-phase1-student-split-result.md`
  - `docs/reports/apmath-phase1-classroom-split-result.md`
  - `docs/reports/apmath-smoke-test-guide.md`
  - `docs/reports/apmath-smoke-test-result.md`
  - `docs/reports/ap-code-review-improvements-20260612.md`
- 직접 확인한 파일:
  - `apmath/index.html`
  - `apmath/js/dashboard.js`
  - `apmath/js/dashboard-admin.js`
  - `apmath/js/dashboard-teacher.js`
  - `tests/apmath-global-surface.test.js`
- 이번 작업 범위: dashboard admin 경계 결정 설계 문서 작성
- 코드 수정 여부: 없음

확인 상태:

| 항목 | 상태 |
|---|---|
| dashboard 감사 문서 정독 여부 | 완료 |
| `index.html` script 순서 재확인 | 완료 |
| `dashboard.js` 재확인 | 완료 |
| `dashboard-admin.js` 재확인 | 완료 |
| `dashboard-teacher.js` 재확인 | 완료 |
| 이번 작업이 코드 수정이 아닌 설계 작업인지 확인 | 완료 |

현재 직접 확인한 script 순서:

```text
990  ../shared/js/wangji-owner-auth-bridge.js
991  js/core.js
992  js/ui.js
993  js/report.js
994  js/qr-omr.js
995  js/student.js
996  js/student-edit.js
997  js/clinic-print.js
998  js/management.js
999  js/student-export.js
1000 js/textbook.js
1001 js/memo.js
1002 js/schedule.js
1003 js/cumulative.js
1004 js/timetable.js
1005 js/classroom.js
1006 js/classroom-planner.js
1007 js/dashboard-admin.js
1008 js/dashboard-teacher.js
1009 js/dashboard-assistant-memos.js
1010 js/dashboard.js
1011 js/study-material-wrong.js
1012 js/app.js
```

## 1. 현재 문제 정의

- `dashboard-admin.js` 현재 역할:
  - admin role 확인 helper
  - AP/EIE system gate 생성/삽입/제거
  - 진단평가 결과 localStorage 목록/모달
  - `renderAdminDashboardView()` wrapper
  - 신규 상담 신청 플로팅/목록/상태 업데이트
- `dashboard-teacher.js` 현재 역할:
  - AP 선생님 전용 dashboard view body renderer
  - system gate 제거
  - `dashboard.js`의 공통 helper를 호출해 학급관리, 일지 카드, 할일 영역을 렌더
- `dashboard.js` 현재 역할:
  - 공통 helper
  - `renderDashboard()` role dispatch
  - `renderAdminControlCenter()` 실제 원장 운영센터 body
  - 학생 현황, 선생님 계정, 상담, 글로벌 검색, 점검 목록, 일지 승인
  - teacher/admin 양쪽이 공유하는 일지/카드/온보딩 helper
- 문제 요약:
  - `dashboard-admin.js`는 admin 파일명과 wrapper를 갖고 있으나 실제 admin center 본문은 `dashboard.js`에 남아 있다.
  - AP/EIE gate는 `dashboard-admin.js`의 DOM 삽입 함수와 `dashboard.js`의 inline HTML로 중복된다.
  - `dashboard-teacher.js`는 분리되어 있지만 공통 helper 대부분을 `dashboard.js`에 의존하므로 admin 함수 이동 시 teacher 화면 회귀 위험이 있다.
  - 현재 `tests/apmath-global-surface.test.js`는 student/classroom은 합산 surface로 검사하지만 dashboard는 아직 `dashboard.js` 단독 surface만 검사한다.

## 2. 선택지 비교

| 선택지 | 설명 | 장점 | 단점 | 판정 |
|---|---|---|---|---|
| A. `dashboard-admin.js` 확장 | 기존 `dashboard-admin.js`를 admin center 본체 파일로 삼고, 향후 `dashboard.js`의 admin 함수군을 이 파일로 순수 이동한다. | 파일명과 역할이 맞아진다. 새 파일을 늘리지 않는다. `renderAdminDashboardView()`와 `renderAdminControlCenter()`를 한 파일에 둘 수 있다. AP/EIE gate 책임 단일화가 가장 쉽다. | `dashboard-admin.js`가 395줄에서 크게 커진다. 진단평가/문의 보조 기능과 운영센터 본문이 섞인다. | YES |
| B. `dashboard-admin-center.js` 신규 | `dashboard-admin.js`는 보조 admin 기능 파일로 유지하고, 운영센터 본문만 신규 파일로 분리한다. | 대형 운영센터 body를 별도 파일로 명확히 볼 수 있다. admin 보조 기능과 body renderer를 나눌 수 있다. | admin 전용 파일이 2개가 되어 이름 혼란이 커진다. gate 책임을 또 결정해야 한다. `dashboard.js` 뒤에 로드하면 dispatch 구조를 바꿔야 하고, 앞에 로드하면 공통 helper 선분리가 필요하다. | NO |
| C. gate 책임만 먼저 정리 | 분할 전 AP/EIE gate 중복만 제거하고 책임을 한 파일로 단일화한다. | 가장 작은 실제 코드 작업이다. admin wrapper/body 경계를 건드리기 전 DOM 중복 위험을 낮춘다. | UI/DOM 동작 변경이므로 순수 이동 PR이 아니다. 브라우저 smoke가 필요하다. Phase 1 순수 분할과 별도 성격이다. | HOLD |
| D. dashboard 보류 후 report 진행 | dashboard 경계가 복잡하므로 Phase 1에서 dashboard 분할을 보류하고 report 분할로 넘어간다. | dashboard admin/teacher 회귀 위험을 당장 피한다. | report.js는 더 위험한 마지막 분할 대상이다. dashboard 경계 설계 부채가 남고 Phase 1 완료 기준이 흐려진다. | NO |

결정:

- `dashboard-admin.js` 확장 여부: YES
- `dashboard-admin-center.js` 신규 생성 여부: NO
- AP/EIE gate 책임만 먼저 정리 여부: HOLD
- dashboard 보류 후 report 진행 여부: NO

## 3. admin 함수군 재분류

| 그룹 | 대표 함수 | 현재 위치 | 권장 위치 | 이동 가능 여부 | 선행 조건 | 이유 |
|---|---|---|---|---|---|---|
| A. gate / admin entry | `apCreateAdminSystemGate`, `apInsertAdminSystemGate`, `renderAdminDashboardView`, `renderAdminControlCenter` | `dashboard-admin.js`, `dashboard.js` | `dashboard-admin.js` | HOLD | gate 중복 제거 방식 결정, browser smoke 준비 | entry wrapper와 body renderer를 같은 admin 파일에 두는 것이 가장 단순하다. 다만 gate DOM 중복은 순수 이동 전에 결정해야 한다. |
| B. 학생 현황 / 학년 모달 / 퇴원 / 숨김 / PIN | `openAdminStudentList`, `restoreDischargedStudent`, `openAdminPinBatchModal`, `handleAdminBatchGeneratePins`, `adminBuildOverviewData`, `renderAdminStudentOverviewPanel`, `openAdminStudentGradeModal` | `dashboard.js` | `dashboard-admin.js` | YES | `dashboard.js + dashboard-admin.js` 합산 surface guard 설계 | admin 전용 운영센터 핵심이며 `dashboard-admin.js`에 대응 기능이 없다. |
| C. 선생님 계정 관리 | `openAdminTeacherAccountManage`, `renderAdminTeacherAccountManage`, `handleAdminCreateTeacher`, `handleAdminUpdateTeacher`, `handleAdminResetTeacherPassword` | `dashboard.js` | `dashboard-admin.js` | YES | 계정 CRUD inline onclick surface 보존 | admin 계정 관리 cluster로 teacher dashboard body와 무관하다. |
| D. 상담 센터 / 상담 이력 | `renderAdminRecentConsultationPanel`, `openAdminConsultationCenter`, `handleAdminConsultationSearchInput`, `openAdminStudentConsultationHistory` | `dashboard.js` | `dashboard-admin.js` | YES | `dashboard-admin.js`의 public inquiry와 명칭 충돌 점검 | 재원생 상담 이력 cluster다. public inquiry와 데이터 목적이 달라 같은 admin 파일 안에서 섹션을 분리하면 된다. |
| E. 글로벌 검색 | `adminBuildGlobalSearchResults`, `renderAdminGlobalSearchPanel`, `handleAdminGlobalSearchInput`, `openAdminGlobalSearchResult` | `dashboard.js` | `dashboard-admin.js` | YES | onclick guard, search result navigation smoke | admin 전용 검색이며 teacher view가 쓰지 않는다. |
| F. 점검 목록 | `openAdminLeaveStudentList`, `openAdminUnassignedStudentList`, `openAdminClassCleanupList`, `openAdminTeacherlessClassList`, `renderAdminSimpleStudentList` | `dashboard.js` | `dashboard-admin.js` | YES | 학생 상세/수정 entry dependency 확인 | admin 운영 점검 cluster다. |
| G. 일지 승인 / 선생님 카드 | `renderAdminJournalList`, `openAdminJournalFeedback`, `approveJournal`, `renderAdminTeacherCards`, `renderAdminTeacherStudents`, `renderAdminTeacherAllStudents` | `dashboard.js` | `dashboard-admin.js` + 공통 helper는 `dashboard.js` 유지 | HOLD | `renderDashboardJournalWeekMatrix`, `dashboardFindJournal`, `dashboardIsJournalDone` 유지 기준 확정 | admin 전용 UI지만 teacher와 공유하는 일지 helper 의존이 있다. 이동은 가능하되 공유 helper까지 끌고 가면 안 된다. |
| H. 진단평가 / assessment archive metric | `openAdminDiagnosticPanel`, `apGetAdminDiagnosticAssessmentList`, `renderAdminAssessmentArchiveMetric`, `openAdminAssessmentArchiveWindow` | `dashboard-admin.js`, `dashboard.js` | `dashboard-admin.js` | HOLD | assessment archive metric과 diagnostic alert의 책임 통합 판단 | 진단평가 결과 모달은 이미 admin 파일에 있고, metric helper만 `dashboard.js`에 있다. admin 파일 확장 시 함께 모으는 것이 자연스럽다. |
| I. 공통 helper로 남겨야 할 것 | `computeDashboardData`, `renderTodayJournalCard`, `renderTodoSections`, `renderDashboardJournalWeekMatrix`, `dashboardFindJournal`, `dashboardIsJournalDone`, `sortClassesForDashboard`, `renderClassSummaryCard`, `isClassVisibleForCurrentTeacher` | `dashboard.js` | `dashboard.js` | NO | 별도 공통 helper 파일을 만들기 전까지 유지 | teacher dashboard가 직접 호출하거나 admin/teacher 양쪽에서 공유한다. admin 파일로 이동하면 teacher view가 깨질 수 있다. |

## 4. AP/EIE gate 책임 결정

- 현재 중복:
  - `dashboard-admin.js`: `apCreateAdminSystemGate`, `apInsertAdminSystemGate`, `apRemoveAdminSystemGate`
  - `dashboard.js`: `renderAdminControlCenter()` 내부 `adminSystemGateHtml`
- 최종 권장 위치: `dashboard-admin.js`
- 판단: YES
- 이유:
  - gate는 admin role wrapper와 직접 연결된다.
  - `dashboard-admin.js`는 이미 role 확인, gate 생성/삽입/제거, teacher 화면 진입 시 제거 로직과 대응된다.
  - `renderAdminControlCenter()`는 body renderer로 좁히는 편이 경계가 명확하다.
- 다음 작업 단위:
  - 실제 코드 PR에서는 gate 중복 제거만 별도 PR로 하지 말고, `renderAdminControlCenter()`를 `dashboard-admin.js`로 이동하는 첫 admin 순수 이동 PR 안에서 gate 책임을 `dashboard-admin.js`로 단일화한다.
  - 단, gate HTML 제거는 DOM 결과가 달라질 수 있으므로 admin login smoke와 EIE 이동 버튼 확인을 필수로 둔다.
- 위험도: 중간
  - HTML 결과는 같아야 하지만 삽입 시점이 wrapper 이후로 바뀔 수 있다.
  - `renderAdminControlCenter()` 내부에서 gate HTML을 제거하면 `apInsertAdminSystemGate()`가 실패 없이 동작해야 한다.

## 5. renderAdminDashboardView / renderAdminControlCenter 관계

- 현재 구조:
  - `renderDashboard()`는 admin role에서 먼저 `renderAdminDashboardView()`를 호출한다.
  - `renderAdminDashboardView()`는 `dashboard-admin.js`에 있으며 body class를 조정하고 `renderAdminControlCenter()`를 호출한 뒤 `apInsertAdminSystemGate(0)`를 실행한다.
  - `renderAdminControlCenter()`는 `dashboard.js`에 있으며 실제 원장 운영센터 body를 만든다.
- 권장 구조:
  - `renderAdminDashboardView()`는 wrapper로 유지한다.
  - `renderAdminControlCenter()`는 실제 body renderer로 유지하되 위치를 `dashboard-admin.js`로 옮긴다.
  - 두 함수는 같은 파일에 둔다.
  - `dashboard.js`의 `renderDashboard()`는 admin role dispatch만 유지한다.
- 다음 작업 단위:
  - Task 1: `tests/apmath-global-surface.test.js` dashboard target을 `dashboard-admin.js + dashboard-teacher.js + dashboard-assistant-memos.js + dashboard.js` 합산 방식으로 설계한다.
  - Task 2: `renderAdminControlCenter()`와 바로 필요한 admin-only render/data helper 중 첫 cluster를 `dashboard-admin.js`로 순수 이동한다.
  - Task 3: admin 화면 smoke로 AP/EIE gate, overview, 검색, 상담, 선생님 카드, 일지 확인 진입을 확인한다.

## 6. 공통 helper 유지 기준

| 함수군 | 사용처 | 이동 여부 | 이유 |
|---|---|---|---|
| `computeDashboardData` | `dashboard-teacher.js`, teacher dashboard card | NO | teacher body renderer가 직접 호출한다. |
| `renderTodayJournalCard` | `dashboard-teacher.js`, teacher side panel | NO | teacher 화면 전용/공통 일지 카드다. |
| `renderTodoSections` | `dashboard-teacher.js`, teacher side panel | NO | teacher 화면에서 직접 호출한다. |
| `renderDashboardJournalWeekMatrix` | teacher journal matrix, admin teacher cards | NO | admin/teacher 양쪽에서 공유한다. |
| `dashboardFindJournal` | journal matrix, missing journal count | NO | admin 일지 카드와 teacher 일지 상태가 공유한다. |
| `dashboardIsJournalDone` | journal matrix, missing journal count | NO | 공유 판단 helper다. |
| `sortClassesForDashboard` | `dashboard-teacher.js`, admin teacher students | NO | teacher class list와 admin teacher modal 양쪽에서 필요하다. |
| `renderClassSummaryCard` | `dashboard-teacher.js` | NO | teacher class card renderer다. |
| `isClassVisibleForCurrentTeacher` | `dashboard-teacher.js` | NO | teacher visibility filter다. |

공통 helper 파일 필요 여부: HOLD

- 지금 당장 새 공통 helper 파일을 만들면 dashboard 분할 범위가 커진다.
- 첫 admin PR에서는 위 helper를 `dashboard.js`에 유지하고, admin file에서 런타임 참조하는 방식이 더 작다.
- 이후 admin/teacher 공통 helper가 충분히 드러나면 별도 `dashboard-common.js` 같은 파일을 검토한다.

## 7. 최종 권고

- `dashboard-admin-center.js` 생성 여부: NO
- `dashboard-admin.js` 확장 여부: YES
- 바로 코드 작업 가능 여부: HOLD
- 다음 Codex 작업명: Phase 1d-2 - dashboard admin surface guard 확장 및 gate 책임 단일화 준비
- 다음 작업에서 수정 가능한 파일:
  - `tests/apmath-global-surface.test.js`
  - `docs/reports/apmath-phase1-dashboard-boundary-plan.md` 또는 새 결과 보고서
  - 필요한 경우 `docs/reports/apmath-phase1-script-order-map.md` 보정 문서
- 다음 작업에서 수정 금지 파일:
  - `apmath/js/dashboard.js`
  - `apmath/js/dashboard-admin.js`
  - `apmath/js/dashboard-teacher.js`
  - `apmath/js/dashboard-assistant-memos.js`
  - `apmath/index.html`
  - `tests/fixtures/*`
  - `eie/*`
  - `workers/*`
  - `archive/*`
  - `migrations/*`

권고 이유:

1. 바로 admin 함수 이동을 시작하기 전, dashboard surface guard를 student/classroom처럼 합산 검사로 바꾸는 것이 안전하다.
2. 신규 `dashboard-admin-center.js`는 파일 수와 entry 혼선을 늘리므로 만들지 않는다.
3. admin center 본체는 기존 `dashboard-admin.js`로 흡수하는 것이 파일명과 실제 역할을 맞춘다.
4. AP/EIE gate 책임은 `dashboard-admin.js`로 단일화하되, DOM 변경 가능성이 있어 실제 이동 PR에서 browser smoke와 함께 검증한다.

## 8. 검수용 요약

- 생성/수정 파일:
  - `docs/reports/apmath-phase1-dashboard-boundary-plan.md`
  - `CODEX_RESULT1.md`
- 운영 JS 수정 여부: 없음
- `index.html` 수정 여부: 없음
- tests 수정 여부: 없음
- EIE/Worker/archive 수정 여부: 없음
- 브라우저 확인 여부: 미수행 - 설계 문서 작업만 수행
- 테스트 실행 여부: 미수행 - 코드 변경 없는 설계 문서 작업만 수행
- 미확인 항목:
  - admin login browser smoke
  - AP/EIE gate DOM 동일성
  - dashboard 합산 surface guard 실제 코드 변경
  - 첫 admin 순수 이동 PR 후 onclick guard 결과
