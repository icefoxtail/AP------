# EIE Grade Ledger AP MATH UI Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the EIE teacher dashboard so it shows only one `성적표` quick card, then open a standalone grade ledger where `학교성적` and `원내평가` share the AP MATH grade table UI/UX and support input, edit, save, and reload.

**Architecture:** Port the AP MATH school exam ledger from `apmath/js/cumulative.js` into `eie/js/views/eie-grade-ledger.js` as the visual and interaction baseline. Keep EIE data/API boundaries in `EieApi` and the worker routes, and make `원내평가` use the same table/filter/save UI while changing only the column source from semesters to teacher-defined tests. The dashboard remains a navigation hub and must not render grade inputs.

**Tech Stack:** Browser global JS views, `EieRouter`, `EieApi`, Cloudflare Worker route JS, CSS in `eie/css/eie.css`, Node contract tests.

---

## File Structure

- Modify: `tests/eie-grade-ledger-port.test.js`
  - Tighten contract tests around dashboard card-only behavior, AP MATH UI markers, shared school/academy table UI, allowed input types, save payload shape, and reload restoration.
- Modify: `eie/js/views/eie-teacher.js`
  - Remove the expanded dashboard grade card from render output.
  - Add a single `성적표` quick card next to `출석부`.
  - Route clicks into the standalone grade ledger.
- Modify: `eie/js/views/eie-grade-ledger.js`
  - Port the AP MATH `seb-*` screen structure and table behavior into EIE.
  - Keep `학교성적` and `원내평가` as top-level tabs.
  - Render `학교성적` with AP MATH semester/exam columns.
  - Render `원내평가` with the same table UI but teacher-defined test columns.
  - Keep only `score`, `fraction`, and `memo` input types.
- Modify: `eie/css/eie.css`
  - Align grade ledger CSS to AP MATH `seb-*` UI: shell, tabs, controls, sticky table, inputs, average rows, savebar.
  - Avoid separate academy-only card styling.
- Modify: `CODEX_RESULT2.md`
  - Append actual implementation result, verification commands, and unchecked items.

No commit or push in this implementation unless the user explicitly asks.

---

### Task 1: Strengthen Contract Tests Before UI Changes

**Files:**
- Modify: `tests/eie-grade-ledger-port.test.js`

- [ ] **Step 1: Add dashboard card-only assertions**

Add or keep these assertions near the teacher dashboard contract checks:

```js
assert(teacher.includes('openGradeLedger'), 'teacher dashboard should expose grade ledger card action');
assert(teacher.includes('성적표'), 'teacher dashboard should label the quick card 성적표');
assert(!teacher.includes('renderGradeInputCard()'), 'teacher dashboard should not render expanded grade input card');
assert(!teacher.includes('이번 달 원내평가'), 'teacher dashboard should not show academy grade status list');
assert(!teacher.includes('<strong>학교성적</strong>'), 'teacher dashboard should not show school grade status list');
assert(!teacher.includes('eie-teacher-grade-row'), 'teacher dashboard should not render per-class grade rows');
assert(!teacher.includes('eie-grade-inp'), 'teacher dashboard should not contain grade inputs');
```

- [ ] **Step 2: Add AP MATH UI port assertions**

Add these assertions against `eie/js/views/eie-grade-ledger.js` source:

```js
assert(ledger.includes('학교성적') && ledger.includes('원내평가'), 'ledger should render school and academy tabs');
assert(ledger.includes('1학기') && ledger.includes('2학기'), 'school tab should keep semester groups');
assert(ledger.includes('중간') && ledger.includes('기말'), 'school tab should keep midterm/final columns');
assert(ledger.includes('전체 저장'), 'ledger should keep AP MATH-style save button text');
assert(ledger.includes('setSchoolSection') && ledger.includes('중등') && ledger.includes('고등'), 'ledger should keep middle/high segmented tabs');
assert(ledger.includes('eie-grade-table') && ledger.includes('eie-grade-inp'), 'school and academy should share grade table/input classes');
```

- [ ] **Step 3: Add academy same-design assertions**

Add these assertions:

```js
assert(ledger.includes('renderAcademyTable'), 'academy tab should render through a table renderer');
assert(!ledger.includes('eie-academy-card'), 'academy tab should not introduce a separate card-style visual system');
assert(!ledger.includes('type="checkbox"') || ledger.includes('eie-grade-controls'), 'academy test visibility controls should stay in the grade control area');
assert(ledger.includes('점수') && ledger.includes('점수/만점') && ledger.includes('메모'), 'academy input types should expose only MVP options');
assert(!ledger.includes('O/X') && !ledger.includes('체크'), 'academy input types should not expose O/X or check options');
```

