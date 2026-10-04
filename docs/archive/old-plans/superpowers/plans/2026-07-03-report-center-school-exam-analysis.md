# Report Center School Exam Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `리포트 센터` the unified report entry, with `학교시험 분석` as the default first feature and support for archive-backed middle/final school exam analysis, student selection, and batch PDF-style printing.

**Architecture:** Extend the existing `apmath/js/report-center.js` modal system rather than creating a separate app. Reuse the archive assignment UX pattern conceptually (`시험지 선택 -> 반 선택 -> 학생 선택`) but build report-center-specific data helpers from `exam_sessions`, `wrong_answers`, `exam_blueprints`, `exam_question_reviews`, and `exam_analysis_meta`. Preserve existing daily/evaluation/counsel report flows as secondary menus.

**Tech Stack:** Plain browser JavaScript, existing APMS modal/overlay helpers, Node static contract tests in `tests/*.test.js`, existing report print HTML/CSS generation.

---

## Current Baseline After Recheck

`feat/report-center-redesign` is already merged. Do not build the drilldown from scratch.

Existing report-center primitives:

- `reportCenterAdvancedMode()` / `reportCenterSetAdvancedMode(enabled)`
- `reportCenterNavState()` / `reportCenterNavTo(level, params)`
- `reportCenterBuildExamHubList()`
- `reportCenterRenderExamHubList(studentId)`
- `reportCenterBuildExamDashboard(studentId, archiveFile)`
- `reportCenterBuildStudentView(studentId, archiveFile)`
- `reportCenterOpenStudentDrilldown(studentId, sessionId = '')`
- `reportCenterBuildDrilldownShell(studentId)`

Existing behavior:

- Default advanced mode is off.
- `openReportCenterModal(...)` renders the drilldown shell when advanced mode is off or `options.forceDrilldown` is true.
- Advanced mode still exposes the legacy `오늘 리포트 / 평가 리포트 / 상담 리포트` tabs.
- Student detail already calls `reportCenterOpenStudentDrilldown(key, sessionId || sessions[0].id || '')`.

Remaining work:

- Add a sidebar `리포트 센터` entry.
- Make the report-center first viewport explicitly say `리포트 센터` and expose the 4 internal menus with `학교시험 분석` first.
- Ensure sidebar first entry goes to school exam analysis even when advanced mode is true.
- Change archive-backed grouping from archive-only to school-exam identity (`archive_file + exam_date`, with `assignment_id` as optional support).
- Add class selection before student selection.
- Add multi-student selection and batch print with page breaks.
- Keep archive-less academy evaluations reachable through the legacy evaluation report menu.

Implementation note: when later task text says to add a new L0/L1/L2 helper, prefer adapting the existing function above first. Create parallel functions only when adaptation would make the current function unclear.

---

## File Structure

- Modify: `apmath/js/report-center.js`
  - Owns report center shell, menu routing, school exam grouping, L0/L1/L2 screens, single and batch print entry points.
- Modify: `apmath/js/student.js`
  - Routes student detail `리포트 출력` to school exam L2 when selected session has `archive_file`.
- Modify: `apmath/js/ui.js`
  - Adds sidebar `리포트 센터` entry in the `평가` section.
- Create: `tests/apmath-report-center-unified-entry.test.js`
  - Guards unified entry, default menu, archive-backed/legacy split, batch print contract, sidebar entry.
- Modify: `tests/apmath-student-grade-report-entry.test.js`
  - Updates student-detail report output expectation for archive-backed sessions while preserving legacy evaluation report output.
- Modify if needed: `tests/apmath-global-surface.test.js`, `tests/fixtures/apmath-surface-report.json`
  - Updates public report surface when new global report center functions are introduced.

---

### Task 1: Add Unified Report Center Contract Test

**Files:**
- Create: `tests/apmath-report-center-unified-entry.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/apmath-report-center-unified-entry.test.js`:

```js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const report = fs.readFileSync(path.join(root, 'apmath/js/report-center.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const student = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');

assert(report.includes('학교시험 분석'), 'report center must expose school exam analysis');
assert(report.includes('오늘 리포트'), 'daily report menu must remain');
assert(report.includes('평가 리포트'), 'legacy evaluation report menu must remain');
assert(report.includes('상담 리포트'), 'counsel report menu must remain');
assert(report.includes('function openReportCenterHome'), 'sidebar needs a student-optional report center entry');
assert(/openReportCenterModal\([^)]*activeMenu\s*=\s*'schoolExam'/.test(report) || report.includes("activeMenu = 'schoolExam'"), 'report center default must be schoolExam');
assert(report.includes('reportCenterGetSchoolExamGroups'), 'school exam archive grouping helper must exist');
assert(report.includes('reportCenterGetLegacyExamReportSessions'), 'archive-less evaluation helper must exist');
assert(report.includes('reportCenterOpenBatchPrintView'), 'batch print entry must exist');
assert(report.includes('report-center-batch-page'), 'batch print must force page breaks between students');
assert(ui.includes('리포트 센터') && ui.includes('openReportCenterHome'), 'sidebar must open report center');
assert(student.includes('openReportCenterStudentReportBySession'), 'student detail archive-backed report output must enter school exam report flow');

console.log('apmath report center unified entry test passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node tests/apmath-report-center-unified-entry.test.js
```

