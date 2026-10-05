# CODEX_RESULT — Phase 1c classroom.js 순수 분할

## 0. 문서 정독 확인
- 읽은 문서:
  - `docs/reports/apmath-phase1-guard-result.md`
  - `docs/reports/apmath-phase1-function-inventory.md`
  - `docs/reports/apmath-phase1-script-order-map.md`
  - `docs/reports/apmath-phase1-split-risk-map.md`
  - `docs/reports/apmath-smoke-test-guide.md`
  - `docs/reports/apmath-smoke-test-result.md`
  - `docs/reports/apmath-phase1-student-split-result.md`
  - `docs/reports/ap-code-review-improvements-20260612.md`
- Phase 1-0 보호망 문서 정독 여부: 완료
- Phase 0.5 smoke 문서 정독 여부: 완료
- Phase 1b student split 결과 정독 여부: 완료
- 이번 작업이 classroom.js 순수 분할인지 확인: 완료
- 함수 본문 수정 금지 확인: 완료
- 운영 데이터 write 금지 확인: 완료

## 1. A 구현 결과
- 생성 파일:
  - `apmath/js/classroom-planner.js`
  - `docs/reports/apmath-phase1-classroom-split-result.md`
- 수정 파일:
  - `apmath/js/classroom.js`
  - `apmath/index.html`
  - `tests/apmath-global-surface.test.js`
  - `tests/class-planner-modal-width.test.js`
  - `tests/class-planner-week-month-start.test.js`
- 이동한 함수 목록:
  - `loadLedger`, `renderAttendanceLedger`, `renderLedgerTable`, `toggleAtt`, `toggleHw`
  - `normalizeClassroomArchiveFile`, `makeExamListKey`, `makeExamDetailKey`
  - `openExamGradeView`, `openExamDetail`, `deleteExamSession`, `deleteExamByClass`
  - `isPlannerTargetClass`, `getPlannerBaseUrl`, `copyPlannerStudentLink`, `loadPlannerOverview`
  - `getClassPlannerToday`, `parseClassPlannerDate`, `addClassPlannerDays`, `getClassPlannerWeekStart`, `getClassPlannerWeekDates`
  - `getClassPlannerDayName`, `formatClassPlannerDayLabel`, `renderClassPlannerDayTabLabel`, `injectClassPlannerReviewStyles`
  - `getClassPlannerPlanDate`, `getClassPlannerPlanTitle`, `getClassPlannerPlanSubject`, `isClassPlannerDone`
  - `ensureClassPlannerState`, `buildClassPlannerWeekCacheKey`, `loadClassPlannerStudentRange`, `loadClassPlannerWeek`
  - `getClassPlannerMonthStart`, `getClassPlannerMonthDates`, `buildClassPlannerMonthCacheKey`, `loadClassPlannerMonth`
  - `renderClassPlannerMonthTable`, `renderClassPlannerStudentPlanList`, `renderClassPlannerDayList`, `renderClassPlannerWeekCell`, `renderClassPlannerWeekTable`
  - `renderClassPlannerModeTabs`, `renderClassPlannerDayTabs`, `renderClassPlannerContent`, `renderClassPlannerPeriodNav`
  - `expandClassPlannerModalForPc`, `renderPlannerRateBar`, `getPlannerMonthBounds`, `renderPlannerPlanList`
  - `openPlannerStudentPlans`, `renderPlannerOverviewTable`, `renderPlannerControl`, `refreshPlannerControl`
  - `openPlannerFeedbackModal`, `savePlannerFeedback`
- classroom.js에 남긴 함수군:
  - classroom 스타일 주입, 상태 라벨/스타일, 출결 메타, 보강 태그/칩, 상담 버튼
  - 클래스 운영일/오늘 데이터 로드, 클래스 상세 V4 렌더링, 학생 행/요약 DOM 업데이트
  - 숙제사진 배정/링크/제출 현황, 수업기록, `MAKEUP_TAG_DEFS`, `MATH_CURRICULUM_UNITS`
  - `openClassAttendance`, `openClassHomework` 진입점
- classroom-planner.js로 이동한 공유 상태 목록:
  - `ledgerState`
  - `state.ui.classPlannerMode`
  - `state.ui.classPlannerSelectedDate`
  - `state.ui.classPlannerWeekStart`
  - `state.ui.classPlannerWeekCache`
  - `state.ui.classPlannerMonthCache`
  - `state.ui.plannerControlClassId`
- script 순서 변경표:
  - 변경 전: `student-edit.js -> classroom.js -> ... -> timetable.js -> dashboard-admin.js`
  - 변경 후: `student-edit.js -> ... -> timetable.js -> classroom.js -> classroom-planner.js -> dashboard-admin.js`
  - 요구 순서 확인: `timetable.js -> classroom.js -> classroom-planner.js`
