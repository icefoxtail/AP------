# Teacher Assistant Memos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add quiet 1-3 line assistant memos inside the teacher dashboard Today Schedule card, using existing data only.

**Architecture:** Create a small browser-global helper file for memo candidate generation, rendering, and per-day hide state. Keep `apmath/js/dashboard.js` responsible only for inserting the memo block into the existing Today Schedule card. Use localStorage for UI-only hidden memo state; do not mutate attendance, homework, class records, or journal data.

**Tech Stack:** Plain JavaScript, existing AP Math browser globals, Node `assert` tests, CSS in `apmath/css/dashboard-foundation.css`.

---

## File Structure

- Create: `apmath/js/dashboard-assistant-memos.js`
  - Owns pure helper functions for candidate generation.
  - Exposes browser globals used by dashboard inline handlers.
  - Stores hidden memo IDs in `localStorage`.
- Modify: `apmath/index.html`
  - Load the helper before `js/dashboard.js`.
- Modify: `apmath/js/dashboard.js`
  - Insert rendered memo HTML inside Today Schedule only.
  - Avoid toast calls for memo interactions.
- Modify: `apmath/css/dashboard-foundation.css`
  - Add neutral compact styling for memo rows, details, and `숨김` button.
- Create: `tests/dashboard-assistant-memos.test.js`
  - Contract tests for journal day, holiday exclusion, absent memo, homework memo, record gap memo, hide state, and no-toast contract.
- Modify if needed: `tests/apmath-onclick-defined.test.js`
  - No direct change expected; use it to catch missing global handlers after adding inline onclicks.

---

### Task 1: Add Failing Contract Tests

**Files:**
- Create: `tests/dashboard-assistant-memos.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/dashboard-assistant-memos.test.js`:

```js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const helperPath = path.join(root, 'apmath/js/dashboard-assistant-memos.js');

function loadHelper(storage = {}) {
  const context = {
    console,
    window: {},
    localStorage: {
      getItem(key) { return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null; },
      setItem(key, value) { storage[key] = String(value); },
      removeItem(key) { delete storage[key]; }
    }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(helperPath, 'utf8'), context, { filename: helperPath });
  return context;
}

const baseDb = {
  students: [
    { id: 1, name: '김민준', grade: '중2', status: '재원' },
    { id: 2, name: '황시아', grade: '중1', status: '재원' },
    { id: 3, name: '박정원', grade: '중3', status: '재원' }
  ],
  classes: [
    { id: 10, name: '중2A', teacher_name: '박준성', is_active: 1 },
    { id: 20, name: '중1A', teacher_name: '박준성', is_active: 1 }
  ],
  class_students: [
    { class_id: 10, student_id: 1 },
    { class_id: 20, student_id: 2 },
    { class_id: 20, student_id: 3 }
  ],
  attendance_history: [
    { class_id: 10, student_id: 1, date: '2026-06-10', status: '결석' }
  ],
  homework_history: [
    { student_id: 2, date: '2026-06-08', status: '미제출' },
    { student_id: 2, date: '2026-06-10', status: '미완료' },
    { student_id: 3, date: '2026-06-08', status: '미제출' },
    { student_id: 3, date: '2026-06-10', status: '미제출' }
  ],
  class_daily_records: [],
  academy_schedules: []
};

const scheduledClasses = [
  { id: 10, name: '중2A' },
  { id: 20, name: '중1A' }
];

{
  const ctx = loadHelper();
  const memos = ctx.buildDashboardAssistantMemos({
    todayStr: '2026-06-17',
    dayKey: 'wed',
    teacherName: '박준성',
    db: baseDb,
    scheduledClasses,
    isHoliday: false,
    previousClassDateById: { 10: '2026-06-10', 20: '2026-06-10' }
  });
  assert.strictEqual(memos[0].text, '김민준(중2) 지난 시간에 결석했어요. 보강 확인하세요.');
  assert(memos.some(m => m.text === '오늘은 일지를 제출하는 날이에요.'));
  assert(memos.some(m => m.text === '중2A 지난 수업 진도 기록이 비어 있어요.'));
  assert(memos.length <= 3);
}

{
  const ctx = loadHelper();
  const memos = ctx.buildDashboardAssistantMemos({
    todayStr: '2026-06-18',
    dayKey: 'thu',
    teacherName: '박준성',
    db: baseDb,
    scheduledClasses,
    isHoliday: true,
    previousClassDateById: { 10: '2026-06-10', 20: '2026-06-10' }
  });
  assert(!memos.some(m => m.type === 'journal-day'), 'journal memo must not show on holidays');
}

{
  const ctx = loadHelper();
  const memos = ctx.buildDashboardAssistantMemos({
    todayStr: '2026-06-19',
    dayKey: 'fri',
    teacherName: '박준성',
    db: baseDb,
    scheduledClasses,
    isHoliday: false,
    previousClassDateById: { 10: '2026-06-10', 20: '2026-06-10' }
  });
  const homework = memos.find(m => m.type === 'homework-repeat');
  assert(homework.text.includes('황시아(중1), 박정원(중3)'));
  assert(!homework.text.includes('외'));
}

{
  const storage = {};
  const ctx = loadHelper(storage);
  ctx.hideDashboardAssistantMemo('2026-06-17', 'absence:10:1:2026-06-10');
  const visible = ctx.filterHiddenDashboardAssistantMemos('2026-06-17', [
    { id: 'absence:10:1:2026-06-10', text: 'hidden' },
    { id: 'record-gap:10:2026-06-10', text: 'shown' }
  ]);
  assert.deepStrictEqual(visible.map(m => m.text), ['shown']);
}

{
  const source = fs.readFileSync(helperPath, 'utf8');
  assert(!/toast\s*\(/.test(source), 'assistant memo interactions must not call toast');
}

console.log('dashboard assistant memos contract test passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node tests/dashboard-assistant-memos.test.js
```