Expected: FAIL because the new helpers and sidebar entry do not exist yet.

- [ ] **Step 3: Commit**

```bash
git add tests/apmath-report-center-unified-entry.test.js
git commit -m "test: guard unified report center entry"
```

---

### Task 2: Convert Report Center Shell To Four Internal Menus

**Files:**
- Modify: `apmath/js/report-center.js`
- Test: `tests/apmath-report-center-unified-entry.test.js`

- [ ] **Step 1: Add menu helper and update shell**

In `apmath/js/report-center.js`, replace the local 3-tab array in `reportCenterBaseShell` with:

```js
function reportCenterGetMenuItems() {
    return [
        { key: 'schoolExam', label: '학교시험 분석' },
        { key: 'daily', label: '오늘 리포트' },
        { key: 'exam', label: '평가 리포트' },
        { key: 'counsel', label: '상담 리포트' }
    ];
}
```

Change `reportCenterBaseShell(studentId, activeTab, bodyHtml)` to `reportCenterBaseShell(studentId, activeMenu, bodyHtml, options = {})` and ensure:

```js
const student = studentId ? (state.db.students || []).find(s => String(s.id) === String(studentId)) : null;
const nameMeta = student ? `<div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">${reportCenterEscape(student.name || '학생')}</div>` : '';
const tabs = reportCenterGetMenuItems();
```

Header copy must be:

```html
<div style="font-size:20px; font-weight:800; color:var(--text); line-height:1.35;">리포트 센터</div>
<div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px; line-height:1.5;">학교시험 분석, 학생 리포트, 상담/발송 문구를 한 곳에서 관리합니다.</div>
```

Menu grid must use four columns on desktop:

```html
<div style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:6px; background:var(--bg); padding:4px; border-radius:14px;">
```

- [ ] **Step 2: Add student-optional entry and default route**

Replace `openReportCenterModal(studentId, activeTab = 'daily')` with:

```js
function openReportCenterHome(options = {}) {
    return openReportCenterModal(options.studentId || '', 'schoolExam', options);
}

function openReportCenterModal(studentId = '', activeMenu = 'schoolExam', options = {}) {
    if (activeMenu === 'schoolExam') return openReportCenterSchoolExam(options.groupKey || '', { ...options, studentId });
    if (activeMenu === 'exam') return openReportCenterExam(studentId, options.sessionId || '');
    if (activeMenu === 'counsel') return openReportCenterCounsel(studentId);
    if (activeMenu === 'daily') return openReportCenterDaily(studentId);
    return openReportCenterSchoolExam('', { ...options, studentId });
}
```

- [ ] **Step 3: Add temporary school exam stub**

Add this minimal stub so routing works before L0 implementation:

```js
function openReportCenterSchoolExam(groupKey = '', options = {}) {
    const body = '<div style="padding:34px 16px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700; background:var(--surface-2); border-radius:16px;">학교시험 분석을 준비 중입니다.</div>';
    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell(options.studentId || '', 'schoolExam', body, options));
}
```

- [ ] **Step 4: Run focused test**

Run:

```bash
node tests/apmath-report-center-unified-entry.test.js
```

Expected: still FAIL because data helpers and batch print are not implemented.

- [ ] **Step 5: Commit**

```bash
git add apmath/js/report-center.js
git commit -m "feat: add unified report center shell"
```

---

### Task 3: Add School Exam Data Helpers

**Files:**
- Modify: `apmath/js/report-center.js`
- Test: `tests/apmath-report-center-unified-entry.test.js`

- [ ] **Step 1: Implement archive-backed and legacy session helpers**

Add near the existing report center helper functions:

```js
function reportCenterHasArchiveFile(session) {
    return !!String(session?.archive_file || '').trim();
}

function reportCenterGetSchoolExamSessions() {
    return (state.db.exam_sessions || [])
        .filter(reportCenterHasArchiveFile)
        .sort((a, b) =>
            String(b.exam_date || '').localeCompare(String(a.exam_date || '')) ||
            String(b.id || '').localeCompare(String(a.id || '')));
}

