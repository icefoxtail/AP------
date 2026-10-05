# AP Math Phase 1d-BULK Dashboard Admin Bulk Move Result

## 1. 작업 목적
- `apmath/js/dashboard.js`에 남아 있던 admin-only 함수군을 `apmath/js/dashboard-admin.js`로 순수 이동했다.
- 함수명, 매개변수, 본문, API endpoint, toast/confirm/html/style 문자열은 변경하지 않았다.
- `index.html`, tests/fixtures, EIE, Worker, archive, migrations는 수정하지 않았다.

## 2. 이동한 함수 목록
- `openDischargedStudents`
- `restoreDischargedStudent`
- `hideDischargedStudent`
- `purgeHiddenStudent`
- `openAdminStudentList`
- `openAdminOperationMenu`
- `openAdminPinBatchModal`
- `handleAdminBatchGeneratePins`
- `getAdminClassGradeRank`
- `adminNormalizeStatus`
- `adminGetStudentClassMap`
- `adminGetClassById`
- `adminGetStudentClass`
- `adminGetClassStudentIds`
- `adminGetCreatedDateText`
- `adminGetDaysSince`
- `adminIsRecentStudent`
- `adminBuildOverviewData`
- `adminOpenStudentEditOrDetail`
- `adminOpenDashboardStudentDetail`
- `adminOpenDashboardStudentEdit`
- `adminBuildGradeHoverRows`
- `renderAdminMiniMetric`
- `renderAdminAssessmentArchiveMetric`
- `renderAdminStudentOverviewPanel`
- `renderAdminNeedCheckPanel`
- `renderAdminNewStudentPanel`
- `adminGetGradeLabel`
- `adminGetGradeOrder`
- `adminGetStudentListByType`
- `adminRenderStudentGradeSummary`
- `adminEnsureStudentGradeModalState`
- `openAdminStudentGradeModal`
- `adminSetStudentGradeModalGrade`
- `adminHandleStudentGradeModalSearch`
- `renderAdminStudentGradeModalBody`
- `renderAdminStudentGradeModal`
- `adminGetConsultationDate`
- `adminConsultationSortValue`
- `adminGetStudentById`
- `adminGetConsultationRows`
- `adminGetRecentConsultationRows`
- `adminConsultationRowStudentName`
- `adminRecentConsultationPreviewText`
- `adminRenderConsultationHistoryRows`
- `openAdminStudentConsultationHistory`
- `renderAdminRecentConsultationPanel`
- `openAdminConsultationCenter`
- `handleAdminConsultationSearchInput`
- `renderAdminConsultationCenterBody`
- `openAdminLeaveStudentList`
- `openAdminUnassignedStudentList`
- `openAdminClassCleanupList`
- `openAdminTeacherlessClassList`
- `renderAdminSimpleStudentList`
- `adminNormalizeSearchValue`
- `adminSearchIncludes`
- `adminGetSearchClassNameByStudentId`
- `adminGetSearchClassNameByClassId`
- `adminGetAssignmentTypeLabel`
- `adminBuildGlobalSearchResults`
- `adminSearchTypeLabel`
- `renderAdminGlobalSearchResults`
- `handleAdminGlobalSearchInput`
- `openAdminGlobalSearchResult`
- `renderAdminGlobalSearchPanel`
- `renderAdminControlCenter`
- `renderAdminJournalList`
- `openAdminJournalFeedback`
- `approveJournal`
- `formatAdminRecentJournalDate`
- `getAdminRecentTeacherJournals`
- `openAdminRecentTeacherJournals`
- `renderAdminTeacherCards`
- `openAdminTeacherPanel`
- `renderAdminTeacherAllStudents`
- `renderAdminTeacherStudents`

이전 Phase 1d-3에서 이미 이동된 teacher account 함수 10개는 중복 생성하지 않고 기존 `dashboard-admin.js` 정의를 유지했다.

## 3. 이동 제외 함수
- `computeDashboardData`
- `renderTodayJournalCard`
- `renderTodoSections`
- `renderDashboardJournalWeekMatrix`
- `dashboardFindJournal`
- `dashboardIsJournalDone`
- `sortClassesForDashboard`
- `renderClassSummaryCard`
- `isClassVisibleForCurrentTeacher`
- onboarding 관련 함수군
- teacher dashboard helper
- report/student/classroom helper

위 함수들은 teacher dashboard 또는 다른 화면과 공유되는 helper라서 이동하지 않았다.

## 4. 수정 파일
- `apmath/js/dashboard.js`
- `apmath/js/dashboard-admin.js`
- `docs/reports/apmath-phase1-dashboard-admin-bulk-move-result.md`
- `CODEX_RESULT1.md`

## 5. 순수 이동 확인
- 대상 함수 배치: PASS
- `dashboard.js` 대상 함수 잔존: 0개
- `dashboard-admin.js` 대상 함수 정의: 각 1개
- 함수명/매개변수 변경: 없음
- API endpoint 변경: 없음
- HTML/style/toast/confirm 문자열 변경: 없음
- 중복 정의: 없음

## 6. Surface Guard
- dashboard 합산 대상: `dashboard-admin.js + dashboard-teacher.js + dashboard.js`
- dashboard fixture 변경: 없음
- duplicateDefinitions: 없음
- dashboard-only 비교: PASS
- dashboard counts: `functionDeclarations=187`, `asyncFunctionDeclarations=18`, `windowAssignments=3`, `functionExpressions=11`, `allDefinitions=218`

## 7. 테스트 결과
- `node --check apmath/js/dashboard.js`: PASS
- `node --check apmath/js/dashboard-admin.js`: PASS
- `node --check tests/apmath-global-surface.test.js`: PASS
- `node tests/apmath-onclick-defined.test.js`: PASS
- `node tests/apmath-global-surface.test.js`: FAIL
  - 원인: 기존 `student.js + student-edit.js` surface mismatch
  - 추가 함수: `renderStudentDetailTabInPlace`
- dashboard combined surface: PASS
- `node tools/smoke-api.mjs`: PASS
- `node tools/run-tests.js`: FAIL
  - `admin-assessment-archive-card.test.js`: `renderAdminStudentOverviewPanel`을 `dashboard.js` 단독에서 찾는 기존 테스트 구조와 이번 순수 이동 범위가 충돌
  - `apmath-global-surface.test.js`: 기존 student surface mismatch
  - `eie-exam-records-mvp.test.js`: 기존 student detail assertion failure
  - `student-portal-omr-review-ui.test.js`: 기존 neutral charcoal assertion failure

## 8. 미확인/보류
- AP/EIE gate 중복 정리는 이번 작업 범위가 아니므로 보류했다.
- browser smoke는 실행하지 않았다.
- admin 실화면 확인은 실행하지 않았다.
- 기존 dirty 파일들은 되돌리거나 정리하지 않았다.

## 9. 다음 작업 권고
- `admin-assessment-archive-card.test.js`가 dashboard 합산 surface 또는 `dashboard-admin.js`를 기준으로 읽도록 별도 테스트 정비가 필요하다.
- 기존 student surface mismatch를 별도 작업에서 정리한다.
- AP/EIE gate 책임 단일화는 별도 Phase로 처리한다.
