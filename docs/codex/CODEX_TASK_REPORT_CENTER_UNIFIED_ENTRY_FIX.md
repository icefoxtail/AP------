# CODEX TASK — 리포트센터 통합 입구 및 학교시험 분석 일괄 리포트

> 작성일: 2026-07-03  
> 대상: AP Math OS `apmath/js/report-center.js`, `apmath/js/student.js`, `apmath/js/ui.js`, 관련 테스트  
> 원칙: 리포트센터를 별도 앱이 아닌 단일 통합 입구로 유지하고, 학교 중간/기말 시험 분석을 리포트센터의 1번 기능으로 둔다.

---

## 0. Current Code Baseline Recheck

2026-07-03 `feat/report-center-redesign` merge 이후 실제 코드 기준:

- `apmath/js/report-center.js`에는 이미 기본 `drilldown` 셸이 있다.
  - `reportCenterAdvancedMode()` 기본값은 false.
  - `openReportCenterModal(studentId, activeTab = 'daily', options = {})`는 고급 보기 off 또는 `forceDrilldown`이면 `reportCenterBuildDrilldownShell(studentId)`를 연다.
  - 고급 보기 on이면 기존 `오늘 리포트 / 평가 리포트 / 상담 리포트` 3탭이 보인다.
- 이미 있는 드릴다운 함수:
  - `reportCenterBuildExamHubList()`
  - `reportCenterRenderExamHubList(studentId)`
  - `reportCenterBuildExamDashboard(studentId, archiveFile)`
  - `reportCenterBuildStudentView(studentId, archiveFile)`
  - `reportCenterOpenStudentDrilldown(studentId, sessionId = '')`
  - `reportCenterNavState()` / `reportCenterNavTo(level, params)`
- 학생상세 `리포트 출력`은 이미 `reportCenterOpenStudentDrilldown(key, sessionId || sessions[0].id || '')`로 들어간다.
- 현재 부족한 것:
  - 사이드바 `리포트 센터` 진입점이 없다.
  - 기본 드릴다운의 상단 제목/설명이 요구 문구와 다르다.
  - 내부 메뉴 `학교시험 분석 / 오늘 리포트 / 평가 리포트 / 상담 리포트` 4개가 한 셸에 함께 보이지 않는다.
  - `reportCenterBuildExamHubList()`가 `archive_file`만으로 묶는다. 같은 시험지를 다른 날짜/반 흐름으로 재사용할 경우 `archive_file + exam_date` 또는 assignment identity 보정이 필요하다.
  - L1 학생 리스트는 반 선택 단계 없이 전체 응시 학생을 바로 보여준다.
  - L2는 단일 학생 리포트/상담 중심이며, 여러 학생 선택 및 일괄 출력이 없다.
  - 기존 `openReportCenterExam()`은 archive-backed 세션과 archive-less 원내평가를 아직 분리하지 않는다.

따라서 이번 작업은 리포트센터 드릴다운을 새로 만드는 작업이 아니라, **이미 들어온 드릴다운을 리포트센터 통합 입구/학교시험 분석/반별 학생 선택/일괄 출력 요구에 맞게 확장하고 정리하는 작업**이다.

---

## 1. Goal

학교 중간/기말 시험지를 아카이브에 입력하고, 학생별 OMR/오답을 입력한 뒤, 선생님이 시험지 단위로 반과 응시 학생을 선택해 문항/오답 데이터를 분석하고 학부모 상담 및 리포트를 작성/출력할 수 있게 한다.

리포트센터 진입 시 기존 `오늘 리포트 / 평가 리포트 / 상담 리포트` 3탭만 보이면 실패다. 첫 진입은 항상 `학교시험 분석`이어야 한다.

---

## 2. Product Decisions

### 2.1 리포트센터 입구