function reportCenterGetLegacyExamReportSessions(studentId = '') {
    return (state.db.exam_sessions || [])
        .filter(session => !reportCenterHasArchiveFile(session))
        .filter(session => !studentId || String(session.student_id) === String(studentId))
        .sort((a, b) =>
            String(b.exam_date || '').localeCompare(String(a.exam_date || '')) ||
            String(b.id || '').localeCompare(String(a.id || '')));
}

function reportCenterMakeSchoolExamKey(session) {
    const archiveFile = String(session?.archive_file || '').trim();
    const examDate = String(session?.exam_date || '').trim();
    return `${archiveFile}::${examDate}`;
}
```

- [ ] **Step 2: Implement grouping helper**

Add:

```js
function reportCenterGetSessionWrongCount(sessionId) {
    return (state.db.wrong_answers || []).filter(w => String(w.session_id) === String(sessionId)).length;
}

function reportCenterGetExamAnalysisStatus(archiveFile) {
    const file = String(archiveFile || '').trim();
    if (!file) return { label: '분석 없음', reviewed: 0, total: 0, hasOverview: false };
    const candidates = reportCenterArchiveKeyCandidates(file);
    const blueprints = (state.db.exam_blueprints || []).filter(row => candidates.has(String(row.archive_file || '').trim()));
    const reviews = (state.db.exam_question_reviews || []).filter(row => candidates.has(String(row.archive_file || '').trim()));
    const meta = (state.db.exam_analysis_meta || []).find(row => candidates.has(String(row.archive_file || '').trim()));
    const total = blueprints.length;
    const reviewed = reviews.filter(row => String(row.review_text || '').trim()).length;
    const hasOverview = !!String(meta?.overview_text || '').trim();
    const label = total && reviewed >= total && hasOverview ? '문항 분석 완료' : reviewed || hasOverview ? '문항 분석 일부' : '문항 분석 대기';
    return { label, reviewed, total, hasOverview };
}

function reportCenterGetSchoolExamGroups() {
    const groups = new Map();
    reportCenterGetSchoolExamSessions().forEach(session => {
        const key = reportCenterMakeSchoolExamKey(session);
        if (!groups.has(key)) {
            groups.set(key, {
                key,
                archiveFile: String(session.archive_file || '').trim(),
                title: session.exam_title || '학교시험',
                examDate: session.exam_date || '',
                sessions: [],
                classIds: new Set(),
                takerCount: 0,
                wrongInputCount: 0,
                questionCount: Number(session.question_count || 0) || 0,
                analysisStatus: null
            });
        }
        const group = groups.get(key);
        group.sessions.push(session);
        if (session.class_id) group.classIds.add(String(session.class_id));
        group.takerCount += 1;
        group.wrongInputCount += reportCenterGetSessionWrongCount(session.id);
        if (!group.questionCount && Number(session.question_count || 0)) group.questionCount = Number(session.question_count || 0);
    });
    return Array.from(groups.values()).map(group => ({
        ...group,
        classIds: Array.from(group.classIds),
        analysisStatus: reportCenterGetExamAnalysisStatus(group.archiveFile)
    }));
}

function reportCenterGetSchoolExamGroupByKey(groupKey) {
    return reportCenterGetSchoolExamGroups().find(group => String(group.key) === String(groupKey)) || null;
}
```

- [ ] **Step 3: Run focused test**

Run:

```bash
node tests/apmath-report-center-unified-entry.test.js
```

Expected: still FAIL until batch print and sidebar are added.

- [ ] **Step 4: Commit**

```bash
git add apmath/js/report-center.js
git commit -m "feat: group archive-backed school exams"
```

---

### Task 4: Implement L0 School Exam List

**Files:**
- Modify: `apmath/js/report-center.js`

- [ ] **Step 1: Replace school exam stub**

Replace `openReportCenterSchoolExam` with:

```js
function reportCenterRenderSchoolExamEmpty() {
    return `
        <div style="padding:34px 16px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700; background:var(--surface-2); border-radius:16px; line-height:1.7;">
            <div style="color:var(--text); font-size:15px; margin-bottom:4px;">아카이브 시험지와 연결된 학교시험 기록이 없습니다.</div>
            <div>QR/오답 입력 또는 시험지 연결 후 학교시험 분석을 사용할 수 있습니다.</div>
        </div>`;
}