Expected: FAIL with `ENOENT` or `buildDashboardAssistantMemos is not defined` because the helper file does not exist yet.

- [ ] **Step 3: Commit failing test**

```bash
git add tests/dashboard-assistant-memos.test.js
git commit -m "test: cover teacher assistant memo contracts"
```

---

### Task 2: Implement Memo Generation and Hide State

**Files:**
- Create: `apmath/js/dashboard-assistant-memos.js`

- [ ] **Step 1: Add minimal helper implementation**

Create `apmath/js/dashboard-assistant-memos.js`:

```js
(function () {
  const MAX_MEMOS = 3;
  const STORAGE_PREFIX = 'apmath.dashboardAssistantMemos.hidden.';
  const JOURNAL_DAYS = new Set(['wed', 'thu']);
  const ABSENT_TEXTS = new Set(['결석', '欠席']);
  const HOMEWORK_MISSING_RE = /미제출|미완료|미수행|누락|안\s*함|missing|incomplete/i;

  function str(value) {
    return String(value == null ? '' : value).trim();
  }

  function escapeHtml(value) {
    return str(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function normalizeId(value) {
    return str(value);
  }

  function formatStudent(student) {
    const name = str(student && student.name) || '학생';
    const grade = str(student && student.grade);
    return grade ? `${name}(${grade})` : name;
  }

  function rowsForClass(db, classId) {
    return (db.class_students || []).filter(row => normalizeId(row.class_id) === normalizeId(classId));
  }

  function findStudent(db, studentId) {
    return (db.students || []).find(student => normalizeId(student.id) === normalizeId(studentId));
  }

  function hasMakeupAfter(db, studentId, dateStr) {
    const sid = normalizeId(studentId);
    const start = str(dateStr).slice(0, 10);
    if (!sid || !start) return false;
    return (db.attendance_history || db.attendance || []).some(row => {
      if (normalizeId(row.student_id) !== sid) return false;
      const rowDate = str(row.date || row.created_at || row.updated_at).slice(0, 10);
      if (!rowDate || rowDate < start) return false;
      const hay = `${str(row.status)} ${str(row.tags)} ${str(row.memo)}`;
      return hay.includes('보강') || /makeup/i.test(hay);
    }) || (db.academy_schedules || []).some(row => {
      if (normalizeId(row.student_id) !== sid) return false;
      const rowDate = str(row.schedule_date || row.date).slice(0, 10);
      if (!rowDate || rowDate < start) return false;
      const hay = `${str(row.schedule_type)} ${str(row.title)} ${str(row.memo)}`;
      return hay.includes('보강') || /makeup/i.test(hay);
    });
  }

  function buildAbsenceMemos(input) {
    const db = input.db || {};
    const previousByClass = input.previousClassDateById || {};
    const memos = [];
    (input.scheduledClasses || []).forEach(cls => {
      const classId = normalizeId(cls.id);
      const previousDate = str(previousByClass[classId]).slice(0, 10);
      if (!classId || !previousDate) return;
      rowsForClass(db, classId).forEach(map => {
        const student = findStudent(db, map.student_id);
        if (!student) return;
        const absent = (db.attendance_history || db.attendance || []).some(row => {
          return normalizeId(row.class_id) === classId &&
            normalizeId(row.student_id) === normalizeId(student.id) &&
            str(row.date).slice(0, 10) === previousDate &&
            ABSENT_TEXTS.has(str(row.status));
        });
        if (!absent) return;
        if (hasMakeupAfter(db, student.id, previousDate)) return;
        memos.push({
          id: `absence:${classId}:${normalizeId(student.id)}:${previousDate}`,
          type: 'absence',
          priority: 10,
          text: `${formatStudent(student)} 지난 시간에 결석했어요. 보강 확인하세요.`,
          detail: `지난 수업: ${str(cls.name)} · ${previousDate}`
        });
      });
    });
    return memos;
  }

  function buildRecordGapMemos(input) {
    const db = input.db || {};
    const previousByClass = input.previousClassDateById || {};
    return (input.scheduledClasses || []).map(cls => {
      const classId = normalizeId(cls.id);
      const previousDate = str(previousByClass[classId]).slice(0, 10);
      if (!classId || !previousDate) return null;
      const record = (db.class_daily_records || []).find(row =>
        normalizeId(row.class_id) === classId &&
        str(row.date).slice(0, 10) === previousDate &&
        str(row.content || row.progress || row.memo || row.summary)
      );
      if (record) return null;
      return {
        id: `record-gap:${classId}:${previousDate}`,
        type: 'record-gap',
        priority: 30,
        text: `${str(cls.name)} 지난 수업 진도 기록이 비어 있어요.`,
        detail: `지난 수업: ${str(cls.name)} · ${previousDate}`
      };
    }).filter(Boolean);
  }

  function buildHomeworkMemo(input) {
    const db = input.db || {};
    const studentIds = new Set();
    (input.scheduledClasses || []).forEach(cls => {
      rowsForClass(db, cls.id).forEach(row => studentIds.add(normalizeId(row.student_id)));
    });
    const counts = new Map();
    (db.homework_history || db.homework || []).forEach(row => {
      const sid = normalizeId(row.student_id);
      if (!studentIds.has(sid)) return;
      const hay = `${str(row.status)} ${str(row.result)} ${str(row.memo)}`;
      if (!HOMEWORK_MISSING_RE.test(hay)) return;
      counts.set(sid, (counts.get(sid) || 0) + 1);
    });
    const students = Array.from(counts.entries())
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sid]) => findStudent(db, sid))
      .filter(Boolean);
    if (!students.length) return [];
    return [{
      id: `homework-repeat:${students.map(s => normalizeId(s.id)).join('-')}`,
      type: 'homework-repeat',
      priority: 40,
      text: `${students.map(formatStudent).join(', ')} 숙제 미제출이 이어지고 있어요.`,
      detail: '최근 숙제 기록 기준'
    }];
  }

  function buildJournalDayMemo(input) {
    if (input.isHoliday) return [];
    if (!JOURNAL_DAYS.has(str(input.dayKey))) return [];
    return [{
      id: `journal-day:${str(input.todayStr)}`,
      type: 'journal-day',
      priority: 20,
      text: '오늘은 일지를 제출하는 날이에요.',
      detail: ''
    }];
  }

  function hiddenKey(dateStr) {
    return STORAGE_PREFIX + str(dateStr).slice(0, 10);
  }

  function readHiddenIds(dateStr) {
    try {
      const raw = window.localStorage && window.localStorage.getItem(hiddenKey(dateStr));
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed.map(str) : []);
    } catch (e) {
      return new Set();
    }
  }

  function writeHiddenIds(dateStr, ids) {
    try {
      if (window.localStorage) window.localStorage.setItem(hiddenKey(dateStr), JSON.stringify(Array.from(ids)));
    } catch (e) {}
  }

  function filterHiddenDashboardAssistantMemos(dateStr, memos) {
    const hidden = readHiddenIds(dateStr);
    return (memos || []).filter(memo => !hidden.has(str(memo.id)));
  }

  function hideDashboardAssistantMemo(dateStr, memoId) {
    const hidden = readHiddenIds(dateStr);
    hidden.add(str(memoId));
    writeHiddenIds(dateStr, hidden);
  }

  function buildDashboardAssistantMemos(input) {
    const candidates = []
      .concat(buildAbsenceMemos(input))
      .concat(buildJournalDayMemo(input))
      .concat(buildRecordGapMemos(input))
      .concat(buildHomeworkMemo(input));
    const unique = [];
    const seen = new Set();
    candidates.sort((a, b) => a.priority - b.priority).forEach(memo => {
      if (!memo || seen.has(memo.id)) return;
      seen.add(memo.id);
      unique.push(memo);
    });
    return unique.slice(0, MAX_MEMOS);
  }

  function renderDashboardAssistantMemos(todayStr, memos) {
    const visible = filterHiddenDashboardAssistantMemos(todayStr, memos);
    if (!visible.length) return '';
    return `<div class="ap-assistant-memos" data-date="${escapeHtml(todayStr)}">${visible.map(memo => `
      <div class="ap-assistant-memo" data-memo-id="${escapeHtml(memo.id)}" onclick="apDashToggleAssistantMemo(event, this)">
        <div class="ap-assistant-memo__text">${escapeHtml(memo.text)}</div>
        <div class="ap-assistant-memo__details">
          ${memo.detail ? `<div class="ap-assistant-memo__detail">${escapeHtml(memo.detail)}</div>` : ''}
          <button type="button" class="ap-assistant-memo__hide" onclick="apDashHideAssistantMemo(event, '${escapeHtml(todayStr)}', '${escapeHtml(memo.id)}')">숨김</button>
        </div>
      </div>
    `).join('')}</div>`;
  }

  function apDashToggleAssistantMemo(event, el) {
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    document.querySelectorAll('.ap-assistant-memo.is-open').forEach(node => {
      if (node !== el) node.classList.remove('is-open');
    });
    el.classList.toggle('is-open');
  }

  function apDashHideAssistantMemo(event, dateStr, memoId) {
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    hideDashboardAssistantMemo(dateStr, memoId);
    const node = event && event.target ? event.target.closest('.ap-assistant-memo') : null;
    if (node) node.remove();
    document.querySelectorAll('.ap-assistant-memos').forEach(wrap => {
      if (!wrap.querySelector('.ap-assistant-memo')) wrap.remove();
    });
  }

  window.buildDashboardAssistantMemos = buildDashboardAssistantMemos;
  window.renderDashboardAssistantMemos = renderDashboardAssistantMemos;
  window.filterHiddenDashboardAssistantMemos = filterHiddenDashboardAssistantMemos;
  window.hideDashboardAssistantMemo = hideDashboardAssistantMemo;
  window.apDashToggleAssistantMemo = apDashToggleAssistantMemo;
  window.apDashHideAssistantMemo = apDashHideAssistantMemo;
})();
```