- 사이드바 `평가` 섹션에 `리포트 센터` 메뉴를 추가한다.
- `리포트 센터`는 `openReportCenterModal('', 'schoolExam')` 또는 신규 전역 함수 `openReportCenterHome()`을 통해 열린다.
- 기존 `학교성적`, `원내평가`, `OMR 입력`, `시험지 보관함` 기능은 삭제하지 않는다.
- 학생상세의 `리포트 출력` 버튼은 리포트센터 내부 흐름으로 진입한다.

### 2.2 리포트센터 내부 메뉴

상단 제목과 설명은 고정한다.

- 제목: `리포트 센터`
- 설명: `학교시험 분석, 학생 리포트, 상담/발송 문구를 한 곳에서 관리합니다.`

내부 메뉴는 아래 순서로 유지한다.

1. `학교시험 분석`
2. `오늘 리포트`
3. `평가 리포트`
4. `상담 리포트`

기본 active는 `학교시험 분석`이다. 고급 보기 여부가 기본 active를 바꾸면 실패다.

### 2.3 학교시험 분석 데이터 기준

- `exam_sessions.archive_file`이 있는 기록만 학교시험 분석 대상이다.
- `archive_file`이 없는 일반 원내평가는 기존 `평가 리포트` 대상이다.
- 학교시험 분석 학생 목록은 선택 시험지에 실제 matching `exam_sessions`가 있는 응시 학생만 표시한다.
- “출력 불가 학생”을 기본 UI에 노출하지 않는다. 응시자가 없는 반/시험지에만 빈 상태 안내를 표시한다.

### 2.4 학교시험 분석 UX

아카이브 출제 UX의 `시험지 선택 -> 반 선택 -> 학생 선택 -> 최종 확인` 구조를 리포트센터에 맞게 변형한다.

출제 UX와 다른 점:

- 출제 UX는 전체 재원생에서 제외하는 구조다.
- 리포트센터는 이미 응시한 학생 중 출력할 학생을 선택하는 구조다.
- 반별 학생 목록은 `class_exam_assignments` roster가 아니라 `exam_sessions + class_students + students`에서 구성한다.

필수 흐름:

1. L0 시험지 목록
   - `archive_file` 기준으로 학교시험 기록 묶음 표시
   - 시험명, 시험일, 응시 반 수, 응시 학생 수, 오답 입력 현황, 문항 분석 상태 표시
2. L1 시험 대시보드
   - 선택 시험지의 반별 응시 현황
   - 문항 분석 상태
   - 응시/오답 입력 현황
   - `반 선택`으로 L2 이동
3. L2 학생 선택/리포트
   - 선택 시험지 + 선택 반의 응시 학생만 표시
   - 학생별 점수, 오답 개수, 오답 없음 여부 표시
   - 1명 선택 시 단일 리포트 미리보기/출력 가능
   - 여러 명 선택 시 학생별 리포트를 한 인쇄 문서에 이어붙여 출력

### 2.5 일괄 출력

여러 명 선택 시 한 인쇄 창에서 학생별 리포트를 이어붙인다.

- 학생 A 리포트
- page break
- 학생 B 리포트
- page break
- 학생 C 리포트

CSS 기준:

```css
.report-center-batch-page {
  break-after: page;
  page-break-after: always;
}

.report-center-batch-page:last-child {
  break-after: auto;
  page-break-after: auto;
}
```

기존 단일 리포트 생성 로직은 재사용하되, 전체 HTML shell은 한 번만 만들고 학생별 본문을 반복한다. 고유 `id` 중복으로 편집/미리보기 UI가 깨지지 않게 일괄 출력용은 읽기 전용 출력 문서로 만든다.

---

## 3. Files To Inspect First

- `apmath/js/report-center.js`
  - 현재 3탭 셸: `reportCenterBaseShell(studentId, activeTab, bodyHtml)`
  - 기존 진입: `openReportCenterModal(studentId, activeTab = 'daily')`
  - 기존 평가 리포트: `openReportCenterExam(studentId, selectedSessionId = '')`
  - 기존 PDF 생성: `reportCenterBuildCleanPdfDocument`, `reportCenterBuildCleanPdfShell`, `reportCenterOpenPrintView`