function reportCenterRenderSchoolExamList(groups) {
    if (!groups.length) return reportCenterRenderSchoolExamEmpty();
    return `
        <div style="display:flex; flex-direction:column; gap:10px;">
            ${groups.map(group => `
                <button class="btn" type="button" style="width:100%; text-align:left; padding:14px; border-radius:14px; background:var(--surface); border:1px solid var(--border); box-shadow:none;" onclick="openReportCenterSchoolExamDashboard('${escapeReportJsString(group.key)}')">
                    <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
                        <div style="min-width:0;">
                            <div style="font-size:15px; font-weight:800; color:var(--text); line-height:1.35; overflow-wrap:anywhere;">${reportCenterEscape(group.title)}</div>
                            <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">${reportCenterEscape(group.examDate || '-')} · ${reportCenterEscape(group.archiveFile)}</div>
                        </div>
                        <div style="font-size:12px; font-weight:800; color:var(--primary); white-space:nowrap;">분석 열기</div>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; margin-top:12px;">
                        <div><b>${group.takerCount}</b><span>명 응시</span></div>
                        <div><b>${group.classIds.length}</b><span>개 반</span></div>
                        <div><b>${group.wrongInputCount}</b><span>오답 입력</span></div>
                        <div><b>${reportCenterEscape(group.analysisStatus?.label || '문항 분석 대기')}</b><span>분석 상태</span></div>
                    </div>
                </button>
            `).join('')}
        </div>`;
}

function openReportCenterSchoolExam(groupKey = '', options = {}) {
    if (groupKey) return openReportCenterSchoolExamDashboard(groupKey);
    const groups = reportCenterGetSchoolExamGroups();
    const body = reportCenterRenderSchoolExamList(groups);
    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell(options.studentId || '', 'schoolExam', body, options));
}
```

- [ ] **Step 2: Add CSS safety for L0 metric cells inline or via style injection**

Add a small style injection inside `reportCenterEnsureWideOverlay` or use inline styles for metric cells so text does not overflow. Keep this scoped to report center.

- [ ] **Step 3: Run syntax check**

Run:

```bash
node --check apmath/js/report-center.js
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apmath/js/report-center.js
git commit -m "feat: render school exam analysis list"
```

---

### Task 5: Implement L1 Exam Dashboard And Class Rows

**Files:**
- Modify: `apmath/js/report-center.js`

- [ ] **Step 1: Add class grouping helpers**

Add:

```js
function reportCenterGetClassName(classId) {
    return (state.db.classes || []).find(cls => String(cls.id) === String(classId))?.name || '미배정';
}

function reportCenterGetGroupClasses(group) {
    const byClass = new Map();
    (group?.sessions || []).forEach(session => {
        const classId = String(session.class_id || apmsGetClassIdForStudent?.(session.student_id) || '');
        if (!byClass.has(classId)) byClass.set(classId, []);
        byClass.get(classId).push(session);
    });
    return Array.from(byClass.entries()).map(([classId, sessions]) => {
        const scores = sessions.map(s => Number(s.score)).filter(Number.isFinite);
        const avg = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;
        const wrongCount = sessions.reduce((sum, session) => sum + reportCenterGetSessionWrongCount(session.id), 0);
        return { classId, className: reportCenterGetClassName(classId), sessions, takerCount: sessions.length, avg, wrongCount };
    }).sort((a, b) => String(a.className).localeCompare(String(b.className), 'ko'));
}
```

- [ ] **Step 2: Add dashboard render**

Add:

```js
function openReportCenterSchoolExamDashboard(groupKey) {
    const group = reportCenterGetSchoolExamGroupByKey(groupKey);
    if (!group) return openReportCenterSchoolExam();
    const classes = reportCenterGetGroupClasses(group);
    const body = `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="font-size:12px; font-weight:800; color:var(--secondary);">리포트 센터 &gt; 학교시험 분석 &gt; 시험 대시보드</div>
            <div style="padding:14px; border-radius:14px; background:var(--surface); border:1px solid var(--border);">
                <div style="font-size:17px; font-weight:900; color:var(--text);">${reportCenterEscape(group.title)}</div>
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">${reportCenterEscape(group.examDate || '-')} · ${reportCenterEscape(group.archiveFile)}</div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px;">
                <div style="padding:12px; border-radius:12px; background:var(--surface-2);"><b>${group.takerCount}</b><div>응시 학생</div></div>
                <div style="padding:12px; border-radius:12px; background:var(--surface-2);"><b>${classes.length}</b><div>응시 반</div></div>
                <div style="padding:12px; border-radius:12px; background:var(--surface-2);"><b>${group.wrongInputCount}</b><div>오답 입력</div></div>
                <div style="padding:12px; border-radius:12px; background:var(--surface-2);"><b>${reportCenterEscape(group.analysisStatus?.label || '문항 분석 대기')}</b><div>문항 분석</div></div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${classes.map(row => `
                    <button class="btn" type="button" style="width:100%; min-height:54px; text-align:left; padding:12px 14px; border-radius:12px; background:var(--surface); border:1px solid var(--border); box-shadow:none;" onclick="openReportCenterStudentReport('${escapeReportJsString(group.key)}', '${escapeReportJsString(row.classId)}')">
                        <div style="display:flex; justify-content:space-between; gap:12px;">
                            <div><b>${reportCenterEscape(row.className)}</b><div style="font-size:12px; color:var(--secondary); margin-top:3px;">${row.takerCount}명 응시 · 평균 ${row.avg === null ? '-' : `${row.avg}점`} · 오답 ${row.wrongCount}개</div></div>
                            <span style="font-size:12px; color:var(--primary); font-weight:800;">학생 리포트</span>
                        </div>
                    </button>
                `).join('') || '<div style="padding:24px; text-align:center; color:var(--secondary); background:var(--surface-2); border-radius:14px;">응시 반이 없습니다.</div>'}
            </div>
            <button class="btn" type="button" onclick="openReportCenterSchoolExam()" style="min-height:42px;">시험지 목록으로</button>
        </div>`;
    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell('', 'schoolExam', body));
}
```

- [ ] **Step 3: Run syntax check**

Run:

```bash
node --check apmath/js/report-center.js
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apmath/js/report-center.js
git commit -m "feat: add school exam dashboard"
```

---

### Task 6: Implement L2 Student Picker

**Files:**
- Modify: `apmath/js/report-center.js`

- [ ] **Step 1: Add L2 state and group student helper**

Add:

```js
function reportCenterBatchSelectionStore() {
    if (!window.AP_REPORT_CENTER_BATCH_SELECTIONS) window.AP_REPORT_CENTER_BATCH_SELECTIONS = {};
    return window.AP_REPORT_CENTER_BATCH_SELECTIONS;
}