- [ ] **Step 4: Run the test and confirm it describes current gaps**

Run:

```powershell
node tests/eie-grade-ledger-port.test.js
```

Expected: FAIL until dashboard and academy UI structure are adjusted, or PASS if previous work already satisfies the contract.

---

### Task 2: Clean Teacher Dashboard To One Grade Card

**Files:**
- Modify: `eie/js/views/eie-teacher.js`
- Test: `tests/eie-grade-ledger-port.test.js`

- [ ] **Step 1: Stop rendering the expanded grade card**

In `render()`, remove this concatenation:

```js
+ renderGradeInputCard()
```

The dashboard render body should flow like:

```js
return '<section class="eie-teacher-dashboard eie-v2-screen" data-eie-teacher-key="' + esc(normalizeName(_teacherName)) + '" aria-labelledby="eie-teacher-title">'
    + '<h1 id="eie-teacher-title" class="eie-teacher-sr-title">' + esc(_teacherName || '선생님') + ' 선생님 대시보드</h1>'
    + '<div class="eie-teacher-dashboard-shell">'
    + errorHtml
    + renderHomeHead(todayRows)
    + renderWeekdaySchedule()
    + '</div>'
    + '</section>';
```

- [ ] **Step 2: Add the grade quick card beside attendance**

Update `renderShortcutRow()` so it contains `성적표`:

```js
function renderShortcutRow() {
    return '<div class="eie-teacher-quick-cards eie-p-chip-row">'
        + '<button class="eie-teacher-quick-card eie-p-btn-cancel" type="button" onclick="EieTeacherView.openTimetable()">시간표</button>'
        + '<button class="eie-teacher-quick-card eie-p-btn-save" type="button" onclick="EieTeacherView.openClassroomList()">클래스룸</button>'
        + '<button class="eie-teacher-quick-card eie-p-btn-cancel" type="button" onclick="EieTeacherView.openAttendanceLedger()">출석부</button>'
        + '<button class="eie-teacher-quick-card eie-p-btn-cancel" type="button" onclick="EieTeacherView.openGradeLedger(\\'\\', \\'school\\')">성적표</button>'
        + '</div>';
}
```

- [ ] **Step 3: Keep `openGradeLedger` route behavior**

Ensure the public method defaults to `school`:

```js
openGradeLedger: function (cellId, mode) {
    if (window.EieGradeLedgerView && typeof EieGradeLedgerView.openLedger === 'function') {
        EieGradeLedgerView.openLedger({
            classId: cellId || '',
            mode: mode || 'school',
            teacherName: _teacherName,
            monthKey: new Date().toLocaleDateString('sv-SE').slice(0, 7)
        });
        return;
    }
    if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('grades');
}
```

- [ ] **Step 4: Verify dashboard tests**

Run:

```powershell
node --check eie/js/views/eie-teacher.js
node tests/eie-grade-ledger-port.test.js
```

Expected: syntax passes; dashboard card-only assertions pass.

---

### Task 3: Port AP MATH Grade Ledger Shell Into EIE

**Files:**
- Modify: `eie/js/views/eie-grade-ledger.js`
- Modify: `eie/css/eie.css`
- Test: `tests/eie-grade-ledger-port.test.js`

- [ ] **Step 1: Map AP MATH UI names to EIE names**

Use this mapping while editing:

```text
AP MATH                 EIE
openSchoolExamLedger    EieGradeLedgerView.openLedger / render
renderSchoolExamBatchTable renderSchoolTable
saveSchoolExamBatch     saveSchool
seb-tab-wrap            eie-grade-section-tabs or shared AP-like class
seb-ctrl                eie-grade-ctrl
seb-inp                 eie-grade-inp
#seb-tbl                .eie-grade-table
SEB_COLS                EIE_GRADE_COLS
```

- [ ] **Step 2: Make the top shell AP MATH-like**

The render output should include:

```js
return '<section id="eie-grade-main" class="eie-grade-ledger eie-v2-screen">'
    + '<div class="eie-panel">'
    + renderGradeHeader()
    + renderPrimaryTabs()
    + (_mode === 'academy' ? renderAcademy() : renderSchool())
    + '</div>'
    + '</section>';
```

- [ ] **Step 3: Header must match AP MATH flow**

Implement or adjust:

```js
function renderGradeHeader() {
    return '<div class="eie-grade-head">'
        + '<button type="button" class="eie-grade-title" onclick="EieGradeLedgerView.closeLedger()">성적표</button>'
        + '<div class="eie-grade-head-actions">'
        + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setYear(this.value)">' + yearOptions() + '</select>'
        + '<button type="button" id="eie-grade-save-btn" class="eie-grade-save-btn" onclick="EieGradeLedgerView.saveAll()" ' + (_saving ? 'disabled' : '') + '>' + (_saving ? '저장 중...' : '전체 저장') + '</button>'
        + '</div>'
        + '</div>';
}
```

