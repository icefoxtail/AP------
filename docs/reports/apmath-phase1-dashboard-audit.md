# AP Math Phase 1d-0 Dashboard Audit

- 작성일: 2026-06-14
- 작업명: Phase 1d-0 - dashboard 기존 분리 상태 감사
- 범위: `apmath/index.html`, `apmath/js/dashboard.js`, `apmath/js/dashboard-admin.js`, `apmath/js/dashboard-teacher.js`, 지정 테스트/보고서 문서 직접 확인
- 결론 요약: 이번 단계는 분할이 아니라 감사 작업이다. `dashboard.js`에는 원장 운영센터 함수군이 많이 남아 있으나, 기존 `dashboard-admin.js`의 명목상 역할과 실제 역할이 어긋나 있으므로 바로 신규 파일을 만들기보다 admin 파일 경계 재정의와 surface guard 계획이 먼저 필요하다.

## 1. 현재 대시보드 파일 구조

| 파일 | 현재 역할 | 비고 |
|---|---|---|
| `apmath/js/dashboard-admin.js` | admin 전용 보조 렌더러. AP/EIE 시스템 게이트 삽입, 진단평가 결과 모달, 신규 상담 신청 플로팅/목록을 담당하고 `renderAdminDashboardView()`에서 `renderAdminControlCenter()`를 호출한다. | 파일 주석은 "원장님(admin) 전용 대시보드 렌더러"라고 되어 있으나, 핵심 운영센터 본문은 아직 `dashboard.js`의 `renderAdminControlCenter()`에 남아 있다. |
| `apmath/js/dashboard-teacher.js` | AP 선생님 전용 대시보드 렌더러. 선생님 화면 전용 클래스 모드, 빠른 메뉴, 학급관리, 일지/할일 영역을 렌더한다. | `computeDashboardData`, `renderTodayJournalCard`, `renderTodoSections`, `isClassVisibleForCurrentTeacher`, `sortClassesForDashboard`, `renderClassSummaryCard` 등 `dashboard.js` 공통 helper에 강하게 의존한다. |
| `apmath/js/dashboard.js` | 공통 helper, role dispatch, 원장 운영센터 본문, 교사용 공통 카드/일지/온보딩/마감 패널이 섞인 최종 composition layer. | `renderDashboard()`가 admin이면 `renderAdminDashboardView()` 또는 `renderAdminControlCenter()`로, teacher이면 `renderTeacherDashboardView()`로 분기한다. |

확인한 규모:

| 파일 | 줄 수 |
|---|---:|
| `apmath/js/dashboard.js` | 3,957 |
| `apmath/js/dashboard-admin.js` | 395 |
| `apmath/js/dashboard-teacher.js` | 108 |

## 2. 현재 script 로드 순서

`apmath/index.html`에서 직접 확인한 현재 script 순서:

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

주의:

- 기존 `docs/reports/apmath-phase1-script-order-map.md`의 2026-06-13 기록에는 `student-edit.js`, `classroom-planner.js`, `dashboard-assistant-memos.js`가 없다.
- 현재 직접 확인 기준으로는 `dashboard-admin.js`와 `dashboard-teacher.js`가 `dashboard.js`보다 먼저 로드되고, 그 사이에 `dashboard-assistant-memos.js`가 추가되어 있다.
- `dashboard-admin.js`의 `renderAdminDashboardView()`는 런타임 호출 시점에 `renderAdminControlCenter` 존재 여부를 확인하므로 현재 순서 자체는 즉시 오류를 내는 형태는 아니다.

## 3. dashboard.js 잔여 관리자 함수 목록