- [ ] **Step 2: Run contract test**

Run:

```bash
node tests/dashboard-assistant-memos.test.js
```

Expected: PASS.

- [ ] **Step 3: Commit helper**

```bash
git add apmath/js/dashboard-assistant-memos.js tests/dashboard-assistant-memos.test.js
git commit -m "feat: add teacher assistant memo helper"
```

---

### Task 3: Load Helper and Insert Memos Into Today Schedule

**Files:**
- Modify: `apmath/index.html:1008-1009`
- Modify: `apmath/js/dashboard.js`

- [ ] **Step 1: Add helper script before dashboard.js**

In `apmath/index.html`, load the new helper immediately before `js/dashboard.js`:

```html
    <script defer src="js/dashboard-admin.js"></script>
    <script defer src="js/dashboard-teacher.js"></script>
    <script defer src="js/dashboard-assistant-memos.js"></script>
    <script defer src="js/dashboard.js"></script>
```

- [ ] **Step 2: Add dashboard adapter helpers**

In `apmath/js/dashboard.js`, near the existing dashboard helper functions, add:

```js
function dashboardGetPreviousScheduledDateForClass(cls, todayStr) {
    const today = dashboardDateFromLocalString(todayStr);
    if (!cls || !today) return '';
    const classDays = dashboardGetClassDayKeys(cls);
    if (!classDays.length) return '';
    for (let offset = 1; offset <= 14; offset += 1) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
        const dateStr = dashboardDateStringFromDate(d);
        if (isDashboardHoliday(dateStr)) continue;
        const key = DASHBOARD_DAY_INDEX_TO_KEY[d.getDay()];
        if (classDays.includes(key)) return dateStr;
    }
    return '';
}

function renderDashboardAssistantMemoBlock(todayStr, todayClasses) {
    if (typeof buildDashboardAssistantMemos !== 'function' || typeof renderDashboardAssistantMemos !== 'function') return '';
    const today = dashboardDateFromLocalString(todayStr) || new Date();
    const dayKey = DASHBOARD_DAY_INDEX_TO_KEY[today.getDay()];
    const previousClassDateById = {};
    (todayClasses || []).forEach(cls => {
        previousClassDateById[String(cls.id)] = dashboardGetPreviousScheduledDateForClass(cls, todayStr);
    });
    const memos = buildDashboardAssistantMemos({
        todayStr,
        dayKey,
        teacherName: state?.ui?.userName || state?.auth?.name || '',
        db: state?.db || {},
        scheduledClasses: todayClasses || [],
        isHoliday: isDashboardHoliday(todayStr),
        previousClassDateById
    });
    return renderDashboardAssistantMemos(todayStr, memos);
}
```