- [ ] **Step 4: Primary tabs separate school and academy without changing style**

```js
function renderPrimaryTabs() {
    return '<div class="eie-grade-tabs">'
        + '<button type="button" class="' + (_mode === 'school' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setMode(\\'school\\')">학교성적</button>'
        + '<button type="button" class="' + (_mode === 'academy' ? 'is-active' : '') + '" onclick="EieGradeLedgerView.setMode(\\'academy\\')">원내평가</button>'
        + '</div>';
}
```

- [ ] **Step 5: Verify syntax**

Run:

```powershell
node --check eie/js/views/eie-grade-ledger.js
node tests/eie-grade-ledger-port.test.js
```

Expected: syntax passes; shell/tab assertions pass.

---

### Task 4: Make School Grades Match AP MATH Table Behavior

**Files:**
- Modify: `eie/js/views/eie-grade-ledger.js`
- Modify: `eie/css/eie.css`

- [ ] **Step 1: Keep AP MATH middle school header**

`renderSchoolTable()` must produce:

```js
var hRow1 = '<th rowspan="2" class="eie-grade-sticky-grade">학년</th>'
    + '<th rowspan="2" class="eie-grade-sticky-class">반</th>'
    + '<th rowspan="2" class="eie-grade-sticky-name">이름</th>'
    + '<th colspan="2" class="eie-grade-border2 eie-grade-semester-1">1학기</th>'
    + '<th colspan="2" class="eie-grade-border2 eie-grade-semester-2">2학기</th>';

var hRow2 = '<th class="eie-grade-border2 eie-grade-semester-1">중간</th>'
    + '<th class="eie-grade-semester-1">기말</th>'
    + '<th class="eie-grade-border2 eie-grade-semester-2">중간</th>'
    + '<th class="eie-grade-semester-2">기말</th>';
```

- [ ] **Step 2: Keep AP MATH high school subject rows**

High school rows must include `과목` as a sticky column and render one row per subject:

```js
var hRow1 = '<th rowspan="2" class="eie-grade-sticky-grade">학년</th>'
    + '<th rowspan="2" class="eie-grade-sticky-class">반</th>'
    + '<th rowspan="2" class="eie-grade-sticky-name">이름</th>'
    + '<th rowspan="2" class="eie-grade-sticky-subject">과목</th>'
    + '<th colspan="2" class="eie-grade-border2 eie-grade-semester-1">1학기</th>'
    + '<th colspan="2" class="eie-grade-border2 eie-grade-semester-2">2학기</th>';
```

- [ ] **Step 3: Preserve school save behavior**

`saveSchool()` must collect current visible school inputs:

```js
records.push({
    student_id: sid,
    class_id: _classId || classIdForStudent(student),
    exam_year: year,
    semester: col.semester,
    exam_type: col.examType,
    subject: subject || 'english',
    score: value === '' ? null : Number(value)
});
```

- [ ] **Step 4: Verify**

Run:

```powershell
node --check eie/js/views/eie-grade-ledger.js
node tests/eie-grade-ledger-port.test.js
```

Expected: school grade table assertions pass; existing save payload tests still pass.

---

### Task 5: Make Academy Use The Same Table UI With Test Columns

**Files:**
- Modify: `eie/js/views/eie-grade-ledger.js`
- Modify: `eie/css/eie.css`
- Test: `tests/eie-grade-ledger-port.test.js`

- [ ] **Step 1: Render academy controls in the shared filter area**

Use the same `eie-grade-controls` and `eie-grade-ctrl` classes:

```js
function renderAcademyControls() {
    return '<div class="eie-grade-controls">'
        + '<select class="eie-grade-ctrl" onchange="EieGradeLedgerView.setClassId(this.value)">' + classOptions() + '</select>'
        + '<input class="eie-grade-ctrl" type="month" value="' + esc(_monthKey || todayMonthKey()) + '" onchange="EieGradeLedgerView.setMonth(this.value)">'
        + '<button type="button" class="eie-grade-save-btn" onclick="EieGradeLedgerView.toggleTestPanel()">시험 추가</button>'
        + '</div>';
}
```

- [ ] **Step 2: Keep academy test type options limited**

The add-test UI must include only:

```html
<option value="score">점수</option>
<option value="fraction">점수/만점</option>
<option value="memo">메모</option>
```

- [ ] **Step 3: Render academy table with shared table/input classes**

`renderAcademyTable()` should use:

```js
return '<div class="eie-grade-table-wrap">'
    + '<table class="eie-grade-table eie-academy-table">'
    + '<thead><tr>'
    + '<th class="eie-grade-sticky-class">반</th>'
    + '<th class="eie-grade-sticky-name">이름</th>'
    + visibleTests.map(function (test) { return '<th>' + esc(test.title || test.name) + '</th>'; }).join('')
    + '</tr></thead>'
    + '<tbody>' + rows + '</tbody>'
    + '</table>'
    + '</div>';
```

Each editable cell must use `eie-grade-inp`.

- [ ] **Step 4: Preserve academy save/reload behavior**

For `fraction`, parse `18/20` into:

```js
{
    score: 18,
    max_score: 20,
    value: '18/20'
}
```

For `memo`, store the visible value as memo/payload text without adding numeric validation.

- [ ] **Step 5: Verify**

Run:

```powershell
node tests/eie-grade-ledger-port.test.js
node tests/eie-exam-records-mvp.test.js
```

Expected: academy input type, test add, save, upsert, and reload tests pass.

---

### Task 6: Align CSS To AP MATH Grade UI

**Files:**
- Modify: `eie/css/eie.css`

- [ ] **Step 1: Replace grade ledger CSS with AP MATH-like dimensions**

Use AP MATH-compatible values:

```css
.eie-grade-ledger .eie-panel {
    max-width: none;
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
}

.eie-grade-ctrl {
    min-height: 44px;
    border-radius: 12px;
    border: 1px solid var(--eie-border);
    background: var(--eie-surface-2);
    font-size: 13px;
    font-weight: 700;
}

.eie-grade-inp {
    width: 54px;
    height: 38px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
}
```

- [ ] **Step 2: Keep sticky table behavior AP MATH-like**

```css
.eie-grade-table-wrap {
    flex: 1;
    min-height: 0;
    overflow: auto;
    border: 1px solid var(--eie-border);
    border-radius: 14px;
    background: var(--eie-surface);
}

.eie-grade-table th {
    position: sticky;
    top: 0;
    height: 34px;
    z-index: 4;
}

.eie-grade-table thead tr:nth-child(2) th {
    top: 34px;
}
```

- [ ] **Step 3: Avoid separate academy visual language**

Do not add classes such as:

```css
.eie-academy-card {}
.eie-academy-dashboard {}
.eie-academy-hero {}
```

If academy-specific CSS is needed, it must only adjust column widths or sticky offsets.

- [ ] **Step 4: Verify CSS markers through tests**

Run:

```powershell
node tests/eie-grade-ledger-port.test.js
```

Expected: CSS/source assertions pass.

---

### Task 7: Final Verification And Result Report

**Files:**
- Modify: `CODEX_RESULT2.md`

- [ ] **Step 1: Run syntax checks**

```powershell
node --check eie/js/views/eie-teacher.js
node --check eie/js/views/eie-classroom.js
node --check eie/js/views/eie-students.js
node --check eie/js/views/eie-grade-ledger.js
node --check eie/js/eie-api.js
node --check workers/wangji-eie-worker/routes/eie.js
```

Expected: all exit code 0.

- [ ] **Step 2: Run regression tests**

```powershell
node tests/eie-students-click-handlers.test.js
node tests/eie-teacher-classroom-panel-route.test.js
node tests/eie-classroom-entry-api.test.js
node tests/eie-exam-records-mvp.test.js
node tests/eie-grade-ledger-port.test.js
```

Expected: all PASS.

- [ ] **Step 3: Append implementation result**

Append this section to `CODEX_RESULT2.md`:

```markdown
## AP MATH 성적표 UI 포팅 구현 결과

### 수정 파일

### 대시보드 정리 결과

### 학교성적 AP MATH UI 포팅 결과

### 원내평가 동일 UI 적용 결과

### 저장/재조회 결과

### 테스트 결과

### 브라우저 확인 결과

### 미확인 항목
```

- [ ] **Step 4: Inspect git status without committing**

```powershell
git status --short
```

Expected: modified/untracked files are visible; no commit or push is made.

---

## Self-Review

- Spec coverage: dashboard card-only, AP MATH UI port, school/academy tabs, same visual system for academy, input/edit/save/reload, and input type limits are covered.
- Scope guard: owner analytics, graphs, AI reports, unrelated classroom redesign, and student detail redesign are not included.
- Testability: source-level and VM-level tests cover dashboard structure, tab structure, allowed input types, academy test add, save, upsert, and reload restoration.
- Implementation order: tests first, dashboard cleanup second, shell/table port third, academy same-UI adaptation fourth, CSS alignment fifth, full verification last.