- `apmath/js/student.js`
  - 학생상세 진입: `openStudentReportOutputFromDetail(sid, sessionId = '')`
  - 원내평가 목록: `getStudentAcademyExamSessionsForDetail`
- `apmath/js/ui.js`
  - 사이드바: `buildDrawerMenu(roleKey)`
  - 평가 섹션: `학교성적`, `원내평가`, `OMR 입력`
- `archive/index.html`
  - 참고 UX: `openAssignTargetPanel`, `renderAssignTargetSelectView`, `renderAssignTargetReviewView`
- `tests/apmath-student-grade-report-entry.test.js`
  - 학생상세 리포트 출력 계약 갱신 필요
- `tests/apmath-global-surface.test.js`
  - 신규 전역 함수 추가 시 fixture 갱신 필요

---

## 4. Required Implementation Tasks

### Task 1 — 회귀 테스트 먼저 추가

새 테스트 파일을 만든다.

- Create: `tests/apmath-report-center-unified-entry.test.js`

테스트는 정적 문자열/함수 계약으로 아래를 확인한다.

- 리포트센터 셸에 `학교시험 분석`, `오늘 리포트`, `평가 리포트`, `상담 리포트`가 모두 있다.
- `openReportCenterModal` 기본값 또는 신규 홈 진입이 `schoolExam`이다.
- 기존 3탭만 존재하는 구조가 아니다.
- `archive_file` 있는 세션만 학교시험 분석 대상으로 분리하는 helper가 있다.
- `archive_file` 없는 세션은 평가 리포트 대상으로 남는다.
- 일괄 출력 page break class가 존재한다.

권장 테스트 스케치:

```js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const report = fs.readFileSync(path.join(root, 'apmath/js/report-center.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const student = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');

assert(report.includes('학교시험 분석'), 'report center must expose school exam analysis as first internal menu');
assert(report.includes('오늘 리포트') && report.includes('평가 리포트') && report.includes('상담 리포트'), 'legacy report menus must remain');
assert(report.includes('reportCenterGetSchoolExamGroups'), 'school exam grouping helper must exist');
assert(report.includes('reportCenterGetLegacyExamReportSessions'), 'archive-less academy exams must remain in evaluation reports');
assert(report.includes('reportCenterOpenBatchPrintView'), 'batch report print entry must exist');
assert(report.includes('report-center-batch-page'), 'batch print must force page breaks between students');
assert(ui.includes('리포트 센터'), 'sidebar must include report center entry');
assert(student.includes('openReportCenterStudentReport'), 'student detail report output must enter report center student report flow');

console.log('apmath report center unified entry test passed');
```

Run:

```bash
node tests/apmath-report-center-unified-entry.test.js
```

Expected before implementation: FAIL.

### Task 2 — 리포트센터 셸을 4메뉴 통합 구조로 변경

Modify: `apmath/js/report-center.js`

신규/수정 함수:

- `reportCenterGetMenuItems()`
- `reportCenterBaseShell(studentId, activeMenu, bodyHtml, options = {})`
- `openReportCenterHome(options = {})`
- `openReportCenterModal(studentId = '', activeMenu = 'schoolExam', options = {})`

요구:

- `reportCenterBaseShell` 상단 제목은 항상 `리포트 센터`.
- 설명은 요구 문구 그대로 사용.
- 메뉴 순서는 `학교시험 분석`이 첫 번째.
- 학생 컨텍스트가 있을 때만 학생 이름을 보조 메타로 표시한다.
- `openReportCenterModal('', 'schoolExam')`은 학생 없이도 L0 시험지 목록을 보여야 한다.
- 기존 `daily`, `exam`, `counsel` 진입은 유지하되 내부 메뉴의 보조 기능으로만 동작한다.

### Task 3 — 학교시험 분석 데이터 helper 추가