- [ ] **Step 3: Pass today classes into the memo block**

In the function that builds the Today Schedule card, find the local `todayStr` and scheduled class calculation. Add:

```js
const todayClassesForAssistant = (state?.db?.classes || []).filter(cls => {
    if (Number(cls?.is_active) === 0) return false;
    if (!isClassVisibleForCurrentTeacher(cls)) return false;
    return isClassScheduledOnDateForDashboard(cls.id, todayStr);
});
const assistantMemoHtml = renderDashboardAssistantMemoBlock(todayStr, todayClassesForAssistant);
```

Then append `assistantMemoHtml` inside `todayBodyHtml` for both non-empty and empty states:

```js
const todayBodyHtml = todayMemos.length
    ? `<div class="ap-dashboard-surface-list ap-dashboard-surface-list--today" onclick="openTodoMemoModal()" style="cursor:pointer; overflow:hidden; border-radius:6px; border:1px solid var(--border); background:var(--surface);">${todayHtml}</div>${assistantMemoHtml}`
    : `<div class="ap-empty-state">
            <span class="ap-empty-icon">${iconCalendar}</span>
            <p>오늘 등록된 일정이 없습니다.</p>
            <button type="button" class="ap-inline-btn ap-inline-btn--ghost" onclick="apDashToggleScheduleForm(this)">+ 일정 추가</button>
       </div>
       <div id="ap-dash-inline-form" class="ap-inline-form" style="display:none;">
            <input type="date" id="ap-dash-inline-date" value="${todayStr}">
            <input type="text" id="ap-dash-inline-content" placeholder="일정 내용"
                   onkeydown="if(event.key==='Enter') apDashSaveInlineSchedule();">
            <button type="button" class="ap-inline-btn" onclick="apDashSaveInlineSchedule()">저장</button>
       </div>${assistantMemoHtml}`;
```