function reportCenterGetGroupClassStudents(group, classId) {
    const sessions = (group?.sessions || []).filter(session => String(session.class_id || '') === String(classId || ''));
    return sessions.map(session => {
        const student = (state.db.students || []).find(s => String(s.id) === String(session.student_id));
        return {
            studentId: String(session.student_id || ''),
            sessionId: String(session.id || ''),
            name: student?.name || '학생',
            score: session.score,
            wrongCount: reportCenterGetSessionWrongCount(session.id)
        };
    }).sort((a, b) => String(a.name).localeCompare(String(b.name), 'ko'));
}
```

- [ ] **Step 2: Add picker render and selection handlers**

Add:

```js
function reportCenterToggleReportStudent(groupKey, classId, studentId, checked) {
    const key = `${groupKey}::${classId}`;
    const store = reportCenterBatchSelectionStore();
    if (!store[key]) store[key] = new Set();
    if (checked) store[key].add(String(studentId)); else store[key].delete(String(studentId));
    openReportCenterStudentReport(groupKey, classId);
}

function reportCenterSelectAllReportStudents(groupKey, classId) {
    const group = reportCenterGetSchoolExamGroupByKey(groupKey);
    const students = reportCenterGetGroupClassStudents(group, classId);
    reportCenterBatchSelectionStore()[`${groupKey}::${classId}`] = new Set(students.map(s => s.studentId));
    openReportCenterStudentReport(groupKey, classId);
}

function reportCenterClearReportStudents(groupKey, classId) {
    reportCenterBatchSelectionStore()[`${groupKey}::${classId}`] = new Set();
    openReportCenterStudentReport(groupKey, classId);
}