Modify: `apmath/js/report-center.js`

추가할 helper:

- `reportCenterHasArchiveFile(session)`
- `reportCenterGetSchoolExamSessions()`
- `reportCenterGetLegacyExamReportSessions(studentId = '')`
- `reportCenterMakeSchoolExamKey(session)`
- `reportCenterGetSchoolExamGroups()`
- `reportCenterGetSchoolExamGroupByKey(groupKey)`
- `reportCenterGetGroupClasses(group)`
- `reportCenterGetGroupClassStudents(group, classId)`
- `reportCenterGetSessionWrongCount(sessionId)`
- `reportCenterGetExamAnalysisStatus(archiveFile)`

그룹 기준:

```text
archive_file + exam_date
```

동일 시험지가 여러 날짜에 사용될 수 있으므로 `archive_file`만으로 묶지 않는다.

그룹 필드 예시:

```js
{
  key,
  archiveFile,
  title,
  examDate,
  sessions,
  takerCount,
  classIds,
  wrongInputCount,
  questionCount,
  analysisStatus
}
```

### Task 4 — L0 시험지 목록 구현

Modify: `apmath/js/report-center.js`

추가 함수:

- `openReportCenterSchoolExam(groupKey = '', options = {})`
- `reportCenterRenderSchoolExamList(groups)`
- `reportCenterRenderSchoolExamEmpty()`

빈 상태 문구:

```text
아카이브 시험지와 연결된 학교시험 기록이 없습니다.
QR/오답 입력 또는 시험지 연결 후 학교시험 분석을 사용할 수 있습니다.
```

카드에 표시할 정보:

- 시험명
- 시험일
- 응시 학생 수
- 응시 반 수
- 오답 입력 현황
- 문항 분석 상태

카드 CTA:

- `분석 열기`

### Task 5 — L1 시험 대시보드 구현

Modify: `apmath/js/report-center.js`

추가 함수:

- `openReportCenterSchoolExamDashboard(groupKey)`
- `reportCenterRenderSchoolExamDashboard(group)`
- `reportCenterRenderSchoolExamClassRows(group)`

화면 구성:

- 브레드크럼: `리포트 센터 > 학교시험 분석 > 시험 대시보드`
- 요약 카드: 응시 학생, 응시 반, 평균, 오답 입력 수
- 문항 분석 상태: `exam_question_reviews`, `exam_analysis_meta`, `exam_blueprints` 기반
- 반별 row:
  - 반명
  - 응시 학생 수
  - 평균 점수
  - 오답 입력 수
  - CTA `학생 리포트`

### Task 6 — L2 학생 선택/리포트 구현

Modify: `apmath/js/report-center.js`

추가 함수:

- `openReportCenterStudentReport(groupKey, classId = '', selectedStudentId = '')`
- `reportCenterRenderStudentReportPicker(group, classId, selectedStudentIds = [])`
- `reportCenterToggleReportStudent(groupKey, classId, studentId, checked)`
- `reportCenterSelectAllReportStudents(groupKey, classId)`
- `reportCenterClearReportStudents(groupKey, classId)`

요구:

- 브레드크럼: `리포트 센터 > 학교시험 분석 > 학생 리포트`
- 학생 목록은 해당 시험지/날짜/반에 matching `exam_sessions`가 있는 학생만 표시한다.
- 학생 카드에는 이름, 점수, 오답 개수, 오답 없음 표시.
- 반에 응시자가 없으면 `이 반에는 아직 해당 시험 응시 기록이 없습니다.` 표시.
- 하단 액션:
  - `선택 학생 리포트 출력`
  - `선택 학생 카톡 문구 복사`는 이번 루프에서 선택 사항이다. 구현하지 않으면 버튼을 만들지 않는다.

### Task 7 — 일괄 출력 구현

Modify: `apmath/js/report-center.js`

추가 함수:

- `reportCenterOpenBatchPrintView(groupKey, classId, studentIds = [])`
- `reportCenterBuildBatchPrintDocument(items, options = {})`
- `reportCenterBuildBatchPrintShell(bodyHtml)`

구현 기준:

- `items`는 `{ studentId, sessionId }` 배열.
- 각 학생별로 기존 리포트 본문을 생성한다.
- 학생별 wrapper에 `report-center-batch-page` class를 붙인다.
- 마지막 학생 뒤에는 page break를 제거한다.
- 편집 스튜디오/AI 요청 버튼은 일괄 출력 문서에 노출하지 않는다.
- 출력 문서 타이틀은 `학교시험 학생별 리포트`로 한다.

검증:

- 1명 선택 시 1페이지만 출력.
- 2명 이상 선택 시 학생이 바뀔 때 새 페이지 시작.
- 기존 단일 `reportCenterOpenPrintView`는 유지.

### Task 8 — 기존 평가 리포트는 archive-less 전용으로 정리

Modify: `apmath/js/report-center.js`

`openReportCenterExam(studentId, selectedSessionId = '')`는 기존 기능을 유지하되, 기본 목록은 `archive_file` 없는 일반 원내평가만 보여준다.

단, 학생상세에서 archive-backed session을 직접 열 때 기존 함수가 아니라 `openReportCenterStudentReport`로 보내야 한다.

빈 상태 문구:

```text
일반 원내평가 기록이 없습니다.
학교시험지는 학교시험 분석 메뉴에서 확인하세요.
```

### Task 9 — 학생상세 리포트 출력 경로 변경

Modify: `apmath/js/student.js`

`openStudentReportOutputFromDetail(sid, sessionId = '')` 변경:

- 선택 session이 있고 `archive_file`이 있으면 `openReportCenterStudentReport(groupKey, classId, sid)` 또는 wrapper `openReportCenterStudentReportBySession(sid, sessionId)` 호출.
- 선택 session이 `archive_file` 없으면 기존 평가 리포트 호출.
- 세션이 없으면 기존 toast 유지하되 문구는 `출력할 평가 기록이 없습니다.`로 일반화.

추가 wrapper 권장:

- `openReportCenterStudentReportBySession(studentId, sessionId)`

이 wrapper는 `report-center.js`에 두고 groupKey/classId를 찾아 L2로 이동한다.

### Task 10 — 사이드바 진입점 추가

Modify: `apmath/js/ui.js`

평가 섹션에 추가:

```js
${drawerItem('report', '리포트 센터', "closeAppDrawer(); if(typeof openReportCenterHome==='function') openReportCenterHome(); else toast('리포트 센터를 불러오지 못했습니다.', 'warn');")}
```

위치는 `학교성적`과 `원내평가` 사이 또는 `평가` 섹션 첫 번째를 권장한다. 최종 권장 위치는 `평가` 섹션 첫 번째다.

관리자/선생님 사이드바 모두 동일하게 노출할지 확인한다. 현재 admin drawer에는 평가 섹션이 없으므로, 이번 루프에서는 teacher drawer에 먼저 추가하고 admin dashboard shortcut은 별도 작업으로 남겨도 된다.

### Task 11 — 표면/onclick 회귀 보정

Modify if needed:

- `tests/apmath-global-surface.test.js`
- `tests/fixtures/apmath-surface-report.json`
- `tests/apmath-onclick-defined.test.js`
- `tests/apmath-student-grade-report-entry.test.js`

요구:

- 신규 전역 함수가 surface guard에 반영되어야 한다.
- onclick에서 참조하는 신규 함수가 정의되어야 한다.
- 기존 `openReportCenterExam` printable flow 테스트는 유지하되, 학생상세 archive-backed session은 신규 L2 경로를 기대하도록 갱신한다.

### Task 12 — 브라우저 검수

가능하면 로컬 서버로 실제 화면을 확인한다.

검수 흐름:

1. Teacher sidebar -> `리포트 센터`
2. 첫 화면이 `학교시험 분석`
3. `오늘 리포트`, `평가 리포트`, `상담 리포트`로 이동 가능
4. 학교시험 분석에서 시험지 목록 표시
5. 시험지 선택 -> 시험 대시보드
6. 반 선택 -> 응시 학생만 표시
7. 학생 1명 선택 -> 출력
8. 학생 2명 이상 선택 -> 한 인쇄 문서에서 학생별 page break
9. 학생상세 -> 원내평가 -> `리포트 출력`
10. archive-backed session은 `리포트 센터 > 학교시험 분석 > 학생 리포트`
11. archive-less session은 기존 `평가 리포트`

브라우저 검수가 불가능하면 결과 문서에 명확히 쓴다.

```text
REAL BROWSER E2E: NOT VERIFIED
Reason:
```

---

## 5. Required Verification Commands

최소:

```bash
node tests/apmath-report-center-unified-entry.test.js
node tests/apmath-student-grade-report-entry.test.js
node tests/report-exam-trend.test.mjs
node tests/apmath-report-easy-language.test.js
node tests/apmath-global-surface.test.js
node tests/apmath-onclick-defined.test.js
node tools/run-tests.js
```

정적 문법:

```bash
node --check apmath/js/report-center.js
node --check apmath/js/student.js
node --check apmath/js/ui.js
```

---

## 6. PASS / FAIL Criteria

PASS 조건:

- 리포트센터 첫 진입이 `학교시험 분석`이다.
- 리포트센터 상단에 4개 메뉴가 모두 있다.
- 기존 오늘/평가/상담 리포트가 삭제되지 않았다.
- `archive_file` 있는 시험은 학교시험 분석에 표시된다.
- `archive_file` 없는 원내평가는 기존 평가 리포트에서 접근 가능하다.
- 학교시험 분석에서 시험지 선택 -> 반 선택 -> 학생 선택 흐름이 작동한다.
- 학생 목록에는 선택 시험지에 응시한 학생만 표시된다.
- 여러 학생 선택 시 한 인쇄 문서에 학생별 다음 페이지로 이어붙여 출력된다.
- 학생상세 `리포트 출력`은 archive-backed session에서 L2 학생 리포트로 이동한다.
- 빈 상태 문구가 지정 문구와 일치한다.

FAIL 조건:

- 리포트센터 첫 화면이 `오늘/평가/상담` 3탭만 보인다.
- 고급 보기 또는 기존 진입점 때문에 첫 진입이 레거시 탭으로 바뀐다.
- 학교시험 분석이 별도 앱/별도 사이드바 앱처럼 분리된다.
- archive-backed 학교시험이 평가 리포트에만 숨어 있다.
- archive-less 원내평가 기능이 사라진다.
- 일괄 출력에서 학생별 page break가 없다.
- 학생상세 `리포트 출력`이 학교시험인데 기존 평가 리포트 화면으로 떨어진다.

---

## 7. Out Of Scope

- DB schema 변경
- 신규 API 추가
- 아카이브 출제 UX 자체 변경
- 학생 포털 OMR 입력 흐름 변경
- 리포트 AI 문장 품질 개선
- 카톡 일괄 발송 실제 전송 기능
- 배포

---

## 8. Notes For Workers

- `archive/index.html`의 `AssignTarget` UX는 참고만 한다. 그대로 복사하지 말고 리포트센터 데이터 모델에 맞게 축소 구현한다.
- 리포트센터는 AP Math 앱 내부 모달/오버레이다. 별도 HTML 앱을 만들지 않는다.
- 기존 `reportCenterBuildCleanPdfDocument` 계열을 최대한 재사용한다.
- `report-center.js`가 큰 파일이므로, 이번 루프에서는 파일 분할보다 안정적인 helper 추가와 테스트를 우선한다.
- inline style이 많은 기존 패턴을 당장 모두 정리하지 않는다. 새 UI는 과도한 중첩 카드와 한 학생/한 시험에만 맞춘 문구를 피한다.