Use the existing Korean strings in the file if the local encoding shows them differently; do not rewrite unrelated text.

- [ ] **Step 4: Run onclick contract test**

Run:

```bash
node tests/apmath-onclick-defined.test.js
```

Expected: PASS. This catches missing `apDashToggleAssistantMemo` and `apDashHideAssistantMemo`.

- [ ] **Step 5: Run memo contract test**

Run:

```bash
node tests/dashboard-assistant-memos.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit integration**

```bash
git add apmath/index.html apmath/js/dashboard.js apmath/js/dashboard-assistant-memos.js tests/dashboard-assistant-memos.test.js
git commit -m "feat: show assistant memos in today schedule"
```

---

### Task 4: Style the Assistant Memos Quietly

**Files:**
- Modify: `apmath/css/dashboard-foundation.css`

- [ ] **Step 1: Add neutral memo styles**

Add near the Today Schedule dashboard styles:

```css
body.ap-teacher-dashboard-mode .ap-dash-redesign .ap-assistant-memos {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

body.ap-teacher-dashboard-mode .ap-dash-redesign .ap-assistant-memo {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
  padding: 9px 12px;
  cursor: pointer;
  box-sizing: border-box;
}

body.ap-teacher-dashboard-mode .ap-dash-redesign .ap-assistant-memo__text {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

body.ap-teacher-dashboard-mode .ap-dash-redesign .ap-assistant-memo__details {
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 7px;
}

body.ap-teacher-dashboard-mode .ap-dash-redesign .ap-assistant-memo.is-open .ap-assistant-memo__details {
  display: flex;
}

body.ap-teacher-dashboard-mode .ap-dash-redesign .ap-assistant-memo__detail {
  min-width: 0;
  color: var(--secondary);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.35;
}

body.ap-teacher-dashboard-mode .ap-dash-redesign .ap-assistant-memo__hide {
  flex-shrink: 0;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
```

- [ ] **Step 2: Add outside-click collapse behavior**

In `apmath/js/dashboard-assistant-memos.js`, add one document click listener inside the IIFE:

```js
  if (typeof document !== 'undefined') {
    document.addEventListener('click', function (event) {
      if (event.target && event.target.closest && event.target.closest('.ap-assistant-memo')) return;
      document.querySelectorAll('.ap-assistant-memo.is-open').forEach(node => node.classList.remove('is-open'));
    });
  }
```

- [ ] **Step 3: Run no-toast and onclick tests**

Run:

```bash
node tests/dashboard-assistant-memos.test.js
node tests/apmath-onclick-defined.test.js
```

Expected: both PASS.

- [ ] **Step 4: Commit styling**

```bash
git add apmath/css/dashboard-foundation.css apmath/js/dashboard-assistant-memos.js
git commit -m "style: keep assistant memos quiet"
```

---

### Task 5: Browser Smoke Test

**Files:**
- No new files expected.

- [ ] **Step 1: Start local server**

Run:

```bash
python -m http.server 8766 --bind 127.0.0.1 --directory apmath
```

Expected: server starts. If port is busy, use `8767`.

- [ ] **Step 2: Open local app**

Open:

```text
http://127.0.0.1:8766/
```

Expected: login screen loads without console errors from `dashboard-assistant-memos.js`.

- [ ] **Step 3: Verify dashboard with a teacher login**

Log in with a teacher account available in the local environment.

Expected:
- Today Schedule card still appears.
- Assistant memo area appears only when candidates exist.
- Memo area shows 1-3 lines.
- Clicking a memo reveals `숨김`.
- Clicking outside closes the details.
- Clicking `숨김` removes that memo without a toast.
- Refresh keeps hidden memo hidden for that date.
- Wednesday/Thursday journal memo appears only on non-holiday days.

- [ ] **Step 4: Commit final verification adjustments if needed**

If visual spacing needs a small adjustment:

```bash
git add apmath/css/dashboard-foundation.css
git commit -m "fix: tune assistant memo spacing"
```

---

## Self-Review

- Spec coverage:
  - 1-3 lines only: Task 2 `MAX_MEMOS = 3`.
  - Existing data only: Task 2 reads `attendance_history`, `homework_history`, `class_daily_records`, `academy_schedules`, and schedule/class mappings.
  - Today Schedule only: Task 3 inserts only into `todayBodyHtml`.
  - No extra teacher input: no forms are added.
  - Memo click does not hide immediately: Task 2 toggles details; hide requires `숨김`.
  - Outside click collapses: Task 4 adds document click listener.
  - Toast minimized: Task 1 no-toast contract and Task 2 no toast calls.
  - Wednesday/Thursday journal memo, holidays excluded: Task 2 `buildJournalDayMemo`.
- Placeholder scan:
  - No TBD/TODO placeholders.
  - Each task has exact files and commands.
- Type consistency:
  - `buildDashboardAssistantMemos`, `renderDashboardAssistantMemos`, `hideDashboardAssistantMemo`, `filterHiddenDashboardAssistantMemos`, `apDashToggleAssistantMemo`, and `apDashHideAssistantMemo` are defined before use.