| 함수/상수 | 종류 | 대략 위치 | 역할 | 이동 후보 여부 | 이유 |
|---|---|---:|---|---|---|
| `openAdminAssessmentArchiveWindow` | function | line 328 | 관리자 시험지 보관함 창 열기 | HOLD | admin UI에서 쓰이지만 단순 window helper라 기존 admin 파일/공통 helper 어디가 맞는지 경계 판단 필요. |
| `openDischargedStudents` | function | line 812 | 퇴원생 버튼을 `openAdminStudentList('discharged')`로 연결 | YES | admin 학생 목록 wrapper로 원장 운영센터에 속한다. |
| `restoreDischargedStudent`, `hideDischargedStudent`, `purgeHiddenStudent` | async function | line 826 | 퇴원/숨김 학생 복구, 숨김, 완전 삭제 | YES | admin 학생 상태 관리 전용. `api`, `loadData`, `openAdminStudentList` 의존. |
| `openAdminStudentList` | function | line 856 | 재원/최근등록/퇴원/숨김/관리필요 학생 목록 모달 | YES | 원장 운영센터 핵심. 학생 상태/위험도/학년 요약과 결합. |
| `openAdminOperationMenu` | function | line 927 | 관리 메뉴 모달. 선생님 계정, 일지 확인, 퇴원생 관리 진입 | YES | admin action hub. |
| `openAdminPinBatchModal`, `handleAdminBatchGeneratePins` | function / async function | line 962, 1016 | 미발급 학생 PIN 일괄 생성 UI/API | YES | admin 전용 계정/학생 운영 기능. |
| `getAdminClassGradeRank` | function | line 1009 | 학년 순위 계산 | HOLD | admin 목록 정렬에도 쓰이나 공통 학년 정렬 helper와 중복 가능성 확인 필요. |
| `getAdminTeacherRows`, `adminTeacherRoleLabel`, `openAdminTeacherAccountManage`, `renderAdminTeacherAccountManage` | function / async function | line 1042-1065 | 선생님 계정 목록 조회/렌더 | YES | teacher account 관리 전용. |
| `openAdminCreateTeacherModal`, `handleAdminCreateTeacher`, `openAdminEditTeacherModal`, `handleAdminUpdateTeacher`, `openAdminResetTeacherPasswordModal`, `handleAdminResetTeacherPassword` | function / async function | line 1103-1191 | 선생님 계정 생성, 수정, 비밀번호 초기화 | YES | admin 계정 관리 클러스터로 독립성이 높다. |
| `adminNormalizeStatus`, `adminGetStudentClassMap`, `adminGetClassById`, `adminGetStudentClass`, `adminGetClassStudentIds`, `adminGetCreatedDateText`, `adminGetDaysSince`, `adminIsRecentStudent` | function | line 1214-1250 | admin overview용 학생/반/status/date helper | HOLD | admin 전용 이름이지만 `dashboard.js`의 학생/반 공통 helper와 섞여 있어 이동 시 의존성 추적 필요. |
| `adminBuildOverviewData` | function | line 1258 | 원장 대시보드 개요 데이터 구성 | YES | `renderAdminControlCenter()`의 핵심 데이터 builder. |
| `adminOpenStudentEditOrDetail`, `adminOpenDashboardStudentDetail`, `adminOpenDashboardStudentEdit` | function | line 1305-1318 | admin 화면에서 학생 상세/수정 열기 | HOLD | `openStudentDetail`, `renderStudentEditForm` 등 다른 모듈 public surface와 연결되어 있어 onclick guard 검증이 필요. |
| `adminBuildGradeHoverRows`, `renderAdminMiniMetric`, `renderAdminAssessmentArchiveMetric`, `renderAdminStudentOverviewPanel`, `renderAdminNeedCheckPanel`, `renderAdminNewStudentPanel` | function | line 1326-1424 | 원장 개요 metric, 학생 현황, 점검 필요, 최근 등록 패널 렌더 | YES | admin 운영센터 렌더 cluster. |
| `adminGetGradeLabel`, `adminGetGradeOrder`, `adminGetStudentListByType`, `adminRenderStudentGradeSummary`, `adminEnsureStudentGradeModalState`, `openAdminStudentGradeModal`, `adminSetStudentGradeModalGrade`, `adminHandleStudentGradeModalSearch`, `renderAdminStudentGradeModalBody`, `renderAdminStudentGradeModal` | function | line 1475-1605 | 학년별 학생 목록/필터/검색 모달 | YES | admin 학생 현황 모달 cluster. |
| `adminGetConsultationDate`, `adminConsultationSortValue`, `adminGetStudentById`, `adminGetConsultationRows`, `adminGetRecentConsultationRows`, `adminConsultationRowStudentName`, `adminRecentConsultationPreviewText`, `adminRenderConsultationHistoryRows`, `openAdminStudentConsultationHistory`, `renderAdminRecentConsultationPanel`, `openAdminConsultationCenter`, `handleAdminConsultationSearchInput`, `renderAdminConsultationCenterBody` | function | line 1611-1750 | 최근 상담/상담 전체 보기/학생별 상담 이력 | YES | consultation center cluster로 admin 전용성이 높다. |
| `openAdminLeaveStudentList`, `openAdminUnassignedStudentList`, `openAdminClassCleanupList`, `openAdminTeacherlessClassList`, `renderAdminSimpleStudentList` | function | line 1793-1839 | 휴원생/반 배정 필요/반 정리/담당 선생님 미지정 목록 | YES | admin 점검 목록 cluster. |
| `adminNormalizeSearchValue`, `adminSearchIncludes`, `adminGetSearchClassNameByStudentId`, `adminGetSearchClassNameByClassId`, `adminGetAssignmentTypeLabel`, `adminBuildGlobalSearchResults`, `adminSearchTypeLabel`, `renderAdminGlobalSearchResults`, `handleAdminGlobalSearchInput`, `openAdminGlobalSearchResult`, `renderAdminGlobalSearchPanel` | function | line 1866-2040 | 원장 글로벌 검색. 학생, 반, 학교시험, 배정 시험 검색 | YES | global search cluster로 독립 후보. |
| `renderAdminControlCenter` | function | line 2062 | 원장 운영센터 본문 렌더. AP/EIE gate, shortcut, overview, teacher cards, 상담, 주간일정 구성 | YES | 신규 분할을 한다면 가장 큰 entry point. 단, `dashboard-admin.js`와 entry 책임이 겹친다. |
| `renderAdminStudentSearch` | function | line 2413 | legacy admin 학생 검색 렌더 | HOLD | 현재 원장 운영센터와 연결 여부 재확인 필요. 남은 legacy일 수 있다. |
| `renderAdminJournalList`, `openAdminJournalFeedback`, `approveJournal` | function | line 3752-3803 | 선생님 일지 확인/피드백/결재 완료 | YES | admin 일지 승인 cluster. |
| `formatAdminRecentJournalDate`, `getAdminRecentTeacherJournals`, `openAdminRecentTeacherJournals`, `renderAdminTeacherCards`, `openAdminTeacherPanel`, `renderAdminTeacherAllStudents`, `renderAdminTeacherStudents` | function | line 3814-3927 | 선생님 카드, 선생님별 일지/담당반/재원 요약 | HOLD | 원장 전용 화면에서 쓰이지만 teacher data를 보여주는 admin aggregate다. `renderDashboardJournalWeekMatrix` 등 공통 일지 helper 의존성이 있다. |