function openReportCenterStudentReport(groupKey, classId = '', selectedStudentId = '') {
    const group = reportCenterGetSchoolExamGroupByKey(groupKey);
    if (!group) return openReportCenterSchoolExam();
    const classes = reportCenterGetGroupClasses(group);
    const activeClassId = classId || classes[0]?.classId || '';
    const students = reportCenterGetGroupClassStudents(group, activeClassId);
    const storeKey = `${groupKey}::${activeClassId}`;
    const store = reportCenterBatchSelectionStore();
    if (!store[storeKey]) store[storeKey] = new Set(selectedStudentId ? [String(selectedStudentId)] : students.map(s => s.studentId));
    if (selectedStudentId) store[storeKey] = new Set([String(selectedStudentId)]);
    const selected = store[storeKey];
    const body = `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="font-size:12px; font-weight:800; color:var(--secondary);">리포트 센터 &gt; 학교시험 분석 &gt; 학생 리포트</div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${classes.map(row => `<button class="btn ${String(row.classId) === String(activeClassId) ? 'btn-primary' : ''}" type="button" onclick="openReportCenterStudentReport('${escapeReportJsString(groupKey)}', '${escapeReportJsString(row.classId)}')" style="min-height:38px;">${reportCenterEscape(row.className)} ${row.takerCount}명</button>`).join('')}
            </div>
            ${students.length ? `
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
                    <div style="font-size:13px; color:var(--secondary); font-weight:800;">선택 ${selected.size}명 / 응시 ${students.length}명</div>
                    <div style="display:flex; gap:6px;">
                        <button class="btn" type="button" onclick="reportCenterSelectAllReportStudents('${escapeReportJsString(groupKey)}','${escapeReportJsString(activeClassId)}')">전체 선택</button>
                        <button class="btn" type="button" onclick="reportCenterClearReportStudents('${escapeReportJsString(groupKey)}','${escapeReportJsString(activeClassId)}')">선택 해제</button>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:8px;">
                    ${students.map(row => `
                        <label style="display:flex; gap:8px; align-items:flex-start; padding:12px; border-radius:12px; background:var(--surface); border:1px solid var(--border);">
                            <input type="checkbox" ${selected.has(row.studentId) ? 'checked' : ''} onchange="reportCenterToggleReportStudent('${escapeReportJsString(groupKey)}','${escapeReportJsString(activeClassId)}','${escapeReportJsString(row.studentId)}', this.checked)">
                            <span><b>${reportCenterEscape(row.name)}</b><span style="display:block; font-size:12px; color:var(--secondary); margin-top:3px;">${reportCenterEscape(row.score ?? '-')}점 · ${row.wrongCount ? `오답 ${row.wrongCount}개` : '오답 없음'}</span></span>
                        </label>`).join('')}
                </div>
                <button class="btn btn-primary" type="button" ${selected.size ? '' : 'disabled'} onclick="reportCenterOpenBatchPrintView('${escapeReportJsString(groupKey)}','${escapeReportJsString(activeClassId)}', Array.from(reportCenterBatchSelectionStore()['${escapeReportJsString(storeKey)}'] || []))" style="min-height:48px;">선택 학생 리포트 출력</button>
            ` : '<div style="padding:28px; text-align:center; color:var(--secondary); background:var(--surface-2); border-radius:14px; font-weight:700;">이 반에는 아직 해당 시험 응시 기록이 없습니다.</div>'}
        </div>`;
    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell(selectedStudentId || '', 'schoolExam', body));
}
```

- [ ] **Step 3: Run syntax check**

Run:

```bash
node --check apmath/js/report-center.js
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apmath/js/report-center.js
git commit -m "feat: add school exam student picker"
```

---

### Task 7: Implement Batch Print

**Files:**
- Modify: `apmath/js/report-center.js`
- Test: `tests/apmath-report-center-unified-entry.test.js`

- [ ] **Step 1: Add batch print CSS and shell**

Add:

```js
function reportCenterBuildBatchPrintShell(bodyHtml) {
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>학교시험 학생별 리포트</title>
<style>
body{margin:0;background:#f8fafc;color:#111827;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}
.report-center-batch-page{break-after:page;page-break-after:always;}
.report-center-batch-page:last-child{break-after:auto;page-break-after:auto;}
@media print{body{background:#fff}.report-center-batch-page{break-after:page;page-break-after:always}.report-center-batch-page:last-child{break-after:auto;page-break-after:auto}}
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}
```

- [ ] **Step 2: Add batch document builder**

Add:

```js
function reportCenterBuildBatchPrintDocument(items, options = {}) {
    return items.map(item => {
        const html = reportCenterBuildCleanPdfDocument(item.studentId, item.sessionId, {
            teacherMemo: options.teacherMemo || '',
            studioState: null,
            aiAnalysis: reportCenterGetCachedAiAnalysis(item.sessionId)
        });
        return `<section class="report-center-batch-page">${html}</section>`;
    }).join('');
}

function reportCenterOpenBatchPrintView(groupKey, classId, studentIds = []) {
    const group = reportCenterGetSchoolExamGroupByKey(groupKey);
    if (!group) return;
    const rows = reportCenterGetGroupClassStudents(group, classId)
        .filter(row => studentIds.map(String).includes(String(row.studentId)));
    if (!rows.length) {
        toast('출력할 학생을 선택하세요.', 'warn');
        return;
    }
    const items = rows.map(row => ({ studentId: row.studentId, sessionId: row.sessionId }));
    const win = window.open('', '_blank');
    if (!win) {
        toast('팝업이 차단되었습니다. 브라우저 팝업 허용 후 다시 시도하세요.', 'warn');
        return;
    }
    win.document.open();
    win.document.write(reportCenterBuildBatchPrintShell(reportCenterBuildBatchPrintDocument(items)));
    win.document.close();
    setTimeout(() => { try { win.focus(); win.print(); } catch (e) {} }, 400);
}
```

- [ ] **Step 3: Run focused test**

Run:

```bash
node tests/apmath-report-center-unified-entry.test.js
```

Expected: still FAIL until sidebar/student route work is done; batch assertions should pass.

- [ ] **Step 4: Commit**

```bash
git add apmath/js/report-center.js
git commit -m "feat: add batch school exam report print"
```

---

### Task 8: Split Legacy Evaluation Report Sessions

**Files:**
- Modify: `apmath/js/report-center.js`
- Test: `tests/report-exam-trend.test.mjs`

- [ ] **Step 1: Filter `openReportCenterExam` to archive-less sessions**

In `openReportCenterExam(studentId, selectedSessionId = '')`, replace the sessions source with:

```js
const sessions = reportCenterGetLegacyExamReportSessions(studentId);
```

If `selectedSessionId` points to an archive-backed session, do not force it into this list. That route should be handled by `openReportCenterStudentReportBySession`.

- [ ] **Step 2: Update empty text**

Replace the empty state body text with:

```html
<div style="padding:34px 16px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700; background:var(--surface-2); border-radius:16px; line-height:1.7;">
    <div style="color:var(--text); font-size:15px; margin-bottom:4px;">일반 원내평가 기록이 없습니다.</div>
    <div>학교시험지는 학교시험 분석 메뉴에서 확인하세요.</div>
</div>
```

- [ ] **Step 3: Run report regression tests**

Run:

```bash
node tests/report-exam-trend.test.mjs
node tests/apmath-report-easy-language.test.js
```

Expected: PASS. If they fail because they intentionally use archive-backed mock sessions for legacy report builders, adjust helper use so pure builder tests still work while UI selection is archive-less.

- [ ] **Step 4: Commit**

```bash
git add apmath/js/report-center.js
git commit -m "feat: keep archive-less evaluation reports as secondary menu"
```

---

### Task 9: Route Student Detail Report Output To School Exam L2

**Files:**
- Modify: `apmath/js/report-center.js`
- Modify: `apmath/js/student.js`
- Modify: `tests/apmath-student-grade-report-entry.test.js`

- [ ] **Step 1: Add session wrapper in report center**

Add:

```js
function openReportCenterStudentReportBySession(studentId, sessionId) {
    const session = (state.db.exam_sessions || []).find(row => String(row.id) === String(sessionId));
    if (!session) {
        toast('출력할 평가 기록이 없습니다.', 'warn');
        return;
    }
    if (!reportCenterHasArchiveFile(session)) return openReportCenterExam(studentId, sessionId);
    const groupKey = reportCenterMakeSchoolExamKey(session);
    const classId = String(session.class_id || apmsGetClassIdForStudent?.(studentId) || '');
    return openReportCenterStudentReport(groupKey, classId, studentId);
}
```

- [ ] **Step 2: Update student detail route**

In `apmath/js/student.js`, update `openStudentReportOutputFromDetail`:

```js
function openStudentReportOutputFromDetail(sid, sessionId = '') {
    const key = String(sid || '');
    const sessions = getStudentAcademyExamSessionsForDetail(key);
    if (!sessions.length) {
        toast('출력할 평가 기록이 없습니다.', 'warn');
        return;
    }
    const targetSessionId = sessionId || sessions[0].id || '';
    if (typeof openReportCenterStudentReportBySession === 'function') {
        openReportCenterStudentReportBySession(key, targetSessionId);
        return;
    }
    if (typeof openReportCenterExam === 'function') {
        openReportCenterExam(key, targetSessionId);
        return;
    }
    toast('리포트 출력 화면을 열 수 없습니다.', 'warn');
}
```

- [ ] **Step 3: Update student test expectations**

In `tests/apmath-student-grade-report-entry.test.js`, replace the assertion that requires direct `openReportCenterExam(key, sessionId || sessions[0].id || '')` with:

```js
assert(
  student.includes('openReportCenterStudentReportBySession(key, targetSessionId)') &&
    student.includes('openReportCenterExam(key, targetSessionId)'),
  'student grade tab should route archive-backed report output through report center student report flow and preserve legacy fallback'
);
```

- [ ] **Step 4: Run tests**

Run:

```bash
node tests/apmath-student-grade-report-entry.test.js
node tests/apmath-report-center-unified-entry.test.js
```

Expected: PASS except sidebar/global surface if not completed.

- [ ] **Step 5: Commit**

```bash
git add apmath/js/report-center.js apmath/js/student.js tests/apmath-student-grade-report-entry.test.js
git commit -m "feat: route student report output through school exam reports"
```

---

### Task 10: Add Sidebar Entry

**Files:**
- Modify: `apmath/js/ui.js`
- Test: `tests/apmath-report-center-unified-entry.test.js`

- [ ] **Step 1: Add drawer item**

In `buildDrawerMenu(roleKey)`, in the teacher drawer `평가` section, add `리포트 센터` as the first item:

```js
${drawerItem('report', '리포트 센터', "closeAppDrawer(); if(typeof openReportCenterHome==='function') openReportCenterHome(); else toast('리포트 센터를 불러오지 못했습니다.', 'warn');")}
```

Keep existing `학교성적`, `원내평가`, `OMR 입력`.

- [ ] **Step 2: Run focused test**

Run:

```bash
node tests/apmath-report-center-unified-entry.test.js
```

Expected: PASS unless global surface needs fixture update.

- [ ] **Step 3: Commit**

```bash
git add apmath/js/ui.js
git commit -m "feat: add report center sidebar entry"
```

---

### Task 11: Update Global Surface And Onclick Guards

**Files:**
- Modify if needed: `tests/fixtures/apmath-surface-report.json`
- Test: `tests/apmath-global-surface.test.js`
- Test: `tests/apmath-onclick-defined.test.js`

- [ ] **Step 1: Run surface guard**

Run:

```bash
node tests/apmath-global-surface.test.js
```

Expected: May FAIL because new global functions are present.

- [ ] **Step 2: If failure is only report surface additions, update fixture**

Run the repo's established update mode only if the diff is limited to report-center additions:

```bash
node tests/apmath-global-surface.test.js --update
```

Then inspect the diff and ensure no unrelated student/classroom/dashboard fixture changed.

- [ ] **Step 3: Run onclick guard**

Run:

```bash
node tests/apmath-onclick-defined.test.js
```

Expected: PASS. If FAIL, add missing global functions or fix onclick names; do not silence the test.

- [ ] **Step 4: Commit**

```bash
git add tests/fixtures/apmath-surface-report.json
git commit -m "test: update report center public surface"
```

Skip commit if no fixture changed.

---

### Task 12: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Syntax checks**

Run:

```bash
node --check apmath/js/report-center.js
node --check apmath/js/student.js
node --check apmath/js/ui.js
```

Expected: PASS.

- [ ] **Step 2: Focused tests**

Run:

```bash
node tests/apmath-report-center-unified-entry.test.js
node tests/apmath-student-grade-report-entry.test.js
node tests/report-exam-trend.test.mjs
node tests/apmath-report-easy-language.test.js
node tests/apmath-global-surface.test.js
node tests/apmath-onclick-defined.test.js
```

Expected: PASS.

- [ ] **Step 3: Full non-quarantined test run**

Run:

```bash
node tools/run-tests.js
```

Expected: PASS with quarantined tests skipped.

- [ ] **Step 4: Browser verification**

Verify these real flows when a browser/local server is available:

1. Sidebar -> `리포트 센터` opens `학교시험 분석` first.
2. Internal menus show `학교시험 분석 / 오늘 리포트 / 평가 리포트 / 상담 리포트`.
3. School exam list only includes `archive_file` sessions.
4. Exam dashboard shows question analysis status and class rows.
5. Student report screen lists only takers for the selected class/exam.
6. Selecting multiple students opens one print document with page breaks between students.
7. Student detail `리포트 출력` for archive-backed session opens `리포트 센터 > 학교시험 분석 > 학생 리포트`.
8. Archive-less evaluation sessions remain reachable through `평가 리포트`.

If browser verification cannot be performed, report exactly:

```text
REAL BROWSER E2E: NOT VERIFIED
Reason:
```

- [ ] **Step 5: Final commit**

```bash
git add apmath/js/report-center.js apmath/js/student.js apmath/js/ui.js tests/apmath-report-center-unified-entry.test.js tests/apmath-student-grade-report-entry.test.js tests/fixtures/apmath-surface-report.json
git commit -m "feat: unify report center school exam analysis"
```

Only include files that actually changed.

---

## Self-Review Checklist

- [ ] `학교시험 분석` is first and default.
- [ ] Existing daily/evaluation/counsel flows remain accessible.
- [ ] `archive_file` sessions and archive-less sessions are separated.
- [ ] Student picker lists takers only.
- [ ] Batch print uses page breaks between students.
- [ ] Student detail uses school exam L2 for archive-backed sessions.
- [ ] Sidebar has one `리포트 센터` entry.
- [ ] No DB schema or API changes.
- [ ] No separate app or separate school-exam sidebar product surface.