- 함수 본문 수정 여부:
  - 없음. `HEAD:apmath/js/classroom.js`의 `let ledgerState` 이후 블록과 `classroom-planner.js` 본문은 CRLF/LF 정규화 후 일치한다.

## 2. B 순수 이동 검수
- Codex B verdict: PASS
- 함수 본문 변경 여부: 없음
- 함수명/매개변수 변경 여부: 없음
- API 호출 변경 여부: 없음
- 문구/CSS 변경 여부: 없음
- fixture 변경 여부: 없음
- 범위 밖 파일 변경 여부:
  - Phase 1c 직접 변경은 AP Math classroom 분할 파일 중심이다.
  - `tests/class-planner-modal-width.test.js`, `tests/class-planner-week-month-start.test.js`는 기존 guard가 단일 `classroom.js`만 읽어 분할 후 오탐 실패했기 때문에 `classroom.js + classroom-planner.js` 합산 소스를 읽도록 보정했다.
  - 이 보정은 검사 조건 완화가 아니라 분할 구조 반영이다.
  - 병행 작업 dirty 파일은 수정하거나 stage하지 않았다.

## 3. C 로드 순서·전역 표면 검수
- Codex C verdict: PASS, Node 실행은 봇 PATH 문제로 UNVERIFIED
  - 메인 검증에서 번들 Node로 global surface/onclick 테스트 PASS 확인.
- script 순서:
  - `js/timetable.js`
  - `js/classroom.js`
  - `js/classroom-planner.js`
- surface guard 보정 방식:
  - `student = student.js + student-edit.js`
  - `classroom = classroom.js + classroom-planner.js`
  - `dashboard = dashboard.js`
  - `report = report.js`
- fixture 유지 여부: `tests/fixtures/apmath-surface-classroom.json` 수정 없음
- onclick guard: PASS
- top-level 즉시 참조 위험:
  - `classroom.js`는 `renderClass`, `updateStudentRowDOM`, `openStudentActionSheetV4` 런타임 경로에서 `classroom-planner.js` 함수를 참조한다.
  - `classroom-planner.js`가 `classroom.js` 뒤에 로드되므로 사용자 호출 시점에는 함수들이 정의된다.
- window 노출 유지 여부:
  - `setClassPlannerMode`, `setClassPlannerSelectedDate`, `moveClassPlannerWeek`, `resetClassPlannerWeek`, `moveClassPlannerMonth`, `resetClassPlannerMonth` 유지.

## 4. D 테스트·smoke 검수
- Codex D verdict: PASS with one UNVERIFIED item
- `node --check apmath/js/classroom.js`: PASS
- `node --check apmath/js/classroom-planner.js`: PASS
- `node --check tests/apmath-global-surface.test.js`: PASS
- `node tests/apmath-global-surface.test.js`: PASS
- `node tests/apmath-onclick-defined.test.js`: PASS
- `node tools/run-tests.js`: PASS
- `node tools/smoke-api.mjs`:
  - sandbox 기본 실행: fetch failed
  - 승인된 네트워크 실행: PASS
- `node tools/smoke-browser.mjs`:
  - Browser smoke 실행: 미수행
  - 사유: Playwright 미설치
- 브라우저 실화면 확인: 미수행
- 병행 작업 파일 stage 제외 여부: staged 파일 없음

## 5. 변경 파일 목록
- git diff --name-only:
  - `apmath/index.html`
  - `apmath/js/classroom.js`
  - `tests/apmath-global-surface.test.js`
  - `tests/class-planner-modal-width.test.js`
  - `tests/class-planner-week-month-start.test.js`
  - `apmath/js/classroom-planner.js` (untracked)
  - `docs/reports/apmath-phase1-classroom-split-result.md` (untracked)
- git diff --cached --name-only:
  - 없음

## 6. 미확인/보류 항목
- Playwright 설치 여부: 미설치
- 로그인 smoke 미수행 여부: 미수행
- 브라우저 실화면 미수행 여부: 미수행
- 병행 작업 dirty 파일:
  - EIE/Worker/archive 관련 기존 dirty/untracked 파일은 이번 작업 대상이 아니며 stage하지 않았다.

## 7. 다음 단계 권고
- classroom.js 분할 후 2~3일 실사용 필요 여부: 필요
- dashboard.js 착수 가능 여부: 가능하나 classroom 분할 실사용 확인 후 권장
- 추가 보완 필요 여부:
  - 브라우저 smoke는 Playwright 준비 후 별도 확인 권장