감사 대상 키워드 기준 확인:

- `teacher account`: `openAdminTeacherAccountManage` 및 계정 CRUD 함수군에서 확인.
- `consultation center`: `openAdminConsultationCenter`, `renderAdminConsultationCenterBody`에서 확인.
- `global search` / `search`: `adminBuildGlobalSearchResults` 등 검색 cluster에서 확인.
- `withdrawn`: 코드상 UI 용어는 주로 `discharged`/`제적`/`퇴원생`으로 구현.
- `bulk pin` / `pin`: `openAdminPinBatchModal`, `handleAdminBatchGeneratePins`.
- `admin student` / `admin grade`: 학생 목록, 학년 모달, 학년 요약 cluster.
- `owner`: `ap-owner-dashboard-bg`, `owner-dashboard-shell`, owner brand class가 `renderAdminControlCenter` 안에서 사용.
- `diagnostic`: `dashboard-admin.js`의 진단평가 함수군과 `dashboard.js`의 `renderAdminAssessmentArchiveMetric`.
- `recent journal` / `journal`: admin 일지 확인, 최근 일지, 선생님 카드 cluster.
- `metrics`: `renderAdminMiniMetric`, overview panel cluster.

## 4. dashboard-admin.js와 중복/분리 관계

| dashboard.js 잔여 함수군 | dashboard-admin.js 관련 함수 | 중복 여부 | 판단 |
|---|---|---|---|
| `renderAdminControlCenter` | `renderAdminDashboardView` | 보완 + 역할 혼선 | `dashboard-admin.js`는 admin entry처럼 보이지만 실제 본문 렌더는 `dashboard.js`에 있다. 이름 기준으로는 중복처럼 보이나 실제로는 wrapper와 body 관계다. |
| AP/EIE gate HTML in `renderAdminControlCenter` | `apCreateAdminSystemGate`, `apInsertAdminSystemGate`, `apRemoveAdminSystemGate` | 중복 | `renderAdminControlCenter` 내부에도 `adminSystemGateHtml`가 있고, `dashboard-admin.js`도 동일 목적의 gate 삽입을 제공한다. gate 책임은 한쪽으로 정리할 필요가 있다. |
| `renderAdminAssessmentArchiveMetric`, `openAdminAssessmentArchiveWindow` | `AP_ADMIN_DIAGNOSTIC_*`, `openAdminDiagnosticPanel`, `apRenderAdminDiagnosticAssessmentAlert` 호출부 | 보완 | `dashboard.js`는 보관함 metric/창 열기, `dashboard-admin.js`는 localStorage 기반 진단평가 결과 알림/모달을 담당한다. 기능 목적은 인접하지만 직접 중복은 아니다. |
| 상담/문의 cluster: `renderAdminRecentConsultationPanel`, `openAdminConsultationCenter` | `apRefreshPublicInquiryFloating`, `openPublicInquiryList`, `apUpdatePublicInquiry` | 보완 | `dashboard.js`는 재원생 상담 기록, `dashboard-admin.js`는 홈페이지 public inquiry 접수 목록을 다룬다. 둘 다 상담 계열이지만 데이터 소스와 목적이 다르다. |
| 선생님 계정 CRUD cluster | 없음 | 무관 | `dashboard-admin.js`에는 교사 계정 CRUD가 없고, `dashboard.js`에만 남아 있다. |
| 학생 현황/퇴원/숨김/PIN/학년 modal cluster | 없음 | 무관 | `dashboard-admin.js`에는 해당 admin student operation이 없다. |
| 글로벌 검색 cluster | 없음 | 무관 | `dashboard-admin.js`에는 전체 검색 기능이 없다. |
| admin 일지 승인/선생님 카드 cluster | 없음 | 무관 | `dashboard-admin.js`에는 일지 승인/선생님별 현황 카드가 없다. |

판단:

- `dashboard-admin.js`는 현재 "admin dashboard renderer"라기보다 admin 보조 기능 모듈에 가깝다.
- 가장 명확한 중복은 AP/EIE system gate다.
- 나머지 대형 admin center 기능은 `dashboard-admin.js`에 이미 존재하는 것이 아니라 `dashboard.js`에 남아 있으므로, 기능 중복보다는 파일명/책임 경계 혼선이 핵심 위험이다.

## 5. dashboard-teacher.js와 관계

| dashboard.js 함수군 | dashboard-teacher.js 관련 함수 | 관계 | 판단 |
|---|---|---|---|
| `computeDashboardData`, `renderTodayJournalCard`, `renderTodoSections` | `renderTeacherDashboardView` | 공통 helper | teacher renderer가 `dashboard.js` 공통 데이터/카드 helper를 직접 호출한다. |
| `isClassVisibleForCurrentTeacher`, `sortClassesForDashboard`, `renderClassSummaryCard`, `isMiddleSchoolClass` | `renderTeacherDashboardView` | 공통 helper + teacher 전용 필터 | 선생님 화면의 학급 목록 구성에 필수다. helper를 이동할 경우 teacher 파일도 함께 검증해야 한다. |
| `renderDashboardJournalWeekMatrix`, `dashboardFindJournal`, `dashboardIsJournalDone` | teacher 일지 카드 및 admin teacher card | 공통 helper | admin 선생님 카드와 teacher 주간 일지 UI가 같은 helper를 공유한다. admin 분할 시 이 helper를 admin 파일로 옮기면 teacher가 깨질 수 있다. |
| `queueDashboardOnboardingTasksLoad`, onboarding 함수군 | `renderTeacherDashboardView` 후속 호출 | teacher 전용 + 공통 상태 | teacher 화면에서 온보딩 패널을 로드하지만 구현은 `dashboard.js`에 있다. |
| `renderAdminTeacherCards`, `renderAdminTeacherStudents`, `renderAdminTeacherAllStudents` | 직접 관련 함수 없음 | admin aggregate | 선생님 정보를 다루지만 admin 화면에서 선생님별 현황을 보여주는 함수라 teacher 전용 파일로 이동하면 안 된다. |
| `renderDashboard` role dispatch | `renderTeacherDashboardView` | entry dependency | `dashboard.js`가 최종 dispatcher이며 teacher 파일은 독립 부트스트랩이 아니다. |

판단:

- `dashboard-teacher.js` 자체에는 teacher 전용 렌더 본문만 있고, 필요한 helper 대부분은 `dashboard.js`에 남아 있다.
- `dashboard.js`의 잔여 teacher 전용 로직은 "렌더 본문"보다 "공통 helper/온보딩/일지/데이터 계산" 형태가 크다.
- admin center를 분리할 때 teacher helper를 함께 이동하면 안 되며, `renderDashboardJournalWeekMatrix`처럼 admin/teacher 양쪽에서 쓰이는 helper는 별도 공통 영역으로 남기는 편이 안전하다.

## 6. 다음 분할 권고

### 결론

- `dashboard-admin-center.js` 생성 필요 여부: HOLD
- 바로 분할 가능 여부: HOLD

### 이유

1. `dashboard.js` 안에 admin 전용 함수군은 500줄을 훨씬 넘는다. line 856-2413의 원장 운영센터 cluster와 line 3752-3927의 admin 일지/선생님 카드 cluster만 합쳐도 분할 후보로 볼 충분한 규모다.
2. 그러나 기존 `dashboard-admin.js`가 이미 admin 전용 파일명을 가지고 있고, `renderAdminDashboardView()`라는 admin entry wrapper를 제공한다. 신규 `dashboard-admin-center.js`를 추가하면 `dashboard-admin.js`와 `dashboard-admin-center.js`의 역할 경계가 더 모호해질 수 있다.
3. `dashboard-admin.js`와 `dashboard.js`는 AP/EIE gate 책임이 일부 중복된다. 이 중복을 먼저 정리하지 않고 새 파일을 추가하면 gate 삽입/제거 로직이 더 흩어진다.
4. admin center 함수군은 `apEscapeHtml`, `dashboardEscapeAttr`, `state`, `api`, `loadData`, `showModal`, `closeModal`, `toast`, `openStudentDetail`, `renderClass`, 일지 helper 등 공통 함수 의존이 많다. 로드 순서와 public surface guard 조정 없이 바로 이동하면 onclick/전역 함수 회귀 위험이 있다.
5. `tests/apmath-global-surface.test.js`의 현재 guard 대상은 `dashboard.js` 표면이다. 새 파일로 함수를 옮기려면 fixture 합산 방식 또는 dashboard split 대상 확장 방식부터 정해야 한다.

### 권고안

1. 다음 작업은 실제 분할이 아니라 "admin 파일 경계 결정"으로 잡는다. 선택지는 `dashboard-admin.js`를 진짜 admin center 파일로 확장할지, 아니면 현재 보조 기능을 유지하고 `dashboard-admin-center.js`를 별도 생성할지 둘 중 하나다.
2. 먼저 AP/EIE gate 책임을 하나로 정리한다. 현재는 `renderAdminControlCenter()` 내부 HTML과 `dashboard-admin.js`의 삽입 함수가 같은 목적을 가진다.
3. surface guard 계획을 먼저 수정한다. `dashboard.js + dashboard-admin.js + dashboard-teacher.js + dashboard-assistant-memos.js` 합산 surface를 검사할지, split 파일별 fixture를 둘지 결정해야 한다.
4. 실제 이동 후보 1순위는 `openAdminTeacherAccountManage` 계정 CRUD cluster, 학생 학년 모달 cluster, 상담 센터 cluster, 글로벌 검색 cluster처럼 공통 helper 의존이 상대적으로 추적 가능한 묶음이다.
5. `renderDashboardJournalWeekMatrix`, `dashboardFindJournal`, `dashboardIsJournalDone`, `renderTodayJournalCard`, `renderTodoSections`처럼 admin/teacher가 공유하는 일지/카드 helper는 당장 admin 파일로 이동하지 않는다.
6. 신규 파일을 만든다면 load order는 두 가지 중 하나로 결정한다. admin center가 공통 helper를 그대로 의존하면 `dashboard.js` 뒤에 배치해야 하지만, 그러면 `renderDashboard` dispatch 구조도 바뀐다. admin center를 `dashboard.js` 앞에 두려면 공통 helper를 먼저 독립시켜야 한다.

## 7. 검수용 요약

- 수정 파일: `docs/reports/apmath-phase1-dashboard-audit.md`
- 운영 JS 수정 여부: 없음
- `index.html` 수정 여부: 없음
- tests 수정 여부: 없음
- EIE/Worker/archive 수정 여부: 없음
- 브라우저 확인 여부: 미수행 - 문서 감사만 수행
- 테스트 실행 여부: 미수행 - 코드 변경 없는 문서 감사만 수행
- 미확인 항목: 실제 브라우저 admin/teacher smoke, 신규 파일 생성 시 최종 script order, split 후 surface fixture 설계

필수 확인 상태:

| 항목 | 상태 |
|---|---|
| `index.html` script 순서 확인 | 완료 |
| `dashboard-admin.js` 존재 확인 | 완료 |
| `dashboard-teacher.js` 존재 확인 | 완료 |
| `dashboard.js` 잔여 관리자 함수 감사 | 완료 |
| 이번 작업이 분할이 아니라 감사 작업인지 확인 | 완료 |

직접 확인한 파일:

- `apmath/index.html`
- `apmath/js/dashboard.js`
- `apmath/js/dashboard-admin.js`
- `apmath/js/dashboard-teacher.js`
- `tests/apmath-global-surface.test.js`
- `docs/reports/apmath-phase1-function-inventory.md`
- `docs/reports/apmath-phase1-script-order-map.md`
- `docs/reports/apmath-phase1-split-risk-map.md`
- `docs/reports/ap-code-review-improvements-20260612.md`
- `docs/00_READ_ME_FIRST.md`
- `docs/08_DOCUMENT_UPDATE_RULE.md`
- `docs/codex/00_CODEX_READ_ORDER.md`
- `docs/codex/06_CODEX_EXECUTION_RULE.md`
- `docs/codex/CODEX_RESULT_RULE.md`
- `docs/codex/CODEX_DOC_UPDATE_CHECKLIST.md`

3대 기준 문서 업데이트 판정:

| 문서 | 업데이트 여부 | 사유 |
|---|---|---|
| `docs/MASTER_RULEBOOK.md` | 미수정 | 운영 규칙/정책 변경이 아닌 단일 감사 보고서 작성. |
| `docs/MASTER_CURRENT_PROGRESS.md` | 미수정 | 구현 상태 변경 없음. |
| `docs/MASTER_NEXT_WORK.md` | 미수정 | 다음 작업 후보를 본 보고서에만 기록했고 마스터 계획 변경 지시는 없음. |
